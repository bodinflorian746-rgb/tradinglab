"use client";

// CTA "Accéder via un broker partenaire" avec modal de confirmation préalable.
// Affiche les conditions du dépôt 200 € avant la redirection vers /login.
// Le contenu (titre, bullets, labels boutons) est passé via props depuis le
// dictionnaire serveur — aucune string en dur ici.

import Link from "next/link";
import { useEffect, useState } from "react";

type Strings = {
  cta: string;
  modal: {
    title: string;
    bullets: string[];
    continueLabel: string;
    cancelLabel: string;
  };
};

export default function BrokerConfirmCTA({
  locale,
  strings,
}: {
  locale: string;
  strings: Strings;
}) {
  const [open, setOpen] = useState(false);

  // Esc ferme la modal.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block w-full text-center bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold py-3 rounded-xl transition-colors text-sm"
      >
        {strings.cta}
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={strings.modal.title}
          className="fixed inset-0 z-50 flex items-center justify-center px-6 py-12"
        >
          {/* Backdrop : clic ferme la modal */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-zinc-950/80"
            onClick={() => setOpen(false)}
          />

          <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">{strings.modal.title}</h2>

            <ul className="space-y-2.5 mb-6 text-sm text-zinc-300 leading-relaxed">
              {strings.modal.bullets.map((b) => (
                <li key={b} className="flex gap-2">
                  <span aria-hidden="true" className="shrink-0 text-emerald-400 mt-0.5">•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <Link
              href={`/${locale}/login`}
              className="block w-full text-center bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold py-3 rounded-xl transition-colors text-sm mb-3"
            >
              {strings.modal.continueLabel}
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="block w-full text-center text-sm text-zinc-400 hover:text-zinc-200 underline underline-offset-4 py-2 transition-colors"
            >
              {strings.modal.cancelLabel}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
