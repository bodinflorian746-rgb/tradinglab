// Audit cohérence texte / données — Build the Trade.
// Usage : npx vite-node scripts/audit-jeux/coherence-btt.ts [fr|en|es] (lancé par run.mjs)
import * as FR from "../../lib/games/build-the-trade";
import { auditCtx } from "./market-ctx";
import * as EN from "../../lib/games/build-the-trade-en";
import * as ES from "../../lib/games/build-the-trade-es";
import type { BuildTradeChart, BuildTradeTemplate, Candle, ChartZone, Difficulty } from "../../lib/games/build-the-trade";

const LOC = (process.argv[2] ?? "fr") as "fr" | "en" | "es";
const G = LOC === "en" ? EN : LOC === "es" ? ES : FR;
const N = 500;
const VOLS = ["faible", "normale", "élevée"] as const;
const E = 1e-9;
const lo = (z: ChartZone) => Math.min(z.y1, z.y2);
const hi = (z: ChartZone) => Math.max(z.y1, z.y2);
const body = (k: Candle) => Math.abs(k.c - k.o);
const range = (k: Candle) => k.h - k.l;
const last = <T,>(a: T[]) => a[a.length - 1];
const median = (a: number[]) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
const zone = (ch: BuildTradeChart, kind: ChartZone["kind"], i = 0) => ch.zones.filter((z) => z.kind === kind)[i];
const green = (k: Candle) => k.c > k.o;
const red = (k: Candle) => k.c < k.o;
const maxH = (c: Candle[]) => Math.max(...c.map((k) => k.h));
const minL = (c: Candle[]) => Math.min(...c.map((k) => k.l));

function generic(ch: BuildTradeChart, t: BuildTradeTemplate): string[] {
  const out: string[] = [];
  const all = [...ch.past, ...ch.future];
  for (let i = 1; i < all.length; i++) if (Math.abs(all[i].o - all[i - 1].c) > E) { out.push("[dure] continuité rompue"); break; }
  if (all.some((k) => k.h < Math.max(k.o, k.c) - E || k.l > Math.min(k.o, k.c) + E)) out.push("[dure] OHLC invalide");
  if (Math.abs(ch.currentPrice - last(ch.past).c) > E) out.push("prix actuel ≠ dernière clôture");
  if (Math.min(...Object.values(ch.entries), ...Object.values(ch.stops), ...Object.values(ch.tps), ...all.map((k) => k.l), ...ch.zones.map((z) => lo(z))) <= 0) out.push("[dure] prix affiché ≤ 0");
  if (process.env.FUT15 && ch.future.length !== 15) out.push("[dure] suite ≠ 15 bougies");
  const buy = t.direction === "BUY";
  const es = Object.values(ch.entries), ss = Object.values(ch.stops), ts = Object.values(ch.tps);
  if (ss.some((s) => es.some((e) => (buy ? s >= e - E : s <= e + E)))) out.push("un stop n'est pas strictement au-delà d'une entrée");
  if (ts.some((tp) => es.some((e) => (buy ? tp <= e : tp >= e)))) out.push("un TP n'est pas au-delà d'une entrée");
  // Règle PO : la bonne réponse n'a jamais un R/R faible (plan optimal, à son TP)
  const oe = ch.entries[t.optimal.entry], os = ch.stops[t.optimal.stop], ot = ch.tps[t.optimal.tp];
  const rrOpt = Math.abs(ot - oe) / Math.abs(oe - os);
  if (rrOpt < 1.5 - 1e-9) out.push("R/R du plan optimal < 1,5");
  // Règle PO (J11) : TP ambitieux réaliste, entre 3R et 5R du plan optimal
  const rrAmb = Math.abs(ch.tps.ambitious - oe) / Math.abs(oe - os);
  if (rrAmb < 3 - 1e-6 || rrAmb > 5 + 1e-6) out.push(`TP ambitieux à ${rrAmb.toFixed(2)}R (attendu 3 à 5R)`);
  // Leçon avancée du range (« RR < 2 »)
  if (t.id === "range_top_short" && rrOpt >= 2) out.push("range : R/R ≥ 2 alors que la leçon dit « RR < 2 »");
  return out;
}

// La direction est-elle poursuivie après l'entrée ? (dernière clôture future vs prix actuel)
const continues = (ch: BuildTradeChart, buy: boolean) => (buy ? last(ch.future).c > ch.currentPrice : last(ch.future).c < ch.currentPrice);

