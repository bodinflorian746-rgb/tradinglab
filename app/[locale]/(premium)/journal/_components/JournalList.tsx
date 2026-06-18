// Liste des trades (Server Component, présentationnel) — cartes empilées.

import type { TradeEntryView } from "@/lib/journal/types";
import type { Locale } from "@/i18n/config";
import type { Dictionaries } from "@/i18n/dictionaries";
import { JournalCard } from "./JournalCard";

type JournalDict = Dictionaries["journal"];

export function JournalList({
  entries,
  t,
  locale,
}: {
  entries: TradeEntryView[];
  t: JournalDict;
  locale: Locale;
}) {
  return (
    <section>
      <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-4">
        {t.list.title}
      </h2>
      <div className="flex flex-col gap-4">
        {entries.map((entry) => (
          <JournalCard key={entry.id} entry={entry} t={t} locale={locale} />
        ))}
      </div>
    </section>
  );
}
