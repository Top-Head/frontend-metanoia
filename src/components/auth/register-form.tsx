"use client";

import { JSX, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";
import { ArrowRight, Brain, GraduationCap, Mail, Phone, User } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import FormInput from "../ui/form-input";
import PasswordInput from "../ui/password-input";
import LeftSection from "./_components/login-components/left-section";
import { SpecialtyPicker } from "./_components/register-components/specialty-picker";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/lib/api/client";
import type { RegisterPayload } from "@/lib/api/types";
import { homePathFor } from "@/services/auth.service";

type Role = "aluno" | "mentor";

const ROLES: Array<{ value: Role; label: string; icon: typeof Brain }> = [
  { value: "aluno", label: "Quero aprender", icon: GraduationCap },
  { value: "mentor", label: "Quero ensinar", icon: Brain },
];

const MIN_PASSWORD = 8;

function withoutKey(errors: Record<string, string>, key: string) {
  const next = { ...errors };
  delete next[key];
  return next;
}

const textareaClass =
  "w-full resize-none rounded-lg border bg-panel px-3 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:ring-1";

export default function RegistrationPage(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signUp } = useAuth();

  const [role, setRole] = useState<Role>(
    searchParams.get("papel") === "mentor" ? "mentor" : "aluno"
  );
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirm: "",
    bio: "",
    experience_description: "",
  });
  const [specialties, setSpecialties] = useState<number[]>([]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isMentor = role === "mentor";

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => withoutKey(current, field));
  }

  function validate() {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Informe o seu nome.";
    if (!form.email.trim()) next.email = "Informe o seu e-mail.";
    if (form.password.length < MIN_PASSWORD)
      next.password = `A senha precisa de pelo menos ${MIN_PASSWORD} caracteres.`;
    if (form.password_confirm !== form.password)
      next.password_confirm = "As senhas não coincidem.";
    if (!acceptedTerms) next.terms = "É preciso aceitar os termos para continuar.";
    return next;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      toast.error("Revise os campos destacados.");
      return;
    }

    const payload: RegisterPayload = {
      role: isMentor ? "MENTOR" : "STUDENT",
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      password_confirm: form.password_confirm,
      ...(form.phone.trim() && { phone: form.phone.trim() }),
      ...(form.bio.trim() && { bio: form.bio.trim() }),
      ...(isMentor && {
        specialties,
        ...(form.experience_description.trim() && {
          experience_description: form.experience_description.trim(),
        }),
      }),
    };

    setIsSubmitting(true);

    try {
      const user = await signUp(payload);
      toast.success("Conta criada com sucesso!");
      router.replace(isMentor ? homePathFor(user) : "/aluno/onboarding");
    } catch (error) {
      if (error instanceof ApiError) {
        setErrors(error.fieldErrors);
        toast.error(error.message);
      } else {
        toast.error("Não foi possível criar a conta. Tente novamente.");
      }
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex h-screen w-full overflow-hidden bg-canvas">
      <LeftSection />

      <div className="flex w-full flex-col items-center overflow-y-auto bg-panel p-6 md:p-10 lg:w-1/2 lg:p-14">
        <div className="my-auto w-full max-w-md">
          <div className="mb-8">
            <h1 className="mb-1 text-2xl font-bold text-ink xl:text-3xl">
              {isMentor
                ? "Junte-se à Academia Metanoia como Mentor"
                : "Crie a sua conta na Academia Metanoia"}
            </h1>
            <p className="text-ink-soft">
              {isMentor
                ? "Compartilhe sua experiência e inspire a próxima geração de aprendizes."
                : "Encontre aulas com especialistas e acelere o seu crescimento."}
            </p>
          </div>

          <div
            role="radiogroup"
            aria-label="Tipo de conta"
            className="mb-6 grid grid-cols-2 gap-1 rounded-xl bg-canvas p-1"
          >
            {ROLES.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={role === value}
                onClick={() => setRole(value)}
                className={clsx(
                  "flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition-all",
                  role === value
                    ? "bg-panel text-primary shadow-card"
                    : "text-ink-soft hover:text-ink"
                )}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <FormInput
              label="Nome completo"
              placeholder="ex. João da Silva"
              autoComplete="name"
              icon={<User size={18} />}
              value={form.name}
              error={errors.name}
              onChange={(event) => update("name", event.target.value)}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormInput
                label="E-mail"
                placeholder="nome@email.com"
                type="email"
                autoComplete="email"
                icon={<Mail size={18} />}
                value={form.email}
                error={errors.email}
                onChange={(event) => update("email", event.target.value)}
              />
              <FormInput
                label="Telefone (opcional)"
                placeholder="+244 9XX XXX XXX"
                type="tel"
                autoComplete="tel"
                icon={<Phone size={18} />}
                value={form.phone}
                error={errors.phone}
                onChange={(event) => update("phone", event.target.value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <PasswordInput
                autoComplete="new-password"
                placeholder={`Mínimo de ${MIN_PASSWORD} caracteres`}
                value={form.password}
                error={errors.password}
                onChange={(event) => update("password", event.target.value)}
              />
              <PasswordInput
                label="Confirmar senha"
                autoComplete="new-password"
                placeholder="Repita a senha"
                value={form.password_confirm}
                error={errors.password_confirm}
                onChange={(event) => update("password_confirm", event.target.value)}
              />
            </div>

            {isMentor && (
              <>
                <SpecialtyPicker
                  value={specialties}
                  onChange={setSpecialties}
                  error={errors.specialties}
                />

                <div>
                  <label htmlFor="register-experience" className="mb-2 block text-sm font-bold text-ink">
                    Experiência profissional
                  </label>
                  <textarea
                    id="register-experience"
                    rows={3}
                    placeholder="Onde trabalhou, há quantos anos atua, principais resultados..."
                    value={form.experience_description}
                    onChange={(event) => update("experience_description", event.target.value)}
                    className={clsx(
                      textareaClass,
                      errors.experience_description
                        ? "border-danger focus:ring-danger"
                        : "border-line-strong focus:border-primary focus:ring-primary"
                    )}
                  />
                  {errors.experience_description && (
                    <p className="mt-1.5 text-xs font-medium text-danger">
                      {errors.experience_description}
                    </p>
                  )}
                </div>
              </>
            )}

            <div>
              <label htmlFor="register-bio" className="mb-2 block text-sm font-bold text-ink">
                {isMentor ? "Bio" : "Sobre você"}{" "}
                <span className="font-normal text-ink-faint">(opcional)</span>
              </label>
              <textarea
                id="register-bio"
                rows={3}
                placeholder={
                  isMentor
                    ? "Uma apresentação curta que os alunos verão no seu perfil."
                    : "O que você quer aprender ou alcançar?"
                }
                value={form.bio}
                onChange={(event) => update("bio", event.target.value)}
                className={clsx(
                  textareaClass,
                  errors.bio
                    ? "border-danger focus:ring-danger"
                    : "border-line-strong focus:border-primary focus:ring-primary"
                )}
              />
              {errors.bio && (
                <p className="mt-1.5 text-xs font-medium text-danger">{errors.bio}</p>
              )}
            </div>

            <div>
              <div className="flex items-start gap-2">
                <input
                  id="terms"
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(event) => {
                    setAcceptedTerms(event.target.checked);
                    setErrors((current) => withoutKey(current, "terms"));
                  }}
                  aria-invalid={errors.terms ? true : undefined}
                  className="mt-1 size-5 rounded accent-primary"
                />
                <label htmlFor="terms" className="text-sm text-ink-soft">
                  Concordo com os{" "}
                  <Link href="/termos" className="font-medium text-primary hover:underline">
                    Termos de Serviço
                  </Link>{" "}
                  e a{" "}
                  <Link href="/privacidade" className="font-medium text-primary hover:underline">
                    Política de Privacidade
                  </Link>
                  .
                </label>
              </div>
              {errors.terms && (
                <p className="mt-1.5 text-xs font-medium text-danger">{errors.terms}</p>
              )}
            </div>

            <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full">
              Criar conta
              {!isSubmitting && <ArrowRight size={18} />}
            </Button>
          </form>

          <p className="mt-6 text-center text-ink-soft">
            Já tem uma conta?{" "}
            <Link href="/auth/login" className="ml-1 font-bold text-primary hover:underline">
              Entre aqui
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
