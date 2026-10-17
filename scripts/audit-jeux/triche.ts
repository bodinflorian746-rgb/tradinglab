// Pas de réflexe gagnant (règle PO), par jeu et par niveau, sur des parties simulées comme en jeu
// (rotation et historique du navigateur, lib/games/rotation.ts) :
//  - répartition des bonnes réponses : aucune plus de 40 % du temps (BUY / SELL / NO TRADE ;
//    Stop 1 / 2 / 3 ; entrée, stop et TP de Build the Trade ; position du bon choix de Trouve l'erreur) ;
//  - « joueur triche » qui applique une recette sans lire le graphique : il gagne moins de 45 % du temps.
//    Buy/Sell : toujours BUY, toujours SELL, toujours NO TRADE, suivre la pastille d'UT supérieure
//    (affichée en Intermédiaire et Avancé), suivre la couleur de la dernière bougie.
//    Place ton Stop : toujours le stop le plus proche, le plus loin, celui du milieu ; toujours Stop 1, 2, 3.
//    Build the Trade : toujours le même trio entrée / stop / TP (27 recettes).
//    Trouve l'erreur : toujours la même erreur quand elle est proposée ; toujours le même rang de choix ;
//    accuser l'UT supérieure dès que la pastille contredit le sens du trade.
// Usage : npx vite-node scripts/audit-jeux/triche.ts [--autotest] [--parties=200] (lancé par run.mjs)
import * as BS from "../../lib/games/buy-sell-no-trade";
import * as FTM from "../../lib/games/find-the-mistake";
import * as PS from "../../lib/games/place-stop";
import * as BT from "../../lib/games/build-the-trade";
import { EMPTY_HISTORY, nextHistory, type RotationHistory } from "../../lib/games/rotation";

type D = "beginner" | "intermediate" | "advanced";
const DIFFS: D[] = ["beginner", "intermediate", "advanced"];
const PARTIES = Number((process.argv.find((a) => a.startsWith("--parties=")) ?? "--parties=200").split("=")[1]);
export const MAX_SHARE = 0.4, MAX_CHEAT = 0.45;

/** Une manche réduite à ce que la mesure lit : la bonne réponse (clé) et les recettes qui gagnent */
export interface Round { answer: string; cheats: Record<string, boolean> }

/** Parties simulées d'affilée, dans le même navigateur */
function play<T extends { id: string }>(gen: (s: number, d: D, h?: RotationHistory) => T[], pool: (d: D) => { id: string }[], d: D, parties: number): T[] {
  let h: RotationHistory = EMPTY_HISTORY;
  const ids = pool(d).map((t) => t.id);
  const out: T[] = [];
  for (let p = 0; p < parties; p++) {
    const inst = gen((7 + p * 7919) >>> 0, d, h);
    out.push(...inst);
    h = nextHistory(h, inst.map((x) => x.id), ids);
  }
  return out;
}

export interface Report { answers: Record<string, number>; cheats: Record<string, number>; n: number }
export function measure(rounds: Round[]): Report {
  const answers: Record<string, number> = {}, cheats: Record<string, number> = {};
  for (const r of rounds) {
    answers[r.answer] = (answers[r.answer] ?? 0) + 1;
    for (const [k, win] of Object.entries(r.cheats)) cheats[k] = (cheats[k] ?? 0) + (win ? 1 : 0);
  }
  const n = rounds.length || 1;
  for (const k in answers) answers[k] /= n;
  for (const k in cheats) cheats[k] /= n;
  return { answers, cheats, n: rounds.length };
}
export function reportErrors(r: Report, answerKeys: (k: string) => string = (k) => k): string[] {
  const e: string[] = [];
  // réponses : par famille (préfixe avant « : »), chaque valeur ≤ 40 %
  for (const [k, v] of Object.entries(r.answers)) if (v > MAX_SHARE) e.push(`réponse ${answerKeys(k)} correcte ${(100 * v).toFixed(0)} % du temps (au plus 40 %)`);
  for (const [k, v] of Object.entries(r.cheats)) if (v >= MAX_CHEAT) e.push(`joueur triche « ${k} » gagne ${(100 * v).toFixed(0)} % (moins de 45 %)`);
  return e;
}

