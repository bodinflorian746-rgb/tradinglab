// Vérification K1 : contexte de marché, prix réels, affirmations chiffrées.
// Usage : npx vite-node scripts/audit-jeux/context.ts (lancé par run.mjs)
// Boucle générique sur les 4 modules de jeux (types d'instances et de graphiques
// différents) : typage volontairement lâche dans ce script d'audit.
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as BS from "../../lib/games/buy-sell-no-trade";
import * as FTM from "../../lib/games/find-the-mistake";
import * as PS from "../../lib/games/place-stop";
import * as BT from "../../lib/games/build-the-trade";
import { ASSET_SCALE } from "../../lib/games/price-scale";
import { SESSION_ASSETS, CALM_SESSIONS } from "../../lib/games/market-context";

type Inst = { id: string; asset: any; session: any; volatility: any; spread: any; context: string; seed: number; difficulty: any };
const NEWS = /NFP|FOMC|CPI|BCE|ECB|[Nn]ews|annonce|macro majeure/;
const hourSessions = (h: number) => h >= 1 && h < 8 ? ["Asie", "Heures mortes"] : h >= 8 && h < 14 ? ["Londres"] : h >= 14 && h < 17.5 ? ["Overlap", "New York"] : h >= 17.5 && h < 23 ? ["New York"] : ["Heures mortes", "Asie"];
const errors: Record<string, number> = {}; const ex: Record<string, string> = {}; let n = 0;
const err = (k: string, e: string) => { errors[k] = (errors[k] ?? 0) + 1; ex[k] ??= e; };

