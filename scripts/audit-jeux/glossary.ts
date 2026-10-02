// Audit du vocabulaire des 4 jeux : vocabulaire des jeux = vocabulaire des leçons.
// Usage : npx vite-node scripts/audit-jeux/glossary.ts (lancé par run.mjs)
//
// 1. Chaque libellé de zone affiché sur un graphique (FR, ES) appartient au
//    glossaire (lib/games/glossary.ts, ZONE_LABELS).
// 2. Aucun terme retiré (REPLACED : absent des leçons ou doublon d'une même
//    notion) dans les textes FR / ES des jeux.
// 3. Une définition portée par le texte (ATR) apparaît une fois par round.
// 4. Chaque terme du glossaire a une explication FR et ES.
import { auditCtx } from "./market-ctx";
import { GLOSSARY, REPLACED, ZONE_LABELS } from "../../lib/games/glossary";
import * as BS from "../../lib/games/buy-sell-no-trade";
import * as BSES from "../../lib/games/buy-sell-no-trade-es";
import * as FTM from "../../lib/games/find-the-mistake";
import * as FTMES from "../../lib/games/find-the-mistake-es";
import * as PS from "../../lib/games/place-stop";
import * as PSES from "../../lib/games/place-stop-es";
import * as BT from "../../lib/games/build-the-trade";
import * as BTES from "../../lib/games/build-the-trade-es";

type Lang = "fr" | "es";
const VOLS = ["faible", "normale", "élevée"] as const;
const DIFFS = ["beginner", "intermediate", "advanced"] as const;
const SEEDS = 12;

let errors = 0;
const lines: string[] = [];
const fail = (msg: string) => { errors++; if (errors <= 25) lines.push(`  ERREUR ${msg}`); };

// 1. Libellés de zones générés (toutes difficultés, volatilités, quelques graines)
const zoneLabels: Record<Lang, Map<string, string>> = { fr: new Map(), es: new Map() };
const addZones = (lang: Lang, where: string, zones: { label?: string }[]) => {
  for (const z of zones) if (z.label && !zoneLabels[lang].has(z.label)) zoneLabels[lang].set(z.label, where);
};
for (const [lang, B, F, P, T] of [["fr", BS, FTM, PS, BT], ["es", BSES, FTMES, PSES, BTES]] as const) {
  for (let n = 0; n < SEEDS; n++) for (const vol of VOLS) {
    const seed = (n * 2654435761 + 17) >>> 0;
    for (const t of B.SCENARIO_TEMPLATES) for (const d of t.difficulties) addZones(lang, `Buy/Sell ${t.id}`, B.buildChart(t.id, seed, vol, d, auditCtx(seed)).zones);
    for (const t of F.MISTAKE_TEMPLATES) addZones(lang, `Trouve l'erreur ${t.id}`, F.buildScenarioChart(t, seed, vol, auditCtx(seed)).zones);
    for (const t of P.PLACE_STOP_TEMPLATES) for (const d of t.difficulties) addZones(lang, `Place ton Stop ${t.id}`, P.buildPlaceStopChart(t.id, seed, vol, d, auditCtx(seed)).zones);
    for (const t of T.BUILD_TRADE_TEMPLATES) addZones(lang, `Build the Trade ${t.id}`, T.buildBuildTradeChart(t, seed, vol, auditCtx(seed)).zones);
  }
}
for (const lang of ["fr", "es"] as const) {
  const allowed = new Set(ZONE_LABELS[lang]);
  for (const [label, where] of zoneLabels[lang]) if (!allowed.has(label)) fail(`zone hors glossaire ${lang.toUpperCase()} « ${label} » (${where})`);
}

// 2. Termes retirés : textes FR / ES des modules (hors champs internes)
const INTERNAL = new Set(["id", "macroContext", "htfBias", "direction", "chartShape", "category", "correctMistake", "decoyMistakes",
  "difficulties", "showLines", "metric", "correctAnswer", "kind", "optimal", "metaOverride", "tag", "dotClass", "textClass", "color", "type"]);
