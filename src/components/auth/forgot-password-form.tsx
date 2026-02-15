import { JSX } from "react";
import { Header } from "./_components/forgot-password-components/header";
import { RecoveryForm } from "./_components/forgot-password-components/recovery-form";

export default function ForgotPassword(): JSX.Element {
  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <Header />

      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-[420px] bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8">
          <RecoveryForm />
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-slate-400 dark:text-slate-600">
        © 2024 Metanoia Academy. All rights reserved.
      </footer>
    </div>
  );
}