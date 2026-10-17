// Audit permanent des 4 mini-jeux (hors application : jamais importé par le site).
// Usage : npm run audit:jeux              → toutes les règles (serveur de dev requis pour le DOM)
//         npm run audit:jeux -- --sans-dom → règles sur les données seulement
//         npm run audit:jeux -- --dom-args="--jeux=place-stop --langues=fr"
//
// Langues contrôlées : les langues actives du site (i18n/config.ts, ACTIVE_LOCALES).
// Règles « données » (vite-node) :
//   cohérence texte ↔ graphique (4 jeux), contexte de marché et prix (K1),
//   distribution du bon stop ≤ 50 %, R/R des bonnes réponses, réalisme des
//   bougies, énumération des verdicts, textes (français en EN/ES, ton),
//   glossaire (libellés de zones et termes = vocabulaire des leçons),
//   bougies (ouverture = clôture précédente, en données et au rendu ; jeux,
//   aperçus du hub, héros de la home), textes affichés FR / ES des leçons, de la
//   home, du hub et des jeux (termes interdits, orthographe, typographie ES),
//   supports et résistances prouvés (2 touches, ou cassure puis retest avec réaction,
//   visibles avant la réponse ; même règle que les leçons : audit-lecons/sr-proof.mjs),
//   zones (FVG ≤ 25 % de la hauteur du graphique, autres zones ≤ 40 %, libellés du
//   vocabulaire validé ; autotest), R/R affiché de Build the Trade identique sur les
//   4 actifs (plan et réalisé ; autotest), termes de niveau refusés dans tout texte affiché
//   (« Niveau secondaire », « Niveau bas », « Niveau haut », « niveau faible » ; autotest),
//   changement de rôle lisible (support touché seulement par en dessous, résistance seulement
//   par au-dessus : « Ancienne résistance → support »… ; autotest), rotation des scénarios (aucun
//   doublon dans une partie, aucun retour avant que tout le niveau soit passé, pool ≥ manches ; autotest),
//   niveaux visibles tracés (sommets ou creux alignés et prouvés, toujours couverts par une zone ; autotest),
//   même nom partout (un niveau cité dans l'énoncé ou l'explication a sa zone du même nom ; autotest),
//   notions du niveau (lib/games/notions.ts ; autotest), pas de réflexe gagnant (répartition des bonnes
//   réponses ≤ 40 %, joueur triche < 45 %, 200 parties par jeu et par niveau ; autotest).
// Règles « DOM » (Playwright) : troncature langues actives × 390/1440, sonde
//   lignes = étiquettes = boutons, aucune étiquette sur une bougie, zones derrière les
//   bougies, corps ≥ 3 × la mèche, graphique entier dans l'écran du téléphone, cohérence
//   du verdict affiché ; autotest (défauts injectés, chacun doit être détecté).
// Code de sortie 1 dès qu'une règle compte une erreur.
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { languesAuditees } from "./langues-node.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const SANS_DOM = process.argv.includes("--sans-dom");
const DOM_ARGS = (process.argv.find((a) => a.startsWith("--dom-args=")) ?? "--dom-args=").slice("--dom-args=".length).split(" ").filter(Boolean);
const LANGS = languesAuditees();

function run(cmd, args, env = {}) {
  const r = spawnSync(cmd, args, { cwd: ROOT, env: { ...process.env, ...env }, encoding: "utf8", shell: process.platform === "win32", maxBuffer: 64 * 1024 * 1024 });
  return `${r.stdout ?? ""}${r.stderr ?? ""}`;
}
// Alias « @/ » (aperçus, home) résolus par la config de vitest
const viteNode = (file, args = [], env = {}) => run("npx", ["--yes", "vite-node", "-c", "vitest.config.ts", join("scripts", "audit-jeux", file), ...args], env);
const resultOf = (out) => { const m = out.match(/RESULTAT erreurs=(\d+) avertissements=(\d+)/); return m ? { e: +m[1], w: +m[2] } : null; };

