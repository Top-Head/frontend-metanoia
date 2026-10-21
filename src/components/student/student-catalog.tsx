"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/app/ui";

export function StudentCatalog() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <PageHeader
        title="Catálogo de aulas"
        description="Encontre a próxima aula e peça a inscrição numa turma."
        actions={
          <label className="relative block w-full sm:w-80">
            <span className="sr-only">Buscar aulas</span>
            <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input
              type="search"
              placeholder="Ex.: React, oratória, finanças"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="h-10 w-full rounded-md border border-line-strong bg-panel pl-9 pr-3 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </label>
        }
      />

      {/* <CourseCatalog
        query={query}
        onClearQuery={() => setSearchTerm("")}
        courseHref={(id) => `/aluno/catalogo/${id}`}
        gridClassName="md:grid-cols-2 2xl:grid-cols-3"
      /> */}
    </>
  );
}
