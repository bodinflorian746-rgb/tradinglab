"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import * as FrGame from "@/lib/games/buy-sell-no-trade";
import * as EsGame from "@/lib/games/buy-sell-no-trade-es";
import * as EnGame from "@/lib/games/buy-sell-no-trade-en";
import {
  scoreChoice,
  ROUNDS_PER_SESSION,
  type BuySellChart,
  type Difficulty,
  type GameChoice,
  type Metric,
  type ScenarioInstance,
} from "@/lib/games/buy-sell-no-trade";
import { GameChartV2, V2_REVEAL_DELAY_MS } from "@/app/components/games/v2/GameChartV2";
import { ChoiceRow, StepBadge, VerdictOverlay, type ChoiceOption, GeneralCasesNote } from "@/app/components/games/v2/ui";
import { logGameEvent, type SkillId } from "@/lib/trader-profile";
import { sessionLabel } from "@/lib/games/shared";

const METRIC_TO_SKILL: Record<Metric, SkillId> = {
  discipline: "discipline",
  lecture:    "lecture_marche",
  piege:      "liquidite",
};

// ─── Constantes ───────────────────────────────────────────────────────────────

const METRIC_LABELS_FR: Record<Metric, string> = {
  discipline: "Discipline",
  lecture:    "Lecture marché",
  piege:      "Détection piège",
};
const METRIC_LABELS_ES: Record<Metric, string> = {
  discipline: "Disciplina",
  lecture:    "Lectura del mercado",
  piege:      "Detección de trampa",
};
const METRIC_LABELS_EN: Record<Metric, string> = {
  discipline: "Discipline",
  lecture:    "Market reading",
  piege:      "Trap detection",
};

const METRIC_DOT: Record<Metric, string> = {
  discipline: "bg-blue-400",
  lecture:    "bg-emerald-400",
  piege:      "bg-amber-400",
};

const BIAS_LABEL_FR = { bullish: "Haussier", bearish: "Baissier", range: "Range" } as const;
const BIAS_LABEL_ES = { bullish: "Alcista", bearish: "Bajista", range: "Range" } as const;
const BIAS_LABEL_EN = { bullish: "Bullish", bearish: "Bearish", range: "Range" } as const;
const MACRO_LABEL_FR = { normal: "Normal", dangereux: "Dangereux" } as const;
const MACRO_LABEL_ES = { normal: "Normal", dangereux: "Peligroso" } as const;
const MACRO_LABEL_EN = { normal: "Normal", dangereux: "Dangerous" } as const;

const DIFFICULTIES: Difficulty[] = ["beginner", "intermediate", "advanced"];

// Charte v2 : une bougie future révélée toutes les 420ms (rythme du design-lab)
const REVEAL_STEP_MS = 420;

