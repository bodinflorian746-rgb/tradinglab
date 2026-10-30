"use client";

// Démo du héros : trois manches courtes, une par jeu (Buy/Sell/No trade, Place ton Stop, Trouve
// l'erreur), comme dans les jeux (question → glissement et révélation des bougies → verdict ✓ / ✗ en
// une phrase). À la fin : le score (« 2/3 »), le nombre de scénarios et de leçons, et l'essai gratuit
// (connecté : les jeux). AUCUNE écriture : ni analytics, ni profil trader, ni points.
// Sur téléphone, la carte tient dans l'écran ; hauteur constante pendant une manche.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { GameChartV2, V2_REVEAL_DELAY_MS } from "@/app/components/games/v2/GameChartV2";
import { useSession } from "@/app/components/SessionProvider";
import type { DemoGame, HeroRound } from "./hero-rounds";

/** Rythme de révélation des bougies futures (le jeu : 420ms) */
const REVEAL_STEP_MS = 380;

export interface HeroGameStrings {
  /** « Manche {n}/{total} » */
  round: string;
  games: Record<DemoGame, string>;
  good: string;
  wrong: string;
  correctAnswer: string;
  yourChoice: string;
  next: string;
  seeScore: string;
  scoreTitle: string;
  /** « {scenarios} scénarios dans les 4 jeux et {lessons} leçons t'attendent. » */
  catalog: string;
  trial: string;
  playGames: string;
  replay: string;
}

type Phase = "question" | "reveal" | "verdict" | "end";

const fill = (t: string, v: Record<string, number>) => t.replace(/\{(\w+)\}/g, (_, k: string) => String(v[k] ?? ""));

