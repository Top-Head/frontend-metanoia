"use client";

import Link from "next/link";
import { ArrowLeft, BadgeCheck, BookOpen, Briefcase, UserX } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CourseCard } from "@/components/courses/course-card";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { useApiQuery } from "@/hooks/useApiQuery";
import { searchCourses } from "@/services/course.service";
import { getMentor } from "@/services/mentor.service";
import { MentorAvatar } from "./mentor-card";

export function MentorProfileView({ id }: { id: number }) {
  const valid = Number.isInteger(id) && id > 0;
  const mentor = useApiQuery(valid ? `mentor-${id}` : null, () => getMentor(id));
  // A API não filtra aulas por mentor; filtramos o catálogo publicado.
  const courses = useApiQuery(valid ? `mentor-courses-${id}` : null, async () => {
    const { results } = await searchCourses({ page_size: 100 });
    return results.filter((result) => result.course.mentor?.id === id);
  });

  const data = mentor.data;
  const notFound = !valid || (!mentor.isLoading && !mentor.error && !data);

  return (
    <div className="flex min-h-screen flex-col bg-canvas font-sans text-ink">
      <Header forceSolid />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-16 pt-28 lg:px-10">
        <Link
          href="/mentores"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-ink-soft transition-colors hover:text-primary"
        >
          <ArrowLeft size={16} />
          Todos os mentores
        </Link>

        {notFound ? (
          <EmptyState
            icon={<UserX size={22} />}
            title="Mentor não encontrado"
            description="O perfil pode ter sido removido ou o link está incorreto."
            action={
              <Link href="/mentores" className="text-sm font-bold text-primary hover:underline">
                Ver mentores
              </Link>
            }
          />
        ) : mentor.error ? (
          <ErrorState message={mentor.error.message} onRetry={mentor.reload} />
        ) : !data ? (
          <div className="space-y-6" aria-busy="true">
            <span className="block h-40 animate-pulse rounded-2xl bg-line" />
            <span className="block h-60 animate-pulse rounded-2xl bg-line" />
          </div>
        ) : (
          <div className="space-y-8">
            <section className="rounded-2xl border border-line bg-panel p-6 shadow-card md:p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <MentorAvatar name={data.name} size="lg" />
                <div className="min-w-0">
                  <h1 className="flex items-center gap-2 text-3xl font-bold text-ink">
                    {data.name}
                    {data.is_verified && (
                      <BadgeCheck size={24} className="text-primary" aria-label="Mentor verificado" />
                    )}
                  </h1>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {data.specialty_details.map((detail) => (
                      <span
                        key={String(detail.id ?? detail.name)}
                        className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                      >
                        {detail.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {data.bio && (
                <p className="mt-6 whitespace-pre-line leading-relaxed text-ink/85">{data.bio}</p>
              )}

              {data.experience_description && (
                <div className="mt-6 rounded-xl bg-canvas p-5">
                  <p className="mb-2 flex items-center gap-2 text-sm font-bold text-ink">
                    <Briefcase size={16} className="text-primary" />
                    Experiência
                  </p>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-ink-soft">
                    {data.experience_description}
                  </p>
                </div>
              )}
            </section>

            <section aria-labelledby="mentor-courses">
              <h2 id="mentor-courses" className="mb-6 text-2xl font-bold text-ink">
                Aulas de {data.name.split(" ")[0]}
              </h2>
              {courses.isLoading ? (
                <span className="block h-48 animate-pulse rounded-2xl bg-line" />
              ) : courses.error ? (
                <ErrorState message={courses.error.message} onRetry={courses.reload} />
              ) : courses.data && courses.data.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {courses.data.map((result) => (
                    <CourseCard key={result.course.id} result={result} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<BookOpen size={22} />}
                  title="Nenhuma aula publicada ainda"
                  description="Este mentor ainda não publicou aulas. Volte em breve."
                />
              )}
            </section>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
