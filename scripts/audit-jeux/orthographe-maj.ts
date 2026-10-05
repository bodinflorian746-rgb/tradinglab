// Mise à jour du vocabulaire validé de la règle d'orthographe (hors npm run audit:jeux).
// Usage : npx vite-node scripts/audit-jeux/orthographe-maj.ts
//
// Nécessite les dictionnaires Hunspell, installés localement SANS les enregistrer
// (le lockfile du dépôt n'est pas modifié) :
//   npm install --no-save nspell dictionary-fr dictionary-es dictionary-en
//
// Chaque mot des textes affichés (FR, ES : leçons, home, hub, jeux) est accepté
// s'il est connu de Hunspell (français, espagnol, ou anglais pour le jargon de
// trading) ou s'il figure dans orthographe/autorises.txt (jargon, noms propres,
// abréviations, relus à la main). Les mots acceptés forment
// orthographe/vocabulaire.txt, que la règle d'audit utilise sans dépendance. Les
// mots inconnus sont listés : à corriger dans le texte, ou à ajouter à
// autorises.txt s'ils sont justes.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { collectContentTexts } from "./content-texts";
import { accepted, wordsOf } from "./orthographe-mots";

const require = createRequire(import.meta.url);
const ROOT = path.join(__dirname, "..", "..");
const DIR = path.join(__dirname, "orthographe");
const dict = (name: string) => {
  const d = path.join(ROOT, "node_modules", name);
  return { aff: fs.readFileSync(path.join(d, "index.aff")), dic: fs.readFileSync(path.join(d, "index.dic")) };
};
const nspell = require(path.join(ROOT, "node_modules", "nspell", "lib", "index.js"));
const sp = ["dictionary-fr", "dictionary-es", "dictionary-en"].map((d) => nspell(dict(d)));
const inDict = (w: string) => sp.some((s: { correct: (x: string) => boolean }) => s.correct(w));

const allow = new Set(fs.readFileSync(path.join(DIR, "autorises.txt"), "utf8").split(/\r?\n/).map((l) => l.replace(/#.*/, "").trim().toLowerCase()).filter(Boolean));
const vocab = new Set<string>();
const unknown = new Map<string, string>();
for (const t of collectContentTexts()) for (const w of wordsOf(t.text)) {
  if (accepted(w, inDict) || accepted(w, (x) => allow.has(x.toLowerCase()))) { vocab.add(w.toLowerCase()); continue; }
  if (!unknown.has(w)) unknown.set(w, `${t.file}:${t.line} ${t.text.slice(0, 100)}`);
}
fs.writeFileSync(path.join(DIR, "vocabulaire.txt"), [...vocab].sort((a, b) => a.localeCompare(b, "fr")).join("\n") + "\n");
console.log(`Vocabulaire validé : ${vocab.size} mots ; inconnus : ${unknown.size}`);
for (const [w, at] of unknown) console.log(`  INCONNU « ${w} » ${at}`);
process.exit(unknown.size ? 1 : 0);
