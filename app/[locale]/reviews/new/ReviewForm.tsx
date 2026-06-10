"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

type Lang = "fr" | "es";

type Copy = {
  breadcrumbHome: string;
  breadcrumbCurrent: string;
  title: string;
  subtitle: string;
  ratingLabel: string;
  ratingHint: string;
  emailLabel: string;
  emailHint: string;
  messageLabel: string;
  messagePlaceholder: string;
  submit: string;
  submitting: string;
  successTitle: string;
  successBody: string;
  errorEmpty: string;
  errorGeneric: string;
  backHome: string;
};

const COPY: Record<Lang, Copy> = {
  fr: {
    breadcrumbHome: "Accueil",
    breadcrumbCurrent: "Laisser un avis",
    title: "Laisse-nous ton avis",
    subtitle:
      "Ton retour nous aide à améliorer la plateforme. 2 minutes suffisent.",
    ratingLabel: "Note ton expérience",
    ratingHint: "Optionnel — sur 5",
    emailLabel: "Ton email",
    emailHint: "Optionnel — si tu veux qu'on te recontacte",
    messageLabel: "Ton message",
    messagePlaceholder:
      "Ce qui marche, ce qui pourrait être mieux, une fonctionnalité manquante…",
    submit: "Envoyer mon avis",
    submitting: "Envoi en cours…",
    successTitle: "Merci pour ton retour",
    successBody: "Ton avis a bien été envoyé. On lit chaque message.",
    errorEmpty: "Ton message ne peut pas être vide.",
    errorGeneric: "L'envoi a échoué. Réessaie dans un instant.",
    backHome: "Retour à l'accueil",
  },
  es: {
    breadcrumbHome: "Inicio",
    breadcrumbCurrent: "Dejar una opinión",
    title: "Déjanos tu opinión",
    subtitle:
      "Tu opinión nos ayuda a mejorar la plataforma. 2 minutos bastan.",
    ratingLabel: "Califica tu experiencia",
    ratingHint: "Opcional — sobre 5",
    emailLabel: "Tu email",
    emailHint: "Opcional — si quieres que te contactemos",
    messageLabel: "Tu mensaje",
    messagePlaceholder:
      "Lo que funciona, lo que podría mejorar, una funcionalidad que falta…",
    submit: "Enviar mi opinión",
    submitting: "Enviando…",
    successTitle: "Gracias por tu opinión",
    successBody: "Tu opinión se ha enviado correctamente. Leemos cada mensaje.",
    errorEmpty: "Tu mensaje no puede estar vacío.",
    errorGeneric: "El envío falló. Inténtalo de nuevo en un momento.",
    backHome: "Volver al inicio",
  },
};

type State = "idle" | "sending" | "success" | "error";

export function ReviewForm({ locale }: { locale: Lang }) {
  const t = COPY[locale];
  const [rating, setRating] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) {
      setErrorMsg(t.errorEmpty);
      setState("error");
      return;
    }

    setErrorMsg(null);
    setState("sending");

    try {
      const res = await fetch("/api/avis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          email: email.trim() || undefined,
          message: trimmed,
        }),
      });
      const data: unknown = await res.json().catch(() => ({}));
      const ok =
        res.ok &&
        typeof data === "object" &&
        data !== null &&
        (data as { ok?: unknown }).ok === true;
      if (!ok) {
        setErrorMsg(t.errorGeneric);
        setState("error");
        return;
      }
      setState("success");
    } catch {
      setErrorMsg(t.errorGeneric);
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="text-emerald-400"
              aria-hidden="true"
            >
              <path
                d="M3 10l4.5 4.5 9.5-9"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-3">{t.successTitle}</h1>
          <p className="text-sm text-zinc-400 leading-relaxed mb-6">{t.successBody}</p>
          <Link
            href={`/${locale}`}
            className="text-sm text-emerald-400 hover:text-emerald-300 underline underline-offset-4 transition-colors"
          >
            {t.backHome}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 py-12 md:py-16">
      <div className="max-w-2xl mx-auto">

        <nav className="mb-8 text-sm text-zinc-500">
          <Link href={`/${locale}`} className="hover:text-zinc-300 transition-colors">
            {t.breadcrumbHome}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-300">{t.breadcrumbCurrent}</span>
        </nav>

        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">{t.title}</h1>
          <p className="text-zinc-400 text-base md:text-lg max-w-xl leading-relaxed">{t.subtitle}</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Note 1-5 */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-2">{t.ratingLabel}</label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => {
                const selected = rating !== null && n <= rating;
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(rating === n ? null : n)}
                    className={`w-10 h-10 rounded-lg border text-sm font-semibold transition-colors ${
                      selected
                        ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                        : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                    }`}
                    aria-label={`${n}/5`}
                    aria-pressed={selected}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-[11px] text-zinc-500">{t.ratingHint}</p>
          </div>

          {/* Email (optional) */}
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-zinc-400 mb-1.5">
              {t.emailLabel}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 focus:border-emerald-500 focus:outline-none transition-colors text-sm"
            />
            <p className="mt-1 text-[11px] text-zinc-500">{t.emailHint}</p>
          </div>

          {/* Message (required) */}
          <div>
            <label htmlFor="message" className="block text-xs font-medium text-zinc-400 mb-1.5">
              {t.messageLabel}
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={6}
              placeholder={t.messagePlaceholder}
              className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 focus:border-emerald-500 focus:outline-none transition-colors text-sm resize-y"
            />
          </div>

          {/* Error banner */}
          {state === "error" && errorMsg && (
            <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-300">
              {errorMsg}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={state === "sending"}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-950 font-semibold py-3 rounded-xl transition-colors text-sm"
          >
            {state === "sending" ? t.submitting : t.submit}
          </button>
        </form>
      </div>
    </main>
  );
}
