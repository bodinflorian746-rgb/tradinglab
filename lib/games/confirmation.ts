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
// Le signal se voit au premier coup d'œil : amplitude d'au moins MIN_SIGNAL_SIZE fois l'amplitude médiane des
// 10 bougies d'avant (règle PO, 2026-10-30).
import type { Candle, ChartZone } from "./shared";

export type SignalKind = "rejet" | "engulfing" | "sommet local dépassé" | "retour dans le range" | "breakout confirmé";

const body = (k: Candle) => Math.abs(k.c - k.o);
const med = (a: number[]) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[s.length >> 1] : 0; };

export type ReactionKind = "rejet" | "engulfing";

/** Taille minimale d'un signal visible (règle PO, 2026-10-30) : son amplitude atteint 0,6 fois l'amplitude
 *  médiane des 10 bougies d'avant ; plus petit, il ne se voit pas au premier coup d'œil. */
export const MIN_SIGNAL_SIZE = 0.6;

/** Réaction d'un scénario : marteaux (étoiles filantes) et engulfings alternent d'un scénario à l'autre */
export function reactionKindOf(id: string): ReactionKind {
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h % 2 ? "engulfing" : "rejet";
}

const flip = (k: Candle): Candle => ({ o: -k.o, c: -k.c, h: -k.l, l: -k.h });

/**
 * Réaction ajoutée avant l'entrée quand le scénario n'en montre pas (règle PO), partie de la dernière
 * clôture et dimensionnée sur les bougies voisines (amplitude : l'amplitude médiane des 10 dernières) :
 *  - rejet : marteau à l'achat (étoile filante à la vente), mèche de 60 % vers le niveau, corps de 30 % ;
 *  - engulfing : bougie qui avale le corps de la précédente (ou clôture au-dessus du plus haut des trois
 *    précédentes quand celle-ci va déjà dans le sens du trade), corps d'au moins 85 % de l'amplitude.
 * La mèche ne dépasse jamais `floor` (stops, plus bas de la structure, bas de la zone touchée) : sans place
 * pour elle, la réaction est un engulfing. La suite reste la même (sa première bougie repart de la nouvelle
 * clôture) : stops et objectifs gardent leur issue.
 */
export function addReaction(past: Candle[], future: Candle[], dir: 1 | -1, m: number, floor: number, prefer: ReactionKind = "rejet", touch?: number): { past: Candle[]; future: Candle[]; entry: number } {
  // lecture à l'achat : à la vente, graphique renversé
  const cs = dir === 1 ? past : past.map(flip);
  const f = dir === 1 ? floor : -floor;
  const n = cs.length, prev = cs[n - 1], p = prev.c;
  const T = Math.max(med(cs.slice(-10).map((k) => k.h - k.l)), 0.3 * m);
  const room = p - f;
  // mèche du marteau : au moins 0,6 bougie médiane ; jusqu'au niveau (le plancher) quand il est à portée
  // (un niveau tracé à portée, `touch` : la mèche vient au contact)
  const t = touch === undefined ? undefined : dir === 1 ? touch : -touch;
  const w = t !== undefined && p - t <= 2 * T
    ? Math.min(Math.max(0.6 * T, p - t + 0.05 * T), Math.max(0.6 * T, room - 0.02 * T))
    : Math.min(Math.max(0.6 * T, room - 0.02 * T), 1.4 * T);
  const hammer = (): Candle => Math.round(p * 1e4) % 2
    // marteau vert ou rouge (selon la dernière clôture) : la couleur de la dernière bougie ne donne pas la réponse
    ? { o: p, l: p - w, c: p + 0.35 * w, h: p + 0.45 * w }
    : { o: p, l: p - w, c: p - 0.15 * w, h: p + 0.07 * w };
  const engulf = (): Candle => {
    const top = prev.c < prev.o ? prev.o : Math.max(...cs.slice(-3).map((x) => x.h));
    const c = Math.max(top + 0.1 * T, p + 0.85 * T);
    return { o: p, c, l: Math.max(p - 0.06 * T, Math.min(p, f)), h: c + 0.08 * T };
  };
  const fut = dir === 1 ? future : future.map(flip);
  let k: Candle;
  if (room >= 0.6 * T && (prefer === "rejet" || room <= 1.6 * T || (t !== undefined && p - t <= 2 * T))) k = hammer();
  else {
    k = engulf();
    // l'engulfing monte l'entrée : la suite doit finir au-delà, sinon marteau
    if (fut.length && fut[fut.length - 1].c - k.c < 0.3 * T && room >= 0.6 * T) k = hammer();
  }
  const kk = dir === 1 ? k : flip(k);
  const f0 = future[0];
  const next = f0 ? [{ ...f0, o: kk.c, h: Math.max(f0.h, kk.c), l: Math.min(f0.l, kk.c) }, ...future.slice(1)] : future;
  return { past: [...past, kk], future: next, entry: kk.c };
}

/**
 * Signal visible avant l'entrée (graphique brut) : le signal que la scène a dessiné (marteau, engulfing, doji
 * confirmé…) reste tel quel, ses affirmations en dépendent ; le constructeur choisit ensuite un tirage où il se voit
 * (taille vérifiée sur le graphique final). Sans signal, une réaction dimensionnée est ajoutée (addReaction).
 */
export function ensureVisibleSignal(past: Candle[], future: Candle[], dir: 1 | -1, zones: ChartZone[], m: number, floor: number, prefer: ReactionKind = "rejet"): { past: Candle[]; future: Candle[]; entry: number } {
  if (findSignal(past, dir, zones)) return { past, future, entry: past[past.length - 1].c };
  // niveau tracé le plus proche du côté de la réaction (bord tourné vers le prix)
  const p = past[past.length - 1].c;
  const edges = zones.map((z) => (dir === 1 ? Math.max(z.y1, z.y2) : Math.min(z.y1, z.y2))).filter((e) => dir * (p - e) > 0);
  const touch = edges.length ? edges.reduce((a, b) => (dir * (p - b) < dir * (p - a) ? b : a)) : undefined;
  return addReaction(past, future, dir, m, floor, prefer, touch);
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
 *  (aucune clôture sous son plus bas à l'achat, dernière clôture au-dessus du bas de son corps), et il est
 *  assez grand pour se voir (MIN_SIGNAL_SIZE). */
export function entrySignal(past: Candle[], dir: 1 | -1, zones: ChartZone[] = []): SignalKind | null {
  const sig = findSignal(past, dir, zones);
  return sig && sig.size >= MIN_SIGNAL_SIZE ? sig.kind : null;
}

/** Signal, bougie qui le porte et sa taille : amplitude rapportée à l'amplitude médiane des 10 bougies d'avant */
export function findSignal(past: Candle[], dir: 1 | -1, zones: ChartZone[] = []): { kind: SignalKind; at: number; size: number } | null {
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
    if (cs.slice(j + 1).every((x) => x.c > k.l) && cs[n - 1].c >= Math.min(k.o, k.c)) {
      const mr = med(cs.slice(Math.max(0, j - 10), j).map((x) => x.h - x.l)) || 1e-9;
      return { kind: s, at: j, size: (k.h - k.l) / mr };
    }
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
