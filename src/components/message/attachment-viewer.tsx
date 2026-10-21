"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Download, FileText, X } from "lucide-react";
import { Spinner, buttonClass } from "@/components/app/ui";
import type { ChatAttachment } from "@/lib/api/types";
import { formatBytes, isImageType } from "@/lib/chat-attachments";
import { getAttachmentUrl } from "@/services/message.service";

const OPEN_EVENT = "metanoia:open-attachment";

interface OpenDetail {
  attachment: ChatAttachment;
  siblings?: ChatAttachment[];
}

export function openAttachmentViewer(attachment: ChatAttachment, siblings?: ChatAttachment[]) {
  window.dispatchEvent(new CustomEvent<OpenDetail>(OPEN_EVENT, { detail: { attachment, siblings } }));
}

type Kind = "image" | "pdf" | "text" | "csv" | "none";

function kindOf({ content_type, filename }: ChatAttachment): Kind {
  const name = filename.toLowerCase();
  if (isImageType(content_type)) return "image";
  if (content_type === "application/pdf" || name.endsWith(".pdf")) return "pdf";
  if (content_type === "text/csv" || name.endsWith(".csv")) return "csv";
  if (content_type === "text/plain" || content_type === "application/json" || /\.(txt|json)$/.test(name)) return "text";
  return "none";
}

function parseCsv(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quoted) {
      if (char === '"' && text[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') quoted = false;
      else cell += char;
    } else if (char === '"') quoted = true;
    else if (char === "," || char === ";") {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      cell = "";
    } else cell += char;
  }
  if (cell || row.length) rows.push([...row, cell]);
  return rows.slice(0, 500);
}

interface Loaded {
  url: string;
  text?: string;
}

