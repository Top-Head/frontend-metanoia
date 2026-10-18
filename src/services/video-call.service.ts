import { api } from "@/lib/api/client";
import { subscribeToRoom } from "@/services/chat-socket.service";
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
  return subscribeToRoom(roomId, {
    onOpen: onReconnect,
    onEvent: (event) => {
      if (event.type === "video_call.started" || event.type === "video_call.ended") {
        onCallChanged();
      }
    },
  });
}
