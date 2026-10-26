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
      subtitleJournal: "Leçons, stratégies et jeux sur des graphiques réalistes, puis un journal de trading pour analyser chacun de tes trades.",
      title: [{ t: "De ta " }, { t: "première leçon", hl: true }, { t: " à ton " }, { t: "premier trade structuré", hl: true }, { t: "\u00a0:" }, { t: "tout pour te former et progresser.", tail: true }] as TitlePart[],
      subtitle: "Leçons, stratégies et jeux sur des graphiques réalistes, à ton rythme.",
      audience: "Pour débuter comme pour structurer tes décisions : le parcours va du débutant à l'avancé.",
    },
    // Fil explicatif de la page (refonte r4) : une phrase par section, contenu réel du site
    how: {
      eyebrow: "Comment ça marche",
      title: "Comprendre, s'entraîner, appliquer",
      steps: [
        { verb: "Comprendre", name: "Les leçons", text: "Tu apprends à lire un graphique, à gérer ton risque et à suivre la macro, avec des schémas, des exemples et des quiz." },
        { verb: "S'entraîner", name: "Les jeux", text: "Sur des graphiques réalistes, tu décides : acheter, vendre ou attendre, où placer ton stop, où est l'erreur. Chaque réponse est expliquée." },
        { verb: "Appliquer", name: "Les stratégies", text: "Tu suis une méthode complète, de l'analyse à l'entrée : price action, SMC, ICT, macro…" },
      ],
      lessonsMeta: "Voir les leçons",
      gamesMeta: "4 jeux",
      strategiesMeta: (m: number, n: number) => `${m} stratégies, en ${n} leçons`,
    },
    lessonsSection: {
      eyebrow: "Comprendre · Les leçons",
      title: "Les bases d'abord, puis les notions avancées",
      sub: "Les parcours : Trading (lecture du graphique, gestion du risque), Macro (news, banques centrales, corrélations) et Stratégies.",
    },
    gamesEyebrow: "S'entraîner · Les jeux",
    strategiesSection: {
      eyebrow: "Appliquer · Les stratégies",
      title: "Une méthode complète, de l'analyse à l'entrée",
      sub: "Chaque stratégie se suit leçon par leçon, des fondations (price action) aux techniques institutionnelles (ICT, macro trading).",
      levels: { debutant: "Débutant", intermediaire: "Intermédiaire", avance: "Avancé" } as Record<string, string>,
      all: "Voir les 8 stratégies",
    },
    reviewsSub: "Avis de membres et de premiers utilisateurs.",
    game: {
      question: "Question",
      stepChoice: "Choix fait",
      stepVerdict: "Verdict",
      htf: "UT supérieure",
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
      sub: "4 jeux sur des graphiques réalistes : décider, placer ton stop, repérer l'erreur, construire un trade complet.",
      lines: {
        "buy-sell-no-trade": "Mini graphique, contexte, news : tu prends ta décision.",
        "place-stop": "Quel stop va survivre ? Stop 1, 2 ou 3.",
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
      privacy: "Politique de confidentialité",
    },
  },
  es: {
    hero: {
      titleJournal: [{ t: "De tu " }, { t: "primera lección", hl: true }, { t: " a tu " }, { t: "diario de trading", hl: true }, { t: ":" }, { t: "todo para formarte y progresar.", tail: true }] as TitlePart[],
      subtitleJournal: "Lecciones, estrategias y juegos sobre gráficos reales, y luego un diario de trading para analizar cada uno de tus trades.",
      title: [{ t: "De tu " }, { t: "primera lección", hl: true }, { t: " a tu " }, { t: "primer trade estructurado", hl: true }, { t: ":" }, { t: "todo para formarte y progresar.", tail: true }] as TitlePart[],
      subtitle: "Lecciones, estrategias y juegos sobre gráficos reales, a tu ritmo.",
      audience: "Para empezar desde cero o para estructurar tus decisiones: el recorrido va de principiante a avanzado.",
    },
    how: {
      eyebrow: "Cómo funciona",
      title: "Entender, entrenar, aplicar",
      steps: [
        { verb: "Entender", name: "Las lecciones", text: "Aprendes a leer un gráfico, a gestionar tu riesgo y a seguir la macro, con esquemas, ejemplos y cuestionarios." },
        { verb: "Entrenar", name: "Los juegos", text: "Sobre gráficos reales, decides: comprar, vender o esperar, dónde colocar tu stop, dónde está el error. Cada respuesta se explica." },
        { verb: "Aplicar", name: "Las estrategias", text: "Sigues un método completo, del análisis a la entrada: price action, SMC, ICT, macro…" },
      ],
      lessonsMeta: "Ver las lecciones",
      gamesMeta: "4 juegos",
      strategiesMeta: (m: number, n: number) => `${m} estrategias, en ${n} lecciones`,
    },
    lessonsSection: {
      eyebrow: "Entender · Las lecciones",
      title: "Primero las bases, luego las nociones avanzadas",
      sub: "Los recorridos: Trading (lectura del gráfico, gestión de riesgos), Macro (noticias, bancos centrales, correlaciones) y Estrategias.",
    },
    gamesEyebrow: "Entrenar · Los juegos",
    strategiesSection: {
      eyebrow: "Aplicar · Las estrategias",
      title: "Un método completo, del análisis a la entrada",
      sub: "Cada estrategia se sigue lección por lección, de los fundamentos (price action) a las técnicas institucionales (ICT, macro trading).",
      levels: { debutant: "Principiante", intermediaire: "Intermedio", avance: "Avanzado" } as Record<string, string>,
      all: "Ver las 8 estrategias",
    },
    reviewsSub: "Opiniones de miembros y de los primeros usuarios.",
    game: {
      question: "Pregunta",
      stepChoice: "Elección hecha",
      stepVerdict: "Veredicto",
      htf: "HTF",
      macro: "Macro",
      bias: { bullish: "Alcista", bearish: "Bajista", range: "Rango" },
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
      privacy: "Política de privacidad",
    },
  },
} as const;

export function homeStrings(locale: HomeLocale) {
  return S[locale];
}
