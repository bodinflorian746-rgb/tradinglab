// Textes de la home v2 absents des dictionnaires : repris à l'identique des
// textes en ligne de la home actuelle (app/[locale]/page.tsx), FR et ES.
// Seule correction : le sous-titre ES de « Comment accéder », qui contenait
// des mots français (« pour », « à »).

export type HomeLocale = "fr" | "es";

const S = {
  fr: {
    stats: [
      { value: "48h", label: "gratuites" },
      { value: "79", label: "leçons structurées" },
      { value: "8", label: "stratégies expliquées" },
      { value: "4", label: "jeux éducatifs" },
    ],
    discover: "Découvrir",
    // Étape affichée par le jeu BUY / SELL / NO TRADE
    question: "Question",
    // Descriptions des piliers Macro et Stratégies, version nuancée de la home actuelle (T.poles)
    pillarDesc: {
      macro: "Comprends les forces qui déplacent les marchés.",
      strategies: "Découvre et applique des stratégies éprouvées.",
    } as Record<string, string>,
    progression: {
      title: "Ton parcours progressif",
      subtitle: "Apprends étape par étape et développe tes compétences",
      levels: [
        { label: "Débutant", desc: "Apprends les bases" },
        { label: "Intermédiaire", desc: "Renforce tes compétences" },
        { label: "Avancé", desc: "Maîtrise les marchés" },
      ],
      lessons: "leçons",
    },
    access: {
      title: "Comment accéder ?",
      subtitle: "Deux voies pour rejoindre la plateforme.",
      trial: { title: "48h gratuites", desc: "Teste la plateforme pendant 48h, sans engagement.", cta: "Recevoir mon code" },
      broker: {
        badge: "Recommandé",
        title: "Via broker partenaire",
        price: "0€",
        desc: "Tu ouvres un compte broker via notre lien d'affiliation. Tu reçois ensuite ton code d'accès par email.",
        bullets: ["Ouverture compte broker partenaire", "Code envoyé après vérification", "Accès complet à la plateforme"],
        depositNote: "Dépôt 200 € sur ton compte broker · ton argent, retirable à tout moment",
      },
      direct: {
        title: "Accès direct",
        price: "19€",
        period: "/mois",
        desc: "Abonnement mensuel sans affiliation broker. Code généré automatiquement au paiement.",
        bullets: ["Abonnement mensuel", "Code généré au paiement", "Accès complet à la plateforme"],
      },
      cta: "Voir le détail",
    },
    reviews: { verified: "✓ VÉRIFIÉ", earlyUser: "EARLY USER", founder: "Florian · Fondateur" },
    footer: {
      taglineL1: "Apprends, comprends, progresse.",
      taglineL2: "De débutant à rentable.",
      platform: "Plateforme",
      account: "Compte",
      resources: "Ressources",
      trading: "Trading",
      macro: "Macro",
      games: "Jeux",
      strategies: "Stratégies",
      profile: "Mon profil",
      progress: "Ma progression",
      settings: "Paramètres",
      pricing: "Nos accès",
      about: "À propos",
      contact: "Contact",
      copyright: "© 2026 TradeScaleX. Tous droits réservés.",
      legalNotice: "Mentions légales",
      terms: "Conditions d'utilisation",
      cgv: "Conditions de vente",
      privacy: "Politique de confidentialité",
    },
  },
  es: {
    stats: [
      { value: "48h", label: "gratis" },
      { value: "79", label: "lecciones estructuradas" },
      { value: "8", label: "estrategias explicadas" },
      { value: "4", label: "juegos educativos" },
    ],
    discover: "Descubrir",
    question: "Pregunta",
    pillarDesc: {
      macro: "Entiende las fuerzas que mueven los mercados.",
      strategies: "Descubre y aplica estrategias probadas.",
    } as Record<string, string>,
    progression: {
      title: "Tu recorrido progresivo",
      subtitle: "Aprende paso a paso y desarrolla tus competencias",
      levels: [
        { label: "Principiante", desc: "Aprende las bases" },
        { label: "Intermedio", desc: "Refuerza tus competencias" },
        { label: "Avanzado", desc: "Domina los mercados" },
      ],
      lessons: "lecciones",
    },
    access: {
      title: "¿Cómo acceder?",
      subtitle: "Dos vías para unirte a la plataforma.",
      trial: { title: "48h gratis", desc: "Prueba la plataforma durante 48h, sin compromiso.", cta: "Recibir mi código" },
      broker: {
        badge: "Recomendado",
        title: "Vía broker partner",
        price: "0€",
        desc: "Abre una cuenta broker vía nuestro enlace de afiliación. Recibes después tu código de acceso por email.",
        bullets: ["Apertura de cuenta broker partner", "Código enviado tras verificación", "Acceso completo a la plataforma"],
        depositNote: "Depósito 200 € en tu cuenta broker · tu dinero, retirable cuando quieras",
      },
      direct: {
        title: "Acceso directo",
        price: "19€",
        period: "/mes",
        desc: "Abono mensual sin afiliación broker. Código generado automáticamente al pagar.",
        bullets: ["Abono mensual", "Código generado al pagar", "Acceso completo a la plataforma"],
      },
      cta: "Ver el detalle",
    },
    reviews: { verified: "✓ VERIFICADO", earlyUser: "EARLY USER", founder: "Florian · Fundador" },
    footer: {
      taglineL1: "Aprende, comprende, progresa.",
      taglineL2: "De principiante a rentable.",
      platform: "Plataforma",
      account: "Cuenta",
      resources: "Recursos",
      trading: "Trading",
      macro: "Macro",
      games: "Juegos",
      strategies: "Estrategias",
      profile: "Mi perfil",
      progress: "Mi progreso",
      settings: "Configuración",
      pricing: "Nuestros accesos",
      about: "Sobre nosotros",
      contact: "Contacto",
      copyright: "© 2026 TradeScaleX. Todos los derechos reservados.",
      legalNotice: "Aviso legal",
      terms: "Términos de uso",
      cgv: "Condiciones de venta",
      privacy: "Política de privacidad",
    },
  },
} as const;

export function homeStrings(locale: HomeLocale) {
  return S[locale];
}
