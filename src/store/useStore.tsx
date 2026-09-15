"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AuthenticatedUser, UserRole } from "@/services/auth.service";

export interface StoreUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
}

interface StoreState {
  user: AuthenticatedUser | null;
  login: (user: AuthenticatedUser) => void;
  logout: () => void;
}

const StoreContext = createContext<StoreState | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);

  const login = useCallback((next: AuthenticatedUser) => setUser(next), []);
  const logout = useCallback(() => setUser(null), []);

  const value = useMemo(
    () => ({ user, login, logout }),
    [user, login, logout]
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