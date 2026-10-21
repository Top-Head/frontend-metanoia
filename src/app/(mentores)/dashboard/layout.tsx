import type { ReactNode } from "react";
import { AppShell } from "@/components/dashboard/app-shell";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <AppShell area="mentor">{children}</AppShell>;
}
