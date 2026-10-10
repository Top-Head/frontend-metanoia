"use client";

import { useId, useRef, useState, type DragEvent } from "react";
import clsx from "clsx";
import { FileText, UploadCloud, X } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/client";
import type { Enrollment } from "@/lib/api/types";
import {
  MAX_PROOF_BYTES,
  PROOF_ACCEPT,
  submitPaymentProof,
} from "@/services/enrollment.service";

const ACCEPTED = PROOF_ACCEPT.split(",");

function formatSize(bytes: number) {
  return bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

interface ProofUploaderProps {
  enrollmentId: number;
  onUploaded: (enrollment: Enrollment) => void;
}

export function ProofUploader({ enrollmentId, onUploaded }: ProofUploaderProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSending, setIsSending] = useState(false);

  function pick(candidate: File | undefined) {
    if (!candidate) return;
    if (!ACCEPTED.includes(candidate.type)) {
      setError("Formato não suportado. Envie uma imagem (JPG, PNG, WEBP) ou um PDF.");
      return;
    }
    if (candidate.size > MAX_PROOF_BYTES) {
      setError(`O ficheiro tem ${formatSize(candidate.size)}. O limite é ${formatSize(MAX_PROOF_BYTES)}.`);
      return;
    }
    setError(null);
    setFile(candidate);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
    pick(event.dataTransfer.files[0]);
  }

  function clear() {
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function send() {
    if (!file) return;
    setIsSending(true);
    try {
      const updated = await submitPaymentProof(enrollmentId, file);
      toast.success("Comprovativo enviado! O mentor vai validá-lo.");
      clear();
      onUploaded(updated);
    } catch (reason) {
      toast.error(reason instanceof ApiError ? reason.message : "Não foi possível enviar o comprovativo.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="space-y-3">
      {file ? (
        <div className="flex items-center gap-3 rounded-xl border border-line bg-canvas p-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileText size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-ink">{file.name}</p>
            <p className="text-xs text-ink-soft">{formatSize(file.size)}</p>
          </div>
          <button
            type="button"
            onClick={clear}
            disabled={isSending}
            aria-label="Remover ficheiro"
            className="rounded-lg p-2 text-ink-faint transition-colors hover:bg-line hover:text-ink"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={clsx(
            "flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors",
            isDragging ? "border-primary bg-primary/5" : "border-line-strong hover:border-primary/50 hover:bg-canvas"
          )}
        >
          <UploadCloud size={28} className="mb-2 text-primary" />
          <span className="text-sm font-bold text-ink">Arraste o comprovativo ou clique para escolher</span>
          <span className="mt-1 text-xs text-ink-soft">JPG, PNG, WEBP ou PDF · até {formatSize(MAX_PROOF_BYTES)}</span>
        </label>
      )}

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={PROOF_ACCEPT}
        className="sr-only"
        onChange={(event) => pick(event.target.files?.[0])}
      />

      {error && <p className="text-xs font-medium text-danger">{error}</p>}

      <Button type="button" onClick={send} disabled={!file} isLoading={isSending} className="w-full">
        {!isSending && <UploadCloud size={16} />}
        Enviar comprovativo
      </Button>
    </div>
  );
}
