// Audit DOM des 4 jeux (navigateur) : joue une session complète par jeu × langue × format.
// Usage : node scripts/audit-jeux/dom.mjs [--base=http://localhost:3000] [--jeux=place-stop,...] [--langues=fr,es] [--formats=390,1440]
//         node scripts/audit-jeux/dom.mjs --autotest   → défauts injectés dans les étiquettes, chacun doit être détecté
// Nécessite le serveur de dev déjà lancé (le script ne le démarre jamais).
// Jeux réservés aux membres : AUDIT_STORAGE_STATE=<fichier> réutilise une session
// premium enregistrée par Playwright (storage state, hors dépôt). Les jeux
// n'écrivent qu'en localStorage : aucune écriture en base.
//
// Règles :
//  - troncature : aucun texte coupé (ellipsis / overflow caché) ni hors écran, sur
//    l'écran de niveau, la 1re question, le 1er verdict et le bilan ;
//  - sonde Place ton Stop : ordre vertical des lignes = ordre des étiquettes
//    « Stop 1/2/3 » = ordre des boutons (couleurs et numéros) ;
//  - étiquettes du graphique (question, chaque étape de Build the Trade, verdict) :
//    toute ligne étiquetée à sa hauteur (par sa propre étiquette, qui la traverse), aucun chevauchement, aucune posée sur une
//    bougie (corps ou mèche), aucune hors du graphique, au plus 4 en 390,
//    mêmes noms que les boutons, aucun doublon avec une légende ;
//  - graphique (question et verdict) : zones derrière les bougies, corps au moins 3 fois plus
//    large que la mèche, bougies (suite comprise) sur au moins 45 % de la largeur et 50 % de la hauteur du cadre (40 % hors Place ton Stop), graphique entier dans l'écran en 390 × 844 sans défiler (sous le
//    bandeau du site, au-dessus de la barre du navigateur) ;
//  - verdict : état (bon / partiel / faux), couleurs du titre et des points
//    cohérentes, maximum affiché ; barème simple : bon > 0, faux = 0 (sans signe) ;
//  - lignes au verdict (entrée, TP, stops, erreur marquée) : chacune a un rendu
//    non nul (le graphique change quand on la masque).
import { chromium } from "playwright";
import { languesAuditees } from "./langues-node.mjs";

const arg = (k, d) => (process.argv.find((a) => a.startsWith(`--${k}=`)) ?? `--${k}=${d}`).split("=")[1];
const BASE = arg("base", "http://localhost:3000");
const STORAGE_STATE = process.env.AUDIT_STORAGE_STATE || undefined;
const GAMES = arg("jeux", "buy-sell-no-trade,find-the-mistake,place-stop,build-the-trade").split(",");
//  - rounds difficiles à graine fixe (390, fr ; Place ton Stop et Build the Trade) : les mêmes
//    règles d’étiquettes à la question, à chaque étape et au verdict, sur les cas déjà tombés en faute.
// Par défaut : langues actives du site (i18n/config.ts, ACTIVE_LOCALES)
const LANGS = arg("langues", languesAuditees().join(",")).split(",");
const FORMATS = arg("formats", "390,1440").split(",");
// Téléphone 390 × 844 : barre d'état et barres de Safari déduites, ~750 px visibles (innerHeight)
const MOBILE_H = 750;
const VALIDATE = { fr: "Valider le trade", en: "Validate the trade", es: "Validar el trade" };
const STATE_CLASS = { good: "emerald", partial: "amber", bad: "red" };

const scan = (page) => page.evaluate(() => {
  const out = [];
  const root = document.querySelector(".tsx-v2") || document.body;
  for (const el of root.querySelectorAll("*")) {
    const own = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join(" ").trim();
    if (!own) continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || +cs.opacity === 0) continue;
    const clip = cs.textOverflow === "ellipsis" || cs.overflow === "hidden" || cs.overflowX === "hidden";
    if (clip && el.scrollWidth > el.clientWidth + 1) out.push(`texte tronqué « ${own.slice(0, 40)} »`);
    if (r.right > innerWidth + 1 || r.left < -1) out.push(`texte hors écran « ${own.slice(0, 40)} »`);
  }
  return [...new Set(out)];
});

// Place ton Stop, phase question : lignes, étiquettes et boutons dans le même ordre
const probeStops = (page) => page.evaluate(() => {
  const hex = (c) => { const x = document.createElement("div"); x.style.color = c; document.body.appendChild(x); const v = getComputedStyle(x).color; x.remove(); return v; };
  const chart = document.querySelector(".tsx-v2 .v2-chart");
  const tags = [...chart.querySelectorAll("text")].filter((t) => /^Stop \d$/.test(t.textContent.trim()))
    .map((t) => ({ n: t.textContent.trim().slice(-1), color: hex(t.previousElementSibling.getAttribute("fill")), y: t.getBoundingClientRect().top }))
    .sort((a, b) => a.y - b.y);
  const colors = new Set(tags.map((t) => t.color));
  const lines = [...chart.querySelectorAll("line[stroke-dasharray]")].map((l) => ({ color: hex(l.getAttribute("stroke")), y: l.getBoundingClientRect().top }))
    .filter((l) => colors.has(l.color)).sort((a, b) => a.y - b.y);
  const buttons = [...document.querySelectorAll(".tsx-v2 button.v2-stop-choice")]
    .map((b) => { const s = b.querySelector("span"); return { n: s.textContent.trim(), color: getComputedStyle(s).backgroundColor }; });
  const errs = [];
  if (tags.length !== 3 || buttons.length !== 3) return [`sonde stops : ${tags.length} étiquettes, ${buttons.length} boutons`];
  if (tags.map((t) => t.n).join("") !== "123") errs.push(`étiquettes dans l'ordre ${tags.map((t) => t.n).join("")} (attendu 123 de haut en bas)`);
  if (buttons.map((b) => b.n).join("") !== "123") errs.push(`boutons dans l'ordre ${buttons.map((b) => b.n).join("")}`);
  const lineOrder = [...new Set(lines.map((l) => l.color))].join("|");
  if (lineOrder !== tags.map((t) => t.color).join("|")) errs.push("ordre des lignes ≠ ordre des étiquettes");
  if (buttons.map((b) => b.color).join("|") !== tags.map((t) => t.color).join("|")) errs.push("couleurs des boutons ≠ couleurs des étiquettes");
  return errs;
});

