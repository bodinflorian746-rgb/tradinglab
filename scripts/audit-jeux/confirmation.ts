// Signal visible avant toute entrée correcte (règle PO, 2026-10-30) : une entrée sur un niveau n'est une
// bonne réponse que si le graphique montre une réaction ou une confirmation à l'entrée (rejet, engulfing,
// sommet local dépassé, clôture revenue dans le range, breakout confirmé : lib/games/confirmation.ts), assez
// grande pour se voir au premier coup d'œil (amplitude d'au moins 0,6 fois celle des 10 bougies d'avant).
// Entrées contrôlées :
//  - Buy/Sell/No Trade : BUY ou SELL justes, à la dernière clôture ;
//  - Place ton Stop : l'entrée donnée par le scénario ;
//  - Build the Trade : l'entrée agressive quand elle est la bonne (l'entrée sur confirmation attend la bougie
//    suivante) ; le pullback profond juste : réaction visible sur la bougie de l'entrée (le retour au niveau,
//    puis la réaction), sauf ordre limite anticipé, permis en Avancé seulement, avec un stop serré (« Proche »)
//    sous la zone et une explication qui dit l'anticipation (règle PO, 2026-10-30) ;
//  - Trouve l'erreur : l'entrée des scénarios dont l'erreur est ailleurs (stop, taille, objectif…) ;
//    « Entrée sans confirmation » n'est jamais un leurre (elle serait une deuxième bonne réponse là où
//    l'entrée n'a pas de signal), et ses scénarios n'en montrent aucun ;
//  - Démo de la home : les manches Buy/Sell/No Trade et Place ton Stop.
// Usage : npx vite-node -c vitest.config.ts scripts/audit-jeux/confirmation.ts [--autotest] (lancé par run.mjs)
import * as BS from "../../lib/games/buy-sell-no-trade";
import * as PS from "../../lib/games/place-stop";
import * as BT from "../../lib/games/build-the-trade";
import * as FTM from "../../lib/games/find-the-mistake";
import { entrySignal } from "../../lib/games/confirmation";
import type { Candle, ChartZone } from "../../lib/games/shared";
import { buildHeroRounds } from "../../app/[locale]/_home/hero-rounds";
import { auditCtx } from "./market-ctx";

const N = 60;
const VOLS = ["faible", "normale", "élevée"] as const;
const UNCONFIRMED = "entry_unconfirmed";

/** Entrée correcte sans signal visible : message d'erreur, ou null */
export function missingSignal(past: Candle[], dir: "BUY" | "SELL", zones: ChartZone[]): string | null {
  if (entrySignal(past, dir === "BUY" ? 1 : -1, zones)) return null;
  const k = past.slice(-3).map((x) => (x.c >= x.o ? "verte" : "rouge")).join(", ");
  return `${dir} sans réaction ni confirmation (3 dernières bougies : ${k})`;
}

/** Build the Trade, pullback profond en ordre limite anticipé : Avancé, stop serré, anticipation dite */
export function anticipatedError(t: { difficulties: readonly string[]; optimal: { entry: string; stop: string }; optimalExplain: string; anticipated?: true }): string | null {
  if (t.optimal.entry !== "deep_pullback" || !t.anticipated) return null;
  if (t.difficulties.some((d) => d !== "advanced")) return `ordre limite anticipé hors Avancé (${t.difficulties.join(", ")})`;
  if (t.optimal.stop !== "tight") return "ordre limite anticipé sans stop serré (« Proche »)";
  return /anticipée/i.test(t.optimalExplain) ? null : "ordre limite anticipé sans le dire dans l'explication";
}

/** Build the Trade, pullback profond sur réaction : signal visible sur la bougie qui clôture à l'entrée */
export function deepReactionError(past: Candle[], future: Candle[], dir: "BUY" | "SELL", zones: ChartZone[], entry: number): string | null {
  const j = future.findIndex((k) => Math.abs(k.c - entry) < 1e-9);
  if (j < 0) return "aucune bougie de réaction ne clôture à l'entrée du pullback profond";
  const miss = missingSignal([...past, ...future.slice(0, j + 1)], dir, zones);
  return miss ? `pullback profond : ${miss}` : null;
}

/** Trouve l'erreur : « Entrée sans confirmation » proposée en leurre */
export function unconfirmedDecoy(t: { correctMistake: string; decoyMistakes: readonly string[] }): string | null {
  return t.decoyMistakes.includes(UNCONFIRMED) ? "« Entrée sans confirmation » proposée en leurre" : null;
}

