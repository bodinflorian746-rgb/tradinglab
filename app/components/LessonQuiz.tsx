"use client";

import { useState, useRef } from "react";
import { useQuizAnswered } from "./LessonPage";

interface Props {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  answerExplanations?: string[];
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
      <path d="M1.5 5.5l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M8 2L2 8M2 2l6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

// ─── Option badge (A / B / C / D) ────────────────────────────────────────────

function OptionBadge({
  letter,
  state,
}: {
  letter: string;
  state: "idle" | "selected" | "correct" | "wrong" | "dimmed";
}) {
  const styles: Record<typeof state, string> = {
    idle:     "border-zinc-700 text-zinc-600 bg-transparent",
    selected: "border-emerald-500/60 text-emerald-400 bg-emerald-500/10",
    correct:  "border-emerald-500 bg-emerald-500 text-zinc-950",
    wrong:    "border-red-500/60 bg-red-500/15 text-red-400",
    dimmed:   "border-zinc-800 text-zinc-700 bg-transparent",
  };

  return (
    <span
      className={`shrink-0 w-[22px] h-[22px] mt-0.5 rounded-full border flex items-center justify-center transition-all duration-300 ${styles[state]}`}
      style={{ fontSize: 10, fontWeight: 700 }}
    >
      {state === "correct" ? <CheckIcon /> : state === "wrong" ? <CrossIcon /> : letter}
    </span>
  );
}

// ─── Single option row ────────────────────────────────────────────────────────

function OptionRow({
  index,
  text,
  explanation,
  state,
  onClick,
}: {
  index: number;
  text: string;
  explanation?: string;
  state: "idle" | "selected" | "correct" | "wrong" | "dimmed";
  onClick?: () => void;
}) {
  const letter = String.fromCharCode(65 + index);

  const containerStyles: Record<typeof state, string> = {
    idle:    "border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-900/60 hover:text-zinc-200 hover:translate-x-1 cursor-pointer",
    selected:"border-emerald-500/40 bg-emerald-500/5 text-white cursor-pointer",
    correct: "border-emerald-500/40 bg-emerald-500/8 text-white cursor-default",
    wrong:   "border-red-500/30 bg-red-500/8 text-red-200 cursor-default",
    dimmed:  "border-zinc-800/60 bg-zinc-900/20 text-zinc-600 cursor-default",
  };

  const explanationColor: Record<typeof state, string> = {
    idle:    "",
    selected:"",
    correct: "text-emerald-400/80",
    wrong:   "text-red-400/70",
    dimmed:  "text-zinc-600",
  };

  const showExplanation = explanation && (state === "correct" || state === "wrong" || state === "dimmed");

  return (
    <button
      onClick={onClick}
      disabled={state === "correct" || state === "wrong" || state === "dimmed"}
      className={`w-full flex items-start gap-3 text-left px-4 py-3.5 rounded-xl border text-sm transition-all duration-200 active:scale-[0.99] ${containerStyles[state]}`}
    >
      <OptionBadge letter={letter} state={state} />
      <div className="min-w-0">
        <p className="leading-snug">{text}</p>
        {showExplanation && (
          <p
            className={`text-xs mt-2 leading-relaxed transition-all duration-300 ${explanationColor[state]}`}
            style={{ animation: "fadeExplain 0.35s ease both" }}
          >
            {explanation}
          </p>
        )}
      </div>
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function LessonQuiz({
  question,
  options,
  correctIndex,
  explanation,
  answerExplanations,
}: Props) {
  const [selected,  setSelected]  = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [shaking,   setShaking]   = useState(false);
  const firedRef = useRef(false);
  const { onAnswered } = useQuizAnswered();

  const isCorrect = submitted && selected === correctIndex;

  function handleSubmit() {
    if (selected === null) return;
    setSubmitted(true);

    if (selected !== correctIndex) {
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }

    if (!firedRef.current) {
      firedRef.current = true;
      onAnswered();
    }
  }

  function getState(i: number): "idle" | "selected" | "correct" | "wrong" | "dimmed" {
    if (!submitted) return selected === i ? "selected" : "idle";
    if (i === correctIndex) return "correct";
    if (i === selected)     return "wrong";
    return "dimmed";
  }

  return (
    <div>
      <style>{`
        @keyframes fadeExplain {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shakeOptions {
          0%, 100% { transform: translateX(0); }
          20%      { transform: translateX(-5px); }
          40%      { transform: translateX(5px); }
          60%      { transform: translateX(-3px); }
          80%      { transform: translateX(3px); }
        }
      `}</style>

      <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-2 px-1">Quiz</p>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700/80 flex items-center justify-center shrink-0">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="text-zinc-400">
                <path d="M6.5 2.5c-1.6 0-2.8 1-2.8 2.3 0 .6.3 1.1.7 1.5L5 7.5h3l.6-1.2c.4-.4.7-.9.7-1.5C9.3 3.5 8.1 2.5 6.5 2.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                <path d="M5 7.5v.5a1.5 1.5 0 003 0v-.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-white">Quiz de validation</span>
          </div>

          {submitted && (
            <span
              className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                isCorrect
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                  : "bg-red-500/10 text-red-400 border-red-500/20"
              }`}
              style={{ animation: "fadeExplain 0.3s ease both" }}
            >
              {isCorrect ? (
                <><CheckIcon />Bonne réponse</>
              ) : (
                <><CrossIcon />Mauvaise réponse</>
              )}
            </span>
          )}
        </div>

        {/* Question */}
        <p className="text-[15px] font-medium text-white leading-snug mb-5">{question}</p>

        {/* Options */}
        <div
          className="space-y-2.5 mb-5"
          style={shaking ? { animation: "shakeOptions 0.45s ease" } : undefined}
        >
          {options.map((opt, i) => (
            <OptionRow
              key={i}
              index={i}
              text={opt}
              explanation={answerExplanations?.[i]}
              state={getState(i)}
              onClick={!submitted ? () => setSelected(i) : undefined}
            />
          ))}
        </div>

        {/* Validate button */}
        {!submitted && (
          <button
            onClick={handleSubmit}
            disabled={selected === null}
            className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[0.99] ${
              selected !== null
                ? "bg-emerald-500 hover:bg-emerald-400 text-zinc-950"
                : "bg-zinc-900 border border-zinc-800 text-zinc-700 cursor-not-allowed"
            }`}
          >
            {selected !== null ? "Valider ma réponse" : "Choisis une réponse"}
          </button>
        )}

        {/* Global explanation (fallback when no per-answer explanations) */}
        {submitted && !answerExplanations && (
          <div
            className={`rounded-xl px-4 py-3.5 flex items-start gap-3 ${
              isCorrect
                ? "bg-emerald-500/10 border border-emerald-500/20"
                : "bg-red-500/10 border border-red-500/20"
            }`}
            style={{ animation: "fadeExplain 0.35s ease both" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={`shrink-0 mt-0.5 ${isCorrect ? "text-emerald-400" : "text-red-400"}`}>
              {isCorrect
                ? <path d="M3 8l3.5 3.5 6.5-7"  stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                : <path d="M11 5L5 11M5 5l6 6"   stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              }
            </svg>
            <div>
              <p className={`text-sm font-semibold mb-1 ${isCorrect ? "text-emerald-400" : "text-red-400"}`}>
                {isCorrect ? "Excellente réponse !" : "Pas tout à fait."}
              </p>
              <p className="text-xs text-zinc-400 leading-relaxed">{explanation}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
