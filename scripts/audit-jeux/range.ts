// Bornes de range (« Haut du range », « Bas du range ») : un vrai range, comme un trader le trace.
// Avant les deux dernières bougies (déclencheuses : cassure, sweep), aucune clôture au-delà de la
// borne (au plus RANGE_TOL × MR) ; la borne est touchée au moins 2 fois (pointe de mèche à moins de
// TOUCH × MR de la bande) ; haut du range au-dessus du bas.
// Usage : npx vite-node scripts/audit-jeux/range.ts [--autotest] [--detail] (lancé par run.mjs)
import type { Candle, ChartZone } from "../../lib/games/shared";
// trace.ts fournit les graphiques des jeux ; sa propre règle ne doit pas se lancer ici
process.env.TRACE_NO_MAIN = "1";
const { charts, medRange } = await import("./trace");

export const RANGE_TOL = 0.1, TOUCH = 0.3;
const DETAIL = process.argv.includes("--detail");
const ROUNDS = +(process.argv.find((a) => a.startsWith("--rounds="))?.split("=")[1] ?? 200);

export function rangeError(past: Candle[], z: ChartZone): string | null {
  const top = /^haut du range/i.test(z.label), bot = /^bas du range/i.test(z.label);
  if (!top && !bot) return null;
  const MR = medRange(past), lo = Math.min(z.y1, z.y2), hi = Math.max(z.y1, z.y2);
  // (borne cassée puis retestée, zone `until` : la cassure et le retest viennent après le range)
  const body = past.slice(0, -Math.max(2, z.until ?? 0));
  const out = body.filter((k) => (top ? k.c > hi + RANGE_TOL * MR : k.c < lo - RANGE_TOL * MR));
  if (out.length) return `« ${z.label} » franchi par ${out.length} clôture(s) avant la bougie déclencheuse`;
  // touche : la pointe de mèche atteint la bande (à TOUCH × MR près) depuis l'intérieur du range
  const touches = past.filter((k) => (top ? k.h >= lo - TOUCH * MR && k.h <= hi + TOUCH * MR : k.l <= hi + TOUCH * MR && k.l >= lo - TOUCH * MR));
  if (touches.length < 2) return `« ${z.label} » touché ${touches.length} fois (au moins 2)`;
  return null;
}

if (!process.env.RANGE_NO_MAIN) {
  let errors = 0;
  const lines: string[] = [];
  if (process.argv.includes("--autotest")) {
    const all = [...charts(3)];
    const base = all.find((c) => c.zones.some((z) => /^Haut du range/.test(z.label) && !rangeError(c.past, z)))!;
    const z = base.zones.find((x) => /^Haut du range/.test(x.label))!, MR = medRange(base.past);
    const cases: [string, RegExp, Candle[], ChartZone][] = [
      ["haut du range sous les clôtures", /franchi/, base.past, { ...z, y1: z.y1 - 3 * MR, y2: z.y2 - 3 * MR }],
      ["haut du range jamais touché", /touché/, base.past, { ...z, y1: z.y1 + 4 * MR, y2: z.y2 + 4 * MR }],
    ];
    for (const [name, re, p, zz] of cases) { const e = rangeError(p, zz); const ok = !!e && re.test(e); lines.push(`${ok ? "détecté" : "MANQUÉ "}  ${name}${e ? ` (${e})` : ""}`); if (!ok) errors++; }
  } else {
    const counts = new Map<string, { n: number; bad: number; first?: string }>();
    for (const c of charts(ROUNDS)) for (const z of c.zones) {
      if (!/^(haut|bas) du range/i.test(z.label)) continue;
      const k = `${c.key}|${z.label}`, s = counts.get(k) ?? { n: 0, bad: 0 };
      s.n++; const e = rangeError(c.past, z); if (e) { s.bad++; errors++; s.first ??= e; }
      counts.set(k, s);
    }
    for (const [k, s] of [...counts].filter(([, s]) => s.bad).sort((a, b) => b[1].bad - a[1].bad).slice(0, DETAIL ? 200 : 40)) lines.push(`  ERREUR ${k.replace(/\|/g, " · ")} : ${s.bad}/${s.n} (${s.first})`);
    lines.push(`${counts.size} bornes de range (scénario × niveau) contrôlées`);
  }
  console.log(lines.join("\n"));
  console.log(`RESULTAT erreurs=${errors} avertissements=0`);
}
