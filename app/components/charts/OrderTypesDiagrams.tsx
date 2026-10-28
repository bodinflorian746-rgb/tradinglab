// Trading Débutant 11 — Les types d'ordres. Bougies : lib/lessons/scenarios-nouvelles.ts (prix du texte,
// NASDAQ décalé de +7 000 points) ; plans calculés par tradeSetup.
//  - MarketOrderDiagram : Bid 1.0850 / Ask 1.0852, côté d'exécution d'un achat et d'une vente au marché ;
//  - PendingOrdersDiagram : Buy Limit (or), Sell Limit, Buy Stop (NASDAQ), Sell Stop (EUR/USD), animé ;
//  - StopLossTakeProfitDiagram : achat 1.0850, SL 1.0830, TP 1.0890 ;
//  - BuyLimitPlanDiagram : le Buy Limit complet, exécuté (A) ou jamais atteint (B), animé.

import { LessonChart, type LCPanel } from "@/app/components/lessons/LessonChart";
import { Cards, LessonSchema } from "@/app/components/lessons/LessonSchema";
import { pts, tradeSetup, usd } from "@/app/components/lessons/trade";
import { fmtPrice, type Candle } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const C = CANDLES as unknown as Record<string, Candle[]>;
const p = (x: number) => fmtPrice(x, 4);

export function MarketOrderDiagram() {
  const BID = 1.085, ASK = 1.0852;
  return (
    <LessonSchema id="MarketOrderDiagram" title="L'ordre au marché : Bid, Ask et exécution" caption="Le spread vaut ici 2 pips. Un achat au marché part de l'Ask, une vente au marché du Bid ; quand le marché bouge vite, le prix final peut s'écarter de celui affiché au moment du clic (glissement).">
      <Cards cols={3} items={[
        { tag: "VENTE AU MARCHÉ", title: "Exécutée à partir du Bid", value: p(BID), text: "Le prix auquel les acheteurs te reprennent la position.", tone: "bear" },
        { tag: "SPREAD", title: "Ask − Bid", value: `${Math.round((ASK - BID) * 1e4)} pips`, text: "L'écart payé à chaque entrée (Débutant 4).", tone: "zone" },
        { tag: "ACHAT AU MARCHÉ", title: "Exécuté à partir de l'Ask", value: p(ASK), text: "Le prix auquel les vendeurs te cèdent la position.", tone: "bull" },
      ]} />
    </LessonSchema>
  );
}

/** Un ordre en attente : prix actuel au moment de le poser, puis déclenchement */
function pending(o: { key: string; title: string; cs: Candle[]; decimals: number; fmt: (x: number) => string; now: number; fill: number; fillPrice: number; fillRole?: "high" | "low";
  level: { price: number; label: string; short: string; role: "support" | "resistance" }; order?: { price: number; label: string; short: string }; nowLabel: string; fillLabel: string }): LCPanel {
  const { cs, now, fill } = o;
  return {
    key: o.key, title: o.title, decimals: o.decimals, height: 210, candles: cs, slots: cs.length + 2,
    levels: [
      { key: "niveau", price: o.level.price, from: 0, label: o.level.label, short: `${o.level.short} ${o.fmt(o.level.price)}`, tone: o.order ? "neutral" : "entry", dashed: !!o.order, role: o.level.role },
      ...(o.order ? [{ key: "ordre", price: o.order.price, from: now, label: o.order.label, short: `${o.order.short} ${o.fmt(o.order.price)}`, tone: "entry" as const }] : []),
    ],
    markers: [
      { key: "now", i: now, price: cs[now].c, label: o.nowLabel, short: `Prix ${o.fmt(cs[now].c)}`, tone: "neutral", side: o.level.role === "support" ? "above" : "below", role: "close" },
      { key: "fill", i: fill, price: o.fillPrice, label: o.fillLabel, short: o.fillLabel, tone: "entry", side: o.level.role === "support" ? "below" : "above", ...(o.fillRole ? { role: o.fillRole } : {}) },
    ],
    anim: [{ candles: now }, { show: ["now", "niveau", ...(o.order ? ["ordre"] : [])] }, { candles: fill }, { show: "fill" }, { candles: cs.length - 1 }],
  };
}

export function PendingOrdersDiagram() {
  return (
    <LessonChart
      id="PendingOrdersDiagram"
      title="Les quatre ordres en attente"
      caption="Limit : on attend un retour vers une zone (sous le prix pour acheter, au-dessus pour vendre). Stop : on attend que le prix franchisse un niveau (au-dessus pour acheter, en dessous pour vendre). L'ordre n'existe qu'à partir du moment où tu le poses."
      rows={[2, 2]}
      panels={[
        pending({ key: "bl", title: "Buy Limit · or", cs: C["ord-buy-limit"], decimals: 0, fmt: usd, now: 11, fill: 14, fillPrice: 3900, fillRole: "low",
          level: { price: 3900, label: `Buy Limit sur le support ${usd(3900)}`, short: "Buy Limit", role: "support" },
          nowLabel: `Prix actuel ${usd(3920)}`, fillLabel: `Exécuté à ${usd(3900)}` }),
        pending({ key: "sl", title: "Sell Limit · NASDAQ", cs: C["ord-sell-limit"], decimals: 0, fmt: pts, now: 12, fill: 16, fillPrice: 27200, fillRole: "high",
          level: { price: 27200, label: `Sell Limit sur la résistance ${pts(27200)}`, short: "Sell Limit", role: "resistance" },
          nowLabel: `Prix actuel ${pts(27100)}`, fillLabel: `Exécuté à ${pts(27200)}` }),
        pending({ key: "bs", title: "Buy Stop · NASDAQ", cs: C["ord-buy-stop"], decimals: 0, fmt: pts, now: 10, fill: 14, fillPrice: 27185,
          level: { price: 27180, label: `Résistance ${pts(27180)}`, short: "Résistance", role: "resistance" },
          order: { price: 27185, label: `Buy Stop ${pts(27185)}`, short: "Buy Stop" },
          nowLabel: `Prix actuel ${pts(27100)}`, fillLabel: `Déclenché à ${pts(27185)}` }),
        pending({ key: "ss", title: "Sell Stop · EUR/USD", cs: C["ord-sell-stop"], decimals: 5, fmt: p, now: 9, fill: 12, fillPrice: 1.0818,
          level: { price: 1.082, label: `Support ${p(1.082)}`, short: "Support", role: "support" },
          order: { price: 1.0818, label: `Sell Stop ${p(1.0818)}`, short: "Sell Stop" },
          nowLabel: `Prix actuel ${p(1.085)}`, fillLabel: `Déclenché à ${p(1.0818)}` }),
      ]}
    />
  );
}

