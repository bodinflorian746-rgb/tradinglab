// Audit des verdicts : énumère toutes les issues possibles des 4 jeux et
// vérifie la cohérence état ↔ points ↔ libellé ↔ maximum.
// Usage : npx vite-node scripts/audit-jeux/verdicts.ts (lancé par run.mjs)
//
// États (VerdictOverlay) : bon (vert), partiel (ambre), faux (rouge).
// Règles : bon ⇒ points > 0 ; faux ⇒ points < 0 ; points hors bonus ≤ maximum ;
// Build the Trade : couleur du verdict identique en FR/EN/ES, « plan faible »
// exactement quand le TP est touché avec 0 ou 1 critère sur 3.
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
function check(game: string, label: string, state: State, points: number, max: number, ctx: string) {
  seen[`${game} · ${state.padEnd(7)} · ${label}`] = (seen[`${game} · ${state.padEnd(7)} · ${label}`] ?? 0) + 1;
  const bad = (m: string) => { errors++; if (errors <= 15) lines.push(`  ERREUR ${game} ${ctx} : ${m}`); };
  if (state === "good" && !(points > 0)) bad(`état bon avec ${points} points`);
  if (state === "bad" && !(points < 0)) bad(`état faux avec ${points} points`);
  if (points > max) bad(`points ${points} > maximum ${max}`);
  if (!(max > 0)) bad(`maximum ${max} non positif`);
}

// Buy / Sell / No Trade : correct = +100 (+120 si NO TRADE), sinon négatif
for (const d of DIFFS) for (let s = 1; s <= SEEDS; s++) for (const inst of BS.generateScenarios(s * 7919, d)) {
  for (const choice of ["BUY", "SELL", "NO_TRADE"] as const) for (const streak of [0, 3]) {
    const r = BS.scoreChoice(choice, inst.correctAnswer, streak);
    check("Buy/Sell/No Trade", r.correct ? "bonne lecture" : "mauvaise lecture", r.correct ? "good" : "bad", r.points - r.streakBonus, inst.correctAnswer === "NO_TRADE" ? 120 : 100, `${inst.id}/${choice}`);
  }
}

// Trouve l'erreur : bonne erreur = +100, sinon -30
for (const d of DIFFS) for (let s = 1; s <= SEEDS; s++) for (const inst of FTM.generateMistakeScenarios(s * 7919, d)) {
  for (const pick of inst.shuffledChoices) for (const streak of [0, 3]) {
    const r = FTM.scoreMistakeChoice(pick, inst.correctMistake, streak);
    check("Trouve l'erreur", r.correct ? "bien vu" : "pas la bonne erreur", r.correct ? "good" : "bad", r.points - r.streakBonus, 100, `${inst.id}/${pick}`);
  }
}

// Place ton Stop : bon stop = bon ; stop trop large = partiel (+30) ; serré / liquidité = faux
for (const d of DIFFS) for (let s = 1; s <= SEEDS; s++) for (const inst of PS.generatePlaceStopScenarios(s * 7919, d)) {
  const ch = PS.buildPlaceStopChart(inst.id, inst.seed, inst.volatility, d);
  const hasLogical = ch.stops.some((x) => x.type === "logical");
  for (const st of ch.stops) for (const streak of [0, 3]) {
    const r = PS.scoreStopChoice(st.id, ch, streak);
    const state: State = r.correct ? "good" : st.type === "wide" ? "partial" : "bad";
    // Libellé du stop trop large : R/R affiché (1 décimale) ≥ 1 → « RR dégradé », sinon « RR cassé »
    const rr = ch.tp !== null ? Number(Math.abs((ch.tp - ch.entry) / (ch.entry - st.price)).toFixed(1)) : null;
    const label = r.correct ? "bon placement" : st.type === "wide" ? (rr !== null && rr >= 1 ? "trop loin, RR dégradé" : "trop loin, RR cassé") : st.type;
    check("Place ton Stop", label, state, r.points - r.streakBonus, 100, `${inst.id}/${st.type}${hasLogical ? "" : " (inversé)"}`);
  }
}

// Build the Trade : 27 plans par graphique, verdict en FR / EN / ES
const COLOR_STATE: Record<string, State> = { emerald: "good", amber: "partial", red: "bad" };
const ENTRIES = ["aggressive", "confirmation", "deep_pullback"] as const;
const STOPS = ["tight", "logical", "wide"] as const;
const TPS = ["fast", "balanced", "ambitious"] as const;
for (const d of DIFFS) for (let s = 1; s <= SEEDS / 2; s++) for (const inst of BT.generateBuildTradeScenarios(s * 7919, d)) {
  const ch = BT.buildBuildTradeChart(inst, inst.seed, inst.volatility);
  const max = BT.maxTradePoints(ch, inst.optimal);
  for (const entry of ENTRIES) for (const stop of STOPS) for (const tp of TPS) {
    const r = BT.evaluateTrade({ entry, stop, tp }, ch, inst.optimal, 3);
    const [vf, ve, vs] = [BT.setupVerdict(r), BTEN.setupVerdict(r), BTES.setupVerdict(r)];
    const ctx = `${inst.id}/${entry}-${stop}-${tp}`;
    if (vf.color !== ve.color || vf.color !== vs.color) { errors++; lines.push(`  ERREUR Build the Trade ${ctx} : couleur différente selon la langue`); }
    const weak = r.outcome === "tp_hit" && r.qualityMatch <= 1;
    if (weak !== (vf.label === "Gagnant, mais plan faible")) { errors++; lines.push(`  ERREUR Build the Trade ${ctx} : libellé « plan faible » incohérent`); }
    check("Build the Trade", vf.label, COLOR_STATE[vf.color], r.points - r.streakBonus, max, ctx);
  }
}

lines.push("Issues énumérées (jeu · état · libellé : occurrences) :");
for (const [k, v] of Object.entries(seen).sort()) lines.push(`  ${k} : ${v}`);
console.log(lines.join("\n"));
console.log(`RESULTAT erreurs=${errors} avertissements=0`);