// ─── Manches par jeu ──────────────────────────────────────────────────────────

const ctxOf = (i: { asset: BS.ScenarioInstance["asset"]; session: BS.ScenarioInstance["session"] }) => ({ asset: i.asset, session: i.session });

function bsntRounds(d: D, parties: number): Round[] {
  return play<BS.ScenarioInstance>(BS.generateScenarios as never, BS.scenarioPool as never, d, parties).map((i) => {
    const ch = BS.buildChart(i.id, i.seed, i.volatility, d, ctxOf(i));
    const k = ch.past[ch.past.length - 1];
    const col: BS.GameChoice = Math.abs(k.c - k.o) <= 0.1 * (k.h - k.l) ? "NO_TRADE" : k.c > k.o ? "BUY" : "SELL";
    const pill: BS.GameChoice = i.htfBias === "bullish" ? "BUY" : i.htfBias === "bearish" ? "SELL" : "NO_TRADE";
    return {
      answer: i.correctAnswer,
      cheats: {
        "toujours BUY": i.correctAnswer === "BUY", "toujours SELL": i.correctAnswer === "SELL", "toujours NO TRADE": i.correctAnswer === "NO_TRADE",
        ...(d === "beginner" ? {} : { "suivre la pastille d'UT supérieure": pill === i.correctAnswer }),
        "suivre la couleur de la dernière bougie": col === i.correctAnswer,
      },
    };
  });
}

function psRounds(d: D, parties: number): Round[] {
  return play<PS.PlaceStopInstance>(PS.generatePlaceStopScenarios as never, PS.scenarioPool as never, d, parties).map((i) => {
    const ch = PS.buildPlaceStopChart(i.id, i.seed, i.volatility, d, ctxOf(i));
    const correctType = ch.stops.some((s) => s.type === "logical") ? "logical" : "wide";
    const byDist = [...ch.stops].sort((a, b) => Math.abs(a.price - ch.entry) - Math.abs(b.price - ch.entry));
    const byPos = [...ch.stops].sort((a, b) => b.price - a.price);
    const good = (s: PS.StopOption) => s.type === correctType;
    const pos = byPos.findIndex(good) + 1;
    return {
      answer: `Stop ${pos}`,
      cheats: {
        "toujours le stop le plus proche": good(byDist[0]), "toujours le stop du milieu": good(byDist[1]), "toujours le stop le plus loin": good(byDist[2]),
        "toujours Stop 1": pos === 1, "toujours Stop 2": pos === 2, "toujours Stop 3": pos === 3,
      },
    };
  });
}

function bttRounds(d: D, parties: number): Round[] {
  const E: BT.EntryType[] = ["aggressive", "confirmation", "deep_pullback"], S: BT.StopType[] = ["tight", "logical", "wide"], T: BT.TpType[] = ["fast", "balanced", "ambitious"];
  return play<BT.BuildTradeInstance>(BT.generateBuildTradeScenarios as never, BT.scenarioPool as never, d, parties).map((i) => {
    const o = i.optimal;
    const cheats: Record<string, boolean> = {};
    for (const e of E) for (const s of S) for (const t of T) cheats[`toujours ${BT.ENTRY_LABELS[e]} / ${BT.STOP_LABELS[s]} / ${BT.TP_LABELS[t]}`] = o.entry === e && o.stop === s && o.tp === t;
    return { answer: `entrée ${BT.ENTRY_LABELS[o.entry]}|stop ${BT.STOP_LABELS[o.stop]}|TP ${BT.TP_LABELS[o.tp]}`, cheats };
  });
}