type Check = (ch: BuildTradeChart, t: BuildTradeTemplate) => string | null;
const SPECIFIC: Record<string, Check> = {
  // « Tendance haussière nette. Le prix vient de finir un pullback. »
  trend_continuation_bull: (ch) => {
    const imp = ch.past.slice(0, 8), pb = ch.past.slice(8);
    if (imp.filter(green).length < 7) return "pas de tendance haussière nette";
    if (!pb.every(red)) return "pas de pullback";
    const z = zone(ch, "support")!;
    if (!(minL(pb) >= lo(z) - E && minL(pb) <= hi(z) + E)) return "« Swing low » ne correspond pas au creux du pullback";
    return continues(ch, true) ? null : "pas de continuation haussière (« dans le sens du momentum »)";
  },
  trend_continuation_bear: (ch) => {
    const imp = ch.past.slice(0, 8), pb = ch.past.slice(8);
    if (imp.filter(red).length < 7) return "pas de tendance baissière nette";
    if (!pb.every(green)) return "pas de rebond";
    const z = zone(ch, "resistance")!;
    if (!(maxH(pb) >= lo(z) - E && maxH(pb) <= hi(z) + E)) return "« Swing high » ne correspond pas au sommet du rebond";
    return continues(ch, false) ? null : "pas de continuation baissière";
  },
  // « vient de casser une résistance HTF avec une bougie impulsive »
  breakout_bull_clean: (ch) => {
    const z = zone(ch, "resistance")!; const k = last(ch.past), before = ch.past.slice(0, -1);
    if (before.some((x) => x.c > hi(z))) return "clôture au-dessus de la résistance avant la cassure";
    if (before.some((x) => x.h > hi(z) + E)) return "résistance déjà percée avant la cassure";
    if (!(green(k) && k.c > hi(z) && k.o < lo(z))) return "la dernière bougie ne casse pas la résistance";
    if (body(k) < 2 * median(before.map(body))) return "pas une « bougie impulsive » (corps < 2× médiane)";
    return continues(ch, true) ? null : "pas de continuation après la cassure";
  },
  breakout_bear_clean: (ch) => {
    const z = zone(ch, "support")!; const k = last(ch.past), before = ch.past.slice(0, -1);
    if (before.some((x) => x.c < lo(z))) return "clôture sous le support avant la cassure";
    if (before.some((x) => x.l < lo(z) - E)) return "support déjà percé avant la cassure";
    if (!(red(k) && k.c < lo(z) && k.o > hi(z))) return "la dernière bougie ne casse pas le support";
    if (body(k) < 2 * median(before.map(body))) return "pas une « bougie impulsive » (corps < 2× médiane)";
    return continues(ch, false) ? null : "pas de continuation après la cassure";
  },
  // « vient de rebondir sur un support HTF avec une mèche claire »
  bounce_support_clean: (ch) => {
    const z = zone(ch, "support")!; const k = last(ch.past);
    if (ch.past.some((x) => x.c < hi(z))) return "clôture sous/dans le support";
    if (ch.past.some((x) => x.l < lo(z) - E)) return "support percé par une mèche (le support ne tient pas)";
    if (!(k.l <= hi(z) + E)) return "la dernière bougie ne touche pas le support";
    if (!(Math.min(k.o, k.c) - k.l >= body(k) - E)) return "pas de « mèche claire » (mèche basse < corps)";
    if (ch.past.filter((x) => x.l <= hi(z) + E).length < 2) return "support pas « testé 2-3 fois »";
    return continues(ch, true) ? null : "pas de rebond confirmé ensuite";
  },
  rejection_resistance_clean: (ch) => {
    const z = zone(ch, "resistance")!; const k = last(ch.past);
    if (ch.past.some((x) => x.c > lo(z))) return "clôture au-dessus/dans la résistance";
    if (ch.past.some((x) => x.h > hi(z) + E)) return "résistance percée par une mèche";
    if (!(k.h >= lo(z) - E)) return "la dernière bougie ne touche pas la résistance";
    if (!(k.h - Math.max(k.o, k.c) >= body(k) - E)) return "pas de mèche de rejet (mèche haute < corps)";
    if (ch.past.filter((x) => x.h >= lo(z) - E).length < 2) return "résistance pas testée plusieurs fois";
    return continues(ch, false) ? null : "pas de rejet confirmé ensuite";
  },
  // « Le prix arrive au plafond d'un range serré »
  range_top_short: (ch) => {
    const r = zone(ch, "resistance")!, s = zone(ch, "support")!;
    if ([...ch.past, ...ch.future].some((k) => k.h > hi(r) + E || k.l < lo(s) - E)) return "le prix sort du range";
    const pos = (last(ch.past).c - hi(s)) / (lo(r) - hi(s));
    if (pos < 2 / 3) return "le prix n'est pas au plafond (tiers haut)";
    return continues(ch, false) ? null : "pas de retour vers le plancher";
  },
  range_bottom_long: (ch) => {
    const r = zone(ch, "resistance")!, s = zone(ch, "support")!;
    if ([...ch.past, ...ch.future].some((k) => k.h > hi(r) + E || k.l < lo(s) - E)) return "le prix sort du range";
    const pos = (last(ch.past).c - hi(s)) / (lo(r) - hi(s));
    if (pos > 1 / 3) return "le prix n'est pas au plancher (tiers bas)";
    return continues(ch, true) ? null : "pas de retour vers le plafond";
  },
  // « a piqué au-dessus de la résistance puis refermé en dessous »
  fake_breakout_short: (ch) => {
    const r = zone(ch, "resistance")!, w = zone(ch, "liquidity_high")!;
    const i = ch.past.findIndex((k) => k.h > hi(r) + E);
    if (i < 0) return "aucune piqûre au-dessus de la résistance";
    const k = ch.past[i];
    if (!(k.c < lo(r))) return "la piqûre ne referme pas sous la résistance";
    if (Math.abs(k.h - hi(w)) > 1e-6) return "la zone « Mèche du fakeout » ne finit pas au sommet de la mèche";
    if (ch.past.slice(i + 1).some((x) => x.c > lo(r))) return "reclôture au-dessus après le piège";
    if (ch.future.some((x) => x.h >= k.h)) return "le futur dépasse le pic du fakeout";
    return continues(ch, false) ? null : "pas de baisse après le piège";
  },
  // « vient de balayer la liquidité sous le précédent low puis a refermé au-dessus »
  sweep_reversal_bull: (ch) => {
    const s = zone(ch, "support")!;
    const i = ch.past.findIndex((k) => k.l < lo(s) - E);
    if (i < 0) return "aucune mèche sous le précédent low";
    if (i < ch.past.length - 3) return "sweep pas récent";
    const before = ch.past.slice(0, i);
    if (!before.some((k) => k.l <= hi(s) + E)) return "aucun « précédent low » au niveau de la zone";
    if (!(ch.past[i].c > hi(s))) return "pas de clôture au-dessus du low balayé";
    return continues(ch, true) ? null : "pas de retournement haussier";
  },
  // « revient tester un FVG haussier. La réaction est en cours. »
  fvg_continuation_bull: (ch) => {
    const z = zone(ch, "fvg")!;
    let gap = -1;
    for (let i = 1; i < ch.past.length - 1; i++) {
      if (ch.past[i + 1].l > ch.past[i - 1].h && lo(z) >= ch.past[i - 1].h - 1e-6 && hi(z) <= ch.past[i + 1].l + 1e-6 && green(ch.past[i])) { gap = i; break; }
    }
    if (gap < 0) return "la zone ne correspond à aucun gap réel";
    const after = ch.past.slice(gap + 2);
    if (!(minL(after) <= hi(z) + E)) return "le prix ne revient pas dans le FVG";
    if (after.some((k) => k.c < lo(z))) return "clôture sous le FVG (cassé)";
    if (!green(last(ch.past))) return "pas de réaction en cours (dernière bougie non verte)";
    if (ch.future.some((k) => k.l < lo(z) - E)) return "le futur casse le FVG";
    return continues(ch, true) ? null : "pas de continuation";
  },
  // « la bougie est petite et hésitante »
  weak_breakout_setup: (ch) => {
    const z = zone(ch, "resistance")!; const k = last(ch.past), prev = ch.past[ch.past.length - 2];
    if (!(k.c > hi(z) && prev.c <= hi(z))) return "pas de cassure sur la dernière bougie";
    if (ch.past.slice(0, -1).some((x) => x.c > hi(z))) return "clôture au-dessus avant la cassure";
    if (!(body(k) <= 0.4 * range(k))) return "bougie de cassure pas « petite et hésitante » (corps > 40 %)";
    return null;
  },
  // « Plus de 60% de l'impulsion précédente est retracée. »
  deep_pullback_risky: (ch) => {
    const imp = ch.past.slice(0, 8);
    const start = imp[0].o, peak = last(imp).c;
    const ret = (peak - last(ch.past).c) / (peak - start);
    if (!(ret > 0.6)) return "retracement ≤ 60 % de l'impulsion";
    const h = zone(ch, "liquidity_high")!;
    if (!(maxH(ch.past) <= hi(h) + E && maxH(ch.past) >= lo(h) - E)) return "« Plus haut précédent » ne contient pas le sommet";
    if (ret >= 1) return "retracement ≥ 100 % (plus un pullback)";
    return null;
  },
  // « Stop standard se fait balayer. Le 'wide stop' devient le stop LOGIQUE. »
  high_vol_setup: (ch) => {
    const dip = minL(ch.future);
    if (!(dip <= ch.stops.logical)) return "le stop standard (logique) n'est pas balayé";
    if (!(dip > ch.stops.wide)) return "le stop large est touché";
    return continues(ch, true) ? null : "pas de continuation";
  },
  // « Un setup BUY apparaît localement » + « Le TP rapide capture l'edge avant le reversal »
  counter_trend_local: (ch, t) => {
    const d = ch.past.slice(0, 8), b = ch.past.slice(8);
    if (d.filter(red).length < 7) return "pas de HTF baissier visible";
    if (!b.every(green)) return "pas de rebond local";
    const i = ch.future.findIndex((k) => k.h >= ch.tps.fast);
    const top = ch.future.reduce((b, k, j) => (k.h > ch.future[b].h ? j : b), 0);
    if (i < 0 || i > top) return "TP rapide jamais atteint avant le reversal";
    if (FR.evaluateTrade(t.optimal, ch, t.optimal, 0).outcome !== "tp_hit") return "plan optimal : TP rapide non atteint";
    return last(ch.future).c < ch.currentPrice ? null : "pas de reversal (échec du rebond)";
  },
};

