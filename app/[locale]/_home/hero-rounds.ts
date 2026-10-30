// Démo du héros : trois manches courtes, une par jeu (Buy/Sell/No trade, Place ton Stop, Trouve
// l'erreur), calculées côté serveur avec les vrais générateurs des jeux (graines fixes) et leur vraie
// notation. Seules les données du graphique, les textes et le résultat de chaque choix partent vers le
// client : les modules des jeux ne sont pas embarqués dans la page, et rien n'est jamais écrit (ni
// points, ni profil).
//
// Manches choisies pour la lisibilité dans un petit cadre (scripts/audit-jeux : signal avant l'entrée,
// niveaux prouvés par des touches nettes, comme dans les jeux) : bougies sur tout le cadre, zone
// proportionnée, suite qui donne raison à la bonne réponse. L'énoncé décrit la situation sans donner
// la réponse ; le verdict tient en une phrase.

import type { Candle, ChartZone } from "@/lib/games/shared";
import * as Bsnt from "@/lib/games/buy-sell-no-trade";
import * as Ps from "@/lib/games/place-stop";
import * as Ftm from "@/lib/games/find-the-mistake";
import * as Btt from "@/lib/games/build-the-trade";

export type DemoGame = "buy-sell-no-trade" | "place-stop" | "find-the-mistake";

export interface DemoChoice {
  id: string;
  label: string;
  /** Buy/Sell/No trade : couleur du bouton ; Place ton Stop : couleur du stop */
  variant?: "buy" | "sell" | "none";
  color?: string;
}

export interface HeroRound {
  key: string;
  game: DemoGame;
  past: Candle[];
  future: Candle[];
  zones: ChartZone[];
  statement: string;
  /** Bougies futures révélées après le choix (Trouve l'erreur montre le trade en entier, comme le jeu) */
  reveal: boolean;
  entry?: { price: number; direction: "BUY" | "SELL" };
  stops?: { id: string; price: number; color: string; label: string; hit: boolean }[];
  lines?: { price: number; color: string; label: string }[];
  labeledZones?: number[];
  choices: DemoChoice[];
  correct: string;
  /** Verdict d'une phrase pour chaque choix */
  verdicts: Record<string, string>;
}

const CTX = { asset: "EUR/USD", session: "Londres" } as const;

const firstSentence = (text: string) => {
  const i = text.indexOf(". ");
  return i === -1 ? text : text.slice(0, i + 1);
};
const stripMark = (text: string) => text.replace(/^[✓✗≈]\s*/, "");

/** Buy/Sell/No trade : étoile filante sous une résistance touchée deux fois (vente) */
function bsntRound(): HeroRound {
  const id = "deb_etoile_resistance", seed = 287;
  const t = Bsnt.SCENARIO_TEMPLATES.find((x) => x.id === id)!;
  const ch = Bsnt.buildChart(id, seed, "normale", "beginner", CTX);
  const choices: DemoChoice[] = [
    { id: "BUY", label: "BUY", variant: "buy" },
    { id: "SELL", label: "SELL", variant: "sell" },
    { id: "NO_TRADE", label: "NO TRADE", variant: "none" },
  ];
  return {
    key: `${id}:${seed}`, game: "buy-sell-no-trade", past: ch.past, future: ch.future, zones: ch.zones,
    statement: t.context, reveal: true, choices, correct: t.correctAnswer,
    verdicts: Object.fromEntries(choices.map((c) => [c.id, firstSentence(stripMark(t.rationales[c.id as Bsnt.GameChoice]))])),
  };
}

/** Place ton Stop : achat après un marteau sur un support touché deux fois */
const STOP_COLORS: Record<string, string> = { A: "#ef4444", B: "#f59e0b", C: "#a78bfa" };
function psRound(): HeroRound {
  const id = "deb_stop_marteau", seed = 300;
  const t = Ps.PLACE_STOP_TEMPLATES.find((x) => x.id === id)!;
  const ch = Ps.buildPlaceStopChart(id, seed, "normale", "beginner", CTX);
  // Étiquettes spatiales, comme le jeu : Stop 1 en haut, Stop 3 en bas
  const byPrice = [...ch.stops].sort((a, b) => b.price - a.price);
  const label = (sid: string) => `Stop ${byPrice.findIndex((s) => s.id === sid) + 1}`;
  const scored = Object.fromEntries(ch.stops.map((s) => [s.id, Ps.scoreStopChoice(s.id, ch, 0)]));
  const correct = ch.stops.find((s) => scored[s.id].correct)!.id;
  return {
    key: `${id}:${seed}`, game: "place-stop", past: ch.past, future: ch.future, zones: ch.zones,
    statement: t.context, reveal: true, entry: { price: ch.entry, direction: ch.direction },
    stops: byPrice.map((s) => ({ id: s.id, price: s.price, color: STOP_COLORS[s.id], label: label(s.id), hit: scored[s.id].hitMap[s.id] !== null })),
    choices: byPrice.map((s) => ({ id: s.id, label: label(s.id), color: STOP_COLORS[s.id] })),
    correct,
    verdicts: Object.fromEntries(ch.stops.map((s) => [s.id, firstSentence(stripMark(s.rationale))])),
  };
}

/** Trouve l'erreur : achat au toucher d'un support, sans réaction */
function ftmRound(): HeroRound {
  const id = "deb_achat_sans_reaction", seed = 2;
  const t = Ftm.MISTAKE_TEMPLATES.find((x) => x.id === id)!;
  const ch = Ftm.buildScenarioChart(t, seed, "normale", CTX);
  const lines = [
    ...(ch.entry !== undefined ? [{ price: ch.entry, color: "#3b82f6", label: "Entrée" }] : []),
    ...(ch.stop !== undefined ? [{ price: ch.stop, color: "#ef4444", label: "Stop" }] : []),
    ...(ch.tp !== undefined ? [{ price: ch.tp, color: "#10b981", label: "TP" }] : []),
  ];
  // ordre des choix fixe, bonne réponse ni en premier ni en dernier
  const ids = [t.decoyMistakes[0], t.decoyMistakes[1], t.correctMistake, t.decoyMistakes[2]] as Ftm.AnyMistakeId[];
  const explanation = firstSentence(t.explanation);
  return {
    key: `${id}:${seed}`, game: "find-the-mistake", past: ch.past, future: ch.future, zones: ch.zones,
    statement: t.context, reveal: false,
    entry: ch.entry !== undefined ? { price: ch.entry, direction: t.direction === "SELL" ? "SELL" : "BUY" } : undefined,
    lines, labeledZones: Ftm.labeledZoneIndexes(ch.zones, lines.length, t.correctMistake as Ftm.AnyMistakeId),
    choices: ids.map((m) => ({ id: m, label: Ftm.MISTAKE_LABELS[m] })),
    correct: t.correctMistake,
    verdicts: Object.fromEntries(ids.map((m) => [m, explanation])),
  };
}

export function buildHeroRounds(): HeroRound[] {
  return [bsntRound(), psRound(), ftmRound()];
}

/** Nombre de scénarios des 4 jeux (calculé) */
export const SCENARIO_COUNT =
  Bsnt.SCENARIO_TEMPLATES.length + Ps.PLACE_STOP_TEMPLATES.length + Ftm.MISTAKE_TEMPLATES.length + Btt.BUILD_TRADE_TEMPLATES.length;
