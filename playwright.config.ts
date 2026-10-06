import { defineConfig, devices } from "@playwright/test";
import { ACTIVE_LOCALES } from "./i18n/config";

// Langues désactivées (i18n/config.ts, ACTIVE_LOCALES) : leurs specs ne sont
// plus lancées, ni celle du sélecteur de langue s'il ne reste qu'une langue.
// Elles restent dans le dépôt et reviennent dès que la langue est réactivée.
const testIgnore = [
  ...(ACTIVE_LOCALES.includes("es") ? [] : [/i18n-es-.*.spec.ts$/]),
  ...(ACTIVE_LOCALES.length > 1 ? [] : [/navbar-locale-switch.spec.ts$/]),
];

export default defineConfig({
  testDir: "./tests",
  testIgnore,
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
    video: "off",
    trace: "off",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
