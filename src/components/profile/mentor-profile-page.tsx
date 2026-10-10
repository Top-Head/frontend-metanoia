"use client";

import Link from "next/link";
import { BadgeCheck, Clock, ExternalLink, GraduationCap } from "lucide-react";
import toast from "react-hot-toast";
import { MentorAvatar } from "@/components/mentors/mentor-card";
import { ErrorState } from "@/components/ui/states";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useAuth } from "@/hooks/useAuth";
import { getMentorProfile } from "@/services/profile.service";
import { MentorProfileForm, StudentProfileForm } from "./profile-forms";

export function MentorProfilePage() {
  const { user, isStudent, refreshUser } = useAuth();
  const { data: profile, error, isLoading, reload, mutate } = useApiQuery("me-mentor", getMentorProfile);

  return (
    <div className="mx-auto max-w-5xl px-8">
      <h1 className="text-2xl font-bold text-ink">Meu perfil</h1>
      <p className="mb-8 text-sm text-ink-soft">É assim que os alunos o veem no catálogo e nas suas aulas.</p>

      {error ? (
        <ErrorState message={error.message} onRetry={reload} />
      ) : isLoading || !profile ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]" aria-busy="true">
          <span className="block h-96 animate-pulse rounded-2xl bg-line" />
          <span className="block h-48 animate-pulse rounded-2xl bg-line" />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <section className="rounded-2xl border border-line bg-panel p-6 shadow-card md:p-8">
            <MentorProfileForm
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

          <aside className="space-y-6">
            <div className="rounded-2xl border border-line bg-panel p-6 text-center shadow-card">
              <div className="flex justify-center">
                <MentorAvatar name={profile.name} size="lg" />
              </div>
              <p className="mt-4 font-bold text-ink">{profile.name}</p>
              <p className="text-xs text-ink-soft">{user?.email}</p>
              {profile.is_verified ? (
                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  <BadgeCheck size={14} />
                  Mentor verificado
                </span>
              ) : (
                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-warning-soft px-3 py-1 text-xs font-bold text-warning">
                  <Clock size={14} />
                  Verificação pendente
                </span>
              )}
              <Link
                href={`/mentor?id=${profile.id}`}
                className="mt-5 flex items-center justify-center gap-1.5 text-sm font-bold text-primary hover:underline"
              >
                Ver perfil público
                <ExternalLink size={14} />
              </Link>
            </div>

            {!isStudent && (
              <div className="rounded-2xl border border-line bg-panel p-6 shadow-card">
                <p className="flex items-center gap-2 font-bold text-ink">
                  <GraduationCap size={18} className="text-primary" />
                  Também quer aprender?
                </p>
                <p className="mb-5 mt-1 text-sm text-ink-soft">
                  Crie um perfil de aluno na mesma conta para se inscrever em aulas de outros mentores.
                </p>
                <StudentProfileForm
                  create
                  initial={{ name: profile.name }}
                  submitLabel="Criar perfil de aluno"
                  onSaved={async () => {
                    await refreshUser();
                    toast.success("Perfil de aluno criado! Já pode inscrever-se em aulas.");
                  }}
                />
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
