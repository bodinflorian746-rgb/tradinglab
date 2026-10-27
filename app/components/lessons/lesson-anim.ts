// Animation des graphiques de leçons (LessonChart) : une séquence par panneau, qui suit l'ordre de ce
// que raconte la leçon. Bougies révélées une par une, puis la zone ou le niveau qui s'allume, puis son
// étiquette. Opacité seulement : aucune position ne bouge, aucun décalage de la page.
// - démarre quand le graphique arrive dans l'écran, une seule fois ;
// - désactivée si le visiteur demande moins d'animations (prefers-reduced-motion) ;
// - interrupteur pour les audits et visual:check, qui mesurent l'état final :
//   localStorage « tsx-lc-anim » = « off » (ou attribut data-lc-anim="off" sur <html>).
// Éléments que la séquence ne nomme pas : affichés à la fin.
"use client";

import { useEffect, useRef, useState } from "react";

/** Étape d'une séquence : bougies jusqu'à un indice (incluses, une par une), éléments allumés (clés de
 *  zones, niveaux, segments, repères ; « @clé » : l'étiquette seule, plus tard que son élément, quand
 *  elle donne la conclusion), ou pause. */
export type LCStep = { candles: number } | { show: string | string[] } | { pause: number };

/** Délai entre deux bougies révélées */
export const CANDLE_MS = 85;
/** Durée d'apparition d'un élément ; son étiquette suit après LABEL_LAG */
export const FADE_MS = 380;
export const LABEL_LAG = 260;
/** Temps laissé à un élément allumé avant l'étape suivante */
export const SHOW_MS = 720;

export interface AnimPlan {
  candle: (i: number) => number;
  /** Délai d'un élément (clé) */
  item: (key: string) => number;
  /** Délai de son étiquette : « @clé » si la séquence la nomme, sinon l'élément + LABEL_LAG */
  label: (key: string) => number;
  end: number;
}

/** Délais de chaque bougie et de chaque élément, à partir de la séquence (indices d'origine). */
export function planOf(steps: LCStep[], nCandles: number): AnimPlan {
  const candleAt: number[] = [];
  const itemAt = new Map<string, number>();
  let t = 0, next = 0;
  for (const s of steps) {
    if ("candles" in s) {
      for (let i = next; i <= Math.min(s.candles, nCandles - 1); i++) { candleAt[i] = t; t += CANDLE_MS; }
      next = Math.max(next, s.candles + 1);
      t += 120;
    } else if ("show" in s) {
      for (const k of Array.isArray(s.show) ? s.show : [s.show]) if (!itemAt.has(k)) itemAt.set(k, t);
      t += SHOW_MS;
    } else t += s.pause;
  }
  // Bougies restantes, puis éléments non nommés : à la fin
  for (let i = next; i < nCandles; i++) { candleAt[i] = t; t += CANDLE_MS; }
  const end = t;
  const item = (k: string) => itemAt.get(k) ?? end;
  return { candle: (i) => candleAt[i] ?? end, item, label: (k) => itemAt.get(`@${k}`) ?? item(k) + LABEL_LAG, end };
}

/** Animation permise ici (navigateur, mouvement non réduit, interrupteur non coupé) */
export function animAllowed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (document.documentElement.dataset.lcAnim === "off") return false;
    if (window.localStorage.getItem("tsx-lc-anim") === "off") return false;
  } catch { /* stockage indisponible : animation permise */ }
  return !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

/**
 * État d'un panneau animé : `armed` (éléments masqués, en attente), `playing` (séquence lancée, une
 * seule fois, quand le cadre est au moins au tiers dans l'écran). Sans séquence ou animation refusée :
 * rien n'est masqué.
 */
export function usePlayOnce<T extends Element>(enabled: boolean) {
  const ref = useRef<T | null>(null);
  const [armed] = useState(() => enabled && animAllowed());
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!armed || playing || !ref.current) return;
    const io = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting)) { setPlaying(true); io.disconnect(); }
    }, { threshold: 0.35 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [armed, playing]);
  return { ref, armed, playing };
}
