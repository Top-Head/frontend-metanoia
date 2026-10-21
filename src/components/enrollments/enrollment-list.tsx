"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Compass } from "lucide-react";
import { EnrollmentTrack } from "@/components/app/enrollment-track";
import { EmptyNote, ErrorNote, PageHeader, Segmented, Skeleton, buttonClass } from "@/components/app/ui";
import { useApiQuery } from "@/hooks/useApiQuery";
import type { Enrollment } from "@/lib/api/types";
import { isConfirmed } from "@/lib/enrollment";
import { MODALITY_LABEL, formatCoursePrice } from "@/lib/format";
import { listMyEnrollments } from "@/services/enrollment.service";

type Tab = "todas" | "andamento" | "confirmadas" | "encerradas";

const TABS: Array<{ value: Tab; label: string; match: (enrollment: Enrollment) => boolean }> = [
  { value: "todas", label: "Todas", match: () => true },
  { value: "andamento", label: "Em análise", match: (e) => e.status === "PENDING" },
  { value: "confirmadas", label: "Confirmadas", match: isConfirmed },
  { value: "encerradas", label: "Encerradas", match: (e) => e.status === "CANCELLED" || e.status === "REJECTED" },
];

const FETCH_LIMIT = 50;
const DAY = new Intl.DateTimeFormat("pt-PT", { day: "numeric", month: "short", year: "numeric" });

function EnrollmentRow({ enrollment }: { enrollment: Enrollment }) {
  const { course, session } = enrollment;

  return (
    <li>
      <Link
        href={`/aluno/inscricoes/${enrollment.id}`}
        className="group grid gap-4 px-5 py-4 transition-colors hover:bg-canvas focus-visible:bg-canvas focus-visible:outline-none lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,0.6fr)_20px] lg:items-center"
      >
        <span className="min-w-0">
          <span className="block truncate text-[15px] font-semibold text-ink group-hover:text-primary">{course.title}</span>
          <span className="block truncate text-[13px] text-ink-soft">
            {[session.name, course.category_name, course.modality && MODALITY_LABEL[course.modality]].filter(Boolean).join(" · ")}
          </span>
        </span>
        <EnrollmentTrack enrollment={enrollment} />
        <span className="flex items-baseline justify-between gap-3 lg:block lg:text-right">
          <span className="block text-sm font-semibold tabular-nums text-ink">{formatCoursePrice(course)}</span>
          <span className="block text-xs text-ink-soft">Pedido a {DAY.format(new Date(enrollment.requested_at))}</span>
        </span>
        <ChevronRight size={18} aria-hidden="true" className="hidden text-ink-faint group-hover:text-ink lg:block" />
      </Link>
    </li>
  );
}

export function EnrollmentList() {
  const [tab, setTab] = useState<Tab>("todas");
  const { data, error, isLoading, reload } = useApiQuery("my-enrollments", () =>
    listMyEnrollments({ page_size: FETCH_LIMIT })
  );

  const enrollments = data?.results ?? [];
  const active = TABS.find((item) => item.value === tab)!;
  const visible = enrollments.filter(active.match);

  return (
    <>
      <PageHeader
        title="Inscrições"
        description="Os pedidos que fez, o ponto em que cada um está e o que falta para a vaga ficar garantida."
        actions={
          <Link href="/aluno/catalogo" className={buttonClass("secondary")}>
            <Compass size={16} aria-hidden="true" />
            Encontrar aulas
          </Link>
        }
      />

      {isLoading ? (
        <div className="space-y-2" aria-busy="true">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-20" />
          ))}
        </div>
      ) : error ? (
        <ErrorNote message={error.message} onRetry={reload} />
      ) : enrollments.length === 0 ? (
        <EmptyNote
          title="Ainda não tem inscrições"
          action={
            <Link href="/aluno/catalogo" className={buttonClass("primary")}>
              Ver aulas
            </Link>
          }
        >
          Escolha uma aula no catálogo e peça inscrição numa turma.
        </EmptyNote>
      ) : (
        <>
          <div className="mb-4">
            <Segmented
              label="Filtrar inscrições"
              value={tab}
              onChange={setTab}
              options={TABS.map(({ value, label, match }) => ({ value, label, count: enrollments.filter(match).length }))}
            />
          </div>
          {visible.length > 0 ? (
            <ul className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-panel">
              {visible.map((enrollment) => (
                <EnrollmentRow key={enrollment.id} enrollment={enrollment} />
              ))}
            </ul>
          ) : (
            <p className="rounded-lg bg-tone px-5 py-10 text-center text-sm text-ink-soft">Não há inscrições neste filtro.</p>
          )}
          {data && data.count > enrollments.length && (
            <p className="pt-3 text-center text-xs text-ink-soft">
              A mostrar as {enrollments.length} inscrições mais recentes de {data.count}.
            </p>
          )}
        </>
      )}
    </>
  );
}
