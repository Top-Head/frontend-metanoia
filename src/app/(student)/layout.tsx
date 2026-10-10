import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { RequireAuth } from "@/components/auth/require-auth";

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAuth role="student">
      <div className="flex min-h-screen flex-col bg-canvas font-sans text-ink">
        <Header forceSolid />
        <main className="mx-auto w-full max-w-5xl flex-1 px-6 pb-16 pt-28 lg:px-10">
          {children}
        </main>
        <Footer />
      </div>
    </RequireAuth>
  );
}
