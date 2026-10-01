// Audit cohérence texte / données — Trouve l'erreur.
// Usage : npx vite-node scripts/audit-jeux/coherence-ftm.ts [fr|en|es] (lancé par run.mjs)
import * as FR from "../../lib/games/find-the-mistake";
import * as EN from "../../lib/games/find-the-mistake-en";
import * as ES from "../../lib/games/find-the-mistake-es";
import type { Candle, ChartZone, Difficulty, MistakeTemplate, ScenarioChart } from "../../lib/games/find-the-mistake";

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
const kindZone = (ch: ScenarioChart, kind: ChartZone["kind"]) => ch.zones.find((z) => z.kind === kind);

type Check = (ch: ScenarioChart, t: MistakeTemplate) => string | null;

function generic(ch: ScenarioChart, t: MistakeTemplate): string[] {
  const out: string[] = [];
  const all = [...ch.past, ...ch.future];
  for (let i = 1; i < all.length; i++) if (Math.abs(all[i].o - all[i - 1].c) > E) { out.push("[dure] continuité rompue"); break; }
  if (all.some((k) => k.h < Math.max(k.o, k.c) - E || k.l > Math.min(k.o, k.c) + E)) out.push("[dure] OHLC invalide");
  if (t.showLines && ch.entry === undefined) out.push("ligne d'entrée annoncée mais absente");
  if (ch.entry !== undefined && Math.abs(ch.entry - last(ch.past).c) > E) out.push("entrée ≠ dernière clôture (« tu prends ce trade maintenant »)");
  const buy = t.direction === "BUY";
  if (ch.stop !== undefined && ch.entry !== undefined && (buy ? ch.stop >= ch.entry : ch.stop <= ch.entry)) out.push("stop du mauvais côté de l'entrée");
  if (ch.tp !== undefined && ch.entry !== undefined && (buy ? ch.tp <= ch.entry : ch.tp >= ch.entry)) out.push("TP du mauvais côté de l'entrée");
  return out;
}

// Tests d'un niveau : mèche qui atteint la zone, clôture de l'autre côté
const testsRes = (c: Candle[], z: ChartZone) => c.filter((k) => k.h >= lo(z) - E && k.c < lo(z)).length;
const testsSup = (c: Candle[], z: ChartZone) => c.filter((k) => k.l <= hi(z) + E && k.c > hi(z)).length;

function realFvg(ch: ScenarioChart): { i: number } | null {
  const z = kindZone(ch, "fvg"); if (!z) return null;
  for (let i = 1; i < ch.past.length - 1; i++) {
    const gLo = ch.past[i - 1].h, gHi = ch.past[i + 1].l;
    if (gHi > gLo && lo(z) >= gLo - 1e-6 && hi(z) <= gHi + 1e-6 && ch.past[i].c > ch.past[i].o) return { i };
  }
  return null;
}

