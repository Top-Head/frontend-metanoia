export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqCategory {
  id: string;
  title: string;
  items: FaqItem[];
}

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: "primeiros-passos",
    title: "Primeiros passos",
    items: [
      {
        question: "O que é a Academia Metanoia?",
        answer:
          "Uma plataforma de mentoria que conecta estudantes e profissionais a mentores com experiência real em tecnologia, artes, psicologia, negócios e ciências.",
      },
      {
        question: "Como encontro o mentor certo para mim?",
        answer:
          "Use os filtros de categoria, avaliação e preço na página inicial. Leia o perfil, veja as avaliações e converse antes de agendar.",
      },
      {
        question: "Preciso criar uma conta para ver os mentores?",
        answer:
          "Não. Você pode explorar os perfis livremente. A conta só é necessária para enviar mensagens e agendar sessões.",
      },
    ],
  },
  {
    id: "sessoes",
    title: "Sessões e agendamento",
    items: [
      {
        question: "Como funciona uma sessão de mentoria?",
        answer:
          "Você escolhe um horário disponível no perfil do mentor e, na data marcada, a sessão acontece online. Ao final, o ideal é sair com um plano de ação claro para os próximos passos.",
      },
      {
        question: "Posso cancelar uma sessão?",
        answer:
          "Sim, sem custo se o cancelamento for feito com mais de 24 horas de antecedência. O reembolso é processado em até 7 dias úteis.",
      },
      {
        question: "Posso falar com o mentor antes de agendar?",
        answer:
          "Sim. No perfil de cada mentor há o botão \"Enviar Mensagem\" para tirar dúvidas e alinhar expectativas antes da primeira sessão.",
      },
    ],
  },
  {
    id: "pagamentos",
    title: "Pagamentos",
    items: [
      {
        question: "Como funciona o pagamento?",
        answer:
          "Nenhum valor é cobrado antes da confirmação da sessão. Após a confirmação, o pagamento é processado e o mentor recebe após a sessão ser concluída.",
      },
      {
        question: "Quanto custa uma sessão?",
        answer:
          "Cada mentor define o próprio valor por hora, exibido no card e no perfil. Use o filtro de preço da página inicial para encontrar opções dentro do seu orçamento.",
      },
    ],
  },
  {
    id: "mentores",
    title: "Para mentores",
    items: [
      {
        question: "Quero ser mentora ou mentor. Como funciona?",
        answer:
          "Cadastre-se pela opção \"Tornar-se Mentor\", preencha suas especialidades e aguarde a revisão do time, que costuma responder em até 3 dias úteis.",
      },
      {
        question: "Posso definir meus próprios horários e preços?",
        answer:
          "Sim. Você controla a sua agenda e o valor das suas sessões diretamente pelo painel do mentor.",
      },
    ],
  },
];
