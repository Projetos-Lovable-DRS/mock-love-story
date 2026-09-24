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
import type { Account } from "@/lib/finance-data";
import { brl } from "@/lib/format";

export const Route = createFileRoute("/accounts")({
  head: () => ({
    meta: [
      { title: "Contas — Minhas Contas" },
      {
        name: "description",
        content: "Gerencie suas contas e carteiras e acompanhe o saldo de cada uma.",
      },
      { property: "og:title", content: "Contas — Minhas Contas" },
      {
        property: "og:description",
        content: "Contas bancárias e carteiras com saldos atualizados.",
      },
    ],
  }),
  component: AccountsPage,
});

const fieldClass =
  "w-full rounded-lg border border-border bg-card/80 px-3 py-2 text-sm text-ink outline-none focus:border-mint";
const labelClass = "text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint";

function AccountsPage() {
  const { accounts, addAccount, updateAccount, removeAccount } = useFinance();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Account | null>(null);
  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("");
  const [balance, setBalance] = useState("");

  useEffect(() => {
    if (!open) return;
    setName(editing?.name ?? "");
    setInstitution(editing?.institution ?? "");
    setBalance(editing ? String(editing.balance) : "");
  }, [open, editing]);

  const total = accounts.reduce((s, a) => s + a.balance, 0);

  const submit = () => {
    const payload = {
      name: name.trim() || "Nova conta",
      institution: institution.trim() || "—",
      balance: Number(balance.replace(",", ".")) || 0,
    };
    if (editing) updateAccount(editing.id, payload);
    else addAccount(payload);
    setOpen(false);
  };

  return (
    <AppShell title="Contas" subtitle="Suas contas e carteiras com os respectivos saldos">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <span className="num text-sm text-ink-soft">
          {accounts.length} contas · saldo total {brl(total)}
        </span>
        <button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          className="ml-auto rounded-lg bg-mint px-3.5 py-2 text-sm font-medium text-card transition-transform hover:scale-[1.02]"
        >
          Nova Conta
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {accounts.map((a) => (
          <div key={a.id} className="rounded-2xl paper p-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint">
              {a.institution}
            </p>
            <h2 className="mt-2 font-display text-lg font-medium">{a.name}</h2>
            <p className="num mt-3 font-display text-[28px] font-medium leading-none tracking-tight">
              {brl(a.balance)}
            </p>
            <div className="mt-5 flex items-center gap-4 text-sm">
              <button
                onClick={() => {
                  setEditing(a);
                  setOpen(true);
                }}
                className="font-medium text-mint-deep hover:underline"
              >
                Editar
              </button>
              <button
                onClick={() => removeAccount(a.id)}
                className="font-medium text-clay hover:underline"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-card sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-medium">
              {editing ? "Editar conta" : "Nova conta"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Nome</label>
              <input
                className={`${fieldClass} mt-1.5`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Conta Corrente"
              />
            </div>
            <div>
              <label className={labelClass}>Instituição</label>
              <input
                className={`${fieldClass} mt-1.5`}
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="Banco do Brasil"
              />
            </div>
            <div>
              <label className={labelClass}>Saldo (R$)</label>
              <input
                className={`${fieldClass} num mt-1.5`}
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                inputMode="decimal"
                placeholder="0,00"
              />
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
