// Géométrie du corps d'une bougie à l'écran (GameChartV2, MiniChart, aperçus).
//
// Règle : chaque bougie ouvre à la clôture de la précédente, à l'écran comme dans
// les données. Le corps est donc dessiné exactement entre ouverture et clôture.
// Un corps trop fin pour être vu (doji) devient une barre de MIN_BODY_PX centrée
// sur le corps : chacun de ses bords reste à 1 px au plus de son prix, et sa
// couleur suit le sens de la clôture. L'ancien corps minimal de 3 px, prolongé
// vers le bas, décalait jusqu'à 3 px l'ouverture ou la clôture des petites bougies
// (une petite rouge semblait clôturer plus bas que le prix réel, la bougie
// suivante paraissait alors ouvrir au-dessus d'elle).

export const MIN_BODY_PX = 2;

export function candleBody(o: number, c: number, toY: (price: number) => number): { y: number; h: number } {
  const yo = toY(o);
  const yc = toY(c);
  const top = Math.min(yo, yc);
  const bottom = Math.max(yo, yc);
  if (bottom - top >= MIN_BODY_PX) return { y: top, h: bottom - top };
  const mid = (top + bottom) / 2;
  return { y: mid - MIN_BODY_PX / 2, h: MIN_BODY_PX };
}
