// Home : charte v2 en FR et ES (./_home/HomeV2.tsx). L'anglais garde
// l'ancienne home (./_home/LegacyHomeEn.tsx) : la v2 n'a pas de version EN.
// Métadonnées SEO : generateMetadata du layout de locale.

import { hasLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { HomeV2 } from "./_home/HomeV2";
import { LegacyHome } from "./_home/LegacyHomeEn";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const raw = (await params).locale;
  const locale: Locale = hasLocale(raw) ? raw : DEFAULT_LOCALE;
  return locale === "en" ? <LegacyHome locale="en" /> : <HomeV2 locale={locale} />;
}
