import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MessageCircleQuestion } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FaqList from "@/components/faq/faq-list";

export const metadata: Metadata = {
  title: "Perguntas Frequentes",
  description:
    "Tire suas dúvidas sobre mentorias, agendamento, pagamentos e como se tornar mentor na Academia Metanoia.",
};

export default function FaqPage() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas font-sans text-ink">
      <Header forceSolid />

      <section className="relative overflow-hidden bg-ink pt-36 pb-20 text-white md:pt-40">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 top-0 size-105 rounded-full bg-primary/15 blur-[140px]" />
          <div className="absolute bottom-0 right-0 size-90 rounded-full bg-primary/10 blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-3xl px-6 text-center lg:px-10">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Perguntas frequentes
          </h1>
          <p className="mt-5 text-base leading-relaxed text-white/70 md:text-lg">
            Tudo o que você precisa saber sobre mentorias, agendamento,
            pagamentos e como fazer parte da comunidade.
          </p>
        </div>
      </section>

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-6 py-20 md:py-24 lg:px-10">
          <FaqList />

          <div className="mt-16 flex flex-col items-start gap-6 rounded-3xl bg-ink p-8 text-white sm:flex-row sm:items-center sm:justify-between md:p-10">
            <div className="flex items-start gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10">
                <MessageCircleQuestion size={22} />
              </span>
              <div>
                <h2 className="text-xl font-bold">Não encontrou o que procurava?</h2>
                <p className="mt-1 text-sm text-white/70">
                  A nossa equipe responde a maioria das mensagens em até 1 dia útil.
                </p>
              </div>
            </div>
            <Link
              href="/contact"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-strong"
            >
              Fale com a gente
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
