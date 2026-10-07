// Macro Avancé 4 — régimes de marché sur le quadrant du texte (axe horizontal :
// inflation faible → élevée ; axe vertical : croissance forte → faible).
// Signatures reprises du texte de la leçon. Décisions PO : « Risk-off panique »
// = Yields ↓ (fuite vers les obligations) ; « Stagflation » = Yields ↑. Les deux
// régimes de peur (flight to quality, risk-off panique) partagent le coin
// croissance faible / inflation faible ; la stagflation occupe le coin croissance
// faible / inflation élevée.

import { LessonSchema, Quadrant, Sig } from "@/app/components/lessons/LessonSchema";

export default function RiskRegimesQuadrantDiagram(_props: { locale?: "fr" | "es" | "en" }) {
  return (
    <LessonSchema
      id="RiskRegimesQuadrantDiagram"
      title="Les régimes de marché"
      caption="↑ haussier · ↓ baissier · ~ stable · * sauf tech longue duration"
    >
      <Quadrant
        x={["Inflation faible", "Inflation élevée"]}
        y={["Croissance forte", "Croissance faible"]}
        cells={[
          { title: "Risk-on classique", tone: "bull", value: "DXY ↓ · Yields ~ · Or ~ · Indices ↑ · BTC ↑", text: "Croissance et liquidité : le capital cherche du rendement." },
          { title: "Reflation trade", tone: "zone", value: "DXY ~ · Yields ↑ · Or ↑ · Indices ↑* · BTC ↑", text: "Croissance et inflation qui repart : rotation vers les actifs réels." },
          {
            title: "Risk-off", tone: "bear",
            items: [
              <><strong>Flight to quality</strong> : peur mesurée.<Sig s="DXY ↑ · Yields ↓ · Or ↑ · Indices ↓ · BTC ↓" /></>,
              <><strong>Risk-off panique</strong> : liquidation globale.<Sig s="DXY ↑↑ · Yields ↓ · Or ↑ · Indices ↓↓ · BTC ↓↓" /></>,
            ],
          },
          { title: "Stagflation", tone: "fib", value: "DXY ~ · Yields ↑ · Or ↑ · Indices ↓ · BTC ↓", text: "L'inflation résiste alors que la croissance ralentit : les taux restent hauts." },
        ]}
      />
    </LessonSchema>
  );
}
