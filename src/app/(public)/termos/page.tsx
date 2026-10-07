import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Termos de Serviço",
  description:
    "Termos de uso da plataforma Academia Metanoia para mentores e estudantes.",
};

export default function TermosPage() {
  return (
    <LegalPage
      title="Termos de Serviço"
      description="As regras de uso da plataforma para quem aprende e para quem ensina na Metanoia."
      sections={[
        {
          title: "1. Sobre a plataforma",
          body: "A Academia Metanoia conecta estudantes a mentores para sessões de orientação profissional. A plataforma não substitui aconselhamento jurídico, médico ou psicológico individual.",
        },
        {
          title: "2. Contas e responsabilidades",
          body: "Você é responsável por manter seus dados de acesso em segurança e por informações verdadeiras no cadastro. Contas criadas com dados falsos podem ser suspensas.",
        },
        {
          title: "3. Sessões e agendamentos",
          body: "As sessões são agendadas entre mentor e estudante. Cancelamentos com menos de 24 horas de antecedência podem ser cobrados, conforme informado antes da confirmação.",
        },
        {
          title: "4. Reembolsos",
          body: "Se a primeira sessão não atender ao que foi combinado, você pode solicitar o reembolso integral em até 7 dias após a sessão.",
        },
        {
          title: "5. Conduta",
          body: "Respeito dentro e fora das sessões é obrigatório. Assédio, discurso de ódio ou uso indevido da plataforma resultam em bloqueio imediato.",
        },
      ]}
    />
  );
}