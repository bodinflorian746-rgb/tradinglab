"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import * as FrGame from "@/lib/games/buy-sell-no-trade";
import * as EsGame from "@/lib/games/buy-sell-no-trade-es";
import {
  scoreChoice,
  ROUNDS_PER_SESSION,
  type BuySellChart,
  type Difficulty,
  type GameChoice,
  type Metric,
  type ScenarioInstance,
} from "@/lib/games/buy-sell-no-trade";
import { MiniChart } from "@/app/components/games/MiniChart";
import { logGameEvent, type SkillId } from "@/lib/trader-profile";

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

const METRIC_DOT: Record<Metric, string> = {
  discipline: "bg-blue-400",
  lecture:    "bg-emerald-400",
  piege:      "bg-amber-400",
};

const BIAS_LABEL_FR = { bullish: "Haussier", bearish: "Baissier", range: "Range" } as const;
const BIAS_LABEL_ES = { bullish: "Alcista", bearish: "Bajista", range: "Range" } as const;
const MACRO_LABEL_FR = { normal: "Normal", dangereux: "Dangereux" } as const;
const MACRO_LABEL_ES = { normal: "Normal", dangereux: "Peligroso" } as const;

const DIFFICULTIES: Difficulty[] = ["beginner", "intermediate", "advanced"];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BuySellNoTradePage() {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale;
  const G = locale === "es" ? EsGame : FrGame;
  const isEs = locale === "es";
  const METRIC_LABELS = isEs ? METRIC_LABELS_ES : METRIC_LABELS_FR;
  const BIAS_LABEL = isEs ? BIAS_LABEL_ES : BIAS_LABEL_FR;
  const MACRO_LABEL = isEs ? MACRO_LABEL_ES : MACRO_LABEL_FR;
  const T = isEs
    ? {
        games:           "Juegos",
        round:           "Ronda",
        score:           "Puntuación",
        ofStreak:        "de racha",
        bonusActive:     "· bono activo",
        skills:          "Habilidades",
        loading:         "Cargando…",
        newsWarning:     "Noticia macro mayor en menos de 30 min — volatilidad y spread imprevisibles.",
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
      }
    : {
        games:           "Jeux",
        round:           "Round",
        score:           "Score",
        ofStreak:        "de série",
        bonusActive:     "· bonus actif",
        skills:          "Compétences",
        loading:         "Chargement…",
        newsWarning:     "News macro majeure dans < 30 min — volatilité et spread imprévisibles.",
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
  const [lastStreakBonus, setLastStreakBonus] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const animRef = useRef<NodeJS.Timeout | null>(null);

  const current = scenarios[idx];
  const chart: BuySellChart | null = useMemo(
    () => (current && difficulty ? G.buildChart(current.id, current.seed, current.volatility, difficulty) : null),
    [current, difficulty, G],
  );

  // Quand on change de scenario, reset reveal/phase
  useEffect(() => {
    setPhase("placing");
    setRevealed(0);
    setChosen(null);
    setLastPoints(0);
    setLastStreakBonus(0);
    if (animRef.current) { clearTimeout(animRef.current); animRef.current = null; }
  }, [idx, difficulty]);

  // Animation reveal après le choix
  useEffect(() => {
    if (phase !== "revealing" || !chart || !current) return;
    if (revealed >= chart.future.length) {
      animRef.current = setTimeout(() => setPhase("feedback"), 300);
    } else {
      animRef.current = setTimeout(() => setRevealed((c) => c + 1), 200);
    }
    return () => { if (animRef.current) clearTimeout(animRef.current); };
  }, [phase, revealed, chart, current]);

  // ─── Écran 1 : sélection difficulté ─────────────────────────────────────────
  if (!difficulty || !seed) {
    return <DifficultyPicker isEs={isEs} difficultyMeta={G.DIFFICULTY_META} onPick={(d) => {
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
        isEs={isEs}
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
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <p className="text-sm text-zinc-500">{T.loading}</p>
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
    setLastStreakBonus(r.streakBonus);
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
    setRevealed(1);
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

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-5">
          <Link
            href="/jeux"
            className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-white transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M11 6.5H2M5 3.5l-3 3 3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {T.games}
          </Link>
          <div className="flex items-center gap-3 text-[11px]">
            <DifficultyChip difficulty={difficulty} difficultyMeta={G.DIFFICULTY_META} />
            <div className="w-px h-3 bg-zinc-800" />
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-600 uppercase tracking-wide">{T.round}</span>
              <span className="font-bold text-white tabular-nums">{idx + 1}/{ROUNDS_PER_SESSION}</span>
            </div>
            <div className="w-px h-3 bg-zinc-800" />
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-600 uppercase tracking-wide">{T.score}</span>
              <span className={`font-bold tabular-nums ${score < 0 ? "text-red-400" : "text-emerald-400"}`}>
                {score >= 0 ? "+" : ""}{score}
              </span>
            </div>
          </div>
        </div>

        {/* Streak */}
        {streak > 0 && (
          <div className="mb-4 flex items-center justify-center gap-1.5 text-[11px] font-semibold">
            <span className="text-amber-400">🔥</span>
            <span className="text-amber-400 tabular-nums">{streak}</span>
            <span className="text-zinc-500">{T.ofStreak}</span>
            {streak >= 3 && <span className="text-amber-400">{T.bonusActive}</span>}
          </div>
        )}

        {/* Scenario card */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden mb-5">

          {/* Meta */}
          <div className="px-4 pt-3 pb-2.5 border-b border-zinc-800/60 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tabular-nums">{current.asset}</span>
              <span className="text-zinc-700 text-xs">·</span>
              <span className="text-[11px] text-zinc-400">{current.session}</span>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <VolBadge volatility={current.volatility} T={T} isEs={isEs} />
              <SpreadBadge spread={current.spread} T={T} isEs={isEs} />
            </div>
          </div>

          {/* News warning */}
          {current.macroContext === "dangereux" && (
            <div className="px-4 py-2.5 border-b border-zinc-800/60 bg-red-500/5 flex items-start gap-2.5">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 mt-0.5">
                <path d="M7 1L13 12H1L7 1z" stroke="#ef4444" strokeWidth="1.4" strokeLinejoin="round" />
                <path d="M7 5.5v3M7 10v0.5" stroke="#ef4444" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              <p className="text-[11px] text-red-400 font-semibold leading-snug">
                {T.newsWarning}
              </p>
            </div>
          )}

          {/* Mini chart : past + (future progressif si reveal/feedback) */}
          <div className="p-3 sm:p-4">
            <MiniChart
              data={{
                candles: [...chart.past, ...chart.future],
                zones:   maskZonesForDifficulty(chart.zones, difficulty, isEs),
                domain:  chart.domain,
              }}
              overlay={{
                separatorIndex:     chart.past.length,
                visibleFutureCount: isPlacing ? 0 : revealed,
              }}
              height={isPlacing ? 170 : 185}
            />
            {chart.zones.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5">
                {maskZonesForDifficulty(chart.zones, difficulty, isEs).map((z, i) => (
                  <ZoneLegendChip key={i} zone={z} />
                ))}
              </div>
            )}
          </div>

          {/* Context infos — en avancé, on cache spread/vol pour forcer la
              lecture du chart (mais on garde la news warning visible). */}
          <div className={`px-4 pb-3 grid gap-2 ${difficulty === "advanced" ? "grid-cols-2" : "grid-cols-3"}`}>
            <InfoTile label={T.htf}        value={BIAS_LABEL[current.htfBias]}        biasClass={biasClass(current.htfBias)} />
            <InfoTile label={T.macro}      value={MACRO_LABEL[current.macroContext]}  biasClass={current.macroContext === "dangereux" ? "text-red-400" : "text-zinc-300"} />
            {difficulty !== "advanced" && (
              <InfoTile label={T.volatility} value={cap(translateVolatility(current.volatility, isEs))} biasClass="text-zinc-300" />
            )}
          </div>

          {/* Context text — raccourci en intermédiaire/avancé pour réduire les
              aides texte (le joueur doit lire le marché lui-même). */}
          <div className="px-4 pb-4">
            <p className="text-[13px] text-zinc-300 leading-relaxed">
              {difficulty === "beginner" ? current.context : (current.shortContext ?? firstSentence(current.context))}
            </p>
          </div>
        </div>

        {/* Decision / reveal / feedback */}
        {isPlacing && <DecisionButtons onChoose={handleChoice} />}

        {isRevealing && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl px-4 py-5 text-center">
            <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">
              {T.revelation}
            </p>
            <p className="text-sm text-zinc-300">
              {T.revealText}
            </p>
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
            points={lastPoints}
            streakBonus={lastStreakBonus}
            title={current.title}
            metric={current.metric}
            onNext={handleNext}
            isLast={idx + 1 >= ROUNDS_PER_SESSION}
          />
        )}

        {/* Stats footer */}
        <div className="mt-6 pt-5 border-t border-zinc-800/60">
          <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-3">
            {T.skills}
          </p>
          <div className="grid grid-cols-3 gap-2.5">
            {(["discipline", "lecture", "piege"] as Metric[]).map((m) => (
              <StatTile key={m} metric={m} METRIC_LABELS={METRIC_LABELS} ok={stats[m].ok} total={stats[m].total} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

// ─── Difficulty picker ────────────────────────────────────────────────────────

function DifficultyPicker({ onPick, difficultyMeta, isEs }: { onPick: (d: Difficulty) => void; difficultyMeta: typeof FrGame.DIFFICULTY_META; isEs: boolean }) {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <Link
          href="/jeux"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-white mb-8"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M11 6.5H2M5 3.5l-3 3 3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {isEs ? "Juegos" : "Jeux"}
        </Link>

        <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-2">
          BUY / SELL / NO TRADE
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{isEs ? "Elige tu nivel" : "Choisis ton niveau"}</h1>
        <p className="text-zinc-400 text-sm leading-relaxed mb-8">
          {isEs
            ? `${ROUNDS_PER_SESSION} escenarios para analizar. El nivel modula la sutileza de las señales, la frecuencia de las trampas y la profundidad de las explicaciones.`
            : `${ROUNDS_PER_SESSION} scénarios à analyser. Le niveau module la subtilité des signaux, la fréquence des pièges et la profondeur des explications.`}
        </p>

        <div className="flex flex-col gap-3">
          {DIFFICULTIES.map((d) => {
            const meta = difficultyMeta[d];
            return (
              <button
                key={d}
                onClick={() => onPick(d)}
                className="group text-left bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 rounded-2xl px-5 py-4 transition-all"
              >
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2 h-2 rounded-full ${meta.dotClass}`} />
                    <span className={`text-base font-bold ${meta.textClass}`}>{meta.label}</span>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-zinc-600 group-hover:text-white transition-colors">
                    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-[12px] text-zinc-400 leading-relaxed">{meta.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function DecisionButtons({ onChoose }: { onChoose: (c: GameChoice) => void }) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      <button
        onClick={() => onChoose("BUY")}
        className="py-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-sm hover:bg-emerald-500/20 hover:border-emerald-500/50 active:scale-[0.98] transition-all"
      >
        BUY
      </button>
      <button
        onClick={() => onChoose("SELL")}
        className="py-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-sm hover:bg-red-500/20 hover:border-red-500/50 active:scale-[0.98] transition-all"
      >
        SELL
      </button>
      <button
        onClick={() => onChoose("NO_TRADE")}
        className="py-3.5 rounded-xl bg-zinc-800/60 border border-zinc-700 text-zinc-300 font-bold text-xs sm:text-sm hover:bg-zinc-800 hover:border-zinc-600 active:scale-[0.98] transition-all"
      >
        NO TRADE
      </button>
    </div>
  );
}

interface FeedbackProps {
  T:              { [k: string]: string };
  METRIC_LABELS:  Record<Metric, string>;
  choice:         GameChoice;
  correctAnswer:  GameChoice;
  rationales:     { BUY: string; SELL: string; NO_TRADE: string };
  lesson:         string;
  difficulty:     Difficulty;
  difficultyMeta: typeof FrGame.DIFFICULTY_META;
  points:         number;
  streakBonus:    number;
  title:          string;
  metric:         Metric;
  onNext:         () => void;
  isLast:         boolean;
}

function Feedback({ T, METRIC_LABELS, choice, correctAnswer, rationales, lesson, difficulty, difficultyMeta, points, streakBonus, title, metric, onNext, isLast }: FeedbackProps) {
  const correct = choice === correctAnswer;
  const headline = correct
    ? correctAnswer === "NO_TRADE" ? T.disciplinePerfect : T.goodRead
    : correctAnswer === "NO_TRADE" ? T.trapAvoided : T.wrongRead;

  return (
    <div className={`bg-zinc-900/50 border rounded-2xl overflow-hidden ${
      correct ? "border-emerald-500/30" : "border-red-500/30"
    }`}>
      <div className={`px-4 py-3 ${correct ? "bg-emerald-500/8" : "bg-red-500/8"} flex items-center justify-between gap-3`}>
        <div className="flex items-center gap-2.5 min-w-0">
          {correct ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0">
              <circle cx="9" cy="9" r="8" stroke="#10b981" strokeWidth="1.5" />
              <path d="M5.5 9.5l2.5 2.5 4.5-5" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0">
              <circle cx="9" cy="9" r="8" stroke="#ef4444" strokeWidth="1.5" />
              <path d="M6 6l6 6M12 6l-6 6" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          )}
          <p className={`text-sm font-bold ${correct ? "text-emerald-400" : "text-red-400"} truncate`}>
            {headline}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className={`text-base font-black tabular-nums ${
            points >= 0 ? "text-emerald-400" : "text-red-400"
          }`}>
            {points >= 0 ? "+" : ""}{points}
          </p>
          {streakBonus > 0 && (
            <p className="text-[9px] text-amber-400 uppercase tracking-wide font-bold">
              +{streakBonus} streak
            </p>
          )}
        </div>
      </div>

      <div className="px-4 py-4">
        <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide mb-2">
          {title}
        </p>

        {/* Rationales : 3 lignes, une par choix */}
        <div className="space-y-2 mb-4">
          <RationaleRow
            T={T}
            label="BUY"
            text={rationales.BUY}
            isCorrect={correctAnswer === "BUY"}
            isChosen={choice === "BUY"}
          />
          <RationaleRow
            T={T}
            label="SELL"
            text={rationales.SELL}
            isCorrect={correctAnswer === "SELL"}
            isChosen={choice === "SELL"}
          />
          <RationaleRow
            T={T}
            label="NO TRADE"
            text={rationales.NO_TRADE}
            isCorrect={correctAnswer === "NO_TRADE"}
            isChosen={choice === "NO_TRADE"}
          />
        </div>

        {/* Lesson (adapté au niveau) */}
        <div className="bg-blue-500/8 border border-blue-500/25 rounded-lg px-3 py-2.5 mb-3">
          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wide mb-1">
            {T.lesson} · {difficultyMeta[difficulty].label}
          </p>
          <p className="text-[13px] text-zinc-200 leading-relaxed">{lesson}</p>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2 border-t border-zinc-800/60">
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${METRIC_DOT[metric]}`} />
            <span className="text-[10px] text-zinc-500 font-medium">{METRIC_LABELS[metric]}</span>
          </div>
          <button
            onClick={onNext}
            className="flex items-center gap-1.5 text-sm font-semibold text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg px-4 py-2 transition-colors"
          >
            {isLast ? T.viewSummary : T.nextScenario}
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M2 6.5h9M8 3.5l3 3-3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function RationaleRow({ T, label, text, isCorrect, isChosen }: { T: { [k: string]: string }; label: string; text: string; isCorrect: boolean; isChosen: boolean }) {
  // Style :
  //   isCorrect = true → bordure emerald (la bonne réponse)
  //   isChosen && !isCorrect → bordure red (le choix erroné)
  //   sinon → bordure zinc neutre
  const border =
    isCorrect           ? "border-emerald-500/40 bg-emerald-500/5"
  : isChosen            ? "border-red-500/40 bg-red-500/5"
  :                       "border-zinc-800 bg-zinc-950/40";
  const labelColor =
    isCorrect ? "text-emerald-400"
  : isChosen  ? "text-red-400"
  :             "text-zinc-500";
  return (
    <div className={`border rounded-lg px-3 py-2.5 ${border}`}>
      <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${labelColor}`}>
        {label}
        {isCorrect && <span className="ml-1.5 text-emerald-400">{T.correctAnswer}</span>}
        {isChosen && !isCorrect && <span className="ml-1.5 text-red-400">{T.yourChoice}</span>}
      </p>
      <p className="text-[12px] text-zinc-300 leading-relaxed">{text}</p>
    </div>
  );
}

function InfoTile({ label, value, biasClass }: { label: string; value: string; biasClass: string }) {
  return (
    <div className="bg-zinc-950/60 border border-zinc-800/60 rounded-lg px-2.5 py-1.5">
      <p className="text-[9px] text-zinc-600 uppercase tracking-wide">{label}</p>
      <p className={`text-[12px] font-semibold ${biasClass} truncate`}>{value}</p>
    </div>
  );
}

function StatTile({ metric, ok, total, METRIC_LABELS }: { metric: Metric; ok: number; total: number; METRIC_LABELS: Record<Metric, string> }) {
  const pct = total > 0 ? Math.round((ok / total) * 100) : 0;
  return (
    <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg px-3 py-2.5">
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className={`w-1.5 h-1.5 rounded-full ${METRIC_DOT[metric]}`} />
        <p className="text-[10px] text-zinc-500 uppercase tracking-wide font-semibold truncate">
          {METRIC_LABELS[metric]}
        </p>
      </div>
      <p className="text-sm font-bold text-white tabular-nums">
        {ok}<span className="text-zinc-600">/{total}</span>
      </p>
      {total > 0 && (
        <p className="text-[10px] text-zinc-600 tabular-nums">{pct}%</p>
      )}
    </div>
  );
}

function VolBadge({ volatility, T, isEs }: { volatility: "faible" | "normale" | "élevée"; T: { [k: string]: string }; isEs: boolean }) {
  const cls =
    volatility === "élevée"  ? "text-amber-400 border-amber-400/30"
  : volatility === "faible"  ? "text-zinc-500 border-zinc-700"
  :                            "text-zinc-400 border-zinc-700";
  const label = isEs
    ? (volatility === "élevée" ? T.volHigh : volatility === "faible" ? T.volLow : T.volNormal)
    : volatility;
  return (
    <span className={`border rounded-full px-2 py-0.5 font-semibold ${cls}`}>
      {T.vol} {label}
    </span>
  );
}

function SpreadBadge({ spread, T, isEs }: { spread: "faible" | "élevé"; T: { [k: string]: string }; isEs: boolean }) {
  const cls = spread === "élevé"
    ? "text-amber-400 border-amber-400/30"
    : "text-zinc-500 border-zinc-700";
  const label = isEs
    ? (spread === "élevé" ? T.spreadHigh : T.spreadLow)
    : spread;
  return (
    <span className={`border rounded-full px-2 py-0.5 font-semibold ${cls}`}>
      {T.spread} {label}
    </span>
  );
}

function DifficultyChip({ difficulty, difficultyMeta }: { difficulty: Difficulty; difficultyMeta: typeof FrGame.DIFFICULTY_META }) {
  const meta = difficultyMeta[difficulty];
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-1.5 h-1.5 rounded-full ${meta.dotClass}`} />
      <span className={`text-[10px] font-bold uppercase tracking-wide ${meta.textClass}`}>
        {meta.label}
      </span>
    </div>
  );
}

function ZoneLegendChip({ zone }: { zone: { kind: string; label: string } }) {
  const cls =
    zone.kind === "support"        ? "bg-emerald-500"
  : zone.kind === "resistance"     ? "bg-red-500"
  : zone.kind === "fvg"            ? "bg-amber-400"
  :                                  "bg-amber-400";
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-sm ${cls}`} />
      <span className="text-[10px] text-zinc-400 font-medium">{zone.label}</span>
    </div>
  );
}

// ─── Summary ──────────────────────────────────────────────────────────────────

function Summary({
  isEs, T, METRIC_LABELS, difficulty, difficultyMeta, score, maxStreak, correctCount, stats, onReplay, onChangeDifficulty,
}: {
  isEs: boolean;
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
    score >= 1000 ? { label: T.traderDisciplined, color: "text-emerald-400" }
  : score >= 600  ? { label: T.goodEye,            color: "text-emerald-400" }
  : score >= 200  ? { label: T.toPolish,           color: "text-amber-400"   }
  :                 { label: T.lackPatience,       color: "text-red-400"     };
  const meta = difficultyMeta[difficulty];

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <Link
          href="/jeux"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-white mb-6"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M11 6.5H2M5 3.5l-3 3 3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {T.games}
        </Link>

        <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-2">
          {T.summary} · <span className={meta.textClass}>{meta.label}</span>
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">{ROUNDS_PER_SESSION} {T.scenariosPlayed}</h1>
        <p className={`text-sm font-semibold ${verdict.color} mb-7`}>{verdict.label}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-8">
          <BigStat label={T.score}          value={`${score >= 0 ? "+" : ""}${score}`} valueClass={score < 0 ? "text-red-400" : "text-emerald-400"} />
          <BigStat label={T.precision}      value={`${accuracy}%`}                      valueClass="text-white" />
          <BigStat label={T.correctAnswers} value={`${correctCount}/${ROUNDS_PER_SESSION}`} valueClass="text-white" />
          <BigStat label={T.bestStreak}     value={`${maxStreak}`}                      valueClass="text-amber-400" />
        </div>

        <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-3">
          {T.skills}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          {(["discipline", "lecture", "piege"] as Metric[]).map((m) => (
            <SummarySkill key={m} metric={m} METRIC_LABELS={METRIC_LABELS} ok={stats[m].ok} total={stats[m].total} />
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onReplay}
            className="flex-1 py-3 rounded-xl bg-white text-zinc-950 font-bold text-sm hover:bg-zinc-100 transition-colors"
          >
            {T.replayIn} {meta.label.toLowerCase()}
          </button>
          <button
            onClick={onChangeDifficulty}
            className="flex-1 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-bold text-sm hover:bg-zinc-800 transition-colors"
          >
            {T.changeLevel}
          </button>
        </div>
      </div>
    </main>
  );
}

function BigStat({ label, value, valueClass }: { label: string; value: string; valueClass: string }) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl px-3 py-3">
      <p className="text-[10px] text-zinc-600 uppercase tracking-wide font-semibold mb-1">{label}</p>
      <p className={`text-xl font-black tabular-nums ${valueClass}`}>{value}</p>
    </div>
  );
}

function SummarySkill({ metric, ok, total, METRIC_LABELS }: { metric: Metric; ok: number; total: number; METRIC_LABELS: Record<Metric, string> }) {
  const pct = total > 0 ? Math.round((ok / total) * 100) : 0;
  return (
    <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl px-4 py-3">
      <div className="flex items-center gap-2 mb-2">
        <span className={`w-2 h-2 rounded-full ${METRIC_DOT[metric]}`} />
        <p className="text-xs font-bold text-white">{METRIC_LABELS[metric]}</p>
      </div>
      <p className="text-lg font-black tabular-nums text-white">
        {ok}<span className="text-zinc-700">/{total}</span>
      </p>
      <p className="text-[10px] text-zinc-500 tabular-nums">{total > 0 ? `${pct}%` : "—"}</p>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function biasClass(bias: "bullish" | "bearish" | "range"): string {
  return bias === "bullish" ? "text-emerald-400"
       : bias === "bearish" ? "text-red-400"
       :                       "text-zinc-400";
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// V3 : en niveau avancé, les labels de zones perdent leurs noms spécifiques
// (Support HTF, Résistance majeure, FVG haussier) au profit de labels
// génériques. Le joueur doit lire le marché plutôt que de suivre les noms.
function maskZonesForDifficulty(zones: BuySellChart["zones"], d: Difficulty, isEs: boolean): BuySellChart["zones"] {
  if (d !== "advanced") return zones;
  return zones.map((z) => {
    const generic = isEs
      ? (z.kind === "support"        ? "Nivel bajo"
       : z.kind === "resistance"     ? "Nivel alto"
       : z.kind === "fvg"            ? "Imbalance"
       :                                "Liquidez")
      : (z.kind === "support"        ? "Niveau bas"
       : z.kind === "resistance"     ? "Niveau haut"
       : z.kind === "fvg"            ? "Imbalance"
       :                                "Liquidité");
    return { ...z, label: generic };
  });
}

function translateVolatility(v: "faible" | "normale" | "élevée", isEs: boolean): string {
  if (!isEs) return v;
  return v === "élevée" ? "alta" : v === "faible" ? "baja" : "normal";
}

// Retourne la 1re phrase (jusqu'au premier "." inclus).
function firstSentence(text: string): string {
  const i = text.indexOf(". ");
  return i === -1 ? text : text.slice(0, i + 1);
}
