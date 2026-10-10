import { GraduationCap, Inbox, MessageSquare } from "lucide-react";
import clsx from "clsx";
import { formatKz } from "@/lib/currency";

interface DashboardCard {
  label: string;
  value: string;
  trend: string;
  icon: typeof GraduationCap;
  pending?: boolean;
}

const CARDS: DashboardCard[] = [
  {
    label: "Ganhos",
    value: formatKz(4_250_000),
    trend: "+12% este mês",
    icon: GraduationCap,
  },
  {
    label: "Alunos Ativos",
    value: "24",
    trend: "+3 novos alunos",
    icon: Inbox,
  },
  {
    label: "Mensagens não lidas",
    value: "12",
    trend: "Requer atenção",
    icon: MessageSquare,
    pending: true,
  },
];

export default function Cards() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {CARDS.map(({ label, value, trend, icon: Icon, pending }) => (
        <div
          key={label}
          className="flex min-h-40 flex-col justify-between rounded-xl border border-line-strong bg-panel p-5 shadow-card"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium uppercase text-ink-soft">
              {label}
            </p>
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <Icon size={18} className="text-primary" />
            </span>
          </div>

          <div className="flex flex-col">
            <p className="text-[30px] font-bold text-ink">{value}</p>
            <div className="mt-1 flex items-center gap-2">
              <span
                className={clsx(
                  "size-2 rounded-full",
                  pending ? "bg-warning" : "bg-success"
                )}
              />
              <p className="text-sm font-medium text-success">{trend}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}