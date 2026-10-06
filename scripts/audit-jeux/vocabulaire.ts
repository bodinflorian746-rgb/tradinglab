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
import { auditee } from "./langues";

type Lang = "fr" | "es";
interface Term { notion: string; retenu: string; interdit: string[]; casse?: boolean; decision?: string; sources: { url: string }[] }
const REF = path.join(__dirname, "..", "..", "lib", "vocabulary", "trading-terms.json");
const ref = JSON.parse(fs.readFileSync(REF, "utf8")) as { termes: Record<Lang, Term[]> };

let errors = 0;
const lines: string[] = [];
const fail = (m: string) => { errors++; if (errors <= 40) lines.push(`  ERREUR ${m}`); };

// Contrôle du fichier lui-même : au moins 3 sources par terme retenu, sauf décision du PO (champ « decision »)
const rules: Record<Lang, { re: RegExp; t: Term }[]> = { fr: [], es: [] };
for (const lang of (["fr", "es"] as Lang[]).filter(auditee)) for (const t of ref.termes[lang]) {
  if (t.sources.length < 3 && !t.decision) fail(`${lang} « ${t.retenu} » : ${t.sources.length} source(s), 3 au minimum`);
  for (const src of t.interdit) rules[lang].push({ re: new RegExp(`(?<![\\p{L}\\d])(?:${src})(?![\\p{L}\\d])`, t.casse ? "u" : "iu"), t });
}

// Langues actives seulement (texte de langue inconnue : contrôlé avec les langues actives)
const texts = collectContentTexts().filter((t) => auditee(t.lang));
const hit = (lang: Lang, text: string) => rules[lang].map((r) => ({ r, m: text.match(r.re) })).find((x) => x.m);
for (const t of texts) {
  if (t.lang === "fr" || t.lang === "es") {
    const h = hit(t.lang, t.text);
    if (h) fail(`${t.lang} « ${h.m![0]} » → « ${h.r.t.retenu} » (${t.file}:${t.line}) : ${t.text.slice(0, 90)}`);
  } else {
    const fr = auditee("fr") ? hit("fr", t.text) : undefined, es = auditee("es") ? hit("es", t.text) : undefined;
    if ((fr || !auditee("fr")) && (es || !auditee("es")) && (fr || es)) fail(`? « ${(fr ?? es)!.m![0]} » → ${[fr, es].filter((x) => x).map((x) => `« ${x!.r.t.retenu} »`).join(" / ")} (${t.file}:${t.line}) : ${t.text.slice(0, 90)}`);
  }
}

lines.push(`Textes contrôlés : ${texts.length} ; termes de référence : ${ref.termes.fr.length} FR, ${ref.termes.es.length} ES`);
console.log(lines.join("\n"));
console.log(`RESULTAT erreurs=${errors} avertissements=0`);
