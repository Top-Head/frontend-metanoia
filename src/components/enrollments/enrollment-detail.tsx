"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import {
  ArrowLeft,
  Check,
  Clock,
  ExternalLink,
  FileSearch,
  PartyPopper,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { useApiQuery } from "@/hooks/useApiQuery";
import { ApiError } from "@/lib/api/client";
import type { Enrollment } from "@/lib/api/types";
import {
  canCancel,
  formatDateTime,
  isConfirmed,
  nextStepFor,
} from "@/lib/enrollment";
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

  const steps: Step[] = [
    {
      title: "Pedido enviado",
      description: formatDateTime(enrollment.requested_at),
      state: "done",
    },
    {
      title: "Aprovação do mentor",
      description:
        status === "APPROVED"
          ? enrollment.decided_at
            ? `Aprovado em ${formatDateTime(enrollment.decided_at)}`
            : "Aprovado"
          : status === "REJECTED"
            ? "Pedido recusado"
            : cancelled
              ? "Não concluída"
              : "Aguardando resposta",
      state:
        status === "APPROVED" ? "done" : status === "REJECTED" ? "failed" : cancelled ? "upcoming" : "current",
    },
  ];

  steps.push({
    title: "Inscrição confirmada",
    description: isConfirmed(enrollment)
      ? "Acesso à aula disponível"
      : cancelled
        ? "Inscrição cancelada"
        : status === "REJECTED"
          ? "Pedido recusado"
          : "Pendente",
    state: isConfirmed(enrollment) ? "done" : "upcoming",
  });

  return steps;
}

const STEP_STYLE: Record<StepState, { dot: string; icon: React.ReactNode }> = {
  done: { dot: "bg-success text-white", icon: <Check size={14} strokeWidth={3} /> },
  current: { dot: "bg-primary text-white ring-4 ring-primary/15", icon: <Clock size={14} /> },
  failed: { dot: "bg-danger text-white", icon: <X size={14} strokeWidth={3} /> },
  upcoming: { dot: "border-2 border-line-strong bg-panel text-ink-faint", icon: null },
};

