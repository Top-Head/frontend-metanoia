"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ArrowDownUp, GraduationCap, SearchX } from "lucide-react";
import { CourseCard, CourseCardSkeleton } from "@/components/courses/course-card";
import {
  CourseFilters,
  EMPTY_FILTERS,
  type CourseFilterState,
} from "@/components/courses/course-filters";
import { Pagination } from "@/components/ui/pagination";
import { Select, type SelectOption } from "@/components/ui/select";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { useApiQuery } from "@/hooks/useApiQuery";
import type { DiscoveryResult } from "@/lib/api/types";
import { listCategories } from "@/services/category.service";
import { searchCourses } from "@/services/course.service";

const PAGE_SIZE = 9;
/** Carregamos o catálogo de uma vez para ordenar por preço no cliente. */
const FETCH_LIMIT = 100;

type SortOrder = "relevancia" | "preco-asc" | "preco-desc";

const SORT_OPTIONS: Array<SelectOption & { value: SortOrder }> = [
  { value: "relevancia", label: "Mais relevantes", description: "Ranking da plataforma" },
  { value: "preco-asc", label: "Menor preço", description: "Gratuitas e mais acessíveis primeiro" },
  { value: "preco-desc", label: "Maior preço", description: "Do valor mais alto ao mais baixo" },
];

const priceOf = ({ course }: DiscoveryResult) =>
  course.is_free ? 0 : Number(course.price_amount ?? 0);

const SORTERS: Record<SortOrder, ((a: DiscoveryResult, b: DiscoveryResult) => number) | null> = {
  relevancia: null,
  "preco-asc": (a, b) => priceOf(a) - priceOf(b),
  "preco-desc": (a, b) => priceOf(b) - priceOf(a),
};

interface CourseCatalogProps {
  query: string;
  onClearQuery: () => void;
  courseHref?: (id: number) => string;
  gridClassName?: string;
  emptyAction?: ReactNode;
}

export function CourseCatalog({
  query,
  onClearQuery,
  courseHref,
  gridClassName = "md:grid-cols-2 xl:grid-cols-3",
  emptyAction,
}: CourseCatalogProps) {
  const [filters, setFilters] = useState<CourseFilterState>(EMPTY_FILTERS);
  const [sortOrder, setSortOrder] = useState<SortOrder>("relevancia");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastQuery, setLastQuery] = useState(query);

  if (query !== lastQuery) {
    setLastQuery(query);
    setCurrentPage(1);
  }

  const categories = useApiQuery("categories", () => listCategories());

  const params = {
    q: query,
    category: filters.category,
    type: filters.type,
    modality: filters.modality,
    free: filters.price === "free" ? true : undefined,
    max_price: typeof filters.price === "number" ? filters.price : undefined,
    page_size: FETCH_LIMIT,
  };
  const courses = useApiQuery(JSON.stringify(params), () => searchCourses(params));

  const sorted = useMemo(() => {
    const results = [...(courses.data?.results ?? [])];
    const sorter = SORTERS[sortOrder];
    return sorter ? results.sort(sorter) : results;
  }, [courses.data, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const visible = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const hasActiveSearch = Boolean(query) || Object.values(filters).some((item) => item !== undefined);
  const grid = `grid grid-cols-1 gap-6 ${gridClassName}`;

  function updateFilters(next: CourseFilterState) {
    setFilters(next);
    setCurrentPage(1);
  }

  function resetSearch() {
    onClearQuery();
    updateFilters(EMPTY_FILTERS);
  }

  return (
    <div className="flex flex-col gap-12 lg:flex-row">
      <CourseFilters
        categories={categories.data ?? []}
        isLoadingCategories={categories.isLoading}
        value={filters}
        onChange={updateFilters}
      />

      <div className="min-w-0 flex-1">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="text-2xl font-bold text-ink">
            {query ? `Resultados para “${query}”` : "Aulas disponíveis"}{" "}
            {courses.data && (
              <span className="ml-1 font-medium text-ink-faint">({sorted.length})</span>
            )}
          </h2>

          <Select
            variant="inline"
            label="Ordenar por:"
            icon={<ArrowDownUp size={14} />}
            options={SORT_OPTIONS}
            value={sortOrder}
            onChange={(next) => {
              setSortOrder(next as SortOrder);
              setCurrentPage(1);
            }}
          />
        </div>

        {courses.isLoading ? (
          <div className={grid}>
            {Array.from({ length: 6 }, (_, index) => (
              <CourseCardSkeleton key={index} />
            ))}
          </div>
        ) : courses.error ? (
          <ErrorState message={courses.error.message} onRetry={courses.reload} />
        ) : visible.length > 0 ? (
          <>
            <div className={grid}>
              {visible.map((result) => (
                <CourseCard
                  key={result.course.id}
                  result={result}
                  href={courseHref?.(result.course.id)}
                />
              ))}
            </div>
            <Pagination
              label="Paginação das aulas"
              totalPages={totalPages}
              currentPage={safePage}
              onPageChange={setCurrentPage}
            />
          </>
        ) : hasActiveSearch ? (
          <EmptyState
            icon={<SearchX size={22} />}
            title="Nenhuma aula encontrada"
            description="Tente outros termos ou remova alguns filtros."
            action={
              <button
                type="button"
                onClick={resetSearch}
                className="text-sm font-bold text-primary hover:underline"
              >
                Limpar busca e filtros
              </button>
            }
          />
        ) : (
          <EmptyState
            icon={<GraduationCap size={22} />}
            title="Ainda não há aulas publicadas"
            description="Os mentores estão a preparar as primeiras aulas. Volte em breve."
            action={emptyAction}
          />
        )}
      </div>
    </div>
  );
}
