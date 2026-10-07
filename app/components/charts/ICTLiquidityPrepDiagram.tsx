// ICT 5 — fusionné avec IctLiquidityGrabDiagram (variante « attente ») ; ce nom reste
// pour les pages EN / ES, qui l'importent encore.

import { IctLiquidityGrabDiagram } from "./IctLiquidityGrabDiagram";

export function ICTLiquidityPrepDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  return <IctLiquidityGrabDiagram variant="attente" />;
}
