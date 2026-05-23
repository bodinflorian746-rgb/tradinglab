"use strict";

// Inject `locale="es"` into chart usages in _content-es.tsx files.
//
// Safety:
// - Only touches files matching _content-es.tsx
// - Only replaces <XxxDiagram /> / <XxxInteractive /> patterns where
//   the chart component is verified to accept a `locale` prop.
// - Self-closing tags WITHOUT existing props only — never touches
//   tags that already have any prop, to avoid prop-merge bugs.
// - UTF-8 read+write, no BOM, no shell.
// - Dry-run unless --write is passed.
// - Optional --batch=N to limit to N files per execution.

const fs = require("fs");
const path = require("path");

const ROOT = "C:/Users/flori/tradinglab";
const APP_DIR = path.join(ROOT, "app");
const CHARTS_DIR = path.join(ROOT, "app/components/charts");

const args = process.argv.slice(2);
const WRITE = args.includes("--write");
const batchArg = args.find((a) => a.startsWith("--batch="));
const BATCH = batchArg ? Number(batchArg.split("=")[1]) : 0;
const onlyArg = args.find((a) => a.startsWith("--only="));
const ONLY = onlyArg ? onlyArg.split("=")[1].split(",") : null;

function walk(dir, out) {
  if (!fs.existsSync(dir)) return;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(fp, out);
    else if (ent.isFile()) out.push(fp);
  }
}

// 1. Build set of chart component names that accept a `locale` prop.
//    A chart "accepts locale" iff its file contains an ACTUAL prop signature:
//      - `locale?: "fr" | "es"` in a props interface
//      - `locale: "fr" | "es"` (no `?`)
//      - destructuring with default: `({ ..., locale = "fr" ...`
//    Not a stray mention in a comment or variable name.
function getLocaleAwareCharts() {
  const files = fs.readdirSync(CHARTS_DIR).filter((f) => f.endsWith(".tsx"));
  const PROP_RE = /\blocale\s*\?\s*:\s*["']fr["']|\blocale\s*:\s*["']fr["']|\blocale\s*=\s*["']fr["']/;
  const names = new Set();
  for (const f of files) {
    const fp = path.join(CHARTS_DIR, f);
    const src = fs.readFileSync(fp, "utf8");
    if (!PROP_RE.test(src)) continue;
    const re = /export\s+(?:default\s+)?function\s+([A-Z][A-Za-z0-9_]*)/g;
    let m;
    while ((m = re.exec(src)) !== null) {
      names.add(m[1]);
    }
    const base = path.basename(f, ".tsx");
    if (/^[A-Z][A-Za-z0-9_]*$/.test(base)) names.add(base);
  }
  return names;
}

// 2. Find all _content-es.tsx files.
function getEsContentFiles() {
  const out = [];
  walk(APP_DIR, out);
  return out.filter((p) => p.endsWith("_content-es.tsx"));
}

// 3. For each ES content file, find candidate chart usages and propose changes.
function planChanges(localeAwareCharts, esFiles) {
  const plan = [];
  const TAG_RE = /<([A-Z][A-Za-z0-9_]*)\s*\/>/g;
  for (const fp of esFiles) {
    const src = fs.readFileSync(fp, "utf8");
    let m;
    const matches = [];
    while ((m = TAG_RE.exec(src)) !== null) {
      const name = m[1];
      if (!localeAwareCharts.has(name)) continue;
      // Only end with `Diagram` or `Interactive` to limit scope to charts
      if (!/(?:Diagram|Interactive)$/.test(name)) continue;
      matches.push({ index: m.index, full: m[0], name });
    }
    if (matches.length === 0) continue;
    // Compose the new source by replacing each match
    let newSrc = src;
    // Use a single replace pass to avoid index drift
    newSrc = newSrc.replace(TAG_RE, (full, name) => {
      if (!localeAwareCharts.has(name)) return full;
      if (!/(?:Diagram|Interactive)$/.test(name)) return full;
      return `<${name} locale="es" />`;
    });
    if (newSrc === src) continue;
    const rel = path.relative(ROOT, fp).replace(/\\/g, "/");
    plan.push({ file: fp, rel, matches: matches.length, newSrc, oldSrc: src });
  }
  return plan;
}

(function main() {
  const localeAware = getLocaleAwareCharts();
  console.error("Locale-aware chart components: " + localeAware.size);

  const esFiles = getEsContentFiles();
  console.error("_content-es.tsx files: " + esFiles.length);

  let plan = planChanges(localeAware, esFiles);

  if (ONLY) {
    plan = plan.filter((p) => ONLY.some((sub) => p.rel.indexOf(sub) !== -1));
  }

  console.error("Files with eligible changes: " + plan.length);
  console.error("");

  if (BATCH > 0 && plan.length > BATCH) {
    plan = plan.slice(0, BATCH);
    console.error("Batched to first " + BATCH + " files");
    console.error("");
  }

  let totalSubs = 0;
  for (const p of plan) {
    totalSubs += p.matches;
    console.error(`${p.matches.toString().padStart(3)} subs · ${p.rel}`);
  }
  console.error("");
  console.error("Total substitutions: " + totalSubs);
  console.error("Mode: " + (WRITE ? "WRITE" : "DRY-RUN"));

  if (WRITE) {
    for (const p of plan) {
      fs.writeFileSync(p.file, p.newSrc, { encoding: "utf8" });
    }
    console.error("Wrote " + plan.length + " files.");
  }
})();
