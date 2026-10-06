// Filet de sécurité visuel : comparaison pixel de pages clés avec des captures de référence.
// Usage :
//   npm run visual:check                          → compare aux références
//   npm run visual:check -- --update-snapshots    → (re)crée les références
//   npm run visual:check -- -g "hub-jeux"         → une seule page
// Nécessite le serveur de dev déjà lancé sur le port 3000 (le script ne le démarre jamais).
// Leçons et jeux réservés aux membres : leurs références se prennent avec une
// session premium, VISUAL_STORAGE_STATE=<fichier storage state Playwright, hors dépôt>
//   VISUAL_STORAGE_STATE=… npm run visual:check -- -g "lecon|jeu-"
// Les autres pages se comparent en visiteur (sans la variable) :
//   npm run visual:check -- -g "home|pricing|broker|hub-"
// Références hors dépôt (captures propres à la machine, plusieurs dizaines de Mo) :
// dossier VISUAL_REFS, par défaut <dossier utilisateur>/tsx-visual-refs (stable :
// le dossier temporaire peut être vidé par Windows).
import os from "node:os";
import path from "node:path";
import { defineConfig } from "@playwright/test";

const REFS = process.env.VISUAL_REFS ?? path.join(os.homedir(), "tsx-visual-refs");

export default defineConfig({
  testDir: ".",
  testMatch: "visual.spec.ts",
  outputDir: path.join(os.tmpdir(), "tsx-visual-results"),
  snapshotPathTemplate: path.join(REFS, "{projectName}", "{arg}{ext}"),
  fullyParallel: true,
  workers: 1,   // un seul navigateur : des requêtes concurrentes ont corrompu un manifeste du serveur de dev
  retries: 0,
  timeout: 120_000,
  reporter: [["line"]],
  expect: {
    timeout: 60_000,
    // Comparaison au pixel près : aucune tolérance de couleur, aucun pixel différent
    toHaveScreenshot: { maxDiffPixels: 0, threshold: 0, animations: "disabled", caret: "hide", scale: "css" },
  },
  use: { baseURL: process.env.VISUAL_BASE_URL ?? "http://localhost:3000", locale: "fr-FR", timezoneId: "Europe/Paris", storageState: process.env.VISUAL_STORAGE_STATE || undefined },
  projects: [
    { name: "mobile-390x844", use: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true } },
    { name: "desktop-1440x900", use: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 } },
  ],
});
