// Zones des jeux (règle PO) : une zone ne porte qu'un libellé validé. Leur taille et leur place
// se jugent par rapport aux bougies (scripts/audit-jeux/trace.ts), plus par rapport à la hauteur
// du graphique.
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
const ALLOWED = new Set(ZONE_LABELS.fr);

/** Erreur d'un graphique (ou null) : libellé hors vocabulaire. */
export function zoneErrors(_past: Candle[], _future: Candle[], zones: ChartZone[]): string | null {
  for (const z of zones) if (z.label && !ALLOWED.has(z.label)) return `libellé de zone hors vocabulaire validé « ${z.label} »`;
  return null;
}

const seedOf = (id: string, n: number) => { let h = 2166136261; for (const ch of `${id}#${n}`) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return h >>> 0; };
type Chart = { past: Candle[]; future: Candle[]; zones: ChartZone[] };
function* charts(): Generator<[string, Chart]> {
  for (const t of BS.SCENARIO_TEMPLATES) for (const d of t.difficulties) for (let n = 0; n < ROUNDS; n++) {
    const seed = seedOf(t.id + d, n), ctx = auditCtx(seed);
    // libellés tels qu'affichés (niveau avancé : zones sans qualificatif)
    const ch = BS.withAssetPrices(BS.buildChart(t.id, seed, VOLS[n % 3], d, ctx), { ...ctx, seed });
    yield [`Buy/Sell/No Trade|${t.id}|${d}`, { ...ch, zones: BS.maskZonesForDifficulty(ch.zones, d, "fr", BS.scenarioTexts(t, d)) }];
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
  const any = all.find((c) => c.zones.some((z) => z.kind !== "fvg" && z.label))!;
  const cases: [string, RegExp, Chart][] = [
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
