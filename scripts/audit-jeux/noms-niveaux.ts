// Même nom partout (règle PO) : un niveau cité dans l'énoncé ou l'explication d'un scénario porte
// sur le graphique le même nom. Exemple : un énoncé « support majeur » face à une zone
// « Support UT supérieure » ; un « haut du range » cité sans zone « Haut du range ».
// Pour chaque scénario des 4 jeux : textes du modèle (titre, énoncé, explications, leçons) et
// justifications générées des stops, comparés aux libellés des zones de ses graphiques (tous
// niveaux, 40 graines). Un nom de niveau cité exige une zone de ce nom ; un qualificatif
// (« majeur ») absent de tout libellé est refusé.
// Usage : npx vite-node scripts/audit-jeux/noms-niveaux.ts [--autotest] (lancé par run.mjs)
import { auditCtx } from "./market-ctx";
import * as BS from "../../lib/games/buy-sell-no-trade";
import * as FTM from "../../lib/games/find-the-mistake";
import * as PS from "../../lib/games/place-stop";
import * as BT from "../../lib/games/build-the-trade";

/** Nom cité dans un texte → libellé de zone attendu sur le graphique */
export const LEVEL_NAMES: { name: string; text: RegExp; label: RegExp }[] = [
  { name: "support / résistance « majeur »", text: /(?<!\p{L})(supports?|résistances?) majeur(e|s|es)?(?!\p{L})/iu, label: /majeur/i },
  { name: "support de l'UT supérieure", text: /(?<!\p{L})supports? (de l'|d'|)UT supérieure/iu, label: /^support (de l'|)UT supérieure/i },
  { name: "résistance de l'UT supérieure", text: /(?<!\p{L})résistances? (de l'|d'|)UT supérieure/iu, label: /^résistance (de l'|)UT supérieure/i },
  { name: "haut du range", text: /(?<!\p{L})haut du range/iu, label: /^haut du range/i },
  { name: "bas du range", text: /(?<!\p{L})bas du range/iu, label: /^bas du range/i },
  { name: "plus haut précédent", text: /(?<!\p{L})plus haut précédent/iu, label: /^plus haut précédent/i },
  { name: "plus bas précédent", text: /(?<!\p{L})plus bas précédent/iu, label: /^plus bas précédent/i },
  { name: "support cassé", text: /(?<!\p{L})support cassé/iu, label: /^(support cassé|ancien support)/i },
  { name: "résistance cassée", text: /(?<!\p{L})résistance cassée/iu, label: /^(résistance cassée|ancienne résistance)/i },
];

/** Noms cités dans `texts` sans zone du même nom parmi `labels` */
export function missingNames(texts: string[], labels: string[]): string[] {
  const out: string[] = [];
  for (const n of LEVEL_NAMES) {
    const hit = texts.find((t) => n.text.test(t));
    if (hit && !labels.some((l) => n.label.test(l))) out.push(`« ${hit.match(n.text)![0]} » cité sans zone de ce nom (${n.name})`);
  }
  return out;
}

const DIFFS = ["beginner", "intermediate", "advanced"] as const;
const VOLS = ["faible", "normale", "élevée"] as const;
const SEEDS = 40;
// Textes affichés d'un modèle : toutes ses chaînes, sauf identifiants et étiquettes internes
const strings = (o: unknown, skip = new Set(["id", "tags", "tag", "chartShape", "difficulties", "correctAnswer", "correctMistake", "decoyMistakes", "metric", "htfBias", "macroContext", "direction"])): string[] =>
  typeof o === "string" ? [o]
  : Array.isArray(o) ? o.flatMap((x) => strings(x, skip))
  : o && typeof o === "object" ? Object.entries(o).flatMap(([k, v]) => (skip.has(k) ? [] : strings(v, skip)))
  : [];

type Item = { game: string; id: string; texts: string[]; labels: Set<string> };
function collect(): Item[] {
  const items: Item[] = [];
  const add = (game: string, id: string, texts: string[], labels: string[]) => {
    let it = items.find((x) => x.game === game && x.id === id);
    if (!it) { it = { game, id, texts: [], labels: new Set() }; items.push(it); }
    it.texts.push(...texts); labels.forEach((l) => it!.labels.add(l));
  };
  for (const t of BS.SCENARIO_TEMPLATES) for (const d of t.difficulties) for (let n = 0; n < SEEDS; n++) {
    const seed = 1000 + n * 7919; const ch = BS.buildChart(t.id, seed, VOLS[n % 3], d, auditCtx(seed));
    add("Buy/Sell", t.id, n ? [] : strings(t), ch.zones.map((z) => z.label));
  }
  for (const t of FTM.MISTAKE_TEMPLATES) for (let n = 0; n < SEEDS; n++) {
    const seed = 1000 + n * 7919; const ch = FTM.buildScenarioChart(t, seed, VOLS[n % 3], auditCtx(seed));
    add("Trouve l'erreur", t.id, n ? [] : strings(t), ch.zones.map((z) => z.label));
  }
  for (const t of PS.PLACE_STOP_TEMPLATES) for (const d of t.difficulties) for (let n = 0; n < SEEDS; n++) {
    const seed = 1000 + n * 7919; const ch = PS.buildPlaceStopChart(t.id, seed, VOLS[n % 3], d, auditCtx(seed));
    add("Place ton Stop", t.id, [...(n ? [] : strings(t)), ...ch.stops.map((s) => s.rationale)], ch.zones.map((z) => z.label));
  }
  for (const t of BT.BUILD_TRADE_TEMPLATES) for (let n = 0; n < SEEDS; n++) {
    const seed = 1000 + n * 7919; const ch = BT.buildBuildTradeChart(t, seed, VOLS[n % 3], auditCtx(seed));
    add("Build the Trade", t.id, n ? [] : strings(t), ch.zones.map((z) => z.label));
  }
  void DIFFS;
  return items;
}

let errors = 0;
const lines: string[] = [];
if (process.argv.includes("--autotest")) {
  // Défauts injectés (le cas vu par le PO et ses voisins) : chacun doit être détecté
  const cases: [string, string[], string[], boolean][] = [
    ["énoncé « support majeur », zone « Support UT supérieure »", ["Le prix vient d'arriver sur un support majeur après une correction."], ["Support UT supérieure"], true],
    ["« haut du range » cité, aucune zone de ce nom", ["L'objectif naturel est le haut du range."], ["Bas du range"], true],
    ["« plus bas précédent » cité, zone « Swing low »", ["Le stop se place sous le plus bas précédent."], ["Swing low"], true],
    ["témoin : « support de l'UT supérieure » et sa zone", ["Le prix revient sur un support de l'UT supérieure."], ["Support UT supérieure"], false],
    ["témoin : « haut du range » et sa zone", ["Le prix rejette le haut du range."], ["Haut du range", "Bas du range"], false],
  ];
  for (const [name, texts, labels, expect] of cases) {
    const got = missingNames(texts, labels).length > 0;
    const ok = got === expect;
    lines.push(`${ok ? (expect ? "détecté" : "aucun faux positif") : (expect ? "MANQUÉ " : "FAUX POSITIF")}  ${name}`);
    if (!ok) errors++;
  }
} else {
  const items = collect();
  for (const it of items) {
    const miss = missingNames(it.texts, [...it.labels]);
    errors += miss.length;
    for (const m of miss) lines.push(`  ERREUR ${it.game} · ${it.id} : ${m} (zones : ${[...it.labels].join(", ") || "aucune"})`);
  }
  lines.push(`${items.length} scénarios contrôlés`);
}
console.log(lines.join("\n"));
console.log(`RESULTAT erreurs=${errors} avertissements=0`);
