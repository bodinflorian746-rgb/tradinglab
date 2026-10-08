// Données des schémas de leçons : continuité des bougies générées et chiffres du
// texte des leçons redonnés par les modèles (lib/lessons/models.ts).
// Usage : npx vite-node -c vitest.config.ts scripts/audit-lecons/data.ts (lancé par run.mjs).
import CANDLES from "@/lib/lessons/generated/candles.json";
import { isContinuous, pips, type Candle } from "@/lib/lessons/chart-analysis";
import { HS_CASES, SL_CASE } from "@/lib/lessons/line-data";
import { confluenceModel, headShouldersModel, PIP, precisionModel } from "@/lib/lessons/models";
import { BACKTEST_COUNTS, backtestStats, backtestTrades } from "@/lib/lessons/backtest";
import { checkLot14, checkLot15, checkLot16, checkLot17, checkLot9, checkLots } from "./data-lots";

let errors = 0;
const lines: string[] = [];
const check = (ok: boolean, what: string) => { if (!ok) { errors++; lines.push(`  ERREUR ${what}`); } };
const near = (a: number, b: number, tol: number) => Math.abs(a - b) <= tol;

// Bougies générées : continuité, mèches qui englobent le corps, jamais de corps nul
for (const [key, cs] of Object.entries(CANDLES as Record<string, Candle[]>)) {
  check(isContinuous(cs), `${key} : ouverture ≠ clôture précédente`);
  cs.forEach((k, i) => {
    check(k.h >= Math.max(k.o, k.c) && k.l <= Math.min(k.o, k.c), `${key} bougie ${i} : mèches`);
    check(k.c !== k.o, `${key} bougie ${i} : clôture = ouverture`);
  });
}

// Trading Intermédiaire 5 : HL 1.0850, support respecté 2×, Fibonacci 61.8% = 1.0848
{
  const m = confluenceModel("structure");
  check(near(m.fib, 1.0848, 0.5 * PIP), `Confluence (Int. 5) : Fibonacci 61.8% = ${m.fib.toFixed(5)}, le texte dit 1.0848`);
  check(near(m.L2.price, 1.0850, 1e-9) && m.piv.find((q) => q.index === m.L2.index)?.name === "HL", "Confluence (Int. 5) : le dernier HL n'est pas à 1.0850");
  check(m.L2.index === Math.max(...m.piv.filter((q) => q.side === "l").map((q) => q.index)), "Confluence (Int. 5) : le HL nommé n'est pas le dernier creux");
  check(near(m.L1.price, m.support, 1.5 * PIP) && near(m.L2.price, m.support, 1.5 * PIP), "Confluence (Int. 5) : le support n'est pas touché 2 fois");
  check([m.support, m.L2.price, m.fib].every((v) => v >= m.zone.y1 && v <= m.zone.y2), "Confluence (Int. 5) : la zone ne couvre pas les 3 niveaux");
  check(m.line[m.line.length - 1] >= m.zone.y1 && m.line[m.line.length - 1] <= m.zone.y2, "Confluence (Int. 5) : le prix n'est pas sur la zone");
}
// Support-résistance 2 : support historique + Fibonacci 61.8% + chiffre rond 1.1800
{
  const m = confluenceModel("chiffre-rond");
  check(near(m.round, 1.18, 1e-9), `Confluence (S/R 2) : chiffre rond ${m.round}`);
  check(near(m.fib, 1.18, 0.5 * PIP), `Confluence (S/R 2) : Fibonacci 61.8% = ${m.fib.toFixed(5)}, attendu 1.1800`);
  check([m.support, m.round, m.fib].every((v) => v >= m.zone.y1 && v <= m.zone.y2), "Confluence (S/R 2) : la zone ne couvre pas les 3 niveaux");
}

// Trading Avancé 7 : entrée imprécise R/R < 1:2, entrée de précision R/R > 1:3, SL 2 à 5 pips sous le niveau
{
  const m = precisionModel();
  const ob = m.H1[m.obI];
  check(ob.c < ob.o && m.H1[m.obI + 1].c > m.H1[m.obI + 1].o, "Précision : l'OB n'est pas la dernière rouge avant l'impulsion");
  check(m.bosI > m.obI && m.H1[m.bosI].c > m.prior.price, "Précision : pas de BOS au-dessus du sommet précédent");
  check(m.touchI >= 0 && m.M15.slice(0, m.touchI).every((k) => k.l > m.ob.y2), "Précision : le toucher n'est pas le 1er contact avec la zone");
  check(m.pinI > m.touchI, "Précision : la pin bar précède le toucher");
  check(m.looseRR < 2, `Précision : R/R de l'entrée imprécise ${m.looseRR.toFixed(2)} (le texte : < 1:2)`);
  check(m.sharpRR > 3, `Précision : R/R de l'entrée de précision ${m.sharpRR.toFixed(2)} (le texte : > 1:3)`);
  const mg = pips(m.sharp.sl, m.pin.l, PIP);
  check(mg >= 2 && mg <= 5, `Précision : marge du SL ${mg} pips (le texte : 2 à 5)`);
  // les 4 bougies M15 de chaque heure forment les 2 dernières bougies H1 du panneau H1
  check(m.h1All.length === m.H1.length + 2 && isContinuous(m.h1All), "Précision : H1 et M15 ne se raccordent pas");
}

