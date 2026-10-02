import { JSX } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Header(): JSX.Element {
  return (
    <header className="flex items-center justify-between border-b border-line bg-panel px-6 py-3">
      <Link href="/" className="flex items-center gap-3 text-ink">
        <span className="text-primary">
          <ArrowRight size={20} />
        </span>
        <span className="text-base font-semibold">Academia Metanoia</span>
      </Link>

      <Link
        href="/auth/login"
        className="flex h-9 items-center rounded-lg bg-slate-100 px-4 text-sm font-medium text-ink transition-colors hover:bg-slate-200"
      >
        Entrar
      </Link>
    </header>
  );
}