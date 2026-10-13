"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { CourseCatalog } from "@/components/courses/course-catalog";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

export function StudentCatalog() {
  const [searchTerm, setSearchTerm] = useState("");
  const query = useDebouncedValue(searchTerm.trim());

  return (
    <>
      <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Catálogo de aulas</h1>
          <p className="text-sm text-ink-soft">Encontre a próxima aula e peça a inscrição numa turma.</p>
        </div>
        <label className="flex w-full items-center rounded-xl border border-line-strong bg-panel px-3 shadow-card focus-within:border-primary focus-within:ring-1 focus-within:ring-primary lg:max-w-sm">
          <Search size={18} className="shrink-0 text-ink-faint" />
          <input
            type="search"
            aria-label="Buscar aulas"
            placeholder="Ex.: React, oratória, finanças"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full bg-transparent px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink-faint"
          />
        </label>
      </div>

      <CourseCatalog
        query={query}
        onClearQuery={() => setSearchTerm("")}
        courseHref={(id) => `/aluno/catalogo/${id}`}
        gridClassName="md:grid-cols-2 2xl:grid-cols-3"
      />
    </>
  );
}
