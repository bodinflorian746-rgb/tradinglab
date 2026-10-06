// Textes de la home v2 absents des dictionnaires, FR et ES :
// - textes en ligne de la home actuelle (app/[locale]/page.tsx), à l'identique
//   (seule correction : le sous-titre ES de « Comment accéder », qui contenait
//   des mots français) ;
// - textes du jeu BUY / SELL / NO TRADE (page du jeu) pour le jeu du héros ;
// - accroche du héros et bandeau 48h (retours PO, sprint R2 bis) ;
// - lignes des jeux tirées de leurs descriptions (dictionnaire games).

export type HomeLocale = "fr" | "es";

/** Segment de titre ; hl = mot clé mis en avant */
/** hl : mot clé mis en valeur ; tail : fin de l'accroche, plus petite, sur sa propre ligne */
export type TitlePart = { t: string; hl?: boolean; tail?: boolean };

/**
 * Le journal de trading n'est pas encore ouvert aux utilisateurs (404 en
 * production, liste blanche en local) : l'accroche qui l'annonce reste prête
 * mais inactive. Passer à true quand le journal sera accessible à tous.
 */
export const JOURNAL_OPEN = false;

const S = {
  fr: {
    hero: {
      titleJournal: [{ t: "De ta " }, { t: "première leçon", hl: true }, { t: " à ton " }, { t: "journal de trading", hl: true }, { t: "\u00a0:" }, { t: "tout pour te former et progresser.", tail: true }] as TitlePart[],
      subtitleJournal: "Leçons, stratégies et jeux sur de vrais graphiques, puis un journal de trading pour analyser chacun de tes trades.",
      title: [{ t: "De ta " }, { t: "première leçon", hl: true }, { t: " à ton " }, { t: "premier trade structuré", hl: true }, { t: "\u00a0:" }, { t: "tout pour te former et progresser.", tail: true }] as TitlePart[],
      subtitle: "Leçons, stratégies et jeux sur de vrais graphiques, à ton rythme.",
    },
    game: {
      question: "Question",
      stepChoice: "Choix fait",
      stepVerdict: "Verdict",
      htf: "HTF",
      macro: "Macro",
      bias: { bullish: "Haussier", bearish: "Baissier", range: "Range" },
      macroLabel: { normal: "Normal", dangereux: "Dangereux" },
      revelation: "Révélation",
      revealText: "On regarde ce qui s'est passé après ta décision…",
      goodRead: "Bonne lecture",
      wrongRead: "Pas la bonne lecture",
      disciplinePerfect: "Discipline parfaite",
      trapAvoided: "Piège évité ? Non.",
      correctAnswer: "· bonne réponse",
      yourChoice: "· ton choix",
      playNext: "Joue la suite",
      replay: "Rejouer",
    },
    offer: { title: "48h gratuites pour tout tester", desc: "Teste la plateforme pendant 48h, sans engagement.", cta: "Recevoir mon code" },
    // Bloc des leçons : les noms des 3 blocs sont ceux du menu (dictionnaire nav)
    lessons: {
      unit: "leçons",
      tagline: "Du débutant à l'avancé",
      // « 8 stratégies, en 35 leçons » : jamais « 35 stratégies »
      strategiesValue: (strategies: number, lessons: number) => [{ n: strategies }, { t: " stratégies," }, { br: true as const }, { t: " en " }, { n: lessons }, { t: " leçons" }],
    },
    games: {
      sub: "4 jeux sur de vrais graphiques : décider, placer ton stop, repérer l'erreur, construire un trade complet.",
      lines: {
        "buy-sell-no-trade": "Mini graphique, contexte, news : tu prends ta décision.",
        "place-stop": "Quel stop va survivre ? Stop 1, 2 ou 3.",
        "find-the-mistake": "10 setups, une erreur cachée à repérer parmi 4 choix.",
        "build-the-trade": "Entrée, stop, take profit : tu construis le trade complet.",
      } as Record<string, string>,
    },
    discover: "Découvrir",
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
        price: "Accès via un dépôt chez un broker partenaire",
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
        unavailable: "L'accès direct par abonnement n'est pas disponible pour le moment.",
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
    hero: {
      titleJournal: [{ t: "De tu " }, { t: "primera lección", hl: true }, { t: " a tu " }, { t: "diario de trading", hl: true }, { t: ":" }, { t: "todo para formarte y progresar.", tail: true }] as TitlePart[],
      subtitleJournal: "Lecciones, estrategias y juegos sobre gráficos reales, y luego un diario de trading para analizar cada uno de tus trades.",
      title: [{ t: "De tu " }, { t: "primera lección", hl: true }, { t: " a tu " }, { t: "primer trade estructurado", hl: true }, { t: ":" }, { t: "todo para formarte y progresar.", tail: true }] as TitlePart[],
      subtitle: "Lecciones, estrategias y juegos sobre gráficos reales, a tu ritmo.",
    },
    game: {
      question: "Pregunta",
      stepChoice: "Elección hecha",
      stepVerdict: "Veredicto",
      htf: "HTF",
      macro: "Macro",
      bias: { bullish: "Alcista", bearish: "Bajista", range: "Range" },
      macroLabel: { normal: "Normal", dangereux: "Peligroso" },
      revelation: "Revelación",
      revealText: "Veamos lo que pasó después de tu decisión…",
      goodRead: "Buena lectura",
      wrongRead: "Lectura incorrecta",
      disciplinePerfect: "Disciplina perfecta",
      trapAvoided: "¿Trampa evitada? No.",
      correctAnswer: "· respuesta correcta",
      yourChoice: "· tu elección",
      playNext: "Sigue jugando",
      replay: "Volver a jugar",
    },
    offer: { title: "48h gratis para probarlo todo", desc: "Prueba la plataforma durante 48h, sin compromiso.", cta: "Recibir mi código" },
    lessons: {
      unit: "lecciones",
      tagline: "De principiante a avanzado",
      strategiesValue: (strategies: number, lessons: number) => [{ n: strategies }, { t: " estrategias," }, { br: true as const }, { t: " en " }, { n: lessons }, { t: " lecciones" }],
    },
    games: {
      sub: "4 juegos sobre gráficos reales: decidir, colocar tu stop, detectar el error, construir un trade completo.",
      lines: {
        "buy-sell-no-trade": "Mini-gráfico, contexto, noticias: tomas tu decisión.",
        "place-stop": "¿Qué stop va a sobrevivir? Stop 1, 2 o 3.",
        "find-the-mistake": "10 setups, un error oculto que detectar entre 4 opciones.",
        "build-the-trade": "Entrada, stop, take profit: construyes el trade completo.",
      } as Record<string, string>,
    },
    discover: "Descubrir",
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
        price: "Acceso mediante un depósito en un broker partner",
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
        unavailable: "El acceso directo por suscripción no está disponible por el momento.",
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
