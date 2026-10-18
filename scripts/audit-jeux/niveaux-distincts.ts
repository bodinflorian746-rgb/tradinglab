// Une notion à plusieurs niveaux, jamais le même graphique ni la même situation (règle PO) : deux
// scénarios d'un même jeu, de niveaux différents, qui partagent une notion de manche ne doivent pas
// montrer le même graphique avec les mêmes niveaux. « Même graphique » : même générateur (pour un
// scénario construit, les mêmes premières bougies à graine égale, au sens près pour une variante de
// vente ; pour un scénario d'origine, la même forme), et les mêmes zones nommées.
// Exemple refusé : « stop sous le dernier swing low » en Débutant et en Intermédiaire sur la même
// tendance avec le même swing low (l'Intermédiaire doit ajouter sa situation : BOS et retest…).
// Usage : npx vite-node scripts/audit-jeux/niveaux-distincts.ts [--autotest] (lancé par run.mjs)
import * as BS from "../../lib/games/buy-sell-no-trade";
import * as FTM from "../../lib/games/find-the-mistake";
import * as PS from "../../lib/games/place-stop";
import * as BT from "../../lib/games/build-the-trade";
import { mulberry32 } from "../../lib/games/shared";
import { roundNotions, type NotionId } from "../../lib/games/notions";
import { mirrorLabel } from "../../lib/games/scenes";

type C = { o: number; h: number; l: number; c: number };
type Raw = { past: C[]; zones: { label: string }[] };
export interface Tpl { id: string; difficulties: readonly string[]; notions?: readonly string[]; chartShape?: string; build?: (rng: () => number, m: number, d?: string) => Raw }

const SEEDS = [7, 77, 777];
const head = (cs: C[], flip: boolean) => {
  // (renversé : le plus haut devient le plus bas)
  const b = flip ? -cs[0].o : cs[0].o;
  return cs.slice(0, 8).map((k) => (flip ? [-k.o, -k.l, -k.h, -k.c] : [k.o, k.h, k.l, k.c]).map((x) => (x - b).toFixed(4)).join(",")).join(";");
};
function signature(t: Tpl) {
  if (!t.build) return { key: `forme:${t.chartShape ?? t.id}`, fkey: `forme:${t.chartShape ?? t.id}`, labels: "", mlabels: "" };
  const rs = SEEDS.map((s) => t.build!(mulberry32(s), 1, t.difficulties[0]));
  const L = [...new Set(rs[0].zones.map((z) => z.label))];
  return { key: rs.map((r) => head(r.past, false)).join("#"), fkey: rs.map((r) => head(r.past, true)).join("#"), labels: [...L].sort().join("|"), mlabels: L.map(mirrorLabel).sort().join("|") };
}

/** Paires de niveaux différents, notion partagée, même graphique et mêmes zones */
export function duplicatePairs(ts: Tpl[]): string[] {
  const S = new Map(ts.map((t) => [t.id, signature(t)]));
  const out: string[] = [];
  for (let i = 0; i < ts.length; i++) for (let j = i + 1; j < ts.length; j++) {
    const a = ts[i], b = ts[j];
    if (a.difficulties[0] === b.difficulties[0]) continue;
    const nb = roundNotions((b.notions ?? []) as NotionId[]);
    const shared = roundNotions((a.notions ?? []) as NotionId[]).filter((n) => nb.includes(n));
    if (!shared.length) continue;
    const A = S.get(a.id)!, B = S.get(b.id)!;
    const same = A.key === B.key && A.labels === B.labels, mir = A.key === B.fkey && A.labels === B.mlabels;
    if (same || mir) out.push(`« ${a.id} » (${a.difficulties[0]}) et « ${b.id} » (${b.difficulties[0]}) : notion ${shared.join(", ")}, même graphique${mir && !same ? " (au sens près)" : ""} et mêmes niveaux${A.labels ? ` (${A.labels})` : ` (${A.key})`}`);
  }
  return out;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const GAMES: [string, Tpl[]][] = [
  ["Buy/Sell", BS.SCENARIO_TEMPLATES as any], ["Trouve l'erreur", FTM.MISTAKE_TEMPLATES as any],
  ["Place ton Stop", PS.PLACE_STOP_TEMPLATES as any], ["Build the Trade", BT.BUILD_TRADE_TEMPLATES as any],
];
/* eslint-enable @typescript-eslint/no-explicit-any */

let errors = 0;
const lines: string[] = [];
if (process.argv.includes("--autotest")) {
  // Défaut injecté : un scénario recopié à un autre niveau (même construction, même notion)
  const ps = PS.PLACE_STOP_TEMPLATES as unknown as Tpl[];
  const src = ps.find((t) => t.build && t.difficulties[0] === "beginner")!;
  const copy = { ...src, id: "copie_intermediaire", difficulties: ["intermediate"] };
  const ok1 = duplicatePairs([src, copy]).length > 0;
  lines.push(`${ok1 ? "détecté" : "MANQUÉ "}  scénario recopié en Intermédiaire (même graphique, même notion)`);
  // Défaut injecté : variante de vente (miroir) d'un scénario d'un autre niveau
  const mirrorSrc = ps.find((t) => t.id === "adv_stop_sweep")!, mirrorOf = ps.find((t) => t.id === "adv_stop_sweep_vente")!;
  const ok2 = duplicatePairs([{ ...mirrorSrc, difficulties: ["intermediate"] }, mirrorOf]).length > 0;
  lines.push(`${ok2 ? "détecté" : "MANQUÉ "}  variante de vente d'un scénario placée à un autre niveau`);
  if (!ok1) errors++;
  if (!ok2) errors++;
  // Témoin : même notion, graphiques différents (aucune erreur attendue)
  const a = ps.find((t) => t.id === "deb_stop_swing_low")!, b = ps.find((t) => t.id === "int_stop_structure")!;
  const fp = duplicatePairs([a, b]);
  lines.push(`${fp.length ? "FAUX POSITIF" : "aucun faux positif"}  témoin (swing low Débutant, BOS et retest Intermédiaire)`);
  if (fp.length) errors++;
} else {
  for (const [game, tpls] of GAMES) {
    const d = duplicatePairs(tpls);
    errors += d.length;
    for (const x of d) lines.push(`  ERREUR ${game} · ${x}`);
    lines.push(`${game} : ${tpls.length} scénarios, ${d.length} paire(s) identique(s) d'un niveau à l'autre`);
  }
}
console.log(lines.join("\n"));
console.log(`RESULTAT erreurs=${errors} avertissements=0`);
