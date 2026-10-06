#!/usr/bin/env node
// ─── Contrôle d'exposition du contenu premium (lecture seule) ───────────────
//
// Pour chaque route de contenu protégé (formations, macro, stratégies, jeux),
// le script :
//   1. demande la page SANS être connecté (aucun cookie, requête GET simple) ;
//   2. cherche la phrase marqueur de la route dans le HTML reçu (y compris les
//      données RSC embarquées dans les balises <script>) ;
//   3. télécharge les fichiers JavaScript référencés par la page (balises
//      <script>, préchargements, et chunks cités dans les données RSC) et y
//      cherche aussi le marqueur ;
//   4. affiche un tableau « EXPOSÉ / protégé » par route.
//
// Aucune écriture, aucune connexion, aucun POST : uniquement des GET anonymes.
//
// Usage :
//   npm run build && npm start          (dans un autre terminal)
//   node scripts/check-premium-exposure.mjs
//   node scripts/check-premium-exposure.mjs --base http://localhost:3000
//   node scripts/check-premium-exposure.mjs --only strategies/smc
//   node scripts/check-premium-exposure.mjs --build-dir .next
//        (option : cherche aussi le marqueur dans TOUS les fichiers de
//         .next/static, servis publiquement sous /_next/static/ même quand la
//         page ne les référence pas)
//   node scripts/check-premium-exposure.mjs --json   (sortie JSON brute)
//
// Code de sortie : 0 si aucune route exposée, 1 si au moins une route est
// exposée, 2 si le serveur est injoignable.
//
// Les marqueurs sont des phrases du contenu FR de chaque route, vérifiées
// uniques dans le code source au moment de la rédaction de ce script. Si le
// texte d'une leçon change, mettre à jour son marqueur ci-dessous.

import fs from "node:fs";
import path from "node:path";

