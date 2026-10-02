export interface Message {
  id: string;
  conversationId: string;
  sender: "student" | "mentor";
  text: string;
  sentAt: string;
}

export interface Conversation {
  id: string;
  studentName: string;
  course: string;
  lastMessage: string;
  unreadCount: number;
}

/**
 * Camada de acesso à API de mensagens.
 *
 * TODO: integrar com o backend real (websocket/REST) quando a
 * autenticação e o backend estiverem disponíveis.
 */
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  if (!response.ok) {
    throw new Error(`Requisição falhou (${response.status}).`);
  }

  return response.json() as Promise<T>;
}

export async function listConversations(): Promise<Conversation[]> {
  return request<Conversation[]>("/api/messages");
}

export async function sendMessage(
  conversationId: string,
  text: string
): Promise<Message> {
  return request<Message>(`/api/messages/${conversationId}`, {
    method: "POST",
    body: JSON.stringify({ text }),
  });
}