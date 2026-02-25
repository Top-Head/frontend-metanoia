import { JSX } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Header(): JSX.Element {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-3 bg-white dark:bg-slate-900">
      <div className="flex items-center gap-3 text-primary">
        <ArrowRight size={20} />
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
          Metanoia Academy
        </h2>
      </div>

      <Link
        href="/login"
        className="h-9 px-4 flex items-center rounded-md bg-slate-100 dark:bg-slate-800 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition"
      >
        Log in
      </Link>
    </header>
  );
}