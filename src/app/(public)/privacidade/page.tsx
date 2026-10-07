import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Como a Academia Metanoia coleta, usa e protege os seus dados.",
};

export default function PrivacidadePage() {
  return (
    <LegalPage
      title="Política de Privacidade"
      description="Transparência sobre como tratamos os seus dados pessoais."
      sections={[
        {
          title: "1. Dados que coletamos",
          body: "Coletamos o mínimo necessário para a operação: nome, e-mail, telefone, área de interesse e histórico de sessões dentro da plataforma.",
        },
        {
          title: "2. Uso dos dados",
          body: "Usamos seus dados para criar a conta, combinar você com mentores, processar pagamentos e melhorar a experiência de mentoria. Nunca vendemos informações pessoais.",
        },
        {
          title: "3. Compartilhamento",
          body: "Mentores veem apenas o essencial para conduzir a sessão: seu nome e as informações de aprendizado relevantes no momento da contratação.",
        },
        {
          title: "4. Armazenamento e segurança",
          body: "Os dados ficam armazenados em servidores seguros com criptografia em trânsito e em repouso. Acessos são registrados e monitorados.",
        },
        {
          title: "5. Seus direitos",
          body: "Você pode solicitar acesso, correção ou exclusão dos seus dados a qualquer momento pelo e-mail suporte@metanoia.com.",
        },
      ]}
    />
  );
}