// ─── Inventaire des routes protégées (verrou : LockedContentLayout) ─────────
// type : "serveur" (texte rendu côté serveur), "client" ("use client"),
//        "jeu" (page "use client" + données lib/games/*).
const ROUTES = [
  { path: "/fr/formations/avance/lecon1", type: "serveur", source: "app/[locale]/(premium)/formations/avance/lecon1/page.tsx", marker: "Identifie les EQH / EQL sur le graphique" },
  { path: "/fr/formations/avance/lecon2", type: "serveur", source: "app/[locale]/(premium)/formations/avance/lecon2/page.tsx", marker: "La bougie qui précède le mouvement. Retiens sa mèche haute (pour un" },
  { path: "/fr/formations/avance/lecon3", type: "serveur", source: "app/[locale]/(premium)/formations/avance/lecon3/page.tsx", marker: "OB formé (mouvement impulsif crée la zone) → zone active, non mitigée" },
  { path: "/fr/formations/avance/lecon4", type: "serveur", source: "app/[locale]/(premium)/formations/avance/lecon4/page.tsx", marker: "Entre 10h et 13h (après Londres et avant NY), la liquidité chute. Les" },
  { path: "/fr/formations/avance/lecon5", type: "serveur", source: "app/[locale]/(premium)/formations/avance/lecon5/page.tsx", marker: "Note le swing low (A) et le swing high (B) du mouvement impulsif qui" },
  { path: "/fr/formations/avance/lecon6", type: "serveur", source: "app/[locale]/(premium)/formations/avance/lecon6/page.tsx", marker: "Mèche longue qui dépasse un niveau évident" },
  { path: "/fr/formations/avance/lecon7", type: "serveur", source: "app/[locale]/(premium)/formations/avance/lecon7/page.tsx", marker: "Les 3 méthodes : rejet de bougie, retest du niveau cassé, sweep +" },
  { path: "/fr/formations/avance/lecon8", type: "serveur", source: "app/[locale]/(premium)/formations/avance/lecon8/page.tsx", marker: "Biais de marché (haussier / baissier / neutre)" },
  { path: "/fr/formations/avance/lecon9", type: "serveur", source: "app/[locale]/(premium)/formations/avance/lecon9/page.tsx", marker: "Enregistre chaque trade dans ton journal : confluences présentes" },
  { path: "/fr/formations/debutant/lecon1", type: "client", source: "app/[locale]/(premium)/formations/debutant/lecon1/_content-fr.tsx + lib/lessons.ts", marker: "Si les acheteurs sont plus nombreux et plus agressifs → le prix monte" },
  { path: "/fr/formations/debutant/lecon2", type: "serveur", source: "lib/lessons.ts (lecon2) via DebutantLessonView", marker: "Long = tu veux que le prix monte APRÈS que tu aies acheté" },
  { path: "/fr/formations/debutant/lecon3", type: "serveur", source: "app/[locale]/(premium)/formations/debutant/lecon3/page.tsx", marker: "Open (O), le prix au moment où la période commence" },
  { path: "/fr/formations/debutant/lecon4", type: "serveur", source: "app/[locale]/(premium)/formations/debutant/lecon4/page.tsx", marker: "BID = prix de vente (toujours le moins élevé des deux)" },
  { path: "/fr/formations/debutant/lecon5", type: "serveur", source: "app/[locale]/(premium)/formations/debutant/lecon5/page.tsx", marker: "Le gain ou la perte en argent dépend de la taille de ta position, ton" },
  { path: "/fr/formations/debutant/lecon6", type: "serveur", source: "lib/lessons.ts (lecon6) via DebutantLessonView", marker: "Exemple concret : avec et sans Take Profit" },
  { path: "/fr/formations/debutant/lecon7", type: "serveur", source: "lib/lessons.ts (lecon7) via DebutantLessonView", marker: "Exemple concret : avec et sans Break Even" },
  { path: "/fr/formations/debutant/lecon8", type: "serveur", source: "lib/lessons.ts (lecon8) via DebutantLessonView", marker: "Les lots minimum sur Forex génèrent souvent 10 à 20 € de risque même" },
  { path: "/fr/formations/debutant/lecon9", type: "serveur", source: "lib/lessons.ts (lecon9) via DebutantLessonView", marker: "Ces erreurs sont universelles, expérimentés et débutants en font tous" },
  { path: "/fr/formations/debutant/lecon10", type: "serveur", source: "app/[locale]/(premium)/formations/debutant/lecon10/page.tsx", marker: "Frustration → augmentation du lot pour « rattraper »" }, // espaces insécables (U+00A0) comme dans la source
  { path: "/fr/formations/intermediaire/lecon1", type: "serveur", source: "app/[locale]/(premium)/formations/intermediaire/lecon1/page.tsx", marker: "Ne commence jamais par le M15, tu perdrais le contexte global" },
  { path: "/fr/formations/intermediaire/lecon2", type: "serveur", source: "app/[locale]/(premium)/formations/intermediaire/lecon2/page.tsx", marker: "Cherche les creux alignés sur le graphique" },
  { path: "/fr/formations/intermediaire/lecon3", type: "serveur", source: "app/[locale]/(premium)/formations/intermediaire/lecon3/page.tsx", marker: "Trace ton rectangle sur cette consolidation" },
  { path: "/fr/formations/intermediaire/lecon4", type: "serveur", source: "app/[locale]/(premium)/formations/intermediaire/lecon4/page.tsx", marker: "EUR/USD Daily haussier. Le prix vient de faire un nouveau HH à" },
  { path: "/fr/formations/intermediaire/lecon5", type: "serveur", source: "app/[locale]/(premium)/formations/intermediaire/lecon5/page.tsx", marker: "Un niveau où le prix a déjà réagi. Un ancien support, une résistance" },
  { path: "/fr/formations/intermediaire/lecon6", type: "serveur", source: "app/[locale]/(premium)/formations/intermediaire/lecon6/page.tsx", marker: "Mèche haute + clôture sous la résistance" },
  { path: "/fr/formations/intermediaire/lecon7", type: "serveur", source: "app/[locale]/(premium)/formations/intermediaire/lecon7/page.tsx", marker: "Entrée sur signal de bougie, timing final" },
  { path: "/fr/formations/intermediaire/lecon8", type: "serveur", source: "app/[locale]/(premium)/formations/intermediaire/lecon8/page.tsx", marker: "Les zones de support/résistance, SD zones et structures importantes" },
  { path: "/fr/formations/intermediaire/lecon9", type: "serveur", source: "app/[locale]/(premium)/formations/intermediaire/lecon9/page.tsx", marker: "Retracement superficiel, tendance très forte, peu de correction. Rare" },
  { path: "/fr/formations/macro/avance/lecon1", type: "client", source: "app/[locale]/(premium)/formations/macro/avance/lecon1/_content-fr.tsx", marker: "Tu observes DXY + EUR/USD entre 19h45 et 21h00" },
  { path: "/fr/formations/macro/avance/lecon2", type: "client", source: "app/[locale]/(premium)/formations/macro/avance/lecon2/_content-fr.tsx", marker: "Le taux de chômage. Parfois plus important que le headline si le" },
  { path: "/fr/formations/macro/avance/lecon3", type: "client", source: "app/[locale]/(premium)/formations/macro/avance/lecon3/_content-fr.tsx", marker: "Il reflète les attentes de taux Fed à court terme. Il bouge fort sur" },
  { path: "/fr/formations/macro/avance/lecon4", type: "client", source: "app/[locale]/(premium)/formations/macro/avance/lecon4/_content-fr.tsx", marker: "Nasdaq casse une résistance en risk-on → tu achètes, continuation" },
  { path: "/fr/formations/macro/debutant/lecon1", type: "client", source: "app/[locale]/(premium)/formations/macro/debutant/lecon1/_content-fr.tsx", marker: "un chiffre comme le NFP (publié chaque 1er vendredi du mois) peut" },
  { path: "/fr/formations/macro/debutant/lecon2", type: "client", source: "app/[locale]/(premium)/formations/macro/debutant/lecon2/_content-fr.tsx", marker: "Le dollar US est la devise de réserve mondiale" },
  { path: "/fr/formations/macro/debutant/lecon3", type: "client", source: "app/[locale]/(premium)/formations/macro/debutant/lecon3/_content-fr.tsx", marker: "Regarde uniquement les événements 3 étoiles (rouge)" },
  { path: "/fr/formations/macro/debutant/lecon4", type: "client", source: "app/[locale]/(premium)/formations/macro/debutant/lecon4/_content-fr.tsx", marker: "tu comprends pourquoi les banques centrales bougent" },
  { path: "/fr/formations/macro/debutant/lecon5", type: "client", source: "app/[locale]/(premium)/formations/macro/debutant/lecon5/_content-fr.tsx", marker: "Le dollar est la devise centrale du système financier mondial" },
  { path: "/fr/formations/macro/debutant/lecon6", type: "client", source: "app/[locale]/(premium)/formations/macro/debutant/lecon6/_content-fr.tsx", marker: "le prix peut traverser plusieurs niveaux" },
  { path: "/fr/formations/macro/intermediaire/lecon1", type: "client", source: "app/[locale]/(premium)/formations/macro/intermediaire/lecon1/_content-fr.tsx", marker: "un nouveau resserrement pourrait être approprié" },
  { path: "/fr/formations/macro/intermediaire/lecon2", type: "client", source: "app/[locale]/(premium)/formations/macro/intermediaire/lecon2/_content-fr.tsx", marker: "marché du travail solide = taux élevés maintenus" },
  { path: "/fr/formations/macro/intermediaire/lecon3", type: "client", source: "app/[locale]/(premium)/formations/macro/intermediaire/lecon3/_content-fr.tsx", marker: "→ les producteurs répercutent → CPI monte dans les semaines suivantes" },
  { path: "/fr/formations/macro/intermediaire/lecon4", type: "client", source: "app/[locale]/(premium)/formations/macro/intermediaire/lecon4/_content-fr.tsx", marker: ": volatilité institutionnelle maximale entre 14h et 17h" },
  { path: "/fr/formations/macro/intermediaire/lecon5", type: "client", source: "app/[locale]/(premium)/formations/macro/intermediaire/lecon5/_content-fr.tsx", marker: "montent souvent ensemble (corrélation positive forte)" },
  { path: "/fr/formations/macro/intermediaire/lecon6", type: "client", source: "app/[locale]/(premium)/formations/macro/intermediaire/lecon6/_content-fr.tsx", marker: "Y a-t-il un CPI, un NFP, un FOMC ou un cluster" },
  { path: "/fr/jeux/build-the-trade", type: "jeu", source: "lib/games/build-the-trade.ts", marker: "Tendance haussière nette. Le prix vient de finir un pullback" },
  { path: "/fr/jeux/buy-sell-no-trade", type: "jeu", source: "lib/games/buy-sell-no-trade.ts", marker: "Le prix consolide sous une résistance majeure puis vient de la casser" },
  { path: "/fr/jeux/find-the-mistake", type: "jeu", source: "lib/games/find-the-mistake.ts", marker: "Tu prends ce BUY pile sous une résistance HTF testée plusieurs fois" },
  { path: "/fr/jeux/place-stop", type: "jeu", source: "lib/games/place-stop.ts", marker: "Tendance haussière, le prix corrige sur la zone de demand. Tu es" },
  { path: "/fr/strategies/ict/lecon1", type: "client", source: "app/[locale]/(premium)/strategies/ict/lecon1/_content-fr.tsx", marker: "Le marché va chercher les zones de liquidité évidentes, equal" },
  { path: "/fr/strategies/ict/lecon2", type: "client", source: "app/[locale]/(premium)/strategies/ict/lecon2/_content-fr.tsx", marker: "Un FVG ou un OB seul ne vaut rien sans contexte structurel, sweep" },
  { path: "/fr/strategies/ict/lecon3", type: "client", source: "app/[locale]/(premium)/strategies/ict/lecon3/_content-fr.tsx", marker: "Le marché ne produit ses vrais mouvements que dans certaines fenêtres" },
  { path: "/fr/strategies/ict/lecon4", type: "client", source: "app/[locale]/(premium)/strategies/ict/lecon4/_content-fr.tsx", marker: "Un displacement est une séquence de bougies impulsives, pas une" },
  { path: "/fr/strategies/ict/lecon5", type: "client", source: "app/[locale]/(premium)/strategies/ict/lecon5/_content-fr.tsx", marker: "Le modèle ICT est une SÉQUENCE, liquidité, manipulation, déplacement" },
  { path: "/fr/strategies/macro-trading/lecon1", type: "client", source: "app/[locale]/(premium)/strategies/macro-trading/lecon1/_content-fr.tsx", marker: "La première impulsion FOMC est presque toujours portée par l’émotion" },
  { path: "/fr/strategies/macro-trading/lecon2", type: "client", source: "app/[locale]/(premium)/strategies/macro-trading/lecon2/_content-fr.tsx", marker: "La première impulsion NFP est portée par le chiffre headline, pas par" },
  { path: "/fr/strategies/macro-trading/lecon3", type: "client", source: "app/[locale]/(premium)/strategies/macro-trading/lecon3/_content-fr.tsx", marker: "Un régime risk-off se confirme par CONCORDANCE de plusieurs signaux" },
  { path: "/fr/strategies/macro-trading/lecon4", type: "client", source: "app/[locale]/(premium)/strategies/macro-trading/lecon4/_content-fr.tsx", marker: "Le filtre macro est une logique NÉGATIVE : chercher des raisons de" },
  { path: "/fr/strategies/multi-timeframe/lecon1", type: "client", source: "app/[locale]/(premium)/strategies/multi-timeframe/lecon1/_content-fr.tsx", marker: "Un seul timeframe donne une vision incomplète du marché" },
  { path: "/fr/strategies/multi-timeframe/lecon2", type: "client", source: "app/[locale]/(premium)/strategies/multi-timeframe/lecon2/_content-fr.tsx", marker: "Le HTF définit la direction dominante du marché" },
  { path: "/fr/strategies/multi-timeframe/lecon3", type: "client", source: "app/[locale]/(premium)/strategies/multi-timeframe/lecon3/_content-fr.tsx", marker: "Une zone forte cumule plusieurs raisons de réaction, la confluence" },
  { path: "/fr/strategies/multi-timeframe/lecon4", type: "client", source: "app/[locale]/(premium)/strategies/multi-timeframe/lecon4/_content-fr.tsx", marker: "Le LTF ne sert pas à analyser, il sert à confirmer que la zone réagit" },
  { path: "/fr/strategies/multi-timeframe/lecon5", type: "client", source: "app/[locale]/(premium)/strategies/multi-timeframe/lecon5/_content-fr.tsx", marker: "Le process descend toujours du HTF vers le LTF, jamais l’inverse" },
  { path: "/fr/strategies/price-action/lecon1", type: "client", source: "app/[locale]/(premium)/strategies/price-action/lecon1/_content-fr.tsx", marker: "Une bougie se lit par 4 éléments : taille du corps, mèches, position" },
  { path: "/fr/strategies/price-action/lecon2", type: "client", source: "app/[locale]/(premium)/strategies/price-action/lecon2/_content-fr.tsx", marker: "Le contact avec un niveau structurel est le critère le plus" },
  { path: "/fr/strategies/price-action/lecon3", type: "client", source: "app/[locale]/(premium)/strategies/price-action/lecon3/_content-fr.tsx", marker: "Engulfing = 2 bougies de sens opposé, la 2ème englobe ENTIÈREMENT le" },
  { path: "/fr/strategies/price-action/lecon4", type: "client", source: "app/[locale]/(premium)/strategies/price-action/lecon4/_content-fr.tsx", marker: "Daily = biais. H4 = zones. H1 = alignement structurel. M15 = timing" },
  { path: "/fr/strategies/reversal/lecon1", type: "client", source: "app/[locale]/(premium)/strategies/reversal/lecon1/_content-fr.tsx", marker: "Double top = 2 sommets quasi égaux sur une résistance après tendance" },
  { path: "/fr/strategies/reversal/lecon2", type: "client", source: "app/[locale]/(premium)/strategies/reversal/lecon2/_content-fr.tsx", marker: "Confirmation = clôture franche sous ou au-dessus de la neckline. Pas" },
  { path: "/fr/strategies/reversal/lecon3", type: "client", source: "app/[locale]/(premium)/strategies/reversal/lecon3/_content-fr.tsx", marker: "Une divergence seule ne suffit JAMAIS. La cassure du dernier" },
  { path: "/fr/strategies/reversal/lecon4", type: "client", source: "app/[locale]/(premium)/strategies/reversal/lecon4/_content-fr.tsx", marker: "Trader un reversal : checklist d’invalidation" },
  { path: "/fr/strategies/smc/lecon1", type: "client", source: "app/[locale]/(premium)/strategies/smc/lecon1/_content-fr.tsx", marker: "La lecture SMC distingue structure interne (M15/H1) et externe" },
  { path: "/fr/strategies/smc/lecon2", type: "client", source: "app/[locale]/(premium)/strategies/smc/lecon2/_content-fr.tsx", marker: "4 critères qualifient un BOS valide : clôture nette, displacement" },
  { path: "/fr/strategies/smc/lecon3", type: "client", source: "app/[locale]/(premium)/strategies/smc/lecon3/_content-fr.tsx", marker: "Le R/R minimum est 1:2. Le TP cible la prochaine zone structurelle ou" },
  { path: "/fr/strategies/smc/lecon4", type: "client", source: "app/[locale]/(premium)/strategies/smc/lecon4/_content-fr.tsx", marker: "La liquidité se concentre au-dessus des sommets et sous les creux" },
  { path: "/fr/strategies/smc/lecon5", type: "client", source: "app/[locale]/(premium)/strategies/smc/lecon5/_content-fr.tsx", marker: "Le trade SMC complet : de l’analyse de l’UT supérieure à l’exécution" },
  { path: "/fr/strategies/support-resistance/lecon1", type: "client", source: "app/[locale]/(premium)/strategies/support-resistance/lecon1/_content-fr.tsx", marker: "Une zone valide comporte minimum 2 touches confirmées, idéalement 3" },
  { path: "/fr/strategies/support-resistance/lecon2", type: "client", source: "app/[locale]/(premium)/strategies/support-resistance/lecon2/_content-fr.tsx", marker: "Les confluences (niveau rond, Fibonacci, MM, Order Block) multiplient" },
  { path: "/fr/strategies/support-resistance/lecon3", type: "client", source: "app/[locale]/(premium)/strategies/support-resistance/lecon3/_content-fr.tsx", marker: "Un flip exige une cassure qualifiée : clôture franche, distance" },
  { path: "/fr/strategies/support-resistance/lecon4", type: "client", source: "app/[locale]/(premium)/strategies/support-resistance/lecon4/_content-fr.tsx", marker: "Un fake breakout combine 4 critères : wick long sans clôture franche" },
  { path: "/fr/strategies/trend-following/lecon1", type: "client", source: "app/[locale]/(premium)/strategies/trend-following/lecon1/_content-fr.tsx", marker: "Une tendance exploitable exige 2 HL + 2 HH (haussière) ou 2 LH + 2 LL" },
  { path: "/fr/strategies/trend-following/lecon2", type: "client", source: "app/[locale]/(premium)/strategies/trend-following/lecon2/_content-fr.tsx", marker: "Une trendline tradable s’appuie sur 2 points minimum (3 idéalement)" },
  { path: "/fr/strategies/trend-following/lecon3", type: "client", source: "app/[locale]/(premium)/strategies/trend-following/lecon3/_content-fr.tsx", marker: "Pullback Fibonacci 0.618/0.786 : entrée optimale" },
  { path: "/fr/strategies/trend-following/lecon4", type: "client", source: "app/[locale]/(premium)/strategies/trend-following/lecon4/_content-fr.tsx", marker: "BOS = cassure du dernier extrême structurel dans le sens de la" },
];

