"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import * as FrGame from "@/lib/games/find-the-mistake";
import * as EsGame from "@/lib/games/find-the-mistake-es";
import * as EnGame from "@/lib/games/find-the-mistake-en";
import {
  scoreMistakeChoice,
  ROUNDS_PER_SESSION,
  type Difficulty,
  type MistakeId,
  type MistakeInstance,
  type MistakeScoreResult,
  type ScenarioChart,
} from "@/lib/games/find-the-mistake";
import { GameChartV2, type GameChartMark } from "@/app/components/games/v2/GameChartV2";
import { StepBadge, VerdictOverlay, GeneralCasesNote } from "@/app/components/games/v2/ui";
import { logGameEvent, type SkillId } from "@/lib/trader-profile";

const CATEGORY_TO_SKILL: Record<"technique" | "psychologique" | "execution" | "rr" | "timing" | "liquidite" | "discipline", SkillId> = {
  technique:     "structure",
  psychologique: "psychologie",
  execution:     "execution",
  rr:            "rr_management",
  timing:        "timing",
  liquidite:     "liquidite",
  discipline:    "discipline",
};

const BIAS_LABEL_FR  = { bullish: "Haussier", bearish: "Baissier", range: "Range" } as const;
const BIAS_LABEL_ES  = { bullish: "Alcista", bearish: "Bajista", range: "Range" } as const;
const BIAS_LABEL_EN  = { bullish: "Bullish", bearish: "Bearish", range: "Range" } as const;
const MACRO_LABEL_FR = { normal: "Normal", dangereux: "Dangereux" } as const;
const MACRO_LABEL_ES = { normal: "Normal", dangereux: "Peligroso" } as const;
const MACRO_LABEL_EN = { normal: "Normal", dangereux: "Dangerous" } as const;
const DIFFICULTIES: Difficulty[] = ["beginner", "intermediate", "advanced"];

// ─── Page ────────────────────────────────────────────────────────────────────

interface SessionStats {
  correct:   number;
  incorrect: number;
}
const EMPTY_STATS: SessionStats = { correct: 0, incorrect: 0 };

