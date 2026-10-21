"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Compass } from "lucide-react";
import { EnrollmentTrack } from "@/components/app/enrollment-track";
import { RecommendationList } from "@/components/app/recommendation-list";
import { EmptyNote, ErrorNote, FigureBand, PageHeader, Skeleton, buttonClass } from "@/components/app/ui";
import MeetingsCalendar, { type CalendarMeeting } from "@/components/dashboard/meetings-calendar";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useAuth } from "@/hooks/useAuth";
import type { Enrollment } from "@/lib/api/types";
import { isConfirmed } from "@/lib/enrollment";
import { calendarWindow, expandMeetings } from "@/lib/meeting";
import { displayName } from "@/services/auth.service";
import { getCourse } from "@/services/course.service";
import { listMyEnrollments } from "@/services/enrollment.service";
import { getRecommendations } from "@/services/onboarding.service";

const ENROLLMENT_LIMIT = 50;
const CALENDAR_COURSE_LIMIT = 10;
const WEEK_MS = 7 * 86_400_000;

const isClosed = (enrollment: Enrollment) =>
  enrollment.status === "CANCELLED" || enrollment.status === "REJECTED";

function summaryFor(pending: number, confirmed: number) {
  if (pending > 0)
    return `${pending} ${pending === 1 ? "pedido está" : "pedidos estão"} à espera da resposta do mentor.`;
  if (confirmed > 0)
    return `Tem vaga garantida em ${confirmed} ${confirmed === 1 ? "turma" : "turmas"}. Os encontros estão na agenda.`;
  return "Ainda não está em nenhuma turma. Escolha uma aula e peça a inscrição.";
}

function JourneyRow({ enrollment }: { enrollment: Enrollment }) {
  return (
    <li>
      <Link
        href={`/aluno/inscricoes/${enrollment.id}`}
        className="group grid gap-4 px-5 py-4 transition-colors hover:bg-canvas focus-visible:bg-canvas focus-visible:outline-none md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_20px] md:items-center"
      >
        <span className="min-w-0">
          <span className="block truncate text-[15px] font-semibold text-ink group-hover:text-primary">
            {enrollment.course.title}
          </span>
          <span className="block truncate text-[13px] text-ink-soft">
            {enrollment.session.name} · {enrollment.course.category_name}
          </span>
        </span>
        <EnrollmentTrack enrollment={enrollment} />
        <ChevronRight size={18} aria-hidden="true" className="hidden text-ink-faint group-hover:text-ink md:block" />
      </Link>
    </li>
  );
}

