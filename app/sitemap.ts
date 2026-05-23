import type { MetadataRoute } from "next";
import { LOCALES, type Locale } from "@/i18n/config";
import { SITE_URL } from "@/i18n/site";
import { FORMATIONS } from "@/lib/formations";
import { STRATEGY_MODULES } from "@/lib/strategies";

// Counts macro (lib/formations.ts ne modélise pas encore les leçons macro —
// counts dupliqués depuis app/components/StickyLessonNav.tsx).
const MACRO_LEVELS = ["debutant", "intermediaire", "avance"] as const;
const MACRO_LESSON_COUNTS: Record<(typeof MACRO_LEVELS)[number], number> = {
  debutant: 6,
  intermediaire: 6,
  avance: 4,
};

const GAMES = ["buy-sell-no-trade", "place-stop", "find-the-mistake", "build-the-trade"];

// Pages publiques top-level (hors leçons / hors dynamique).
const TOP_LEVEL = [
  "",
  "/access",
  "/pricing",
  "/profil-trader",
  "/jeux",
  "/strategies",
  "/formations",
  "/formations/macro",
] as const;

function localePaths(): string[] {
  const paths: string[] = [...TOP_LEVEL];

  // Jeux
  for (const g of GAMES) paths.push(`/jeux/${g}`);

  // Formations trading (debutant/intermediaire/avance) via lib/formations
  for (const f of FORMATIONS) {
    if (f.disabled) continue;
    for (const lesson of f.lessons) {
      // lesson.href est de la forme "/formations/{level}/leconN"
      paths.push(lesson.href);
    }
  }

  // Formations macro (indexes + leçons)
  for (const level of MACRO_LEVELS) {
    paths.push(`/formations/macro/${level}`);
    const count = MACRO_LESSON_COUNTS[level];
    for (let i = 1; i <= count; i++) {
      paths.push(`/formations/macro/${level}/lecon${i}`);
    }
  }

  // Stratégies (indexes + leçons)
  for (const m of STRATEGY_MODULES) {
    paths.push(`/strategies/${m.id}`);
    for (let i = 1; i <= m.lessonCount; i++) {
      paths.push(`/strategies/${m.id}/lecon${i}`);
    }
  }

  return paths;
}

function altLanguages(path: string): Record<Locale, string> {
  return LOCALES.reduce(
    (acc, l) => {
      acc[l] = `${SITE_URL}/${l}${path}`;
      return acc;
    },
    {} as Record<Locale, string>,
  );
}

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = localePaths();
  const entries: MetadataRoute.Sitemap = [];

  for (const path of paths) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date(),
        alternates: { languages: altLanguages(path) },
      });
    }
  }

  return entries;
}
