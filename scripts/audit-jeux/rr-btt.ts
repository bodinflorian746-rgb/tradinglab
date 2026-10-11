// R/R affiché de Build the Trade (règle PO) : le R/R du plan (construction et verdict) et le
// R/R réalisé (TP atteint) ne dépendent pas de l'actif. La conversion en prix réels est affine
// (lib/games/price-scale.ts) : elle conserve les rapports, donc le R/R affiché sur chaque actif
// doit être celui de l'échelle abstraite. Un seuil de risque absolu (0,001) vidait la case R/R
// d'EUR/USD, dont les risques valent quelques dix-millièmes.
//  - R/R vide : risque d'au moins un pas de cotation, R/R affiché nul ;
//  - R/R faux : écart de plus de 1e-6 (relatif) avec le R/R de l'échelle abstraite.
// Les 4 actifs sont appliqués à chaque graphique, quel que soit l'actif tiré par le round.
// Usage : npx vite-node scripts/audit-jeux/rr-btt.ts [--autotest] (lancé par run.mjs)
import { auditCtx } from "./market-ctx";
import * as BT from "../../lib/games/build-the-trade";
import { ASSET_SCALE } from "../../lib/games/price-scale";
import type { Asset } from "../../lib/games/shared";

const ROUNDS = 60;
const VOLS = ["faible", "normale", "élevée"] as const;
const ASSETS = Object.keys(ASSET_SCALE) as Asset[];
const ENTRIES = ["aggressive", "confirmation", "deep_pullback"] as const;
const STOPS = ["tight", "logical", "wide"] as const;
const TPS = ["fast", "balanced", "ambitious"] as const;

type RrFn = (chart: BT.BuildTradeChart, picks: BT.ChoiceSet) => number;

const seedOf = (id: string, n: number) => { let h = 2166136261; for (const ch of `${id}#${n}`) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return h >>> 0; };

/** Erreurs du R/R affiché (fonction rr) sur tous les plans d'un graphique, pour chaque actif. */
function rrErrors(rr: RrFn, raw: BT.BuildTradeChart, seed: number): string[] {
  const errs: string[] = [];
  for (const asset of ASSETS) {
    const ch = BT.withAssetPrices(raw, { asset, seed });
    const tick = Math.pow(10, -ASSET_SCALE[asset].decimals);
    for (const entry of ENTRIES) for (const stop of STOPS) for (const tp of TPS) {
      const picks = { entry, stop, tp };
      const ref = rr(raw, picks), got = rr(ch, picks);
      const risk = Math.abs(ch.entries[entry] - ch.stops[stop]);
      if (risk >= tick && got <= 0) { errs.push(`R/R vide sur ${asset} (${entry}/${stop}/${tp}, risque ${risk.toFixed(ASSET_SCALE[asset].decimals)})`); continue; }
      if (Math.abs(got - ref) > 1e-6 * Math.max(1, ref)) errs.push(`R/R faux sur ${asset} (${entry}/${stop}/${tp}) : ${got.toFixed(2)} au lieu de ${ref.toFixed(2)}`);
    }
  }
  return errs;
}

/** R/R réalisé (verdict) : quand le TP est atteint, c'est le R/R du plan. */
function realizedErrors(raw: BT.BuildTradeChart, seed: number, optimal: BT.ChoiceSet): string[] {
  const errs: string[] = [];
  for (const asset of ASSETS) {
    const ch = BT.withAssetPrices(raw, { asset, seed });
    for (const entry of ENTRIES) for (const stop of STOPS) for (const tp of TPS) {
      const picks = { entry, stop, tp };
      const r = BT.evaluateTrade(picks, ch, optimal, 0);
      if (r.outcome === "tp_hit" && Math.abs(r.rr - BT.planRR(raw, picks)) > 1e-6 * Math.max(1, r.rr)) errs.push(`R/R réalisé faux sur ${asset} (${entry}/${stop}/${tp}) : ${r.rr.toFixed(2)}`);
    }
  }
  return errs;
}

function* charts(): Generator<[string, BT.BuildTradeChart, number, BT.ChoiceSet]> {
  for (const t of BT.BUILD_TRADE_TEMPLATES) for (let n = 0; n < ROUNDS; n++) {
    const seed = seedOf(t.id, n), ctx = auditCtx(seed);
    yield [t.id, BT.buildBuildTradeChart(t, seed, VOLS[n % 3], ctx), seed, t.optimal];
  }
}

let errors = 0;
const lines: string[] = [];
if (process.argv.includes("--autotest")) {
  // Défaut injecté : l'ancien seuil de risque absolu (0,001), quelle que soit l'échelle de l'actif
  const legacy: RrFn = (ch, p) => {
    const e = ch.entries[p.entry], risk = Math.abs(e - ch.stops[p.stop]);
    return risk > 0.001 ? Math.abs(ch.tps[p.tp] - e) / risk : 0;
  };
  const [, raw, seed] = charts().next().value!;
  const e = rrErrors(legacy, raw, seed);
  const ok = e.some((x) => /R\/R vide sur EUR\/USD/.test(x));
  lines.push(`${ok ? "détecté" : "MANQUÉ "}  seuil de risque absolu (0,001)${e[0] ? ` (${e[0]})` : ""}`);
  if (!ok) errors++;
} else {
  const counts = new Map<string, { n: number; bad: number; first?: string }>();
  for (const [id, raw, seed, optimal] of charts()) {
    const k = counts.get(id) ?? { n: 0, bad: 0 };
    k.n++;
    const e = [...rrErrors(BT.planRR, raw, seed), ...realizedErrors(raw, seed, optimal)];
    if (e.length) { k.bad++; errors++; k.first ??= e[0]; }
    counts.set(id, k);
  }
  for (const [id, k] of counts) if (k.bad) lines.push(`  ERREUR Build the Trade · ${id} : ${k.bad}/${k.n} rounds (${k.first})`);
  lines.push(`${counts.size} scénarios, ${[...counts.values()].reduce((a, k) => a + k.n, 0)} graphiques × ${ASSETS.length} actifs × 27 plans`);
}
console.log(lines.join("\n"));
console.log(`RESULTAT erreurs=${errors} avertissements=0`);
