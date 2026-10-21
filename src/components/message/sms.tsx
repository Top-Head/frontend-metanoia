"use client";

import { useEffect, useState, type ReactNode } from "react";
import clsx from "clsx";
import { Paperclip, Pencil, Reply, Trash2 } from "lucide-react";
import type { ChatMessage } from "@/lib/api/types";
import { parseMessageContent, type ReplyReference } from "@/lib/chat-reply";
import { MessageAttachments } from "./attachments";

interface ChatThreadProps {
  messages: ChatMessage[];
  currentUserId: number | null;
  loading: boolean;
  error: string | null;
  hasOlder: boolean;
  loadingOlder: boolean;
  onLoadOlder: () => void;
  onRetry: () => void;
  onReply: (message: ChatMessage) => void;
  onEdit: (message: ChatMessage) => void;
  onDelete: (message: ChatMessage) => void;
  pendingMessage?: { content: string; fileNames: string[] } | null;
}

const EMOJI_ONLY = /^(?:\p{Extended_Pictographic}|\p{Regional_Indicator}|\p{Emoji_Modifier}|‍|️|\s)+$/u;
const graphemes = typeof Intl !== "undefined" && "Segmenter" in Intl ? new Intl.Segmenter("pt", { granularity: "grapheme" }) : null;

function isEmojiOnly(text: string) {
  const trimmed = text.trim();
  if (!trimmed || !EMOJI_ONLY.test(trimmed)) return false;
  const count = graphemes ? [...graphemes.segment(trimmed.replace(/\s/g, ""))].length : trimmed.length;
  return count <= 3;
}

function wasEdited(message: ChatMessage) {
  if (!message.updated_at) return false;
  return (
    new Date(message.updated_at).getTime() - new Date(message.created_at).getTime() > 1_000
  );
}

function ActionButton({
  label,
  danger = false,
  onClick,
  children,
}: {
  label: string;
  danger?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={clsx(
        "flex size-8 items-center justify-center rounded-full text-ink-faint transition hover:bg-tone focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        danger ? "hover:text-danger" : "hover:text-ink"
      )}
    >
      {children}
    </button>
  );
}

const HIGHLIGHT_DURATION = 1_600;

function messageTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function messageElementId(id: number) {
  return `chat-message-${id}`;
}

function QuotedReply({
  reply,
  own,
  onSelect,
}: {
  reply: ReplyReference;
  own: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={clsx(
        "mb-2 block w-full rounded-lg border-l-4 px-3 py-1.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2",
        own
          ? "border-white/70 bg-white/15 hover:bg-white/20 focus-visible:outline-white"
          : "border-primary bg-primary/5 hover:bg-primary-soft focus-visible:outline-primary"
      )}
    >
      <span
        className={clsx(
          "block truncate text-xs font-bold",
          own ? "text-white" : "text-primary"
        )}
      >
        {reply.authorName}
      </span>
      <span
        className={clsx(
          "block truncate text-xs",
          own ? "text-white/80" : "text-ink-soft"
        )}
      >
        {reply.excerpt}
      </span>
    </button>
  );
}

