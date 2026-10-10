"use client";

import { JSX, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import SocialButton from "./_components/login-components/social-button";
import LeftSection from "./_components/login-components/left-section";

export default function LoginPage(): JSX.Element {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email || !password) {
      toast.error("Informe seu e-mail e senha.");
      return;
    }

    setIsSubmitting(true);

    // TODO: substituir pela integração real com a API de autenticação.
    await new Promise((resolve) => setTimeout(resolve, 900));
    toast.success("Login realizado com sucesso!");
    router.push("/dashboard");
  }

  return (
    <main className="flex h-screen w-full overflow-hidden bg-canvas">
      <LeftSection />

      <div className="flex w-full flex-col items-center justify-center bg-panel p-6 md:p-10 lg:w-1/2 lg:p-14">
        <div className="w-full max-w-md">

          <div className="mb-8">
            <h1 className="mb-1 text-2xl font-bold text-ink xl:text-3xl">
              Bem-vindo de volta
            </h1>
            <p className="text-ink-soft">
              Acesse seu painel de mentoria e seus cursos.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="font-medium text-ink"
              >
                E-mail
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="ex. nome@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-11 w-full rounded-lg border border-line-strong bg-slate-50 px-4 text-ink outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="font-medium text-ink">
                  Senha
                </label>
                <Link
                  href="/auth/recuperar-senha"
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  Esqueceu a senha?
                </Link>
              </div>

              <div className="relative">
                <input
                  id="password"
                  type={isPasswordVisible ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-11 w-full rounded-lg border border-line-strong bg-slate-50 px-4 pr-12 text-ink outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible((visible) => !visible)}
                  aria-label={isPasswordVisible ? "Ocultar senha" : "Mostrar senha"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint transition-colors hover:text-primary"
                >
                  {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              isLoading={isSubmitting}
              className="w-full"
            >
              Entrar no Painel
              <ArrowRight size={18} />
            </Button>
          </form>

          <p className="mt-6 text-center text-ink-soft">
            Não tem uma conta?{" "}
            <Link
              href="/auth/cadastro"
              className="ml-1 font-bold text-primary hover:underline"
            >
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}