const texts: { lang: Lang; where: string; text: string }[] = [];
const collect = (lang: Lang, where: string, v: unknown) => {
  if (typeof v === "string") { texts.push({ lang, where, text: v }); return; }
  if (Array.isArray(v)) { v.forEach((x) => collect(lang, where, x)); return; }
  if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) if (!INTERNAL.has(k)) collect(lang, `${where}.${k}`, x);
};
const MODULES = [
  ["Buy/Sell/No Trade", { fr: BS, es: BSES }, ["SCENARIO_TEMPLATES", "DIFFICULTY_META"]],
  ["Trouve l'erreur", { fr: FTM, es: FTMES }, ["MISTAKE_TEMPLATES", "MISTAKE_LABELS", "CATEGORY_META", "DIFFICULTY_META"]],
  ["Place ton Stop", { fr: PS, es: PSES }, ["PLACE_STOP_TEMPLATES", "STOP_TYPE_META", "DIFFICULTY_META"]],
  ["Build the Trade", { fr: BT, es: BTES }, ["BUILD_TRADE_TEMPLATES", "ENTRY_LABELS", "STOP_LABELS", "TP_LABELS", "DIFFICULTY_META"]],
] as const;
for (const [game, mods, names] of MODULES) for (const lang of ["fr", "es"] as const) {
  const mod = mods[lang] as unknown as Record<string, unknown>;
  for (const n of names) collect(lang, `${game} ${n}`, mod[n]);
}
for (const [lang, G] of [["fr", PS], ["es", PSES]] as const) for (const d of DIFFS) for (let s = 1; s <= 20; s++) for (const inst of G.generatePlaceStopScenarios(s * 7919, d)) {
  for (const st of G.buildPlaceStopChart(inst.id, inst.seed, inst.volatility, d).stops) texts.push({ lang, where: `Place ton Stop ${inst.id} (justification)`, text: st.rationale });
}
for (const [lang, labels] of Object.entries(zoneLabels) as [Lang, Map<string, string>][]) for (const [label, where] of labels) texts.push({ lang, where: `${where} (zone)`, text: label });

const seen = new Set<string>();
for (const t of texts) {
  const id = `${t.lang}|${t.text}`;
  if (seen.has(id)) continue;
  seen.add(id);
  for (const r of REPLACED[t.lang]) {
    const m = t.text.match(r.from);
    if (m) fail(`terme retiré ${t.lang.toUpperCase()} « ${m[0]} » → « ${r.to} » (${t.where}) : ${t.text.slice(0, 80)}`);
  }
}

// 3. Définition portée par le texte (ATR) : une seule fois par round, à sa
//    première apparition. Place ton Stop la dédoublonne à l'affichage
//    (firstDefinitionOnly : contexte, justifications, leçon).
const strings = (v: unknown): string[] => typeof v === "string" ? [v] : Array.isArray(v) ? v.flatMap(strings)
  : v && typeof v === "object" ? Object.values(v).flatMap(strings) : [];
const ROUND_TEXTS = [
  ["Buy/Sell/No Trade", { fr: BS.SCENARIO_TEMPLATES, es: BSES.SCENARIO_TEMPLATES }, ["context", "shortContext", "rationales"]],
  ["Trouve l'erreur", { fr: FTM.MISTAKE_TEMPLATES, es: FTMES.MISTAKE_TEMPLATES }, ["context", "explanation", "extraInfo"]],
  ["Build the Trade", { fr: BT.BUILD_TRADE_TEMPLATES, es: BTES.BUILD_TRADE_TEMPLATES }, ["context", "optimalExplain"]],
] as const;
for (const [game, lists, keys] of ROUND_TEXTS) for (const lang of ["fr", "es"] as const) {
  for (const t of lists[lang] as unknown as Record<string, unknown>[]) for (const d of DIFFS) {
    const shown = [...keys.flatMap((k) => strings(t[k])), ...strings((t.lessons as Record<string, unknown> | undefined)?.[d])].join("\n");
    for (const g of GLOSSARY) if (g.inlineDef) {
      const n = shown.split(g.inlineDef[lang]).length - 1;
      if (n > 1) fail(`définition ${g.term[lang]} répétée ${n} fois dans un round ${lang.toUpperCase()} (${game} ${t.id}, ${d})`);
    }
  }
}

// 4. Glossaire complet
for (const g of GLOSSARY) for (const lang of ["fr", "es"] as const) {
  if (!g.term[lang] || !g.def[lang] || g.def[lang].length < 15) fail(`glossaire « ${g.id} » : explication ${lang.toUpperCase()} manquante`);
}

lines.push(`Libellés de zones : FR ${zoneLabels.fr.size}, ES ${zoneLabels.es.size} ; textes contrôlés : ${seen.size} ; glossaire : ${GLOSSARY.length} termes`);
console.log(lines.join("\n"));
console.log(`RESULTAT erreurs=${errors} avertissements=0`);
