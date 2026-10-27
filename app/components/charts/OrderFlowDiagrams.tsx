// Trading Avancé 12 — Order Flow, Footprint, Delta et CVD (contrat future NASDAQ ; niveaux du texte
// décalés de +7 000 points). Delta = volume à l'Ask − volume au Bid ; CVD = somme des deltas
// (lib/lessons/volume.ts), calculés ici sur les données, jamais écrits à la main.
//  - OrderBookDiagram : meilleur Bid, meilleur Ask, spread, ordres passifs et agressifs ;
//  - FootprintDiagram : la bougie de l'exemple, volumes au Bid et à l'Ask par niveau de prix (fixe) ;
//  - DeltaCVDDiagram : les quatre bougies de l'exemple, delta et CVD (fixe) ;
//  - AbsorptionDivergenceDiagram : sommet sur la résistance 27 100, delta fortement positif sans
//    progression (absorption possible), CVD sous son sommet précédent (divergence) (animé).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { Cards, LessonSchema, Matrix } from "@/app/components/lessons/LessonSchema";
import { fmtPrice } from "@/lib/lessons/chart-analysis";
import { cvd, deltaOf, type VCandle } from "@/lib/lessons/volume";
import CANDLES from "@/lib/lessons/generated/candles.json";

const C = CANDLES as unknown as Record<string, VCandle[]>;
const n = (x: number) => fmtPrice(x, 0, "$").replace("$", "");
const signed = (x: number) => `${x > 0 ? "+" : x < 0 ? "−" : ""}${n(Math.abs(x))}`;

export const BOOK = { bid: 27000, ask: 27001, passiveBuy: 26995 };

export function OrderBookDiagram() {
  return (
    <LessonSchema
      id="OrderBookDiagram"
      title="Le carnet d'ordres : Bid, Ask et spread"
      caption="Un ordre passif attend dans le carnet et fournit de la liquidité ; un ordre agressif s'exécute tout de suite et la consomme."
    >
      <Cards
        cols={3}
        items={[
          { title: "Meilleur Ask", value: n(BOOK.ask), text: "Meilleur prix de vente proposé. Un achat agressif s'exécute ici.", tone: "bull" },
          { title: "Meilleur Bid", value: n(BOOK.bid), text: "Meilleur prix d'achat proposé. Une vente agressive s'exécute ici.", tone: "bear" },
          { title: "Spread", value: `${n(BOOK.ask - BOOK.bid)} point`, text: "Écart entre le meilleur Ask et le meilleur Bid.", tone: "neutral" },
        ]}
      />
      <Cards
        cols={2}
        items={[
          { title: "Ordre passif (limite)", text: `Achat limite à ${n(BOOK.passiveBuy)} : il attend qu'un vendeur accepte ce prix.`, tone: "sky" },
          { title: "Ordre agressif (au marché)", text: `Achat au marché : il prend tout de suite les offres disponibles, à ${n(BOOK.ask)}.`, tone: "zone" },
        ]}
      />
    </LessonSchema>
  );
}

/** Bougie de l'exemple (contrat future NASDAQ) : volumes au Bid et à l'Ask par niveau */
export const FOOTPRINT = [
  { price: 27030, bid: 40, ask: 180 },
  { price: 27025, bid: 70, ask: 150 },
  { price: 27020, bid: 120, ask: 110 },
  { price: 27015, bid: 160, ask: 60 },
];

export function FootprintDiagram() {
  const tot = { bid: FOOTPRINT.reduce((s, r) => s + r.bid, 0), ask: FOOTPRINT.reduce((s, r) => s + r.ask, 0) };
  return (
    <LessonSchema
      id="FootprintDiagram"
      title="Le footprint d'une bougie"
      caption="Bid : volume des ventes agressives ; Ask : volume des achats agressifs. En haut de la bougie, les achats agressifs dominent ; en bas, les ventes agressives."
    >
      <Matrix
        head={["Bid × Ask", "Delta"]}
        rows={[
          ...FOOTPRINT.map((r) => ({
            label: n(r.price),
            cells: [
              { text: `${r.bid} × ${r.ask}`, tone: r.ask > r.bid ? ("bull" as const) : ("bear" as const) },
              { text: signed(r.ask - r.bid), tone: r.ask > r.bid ? ("bull" as const) : ("bear" as const) },
            ],
          })),
          { label: "Bougie", cells: [{ text: `${tot.bid} × ${tot.ask}` }, { text: signed(deltaOf(FOOTPRINT)), tone: "bull" as const }] },
        ]}
      />
    </LessonSchema>
  );
}

/** Quatre bougies de l'exemple : delta de chacune */
export const DELTA_EXAMPLE = [300, 200, -150, 400];

export function DeltaCVDDiagram() {
  const cs = DELTA_EXAMPLE.map((d) => ({ o: 0, h: 0, l: 0, c: 0, v: 0, d }));
  const cum = cvd(cs);
  return (
    <LessonSchema
      id="DeltaCVDDiagram"
      title="Du delta au CVD"
      caption="Le CVD additionne les deltas successifs, en partant de zéro."
    >
      <Matrix
        head={["Delta", "CVD"]}
        rows={DELTA_EXAMPLE.map((d, i) => ({
          label: `Bougie ${i + 1}`,
          cells: [{ text: signed(d), tone: d >= 0 ? ("bull" as const) : ("bear" as const) }, { text: signed(cum[i]), tone: "sky" as const }],
        }))}
      />
    </LessonSchema>
  );
}

export function AbsorptionDivergenceDiagram() {
  const cs = C["of-absorption"];
  const cum = cvd(cs);
  const peaks = cs.map((_, i) => i).filter((i) => i >= 2 && i <= cs.length - 3 && [i - 2, i - 1, i + 1, i + 2].every((j) => cs[j].h < cs[i].h));
  const [s1, s2] = peaks.slice(-2);
  return (
    <LessonChart
      id="AbsorptionDivergenceDiagram"
      title="Résistance 27 100 : absorption possible et divergence CVD"
      caption={`Nouveau sommet à 27 104 avec un delta de ${signed(cs[s2].d ?? 0)} contrats, mais une clôture sous 27 100 : les achats agressifs ne font presque plus avancer le prix. Le CVD, lui, reste sous son sommet précédent. Ces signes demandent encore une structure baissière avant de conclure.`}
      panels={[{
        key: "of", title: "Contrat future NASDAQ H1 · arrivée sur la résistance", decimals: 0, height: 260, candles: cs,
        levels: [{ key: "res", price: 27100, from: s1 - 2, label: "Résistance 27 100", short: "Résistance", tone: "bear", dashed: true }],

        markers: [
          { key: "s1", i: s1, price: cs[s1].h, label: "1er sommet", tone: "neutral", side: "above", role: "swing-high" },
          { key: "s2", i: s2, price: cs[s2].h, label: "Absorption possible", short: "Absorption ?", tone: "bear", side: "above", role: "swing-high" },
        ],
        subs: [
          { key: "delta", kind: "delta", label: "Delta" },
          { key: "cvd", kind: "cvd", label: "CVD", marks: [
            { key: "c1", i: s1, label: `Sommet du CVD ${signed(cum[s1])}`, short: "Sommet", tone: "sky" },
            { key: "c2", i: s2, label: `Sous le précédent ${signed(cum[s2])}`, short: "Plus bas", tone: "bear" },
          ] },
        ],
        anim: [{ candles: s1 }, { show: ["res", "s1", "c1"] }, { candles: s2 }, { show: "s2" }, { show: "c2" }, { candles: cs.length - 1 }],
      }]}
    />
  );
}
