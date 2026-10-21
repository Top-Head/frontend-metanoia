"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { Check, ExternalLink, MessagesSquare, X } from "lucide-react";
import toast from "react-hot-toast";
import { EmptyNote, ErrorNote, PageHeader, Panel, Skeleton, Spinner, buttonClass } from "@/components/app/ui";
import { useApiQuery } from "@/hooks/useApiQuery";
import { ApiError } from "@/lib/api/client";
import type { Enrollment } from "@/lib/api/types";
import { canCancel, formatDateTime, isConfirmed, nextStepFor } from "@/lib/enrollment";
import { COURSE_TYPE_LABEL, MODALITY_LABEL, formatCoursePrice } from "@/lib/format";
import { cancelEnrollment, getMyEnrollment } from "@/services/enrollment.service";
import { StatusBadge } from "./status-badge";

type StepState = "done" | "current" | "failed" | "upcoming";

interface Step {
  title: string;
  description: string;
  state: StepState;
}

function buildSteps(enrollment: Enrollment): Step[] {
  const { status } = enrollment;
  const cancelled = status === "CANCELLED";

  return [
    { title: "Pedido enviado", description: formatDateTime(enrollment.requested_at), state: "done" },
    {
      title: "Aprovação do mentor",
      description:
        status === "APPROVED"
          ? enrollment.decided_at
            ? `Aprovado a ${formatDateTime(enrollment.decided_at)}`
            : "Aprovado"
          : status === "REJECTED"
            ? "O mentor recusou o pedido"
            : cancelled
              ? "Não concluída"
              : "À espera da resposta do mentor",
      state: status === "APPROVED" ? "done" : status === "REJECTED" ? "failed" : cancelled ? "upcoming" : "current",
    },
    {
      title: "Vaga garantida",
      description: isConfirmed(enrollment)
        ? "Tem acesso aos encontros e à conversa da turma"
        : cancelled
          ? "Inscrição cancelada"
          : status === "REJECTED"
            ? "Sem vaga nesta turma"
            : "Depois da aprovação",
      state: isConfirmed(enrollment) ? "done" : cancelled ? "failed" : "upcoming",
    },
  ];
}

const STEP_MARK: Record<StepState, string> = {
  done: "bg-primary text-white",
  current: "bg-warning text-white",
  failed: "bg-danger text-white",
  upcoming: "bg-tone text-ink-faint",
};

