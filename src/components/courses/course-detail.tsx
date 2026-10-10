"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import {
  ArrowLeft,
  CalendarDays,
  Layers,
  MapPin,
  Monitor,
  SearchX,
  Users,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MentorAvatar } from "@/components/mentors/mentor-card";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useAuth } from "@/hooks/useAuth";
import type { CourseDetail, CourseSession } from "@/lib/api/types";
import {
  COURSE_TYPE_LABEL,
  MODALITY_LABEL,
  formatCoursePrice,
  formatMeetingDate,
  formatMeetingTime,
} from "@/lib/format";
import { getCourse } from "@/services/course.service";
import { categoryVisual } from "./category-visual";

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-canvas p-4">
      <span className="mt-0.5 text-primary">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs font-medium text-ink-faint">{label}</p>
        <p className="truncate text-sm font-bold text-ink">{value}</p>
      </div>
    </div>
  );
}

function SessionOption({
  session,
  selected,
  onSelect,
}: {
  session: CourseSession;
  selected: boolean;
  onSelect: () => void;
}) {
  const meetings = [...(session.meetings ?? [])].sort((a, b) =>
    a.starts_at.localeCompare(b.starts_at)
  );

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={clsx(
        "w-full rounded-xl p-4 text-left transition-colors",
        selected ? "border-2 border-primary bg-primary/5" : "border border-line hover:border-primary/50"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-bold text-ink">{session.name}</span>
        <span className="shrink-0 text-xs font-semibold text-ink-soft">
          {session.effective_capacity} {session.effective_capacity === 1 ? "vaga" : "vagas"}
        </span>
      </div>
      {meetings.length > 0 ? (
        <ul className="mt-3 space-y-2.5">
          {meetings.map((meeting) => (
            <li key={meeting.id} className="flex gap-2.5">
              <CalendarDays size={14} className="mt-0.5 shrink-0 text-primary" />
              <div className="min-w-0 text-xs">
                <p className="font-semibold text-ink first-letter:uppercase">
                  {formatMeetingDate(meeting.starts_at)}
                </p>
                <p className="truncate text-ink-soft">
                  {formatMeetingTime(meeting.starts_at, meeting.ends_at)}
                  {meeting.location && ` · ${meeting.location}`}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-xs text-ink-faint">Datas a definir pelo mentor.</p>
      )}
    </button>
  );
}

function EnrollPanel({ course }: { course: CourseDetail }) {
  const { status, isStudent } = useAuth();
  const sessions = course.sessions.filter((session) => session.is_active !== false);
  const [selectedId, setSelectedId] = useState<number | null>(sessions[0]?.id ?? null);

  return (
    <div className="sticky top-24 rounded-2xl border border-line bg-panel p-6 shadow-card">
      <p className="text-xs font-medium text-ink-faint">Investimento</p>
      <p className={clsx("text-3xl font-bold", course.is_free ? "text-success" : "text-ink")}>
        {formatCoursePrice(course)}
      </p>

      <div className="mt-6 border-t border-line pt-6">
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-ink-faint">
          Escolha a turma
        </p>
        {sessions.length > 0 ? (
          <div role="radiogroup" aria-label="Turmas" className="space-y-2">
            {sessions.map((session) => (
              <SessionOption
                key={session.id}
                session={session}
                selected={selectedId === session.id}
                onSelect={() => setSelectedId(session.id)}
              />
            ))}
          </div>
        ) : (
          <p className="rounded-xl bg-canvas p-4 text-sm text-ink-soft">
            Esta aula ainda não tem turmas abertas.
          </p>
        )}
      </div>

      {status === "anonymous" ? (
        <Link
          href={`/auth/login?next=${encodeURIComponent(`/aulas/${course.id}`)}`}
          className="mt-6 flex w-full items-center justify-center rounded-xl bg-primary py-3.5 font-bold text-white transition-colors hover:bg-primary-strong"
        >
          Entrar para se inscrever
        </Link>
      ) : (
        // TODO (fase 3): POST /api/student/enrollments/ com a turma escolhida.
        <button
          type="button"
          disabled
          className="mt-6 w-full rounded-xl bg-primary py-3.5 font-bold text-white opacity-50"
        >
          {status === "authenticated" && !isStudent
            ? "Disponível para contas de aluno"
            : "Inscrições em breve"}
        </button>
      )}
      <p className="mt-3 text-center text-xs text-ink-soft">
        {course.is_free
          ? "Aula gratuita: basta a aprovação do mentor."
          : "O pagamento é feito após a aprovação, com envio do comprovativo."}
      </p>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]" aria-busy="true">
      <div className="space-y-4">
        <span className="block h-4 w-24 animate-pulse rounded bg-line" />
        <span className="block h-9 w-3/4 animate-pulse rounded bg-line" />
        <span className="block h-24 animate-pulse rounded-2xl bg-line" />
        <span className="block h-40 animate-pulse rounded-2xl bg-line" />
      </div>
      <span className="block h-80 animate-pulse rounded-2xl bg-line" />
    </div>
  );
}

export function CourseDetailView({ id }: { id: number }) {
  const valid = Number.isInteger(id) && id > 0;
  const { data: course, error, isLoading, reload } = useApiQuery(
    valid ? `course-${id}` : null,
    () => getCourse(id)
  );

  const notFound = !valid || error?.status === 404;

  return (
    <div className="flex min-h-screen flex-col bg-canvas font-sans text-ink">
      <Header forceSolid />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-16 pt-28 lg:px-10">
        <Link
          href="/#catalogo"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-ink-soft transition-colors hover:text-primary"
        >
          <ArrowLeft size={16} />
          Voltar às aulas
        </Link>

        {notFound ? (
          <EmptyState
            icon={<SearchX size={22} />}
            title="Aula não encontrada"
            description="Esta aula pode ter sido removida ou o link está incorreto."
            action={
              <Link href="/#catalogo" className="text-sm font-bold text-primary hover:underline">
                Ver aulas disponíveis
              </Link>
            }
          />
        ) : isLoading || !course ? (
          error ? <ErrorState message={error.message} onRetry={reload} /> : <DetailSkeleton />
        ) : (
          <CourseContent course={course} />
        )}
      </main>

      <Footer />
    </div>
  );
}

function CourseContent({ course }: { course: CourseDetail }) {
  const { icon: Icon, tone } = categoryVisual(course.category?.slug);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="min-w-0 space-y-6">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className={clsx("flex size-11 items-center justify-center rounded-xl", tone)}>
              <Icon size={20} />
            </span>
            <span className="text-sm font-bold uppercase tracking-wide text-primary">
              {course.category?.name}
            </span>
          </div>
          <h1 className="text-3xl font-bold leading-tight text-ink md:text-4xl">{course.title}</h1>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {course.type && (
            <InfoItem icon={<Users size={18} />} label="Formato" value={COURSE_TYPE_LABEL[course.type]} />
          )}
          {course.modality && (
            <InfoItem
              icon={course.modality === "ONLINE" ? <Monitor size={18} /> : <MapPin size={18} />}
              label="Modalidade"
              value={MODALITY_LABEL[course.modality]}
            />
          )}
          <InfoItem
            icon={<Layers size={18} />}
            label="Turmas"
            value={`${course.session_count} ${course.session_count === 1 ? "turma" : "turmas"}`}
          />
          {course.capacity != null && (
            <InfoItem icon={<Users size={18} />} label="Capacidade" value={`${course.capacity} alunos`} />
          )}
        </div>

        {course.location && (
          <p className="flex items-center gap-2 text-sm text-ink-soft">
            <MapPin size={16} className="text-primary" />
            {course.location}
          </p>
        )}

        <section className="rounded-2xl border border-line bg-panel p-6 shadow-card md:p-8">
          <h2 className="mb-4 text-xl font-bold text-ink">Sobre a aula</h2>
          {course.description ? (
            <p className="whitespace-pre-line leading-relaxed text-ink/85">{course.description}</p>
          ) : (
            <p className="text-sm text-ink-faint">O mentor ainda não adicionou uma descrição.</p>
          )}
        </section>

        <section className="rounded-2xl border border-line bg-panel p-6 shadow-card md:p-8">
          <h2 className="mb-5 text-xl font-bold text-ink">Quem ensina</h2>
          <div className="flex items-start gap-4">
            <MentorAvatar name={course.mentor.name} />
            <div className="min-w-0">
              <p className="font-bold text-ink">{course.mentor.name}</p>
              <p className="text-xs text-ink-soft">
                {course.mentor.specialty_details.map((detail) => detail.name).join(" · ")}
              </p>
              {course.mentor.bio && <p className="mt-3 text-sm text-ink-soft">{course.mentor.bio}</p>}
              <Link
                href={`/mentor?id=${course.mentor.id}`}
                className="mt-3 inline-block text-sm font-bold text-primary hover:underline"
              >
                Ver perfil completo
              </Link>
            </div>
          </div>
        </section>
      </div>

      <aside>
        <EnrollPanel course={course} />
      </aside>
    </div>
  );
}
