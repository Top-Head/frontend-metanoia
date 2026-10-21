"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { Skeleton, buttonClass } from "@/components/app/ui";
import { formatMeetingTime } from "@/lib/format";

export interface CalendarMeeting {
  key: string;
  href: string;
  courseTitle: string;
  sessionName: string;
  starts_at: string;
  ends_at: string;
  location?: string;
}

interface MeetingsCalendarProps {
  meetings: CalendarMeeting[];
  isLoading: boolean;
  action?: { href: string; label: string };
  emptyText?: string;
}

const WEEK_DAY_LABELS = ["D", "S", "T", "Q", "Q", "S", "S"];
const MONTH = new Intl.DateTimeFormat("pt-PT", { month: "long", year: "numeric" });
const WEEKDAY = new Intl.DateTimeFormat("pt-PT", { weekday: "long" });
const SHORT_MONTH = new Intl.DateTimeFormat("pt-PT", { month: "short" });
const RELATIVE = new Intl.RelativeTimeFormat("pt-PT", { numeric: "auto" });

const dayKey = (date: Date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

/** "daqui a 3 horas", "amanhã", "a decorrer" — o tempo até ao encontro. */
function untilLabel(start: Date, end: Date, now: number) {
  if (start.getTime() <= now && end.getTime() >= now) return "A decorrer agora";
  const minutes = Math.round((start.getTime() - now) / 60_000);
  if (minutes < 60) return `Começa ${RELATIVE.format(Math.max(minutes, 1), "minute")}`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `Começa ${RELATIVE.format(hours, "hour")}`;
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const day = new Date(start);
  day.setHours(0, 0, 0, 0);
  return `Começa ${RELATIVE.format(Math.round((day.getTime() - today.getTime()) / 86_400_000), "day")}`;
}

function DateBlock({ date, emphasis }: { date: Date; emphasis?: boolean }) {
  return (
    <div className={clsx("flex w-12 shrink-0 flex-col items-center rounded-md py-1.5", emphasis ? "bg-primary text-white" : "bg-tone text-ink")}>
      <span className={clsx("text-[11px] font-medium", emphasis ? "text-white/80" : "text-ink-soft")}>
        {SHORT_MONTH.format(date).replace(".", "")}
      </span>
      <span className="font-display text-xl font-semibold leading-none tabular-nums">{date.getDate()}</span>
    </div>
  );
}

function MonthGrid({ meetings, now }: { meetings: CalendarMeeting[]; now: Date }) {
  const [cursor, setCursor] = useState(() => new Date(now.getFullYear(), now.getMonth(), 1));
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const meetingDays = new Set(meetings.map((meeting) => dayKey(new Date(meeting.starts_at))));

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-ink first-letter:uppercase">{MONTH.format(cursor)}</p>
        <div className="flex">
          <button
            type="button"
            aria-label="Mês anterior"
            onClick={() => setCursor(new Date(year, month - 1, 1))}
            className="flex size-7 items-center justify-center rounded text-ink-soft hover:bg-tone hover:text-ink"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            type="button"
            aria-label="Mês seguinte"
            onClick={() => setCursor(new Date(year, month + 1, 1))}
            className="flex size-7 items-center justify-center rounded text-ink-soft hover:bg-tone hover:text-ink"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 text-center text-[11px] font-medium text-ink-faint">
        {WEEK_DAY_LABELS.map((label, index) => (
          <span key={index} className="py-1">
            {label}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-0.5 text-center text-[13px] tabular-nums">
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
              title={hasMeeting ? "Dia com encontros" : undefined}
              className={clsx(
                "relative mx-auto flex size-8 items-center justify-center rounded-full",
                isToday ? "bg-ink font-semibold text-white" : hasMeeting ? "font-semibold text-primary" : "text-ink-soft"
              )}
            >
              {index + 1}
              {hasMeeting && (
                <span
                  aria-hidden="true"
                  className={clsx("absolute bottom-0.5 size-1 rounded-full", isToday ? "bg-white" : "bg-primary")}
                />
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function MeetingsCalendar({
  meetings,
  isLoading,
  action,
  emptyText = "Nenhum encontro agendado.",
}: MeetingsCalendarProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const upcoming = meetings
    .filter((meeting) => new Date(meeting.ends_at) >= now)
    .sort((a, b) => a.starts_at.localeCompare(b.starts_at))
    .slice(0, 5);
  const [next, ...later] = upcoming;

  return (
    <aside aria-labelledby="agenda-title" className="min-w-0 rounded-lg border border-line bg-panel">
      <div className="flex items-center justify-between px-5 pt-5">
        <h2 id="agenda-title" className="text-base font-semibold text-ink">
          Agenda
        </h2>
        {action && (
          <Link href={action.href} className="text-[13px] font-semibold text-primary hover:underline">
            {action.label}
          </Link>
        )}
      </div>

      <div className="px-5 pb-5 pt-4">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-28" />
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
          </div>
        ) : next ? (
          <>
            <Link
              href={next.href}
              className="group block rounded-md bg-rail p-4 text-rail-ink transition-colors hover:bg-rail-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <p className="text-[13px] font-medium text-primary">
                {untilLabel(new Date(next.starts_at), new Date(next.ends_at), now.getTime())}
              </p>
              <p className="mt-2 font-display text-[26px] font-semibold leading-none tracking-[-0.02em] text-white tabular-nums">
                {formatMeetingTime(next.starts_at, next.ends_at)}
              </p>
              <p className="mt-1 text-sm text-rail-muted first-letter:uppercase">
                {WEEKDAY.format(new Date(next.starts_at))}, {new Date(next.starts_at).getDate()}{" "}
                {SHORT_MONTH.format(new Date(next.starts_at)).replace(".", "")}
              </p>
              <p className="mt-3 truncate text-sm font-semibold text-white">{next.courseTitle}</p>
              <p className="truncate text-[13px] text-rail-muted">{next.sessionName}</p>
              {next.location && (
                <p className="mt-2 flex items-center gap-1.5 truncate text-[13px] text-rail-muted">
                  <MapPin size={13} aria-hidden="true" />
                  {next.location}
                </p>
              )}
            </Link>

            {later.length > 0 && (
              <ul className="mt-4 space-y-1">
                {later.map((meeting) => {
                  const start = new Date(meeting.starts_at);
                  return (
                    <li key={meeting.key}>
                      <Link
                        href={meeting.href}
                        className="-mx-2 flex items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-tone"
                      >
                        <DateBlock date={start} />
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold text-ink">{meeting.courseTitle}</span>
                          <span className="block truncate text-[13px] text-ink-soft tabular-nums">
                            {formatMeetingTime(meeting.starts_at, meeting.ends_at)} · {meeting.sessionName}
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        ) : (
          <div className="rounded-md bg-tone px-4 py-6 text-center">
            <p className="text-sm font-semibold text-ink">Agenda livre</p>
            <p className="mt-1 text-[13px] text-ink-soft">{emptyText}</p>
            {action && (
              <Link href={action.href} className={buttonClass("secondary", "sm", "mt-4")}>
                {action.label}
              </Link>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-line px-5 py-4">
        <MonthGrid meetings={meetings} now={now} />
      </div>
    </aside>
  );
}
