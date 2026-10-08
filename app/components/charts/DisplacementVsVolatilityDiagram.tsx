// ICT 4 bloc 4 — tous les mouvements rapides ne sont pas des displacements (EUR/USD M15),
// les deux cas du texte : une bougie isolée de +18 pips sur une news mineure, refermée
// entièrement par la suivante (volatilité) ; 4 bougies baissières de 10 à 12 pips qui
// cassent le creux local et enchaînent (displacement). Corps et creux calculés.
// Bougies : scenarios.ts (« vol-spike », « disp-seq »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { fmtPrice, pips, pivots, type Candle } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);

export function DisplacementVsVolatilityDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const vol = CANDLES["vol-spike"] as Candle[], seq = CANDLES["disp-seq"] as Candle[];
  const spike = vol.reduce((b, k, i) => (k.c - k.o > vol[b].c - vol[b].o ? i : b), 0);
  const spikePips = pips(vol[spike].c, vol[spike].o, 0.0001);
  const local = pivots(seq, 2).filter((q) => q.side === "l").at(-1)!;
  const first = seq.findIndex((k, i) => i > local.index && k.c < local.price);
  const bodies = seq.slice(first).map((k) => pips(k.o, k.c, 0.0001));
  return (
    <LessonChart
      id="DisplacementVsVolatilityDiagram"
      title="Volatilité ou displacement ?"
      caption="La taille d'une seule bougie n'est jamais un critère : c'est la cassure de structure et la continuation qui comptent."
      panels={[
        {
          key: "vol", title: "Volatilité : bougie isolée, refermée", decimals: 5, height: 220, candles: vol,
          markers: [
            { key: "spike", i: spike, price: vol[spike].h, label: `Bougie isolée +${spikePips} pips (news mineure)`, short: `Bougie +${spikePips} pips`, tone: "bull", side: "above" },
            { key: "back", i: spike + 1, price: vol[spike + 1].l, label: "Tout est refermé", short: "Refermé", tone: "bear", side: "below" },
          ],
          chips: [{ label: "Pas de breakout, pas de suite", tone: "neutral" }],
        },
        {
          key: "disp", title: "Displacement : séquence qui casse le creux", decimals: 5, height: 220, candles: seq,
          levels: [{ key: "low", price: local.price, from: local.index, label: `Creux local ${p(local.price)}`, short: "Creux local", tone: "neutral", dashed: true }],
          markers: [
            { key: "brk", i: first, price: seq[first].c, label: "Clôture sous le creux local", short: "Cassure du creux", tone: "bear", side: "above", role: "bos", ref: local.index, dir: "bear" },
            { key: "disp", i: seq.length - 1, price: seq[seq.length - 1].l, label: `${bodies.length} bougies de ${Math.min(...bodies)} à ${Math.max(...bodies)} pips`, short: `${bodies.length} bougies`, tone: "bear", side: "below", role: "displacement", span: [first, seq.length - 1] },
          ],
        },
      ]}
      rows={[1, 1]}
    />
  );
}