export function ChatThread({
  messages,
  currentUserId,
  loading,
  error,
  hasOlder,
  loadingOlder,
  onLoadOlder,
  onRetry,
  onReply,
  onEdit,
  onDelete,
  pendingMessage,
}: ChatThreadProps) {
  const [highlightedId, setHighlightedId] = useState<number | null>(null);

  useEffect(() => {
    if (highlightedId === null) return;
    const timer = setTimeout(() => setHighlightedId(null), HIGHLIGHT_DURATION);
    return () => clearTimeout(timer);
  }, [highlightedId]);

  function jumpTo(id: number) {
    const target = document.getElementById(messageElementId(id));
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    setHighlightedId(id);
  }

  const pending = pendingMessage ? parseMessageContent(pendingMessage.content) : null;

  return (
    <section
      className="flex min-h-full flex-col px-4 py-5 sm:px-6"
      aria-label="Histórico de mensagens"
    >
      {hasOlder && (
        <button
          type="button"
          onClick={onLoadOlder}
          disabled={loadingOlder}
          className="mx-auto mb-5 rounded-full border border-line bg-panel px-4 py-2 text-xs font-semibold text-primary hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60"
        >
          {loadingOlder ? "A carregar mensagens…" : "Ver mensagens anteriores"}
        </button>
      )}

      {loading && messages.length === 0 && (
        <p className="m-auto py-12 text-sm text-ink-soft" role="status">
          A carregar mensagens…
        </p>
      )}

      {error && messages.length === 0 && (
        <div className="m-auto max-w-sm py-12 text-center">
          <p className="text-sm text-ink">{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 text-sm font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {!loading && !error && messages.length === 0 && (
        <div className="m-auto max-w-sm py-12 text-center">
          <p className="font-display text-lg font-bold text-ink">
            Comece a conversa
          </p>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            Partilhe uma dúvida ou uma atualização com as pessoas desta turma.
          </p>
        </div>
      )}

      <div
        className="mt-auto space-y-3"
        role="log"
        aria-live="polite"
        aria-relevant="additions text"
      >
        {messages.map((message) => {
          const ownMessage = currentUserId !== null && message.author === currentUserId;
          const { reply, body } = parseMessageContent(message.content);
          return (
            <article
              key={message.id}
              id={messageElementId(message.id)}
              className={clsx(
                "group flex w-full items-center gap-1",
                ownMessage ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div
                className={clsx(
                  "max-w-[85%] rounded-2xl px-4 py-3 transition-shadow duration-300 sm:max-w-[72%] lg:max-w-[64%]",
                  ownMessage
                    ? "rounded-br-md bg-primary text-white"
                    : "rounded-bl-md border border-line bg-panel text-ink",
                  highlightedId === message.id && "ring-4 ring-primary/30"
                )}
              >
                {!ownMessage && (
                  <p className="mb-1 text-xs font-bold text-primary">
                    {message.author_name}
                  </p>
                )}
                {reply && (
                  <QuotedReply
                    reply={reply}
                    own={ownMessage}
                    onSelect={() => jumpTo(reply.id)}
                  />
                )}
                <MessageAttachments attachments={message.attachments ?? []} own={ownMessage} />
                {body && (
                  <p
                    className={clsx(
                      "whitespace-pre-wrap break-words",
                      isEmojiOnly(body) ? "text-[40px] leading-[1.15]" : "text-sm leading-6"
                    )}
                  >
                    {body}
                  </p>
                )}
                <p
                  className={clsx(
                    "mt-1 text-right text-[10px]",
                    ownMessage ? "text-white/70" : "text-ink-faint"
                  )}
                >
                  {wasEdited(message) && <span className="mr-1 italic">editada ·</span>}
                  <time dateTime={message.created_at}>{messageTime(message.created_at)}</time>
                </p>
              </div>
              <div
                className={clsx(
                  "flex shrink-0 gap-0.5 transition-opacity focus-within:opacity-100 md:opacity-0 md:group-hover:opacity-100",
                  ownMessage ? "flex-row-reverse" : "flex-row"
                )}
              >
                <ActionButton label={`Responder a ${message.author_name}`} onClick={() => onReply(message)}>
                  <Reply size={16} aria-hidden="true" />
                </ActionButton>
                {ownMessage && (
                  <>
                    <ActionButton label="Editar mensagem" onClick={() => onEdit(message)}>
                      <Pencil size={15} aria-hidden="true" />
                    </ActionButton>
                    <ActionButton label="Apagar mensagem" danger onClick={() => onDelete(message)}>
                      <Trash2 size={15} aria-hidden="true" />
                    </ActionButton>
                  </>
                )}
              </div>
            </article>
          );
        })}
        {pending && (
          <article className="flex justify-end">
            <div className="max-w-[85%] rounded-2xl rounded-br-md bg-primary/75 px-4 py-3 text-white sm:max-w-[72%]">
              {pending.reply && (
                <QuotedReply
                  reply={pending.reply}
                  own
                  onSelect={() => pending.reply && jumpTo(pending.reply.id)}
                />
              )}
              {pendingMessage?.fileNames.map((name) => (
                <p key={name} className="mb-1 flex items-center gap-2 truncate text-xs text-white/90">
                  <Paperclip size={13} aria-hidden="true" />
                  {name}
                </p>
              ))}
              {pending.body && (
                <p className="whitespace-pre-wrap break-words text-sm leading-6">
                  {pending.body}
                </p>
              )}
              <p className="mt-1 text-right text-[10px] text-white/75">
                A enviar…
              </p>
            </div>
          </article>
        )}
      </div>

      {error && messages.length > 0 && (
        <p className="mt-4 text-center text-xs text-danger" role="status">
          {error}{" "}
          <button
            type="button"
            onClick={onRetry}
            className="font-semibold underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Atualizar
          </button>
        </p>
      )}
    </section>
  );
}
