// Multi-UT 5 bloc 4 — fusionné avec ConfirmationM5Diagram (variante M15, la page FR l'importe
// directement) ; ce nom reste pour les pages EN / ES.

import { ConfirmationM5Diagram } from "./ConfirmationM5Diagram";

export function M15ValidationDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  return <ConfirmationM5Diagram tf="M15" />;
}
