"use client";

import { RequireAuth } from "@/components/auth/require-auth";
import { AppShell } from "@/components/dashboard/app-shell";
import Message from "@/components/message/message";
import { useAuth } from "@/hooks/useAuth";

function MessagesWorkspace() {
  const { isMentor } = useAuth();
  return (
    <AppShell area={isMentor ? "mentor" : "student"} bleed>
      <Message />
    </AppShell>
  );
}

export default function MessagesPage() {
  return (
    <RequireAuth>
      <MessagesWorkspace />
    </RequireAuth>
  );
}
