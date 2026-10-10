"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { ChevronDown, ClipboardList, LayoutDashboard, LogOut, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { displayName } from "@/services/auth.service";

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts.at(-1)![0] : "")).toUpperCase();
}

interface UserMenuProps {
  /** "light" para fundos escuros/transparentes (header sobre o vídeo). */
  tone?: "default" | "light";
}

export function UserMenu({ tone = "default" }: UserMenuProps) {
  const router = useRouter();
  const { user, isMentor, isStudent, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!user) return null;

  const name = displayName(user);

  function handleSignOut() {
    setIsOpen(false);
    signOut();
    toast.success("Sessão terminada.");
    router.replace("/");
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className={clsx(
          "flex items-center gap-2 rounded-full py-1 pl-1 pr-2.5 text-sm font-bold transition-colors",
          tone === "light" ? "text-white hover:bg-white/10" : "text-ink hover:bg-line"
        )}
      >
        <span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
          {initials(name)}
        </span>
        <span className="hidden max-w-32 truncate sm:block">{name}</span>
        <ChevronDown size={14} className={clsx("transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-60 rounded-xl border border-line bg-panel p-1.5 text-ink shadow-float transition duration-150 starting:-translate-y-1 starting:opacity-0"
        >
          <div className="border-b border-line px-3 pb-3 pt-2">
            <p className="truncate text-sm font-bold">{name}</p>
            <p className="truncate text-xs text-ink-soft">{user.email}</p>
          </div>
          <div className="pt-1.5">
            {isMentor && (
              <Link
                href="/dashboard"
                role="menuitem"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-canvas"
              >
                <LayoutDashboard size={16} className="text-ink-soft" />
                Painel do mentor
              </Link>
            )}
            {isStudent && (
              <Link
                href="/aluno/inscricoes"
                role="menuitem"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-canvas"
              >
                <ClipboardList size={16} className="text-ink-soft" />
                Minhas inscrições
              </Link>
            )}
            <Link
              href={isMentor ? "/dashboard/perfil" : "/aluno/perfil"}
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-canvas"
            >
              <UserRound size={16} className="text-ink-soft" />
              Meu perfil
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={handleSignOut}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger/5"
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
