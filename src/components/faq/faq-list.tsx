"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { Plus, Search } from "lucide-react";
import { FAQ_CATEGORIES } from "@/data/faq";

const ALL = "todas";

function normalize(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

export default function FaqList() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(ALL);

  const categories = useMemo(() => {
    const term = normalize(query.trim());

    return FAQ_CATEGORIES.filter(
      (category) => activeCategory === ALL || category.id === activeCategory
    )
      .map((category) => ({
        ...category,
        items: category.items.filter(
          ({ question, answer }) =>
            !term ||
            normalize(question).includes(term) ||
            normalize(answer).includes(term)
        ),
      }))
      .filter((category) => category.items.length > 0);
  }, [query, activeCategory]);

  function resetFilters() {
    setQuery("");
    setActiveCategory(ALL);
  }

  return (
    <div>
      <div className="flex flex-col gap-5">
        <label className="relative block">
          <span className="sr-only">Buscar pergunta</span>
          <Search
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar pergunta..."
            className="h-12 w-full rounded-xl border border-line-strong bg-panel pl-10 pr-3 text-sm text-ink shadow-card outline-none transition-colors placeholder:text-ink-faint focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </label>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoria">
          {[{ id: ALL, title: "Todas" }, ...FAQ_CATEGORIES].map(({ id, title }) => (
            <button
              key={id}
              type="button"
              aria-pressed={activeCategory === id}
              onClick={() => setActiveCategory(id)}
              className={clsx(
                "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                activeCategory === id
                  ? "bg-ink text-white"
                  : "border border-line bg-panel text-ink-soft hover:border-ink-faint hover:text-ink"
              )}
            >
              {title}
            </button>
          ))}
        </div>
      </div>

      {categories.length > 0 ? (
        <div className="mt-12 space-y-12">
          {categories.map(({ id, title, items }) => (
            <section key={id} aria-labelledby={`faq-${id}`}>
              <h2
                id={`faq-${id}`}
                className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary"
              >
                {title}
              </h2>
              <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-panel">
                {items.map(({ question, answer }) => (
                  <details key={question} className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-5 font-semibold text-ink transition-colors hover:bg-canvas/60 [&::-webkit-details-marker]:hidden">
                      {question}
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform duration-300 group-open:rotate-45">
                        <Plus size={16} />
                      </span>
                    </summary>
                    <p className="px-6 pb-6 pr-20 text-sm leading-relaxed text-ink-soft">
                      {answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-2xl border-2 border-dashed border-line bg-panel py-16 text-center">
          <p className="text-ink-soft">
            Nenhuma pergunta encontrada para &quot;{query}&quot;.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-4 text-sm font-bold text-primary hover:underline"
          >
            Limpar busca
          </button>
        </div>
      )}
    </div>
  );
}
