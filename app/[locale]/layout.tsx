import "../globals.css";
import { Inter } from "next/font/google";
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import { OnboardingOverlay } from "@/app/components/OnboardingOverlay";
import { StickyLessonNav } from "@/app/components/StickyLessonNav";
import { LocaleProvider } from "@/app/components/LocaleProvider";
import { SessionProvider } from "@/app/components/SessionProvider";
import { LOCALES, DEFAULT_LOCALE, hasLocale, type Locale } from "@/i18n/config";
import { getAllDictionaries } from "@/i18n/dictionaries";
import { SITE_URL } from "@/i18n/site";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth/admin";

const inter = Inter({ subsets: ["latin"], display: "swap" });

// Pré-rendu statique des 3 locales.
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

// Hreflang + canonical + metadata + Open Graph par locale.
// title/description sont localisés FR/ES, fallback FR pour toute locale
// inconnue. L'image OG est un placeholder /og-image.png à créer côté design
// avant le lancement (1200×630 conseillé pour Twitter/LinkedIn/Facebook).
const METADATA_COPY: Record<Locale, { title: string; description: string }> = {
  fr: {
    title: "TradeScaleX — La plateforme d'éducation au trading",
    description:
      "Formations, stratégies institutionnelles, macro, jeux interactifs. Pour traders sérieux.",
  },
  en: {
    title: "TradeScaleX — The trading education platform",
    description:
      "Courses, institutional strategies, macro, interactive games. For serious traders.",
  },
  es: {
    title: "TradeScaleX — La plataforma de educación al trading",
    description:
      "Formaciones, estrategias institucionales, macro, juegos interactivos. Para traders serios.",
  },
};

const OG_LOCALE_TAG: Record<Locale, string> = {
  fr: "fr_FR",
  en: "en_US",
  es: "es_ES",
};

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

  const copy = METADATA_COPY[safeLocale];
  const canonical = `${SITE_URL}/${safeLocale}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      type: "website",
      siteName: "TradeScaleX",
      title: copy.title,
      description: copy.description,
      url: canonical,
      locale: OG_LOCALE_TAG[safeLocale],
      alternateLocale: LOCALES.filter((l) => l !== safeLocale).map(
        (l) => OG_LOCALE_TAG[l],
      ),
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: copy.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: copy.description,
      images: ["/og-image.png"],
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

  // Session côté serveur pour hydrater la Navbar (auth-aware sans flicker).
  // isAdmin évalué ici (server-only) car lib/auth/admin lit process.env —
  // jamais exposé côté client, on hydrate juste le boolean dérivé.
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userIsAdmin = isAdmin(user?.email);

  return (
    <html lang={locale} className={inter.className}>
      <body className="bg-zinc-950 text-white antialiased">
        <LocaleProvider locale={locale} dicts={dicts}>
          <SessionProvider initialUser={user} initialIsAdmin={userIsAdmin}>
            <Navbar />

            {children}

            {/* Onboarding overlay — première visite uniquement */}
            <OnboardingOverlay />

            {/* Sticky nav mobile sur les pages de leçons (auto-détection via pathname) */}
            <StickyLessonNav />
          </SessionProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
