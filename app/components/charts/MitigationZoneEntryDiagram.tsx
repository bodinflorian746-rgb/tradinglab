// Zone de mitigation et entrée après un CHoCH baissier (EUR/USD), deux variantes :
// - SMC 3 bloc 8 (« mitigation », H1) : structure HL 1.1720 / HH 1.1780, CHoCH sous le HL, creux
//   1.1690, retour sur l'ex-HL devenu résistance, bougie de rejet baissière → entrée short à sa
//   clôture, SL au-dessus de la zone, TP sur la projection ;
// - SMC 5 bloc 5 (« smc5-exec », H4, plan chiffré du bloc 6) : sweep des equal highs 1.1780, CHoCH
//   sous 1.1755, displacement qui laisse le FVG 1.1758-1.1770, retour dans le FVG (entrée 1.1765),
//   rejet, SL 1.1798, TP sur la SSL 1.1690.
// Pivots, CHoCH, sweep, FVG, displacement et rejet calculés et vérifiés par l'audit (rôles).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { tradeSetup } from "@/app/components/lessons/trade";
import { fmtPrice, fvgAt, pivots } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);

function ExHLVariant() {
  const cs = CANDLES["mitigation"];
  const piv = pivots(cs, 2);
  const hh = piv.find((q) => q.name === "HH")!;
  const hl = piv.filter((q) => q.side === "l" && q.index < hh.index).at(-1)!;
  const choch = cs.findIndex((k, i) => i > hh.index && k.c < hl.price);
  const low = piv.find((q) => q.side === "l" && q.index > choch)!;
  const retest = cs.findIndex((k, i) => i > low.index && k.h >= hl.price);
  const zone = { y1: hl.price, y2: hl.price + 0.0006 };
  const entry = cs[retest].c;
  const t = tradeSetup({ entry, sl: zone.y2 + 0.0006, tp: low.price - (hh.price - low.price) * 0.5, from: retest, names: { tp: "TP projection" } });
  return (
    <LessonChart
      id="MitigationZoneEntryDiagram"
      title="Après le CHoCH, l'ex-HL devient résistance"
      panels={[{
        key: "h1", subtitle: `EUR/USD H1 — ex-HL ${p(hl.price)} retesté par en dessous`,
        decimals: 5, height: 300, candles: cs,
        zones: [{ key: "mitig", ...zone, from: hl.index, label: "Zone de mitigation", short: "Mitigation", tone: "zone", kind: "zone" }],
        levels: [
          { key: "choch", price: hl.price, from: hl.index, to: choch, label: `CHoCH : clôture sous ${p(hl.price)}`, short: "CHoCH", tone: "bear", dashed: true, faint: true, role: "choch", ref: hl.index, dir: "bear" },
          ...t.levels,
        ],
        markers: [
          { key: "hl", i: hl.index, price: hl.price, label: "HL", pivot: "HL", tone: "neutral", side: "below" },
          { key: "hh", i: hh.index, price: hh.price, label: "HH", pivot: "HH", tone: "neutral", side: "above" },
          { key: "rej", i: retest, price: cs[retest].h, label: "Rejet baissier", short: "Rejet", tone: "bear", side: "above", role: "rejet", ref: "mitig", dir: "bear" },
        ],
        chips: t.chips,
      }]}
      caption="Entrée à la clôture de la bougie de rejet ; stop serré au-delà de la zone."
    />
  );
}

const EQH = 1.178;

function FvgVariant() {
  const cs = CANDLES["smc5-exec"];
  const tops = cs.map((k, i) => (k.h === EQH ? i : -1)).filter((i) => i >= 0);
  const sweep = cs.findIndex((k) => k.h > EQH);
  const minor = pivots(cs.slice(0, sweep), 2).filter((q) => q.side === "l").at(-1)!;
  const choch = cs.findIndex((k, i) => i > sweep && k.c < minor.price);
  // FVG du texte : celui que laisse la 1re bougie du displacement (sous la bougie du sweep)
  const fvg = { i: sweep + 1, ...fvgAt(cs, sweep + 1, "bear")! };
  let dEnd = sweep + 1;
  while (cs[dEnd + 1].c < cs[dEnd + 1].o && cs[dEnd + 1].o - cs[dEnd + 1].c >= 0.0010) dEnd++;
  const retest = cs.findIndex((k, i) => i > dEnd && k.h >= fvg.y1);
  const t = tradeSetup({ entry: 1.1765, sl: 1.1798, tp: 1.169, from: retest, expect: ">2", names: { tp: "TP SSL" } });
  return (
    <LessonChart
      id="MitigationZoneEntryDiagram"
      title="CHoCH, displacement, puis entrée dans le FVG"
      panels={[{
        key: "h4", subtitle: "EUR/USD H4 — plan chiffré du bloc suivant",
        decimals: 5, height: 320, candles: cs,
        zones: [{ key: "fvg", y1: fvg.y1, y2: fvg.y2, from: fvg.i - 1, label: `FVG ${p(fvg.y1)}-${p(fvg.y2)}`, short: "FVG", tone: "bear", kind: "fvg", src: `smc5-exec:${fvg.i}`, role: "fvg" }],
        levels: [
          { key: "eqh", price: EQH, from: tops[0], to: sweep, label: `Equal highs ${p(EQH)} (BSL)`, short: "BSL", tone: "zone", dashed: true },
          { key: "choch", price: minor.price, from: minor.index, to: choch, label: `CHoCH : clôture sous ${p(minor.price)}`, short: "CHoCH", tone: "bear", dashed: true, faint: true, role: "choch", ref: minor.index, dir: "bear" },
          ...t.levels,
        ],
        markers: [
          { key: "sweep", i: sweep, price: cs[sweep].h, label: `Sweep ${p(cs[sweep].h)}`, short: "Sweep", tone: "bear", side: "above", role: "sweep", ref: EQH, dir: "bear" },
          { key: "disp", i: dEnd, price: cs[dEnd].l, label: `Displacement (${dEnd - sweep} bougies)`, short: "Displacement", tone: "bear", side: "below", role: "displacement", span: [sweep + 1, dEnd] },
          { key: "rej", i: retest, price: cs[retest].h, label: "Rejet dans le FVG", short: "Rejet", tone: "bear", side: "above", role: "rejet", ref: "fvg", dir: "bear" },
        ],
        chips: t.chips,
      }]}
      caption="Entrée agressive : sans attendre de BOS de confirmation, l'ordre limite attend le prix dans le FVG laissé par le displacement."
    />
  );
}

export default function MitigationZoneEntryDiagram({ variant = "ex-hl" }: { className?: string; locale?: "fr" | "es" | "en"; variant?: "ex-hl" | "fvg" }) {
  return variant === "fvg" ? <FvgVariant /> : <ExHLVariant />;
}
