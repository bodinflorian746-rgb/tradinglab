// Extraction de la bibliothèque de formes de marché (jeux) à partir d'historiques M15.
// Usage : node scripts/market-shapes/extract.mjs <dossier des données brutes>
//   Dossier attendu : <actif>-m15-*.json au format dukascopy-node
//   ([{ timestamp, open, high, low, close }]), actifs eurusd, xauusd, btcusd,
//   usatechidxusd. Les données brutes restent hors du dépôt (ex. /tmp).
// Sortie : lib/games/data/market-shapes.json — formes normalisées uniquement
//   (proportions corps / mèches en unités d'amplitude médiane), sans prix ni
//   horodatage, et distributions réelles pour l'audit.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DIR = process.argv[2];
if (!DIR) { console.error("Usage : node scripts/market-shapes/extract.mjs <dossier des données brutes>"); process.exit(1); }
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT = path.join(ROOT, "lib", "games", "data", "market-shapes.json");
const ASSETS = { "EUR/USD": "eurusd", "XAU/USD": "xauusd", "BTC/USD": "btcusd", "NASDAQ": "usatechidxusd" };
const SEQ_LEN = 16;        // longueur des séquences neutres
const SEQ_PER_CLASS = 8;   // séquences gardées par actif × session × volatilité
const ENC = 20;            // encodage : entiers en 1/20 d'amplitude médiane (bibliothèque compacte)
const KEY_PER_TYPE = 24;   // bougies clés gardées par actif × type
const DAY = 96;            // bougies M15 par jour (référence d'amplitude locale)

// Sessions du jeu (heure de Paris en été ≈ UTC + 2), sur l'heure UTC d'ouverture
const sessionOf = (h) => (h >= 6 && h < 12 ? "Londres" : h >= 12 && h < 15.5 ? "Overlap" : h >= 15.5 && h < 21 ? "New York" : h >= 21 && h < 23 ? "Heures mortes" : "Asie");
// Pré-news : l'heure qui précède les chiffres US de 8 h 30 (NY) un premier vendredi du mois (NFP)
const preNews = (d) => d.getUTCDay() === 5 && d.getUTCDate() <= 7 && (d.getUTCHours() === 11 || d.getUTCHours() === 12) && d.getUTCMinutes() <= 15;

// Générateur pseudo-aléatoire déterministe (échantillonnage reproductible)
function mulberry32(a) { return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const median = (a) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : 0; };
const q = (a, p) => { const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.max(0, Math.round(p * (s.length - 1))))]; };
const r2 = (x) => Math.round(x * 100) / 100;
const QS = [0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.95];