export function AttachmentViewer({ roomAttachments = [] }: { roomAttachments?: ChatAttachment[] }) {
  const [current, setCurrent] = useState<OpenDetail | null>(null);
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [error, setError] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const attachment = current?.attachment ?? null;
  const siblings = current?.siblings ?? roomAttachments;
  const position = attachment ? siblings.findIndex((item) => item.id === attachment.id) : -1;

  const close = useCallback(() => setCurrent(null), []);
  const step = useCallback(
    (delta: number) => {
      if (position < 0) return;
      const next = siblings[position + delta];
      if (next) setCurrent({ attachment: next, siblings });
    },
    [position, siblings]
  );

  useEffect(() => {
    const onOpen = (event: Event) => setCurrent((event as CustomEvent<OpenDetail>).detail);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!attachment) return;
    let cancelled = false;
    let objectUrl: string | null = null;
    setLoaded(null);
    setError(null);

    (async () => {
      try {
        const { url } = await getAttachmentUrl(attachment.id);
        const response = await fetch(url);
        if (!response.ok) throw new Error();
        const blob = await response.blob();
        const kind = kindOf(attachment);
        const typed =
          kind === "pdf" ? new Blob([blob], { type: "application/pdf" }) : blob.type ? blob : new Blob([blob], { type: attachment.content_type });
        objectUrl = URL.createObjectURL(typed);
        const text = kind === "text" || kind === "csv" ? await blob.text() : undefined;
        if (!cancelled) setLoaded({ url: objectUrl, text });
      } catch {
        if (!cancelled) setError("Não foi possível carregar o ficheiro. Tente de novo.");
      }
    })();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [attachment]);

  useEffect(() => {
    if (!attachment) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [attachment, close, step]);

  if (!attachment) return null;
  const kind = kindOf(attachment);

  let body;
  if (error) {
    body = <p className="m-auto max-w-sm text-center text-sm text-rail-ink">{error}</p>;
  } else if (!loaded) {
    body = (
      <p className="m-auto flex items-center gap-2 text-sm text-rail-muted" role="status">
        <Spinner />A abrir {attachment.filename}…
      </p>
    );
  } else if (kind === "image") {
    // eslint-disable-next-line @next/next/no-img-element -- blob local do anexo
    body = <img src={loaded.url} alt={attachment.filename} className="m-auto max-h-full max-w-full object-contain" />;
  } else if (kind === "pdf") {
    body = <iframe src={loaded.url} title={attachment.filename} className="h-full w-full rounded-md bg-panel" />;
  } else if (kind === "csv") {
    const [head, ...rows] = parseCsv(loaded.text ?? "");
    body = (
      <div className="h-full w-full overflow-auto rounded-md bg-panel">
        <table className="min-w-full text-left text-sm text-ink">
          {head && (
            <thead className="sticky top-0 bg-tone">
              <tr>
                {head.map((cell, index) => (
                  <th key={index} className="whitespace-nowrap px-3 py-2 font-semibold">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className="divide-y divide-line">
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, index) => (
                  <td key={index} className="whitespace-nowrap px-3 py-1.5 tabular-nums">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  } else if (kind === "text") {
    let text = loaded.text ?? "";
    if (attachment.content_type === "application/json" || attachment.filename.toLowerCase().endsWith(".json")) {
      try {
        text = JSON.stringify(JSON.parse(text), null, 2);
      } catch {}
    }
    body = (
      <pre className="h-full w-full overflow-auto whitespace-pre-wrap break-words rounded-md bg-panel p-6 font-mono text-[13px] leading-6 text-ink">
        {text}
      </pre>
    );
  } else {
    body = (
      <div className="m-auto max-w-sm text-center">
        <FileText size={40} aria-hidden="true" className="mx-auto text-rail-muted" />
        <p className="mt-4 font-display text-lg font-semibold text-white">{attachment.filename}</p>
        <p className="mt-1 text-sm text-rail-muted">
          Este tipo de ficheiro não tem pré-visualização no navegador. Descarregue-o para o abrir.
        </p>
        <a href={loaded.url} download={attachment.filename} className={buttonClass("primary", "md", "mt-5")}>
          <Download size={16} aria-hidden="true" />
          Descarregar ({formatBytes(attachment.size)})
        </a>
      </div>
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Pré-visualização de ${attachment.filename}`}
      className="fixed inset-0 z-[60] flex flex-col bg-rail"
    >
      <header className="flex h-14 shrink-0 items-center gap-3 px-4 text-rail-ink sm:px-6">
        <FileText size={18} aria-hidden="true" className="shrink-0 text-rail-muted" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">{attachment.filename}</p>
          <p className="text-xs text-rail-muted">
            {formatBytes(attachment.size)}
            {siblings.length > 1 && position >= 0 && ` · ${position + 1} de ${siblings.length}`}
          </p>
        </div>
        {loaded && (
          <a
            href={loaded.url}
            download={attachment.filename}
            aria-label="Descarregar ficheiro"
            title="Descarregar"
            className="flex size-9 items-center justify-center rounded-md text-rail-muted hover:bg-rail-raised hover:text-white"
          >
            <Download size={18} />
          </a>
        )}
        <button
          ref={closeRef}
          type="button"
          onClick={close}
          aria-label="Fechar pré-visualização"
          className="flex size-9 items-center justify-center rounded-md text-rail-muted hover:bg-rail-raised hover:text-white focus-visible:outline-2 focus-visible:outline-primary"
        >
          <X size={20} />
        </button>
      </header>

      <div className="relative flex min-h-0 flex-1 px-4 pb-4 sm:px-16 sm:pb-6" onClick={(event) => event.target === event.currentTarget && close()}>
        {body}
        {siblings.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              disabled={position <= 0}
              aria-label="Ficheiro anterior"
              className="absolute left-2 top-1/2 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-rail-raised text-white hover:bg-primary disabled:opacity-30 sm:flex"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              disabled={position < 0 || position >= siblings.length - 1}
              aria-label="Ficheiro seguinte"
              className="absolute right-2 top-1/2 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-rail-raised text-white hover:bg-primary disabled:opacity-30 sm:flex"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
