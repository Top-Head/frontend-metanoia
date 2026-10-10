import { formatKz } from "./currency";
import type { CourseType, Level, Modality, PreferredModality } from "./api/types";

export const COURSE_TYPE_LABEL: Record<CourseType, string> = {
  INDIVIDUAL: "Individual",
  GROUP: "Em grupo",
};

export const MODALITY_LABEL: Record<Modality, string> = {
  ONLINE: "Online",
  PRESENTIAL: "Presencial",
};

export const LEVEL_LABEL: Record<Level, string> = {
  BEGINNER: "Iniciante",
  INTERMEDIATE: "Intermédio",
  ADVANCED: "Avançado",
  UNKNOWN: "Não definido",
};

export const PREFERRED_MODALITY_LABEL: Record<PreferredModality, string> = {
  ONLINE: "Online",
  PRESENTIAL: "Presencial",
  ANY: "Qualquer",
};

const KWANZA_CODES = new Set(["", "AOA", "KZ", "KWZ"]);

/** Preço de uma aula: "Gratuita", "15.000 Kz" ou "50 USD". */
export function formatCoursePrice(course: {
  is_free: boolean;
  price_amount?: string;
  currency?: string;
}) {
  const amount = Number(course.price_amount ?? 0);
  if (course.is_free || !amount) return "Gratuita";

  const currency = (course.currency ?? "").toUpperCase();
  return KWANZA_CODES.has(currency) ? formatKz(amount) : `${amount} ${currency}`;
}

const DATE_FORMAT = new Intl.DateTimeFormat("pt-PT", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

const TIME_FORMAT = new Intl.DateTimeFormat("pt-PT", {
  hour: "2-digit",
  minute: "2-digit",
});

/*
 * Datas de encontros. Usar só em conteúdo carregado no cliente
 * (dados da API), para não haver divergência de hidratação.
 */

/** "domingo, 18 de outubro" */
export function formatMeetingDate(startsAt: string) {
  return DATE_FORMAT.format(new Date(startsAt));
}

/** "14:00–16:00" */
export function formatMeetingTime(startsAt: string, endsAt: string) {
  return `${TIME_FORMAT.format(new Date(startsAt))}–${TIME_FORMAT.format(new Date(endsAt))}`;
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}
