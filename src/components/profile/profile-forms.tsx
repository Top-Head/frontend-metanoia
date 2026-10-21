"use client";

import { useState, type FormEvent } from "react";
import clsx from "clsx";
import { Phone, User } from "lucide-react";
import toast from "react-hot-toast";
import { SpecialtyPicker } from "@/components/auth/_components/register-components/specialty-picker";
import { Spinner, buttonClass } from "@/components/app/ui";
import FormInput from "@/components/ui/form-input";
import { ApiError } from "@/lib/api/client";
import type { Mentor, Student } from "@/lib/api/types";
import { saveMentorProfile, saveStudentProfile } from "@/services/profile.service";

const textareaClass =
  "w-full resize-y rounded-lg border bg-panel px-3 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:ring-1";

function Textarea({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  rows = 4,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
  rows?: number;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-ink">
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={clsx(
          textareaClass,
          error ? "border-danger focus:ring-danger" : "border-line-strong focus:border-primary focus:ring-primary"
        )}
      />
      {error && <p className="mt-1.5 text-xs font-medium text-danger">{error}</p>}
    </div>
  );
}

function handleError(reason: unknown, setErrors: (errors: Record<string, string>) => void) {
  if (reason instanceof ApiError) {
    setErrors(reason.fieldErrors);
    toast.error(reason.message);
  } else {
    toast.error("Não foi possível guardar o perfil.");
  }
}

interface FormProps<T> {
  initial?: Partial<T> | null;
  create?: boolean;
  submitLabel: string;
  onSaved: (profile: T) => void;
}

export function MentorProfileForm({ initial, create = false, submitLabel, onSaved }: FormProps<Mentor>) {
  const [name, setName] = useState(initial?.name ?? "");
  const [bio, setBio] = useState(initial?.bio ?? "");
  const [experience, setExperience] = useState(initial?.experience_description ?? "");
  const [specialties, setSpecialties] = useState<number[]>(initial?.specialties ?? []);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) {
      setErrors({ name: "Informe o nome que os alunos vão ver." });
      return;
    }
    setErrors({});
    setIsSaving(true);
    try {
      const saved = await saveMentorProfile(
        { name: name.trim(), bio: bio.trim(), experience_description: experience.trim(), specialties },
        create
      );
      onSaved(saved);
    } catch (reason) {
      handleError(reason, setErrors);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <FormInput
        label="Nome público"
        icon={<User size={18} />}
        maxLength={150}
        value={name}
        error={errors.name}
        onChange={(event) => setName(event.target.value)}
      />
      <SpecialtyPicker value={specialties} onChange={setSpecialties} error={errors.specialties} />
      <Textarea
        id="mentor-bio"
        label="Bio"
        value={bio}
        onChange={setBio}
        error={errors.bio}
        placeholder="Uma apresentação curta que aparece no seu perfil e nas suas aulas."
      />
      <Textarea
        id="mentor-experience"
        label="Experiência profissional"
        value={experience}
        onChange={setExperience}
        error={errors.experience_description}
        placeholder="Onde trabalhou, há quantos anos atua, principais resultados..."
      />
      <button type="submit" disabled={isSaving} className={buttonClass("primary")}>
        {isSaving && <Spinner />}
        {submitLabel}
      </button>
    </form>
  );
}

export function StudentProfileForm({ initial, create = false, submitLabel, onSaved }: FormProps<Student>) {
  const [name, setName] = useState(initial?.name ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [bio, setBio] = useState(initial?.bio ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) {
      setErrors({ name: "Informe o seu nome." });
      return;
    }
    setErrors({});
    setIsSaving(true);
    try {
      const saved = await saveStudentProfile({ name: name.trim(), phone: phone.trim(), bio: bio.trim() }, create);
      onSaved(saved);
    } catch (reason) {
      handleError(reason, setErrors);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormInput
          label="Nome"
          icon={<User size={18} />}
          maxLength={150}
          autoComplete="name"
          value={name}
          error={errors.name}
          onChange={(event) => setName(event.target.value)}
        />
        <FormInput
          label="Telefone (opcional)"
          type="tel"
          icon={<Phone size={18} />}
          maxLength={32}
          autoComplete="tel"
          placeholder="+244 9XX XXX XXX"
          value={phone}
          error={errors.phone}
          onChange={(event) => setPhone(event.target.value)}
        />
      </div>
      <Textarea
        id="student-bio"
        label="Sobre você (opcional)"
        value={bio}
        onChange={setBio}
        error={errors.bio}
        rows={3}
        placeholder="O que quer aprender ou alcançar?"
      />
      <button type="submit" disabled={isSaving} className={buttonClass("primary")}>
        {isSaving && <Spinner />}
        {submitLabel}
      </button>
    </form>
  );
}
