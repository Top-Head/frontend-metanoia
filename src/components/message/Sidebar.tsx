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
    .toLocaleUpperCase("pt-BR");
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
    const search = query.trim().toLocaleLowerCase("pt-BR");
    if (!search) return rooms;

    return rooms.filter((room) =>
      [room.course_title, room.session_name, room.mentor_name]
        .join(" ")
        .toLocaleLowerCase("pt-BR")
        .includes(search)
    );
  }, [query, rooms]);

  return (
    <aside
      className={clsx(
        "w-full shrink-0 flex-col border-r border-line bg-panel md:flex md:w-[22rem]",
        selectedRoomId !== null ? "hidden" : "flex"
      )}
      aria-label="Conversas"
    >
      <div className="shrink-0 border-b border-line px-5 pb-5 pt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          Mentorias
        </p>
        <h1 className="mt-1 font-display text-2xl font-bold text-ink">
          Mensagens
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          Salas das suas turmas, num só lugar.
        </p>

        <label className="relative mt-5 block">
          <Search
            size={17}
            aria-hidden="true"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft"
          />
          <input
            type="search"
            placeholder="Buscar curso ou mentor"
            aria-label="Buscar conversas"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-11 w-full rounded-xl border border-line bg-canvas pl-10 pr-3 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </label>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {error && rooms.length > 0 && (
          <div
            className="mb-3 rounded-xl border border-danger/20 bg-danger/5 p-3"
            role="alert"
          >
            <p className="text-xs text-danger">{error}</p>
            <button
              type="button"
              onClick={onRetry}
              className="mt-2 text-xs font-semibold text-danger underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
            >
              Atualizar salas
            </button>
          </div>
        )}

        {loading && rooms.length === 0 && (
          <p className="px-3 py-8 text-center text-sm text-ink-soft" role="status">
            A carregar as suas conversas…
          </p>
        )}

        {error && rooms.length === 0 && (
          <div className="px-3 py-8 text-center">
            <p className="text-sm text-ink">{error}</p>
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 text-sm font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!loading && !error && rooms.length === 0 && (
          <div className="px-5 py-12 text-center">
            <p className="font-semibold text-ink">Ainda não há salas</p>
            <p className="mt-2 text-sm leading-6 text-ink-soft">
              As conversas das suas mentorias vão aparecer aqui quando tiver
              acesso a uma turma.
            </p>
          </div>
        )}

        {rooms.length > 0 && conversations.length === 0 && (
          <p className="px-3 py-8 text-center text-sm text-ink-soft">
            Nenhuma conversa corresponde à busca.
          </p>
        )}

        <ul className="space-y-1">
          {conversations.map((room) => {
            const active = room.id === selectedRoomId;
            return (
              <li key={room.id}>
                <button
                  type="button"
                  aria-current={active ? "true" : undefined}
                  onClick={() => onSelect(room.id)}
                  className={clsx(
                    "flex w-full items-center gap-3 rounded-xl border-l-[3px] px-3 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                    active
                      ? "border-primary bg-primary/5"
                      : "border-transparent hover:bg-slate-50"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={clsx(
                      "flex size-11 shrink-0 items-center justify-center rounded-xl font-display text-sm font-bold",
                      active
                        ? "bg-primary text-white"
                        : "bg-primary/10 text-primary"
                    )}
                  >
                    {initials(room.course_title || room.session_name)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-ink">
                      {room.course_title}
                    </span>
                    <span className="mt-1 block truncate text-xs text-ink-soft">
                      {isMentor
                        ? room.session_name
                        : `${room.session_name} · ${room.mentor_name}`}
                    </span>
                    <span className="mt-1 block text-xs text-ink-faint">
                      Sala da turma · {room.member_count} participantes
                    </span>
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
            className="mt-3 w-full rounded-lg px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60"
          >
            {loadingMore ? "A carregar…" : "Carregar mais salas"}
          </button>
        )}
      </div>
    </aside>
  );
}
