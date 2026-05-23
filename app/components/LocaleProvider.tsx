"use client";

// Context React qui fournit (a) la locale courante et (b) les dictionnaires
// du chrome au client.
//
// Le provider est monté dans app/[locale]/layout.tsx (serveur) qui charge
// tous les namespaces via getAllDictionaries() et les passe ici. Les enfants
// client utilisent useLocale() et useDict(namespace).
//
// Étape 4 INFRA : on précharge les 8 namespaces. Les dicts sont petits
// (~15-25 KB total au pire) et tout le chrome client en dépend → un seul
// chargement vaut mieux que 8 round-trips.

import { createContext, useContext, type ReactNode } from "react";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import type { Dictionaries, Namespace } from "@/i18n/dictionaries";

interface DictionaryContextValue {
  locale: Locale;
  dicts: Dictionaries | null;
}

const DictionaryContext = createContext<DictionaryContextValue>({
  locale: DEFAULT_LOCALE,
  dicts: null,
});

export function LocaleProvider({
  locale,
  dicts,
  children,
}: {
  locale: Locale;
  dicts: Dictionaries;
  children: ReactNode;
}) {
  return (
    <DictionaryContext.Provider value={{ locale, dicts }}>
      {children}
    </DictionaryContext.Provider>
  );
}

export function useLocale(): Locale {
  return useContext(DictionaryContext).locale;
}

// Récupère un dictionnaire de namespace. Tape précisément le retour à partir
// du JSON FR source de vérité.
export function useDict<N extends Namespace>(namespace: N): Dictionaries[N] {
  const { dicts } = useContext(DictionaryContext);
  if (!dicts) {
    throw new Error(
      `useDict("${namespace}") appelé hors du LocaleProvider. Vérifie que le layout [locale]/layout.tsx wrap bien les children.`,
    );
  }
  return dicts[namespace];
}
