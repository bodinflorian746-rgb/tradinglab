// Génération de codes d'accès. Source unique réutilisée par la page admin
// (génération en lot) ET par le signup grand public (code trial auto).
// Format TSX-XXXX-XXXX, alphabet sans caractères ambigus (pas de I, O, 0, 1).

import { randomInt } from "node:crypto";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomSegment(len: number): string {
  let out = "";
  for (let i = 0; i < len; i++) {
    out += ALPHABET[randomInt(ALPHABET.length)];
  }
  return out;
}

/** Format TSX-XXXX-XXXX (8 chars aléatoires, ~10^12 combinaisons). */
export function generateCode(): string {
  return `TSX-${randomSegment(4)}-${randomSegment(4)}`;
}
