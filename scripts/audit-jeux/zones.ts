// Zones des jeux (règles PO) : une zone n'occupe jamais l'essentiel du graphique et ne porte qu'un
// libellé validé.
//  - zone trop grande : un FVG reste un petit vide entre deux mèches, au plus un quart de la
//    hauteur du graphique ; toute autre zone au plus 40 % (question : bougies passées ; verdict :
//    passé et futur). Hauteur du graphique = étendue des bougies et des zones, comme l'échelle
//    du graphique des jeux.
//  - libellé hors vocabulaire : seuls les libellés de lib/games/glossary.ts (ZONE_LABELS) ; aucun
//    libellé qui désigne un niveau sans le nommer (« Niveau secondaire », « Niveau clé »…).
// Usage : npx vite-node scripts/audit-jeux/zones.ts [--autotest] (lancé par run.mjs)
import { auditCtx } from "./market-ctx";
import * as BS from "../../lib/games/buy-sell-no-trade";
import * as FTM from "../../lib/games/find-the-mistake";
import * as PS from "../../lib/games/place-stop";
import * as BT from "../../lib/games/build-the-trade";
import { buildGamePreviews } from "../../lib/games/previews";
import { buildHeroRounds } from "../../app/[locale]/_home/hero-rounds";
import { ZONE_LABELS } from "../../lib/games/glossary";
import type { Candle, ChartZone } from "../../lib/games/shared";

const ROUNDS = 200;
const VOLS = ["faible", "normale", "élevée"] as const;
const MAX = { fvg: 0.25, other: 0.4 };
const ALLOWED = new Set(ZONE_LABELS.fr);

/** Erreurs d'un graphique (ou null) : zone trop grande, libellé hors vocabulaire. */
export function zoneErrors(past: Candle[], future: Candle[], zones: ChartZone[]): string | null {
  for (const z of zones) if (z.label && !ALLOWED.has(z.label)) return `libellé de zone hors vocabulaire validé « ${z.label} »`;
  for (const [state, cs] of [["à la question", past], ["au verdict", [...past, ...future]]] as const) {
    const ps = cs.flatMap((k) => [k.h, k.l]).concat(zones.flatMap((z) => [z.y1, z.y2]));
    const range = Math.max(...ps) - Math.min(...ps) || 1;
    for (const z of zones) {
      const f = Math.abs(z.y2 - z.y1) / range, max = z.kind === "fvg" ? MAX.fvg : MAX.other;
      if (f > max + 1e-9) return `zone trop grande ${state} : « ${z.label ?? z.kind} » occupe ${(f * 100).toFixed(0)} % de la hauteur (max ${max * 100} %)`;
    }
  }
  return null;
}

const seedOf = (id: string, n: number) => { let h = 2166136261; for (const ch of `${id}#${n}`) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return h >>> 0; };
type Chart = { past: Candle[]; future: Candle[]; zones: ChartZone[] };
function* charts(): Generator<[string, Chart]> {
  for (const t of BS.SCENARIO_TEMPLATES) for (const d of t.difficulties) for (let n = 0; n < ROUNDS; n++) {
    const seed = seedOf(t.id + d, n), ctx = auditCtx(seed);
    // libellés tels qu'affichés (niveau avancé : zones sans qualificatif)
    const ch = BS.withAssetPrices(BS.buildChart(t.id, seed, VOLS[n % 3], d, ctx), { ...ctx, seed });
    yield [`Buy/Sell/No Trade|${t.id}|${d}`, { ...ch, zones: BS.maskZonesForDifficulty(ch.zones, d, "fr") }];
  }
  for (const t of FTM.MISTAKE_TEMPLATES) for (let n = 0; n < ROUNDS; n++) {
    const seed = seedOf(t.id, n), ctx = auditCtx(seed);
    yield [`Trouve l'erreur|${t.id}|toutes`, FTM.withAssetPrices(FTM.buildScenarioChart(t, seed, VOLS[n % 3], ctx), { id: t.id, ...ctx, seed })];
  }
  for (const t of PS.PLACE_STOP_TEMPLATES) for (const d of t.difficulties) for (let n = 0; n < ROUNDS; n++) {
    const seed = seedOf(t.id + d, n), ctx = auditCtx(seed);
    yield [`Place ton Stop|${t.id}|${d}`, PS.withAssetPrices(PS.buildPlaceStopChart(t.id, seed, VOLS[n % 3], d, ctx), { id: t.id, ...ctx, seed })];
  }
  for (const t of BT.BUILD_TRADE_TEMPLATES) for (let n = 0; n < ROUNDS; n++) {
    const seed = seedOf(t.id, n), ctx = auditCtx(seed);
    yield [`Build the Trade|${t.id}|toutes`, BT.withAssetPrices(BT.buildBuildTradeChart(t, seed, VOLS[n % 3], ctx), { ...ctx, seed })];
  }
  for (const [id, p] of Object.entries(buildGamePreviews("fr"))) yield [`Aperçus du hub|${id}|—`, { past: p.data.candles, future: [], zones: p.data.zones }];
  for (const r of buildHeroRounds("fr")) yield [`Héros de la home|${r.key}|—`, { past: r.past, future: r.future, zones: r.zones }];
}

let errors = 0;
const lines: string[] = [];
if (process.argv.includes("--autotest")) {
  // Défauts injectés sur de vrais graphiques : chacun doit être détecté
  const all = [...charts()].map(([, c]) => c);
  const fvg = all.find((c) => c.zones.some((z) => z.kind === "fvg"))!;
  const any = all.find((c) => c.zones.some((z) => z.kind !== "fvg" && z.label))!;
  const grow = (c: Chart, kind: (z: ChartZone) => boolean, f: number): Chart => {
    const ps = c.past.flatMap((k) => [k.h, k.l]); const range = Math.max(...ps) - Math.min(...ps);
    return { ...c, zones: c.zones.map((z) => (kind(z) ? { ...z, y2: Math.min(z.y1, z.y2) + f * range } : z)) };
  };
  const cases: [string, RegExp, Chart][] = [
    ["FVG trop grand (30 %)", /zone trop grande/, grow(fvg, (z) => z.kind === "fvg", 0.3)],
    ["zone trop grande (55 %)", /zone trop grande/, grow(any, (z) => z.kind !== "fvg", 0.55)],
    ["libellé « Niveau secondaire »", /hors vocabulaire/, { ...any, zones: any.zones.map((z, i) => (i === 0 ? { ...z, label: "Niveau secondaire" } : z)) }],
  ];
  for (const [name, expect, c] of cases) {
    const e = zoneErrors(c.past, c.future, c.zones);
    const ok = !!e && expect.test(e);
    lines.push(`${ok ? "détecté" : "MANQUÉ "}  ${name}${e ? ` (${e})` : ""}`);
    if (!ok) errors++;
  }
} else {
  const counts = new Map<string, { n: number; bad: number; first?: string }>();
  for (const [key, c] of charts()) {
    const k = counts.get(key) ?? { n: 0, bad: 0 };
    k.n++;
    const e = zoneErrors(c.past, c.future, c.zones);
    if (e) { k.bad++; errors++; k.first ??= e; }
    counts.set(key, k);
  }
  for (const [key, k] of counts) if (k.bad) lines.push(`  ERREUR ${key.replace(/\|/g, " · ")} : ${k.bad}/${k.n} rounds (${k.first})`);
  lines.push(`${counts.size} scénarios × difficultés, ${[...counts.values()].reduce((a, k) => a + k.n, 0)} graphiques`);
}
console.log(lines.join("\n"));
console.log(`RESULTAT erreurs=${errors} avertissements=0`);
