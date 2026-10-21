"use client";

import { useState, type FormEvent } from "react";
import clsx from "clsx";
import { CalendarPlus, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { Spinner, Status, buttonClass } from "@/components/app/ui";
import { ApiError } from "@/lib/api/client";
import type { CourseDetail, CourseSession } from "@/lib/api/types";
import { fromLocalInput } from "@/lib/course";
import { WEEKDAYS, describeMeeting, sortMeetings } from "@/lib/meeting";
import {
  createMeeting,
  createSession,
  deleteMeeting,
  deleteSession,
  updateSession,
} from "@/services/mentor-course.service";

const inputClass =
  "h-10 w-full rounded-md border border-line-strong bg-panel px-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-primary focus:ring-2 focus:ring-primary/15";

function errorMessage(reason: unknown, fallback: string) {
  return reason instanceof ApiError ? reason.message : fallback;
}

function NewSessionForm({ course, onCreated, first }: { course: CourseDetail; onCreated: () => void; first: boolean }) {
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) {
      toast.error("Dê um nome à turma (ex.: Turma de Novembro).");
      return;
    }
    setIsSaving(true);
    try {
      await createSession(course.id, {
        name: name.trim(),
        capacity: capacity ? Number(capacity) : null,
        is_active: true,
      });
      toast.success("Turma criada. Agora agende os encontros.");
      setName("");
      setCapacity("");
      onCreated();
    } catch (reason) {
      toast.error(errorMessage(reason, "Não foi possível criar a turma."));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className={clsx("rounded-lg p-5", first ? "bg-rail text-rail-ink" : "bg-tone")}>
      <h3 className={clsx("font-display text-[17px] font-semibold", first ? "text-white" : "text-ink")}>
        {first ? "Abra a primeira turma" : "Abrir outra turma"}
      </h3>
      <p className={clsx("mb-4 mt-1 text-[13px]", first ? "text-rail-muted" : "text-ink-soft")}>
        Os alunos inscrevem-se numa turma, e cada turma tem os seus próprios encontros e a sua conversa.
      </p>
      <div className="grid gap-2 sm:grid-cols-[1fr_200px_auto]">
        <input
          aria-label="Nome da turma"
          placeholder="Ex.: Turma de Novembro"
          maxLength={150}
          value={name}
          onChange={(event) => setName(event.target.value)}
          className={inputClass}
        />
        <input
          aria-label="Vagas da turma"
          type="number"
          min={1}
          placeholder={course.capacity ? `Vagas (padrão ${course.capacity})` : "Vagas (opcional)"}
          value={capacity}
          onChange={(event) => setCapacity(event.target.value)}
          className={inputClass}
        />
        <button type="submit" disabled={isSaving} className={buttonClass("primary")}>
          {isSaving && <Spinner />}
          Criar turma
        </button>
      </div>
    </form>
  );
}

type MeetingMode = "weekly" | "once";

