// Serveur de dev : `npm run dev` (arguments transmis à next dev, ex. `npm run dev -- -H 0.0.0.0`).
//
// Pourquoi ce lanceur : next dev construit sa table des routes (route → fichier
// page) à chaque événement « aggregated » de son watcher, et le parcours initial
// de app/ en déclenche plusieurs (le premier ne voit qu'une partie des pages,
// les plus profondes — les leçons — arrivent ensuite). Ces reconstructions sont
// asynchrones et non ordonnées : si la première, incomplète, se termine après la
// complète, les leçons manquent à la table jusqu'au prochain changement de
// fichier, et Next les sert par la route suivante qui correspond,
// app/[locale]/[...notfound] : « Page introuvable », avec ou sans session.
//
// Une fois le serveur prêt et le parcours terminé, le lanceur crée puis efface
// un fichier vide dans app/ (aucune page, rien à compiler) : le watcher
// reconstruit la table avec toutes les pages. Puis il vérifie une leçon (sans
// session : écran de verrouillage attendu) et recommence si besoin.
// Production inchangée : ce script ne sert qu'au développement.
import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const NEXT = path.join(ROOT, "node_modules", "next", "dist", "bin", "next");
const POKE = path.join(ROOT, "app", ".table-des-routes");
const PROBE = "/fr/formations/debutant/lecon1";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const child = spawn(process.execPath, [NEXT, "dev", ...process.argv.slice(2)], { cwd: ROOT, stdio: ["inherit", "pipe", "inherit"], env: process.env });
child.stdout.pipe(process.stdout);

// Arrêt : tout l'arbre de next dev (sous Windows, tuer le parent laisse le serveur écouter)
const stop = () => {
  if (child.exitCode === null) {
    if (process.platform === "win32") spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"], { stdio: "ignore" });
    else child.kill("SIGTERM");
  }
  try { fs.rmSync(POKE, { force: true }); } catch {}
};
for (const sig of ["SIGINT", "SIGTERM", "SIGHUP"]) process.on(sig, () => { stop(); process.exit(0); });
child.on("exit", (code) => { try { fs.rmSync(POKE, { force: true }); } catch {} process.exit(code ?? 0); });

let out = "";
const ready = new Promise((resolve) => {
  child.stdout.on("data", (d) => {
    if (out.length < 4000) out += d.toString();
    if (/Ready in/.test(out)) resolve();
  });
});

async function rescan() {
  fs.writeFileSync(POKE, "");
  await sleep(400);
  fs.rmSync(POKE, { force: true });
  await sleep(1500);
}

async function lessonRoutes(base) {
  try {
    const html = await (await fetch(base + PROBE, { redirect: "manual" })).text();
    return !/Page introuvable/.test((html.match(/<h1[^>]*>[\s\S]*?<\/h1>/) ?? [""])[0]);
  } catch {
    return null; // serveur indisponible : pas de verdict
  }
}

await ready;
const base = (out.match(/Local:\s+(http:\/\/\S+)/) ?? [, "http://localhost:3000"])[1];
await sleep(3000); // fin du parcours initial et des reconstructions en cours
for (let i = 1; i <= 3; i++) {
  await rescan();
  const ok = await lessonRoutes(base);
  if (ok !== false) {
    console.log(ok ? `✓ Table des routes complète (${PROBE} vérifiée)` : "⚠ Vérification des routes impossible");
    break;
  }
  console.log(`⚠ Leçons absentes de la table des routes (essai ${i}/3), nouvelle reconstruction`);
}
