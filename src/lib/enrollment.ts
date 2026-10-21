import type { Tone } from "@/components/app/ui";
import type { Enrollment, EnrollmentStatus, PaymentStatus } from "./api/types";

interface Badge {
  label: string;
  tone: Tone;
}

export const ENROLLMENT_STATUS: Record<EnrollmentStatus, Badge> = {
  PENDING: { label: "Aguarda aprovação", tone: "warning" },
  APPROVED: { label: "Aprovada", tone: "success" },
  REJECTED: { label: "Recusada", tone: "danger" },
  CANCELLED: { label: "Cancelada", tone: "neutral" },
};

export const PAYMENT_STATUS: Record<PaymentStatus, Badge> = {
  NOT_REQUIRED: { label: "Sem pagamento", tone: "neutral" },
  PENDING: { label: "Pagamento pendente", tone: "warning" },
  CONFIRMED: { label: "Pagamento confirmado", tone: "success" },
  REJECTED: { label: "Pagamento recusado", tone: "danger" },
};

const isClosed = (enrollment: Enrollment) =>
  enrollment.status === "CANCELLED" || enrollment.status === "REJECTED";

/** Cancelamento permitido enquanto a inscrição está ativa e o pagamento não foi confirmado. */
export function canCancel(enrollment: Enrollment) {
  return !isClosed(enrollment) && enrollment.payment_status !== "CONFIRMED";
}

/** Próximo passo para o aluno, em linguagem simples. */
export function nextStepFor(enrollment: Enrollment): string | null {
  if (enrollment.status === "CANCELLED") return null;
  if (enrollment.status === "REJECTED") return "O mentor recusou este pedido.";
  if (enrollment.status === "PENDING") return "Aguarde a resposta do mentor.";
  return "Inscrição aprovada. A sua vaga está garantida.";
}

/** A inscrição aprovada dá acesso à aula; pagamento não é uma etapa de acesso. */
export function isConfirmed(enrollment: Enrollment) {
  return enrollment.status === "APPROVED";
}

const DATE_TIME = new Intl.DateTimeFormat("pt-PT", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

/** "10 de outubro de 2026, 23:16" — usar só em dados carregados no cliente. */
export function formatDateTime(value: string) {
  return DATE_TIME.format(new Date(value));
}
