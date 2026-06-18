// Helper getDictionary — chargement lazy d'un namespace avec fallback en
// cascade (es → en → fr / en → fr). Source de vérité = FR.
//
// Usage (server) :
//   const t = await getDictionary(locale, "home");
// Usage (client, via Provider) :
//   useDict("nav")
//
// Pour brancher un nouveau namespace : ajouter un fichier JSON dans
// dictionaries/{fr,en,es}/X.json + entrée dans NAMESPACES + loaders ci-dessous.

import "server-only";
import { FALLBACK_CHAIN, type Locale } from "./config";

// Types dérivés des JSON FR (source de vérité — FR est canonique, EN/ES peuvent
// être partiels et fallback sur FR pour les clés manquantes).
import type frCommon from "../dictionaries/fr/common.json";
import type frNav from "../dictionaries/fr/nav.json";
import type frOnboarding from "../dictionaries/fr/onboarding.json";
import type frPricing from "../dictionaries/fr/pricing.json";
import type frHome from "../dictionaries/fr/home.json";
import type frAccess from "../dictionaries/fr/access.json";
import type frProfile from "../dictionaries/fr/profile.json";
import type frGames from "../dictionaries/fr/games.json";
import type frFormations from "../dictionaries/fr/formations.json";
import type frStrategies from "../dictionaries/fr/strategies.json";
import type frJournal from "../dictionaries/fr/journal.json";

export type Dictionaries = {
  common:     typeof frCommon;
  nav:        typeof frNav;
  onboarding: typeof frOnboarding;
  pricing:    typeof frPricing;
  home:       typeof frHome;
  access:     typeof frAccess;
  profile:    typeof frProfile;
  games:      typeof frGames;
  formations: typeof frFormations;
  strategies: typeof frStrategies;
  journal:    typeof frJournal;
};

export type Namespace = keyof Dictionaries;

export const NAMESPACES = [
  "common",
  "nav",
  "onboarding",
  "pricing",
  "home",
  "access",
  "profile",
  "games",
  "formations",
  "strategies",
  "journal",
] as const satisfies readonly Namespace[];

type LoaderMap = {
  [L in Locale]: {
    [N in Namespace]: () => Promise<Record<string, unknown>>;
  };
};

const loaders: LoaderMap = {
  fr: {
    common:     () => import("../dictionaries/fr/common.json").then((m) => m.default),
    nav:        () => import("../dictionaries/fr/nav.json").then((m) => m.default),
    onboarding: () => import("../dictionaries/fr/onboarding.json").then((m) => m.default),
    pricing:    () => import("../dictionaries/fr/pricing.json").then((m) => m.default),
    home:       () => import("../dictionaries/fr/home.json").then((m) => m.default),
    access:     () => import("../dictionaries/fr/access.json").then((m) => m.default),
    profile:    () => import("../dictionaries/fr/profile.json").then((m) => m.default),
    games:      () => import("../dictionaries/fr/games.json").then((m) => m.default),
    formations: () => import("../dictionaries/fr/formations.json").then((m) => m.default),
    strategies: () => import("../dictionaries/fr/strategies.json").then((m) => m.default),
    journal:    () => import("../dictionaries/fr/journal.json").then((m) => m.default),
  },
  en: {
    common:     () => import("../dictionaries/en/common.json").then((m) => m.default),
    nav:        () => import("../dictionaries/en/nav.json").then((m) => m.default),
    onboarding: () => import("../dictionaries/en/onboarding.json").then((m) => m.default),
    pricing:    () => import("../dictionaries/en/pricing.json").then((m) => m.default),
    home:       () => import("../dictionaries/en/home.json").then((m) => m.default),
    access:     () => import("../dictionaries/en/access.json").then((m) => m.default),
    profile:    () => import("../dictionaries/en/profile.json").then((m) => m.default),
    games:      () => import("../dictionaries/en/games.json").then((m) => m.default),
    formations: () => import("../dictionaries/en/formations.json").then((m) => m.default),
    strategies: () => import("../dictionaries/en/strategies.json").then((m) => m.default),
    journal:    () => import("../dictionaries/en/journal.json").then((m) => m.default),
  },
  es: {
    common:     () => import("../dictionaries/es/common.json").then((m) => m.default),
    nav:        () => import("../dictionaries/es/nav.json").then((m) => m.default),
    onboarding: () => import("../dictionaries/es/onboarding.json").then((m) => m.default),
    pricing:    () => import("../dictionaries/es/pricing.json").then((m) => m.default),
    home:       () => import("../dictionaries/es/home.json").then((m) => m.default),
    access:     () => import("../dictionaries/es/access.json").then((m) => m.default),
    profile:    () => import("../dictionaries/es/profile.json").then((m) => m.default),
    games:      () => import("../dictionaries/es/games.json").then((m) => m.default),
    formations: () => import("../dictionaries/es/formations.json").then((m) => m.default),
    strategies: () => import("../dictionaries/es/strategies.json").then((m) => m.default),
    journal:    () => import("../dictionaries/es/journal.json").then((m) => m.default),
  },
};

type Dict = Record<string, unknown>;

// Deep merge — clés de droite gagnent sur clés de gauche. Les arrays NE sont
// PAS mergés clé par clé : la version la plus à droite (locale demandée)
// remplace entièrement la version fallback. Évite les mismatches d'index si
// EN/ES ont 4 items et FR en a 5.
function deepMerge(target: Dict, source: Dict): Dict {
  const out: Dict = { ...target };
  for (const [key, value] of Object.entries(source)) {
    const existing = out[key];
    if (
      existing &&
      typeof existing === "object" &&
      !Array.isArray(existing) &&
      value &&
      typeof value === "object" &&
      !Array.isArray(value)
    ) {
      out[key] = deepMerge(existing as Dict, value as Dict);
    } else {
      // Arrays + primitives + objets vs non-objets : on prend la valeur de
      // droite (source) si elle est définie, sinon on garde target.
      out[key] = value !== undefined ? value : existing;
    }
  }
  return out;
}

export async function getDictionary<N extends Namespace>(
  locale: Locale,
  namespace: N,
): Promise<Dictionaries[N]> {
  const chain = FALLBACK_CHAIN[locale];
  // Charge fr → ... → locale. Le merge à droite gagne, donc la locale
  // demandée écrase le fallback. Les clés manquantes côté locale conservent
  // la valeur du fallback (= FR au minimum).
  const reversed = [...chain].reverse();
  const dicts = await Promise.all(reversed.map((l) => loaders[l][namespace]()));
  return dicts.reduce<Dict>((acc, d) => deepMerge(acc, d), {}) as Dictionaries[N];
}

// Charge tous les namespaces en une fois — utilisé par le layout root pour
// hydrater le DictionaryProvider côté client.
export async function getAllDictionaries(locale: Locale): Promise<Dictionaries> {
  const entries = await Promise.all(
    NAMESPACES.map(async (ns) => [ns, await getDictionary(locale, ns)] as const),
  );
  return Object.fromEntries(entries) as Dictionaries;
}
