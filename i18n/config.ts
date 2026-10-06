// Configuration i18n centrale.
// Source de vérité unique pour la liste des locales et la locale par défaut.

export const LOCALES = ["fr", "en", "es"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "fr";

/**
 * Langues ouvertes aux visiteurs : LE réglage pour (dés)activer une langue.
 * Une langue de LOCALES absente d'ici : /<langue>/... redirige en permanent
 * vers /fr/... (proxy.ts, y compris avec une préférence enregistrée), elle sort
 * du sitemap et des hreflang, et le sélecteur de langue disparaît s'il ne reste
 * qu'une langue. Dictionnaires, contenus et fichiers -en / -es restent dans le
 * dépôt : pour réactiver, rajouter la langue ici.
 * Décision PO du 2026-10-07 : français uniquement.
 */
export const ACTIVE_LOCALES: readonly Locale[] = ["fr"];

export function isActiveLocale(value: string): value is Locale {
  return (ACTIVE_LOCALES as readonly string[]).includes(value);
}

export const LOCALE_COOKIE = "tradinglab_locale";

// Chaîne de fallback par locale (utilisée par getDictionary).
// es → en → fr / en → fr / fr → fr
export const FALLBACK_CHAIN: Record<Locale, readonly Locale[]> = {
  fr: ["fr"],
  en: ["en", "fr"],
  es: ["es", "en", "fr"],
};

export function hasLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
