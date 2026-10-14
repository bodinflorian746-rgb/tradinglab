// Cohérence de ce qui est tracé dans les jeux (règle PO : « comme un trader le tracerait sur
// TradingView »). Toute taille se juge par rapport aux bougies affichées — MR, l'amplitude
// médiane (haut − bas) des bougies vues avant la réponse —, jamais par rapport à la hauteur
// du graphique. Bougies vues avant la réponse ; libellés tels qu'affichés.
//  - liquidité (« Liquidité … », « Sweep bas / haut », « Zone de chasse aux stops ») : bande fine
//    (≤ LIQ_MAX × MR) collée au niveau qu'elle prolonge ; balayée, elle ne s'étend jamais plus
//    loin que la mèche qui la balaie ;
//  - plus haut / plus bas précédent, swings, PDL, HL, equal lows / highs, haut de session :
//    bande fine (≤ PIVOT_MAX × MR) posée sur un vrai sommet / creux visible (extrême local) ;
//  - FVG : exactement l'écart entre la mèche de la bougie 1 et celle de la bougie 3 (± FVG_TOL ×
//    MR), au plus FVG_MAX × MR ;
//  - Order Block : la bougie opposée avant l'impulsion, pas plus (bords à ± OB_TOL × MR) ;
//  - support / résistance, haut / bas du range : bande fine (≤ SR_MAX × MR).
// Usage : npx vite-node scripts/audit-jeux/trace.ts [--autotest] [--detail] (lancé par run.mjs)
import { auditCtx } from "./market-ctx";
import * as BS from "../../lib/games/buy-sell-no-trade";
import * as FTM from "../../lib/games/find-the-mistake";
import * as PS from "../../lib/games/place-stop";
import * as BT from "../../lib/games/build-the-trade";
import { buildGamePreviews } from "../../lib/games/previews";
import { buildHeroRounds } from "../../app/[locale]/_home/hero-rounds";
import type { Candle, ChartZone } from "../../lib/games/shared";

export const LIQ_MAX = 1.0, PIVOT_MAX = 1.0, SR_MAX = 1.5, FVG_MAX = 2.5, FVG_TOL = 0.2, OB_TOL = 0.25, PIVOT_TOL = 0.35, BOUNCE = 0.4;
const ROUNDS = +(process.argv.find((a) => a.startsWith("--rounds="))?.split("=")[1] ?? 200);
const VOLS = ["faible", "normale", "élevée"] as const;
const DETAIL = process.argv.includes("--detail");

const median = (a: number[]) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : 0; };
export const medRange = (cs: Candle[]) => median(cs.map((k) => k.h - k.l)) || 1e-9;

const LIQ = /^(liquidit|sweep (haut|bas)|zone de chasse|mèche du faux breakout)/i;
const SWEPT = /balay|^sweep|^mèche du faux breakout/i;
const PIVOT = /^(plus (haut|bas) précédent|swing (high|low)|equal (lows|highs)|haut de la session|bas de la session)/i;
const SR = /^(support|r[ée]sistance|haut du range|bas du range|ancien|ancienne)/i;

/** Pointes de mèche qui sont de vrais creux / sommets : plus bas (haut) que la bougie d'avant et
 *  celle d'après (pas au milieu d'un mouvement) */
function pivots(cs: Candle[]) {
  const lows: number[] = [], highs: number[] = [];
  cs.forEach((k, i) => {
    const win = cs.slice(Math.max(0, i - 1), i + 2);
    if (win.every((x) => x.l >= k.l)) lows.push(k.l);
    if (win.every((x) => x.h <= k.h)) highs.push(k.h);
  });
  return { lows, highs };
}
/** Bougie du sweep (mèche la plus profonde) quand une liquidité balayée est tracée, et son côté */
function sweepOf(past: Candle[], zones: ChartZone[]) {
  const z = zones.find((x) => SWEPT.test(x.label) && LIQ.test(x.label));
  if (!z) return null;
  const low = z.kind === "liquidity_low" || /bas|en-dessous/i.test(z.label);
  const i = past.reduce((a, k, j) => (low ? (k.l < past[a].l ? j : a) : (k.h > past[a].h ? j : a)), 0);
  return { i, low };
}

