import type { Metadata } from "next";
import NotFound from "../not-found";

// 404 custom localisée pour toute URL non-matchée sous /[locale]/*.
//
// Pourquoi un catch-all qui REND l'UI (plutôt que [locale]/not-found.tsx seul) :
// le root layout est un segment dynamique (app/[locale]/layout.tsx). Per docs
// Next `not-found.js`, les URLs non-matchées ne passent que par le root/global
// not-found, et un boundary not-found (surtout "use client") ne se compose pas
// de façon fiable sous un layout dynamique. Ce catch-all (priorité la plus
// basse) rend donc directement l'UI 404 — À L'INTÉRIEUR de [locale]/layout.tsx
// (LocaleProvider + Navbar), d'où la bonne locale via useLocale().
//
// noindex : la page ne doit jamais être indexée (équivalent du comportement
// 404 de Next côté SEO).
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function CatchAllNotFound() {
  return <NotFound />;
}
