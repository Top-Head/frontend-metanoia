import { Suspense } from "react";
import { RedirectIfAuthenticated } from "@/components/auth/require-auth";
import type { Metadata } from "next";
import RegistrationPage from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Criar Conta",
  description: "Crie a sua conta de aluno ou mentor na Academia Metanoia.",
};

export default function Cadastro() {
  return (
    <RedirectIfAuthenticated>
      <Suspense>
        <RegistrationPage />
      </Suspense>
    </RedirectIfAuthenticated>
  );
}
