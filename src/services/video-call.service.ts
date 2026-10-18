import { api, API_URL } from "@/lib/api/client";
import { getAccessToken } from "@/lib/api/tokens";
import type {
  VideoCallEnded,
  VideoCallJoin,
  VideoCallStatus,
} from "@/lib/api/types";

export async function getVideoCallStatus(roomId: number) {
  const { data } = await api.get<VideoCallStatus>(
    `/api/chat/rooms/${roomId}/video-call/`
  );
  return data;
}

export async function startVideoCall(roomId: number) {
  const { data } = await api.post<VideoCallJoin>(
    `/api/chat/rooms/${roomId}/video-call/start/`
  );
  return data;
}

export async function getVideoCallJoinToken(roomId: number) {
  const { data } = await api.post<VideoCallJoin>(
    `/api/chat/rooms/${roomId}/video-call/token/`
  );
  return data;
}

export async function endVideoCall(roomId: number) {
  const { data } = await api.post<VideoCallEnded>(
    `/api/chat/rooms/${roomId}/video-call/end/`
  );
  return data;
}

export function subscribeToVideoCallEvents(
  roomId: number,
  onCallChanged: () => void,
  onReconnect: () => void
) {
  let socket: WebSocket | null = null;
  let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
  let retryDelay = 1_000;
  let closed = false;

  function connect() {
    if (closed) return;
    const accessToken = getAccessToken();
    if (!accessToken) {
      scheduleReconnect();
      return;
    }

    try {
      const url = new URL(`/ws/chat/${roomId}/`, API_URL);
      url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
      url.searchParams.set("token", accessToken);
      const connection = new WebSocket(url);
      socket = connection;

      connection.addEventListener("open", () => {
        retryDelay = 1_000;
        onReconnect();
      });
      connection.addEventListener("message", (event) => {
        if (closed || typeof event.data !== "string") return;
        try {
          const payload: unknown = JSON.parse(event.data);
          if (
            payload &&
            typeof payload === "object" &&
            "type" in payload &&
            (payload.type === "video_call.started" ||
              payload.type === "video_call.ended")
          ) {
            onCallChanged();
          }
        } catch {
          // Ignore non-JSON chat events; status is reconciled through the REST endpoint.
        }
      });
      connection.addEventListener("close", scheduleReconnect, { once: true });
      connection.addEventListener(
        "error",
        () => connection.close(),
        { once: true }
      );
    } catch {
      scheduleReconnect();
    }
  }

  function scheduleReconnect() {
    if (closed || reconnectTimer) return;
    reconnectTimer = setTimeout(() => {
      reconnectTimer = undefined;
      connect();
    }, retryDelay);
    retryDelay = Math.min(retryDelay * 2, 30_000);
  }

  connect();

  return () => {
    closed = true;
    if (reconnectTimer) clearTimeout(reconnectTimer);
    socket?.close();
  };
}