// Étiquettes du graphique (mode inlineLabels) :
//  - toute ligne affichée (hors traits discrets) a une étiquette lisible posée à sa hauteur ;
//  - aucune étiquette n'en chevauche une autre, aucune ne sort du graphique, aucune n'est
//    cachée sous la pastille « ton choix » ou sous le verdict (bandeau ou carte) ;
//  - au plus 4 étiquettes visibles en même temps en 390 × 844 ;
//  - les étiquettes portent les noms des boutons (Place ton Stop : Stop 1/2/3 ;
//    Build the Trade : noms de l'étape active) ;
//  - aucune étiquette en double entre le graphique et une légende.
// Mesure après le fondu d'apparition des étiquettes (après l'intro des bougies en question)
const probeLabels = async (page, opts) => {
  await page.waitForFunction(() => [...document.querySelectorAll(".tsx-v2 .v2-chart .v2-labels")].every((g) => getComputedStyle(g).opacity === "1"), null, { timeout: 15000 }).catch(() => {});
  return measureLabels(page, opts);
};
const measureLabels = (page, { mobile, buttons, ps }) => page.evaluate(({ mobile, buttons, ps }) => {
  const chart = document.querySelector(".tsx-v2 .v2-chart");
  const svg = chart?.querySelector("svg.v2-svg");
  if (!svg) return ["graphique absent"];
  const sr = svg.getBoundingClientRect();
  const visible = (el) => { for (let e = el; e && e !== svg; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === "none" || cs.visibility === "hidden" || +cs.opacity === 0) return false; } return true; };
  const labels = [...svg.querySelectorAll("[data-label-for]")].filter(visible).map((g) => {
    const r = g.querySelector("rect").getBoundingClientRect();
    const t = g.querySelector("text");
    return { key: g.getAttribute("data-label-for"), txt: t.textContent.trim(), r, fs: t.getBoundingClientRect().height };
  });
  // Bougies affichées (corps et mèche) : une étiquette posée dessus cache le prix
  const candles = [...svg.querySelectorAll(".v2-candle")].filter(visible).map((g, i) => {
    const rs = [...g.querySelectorAll("line, rect")].map((e) => e.getBoundingClientRect());
    return { i, l: Math.min(...rs.map((r) => r.left)), r: Math.max(...rs.map((r) => r.right)), t: Math.min(...rs.map((r) => r.top)), b: Math.max(...rs.map((r) => r.bottom)) };
  });
  const lines = [...svg.querySelectorAll("line[data-line]:not([data-discreet])")].filter(visible)
    .map((l) => ({ key: l.getAttribute("data-line"), y: l.getBoundingClientRect().top + l.getBoundingClientRect().height / 2 }));
  // Pastille « ton choix » et verdict (bandeau ou carte) : posés par-dessus le graphique
  const covers = [[".v2-pin-tag", "la pastille « ton choix »"], [".v2-verdict", "le verdict"]]
    .flatMap(([sel, name]) => [...chart.querySelectorAll(sel)].map((e) => ({ name, r: e.getBoundingClientRect() })).filter((c) => c.r.width > 0));
  const errs = [];
  // l'étiquette d'une ligne (même clé) la traverse : posée ailleurs, une autre étiquette à cette hauteur
  // la faisait passer pour étiquetée (« Agressive » à 28 px de sa ligne, sous « Pullback profond »)
  for (const l of lines) {
    const own = labels.find((t) => t.key === l.key);
    // (écartée faute de place, elle est reliée à sa ligne par un trait qui va de son bord jusqu'à elle ;
    // l'erreur marquée sur une ligne compte aussi : « Stop dans la zone » flottait 120 px au-dessus de son stop)
    const leader = own && svg.querySelector(`[data-leader-for="${CSS.escape(l.key)}"]`)?.getBoundingClientRect();
    const linked = leader && leader.height > 0 && leader.top <= Math.min(l.y, own.r.bottom) + 1.5 && leader.bottom >= Math.max(l.y, own.r.top) - 1.5;
    if (own && !(l.y >= own.r.top - 1 && l.y <= own.r.bottom + 1) && !linked) errs.push(`étiquette « ${own.txt} » loin de sa ligne (${Math.round(Math.min(Math.abs(l.y - own.r.top), Math.abs(l.y - own.r.bottom)))} px)`);
    else if (!own && !labels.some((t) => l.y >= t.r.top - 1 && l.y <= t.r.bottom + 1)) errs.push(`ligne « ${l.key} » sans étiquette à sa hauteur`);
  }
  // Erreur marquée sur une zone : son étiquette touche la zone, ou un trait la relie à son bord
  // (« Vente dans support » flottait 70 px au-dessus du support marqué, Trouve l'erreur sell_in_support)
  {
    const mz = svg.querySelector("[data-mark-zone] rect")?.getBoundingClientRect(), own = labels.find((t) => t.key === "markTag");
    if (mz && own && (own.r.bottom < mz.top - 1 || own.r.top > mz.bottom + 1)) {
      const ld = svg.querySelector('[data-leader-for="markTag"]')?.getBoundingClientRect();
      const edge = own.r.bottom < mz.top ? mz.top : mz.bottom;
      if (!(ld && ld.height > 0 && ld.top <= Math.min(edge, own.r.bottom) + 1.5 && ld.bottom >= Math.max(edge, own.r.top) - 1.5)) errs.push(`étiquette « ${own.txt} » loin de sa zone marquée, sans trait de rappel`);
    }
  }
  for (const t of labels) {
    if (!t.txt) errs.push(`étiquette « ${t.key} » vide`);
    if (t.fs < 10) errs.push(`étiquette « ${t.txt} » illisible (${t.fs.toFixed(1)} px)`);
    if (t.r.left < sr.left - 1 || t.r.right > sr.right + 1 || t.r.top < sr.top - 1 || t.r.bottom > sr.bottom + 1) errs.push(`étiquette « ${t.txt} » hors du graphique`);
    const c = candles.find((k) => k.l < t.r.right - 0.5 && t.r.left < k.r - 0.5 && k.t < t.r.bottom - 0.5 && t.r.top < k.b - 0.5);
    if (c) errs.push(`étiquette « ${t.txt} » sur une bougie`);
    const u = covers.find((k) => k.r.left < t.r.right - 0.5 && t.r.left < k.r.right - 0.5 && k.r.top < t.r.bottom - 0.5 && t.r.top < k.r.bottom - 0.5);
    if (u) errs.push(`étiquette « ${t.txt} » cachée sous ${u.name}`);
  }
  for (let i = 0; i < labels.length; i++) for (let j = i + 1; j < labels.length; j++) {
    const a = labels[i].r, b = labels[j].r;
    if (a.left < b.right - 0.5 && b.left < a.right - 0.5 && a.top < b.bottom - 0.5 && b.top < a.bottom - 0.5) errs.push(`« ${labels[i].txt} » chevauche « ${labels[j].txt} »`);
  }
  // Étiquette de zone à côté de sa zone, sans ambiguïté : son bord à au plus une hauteur d'étiquette
  // de la zone, et, si elle ne la touche pas, aucune autre zone plus proche d'elle que la sienne
  const zoneRect = (i) => { const z = svg.querySelector(`[data-zone="${i}"]`); return z && [...z.querySelectorAll("rect")].map((e) => e.getBoundingClientRect()).filter((r) => r.width > 0).sort((p, q) => q.width - p.width)[0]; };
  const allZones = [...svg.querySelectorAll("[data-zone]")].map((z) => z.getAttribute("data-zone"));
  const gapTo = (cy, r) => (cy < r.top ? r.top - cy : cy > r.bottom ? cy - r.bottom : 0);
  for (const t of labels.filter((x) => /^zone\d+$/.test(x.key))) {
    const zr = zoneRect(t.key.slice(4));
    if (!zr) continue;
    const cy = (t.r.top + t.r.bottom) / 2, own = gapTo(cy, zr);
    if (own > t.r.height * 1.5) errs.push(`étiquette « ${t.txt} » loin de sa zone (${Math.round(own)} px)`);
    // (une étiquette qui touche sa zone, bord à 4 px près, n'est jamais ambiguë, même posée sur une zone voisine)
    const other = own > t.r.height / 2 + 4 && allZones.filter((i) => i !== t.key.slice(4)).map((i) => zoneRect(i)).filter(Boolean).find((r) => gapTo(cy, r) + 0.5 < own);
    if (other) errs.push(`étiquette « ${t.txt} » plus près d'une autre zone que de la sienne`);
  }

  // Téléphone : au plus 4 étiquettes ; Place ton Stop (entrée + 3 stops, puis les niveaux cités par les
  // justifications, demande du PO) : au plus 4 étiquettes de lignes et 3 de zones
  const zoneLabels = labels.filter((x) => /^zone\d+$/.test(x.key)), lineLabels = labels.filter((x) => !/^zone\d+$/.test(x.key));
  if (mobile && !ps && labels.length > 4) errs.push(`${labels.length} étiquettes visibles (max 4) : ${labels.map((t) => t.txt).join(", ")}`);
  if (mobile && ps && (lineLabels.length > 4 || zoneLabels.length > 3)) errs.push(`${lineLabels.length} étiquettes de lignes (max 4) et ${zoneLabels.length} de zones (max 3) : ${labels.map((t) => t.txt).join(", ")}`);
  if (buttons) {
    const names = [...document.querySelectorAll(buttons.selector)].map((b) => (b.getAttribute("aria-label") ?? b.querySelector("span")?.textContent ?? "").trim());
    const onChart = labels.filter((t) => new RegExp(buttons.keys).test(t.key)).map((t) => t.txt);
    if (names.sort().join("|") !== onChart.sort().join("|")) errs.push(`étiquettes [${onChart.join(", ")}] ≠ boutons [${names.join(", ")}]`);
  }
  const legend = [...document.querySelectorAll(".tsx-v2 [data-legend]")].map((e) => e.textContent.trim());
  for (const t of labels) if (legend.includes(t.txt)) errs.push(`« ${t.txt} » à la fois sur le graphique et en légende`);
  return errs;
}, { mobile, buttons, ps: !!ps });
// Graphique (question et verdict) : chaque zone est dessinée derrière les bougies ; chaque corps
// est au moins 3 fois plus large que sa mèche ; en mobile (390), le graphique tient en entier dans
// l'écran tel que le joueur le voit, sans défiler : sous le bandeau du site, au-dessus de la barre
// du navigateur.
// Hauteur minimale des bougies : la moitié du cadre pour Place ton Stop (règle PO, stops lointains), 40 % ailleurs
const minHeightFor = (page) => (page.url().includes("/jeux/place-stop") ? 0.5 : 0.4);
// (mesuré une fois les animations finies : une bougie en train d'apparaître est encore écrasée)
const settled = (page) => page.waitForFunction(() => !document.getAnimations().some((x) => x.playState === "running" && x.effect?.target?.closest?.(".v2-chart")), null, { timeout: 20000 }).catch(() => {});
const measureChart = async (page, opts) => { await settled(page); return measureChart0(page, opts); };
const measureChart0 = (page, { mobile }) => page.evaluate(({ mobile, MIN_PLOT_SHARE, MIN_CANDLE_HEIGHT }) => {
  const svg = document.querySelector(".tsx-v2 .v2-chart svg.v2-svg");
  if (!svg) return ["graphique absent"];
  const errs = [];
  const candles = [...svg.querySelectorAll(".v2-candle")];
  if (candles.length) for (const z of svg.querySelectorAll("[data-zone], [data-mark-zone]")) {
    if (candles[0].compareDocumentPosition(z) & Node.DOCUMENT_POSITION_FOLLOWING) { errs.push("zone dessinée par-dessus les bougies (elle les masque)"); break; }
  }
  for (const g of candles) {
    const l = g.querySelector("line"), r = g.querySelector("rect");
    if (!l || !r || g.getBoundingClientRect().width === 0) continue;
    const wick = parseFloat(l.getAttribute("stroke-width")), body = parseFloat(r.getAttribute("width"));
    if (body < 3 * wick - 1e-6) { errs.push(`corps trop étroit : ${body.toFixed(1)} px pour une mèche de ${wick.toFixed(1)} px (au moins 3 fois)`); break; }
  }
  // Place des bougies (emplacements de la suite compris) : au moins 45 % du cadre, la colonne
  // d’étiquettes ne les tasse jamais dans un coin (ex. refusé : Trouve l’erreur, weekend_gap_exposure,
  // verdict en 390 avec les bougies sur 30 % de la largeur)
  const plotW = +svg.getAttribute("data-plot-w"), svgW = svg.getBoundingClientRect().width;
  if (svgW > 0 && plotW / svgW < MIN_PLOT_SHARE) errs.push(`bougies tassées par les étiquettes : ${Math.round((100 * plotW) / svgW)} % du cadre (au moins ${100 * MIN_PLOT_SHARE} %)`);
  // Hauteur des bougies : au moins la moitié du cadre à Place ton Stop (règle PO), 40 % ailleurs, à la question comme au verdict ; un niveau lointain (stop large, objectif) ne les
  // écrase jamais dans une bande (ex. refusé : Place ton Stop, news_imminent_wide, bougies dans le quart haut)
  const boxes = candles.map((g) => g.getBoundingClientRect()).filter((b) => b.height > 0);
  const svgH = svg.getBoundingClientRect().height;
  if (boxes.length && svgH > 0) {
    const span = Math.max(...boxes.map((b) => b.bottom)) - Math.min(...boxes.map((b) => b.top));
    if (span / svgH < MIN_CANDLE_HEIGHT) errs.push(`bougies écrasées en hauteur : ${Math.round((100 * span) / svgH)} % du cadre (au moins ${100 * MIN_CANDLE_HEIGHT} %)`);
  }
  if (mobile) {
    // Zone visible : sous le bandeau collant du site, au-dessus de la barre du navigateur
    // (fenêtre de MOBILE_H px : 844 moins les barres de Safari)
    const r = svg.getBoundingClientRect();
    const top = document.querySelector("nav.sticky")?.getBoundingClientRect().bottom ?? 0, bottom = innerHeight;
    if (r.top < top - 1 || r.bottom > bottom + 1) errs.push(`graphique hors de l'écran : de ${Math.round(r.top)} à ${Math.round(r.bottom)} px pour une zone visible de ${Math.round(top)} à ${bottom} px`);
  }
  return errs;
}, { mobile, MIN_PLOT_SHARE: 0.45, MIN_CANDLE_HEIGHT: minHeightFor(page) });

