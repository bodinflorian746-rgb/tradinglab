// Audit DOM des 4 jeux (navigateur) : joue une session complète par jeu × langue × format.
// Usage : node scripts/audit-jeux/dom.mjs [--base=http://localhost:3000] [--jeux=place-stop,...] [--langues=fr,es] [--formats=390,1440]
// Nécessite le serveur de dev déjà lancé (le script ne le démarre jamais).
//
// Règles :
//  - troncature : aucun texte coupé (ellipsis / overflow caché) ni hors écran, sur
//    l'écran de niveau, la 1re question, le 1er verdict et le bilan ;
//  - sonde Place ton Stop : ordre vertical des lignes = ordre des étiquettes
//    « Stop 1/2/3 » = ordre des boutons (couleurs et numéros) ;
//  - étiquettes du graphique (question, chaque étape de Build the Trade, verdict) :
//    toute ligne étiquetée à sa hauteur, aucun chevauchement, au plus 4 en 390,
//    mêmes noms que les boutons, aucun doublon avec une légende ;
//  - verdict : état (bon / partiel / faux), couleurs du titre et des points
//    cohérentes, maximum affiché ; barème simple : bon > 0, faux = 0 (sans signe) ;
//  - lignes au verdict (entrée, TP, stops, erreur marquée) : chacune a un rendu
//    non nul (le graphique change quand on la masque).
import { chromium } from "playwright";

const arg = (k, d) => (process.argv.find((a) => a.startsWith(`--${k}=`)) ?? `--${k}=${d}`).split("=")[1];
const BASE = arg("base", "http://localhost:3000");
const GAMES = arg("jeux", "buy-sell-no-trade,find-the-mistake,place-stop,build-the-trade").split(",");
const LANGS = arg("langues", "fr,en,es").split(",");
const FORMATS = arg("formats", "390,1440").split(",");
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
//  - aucune étiquette n'en chevauche une autre, aucune ne sort du graphique ;
//  - au plus 4 étiquettes visibles en même temps en 390 × 844 ;
//  - les étiquettes portent les noms des boutons (Place ton Stop : Stop 1/2/3 ;
//    Build the Trade : noms de l'étape active) ;
//  - aucune étiquette en double entre le graphique et une légende.
// Mesure après le fondu d'apparition des étiquettes (après l'intro des bougies en question)
const probeLabels = async (page, opts) => {
  await page.waitForFunction(() => [...document.querySelectorAll(".tsx-v2 .v2-chart .v2-labels")].every((g) => getComputedStyle(g).opacity === "1"), null, { timeout: 15000 }).catch(() => {});
  return measureLabels(page, opts);
};
const measureLabels = (page, { mobile, buttons }) => page.evaluate(({ mobile, buttons }) => {
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
  const lines = [...svg.querySelectorAll("line[data-line]:not([data-discreet])")].filter(visible)
    .map((l) => ({ key: l.getAttribute("data-line"), y: l.getBoundingClientRect().top + l.getBoundingClientRect().height / 2 }));
  const errs = [];
  for (const l of lines) if (!labels.some((t) => l.y >= t.r.top - 1 && l.y <= t.r.bottom + 1)) errs.push(`ligne « ${l.key} » sans étiquette à sa hauteur`);
  for (const t of labels) {
    if (!t.txt) errs.push(`étiquette « ${t.key} » vide`);
    if (t.fs < 10) errs.push(`étiquette « ${t.txt} » illisible (${t.fs.toFixed(1)} px)`);
    if (t.r.left < sr.left - 1 || t.r.right > sr.right + 1 || t.r.top < sr.top - 1 || t.r.bottom > sr.bottom + 1) errs.push(`étiquette « ${t.txt} » hors du graphique`);
  }
  for (let i = 0; i < labels.length; i++) for (let j = i + 1; j < labels.length; j++) {
    const a = labels[i].r, b = labels[j].r;
    if (a.left < b.right - 0.5 && b.left < a.right - 0.5 && a.top < b.bottom - 0.5 && b.top < a.bottom - 0.5) errs.push(`« ${labels[i].txt} » chevauche « ${labels[j].txt} »`);
  }
  if (mobile && labels.length > 4) errs.push(`${labels.length} étiquettes visibles (max 4) : ${labels.map((t) => t.txt).join(", ")}`);
  if (buttons) {
    const names = [...document.querySelectorAll(buttons.selector)].map((b) => (b.getAttribute("aria-label") ?? b.querySelector("span")?.textContent ?? "").trim());
    const onChart = labels.filter((t) => new RegExp(buttons.keys).test(t.key)).map((t) => t.txt);
    if (names.sort().join("|") !== onChart.sort().join("|")) errs.push(`étiquettes [${onChart.join(", ")}] ≠ boutons [${names.join(", ")}]`);
  }
  const legend = [...document.querySelectorAll(".tsx-v2 [data-legend]")].map((e) => e.textContent.trim());
  for (const t of labels) if (legend.includes(t.txt)) errs.push(`« ${t.txt} » à la fois sur le graphique et en légende`);
  return errs;
}, { mobile, buttons });
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
  const ctx = await browser.newContext({ viewport: { width: +w, height: mobile ? 844 : 900 }, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, hasTouch: mobile, locale: loc });
  await ctx.addInitScript(() => { try { localStorage.setItem("tradinglab_onboarding_v1", "done"); } catch { /* stockage indisponible */ } });
  const page = await ctx.newPage();
  const errs = [];
  const add = (where, list) => list.forEach((e) => errs.push(`${where} : ${e}`));
  page.on("pageerror", (e) => errs.push(`erreur JS : ${e.message.slice(0, 80)}`));
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
      if (slug !== "build-the-trade") add(`round ${round + 1} étiquettes`, await probeLabels(page, { mobile, buttons: slug === "place-stop" ? STOP_BUTTONS : null }));
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
      add(`verdict ${round + 1} étiquettes`, await probeLabels(page, { mobile, buttons: null }));
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

(async () => {
  try { const r = await fetch(`${BASE}/fr/jeux`); if (!r.ok) throw new Error(`HTTP ${r.status}`); }
  catch (e) { console.log(`Serveur injoignable (${BASE}) : ${e.message}. Lance le serveur de dev puis relance l'audit.`); console.log("RESULTAT erreurs=1 avertissements=0"); process.exit(1); }
  const browser = await chromium.launch();
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
  await browser.close();
  console.log(lines.sort().join("\n"));
  console.log(`RESULTAT erreurs=${errors} avertissements=0`);
  process.exit(errors ? 1 : 0);
})();
