import type { Enrollment, EnrollmentStatus, PaymentStatus } from "./api/types";

interface Badge {
  label: string;
  /** Classes de fundo e texto. */
  tone: string;
}

export const ENROLLMENT_STATUS: Record<EnrollmentStatus, Badge> = {
  PENDING: { label: "Aguarda aprovação", tone: "bg-warning-soft text-warning" },
  APPROVED: { label: "Aprovada", tone: "bg-success-soft text-success" },
  REJECTED: { label: "Recusada", tone: "bg-danger/10 text-danger" },
  CANCELLED: { label: "Cancelada", tone: "bg-line text-ink-soft" },
};

export const PAYMENT_STATUS: Record<PaymentStatus, Badge> = {
  NOT_REQUIRED: { label: "Sem pagamento", tone: "bg-line text-ink-soft" },
  PENDING: { label: "Pagamento pendente", tone: "bg-warning-soft text-warning" },
  PROOF_SUBMITTED: { label: "Comprovativo em análise", tone: "bg-primary/10 text-primary" },
  CONFIRMED: { label: "Pagamento confirmado", tone: "bg-success-soft text-success" },
  REJECTED: { label: "Comprovativo recusado", tone: "bg-danger/10 text-danger" },
};

const isClosed = (enrollment: Enrollment) =>
  enrollment.status === "CANCELLED" || enrollment.status === "REJECTED";

/** O aluno pode (re)enviar comprovativo: aula paga, inscrição ativa e pagamento por resolver. */
export function canSubmitProof(enrollment: Enrollment) {
  return (
    !isClosed(enrollment) &&
    (enrollment.payment_status === "PENDING" || enrollment.payment_status === "REJECTED")
  );
}

/** Cancelamento permitido enquanto a inscrição está ativa e o pagamento não foi confirmado. */
export function canCancel(enrollment: Enrollment) {
  return !isClosed(enrollment) && enrollment.payment_status !== "CONFIRMED";
}

/** Próximo passo para o aluno, em linguagem simples. */
export function nextStepFor(enrollment: Enrollment): string | null {
  if (enrollment.status === "CANCELLED") return null;
  if (enrollment.status === "REJECTED") return "O mentor recusou este pedido.";
  if (enrollment.status === "PENDING") return "Aguarde a resposta do mentor.";

  switch (enrollment.payment_status) {
    case "PENDING":
      return "Envie o comprovativo de pagamento para garantir a vaga.";
    case "REJECTED":
      return "O comprovativo foi recusado. Envie um novo.";
    case "PROOF_SUBMITTED":
      return "O mentor está a validar o seu comprovativo.";
    default:
      return "Tudo pronto! Prepare-se para os encontros.";
  }
}

/** Inscrição concluída: aprovada e sem pagamento por resolver. */
export function isConfirmed(enrollment: Enrollment) {
  return (
    enrollment.status === "APPROVED" &&
    (enrollment.payment_status === "CONFIRMED" || enrollment.payment_status === "NOT_REQUIRED")
  );
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
