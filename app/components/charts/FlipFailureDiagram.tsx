// Support / résistance 3 bloc 4 — quand le flip échoue (EUR/USD H4) : breakout de 1.1850
// clôturé à 1.1872, retest acheté à 1.1858, puis retour sous 1.1850 en moins de 3 bougies : flip
// invalidé ; le SL 1.1830, placé de l'autre côté de la zone, borne la perte. Calculs sur les
// bougies. Bougies : scenarios.ts (« flip-fail »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { fmtPrice, pips } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);
const LEVEL = 1.185, ENTRY = 1.1858, SL = 1.183;

export default function FlipFailureDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["flip-fail"];
  const brk = cs.findIndex((k) => k.c > LEVEL + 0.0015);
  const entryAt = cs.findIndex((k, i) => i > brk && k.c === ENTRY);
  const back = cs.findIndex((k, i) => i > entryAt && k.c < LEVEL);
  const stop = cs.findIndex((k, i) => i > entryAt && k.l <= SL);
  return (
    <LessonChart
      id="FlipFailureDiagram"
      title="Retour sous le niveau : le flip est invalidé"
      caption="Retour rapide sous le niveau cassé dans les 3 à 5 bougies = flip invalidé. On ne déplace jamais le SL contre soi."
      panels={[{
        key: "h4", title: "EUR/USD H4", decimals: 5, height: 280, candles: cs,
        levels: [
          { key: "lvl", price: LEVEL, label: `Niveau cassé ${p(LEVEL)}`, short: "Niveau", tone: "zone" },
          { key: "entry", price: ENTRY, from: entryAt, label: `Entrée long ${p(ENTRY)}`, short: "Entrée", tone: "entry" },
          { key: "sl", price: SL, from: entryAt, label: `SL ${p(SL)}`, short: "SL", tone: "bear", dashed: true },
        ],
        markers: [
          { key: "brk", i: brk, price: cs[brk].c, label: `Breakout : clôture ${p(cs[brk].c)}`, short: "Breakout", tone: "bull", side: "above", role: "close" },
          { key: "back", i: back, price: cs[back].c, label: `Clôture sous ${p(LEVEL)} en ${back - brk} bougies`, short: "Retour", tone: "bear", side: "above", role: "close" },
          { key: "stop", i: stop, price: cs[stop].l, label: "SL touché", tone: "bear", side: "below" },
        ],
        chips: [{ label: `Perte bornée : ${pips(ENTRY, SL, 0.0001)} pips`, tone: "bear" }],
      }]}
    />
  );
}
