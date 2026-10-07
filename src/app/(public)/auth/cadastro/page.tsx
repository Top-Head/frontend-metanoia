import RegistrationPage from "@/components/auth/register-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Criar Conta",
  description: "Crie sua conta de mentor na Academia Metanoia.",
};

export default function Cadastro() {
  return (
    <>
     <RegistrationPage />
    </>
  )
}