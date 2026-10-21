"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Plus } from "lucide-react";
import { CourseThumb } from "@/components/app/course-thumb";
import {
  EmptyNote,
  ErrorNote,
  PageHeader,
  Segmented,
  Skeleton,
  Status,
  buttonClass,
} from "@/components/app/ui";
import { useAuth } from "@/hooks/useAuth";
import { useApiQuery } from "@/hooks/useApiQuery";
import type { CourseList, CourseStatus } from "@/lib/api/types";
import { COURSE_STATUS } from "@/lib/course";
import { COURSE_TYPE_LABEL, MODALITY_LABEL, formatCoursePrice } from "@/lib/format";
import { listMyCourses } from "@/services/mentor-course.service";

type Filter = CourseStatus | "all";

const FILTERS: Array<{ value: Filter; label: string }> = [
  { value: "all", label: "Todas" },
  { value: "PUBLISHED", label: "Publicadas" },
  { value: "DRAFT", label: "Rascunhos" },
  { value: "ARCHIVED", label: "Arquivadas" },
  { value: "CANCELLED", label: "Canceladas" },
];

function Occupancy({ course }: { course: CourseList }) {
  if (!course.total_capacity) {
    return <span className="text-sm tabular-nums text-ink-soft">{course.total_enrolled} inscritos</span>;
  }
  const ratio = Math.min(course.total_enrolled / course.total_capacity, 1);
  return (
    <span className="block w-full max-w-36">
      <span className="text-sm tabular-nums text-ink">
        {course.total_enrolled}
        <span className="text-ink-soft">/{course.total_capacity}</span>
      </span>
      <span aria-hidden="true" className="mt-1.5 block h-1 overflow-hidden rounded-full bg-tone">
        <span className="block h-full rounded-full bg-primary" style={{ width: `${ratio * 100}%` }} />
      </span>
    </span>
  );
}

function CourseRow({ course }: { course: CourseList }) {
  const status = COURSE_STATUS[course.status ?? "DRAFT"];
  const meta = [
    course.category?.name,
    course.type && COURSE_TYPE_LABEL[course.type],
    course.modality && MODALITY_LABEL[course.modality],
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <li>
      <Link
        href={`/dashboard/aulas/${course.id}`}
        className="group grid grid-cols-[56px_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 px-5 py-4 transition-colors hover:bg-canvas focus-visible:bg-canvas focus-visible:outline-none md:grid-cols-[56px_minmax(0,2.4fr)_minmax(0,1fr)_minmax(0,0.7fr)_minmax(0,1fr)_minmax(0,1fr)_20px]"
      >
        <CourseThumb title={course.title} image={course.image} className="row-span-2 size-14 rounded-md text-lg md:row-span-1" />
        <span className="min-w-0">
          <span className="block truncate text-[15px] font-semibold text-ink group-hover:text-primary">{course.title}</span>
          <span className="block truncate text-[13px] text-ink-soft">{meta}</span>
        </span>
        <span className="justify-self-end md:justify-self-start">
          <Status tone={status.tone}>{status.label}</Status>
        </span>
        <span className="col-start-2 text-[13px] tabular-nums text-ink-soft md:col-start-auto md:text-sm">
          {course.session_count} {course.session_count === 1 ? "turma" : "turmas"}
        </span>
        <span className="hidden md:block">
          <Occupancy course={course} />
        </span>
        <span className="hidden text-sm font-semibold tabular-nums text-ink md:block">{formatCoursePrice(course)}</span>
        <ChevronRight
          size={18}
          aria-hidden="true"
          className="hidden text-ink-faint transition-transform group-hover:translate-x-0.5 group-hover:text-ink md:block"
        />
      </Link>
    </li>
  );
}

export function MyCourses() {
  const { user } = useAuth();
  const mentorId = user?.mentor_profile?.id;
  const [filter, setFilter] = useState<Filter>("all");
  const { data, error, isLoading, reload } = useApiQuery(
    mentorId ? `mentor-courses-${mentorId}` : null,
    () => listMyCourses(mentorId!)
  );

  const courses = data ?? [];
  const visible = filter === "all" ? courses : courses.filter((course) => course.status === filter);

  return (
    <>
      <PageHeader
        title="Aulas"
        description="Cada aula tem turmas, e cada turma tem os seus encontros. Publique quando a primeira turma estiver aberta."
        actions={
          <Link href="/dashboard/aulas/nova" className={buttonClass("primary")}>
            <Plus size={16} aria-hidden="true" />
            Nova aula
          </Link>
        }
      />

      {isLoading || !mentorId ? (
        <div className="space-y-2" aria-busy="true">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-20" />
          ))}
        </div>
      ) : error ? (
        <ErrorNote message={error.message} onRetry={reload} />
      ) : courses.length === 0 ? (
        <EmptyNote
          title="Ainda não criou nenhuma aula"
          action={
            <Link href="/dashboard/aulas/nova" className={buttonClass("primary")}>
              <Plus size={16} aria-hidden="true" />
              Criar a primeira aula
            </Link>
          }
        >
          Comece por um rascunho: descreva a aula e o preço, abra uma turma e agende os encontros.
        </EmptyNote>
      ) : (
        <>
          <div className="mb-4">
            <Segmented
              label="Filtrar aulas por estado"
              value={filter}
              onChange={setFilter}
              options={FILTERS.map(({ value, label }) => ({
                value,
                label,
                count: value === "all" ? courses.length : courses.filter((course) => course.status === value).length,
              }))}
            />
          </div>

          <div className="overflow-hidden rounded-lg border border-line bg-panel">
            <div
              aria-hidden="true"
              className="hidden grid-cols-[56px_minmax(0,2.4fr)_minmax(0,1fr)_minmax(0,0.7fr)_minmax(0,1fr)_minmax(0,1fr)_20px] gap-x-4 bg-canvas px-5 py-2.5 text-xs font-medium text-ink-soft md:grid"
            >
              <span />
              <span>Aula</span>
              <span>Estado</span>
              <span>Turmas</span>
              <span>Ocupação</span>
              <span>Preço</span>
              <span />
            </div>
            {visible.length > 0 ? (
              <ul className="divide-y divide-line">
                {visible.map((course) => (
                  <CourseRow key={course.id} course={course} />
                ))}
              </ul>
            ) : (
              <p className="px-5 py-10 text-center text-sm text-ink-soft">Não há aulas com este estado.</p>
            )}
          </div>
        </>
      )}
    </>
  );
}
