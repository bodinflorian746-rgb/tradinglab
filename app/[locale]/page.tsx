import Link from "next/link";
import { FORMATIONS } from "@/lib/formations";
import { hasLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { localizedHref } from "@/lib/i18n/href";
import { getDictionary } from "@/i18n/dictionaries";
import Logo from "@/app/components/Logo";

// ───────────────────────────────────────────────────────────────────────────────
// Icônes SVG inline pour les 4 cartes pôles + features hero
// ───────────────────────────────────────────────────────────────────────────────
function IconCandles() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <line x1="8" y1="4" x2="8" y2="9" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="5" y="9" width="6" height="9" fill="#10b981" rx="1" />
      <line x1="8" y1="18" x2="8" y2="22" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="16" y1="6" x2="16" y2="10" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="13" y="10" width="6" height="13" fill="#10b981" rx="1" />
      <line x1="16" y1="23" x2="16" y2="27" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="24" y1="2" x2="24" y2="6" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="21" y="6" width="6" height="17" fill="#10b981" rx="1" />
      <line x1="24" y1="23" x2="24" y2="28" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconGlobe() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="13" stroke="#60a5fa" strokeWidth="1.8" />
      <ellipse cx="16" cy="16" rx="13" ry="5" stroke="#60a5fa" strokeWidth="1.4" />
      <ellipse cx="16" cy="16" rx="5" ry="13" stroke="#60a5fa" strokeWidth="1.4" />
      <line x1="3" y1="16" x2="29" y2="16" stroke="#60a5fa" strokeWidth="1.4" />
    </svg>
  );
}

function IconKnight() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path
        d="M11 6 C 8 8, 7 11, 8 14 L 6 16 L 6 18 L 9 18 C 9 18, 10 16, 12 16 C 14 16, 13 19, 11 21 L 10 24 L 23 24 L 23 22 C 23 18, 22 14, 20 11 C 18 8, 15 6, 13 6 L 11 6 Z"
        fill="#fbbf24"
        stroke="#d97706"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
      <rect x="9" y="24" width="15" height="3" rx="1" fill="#fbbf24" />
      <circle cx="13" cy="11" r="0.9" fill="#09090b" />
    </svg>
  );
}

function IconGamepad() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path
        d="M6 12 C 4 12, 3 14, 3 17 L 4 22 C 4 24, 6 25, 8 24 L 11 22 L 21 22 L 24 24 C 26 25, 28 24, 28 22 L 29 17 C 29 14, 28 12, 26 12 L 6 12 Z"
        fill="#8b5cf6"
        stroke="#7c3aed"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="17" r="1.5" fill="#a78bfa" />
      <line x1="8" y1="17" x2="10" y2="17" stroke="#09090b" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="9" y1="16" x2="9" y2="18" stroke="#09090b" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="22" cy="16" r="1.2" fill="#a78bfa" />
      <circle cx="25" cy="18" r="1.2" fill="#a78bfa" />
    </svg>
  );
}

