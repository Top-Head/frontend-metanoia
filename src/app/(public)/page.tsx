"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { HeroVideo } from "@/components/hero-video";
import { CourseCard } from "@/components/courses/course-card";
import { CourseCatalog } from "@/components/courses/course-catalog";
import { MentorCard } from "@/components/mentors/mentor-card";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { listMentors } from "@/services/mentor.service";
import { getRecommendations } from "@/services/onboarding.service";
import { useAuth } from "@/hooks/useAuth";

export default function Page() {
  const [searchTerm, setSearchTerm] = useState("");
  const query = useDebouncedValue(searchTerm.trim());

  const mentors = useApiQuery("mentors-featured", () => listMentors({ page_size: 4 }));
  const { isStudent } = useAuth();
  const recommended = useApiQuery(isStudent ? "home-recommendations" : null, () => getRecommendations());

  return (
    <div className="min-h-screen bg-canvas font-sans text-ink">
      <Header />

      <section className="relative min-h-screen overflow-hidden">
        <HeroVideo src="/videos/hero-pesquisa.mp4" className="absolute inset-0" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-b from-ink/70 via-ink/50 to-ink/80"
        />

        <div className="relative mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center space-y-8 px-6 pt-24 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold leading-tight text-white md:text-6xl">
              Aprenda com os melhores.{" "}
              <span className="text-sky-300">Conecte-se com mentores especialistas.</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-200 md:text-xl">
              Aulas individuais e em grupo com profissionais de tecnologia, design,
              negócios, idiomas e muito mais.
            </p>
          </div>

          <div className="mx-auto w-full max-w-2xl">
            <label className="flex items-center rounded-2xl border border-white/20 bg-panel/95 p-2 shadow-float backdrop-blur-sm">
              <span className="pl-4 pr-2 text-ink-faint">
                <Search size={20} strokeWidth={2.5} />
              </span>
              <input
                type="search"
                aria-label="Buscar aulas"
                placeholder="O que você quer aprender? Ex.: React, oratória, finanças"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="w-full bg-transparent px-4 py-3 text-base text-ink outline-none placeholder:text-ink-faint"
              />
            </label>
          </div>
        </div>
      </section>

      <main id="catalogo" className="mx-auto max-w-7xl scroll-mt-20 px-6 py-16 lg:px-10">
        {recommended.data && recommended.data.length > 0 && (
          <section aria-labelledby="para-voce-title" className="mb-16 rounded-3xl bg-primary/5 p-6 md:p-8">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  <Sparkles size={14} />
                  Para você
                </p>
                <h2 id="para-voce-title" className="text-2xl font-bold text-ink">
                  Recomendado a partir dos seus objetivos
                </h2>
              </div>
              <Link
                href="/aluno/para-voce"
                className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-primary hover:underline"
              >
                Ver todas
                <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {recommended.data.slice(0, 3).map((result) => (
                <CourseCard key={result.course.id} result={result} />
              ))}
            </div>
          </section>
        )}

        <CourseCatalog
          query={query}
          onClearQuery={() => setSearchTerm("")}
          emptyAction={
            <Link
              href="/auth/cadastro?papel=mentor"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-strong"
            >
              Quero ensinar
              <ArrowRight size={16} />
            </Link>
          }
        />

        {mentors.data && mentors.data.results.length > 0 && (
          <section aria-labelledby="mentores-title" className="mt-24">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  Comunidade
                </p>
                <h2 id="mentores-title" className="text-2xl font-bold text-ink">
                  Conheça os mentores
                </h2>
              </div>
              <Link
                href="/mentores"
                className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-primary hover:underline"
              >
                Ver todos ({mentors.data.count})
                <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {mentors.data.results.map((mentor) => (
                <MentorCard key={mentor.id} mentor={mentor} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
