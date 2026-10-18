"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import {
  Camera,
  CameraOff,
  LoaderCircle,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  RefreshCw,
  UsersRound,
  Video,
  VideoOff,
  X,
} from "lucide-react";
import {
  ConnectionState,
  Participant,
  Room,
  RoomEvent,
  Track,
} from "livekit-client";
import clsx from "clsx";
import toast from "react-hot-toast";
import type { ChatRoom, VideoCallJoin, VideoCallStatus } from "@/lib/api/types";
import {
  endVideoCall,
  getVideoCallJoinToken,
  getVideoCallStatus,
  startVideoCall,
  subscribeToVideoCallEvents,
} from "@/services/video-call.service";

const STATUS_REFRESH_MS = 20_000;

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function initials(name: string) {
  return name
    .split(/[\s_-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toLocaleUpperCase("pt-BR");
}

function formatElapsed(startedAt: string, now: number) {
  const seconds = Math.max(
    0,
    Math.floor((now - new Date(startedAt).getTime()) / 1_000)
  );
  const hours = Math.floor(seconds / 3_600);
  const minutes = Math.floor((seconds % 3_600) / 60);
  const remainder = seconds % 60;
  return [hours, minutes, remainder]
    .map((part) => String(part).padStart(2, "0"))
    .join(":");
}

interface VideoCallProps {
  room: ChatRoom;
  isMentor: boolean;
}

interface ParticipantTileProps {
  participant: Participant;
  local: boolean;
  videoEnabled: boolean;
}

function MediaTrack({
  track,
  elementRef,
}: {
  track: Track | undefined;
  elementRef: RefObject<HTMLVideoElement | null>;
}) {
  useEffect(() => {
    const element = elementRef.current;
    if (!track || !element) return;
    track.attach(element);
    return () => {
      track.detach(element);
    };
  }, [elementRef, track]);

  return (
    <video
      ref={elementRef}
      autoPlay
      playsInline
      className="absolute inset-0 size-full object-cover"
    />
  );
}

function AudioTrack({ participant }: { participant: Participant }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioTrack = participant.getTrackPublication(
    Track.Source.Microphone
  )?.audioTrack;

  useEffect(() => {
    const element = audioRef.current;
    if (participant.isLocal || !audioTrack || !element) return;
    audioTrack.attach(element);
    return () => {
      audioTrack.detach(element);
    };
  }, [audioTrack, participant]);

  return <audio ref={audioRef} autoPlay className="sr-only" />;
}

function ParticipantTile({
  participant,
  local,
  videoEnabled,
}: ParticipantTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const displayName = local
    ? "Você"
    : participant.name || participant.identity;
  const cameraPublication = participant.getTrackPublication(Track.Source.Camera);
  const cameraTrack = cameraPublication?.videoTrack;
  const showVideo = videoEnabled && Boolean(cameraTrack);

  return (
    <article
      className={clsx(
        "relative aspect-video min-h-44 overflow-hidden rounded-2xl border bg-[#111c2b]",
        participant.isSpeaking
          ? "border-sky-300 shadow-[0_0_0_2px_rgb(125_211_252_/_0.35)]"
          : "border-white/10"
      )}
      aria-label={`${displayName}${participant.isSpeaking ? ", a falar" : ""}`}
    >
      {showVideo ? (
        <MediaTrack track={cameraTrack} elementRef={videoRef} />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[radial-gradient(ellipse_at_center,_#263b53_0%,_#101925_70%)]">
          <span className="flex size-20 items-center justify-center rounded-full border border-white/10 bg-white/10 font-display text-2xl font-semibold text-white">
            {initials(displayName)}
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-black/30 px-2.5 py-1 text-xs text-white/75">
            <VideoOff size={13} aria-hidden="true" />
            Câmara desligada
          </span>
        </div>
      )}
      <AudioTrack participant={participant} />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-12">
        <span className="max-w-[75%] truncate text-sm font-semibold text-white">
          {displayName}
          {local && (
            <span className="ml-1.5 text-xs font-normal text-white/60">
              (Você)
            </span>
          )}
        </span>
        <span
          className="flex size-8 items-center justify-center rounded-full bg-black/40 text-white"
          aria-label={
            participant.isMicrophoneEnabled ? "Microfone ligado" : "Microfone desligado"
          }
          title={
            participant.isMicrophoneEnabled
              ? "Microfone ligado"
              : "Microfone desligado"
          }
        >
          {participant.isMicrophoneEnabled ? (
            <Mic size={14} aria-hidden="true" />
          ) : (
            <MicOff size={14} aria-hidden="true" />
          )}
        </span>
      </div>
    </article>
  );
}

function LiveKitCall({
  join,
  sessionName,
  isMentor,
  onLeave,
  onEndCall,
  onReconnect,
}: {
  join: VideoCallJoin;
  sessionName: string;
  isMentor: boolean;
  onLeave: () => void;
  onEndCall: () => void;
  onReconnect: () => Promise<VideoCallJoin>;
}) {
  const [liveRoom, setLiveRoom] = useState<Room | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    ConnectionState.Connecting
  );
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [microphoneEnabled, setMicrophoneEnabled] = useState(true);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [needsAudioActivation, setNeedsAudioActivation] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const localParticipantRef = useRef<Room["localParticipant"] | null>(null);

  const updateParticipants = useCallback((room: Room) => {
    setParticipants([
      room.localParticipant,
      ...Array.from(room.remoteParticipants.values()),
    ]);
    setCameraEnabled(room.localParticipant.isCameraEnabled);
    setMicrophoneEnabled(room.localParticipant.isMicrophoneEnabled);
  }, []);

  useEffect(() => {
    const room = new Room({ adaptiveStream: true, dynacast: true });
    let disposed = false;
    localParticipantRef.current = room.localParticipant;
    setLiveRoom(room);
    const update = () => {
      if (!disposed) updateParticipants(room);
    };
    const updateState = (state: ConnectionState) => {
      if (!disposed) setConnectionState(state);
    };
    const onMediaError = (error: Error) => {
      if (!disposed) setMediaError(error.message);
    };
    const onAudioPlaybackChanged = (playing: boolean) => {
      if (!disposed) setNeedsAudioActivation(!playing);
    };

    room
      .on(RoomEvent.Connected, update)
      .on(RoomEvent.Reconnected, update)
      .on(RoomEvent.ConnectionStateChanged, updateState)
      .on(RoomEvent.ParticipantConnected, update)
      .on(RoomEvent.ParticipantDisconnected, update)
      .on(RoomEvent.TrackSubscribed, update)
      .on(RoomEvent.TrackUnsubscribed, update)
      .on(RoomEvent.TrackPublished, update)
      .on(RoomEvent.TrackUnpublished, update)
      .on(RoomEvent.LocalTrackPublished, update)
      .on(RoomEvent.LocalTrackUnpublished, update)
      .on(RoomEvent.TrackMuted, update)
      .on(RoomEvent.TrackUnmuted, update)
      .on(RoomEvent.MediaDevicesError, onMediaError)
      .on(RoomEvent.AudioPlaybackStatusChanged, onAudioPlaybackChanged);

    void room
      .connect(join.server_url, join.token)
      .then(async () => {
        if (disposed) {
          await room.disconnect();
          return;
        }
        setConnectionState(ConnectionState.Connected);
        setNeedsAudioActivation(!room.canPlaybackAudio);
        updateParticipants(room);
        const mediaResults = await Promise.allSettled([
          room.localParticipant.setMicrophoneEnabled(true),
          room.localParticipant.setCameraEnabled(true),
        ]);
        if (disposed) return;
        const failures = mediaResults.filter(
          (result): result is PromiseRejectedResult => result.status === "rejected"
        );
        if (failures.length) {
          setMediaError(
            "A chamada está ligada, mas não foi possível ativar a câmara ou o microfone. Verifique as permissões do navegador."
          );
        }
        updateParticipants(room);
      })
      .catch((error: unknown) => {
        if (!disposed) {
          setConnectionState(ConnectionState.Disconnected);
          setMediaError(
            errorMessage(error, "Não foi possível ligar à videochamada.")
          );
        }
      });

    return () => {
      disposed = true;
      localParticipantRef.current = null;
      void room.disconnect();
    };
  }, [join.server_url, join.token, updateParticipants]);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1_000);
    return () => clearInterval(timer);
  }, []);

  async function toggleMicrophone() {
    const participant = localParticipantRef.current;
    if (!participant) return;
    try {
      await participant.setMicrophoneEnabled(!participant.isMicrophoneEnabled);
      setMicrophoneEnabled(participant.isMicrophoneEnabled);
      setMediaError(null);
    } catch (error) {
      setMediaError(errorMessage(error, "Não foi possível alterar o microfone."));
    }
  }

  async function toggleCamera() {
    const participant = localParticipantRef.current;
    if (!participant) return;
    try {
      await participant.setCameraEnabled(!participant.isCameraEnabled);
      setCameraEnabled(participant.isCameraEnabled);
      setMediaError(null);
    } catch (error) {
      setMediaError(errorMessage(error, "Não foi possível alterar a câmara."));
    }
  }

  async function reconnect() {
    if (reconnecting) return;
    setReconnecting(true);
    setMediaError(null);
    try {
      await onReconnect();
    } catch (error) {
      setMediaError(errorMessage(error, "Não foi possível voltar à chamada."));
    } finally {
      setReconnecting(false);
    }
  }

  async function activateAudio() {
    if (!liveRoom) return;
    try {
      await liveRoom.startAudio();
      setNeedsAudioActivation(false);
    } catch (error) {
      setMediaError(errorMessage(error, "Não foi possível ativar o áudio."));
    }
  }

  const connected = connectionState === ConnectionState.Connected;
  const connectionLabel =
    connectionState === ConnectionState.Reconnecting ||
    connectionState === ConnectionState.SignalReconnecting
      ? "A recuperar ligação"
      : connectionState === ConnectionState.Connected
        ? "Ligação segura"
        : connectionState === ConnectionState.Disconnected
          ? "Sem ligação"
          : "A ligar";

  return (
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-call-title"
      className="fixed inset-0 z-[100] flex flex-col bg-[#08111d] text-white"
    >
      <header className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3 sm:px-7">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-sky-300">
            Metanoia · sala ao vivo
          </p>
          <h2
            id="video-call-title"
            className="mt-1 truncate font-display text-base font-semibold text-white sm:text-lg"
          >
            {sessionName}
          </h2>
        </div>
        <div className="ml-3 flex shrink-0 items-center gap-3">
          {needsAudioActivation && (
            <button
              type="button"
              onClick={() => void activateAudio()}
              className="rounded-lg bg-sky-300 px-3 py-2 text-xs font-bold text-[#08111d] transition hover:bg-sky-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
            >
              Ativar áudio
            </button>
          )}
          <span className="hidden items-center gap-2 text-xs text-white/65 sm:flex">
            <span
              className={clsx(
                "size-2 rounded-full",
                connected ? "bg-emerald-400" : "animate-pulse bg-amber-300"
              )}
              aria-hidden="true"
            />
            {connectionLabel}
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs text-white/80">
            {formatElapsed(join.started_at, now)}
          </span>
          <button
            type="button"
            onClick={onLeave}
            aria-label="Sair da chamada"
            className="flex size-9 items-center justify-center rounded-xl text-white/70 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-5 sm:px-7">
        {participants.length ? (
          <div
            className={clsx(
              "grid w-full max-w-6xl gap-3",
              participants.length === 1
                ? "grid-cols-1"
                : "grid-cols-1 sm:grid-cols-2"
            )}
          >
            {participants.map((participant) => (
              <ParticipantTile
                key={participant.identity}
                participant={participant}
                local={participant.isLocal}
                videoEnabled={
                  participant.isLocal
                    ? cameraEnabled
                    : participant.isCameraEnabled
                }
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <span className="relative flex size-24 items-center justify-center rounded-[2rem] border border-sky-200/15 bg-sky-300/10 text-sky-200">
              <Video size={34} strokeWidth={1.5} aria-hidden="true" />
              <span className="absolute -right-1 -top-1 size-4 animate-ping rounded-full bg-sky-300/60" />
            </span>
            <p className="mt-6 font-display text-xl font-semibold">
              {connectionState === ConnectionState.Disconnected
                ? "A ligação foi interrompida"
                : "A preparar a sala"}
            </p>
            <p className="mt-2 max-w-sm text-sm leading-6 text-white/55">
              {connectionState === ConnectionState.Disconnected
                ? "Pode tentar obter um novo acesso à chamada."
                : "Estamos a ligar a câmara e o microfone com segurança."}
            </p>
            {connectionState === ConnectionState.Disconnected && (
              <button
                type="button"
                onClick={() => void reconnect()}
                disabled={reconnecting}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-sky-300 px-4 py-2.5 text-sm font-bold text-[#08111d] transition hover:bg-sky-200 disabled:opacity-60"
              >
                {reconnecting ? (
                  <LoaderCircle size={16} className="animate-spin" />
                ) : (
                  <RefreshCw size={16} />
                )}
                Voltar à chamada
              </button>
            )}
          </div>
        )}
      </div>

      <footer className="shrink-0 border-t border-white/10 bg-[#0b1623] px-4 py-4 sm:px-7">
        {mediaError && (
          <p className="mx-auto mb-3 max-w-3xl text-center text-xs text-amber-200" role="alert">
            {mediaError}
          </p>
        )}
        <div className="mx-auto flex max-w-3xl items-center justify-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => void toggleMicrophone()}
            disabled={!connected}
            aria-label={microphoneEnabled ? "Desligar microfone" : "Ligar microfone"}
            className={clsx(
              "flex size-12 items-center justify-center rounded-2xl border transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 disabled:opacity-50 sm:size-14",
              microphoneEnabled
                ? "border-white/10 bg-white/10 text-white hover:bg-white/15"
                : "border-rose-300/30 bg-rose-400 text-white hover:bg-rose-300"
            )}
          >
            {microphoneEnabled ? (
              <Mic size={20} aria-hidden="true" />
            ) : (
              <MicOff size={20} aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            onClick={() => void toggleCamera()}
            disabled={!connected}
            aria-label={cameraEnabled ? "Desligar câmara" : "Ligar câmara"}
            className={clsx(
              "flex size-12 items-center justify-center rounded-2xl border transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 disabled:opacity-50 sm:size-14",
              cameraEnabled
                ? "border-white/10 bg-white/10 text-white hover:bg-white/15"
                : "border-rose-300/30 bg-rose-400 text-white hover:bg-rose-300"
            )}
          >
            {cameraEnabled ? (
              <Camera size={20} aria-hidden="true" />
            ) : (
              <CameraOff size={20} aria-hidden="true" />
            )}
          </button>
          <div className="mx-1 hidden h-8 w-px bg-white/15 sm:block" />
          {isMentor ? (
            <button
              type="button"
              onClick={onEndCall}
              className="inline-flex h-12 items-center gap-2 rounded-2xl bg-rose-500 px-4 text-sm font-bold text-white transition hover:bg-rose-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-300 sm:h-14 sm:px-6"
            >
              <PhoneOff size={18} aria-hidden="true" />
              <span className="hidden sm:inline">Encerrar para todos</span>
              <span className="sm:hidden">Encerrar</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onLeave}
              className="inline-flex h-12 items-center gap-2 rounded-2xl bg-rose-500 px-4 text-sm font-bold text-white transition hover:bg-rose-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-300 sm:h-14 sm:px-6"
            >
              <PhoneOff size={18} aria-hidden="true" />
              Sair da chamada
            </button>
          )}
        </div>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-white/40">
          <UsersRound size={12} aria-hidden="true" />
          {participants.length} {participants.length === 1 ? "participante" : "participantes"}
        </p>
      </footer>
    </section>
  );
}

export default function VideoCall({ room, isMentor }: VideoCallProps) {
  const [status, setStatus] = useState<VideoCallStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [join, setJoin] = useState<VideoCallJoin | null>(null);
  const statusRequest = useRef(false);
  const statusRevision = useRef(0);
  const statusSnapshot = useRef(status);
  const joinSnapshot = useRef(join);

  useEffect(() => {
    statusSnapshot.current = status;
  }, [status]);

  useEffect(() => {
    joinSnapshot.current = join;
  }, [join]);

  const refreshStatus = useCallback(
    async (initial = false) => {
      if (statusRequest.current) return;
      const revision = statusRevision.current;
      statusRequest.current = true;
      if (initial) setStatusLoading(true);
      try {
        const nextStatus = await getVideoCallStatus(room.id);
        if (revision !== statusRevision.current) return;
        if (
          statusSnapshot.current?.active &&
          !nextStatus.active &&
          joinSnapshot.current
        ) {
          toast("A videochamada foi encerrada.");
        }
        setStatus(nextStatus);
        setStatusError(null);
        if (!nextStatus.active) setJoin(null);
      } catch (error) {
        if (revision === statusRevision.current) {
          setStatusError(
            errorMessage(error, "Não foi possível verificar o estado da chamada.")
          );
        }
      } finally {
        statusRequest.current = false;
        if (initial) setStatusLoading(false);
      }
    },
    [room.id]
  );

  useEffect(() => {
    let disposed = false;
    const initialRefresh = () => {
      if (!disposed) void refreshStatus(true);
    };
    const refreshIfVisible = () => {
      if (!disposed && document.visibilityState === "visible") {
        void refreshStatus();
      }
    };

    initialRefresh();
    const unsubscribe = subscribeToVideoCallEvents(
      room.id,
      refreshIfVisible,
      refreshIfVisible
    );
    const interval = setInterval(refreshIfVisible, STATUS_REFRESH_MS);
    document.addEventListener("visibilitychange", refreshIfVisible);

    return () => {
      disposed = true;
      unsubscribe();
      clearInterval(interval);
      document.removeEventListener("visibilitychange", refreshIfVisible);
    };
  }, [refreshStatus, room.id]);

  async function handleStart() {
    if (!isMentor || busy) return;
    statusRevision.current += 1;
    setBusy(true);
    setActionError(null);
    try {
      const call = await startVideoCall(room.id);
      statusRevision.current += 1;
      setStatus({
        active: true,
        id: call.id,
        started_at: call.started_at,
      });
      setJoin(call);
    } catch (error) {
      setActionError(
        errorMessage(error, "Não foi possível iniciar a videochamada.")
      );
      void refreshStatus();
    } finally {
      setBusy(false);
    }
  }

  async function handleJoin() {
    if (busy) return;
    statusRevision.current += 1;
    setBusy(true);
    setActionError(null);
    try {
      setJoin(await getVideoCallJoinToken(room.id));
    } catch (error) {
      setActionError(
        errorMessage(error, "Não foi possível entrar na videochamada.")
      );
      void refreshStatus();
    } finally {
      setBusy(false);
    }
  }

  async function handleEnd() {
    if (!isMentor || busy) return;
    statusRevision.current += 1;
    setBusy(true);
    setActionError(null);
    try {
      await endVideoCall(room.id);
      statusRevision.current += 1;
      setStatus({ active: false });
      setJoin(null);
      toast.success("Videochamada encerrada para todos.");
    } catch (error) {
      setActionError(
        errorMessage(error, "Não foi possível encerrar a videochamada.")
      );
      void refreshStatus();
    } finally {
      setBusy(false);
    }
  }

  async function reconnect() {
    statusRevision.current += 1;
    const nextJoin = await getVideoCallJoinToken(room.id);
    statusRevision.current += 1;
    setJoin(nextJoin);
    return nextJoin;
  }

  const callIsActive = status?.active === true;

  return (
    <>
      <div className="relative flex shrink-0 items-center gap-2">
        {statusLoading ? (
          <span
            className="flex items-center gap-1.5 text-xs text-ink-faint"
            role="status"
          >
            <LoaderCircle size={14} className="animate-spin" aria-hidden="true" />
            <span className="hidden sm:inline">A verificar chamada</span>
          </span>
        ) : callIsActive ? (
          <>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-700">
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
              Ao vivo
            </span>
            <button
              type="button"
              onClick={() => void handleJoin()}
              disabled={busy || Boolean(join)}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-3 text-xs font-bold text-white transition hover:bg-primary-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-60 sm:px-4 sm:text-sm"
            >
              {busy ? (
                <LoaderCircle size={15} className="animate-spin" />
              ) : (
                <Video size={15} />
              )}
              <span className="hidden sm:inline">
                {join ? "Ligado" : "Entrar"}
              </span>
              <span className="sm:hidden">{join ? "Ligado" : "Entrar"}</span>
            </button>
          </>
        ) : isMentor ? (
          <button
            type="button"
            onClick={() => void handleStart()}
            disabled={busy || statusLoading}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-3 text-xs font-bold text-white transition hover:bg-primary-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-60 sm:px-4 sm:text-sm"
          >
            {busy ? (
              <LoaderCircle size={15} className="animate-spin" />
            ) : (
              <Video size={15} />
            )}
            <span>Iniciar chamada</span>
          </button>
        ) : (
          <span className="hidden items-center gap-1.5 text-xs text-ink-soft sm:inline-flex">
            <Phone size={14} aria-hidden="true" />
            À espera do mentor
          </span>
        )}
        {statusError && (
          <button
            type="button"
            onClick={() => void refreshStatus(true)}
            aria-label="Verificar novamente o estado da videochamada"
            title={statusError}
            className="flex size-8 items-center justify-center rounded-lg text-danger hover:bg-danger/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <RefreshCw size={15} aria-hidden="true" />
          </button>
        )}
      </div>
      {(statusError || actionError) && (
        <p className="absolute right-4 top-full z-20 mt-1 max-w-xs rounded-lg border border-danger/20 bg-panel px-3 py-2 text-xs text-danger shadow-card sm:right-6">
          {actionError ?? statusError}
        </p>
      )}
      {join && (
        <LiveKitCall
          key={`${join.id}:${join.token}`}
          join={join}
          sessionName={`${room.course_title} · ${room.session_name}`}
          isMentor={isMentor}
          onLeave={() => setJoin(null)}
          onEndCall={() => void handleEnd()}
          onReconnect={reconnect}
        />
      )}
    </>
  );
}
