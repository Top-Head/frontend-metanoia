import type { Metadata } from "next";
import LoginPage from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Acesse sua conta e o painel de mentoria da Academia Metanoia.",
};

export default function Login () {
    return (
        <>
         <LoginPage />
        </>
    )
}