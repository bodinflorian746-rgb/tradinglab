// Termes de niveau refusés dans tout texte affiché des jeux (règle PO) : « Niveau secondaire »,
// « Niveau bas », « Niveau haut », « niveau faible » (et leurs équivalents EN / ES ; en ES,
// « nivel bajo / alto » est exclu : « bajo » veut aussi dire « sous »). Un niveau
// s'appelle Support / Résistance s'il est prouvé sur le graphique, sinon par son nom exact
// (plus haut / plus bas précédent…) ; il n'est jamais renommé pour contourner la preuve.
//  1. Sources des jeux (FR, EN, ES) : lib/games, pages et composants des jeux, aperçus et héros
//     de l'accueil, dictionnaire games.json. Les commentaires et les motifs des règles du
//     glossaire (from: /…/) ne sont pas des textes affichés.
//  2. Textes générés : libellés des zones et justifications des stops, 3 langues, 3 niveaux.
// Usage : npx vite-node scripts/audit-jeux/termes-niveaux.ts [--autotest] (lancé par run.mjs)
import fs from "node:fs";
import path from "node:path";
import * as BS from "../../lib/games/buy-sell-no-trade";
import * as BSEN from "../../lib/games/buy-sell-no-trade-en";
import * as BSES from "../../lib/games/buy-sell-no-trade-es";
import * as FTM from "../../lib/games/find-the-mistake";
import * as FTMEN from "../../lib/games/find-the-mistake-en";
import * as FTMES from "../../lib/games/find-the-mistake-es";
import * as PS from "../../lib/games/place-stop";
import * as PSEN from "../../lib/games/place-stop-en";
import * as PSES from "../../lib/games/place-stop-es";
import * as BT from "../../lib/games/build-the-trade";
import * as BTEN from "../../lib/games/build-the-trade-en";
import * as BTES from "../../lib/games/build-the-trade-es";

/** Termes refusés : FR (règle PO) et leurs traductions EN / ES */
export const FORBIDDEN_LEVEL_TERMS: RegExp[] = [
  /(?<!\p{L})niveaux? (?:secondaires?|bas|haut|faibles?)(?!\p{L})/iu,
  /(?<!\p{L})(?:secondary|weak) levels?(?!\p{L})/iu,
  /(?<!\p{L})nivel(?:es)? (?:secundarios?|débil|debil)(?!\p{L})/iu,
];
export const forbiddenIn = (text: string): string | null => {
  for (const re of FORBIDDEN_LEVEL_TERMS) { const m = text.match(re); if (m) return m[0]; }
  return null;
};

const ROOT = path.join(__dirname, "..", "..");
const walk = (d: string): string[] => fs.existsSync(d) ? fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)])) : [];
const SOURCES = [
  ...walk(path.join(ROOT, "lib", "games")),
  ...walk(path.join(ROOT, "app", "[locale]", "(premium)", "jeux")),
  ...walk(path.join(ROOT, "app", "components", "games")),
  path.join(ROOT, "app", "[locale]", "_home", "hero-rounds.ts"),
  ...["fr", "en", "es"].map((l) => path.join(ROOT, "dictionaries", l, "games.json")),
].filter((f) => /\.(tsx?|json)$/.test(f) && !/\.test\./.test(f) && fs.existsSync(f));

