import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { TransactionDialog } from "@/components/TransactionDialog";
import { useFinance } from "@/lib/finance-store";
import type { Transaction } from "@/lib/finance-data";
import { brl, fullDate } from "@/lib/format";

export const Route = createFileRoute("/transactions")({
  head: () => ({
    meta: [
      { title: "Transações — Minhas Contas" },
      {
        name: "description",
        content: "Liste, filtre, edite e exclua as suas transações financeiras por período e categoria.",
      },
      { property: "og:title", content: "Transações — Minhas Contas" },
      {
        property: "og:description",
        content: "Todos os seus lançamentos organizados por período e categoria.",
      },
    ],
  }),
  component: TransactionsPage,
});

const selectClass =
  "rounded-lg border border-border bg-card/80 px-3 py-2 text-sm text-ink outline-none focus:border-mint";

function TransactionsPage() {
  const { transactions, categories, accounts, removeTransaction } = useFinance();
  const [period, setPeriod] = useState("2024-11");
  const [categoryId, setCategoryId] = useState("todas");
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [open, setOpen] = useState(false);

  const periods = Array.from(new Set(transactions.map((t) => t.date.slice(0, 7)))).sort().reverse();

  const filtered = transactions
    .filter((t) => (period === "todos" ? true : t.date.startsWith(period)))
    .filter((t) => (categoryId === "todas" ? true : t.categoryId === categoryId))
    .sort((a, b) => b.date.localeCompare(a.date));

  const total = filtered.reduce((s, t) => s + (t.type === "receita" ? t.amount : -t.amount), 0);

  return (
    <AppShell title="Transações" subtitle="Todos os lançamentos registrados">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <select className={selectClass} value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="todos">Todos os períodos</option>
          {periods.map((p) => (
            <option key={p} value={p}>
              {p.split("-").reverse().join("/")}
            </option>
          ))}
        </select>
        <select
          className={selectClass}
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="todas">Todas as categorias</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <span className="num text-sm text-ink-soft">
          {filtered.length} lançamentos · resultado {brl(total)}
        </span>
        <button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          className="ml-auto rounded-lg bg-mint px-3.5 py-2 text-sm font-medium text-card transition-transform hover:scale-[1.02]"
        >
          Nova Transação
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl paper">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 text-left text-[11px] uppercase tracking-[0.14em] text-ink-faint">
              <th className="px-6 py-3 font-medium">Data</th>
              <th className="px-6 py-3 font-medium">Descrição</th>
              <th className="px-6 py-3 font-medium">Categoria</th>
              <th className="px-6 py-3 font-medium">Conta</th>
              <th className="px-6 py-3 text-right font-medium">Valor</th>
              <th className="px-6 py-3 text-right font-medium">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filtered.map((t) => (
              <tr key={t.id} className="transition-colors hover:bg-card/60">
                <td className="num whitespace-nowrap px-6 py-3 text-ink-soft">{fullDate(t.date)}</td>
                <td className="px-6 py-3 font-medium">{t.description}</td>
                <td className="px-6 py-3 text-ink-soft">
                  {categories.find((c) => c.id === t.categoryId)?.name ?? "—"}
                </td>
                <td className="px-6 py-3 text-ink-soft">
                  {accounts.find((a) => a.id === t.accountId)?.name ?? "—"}
                </td>
                <td
                  className={`num whitespace-nowrap px-6 py-3 text-right font-medium ${
                    t.type === "receita" ? "text-mint-deep" : "text-clay"
                  }`}
                >
                  {t.type === "receita" ? "+ " : "− "}
                  {brl(t.amount)}
                </td>
                <td className="whitespace-nowrap px-6 py-3 text-right">
                  <button
                    onClick={() => {
                      setEditing(t);
                      setOpen(true);
                    }}
                    className="text-sm font-medium text-mint-deep hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => removeTransaction(t.id)}
                    className="ml-4 text-sm font-medium text-clay hover:underline"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-ink-faint">
                  Nenhuma transação para os filtros selecionados.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <TransactionDialog open={open} onOpenChange={setOpen} editing={editing} />
    </AppShell>
  );
}
