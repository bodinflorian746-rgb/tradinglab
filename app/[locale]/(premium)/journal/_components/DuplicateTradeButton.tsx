"use client";

// Bouton « Dupliquer » — ouvre le flux pré-rempli à partir d'un trade existant,
// mais en mode CRÉATION (nouvel id généré côté enregistrement, date = maintenant).
// Mock : la sauvegarde simule la création (cf. createTradeEntry en mode démo).

import { useState } from "react";
import { useDict } from "@/app/components/LocaleProvider";
import type { TradeEntryView } from "@/lib/journal/types";
import { CaptureFirstFlow } from "./CaptureFirstFlow";

export function DuplicateTradeButton({ entry }: { entry: TradeEntryView }) {
  const t = useDict("journal");
  const [draft, setDraft] = useState<TradeEntryView | null>(null);

  // La copie est construite AU CLIC (new Date() est impur → interdit en render).
  // On repart des mêmes données, sans identité ni capture (le screenshot
  // appartient au trade d'origine), avec la date du jour.
  function openDuplicate() {
    setDraft({
      ...entry,
      id: "",
      trade_date: new Date().toISOString(),
      screenshot_url: null,
      screenshot_signed_url: null,
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={openDuplicate}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-emerald-300 transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
          <path d="M10.5 5.5V4a1.5 1.5 0 00-1.5-1.5H4A1.5 1.5 0 002.5 4v5A1.5 1.5 0 004 10.5h1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {t.card.duplicate}
      </button>

      {draft && (
        <CaptureFirstFlow initial={draft} asNew onClose={() => setDraft(null)} />
      )}
    </>
  );
}
