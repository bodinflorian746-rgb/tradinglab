import "../globals.css";
import { Inter } from "next/font/google";
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import { OnboardingOverlay } from "@/app/components/OnboardingOverlay";
import { StickyLessonNav } from "@/app/components/StickyLessonNav";
import { LocaleProvider } from "@/app/components/LocaleProvider";
import { LOCALES, DEFAULT_LOCALE, hasLocale, type Locale } from "@/i18n/config";
import { getAllDictionaries } from "@/i18n/dictionaries";
import { SITE_URL } from "@/i18n/site";

const inter = Inter({ subsets: ["latin"], display: "swap" });

// Pré-rendu statique des 3 locales.
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

// Hreflang + canonical + metadata par locale.
// Étape 2/3 INFRA : title/description encore FR pour toutes les locales —
// la localisation des libellés sera faite à l'étape 4 (chrome global FR→dico).
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale: Locale = hasLocale(locale) ? locale : DEFAULT_LOCALE;

  const languages = LOCALES.reduce(
    (acc, l) => {
      acc[l] = `${SITE_URL}/${l}`;
      return acc;
    },
    {} as Record<string, string>,
  );
  // x-default → FR (locale racine)
  languages["x-default"] = `${SITE_URL}/${DEFAULT_LOCALE}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: "TradeScaleX – Apprends le trading comme un pro",
    description: "La plateforme d'apprentissage du trading la plus complète.",
    alternates: {
      canonical: `${SITE_URL}/${safeLocale}`,
      languages,
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  // Précharge les 8 namespaces côté serveur — sérialisés dans le HTML pour
  // hydrater le DictionaryProvider client. Fallback automatique vers FR pour
  // les clés manquantes en EN/ES.
  const dicts = await getAllDictionaries(locale);

  return (
    <html lang={locale} className={inter.className}>
      <body className="bg-zinc-950 text-white antialiased">
        <LocaleProvider locale={locale} dicts={dicts}>
          <Navbar />

          {children}

          {/* Onboarding overlay — première visite uniquement */}
          <OnboardingOverlay />

          {/* Sticky nav mobile sur les pages de leçons (auto-détection via pathname) */}
          <StickyLessonNav />
        </LocaleProvider>
      </body>
    </html>
  );
}
