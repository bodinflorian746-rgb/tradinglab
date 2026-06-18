"use client";

// Bouton de suppression d'un trade. Confirme avant d'appeler la Server Action.
// La RLS garantit qu'un user ne peut supprimer que ses propres trades.

import { deleteTradeEntry } from "../actions";

export function DeleteTradeButton({
  id,
  label,
  confirmText,
}: {
  id: string;
  label: string;
  confirmText: string;
}) {
  return (
    <form
      action={deleteTradeEntry}
      onSubmit={(e) => {
        if (!window.confirm(confirmText)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-red-400 transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M3 4.5h10M6.5 4.5V3.5a1 1 0 011-1h1a1 1 0 011 1v1M5 4.5l.5 8a1 1 0 001 1h3a1 1 0 001-1l.5-8"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {label}
      </button>
    </form>
  );
}
