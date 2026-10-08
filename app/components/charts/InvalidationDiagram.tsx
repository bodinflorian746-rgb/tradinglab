// Reversal 4 blocs 3-4 — reconnaître une invalidation, cas 1 du texte (EUR/USD H1) : short 1.1795
// après le double top, SL 1.1835 ; le prix descend à 1.1780, puis une bougie large englobe les 2
// bougies baissières et re-clôture à 1.1810, au-dessus de la ligne de cou 1.1800 (critères 1 et 2) :
// coupe à 1.1810, perte 15 pips au lieu de 40. Calculs sur les bougies.
// Bougies : scenarios.ts (« inv-eur »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { fmtPrice, pips } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);
const NECK = 1.18, ENTRY = 1.1795, SL = 1.1835;

export default function InvalidationDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["inv-eur"];
  const entryAt = cs.findIndex((k) => k.c === ENTRY);
  const last = cs.length - 1, cut = cs[last].c;
  const low = Math.min(...cs.slice(entryAt).map((k) => k.l));
  return (
    <LessonChart
      id="InvalidationDiagram"
      title="Le pattern foire : on coupe"
      caption="Un seul critère allumé suffit : sortie à la clôture de la bougie, sans attendre le SL."
      panels={[{
        key: "h1", title: "EUR/USD H1, short sur double top", decimals: 5, height: 280, candles: cs,
        levels: [
          { key: "neck", price: NECK, label: `Ligne de cou ${p(NECK)}`, short: "Ligne de cou", tone: "zone" },
          { key: "entry", price: ENTRY, from: entryAt, label: `Entrée short ${p(ENTRY)}`, short: "Entrée", tone: "entry" },
          { key: "sl", price: SL, from: entryAt, label: `SL ${p(SL)}`, short: "SL", tone: "bear", dashed: true },
        ],
        markers: [
          { key: "low", i: cs.findIndex((k, i) => i >= entryAt && k.l === low), price: low, label: `Plus bas ${p(low)}`, short: "Plus bas", tone: "neutral", side: "below", role: "low" },
          { key: "cut", i: last, price: cut, label: `Re-clôture ${p(cut)} : coupe`, short: "Coupe", tone: "bear", side: "above", role: "close" },
        ],
        chips: [
          { label: "Critères 1 et 2 allumés", tone: "bear" },
          { label: `Perte ${pips(cut, ENTRY, 0.0001)} pips au lieu de ${pips(SL, ENTRY, 0.0001)}`, tone: "zone" },
        ],
      }]}
    />
  );
}
