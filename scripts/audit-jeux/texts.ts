// Audit des textes des 4 jeux.
// Usage : npx vite-node scripts/audit-jeux/texts.ts (lancé par run.mjs)
//
// 1. Français détecté dans les textes EN et ES (modèles, libellés, justifications).
// 2. Ton des explications (leçons, explications, justifications, plan optimal,
//    justifications de stops) en FR / EN / ES : ni « = » ni affirmation absolue.
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

type Lang = "fr" | "en" | "es";
// Champs internes (identifiants, énumérations en français côté code) : non affichés tels quels
const INTERNAL = new Set(["id", "macroContext", "htfBias", "direction", "chartShape", "category", "correctMistake", "decoyMistakes",
  "difficulties", "showLines", "metric", "correctAnswer", "kind", "optimal", "metaOverride", "tag", "dotClass", "textClass", "color", "type"]);
const EXPLAIN = new Set(["beginner", "intermediate", "advanced", "explanation", "BUY", "SELL", "NO_TRADE", "optimalExplain", "rationale"]);
const FRENCH: Record<Exclude<Lang, "fr">, RegExp> = {
  en: /(?<!\p{L})(et|les|des|est|une|du|avec|sans|dans|pour|mais|le|la|ton|ta)(?!\p{L})|[çèêàùœ]|heures mortes|é/iu,
  es: /(?<!\p{L})(et|des|est|une|du|avec|sans|dans|pour|mais|ton|ta|pile|être)(?!\p{L})|[çèêàùœ]|heures mortes/iu,
};
const ABSOLUTE: Record<Lang, RegExp[]> = {
  fr: [/(^|\s)=(\s|$)/, /\bjamais\b/i, /\btoujours\b/i, /\bgaranti/i, /\bassuré/i, /aucune exception/i, /règle absolue/i, /règle d'or/i, /à coup sûr/i, /pas négociable/i, /systématiquement/i],
  en: [/(^|\s)=(\s|$)/, /\bnever\b/i, /\balways\b/i, /\bguarantee/i, /no exceptions?/i, /absolute rule/i, /golden rule/i, /non-negotiable/i, /systematically/i],
  es: [/(^|\s)=(\s|$)/, /\bnunca\b/i, /\bsiempre\b/i, /\bgarantiz/i, /sin excepci/i, /regla absoluta/i, /regla de oro/i, /no negociable/i, /jamás/i, /sistemáticamente/i],
};
// Termes de trading et noms propres partagés, retirés avant la détection du français
const SHARED = /NO TRADE|Stop \d|London|Londres|New York|Overlap|FOMC|NFP|CPI|Powell|XAU\/USD|EUR\/USD|BTC\/USD|NASDAQ/g;

const texts: { lang: Lang; where: string; key: string; text: string }[] = [];
function collect(lang: Lang, where: string, v: unknown, key = "") {
  if (typeof v === "string") { texts.push({ lang, where, key, text: v }); return; }
  if (Array.isArray(v)) { v.forEach((x, i) => collect(lang, `${where}[${i}]`, x, key)); return; }
  if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) if (!INTERNAL.has(k)) collect(lang, `${where}.${k}`, x, k);
}
const MODULES = [
  ["Buy/Sell/No Trade", { fr: BS, en: BSEN, es: BSES }, ["SCENARIO_TEMPLATES", "DIFFICULTY_META"]],
  ["Trouve l'erreur", { fr: FTM, en: FTMEN, es: FTMES }, ["MISTAKE_TEMPLATES", "MISTAKE_LABELS", "CATEGORY_META", "DIFFICULTY_META"]],
  ["Place ton Stop", { fr: PS, en: PSEN, es: PSES }, ["PLACE_STOP_TEMPLATES", "STOP_TYPE_META", "DIFFICULTY_META"]],
  ["Build the Trade", { fr: BT, en: BTEN, es: BTES }, ["BUILD_TRADE_TEMPLATES", "ENTRY_LABELS", "STOP_LABELS", "TP_LABELS", "DIFFICULTY_META"]],
] as const;
for (const [game, mods, names] of MODULES) for (const lang of ["fr", "en", "es"] as const) {
  const mod = mods[lang] as unknown as Record<string, unknown>;
  for (const n of names) collect(lang, `${game} ${n}`, mod[n]);
}
// Justifications des stops (portées par les graphiques) et verdicts de Build the Trade
for (const [lang, G] of [["fr", PS], ["en", PSEN], ["es", PSES]] as const) {
  for (const d of ["beginner", "intermediate", "advanced"] as const) for (let s = 1; s <= 40; s++) for (const inst of G.generatePlaceStopScenarios(s * 7919, d)) {
    for (const st of G.buildPlaceStopChart(inst.id, inst.seed, inst.volatility, d).stops) texts.push({ lang, where: `Place ton Stop ${inst.id}`, key: "rationale", text: st.rationale });
  }
}
for (const [lang, G] of [["fr", BT], ["en", BTEN], ["es", BTES]] as const) {
  for (const outcome of ["tp_hit", "sl_hit", "open", "no_fill"] as const) for (const q of [0, 1, 2, 3]) {
    const v = G.setupVerdict({ outcome, qualityMatch: q } as Parameters<typeof G.setupVerdict>[0]);
    texts.push({ lang, where: "Build the Trade setupVerdict", key: "label", text: v.label });
  }
}

