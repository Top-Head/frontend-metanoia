"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { homePathFor } from "@/services/auth.service";

function FullScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas" aria-busy="true">
      <span className="size-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
      <span className="sr-only">Carregando…</span>
    </div>
  );
}

interface RequireAuthProps {
  children: ReactNode;
  /** Perfil exigido; omita para aceitar qualquer utilizador autenticado. */
  role?: "mentor" | "student";
}

/** Protege uma área: exige sessão e, opcionalmente, um perfil específico. */
export function RequireAuth({ children, role }: RequireAuthProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { status, isMentor, isStudent, endReason } = useAuth();

  useEffect(() => {
    if (status !== "anonymous") return;
    // Logout manual volta ao início; sessão ausente/expirada pede login.
    router.replace(
      endReason === "manual" ? "/" : `/auth/login?next=${encodeURIComponent(pathname)}`
    );
  }, [status, endReason, pathname, router]);

  if (status !== "authenticated") return <FullScreenLoader />;

  const allowed = !role || (role === "mentor" ? isMentor : isStudent);

  if (!allowed) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-6 text-center">
        <span className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-warning-soft text-warning">
          <ShieldAlert size={26} />
        </span>
        <h1 className="text-2xl font-bold text-ink">Área restrita</h1>
        <p className="mt-2 max-w-sm text-sm text-ink-soft">
          {role === "mentor"
            ? "Esta área é exclusiva para mentores. A sua conta não tem perfil de mentor."
            : "Esta área é exclusiva para alunos. A sua conta não tem perfil de aluno."}
        </p>
        <Link
          href="/"
          className="mt-8 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-strong"
        >
          Voltar ao início
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}

/** Para páginas de login/cadastro: quem já está autenticado segue para a sua área. */
export function RedirectIfAuthenticated({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { status, user } = useAuth();
  // Só redireciona quem já chegou autenticado. Quem entra ou se cadastra
  // nesta página passou por "anonymous" e é redirecionado pelo formulário.
  const [seenAnonymous, setSeenAnonymous] = useState(false);
  if (status === "anonymous" && !seenAnonymous) setSeenAnonymous(true);
  const restoredSession = status === "authenticated" && !seenAnonymous;

  useEffect(() => {
    if (restoredSession) router.replace(homePathFor(user));
  }, [restoredSession, user, router]);

  if (status === "loading" || restoredSession) return <FullScreenLoader />;
  return <>{children}</>;
}
