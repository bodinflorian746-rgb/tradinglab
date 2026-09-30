"use client";

// Composants UI v2 partagés par les jeux migrés (charte /design-lab).
// À rendre sous un ancêtre .tsx-v2 (games-v2.css).

import { useParams } from "next/navigation";
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

export type VerdictState = "good" | "partial" | "bad";

/** Couleurs d'un état de verdict : icône, titre et points restent toujours cohérents. */
const VERDICT_TONE: Record<VerdictState, { ring: string; soft: string; glow: string; title: string; points: string; icon: string }> = {
  good:    { ring: "#10b981", soft: "rgba(16,185,129,0.18)", glow: "rgba(16,185,129,0.6)", title: "text-emerald-300", points: "text-emerald-400 v2-verdict-points", icon: "#34d399" },
  partial: { ring: "#f59e0b", soft: "rgba(245,158,11,0.18)", glow: "rgba(245,158,11,0.55)", title: "text-amber-300", points: "text-amber-300 v2-verdict-points v2-verdict-points--partial", icon: "#fbbf24" },
  bad:     { ring: "#ef4444", soft: "rgba(239,68,68,0.18)", glow: "rgba(239,68,68,0.6)", title: "text-red-300", points: "text-red-400 v2-verdict-points v2-verdict-points--bad", icon: "#f87171" },
};

function VerdictIcon({ state, size }: { state: VerdictState; size: number }) {
  const c = VERDICT_TONE[state].icon;
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      {state === "good" && <path d="M5 11.5l4 4 8-9" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}
      {state === "partial" && <path d="M6 11h10" stroke={c} strokeWidth="3" strokeLinecap="round" />}
      {state === "bad" && <path d="M6 6l10 10M16 6L6 16" stroke={c} strokeWidth="3" strokeLinecap="round" />}
    </svg>
  );
}

const fmtPoints = (n: number) => `${n >= 0 ? "+" : ""}${n}`;

/**
 * Verdict en grand au centre du graphique, avec effet d'échelle. À passer en
 * `children` de GameChartV2 : il hérite du déclenchement .is-playing du graphique.
 * Trois états : bon (vert, ✓), partiel (ambre, –), faux (rouge, ✗) ; l'icône, le
 * titre et les points suivent toujours l'état. `max` : points maximum du round.
 */
export function VerdictOverlay({
  state,
  correct,
  headline,
  points,
  max,
  bonus,
  compact = false,
}: {
  state?: VerdictState;
  /** Compatibilité : bon / faux quand `state` n'est pas fourni. */
  correct?: boolean;
  headline: string;
  points: number;
  max?: number;
  /** Ligne secondaire optionnelle (ex. « +30 streak ») */
  bonus?: string;
  /**
   * Variante compacte en bandeau, en haut du graphique : laisse visible un
   * élément marqué sur le graphique (ex. l'erreur de « Trouve l'erreur »).
   */
  compact?: boolean;
}) {
  const st: VerdictState = state ?? (correct ? "good" : "bad");
  const tone = VERDICT_TONE[st];
  const maxLabel = max !== undefined ? <span className="v2-verdict-max"> / {max}</span> : null;
  if (compact) {
    return (
      <div className="pointer-events-none absolute inset-x-0 top-3 z-[5] flex justify-center px-3" style={cssVars({ "--spot": "250ms" })}>
        <div
          className="v2-verdict flex items-center gap-3 rounded-full py-2 pl-2.5 pr-4"
          data-verdict={st}
          style={{ background: "rgba(4,6,10,0.92)", boxShadow: `inset 0 0 0 2px ${tone.ring}, 0 16px 40px -12px ${tone.glow}` }}
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full" style={{ background: tone.soft, boxShadow: `inset 0 0 0 2px ${tone.ring}` }} aria-hidden="true">
            <VerdictIcon state={st} size={16} />
          </span>
          <p className={`v2-display text-[18px] font-bold ${tone.title}`}>{headline}</p>
          <div className="flex flex-col items-end gap-0.5">
            <p className={`v2-mono text-[24px] font-bold leading-none ${tone.points}`}>
              {fmtPoints(points)}{maxLabel}
            </p>
            {bonus && <p className="v2-mono text-[10px] font-bold uppercase leading-none tracking-wider text-amber-300">{bonus}</p>}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="pointer-events-none absolute inset-0 z-[5] grid place-items-center pb-2 pt-11" style={cssVars({ "--spot": "250ms" })}>
      <div
        className="v2-verdict flex flex-col items-center gap-1 rounded-[clamp(20px,2vw,28px)] px-[clamp(18px,2.6vw,40px)] py-[clamp(10px,1.6vw,26px)] text-center"
        data-verdict={st}
        style={{
          background: "radial-gradient(120% 120% at 50% 0%, rgba(255,255,255,0.08), rgba(4,6,10,0.92) 60%)",
          boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.1), 0 30px 80px -20px ${tone.glow}`,
        }}
      >
        <span
          className="grid h-[clamp(34px,2.8vw,46px)] w-[clamp(34px,2.8vw,46px)] place-items-center rounded-full"
          style={{ background: tone.soft, boxShadow: `inset 0 0 0 2px ${tone.ring}` }}
          aria-hidden="true"
        >
          <VerdictIcon state={st} size={20} />
        </span>
        <p className={`v2-display v2-verdict-title font-bold ${tone.title}`}>{headline}</p>
        <p className={`v2-mono v2-verdict-num font-bold ${tone.points}`}>
          {fmtPoints(points)}{maxLabel}
        </p>
        {bonus && <p className="v2-mono text-[12px] font-bold uppercase tracking-wider text-amber-300">{bonus}</p>}
      </div>
    </div>
  );
}

// ─── Mention « cas généraux » ────────────────────────────────────────────────

const GENERAL_CASES_TEXT = {
  fr: "Ces exercices illustrent des cas généraux. Selon la stratégie que tu utilises, la bonne lecture peut être différente.",
  es: "Estos ejercicios ilustran casos generales. Según la estrategia que utilices, la lectura correcta puede ser diferente.",
  en: "These exercises show general cases. Depending on the strategy you use, the right read may differ.",
} as const;

/**
 * Rappel discret que les exercices illustrent des cas généraux. Écran de choix
 * du niveau (sous le titre) et bas de la carte de feedback, jamais sur le graphique.
 */
export function GeneralCasesNote() {
  const locale = useParams<{ locale: string }>()?.locale;
  const text = locale === "es" ? GENERAL_CASES_TEXT.es : locale === "en" ? GENERAL_CASES_TEXT.en : GENERAL_CASES_TEXT.fr;
  return <p className="v2-general-note text-[13px] leading-snug text-[color:var(--v2-text-3)]">{text}</p>;
}
