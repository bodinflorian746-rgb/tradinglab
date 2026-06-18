"use client";

// Bouton « Modifier » — ouvre le MÊME flux que la création, pré-rempli avec les
// données du trade (capture-first si capture présente, sinon manuel). Mock :
// aucune écriture réelle (la sauvegarde ferme simplement le flux).

import { useState } from "react";
import { useDict } from "@/app/components/LocaleProvider";
import type { TradeEntryView } from "@/lib/journal/types";
import { CaptureFirstFlow } from "./CaptureFirstFlow";

export function EditTradeButton({ entry }: { entry: TradeEntryView }) {
  const t = useDict("journal");
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-emerald-300 transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M11 2.5l2.5 2.5M3 13l.5-2.5L10.5 3.5l2 2L5.5 12.5 3 13z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {t.card.edit}
      </button>

      {open && <CaptureFirstFlow initial={entry} onClose={() => setOpen(false)} />}
    </>
  );
}
