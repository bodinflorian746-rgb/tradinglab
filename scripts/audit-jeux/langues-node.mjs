// Langues auditées pour run.mjs et dom.mjs (scripts Node sans TypeScript) : lues
// dans i18n/config.ts (ACTIVE_LOCALES), la même liste que le site et que
// langues.ts. Une langue désactivée n'est plus auditée.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const CONFIG = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "i18n", "config.ts");

export function languesAuditees() {
  const src = readFileSync(CONFIG, "utf8");
  const m = src.match(/export const ACTIVE_LOCALES[^=]*=\s*\[([^\]]*)\]/);
  if (!m) throw new Error("ACTIVE_LOCALES introuvable dans i18n/config.ts");
  return [...m[1].matchAll(/["'](\w+)["']/g)].map((x) => x[1]);
}
