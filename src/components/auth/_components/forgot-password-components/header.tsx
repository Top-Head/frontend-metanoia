import { JSX } from "react";
import { ArrowRight } from "lucide-react";

export function Header(): JSX.Element {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-3 bg-white dark:bg-background-dark">
      <div className="flex items-center gap-3 text-primary">
        <ArrowRight size={20} />
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
          Metanoia Academy
        </h2>
      </div>
    </header>
  );
}