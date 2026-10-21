import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { DiscoveryResult } from "@/lib/api/types";
import { MODALITY_LABEL, formatCoursePrice } from "@/lib/format";
import { CourseThumb } from "./course-thumb";

export function RecommendationList({ results }: { results: DiscoveryResult[] }) {
  return (
    <ul className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-panel">
      {results.map(({ course, reasons, has_capacity }) => (
        <li key={course.id}>
          <Link
            href={`/aluno/catalogo/${course.id}`}
            className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-canvas focus-visible:bg-canvas focus-visible:outline-none"
          >
            <CourseThumb title={course.title} image={course.image} className="size-16 rounded-md text-xl" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[15px] font-semibold text-ink group-hover:text-primary">
                {course.title}
              </span>
              <span className="block truncate text-[13px] text-ink-soft">
                {[course.mentor?.name, course.category?.name, course.modality && MODALITY_LABEL[course.modality]]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
              {reasons.length > 0 && (
                <span className="mt-1 block truncate text-[13px] text-primary">{reasons.slice(0, 2).join(" · ")}</span>
              )}
            </span>
            <span className="hidden shrink-0 text-right sm:block">
              <span className="block text-sm font-semibold tabular-nums text-ink">{formatCoursePrice(course)}</span>
              <span className="block text-xs text-ink-soft">{has_capacity ? "Com vagas" : "Sem vagas"}</span>
            </span>
            <ChevronRight size={18} aria-hidden="true" className="shrink-0 text-ink-faint group-hover:text-ink" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
