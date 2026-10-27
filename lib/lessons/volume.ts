// Volumes des graphiques de leçons (Volume Profile, VWAP, Order Flow) : tout ce que les schémas
// affichent est calculé ici à partir des bougies et de leurs volumes, jamais écrit à la main.
// Module léger, utilisé au rendu (LessonChart), par les données des leçons et par l'audit
// (scripts/audit-lecons), qui refait les mêmes calculs sur les données du graphique.
//
// Conventions :
// - chaque bougie porte son volume `v` (et, pour l'Order Flow, son delta `d` = volume à l'Ask − volume au Bid) ;
// - profil : rangées de hauteur `row`, centrées sur les multiples de `row` ; le volume d'une bougie est
//   réparti uniformément sur son étendue (plus bas → plus haut), au prorata de chaque rangée couverte ;
// - POC : la rangée la plus chargée ; Value Area : à partir du POC, on ajoute à chaque pas la rangée
//   voisine la plus chargée (au-dessus à égalité) jusqu'à 70 % du volume ; VAH / VAL : centres des
//   rangées extrêmes de la Value Area ;
// - nœuds : sommets du profil (au moins 15 % du POC, séparés par un creux sous 80 % du plus petit) ;
//   HVN : nœuds d'au moins 40 % du POC, hors du nœud du POC ; LVN : rangées sous 35 % du POC entre
//   deux nœuds ;
// - VWAP : Σ(prix typique × volume) ÷ Σ volume depuis la bougie d'ancrage, prix typique = (H + B + C) ÷ 3 ;
// - CVD : somme des deltas depuis la première bougie.

import type { Candle } from "./chart-analysis";

export interface VCandle extends Candle {
  /** Volume de la bougie */
  v: number;
  /** Delta (volume à l'Ask − volume au Bid), Order Flow */
  d?: number;
}

export interface ProfileRow { p: number; v: number }
export interface VolumeProfile {
  row: number;
  rows: ProfileRow[];
  total: number;
  poc: number;
  vah: number;
  val: number;
  /** Part du volume dans la Value Area (0 à 1) */
  vaShare: number;
  hvn: number[];
  lvn: { lo: number; hi: number }[];
}

export const VA_SHARE = 0.7;
export const HVN_MIN = 0.4;
/** Nœud du profil (borne d'une LVN) : sommet d'au moins 15 % du POC */
export const NODE_MIN = 0.15;
/** Deux sommets forment deux nœuds si le profil descend entre eux sous 80 % du plus petit */
export const NODE_GAP = 0.8;
export const LVN_MAX = 0.35;

const r9 = (x: number) => Number(x.toFixed(9));

/** Profil de volume des bougies `from` à `to` (incluses), rangées de hauteur `row`. */
export function volumeProfile(cs: VCandle[], row: number, from = 0, to = cs.length - 1): VolumeProfile {
  const k = (p: number) => Math.round(p / row);
  const span = cs.slice(from, to + 1);
  const kMin = Math.min(...span.map((c) => k(c.l))), kMax = Math.max(...span.map((c) => k(c.h)));
  const vol = new Array(kMax - kMin + 1).fill(0) as number[];
  for (const c of span) {
    const a = k(c.l), b = k(c.h);
    if (a === b || c.h === c.l) { vol[a - kMin] += c.v; continue; }
    for (let j = a; j <= b; j++) {
      const lo = Math.max(c.l, (j - 0.5) * row), hi = Math.min(c.h, (j + 0.5) * row);
      if (hi > lo) vol[j - kMin] += (c.v * (hi - lo)) / (c.h - c.l);
    }
  }
  const total = vol.reduce((s, x) => s + x, 0);
  let poc = 0;
  vol.forEach((x, i) => { if (x > vol[poc]) poc = i; });
  let lo = poc, hi = poc, sum = vol[poc];
  while (sum < VA_SHARE * total - 1e-9 && (lo > 0 || hi < vol.length - 1)) {
    const up = hi < vol.length - 1 ? vol[hi + 1] : -1, dn = lo > 0 ? vol[lo - 1] : -1;
    if (up >= dn) { hi++; sum += up; } else { lo--; sum += dn; }
  }
  const price = (i: number) => r9((i + kMin) * row);
  // Sommets (HVN) et creux (LVN) du profil (le volume de chaque bougie, réparti sur son étendue, lisse déjà le profil)
  const sm = vol;
  const top = Math.max(...sm);
  const peaks: number[] = [];
  for (let i = 0; i < sm.length; i++) {
    if (sm[i] < NODE_MIN * top) continue;
    if ((i === 0 || sm[i] > sm[i - 1]) && (i === sm.length - 1 || sm[i] >= sm[i + 1])) peaks.push(i);
  }
  // deux sommets sans vrai creux entre eux (profil lissé jamais sous 80 % du plus petit) : un seul nœud (le plus haut)
  const nodes: number[] = [];
  for (const i of peaks) {
    const prev = nodes[nodes.length - 1];
    if (prev !== undefined && Math.min(...sm.slice(prev, i + 1)) > NODE_GAP * Math.min(sm[prev], sm[i])) { if (sm[i] > sm[prev]) nodes[nodes.length - 1] = i; continue; }
    nodes.push(i);
  }
  // LVN : rangées sous 35 % du POC entre deux nœuds
  const lvn: { lo: number; hi: number }[] = [];
  for (let n = 1; n < nodes.length; n++) {
    const low = [...Array(nodes[n] - nodes[n - 1] - 1).keys()].map((q) => q + nodes[n - 1] + 1).filter((i) => vol[i] < LVN_MAX * vol[poc]);
    if (low.length) lvn.push({ lo: price(Math.min(...low)), hi: price(Math.max(...low)) });
  }
  // HVN : nœuds d'au moins 40 % du sommet du profil lissé, hors du nœud du POC (nommé à part), à leur rangée la plus chargée
  const pocNode = nodes.reduce((b, i) => (Math.abs(i - poc) < Math.abs(b - poc) ? i : b), nodes[0] ?? poc);
  const hvn = nodes.filter((i) => i !== pocNode && sm[i] >= HVN_MIN * top).map(price);
  return {
    row, total,
    rows: vol.map((v, i) => ({ p: price(i), v })),
    poc: price(poc), vah: price(hi), val: price(lo), vaShare: sum / total,
    hvn, lvn,
  };
}

/** Prix typique d'une bougie */
export const typical = (c: Candle) => (c.h + c.l + c.c) / 3;

/** VWAP depuis la bougie `anchor` (null avant) : Σ(prix typique × volume) ÷ Σ volume. */
export function vwap(cs: VCandle[], anchor = 0): (number | null)[] {
  let pv = 0, v = 0;
  return cs.map((c, i) => {
    if (i < anchor) return null;
    pv += typical(c) * c.v;
    v += c.v;
    return v ? pv / v : null;
  });
}

/** CVD : somme des deltas depuis la première bougie. */
export function cvd(cs: VCandle[]): number[] {
  let s = 0;
  return cs.map((c) => (s += c.d ?? 0));
}

/** Delta d'une liste de niveaux de footprint (volume à l'Ask − volume au Bid). */
export const deltaOf = (rows: { bid: number; ask: number }[]) => rows.reduce((s, r) => s + r.ask - r.bid, 0);
