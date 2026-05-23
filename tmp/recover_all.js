const fs = require("fs");
const path = require("path");
const readline = require("readline");

const TRANSCRIPT_DIR = "C:/Users/flori/.claude/projects/c--Users-flori-tradinglab";
const MAIN_TRANSCRIPT = path.join(TRANSCRIPT_DIR, "f272e6d5-3d06-406e-8b37-0aafa8b4d575.jsonl");
const SUBAGENT_DIR = path.join(TRANSCRIPT_DIR, "f272e6d5-3d06-406e-8b37-0aafa8b4d575", "subagents");

const ROOT = "C:/Users/flori/tradinglab";
const TARGETS_FILE = process.argv[2];
const DRY_RUN = process.argv[3] !== "--write";

// Map: target_path → { content, size, source }
const best = new Map();

function recordWrite(filePathRaw, content, source) {
  const fp = String(filePathRaw || "").split("\\").join("/");
  // Normalize: drop "C:/Users/flori/tradinglab/" prefix if present
  const norm = fp.replace(/^.*?\/tradinglab\//, "");
  if (!norm.endsWith("_content-es.tsx")) return;
  if (typeof content !== "string") return;
  if (content.length === 0) return; // skip empty writes
  const cur = best.get(norm);
  if (!cur || content.length > cur.size) {
    best.set(norm, { content, size: content.length, source });
  }
}

function walk(o, source) {
  if (!o) return;
  if (Array.isArray(o)) { o.forEach((x) => walk(x, source)); return; }
  if (typeof o === "object") {
    if (o.name === "Write" && o.input && typeof o.input === "object") {
      recordWrite(o.input.file_path, o.input.content, source);
    }
    for (const k of Object.keys(o)) walk(o[k], source);
  }
}

async function processJsonl(filePath, source) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: fs.createReadStream(filePath, { encoding: "utf8" }),
      crlfDelay: Infinity
    });
    rl.on("line", (line) => {
      try { walk(JSON.parse(line), source); } catch (e) {}
    });
    rl.on("close", resolve);
  });
}

(async () => {
  console.error("Processing main transcript...");
  await processJsonl(MAIN_TRANSCRIPT, "main");
  console.error(`  After main: ${best.size} files found`);

  console.error("Processing subagent transcripts...");
  const subagents = fs.readdirSync(SUBAGENT_DIR).filter((f) => f.endsWith(".jsonl"));
  for (const sub of subagents) {
    await processJsonl(path.join(SUBAGENT_DIR, sub), sub);
  }
  console.error(`  After subagents: ${best.size} files found`);

  // Load targets list
  const targets = fs.readFileSync(TARGETS_FILE, "utf8")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  let restored = 0;
  let missing = 0;
  for (const target of targets) {
    const hit = best.get(target);
    if (!hit) {
      console.error("MISSING: " + target);
      missing++;
      continue;
    }
    if (DRY_RUN) {
      console.error("WOULD RESTORE: " + target + " (" + hit.size + " chars, src=" + hit.source + ")");
    } else {
      const abs = path.join(ROOT, target);
      fs.writeFileSync(abs, hit.content, "utf8");
      console.error("RESTORED: " + target + " (" + hit.size + " chars, src=" + hit.source + ")");
    }
    restored++;
  }
  console.error("---");
  console.error("Total targets: " + targets.length);
  console.error("Restored/restorable: " + restored);
  console.error("Missing: " + missing);
})();
