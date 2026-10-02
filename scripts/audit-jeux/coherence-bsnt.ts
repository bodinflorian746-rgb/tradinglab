// Audit de cohérence texte / données — BUY / SELL / NO TRADE.
// Usage : npx vite-node scripts/audit-jeux/coherence-bsnt.ts [fr|en|es] (lancé par run.mjs)
// 500 rounds par type et par difficulté jouable (template.difficulties).
// Pour chaque type : les affirmations de son texte (context), vérifiées sur les
// bougies, + direction de la suite cohérente avec la bonne réponse (BUY/SELL),
// + règles dures (continuité, OHLC valide, couleur = mouvement / doji neutre).
import * as FR from "../../lib/games/buy-sell-no-trade";
import { auditCtx } from "./market-ctx";
import * as EN from "../../lib/games/buy-sell-no-trade-en";
import * as ES from "../../lib/games/buy-sell-no-trade-es";
import type { BuySellChart, Candle, ChartZone, Difficulty, ScenarioTemplate, Volatility } from "../../lib/games/buy-sell-no-trade";

const LOC = (process.argv[2] ?? "fr") as "fr" | "en" | "es";
const G = LOC === "en" ? EN : LOC === "es" ? ES : FR;
const N = 500;
const VOLS: Volatility[] = ["faible", "normale", "élevée"];

type Check = (ch: BuySellChart, t: ScenarioTemplate, d: Difficulty) => string | null; // null = OK, sinon raison

const body = (k: Candle) => Math.abs(k.c - k.o);
const range = (k: Candle) => k.h - k.l;
const lo = (z: ChartZone) => Math.min(z.y1, z.y2);
const hi = (z: ChartZone) => Math.max(z.y1, z.y2);
const zoneOf = (ch: BuySellChart, kind: ChartZone["kind"]) => ch.zones.find((z) => z.kind === kind)!;
const median = (a: number[]) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
const last = <T,>(a: T[]) => a[a.length - 1];

// Direction de la suite vs bonne réponse (la révélation doit donner raison au joueur)
const direction: Check = (ch, t) => {
  const start = last(ch.past).c; const end = last(ch.future).c;
  if (t.correctAnswer === "BUY" && !(end > start)) return "suite non haussière alors que BUY attendu";
  if (t.correctAnswer === "SELL" && !(end < start)) return "suite non baissière alors que SELL attendu";
  return null;
};

// Cassure franche : clôture au-delà de la zone, corps ≥ 1,5× la médiane des corps précédents
function cleanBreak(ch: BuySellChart, kind: "resistance" | "support"): string | null {
  const z = zoneOf(ch, kind);
  const i = ch.past.findIndex((k) => kind === "resistance" ? k.c > hi(z) : k.c < lo(z));
  if (i < 0) return "aucune clôture au-delà de la zone (pas de cassure)";
  if (i < ch.past.length - 2) return "cassure trop ancienne (« vient de casser »)";
  const before = ch.past.slice(0, i);
  const consol = before.slice(-4);
  if (consol.some((k) => kind === "resistance" ? k.c > hi(z) : k.c < lo(z))) return "la consolidation clôture déjà au-delà";
  if (body(ch.past[i]) < 1.5 * median(before.map(body))) return "bougie de cassure sans force (corps < 1,5× médiane)";
  return null;
}

// Rejets : mèches qui entrent dans la zone puis clôture en-deçà
function rejections(ch: BuySellChart, kind: "resistance" | "support", from: number): number {
  const z = zoneOf(ch, kind);
  return ch.past.slice(from).filter((k) => kind === "resistance" ? k.h >= lo(z) && k.c < lo(z) : k.l <= hi(z) && k.c > hi(z)).length;
}

// FVG haussier : un vrai gap entre high(i-1) et low(i+1) qui contient la zone
function bullFvg(ch: BuySellChart): { i: number; gapLo: number; gapHi: number } | null {
  const z = zoneOf(ch, "fvg");
  for (let i = 1; i < ch.past.length - 1; i++) {
    const gapLo = ch.past[i - 1].h; const gapHi = ch.past[i + 1].l;
    if (gapHi > gapLo && lo(z) >= gapLo - 1e-9 && hi(z) <= gapHi + 1e-9 && ch.past[i].c > ch.past[i].o) return { i, gapLo, gapHi };
  }
  return null;
}

