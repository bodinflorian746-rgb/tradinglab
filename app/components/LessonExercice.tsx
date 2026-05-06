"use client";

import { useState } from "react";

interface Props {
  description: string;
  steps: string[];
}

export function LessonExercice({ description, steps }: Props) {
  const [done, setDone] = useState(false);
  const [checked, setChecked] = useState<Set<number>>(new Set());

  function toggle(i: number) {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  const allChecked = checked.size === steps.length;

  return (
    <div>
    <p className="text-[11px] font-semibold text-zinc-600 uppercase tracking-widest mb-2 px-1">Exercice pratique</p>
    <div className={`rounded-2xl border p-6 transition-all duration-300 ${
      done
        ? "bg-zinc-900/30 border-zinc-800/50"
        : "bg-zinc-900/50 border-zinc-800"
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 ${
            done
              ? "bg-emerald-500/10 border border-emerald-500/20"
              : "bg-zinc-800 border border-zinc-700"
          }`}>
            {done ? (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-emerald-400">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-zinc-400">
                <path d="M6 1v5l3 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            )}
          </div>
          <span className={`text-sm font-semibold ${done ? "text-zinc-500" : "text-white"}`}>
            Exercice pratique
          </span>
        </div>
        {done && (
          <span className="text-xs text-emerald-400 font-medium">Complété</span>
        )}
      </div>

      {!done ? (
        <>
          {/* Description */}
          <p className="text-sm text-zinc-300 leading-relaxed mb-5">{description}</p>

          {/* Étapes */}
          <ul className="space-y-2 mb-5">
            {steps.map((step, i) => (
              <li key={i}>
                <button
                  onClick={() => toggle(i)}
                  className={`w-full flex items-start gap-3 text-left px-3.5 py-2.5 rounded-xl transition-all duration-150 ${
                    checked.has(i)
                      ? "bg-emerald-500/5"
                      : "hover:bg-zinc-800/60"
                  }`}
                >
                  <div className={`shrink-0 mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-all duration-150 ${
                    checked.has(i)
                      ? "bg-emerald-500 border-emerald-500"
                      : "border-zinc-600"
                  }`}>
                    {checked.has(i) && (
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M1.5 4l2 2 3-3" stroke="#09090b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-xs leading-relaxed transition-colors duration-150 ${
                    checked.has(i) ? "text-zinc-500 line-through decoration-zinc-600" : "text-zinc-400"
                  }`}>
                    {step}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <button
            onClick={() => setDone(true)}
            disabled={!allChecked}
            className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
              allChecked
                ? "bg-zinc-700 hover:bg-zinc-600 text-white"
                : "bg-zinc-800/40 text-zinc-700 cursor-not-allowed"
            }`}
          >
            {allChecked ? "Marquer l'exercice comme complété" : `${checked.size}/${steps.length} étapes cochées`}
          </button>
        </>
      ) : (
        <p className="text-sm text-zinc-600 leading-relaxed">
          {description}
        </p>
      )}
    </div>
    </div>
  );
}
