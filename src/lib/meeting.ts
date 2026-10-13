import type { NestedMeeting } from "./api/types";
import { formatMeetingDate, formatMeetingTime } from "./format";

// Convenção presumida (não documentada no YAML): 0 = segunda … 6 = domingo, como date.weekday() do Python.
export const WEEKDAYS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
export const WEEKDAYS_SHORT = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const WEEKLY_LABEL = [
  "Todas as segundas",
  "Todas as terças",
  "Todas as quartas",
  "Todas as quintas",
  "Todas as sextas",
  "Todos os sábados",
  "Todos os domingos",
];

const DAY_MS = 86_400_000;
const apiWeekday = (date: Date) => (date.getDay() + 6) % 7;
const hhmm = (time: string) => time.slice(0, 5);

export function isWeekly(meeting: NestedMeeting) {
  return meeting.day_of_week != null && Boolean(meeting.start_time) && Boolean(meeting.end_time);
}

/** { day: "Todas as segundas" | "domingo, 18 de outubro", time: "14:00–16:00" } */
export function describeMeeting(meeting: NestedMeeting) {
  if (isWeekly(meeting)) {
    return {
      day: WEEKLY_LABEL[meeting.day_of_week!] ?? "Semanal",
      time: `${hhmm(meeting.start_time!)}–${hhmm(meeting.end_time!)}`,
    };
  }
  if (meeting.starts_at && meeting.ends_at) {
    return {
      day: formatMeetingDate(meeting.starts_at),
      time: formatMeetingTime(meeting.starts_at, meeting.ends_at),
    };
  }
  return { day: "Data a definir", time: "" };
}

/** Semanais primeiro (por dia e hora), depois os pontuais por data. */
export function sortMeetings<T extends NestedMeeting>(meetings: T[]) {
  return [...meetings].sort((a, b) => {
    const weeklyA = isWeekly(a);
    const weeklyB = isWeekly(b);
    if (weeklyA !== weeklyB) return weeklyA ? -1 : 1;
    if (weeklyA) return a.day_of_week! - b.day_of_week! || a.start_time!.localeCompare(b.start_time!);
    return (a.starts_at ?? "").localeCompare(b.starts_at ?? "");
  });
}

/** "YYYY-MM-DD" → Date local (sem desvio de fuso). */
export function parseDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function atTime(day: Date, time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours, minutes);
}

export interface Occurrence {
  key: string;
  starts_at: string;
  ends_at: string;
  location?: string;
}

/** Ocorrências concretas dos encontros entre `from` e `to`, respeitando o período da aula. */
export function expandMeetings(
  meetings: NestedMeeting[],
  period: { start_date?: string | null; end_date?: string | null },
  from: Date,
  to: Date
): Occurrence[] {
  const lower = period.start_date ? new Date(Math.max(from.getTime(), parseDate(period.start_date).getTime())) : from;
  const upper = period.end_date
    ? new Date(Math.min(to.getTime(), parseDate(period.end_date).getTime() + DAY_MS - 1))
    : to;

  return meetings.flatMap((meeting) => {
    if (!isWeekly(meeting)) {
      return meeting.starts_at && meeting.ends_at
        ? [{ key: `${meeting.id}`, starts_at: meeting.starts_at, ends_at: meeting.ends_at, location: meeting.location }]
        : [];
    }

    const result: Occurrence[] = [];
    const cursor = new Date(lower.getFullYear(), lower.getMonth(), lower.getDate());
    while (cursor <= upper) {
      if (apiWeekday(cursor) === meeting.day_of_week) {
        const start = atTime(cursor, meeting.start_time!);
        result.push({
          key: `${meeting.id}-${start.getTime()}`,
          starts_at: start.toISOString(),
          ends_at: atTime(cursor, meeting.end_time!).toISOString(),
          location: meeting.location,
        });
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    return result;
  });
}

/** Janela usada nos calendários dos painéis. */
export function calendarWindow(now = new Date()) {
  return {
    from: new Date(now.getFullYear(), now.getMonth() - 2, 1),
    to: new Date(now.getFullYear(), now.getMonth() + 7, 0),
  };
}

const DATE_FORMAT = new Intl.DateTimeFormat("pt-PT", { day: "numeric", month: "short", year: "numeric" });

export function formatCourseDate(value: string) {
  return DATE_FORMAT.format(parseDate(value));
}

/** "12 nov. 2026 – 20 dez. 2026", "A partir de …", "Até …" ou null. */
export function formatPeriod(start?: string | null, end?: string | null) {
  if (start && end) return `${formatCourseDate(start)} – ${formatCourseDate(end)}`;
  if (start) return `A partir de ${formatCourseDate(start)}`;
  if (end) return `Até ${formatCourseDate(end)}`;
  return null;
}

/** [0, 2] → "Seg · Qua" */
export function formatWeekdays(days: number[]) {
  return [...new Set(days)]
    .sort((a, b) => a - b)
    .map((day) => WEEKDAYS_SHORT[day])
    .filter(Boolean)
    .join(" · ");
}

/** Vagas livres numa turma (nunca negativo). */
export function seatsLeft(session: { effective_capacity: number; total_students?: number }) {
  return Math.max(0, session.effective_capacity - (session.total_students ?? 0));
}
