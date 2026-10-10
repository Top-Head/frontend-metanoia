"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { ArrowRight, BookOpen, Layers, Plus } from "lucide-react";
import { categoryVisual } from "@/components/courses/category-visual";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { useAuth } from "@/hooks/useAuth";
import { useApiQuery } from "@/hooks/useApiQuery";
import type { CourseStatus } from "@/lib/api/types";
import { COURSE_STATUS } from "@/lib/course";
import { COURSE_TYPE_LABEL, MODALITY_LABEL, formatCoursePrice } from "@/lib/format";
import { listMyCourses } from "@/services/mentor-course.service";

const FILTERS: Array<{ value: CourseStatus | "all"; label: string }> = [
  { value: "all", label: "Todas" },
  { value: "DRAFT", label: "Rascunhos" },
  { value: "PUBLISHED", label: "Publicadas" },
  { value: "ARCHIVED", label: "Arquivadas" },
  { value: "CANCELLED", label: "Canceladas" },
];

export function MyCourses() {
  const { user } = useAuth();
  const mentorId = user?.mentor_profile?.id;
  const [filter, setFilter] = useState<CourseStatus | "all">("all");
  const { data, error, isLoading, reload } = useApiQuery(
    mentorId ? `mentor-courses-${mentorId}` : null,
    () => listMyCourses(mentorId!)
  );

  const courses = data ?? [];
  const visible = filter === "all" ? courses : courses.filter((course) => course.status === filter);

  return (
    <div className="px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Minhas aulas</h1>
          <p className="text-sm text-ink-soft">Crie aulas, abra turmas e agende os encontros.</p>
        </div>
        <Link
          href="/dashboard/aulas/nova"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-strong"
        >
          <Plus size={16} />
          Nova aula
        </Link>
      </div>

      {courses.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {FILTERS.map(({ value, label }) => {
            const count = value === "all" ? courses.length : courses.filter((course) => course.status === value).length;
            return (
              <button
                key={value}
                type="button"
                aria-pressed={filter === value}
                onClick={() => setFilter(value)}
                className={clsx(
                  "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                  filter === value
                    ? "bg-ink text-white"
                    : "border border-line bg-panel text-ink-soft hover:border-ink-faint hover:text-ink"
                )}
              >
                {label} <span className="opacity-60">{count}</span>
              </button>
            );
          })}
        </div>
      )}

      {isLoading || !mentorId ? (
        <div className="grid gap-4 md:grid-cols-2" aria-busy="true">
          {Array.from({ length: 4 }, (_, index) => (
            <span key={index} className="block h-40 animate-pulse rounded-2xl bg-line" />
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error.message} onRetry={reload} />
      ) : courses.length === 0 ? (
        <EmptyState
          icon={<BookOpen size={22} />}
          title="Ainda não criou nenhuma aula"
          description="Comece por um rascunho: descreva a aula, defina o preço e depois abra as turmas."
          action={
            <Link
              href="/dashboard/aulas/nova"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-strong"
            >
              <Plus size={16} />
              Criar primeira aula
            </Link>
          }
        />
      ) : visible.length === 0 ? (
        <EmptyState icon={<BookOpen size={22} />} title="Nada por aqui" description="Não há aulas com este estado." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {visible.map((course) => {
            const { icon: Icon, tone } = categoryVisual(course.category?.slug);
            const status = course.status ? COURSE_STATUS[course.status] : null;
            return (
              <Link
                key={course.id}
                href={`/dashboard/aulas/${course.id}`}
                className="group flex flex-col rounded-2xl border border-line bg-panel p-5 shadow-card transition-all hover:border-primary/30 hover:shadow-float"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className={clsx("flex size-10 shrink-0 items-center justify-center rounded-xl", tone)}>
                    <Icon size={18} />
                  </span>
                  {status && (
                    <span className={clsx("rounded-full px-2.5 py-1 text-xs font-bold", status.tone)}>
                      {status.label}
                    </span>
                  )}
                </div>
                <p className="mt-4 text-xs font-bold uppercase tracking-wide text-primary">{course.category?.name}</p>
                <h2 className="mt-1 line-clamp-2 text-lg font-bold text-ink">{course.title}</h2>
                <p className="mt-1 text-sm text-ink-soft">
                  {[course.type && COURSE_TYPE_LABEL[course.type], course.modality && MODALITY_LABEL[course.modality], formatCoursePrice(course)]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                <div className="mt-auto flex items-center justify-between pt-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-soft">
                    <Layers size={14} />
                    {course.session_count} {course.session_count === 1 ? "turma" : "turmas"}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-primary">
                    Gerir
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
