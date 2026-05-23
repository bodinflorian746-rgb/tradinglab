const fs = require("fs");
const readline = require("readline");

const JSONL_PATH = process.argv[2];
const TARGET = process.argv[3];

let bestContent = null;
let bestSize = 0;

function walk(o) {
  if (!o) return;
  if (Array.isArray(o)) { o.forEach(walk); return; }
  if (typeof o === "object") {
    if (o.name === "Write" && o.input && typeof o.input === "object") {
      const fp = String(o.input.file_path || "").split("\\").join("/");
      if (fp.endsWith(TARGET)) {
        const c = o.input.content;
        if (typeof c === "string" && c.length > bestSize) {
          bestContent = c;
          bestSize = c.length;
        }
      }
    }
    for (const k of Object.keys(o)) walk(o[k]);
  }
}

const rl = readline.createInterface({
  input: fs.createReadStream(JSONL_PATH, { encoding: "utf8" }),
  crlfDelay: Infinity
});

rl.on("line", (line) => {
  try { walk(JSON.parse(line)); } catch (e) {}
});

rl.on("close", () => {
  if (bestContent === null) {
    process.stderr.write("NOT FOUND: " + TARGET + "\n");
    process.exit(1);
  }
  process.stderr.write("FOUND: " + TARGET + " (" + bestSize + " chars)\n");
  process.stdout.write(bestContent);
});
