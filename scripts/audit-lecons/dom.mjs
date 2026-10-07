// Audit DOM des schémas de leçons construits avec LessonChart (navigateur).
// Usage : node scripts/audit-lecons/dom.mjs [--base=http://localhost:3000] [--formats=390,1440]
//         [--pages=/fr/a,/fr/b] : autres pages à contrôler (tous les schémas du lot y sont cherchés)
//         [--toutes]  : en plus, textes coupés et variables non remplacées sur toutes les leçons
//         [--autotest] : injecte des défauts connus dans les schémas et vérifie que chacun est détecté
// Leçons premium : AUDIT_STORAGE_STATE=<fichier> (session Playwright enregistrée, hors dépôt).
// Lecture seule : aucune écriture en base, aucun formulaire.
//
// Règles, pour chaque [data-lesson-chart] attendu :
//  - présent et dessiné aux deux formats (aucune carte de remplacement mobile, rien de masqué) ;
//  - bougies : ouverture = clôture précédente, corps et mèches à l'échelle linéaire
//    (data-scale), espacement régulier, couleur = mouvement ;
//  - ligne de prix, niveaux, zones : à leur prix ; zone « src » = corps de la bougie citée ;
//  - pivots nommés (HH / HL / LH / LL) : vérifiés sur les données ;
//  - R/R affichés : recalculés (entrée, stop, objectif) et conformes au texte (data-expect) ;
//  - étiquettes : aucun chevauchement, aucune hors du cadre, aucun doublon avec une puce ou la légende ;
//  - textes ≥ 12 px, vocabulaire de référence (lib/vocabulary/trading-terms.json),
//    aucune variable non remplacée, aucun texte coupé.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, "..", "..");
const arg = (k, d) => (process.argv.find((a) => a.startsWith(`--${k}=`)) ?? `--${k}=${d}`).split("=")[1];
const BASE = arg("base", "http://localhost:3000");
const FORMATS = arg("formats", "390,1440").split(",").map(Number);
const PAGES = arg("pages", "").split(",").filter(Boolean).map((u) => (u.startsWith("/") ? u : `/${u}`));
const AUTOTEST = process.argv.includes("--autotest");
const TOUTES = process.argv.includes("--toutes");
const STORAGE_STATE = process.env.AUDIT_STORAGE_STATE || undefined;

// Schémas migrés vers LessonChart, par leçon (FR)
const LOT = JSON.parse(fs.readFileSync(path.join(HERE, "lot.json"), "utf8"));
const ALL_CHARTS = [...new Set(LOT.flatMap((l) => l.charts))];
const pages = PAGES.length ? PAGES.map((url) => ({ url, charts: ALL_CHARTS })) : LOT.map((l) => ({ url: l.url, charts: l.charts }));

const terms = JSON.parse(fs.readFileSync(path.join(ROOT, "lib", "vocabulary", "trading-terms.json"), "utf8"));
const VOCAB = terms.termes.fr.flatMap((t) => t.interdit.map((src) => ({ src, flags: t.casse ? "u" : "iu", retenu: t.retenu })));