const CHECKS: Record<string, Record<string, Check>> = {
  breakout_bullish_clean: { "cassure nette (sous la résistance puis bougie impulsive au-dessus)": (ch) => cleanBreak(ch, "resistance"), direction },
  breakout_bearish_clean: { "cassure nette (au-dessus du support puis bougie impulsive en dessous)": (ch) => cleanBreak(ch, "support"), direction },
  false_breakout_bullish: {
    "vient de casser au-dessus de la résistance": (ch) => last(ch.past).c > hi(zoneOf(ch, "resistance")) ? null : "dernière clôture pas au-dessus de la résistance",
    direction,
  },
  false_breakout_bearish: {
    "vient de casser sous le support": (ch) => last(ch.past).c < lo(zoneOf(ch, "support")) ? null : "dernière clôture pas sous le support",
    direction,
  },
  pullback_bullish_trend: {
    "tendance haussière établie": (ch) => { const t = ch.past.slice(0, 8); return last(t).c > t[0].o && t.filter((k) => k.c > k.o).length >= 6 ? null : "pas de tendance haussière nette"; },
    "corrige jusqu'à la zone de demande": (ch) => { const z = zoneOf(ch, "support"); return ch.past.slice(8).some((k) => k.l <= hi(z)) ? null : "la correction n'atteint pas la zone de demande"; },
    direction,
  },
  pullback_bearish_trend: {
    "tendance baissière établie": (ch) => { const t = ch.past.slice(0, 8); return last(t).c < t[0].o && t.filter((k) => k.c < k.o).length >= 6 ? null : "pas de tendance baissière nette"; },
    "rebondit jusqu'à la zone d'offre": (ch) => { const z = zoneOf(ch, "resistance"); return ch.past.slice(8).some((k) => k.h >= lo(z)) ? null : "le rebond n'atteint pas la zone d'offre"; },
    direction,
  },
  rejection_resistance: {
    "arrive sur la résistance": (ch) => last(ch.past).h >= lo(zoneOf(ch, "resistance")) ? null : "la dernière bougie n'atteint pas la résistance",
    "la zone a déjà rejeté plusieurs fois (≥ 2)": (ch) => rejections(ch, "resistance", 6) >= 2 ? null : "moins de 2 rejets dans la zone",
    direction,
  },
  bounce_support: {
    "arrive sur le support": (ch) => last(ch.past).l <= hi(zoneOf(ch, "support")) ? null : "la dernière bougie n'atteint pas le support",
    "la zone a déjà tenu plusieurs fois (≥ 2)": (ch) => rejections(ch, "support", 6) >= 2 ? null : "moins de 2 rebonds dans la zone",
    direction,
  },
  liquidity_sweep_reversal: {
    "balaie sous le précédent low puis referme au-dessus": (ch) => {
      const z = zoneOf(ch, "support"); const i = ch.past.findIndex((k) => k.l < lo(z));
      if (i < 0) return "aucune mèche sous le précédent low";
      if (i < ch.past.length - 2) return "sweep trop ancien";
      const k = ch.past[i]; const prevLow = Math.min(...ch.past.slice(0, i).map((x) => x.l));
      if (!(k.l < prevLow)) return "la mèche ne passe pas sous le low précédent";
      if (!(k.c > (lo(z) + hi(z)) / 2)) return "clôture pas revenue au-dessus du niveau";
      if (Math.min(k.o, k.c) - k.l < body(k)) return "mèche basse plus petite que le corps (pas une « grosse mèche »)";
      return null;
    },
    direction,
  },
  fvg_reaction: {
    "FVG haussier réel laissé par l'impulsion": (ch) => bullFvg(ch) ? null : "la zone ne correspond à aucun gap réel entre bougie 1 et bougie 3",
    "le prix revient tester la zone (1re fois, sans la casser)": (ch) => {
      const f = bullFvg(ch); if (!f) return "pas de FVG";
      const z = zoneOf(ch, "fvg"); const after = ch.past.slice(f.i + 2);
      const firstTouch = after.findIndex((k) => k.l <= hi(z));
      if (firstTouch < 0) return "aucune bougie ne touche la zone (pas de retest)";
      if (firstTouch < after.length - 2) return "zone touchée avant le pullback final (pas la 1re fois)";
      if (after.some((k) => k.c < lo(z))) return "clôture sous la zone (FVG cassé, pas un retest)";
      return null;
    },
    direction,
  },
  trade_before_news: {},
  range_no_opp: {
    "oscille dans le range sans tester ses bornes": (ch) => {
      const r = zoneOf(ch, "resistance"); const s = zoneOf(ch, "support");
      return ch.past.every((k) => k.h < lo(r) && k.l > hi(s)) ? null : "une mèche teste une borne du range";
    },
    "dernière bougie au milieu du range": (ch) => {
      const r = zoneOf(ch, "resistance"); const s = zoneOf(ch, "support"); const mid = (lo(r) + hi(s)) / 2; const third = (lo(r) - hi(s)) / 3;
      return Math.abs(last(ch.past).c - mid) <= third / 2 ? null : "dernière clôture hors du tiers central";
    },
  },
  weak_breakout: {
    "vient de casser au-dessus de la résistance": (ch) => {
      const z = zoneOf(ch, "resistance"); const k = last(ch.past); const prev = ch.past[ch.past.length - 2];
      return k.c > hi(z) && prev.c <= hi(z) ? null : "la dernière bougie ne clôture pas au-dessus de la zone";
    },
    "bougie de cassure sans body (corps ≤ 40 % de sa hauteur)": (ch) => { const k = last(ch.past); return body(k) <= 0.4 * range(k) ? null : "le corps domine la bougie (cassure avec du body)"; },
  },
  fvg_overmitigated: {
    "FVG haussier réel": (ch) => bullFvg(ch) ? null : "la zone ne correspond à aucun gap réel",
    "mitigé sur 85 %+ de sa hauteur": (ch) => {
      const f = bullFvg(ch); if (!f) return "pas de FVG"; const z = zoneOf(ch, "fvg");
      const minLow = Math.min(...ch.past.slice(f.i + 2).map((k) => k.l));
      return minLow <= hi(z) - 0.85 * (hi(z) - lo(z)) ? null : "pénétration < 85 %";
    },
    "la réaction tarde (2 dernières bougies au fond, sans rebond)": (ch) => {
      const z = zoneOf(ch, "fvg"); const h = hi(z) - lo(z);
      return ch.past.slice(-2).every((k) => k.c <= lo(z) + 0.2 * h) ? null : "une des 2 dernières bougies réagit hors du fond de zone";
    },
  },
  counter_trend_bounce: {
    "HTF baissier net": (ch) => { const t = ch.past.slice(0, 8); return last(t).c < t[0].o && t.filter((k) => k.c < k.o).length >= 6 ? null : "pas de tendance baissière nette"; },
    "rebond local sur le niveau secondaire": (ch) => {
      const z = zoneOf(ch, "support"); const b = ch.past.slice(8);
      return b.some((k) => k.l <= hi(z)) && last(ch.past).c > hi(z) ? null : "pas de rebond depuis le niveau (ou retombé dessous)";
    },
  },
  dirty_range_sweep: {
    "sweep du plafond (mèche au-dessus, clôture dedans)": (ch) => { const r = zoneOf(ch, "resistance"); return ch.past.some((k) => k.h > hi(r) && k.c < lo(r)) ? null : "pas de sweep du plafond"; },
    "sweep du plancher (mèche en dessous, clôture dedans)": (ch) => { const s = zoneOf(ch, "support"); return ch.past.some((k) => k.l < lo(s) && k.c > hi(s)) ? null : "pas de sweep du plancher"; },
    "prix revenu au milieu du range": (ch) => {
      const r = zoneOf(ch, "resistance"); const s = zoneOf(ch, "support"); const mid = (lo(r) + hi(s)) / 2; const third = (lo(r) - hi(s)) / 3;
      return Math.abs(last(ch.past).c - mid) <= third / 2 ? null : "dernière clôture hors du tiers central";
    },
  },
  setup_toxic_execution: {
    "setup technique valide (pullback haussier jusqu'à la zone de demande)": (ch) => {
      const t = ch.past.slice(0, 8); const z = zoneOf(ch, "support");
      return last(t).c > t[0].o && ch.past.slice(8).some((k) => k.l <= hi(z)) ? null : "pullback haussier non valide";
    },
  },
};

