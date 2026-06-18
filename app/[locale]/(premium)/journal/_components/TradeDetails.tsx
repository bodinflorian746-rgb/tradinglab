"use client";

// Fiche complète d'un trade — vue « Détails du trade » (modale lisible).
// Présentationnel : toutes les infos importantes regroupées proprement.

import { useEffect, useState } from "react";
import type { TradeEntryView } from "@/lib/journal/types";
import type { Locale } from "@/i18n/config";
import type { Dictionaries } from "@/i18n/dictionaries";

type JournalDict = Dictionaries["journal"];

const LOCALE_TAG: Record<Locale, string> = { fr: "fr-FR", en: "en-US", es: "es-ES" };

function formatDate(iso: string, locale: Locale): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(LOCALE_TAG[locale], {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function Row({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-zinc-800/60 last:border-b-0">
      <span className="text-xs text-zinc-500">{label}</span>
      <span className="text-sm text-zinc-200 text-right tabular-nums">{value}</span>
    </div>
  );
}

export function TradeDetails({
  entry,
  t,
  locale,
}: {
  entry: TradeEntryView;
  t: JournalDict;
  locale: Locale;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const mistake =
    entry.perceived_mistake && entry.perceived_mistake !== "none"
      ? t.options.main_mistake[entry.perceived_mistake]
      : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-emerald-300 transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
          <path d="M8 7.3v3.4M8 5.2h.01" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        {t.card.seeDetails}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={t.card.details}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl bg-zinc-950 border border-zinc-800 max-h-[92vh] overflow-y-auto">
            {/* En-tête */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b border-zinc-800/70 bg-zinc-950/95 backdrop-blur">
              <div className="flex items-center gap-2.5">
                <span className="text-base font-bold text-white">{entry.asset}</span>
                <span className="text-[11px] text-zinc-500 font-medium">{entry.timeframe}</span>
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
              {entry.screenshot_signed_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={entry.screenshot_signed_url}
                  alt={`${t.card.screenshot} ${entry.asset}`}
                  className="w-full rounded-xl border border-zinc-800 object-contain max-h-56 bg-black/30"
                />
              )}

              {/* Faits */}
              <div>
                <p className="text-[10px] uppercase tracking-wide text-emerald-400 font-semibold mb-1">{t.capture.manual.facts}</p>
                <Row label={t.form.asset} value={entry.asset} />
                <Row label={t.form.timeframe} value={entry.timeframe} />
                <Row label={t.form.direction} value={t.options.direction[entry.direction]} />
                <Row label={t.form.tradeType} value={t.options.trade_type[entry.trade_type]} />
                <Row label={t.form.result} value={t.options.result[entry.result]} />
                <Row label={t.form.setup} value={entry.setup ? t.options.setup[entry.setup] : null} />
                <Row label={t.form.marketTrend} value={entry.market_trend ? t.options.market_trend[entry.market_trend] : null} />
                <Row label={t.form.session} value={entry.session ? t.options.session[entry.session] : null} />
                <Row label={t.form.platform} value={entry.platform ? t.options.platform[entry.platform] : null} />
                <Row label={t.form.tradeDate} value={formatDate(entry.trade_date, locale)} />
              </div>

              {/* Risque */}
              {(entry.entry_price !== null ||
                entry.stop_loss !== null ||
                entry.take_profit !== null ||
                entry.risk_percent !== null ||
                entry.r_multiple !== null) && (
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-emerald-400 font-semibold mb-1">{t.capture.manual.risk}</p>
                  <Row label={t.card.entry} value={entry.entry_price !== null ? String(entry.entry_price) : null} />
                  <Row label={t.card.sl} value={entry.stop_loss !== null ? String(entry.stop_loss) : null} />
                  <Row label={t.card.tp} value={entry.take_profit !== null ? String(entry.take_profit) : null} />
                  <Row label={t.card.risk} value={entry.risk_percent !== null ? `${entry.risk_percent}%` : null} />
                  <Row label={t.card.rMultiple} value={entry.r_multiple !== null ? `${entry.r_multiple}R` : null} />
                </div>
              )}

              {/* Ressenti */}
              {(entry.emotion_before ||
                entry.emotion_during ||
                entry.emotion_after ||
                entry.followed_plan ||
                mistake) && (
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-emerald-400 font-semibold mb-1">{t.capture.manual.feeling}</p>
                  <Row label={t.card.emotionBefore} value={entry.emotion_before ? t.options.emotion_before[entry.emotion_before] : null} />
                  <Row label={t.card.emotionDuring} value={entry.emotion_during ? t.options.emotion_during[entry.emotion_during] : null} />
                  <Row label={t.card.emotionAfter} value={entry.emotion_after ? t.options.emotion_after[entry.emotion_after] : null} />
                  <Row label={t.card.plan} value={entry.followed_plan ? t.options.followed_plan[entry.followed_plan] : null} />
                  <Row label={t.card.mistake} value={mistake} />
                </div>
              )}

              {/* Commentaire */}
              {entry.user_comment && (
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-zinc-500 font-semibold mb-1.5">{t.form.userComment}</p>
                  <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3">
                    {entry.user_comment}
                  </p>
                </div>
              )}

              {/* Analyse IA */}
              {entry.ai_status === "analyzed" && (entry.ai_summary || entry.ai_feedback) && (
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-4 py-4 space-y-2">
                  <p className="text-[10px] uppercase tracking-wide text-emerald-400 font-semibold">{t.ai.badge.analyzed}</p>
                  {entry.ai_summary && <p className="text-sm text-zinc-200">{entry.ai_summary}</p>}
                  {entry.ai_feedback && <p className="text-sm text-zinc-300 leading-relaxed">{entry.ai_feedback}</p>}
                  {entry.ai_score !== null && (
                    <p className="text-xs text-emerald-400 font-medium">{t.ai.score}: {entry.ai_score}/100</p>
                  )}
                  <p className="text-[10px] text-zinc-500 italic">{t.ai.disclaimer}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
