// Audit des textes affichés en français et en espagnol (leçons Trading, Macro,
// Stratégies, home, hub et pages des jeux, modules des jeux, schémas,
// dictionnaires FR / ES). Usage : npx vite-node scripts/audit-jeux/orthographe.ts
// (lancé par run.mjs). Aucune dépendance.
//
// 1. Termes interdits partout (lib/games/glossary.ts, FORBIDDEN) : zone
//    d'offre / de demande / de supply / de demand et leurs variantes (« support »
//    et « résistance »), précédent low / high (« plus bas / plus haut précédent »).
// 2. Orthographe : chaque mot appartient au vocabulaire validé
//    (orthographe/vocabulaire.txt, établi avec Hunspell FR / ES / EN et la liste
//    relue orthographe/autorises.txt ; mise à jour : orthographe-maj.ts).
// 3. Typographie espagnole : pas d'espace avant « : ; ! ? ».
import fs from "node:fs";
import path from "node:path";
import { FORBIDDEN } from "../../lib/games/glossary";
import { collectContentTexts } from "./content-texts";
import { accepted, wordsOf } from "./orthographe-mots";

const DIR = path.join(__dirname, "orthographe");
const vocab = new Set(fs.readFileSync(path.join(DIR, "vocabulaire.txt"), "utf8").split(/\r?\n/).filter(Boolean));
const known = (w: string) => vocab.has(w.toLowerCase());

let errors = 0;
const lines: string[] = [];
const fail = (m: string) => { errors++; if (errors <= 40) lines.push(`  ERREUR ${m}`); };

const texts = collectContentTexts();
const files = new Set<string>();
let words = 0;
const unknown = new Map<string, string>();
for (const t of texts) {
  files.add(t.file);
  // 1. Termes interdits (langue détectée ; inconnue : les deux listes)
  const rules = t.lang === "fr" ? FORBIDDEN.fr : t.lang === "es" ? FORBIDDEN.es : [...FORBIDDEN.fr, ...FORBIDDEN.es];
  for (const r of rules) {
    const m = t.text.match(r.from);
    if (m) fail(`terme interdit « ${m[0]} » → « ${r.to} » (${t.file}:${t.line}) : ${t.text.slice(0, 80)}`);
  }
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
