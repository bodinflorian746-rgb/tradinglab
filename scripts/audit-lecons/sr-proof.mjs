// Preuve d'un support / d'une résistance (règle PO, leçons et jeux) : un niveau n'existe
// que si le graphique le montre touché au moins deux fois, ou cassé puis retesté.
//
// Une touche = le prix arrive d'un côté du niveau (bougie entièrement au-dessus ou
// au-dessous, à une tolérance près), vient au contact, puis REPART DU MÊME CÔTÉ.
// Un prix qui traverse (arrive d'un côté, ressort de l'autre) ne touche pas : c'est une
// cassure. Touches des deux côtés additionnées : un ancien support touché, cassé puis
// retesté par-dessous compte 2. Un contact en cours (dernière bougie au niveau, sans
// réaction encore) ne compte pas.
//
// Fonction autonome (aucune variable extérieure) : l'audit DOM la passe telle quelle
// au navigateur (toString).
export function srTouches(cs, lo, hi, from = 0, to = cs.length - 1) {
  const a = Math.max(0, from), b = Math.min(cs.length - 1, to);
  // Tolérance : un quart de l'amplitude médiane des bougies ; sur une courbe (bougies
  // sans amplitude), un quart du pas médian entre deux points
  const med = (a) => a.sort((x, y) => x - y)[Math.floor(a.length / 2)] || 0;
  const tol = 0.25 * (med(cs.map((k) => k.h - k.l)) || med(cs.slice(1).map((k, i) => Math.abs(k.c - cs[i].c))));
  let last = null, contact = false, touches = 0, breaks = 0, retest = false;
  for (let i = a; i <= b; i++) {
    const k = cs[i];
    const above = k.l > hi + tol, below = k.h < lo - tol;
    if (above || below) {
      const side = above ? "above" : "below";
      if (contact && last === side) { touches++; if (breaks) retest = true; }
      else if (last && last !== side) breaks++;
      contact = false; last = side;
    } else if (last) contact = true;
  }
  return { touches, breaks, retest, tol };
}

/** Message d'erreur si le niveau n'est pas prouvé (2 touches, ou cassure puis retest avec réaction), sinon null. */
export function srProofError(cs, lo, hi, from, to) {
  const { touches, breaks, retest } = srTouches(cs, lo, hi, from, to);
  if (touches >= 2 || retest) return null;
  return `${touches} touche visible${breaks ? ", cassure sans retest" : ""} (au moins 2 touches, ou une cassure suivie d'un retest avec réaction)`;
}
