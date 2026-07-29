// Génération des codes de points du programme de fidélité.
// Réutilise le générateur de segments existant (lib/access-codes.ts) — même
// alphabet sans caractères ambigus (pas de I, O, 0, 1).
//
// Format PTS-XXXX-XXXX. Le préfixe distinct de access_codes (TSX-) garantit
// qu'un code de points ne peut jamais entrer en collision avec un code d'accès,
// d'autant que les deux vivent dans des tables séparées avec chacune leur
// contrainte d'unicité.

import { randomSegment } from "@/lib/access-codes";

/** Format PTS-XXXX-XXXX (8 chars aléatoires, ~10^12 combinaisons). */
export function generatePointsCode(): string {
  return `PTS-${randomSegment(4)}-${randomSegment(4)}`;
}