function NewMeetingForm({ sessionId, onCreated, onClose }: { sessionId: number; onCreated: () => void; onClose: () => void }) {
  const [mode, setMode] = useState<MeetingMode>("weekly");
  const [date, setDate] = useState("");
  const [weekday, setWeekday] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [location, setLocation] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const when = mode === "weekly" ? weekday : date;
    if (!when || !start || !end) {
      toast.error(
        mode === "weekly"
          ? "Indique o dia da semana, a hora de início e a hora de fim."
          : "Indique a data, a hora de início e a hora de fim."
      );
      return;
    }
    if (end <= start) {
      toast.error("A hora de fim tem de ser depois da hora de início.");
      return;
    }
    setIsSaving(true);
    try {
      await createMeeting(
        sessionId,
        mode === "weekly"
          ? { day_of_week: Number(weekday), start_time: start, end_time: end, location: location.trim() }
          : {
              starts_at: fromLocalInput(`${date}T${start}`),
              ends_at: fromLocalInput(`${date}T${end}`),
              location: location.trim(),
            }
      );
      toast.success(mode === "weekly" ? "Encontro semanal adicionado." : "Encontro agendado.");
      setDate("");
      setWeekday("");
      setStart("");
      setEnd("");
      setLocation("");
      onCreated();
    } catch (reason) {
      toast.error(errorMessage(reason, "Não foi possível agendar o encontro."));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-4 rounded-md bg-tone p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div role="radiogroup" aria-label="Tipo de encontro" className="inline-flex gap-1 rounded-md bg-panel p-1">
          {(
            [
              ["weekly", "Todas as semanas"],
              ["once", "Uma data"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={mode === value}
              onClick={() => setMode(value)}
              className={clsx(
                "h-7 rounded px-3 text-[13px] font-semibold transition-colors",
                mode === value ? "bg-ink text-white" : "text-ink-soft hover:text-ink"
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <button type="button" onClick={onClose} aria-label="Fechar formulário" className="flex size-8 items-center justify-center rounded-md text-ink-soft hover:bg-panel hover:text-ink">
          <X size={16} />
        </button>
      </div>
      <div className="grid gap-2 sm:grid-cols-[1fr_110px_110px] lg:grid-cols-[1fr_110px_110px_1fr_auto]">
        {mode === "weekly" ? (
          <select aria-label="Dia da semana" value={weekday} onChange={(event) => setWeekday(event.target.value)} className={inputClass}>
            <option value="">Dia da semana</option>
            {WEEKDAYS.map((label, index) => (
              <option key={label} value={index}>
                {label}
              </option>
            ))}
          </select>
        ) : (
          <input aria-label="Data do encontro" type="date" value={date} onChange={(event) => setDate(event.target.value)} className={inputClass} />
        )}
        <input aria-label="Hora de início" type="time" value={start} onChange={(event) => setStart(event.target.value)} className={inputClass} />
        <input aria-label="Hora de fim" type="time" value={end} onChange={(event) => setEnd(event.target.value)} className={inputClass} />
        <input
          aria-label="Local ou link do encontro"
          placeholder="Local ou link (opcional)"
          maxLength={255}
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          className={clsx(inputClass, "sm:col-span-2 lg:col-span-1")}
        />
        <button type="submit" disabled={isSaving} className={buttonClass("primary")}>
          {isSaving ? <Spinner /> : <CalendarPlus size={15} aria-hidden="true" />}
          {mode === "weekly" ? "Adicionar" : "Agendar"}
        </button>
      </div>
      {mode === "weekly" && (
        <p className="mt-2 text-xs text-ink-soft">Repete-se todas as semanas dentro do período da aula, definido em Detalhes da aula.</p>
      )}
    </form>
  );
}

function SessionCard({ session, onChanged }: { session: CourseSession; onChanged: () => void }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [showMeetingForm, setShowMeetingForm] = useState(false);
  const active = session.is_active !== false;
  const meetings = sortMeetings(session.meetings ?? []);
  const enrolled = session.total_students ?? 0;
  const ratio = session.effective_capacity ? Math.min(enrolled / session.effective_capacity, 1) : 0;

  async function run(key: string, task: () => Promise<unknown>, success: string, fallback: string) {
    setBusy(key);
    try {
      await task();
      toast.success(success);
      onChanged();
    } catch (reason) {
      toast.error(errorMessage(reason, fallback));
    } finally {
      setBusy(null);
    }
  }

  return (
    <article className="rounded-lg border border-line bg-panel">
      <div className="flex flex-wrap items-start justify-between gap-4 p-5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h3 className="font-display text-[17px] font-semibold text-ink">{session.name}</h3>
            <Status tone={active ? "success" : "neutral"}>{active ? "Inscrições abertas" : "Inscrições fechadas"}</Status>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <span aria-hidden="true" className="block h-1 w-32 overflow-hidden rounded-full bg-tone">
              <span className="block h-full rounded-full bg-primary" style={{ width: `${ratio * 100}%` }} />
            </span>
            <span className="text-[13px] tabular-nums text-ink-soft">
              {enrolled} de {session.effective_capacity} vagas ocupadas
              {session.capacity == null && " (capacidade da aula)"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={busy !== null}
            onClick={() =>
              run(
                "toggle",
                () => updateSession(session.id, { is_active: !active }),
                active ? "Inscrições fechadas nesta turma." : "Turma reaberta.",
                "Não foi possível atualizar a turma."
              )
            }
            className={buttonClass("quiet", "sm")}
          >
            {busy === "toggle" && <Spinner />}
            {active ? "Fechar inscrições" : "Reabrir inscrições"}
          </button>
          <button
            type="button"
            aria-label={`Remover ${session.name}`}
            disabled={busy !== null}
            onClick={() => setConfirmingDelete(true)}
            className="flex size-8 items-center justify-center rounded-md text-ink-faint transition-colors hover:bg-danger-soft hover:text-danger disabled:opacity-50"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {confirmingDelete && (
        <div className="mx-5 mb-4 flex flex-wrap items-center justify-between gap-3 rounded-md bg-danger-soft px-4 py-3">
          <p className="text-sm text-ink">Remover a turma e todos os seus encontros?</p>
          <div className="flex gap-2">
            <button type="button" onClick={() => setConfirmingDelete(false)} className={buttonClass("secondary", "sm")}>
              Voltar
            </button>
            <button
              type="button"
              disabled={busy !== null}
              onClick={() => run("delete", () => deleteSession(session.id), "Turma removida.", "Não foi possível remover a turma.")}
              className={buttonClass("danger", "sm")}
            >
              {busy === "delete" && <Spinner />}
              Remover
            </button>
          </div>
        </div>
      )}

      <div className="border-t border-line px-5 pb-5 pt-4">
        <div className="flex items-center justify-between gap-3">
          <h4 className="text-sm font-semibold text-ink">
            Encontros <span className="font-normal tabular-nums text-ink-soft">{meetings.length}</span>
          </h4>
          {!showMeetingForm && (
            <button type="button" onClick={() => setShowMeetingForm(true)} className={buttonClass("secondary", "sm")}>
              <CalendarPlus size={14} aria-hidden="true" />
              Agendar encontro
            </button>
          )}
        </div>

        {meetings.length > 0 ? (
          <ul className="mt-3 divide-y divide-line">
            {meetings.map((meeting) => {
              const { day, time } = describeMeeting(meeting);
              return (
                <li key={meeting.id} className="flex items-center gap-4 py-2.5">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink first-letter:uppercase">{day}</p>
                    <p className="truncate text-[13px] tabular-nums text-ink-soft">{[time, meeting.location].filter(Boolean).join(" · ")}</p>
                  </div>
                  <button
                    type="button"
                    aria-label="Remover encontro"
                    disabled={busy !== null}
                    onClick={() =>
                      run(`meeting-${meeting.id}`, () => deleteMeeting(meeting.id), "Encontro removido.", "Não foi possível remover o encontro.")
                    }
                    className="flex size-8 items-center justify-center rounded-md text-ink-faint transition-colors hover:bg-danger-soft hover:text-danger disabled:opacity-50"
                  >
                    {busy === `meeting-${meeting.id}` ? <Spinner /> : <Trash2 size={14} />}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          !showMeetingForm && <p className="mt-2 text-sm text-ink-soft">Ainda sem encontros. Agende o primeiro para a turma aparecer na agenda.</p>
        )}

        {showMeetingForm && (
          <NewMeetingForm sessionId={session.id} onCreated={onChanged} onClose={() => setShowMeetingForm(false)} />
        )}
      </div>
    </article>
  );
}

export function SessionsManager({ course, onChanged }: { course: CourseDetail; onChanged: () => void }) {
  return (
    <div className="space-y-4">
      {course.sessions.map((session) => (
        <SessionCard key={session.id} session={session} onChanged={onChanged} />
      ))}
      <NewSessionForm course={course} onCreated={onChanged} first={course.sessions.length === 0} />
    </div>
  );
}
