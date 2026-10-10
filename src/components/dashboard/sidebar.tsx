"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  LayoutDashboard,
  MessagesSquare,
  Presentation,
  BookOpen,
  UserRound,
  LogOut,
} from "lucide-react";
import toast from "react-hot-toast";
import logoMetanoia from "@/assets/logo.png";
import { useAuth } from "@/hooks/useAuth";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Minhas aulas", href: "/dashboard/aulas", icon: BookOpen },
  { label: "Mensagens", href: "/messages", icon: MessagesSquare },
  { label: "Ver catálogo", href: "/", icon: Presentation },
];

export default function SidebarDashboard() {
  const pathname = usePathname();
  const { signOut } = useAuth();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-line bg-panel px-4 py-6 md:flex">
      <Link href="/" className="flex items-center gap-3 px-2">
        <Image
          src={logoMetanoia}
          alt="Academia Metanoia"
          height={48}
          width={48}
          priority
        />
        <span className="text-lg font-bold text-ink">Metanoia</span>
      </Link>

      <nav className="mt-10 flex flex-col gap-1">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          // "/dashboard" e "/" só ficam ativos na própria página; os restantes também nas sub-rotas.
          const isActive =
            href === "/dashboard" || href === "/" ? pathname === href : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-ink-soft hover:bg-slate-50 hover:text-ink"
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-1 border-t border-line pt-4">
        <Link
          href="/dashboard/perfil"
          aria-current={pathname === "/dashboard/perfil" ? "page" : undefined}
          className={clsx(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            pathname === "/dashboard/perfil"
              ? "bg-primary/10 text-primary"
              : "text-ink-soft hover:bg-slate-50 hover:text-ink"
          )}
        >
          <UserRound size={18} />
          Meu perfil
        </Link>
        <button
          type="button"
          onClick={() => {
            signOut();
            toast.success("Sessão terminada.");
          }}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-danger transition-colors hover:bg-danger/5"
        >
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </aside>
  );
}