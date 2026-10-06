// Audit permanent des 4 mini-jeux (hors application : jamais importé par le site).
// Usage : npm run audit:jeux              → toutes les règles (serveur de dev requis pour le DOM)
//         npm run audit:jeux -- --sans-dom → règles sur les données seulement
//         npm run audit:jeux -- --dom-args="--jeux=place-stop --langues=es"
//
// Règles « données » (vite-node, 3 langues) :
//   cohérence texte ↔ graphique (4 jeux), contexte de marché et prix (K1),
//   distribution du bon stop ≤ 50 %, R/R des bonnes réponses, réalisme des
//   bougies, énumération des verdicts, textes (français en EN/ES, ton),
//   glossaire (libellés de zones et termes = vocabulaire des leçons),
//   bougies (ouverture = clôture précédente, en données et au rendu ; jeux,
//   aperçus du hub, héros de la home), textes affichés FR / ES des leçons, de la
//   home, du hub et des jeux (termes interdits, orthographe, typographie ES).
// Règles « DOM » (Playwright) : troncature 3 langues × 390/1440, sonde
//   lignes = étiquettes = boutons, cohérence du verdict affiché.
// Code de sortie 1 dès qu'une règle compte une erreur.
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const SANS_DOM = process.argv.includes("--sans-dom");
const DOM_ARGS = (process.argv.find((a) => a.startsWith("--dom-args=")) ?? "--dom-args=").slice("--dom-args=".length).split(" ").filter(Boolean);
const LANGS = ["fr", "en", "es"];

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

// 1. Cohérence texte ↔ graphique, 4 jeux × 3 langues
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
for (const [rule, file] of [["Réalisme des bougies", "realism.ts"], ["Verdicts (toutes les issues)", "verdicts.ts"], ["Textes (français en EN/ES, ton)", "texts.ts"], ["Glossaire (vocabulaire des leçons)", "glossary.ts"], ["Bougies (continuité, rendu, 500 rounds)", "candles.ts"], ["Leçons, home, hub : termes interdits, orthographe", "orthographe.ts"], ["Vocabulaire de référence (lib/vocabulary/trading-terms.json)", "vocabulaire.ts"]]) {
  process.stdout.write(`… ${rule}\n`);
  const out = viteNode(file);
  const r = resultOf(out);
  const detail = out.split("\n").filter((l) => /ERREUR|hors seuil :/.test(l)).slice(0, 6).join(" | ");
  record(rule, r ? r.e : null, r ? detail : out.split("\n").slice(-5).join(" "), r ? r.w : 0);
}

// 4. DOM (navigateur) : troncature, sondes, verdict affiché
if (SANS_DOM) table.push(["DOM (troncature, sondes, verdict)", "non lancé (--sans-dom)", ""]);
else {
  process.stdout.write("… DOM (troncature, sondes, verdict) : plusieurs minutes\n");
  const out = run("node", [join("scripts", "audit-jeux", "dom.mjs"), ...DOM_ARGS]);
  const r = resultOf(out);
  record("DOM (troncature, sondes, verdict)", r ? r.e : null, out.split("\n").filter((l) => /erreur\(s\)|^\s{4}/.test(l) && !/: 0 erreur/.test(l)).slice(0, 10).join(" | ") || out.split("\n").slice(-3).join(" "));
}

console.log("\n=== Audit des jeux ===");
for (const [rule, res, detail] of table) console.log(`${rule.padEnd(44)} ${res}${detail ? `\n    ${detail}` : ""}`);
console.log(failed ? "\nÉCHEC : au moins une règle en erreur." : "\nOK : 0 erreur sur toutes les règles.");
process.exit(failed ? 1 : 0);
