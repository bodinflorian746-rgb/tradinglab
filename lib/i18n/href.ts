// Helper de préfixage d'href par la locale courante.
//
// Idempotent : un href déjà localisé (/fr/..., /en/..., /es/...) est renvoyé
// tel quel. Les hrefs externes (http://, https://, mailto:, #ancre) sont
// renvoyés inchangés.

import { LOCALES, type Locale } from "@/i18n/config";

const LOCALE_PREFIX_RE = new RegExp(`^/(?:${LOCALES.join("|")})(?:/|$)`);

export function localizedHref(path: string, locale: Locale): string {
  if (!path) return path;
  // Externes & ancres : on touche pas
  if (/^([a-z]+:|#|\/\/)/i.test(path)) return path;
  // Doit commencer par "/" pour être un chemin interne préfixable
  if (!path.startsWith("/")) return path;
  // Déjà préfixé : tel quel
  if (LOCALE_PREFIX_RE.test(path)) return path;
  // Cas "/" → "/{locale}"
  if (path === "/") return `/${locale}`;
  return `/${locale}${path}`;
}

// Variante helper : retourne le chemin SANS préfixe locale (utile pour le
// language switcher qui doit pouvoir reconstruire le pathname dans une autre
// locale). "/fr/formations/debutant" → "/formations/debutant".
export function stripLocalePrefix(path: string): string {
  const match = path.match(LOCALE_PREFIX_RE);
  if (!match) return path;
  const rest = path.slice(match[0].length);
  return rest.startsWith("/") ? rest : `/${rest}`;
}