const library = { version: 2, sequenceUnit: 1 / ENC, generatedFrom: "Historiques M15 (12 mois), formes normalisées sans prix ni horodatage", seqLen: SEQ_LEN, assets: {} };
for (const [asset, code] of Object.entries(ASSETS)) {
  const file = fs.readdirSync(DIR).find((f) => f.startsWith(`${code}-m15-`) && f.endsWith(".json"));
  if (!file) { console.error(`Données absentes pour ${asset}`); process.exit(1); }
  const raw = JSON.parse(fs.readFileSync(path.join(DIR, file), "utf8"))
    .filter((k) => k.high > k.low)          // bougies plates (marché fermé) écartées
    .sort((a, b) => a.timestamp - b.timestamp);
  const rng = mulberry32(code.length * 7919 + raw.length);
  // Amplitude médiane glissante (jour précédent) : unité locale de volatilité
  const R = raw.map((k) => k.high - k.low);
  const medR = []; let win = [];
  for (let i = 0; i < raw.length; i++) { medR.push(i >= 8 ? median(win) : R[i]); win.push(R[i]); if (win.length > DAY) win.shift(); }
  const C = raw.map((k, i) => {
    const d = new Date(k.timestamp); const m = medR[i] || R[i];
    return { b: (k.close - k.open) / m, uw: (k.high - Math.max(k.open, k.close)) / m, lw: (Math.min(k.open, k.close) - k.low) / m, r: R[i] / m,
      t: k.timestamp, session: sessionOf(d.getUTCHours() + d.getUTCMinutes() / 60), pre: preNews(d) };
  });

  // Distributions réelles (pour l'audit) : proportions par bougie et variation d'amplitude
  const body = C.map((c) => Math.abs(c.b) / c.r), uw = C.map((c) => c.uw / c.r), lw = C.map((c) => c.lw / c.r);
  const logRatio = C.slice(1).map((c, i) => Math.log(c.r / C[i].r));
  const cv = [], mm = [];
  for (let i = 0; i + 15 <= C.length; i += 5) {
    const w = C.slice(i, i + 15).map((c) => c.r); const mean = w.reduce((a, b) => a + b, 0) / w.length;
    cv.push(Math.sqrt(w.reduce((a, b) => a + (b - mean) ** 2, 0) / w.length) / mean); mm.push(Math.max(...w) / Math.min(...w));
  }
  const dist = Object.fromEntries(Object.entries({ bodyShare: body, upperWickShare: uw, lowerWickShare: lw, rangeLogRatio: logRatio, windowRangeCv: cv, windowMaxMin: mm })
    .map(([k, a]) => [k, QS.map((p) => Math.round(q(a, p) * 1000) / 1000)]));

  // Mêmes distributions par session × volatilité (comparaison à contexte égal dans
  // l'audit), sur des fenêtres de 15 bougies contiguës qui commencent dans la session,
  // comme un round du jeu ; volatilité de la fenêtre : amplitude médiane / amplitude
  // médiane du jour précédent. Écart naturel : distance KS entre les deux semestres.
  const quant = (a) => (a.length ? QS.map((p) => Math.round(q(a, p) * 1000) / 1000) : []);
  const ks = (a, b) => {
    if (a.length < 50 || b.length < 50) return null;
    const A = [...a].sort((x, y) => x - y), B = [...b].sort((x, y) => x - y);
    const F = (s, v) => { let lo = 0, hi = s.length; while (lo < hi) { const m = (lo + hi) >> 1; if (s[m] <= v) lo = m + 1; else hi = m; } return lo / s.length; };
    let d = 0; for (let j = 0; j < A.length; j += 3) d = Math.max(d, Math.abs(F(A, A[j]) - F(B, A[j]))); return Math.round(d * 1000) / 1000;
  };
  const midT = C[Math.floor(C.length / 2)].t;
  const groups = {};
  for (let i = DAY; i + 15 <= C.length; i++) {
    if (C[i + 14].t - C[i].t > 14 * 15 * 60 * 1000 + 60 * 60 * 1000) continue;
    const lvl = median(raw.slice(i, i + 15).map((k) => k.high - k.low)) / (medR[i] || 1);
    const vol = lvl < 0.75 ? "faible" : lvl > 1.35 ? "élevée" : "normale";
    const g = (groups[`${C[i].session}|${vol}`] ??= [{}, {}]);   // [semestre 1, semestre 2]
    const half = g[C[i].t < midT ? 0 : 1];
    const push = (k, v) => (half[k] ??= []).push(v);
    push("bodyShare", body[i]); push("upperWickShare", uw[i]); push("lowerWickShare", lw[i]); push("rangeLogRatio", logRatio[i - 1]);
    if (i % 3 === 0) {
      const w = C.slice(i, i + 15).map((c) => c.r); const mean = w.reduce((a, b) => a + b, 0) / w.length;
      push("windowRangeCv", Math.sqrt(w.reduce((a, b) => a + (b - mean) ** 2, 0) / w.length) / mean); push("windowMaxMin", Math.max(...w) / Math.min(...w));
    }
  }
  const byContext = {};
  for (const [key, [h1, h2]] of Object.entries(groups)) {
    const metrics = Object.keys({ ...h1, ...h2 });
    byContext[key] = {
      n: (h1.bodyShare?.length ?? 0) + (h2.bodyShare?.length ?? 0),
      quantiles: Object.fromEntries(metrics.map((m) => [m, quant([...(h1[m] ?? []), ...(h2[m] ?? [])])])),
      naturalKs: Object.fromEntries(metrics.map((m) => [m, ks(h1[m] ?? [], h2[m] ?? [])])),
    };
  }

  // Séquences neutres : fenêtres de SEQ_LEN bougies contiguës (sans trou > 30 min),
  // classées par session de départ et régime de volatilité (amplitude médiane relative)
  const seqs = {};
  for (let i = DAY; i + SEQ_LEN <= C.length; i += 4) {
    const w = C.slice(i, i + SEQ_LEN);
    if (w.some((c, j) => j && c.t - w[j - 1].t > 30 * 60 * 1000)) continue;
    const lvl = median(raw.slice(i, i + SEQ_LEN).map((k) => k.high - k.low)) / (medR[i] || 1);
    const vol = lvl < 0.75 ? "faible" : lvl > 1.35 ? "élevée" : "normale";
    const key = w.some((c) => c.pre) ? "pré-news" : `${w[0].session}|${vol}`;
    (seqs[key] ??= []).push(i);
  }
  const sequences = {};
  for (const [key, starts] of Object.entries(seqs)) {
    const n = key === "pré-news" ? SEQ_PER_CLASS * 2 : SEQ_PER_CLASS;
    // tirage stratifié : séquences prises à des quantiles réguliers de la variation
    // d'amplitude (CV) de leur classe, pour représenter toute la distribution
    const cvOf = (s) => { const w = raw.slice(s, s + SEQ_LEN).map((k) => k.high - k.low); const m = w.reduce((a, b) => a + b, 0) / w.length; return Math.sqrt(w.reduce((a, b) => a + (b - m) ** 2, 0) / w.length) / m; };
    const sorted = [...starts].sort((a, b) => cvOf(a) - cvOf(b));
    const picked = [...new Set(Array.from({ length: Math.min(n, sorted.length) }, (_, j) => sorted[Math.floor(((j + 0.5) / Math.min(n, sorted.length)) * sorted.length)]))];
    sequences[key] = picked.map((s) => {
      const w = raw.slice(s, s + SEQ_LEN); const m = median(w.map((k) => k.high - k.low)) || 1;
      // [corps signé, mèche haute, mèche basse] en unités d'amplitude médiane de la séquence
      return w.map((k) => [Math.round(((k.close - k.open) / m) * ENC), Math.round(((k.high - Math.max(k.open, k.close)) / m) * ENC), Math.round(((Math.min(k.open, k.close) - k.low) / m) * ENC)]);
    });
  }

  // Bougies clés par type (unités d'amplitude médiane locale)
  const TYPES = {
    impulsion_haussiere: (c) => c.b > 0 && c.r >= 1.8 && Math.abs(c.b) / c.r >= 0.65,
    impulsion_baissiere: (c) => c.b < 0 && c.r >= 1.8 && Math.abs(c.b) / c.r >= 0.65,
    rejet_meche_basse: (c) => c.r >= 1.2 && c.lw / c.r >= 0.55 && c.lw >= 2 * Math.abs(c.b),
    rejet_meche_haute: (c) => c.r >= 1.2 && c.uw / c.r >= 0.55 && c.uw >= 2 * Math.abs(c.b),
    petite_bougie: (c) => c.r <= 0.5,
    cassure: (c) => c.r >= 1.4 && Math.abs(c.b) / c.r >= 0.55 && (c.b > 0 ? c.uw : c.lw) / c.r <= 0.15,
  };
  const keyCandles = {};
  for (const [type, test] of Object.entries(TYPES)) {
    const pool = C.filter((c, i) => i >= DAY && test(c));
    const picked = new Set();
    for (let t = 0; t < KEY_PER_TYPE * 50 && picked.size < Math.min(KEY_PER_TYPE, pool.length); t++) picked.add(Math.floor(rng() * pool.length));
    keyCandles[type] = [...picked].map((i) => [r2(pool[i].b), r2(pool[i].uw), r2(pool[i].lw)]);
  }
  const counts = Object.fromEntries(Object.entries(seqs).map(([k, v]) => [k, v.length]));
  library.assets[asset] = { candles: C.length, distributions: dist, byContext, sequences, keyCandles };
  console.log(`${asset} : ${C.length} bougies, ${Object.keys(sequences).length} classes de séquences, fenêtres disponibles par classe : ${JSON.stringify(counts)}`);
  console.log(`  corps/amplitude : ${dist.bodyShare.join(" ")}`);
  console.log(`  variation d'amplitude (CV 15) : ${dist.windowRangeCv.join(" ")} ; max/min : ${dist.windowMaxMin.join(" ")}`);
}
fs.mkdirSync(path.dirname(OUT), { recursive: true });
const json = JSON.stringify(library);
fs.writeFileSync(OUT, json);
console.log(`${OUT} : ${(json.length / 1024).toFixed(1)} Ko`);
