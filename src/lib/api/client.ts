import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
} from "./tokens";

export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
).replace(/\/$/, "");

export const SESSION_EXPIRED_EVENT = "metanoia:session-expired";

declare module "axios" {
  interface AxiosRequestConfig {
    /** true para endpoints públicos que não devem enviar o token. */
    skipAuth?: boolean;
  }
}

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retried?: boolean;
}

/**
 * Erro da API com as mensagens do Django REST Framework já extraídas.
 * `fieldErrors` mapeia campo → primeira mensagem (ex.: { email: "..." }).
 */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly fieldErrors: Record<string, string> = {}
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Instância do axios usada por todos os serviços. */
export const api = axios.create({
  baseURL: API_URL,
  headers: { Accept: "application/json" },
  // O DRF espera arrays repetidos: ?specialties=1&specialties=2
  paramsSerializer: { indexes: null },
});

api.interceptors.request.use((config) => {
  const token = config.skipAuth ? null : getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* Renovação do token compartilhada entre requisições simultâneas. */
let refreshing: Promise<string | null> | null = null;

function refreshAccessToken(): Promise<string | null> {
  const refresh = getRefreshToken();
  if (!refresh) return Promise.resolve(null);

  // axios "puro": não passa pelos interceptores da instância.
  refreshing ??= axios
    .post<{ access: string }>(`${API_URL}/api/auth/refresh/`, { refresh })
    .then(({ data }) => {
      setAccessToken(data.access);
      return data.access;
    })
    .catch(() => null)
    .finally(() => {
      refreshing = null;
    });

  return refreshing;
}

function firstMessage(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return firstMessage(value[0]);
  return undefined;
}

async function toApiError(error: AxiosError): Promise<ApiError> {
  if (!error.response) {
    return new ApiError("Não foi possível conectar ao servidor. Verifique sua conexão.", 0);
  }

  const { status } = error.response;
  let data: unknown = error.response.data;
  // Pedidos com responseType "blob" recebem também os erros como Blob.
  if (typeof Blob !== "undefined" && data instanceof Blob) {
    try {
      data = JSON.parse(await data.text());
    } catch {
      data = null;
    }
  }
  const fieldErrors: Record<string, string> = {};
  let message: string | undefined;

  if (data && typeof data === "object" && !Array.isArray(data)) {
    for (const [key, value] of Object.entries(data)) {
      const text = firstMessage(value);
      if (!text) continue;
      if (key === "detail" || key === "non_field_errors") message ??= text;
      else fieldErrors[key] = text;
    }
  }

  message ??= Object.values(fieldErrors)[0];
  message ??=
    status >= 500
      ? "O servidor encontrou um erro. Tente novamente em instantes."
      : `Não foi possível concluir a operação (${status}).`;

  return new ApiError(message, status, fieldErrors);
}

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) throw error;

    const config = error.config as RetriableConfig | undefined;
    const canRefresh =
      error.response?.status === 401 &&
      config &&
      !config.skipAuth &&
      !config._retried &&
      getRefreshToken();

    if (canRefresh) {
      config._retried = true;
      const access = await refreshAccessToken();

      if (access) {
        config.headers.Authorization = `Bearer ${access}`;
        return api(config);
      }

      clearTokens();
      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
    }

    throw await toApiError(error);
  }
);
