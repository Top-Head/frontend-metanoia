import { api } from "@/lib/api/client";
import type {
  ChatAttachmentUrl,
  ChatMessage,
  ChatRoom,
  Paginated,
} from "@/lib/api/types";

type ListResult<T> = Paginated<T> | T[];

function asPaginated<T>(result: ListResult<T>): Paginated<T> {
  if (Array.isArray(result)) {
    return {
      count: result.length,
      next: null,
      previous: null,
      results: result,
    };
  }

  return result;
}

export async function listChatRooms(
  page = 1,
  pageSize = 50,
  signal?: AbortSignal
) {
  const { data } = await api.get<ListResult<ChatRoom>>("/api/chat/rooms/", {
    params: { page, page_size: pageSize, ordering: "-created_at" },
    signal,
  });
  return asPaginated(data);
}

/** Páginas em ordem cronológica: a página 1 tem as mensagens mais antigas. */
export async function listRoomMessages(
  roomId: number,
  page = 1,
  pageSize = 50,
  signal?: AbortSignal
) {
  const { data } = await api.get<ListResult<ChatMessage>>(
    `/api/chat/rooms/${roomId}/messages/`,
    { params: { page, page_size: pageSize }, signal }
  );
  return asPaginated(data);
}

export async function sendRoomMessage(
  roomId: number,
  content: string,
  files: File[] = []
) {
  const url = `/api/chat/rooms/${roomId}/messages/`;
  if (files.length === 0) {
    const { data } = await api.post<ChatMessage>(url, { content });
    return data;
  }

  const form = new FormData();
  if (content) form.append("content", content);
  for (const file of files) form.append("files", file);
  const { data } = await api.post<ChatMessage>(url, form);
  return data;
}

export async function editRoomMessage(
  roomId: number,
  messageId: number,
  content: string
) {
  const { data } = await api.patch<ChatMessage>(
    `/api/chat/rooms/${roomId}/messages/${messageId}/`,
    { content }
  );
  return data;
}

export async function deleteRoomMessage(roomId: number, messageId: number) {
  await api.delete(`/api/chat/rooms/${roomId}/messages/${messageId}/`);
}

export async function getAttachmentUrl(attachmentId: number) {
  const { data } = await api.get<ChatAttachmentUrl>(
    `/api/chat/attachments/${attachmentId}/`
  );
  return data;
}
