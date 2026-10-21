"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import clsx from "clsx";
import { ArrowLeft, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import type { ChatMessage, ChatRoom } from "@/lib/api/types";
import {
  deleteRoomMessage,
  editRoomMessage,
  listChatRooms,
  listRoomMessages,
  sendRoomMessage,
} from "@/services/message.service";
import { subscribeToRoom, type RoomEvent } from "@/services/chat-socket.service";
import {
  parseMessageContent,
  replyReferenceFor,
  withReply,
  type ReplyReference,
} from "@/lib/chat-reply";
import { addFiles } from "@/lib/chat-attachments";
import Profile from "./Profile";
import Sidebar from "./Sidebar";
import { MessageComposer } from "./Send-sms";
import { ChatThread } from "./sms";
import { AttachmentViewer } from "./attachment-viewer";
import DeleteMessageDialog from "./delete-message-dialog";
import VideoCall from "./video-call";

const ROOM_PAGE_SIZE = 50;
const MESSAGE_PAGE_SIZE = 50;
// O WebSocket entrega as mensagens em tempo real; o polling só reconcilia.
const REFRESH_INTERVAL = 60_000;

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function byCreatedAt(first: ChatMessage, second: ChatMessage) {
  return new Date(first.created_at).getTime() - new Date(second.created_at).getTime();
}

function mergeMessages(current: ChatMessage[], incoming: ChatMessage[]) {
  const byId = new Map(current.map((message) => [message.id, message]));
  for (const message of incoming) byId.set(message.id, message);
  return [...byId.values()].sort(byCreatedAt);
}

// Substitui a janela mais recente pelo que veio da API (remove as apagadas).
function reconcileLatest(current: ChatMessage[], latest: ChatMessage[]) {
  if (latest.length === 0) return current.filter((message) => message.id < 0);
  const windowStart = new Date(latest[0].created_at).getTime();
  const maxId = Math.max(...latest.map((message) => message.id));
  const kept = current.filter(
    (message) => new Date(message.created_at).getTime() < windowStart || message.id > maxId
  );
  return mergeMessages(kept, latest);
}

function eventMessage(event: RoomEvent): ChatMessage | null {
  const data = event.data ?? event.message;
  if (data && typeof data === "object" && "id" in data && "content" in data) {
    return data as ChatMessage;
  }
  return null;
}

function eventMessageId(event: RoomEvent): number | null {
  const id = event.id ?? eventMessage(event)?.id ?? (event.data as { id?: unknown } | undefined)?.id;
  return typeof id === "number" ? id : typeof id === "string" ? Number(id) : null;
}

/**
 * A API pagina em ordem cronológica (página 1 = mais antigas) e ignora `ordering`.
 * Carrega as duas últimas páginas para mostrar sempre as mensagens recentes.
 */
async function fetchLatestMessages(roomId: number, signal?: AbortSignal) {
  const first = await listRoomMessages(roomId, 1, MESSAGE_PAGE_SIZE, signal);
  const lastPage = Math.max(1, Math.ceil(first.count / MESSAGE_PAGE_SIZE));
  if (lastPage === 1) return { messages: first.results, oldestPage: 1 };

  const [previous, last] = await Promise.all([
    lastPage - 1 === 1
      ? Promise.resolve(first)
      : listRoomMessages(roomId, lastPage - 1, MESSAGE_PAGE_SIZE, signal),
    listRoomMessages(roomId, lastPage, MESSAGE_PAGE_SIZE, signal),
  ]);
  return {
    messages: [...previous.results, ...last.results].sort(byCreatedAt),
    oldestPage: lastPage - 1,
  };
}

export default function Message() {
  const { user, isMentor } = useAuth();
  const currentUserId = user?.id ?? null;

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
  const [oldestPage, setOldestPage] = useState(1);
  const [messagesError, setMessagesError] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [replyTo, setReplyTo] = useState<ReplyReference | null>(null);
  const [editing, setEditing] = useState<ChatMessage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ChatMessage | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<{
    roomId: number;
    content: string;
    fileNames: string[];
  } | null>(null);
  const [sending, setSending] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const selectedRoomIdRef = useRef<number | null>(selectedRoomId);
  const scrollRef = useRef<HTMLDivElement>(null);
  const nearBottomRef = useRef(true);
  const lastMessageIdRef = useRef<number | null>(null);

  // Desce até a última mensagem ao abrir a sala, ao enviar, ou quando chega
  // uma nova e o utilizador já está perto do fim (não ao carregar antigas).
  useLayoutEffect(() => {
    const container = scrollRef.current;
    const last = messages.at(-1);
    const previousLastId = lastMessageIdRef.current;
    lastMessageIdRef.current = last?.id ?? null;
    if (!container) return;
    const appended = last !== undefined && last.id !== previousLastId;
    if (
      pendingMessage ||
      (appended && (previousLastId === null || nearBottomRef.current || last.author === currentUserId))
    ) {
      container.scrollTop = container.scrollHeight;
      nearBottomRef.current = true;
    }
  }, [messages, pendingMessage, currentUserId]);

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

  const loadLatest = useCallback(
    async (roomId: number, initial: boolean, signal?: AbortSignal) => {
      const latest = await fetchLatestMessages(roomId, signal);
      if (selectedRoomIdRef.current !== roomId) return;
      setMessages((current) => reconcileLatest(current, latest.messages));
      setOldestPage((current) => (initial ? latest.oldestPage : Math.min(current, latest.oldestPage)));
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
    let initialLoaded = false;

    setMessages([]);
    setOldestPage(1);
    setMessagesError(null);
    setSendError(null);
    setReplyTo(null);
    setEditing(null);
    setFiles([]);
    setMessagesLoading(true);

    const refreshLatest = async () => {
      if (
        disposed ||
        !initialLoaded ||
        refreshInFlight ||
        document.visibilityState !== "visible"
      ) {
        return;
      }
      refreshInFlight = true;
      setRefreshing(true);
      try {
        await loadLatest(roomId, false, controller.signal);
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

    void loadLatest(roomId, true, controller.signal)
      .catch((error: unknown) => {
        if (!controller.signal.aborted && selectedRoomIdRef.current === roomId) {
          setMessagesError(
            errorMessage(error, "Não foi possível carregar as mensagens.")
          );
        }
      })
      .finally(() => {
        initialLoaded = true;
        if (!disposed && selectedRoomIdRef.current === roomId) {
          setMessagesLoading(false);
        }
        scheduleRefresh();
      });

    const unsubscribe = subscribeToRoom(roomId, {
      // Ao (re)conectar, recupera o que possa ter chegado sem o socket.
      onOpen: () => void refreshLatest(),
      onEvent: (event) => {
        if (disposed) return;
        if (event.type === "message" || event.type === "message.updated") {
          const message = eventMessage(event);
          if (message) setMessages((current) => mergeMessages(current, [message]));
        } else if (event.type === "message.deleted") {
          const id = eventMessageId(event);
          if (id !== null) {
            setMessages((current) => current.filter((message) => message.id !== id));
          }
        }
      },
    });

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") void refreshLatest();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      disposed = true;
      controller.abort();
      unsubscribe();
      if (refreshTimer) clearTimeout(refreshTimer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [loadLatest, selectedRoomId]);

  // Se a mensagem em edição for apagada (por exemplo noutra aba), sai do modo de edição.
  useEffect(() => {
    if (editing && !messages.some((message) => message.id === editing.id)) {
      setEditing(null);
      setDraft("");
    }
  }, [editing, messages]);

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
    if (selectedRoomId === null || messagesLoadingOlder || oldestPage <= 1) {
      return;
    }
    const roomId = selectedRoomId;
    const page = oldestPage - 1;
    setMessagesLoadingOlder(true);
    try {
      const result = await listRoomMessages(roomId, page, MESSAGE_PAGE_SIZE);
      if (selectedRoomIdRef.current !== roomId) return;
      setMessages((current) => mergeMessages(current, result.results));
      setOldestPage(page);
    } catch (error) {
      setMessagesError(
        errorMessage(error, "Não foi possível carregar mensagens anteriores.")
      );
    } finally {
      setMessagesLoadingOlder(false);
    }
  }

  function handleAddFiles(incoming: File[]) {
    const result = addFiles(files, incoming);
    setFiles(result.files);
    if (result.error) toast.error(result.error);
  }

  async function saveEdit(target: ChatMessage, roomId: number) {
    const { reply } = parseMessageContent(target.content);
    const content = withReply(draft.trim(), reply);
    setSending(true);
    setSendError(null);
    try {
      const updated = await editRoomMessage(roomId, target.id, content);
      if (selectedRoomIdRef.current === roomId) {
        setMessages((current) => mergeMessages(current, [updated]));
        setEditing(null);
        setDraft("");
      }
    } catch (error) {
      const message = errorMessage(error, "Não foi possível editar a mensagem.");
      setSendError(message);
      toast.error(message);
    } finally {
      setSending(false);
    }
  }

  async function sendMessage() {
    if (selectedRoomId === null || sending) return;
    const roomId = selectedRoomId;
    if (editing) {
      await saveEdit(editing, roomId);
      return;
    }
    if (!draft.trim() && files.length === 0) return;

    const sentDraft = draft;
    const sentFiles = files;
    const content = draft.trim() ? withReply(draft.trim(), replyTo) : "";
    setSending(true);
    setSendError(null);
    setPendingMessage({ roomId, content, fileNames: sentFiles.map((file) => file.name) });
    try {
      const sent = await sendRoomMessage(roomId, content, sentFiles);
      if (selectedRoomIdRef.current === roomId) {
        setMessages((current) => mergeMessages(current, [sent]));
        setDraft((current) => (current === sentDraft ? "" : current));
        setFiles((current) => (current === sentFiles ? [] : current));
        setReplyTo(null);
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

  function startReply(message: ChatMessage) {
    if (editing) {
      setEditing(null);
      setDraft("");
    }
    setReplyTo(replyReferenceFor(message));
  }

  function startEdit(message: ChatMessage) {
    setReplyTo(null);
    setFiles([]);
    setSendError(null);
    setEditing(message);
    setDraft(parseMessageContent(message.content).body);
  }

  function cancelEdit() {
    setEditing(null);
    setDraft("");
  }

  async function confirmDelete() {
    if (!deleteTarget || selectedRoomId === null || deleting) return;
    const roomId = selectedRoomId;
    const target = deleteTarget;
    setDeleting(true);
    try {
      await deleteRoomMessage(roomId, target.id);
      if (selectedRoomIdRef.current === roomId) {
        setMessages((current) => current.filter((message) => message.id !== target.id));
      }
      if (replyTo?.id === target.id) setReplyTo(null);
      setDeleteTarget(null);
      toast.success("Mensagem apagada.");
    } catch (error) {
      toast.error(errorMessage(error, "Não foi possível apagar a mensagem."));
    } finally {
      setDeleting(false);
    }
  }

  const closeDeleteDialog = useCallback(() => setDeleteTarget(null), []);

  function selectRoom(roomId: number) {
    setSelectedRoomId(roomId);
    setDraft("");
    setMessagesError(null);
    setSendError(null);
  }

  function refreshMessages() {
    if (selectedRoomId === null || refreshing) return;
    setRefreshing(true);
    void loadLatest(selectedRoomId, false)
      .catch((error: unknown) =>
        setMessagesError(errorMessage(error, "Não foi possível atualizar."))
      )
      .finally(() => setRefreshing(false));
  }

  function retryMessages() {
    if (selectedRoomId === null) return;
    setMessagesLoading(true);
    void loadLatest(selectedRoomId, true)
      .catch((error: unknown) =>
        setMessagesError(
          errorMessage(error, "Não foi possível carregar as mensagens.")
        )
      )
      .finally(() => setMessagesLoading(false));
  }

  return (
    <div className="flex h-[calc(100dvh-6.25rem)] min-h-[30rem] flex-col overflow-hidden bg-canvas lg:h-dvh">
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
            <div className="flex h-16 shrink-0 items-center gap-3 border-b border-line bg-panel px-4 sm:px-6">
              <button
                type="button"
                onClick={() => setSelectedRoomId(null)}
                aria-label="Voltar às conversas"
                className="flex size-9 shrink-0 items-center justify-center rounded-md text-ink-soft hover:bg-tone md:hidden"
              >
                <ArrowLeft size={18} aria-hidden="true" />
              </button>
              <div className="min-w-0">
                <h2 className="truncate text-[15px] font-semibold text-ink">
                  {selectedRoom.course_title}
                  <span className="font-normal text-ink-soft"> · {selectedRoom.session_name}</span>
                </h2>
                <p className="flex items-center gap-2 truncate text-[13px] text-ink-soft">
                  <span
                    aria-hidden="true"
                    className={clsx("size-1.5 shrink-0 rounded-full", refreshing ? "animate-pulse bg-primary" : "bg-success")}
                  />
                  {isMentor
                    ? `${selectedRoom.member_count} participantes`
                    : `Mentor ${selectedRoom.mentor_name} · ${selectedRoom.member_count} participantes`}
                </p>
              </div>
              <div className="ml-auto flex items-center gap-1">
                <button
                  type="button"
                  onClick={refreshMessages}
                  aria-label="Atualizar mensagens"
                  title="Atualizar mensagens"
                  className="flex size-9 items-center justify-center rounded-md text-ink-soft hover:bg-tone hover:text-ink"
                >
                  <RefreshCw size={15} className={refreshing ? "animate-spin" : undefined} aria-hidden="true" />
                </button>
                <VideoCall room={selectedRoom} isMentor={isMentor} />
              </div>
            </div>


            <div
              ref={scrollRef}
              onScroll={(event) => {
                const target = event.currentTarget;
                nearBottomRef.current =
                  target.scrollHeight - target.scrollTop - target.clientHeight < 120;
              }}
              onLoadCapture={(event) => {
                // Imagens de anexos aumentam a altura depois de carregar.
                if (nearBottomRef.current) {
                  event.currentTarget.scrollTop = event.currentTarget.scrollHeight;
                }
              }}
              className="min-h-0 flex-1 overflow-y-auto bg-canvas bg-[url(/chat-pattern.svg)] bg-[length:320px_320px]"
            >
              <ChatThread
                messages={messages}
                currentUserId={currentUserId}
                loading={messagesLoading}
                error={messagesError}
                hasOlder={oldestPage > 1}
                loadingOlder={messagesLoadingOlder}
                onLoadOlder={() => void loadOlderMessages()}
                onRetry={retryMessages}
                onReply={startReply}
                onEdit={startEdit}
                onDelete={setDeleteTarget}
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
              replyTo={replyTo}
              onCancelReply={() => setReplyTo(null)}
              editing={editing ? replyReferenceFor(editing) : null}
              editingHasAttachments={(editing?.attachments.length ?? 0) > 0}
              onCancelEdit={cancelEdit}
              files={files}
              onAddFiles={handleAddFiles}
              onRemoveFile={(index) =>
                setFiles((current) => current.filter((_, position) => position !== index))
              }
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
          <Profile room={selectedRoom} isMentor={isMentor} messages={messages} />
        )}
      </div>

      <AttachmentViewer roomAttachments={messages.flatMap((message) => message.attachments ?? [])} />
      <DeleteMessageDialog
        message={deleteTarget}
        deleting={deleting}
        onCancel={closeDeleteDialog}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}
