// Constantes des scénarios des nouvelles leçons utilisées par les schémas (composants client), sans la
// bibliothèque de formes qu'embarque lib/lessons/scenarios-nouvelles.ts.

/** Intermédiaire 12 : nombre de bougies calmes avant la publication de la news (EUR/USD M5). */
export const NEWS_PRE = 8;

/** Avancé 13 : cycle de Wyckoff en courbe (EUR/USD) — baisse, accumulation (8 – 17), markup, distribution
 *  (26 – 35), markdown. */
export const WYCKOFF_CYCLE: number[] = [
  1.1, 1.0975, 1.095, 1.0925, 1.09, 1.087, 1.084, 1.081,
  1.0825, 1.0805, 1.0835, 1.0815, 1.0845, 1.0812, 1.0838, 1.082, 1.085, 1.0835,
  1.087, 1.0895, 1.092, 1.0945, 1.097, 1.0995, 1.102, 1.1045,
  1.1025, 1.105, 1.1015, 1.1045, 1.101, 1.104, 1.1005, 1.1035, 1.1, 1.102,
  1.0985, 1.096, 1.0935, 1.091, 1.0885, 1.086, 1.0835, 1.081,
];
