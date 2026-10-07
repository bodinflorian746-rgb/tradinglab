// Macro Débutant 1 — lire un calendrier économique : une journée type (heure de Paris)
// avec l'impact des événements (1 à 3 étoiles, comme dans le texte), puis la réaction
// d'EUR/USD au CPI de 14h30 (M1, mouvement calculé sur les bougies).
// Bougies : scenarios.ts (« cpi-reaction »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { Matrix } from "@/app/components/lessons/LessonSchema";
import { pips } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const DAY = [
  { h: "08h00", cur: "EUR", ev: "PIB allemand", stars: 2 },
  { h: "10h00", cur: "EUR", ev: "Discours de Christine Lagarde", stars: 3 },
  { h: "14h30", cur: "USD", ev: "CPI (inflation US)", stars: 3 },
  { h: "16h00", cur: "USD", ev: "Confiance des consommateurs", stars: 2 },
  { h: "19h00", cur: "USD", ev: "Discours d'un membre de la Fed", stars: 1 },
];
const TONE = { 1: "bull", 2: "zone", 3: "bear" } as const;

export const MacroCalendarDiagram = (_props: { locale?: "fr" | "es" | "en" } = {}) => {
  const cs = CANDLES["cpi-reaction"];
  const rel = 6;
  const move = pips(cs[rel].c, cs[rel].o, 0.0001);
  return (
    <LessonChart
      id="MacroCalendarDiagram"
      title="Le calendrier du jour, puis la réaction au CPI"
      panels={[{
        key: "m1", title: "EUR/USD M1 autour de 14h30", decimals: 5, height: 220, candles: cs,
        markers: [{ key: "cpi", i: rel, price: cs[rel].h, label: "CPI 14h30", tone: "bear", side: "above" }],
        chips: [{ label: `EUR/USD −${move} pips en une minute`, tone: "bear", data: { move } }],
      }]}
    >
      <div style={{ marginTop: 16 }}>
        <Matrix
          head={["Devise", "Événement", "Impact"]}
          rows={DAY.map((d) => ({ label: d.h, cells: [{ text: d.cur }, { text: d.ev }, { text: "★".repeat(d.stars), tone: TONE[d.stars as 1 | 2 | 3] }] }))}
        />
      </div>
    </LessonChart>
  );
};
