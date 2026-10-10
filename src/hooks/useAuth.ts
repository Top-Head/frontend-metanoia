"use client";

import { useCallback } from "react";
import { useStore } from "@/store/useStore";
import {
  isMentor,
  isStudent,
  login as loginRequest,
  register as registerRequest,
  type LoginPayload,
  type RegisterPayload,
} from "@/services/auth.service";

/** Hook de autenticação: sessão atual e ações de login, registo e logout. */
export function useAuth() {
  const { user, status, startSession, refreshUser, endSession, endReason } = useStore();

  const signIn = useCallback(
    async (payload: LoginPayload) => {
      const envelope = await loginRequest(payload);
      startSession(envelope);
      return envelope.user;
    },
    [startSession]
  );

  const signUp = useCallback(
    async (payload: RegisterPayload) => {
      const envelope = await registerRequest(payload);
      startSession(envelope);
      return envelope.user;
    },
    [startSession]
  );

  return {
    user,
    status,
    isAuthenticated: status === "authenticated",
    isMentor: isMentor(user),
    isStudent: isStudent(user),
    signIn,
    signUp,
    signOut: () => endSession("manual"),
    endReason,
    refreshUser,
  };
}
