"use client";

import { useRouter } from "next/navigation";
import { Brain } from "lucide-react";
import toast from "react-hot-toast";
import { ErrorState } from "@/components/ui/states";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useAuth } from "@/hooks/useAuth";
import { getStudentProfile } from "@/services/profile.service";
import { MentorProfileForm, StudentProfileForm } from "./profile-forms";

export function StudentProfilePage() {
  const router = useRouter();
  const { user, isMentor, refreshUser } = useAuth();
  const { data: profile, error, isLoading, reload, mutate } = useApiQuery("me-student", getStudentProfile);

  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">Área do aluno</p>
      <h1 className="text-3xl font-bold tracking-tight text-ink">Meu perfil</h1>
      <p className="mb-8 mt-1 text-sm text-ink-soft">{user?.email}</p>

      {error ? (
        <ErrorState message={error.message} onRetry={reload} />
      ) : isLoading || !profile ? (
        <span className="block h-72 animate-pulse rounded-2xl bg-line" aria-busy="true" />
      ) : (
        <div className="space-y-6">
          <section className="rounded-2xl border border-line bg-panel p-6 shadow-card md:p-8">
            <StudentProfileForm
              key={profile.updated_at}
              initial={profile}
              submitLabel="Guardar perfil"
              onSaved={async (saved) => {
                mutate(saved);
                await refreshUser();
                toast.success("Perfil atualizado.");
              }}
            />
          </section>

          {!isMentor && (
            <section className="rounded-2xl border border-line bg-panel p-6 shadow-card md:p-8">
              <div className="mb-6 flex items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Brain size={20} />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-ink">Quer ensinar?</h2>
                  <p className="text-sm text-ink-soft">
                    Crie um perfil de mentor na mesma conta, publique aulas e receba alunos. Continua a ter acesso às
                    suas inscrições.
                  </p>
                </div>
              </div>
              <MentorProfileForm
                key={profile.updated_at}
                create
                initial={{ name: profile.name, bio: profile.bio }}
                submitLabel="Tornar-me mentor"
                onSaved={async () => {
                  await refreshUser();
                  toast.success("Perfil de mentor criado! Bem-vindo ao painel.");
                  router.push("/dashboard");
                }}
              />
            </section>
          )}
        </div>
      )}
    </div>
  );
}
