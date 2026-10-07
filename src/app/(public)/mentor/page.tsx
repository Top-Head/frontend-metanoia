import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Globe,
  Link as LinkIcon,
  Mail,
  Share2,
  Star,
  Users,
  Verified,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BookingPanel } from "@/components/mentors/booking-panel";
import { MENTORS, type Mentor } from "@/data/mentors";

export const metadata: Metadata = {
  title: "Perfil do Mentor",
};

interface MentorPageProps {
  searchParams: Promise<{ id?: string }>;
}

interface MentorReview {
  author: string;
  date: string;
  course: string;
  text: string;
}

interface MentorProfile {
  bio: string[];
  experience: string[];
  stats: { students: string; hours: string; rating: string };
  reviews: MentorReview[];
}

const REVIEW_AUTHORS = [
  "Marcus Thompson",
  "Larissa Mendes",
  "João Pedro Silva",
  "Beatriz Costa",
  "Rafael Nogueira",
  "Camila Duarte",
  "Thiago Martins",
  "Mariana Souza",
];

function buildProfile(mentor: Mentor): MentorProfile {
  const rating = mentor.rating ?? 4.9;
  const students = `${mentor.reviews * 4}+ Estudantes`;
  const hours = `${mentor.reviews * 9}+ Horas Mentoras`;

  const reviewCount = Math.min(2, mentor.reviews);
  const reviews: MentorReview[] = Array.from(
    { length: reviewCount },
    (_, index) => {
      const author =
        REVIEW_AUTHORS[(mentor.id + index) % REVIEW_AUTHORS.length];
      const seed = mentor.id * 31 + index * 7;
      const text =
        seed % 3 === 0
          ? `A mentoria com ${mentor.name.split(" ")[0]} foi transformadora. Consegui aplicar cada direcionamento na prática e tive avanços que eu adiava há meses.`
          : seed % 3 === 1
            ? `Feedback direto, objetivo e muito bem fundamentado. Recomendo para quem busca crescimento real e consistente na área de ${mentor.category.toLowerCase()}.`
            : `Uma experiência que superou minhas expectativas. O mentor tem uma didática clara e sabe exatamente onde apontar melhorias.`;

      return {
        author,
        date: index === 0 ? "há 2 semanas" : "há 1 mês",
        course: "Mentoria 1:1",
        text,
      };
    }
  );

  return {
    bio: [
      `${mentor.name.split(" ")[0]} é ${mentor.role.toLowerCase()} com histórico sólido em ${mentor.category.toLowerCase()}. Com mais de 10 anos de experiência, o foco é unir o rigor da teoria ao que realmente funciona na prática.`,
      `Além de atuar com casos reais e projetos de alto impacto, metodologia de mentoria é conhecida por ser direta e orientada a resultados: cada sessão termina com um plano de ação claro para a carreira.`,
    ],
    experience: mentor.skills,
    stats: {
      students,
      hours,
      rating: `${rating.toFixed(1)}/5.0 Classificação média`,
    },
    reviews,
  };
}


export default async function MentorProfilePage({
  searchParams,
}: MentorPageProps) {
  const { id } = await searchParams;
  const mentorId = Number(id);
  const mentor = MENTORS.find((item) => item.id === mentorId);

  if (!mentor) {
    return (
      <div className="flex min-h-screen flex-col bg-canvas font-sans text-ink">
        <Header />
        <main className="flex flex-1 flex-col items-center justify-center px-6 py-32 text-center">
          <p className="text-sm font-bold text-primary">
            Mentor não encontrado
          </p>
          <h1 className="mt-3 max-w-md text-3xl font-bold text-ink">
            Não localizamos este perfil.
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
            O perfil pode ter sido removido ou o link está incorreto. Explore
            outros mentores disponíveis no marketplace.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-card transition-colors hover:bg-primary-strong"
          >
            <ArrowLeft size={16} />
            Voltar para a busca
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const profile = buildProfile(mentor);

  return (
    <div className="flex min-h-screen flex-col bg-canvas font-sans text-ink">
      <Header forceSolid />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 pt-28 pb-10 md:px-10">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-ink-soft transition-colors hover:text-primary"
        >
          <ArrowLeft size={16} />
          Voltar aos mentores
        </Link>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <div className="sticky top-24 rounded-2xl border border-line bg-panel p-6 shadow-card">
              <div className="relative mb-6 aspect-square overflow-hidden rounded-xl bg-slate-200">
                <Image
                  src={mentor.image}
                  alt={`Foto de ${mentor.name}`}
                  fill
                  sizes="(min-width: 1024px) 25vw, 100vw"
                  className="object-cover"
                />
              </div>

              <div className="mb-1 flex items-center gap-2">
                <h2 className="text-xl font-bold text-ink">{mentor.name}</h2>
                <Verified size={20} className="fill-primary/10 text-primary" />
              </div>
              <p className="mb-6 text-sm leading-snug text-ink-soft">
                {mentor.role}
              </p>

              <div className="space-y-4 border-t border-line py-6">
                <div className="flex items-center gap-3 text-sm font-medium text-ink-soft">
                  <Users size={18} />
                  {profile.stats.students}
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-ink-soft">
                  <Clock size={18} />
                  {profile.stats.hours}
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-ink-soft">
                  <Star size={18} />
                  {profile.stats.rating}
                </div>
              </div>

              <Link
                href="/messages"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-bold text-white shadow-card transition-colors hover:bg-primary-strong"
              >
                <Mail size={18} />
                Enviar Mensagem
              </Link>

              <div className="mt-6 flex justify-center gap-6 border-t border-line pt-6 text-ink-faint">
                <Globe size={20} className="cursor-pointer transition-colors hover:text-primary" />
                <LinkIcon size={20} className="cursor-pointer transition-colors hover:text-primary" />
                <Share2 size={20} className="cursor-pointer transition-colors hover:text-primary" />
              </div>
            </div>
          </aside>

          <div className="space-y-8 lg:col-span-6">
            <section className="rounded-2xl border border-line bg-panel p-6 shadow-card md:p-8">
              <h2 className="mb-4 text-2xl font-bold text-ink">Sobre Mim</h2>
              <div className="space-y-4 leading-relaxed text-ink/90">
                {profile.bio.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <h3 className="mb-4 mt-8 font-bold text-ink">
                Especialidades
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.experience.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-line bg-panel p-6 shadow-card md:p-8">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-ink">
                  Avaliações de estudantes
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-ink">
                    {mentor.rating.toFixed(1)}
                  </span>
                  <div className="flex text-yellow-400">
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star
                        key={index}
                        size={16}
                        fill="currentColor"
                        className={index >= Math.round(mentor.rating) ? "opacity-40" : undefined}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {profile.reviews.map((review) => (
                  <article
                    key={`${review.author}-${review.date}`}
                    className="border-b border-line pb-6 last:border-0 last:pb-0"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                          {review.author.charAt(0)}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-ink">
                            {review.author}
                          </p>
                          <p className="text-xs text-ink-soft">
                            {review.date} • {review.course}
                          </p>
                        </div>
                      </div>
                      <div className="flex text-yellow-400">
                        <Star size={14} fill="currentColor" />
                      </div>
                    </div>
                    <p className="text-sm italic text-ink-soft">
                      &quot;{review.text}&quot;
                    </p>
                  </article>
                ))}
              </div>
              <button
                type="button"
                className="mt-6 text-sm font-bold text-primary hover:underline"
              >
                Ver todas as avaliações
              </button>
            </section>
          </div>

          <aside className="lg:col-span-3">
            <BookingPanel basePrice={mentor.price} />
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