const STOP_BUTTONS = { selector: ".tsx-v2 button.v2-stop-choice", keys: "^stop\\d" };
const stepButtons = (step) => ({ selector: `.tsx-v2 [data-pick^="${step}:"]`, keys: "^cand\\d" });

// Lignes mises en évidence au verdict (entrée, TP, stops, erreur marquée) :
// chacune doit avoir un rendu non nul. On compare le graphique avec et sans la
// ligne : une ligne que le navigateur ne dessine pas (ex. filtre SVG sur une
// boîte de hauteur nulle) ne change aucun pixel. Une ligne entièrement couverte
// par une ligne visible au même niveau (ex. le stop sous l'erreur marquée) est
// visible à travers elle.
async function probeLines(page) {
  const chart = page.locator(".tsx-v2 .v2-chart").first();
  const lines = await chart.evaluate((c) => {
    const ls = [...c.querySelectorAll("svg.v2-svg line")].filter((l) =>
      Math.abs(l.y1.baseVal.value - l.y2.baseVal.value) < 0.5 && Math.abs(l.x2.baseVal.value - l.x1.baseVal.value) > 20);
    const box = (l) => ({ y: l.y1.baseVal.value, x1: Math.min(l.x1.baseVal.value, l.x2.baseVal.value), x2: Math.max(l.x1.baseVal.value, l.x2.baseVal.value), w: +(l.getAttribute("stroke-width") ?? 1) });
    return ls.map((l, i) => {
      l.setAttribute("data-probe-line", String(i));
      const b = box(l);
      // lignes peintes au-dessus (plus loin dans le DOM), au même niveau, qui la couvrent
      const coveredBy = ls.map((m, j) => ({ m, j })).filter(({ m, j }) => {
        if (j <= i) return false;
        const o = box(m);
        return Math.abs(o.y - b.y) < 0.5 && o.x1 <= b.x1 + 0.5 && o.x2 >= b.x2 - 0.5 && o.w >= b.w;
      }).map(({ j }) => j);
      return { i, stroke: l.getAttribute("stroke"), mark: !!l.closest(".v2-mark, .v2-late"), coveredBy };
    });
  });
  const shot = () => chart.screenshot({ scale: "css", animations: "disabled" });
  const setHidden = (i, hidden) => chart.evaluate((c, [i, hidden]) => {
    c.querySelector(`[data-probe-line="${i}"]`).style.visibility = hidden ? "hidden" : "";
  }, [i, hidden]);
  // Capture stable (deux captures identiques), sinon la comparaison ne prouve rien
  const stableShot = async () => {
    let prev = await shot();
    for (let k = 0; k < 4; k++) {
      await page.waitForTimeout(250);
      const cur = await shot();
      if (cur.equals(prev)) return cur;
      prev = cur;
    }
    return null;
  };
  if (!lines.length) return { errs: [], n: 0, marks: 0 };
  const ref = await stableShot();
  if (!ref) return { errs: ["graphique instable : comparaison des lignes impossible"], n: lines.length, marks: 0 };
  const drawn = new Map();
  // Du dessus vers le dessous : une ligne couverte s'appuie sur le résultat de celles qui la couvrent
  for (const l of [...lines].reverse()) {
    await setHidden(l.i, true);
    const b = await shot();
    await setHidden(l.i, false);
    drawn.set(l.i, !ref.equals(b) || l.coveredBy.some((j) => drawn.get(j)));
  }
  const errs = lines.filter((l) => !drawn.get(l.i))
    .map((l) => `ligne ${l.mark ? "de l'erreur marquée" : `« ${l.stroke} »`} sans rendu (aucun pixel dessiné)`);
  return { errs, n: lines.length, marks: lines.filter((l) => l.mark).length };
}

