export type UserRole = "student" | "mentor";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  expertise: string;
}

export interface AuthenticatedUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
}

/**
 * Camada de acesso à API de autenticação.
 *
 * TODO: definir a base URL via NEXT_PUBLIC_API_URL e integrar
 * com o backend real (endpoints REST + fluxo de tokens).
 */
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Requisição falhou (${response.status}).`);
  }

  return response.json() as Promise<T>;
}

export async function login(payload: LoginPayload): Promise<AuthenticatedUser> {
  return request<AuthenticatedUser>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function register(
  payload: RegisterPayload
): Promise<AuthenticatedUser> {
  return request<AuthenticatedUser>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function requestPasswordReset(email: string): Promise<void> {
  await request("/api/auth/password/reset", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}