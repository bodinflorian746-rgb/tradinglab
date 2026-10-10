// Rognage mobile des schémas LessonChart (cropStart) : pour chaque schéma tel que les leçons FR
// l'utilisent, en 360 et 390 (cadre de 296 et 326 px), le rognage ne doit rien changer à ce que
// le schéma affirme :
//  - jamais de rognage d'une courbe qui n'est pas un prix (courbe de capital : « measure ») ;
//  - jamais de rognage d'un schéma à plusieurs panneaux (comparaison), panneaux jamais décalés ;
//  - toutes les touches de chaque support / résistance conservées (règle sr-proof) ;
//  - tous les croisements de moyennes conservés ;
//  - tout élément cité (repère, niveau / zone datés, segment, repère RSI) conservé.
// Un panneau non rogné qui reste trop serré (< 3,25 px par bougie estimés) est signalé en
// avertissement, à valider.
// Usage : npx vite-node -c vitest.config.ts scripts/audit-lecons/crop.tsx [--autotest]
import fs from "node:fs";
import path from "node:path";
import * as ReactNS from "react";
import { isValidElement, type ReactElement, type ReactNode } from "react";
import { cropStart, LessonChart, type LCPanel } from "@/app/components/lessons/LessonChart";
import { srTouches } from "./sr-proof.mjs";

// Les composants de schémas sont appelés directement (sans rendu) pour lire les panneaux qu'ils
// passent à LessonChart ; un répartiteur de hooks minimal (état initial, effets ignorés) permet
// d'appeler ceux qui ont un état.
const H = {
  useState: (i: unknown) => [typeof i === "function" ? (i as () => unknown)() : i, () => {}], useMemo: (f: () => unknown) => f(), useCallback: (f: unknown) => f,
  useRef: (v: unknown) => ({ current: v }), useEffect: () => {}, useLayoutEffect: () => {}, useInsertionEffect: () => {}, useId: () => "id",
  useContext: (c: { _currentValue: unknown }) => c._currentValue, useReducer: (_r: unknown, i: unknown, init?: (x: unknown) => unknown) => [init ? init(i) : i, () => {}],
  useSyncExternalStore: (_s: unknown, g: () => unknown) => g(), useTransition: () => [false, (f: () => void) => f()], useDeferredValue: (v: unknown) => v,
  useImperativeHandle: () => {}, useDebugValue: () => {}, use: (x: unknown) => x,
};
(ReactNS as unknown as Record<string, { H: unknown }>).__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE.H = H;

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const FRAMES = { 360: 296, 390: 326 } as const;
const AUTOTEST = process.argv.includes("--autotest");

// ─── Lecture des schémas tels que les leçons FR les utilisent ───
type Chart = { id: string; panels: LCPanel[]; where: string };
async function readCharts(): Promise<{ charts: Chart[]; unread: string[] }> {
  const lessonSrc: string[] = [];
  const walk = (d: string) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (/(_content-fr|page|DebutantLessonView)\.tsx$/.test(e.name)) lessonSrc.push(fs.readFileSync(p, "utf8")); } };
  walk(path.join(ROOT, "app", "[locale]", "(premium)"));
  const usages = (name: string) => {
    const out = new Map<string, Record<string, unknown>>();
    for (const s of lessonSrc) for (const m of s.matchAll(new RegExp(`<${name}(\\s[^>]*?)?/?>`, "g"))) {
      const props: Record<string, unknown> = {};
      for (const a of (m[1] ?? "").matchAll(/(\w+)=(?:"([^"]*)"|\{(-?[\d.]+|true|false|"[^"]*")\})/g)) props[a[1]] = a[2] ?? JSON.parse(a[3]);
      out.set(JSON.stringify(props), props);
    }
    return out.size ? [...out.values()] : [{}];
  };
  const charts: Chart[] = [];
  const unread: string[] = [];
  const seen = new Set<string>();
  const collect = (node: ReactNode, where: string, depth = 0): void => {
    if (depth > 8 || node == null || typeof node !== "object") return;
    if (Array.isArray(node)) { node.forEach((n) => collect(n, where, depth)); return; }
    if (!isValidElement(node)) return;
    const el = node as ReactElement<Record<string, unknown>>;
    if (el.type === LessonChart) {
      const c = { id: String(el.props.id), panels: el.props.panels as LCPanel[], where };
      const k = `${c.id}:${JSON.stringify(c.panels).length}`;
      if (!seen.has(k)) { seen.add(k); charts.push(c); }
      return;
    }
    if (typeof el.type === "function") {
      try { collect((el.type as (p: unknown) => ReactNode)(el.props), where, depth + 1); } catch (e) { unread.push(`${where} > ${(el.type as { name?: string }).name} : ${(e as Error).message.slice(0, 80)}`); }
    }
    collect(el.props.children as ReactNode, where, depth + 1);
  };
  const dir = path.join(ROOT, "app", "components", "charts");
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".tsx"))) {
      if (!fs.readFileSync(path.join(dir, f), "utf8").includes("components/lessons/LessonChart\"")) continue;
      const mod = await import(path.join(dir, f).split(path.sep).join("/"));
      for (const [key, fn] of Object.entries(mod)) {
        const name = key === "default" && typeof fn === "function" ? fn.name : key;
        if (typeof fn !== "function" || !/^[A-Z]/.test(name)) continue;
        for (const props of usages(name)) {
          const where = `${name}${Object.keys(props).length ? " " + JSON.stringify(props) : ""}`;
          try { collect((fn as (p: unknown) => ReactNode)(props), where); } catch (e) { unread.push(`${where} : ${(e as Error).message.slice(0, 80)}`); }
        }
      }
  }
  return { charts, unread };
}

