// Audit des schémas de leçons construits avec LessonChart (hors application).
// Usage : npm run audit:lecons              → toutes les règles (serveur de dev requis pour le DOM)
//         npm run audit:lecons -- --sans-dom → données seulement
//         npm run audit:lecons -- --dom-args="--toutes"   (+ textes coupés sur toutes les leçons)
// Leçons premium : AUDIT_STORAGE_STATE=<fichier> (session Playwright, hors dépôt).
// Code de sortie 1 dès qu'une règle compte une erreur.
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const SANS_DOM = process.argv.includes("--sans-dom");
const DOM_ARGS = (process.argv.find((a) => a.startsWith("--dom-args=")) ?? "--dom-args=").slice("--dom-args=".length).split(" ").filter(Boolean);

function run(cmd, args) {
  const r = spawnSync(cmd, args, { cwd: ROOT, env: process.env, encoding: "utf8", shell: process.platform === "win32", maxBuffer: 64 * 1024 * 1024 });
  return `${r.stdout ?? ""}${r.stderr ?? ""}`;
}
const viteNode = (file, args = []) => run("npx", ["--yes", "vite-node", "-c", "vitest.config.ts", join("scripts", "audit-lecons", file), ...args]);
const resultOf = (out) => { const m = out.match(/RESULTAT erreurs=(\d+) avertissements=(\d+)/); return m ? { e: +m[1], w: +m[2] } : null; };

const table = [];
let failed = false;
function record(rule, out) {
  const r = resultOf(out);
  if (!r) { failed = true; table.push([rule, "ÉCHEC D'EXÉCUTION", out.split("\n").slice(-5).join(" ")]); return; }
  if (r.e > 0) failed = true;
  const detail = out.split("\n").filter((l) => /ERREUR/.test(l)).slice(0, 12).join("\n    ");
  table.push([rule, `${r.e} erreur(s)${r.w ? `, ${r.w} avertissement(s)` : ""}`, detail]);
}

process.stdout.write("… données des schémas (candles.json à jour)\n");
record("Données générées à jour (scenarios.ts → candles.json)", viteNode("gen-charts.ts", ["--check"]));
process.stdout.write("… données des schémas (continuité, niveaux, R/R)\n");
record("Données : continuité, pivots, zones, R/R", viteNode("data.ts"));

if (SANS_DOM) table.push(["DOM (rendu des schémas)", "non lancé (--sans-dom)", ""]);
else {
  process.stdout.write("… DOM (rendu des schémas, 390 et 1440)\n");
  const out = run("node", [join("scripts", "audit-lecons", "dom.mjs"), ...DOM_ARGS]);
  process.stdout.write(out.split("\n").filter((l) => /AVERTISSEMENT|^\d/.test(l)).join("\n") + "\n");
  record("DOM (rendu des schémas, 390 et 1440)", out);
  process.stdout.write("… autotest : défauts injectés détectés par l'audit DOM\n");
  const auto = run("node", [join("scripts", "audit-lecons", "dom.mjs"), "--autotest", ...DOM_ARGS.filter((a) => a.startsWith("--base="))]);
  table.push(["Autotest de l'audit DOM (défauts injectés)", ...(() => { const r = resultOf(auto); if (!r || r.e) failed = true; return [r ? (r.e ? `${r.e} défaut(s) non détecté(s)` : "tous détectés") : "ÉCHEC D'EXÉCUTION", auto.split("\n").filter((l) => /NON DÉTECTÉ/.test(l)).join("\n    ")]; })()]);
}

console.log("\n=== Audit des schémas de leçons ===");
for (const [rule, res, detail] of table) console.log(`${rule.padEnd(52)} ${res}${detail ? `\n    ${detail}` : ""}`);
console.log(failed ? "\nÉCHEC : au moins une règle en erreur." : "\nOK : 0 erreur sur toutes les règles.");
process.exit(failed ? 1 : 0);
