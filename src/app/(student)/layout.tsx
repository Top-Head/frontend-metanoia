import type { ReactNode } from "react";
import SidebarDashboard from "@/components/dashboard/sidebar";
import { RequireAuth } from "@/components/auth/require-auth";

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAuth role="student">
      <div className="flex min-h-screen flex-col bg-canvas font-sans text-ink md:flex-row">
        <SidebarDashboard area="student" />
        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-6xl px-6 pb-16 pt-8 lg:px-10">{children}</div>
        </main>
      </div>
    </RequireAuth>
  );
}
