// Audit DOM des 4 jeux (navigateur) : joue une session complète par jeu × langue × format.
// Usage : node scripts/audit-jeux/dom.mjs [--base=http://localhost:3000] [--jeux=place-stop,...] [--langues=fr,es] [--formats=390,1440]
// Nécessite le serveur de dev déjà lancé (le script ne le démarre jamais).
//
// Règles :
//  - troncature : aucun texte coupé (ellipsis / overflow caché) ni hors écran, sur
//    l'écran de niveau, la 1re question, le 1er verdict et le bilan ;
//  - sonde Place ton Stop : ordre vertical des lignes = ordre des étiquettes
//    « Stop 1/2/3 » = ordre des boutons (couleurs et numéros) ;
//  - sonde Build the Trade : chaque bouton de l'étape active a son prix en
//    étiquette sur le graphique, étiquettes rangées par prix ;
//  - verdict : état (bon / partiel / faux), couleurs du titre et des points
//    cohérentes, maximum affiché ; barème simple : bon > 0, faux = 0 (sans signe).
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

// Build the Trade, étape active : prix des boutons = étiquettes du graphique, rangées par prix
const probePlan = (page) => page.evaluate(() => {
  const num = (s) => parseFloat(s.replace(/[^\d.,-]/g, "").replace(/,/g, ""));
  const chart = document.querySelector(".tsx-v2 .v2-chart");
  const tags = [...chart.querySelectorAll("text")].map((t) => ({ txt: t.textContent.trim(), y: t.getBoundingClientRect().top })).filter((t) => /^[\d.,]+$/.test(t.txt));
  const prices = [...document.querySelectorAll(".tsx-v2 [data-pick]")].map((b) => b.querySelector(".v2-mono")?.textContent.trim()).filter(Boolean);
  const errs = [];
  for (const p of prices) if (!tags.some((t) => t.txt === p)) errs.push(`prix du bouton ${p} absent des étiquettes`);
  const sorted = [...tags].sort((a, b) => a.y - b.y);
  for (let i = 1; i < sorted.length; i++) if (num(sorted[i].txt) > num(sorted[i - 1].txt)) { errs.push("étiquettes pas rangées par prix"); break; }
  return errs;
});

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
    let round = 0;
    for (; round < 12; round++) {
      const ready = slug === "build-the-trade" ? page.locator('[data-pick^="entry:"]').first()
        : slug === "place-stop" ? page.getByRole("button", { name: "Stop 1", exact: true })
        : slug === "find-the-mistake" ? page.locator("[data-choice]").first()
        : page.getByRole("button", { name: "NO TRADE" }).first();
      try { await ready.waitFor({ timeout: 15000 }); } catch { break; }
      await page.waitForTimeout(round === 0 ? 4500 : 1500);
      if (round === 0) add("question", await scan(page));
      if (slug === "place-stop") add(`round ${round + 1}`, await probeStops(page));
      if (slug === "build-the-trade") {
        add(`round ${round + 1} entrée`, await probePlan(page));
        for (const step of ["entry", "stop", "tp"]) { await page.locator(`[data-pick^="${step}:"]`).nth(round % 3).click(); await page.waitForTimeout(250); }
        await page.getByRole("button", { name: VALIDATE[loc] }).click();
      } else if (slug === "place-stop") await page.getByRole("button", { name: `Stop ${(round % 3) + 1}`, exact: true }).click();
      else if (slug === "find-the-mistake") await page.locator("[data-choice]").nth(round % 4).click();
      else await page.getByRole("button", { name: ["BUY", "SELL", "NO TRADE"][round % 3] }).first().click();
      await page.locator(".v2-verdict").first().waitFor({ timeout: 20000 });
      await page.waitForTimeout(1500);
      add(`verdict ${round + 1}`, await probeVerdict(page));
      states.add(await page.locator("[data-verdict]").first().getAttribute("data-verdict"));
      if (round === 0) add("verdict", await scan(page));
      const next = page.locator(".tsx-v2 button.v2-btn").last();
      await next.scrollIntoViewIfNeeded(); await next.click();
      await page.waitForTimeout(800);
      if (await page.locator(".v2-chart").count() === 0) break;
    }
    await page.waitForTimeout(1200);
    add("bilan", await scan(page));
    return { errs: [...new Set(errs)], rounds: round + 1, states: [...states].join("/") };
  } catch (e) {
    return { errs: [...errs, `session interrompue : ${e.message.split("\n")[0].slice(0, 120)}`], rounds: 0, states: "" };
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
      lines.push(`${g.padEnd(18)} ${l} ${f.padStart(4)} : ${r.errs.length} erreur(s), ${r.rounds} rounds, états ${r.states}`);
      r.errs.slice(0, 6).forEach((e) => lines.push(`    ${e}`));
    }
  };
  await Promise.all([worker(), worker(), worker(), worker()]);
  await browser.close();
  console.log(lines.sort().join("\n"));
  console.log(`RESULTAT erreurs=${errors} avertissements=0`);
  process.exit(errors ? 1 : 0);
})();
