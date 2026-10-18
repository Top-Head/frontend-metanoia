"use client";

import { useEffect, useRef, type FormEvent, type KeyboardEvent } from "react";
import { Reply, SendHorizontal, X } from "lucide-react";
import type { ReplyReference } from "@/lib/chat-reply";

interface MessageComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  replyTo?: ReplyReference | null;
  onCancelReply?: () => void;
  disabled?: boolean;
  error?: string | null;
}

export function MessageComposer({
  value,
  onChange,
  onSend,
  replyTo = null,
  onCancelReply,
  disabled = false,
  error,
}: MessageComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const canSend = value.trim().length > 0 && !disabled;

  useEffect(() => {
    if (replyTo) textareaRef.current?.focus();
  }, [replyTo]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (canSend) onSend();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Escape" && replyTo) {
      event.preventDefault();
      onCancelReply?.();
      return;
    }
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (canSend) onSend();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="shrink-0 border-t border-line bg-panel px-4 py-4 sm:px-6"
    >
      {error && (
        <p className="mb-3 text-sm text-danger" role="alert">
          {error}
        </p>
      )}
      <div className="rounded-2xl border border-line bg-canvas transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
        {replyTo && (
          <div className="flex items-center gap-3 border-b border-line px-3 py-2">
            <Reply size={16} className="shrink-0 text-primary" aria-hidden="true" />
            <div className="min-w-0 flex-1 border-l-4 border-primary pl-3">
              <p className="truncate text-xs font-bold text-primary">
                A responder a {replyTo.authorName}
              </p>
              <p className="truncate text-xs text-ink-soft">{replyTo.excerpt}</p>
            </div>
            <button
              type="button"
              onClick={onCancelReply}
              aria-label="Cancelar resposta"
              className="flex size-8 shrink-0 items-center justify-center rounded-lg text-ink-soft hover:bg-slate-200/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        )}
        <div className="flex items-end gap-3 p-2 pl-4">
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder="Escreva uma mensagem…"
            aria-label="Mensagem"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className="max-h-32 min-h-10 flex-1 resize-y bg-transparent py-2 text-sm leading-6 text-ink outline-none placeholder:text-ink-faint disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!canSend}
            aria-label={disabled ? "A enviar mensagem" : "Enviar mensagem"}
            className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white transition-colors hover:bg-primary-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <SendHorizontal size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
      <p className="mt-2 text-right text-[11px] text-ink-faint">
        Enter para enviar · Shift + Enter para nova linha
        {replyTo && " · Esc para cancelar a resposta"}
      </p>
    </form>
  );
}
