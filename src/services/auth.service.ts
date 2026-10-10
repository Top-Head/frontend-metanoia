import { api } from "@/lib/api/client";
import type {
  LoginPayload,
  RegisterPayload,
  TokenEnvelope,
  User,
} from "@/lib/api/types";

export type { LoginPayload, RegisterPayload, User };

/** POST /api/auth/login/ */
export async function login(payload: LoginPayload) {
  const { data } = await api.post<TokenEnvelope>("/api/auth/login/", payload, {
    skipAuth: true,
  });
  return data;
}

/** POST /api/auth/register/ — devolve tokens, o utilizador já fica autenticado. */
export async function register(payload: RegisterPayload) {
  const { data } = await api.post<TokenEnvelope>("/api/auth/register/", payload, {
    skipAuth: true,
  });
  return data;
}

/** GET /api/me/ */
export async function getMe() {
  const { data } = await api.get<User>("/api/me/");
  return data;
}

export const isMentor = (user: User | null) => Boolean(user?.mentor_profile);
export const isStudent = (user: User | null) => Boolean(user?.student_profile);

export function displayName(user: User | null) {
  return (
    user?.mentor_profile?.name ??
    user?.student_profile?.name ??
    user?.email.split("@")[0] ??
    ""
  );
}

export function homePathFor(user: User | null) {
  return isMentor(user) ? "/dashboard" : "/";
}
