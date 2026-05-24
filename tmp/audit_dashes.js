#!/usr/bin/env node
// PHASE A — Audit em-dash (U+2014) dry-run pour TradeScaleX
// Aucune écriture de fichier source. Génère uniquement tmp/dashes_report.txt
//
// Règles d'exclusion:
//   - app/components/charts/    (SVG diagrams)
//   - tests/                    (tests Playwright)
//   - tmp/                      (scripts one-off)
//   - node_modules, .next, out, build, .git
//   - .md, .txt, package.json, tsconfig.json
//
// Détection comments (skip):
//   - Single-line // (en gérant URLs http://, https://)
//   - Block /* */ (état multi-lignes, JSX {/* */} inclus via même syntaxe)
//
// Classification (CAS):
//   1 — Titre/sous-titre (h1-h6, title:, label:, heading:, eyebrow:, subtitle:)
//       → " — " devient " : "
//   2 — Rythmique en prose: " — " avant majuscule → ". ", avant minuscule → ", "
//   3 — En début de string (juste après " ou `): retiré
//   5 — Incise (deux " — " proches sur même ligne): → virgules
//   N — Range numérique (chiffre — chiffre): PRÉSERVÉ
//   X — Ambigu: à valider manuellement (préservé)

"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = "C:/Users/flori/tradinglab";
const EM_DASH = "—"; // —

const INCLUDE_ROOTS = ["app", "lib", "dictionaries"];
const EXCLUDE_PARTIAL = [
  "app/components/charts/",
  "/tests/",
  "tests/",
  "node_modules/",
  ".next/",
  "/out/",
  "/build/",
  "/tmp/",
  "tmp/",
  ".git/",
];
const INCLUDE_EXT = new Set([".tsx", ".ts", ".json"]);
const EXCLUDE_FILES = new Set(["package.json", "tsconfig.json", "next.config.ts", "playwright.config.ts", "eslint.config.mjs"]);

// Full relative paths to exclude entirely (placeholder UI volontaire)
const EXCLUDE_PATHS = new Set([
  "app/[locale]/dashboard/page.tsx",
]);

const REPORT_PATH = path.join(ROOT, "tmp", "dashes_report.txt");
const WRITE_REPORT_PATH = path.join(ROOT, "tmp", "dashes_write_report.txt");
const WRITE = process.argv.includes("--write");

// ─── Walking ────────────────────────────────────────────────────────────────

function isExcluded(absPath) {
  const rel = path.relative(ROOT, absPath).replace(/\\/g, "/");
  if (EXCLUDE_PATHS.has(rel)) return true;
  if (EXCLUDE_PARTIAL.some((p) => rel.startsWith(p) || rel.includes(p))) return true;
  return false;
}

function walk(dir, files = []) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); }
  catch { return files; }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (isExcluded(full)) continue;
    if (e.isDirectory()) {
      walk(full, files);
    } else {
      if (EXCLUDE_FILES.has(e.name)) continue;
      const ext = path.extname(e.name);
      if (INCLUDE_EXT.has(ext)) files.push(full);
    }
  }
  return files;
}

// ─── Comment-stripping per line ─────────────────────────────────────────────
// Returns a "masked" version of the line where comment chars are replaced
// by spaces (preserving positions). Tracks block-comment state across lines.

let _blockState = false;

function resetBlockState() { _blockState = false; }

function findLineComment(line, startIdx) {
  let i = startIdx;
  while ((i = line.indexOf("//", i)) !== -1) {
    // Skip // inside URLs (http://, https://)
    if (i > 0 && line.charAt(i - 1) === ":") { i += 2; continue; }
    return i;
  }
  return -1;
}

