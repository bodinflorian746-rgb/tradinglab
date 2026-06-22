"use client";

// Analyse individuelle d'un trade (modale) — Priorité 3.
// 100% mock : contenu pédagogique dérivé des données du trade (buildTradeAnalysis).

import { useEffect, useMemo, useState } from "react";
import type { TradeEntryView } from "@/lib/journal/types";
import type { Dictionaries } from "@/i18n/dictionaries";
import { buildTradeAnalysis } from "@/lib/journal/trade-analysis-mock";
import { useLocale } from "@/app/components/LocaleProvider";
import { ScoreGauge } from "./analysis/ScoreGauge";

type JournalDict = Dictionaries["journal"];

export function TradeAnalysisModal({ entry, t }: { entry: TradeEntryView; t: JournalDict }) {
  const [open, setOpen] = useState(false);
  const locale = useLocale();
  const a = useMemo(() => buildTradeAnalysis(entry, t, locale), [entry, t, locale]);
  const s = t.tradeAnalysis;

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M2 10l3.5-3.5 2.5 2.5L14 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10.5 3H14v3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {s.trigger}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={s.title}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl bg-zinc-950 border border-zinc-800 max-h-[92vh] overflow-y-auto">
            <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b border-zinc-800/70 bg-zinc-950/95 backdrop-blur">
              <div className="flex items-center gap-2.5">
                <span className="text-base font-bold text-white">{s.title}</span>
                <span className="text-[11px] text-zinc-500 font-medium">{entry.asset}</span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t.form.cancel}
                className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <path d="M5 5l10 10M15 5l-10 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="px-5 py-5 space-y-5">
              {/* 1 — Score global */}
              <div className="bg-gradient-to-br from-emerald-500/10 to-zinc-900/40 border border-emerald-500/20 rounded-2xl p-5 flex flex-col items-center gap-3">
                <ScoreGauge value={a.score} max={100} label={s.score} />
                {entry.ai_summary && (
                  <p className="text-sm text-zinc-300 leading-relaxed text-center">{entry.ai_summary}</p>
                )}
              </div>

              {/* 2 — Ce qui a été bien fait */}
              <div>
                <p className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wide mb-2.5">{s.good}</p>
                <ul className="space-y-2">
                  {a.good.map((g) => (
                    <li key={g} className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0 mt-0.5">
                        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                          <path d="M2.5 6.2l2.2 2.3L9.5 3.5" stroke="#34d399" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span className="text-sm text-zinc-300">{g}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 3 — Ce qui aurait pu être amélioré */}
              <div>
                <p className="text-[11px] font-semibold text-amber-400 uppercase tracking-wide mb-2.5">{s.improve}</p>
                <ul className="space-y-2">
                  {a.improve.map((w) => (
                    <li key={w} className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-amber-400/15 border border-amber-400/25 flex items-center justify-center shrink-0 mt-0.5">
                        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                          <path d="M6 2.5v4M6 8.5h.01" stroke="#fbbf24" strokeWidth="1.6" strokeLinecap="round" />
                        </svg>
                      </span>
                      <span className="text-sm text-zinc-300">{w}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 4 — Conseil du coach */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4">
                <p className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wide mb-2">{s.advice}</p>
                <p className="text-sm text-zinc-300 leading-relaxed">{a.coachAdvice}</p>
              </div>

              {/* 5 — Impact potentiel sur le résultat */}
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4">
                <p className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wide mb-2">{s.impact}</p>
                <p className="text-sm text-zinc-200 leading-relaxed">{a.impact}</p>
              </div>

              <p className="text-[10px] text-zinc-500 italic">{t.ai.disclaimer}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
