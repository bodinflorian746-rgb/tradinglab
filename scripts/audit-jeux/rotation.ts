// Rotation des scénarios (règle PO) : jamais deux fois le même scénario dans une partie ;
// d'une partie à l'autre, un scénario déjà joué ne revient qu'une fois tous les autres du
// niveau passés. Simule des séries de parties par jeu et par niveau avec l'historique du
// navigateur (lib/games/rotation.ts) et compte :
//  - les doublons dans une partie ;
//  - les retours trop tôt : un scénario rejoué alors qu'un autre du niveau n'est pas encore passé
//    depuis le début du cycle (le cycle repart, mélangé, une fois tout le niveau passé) ;
//  - les parties plus courtes que prévu (pool du niveau < nombre de manches).
// Usage : npx vite-node scripts/audit-jeux/rotation.ts [--autotest] [--parties=20] (lancé par run.mjs)
import * as BS from "../../lib/games/buy-sell-no-trade";
import * as FTM from "../../lib/games/find-the-mistake";
import * as PS from "../../lib/games/place-stop";
import * as BT from "../../lib/games/build-the-trade";
import { EMPTY_HISTORY, nextHistory, type RotationHistory } from "../../lib/games/rotation";

type Gen = (seed: number, d: Difficulty, h?: RotationHistory) => { id: string }[];
type Difficulty = "beginner" | "intermediate" | "advanced";
const DIFFS: Difficulty[] = ["beginner", "intermediate", "advanced"];
/* eslint-disable @typescript-eslint/no-explicit-any */
const GAMES: [string, Gen, (d: Difficulty) => { id: string }[], number][] = [
  ["Buy/Sell", BS.generateScenarios as any, BS.scenarioPool as any, BS.ROUNDS_PER_SESSION],
  ["Trouve l'erreur", FTM.generateMistakeScenarios as any, FTM.scenarioPool as any, FTM.ROUNDS_PER_SESSION],
  ["Place ton Stop", PS.generatePlaceStopScenarios as any, PS.scenarioPool as any, PS.ROUNDS_PER_SESSION],
  ["Build the Trade", BT.generateBuildTradeScenarios as any, BT.scenarioPool as any, BT.ROUNDS_PER_SESSION],
];
/* eslint-enable @typescript-eslint/no-explicit-any */
const PARTIES = Number((process.argv.find((a) => a.startsWith("--parties=")) ?? "--parties=20").split("=")[1]);

export interface RotationStats { doublons: number; tropTot: number; courtes: number; parties: number; ecartMin: number; detail: string[] }

/** Joue `parties` parties d'affilée (même navigateur) et compte les écarts à la règle. */
export function simulate(gen: Gen, poolIds: string[], rounds: number, d: Difficulty, parties: number, seed0 = 1): RotationStats {
  const st: RotationStats = { doublons: 0, tropTot: 0, courtes: 0, parties, ecartMin: Infinity, detail: [] };
  let h: RotationHistory = EMPTY_HISTORY;
  // Cycle recalculé ici, indépendamment de lib/games/rotation.ts
  const cycle = new Set<string>();
  const lastPlay = new Map<string, number>(); // id → rang global de jeu (écart minimal entre deux passages)
  let t = 0;
  for (let p = 0; p < parties; p++) {
    const ids = gen((seed0 + p * 7919) >>> 0, d, h).map((x) => x.id);
    const dup = ids.length - new Set(ids).size;
    if (dup) { st.doublons += dup; st.detail.push(`partie ${p + 1} : ${dup} doublon(s) (${ids.join(", ")})`); }
    if (ids.length < Math.min(rounds, poolIds.length) || poolIds.length < rounds) { st.courtes++; if (st.courtes === 1) st.detail.push(`pool de ${poolIds.length} scénarios pour ${rounds} manches`); }
    for (const id of ids) {
      if (cycle.size === poolIds.length) cycle.clear(); // tout le niveau est passé : nouveau cycle
      if (cycle.has(id)) {
        const missing = poolIds.filter((o) => !cycle.has(o));
        st.tropTot++; if (st.detail.length < 6) st.detail.push(`partie ${p + 1} : « ${id} » revient avant ${missing.slice(0, 3).join(", ")}${missing.length > 3 ? "…" : ""}`);
      }
      cycle.add(id);
      const prev = lastPlay.get(id);
      if (prev !== undefined) st.ecartMin = Math.min(st.ecartMin, t - prev);
      lastPlay.set(id, t++);
    }
    h = nextHistory(h, ids, poolIds);
  }
  return st;
}

let errors = 0;
const lines: string[] = [];
if (process.argv.includes("--autotest")) {
  // Défauts injectés : chacun doit être détecté
  const pool = BS.scenarioPool("intermediate").map((t) => t.id);
  const oldGen: Gen = (seed, d) => {
    // ancien tirage : mélange puis i % taille, sans historique
    const p = BS.scenarioPool(d); const rng = BS.mulberry32(seed); const sh = [...p];
    for (let i = sh.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [sh[i], sh[j]] = [sh[j], sh[i]]; }
    return Array.from({ length: BS.ROUNDS_PER_SESSION }, (_, i) => sh[i % sh.length]);
  };
  const cases: [string, () => boolean][] = [
    ["doublon dans une partie (pool répété)", () => simulate((s, d) => [...BS.generateScenarios(s, d).slice(0, 9), BS.generateScenarios(s, d)[0]], pool, 10, "intermediate", 3).doublons > 0],
    ["historique ignoré (scénario rejoué trop tôt)", () => simulate(oldGen, pool, 10, "intermediate", 6).tropTot > 0],
    ["pool plus petit que le nombre de manches", () => simulate((s, d, h) => BS.generateScenarios(s, d, h).slice(0, 7), pool.slice(0, 7), 10, "intermediate", 2).courtes > 0],
  ];
  for (const [name, run] of cases) {
    const ok = run();
    lines.push(`${ok ? "détecté" : "MANQUÉ "}  ${name}`);
    if (!ok) errors++;
  }
  // Témoin : la vraie rotation, sur un niveau assez grand, ne déclenche rien
  const fp = simulate(BS.generateScenarios as unknown as Gen, pool, BS.ROUNDS_PER_SESSION, "intermediate", 12);
  const clean = pool.length >= BS.ROUNDS_PER_SESSION && !fp.doublons && !fp.tropTot;
  lines.push(`${clean ? "aucun faux positif" : "FAUX POSITIF"}  témoin (rotation réelle, Buy/Sell intermédiaire, 12 parties)`);
  if (!clean) errors++;
} else {
  for (const [name, gen, pool, rounds] of GAMES) for (const d of DIFFS) {
    const ids = pool(d).map((t) => t.id);
    const st = simulate(gen, ids, rounds, d, PARTIES);
    const e = st.doublons + st.tropTot + st.courtes;
    errors += e;
    lines.push(`${e ? "  ERREUR" : "  ok    "} ${name.padEnd(16)} ${d.padEnd(12)} ${String(ids.length).padStart(2)} scénarios, ${rounds} manches : doublons ${st.doublons}, retours trop tôt ${st.tropTot}, parties courtes ${st.courtes} (${PARTIES} parties ; écart minimal entre deux passages : ${st.ecartMin} manches)`);
    for (const x of st.detail.slice(0, 3)) lines.push(`           ${x}`);
  }
}
console.log(lines.join("\n"));
console.log(`RESULTAT erreurs=${errors} avertissements=0`);