const seedOf = (id: string, n: number) => (n * 2654435761 + id.length * 97) >>> 0;
function scan(): string[] {
  const errs = new Map<string, string>();
  const add = (k: string, e: string | null) => { if (e && !errs.has(k)) errs.set(k, e); };
  for (const t of BS.SCENARIO_TEMPLATES) {
    if (t.correctAnswer === "NO_TRADE") continue;
    for (const d of t.difficulties) for (let n = 0; n < N; n++) {
      const seed = seedOf(t.id + d, n), ch = BS.buildChart(t.id, seed, VOLS[n % 3], d, auditCtx(seed));
      add(`Buy/Sell/No Trade · ${t.id} · ${d}`, missingSignal(ch.past, t.correctAnswer, ch.zones));
    }
  }
  for (const t of PS.PLACE_STOP_TEMPLATES) for (const d of t.difficulties) for (let n = 0; n < N; n++) {
    const seed = seedOf(t.id + d, n), ch = PS.buildPlaceStopChart(t.id, seed, VOLS[n % 3], d, auditCtx(seed));
    add(`Place ton Stop · ${t.id} · ${d}`, missingSignal(ch.past, ch.direction, ch.zones));
  }
  for (const t of BT.BUILD_TRADE_TEMPLATES) {
    add(`Build the Trade · ${t.id}`, anticipatedError(t));
    if (t.optimal.entry === "confirmation" || t.anticipated) continue;
    for (let n = 0; n < N; n++) {
      const seed = seedOf(t.id, n), ch = BT.buildBuildTradeChart(t, seed, t.chartShape === "high_vol_pullback" ? "élevée" : VOLS[n % 3], auditCtx(seed));
      if (t.optimal.entry === "aggressive") add(`Build the Trade · ${t.id} (entrée agressive)`, missingSignal(ch.past, t.direction, ch.zones));
      else add(`Build the Trade · ${t.id} (pullback profond)`, deepReactionError(ch.past, ch.future, t.direction, ch.zones, ch.entries.deep_pullback));
    }
  }
  for (const t of FTM.MISTAKE_TEMPLATES) {
    add(`Trouve l'erreur · ${t.id}`, unconfirmedDecoy(t));
    const entryOk = FTM.NON_ENTRY_MISTAKES.has(t.correctMistake), unconfirmed = t.correctMistake === UNCONFIRMED;
    if ((!entryOk && !unconfirmed) || !t.direction) continue;
    for (let n = 0; n < N; n++) {
      const seed = seedOf(t.id, n), ch = FTM.buildScenarioChart(t, seed, t.metaOverride?.volatility ?? VOLS[n % 3], auditCtx(seed));
      if (ch.entry === undefined) continue;
      const miss = missingSignal(ch.past, t.direction, ch.zones);
      add(`Trouve l'erreur · ${t.id}`, unconfirmed ? (miss ? null : "« Entrée sans confirmation » alors que le graphique montre une réaction") : miss);
    }
  }
  for (const r of buildHeroRounds()) {
    const dir = r.game === "place-stop" ? r.entry?.direction : r.game === "buy-sell-no-trade" && r.correct !== "NO_TRADE" ? (r.correct as "BUY" | "SELL") : undefined;
    if (dir) add(`Démo de la home · ${r.key}`, missingSignal(r.past, dir, r.zones));
  }
  return [...errs].map(([k, e]) => `${k} : ${e}`);
}