// Règles dures (tous types)
function hardRules(ch: BuySellChart): string | null {
  const all = [...ch.past, ...ch.future];
  for (let i = 0; i < all.length; i++) {
    const k = all[i];
    if (i > 0 && Math.abs(k.o - all[i - 1].c) > 1e-9) return "continuité rompue (open ≠ close précédent)";
    if (k.h < Math.max(k.o, k.c) - 1e-9 || k.l > Math.min(k.o, k.c) + 1e-9) return "OHLC invalide (mèche en dedans du corps)";
  }
  return null;
}
// Couleur = mouvement (règle du rendu GameChartV2) : doji compté, rendu neutre
const renderColor = (k: Candle) => (k.c > k.o ? "vert" : k.c < k.o ? "rouge" : "neutre");

const rows: string[] = [];
let totalBad = 0;
const metaChecks: Record<string, (s: { session: string; spread: string; volatility: string }) => string | null> = {
  setup_toxic_execution: (s) => (s.spread === "élevé" && s.session === "Heures mortes" && s.volatility === "faible") ? null : `contexte d'exécution non conforme (${s.session}/${s.spread}/${s.volatility})`,
};

for (const t of G.SCENARIO_TEMPLATES) {
  for (const d of t.difficulties) {
    const fails: Record<string, number> = {}; let bad = 0; let dojis = 0; const examples: string[] = [];
    for (let n = 0; n < N; n++) {
      const seed = (n * 2654435761 + t.id.length * 97 + d.length) >>> 0;
      const vol: Volatility = t.metaOverride?.volatility ?? (t.macroContext === "dangereux" ? "élevée" : VOLS[n % 3]);
      const ch = G.buildChart(t.id, seed, vol, d, auditCtx(seed));
      const reasons: string[] = [];
      const hr = hardRules(ch); if (hr) reasons.push(`[dure] ${hr}`);
      for (const [name, fn] of Object.entries(CHECKS[t.id] ?? {})) { const r = fn(ch, t, d); if (r) reasons.push(`${name} → ${r}`); }
      dojis += [...ch.past, ...ch.future].filter((k) => renderColor(k) === "neutre").length;
      if (reasons.length) { bad++; reasons.forEach((r) => (fails[r] = (fails[r] ?? 0) + 1)); if (examples.length < 1) examples.push(`seed ${seed} vol ${vol}`); }
    }
    // Contexte d'exécution (méta du scénario) sur des instances réelles
    if (metaChecks[t.id]) {
      for (let s = 1; s <= 400; s++) {
        const inst = G.generateScenarios(s, d).find((x) => x.id === t.id); if (!inst) continue;
        const r = metaChecks[t.id](inst); if (r) { bad++; fails[`[méta] ${r}`] = (fails[`[méta] ${r}`] ?? 0) + 1; }
      }
    }
    totalBad += bad;
    const pct = ((100 * bad) / N).toFixed(1);
    const top = Object.entries(fails).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([r, c]) => `${r} (${c})`).join(" | ");
    rows.push(`${t.id.padEnd(26)} ${d.padEnd(13)} ${String(bad).padStart(4)}/${N} = ${pct.padStart(5)} %  dojis:${String(dojis).padStart(3)}  ${top}`);
  }
}
console.log(`=== Audit ${LOC.toUpperCase()} — ${N} rounds par type × difficulté ===`);
console.log(rows.join("\n"));
console.log(`TOTAL rounds incohérents : ${totalBad}`);
