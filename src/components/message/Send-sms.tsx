"use client";

import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type DragEvent,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import clsx from "clsx";
import { FileText, Paperclip, Pencil, Reply, SendHorizontal, X } from "lucide-react";
import type { ReplyReference } from "@/lib/chat-reply";
import { ACCEPT_ATTRIBUTE, formatBytes } from "@/lib/chat-attachments";

interface MessageComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  replyTo?: ReplyReference | null;
  onCancelReply?: () => void;
  editing?: ReplyReference | null;
  editingHasAttachments?: boolean;
  onCancelEdit?: () => void;
  files: File[];
  onAddFiles: (files: File[]) => void;
  onRemoveFile: (index: number) => void;
  disabled?: boolean;
  error?: string | null;
}

function ContextBar({
  icon,
  title,
  excerpt,
  cancelLabel,
  onCancel,
}: {
  icon: ReactNode;
  title: string;
  excerpt: string;
  cancelLabel: string;
  onCancel?: () => void;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-line px-3 py-2">
      {icon}
      <div className="min-w-0 flex-1 border-l-4 border-primary pl-3">
        <p className="truncate text-xs font-bold text-primary">{title}</p>
        <p className="truncate text-xs text-ink-soft">{excerpt}</p>
      </div>
      <button
        type="button"
        onClick={onCancel}
        aria-label={cancelLabel}
        className="flex size-8 shrink-0 items-center justify-center rounded-lg text-ink-soft hover:bg-slate-200/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  );
}

export function MessageComposer({
  value,
  onChange,
  onSend,
  replyTo = null,
  onCancelReply,
  editing = null,
  editingHasAttachments = false,
  onCancelEdit,
  files,
  onAddFiles,
  onRemoveFile,
  disabled = false,
  error,
}: MessageComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const hasText = value.trim().length > 0;
  const canSend =
    !disabled && (editing ? hasText || editingHasAttachments : hasText || files.length > 0);

  useEffect(() => {
    if (replyTo || editing) textareaRef.current?.focus();
  }, [replyTo, editing]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (canSend) onSend();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Escape" && (editing || replyTo)) {
      event.preventDefault();
      if (editing) onCancelEdit?.();
      else onCancelReply?.();
      return;
    }
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (canSend) onSend();
    }
  }

  function handlePaste(event: ClipboardEvent<HTMLTextAreaElement>) {
    if (editing || event.clipboardData.files.length === 0) return;
    event.preventDefault();
    onAddFiles([...event.clipboardData.files]);
  }

  function handleDrop(event: DragEvent<HTMLFormElement>) {
    event.preventDefault();
    setDragging(false);
    if (!editing && event.dataTransfer.files.length > 0) {
      onAddFiles([...event.dataTransfer.files]);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      onDragOver={(event) => {
        if (editing) return;
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className="shrink-0 border-t border-line bg-panel px-4 py-4 sm:px-6"
    >
      {error && (
        <p className="mb-3 text-sm text-danger" role="alert">
          {error}
        </p>
      )}
      <div
        className={clsx(
          "rounded-2xl border bg-canvas transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10",
          dragging ? "border-dashed border-primary ring-2 ring-primary/20" : "border-line"
        )}
      >
        {editing ? (
          <ContextBar
            icon={<Pencil size={16} className="shrink-0 text-primary" aria-hidden="true" />}
            title="A editar mensagem"
            excerpt={editing.excerpt || "Mensagem com anexos"}
            cancelLabel="Cancelar edição"
            onCancel={onCancelEdit}
          />
        ) : (
          replyTo && (
            <ContextBar
              icon={<Reply size={16} className="shrink-0 text-primary" aria-hidden="true" />}
              title={`A responder a ${replyTo.authorName}`}
              excerpt={replyTo.excerpt}
              cancelLabel="Cancelar resposta"
              onCancel={onCancelReply}
            />
          )
        )}

        {files.length > 0 && (
          <ul className="flex flex-wrap gap-2 border-b border-line px-3 py-2" aria-label="Anexos">
            {files.map((file, index) => (
              <li
                key={`${file.name}-${file.size}-${index}`}
                className="flex max-w-full items-center gap-2 rounded-lg border border-line bg-panel py-1 pl-2 pr-1 text-xs"
              >
                <FileText size={14} className="shrink-0 text-primary" aria-hidden="true" />
                <span className="max-w-[12rem] truncate font-medium text-ink">{file.name}</span>
                <span className="shrink-0 text-ink-faint">{formatBytes(file.size)}</span>
                <button
                  type="button"
                  onClick={() => onRemoveFile(index)}
                  aria-label={`Remover ${file.name}`}
                  className="flex size-6 shrink-0 items-center justify-center rounded-md text-ink-soft hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-primary"
                >
                  <X size={13} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-end gap-2 p-2">
          {!editing && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={ACCEPT_ATTRIBUTE}
                className="hidden"
                onChange={(event) => {
                  if (event.target.files) onAddFiles([...event.target.files]);
                  event.target.value = "";
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                aria-label="Anexar ficheiros"
                title="Anexar ficheiros"
                className="flex size-10 shrink-0 items-center justify-center rounded-xl text-ink-soft transition-colors hover:bg-slate-200/70 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
              >
                <Paperclip size={18} aria-hidden="true" />
              </button>
            </>
          )}
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder={files.length > 0 ? "Adicione uma legenda (opcional)…" : "Escreva uma mensagem…"}
            aria-label="Mensagem"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            disabled={disabled}
            className={clsx(
              "max-h-32 min-h-10 flex-1 resize-y bg-transparent py-2 text-sm leading-6 text-ink outline-none placeholder:text-ink-faint disabled:opacity-60",
              editing && "pl-2"
            )}
          />
          <button
            type="submit"
            disabled={!canSend}
            aria-label={editing ? "Guardar edição" : disabled ? "A enviar mensagem" : "Enviar mensagem"}
            className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white transition-colors hover:bg-primary-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <SendHorizontal size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
      <p className="mt-2 text-right text-[11px] text-ink-faint">
        Enter para enviar · Shift + Enter para nova linha
        {editing && " · Esc para cancelar a edição"}
        {!editing && replyTo && " · Esc para cancelar a resposta"}
      </p>
    </form>
  );
}
