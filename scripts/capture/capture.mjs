// scripts/capture/capture.mjs
//
// Pipeline de capture screenshots + vidéo pour matière organique (TikTok / Reels
// / Shorts / ads). Outil PUREMENT EXTERNE : ne touche à aucun fichier de l'app,
// se contente de visiter les pages publiques en local via Playwright.
//
// Usage :
//   1. Lance le dev server : npm run dev (port 3000 attendu)
//   2. Sample (validation visuelle) : node scripts/capture/capture.mjs
//   3. Full run (~46 URLs)         : node scripts/capture/capture.mjs --full
//
// Optionnel — capture authentifiée (lessons sont gatées par PremiumGate, en
// anonyme on capture le paywall) :
//   - Générer un storage state via Playwright codegen :
//       npx playwright codegen --save-storage=auth.json http://localhost:3000/fr
//     puis se connecter manuellement en tant qu'admin et fermer la fenêtre.
//   - Lancer : CAPTURE_STORAGE_STATE=./auth.json node scripts/capture/capture.mjs
//
// Sorties (toutes dans captures/, gitignored) :
//   captures/desktop/  PNG full-page desktop 1440×900 dsf=2
//   captures/mobile/   PNG full-page mobile 390×844 dsf=3
//   captures/svg/      Crops isolés SVG > 250×200 (fond transparent)
//   captures/video/    .webm vertical 9:16 (1080×1920) scroll lent ~20s
//   captures/manifest.json  Index { url, slug, type, file } pour chaque sortie

import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), "..", "..");
const OUT_DIR = path.join(ROOT, "captures");
const VIDEO_TMP = path.join(OUT_DIR, "video", ".tmp");

const BASE_URL = process.env.CAPTURE_BASE_URL || "http://localhost:3000";
const STORAGE_STATE = process.env.CAPTURE_STORAGE_STATE || null;
const VIDEO_DURATION_MS = 20000;

// Comptes de leçons (source de vérité : lib/formations.ts + dirs macro lus
// à la création du script ; les valeurs sont figées ici pour éviter d'importer
// du code de l'app dans un outil de capture). À mettre à jour si une nouvelle
// leçon est ajoutée.
const FORMATIONS = { debutant: 10, intermediaire: 9, avance: 9 };
const MACRO = { debutant: 6, intermediaire: 6, avance: 4 };

const LOCALE = "fr";

const args = process.argv.slice(2);
const isFull = args.includes("--full");

function buildAllUrls() {
  const urls = [
    { url: `/${LOCALE}`, slug: "home", group: "marketing", interactive: false },
    { url: `/${LOCALE}/pricing`, slug: "pricing", group: "marketing", interactive: false },
  ];
  for (const [lv, n] of Object.entries(FORMATIONS)) {
    for (let i = 1; i <= n; i++) {
      urls.push({
        url: `/${LOCALE}/formations/${lv}/lecon${i}`,
        slug: `${lv}-lecon${i}`,
        group: lv,
        interactive: false,
      });
    }
  }
  for (const [lv, n] of Object.entries(MACRO)) {
    for (let i = 1; i <= n; i++) {
      urls.push({
        url: `/${LOCALE}/formations/macro/${lv}/lecon${i}`,
        slug: `macro-${lv}-lecon${i}`,
        group: `macro-${lv}`,
        interactive: false,
      });
    }
  }
  return urls;
}

const SAMPLE_SLUGS = new Set([
  "home",
  "pricing",
  "debutant-lecon3",      // a un CandleAnatomyDiagram (SVG riche)
  "macro-debutant-lecon1", // intro macro avec SVG
  "avance-lecon1",         // contient LiquidityPoolsDiagram (SVG + composant)
]);

function selectUrls() {
  const all = buildAllUrls();
  return isFull ? all : all.filter((u) => SAMPLE_SLUGS.has(u.slug));
}

function ensureDirs() {
  for (const sub of ["desktop", "mobile", "svg", "video"]) {
    fs.mkdirSync(path.join(OUT_DIR, sub), { recursive: true });
  }
  fs.mkdirSync(VIDEO_TMP, { recursive: true });
}

