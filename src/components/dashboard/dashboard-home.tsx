"use client";

import { useAuth } from "@/hooks/useAuth";
import { useApiQuery } from "@/hooks/useApiQuery";
import type { Enrollment } from "@/lib/api/types";
import { calendarWindow, expandMeetings } from "@/lib/meeting";
import { getCourseForEdit, listMyCourses } from "@/services/mentor-course.service";
import { listReceivedEnrollments } from "@/services/mentor-enrollment.service";
import DashboardTopbar from "./topbar";
import Stats from "./stats";
import { EnrollmentBoard, columnOf } from "./enrollment-board";
import MeetingsCalendar, { type CalendarMeeting } from "./meetings-calendar";

/** Limite de aulas cujo detalhe pedimos para montar o calendário. */
const CALENDAR_COURSE_LIMIT = 10;

export default function DashboardHome() {
  const { user } = useAuth();
  const mentorId = user?.mentor_profile?.id;

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

  function replaceEnrollment(next: Enrollment) {
    if (!enrollments.data) return;
    enrollments.mutate({
      ...enrollments.data,
      results: enrollments.data.results.map((item) => (item.id === next.id ? next : item)),
    });
  }

  return (
    <>
      <DashboardTopbar pendingCount={enrollments.data ? pending : null} />
      <div className="grid grid-cols-1 gap-8 px-8 pt-8 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          <Stats
            isLoading={enrollments.isLoading || courses.isLoading}
            pending={pending}
            confirmedStudents={count((item) => columnOf(item) === "confirmados")}
            totalEnrollments={list?.length ?? 0}
            publishedCourses={courses.data?.filter((course) => course.status === "PUBLISHED").length ?? 0}
          />
          <EnrollmentBoard
            enrollments={list}
            isLoading={enrollments.isLoading}
            error={enrollments.error}
            onRetry={enrollments.reload}
            onChange={replaceEnrollment}
          />
        </div>
        <MeetingsCalendar
          meetings={meetings.data ?? []}
          isLoading={courses.isLoading || meetings.isLoading}
          action={{ href: "/dashboard/aulas", label: "Agendar encontros" }}
        />
      </div>
    </>
  );
}
