// Données du schéma de l'aperçu de leçon (Order Block) : bougies continues,
// construites à partir des seules clôtures (chaque bougie ouvre à la clôture de
// la précédente). Module sans dépendance Next : lu aussi par l'audit des bougies.

export type PreviewCandle = { o: number; h: number; l: number; c: number };

const START = 50;
// [clôture, mèche haute au-delà du corps, mèche basse au-delà du corps]
const STEPS: [number, number, number][] = [
  [48.6, 0.4, 0.4], [49.6, 0.4, 0.3], [48.4, 0.3, 0.3],            // consolidation
  [46.9, 0.2, 0.4],                                                 // Order Block : dernière bougie baissière
  [50.2, 0.3, 0.2], [53.6, 0.4, 0.2], [56.8, 0.5, 0.2], [56.0, 0.6, 0.3], [58.2, 0.4, 0.2], // expansion
  [56.4, 0.3, 0.3], [53.5, 0.2, 0.3], [50.4, 0.2, 0.3],            // retour vers la zone
  [48.3, 0.2, 0.7],                                                 // mitigation : entre dans la zone
  [51.2, 0.3, 0.3], [54.4, 0.4, 0.2], [57.5, 0.4, 0.2], [57.0, 0.6, 0.3], [59.6, 0.4, 0.2], // réaction
];

export const LESSON_PREVIEW_CANDLES: PreviewCandle[] = STEPS.reduce<PreviewCandle[]>((acc, [c, up, down]) => {
  const o = acc.length ? acc[acc.length - 1].c : START;
  acc.push({ o, c, h: Math.max(o, c) + up, l: Math.min(o, c) - down });
  return acc;
}, []);

/** Index des bougies remarquables */
export const LESSON_PREVIEW_OB = 3;
export const LESSON_PREVIEW_MITIGATION = 12;
/** Étiquette RÉACTION centrée sur la reprise, sous le sommet final */
export const LESSON_PREVIEW_REACTION = 14;
