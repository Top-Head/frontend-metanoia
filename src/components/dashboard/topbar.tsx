"use client";

import { Bell } from "lucide-react";
import { UserMenu } from "@/components/user-menu";
import { useAuth } from "@/hooks/useAuth";
import { displayName } from "@/services/auth.service";

export default function DashboardTopbar() {
  const { user } = useAuth();
  const firstName = displayName(user).split(" ")[0];

  return (
    <div className="flex items-center justify-between gap-6 px-8">
      <div className="min-w-0">
        <h1 className="truncate text-2xl font-bold text-ink">
          Bem-vindo de volta{firstName ? `, ${firstName}` : ""}
        </h1>
        {/* TODO (fase 4): contar os pedidos pendentes via /api/mentor/enrollments/. */}
        <p className="truncate text-sm text-ink-soft">
          Você tem 4 novas solicitações de serviço esta manhã.
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <button
          type="button"
          aria-label="Notificações"
          className="relative flex size-10 cursor-pointer items-center justify-center rounded-lg bg-line text-ink transition-colors hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <Bell size={18} />
          <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-danger" />
        </button>
        <UserMenu />
      </div>
    </div>
  );
}
