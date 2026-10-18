"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { Check, Inbox } from "lucide-react";
import toast from "react-hot-toast";
import { StatusBadge } from "@/components/enrollments/status-badge";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/states";
import { ApiError } from "@/lib/api/client";
import type { Enrollment } from "@/lib/api/types";
import { formatDateTime } from "@/lib/enrollment";
import { formatCoursePrice, initials } from "@/lib/format";
import { decideEnrollment } from "@/services/mentor-enrollment.service";

type Column = "pedidos" | "confirmados";

const COLUMNS: Array<{ value: Column; label: string; dot: string; empty: string }> = [
  { value: "pedidos", label: "Novos pedidos", dot: "bg-warning", empty: "Sem pedidos novos." },
  { value: "confirmados", label: "Confirmados", dot: "bg-success", empty: "Ainda sem alunos confirmados." },
];

export function columnOf(enrollment: Enrollment): Column | "encerrados" {
  if (enrollment.status === "CANCELLED" || enrollment.status === "REJECTED") return "encerrados";
  if (enrollment.status === "PENDING") return "pedidos";
  return "confirmados";
}

function RequestCard({
  enrollment,
  onChange,
}: {
  enrollment: Enrollment;
  onChange: (next: Enrollment) => void;
}) {
  const [busy, setBusy] = useState<string | null>(null);

  async function act(action: Parameters<typeof decideEnrollment>[1], success: string) {
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

  const column = columnOf(enrollment);

  return (
    <div className="rounded-xl border border-line-strong bg-panel p-4 shadow-card">
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
          {initials(enrollment.student_name || "?")}
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold text-ink">{enrollment.student_name}</h3>
          <p className="truncate text-xs text-ink-soft">
            {enrollment.course.title} · {enrollment.session.name}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-ink-faint">
        <span>{formatDateTime(enrollment.requested_at)}</span>
        <span>·</span>
        <span className="font-semibold text-ink-soft">{formatCoursePrice(enrollment.course)}</span>
      </div>

      {column === "pedidos" && (
        <div className="mt-4 flex gap-2">
          <Button size="sm" onClick={() => act("approve", "Pedido aprovado.")} isLoading={busy === "approve"} disabled={busy !== null}>
            {busy !== "approve" && <Check size={14} />}
            Aprovar
          </Button>
          <Button size="sm" variant="secondary" onClick={() => act("reject", "Pedido recusado.")} isLoading={busy === "reject"} disabled={busy !== null}>
            Recusar
          </Button>
        </div>
      )}

    </div>
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
  const closed = (enrollments ?? []).filter((item) => columnOf(item) === "encerrados");

  return (
    <section className="py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-ink">Inscrições</h2>
          <p className="text-sm text-ink-soft">Aprove ou recuse os pedidos de inscrição.</p>
        </div>
        {closed.length > 0 && (
          <button
            type="button"
            onClick={() => setShowClosed((value) => !value)}
            className="text-sm font-bold text-primary hover:underline"
          >
            {showClosed ? "Ocultar encerradas" : `Ver encerradas (${closed.length})`}
          </button>
        )}
      </div>

      {error ? (
        <div className="mt-6">
          <ErrorState message={error.message} onRetry={onRetry} />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {COLUMNS.map(({ value, label, dot, empty }) => {
            const items = (enrollments ?? []).filter((item) => columnOf(item) === value);
            return (
              <div key={value} className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={clsx("size-2 rounded-full", dot)} />
                  <h3 className="text-base font-bold text-ink">{label}</h3>
                  {!isLoading && <span className="text-xs text-ink-faint">({items.length})</span>}
                </div>
                <div className="mt-4 space-y-3">
                  {isLoading ? (
                    <span className="block h-32 animate-pulse rounded-xl bg-line" />
                  ) : items.length > 0 ? (
                    items.map((enrollment) => (
                      <RequestCard key={enrollment.id} enrollment={enrollment} onChange={onChange} />
                    ))
                  ) : (
                    <p className="rounded-xl border border-dashed border-line-strong px-4 py-6 text-center text-xs text-ink-faint">
                      {empty}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!isLoading && !error && enrollments?.length === 0 && (
        <div className="mt-6 flex items-center gap-3 rounded-xl bg-primary/5 p-4 text-sm text-ink-soft">
          <Inbox size={18} className="shrink-0 text-primary" />
          <span>
            Os pedidos de inscrição aparecem aqui quando os alunos se inscreverem nas suas aulas.{" "}
            <Link href="/dashboard/aulas" className="font-bold text-primary hover:underline">
              Gerir aulas
            </Link>
          </span>
        </div>
      )}

      {showClosed && closed.length > 0 && (
        <div className="mt-6 divide-y divide-line rounded-xl border border-line bg-panel">
          {closed.map((enrollment) => (
            <div key={enrollment.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-ink">{enrollment.student_name}</p>
                <p className="truncate text-xs text-ink-soft">
                  {enrollment.course.title} · {enrollment.session.name}
                </p>
              </div>
              <StatusBadge kind="enrollment" status={enrollment.status} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