/** Erreur de tracé d'une zone (ou null) */
export function zoneTraceError(past: Candle[], z: ChartZone, zones: ChartZone[] = [z]): string | null {
  if (!z.label) return null;
  const MR = medRange(past);
  const lo = Math.min(z.y1, z.y2), hi = Math.max(z.y1, z.y2), h = hi - lo, r = (x: number) => (x / MR).toFixed(2);
  if (z.kind === "fvg" && !/order block/i.test(z.label)) {
    if (h > FVG_MAX * MR) return `FVG « ${z.label} » de ${r(h)} × la bougie médiane (max ${FVG_MAX})`;
    for (let i = 1; i + 1 < past.length; i++) {
      const a = past[i - 1], c = past[i + 1];
      const bull = c.l > a.h, bear = c.h < a.l;
      if (bull && Math.abs(a.h - lo) <= FVG_TOL * MR && Math.abs(c.l - hi) <= FVG_TOL * MR) return null;
      if (bear && Math.abs(c.h - lo) <= FVG_TOL * MR && Math.abs(a.l - hi) <= FVG_TOL * MR) return null;
    }
    return `FVG « ${z.label} » qui ne correspond à l'écart d'aucune impulsion de 3 bougies`;
  }
  if (/order block/i.test(z.label)) {
    const ok = past.some((k) => Math.abs(k.l - lo) <= OB_TOL * MR && Math.abs(k.h - hi) <= OB_TOL * MR)
      || past.some((k) => Math.abs(Math.min(k.o, k.c) - lo) <= OB_TOL * MR && Math.abs(Math.max(k.o, k.c) - hi) <= OB_TOL * MR);
    return ok ? null : `Order Block « ${z.label} » qui ne couvre aucune bougie (${r(h)} × la bougie médiane)`;
  }
  if (/^mèche du faux breakout/i.test(z.label)) {
    // la mèche du faux breakout : du niveau cassé à la pointe de la mèche la plus haute (basse)
    const below = z.kind === "liquidity_low";
    const tip = below ? Math.min(...past.map((k) => k.l)) : Math.max(...past.map((k) => k.h));
    if (Math.abs((below ? lo : hi) - tip) > 0.1 * MR) return `« ${z.label} » qui s'arrête à ${r(Math.abs((below ? lo : hi) - tip))} × la bougie médiane de la pointe de la mèche`;
    const k = past.find((x) => (below ? x.l : x.h) === tip)!;
    const body = below ? Math.min(k.o, k.c) : Math.max(k.o, k.c);
    if (below ? hi > body + 0.1 * MR : lo < body - 0.1 * MR) return `« ${z.label} » qui couvre le corps de la bougie (${r(Math.abs((below ? hi : lo) - body))} × la bougie médiane)`;
    return null;
  }
  if (LIQ.test(z.label)) {
    if (h > LIQ_MAX * MR) return `liquidité « ${z.label} » épaisse de ${r(h)} × la bougie médiane (max ${LIQ_MAX})`;
    if (SWEPT.test(z.label)) {
      const into = past.filter((k) => k.l < hi && k.h > lo);
      if (into.length) {
        const below = z.kind === "liquidity_low" || /bas|en-dessous/i.test(z.label);
        const tip = below ? Math.min(...into.map((k) => k.l)) : Math.max(...into.map((k) => k.h));
        if (below ? lo < tip - 0.1 * MR : hi > tip + 0.1 * MR) return `liquidité balayée « ${z.label} » qui s'étend ${r(Math.abs((below ? lo : hi) - tip))} × la bougie médiane plus loin que la mèche du sweep`;
      }
    }
    return null;
  }
  if (PIVOT.test(z.label)) {
    if (h > PIVOT_MAX * MR) return `« ${z.label} » épais de ${r(h)} × la bougie médiane (max ${PIVOT_MAX})`;
    const { lows, highs } = pivots(past);
    const high = /haut|high|pdh|lh|highs/i.test(z.label);
    const ext = high ? highs : lows;
    // niveau balayé par un sweep (ou la mèche d'un faux breakout) du même côté : l'extrême d'avant
    const sw = sweepOf(past, zones);
    if (sw && sw.low === !high && sw.i > 0) {
      const before = past.slice(0, sw.i), side = high ? "h" : "l";
      const j = before.reduce((a, k, i) => (high ? (k.h > before[a].h ? i : a) : (k.l < before[a].l ? i : a)), 0);
      // un vrai plus bas (haut) précédent : le prix en est reparti avant de revenir le balayer
      if (/précédent/i.test(z.label) && Math.abs(before[j][side] - (lo + hi) / 2) <= PIVOT_TOL * MR) {
        // (le creux n'est pas la bougie juste avant la mèche, et une clôture s'en écarte d'au moins BOUNCE × MR)
        const bounce = j <= before.length - 2 && before.slice(j).some((k) => (high ? before[j].h - k.c : k.c - before[j].l) >= BOUNCE * MR);
        if (!bounce) return `« ${z.label} » sans rebond avant le sweep (la bougie juste avant la mèche)`;
      }
      ext.push(before[j][side]);
    }
    const ok = ext.some((x) => x >= lo - PIVOT_TOL * MR && x <= hi + PIVOT_TOL * MR);
    return ok ? null : `« ${z.label} » posé sur aucun ${high ? "sommet" : "creux"} visible`;
  }
  if (SR.test(z.label) && h > SR_MAX * MR) return `« ${z.label} » épais de ${r(h)} × la bougie médiane (max ${SR_MAX})`;
  return null;
}

