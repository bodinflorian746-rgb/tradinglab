// Carte d'un trade (Server Component, présentationnel).
// Mobile-first : cartes empilées, jamais de table large.

import Image from "next/image";
import type { TradeEntryView } from "@/lib/journal/types";
import type { Locale } from "@/i18n/config";
import type { Dictionaries } from "@/i18n/dictionaries";
import { DeleteTradeButton } from "./DeleteTradeButton";
import { TradeDetails } from "./TradeDetails";
import { TradeAnalysisModal } from "./TradeAnalysisModal";
import { EditTradeButton } from "./EditTradeButton";

type JournalDict = Dictionaries["journal"];

const LOCALE_TAG: Record<Locale, string> = {
  fr: "fr-FR",
  en: "en-US",
  es: "es-ES",
};

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

const RESULT_STYLE: Record<string, string> = {
  win: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  loss: "text-red-400 bg-red-500/10 border-red-500/20",
  break_even: "text-zinc-300 bg-zinc-700/30 border-zinc-600/40",
  open: "text-amber-400 bg-amber-400/10 border-amber-400/20",
};

const AI_BADGE_STYLE: Record<string, string> = {
  pending: "text-zinc-400 bg-zinc-700/30 border-zinc-600/40",
  analyzed: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  failed: "text-red-400 bg-red-500/10 border-red-500/20",
  skipped: "text-zinc-400 bg-zinc-700/30 border-zinc-600/40",
};

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-wide text-zinc-500">{label}</span>
      <span className="text-sm text-zinc-200 tabular-nums">{value}</span>
    </div>
  );
}

