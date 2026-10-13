"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { CalendarPlus, ChevronLeft, ChevronRight } from "lucide-react";
import { formatMeetingDate, formatMeetingTime } from "@/lib/format";

export interface CalendarMeeting {
  id: number;
  href: string;
  courseTitle: string;
  sessionName: string;
  starts_at: string;
  ends_at: string;
  location?: string;
}

const WEEK_DAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTH_FORMAT = new Intl.DateTimeFormat("pt-PT", { month: "long", year: "numeric" });

const dayKey = (date: Date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

interface MeetingsCalendarProps {
  meetings: CalendarMeeting[];
  isLoading: boolean;
  action?: { href: string; label: string };
  emptyText?: string;
}

export default function MeetingsCalendar({
  meetings,
  isLoading,
  action,
  emptyText = "Nenhum encontro agendado.",
}: MeetingsCalendarProps) {
  const [now] = useState(() => new Date());
  const [cursor, setCursor] = useState(() => new Date(now.getFullYear(), now.getMonth(), 1));

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const meetingDays = new Set(meetings.map((meeting) => dayKey(new Date(meeting.starts_at))));

  const upcoming = meetings
    .filter((meeting) => new Date(meeting.ends_at) >= now)
    .sort((a, b) => a.starts_at.localeCompare(b.starts_at))
    .slice(0, 4);

  return (
    <aside className="min-w-0">
      <div className="rounded-2xl border border-line-strong bg-panel p-5 shadow-card">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink first-letter:uppercase">{MONTH_FORMAT.format(cursor)}</h2>
          <div className="flex items-center gap-1 text-ink-soft">
            <button
              type="button"
              aria-label="Mês anterior"
              onClick={() => setCursor(new Date(year, month - 1, 1))}
              className="rounded-md p-1 transition-colors hover:bg-canvas hover:text-primary"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              aria-label="Próximo mês"
              onClick={() => setCursor(new Date(year, month + 1, 1))}
              className="rounded-md p-1 transition-colors hover:bg-canvas hover:text-primary"
            >
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
          {Array.from({ length: firstWeekday }, (_, index) => (
            <span key={`empty-${index}`} />
          ))}
          {Array.from({ length: daysInMonth }, (_, index) => {
            const date = new Date(year, month, index + 1);
            const isToday = dayKey(date) === dayKey(now);
            const hasMeeting = meetingDays.has(dayKey(date));
            return (
              <span
                key={index}
                className={clsx(
                  "relative mx-auto flex size-9 items-center justify-center rounded-full",
                  isToday
                    ? "bg-primary font-bold text-white"
                    : hasMeeting
                      ? "bg-primary/10 font-bold text-primary"
                      : ""
                )}
                title={hasMeeting ? "Dia com encontros" : undefined}
              >
                {index + 1}
                {hasMeeting && isToday && (
                  <span className="absolute bottom-1 size-1 rounded-full bg-white" />
                )}
              </span>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-base font-bold text-ink">Próximos encontros</h3>
        <div className="mt-4 space-y-3">
          {isLoading ? (
            Array.from({ length: 2 }, (_, index) => (
              <span key={index} className="block h-20 animate-pulse rounded-xl bg-line" />
            ))
          ) : upcoming.length > 0 ? (
            upcoming.map((meeting) => (
              <Link
                key={meeting.id}
                href={meeting.href}
                className="block rounded-xl border border-line-strong bg-panel p-3 transition-colors hover:border-primary/40"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="truncate text-xs font-bold text-primary">{meeting.courseTitle}</span>
                  <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    {formatMeetingTime(meeting.starts_at, meeting.ends_at)}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-ink-soft first-letter:uppercase">
                  {formatMeetingDate(meeting.starts_at)} · {meeting.sessionName}
                </p>
                {meeting.location && <p className="truncate text-xs text-ink-faint">{meeting.location}</p>}
              </Link>
            ))
          ) : (
            <p className="rounded-xl border border-dashed border-line-strong px-4 py-6 text-center text-xs text-ink-faint">
              {emptyText}
            </p>
          )}
        </div>
      </div>

      {action && (
        <Link
          href={action.href}
          className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-line-strong text-sm font-bold text-ink-soft transition-colors hover:border-primary hover:text-primary"
        >
          <CalendarPlus size={16} />
          {action.label}
        </Link>
      )}
    </aside>
  );
}
