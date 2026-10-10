"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { UserMenu } from "@/components/user-menu";
import { useAuth } from "@/hooks/useAuth";
import { displayName } from "@/services/auth.service";

interface DashboardTopbarProps {
  /** null enquanto os pedidos carregam. */
  pendingCount: number | null;
}

export default function DashboardTopbar({ pendingCount }: DashboardTopbarProps) {
  const { user } = useAuth();
  const firstName = displayName(user).split(" ")[0];

  const summary =
    pendingCount === null
      ? "A carregar os seus pedidos…"
      : pendingCount === 0
        ? "Não há pedidos de inscrição à espera da sua decisão."
        : `Você tem ${pendingCount} ${pendingCount === 1 ? "pedido de inscrição" : "pedidos de inscrição"} à espera.`;

  return (
    <div className="flex items-center justify-between gap-6 px-8">
      <div className="min-w-0">
        <h1 className="truncate text-2xl font-bold text-ink">
          Bem-vindo de volta{firstName ? `, ${firstName}` : ""}
        </h1>
        <p className="truncate text-sm text-ink-soft">{summary}</p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <Link
          href="/dashboard/aulas/nova"
          className="hidden items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-strong sm:inline-flex"
        >
          <Plus size={16} />
          Nova aula
        </Link>
        <UserMenu />
      </div>
    </div>
  );
}
