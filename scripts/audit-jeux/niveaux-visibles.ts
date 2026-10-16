// Niveaux visibles tracés (règle PO) : tout niveau qu'un trader verrait sur le graphique de la
// question (bornes d'un range, résistance au-dessus, support en dessous) est tracé et nommé,
// même s'il n'est pas la réponse. Exemple vu par le PO : un « support majeur » acheté dans un
// range, sans la résistance du haut du range, alors qu'elle est l'objectif naturel de l'achat.
//
// Un niveau visible = au moins deux sommets (ou deux creux) du passé alignés à un quart de bougie
// médiane près, séparés par une vraie réaction (au moins une bougie médiane d'écart entre eux),
// prouvé par la règle des leçons (scripts/audit-lecons/sr-proof.mjs : deux touches, ou cassure
// puis retest) et pas cassé depuis sa dernière touche (une clôture au-delà efface le niveau,
// sauf retest). Il doit être couvert par une zone du graphique (support, résistance, haut ou bas
// du range, liquidité, plus haut / plus bas précédent…), à la tolérance près ; un alignement dont
// un des deux pivots est posé sur une zone tracée appartient à ce niveau.
// Usage : npx vite-node scripts/audit-jeux/niveaux-visibles.ts [--autotest] [--detail] [--rounds=60]
import { auditCtx } from "./market-ctx";
import * as BS from "../../lib/games/buy-sell-no-trade";
import * as FTM from "../../lib/games/find-the-mistake";
import * as PS from "../../lib/games/place-stop";
import * as BT from "../../lib/games/build-the-trade";
import type { Candle, ChartZone } from "../../lib/games/shared";
import { srTouches } from "../audit-lecons/sr-proof.mjs";

const ROUNDS = Number((process.argv.find((a) => a.startsWith("--rounds=")) ?? "--rounds=60").split("=")[1]);
const VOLS = ["faible", "normale", "élevée"] as const;
const DETAIL = process.argv.includes("--detail");

const median = (a: number[]) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)] || 0; };

export interface VisibleLevel { side: "haut" | "bas"; y: number; pivots: number[] }

/** Niveaux visibles non couverts par une zone (passé seulement : ce que voit le joueur avant de répondre). */
export function uncoveredLevels(past: Candle[], zones: ChartZone[]): VisibleLevel[] {
  const mr = median(past.map((k) => k.h - k.l));
  const tol = 0.25 * mr;
  const W = 2; // un sommet dépasse les 2 bougies de chaque côté (les 2 dernières : un côté suffit)
  const piv = (side: "haut" | "bas") => {
    const out: number[] = [];
    for (let i = 1; i < past.length; i++) {
      const v = side === "haut" ? past[i].h : past[i].l;
      let ok = true;
      for (let j = Math.max(0, i - W); j <= Math.min(past.length - 1, i + W); j++) {
        if (j === i) continue;
        const w = side === "haut" ? past[j].h : past[j].l;
        if (side === "haut" ? w > v : w < v) { ok = false; break; }
      }
      if (ok) out.push(i);
    }
    return out;
  };
  const found: VisibleLevel[] = [];
  for (const side of ["haut", "bas"] as const) {
    const ps = piv(side);
    const val = (i: number) => (side === "haut" ? past[i].h : past[i].l);
    for (let a = 0; a < ps.length; a++) for (let b = a + 1; b < ps.length; b++) {
      const i = ps[a], j = ps[b];
      if (j - i < 3 || Math.abs(val(i) - val(j)) > tol) continue;
      // Vraie réaction entre les deux : le prix s'éloigne d'au moins une bougie médiane
      const between = past.slice(i + 1, j);
      const away = side === "haut" ? Math.max(val(i), val(j)) - Math.min(...between.map((k) => k.l)) : Math.max(...between.map((k) => k.h)) - Math.min(val(i), val(j));
      if (away < mr) continue;
      const y = (val(i) + val(j)) / 2;
      // Prouvé (deux touches, ou cassure puis retest), sur tout le passé
      const t = srTouches(past, y - tol, y + tol);
      if (t.touches < 2 && !t.retest) continue;
      // Pas cassé depuis la dernière touche : aucune clôture franchement au-delà
      const after = past.slice(j + 1);
      const broken = after.some((k) => (side === "haut" ? k.c > y + tol : k.c < y - tol));
      if (broken && !t.retest) continue;
      if (found.some((f) => f.side === side && Math.abs(f.y - y) <= tol)) continue;
      found.push({ side, y, pivots: [i, j] });
    }
  }
  // Couvert : le niveau, ou l'un de ses deux pivots, est sur une zone tracée (à la tolérance près)
  const val = (f: VisibleLevel, i: number) => (f.side === "haut" ? past[i].h : past[i].l);
  const onZone = (y: number) => zones.some((z) => Math.min(z.y1, z.y2) - tol <= y && y <= Math.max(z.y1, z.y2) + tol);
  return found.filter((f) => !onZone(f.y) && !f.pivots.some((i) => onZone(val(f, i))));
}

