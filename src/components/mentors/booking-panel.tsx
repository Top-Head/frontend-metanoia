"use client";

import { useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";
import { formatKz } from "@/lib/currency";

const WEEKDAY_LABELS = ["D", "S", "T", "Q", "Q", "S", "S"];

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

const AVAILABLE_SLOTS = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

interface BookingPanelProps {
  basePrice: number;
}

export function BookingPanel({ basePrice }: BookingPanelProps) {
  const today = new Date();
  const [viewedMonth, setViewedMonth] = useState(today.getMonth());
  const [viewedYear, setViewedYear] = useState(today.getFullYear());
  const [selectedSession, setSelectedSession] = useState("one-on-one");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const dayOfMonth = today.getDate();
  const firstWeekday = new Date(viewedYear, viewedMonth, 1).getDay();
  const daysInMonth = new Date(viewedYear, viewedMonth + 1, 0).getDate();

  const sessions = [
    {
      id: "one-on-one",
      label: "1:1 Mentoria",
      price: Math.round(basePrice),
    },
    {
      id: "review",
      label: "Revisão de Projeto",
      price: Math.round(basePrice * 0.7),
    },
  ];

  function changeMonth(delta: number) {
    const next = new Date(viewedYear, viewedMonth + delta, 1);
    setViewedMonth(next.getMonth());
    setViewedYear(next.getFullYear());
  }

  return (
    <div className="sticky top-24 space-y-4">
      <div className="rounded-2xl border border-line bg-panel p-6 shadow-card">
        <h2 className="mb-6 text-xl font-bold text-ink">Agende uma Sessão</h2>

        <div className="mb-6 space-y-3">
          {sessions.map((session) => {
            const selected = session.id === selectedSession;
            return (
              <div
                key={session.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedSession(session.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    setSelectedSession(session.id);
                  }
                }}
                className={`flex cursor-pointer items-center gap-3 rounded-xl p-3 transition-colors ${
                  selected
                    ? "border-2 border-primary bg-primary/5"
                    : "border border-line hover:border-primary"
                }`}
              >
                <span
                  className={`flex size-4 shrink-0 items-center justify-center rounded-full border-2 ${
                    selected ? "border-primary" : "border-line-strong"
                  }`}
                >
                  {selected && <span className="size-2 rounded-full bg-primary" />}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-ink">
                    {session.label}
                  </span>
                  <span className="mt-0.5 block whitespace-nowrap text-sm font-bold text-primary">
                    {formatKz(session.price)}
                    <span className="text-xs font-normal text-ink-soft">/h</span>
                  </span>
                </span>
              </div>
            );
          })}
        </div>

        <div className="mb-6 border-t border-line pt-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-ink-faint">
            Escolha o horário
          </p>
          <div className="grid grid-cols-3 gap-2">
            {AVAILABLE_SLOTS.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setSelectedSlot(slot)}
                className={`cursor-pointer rounded-lg border py-2 text-xs font-semibold transition-colors ${
                  selectedSlot === slot
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-line text-ink hover:border-primary hover:bg-primary/5 hover:text-primary"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6 border-t border-line pt-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-bold text-ink">
              <CalendarDays size={16} className="text-primary" />
              {MONTH_NAMES_PT[viewedMonth]} {viewedYear}
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                aria-label="Mês anterior"
                onClick={() => changeMonth(-1)}
                className="cursor-pointer rounded-md p-1 text-ink-faint transition-colors hover:bg-primary/10 hover:text-primary"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                aria-label="Próximo mês"
                onClick={() => changeMonth(1)}
                className="cursor-pointer rounded-md p-1 text-ink-faint transition-colors hover:bg-primary/10 hover:text-primary"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {WEEKDAY_LABELS.map((label, index) => (
              <span key={index} className="text-[10px] font-bold text-ink-faint">
                {label}
              </span>
            ))}
            {Array.from({ length: firstWeekday }, (_, index) => (
              <span key={`empty-${index}`} />
            ))}
            {Array.from({ length: daysInMonth }, (_, index) => {
              const day = index + 1;
              const past =
                viewedYear < today.getFullYear() ||
                (viewedYear === today.getFullYear() &&
                  (viewedMonth < today.getMonth() ||
                    (viewedMonth === today.getMonth() && day < dayOfMonth)));

              return (
                <button
                  key={day}
                  type="button"
                  disabled={past}
                  onClick={() => setSelectedDay(day)}
                  className={`mx-auto flex size-8 cursor-pointer items-center justify-center rounded-full text-xs transition-colors ${
                    selectedDay === day
                      ? "bg-primary font-bold text-white"
                      : past
                        ? "cursor-default text-ink-faint/40"
                        : "text-ink hover:bg-primary/10"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          disabled={!selectedDay || !selectedSlot}
          className="w-full rounded-xl bg-primary py-4 text-lg font-bold text-white shadow-card transition-all hover:-translate-y-0.5 hover:bg-primary-strong disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
        >
          Reservar Agora
        </button>
        <p className="mt-4 text-center text-[10px] italic text-ink-soft">
          Nenhum pagamento é cobrado até a confirmação da sessão.
        </p>
      </div>

      <div className="flex gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <ShieldCheck size={20} className="shrink-0 text-primary" />
        <div>
          <p className="text-xs font-bold text-primary">Garantia de reembolso</p>
          <p className="mt-0.5 text-[10px] leading-tight text-ink-soft">
            Se a primeira sessão não atender às suas expectativas, devolvemos
            100% do valor.
          </p>
        </div>
      </div>
    </div>
  );
}