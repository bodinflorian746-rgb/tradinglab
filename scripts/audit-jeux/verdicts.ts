// Audit des verdicts : énumère toutes les issues possibles des 4 jeux et
// vérifie le barème simple (décision PO, J10).
// Usage : npx vite-node scripts/audit-jeux/verdicts.ts (lancé par run.mjs)
//
// Buy/Sell/No Trade, Trouve l'erreur, Place ton Stop : bonne réponse = +10 (bon,
// vert), mauvaise = 0 (faux, rouge), série sans effet. Build the Trade : +10 par
// décision juste (entrée, stop, TP), verdict « x/3 » : 3/3 vert, 1-2/3 ambre,
// 0/3 rouge, identique en FR/EN/ES ; l'issue du trade ne change pas les points.
import * as BS from "../../lib/games/buy-sell-no-trade";
import * as FTM from "../../lib/games/find-the-mistake";
import * as PS from "../../lib/games/place-stop";
import * as BT from "../../lib/games/build-the-trade";
import * as BTEN from "../../lib/games/build-the-trade-en";
import * as BTES from "../../lib/games/build-the-trade-es";

type State = "good" | "partial" | "bad";
const DIFFS = ["beginner", "intermediate", "advanced"] as const;
const SEEDS = 40;
let errors = 0;
const seen: Record<string, number> = {};
const lines: string[] = [];
const fail = (m: string) => { errors++; if (errors <= 15) lines.push(`  ERREUR ${m}`); };
function check(game: string, label: string, state: State, points: number, expected: number, ctx: string) {
  const k = `${game} · ${state.padEnd(7)} · ${label} · ${points >= 0 ? "+" : ""}${points}`;
  seen[k] = (seen[k] ?? 0) + 1;
  if (points !== expected) fail(`${game} ${ctx} : ${points} points au lieu de ${expected}`);
  if (state === "good" && !(points > 0)) fail(`${game} ${ctx} : état bon avec ${points} points`);
  if (state === "bad" && points !== 0) fail(`${game} ${ctx} : état faux avec ${points} points`);
}

// Simple : correct ⇒ +10 bon, sinon 0 faux, quelle que soit la série
for (const d of DIFFS) for (let s = 1; s <= SEEDS; s++) for (const inst of BS.generateScenarios(s * 7919, d)) {
  for (const choice of ["BUY", "SELL", "NO_TRADE"] as const) for (const streak of [0, 3]) {
    const r = BS.scoreChoice(choice, inst.correctAnswer, streak);
    if (r.correct !== (choice === inst.correctAnswer)) fail(`Buy/Sell/No Trade ${inst.id} : bonne réponse modifiée`);
    check("Buy/Sell/No Trade", r.correct ? "bonne lecture" : "mauvaise lecture", r.correct ? "good" : "bad", r.points, r.correct ? 10 : 0, `${inst.id}/${choice}`);
  }
}
for (const d of DIFFS) for (let s = 1; s <= SEEDS; s++) for (const inst of FTM.generateMistakeScenarios(s * 7919, d)) {
  for (const pick of inst.shuffledChoices) for (const streak of [0, 3]) {
    const r = FTM.scoreMistakeChoice(pick, inst.correctMistake, streak);
    if (r.correct !== (pick === inst.correctMistake)) fail(`Trouve l'erreur ${inst.id} : bonne réponse modifiée`);
    check("Trouve l'erreur", r.correct ? "bien vu" : "pas la bonne erreur", r.correct ? "good" : "bad", r.points, r.correct ? 10 : 0, `${inst.id}/${pick}`);
  }
}
for (const d of DIFFS) for (let s = 1; s <= SEEDS; s++) for (const inst of PS.generatePlaceStopScenarios(s * 7919, d)) {
  const ch = PS.buildPlaceStopChart(inst.id, inst.seed, inst.volatility, d);
  const correctType = ch.stops.some((x) => x.type === "logical") ? "logical" : "wide";
  for (const st of ch.stops) for (const streak of [0, 3]) {
    const r = PS.scoreStopChoice(st.id, ch, streak);
    if (r.correct !== (st.type === correctType)) fail(`Place ton Stop ${inst.id} : bonne réponse modifiée`);
    check("Place ton Stop", r.correct ? "bon placement" : `stop ${st.type}`, r.correct ? "good" : "bad", r.points, r.correct ? 10 : 0, `${inst.id}/${st.type}`);
  }
}

// Build the Trade : 27 plans par graphique
const COLOR_STATE: Record<string, State> = { emerald: "good", amber: "partial", red: "bad" };
const ENTRIES = ["aggressive", "confirmation", "deep_pullback"] as const;
const STOPS = ["tight", "logical", "wide"] as const;
const TPS = ["fast", "balanced", "ambitious"] as const;
if (BT.MAX_TRADE_POINTS !== 30) fail(`Build the Trade : maximum ${BT.MAX_TRADE_POINTS} au lieu de 30`);
for (const d of DIFFS) for (let s = 1; s <= SEEDS / 2; s++) for (const inst of BT.generateBuildTradeScenarios(s * 7919, d)) {
  const ch = BT.buildBuildTradeChart(inst, inst.seed, inst.volatility);
  for (const entry of ENTRIES) for (const stop of STOPS) for (const tp of TPS) {
    const r = BT.evaluateTrade({ entry, stop, tp }, ch, inst.optimal, 3);
    const ctx = `${inst.id}/${entry}-${stop}-${tp}`;
    const q = (entry === inst.optimal.entry ? 1 : 0) + (stop === inst.optimal.stop ? 1 : 0) + (tp === inst.optimal.tp ? 1 : 0);
    if (r.qualityMatch !== q) fail(`Build the Trade ${ctx} : ${r.qualityMatch}/3 au lieu de ${q}/3`);
    const [vf, ve, vs] = [BT.setupVerdict(r), BTEN.setupVerdict(r), BTES.setupVerdict(r)];
    if (vf.color !== ve.color || vf.color !== vs.color) fail(`Build the Trade ${ctx} : couleur différente selon la langue`);
    const want: State = q === 3 ? "good" : q >= 1 ? "partial" : "bad";
    if (COLOR_STATE[vf.color] !== want) fail(`Build the Trade ${ctx} : ${q}/3 en ${vf.color}`);
    if (![vf.label, ve.label, vs.label].every((l) => l.startsWith(`${q}/3`))) fail(`Build the Trade ${ctx} : libellé sans « ${q}/3 »`);
    if (r.points !== 10 * q || r.points > BT.MAX_TRADE_POINTS) fail(`Build the Trade ${ctx} : ${r.points} points pour ${q}/3`);
    const k = `Build the Trade · ${COLOR_STATE[vf.color].padEnd(7)} · ${vf.label} · +${r.points}`;
    seen[k] = (seen[k] ?? 0) + 1;
  }
}

lines.push("Issues énumérées (jeu · état · libellé · points : occurrences) :");
for (const [k, v] of Object.entries(seen).sort()) lines.push(`  ${k} : ${v}`);
console.log(lines.join("\n"));
console.log(`RESULTAT erreurs=${errors} avertissements=0`);