let errors = 0;
const lines: string[] = [];
// 3. Parité des modèles FR / EN / ES : mêmes scénarios, difficultés et bonnes réponses
const PARITY_KEYS = ["difficulties", "correctAnswer", "correctMistake", "decoyMistakes", "direction", "htfBias", "macroContext", "optimal", "chartShape"];
for (const [game, mods, names] of MODULES) {
  const list = (lang: Lang) => ((mods[lang] as unknown as Record<string, unknown>)[names[0]] as Record<string, unknown>[]);
  const sig = (t: Record<string, unknown>) => JSON.stringify(PARITY_KEYS.map((k) => t[k] ?? null));
  const fr = new Map(list("fr").map((t) => [t.id as string, sig(t)]));
  for (const lang of ["en", "es"] as const) {
    const other = new Map(list(lang).map((t) => [t.id as string, sig(t)]));
    for (const id of new Set([...fr.keys(), ...other.keys()])) {
      if (fr.get(id) !== other.get(id)) { errors++; lines.push(`  ERREUR parité ${game} ${lang.toUpperCase()} « ${id} » : FR ${fr.get(id) ?? "absent"} / ${lang.toUpperCase()} ${other.get(id) ?? "absent"}`); }
    }
  }
}
const seen = new Set<string>();
for (const t of texts) {
  const id = `${t.lang}|${t.text}`;
  if (seen.has(id)) continue;
  seen.add(id);
  if (t.lang !== "fr") {
    const m = t.text.replace(SHARED, "").match(FRENCH[t.lang]);
    if (m) { errors++; if (errors <= 20) lines.push(`  ERREUR français en ${t.lang.toUpperCase()} (« ${m[0]} ») ${t.where} : ${t.text.slice(0, 90)}`); }
  }
  if (EXPLAIN.has(t.key) && t.text.length > 1) {
    const re = ABSOLUTE[t.lang].find((r) => r.test(t.text));
    if (re) { errors++; if (errors <= 20) lines.push(`  ERREUR ton ${t.lang.toUpperCase()} (${re}) ${t.where}.${t.key} : ${t.text.slice(0, 90)}`); }
  }
}
const count = (l: Lang) => [...seen].filter((s) => s.startsWith(`${l}|`)).length;
lines.push(`Textes contrôlés : FR ${count("fr")}, EN ${count("en")}, ES ${count("es")}`);
console.log(lines.join("\n"));
console.log(`RESULTAT erreurs=${errors} avertissements=0`);
