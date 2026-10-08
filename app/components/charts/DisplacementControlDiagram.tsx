// ICT 4 bloc 2 — le displacement montre qui prend le contrôle (XAU/USD M15), exemple du
// texte : 3 heures d'équilibre autour de 4 650 $ (bougies plates), à 14h UTC une bougie
// sweep le sommet jusqu'à 4 668 $, puis 5 bougies baissières à grands corps ramènent le prix
// à 4 608 $ (corps de 8 à 10 $ qui ne rétrécissent pas, sans mèche haute). Range, sweep et
// displacement vérifiés par l'audit (rôles).
// Bougies : scenarios.ts (« disp-control-xau »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { usd } from "@/app/components/lessons/trade";
import CANDLES from "@/lib/lessons/generated/candles.json";

const CALM = 12; // 12 bougies M15 = 3 heures

export function DisplacementControlDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["disp-control-xau"];
  const calm = cs.slice(0, CALM);
  const lo = Math.min(...calm.map((k) => k.l)), hi = Math.max(...calm.map((k) => k.h));
  const sweep = CALM;
  const low = Math.min(...cs.slice(sweep + 1).map((k) => k.l));
  const n = cs.length - sweep - 1;
  return (
    <LessonChart
      id="DisplacementControlDiagram"
      title="L'équilibre rompt : les vendeurs prennent le contrôle"
      caption="Le biais des heures suivantes est défini : on ne cherche plus de longs jusqu'à preuve du contraire."
      panels={[{
        key: "m15", title: "XAU/USD M15", decimals: 0, height: 290, candles: cs,
        zones: [{ key: "eq", y1: lo, y2: hi, from: 0, to: CALM - 1, label: `Équilibre 3 h (${usd(lo)}-${usd(hi)})`, short: "Équilibre 3 h", tone: "neutral" }],
        markers: [
          { key: "sweep", i: sweep, price: cs[sweep].h, label: `14h UTC : sweep ${usd(cs[sweep].h)}`, short: `Sweep ${usd(cs[sweep].h)}`, tone: "zone", side: "above", role: "sweep", ref: hi, dir: "bear" },
          { key: "disp", i: cs.length - 1, price: low, label: `Displacement : ${n} bougies → ${usd(low)}`, short: `${n} bougies → ${usd(low)}`, tone: "bear", side: "below", role: "displacement", span: [sweep + 1, cs.length - 1] },
        ],
      }]}
    />
  );
}
