// Analyse des graphiques des leçons (LessonChart) : tout ce qu'un schéma affiche
// (zones, niveaux, pivots, R/R, pips, moyennes, RSI) est calculé ici à partir
// des prix, jamais écrit à la main. Module léger (aucune donnée de marché) :
// utilisé par les schémas au rendu et par l'audit (scripts/audit-lecons).

export interface Candle { o: number; h: number; l: number; c: number }

// ─── Formats ────────────────────────────────────────────────────────────────

/** Prix au format des leçons : « 1.0850 » (forex), « 4 620$ » (or, indices). */
export function fmtPrice(p: number, decimals: number, unit: "" | "$" = ""): string {
  if (unit === "$") {
    const [int, dec] = Math.abs(p).toFixed(decimals).split(".");
    const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return `${p < 0 ? "−" : ""}${grouped}${dec ? `,${dec}` : ""}$`;
  }
  return p.toFixed(decimals);
}

/** Nombre décimal à la française (virgule), sans zéro inutile. */
export function fmtNum(n: number, decimals = 1): string {
  const r = Number(n.toFixed(decimals));
  return `${r < 0 ? "−" : ""}${Math.abs(r).toString().replace(".", ",")}`;
}

/** R/R noté comme dans les leçons : « 1:4,2 », « 1:2,25 », « 1:6 » (2 décimales au plus). */
export function fmtRR(rr: number): string {
  return `1:${fmtNum(rr, 2)}`;
}

/** Écart en pips (arrondi au dixième). */
export function pips(a: number, b: number, pip: number): number {
  return Math.round((Math.abs(a - b) / pip) * 10) / 10;
}

// ─── Trade ──────────────────────────────────────────────────────────────────

export interface TradeMath { risk: number; reward: number; rr: number }

/** Risque, gain visé et R/R d'un trade (entrée, stop, objectif). */
export function tradeMath(entry: number, sl: number, tp: number): TradeMath {
  const risk = Math.abs(entry - sl);
  const reward = Math.abs(tp - entry);
  return { risk, reward, rr: reward / risk };
}

// ─── Zones ──────────────────────────────────────────────────────────────────

/** Order Block : corps (ouverture → clôture) de la bougie i. */
export function orderBlock(candles: Candle[], i: number): { y1: number; y2: number } {
  const k = candles[i];
  return { y1: Math.min(k.o, k.c), y2: Math.max(k.o, k.c) };
}

/** Dernière bougie de sens opposé avant l'indice `before` (OB haussier : dernière rouge). */
export function lastOpposite(candles: Candle[], before: number, side: "bull" | "bear"): number {
  for (let i = before - 1; i >= 0; i--) {
    const k = candles[i];
    if (side === "bull" ? k.c < k.o : k.c > k.o) return i;
  }
  return -1;
}

/**
 * FVG autour de la bougie i : haussier = du plus haut de i − 1 au plus bas de
 * i + 1 (quand ils ne se recouvrent pas) ; baissier = du plus bas de i − 1 au
 * plus haut de i + 1. null s'il n'y a pas de gap.
 */
export function fvgAt(candles: Candle[], i: number, side: "bull" | "bear"): { y1: number; y2: number } | null {
  const a = candles[i - 1], b = candles[i + 1];
  if (!a || !b) return null;
  if (side === "bull") return b.l > a.h ? { y1: a.h, y2: b.l } : null;
  return b.h < a.l ? { y1: b.h, y2: a.l } : null;
}

/** Le plus grand FVG d'une série (indice de la bougie centrale et bornes), ou null. */
export function largestFvg(candles: Candle[], side: "bull" | "bear"): { i: number; y1: number; y2: number } | null {
  let best: { i: number; y1: number; y2: number } | null = null;
  for (let i = 1; i < candles.length - 1; i++) {
    const g = fvgAt(candles, i, side);
    if (g && (!best || g.y2 - g.y1 > best.y2 - best.y1)) best = { i, ...g };
  }
  return best;
}

/** Retracement de Fibonacci d'un mouvement from → to (61.8 % : ratio 0.618). */
export function fibLevel(from: number, to: number, ratio: number): number {
  return to - (to - from) * ratio;
}

// ─── Structure ──────────────────────────────────────────────────────────────

export type PivotName = "HH" | "HL" | "LH" | "LL";
export interface Pivot { index: number; side: "h" | "l"; price: number; name?: PivotName }

/**
 * Pivots stricts : un sommet (creux) dépasse les `win` points de chaque côté.
 * Série de bougies (h / l) ou de prix (ligne).
 */
