// Génère lib/lessons/generated/candles.json depuis lib/lessons/scenarios.ts.
// Usage : npx vite-node -c vitest.config.ts scripts/audit-lecons/gen-charts.ts
//         … -- --check : vérifie seulement que le fichier est à jour (audit).
import fs from "node:fs";
import path from "node:path";
import { SCENARIOS } from "@/lib/lessons/scenarios";

const OUT = path.join(__dirname, "..", "..", "lib", "lessons", "generated", "candles.json");
const data = Object.fromEntries(Object.entries(SCENARIOS).map(([k, f]) => [k, f()]));
const text = `${JSON.stringify(data, null, 1)}\n`;

if (process.argv.includes("--check")) {
  const cur = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8").replace(/\r\n/g, "\n") : "";
  const ok = cur === text;
  console.log(ok ? "candles.json à jour" : "  ERREUR candles.json périmé : relancer scripts/audit-lecons/gen-charts.ts");
  console.log(`RESULTAT erreurs=${ok ? 0 : 1} avertissements=0`);
} else {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, text);
  for (const [k, v] of Object.entries(data)) console.log(`${k.padEnd(22)} ${v.length} bougies`);
}
