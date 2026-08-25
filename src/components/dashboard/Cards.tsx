import { GraduationCap, Inbox, MessageSquare } from "lucide-react";

const CARDS = [
  {
    label: "Mentorias concluídas",
    value: "128",
    trend: "+12% esse mês",
    icon: GraduationCap,
  },
  {
    label: "Solicitações pendentes",
    value: "4",
    trend: "2 novas hoje",
    icon: Inbox,
  },
  {
    label: "Mensagens não lidas",
    value: "9",
    trend: "-3 desde ontem",
    icon: MessageSquare,
  },
];

export default function Cards() {
  return (
    <div className="flex gap-6">
      {CARDS.map(({ label, value, trend, icon: Icon }) => (
        <div
          key={label}
          className="flex h-[163.5px] w-[202.67px] min-w-[200px] flex-col justify-between rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </span>
            <p className="text-xs font-medium text-slate-500">{label}</p>
          </div>

          <div>
            <p className="text-3xl font-bold tracking-tight text-[#101822]">
              {value}
            </p>
            <p className="mt-1 text-xs text-slate-400">{trend}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
