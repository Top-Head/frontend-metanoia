"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Bell, Search } from "lucide-react";
import logoMetanoia from "@/assets/logo.png";

const NAV_ITEMS = [
  { label: "Encontrar Mentores", href: "/" },
  { label: "Tornar-se Mentor", href: "/auth/selecionar-papel" },
  { label: "Meu Aprendizado", href: "/dashboard" },
];

const SCROLL_THRESHOLD = 80;

interface HeaderProps {
  forceSolid?: boolean;
  search?: boolean;
  activeLabel?: string | null;
}

export default function Header({
  forceSolid = false,
  search = false,
  activeLabel = null,
}: HeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onHome = pathname === "/";
  const isAppArea = pathname.startsWith("/dashboard") || pathname.startsWith("/messages");
  const solid = forceSolid || scrolled || !onHome;

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        solid
          ? "border-b border-line bg-panel/95 shadow-card backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={logoMetanoia}
            alt="Academia Metanoia"
            height={58}
            width={58}
            priority
          />
          <span
            className={clsx(
              "text-lg font-bold tracking-tight transition-colors duration-300",
              solid ? "text-ink" : "text-white"
            )}
          >
            Academia Metanoia
          </span>
        </Link>

        {search && (
          <div className="relative hidden w-72 md:block">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
            />
            <input
              type="search"
              placeholder="Buscar mentores..."
              aria-label="Buscar mentores"
              className="w-full rounded-lg border border-line bg-line py-2 pl-10 pr-4 text-sm text-ink outline-none transition-shadow placeholder:text-ink-faint focus:ring-2 focus:ring-primary/20"
            />
          </div>
        )}

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map(({ label, href }) => {
            const isActive = activeLabel
              ? label === activeLabel
              : href === "/"
                ? pathname === "/"
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "text-sm font-semibold transition-colors duration-300",
                  isActive
                    ? "text-primary"
                    : solid
                      ? "text-ink-soft hover:text-primary"
                      : "text-white/80 hover:text-white"
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          {isAppArea ? (
            <>
              <button
                type="button"
                aria-label="Notificações"
                className="relative flex size-10 cursor-pointer items-center justify-center rounded-lg bg-line text-ink transition-colors hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <Bell size={18} />
                <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-danger" />
              </button>
              <Image
                src="/Image+Border.svg"
                alt="Avatar do usuário"
                width={36}
                height={36}
                className="rounded-full"
              />
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className={clsx(
                  "text-sm font-bold transition-colors duration-300",
                  solid
                    ? "text-ink hover:text-primary"
                    : "text-white/90 hover:text-white"
                )}
              >
                Entrar
              </Link>
              <Link
                href="/auth/selecionar-papel"
                className={clsx(
                  "rounded-lg px-5 py-2.5 text-sm font-bold transition-all duration-300",
                  solid
                    ? "bg-primary text-white shadow-card hover:bg-primary-strong"
                    : "border border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                )}
              >
                Cadastre-se Grátis
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}