"use client";

// Composants UI v2 partagés par les jeux migrés (charte /design-lab).
// À rendre sous un ancêtre .tsx-v2 (games-v2.css).

import { cssVars } from "./GameChartV2";

// ─── Rangée de choix ─────────────────────────────────────────────────────────

export type ChoiceVariant = "buy" | "sell" | "none";

export interface ChoiceOption<V extends string> {
  value: V;
  label: string;
  variant: ChoiceVariant;
}

const VARIANT_CLASS: Record<ChoiceVariant, string> = {
  buy: "v2-choice--buy",
  sell: "v2-choice--sell",
  none: "v2-choice--none",
};

/**
 * Boutons de décision. Interactifs tant que `onPick` est fourni ; une fois le
 * choix fait (`picked`), le bouton choisi reste souligné et les autres s'estompent.
 */
export function ChoiceRow<V extends string>({
  options,
  picked,
  onPick,
}: {
  options: ChoiceOption<V>[];
  picked?: V | null;
  onPick?: (value: V) => void;
}) {
  return (
    <div className="grid gap-2 sm:gap-3" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={onPick ? () => onPick(o.value) : undefined}
          disabled={!onPick}
          aria-pressed={picked === o.value}
          data-state={picked ? (picked === o.value ? "picked" : "faded") : undefined}
          className={`v2-choice ${VARIANT_CLASS[o.variant]} ${onPick ? "cursor-pointer" : "cursor-default"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ─── Badge d'étape ───────────────────────────────────────────────────────────

export function StepBadge({ n, label }: { n: number; label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="v2-step">{n}</span>
      <span className="v2-eyebrow">{label}</span>
    </div>
  );
}

// ─── Verdict superposé ───────────────────────────────────────────────────────

/**
 * Verdict en grand au centre du graphique, avec effet d'échelle. À passer en
 * `children` de GameChartV2 : il hérite du déclenchement .is-playing du graphique.
 */
export function VerdictOverlay({
  correct,
  headline,
  points,
  bonus,
}: {
  correct: boolean;
  headline: string;
  points: number;
  /** Ligne secondaire optionnelle (ex. « +30 streak ») */
  bonus?: string;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 z-[5] grid place-items-center pb-2 pt-11" style={cssVars({ "--spot": "250ms" })}>
      <div
        className="v2-verdict flex flex-col items-center gap-1 rounded-[clamp(20px,2vw,28px)] px-[clamp(18px,2.6vw,40px)] py-[clamp(10px,1.6vw,26px)] text-center"
        style={{
          background: "radial-gradient(120% 120% at 50% 0%, rgba(255,255,255,0.08), rgba(4,6,10,0.92) 60%)",
          boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.1), 0 30px 80px -20px ${correct ? "rgba(16,185,129,0.6)" : "rgba(239,68,68,0.6)"}`,
        }}
      >
        <span
          className="grid h-[clamp(34px,2.8vw,46px)] w-[clamp(34px,2.8vw,46px)] place-items-center rounded-full"
          style={{ background: correct ? "rgba(16,185,129,0.18)" : "rgba(239,68,68,0.18)", boxShadow: `inset 0 0 0 2px ${correct ? "#10b981" : "#ef4444"}` }}
          aria-hidden="true"
        >
          <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
            {correct
              ? <path d="M5 11.5l4 4 8-9" stroke="#34d399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              : <path d="M6 6l10 10M16 6L6 16" stroke="#f87171" strokeWidth="3" strokeLinecap="round" />}
          </svg>
        </span>
        <p className={`v2-display v2-verdict-title font-bold ${correct ? "text-emerald-300" : "text-red-300"}`}>{headline}</p>
        <p className={`v2-mono v2-verdict-num font-bold ${points >= 0 ? "text-emerald-400 v2-verdict-points" : "text-red-400 v2-verdict-points v2-verdict-points--bad"}`}>
          {points >= 0 ? "+" : ""}{points}
        </p>
        {bonus && <p className="v2-mono text-[12px] font-bold uppercase tracking-wider text-amber-300">{bonus}</p>}
      </div>
    </div>
  );
}
