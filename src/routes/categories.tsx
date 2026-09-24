import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFinance } from "@/lib/finance-store";
import type { Category, TransactionType } from "@/lib/finance-data";
import { brl } from "@/lib/format";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Categorias — Minhas Contas" },
      {
        name: "description",
        content: "Crie e organize as categorias usadas para classificar receitas e despesas.",
      },
      { property: "og:title", content: "Categorias — Minhas Contas" },
      {
        property: "og:description",
        content: "Organize receitas e despesas por categoria.",
      },
    ],
  }),
  component: CategoriesPage,
});

const fieldClass =
  "w-full rounded-lg border border-border bg-card/80 px-3 py-2 text-sm text-ink outline-none focus:border-mint";
const labelClass = "text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint";

function CategoriesPage() {
  const { categories, transactions, addCategory, updateCategory, removeCategory } = useFinance();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [type, setType] = useState<TransactionType>("despesa");

  useEffect(() => {
    if (!open) return;
    setName(editing?.name ?? "");
    setType(editing?.type ?? "despesa");
  }, [open, editing]);

  const submit = () => {
    const payload = { name: name.trim() || "Nova categoria", type };
    if (editing) updateCategory(editing.id, payload);
    else addCategory(payload);
    setOpen(false);
  };

  return (
    <AppShell title="Categorias" subtitle="Organize receitas e despesas por categoria">
      <div className="mb-5 flex items-center gap-3">
        <span className="text-sm text-ink-soft">{categories.length} categorias cadastradas</span>
        <button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          className="ml-auto rounded-lg bg-mint px-3.5 py-2 text-sm font-medium text-card transition-transform hover:scale-[1.02]"
        >
          Nova Categoria
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl paper">
        <div className="divide-y divide-border/60">
          {categories.map((c) => {
            const total = transactions
              .filter((t) => t.categoryId === c.id)
              .reduce((s, t) => s + t.amount, 0);
            return (
              <div
                key={c.id}
                className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-card/60"
              >
                <div
                  className={`grid size-9 shrink-0 place-items-center rounded-[10px] font-display text-sm font-medium ${
                    c.type === "receita" ? "bg-mint/10 text-mint-deep" : "bg-gold/10 text-gold"
                  }`}
                >
                  {c.name[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-ink-faint">
                    {c.type === "receita" ? "Receita" : "Despesa"}
                  </p>
                </div>
                <p className="num text-sm text-ink-soft">{brl(total)}</p>
                <div className="flex items-center gap-4 text-sm">
                  <button
                    onClick={() => {
                      setEditing(c);
                      setOpen(true);
                    }}
                    className="font-medium text-mint-deep hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => removeCategory(c.id)}
                    className="font-medium text-clay hover:underline"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-card sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-medium">
              {editing ? "Editar categoria" : "Nova categoria"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Nome</label>
              <input
                className={`${fieldClass} mt-1.5`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Educação"
              />
            </div>
            <div>
              <label className={labelClass}>Tipo</label>
              <select
                className={`${fieldClass} mt-1.5`}
                value={type}
                onChange={(e) => setType(e.target.value as TransactionType)}
              >
                <option value="despesa">Despesa</option>
                <option value="receita">Receita</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-ink-soft hover:text-ink"
            >
              Cancelar
            </button>
            <button
              onClick={submit}
              className="rounded-lg bg-mint px-3.5 py-2 text-sm font-medium text-card transition-transform hover:scale-[1.02]"
            >
              Salvar
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
