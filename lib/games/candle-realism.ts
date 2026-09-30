// Passe de réalisme appliquée aux bougies générées (échelle abstraite), commune
// aux 4 mini-jeux :
//   - corps de tailles variées dans les jambes de tendance (log-normale, en
//     grappes de volatilité), vrais corps dans les consolidations ;
//   - amplitude = corps / part du corps (30–85 %, en grappes) ; une mèche
//     dominante et une mèche mineure ;
//   - plus aucune clôture égale à l'ouverture.
// Elle ne change jamais ce que les textes et le scoring lisent :
//   - la position de chaque clôture et de chaque mèche par rapport aux niveaux
//     clés (zones, entrées, stops, TP) : touches, balayages, remplissages ;
//   - la couleur de chaque bougie, les clôtures de retournement (début et fin
//     de chaque jambe) et la dernière clôture du passé (le prix d'entrée) ;
//   - les extrêmes locaux et globaux (swings, sweeps, sommets, creux) et l'ordre
//     des extrêmes de deux bougies voisines ;
//   - les longues mèches structurelles (une mèche qui atteint un niveau clé).

import { mulberry32, type Candle } from "./shared";

const PHI = 0.55;          // persistance des grappes de volatilité
const RUN_SIGMA = 0.9;    // dispersion log-normale des corps dans une jambe
const BODY_SIGMA = 0.8;            // dispersion log-normale des corps hors jambes
const MIN_BODY_SHARE_PIN = 0.25;    // corps plancher d'une pin bar structurelle

function median(a: number[]): number {
  if (!a.length) return 0;
  const s = [...a].sort((x, y) => x - y);
  return s[Math.floor(s.length / 2)];
}

