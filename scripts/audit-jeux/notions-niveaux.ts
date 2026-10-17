// Notions du niveau (règle PO) : un scénario n'utilise que des notions de son niveau ou d'un niveau
// inférieur, rattachées à la leçon qui les enseigne (lib/games/notions.ts). Pour chaque scénario
// des 4 jeux :
//  - un seul niveau de jeu, des notions toutes connues ;
//  - Débutant : leçons Débutant seulement, une seule notion de manche (vocabulaire de base à part) ;
//  - Intermédiaire : leçons jusqu'à Intermédiaire, au moins deux notions combinées et un piège
//    décrit (le niveau ou le signal trompeur à écarter) ;
//  - Avancé : un conflit décrit (UT supérieure contre inférieure, news, sweep, clôture contre
//    mèche, R/R insuffisant…).
// Usage : npx vite-node scripts/audit-jeux/notions-niveaux.ts [--autotest] (lancé par run.mjs)
import * as BS from "../../lib/games/buy-sell-no-trade";
import * as FTM from "../../lib/games/find-the-mistake";
import * as PS from "../../lib/games/place-stop";
import * as BT from "../../lib/games/build-the-trade";
import { MISTAKE_NOTION } from "../../lib/games/ftm-scenarios";
import { ALLOWED_LEVELS, NOTIONS, roundNotions, type Difficulty, type NotionId } from "../../lib/games/notions";

export interface Tpl { id: string; difficulties: readonly string[]; notions?: readonly string[]; trap?: string; conflict?: string; correctMistake?: string; decoyMistakes?: readonly string[] }

export function notionErrors(t: Tpl): string[] {
  const e: string[] = [];
  if (t.difficulties.length !== 1) e.push(`${t.difficulties.length} niveaux (${t.difficulties.join(", ")}) : un scénario appartient à un seul niveau`);
  const d = t.difficulties[0] as Difficulty;
  if (!t.notions?.length) { e.push("aucune notion"); return e; }
  const unknown = t.notions.filter((n) => !(n in NOTIONS));
  if (unknown.length) e.push(`notion inconnue : ${unknown.join(", ")}`);
  const ids = t.notions.filter((n) => n in NOTIONS) as NotionId[];
  const allowed = ALLOWED_LEVELS[d] ?? [];
  for (const n of ids) if (!allowed.includes(NOTIONS[n].level)) e.push(`notion « ${n} » (${NOTIONS[n].lesson}) au-dessus du niveau ${d}`);
  const r = roundNotions(ids);
  if (d === "beginner" && r.length !== 1) e.push(`Débutant : ${r.length} notions de manche (${r.join(", ")}), une seule attendue`);
  if (d === "intermediate") {
    if (r.length < 2) e.push(`Intermédiaire : ${r.length} notion de manche, au moins deux combinées`);
    if (!t.trap?.trim()) e.push("Intermédiaire : piège à écarter non décrit");
  }
  if (d === "advanced" && !t.conflict?.trim()) e.push("Avancé : conflit à trancher non décrit");
  // Trouve l'erreur : chaque choix proposé (bonne réponse et leurres) relève d'une notion du niveau
  for (const c of t.correctMistake ? [t.correctMistake, ...(t.decoyMistakes ?? [])] : []) {
    const n = MISTAKE_NOTION[c] as NotionId | undefined;
    if (!n) e.push(`choix « ${c} » sans notion`);
    else if (!allowed.includes(NOTIONS[n].level)) e.push(`choix « ${c} » (${NOTIONS[n].lesson}) au-dessus du niveau ${d}`);
  }
  return e;
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
  const cases: [string, Tpl][] = [
    ["Débutant avec une notion Intermédiaire (faux breakout)", { id: "x", difficulties: ["beginner"], notions: ["faux_breakout"] }],
    ["Débutant avec deux notions de manche", { id: "x", difficulties: ["beginner"], notions: ["marteau", "take_profit"] }],
    ["Intermédiaire avec une notion Avancé (FVG)", { id: "x", difficulties: ["intermediate"], notions: ["fvg", "pullback"], trap: "piège" }],
    ["Intermédiaire sans piège", { id: "x", difficulties: ["intermediate"], notions: ["pullback", "changement_role"] }],
    ["Avancé sans conflit", { id: "x", difficulties: ["advanced"], notions: ["sweep", "liquidite"] }],
    ["scénario sur trois niveaux", { id: "x", difficulties: ["beginner", "intermediate", "advanced"], notions: ["marteau"] }],
    ["scénario sans notion", { id: "x", difficulties: ["beginner"] }],
    ["notion inconnue", { id: "x", difficulties: ["beginner"], notions: ["notion_inventee"] }],
    ["Trouve l'erreur : leurre Intermédiaire en Débutant", { id: "x", difficulties: ["beginner"], notions: ["fomo"], correctMistake: "fomo_after_pump", decoyMistakes: ["trade_against_htf", "no_stop", "bad_rr"] }],
  ];
  for (const [name, t] of cases) { const ok = notionErrors(t).length > 0; lines.push(`${ok ? "détecté" : "MANQUÉ "}  ${name}`); if (!ok) errors++; }
  const fine: Tpl[] = [
    { id: "a", difficulties: ["beginner"], notions: ["marteau", "support_resistance", "bougie"] },
    { id: "b", difficulties: ["intermediate"], notions: ["pullback", "changement_role", "marteau"], trap: "le plus haut précédent" },
    { id: "c", difficulties: ["advanced"], notions: ["sweep", "multi_ut"], conflict: "UT supérieure contre sweep" },
  ];
  const fp = fine.flatMap(notionErrors);
  lines.push(`${fp.length ? "FAUX POSITIF" : "aucun faux positif"}  témoins (un par niveau)`);
  if (fp.length) errors++;
} else {
  for (const [game, tpls] of GAMES) {
    let bad = 0;
    for (const t of tpls) {
      const e = notionErrors(t);
      if (e.length) { bad++; errors += e.length; if (lines.length < 80) lines.push(`  ERREUR ${game} · ${t.id} : ${e.join(" ; ")}`); }
    }
    lines.push(`${game} : ${tpls.length - bad}/${tpls.length} scénarios conformes`);
  }
}
console.log(lines.join("\n"));
console.log(`RESULTAT erreurs=${errors} avertissements=0`);