type Row = { rounds: number; bad: number; first?: string };
const counts = new Map<string, Row>();
let errors = 0;
function record(key: string, past: Candle[], zones: ChartZone[] | undefined, where: string) {
  const c = counts.get(key) ?? { rounds: 0, bad: 0 };
  c.rounds++;
  const miss = uncoveredLevels(past, zones ?? []);
  if (miss.length) {
    c.bad++; errors++;
    if (!c.first) c.first = `${where} : ${miss.map((m) => `${m.side === "haut" ? "sommets" : "creux"} alignés (bougies ${m.pivots.join(" et ")}) à ${m.y.toFixed(2)} sans zone`).join(" ; ")} (zones : ${(zones ?? []).map((z) => z.label).join(", ") || "aucune"})`;
  }
  counts.set(key, c);
}
const seedOf = (id: string, n: number) => { let h = 2166136261; for (const ch of `${id}#${n}`) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return h >>> 0; };

const lines: string[] = [];
const MAIN = !process.env.NV_SONDE; // sonde qui importe ce fichier : rien à lancer
if (!MAIN) { /* importé (sonde) : rien à lancer */ } else if (process.argv.includes("--autotest")) {
  // Défauts injectés : un range dont une borne n'est pas tracée doit être détecté
  const cs: Candle[] = [];
  const add = (o: number, c: number, h: number, l: number) => cs.push({ o, c, h, l });
  // 3 allers-retours entre 0 et 10 (bougie médiane ≈ 3)
  for (let r = 0; r < 3; r++) { add(1, 4, 4.5, 0.6, ); add(4, 7, 7.4, 3.6); add(7, 9.5, 10, 6.8); add(9.5, 6.5, 9.7, 6.2); add(6.5, 3.5, 6.8, 3.2); add(3.5, 1, 3.8, 0); }
  add(1, 3, 3.3, 0.7);
  const cases: [string, ChartZone[], boolean][] = [
    ["range : haut du range non tracé", [{ kind: "support", y1: -0.3, y2: 0.3, label: "Bas du range" }], true],
    ["range : bas du range non tracé", [{ kind: "resistance", y1: 9.7, y2: 10.3, label: "Haut du range" }], true],
    ["range : aucune borne tracée", [], true],
    ["témoin : les deux bornes tracées", [{ kind: "support", y1: -0.3, y2: 0.3, label: "Bas du range" }, { kind: "resistance", y1: 9.7, y2: 10.3, label: "Haut du range" }], false],
  ];
  for (const [name, zones, expect] of cases) {
    const got = uncoveredLevels(cs, zones).length > 0;
    const ok = got === expect;
    lines.push(`${ok ? (expect ? "détecté" : "aucun faux positif") : (expect ? "MANQUÉ " : "FAUX POSITIF")}  ${name}`);
    if (!ok) errors++;
  }
} else {
  for (const t of BS.SCENARIO_TEMPLATES) for (const d of t.difficulties) for (let n = 0; n < ROUNDS; n++) {
    const seed = seedOf(t.id + d, n); const ctx = auditCtx(seed); const vol = VOLS[n % 3];
    const ch = BS.buildChart(t.id, seed, vol, d, ctx);
    record(`Buy/Sell|${t.id}|${d}`, ch.past, ch.zones, `seed ${seed} ${vol}`);
  }
  for (const t of FTM.MISTAKE_TEMPLATES) for (let n = 0; n < ROUNDS; n++) {
    const seed = seedOf(t.id, n); const ctx = auditCtx(seed); const vol = VOLS[n % 3];
    const ch = FTM.buildScenarioChart(t, seed, vol, ctx);
    record(`Trouve l'erreur|${t.id}|toutes`, ch.past, ch.zones, `seed ${seed} ${vol}`);
  }
  for (const t of PS.PLACE_STOP_TEMPLATES) for (const d of t.difficulties) for (let n = 0; n < ROUNDS; n++) {
    const seed = seedOf(t.id + d, n); const ctx = auditCtx(seed); const vol = VOLS[n % 3];
    const ch = PS.buildPlaceStopChart(t.id, seed, vol, d, ctx);
    record(`Place ton Stop|${t.id}|${d}`, ch.past, ch.zones, `seed ${seed} ${vol}`);
  }
  for (const t of BT.BUILD_TRADE_TEMPLATES) for (let n = 0; n < ROUNDS; n++) {
    const seed = seedOf(t.id, n); const ctx = auditCtx(seed); const vol = VOLS[n % 3];
    const ch = BT.buildBuildTradeChart(t, seed, vol, ctx);
    record(`Build the Trade|${t.id}|toutes`, ch.past, ch.zones, `seed ${seed} ${vol}`);
  }
  const byGame = new Map<string, Row>();
  for (const [k, c] of counts) {
    const g = k.split("|")[0]; const s = byGame.get(g) ?? { rounds: 0, bad: 0 };
    s.rounds += c.rounds; s.bad += c.bad; byGame.set(g, s);
    if (c.bad && (DETAIL || lines.length < 80)) lines.push(`  ERREUR ${k.replace(/\|/g, " · ")} : ${c.bad}/${c.rounds} rounds (${c.first})`);
  }
  for (const [g, s] of byGame) lines.push(`${g} : ${s.bad} round(s) avec un niveau visible non tracé sur ${s.rounds}`);
}
console.log(lines.join("\n"));
if (MAIN) console.log(`RESULTAT erreurs=${errors} avertissements=0`);
