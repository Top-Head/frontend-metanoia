"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { ArrowRight, CalendarClock, ClipboardList, Search } from "lucide-react";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { useApiQuery } from "@/hooks/useApiQuery";
import type { Enrollment } from "@/lib/api/types";
import { formatDateTime, isConfirmed, nextStepFor } from "@/lib/enrollment";
import { MODALITY_LABEL, formatCoursePrice } from "@/lib/format";
import { listMyEnrollments } from "@/services/enrollment.service";
import { StatusBadge } from "./status-badge";

type Tab = "todas" | "andamento" | "confirmadas" | "encerradas";

const TABS: Array<{ value: Tab; label: string; match: (enrollment: Enrollment) => boolean }> = [
  { value: "todas", label: "Todas", match: () => true },
  {
    value: "andamento",
    label: "Em andamento",
    match: (e) => e.status === "PENDING",
  },
  { value: "confirmadas", label: "Confirmadas", match: isConfirmed },
  {
    value: "encerradas",
    label: "Encerradas",
    match: (e) => e.status === "CANCELLED" || e.status === "REJECTED",
  },
];

/** Carregamos as inscrições mais recentes de uma vez e filtramos no cliente. */
const FETCH_LIMIT = 50;

function EnrollmentRow({ enrollment }: { enrollment: Enrollment }) {
  const { course, session } = enrollment;
  const step = nextStepFor(enrollment);
  const isPending = enrollment.status === "PENDING";

  return (
    <Link
      href={`/aluno/inscricoes/${enrollment.id}`}
      className="group flex flex-col gap-4 rounded-2xl border border-line bg-panel p-5 shadow-card transition-all hover:border-primary/30 hover:shadow-float sm:flex-row sm:items-center"
    >
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold uppercase tracking-wide text-primary">{course.category_name}</p>
        <h2 className="mt-1 truncate text-lg font-bold text-ink">{course.title}</h2>
        <p className="mt-0.5 text-sm text-ink-soft">
          {session.name}
          {course.modality && ` · ${MODALITY_LABEL[course.modality]}`} · {formatCoursePrice(course)}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <StatusBadge kind="enrollment" status={enrollment.status} />
        </div>
      </div>

      <div className="flex shrink-0 flex-col gap-2 sm:items-end sm:text-right">
        <p className="flex items-center gap-1.5 text-xs text-ink-faint">
          <CalendarClock size={12} />
          Pedido em {formatDateTime(enrollment.requested_at)}
        </p>
        {step && (
          <p className={clsx("max-w-64 text-sm", isPending ? "font-bold text-warning" : "text-ink-soft")}>
            {step}
          </p>
        )}
        <span className="inline-flex items-center gap-1 text-sm font-bold text-primary">
          Ver detalhes
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
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
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">Área do aluno</p>
          <h1 className="text-3xl font-bold tracking-tight text-ink">Minhas inscrições</h1>
        </div>
        <Link
          href="/aluno/catalogo"
          className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
        >
          <Search size={16} />
          Encontrar novas aulas
        </Link>
      </div>

      <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl bg-panel p-1 shadow-card" role="tablist">
        {TABS.map(({ value, label, match }) => {
          const count = enrollments.filter(match).length;
          return (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={tab === value}
              onClick={() => setTab(value)}
              className={clsx(
                "flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
                tab === value ? "bg-indigo-500 text-white" : "text-ink-soft hover:bg-canvas hover:text-ink"
              )}
            >
              {label}
              {data && (
                <span className={clsx("rounded-full px-1.5 text-xs", tab === value ? "bg-white/20" : "bg-line")}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="space-y-4" aria-busy="true">
          {Array.from({ length: 3 }, (_, index) => (
            <span key={index} className="block h-36 animate-pulse rounded-2xl bg-line" />
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error.message} onRetry={reload} />
      ) : visible.length > 0 ? (
        <div className="space-y-4">
          {visible.map((enrollment) => (
            <EnrollmentRow key={enrollment.id} enrollment={enrollment} />
          ))}
          {data && data.count > enrollments.length && (
            <p className="pt-2 text-center text-xs text-ink-faint">
              A mostrar as {enrollments.length} inscrições mais recentes de {data.count}.
            </p>
          )}
        </div>
      ) : enrollments.length === 0 ? (
        <EmptyState
          icon={<ClipboardList size={22} />}
          title="Ainda não tem inscrições"
          description="Escolha uma aula no catálogo e peça inscrição numa turma."
          action={
            <Link
              href="/aluno/catalogo"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-strong"
            >
              Ver aulas
              <ArrowRight size={16} />
            </Link>
          }
        />
      ) : (
        <EmptyState
          icon={<ClipboardList size={22} />}
          title="Nada por aqui"
          description="Não há inscrições nesta categoria."
        />
      )}
    </div>
  );
}