export function StopLossTakeProfitDiagram() {
  const cs = C["ord-sltp"];
  const t = tradeSetup({ entry: 1.085, sl: 1.083, tp: 1.089, decimals: 4, from: 15, expect: ">=2", names: { entry: "Achat", sl: "Stop Loss", tp: "Take Profit" } });
  return (
    <LessonChart
      id="StopLossTakeProfitDiagram"
      title="Stop Loss et Take Profit sur EUR/USD"
      caption="Achat à 1.0850 après la réaction sur le support. Le Stop Loss se place sous le creux qui forme le support (1.0833), le Take Profit juste avant la résistance 1.0895 : 20 pips de risque pour 40 pips de gain."
      panels={[{
        key: "h1", title: "EUR/USD H1 · ordres de sortie", decimals: 5, height: 280, candles: cs, slots: cs.length + 4,
        zones: [{ key: "sup", y1: 1.0833, y2: 1.0838, label: `Support ${p(1.0833)} – ${p(1.0838)}`, short: "Support", tone: "zone", role: "support" }],
        levels: [{ key: "res", price: 1.0895, from: 1, label: `Résistance ${p(1.0895)}`, short: "Résistance", tone: "bear", dashed: true, role: "resistance" }, ...t.levels],
        markers: [{ key: "creux", i: 13, price: cs[13].l, label: `Creux ${p(cs[13].l)}`, short: "Creux", tone: "neutral", side: "below", role: "swing-low" }],
        chips: t.chips,
      }]}
    />
  );
}

function blPanel(k: "a" | "b"): LCPanel {
  const cs = C[`ord-bl-${k}`];
  const NOW = 25;
  const t = tradeSetup({ entry: 1.085, sl: 1.0825, tp: 1.09, decimals: 4, from: NOW, expect: ">=2", names: { entry: "Buy Limit", sl: "Stop Loss", tp: "Take Profit" } });
  // l'entrée est posée sur le support (ancienne résistance 1.0850, touchée deux fois puis cassée)
  const levels = t.levels.map((l) => (l.key === "entry" ? { ...l, from: 14, label: `Buy Limit ${p(1.085)} sur l'ancienne résistance`, role: "support" as const } : l));
  const end = k === "a"
    ? { key: "fin", i: 31, price: cs[31].h, label: `Take Profit ${p(1.09)} atteint`, short: "TP atteint", tone: "bull" as const, side: "above" as const, role: "high" as const }
    : { key: "fin", i: cs.length - 1, price: cs[cs.length - 1].h, label: "Pas de retour : aucune position", short: "Aucune position", tone: "neutral" as const, side: "above" as const, role: "high" as const };
  return {
    key: k, title: k === "a" ? "A · le prix revient : ordre exécuté" : "B · le prix monte directement", decimals: 5, height: 260, candles: cs, slots: 33,
    levels: [{ key: "res", price: 1.0905, from: 3, label: `Résistance H1 ${p(1.0905)}`, short: "Résistance", tone: "bear", dashed: true, role: "resistance" }, ...levels],
    markers: [
      { key: "creux", i: 18, price: cs[18].l, label: `Dernier creux ${p(cs[18].l)}`, short: "Creux", tone: "neutral", side: "below", role: "swing-low" },
      { key: "now", i: NOW, price: cs[NOW].c, label: `Ordre posé, prix ${p(cs[NOW].c)}`, short: "Ordre posé", tone: "neutral", side: "above", role: "close" },
      ...(k === "a" ? [{ key: "fill", i: 27, price: cs[27].l, label: `Exécuté à ${p(1.085)}`, short: "Exécuté", tone: "entry" as const, side: "below" as const, role: "low" as const }] : []),
      end,
    ],
    ...(k === "a" ? { chips: t.chips } : {}),
    anim: [{ candles: NOW }, { show: ["res", "creux", "now", "entry", "sl", "tp"] }, ...(k === "a" ? [{ candles: 27 }, { show: "fill" }] : []), { candles: cs.length - 1 }, { show: "fin" }],
  };
}

export function BuyLimitPlanDiagram() {
  return (
    <LessonChart
      id="BuyLimitPlanDiagram"
      title="Le Buy Limit : exécuté seulement si le prix revient"
      caption="Même plan dans les deux cas : Buy Limit à 1.0850 sur l'ancienne résistance devenue support, stop 1.0825 sous le dernier creux (1.0830), objectif 1.0900 avant la résistance H1 1.0905. En A, le prix revient et l'ordre est exécuté ; en B, il ne revient pas : aucune position, et ce n'est pas une erreur."
      panels={[blPanel("a"), blPanel("b")]}
      rows={[1, 1]}
    />
  );
}
