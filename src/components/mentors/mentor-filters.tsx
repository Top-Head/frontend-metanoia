import {
  Filter,
  Grid3X3,
  Code,
  Brain,
  Palette,
  Briefcase,
  Beaker,
  Star,
} from "lucide-react";
import clsx from "clsx";
import type { MentorCategory } from "@/data/mentors";
import { formatKz } from "@/lib/currency";

export type CategoryFilter = MentorCategory | "Todas Categorias";

export type RatingFilter = 4 | 3 | 0;

export const PRICE_MIN = 20_000;
export const PRICE_MAX = 250_000;
const PRICE_STEP = 5_000;

interface MentorFiltersProps {
  selectedCategory: CategoryFilter;
  selectedRating: RatingFilter;
  maxPrice: number;
  onCategoryChange: (category: CategoryFilter) => void;
  onRatingChange: (rating: RatingFilter) => void;
  onPriceChange: (price: number) => void;
  onReset: () => void;
}

const CATEGORIES: Array<{
  value: CategoryFilter;
  label: string;
  icon: typeof Grid3X3;
}> = [
  { value: "Todas Categorias", label: "Todas Categorias", icon: Grid3X3 },
  { value: "Tecnologia", label: "Tecnologia", icon: Code },
  { value: "Psicologia", label: "Psicologia", icon: Brain },
  { value: "Artes", label: "Artes", icon: Palette },
  { value: "Negócios", label: "Negócios", icon: Briefcase },
  { value: "Ciências", label: "Ciências", icon: Beaker },
];

const RATINGS: Array<{ value: RatingFilter; label: string }> = [
  { value: 4, label: "4 estrelas ou mais" },
  { value: 3, label: "3 estrelas ou mais" },
  { value: 0, label: "Todas as avaliações" },
];

export function MentorFilters({
  selectedCategory,
  selectedRating,
  maxPrice,
  onCategoryChange,
  onRatingChange,
  onPriceChange,
  onReset,
}: MentorFiltersProps) {
  return (
    <aside className="w-full shrink-0 lg:w-64">
      <div className="space-y-8 rounded-2xl border border-line bg-panel p-6 shadow-card">
        <div className="flex items-center gap-2 border-b border-line pb-3">
          <Filter size={18} className="text-primary" />
          <h2 className="font-bold text-ink">Filtros</h2>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">
            Categorias
          </p>
          <div className="space-y-1">
            {CATEGORIES.map(({ value, label, icon: Icon }) => {
              const active = selectedCategory === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => onCategoryChange(value)}
                  className={clsx(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-colors",
                    active
                      ? "bg-primary/10 font-bold text-primary"
                      : "text-ink-faint hover:bg-slate-50 hover:text-ink-soft"
                  )}
                >
                  <Icon size={16} strokeWidth={active ? 2.5 : 2} />
                  <span className="text-xs">{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">
              Preço por hora
            </p>
            <span className="text-xs font-bold text-primary">
              até {formatKz(maxPrice)}
            </span>
          </div>
          <div className="px-1">
            <input
              type="range"
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={PRICE_STEP}
              value={maxPrice}
              onChange={(event) => onPriceChange(Number(event.target.value))}
              aria-label="Preço máximo por hora"
              className="w-full accent-primary"
            />
            <div className="mt-2 flex justify-between text-[11px] font-semibold text-ink-faint">
              <span>{formatKz(PRICE_MIN)}</span>
              <span>{formatKz(PRICE_MAX)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">
            Avaliação mínima
          </p>
          <div className="space-y-3">
            {RATINGS.map(({ value, label }) => {
              const active = selectedRating === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => onRatingChange(value)}
                  className="group flex w-full items-center gap-3"
                >
                  <span
                    className={clsx(
                      "flex size-4 items-center justify-center rounded-full border transition-colors",
                      active
                        ? "border-primary bg-primary"
                        : "border-line-strong group-hover:border-primary/50"
                    )}
                  >
                    {active && <span className="size-1.5 rounded-full bg-panel" />}
                  </span>
                  <span
                    className={clsx(
                      "text-xs font-bold transition-colors",
                      active
                        ? "text-ink"
                        : "text-ink-faint group-hover:text-ink-soft"
                    )}
                  >
                    {label}
                  </span>
                  {value > 0 && (
                    <Star
                      size={10}
                      className="-ml-1 fill-yellow-400 text-yellow-400"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="mt-2 w-full rounded-xl border border-line py-3 text-xs font-bold text-ink-soft transition-colors hover:bg-slate-50"
        >
          Limpar todos os filtros
        </button>
      </div>
    </aside>
  );
}