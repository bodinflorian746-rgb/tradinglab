// Audit réalisme des bougies, comparé aux vraies données de marché.
// Usage : npx vite-node scripts/audit-jeux/realism.ts (lancé par run.mjs)
//
// Les rounds sont générés comme en jeu (actif, session et volatilité de
// l'instance) puis comparés, par contexte actif × session × volatilité, aux
// distributions réelles M15 du même contexte (lib/games/data/market-shapes.json) :
// part du corps, mèches haute et basse, variation d'amplitude d'une bougie à
// l'autre, coefficient de variation et rapport max/min des amplitudes sur 15 bougies.
// Écart : distance de Kolmogorov-Smirnov évaluée aux quantiles réels. Seuil par
// contexte et par mesure : max(MIN_KS, 2 × écart naturel entre deux semestres
// réels du même contexte) — le marché lui-même varie d'un semestre à l'autre.
// Erreurs dures : clôture = ouverture (bougie blanche), OHLC invalide, continuité rompue.
// Mesures sur 15 bougies (CV, max/min) : en avertissement seulement — les scénarios
// imposent des structures régulières (jambes de tendance, bougie de force protégée)
// qui réduisent la variation sur une fenêtre ; l'écart est affiché et compté.
import SHAPES from "../../lib/games/data/market-shapes.json";
import * as BS from "../../lib/games/buy-sell-no-trade";
import * as FTM from "../../lib/games/find-the-mistake";
import * as PS from "../../lib/games/place-stop";
import * as BT from "../../lib/games/build-the-trade";

type C = { o: number; h: number; l: number; c: number };
type Ctx = { n: number; quantiles: Record<string, number[]>; naturalKs: Record<string, number | null> };
const MIN_KS = 0.15;
const NATURAL_FACTOR = 2;
const MIN_CANDLES = 400;   // contexte comparé seulement au-delà de cette taille (générée et réelle)
const SEEDS = 40;
const PS_ = [0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.95];
const REAL = (SHAPES as unknown as { assets: Record<string, { byContext: Record<string, Ctx> }> }).assets;
const METRICS = ["bodyShare", "upperWickShare", "lowerWickShare", "rangeLogRatio", "windowRangeCv", "windowMaxMin"] as const;
type Metric = (typeof METRICS)[number];
const WINDOW_METRICS: ReadonlySet<Metric> = new Set(["windowRangeCv", "windowMaxMin"]);
const NAMES: Record<Metric, string> = { bodyShare: "corps", upperWickShare: "mèche haute", lowerWickShare: "mèche basse", rangeLogRatio: "var. amplitude", windowRangeCv: "CV amplitudes", windowMaxMin: "max/min" };

const samples: Record<string, Record<Metric, number[]>> = {};
let errors = 0;
const lines: string[] = [];
const fail = (m: string) => { errors++; if (errors <= 40) lines.push(`  ERREUR ${m}`); };

function addChart(game: string, key: string, cs: C[]) {
  for (let i = 0; i < cs.length; i++) {
    const k = cs[i];
    if (k.c === k.o) fail(`${game} ${key} : bougie blanche (clôture = ouverture)`);
    if (k.h < Math.max(k.o, k.c) - 1e-9 || k.l > Math.min(k.o, k.c) + 1e-9) fail(`${game} ${key} : OHLC invalide`);
    if (i > 0 && Math.abs(k.o - cs[i - 1].c) > 1e-9) fail(`${game} ${key} : continuité rompue`);
  }
  const s = (samples[key] ??= Object.fromEntries(METRICS.map((m) => [m, []])) as unknown as Record<Metric, number[]>);
  const ok = cs.filter((k) => k.h - k.l > 1e-12);
  for (const k of ok) {
    const r = k.h - k.l;
    s.bodyShare.push(Math.abs(k.c - k.o) / r);
    s.upperWickShare.push((k.h - Math.max(k.o, k.c)) / r);
    s.lowerWickShare.push((Math.min(k.o, k.c) - k.l) / r);
  }
  for (let i = 1; i < ok.length; i++) s.rangeLogRatio.push(Math.log((ok[i].h - ok[i].l) / (ok[i - 1].h - ok[i - 1].l)));
  for (let i = 0; i + 15 <= ok.length; i += 3) {
    const w = ok.slice(i, i + 15).map((k) => k.h - k.l); const mean = w.reduce((a, b) => a + b, 0) / w.length;
    s.windowRangeCv.push(Math.sqrt(w.reduce((a, b) => a + (b - mean) ** 2, 0) / w.length) / mean);
    s.windowMaxMin.push(Math.max(...w) / Math.min(...w));
  }
}

