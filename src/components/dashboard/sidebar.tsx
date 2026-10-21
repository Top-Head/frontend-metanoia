"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import {
  BookOpen,
  ClipboardList,
  Compass,
  Home,
  LogOut,
  MessageCircleHeart,
  MessagesSquare,
  Plus,
  Sparkles,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import logoMetanoia from "@/assets/logo.png";
import { Avatar } from "@/components/app/ui";
import { useAuth } from "@/hooks/useAuth";
import { displayName } from "@/services/auth.service";

export type Area = "mentor" | "student";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
}

const AREAS: Record<Area, { title: string; home: string; profile: string; items: NavItem[] }> = {
  mentor: {
    title: "Mentor",
    home: "/dashboard",
    profile: "/dashboard/perfil",
    items: [
      { label: "Painel", href: "/dashboard", icon: Home, exact: true },
      { label: "Aulas", href: "/dashboard/aulas", icon: BookOpen },
      { label: "Mensagens", href: "/messages", icon: MessagesSquare },
      { label: "Perfil", href: "/dashboard/perfil", icon: UserRound, exact: true },
    ],
  },
  student: {
    title: "Aluno",
    home: "/aluno",
    profile: "/aluno/perfil",
    items: [
      { label: "Painel", href: "/aluno", icon: Home, exact: true },
      { label: "Inscrições", href: "/aluno/inscricoes", icon: ClipboardList },
      { label: "Para você", href: "/aluno/para-voce", icon: Sparkles },
      { label: "Objetivos", href: "/aluno/onboarding", icon: MessageCircleHeart },
      { label: "Catálogo", href: "/aluno/catalogo", icon: Compass },
      { label: "Mensagens", href: "/messages", icon: MessagesSquare },
      { label: "Perfil", href: "/aluno/perfil", icon: UserRound, exact: true },
    ],
  },
};

function useIsActive() {
  const pathname = usePathname();
  return ({ href, exact }: NavItem) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

function AccountMenu({ area, placement }: { area: Area; placement: "rail" | "compact" | "bar" }) {
  const router = useRouter();
  const { user, isMentor, isStudent, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!user) return null;
  const name = displayName(user);
  const other = area === "mentor" ? (isStudent ? { href: "/aluno", label: "Ir para a área de aluno" } : null) : isMentor ? { href: "/dashboard", label: "Ir para a área de mentor" } : null;

  function handleSignOut() {
    setOpen(false);
    signOut();
    toast.success("Sessão terminada.");
    router.replace("/");
  }

  const itemClass =
    "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm font-medium text-ink transition-colors hover:bg-tone";

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={placement === "rail" ? undefined : `Conta de ${name}`}
        onClick={() => setOpen((value) => !value)}
        className={clsx(
          "flex items-center gap-3 rounded-md text-left transition-colors focus-visible:outline-2 focus-visible:outline-primary",
          placement === "rail" ? "w-full p-2 hover:bg-rail-raised" : "p-1 hover:bg-rail-raised"
        )}
      >
        <Avatar name={name} size="sm" solid />
        {placement === "rail" && (
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-white">{name}</span>
            <span className="block truncate text-xs text-rail-muted">{user.email}</span>
          </span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className={clsx(
            "absolute z-50 w-64 rounded-lg bg-panel p-1.5 shadow-float ring-1 ring-line",
            placement === "bar" ? "right-0 top-full mt-2" : "bottom-full left-0 mb-2"
          )}
        >
          <div className="px-3 pb-2 pt-1.5">
            <p className="truncate text-sm font-semibold text-ink">{name}</p>
            <p className="truncate text-xs text-ink-soft">{user.email}</p>
          </div>
          {other && (
            <Link href={other.href} role="menuitem" onClick={() => setOpen(false)} className={itemClass}>
              {other.label}
            </Link>
          )}
          <Link href="/" role="menuitem" onClick={() => setOpen(false)} className={itemClass}>
            Página inicial da Metanoia
          </Link>
          <button type="button" role="menuitem" onClick={handleSignOut} className={clsx(itemClass, "text-danger")}>
            <LogOut size={15} aria-hidden="true" />
            Terminar sessão
          </button>
        </div>
      )}
    </div>
  );
}

