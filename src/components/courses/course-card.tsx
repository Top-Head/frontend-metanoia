import Link from "next/link";
import clsx from "clsx";
import { ArrowRight, CalendarDays, Layers, MapPin, Monitor, Repeat, User, Users } from "lucide-react";
import type { DiscoveryResult } from "@/lib/api/types";
import { COURSE_TYPE_LABEL, MODALITY_LABEL, formatCoursePrice } from "@/lib/format";
import { formatCourseDate, formatWeekdays } from "@/lib/meeting";
import { categoryVisual } from "./category-visual";
import { CourseCover } from "./course-cover";

export function CourseCard({ result, href }: { result: DiscoveryResult; href?: string }) {
  const { course, has_capacity, reasons } = result;
  const { icon: Icon, tone } = categoryVisual(course.category?.slug);
  const weekdays = formatWeekdays(course.days_of_week ?? []);
  const soldOut = (
    <span className="rounded-full bg-warning-soft px-2.5 py-1 text-[11px] font-bold text-warning">Sem vagas</span>
  );

  return (
    <Link
      href={href ?? `/aulas/${course.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-panel p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-float"
    >
      {course.image ? (
        <div className="relative -mx-5 -mt-5 mb-4">
          <CourseCover image={course.image} categorySlug={course.category?.slug} className="h-40" />
          {!has_capacity && <div className="absolute right-3 top-3">{soldOut}</div>}
        </div>
      ) : (
        <div className="mb-4 flex items-start justify-between gap-3">
          <span className={clsx("flex size-11 shrink-0 items-center justify-center rounded-xl", tone)}>
            <Icon size={20} />
          </span>
          {!has_capacity && soldOut}
        </div>
      )}

      <p className="text-xs font-bold uppercase tracking-wide text-primary">
        {course.category?.name}
      </p>
      <h3 className="mt-1 line-clamp-2 text-lg font-bold leading-snug text-ink">
        {course.title}
      </h3>
      <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-soft">
        <User size={14} className="shrink-0" />
        <span className="truncate">{course.mentor?.name}</span>
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {course.type && (
          <span className="inline-flex items-center gap-1 rounded-md bg-canvas px-2 py-1 text-xs font-medium text-ink-soft">
            <Users size={12} />
            {COURSE_TYPE_LABEL[course.type]}
          </span>
        )}
        {course.modality && (
          <span className="inline-flex items-center gap-1 rounded-md bg-canvas px-2 py-1 text-xs font-medium text-ink-soft">
            {course.modality === "ONLINE" ? <Monitor size={12} /> : <MapPin size={12} />}
            {MODALITY_LABEL[course.modality]}
          </span>
        )}
        <span className="inline-flex items-center gap-1 rounded-md bg-canvas px-2 py-1 text-xs font-medium text-ink-soft">
          <Layers size={12} />
          {course.session_count} {course.session_count === 1 ? "turma" : "turmas"}
        </span>
        {weekdays && (
          <span className="inline-flex items-center gap-1 rounded-md bg-canvas px-2 py-1 text-xs font-medium text-ink-soft">
            <Repeat size={12} />
            {weekdays}
          </span>
        )}
      </div>

      {(course.start_date || course.total_capacity > 0) && (
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-soft">
          {course.start_date && (
            <span className="inline-flex items-center gap-1">
              <CalendarDays size={12} />
              Início {formatCourseDate(course.start_date)}
            </span>
          )}
          {course.total_capacity > 0 && (
            <span>
              {course.total_enrolled}/{course.total_capacity} inscritos
            </span>
          )}
        </div>
      )}

      {reasons.length > 0 && (
        <p className="mt-3 line-clamp-1 text-xs text-ink-faint" title={reasons.join(" · ")}>
          {reasons[0]}
        </p>
      )}

      <div className="mt-auto flex items-center justify-between border-t border-line pt-4">
        <p className={clsx("text-lg font-bold", course.is_free ? "text-success" : "text-ink")}>
          {formatCoursePrice(course)}
        </p>
        <span className="inline-flex items-center gap-1 text-sm font-bold text-primary">
          Ver aula
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

export function CourseCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-line bg-panel p-5" aria-hidden="true">
      <span className="mb-4 size-11 animate-pulse rounded-xl bg-line" />
      <span className="h-3 w-20 animate-pulse rounded bg-line" />
      <span className="mt-2 h-5 w-4/5 animate-pulse rounded bg-line" />
      <span className="mt-2 h-4 w-1/2 animate-pulse rounded bg-line" />
      <div className="mt-4 flex gap-1.5">
        <span className="h-6 w-20 animate-pulse rounded-md bg-line" />
        <span className="h-6 w-16 animate-pulse rounded-md bg-line" />
      </div>
      <div className="mt-6 flex justify-between border-t border-line pt-4">
        <span className="h-6 w-24 animate-pulse rounded bg-line" />
        <span className="h-5 w-16 animate-pulse rounded bg-line" />
      </div>
    </div>
  );
}
