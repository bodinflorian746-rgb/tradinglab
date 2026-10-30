// Audit des supports et résistances des jeux (règle PO) : toute zone dont l'étiquette dit
// « support » ou « résistance » doit être prouvée par le graphique que voit le joueur
// AVANT de répondre (bougies passées) : au moins deux touches au niveau, ou une cassure
// suivie d'un retest avec réaction (scripts/audit-lecons/sr-proof.mjs, même règle que
// les leçons). Une zone que le prix a seulement traversée n'est jamais un support.
// Niveaux lisibles (règle PO, 2026-10-30) : chaque touche est nette, contact de 4 bougies au plus
// puis départ franc d'au moins 0,8 bougie médiane (lib/games/level-proof.ts), jamais une mèche
// perdue dans des bougies désordonnées.
// Usage : npx vite-node scripts/audit-jeux/sr.ts [--detail] [--autotest] (lancé par run.mjs)
//
// 500 rounds par scénario et par difficulté (langues actives), aperçus du hub et
// héros de la home. Aucun cas toléré.
import { auditCtx } from "./market-ctx";
import * as BS from "../../lib/games/buy-sell-no-trade";
import * as BSES from "../../lib/games/buy-sell-no-trade-es";
import * as FTM from "../../lib/games/find-the-mistake";
import * as FTMES from "../../lib/games/find-the-mistake-es";
import * as PS from "../../lib/games/place-stop";
import * as PSES from "../../lib/games/place-stop-es";
import * as BT from "../../lib/games/build-the-trade";
import * as BTES from "../../lib/games/build-the-trade-es";
import { buildGamePreviews } from "../../lib/games/previews";
import { buildHeroRounds } from "../../app/[locale]/_home/hero-rounds";
import type { Candle, ChartZone } from "../../lib/games/shared";
import { cleanProofError } from "../../lib/games/level-proof";
import { auditee } from "./langues";

const ROUNDS = 500;
const VOLS = ["faible", "normale", "élevée"] as const;
const DETAIL = process.argv.includes("--detail");
const SR = /\b(support|r[ée]sistance|soporte|resistencia)/i;

const counts = new Map<string, { rounds: number; bad: number; first?: string }>();
let errors = 0;

if (process.argv.includes("--autotest")) {
  // Support 0 – 0,2, bougies d'amplitude 1 : touches construites à la main
  const k = (o: number, c: number, h = Math.max(o, c) + 0.2, l = Math.min(o, c) - 0.2): Candle => ({ o, c, h, l });
  const fall = [k(5, 4), k(4, 3), k(3, 2)];
  const vTouch = [k(2, 1.1, 2.1, 0.05), k(1.1, 1.6, 1.7, 0.1), k(1.6, 2.6), k(2.6, 3.4)];
  const clean = [...fall, ...vTouch, k(3.4, 2.6), k(2.6, 1.8), k(1.8, 1.0, 1.9, 0.08), k(1.0, 1.7, 1.8, 0.1), k(1.7, 2.7), k(2.7, 3.5)];
  // la première touche : six bougies serrées sur le niveau, mèches dans la zone
  const chop = [k(2, 0.9, 2.1, 0.1), k(0.9, 0.6, 1.0, 0.05), k(0.6, 0.8, 0.95, 0.1), k(0.8, 0.5, 0.9, 0.12), k(0.5, 0.7, 0.85, 0.06), k(0.7, 0.9, 1.0, 0.15), k(0.9, 2.0), k(2.0, 2.9)];
  const messy = [...fall, ...chop, k(2.9, 2.2), k(2.2, 1.0, 2.3, 0.08), k(1.0, 1.7, 1.8, 0.1), k(1.7, 2.7), k(2.7, 3.5)];
  // la première touche repart à peine (moins de 0,8 bougie dans les 4 suivantes) avant de revenir
  const weak = [...fall, k(2, 1.1, 2.1, 0.05), k(1.1, 1.0, 1.15, 0.5), k(1.0, 1.05, 1.2, 0.56), k(1.05, 0.95, 1.2, 0.5), k(0.95, 1.0, 1.15, 0.48), k(1.0, 0.9, 1.1, 0.08), k(0.9, 1.7, 1.8, 0.1), k(1.7, 2.7), k(2.7, 3.5)];
  const e1 = cleanProofError(messy, 0, 0.2), e2 = cleanProofError(weak, 0, 0.2), ok = cleanProofError(clean, 0, 0.2);
  console.log(`${e1 ? "détecté" : "MANQUÉ "}  touche perdue dans six bougies serrées sur le niveau`);
  console.log(`${e2 ? "détecté" : "MANQUÉ "}  touche sans départ franc`);
  console.log(`${ok ? "FAUX POSITIF" : "aucun faux positif"}  deux touches en V${ok ? ` (${ok})` : ""}`);
  console.log(`RESULTAT erreurs=${(e1 ? 0 : 1) + (e2 ? 0 : 1) + (ok ? 1 : 0)} avertissements=0`);
  process.exit(0);
}