export function HeroGame({ rounds, s, scenarios, lessons, gamesHref, trialHref }: {
  rounds: HeroRound[]; s: HeroGameStrings; scenarios: number; lessons: number; gamesHref: string; trialHref: string;
}) {
  const { user } = useSession();
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("question");
  const [chosen, setChosen] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
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

  const pick = (c: string) => {
    if (phase !== "question") return;
    setChosen(c);
    setResults((r) => [...r, c === round.correct]);
    setRevealed(0);
    setPhase(round.reveal ? "reveal" : "verdict");
  };
  const next = () => {
    if (idx + 1 >= rounds.length) { setPhase("end"); return; }
    setIdx(idx + 1);
    setChosen(null);
    setRevealed(0);
    setPhase("question");
  };
  const replay = () => {
    setIdx(0);
    setChosen(null);
    setRevealed(0);
    setResults([]);
    setPhase("question");
  };

  if (phase === "end") {
    const score = results.filter(Boolean).length;
    return (
      <div className="hv2-game v2-card v2-card--accent v2-accent--emerald flex flex-col gap-4 p-4 sm:p-5" data-demo-end="">
        <p className="v2-eyebrow">{s.scoreTitle}</p>
        <p className="v2-display hv2-demo-score" aria-label={`${score}/${rounds.length}`}>
          {score}<span className="text-[color:var(--v2-text-3)]">/{rounds.length}</span>
        </p>
        <ul className="flex flex-col gap-2">
          {rounds.map((r, i) => (
            <li key={r.key} className="flex items-center gap-2.5 text-[14.5px]">
              <span aria-hidden="true" className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-[12px] font-bold"
                style={{ color: "#04060a", background: results[i] ? "#34d399" : "#f87171" }}>{results[i] ? "✓" : "✗"}</span>
              <span className="text-[color:var(--v2-text)]">{s.games[r.game]}</span>
            </li>
          ))}
        </ul>
        <p className="text-[15px] leading-snug text-[color:var(--v2-text-2)]">{fill(s.catalog, { scenarios, lessons })}</p>
        <div className="hv2-actions hv2-actions--end">
          {/* Les jeux sont réservés aux membres : un visiteur passe par l'essai 48h */}
          <Link href={user ? gamesHref : trialHref} className="v2-btn v2-btn--accent">
            {user ? s.playGames : s.trial}
            <Arrow />
          </Link>
          <button type="button" onClick={replay} className="v2-btn"><Replay />{s.replay}</button>
        </div>
      </div>
    );
  }

  const ok = chosen !== null && chosen === round.correct;
  const correctLabel = round.choices.find((c) => c.id === round.correct)?.label ?? "";
  const question = phase === "question";
  const stopHit = (id: string) => !question && round.reveal && (round.stops?.find((x) => x.id === id)?.hit ?? false) && revealed >= round.future.length;

  return (
    <div className="hv2-game v2-card v2-card--accent v2-accent--emerald flex flex-col gap-3 p-4 sm:p-5" data-demo-round={idx + 1}>
      {/* En-tête : manche et jeu */}
      <div className="flex items-center justify-between gap-3">
        <span className="flex min-w-0 items-center gap-2 text-[14px] font-semibold">
          <span className="v2-step">{idx + 1}</span>
          <span className="truncate">{s.games[round.game]}</span>
        </span>
        <span className="v2-mono shrink-0 text-[12px] text-[color:var(--v2-text-3)]">{fill(s.round, { n: idx + 1, total: rounds.length })}</span>
      </div>

      <div aria-hidden="true">
        <GameChartV2
          key={round.key}
          data={{ candles: [...round.past, ...round.future], zones: round.zones, domain: { min: 0, max: 1 } }}
          overlay={{
            ...(round.reveal ? { separatorIndex: round.past.length, visibleFutureCount: question ? 0 : revealed } : {}),
            // (Trouve l'erreur : l'étiquette « Entrée » est portée par les lignes du plan, comme dans le jeu)
            ...(round.entry ? { entry: round.lines ? round.entry : { ...round.entry, label: "Entrée" } } : {}),
            ...(round.stops ? { stops: round.stops.map((x) => ({ price: x.price, color: x.color, dashed: true, label: x.label, selected: chosen === x.id, hit: stopHit(x.id) })) } : {}),
            ...(round.lines ? { candidateLines: round.lines } : {}),
          }}
          mode={question ? "question" : phase === "reveal" ? "reveal" : "verdict"}
          keepCandlesBright
          preview
          inlineLabels
          labeledZones={round.labeledZones}
        />
      </div>

      {/* Emplacement de hauteur fixe : énoncé → verdict */}
      <div className="hv2-game-slot" aria-live="polite">
        {phase !== "verdict" && <p className="text-[14.5px] leading-snug text-[color:var(--v2-text)]">{round.statement}</p>}
        {phase === "verdict" && chosen && (
          <div className="hv2-verdict flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <span aria-hidden="true" className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[14px] font-bold"
                style={{ color: "#04060a", background: ok ? "#34d399" : "#f87171" }}>{ok ? "✓" : "✗"}</span>
              <p className="v2-display text-[17px] font-bold" style={{ color: ok ? "#6ee7b7" : "#fca5a5" }}>{ok ? s.good : s.wrong}</p>
              {!ok && <span className="v2-chip v2-chip--emerald">{correctLabel} {s.correctAnswer}</span>}
            </div>
            <p className="text-[14px] leading-snug text-[color:var(--v2-text-2)]">{round.verdicts[ok ? chosen : round.correct]}</p>
          </div>
        )}
      </div>

      {/* Les choix du jeu, puis « Manche suivante » / « Voir mon score » */}
      {phase !== "verdict" ? (
        <div className={`hv2-choices${round.choices.length === 4 ? " hv2-choices--4" : ""}`}>
          {round.choices.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => pick(c.id)}
              disabled={!question}
              data-state={chosen === null ? undefined : chosen === c.id ? "picked" : "faded"}
              aria-label={chosen === c.id ? `${c.label} ${s.yourChoice}` : c.label}
              className={c.variant ? `v2-choice v2-choice--${c.variant}` : `v2-choice v2-choice--none${round.choices.length === 4 ? " hv2-choice-text" : ""}`}
            >
              {c.color && <span aria-hidden="true" className="hv2-stop-dot" style={{ background: c.color }} />}
              {c.label}
            </button>
          ))}
        </div>
      ) : (
        <div className={`hv2-actions hv2-actions--one${round.choices.length === 4 ? " hv2-actions--tall" : ""}`}>
          <button type="button" onClick={next} className="v2-btn v2-btn--accent">
            {idx + 1 >= rounds.length ? s.seeScore : s.next}
            <Arrow />
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
function Replay() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2.5 7a4.5 4.5 0 1 0 1.3-3.2M2.5 2v2.8h2.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