export default function StudentHome() {
  const { user } = useAuth();
  const firstName = displayName(user).split(" ")[0];

  const enrollments = useApiQuery("student-home-enrollments", () =>
    listMyEnrollments({ page_size: ENROLLMENT_LIMIT })
  );
  const recommendations = useApiQuery("student-home-recommendations", () => getRecommendations());

  const list = enrollments.data?.results ?? [];
  const approved = list.filter((item) => item.status === "APPROVED");

  const meetings = useApiQuery(
    enrollments.data ? `student-home-meetings-${approved.map((item) => item.id).join(",")}` : null,
    async () => {
      const courseIds = [...new Set(approved.map((item) => item.course.id))].slice(0, CALENDAR_COURSE_LIMIT);
      const settled = await Promise.allSettled(courseIds.map((id) => getCourse(id)));
      const courses = settled.flatMap((result) => (result.status === "fulfilled" ? [result.value] : []));
      const { from, to } = calendarWindow();

      return approved.flatMap<CalendarMeeting>((enrollment) => {
        const course = courses.find((item) => item.id === enrollment.course.id);
        const session = course?.sessions.find((item) => item.id === enrollment.session.id);
        if (!course || !session) return [];
        return expandMeetings(session.meetings ?? [], course, from, to).map((occurrence) => ({
          ...occurrence,
          key: `${enrollment.id}-${occurrence.key}`,
          href: `/aluno/inscricoes/${enrollment.id}`,
          courseTitle: enrollment.course.title,
          sessionName: enrollment.session.name,
        }));
      });
    }
  );

  const pending = list.filter((item) => item.status === "PENDING").length;
  const confirmed = list.filter(isConfirmed).length;
  const [now] = useState(() => Date.now());
  const thisWeek = (meetings.data ?? []).filter(
    (meeting) => new Date(meeting.ends_at).getTime() >= now && new Date(meeting.starts_at).getTime() <= now + WEEK_MS
  ).length;

  const journey = list.filter((item) => !isClosed(item)).slice(0, 5);
  const recommended = recommendations.data?.slice(0, 4) ?? [];

  return (
    <>
      <PageHeader
        title={`Olá${firstName ? `, ${firstName}` : ""}`}
        description={enrollments.data ? summaryFor(pending, confirmed) : "A carregar as suas inscrições…"}
        actions={
          <Link href="/aluno/catalogo" className={buttonClass("primary")}>
            <Compass size={16} aria-hidden="true" />
            Explorar aulas
          </Link>
        }
      />

      <FigureBand
        isLoading={enrollments.isLoading}
        figures={[
          { label: "À espera do mentor", value: pending, tone: "warning", note: pending ? "Pedidos em análise" : "Nenhum pendente" },
          { label: "Vagas garantidas", value: confirmed, note: "Turmas em que está" },
          { label: "Encontros em 7 dias", value: meetings.isLoading ? "–" : thisWeek, note: "Nas suas turmas" },
          { label: "Pedidos enviados", value: list.length, note: "Desde o início" },
        ]}
      />

      <div className="mt-8 grid grid-cols-1 items-start gap-6 min-[1140px]:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-8">
          <section aria-labelledby="journey-title" className="overflow-hidden rounded-lg border border-line bg-panel">
            <div className="flex items-baseline justify-between gap-3 px-5 pb-3 pt-5">
              <div>
                <h2 id="journey-title" className="text-base font-semibold text-ink">
                  O seu percurso
                </h2>
                <p className="mt-0.5 text-[13px] text-ink-soft">Cada inscrição passa por três passos até a vaga ficar garantida.</p>
              </div>
              {list.length > 0 && (
                <Link href="/aluno/inscricoes" className="shrink-0 text-[13px] font-semibold text-primary hover:underline">
                  Todas as inscrições
                </Link>
              )}
            </div>
            {enrollments.error ? (
              <div className="px-5 pb-5">
                <ErrorNote message={enrollments.error.message} onRetry={enrollments.reload} />
              </div>
            ) : enrollments.isLoading ? (
              <div className="space-y-2 px-5 pb-5">
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
              </div>
            ) : journey.length > 0 ? (
              <ul className="divide-y divide-line border-t border-line">
                {journey.map((enrollment) => (
                  <JourneyRow key={enrollment.id} enrollment={enrollment} />
                ))}
              </ul>
            ) : (
              <div className="px-5 pb-5">
                <EmptyNote
                  title="Ainda sem inscrições ativas"
                  action={
                    <Link href="/aluno/catalogo" className={buttonClass("primary")}>
                      Explorar aulas
                    </Link>
                  }
                >
                  Escolha uma aula no catálogo e peça a inscrição numa turma. O mentor responde aqui.
                </EmptyNote>
              </div>
            )}
          </section>

          <section aria-labelledby="recommended-title">
            <div className="mb-3 flex items-baseline justify-between gap-3">
              <h2 id="recommended-title" className="text-base font-semibold text-ink">
                Recomendado para os seus objetivos
              </h2>
              {recommended.length > 0 && (
                <Link href="/aluno/para-voce" className="shrink-0 text-[13px] font-semibold text-primary hover:underline">
                  Ver mais
                </Link>
              )}
            </div>
            {recommendations.isLoading ? (
              <Skeleton className="h-64" />
            ) : recommended.length > 0 ? (
              <RecommendationList results={recommended} />
            ) : (
              <div className="flex flex-col items-start gap-4 rounded-lg bg-rail p-6 text-rail-ink sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-display text-lg font-semibold text-white">Conte-nos o que quer aprender</p>
                  <p className="mt-1 max-w-md text-sm text-rail-muted">
                    Dois minutos de conversa com o assistente chegam para recomendarmos as aulas certas.
                  </p>
                </div>
                <Link href="/aluno/onboarding" className={buttonClass("primary")}>
                  Definir objetivos
                </Link>
              </div>
            )}
          </section>
        </div>

        <MeetingsCalendar
          meetings={meetings.data ?? []}
          isLoading={enrollments.isLoading || meetings.isLoading}
          emptyText="Quando o mentor aprovar uma inscrição, os encontros da turma aparecem aqui."
        />
      </div>
    </>
  );
}
