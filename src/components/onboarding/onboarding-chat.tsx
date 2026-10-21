"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { SendHorizontal } from "lucide-react";
import toast from "react-hot-toast";
import { Avatar, ErrorNote, PageHeader, Skeleton, Spinner, buttonClass } from "@/components/app/ui";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/lib/api/client";
import type { AIConversation } from "@/lib/api/types";
import { displayName } from "@/services/auth.service";
import {
  listConversations,
  sendOnboardingMessage,
  skipConversation,
  startConversation,
} from "@/services/onboarding.service";

const errorText = (reason: unknown, fallback: string) =>
  reason instanceof ApiError ? reason.message : fallback;

function AssistantMark() {
  return (
    <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-full bg-rail font-display text-xs font-semibold text-white">
      M
    </span>
  );
}

function Bubble({ role, content, userName }: { role: "USER" | "ASSISTANT"; content: string; userName: string }) {
  const mine = role === "USER";
  return (
    <div className={clsx("flex items-end gap-2.5", mine && "flex-row-reverse")}>
      {mine ? <Avatar name={userName} size="sm" solid /> : <AssistantMark />}
      <p
        className={clsx(
          "max-w-[80%] whitespace-pre-line rounded-2xl px-4 py-3 text-[15px] leading-6",
          mine ? "rounded-br-md bg-primary text-white" : "rounded-bl-md bg-panel text-ink ring-1 ring-inset ring-line"
        )}
      >
        {content}
      </p>
    </div>
  );
}

function Typing() {
  return (
    <div className="flex items-end gap-2.5" role="status" aria-label="O assistente está a escrever">
      <AssistantMark />
      <span className="flex gap-1 rounded-2xl rounded-bl-md bg-panel px-4 py-4 ring-1 ring-inset ring-line">
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="size-1.5 animate-bounce rounded-full bg-ink-faint motion-reduce:animate-none"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </span>
    </div>
  );
}

const QUESTIONS = [
  "O que quer aprender e para quê",
  "Em que nível está hoje",
  "Se prefere aulas online ou presenciais",
  "Quando tem tempo para estudar",
];

