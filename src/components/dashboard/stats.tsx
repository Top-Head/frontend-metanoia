import clsx from "clsx";
import { BookOpen, FileSearch, Inbox, UserCheck, type LucideIcon } from "lucide-react";

interface StatsProps {
  pending: number;
  proofsToReview: number;
  confirmedStudents: number;
  publishedCourses: number;
  isLoading: boolean;
}

interface Stat {
  label: string;
  value: number;
  hint: string;
  icon: LucideIcon;
  attention?: boolean;
}

export default function Stats({
  pending,
  proofsToReview,
  confirmedStudents,
  publishedCourses,
  isLoading,
}: StatsProps) {
  const stats: Stat[] = [
    {
      label: "Novos pedidos",
      value: pending,
      hint: pending ? "Aguardam a sua decisão" : "Nada pendente",
      icon: Inbox,
      attention: pending > 0,
    },
    {
      label: "Comprovativos",
      value: proofsToReview,
      hint: proofsToReview ? "Por validar" : "Tudo validado",
      icon: FileSearch,
      attention: proofsToReview > 0,
    },
    {
      label: "Alunos confirmados",
      value: confirmedStudents,
      hint: "Com vaga garantida",
      icon: UserCheck,
    },
    {
      label: "Aulas publicadas",
      value: publishedCourses,
      hint: "Visíveis no catálogo",
      icon: BookOpen,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
      {stats.map(({ label, value, hint, icon: Icon, attention }) => (
        <div
          key={label}
          className="flex min-h-36 flex-col justify-between rounded-xl border border-line-strong bg-panel p-5 shadow-card"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium uppercase text-ink-soft">{label}</p>
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Icon size={18} className="text-primary" />
            </span>
          </div>
          <div>
            {isLoading ? (
              <span className="block h-9 w-14 animate-pulse rounded bg-line" />
            ) : (
              <p className="text-[30px] font-bold leading-tight text-ink">{value}</p>
            )}
            <p className="mt-1 flex items-center gap-2 text-sm font-medium text-ink-soft">
              <span className={clsx("size-2 rounded-full", attention ? "bg-warning" : "bg-success")} />
              {hint}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
