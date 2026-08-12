// Carte "analyse réelle" du coach — alimentée par computeCoachInsights (calculs
// réels sur les trades), PAS par le mock. Server Component présentationnel.
//
// Chaque métrique est optionnelle : si l'échantillon est trop faible, la métrique
// vaut null côté calcul et n'est pas affichée. Si rien n'est exploitable, on
// montre un état "pas assez de données" (jamais de stat inventée).

import type { CoachInsights } from "@/lib/journal/insights";
import type { Dictionaries } from "@/i18n/dictionaries";

type JournalDict = Dictionaries["journal"];

// Petite tuile "label : valeur" avec winrate, colorée selon le ton (bon/mauvais).
function InsightTile({
  label,
  value,
  meta,
  tone,
}: {
  label: string;
  value: string;
  meta?: string;
  tone: "good" | "bad" | "neutral";
}) {
  const valueColor =
    tone === "good"
      ? "text-emerald-300"
      : tone === "bad"
        ? "text-amber-300"
        : "text-zinc-200";
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 flex flex-col gap-0.5 min-w-0">
      <span className="text-[10px] uppercase tracking-wide text-zinc-500">{label}</span>
      <span className={`text-sm font-semibold truncate ${valueColor}`}>{value}</span>
      {meta && <span className="text-[11px] text-zinc-500 tabular-nums">{meta}</span>}
    </div>
  );
}

export function CoachDataInsights({
  insights,
  t,
}: {
  insights: CoachInsights;
  t: JournalDict;
}) {
  const i = t.insights;
  const wr = (n: number) => `${n}% ${i.winrateShort}`;
  const tradesMeta = (n: number) => `${n} ${i.trades}`;

  // État "pas assez de données" : ni assez de trades décisifs, ni aucune
  // métrique exploitable.
  const hasAny =
    insights.bestSetup ||
    insights.bestSession ||
    insights.bestDirection ||
    insights.bestHour ||
    insights.bestAsset ||
    insights.bestWeekday ||
    insights.topMistake ||
    insights.plan ||
    insights.winEmotion ||
    insights.lossEmotion;

  if (!insights.enough || !hasAny) {
    return (
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <div className="flex items-center gap-2.5 mb-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400/70" />
          <h2 className="text-sm font-semibold text-white">{i.title}</h2>
        </div>
        <p className="text-sm text-zinc-400">{i.notEnough}</p>
        <p className="text-xs text-zinc-500 mt-1">{i.notEnoughHint}</p>
      </section>
    );
  }

  // Paires best/worst (affichées seulement si calculées).
  const pairs: { label: string; group: NonNullable<CoachInsights["bestSetup"]>; tone: "good" | "bad"; render: (key: string) => string }[] = [];
  const pushPair = (
    bestLabel: string,
    worstLabel: string,
    best: CoachInsights["bestSetup"],
    worst: CoachInsights["bestSetup"],
    render: (key: string) => string,
  ) => {
    if (best) pairs.push({ label: bestLabel, group: best, tone: "good", render });
    if (worst) pairs.push({ label: worstLabel, group: worst, tone: "bad", render });
  };

  pushPair(i.bestSetup, i.worstSetup, insights.bestSetup, insights.worstSetup, (k) => t.options.setup[k as keyof typeof t.options.setup] ?? k);
  pushPair(i.bestSession, i.worstSession, insights.bestSession, insights.worstSession, (k) => t.options.session[k as keyof typeof t.options.session] ?? k);
  pushPair(i.bestDirection, i.worstDirection, insights.bestDirection, insights.worstDirection, (k) => t.options.direction[k as keyof typeof t.options.direction] ?? k);
  pushPair(i.bestAsset, i.worstAsset, insights.bestAsset, insights.worstAsset, (k) => k);
  pushPair(i.bestHour, i.worstHour, insights.bestHour, insights.worstHour, (k) => {
    const next = (parseInt(k, 10) + 1) % 24;
    return `${k}:00–${String(next).padStart(2, "0")}:00`;
  });
  pushPair(i.bestWeekday, i.worstWeekday, insights.bestWeekday, insights.worstWeekday, (k) => t.options.weekday[k as keyof typeof t.options.weekday] ?? k);

  return (
    <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
      <div className="flex items-center justify-between gap-3 mb-1.5">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400/70" />
          <h2 className="text-sm font-semibold text-white">{i.title}</h2>
        </div>
        <span className="text-[11px] text-zinc-500 tabular-nums">
          {insights.sampleSize} {i.trades}
        </span>
      </div>
      <p className="text-xs text-zinc-500 mb-4">{i.subtitle}</p>

      {/* Best / worst : setup, session, direction */}
      {pairs.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
          {pairs.map((p, idx) => (
            <InsightTile
              key={`${p.label}-${idx}`}
              label={p.label}
              value={p.render(p.group.key)}
              meta={`${wr(p.group.winrate)} · ${tradesMeta(p.group.trades)}`}
              tone={p.tone}
            />
          ))}
        </div>
      )}

      {/* Erreur fréquente + plan vs résultat */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        {insights.topMistake && (
          <InsightTile
            label={i.topMistake}
            value={t.options.main_mistake[insights.topMistake.key]}
            meta={`${insights.topMistake.count} ${i.occurrences}`}
            tone="bad"
          />
        )}
        {insights.plan && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[10px] uppercase tracking-wide text-zinc-500">{i.planRespect}</span>
            <div className="flex items-center gap-4">
              <span className="text-sm">
                <span className="text-zinc-500 text-xs">{i.planYes} </span>
                <span className="font-semibold text-emerald-300 tabular-nums">{insights.plan.yesWinrate}%</span>
              </span>
              <span className="text-sm">
                <span className="text-zinc-500 text-xs">{i.planNo} </span>
                <span className="font-semibold text-amber-300 tabular-nums">{insights.plan.noWinrate}%</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Émotions associées aux gains / pertes */}
      {(insights.winEmotion || insights.lossEmotion) && (
        <div className="grid grid-cols-2 gap-3">
          {insights.winEmotion && (
            <InsightTile
              label={i.winEmotion}
              value={t.options.emotion_before[insights.winEmotion.key]}
              meta={`${insights.winEmotion.count} ${i.occurrences}`}
              tone="good"
            />
          )}
          {insights.lossEmotion && (
            <InsightTile
              label={i.lossEmotion}
              value={t.options.emotion_before[insights.lossEmotion.key]}
              meta={`${insights.lossEmotion.count} ${i.occurrences}`}
              tone="bad"
            />
          )}
        </div>
      )}
    </section>
  );
}