const games: [string, (s: number, d: any) => Inst[], (i: Inst, d: any) => { vals: number[]; chart: any }][] = [
  ["BSNT", (s, d) => BS.generateScenarios(s, d) as any, (i, d) => { const c = BS.withAssetPrices(BS.buildChart(i.id as any, i.seed, i.volatility, d), i); return { chart: c, vals: [...c.past, ...c.future].flatMap((k) => [k.h, k.l]) }; }],
  ["FTM", (s, d) => FTM.generateMistakeScenarios(s, d) as any, (i) => { const c = FTM.withAssetPrices(FTM.buildScenarioChart(i as any, i.seed, i.volatility), i); return { chart: c, vals: [...c.past, ...c.future].flatMap((k) => [k.h, k.l]).concat([c.entry, c.stop, c.tp].filter((x): x is number => x !== undefined)) }; }],
  ["PS", (s, d) => PS.generatePlaceStopScenarios(s, d) as any, (i, d) => { const c = PS.withAssetPrices(PS.buildPlaceStopChart(i.id as any, i.seed, i.volatility, d), i); return { chart: c, vals: [...c.past, ...c.future].flatMap((k) => [k.h, k.l]).concat(c.stops.map((x) => x.price), [c.entry]) }; }],
  ["BTT", (s, d) => BT.generateBuildTradeScenarios(s, d) as any, (i) => { const c = BT.withAssetPrices(BT.buildBuildTradeChart(i as any, i.seed, i.volatility), i); return { chart: c, vals: [...c.past, ...c.future].flatMap((k) => [k.h, k.l]).concat(Object.values(c.entries), Object.values(c.stops), Object.values(c.tps)) }; }],
];
for (const [g, gen, build] of games) for (const d of ["beginner", "intermediate", "advanced"]) for (let s = 1; s <= 200; s++) {
  let list: Inst[] = []; try { list = gen(s * 7919, d); } catch { continue; }
  for (const i of list) {
    n++;
    const tag = `${g} ${i.id} ${i.asset} ${i.session} vol ${i.volatility} spread ${i.spread}`;
    const news = NEWS.test(i.context);
    if (/NFP|CPI/.test(i.context) && !["New York", "Overlap"].includes(i.session)) err(`${g} news NFP/CPI hors NY/Overlap`, tag);
    if (/FOMC/.test(i.context) && !/après FOMC/.test(i.context) && i.session !== "New York") err(`${g} FOMC hors New York`, tag);
    if (/après FOMC/.test(i.context) && i.session !== "New York") err(`${g} après FOMC hors New York`, tag);
    if (!SESSION_ASSETS[i.session as keyof typeof SESSION_ASSETS].includes(i.asset)) err(`${g} actif non tradé dans la session`, tag);
    if (i.volatility === "élevée" && CALM_SESSIONS.has(i.session) && !news) err(`${g} vol. élevée en session calme sans news`, tag);
    if (i.spread === "faible" && i.session === "Heures mortes") err(`${g} spread faible en heures mortes`, tag);
    if (i.spread === "élevé" && i.session === "Overlap" && !news) err(`${g} spread élevé en Overlap sans news`, tag);
    const named = ["EUR/USD", "XAU/USD", "BTC/USD", "NASDAQ"].filter((a) => i.context.includes(a)).concat(/\bBTC\b/.test(i.context) && !i.context.includes("BTC/USD") ? ["BTC/USD"] : []);
    if (named.length && !named.includes(i.asset)) err(`${g} actif cité ≠ actif affiché`, tag);
    const hm = i.context.match(/(\d{1,2})h(\d{2})?/);
    if (hm) { const h = +hm[1] + (hm[2] ? +hm[2] / 60 : 0); if (!hourSessions(h).includes(i.session)) err(`${g} heure citée ≠ session`, tag + " " + hm[0]); }
    if (/[Ll]undi/.test(i.context) && i.session !== "Asie") err(`${g} ouverture du lundi hors Asie`, tag);
    if (/London open/.test(i.context) && i.session !== "Londres") err(`${g} avant London open hors Londres`, tag);
    if (/pips/.test(i.context) && i.asset !== "EUR/USD") err(`${g} « pips » hors EUR/USD`, tag);
    // Prix réels
    const { chart, vals } = build(i, d);
    const sc = ASSET_SCALE[i.asset as keyof typeof ASSET_SCALE];
    if (Math.min(...vals) < sc.lo * 0.9 || Math.max(...vals) > sc.hi * 1.1) err(`${g} prix hors plage de l'actif`, `${tag} ${Math.min(...vals).toFixed(4)}–${Math.max(...vals).toFixed(4)}`);
    const pm = i.context.match(/(\d+(?:[.,]\d+)?)\s?% en (\d+) bougies/);
    if (pm) { const k = +pm[2]; const p = chart.past; const pct = 100 * (p[p.length - 1].c - p[p.length - 1 - k].c) / p[p.length - 1 - k].c; if (Math.abs(pct - +pm[1].replace(",", ".")) > 0.5) err(`${g} pourcentage cité ≠ données`, `${tag} ${pct.toFixed(2)} %`); }
    if (g === "PS" && i.id === "round_number_sweep") { const z = chart.zones[0]; const mid = (z.y1 + z.y2) / 2; const r = sc.round; if (Math.abs(mid / r - Math.round(mid / r)) > 1e-6) err(`${g} chiffre rond pas rond`, `${tag} ${mid}`); }
    if (g === "PS" && /quelques pips/.test(i.context) && i.asset === "EUR/USD") {
      // distance entre les 2 lows cités ≤ 15 pips
      const lows = chart.zones.map((z: any) => Math.abs(z.y2 - z.y1) / 0.0001);
      if (lows.some((x: number) => x > 15)) err(`${g} « quelques pips » > 15 pips`, `${tag} ${lows.map((x: number) => x.toFixed(1)).join("/")}`);
    }
  }
}
console.log(`K1 — ${n} rounds`);
if (!Object.keys(errors).length) console.log("0 erreur");
for (const [k, v] of Object.entries(errors)) console.log(`${String(v).padStart(5)}  ${k}   ex: ${ex[k]}`);
