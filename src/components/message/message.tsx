"use client";

import { useState } from "react";
import { EllipsisVertical } from "lucide-react";
import Image from "next/image";
import { ChatThread, type ChatMessage } from "./sms";
import { MessageComposer } from "./Send-sms";

const STUDENT_NAME = "Alex Rivera";

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    sender: "student",
    text: "Oi, mentor! Trabalhei no módulo de acessibilidade que você sugeriu na semana passada. O contraste de cores ficou muito melhor agora.",
    time: "09:41",
  },
  {
    id: 2,
    sender: "mentor",
    text: "Excelente evolução, Alex! Fico feliz que os ajustes surtiram efeito. Vamos revisar o próximo passo na nossa sessão de quarta.",
    time: "09:47",
  },
  {
    id: 3,
    sender: "student",
    text: "Perfeito. Subi o protótipo atualizado e adicionei as anotações sobre os testes de foco no arquivo compartilhado.",
    time: "09:52",
    hasAttachment: true,
  },
];

export default function Message() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [draft, setDraft] = useState("");

  function sendMessage() {
    if (!draft.trim()) return;

    const nextMessage: ChatMessage = {
      id: Date.now(),
      sender: "mentor",
      text: draft.trim(),
      time: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((current) => [...current, nextMessage]);
    setDraft("");
  }

  return (
    <section className="flex min-w-0 flex-1 flex-col border-x border-line bg-panel">
      <div className="flex shrink-0 items-center border-b border-line bg-panel px-6 py-4">
        <div className="flex items-center gap-4">
          <Image
            src="/Container.png"
            alt={`Avatar de ${STUDENT_NAME}`}
            width={40}
            height={40}
            className="size-10 rounded-full"
          />
          <div>
            <h2 className="font-bold text-ink">{STUDENT_NAME}</h2>
            <span className="mt-0.5 inline-block rounded-lg bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
              aluno
            </span>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button
            type="button"
            className="rounded-xl bg-line px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-slate-200"
          >
            Detalhes do Serviço
          </button>
          <button
            type="button"
            aria-label="Mais opções"
            className="flex size-10 items-center justify-center rounded-xl bg-line text-ink transition-colors hover:bg-slate-200"
          >
            <EllipsisVertical size={16} />
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <ChatThread messages={messages} studentName={STUDENT_NAME} />
      </div>

      <MessageComposer
        value={draft}
        onChange={setDraft}
        onSend={sendMessage}
        recipientName={STUDENT_NAME}
      />
    </section>
  );
}