const CHOICE_OPTIONS: ChoiceOption<GameChoice>[] = [
  { value: "BUY",      label: "BUY",      variant: "buy"  },
  { value: "SELL",     label: "SELL",     variant: "sell" },
  { value: "NO_TRADE", label: "NO TRADE", variant: "none" },
];
const CHOICE_TINT: Record<GameChoice, string> = { BUY: "#10b981", SELL: "#ef4444", NO_TRADE: "#e4e4e7" };
const CHOICE_LABEL: Record<GameChoice, string> = { BUY: "BUY", SELL: "SELL", NO_TRADE: "NO TRADE" };

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BuySellNoTradePage() {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale;
  const G = locale === "es" ? EsGame : locale === "en" ? EnGame : FrGame;
  const METRIC_LABELS = locale === "es" ? METRIC_LABELS_ES : locale === "en" ? METRIC_LABELS_EN : METRIC_LABELS_FR;
  const BIAS_LABEL = locale === "es" ? BIAS_LABEL_ES : locale === "en" ? BIAS_LABEL_EN : BIAS_LABEL_FR;
  const MACRO_LABEL = locale === "es" ? MACRO_LABEL_ES : locale === "en" ? MACRO_LABEL_EN : MACRO_LABEL_FR;
  const T = locale === "es"
    ? {
        games:           "Juegos",
        round:           "Ronda",
        score:           "Puntuación",
        ofStreak:        "de racha",
        skills:          "Habilidades",
        loading:         "Cargando…",
        newsWarning:     "Noticia macro mayor en menos de 30 min, volatilidad y spread imprevisibles.",
        htf:             "HTF",
        macro:           "Macro",
        volatility:      "Volatilidad",
        revelation:      "Revelación",
        revealText:      "Veamos lo que pasó después de tu decisión…",
        viewSummary:     "Ver el resumen",
        nextScenario:    "Siguiente escenario",
        lesson:          "Lección",
        correctAnswer:   "· respuesta correcta",
        yourChoice:      "· tu elección",
        chooseLevel:     "Elige tu nivel",
        pickerIntro:     "escenarios para analizar. El nivel modula la sutileza de las señales, la frecuencia de las trampas y la profundidad de las explicaciones.",
        title:           "BUY / SELL / NO TRADE",
        summary:         "Resumen",
        scenariosPlayed: "escenarios jugados",
        traderDisciplined: "Trader disciplinado",
        goodEye:         "Buen ojo",
        toPolish:        "Por pulir",
        lackPatience:    "Falta de paciencia",
        precision:       "Precisión",
        correctAnswers:  "Respuestas correctas",
        bestStreak:      "Mejor racha",
        replayIn:        "Volver a jugar en",
        changeLevel:     "Cambiar de nivel",
        disciplinePerfect: "Disciplina perfecta",
        goodRead:        "Buena lectura",
        trapAvoided:     "¿Trampa evitada? No.",
        wrongRead:       "Lectura incorrecta",
        vol:             "Vol.",
        spread:          "Spread",
        spreadLow:       "bajo",
        spreadHigh:      "alto",
        volLow:          "baja",
        volNormal:       "normal",
        volHigh:         "alta",
        stepQuestion:    "Pregunta",
        stepChoice:      "Elección hecha",
        stepVerdict:     "Veredicto",
      }
    : locale === "en"
    ? {
        games:           "Games",
        round:           "Round",
        score:           "Score",
        ofStreak:        "streak",
        skills:          "Skills",
        loading:         "Loading…",
        newsWarning:     "Major macro news in < 30 min, unpredictable volatility and spread.",
        htf:             "HTF",
        macro:           "Macro",
        volatility:      "Volatility",
        revelation:      "Reveal",
        revealText:      "Let's see what happened after your decision…",
        viewSummary:     "View summary",
        nextScenario:    "Next scenario",
        lesson:          "Lesson",
        correctAnswer:   "· correct answer",
        yourChoice:      "· your choice",
        chooseLevel:     "Choose your level",
        pickerIntro:     "scenarios to analyze. The level adjusts the subtlety of the signals, the frequency of traps and the depth of the explanations.",
        title:           "BUY / SELL / NO TRADE",
        summary:         "Summary",
        scenariosPlayed: "scenarios played",
        traderDisciplined: "Disciplined trader",
        goodEye:         "Good eye",
        toPolish:        "To polish",
        lackPatience:    "Lack of patience",
        precision:       "Accuracy",
        correctAnswers:  "Correct answers",
        bestStreak:      "Best streak",
        replayIn:        "Replay in",
        changeLevel:     "Change level",
        disciplinePerfect: "Perfect discipline",
        goodRead:        "Good read",
        trapAvoided:     "Trap avoided? No.",
        wrongRead:       "Wrong read",
        vol:             "Vol.",
        spread:          "Spread",
        spreadLow:       "low",
        spreadHigh:      "high",
        volLow:          "low",
        volNormal:       "normal",
        volHigh:         "high",
        stepQuestion:    "Question",
        stepChoice:      "Choice made",
        stepVerdict:     "Verdict",
      }
    : {
        games:           "Jeux",
        round:           "Round",
        score:           "Score",
        ofStreak:        "de série",
        skills:          "Compétences",
        loading:         "Chargement…",
        newsWarning:     "News macro majeure dans < 30 min, volatilité et spread imprévisibles.",
        htf:             "HTF",
        macro:           "Macro",
        volatility:      "Volatilité",
        revelation:      "Révélation",
        revealText:      "On regarde ce qui s'est passé après ta décision…",
        viewSummary:     "Voir le bilan",
        nextScenario:    "Scénario suivant",
        lesson:          "Leçon",
        correctAnswer:   "· bonne réponse",
        yourChoice:      "· ton choix",
        chooseLevel:     "Choisis ton niveau",
        pickerIntro:     "scénarios à analyser. Le niveau module la subtilité des signaux, la fréquence des pièges et la profondeur des explications.",
        title:           "BUY / SELL / NO TRADE",
        summary:         "Bilan",
        scenariosPlayed: "scénarios joués",
        traderDisciplined: "Trader discipliné",
        goodEye:         "Bon œil",
        toPolish:        "À polir",
        lackPatience:    "Manque de patience",
        precision:       "Précision",
        correctAnswers:  "Bonnes réponses",
        bestStreak:      "Meilleure série",
        replayIn:        "Rejouer en",
        changeLevel:     "Changer de niveau",
        disciplinePerfect: "Discipline parfaite",
        goodRead:        "Bonne lecture",
        trapAvoided:     "Piège évité ? Non.",
        wrongRead:       "Pas la bonne lecture",
        vol:             "Vol.",
        spread:          "Spread",
        spreadLow:       "faible",
        spreadHigh:      "élevé",
        volLow:          "faible",
        volNormal:       "normale",
        volHigh:         "élevée",
        stepQuestion:    "Question",
        stepChoice:      "Choix fait",
        stepVerdict:     "Verdict",
      };
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [seed, setSeed] = useState<number | null>(null);
  const [scenarios, setScenarios] = useState<ScenarioInstance[]>([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [stats, setStats] = useState<Record<Metric, { ok: number; total: number }>>({
    discipline: { ok: 0, total: 0 },
    lecture:    { ok: 0, total: 0 },
    piege:      { ok: 0, total: 0 },
  });
  const [chosen, setChosen] = useState<GameChoice | null>(null);
  const [phase, setPhase] = useState<"placing" | "revealing" | "feedback">("placing");
  const [revealed, setRevealed] = useState(0);
  const [lastPoints, setLastPoints] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const animRef = useRef<NodeJS.Timeout | null>(null);

  const current = scenarios[idx];
  const chart: BuySellChart | null = useMemo(
    () => (current && difficulty ? G.withAssetPrices(G.buildChart(current.id, current.seed, current.volatility, difficulty, { asset: current.asset, session: current.session }), current) : null),
    [current, difficulty, G],
  );

  // Quand on change de scenario, reset reveal/phase
  useEffect(() => {
    setPhase("placing");
    setRevealed(0);
    setChosen(null);
    setLastPoints(0);
    if (animRef.current) { clearTimeout(animRef.current); animRef.current = null; }
  }, [idx, difficulty]);

  // Animation reveal après le choix : le graphique glisse d'abord vers son
  // cadrage « passé + futur » (V2_REVEAL_DELAY_MS), puis une bougie toutes les 420ms.
  useEffect(() => {
    if (phase !== "revealing" || !chart || !current) return;
    if (revealed >= chart.future.length) {
      animRef.current = setTimeout(() => setPhase("feedback"), 300);
    } else {
      const glide = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : V2_REVEAL_DELAY_MS;
      animRef.current = setTimeout(() => setRevealed((c) => c + 1), revealed === 0 ? glide : REVEAL_STEP_MS);
    }
    return () => { if (animRef.current) clearTimeout(animRef.current); };
  }, [phase, revealed, chart, current]);

  // ─── Écran 1 : sélection difficulté ─────────────────────────────────────────
  if (!difficulty || !seed) {
    return <DifficultyPicker locale={locale} difficultyMeta={G.DIFFICULTY_META} onPick={(d) => {
      const s = Math.floor(Math.random() * 1e9) >>> 0;
      setDifficulty(d);
      setSeed(s);
      setScenarios(G.generateScenarios(s, d));
    }} />;
  }

  // ─── Écran 3 : bilan final ──────────────────────────────────────────────────
  if (showSummary) {
    return (
      <Summary
        T={T}
        METRIC_LABELS={METRIC_LABELS}
        difficulty={difficulty}
        score={score}
        maxStreak={maxStreak}
        correctCount={correctCount}
        stats={stats}
        difficultyMeta={G.DIFFICULTY_META}
        onReplay={() => {
          const s = Math.floor(Math.random() * 1e9) >>> 0;
          setSeed(s);
          setScenarios(G.generateScenarios(s, difficulty));
          setIdx(0);
          setScore(0);
          setStreak(0);
          setMaxStreak(0);
          setCorrectCount(0);
          setStats({
            discipline: { ok: 0, total: 0 },
            lecture:    { ok: 0, total: 0 },
            piege:      { ok: 0, total: 0 },
          });
          setShowSummary(false);
        }}
        onChangeDifficulty={() => {
          setDifficulty(null);
          setSeed(null);
          setIdx(0);
          setScore(0);
          setStreak(0);
          setMaxStreak(0);
          setCorrectCount(0);
          setStats({
            discipline: { ok: 0, total: 0 },
            lecture:    { ok: 0, total: 0 },
            piege:      { ok: 0, total: 0 },
          });
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

  const handleChoice = (c: GameChoice) => {
    if (phase !== "placing") return;
    const r = scoreChoice(c, current.correctAnswer, streak);
    logGameEvent({
      game:       "buy-sell-no-trade",
      difficulty,
      skill:      METRIC_TO_SKILL[current.metric],
      outcome:    r.correct ? "win" : "loss",
    });
    setChosen(c);
    setLastPoints(r.points);
    setScore((s) => s + r.points);
    setStats((s) => ({
      ...s,
      [current.metric]: {
        ok:    s[current.metric].ok + (r.correct ? 1 : 0),
        total: s[current.metric].total + 1,
      },
    }));
    if (r.correct) {
      const ns = streak + 1;
      setStreak(ns);
      setMaxStreak((m) => Math.max(m, ns));
      setCorrectCount((c) => c + 1);
    } else {
      setStreak(0);
    }
    setPhase("revealing");
    setRevealed(0); // la 1re bougie future arrive après le glissement du graphique
  };

  const handleNext = () => {
    if (idx + 1 >= ROUNDS_PER_SESSION) {
      setShowSummary(true);
    } else {
      setIdx(idx + 1);
    }
  };

  const isPlacing = phase === "placing";
  const isRevealing = phase === "revealing";
  const isFeedback = phase === "feedback";
  const zones = maskZonesForDifficulty(chart.zones, difficulty, locale);
  const correct = chosen !== null && chosen === current.correctAnswer;
  const headline = correct
    ? current.correctAnswer === "NO_TRADE" ? T.disciplinePerfect : T.goodRead
    : current.correctAnswer === "NO_TRADE" ? T.trapAvoided : T.wrongRead;
  const step = isPlacing ? 1 : isRevealing ? 2 : 3;
  const stepLabel = isPlacing ? T.stepQuestion : isRevealing ? T.stepChoice : T.stepVerdict;

  return (
    <main className="v2-page mx-auto flex w-full max-w-[880px] flex-col">
      <div className="flex flex-col gap-3">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
          <Link href="/jeux" className="v2-link-back">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M11 6.5H2M5 3.5l-3 3 3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {T.games}
          </Link>
          <div className="ml-auto flex items-center gap-3 text-[12px]">
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
        </div>

        {/* Scénario */}
        <section className="v2-card v2-pad v2-gap flex flex-col" aria-labelledby="bsnt-title">
          <h2 id="bsnt-title" className="v2-display v2-h2 mx-auto w-full max-w-3xl font-bold">
            BUY <span className="text-[color:var(--v2-text-3)]">/</span>{" "}
            <span className="text-red-400">SELL</span> <span className="text-[color:var(--v2-text-3)]">/</span>{" "}
            <span className="whitespace-nowrap bg-[linear-gradient(90deg,#f4f4f5,#a1a1aa)] bg-clip-text text-transparent">NO TRADE</span>
          </h2>

          <div className="v2-gap-s mx-auto flex w-full max-w-3xl flex-col">
            <StepBadge n={step} label={stepLabel} />

            <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
              <span className="v2-display v2-asset mr-1 font-bold">{current.asset}</span>
              <span className="v2-chip">{sessionLabel(current.session, locale)}</span>
              <VolBadge volatility={current.volatility} T={T} />
              <SpreadBadge spread={current.spread} T={T} />
            </div>

            {/* News warning */}
            {current.macroContext === "dangereux" && (
              <div className="v2-well v2-well--danger flex items-start gap-2.5 px-3.5 py-3">
                <svg width="16" height="16" viewBox="0 0 14 14" fill="none" className="mt-0.5 shrink-0">
                  <path d="M7 1L13 12H1L7 1z" stroke="#f87171" strokeWidth="1.4" strokeLinejoin="round" />
                  <path d="M7 5.5v3M7 10v0.5" stroke="#f87171" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
                <p className="text-[13px] font-semibold leading-snug text-red-300">{T.newsWarning}</p>
              </div>
            )}

            {/* Graphique : passé, puis futur révélé bougie par bougie, puis verdict */}
            {/* Chaque zone est nommée sur le graphique (étiquette posée sur la zone) */}
            <GameChartV2
              data={{ candles: [...chart.past, ...chart.future], zones, domain: chart.domain }}
              inlineLabels
              overlay={{
                separatorIndex:     chart.past.length,
                visibleFutureCount: isPlacing ? 0 : revealed,
              }}
              mode={isPlacing ? "question" : isRevealing ? "reveal" : "verdict"}
              pin={chosen ? { label: CHOICE_LABEL[chosen], sub: T.yourChoice, color: CHOICE_TINT[chosen] } : undefined}
            >
              {isFeedback && chosen && (
                <VerdictOverlay
                  state={correct ? "good" : "bad"}
                  headline={headline}
                  points={lastPoints}
                  max={10}
                />
              )}
            </GameChartV2>

            {/* Context infos — en avancé, on cache la volatilité pour forcer la
                lecture du chart (mais on garde la news warning visible). */}
            <div className={`grid gap-2 sm:gap-3 ${difficulty === "advanced" ? "grid-cols-2" : "grid-cols-3"}`}>
              <InfoTile label={T.htf}   value={BIAS_LABEL[current.htfBias]}       valueClass={biasClass(current.htfBias)} />
              <InfoTile label={T.macro} value={MACRO_LABEL[current.macroContext]} valueClass={current.macroContext === "dangereux" ? "text-red-300" : ""} />
              {difficulty !== "advanced" && (
                <InfoTile label={T.volatility} value={cap(translateVolatility(current.volatility, locale))} valueClass="" />
              )}
            </div>

            {/* Context text — raccourci en intermédiaire/avancé pour réduire les
                aides texte (le joueur doit lire le marché lui-même). */}
            <p className="v2-lead text-[color:var(--v2-text-2)]">
              {difficulty === "beginner" ? current.context : (current.shortContext ?? firstSentence(current.context))}
            </p>

            {/* Décision : interactive, puis figée (le choix reste visible) */}
            {isPlacing
              ? <ChoiceRow options={CHOICE_OPTIONS} onPick={handleChoice} />
              : <ChoiceRow options={CHOICE_OPTIONS} picked={chosen} />}

            {isRevealing && (
              <div className="v2-well px-4 py-3 text-center">
                <p className="v2-eyebrow">{T.revelation}</p>
                <p className="v2-lead mt-1 text-[color:var(--v2-text)]">{T.revealText}</p>
              </div>
            )}

            {isFeedback && chosen && (
              <Feedback
                T={T}
                METRIC_LABELS={METRIC_LABELS}
                choice={chosen}
                correctAnswer={current.correctAnswer}
                rationales={current.rationales}
                lesson={current.lessons[difficulty]}
                difficulty={difficulty}
                difficultyMeta={G.DIFFICULTY_META}
                title={current.title}
                metric={current.metric}
                onNext={handleNext}
                isLast={idx + 1 >= ROUNDS_PER_SESSION}
              />
            )}
          </div>
        </section>
      </div>

      {/* Stats footer */}
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-3">
        <p className="v2-eyebrow" style={{ color: "var(--v2-text-3)" }}>{T.skills}</p>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {(["discipline", "lecture", "piege"] as Metric[]).map((m) => (
            <StatTile key={m} metric={m} METRIC_LABELS={METRIC_LABELS} ok={stats[m].ok} total={stats[m].total} />
          ))}
        </div>
      </section>
    </main>
  );
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
        <p className="v2-eyebrow">BUY / SELL / NO TRADE</p>
        <h1 className="v2-display v2-h2 font-bold">{locale === "es" ? "Elige tu nivel" : locale === "en" ? "Choose your level" : "Choisis ton niveau"}</h1>
        <p className="v2-lead text-[color:var(--v2-text-2)]">
          {locale === "es"
            ? `${ROUNDS_PER_SESSION} escenarios para analizar. El nivel modula la sutileza de las señales, la frecuencia de las trampas y la profundidad de las explicaciones.`
            : locale === "en"
            ? `${ROUNDS_PER_SESSION} scenarios to analyze. The level adjusts the subtlety of the signals, the frequency of traps and the depth of the explanations.`
            : `${ROUNDS_PER_SESSION} scénarios à analyser. Le niveau module la subtilité des signaux, la fréquence des pièges et la profondeur des explications.`}
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

// ─── Sub-components ───────────────────────────────────────────────────────────

interface FeedbackProps {
  T:              { [k: string]: string };
  METRIC_LABELS:  Record<Metric, string>;
  choice:         GameChoice;
  correctAnswer:  GameChoice;
  rationales:     { BUY: string; SELL: string; NO_TRADE: string };
  lesson:         string;
  difficulty:     Difficulty;
  difficultyMeta: typeof FrGame.DIFFICULTY_META;
  title:          string;
  metric:         Metric;
  onNext:         () => void;
  isLast:         boolean;
}

// Le verdict (titre + points) est affiché en grand sur le graphique ; la carte
// détaille les rationales, la leçon et l'accès au scénario suivant.
function Feedback({ T, METRIC_LABELS, choice, correctAnswer, rationales, lesson, difficulty, difficultyMeta, title, metric, onNext, isLast }: FeedbackProps) {
  const correct = choice === correctAnswer;
  return (
    <div className="v2-well v2-gap-s flex flex-col p-4 sm:p-5">
      <p className="v2-eyebrow" style={{ color: correct ? "#34d399" : "#f87171" }}>{title}</p>

      {/* Rationales : 3 lignes, une par choix */}
      <div className="flex flex-col gap-2">
        {(["BUY", "SELL", "NO_TRADE"] as GameChoice[]).map((c) => (
          <RationaleRow
            key={c}
            T={T}
            label={CHOICE_LABEL[c]}
            text={rationales[c]}
            isCorrect={correctAnswer === c}
            isChosen={choice === c}
          />
        ))}
      </div>

      {/* Lesson (adapté au niveau) */}
      <div className="v2-well--amber rounded-[14px] px-4 py-3">
        <p className="text-[12px] font-bold uppercase tracking-wider text-amber-300">
          {T.lesson} · {difficultyMeta[difficulty].label}
        </p>
        <p className="v2-body mt-1 text-[color:var(--v2-text)]">{lesson}</p>
      </div>

      <GeneralCasesNote />

      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${METRIC_DOT[metric]}`} />
          <span className="text-[12px] font-medium text-[color:var(--v2-text-3)]">{METRIC_LABELS[metric]}</span>
        </div>
        <button onClick={onNext} className="v2-btn">
          {isLast ? T.viewSummary : T.nextScenario}
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M2 6.5h9M8 3.5l3 3-3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function RationaleRow({ T, label, text, isCorrect, isChosen }: { T: { [k: string]: string }; label: string; text: string; isCorrect: boolean; isChosen: boolean }) {
  // Bonne réponse → cadre emerald ; choix erroné → cadre rouge ; sinon neutre
  const frame = isCorrect ? "v2-well--good" : isChosen ? "v2-well--bad" : "";
  const labelColor = isCorrect ? "text-emerald-300" : isChosen ? "text-red-300" : "text-[color:var(--v2-text-3)]";
  return (
    <div className={`v2-well ${frame} px-3.5 py-3`}>
      <p className={`v2-display text-[14px] font-bold ${labelColor}`}>
        {label}
        {isCorrect && <span className="ml-1.5 font-medium text-[color:var(--v2-text-2)]">{T.correctAnswer}</span>}
        {isChosen && <span className="ml-1.5 font-medium text-[color:var(--v2-text-2)]">{T.yourChoice}</span>}
      </p>
      <p className="v2-body mt-1 text-[color:var(--v2-text)]">{text}</p>
    </div>
  );
}

function InfoTile({ label, value, valueClass }: { label: string; value: string; valueClass: string }) {
  return (
    <div className="v2-well flex flex-col gap-0.5 px-3 py-2.5 sm:px-4">
      <span className="text-[12px] font-semibold uppercase tracking-wider text-[color:var(--v2-text-3)]">{label}</span>
      <span className={`v2-display v2-tile-value truncate font-bold ${valueClass}`}>{value}</span>
    </div>
  );
}

function StatTile({ metric, ok, total, METRIC_LABELS }: { metric: Metric; ok: number; total: number; METRIC_LABELS: Record<Metric, string> }) {
  const pct = total > 0 ? Math.round((ok / total) * 100) : 0;
  return (
    <div className="v2-well px-2.5 py-2.5 sm:px-3">
      {/* Libellé sur 2 lignes max à 390 px : le point suit le texte au lieu d'occuper une colonne */}
      <p className="mb-1 min-h-[2lh] text-[11px] font-semibold uppercase leading-tight tracking-normal text-[color:var(--v2-text-3)] [overflow-wrap:anywhere] sm:min-h-0 sm:text-[12px] sm:tracking-wide">
        <span className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle ${METRIC_DOT[metric]}`} />
        {METRIC_LABELS[metric]}
      </p>
      <p className="v2-mono text-[16px] font-bold text-[color:var(--v2-text)]">
        {ok}<span className="text-[color:var(--v2-text-3)]">/{total}</span>
      </p>
      {total > 0 && <p className="v2-mono text-[12px] text-[color:var(--v2-text-3)]">{pct}%</p>}
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

function DifficultyChip({ difficulty, difficultyMeta }: { difficulty: Difficulty; difficultyMeta: typeof FrGame.DIFFICULTY_META }) {
  const meta = difficultyMeta[difficulty];
  return (
    <div className="flex items-center gap-1.5">
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClass}`} />
      <span className={`text-[12px] font-bold uppercase tracking-wide ${meta.textClass}`}>{meta.label}</span>
    </div>
  );
}


// ─── Summary ──────────────────────────────────────────────────────────────────

function Summary({
  T, METRIC_LABELS, difficulty, difficultyMeta, score, maxStreak, correctCount, stats, onReplay, onChangeDifficulty,
}: {
  T: { [k: string]: string };
  METRIC_LABELS: Record<Metric, string>;
  difficulty: Difficulty;
  difficultyMeta: typeof FrGame.DIFFICULTY_META;
  score: number;
  maxStreak: number;
  correctCount: number;
  stats: Record<Metric, { ok: number; total: number }>;
  onReplay: () => void;
  onChangeDifficulty: () => void;
}) {
  const accuracy = Math.round((correctCount / ROUNDS_PER_SESSION) * 100);
  const verdict =
    score >= 80 ? { label: T.traderDisciplined, color: "text-emerald-300" }
  : score >= 60 ? { label: T.goodEye,            color: "text-emerald-300" }
  : score >= 30 ? { label: T.toPolish,           color: "text-amber-300"   }
  :                 { label: T.lackPatience,       color: "text-red-300"     };
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
        <p className={`v2-display text-[18px] font-bold ${verdict.color}`}>{verdict.label}</p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        <BigStat label={T.score}          value={`${score >= 0 ? "+" : ""}${score}`} valueClass={score < 0 ? "text-red-400" : "text-emerald-400"} />
        <BigStat label={T.precision}      value={`${accuracy}%`}                      valueClass="text-[color:var(--v2-text)]" />
        <BigStat label={T.correctAnswers} value={`${correctCount}/${ROUNDS_PER_SESSION}`} valueClass="text-[color:var(--v2-text)]" />
        <BigStat label={T.bestStreak}     value={`${maxStreak}`}                      valueClass="text-amber-300" />
      </div>

      <div className="flex flex-col gap-3">
        <p className="v2-eyebrow" style={{ color: "var(--v2-text-3)" }}>{T.skills}</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {(["discipline", "lecture", "piege"] as Metric[]).map((m) => (
            <SummarySkill key={m} metric={m} METRIC_LABELS={METRIC_LABELS} ok={stats[m].ok} total={stats[m].total} />
          ))}
        </div>
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

function SummarySkill({ metric, ok, total, METRIC_LABELS }: { metric: Metric; ok: number; total: number; METRIC_LABELS: Record<Metric, string> }) {
  const pct = total > 0 ? Math.round((ok / total) * 100) : 0;
  return (
    <div className="v2-well px-4 py-3">
      <div className="mb-2 flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${METRIC_DOT[metric]}`} />
        <p className="v2-display text-[14px] font-bold text-[color:var(--v2-text)]">{METRIC_LABELS[metric]}</p>
      </div>
      <p className="v2-mono v2-num-l font-bold text-[color:var(--v2-text)]">
        {ok}<span className="text-[color:var(--v2-text-3)]">/{total}</span>
      </p>
      <p className="v2-mono text-[12px] text-[color:var(--v2-text-3)]">{total > 0 ? `${pct}%` : ""}</p>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function biasClass(bias: "bullish" | "bearish" | "range"): string {
  return bias === "bullish" ? "text-emerald-300"
       : bias === "bearish" ? "text-red-300"
       :                       "";
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// V3 : en niveau avancé, les labels de zones perdent leurs noms spécifiques
// (Support HTF, Résistance majeure, FVG haussier) au profit de labels
// génériques. Le joueur doit lire le marché plutôt que de suivre les noms.
function maskZonesForDifficulty(zones: BuySellChart["zones"], d: Difficulty, locale: string | undefined): BuySellChart["zones"] {
  if (d !== "advanced") return zones;
  return zones.map((z) => {
    const generic = locale === "es"
      ? (z.kind === "support"        ? "Nivel bajo"
       : z.kind === "resistance"     ? "Nivel alto"
       : z.kind === "fvg"            ? "Desequilibrio"
       :                                "Liquidity")
      : locale === "en"
      ? (z.kind === "support"        ? "Low level"
       : z.kind === "resistance"     ? "High level"
       : z.kind === "fvg"            ? "Imbalance"
       :                                "Liquidity")
      : (z.kind === "support"        ? "Niveau bas"
       : z.kind === "resistance"     ? "Niveau haut"
       : z.kind === "fvg"            ? "Déséquilibre"
       :                                "Liquidité");
    return { ...z, label: generic };
  });
}

function translateVolatility(v: "faible" | "normale" | "élevée", locale: string | undefined): string {
  if (locale === "es") return v === "élevée" ? "alta" : v === "faible" ? "baja" : "normal";
  if (locale === "en") return v === "élevée" ? "high" : v === "faible" ? "low" : "normal";
  return v;
}

// Retourne la 1re phrase (jusqu'au premier "." inclus).
function firstSentence(text: string): string {
  const i = text.indexOf(". ");
  return i === -1 ? text : text.slice(0, i + 1);
}
