// Tracé des zones calé sur les bougies affichées (règle PO : « comme un trader le tracerait sur
// TradingView »). Les générateurs posent leurs zones sur des prix abstraits ; la passe de réalisme
// change ensuite les bougies. Cette passe, appliquée après le réalisme, recale chaque zone sur ce
// que le joueur voit (bougies d'avant la réponse), selon ce qu'elle représente. Toute taille est
// relative à MR, l'amplitude médiane (haut − bas) des bougies affichées.
//  - plus bas / plus haut précédent, swings (1, 2, 3…), HL / LH, equal lows / highs : sur un vrai
//    creux / sommet. Avec une liquidité balayée, le plus bas précédent est l'extrême des bougies
//    d'avant le sweep ; sinon, l'extrême local le plus proche (chaque libellé sur un extrême
//    distinct). Trait fin centré sur la pointe de la mèche.
//  - liquidité balayée / sweep : bande fine juste au-delà du niveau, qui ne va jamais plus loin
//    que la mèche qui la balaie ; liquidité non balayée, zone de chasse aux stops : bande fine
//    collée au niveau, du côté des stops.
//  - FVG : exactement l'écart entre la mèche de la bougie 1 et celle de la bougie 3 de l'impulsion
//    la plus proche.
//  - Order Block : la bougie opposée (haut − bas) sous la zone, avant l'impulsion.
//  - support / résistance, haut / bas du range : bande resserrée sur les touches (au plus SR_W).
import type { Candle, ChartZone } from "./shared";

/** Épaisseurs (× MR) : niveau d'un extrême, liquidité, support / résistance maximal */
export const TRACE = { PIVOT_W: 0.02, LIQ_W: 0.8, LIQ_GAP: 0.05, SR_W: 1.2, SR_MIN: 0.3, SNAP: 2.0, EQ_LIQ: 0.2 };

const median = (a: number[]) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : 0; };
export const medianRange = (cs: Candle[]) => median(cs.map((k) => k.h - k.l)) || 1e-9;

export const LIQ_LABEL = /^(liquidit|sweep (haut|bas)|zone de chasse|mèche du faux breakout)/i;
export const SWEPT_LABEL = /balay|^sweep|^mèche du faux breakout/i;
export const PIVOT_LABEL = /^(plus (haut|bas) précédent|swing (high|low)|equal (lows|highs)|haut de la session|bas de la session)/i;
export const SR_LABEL = /^(support|r[ée]sistance|haut du range|bas du range)/i;
const isHigh = (label: string) => /haut|high|lh|highs/i.test(label);
const isLowLiq = (z: ChartZone) => z.kind === "liquidity_low" || /bas|en-dessous|chasse/i.test(z.label);

/** Extrêmes locaux (fenêtre ±w) : indices */
function localExtremes(cs: Candle[], side: "l" | "h", w = 2): number[] {
  const out: number[] = [];
  cs.forEach((k, i) => {
    const win = cs.slice(Math.max(0, i - w), i + w + 1);
    if (side === "l" ? win.every((x) => x.l >= k.l) : win.every((x) => x.h <= k.h)) out.push(i);
  });
  return out;
}

const band = (center: number, w: number) => ({ y1: center - w / 2, y2: center + w / 2 });

