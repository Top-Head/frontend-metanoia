import { Metadata } from "next";
import ForgotPassword from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Recuperar Senha",
  description: "Recupere o acesso à sua conta da Academia Metanoia.",
};

export default function ForgotPasswordPage () {
    return (
        <>
            <ForgotPassword />
        </>
    )
}