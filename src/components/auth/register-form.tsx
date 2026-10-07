"use client";

import { JSX, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import FormInput from "../ui/form-input";
import PasswordInput from "../ui/password-input";
import { SelectInput, TermsCheckbox } from "../ui/select-input";
import LeftSection from "./_components/login-components/left-section";

export default function RegistrationPage(): JSX.Element {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [expertise, setExpertise] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!fullName || !email || !expertise) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    setIsSubmitting(true);

    // TODO: substituir pela integração real com a API de cadastro.
    await new Promise((resolve) => setTimeout(resolve, 900));
    toast.success("Conta criada com sucesso!");
    setIsSubmitting(false);
  }

  return (
    <main className="flex h-screen w-full overflow-hidden bg-canvas">
      <LeftSection />

      <div className="flex w-full flex-col items-center justify-center overflow-y-auto bg-panel p-6 md:p-10 lg:w-1/2 lg:p-14">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="mb-1 text-2xl font-bold text-ink xl:text-3xl">
              Junte-se à Academia Metanoia como Mentor
            </h1>
            <p className="text-ink-soft">
              Compartilhe sua experiência e inspire a próxima geração de
              aprendizes.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <FormInput
              label="Nome completo"
              placeholder="ex. João da Silva"
              autoComplete="name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
            />

            <FormInput
              label="E-mail profissional"
              placeholder="joao@empresa.com"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            <PasswordInput autoComplete="new-password" placeholder="Mínimo de 8 caracteres" />

            <SelectInput
              value={expertise}
              onChange={(event) => setExpertise(event.target.value)}
            />

            <TermsCheckbox />

            <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full">
              Continuar para o Perfil
              <ArrowRight size={18} />
            </Button>
          </form>

          <p className="mt-6 text-center text-ink-soft">
            Já tem uma conta de mentor?{" "}
            <Link
              href="/auth/login"
              className="ml-1 font-bold text-primary hover:underline"
            >
              Entre aqui
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}