export function JournalCard({
  entry,
  t,
  locale,
}: {
  entry: TradeEntryView;
  t: JournalDict;
  locale: Locale;
}) {
  const isBuy = entry.direction === "buy";
  const details: { label: string; value: string }[] = [];
  if (entry.entry_price !== null) details.push({ label: t.card.entry, value: String(entry.entry_price) });
  if (entry.stop_loss !== null) details.push({ label: t.card.sl, value: String(entry.stop_loss) });
  if (entry.take_profit !== null) details.push({ label: t.card.tp, value: String(entry.take_profit) });
  if (entry.risk_percent !== null) details.push({ label: t.card.risk, value: `${entry.risk_percent}%` });
  if (entry.r_multiple !== null) {
    details.push({
      label: t.card.rMultiple,
      value: `${entry.r_multiple > 0 ? "+" : ""}${entry.r_multiple}R`,
    });
  }

  return (
    <article className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5">
      {/* En-tête : actif + direction + résultat */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-base font-bold text-white">{entry.asset}</span>
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
              isBuy
                ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                : "text-red-400 bg-red-500/10 border-red-500/20"
            }`}
          >
            {isBuy ? "▲" : "▼"} {t.options.direction[entry.direction]}
          </span>
          <span className="text-[11px] text-zinc-500 font-medium">{entry.timeframe}</span>
          <span className="text-[11px] text-zinc-500 font-medium">
            · {t.options.trade_type[entry.trade_type]}
          </span>
        </div>
        <span
          className={`shrink-0 inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full border ${RESULT_STYLE[entry.result]}`}
        >
          {t.options.result[entry.result]}
        </span>
      </div>

      {/* Méta : date + plateforme + session + tendance */}
      <div className="flex items-center gap-2 text-xs text-zinc-500 mb-3 flex-wrap">
        <span>{formatDate(entry.trade_date, locale)}</span>
        {entry.platform && (
          <>
            <span aria-hidden>·</span>
            <span>{t.options.platform[entry.platform]}</span>
          </>
        )}
        {entry.session && (
          <>
            <span aria-hidden>·</span>
            <span>{t.options.session[entry.session]}</span>
          </>
        )}
        {entry.market_trend && (
          <>
            <span aria-hidden>·</span>
            <span>{t.options.market_trend[entry.market_trend]}</span>
          </>
        )}
      </div>

      {/* Setup */}
      {entry.setup && (
        <div className="mb-4">
          <span className="inline-flex items-center text-[11px] font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-1">
            {t.options.setup[entry.setup]}
          </span>
        </div>
      )}

      {/* Détails chiffrés */}
      {details.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
          {details.map((d) => (
            <Detail key={d.label} label={d.label} value={d.value} />
          ))}
        </div>
      )}

      {/* Capture */}
      {entry.screenshot_signed_url && (
        <a
          href={entry.screenshot_signed_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block relative w-full aspect-video rounded-xl overflow-hidden border border-zinc-800 mb-4"
        >
          <Image
            src={entry.screenshot_signed_url}
            alt={`${t.card.screenshot} ${entry.asset}`}
            fill
            sizes="(max-width: 768px) 100vw, 640px"
            className="object-cover"
            unoptimized
          />
        </a>
      )}

      {/* Commentaire utilisateur */}
      {entry.user_comment && (
        <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-800/30 rounded-xl px-4 py-3 mb-4">
          {entry.user_comment}
        </p>
      )}

      {/* Psychologie : plan + émotions + erreur ressentie */}
      {(entry.followed_plan ||
        entry.emotion_before ||
        entry.emotion_during ||
        entry.emotion_after ||
        (entry.perceived_mistake && entry.perceived_mistake !== "none")) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {entry.followed_plan && (
            <span className="text-[11px] text-zinc-300 bg-zinc-800/40 border border-zinc-700/50 rounded-full px-2.5 py-1">
              {t.card.plan}: {t.options.followed_plan[entry.followed_plan]}
            </span>
          )}
          {entry.emotion_before && (
            <span className="text-[11px] text-zinc-300 bg-zinc-800/40 border border-zinc-700/50 rounded-full px-2.5 py-1">
              {t.card.emotionBefore}: {t.options.emotion_before[entry.emotion_before]}
            </span>
          )}
          {entry.emotion_during && (
            <span className="text-[11px] text-zinc-300 bg-zinc-800/40 border border-zinc-700/50 rounded-full px-2.5 py-1">
              {t.card.emotionDuring}: {t.options.emotion_during[entry.emotion_during]}
            </span>
          )}
          {entry.emotion_after && (
            <span className="text-[11px] text-zinc-300 bg-zinc-800/40 border border-zinc-700/50 rounded-full px-2.5 py-1">
              {t.card.emotionAfter}: {t.options.emotion_after[entry.emotion_after]}
            </span>
          )}
          {entry.perceived_mistake && entry.perceived_mistake !== "none" && (
            <span className="text-[11px] text-amber-300 bg-amber-400/10 border border-amber-400/20 rounded-full px-2.5 py-1">
              {t.card.mistake}: {t.options.main_mistake[entry.perceived_mistake]}
            </span>
          )}
        </div>
      )}

      {/* Pied : statut IA + actions (analyse / détails / modifier / supprimer) */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pt-3 border-t border-zinc-800/60">
        <span
          className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full border ${AI_BADGE_STYLE[entry.ai_status]}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
          {t.ai.badge[entry.ai_status]}
        </span>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <TradeAnalysisModal entry={entry} t={t} />
          <TradeDetails entry={entry} t={t} locale={locale} />
          <EditTradeButton entry={entry} />
          <DeleteTradeButton
            id={entry.id}
            label={t.card.delete}
            confirmText={t.card.confirmDelete}
          />
        </div>
      </div>

      {/* Bloc IA détaillé — affiché uniquement quand l'analyse existe (V2) */}
      {entry.ai_status === "analyzed" && (entry.ai_summary || entry.ai_feedback) && (
        <div className="mt-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-4 py-4 space-y-3">
          {entry.ai_summary && (
            <p className="text-sm text-zinc-200">{entry.ai_summary}</p>
          )}
          {entry.ai_feedback && (
            <p className="text-sm text-zinc-300 leading-relaxed">{entry.ai_feedback}</p>
          )}
          {entry.ai_score !== null && (
            <p className="text-xs text-emerald-400 font-medium">
              {t.ai.score}: {entry.ai_score}/100
            </p>
          )}
          <p className="text-[10px] text-zinc-500 italic">{t.ai.disclaimer}</p>
        </div>
      )}
    </article>
  );
}
