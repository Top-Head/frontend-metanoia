"use client";

import { useState } from "react";
import clsx from "clsx";
import { Search, UserSearch } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { listCategories } from "@/services/category.service";
import { listMentors } from "@/services/mentor.service";
import { MentorCard } from "./mentor-card";

const PAGE_SIZE = 12;

export function MentorDirectory() {
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search.trim());

  const categories = useApiQuery("categories", () => listCategories());
  const params = {
    search: debouncedSearch,
    specialties: specialty ? [specialty] : undefined,
    page,
    page_size: PAGE_SIZE,
  };
  const mentors = useApiQuery(JSON.stringify(params), () => listMentors(params));
  const totalPages = Math.max(1, Math.ceil((mentors.data?.count ?? 0) / PAGE_SIZE));

  return (
    <div className="flex min-h-screen flex-col bg-canvas font-sans text-ink">
      <Header forceSolid />

      <section className="relative overflow-hidden bg-ink pt-36 pb-16 text-white md:pt-40">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 top-0 size-105 rounded-full bg-primary/15 blur-[140px]" />
          <div className="absolute bottom-0 right-0 size-90 rounded-full bg-primary/10 blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-3xl px-6 text-center lg:px-10">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Nossos mentores</h1>
          <p className="mt-5 text-base leading-relaxed text-white/70 md:text-lg">
            Profissionais que compartilham experiência real em aulas individuais e em grupo.
          </p>
          <label className="relative mx-auto mt-8 block max-w-xl">
            <span className="sr-only">Buscar mentor</span>
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Buscar por nome ou experiência..."
              className="h-12 w-full rounded-xl bg-panel pl-11 pr-4 text-sm text-ink outline-none placeholder:text-ink-faint focus:ring-2 focus:ring-primary/40"
            />
          </label>
        </div>
      </section>

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-12 lg:px-10">
        <div className="mb-10 flex flex-wrap gap-2" role="group" aria-label="Filtrar por especialidade">
          {[{ id: null, name: "Todas" }, ...(categories.data ?? [])].map(({ id, name }) => (
            <button
              key={name}
              type="button"
              aria-pressed={specialty === id}
              onClick={() => {
                setSpecialty(id);
                setPage(1);
              }}
              className={clsx(
                "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                specialty === id
                  ? "bg-ink text-white"
                  : "border border-line bg-panel text-ink-soft hover:border-ink-faint hover:text-ink"
              )}
            >
              {name}
            </button>
          ))}
        </div>

        {mentors.isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 8 }, (_, index) => (
              <span key={index} className="h-40 animate-pulse rounded-2xl bg-line" />
            ))}
          </div>
        ) : mentors.error ? (
          <ErrorState message={mentors.error.message} onRetry={mentors.reload} />
        ) : mentors.data && mentors.data.results.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {mentors.data.results.map((mentor) => (
                <MentorCard key={mentor.id} mentor={mentor} />
              ))}
            </div>
            <Pagination
              label="Paginação de mentores"
              totalPages={totalPages}
              currentPage={page}
              onPageChange={setPage}
            />
          </>
        ) : (
          <EmptyState
            icon={<UserSearch size={22} />}
            title="Nenhum mentor encontrado"
            description="Tente outro nome ou escolha outra especialidade."
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
