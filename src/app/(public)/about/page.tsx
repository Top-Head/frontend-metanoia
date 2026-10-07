import { Heart, Lightbulb, Users } from "lucide-react";
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

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas font-sans text-ink">
      <Header forceSolid />

      <section className="relative overflow-hidden bg-ink pt-36 pb-20 text-white md:pt-40">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 top-0 size-[420px] rounded-full bg-primary/15 blur-[140px]" />
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

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-20 lg:px-10">
        <div className="space-y-12 md:space-y-16">
          <div className="max-w-2xl">
            <h2 className="mb-3 text-2xl font-bold text-ink">Como tudo começou</h2>
            <p className="text-sm leading-relaxed text-ink/80">
              A ideia surgiu durante um café entre dois colegas de universidade
              que perceberam que, mesmo com muito conteúdo disponível na
              internet, faltava um canal direto para tirar dúvidas reais com
              quem já trilhou o caminho. Começamos com cinco mentores e um
              grupo fechado de trinta alunos. Hoje são mais de cem mentores
              ativos e milhares de sessões realizadas em diferentes países.
            </p>
          </div>

          <div className="grid gap-10 md:grid-cols-3">
            {VALUES.map(({ icon: Icon, title, text }) => (
              <article
                key={title}
                className="rounded-2xl border border-line bg-panel p-6 shadow-card"
              >
                <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon size={20} />
                </div>
                <h3 className="mb-2 text-base font-bold text-ink">{title}</h3>
                <p className="text-sm leading-relaxed text-ink/75">{text}</p>
              </article>
            ))}
          </div>

          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <h2 className="mb-3 text-2xl font-bold text-ink">
                Por que &quot;Metanoia&quot;?
              </h2>
              <p className="text-sm leading-relaxed text-ink/80">
                A palavra vem do grego e significa &quot;mudança de
                pensamento&quot;. Escolhemos esse nome porque acreditamos que
                o maior salto na carreira começa quando alguém te ajuda a
                olhar de um jeito novo para o que você já sabe fazer. E é
                exatamente isso que acontece em cada sessão de mentoria.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="rounded-2xl border border-line bg-panel p-5 shadow-card">
                  <p className="text-2xl font-bold text-primary">100+</p>
                  <p className="mt-1 text-xs font-medium text-ink-soft">
                    Mentores ativos
                  </p>
                </div>
                <div className="rounded-2xl border border-line bg-panel p-5 shadow-card">
                  <p className="text-2xl font-bold text-primary">4.8</p>
                  <p className="mt-1 text-xs font-medium text-ink-soft">
                    Avaliação média
                  </p>
                </div>
                <div className="rounded-2xl border border-line bg-panel p-5 shadow-card">
                  <p className="text-2xl font-bold text-primary">8.500+</p>
                  <p className="mt-1 text-xs font-medium text-ink-soft">
                    Sessões realizadas
                  </p>
                </div>
                <div className="rounded-2xl border border-line bg-panel p-5 shadow-card">
                  <p className="text-2xl font-bold text-primary">12</p>
                  <p className="mt-1 text-xs font-medium text-ink-soft">
                    Países atendidos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className="border-t border-line">
        <Gallery />
      </section>

      <Footer />
    </div>
  );
}