"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDownUp, ArrowRight, GraduationCap, Search, SearchX, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { HeroVideo } from "@/components/hero-video";
import { CourseCard, CourseCardSkeleton } from "@/components/courses/course-card";
import {
  CourseFilters,
  EMPTY_FILTERS,
  type CourseFilterState,
} from "@/components/courses/course-filters";
import { MentorCard } from "@/components/mentors/mentor-card";
import { Pagination } from "@/components/ui/pagination";
import { Select, type SelectOption } from "@/components/ui/select";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type { DiscoveryResult } from "@/lib/api/types";
import { listCategories } from "@/services/category.service";
import { searchCourses } from "@/services/course.service";
import { listMentors } from "@/services/mentor.service";
import { getRecommendations } from "@/services/onboarding.service";
import { useAuth } from "@/hooks/useAuth";

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

export default function Page() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<CourseFilterState>(EMPTY_FILTERS);
  const [sortOrder, setSortOrder] = useState<SortOrder>("relevancia");
  const [currentPage, setCurrentPage] = useState(1);

  const query = useDebouncedValue(searchTerm.trim());

  const categories = useApiQuery("categories", () => listCategories());
  const mentors = useApiQuery("mentors-featured", () => listMentors({ page_size: 4 }));
  const { isStudent } = useAuth();
  const recommended = useApiQuery(isStudent ? "home-recommendations" : null, () => getRecommendations());

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

  function updateFilters(next: CourseFilterState) {
    setFilters(next);
    setCurrentPage(1);
  }

  function resetSearch() {
    setSearchTerm("");
    updateFilters(EMPTY_FILTERS);
  }

  return (
    <div className="min-h-screen bg-canvas font-sans text-ink">
      <Header />

      <section className="relative min-h-screen overflow-hidden">
        <HeroVideo src="/videos/hero-pesquisa.mp4" className="absolute inset-0" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-b from-ink/70 via-ink/50 to-ink/80"
        />

        <div className="relative mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center space-y-8 px-6 pt-24 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold leading-tight text-white md:text-6xl">
              Aprenda com os melhores.{" "}
              <span className="text-sky-300">Conecte-se com mentores especialistas.</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-200 md:text-xl">
              Aulas individuais e em grupo com profissionais de tecnologia, design,
              negócios, idiomas e muito mais.
            </p>
          </div>

          <div className="mx-auto w-full max-w-2xl">
            <label className="flex items-center rounded-2xl border border-white/20 bg-panel/95 p-2 shadow-float backdrop-blur-sm">
              <span className="pl-4 pr-2 text-ink-faint">
                <Search size={20} strokeWidth={2.5} />
              </span>
              <input
                type="search"
                aria-label="Buscar aulas"
                placeholder="O que você quer aprender? Ex.: React, oratória, finanças"
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setCurrentPage(1);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="w-full bg-transparent px-4 py-3 text-base text-ink outline-none placeholder:text-ink-faint"
              />
            </label>
          </div>
        </div>
      </section>

      <main id="catalogo" className="mx-auto max-w-7xl scroll-mt-20 px-6 py-16 lg:px-10">
        {recommended.data && recommended.data.length > 0 && (
          <section aria-labelledby="para-voce-title" className="mb-16 rounded-3xl bg-primary/5 p-6 md:p-8">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  <Sparkles size={14} />
                  Para você
                </p>
                <h2 id="para-voce-title" className="text-2xl font-bold text-ink">
                  Recomendado a partir dos seus objetivos
                </h2>
              </div>
              <Link
                href="/aluno/para-voce"
                className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-primary hover:underline"
              >
                Ver todas
                <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {recommended.data.slice(0, 3).map((result) => (
                <CourseCard key={result.course.id} result={result} />
              ))}
            </div>
          </section>
        )}

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
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }, (_, index) => (
                  <CourseCardSkeleton key={index} />
                ))}
              </div>
            ) : courses.error ? (
              <ErrorState message={courses.error.message} onRetry={courses.reload} />
            ) : visible.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {visible.map((result) => (
                    <CourseCard key={result.course.id} result={result} />
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
                description="Os mentores estão a preparar as primeiras aulas. Volte em breve ou conheça os mentores abaixo."
                action={
                  <Link
                    href="/auth/cadastro?papel=mentor"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-strong"
                  >
                    Quero ensinar
                    <ArrowRight size={16} />
                  </Link>
                }
              />
            )}
          </div>
        </div>

        {mentors.data && mentors.data.results.length > 0 && (
          <section aria-labelledby="mentores-title" className="mt-24">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  Comunidade
                </p>
                <h2 id="mentores-title" className="text-2xl font-bold text-ink">
                  Conheça os mentores
                </h2>
              </div>
              <Link
                href="/mentores"
                className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-primary hover:underline"
              >
                Ver todos ({mentors.data.count})
                <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {mentors.data.results.map((mentor) => (
                <MentorCard key={mentor.id} mentor={mentor} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
