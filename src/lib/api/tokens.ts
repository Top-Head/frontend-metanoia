const ACCESS_KEY = "metanoia.access";
const REFRESH_KEY = "metanoia.refresh";

export interface Tokens {
  access: string;
  refresh: string;
}

function storage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

export function getAccessToken(): string | null {
  return storage()?.getItem(ACCESS_KEY) ?? null;
}

export function getRefreshToken(): string | null {
  return storage()?.getItem(REFRESH_KEY) ?? null;
}

export function setTokens({ access, refresh }: Tokens) {
  const store = storage();
  store?.setItem(ACCESS_KEY, access);
  store?.setItem(REFRESH_KEY, refresh);
}

export function setAccessToken(access: string) {
  storage()?.setItem(ACCESS_KEY, access);
}

export function clearTokens() {
  const store = storage();
  store?.removeItem(ACCESS_KEY);
  store?.removeItem(REFRESH_KEY);
}
