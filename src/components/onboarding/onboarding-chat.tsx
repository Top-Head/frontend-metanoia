"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { ArrowRight, CheckCircle2, MessageCircleHeart, RotateCcw, SendHorizontal, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/states";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/lib/api/client";
import type { AIConversation } from "@/lib/api/types";
import { initials } from "@/lib/format";
import { displayName } from "@/services/auth.service";
import {
  listConversations,
  sendOnboardingMessage,
  skipConversation,
  startConversation,
} from "@/services/onboarding.service";

const errorText = (reason: unknown, fallback: string) =>
  reason instanceof ApiError ? reason.message : fallback;

function Bubble({ role, content, userInitials }: { role: "USER" | "ASSISTANT"; content: string; userInitials: string }) {
  const mine = role === "USER";
  return (
    <div className={clsx("flex items-end gap-2.5", mine && "flex-row-reverse")}>
      <span
        className={clsx(
          "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
          mine ? "bg-primary text-white" : "bg-primary/10 text-primary"
        )}
      >
        {mine ? userInitials : <Sparkles size={14} />}
      </span>
      <p
        className={clsx(
          "max-w-[80%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-relaxed",
          mine ? "rounded-br-md bg-primary text-white" : "rounded-bl-md bg-panel text-ink shadow-card"
        )}
      >
        {content}
      </p>
    </div>
  );
}

function Typing() {
  return (
    <div className="flex items-end gap-2.5" aria-label="O assistente está a escrever">
      <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Sparkles size={14} />
      </span>
      <span className="flex gap-1 rounded-2xl rounded-bl-md bg-panel px-4 py-4 shadow-card">
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="size-1.5 animate-bounce rounded-full bg-ink-faint"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </span>
    </div>
  );
}

function Intro({ hasCompleted, onStart, isStarting }: { hasCompleted: boolean; onStart: () => void; isStarting: boolean }) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-line bg-panel px-6 py-14 text-center shadow-card">
      <span className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <MessageCircleHeart size={26} />
      </span>
      <h1 className="text-2xl font-bold text-ink md:text-3xl">
        {hasCompleted ? "Quer atualizar os seus objetivos?" : "Vamos conhecer os seus objetivos"}
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
        Numa conversa rápida com o nosso assistente, conte o que quer aprender, o seu nível e como prefere estudar.
        Usamos isso para recomendar as aulas certas para si.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <Button size="lg" onClick={onStart} isLoading={isStarting}>
          {!isStarting && (hasCompleted ? <RotateCcw size={16} /> : <Sparkles size={16} />)}
          {hasCompleted ? "Refazer a conversa" : "Começar conversa"}
        </Button>
        <Link href="/aluno/para-voce" className="px-4 py-2 text-sm font-bold text-ink-soft hover:text-primary">
          {hasCompleted ? "Ver recomendações" : "Agora não"}
        </Link>
      </div>
    </div>
  );
}

export function OnboardingChat() {
  const router = useRouter();
  const { user } = useAuth();
  const userInitials = initials(displayName(user) || "?");
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

  if (history.error) return <ErrorState message={history.error.message} onRetry={history.reload} />;
  if (history.isLoading) return <span className="block h-96 animate-pulse rounded-3xl bg-line" aria-busy="true" />;
  if (!active) return <Intro hasCompleted={hasCompleted} onStart={start} isStarting={busy === "start"} />;

  const completed = active.status === "COMPLETED";

  return (
    <div className="flex h-[calc(100dvh-12rem)] min-h-[480px] flex-col overflow-hidden rounded-3xl border border-line bg-canvas shadow-card">
      <div className="flex items-center justify-between gap-3 border-b border-line bg-panel px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sparkles size={18} />
          </span>
          <div>
            <p className="font-bold text-ink">Assistente Metanoia</p>
            <p className="text-xs text-ink-soft">Ajuda-o a encontrar as aulas certas</p>
          </div>
        </div>
        {!completed && (
          <button
            type="button"
            onClick={skip}
            disabled={busy !== null}
            className="text-sm font-bold text-ink-soft transition-colors hover:text-primary disabled:opacity-50"
          >
            {busy === "skip" ? "A sair…" : "Pular por agora"}
          </button>
        )}
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-6" aria-live="polite">
        {messages.map((message) => (
          <Bubble
            key={message.id}
            role={message.role === "USER" ? "USER" : "ASSISTANT"}
            content={message.content}
            userInitials={userInitials}
          />
        ))}
        {pendingText && <Bubble role="USER" content={pendingText} userInitials={userInitials} />}
        {busy === "send" && <Typing />}
        {completed && (
          <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl bg-success-soft p-6 text-center">
            <CheckCircle2 size={28} className="text-success" />
            <p className="mt-2 font-bold text-ink">Perfil de aprendizagem criado!</p>
            <p className="mt-1 text-sm text-ink-soft">Já temos o suficiente para lhe recomendar aulas.</p>
            <Link
              href="/aluno/para-voce"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-strong"
            >
              Ver recomendações
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {!completed && (
        <form onSubmit={send} className="flex items-end gap-2 border-t border-line bg-panel p-3">
          <textarea
            rows={1}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escreva a sua resposta…"
            aria-label="Mensagem para o assistente"
            className="max-h-32 min-h-11 flex-1 resize-none rounded-xl border border-line-strong bg-canvas px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-primary focus:ring-1 focus:ring-primary"
          />
          <Button type="submit" size="lg" disabled={!draft.trim() || busy !== null} aria-label="Enviar mensagem">
            <SendHorizontal size={18} />
          </Button>
        </form>
      )}
    </div>
  );
}