const seedOf = (id: string, n: number) => { let h = 2166136261; for (const ch of `${id}#${n}`) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return h >>> 0; };
type Chart = { key: string; past: Candle[]; zones: ChartZone[] };
export function* charts(rounds = ROUNDS): Generator<Chart> {
  for (const t of BS.SCENARIO_TEMPLATES) for (const d of t.difficulties) for (let n = 0; n < rounds; n++) {
    const seed = seedOf(t.id + d, n), ctx = auditCtx(seed);
    // libellés complets : au niveau avancé, le masque ne fait que renommer (même tracé)
    const ch = BS.buildChart(t.id, seed, VOLS[n % 3], d, ctx);
    yield { key: `Buy/Sell/No Trade|${t.id}|${d}`, past: ch.past, zones: ch.zones };
  }
  for (const t of FTM.MISTAKE_TEMPLATES) for (let n = 0; n < rounds; n++) {
    const seed = seedOf(t.id, n), ctx = auditCtx(seed);
    const ch = FTM.buildScenarioChart(t, seed, VOLS[n % 3], ctx);
    yield { key: `Trouve l'erreur|${t.id}|toutes`, past: ch.past, zones: ch.zones };
  }
  for (const t of PS.PLACE_STOP_TEMPLATES) for (const d of t.difficulties) for (let n = 0; n < rounds; n++) {
    const seed = seedOf(t.id + d, n), ctx = auditCtx(seed);
    const ch = PS.buildPlaceStopChart(t.id, seed, VOLS[n % 3], d, ctx);
    yield { key: `Place ton Stop|${t.id}|${d}`, past: ch.past, zones: ch.zones };
  }
  for (const t of BT.BUILD_TRADE_TEMPLATES) for (let n = 0; n < rounds; n++) {
    const seed = seedOf(t.id, n), ctx = auditCtx(seed);
    const ch = BT.buildBuildTradeChart(t, seed, VOLS[n % 3], ctx);
    yield { key: `Build the Trade|${t.id}|toutes`, past: ch.past, zones: ch.zones };
  }
  for (const [id, p] of Object.entries(buildGamePreviews("fr"))) yield { key: `Aperçus du hub|${id}|—`, past: p.data.candles, zones: p.data.zones };
  for (const r of buildHeroRounds("fr")) yield { key: `Héros de la home|${r.key}|—`, past: r.past, zones: r.zones };
}

