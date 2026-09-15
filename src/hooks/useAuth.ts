import { useCallback } from "react";
import { useStore } from "@/store/useStore";
import {
  login as loginRequest,
  type LoginPayload,
} from "@/services/auth.service";

/**
 * Hook de autenticação.
 *
 * TODO: integrar com a API real (login, sessão/jwt, refresh token)
 * e manter a informação persistida entre recarregamentos.
 */
export function useAuth() {
  const { user, login, logout } = useStore();

  const signIn = useCallback(
    async (payload: LoginPayload) => {
      const authenticated = await loginRequest(payload);
      login(authenticated);
    },
    [login]
  );

  const signOut = useCallback(() => logout(), [logout]);

  return {
    user,
    isAuthenticated: Boolean(user),
    signIn,
    signOut,
  };
}