function maskComments(line) {
  // For JSON, no comments → return as-is.
  // For TS/TSX/JS, mask // and /* */ regions.
  let i = 0;
  let out = "";
  while (i < line.length) {
    if (_blockState) {
      const end = line.indexOf("*/", i);
      if (end === -1) {
        out += " ".repeat(line.length - i);
        i = line.length;
      } else {
        out += " ".repeat(end + 2 - i);
        i = end + 2;
        _blockState = false;
      }
    } else {
      const blockStart = line.indexOf("/*", i);
      const lineSlash = findLineComment(line, i);
      if (blockStart !== -1 && (lineSlash === -1 || blockStart < lineSlash)) {
        out += line.slice(i, blockStart);
        const end = line.indexOf("*/", blockStart + 2);
        if (end === -1) {
          out += " ".repeat(line.length - blockStart);
          i = line.length;
          _blockState = true;
        } else {
          out += " ".repeat(end + 2 - blockStart);
          i = end + 2;
        }
      } else if (lineSlash !== -1) {
        out += line.slice(i, lineSlash);
        out += " ".repeat(line.length - lineSlash);
        i = line.length;
      } else {
        out += line.slice(i);
        i = line.length;
      }
    }
  }
  return out;
}

// ─── Classification ─────────────────────────────────────────────────────────

function classify(line, pos) {
  const before = line.slice(0, pos);
  const after = line.slice(pos + 1);

  // CAS N — Range numérique (chiffre/espace—chiffre)
  if (/\d[\d\s]*$/.test(before) && /^\s*\d/.test(after)) {
    return { cas: "N", action: "PRÉSERVÉ", note: "Range numérique" };
  }

  // CAS 3 — Em-dash juste après " ou ` (début de string content, possiblement après espaces)
  // On regarde les ~50 chars avant pour trouver un quote
  const beforeShort = before.slice(-50);
  const lastQuote = Math.max(beforeShort.lastIndexOf('"'), beforeShort.lastIndexOf("`"));
  if (lastQuote !== -1) {
    const between = beforeShort.slice(lastQuote + 1);
    if (/^\s*$/.test(between)) {
      return { cas: 3, action: "RETIRÉ", note: "Em-dash en début de string" };
    }
  }

  // CAS 5 — Incise (deux em-dash sur même ligne dans une fenêtre raisonnable)
  const after80 = after.slice(0, 80);
  if (after80.indexOf(EM_DASH) !== -1) {
    return { cas: 5, action: " — ... — → , ... ,", note: "Incise (paire em-dash)" };
  }

  // CAS 1 — Contexte titre/sous-titre détecté
  const titlePattern = /<h[1-6][\s>/]|(title|label|heading|eyebrow|subtitle|titleLine\d|name)\s*:\s*["`']/i;
  if (titlePattern.test(line)) {
    return { cas: 1, action: " — → : ", note: "Contexte titre/sous-titre" };
  }

  // CAS 2 — Rythmique " — " en prose
  if (/\s$/.test(before) && /^\s/.test(after)) {
    const nextNonSpace = after.replace(/^\s+/, "");
    const firstCh = nextNonSpace.charAt(0);
    if (/[A-ZÀ-ÖØ-Þ]/.test(firstCh)) {
      return { cas: 2, action: " — → . ", note: "Rythmique avant majuscule" };
    } else if (/[a-zà-öø-ÿ]/.test(firstCh)) {
      return { cas: 2, action: " — → , ", note: "Rythmique avant minuscule" };
    } else if (/[0-9]/.test(firstCh)) {
      return { cas: 2, action: " — → , ", note: "Rythmique avant chiffre" };
    }
  }

  return { cas: "X", action: "À VALIDER", note: "Cas ambigu" };
}

// ─── Compute replacement for an em-dash at `pos` in `line` ─────────────────
// Returns { changed: bool, newLine: string, cas, action }
function applyReplacement(line, pos, cas) {
  if (cas === "N" || cas === "X") {
    return { changed: false, newLine: line, cas, action: "PRÉSERVÉ" };
  }

  // CAS 3 — em-dash en début de string : retirer em-dash et UN espace suivant
  if (cas === 3) {
    let endRemove = pos + 1;
    if (line.charAt(pos + 1) === " ") endRemove = pos + 2;
    return {
      changed: true,
      newLine: line.slice(0, pos) + line.slice(endRemove),
      cas,
      action: "RETIRÉ",
    };
  }

  // Pour CAS 1, 2, 5 : on remplace " — " (3 chars) par " : " / ". " / ", "
  if (line.charAt(pos - 1) !== " " || line.charAt(pos + 1) !== " ") {
    return { changed: false, newLine: line, cas, action: "SKIP (pas d'espaces autour)" };
  }

  let repl;
  if (cas === 1) {
    repl = " : ";
  } else if (cas === 5) {
    repl = ", ";
  } else {
    // CAS 2 : majuscule → ". ", minuscule/chiffre → ", "
    const after = line.slice(pos + 2);
    const nextNonSpace = after.replace(/^\s+/, "");
    const firstCh = nextNonSpace.charAt(0);
    if (/[A-ZÀ-ÖØ-Þ]/.test(firstCh)) repl = ". ";
    else repl = ", ";
  }

  return {
    changed: true,
    newLine: line.slice(0, pos - 1) + repl + line.slice(pos + 2),
    cas,
    action: `" — " → "${repl}"`,
  };
}

// ─── Process file ───────────────────────────────────────────────────────────

function processFile(absPath) {
  const ext = path.extname(absPath);
  const isJson = ext === ".json";
  let content;
  try { content = fs.readFileSync(absPath, "utf8"); }
  catch { return { results: [], modified: 0, newContent: null }; }
  if (!content.includes(EM_DASH)) return { results: [], modified: 0, newContent: null };

  const lines = content.split("\n");
  const results = [];
  resetBlockState();

  const newLines = [];
  let modifiedCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const masked = isJson ? raw : maskComments(raw);

    // Collect em-dash positions (in code, not comments)
    const positions = [];
    let pos = 0;
    while ((pos = masked.indexOf(EM_DASH, pos)) !== -1) {
      if (raw.charAt(pos) === EM_DASH) positions.push(pos);
      pos += 1;
    }

    // Audit: record each occurrence with classification
    for (const p of positions) {
      const beforeCtx = raw.slice(Math.max(0, p - 30), p);
      const afterCtx = raw.slice(p + 1, Math.min(raw.length, p + 31));
      const { cas, action, note } = classify(raw, p);
      results.push({ line: i + 1, col: p + 1, beforeCtx, afterCtx, cas, action, note });
    }

    // Apply replacements right-to-left so earlier positions remain valid
    let newLine = raw;
    if (WRITE) {
      // Re-classify on the raw line (positions are still valid since we go right-to-left)
      for (let k = positions.length - 1; k >= 0; k--) {
        const p = positions[k];
        const cls = classify(raw, p);
        const r = applyReplacement(newLine, p, cls.cas);
        if (r.changed) {
          newLine = r.newLine;
          modifiedCount++;
        }
      }
    }
    newLines.push(newLine);
  }

  const newContent = WRITE && modifiedCount > 0 ? newLines.join("\n") : null;
  return { results, modified: modifiedCount, newContent };
}