function Steps({ steps }: { steps: Step[] }) {
  return (
    <ol className="space-y-5">
      {steps.map((step, index) => (
        <li key={step.title} className="relative flex gap-4">
          {index < steps.length - 1 && (
            <span aria-hidden="true" className="absolute left-3.5 top-8 h-[calc(100%-0.75rem)] w-px bg-line-strong" />
          )}
          <span
            className={clsx(
              "relative flex size-7 shrink-0 items-center justify-center rounded-full",
              STEP_STYLE[step.state].dot
            )}
          >
            {STEP_STYLE[step.state].icon}
          </span>
          <div className="pt-0.5">
            <p className={clsx("text-sm font-bold", step.state === "upcoming" ? "text-ink-faint" : "text-ink")}>
              {step.title}
            </p>
            <p className="text-xs text-ink-soft">{step.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function InvestmentSection({ enrollment }: { enrollment: Enrollment }) {
  return (
    <section className="rounded-2xl border border-line bg-panel p-6 shadow-card">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-ink">Investimento</h2>
        <StatusBadge kind="payment" status={enrollment.payment_status} />
      </div>

      <div className="flex items-baseline justify-between rounded-xl bg-canvas p-4">
        <span className="text-sm text-ink-soft">Valor da aula</span>
        <span className="text-xl font-bold text-ink">{formatCoursePrice(enrollment.course)}</span>
      </div>

      {enrollment.payment_status === "CONFIRMED" && enrollment.payment_decided_at && (
        <p className="mt-3 text-sm text-ink-soft">
          Pagamento confirmado em {formatDateTime(enrollment.payment_decided_at)}.
        </p>
      )}
    </section>
  );
}

function CancelSection({
  enrollment,
  onChange,
}: {
  enrollment: Enrollment;
  onChange: (next: Enrollment) => void;
}) {
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

  return (
    <div className="rounded-2xl border border-line bg-panel p-6">
      {isConfirming ? (
        <div>
          <p className="font-bold text-ink">Cancelar esta inscrição?</p>
          <p className="mt-1 text-sm text-ink-soft">
            A sua vaga na turma será libertada. Esta ação não pode ser desfeita.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={confirmCancel}
              disabled={isCancelling}
              className="rounded-lg bg-danger px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {isCancelling ? "A cancelar…" : "Sim, cancelar"}
            </button>
            <button
              type="button"
              onClick={() => setIsConfirming(false)}
              disabled={isCancelling}
              className="rounded-lg px-4 py-2 text-sm font-bold text-ink-soft transition-colors hover:bg-canvas"
            >
              Manter inscrição
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-ink-soft">Mudou de planos?</p>
          <button
            type="button"
            onClick={() => setIsConfirming(true)}
            className="text-sm font-bold text-danger hover:underline"
          >
            Cancelar inscrição
          </button>
        </div>
      )}
    </div>
  );
}

export function EnrollmentDetailView({ id }: { id: number }) {
  const valid = Number.isInteger(id) && id > 0;
  const { data: enrollment, error, isLoading, reload, mutate } = useApiQuery(
    valid ? `my-enrollment-${id}` : null,
    () => getMyEnrollment(id)
  );

  const backLink = (
    <Link
      href="/aluno/inscricoes"
      className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-ink-soft transition-colors hover:text-primary"
    >
      <ArrowLeft size={16} />
      Minhas inscrições
    </Link>
  );

  if (!valid || error?.status === 404) {
    return (
      <>
        {backLink}
        <EmptyState
          icon={<FileSearch size={22} />}
          title="Inscrição não encontrada"
          description="Esta inscrição não existe ou não pertence à sua conta."
        />
      </>
    );
  }

  if (error) {
    return (
      <>
        {backLink}
        <ErrorState message={error.message} onRetry={reload} />
      </>
    );
  }

  if (isLoading || !enrollment) {
    return (
      <>
        {backLink}
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]" aria-busy="true">
          <span className="block h-80 animate-pulse rounded-2xl bg-line" />
          <span className="block h-64 animate-pulse rounded-2xl bg-line" />
        </div>
      </>
    );
  }

  const { course, session } = enrollment;
  const step = nextStepFor(enrollment);

  return (
    <>
      {backLink}

      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-wide text-primary">{course.category_name}</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-ink">{course.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <StatusBadge kind="enrollment" status={enrollment.status} />
          <span className="text-sm text-ink-soft">
            {session.name}
            {course.type && ` · ${COURSE_TYPE_LABEL[course.type]}`}
            {course.modality && ` · ${MODALITY_LABEL[course.modality]}`}
          </span>
        </div>
      </div>

      {isConfirmed(enrollment) && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl bg-success-soft p-5 text-success">
          <PartyPopper size={22} className="shrink-0" />
          <div>
            <p className="font-bold">Inscrição confirmada!</p>
            <p className="text-sm">A sua vaga está garantida. Consulte as datas dos encontros na página da aula.</p>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-line bg-panel p-6 shadow-card">
            <h2 className="mb-1 text-lg font-bold text-ink">Progresso</h2>
            {step && <p className="mb-6 text-sm text-ink-soft">{step}</p>}
            <Steps steps={buildSteps(enrollment)} />

            {enrollment.decision_note && (
              <div className="mt-6 rounded-xl bg-canvas p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-ink-faint">Nota do mentor</p>
                <p className="mt-1 whitespace-pre-line text-sm text-ink">{enrollment.decision_note}</p>
              </div>
            )}
          </section>

          <CancelSection enrollment={enrollment} onChange={mutate} />
        </div>

        <div className="space-y-6">
          <InvestmentSection enrollment={enrollment} />

          <section className="rounded-2xl border border-line bg-panel p-6">
            <h2 className="mb-3 text-sm font-bold text-ink">Sobre a aula</h2>
            {course.location && <p className="mb-2 text-sm text-ink-soft">{course.location}</p>}
            <Link
              href={`/aluno/catalogo/${course.id}`}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
            >
              Ver página da aula e encontros
              <ExternalLink size={14} />
            </Link>
          </section>
        </div>
      </div>
    </>
  );
}
