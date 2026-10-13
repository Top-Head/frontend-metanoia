"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import clsx from "clsx";
import {
  ArrowLeft,
  CalendarDays,
  Layers,
  MapPin,
  Monitor,
  Repeat,
  SearchX,
  UserCheck,
  Users,
} from "lucide-react";
import { CourseCover } from "./course-cover";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MentorAvatar } from "@/components/mentors/mentor-card";
import { Button } from "@/components/ui/button";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useAuth } from "@/hooks/useAuth";
import type { CourseDetail, CourseSession } from "@/lib/api/types";
import {
  COURSE_TYPE_LABEL,
  MODALITY_LABEL,
  formatCoursePrice,
} from "@/lib/format";
import {
  describeMeeting,
  formatPeriod,
  formatWeekdays,
  isWeekly,
  seatsLeft,
  sortMeetings,
} from "@/lib/meeting";
import { getCourse } from "@/services/course.service";
import { requestEnrollment } from "@/services/enrollment.service";
import { ApiError } from "@/lib/api/client";
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
  const meetings = sortMeetings(session.meetings ?? []);
  const seats = seatsLeft(session);
  const full = seats === 0;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-disabled={full}
      onClick={full ? undefined : onSelect}
      className={clsx(
        "w-full rounded-xl p-4 text-left transition-colors",
        full
          ? "cursor-not-allowed border border-dashed border-line-strong opacity-60"
          : selected
            ? "border-2 border-primary bg-primary/5"
            : "border border-line hover:border-primary/50"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-bold text-ink">{session.name}</span>
        <span className={clsx("shrink-0 text-xs font-semibold", full ? "text-warning" : "text-ink-soft")}>
          {full ? "Lotada" : `${seats} ${seats === 1 ? "vaga livre" : "vagas livres"}`}
        </span>
      </div>
      {meetings.length > 0 ? (
        <ul className="mt-3 space-y-2.5">
          {meetings.map((meeting) => {
            const { day, time } = describeMeeting(meeting);
            const Icon = isWeekly(meeting) ? Repeat : CalendarDays;
            return (
              <li key={meeting.id} className="flex gap-2.5">
                <Icon size={14} className="mt-0.5 shrink-0 text-primary" />
                <div className="min-w-0 text-xs">
                  <p className="font-semibold text-ink first-letter:uppercase">{day}</p>
                  <p className="truncate text-ink-soft">
                    {[time, meeting.location].filter(Boolean).join(" · ")}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-2 text-xs text-ink-faint">Datas a definir pelo mentor.</p>
      )}
    </button>
  );
}

function EnrollPanel({ course }: { course: CourseDetail }) {
  const router = useRouter();
  const { status, isStudent, user } = useAuth();
  const sessions = course.sessions.filter((session) => session.is_active !== false);
  const [selectedId, setSelectedId] = useState<number | null>(
    sessions.find((session) => seatsLeft(session) > 0)?.id ?? null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isOwnCourse = user?.mentor_profile?.id === course.mentor.id;

  async function enroll() {
    if (!selectedId) return;
    setIsSubmitting(true);
    try {
      const enrollment = await requestEnrollment(selectedId, course.id);
      toast.success("Pedido enviado! O mentor vai analisar a sua inscrição.");
      router.push(`/aluno/inscricoes/${enrollment.id}`);
    } catch (reason) {
      toast.error(reason instanceof ApiError ? reason.message : "Não foi possível pedir a inscrição.");
      setIsSubmitting(false);
    }
  }

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
      ) : isOwnCourse ? (
        <p className="mt-6 rounded-xl bg-canvas p-4 text-center text-sm font-semibold text-ink-soft">
          Esta aula é sua.
        </p>
      ) : status === "authenticated" && !isStudent ? (
        <p className="mt-6 rounded-xl bg-canvas p-4 text-center text-sm text-ink-soft">
          Inscrições disponíveis apenas para contas de aluno.
        </p>
      ) : (
        <Button
          type="button"
          size="xl"
          onClick={enroll}
          isLoading={isSubmitting || status === "loading"}
          disabled={!selectedId}
          className="mt-6 w-full"
        >
          Pedir inscrição
        </Button>
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
  return (
    <div className="flex min-h-screen flex-col bg-canvas font-sans text-ink">
      <Header forceSolid />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-16 pt-28 lg:px-10">
        <CourseDetail id={id} backHref="/#catalogo" />
      </main>

      <Footer />
    </div>
  );
}

export function CourseDetail({ id, backHref }: { id: number; backHref: string }) {
  const valid = Number.isInteger(id) && id > 0;
  const { data: course, error, isLoading, reload } = useApiQuery(
    valid ? `course-${id}` : null,
    () => getCourse(id)
  );

  const notFound = !valid || error?.status === 404;

  return (
    <>
      <Link
        href={backHref}
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
            <Link href={backHref} className="text-sm font-bold text-primary hover:underline">
              Ver aulas disponíveis
            </Link>
          }
        />
      ) : isLoading || !course ? (
        error ? <ErrorState message={error.message} onRetry={reload} /> : <DetailSkeleton />
      ) : (
        <CourseContent course={course} />
      )}
    </>
  );
}

function CourseContent({ course }: { course: CourseDetail }) {
  const { icon: Icon, tone } = categoryVisual(course.category?.slug);
  const period = formatPeriod(course.start_date, course.end_date);
  const weekdays = formatWeekdays(course.days_of_week ?? []);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="min-w-0 space-y-6">
        {course.image && (
          <CourseCover
            image={course.image}
            categorySlug={course.category?.slug}
            className="aspect-[21/9] w-full rounded-2xl"
            iconSize={40}
          />
        )}
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
          {course.total_capacity > 0 ? (
            <InfoItem
              icon={<UserCheck size={18} />}
              label="Inscritos"
              value={`${course.total_enrolled}/${course.total_capacity} alunos`}
            />
          ) : (
            course.capacity != null && (
              <InfoItem icon={<Users size={18} />} label="Capacidade" value={`${course.capacity} alunos`} />
            )
          )}
          {period && <InfoItem icon={<CalendarDays size={18} />} label="Período" value={period} />}
          {weekdays && <InfoItem icon={<Repeat size={18} />} label="Dias" value={weekdays} />}
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
