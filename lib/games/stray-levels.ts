// Niveaux fortuits : deux sommets (ou deux creux) du passé que le hasard des bougies aligne,
// séparés par une vraie réaction, forment un niveau qu'un trader verrait (souvent la borne
// d'un range), alors que le scénario ne le trace ni ne le cite. Règle PO : tout niveau visible
// est tracé, nommé et prouvé. Les niveaux du scénario sont tracés par les générateurs ; cette
// passe finale casse seulement les alignements fortuits, en raccourcissant (ou, à défaut, en
// allongeant) de 0,4 à 0,7 bougie médiane la mèche d'un des deux pivots. Rien ne bouge à
// proximité d'une zone tracée, et aucune mèche ne franchit un stop.
// Contrôle indépendant : scripts/audit-jeux/niveaux-visibles.ts.

import type { Candle, ChartZone } from "./shared";

const median = (a: number[]) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)] || 0; };

/** Touches d'un niveau (même définition que scripts/audit-lecons/sr-proof.mjs). */
function touches(cs: Candle[], lo: number, hi: number, tol: number): { touches: number; retest: boolean } {
  let last: "above" | "below" | null = null, contact = false, n = 0, breaks = 0, retest = false;
  for (const k of cs) {
    const above = k.l > hi + tol, below = k.h < lo - tol;
    if (above || below) {
      const side = above ? "above" : "below";
      if (contact && last === side) { n++; if (breaks) retest = true; }
      else if (last && last !== side) breaks++;
      contact = false; last = side;
    } else if (last) contact = true;
  }
  return { touches: n, retest };
}

interface Stray { side: "haut" | "bas"; i: number; j: number; y: number }

function strays(past: Candle[], covered: (y: number) => boolean, mr: number): Stray[] {
  const tol = 0.25 * mr;
  // Alignement jugé avec une marge : la bougie médiane bouge un peu quand une mèche change
  const align = 1.25 * tol;
  const out: Stray[] = [];
  for (const side of ["haut", "bas"] as const) {
    const val = (i: number) => (side === "haut" ? past[i].h : past[i].l);
    const ps: number[] = [];
    for (let i = 1; i < past.length; i++) {
      let ok = true;
      for (let j = Math.max(0, i - 2); j <= Math.min(past.length - 1, i + 2); j++) {
        if (j !== i && (side === "haut" ? val(j) > val(i) : val(j) < val(i))) { ok = false; break; }
      }
      if (ok) ps.push(i);
    }
    for (let a = 0; a < ps.length; a++) for (let b = a + 1; b < ps.length; b++) {
      const i = ps[a], j = ps[b];
      if (j - i < 3 || Math.abs(val(i) - val(j)) > align) continue;
      const between = past.slice(i + 1, j);
      const away = side === "haut" ? Math.max(val(i), val(j)) - Math.min(...between.map((k) => k.l)) : Math.max(...between.map((k) => k.h)) - Math.min(val(i), val(j));
      if (away < mr) continue;
      const y = (val(i) + val(j)) / 2;
      const t = touches(past, y - tol, y + tol, tol);
      if (t.touches < 2 && !t.retest) continue;
      if (past.slice(j + 1).some((k) => (side === "haut" ? k.c > y + tol : k.c < y - tol)) && !t.retest) continue;
      // Un des deux pivots posé sur une zone tracée : l'alignement appartient à ce niveau
      if (covered(y) || covered(val(i)) || covered(val(j))) continue;
      out.push({ side, i, j, y });
    }
  }
  return out;
}

/**
 * Casse les alignements fortuits du passé (sommets ou creux alignés sans zone). `lines` : stops
 * du graphique, qu'aucune mèche ne franchit ni ne touche (un stop « sous le plus bas » le reste).
 */
