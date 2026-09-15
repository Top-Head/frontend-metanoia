import Image from "next/image";
import clsx from "clsx";

export interface ChatMessage {
  id: number;
  sender: "student" | "mentor";
  text: string;
  time: string;
  hasAttachment?: boolean;
}

interface ChatThreadProps {
  messages: ChatMessage[];
  studentName: string;
}

export function ChatThread({ messages, studentName }: ChatThreadProps) {
  return (
    <section className="space-y-4 px-5 py-6" aria-label="Histórico de mensagens">
      {messages.map((message) => {
        const incoming = message.sender === "student";
        const avatarSrc = incoming ? "/Margin.png" : "/Image+Border.svg";

        return (
          <div
            key={message.id}
            className={clsx(
              "flex gap-3",
              !incoming && "justify-end"
            )}
          >
            {incoming && (
              <Image
                src={avatarSrc}
                alt={`${studentName}`}
                width={40}
                height={48}
                className="h-12 w-10 shrink-0 pt-1"
              />
            )}

            <div
              className={clsx(
                "max-w-[70%] rounded-2xl p-4 text-sm md:max-w-[407px]",
                incoming
                  ? "rounded-bl-sm bg-slate-100 text-ink"
                  : "rounded-br-sm bg-primary text-white"
              )}
            >
              <p>{message.text}</p>
              {message.hasAttachment && (
                <div className="mt-3 h-[52px] w-full rounded-lg border border-line-strong bg-panel" />
              )}
              <p
                className={clsx(
                  "mt-2 text-[10px] font-medium",
                  incoming ? "text-ink-faint" : "text-white/70"
                )}
              >
                {message.time}
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
}