export default function SidebarDashboard({ area = "mentor", compact = false }: { area?: Area; compact?: boolean }) {
  const isActive = useIsActive();
  const { title, home, items } = AREAS[area];

  const tip =
    "pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-md bg-ink px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-float transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100";

  return (
    <>
      {compact && (
        <aside className="sticky top-0 z-30 hidden h-dvh w-16 shrink-0 flex-col items-center bg-rail pb-3 pt-4 text-rail-ink lg:flex">
          <Link href={home} aria-label={`Metanoia, área de ${title.toLowerCase()}`} className="group relative flex size-10 items-center justify-center rounded-md hover:bg-rail-raised">
            <Image src={logoMetanoia} alt="" height={28} width={28} priority />
            <span className={tip}>Metanoia · {title}</span>
          </Link>

          {area === "mentor" && (
            <Link
              href="/dashboard/aulas/nova"
              aria-label="Nova aula"
              className="group relative mt-5 flex size-10 items-center justify-center rounded-md bg-primary text-white transition-colors hover:bg-primary-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <Plus size={18} aria-hidden="true" />
              <span className={tip}>Nova aula</span>
            </Link>
          )}

          <nav aria-label="Área de trabalho" className="mt-4 flex flex-col items-center gap-1">
            {items.map((item) => {
              const { label, href, icon: Icon } = item;
              const active = isActive(item);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-label={label}
                  aria-current={active ? "page" : undefined}
                  className={clsx(
                    "group relative flex size-10 items-center justify-center rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-primary",
                    active ? "bg-rail-raised text-primary" : "text-rail-muted hover:bg-rail-raised/60 hover:text-white"
                  )}
                >
                  {active && <span aria-hidden="true" className="absolute inset-y-2 -left-3 w-[3px] rounded-r bg-primary" />}
                  <Icon size={19} aria-hidden="true" />
                  <span className={tip}>{label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto">
            <AccountMenu area={area} placement="compact" />
          </div>
        </aside>
      )}

      <aside className={clsx("sticky top-0 hidden h-dvh w-60 shrink-0 flex-col bg-rail px-3 pb-3 pt-5 text-rail-ink", !compact && "lg:flex")}>
        <Link href={home} className="flex items-center gap-2.5 px-2">
          <Image src={logoMetanoia} alt="" height={30} width={30} priority />
          <span className="font-display text-[17px] font-semibold tracking-[-0.01em] text-white">Metanoia</span>
          <span className="ml-auto rounded bg-rail-raised px-1.5 py-0.5 text-[11px] font-medium text-rail-muted">
            {title}
          </span>
        </Link>

        {area === "mentor" && (
          <Link
            href="/dashboard/aulas/nova"
            className="mx-1 mt-7 flex h-9 items-center justify-center gap-2 rounded-md bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <Plus size={16} aria-hidden="true" />
            Nova aula
          </Link>
        )}

        <nav aria-label="Área de trabalho" className={clsx("flex flex-col gap-0.5", area === "mentor" ? "mt-5" : "mt-7")}>
          {items.map((item) => {
            const { label, href, icon: Icon } = item;
            const active = isActive(item);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={clsx(
                  "group relative flex h-9 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-primary",
                  active ? "bg-rail-raised text-white" : "text-rail-muted hover:bg-rail-raised/60 hover:text-white"
                )}
              >
                {active && <span aria-hidden="true" className="absolute inset-y-2 left-0 w-[3px] rounded-r bg-primary" />}
                <Icon size={17} aria-hidden="true" className={active ? "text-primary" : undefined} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto">
          <AccountMenu area={area} placement="rail" />
        </div>
      </aside>

      <div className="sticky top-0 z-40 bg-rail text-rail-ink lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <Link href={home} className="flex items-center gap-2">
            <Image src={logoMetanoia} alt="" height={26} width={26} />
            <span className="font-display font-semibold text-white">Metanoia</span>
          </Link>
          <AccountMenu area={area} placement="bar" />
        </div>
        <nav aria-label="Área de trabalho" className="flex gap-1 overflow-x-auto px-3 pb-2.5 [scrollbar-width:none]">
          {items.map((item) => {
            const { label, href, icon: Icon } = item;
            const active = isActive(item);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={clsx(
                  "flex h-8 shrink-0 items-center gap-2 rounded-md px-3 text-[13px] font-medium",
                  active ? "bg-rail-raised text-white" : "text-rail-muted"
                )}
              >
                <Icon size={15} aria-hidden="true" className={active ? "text-primary" : undefined} />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
