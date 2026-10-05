// Audit cohérence texte / données — Place ton Stop.
// Usage : npx vite-node scripts/audit-jeux/coherence-ps.ts [fr|en|es] (lancé par run.mjs)
import * as FR from "../../lib/games/place-stop";
import { auditCtx } from "./market-ctx";
import * as EN from "../../lib/games/place-stop-en";
import * as ES from "../../lib/games/place-stop-es";
import type { Candle, ChartZone, PlaceStopChart, PlaceStopTemplate, StopOption } from "../../lib/games/place-stop";

const LOC = (process.argv[2] ?? "fr") as "fr" | "en" | "es";
const ZONES = process.argv.includes("--zones");
const G = LOC === "en" ? EN : LOC === "es" ? ES : FR;
const N = 500;
const VOLS = ["faible", "normale", "élevée"] as const;
const E = 1e-9;

const lo = (z: ChartZone) => Math.min(z.y1, z.y2);
const hi = (z: ChartZone) => Math.max(z.y1, z.y2);
const last = <T,>(a: T[]) => a[a.length - 1];
const zone = (ch: PlaceStopChart, re: RegExp) => ch.zones.find((z) => re.test(z.label));

// Stop touché par le futur (même règle que le jeu)
const hitIdx = (price: number, ch: PlaceStopChart) => ch.future.findIndex((k) => (ch.direction === "BUY" ? k.l <= price : k.h >= price));
const correctType = (ch: PlaceStopChart) => (ch.stops.some((s) => s.type === "logical") ? "logical" : "wide");

type Check = (ch: PlaceStopChart, t: PlaceStopTemplate) => string | null;

const RR_EXCEPT = new Set((process.env.RR_EXCEPT ?? "").split(",").filter(Boolean));
let TPL_ID = "";
function generic(ch: PlaceStopChart): string[] {
  const out: string[] = [];
  const all = [...ch.past, ...ch.future];
  for (let i = 0; i < all.length; i++) {
    const k = all[i];
    if (i > 0 && Math.abs(k.o - all[i - 1].c) > E) { out.push("[dure] continuité rompue"); break; }
  }
  if (all.some((k) => k.h < Math.max(k.o, k.c) - E || k.l > Math.min(k.o, k.c) + E)) out.push("[dure] OHLC invalide");
  if (Math.abs(ch.entry - last(ch.past).c) > E) out.push("entrée ≠ dernière clôture (« tu es entré »)");
  if (ch.stops.length !== 3) out.push("pas 3 stops");
  if (Math.min(...ch.stops.map((s) => s.price), ...all.map((k) => k.l), ch.entry, ...ch.zones.map((z) => lo(z))) <= 0) out.push("[dure] prix affiché ≤ 0");
  const side = (s: StopOption) => (ch.direction === "BUY" ? s.price < ch.entry : s.price > ch.entry);
  if (!ch.stops.every(side)) out.push("stop du mauvais côté de l'entrée");
  const prices = ch.stops.map((s) => s.price).sort((a, b) => a - b);
  if (prices[1] - prices[0] < 1e-6 || prices[2] - prices[1] < 1e-6) out.push("deux stops au même prix");
  // Affirmations des rationales : ✗ = balayé, ✓ / ≈ = survit
  for (const s of ch.stops) {
    const hit = hitIdx(s.price, ch) >= 0;
    const r = s.rationale.trim();
    if (r.startsWith("✗") && !hit) out.push(`stop ${s.type} « ✗ … balayé » jamais touché`);
    if ((r.startsWith("✓") || r.startsWith("≈")) && hit) out.push(`stop ${s.type} « ${r[0]} … survit » touché`);
  }
  // Le bon stop existe et survit
  const ct = correctType(ch);
  const good = ch.stops.filter((s) => s.type === ct);
  if (good.length !== 1) out.push(`bon stop (${ct}) absent ou multiple`);
  // Règle PO : le bon stop n'a jamais un R/R faible (sauf consolidation serrée, signalée)
  if (good.length === 1 && ch.tp !== null && process.env.RR_EXCEPT !== undefined) {
    const rr = Math.abs(ch.tp - ch.entry) / Math.abs(ch.entry - good[0].price);
    if (rr < 2 && !RR_EXCEPT.has(TPL_ID)) out.push("R/R du bon stop < 2");
  }
  // Le trade part dans le sens annoncé (le bon stop « capture » le move)
  const endC = last(ch.future).c;
  if (ch.direction === "BUY" ? !(endC > ch.entry) : !(endC < ch.entry)) out.push("suite dans le mauvais sens");
  // Stop « trop large » classique : RR plus faible que le logique (plus loin de l'entrée)
  const lg = ch.stops.find((s) => s.type === "logical"); const wd = ch.stops.find((s) => s.type === "wide");
  if (lg && wd && Math.abs(wd.price - ch.entry) <= Math.abs(lg.price - ch.entry)) out.push("stop large pas plus loin que le logique");
  return out;
}

