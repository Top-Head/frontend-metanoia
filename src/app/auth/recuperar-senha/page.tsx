import { Metadata } from "next";
import ForgotPassword from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Recuperar Senha | Metanoia Academy",
  description: "Recuperação de senha para acessar o dashboard de mentoria e cursos.",
};

export default function ForgotPasswordPage () {
    return (
        <>
            <ForgotPassword />
        </>
    )
}