// Trading Avancé 9 : seuils du tableau de la leçon
{
  const t = backtestTrades();
  const s = backtestStats(t);
  check(t.length === BACKTEST_COUNTS.reduce((a, [, n]) => a + n, 0) && t.length >= 50, "Backtest : nombre de trades");
  check(s.winrate > 40 && s.avgR > 0.5 && s.profitFactor > 1.5 && s.maxDD < 15, `Backtest : seuils non tenus (winrate ${s.winrate}, R moyen ${s.avgR}, PF ${s.profitFactor}, DD ${s.maxDD})`);
  check(near(s.equity[s.equity.length - 1] - 100, t.reduce((a, b) => a + b, 0), 1e-9), "Backtest : capital final ≠ somme des R");
}

// Reversal 4, cas 1 : coupe à 1.1810 = 15 pips au lieu de 40
{
  const c = SL_CASE;
  check(pips(c.closes[c.cutIndex], c.entry, PIP) === 15 && pips(c.sl, c.entry, PIP) === 40, "SL (Reversal 4) : pertes ≠ 15 / 40 pips");
  check(Math.min(...c.closes.slice(c.entryIndex, c.cutIndex)) === 1.1780, "SL (Reversal 4) : le creux n'est pas 1.1780");
  check(c.closes[c.cutIndex] > c.neck && c.closes.slice(c.entryIndex, c.cutIndex).every((x) => x < c.neck), "SL (Reversal 4) : la clôture d'invalidation n'est pas la 1re au-dessus de la ligne de cou");
}

// Reversal 2 : méthode standard ; ligne de cou horizontale = exemple de la leçon (82$, TP 4 496$)
for (const c of HS_CASES) {
  const m = headShouldersModel(c.line);
  check(m.head.price === 4660 && m.ls.price < m.head.price && m.rs.price < m.head.price, `ETE ${c.key} : tête / épaules`);
  check(c.key !== "plate" || (near(m.height, 82, 1e-9) && near(m.tp, 4496, 1e-9)), `ETE ${c.key} : hauteur ${m.height}, TP ${m.tp} (le texte : 82$, 4 496$)`);
  check(c.key !== "ascendante" || m.t2.price > m.t1.price, "ETE ascendante : ligne de cou non ascendante");
  check(c.key !== "descendante" || m.t2.price < m.t1.price, "ETE descendante : ligne de cou non descendante");
  check(near(m.bo.price - m.tp, m.height, 1e-9), `ETE ${c.key} : projection ≠ hauteur`);
}

// Macro Débutant 3 : surprise ±50 à ±100 pips, sens du mouvement
{
  const mv = (k: string) => { const cs = (CANDLES as Record<string, Candle[]>)[k]; return (cs[6].c - cs[6].o) / PIP; };
  check(mv("nfp-positif") <= -50 && mv("nfp-positif") >= -100, `NFP > consensus : ${mv("nfp-positif").toFixed(1)} pips (le texte : −50 à −100)`);
  check(mv("nfp-negatif") >= 50 && mv("nfp-negatif") <= 100, `NFP < consensus : ${mv("nfp-negatif").toFixed(1)} pips (le texte : +50 à +100)`);
  check(Math.abs(mv("nfp-egal")) < 15, `NFP = consensus : ${mv("nfp-egal").toFixed(1)} pips`);
  // avant la publication : marché calme (aucune bougie de plus de 5 pips)
  for (const k of ["nfp-egal", "nfp-positif", "nfp-negatif"]) check((CANDLES as Record<string, Candle[]>)[k].slice(0, 6).every((x) => x.h - x.l <= 5 * PIP), `${k} : avant la publication, bougie de plus de 5 pips`);
}

checkLots(check);
checkLot9(check);
checkLot14(check);
checkLot15(check);
checkLot16(check);
checkLot17(check);

lines.push(`Scénarios contrôlés : ${Object.keys(CANDLES).length} séries de bougies, ${HS_CASES.length + 6} schémas`);
console.log(lines.join("\n"));
console.log(`RESULTAT erreurs=${errors} avertissements=0`);