// ─── Main ───────────────────────────────────────────────────────────────────

const allFiles = [];
for (const r of INCLUDE_ROOTS) walk(path.join(ROOT, r), allFiles);

console.log(`[scan] ${allFiles.length} fichiers candidats (.tsx/.ts/.json)`);

const lines = [];
const summary = {
  total: 0,
  byCas: { 1: 0, 2: 0, 3: 0, 5: 0, N: 0, X: 0 },
  byFile: {},
};

lines.push("# AUDIT EM-DASH — TradeScaleX");
lines.push(`# Dry-run généré le ${new Date().toISOString()}`);
lines.push(`# Aucun fichier source modifié.`);
lines.push("");
lines.push(`# Périmètre: app/, lib/, dictionaries/`);
lines.push(`# Exclusions: app/components/charts/, tests/, tmp/, node_modules/, .next/`);
lines.push(`# Fichiers scannés (avec extension .tsx/.ts/.json): ${allFiles.length}`);
lines.push("");

const filesWithDashes = [];
const writeSummary = { totalChanged: 0, filesChanged: 0, byFile: {} };

for (const f of allFiles) {
  const { results: occ, modified, newContent } = processFile(f);
  if (occ.length === 0) continue;
  const rel = path.relative(ROOT, f).replace(/\\/g, "/");
  summary.byFile[rel] = occ.length;
  filesWithDashes.push({ rel, occ });
  for (const o of occ) {
    summary.total++;
    summary.byCas[o.cas] = (summary.byCas[o.cas] || 0) + 1;
  }
  if (WRITE && newContent !== null && modified > 0) {
    fs.writeFileSync(f, newContent, "utf8");
    writeSummary.totalChanged += modified;
    writeSummary.filesChanged += 1;
    writeSummary.byFile[rel] = modified;
  }
}

