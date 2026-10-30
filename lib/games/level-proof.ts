// Niveaux lisibles (règle PO, 2026-10-30) : un support ou une résistance des jeux se prouve par des
// touches nettes, pas par des mèches perdues dans des bougies désordonnées. Même lecture que la preuve
// des leçons (scripts/audit-lecons/sr-proof.mjs : le prix arrive d'un côté, vient au contact, repart du
// même côté ; deux touches, ou une cassure puis un retest), plus stricte sur la touche :
//  - contact court : au plus 4 bougies au niveau (arrivée, touche, réaction ; une de plus au plus) ;
//  - départ franc : dans les 4 bougies qui suivent, le prix s'éloigne du bord du niveau d'au moins
//    0,8 bougie médiane.
// Les constructeurs des jeux tirent un autre graphique quand un niveau tracé n'est pas lisible ;
// l'audit scripts/audit-jeux/sr.ts le vérifie sur 500 manches par scénario.
import type { Candle, ChartZone } from "./shared";

export const SR_LABEL = /\b(support|r[ée]sistance)/i;
export const MAX_CONTACT = 4;
export const MIN_DEPARTURE = 0.8;

const med = (a: number[]) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)] || 0;

/** Touches nettes d'un niveau [lo, hi], touches confuses (contact trop long ou départ trop court), cassures */
export function cleanTouches(cs: Candle[], lo: number, hi: number, from = 0, to = cs.length - 1, departure = MIN_DEPARTURE) {
  const a = Math.max(0, from), b = Math.min(cs.length - 1, to);
  const mr = med(cs.map((k) => k.h - k.l)) || med(cs.slice(1).map((k, i) => Math.abs(k.c - cs[i].c)));
  const tol = 0.25 * mr;
  let last: "above" | "below" | null = null, start = -1, touches = 0, breaks = 0, retest = false, messy = 0;
  for (let i = a; i <= b; i++) {
    const k = cs[i];
    const above = k.l > hi + tol, below = k.h < lo - tol;
    if (above || below) {
      const side = above ? "above" : "below";
      if (start >= 0 && last === side) {
        const ahead = cs.slice(i, Math.min(b + 1, i + 4));
        const away = side === "above" ? Math.max(...ahead.map((x) => x.h)) - hi : lo - Math.min(...ahead.map((x) => x.l));
        if (i - start <= MAX_CONTACT && away >= departure * mr) { touches++; if (breaks) retest = true; } else messy++;
      } else if (last && last !== side) breaks++;
      start = -1; last = side;
    } else if (last && start < 0) start = i;
  }
  return { touches, breaks, retest, messy };
}

/** Message d'erreur si le niveau n'est pas prouvé par des touches nettes (2, ou cassure puis retest net), sinon null */
export function cleanProofError(cs: Candle[], lo: number, hi: number, from?: number, to?: number): string | null {
  const { touches, breaks, retest, messy } = cleanTouches(cs, lo, hi, from, to);
  if (touches >= 2 || retest) return null;
  const confuse = messy ? ` (${messy} touche${messy > 1 ? "s" : ""} confuse${messy > 1 ? "s" : ""} : plus de ${MAX_CONTACT} bougies au niveau, ou départ de moins de ${String(MIN_DEPARTURE).replace(".", ",")} bougie)` : "";
  return `${touches} touche${touches > 1 ? "s" : ""} nette${touches > 1 ? "s" : ""}${confuse}${breaks ? ", breakout sans retest net" : ""} (au moins 2 touches nettes, ou un breakout suivi d'un retest net)`;
}

/** Tous les supports et résistances tracés sont prouvés par des touches nettes avant la question (les constructeurs
 *  gardent une marge sur le départ : les prix d'actif, arrondis, ne font pas basculer une touche limite) */
export function levelsReadable(past: Candle[], zones: ChartZone[]): boolean {
  return zones.every((z) => {
    if (!z.label || !SR_LABEL.test(z.label)) return true;
    const t = cleanTouches(past, Math.min(z.y1, z.y2), Math.max(z.y1, z.y2), 0, past.length - 1, MIN_DEPARTURE + 0.1);
    return t.touches >= 2 || t.retest;
  });
}