// Phrase de l'écran de verrouillage FR (app/components/premium/paywall-strings.ts,
// contentLockedTitle) : sert de contrôle « le verrou est bien affiché ».
const LOCK_MARKER = "Profite de 48 heures offertes pour découvrir toute la plateforme";

// ─── Arguments ──────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
function argValue(name, fallback) {
  const i = args.indexOf(name);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
}
const BASE = argValue("--base", "http://localhost:3000").replace(/\/$/, "");
const ONLY = argValue("--only", null);
const BUILD_DIR = argValue("--build-dir", null);
const AS_JSON = args.includes("--json");

// ─── Recherche tolérante aux encodages ───────────────────────────────────────
// Le texte peut apparaître tel quel (HTML, JSON RSC) ou, dans du JavaScript
// minifié, avec les caractères non ASCII échappés (é, →…).
function variants(marker) {
  const esc = (upper) =>
    marker.replace(/[^\x20-\x7e]/g, (ch) => {
      const hex = ch.charCodeAt(0).toString(16).padStart(4, "0");
      return "\\u" + (upper ? hex.toUpperCase() : hex);
    });
  return [...new Set([marker, esc(false), esc(true)])];
}
function contains(haystack, marker) {
  return variants(marker).some((v) => haystack.includes(v));
}

