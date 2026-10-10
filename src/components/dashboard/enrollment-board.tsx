"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { Check, Download, Inbox, X } from "lucide-react";
import toast from "react-hot-toast";
import { StatusBadge } from "@/components/enrollments/status-badge";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/states";
import { ApiError } from "@/lib/api/client";
import type { Enrollment } from "@/lib/api/types";
import { openBlob } from "@/lib/download";
import { formatDateTime, isConfirmed } from "@/lib/enrollment";
import { formatCoursePrice, initials } from "@/lib/format";
import { decideEnrollment, downloadStudentProof } from "@/services/mentor-enrollment.service";

type Column = "pedidos" | "pagamento" | "confirmados";

const COLUMNS: Array<{ value: Column; label: string; dot: string; empty: string }> = [
  { value: "pedidos", label: "Novos pedidos", dot: "bg-warning", empty: "Sem pedidos novos." },
  { value: "pagamento", label: "Pagamento", dot: "bg-primary", empty: "Nenhum pagamento em curso." },
  { value: "confirmados", label: "Confirmados", dot: "bg-success", empty: "Ainda sem alunos confirmados." },
];

export function columnOf(enrollment: Enrollment): Column | "encerrados" {
  if (enrollment.status === "CANCELLED" || enrollment.status === "REJECTED") return "encerrados";
  if (enrollment.status === "PENDING") return "pedidos";
  return isConfirmed(enrollment) ? "confirmados" : "pagamento";
}

function NoteForm({
  title,
  placeholder,
  confirmLabel,
  onCancel,
  onConfirm,
  isSubmitting,
}: {
  title: string;
  placeholder: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: (note: string) => void;
  isSubmitting: boolean;
}) {
  const [note, setNote] = useState("");
  return (
    <div className="mt-3 space-y-2 rounded-lg bg-canvas p-3">
      <p className="text-xs font-bold text-ink">{title}</p>
      <textarea
        rows={2}
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder={placeholder}
        className="w-full resize-none rounded-md border border-line-strong bg-panel px-2.5 py-2 text-xs text-ink outline-none focus:border-primary focus:ring-1 focus:ring-primary"
      />
      <div className="flex gap-2">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => onConfirm(note.trim())}
          className="rounded-md bg-danger px-3 py-1.5 text-xs font-bold text-white disabled:opacity-60"
        >
          {isSubmitting ? "A enviar…" : confirmLabel}
        </button>
        <button
          type="button"
          disabled={isSubmitting}
          onClick={onCancel}
          className="rounded-md px-3 py-1.5 text-xs font-bold text-ink-soft hover:bg-line"
        >
          Voltar
        </button>
      </div>
    </div>
  );
}

function RequestCard({
  enrollment,
  onChange,
}: {
  enrollment: Enrollment;
  onChange: (next: Enrollment) => void;
}) {
  const [busy, setBusy] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState<"pedido" | "pagamento" | null>(null);

  async function act(action: Parameters<typeof decideEnrollment>[1], success: string, note?: string) {
    setBusy(action);
    try {
      const updated = await decideEnrollment(enrollment.id, action, note);
      toast.success(success);
      setRejecting(null);
      onChange(updated);
    } catch (reason) {
      toast.error(reason instanceof ApiError ? reason.message : "Não foi possível concluir a ação.");
    } finally {
      setBusy(null);
    }
  }

  async function viewProof() {
    setBusy("proof");
    try {
      openBlob(await downloadStudentProof(enrollment.id));
    } catch (reason) {
      toast.error(reason instanceof ApiError ? reason.message : "Não foi possível abrir o comprovativo.");
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

      {column === "pagamento" && (
        <div className="mt-3">
          <StatusBadge kind="payment" status={enrollment.payment_status} />
        </div>
      )}

      {column === "pedidos" && !rejecting && (
        <div className="mt-4 flex gap-2">
          <Button size="sm" onClick={() => act("approve", "Pedido aprovado.")} isLoading={busy === "approve"} disabled={busy !== null}>
            {busy !== "approve" && <Check size={14} />}
            Aprovar
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setRejecting("pedido")} disabled={busy !== null}>
            Recusar
          </Button>
        </div>
      )}

      {column === "pagamento" && enrollment.payment_status === "PROOF_SUBMITTED" && !rejecting && (
        <div className="mt-4 flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" onClick={viewProof} isLoading={busy === "proof"} disabled={busy !== null}>
            {busy !== "proof" && <Download size={14} />}
            Ver
          </Button>
          <Button size="sm" variant="green" onClick={() => act("confirm-payment", "Pagamento confirmado.")} isLoading={busy === "confirm-payment"} disabled={busy !== null}>
            {busy !== "confirm-payment" && <Check size={14} />}
            Confirmar
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setRejecting("pagamento")} disabled={busy !== null} className="text-danger hover:bg-danger/5">
            <X size={14} />
            Recusar
          </Button>
        </div>
      )}

      {column === "pagamento" && enrollment.payment_status !== "PROOF_SUBMITTED" && (
        <p className="mt-3 text-xs text-ink-soft">
          {enrollment.payment_status === "REJECTED"
            ? "Aguardando novo comprovativo do aluno."
            : "Aguardando o comprovativo do aluno."}
        </p>
      )}

      {rejecting === "pedido" && (
        <NoteForm
          title="Recusar pedido"
          placeholder="Motivo (opcional, visível para o aluno)"
          confirmLabel="Recusar pedido"
          onCancel={() => setRejecting(null)}
          onConfirm={(note) => act("reject", "Pedido recusado.", note)}
          isSubmitting={busy === "reject"}
        />
      )}
      {rejecting === "pagamento" && (
        <NoteForm
          title="Recusar comprovativo"
          placeholder="O que está errado? (opcional)"
          confirmLabel="Recusar comprovativo"
          onCancel={() => setRejecting(null)}
          onConfirm={(note) => act("reject-payment", "Comprovativo recusado. O aluno pode enviar outro.", note)}
          isSubmitting={busy === "reject-payment"}
        />
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
          <p className="text-sm text-ink-soft">Aprove pedidos e valide comprovativos de pagamento.</p>
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
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
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
