// Changement de rôle lisible (règle PO) : un support dont toutes les touches viennent d'en dessous
// (ancienne résistance) ou une résistance dont toutes les touches viennent d'au-dessus (ancien
// support) doit le dire : « Ancienne résistance → support » / « Ancien support → résistance »
// (ES : « Antigua resistencia → soporte » / « Antiguo soporte → resistencia » ; libellés courts
// « Résistance → support »…). Touches : même définition que la preuve des supports / résistances
// (scripts/audit-lecons/sr-proof.mjs) — le prix arrive d'un côté, vient au contact et repart du
// même côté ; la tolérance est un quart de l'amplitude médiane des bougies.
// Bougies vues avant la réponse ; 500 rounds par scénario et par niveau, aperçus du hub, héros.
// Usage : npx vite-node scripts/audit-jeux/roles.ts [--autotest] (lancé par run.mjs)
import { auditCtx } from "./market-ctx";
import * as BS from "../../lib/games/buy-sell-no-trade";
import * as BSES from "../../lib/games/buy-sell-no-trade-es";
import * as FTM from "../../lib/games/find-the-mistake";
import * as FTMES from "../../lib/games/find-the-mistake-es";
import * as PS from "../../lib/games/place-stop";
import * as PSES from "../../lib/games/place-stop-es";
import * as BT from "../../lib/games/build-the-trade";
import * as BTES from "../../lib/games/build-the-trade-es";
import { buildGamePreviews } from "../../lib/games/previews";
import { buildHeroRounds } from "../../app/[locale]/_home/hero-rounds";
import type { Candle, ChartZone } from "../../lib/games/shared";
import { auditee } from "./langues";

const ROUNDS = 500;
const VOLS = ["faible", "normale", "élevée"] as const;
const SUP = /^(support|soporte)\b/i, RES = /^(r[ée]sistance|resistencia)\b/i;
const FLIP = /→/;

/** Touches par côté d'une zone (au-dessus = le prix vient d'en haut, comme sur un support) */
export function touchSides(cs: Candle[], lo: number, hi: number) {
  const r = cs.map((k) => k.h - k.l).sort((a, b) => a - b);
  const tol = 0.25 * (r[Math.floor(r.length / 2)] || 0);
  let last: "above" | "below" | null = null, contact = false, above = 0, below = 0;
  for (const k of cs) {
    const a = k.l > hi + tol, b = k.h < lo - tol;
    if (a || b) {
      const side = a ? "above" : "below";
      if (contact && last === side) { if (side === "above") above++; else below++; }
      contact = false; last = side;
    } else if (last) contact = true;
  }
  return { above, below };
}

/** Erreur si un support / une résistance tient son rôle d'un changement de rôle sans le dire */
export function roleError(past: Candle[], zones: ChartZone[]): string | null {
  for (const z of zones) {
    if (!z.label || FLIP.test(z.label)) continue;
    const sup = SUP.test(z.label), res = RES.test(z.label);
    if (!sup && !res) continue;
    const t = touchSides(past, Math.min(z.y1, z.y2), Math.max(z.y1, z.y2));
    if (sup && t.below > 0 && t.above === 0) return `« ${z.label} » touché seulement par en dessous (${t.below} touche${t.below > 1 ? "s" : ""}) : ancienne résistance, le libellé doit le dire`;
    if (res && t.above > 0 && t.below === 0) return `« ${z.label} » touchée seulement par au-dessus (${t.above} touche${t.above > 1 ? "s" : ""}) : ancien support, le libellé doit le dire`;
  }
  return null;
}

