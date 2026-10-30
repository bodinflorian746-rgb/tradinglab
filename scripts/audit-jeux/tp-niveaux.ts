// Objectif jamais posé sur un niveau tracé (règle PO, audit de fond du 2026-10-29) : le TP d'un plan valable
// n'est jamais dans la bande d'un support ou d'une résistance tracés, à 0,1 bougie médiane près
// : il se place avant. Un TP ambitieux loin au-delà d'un sommet unique reste un choix.
// Plans valables : TP de Place ton Stop, TP optimal de Build the Trade, TP de Trouve l'erreur quand l'erreur
// à trouver ne porte pas sur l'objectif (les TP fautifs y sont voulus). Les choix de TP perdants de Build
// the Trade (TP ambitieux au-delà d'un niveau) ne sont pas concernés.
// Usage : npx vite-node -c vitest.config.ts scripts/audit-jeux/tp-niveaux.ts [--autotest] (lancé par run.mjs)
import * as PS from "../../lib/games/place-stop";
import * as BT from "../../lib/games/build-the-trade";
import * as FTM from "../../lib/games/find-the-mistake";
import type { Candle, ChartZone } from "../../lib/games/shared";
import { auditCtx } from "./market-ctx";

const N = 60;
const VOLS = ["faible", "normale", "élevée"] as const;
const med = (cs: Candle[]) => { const s = cs.map((k) => k.h - k.l).sort((a, b) => a - b); return s[s.length >> 1]; };

/** TP dans la bande d'un support ou d'une résistance tracés (à 0,1 bougie médiane près), du côté de l'objectif */
export function tpOnLevel(past: Candle[], zones: ChartZone[], entry: number, tp: number): string | null {
  const up = tp > entry, tol = 0.1 * med(past);
  for (const z of zones) {
    if (z.kind !== "support" && z.kind !== "resistance") continue;
    const lo = Math.min(z.y1, z.y2), hi = Math.max(z.y1, z.y2);
    if ((up ? lo > entry : hi < entry) && tp >= lo - tol && tp <= hi + tol) return `TP ${tp.toFixed(3)} posé sur « ${z.label} » (${lo.toFixed(3)} – ${hi.toFixed(3)})`;
  }
  return null;
}

const seedOf = (id: string, n: number) => (n * 2654435761 + id.length * 97) >>> 0;
function scan(): string[] {
  const errs = new Map<string, string>();
  const add = (k: string, e: string | null) => { if (e && !errs.has(k)) errs.set(k, e); };
  for (const t of PS.PLACE_STOP_TEMPLATES) for (const d of t.difficulties) for (let n = 0; n < N; n++) {
    const seed = seedOf(t.id + d, n), ch = PS.buildPlaceStopChart(t.id, seed, VOLS[n % 3], d, auditCtx(seed));
    if (ch.tp !== null) add(`Place ton Stop · ${t.id} · ${d}`, tpOnLevel(ch.past, ch.zones, ch.entry, ch.tp));
  }
  for (const t of BT.BUILD_TRADE_TEMPLATES) for (let n = 0; n < N; n++) {
    const seed = seedOf(t.id, n), ch = BT.buildBuildTradeChart(t, seed, t.chartShape === "high_vol_pullback" ? "élevée" : VOLS[n % 3], auditCtx(seed));
    add(`Build the Trade · ${t.id}`, tpOnLevel(ch.past, ch.zones, ch.entries[t.optimal.entry], ch.tps[t.optimal.tp]));
  }
  for (const t of FTM.MISTAKE_TEMPLATES) {
    if (/tp|target|objectif|rr|ratio/i.test(`${t.correctMistake} ${t.id}`)) continue;
    for (let n = 0; n < N; n++) {
      const seed = seedOf(t.id, n), ch = FTM.buildScenarioChart(t, seed, t.metaOverride?.volatility ?? VOLS[n % 3], auditCtx(seed));
      if (ch.entry !== undefined && ch.tp !== undefined) add(`Trouve l'erreur · ${t.id}`, tpOnLevel(ch.past, ch.zones, ch.entry, ch.tp));
    }
  }
  return [...errs].map(([k, e]) => `${k} : ${e}`);
}

let errors = 0;
const lines: string[] = [];
if (process.argv.includes("--autotest")) {
  // Défaut injecté : le TP d'un vrai graphique de Place ton Stop posé sur la résistance qui suit l'entrée
  // (premier graphique d'achat qui montre une résistance au-dessus de l'entrée : haut du range…)
  const found = PS.PLACE_STOP_TEMPLATES.filter((x) => x.direction === "BUY").map((x) => PS.buildPlaceStopChart(x.id, 7, "normale", x.difficulties[0], auditCtx(7)))
    .find((c) => c.zones.some((z) => z.kind === "resistance" && Math.min(z.y1, z.y2) > c.entry))!;
  const ch = found;
  const res = ch.zones.find((z) => z.kind === "resistance" && Math.min(z.y1, z.y2) > ch.entry);
  const injected = res ? tpOnLevel(ch.past, ch.zones, ch.entry, Math.min(res.y1, res.y2)) : null;
  const zone = { kind: "resistance" as const, y1: ch.entry + 2 * med(ch.past), y2: ch.entry + 2.2 * med(ch.past), label: "Résistance" };
  const injected2 = tpOnLevel(ch.past, [...ch.zones, zone], ch.entry, ch.entry + 2.1 * med(ch.past));
  const ok = tpOnLevel(ch.past, [...ch.zones, zone], ch.entry, ch.entry + 1.8 * med(ch.past));
  lines.push(`${injected || !res ? "détecté" : "MANQUÉ "}  TP posé sur la résistance du graphique${res ? "" : " (pas de résistance au-dessus : défaut 2 seulement)"}`);
  lines.push(`${injected2 ? "détecté" : "MANQUÉ "}  TP au milieu d'une résistance ajoutée`);
  lines.push(`${ok ? "FAUX POSITIF" : "aucun faux positif"}  TP juste avant la résistance`);
  errors = (injected || !res ? 0 : 1) + (injected2 ? 0 : 1) + (ok ? 1 : 0);
} else {
  const errs = scan();
  errors = errs.length;
  for (const e of errs.slice(0, 30)) lines.push(`  ERREUR ${e}`);
  lines.push(`Plans contrôlés : Place ton Stop, Build the Trade (TP optimal), Trouve l'erreur (hors erreurs d'objectif), ${N} graines chacun`);
}
console.log(lines.join("\n"));
console.log(`RESULTAT erreurs=${errors} avertissements=0`);