function Intro({ hasCompleted, onStart, isStarting }: { hasCompleted: boolean; onStart: () => void; isStarting: boolean }) {
  return (
    <>
      <PageHeader
        title={hasCompleted ? "Atualizar objetivos" : "Os seus objetivos"}
        description="Uma conversa curta com o assistente da Metanoia. Com as suas respostas, recomendamos as aulas certas."
      />
      <div className="grid overflow-hidden rounded-lg bg-rail text-rail-ink lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="p-6 md:p-10">
          <p className="font-display text-[26px] font-semibold leading-tight tracking-[-0.02em] text-white">
            {hasCompleted ? "Mudou alguma coisa desde a última conversa?" : "Quatro perguntas, dois minutos."}
          </p>
          <p className="mt-3 max-w-md text-[15px] leading-6 text-rail-muted">
            Responda por palavras suas. Pode ajustar tudo depois, no seu perfil de aprendizagem.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button type="button" onClick={onStart} disabled={isStarting} className={buttonClass("primary")}>
              {isStarting && <Spinner />}
              {hasCompleted ? "Refazer a conversa" : "Começar a conversa"}
            </button>
            <Link href="/aluno/para-voce" className="px-3 py-2 text-sm font-semibold text-rail-muted hover:text-white">
              {hasCompleted ? "Ver recomendações" : "Agora não"}
            </Link>
          </div>
        </div>
        <ul className="space-y-3 bg-rail-raised p-6 md:p-10">
          {QUESTIONS.map((question) => (
            <li key={question} className="flex items-end gap-2.5">
              <AssistantMark />
              <span className="rounded-2xl rounded-bl-md bg-rail px-4 py-2.5 text-sm text-rail-ink">{question}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export function OnboardingChat() {
  const router = useRouter();
  const { user } = useAuth();
  const userName = displayName(user) || "?";
  const history = useApiQuery("onboarding-list", listConversations);

  const [conversation, setConversation] = useState<AIConversation | null>(null);
  const [draft, setDraft] = useState("");
  const [pendingText, setPendingText] = useState<string | null>(null);
  const [busy, setBusy] = useState<"start" | "send" | "skip" | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const active = conversation ?? history.data?.find((item) => item.status === "ACTIVE") ?? null;
  const hasCompleted = Boolean(history.data?.some((item) => item.status === "COMPLETED"));
  const messages = (active?.messages ?? []).filter((message) => message.role !== "SYSTEM");

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, pendingText]);

  async function start() {
    setBusy("start");
    try {
      setConversation(await startConversation());
    } catch (reason) {
      toast.error(errorText(reason, "Não foi possível iniciar a conversa."));
    } finally {
      setBusy(null);
    }
  }

  async function send(event?: FormEvent) {
    event?.preventDefault();
    const text = draft.trim();
    if (!text || !active || busy) return;
    setDraft("");
    setPendingText(text);
    setBusy("send");
    try {
      setConversation(await sendOnboardingMessage(active.id, text));
    } catch (reason) {
      setDraft(text);
      toast.error(errorText(reason, "A mensagem não foi enviada. Tente de novo."));
    } finally {
      setPendingText(null);
      setBusy(null);
    }
  }

  async function skip() {
    if (!active) return;
    setBusy("skip");
    try {
      await skipConversation(active.id);
      router.push("/aluno/para-voce");
    } catch (reason) {
      toast.error(errorText(reason, "Não foi possível pular a conversa."));
      setBusy(null);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void send();
    }
  }
  if (history.error) return <ErrorNote message={history.error.message} onRetry={history.reload} />;
  if (history.isLoading) return <Skeleton className="h-96" />;
  if (!active) return <Intro hasCompleted={hasCompleted} onStart={start} isStarting={busy === "start"} />;

  const completed = active.status === "COMPLETED";

  return (
    <>
      <PageHeader
        title="Os seus objetivos"
        description="Responda por palavras suas. No fim, o assistente monta o seu perfil de aprendizagem."
        actions={
          !completed && (
            <button type="button" onClick={skip} disabled={busy !== null} className={buttonClass("quiet")}>
              {busy === "skip" && <Spinner />}
              Saltar por agora
            </button>
          )
        }
      />
      <div className="flex h-[calc(100dvh-16rem)] min-h-[460px] flex-col overflow-hidden rounded-lg border border-line bg-canvas">
        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8" aria-live="polite">
          <div className="mx-auto max-w-2xl space-y-4">
            {messages.map((message) => (
              <Bubble
                key={message.id}
                role={message.role === "USER" ? "USER" : "ASSISTANT"}
                content={message.content}
                userName={userName}
              />
            ))}
            {pendingText && <Bubble role="USER" content={pendingText} userName={userName} />}
            {busy === "send" && <Typing />}
            {completed && (
              <div className="rounded-lg bg-rail p-6 text-rail-ink">
                <p className="font-display text-lg font-semibold text-white">Perfil de aprendizagem criado</p>
                <p className="mt-1 text-sm text-rail-muted">Já temos o suficiente para lhe recomendar aulas.</p>
                <Link href="/aluno/para-voce" className={buttonClass("primary", "md", "mt-4")}>
                  Ver recomendações
                </Link>
              </div>
            )}
            <div ref={endRef} />
          </div>
        </div>

        {!completed && (
          <form onSubmit={send} className="border-t border-line bg-panel p-3 sm:px-8">
            <div className="mx-auto flex max-w-2xl items-end gap-2">
              <textarea
                rows={1}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escreva a sua resposta…"
                aria-label="Mensagem para o assistente"
                className="max-h-32 min-h-11 flex-1 resize-none rounded-md border border-line-strong bg-canvas px-4 py-2.5 text-[15px] text-ink outline-none placeholder:text-ink-faint focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
              <button
                type="submit"
                disabled={!draft.trim() || busy !== null}
                aria-label="Enviar mensagem"
                className={buttonClass("primary", "md", "size-11 px-0")}
              >
                <SendHorizontal size={18} aria-hidden="true" />
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