function record(key: string, past: Candle[], zones: ChartZone[] | undefined, where: string) {
  const c = counts.get(key) ?? { rounds: 0, bad: 0 };
  c.rounds++;
  let why: string | null = null;
  for (const z of zones ?? []) {
    if (!z.label || !SR.test(z.label)) continue;
    const err = cleanProofError(past, Math.min(z.y1, z.y2), Math.max(z.y1, z.y2));
    if (err) { why = `« ${z.label} » : ${err}`; break; }
  }
  if (why) { c.bad++; errors++; if (!c.first) c.first = `${where} ${why}`; }
  counts.set(key, c);
}

const seedOf = (id: string, n: number) => {
  let h = 2166136261;
  for (const ch of `${id}#${n}`) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
};

const GAMES = [["fr", BS, FTM, PS, BT], ["es", BSES, FTMES, PSES, BTES]] as const;
for (const [lang, B, F, P, T] of GAMES.filter(([l]) => auditee(l))) {
  for (const t of B.SCENARIO_TEMPLATES) for (const d of t.difficulties) for (let n = 0; n < ROUNDS; n++) {
    const seed = seedOf(t.id + d, n); const ctx = auditCtx(seed); const vol = VOLS[n % 3];
    const ch = B.withAssetPrices(B.buildChart(t.id, seed, vol, d, ctx), { ...ctx, seed });
    record(`Buy/Sell/No Trade|${t.id}|${d}|${lang}`, ch.past, ch.zones, `seed ${seed} ${vol}`);
  }
  for (const t of F.MISTAKE_TEMPLATES) for (let n = 0; n < ROUNDS; n++) {
    const seed = seedOf(t.id, n); const ctx = auditCtx(seed); const vol = VOLS[n % 3];
    const ch = F.withAssetPrices(F.buildScenarioChart(t, seed, vol, ctx), { id: t.id, ...ctx, seed });
    record(`Trouve l'erreur|${t.id}|toutes|${lang}`, ch.past, ch.zones, `seed ${seed} ${vol}`);
  }
  for (const t of P.PLACE_STOP_TEMPLATES) for (const d of t.difficulties) for (let n = 0; n < ROUNDS; n++) {
    const seed = seedOf(t.id + d, n); const ctx = auditCtx(seed); const vol = VOLS[n % 3];
    const ch = P.withAssetPrices(P.buildPlaceStopChart(t.id, seed, vol, d, ctx), { id: t.id, ...ctx, seed });
    record(`Place ton Stop|${t.id}|${d}|${lang}`, ch.past, ch.zones, `seed ${seed} ${vol}`);
  }
  for (const t of T.BUILD_TRADE_TEMPLATES) for (let n = 0; n < ROUNDS; n++) {
    const seed = seedOf(t.id, n); const ctx = auditCtx(seed); const vol = VOLS[n % 3];
    const ch = T.withAssetPrices(T.buildBuildTradeChart(t, seed, vol, ctx), { ...ctx, seed });
    record(`Build the Trade|${t.id}|toutes|${lang}`, ch.past, ch.zones, `seed ${seed} ${vol}`);
  }
}

// Aperçus du hub (une seule série) et héros de la home (passé, avant le clic)
for (const lang of (["fr", "es"] as const).filter(auditee)) {
  for (const [id, p] of Object.entries(buildGamePreviews(lang))) record(`Aperçus du hub|${id}|—|${lang}`, p.data.candles, p.data.zones, "aperçu");
  for (const r of buildHeroRounds(lang)) record(`Héros de la home|${r.key}|—|${lang}`, r.past, r.zones, "héros");
}

const lines: string[] = [];
const byGame = new Map<string, { rounds: number; bad: number }>();
for (const [k, c] of counts) {
  const g = k.split("|")[0];
  const s = byGame.get(g) ?? { rounds: 0, bad: 0 };
  s.rounds += c.rounds; s.bad += c.bad; byGame.set(g, s);
  if (c.bad && (DETAIL || lines.length < 60)) lines.push(`  ERREUR ${k.replace(/\|/g, " · ")} : ${c.bad}/${c.rounds} rounds (${c.first})`);
}
for (const [g, s] of byGame) lines.push(`${g} : ${s.bad} round(s) sans preuve du support / de la résistance sur ${s.rounds}`);
console.log(lines.join("\n"));
console.log(`RESULTAT erreurs=${errors} avertissements=0`);
