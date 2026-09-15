import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

const WEEK_DAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const MONTH_NAMES_PT = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

interface UpcomingSession {
  title: string;
  time: string;
  date: string;
  label: string;
  tint: "primary" | "success";
}

const UPCOMING_SESSIONS: UpcomingSession[] = [
  {
    title: "Revisão de Design",
    time: "10:00",
    date: "Design review",
    label: "Manhã",
    tint: "primary",
  },
  {
    title: "Workshop",
    time: "14:30",
    date: "Lab UI/UX",
    label: "Tarde",
    tint: "success",
  },
];

type CalendarCell = null | { day: number; outOfMonth: boolean };

function buildCalendar(): CalendarCell[] {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const firstWeekday = new Date(year, month, 1).getDay();
  const lastDay = new Date(year, month + 1, 0).getDate();
  const trailingCells = (7 - ((firstWeekday + lastDay) % 7)) % 7;

  return [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: lastDay }, (_, index) => ({
      day: index + 1,
      outOfMonth: false,
    })),
    ...Array.from({ length: trailingCells }, (_, index) => ({
      day: index + 1,
      outOfMonth: true,
    })),
  ];
}

export default function Calendar() {
  const today = new Date();
  const monthLabel = `${MONTH_NAMES_PT[today.getMonth()]} ${today.getFullYear()}`;
  const cells = buildCalendar();

  return (
    <aside className="bg-panel p-6">
      <div className="rounded-2xl bg-slate-50 p-5 shadow-card">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-ink">{monthLabel}</h2>
          <div className="flex items-center gap-3 text-ink-soft">
            <button type="button" aria-label="Mês anterior" className="cursor-pointer">
              <ChevronLeft size={16} />
            </button>
            <button type="button" aria-label="Próximo mês" className="cursor-pointer">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-ink-soft">
          {WEEK_DAY_LABELS.map((label) => (
            <span key={label} className="py-1">
              {label}
            </span>
          ))}
        </div>

        <div className="mt-1 grid grid-cols-7 gap-1 text-center text-[13px] text-ink-soft">
          {cells.map((cell, index) =>
            cell === null ? (
              <div key={`empty-${index}`} />
            ) : (
              <div
                key={cell.outOfMonth ? `next-${cell.day}` : cell.day}
                className={`flex size-9 items-center justify-center rounded-full ${
                  cell.outOfMonth
                    ? "text-ink-faint/50"
                    : cell.day === today.getDate()
                      ? "bg-primary font-bold text-white"
                      : cell.day % 4 === 0
                        ? "bg-primary/10 font-medium text-primary"
                        : "hover:bg-slate-100"
                }`}
              >
                {cell.day}
              </div>
            )
          )}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-base font-bold text-ink">Próximas Sessões</h3>

        <div className="mt-4 space-y-3">
          {UPCOMING_SESSIONS.map(({ title, time, date, label, tint }) => (
            <div
              key={title}
              className="rounded-xl border border-line-strong bg-slate-50 p-3"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-semibold ${
                    tint === "primary" ? "text-primary" : "text-success"
                  }`}
                >
                  {title}
                </span>
                <span
                  className={`rounded-full px-2 py-1 text-[10px] ${
                    tint === "primary"
                      ? "bg-primary/10 text-primary"
                      : "bg-success-soft text-success"
                  }`}
                >
                  {time}
                </span>
              </div>
              <p className="mt-2 text-xs text-ink-soft">
                {date} • {label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-line-strong text-sm font-bold text-ink-soft transition-colors hover:border-primary hover:text-primary"
      >
        <Plus size={16} />
        Adicionar Faixa Horária
      </button>
    </aside>
  );
}