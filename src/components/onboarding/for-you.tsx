"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import clsx from "clsx";
import { Pencil, Search, Sparkles, Target } from "lucide-react";
import toast from "react-hot-toast";
import { CourseCard, CourseCardSkeleton } from "@/components/courses/course-card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { EmptyState, ErrorState } from "@/components/ui/states";
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
    "w-full rounded-lg border border-line-strong bg-panel px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-primary focus:ring-1 focus:ring-primary";

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label htmlFor="lp-goals" className="mb-1.5 block text-sm font-bold text-ink">Objetivos</label>
        <textarea id="lp-goals" rows={2} value={goals} onChange={(e) => setGoals(e.target.value)} className={clsx(field, "resize-y")} placeholder="Ex.: conseguir o primeiro emprego como programador" />
      </div>
      <div>
        <label htmlFor="lp-topics" className="mb-1.5 block text-sm font-bold text-ink">Temas de interesse</label>
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
        <label htmlFor="lp-availability" className="mb-1.5 block text-sm font-bold text-ink">Disponibilidade</label>
        <input id="lp-availability" value={availability} onChange={(e) => setAvailability(e.target.value)} className={field} placeholder="Ex.: noites durante a semana" />
      </div>
      <div className="flex gap-2">
        <Button type="submit" isLoading={isSaving}>Guardar</Button>
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isSaving}>Cancelar</Button>
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
    <div>
      <div className="mb-4 flex items-start justify-between gap-3">
        <p className="flex items-center gap-2 font-bold text-ink">
          <Target size={18} className="text-primary" />
          O seu perfil de aprendizagem
        </p>
        <button type="button" onClick={onEdit} className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline">
          <Pencil size={14} />
          Ajustar
        </button>
      </div>
      {profile.goals && <p className="mb-4 text-sm leading-relaxed text-ink">{profile.goals}</p>}
      <dl className="grid gap-3 text-sm sm:grid-cols-3">
        <div className="rounded-xl bg-canvas p-3">
          <dt className="text-xs text-ink-faint">Nível</dt>
          <dd className="font-bold text-ink">{LEVEL_LABEL[profile.level ?? "UNKNOWN"]}</dd>
        </div>
        <div className="rounded-xl bg-canvas p-3">
          <dt className="text-xs text-ink-faint">Modalidade</dt>
          <dd className="font-bold text-ink">{PREFERRED_MODALITY_LABEL[profile.preferred_modality ?? "ANY"]}</dd>
        </div>
        <div className="rounded-xl bg-canvas p-3">
          <dt className="text-xs text-ink-faint">Disponibilidade</dt>
          <dd className="truncate font-bold text-ink">{profile.availability || "—"}</dd>
        </div>
      </dl>
      {topics.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {topics.map((topic) => (
            <span key={topic} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {topic}
            </span>
          ))}
        </div>
      )}
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
    <div>
      <div className="mb-8">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">Área do aluno</p>
        <h1 className="text-3xl font-bold tracking-tight text-ink">Para você</h1>
        <p className="mt-1 text-sm text-ink-soft">Aulas escolhidas a partir dos seus objetivos.</p>
      </div>

      <section className="mb-10 rounded-2xl border border-line bg-panel p-6 shadow-card">
        {profile.isLoading || !studentId ? (
          <span className="block h-24 animate-pulse rounded-xl bg-line" />
        ) : profile.error ? (
          <ErrorState message={profile.error.message} onRetry={profile.reload} />
        ) : profile.data ? (
          isEditing ? (
            <ProfileEditor
              profile={profile.data}
              onCancel={() => setIsEditing(false)}
              onSaved={(next) => {
                profile.mutate(next);
                setIsEditing(false);
                setVersion((current) => current + 1);
              }}
            />
          ) : (
            <ProfileSummary profile={profile.data} onEdit={() => setIsEditing(true)} />
          )
        ) : (
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Sparkles size={18} />
              </span>
              <div>
                <p className="font-bold text-ink">Ainda não conhecemos os seus objetivos</p>
                <p className="text-sm text-ink-soft">
                  Converse 2 minutos com o assistente para receber recomendações personalizadas.
                </p>
              </div>
            </div>
            <Link
              href="/aluno/onboarding"
              className="shrink-0 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-strong"
            >
              Começar conversa
            </Link>
          </div>
        )}
      </section>

      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="text-xl font-bold text-ink">Recomendações</h2>
        <label className="relative block sm:w-72">
          <span className="sr-only">Refinar recomendações</span>
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={hasProfile ? "Refinar (ex.: inglês)" : "O que quer aprender?"}
            className="h-10 w-full rounded-lg border border-line-strong bg-panel pl-9 pr-3 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </label>
      </div>

      {recommendations.isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <CourseCardSkeleton key={index} />
          ))}
        </div>
      ) : recommendations.error ? (
        <ErrorState message={recommendations.error.message} onRetry={recommendations.reload} />
      ) : recommendations.data && recommendations.data.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {recommendations.data.map((result) => (
            <CourseCard key={result.course.id} result={result} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Sparkles size={22} />}
          title="Ainda sem recomendações"
          description={
            hasProfile || q
              ? "Não encontrámos aulas para o seu perfil neste momento. Explore o catálogo completo."
              : "Converse com o assistente ou escreva o que quer aprender acima."
          }
          action={
            <Link href="/#catalogo" className="text-sm font-bold text-primary hover:underline">
              Ver todas as aulas
            </Link>
          }
        />
      )}
    </div>
  );
}
