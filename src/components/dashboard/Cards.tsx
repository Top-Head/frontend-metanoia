import { GraduationCap, Inbox, MessageSquare } from "lucide-react";

const CARDS = [
  {
    label: "Earnings",
    value: "$4,250.00",
    trend: "+12.% this month",
    icon: GraduationCap,
  },
  {
    label: "Active Students",
    value: "24",
    trend: "+3 new students",
    icon: Inbox,
  },
  {
    label: "Mensagens não lidas",
    value: "12",
    trend: "Needs attention",
    icon: MessageSquare,
  },
];

export default function Cards() {
  return (
    <div className="flex gap-6">
      {CARDS.map(({ label, value, trend, icon: Icon }) => (
        <div
          key={label}
          className="flex h-[163.5px] w-65 min-w-50 flex-col justify-between rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]"
        >
          <div className="flex items-center gap-24">
            <p className="text-[14px] font-medium text-[#64748B] uppercase">
              {label}
            </p>
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </span>
          </div>

          <div>
            <p className="text-[30px] font-bold text-[#0F172A]">
              {value}
            </p>
            <p className="mt-1 text-[14px] font-medium text-[#07883B]">{trend}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