// Per-file detail
for (const { rel, occ } of filesWithDashes) {
  lines.push(`## ${rel}  (${occ.length} occurrence${occ.length > 1 ? "s" : ""})`);
  for (const o of occ) {
    const ctx = `${o.beforeCtx}${EM_DASH}${o.afterCtx}`.replace(/\s+/g, " ").trim();
    lines.push(`  L${o.line}:${o.col} [CAS ${o.cas}] ${o.action}  (${o.note})`);
    lines.push(`    ${ctx}`);
  }
  lines.push("");
}

// Summary
lines.push("");
lines.push("# ───────────────── RÉSUMÉ ─────────────────");
lines.push(`Total em-dash classifiés: ${summary.total}`);
lines.push(`  CAS 1  (titre → ":"):                  ${summary.byCas[1]}`);
lines.push(`  CAS 2  (rythmique → "." ou ","):       ${summary.byCas[2]}`);
lines.push(`  CAS 3  (début de string → retiré):     ${summary.byCas[3]}`);
lines.push(`  CAS 5  (incise → virgules):            ${summary.byCas[5]}`);
lines.push(`  CAS N  (range numérique préservé):     ${summary.byCas.N}`);
lines.push(`  CAS X  (ambigu, à valider manuel):     ${summary.byCas.X}`);
lines.push("");
lines.push(`Fichiers affectés: ${filesWithDashes.length}`);
lines.push("");
lines.push("# TOP 30 fichiers (par nb d'occurrences)");
const top = Object.entries(summary.byFile).sort((a, b) => b[1] - a[1]).slice(0, 30);
for (const [f, n] of top) lines.push(`  ${String(n).padStart(5)}  ${f}`);

fs.writeFileSync(REPORT_PATH, lines.join("\n"), "utf8");

console.log(`[report] ${REPORT_PATH}`);

if (WRITE) {
  const wlines = [];
  wlines.push("# WRITE REPORT — em-dash cleanup");
  wlines.push(`Date: ${new Date().toISOString()}`);
  wlines.push(`Total occurrences modifiées: ${writeSummary.totalChanged}`);
  wlines.push(`Fichiers modifiés: ${writeSummary.filesChanged}`);
  wlines.push("");
  wlines.push("# Top fichiers (par nb de remplacements)");
  const wtop = Object.entries(writeSummary.byFile).sort((a, b) => b[1] - a[1]);
  for (const [f, n] of wtop) wlines.push(`  ${String(n).padStart(5)}  ${f}`);
  fs.writeFileSync(WRITE_REPORT_PATH, wlines.join("\n"), "utf8");
  console.log(`[write-report] ${WRITE_REPORT_PATH}`);
}

console.log(``);
console.log(`────────────────── RÉSUMÉ ──────────────────`);
console.log(`Mode:                             ${WRITE ? "WRITE (fichiers modifiés)" : "DRY-RUN (lecture seule)"}`);
console.log(`Total em-dash classifiés:         ${summary.total}`);
console.log(`  CAS 1 (titre → ":"):           ${summary.byCas[1]}`);
console.log(`  CAS 2 (rythmique → . ou ,):    ${summary.byCas[2]}`);
console.log(`  CAS 3 (début string → retiré): ${summary.byCas[3]}`);
console.log(`  CAS 5 (incise → virgules):     ${summary.byCas[5]}`);
console.log(`  CAS N (range préservé):        ${summary.byCas.N}`);
console.log(`  CAS X (ambigu):                 ${summary.byCas.X}`);
console.log(`Fichiers scannés avec em-dash:    ${filesWithDashes.length}`);
if (WRITE) {
  console.log(`Total remplacements appliqués:    ${writeSummary.totalChanged}`);
  console.log(`Fichiers modifiés:                ${writeSummary.filesChanged}`);
}
console.log(`────────────────────────────────────────────`);