async function waitReady(page) {
  try {
    await page.waitForLoadState("networkidle", { timeout: 15000 });
  } catch {
    /* networkidle pas atteint → fallback timeout en-dessous */
  }
  await page.waitForTimeout(800);
}

function commonContextOpts() {
  const opts = {};
  if (STORAGE_STATE) opts.storageState = STORAGE_STATE;
  return opts;
}

// Pose le flag localStorage "onboarding seen" AVANT toute navigation, sinon
// l'OnboardingOverlay (modale plein écran z-[100]) masque tout le contenu sur
// chaque première visite et toutes les captures sont identiques.
async function applyDismissOnboarding(ctx) {
  await ctx.addInitScript(() => {
    try {
      window.localStorage.setItem("tradinglab_onboarding_v1", "done");
    } catch {
      /* mode privé : no-op */
    }
  });
}

async function captureDesktop(browser, urlEntry, manifest) {
  const ctx = await browser.newContext({
    ...commonContextOpts(),
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  await applyDismissOnboarding(ctx);
  const page = await ctx.newPage();
  await page.goto(BASE_URL + urlEntry.url, { waitUntil: "load", timeout: 30000 });
  await waitReady(page);

  const fileName = `${urlEntry.slug}.png`;
  const filePath = path.join(OUT_DIR, "desktop", fileName);
  await page.screenshot({ path: filePath, fullPage: true });
  manifest.push({ url: urlEntry.url, slug: urlEntry.slug, type: "desktop", file: `desktop/${fileName}` });

  await ctx.close();
}

async function captureMobile(browser, urlEntry, manifest) {
  const ctx = await browser.newContext({
    ...commonContextOpts(),
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    isMobile: true,
    hasTouch: true,
  });
  await applyDismissOnboarding(ctx);
  const page = await ctx.newPage();
  await page.goto(BASE_URL + urlEntry.url, { waitUntil: "load", timeout: 30000 });
  await waitReady(page);

  const fileName = `${urlEntry.slug}.png`;
  const filePath = path.join(OUT_DIR, "mobile", fileName);
  await page.screenshot({ path: filePath, fullPage: true });
  manifest.push({ url: urlEntry.url, slug: urlEntry.slug, type: "mobile", file: `mobile/${fileName}` });

  await ctx.close();
}

async function captureSvgs(browser, urlEntry, manifest) {
  const ctx = await browser.newContext({
    ...commonContextOpts(),
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  await applyDismissOnboarding(ctx);
  const page = await ctx.newPage();
  await page.goto(BASE_URL + urlEntry.url, { waitUntil: "load", timeout: 30000 });
  await waitReady(page);

  // Scroll de bout en bout pour forcer le lazy render (certains diagrammes
  // attendent leur visibilité), puis retour en haut.
  await page.evaluate(async () => {
    window.scrollTo(0, document.documentElement.scrollHeight);
    await new Promise((r) => setTimeout(r, 400));
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 200));
  });

  const svgs = await page.locator("svg").all();
  let idx = 0;
  for (const svg of svgs) {
    const box = await svg.boundingBox().catch(() => null);
    if (!box) continue;
    if (box.width < 250 || box.height < 200) continue;
    idx++;
    const fileName = `${urlEntry.slug}_${idx}.png`;
    const filePath = path.join(OUT_DIR, "svg", fileName);
    try {
      await svg.screenshot({ path: filePath, omitBackground: true });
      manifest.push({ url: urlEntry.url, slug: urlEntry.slug, type: "svg", file: `svg/${fileName}` });
    } catch (err) {
      console.warn(`  [svg ${idx}] échoué pour ${urlEntry.slug}: ${err.message}`);
    }
  }

  await ctx.close();
}

async function captureVideo(browser, urlEntry, manifest) {
  // 540×960 dsf=2 → output 1080×1920 = 9:16 exact, layout mobile actif (<768).
  const ctx = await browser.newContext({
    ...commonContextOpts(),
    viewport: { width: 540, height: 960 },
    deviceScaleFactor: 2,
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    isMobile: true,
    hasTouch: true,
    recordVideo: {
      dir: VIDEO_TMP,
      size: { width: 1080, height: 1920 },
    },
  });
  await applyDismissOnboarding(ctx);

  // Masque le curseur natif (par défaut Playwright video ne capte pas de curseur,
  // mais l'overlay system peut interférer selon l'OS — ceinture + bretelles).
  await ctx.addInitScript(() => {
    const s = document.createElement("style");
    s.textContent = "*, *::before, *::after { cursor: none !important; }";
    document.documentElement.appendChild(s);
  });

  const page = await ctx.newPage();
  await page.goto(BASE_URL + urlEntry.url, { waitUntil: "load", timeout: 30000 });
  await waitReady(page);

  // Scroll smooth ease-in-out cubic top → bottom sur VIDEO_DURATION_MS.
  await page.evaluate(async (duration) => {
    const maxScroll = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight,
    );
    const start = performance.now();
    return new Promise((resolve) => {
      function frame(now) {
        const t = Math.min(1, (now - start) / duration);
        // ease-in-out cubic
        const ease =
          t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        window.scrollTo(0, ease * maxScroll);
        if (t < 1) requestAnimationFrame(frame);
        else resolve();
      }
      requestAnimationFrame(frame);
    });
  }, VIDEO_DURATION_MS);

  // Petit pause à la fin pour respirer.
  await page.waitForTimeout(600);

  // Fermer la page AVANT le context pour que la vidéo soit finalisée + flush.
  const videoFile = await page.video()?.path();
  await page.close();
  await ctx.close();

  if (!videoFile || !fs.existsSync(videoFile)) {
    console.warn(`  [video] pas de fichier .webm pour ${urlEntry.slug}`);
    return;
  }

  const destName = `${urlEntry.slug}.webm`;
  const destPath = path.join(OUT_DIR, "video", destName);
  fs.renameSync(videoFile, destPath);
  manifest.push({
    url: urlEntry.url,
    slug: urlEntry.slug,
    type: "video",
    file: `video/${destName}`,
  });
}

async function pingServer() {
  try {
    const res = await fetch(BASE_URL + `/${LOCALE}`);
    return res.status >= 200 && res.status < 500;
  } catch {
    return false;
  }
}

async function main() {
  console.log(`Capture pipeline — mode=${isFull ? "FULL" : "SAMPLE"}`);
  console.log(`Base URL : ${BASE_URL}`);
  console.log(`Storage state : ${STORAGE_STATE ?? "(none, anonymous)"}`);

  if (!(await pingServer())) {
    console.error(
      `\nLe serveur ${BASE_URL} ne répond pas.\n` +
        `Lance 'npm run dev' dans un autre terminal et réessaie.\n`,
    );
    process.exit(1);
  }

  ensureDirs();
  const urls = selectUrls();
  console.log(`URLs à capturer : ${urls.length}`);
  urls.forEach((u) => console.log(`  • ${u.url}`));

  const browser = await chromium.launch();
  const manifest = [];

  for (const urlEntry of urls) {
    console.log(`\n▸ ${urlEntry.url}`);
    try {
      await captureDesktop(browser, urlEntry, manifest);
      console.log(`  ✓ desktop`);
    } catch (e) {
      console.error(`  ✗ desktop: ${e.message}`);
    }
    try {
      await captureMobile(browser, urlEntry, manifest);
      console.log(`  ✓ mobile`);
    } catch (e) {
      console.error(`  ✗ mobile: ${e.message}`);
    }
    try {
      const before = manifest.filter((m) => m.type === "svg" && m.slug === urlEntry.slug).length;
      await captureSvgs(browser, urlEntry, manifest);
      const after = manifest.filter((m) => m.type === "svg" && m.slug === urlEntry.slug).length;
      console.log(`  ✓ svg (${after - before} crops)`);
    } catch (e) {
      console.error(`  ✗ svg: ${e.message}`);
    }
    try {
      await captureVideo(browser, urlEntry, manifest);
      console.log(`  ✓ video`);
    } catch (e) {
      console.error(`  ✗ video: ${e.message}`);
    }
  }

  await browser.close();

  // Nettoyage tmp video dir
  try {
    fs.rmSync(VIDEO_TMP, { recursive: true, force: true });
  } catch {
    /* noop */
  }

  fs.writeFileSync(
    path.join(OUT_DIR, "manifest.json"),
    JSON.stringify(manifest, null, 2),
  );

  console.log(`\nDone. ${manifest.length} entrées dans captures/manifest.json`);
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