const SPECIFIC: Record<string, Check> = {
  buy_in_resistance: (ch) => {
    const z = kindZone(ch, "resistance")!; const k = last(ch.past);
    if (!(k.c < lo(z))) return "l'entrée n'est pas sous la résistance";
    if (lo(z) - k.c > 3 * median(ch.past.map(body))) return "l'entrée n'est pas « pile sous » la résistance";
    return testsRes(ch.past, z) >= 2 ? null : "résistance pas « testée plusieurs fois » (< 2 tests)";
  },
  sell_in_support: (ch) => {
    const z = kindZone(ch, "support")!; const k = last(ch.past);
    if (!(k.c > hi(z))) return "l'entrée n'est pas au-dessus du support";
    if (k.c - hi(z) > 3 * median(ch.past.map(body))) return "l'entrée n'est pas « pile au-dessus » du support";
    return testsSup(ch.past, z) >= 2 ? null : "support pas « testé plusieurs fois » (< 2 tests)";
  },
  trade_against_htf: (ch) => {
    const t = ch.past.slice(0, 8), r = ch.past.slice(8);
    if (!(last(t).c < t[0].o && t.filter((k) => k.c < k.o).length >= 6)) return "pas de tendance baissière nette";
    return last(r).c > r[0].o ? null : "pas de rebond local";
  },
  stop_too_tight: (ch) => {
    const z = kindZone(ch, "support")!; if (ch.stop === undefined || ch.entry === undefined) return "pas de stop";
    if (!(ch.stop > hi(z))) return "le stop n'est pas au-dessus du swing low";
    return ch.stop - hi(z) < ch.entry - ch.stop ? null : "le stop n'est pas « juste au-dessus » du swing low";
  },
  range_middle: (ch) => {
    const r = kindZone(ch, "resistance")!, s = kindZone(ch, "support")!;
    if (ch.past.some((k) => k.h > hi(r) || k.l < lo(s))) return "le prix sort du range";
    const mid = (lo(r) + hi(s)) / 2, third = (lo(r) - hi(s)) / 3;
    return Math.abs(last(ch.past).c - mid) <= third / 2 ? null : "l'entrée n'est pas « au milieu » du range";
  },
  stop_in_liquidity: (ch) => {
    const z = kindZone(ch, "resistance")!; if (ch.stop === undefined || ch.entry === undefined) return "pas de stop";
    if (!(ch.stop > hi(z))) return "le stop n'est pas au-dessus du swing high";
    return ch.stop - hi(z) < (ch.stop - ch.entry) / 2 ? null : "le stop n'est pas « juste au-dessus » du swing high";
  },
  bad_rr: (ch) => {
    if (ch.stop === undefined || ch.tp === undefined || ch.entry === undefined) return "pas de stop/TP";
    return Math.abs(ch.tp - ch.entry) < Math.abs(ch.entry - ch.stop) ? null : "le TP n'est pas « très proche » (R/R ≥ 1)";
  },
  weak_breakout: (ch) => {
    const z = kindZone(ch, "resistance")!; const k = last(ch.past), prev = ch.past[ch.past.length - 2];
    if (!(k.c > hi(z) && prev.c <= hi(z))) return "pas de cassure de la résistance sur la dernière bougie";
    return body(k) <= 0.4 * range(k) ? null : "la bougie de cassure n'est pas « minuscule » (corps > 40 %)";
  },
  volatility_ignored: (ch) => {
    if (ch.stop === undefined || ch.entry === undefined) return "pas de stop";
    return ch.entry - ch.stop < median(ch.past.map(range)) ? null : "le stop n'est pas dans le bruit (plus loin que l'amplitude médiane)";
  },
  fomo_after_pump: (ch) => {
    const l3 = ch.past.slice(-3), base = ch.past.slice(0, 8);
    if (!l3.every((k) => k.c > k.o)) return "les 3 dernières bougies ne sont pas toutes haussières";
    return l3.every((k) => body(k) >= 2 * median(base.map(body))) ? null : "pas de « pump » (corps < 2× la base)";
  },
  sweep_ignored: (ch) => {
    const z = ch.zones.find((x) => x.kind === "support"); if (!z) return "pas de zone";
    const i = ch.past.findIndex((k) => k.l < lo(z) - E);
    if (i < 0) return "aucune mèche sous le précédent low";
    if (i < ch.past.length - 3) return "sweep pas récent (« vient de balayer »)";
    if (ch.past.slice(0, i).some((k) => k.c < lo(z))) return "clôture sous le low avant le sweep";
    const k = ch.past[i];
    if (!(k.c > hi(z))) return "pas de clôture au-dessus du low balayé";
    return Math.min(k.o, k.c) - k.l >= body(k) ? null : "mèche du sweep pas « grosse » (< corps)";
  },
  mitigation_misread: (ch) => {
    const f = realFvg(ch); if (!f) return "la zone ne correspond à aucun gap réel";
    const z = kindZone(ch, "fvg")!; const after = ch.past.slice(f.i + 2); const h = hi(z) - lo(z);
    if (!(Math.min(...after.map((k) => k.l)) <= hi(z) - 0.85 * h)) return "mitigation < 85 %";
    if (after.some((k) => k.c < lo(z) - E)) return "clôture sous le FVG (cassé, pas mitigé)";
    return last(ch.past).c <= lo(z) + 0.25 * h ? null : "réaction visible (dernière clôture hors du fond de zone)";
  },
};

let total = 0; const rows: string[] = [];
for (const t of G.MISTAKE_TEMPLATES) {
  const frT = FR.MISTAKE_TEMPLATES.find((x) => x.id === t.id)!;
  for (const d of t.difficulties as readonly Difficulty[]) {
    const fails: Record<string, number> = {}; let bad = 0; let dojis = 0;
    for (let n = 0; n < N; n++) {
      const seed = (n * 2654435761 + t.id.length * 97 + d.length) >>> 0;
      const vol = t.metaOverride?.volatility ?? (t.macroContext === "dangereux" ? "élevée" : VOLS[n % 3]);
      const ch = G.buildScenarioChart(t, seed, vol);
      const frCh = LOC === "fr" ? ch : FR.buildScenarioChart(frT, seed, vol);
      const reasons = generic(ch, t);
      if (LOC !== "fr") {
        const strip = (c: ScenarioChart) => JSON.stringify({ p: c.past, f: c.future, e: c.entry, s: c.stop, tp: c.tp, z: c.zones.map((z) => [z.kind, z.y1, z.y2]) });
        if (strip(ch) !== strip(frCh)) reasons.push(`[${LOC}] données différentes du FR`);
      }
      const sp = SPECIFIC[t.id]?.(frCh, frT); if (sp) reasons.push(sp);
      dojis += ch.past.filter((k) => k.c === k.o).length;
      if (reasons.length) { bad++; reasons.forEach((r) => (fails[r] = (fails[r] ?? 0) + 1)); }
    }
    total += bad;
    const top = Object.entries(fails).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([r, c]) => `${r} (${c})`).join(" | ");
    rows.push(`${t.id.padEnd(28)} ${d.padEnd(13)} ${String(bad).padStart(4)}/${N} = ${((100 * bad) / N).toFixed(1).padStart(5)} %  dojis:${String(dojis).padStart(3)}  ${top}`);
  }
}
console.log(`=== Audit Trouve l'erreur ${LOC.toUpperCase()} — ${N} rounds par scénario × difficulté ===`);
console.log(rows.join("\n"));
console.log(`TOTAL rounds incohérents : ${total}`);