export default function FindTheMistakePage() {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale;
  const G = locale === "es" ? EsGame : locale === "en" ? EnGame : FrGame;
  const BIAS_LABEL = locale === "es" ? BIAS_LABEL_ES : locale === "en" ? BIAS_LABEL_EN : BIAS_LABEL_FR;
  const MACRO_LABEL = locale === "es" ? MACRO_LABEL_ES : locale === "en" ? MACRO_LABEL_EN : MACRO_LABEL_FR;
  const T = locale === "es"
    ? {
        games:           "Juegos",
        round:           "Ronda",
        score:           "Puntuación",
        ofStreak:        "de racha",
        bonusActive:     "· bono activo",
        loading:         "Cargando…",
        newsWarning:     "Noticia macro mayor en menos de 30 min.",
        htf:             "HTF",
        macro:           "Macro",
        volatility:      "Volatilidad",
        question:        "¿Cuál es el error principal?",
        wellSeen:        "Bien visto",
        wrongMistake:    "Error incorrecto",
        correctAnswerTag: "✓ Respuesta correcta",
        yourChoice:      "Tu elección",
        lesson:          "Lección",
        viewSummary:     "Ver el resumen",
        next:            "Siguiente",
        correct:         "Correctas",
        title:           "Encuentra el error",
        heading:         "¿Cuál es el error principal?",
        pickerIntro:     "escenarios. Para cada uno, ves un setup o un trade, e identificas el error principal entre 4 opciones. El objetivo: desarrollar tu ojo para los errores retail clásicos.",
        summary:         "Resumen",
        scenariosPlayed: "escenarios jugados",
        precision:       "Precisión",
        correctAnswers:  "Respuestas correctas",
        bestStreak:      "Mejor racha",
        replayIn:        "Volver a jugar en",
        changeLevel:     "Cambiar de nivel",
        vol:             "Vol.",
        spread:          "Spread",
        spreadLow:       "bajo",
        spreadHigh:      "alto",
        volLow:          "baja",
        volNormal:       "normal",
        volHigh:         "alta",
        stepQuestion:    "Pregunta",
        stepVerdict:     "Veredicto",
        lineEntry:       "Entrada",
        lineStop:        "Stop",
        lineTp:          "TP",
      }
    : locale === "en"
    ? {
        games:           "Games",
        round:           "Round",
        score:           "Score",
        ofStreak:        "streak",
        bonusActive:     "· bonus active",
        loading:         "Loading…",
        newsWarning:     "Major macro news in < 30 min.",
        htf:             "HTF",
        macro:           "Macro",
        volatility:      "Volatility",
        question:        "What's the main mistake?",
        wellSeen:        "Well spotted",
        wrongMistake:    "Not the right mistake",
        correctAnswerTag: "✓ Correct answer",
        yourChoice:      "Your choice",
        lesson:          "Lesson",
        viewSummary:     "View the summary",
        next:            "Next",
        correct:         "Correct",
        title:           "Find the Mistake",
        heading:         "What's the main mistake?",
        pickerIntro:     "scenarios. For each one, you see a setup or a trade, and you identify the main mistake among 4 choices. The goal: train your eye for the classic retail mistakes.",
        summary:         "Summary",
        scenariosPlayed: "scenarios played",
        precision:       "Accuracy",
        correctAnswers:  "Correct answers",
        bestStreak:      "Best streak",
        replayIn:        "Replay in",
        changeLevel:     "Change level",
        vol:             "Vol.",
        spread:          "Spread",
        spreadLow:       "low",
        spreadHigh:      "high",
        volLow:          "low",
        volNormal:       "normal",
        volHigh:         "high",
        stepQuestion:    "Question",
        stepVerdict:     "Verdict",
        lineEntry:       "Entry",
        lineStop:        "Stop",
        lineTp:          "TP",
      }
    : {
        games:           "Jeux",
        round:           "Round",
        score:           "Score",
        ofStreak:        "de série",
        bonusActive:     "· bonus actif",
        loading:         "Chargement…",
        newsWarning:     "News macro majeure dans < 30 min.",
        htf:             "HTF",
        macro:           "Macro",
        volatility:      "Volatilité",
        question:        "Quelle est l'erreur principale ?",
        wellSeen:        "Bien vu",
        wrongMistake:    "Pas la bonne erreur",
        correctAnswerTag: "✓ Bonne réponse",
        yourChoice:      "Ton choix",
        lesson:          "Leçon",
        viewSummary:     "Voir le bilan",
        next:            "Suivant",
        correct:         "Correctes",
        title:           "Trouve l'erreur",
        heading:         "Quelle est l'erreur principale ?",
        pickerIntro:     "scénarios. Pour chacun, tu vois un setup ou un trade, et tu identifies l'erreur principale parmi 4 choix. Le but : développer ton œil pour les erreurs retail classiques.",
        summary:         "Bilan",
        scenariosPlayed: "scénarios joués",
        precision:       "Précision",
        correctAnswers:  "Bonnes réponses",
        bestStreak:      "Meilleure série",
        replayIn:        "Rejouer en",
        changeLevel:     "Changer de niveau",
        vol:             "Vol.",
        spread:          "Spread",
        spreadLow:       "faible",
        spreadHigh:      "élevé",
        volLow:          "faible",
        volNormal:       "normale",
        volHigh:         "élevée",
        stepQuestion:    "Question",
        stepVerdict:     "Verdict",
        lineEntry:       "Entrée",
        lineStop:        "Stop",
        lineTp:          "TP",
      };
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [seed, setSeed] = useState<number | null>(null);
  const [scenarios, setScenarios] = useState<MistakeInstance[]>([]);
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState<MistakeId | null>(null);
  const [result, setResult] = useState<MistakeScoreResult | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [stats, setStats] = useState<SessionStats>(EMPTY_STATS);
  const [showSummary, setShowSummary] = useState(false);

  const current = scenarios[idx];
  const chart: ScenarioChart | null = useMemo(
    () => (current ? G.withAssetPrices(G.buildScenarioChart(current, current.seed, current.volatility), current) : null),
    [current, G],
  );

  // Reset state au scenario suivant
  useEffect(() => {
    setChosen(null);
    setResult(null);
  }, [idx]);

  // ─── Écran picker ──────────────────────────────────────────────────────────
  if (!difficulty || !seed) {
    return <DifficultyPicker locale={locale} difficultyMeta={G.DIFFICULTY_META} onPick={(d) => {
      const s = Math.floor(Math.random() * 1e9) >>> 0;
      setDifficulty(d);
      setSeed(s);
      setScenarios(G.generateMistakeScenarios(s, d));
    }} />;
  }

  // ─── Écran bilan ───────────────────────────────────────────────────────────
  if (showSummary) {
    return (
      <Summary
        T={T}
        difficulty={difficulty}
        difficultyMeta={G.DIFFICULTY_META}
        sessionVerdictFn={G.sessionVerdict}
        score={score}
        maxStreak={maxStreak}
        stats={stats}
        onReplay={() => {
          const s = Math.floor(Math.random() * 1e9) >>> 0;
          setSeed(s);
          setScenarios(G.generateMistakeScenarios(s, difficulty));
          setIdx(0);
          setScore(0);
          setStreak(0);
          setMaxStreak(0);
          setStats(EMPTY_STATS);
          setShowSummary(false);
        }}
        onChangeDifficulty={() => {
          setDifficulty(null);
          setSeed(null);
          setIdx(0);
          setScore(0);
          setStreak(0);
          setMaxStreak(0);
          setStats(EMPTY_STATS);
          setShowSummary(false);
        }}
      />
    );
  }

  if (!current || !chart) {
    return (
      <main className="v2-page flex min-h-[60vh] items-center justify-center">
        <p className="text-[14px] text-[color:var(--v2-text-3)]">{T.loading}</p>
      </main>
    );
  }

  const isFeedback = chosen !== null && result !== null;

  const handlePick = (id: MistakeId) => {
    if (isFeedback) return;
    const r = scoreMistakeChoice(id, current.correctMistake, streak);
    logGameEvent({
      game:       "find-the-mistake",
      difficulty,
      skill:      CATEGORY_TO_SKILL[current.category],
      outcome:    r.correct ? "win" : "loss",
    });
    setChosen(id);
    setResult(r);
    setScore((s) => s + r.points);
    setStats((s) => ({
      ...s,
      [r.correct ? "correct" : "incorrect"]: s[r.correct ? "correct" : "incorrect"] + 1,
    }));
    if (r.correct) {
      const ns = streak + 1;
      setStreak(ns);
      setMaxStreak((m) => Math.max(m, ns));
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (idx + 1 >= ROUNDS_PER_SESSION) {
      setShowSummary(true);
    } else {
      setIdx(idx + 1);
    }
  };

  const step = isFeedback ? 2 : 1;
  const stepLabel = isFeedback ? T.stepVerdict : T.stepQuestion;
  const dir: "BUY" | "SELL" = current.direction === "SELL" ? "SELL" : "BUY";
  // Lignes étiquetées (Entrée / Stop / TP) : écartées automatiquement si proches
  const labelledLines = [
    ...(chart.entry !== undefined ? [{ price: chart.entry, color: "#3b82f6", label: T.lineEntry }] : []),
    ...(chart.stop !== undefined ? [{ price: chart.stop, color: "#ef4444", label: T.lineStop }] : []),
    ...(chart.tp !== undefined ? [{ price: chart.tp, color: "#10b981", label: T.lineTp }] : []),
  ];

  return (
    <main className="v2-page mx-auto flex w-full max-w-[880px] flex-col">
      <div className="flex flex-col gap-3">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-3">
          <Link href="/jeux" className="v2-link-back">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M11 6.5H2M5 3.5l-3 3 3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {T.games}
          </Link>
          <div className="flex items-center gap-3 text-[12px]">
            <DifficultyChip difficulty={difficulty} difficultyMeta={G.DIFFICULTY_META} />
            <span className="h-3 w-px bg-white/15" />
            <div className="flex items-center gap-1.5">
              <span className="uppercase tracking-wide text-[color:var(--v2-text-3)]">{T.round}</span>
              <span className="v2-mono font-bold text-[color:var(--v2-text)]">{idx + 1}/{ROUNDS_PER_SESSION}</span>
            </div>
            <span className="h-3 w-px bg-white/15" />
            <div className="flex items-center gap-1.5">
              <span className="uppercase tracking-wide text-[color:var(--v2-text-3)]">{T.score}</span>
              <span className={`v2-mono font-bold ${score < 0 ? "text-red-400" : "text-emerald-400"}`}>
                {score >= 0 ? "+" : ""}{score}
              </span>
            </div>
          </div>
        </div>

        {/* Streak — emplacement toujours réservé : son apparition au clic ne
            doit pas décaler le jeu (c'est l'instant filmé) */}
        <div
          className={`flex h-[18px] items-center justify-center gap-1.5 text-[12px] font-semibold ${streak > 0 ? "" : "invisible"}`}
          aria-hidden={streak === 0}
        >
          <span className="text-amber-300">🔥</span>
          <span className="v2-mono text-amber-300">{streak}</span>
          <span className="text-[color:var(--v2-text-3)]">{T.ofStreak}</span>
          {streak >= 3 && <span className="text-amber-300">{T.bonusActive}</span>}
        </div>

        {/* Scénario */}
        <section className="v2-card v2-pad v2-gap flex flex-col" aria-labelledby="ftm-title">
          <h2 id="ftm-title" className="v2-display v2-h2 mx-auto w-full max-w-3xl font-bold">{T.title}</h2>

          <div className="v2-gap-s mx-auto flex w-full max-w-3xl flex-col">
            <StepBadge n={step} label={stepLabel} />

            <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
              <span className="v2-display v2-asset mr-1 font-bold">{current.asset}</span>
              {current.direction && (
                <span className={`v2-chip ${current.direction === "BUY" ? "v2-chip--emerald" : "v2-chip--red"}`}>{current.direction}</span>
              )}
              <span className="v2-chip">{current.session}</span>
              <VolBadge volatility={current.volatility} T={T} />
              <SpreadBadge spread={current.spread} T={T} />
              {current.extraInfo && <span className="v2-chip v2-chip--amber">{current.extraInfo}</span>}
            </div>

            {/* News warning (présent dès la question : aucun saut au clic) */}
            {current.macroContext === "dangereux" && (
              <div className="v2-well v2-well--danger flex items-center gap-2.5 px-3.5 py-2.5">
                <svg width="16" height="16" viewBox="0 0 14 14" fill="none" className="shrink-0">
                  <path d="M7 1L13 12H1L7 1z" stroke="#f87171" strokeWidth="1.4" strokeLinejoin="round" />
                  <path d="M7 5.5v3M7 10v0.5" stroke="#f87171" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
                <p className="text-[13px] font-semibold leading-snug text-red-300">{T.newsWarning}</p>
              </div>
            )}

            {/* Le trade à juger : au-dessus du graphique, pour que prémisse,
                graphique et choix tiennent dans le même écran */}
            <p className="v2-lead text-[color:var(--v2-text)]">{current.context}</p>

            <GameChartV2
              data={{ candles: [...chart.past, ...chart.future], zones: chart.zones, domain: chart.domain }}
              overlay={{ entry: chart.entry !== undefined ? { price: chart.entry, direction: dir } : undefined, candidateLines: labelledLines }}
              mode={isFeedback ? "verdict" : "question"}
              keepCandlesBright={chart.zones.length === 0}
              mark={isFeedback ? mistakeMark(current.correctMistake, chart, G.MISTAKE_LABELS[current.correctMistake]) : undefined}
            >
              {isFeedback && result && (
                <VerdictOverlay
                  compact
                  correct={result.correct}
                  headline={result.correct ? T.wellSeen : T.wrongMistake}
                  points={result.points}
                />
              )}
            </GameChartV2>

            {/* Question + 4 choix : interactifs, puis figés avec le résultat */}
            <p className="v2-eyebrow">{T.question}</p>
            <MistakeChoices
              choices={current.shuffledChoices}
              labels={G.MISTAKE_LABELS}
              picked={chosen}
              correct={isFeedback ? current.correctMistake : null}
              onPick={isFeedback ? undefined : handlePick}
            />

            {isFeedback && result && chosen && (
              <Feedback
                T={T}
                result={result}
                chosen={chosen}
                correctMistake={current.correctMistake}
                title={current.title}
                explanation={current.explanation}
                lesson={current.lessons[difficulty]}
                category={current.category}
                difficulty={difficulty}
                difficultyMeta={G.DIFFICULTY_META}
                categoryMeta={G.CATEGORY_META}
                mistakeLabels={G.MISTAKE_LABELS}
                onNext={handleNext}
                isLast={idx + 1 >= ROUNDS_PER_SESSION}
              />
            )}

            {/* Contexte */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <InfoTile label={T.htf}        value={BIAS_LABEL[current.htfBias]}       valueClass={biasClass(current.htfBias)} />
              <InfoTile label={T.macro}      value={MACRO_LABEL[current.macroContext]} valueClass={current.macroContext === "dangereux" ? "text-red-300" : ""} />
              <InfoTile label={T.volatility} value={cap(translateVolatility(current.volatility, locale))} valueClass="" />
            </div>
          </div>
        </section>
      </div>

      {/* Stats */}
      <section className="mx-auto grid w-full max-w-3xl grid-cols-2 gap-2 sm:gap-3">
        <StatTile label={T.correct} value={`${stats.correct}/${stats.correct + stats.incorrect}`} />
        <StatTile label={T.score} value={`${score >= 0 ? "+" : ""}${score}`} />
      </section>
    </main>
  );
}

// ─── Élément marqué sur le graphique au verdict ──────────────────────────────
// L'erreur principale est montrée là où elle se voit : la ligne fautive (stop,
// TP), la zone mal lue, ou le point d'entrée pour les erreurs de contexte.

function mistakeMark(mistake: MistakeId, chart: ScenarioChart, label: string): GameChartMark | undefined {
  const entry = chart.entry ?? chart.past[chart.past.length - 1]?.c;
  const zoneIdx = (kinds: string[]) => chart.zones.findIndex((z) => kinds.includes(z.kind));
  switch (mistake) {
    case "stop_too_tight":
    case "stop_in_liquidity":
    case "volatility_ignored":
      if (chart.stop !== undefined) return { kind: "line", price: chart.stop, label };
      break;
    case "bad_rr":
      if (chart.tp !== undefined) return { kind: "line", price: chart.tp, label };
      break;
    case "buy_in_resistance": {
      const i = zoneIdx(["resistance"]); if (i >= 0) return { kind: "zone", index: i, label };
      break;
    }
    case "sell_in_support": {
      const i = zoneIdx(["support"]); if (i >= 0) return { kind: "zone", index: i, label };
      break;
    }
    case "sweep_ignored": {
      const i = zoneIdx(["liquidity_low"]); if (i >= 0) return { kind: "zone", index: i, label };
      break;
    }
    case "mitigation_misread": {
      const i = zoneIdx(["fvg"]); if (i >= 0) return { kind: "zone", index: i, label };
      break;
    }
  }
  return entry !== undefined ? { kind: "point", price: entry, label } : undefined;
}

// ─── Difficulty picker ────────────────────────────────────────────────────────

function DifficultyPicker({ onPick, difficultyMeta, locale }: { onPick: (d: Difficulty) => void; difficultyMeta: typeof FrGame.DIFFICULTY_META; locale: string | undefined }) {
  return (
    <main className="v2-page mx-auto flex w-full max-w-xl flex-col">
      <Link href="/jeux" className="v2-link-back">
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path d="M11 6.5H2M5 3.5l-3 3 3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {locale === "es" ? "Juegos" : locale === "en" ? "Games" : "Jeux"}
      </Link>

      <div className="v2-gap-s flex flex-col">
        <p className="v2-eyebrow">{locale === "es" ? "Encuentra el error" : locale === "en" ? "Find the mistake" : "Trouve l'erreur"}</p>
        <h1 className="v2-display v2-h2 font-bold">{locale === "es" ? "Elige tu nivel" : locale === "en" ? "Choose your level" : "Choisis ton niveau"}</h1>
        <p className="v2-lead text-[color:var(--v2-text-2)]">
          {locale === "es"
            ? `${ROUNDS_PER_SESSION} escenarios. Para cada uno, ves un setup o un trade, e identificas el error principal entre 4 opciones. El objetivo: desarrollar tu ojo para los errores retail clásicos.`
            : locale === "en"
            ? `${ROUNDS_PER_SESSION} scenarios. For each one, you see a setup or a trade, and you identify the main mistake among 4 choices. The goal: train your eye for classic retail mistakes.`
            : `${ROUNDS_PER_SESSION} scénarios. Pour chacun, tu vois un setup ou un trade, et tu identifies l'erreur principale parmi 4 choix. Le but : développer ton œil pour les erreurs retail classiques.`}
        </p>
        <GeneralCasesNote />
      </div>

      <div className="flex flex-col gap-3">
        {DIFFICULTIES.map((d) => {
          const meta = difficultyMeta[d];
          return (
            <button
              key={d}
              onClick={() => onPick(d)}
              className="v2-card group px-5 py-4 text-left transition-transform duration-200 hover:-translate-y-0.5"
            >
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className={`h-2 w-2 rounded-full ${meta.dotClass}`} />
                  <span className={`v2-display text-[18px] font-bold ${meta.textClass}`}>{meta.label}</span>
                </div>
                <svg width="16" height="16" viewBox="0 0 14 14" fill="none" className="text-[color:var(--v2-text-3)] transition-colors group-hover:text-[color:var(--v2-text)]">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="v2-body text-[color:var(--v2-text-2)]">{meta.description}</p>
            </button>
          );
        })}
      </div>
    </main>
  );
}

// ─── Choix d'erreur ──────────────────────────────────────────────────────────

function MistakeChoices({
  choices, labels, picked, correct, onPick,
}: {
  choices: MistakeId[];
  labels: typeof FrGame.MISTAKE_LABELS;
  picked: MistakeId | null;
  correct: MistakeId | null;
  onPick?: (id: MistakeId) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3">
      {choices.map((id) => {
        const state = picked ? (picked === id ? "picked" : "faded") : undefined;
        const res = correct ? (id === correct ? "good" : id === picked ? "bad" : undefined) : undefined;
        return (
          <button
            key={id}
            type="button"
            data-choice={id}
            onClick={onPick ? () => onPick(id) : undefined}
            disabled={!onPick}
            aria-pressed={picked === id}
            data-state={state}
            data-result={res}
            className={`v2-mistake-choice ${onPick ? "cursor-pointer" : "cursor-default"}`}
          >
            {labels[id]}
          </button>
        );
      })}
    </div>
  );
}

// ─── Feedback panel ──────────────────────────────────────────────────────────
// Le verdict est affiché sur le graphique (bandeau + erreur marquée) ; la carte
// détaille l'explication, la leçon et l'accès au scénario suivant.

interface FeedbackProps {
  T:              { [k: string]: string };
  result:         MistakeScoreResult;
  chosen:         MistakeId;
  correctMistake: MistakeId;
  title:          string;
  explanation:    string;
  lesson:         string;
  category:       keyof typeof FrGame.CATEGORY_META;
  difficulty:     Difficulty;
  difficultyMeta: typeof FrGame.DIFFICULTY_META;
  categoryMeta:   typeof FrGame.CATEGORY_META;
  mistakeLabels:  typeof FrGame.MISTAKE_LABELS;
  onNext:         () => void;
  isLast:         boolean;
}

function Feedback({
  T, result, chosen, correctMistake, title, explanation, lesson, category, difficulty,
  difficultyMeta, categoryMeta, mistakeLabels, onNext, isLast,
}: FeedbackProps) {
  const catMeta = categoryMeta[category];
  return (
    <div className="v2-well v2-gap-s flex flex-col p-4 sm:p-5">
      <p className="v2-eyebrow" style={{ color: result.correct ? "#34d399" : "#f87171" }}>{title}</p>

      <div className="flex flex-col gap-1">
        <p className="v2-display text-[14px] font-bold text-emerald-300">
          {mistakeLabels[correctMistake]} <span className="font-medium text-[color:var(--v2-text-2)]">{T.correctAnswerTag}</span>
        </p>
        {!result.correct && (
          <p className="v2-display text-[14px] font-bold text-red-300">
            {mistakeLabels[chosen]} <span className="font-medium text-[color:var(--v2-text-2)]">· {T.yourChoice}</span>
          </p>
        )}
        <p className="v2-body mt-1 text-[color:var(--v2-text)]">{explanation}</p>
      </div>

      {/* Leçon */}
      <div className="v2-well--amber rounded-[14px] px-4 py-3">
        <p className="text-[12px] font-bold uppercase tracking-wider text-amber-300">
          {T.lesson} · {difficultyMeta[difficulty].label}
        </p>
        <p className="v2-body mt-1 text-[color:var(--v2-text)]">{lesson}</p>
      </div>

      <GeneralCasesNote />

      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${catMeta.dotClass}`} />
          <span className={`text-[12px] font-medium ${catMeta.textClass}`}>{catMeta.label}</span>
        </div>
        <button onClick={onNext} className="v2-btn">
          {isLast ? T.viewSummary : T.next}
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M2 6.5h9M8 3.5l3 3-3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function InfoTile({ label, value, valueClass }: { label: string; value: string; valueClass: string }) {
  return (
    <div className="v2-well flex flex-col gap-0.5 px-3 py-2.5 sm:px-4">
      <span className="text-[12px] font-semibold uppercase tracking-wider text-[color:var(--v2-text-3)]">{label}</span>
      <span className={`v2-display v2-tile-value truncate font-bold ${valueClass}`}>{value}</span>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="v2-well px-3 py-2.5">
      <p className="mb-1 truncate text-[12px] font-semibold uppercase tracking-wide text-[color:var(--v2-text-3)]">{label}</p>
      <p className="v2-mono text-[16px] font-bold text-[color:var(--v2-text)]">{value}</p>
    </div>
  );
}

function VolBadge({ volatility, T }: { volatility: "faible" | "normale" | "élevée"; T: { [k: string]: string } }) {
  const label = volatility === "élevée" ? T.volHigh : volatility === "faible" ? T.volLow : T.volNormal;
  return <span className={`v2-chip ${volatility === "élevée" ? "v2-chip--amber" : ""}`}>{T.vol} {label}</span>;
}

function SpreadBadge({ spread, T }: { spread: "faible" | "élevé"; T: { [k: string]: string } }) {
  const label = spread === "élevé" ? T.spreadHigh : T.spreadLow;
  return <span className={`v2-chip ${spread === "élevé" ? "v2-chip--amber" : ""}`}>{T.spread} {label}</span>;
}

function translateVolatility(v: "faible" | "normale" | "élevée", locale: string | undefined): string {
  if (locale === "es") return v === "élevée" ? "alta" : v === "faible" ? "baja" : "normal";
  if (locale === "en") return v === "élevée" ? "high" : v === "faible" ? "low" : "normal";
  return v;
}

function DifficultyChip({ difficulty, difficultyMeta }: { difficulty: Difficulty; difficultyMeta: typeof FrGame.DIFFICULTY_META }) {
  const meta = difficultyMeta[difficulty];
  return (
    <div className="flex items-center gap-1.5">
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClass}`} />
      <span className={`text-[12px] font-bold uppercase tracking-wide ${meta.textClass}`}>{meta.label}</span>
    </div>
  );
}

function biasClass(b: "bullish" | "bearish" | "range"): string {
  return b === "bullish" ? "text-emerald-300"
       : b === "bearish" ? "text-red-300"
       :                   "";
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ─── Summary ─────────────────────────────────────────────────────────────────

function Summary({
  T, difficulty, difficultyMeta, sessionVerdictFn, score, maxStreak, stats, onReplay, onChangeDifficulty,
}: {
  T: { [k: string]: string };
  difficulty:       Difficulty;
  difficultyMeta:   typeof FrGame.DIFFICULTY_META;
  sessionVerdictFn: typeof FrGame.sessionVerdict;
  score: number;
  maxStreak: number;
  stats: SessionStats;
  onReplay: () => void;
  onChangeDifficulty: () => void;
}) {
  const total = stats.correct + stats.incorrect;
  const accuracy = total > 0 ? Math.round((stats.correct / total) * 100) : 0;
  const verdict = sessionVerdictFn(score, stats.correct, total);
  const verdictColor =
    score >= 700 ? "text-emerald-300"
  : score >= 0   ? "text-amber-300"
  :                "text-red-300";
  const meta = difficultyMeta[difficulty];

  return (
    <main className="v2-page mx-auto flex w-full max-w-3xl flex-col">
      <Link href="/jeux" className="v2-link-back">
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path d="M11 6.5H2M5 3.5l-3 3 3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {T.games}
      </Link>

      <div className="v2-gap-s flex flex-col">
        <p className="v2-eyebrow">
          {T.summary} · <span className={meta.textClass}>{meta.label}</span>
        </p>
        <h1 className="v2-display v2-h2 font-bold">{ROUNDS_PER_SESSION} {T.scenariosPlayed}</h1>
        <p className={`v2-display text-[18px] font-bold ${verdictColor}`}>{verdict}</p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        <BigStat label={T.score}          value={`${score >= 0 ? "+" : ""}${score}`}       valueClass={score < 0 ? "text-red-400" : "text-emerald-400"} />
        <BigStat label={T.precision}      value={`${accuracy}%`}                             valueClass="text-[color:var(--v2-text)]" />
        <BigStat label={T.correctAnswers} value={`${stats.correct}/${ROUNDS_PER_SESSION}`}  valueClass="text-emerald-400" />
        <BigStat label={T.bestStreak}     value={`${maxStreak}`}                             valueClass="text-amber-300" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button onClick={onReplay} className="v2-btn v2-btn--light flex-1">
          {T.replayIn} {meta.label.toLowerCase()}
        </button>
        <button onClick={onChangeDifficulty} className="v2-btn flex-1">
          {T.changeLevel}
        </button>
      </div>
    </main>
  );
}

function BigStat({ label, value, valueClass }: { label: string; value: string; valueClass: string }) {
  return (
    <div className="v2-well px-4 py-3">
      <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-[color:var(--v2-text-3)]">{label}</p>
      <p className={`v2-mono v2-num-l font-bold ${valueClass}`}>{value}</p>
    </div>
  );
}