// ─── Contrôles d'un rognage (s bougies retirées par panneau) ───
const candlesOf = (p: LCPanel) => p.candles ?? (p.line ?? []).map((v) => ({ o: v, h: v, l: v, c: v }));
const isSR = (o: { role?: string; label?: string }) => /^(support|resistance)$/.test(o.role ?? "") || /\b(support|r[ée]sistance)/i.test(o.label ?? "");
const crossings = (p: LCPanel, from: number) => {
  const ser = p.series ?? [], out: string[] = [];
  for (let a = 0; a < ser.length; a++) for (let b = a + 1; b < ser.length; b++) {
    const A = ser[a].values, B = ser[b].values;
    for (let i = Math.max(1, from + 1); i < A.length; i++) {
      const v = [A[i], B[i], A[i - 1], B[i - 1]];
      if (v.every((x) => x !== null && x !== undefined) && Math.sign(A[i]! - B[i]!) !== Math.sign(A[i - 1]! - B[i - 1]!)) out.push(`${ser[a].key}×${ser[b].key}@${i}`);
    }
  }
  return out;
};
function checkCrop(c: Chart, s: number[]): string[] {
  const errs: string[] = [];
  const cropped = s.some((x) => x > 0);
  if (!cropped) return errs;
  if (c.panels.length > 1) {
    errs.push(`${c.id} : schéma de comparaison rogné (${c.panels.length} panneaux)`);
    if (new Set(s).size > 1) errs.push(`${c.id} : panneaux décalés (${s.join(" / ")} bougies retirées)`);
  }
  c.panels.forEach((p, k) => {
    const sk = s[k];
    if (!sk) return;
    const n = candlesOf(p).length;
    if (p.measure) errs.push(`${c.id} / ${p.key} : courbe de capital rognée (${sk} points retirés, elle ne part plus de son départ)`);
    const cs = candlesOf(p);
    for (const o of [...(p.levels ?? []).filter(isSR).map((l) => ({ what: l.label ?? l.key, lo: l.price, hi: l.price, to: l.to })), ...(p.zones ?? []).filter(isSR).map((z) => ({ what: z.label ?? z.key, lo: Math.min(z.y1, z.y2), hi: Math.max(z.y1, z.y2), to: z.to }))]) {
      const full = srTouches(cs, o.lo, o.hi, 0, o.to ?? n - 1), after = srTouches(cs.slice(sk), o.lo, o.hi, 0, (o.to ?? n - 1) - sk);
      if (after.touches !== full.touches || after.retest !== full.retest) errs.push(`${c.id} / ${p.key} : touche de « ${o.what} » retirée (${full.touches} → ${after.touches})`);
    }
    const lost = crossings(p, 0).filter((x) => +x.split("@")[1] <= sk);
    if (lost.length) errs.push(`${c.id} / ${p.key} : croisement de moyennes retiré (${lost.join(", ")})`);
    const cited = [
      ...(p.markers ?? []).map((m) => [`repère « ${m.label} »`, m.i] as const),
      ...(p.levels ?? []).filter((l) => l.from !== undefined).map((l) => [`niveau « ${l.label ?? l.key} »`, l.from!] as const),
      ...(p.zones ?? []).filter((z) => z.from !== undefined).map((z) => [`zone « ${z.label ?? z.key} »`, z.from!] as const),
      ...(p.segments ?? []).map((g) => [`segment « ${g.label ?? g.key} »`, Math.min(g.i1, g.i2)] as const),
      ...(p.rsi?.marks ?? []).map((m) => [`repère RSI « ${m.label} »`, m.i] as const),
    ];
    for (const [what, i] of cited) if (i < sk) errs.push(`${c.id} / ${p.key} : élément cité retiré, ${what} (bougie ${i})`);
  });
  return errs;
}

