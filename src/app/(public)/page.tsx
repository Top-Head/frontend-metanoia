"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { HeroVideo } from "@/components/hero-video";
import { MentorCard } from "@/components/mentors/mentor-card";
import {
  MentorFilters,
  PRICE_MAX,
  type CategoryFilter,
  type RatingFilter,
} from "@/components/mentors/mentor-filters";
import { MentorPagination } from "@/components/mentors/mentor-pagination";
import { MENTORS } from "@/data/mentors";

const PAGE_SIZE = 6;

type SortOrder = "recomendados" | "preco";

export default function Page() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("Todas Categorias");
  const [rating, setRating] = useState<RatingFilter>(0);
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);
  const [sortOrder, setSortOrder] = useState<SortOrder>("recomendados");
  const [currentPage, setCurrentPage] = useState(1);

  const mentors = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    const filtered = MENTORS.filter((mentor) => {
      const matchesQuery =
        !query ||
        mentor.name.toLowerCase().includes(query) ||
        mentor.role.toLowerCase().includes(query) ||
        mentor.skills.some((skill) => skill.toLowerCase().includes(query));

      const matchesCategory =
        category === "Todas Categorias" || mentor.category === category;

      const matchesRating = mentor.rating >= rating;
      const matchesPrice = mentor.price <= maxPrice;

      return (
        matchesQuery &&
        matchesCategory &&
        matchesRating &&
        matchesPrice
      );
    });

    if (sortOrder === "preco") {
      filtered.sort((a, b) => a.price - b.price);
    }

    return filtered;
  }, [searchTerm, category, rating, maxPrice, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(mentors.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);

  const visibleMentors = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return mentors.slice(start, start + PAGE_SIZE);
  }, [mentors, safePage]);

  function resetFilters() {
    setSearchTerm("");
    setCategory("Todas Categorias");
    setRating(0);
    setMaxPrice(PRICE_MAX);
    setSortOrder("recomendados");
    setCurrentPage(1);
  }

  return (
    <div className="min-h-screen bg-canvas font-sans text-ink">
      <Header />

      <section className="relative min-h-screen overflow-hidden">
        <HeroVideo
          src="/videos/hero-pesquisa.mp4"
          className="absolute inset-0"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/50 to-ink/80"
        />

        <div className="relative mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center space-y-8 px-6 pt-24 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold leading-tight text-white md:text-6xl">
              Aprenda com os melhores.{" "}
              <span className="text-sky-300">
                Conecte-se com mentores especialistas.
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-200 md:text-xl">
              Encontre o par perfeito em nosso mercado global de mentores
              profissionais nas áreas de tecnologia, artes e negócios.
            </p>
          </div>

          <div className="mx-auto w-full max-w-2xl">
            <label className="flex items-center rounded-2xl border border-white/20 bg-panel/95 p-2 shadow-float backdrop-blur-sm">
              <span className="pl-4 pr-2 text-ink-faint">
                <Search size={20} strokeWidth={2.5} />
              </span>
              <input
                type="search"
                aria-label="Buscar mentores por especialidade"
                placeholder="Busque por nome, especialidade ou habilidade"
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-transparent px-4 py-3 text-base text-ink outline-none placeholder:text-ink-faint"
              />
            </label>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="flex flex-col gap-12 lg:flex-row">
          <MentorFilters
            selectedCategory={category}
            selectedRating={rating}
            maxPrice={maxPrice}
            onCategoryChange={(next) => {
              setCategory(next);
              setCurrentPage(1);
            }}
            onRatingChange={(next) => {
              setRating(next);
              setCurrentPage(1);
            }}
            onPriceChange={(next) => setMaxPrice(next)}
            onReset={resetFilters}
          />

          <div className="flex-1">
            <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <h2 className="text-2xl font-bold text-ink">
                Mentores em destaque{" "}
                <span className="ml-2 font-medium text-ink-faint">
                  ({mentors.length})
                </span>
              </h2>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-ink-faint">
                  Ordenar por:
                </span>
                <select
                  value={sortOrder}
                  onChange={(event) =>
                    setSortOrder(event.target.value as SortOrder)
                  }
                  className="cursor-pointer bg-transparent text-xs font-bold text-ink focus:outline-none"
                >
                  <option value="recomendados">Recomendados</option>
                  <option value="preco">Preço: menor para maior</option>
                </select>
              </div>
            </div>

            {visibleMentors.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {visibleMentors.map((mentor) => (
                    <MentorCard key={mentor.id} mentor={mentor} />
                  ))}
                </div>
                <MentorPagination
                  totalPages={totalPages}
                  currentPage={safePage}
                  onPageChange={setCurrentPage}
                />
              </>
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-line bg-panel py-20 text-center">
                <p className="text-ink-soft">
                  Nenhum mentor encontrado para os filtros selecionados.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 text-sm font-bold text-primary hover:underline"
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}