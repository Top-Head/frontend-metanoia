import type { CourseStatus } from "./api/types";

export const COURSE_STATUS: Record<CourseStatus, { label: string; tone: string }> = {
  DRAFT: { label: "Rascunho", tone: "bg-line text-ink-soft" },
  PUBLISHED: { label: "Publicada", tone: "bg-success-soft text-success" },
  ARCHIVED: { label: "Arquivada", tone: "bg-warning-soft text-warning" },
  CANCELLED: { label: "Cancelada", tone: "bg-danger/10 text-danger" },
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
