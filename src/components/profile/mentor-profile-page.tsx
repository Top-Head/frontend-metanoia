"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import { Avatar, ErrorNote, PageHeader, Panel, Skeleton } from "@/components/app/ui";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useAuth } from "@/hooks/useAuth";
import { getMentorProfile } from "@/services/profile.service";
import { MentorProfileForm, StudentProfileForm } from "./profile-forms";

export function MentorProfilePage() {
  const { user, isStudent, refreshUser } = useAuth();
  const { data: profile, error, isLoading, reload, mutate } = useApiQuery("me-mentor", getMentorProfile);
  const specialties = profile?.specialty_details.map((item) => String(item.name ?? "")).filter(Boolean) ?? [];

  return (
    <>
      <PageHeader title="Perfil" description="É assim que os alunos o veem no catálogo e na página de cada aula." />

      {error ? (
        <ErrorNote message={error.message} onRetry={reload} />
      ) : isLoading || !profile ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]" aria-busy="true">
          <Skeleton className="h-96" />
          <Skeleton className="h-64" />
        </div>
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <Panel title="Dados públicos" description="Nome, apresentação, especialidades e experiência.">
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
          </Panel>

          <aside className="space-y-6 lg:sticky lg:top-8">
            <div className="rounded-lg bg-rail p-6 text-rail-ink">
              <Avatar name={profile.name} size="lg" solid />
              <p className="mt-4 font-display text-xl font-semibold text-white">{profile.name}</p>
              <p className="truncate text-[13px] text-rail-muted">{user?.email}</p>
              <div className="mt-4">
                <span className="inline-flex items-center gap-2 text-[13px] font-medium text-white">
                  <span aria-hidden="true" className={profile.is_verified ? "size-1.5 rounded-full bg-primary" : "size-1.5 rounded-full bg-warning"} />
                  {profile.is_verified ? "Mentor verificado" : "Verificação pendente"}
                </span>
              </div>
              {specialties.length > 0 && (
                <p className="mt-4 text-[13px] leading-5 text-rail-muted">{specialties.join(" · ")}</p>
              )}
              <Link
                href={`/mentor?id=${profile.id}`}
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:underline"
              >
                Ver o perfil público
                <ExternalLink size={14} aria-hidden="true" />
              </Link>
            </div>

            {!isStudent && (
              <Panel
                title="Também quer aprender?"
                description="Crie um perfil de aluno na mesma conta para se inscrever em aulas de outros mentores."
              >
                <StudentProfileForm
                  create
                  initial={{ name: profile.name }}
                  submitLabel="Criar perfil de aluno"
                  onSaved={async () => {
                    await refreshUser();
                    toast.success("Perfil de aluno criado. Já pode inscrever-se em aulas.");
                  }}
                />
              </Panel>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
