// Audit réalisme des bougies (passé visible), 4 jeux.
// Usage : npx vite-node scripts/audit-jeux/realism.ts (lancé par run.mjs)
//
// Erreurs : bougie à clôture = ouverture, OHLC invalide, continuité rompue ;
// part de rounds hors d'au moins un seuil > MAX_GAME_SHARE sur un jeu.
// Avertissements : scénario × difficulté avec plus de 10 % de rounds hors
// seuil (cible K2 non atteinte partout à cause des protections de cohérence).
import * as BS from "../../lib/games/buy-sell-no-trade";
import * as FTM from "../../lib/games/find-the-mistake";
import * as PS from "../../lib/games/place-stop";
import * as BT from "../../lib/games/build-the-trade";

type C = { o: number; h: number; l: number; c: number };
type Z = { y1: number; y2: number };
const VOLS = ["faible", "normale", "élevée"] as const;
const N = 200;
const MAX_GAME_SHARE = 0.25;
const TH = { brLo: 0.35, brHi: 0.75, dbl: 0.25, small: 0.15, cv: 0.3, mm: 2.5, clv: 0.6 };
const med = (a: number[]) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : NaN; };

// Métriques de forme sur les bougies ordinaires (hors bougies structurelles :
// les 2 déclencheuses et celles dont une mèche atteint une zone du scénario)
function outOfThreshold(cs: C[], zones: Z[]): string[] {
  const all = cs.filter((k) => k.h - k.l > 1e-12);
  const lv = zones.flatMap((z) => [z.y1, z.y2]);
  const structural = (k: C, i: number) => i >= cs.length - 2 || lv.some((K) => (K > Math.max(k.o, k.c) && K <= k.h) || (K < Math.min(k.o, k.c) && K >= k.l));
  const ord = cs.filter((k, i) => k.h - k.l > 1e-12 && !structural(k, i));
  const k2 = ord.length >= 0.6 * all.length ? ord : all;
  const r = all.map((k) => k.h - k.l);
  const br = k2.map((k) => Math.abs(k.c - k.o) / (k.h - k.l));
  const dbl = k2.filter((k) => (k.h - Math.max(k.o, k.c)) / (k.h - k.l) >= 0.3 && (Math.min(k.o, k.c) - k.l) / (k.h - k.l) >= 0.3).length / k2.length;
  const small = br.filter((x) => x < 0.1).length / br.length;
  const mean = r.reduce((a, b) => a + b, 0) / r.length;
  const cv = Math.sqrt(r.reduce((a, b) => a + (b - mean) ** 2, 0) / r.length) / mean;
  const mm = Math.max(...r) / Math.min(...r);
  const up = cs[cs.length - 1].c > cs[0].o;
  const withT = all.filter((k) => (up ? k.c > k.o : k.c < k.o));
  const clv = withT.length ? med(withT.map((k) => (up ? k.c - k.l : k.h - k.c) / (k.h - k.l))) : 1;
  const out: string[] = [];
  if (med(br) < TH.brLo || med(br) > TH.brHi) out.push("corps/amplitude");
  if (dbl > TH.dbl) out.push("2 longues mèches");
  if (small > TH.small) out.push("petits corps");
  if (cv < TH.cv) out.push("variation amplitude");
  if (mm < TH.mm) out.push("max/min");
  if (clv < TH.clv) out.push("clôture en tendance");
  return out;
}

function hardErrors(cs: C[]): string | null {
  for (let i = 0; i < cs.length; i++) {
    const k = cs[i];
    if (k.c === k.o) return "clôture = ouverture";
    if (k.h < Math.max(k.o, k.c) - 1e-9 || k.l > Math.min(k.o, k.c) + 1e-9) return "OHLC invalide";
    if (i > 0 && Math.abs(k.o - cs[i - 1].c) > 1e-9) return "continuité rompue";
  }
  return null;
}

let errors = 0, warnings = 0;
const lines: string[] = [];
function game(name: string, cells: { id: string; d: string; gen: (seed: number, vol: (typeof VOLS)[number]) => { past: C[]; future: C[]; zones?: Z[] } }[]) {
  let rounds = 0, out = 0;
  for (const { id, d, gen } of cells) {
    let cellOut = 0;
    for (let n = 0; n < N; n++) {
      const ch = gen((n * 2654435761 + id.length * 97 + d.length) >>> 0, VOLS[n % 3]);
      const hard = hardErrors([...ch.past, ...ch.future]);
      if (hard) { errors++; if (errors <= 10) lines.push(`  ERREUR ${name} ${id} ${d} : ${hard}`); }
      if (outOfThreshold(ch.past, ch.zones ?? []).length) cellOut++;
    }
    rounds += N; out += cellOut;
    if (cellOut > 0.1 * N) warnings++;
  }
  const share = out / rounds;
  lines.push(`${name.padEnd(16)} rounds hors seuil : ${(100 * share).toFixed(1)} % (max ${100 * MAX_GAME_SHARE} %)`);
  if (share > MAX_GAME_SHARE) { errors++; lines.push(`  ERREUR ${name} : part de rounds hors seuil trop élevée`); }
}

game("Buy/Sell/No Trade", BS.SCENARIO_TEMPLATES.flatMap((t) => t.difficulties.map((d) => ({ id: t.id, d, gen: (s: number, v: (typeof VOLS)[number]) => BS.buildChart(t.id, s, t.metaOverride?.volatility ?? (t.macroContext === "dangereux" ? "élevée" : v), d) }))));
game("Trouve l'erreur", FTM.MISTAKE_TEMPLATES.flatMap((t) => t.difficulties.map((d) => ({ id: t.id, d, gen: (s: number, v: (typeof VOLS)[number]) => FTM.buildScenarioChart(t, s, t.metaOverride?.volatility ?? (t.macroContext === "dangereux" ? "élevée" : v)) }))));
game("Place ton Stop", PS.PLACE_STOP_TEMPLATES.flatMap((t) => t.difficulties.map((d) => ({ id: t.id, d, gen: (s: number, v: (typeof VOLS)[number]) => PS.buildPlaceStopChart(t.id, s, t.id === "high_vol_pullback" ? "élevée" : v, d) }))));
game("Build the Trade", BT.BUILD_TRADE_TEMPLATES.flatMap((t) => t.difficulties.map((d) => ({ id: t.id, d, gen: (s: number, v: (typeof VOLS)[number]) => BT.buildBuildTradeChart(t, s, t.chartShape === "high_vol_pullback" ? "élevée" : v) }))));

console.log(lines.join("\n"));
console.log(`(avertissements : scénario × difficulté > 10 % de rounds hors seuil)`);
console.log(`RESULTAT erreurs=${errors} avertissements=${warnings}`);
