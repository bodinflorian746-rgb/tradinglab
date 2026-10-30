// Signal visible avant toute entrée correcte (règle PO, 2026-10-30) : une entrée sur un niveau n'est une
// bonne réponse que si le graphique montre une réaction ou une confirmation à l'entrée (rejet, engulfing,
// sommet local dépassé, clôture revenue dans le range, breakout confirmé : lib/games/confirmation.ts).
// Entrées contrôlées :
//  - Buy/Sell/No Trade : BUY ou SELL justes, à la dernière clôture ;
//  - Place ton Stop : l'entrée donnée par le scénario ;
//  - Build the Trade : l'entrée agressive quand elle est la bonne (l'entrée sur confirmation attend la bougie
//    suivante, le pullback profond un ordre limite) ;
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
    if (t.optimal.entry !== "aggressive") continue;
    for (let n = 0; n < N; n++) {
      const seed = seedOf(t.id, n), ch = BT.buildBuildTradeChart(t, seed, t.chartShape === "high_vol_pullback" ? "élevée" : VOLS[n % 3], auditCtx(seed));
      add(`Build the Trade · ${t.id} (entrée agressive)`, missingSignal(ch.past, t.direction, ch.zones));
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
  // La même chute jouée à la vente, puis renversée : l'achat reste sans signal (lecture symétrique)
  const flip = drop.map((k) => ({ o: 20 - k.o, c: 20 - k.c, h: 20 - k.l, l: 20 - k.h }));
  const d2 = missingSignal(flip, "SELL", [{ ...support, kind: "resistance", y1: 12.7, y2: 12.9 }]);
  // Trouve l'erreur : « Entrée sans confirmation » en leurre
  const d3 = unconfirmedDecoy({ correctMistake: "stop_too_tight", decoyMistakes: ["bad_rr", UNCONFIRMED, "no_stop"] });
  lines.push(`${d1 ? "détecté" : "MANQUÉ "}  achat sur un support après cinq grandes bougies rouges`);
  lines.push(`${d2 ? "détecté" : "MANQUÉ "}  vente sur une résistance après cinq grandes bougies vertes`);
  lines.push(`${d3 ? "détecté" : "MANQUÉ "}  « Entrée sans confirmation » proposée en leurre`);
  lines.push(`${ok ? "FAUX POSITIF" : "aucun faux positif"}  marteau sur le support avant l'achat`);
  errors = (d1 ? 0 : 1) + (d2 ? 0 : 1) + (d3 ? 0 : 1) + (ok ? 1 : 0);
} else {
  const errs = scan();
  errors = errs.length;
  for (const e of errs.slice(0, 30)) lines.push(`  ERREUR ${e}`);
  lines.push(`Entrées contrôlées : Buy/Sell/No Trade, Place ton Stop, Build the Trade (agressive), Trouve l'erreur, ${N} graines chacune ; démo de la home`);
}
console.log(lines.join("\n"));
console.log(`RESULTAT erreurs=${errors} avertissements=0`);
