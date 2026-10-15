// Stops de Place ton Stop placés là où leur justification le dit (règle PO : « le SL est au-delà
// du niveau qu'il protège, avec une marge ; chaque ligne est du bon côté de l'entrée »). Toute
// distance se juge par rapport aux bougies affichées (MR, amplitude médiane des bougies vues avant
// la réponse).
//  1. côté : à l'achat, chaque stop sous l'entrée et le TP au-dessus (l'inverse à la vente) ;
//  2. « sous / au-dessus du <niveau> » dans une justification : le stop est de ce côté du niveau
//     tracé qui porte ce nom (bord le plus loin de l'entrée) ; « avec une marge » : au moins
//     MARGIN × MR au-delà ; « pile sous / juste au-dessus » : au plus NEAR × MR ;
//  3. « dans la zone … » : le stop est dans la zone nommée ;
//  4. stop logique sans niveau nommé (« derrière la vraie invalidation ») : au-delà du niveau tracé
//     le plus proche de l'entrée, avec la marge ; stop trop serré (« dans le bruit ») : entre
//     l'entrée et ce niveau.
// Usage : npx vite-node scripts/audit-jeux/stops.ts [--autotest] [--detail] (lancé par run.mjs)
import { auditCtx } from "./market-ctx";
import * as PS from "../../lib/games/place-stop";
import type { Candle, ChartZone } from "../../lib/games/shared";

export const MARGIN = 0.1, NEAR = 0.6, NEAR_MARGIN = 2.5;
/** Justifications dont le texte contredit le placement, en attente du PO (liste « à valider ») :
 *  leur défaut est compté en avertissement, pas en erreur */
export const PENDING: RegExp[] = [];
const ROUNDS = +(process.argv.find((a) => a.startsWith("--rounds="))?.split("=")[1] ?? 100);
const DETAIL = process.argv.includes("--detail");
const VOLS = ["faible", "normale", "élevée"] as const;
const median = (a: number[]) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : 0; };
const medRange = (cs: Candle[]) => median(cs.map((k) => k.h - k.l)) || 1e-9;

type Span = { lo: number; hi: number; name: string };
const span = (z: ChartZone | undefined, name: string): Span | null => (z ? { lo: Math.min(z.y1, z.y2), hi: Math.max(z.y1, z.y2), name } : null);
const byLabel = (zs: ChartZone[], label: string) => zs.find((z) => z.label.toLowerCase() === label.toLowerCase());

