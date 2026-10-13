"use client";

import Link from "next/link";
import clsx from "clsx";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Compass,
  Hourglass,
  MessageCircleHeart,
  Receipt,
  Sparkles,
} from "lucide-react";
import { CourseCard, CourseCardSkeleton } from "@/components/courses/course-card";
import MeetingsCalendar, { type CalendarMeeting } from "@/components/dashboard/meetings-calendar";
import { StatGrid } from "@/components/dashboard/stats";
import { StatusBadge } from "@/components/enrollments/status-badge";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { UserMenu } from "@/components/user-menu";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useAuth } from "@/hooks/useAuth";
import type { Enrollment } from "@/lib/api/types";
import { canSubmitProof, isConfirmed, nextStepFor } from "@/lib/enrollment";
import { formatCoursePrice } from "@/lib/format";
import { displayName } from "@/services/auth.service";
import { getCourse } from "@/services/course.service";
import { listMyEnrollments } from "@/services/enrollment.service";
import { getRecommendations } from "@/services/onboarding.service";

const ENROLLMENT_LIMIT = 50;
const CALENDAR_COURSE_LIMIT = 10;

const isClosed = (enrollment: Enrollment) =>
  enrollment.status === "CANCELLED" || enrollment.status === "REJECTED";

function summaryFor(toPay: number, pending: number) {
  if (toPay > 0)
    return `Tem ${toPay} ${toPay === 1 ? "inscrição" : "inscrições"} à espera do comprovativo de pagamento.`;
  if (pending > 0)
    return `${pending} ${pending === 1 ? "pedido está" : "pedidos estão"} em análise pelo mentor.`;
  return "Está tudo em dia. Que tal descobrir uma nova aula?";
}

