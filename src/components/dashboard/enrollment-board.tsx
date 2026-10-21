"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { Check, ChevronDown, X } from "lucide-react";
import toast from "react-hot-toast";
import { Avatar, EmptyNote, ErrorNote, Skeleton, Spinner, buttonClass } from "@/components/app/ui";
import { StatusBadge } from "@/components/enrollments/status-badge";
import { ApiError } from "@/lib/api/client";
import type { Enrollment } from "@/lib/api/types";
import { formatCoursePrice } from "@/lib/format";
import { decideEnrollment } from "@/services/mentor-enrollment.service";

type Column = "pedidos" | "confirmados";

export function columnOf(enrollment: Enrollment): Column | "encerrados" {
  if (enrollment.status === "CANCELLED" || enrollment.status === "REJECTED") return "encerrados";
  if (enrollment.status === "PENDING") return "pedidos";
  return "confirmados";
}

const RELATIVE = new Intl.RelativeTimeFormat("pt-PT", { numeric: "auto" });

function requestedAgo(value: string) {
  const minutes = Math.round((new Date(value).getTime() - Date.now()) / 60_000);
  if (Math.abs(minutes) < 60) return RELATIVE.format(Math.min(minutes, -1), "minute");
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return RELATIVE.format(hours, "hour");
  return RELATIVE.format(Math.round(hours / 24), "day");
}

function RequestRow({ enrollment, onChange }: { enrollment: Enrollment; onChange: (next: Enrollment) => void }) {
  const [busy, setBusy] = useState<"approve" | "reject" | null>(null);

  async function act(action: "approve" | "reject", success: string) {
    setBusy(action);
    try {
      const updated = await decideEnrollment(enrollment.id, action);
      toast.success(success);
      onChange(updated);
    } catch (reason) {
      toast.error(reason instanceof ApiError ? reason.message : "Não foi possível concluir a ação.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <li className="flex flex-col gap-4 px-5 py-4 transition-colors hover:bg-canvas sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Avatar name={enrollment.student_name || "?"} />
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold text-ink">{enrollment.student_name}</p>
          <p className="truncate text-[13px] text-ink-soft">
            {enrollment.course.title} · {enrollment.session.name}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <div className="text-left sm:text-right">
          <p className="text-sm font-semibold tabular-nums text-ink">{formatCoursePrice(enrollment.course)}</p>
          <p className="text-xs text-ink-soft">Pedido {requestedAgo(enrollment.requested_at)}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => act("reject", "Pedido recusado.")}
            disabled={busy !== null}
            aria-label={`Recusar o pedido de ${enrollment.student_name}`}
            className={buttonClass("secondary", "sm")}
          >
            {busy === "reject" ? <Spinner /> : <X size={14} aria-hidden="true" />}
            Recusar
          </button>
          <button
            type="button"
            onClick={() => act("approve", "Pedido aprovado.")}
            disabled={busy !== null}
            aria-label={`Aprovar o pedido de ${enrollment.student_name}`}
            className={buttonClass("primary", "sm")}
          >
            {busy === "approve" ? <Spinner /> : <Check size={14} aria-hidden="true" />}
            Aprovar
          </button>
        </div>
      </div>
    </li>
  );
}

function RosterRow({ enrollment }: { enrollment: Enrollment }) {
  return (
    <li className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 px-5 py-3 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto]">
      <span className="flex min-w-0 items-center gap-3">
        <Avatar name={enrollment.student_name || "?"} size="sm" />
        <span className="truncate text-sm font-semibold text-ink">{enrollment.student_name}</span>
      </span>
      <span className="hidden truncate text-[13px] text-ink-soft sm:block">
        {enrollment.course.title} · {enrollment.session.name}
      </span>
      <StatusBadge kind="enrollment" status={enrollment.status} />
    </li>
  );
}

interface EnrollmentBoardProps {
  enrollments: Enrollment[] | undefined;
  isLoading: boolean;
  error: ApiError | null;
  onRetry: () => void;
  onChange: (next: Enrollment) => void;
}

