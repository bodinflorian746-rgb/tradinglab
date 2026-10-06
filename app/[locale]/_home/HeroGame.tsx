"use client";

// Jeu jouable du héros : un round de BUY / SELL / NO TRADE, comme dans le jeu
// (question → glissement et révélation des bougies → verdict ✓ / ✗ avec
// l'explication du jeu). AUCUNE écriture : ni analytics, ni profil trader, ni
// points. Après le verdict : « Joue la suite » (connecté → le jeu ; visiteur →
// parcours d'essai 48h existant, /signup?from=trial) et « Rejouer » (round
// suivant, graines fixes).
// Hauteur constante dans tous les états : aucun saut de mise en page.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { GameChartV2, V2_REVEAL_DELAY_MS } from "@/app/components/games/v2/GameChartV2";
import { useSession } from "@/app/components/SessionProvider";
import type { GameChoice } from "@/lib/games/buy-sell-no-trade";
import type { HeroRound } from "./hero-rounds";

/** Rythme de révélation des bougies futures (le jeu : 420ms) */
const REVEAL_STEP_MS = 380;

const CHOICES: { value: GameChoice; label: string; variant: "buy" | "sell" | "none" }[] = [
  { value: "BUY", label: "BUY", variant: "buy" },
  { value: "SELL", label: "SELL", variant: "sell" },
  { value: "NO_TRADE", label: "NO TRADE", variant: "none" },
];
const LABEL: Record<GameChoice, string> = { BUY: "BUY", SELL: "SELL", NO_TRADE: "NO TRADE" };

export interface HeroGameStrings {
  question: string;
  stepChoice: string;
  stepVerdict: string;
  duration: string;
  htf: string;
  macro: string;
  bias: Record<"bullish" | "bearish" | "range", string>;
  macroLabel: Record<"normal" | "dangereux", string>;
  revelation: string;
  revealText: string;
  goodRead: string;
  wrongRead: string;
  disciplinePerfect: string;
  trapAvoided: string;
  correctAnswer: string;
  yourChoice: string;
  playNext: string;
  replay: string;
}

type Phase = "question" | "reveal" | "verdict";

export function HeroGame({ rounds, s, gameHref, trialHref }: { rounds: HeroRound[]; s: HeroGameStrings; gameHref: string; trialHref: string }) {
  const { user } = useSession();
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("question");
  const [chosen, setChosen] = useState<GameChoice | null>(null);
  const [revealed, setRevealed] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const round = rounds[idx];

  // Révélation : glissement du graphique, puis une bougie future à la fois
  useEffect(() => {
    if (phase !== "reveal") return;
    if (revealed >= round.future.length) {
      timer.current = setTimeout(() => setPhase("verdict"), 450);
    } else {
      timer.current = setTimeout(() => setRevealed((n) => n + 1), revealed === 0 ? V2_REVEAL_DELAY_MS : REVEAL_STEP_MS);
    }
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [phase, revealed, round.future.length]);

  const pick = (c: GameChoice) => {
    if (phase !== "question") return;
    setChosen(c);
    setRevealed(0);
    setPhase("reveal");
  };
  const replay = () => {
    setIdx((i) => (i + 1) % rounds.length);
    setChosen(null);
    setRevealed(0);
    setPhase("question");
  };

  const ok = chosen !== null && round.isCorrect[chosen];
  const headline = ok
    ? round.correct === "NO_TRADE" ? s.disciplinePerfect : s.goodRead
    : round.correct === "NO_TRADE" ? s.trapAvoided : s.wrongRead;

  return (
    <div className="hv2-game v2-card v2-card--accent v2-accent--emerald flex flex-col gap-3 p-4 sm:p-5">
      {/* En-tête : étape et durée, comme dans le jeu */}
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-[14px] font-semibold">
          <span className="v2-step">{phase === "question" ? 1 : phase === "reveal" ? 2 : 3}</span>
          {phase === "question" ? s.question : phase === "reveal" ? s.stepChoice : s.stepVerdict}
        </span>
        <span className="v2-mono shrink-0 text-[12px] text-[color:var(--v2-text-3)]">{s.duration}</span>
      </div>

      <div aria-hidden="true">
        <GameChartV2
          key={round.key}
          data={{ candles: [...round.past, ...round.future], zones: round.zones, domain: { min: 0, max: 1 } }}
          overlay={{ separatorIndex: round.past.length, visibleFutureCount: phase === "question" ? 0 : revealed }}
          mode={phase === "question" ? "question" : "reveal"}
          keepCandlesBright
          preview
        />
      </div>

      {/* Emplacement de hauteur fixe : contexte → révélation → verdict */}
      <div className="hv2-game-slot" aria-live="polite">
        {phase === "question" && (
          <div className="flex flex-col gap-2.5">
            <p className="text-[14.5px] leading-snug text-[color:var(--v2-text)]">{round.context}</p>
            <div className="flex flex-wrap gap-2">
              <span className="v2-chip">{s.htf} · {s.bias[round.htf]}</span>
              <span className={`v2-chip ${round.macro === "dangereux" ? "v2-chip--red" : ""}`}>{s.macro} · {s.macroLabel[round.macro]}</span>
            </div>
          </div>
        )}
        {phase === "reveal" && (
          <div className="flex flex-col gap-1">
            <p className="v2-eyebrow">{s.revelation}</p>
            <p className="text-[14.5px] leading-snug text-[color:var(--v2-text-2)]">{s.revealText}</p>
          </div>
        )}
        {phase === "verdict" && chosen && (
          <div className="hv2-verdict flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <span
                aria-hidden="true"
                className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[14px] font-bold"
                style={{ color: "#04060a", background: ok ? "#34d399" : "#f87171" }}
              >
                {ok ? "✓" : "✗"}
              </span>
              <p className="v2-display text-[17px] font-bold" style={{ color: ok ? "#6ee7b7" : "#fca5a5" }}>{headline}</p>
              {!ok && <span className="v2-chip v2-chip--emerald">{LABEL[round.correct]} {s.correctAnswer}</span>}
            </div>
            <p className="text-[14px] leading-snug text-[color:var(--v2-text-2)]">{round.explanations[chosen]}</p>
          </div>
        )}
      </div>

      {/* Boutons : les 3 choix, puis « Joue la suite » / « Rejouer » (même hauteur) */}
      {phase !== "verdict" ? (
        <div className="hv2-choices">
          {CHOICES.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => pick(c.value)}
              disabled={phase !== "question"}
              data-state={chosen === null ? undefined : chosen === c.value ? "picked" : "faded"}
              aria-label={chosen === c.value ? `${c.label} ${s.yourChoice}` : c.label}
              className={`v2-choice v2-choice--${c.variant}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      ) : (
        <div className="hv2-actions">
          {/* Le jeu est réservé aux membres : un visiteur passe par l'essai 48h */}
          <Link href={user ? gameHref : trialHref} className="v2-btn v2-btn--accent">
            {s.playNext}
            <Arrow />
          </Link>
          <button type="button" onClick={replay} className="v2-btn">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2.5 7a4.5 4.5 0 1 0 1.3-3.2M2.5 2v2.8h2.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {s.replay}
          </button>
        </div>
      )}
    </div>
  );
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
