/**
 * Combina múltiples nombres de clase de forma segura
 * Útil para manejar clases condicionales con Tailwind CSS
 */
export function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes
    .filter((cls) => typeof cls === 'string')
    .join(' ')
    .trim()
}