export function breakStrayLevels<T extends { past: Candle[]; zones: ChartZone[] }>(ch: T, lines: number[] = [], opts: { positive?: boolean } = {}): T {
  const past = ch.past.map((k) => ({ ...k }));
  const mr = median(past.map((k) => k.h - k.l));
  if (!mr) return ch;
  const tol = 0.25 * mr;
  const within = (z: ChartZone, y: number, t: number) => Math.min(z.y1, z.y2) - t <= y && y <= Math.max(z.y1, z.y2) + t;
  const inZone = (y: number) => ch.zones.some((z) => within(z, y, tol));
  // Mèche protégée : touche d'un support / d'une résistance (preuve), ou pointe posée sur une zone (swing tracé)
  const SR = /support|r[ée]sistance/i;
  const pinned = (y: number) => ch.zones.some((z) => within(z, y, SR.test(z.label) ? tol : 0.1 * mr));
  // Un stop n'est pas un niveau nommé : il ne couvre rien, mais aucune mèche ne le franchit
  // ni ne vient s'y poser
  const blocked = (from: number, to: number) => inZone(to)
    || lines.some((l) => Math.abs(l - to) <= 0.1 * mr || (Math.min(from, to) < l && l < Math.max(from, to)));
  const SHIFT = 0.4 * mr;
  // Graphique aux prix positifs (opts.positive) : une mèche allongée ne passe jamais sous zéro
  // (le cadre s'élargit au besoin, en fin de passe)
  const floor = opts.positive ? 0 : -Infinity, ceil = Infinity;
  // Une bougie déplacée ne repart jamais dans l'autre sens (pas d'aller-retour entre deux alignements)
  const dirOf = new Map<number, number>();
  for (let pass = 0; pass < 20; pass++) {
    // Bougie médiane recalculée à chaque passe (une mèche modifiée la déplace un peu)
    const s = strays(past, inZone, median(past.map((k) => k.h - k.l)));
    if (!s.length) break;
    let moved = false;
    // Un alignement par passe, puis nouvelle détection
    for (const { side, i, j } of s.slice(0, 1)) {
      // Le pivot à la plus longue mèche raccourcit ; sinon le plus récent s'allonge
      const wick = (k: Candle) => (side === "haut" ? k.h - Math.max(k.o, k.c) : Math.min(k.o, k.c) - k.l);
      // Une mèche posée sur une zone (touche d'un niveau, swing tracé sur sa pointe) ne bouge jamais
      const v = (x: number) => (side === "haut" ? past[x].h : past[x].l);
      const cand = [i, j].filter((x) => !pinned(v(x))).sort((x, y) => wick(past[y]) - wick(past[x]));
      // Essais : raccourcir (si la mèche le permet) puis allonger, de 0,4 bougie médiane, puis 0,5, puis 0,7
      const tries = cand.flatMap((x) => [SHIFT, 0.5 * mr, 0.7 * mr].flatMap((d) => [-d, d].map((dd) => [x, dd] as const)));
      for (const [x, dd] of tries) {
        const k = past[x];
        // Le déplacement doit vraiment séparer les deux pivots
        if (Math.abs(v(x) + (side === "haut" ? dd : -dd) - v(x === i ? j : i)) <= 1.5 * tol) continue;
        if (dd < 0 && wick(k) < -dd + 0.05 * mr) continue;
        if (dirOf.has(x) && dirOf.get(x) !== Math.sign(dd)) continue;
        const ny = side === "haut" ? k.h + dd : k.l - dd;
        if (blocked(side === "haut" ? k.h : k.l, ny) || ny <= floor || ny >= ceil) continue;
        const old = side === "haut" ? k.h : k.l;
        if (side === "haut") k.h = ny; else k.l = ny;
        // La bougie médiane ne baisse pas : les tailles des zones, mesurées en bougies, restent justes
        if (median(past.map((c) => c.h - c.l)) < 0.98 * mr) { if (side === "haut") k.h = old; else k.l = old; continue; }
        dirOf.set(x, Math.sign(dd));
        moved = true;
        break;
      }
    }
    if (!moved) break;
  }
  const dom = (ch as { domain?: { min: number; max: number } }).domain;
  if (!dom) return { ...ch, past };
  return { ...ch, past, domain: { min: Math.min(dom.min, ...past.map((k) => k.l)), max: Math.max(dom.max, ...past.map((k) => k.h)) } };
}