/** Code sans commentaires ni motifs de règles du glossaire (from: /…/) */
const displayable = (src: string) => src
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/(^|[^:"'`\\])\/\/[^\n]*/g, "$1")
  .replace(/from:\s*\/(?:\\.|[^/\n])+\/[a-z]*/g, "from: /…/");

function scanSources(files: string[], read: (f: string) => string): string[] {
  const errs: string[] = [];
  for (const f of files) {
    const lines = displayable(read(f)).split("\n");
    lines.forEach((l, i) => { const t = forbiddenIn(l); if (t) errs.push(`« ${t} » dans ${path.relative(ROOT, f).replace(/\\/g, "/")}:${i + 1} : ${l.trim().slice(0, 90)}`); });
  }
  return errs;
}

type Texts = { where: string; text: string }[];
const DIFFS = ["beginner", "intermediate", "advanced"] as const;
function generated(): Texts {
  const out: Texts = [];
  const zones = (where: string, zs: { label?: string }[]) => zs.forEach((z) => z.label && out.push({ where: `${where} (zone)`, text: z.label }));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const G = (m: any) => m;
  for (const [lang, bs, ftm, ps, bt] of [["fr", BS, FTM, PS, BT], ["en", BSEN, FTMEN, PSEN, BTEN], ["es", BSES, FTMES, PSES, BTES]] as const) {
    for (const d of DIFFS) for (let s = 1; s <= 8; s++) {
      const seed = s * 7919;
      for (const inst of G(bs).generateScenarios(seed, d)) zones(`Buy/Sell ${lang} ${inst.id}`, G(bs).buildChart(inst.id, inst.seed, inst.volatility, d).zones);
      for (const inst of G(ftm).generateMistakeScenarios(seed, d)) zones(`Trouve l'erreur ${lang} ${inst.id}`, G(ftm).buildScenarioChart(inst, inst.seed, inst.volatility).zones);
      for (const inst of G(ps).generatePlaceStopScenarios(seed, d)) {
        const ch = G(ps).buildPlaceStopChart(inst.id, inst.seed, inst.volatility, d);
        zones(`Place ton Stop ${lang} ${inst.id}`, ch.zones);
        for (const st of ch.stops) out.push({ where: `Place ton Stop ${lang} ${inst.id} (justification)`, text: st.rationale });
      }
      for (const inst of G(bt).generateBuildTradeScenarios(seed, d)) zones(`Build the Trade ${lang} ${inst.id}`, G(bt).buildBuildTradeChart(inst, inst.seed, inst.volatility).zones);
    }
  }
  return out;
}
const scanTexts = (texts: Texts) => {
  const errs: string[] = [], seen = new Set<string>();
  for (const t of texts) { const f = forbiddenIn(t.text); const k = `${t.where}|${t.text}`; if (f && !seen.has(k)) { seen.add(k); errs.push(`« ${f} » (${t.where}) : ${t.text.slice(0, 80)}`); } }
  return errs;
};

let errors = 0;
const lines: string[] = [];
if (process.argv.includes("--autotest")) {
  // Défauts injectés dans de vrais textes des jeux : chacun doit être détecté
  const ctx = BS.SCENARIO_TEMPLATES.find((t) => t.id === "counter_trend_bounce")!.context;
  const file = SOURCES.find((f) => f.endsWith(path.join("lib", "games", "buy-sell-no-trade.ts")))!;
  const cases: [string, () => string[]][] = [
    ["« Niveau secondaire » dans un contexte (source)", () => scanSources([file], (f) => fs.readFileSync(f, "utf8").replace(ctx, ctx.replace("sur un support", "sur un niveau secondaire")))],
    ["« Niveau bas » en libellé de zone", () => scanTexts([{ where: "zone injectée", text: "Niveau bas" }])],
    ["« Niveau haut » en libellé de zone", () => scanTexts([{ where: "zone injectée", text: "Niveau haut" }])],
    ["« niveau faible » dans une explication", () => scanTexts([{ where: "explication injectée", text: "Le prix rebondit sur un niveau faible, prudence." }])],
    ["« nivel secundario » (ES)", () => scanTexts([{ where: "zone injectée ES", text: "Nivel secundario" }])],
  ];
  for (const [name, run] of cases) {
    const e = run();
    const ok = e.length > 0;
    lines.push(`${ok ? "détecté" : "MANQUÉ "}  ${name}${e[0] ? ` (${e[0].slice(0, 90)})` : ""}`);
    if (!ok) errors++;
  }
  // Témoin : les termes valides ne sont pas refusés
  const fp = scanTexts(["Plus haut précédent", "Plus bas précédent", "Support", "Résistance", "Haut du range", "le niveau de risque est faible", "nivel bajo el precio"].map((text) => ({ where: "témoin", text })));
  lines.push(`${fp.length ? "FAUX POSITIF" : "aucun faux positif"}  témoins (plus haut / plus bas précédent, Support…)`);
  if (fp.length) errors++;
} else {
  const errs = [...scanSources(SOURCES, (f) => fs.readFileSync(f, "utf8")), ...scanTexts(generated())];
  errors = errs.length;
  for (const e of errs.slice(0, 20)) lines.push(`  ERREUR ${e}`);
  lines.push(`${SOURCES.length} fichiers sources, textes générés (3 langues × 3 niveaux)`);
}
console.log(lines.join("\n"));
console.log(`RESULTAT erreurs=${errors} avertissements=0`);
