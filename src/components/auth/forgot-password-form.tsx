import { JSX } from "react";
import { Header } from "./_components/forgot-password-components/header";
import { RecoveryForm } from "./_components/forgot-password-components/recovery-form";

export default function ForgotPassword(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Header />

      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-md rounded-xl border border-line bg-panel p-6 shadow-card md:p-8">
          <RecoveryForm />
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-ink-faint">
        © {new Date().getFullYear()} Academia Metanoia. Todos os direitos
        reservados.
      </footer>
    </div>
  );
}