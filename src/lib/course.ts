import type { Tone } from "@/components/app/ui";
import type { CourseStatus } from "./api/types";

export const COURSE_STATUS: Record<CourseStatus, { label: string; tone: Tone }> = {
  DRAFT: { label: "Rascunho", tone: "neutral" },
  PUBLISHED: { label: "Publicada", tone: "success" },
  ARCHIVED: { label: "Arquivada", tone: "warning" },
  CANCELLED: { label: "Cancelada", tone: "danger" },
};

/** ISO (UTC) → valor de <input type="datetime-local"> na hora local. */
export function toLocalInput(iso: string) {
  const date = new Date(iso);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

/** Valor de <input type="datetime-local"> (hora local) → ISO (UTC). */
export function fromLocalInput(value: string) {
  return new Date(value).toISOString();
}
