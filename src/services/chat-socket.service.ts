import { API_URL } from "@/lib/api/client";
import { getAccessToken } from "@/lib/api/tokens";

export interface RoomEvent {
  type: string;
  [key: string]: unknown;
}

interface RoomListener {
  onEvent?: (event: RoomEvent) => void;
  onOpen?: () => void;
}

interface RoomConnection {
  listeners: Set<RoomListener>;
  socket: WebSocket | null;
  reconnectTimer?: ReturnType<typeof setTimeout>;
  retryDelay: number;
  closed: boolean;
}

// Um único socket por sala, partilhado pelo chat e pela vídeochamada.
const connections = new Map<number, RoomConnection>();

function connect(roomId: number, connection: RoomConnection) {
  if (connection.closed) return;
  const accessToken = getAccessToken();
  if (!accessToken) {
    scheduleReconnect(roomId, connection);
    return;
  }

  try {
    const url = new URL(`/ws/chat/${roomId}/`, API_URL);
    url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
    url.searchParams.set("token", accessToken);
    const socket = new WebSocket(url);
    connection.socket = socket;

    socket.addEventListener("open", () => {
      connection.retryDelay = 1_000;
      for (const listener of connection.listeners) listener.onOpen?.();
    });
    socket.addEventListener("message", (message) => {
      if (connection.closed || typeof message.data !== "string") return;
      let payload: unknown;
      try {
        payload = JSON.parse(message.data);
      } catch {
        return;
      }
      if (!payload || typeof payload !== "object" || !("type" in payload)) return;
      for (const listener of connection.listeners) {
        listener.onEvent?.(payload as RoomEvent);
      }
    });
    socket.addEventListener("close", () => scheduleReconnect(roomId, connection), {
      once: true,
    });
    socket.addEventListener("error", () => socket.close(), { once: true });
  } catch {
    scheduleReconnect(roomId, connection);
  }
}

function scheduleReconnect(roomId: number, connection: RoomConnection) {
  if (connection.closed || connection.reconnectTimer) return;
  connection.reconnectTimer = setTimeout(() => {
    connection.reconnectTimer = undefined;
    connect(roomId, connection);
  }, connection.retryDelay);
  connection.retryDelay = Math.min(connection.retryDelay * 2, 30_000);
}

export function subscribeToRoom(roomId: number, listener: RoomListener) {
  let connection = connections.get(roomId);
  if (!connection) {
    connection = { listeners: new Set(), socket: null, retryDelay: 1_000, closed: false };
    connections.set(roomId, connection);
    connection.listeners.add(listener);
    connect(roomId, connection);
  } else {
    connection.listeners.add(listener);
    if (connection.socket?.readyState === WebSocket.OPEN) listener.onOpen?.();
  }

  const current = connection;
  return () => {
    current.listeners.delete(listener);
    if (current.listeners.size > 0) return;
    current.closed = true;
    if (current.reconnectTimer) clearTimeout(current.reconnectTimer);
    current.socket?.close();
    connections.delete(roomId);
  };
}