// Défauts injectés : chacun doit être détecté par checkCrop
const MUTATIONS: { name: string; expect: RegExp; make: (charts: Chart[]) => [Chart, number[]] | null }[] = [
  { name: "courbe de capital rognée", expect: /courbe de capital rognée/, make: (cs) => { const c = cs.find((x) => x.panels.length === 1 && x.panels[0].measure); return c ? [c, [10]] : null; } },
  { name: "schéma de comparaison rogné", expect: /schéma de comparaison rogné/, make: (cs) => { const c = cs.find((x) => x.panels.length > 1 && x.panels.every((p) => p.candles)); return c ? [c, c.panels.map(() => 5)] : null; } },
  { name: "panneaux décalés", expect: /panneaux décalés/, make: (cs) => { const c = cs.find((x) => x.panels.length > 1 && x.panels.every((p) => p.candles)); return c ? [c, c.panels.map((_, k) => (k ? 5 : 0))] : null; } },
  { name: "touche de support retirée", expect: /touche de .* retirée/, make: (cs) => {
    for (const c of cs) { if (c.panels.length !== 1) continue; const p = c.panels[0]; const o = (p.levels ?? []).find(isSR); if (!o || !p.candles) continue; const n = p.candles.length; if (srTouches(p.candles, o.price, o.price, 0, o.to ?? n - 1).touches < 1) continue; return [c, [n - 2]]; }
    return null; } },
  { name: "croisement de moyennes retiré", expect: /croisement de moyennes retiré/, make: (cs) => {
    for (const c of cs) for (const p of c.panels) { const x = crossings(p, 0); if (x.length) return [{ ...c, panels: [p] }, [+x[0].split("@")[1]]]; }
    return null; } },
  { name: "élément cité retiré", expect: /élément cité retiré/, make: (cs) => { const c = cs.find((x) => x.panels.length === 1 && (x.panels[0].markers ?? []).length && !x.panels[0].measure); return c ? [c, [Math.max(...c.panels[0].markers!.map((m) => m.i)) + 1]] : null; } },
];

const { charts, unread } = await readCharts();
let errors = 0, warnings = 0;
const out: string[] = [];
if (AUTOTEST) {
  for (const m of MUTATIONS) {
    const inj = m.make(charts);
    const hit = inj ? checkCrop(inj[0], inj[1]).find((e) => m.expect.test(e)) : undefined;
    out.push(`${hit ? "détecté" : "MANQUÉ "}  ${m.name}${hit ? ` (${hit})` : inj ? "" : " : aucun schéma pour l'injecter"}`);
    if (!hit) errors++;
  }
} else {
  for (const c of charts) for (const [vw, W] of Object.entries(FRAMES)) {
    const res = c.panels.map((p) => cropStart(p, W, c.panels.length === 1));
    for (const e of checkCrop(c, res.map((r) => r.s))) { errors++; out.push(`  ERREUR [${vw} px] ${e}`); }
    c.panels.forEach((p, k) => {
      const r = res[k];
      if (!r.noCrop) return;
      const n = candlesOf(p).length, slot = (W * 0.96 - 110) / n;
      if (slot < 3.25 && p.candles) { warnings++; out.push(`  AVERTISSEMENT [${vw} px] ${c.id} / ${p.key} : ${n} bougies, ≈ ${slot.toFixed(1)} px par bougie, non rogné (${r.noCrop}) : à valider`); }
    });
    res.forEach((r, k) => { if (r.s) out.push(`  rogné [${vw} px] ${c.id} / ${c.panels[k].key} : ${r.s} bougies sur ${candlesOf(c.panels[k]).length}`); });
  }
  out.unshift(`${charts.length} schémas LessonChart lus${unread.length ? `, ${unread.length} non lus` : ""}`);
  for (const u of unread) { errors++; out.push(`  ERREUR schéma non lu : ${u}`); }
}
console.log(out.join("\n"));
console.log(`RESULTAT erreurs=${errors} avertissements=${warnings}`);
process.exit(errors ? 1 : 0);