if (!process.env.TRACE_NO_MAIN) {
  let errors = 0;
  const lines: string[] = [];
  if (process.argv.includes("--autotest")) {
    // Défauts injectés sur de vrais graphiques : chacun doit être détecté
    const all = [...charts(2)];
    const find = (re: RegExp) => { for (const c of all) { const z = c.zones.find((x) => re.test(x.label) && !zoneTraceError(c.past, x)); if (z) return { c, z }; } return null; };
    const MRof = (c: Chart) => medRange(c.past);
    const cases: [string, RegExp, () => [Candle[], ChartZone, ChartZone[]?] | null][] = [
      ["liquidité plus loin que la mèche du sweep", /plus loin que la mèche|épaisse/, () => { const f = find(/^Liquidité balayée/); return f && [f.c.past, { ...f.z, y1: Math.min(f.z.y1, f.z.y2) - 3 * MRof(f.c) }]; }],
      ["liquidité épaisse", /épaisse/, () => { const f = find(/^Liquidité (au-dessus|en-dessous)/); return f && [f.c.past, { ...f.z, y2: Math.max(f.z.y1, f.z.y2) + 2 * MRof(f.c) }]; }],
      ["plus bas précédent hors d'un creux", /aucun creux/, () => { const f = find(/^Plus bas précédent/); return f && [f.c.past, { ...f.z, y1: f.z.y1 + 6 * MRof(f.c), y2: f.z.y2 + 6 * MRof(f.c) }]; }],
      ["FVG décalé de l'écart", /aucune impulsion/, () => { const f = find(/^FVG/); return f && [f.c.past, { ...f.z, y1: f.z.y1 + 0.8 * MRof(f.c), y2: f.z.y2 + 0.8 * MRof(f.c) }]; }],
      ["support épais", /épais/, () => { const f = find(/^Support$/); return f && [f.c.past, { ...f.z, y2: Math.max(f.z.y1, f.z.y2) + 3 * MRof(f.c) }]; }],
      ["plus bas précédent sur la bougie juste avant le sweep", /sans rebond/, () => {
        const c = all.find((x) => x.zones.some((z) => /^Plus bas précédent/.test(z.label)) && x.zones.some((z) => /^Liquidité balayée/.test(z.label)));
        if (!c) return null;
        const MR = MRof(c), s = c.past.reduce((a, k, i) => (k.l < c.past[a].l ? i : a), 0);
        const low = Math.min(...c.past.slice(0, s).map((k) => k.l)) - 0.05 * MR;
        const past = c.past.map((k, i) => (i === s - 1 ? { ...k, l: low } : k));
        const z = { ...c.zones.find((x) => /^Plus bas précédent/.test(x.label))!, y1: low - 0.01 * MR, y2: low + 0.01 * MR };
        return [past, z, c.zones.map((x) => (/^Plus bas précédent/.test(x.label) ? z : x))];
      }],
      ["mèche du faux breakout arrêtée avant sa pointe", /s'arrête/, () => { const f = find(/^Mèche du faux breakout/); return f && [f.c.past, { ...f.z, y2: Math.max(f.z.y1, f.z.y2) - 0.5 * MRof(f.c) }]; }],
      ["Order Block plus grand que sa bougie", /couvre aucune bougie/, () => { const f = find(/^Order Block/); return f && [f.c.past, { ...f.z, y1: Math.min(f.z.y1, f.z.y2) - 2 * MRof(f.c) }]; }],
    ];
    for (const [name, expect, make] of cases) {
      const m = make();
      const e = m ? zoneTraceError(m[0], m[1], m[2] ?? [m[1]]) : null;
      const ok = !!e && expect.test(e);
      lines.push(`${ok ? "détecté" : "MANQUÉ "}  ${name}${e ? ` (${e})` : m ? "" : " (aucun graphique de base)"}`);
      if (!ok) errors++;
    }
  } else {
    const counts = new Map<string, { n: number; bad: number; first?: string }>();
    for (const c of charts()) for (const z of c.zones) {
      const k = `${c.key}|${z.label}`;
      const s = counts.get(k) ?? { n: 0, bad: 0 };
      s.n++;
      const e = zoneTraceError(c.past, z, c.zones);
      if (e) { s.bad++; errors++; s.first ??= e; }
      counts.set(k, s);
    }
    const bad = [...counts].filter(([, s]) => s.bad).sort((a, b) => b[1].bad / b[1].n - a[1].bad / a[1].n);
    for (const [k, s] of bad.slice(0, DETAIL ? 500 : 60)) lines.push(`  ERREUR ${k.replace(/\|/g, " · ")} : ${s.bad}/${s.n} (${s.first})`);
    lines.push(`${counts.size} zones (scénario × niveau × libellé) contrôlées`);
  }
  console.log(lines.join("\n"));
  console.log(`RESULTAT erreurs=${errors} avertissements=0`);
}
