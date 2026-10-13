"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  BookOpen,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  MessageCircleHeart,
  MessagesSquare,
  Presentation,
  Sparkles,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import logoMetanoia from "@/assets/logo.png";
import { UserMenu } from "@/components/user-menu";
import { useAuth } from "@/hooks/useAuth";

type Area = "mentor" | "student";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Só fica ativo na própria página, não nas sub-rotas. */
  exact?: boolean;
}

const AREAS: Record<Area, { home: string; profile: string; items: NavItem[] }> = {
  mentor: {
    home: "/dashboard",
    profile: "/dashboard/perfil",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, exact: true },
      { label: "Minhas aulas", href: "/dashboard/aulas", icon: BookOpen },
      { label: "Mensagens", href: "/messages", icon: MessagesSquare },
      { label: "Ver catálogo", href: "/", icon: Presentation, exact: true },
    ],
  },
  student: {
    home: "/aluno",
    profile: "/aluno/perfil",
    items: [
      { label: "Painel", href: "/aluno", icon: LayoutDashboard, exact: true },
      { label: "Minhas inscrições", href: "/aluno/inscricoes", icon: ClipboardList },
      { label: "Para você", href: "/aluno/para-voce", icon: Sparkles },
      { label: "Meus objetivos", href: "/aluno/onboarding", icon: MessageCircleHeart },
      { label: "Catálogo", href: "/aluno/catalogo", icon: Presentation },
    ],
  },
};

export default function SidebarDashboard({ area = "mentor" }: { area?: Area }) {
  const pathname = usePathname();
  const { signOut } = useAuth();
  const { home, profile, items } = AREAS[area];
  const nav = [...items, { label: "Meu perfil", href: profile, icon: UserRound, exact: true }];

  const isActive = ({ href, exact }: NavItem) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  const linkClass = (active: boolean) =>
    clsx(
      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
      active ? "bg-primary/10 text-primary" : "text-ink-soft hover:bg-slate-50 hover:text-ink"
    );

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-line bg-panel px-4 py-6 md:flex">
        <Link href={home} className="flex items-center gap-3 px-2">
          <Image src={logoMetanoia} alt="Academia Metanoia" height={48} width={48} priority />
          <span className="text-lg font-bold text-ink">Metanoia</span>
        </Link>

        <nav className="mt-10 flex flex-col gap-1">
          {items.map((item) => {
            const { label, href, icon: Icon } = item;
            const active = isActive(item);
            return (
              <Link key={href} href={href} aria-current={active ? "page" : undefined} className={linkClass(active)}>
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-1 border-t border-line pt-4">
          <Link
            href={profile}
            aria-current={pathname === profile ? "page" : undefined}
            className={linkClass(pathname === profile)}
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

      <div className="sticky top-0 z-40 border-b border-line bg-panel/95 backdrop-blur-md md:hidden">
        <div className="flex items-center justify-between px-4 py-2">
          <Link href={home} className="flex items-center gap-2">
            <Image src={logoMetanoia} alt="Academia Metanoia" height={36} width={36} />
            <span className="font-bold text-ink">Metanoia</span>
          </Link>
          <UserMenu />
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-2">
          {nav.map((item) => {
            const { label, href, icon: Icon } = item;
            const active = isActive(item);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={clsx(linkClass(active), "shrink-0 whitespace-nowrap py-2")}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
