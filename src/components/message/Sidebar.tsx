"use client";

import { Search } from "lucide-react";
import clsx from "clsx";
import { useMemo, useState } from "react";
import type { ChatRoom } from "@/lib/api/types";

interface SidebarProps {
  rooms: ChatRoom[];
  selectedRoomId: number | null;
  isMentor: boolean;
  loading: boolean;
  hasMore: boolean;
  loadingMore: boolean;
  error: string | null;
  onSelect: (roomId: number) => void;
  onLoadMore: () => void;
  onRetry: () => void;
}

function initials(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toLocaleUpperCase("pt-PT");
}

export default function Sidebar({
  rooms,
  selectedRoomId,
  isMentor,
  loading,
  hasMore,
  loadingMore,
  error,
  onSelect,
  onLoadMore,
  onRetry,
}: SidebarProps) {
  const [query, setQuery] = useState("");
  const conversations = useMemo(() => {
    const search = query.trim().toLocaleLowerCase("pt-PT");
    if (!search) return rooms;
    return rooms.filter((room) =>
      [room.course_title, room.session_name, room.mentor_name].join(" ").toLocaleLowerCase("pt-PT").includes(search)
    );
  }, [query, rooms]);

  return (
    <aside
      className={clsx(
        "w-full shrink-0 flex-col border-r border-line bg-panel md:flex md:w-80",
        selectedRoomId !== null ? "hidden" : "flex"
      )}
      aria-label="Conversas"
    >
      <div className="shrink-0 px-4 pb-4 pt-6">
        <h1 className="px-1 font-display text-[22px] font-semibold tracking-[-0.02em] text-ink">Mensagens</h1>
        <p className="mt-0.5 px-1 text-[13px] text-ink-soft">Uma conversa por turma.</p>
        <label className="relative mt-4 block">
          <Search size={16} aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            type="search"
            placeholder={isMentor ? "Buscar aula ou turma" : "Buscar aula ou mentor"}
            aria-label="Buscar conversas"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-10 w-full rounded-md bg-tone pl-9 pr-3 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:bg-panel focus:ring-2 focus:ring-primary/20"
          />
        </label>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
        {error && rooms.length > 0 && (
          <div className="mx-2 mb-3 rounded-md bg-danger-soft p-3" role="alert">
            <p className="text-[13px] text-ink">{error}</p>
            <button type="button" onClick={onRetry} className="mt-1 text-[13px] font-semibold text-danger hover:underline">
              Atualizar salas
            </button>
          </div>
        )}

        {loading && rooms.length === 0 && (
          <div className="space-y-1 px-2" role="status" aria-label="A carregar conversas">
            {Array.from({ length: 4 }, (_, index) => (
              <span key={index} className="block h-16 animate-pulse rounded-md bg-tone" />
            ))}
          </div>
        )}

        {error && rooms.length === 0 && (
          <div className="px-3 py-8 text-center">
            <p className="text-sm text-ink">{error}</p>
            <button type="button" onClick={onRetry} className="mt-3 text-sm font-semibold text-primary hover:underline">
              Tentar novamente
            </button>
          </div>
        )}

        {!loading && !error && rooms.length === 0 && (
          <div className="mx-2 rounded-md bg-tone px-4 py-8 text-center">
            <p className="font-semibold text-ink">Ainda não há conversas</p>
            <p className="mt-1 text-[13px] leading-5 text-ink-soft">
              {isMentor
                ? "Cada turma que abrir tem a sua conversa. Aparece aqui quando a turma for criada."
                : "Quando o mentor aprovar uma inscrição, a conversa da turma aparece aqui."}
            </p>
          </div>
        )}

        {rooms.length > 0 && conversations.length === 0 && (
          <p className="px-3 py-8 text-center text-sm text-ink-soft">Nenhuma conversa corresponde à busca.</p>
        )}

        <ul className="space-y-0.5">
          {conversations.map((room) => {
            const active = room.id === selectedRoomId;
            return (
              <li key={room.id}>
                <button
                  type="button"
                  aria-current={active ? "true" : undefined}
                  onClick={() => onSelect(room.id)}
                  className={clsx(
                    "flex w-full items-center gap-3 rounded-md px-2.5 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-primary",
                    active ? "bg-primary-soft" : "hover:bg-tone"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={clsx(
                      "flex size-10 shrink-0 items-center justify-center rounded-md font-display text-sm font-semibold",
                      active ? "bg-primary text-white" : "bg-rail text-white"
                    )}
                  >
                    {initials(room.course_title || room.session_name)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={clsx("block truncate text-sm font-semibold", active ? "text-primary" : "text-ink")}>
                      {room.course_title}
                    </span>
                    <span className="block truncate text-[13px] text-ink-soft">
                      {isMentor ? room.session_name : `${room.session_name} · ${room.mentor_name}`}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs tabular-nums text-ink-faint" title="Participantes">
                    {room.member_count}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {hasMore && (
          <button
            type="button"
            onClick={onLoadMore}
            disabled={loadingMore}
            className="mt-2 w-full rounded-md px-3 py-2 text-sm font-semibold text-primary hover:bg-primary-soft disabled:opacity-60"
          >
            {loadingMore ? "A carregar…" : "Carregar mais conversas"}
          </button>
        )}
      </div>
    </aside>
  );
}
