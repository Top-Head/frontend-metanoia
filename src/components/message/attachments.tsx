"use client";

import { useState } from "react";
import clsx from "clsx";
import { Eye, FileText } from "lucide-react";
import type { ChatAttachment } from "@/lib/api/types";
import { formatBytes, isImageType } from "@/lib/chat-attachments";
import { getAttachmentUrl } from "@/services/message.service";
import { openAttachmentViewer } from "./attachment-viewer";

export function openAttachment(attachment: ChatAttachment) {
  openAttachmentViewer(attachment);
}

function ImageAttachment({ attachment, own }: { attachment: ChatAttachment; own: boolean }) {
  const [src, setSrc] = useState(attachment.file);
  const [retried, setRetried] = useState(false);

  async function handleError() {
    if (retried) return;
    setRetried(true);
    try {
      setSrc((await getAttachmentUrl(attachment.id)).url);
    } catch {
      // Mantém o fallback do navegador; o clique continua a abrir o anexo.
    }
  }

  return (
    <button
      type="button"
      onClick={() => void openAttachment(attachment)}
      aria-label={`Ver imagem ${attachment.filename}`}
      className={clsx(
        "block overflow-hidden rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2",
        own ? "bg-white/10 focus-visible:outline-white" : "bg-canvas focus-visible:outline-primary"
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- URL presignada de domínio variável */}
      <img
        src={src}
        alt={attachment.filename}
        onError={() => void handleError()}
        className="max-h-64 w-full object-cover"
      />
    </button>
  );
}

function FileAttachment({ attachment, own }: { attachment: ChatAttachment; own: boolean }) {
  return (
    <button
      type="button"
      onClick={() => void openAttachment(attachment)}
      className={clsx(
        "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
        own
          ? "bg-white/15 hover:bg-white/25 focus-visible:outline-white"
          : "bg-canvas hover:bg-tone focus-visible:outline-primary"
      )}
    >
      <span
        className={clsx(
          "flex size-9 shrink-0 items-center justify-center rounded-lg",
          own ? "bg-white/20 text-white" : "bg-primary-soft text-primary"
        )}
      >
        <FileText size={18} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold">{attachment.filename}</span>
        <span className={clsx("block text-xs", own ? "text-white/75" : "text-ink-soft")}>
          {formatBytes(attachment.size)}
        </span>
      </span>
      <Eye
        size={16}
        aria-hidden="true"
        className={clsx("shrink-0", own ? "text-white/80" : "text-ink-soft")}
      />
    </button>
  );
}

export function MessageAttachments({
  attachments,
  own,
}: {
  attachments: ChatAttachment[];
  own: boolean;
}) {
  if (attachments.length === 0) return null;
  const images = attachments.filter((item) => isImageType(item.content_type));
  const files = attachments.filter((item) => !isImageType(item.content_type));

  return (
    <div className="mb-2 space-y-2">
      {images.length > 0 && (
        <div className={clsx("grid gap-1.5", images.length > 1 && "grid-cols-2")}>
          {images.map((attachment) => (
            <ImageAttachment key={attachment.id} attachment={attachment} own={own} />
          ))}
        </div>
      )}
      {files.map((attachment) => (
        <FileAttachment key={attachment.id} attachment={attachment} own={own} />
      ))}
    </div>
  );
}
