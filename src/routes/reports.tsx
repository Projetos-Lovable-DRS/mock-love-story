import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/AppShell";
import { useFinance } from "@/lib/finance-store";
import { brl } from "@/lib/format";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Relatórios — Minhas Contas" },
      {
        name: "description",
        content: "Gráficos de receitas versus despesas, evolução do saldo e resumo por categoria.",
      },
      { property: "og:title", content: "Relatórios — Minhas Contas" },
      {
        property: "og:description",
        content: "Acompanhe a evolução das suas finanças com gráficos claros.",
      },
    ],
  }),
  component: ReportsPage,
});

const monthNames: Record<string, string> = {
  "09": "Set",
  "10": "Out",
  "11": "Nov",
};

function ReportsPage() {
  const { transactions, categories } = useFinance();
  const [period, setPeriod] = useState("3");

  const months = Array.from(new Set(transactions.map((t) => t.date.slice(0, 7))))
    .sort()
    .slice(-Number(period));

  const series = months.map((m) => {
    const receitas = transactions
      .filter((t) => t.date.startsWith(m) && t.type === "receita")
      .reduce((s, t) => s + t.amount, 0);
    const despesas = transactions
      .filter((t) => t.date.startsWith(m) && t.type === "despesa")
      .reduce((s, t) => s + t.amount, 0);
    return { mes: monthNames[m.slice(5)] ?? m, receitas, despesas };
  });

  let running = 0;
  const saldoSeries = series.map((s) => {
    running += s.receitas - s.despesas;
    return { mes: s.mes, saldo: running };
  });

  const resumo = categories
    .map((c) => ({
      name: c.name,
      type: c.type,
      total: transactions
        .filter((t) => t.categoryId === c.id && months.some((m) => t.date.startsWith(m)))
        .reduce((s, t) => s + t.amount, 0),
    }))
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total);

  const tooltipStyle = {
    borderRadius: 12,
    border: "1px solid var(--border)",
    background: "var(--card)",
    fontSize: 12,
  };

  return (
    <AppShell title="Relatórios" subtitle="Evolução das suas finanças ao longo do tempo">
      <div className="mb-5 flex items-center gap-3">
        <select
          className="rounded-lg border border-border bg-card/80 px-3 py-2 text-sm text-ink outline-none focus:border-mint"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        >
          <option value="3">Últimos 3 meses</option>
          <option value="2">Últimos 2 meses</option>
          <option value="1">Mês atual</option>
        </select>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl paper p-5">
          <h2 className="font-display text-lg font-medium">Receitas vs Despesas</h2>
          <div className="mt-5 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={series}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="mes" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={70} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => brl(v)} />
                <Bar dataKey="receitas" fill="var(--mint)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="despesas" fill="var(--clay)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl paper p-5">
          <h2 className="font-display text-lg font-medium">Evolução do saldo</h2>
          <div className="mt-5 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={saldoSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="mes" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={70} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => brl(v)} />
                <Line
                  type="monotone"
                  dataKey="saldo"
                  stroke="var(--mint-deep)"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl paper">
        <div className="border-b border-border/60 px-6 py-4">
          <h2 className="font-display text-lg font-medium">Resumo por categoria</h2>
        </div>
        <div className="divide-y divide-border/60">
          {resumo.map((c) => (
            <div key={c.name} className="flex items-center gap-4 px-6 py-3.5">
              <p className="flex-1 text-sm font-medium">{c.name}</p>
              <span className="text-xs text-ink-faint">
                {c.type === "receita" ? "Receita" : "Despesa"}
              </span>
              <p
                className={`num text-sm font-medium ${
                  c.type === "receita" ? "text-mint-deep" : "text-clay"
                }`}
              >
                {brl(c.total)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
