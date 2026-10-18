"use client";

import { useEffect, useRef } from "react";
import { Trash2 } from "lucide-react";
import type { ChatMessage } from "@/lib/api/types";
import { replyReferenceFor } from "@/lib/chat-reply";

interface DeleteMessageDialogProps {
  message: ChatMessage | null;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteMessageDialog({
  message,
  deleting,
  onCancel,
  onConfirm,
}: DeleteMessageDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!message) return;
    cancelRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !deleting) onCancel();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [message, deleting, onCancel]);

  if (!message) return null;
  const excerpt = replyReferenceFor(message).excerpt;
  const attachmentCount = message.attachments.length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4"
      onClick={() => !deleting && onCancel()}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-message-title"
        aria-describedby="delete-message-description"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-sm rounded-2xl bg-panel p-6 shadow-float"
      >
        <span className="mb-4 flex size-11 items-center justify-center rounded-xl bg-red-50 text-danger">
          <Trash2 size={20} aria-hidden="true" />
        </span>
        <h2 id="delete-message-title" className="text-lg font-bold text-ink">
          Apagar mensagem?
        </h2>
        <p id="delete-message-description" className="mt-2 text-sm leading-6 text-ink-soft">
          A mensagem será apagada para todos na turma
          {attachmentCount > 0 &&
            `, incluindo ${attachmentCount === 1 ? "o anexo" : `os ${attachmentCount} anexos`}`}
          . Esta ação não pode ser desfeita.
        </p>
        {excerpt && (
          <p className="mt-3 truncate rounded-lg bg-canvas px-3 py-2 text-sm text-ink">{excerpt}</p>
        )}
        <div className="mt-6 flex justify-end gap-2">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-ink-soft hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="rounded-xl bg-danger px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger disabled:opacity-60"
          >
            {deleting ? "A apagar…" : "Apagar"}
          </button>
        </div>
      </div>
    </div>
  );
}
