import { Link, useRouter } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { useFinance } from "@/lib/finance-store";
import { TransactionDialog } from "@/components/TransactionDialog";

const navItems = [
  { to: "/dashboard", label: "Painel" },
  { to: "/transactions", label: "Transações" },
  { to: "/accounts", label: "Contas" },
  { to: "/categories", label: "Categorias" },
  { to: "/reports", label: "Relatórios" },
  { to: "/settings", label: "Configurações" },
] as const;

export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const { profile } = useFinance();
  const router = useRouter();
  const pathname = router.state.location.pathname;
  const [open, setOpen] = useState(false);

  const initials = profile.name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  return (
    <div className="page-wash min-h-screen">
      <header className="sticky top-0 z-30 border-b border-card/60 bg-card/55 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-5 gap-y-3 px-6 py-3">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="grid size-8 place-items-center rounded-[10px] bg-mint text-card shadow-sm">
              <span className="font-display text-sm font-semibold leading-none">M</span>
            </div>
            <span className="font-display text-[17px] font-semibold tracking-tight">
              Minhas Contas
            </span>
          </Link>

          <nav className="flex flex-wrap items-center gap-1 text-sm">
            {navItems.map((item) => {
              const active = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={
                    active
                      ? "rounded-lg bg-card/80 px-3 py-1.5 font-medium text-ink"
                      : "rounded-lg px-3 py-1.5 text-ink-soft transition-colors hover:bg-card/60 hover:text-ink"
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-4">
            <span className="hidden text-sm text-ink-soft sm:inline">Novembro de 2024</span>
            <button
              onClick={() => setOpen(true)}
              className="rounded-lg bg-mint px-3.5 py-2 text-sm font-medium text-card transition-transform hover:scale-[1.02] active:scale-[0.99]"
            >
              Nova Transação
            </button>
            <div className="grid size-8 place-items-center rounded-full bg-card/80 font-display text-sm font-semibold text-ink">
              {initials}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-6 pt-8">
        <h1 className="font-display text-[28px] font-medium leading-none tracking-tight">{title}</h1>
        {subtitle ? <p className="mt-2 text-sm text-ink-soft">{subtitle}</p> : null}
      </div>

      <main className="mx-auto max-w-[1400px] px-6 py-6">{children}</main>

      <footer className="mx-auto max-w-[1400px] px-6 pb-10 pt-2">
        <p className="text-sm text-ink-faint">
          Minhas Contas · dados de demonstração · valores em BRL (R$)
        </p>
      </footer>

      <TransactionDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
