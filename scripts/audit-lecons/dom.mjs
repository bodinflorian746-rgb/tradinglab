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
const pages = PAGES.length ? PAGES.map((url) => ({ url, charts: LOT.find((l) => l.url === url)?.charts ?? ALL_CHARTS })) : LOT.map((l) => ({ url: l.url, charts: l.charts }));

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

  // ─── Règles par notion (data-role posé par le schéma, vérifié sur les bougies) ───
  function checkNotions(svg, cs, E) {
    const n = cs.length;
    const dec = +svg.dataset.decimals || 0;
    const unit = Math.pow(10, -(dec >= 5 ? 4 : dec));
    const eq = (a, b) => Math.abs(a - b) <= 1e-9;
    const body = (k) => Math.abs(k.c - k.o);
    const up = (k) => k.c > k.o;
    const upW = (k) => k.h - Math.max(k.o, k.c), loW = (k) => Math.min(k.o, k.c) - k.l;
    const pivH = (i) => i >= 2 && i <= n - 3 && [i - 2, i - 1, i + 1, i + 2].every((j) => cs[j].h < cs[i].h);
    const pivL = (i) => i >= 2 && i <= n - 3 && [i - 2, i - 1, i + 1, i + 2].every((j) => cs[j].l > cs[i].l);
    const meanBody = (a) => { const prev = cs.slice(Math.max(0, a - 10), a); return prev.length >= 3 ? prev.reduce((s, k) => s + body(k), 0) / prev.length : null; };
    const zoneOf = (key) => svg.querySelector(`rect[data-zone="${key}"]`);
    const fmt = (x) => x.toFixed(dec >= 5 ? 5 : dec);
    // Touches d'un niveau : groupes de bougies qui l'atteignent, séparés par un éloignement
    const touches = (side, lo, hi, from = 0, to = n - 1) => {
      const med = [...cs].map((k) => k.h - k.l).sort((a, b) => a - b)[Math.floor(n / 2)];
      const tol = med * 0.25;
      let count = 0, inTouch = false, away = true;
      for (let i = Math.max(0, from); i <= Math.min(n - 1, to); i++) {
        const v = side === "low" ? cs[i].l : cs[i].h;
        const hit = v >= lo - tol && v <= hi + tol;
        const far = side === "low" ? cs[i].l > hi + 2 * tol : cs[i].h < lo - 2 * tol;
        if (hit && !inTouch && away) { count++; inTouch = true; away = false; }
        if (!hit) inTouch = false;
        if (far) away = true;
      }
      return count;
    };
    // Repères, et niveaux BOS / CHoCH (le niveau va du swing cassé à la bougie qui le casse : data-to)
    const notions = [...svg.querySelectorAll("[data-marker][data-role]"), ...[...svg.querySelectorAll("line[data-level][data-role]")].filter((l) => /^(bos|choch)$/.test(l.dataset.role)).map((l) => ({ dataset: { ...l.dataset, i: l.dataset.to, price: l.dataset.price } }))];
    for (const m of notions) {
      const role = m.dataset.role, i = +m.dataset.i, price = +m.dataset.price, k = cs[i], dir = m.dataset.dir;
      const name = `repère ${role} (bougie ${i})`;
      if (!k) { E(`${name} : bougie absente`); continue; }
      if (role === "close" && !eq(price, k.c)) E(`${name} : placé à ${fmt(price)}, la clôture est ${fmt(k.c)}`);
      if (role === "high" && !eq(price, k.h)) E(`${name} : placé à ${fmt(price)}, le plus haut est ${fmt(k.h)}`);
      if (role === "low" && !eq(price, k.l)) E(`${name} : placé à ${fmt(price)}, le plus bas est ${fmt(k.l)}`);
      if (role === "swing-high" && (!pivH(i) || !eq(price, k.h))) E(`${name} : pas un vrai sommet (bougies plus basses de chaque côté, jamais au bord)`);
      if (role === "swing-low" && (!pivL(i) || !eq(price, k.l))) E(`${name} : pas un vrai creux (bougies plus hautes de chaque côté, jamais au bord)`);
      if (role === "bos" || role === "choch") {
        const j = +m.dataset.ref, b = dir !== "bear";
        const lvl = b ? cs[j]?.h : cs[j]?.l;
        if (!(b ? pivH(j) : pivL(j))) E(`${name} : le niveau cassé (bougie ${j}) n'est pas un vrai swing`);
        else if (!(b ? k.c > lvl : k.c < lvl)) E(`${name} : la clôture ${fmt(k.c)} ne casse pas ${fmt(lvl)}`);
        else if (cs.slice(j + 1, i).some((q) => (b ? q.c > lvl : q.c < lvl))) E(`${name} : une clôture antérieure avait déjà cassé ${fmt(lvl)}`);
        if (role === "choch" && cs[j]) {
          // contre la tendance en cours : le swing cassé est un LH (CHoCH haussier) ou un HL (CHoCH baissier)
          const prev = [...Array(j).keys()].reverse().find((q) => (b ? pivH(q) : pivL(q)));
          if (prev === undefined || !(b ? cs[prev].h > lvl : cs[prev].l < lvl)) E(`${name} : le swing cassé n'est pas un ${b ? "LH" : "HL"} (pas de tendance contraire en cours)`);
        }
      }
      if (role === "sweep") {
        const lvl = +m.dataset.ref, b = dir ? dir === "bull" : k.l < lvl;
        if (!(b ? k.l < lvl && k.c > lvl : k.h > lvl && k.c < lvl)) E(`${name} : pas de mèche au-delà de ${fmt(lvl)} avec clôture de retour à l'intérieur`);
      }
      if (role === "rejet") {
        const z = zoneOf(m.dataset.ref);
        if (!z) E(`${name} : zone « ${m.dataset.ref} » absente`);
        else {
          const y1 = +z.dataset.y1, y2 = +z.dataset.y2, b = dir ? dir === "bull" : true;
          if (!(b ? k.l <= y2 && up(k) && k.c >= y1 : k.h >= y1 && !up(k) && k.c <= y2)) E(`${name} : la mèche n'entre pas dans la zone ou la clôture n'est pas dans le sens du rejet`);
        }
      }
      if (role === "engulfing") {
        const p = cs[i - 1];
        if (!p || up(k) === up(p) || !(Math.max(k.o, k.c) >= Math.max(p.o, p.c) && Math.min(k.o, k.c) <= Math.min(p.o, p.c) && body(k) > body(p))) E(`${name} : le corps n'englobe pas entièrement le corps précédent de couleur opposée`);
      }
      if (role === "pinbar") {
        const b = dir ? dir === "bull" : loW(k) > upW(k);
        if (!((b ? loW(k) : upW(k)) >= 2 * body(k))) E(`${name} : mèche ${fmt(b ? loW(k) : upW(k))} < 2 × corps ${fmt(body(k))}`);
      }
      if (role === "impulse" || role === "displacement") {
        const [a, z] = (m.dataset.span || `${i},${i}`).split(",").map(Number);
        const seq = cs.slice(a, z + 1), mb = meanBody(a);
        const b = up(seq[0]);
        if (seq.some((q) => up(q) !== b)) E(`${name} : bougies de sens contraires dans la séquence`);
        if (mb === null) E(`${name} : moins de 3 bougies avant la séquence pour comparer les corps`);
        else if (role === "impulse") {
          if (seq.length > 3) E(`${name} : ${seq.length} bougies (une impulsion en compte 1 à 3)`);
          seq.forEach((q, t) => {
            if (body(q) < 2 * mb) E(`${name} : corps de la bougie ${a + t} = ${(body(q) / mb).toFixed(1)} × la moyenne des précédentes (au moins 2)`);
            if (Math.max(upW(q), loW(q)) > 0.35 * body(q)) E(`${name} : mèche longue sur la bougie ${a + t}`);
          });
        } else {
          if (seq.length < 2) E(`${name} : une seule bougie (un displacement est une séquence)`);
          seq.forEach((q, t) => {
            if (body(q) < 1.5 * mb) E(`${name} : corps de la bougie ${a + t} = ${(body(q) / mb).toFixed(1)} × la moyenne des précédentes (au moins 1,5)`);
            if (t && body(q) < 0.9 * body(seq[t - 1])) E(`${name} : le corps rétrécit (bougie ${a + t})`);
            // mèche contraire : au-dessus du corps pour une séquence baissière, en dessous pour une haussière
            if ((b ? loW(q) : upW(q)) > 0.15 * body(q)) E(`${name} : mèche contraire visible sur la bougie ${a + t}`);
          });
        }
      }
    }
    for (const m of svg.querySelectorAll("[data-marker]:not([data-role])")) {
      const k = cs[+m.dataset.i];
      const lab = m.querySelector("text")?.textContent ?? "";
      if (k && /cl[oô]ture/i.test(lab) && !eq(+m.dataset.price, k.c)) E(`repère « ${lab} » : annonce une clôture mais il est placé à ${fmt(+m.dataset.price)} (clôture ${fmt(k.c)})`);
    }
    for (const z of svg.querySelectorAll("rect[data-zone]")) {
      const role = z.dataset.role || z.dataset.kind, y1 = +z.dataset.y1, y2 = +z.dataset.y2;
      const name = `zone ${z.dataset.zone} (${role})`;
      if (role === "fvg" && !(y2 - y1 > 1e-9)) E(`${name} : aucun écart réel`);
      if (role === "ob" && z.dataset.src) {
        const i = +z.dataset.src.split(":")[1], k = cs[i];
        // zone tirée d'un autre panneau (même schéma) : la règle s'applique là où se trouve la bougie
        if (k && !(eq(Math.min(k.o, k.c), y1) && eq(Math.max(k.o, k.c), y2))) continue;
        const b = z.dataset.dir ? z.dataset.dir === "bull" : k && !up(k);
        if (!k || up(k) === b) E(`${name} : la bougie ${i} n'est pas opposée à l'impulsion`);
        else {
          const sw = [...Array(i).keys()].reverse().find((q) => (b ? pivH(q) : pivL(q)));
          const j = cs.findIndex((q, t) => t > i && (b ? q.c > cs[sw]?.h : q.c < cs[sw]?.l));
          if (sw === undefined) E(`${name} : aucun vrai swing avant l'OB à casser`);
          else if (j < 0) E(`${name} : l'impulsion après l'OB ne casse pas la structure (${fmt(b ? cs[sw].h : cs[sw].l)})`);
          else if (cs.slice(i + 1, j + 1).some((q) => up(q) !== b)) E(`${name} : la bougie ${i} n'est pas la dernière bougie opposée avant l'impulsion`);
        }
      }
      if (/^(support|resistance)$/.test(z.dataset.role || "")) {
        const from = z.dataset.from ? +z.dataset.from : 0;
        const t = touches(z.dataset.role === "support" ? "low" : "high", y1, y2, from, z.dataset.to ? +z.dataset.to : n - 1);
        if (t < 2) E(`${name} : ${t} touche visible (au moins 2)`);
      }
      if (z.dataset.role === "range") {
        const tl = touches("low", y1, y1), th = touches("high", y2, y2);
        if (tl < 2 || th < 2) E(`${name} : bornes touchées ${th} fois en haut, ${tl} fois en bas (au moins 2 chacune)`);
      }
      if (z.dataset.role === "confluence") {
        for (const key of (z.dataset.ref || "").split(",").filter(Boolean)) {
          const l = svg.querySelector(`line[data-level="${key}"]`);
          const v = l ? +l.dataset.price : +key;
          if (!(v >= y1 - 1e-9 && v <= y2 + 1e-9)) E(`${name} : le niveau ${key} (${fmt(v)}) n'est pas dans la zone`);
        }
      }
    }
    for (const l of svg.querySelectorAll("line[data-level][data-role]")) {
      const role = l.dataset.role, v = +l.dataset.price, name = `niveau ${l.dataset.level} (${role})`;
      if (/^(support|resistance|range-high|range-low)$/.test(role)) {
        const t = touches(/support|low/.test(role) ? "low" : "high", v, v, l.dataset.from ? +l.dataset.from : 0, l.dataset.to ? +l.dataset.to : n - 1);
        if (t < 2) E(`${name} : ${t} touche visible (au moins 2)`);
      }
      if (role === "fib") {
        const [i1, i2, r] = (l.dataset.ref || "").split(":").map(Number);
        const bullSwing = cs[i2].h > cs[i1].h;
        const lo = bullSwing ? cs[i1].l : cs[i2].l, hi = bullSwing ? cs[i2].h : cs[i1].h;
        const seg = cs.slice(Math.min(i1, i2), Math.max(i1, i2) + 1);
        if (Math.min(...seg.map((q) => q.l)) < lo - 1e-9 || Math.max(...seg.map((q) => q.h)) > hi + 1e-9) E(`${name} : le swing ${i1}→${i2} ne part pas de ses extrêmes`);
        const want = bullSwing ? hi - r * (hi - lo) : lo + r * (hi - lo);
        if (Math.abs(want - v) > unit / 2 + 1e-9) E(`${name} : ${fmt(v)} au lieu de ${fmt(want)} (${r} du swing ${fmt(lo)} → ${fmt(hi)})`);
      }
    }
    for (const s of svg.querySelectorAll("line[data-segment][data-role]")) {
      const [i1, i2] = (s.dataset.ref || "").split(",").map(Number);
      const top = s.dataset.role === "dt-height";
      const ext = top ? Math.max(cs[i1].h, cs[i2].h) : Math.min(cs[i1].l, cs[i2].l);
      if (!eq(+s.dataset.p1, ext) && !eq(+s.dataset.p2, ext)) E(`hauteur ${s.dataset.segment} : ne part pas de l'extrême du pattern (${fmt(ext)})`);
    }
  }

  // ─── Lisibilité : étiquettes libres, nommées, et chiffres issus des données ───
  function checkLegibility(svg, width, E) {
    const num = (el, a) => +el.getAttribute(a);
    const shrink = (r, d) => ({ x: r.x + d, y: r.y + d, w: r.w - 2 * d, h: r.h - 2 * d });
    const inter = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
    // segment ∩ rectangle (Liang–Barsky)
    const segHits = (x1, y1, x2, y2, r) => {
      let t0 = 0, t1 = 1;
      const dx = x2 - x1, dy = y2 - y1;
      for (const [p, q] of [[-dx, x1 - r.x], [dx, r.x + r.w - x1], [-dy, y1 - r.y], [dy, r.y + r.h - y1]]) {
        if (p === 0) { if (q < 0) return false; continue; }
        const t = q / p;
        if (p < 0) { if (t > t1) return false; if (t > t0) t0 = t; } else { if (t < t0) return false; if (t < t1) t1 = t; }
      }
      return true;
    };
    const labels = [...svg.querySelectorAll("g[data-label-for]")].map((g) => {
      const r = g.querySelector("rect");
      return { key: g.dataset.labelFor, t: g.textContent.trim(), r: shrink({ x: num(r, "x"), y: num(r, "y"), w: num(r, "width"), h: num(r, "height") }, 1) };
    });
    const candles = [...svg.querySelectorAll("[data-candle]")].map((g) => {
      const w = g.querySelector("line"), b = g.querySelector("rect");
      const y1 = Math.min(num(w, "y1"), num(b, "y")), y2 = Math.max(num(w, "y2"), num(b, "y") + num(b, "height"));
      return { i: g.dataset.candle, r: { x: num(b, "x"), y: y1, w: num(b, "width"), h: y2 - y1 } };
    });
    const zones = [...svg.querySelectorAll("rect[data-zone]")].map((z) => ({ k: z.dataset.zone, r: { x: num(z, "x"), y: num(z, "y"), w: num(z, "width"), h: num(z, "height") } }));
    const lines = [];
    for (const l of svg.querySelectorAll("line[data-level], line[data-segment], line[data-leader]")) {
      if (l.closest("[data-rsi]") && l.dataset.level) continue;
      lines.push({ k: l.dataset.level || l.dataset.segment || `trait de ${l.dataset.leader}`, own: l.dataset.leader, s: [num(l, "x1"), num(l, "y1"), num(l, "x2"), num(l, "y2")] });
    }
    for (const pl of svg.querySelectorAll("polyline[data-ma], polyline[data-price-line]")) {
      const pts = pl.getAttribute("points").trim().split(/\s+/).map((p) => p.split(",").map(Number));
      for (let q = 1; q < pts.length; q++) lines.push({ k: pl.dataset.ma || "ligne de prix", s: [...pts[q - 1], ...pts[q]] });
    }
    for (const L of labels) {
      for (const c of candles) if (inter(L.r, c.r)) { E(`étiquette « ${L.t} » sur la bougie ${c.i}`); break; }
      for (const z of zones) if (inter(L.r, z.r)) E(`étiquette « ${L.t} » sur la zone ${z.k}`);
      for (const l of lines) if (l.own !== L.key && segHits(...l.s, L.r)) { E(`étiquette « ${L.t} » traversée par ${l.k}`); break; }
      if (!/\p{L}/u.test(L.t.replace(/(?<![\p{L}])pips?(?![\p{L}])/gu, ""))) E(`étiquette « ${L.t} » : un chiffre seul, sans nom`);
    }
    // En grand format (libellés complets) : chaque prix écrit correspond à une donnée du panneau
    if (width >= 480 && svg.dataset.candles) {
      const dec = +svg.dataset.decimals || 0;
      const vals = [];
      JSON.parse(svg.dataset.candles).forEach((k) => vals.push(k.o, k.h, k.l, k.c));
      svg.querySelectorAll("[data-price]").forEach((e) => vals.push(+e.dataset.price));
      svg.querySelectorAll("rect[data-zone]").forEach((z) => vals.push(+z.dataset.y1, +z.dataset.y2));
      svg.querySelectorAll("line[data-segment]").forEach((s) => vals.push(+s.dataset.p1, +s.dataset.p2));
      const d = dec >= 5 ? 4 : dec;
      const re = d === 0 ? /(\d{1,3}(?:[\s  ]\d{3})+|\d{3,})(?=\s?\$)/g : new RegExp(`\\b\\d+\\.\\d{${d}}\\b`, "g");
      for (const L of labels) for (const m of L.t.matchAll(re)) {
        const v = +m[0].replace(/[\s  ]/g, "");
        if (!vals.some((x) => Math.abs(x - v) <= Math.pow(10, -d) / 2 + 1e-9)) E(`étiquette « ${L.t} » : ${m[0]} ne correspond à aucune donnée du graphique`);
      }
    }
  }

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
        // Accessibilité : description (<desc> relié par aria-describedby) qui reprend chaque étiquette du dessin
        const desc = svg.getAttribute("aria-describedby") && svg.ownerDocument.getElementById(svg.getAttribute("aria-describedby"));
        const dtext = desc ? desc.textContent.trim() : "";
        if (dtext.length < 20) E(id, `${P} : description accessible absente`);
        else if (r0.width >= 480) for (const g of svg.querySelectorAll("g[data-label-for]")) {
          // en grand format, les étiquettes affichées sont les libellés complets : chacune doit être décrite
          const lab = g.textContent.trim();
          if (lab && !dtext.includes(lab)) E(id, `${P} : « ${lab} » absent de la description accessible`);
        }
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
        if (svg.dataset.candles) checkNotions(svg, JSON.parse(svg.dataset.candles), (m) => E(id, `${P} ${m}`));
        checkLegibility(svg, r0.width, (m) => E(id, `${P} ${m}`));
      }
      // Pastilles et légende qui répètent le graphique (mêmes chiffres, même texte)
      {
        const labs = [...fig.querySelectorAll("g[data-label-for]")].map((g) => g.textContent.trim().toLowerCase());
        const descs = [...fig.querySelectorAll("svg desc")].map((d) => d.textContent.toLowerCase()).join(" ");
        const nums = (s) => (s.match(/\d+(?:[.,\s  ]\d+)*/g) ?? []).map((x) => x.replace(/[\s  ]/g, "").replace(",", "."));
        const onChart = new Set(nums(labs.join(" ") + " " + descs));
        for (const c of fig.querySelectorAll("[data-chip]")) {
          const t = c.textContent.trim().toLowerCase();
          const n = nums(t).filter((x) => x.replace(/\D/g, "").length >= 2);
          if (labs.some((l) => l === t || (t.length > 3 && l.includes(t)))) E(id, `pastille « ${c.textContent.trim()} » qui répète une étiquette du graphique`);
          else if (n.length && !c.dataset.rr && n.every((x) => onChart.has(x))) E(id, `pastille « ${c.textContent.trim()} » qui répète les chiffres du graphique`);
        }
      }
      // Double cadre : une ancienne carte (bordure, fond, ombre) qui n'enveloppe que le schéma
      for (let el = fig.parentElement; el && el !== document.body && el.tagName !== "MAIN"; el = el.parentElement) {
        const cs = getComputedStyle(el);
        const alpha = (col) => { const m = col.match(/rgba?\(([^)]+)\)/); if (!m) return 0; const v = m[1].split(/[ ,/]+/).filter(Boolean); return v.length > 3 ? parseFloat(v[3]) : 1; };
        const border = ["Top", "Right", "Bottom", "Left"].some((s) => parseFloat(cs[`border${s}Width`]) > 0 && alpha(cs[`border${s}Color`]) > 0.01);
        const framed = border || alpha(cs.backgroundColor) > 0.01 || cs.backgroundImage !== "none" || cs.boxShadow !== "none";
        if (!framed) continue;
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        let other = "";
        for (let n = walker.nextNode(); n; n = walker.nextNode()) if (!n.parentElement.closest("[data-lesson-chart]")) other += n.textContent.trim();
        if (other.length < 120) E(id, `double cadre : ${el.tagName.toLowerCase()}.${(el.getAttribute("class") || "").split(/\s+/).slice(0, 4).join(".")} enveloppe le schéma${other ? ` (avec « ${other.slice(0, 40)} »)` : ""}`);
        break;
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
        // texte non affiché (description accessible) : vocabulaire et variables seulement
        const hidden = !!el.closest("desc, title");
        if (!hidden && px < 11.95) E(id, `texte ${px.toFixed(1)} px « ${own.slice(0, 30)} »`);
        if (/[{}]|\$\{|undefined|NaN|\[object/.test(own)) E(id, `variable non remplacée « ${own.slice(0, 40)} »`);
        for (const v of vocab) { const m = own.match(new RegExp(`(?<![\\p{L}\\d])(?:${v.src})(?![\\p{L}\\d])`, v.flags)); if (m) E(id, `vocabulaire « ${m[0]} » → « ${v.retenu} »`); }
        if (!svg && (cs.overflow === "hidden" || cs.textOverflow === "ellipsis") && el.scrollWidth > el.clientWidth + 1) E(id, `texte tronqué « ${own.slice(0, 40)} »`);
        if (svg && !hidden) {
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
  "description accessible vide": () => { const s = document.querySelector("svg[aria-describedby]"); document.getElementById(s.getAttribute("aria-describedby")).textContent = ""; },
  "texte de 10 px": () => { document.querySelector("[data-lesson-chart] svg text").setAttribute("font-size", "10"); },
  "variable non remplacée": () => { document.querySelector("[data-lesson-chart] .lc-caption").textContent = "{L.resistance}"; },
  "pivot mal nommé": () => { const m = document.querySelector("[data-pivot='HL']"); m.dataset.pivot = "LL"; },
  "élément masqué": () => { document.querySelector("[data-chip]").style.display = "none"; },
  "vocabulaire interdit": () => { document.querySelector("[data-lesson-chart] .lc-caption").textContent = "Attention au stop hunt"; },
  "zone ≠ corps de l'OB": () => { const z = document.querySelector("rect[data-src]"); z.dataset.y2 = String(+z.dataset.y2 + 0.0005); },
  "niveau hors de son prix": () => { const l = document.querySelector("line[data-level]:not([data-offscale])"); l.setAttribute("y1", +l.getAttribute("y1") + 3); },
  "étiquette sur une bougie": () => { const g = document.querySelector("[data-candle='3']"); const b = g.querySelector("rect"); const r = document.querySelector("[data-marker] g[data-label-for] rect"); r.setAttribute("x", b.getAttribute("x")); r.setAttribute("y", b.getAttribute("y")); },
  "étiquette = un prix seul": () => { document.querySelector("[data-marker] g[data-label-for] text").textContent = "1.1748"; },
  "repère « clôture » sur la mèche": () => { const m = document.querySelector("svg[data-candles] [data-marker]"); const s = m.closest("svg"); const k = JSON.parse(s.dataset.candles)[+m.dataset.i]; m.dataset.role = "close"; m.dataset.price = String(k.h === k.c ? k.l : k.h); },
  "BOS sur une bougie au bord": () => { const m = document.querySelector("svg[data-candles] [data-marker]"); m.dataset.role = "bos"; m.dataset.ref = "0"; },
  "double cadre": () => { const f = document.querySelector("[data-lesson-chart]"); const w = document.createElement("div"); w.style.border = "1px solid #444"; w.style.padding = "16px"; f.parentElement.insertBefore(w, f); w.appendChild(f); },
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
      await page.waitForSelector("[data-lesson-chart] svg[data-panel]", { timeout: 120000 }).catch(() => {});
      await page.waitForTimeout(400);
      const before = new Set(await page.evaluate(checkCharts, { ids: p.charts, vocab: VOCAB }));
      const applied = await page.evaluate(`(() => { try { (${fn.toString()})(); return true; } catch { return false; } })()`);
      if (!applied) continue;
      errs = (await page.evaluate(checkCharts, { ids: p.charts, vocab: VOCAB })).filter((e) => !before.has(e));
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
