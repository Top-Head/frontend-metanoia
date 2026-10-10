"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/api/client";

interface QueryState<T> {
  data: T | undefined;
  error: ApiError | null;
  isLoading: boolean;
  /** Volta a executar o pedido (ex.: botão "Tentar de novo"). */
  reload: () => void;
}

/**
 * Executa `fetcher` sempre que `key` muda. Respostas de pedidos antigos
 * são ignoradas, para que filtros alterados rapidamente não mostrem
 * resultados desatualizados. Passe `key = null` para não executar.
 */
export function useApiQuery<T>(key: string | null, fetcher: () => Promise<T>): QueryState<T> {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(key !== null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (key === null) return;
    let active = true;

    setIsLoading(true);
    setError(null);

    fetcher()
      .then((result) => {
        if (active) setData(result);
      })
      .catch((reason: unknown) => {
        if (!active) return;
        setError(
          reason instanceof ApiError
            ? reason
            : new ApiError("Ocorreu um erro inesperado.", 0)
        );
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
    // O fetcher muda a cada render; a key representa as suas dependências.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, attempt]);

  const reload = useCallback(() => setAttempt((current) => current + 1), []);

  return { data, error, isLoading, reload };
}
