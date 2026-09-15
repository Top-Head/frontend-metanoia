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
    </header>
  );
}