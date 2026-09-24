import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useFinance } from "@/lib/finance-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Entrar — Minhas Contas" },
      {
        name: "description",
        content:
          "Acesse o Minhas Contas para acompanhar saldos, receitas e despesas em um só lugar.",
      },
      { property: "og:title", content: "Entrar — Minhas Contas" },
      {
        property: "og:description",
        content: "Controle simples de contas, receitas e despesas pessoais.",
      },
    ],
  }),
  component: AuthPage,
});

const fieldClass =
  "w-full rounded-lg border border-border bg-card/80 px-3 py-2.5 text-sm text-ink outline-none focus:border-mint";
const labelClass = "text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint";

function AuthPage() {
  const { signIn } = useFinance();
  const navigate = useNavigate();
  const [email, setEmail] = useState("maria.costa@email.com");
  const [password, setPassword] = useState("demo1234");
  const [notice, setNotice] = useState<string | null>(null);

  const enter = () => {
    signIn(email);
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="page-wash grid min-h-screen place-items-center px-6 py-12">
      <div className="w-full max-w-[420px] rounded-2xl paper p-8">
        <div className="mb-7 flex items-center gap-2.5">
          <div className="grid size-8 place-items-center rounded-[10px] bg-mint text-card shadow-sm">
            <span className="font-display text-sm font-semibold leading-none">M</span>
          </div>
          <span className="font-display text-[17px] font-semibold tracking-tight">
            Minhas Contas
          </span>
        </div>

        <h1 className="font-display text-[28px] font-medium leading-none tracking-tight">
          Entrar na sua conta
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          Controle simples de contas, receitas e despesas.
        </p>

        <form
          className="mt-7 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            enter();
          }}
        >
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              className={`${fieldClass} mt-1.5`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Senha</label>
            <input
              type="password"
              className={`${fieldClass} mt-1.5`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-mint px-3.5 py-2.5 text-sm font-medium text-card transition-transform hover:scale-[1.01] active:scale-[0.99]"
          >
            Entrar
          </button>
        </form>

        <div className="mt-5 flex items-center justify-between text-sm">
          <button
            onClick={enter}
            className="font-medium text-mint-deep transition-transform hover:scale-[1.03]"
          >
            Criar conta
          </button>
          <button
            onClick={() => setNotice("Enviaremos um link de recuperação para o seu email.")}
            className="text-ink-soft hover:text-ink"
          >
            Esqueci a senha
          </button>
        </div>

        {notice ? <p className="mt-4 text-sm text-mint-deep">{notice}</p> : null}

        <p className="mt-7 text-xs text-ink-faint">
          Versão de demonstração — os dados são fictícios e não são salvos.
        </p>
      </div>
    </div>
  );
}
