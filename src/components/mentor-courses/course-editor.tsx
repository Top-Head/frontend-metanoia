"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Archive, Ban, ExternalLink, Rocket, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  EmptyNote,
  ErrorNote,
  PageHeader,
  Segmented,
  Skeleton,
  Spinner,
  Status,
  buttonClass,
} from "@/components/app/ui";
import { useAuth } from "@/hooks/useAuth";
import { useApiQuery } from "@/hooks/useApiQuery";
import { ApiError } from "@/lib/api/client";
import type { CourseDetail } from "@/lib/api/types";
import { COURSE_STATUS } from "@/lib/course";
import { COURSE_TYPE_LABEL, MODALITY_LABEL, formatCoursePrice } from "@/lib/format";
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
    body: "A aula sai do catálogo e fica cancelada. Avise os alunos inscritos na conversa da turma.",
    cta: "Cancelar aula",
  },
  delete: {
    title: "Excluir este rascunho?",
    body: "A aula, as turmas e os encontros são apagados permanentemente.",
    cta: "Excluir",
  },
};

function useStatusActions(course: CourseDetail, onChanged: () => void) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState<PendingAction>(null);

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
        action === "publish"
          ? "Aula publicada. Já aparece no catálogo."
          : action === "archive"
            ? "Aula arquivada."
            : "Aula cancelada."
      );
      setPending(null);
      onChanged();
    } catch (reason) {
      toast.error(reason instanceof ApiError ? reason.message : "Não foi possível concluir a ação.");
    } finally {
      setBusy(false);
    }
  }

  return { busy, pending, setPending, run };
}

type StatusActionsState = ReturnType<typeof useStatusActions>;

function StatusActions({ course, actions }: { course: CourseDetail; actions: StatusActionsState }) {
  const { busy, pending, setPending, run } = actions;
  const status = course.status ?? "DRAFT";
  const dangerQuiet = buttonClass("quiet", "md", "text-danger hover:text-danger");

  return (
    <>
      {status === "PUBLISHED" && (
        <>
          <Link href={`/aulas/${course.id}`} className={buttonClass("quiet")}>
            <ExternalLink size={15} aria-hidden="true" />
            Ver no catálogo
          </Link>
          <button type="button" onClick={() => setPending("cancel")} disabled={busy} className={dangerQuiet}>
            <Ban size={15} aria-hidden="true" />
            Cancelar
          </button>
          <button type="button" onClick={() => setPending("archive")} disabled={busy} className={buttonClass("secondary")}>
            <Archive size={15} aria-hidden="true" />
            Arquivar
          </button>
        </>
      )}
      {status === "DRAFT" && (
        <button type="button" onClick={() => setPending("delete")} disabled={busy} className={dangerQuiet}>
          <Trash2 size={15} aria-hidden="true" />
          Excluir
        </button>
      )}
      {(status === "DRAFT" || status === "ARCHIVED") && (
        <button type="button" onClick={() => run("publish")} disabled={busy} className={buttonClass("primary")}>
          {busy && pending === null ? <Spinner /> : <Rocket size={15} aria-hidden="true" />}
          {status === "DRAFT" ? "Publicar" : "Publicar de novo"}
        </button>
      )}
    </>
  );
}

function StatusLine({ course, actions }: { course: CourseDetail; actions: StatusActionsState }) {
  const { busy, pending, setPending, run } = actions;
  const status = course.status ?? "DRAFT";
  const activeSessions = course.sessions.filter((session) => session.is_active !== false).length;
  const hints: Record<string, string> = {
    DRAFT:
      activeSessions > 0
        ? "Pronta para publicar. Depois de publicada aparece no catálogo e aceita inscrições."
        : "Abra pelo menos uma turma antes de publicar.",
    PUBLISHED: "Visível no catálogo e a aceitar inscrições.",
    ARCHIVED: "Fora do catálogo. Pode publicá-la de novo quando quiser.",
    CANCELLED: "Cancelada. Não aceita inscrições.",
  };

  if (pending) {
    return (
      <div
        role="alertdialog"
        aria-labelledby="confirm-title"
        className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-danger-soft px-5 py-4"
      >
        <div>
          <p id="confirm-title" className="text-sm font-semibold text-ink">
            {CONFIRM_COPY[pending].title}
          </p>
          <p className="text-[13px] text-ink-soft">{CONFIRM_COPY[pending].body}</p>
        </div>
        <div className="flex gap-2">
          <button type="button" disabled={busy} onClick={() => setPending(null)} className={buttonClass("secondary", "sm")}>
            Voltar
          </button>
          <button type="button" disabled={busy} onClick={() => run(pending)} className={buttonClass("danger", "sm")}>
            {busy && <Spinner />}
            {CONFIRM_COPY[pending].cta}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg bg-tone px-5 py-3.5">
      <Status tone={COURSE_STATUS[status].tone}>{COURSE_STATUS[status].label}</Status>
      <p className="text-[13px] text-ink-soft">{hints[status]}</p>
    </div>
  );
}

function EditorBody({ course, reload }: { course: CourseDetail; reload: () => void }) {
  const [tab, setTab] = useState<Tab>("turmas");
  const actions = useStatusActions(course, reload);
  const meta = [
    course.category?.name,
    course.type && COURSE_TYPE_LABEL[course.type],
    course.modality && MODALITY_LABEL[course.modality],
    formatCoursePrice(course),
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <PageHeader
        back={{ href: "/dashboard/aulas", label: "Aulas" }}
        title={course.title}
        description={meta}
        actions={<StatusActions course={course} actions={actions} />}
      />

      <StatusLine course={course} actions={actions} />

      <div className="mb-5 mt-8">
        <Segmented
          label="Secções da aula"
          value={tab}
          onChange={setTab}
          options={[
            { value: "turmas", label: "Turmas e encontros", count: course.sessions.length },
            { value: "detalhes", label: "Detalhes da aula" },
          ]}
        />
      </div>

      {tab === "turmas" ? (
        <SessionsManager course={course} onChanged={reload} />
      ) : (
        <div className="max-w-3xl rounded-lg border border-line bg-panel p-6 md:p-8">
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
    </>
  );
}

export function CourseEditor({ id }: { id: number }) {
  const { user } = useAuth();
  const valid = Number.isInteger(id) && id > 0;
  const { data: course, error, isLoading, reload } = useApiQuery(valid ? `edit-course-${id}` : null, () =>
    getCourseForEdit(id)
  );

  const back = { href: "/dashboard/aulas", label: "Aulas" };
  const notMine = course && user?.mentor_profile && course.mentor.id !== user.mentor_profile.id;

  if (!valid || error?.status === 404 || notMine) {
    return (
      <>
        <PageHeader back={back} title="Aula não encontrada" />
        <EmptyNote title="Esta aula não existe ou não pertence à sua conta." />
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageHeader back={back} title="Aula" />
        <ErrorNote message={error.message} onRetry={reload} />
      </>
    );
  }

  if (isLoading || !course) {
    return (
      <div className="space-y-4" aria-busy="true">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-12" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return <EditorBody course={course} reload={reload} />;
}
