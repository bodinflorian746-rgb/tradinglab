// Libellés + types du paywall premium, dans un module NEUTRE (pas de
// "use client"). Importable indifféremment par des Server Components
// (PremiumLockScreen, LockedContentLayout) et des Client Components
// (PremiumPaywall).
//
// ⚠ Ne PAS définir ces valeurs dans un fichier "use client" : un Server
// Component qui importerait la valeur depuis un module client ne recevrait
// qu'une référence client (proxy), pas l'objet réel → undefined au runtime.

import type { Locale } from "@/i18n/config";

export type PaywallReason = "trial_expired" | "not_logged_in";

export type PaywallStrings = {
  eyebrow: string;
  titleLocked: string;
  titleHasCode: string;
  subtitleNotLoggedIn: string;
  subtitleHasCode: string;
  ctaSignup: string;
  ctaActivate: string;
  ctaRequestCode: string;
  ctaSubscribe: string;
  ctaLogin: string;
  // Message de conversion de PremiumLockScreen, orienté « essai gratuit »
  // plutôt que « contenu bloqué » : petit label, gros titre (offre 48h),
  // liste d'avantages, réassurance, et micro-texte sous les CTA.
  contentLockedEyebrow: string;
  contentLockedTitle: string;
  contentLockedBenefits: string[];
  contentLockedReassurance: string;
  contentLockedMicrocopy: string;
};

export const PAYWALL_STRINGS: Record<Locale, PaywallStrings> = {
  fr: {
    eyebrow: "Accès Premium",
    titleLocked: "Accès Premium requis",
    titleHasCode: "Active tes 48h gratuites",
    subtitleNotLoggedIn:
      "Crée ton compte pour profiter de 48h d'essai gratuit, puis débloque tout TradeScaleX.",
    subtitleHasCode:
      "Reçois un code par email pour débloquer 48h gratuites, ou utilise un code que tu as déjà reçu.",
    ctaSignup: "Essayer 48h gratuit",
    ctaActivate: "J'ai mon code",
    ctaRequestCode: "Recevoir mes 48h gratuites",
    ctaSubscribe: "Voir nos accès",
    ctaLogin: "Se connecter",
    contentLockedEyebrow: "🔒 LEÇON PREMIUM",
    contentLockedTitle:
      "Profite de 48 heures offertes pour découvrir toute la plateforme TradeScaleX.",
    contentLockedBenefits: [
      "✅ Toutes les leçons de trading",
      "✅ Toutes les stratégies de trading",
      "✅ Toutes les analyses macroéconomiques",
      "✅ Tous les jeux interactifs",
    ],
    contentLockedReassurance: "✓ Aucune carte bancaire n'est demandée pour commencer.",
    contentLockedMicrocopy:
      "Essai gratuit • Sans engagement • Activation en moins d'une minute",
  },
  en: {
    eyebrow: "Premium access",
    titleLocked: "Premium access required",
    titleHasCode: "Activate your 48h free trial",
    subtitleNotLoggedIn:
      "Sign up to start your 48h free trial, then unlock the full TradeScaleX experience.",
    subtitleHasCode:
      "You received a code by email when you signed up. Enter it to activate your 48h free trial and unlock all of TradeScaleX.",
    ctaSignup: "Start 48h free trial",
    ctaActivate: "I have my code",
    ctaRequestCode: "Get my 48h free trial",
    ctaSubscribe: "See plans",
    ctaLogin: "Log in",
    contentLockedEyebrow: "🔒 PREMIUM LESSON",
    contentLockedTitle:
      "Enjoy 48 free hours to explore the entire TradeScaleX platform.",
    contentLockedBenefits: [
      "✅ All trading lessons",
      "✅ All trading strategies",
      "✅ All macroeconomic analyses",
      "✅ All interactive games",
    ],
    contentLockedReassurance: "✓ No credit card required to get started.",
    contentLockedMicrocopy:
      "Free trial • No commitment • Activated in under a minute",
  },
  es: {
    eyebrow: "Acceso Premium",
    titleLocked: "Acceso Premium requerido",
    titleHasCode: "Activa tus 48 h gratis",
    subtitleNotLoggedIn:
      "Crea tu cuenta para empezar una prueba gratuita de 48 h y desbloquear todo TradeScaleX.",
    subtitleHasCode:
      "Recibe un código por email para desbloquear 48 h gratuitas, o utiliza un código que ya hayas recibido.",
    ctaSignup: "Probar 48 h gratis",
    ctaActivate: "Tengo mi código",
    ctaRequestCode: "Recibir mis 48 h gratis",
    ctaSubscribe: "Ver nuestros accesos",
    ctaLogin: "Iniciar sesión",
    contentLockedEyebrow: "🔒 LECCIÓN PREMIUM",
    contentLockedTitle:
      "Aprovecha 48 horas gratis para descubrir toda la plataforma TradeScaleX.",
    contentLockedBenefits: [
      "✅ Todas las lecciones de trading",
      "✅ Todas las estrategias de trading",
      "✅ Todos los análisis macroeconómicos",
      "✅ Todos los juegos interactivos",
    ],
    contentLockedReassurance: "✓ No se requiere tarjeta bancaria para empezar.",
    contentLockedMicrocopy:
      "Prueba gratuita • Sin compromiso • Activación en menos de un minuto",
  },
};
