import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useFinance } from "@/lib/finance-store";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Configurações — Minhas Contas" },
      {
        name: "description",
        content: "Edite seus dados de perfil e encerre a sessão do Minhas Contas.",
      },
      { property: "og:title", content: "Configurações — Minhas Contas" },
      { property: "og:description", content: "Dados de perfil e sessão." },
    ],
  }),
  component: SettingsPage,
});

const fieldClass =
  "w-full rounded-lg border border-border bg-card/80 px-3 py-2.5 text-sm text-ink outline-none focus:border-mint";
const labelClass = "text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint";

function SettingsPage() {
  const { profile, updateProfile, signOut } = useFinance();
  const navigate = useNavigate();
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [saved, setSaved] = useState(false);

  return (
    <AppShell title="Configurações" subtitle="Seus dados de perfil e sessão">
      <div className="max-w-[520px] rounded-2xl paper p-6">
        <h2 className="font-display text-lg font-medium">Perfil</h2>
        <div className="mt-5 space-y-4">
          <div>
            <label className={labelClass}>Nome do usuário</label>
            <input
              className={`${fieldClass} mt-1.5`}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSaved(false);
              }}
            />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              className={`${fieldClass} mt-1.5`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setSaved(false);
              }}
            />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={() => {
              updateProfile({ name, email });
              setSaved(true);
            }}
            className="rounded-lg bg-mint px-3.5 py-2 text-sm font-medium text-card transition-transform hover:scale-[1.02]"
          >
            Salvar Alterações
          </button>
          {saved ? <span className="text-sm text-mint-deep">Alterações salvas.</span> : null}
        </div>
      </div>

      <div className="mt-5 max-w-[520px] rounded-2xl paper p-6">
        <h2 className="font-display text-lg font-medium">Sessão</h2>
        <p className="mt-2 text-sm text-ink-soft">
          Encerrar a sessão retorna para a tela de entrada.
        </p>
        <button
          onClick={() => {
            signOut();
            navigate({ to: "/" });
          }}
          className="mt-5 rounded-lg border border-clay px-3.5 py-2 text-sm font-medium text-clay transition-colors hover:bg-clay hover:text-card"
        >
          Sair
        </button>
      </div>
    </AppShell>
  );
}