const probeVerdict = (page) => page.evaluate(({ STATE_CLASS }) => {
  const v = document.querySelector(".tsx-v2 [data-verdict]");
  if (!v) return ["verdict absent"];
  const st = v.getAttribute("data-verdict");
  const errs = [];
  if (!STATE_CLASS[st]) return [`état de verdict inconnu « ${st} »`];
  const pts = v.querySelector(".v2-verdict-points");
  const title = [...v.querySelectorAll("p")].find((p) => !p.classList.contains("v2-verdict-points"));
  if (!pts || !pts.className.includes(STATE_CLASS[st])) errs.push(`points pas en ${STATE_CLASS[st]} pour l'état ${st}`);
  if (!title || !title.className.includes(STATE_CLASS[st])) errs.push(`titre pas en ${STATE_CLASS[st]} pour l'état ${st}`);
  if (!v.querySelector(".v2-verdict-max") || !/\/\s*-?\d+/.test(v.querySelector(".v2-verdict-max").textContent)) errs.push("maximum du round non affiché");
  const raw = (pts?.firstChild?.textContent ?? "").trim();
  const pv = parseInt(raw.replace(/[^\d-]/g, ""), 10);
  if (st === "good" && !(pv > 0)) errs.push(`état bon avec ${pv} points`);
  if (st === "bad" && pv !== 0) errs.push(`état faux avec ${pv} points (attendu 0)`);
  if (raw.startsWith("+") !== pv > 0) errs.push(`signe des points incohérent « ${raw} »`);
  return errs;
}, { STATE_CLASS });

