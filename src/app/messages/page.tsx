"use client";

import { RequireAuth } from "@/components/auth/require-auth";
import Message from "@/components/message/message";

export default function MessagesPage() {
  return (
    <RequireAuth>
      <Message />
    </RequireAuth>
  );
}
