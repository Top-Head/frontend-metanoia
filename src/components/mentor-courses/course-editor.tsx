"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { ArrowLeft, Archive, Ban, ExternalLink, Rocket, SearchX, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { useAuth } from "@/hooks/useAuth";
import { useApiQuery } from "@/hooks/useApiQuery";
import { ApiError } from "@/lib/api/client";
import type { CourseDetail } from "@/lib/api/types";
import { COURSE_STATUS } from "@/lib/course";
import { formatCoursePrice } from "@/lib/format";
import {
  changeCourseStatus,
  deleteCourse,
  getCourseForEdit,
  updateCourse,
} from "@/services/mentor-course.service";
import { CourseForm } from "./course-form";
import { SessionsManager } from "./sessions-manager";

type Tab = "turmas" | "detalhes";
type PendingAction = "archive" | "cancel" | "delete" | null;

const CONFIRM_COPY: Record<Exclude<PendingAction, null>, { title: string; body: string; cta: string }> = {
  archive: {
    title: "Arquivar esta aula?",
    body: "Deixa de aparecer no catálogo. As inscrições existentes mantêm-se.",
    cta: "Arquivar",
  },
  cancel: {
    title: "Cancelar esta aula?",
    body: "A aula sai do catálogo e fica cancelada. Avise os alunos inscritos.",
    cta: "Cancelar aula",
  },
  delete: {
    title: "Excluir este rascunho?",
    body: "A aula, as turmas e os encontros são apagados permanentemente.",
    cta: "Excluir",
  },
};

function StatusPanel({ course, onChanged }: { course: CourseDetail; onChanged: () => void }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState<PendingAction>(null);
  const status = course.status ?? "DRAFT";
  const activeSessions = course.sessions.filter((session) => session.is_active !== false).length;

  async function run(action: "publish" | "archive" | "cancel" | "delete") {
    setBusy(true);
    try {
      if (action === "delete") {
        await deleteCourse(course.id);
        toast.success("Rascunho excluído.");
        router.replace("/dashboard/aulas");
        return;
      }
      await changeCourseStatus(course.id, action);
      toast.success(
        action === "publish" ? "Aula publicada! Já aparece no catálogo." : action === "archive" ? "Aula arquivada." : "Aula cancelada."
      );
      setPending(null);
      onChanged();
    } catch (reason) {
      toast.error(reason instanceof ApiError ? reason.message : "Não foi possível concluir a ação.");
    } finally {
      setBusy(false);
    }
  }

  const hints: Record<string, string> = {
    DRAFT:
      activeSessions > 0
        ? "Tudo pronto? Publique para a aula aparecer no catálogo."
        : "Abra pelo menos uma turma antes de publicar.",
    PUBLISHED: "A aula está visível no catálogo e aceita inscrições.",
    ARCHIVED: "A aula está fora do catálogo. Pode publicá-la de novo.",
    CANCELLED: "A aula foi cancelada e não aceita inscrições.",
  };

  return (
    <div className="rounded-2xl border border-line bg-panel p-5 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className={clsx("rounded-full px-2.5 py-1 text-xs font-bold", COURSE_STATUS[status].tone)}>
            {COURSE_STATUS[status].label}
          </span>
          <p className="mt-2 text-sm text-ink-soft">{hints[status]}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {(status === "DRAFT" || status === "ARCHIVED") && (
            <Button onClick={() => run("publish")} isLoading={busy && pending === null} disabled={busy}>
              {!busy && <Rocket size={16} />}
              {status === "DRAFT" ? "Publicar" : "Publicar de novo"}
            </Button>
          )}
          {status === "PUBLISHED" && (
            <>
              <Link
                href={`/aulas/${course.id}`}
                className="inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-bold text-primary transition-colors hover:bg-primary/10"
              >
                <ExternalLink size={16} />
                Ver no catálogo
              </Link>
              <Button variant="secondary" onClick={() => setPending("archive")} disabled={busy}>
                <Archive size={16} />
                Arquivar
              </Button>
              <Button variant="ghost" onClick={() => setPending("cancel")} disabled={busy} className="text-danger hover:bg-danger/5">
                <Ban size={16} />
                Cancelar
              </Button>
            </>
          )}
          {status === "DRAFT" && (
            <Button variant="ghost" onClick={() => setPending("delete")} disabled={busy} className="text-danger hover:bg-danger/5">
              <Trash2 size={16} />
              Excluir
            </Button>
          )}
        </div>
      </div>

      {pending && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-danger/5 p-4">
          <div>
            <p className="text-sm font-bold text-ink">{CONFIRM_COPY[pending].title}</p>
            <p className="text-xs text-ink-soft">{CONFIRM_COPY[pending].body}</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => run(pending)}
              className="rounded-lg bg-danger px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
            >
              {busy ? "A processar…" : CONFIRM_COPY[pending].cta}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => setPending(null)}
              className="rounded-lg px-4 py-2 text-sm font-bold text-ink-soft hover:bg-panel"
            >
              Voltar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function CourseEditor({ id }: { id: number }) {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("turmas");
  const valid = Number.isInteger(id) && id > 0;
  const { data: course, error, isLoading, reload } = useApiQuery(valid ? `edit-course-${id}` : null, () =>
    getCourseForEdit(id)
  );

  const backLink = (
    <Link
      href="/dashboard/aulas"
      className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-ink-soft transition-colors hover:text-primary"
    >
      <ArrowLeft size={16} />
      Minhas aulas
    </Link>
  );

  const notMine = course && user?.mentor_profile && course.mentor.id !== user.mentor_profile.id;

  if (!valid || error?.status === 404 || notMine) {
    return (
      <div className="mx-auto max-w-4xl px-8">
        {backLink}
        <EmptyState
          icon={<SearchX size={22} />}
          title="Aula não encontrada"
          description="Esta aula não existe ou não pertence à sua conta."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-8">
      {backLink}

      {error ? (
        <ErrorState message={error.message} onRetry={reload} />
      ) : isLoading || !course ? (
        <div className="space-y-4" aria-busy="true">
          <span className="block h-10 w-2/3 animate-pulse rounded bg-line" />
          <span className="block h-24 animate-pulse rounded-2xl bg-line" />
          <span className="block h-64 animate-pulse rounded-2xl bg-line" />
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-primary">{course.category?.name}</p>
            <h1 className="mt-1 text-2xl font-bold text-ink">{course.title}</h1>
            <p className="text-sm text-ink-soft">{formatCoursePrice(course)}</p>
          </div>

          <StatusPanel course={course} onChanged={reload} />

          <div className="flex gap-1 rounded-xl bg-panel p-1 shadow-card" role="tablist">
            {(
              [
                ["turmas", `Turmas e encontros (${course.sessions.length})`],
                ["detalhes", "Detalhes da aula"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={tab === value}
                onClick={() => setTab(value)}
                className={clsx(
                  "flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
                  tab === value ? "bg-ink text-white" : "text-ink-soft hover:bg-canvas hover:text-ink"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === "turmas" ? (
            <SessionsManager course={course} onChanged={reload} />
          ) : (
            <div className="rounded-2xl border border-line bg-panel p-6 shadow-card md:p-8">
              <CourseForm
                key={course.updated_at}
                initial={course}
                submitLabel="Guardar alterações"
                onSubmit={async (payload) => {
                  await updateCourse(course.id, payload);
                  toast.success("Alterações guardadas.");
                  reload();
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
