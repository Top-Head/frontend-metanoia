import { BookOpen, UsersRound } from "lucide-react";
import type { ChatRoom } from "@/lib/api/types";

export default function Profile({
  room,
  isMentor,
}: {
  room: ChatRoom;
  isMentor: boolean;
}) {
  return (
    <aside className="hidden w-80 shrink-0 border-l border-line bg-panel xl:block">
      <div className="p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          Contexto
        </p>
        <h2 className="mt-2 font-display text-lg font-bold text-ink">
          Sobre esta sala
        </h2>
        <p className="mt-1 text-sm leading-6 text-ink-soft">
          Uma conversa partilhada por quem faz parte desta turma.
        </p>

        <dl className="mt-7 divide-y divide-line border-y border-line">
          <div className="flex gap-3 py-4">
            <BookOpen
              size={18}
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-primary"
            />
            <div className="min-w-0">
              <dt className="text-xs text-ink-faint">Curso</dt>
              <dd className="mt-1 text-sm font-semibold text-ink">
                {room.course_title}
              </dd>
            </div>
          </div>
          <div className="flex gap-3 py-4">
            <UsersRound
              size={18}
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-primary"
            />
            <div className="min-w-0">
              <dt className="text-xs text-ink-faint">Turma</dt>
              <dd className="mt-1 text-sm font-semibold text-ink">
                {room.session_name}
              </dd>
              <dd className="mt-1 text-xs text-ink-soft">
                {room.member_count} participantes
              </dd>
            </div>
          </div>
          <div className="py-4">
            <dt className="text-xs text-ink-faint">Mentor</dt>
            <dd className="mt-1 text-sm font-semibold text-ink">
              {isMentor ? "Você" : room.mentor_name}
            </dd>
          </div>
        </dl>

        <p className="mt-5 rounded-xl bg-primary/5 p-4 text-xs leading-5 text-ink-soft">
          Mantenha a conversa focada na aprendizagem e evite partilhar dados
          pessoais sensíveis.
        </p>
      </div>
    </aside>
  );
}