function Steps({ steps }: { steps: Step[] }) {
  return (
    <ol>
      {steps.map((step, index) => (
        <li key={step.title} className="relative flex gap-4 pb-6 last:pb-0">
          {index < steps.length - 1 && (
            <span
              aria-hidden="true"
              className={clsx(
                "absolute left-[13px] top-8 h-[calc(100%-2rem)] w-0.5 rounded-full",
                step.state === "done" ? "bg-primary" : "bg-tone"
              )}
            />
          )}
          <span className={clsx("relative flex size-7 shrink-0 items-center justify-center rounded-full", STEP_MARK[step.state])}>
            {step.state === "done" && <Check size={14} strokeWidth={3} aria-hidden="true" />}
            {step.state === "failed" && <X size={14} strokeWidth={3} aria-hidden="true" />}
            {step.state === "current" && <span aria-hidden="true" className="size-2 rounded-full bg-white" />}
          </span>
          <div className="pt-0.5">
            <p className={clsx("text-[15px] font-semibold", step.state === "upcoming" ? "text-ink-soft" : "text-ink")}>
              {step.title}
            </p>
            <p className="text-[13px] text-ink-soft">{step.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function CancelSection({ enrollment, onChange }: { enrollment: Enrollment; onChange: (next: Enrollment) => void }) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  async function confirmCancel() {
    setIsCancelling(true);
    try {
      const updated = await cancelEnrollment(enrollment.id);
      toast.success("Inscrição cancelada.");
      onChange(updated);
    } catch (reason) {
      toast.error(reason instanceof ApiError ? reason.message : "Não foi possível cancelar a inscrição.");
    } finally {
      setIsCancelling(false);
      setIsConfirming(false);
    }
  }

  if (!canCancel(enrollment)) return null;

  return isConfirming ? (
    <div role="alertdialog" aria-labelledby="cancel-title" className="rounded-lg bg-danger-soft p-5">
      <p id="cancel-title" className="font-semibold text-ink">
        Cancelar esta inscrição?
      </p>
      <p className="mt-1 text-sm text-ink-soft">A sua vaga na turma é libertada. Esta ação não pode ser desfeita.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={() => setIsConfirming(false)} disabled={isCancelling} className={buttonClass("secondary", "sm")}>
          Manter inscrição
        </button>
        <button type="button" onClick={confirmCancel} disabled={isCancelling} className={buttonClass("danger", "sm")}>
          {isCancelling && <Spinner />}
          Sim, cancelar
        </button>
      </div>
    </div>
  ) : (
    <button type="button" onClick={() => setIsConfirming(true)} className="text-sm font-semibold text-danger hover:underline">
      Cancelar inscrição
    </button>
  );
}

export function EnrollmentDetailView({ id }: { id: number }) {
  const valid = Number.isInteger(id) && id > 0;
  const { data: enrollment, error, isLoading, reload, mutate } = useApiQuery(
    valid ? `my-enrollment-${id}` : null,
    () => getMyEnrollment(id)
  );
  const back = { href: "/aluno/inscricoes", label: "Inscrições" };

  if (!valid || error?.status === 404) {
    return (
      <>
        <PageHeader back={back} title="Inscrição não encontrada" />
        <EmptyNote title="Esta inscrição não existe ou não pertence à sua conta." />
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageHeader back={back} title="Inscrição" />
        <ErrorNote message={error.message} onRetry={reload} />
      </>
    );
  }

  if (isLoading || !enrollment) {
    return (
      <div className="space-y-4" aria-busy="true">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-10 w-2/3" />
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <Skeleton className="h-72" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  const { course, session } = enrollment;
  const confirmed = isConfirmed(enrollment);

  return (
    <>
      <PageHeader
        back={back}
        title={course.title}
        description={[session.name, course.type && COURSE_TYPE_LABEL[course.type], course.modality && MODALITY_LABEL[course.modality]]
          .filter(Boolean)
          .join(" · ")}
        actions={
          confirmed ? (
            <Link href="/messages" className={buttonClass("primary")}>
              <MessagesSquare size={16} aria-hidden="true" />
              Conversa da turma
            </Link>
          ) : undefined
        }
      />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Panel title="Percurso" description={nextStepFor(enrollment) ?? undefined} actions={<StatusBadge kind="enrollment" status={enrollment.status} />}>
          <Steps steps={buildSteps(enrollment)} />
          {enrollment.decision_note && (
            <div className="mt-6 rounded-md bg-tone p-4">
              <p className="text-[13px] font-semibold text-ink-soft">Nota do mentor</p>
              <p className="mt-1 whitespace-pre-line text-sm text-ink">{enrollment.decision_note}</p>
            </div>
          )}
        </Panel>

        <aside className="space-y-6">
          <div className="rounded-lg bg-rail p-6 text-rail-ink">
            <p className="text-[13px] text-rail-muted">Valor da aula</p>
            <p className="mt-1 font-display text-[32px] font-semibold leading-none tracking-[-0.02em] text-white tabular-nums">
              {formatCoursePrice(course)}
            </p>
            {course.location && <p className="mt-4 text-sm text-rail-muted">{course.location}</p>}
            <Link
              href={`/aluno/catalogo/${course.id}`}
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:underline"
            >
              Página da aula e encontros
              <ExternalLink size={14} aria-hidden="true" />
            </Link>
          </div>
          <CancelSection enrollment={enrollment} onChange={mutate} />
        </aside>
      </div>
    </>
  );
}
