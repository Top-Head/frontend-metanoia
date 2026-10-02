import Link from "next/link";
import Image from "next/image";
import logoMetanoia from "@/assets/logo.png";

const FOOTER_LINKS = [
  { label: "Termos de Serviço", href: "/termos" },
  { label: "Política de Privacidade", href: "/privacidade" },
  { label: "Central de Ajuda", href: "/ajuda" },
  { label: "Fale Conosco", href: "/messages" },
];

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-line bg-panel px-6 py-10 md:px-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-2 text-primary">
          <div>
          <Image
            src={logoMetanoia}
            alt="Academia Metanoia"
            height={58}
            width={58}
            priority
          />
          </div>
          <span className="text-sm font-bold tracking-tight text-ink">
            Academia Metanoia
          </span>
        </div>

        <nav className="flex flex-wrap justify-center gap-4 text-xs font-medium text-ink-soft md:gap-8">
          {FOOTER_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="transition-colors hover:text-primary"
            >
              {label}
            </Link>
          ))}
        </nav>

        <p className="text-[10px] text-ink-faint">
          © {new Date().getFullYear()} Academia Metanoia Inc.
        </p>
      </div>
    </footer>
  );
}