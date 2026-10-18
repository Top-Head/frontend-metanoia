import clsx from "clsx";
import type { ChatMessage } from "@/lib/api/types";

interface ChatThreadProps {
  messages: ChatMessage[];
  currentUserIds: number[];
  loading: boolean;
  error: string | null;
  hasOlder: boolean;
  loadingOlder: boolean;
  onLoadOlder: () => void;
  onRetry: () => void;
  pendingMessage?: { content: string } | null;
}

function messageTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function ChatThread({
  messages,
  currentUserIds,
  loading,
  error,
  hasOlder,
  loadingOlder,
  onLoadOlder,
  onRetry,
  pendingMessage,
}: ChatThreadProps) {
  return (
    <section
      className="flex min-h-full flex-col px-4 py-5 sm:px-6"
      aria-label="Histórico de mensagens"
    >
      {hasOlder && (
        <button
          type="button"
          onClick={onLoadOlder}
          disabled={loadingOlder}
          className="mx-auto mb-5 rounded-full border border-line bg-panel px-4 py-2 text-xs font-semibold text-primary shadow-sm hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60"
        >
          {loadingOlder ? "A carregar mensagens…" : "Ver mensagens anteriores"}
        </button>
      )}

      {loading && messages.length === 0 && (
        <p className="m-auto py-12 text-sm text-ink-soft" role="status">
          A carregar mensagens…
        </p>
      )}

      {error && messages.length === 0 && (
        <div className="m-auto max-w-sm py-12 text-center">
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

      {!loading && !error && messages.length === 0 && (
        <div className="m-auto max-w-sm py-12 text-center">
          <p className="font-display text-lg font-bold text-ink">
            Comece a conversa
          </p>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            Partilhe uma dúvida ou uma atualização com as pessoas desta turma.
          </p>
        </div>
      )}

      <div
        className="mt-auto space-y-3"
        role="log"
        aria-live="polite"
        aria-relevant="additions text"
      >
        {messages.map((message, index) => {
          // const sendrId = Number((message as any).sender)
          // const ownMessage = currentUserIds.map(Number).includes(sendrId);
          // const ownMessage = currentUserIds.includes(message.sender);

          const ownMessage = index % 2 === 0;
          return (
            <article
              key={message.id}
              className={clsx("flex w-full", ownMessage ? "justify-end" : "justify-start")}
            >
              <div
                className={clsx(
                  "max-w-[88%] rounded-2xl px-4 py-3 sm:max-w-[75%] lg:max-w-[68%]",
                  ownMessage
                    ? "rounded-br-md bg-primary text-white"
                    : "rounded-bl-md border border-line bg-panel text-ink"
                )}
              >
                {!ownMessage && (
                  <p className="mb-1 text-xs font-bold text-primary">
                    {message.author_name}
                  </p>
                )}
                <p className="whitespace-pre-wrap break-words text-sm leading-6">
                  {message.content}
                </p>
                <time
                  dateTime={message.created_at}
                  className={clsx(
                    "mt-1 block text-right text-[10px]",
                    ownMessage ? "text-white/70" : "text-ink-faint"
                  )}
                >
                  {messageTime(message.created_at)}
                </time>
              </div>
            </article>
          );
        })}
        {pendingMessage && (
          <article className="flex justify-end">
            <div className="max-w-[88%] rounded-2xl rounded-br-md bg-primary/75 px-4 py-3 text-white sm:max-w-[75%]">
              <p className="whitespace-pre-wrap break-words text-sm leading-6">
                {pendingMessage.content}
              </p>
              <p className="mt-1 text-right text-[10px] text-white/75">
                A enviar…
              </p>
            </div>
          </article>
        )}
      </div>

      {error && messages.length > 0 && (
        <p className="mt-4 text-center text-xs text-danger" role="status">
          {error}{" "}
          <button
            type="button"
            onClick={onRetry}
            className="font-semibold underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Atualizar
          </button>
        </p>
      )}
    </section>
  );
}