export function pivots(series: Candle[] | number[], win = 2): Pivot[] {
  const hi = (i: number) => (typeof series[i] === "number" ? (series[i] as number) : (series[i] as Candle).h);
  const lo = (i: number) => (typeof series[i] === "number" ? (series[i] as number) : (series[i] as Candle).l);
  const out: Pivot[] = [];
  for (let i = 0; i < series.length; i++) {
    let isH = true, isL = true;
    for (let d = 1; d <= win; d++) {
      for (const j of [i - d, i + d]) {
        if (j < 0 || j >= series.length) continue;
        if (hi(j) >= hi(i)) isH = false;
        if (lo(j) <= lo(i)) isL = false;
      }
    }
    // un pivot au bord n'est retenu que s'il a au moins un voisin de chaque côté
    if (i === 0 || i === series.length - 1) continue;
    if (isH) out.push({ index: i, side: "h", price: hi(i) });
    if (isL) out.push({ index: i, side: "l", price: lo(i) });
  }
  // HH / LH / HL / LL : comparaison au pivot précédent du même côté
  let lastH: Pivot | undefined, lastL: Pivot | undefined;
  for (const p of out) {
    if (p.side === "h") { if (lastH) p.name = p.price > lastH.price ? "HH" : "LH"; lastH = p; }
    else { if (lastL) p.name = p.price > lastL.price ? "HL" : "LL"; lastL = p; }
  }
  return out;
}

/** Pivot à l'indice i (ou une erreur explicite : un schéma ne nomme jamais un point qui n'est pas un pivot). */
export function pivotAt(series: Candle[] | number[], i: number, side: "h" | "l", win = 2): Pivot {
  const p = pivots(series, win).find((q) => q.index === i && q.side === side);
  if (!p) throw new Error(`Pas de pivot ${side === "h" ? "haut" : "bas"} à l'indice ${i}`);
  return p;
}

// ─── Indicateurs ────────────────────────────────────────────────────────────

/** Moyenne mobile simple (null tant que la fenêtre n'est pas pleine). */
export function sma(values: number[], n: number): (number | null)[] {
  return values.map((_, i) => (i + 1 < n ? null : values.slice(i + 1 - n, i + 1).reduce((a, b) => a + b, 0) / n));
}

/** RSI de Wilder (null avant n clôtures). */
export function rsi(closes: number[], n = 14): (number | null)[] {
  const out: (number | null)[] = closes.map(() => null);
  let gain = 0, loss = 0;
  for (let i = 1; i < closes.length; i++) {
    const d = closes[i] - closes[i - 1];
    const g = Math.max(d, 0), l = Math.max(-d, 0);
    if (i <= n) {
      gain += g; loss += l;
      if (i === n) { gain /= n; loss /= n; out[i] = loss === 0 ? 100 : 100 - 100 / (1 + gain / loss); }
    } else {
      gain = (gain * (n - 1) + g) / n;
      loss = (loss * (n - 1) + l) / n;
      out[i] = loss === 0 ? 100 : 100 - 100 / (1 + gain / loss);
    }
  }
  return out;
}

// ─── Lignes et bougies ──────────────────────────────────────────────────────

/** Prix d'une droite passant par (i1, p1) et (i2, p2), à l'indice i. */
export function lineAt(i1: number, p1: number, i2: number, p2: number, i: number): number {
  return p1 + ((p2 - p1) * (i - i1)) / (i2 - i1);
}

/**
 * Premier croisement d'une série (ligne) sous / au-dessus d'une droite, après
 * l'indice `after` : indice fractionnaire et prix du point de croisement.
 */
export function crossing(series: number[], line: (i: number) => number, after: number, dir: "down" | "up"): { i: number; price: number } | null {
  for (let i = Math.max(1, after + 1); i < series.length; i++) {
    const a = series[i - 1] - line(i - 1), b = series[i] - line(i);
    if (dir === "down" ? a >= 0 && b < 0 : a <= 0 && b > 0) {
      const t = a / (a - b);
      const x = i - 1 + t;
      return { i: x, price: line(x) };
    }
  }
  return null;
}

/** Bougies agrégées par groupes de `size` (ex. 4 bougies M15 → 1 bougie H1). */
export function aggregate(candles: Candle[], size: number): Candle[] {
  const out: Candle[] = [];
  for (let i = 0; i < candles.length; i += size) {
    const g = candles.slice(i, i + size);
    out.push({ o: g[0].o, c: g[g.length - 1].c, h: Math.max(...g.map((k) => k.h)), l: Math.min(...g.map((k) => k.l)) });
  }
  return out;
}

/** Ouverture de chaque bougie = clôture de la précédente (tolérance relative). */
export function isContinuous(candles: Candle[], eps = 1e-9): boolean {
  return candles.every((k, i) => i === 0 || Math.abs(k.o - candles[i - 1].c) <= eps);
}
