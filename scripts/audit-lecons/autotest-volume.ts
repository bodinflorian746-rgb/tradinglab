// Autotest des contrôles de données des leçons de volumes (data-volume.ts) et de la stratégie
// Volume Profile + VWAP (data-strat-volume.ts) : chaque défaut est injecté
// dans une copie des bougies et doit produire au moins une erreur. Lancé par run.mjs.
import CANDLES from "@/lib/lessons/generated/candles.json";
import type { VCandle } from "@/lib/lessons/volume";
import { checkVolumeLessons } from "./data-volume";
import { checkStratVolume } from "./data-strat-volume";

type Data = Record<string, VCandle[]>;
type Cb = (ok: boolean, what: string) => void;
const checkAll = (cb: Cb, d: Data) => { checkVolumeLessons(cb, d); checkStratVolume(cb, d); };
const base = CANDLES as unknown as Data;
const copy = (): Data => JSON.parse(JSON.stringify(base));

const DEFECTS: Record<string, (d: Data) => void> = {
  "volume du range déplacé vers le haut (POC, Value Area)": (d) => { for (const k of d["vp-range"]) if (k.c > 1.0855) k.v *= 4; },
  "volume ajouté dans la LVN": (d) => { d["vp-range"].forEach((k) => { if (k.h > 1.087 && k.l < 1.0885) k.v *= 5; }); },
  "POC de la consolidation EUR/USD décalé": (d) => { d["vpt-h1"].slice(21, 28).forEach((k) => { k.o += 0.0006; k.h += 0.0006; k.l += 0.0006; k.c += 0.0006; }); },
  "HVN NASDAQ effacée": (d) => { d["vp-lvn"].slice(0, 8).forEach((k) => { k.v = 300; }); },
  "VWAP NASDAQ loin du support": (d) => { d["vwap-nas"].slice(0, 6).forEach((k) => { k.v *= 6; }); },
  "VWAP or loin de 3 900": (d) => { d["vwap-xau"].slice(10, 16).forEach((k) => { k.v *= 6; }); },
  "VWAP ancré jamais touché": (d) => { d["avwap-xau"][19].l = 3929; },
  "pas de divergence CVD": (d) => { d["of-absorption"][12].d = 3000; },
  "clôture hors Value Area trop tôt": (d) => { d["va-rejet"][39].c = 1.0868; },
  "stop au-dessus du creux technique": (d) => { d["vpt-m15"][5].l = 1.0834; },
  "stratégie : volume du profil déplacé (POC, Value Area)": (d) => { d["vsv-h1"].slice(28, 36).forEach((k) => { k.v *= 4; }); },
  "stratégie : volume ajouté dans la LVN": (d) => { d["vsv-h1"][48].v *= 6; },
  "stratégie : VWAP de séance loin de 1.0862": (d) => { d["vsv-m15"].slice(6, 12).forEach((k) => { k.v *= 5; }); },
  "stratégie : creux d'invalidation cassé avant la confirmation": (d) => { d["vsv-m15"][21].l = 1.0844; },
  "stratégie : pas de divergence CVD": (d) => { d["vsv-fut"][9].d = -900; },
  "stratégie : or, concentration de volume déplacée": (d) => { d["vsv-xau"].slice(12, 14).forEach((k) => { k.v *= 5; }); },
  "stratégie : issue B qui touche le stop": (d) => { d["vsv-m15-b"][34].l = 1.0841; },
};

let missed = 0;
for (const [name, inject] of Object.entries(DEFECTS)) {
  const d = copy();
  inject(d);
  const errs: string[] = [];
  checkAll((ok, what) => { if (!ok) errs.push(what); }, d);
  console.log(`${errs.length ? "détecté    " : "NON DÉTECTÉ"} ${name}${errs.length ? ` (${errs[0].slice(0, 90)})` : ""}`);
  if (!errs.length) missed++;
}
// sans défaut : aucune erreur
const clean: string[] = [];
checkAll((ok, what) => { if (!ok) clean.push(what); }, copy());
if (clean.length) { missed++; console.log(`ERREUR données saines signalées : ${clean[0]}`); }
console.log(`RESULTAT erreurs=${missed} avertissements=0`);
