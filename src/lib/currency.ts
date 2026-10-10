/**
 * Formata um valor em Kwanzas, ex.: 85000 → "85.000 Kz".
 *
 * Formatação manual (sem Intl) para que servidor e navegador gerem
 * exatamente o mesmo texto e não haja erro de hidratação.
 */
export function formatKz(value: number): string {
  const rounded = Math.round(value);
  const digits = Math.abs(rounded)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return `${rounded < 0 ? "-" : ""}${digits} Kz`;
}
