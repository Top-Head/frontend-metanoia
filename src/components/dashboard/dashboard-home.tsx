"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { FigureBand, PageHeader, buttonClass } from "@/components/app/ui";
import { useAuth } from "@/hooks/useAuth";
import { useApiQuery } from "@/hooks/useApiQuery";
import type { Enrollment } from "@/lib/api/types";
import { calendarWindow, expandMeetings } from "@/lib/meeting";
import { displayName } from "@/services/auth.service";
import { getCourseForEdit, listMyCourses } from "@/services/mentor-course.service";
import { listReceivedEnrollments } from "@/services/mentor-enrollment.service";
import { EnrollmentBoard, columnOf } from "./enrollment-board";
import MeetingsCalendar, { type CalendarMeeting } from "./meetings-calendar";

/** Limite de aulas cujo detalhe pedimos para montar o calendário. */
const CALENDAR_COURSE_LIMIT = 10;

export default function DashboardHome() {
  const { user } = useAuth();
  const mentorId = user?.mentor_profile?.id;
  const firstName = displayName(user).split(" ")[0];

  const enrollments = useApiQuery("mentor-enrollments", () => listReceivedEnrollments());
  const courses = useApiQuery(mentorId ? `mentor-courses-${mentorId}` : null, () =>
    listMyCourses(mentorId!)
  );
  const meetings = useApiQuery(
    courses.data ? `mentor-meetings-${courses.data.map((course) => course.id).join(",")}` : null,
    async () => {
      const withSessions = courses
        .data!.filter((course) => course.status !== "CANCELLED" && course.session_count > 0)
        .slice(0, CALENDAR_COURSE_LIMIT);
      const details = await Promise.all(withSessions.map((course) => getCourseForEdit(course.id)));

      const { from, to } = calendarWindow();

      return details.flatMap<CalendarMeeting>((course) =>
        course.sessions.flatMap((session) =>
          expandMeetings(session.meetings ?? [], course, from, to).map((occurrence) => ({
            ...occurrence,
            key: `${session.id}-${occurrence.key}`,
            href: `/dashboard/aulas/${course.id}`,
            courseTitle: course.title,
            sessionName: session.name,
          }))
        )
      );
    }
  );

  const list = enrollments.data?.results;
  const count = (predicate: (enrollment: Enrollment) => boolean) => list?.filter(predicate).length ?? 0;
  const pending = count((item) => columnOf(item) === "pedidos");
  const confirmed = count((item) => columnOf(item) === "confirmados");
  const published = courses.data?.filter((course) => course.status === "PUBLISHED").length ?? 0;
  const drafts = courses.data?.filter((course) => course.status === "DRAFT").length ?? 0;
  const seatsLeft = (courses.data ?? [])
    .filter((course) => course.status === "PUBLISHED" && course.total_capacity > 0)
    .reduce((sum, course) => sum + Math.max(course.total_capacity - course.total_enrolled, 0), 0);

  function replaceEnrollment(next: Enrollment) {
    if (!enrollments.data) return;
    enrollments.mutate({
      ...enrollments.data,
      results: enrollments.data.results.map((item) => (item.id === next.id ? next : item)),
    });
  }

  const summary = !enrollments.data
    ? "A carregar os seus pedidos…"
    : pending > 0
      ? `${pending} ${pending === 1 ? "aluno espera" : "alunos esperam"} pela sua decisão para entrar numa turma.`
      : "Não há pedidos por decidir. Os próximos encontros estão na agenda.";

  return (
    <>
      <PageHeader
        title={`Olá${firstName ? `, ${firstName}` : ""}`}
        description={summary}
        actions={
          <>
            <Link href="/dashboard/aulas" className={buttonClass("secondary")}>
              Gerir aulas
            </Link>
            <Link href="/dashboard/aulas/nova" className={buttonClass("primary", "md", "lg:hidden")}>
              <Plus size={16} aria-hidden="true" />
              Nova aula
            </Link>
          </>
        }
      />

      <FigureBand
        isLoading={enrollments.isLoading || courses.isLoading}
        figures={[
          { label: "Por decidir", value: pending, tone: "warning", note: pending ? "Pedidos à espera" : "Tudo respondido" },
          { label: "Alunos confirmados", value: confirmed, note: "Com vaga garantida" },
          { label: "Aulas publicadas", value: published, note: drafts ? `${drafts} em rascunho` : "No catálogo" },
          { label: "Vagas livres", value: seatsLeft, note: "Nas aulas em grupo" },
        ]}
      />

      <div className="mt-8 grid grid-cols-1 items-start gap-6 min-[1140px]:grid-cols-[minmax(0,1fr)_320px]">
        <EnrollmentBoard
          enrollments={list}
          isLoading={enrollments.isLoading}
          error={enrollments.error}
          onRetry={enrollments.reload}
          onChange={replaceEnrollment}
        />
        <MeetingsCalendar
          meetings={meetings.data ?? []}
          isLoading={courses.isLoading || meetings.isLoading}
          action={{ href: "/dashboard/aulas", label: "Agendar" }}
          emptyText="Abra uma turma e agende os encontros para os ver aqui."
        />
      </div>
    </>
  );
}
