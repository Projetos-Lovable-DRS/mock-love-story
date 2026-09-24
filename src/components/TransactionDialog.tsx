import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFinance } from "@/lib/finance-store";
import type { Transaction, TransactionType } from "@/lib/finance-data";

const fieldClass =
  "w-full rounded-lg border border-border bg-card/80 px-3 py-2 text-sm text-ink outline-none focus:border-mint";
const labelClass = "text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint";

export function TransactionDialog({
  open,
  onOpenChange,
  editing,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing?: Transaction | null;
}) {
  const { categories, accounts, addTransaction, updateTransaction } = useFinance();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<TransactionType>("despesa");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? "");
  const [date, setDate] = useState("2024-11-18");

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setDescription(editing.description);
      setAmount(String(editing.amount));
      setType(editing.type);
      setCategoryId(editing.categoryId);
      setAccountId(editing.accountId);
      setDate(editing.date);
    } else {
      setDescription("");
      setAmount("");
      setType("despesa");
      setCategoryId(categories.find((c) => c.type === "despesa")?.id ?? "");
      setAccountId(accounts[0]?.id ?? "");
      setDate("2024-11-18");
    }
  }, [open, editing, categories, accounts]);

  const submit = () => {
    const payload = {
      description: description.trim() || "Sem descrição",
      amount: Number(amount.replace(",", ".")) || 0,
      type,
      categoryId,
      accountId,
      date,
    };
    if (editing) updateTransaction(editing.id, payload);
    else addTransaction(payload);
    onOpenChange(false);
  };

  const visibleCategories = categories.filter((c) => c.type === type);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle className="font-display text-lg font-medium">
            {editing ? "Editar transação" : "Nova transação"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className={labelClass}>Descrição</label>
            <input
              className={`${fieldClass} mt-1.5`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mercado São Jorge"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Tipo</label>
              <select
                className={`${fieldClass} mt-1.5`}
                value={type}
                onChange={(e) => {
                  const next = e.target.value as TransactionType;
                  setType(next);
                  setCategoryId(categories.find((c) => c.type === next)?.id ?? "");
                }}
              >
                <option value="despesa">Despesa</option>
                <option value="receita">Receita</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Valor (R$)</label>
              <input
                className={`${fieldClass} num mt-1.5`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0,00"
                inputMode="decimal"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Categoria</label>
              <select
                className={`${fieldClass} mt-1.5`}
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                {visibleCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Conta</label>
              <select
                className={`${fieldClass} mt-1.5`}
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
              >
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Data</label>
            <input
              type="date"
              className={`${fieldClass} mt-1.5`}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <button
            onClick={() => onOpenChange(false)}
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
  );
}
