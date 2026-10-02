// Rounds du jeu jouable du héros (BUY / SELL / NO TRADE) : calculés côté
// serveur avec le vrai générateur du jeu (buildChart, graines fixes) et sa
// vraie notation (scoreChoice). Seules les données du graphique, les textes et
// le résultat de chaque choix partent vers le client : le module du jeu n'est
// pas embarqué dans la page, et rien n'est jamais écrit (ni points, ni profil).
//
// Rounds choisis pour la lisibilité dans un petit cadre : les bougies occupent
// tout le cadre, la zone reste proportionnée (7 à 18 % de la hauteur), et les
// bonnes réponses varient (2 BUY, 2 SELL, 2 NO TRADE).

import type { Candle, ChartZone, GameChoice, HtfBias, MacroContext, SetupKey } from "@/lib/games/buy-sell-no-trade";
import * as BsntFr from "@/lib/games/buy-sell-no-trade";
import * as BsntEs from "@/lib/games/buy-sell-no-trade-es";
import type { HomeLocale } from "./strings";

export interface HeroRound {
  key: string;
  past: Candle[];
  future: Candle[];
  zones: ChartZone[];
  correct: GameChoice;
  context: string;
  htf: HtfBias;
  macro: MacroContext;
  /** Explication courte : 1re phrase de l’explication du jeu pour ce choix (sans ✓ / ✗ / ≈) */
  explanations: Record<GameChoice, string>;
  /** Résultat de scoreChoice pour chaque choix */
  isCorrect: Record<GameChoice, boolean>;
}

const ROUNDS: { id: SetupKey; seed: number }[] = [
  { id: "pullback_bullish_trend", seed: 7919 },
  { id: "rejection_resistance", seed: 213813 },
  { id: "weak_breakout", seed: 791900 },
  { id: "bounce_support", seed: 2217320 },
  { id: "false_breakout_bullish", seed: 7919 },
  { id: "trade_before_news", seed: 7919 },
];

const CTX = { asset: "EUR/USD", session: "Londres" } as const;
const CHOICES: GameChoice[] = ["BUY", "SELL", "NO_TRADE"];

const firstSentence = (text: string) => {
  const i = text.indexOf(". ");
  return i === -1 ? text : text.slice(0, i + 1);
};
const stripMark = (text: string) => text.replace(/^[✓✗≈]\s*/, "");

export function buildHeroRounds(locale: HomeLocale): HeroRound[] {
  const G = locale === "es" ? BsntEs : BsntFr;
  return ROUNDS.map(({ id, seed }) => {
    const t = G.SCENARIO_TEMPLATES.find((x) => x.id === id)!;
    const chart = G.buildChart(id, seed, "normale", "intermediate", CTX);
    return {
      key: `${id}:${seed}`,
      past: chart.past,
      future: chart.future,
      zones: chart.zones,
      correct: t.correctAnswer,
      // Contexte affiché par le jeu au niveau intermédiaire
      context: t.shortContext ?? firstSentence(t.context),
      htf: t.htfBias,
      macro: t.macroContext,
      explanations: Object.fromEntries(CHOICES.map((c) => [c, firstSentence(stripMark(t.rationales[c]))])) as Record<GameChoice, string>,
      isCorrect: Object.fromEntries(CHOICES.map((c) => [c, BsntFr.scoreChoice(c, t.correctAnswer, 0).correct])) as Record<GameChoice, boolean>,
    };
  });
}