const table = [];
let failed = false;
function record(rule, errors, detail = "", warnings = 0) {
  if (errors === null) { failed = true; table.push([rule, "ÉCHEC D'EXÉCUTION", detail]); return; }
  if (errors > 0) failed = true;
  table.push([rule, `${errors} erreur(s)${warnings ? `, ${warnings} avertissement(s)` : ""}`, detail]);
}

// 1. Cohérence texte ↔ graphique, 4 jeux × langues actives
const COHERENCE = [
  ["Buy/Sell/No Trade", "coherence-bsnt.ts", {}],
  ["Trouve l'erreur", "coherence-ftm.ts", {}],
  ["Place ton Stop", "coherence-ps.ts", { RR_EXCEPT: "tight_consolidation" }],
  ["Build the Trade", "coherence-btt.ts", { FUT15: "1" }],
];
for (const [name, file, env] of COHERENCE) for (const lang of LANGS) {
  process.stdout.write(`… cohérence ${name} ${lang}\n`);
  const out = viteNode(file, [lang], env);
  const m = out.match(/TOTAL rounds incohérents : (\d+)/);
  record(`Cohérence ${name} (${lang})`, m ? +m[1] : null, m ? "" : out.split("\n").slice(-5).join(" "));
  // Place ton Stop : position du bon stop ≤ 50 % partout (libellé et position spatiale)
  if (file === "coherence-ps.ts" && m) {
    const over = [...out.matchAll(/(\w+)\s+((?:[A-C0-2]:[\d.]+%\s*)+)/g)].flatMap(([, d, cells]) => [...cells.matchAll(/([A-C0-2]):([\d.]+)%/g)].filter(([, , p]) => +p > 50).map(([, k, p]) => `${d} ${k} ${p} %`));
    record(`Position du bon stop ≤ 50 % (${lang})`, over.length, over.join(", "));
  }
}

// 2. Contexte de marché et prix (K1)
process.stdout.write("… contexte de marché et prix\n");
{
  const out = viteNode("context.ts");
  const ok = /0 erreur/.test(out);
  const n = out.split("\n").filter((l) => /^\s*\d+\s{2}/.test(l)).reduce((a, l) => a + parseInt(l, 10), 0);
  record("Contexte de marché, sessions, prix", /K1 —/.test(out) ? (ok ? 0 : n || 1) : null, ok ? "" : out.split("\n").slice(-6).join(" | "));
}

