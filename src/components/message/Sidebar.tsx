"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import clsx from "clsx";
import { useState } from "react";

interface Conversation {
  id: number;
  name: string;
  course: string;
  lastMessage: string;
  active?: boolean;
  unread?: number;
}

const CONVERSATIONS: Conversation[] = [
  {
    id: 1,
    name: "Alex Rivera",
    course: "Trilha de UI Design",
    lastMessage: "Podemos remarcar a sessão?",
    active: true,
    unread: 2,
  },
  {
    id: 2,
    name: "Maria Oliveira",
    course: "React Avançado",
    lastMessage: "Enviei o link do repositório.",
  },
  {
    id: 3,
    name: "João Santos",
    course: "Coaching de Carreira",
    lastMessage: "Obrigado pelo feedback de hoje!",
  },
  {
    id: 4,
    name: "Beatriz Lima",
    course: "Design Systems",
    lastMessage: "A próxima aula será quarta?",
  },
  {
    id: 5,
    name: "Gustavo Alves",
    course: "Data Science",
    lastMessage: "Consegui rodar o notebook.",
  },
];

const FILTER_TABS = ["Todos", "Mentores", "Alunos"];

export default function Sidebar() {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [query, setQuery] = useState("");

  const conversations = CONVERSATIONS.filter(({ name, lastMessage }) => {
    const search = query.trim().toLowerCase();
    return (
      !search ||
      name.toLowerCase().includes(search) ||
      lastMessage.toLowerCase().includes(search)
    );
  });

  return (
    <aside className="flex w-full shrink-0 flex-col border-r border-line bg-panel px-4 py-4 md:w-80 lg:w-96">
      <div className="shrink-0">
        <h1 className="text-xl font-bold text-ink">Mensagens</h1>
        <p className="text-sm text-ink-soft">Central de comunicação</p>

        <div className="relative mt-4 h-11">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft"
          />
          <input
            type="search"
            placeholder="Buscar conversas..."
            aria-label="Buscar conversas"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-full w-full rounded-lg bg-line pl-10 pr-4 text-sm outline-none transition-shadow focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="mt-4 flex h-11 gap-2 rounded-xl bg-slate-100 px-2">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveFilter(tab)}
              className={clsx(
                "my-1.5 rounded-lg px-4 text-sm font-medium transition-colors",
                activeFilter === tab
                  ? "bg-panel text-ink shadow-card"
                  : "text-ink-soft hover:text-ink"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            type="button"
            className={clsx(
              "flex w-full items-center gap-4 rounded-r-xl p-2 text-left transition-colors",
              conversation.active
                ? "border-l-4 border-primary bg-primary/5"
                : "border-l-4 border-transparent hover:bg-slate-50"
            )}
          >
            <Image
              src="/Container.png"
              alt={`Avatar de ${conversation.name}`}
              width={48}
              height={48}
              className="h-12 w-12 shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h2 className="truncate text-lg font-semibold text-ink">
                  {conversation.name}
                </h2>
                {conversation.unread && (
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                    {conversation.unread}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium text-primary">
                {conversation.course}
              </span>
              <p className="truncate text-sm text-ink-soft">
                {conversation.lastMessage}
              </p>
            </div>
          </button>
        ))}

        {conversations.length === 0 && (
          <p className="py-8 text-center text-sm text-ink-faint">
            Nenhuma conversa encontrada.
          </p>
        )}
      </div>
    </aside>
  );
}