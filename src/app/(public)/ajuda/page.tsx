import type { Metadata } from "next";
import Link from "next/link";
import { HelpCircle } from "lucide-react";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Central de Ajuda",
  description:
    "Perguntas frequentes e formas de contato da Academia Metanoia.",
};

const FAQ = [
  {
    question: "Como encontro o mentor certo para mim?",
    answer:
      "Use os filtros de categoria, avaliação e preço na página inicial. Leia o perfil, veja as avaliações e converse antes de agendar.",
  },
  {
    question: "Como funciona o pagamento?",
    answer:
      "Nenhum valor é cobrado antes da confirmação da sessão. Após a confirmação, o pagamento é processado e o mentor recebe após a sessão ser concluída.",
  },
  {
    question: "Posso cancelar uma sessão?",
    answer:
      "Sim, sem custo se o cancelamento for feito com mais de 24 horas de antecedência. O reembolso é processado em até 7 dias úteis.",
  },
  {
    question: "Quero ser mentora ou mentor. Como funciona?",
    answer:
      "Cadastre-se pela opção 'Tornar-se Mentor', preencha suas especialidades e aguarde a revisão do time, que costuma responder em até 3 dias úteis.",
  },
];

export default function AjudaPage() {
  return (
    <LegalPage
      title="Central de Ajuda"
      description="Separamos as respostas para as dúvidas mais comuns. Se precisar de mais apoio, fale com a gente."
      sections={FAQ.map(({ question, answer }) => ({
        title: question,
        body: answer,
      }))}
      footer={
        <div className="mt-12 flex items-center gap-3 rounded-2xl border border-line bg-panel p-6">
          <HelpCircle size={24} className="shrink-0 text-primary" />
          <div>
            <p className="text-sm font-bold text-ink">Ainda tem dúvidas?</p>
            <p className="mt-1 text-sm text-ink-soft">
              Envie uma mensagem em nosso{" "}
              <Link
                href="/messages"
                className="font-bold text-primary hover:underline"
              >
                suporte direto
              </Link>{" "}
              ou escreva para suporte@metanoia.com.
            </p>
          </div>
        </div>
      }
    />
  );
}