async function session(browser, slug, loc, w) {
  const mobile = +w < 800;
  const ctx = await browser.newContext({ viewport: { width: +w, height: mobile ? MOBILE_H : 900 }, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, hasTouch: mobile, locale: loc, storageState: STORAGE_STATE });
  await ctx.addInitScript(() => { try { localStorage.setItem("tradinglab_onboarding_v1", "done"); } catch { /* stockage indisponible */ } });
  const page = await ctx.newPage();
  const errs = [];
  const add = (where, list) => list.forEach((e) => errs.push(`${where} : ${e}`));
  // Message complet et début de la pile : sans eux, une erreur ponctuelle ne se diagnostique pas
  page.on("pageerror", (e) => errs.push(`erreur JS : ${e.message.slice(0, 200)}${e.stack ? ` [pile : ${e.stack.split("\n").slice(1, 4).map((l) => l.trim()).join(" ← ").slice(0, 300)}]` : ""}`));
  try {
    await page.goto(`${BASE}/${loc}/jeux/${slug}`, { waitUntil: "networkidle", timeout: 180000 });
    await page.evaluate(() => document.fonts.ready);
    add("niveau", await scan(page));
    await page.getByRole("button", { name: /Interm/ }).first().click();
    const states = new Set();
    let round = 0, lineCount = 0, markCount = 0;
    for (; round < 12; round++) {
      const ready = slug === "build-the-trade" ? page.locator('[data-pick^="entry:"]').first()
        : slug === "place-stop" ? page.getByRole("button", { name: "Stop 1", exact: true })
        : slug === "find-the-mistake" ? page.locator("[data-choice]").first()
        : page.getByRole("button", { name: "NO TRADE" }).first();
      try { await ready.waitFor({ timeout: 15000 }); } catch { break; }
      await page.waitForTimeout(round === 0 ? 4500 : 1500);
      if (round === 0) add("question", await scan(page));
      if (slug === "place-stop") add(`round ${round + 1}`, await probeStops(page));
      if (slug !== "build-the-trade") add(`round ${round + 1} étiquettes`, await probeLabels(page, { mobile, buttons: slug === "place-stop" ? STOP_BUTTONS : null, ps: slug === "place-stop" }));
      add(`round ${round + 1} graphique`, await measureChart(page, { mobile }));
      if (slug === "build-the-trade") {
        // Étiquettes à chaque étape (le choix reste affiché 600 ms, puis le cadrage glisse)
        for (const step of ["entry", "stop", "tp"]) {
          if (step !== "entry") await page.waitForTimeout(1400);
          add(`round ${round + 1} étape ${step}`, await probeLabels(page, { mobile, buttons: stepButtons(step) }));
          await page.locator(`[data-pick^="${step}:"]`).nth(round % 3).click();
        }
        await page.waitForTimeout(400);
        await page.getByRole("button", { name: VALIDATE[loc] }).click();
      } else if (slug === "place-stop") await page.getByRole("button", { name: `Stop ${(round % 3) + 1}`, exact: true }).click();
      else if (slug === "find-the-mistake") await page.locator("[data-choice]").nth(round % 4).click();
      else await page.getByRole("button", { name: ["BUY", "SELL", "NO TRADE"][round % 3] }).first().click();
      await page.locator(".v2-verdict").first().waitFor({ timeout: 20000 });
      await page.waitForTimeout(1500);
      add(`verdict ${round + 1}`, await probeVerdict(page));
      add(`verdict ${round + 1} étiquettes`, await probeLabels(page, { mobile, buttons: null, ps: slug === "place-stop" }));
      // (énoncé du round dans le message : le round fautif se retrouve sans rejouer la partie)
      const lead = (await page.locator(".tsx-v2 .v2-lead").first().innerText().catch(() => "")).slice(0, 50);
      add(`verdict ${round + 1} graphique « ${lead} »`, await measureChart(page, { mobile }));
      const pl = await probeLines(page);
      add(`verdict ${round + 1} lignes`, pl.errs);
      lineCount += pl.n; markCount += pl.marks;
      states.add(await page.locator("[data-verdict]").first().getAttribute("data-verdict"));
      if (round === 0) add("verdict", await scan(page));
      const next = page.locator(".tsx-v2 button.v2-btn").last();
      await next.scrollIntoViewIfNeeded(); await next.click();
      await page.waitForTimeout(800);
      if (await page.locator(".v2-chart").count() === 0) break;
    }
    await page.waitForTimeout(1200);
    add("bilan", await scan(page));
    return { errs: [...new Set(errs)], rounds: round + 1, states: [...states].join("/"), lines: `${lineCount} lignes sondées dont ${markCount} d'erreur marquée` };
  } catch (e) {
    return { errs: [...errs, `session interrompue : ${e.message.split("\n")[0].slice(0, 120)}`], rounds: 0, states: "", lines: "" };
  } finally { await ctx.close(); }
}

