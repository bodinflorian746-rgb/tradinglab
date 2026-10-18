// Suite naturelle (règle PO) : la suite révélée d'un round ne monte (ne descend) pas en escalier. Refusé :
// une série d'au moins 7 bougies de même couleur aux corps presque identiques (écart-type / moyenne < 0,3),
// ou une série d'au moins 10 bougies de même couleur. Exemple refusé : 15 bougies vertes régulières après un
// sweep (Build the Trade, sweep_reversal_bull, relevé par le PO).
// Graphiques tels que le joueur les voit (passe de réalisme comprise), 4 jeux, tous niveaux, 60 graines.
// Usage : npx vite-node scripts/audit-jeux/suites.ts [--autotest] (lancé par run.mjs)
import { auditCtx } from "./market-ctx";
import * as BS from "../../lib/games/buy-sell-no-trade";
import * as FTM from "../../lib/games/find-the-mistake";
import * as PS from "../../lib/games/place-stop";
import * as BT from "../../lib/games/build-the-trade";

type C = { o: number; h: number; l: number; c: number };
export const STAIR_RUN = 7, STAIR_CV = 0.3, MAX_RUN = 10;

/** Défaut d'escalier de la suite, ou null */
export function stairError(fut: C[]): string | null {
  let i = 0;
  while (i < fut.length) {
    const d = Math.sign(fut[i].c - fut[i].o);
    let j = i; while (j < fut.length && Math.sign(fut[j].c - fut[j].o) === d) j++;
    const run = fut.slice(i, j), b = run.map((k) => Math.abs(k.c - k.o));
    const mu = b.reduce((a, x) => a + x, 0) / (b.length || 1);
    const cv = mu ? Math.sqrt(b.reduce((a, x) => a + (x - mu) ** 2, 0) / b.length) / mu : 0;
    const color = d > 0 ? "vertes" : "rouges";
    if (d !== 0 && run.length >= MAX_RUN) return `${run.length} bougies ${color} d'affilée (max ${MAX_RUN - 1})`;
    if (d !== 0 && run.length >= STAIR_RUN && cv < STAIR_CV) return `escalier : ${run.length} bougies ${color} aux corps presque identiques (écart ${cv.toFixed(2)}, min ${STAIR_CV})`;
    i = j;
  }
  return null;
}

const VOLS = ["faible", "normale", "élevée"] as const;
const SEEDS = 60;
function* futures(): Generator<[string, C[]]> {
  for (let n = 0; n < SEEDS; n++) {
    const seed = 1000 + n * 7919, vol = VOLS[n % 3], ctx = auditCtx(seed);
    for (const t of BS.SCENARIO_TEMPLATES) yield [`Buy/Sell · ${t.id}`, BS.buildChart(t.id, seed, vol, t.difficulties[0] as never, ctx).future];
    for (const t of FTM.MISTAKE_TEMPLATES) yield [`Trouve l'erreur · ${t.id}`, FTM.buildScenarioChart(t, seed, vol, ctx).future];
    for (const t of PS.PLACE_STOP_TEMPLATES) yield [`Place ton Stop · ${t.id}`, PS.buildPlaceStopChart(t.id, seed, vol, t.difficulties[0] as never, ctx).future];
    for (const t of BT.BUILD_TRADE_TEMPLATES) yield [`Build the Trade · ${t.id}`, BT.buildBuildTradeChart(t, seed, vol, ctx).future];
  }
}

let errors = 0;
const lines: string[] = [];
if (process.argv.includes("--autotest")) {
  // Défauts injectés : escalier régulier, longue série ; témoin : suite irrégulière
  const step = (n: number, d: number, body: (i: number) => number) => { const out: C[] = []; let p = 10; for (let i = 0; i < n; i++) { const c = p + d * body(i); out.push({ o: p, c, h: Math.max(p, c) + 0.1, l: Math.min(p, c) - 0.1 }); p = c; } return out; };
  const cases: [string, C[], RegExp][] = [
    ["escalier de 8 bougies vertes régulières", step(8, 1, (i) => 0.5 + (i % 2) * 0.03), /escalier/],
    ["11 bougies rouges d'affilée (corps variés)", step(11, -1, (i) => 0.2 + (i % 3) * 0.4), /d'affilée/],
  ];
  for (const [name, fut, re] of cases) { const e = stairError(fut); const ok = !!e && re.test(e); lines.push(`${ok ? "détecté" : "MANQUÉ "}  ${name}${e ? ` (${e})` : ""}`); if (!ok) errors++; }
  const fine = [...step(4, 1, (i) => 0.3 + i * 0.2), ...step(1, -1, () => 0.15), ...step(4, 1, (i) => 0.6 - i * 0.1)];
  const fp = stairError(fine);
  lines.push(`${fp ? "FAUX POSITIF" : "aucun faux positif"}  témoin (montée irrégulière avec une pause)`);
  if (fp) errors++;
} else {
  const bad = new Map<string, { n: number; first: string }>();
  let total = 0;
  for (const [key, fut] of futures()) {
    total++;
    const e = stairError(fut);
    if (!e) continue;
    errors++;
    const b = bad.get(key) ?? { n: 0, first: e };
    b.n++; bad.set(key, b);
  }
  for (const [k, b] of bad) lines.push(`  ERREUR ${k} : ${b.n}/${SEEDS} rounds (${b.first})`);
  lines.push(`${total} suites contrôlées`);
}
console.log(lines.join("\n"));
console.log(`RESULTAT erreurs=${errors} avertissements=0`);