export function traceZones(past: Candle[], zones: ChartZone[]): ChartZone[] {
  if (past.length < 3) return zones;
  const MR = medianRange(past);
  const out = zones.map((z) => ({ ...z }));
  // Sweep : bougie à la mèche la plus profonde dans / au-delà d'une liquidité balayée
  const swept = out.find((z) => SWEPT_LABEL.test(z.label) && LIQ_LABEL.test(z.label));
  let sweepIdx = -1;
  if (swept) {
    const low = isLowLiq(swept);
    sweepIdx = past.reduce((a, k, i) => (low ? (k.l < past[a].l ? i : a) : (k.h > past[a].h ? i : a)), 0);
  }
  // 1. Extrêmes nommés (plus bas / haut précédent, swings…), chacun sur un extrême distinct
  const used = new Set<number>();
  for (const z of out) {
    if (!PIVOT_LABEL.test(z.label)) continue;
    const high = isHigh(z.label), side = high ? "h" : "l";
    const center = (z.y1 + z.y2) / 2;
    let idx = -1;
    if (z.at !== undefined && z.at >= 0 && z.at < past.length) {
      // swing désigné par le générateur : la pointe de la bougie qui y clôture ou de la suivante
      const pair = [z.at, Math.min(z.at + 1, past.length - 1)];
      idx = pair.reduce((a, i) => (high ? (past[i].h > past[a].h ? i : a) : (past[i].l < past[a].l ? i : a)));
    } else if (sweepIdx > 0 && swept && isLowLiq(swept) === !high && (/précédent/i.test(z.label) || /^swing (high|low)$/i.test(z.label))) {
      // niveau balayé (plus bas précédent, swing cassé par la mèche du faux breakout) : l'extrême
      // des bougies d'avant le sweep
      idx = past.slice(0, sweepIdx).reduce((a, k, i) => (high ? (k.h > past[a].h ? i : a) : (k.l < past[a].l ? i : a)), 0);
    } else if (/^swing (high|low)( évident| h1)?$/i.test(z.label)) {
      // swing non numéroté : la pointe de mèche la plus proche du niveau voulu par le générateur
      // (la bougie qu'il a construite, après la passe de réalisme)
      const win = past.map((k, i) => i).filter((i) => i !== sweepIdx && !used.has(i) && Math.abs(past[i][side] - center) <= TRACE.SNAP * MR);
      if (win.length) idx = win.reduce((a, i) => (Math.abs(past[i][side] - center) < Math.abs(past[a][side] - center) ? i : a));
    } else if (/^(haut|bas) de la session/i.test(z.label)) {
      // haut (bas) de la session : l'extrême des bougies proches du niveau, pas un sommet intermédiaire
      const win = past.map((k, i) => i).filter((i) => i !== sweepIdx && Math.abs(past[i][side] - center) <= TRACE.SNAP * MR);
      if (win.length) idx = win.reduce((a, i) => (high ? (past[i].h > past[a].h ? i : a) : (past[i].l < past[a].l ? i : a)));
    } else if (/^equal (lows|highs)/i.test(z.label)) {
      // equal lows / highs : la bande couvre les deux extrêmes quasi égaux (deux creux distincts,
      // séparés d'au moins 3 bougies) et la liquidité qui dort juste au-delà (EQ_LIQ × MR)
      const cands = localExtremes(past, side, 1).filter((i) => i !== sweepIdx && Math.abs(past[i][side] - center) <= TRACE.SNAP * MR);
      let pair: [number, number] | null = null;
      // les deux extrêmes les plus égaux, puis les plus proches du niveau voulu
      const cost = (p: [number, number]) => Math.abs(past[p[0]][side] - past[p[1]][side]) + Math.abs((past[p[0]][side] + past[p[1]][side]) / 2 - center);
      for (const a of cands) for (const b of cands) if (b - a >= 3 && Math.abs(past[a][side] - past[b][side]) <= 0.5 * MR
        && (!pair || cost([a, b]) < cost(pair))) pair = [a, b];
      if (pair) {
        const v = [past[pair[0]][side], past[pair[1]][side]];
        if (high) { z.y1 = Math.min(...v) - 0.05 * MR; z.y2 = Math.max(...v) + TRACE.EQ_LIQ * MR; }
        else { z.y1 = Math.min(...v) - TRACE.EQ_LIQ * MR; z.y2 = Math.max(...v) + 0.05 * MR; }
        pair.forEach((i) => used.add(i));
      }
      continue;
    } else {
      const cands = localExtremes(past, side).filter((i) => !used.has(i) && i !== sweepIdx);
      const near = cands.filter((i) => Math.abs(past[i][side] - center) <= TRACE.SNAP * MR);
      if (near.length) idx = near.reduce((a, i) => (Math.abs(past[i][side] - center) < Math.abs(past[a][side] - center) ? i : a));
    }
    if (idx < 0) continue;
    used.add(idx);
    // trait centré sur la pointe de la mèche (une ligne, comme sur TradingView) : un stop posé « pile au-dessus » du
    // niveau reste au-dessus du trait
    Object.assign(z, band(past[idx][side], TRACE.PIVOT_W * MR));
  }
  // 2. Liquidité : bande fine au-delà du niveau qu'elle prolonge (extrême nommé le plus proche,
  //    sinon le bord de la zone le plus proche des bougies)
  for (const z of out) {
    if (!LIQ_LABEL.test(z.label)) continue;
    const low = isLowLiq(z);
    const lo = Math.min(z.y1, z.y2), hi = Math.max(z.y1, z.y2);
    // niveau prolongé : un extrême nommé, ou le bord d'un support / d'une résistance, du même côté
    const ref = out.filter((p) => p !== z && ((PIVOT_LABEL.test(p.label) && isHigh(p.label) === !low) || (SR_LABEL.test(p.label) && (low ? p.kind === "support" : p.kind === "resistance"))))
      .map((p) => (low ? Math.min(p.y1, p.y2) : Math.max(p.y1, p.y2)))
      .filter((v) => Math.abs(v - (low ? hi : lo)) <= TRACE.SNAP * MR);
    const level = ref.length ? (low ? Math.min(...ref) : Math.max(...ref)) : (low ? hi : lo);
    const near = level + (low ? -1 : 1) * TRACE.LIQ_GAP * MR;
    let far = near + (low ? -1 : 1) * TRACE.LIQ_W * MR;
    if (SWEPT_LABEL.test(z.label) && sweepIdx >= 0) {
      const tip = low ? past[sweepIdx].l : past[sweepIdx].h;
      // la mèche du faux breakout va jusqu'à sa pointe ; une liquidité balayée s'arrête avant si elle est fine
      far = /^mèche/i.test(z.label) ? tip : low ? Math.max(far, tip) : Math.min(far, tip);
      if (low ? far >= near : far <= near) far = near + (low ? -1 : 1) * 0.1 * MR;
    }
    z.y1 = Math.min(near, far); z.y2 = Math.max(near, far);
  }
  // 3. FVG : l'écart exact de l'impulsion de 3 bougies la plus proche
  for (const z of out) {
    if (z.kind !== "fvg" || /order block/i.test(z.label)) continue;
    const center = (z.y1 + z.y2) / 2;
    let best: { lo: number; hi: number; d: number } | null = null;
    for (let i = 1; i + 1 < past.length; i++) {
      const a = past[i - 1], c = past[i + 1];
      const g = c.l > a.h ? { lo: a.h, hi: c.l } : c.h < a.l ? { lo: c.h, hi: a.l } : null;
      if (!g) continue;
      const d = Math.abs((g.lo + g.hi) / 2 - center);
      if (d <= TRACE.SNAP * MR && (!best || d < best.d)) best = { ...g, d };
    }
    if (best) { z.y1 = best.lo; z.y2 = best.hi; }
  }
  // 4. Order Block : la bougie opposée sous la zone, la dernière avant la plus grande bougie de l'impulsion
  for (const z of out) {
    if (!/order block/i.test(z.label)) continue;
    const lo = Math.min(z.y1, z.y2), hi = Math.max(z.y1, z.y2);
    const bull = !/baissier|bearish/i.test(z.label);
    const big = past.reduce((a, k, i) => (Math.abs(k.c - k.o) > Math.abs(past[a].c - past[a].o) ? i : a), 0);
    let idx = -1;
    for (let i = big - 1; i >= 0; i--) {
      const k = past[i], opp = bull ? k.c < k.o : k.c > k.o;
      if (opp && k.h >= lo - TRACE.SNAP * MR && k.l <= hi + TRACE.SNAP * MR) { idx = i; break; }
    }
    if (idx >= 0) { z.y1 = past[idx].l; z.y2 = past[idx].h; }
  }
  // 5. Support / résistance, bornes du range : bande resserrée sur les touches
  for (const z of out) {
    if (!SR_LABEL.test(z.label)) continue;
    const lo = Math.min(z.y1, z.y2), hi = Math.max(z.y1, z.y2);
    if (hi - lo <= TRACE.SR_W * MR) continue;
    const tol = 0.25 * MR;
    const ext: number[] = [];
    for (const k of past) {
      if (k.l > hi + tol || k.h < lo - tol) continue;
      if (k.l >= lo - tol && k.l <= hi + tol) ext.push(k.l);
      if (k.h >= lo - tol && k.h <= hi + tol) ext.push(k.h);
    }
    const c = ext.length ? median(ext) : (lo + hi) / 2;
    const w = Math.max(TRACE.SR_MIN * MR, Math.min(TRACE.SR_W * MR, ext.length ? Math.max(...ext) - Math.min(...ext) : TRACE.SR_W * MR));
    Object.assign(z, band(c, w));
  }
  // Graphique étroit (téléphone) : « Liquidité » seul, la zone dit où elle dort ; le libellé long
  // ne trouvait pas de place contre sa zone entre le niveau voisin et les stops
  for (const z of out) if (/^Liquidité (balayée|au-dessus|en-dessous)$/.test(z.label) && !z.short) z.short = "Liquidité";
  // (la pastille de session dit « Asie »)
  for (const z of out) if (z.label === "Haut de la session asiatique" && !z.short) z.short = "Haut Asie";
  return out;
}

/** Zones du graphique recalées sur les bougies d'avant la réponse (après la passe de réalisme) */
export function withTracedZones<T extends { past: Candle[]; zones: ChartZone[] }>(ch: T): T {
  return { ...ch, zones: traceZones(ch.past, ch.zones) };
}