// Rounds difficiles à graine fixe (390, fr) : les sessions tirent leurs rounds au hasard ; ces
// graines rejouent à chaque audit les cas où les étiquettes se sont déjà mal placées (swings empilés,
// verdict des ventes sur swing évident, 3 entrées à moins de 1 m dans Build the Trade). La 1re valeur
// de Math.random de la page fixe la graine du 1er round (comme le rejeu ciblé du PO).
const HARD = [
  ["place-stop", "Débutant", 1098], ["place-stop", "Débutant", 1315], ["place-stop", "Intermédiaire", 1112],
  ["place-stop", "Avancé", 1091], ["place-stop", "Avancé", 1112], ["place-stop", "Avancé", 1182],
  ["place-stop", "Avancé", 2008], ["place-stop", "Avancé", 2029],
  ["build-the-trade", "Avancé", 1084], ["build-the-trade", "Avancé", 1483], ["build-the-trade", "Avancé", 1833], ["build-the-trade", "Avancé", 1931],
  // Trouve l'erreur : marque d'erreur à libellé long qui écrasait les bougies au verdict (retracement trop court)
  ["find-the-mistake", "Intermédiaire", 5154],
  // colonne d'étiquettes qui écrasait les bougies, étiquettes de zone éloignées (parties jouées en 390, 2026-10-17)
  ["place-stop", "Avancé", 5042], ["place-stop", "Intermédiaire", 5210],
  ["build-the-trade", "Débutant", 5028], ["build-the-trade", "Avancé", 5413],
  // marque d’erreur longue qui tassait les bougies sur 30 % du cadre au verdict (parties jouées en 390, 2026-10-18)
  ["find-the-mistake", "Avancé", 5056],
  // étiquette de l'erreur marquée loin de son stop, sans lien (Trouve l'erreur, int_stop_dans_zone, 2026-10-25)
  ["find-the-mistake", "Intermédiaire", 10011], ["find-the-mistake", "Intermédiaire", 10000],
  // stop large qui écrasait les bougies dans le quart haut de la question (news imminente, 2026-10-25)
  ["place-stop", "Avancé", 10072], ["place-stop", "Avancé", 10029],
];
async function hardRounds(browser) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: MOBILE_H }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: "fr", storageState: STORAGE_STATE });
  await ctx.addInitScript(() => { try { localStorage.setItem("tradinglab_onboarding_v1", "done"); } catch { /* stockage indisponible */ } });
  const page = await ctx.newPage();
  const errs = [];
  try {
    for (const [slug, level, seed] of HARD) {
      const add = (where, list) => list.forEach((e) => errs.push(`${slug} ${level} graine ${seed} ${where} : ${e}`));
      try {
        await page.goto(`${BASE}/fr/jeux/${slug}`, { waitUntil: "networkidle", timeout: 180000 });
        await page.waitForTimeout(600);
        // Graine fixe : historique de rotation vidé (sinon le 1er round n'est plus celui de la graine)
        await page.evaluate(() => { for (const k of Object.keys(localStorage)) if (k.startsWith("tsx-jeux-rotation:")) localStorage.removeItem(k); });
        await page.evaluate((v) => { let first = true, x = 0x2f6b9e1d; Math.random = () => { if (first) { first = false; return v; } x |= 0; x = (x + 0x6d2b79f5) | 0; let t = Math.imul(x ^ (x >>> 15), 1 | x); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }, (seed + 0.5) / 1e9);
        await page.getByText(level, { exact: true }).first().click({ timeout: 60000 });
        if (slug === "build-the-trade") {
          await page.locator('[data-pick^="entry:"]').first().waitFor({ timeout: 60000 });
          for (const step of ["entry", "stop", "tp"]) {
            await page.waitForTimeout(step === "entry" ? 4500 : 1400);
            add(`étape ${step}`, await probeLabels(page, { mobile: true, buttons: stepButtons(step) }));
            if (step === "entry") add("question graphique", await measureChart(page, { mobile: true }));
            await page.locator(`[data-pick^="${step}:"]`).first().click();
          }
          await page.waitForTimeout(400);
          await page.getByRole("button", { name: VALIDATE.fr }).click();
        } else if (slug === "find-the-mistake") {
          await page.locator("[data-choice]").first().waitFor({ timeout: 60000 });
          await page.waitForTimeout(4500);
          add("question", await probeLabels(page, { mobile: true, buttons: null }));
          await page.locator("[data-choice]").first().click();
        } else {
          await page.getByRole("button", { name: "Stop 1", exact: true }).waitFor({ timeout: 60000 });
          await page.waitForTimeout(4500);
          add("question", await probeLabels(page, { mobile: true, buttons: STOP_BUTTONS, ps: true }));
          add("question graphique", await measureChart(page, { mobile: true }));
          await page.getByRole("button", { name: "Stop 1", exact: true }).click();
        }
        await page.locator(".v2-verdict").first().waitFor({ timeout: 20000 });
        await page.waitForTimeout(1500);
        add("verdict", await probeLabels(page, { mobile: true, buttons: null, ps: slug === "place-stop" }));
        add("verdict graphique", await measureChart(page, { mobile: true }));
      } catch (e) { add("", [`round interrompu : ${e.message.split("\n")[0].slice(0, 100)}`]); }
    }
  } finally { await ctx.close(); }
  return errs;
}

