"use client";

import { JSX, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, GraduationCap, Brain } from "lucide-react";
import toast from "react-hot-toast";
import { Header } from "./_components/role-components/header";
import { RoleCard } from "./_components/role-components/role-card";
import { Button } from "@/components/ui/button";

type UserRole = "learner" | "mentor" | null;

const ROLE_OPTIONS = [
  {
    value: "learner" as const,
    title: "Quero Aprender",
    description: "Encontre mentores especialistas e acelere seu crescimento.",
    icon: <GraduationCap size={32} />,
  },
  {
    value: "mentor" as const,
    title: "Quero Ensinar",
    description: "Compartilhe sua experiência e construa sua marca.",
    icon: <Brain size={32} />,
  },
];

export default function SelectUserRole(): JSX.Element {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);

  function handleContinue() {
    if (!selectedRole) {
      toast("Escolha um perfil para continuar.", { icon: "👈" });
      return;
    }

    router.push("/auth/cadastro");
  }

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Header />

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-10">
        <div className="flex w-full max-w-3xl flex-col items-center">
          <div className="mb-10 text-center">
            <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              Etapa 1 de 2
            </span>

            <h1 className="mb-3 text-3xl font-bold text-ink md:text-4xl">
              Junte-se à Academia Metanoia
            </h1>

            <p className="mx-auto max-w-md text-base text-ink-soft">
              Como você gostaria de usar a plataforma?
            </p>
          </div>

          <div className="mb-10 grid w-full grid-cols-1 gap-6 md:grid-cols-2">
            {ROLE_OPTIONS.map(({ value, title, description, icon }) => (
              <RoleCard
                key={value}
                title={title}
                description={description}
                icon={icon}
                isSelected={selectedRole === value}
                onSelect={() => setSelectedRole(value)}
              />
            ))}
          </div>

          <div className="flex w-full flex-col items-center gap-4">
            <Button size="lg" className="min-w-72" onClick={handleContinue}>
              Continuar
              <ArrowRight size={18} />
            </Button>

            <p className="text-sm text-ink-soft">
              Já tem uma conta?{" "}
              <Link
                href="/auth/login"
                className="font-semibold text-primary hover:underline"
              >
                Entre aqui
              </Link>
            </p>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-ink-faint">
        © {new Date().getFullYear()} Academia Metanoia. Todos os direitos
        reservados.
      </footer>
    </div>
  );
}