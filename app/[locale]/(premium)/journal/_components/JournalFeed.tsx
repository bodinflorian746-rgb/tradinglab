"use client";

// Liste des trades AVEC filtres légers (client). Remplace l'usage de JournalList
// dans la page : on garde exactement le même rendu de carte (JournalCard), on
// ajoute juste une barre de filtres mobile-first au-dessus.
//
// Aucune librairie : <select> natifs + state local. Les filtres opèrent sur les
// entrées déjà chargées (mock ou Supabase plus tard, indifféremment).

import { useMemo, useState } from "react";
import {
  TIMEFRAMES,
  SETUPS,
  RESULTS,
  type TradeEntryView,
} from "@/lib/journal/types";
import type { Locale } from "@/i18n/config";
import type { Dictionaries } from "@/i18n/dictionaries";
import { JournalCard } from "./JournalCard";

type JournalDict = Dictionaries["journal"];

type Period = "all" | "7" | "30" | "90";

const selectClass =
  "bg-zinc-900/70 border border-zinc-700/70 focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40 rounded-lg px-2.5 py-2 text-xs text-white outline-none transition-colors min-w-0 max-w-full";

export function JournalFeed({
  entries,
  t,
  locale,
}: {
  entries: TradeEntryView[];
  t: JournalDict;
  locale: Locale;
}) {
  const f = t.filters;
  const [asset, setAsset] = useState("");
  const [result, setResult] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const [setup, setSetup] = useState("");
  const [period, setPeriod] = useState<Period>("all");
  // Borne temporelle calculée AU CHANGEMENT de période (Date.now() est impur →
  // interdit en render, mais autorisé dans un event handler). 0 = aucune borne.
  const [cutoffTs, setCutoffTs] = useState(0);

  function onPeriodChange(value: Period) {
    setPeriod(value);
    setCutoffTs(value === "all" ? 0 : Date.now() - Number(value) * 24 * 60 * 60 * 1000);
  }

  // Actifs réellement présents (triés), pour ne proposer que des options utiles.
  const assets = useMemo(
    () =>
      [...new Set(entries.map((e) => e.asset).filter(Boolean))].sort((a, b) =>
        a.localeCompare(b),
      ),
    [entries],
  );

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      if (asset && e.asset !== asset) return false;
      if (result && e.result !== result) return false;
      if (timeframe && e.timeframe !== timeframe) return false;
      if (setup && e.setup !== setup) return false;
      if (cutoffTs > 0) {
        const ts = new Date(e.trade_date).getTime();
        if (Number.isNaN(ts) || ts < cutoffTs) return false;
      }
      return true;
    });
  }, [entries, asset, result, timeframe, setup, cutoffTs]);

  const hasActiveFilter =
    !!asset || !!result || !!timeframe || !!setup || period !== "all";

  function reset() {
    setAsset("");
    setResult("");
    setTimeframe("");
    setSetup("");
    setPeriod("all");
    setCutoffTs(0);
  }

  return (
    <section>
      <div className="flex items-center justify-between gap-3 mb-3">
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">
          {t.list.title}
        </h2>
        <span className="text-[11px] text-zinc-500 tabular-nums shrink-0">
          {f.count.replace("{n}", String(filtered.length))}
        </span>
      </div>

      {/* Barre de filtres — wrap (jamais d'overflow horizontal sur mobile). */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <select
          aria-label={f.asset}
          value={asset}
          onChange={(e) => setAsset(e.target.value)}
          className={selectClass}
        >
          <option value="">{f.asset}</option>
          {assets.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>

        <select
          aria-label={f.result}
          value={result}
          onChange={(e) => setResult(e.target.value)}
          className={selectClass}
        >
          <option value="">{f.result}</option>
          {RESULTS.map((r) => (
            <option key={r} value={r}>
              {t.options.result[r]}
            </option>
          ))}
        </select>

        <select
          aria-label={f.timeframe}
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className={selectClass}
        >
          <option value="">{f.timeframe}</option>
          {TIMEFRAMES.map((tf) => (
            <option key={tf} value={tf}>
              {tf}
            </option>
          ))}
        </select>

        <select
          aria-label={f.setup}
          value={setup}
          onChange={(e) => setSetup(e.target.value)}
          className={selectClass}
        >
          <option value="">{f.setup}</option>
          {SETUPS.map((s) => (
            <option key={s} value={s}>
              {t.options.setup[s]}
            </option>
          ))}
        </select>

        <select
          aria-label={f.period}
          value={period}
          onChange={(e) => onPeriodChange(e.target.value as Period)}
          className={selectClass}
        >
          <option value="all">{f.periodAll}</option>
          <option value="7">{f.period7}</option>
          <option value="30">{f.period30}</option>
          <option value="90">{f.period90}</option>
        </select>

        {hasActiveFilter && (
          <button
            type="button"
            onClick={reset}
            className="text-xs font-medium text-zinc-400 hover:text-emerald-300 border border-zinc-700/70 hover:border-emerald-500/40 rounded-lg px-2.5 py-2 transition-colors"
          >
            {f.reset}
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30 px-6 py-12 text-center">
          <p className="text-sm text-zinc-400">{f.noMatch}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((entry) => (
            <JournalCard key={entry.id} entry={entry} t={t} locale={locale} />
          ))}
        </div>
      )}
    </section>
  );
}