// Swings : minima / maxima locaux (fenêtre ±1)
const swingLows = (c: Candle[]) => c.map((k, i) => ({ i, l: k.l })).filter(({ i }) => i > 0 && i < c.length - 1 && c[i].l < c[i - 1].l && c[i].l <= c[i + 1].l);
const swingHighs = (c: Candle[]) => c.map((k, i) => ({ i, h: k.h })).filter(({ i }) => i > 0 && i < c.length - 1 && c[i].h > c[i - 1].h && c[i].h >= c[i + 1].h);

const SPECIFIC: Record<string, Check> = {
  bounce_support: (ch) => { const z = ch.zones[0]; if (!z) return "pas de zone support"; return ch.past.slice(-3).some((k) => k.l <= hi(z) + E) && last(ch.past).c > hi(z) ? null : "pas de rebond sur le support (mèche dans la zone puis clôture au-dessus)"; },
  rejection_resistance: (ch) => { const z = ch.zones[0]; if (!z) return "pas de zone résistance"; return ch.past.slice(-3).some((k) => k.h >= lo(z) - E) && last(ch.past).c < lo(z) ? null : "pas de rejet de la résistance (mèche dans la zone puis clôture dessous)"; },
  fakeout_above_resistance: (ch) => { const z = zone(ch, /sist/i) ?? ch.zones[0]; if (!z) return "pas de zone"; return ch.past.slice(-4).some((k) => k.h > hi(z) && k.c < hi(z)) && last(ch.past).c < hi(z) ? null : "pas de piqûre au-dessus de la résistance refermée dessous"; },
  sweep_low_reversal: (ch) => {
    const z = zone(ch, /Plus bas précédent/); if (!z) return "pas de zone plus bas précédent";
    const i = ch.past.findIndex((k) => k.l < lo(z) - E);
    if (i < 0) return "aucune mèche sous le précédent low";
    if (ch.past.slice(0, i).some((k) => k.c < lo(z))) return "clôture sous le low avant le sweep";
    return ch.past[i].c > hi(z) && ch.past.slice(i).every((k) => k.c > hi(z)) ? null : "pas de demi-tour au-dessus du low balayé";
  },
  equal_lows_trap: (ch) => {
    const z = zone(ch, /Equal lows/); if (!z) return "pas de zone equal lows";
    if (ch.past.some((k) => k.l < lo(z) - E)) return "un low du passé sous la zone des equal lows";
    return swingLows(ch.past).filter((x) => x.l >= lo(z) - E && x.l <= hi(z) + E).length >= 2 ? null : "pas deux lows quasi égaux dans la zone";
  },
  asia_high_sweep: (ch) => { const z = zone(ch, /session asiatique/); if (!z) return "pas de zone"; return ch.past.every((k) => k.h <= hi(z) + E) ? null : "le range Asia est déjà cassé (high au-dessus de l'Asia high)"; },
  round_number_sweep: (ch) => { const z = zone(ch, /Niveau psychologique/); if (!z) return "pas de zone"; return ch.past.slice(-3).every((k) => k.l >= lo(z) - E) && last(ch.past).c > hi(z) ? null : "le prix ne flotte pas au-dessus du chiffre rond"; },
  prev_day_low_trap: (ch) => { const z = zone(ch, /PDL/); if (!z) return "pas de zone"; return ch.past.every((k) => k.l >= lo(z) - E) && last(ch.past).c > hi(z) ? null : "le PDL est déjà balayé dans le passé"; },
  multi_swing_low: (ch) => { const s = swingLows(ch.past.slice(-15)); return s.length >= 2 && s.some((a, i) => s.slice(i + 1).some((b) => b.l < a.l)) ? null : "pas 2 swing lows dont le second plus bas"; },
  multi_swing_deep: (ch) => { const s = swingLows(ch.past.slice(-15)).map((x) => x.l); for (let i = 0; i + 2 < s.length; i++) if (s[i + 1] < s[i] && s[i + 2] < s[i + 1]) return null; return "pas 3 swing lows successivement plus bas"; },
  multi_swing_high_deep: (ch) => { const s = swingHighs(ch.past.slice(-15)).map((x) => x.h); for (let i = 0; i + 2 < s.length; i++) if (s[i + 1] > s[i] && s[i + 2] > s[i + 1]) return null; return "pas 3 swing highs successivement plus hauts"; },
  fakeout_then_retest: (ch) => { const z = zone(ch, /Swing high/); if (!z) return "pas de zone"; return ch.past.some((k) => k.h > hi(z) && k.c < hi(z)) && last(ch.past).c < hi(z) ? null : "pas de fakeout visible (mèche qui casse puis retour sous)"; },
  fakeout_zone_wide: (ch) => { const z = zone(ch, /^Résistance/); if (!z) return "pas de zone"; return ch.past.filter((k) => k.h > hi(z) && k.c < hi(z)).length >= 2 ? null : "moins de 2 fakeouts sur la résistance"; },
  key_level_magnet: (ch) => { const z = ch.zones[0]; if (!z) return "pas de niveau"; return ch.future.some((k) => k.l <= hi(z)) ? null : "le prix ne va pas toucher le niveau"; },
  key_level_magnet_sell: (ch) => { const z = ch.zones[0]; if (!z) return "pas de niveau"; return ch.future.some((k) => k.h >= lo(z)) ? null : "le prix ne va pas toucher le niveau"; },
  fvg_continuation: (ch) => {
    const z = zone(ch, /FVG/i); if (!z) return "pas de zone FVG";
    for (let i = 1; i < ch.past.length - 1; i++) {
      const gLo = ch.past[i - 1].h, gHi = ch.past[i + 1].l;
      if (gHi > gLo && lo(z) >= gLo - 1e-6 && hi(z) <= gHi + 1e-6) {
        const after = ch.past.slice(i + 2);
        if (!after.some((k) => k.l <= hi(z))) return "le prix ne retest pas le FVG";
        if (after.some((k) => k.c < lo(z))) return "clôture sous le FVG";
        return null;
      }
    }
    return "la zone ne correspond à aucun gap réel";
  },
  tight_consolidation: (ch) => { const s = zone(ch, /support|bas|bottom|plancher/i), r = zone(ch, /sist|haut|top|plafond/i); if (!s || !r) return null; const w = lo(r) - hi(s); const legs = ch.past.slice(-8); return legs.every((k) => k.c >= lo(s) - 1e-6 && k.c <= hi(r) + 1e-6) && w > 0 ? null : "le prix sort du range serré"; },
};

