import { JSX } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function Header(): JSX.Element {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-line bg-panel px-4 py-2.5 md:px-8">
      <Link href="/" className="flex items-center gap-3 text-ink">
        <span className="text-primary">
          <ArrowRight size={20} />
        </span>
        <span className="text-lg font-semibold">Academia Metanoia</span>
      </Link>

      <nav className="hidden items-center gap-8 md:flex">
        <Link href="/" className="text-sm transition-colors hover:text-primary">
          Encontrar Mentores
        </Link>
        <Link href="/about" className="text-sm transition-colors hover:text-primary">
          Cursos
        </Link>
        <Link href="/about" className="text-sm transition-colors hover:text-primary">
          Comunidade
        </Link>

        <Link
          href="/auth/login"
          className="inline-flex h-9 items-center rounded-lg bg-slate-100 px-4 text-center text-sm font-medium transition-colors hover:bg-slate-200"
        >
          Entrar
        </Link>
      </nav>
    </header>
  );
}