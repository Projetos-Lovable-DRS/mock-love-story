import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useFinance } from "@/lib/finance-store";
import { CURRENT_MONTH } from "@/lib/finance-data";
import { brl, shortDate } from "@/lib/format";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Painel — Minhas Contas" },
      {
        name: "description",
        content: "Visão geral do mês: saldo total, receitas, despesas e gastos por categoria.",
      },
      { property: "og:title", content: "Painel — Minhas Contas" },
      {
        property: "og:description",
        content: "Acompanhe saldo, receitas e despesas do mês em um painel único.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { transactions, accounts, categories } = useFinance();

  const monthTx = transactions.filter((t) => t.date.startsWith(CURRENT_MONTH));
  const receitas = monthTx.filter((t) => t.type === "receita").reduce((s, t) => s + t.amount, 0);
  const despesas = monthTx.filter((t) => t.type === "despesa").reduce((s, t) => s + t.amount, 0);
  const saldoTotal = accounts.reduce((s, a) => s + a.balance, 0);

  const porCategoria = categories
    .filter((c) => c.type === "despesa")
    .map((c) => ({
      name: c.name,
      total: monthTx
        .filter((t) => t.type === "despesa" && t.categoryId === c.id)
        .reduce((s, t) => s + t.amount, 0),
    }))
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total);

  const maiorCategoria = porCategoria[0]?.total ?? 1;

  const recentes = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 7);

  const orcamento = 12650;
  const restante = orcamento - despesas;

  return (
    <AppShell title="Painel" subtitle="Novembro de 2024 · visão geral das suas finanças">
      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl paper p-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint">
            Saldo Total
          </p>
          <p className="num mt-3 font-display text-[34px] font-medium leading-none tracking-tight">
            {brl(saldoTotal)}
          </p>
          <p className="num mt-3 text-sm text-mint-deep">
            {brl(receitas - despesas)} <span className="text-ink-faint">de resultado no mês</span>
          </p>
        </div>
        <div className="rounded-2xl paper p-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint">
            Receitas do Mês
          </p>
          <p className="num mt-3 font-display text-[34px] font-medium leading-none tracking-tight">
            {brl(receitas)}
          </p>
          <p className="num mt-3 text-sm text-ink-soft">
            {monthTx.filter((t) => t.type === "receita").length} lançamentos{" "}
            <span className="text-ink-faint">registrados</span>
          </p>
        </div>
        <div className="rounded-2xl paper p-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint">
            Despesas do Mês
          </p>
          <p className="num mt-3 font-display text-[34px] font-medium leading-none tracking-tight">
            {brl(despesas)}
          </p>
          <p className="num mt-3 text-sm text-clay">
            {Math.round((despesas / orcamento) * 100)}%{" "}
            <span className="text-ink-faint">do orçamento</span>
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl paper">
            <div className="flex items-center justify-between border-b border-card/60 px-6 py-4">
              <div>
                <h2 className="font-display text-lg font-medium">Lançamentos recentes</h2>
                <p className="text-sm text-ink-soft">Novembro · últimos registros</p>
              </div>
              <Link
                to="/transactions"
                className="text-sm font-medium text-mint-deep transition-transform hover:scale-[1.03]"
              >
                Ver tudo
              </Link>
            </div>
            <div className="divide-y divide-border/60">
              {recentes.map((t) => {
                const cat = categories.find((c) => c.id === t.categoryId)?.name ?? "—";
                const isReceita = t.type === "receita";
                return (
                  <div
                    key={t.id}
                    className="flex items-center gap-4 px-6 py-3.5 transition-colors hover:bg-card/60"
                  >
                    <div
                      className={`grid size-9 shrink-0 place-items-center rounded-[10px] font-display text-sm font-medium ${
                        isReceita ? "bg-mint/10 text-mint-deep" : "bg-ink/5 text-ink"
                      }`}
                    >
                      {t.description[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{t.description}</p>
                      <p className="text-xs text-ink-faint">
                        {shortDate(t.date)} · {cat}
                      </p>
                    </div>
                    <p
                      className={`num shrink-0 text-sm font-medium ${
                        isReceita ? "text-mint-deep" : "text-clay"
                      }`}
                    >
                      {isReceita ? "+ " : "− "}
                      {brl(t.amount)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          <div className="rounded-2xl paper p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-medium">Gastos por categoria</h2>
              <span className="num text-sm text-ink-soft">{brl(despesas)}</span>
            </div>
            <div className="mt-5 space-y-4">
              {porCategoria.map((c) => (
                <div key={c.name}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ink">{c.name}</span>
                    <span className="num text-ink-soft">{brl(c.total)}</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-ink/5">
                    <div
                      className="h-2 rounded-full bg-mint"
                      style={{ width: `${Math.max(8, (c.total / maiorCategoria) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-2xl paper p-5">
            <h2 className="font-display text-lg font-medium">Orçamento do mês</h2>
            <p className="mt-2 text-sm text-ink-soft">
              Restam <span className="num font-medium text-ink">{brl(restante)}</span> do limite de{" "}
              <span className="num text-ink">{brl(orcamento)}</span>.
            </p>
            <div className="mt-3 h-2 rounded-full bg-ink/5">
              <div
                className="h-2 rounded-full bg-gold"
                style={{ width: `${Math.min(100, (despesas / orcamento) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
