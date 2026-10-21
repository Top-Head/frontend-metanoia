"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ErrorNote, PageHeader, Panel, Skeleton } from "@/components/app/ui";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useAuth } from "@/hooks/useAuth";
import { getStudentProfile } from "@/services/profile.service";
import { MentorProfileForm, StudentProfileForm } from "./profile-forms";

export function StudentProfilePage() {
  const router = useRouter();
  const { user, isMentor, refreshUser } = useAuth();
  const { data: profile, error, isLoading, reload, mutate } = useApiQuery("me-student", getStudentProfile);

  return (
    <>
      <PageHeader title="Perfil" description={user?.email} />

      {error ? (
        <ErrorNote message={error.message} onRetry={reload} />
      ) : isLoading || !profile ? (
        <Skeleton className="h-72" />
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
          <Panel title="Os seus dados" description="O mentor vê o seu nome quando recebe o pedido de inscrição.">
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
          </Panel>

          {!isMentor && (
            <section aria-labelledby="teach-title" className="rounded-lg bg-rail p-6 text-rail-ink md:p-8">
              <h2 id="teach-title" className="font-display text-xl font-semibold text-white">
                Também quer ensinar?
              </h2>
              <p className="mb-6 mt-1 text-sm text-rail-muted">
                Crie um perfil de mentor na mesma conta, publique aulas e receba alunos. As suas inscrições continuam
                aqui.
              </p>
              <div className="rounded-md bg-panel p-5 text-ink">
                <MentorProfileForm
                  key={profile.updated_at}
                  create
                  initial={{ name: profile.name, bio: profile.bio }}
                  submitLabel="Tornar-me mentor"
                  onSaved={async () => {
                    await refreshUser();
                    toast.success("Perfil de mentor criado. Bem-vindo ao painel.");
                    router.push("/dashboard");
                  }}
                />
              </div>
            </section>
          )}
        </div>
      )}
    </>
  );
}
