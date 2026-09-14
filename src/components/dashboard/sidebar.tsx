"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import logoMetanoia from "@/assets/logo.jpeg"
import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  Settings,
  History,
  BookOpenTextIcon
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboards", href: "/dashboard", icon: LayoutDashboard },
  { label: "Edit Profile", href: "#mentor", icon: Users },
  { label: "My Services", href: "#messages", icon: BookOpenTextIcon },
  { label: "Session History", href: "#messages", icon: History },
];

export default function SidebarDashboard() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-x border-[#E7ECF3] bg-white px-4 py-6">
      <div className="flex items-center gap-3 px-2">
                    <Image
              src={logoMetanoia}
              alt="logo metanoia"
              height={50}
              width={50}
            />
        <h1 className="text-lg font-bold text-[#101822]">Metanoia</h1>
      </div>

      <nav className="mt-10 flex flex-col gap-1">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-slate-500 hover:bg-slate-50 hover:text-[#101822]"
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-1 border-t border-[#E7ECF3] pt-4">
        <Link
          href="#"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-[#101822]"
        >
          <Settings className="h-5 w-5" />
          Configurações
        </Link>

      </div>
    </aside>
  );
}
