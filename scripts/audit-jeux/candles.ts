// Audit des bougies : chaque bougie ouvre exactement à la clôture de la précédente.
// Usage : npx vite-node scripts/audit-jeux/candles.ts [--detail] (lancé par run.mjs)
//
// Chemin du jeu : génération du round (actif, session, volatilité), remise à
// l'échelle de l'actif (withAssetPrices), bougies passées ET futures (révélées
// au clic). 500 rounds par scénario et par difficulté, FR et ES ; aperçus du hub
// et de la home (lib/games/previews.ts). Contrôles :
//  - continuité : ouverture = clôture précédente (écart nul à l'arrondi
//    d'affichage de l'actif près) ;
//  - arrondi : une rouge clôture sous la clôture précédente, une verte
//    au-dessus, y compris après arrondi au pas de cotation ;
//  - rendu : avec la géométrie des composants (candle-geometry.ts), chaque bord
//    de corps est à 1 px au plus de son prix, aux hauteurs réelles du graphique
//    (390 × 844 : 327 px ; 1440 × 900 : 440 px ; aperçus : 164 px) ;
//  - OHLC valide (mèches englobant le corps).
// Aucun cas toléré. Exception : un scénario qui annonce un gap dans son texte
// (champ gap du modèle) — aucun aujourd'hui.
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
import { assetDecimals } from "../../lib/games/price-scale";
import type { Asset, Candle, ChartZone } from "../../lib/games/shared";
import { candleBody } from "../../app/components/games/candle-geometry";

const ROUNDS = 500;
const VOLS = ["faible", "normale", "élevée"] as const;
const DETAIL = process.argv.includes("--detail");

const counts = new Map<string, { rounds: number; bad: number; first?: string }>();
let errors = 0;

// Bords dessinés (ouverture, clôture) vs prix, échelle calée sur bougies et zones
function renderCheck(cs: Candle[], zones: ChartZone[], heights: number[]): string | null {
  const ps = cs.flatMap((k) => [k.h, k.l]).concat(zones.flatMap((z) => [z.y1, z.y2]));
  const min = Math.min(...ps), max = Math.max(...ps), range = max - min || 1;
  for (const H of heights) {
    const toY = (p: number) => 14 + ((max - p) / range) * (H - 28);
    for (let i = 0; i < cs.length; i++) {
      const k = cs[i];
      const b = candleBody(k.o, k.c, toY);
      const up = k.c >= k.o;
      const open = up ? b.y + b.h : b.y, close = up ? b.y : b.y + b.h;
      if (Math.abs(open - toY(k.o)) > 1 + 1e-9 || Math.abs(close - toY(k.c)) > 1 + 1e-9) return `rendu ${H} px, bougie ${i} : bord du corps à plus de 1 px de son prix`;
    }
  }
  return null;
}
function check(cs: Candle[], asset: Asset | undefined): string | null {
  const dec = asset ? assetDecimals(asset) : 6;
  const r = (p: number) => Number(p.toFixed(dec));
  for (let i = 0; i < cs.length; i++) {
    const k = cs[i];
    if (k.h < Math.max(k.o, k.c) - 1e-9 || k.l > Math.min(k.o, k.c) + 1e-9) return `bougie ${i} : OHLC invalide`;
    if (i === 0) continue;
    const p = cs[i - 1];
    const tol = 1e-9 * Math.max(1, Math.abs(p.c));
    if (Math.abs(k.o - p.c) > tol) return `bougie ${i} : ouverture ${k.o} ≠ clôture précédente ${p.c}`;
    // Rendu arrondi au pas de cotation : la couleur doit rester cohérente
    if (r(k.c) < r(k.o) && r(k.c) > r(p.c)) return `bougie ${i} : rouge clôturant au-dessus de la précédente (arrondi)`;
    if (r(k.c) > r(k.o) && r(k.c) < r(p.c)) return `bougie ${i} : verte clôturant sous la précédente (arrondi)`;
  }
  return null;
}
function record(key: string, cs: Candle[], asset: Asset | undefined, where: string, zones: ChartZone[] = [], heights = [327, 440]) {
  const c = counts.get(key) ?? { rounds: 0, bad: 0 };
  c.rounds++;
  const why = check(cs, asset) ?? renderCheck(cs, zones, heights);
  if (why) { c.bad++; errors++; if (!c.first) c.first = `${where} : ${why}`; }
  counts.set(key, c);
}

