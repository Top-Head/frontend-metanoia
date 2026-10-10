"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ApiError, SESSION_EXPIRED_EVENT } from "@/lib/api/client";
import { clearTokens, getAccessToken, setTokens } from "@/lib/api/tokens";
import type { TokenEnvelope, User } from "@/lib/api/types";
import { getMe } from "@/services/auth.service";

export type AuthStatus = "loading" | "authenticated" | "anonymous";

interface StoreState {
  user: User | null;
  status: AuthStatus;
  /** Guarda os tokens e o utilizador devolvidos por login/registo. */
  startSession: (envelope: TokenEnvelope) => void;
  /** Volta a buscar /api/me/ (ex.: após editar o perfil). */
  refreshUser: () => Promise<void>;
  /** Termina a sessão. "manual" = o utilizador clicou em Sair. */
  endSession: (reason?: EndReason) => void;
  /** Motivo do último fim de sessão (para decidir o redirecionamento). */
  endReason: EndReason | null;
}

export type EndReason = "manual" | "expired";

const StoreContext = createContext<StoreState | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [endReason, setEndReason] = useState<EndReason | null>(null);

  const endSession = useCallback((reason: EndReason = "manual") => {
    clearTokens();
    setUser(null);
    setEndReason(reason);
    setStatus("anonymous");
  }, []);

  const refreshUser = useCallback(async () => {
    if (!getAccessToken()) {
      setUser(null);
      setStatus("anonymous");
      return;
    }

    try {
      setUser(await getMe());
      setStatus("authenticated");
    } catch (error) {
      // Só descarta os tokens se a API rejeitar a sessão; com o servidor
      // inacessível, mantém-nos para tentar de novo no próximo carregamento.
      if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
        endSession("expired");
      } else {
        setUser(null);
        setStatus("anonymous");
      }
    }
  }, [endSession]);

  const startSession = useCallback(({ access, refresh, user: next }: TokenEnvelope) => {
    setTokens({ access, refresh });
    setUser(next);
    setEndReason(null);
    setStatus("authenticated");
  }, []);

  useEffect(() => {
    // Restaura a sessão a partir dos tokens guardados.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refreshUser();

    const handleExpired = () => endSession("expired");
    window.addEventListener(SESSION_EXPIRED_EVENT, handleExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleExpired);
  }, [refreshUser, endSession]);

  const value = useMemo(
    () => ({ user, status, startSession, refreshUser, endSession, endReason }),
    [user, status, startSession, refreshUser, endSession, endReason]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreState {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error("useStore deve ser usado dentro de <StoreProvider>.");
  }

  return context;
}