function CheckSmall({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 mt-0.5">
      <circle cx="7" cy="7" r="6.2" fill="none" stroke={color} strokeWidth="1.2" opacity="0.5" />
      <path d="M4 7.3l2.2 2.2 4-4.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

// ───────────────────────────────────────────────────────────────────────────────
// Hexagon for "Ton parcours progressif"
// Flat-top hexagon, radius r=40
// ───────────────────────────────────────────────────────────────────────────────
function Hexagon({ n, color, glow, dropShadow }: { n: number; color: string; glow: string; dropShadow: string }) {
  return (
    <svg
      width="90"
      height="90"
      viewBox="0 0 90 90"
      fill="none"
      aria-hidden="true"
      style={{ filter: `drop-shadow(${dropShadow})` }}
    >
      <defs>
        <filter id={`hex-glow-${n}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <polygon
        points="25,10 65,10 85,45 65,80 25,80 5,45"
        fill="none"
        stroke={color}
        strokeWidth="2"
        filter={`url(#hex-glow-${n})`}
      />
      <polygon
        points="25,10 65,10 85,45 65,80 25,80 5,45"
        fill={glow}
      />
      <text x="45" y="55" fontSize="28" fontWeight="700" fill={color} textAnchor="middle">
        {n}
      </text>
    </svg>
  );
}

// ───────────────────────────────────────────────────────────────────────────────
// Sub-item small icons for the 3-col section (réutilise les SVG existants)
// ───────────────────────────────────────────────────────────────────────────────
const COL1_ICONS = [
  // 1. Progresser même avec peu de temps — chart-up (📈)
  (<svg key="1" width="16" height="16" viewBox="0 0 18 18" fill="none"><path d="M2 14l4-5 3 3 4-6 3 4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /><polyline points="12,6 16,6 16,10" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  // 2. Trader intelligemment avec un petit capital — briefcase (💼)
  (<svg key="2" width="16" height="16" viewBox="0 0 18 18" fill="none"><rect x="2" y="5" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4" /><path d="M6.5 5V3.5A1 1 0 0 1 7.5 2.5h3a1 1 0 0 1 1 1V5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" /><line x1="2" y1="9" x2="16" y2="9" stroke="currentColor" strokeWidth="1.2" /></svg>),
  // 3. Développer de vrais réflexes marché — éclair (⚡)
  (<svg key="3" width="16" height="16" viewBox="0 0 18 18" fill="none"><path d="M10.2 2L4 10.2h3.8l-1.2 5.8L13 8.2h-3.8l1.2-6.2z" stroke="currentColor" strokeWidth="1.4" fill="currentColor" fillOpacity="0.2" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  // 4. Construire une approche disciplinée et confiante — cible (🎯)
  (<svg key="4" width="16" height="16" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.4" /><circle cx="9" cy="9" r="4" stroke="currentColor" strokeWidth="1.4" /><circle cx="9" cy="9" r="1.5" fill="currentColor" /></svg>),
];

const COL2_ICONS = [
  // 1. Formations par niveaux — chart bars ascendant
  (<svg key="1" width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="13" width="3" height="3" rx="0.5" fill="currentColor" /><rect x="7" y="9" width="3" height="7" rx="0.5" fill="currentColor" /><rect x="12" y="5" width="3" height="11" rx="0.5" fill="currentColor" /></svg>),
  // 2. Stratégies Price Action, SMC & ICT — cible/target
  (<svg key="2" width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.4" /><circle cx="9" cy="9" r="4" stroke="currentColor" strokeWidth="1.4" /><circle cx="9" cy="9" r="1.5" fill="currentColor" /></svg>),
  // 3. Quiz et exercices pratiques — lightbulb
  (<svg key="3" width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2a5 5 0 0 0-3 9v2h6v-2a5 5 0 0 0-3-9z" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round" /><line x1="7" y1="15.5" x2="11" y2="15.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>),
  // 4. Tableaux de bord de progression — chart-up avec ligne
  (<svg key="4" width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 14l4-5 3 3 4-6 3 4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /><line x1="2" y1="15.5" x2="16" y2="15.5" stroke="currentColor" strokeWidth="1.2" opacity="0.5" /></svg>),
  // 5. Contenu mis à jour régulièrement — étoile
  (<svg key="5" width="18" height="18" viewBox="0 0 18 18" fill="none"><polygon points="9,2 11,7 16,7 12,10 13.5,15 9,12 4.5,15 6,10 2,7 7,7" stroke="currentColor" strokeWidth="1.3" fill="currentColor" fillOpacity="0.2" strokeLinejoin="round" /></svg>),
  // 6. Accès desktop et mobile — écran + téléphone
  (<svg key="6" width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="3" width="9" height="7" rx="1" stroke="currentColor" strokeWidth="1.4" /><line x1="4" y1="13" x2="9" y2="13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><rect x="12" y="6" width="4" height="9" rx="0.8" stroke="currentColor" strokeWidth="1.4" /></svg>),
];

// Textes hardcodés pour la grille 2x3 "Ce que tu trouveras" (alignés mot pour mot
// avec la spec — diffère de dictionaries/fr/home.json sur "Tableaux" pluriel)
const COL2_TITLES = [
  "Formations par niveaux",
  "Stratégies Price Action, SMC & ICT",
  "Quiz et exercices pratiques",
  "Tableaux de bord de progression",
  "Contenu mis à jour régulièrement",
  "Accès desktop et mobile",
];

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const raw = (await params).locale;
  const locale: Locale = hasLocale(raw) ? raw : DEFAULT_LOCALE;
  const h = (p: string) => localizedHref(p, locale);
  const t = await getDictionary(locale, "home");

  const debutantCount = FORMATIONS.find((f) => f.id === "debutant")?.lessons.length ?? 0;
  const intermediaireCount = FORMATIONS.find((f) => f.id === "intermediaire")?.lessons.length ?? 0;
  const avanceCount = FORMATIONS.find((f) => f.id === "avance")?.lessons.length ?? 0;

  // ───────────────────────────────────────────────────────────────────────────
  // Dictionnaire local FR/ES pour les textes hardcodés (hors i18n classique)
  // FR reste la source ; ES traduit les mêmes clés pour /es
  // ───────────────────────────────────────────────────────────────────────────
  const isEs = locale === "es";
  const T = {
    hero: {
      badge: isEs ? "La plataforma definitiva para progresar" : "La plateforme ultime pour progresser",
      titleLine1: isEs ? "De principiante a trader" : "De débutant à trader",
      titleLine2: isEs ? "a tu ritmo" : "à ton rythme",
      subtitle: isEs
        ? "Lecciones claras, estrategias concretas, simulaciones y análisis macro para comprender, practicar y triunfar en los mercados."
        : "Des leçons claires, des stratégies concrètes, des simulations et des analyses macro pour comprendre, s'entraîner et réussir sur les marchés.",
      ctaPrimary: isEs ? "Ver los accesos" : "Voir les accès",
      ctaSecondary: isEs ? "Ya tengo un código" : "J'ai déjà un code",
      features: [
        { title: isEs ? "Aprende a tu ritmo" : "Apprends à ton rythme", desc: isEs ? "Recorrido estructurado" : "Parcours structuré" },
        { title: isEs ? "Pasa a la acción" : "Passe à l'action", desc: isEs ? "Practica, simula, progresa" : "Entraîne-toi, simule, progresse" },
        { title: isEs ? "Vuélvete rentable" : "Deviens rentable", desc: isEs ? "Estrategias, disciplina, regularidad" : "Stratégies, discipline, régularité" },
      ],
    },
    progression: {
      title: isEs ? "Tu recorrido progresivo" : "Ton parcours progressif",
      subtitle: isEs ? "Aprende paso a paso y desarrolla tus competencias" : "Apprends étape par étape et développe tes compétences",
      debutantLabel: isEs ? "PRINCIPIANTE" : "DÉBUTANT",
      debutantDesc: isEs ? "Aprende las bases" : "Apprends les bases",
      intermediateLabel: isEs ? "INTERMEDIO" : "INTERMÉDIAIRE",
      intermediateDesc: isEs ? "Refuerza tus competencias" : "Renforce tes compétences",
      advancedLabel: isEs ? "AVANZADO" : "AVANCÉ",
      advancedDesc: isEs ? "Domina los mercados" : "Maîtrise les marchés",
      lessons: isEs ? "lecciones" : "leçons",
    },
    poles: {
      title: isEs ? "Un recorrido completo para todos los traders" : "Un parcours complet pour tous les traders",
      subtitle: isEs ? "4 pilares esenciales para desarrollar tus competencias" : "4 pôles essentiels pour développer tes compétences",
      cta: isEs ? "Ver los accesos" : "Voir les accès",
      trading: {
        title: "Trading",
        desc: isEs ? "Domina las bases y construye setups sólidos." : "Maîtrise les bases et construis des setups solides.",
        bullets: isEs
          ? [`${debutantCount} lecciones principiante`, `${intermediaireCount} lecciones intermedio`, `${avanceCount} lecciones avanzado`, "Quiz y ejercicios"]
          : [`${debutantCount} leçons débutant`, `${intermediaireCount} leçons intermédiaire`, `${avanceCount} leçons avancé`, "Quiz et exercices"],
      },
      macro: {
        title: "Macro",
        desc: isEs ? "Entiende las fuerzas que mueven los mercados." : "Comprends les forces qui déplacent les marchés.",
        bullets: isEs
          ? ["Análisis macroeconómicos", "Indicadores clave", "Eventos mayores", "Impacto en los mercados"]
          : ["Analyses macroéconomiques", "Indicateurs clés", "Événements majeurs", "Impact sur les marchés"],
      },
      strategies: {
        title: isEs ? "Estrategias" : "Stratégies",
        desc: isEs ? "Descubre y aplica estrategias probadas." : "Découvre et applique des stratégies éprouvées.",
        bullets: isEs
          ? ["Estrategias rentables", "Planes de trading detallados", "Gestión del riesgo", "Backtests y casos reales"]
          : ["Stratégies rentables", "Plans de trading détaillés", "Gestion du risque", "Backtests et cas réels"],
      },
      games: {
        title: isEs ? "Juegos" : "Jeux",
        desc: isEs ? "Aprende divirtiéndote y pon a prueba tus competencias." : "Apprends en t'amusant et teste tes compétences.",
        bullets: isEs
          ? ["Simulaciones realistas", "Retos diarios", "Rankings", "Recompensas"]
          : ["Simulations réalistes", "Défis quotidiens", "Classements", "Récompenses"],
      },
    },
    ctaInter: {
      title: isEs ? "¿Listo para unirte a la plataforma?" : "Prêt à rejoindre la plateforme ?",
      subtitle: isEs ? "Acceso vía broker partner (0€) o abono directo (19€/mes). Código requerido al registro." : "Accès via broker partenaire (0€) ou abonnement direct (19€/mois). Code requis à l'inscription.",
      cta: isEs ? "Ver los accesos" : "Voir les accès",
    },
    access: {
      title: isEs ? "¿Cómo acceder?" : "Comment accéder ?",
      subtitle: isEs ? "Dos vías pour unirte à la plataforma." : "Deux voies pour rejoindre la plateforme.",
      broker: {
        badge: isEs ? "Recomendado" : "Recommandé",
        title: isEs ? "Vía broker partner" : "Via broker partenaire",
        price: "0€",
        desc: isEs
          ? "Abre una cuenta broker vía nuestro enlace de afiliación. Recibes después tu código de acceso por email."
          : "Tu ouvres un compte broker via notre lien d'affiliation. Tu reçois ensuite ton code d'accès par email.",
        bullets: isEs
          ? ["Apertura de cuenta broker partner", "Código enviado tras verificación", "Acceso completo a la plataforma"]
          : ["Ouverture compte broker partenaire", "Code envoyé après vérification", "Accès complet à la plateforme"],
      },
      direct: {
        title: isEs ? "Acceso directo" : "Accès direct",
        price: "19€",
        period: isEs ? "/mes" : "/mois",
        desc: isEs
          ? "Abono mensual sin afiliación broker. Código generado automáticamente al pagar."
          : "Abonnement mensuel sans affiliation broker. Code généré automatiquement au paiement.",
        bullets: isEs
          ? ["Abono mensual", "Código generado al pagar", "Acceso completo a la plataforma"]
          : ["Abonnement mensuel", "Code généré au paiement", "Accès complet à la plateforme"],
      },
      cta: isEs ? "Ver el detalle" : "Voir le détail",
    },
    col2Titles: isEs
      ? [
          "Cursos por niveles",
          "Estrategias Price Action, SMC e ICT",
          "Quiz y ejercicios prácticos",
          "Dashboards de progreso",
          "Contenido actualizado seguido",
          "Acceso desktop y móvil",
        ]
      : COL2_TITLES,
    footer: {
      taglineL1: isEs ? "Aprende, comprende, progresa." : "Apprends, comprends, progresse.",
      taglineL2: isEs ? "De principiante a rentable." : "De débutant à rentable.",
      platform: isEs ? "Plataforma" : "Plateforme",
      account: isEs ? "Cuenta" : "Compte",
      resources: isEs ? "Recursos" : "Ressources",
      profile: isEs ? "Mi perfil" : "Mon profil",
      progress: isEs ? "Mi progreso" : "Ma progression",
      settings: isEs ? "Configuración" : "Paramètres",
      pricing: isEs ? "Precios" : "Tarifs",
      about: isEs ? "Sobre nosotros" : "À propos",
      contact: isEs ? "Contacto" : "Contact",
      newsletter: isEs ? "Mantente informado" : "Reste informé",
      newsletterDesc: isEs ? "Recibe consejos, novedades y actualizaciones." : "Reçois des conseils, les nouveautés et les mises à jour.",
      emailPlaceholder: isEs ? "Tu email" : "Ton email",
      subscribe: isEs ? "Suscribirme" : "S'abonner",
      copyright: isEs ? "© 2025 TradeScaleX. Todos los derechos reservados." : "© 2025 TradeScaleX. Tous droits réservés.",
      legalNotice: isEs ? "Aviso legal" : "Mentions légales",
      terms: isEs ? "Términos de uso" : "Conditions d'utilisation",
      privacy: isEs ? "Política de privacidad" : "Politique de confidentialité",
    },
  };

  return (
    <main className="bg-zinc-950 text-white overflow-hidden">
      {/* ═════════════════════════════════════════════════════════════════════
          1. HERO — contenu centré (illustration SVG marches 3D supprimée)
          ═════════════════════════════════════════════════════════════════════ */}
      <section className="relative px-6 pt-16 md:pt-24 pb-16 md:pb-24">
        {/* Halo emerald radial diffus en haut de page */}
        <div
          className="absolute inset-x-0 top-0 -z-10 h-[600px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(16,185,129,0.18) 0%, transparent 70%)",
          }}
        />
        {/* Ambient glow secondaire */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-[-100px] left-1/4 w-[600px] h-[400px] bg-emerald-500/[0.07] rounded-full blur-3xl" />
          <div className="absolute top-[20%] right-[-50px] w-[400px] h-[400px] bg-emerald-500/[0.04] rounded-full blur-3xl" />
        </div>
        {/* Particules flottantes (statiques) */}
        <svg
          className="absolute inset-0 -z-10 w-full h-full pointer-events-none"
          viewBox="0 0 1200 600"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <circle cx="80" cy="90" r="1.5" fill="#10b981" opacity="0.55" />
          <circle cx="180" cy="220" r="1" fill="#34d399" opacity="0.4" />
          <circle cx="240" cy="380" r="2" fill="#10b981" opacity="0.35" />
          <circle cx="320" cy="120" r="1.5" fill="#fbbf24" opacity="0.45" />
          <circle cx="420" cy="280" r="1" fill="#34d399" opacity="0.5" />
          <circle cx="520" cy="430" r="2" fill="#10b981" opacity="0.4" />
          <circle cx="620" cy="80" r="1" fill="#fbbf24" opacity="0.35" />
          <circle cx="700" cy="340" r="1.5" fill="#34d399" opacity="0.55" />
          <circle cx="780" cy="180" r="2.5" fill="#10b981" opacity="0.3" />
          <circle cx="880" cy="260" r="1" fill="#fbbf24" opacity="0.4" />
          <circle cx="960" cy="100" r="1.5" fill="#34d399" opacity="0.45" />
          <circle cx="1040" cy="380" r="1" fill="#10b981" opacity="0.5" />
          <circle cx="1120" cy="220" r="2" fill="#34d399" opacity="0.35" />
          <circle cx="1080" cy="490" r="1.5" fill="#fbbf24" opacity="0.4" />
        </svg>

        <div className="max-w-4xl mx-auto text-left">
          <div>
            <div className="inline-flex items-center gap-2 bg-zinc-900/80 backdrop-blur-sm border border-emerald-500/25 rounded-full px-4 py-1.5 mb-7 shadow-[0_0_20px_rgba(16,185,129,0.06)]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-[0.18em]">
                {T.hero.badge}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.05] mb-6">
              {T.hero.titleLine1}
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                {T.hero.titleLine2}
              </span>
            </h1>

            <p className="text-base md:text-lg text-zinc-400 leading-relaxed mb-9 max-w-xl">
              {T.hero.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-3.5 mb-10">
              <Link
                href={h("/pricing")}
                className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/35 hover:-translate-y-0.5"
              >
                {T.hero.ctaPrimary}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link
                href={h("/signup")}
                className="inline-flex items-center justify-center gap-2 border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900/40 text-white font-semibold px-6 py-3.5 rounded-xl transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M5 8a3 3 0 1 1 6 0v2H5V8z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
                  <rect x="3.5" y="7" width="9" height="6.5" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
                </svg>
                {T.hero.ctaSecondary}
              </Link>
            </div>

            {/* 3 mini-features — icônes dans pastilles bordées zinc-900 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-4">
              {T.hero.features.map((f) => (
                <div key={f.title} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800">
                    <svg className="h-4 w-4 text-emerald-400" viewBox="0 0 14 14" fill="none">
                      <path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white leading-tight">{f.title}</p>
                    <p className="text-xs text-zinc-400 leading-tight mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          2. TON PARCOURS PROGRESSIF — 3 hexagones
          ═════════════════════════════════════════════════════════════════════ */}
      <section className="px-6 pb-16 md:pb-20">
        <div className="max-w-5xl mx-auto rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900/60 to-zinc-900/20 px-6 py-12 md:py-14 shadow-[0_0_60px_-20px_rgba(16,185,129,0.08)]">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{T.progression.title}</h2>
            <p className="text-zinc-400 mt-2 text-[15px]">
              {T.progression.subtitle}
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 items-start">
            {/* Pointillés desktop entre hexagones (decoratif) */}
            <div className="hidden md:block absolute left-[18%] right-[18%] top-[45px] h-px border-t-2 border-dashed border-zinc-700/60 pointer-events-none" />

            {[
              {
                n: 1,
                label: T.progression.debutantLabel,
                desc: T.progression.debutantDesc,
                count: `${debutantCount} ${T.progression.lessons}`,
                color: "#34d399",
                glow: "#10b98115",
                dropShadow: "0 0 15px rgba(16,185,129,0.5)",
                badgeBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
              },
              {
                n: 2,
                label: T.progression.intermediateLabel,
                desc: T.progression.intermediateDesc,
                count: `${intermediaireCount} ${T.progression.lessons}`,
                color: "#60a5fa",
                glow: "#3b82f615",
                dropShadow: "0 0 15px rgba(59,130,246,0.5)",
                badgeBg: "bg-blue-500/10 border-blue-500/30 text-blue-400",
              },
              {
                n: 3,
                label: T.progression.advancedLabel,
                desc: T.progression.advancedDesc,
                count: `${avanceCount} ${T.progression.lessons}`,
                color: "#fbbf24",
                glow: "#fbbf2415",
                dropShadow: "0 0 15px rgba(251,191,36,0.5)",
                badgeBg: "bg-amber-400/10 border-amber-400/30 text-amber-400",
              },
            ].map((step) => (
              <div key={step.n} className="relative flex flex-col items-center text-center">
                <Hexagon n={step.n} color={step.color} glow={step.glow} dropShadow={step.dropShadow} />
                <p className="mt-4 text-[13px] font-bold uppercase tracking-[0.18em]" style={{ color: step.color }}>
                  {step.label}
                </p>
                <p className="text-sm text-zinc-300 mt-2">{step.desc}</p>
                <span className={`mt-3 text-[11px] font-semibold px-3 py-1 rounded-full border ${step.badgeBg}`}>
                  {step.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          3. UN PARCOURS COMPLET — 4 cartes pôles
          ═════════════════════════════════════════════════════════════════════ */}
      <section className="px-6 py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{T.poles.title}</h2>
            <p className="text-zinc-400 mt-2 text-[15px]">
              {T.poles.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Trading — emerald */}
            <Link
              href={h("/pricing")}
              className="group flex flex-col bg-gradient-to-b from-zinc-900/80 to-zinc-900/30 border border-zinc-800 rounded-2xl p-6 hover:border-emerald-500/50 hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.25)] transition-all duration-300"
            >
              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                  <IconCandles />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center text-white mb-2">{T.poles.trading.title}</h3>
              <p className="text-[13px] text-zinc-400 text-center leading-relaxed mb-5">
                {T.poles.trading.desc}
              </p>
              <ul className="space-y-2.5 mb-5 flex-1">
                {T.poles.trading.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-[13px] text-zinc-300">
                    <CheckSmall color="#34d399" />
                    {b}
                  </li>
                ))}
              </ul>
              <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-emerald-400 group-hover:gap-2 transition-all">
                {T.poles.cta}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 6h6M6 3l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>

            {/* Macro — blue */}
            <Link
              href={h("/pricing")}
              className="group flex flex-col bg-gradient-to-b from-zinc-900/80 to-zinc-900/30 border border-zinc-800 rounded-2xl p-6 hover:border-blue-500/50 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.25)] transition-all duration-300"
            >
              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.15)]">
                  <IconGlobe />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center text-white mb-2">{T.poles.macro.title}</h3>
              <p className="text-[13px] text-zinc-400 text-center leading-relaxed mb-5">
                {T.poles.macro.desc}
              </p>
              <ul className="space-y-2.5 mb-5 flex-1">
                {T.poles.macro.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-[13px] text-zinc-300">
                    <CheckSmall color="#60a5fa" />
                    {b}
                  </li>
                ))}
              </ul>
              <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-blue-400 group-hover:gap-2 transition-all">
                {T.poles.cta}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 6h6M6 3l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>

            {/* Stratégies — amber */}
            <Link
              href={h("/pricing")}
              className="group flex flex-col bg-gradient-to-b from-zinc-900/80 to-zinc-900/30 border border-zinc-800 rounded-2xl p-6 hover:border-amber-400/50 hover:shadow-[0_0_40px_-10px_rgba(251,191,36,0.25)] transition-all duration-300"
            >
              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.15)]">
                  <IconKnight />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center text-white mb-2">{T.poles.strategies.title}</h3>
              <p className="text-[13px] text-zinc-400 text-center leading-relaxed mb-5">
                {T.poles.strategies.desc}
              </p>
              <ul className="space-y-2.5 mb-5 flex-1">
                {T.poles.strategies.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-[13px] text-zinc-300">
                    <CheckSmall color="#fbbf24" />
                    {b}
                  </li>
                ))}
              </ul>
              <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-amber-400 group-hover:gap-2 transition-all">
                {T.poles.cta}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 6h6M6 3l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>

            {/* Jeux — violet */}
            <Link
              href={h("/pricing")}
              className="group flex flex-col bg-gradient-to-b from-zinc-900/80 to-zinc-900/30 border border-zinc-800 rounded-2xl p-6 hover:border-violet-500/50 hover:shadow-[0_0_40px_-10px_rgba(139,92,246,0.25)] transition-all duration-300"
            >
              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.15)]">
                  <IconGamepad />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center text-white mb-2">{T.poles.games.title}</h3>
              <p className="text-[13px] text-zinc-400 text-center leading-relaxed mb-5">
                {T.poles.games.desc}
              </p>
              <ul className="space-y-2.5 mb-5 flex-1">
                {T.poles.games.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-[13px] text-zinc-300">
                    <CheckSmall color="#a78bfa" />
                    {b}
                  </li>
                ))}
              </ul>
              <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-violet-400 group-hover:gap-2 transition-all">
                {T.poles.cta}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 6h6M6 3l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          4. CTA INTERMÉDIAIRE — "Prêt à passer au niveau supérieur ?"
          ═════════════════════════════════════════════════════════════════════ */}
      <section className="px-6 pb-16 md:pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-zinc-900/80 to-zinc-900/40 border border-zinc-800 rounded-2xl px-6 md:px-10 py-8 shadow-[0_0_60px_-20px_rgba(16,185,129,0.12)]">
            <div className="flex items-center gap-5">
              <div className="shrink-0 w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                  <circle cx="13" cy="13" r="10" stroke="#10b981" strokeWidth="1.8" />
                  <circle cx="13" cy="13" r="6" stroke="#10b981" strokeWidth="1.8" />
                  <circle cx="13" cy="13" r="2.5" fill="#10b981" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold text-white">{T.ctaInter.title}</h3>
                <p className="text-[14px] text-zinc-400 mt-0.5">
                  {T.ctaInter.subtitle}
                </p>
              </div>
            </div>
            <Link
              href={h("/pricing")}
              className="shrink-0 inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/35 hover:-translate-y-0.5"
            >
              {T.ctaInter.cta}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          5. SECTION 3 COLONNES — Ta progression / Tu trouveras / Méthode
          (réutilise les clés i18n existantes : audiencesSection / memberSection / methodSection)
          ═════════════════════════════════════════════════════════════════════ */}
      <section className="px-6 py-16 md:py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Col 1 — TA PROGRESSION */}
          <div className="bg-gradient-to-b from-zinc-900/70 to-zinc-900/30 border border-zinc-800 rounded-2xl p-7">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-5 h-px bg-emerald-500/60" />
              <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-[0.18em]">
                {t.audiencesSection.eyebrow}
              </p>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white leading-tight mb-3">
              {t.audiencesSection.title}
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed mb-6">
              {t.audiencesSection.subtitle}
            </p>
            <ul className="space-y-3">
              {t.audiencesSection.cards.map((c, i) => (
                <li key={c.title} className="flex items-start gap-3 bg-zinc-900/60 border border-zinc-800 rounded-xl p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    {COL1_ICONS[i]}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-white leading-snug">{c.title}</p>
                    <p className="text-[12px] text-zinc-500 leading-relaxed mt-0.5">{c.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2 — CE QUE TU TROUVERAS */}
          <div className="bg-gradient-to-b from-zinc-900/70 to-zinc-900/30 border border-zinc-800 rounded-2xl p-7">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-5 h-px bg-emerald-500/60" />
              <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-[0.18em]">
                {t.memberSection.eyebrow}
              </p>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white leading-tight mb-3">
              {t.memberSection.title}
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed mb-6">
              {t.memberSection.subtitle}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {T.col2Titles.map((title, i) => (
                <div
                  key={title}
                  className="flex flex-col items-start justify-start gap-2 h-full min-h-[100px] bg-zinc-900 border border-zinc-800 rounded-lg p-4"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
                    {COL2_ICONS[i]}
                  </div>
                  <p className="text-sm font-semibold text-zinc-300 leading-tight">{title}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Col 3 — UNE APPROCHE PÉDAGOGIQUE SÉRIEUSE */}
          <div className="bg-gradient-to-b from-zinc-900/70 to-zinc-900/30 border border-zinc-800 rounded-2xl p-7">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-5 h-px bg-emerald-500/60" />
              <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-[0.18em]">
                {t.methodSection.eyebrow}
              </p>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white leading-tight mb-3">
              {t.methodSection.titleLine1} {t.methodSection.titleLine2}
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed mb-6">
              {t.methodSection.subtitle}
            </p>
            <ul className="space-y-3">
              {t.methodSection.benefits.map((b) => (
                <li key={b.title} className="flex items-start gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-md bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mt-0.5">
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                      <path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-white leading-snug">{b.title}</p>
                    <p className="text-[12px] text-zinc-500 leading-relaxed mt-0.5">{b.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          5b. COMMENT ACCÉDER — 2 cartes (broker partenaire / accès direct)
          ═════════════════════════════════════════════════════════════════════ */}
      <section className="px-6 pb-16 md:pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{T.access.title}</h2>
            <p className="text-zinc-400 mt-2 text-[15px]">{T.access.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Carte A — Via broker partenaire (recommandé) */}
            <div className="relative bg-gradient-to-b from-zinc-900/80 to-zinc-900/30 border-2 border-emerald-500/40 rounded-2xl p-6 flex flex-col shadow-[0_0_40px_-15px_rgba(16,185,129,0.25)]">
              <span className="absolute -top-3 left-6 bg-emerald-500 text-zinc-950 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                {T.access.broker.badge}
              </span>
              <h3 className="text-xl font-bold text-white mb-2">{T.access.broker.title}</h3>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-4xl font-black text-emerald-400 tabular-nums">{T.access.broker.price}</span>
              </div>
              <p className="text-[13px] text-zinc-400 leading-relaxed mb-5">{T.access.broker.desc}</p>
              <ul className="space-y-2.5 mb-6 flex-1">
                {T.access.broker.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-[13px] text-zinc-300">
                    <CheckSmall color="#34d399" />
                    {b}
                  </li>
                ))}
              </ul>
              <Link
                href={h("/pricing")}
                className="inline-flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold py-2.5 rounded-xl transition-colors text-sm"
              >
                {T.access.cta}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 6h6M6 3l3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

            {/* Carte B — Accès direct */}
            <div className="bg-gradient-to-b from-zinc-900/80 to-zinc-900/30 border border-zinc-800 rounded-2xl p-6 flex flex-col">
              <h3 className="text-xl font-bold text-white mb-2">{T.access.direct.title}</h3>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-4xl font-black text-white tabular-nums">{T.access.direct.price}</span>
                <span className="text-sm text-zinc-500">{T.access.direct.period}</span>
              </div>
              <p className="text-[13px] text-zinc-400 leading-relaxed mb-5">{T.access.direct.desc}</p>
              <ul className="space-y-2.5 mb-6 flex-1">
                {T.access.direct.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-[13px] text-zinc-300">
                    <CheckSmall color="#a1a1aa" />
                    {b}
                  </li>
                ))}
              </ul>
              <Link
                href={h("/pricing")}
                className="inline-flex items-center justify-center gap-1.5 border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900/40 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
              >
                {T.access.cta}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 6h6M6 3l3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          6. CTA FINAL — Commence ton parcours
          ═════════════════════════════════════════════════════════════════════ */}
      <section className="px-6 pb-16 md:pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-zinc-900/80 to-zinc-900/40 border border-zinc-800 rounded-2xl px-6 md:px-10 py-8 shadow-[0_0_60px_-20px_rgba(16,185,129,0.12)]">
            <div className="flex items-center gap-5">
              <div className="shrink-0 w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                  <circle cx="13" cy="13" r="10" stroke="#10b981" strokeWidth="1.8" />
                  <circle cx="13" cy="13" r="6" stroke="#10b981" strokeWidth="1.8" />
                  <circle cx="13" cy="13" r="2.5" fill="#10b981" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold text-white">{t.finalCta.title}</h3>
                <p className="text-[14px] text-zinc-400 mt-0.5 max-w-lg leading-relaxed">{t.finalCta.subtitle}</p>
              </div>
            </div>
            <div className="shrink-0 flex flex-col sm:flex-row gap-3">
              <Link
                href={h("/pricing")}
                className="inline-flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold px-6 py-3 rounded-xl transition-all text-sm shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:-translate-y-0.5"
              >
                {t.finalCta.ctaPrimary}
              </Link>
              <Link
                href={h("/signup")}
                className="inline-flex items-center justify-center border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900/40 text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm"
              >
                {t.finalCta.ctaSecondary}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          7. FOOTER (inline — aucun composant Footer dans le projet)
          ═════════════════════════════════════════════════════════════════════ */}
      <footer className="border-t border-zinc-900 bg-zinc-950 px-6 pt-14 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            {/* Brand col */}
            <div>
              <Link href={h("/")} aria-label="TradeScaleX" className="inline-block mb-4">
                <Logo size="md" />
              </Link>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {T.footer.taglineL1}
                <br />
                {T.footer.taglineL2}
              </p>
              <div className="flex gap-3 mt-5">
                <a href="#" aria-label="X" className="w-8 h-8 rounded-lg border border-zinc-800 hover:border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M10.6 1.5h2.1L8.1 6.8l5.4 7.2H9.3L6 9.5l-3.8 4.5H0l4.9-5.7L0 1.5h4.4L7.4 5.6l3.2-4.1zm-0.7 11h1.2L4.2 2.6H2.9l7 9.9z"/></svg>
                </a>
                <a href="#" aria-label="YouTube" className="w-8 h-8 rounded-lg border border-zinc-800 hover:border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M15.7 4.2c-.2-.7-.7-1.2-1.4-1.4C13 2.5 8 2.5 8 2.5s-5 0-6.3.3c-.7.2-1.2.7-1.4 1.4C0 5.5 0 8 0 8s0 2.5.3 3.8c.2.7.7 1.2 1.4 1.4 1.3.3 6.3.3 6.3.3s5 0 6.3-.3c.7-.2 1.2-.7 1.4-1.4.3-1.3.3-3.8.3-3.8s0-2.5-.3-3.8zM6.4 10.5V5.5l4.2 2.5-4.2 2.5z"/></svg>
                </a>
                <a href="#" aria-label="Instagram" className="w-8 h-8 rounded-lg border border-zinc-800 hover:border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="1.5" width="11" height="11" rx="3" stroke="currentColor" strokeWidth="1.3" /><circle cx="7" cy="7" r="2.8" stroke="currentColor" strokeWidth="1.3" /><circle cx="10.5" cy="3.5" r="0.8" fill="currentColor" /></svg>
                </a>
              </div>
            </div>

            {/* Plateforme */}
            <div>
              <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-[0.18em] mb-4">{T.footer.platform}</p>
              <ul className="space-y-3 text-[14px] text-zinc-400">
                <li><Link href={h("/formations")} className="hover:text-white transition-colors">{T.poles.trading.title}</Link></li>
                <li><Link href={h("/formations/macro")} className="hover:text-white transition-colors">{T.poles.macro.title}</Link></li>
                <li><Link href={h("/jeux")} className="hover:text-white transition-colors">{T.poles.games.title}</Link></li>
                <li><Link href={h("/strategies")} className="hover:text-white transition-colors">{T.poles.strategies.title}</Link></li>
              </ul>
            </div>

            {/* Compte */}
            <div>
              <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-[0.18em] mb-4">{T.footer.account}</p>
              <ul className="space-y-3 text-[14px] text-zinc-400">
                <li><Link href={h("/profil-trader")} className="hover:text-white transition-colors">{T.footer.profile}</Link></li>
                <li><Link href={h("/dashboard")} className="hover:text-white transition-colors">{T.footer.progress}</Link></li>
                <li><Link href={h("/login")} className="hover:text-white transition-colors">{T.footer.settings}</Link></li>
              </ul>
            </div>

            {/* Ressources + Newsletter */}
            <div>
              <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-[0.18em] mb-4">{T.footer.resources}</p>
              <ul className="space-y-3 text-[14px] text-zinc-400 mb-7">
                <li><Link href={h("/pricing")} className="hover:text-white transition-colors">{T.footer.pricing}</Link></li>
                <li><Link href={h("/")} className="hover:text-white transition-colors">{T.footer.about}</Link></li>
                <li><Link href={h("/")} className="hover:text-white transition-colors">{T.footer.contact}</Link></li>
              </ul>

              <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-[0.18em] mb-3">{T.footer.newsletter}</p>
              <p className="text-[12px] text-zinc-400 leading-relaxed mb-3">
                {T.footer.newsletterDesc}
              </p>
              <form action="#" method="get" className="flex gap-2" aria-label={T.footer.newsletter}>
                <label className="flex-1">
                  <span className="sr-only">Email</span>
                  <input
                    type="email"
                    name="email"
                    placeholder={T.footer.emailPlaceholder}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-[13px] text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </label>
                <button
                  type="submit"
                  aria-label={T.footer.subscribe}
                  className="shrink-0 w-10 h-10 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 flex items-center justify-center transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </form>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-6 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-3 text-[12px] text-zinc-500">
            <p>{T.footer.copyright}</p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              <Link href={h("/")} className="hover:text-white transition-colors">{T.footer.legalNotice}</Link>
              <Link href={h("/")} className="hover:text-white transition-colors">{T.footer.terms}</Link>
              <Link href={h("/")} className="hover:text-white transition-colors">{T.footer.privacy}</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
