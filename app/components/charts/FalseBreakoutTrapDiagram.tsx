// ICT 1 — un breakout non tenu (XAU/USD M15) : résistance 4 680 $ testée plusieurs fois,
// bougie de breakout jusqu'à 4 695 $ (les acheteurs entrent, SL sous 4 680), réintégration
// sous 4 680 quelques bougies plus tard, chute vers 4 650 $. Tests, breakout et
// réintégration lus sur les bougies. Bougies : scenarios.ts (« false-breakout-xau »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { usd } from "@/app/components/lessons/trade";
import CANDLES from "@/lib/lessons/generated/candles.json";

const RES = 4680;

export function FalseBreakoutTrapDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["false-breakout-xau"];
  const brk = cs.findIndex((k) => k.c > RES);
  const tests = cs.map((k, i) => (i < brk && k.h === RES ? i : -1)).filter((i) => i >= 0);
  const mid = tests[Math.floor(tests.length / 2)];
  const back = cs.findIndex((k, i) => i > brk && k.c < RES);
  const low = Math.min(...cs.slice(back).map((k) => k.l));
  const lowAt = cs.findIndex((k, i) => i >= back && k.l === low);
  return (
    <LessonChart
      id="FalseBreakoutTrapDiagram"
      title="Un breakout non tenu est un piège"
      caption={`Les SL des acheteurs du breakout, sous ${usd(RES)}, sont déclenchés : réintégration sous le niveau cassé = piège. L'ICT trade ce qui se passe après.`}
      panels={[{
        key: "m15", title: "XAU/USD M15", decimals: 0, height: 280, candles: cs,
        levels: [{ key: "res", price: RES, label: `Résistance ${usd(RES)}`, short: "Résistance", tone: "zone", role: "resistance" }],
        markers: [
          { key: "tests", i: mid, price: RES, label: `${tests.length} tests`, tone: "zone", side: "above", dot: true },
          { key: "brk", i: brk, price: cs[brk].h, label: `Breakout ${usd(cs[brk].h)}`, short: `Breakout`, tone: "entry", side: "above", role: "high" },
          { key: "back", i: back, price: cs[back].c, label: `Clôture sous ${usd(RES)} : réintégration`, short: "Réintégration", tone: "bear", side: "below", role: "close" },
          { key: "low", i: lowAt, price: low, label: `Chute jusqu'à ${usd(low)}`, short: "Chute", tone: "bear", side: "below", role: "low" },
        ],
      }]}
    />
  );
}
