import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { ArrowRight, Heart, Lightbulb, Users } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Gallery from "@/components/about/Gallery";

const VALUES = [
  {
    icon: Heart,
    title: "Mentoria com cuidado",
    text: "Acreditamos que o melhor aprendizado acontece quando existe respeito e escuta ativa. Cada mentor aqui escolheu estar porque se importa com o crescimento de quem está do outro lado.",
  },
  {
    icon: Lightbulb,
    title: "Aprendizado real",
    text: "Nada de conteúdo genérico e engessado. As sessões são construídas em cima de casos reais e desafios que você enfrenta agora.",
  },
  {
    icon: Users,
    title: "Comunidade de verdade",
    text: "Mais que uma plataforma de aulas, somos um espaço onde mentores e estudantes trocam, colaboram e crescem juntos.",
  },
];

const MILESTONES = [
  {
    year: "2023",
    title: "Um café e uma ideia",
    text: "Dois colegas de universidade percebem que faltava um canal direto com quem já trilhou o caminho.",
  },
  {
    year: "2024",
    title: "A primeira turma",
    text: "Cinco mentores e um grupo fechado de trinta alunos validam o formato de mentoria 1:1.",
  },
  {
    year: "Hoje",
    title: "Uma comunidade global",
    text: "Mais de cem mentores ativos e milhares de sessões realizadas em diferentes países.",
  },
];

const STATS = [
  { value: "100+", label: "Mentores ativos" },
  { value: "4.8", label: "Avaliação média" },
  { value: "8.500+", label: "Sessões realizadas" },
  { value: "12", label: "Países atendidos" },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas font-sans text-ink">
      <Header forceSolid />

      <section className="relative overflow-hidden bg-ink pt-36 pb-20 text-white md:pt-40">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 top-0 size-105 rounded-full bg-primary/15 blur-[140px]" />
          <div className="absolute bottom-0 right-0 size-[360px] rounded-full bg-primary/10 blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-3xl px-6 text-center lg:px-10">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Sobre a Academia Metanoia
          </h1>
          <p className="mt-5 text-base leading-relaxed text-white/70 md:text-lg">
            Criada em 2023 por educadores e profissionais do mercado, a
            Metanoia nasceu com um objetivo simples: conectar quem tem
            experiência de verdade com quem precisa de orientação para dar o
            próximo passo na carreira.
          </p>
        </div>
      </section>

      <main className="flex-1">
        {/* Números */}
        <section aria-label="A Metanoia em números" className="border-b border-line bg-panel">
          <dl className="mx-auto grid max-w-5xl grid-cols-2 px-6 md:grid-cols-4 lg:px-10">
            {STATS.map(({ value, label }, index) => (
              <div
                key={label}
                className={clsx(
                  "flex flex-col gap-1 py-8 md:py-10",
                  index % 2 === 1 && "pl-6",
                  index > 0 ? "md:border-l md:border-line md:pl-6" : "md:pl-0"
                )}
              >
                <dt className="order-2 text-xs font-medium uppercase tracking-wider text-ink-soft">
                  {label}
                </dt>
                <dd className="order-1 font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* História */}
        <section className="mx-auto grid max-w-5xl gap-12 px-6 py-20 md:grid-cols-[1fr_1.1fr] md:gap-16 md:py-28 lg:px-10">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Nossa história
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-ink md:text-4xl">
              Como tudo começou
            </h2>
            <p className="mt-5 leading-relaxed text-ink-soft">
              Mesmo com muito conteúdo disponível na internet, faltava um
              caminho direto para tirar dúvidas reais com quem já esteve no
              mesmo lugar. A Metanoia nasceu para preencher esse espaço, com
              conversas honestas e orientação feita sob medida.
            </p>
          </div>

          <ol className="relative space-y-10 border-l-2 border-line-strong pl-8">
            {MILESTONES.map(({ year, title, text }, index) => (
              <li key={year} className="relative">
                <span
                  aria-hidden="true"
                  className={clsx(
                    "absolute -left-10 top-1 size-3.5 rounded-full border-2 border-canvas",
                    index === MILESTONES.length - 1
                      ? "bg-primary ring-4 ring-primary/15"
                      : "bg-ink-faint"
                  )}
                />
                <p className="text-xs font-bold uppercase tracking-wider text-primary">
                  {year}
                </p>
                <h3 className="mt-1 text-lg font-bold text-ink">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Valores */}
        <section className="border-y border-line bg-panel">
          <div className="mx-auto max-w-5xl px-6 py-20 md:py-28 lg:px-10">
            <div className="mb-12 max-w-xl">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                No que acreditamos
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-ink md:text-4xl">
                Os valores por trás de cada sessão
              </h2>
            </div>

            <div className="grid gap-px overflow-hidden bg-line md:grid-cols-3">
              {VALUES.map(({ icon: Icon, title, text }, index) => (
                <article key={title} className="flex flex-col bg-panel p-8">
                  <div className="mb-8 flex items-center justify-between">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon size={20} />
                    </span>
                    <span className="font-display text-sm font-bold text-ink-faint">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-ink">{title}</h3>
                  <p className="text-sm leading-relaxed text-ink-soft">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Nome */}
        <section className="mx-auto grid max-w-5xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:gap-16 md:py-28 lg:px-10">
          <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-line shadow-float">
            <Image
              src="/Rectangle 1.png"
              alt="Pessoa empurrando uma grande rocha montanha acima ao pôr do sol"
              fill
              sizes="(min-width: 768px) 480px, 100vw"
              className="object-cover"
            />
          </div>

          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              O nome
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-ink md:text-4xl">
              Por que &quot;Metanoia&quot;?
            </h2>
            <p className="mt-4 font-display text-lg text-ink-soft">
              <span lang="el" className="text-ink">μετάνοια</span>
              <span className="mx-2 text-ink-faint">·</span>
              <em>mudança de pensamento</em>
            </p>
            <p className="mt-5 leading-relaxed text-ink-soft">
              Escolhemos esse nome porque acreditamos que o maior salto na
              carreira começa quando alguém te ajuda a olhar de um jeito novo
              para o que você já sabe fazer. E é exatamente isso que acontece
              em cada sessão de mentoria.
            </p>
          </div>
        </section>

        <div className="border-t border-line">
          <Gallery />
        </div>

        {/* CTA */}
        <section className="px-6 pb-8 lg:px-10">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-ink px-8 py-14 text-center text-white md:px-16 md:py-20">
            <div aria-hidden="true" className="pointer-events-none absolute -top-24 left-1/2 size-105 -translate-x-1/2 rounded-full bg-primary/25 blur-[120px]" />
            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Pronto para o seu próximo passo?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-white/70">
                Encontre um mentor que já trilhou o caminho que você quer
                seguir, ou compartilhe a sua experiência com quem está
                começando.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-strong"
                >
                  Encontrar mentores
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/auth/selecionar-papel"
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
                >
                  Tornar-se mentor
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