const key = (i: { asset: string; session: string; volatility: string }) => `${i.asset}|${i.session}|${i.volatility}`;
const ctxOf = (i: { asset: BS.ScenarioInstance["asset"]; session: BS.ScenarioInstance["session"] }) => ({ asset: i.asset, session: i.session });
for (const d of ["beginner", "intermediate", "advanced"] as const) for (let s = 1; s <= SEEDS; s++) {
  for (const i of BS.generateScenarios(s * 7919, d)) { const ch = BS.buildChart(i.id, i.seed, i.volatility, d, ctxOf(i)); addChart("Buy/Sell/No Trade", key(i), [...ch.past, ...ch.future]); }
  for (const i of FTM.generateMistakeScenarios(s * 7919, d)) { const ch = FTM.buildScenarioChart(i, i.seed, i.volatility, ctxOf(i)); addChart("Trouve l'erreur", key(i), [...ch.past, ...ch.future]); }
  for (const i of PS.generatePlaceStopScenarios(s * 7919, d)) { const ch = PS.buildPlaceStopChart(i.id, i.seed, i.volatility, d, ctxOf(i)); addChart("Place ton Stop", key(i), [...ch.past, ...ch.future]); }
  for (const i of BT.generateBuildTradeScenarios(s * 7919, d)) { const ch = BT.buildBuildTradeChart(i, i.seed, i.volatility, ctxOf(i)); addChart("Build the Trade", key(i), [...ch.past, ...ch.future]); }
}

let warnings = 0, compared = 0, skipped = 0, worst = 0, windowOver = 0;
const windowBad = new Set<string>();
for (const [k, s] of Object.entries(samples).sort()) {
  const [asset, session, vol] = k.split("|");
  const real = REAL[asset]?.byContext[`${session}|${vol}`];
  if (s.bodyShare.length < MIN_CANDLES || !real || real.n < MIN_CANDLES) { skipped++; continue; }
  compared++;
  const row: string[] = [];
  for (const m of METRICS) {
    const q = real.quantiles[m];
    if (!q?.length) continue;
    const gen = [...s[m]].sort((a, b) => a - b);
    const F = (v: number) => { let lo = 0, hi = gen.length; while (lo < hi) { const mid = (lo + hi) >> 1; if (gen[mid] <= v) lo = mid + 1; else hi = mid; } return lo / gen.length; };
    const ks = Math.max(...q.map((v, j) => Math.abs(F(v) - PS_[j])));
    const limit = Math.max(MIN_KS, NATURAL_FACTOR * (real.naturalKs[m] ?? 0));
    row.push(`${NAMES[m]} ${ks.toFixed(2)}/${limit.toFixed(2)} (q50 ${gen[gen.length >> 1].toFixed(2)}/${q[5].toFixed(2)})`);
    if (WINDOW_METRICS.has(m)) { if (ks > limit) { windowOver++; windowBad.add(k); warnings++; } continue; }
    worst = Math.max(worst, ks / limit);
    if (ks > limit) fail(`${k} ${NAMES[m]} : écart ${ks.toFixed(3)} aux vraies données (seuil ${limit.toFixed(3)})`);
    else if (ks > 0.75 * limit) warnings++;
  }
  lines.push(`${k.padEnd(30)} ${String(s.bodyShare.length).padStart(5)} bougies : ${row.join(" | ")}`);
}
console.log(`Écart KS aux vraies données M15, par contexte (écart/seuil ; seuil = max(${MIN_KS}, ${NATURAL_FACTOR} × écart naturel entre semestres))`);
console.log(lines.join("\n"));
console.log(`Contextes comparés : ${compared} ; trop petits : ${skipped} ; mesures par bougie : pire écart = ${(100 * worst).toFixed(0)} % du seuil`);
console.log(`Mesures sur 15 bougies (avertissement) : ${windowOver} dépassements, ${windowBad.size}/${compared} contextes (écart de variation sur la fenêtre)`);
console.log(`RESULTAT erreurs=${errors} avertissements=${warnings}`);
