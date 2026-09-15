import { Ban, Eye, Calendar } from "lucide-react";
import Image from "next/image";

const QUICK_ACTIONS = [
  { label: "Agendar Sessão", icon: Calendar },
  { label: "Ver Progresso", icon: Eye },
  { label: "Silenciar Notificações", icon: Ban, danger: true },
];

export default function Profile() {
  return (
    <section className="hidden w-96 shrink-0 flex-col overflow-y-auto border-l border-line bg-panel lg:flex">
      <div className="space-y-6 p-6">
        <div className="flex flex-col items-center">
          <Image
            src="/Margin.png"
            alt="Avatar de Alex Rivera"
            width={80}
            height={80}
            className="rounded-full"
          />
          <h2 className="mt-2 text-lg font-semibold text-ink">Alex Rivera</h2>
          <p className="text-sm text-ink-soft">Aluno desde Setembro de 2023</p>
        </div>

        <div>
          <h3 className="text-[10px] font-bold uppercase text-ink-faint">
            Curso Ativo
          </h3>
          <div className="mt-2 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <h4 className="text-sm font-semibold text-primary">
              Trilha de UI Design
            </h4>
            <p className="text-[11px] text-ink-soft">
              Próxima sessão: Qua, 10:00
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-bold uppercase text-ink-faint">
            Ações Rápidas
          </h3>
          <div className="mt-3 space-y-3">
            {QUICK_ACTIONS.map(({ label, icon: Icon, danger }) => (
              <button
                key={label}
                type="button"
                className="flex w-full items-center gap-2 text-sm transition-colors hover:opacity-80"
              >
                <Icon size={16} className={danger ? "text-danger" : "text-ink-soft"} />
                <span className={danger ? "text-danger" : "text-ink"}>
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-bold uppercase text-ink-faint">
            Arquivos Compartilhados (3)
          </h3>
          <div className="mt-3 flex gap-3">
            {Array.from({ length: 3 }, (_, index) => (
              <div
                key={index}
                className="h-[54px] flex-1 rounded-lg bg-slate-100"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}