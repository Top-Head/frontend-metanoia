import type { Metadata } from "next";
import LoginPage from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login | Metanoia Academy",
  description: "Login para acessar o dashboard de mentoria e cursos.",
};

export default function Login () {
    return (
        <>
         <LoginPage />
        </>
    )
}