"use client";

import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import clsx from "clsx";
import { Check, RotateCw } from "lucide-react";
import type { Category } from "@/lib/api/types";
import { listCategories } from "@/services/category.service";

interface SpecialtyPickerProps {
  value: number[];
  onChange: Dispatch<SetStateAction<number[]>>;
  error?: string;
}

type LoadState = "loading" | "ready" | "error";

export function SpecialtyPicker({ value, onChange, error }: SpecialtyPickerProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [state, setState] = useState<LoadState>("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    listCategories()
      .then((result) => {
        if (cancelled) return;
        setCategories(result.filter((category) => category.is_active !== false));
        setState("ready");
      })
      .catch(() => {
        if (!cancelled) setState("error");
      });

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  function retry() {
    setState("loading");
    setAttempt((current) => current + 1);
  }

  function toggle(id: number) {
    onChange((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }

  return (
    <fieldset>
      <legend className="mb-2 text-sm font-bold text-ink">
        Especialidades{" "}
        <span className="font-normal text-ink-faint">(escolha uma ou mais)</span>
      </legend>

      {state === "loading" && (
        <div className="flex flex-wrap gap-2" aria-busy="true" aria-label="Carregando especialidades">
          {Array.from({ length: 6 }, (_, index) => (
            <span key={index} className="h-9 w-28 animate-pulse rounded-full bg-line" />
          ))}
        </div>
      )}

      {state === "error" && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-line bg-canvas px-4 py-3 text-sm text-ink-soft">
          Não foi possível carregar as especialidades.
          <button
            type="button"
            onClick={retry}
            className="inline-flex shrink-0 items-center gap-1.5 font-bold text-primary hover:underline"
          >
            <RotateCw size={14} />
            Tentar de novo
          </button>
        </div>
      )}

      {state === "ready" && categories.length === 0 && (
        <p className="text-sm text-ink-soft">Nenhuma especialidade disponível no momento.</p>
      )}

      {state === "ready" && categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {categories.map(({ id, name }) => {
            const selected = value.includes(id);
            return (
              <button
                key={id}
                type="button"
                aria-pressed={selected}
                onClick={() => toggle(id)}
                className={clsx(
                  "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                  selected
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-line-strong bg-panel text-ink-soft hover:border-ink-faint hover:text-ink"
                )}
              >
                {selected && <Check size={14} />}
                {name}
              </button>
            );
          })}
        </div>
      )}

      {error && <p className="mt-1.5 text-xs font-medium text-danger">{error}</p>}
    </fieldset>
  );
}