const seedOf = (id: string, n: number) => { let h = 2166136261; for (const ch of `${id}#${n}`) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return h >>> 0; };
type Chart = { key: string; past: Candle[]; zones: ChartZone[] };
function* charts(rounds = ROUNDS): Generator<Chart> {
  const GAMES = [["fr", BS, FTM, PS, BT], ["es", BSES, FTMES, PSES, BTES]] as const;
  for (const [lang, B, F, P, T] of GAMES.filter(([l]) => auditee(l))) {
    for (const t of B.SCENARIO_TEMPLATES) for (const d of t.difficulties) for (let n = 0; n < rounds; n++) {
      const seed = seedOf(t.id + d, n), ctx = auditCtx(seed);
      const ch = B.buildChart(t.id, seed, VOLS[n % 3], d, ctx);
      yield { key: `Buy/Sell/No Trade|${t.id}|${d}|${lang}`, past: ch.past, zones: BS.maskZonesForDifficulty(ch.zones, d, lang, BS.scenarioTexts(t, d)) };
    }
    for (const t of F.MISTAKE_TEMPLATES) for (let n = 0; n < rounds; n++) {
      const seed = seedOf(t.id, n), ctx = auditCtx(seed);
      const ch = F.buildScenarioChart(t, seed, VOLS[n % 3], ctx);
      yield { key: `Trouve l'erreur|${t.id}|toutes|${lang}`, past: ch.past, zones: ch.zones };
    }
    for (const t of P.PLACE_STOP_TEMPLATES) for (const d of t.difficulties) for (let n = 0; n < rounds; n++) {
      const seed = seedOf(t.id + d, n), ctx = auditCtx(seed);
      const ch = P.buildPlaceStopChart(t.id, seed, VOLS[n % 3], d, ctx);
      yield { key: `Place ton Stop|${t.id}|${d}|${lang}`, past: ch.past, zones: ch.zones };
    }
    for (const t of T.BUILD_TRADE_TEMPLATES) for (let n = 0; n < rounds; n++) {
      const seed = seedOf(t.id, n), ctx = auditCtx(seed);
      const ch = T.buildBuildTradeChart(t, seed, VOLS[n % 3], ctx);
      yield { key: `Build the Trade|${t.id}|toutes|${lang}`, past: ch.past, zones: ch.zones };
    }
  }
  for (const lang of (["fr", "es"] as const).filter(auditee)) {
    for (const [id, p] of Object.entries(buildGamePreviews(lang))) yield { key: `Aperçus du hub|${id}|—|${lang}`, past: p.data.candles, zones: p.data.zones };
    for (const r of buildHeroRounds(lang)) yield { key: `Héros de la home|${r.key}|—|${lang}`, past: r.past, zones: r.zones };
  }
}

let errors = 0;
const lines: string[] = [];
if (process.argv.includes("--autotest")) {
  // Défauts injectés sur de vrais graphiques : un changement de rôle renommé « Support » /
  // « Résistance » doit être détecté ; un vrai support (touches par au-dessus) ne l'est pas.
  let flipSup: Chart | undefined, flipRes: Chart | undefined, plain: Chart | undefined;
  for (const c of charts(3)) {
    for (const z of c.zones) {
      if (z.flip?.was === "resistance") flipSup ??= { ...c, zones: [{ ...z, label: "Support", short: undefined }] };
      if (z.flip?.was === "support") flipRes ??= { ...c, zones: [{ ...z, label: "Résistance", short: undefined }] };
      if (!z.flip && /^Support$/.test(z.label) && !roleError(c.past, [z])) plain ??= { ...c, zones: [z] };
    }
    if (flipSup && flipRes && plain) break;
  }
  const cases: [string, Chart | undefined, boolean][] = [
    ["ancienne résistance étiquetée « Support »", flipSup, true],
    ["ancien support étiqueté « Résistance »", flipRes, true],
    ["vrai support (témoin)", plain, false],
  ];
  for (const [name, c, expect] of cases) {
    const e = c ? roleError(c.past, c.zones) : null;
    const ok = !!c && (!!e === expect);
    lines.push(`${ok ? (expect ? "détecté" : "accepté") : "MANQUÉ "}  ${name}${c ? ` (${c.key.split("|").slice(0, 2).join(" ")})` : " (aucun graphique trouvé)"}${e ? ` : ${e}` : ""}`);
    if (!ok) errors++;
  }
} else {
  const counts = new Map<string, { n: number; bad: number; first?: string }>();
  for (const c of charts()) {
    const k = counts.get(c.key) ?? { n: 0, bad: 0 };
    k.n++;
    const e = roleError(c.past, c.zones);
    if (e) { k.bad++; errors++; k.first ??= e; }
    counts.set(c.key, k);
  }
  for (const [key, k] of counts) if (k.bad) lines.push(`  ERREUR ${key.replace(/\|/g, " · ")} : ${k.bad}/${k.n} rounds (${k.first})`);
  lines.push(`${counts.size} scénarios × niveaux × langues, ${[...counts.values()].reduce((a, k) => a + k.n, 0)} graphiques`);
}
console.log(lines.join("\n"));
console.log(`RESULTAT erreurs=${errors} avertissements=0`);
