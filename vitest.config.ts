import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

// Tests unitaires (logique pure). Séparés des tests Playwright (tests/*.spec.ts) :
// on cible uniquement lib/**/*.test.ts et on exclut le dossier tests/.
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  test: {
    include: ["lib/**/*.test.ts", "app/**/*.test.ts"],
    exclude: ["node_modules", "tests", ".next"],
    environment: "node",
  },
});
