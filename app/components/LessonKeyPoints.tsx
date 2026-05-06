"use client";

import { useState } from "react";

interface Props {
  points: string[];
}

export function LessonKeyPoints({ points }: Props) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  function toggle(i: number) {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  const allChecked = checked.size === points.length;

  return (
    <div>
    <p className="text-[11px] font-semibold text-zinc-600 uppercase tracking-widest mb-2 px-1">À retenir</p>
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="text-emerald-400">
              <path d="M6.5 1.5l1.2 3.6H11l-2.9 2.1 1.1 3.6L6.5 9 3.8 10.8l1.1-3.6L2 5.1h3.3L6.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-white">À retenir</span>
        </div>
        {allChecked && (
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
            Tout maîtrisé ✓
          </span>
        )}
      </div>

      <ul className="space-y-2.5">
        {points.map((point, i) => {
          const isChecked = checked.has(i);
          return (
            <li key={i}>
              <button
                onClick={() => toggle(i)}
                className={`w-full flex items-start gap-3 text-left px-4 py-3 rounded-xl border transition-all duration-200 ${
                  isChecked
                    ? "border-emerald-500/20 bg-emerald-500/5"
                    : "border-zinc-800 bg-zinc-800/30 hover:border-zinc-700 hover:bg-zinc-800/50"
                }`}
              >
                <div className={`shrink-0 mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-200 ${
                  isChecked
                    ? "bg-emerald-500 border-emerald-500"
                    : "border-zinc-600"
                }`}>
                  {isChecked && (
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1.5 4l2 2 3-3" stroke="#09090b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className={`text-sm leading-relaxed transition-colors duration-200 ${
                  isChecked ? "text-zinc-400 line-through decoration-zinc-600" : "text-zinc-300"
                }`}>
                  {point}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {!allChecked && (
        <p className="mt-3 text-center text-xs text-zinc-600">
          Coche chaque point pour confirmer que tu l'as assimilé
        </p>
      )}
    </div>
    </div>
  );
}
