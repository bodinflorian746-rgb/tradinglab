"use client";

// Bouton "Ajouter un trade" — ouvre le flux capture-first (CaptureFirstFlow).

import { useState } from "react";
import { useDict } from "@/app/components/LocaleProvider";
import { CaptureFirstFlow } from "./CaptureFirstFlow";

export function AddTradeButton({ variant }: { variant: "primary" | "empty" }) {
  const t = useDict("journal");
  const [open, setOpen] = useState(false);

  const triggerClass =
    variant === "primary"
      ? "inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shrink-0"
      : "inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-sm font-semibold px-5 py-3 rounded-xl transition-colors";

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={triggerClass}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        {variant === "primary" ? t.addTrade : t.empty.cta}
      </button>

      {open && <CaptureFirstFlow onClose={() => setOpen(false)} />}
    </>
  );
}
