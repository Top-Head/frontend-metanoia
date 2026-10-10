"use client";

import type { ReactNode } from "react";
import clsx from "clsx";
import { Filter, LayoutGrid } from "lucide-react";
import type { Category, CourseType, Modality } from "@/lib/api/types";
import { COURSE_TYPE_LABEL, MODALITY_LABEL } from "@/lib/format";
import { formatKz } from "@/lib/currency";
import { categoryVisual } from "./category-visual";

export interface CourseFilterState {
  category?: number;
  type?: CourseType;
  modality?: Modality;
  /** "free" = só gratuitas; número = preço máximo em Kz. */
  price?: "free" | number;
}

export const EMPTY_FILTERS: CourseFilterState = {};

const PRICE_OPTIONS: Array<{ value: CourseFilterState["price"]; label: string }> = [
  { value: undefined, label: "Qualquer preço" },
  { value: "free", label: "Só gratuitas" },
  ...[5_000, 15_000, 30_000, 60_000].map((max) => ({ value: max, label: `Até ${formatKz(max)}` })),
];

interface CourseFiltersProps {
  categories: Category[];
  isLoadingCategories: boolean;
  value: CourseFilterState;
  onChange: (next: CourseFilterState) => void;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">{title}</p>
      {children}
    </div>
  );
}

function Radio({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className="group flex w-full items-center gap-3 py-0.5"
    >
      <span
        className={clsx(
          "flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors",
          active ? "border-primary bg-primary" : "border-line-strong group-hover:border-primary/50"
        )}
      >
        {active && <span className="size-1.5 rounded-full bg-panel" />}
      </span>
      <span
        className={clsx(
          "text-xs font-bold transition-colors",
          active ? "text-ink" : "text-ink-faint group-hover:text-ink-soft"
        )}
      >
        {label}
      </span>
    </button>
  );
}

export function CourseFilters({
  categories,
  isLoadingCategories,
  value,
  onChange,
}: CourseFiltersProps) {
  const set = (patch: Partial<CourseFilterState>) => onChange({ ...value, ...patch });
  const hasFilters = Object.values(value).some((item) => item !== undefined);

  return (
    <aside className="w-full shrink-0 lg:w-64">
      <div className="space-y-7 rounded-2xl border border-line bg-panel p-6 shadow-card">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-primary" />
            <h2 className="font-bold text-ink">Filtros</h2>
          </div>
          {hasFilters && (
            <button
              type="button"
              onClick={() => onChange(EMPTY_FILTERS)}
              className="text-xs font-bold text-primary hover:underline"
            >
              Limpar
            </button>
          )}
        </div>

        <Section title="Categorias">
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => set({ category: undefined })}
              className={clsx(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-colors",
                value.category === undefined
                  ? "bg-primary/10 font-bold text-primary"
                  : "text-ink-faint hover:bg-slate-50 hover:text-ink-soft"
              )}
            >
              <LayoutGrid size={16} />
              <span className="text-xs">Todas as categorias</span>
            </button>

            {isLoadingCategories
              ? Array.from({ length: 5 }, (_, index) => (
                  <span key={index} className="block h-9 animate-pulse rounded-xl bg-line/60" />
                ))
              : categories.map(({ id, name, slug }) => {
                  const active = value.category === id;
                  const { icon: Icon } = categoryVisual(slug);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => set({ category: id })}
                      className={clsx(
                        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                        active
                          ? "bg-primary/10 font-bold text-primary"
                          : "text-ink-faint hover:bg-slate-50 hover:text-ink-soft"
                      )}
                    >
                      <Icon size={16} strokeWidth={active ? 2.5 : 2} className="shrink-0" />
                      <span className="text-xs">{name}</span>
                    </button>
                  );
                })}
          </div>
        </Section>

        <Section title="Formato">
          <div role="radiogroup" aria-label="Formato" className="space-y-2">
            <Radio active={!value.type} label="Todos" onClick={() => set({ type: undefined })} />
            {(Object.keys(COURSE_TYPE_LABEL) as CourseType[]).map((type) => (
              <Radio
                key={type}
                active={value.type === type}
                label={COURSE_TYPE_LABEL[type]}
                onClick={() => set({ type })}
              />
            ))}
          </div>
        </Section>

        <Section title="Modalidade">
          <div role="radiogroup" aria-label="Modalidade" className="space-y-2">
            <Radio active={!value.modality} label="Todas" onClick={() => set({ modality: undefined })} />
            {(Object.keys(MODALITY_LABEL) as Modality[]).map((modality) => (
              <Radio
                key={modality}
                active={value.modality === modality}
                label={MODALITY_LABEL[modality]}
                onClick={() => set({ modality })}
              />
            ))}
          </div>
        </Section>

        <Section title="Preço">
          <div role="radiogroup" aria-label="Preço" className="space-y-2">
            {PRICE_OPTIONS.map(({ value: price, label }) => (
              <Radio
                key={label}
                active={value.price === price}
                label={label}
                onClick={() => set({ price })}
              />
            ))}
          </div>
        </Section>
      </div>
    </aside>
  );
}
