// Découpage en mots commun à la règle d'orthographe et à sa mise à jour.
export const WORD = /\p{L}[\p{L}'’-]*\p{L}|\p{L}/gu;
const ELISION = /^(?:l|d|j|m|n|s|t|c|qu|jusqu|lorsqu|puisqu|quoiqu)'(.+)$/i;

/** Mots d'un texte, normalisés (apostrophe droite), hors sigles et mots avec chiffres */
export function wordsOf(text: string): string[] {
  const out: string[] = [];
  for (const m of text.matchAll(WORD)) {
    const w = m[0].replace(/’/g, "'");
    if (w.length < 2 || /^[A-Z0-9]{2,}$/.test(w) || /\d/.test(w)) continue;
    out.push(w);
  }
  return out;
}

/** Un mot est accepté s'il est connu tel quel, sans élision (l', d'…), ou si chaque partie d'un mot composé l'est */
export function accepted(w: string, known: (x: string) => boolean): boolean {
  if (known(w) || known(w.toLowerCase())) return true;
  const e = w.match(ELISION);
  if (e && accepted(e[1], known)) return true;
  if (w.includes("-")) return w.split("-").every((p) => !p || accepted(p, known));
  return false;
}
