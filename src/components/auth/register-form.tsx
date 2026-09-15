"use client";

import { JSX, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, Verified, CreditCard, Users } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import FormInput from "../ui/form-input";
import PasswordInput from "../ui/password-input";
import { Footer, SelectInput, TermsCheckbox, TrustCard } from "../ui/select-input";
import { Header } from "./_components/register-components/header";
import { ProgressBar } from "./_components/register-components/progress-bar";

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
    <div className="flex min-h-screen flex-col bg-canvas">
      <Header />

      <main className="flex flex-1 justify-center px-4 py-8">
        <div className="flex w-full max-w-lg flex-col">
          <ProgressBar progressPercentage={50} />

          <div className="mb-6 text-center">
            <h1 className="mb-2 text-2xl font-bold text-ink md:text-3xl">
              Junte-se à Academia Metanoia como Mentor
            </h1>
            <p className="mx-auto max-w-md text-sm text-ink-soft">
              Compartilhe sua experiência e inspire a próxima geração de
              aprendizes.
            </p>
          </div>

          <div className="rounded-xl border border-line bg-panel shadow-card">
            <form className="flex flex-col gap-5 p-6" onSubmit={handleSubmit}>
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

              <p className="text-center text-sm text-ink-soft">
                Já tem uma conta de mentor?{" "}
                <Link
                  href="/auth/login"
                  className="font-bold text-primary hover:underline"
                >
                  Entre aqui
                </Link>
              </p>
            </form>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <TrustCard
              icon={<Verified size={28} />}
              title="Especialistas verificados"
              description="Entre em uma comunidade selecionada de profissionais."
            />
            <TrustCard
              icon={<CreditCard size={28} />}
              title="Ganhos flexíveis"
              description="Defina seus honorários e sua agenda."
            />
            <TrustCard
              icon={<Users size={28} />}
              title="Impacto global"
              description="Ajude estudantes de mais de 50 países."
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}