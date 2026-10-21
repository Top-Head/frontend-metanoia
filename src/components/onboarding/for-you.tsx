"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import clsx from "clsx";
import { Pencil, Search } from "lucide-react";
import toast from "react-hot-toast";
import { RecommendationList } from "@/components/app/recommendation-list";
import { EmptyNote, ErrorNote, PageHeader, Skeleton, Spinner, buttonClass } from "@/components/app/ui";
import { Select } from "@/components/ui/select";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useAuth } from "@/hooks/useAuth";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { ApiError } from "@/lib/api/client";
import type { LearningProfile, Level, PreferredModality } from "@/lib/api/types";
import { LEVEL_LABEL, PREFERRED_MODALITY_LABEL } from "@/lib/format";
import {
  getLearningProfile,
  getRecommendations,
  updateLearningProfile,
} from "@/services/onboarding.service";

function ProfileEditor({
  profile,
  onSaved,
  onCancel,
}: {
  profile: LearningProfile;
  onSaved: (next: LearningProfile) => void;
  onCancel: () => void;
}) {
  const [goals, setGoals] = useState(profile.goals ?? "");
  const [topicsText, setTopicsText] = useState(profile.topics_text ?? "");
  const [level, setLevel] = useState<Level>(profile.level ?? "UNKNOWN");
  const [modality, setModality] = useState<PreferredModality>(profile.preferred_modality ?? "ANY");
  const [availability, setAvailability] = useState(profile.availability ?? "");
  const [isSaving, setIsSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    try {
      const saved = await updateLearningProfile(profile.id, {
        goals: goals.trim(),
        topics_text: topicsText.trim(),
        level,
        preferred_modality: modality,
        availability: availability.trim(),
      });
      toast.success("Perfil atualizado. As recomendações foram renovadas.");
      onSaved(saved);
    } catch (reason) {
      toast.error(reason instanceof ApiError ? reason.message : "Não foi possível guardar.");
    } finally {
      setIsSaving(false);
    }
  }

  const field =
    "w-full rounded-md border border-line-strong bg-panel px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-primary focus:ring-1 focus:ring-primary";

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label htmlFor="lp-goals" className="mb-1.5 block text-sm font-semibold text-ink">Objetivos</label>
        <textarea id="lp-goals" rows={2} value={goals} onChange={(e) => setGoals(e.target.value)} className={clsx(field, "resize-y")} placeholder="Ex.: conseguir o primeiro emprego como programador" />
      </div>
      <div>
        <label htmlFor="lp-topics" className="mb-1.5 block text-sm font-semibold text-ink">Temas de interesse</label>
        <input id="lp-topics" value={topicsText} onChange={(e) => setTopicsText(e.target.value)} className={field} placeholder="Ex.: React, inglês para entrevistas" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Nível"
          value={level}
          onChange={(value) => setLevel(value as Level)}
          options={(Object.keys(LEVEL_LABEL) as Level[]).map((value) => ({ value, label: LEVEL_LABEL[value] }))}
        />
        <Select
          label="Modalidade preferida"
          value={modality}
          onChange={(value) => setModality(value as PreferredModality)}
          options={(Object.keys(PREFERRED_MODALITY_LABEL) as PreferredModality[]).map((value) => ({
            value,
            label: PREFERRED_MODALITY_LABEL[value],
          }))}
        />
      </div>
      <div>
        <label htmlFor="lp-availability" className="mb-1.5 block text-sm font-semibold text-ink">Disponibilidade</label>
        <input id="lp-availability" value={availability} onChange={(e) => setAvailability(e.target.value)} className={field} placeholder="Ex.: noites durante a semana" />
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={isSaving} className={buttonClass("primary")}>
          {isSaving && <Spinner />}
          Guardar
        </button>
        <button type="button" onClick={onCancel} disabled={isSaving} className={buttonClass("quiet")}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

function ProfileSummary({ profile, onEdit }: { profile: LearningProfile; onEdit: () => void }) {
  const topics = [
    ...profile.topic_details.map((detail) => String(detail.name ?? "")).filter(Boolean),
    ...(profile.topics_text ? profile.topics_text.split(",").map((topic) => topic.trim()).filter(Boolean) : []),
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <div>
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-[13px] font-medium text-rail-muted">O que quer alcançar</h2>
          <button type="button" onClick={onEdit} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-white hover:underline">
            <Pencil size={13} aria-hidden="true" />
            Ajustar
          </button>
        </div>
        <p className="mt-2 font-display text-[22px] font-semibold leading-snug tracking-[-0.01em] text-white">
          {profile.goals || "Ainda sem objetivo escrito. Ajuste o perfil para o acrescentar."}
        </p>
        {topics.length > 0 && <p className="mt-4 text-sm text-rail-muted">{topics.join(" · ")}</p>}
      </div>
      <dl className="grid grid-cols-3 gap-px self-start overflow-hidden rounded-md bg-rail-raised text-sm lg:grid-cols-1">
        {[
          ["Nível", LEVEL_LABEL[profile.level ?? "UNKNOWN"]],
          ["Modalidade", PREFERRED_MODALITY_LABEL[profile.preferred_modality ?? "ANY"]],
          ["Disponibilidade", profile.availability || "Não indicada"],
        ].map(([term, value]) => (
          <div key={term} className="bg-rail px-4 py-3 lg:flex lg:items-baseline lg:justify-between lg:gap-4">
            <dt className="text-xs text-rail-muted">{term}</dt>
            <dd className="mt-1 truncate font-semibold text-white lg:mt-0">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function ForYou() {
  const { user } = useAuth();
  const studentId = user?.student_profile?.id;
  const [query, setQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [version, setVersion] = useState(0);
  const q = useDebouncedValue(query.trim());

  const profile = useApiQuery(studentId ? `learning-profile-${studentId}` : null, () => getLearningProfile(studentId!));
  const recommendations = useApiQuery(`recommendations-${q}-${version}`, () => getRecommendations(q));
  const hasProfile = Boolean(profile.data);

  return (
    <>
      <PageHeader title="Para você" description="Aulas escolhidas a partir do que quer aprender, do seu nível e de quando pode estudar." />

      <section aria-label="Perfil de aprendizagem" className="mb-10">
        {profile.isLoading || !studentId ? (
          <Skeleton className="h-40" />
        ) : profile.error ? (
          <ErrorNote message={profile.error.message} onRetry={profile.reload} />
        ) : profile.data ? (
          isEditing ? (
            <div className="rounded-lg border border-line bg-panel p-6">
              <h2 className="mb-4 text-base font-semibold text-ink">Ajustar o perfil de aprendizagem</h2>
              <ProfileEditor
                profile={profile.data}
                onCancel={() => setIsEditing(false)}
                onSaved={(next) => {
                  profile.mutate(next);
                  setIsEditing(false);
                  setVersion((current) => current + 1);
                }}
              />
            </div>
          ) : (
            <div className="rounded-lg bg-rail p-6 text-rail-ink md:p-8">
              <ProfileSummary profile={profile.data} onEdit={() => setIsEditing(true)} />
            </div>
          )
        ) : (
          <div className="flex flex-col items-start gap-4 rounded-lg bg-rail p-6 text-rail-ink sm:flex-row sm:items-center sm:justify-between md:p-8">
            <div>
              <h2 className="font-display text-xl font-semibold text-white">Ainda não conhecemos os seus objetivos</h2>
              <p className="mt-1 max-w-lg text-sm text-rail-muted">
                Converse dois minutos com o assistente e as recomendações passam a seguir o que quer aprender.
              </p>
            </div>
            <Link href="/aluno/onboarding" className={buttonClass("primary")}>
              Começar a conversa
            </Link>
          </div>
        )}
      </section>

      <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h2 className="text-base font-semibold text-ink">Recomendações</h2>
        <label className="relative block sm:w-72">
          <span className="sr-only">Refinar recomendações</span>
          <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={hasProfile ? "Refinar (ex.: inglês)" : "O que quer aprender?"}
            className="h-10 w-full rounded-md border border-line-strong bg-panel pl-9 pr-3 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </label>
      </div>

      {recommendations.isLoading ? (
        <Skeleton className="h-72" />
      ) : recommendations.error ? (
        <ErrorNote message={recommendations.error.message} onRetry={recommendations.reload} />
      ) : recommendations.data && recommendations.data.length > 0 ? (
        <RecommendationList results={recommendations.data} />
      ) : (
        <EmptyNote
          title="Ainda sem recomendações"
          action={
            <Link href="/aluno/catalogo" className={buttonClass("secondary")}>
              Ver todas as aulas
            </Link>
          }
        >
          {hasProfile || q
            ? "Não encontrámos aulas para o seu perfil neste momento. Explore o catálogo completo."
            : "Converse com o assistente ou escreva acima o que quer aprender."}
        </EmptyNote>
      )}
    </>
  );
}
