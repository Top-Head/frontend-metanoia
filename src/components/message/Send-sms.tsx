"use client";

import type { FormEvent, KeyboardEvent } from "react";
import { SendHorizontal } from "lucide-react";

interface MessageComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  error?: string | null;
}

export function MessageComposer({
  value,
  onChange,
  onSend,
  disabled = false,
  error,
}: MessageComposerProps) {
  const canSend = value.trim().length > 0 && !disabled;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (canSend) onSend();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
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
      <div className="flex items-end gap-3 rounded-2xl border border-line bg-canvas p-2 pl-4 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
        <textarea
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
      <p className="mt-2 text-right text-[11px] text-ink-faint">
        Enter para enviar · Shift + Enter para nova linha
      </p>
    </form>
  );
}
