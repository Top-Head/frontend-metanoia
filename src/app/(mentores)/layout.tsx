import type { ReactNode } from "react";
import { RequireAuth } from "@/components/auth/require-auth";

export default function MentorLayout({ children }: { children: ReactNode }) {
  return <RequireAuth role="mentor">{children}</RequireAuth>;
}
