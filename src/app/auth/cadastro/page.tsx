import RegistrationPage from "@/components/auth/register-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cadastro | Metanoia Academy",
  description: "Cadastro para acessar o dashboard de mentoria e cursos.",
};

export default function Cadastro() {
  return (
    <>
     <RegistrationPage />
    </>
  )
}