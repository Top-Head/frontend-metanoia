import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, HelpCircle, Mail, MessagesSquare } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Fale com a equipe da Academia Metanoia: suporte, pagamentos, parcerias ou dúvidas sobre mentoria.",
};

const CHANNELS = [
  {
    icon: Mail,
    title: "E-mail",
    text: "Para dúvidas, suporte ou parcerias.",
    action: { label: "suporte@metanoia.com", href: "mailto:suporte@metanoia.com" },
  },
  {
    icon: MessagesSquare,
    title: "Mensagens na plataforma",
    text: "Já tem conta? Fale com a equipe sem sair do painel.",
    action: { label: "Abrir mensagens", href: "/messages" },
  },
  {
    icon: HelpCircle,
    title: "Central de Ajuda",
    text: "Respostas rápidas para as dúvidas mais comuns.",
    action: { label: "Ver perguntas frequentes", href: "/ajuda" },
  },
];

export default function ContatoPage() {
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
            Fale com a gente
          </h1>
          <p className="mt-5 text-base leading-relaxed text-white/70 md:text-lg">
            Tem uma dúvida, sugestão ou proposta de parceria? Envie uma
            mensagem e a nossa equipe responde o quanto antes.
          </p>
        </div>
      </section>

      <main className="flex-1">
        <section className="mx-auto grid max-w-5xl gap-12 px-6 py-20 md:py-28 lg:grid-cols-[1fr_1.6fr] lg:gap-16 lg:px-10">
          <aside>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Canais de atendimento
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-ink">
              Escolha o caminho mais rápido
            </h2>

            <ul className="mt-8 space-y-4">
              {CHANNELS.map(({ icon: Icon, title, text, action }) => (
                <li key={title}>
                  <Link
                    href={action.href}
                    className="group flex gap-4 rounded-2xl border border-line bg-panel p-5 transition-colors hover:border-primary/40"
                  >
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon size={20} />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-bold text-ink">{title}</span>
                      <span className="mt-0.5 block text-sm text-ink-soft">{text}</span>
                      <span className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-primary">
                        {action.label}
                        <ArrowRight
                          size={14}
                          className="transition-transform group-hover:translate-x-0.5"
                        />
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-start gap-3 rounded-2xl bg-primary/5 p-5">
              <Clock size={18} className="mt-0.5 shrink-0 text-primary" />
              <p className="text-sm leading-relaxed text-ink-soft">
                <span className="font-bold text-ink">Tempo de resposta:</span>{" "}
                respondemos a maioria das mensagens em até 1 dia útil.
              </p>
            </div>
          </aside>

          <div className="rounded-3xl border border-line bg-panel p-6 shadow-card sm:p-10">
            <h2 className="text-2xl font-bold text-ink">Envie uma mensagem</h2>
            <p className="mb-8 mt-2 text-sm text-ink-soft">
              Todos os campos são obrigatórios.
            </p>
            <ContactForm />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
