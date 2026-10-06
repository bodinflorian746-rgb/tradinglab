"use client";

// Champ mot de passe avec un bouton œil pour afficher / masquer la saisie.
// Remplace <input type="password"> partout : mêmes propriétés (id, name,
// required, autoComplete, className, value, onChange…), seul le type bascule
// entre « password » et « text ». Le bouton ne soumet jamais le formulaire
// (type="button") ; un clic souris ou tactile ne retire pas le focus du champ ;
// au clavier, il se rejoint par Tab et s'active par Entrée ou Espace.

import { useState, type InputHTMLAttributes } from "react";
import { useParams } from "next/navigation";

const LABELS = {
  fr: { show: "Afficher le mot de passe", hide: "Masquer le mot de passe" },
  es: { show: "Mostrar la contraseña", hide: "Ocultar la contraseña" },
  en: { show: "Show password", hide: "Hide password" },
} as const;

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export function PasswordInput({ className = "", ...props }: Props) {
  const [visible, setVisible] = useState(false);
  const locale = useParams<{ locale?: string }>()?.locale;
  const t = locale === "es" ? LABELS.es : locale === "en" ? LABELS.en : LABELS.fr;
  const label = visible ? t.hide : t.show;

  return (
    <div className="relative">
      <input {...props} type={visible ? "text" : "password"} className={`${className} pr-11`} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        // Clic souris / tactile : le champ garde le focus (et le curseur)
        onMouseDown={(e) => e.preventDefault()}
        aria-label={label}
        title={label}
        aria-pressed={visible}
        aria-controls={props.id}
        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-zinc-400 transition-colors hover:text-zinc-200 focus-visible:text-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500"
      >
        {visible ? (
          // Œil barré : le mot de passe est affiché, un clic le masque
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M10.6 5.1A10.5 10.5 0 0 1 12 5c5 0 8.7 3.4 10 7a11.7 11.7 0 0 1-3.1 4.4M6.1 6.6C4.2 7.9 2.8 9.8 2 12c1.3 3.6 5 7 10 7 1.8 0 3.4-.4 4.8-1.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        ) : (
          // Œil : le mot de passe est masqué, un clic l'affiche
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M2 12c1.3-3.6 5-7 10-7s8.7 3.4 10 7c-1.3 3.6-5 7-10 7S3.3 15.6 2 12z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        )}
      </button>
    </div>
  );
}
