"use client";

// Bouton « Renvoyer le code » de /code-envoye. Client Component (useActionState)
// pour l'état inline : chargement, « Code renvoyé », ou message clair si la
// limite anti-spam est atteinte — sans redirect. Co-localisé (pas un composant
// partagé). Localisation inline FR/ES/EN via useLocale (aucune clé de dico
// ajoutée).

import { useActionState } from "react";
import { useLocale } from "@/app/components/LocaleProvider";
import { resendTrialCode, type ResendState } from "./actions";

const T = {
  fr: {
    resend: "Renvoyer le code",
    sending: "Envoi…",
    resent: "Code renvoyé ✓",
    consumed: "Ton essai a déjà été activé.",
    no_stored_code: "Aucun code à renvoyer. Utilise « J'ai mon code » pour l'activer.",
    rate_limited:
      "Tu as déjà renvoyé le code plusieurs fois. Réessaie dans un moment ou vérifie tes spams.",
    not_logged_in: "Session expirée. Reconnecte-toi puis réessaie.",
    generic: "Le renvoi a échoué. Réessaie dans un instant.",
  },
  en: {
    resend: "Resend the code",
    sending: "Sending…",
    resent: "Code resent ✓",
    consumed: "Your trial has already been activated.",
    no_stored_code: "No code to resend. Use “I have my code” to activate it.",
    rate_limited:
      "You've already resent the code several times. Try again later or check your spam folder.",
    not_logged_in: "Your session expired. Log in again and retry.",
    generic: "Resending failed. Please try again in a moment.",
  },
  es: {
    resend: "Reenviar el código",
    sending: "Enviando…",
    resent: "Código reenviado ✓",
    consumed: "Tu prueba ya ha sido activada.",
    no_stored_code: "No hay código que reenviar. Usa «Tengo mi código» para activarlo.",
    rate_limited:
      "Ya has reenviado el código varias veces. Inténtalo más tarde o revisa tu carpeta de spam.",
    not_logged_in: "Tu sesión ha expirado. Inicia sesión de nuevo e inténtalo.",
    generic: "El reenvío falló. Inténtalo de nuevo en un momento.",
  },
} as const;

function errorMessage(state: ResendState | null, t: (typeof T)[keyof typeof T]): string {
  if (!state || state.status !== "error") return "";
  return t[state.reason];
}

export default function ResendButton() {
  const locale = useLocale();
  const t = T[locale];
  const [state, formAction, pending] = useActionState<ResendState | null, FormData>(
    resendTrialCode,
    null,
  );

  if (state?.status === "success") {
    return (
      <p className="mb-3 text-sm font-semibold text-emerald-400" role="status">
        {t.resent}
      </p>
    );
  }

  return (
    <form action={formAction} className="mb-3">
      <input type="hidden" name="locale" value={locale} />
      <button
        type="submit"
        disabled={pending}
        className="block w-full text-center bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/15 disabled:opacity-60 disabled:pointer-events-none font-semibold py-2.5 rounded-xl transition-colors text-sm"
      >
        {pending ? t.sending : t.resend}
      </button>
      {state?.status === "error" && (
        <p className="mt-2 text-[12px] text-zinc-500 leading-relaxed" role="alert">
          {errorMessage(state, t)}
        </p>
      )}
    </form>
  );
}