export function EnrollmentBoard({ enrollments, isLoading, error, onRetry, onChange }: EnrollmentBoardProps) {
  const [showClosed, setShowClosed] = useState(false);
  const list = enrollments ?? [];
  const pending = list.filter((item) => columnOf(item) === "pedidos");
  const confirmed = list.filter((item) => columnOf(item) === "confirmados");
  const closed = list.filter((item) => columnOf(item) === "encerrados");

  if (error) return <ErrorNote message={error.message} onRetry={onRetry} />;

  return (
    <div className="space-y-6">
      <section aria-labelledby="queue-title" className="overflow-hidden rounded-lg border border-line bg-panel">
        <div className="flex items-baseline justify-between gap-3 px-5 pb-3 pt-5">
          <div>
            <h2 id="queue-title" className="text-base font-semibold text-ink">
              Pedidos por decidir
            </h2>
            <p className="mt-0.5 text-[13px] text-ink-soft">
              Quem aprovar fica com a vaga na turma e passa a ver a conversa da turma.
            </p>
          </div>
          {!isLoading && (
            <span
              className={clsx(
                "font-display text-2xl font-semibold tabular-nums",
                pending.length > 0 ? "text-warning-ink" : "text-ink-faint"
              )}
            >
              {pending.length}
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-2 px-5 pb-5">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        ) : pending.length > 0 ? (
          <ul className="divide-y divide-line border-t border-line">
            {pending.map((enrollment) => (
              <RequestRow key={enrollment.id} enrollment={enrollment} onChange={onChange} />
            ))}
          </ul>
        ) : list.length === 0 ? (
          <div className="px-5 pb-5">
            <EmptyNote title="Ainda sem pedidos">
              Os pedidos aparecem aqui quando um aluno se inscreve numa das suas turmas.{" "}
              <Link href="/dashboard/aulas" className="font-semibold text-primary hover:underline">
                Rever as aulas publicadas
              </Link>
            </EmptyNote>
          </div>
        ) : (
          <p className="mx-5 mb-5 flex items-center gap-2 rounded-md bg-tone px-4 py-3 text-sm text-ink-soft">
            <Check size={15} aria-hidden="true" className="text-success" />
            Respondeu a todos os pedidos. Os novos aparecem aqui assim que chegarem.
          </p>
        )}
      </section>

      {!isLoading && (confirmed.length > 0 || closed.length > 0) && (
        <section aria-labelledby="roster-title" className="overflow-hidden rounded-lg border border-line bg-panel">
          <div className="flex flex-wrap items-baseline justify-between gap-3 px-5 pb-3 pt-5">
            <h2 id="roster-title" className="text-base font-semibold text-ink">
              Alunos confirmados <span className="font-normal tabular-nums text-ink-soft">{confirmed.length}</span>
            </h2>
            {closed.length > 0 && (
              <button
                type="button"
                aria-expanded={showClosed}
                onClick={() => setShowClosed((value) => !value)}
                className="inline-flex items-center gap-1 text-[13px] font-semibold text-ink-soft hover:text-ink"
              >
                {showClosed ? "Ocultar encerradas" : `Encerradas (${closed.length})`}
                <ChevronDown size={14} className={clsx("transition-transform", showClosed && "rotate-180")} />
              </button>
            )}
          </div>
          {confirmed.length > 0 ? (
            <ul className="divide-y divide-line border-t border-line">
              {confirmed.map((enrollment) => (
                <RosterRow key={enrollment.id} enrollment={enrollment} />
              ))}
            </ul>
          ) : (
            <p className="border-t border-line px-5 py-4 text-sm text-ink-soft">Ainda não aprovou nenhum aluno.</p>
          )}
          {showClosed && (
            <ul className="divide-y divide-line border-t border-line bg-canvas">
              {closed.map((enrollment) => (
                <RosterRow key={enrollment.id} enrollment={enrollment} />
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
