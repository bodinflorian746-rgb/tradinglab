import { type ReactNode } from "react";

const MIN_W = {
  sm: "min-w-[560px]",
  md: "min-w-[720px]",
  lg: "min-w-[900px]",
} as const;

interface ChartScrollerProps {
  children: ReactNode;
  /** Largeur minimum forcée sur mobile (<640px). Desktop reste inchangé. */
  width?: keyof typeof MIN_W;
  /** Affiche un petit indicateur "← glisser →" sous le chart sur mobile. */
  hint?: boolean;
  className?: string;
}

/**
 * Fallback mobile pour visuels pédagogiques larges (SVG ≥800px de viewBox).
 * Sur mobile : autorise un scroll horizontal et force une min-width lisible.
 * Sur desktop (>=640px) : aucun effet — comportement identique à l'absence du wrapper.
 *
 * À utiliser UNIQUEMENT autour de gros SVG, pas des icônes/pictos/cartes HTML responsives.
 */
export function ChartScroller({
  children,
  width = "md",
  hint = true,
  className = "",
}: ChartScrollerProps) {
  return (
    <div className={className}>
      <div className="overflow-x-auto sm:overflow-visible [-webkit-overflow-scrolling:touch]">
        <div className={`${MIN_W[width]} sm:min-w-0`}>{children}</div>
      </div>
      {hint && (
        <p className="sm:hidden text-center text-[10px] text-zinc-600 mt-1.5 italic">
          ← glisser pour voir le graphique →
        </p>
      )}
    </div>
  );
}