// ─── HTTP (GET anonymes uniquement) ─────────────────────────────────────────
async function get(url) {
  const res = await fetch(url, {
    method: "GET",
    redirect: "manual",
    headers: { "user-agent": "check-premium-exposure/1.0", "accept-language": "fr" },
  });
  const body = res.status >= 300 && res.status < 400 ? "" : await res.text();
  return { status: res.status, location: res.headers.get("location"), body };
}

// Fichiers JS référencés par la page : <script src>, <link href=…js>, et
// chemins de chunks cités dans les données RSC (self.__next_f.push(...)).
function jsUrls(html) {
  const found = new Set();
  for (const m of html.matchAll(/(?:src|href)="([^"]+?\.js(?:\?[^"]*)?)"/g)) found.add(m[1]);
  for (const m of html.matchAll(/\/?_next\/static\/[^"'\s\\)]+?\.js/g)) found.add(m[0]);
  for (const m of html.matchAll(/(?<![\w/])static\/chunks\/[^"'\s\\)]+?\.js/g)) found.add("/_next/" + m[0]);
  return [...found].map((u) => {
    if (/^https?:\/\//.test(u)) return u;
    return BASE + (u.startsWith("/") ? u : "/" + u);
  });
}

const jsCache = new Map(); // url → contenu (ou "" si échec)
async function getJs(url) {
  if (!jsCache.has(url)) {
    jsCache.set(
      url,
      get(url)
        .then((r) => (r.status === 200 ? r.body : ""))
        .catch(() => ""),
    );
  }
  return jsCache.get(url);
}

// Option --build-dir : tous les .js publics de <build>/static.
function listBuildJs(dir) {
  const out = [];
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith(".js")) out.push(p);
    }
  };
  walk(path.join(dir, "static"));
  return out;
}

// ─── Exécution ──────────────────────────────────────────────────────────────
async function main() {
  try {
    await get(BASE + "/fr");
  } catch {
    console.error(`Serveur injoignable sur ${BASE}. Lancer d'abord : npm run build && npm start`);
    process.exit(2);
  }

  let buildFiles = null;
  if (BUILD_DIR) {
    buildFiles = listBuildJs(BUILD_DIR).map((f) => ({ f, s: fs.readFileSync(f, "utf8") }));
  }

  const routes = ONLY ? ROUTES.filter((r) => r.path.includes(ONLY)) : ROUTES;
  const results = [];

  for (const r of routes) {
    const row = { route: r.path, type: r.type, status: null, lock: false, html: false, js: false, jsFile: null, build: null, verdict: "" };
    try {
      const page = await get(BASE + r.path);
      row.status = page.status;
      if (page.status >= 300 && page.status < 400) {
        row.verdict = `redirigé (${page.location ?? "?"})`;
      } else {
        row.lock = contains(page.body, LOCK_MARKER);
        row.html = contains(page.body, r.marker);
        for (const url of jsUrls(page.body)) {
          const js = await getJs(url);
          if (js && contains(js, r.marker)) {
            row.js = true;
            row.jsFile = url.replace(BASE, "");
            break;
          }
        }
      }
      if (buildFiles) {
        const hit = buildFiles.find((b) => contains(b.s, r.marker));
        row.build = hit ? path.relative(BUILD_DIR, hit.f).split(path.sep).join("/") : false;
      }
      if (!row.verdict) row.verdict = row.html || row.js ? "EXPOSÉ" : "protégé";
    } catch (e) {
      row.verdict = "erreur : " + (e instanceof Error ? e.message : String(e));
    }
    results.push(row);
  }

  if (AS_JSON) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    const yn = (b) => (b ? "OUI" : "non");
    const header = ["Route", "Type", "HTTP", "Verrou affiché", "Marqueur HTML", "Marqueur JS chargé", ...(buildFiles ? ["Dans build public"] : []), "Verdict"];
    const rows = results.map((x) => [
      x.route,
      x.type,
      String(x.status ?? "-"),
      yn(x.lock),
      yn(x.html),
      x.js ? "OUI" : "non",
      ...(buildFiles ? [x.build ? "OUI" : "non"] : []),
      x.verdict,
    ]);
    const widths = header.map((h, i) => Math.max(h.length, ...rows.map((row) => row[i].length)));
    const line = (cells) => cells.map((c, i) => c.padEnd(widths[i])).join(" | ");
    console.log(line(header));
    console.log(widths.map((w) => "-".repeat(w)).join("-|-"));
    for (const row of rows) console.log(line(row));
    const exposed = results.filter((x) => x.verdict === "EXPOSÉ").length;
    console.log(`\n${exposed} route(s) exposée(s) sur ${results.length}. Fichiers JS téléchargés : ${jsCache.size}.`);
  }

  process.exit(results.some((x) => x.verdict === "EXPOSÉ") ? 1 : 0);
}

main();