/** Niveaux nommés dans les justifications → zone tracée (du plus long au plus court) */
const NAMES: [RegExp, (zs: ChartZone[]) => Span | null][] = [
  [/plus bas des 2 swing lows/i, (zs) => { const a = [byLabel(zs, "Swing low 1"), byLabel(zs, "Swing low 2")].filter(Boolean) as ChartZone[]; return a.length ? span(a.reduce((x, y) => (Math.min(x.y1, x.y2) < Math.min(y.y1, y.y2) ? x : y)), "plus bas des 2 swing lows") : null; }],
  [/(1er|2e|3e) swing (low|high)/i, () => null], // résolu plus bas (numéro)
  [/swing low évident/i, (zs) => span(byLabel(zs, "Swing low évident"), "swing low évident")],
  [/swing high évident/i, (zs) => span(byLabel(zs, "Swing high évident"), "swing high évident")],
  [/swing low H1/i, (zs) => span(byLabel(zs, "Swing low H1"), "swing low H1")],
  [/HL H4/i, (zs) => span(byLabel(zs, "HL H4"), "HL H4")],
  [/swing high du corps/i, (zs) => span(byLabel(zs, "Swing high"), "swing high")],
  [/bas de l'Order Block/i, (zs) => { const z = zs.find((x) => /order block/i.test(x.label)); return z ? { lo: Math.min(z.y1, z.y2), hi: Math.min(z.y1, z.y2), name: "bas de l'Order Block" } : null; }],
  [/haut de la session asiatique/i, (zs) => span(byLabel(zs, "Haut de la session asiatique"), "haut de la session asiatique")],
  [/zone de chasse aux stops/i, (zs) => span(byLabel(zs, "Zone de chasse aux stops"), "zone de chasse aux stops")],
  // la mèche se lit à sa pointe (« sous la mèche » : entre le corps et la pointe)
  [/mèche du faux breakout/i, (zs) => { const z = span(byLabel(zs, "Mèche du faux breakout"), "mèche du faux breakout"); return z && { ...z, lo: z.hi }; }],
  [/2 faux breakouts précédents/i, (zs) => span(byLabel(zs, "Faux breakouts précédents"), "faux breakouts précédents")],
  [/bas du range/i, (zs) => span(byLabel(zs, "Bas du range"), "bas du range")],
  [/chiffre rond/i, (zs) => span(byLabel(zs, "Chiffre rond"), "chiffre rond")],
  [/PDL/, (zs) => span(byLabel(zs, "PDL"), "PDL")],
  [/niveau clé/i, (zs) => span(zs.find((z) => /^(support|résistance)$/i.test(z.label)), "niveau clé")],
  [/equal lows|2 lows/i, (zs) => span(byLabel(zs, "Equal lows"), "equal lows")],
  [/swing low/i, (zs) => span(byLabel(zs, "Swing low"), "swing low")],
];
const ORD: Record<string, string> = { "1er": "1", "2e": "2", "3e": "3" };
function resolve(phrase: string, zs: ChartZone[]): Span | null {
  const n = phrase.match(/(1er|2e|3e) swing (low|high)/i);
  if (n) return span(byLabel(zs, `Swing ${n[2].toLowerCase()} ${ORD[n[1]]}`), `${n[1]} swing ${n[2]}`);
  for (const [re, f] of NAMES) if (re.test(phrase)) return f(zs);
  return null;
}
const ARTICLE = "(?:du|de la|de l'|des|d'un|d'une|le|la|l'|un|une)\\s*";
const PLACE = new RegExp(`(pile |juste )?(sous|au-dessus)\\s+${ARTICLE}((?:PLUS BAS des 2 swing lows)|[^,.:;]+?)(?=[,.:;]|\\s+(?:avec|mais|alors|une|un|là|qui|n'|c'|et)\\b|$)`, "giu");

type Stop = { price: number; type: string; rationale: string };
type PSChart = { past: Candle[]; zones: ChartZone[]; entry: number; tp: number | null; direction: "BUY" | "SELL"; stops: Stop[] };

/** Erreurs de placement des stops d'un graphique */
export function stopErrors(c: PSChart, pending = false): string[] {
  const MR = medRange(c.past), buy = c.direction === "BUY", r = (x: number) => (x / MR).toFixed(2);
  const errs: string[] = [];
  if (c.tp !== null && (buy ? c.tp <= c.entry : c.tp >= c.entry)) errs.push(`TP du mauvais côté de l'entrée`);
  for (const s of c.stops) {
    if (PENDING.some((re) => re.test(s.rationale)) !== pending) continue;
    const tag = `stop ${s.type} (${s.rationale.slice(0, 2)})`;
    if (buy ? s.price >= c.entry : s.price <= c.entry) { errs.push(`${tag} du mauvais côté de l'entrée`); continue; }
    let named = false;
    for (const m of s.rationale.matchAll(PLACE)) {
      const lvl = resolve(m[3], c.zones);
      if (!lvl) continue;
      named = true;
      const below = m[2].toLowerCase() === "sous";
      const edge = below ? lvl.lo : lvl.hi;
      const beyond = below ? edge - s.price : s.price - edge;
      if (beyond <= 0) { errs.push(`${tag} dit « ${m[0].trim()} » mais il est ${below ? "au-dessus" : "en dessous"} du ${lvl.name} tracé (${r(-beyond)} × la bougie médiane)`); continue; }
      const after = s.rationale.slice((m.index ?? 0) + m[0].length, (m.index ?? 0) + m[0].length + 22);
      if (/avec une marge/.test(after) && beyond < MARGIN * MR) errs.push(`${tag} « ${m[0].trim()}, avec une marge » à ${r(beyond)} × la bougie médiane du ${lvl.name} (min ${MARGIN})`);
      const near = /avec une marge/.test(after) ? NEAR_MARGIN : NEAR;
      if (m[1] && beyond > near * MR) errs.push(`${tag} « ${m[0].trim()} » à ${r(beyond)} × la bougie médiane du ${lvl.name} (max ${near})`);
    }
    const inside = s.rationale.match(/dans la zone de liquidité créée par les 2 equal lows/i);
    if (inside) {
      named = true;
      const z = resolve("equal lows", c.zones);
      if (z && (s.price < z.lo - 0.05 * MR || s.price > z.hi + 0.05 * MR)) errs.push(`${tag} dit « dans la zone … equal lows » mais il est hors de la zone tracée`);
    }
    if (named) continue;
    // stop logique / trop serré génériques : par rapport au niveau tracé le plus proche de l'entrée
    const levels = c.zones.filter((z) => (buy ? Math.max(z.y1, z.y2) < c.entry : Math.min(z.y1, z.y2) > c.entry))
      .map((z) => ({ far: buy ? Math.min(z.y1, z.y2) : Math.max(z.y1, z.y2), near: buy ? Math.max(z.y1, z.y2) : Math.min(z.y1, z.y2), label: z.label }));
    if (!levels.length) continue;
    const prot = levels.reduce((a, z) => (Math.abs(z.near - c.entry) < Math.abs(a.near - c.entry) ? z : a));
    const beyond = buy ? prot.far - s.price : s.price - prot.far;
    if (/derrière la vraie invalidation/i.test(s.rationale) && beyond < MARGIN * MR) errs.push(`${tag} logique à ${r(beyond)} × la bougie médiane au-delà de « ${prot.label} » (min ${MARGIN})`);
    if (/dans le bruit normal/i.test(s.rationale) && beyond > 0) errs.push(`${tag} « dans le bruit » mais au-delà de « ${prot.label} »`);
  }
  return errs;
}

const seedOf = (id: string, n: number) => { let h = 2166136261; for (const ch of `${id}#${n}`) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return h >>> 0; };
export function* psCharts(rounds = ROUNDS): Generator<{ key: string; c: PSChart }> {
  for (const t of PS.PLACE_STOP_TEMPLATES) for (const d of t.difficulties) for (let n = 0; n < rounds; n++) {
    const seed = seedOf(t.id + d, n), ctx = auditCtx(seed);
    yield { key: `Place ton Stop|${t.id}|${d}`, c: PS.buildPlaceStopChart(t.id, seed, VOLS[n % 3], d, ctx) as unknown as PSChart };
  }
}

if (!process.env.STOPS_NO_MAIN) {
  let errors = 0, warnings = 0;
  const lines: string[] = [];
  if (process.argv.includes("--autotest")) {
    // Défauts injectés sur de vrais graphiques : chacun doit être détecté
    const all = [...psCharts(2)].map((x) => x.c).filter((c) => !stopErrors(c).length);
    const pick = (re: RegExp) => all.find((c) => c.stops.some((s) => re.test(s.rationale)));
    const shift = (c: PSChart, re: RegExp, by: (s: Stop, MR: number) => number): PSChart => ({ ...c, stops: c.stops.map((s) => (re.test(s.rationale) ? { ...s, price: by(s, medRange(c.past)) } : s)) });
    const cases: [string, RegExp, () => PSChart | undefined][] = [
      ["stop « sous le swing low H1 » posé au-dessus", /au-dessus du swing low H1/, () => { const c = pick(/sous le swing low H1/); const z = c && byLabel(c.zones, "Swing low H1"); return c && z && shift(c, /sous le swing low H1/, () => Math.max(z.y1, z.y2) + 0.05 * medRange(c.past)); }],
      ["stop logique sans marge", /min 0.1/, () => { const c = pick(/Sous le HL H4 pertinent, avec une marge/); const z = c && byLabel(c.zones, "HL H4"); return c && z && shift(c, /Sous le HL H4/, () => Math.min(z.y1, z.y2) - 0.02 * medRange(c.past)); }],
      ["stop du mauvais côté de l'entrée", /mauvais côté/, () => { const c = all[0]; return c && shift(c, /./, (s) => (c.direction === "BUY" ? c.entry + Math.abs(c.entry - s.price) : c.entry - Math.abs(c.entry - s.price))); }],
      ["stop « pile sous le PDL » trop loin", /max 0.6/, () => { const c = pick(/pile sous le PDL/); const z = c && byLabel(c.zones, "PDL"); return c && z && shift(c, /pile sous le PDL/, (_s, MR) => Math.min(z.y1, z.y2) - 1.5 * MR); }],
      ["TP du mauvais côté", /TP du mauvais/, () => { const c = all.find((x) => x.tp !== null); return c && { ...c, tp: c.direction === "BUY" ? c.entry - 1 : c.entry + 1 }; }],
    ];
    for (const [name, expect, make] of cases) {
      const c = make();
      const e = c ? stopErrors(c).find((x) => expect.test(x)) : undefined;
      lines.push(`${e ? "détecté" : "MANQUÉ "}  ${name}${e ? ` (${e})` : c ? "" : " (aucun graphique de base)"}`);
      if (!e) errors++;
    }
  } else {
    const counts = new Map<string, { n: number; bad: number; first?: string }>();
    const warn = new Map<string, { n: number; first: string }>();
    for (const { key, c } of psCharts()) {
      const w = stopErrors(c, true);
      if (w.length) { const x = warn.get(key) ?? { n: 0, first: w[0] }; x.n++; warn.set(key, x); }
      const s = counts.get(key) ?? { n: 0, bad: 0 };
      s.n++;
      const e = stopErrors(c);
      if (e.length) { s.bad++; errors++; s.first ??= e[0]; }
      counts.set(key, s);
    }
    const bad = [...counts].filter(([, s]) => s.bad).sort((a, b) => b[1].bad / b[1].n - a[1].bad / a[1].n);
    for (const [k, s] of bad.slice(0, DETAIL ? 500 : 60)) lines.push(`  ERREUR ${k.replace(/\|/g, " · ")} : ${s.bad}/${s.n} (${s.first})`);
    for (const [k, x] of warn) lines.push(`  AVERTISSEMENT (à valider) ${k.replace(/\|/g, " · ")} : ${x.n} rounds (${x.first})`);
    warnings = warn.size;
    lines.push(`${counts.size} scénarios × niveaux contrôlés`);
  }
  console.log(lines.join("\n"));
  console.log(`RESULTAT erreurs=${errors} avertissements=${warnings}`);
}
