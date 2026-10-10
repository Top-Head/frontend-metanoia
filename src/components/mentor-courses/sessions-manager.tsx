"use client";

import { useState, type FormEvent } from "react";
import clsx from "clsx";
import { CalendarDays, CalendarPlus, Layers, Plus, Trash2, Users } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/client";
import type { CourseDetail, CourseSession } from "@/lib/api/types";
import { fromLocalInput } from "@/lib/course";
import { formatMeetingDate, formatMeetingTime } from "@/lib/format";
import {
  createMeeting,
  createSession,
  deleteMeeting,
  deleteSession,
  updateSession,
} from "@/services/mentor-course.service";

const inputClass =
  "h-10 w-full rounded-lg border border-line-strong bg-panel px-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-primary focus:ring-1 focus:ring-primary";

function errorMessage(reason: unknown, fallback: string) {
  return reason instanceof ApiError ? reason.message : fallback;
}

function NewSessionForm({ course, onCreated }: { course: CourseDetail; onCreated: () => void }) {
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
    <form onSubmit={submit} className="rounded-2xl border border-dashed border-line-strong bg-panel p-5">
      <p className="mb-3 flex items-center gap-2 text-sm font-bold text-ink">
        <Plus size={16} className="text-primary" />
        Nova turma
      </p>
      <div className="grid gap-3 sm:grid-cols-[1fr_180px_auto]">
        <input
          aria-label="Nome da turma"
          placeholder="Ex.: Turma de Novembro"
          maxLength={150}
          value={name}
          onChange={(event) => setName(event.target.value)}
          className={inputClass}
        />
        <input
          aria-label="Capacidade da turma"
          type="number"
          min={1}
          placeholder={course.capacity ? `Vagas (padrão ${course.capacity})` : "Vagas (opcional)"}
          value={capacity}
          onChange={(event) => setCapacity(event.target.value)}
          className={inputClass}
        />
        <Button type="submit" isLoading={isSaving}>
          Criar turma
        </Button>
      </div>
    </form>
  );
}

function NewMeetingForm({ sessionId, onCreated }: { sessionId: number; onCreated: () => void }) {
  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [location, setLocation] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!date || !start || !end) {
      toast.error("Indique a data, a hora de início e a hora de fim.");
      return;
    }
    if (end <= start) {
      toast.error("A hora de fim tem de ser depois da hora de início.");
      return;
    }
    setIsSaving(true);
    try {
      await createMeeting(sessionId, {
        starts_at: fromLocalInput(`${date}T${start}`),
        ends_at: fromLocalInput(`${date}T${end}`),
        location: location.trim(),
      });
      toast.success("Encontro agendado.");
      setDate("");
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
    <form onSubmit={submit} className="mt-3 grid gap-2 rounded-xl bg-canvas p-3 sm:grid-cols-[1fr_110px_110px] lg:grid-cols-[1fr_110px_110px_1fr_auto]">
      <input aria-label="Data do encontro" type="date" value={date} onChange={(event) => setDate(event.target.value)} className={inputClass} />
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
      <Button type="submit" size="md" isLoading={isSaving}>
        {!isSaving && <CalendarPlus size={16} />}
        Agendar
      </Button>
    </form>
  );
}

function SessionCard({ session, onChanged }: { session: CourseSession; onChanged: () => void }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [showMeetingForm, setShowMeetingForm] = useState(false);
  const active = session.is_active !== false;
  const meetings = [...(session.meetings ?? [])].sort((a, b) => a.starts_at.localeCompare(b.starts_at));

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
    <div className={clsx("rounded-2xl border bg-panel p-5 shadow-card", active ? "border-line" : "border-dashed border-line-strong opacity-80")}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 font-bold text-ink">
            {session.name}
            {!active && (
              <span className="rounded-full bg-line px-2 py-0.5 text-[11px] font-bold text-ink-soft">Fechada</span>
            )}
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-soft">
            <Users size={12} />
            {session.effective_capacity} {session.effective_capacity === 1 ? "vaga" : "vagas"}
            {session.capacity == null && " (capacidade da aula)"}
          </p>
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
            className="rounded-lg px-3 py-1.5 text-xs font-bold text-ink-soft transition-colors hover:bg-canvas hover:text-ink disabled:opacity-50"
          >
            {active ? "Fechar inscrições" : "Reabrir"}
          </button>
          <button
            type="button"
            aria-label={`Remover ${session.name}`}
            disabled={busy !== null}
            onClick={() => setConfirmingDelete(true)}
            className="rounded-lg p-2 text-ink-faint transition-colors hover:bg-danger/5 hover:text-danger disabled:opacity-50"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {confirmingDelete && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-danger/5 p-3">
          <p className="text-sm text-danger">Remover a turma e os seus encontros?</p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={busy !== null}
              onClick={() =>
                run("delete", () => deleteSession(session.id), "Turma removida.", "Não foi possível remover a turma.")
              }
              className="rounded-md bg-danger px-3 py-1.5 text-xs font-bold text-white disabled:opacity-60"
            >
              {busy === "delete" ? "A remover…" : "Remover"}
            </button>
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              className="rounded-md px-3 py-1.5 text-xs font-bold text-ink-soft hover:bg-line"
            >
              Voltar
            </button>
          </div>
        </div>
      )}

      <div className="mt-4 border-t border-line pt-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-faint">Encontros</p>
        {meetings.length > 0 ? (
          <ul className="space-y-2">
            {meetings.map((meeting) => (
              <li key={meeting.id} className="flex items-center gap-3 rounded-lg px-1 py-1">
                <CalendarDays size={16} className="shrink-0 text-primary" />
                <div className="min-w-0 flex-1 text-sm">
                  <p className="font-semibold text-ink first-letter:uppercase">{formatMeetingDate(meeting.starts_at)}</p>
                  <p className="truncate text-xs text-ink-soft">
                    {formatMeetingTime(meeting.starts_at, meeting.ends_at)}
                    {meeting.location && ` · ${meeting.location}`}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Remover encontro"
                  disabled={busy !== null}
                  onClick={() =>
                    run(`meeting-${meeting.id}`, () => deleteMeeting(meeting.id), "Encontro removido.", "Não foi possível remover o encontro.")
                  }
                  className="rounded-lg p-1.5 text-ink-faint transition-colors hover:bg-danger/5 hover:text-danger disabled:opacity-50"
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-ink-faint">Nenhum encontro agendado.</p>
        )}

        {showMeetingForm ? (
          <NewMeetingForm sessionId={session.id} onCreated={onChanged} />
        ) : (
          <button
            type="button"
            onClick={() => setShowMeetingForm(true)}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
          >
            <CalendarPlus size={14} />
            Agendar encontro
          </button>
        )}
      </div>
    </div>
  );
}

export function SessionsManager({ course, onChanged }: { course: CourseDetail; onChanged: () => void }) {
  return (
    <div className="space-y-4">
      {course.sessions.length === 0 && (
        <div className="flex items-start gap-3 rounded-2xl bg-primary/5 p-5 text-sm text-ink-soft">
          <Layers size={18} className="mt-0.5 shrink-0 text-primary" />
          <p>
            <span className="font-bold text-ink">Abra a primeira turma.</span> Os alunos inscrevem-se numa turma, e cada
            turma tem os seus encontros com data e hora.
          </p>
        </div>
      )}
      {course.sessions.map((session) => (
        <SessionCard key={session.id} session={session} onChanged={onChanged} />
      ))}
      <NewSessionForm course={course} onCreated={onChanged} />
    </div>
  );
}
