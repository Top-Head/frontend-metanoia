import type { ReactNode } from "react";
import { RequireAuth } from "@/components/auth/require-auth";
import { AppShell } from "@/components/dashboard/app-shell";

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAuth role="student">
      <AppShell area="student">{children}</AppShell>
    </RequireAuth>
  );
}