// ─── Contrôles exécutés dans la page ─────────────────────────────────────────
function checkCharts({ ids, vocab }) {
  const errs = [];
  const E = (id, m) => errs.push(`${id} : ${m}`);
  const near = (a, b, t) => Math.abs(a - b) <= t;
  const fmtNum = (n, d = 1) => { const r = Number(n.toFixed(d)); return `${r < 0 ? "−" : ""}${Math.abs(r).toString().replace(".", ",")}`; };
  const fmtRR = (rr) => `1:${fmtNum(rr, 2)}`;
  const pivots = (s, win = 2) => {
    const hi = (i) => (typeof s[i] === "number" ? s[i] : s[i].h), lo = (i) => (typeof s[i] === "number" ? s[i] : s[i].l);
    const out = [];
    for (let i = 1; i < s.length - 1; i++) {
      let H = true, L = true;
      for (let d = 1; d <= win; d++) for (const j of [i - d, i + d]) { if (j < 0 || j >= s.length) continue; if (hi(j) >= hi(i)) H = false; if (lo(j) <= lo(i)) L = false; }
      if (H) out.push({ index: i, side: "h", price: hi(i) });
      if (L) out.push({ index: i, side: "l", price: lo(i) });
    }
    let lh, ll;
    for (const p of out) {
      if (p.side === "h") { if (lh) p.name = p.price > lh.price ? "HH" : "LH"; lh = p; } else { if (ll) p.name = p.price > ll.price ? "HL" : "LL"; ll = p; }
    }
    return out;
  };
  const bull = (el) => /bull|#10b981|16, 185, 129/.test(el.getAttribute("fill") || "");

  for (const id of ids) {
    const figs = [...document.querySelectorAll(`[data-lesson-chart="${id}"]`)];
    if (!figs.length) { E(id, "schéma absent"); continue; }
    for (const fig of figs) {
      const fr = fig.getBoundingClientRect();
      if (fr.width === 0 || fr.height === 0) { E(id, "schéma non affiché"); continue; }
      // rien de masqué dans le schéma (pas de carte de remplacement ni d'étiquettes cachées)
      for (const el of fig.querySelectorAll("*")) {
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden") { E(id, `élément masqué <${el.tagName.toLowerCase()} class="${el.getAttribute("class") || ""}">`); break; }
      }
      const panels = [...fig.querySelectorAll("svg[data-panel]")];
      if (!panels.length && !fig.querySelector(".ls-body")) E(id, "aucun panneau dessiné");
      const allCandles = panels.map((sv) => (sv.dataset.candles ? JSON.parse(sv.dataset.candles) : null));
      for (const svg of panels) {
        const P = svg.dataset.panel;
        const sc = JSON.parse(svg.dataset.scale);
        const toY = (v) => sc.top + ((sc.max - v) / (sc.max - sc.min)) * (sc.bottom - sc.top);
        const xOf = (i) => sc.x0 + sc.slot * (i + 0.5);
        const r0 = svg.getBoundingClientRect();
        if (r0.width === 0) { E(id, `${P} : panneau non dessiné`); continue; }
        // Bougies
        if (svg.dataset.candles) {
          const cs = JSON.parse(svg.dataset.candles);
          cs.forEach((k, i) => {
            if (!(k.h >= Math.max(k.o, k.c) && k.l <= Math.min(k.o, k.c))) E(id, `${P} bougie ${i} : mèches qui n'englobent pas le corps`);
            if (i && Math.abs(k.o - cs[i - 1].c) > 1e-9) E(id, `${P} bougie ${i} : ouverture ${k.o} ≠ clôture précédente ${cs[i - 1].c}`);
            const g = svg.querySelector(`[data-candle="${i}"]`);
            if (!g) { E(id, `${P} bougie ${i} non dessinée`); return; }
            const wick = g.querySelector("line"), body = g.querySelector("rect");
            if (!near(+wick.getAttribute("x1"), xOf(i), 0.5)) E(id, `${P} bougie ${i} : espacement irrégulier`);
            if (!near(+wick.getAttribute("y1"), toY(k.h), 0.5) || !near(+wick.getAttribute("y2"), toY(k.l), 0.5)) E(id, `${P} bougie ${i} : mèche hors échelle`);
            const top = Math.min(toY(k.o), toY(k.c)), h = Math.abs(toY(k.o) - toY(k.c));
            const by = +body.getAttribute("y"), bh = +body.getAttribute("height");
            if (h >= 2 ? !near(by, top, 0.5) || !near(bh, h, 0.5) : !near(by + bh / 2, top + h / 2, 0.5)) E(id, `${P} bougie ${i} : corps hors échelle`);
            const up = k.c > k.o || (k.c === k.o && i > 0 && k.c >= cs[i - 1].c);
            if (up !== bull(body)) E(id, `${P} bougie ${i} : couleur contraire au mouvement`);
          });
        }
        // Ligne de prix
        if (svg.dataset.series) {
          const s = JSON.parse(svg.dataset.series);
          const pts = svg.querySelector("[data-price-line]").getAttribute("points").trim().split(/\s+/).map((p) => p.split(",").map(Number));
          if (pts.length !== s.length) E(id, `${P} : ${pts.length} points dessinés pour ${s.length} prix`);
          s.forEach((v, i) => { if (pts[i] && (!near(pts[i][0], xOf(i), 0.5) || !near(pts[i][1], toY(v), 0.5))) E(id, `${P} point ${i} hors échelle`); });
        }
        const series = svg.dataset.candles ? JSON.parse(svg.dataset.candles) : svg.dataset.series ? JSON.parse(svg.dataset.series) : null;
        // Niveaux et zones
        for (const l of svg.querySelectorAll("line[data-level]:not([data-offscale])")) {
          if (/^rsi/.test(l.dataset.level)) continue;
          if (!near(+l.getAttribute("y1"), toY(+l.dataset.price), 0.5)) E(id, `${P} niveau ${l.dataset.level} hors de son prix`);
        }
        for (const z of svg.querySelectorAll("rect[data-zone]")) {
          const y1 = +z.dataset.y1, y2 = +z.dataset.y2;
          if (!near(+z.getAttribute("y"), toY(y2), 0.5)) E(id, `${P} zone ${z.dataset.zone} hors de son prix`);
          if (z.dataset.src) {
            const i = +z.dataset.src.split(":")[1];
            // FVG : du haut de la bougie i − 1 au bas de i + 1 (haussier) ou du haut de i + 1 au bas de i − 1 (baissier) ; sinon corps de la bougie i (Order Block)
            const ok = z.dataset.kind === "fvg"
              ? allCandles.some((cs) => cs && cs[i - 1] && cs[i + 1] && ((near(cs[i - 1].h, y1, 1e-9) && near(cs[i + 1].l, y2, 1e-9)) || (near(cs[i + 1].h, y1, 1e-9) && near(cs[i - 1].l, y2, 1e-9))))
              : allCandles.some((cs) => cs && cs[i] && near(Math.min(cs[i].o, cs[i].c), y1, 1e-9) && near(Math.max(cs[i].o, cs[i].c), y2, 1e-9));
            if (!ok) E(id, `${P} zone ${z.dataset.zone} ≠ ${z.dataset.kind === "fvg" ? "gap des bougies voisines de" : "corps de"} la bougie ${i}`);
          }
        }
        // Pivots nommés
        for (const m of svg.querySelectorAll("[data-pivot]")) {
          if (!m.dataset.pivot) continue;
          const pv = pivots(series).find((q) => q.index === +m.dataset.i && Math.abs(q.price - +m.dataset.price) < 1e-9);
          if (!pv) E(id, `${P} « ${m.dataset.pivot} » à l'indice ${m.dataset.i} : pas un pivot`);
          else if (pv.name !== m.dataset.pivot) E(id, `${P} « ${m.dataset.pivot} » à l'indice ${m.dataset.i} : c'est un ${pv.name ?? "pivot sans précédent"}`);
        }
      }
      // R/R recalculés
      for (const c of fig.querySelectorAll("[data-rr]")) {
        const e = +c.dataset.entry, s = +c.dataset.sl, t = +c.dataset.tp;
        const rr = Math.abs(t - e) / Math.abs(e - s);
        if (fmtRR(rr) !== c.dataset.rr || !c.textContent.includes(fmtRR(rr))) E(id, `R/R affiché ${c.textContent.trim()} ≠ calculé ${fmtRR(rr)}`);
        const x = c.dataset.expect;
        if (x && !(x[0] === "<" ? rr < +x.slice(1) : rr > +x.slice(1))) E(id, `R/R ${fmtRR(rr)} contraire au texte (${x})`);
      }
      // Étiquettes : chevauchements, débordements, doublons avec les puces / la légende
      const tags = [...fig.querySelectorAll("[data-label-for]")].map((g) => ({ k: g.dataset.labelFor, r: (g.querySelector("rect") || g).getBoundingClientRect(), t: g.textContent.trim(), svg: g.closest("svg").getBoundingClientRect() }));
      for (let a = 0; a < tags.length; a++) {
        const A = tags[a];
        if (A.r.left < A.svg.left - 0.5 || A.r.right > A.svg.right + 0.5 || A.r.top < A.svg.top - 0.5 || A.r.bottom > A.svg.bottom + 0.5) E(id, `étiquette « ${A.t} » hors du cadre`);
        for (let b = a + 1; b < tags.length; b++) {
          const B = tags[b];
          if (A.r.left < B.r.right - 0.5 && B.r.left < A.r.right - 0.5 && A.r.top < B.r.bottom - 0.5 && B.r.top < A.r.bottom - 0.5) E(id, `étiquettes « ${A.t} » et « ${B.t} » superposées`);
        }
      }
      const outside = [...fig.querySelectorAll("[data-chip], .lc-caption")].map((c) => c.textContent.trim().toLowerCase());
      for (const t of tags) if (outside.includes(t.t.toLowerCase())) E(id, `« ${t.t} » en double (graphique et légende)`);
      // Textes : taille, vocabulaire, variables non remplacées, troncature
      for (const el of fig.querySelectorAll("*")) {
        const own = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join("").trim();
        if (!own) continue;
        const cs = getComputedStyle(el);
        let px = parseFloat(cs.fontSize);
        const svg = el.closest("svg");
        if (svg && svg.viewBox && svg.viewBox.baseVal && svg.viewBox.baseVal.width) px *= svg.getBoundingClientRect().width / svg.viewBox.baseVal.width;
        if (px < 11.95) E(id, `texte ${px.toFixed(1)} px « ${own.slice(0, 30)} »`);
        if (/[{}]|\$\{|undefined|NaN|\[object/.test(own)) E(id, `variable non remplacée « ${own.slice(0, 40)} »`);
        for (const v of vocab) { const m = own.match(new RegExp(`(?<![\\p{L}\\d])(?:${v.src})(?![\\p{L}\\d])`, v.flags)); if (m) E(id, `vocabulaire « ${m[0]} » → « ${v.retenu} »`); }
        if (!svg && (cs.overflow === "hidden" || cs.textOverflow === "ellipsis") && el.scrollWidth > el.clientWidth + 1) E(id, `texte tronqué « ${own.slice(0, 40)} »`);
        if (svg) {
          const r = el.getBoundingClientRect(), s = svg.getBoundingClientRect();
          if (r.left < s.left - 1 || r.right > s.right + 1 || r.top < s.top - 1 || r.bottom > s.bottom + 1) E(id, `texte coupé par le cadre « ${own.slice(0, 40)} »`);
        }
      }
    }
  }
  return errs;
}

// Toutes les leçons : textes coupés (SVG ou HTML) et variables non remplacées, hors LessonChart
function scanLesson() {
  const out = [];
  const main = document.querySelector("main") || document.body;
  for (const el of main.querySelectorAll("*")) {
    if (el.closest("[data-lesson-chart]") || el.closest("nav, header, footer")) continue;
    const own = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join("").trim();
    if (!own) continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || +cs.opacity === 0) continue;
    if (/\{[A-Za-z_.]+\}|\$\{|\bundefined\b|\bNaN\b|\[object/.test(own)) out.push(`variable non remplacée « ${own.slice(0, 50)} »`);
    // Tableau à défilement horizontal voulu (overflow-x: auto) : texte accessible, pas coupé
    let sc = el.parentElement;
    while (sc && !/(auto|scroll)/.test(getComputedStyle(sc).overflowX)) sc = sc.parentElement;
    if (sc) continue;
    const svg = el.closest("svg");
    if (svg) {
      const s = svg.getBoundingClientRect();
      const clipped = getComputedStyle(svg).overflow !== "visible";
      if (clipped && (r.left < s.left - 1 || r.right > s.right + 1 || r.top < s.top - 1 || r.bottom > s.bottom + 1)) out.push(`texte coupé par son schéma « ${own.slice(0, 50)} »`);
    } else if ((cs.overflow === "hidden" || cs.textOverflow === "ellipsis") && el.scrollWidth > el.clientWidth + 1) {
      out.push(`texte tronqué « ${own.slice(0, 50)} »`);
    }
    if (r.right > innerWidth + 1 || r.left < -1) out.push(`texte hors écran « ${own.slice(0, 50)} »`);
  }
  return [...new Set(out)];
}

function lessonUrls() {
  const base = path.join(ROOT, "app", "[locale]", "(premium)");
  const out = [];
  const walk = (dir, rel) => {
    for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!d.isDirectory() || d.name.startsWith("_") || d.name.startsWith("(")) continue;
      const p = path.join(dir, d.name), r = `${rel}/${d.name}`;
      if (/^lecon\d+$/.test(d.name) && fs.existsSync(path.join(p, "page.tsx"))) out.push(`/fr${r}`);
      walk(p, r);
    }
  };
  for (const top of ["formations", "strategies"]) walk(path.join(base, top), `/${top}`);
  return out.sort();
}

// Défauts injectés (--autotest) : chacun doit produire au moins une erreur
const MUTATIONS = {
  "corps de bougie déplacé": () => { const r = document.querySelector("[data-candle='3'] rect"); r.setAttribute("y", +r.getAttribute("y") + 4); },
  "bougie discontinue": () => { const s = document.querySelector("svg[data-candles]"); const c = JSON.parse(s.dataset.candles); c[3].o += 0.001; c[3].h += 0.001; s.dataset.candles = JSON.stringify(c); },
  "R/R écrit à la main": () => { const c = document.querySelector("[data-rr]"); c.textContent = "R/R 1:9"; },
  "étiquettes superposées": () => { const [a, b] = document.querySelectorAll("g[data-label-for] rect"); b.setAttribute("x", a.getAttribute("x")); b.setAttribute("y", a.getAttribute("y")); },
  "texte de 10 px": () => { document.querySelector("[data-lesson-chart] svg text").setAttribute("font-size", "10"); },
  "variable non remplacée": () => { document.querySelector("[data-lesson-chart] .lc-caption").textContent = "{L.resistance}"; },
  "pivot mal nommé": () => { const m = document.querySelector("[data-pivot='HL']"); m.dataset.pivot = "LL"; },
  "élément masqué": () => { document.querySelector("[data-chip]").style.display = "none"; },
  "vocabulaire interdit": () => { document.querySelector("[data-lesson-chart] .lc-caption").textContent = "Attention au stop hunt"; },
  "zone ≠ corps de l'OB": () => { const z = document.querySelector("rect[data-src]"); z.dataset.y2 = String(+z.dataset.y2 + 0.0005); },
  "niveau hors de son prix": () => { const l = document.querySelector("line[data-level]:not([data-offscale])"); l.setAttribute("y1", +l.getAttribute("y1") + 3); },
  "doublon graphique / légende": () => { const chip = document.querySelector("[data-chip]"); const t = chip.closest("[data-lesson-chart]").querySelector("g[data-label-for] text"); chip.textContent = t.textContent; },
};

const browser = await chromium.launch();
let errors = 0, warnings = 0;
if (AUTOTEST) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, storageState: STORAGE_STATE, locale: "fr-FR" });
  await ctx.addInitScript(() => { try { window.localStorage.setItem("tradinglab_onboarding_v1", "done"); } catch {} });
  const page = await ctx.newPage();
  // Chaque défaut est injecté dans la 1re page où il s'applique (R/R et OB : Avancé 7 ; pivots : Intermédiaire 5)
  const candidates = PAGES.length ? pages : pages.filter((p) => /avance\/lecon7|intermediaire\/lecon5/.test(p.url));
  let missed = 0;
  for (const [name, fn] of Object.entries(MUTATIONS)) {
    let errs = null;
    for (const p of candidates) {
      await page.goto(`${BASE}${p.url}`, { waitUntil: "load", timeout: 120000 });
      await page.waitForSelector("[data-lesson-chart] svg[data-panel]", { timeout: 60000 });
      await page.waitForTimeout(400);
      const applied = await page.evaluate(`(() => { try { (${fn.toString()})(); return true; } catch { return false; } })()`);
      if (!applied) continue;
      errs = await page.evaluate(checkCharts, { ids: p.charts, vocab: VOCAB });
      break;
    }
    const ok = !!errs && errs.length > 0;
    console.log(`${ok ? "détecté    " : "NON DÉTECTÉ"} ${name}${errs === null ? " (défaut non injectable)" : ok ? ` (${errs[0].slice(0, 90)})` : ""}`);
    if (!ok) missed++;
  }
  await browser.close();
  console.log(`RESULTAT erreurs=${missed} avertissements=0`);
  process.exit(missed ? 1 : 0);
}
for (const w of FORMATS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w < 800 ? 844 : 900 }, storageState: STORAGE_STATE, locale: "fr-FR" });
  // Fenêtre d'accueil (1re visite) fermée d'office : elle recouvrirait les schémas
  await ctx.addInitScript(() => { try { window.localStorage.setItem("tradinglab_onboarding_v1", "done"); } catch {} });
  const page = await ctx.newPage();
  for (const p of pages) {
    await page.goto(`${BASE}${p.url}`, { waitUntil: "load", timeout: 120000 });
    await page.waitForSelector("[data-lesson-chart] svg[data-panel]", { timeout: 60000 }).catch(() => {});
    await page.waitForTimeout(500);
    const errs = await page.evaluate(checkCharts, { ids: p.charts, vocab: VOCAB });
    errors += errs.length;
    console.log(`${String(w).padEnd(5)} ${p.url.padEnd(42)} ${errs.length} erreur(s)`);
    for (const e of errs.slice(0, 25)) console.log(`    ERREUR ${e}`);
  }
  if (TOUTES) {
    for (const url of lessonUrls()) {
      await page.goto(`${BASE}${url}`, { waitUntil: "load", timeout: 120000 });
      await page.waitForTimeout(800);
      if (/Page introuvable/.test(await page.title()) || page.url().includes("/login")) { console.log(`    ? ${url} : page non chargée`); warnings++; continue; }
      const found = await page.evaluate(scanLesson);
      warnings += found.length;
      for (const f of found) console.log(`    AVERTISSEMENT ${w} ${url} : ${f}`);
    }
  }
  await ctx.close();
}
await browser.close();
console.log(`RESULTAT erreurs=${errors} avertissements=${warnings}`);
process.exit(errors ? 1 : 0);
