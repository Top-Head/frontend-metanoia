"use client";

import { FileText } from "lucide-react";
import type { ChatMessage, ChatRoom } from "@/lib/api/types";
import { formatBytes } from "@/lib/chat-attachments";
import { openAttachment } from "./attachments";

const SHORT_DATE = new Intl.DateTimeFormat("pt-PT", { day: "numeric", month: "short" });

export default function Profile({
  room,
  isMentor,
  messages,
}: {
  room: ChatRoom;
  isMentor: boolean;
  messages: ChatMessage[];
}) {
  const files = messages
    .flatMap((message) =>
      (message.attachments ?? []).map((attachment) => ({ attachment, author: message.author_name, at: message.created_at }))
    )
    .reverse()
    .slice(0, 8);

  return (
    <aside aria-label="Sobre a turma" className="hidden w-72 shrink-0 overflow-y-auto border-l border-line bg-panel min-[1360px]:block">
      <div className="p-5">
        <h2 className="text-base font-semibold text-ink">Sobre a turma</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div>
            <dt className="text-[13px] text-ink-soft">Aula</dt>
            <dd className="font-semibold text-ink">{room.course_title}</dd>
          </div>
          <div>
            <dt className="text-[13px] text-ink-soft">Turma</dt>
            <dd className="font-semibold text-ink">{room.session_name}</dd>
          </div>
          <div className="flex gap-6">
            <div>
              <dt className="text-[13px] text-ink-soft">Mentor</dt>
              <dd className="font-semibold text-ink">{isMentor ? "Você" : room.mentor_name}</dd>
            </div>
            <div>
              <dt className="text-[13px] text-ink-soft">Participantes</dt>
              <dd className="font-semibold tabular-nums text-ink">{room.member_count}</dd>
            </div>
          </div>
        </dl>
      </div>

      <div className="border-t border-line p-5">
        <h2 className="text-base font-semibold text-ink">
          Ficheiros partilhados <span className="font-normal tabular-nums text-ink-soft">{files.length}</span>
        </h2>
        {files.length > 0 ? (
          <ul className="mt-3 space-y-1">
            {files.map(({ attachment, author, at }) => (
              <li key={attachment.id}>
                <button
                  type="button"
                  onClick={() => void openAttachment(attachment)}
                  className="-mx-2 flex w-[calc(100%+1rem)] items-center gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-tone focus-visible:outline-2 focus-visible:outline-primary"
                >
                  <FileText size={18} aria-hidden="true" className="shrink-0 text-ink-soft" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-ink">{attachment.filename}</span>
                    <span className="block truncate text-xs text-ink-soft">
                      {formatBytes(attachment.size)} · {author.split(" ")[0]} · {SHORT_DATE.format(new Date(at))}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-[13px] leading-5 text-ink-soft">
            Os materiais enviados na conversa (PDF, apresentações, imagens) ficam listados aqui.
          </p>
        )}
      </div>
    </aside>
  );
}