let errors = 0;
const lines: string[] = [];
if (process.argv.includes("--autotest")) {
  // Défaut du PO (démo de la home) : achat sur un support atteint après cinq grandes bougies rouges
  const drop: Candle[] = [{ o: 10, c: 10.2, h: 10.3, l: 9.9 }];
  for (let i = 0; i < 6; i++) { const o = drop[drop.length - 1].c; drop.push({ o, c: o - 0.5, h: o + 0.03, l: o - 0.53 }); }
  const support: ChartZone = { kind: "support", y1: 7.1, y2: 7.3, label: "Support" };
  const d1 = missingSignal(drop, "BUY", [support]);
  // Le même graphique avec un marteau sur le support : aucune erreur
  const p = drop[drop.length - 1].c;
  const hammer = [...drop, { o: p, c: p + 0.12, h: p + 0.14, l: p - 0.4 }];
  const ok = missingSignal(hammer, "BUY", [support]);
  // Défaut du PO : réaction trop petite face aux bougies voisines (marteau de 0,15 après des bougies de 0,56)
  const tiny = missingSignal([...drop, { o: p, c: p + 0.03, h: p + 0.04, l: p - 0.11 }], "BUY", [support]);
  // La même chute jouée à la vente, puis renversée : l'achat reste sans signal (lecture symétrique)
  const flip = drop.map((k) => ({ o: 20 - k.o, c: 20 - k.c, h: 20 - k.l, l: 20 - k.h }));
  const d2 = missingSignal(flip, "SELL", [{ ...support, kind: "resistance", y1: 12.7, y2: 12.9 }]);
  // Trouve l'erreur : « Entrée sans confirmation » en leurre
  const d3 = unconfirmedDecoy({ correctMistake: "stop_too_tight", decoyMistakes: ["bad_rr", UNCONFIRMED, "no_stop"] });
  lines.push(`${d1 ? "détecté" : "MANQUÉ "}  achat sur un support après cinq grandes bougies rouges`);
  lines.push(`${d2 ? "détecté" : "MANQUÉ "}  vente sur une résistance après cinq grandes bougies vertes`);
  lines.push(`${d3 ? "détecté" : "MANQUÉ "}  « Entrée sans confirmation » proposée en leurre`);
  lines.push(`${tiny ? "détecté" : "MANQUÉ "}  marteau trop petit face aux bougies voisines`);
  // Build the Trade : ordre limite anticipé hors Avancé, sans stop serré, sans le dire ; pullback profond sans réaction
  const adv = BT.BUILD_TRADE_TEMPLATES.find((t) => t.anticipated)!;
  const a1 = anticipatedError({ ...adv, difficulties: ["intermediate"] });
  const a2 = anticipatedError({ ...adv, optimal: { ...adv.optimal, stop: "wide" } });
  const a3 = anticipatedError({ ...adv, optimalExplain: "Entrée pullback profond : l'ordre attend la zone." });
  const deep = BT.BUILD_TRADE_TEMPLATES.find((t) => t.optimal.entry === "deep_pullback" && !t.anticipated)!;
  const dch = BT.buildBuildTradeChart(deep, 7, "normale", auditCtx(7));
  const dOk = deepReactionError(dch.past, dch.future, deep.direction, dch.zones, dch.entries.deep_pullback);
  // la réaction remplacée par une bougie qui descend jusqu'à l'entrée sans réagir
  const jj = dch.future.findIndex((k) => Math.abs(k.c - dch.entries.deep_pullback) < 1e-9);
  const sgn = deep.direction === "BUY" ? 1 : -1, fk = dch.future[jj];
  const E = dch.entries.deep_pullback, o2 = E + sgn * Math.max(Math.abs(fk.h - fk.l), 1e-6);
  const flat = dch.future.map((k, i) => (i === jj ? { o: o2, c: E, h: Math.max(o2, E), l: Math.min(o2, E) } : k));
  const dBad = deepReactionError(dch.past, flat, deep.direction, dch.zones, dch.entries.deep_pullback);
  for (const [ok2, name] of [[a1, "ordre limite anticipé en Intermédiaire"], [a2, "ordre limite anticipé avec un stop éloigné"], [a3, "ordre limite anticipé sans le dire"], [dBad, "pullback profond sans réaction au niveau"]] as const)
    lines.push(`${ok2 ? "détecté" : "MANQUÉ "}  ${name}`);
  lines.push(`${dOk ? `FAUX POSITIF (${dOk})` : "aucun faux positif"}  pullback profond avec sa réaction`);
  lines.push(`${ok ? "FAUX POSITIF" : "aucun faux positif"}  marteau sur le support avant l'achat`);
  errors = (d1 ? 0 : 1) + (d2 ? 0 : 1) + (d3 ? 0 : 1) + (tiny ? 0 : 1) + (ok ? 1 : 0) + [a1, a2, a3, dBad].filter((x) => !x).length + (dOk ? 1 : 0);
} else {
  const errs = scan();
  errors = errs.length;
  for (const e of errs.slice(0, 30)) lines.push(`  ERREUR ${e}`);
  lines.push(`Entrées contrôlées : Buy/Sell/No Trade, Place ton Stop, Build the Trade (agressive), Trouve l'erreur, ${N} graines chacune ; démo de la home`);
}
console.log(lines.join("\n"));
console.log(`RESULTAT erreurs=${errors} avertissements=0`);