let total = 0;
const rows: string[] = [];
const distLabel: Record<string, Record<string, number>> = {};
const distPos: Record<string, Record<string, number>> = {};
const zoneInv: Record<string, Set<string>> = {};

for (const t of G.PLACE_STOP_TEMPLATES) {
  for (const d of t.difficulties) {
    const fails: Record<string, number> = {}; let bad = 0; let dojis = 0;
    for (let n = 0; n < N; n++) {
      const seed = (n * 2654435761 + t.id.length * 97 + d.length) >>> 0;
      const vol = t.id === "high_vol_pullback" ? "élevée" : VOLS[n % 3];
      TPL_ID = t.id;
      const ch = G.buildPlaceStopChart(t.id, seed, vol, d, auditCtx(seed));
      const frCh = LOC === "fr" ? ch : FR.buildPlaceStopChart(t.id, seed, vol, d, auditCtx(seed));
      const reasons = generic(ch);
      if (LOC !== "fr") {
        const strip = (c: PlaceStopChart) => JSON.stringify({ p: c.past, f: c.future, e: c.entry, tp: c.tp, s: c.stops.map((x) => [x.id, x.type, x.price]), z: c.zones.map((z) => [z.kind, z.y1, z.y2]) });
        if (strip(ch) !== strip(frCh)) reasons.push("[" + LOC + "] données différentes du FR");
      }
      const sp = SPECIFIC[t.id]?.(frCh, t); if (sp) reasons.push(sp);
      dojis += [...ch.past, ...ch.future].filter((k) => k.c === k.o).length;
      if (reasons.length) { bad++; reasons.forEach((r) => (fails[r] = (fails[r] ?? 0) + 1)); }
      const good = ch.stops.find((s) => s.type === correctType(ch));
      if (good) {
        (distLabel[d] ??= {})[good.id] = ((distLabel[d] ??= {})[good.id] ?? 0) + 1;
        const pos = ch.stops.indexOf(good); // 0 = haut du graphique
        (distPos[d] ??= {})[pos] = ((distPos[d] ??= {})[pos] ?? 0) + 1;
      }
      (zoneInv[t.id] ??= new Set()).add(ch.zones.map((z) => `${z.kind}:${z.label}`).join(" | "));
    }
    total += bad;
    const top = Object.entries(fails).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([r, c]) => `${r} (${c})`).join(" | ");
    rows.push(`${t.id.padEnd(28)} ${d.padEnd(13)} ${String(bad).padStart(4)}/${N} = ${((100 * bad) / N).toFixed(1).padStart(5)} %  dojis:${String(dojis).padStart(3)}  ${top}`);
  }
}
console.log(`=== Audit Place ton Stop ${LOC.toUpperCase()} — ${N} rounds par scénario × difficulté ===`);
console.log(rows.join("\n"));
console.log(`TOTAL rounds incohérents : ${total}`);
const pct = (o: Record<string, number>) => { const s = Object.values(o).reduce((a, b) => a + b, 0); return Object.entries(o).sort().map(([k, v]) => `${k}:${((100 * v) / s).toFixed(1)}%`).join("  "); };
console.log("\n--- Distribution du libellé du bon stop (A/B/C → affichés 1/2/3) ---");
for (const d of Object.keys(distLabel)) console.log(`${d.padEnd(13)} ${pct(distLabel[d])}`);
console.log("--- Distribution spatiale du bon stop (0 = haut, 1 = milieu, 2 = bas) ---");
for (const d of Object.keys(distPos)) console.log(`${d.padEnd(13)} ${pct(distPos[d])}`);
if (ZONES) { console.log("\n--- Zones par scénario ---"); for (const [k, v] of Object.entries(zoneInv)) console.log(`${k}: ${[...v].slice(0, 2).join("  ||  ")}`); }
