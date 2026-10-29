// Exceptions du vocabulaire (lib/vocabulary/trading-terms.json, « exceptions ») :
// noms propres Wyckoff admis en entier (Preliminary Supply, Last Point of Supply).
// Une forme interdite n'est admise que si elle tient tout entière dans une de ces
// expressions : « supply » seul, « supply zone » ou « zone d'offre » restent refusés.
import fs from "node:fs";
import path from "node:path";

interface Exception { terme: string; motif: string; decision: string }
const REF = path.join(__dirname, "..", "..", "lib", "vocabulary", "trading-terms.json");
export const EXCEPTIONS = (JSON.parse(fs.readFileSync(REF, "utf8")) as { exceptions: { fr: Exception[] } }).exceptions.fr;

// Casse respectée : « preliminary supply » en minuscules n'est pas le nom Wyckoff
const RE = new RegExp(`(?<![\\p{L}\\d])(?:${EXCEPTIONS.map((e) => e.motif).join("|")})(?![\\p{L}\\d])`, "gu");

/** Première forme interdite (motif `re`) hors des expressions admises, ou null. */
export function interditHors(lang: string | undefined, text: string, re: RegExp): string | null {
  const spans = lang === "es" ? [] : [...text.matchAll(RE)].map((m) => [m.index!, m.index! + m[0].length]);
  for (const m of text.matchAll(new RegExp(re.source, re.flags.includes("g") ? re.flags : `${re.flags}g`))) {
    const a = m.index!, b = a + m[0].length;
    if (!spans.some(([x, y]) => a >= x && b <= y)) return m[0];
  }
  return null;
}
