"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, LayoutDashboard, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { UserMenu } from "@/components/user-menu";
import { useAuth } from "@/hooks/useAuth";
import type { ChatMessage, ChatRoom } from "@/lib/api/types";
import {
  listChatRooms,
  listRoomMessages,
  sendRoomMessage,
} from "@/services/message.service";
import Profile from "./Profile";
import Sidebar from "./Sidebar";
import { MessageComposer } from "./Send-sms";
import { ChatThread } from "./sms";
import VideoCall from "./video-call";

const ROOM_PAGE_SIZE = 50;
const MESSAGE_PAGE_SIZE = 50;
const REFRESH_INTERVAL = 20_000;

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function mergeMessages(current: ChatMessage[], incoming: ChatMessage[]) {
  const byId = new Map(current.map((message) => [message.id, message]));
  for (const message of incoming) byId.set(message.id, message);
  return [...byId.values()].sort(
    (first, second) =>
      new Date(first.created_at).getTime() -
      new Date(second.created_at).getTime()
  );
}

export default function Message() {
  const { user, isMentor } = useAuth();
  const currentUserIds = user?.id != null ? [Number(user.id)] : [];

  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [roomsLoadingMore, setRoomsLoadingMore] = useState(false);
  const [roomsHasMore, setRoomsHasMore] = useState(false);
  const [roomsPage, setRoomsPage] = useState(1);
  const [roomsError, setRoomsError] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesLoadingOlder, setMessagesLoadingOlder] = useState(false);
  const [messagesHasOlder, setMessagesHasOlder] = useState(false);
  const [messagesPage, setMessagesPage] = useState(1);
  const [messagesError, setMessagesError] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [pendingMessage, setPendingMessage] = useState<{
    roomId: number;
    content: string;
  } | null>(null);
  const [sending, setSending] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const selectedRoomIdRef = useRef<number | null>(selectedRoomId);

  useEffect(() => {
    selectedRoomIdRef.current = selectedRoomId;
  }, [selectedRoomId]);

  const loadRooms = useCallback(async () => {
    setRoomsLoading(true);
    setRoomsError(null);
    try {
      const page = await listChatRooms(1, ROOM_PAGE_SIZE);
      setRooms(page.results);
      setRoomsPage(1);
      setRoomsHasMore(Boolean(page.next));
      setSelectedRoomId((current) =>
        current !== null && page.results.some((room) => room.id === current)
          ? current
          : (page.results[0]?.id ?? null)
      );
    } catch (error) {
      setRoomsError(errorMessage(error, "Não foi possível carregar as salas."));
    } finally {
      setRoomsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRooms();
  }, [loadRooms]);

  const selectedRoom =
    rooms.find((room) => room.id === selectedRoomId) ?? null;

  const loadMessages = useCallback(
    async (roomId: number, pageNumber = 1, signal?: AbortSignal) => {
      const result = await listRoomMessages(
        roomId,
        pageNumber,
        MESSAGE_PAGE_SIZE,
        signal
      );
      const chronological = [...result.results].reverse();
      if (selectedRoomIdRef.current !== roomId) return;

      setMessages((current) =>
        pageNumber === 1
          ? mergeMessages(current, chronological)
          : mergeMessages(chronological, current)
      );
      setMessagesHasOlder(Boolean(result.next));
      setMessagesError(null);
    },
    []
  );

  useEffect(() => {
    if (selectedRoomId === null) {
      setMessages([]);
      return;
    }

    const roomId = selectedRoomId;
    const controller = new AbortController();
    let disposed = false;
    let refreshTimer: ReturnType<typeof setTimeout> | undefined;
    let refreshInFlight = false;

    setMessages([]);
    setMessagesHasOlder(false);
    setMessagesPage(1);
    setMessagesError(null);
    setSendError(null);
    setMessagesLoading(true);

    const refreshLatest = async () => {
      if (
        disposed ||
        refreshInFlight ||
        document.visibilityState !== "visible"
      ) {
        return;
      }
      refreshInFlight = true;
      setRefreshing(true);
      try {
        await loadMessages(roomId, 1, controller.signal);
      } catch (error) {
        if (!controller.signal.aborted && selectedRoomIdRef.current === roomId) {
          setMessagesError(errorMessage(error, "Não foi possível atualizar."));
        }
      } finally {
        refreshInFlight = false;
        if (!disposed) setRefreshing(false);
      }
    };

    const scheduleRefresh = () => {
      if (disposed) return;
      refreshTimer = setTimeout(async () => {
        await refreshLatest();
        scheduleRefresh();
      }, REFRESH_INTERVAL);
    };

    void loadMessages(roomId, 1, controller.signal)
      .catch((error: unknown) => {
        if (!controller.signal.aborted && selectedRoomIdRef.current === roomId) {
          setMessagesError(
            errorMessage(error, "Não foi possível carregar as mensagens.")
          );
        }
      })
      .finally(() => {
        if (!disposed && selectedRoomIdRef.current === roomId) {
          setMessagesLoading(false);
        }
        scheduleRefresh();
      });

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") void refreshLatest();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      disposed = true;
      controller.abort();
      if (refreshTimer) clearTimeout(refreshTimer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [loadMessages, selectedRoomId]);

  async function loadMoreRooms() {
    if (roomsLoadingMore || !roomsHasMore) return;
    const nextPage = roomsPage + 1;
    setRoomsLoadingMore(true);
    setRoomsError(null);
    try {
      const page = await listChatRooms(nextPage, ROOM_PAGE_SIZE);
      setRooms((current) => {
        const known = new Set(current.map((room) => room.id));
        return [...current, ...page.results.filter((room) => !known.has(room.id))];
      });
      setRoomsPage(nextPage);
      setRoomsHasMore(Boolean(page.next));
    } catch (error) {
      const message = errorMessage(error, "Não foi possível carregar mais salas.");
      setRoomsError(message);
      toast.error(message);
    } finally {
      setRoomsLoadingMore(false);
    }
  }

  async function loadOlderMessages() {
    if (selectedRoomId === null || messagesLoadingOlder || !messagesHasOlder) {
      return;
    }
    const nextPage = messagesPage + 1;
    setMessagesLoadingOlder(true);
    try {
      await loadMessages(selectedRoomId, nextPage);
      setMessagesPage(nextPage);
    } catch (error) {
      setMessagesError(
        errorMessage(error, "Não foi possível carregar mensagens anteriores.")
      );
    } finally {
      setMessagesLoadingOlder(false);
    }
  }

  async function sendMessage() {
    if (selectedRoomId === null || !draft.trim() || sending) return;
    const roomId = selectedRoomId;
    const content = draft.trim();
    setSending(true);
    setSendError(null);
    setPendingMessage({ roomId, content });
    try {
      const sent = await sendRoomMessage(roomId, content);
      if (selectedRoomIdRef.current === roomId) {
        setMessages((current) => mergeMessages(current, [sent]));
        setDraft((current) => (current === draft ? "" : current));
      }
    } catch (error) {
      const message = errorMessage(error, "Não foi possível enviar a mensagem.");
      setSendError(message);
      toast.error(message);
    } finally {
      setPendingMessage(null);
      setSending(false);
    }
  }

  function selectRoom(roomId: number) {
    setSelectedRoomId(roomId);
    setDraft("");
    setMessagesError(null);
    setSendError(null);
  }

  function refreshMessages() {
    if (selectedRoomId === null || refreshing) return;
    setRefreshing(true);
    void loadMessages(selectedRoomId)
      .catch((error: unknown) =>
        setMessagesError(errorMessage(error, "Não foi possível atualizar."))
      )
      .finally(() => setRefreshing(false));
  }

  function retryMessages() {
    if (selectedRoomId === null) return;
    setMessagesLoading(true);
    void loadMessages(selectedRoomId)
      .catch((error: unknown) =>
        setMessagesError(
          errorMessage(error, "Não foi possível carregar as mensagens.")
        )
      )
      .finally(() => setMessagesLoading(false));
  }

  return (
    <main className="flex h-dvh min-h-[32rem] flex-col overflow-hidden bg-canvas">
      <header className="flex h-[4.5rem] shrink-0 items-center justify-between border-b border-line bg-panel px-5 sm:px-7">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href={isMentor ? "/dashboard" : "/aluno"}
            aria-label="Voltar ao painel"
            className="hidden size-9 shrink-0 items-center justify-center rounded-lg text-ink-soft hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:flex"
          >
            <LayoutDashboard size={17} aria-hidden="true" />
          </Link>
          {selectedRoom && (
            <button
              type="button"
              onClick={() => setSelectedRoomId(null)}
              aria-label="Voltar às conversas"
              className="flex size-9 shrink-0 items-center justify-center rounded-lg text-ink-soft hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:hidden"
            >
              <ArrowLeft size={18} aria-hidden="true" />
            </button>
          )}
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              Espaço de aprendizagem
            </p>
            <h1 className="truncate text-sm font-bold text-ink sm:text-base">
              {selectedRoom?.course_title ?? "Conversas das suas mentorias"}
            </h1>
          </div>
        </div>
        <div className="ml-3 flex shrink-0 items-center gap-2">
          {selectedRoom && (
            <div className="flex items-center gap-2 text-xs text-ink-soft">
              <span
                className={
                  refreshing
                    ? "size-2 animate-pulse rounded-full bg-primary"
                    : "size-2 rounded-full bg-emerald-500"
                }
                aria-hidden="true"
              />
              <span className="hidden sm:inline">
                {refreshing ? "A atualizar" : "Atualização automática"}
              </span>
              <button
                type="button"
                onClick={refreshMessages}
                aria-label="Atualizar mensagens"
                className="ml-1 flex size-8 items-center justify-center rounded-lg hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <RefreshCw
                  size={15}
                  className={refreshing ? "animate-spin" : undefined}
                  aria-hidden="true"
                />
              </button>
            </div>
          )}
          <UserMenu />
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <Sidebar
          rooms={rooms}
          selectedRoomId={selectedRoomId}
          isMentor={isMentor}
          loading={roomsLoading}
          hasMore={roomsHasMore}
          loadingMore={roomsLoadingMore}
          error={roomsError}
          onSelect={selectRoom}
          onLoadMore={() => void loadMoreRooms()}
          onRetry={() => void loadRooms()}
        />

        {selectedRoom ? (
          <section
            className="flex min-w-0 flex-1 flex-col bg-canvas"
            aria-label={`Conversa: ${selectedRoom.course_title}`}
          >
            <div className="flex shrink-0 items-center gap-3 border-b border-line bg-panel px-5 py-3 sm:px-6">
              <span
                aria-hidden="true"
                className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary"
              >
                {selectedRoom.session_name
                  .slice(0, 2)
                  .toLocaleUpperCase("pt-BR")}
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-sm font-semibold text-ink">
                  {selectedRoom.session_name}
                </h2>
                <p className="truncate text-xs text-ink-soft">
                  {isMentor
                    ? `${selectedRoom.member_count} participantes`
                    : `Mentor ${selectedRoom.mentor_name} · ${selectedRoom.member_count} participantes`}
                </p>
              </div>
              <div className="ml-auto">
                <VideoCall room={selectedRoom} isMentor={isMentor} />
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              <ChatThread
                messages={messages}
                currentUserIds={currentUserIds}
                loading={messagesLoading}
                error={messagesError}
                hasOlder={messagesHasOlder}
                loadingOlder={messagesLoadingOlder}
                onLoadOlder={() => void loadOlderMessages()}
                onRetry={retryMessages}
                pendingMessage={
                  pendingMessage?.roomId === selectedRoom.id
                    ? pendingMessage
                    : null
                }
              />
            </div>

            <MessageComposer
              value={draft}
              onChange={setDraft}
              onSend={() => void sendMessage()}
              disabled={sending}
              error={sendError}
            />
          </section>
        ) : (
          <section className="hidden min-w-0 flex-1 items-center justify-center bg-canvas px-8 text-center md:flex">
            <div className="max-w-sm">
              <p className="font-display text-xl font-bold text-ink">
                Escolha uma conversa
              </p>
              <p className="mt-2 text-sm leading-6 text-ink-soft">
                Selecione uma sala à esquerda para acompanhar as mensagens da
                sua turma.
              </p>
            </div>
          </section>
        )}

        {selectedRoom && (
          <Profile room={selectedRoom} isMentor={isMentor} />
        )}
      </div>
    </main>
  );
}