const seedOf = (id: string, n: number) => {
  let h = 2166136261;
  for (const ch of `${id}#${n}`) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
};

for (const [lang, B, F, P, T] of [["fr", BS, FTM, PS, BT], ["es", BSES, FTMES, PSES, BTES]] as const) {
  for (const t of B.SCENARIO_TEMPLATES) for (const d of t.difficulties) for (let n = 0; n < ROUNDS; n++) {
    const seed = seedOf(t.id + d, n); const ctx = auditCtx(seed); const vol = VOLS[n % 3];
    const ch = B.withAssetPrices(B.buildChart(t.id, seed, vol, d, ctx), { ...ctx, seed });
    record(`Buy/Sell/No Trade|${t.id}|${d}|${lang}`, [...ch.past, ...ch.future], ctx.asset, `seed ${seed} ${vol}`, ch.zones);
  }
  for (const t of F.MISTAKE_TEMPLATES) for (let n = 0; n < ROUNDS; n++) {
    const seed = seedOf(t.id, n); const ctx = auditCtx(seed); const vol = VOLS[n % 3];
    const ch = F.withAssetPrices(F.buildScenarioChart(t, seed, vol, ctx), { id: t.id, ...ctx, seed });
    record(`Trouve l'erreur|${t.id}|toutes|${lang}`, [...ch.past, ...ch.future], ctx.asset, `seed ${seed} ${vol}`, ch.zones);
  }
  for (const t of P.PLACE_STOP_TEMPLATES) for (const d of t.difficulties) for (let n = 0; n < ROUNDS; n++) {
    const seed = seedOf(t.id + d, n); const ctx = auditCtx(seed); const vol = VOLS[n % 3];
    const ch = P.withAssetPrices(P.buildPlaceStopChart(t.id, seed, vol, d, ctx), { id: t.id, ...ctx, seed });
    record(`Place ton Stop|${t.id}|${d}|${lang}`, [...ch.past, ...ch.future], ctx.asset, `seed ${seed} ${vol}`, ch.zones);
  }
  for (const t of T.BUILD_TRADE_TEMPLATES) for (let n = 0; n < ROUNDS; n++) {
    const seed = seedOf(t.id, n); const ctx = auditCtx(seed); const vol = VOLS[n % 3];
    const ch = T.withAssetPrices(T.buildBuildTradeChart(t, seed, vol, ctx), { ...ctx, seed });
    record(`Build the Trade|${t.id}|toutes|${lang}`, [...ch.past, ...ch.future], ctx.asset, `seed ${seed} ${vol}`, ch.zones);
  }
}

// Aperçus du hub et jeu du héros de la home (passé puis futur révélé)
for (const lang of ["fr", "es"] as const) {
  for (const [id, p] of Object.entries(buildGamePreviews(lang))) record(`Aperçus du hub|${id}|—|${lang}`, p.data.candles, "EUR/USD", "aperçu", p.data.zones, [164, 180]);
  for (const r of buildHeroRounds(lang)) record(`Héros de la home|${r.key}|—|${lang}`, [...r.past, ...r.future], "EUR/USD", "héros", r.zones, [164, 327, 440]);
}

const lines: string[] = [];
const byGame = new Map<string, { rounds: number; bad: number }>();
for (const [k, c] of counts) {
  const g = k.split("|")[0];
  const s = byGame.get(g) ?? { rounds: 0, bad: 0 };
  s.rounds += c.rounds; s.bad += c.bad; byGame.set(g, s);
  if (c.bad && (DETAIL || lines.length < 40)) lines.push(`  ERREUR ${k.replace(/\|/g, " · ")} : ${c.bad}/${c.rounds} rounds (${c.first})`);
}
for (const [g, s] of byGame) lines.push(`${g} : ${s.bad} round(s) incohérent(s) sur ${s.rounds}`);
console.log(lines.join("\n"));
console.log(`RESULTAT erreurs=${errors} avertissements=0`);