function ftmRounds(d: D, parties: number): Round[] {
  const ids = Object.keys(FTM.MISTAKE_LABELS) as FTM.MistakeId[];
  return play<FTM.MistakeInstance>(FTM.generateMistakeScenarios as never, FTM.scenarioPool as never, d, parties).map((i) => {
    const ch = i.shuffledChoices;
    const pos = ch.indexOf(i.correctMistake);
    const cheats: Record<string, boolean> = {};
    for (const id of ids) cheats[`toujours « ${FTM.MISTAKE_LABELS[id]} » si proposée`] = ch.includes(id) ? id === i.correctMistake : pos === 0;
    for (let k = 0; k < ch.length; k++) cheats[`toujours le choix n° ${k + 1}`] = pos === k;
    const dir = (i as unknown as { direction?: string }).direction;
    const against = dir && ((dir === "BUY" && i.htfBias === "bearish") || (dir === "SELL" && i.htfBias === "bullish"));
    if (d !== "beginner") cheats["accuser l'UT supérieure quand la pastille contredit le trade"] = against && ch.includes("trade_against_htf") ? i.correctMistake === "trade_against_htf" : pos === 0;
    return { answer: `choix n° ${pos + 1}`, cheats };
  });
}

/** Bonnes réponses de Build the Trade : chaque option de chaque décision ≤ 40 % */
function bttShares(rounds: Round[]): Record<string, number> {
  const c: Record<string, number> = {};
  for (const r of rounds) for (const part of r.answer.split("|")) c[part] = (c[part] ?? 0) + 1;
  for (const k in c) c[k] /= rounds.length || 1;
  return c;
}

export const GAMES: [string, (d: D, n: number) => Round[]][] = [
  ["Buy/Sell", bsntRounds], ["Trouve l'erreur", ftmRounds], ["Place ton Stop", psRounds], ["Build the Trade", bttRounds],
];

let errors = 0;
const lines: string[] = [];
if (process.argv.includes("--autotest")) {
  // Défauts injectés : chacun doit être détecté
  const mk = (answer: string, cheats: Record<string, boolean>): Round => ({ answer, cheats });
  const cases: [string, Round[]][] = [
    ["réponse BUY correcte 60 % du temps", [...Array(6)].map(() => mk("BUY", {})).concat([...Array(4)].map(() => mk("SELL", {})))],
    ["joueur « toujours NO TRADE » à 50 %", [...Array(5)].map(() => mk("NO_TRADE", { "toujours NO TRADE": true })).concat([...Array(5)].map((_, j) => mk(j % 2 ? "BUY" : "SELL", { "toujours NO TRADE": false })))],
    ["joueur « stop du milieu » à 45 % pile", [...Array(9)].map(() => mk("Stop 2", { "milieu": true })).concat([...Array(11)].map((_, j) => mk(`Stop ${1 + (j % 2) * 2}`, { "milieu": false })))],
  ];
  for (const [name, rounds] of cases) { const ok = reportErrors(measure(rounds)).length > 0; lines.push(`${ok ? "détecté" : "MANQUÉ "}  ${name}`); if (!ok) errors++; }
  const fine = [...Array(30)].map((_, j) => mk(["BUY", "SELL", "NO_TRADE"][j % 3], { "toujours BUY": j % 3 === 0 }));
  const fp = reportErrors(measure(fine));
  lines.push(`${fp.length ? "FAUX POSITIF" : "aucun faux positif"}  témoin (un tiers chacun)`);
  if (fp.length) errors++;
} else {
  const only = process.argv.find((a) => a.startsWith("--jeu="))?.split("=")[1];
  for (const [game, rounds] of GAMES) {
    if (only && !game.toLowerCase().startsWith(only.toLowerCase())) continue;
    for (const d of DIFFS) {
      const rs = rounds(d, PARTIES);
      const rep = measure(rs);
      if (game === "Build the Trade") rep.answers = bttShares(rs);
      const e = reportErrors(rep);
      errors += e.length;
      const ans = Object.entries(rep.answers).sort().map(([k, v]) => `${k} ${(100 * v).toFixed(0)} %`).join(", ");
      const worst = Object.entries(rep.cheats).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k, v]) => `${k} ${(100 * v).toFixed(0)} %`).join(" ; ");
      lines.push(`${e.length ? "  ERREUR" : "  ok    "} ${game.padEnd(16)} ${d.padEnd(12)} ${rep.n} manches | réponses : ${ans} | meilleures recettes : ${worst}`);
      for (const x of e.slice(0, 4)) lines.push(`           ${x}`);
    }
  }
}
console.log(lines.join("\n"));
console.log(`RESULTAT erreurs=${errors} avertissements=0`);
