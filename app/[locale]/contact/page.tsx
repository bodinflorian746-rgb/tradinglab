"use client";

// Page Contact — formulaire envoyant un email via Resend (Server Action
// sendContactMessage). Client Component pour useActionState (état
// chargement/succès/erreur sans redirect). Localisation inline FR/ES/EN, même
// pattern que app/[locale]/page.tsx et les pages légales. Palette zinc-950 +
// emerald-500 (rouge discret pour les erreurs, cohérent avec le reste du site).
//
// Note : page cliente → pas de generateMetadata (impossible en Client
// Component). Le titre par défaut du layout s'applique.

import { useActionState } from "react";
import { useLocale } from "@/app/components/LocaleProvider";
import { sendContactMessage, type ContactState } from "./actions";

const T = {
  fr: {
    title: "Contact",
    intro:
      "Une question, un problème ou une suggestion ? Écris-nous, on te répond au plus vite.",
    name: "Nom",
    namePlaceholder: "Ton nom",
    email: "Email",
    emailPlaceholder: "ton@email.com",
    subject: "Sujet",
    subjectPlaceholder: "Choisis un sujet",
    subjectOptions: [
      "Question générale",
      "Problème technique",
      "Facturation / abonnement",
      "Partenariat",
      "Autre",
    ],
    message: "Message",
    messagePlaceholder: "Explique-nous en quelques lignes…",
    send: "Envoyer le message",
    sending: "Envoi en cours…",
    successTitle: "Message envoyé",
    successBody:
      "Merci, on te répond dès que possible à l'adresse que tu as indiquée.",
    errorInvalid: "Merci de vérifier les champs surlignés.",
    errorGeneric: "L'envoi a échoué. Réessaie dans un instant.",
  },
  en: {
    title: "Contact",
    intro:
      "A question, an issue or a suggestion? Write to us, we'll get back to you as soon as possible.",
    name: "Name",
    namePlaceholder: "Your name",
    email: "Email",
    emailPlaceholder: "you@email.com",
    subject: "Subject",
    subjectPlaceholder: "Choose a subject",
    subjectOptions: [
      "General question",
      "Technical issue",
      "Billing / subscription",
      "Partnership",
      "Other",
    ],
    message: "Message",
    messagePlaceholder: "Tell us in a few lines…",
    send: "Send message",
    sending: "Sending…",
    successTitle: "Message sent",
    successBody:
      "Thanks, we'll get back to you as soon as possible at the address you provided.",
    errorInvalid: "Please check the highlighted fields.",
    errorGeneric: "Sending failed. Please try again in a moment.",
  },
  es: {
    title: "Contacto",
    intro:
      "¿Una pregunta, un problema o una sugerencia? Escríbenos, te respondemos lo antes posible.",
    name: "Nombre",
    namePlaceholder: "Tu nombre",
    email: "Email",
    emailPlaceholder: "tu@email.com",
    subject: "Asunto",
    subjectPlaceholder: "Elige un asunto",
    subjectOptions: [
      "Pregunta general",
      "Problema técnico",
      "Facturación / suscripción",
      "Colaboración",
      "Otro",
    ],
    message: "Mensaje",
    messagePlaceholder: "Cuéntanos en unas líneas…",
    send: "Enviar mensaje",
    sending: "Enviando…",
    successTitle: "Mensaje enviado",
    successBody:
      "Gracias, te responderemos lo antes posible a la dirección que has indicado.",
    errorInvalid: "Por favor, revisa los campos resaltados.",
    errorGeneric: "El envío falló. Inténtalo de nuevo en un momento.",
  },
} as const;

const inputBase =
  "w-full bg-zinc-900 border rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none transition-colors";
const okBorder = "border-zinc-800 focus:border-emerald-500/50";
const errBorder = "border-red-500/50 focus:border-red-500/70";

export default function ContactPage() {
  const locale = useLocale();
  const t = T[locale];
  const [state, formAction, pending] = useActionState<ContactState | null, FormData>(
    sendContactMessage,
    null,
  );

  const f = state?.fields ?? {};
  const showError = state && !state.ok;

  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 py-16 md:py-20">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">{t.title}</h1>
        <p className="text-[15px] text-zinc-400 leading-relaxed mb-10">{t.intro}</p>

        {state?.ok ? (
          <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-8 text-center">
            <div className="mx-auto mb-5 w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="8.2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M7 11l2.5 2.5 5-5.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">{t.successTitle}</h2>
            <p className="text-sm text-zinc-400 leading-relaxed">{t.successBody}</p>
          </div>
        ) : (
          <form action={formAction} className="space-y-5" noValidate>
            {/* Honeypot anti-spam : caché aux humains, rempli par les bots. */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />

            <div>
              <label htmlFor="name" className="block text-[13px] font-medium text-zinc-300 mb-2">
                {t.name}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                maxLength={100}
                required
                placeholder={t.namePlaceholder}
                className={`${inputBase} ${f.name ? errBorder : okBorder}`}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-[13px] font-medium text-zinc-300 mb-2">
                {t.email}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                maxLength={200}
                required
                placeholder={t.emailPlaceholder}
                className={`${inputBase} ${f.email ? errBorder : okBorder}`}
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-[13px] font-medium text-zinc-300 mb-2">
                {t.subject}
              </label>
              <select
                id="subject"
                name="subject"
                required
                defaultValue=""
                className={`${inputBase} ${f.subject ? errBorder : okBorder}`}
              >
                <option value="" disabled>
                  {t.subjectPlaceholder}
                </option>
                {t.subjectOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-[13px] font-medium text-zinc-300 mb-2">
                {t.message}
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                maxLength={5000}
                required
                placeholder={t.messagePlaceholder}
                className={`${inputBase} resize-y ${f.message ? errBorder : okBorder}`}
              />
            </div>

            {showError && (
              <p className="text-sm text-red-400 leading-relaxed">
                {state?.error === "invalid" ? t.errorInvalid : t.errorGeneric}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 disabled:pointer-events-none text-zinc-950 font-semibold text-sm py-3 rounded-xl transition-colors"
            >
              {pending ? t.sending : t.send}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
