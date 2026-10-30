// Réaction ou confirmation avant une entrée (règle PO, enseignée dans les leçons) : on n'entre pas
// sur un niveau sans un signal visible sur le graphique au moment d'entrer. Sans signal, on attend.
// Signal (à l'achat ; symétrique à la vente), porté par l'une des trois dernières bougies du passé :
//  - rejet : mèche du côté du niveau au moins égale au corps et à 35 % de l'amplitude, clôture dans
//    la moitié opposée (marteau, pin bar ; la couleur ne fait pas le signal) ;
//  - engulfing : bougie verte dont le corps avale celui de la rouge précédente ;
//  - cassure d'un sommet local : clôture au-dessus du plus haut des trois bougies précédentes ;
//  - retour dans le range : clôture au-dessus d'un niveau après une mèche sous lui (sweep, faux breakout) ;
//  - breakout confirmé : clôture franche (corps au moins égal au corps médian) au-delà d'une résistance.
// Les bougies suivantes ne contredisent jamais le signal (aucune clôture sous le plus bas du signal à l'achat).
import type { Candle, ChartZone } from "./shared";

export type SignalKind = "rejet" | "engulfing" | "sommet local dépassé" | "retour dans le range" | "breakout confirmé";

const body = (k: Candle) => Math.abs(k.c - k.o);
const med = (a: number[]) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[s.length >> 1] : 0; };

/**
 * Réaction ajoutée avant l'entrée quand le scénario n'en montre pas (règle PO) : une bougie de rejet
 * (marteau à l'achat, étoile filante à la vente) partie de la dernière clôture. Sa mèche va vers le
 * niveau sans dépasser `floor` (stops, plus bas de la structure, bas de la zone touchée) ; son corps
 * fait 40 % de la mèche. La suite reste la même (sa première bougie repart de la nouvelle clôture) :
 * stops et objectifs gardent leur issue. Sans place pour une mèche lisible (moins de 0,08 m), la
 * réaction est une clôture au-dessus du plus haut des trois bougies précédentes (sommet local dépassé).
 */
export function addReaction(past: Candle[], future: Candle[], dir: 1 | -1, m: number, floor: number): { past: Candle[]; future: Candle[]; entry: number } {
  const p = past[past.length - 1].c;
  const room = dir * (p - floor);
  let k: Candle;
  if (room >= 0.08 * m) {
    const wick = Math.min(0.45 * m, 0.9 * room), b = 0.4 * wick, top = 0.05 * wick;
    k = { o: p, c: p + dir * b, h: dir === 1 ? p + b + top : p + wick, l: dir === 1 ? p - wick : p - b - top };
  } else {
    const prior = past.slice(-3);
    const c = dir === 1 ? Math.max(...prior.map((x) => x.h)) + 0.08 * m : Math.min(...prior.map((x) => x.l)) - 0.08 * m;
    k = { o: p, c, h: dir === 1 ? c + 0.04 * m : p + 0.03 * m, l: dir === 1 ? p - 0.03 * m : c - 0.04 * m };
  }
  const f0 = future[0];
  const next = f0 ? [{ ...f0, o: k.c, h: Math.max(f0.h, k.c), l: Math.min(f0.l, k.c) }, ...future.slice(1)] : future;
  return { past: [...past, k], future: next, entry: k.c };
}

/** Limite de la mèche de réaction : au plus 0,3 m sous le plus bas des 8 dernières bougies (un marteau peut
 *  marquer le creux du repli), jamais sous un stop (aucun stop touché avant l'entrée) ni sous le bas de la
 *  zone que le prix touche ; marge de 0,03 m. */
export function reactionFloor(past: Candle[], zones: ChartZone[], dir: 1 | -1, m: number, stops: number[] = []): number {
  const p = past[past.length - 1].c, recent = past.slice(-8);
  const bounds = dir === 1
    ? [Math.min(...recent.map((k) => k.l)) - 0.3 * m, ...stops.filter((s) => s < p), ...zones.map((z) => Math.min(z.y1, z.y2)).filter((lo) => lo < p && lo > p - 1.2 * m)]
    : [Math.max(...recent.map((k) => k.h)) + 0.3 * m, ...stops.filter((s) => s > p), ...zones.map((z) => Math.max(z.y1, z.y2)).filter((hi) => hi > p && hi < p + 1.2 * m)];
  return dir === 1 ? Math.max(...bounds) + 0.03 * m : Math.min(...bounds) - 0.03 * m;
}

/** Signal de réaction ou de confirmation visible à l'entrée (dernière clôture du passé), ou null.
 *  Le signal est porté par l'une des trois dernières bougies ; les bougies suivantes le tiennent
 *  (aucune clôture sous son plus bas à l'achat, dernière clôture au-dessus du bas de son corps). */
export function entrySignal(past: Candle[], dir: 1 | -1, zones: ChartZone[] = []): SignalKind | null {
  const n = past.length;
  if (n < 5) return null;
  // à la vente, on lit le graphique renversé : mêmes règles qu'à l'achat
  const cs = dir === 1 ? past : past.map((k) => ({ o: -k.o, h: -k.l, l: -k.h, c: -k.c }));
  const zs = zones.map((z) => (dir === 1 ? [Math.min(z.y1, z.y2), Math.max(z.y1, z.y2)] : [-Math.max(z.y1, z.y2), -Math.min(z.y1, z.y2)]) as [number, number]);
  const mb = med(cs.slice(0, -1).map(body)) || 1e-9;
  for (let j = n - 1; j >= Math.max(4, n - 3); j--) {
    const s = signalAt(cs, j, zs, mb);
    if (!s) continue;
    const k = cs[j];
    if (cs.slice(j + 1).every((x) => x.c > k.l) && cs[n - 1].c >= Math.min(k.o, k.c)) return s;
  }
  return null;
}

const rejection = (k: Candle) => {
  const r = k.h - k.l, low = Math.min(k.o, k.c) - k.l;
  return r > 0 && low >= Math.max(body(k), 0.35 * r) && Math.min(k.o, k.c) >= k.l + 0.5 * r;
};

/** Signal porté par la bougie j (graphique lu à l'achat) */
function signalAt(cs: Candle[], j: number, zs: [number, number][], mb: number): SignalKind | null {
  const k = cs[j], prev = cs[j - 1];
  if (rejection(k)) return "rejet";
  if (k.c > k.o && prev.c < prev.o && k.c >= prev.o && k.o <= prev.c && body(k) >= body(prev)) return "engulfing";
  const priorHigh = Math.max(...cs.slice(Math.max(0, j - 3), j).map((x) => x.h));
  if (k.c > k.o && k.c > priorHigh) return "sommet local dépassé";
  for (const [lo, hi] of zs) {
    if (Math.min(k.l, prev.l) < lo && k.c > hi && k.c > k.o) return "retour dans le range";
    if (k.c > k.o && k.c > hi && k.o <= hi + mb && body(k) >= mb && prev.c <= hi) return "breakout confirmé";
  }
  return null;
}
