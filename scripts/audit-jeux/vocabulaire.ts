// Vocabulaire de référence (lib/vocabulary/trading-terms.json) : aucune forme
// interdite dans les textes affichés FR / ES du site (leçons Trading, Macro,
// Stratégies, home, hub, pages et modules des jeux, schémas, dictionnaires).
// Usage : npx vite-node scripts/audit-jeux/vocabulaire.ts (lancé par run.mjs).
//
// Langue de chaque texte : celle de l'extracteur (content-texts.ts). Texte de
// langue inconnue : signalé seulement si la forme est interdite en FR ET en ES.
import fs from "node:fs";
import path from "node:path";
import { collectContentTexts } from "./content-texts";

type Lang = "fr" | "es";
interface Term { notion: string; retenu: string; interdit: string[]; casse?: boolean; decision?: string; sources: { url: string }[] }
const REF = path.join(__dirname, "..", "..", "lib", "vocabulary", "trading-terms.json");
const ref = JSON.parse(fs.readFileSync(REF, "utf8")) as { termes: Record<Lang, Term[]> };

let errors = 0;
const lines: string[] = [];
const fail = (m: string) => { errors++; if (errors <= 40) lines.push(`  ERREUR ${m}`); };

// Contrôle du fichier lui-même : au moins 3 sources par terme retenu, sauf décision du PO (champ « decision »)
const rules: Record<Lang, { re: RegExp; t: Term }[]> = { fr: [], es: [] };
for (const lang of ["fr", "es"] as Lang[]) for (const t of ref.termes[lang]) {
  if (t.sources.length < 3 && !t.decision) fail(`${lang} « ${t.retenu} » : ${t.sources.length} source(s), 3 au minimum`);
  for (const src of t.interdit) rules[lang].push({ re: new RegExp(`(?<![\\p{L}\\d])(?:${src})(?![\\p{L}\\d])`, t.casse ? "u" : "iu"), t });
}

const texts = collectContentTexts();
const hit = (lang: Lang, text: string) => rules[lang].map((r) => ({ r, m: text.match(r.re) })).find((x) => x.m);
for (const t of texts) {
  if (t.lang === "fr" || t.lang === "es") {
    const h = hit(t.lang, t.text);
    if (h) fail(`${t.lang} « ${h.m![0]} » → « ${h.r.t.retenu} » (${t.file}:${t.line}) : ${t.text.slice(0, 90)}`);
  } else {
    const fr = hit("fr", t.text), es = hit("es", t.text);
    if (fr && es) fail(`? « ${fr.m![0]} » → « ${fr.r.t.retenu} » / « ${es.r.t.retenu} » (${t.file}:${t.line}) : ${t.text.slice(0, 90)}`);
  }
}

lines.push(`Textes contrôlés : ${texts.length} ; termes de référence : ${ref.termes.fr.length} FR, ${ref.termes.es.length} ES`);
console.log(lines.join("\n"));
console.log(`RESULTAT erreurs=${errors} avertissements=0`);
