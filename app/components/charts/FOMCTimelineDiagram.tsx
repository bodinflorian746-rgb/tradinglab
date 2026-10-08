// Macro Avancé 1 — le timing d'un FOMC sur EUR/USD M5 (heure de Paris), comme dans le
// texte : 20h00 décision Fed (impulsion de +100 à +150 pips, souvent un piège), 20h30
// discours de Powell (retournement, le prix plonge, remonte, replonge), 21h00+ la
// direction réelle. Pas d'entrée entre 20h00 et 21h00. Mouvements calculés sur les bougies.
// Bougies : scenarios.ts (« fomc-timeline »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { pips } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

/** Bougies M5 : 0 = 19h45 ; 20h00 = 3 ; 20h30 = 9 ; 21h00 = 15 ; 21h30 = 21 */
export const FOMC_AT = { decision: 3, powell: 9, real: 15, end: 21 };
const PIP = 0.0001;

export function FOMCTimelineDiagram(_props: { locale?: "fr" | "es" | "en" } = {}) {
  const cs = CANDLES["fomc-timeline"];
  const { decision, powell, real, end } = FOMC_AT;
  const top = Math.max(...cs.map((k) => k.h)), bottom = Math.min(...cs.map((k) => k.l));
  // fenêtres horaires : une bande sous les bougies (règle de temps), pas une zone de prix
  const band = { y1: bottom - (top - bottom) * 0.1, y2: bottom - (top - bottom) * 0.05 };
  const impulse = pips(cs[decision].h, cs[decision].o, PIP);
  const drop = pips(cs[powell].o, Math.min(...cs.slice(powell, end + 1).map((k) => k.l)), PIP);
  return (
    <LessonChart
      id="FOMCTimelineDiagram"
      title="Un FOMC en trois phases"
      caption="Tu n'entres pas entre 20h00 et 21h00 : tu attends une clôture M5 ou M15 confirmée après 21h00."
      panels={[{
        key: "m5", title: "EUR/USD M5, de 19h45 à 21h40 (heure de Paris)", decimals: 5, height: 300, candles: cs,
        zones: [
          { key: "chaos", ...band, from: decision, to: real - 1, tone: "bear", kind: "fenetre", label: "20h00-21h00 : zone instable", short: "Zone instable" },
          { key: "reel", ...band, from: real, to: cs.length - 1, tone: "bull", kind: "fenetre", label: "21h00+ : direction réelle", short: "Direction réelle" },
        ],
        markers: [
          { key: "fed", i: decision, price: cs[decision].h, label: "20h00 Décision Fed", short: "20h00 Fed", tone: "entry", side: "above" },
          { key: "powell", i: powell, price: cs[powell].h, label: "20h30 Discours Powell", short: "20h30 Powell", tone: "zone", side: "above" },
          { key: "real", i: real, price: cs[real].c, label: "21h00 : clôture M5 confirmée", short: "21h00 clôture", tone: "bull", side: "below", role: "close" },
        ],
        chips: [
          { label: `20h00 : +${impulse} pips, piège fréquent`, tone: "entry", data: { move: impulse } },
          { label: `20h30 → 21h30 : −${drop} pips`, tone: "bear", data: { move: drop } },
        ],
      }]}
    />
  );
}