// 3. Réalisme, verdicts, textes, glossaire, bougies
for (const [rule, file] of [["Réalisme des bougies", "realism.ts"], ["Verdicts (toutes les issues)", "verdicts.ts"], ["Textes (ton ; français en EN / ES si actives)", "texts.ts"], ["Glossaire (vocabulaire des leçons)", "glossary.ts"], ["Bougies (continuité, rendu, 500 rounds)", "candles.ts"], ["Supports / résistances prouvés (500 rounds)", "sr.ts"], ["Zones : libellés validés", "zones.ts"], ["Tracé calé sur les bougies (liquidité au-delà de son niveau, extrêmes, swings sur la pointe de la mèche et dans l'ordre, FVG, OB, S/R, taille × bougie médiane)", "trace.ts"], ["Stops de Place ton Stop là où leur justification le dit", "stops.ts"], ["Bornes de range testées, jamais franchies avant la cassure", "range.ts"], ["R/R affiché de Build the Trade (4 actifs)", "rr-btt.ts"], ["Termes de niveau refusés (Niveau secondaire / bas / haut, niveau faible)", "termes-niveaux.ts"], ["Changement de rôle lisible (ancienne résistance → support…)", "roles.ts"], ["Rotation des scénarios (aucun doublon dans une partie, aucun retour avant la fin du cycle, 20 parties par niveau)", "rotation.ts"], ["Niveaux visibles tracés (sommets ou creux alignés et prouvés : bornes de range, résistance au-dessus, support en dessous)", "niveaux-visibles.ts"], ["Même nom partout (niveau cité dans l'énoncé ou l'explication = zone du même nom)", "noms-niveaux.ts"], ["Notions du niveau (leçons du niveau ou inférieures ; une notion en Débutant, piège en Intermédiaire, conflit en Avancé)", "notions-niveaux.ts"], ["Pas de réflexe gagnant (200 parties : aucune réponse > 40 %, joueur triche < 45 %)", "triche.ts"], ["Leçons, home, hub : termes interdits, orthographe", "orthographe.ts"], ["Vocabulaire de référence (lib/vocabulary/trading-terms.json)", "vocabulaire.ts"]]) {
  process.stdout.write(`… ${rule}\n`);
  const out = viteNode(file);
  const r = resultOf(out);
  const detail = out.split("\n").filter((l) => /ERREUR|hors seuil :/.test(l)).slice(0, 6).join(" | ");
  record(rule, r ? r.e : null, r ? detail : out.split("\n").slice(-5).join(" "), r ? r.w : 0);
}
// Autotests des règles de zones (libellé inventé), du tracé (liquidité trop loin, extrême hors
// d'un creux, FVG décalé…), des stops, des bornes de range et du R/R affiché (ancien seuil de risque absolu)
for (const [rule, file] of [["Autotest des zones (défauts injectés)", "zones.ts"], ["Autotest du tracé (défauts injectés)", "trace.ts"], ["Autotest des stops (défauts injectés)", "stops.ts"], ["Autotest des bornes de range (défauts injectés)", "range.ts"], ["Autotest du R/R affiché (défaut injecté)", "rr-btt.ts"], ["Autotest des termes de niveau (défauts injectés)", "termes-niveaux.ts"], ["Autotest du changement de rôle (défauts injectés)", "roles.ts"], ["Autotest de la rotation (défauts injectés)", "rotation.ts"], ["Autotest des niveaux visibles (défauts injectés)", "niveaux-visibles.ts"], ["Autotest des noms de niveaux (défauts injectés)", "noms-niveaux.ts"], ["Autotest des notions du niveau (défauts injectés)", "notions-niveaux.ts"], ["Autotest du joueur triche (défauts injectés)", "triche.ts"]]) {
  const out = viteNode(file, ["--autotest"]);
  const r = resultOf(out);
  record(rule, r ? r.e : null, out.split("\n").filter((l) => /^MANQUÉ/.test(l)).join(" | "));
}

// 4. DOM (navigateur) : troncature, sondes, verdict affiché
if (SANS_DOM) table.push(["DOM (troncature, sondes, verdict)", "non lancé (--sans-dom)", ""]);
else {
  process.stdout.write("… DOM (troncature, sondes, verdict) : plusieurs minutes\n");
  const out = run("node", [join("scripts", "audit-jeux", "dom.mjs"), `--langues=${LANGS.join(",")}`, ...DOM_ARGS]);
  const r = resultOf(out);
  record("DOM (troncature, sondes, verdict)", r ? r.e : null, out.split("\n").filter((l) => /erreur\(s\)|^\s{4}/.test(l) && !/: 0 erreur/.test(l)).slice(0, 10).join(" | ") || out.split("\n").slice(-3).join(" "));
  // Autotest : défauts injectés dans les étiquettes du graphique, chacun doit être détecté
  process.stdout.write("… autotest de l'audit DOM (défauts injectés)\n");
  const auto = run("node", [join("scripts", "audit-jeux", "dom.mjs"), "--autotest"]);
  const ra = resultOf(auto);
  record("Autotest de l'audit DOM (défauts injectés)", ra ? ra.e : null, auto.split("\n").filter((l) => /^MANQUÉ/.test(l)).join(" | ") || (ra ? "" : auto.split("\n").slice(-3).join(" ")));
}

console.log(`\n=== Audit des jeux (langues : ${LANGS.join(", ")}) ===`);
for (const [rule, res, detail] of table) console.log(`${rule.padEnd(44)} ${res}${detail ? `\n    ${detail}` : ""}`);
console.log(failed ? "\nÉCHEC : au moins une règle en erreur." : "\nOK : 0 erreur sur toutes les règles.");
process.exit(failed ? 1 : 0);
