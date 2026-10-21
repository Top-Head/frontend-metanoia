import clsx from "clsx";
import type { Enrollment } from "@/lib/api/types";

type StepState = "done" | "current" | "failed" | "upcoming";

export interface TrackStep {
  label: string;
  state: StepState;
}

export function trackSteps(enrollment: Enrollment): TrackStep[] {
  const { status } = enrollment;
  return [
    { label: "Pedido enviado", state: "done" },
    {
      label: status === "REJECTED" ? "Recusado pelo mentor" : "Aprovação do mentor",
      state:
        status === "APPROVED" ? "done" : status === "REJECTED" ? "failed" : status === "CANCELLED" ? "upcoming" : "current",
    },
    {
      label: status === "CANCELLED" ? "Inscrição cancelada" : "Vaga garantida",
      state: status === "APPROVED" ? "done" : status === "CANCELLED" ? "failed" : "upcoming",
    },
  ];
}

const BAR: Record<StepState, string> = {
  done: "bg-primary",
  current: "bg-warning",
  failed: "bg-danger",
  upcoming: "bg-tone",
};

const LABEL: Record<StepState, string> = {
  done: "text-ink",
  current: "text-warning-ink font-semibold",
  failed: "text-danger font-semibold",
  upcoming: "text-ink-faint",
};

/** O percurso de uma inscrição em três passos, como uma barra segmentada. */
export function EnrollmentTrack({ enrollment, className }: { enrollment: Enrollment; className?: string }) {
  const steps = trackSteps(enrollment);
  return (
    <ol className={clsx("grid grid-cols-3 gap-1.5", className)} aria-label="Percurso da inscrição">
      {steps.map((step) => (
        <li key={step.label} className="min-w-0">
          <span aria-hidden="true" className={clsx("block h-1.5 rounded-full", BAR[step.state])} />
          <span className={clsx("mt-2 block truncate text-xs", LABEL[step.state])}>
            {step.label}
            <span className="sr-only">
              {step.state === "done" ? " (concluído)" : step.state === "current" ? " (em curso)" : step.state === "failed" ? " (interrompido)" : " (por fazer)"}
            </span>
          </span>
        </li>
      ))}
    </ol>
  );
}