// Issue du plan optimal (indicateur de préservation, pas un critère)
const outcomes: Record<string, Record<string, number>> = {};
let total = 0; const rows: string[] = [];
for (const t of G.BUILD_TRADE_TEMPLATES as BuildTradeTemplate[]) {
  const frT = FR.BUILD_TRADE_TEMPLATES.find((x) => x.id === t.id)!;
  for (const d of t.difficulties as readonly Difficulty[]) {
    const fails: Record<string, number> = {}; let bad = 0; let dojis = 0;
    const oc: Record<string, number> = { tp_hit: 0, sl_hit: 0, open: 0, no_fill: 0 };
    for (let n = 0; n < N; n++) {
      const seed = (n * 2654435761 + t.id.length * 97 + d.length) >>> 0;
      const vol = t.chartShape === "high_vol_pullback" ? "élevée" : VOLS[n % 3];
      const ch = G.buildBuildTradeChart(t, seed, vol, auditCtx(seed));
      const frCh = LOC === "fr" ? ch : FR.buildBuildTradeChart(frT, seed, vol, auditCtx(seed));
      const reasons = generic(ch, t);
      if (LOC !== "fr") {
        const strip = (c: BuildTradeChart) => JSON.stringify({ p: c.past, f: c.future, e: c.entries, s: c.stops, t: c.tps, z: c.zones.map((z) => [z.kind, z.y1, z.y2]) });
        if (strip(ch) !== strip(frCh)) reasons.push(`[${LOC}] données différentes du FR`);
      }
      const sp = SPECIFIC[t.id]?.(frCh, frT); if (sp) reasons.push(sp);
      dojis += [...ch.past, ...ch.future].filter((k) => k.c === k.o).length;
      oc[FR.evaluateTrade(t.optimal, frCh, t.optimal, 0).outcome]++;
      if (reasons.length) { bad++; reasons.forEach((r) => (fails[r] = (fails[r] ?? 0) + 1)); }
    }
    total += bad;
    outcomes[`${t.id} ${d}`] = oc;
    const top = Object.entries(fails).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([r, c]) => `${r} (${c})`).join(" | ");
    rows.push(`${t.id.padEnd(27)} ${d.padEnd(13)} ${String(bad).padStart(4)}/${N} = ${((100 * bad) / N).toFixed(1).padStart(5)} %  dojis:${String(dojis).padStart(3)}  ${top}`);
  }
}
console.log(`=== Audit Build the Trade ${LOC.toUpperCase()} — ${N} rounds par scénario × difficulté ===`);
console.log(rows.join("\n"));
console.log(`TOTAL rounds incohérents : ${total}`);
console.log("\n=== Issue du plan optimal (tp / sl / ouvert / non rempli) ===");
for (const [k, v] of Object.entries(outcomes)) console.log(`${k.padEnd(42)} ${String(v.tp_hit).padStart(4)} ${String(v.sl_hit).padStart(4)} ${String(v.open).padStart(4)} ${String(v.no_fill).padStart(4)}`);
