// Audit des textes affichés en français et en espagnol (leçons Trading, Macro,
// Stratégies, home, hub et pages des jeux, modules des jeux, schémas,
// dictionnaires FR / ES). Usage : npx vite-node scripts/audit-jeux/orthographe.ts
// (lancé par run.mjs). Aucune dépendance.
//
// 1. Termes interdits partout (lib/games/glossary.ts, FORBIDDEN) : zone
//    d'offre / de demande / de supply / de demand et leurs variantes (« support »
//    et « résistance »), précédent low / high (« plus bas / plus haut précédent »).
//    Exceptions : noms Wyckoff complets (trading-terms.json, « exceptions »).
//    --autotest : « supply » seul et « zone d'offre » toujours refusés, noms Wyckoff admis.
// 2. Orthographe : chaque mot appartient au vocabulaire validé
//    (orthographe/vocabulaire.txt, établi avec Hunspell FR / ES / EN et la liste
//    relue orthographe/autorises.txt ; mise à jour : orthographe-maj.ts).
// 3. Typographie espagnole : pas d'espace avant « : ; ! ? ».
import fs from "node:fs";
import path from "node:path";
import { FORBIDDEN } from "../../lib/games/glossary";
import { collectContentTexts } from "./content-texts";
import { accepted, wordsOf } from "./orthographe-mots";
import { auditee } from "./langues";
import { EXCEPTIONS, interditHors } from "./exceptions";

const DIR = path.join(__dirname, "orthographe");
const vocab = new Set(fs.readFileSync(path.join(DIR, "vocabulaire.txt"), "utf8").split(/\r?\n/).filter(Boolean));
const known = (w: string) => vocab.has(w.toLowerCase());

let errors = 0;
const lines: string[] = [];
const fail = (m: string) => { errors++; if (errors <= 40) lines.push(`  ERREUR ${m}`); };
const forbiddenIn = (lang: string, text: string) => {
  const rules = lang === "fr" ? FORBIDDEN.fr : lang === "es" ? FORBIDDEN.es : [...(auditee("fr") ? FORBIDDEN.fr : []), ...(auditee("es") ? FORBIDDEN.es : [])];
  for (const r of rules) { const m = interditHors(lang, text, r.from); if (m) return { m, to: r.to }; }
  return null;
};

if (process.argv.includes("--autotest")) {
  // Défauts injectés : chacun doit être détecté ; témoins : les noms Wyckoff complets passent
  const cases = [
    "Le prix revient sur une zone d'offre.",
    "Le Supply arrive après le sommet.",
    "PSY (preliminary supply) : premiers signes d'une offre importante.",
    "Le prix teste la supply zone au-dessus du range.",
    "Last Point of Supply zone : le prix rebondit.",
  ];
  for (const text of cases) {
    const f = forbiddenIn("fr", text);
    lines.push(`${f ? "détecté" : "MANQUÉ "}  ${text}${f ? ` (« ${f.m} »)` : ""}`);
    if (!f) errors++;
  }
  const temoins = EXCEPTIONS.map((e) => `${e.terme} : nom Wyckoff expliqué en français.`);
  const fp = temoins.filter((text) => forbiddenIn("fr", text));
  lines.push(`${fp.length ? `FAUX POSITIF ${fp.join(" | ")}` : "aucun faux positif"}  témoins (${EXCEPTIONS.map((e) => e.terme).join(", ")})`);
  if (fp.length) errors++;
  console.log(lines.join("\n"));
  console.log(`RESULTAT erreurs=${errors} avertissements=0`);
  process.exit(0);
}

// Langues actives seulement (texte de langue inconnue : contrôlé avec les langues actives)
const texts = collectContentTexts().filter((t) => auditee(t.lang));
const files = new Set<string>();
let words = 0;
const unknown = new Map<string, string>();
for (const t of texts) {
  files.add(t.file);
  // 1. Termes interdits (langue détectée ; inconnue : les deux listes)
  const f = forbiddenIn(t.lang, t.text);
  if (f) fail(`terme interdit « ${f.m} » → « ${f.to} » (${t.file}:${t.line}) : ${t.text.slice(0, 80)}`);
  // 2. Orthographe
  for (const w of wordsOf(t.text)) {
    words++;
    if (!accepted(w, known) && !unknown.has(w)) unknown.set(w, `${t.file}:${t.line}`);
  }
  // 3. Typographie espagnole
  if (t.lang === "es") {
    const m = t.text.match(/\p{L}\)?[   ]+[:;!?](?=\s|$)/u);
    if (m) fail(`typographie ES, espace avant « ${m[0].trim().slice(-1)} » (${t.file}:${t.line}) : ${t.text.slice(0, 80)}`);
  }
}
for (const [w, at] of unknown) fail(`mot inconnu « ${w} » (${at}) : faute à corriger, ou mot juste à ajouter (orthographe-maj.ts)`);

lines.push(`Textes contrôlés : ${texts.length} (${files.size} fichiers), ${words} mots ; vocabulaire validé : ${vocab.size} mots`);
console.log(lines.join("\n"));
console.log(`RESULTAT erreurs=${errors} avertissements=0`);
