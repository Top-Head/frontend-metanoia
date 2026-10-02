"use client";

import { JSX, useState, type FormEvent } from "react";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

export function RecoveryForm(): JSX.Element {
  const [emailAddress, setEmailAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);

    // TODO: substituir pela integração real com a API de recuperação de senha.
    await new Promise((resolve) => setTimeout(resolve, 900));
    toast.success("Enviamos um link de redefinição para o seu e-mail.");
    setIsSubmitting(false);
  }

  return (
    <>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold text-ink">Redefinir senha</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Informe seu e-mail e enviaremos um link de redefinição.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="recovery-email"
            className="mb-2 block text-sm font-medium text-ink"
          >
            E-mail
          </label>

          <div className="relative">
            <Mail
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
            />
            <input
              id="recovery-email"
              type="email"
              required
              autoComplete="email"
              value={emailAddress}
              onChange={(event) => setEmailAddress(event.target.value)}
              placeholder="mentor@metanoia.edu"
              className="h-11 w-full rounded-lg border border-line-strong bg-slate-50 pl-10 pr-3 text-sm text-ink outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full">
          Enviar Link de Redefinição
        </Button>
      </form>

      <div className="mt-8 flex justify-center">
        <Link
          href="/auth/login"
          className="flex items-center gap-2 text-sm font-medium text-primary transition-opacity hover:opacity-80"
        >
          <ArrowLeft size={16} />
          Voltar para o Login
        </Link>
      </div>
    </>
  );
}