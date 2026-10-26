// Échelle de Place ton Stop (règle PO : les stops lointains n'écrasent jamais les bougies, qui
// occupent au moins la moitié de la hauteur du graphique, à la question comme au verdict) : les
// bougies couvrent au moins 60 % de l'échelle des prix (bougies, zones, entrée et trois stops) ; à
// l'écran, marges du cadre comprises, c'est au moins la moitié de la hauteur. Question : bougies du
// passé ; verdict : passé et suite. Exemples refusés : asia_high_sweep, round_number_sweep,
// prev_day_low_trap et les « news imminente », où le stop le plus lointain fixait seul l'échelle et
// les bougies tenaient dans le quart haut du graphique (390, 2026-10-25).
// Scénarios jouables (tous niveaux), 40 graines chacun. La règle DOM (dom.mjs) mesure la même chose
// à l'écran.
// Usage : npx vite-node scripts/audit-jeux/echelle-ps.ts [--autotest] (lancé par run.mjs)
import * as PS from "../../lib/games/place-stop";
import type { Candle } from "../../lib/games/shared";

export const MIN_SHARE = 0.6;
const VOLS = ["faible", "normale", "élevée"] as const;
const SEEDS = 40;

let errors = 0;
const lines: string[] = [];
if (process.argv.includes("--autotest")) {
  // Défauts injectés : consolidation plate (question) ; suite plate qui laisse le stop lointain seul
  // (verdict) ; témoin : jambe visible jusqu'au stop
  const flat: Candle[] = Array.from({ length: 10 }, (_, i) => ({ o: 5, c: 5 + (i % 2 ? 0.1 : -0.1), h: 5.2, l: 4.8 }));
  const leg: Candle[] = Array.from({ length: 10 }, (_, i) => ({ o: 3 + i * 0.25, c: 3.25 + i * 0.25, h: 3.35 + i * 0.25, l: 2.9 + i * 0.25 }));
  const stops = [4.5, 3.5, 2.2];
  const cases: [string, Candle[], boolean][] = [
    ["question : consolidation plate, stop lointain qui fixe l'échelle", flat, true],
    ["verdict : suite plate, le stop lointain reste seul en bas", [...flat, ...flat], true],
    ["témoin : jambe visible jusqu'au stop", leg, false],
  ];
  for (const [name, cs, bad] of cases) {
    const got = PS.candleShare(cs, [5, ...stops]) < MIN_SHARE;
    const ok = got === bad;
    lines.push(`${ok ? (bad ? "détecté" : "aucun faux positif") : bad ? "MANQUÉ " : "FAUX POSITIF"}  ${name}`);
    if (!ok) errors++;
  }
} else {
  for (const d of ["beginner", "intermediate", "advanced"] as const) for (const t of PS.scenarioPool(d)) {
    let worst = 1, at = 0, where = "";
    for (let n = 0; n < SEEDS; n++) {
      const seed = 1000 + n * 7919;
      const c = PS.buildPlaceStopChart(t.id, seed, VOLS[n % 3], d);
      const levels = [c.entry, ...c.stops.map((x) => x.price), ...c.zones.flatMap((z) => [z.y1, z.y2])];
      for (const [w, cs] of [["question", c.past], ["verdict", [...c.past, ...c.future]]] as [string, Candle[]][]) {
        const s = PS.candleShare(cs, levels);
        if (s < worst) { worst = s; at = seed; where = w; }
      }
    }
    if (worst < MIN_SHARE) { errors++; lines.push(`  ERREUR Place ton Stop · ${t.id} · ${d} : au ${where}, bougies sur ${Math.round(worst * 100)} % de l'échelle (min ${MIN_SHARE * 100} %, graine ${at})`); }
  }
  lines.push(`scénarios jouables contrôlés (question et verdict), ${SEEDS} graines chacun`);
}
console.log(lines.join("\n"));
console.log(`RESULTAT erreurs=${errors} avertissements=0`);