function ActiveEnrollment({ enrollment }: { enrollment: Enrollment }) {
  const needsAction = canSubmitProof(enrollment);

  return (
    <Link
      href={`/aluno/inscricoes/${enrollment.id}`}
      className={clsx(
        "flex flex-col gap-3 rounded-xl border bg-panel p-4 shadow-card transition-colors sm:flex-row sm:items-center",
        needsAction ? "border-warning/40 hover:border-warning" : "border-line-strong hover:border-primary/40"
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="truncate font-bold text-ink">{enrollment.course.title}</p>
        <p className="truncate text-xs text-ink-soft">
          {enrollment.session.name} · {formatCoursePrice(enrollment.course)}
        </p>
        <p className="mt-2 text-sm text-ink-soft">{nextStepFor(enrollment)}</p>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-col sm:items-end">
        {enrollment.status === "APPROVED" && enrollment.payment_status !== "NOT_REQUIRED" ? (
          <StatusBadge kind="payment" status={enrollment.payment_status} />
        ) : (
          <StatusBadge kind="enrollment" status={enrollment.status} />
        )}
        {needsAction && (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-primary">
            Enviar comprovativo
            <ArrowRight size={12} />
          </span>
        )}
      </div>
    </Link>
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

      return approved.flatMap<CalendarMeeting>((enrollment) => {
        const course = courses.find((item) => item.id === enrollment.course.id);
        const session = course?.sessions.find((item) => item.id === enrollment.session.id);
        return (session?.meetings ?? []).map((meeting) => ({
          ...meeting,
          href: `/aluno/inscricoes/${enrollment.id}`,
          courseTitle: enrollment.course.title,
          sessionName: enrollment.session.name,
        }));
      });
    }
  );

  const pending = list.filter((item) => item.status === "PENDING").length;
  const toPay = list.filter(canSubmitProof).length;
  const confirmed = list.filter(isConfirmed).length;
  const upcoming = (meetings.data ?? []).filter((meeting) => new Date(meeting.ends_at) >= new Date()).length;

  const active = list
    .filter((item) => !isClosed(item) && !isConfirmed(item))
    .sort((a, b) => Number(canSubmitProof(b)) - Number(canSubmitProof(a)))
    .slice(0, 4);

  const stats = [
    {
      label: "Em análise",
      value: pending,
      hint: pending ? "Aguardam o mentor" : "Nenhum pedido pendente",
      icon: Hourglass,
    },
    {
      label: "Pagamentos",
      value: toPay,
      hint: toPay ? "Envie o comprovativo" : "Nada por pagar",
      icon: Receipt,
      attention: toPay > 0,
    },
    {
      label: "Confirmadas",
      value: confirmed,
      hint: "Com vaga garantida",
      icon: CheckCircle2,
    },
    {
      label: "Próximos encontros",
      value: upcoming,
      hint: "Nas suas turmas",
      icon: CalendarDays,
    },
  ];

  const recommended = recommendations.data?.slice(0, 3) ?? [];

  return (
    <>
      <div className="flex items-center justify-between gap-6">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold text-ink">
            Olá{firstName ? `, ${firstName}` : ""}
          </h1>
          <p className="text-sm text-ink-soft">
            {enrollments.data ? summaryFor(toPay, pending) : "A carregar as suas inscrições…"}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <Link
            href="/aluno/catalogo"
            className="hidden items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-strong sm:inline-flex"
          >
            <Compass size={16} />
            Explorar aulas
          </Link>
          <div className="hidden md:block">
            <UserMenu />
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-10">
          <StatGrid stats={stats} isLoading={enrollments.isLoading} />

          <section>
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-ink">Em andamento</h2>
                <p className="text-sm text-ink-soft">Inscrições que ainda precisam de um passo.</p>
              </div>
              {list.length > 0 && (
                <Link
                  href="/aluno/inscricoes"
                  className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-primary hover:underline"
                >
                  Ver todas
                  <ArrowRight size={14} />
                </Link>
              )}
            </div>

            {enrollments.error ? (
              <ErrorState message={enrollments.error.message} onRetry={enrollments.reload} />
            ) : enrollments.isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 2 }, (_, index) => (
                  <span key={index} className="block h-24 animate-pulse rounded-xl bg-line" />
                ))}
              </div>
            ) : list.length === 0 ? (
              <EmptyState
                icon={<ClipboardList size={22} />}
                title="Ainda não tem inscrições"
                description="Escolha uma aula no catálogo e peça a inscrição numa turma."
                action={
                  <Link
                    href="/aluno/catalogo"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-strong"
                  >
                    Explorar aulas
                    <ArrowRight size={16} />
                  </Link>
                }
              />
            ) : active.length > 0 ? (
              <div className="space-y-3">
                {active.map((enrollment) => (
                  <ActiveEnrollment key={enrollment.id} enrollment={enrollment} />
                ))}
              </div>
            ) : (
              <p className="flex items-center gap-3 rounded-xl bg-success-soft p-4 text-sm text-ink-soft">
                <CheckCircle2 size={18} className="shrink-0 text-success" />
                Nenhuma inscrição à espera de si. Prepare-se para os próximos encontros!
              </p>
            )}
          </section>

          <section>
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <p className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  <Sparkles size={14} />
                  Para você
                </p>
                <h2 className="text-xl font-bold text-ink">Recomendado a partir dos seus objetivos</h2>
              </div>
              {recommended.length > 0 && (
                <Link
                  href="/aluno/para-voce"
                  className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-primary hover:underline"
                >
                  Ver todas
                  <ArrowRight size={14} />
                </Link>
              )}
            </div>

            {recommendations.isLoading ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
                {Array.from({ length: 3 }, (_, index) => (
                  <CourseCardSkeleton key={index} />
                ))}
              </div>
            ) : recommended.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
                {recommended.map((result) => (
                  <CourseCard key={result.course.id} result={result} href={`/aluno/catalogo/${result.course.id}`} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-start gap-4 rounded-2xl bg-primary/5 p-6 sm:flex-row sm:items-center">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MessageCircleHeart size={22} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-ink">Conte-nos o que quer aprender</p>
                  <p className="text-sm text-ink-soft">
                    Uma conversa rápida com o assistente ajuda-nos a recomendar as aulas certas para si.
                  </p>
                </div>
                <Link
                  href="/aluno/onboarding"
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-strong"
                >
                  Definir objetivos
                  <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </section>
        </div>

        <MeetingsCalendar
          meetings={meetings.data ?? []}
          isLoading={enrollments.isLoading || meetings.isLoading}
          emptyText="Sem encontros agendados nas suas turmas."
        />
      </div>
    </>
  );
}