function gauss(rng: () => number): number {
  const u = Math.max(rng(), 1e-12), v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/** Extrêmes figés : extrêmes globaux d'une série (le plus haut, le plus bas). */
function frozenExtremes(cs: Candle[], offset: number, hi: Set<number>, lo: Set<number>) {
  const n = cs.length;
  if (!n) return;
  let iH = 0, iL = 0;
  for (let i = 0; i < n; i++) {
    if (cs[i].h > cs[iH].h) iH = i;
    if (cs[i].l < cs[iL].l) iL = i;
  }
  hi.add(offset + iH);
  lo.add(offset + iL);
}

/** Indices des swings stricts (fenêtre ±1) d'une série. */
function swings(cs: Candle[], side: "h" | "l"): number[] {
  const out: number[] = [];
  for (let i = 1; i < cs.length - 1; i++) {
    const a = cs[i - 1][side], b = cs[i][side], c = cs[i + 1][side];
    if (side === "h" ? b > a && b >= c : b < a && b <= c) out.push(i);
  }
  return out;
}

/** Niveaux clés : les mêmes partout, ou distincts pour le passé et pour le futur. */
export type RealismLevels = number[] | { past: number[]; future: number[] };

/**
 * Applique la passe de réalisme. `levels` : niveaux clés du scénario (bornes de
 * zones, entrées, stops, TP) dont la position relative des clôtures et des
 * mèches est conservée. Pour le passé, seuls comptent les niveaux lus par le
 * joueur avant de décider ; pour le futur, aussi ceux qui décident de l'issue.
 */
export function realizeCandles(past: Candle[], future: Candle[], levels: RealismLevels, seed: number): { past: Candle[]; future: Candle[] } {
  const all = [...past, ...future].map((k) => ({ ...k }));
  const orig = all.map((k) => ({ ...k }));
  const n = all.length, np = past.length;
  if (n < 3) return { past, future };
  const rng = mulberry32((seed ^ 0x51ED270B) >>> 0);
  const medBody = median(all.map((k) => Math.abs(k.c - k.o)).filter((b) => b > 1e-9)) || 1e-3;
  const eps = medBody * 1e-4;
  const clean = (a: number[]) => a.filter((x) => Number.isFinite(x));
  const LP = clean(Array.isArray(levels) ? levels : levels.past);
  const LF = clean(Array.isArray(levels) ? levels : levels.future);
  const Lof = (i: number) => (i < np ? LP : LF);
  // une clôture posée pile sur un niveau peut le quitter (seul le prix d'entrée est verrouillé)
  const sameSide = (i: number, a: number, b: number) => Lof(i).every((K) => a === K || Math.sign(a - K) === Math.sign(b - K));
  const flat0 = orig.map((k) => k.c === k.o);
  const color = orig.map((k) => Math.sign(k.c - k.o));
  const colorOk = (i: number, s: number) => (flat0[i] ? s !== 0 : s === color[i]);
  const locked = (i: number) => i === np - 1;            // prix d'entrée = dernière clôture du passé
  const trigger = (i: number) => i === np - 1 || i === np - 2;   // bougies déclencheuses : ni corps ni mèches retaillés

  // Mèche structurelle : l'extrême dépasse un niveau clé au-delà du corps
  const pinUp = orig.map((k, i) => Lof(i).some((K) => K > Math.max(k.o, k.c) && K <= k.h));
  const pinDown = orig.map((k, i) => Lof(i).some((K) => K < Math.min(k.o, k.c) && K >= k.l));
  const medPast = median(orig.slice(0, np).map((k) => Math.abs(k.c - k.o)).filter((b) => b > 1e-9)) || medBody;
  const medFut = median(orig.slice(np).map((k) => Math.abs(k.c - k.o)).filter((b) => b > 1e-9)) || medBody;
  const bigBody = orig.map((k, i) => Math.abs(k.c - k.o) >= 1.5 * (i < np ? medPast : medFut));
  // une grande bougie (force, pump) reste au moins 2,2 × plus grande que les autres de sa série
  const bigMin = (a0: number, a1: number) => Math.min(Infinity, ...orig.slice(a0, a1).filter((_, j) => bigBody[a0 + j]).map((k) => Math.abs(k.c - k.o)));
  const lastBody = np ? Math.abs(orig[np - 1].c - orig[np - 1].o) : 0;
  // médiane des corps avant la dernière bougie, dojis compris (comme les textes « bougie de force »)
  const medBefore = median(orig.slice(0, Math.max(0, np - 1)).map((k) => Math.abs(k.c - k.o)));
  const capPast = Math.min(bigMin(0, np) / 2.2, lastBody >= 1.3 * medBefore ? lastBody / 2.05 : Infinity);
  const capFut = bigMin(np, n) / 2.2;
  const bodyCap = (i: number) => (bigBody[i] || i === np - 1 ? Infinity : i < np ? capPast : capFut);

  const grows = (j: number, next: number, cur: number) => next > cur + eps && next > bodyCap(j);
  // Déplace la clôture i (et l'ouverture i + 1) si la clôture ne change de côté
  // d'aucun niveau et qu'aucune couleur ne change ; renvoie true si appliqué.
  const setClose = (i: number, c2: number): boolean => {
    const k = all[i], nx = all[i + 1];
    if (!sameSide(i, k.c, c2)) return false;
    if (!colorOk(i, Math.sign(c2 - k.o))) return false;
    if (nx && !colorOk(i + 1, Math.sign(nx.c - c2))) return false;
    // aucun corps (la bougie ou sa voisine) ne grossit au-delà du plafond
    if (grows(i, Math.abs(c2 - k.o), Math.abs(k.c - k.o)) || (nx && grows(i + 1, Math.abs(nx.c - c2), Math.abs(nx.c - nx.o)))) return false;
    k.c = c2;
    if (nx) nx.o = c2;
    return true;
  };
  // Déplace l'ouverture i (et la clôture i − 1), pour la bougie dont la clôture est verrouillée
  const setOpen = (i: number, o2: number): boolean => {
    const k = all[i], p = all[i - 1];
    if (!p || !sameSide(i - 1, p.c, o2)) return false;
    if (!colorOk(i, Math.sign(k.c - o2)) || !colorOk(i - 1, Math.sign(o2 - p.o))) return false;
    if (grows(i, Math.abs(k.c - o2), Math.abs(k.c - k.o)) || grows(i - 1, Math.abs(o2 - p.o), Math.abs(p.c - p.o))) return false;
    p.c = o2; k.o = o2;
    return true;
  };

  // 1. Jambes de tendance : corps redistribués (log-normale en grappes), clôtures
  //    de début et de fin de jambe inchangées, chaque clôture dans son intervalle
  //    d'origine entre deux niveaux clés.
  const inRun = new Array<boolean>(n).fill(false);
  let i0 = 0;
  while (i0 < n) {
    let i1 = i0;
    // une jambe s'arrête avant les bougies déclencheuses (clôtures verrouillées)
    while (i1 + 1 < n && !trigger(i0) && !trigger(i1 + 1) && !flat0[i0] && !flat0[i1 + 1] && color[i1 + 1] === color[i0] && !bigBody[i1 + 1] && !bigBody[i0]) i1++;
    const len = i1 - i0 + 1;
    if (len >= 2) {
      for (let j = i0; j <= i1; j++) inRun[j] = true;
      const start = all[i0].o, end = all[i1].c, total = end - start;
      let z = gauss(rng) * RUN_SIGMA;
      const w: number[] = [];
      for (let j = 0; j < len; j++) { if (j) z = PHI * z + Math.sqrt(1 - PHI * PHI) * RUN_SIGMA * gauss(rng); w.push(Math.exp(z)); }
      const sw = w.reduce((a, b) => a + b, 0);
      const interval = (i: number, c: number) => {
        let lo = -Infinity, hi = Infinity;
        for (const K of Lof(i)) { if (K < c) lo = Math.max(lo, K); if (K > c) hi = Math.min(hi, K); if (K === c) { lo = hi = c; } }
        return [lo, hi] as const;
      };
      for (const t of [1, 0.6, 0.3, 0]) {
        const cs: number[] = [];
        let acc = start, ok = true;
        for (let j = 0; j < len - 1; j++) {
          const idx = i0 + j;
          const share = (1 - t) * Math.abs(orig[idx].c - orig[idx].o) / Math.abs(total || 1) + t * (w[j] / sw);
          acc += total * share;
          const [lo, hi] = interval(idx, orig[idx].c);
          const prev = j ? cs[j - 1] : start;
          let cc = acc;
          const cap = bodyCap(idx);
          if (Number.isFinite(cap) && Math.abs(cc - prev) > cap) cc = prev + Math.sign(cc - prev) * cap;
          const c = lo === hi ? lo : Math.min(Math.max(cc, lo + eps), hi - eps);
          if (trigger(idx) && c !== orig[idx].c) { ok = false; break; }
          if (Math.sign(c - prev) !== color[i0]) { ok = false; break; }
          cs.push(c);
        }
        if (ok && Math.sign(end - (cs.length ? cs[cs.length - 1] : start)) !== color[i0]) ok = false;
        // aucun corps (dernier de la jambe compris) ne grossit au-delà du plafond
        if (ok) {
          const closes = [...cs, end];
          for (let j = 0; j < len && ok; j++) {
            const bj = Math.abs(closes[j] - (j ? closes[j - 1] : start));
            if (bj > bodyCap(i0 + j) && bj > Math.abs(orig[i0 + j].c - orig[i0 + j].o) + eps) ok = false;
          }
        }
        if (!ok) continue;
        cs.forEach((c, j) => { all[i0 + j].c = c; all[i0 + j + 1].o = c; });
        break;
      }
    }
    i0 = i1 + 1;
  }

  // 2. Corps : hors des jambes, taille cible log-normale en grappes (corps agrandi
  //    ou réduit) ; plancher pour les pin bars structurelles (≥ 25 % de leur
  //    amplitude) ; plus aucune clôture égale à l'ouverture.
  let zb = gauss(rng) * BODY_SIGMA;
  for (let i = 0; i < n; i++) {
    if (i > 0) zb = PHI * zb + Math.sqrt(1 - PHI * PHI) * BODY_SIGMA * gauss(rng);
    const k = all[i], o0 = orig[i];
    const pin = pinUp[i] || pinDown[i];
    const domWick0 = Math.max(o0.h - Math.max(o0.o, o0.c), Math.min(o0.o, o0.c) - o0.l);
    const floor = Math.min(Math.max(0.2 * medBody, pin ? MIN_BODY_SHARE_PIN * (o0.h - o0.l) : 0), pin ? 0.8 * domWick0 : Infinity, bodyCap(i));
    const cur = Math.abs(k.c - k.o);
    // pin bar, bougie déclencheuse (dernière du passé) ou jambe : pas de nouvelle taille, seulement le plancher
    if (trigger(i)) {
      if (k.c !== k.o) continue;
      const prevDn = i > 0 && all[i - 1].c < all[i - 1].o;
      let fixed = false;
      for (const d of [prevDn ? 1 : -1, prevDn ? -1 : 1]) if (i > 0 && setOpen(i, k.c - d * 0.05 * medBody)) { fixed = true; break; }
      // sinon (avant-dernière) : la clôture bouge dans le sens qui réduit le corps de la dernière bougie
      if (!fixed && !locked(i) && all[i + 1]) setClose(i, k.o + Math.sign(all[i + 1].c - all[i + 1].o || 1) * 0.05 * medBody);
      continue;
    }
    const target = medBody * Math.exp(zb);   // médiane des corps conservée
    const want = inRun[i] || locked(i) || bigBody[i]
      ? Math.max(cur, floor)
      : Math.min(bodyCap(i), pin ? Math.min(0.8 * domWick0, 0.45 * (o0.h - o0.l)) : Infinity, Math.max(floor, target));
    if (Math.abs(want - cur) < 1e-12 && cur > 0) continue;
    const prevDown = i > 0 && all[i - 1].c < all[i - 1].o;
    const dirs = k.c !== k.o ? [Math.sign(k.c - k.o)] : [prevDown ? 1 : -1, prevDown ? -1 : 1];
    let done = false;
    for (const f of [1, 0.6, 0.3, 0.1]) {
      const target = cur + (want - cur) * f;
      if (target < 0.2 * medBody && target < cur) continue;
      for (const d of dirs) {
        if (locked(i) ? i > 0 && setOpen(i, k.c - d * target) : setClose(i, k.o + d * target)) { done = true; break; }
        // sinon le corps grandit côté ouverture (la clôture précédente recule), hors bougie déclencheuse
        if (!locked(i) && target > cur && i > 0 && !trigger(i - 1) && k.c !== k.o && setOpen(i, k.c - d * target)) { done = true; break; }
      }
      if (done) break;
    }
    if (!done && k.c === k.o) {
      for (const d of dirs) if (locked(i) ? i > 0 && setOpen(i, k.c - d * 0.05 * medBody) : setClose(i, k.o + d * 0.05 * medBody)) break;
    }
  }
  for (const k of all) { k.h = Math.max(k.h, k.o, k.c); k.l = Math.min(k.l, k.o, k.c); }

  // 3. Extrêmes figés (sur les bougies d'origine, passé et futur séparément)
  const fixH = new Set<number>(), fixL = new Set<number>();
  frozenExtremes(orig.slice(0, np), 0, fixH, fixL);
  frozenExtremes(orig.slice(np), np, fixH, fixL);
  const pastMaxH = Math.max(...orig.slice(0, np).map((k) => k.h)), pastMinL = Math.min(...orig.slice(0, np).map((k) => k.l));
  const futMaxH = np < n ? Math.max(...orig.slice(np).map((k) => k.h)) : Infinity;
  const futMinL = np < n ? Math.min(...orig.slice(np).map((k) => k.l)) : -Infinity;

  // 4. Mèches : amplitude = corps / part du corps (30–85 %, en grappes), une
  //    mèche dominante (75–95 % des mèches) et une mineure ; bornées par les
  //    niveaux clés et les extrêmes figés.
  const hB: [number, number][] = [], lB: [number, number][] = [];
  let y = gauss(rng) * 1.1;
  for (let i = 0; i < n; i++) {
    if (i > 0) y = PHI * y + Math.sqrt(1 - PHI * PHI) * 1.1 * gauss(rng);
    const beta = 0.3 + 0.62 / (1 + Math.exp(-y));
    const k = all[i], o0 = orig[i];
    const T = Math.max(k.o, k.c), B = Math.min(k.o, k.c), b = T - B;
    const U0 = o0.h - Math.max(o0.o, o0.c), D0 = Math.min(o0.o, o0.c) - o0.l;
    // mèche dominante : côté du niveau pour une pin bar ; sinon, le plus souvent
    // côté ouverture (une bougie de tendance clôture près de son extrême)
    const upDominant = pinUp[i] !== pinDown[i] ? pinUp[i] : rng() < 0.8 ? k.c < k.o : U0 > D0 || (U0 === D0 && rng() < 0.5);
    const share = 0.75 + 0.2 * rng();
    const W = b * (1 / beta - 1);
    let hWant = T + (upDominant ? W * share : W * (1 - share));
    let lWant = B - (upDominant ? W * (1 - share) : W * share);
    if (trigger(i)) { hWant = Math.max(o0.h, T); lWant = Math.min(o0.l, B); }
    const inPast = i < np;
    let hLo = T, hHi = fixH.has(i) ? Infinity : (inPast ? pastMaxH : futMaxH) - eps;
    for (const K of Lof(i)) { if (K > T && K <= o0.h) hLo = Math.max(hLo, K); if (K > o0.h) hHi = Math.min(hHi, K - eps); }
    let lHi = B, lLo = fixL.has(i) ? -Infinity : (inPast ? pastMinL : futMinL) + eps;
    for (const K of Lof(i)) { if (K < B && K >= o0.l) lHi = Math.min(lHi, K); if (K < o0.l) lLo = Math.max(lLo, K + eps); }
    // une mèche posée pile sur un niveau (bord de FVG, equal lows…) y reste
    if (Lof(i).some((K) => K === o0.h) && o0.h >= T) { hLo = o0.h; hHi = o0.h; }
    if (Lof(i).some((K) => K === o0.l) && o0.l <= B) { lLo = o0.l; lHi = o0.l; }
    // extrêmes figés et bougies déclencheuses : extrêmes d'origine exacts
    const keepH = fixH.has(i) || trigger(i), keepL = fixL.has(i) || trigger(i);
    k.h = keepH ? Math.max(o0.h, T) : Math.min(Math.max(hWant, hLo), Math.max(hHi, hLo));
    k.l = keepL ? Math.min(o0.l, B) : Math.max(Math.min(lWant, lHi), Math.min(lLo, lHi));
    hB.push(fixH.has(i) || trigger(i) ? [k.h, k.h] : [hLo, Math.max(hHi, hLo)]);
    lB.push(fixL.has(i) || trigger(i) ? [k.l, k.l] : [Math.min(lLo, lHi), lHi]);
  }

  // 5. Ordre des extrêmes de deux bougies voisines conservé : ajustement minimal
  //    (on monte l'une ou on descend l'autre dans ses bornes), retour aux
  //    extrêmes d'origine en dernier recours.
  const fixPair = (side: "h" | "l", i: number): boolean => {
    const a = all[i - 1], c = all[i], want = Math.sign(orig[i - 1][side] - orig[i][side]);
    if (Math.sign(a[side] - c[side]) === want) return false;
    const bounds = side === "h" ? hB : lB;
    // indices « haut » et « bas » attendus pour ce côté
    const [up, down] = want > 0 ? [i - 1, i] : want < 0 ? [i, i - 1] : [-1, -1];
    if (up >= 0) {
      const target = all[down][side] + eps;
      if (target <= bounds[up][1]) { all[up][side] = Math.max(all[up][side], target); return true; }
      const target2 = all[up][side] - eps;
      if (target2 >= bounds[down][0]) { all[down][side] = Math.min(all[down][side], target2); return true; }
    }
    for (const r of [i - 1, i]) all[r][side] = side === "h" ? Math.max(orig[r].h, all[r].o, all[r].c) : Math.min(orig[r].l, all[r].o, all[r].c);
    return true;
  };
  for (let pass = 0; pass < 10; pass++) {
    let bad = false;
    for (let i = 1; i < n; i++) { if (fixPair("h", i)) bad = true; if (fixPair("l", i)) bad = true; }
    if (!bad) break;
  }

  // 6. Ordre des swings entre eux conservé (« lows successivement plus bas »…),
  //    sinon retour à l'origine pour les swings concernés.
  for (const [a0, a1] of [[0, np], [np, n]] as const) {
    for (const side of ["h", "l"] as const) {
      const sw = swings(orig.slice(a0, a1), side).map((j) => a0 + j);
      for (let x = 0; x < sw.length; x++) for (let z = x + 1; z < sw.length; z++) {
        const p = sw[x], q = sw[z];
        if (Math.sign(orig[p][side] - orig[q][side]) !== Math.sign(all[p][side] - all[q][side])) {
          for (const r of [p, q]) all[r][side] = side === "h" ? Math.max(orig[r].h, all[r].o, all[r].c) : Math.min(orig[r].l, all[r].o, all[r].c);
        }
      }
    }
  }
  return { past: all.slice(0, np), future: all.slice(np) };
}

/** Applique la passe de réalisme à un graphique (passé + futur) et élargit son domaine. */
export function realizeChart<T extends { past: Candle[]; future: Candle[]; domain: { min: number; max: number } }>(chart: T, levels: RealismLevels, seed: number): T {
  const { past, future } = realizeCandles(chart.past, chart.future, levels, seed);
  const vals = [...past, ...future].flatMap((k) => [k.h, k.l]);
  return {
    ...chart,
    past,
    future,
    domain: { min: Math.min(chart.domain.min, ...vals), max: Math.max(chart.domain.max, ...vals) },
  };
}