// --autotest : défauts injectés dans les étiquettes et le graphique (1re question de Buy / Sell /
// No Trade en 390) ; chacun doit produire l'erreur attendue, sinon la règle ne protège rien.
const MUTATIONS = {
  "étiquette posée sur une bougie": [/sur une bougie/, () => {
    const svg = document.querySelector(".tsx-v2 .v2-chart svg.v2-svg");
    const g = svg.querySelector("[data-label-for]"), r = g.querySelector("rect");
    const c = [...svg.querySelectorAll(".v2-candle")].filter((k) => getComputedStyle(k).opacity !== "0").at(-3).querySelector("rect");
    const dx = +c.getAttribute("x") - +r.getAttribute("x"), dy = +c.getAttribute("y") - +r.getAttribute("y");
    g.setAttribute("transform", `translate(${dx} ${dy})`);
  }],
  "étiquette de zone loin de sa zone": [/loin de sa zone/, () => {
    const svg = document.querySelector(".tsx-v2 .v2-chart svg.v2-svg");
    const g = svg.querySelector('[data-label-for^="zone"]'), r = g.querySelector("rect").getBoundingClientRect(), s = svg.getBoundingClientRect();
    g.setAttribute("transform", `translate(0 ${r.top - s.top > s.height / 2 ? -110 : 110})`);
  }],
  "étiquette de ligne loin de sa ligne": [/loin de sa ligne/, () => {
    // une ligne ajoutée 40 px sous une étiquette qui porte sa clé
    const svg = document.querySelector(".tsx-v2 .v2-chart svg.v2-svg");
    const g = svg.querySelector("[data-label-for]").cloneNode(true), r = g.querySelector("rect");
    g.setAttribute("data-label-for", "cand9");
    svg.appendChild(g);
    const y = +r.getAttribute("y") + +r.getAttribute("height") / 2 + 40;
    const l = document.createElementNS("http://www.w3.org/2000/svg", "line");
    for (const [k, v] of Object.entries({ "data-line": "cand9", x1: 10, x2: 200, y1: y, y2: y, stroke: "#fff", "stroke-width": 2 })) l.setAttribute(k, String(v));
    svg.appendChild(l);
  }],
  "étiquette coupée par le cadre": [/hors du graphique/, () => {
    const g = document.querySelector(".tsx-v2 .v2-chart svg.v2-svg [data-label-for]"), r = g.querySelector("rect");
    g.setAttribute("transform", `translate(0 ${-(+r.getAttribute("y")) - 8})`);
  }],
  "étiquette sous la pastille « ton choix »": [/cachée sous la pastille/, () => {
    const chart = document.querySelector(".tsx-v2 .v2-chart");
    const r = chart.querySelector("svg.v2-svg [data-label-for] rect").getBoundingClientRect(), c = chart.getBoundingClientRect();
    const p = document.createElement("span");
    p.className = "v2-pin-tag";
    Object.assign(p.style, { position: "absolute", display: "block", left: `${r.left - c.left}px`, top: `${r.top - c.top}px`, width: "60px", height: "20px" });
    chart.appendChild(p);
  }],
  "étiquette sous le verdict": [/cachée sous le verdict/, () => {
    const chart = document.querySelector(".tsx-v2 .v2-chart");
    const r = chart.querySelector("svg.v2-svg [data-label-for] rect").getBoundingClientRect(), c = chart.getBoundingClientRect();
    const v = document.createElement("div");
    v.className = "v2-verdict";
    Object.assign(v.style, { position: "absolute", display: "block", opacity: "1", transform: "none", left: `${r.left - c.left}px`, top: `${r.top - c.top}px`, width: "80px", height: "30px" });
    chart.appendChild(v);
  }],
  "zone par-dessus les bougies": [/zone dessinée par-dessus les bougies/, () => {
    const svg = document.querySelector(".tsx-v2 .v2-chart svg.v2-svg");
    const z = svg.querySelector("[data-zone]");
    z.parentElement.appendChild(z);
  }],
  "corps trop étroit": [/corps trop étroit/, () => {
    const g = [...document.querySelectorAll(".tsx-v2 .v2-chart svg.v2-svg .v2-candle")].at(-1);
    g.querySelector("line").setAttribute("stroke-width", g.querySelector("rect").getAttribute("width"));
  }],
  "erreur loin de sa zone marquée": [/loin de sa zone marquée/, () => {
    // une zone marquée en bas du cadre, et l’étiquette de l’erreur 120 px au-dessus, sans trait
    const svg = document.querySelector(".tsx-v2 .v2-chart svg.v2-svg"), H = svg.getBoundingClientRect().height;
    const ns = "http://www.w3.org/2000/svg", g = document.createElementNS(ns, "g"), r = document.createElementNS(ns, "rect");
    g.setAttribute("data-mark-zone", "");
    for (const [k, v] of Object.entries({ x: 10, y: H - 30, width: 200, height: 16 })) r.setAttribute(k, String(v));
    g.appendChild(r); svg.appendChild(g);
    const lab = svg.querySelector("[data-label-for]").cloneNode(true), lr = lab.querySelector("rect");
    lab.setAttribute("data-label-for", "markTag");
    lab.setAttribute("transform", `translate(0 ${H - 150 - +lr.getAttribute("y")})`);
    svg.appendChild(lab);
  }],
  "bougies écrasées en hauteur": [/bougies écrasées en hauteur/, () => {
    // toutes les bougies ramenées dans le tiers haut du cadre (comme un stop lointain qui fixerait l’échelle)
    // (groupe parent mis à l’échelle : la transformation CSS animée des bougies ne l’annule pas)
    const cs = [...document.querySelectorAll(".tsx-v2 .v2-chart svg.v2-svg .v2-candle")];
    const wrap = document.createElementNS("http://www.w3.org/2000/svg", "g");
    wrap.setAttribute("transform", "scale(1 0.3)");
    cs[0].parentNode.insertBefore(wrap, cs[0]);
    for (const g of cs) wrap.appendChild(g);
  }],
  "bougies tassées par les étiquettes": [/bougies tassées/, () => {
    const svg = document.querySelector(".tsx-v2 .v2-chart svg.v2-svg");
    svg.setAttribute("data-plot-w", String(Math.round(0.3 * svg.getBoundingClientRect().width)));
  }],
  "graphique hors de l'écran": [/graphique hors de l'écran/, () => {
    document.querySelector(".tsx-v2 .v2-chart").style.marginTop = "900px";
  }],
};
async function autotest(browser) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: MOBILE_H }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: "fr", storageState: STORAGE_STATE });
  await ctx.addInitScript(() => { try { localStorage.setItem("tradinglab_onboarding_v1", "done"); } catch { /* stockage indisponible */ } });
  const page = await ctx.newPage();
  let missed = 0;
  try {
    for (const [name, [expect, inject]] of Object.entries(MUTATIONS)) {
      // Round tiré au hasard : jusqu'à 3 essais si l'injection ne trouve pas sa cible
      let hit = [], after = [], before = [], err = "";
      for (let attempt = 0; attempt < 3 && !hit.length; attempt++) {
        try {
          await page.goto(`${BASE}/fr/jeux/buy-sell-no-trade`, { waitUntil: "networkidle", timeout: 180000 });
          await page.getByRole("button", { name: /Interm/ }).first().click();
          await page.getByRole("button", { name: "NO TRADE" }).first().waitFor({ timeout: 30000 });
          await page.waitForTimeout(4500);
          before = [...await probeLabels(page, { mobile: true, buttons: null }), ...await measureChart(page, { mobile: true })];
          await page.evaluate(inject);
          after = [...await measureLabels(page, { mobile: true, buttons: null }), ...await measureChart(page, { mobile: true })];
          hit = after.filter((e) => !before.includes(e) && expect.test(e));
          err = "";
        } catch (e) { err = e.message.split("\n")[0].slice(0, 100); }
      }
      console.log(`${hit.length ? "détecté" : "MANQUÉ "}  ${name}${hit.length ? ` (${hit[0]})` : ` : ${err || after.filter((e) => !before.includes(e)).join(" | ") || "aucune erreur"}`}`);
      if (!hit.length) missed++;
    }
  } finally { await ctx.close(); }
  return missed;
}

