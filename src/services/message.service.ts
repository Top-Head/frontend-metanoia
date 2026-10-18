import { api } from "@/lib/api/client";
import type { ChatMessage, ChatRoom, Paginated } from "@/lib/api/types";

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

export async function listRoomMessages(
  roomId: number,
  page = 1,
  pageSize = 50,
  signal?: AbortSignal
) {
  const { data } = await api.get<ListResult<ChatMessage>>(
    `/api/chat/rooms/${roomId}/messages/`,
    {
      params: { page, page_size: pageSize, ordering: "-created_at" },
      signal,
    }
  );
  return asPaginated(data);
}

export async function sendRoomMessage(roomId: number, content: string) {
  const { data } = await api.post<ChatMessage>(
    `/api/chat/rooms/${roomId}/messages/`,
    { content }
  );
  return data;
}
