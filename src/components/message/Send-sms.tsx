"use client";

import type { KeyboardEvent } from "react";
import { SendHorizontal } from "lucide-react";

interface MessageComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  recipientName: string;
}

export function MessageComposer({
  value,
  onChange,
  onSend,
  recipientName,
}: MessageComposerProps) {
  const canSend = value.trim().length > 0;

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && canSend) {
      onSend();
    }
  }

  return (
    <section className="shrink-0 border-t border-line bg-panel p-5 px-6">
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder={`Escreva uma mensagem para ${recipientName}...`}
          aria-label="Mensagem"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          className="h-11 flex-1 rounded-xl bg-slate-100 px-4 text-ink outline-none transition-shadow placeholder:text-ink-faint focus:ring-2 focus:ring-primary/20"
        />
        <button
          type="button"
          onClick={onSend}
          disabled={!canSend}
          aria-label="Enviar mensagem"
          className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-white transition-colors hover:bg-primary-strong disabled:cursor-not-allowed disabled:opacity-50"
        >
          <SendHorizontal size={18} />
        </button>
      </div>
    </section>
  );
}