(async () => {
  try { const r = await fetch(`${BASE}/fr/jeux`); if (!r.ok) throw new Error(`HTTP ${r.status}`); }
  catch (e) { console.log(`Serveur injoignable (${BASE}) : ${e.message}. Lance le serveur de dev puis relance l'audit.`); console.log("RESULTAT erreurs=1 avertissements=0"); process.exit(1); }
  const browser = await chromium.launch();
  if (process.argv.includes("--autotest")) {
    const missed = await autotest(browser);
    await browser.close();
    console.log(`RESULTAT erreurs=${missed} avertissements=0`);
    process.exit(missed ? 1 : 0);
  }
  const jobs = GAMES.flatMap((g) => LANGS.flatMap((l) => FORMATS.map((f) => [g, l, f])));
  let errors = 0; const lines = [];
  const worker = async () => {
    for (let job = jobs.shift(); job; job = jobs.shift()) {
      const [g, l, f] = job;
      const r = await session(browser, g, l, f);
      errors += r.errs.length;
      lines.push(`${g.padEnd(18)} ${l} ${f.padStart(4)} : ${r.errs.length} erreur(s), ${r.rounds} rounds, états ${r.states}, ${r.lines}`);
      r.errs.slice(0, 6).forEach((e) => lines.push(`    ${e}`));
    }
  };
  await Promise.all([worker(), worker(), worker(), worker()]);
  if (GAMES.some((g) => g === "place-stop" || g === "build-the-trade") && FORMATS.includes("390")) {
    const h = await hardRounds(browser);
    errors += h.length;
    lines.push(`rounds difficiles (graines fixes, fr 390) : ${h.length} erreur(s), ${HARD.length} rounds`);
    h.slice(0, 12).forEach((e) => lines.push(`    ${e}`));
  }
  await browser.close();
  console.log(lines.sort().join("\n"));
  console.log(`RESULTAT erreurs=${errors} avertissements=0`);
  process.exit(errors ? 1 : 0);
})();
