// Échelle de la question de Place ton Stop (règle PO : sur téléphone, un graphique se lit en entier) :
// les bougies de la question couvrent au moins 40 % de la hauteur de l'échelle (bougies, zones, entrée
// et trois stops). Exemple refusé : asia_high_sweep, round_number_sweep, prev_day_low_trap et les
// « news imminente », où le stop le plus lointain fixait seul l'échelle et les bougies tenaient dans le
// quart haut du graphique (390, 2026-10-25).
// Scénarios jouables (tous niveaux), 40 graines chacun.
// Usage : npx vite-node scripts/audit-jeux/echelle-ps.ts [--autotest] (lancé par run.mjs)
import * as PS from "../../lib/games/place-stop";
import type { Candle } from "../../lib/games/shared";

export const MIN_SHARE = 0.4;
const VOLS = ["faible", "normale", "élevée"] as const;
const SEEDS = 40;

/** Part de la hauteur de l'échelle couverte par les bougies de la question */
export function questionShare(past: Candle[], levels: number[]): number {
  const lo = Math.min(...past.map((k) => k.l)), hi = Math.max(...past.map((k) => k.h));
  const all = [lo, hi, ...levels];
  return (hi - lo) / (Math.max(...all) - Math.min(...all) || 1);
}

let errors = 0;
const lines: string[] = [];
if (process.argv.includes("--autotest")) {
  // Défaut injecté : consolidation plate, stops lointains ; témoin : jambe visible
  const flat: Candle[] = Array.from({ length: 10 }, (_, i) => ({ o: 5, c: 5 + (i % 2 ? 0.1 : -0.1), h: 5.2, l: 4.8 }));
  const leg: Candle[] = Array.from({ length: 10 }, (_, i) => ({ o: 3 + i * 0.25, c: 3.25 + i * 0.25, h: 3.35 + i * 0.25, l: 2.9 + i * 0.25 }));
  const bad = questionShare(flat, [5, 4.5, 3.5, 2.2]) < MIN_SHARE;
  const fine = questionShare(leg, [5.5, 4.5, 3.5, 2.2]) >= MIN_SHARE;
  lines.push(`${bad ? "détecté" : "MANQUÉ "}  consolidation plate, stop lointain qui fixe l'échelle`);
  lines.push(`${fine ? "aucun faux positif" : "FAUX POSITIF"}  témoin : jambe visible jusqu'au stop`);
  if (!bad) errors++;
  if (!fine) errors++;
} else {
  for (const d of ["beginner", "intermediate", "advanced"] as const) for (const t of PS.scenarioPool(d)) {
    let worst = 1, at = 0;
    for (let n = 0; n < SEEDS; n++) {
      const seed = 1000 + n * 7919;
      const c = PS.buildPlaceStopChart(t.id, seed, VOLS[n % 3], d);
      const s = questionShare(c.past, [c.entry, ...c.stops.map((x) => x.price), ...c.zones.flatMap((z) => [z.y1, z.y2])]);
      if (s < worst) { worst = s; at = seed; }
    }
    if (worst < MIN_SHARE) { errors++; lines.push(`  ERREUR Place ton Stop · ${t.id} · ${d} : bougies sur ${Math.round(worst * 100)} % de l'échelle (min ${MIN_SHARE * 100} %, graine ${at})`); }
  }
  lines.push("scénarios jouables contrôlés, 40 graines chacun");
}
console.log(lines.join("\n"));
console.log(`RESULTAT erreurs=${errors} avertissements=0`);
