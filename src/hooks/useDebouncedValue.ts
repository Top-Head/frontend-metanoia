"use client";

import { useEffect, useState } from "react";

/** Devolve `value` só depois de `delay` ms sem alterações (ex.: busca ao digitar). */
export function useDebouncedValue<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timeout);
  }, [value, delay]);

  return debounced;
}
