// Configuration i18n centrale.
// Source de vérité unique pour la liste des locales et la locale par défaut.

export const LOCALES = ["fr", "en", "es"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "fr";

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
