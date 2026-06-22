import { Fragment } from "react";
import Link from "next/link";
import { FORMATIONS } from "@/lib/formations";
import { hasLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { localizedHref } from "@/lib/i18n/href";
import { getDictionary } from "@/i18n/dictionaries";
import Logo from "@/app/components/Logo";
import { ReviewsCarousel } from "@/app/components/ReviewsCarousel";
import { requestTrialCode } from "@/app/[locale]/pricing/actions";

function CheckSmall({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 mt-0.5">
      <circle cx="7" cy="7" r="6.2" fill="none" stroke={color} strokeWidth="1.2" opacity="0.5" />
      <path d="M4 7.3l2.2 2.2 4-4.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

// Icônes des 4 cartes statistiques sous le hero (stroke = currentColor,
// hérite de la couleur emerald du badge). Traits simples, zéro asset.
const STAT_ICON: Record<string, React.ReactNode> = {
  timer: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="10" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 7v3l2 1.5M6.5 2.5h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  book: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M9 4.5C7.5 3.3 5.3 3 3 3.5v9.5c2.3-.5 4.5-.3 6 .9 1.5-1.2 3.7-1.4 6-.9V3.5c-2.3-.5-4.5-.2-6 1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 5.5v9" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  ),
  target: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="6.2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="9" cy="9" r="0.6" fill="currentColor" />
    </svg>
  ),
  layers: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M9 2.5l6 3-6 3-6-3 6-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M3 9l6 3 6-3M3 12.5l6 3 6-3" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
};

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

// État des leçons dans la sidebar du mock plateforme. Ordonné comme la
// liste t.platformPreview.lessons[] — 0-2 done, 3 active, 4-5 locked.
const LESSON_STATES = ["done", "done", "done", "active", "locked", "locked"] as const;

// Rendu d'un paragraphe d'intro avec marqueurs **bold** (markdown light).
// Permet de garder le contenu i18n simple en JSON sans HTML embarqué.
function renderBold(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

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
  const T = {
    // T.hero retiré — désormais 100% géré par t.hero du dictionnaire.
    // T.progression, T.poles, T.access, T.footer restent en FR/ES/EN inline car
    // ces sections sont hors scope mockup F (parcours hexagones / footer).

    // Cartes statistiques sous le hero. Valeurs marketing figées (alignées
    // sur la maquette), pas dérivées de FORMATIONS pour rester stables.
    stats: [
      { value: "48h", label: locale === "es" ? "gratis" : locale === "en" ? "free" : "gratuites", icon: "timer" },
      { value: "79", label: locale === "es" ? "lecciones estructuradas" : locale === "en" ? "structured lessons" : "leçons structurées", icon: "book" },
      { value: "8", label: locale === "es" ? "estrategias explicadas" : locale === "en" ? "strategies explained" : "stratégies expliquées", icon: "target" },
      { value: "4", label: locale === "es" ? "juegos educativos" : locale === "en" ? "educational games" : "jeux éducatifs", icon: "layers" },
    ],
    discover: locale === "es" ? "Descubrir" : locale === "en" ? "Discover" : "Découvrir",

    // Bloc "Build ton trade" — panneau horizontal premium.
    buildTag: locale === "es" ? "Juego exclusivo incluido en la formación" : locale === "en" ? "Exclusive game included in the course" : "Jeu exclusif inclus dans la formation",
    buildCta: locale === "es" ? "Descubrir el juego" : locale === "en" ? "Discover the game" : "Découvrir le jeu",
    buildCards: [
      { label: locale === "es" ? "Escenario" : locale === "en" ? "Scenario" : "Scénario", icon: "🎯", delta: "A+", bars: [10, 16, 12] },
      { label: locale === "en" ? "Analysis" : "Analyse", icon: "📊", delta: "+24%", bars: [14, 9, 18] },
      { label: locale === "es" ? "Decisiones" : locale === "en" ? "Decisions" : "Décisions", icon: "⚡", delta: "1.8R", bars: [9, 15, 11] },
      { label: locale === "es" ? "Objetivos" : locale === "en" ? "Targets" : "Objectifs", icon: "🏆", delta: "92%", bars: [12, 18, 14] },
    ],

    progression: {
      title: locale === "es" ? "Tu recorrido progresivo" : locale === "en" ? "Your progressive path" : "Ton parcours progressif",
      subtitle: locale === "es" ? "Aprende paso a paso y desarrolla tus competencias" : locale === "en" ? "Learn step by step and build your skills" : "Apprends étape par étape et développe tes compétences",
      debutantLabel: locale === "es" ? "PRINCIPIANTE" : locale === "en" ? "BEGINNER" : "DÉBUTANT",
      debutantDesc: locale === "es" ? "Aprende las bases" : locale === "en" ? "Learn the basics" : "Apprends les bases",
      intermediateLabel: locale === "es" ? "INTERMEDIO" : locale === "en" ? "INTERMEDIATE" : "INTERMÉDIAIRE",
      intermediateDesc: locale === "es" ? "Refuerza tus competencias" : locale === "en" ? "Strengthen your skills" : "Renforce tes compétences",
      advancedLabel: locale === "es" ? "AVANZADO" : locale === "en" ? "ADVANCED" : "AVANCÉ",
      advancedDesc: locale === "es" ? "Domina los mercados" : locale === "en" ? "Master the markets" : "Maîtrise les marchés",
      lessons: locale === "es" ? "lecciones" : locale === "en" ? "lessons" : "leçons",
    },
    poles: {
      title: locale === "es" ? "Un recorrido completo para todos los traders" : locale === "en" ? "A complete path for every trader" : "Un parcours complet pour tous les traders",
      subtitle: locale === "es" ? "4 pilares esenciales para desarrollar tus competencias" : locale === "en" ? "4 essential pillars to build your skills" : "4 pôles essentiels pour développer tes compétences",
      cta: locale === "es" ? "Ver los accesos" : locale === "en" ? "View the plans" : "Voir les accès",
      trading: {
        title: "Trading",
        desc: locale === "es" ? "Domina las bases y construye setups sólidos." : locale === "en" ? "Master the basics and build solid setups." : "Maîtrise les bases et construis des setups solides.",
        bullets: locale === "es"
          ? [`${debutantCount} lecciones principiante`, `${intermediaireCount} lecciones intermedio`, `${avanceCount} lecciones avanzado`, "Quiz y ejercicios"]
          : locale === "en"
          ? [`${debutantCount} beginner lessons`, `${intermediaireCount} intermediate lessons`, `${avanceCount} advanced lessons`, "Quizzes and exercises"]
          : [`${debutantCount} leçons débutant`, `${intermediaireCount} leçons intermédiaire`, `${avanceCount} leçons avancé`, "Quiz et exercices"],
      },
      macro: {
        title: "Macro",
        desc: locale === "es" ? "Entiende las fuerzas que mueven los mercados." : locale === "en" ? "Understand the forces that move the markets." : "Comprends les forces qui déplacent les marchés.",
        bullets: locale === "es"
          ? ["Análisis macroeconómicos", "Indicadores clave", "Eventos mayores", "Impacto en los mercados"]
          : locale === "en"
          ? ["Macroeconomic analysis", "Key indicators", "Major events", "Impact on the markets"]
          : ["Analyses macroéconomiques", "Indicateurs clés", "Événements majeurs", "Impact sur les marchés"],
      },
      strategies: {
        title: locale === "es" ? "Estrategias" : locale === "en" ? "Strategies" : "Stratégies",
        desc: locale === "es" ? "Descubre y aplica estrategias probadas." : locale === "en" ? "Discover and apply proven strategies." : "Découvre et applique des stratégies éprouvées.",
        bullets: locale === "es"
          ? ["Estrategias rentables", "Planes de trading detallados", "Gestión del riesgo", "Backtests y casos reales"]
          : locale === "en"
          ? ["Profitable strategies", "Detailed trading plans", "Risk management", "Backtests and real cases"]
          : ["Stratégies rentables", "Plans de trading détaillés", "Gestion du risque", "Backtests et cas réels"],
      },
      games: {
        title: locale === "es" ? "Juegos" : locale === "en" ? "Games" : "Jeux",
        desc: locale === "es" ? "Aprende divirtiéndote y pon a prueba tus competencias." : locale === "en" ? "Learn while having fun and test your skills." : "Apprends en t'amusant et teste tes compétences.",
        bullets: locale === "es"
          ? ["Simulaciones realistas", "Retos diarios", "Rankings", "Recompensas"]
          : locale === "en"
          ? ["Realistic simulations", "Daily challenges", "Leaderboards", "Rewards"]
          : ["Simulations réalistes", "Défis quotidiens", "Classements", "Récompenses"],
      },
    },
    access: {
      title: locale === "es" ? "¿Cómo acceder?" : locale === "en" ? "How to get access?" : "Comment accéder ?",
      subtitle: locale === "es" ? "Dos vías pour unirte à la plataforma." : locale === "en" ? "Two ways to join the platform." : "Deux voies pour rejoindre la plateforme.",
      trial: {
        title: locale === "es" ? "48h gratis" : locale === "en" ? "48h free" : "48h gratuites",
        desc: locale === "es"
          ? "Prueba la plataforma durante 48h, sin compromiso."
          : locale === "en"
          ? "Try the platform for 48h, no commitment."
          : "Teste la plateforme pendant 48h, sans engagement.",
        cta: locale === "es" ? "Recibir mi código" : locale === "en" ? "Get my code" : "Recevoir mon code",
      },
      broker: {
        badge: locale === "es" ? "Recomendado" : locale === "en" ? "Recommended" : "Recommandé",
        title: locale === "es" ? "Vía broker partner" : locale === "en" ? "Via partner broker" : "Via broker partenaire",
        price: "0€",
        desc: locale === "es"
          ? "Abre una cuenta broker vía nuestro enlace de afiliación. Recibes después tu código de acceso por email."
          : locale === "en"
          ? "Open a broker account through our affiliate link. You then receive your access code by email."
          : "Tu ouvres un compte broker via notre lien d'affiliation. Tu reçois ensuite ton code d'accès par email.",
        bullets: locale === "es"
          ? ["Apertura de cuenta broker partner", "Código enviado tras verificación", "Acceso completo a la plataforma"]
          : locale === "en"
          ? ["Open a partner broker account", "Code sent after verification", "Full access to the platform"]
          : ["Ouverture compte broker partenaire", "Code envoyé après vérification", "Accès complet à la plateforme"],
        depositNote: locale === "es"
          ? "Depósito 200 € en tu cuenta broker · tu dinero, retirable cuando quieras"
          : locale === "en"
          ? "€200 deposit into your broker account · your money, withdrawable at any time"
          : "Dépôt 200 € sur ton compte broker · ton argent, retirable à tout moment",
      },
      direct: {
        title: locale === "es" ? "Acceso directo" : locale === "en" ? "Direct access" : "Accès direct",
        price: "19€",
        period: locale === "es" ? "/mes" : locale === "en" ? "/month" : "/mois",
        desc: locale === "es"
          ? "Abono mensual sin afiliación broker. Código generado automáticamente al pagar."
          : locale === "en"
          ? "Monthly subscription with no broker affiliation. Code generated automatically on payment."
          : "Abonnement mensuel sans affiliation broker. Code généré automatiquement au paiement.",
        bullets: locale === "es"
          ? ["Abono mensual", "Código generado al pagar", "Acceso completo a la plataforma"]
          : locale === "en"
          ? ["Monthly subscription", "Code generated on payment", "Full access to the platform"]
          : ["Abonnement mensuel", "Code généré au paiement", "Accès complet à la plateforme"],
      },
      cta: locale === "es" ? "Ver el detalle" : locale === "en" ? "View the details" : "Voir le détail",
    },
    footer: {
      taglineL1: locale === "es" ? "Aprende, comprende, progresa." : locale === "en" ? "Learn, understand, progress." : "Apprends, comprends, progresse.",
      taglineL2: locale === "es" ? "De principiante a rentable." : locale === "en" ? "From beginner to profitable." : "De débutant à rentable.",
      platform: locale === "es" ? "Plataforma" : locale === "en" ? "Platform" : "Plateforme",
      account: locale === "es" ? "Cuenta" : locale === "en" ? "Account" : "Compte",
      resources: locale === "es" ? "Recursos" : locale === "en" ? "Resources" : "Ressources",
      profile: locale === "es" ? "Mi perfil" : locale === "en" ? "My profile" : "Mon profil",
      progress: locale === "es" ? "Mi progreso" : locale === "en" ? "My progress" : "Ma progression",
      settings: locale === "es" ? "Configuración" : locale === "en" ? "Settings" : "Paramètres",
      pricing: locale === "es" ? "Nuestros accesos" : locale === "en" ? "Plans" : "Nos accès",
      about: locale === "es" ? "Sobre nosotros" : locale === "en" ? "About" : "À propos",
      contact: locale === "es" ? "Contacto" : locale === "en" ? "Contact" : "Contact",
      newsletter: locale === "es" ? "Mantente informado" : locale === "en" ? "Stay informed" : "Reste informé",
      newsletterDesc: locale === "es" ? "Recibe consejos, novedades y actualizaciones." : locale === "en" ? "Get tips, news and updates." : "Reçois des conseils, les nouveautés et les mises à jour.",
      emailPlaceholder: locale === "es" ? "Tu email" : locale === "en" ? "Your email" : "Ton email",
      subscribe: locale === "es" ? "Suscribirme" : locale === "en" ? "Subscribe" : "S'abonner",
      copyright: locale === "es" ? "© 2025 TradeScaleX. Todos los derechos reservados." : locale === "en" ? "© 2025 TradeScaleX. All rights reserved." : "© 2025 TradeScaleX. Tous droits réservés.",
      legalNotice: locale === "es" ? "Aviso legal" : locale === "en" ? "Legal notice" : "Mentions légales",
      terms: locale === "es" ? "Términos de uso" : locale === "en" ? "Terms of use" : "Conditions d'utilisation",
      privacy: locale === "es" ? "Política de privacidad" : locale === "en" ? "Privacy policy" : "Política de confidentialité",
    },
  };

  return (
    <main
      className="relative text-white overflow-hidden"
      style={{
        // Socle colorimétrique : dégradé vertical bleu nuit → bleu pétrole →
        // turquoise très sombre → vert profond. Plus de nuances pétrole/turquoise
        // et moins de noir pur, avec une légère ondulation de teinte entre les
        // sections. Toutes ces teintes restent sombres → texte blanc lisible.
        background:
          "linear-gradient(180deg, #04121B 0%, #06181F 16%, #06202A 32%, #051B24 48%, #062023 64%, #051E1A 80%, #06231C 100%)",
      }}
    >
      {/* ═════════════════════════════════════════════════════════════════════
          0. FOND GLOBAL — halos larges multi-teintes (emerald / teal / bleu
             pétrole / turquoise) répartis en alternance gauche/droite sur toute
             la hauteur. Donne la richesse colorée et la continuité demandées.
             -z-10 : derrière le contenu, au-dessus du dégradé de base de <main>.
          ═════════════════════════════════════════════════════════════════════ */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: [
            "radial-gradient(1150px 660px at 82% 4%, rgba(16,185,129,0.12), transparent 68%)",    // emerald — haut droite (hero)
            "radial-gradient(1000px 660px at 6% 16%, rgba(12,128,118,0.10), transparent 70%)",     // teal — gauche
            "radial-gradient(900px 600px at 92% 30%, rgba(11,92,116,0.10), transparent 70%)",      // pétrole — droite (variation)
            "radial-gradient(1100px 740px at 88% 46%, rgba(11,92,116,0.11), transparent 72%)",     // pétrole profond — droite
            "radial-gradient(1000px 700px at 8% 60%, rgba(16,185,129,0.10), transparent 72%)",     // emerald — gauche
            "radial-gradient(900px 620px at 84% 73%, rgba(26,150,138,0.085), transparent 70%)",    // turquoise — droite (variation)
            "radial-gradient(1120px 760px at 12% 88%, rgba(26,150,138,0.085), transparent 72%)",   // turquoise — bas gauche
          ].join(", "),
        }}
      />
      {/* ═════════════════════════════════════════════════════════════════════
          1. HERO — 3 blobs glow emerald via .hero / .hero-inner pseudo-elements
                    (cf. globals.css). PAS d'overflow-hidden : le glow doit
                    déborder dans .parcours-section pour transition fluide.
          ═════════════════════════════════════════════════════════════════════ */}
      <section className="hero px-6 pt-24 pb-24 text-center md:pt-[120px] md:pb-[100px]">
        {/* ─── Couche décorative hero (desktop only) ──────────────────────────
            En complément des glows .hero::before/::after (globals.css) :
            1) gros faisceau lumineux vert en diagonale à gauche,
            2) faisceaux secondaires plus fins (lignes lumineuses),
            3) mock dashboard sombre à droite (fenêtre + chart chandeliers).
            100% SVG/CSS, zéro asset/réseau. Masquée < lg pour préserver les
            perfs mobiles et éviter tout débordement horizontal. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden lg:block">
          {/* Halo ambiant vert profond en haut-gauche (source du faisceau) */}
          <div
            className="absolute -left-[8%] -top-[30%] h-[125%] w-[740px]"
            style={{
              background: "radial-gradient(ellipse at 35% 40%, rgba(16,185,129,0.26), rgba(16,185,129,0.075) 45%, transparent 72%)",
              filter: "blur(70px)",
            }}
          />
          {/* Profondeur bleu pétrole derrière le titre (centre du hero) */}
          <div
            className="absolute left-1/2 top-[16%] h-[480px] w-[940px] -translate-x-1/2"
            style={{
              background: "radial-gradient(ellipse at 50% 50%, rgba(11,92,116,0.19), rgba(12,128,118,0.08) 46%, transparent 72%)",
              filter: "blur(82px)",
            }}
          />
          {/* Gros faisceau lumineux gauche (cône diagonal flouté) — élargi/intensifié */}
          <div
            className="absolute -left-[16%] -top-[25%] h-[170%] w-[660px] -rotate-[22deg]"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(16,185,129,0.16) 32%, rgba(52,211,153,0.40) 50%, rgba(16,185,129,0.16) 68%, transparent)",
              filter: "blur(38px)",
            }}
          />
          {/* Cœurs du faisceau, plus nets et plus clairs (lignes lumineuses) */}
          <div
            className="absolute left-[3%] -top-[12%] h-[140%] w-[4px] -rotate-[22deg]"
            style={{
              background: "linear-gradient(180deg, transparent, rgba(167,243,208,0.6), transparent)",
              filter: "blur(1.5px)",
            }}
          />
          <div
            className="absolute left-[8%] -top-[12%] h-[140%] w-[2px] -rotate-[22deg]"
            style={{
              background: "linear-gradient(180deg, transparent, rgba(52,211,153,0.44), transparent)",
            }}
          />
          <div
            className="absolute left-[12%] -top-[12%] h-[140%] w-px -rotate-[22deg]"
            style={{
              background: "linear-gradient(180deg, transparent, rgba(60,180,168,0.36), transparent)",
            }}
          />

          {/* Glow ambiant bleu pétrole/turquoise derrière le dashboard (richesse) */}
          <div
            className="absolute right-[-4%] top-[2%] h-[620px] w-[760px]"
            style={{
              background: "radial-gradient(ellipse at 60% 45%, rgba(26,150,138,0.16), rgba(11,92,116,0.08) 45%, transparent 72%)",
              filter: "blur(75px)",
            }}
          />

          {/* Faisceaux secondaires diagonaux côté droit (lignes lumineuses) */}
          <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 1440 700" fill="none">
            <defs>
              <linearGradient id="hero-beam" x1="1440" y1="0" x2="560" y2="640" gradientUnits="userSpaceOnUse">
                <stop stopColor="#34d399" stopOpacity="0.7" />
                <stop offset="1" stopColor="#34d399" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="hero-beam-teal" x1="1440" y1="40" x2="620" y2="700" gradientUnits="userSpaceOnUse">
                <stop stopColor="#2a9d92" stopOpacity="0.4" />
                <stop offset="1" stopColor="#2a9d92" stopOpacity="0" />
              </linearGradient>
            </defs>
            <g stroke="url(#hero-beam)" strokeWidth="2">
              <line x1="1480" y1="30" x2="680" y2="560" />
              <line x1="1480" y1="110" x2="740" y2="650" />
              <line x1="1400" y1="-30" x2="620" y2="500" />
              <line x1="1520" y1="190" x2="780" y2="690" />
            </g>
            <g stroke="url(#hero-beam-teal)" strokeWidth="1.5">
              <line x1="1500" y1="80" x2="700" y2="700" />
              <line x1="1340" y1="-10" x2="600" y2="540" />
            </g>
          </svg>

          {/* Mock dashboard sombre à droite (déborde hors écran, rotation légère) */}
          <div
            className="absolute right-[-70px] top-[76px] w-[710px] -rotate-[4deg] rounded-2xl border border-emerald-400/25 bg-[#061a22]/85 shadow-[0_60px_160px_-30px_rgba(16,185,129,0.5)] xl:right-[0px]"
          >
            {/* Glow emerald derrière le panneau */}
            <div
              className="absolute -inset-12 -z-10 rounded-[44px]"
              style={{ background: "radial-gradient(ellipse at 55% 45%, rgba(16,185,129,0.26), rgba(26,150,138,0.095) 50%, transparent 72%)", filter: "blur(44px)" }}
            />
            {/* Barre de fenêtre */}
            <div className="flex items-center gap-1.5 border-b border-white/5 px-4 py-2.5">
              <span className="h-2 w-2 rounded-full bg-red-500/70" />
              <span className="h-2 w-2 rounded-full bg-amber-400/70" />
              <span className="h-2 w-2 rounded-full bg-emerald-500/70" />
              <span className="ml-3 h-1.5 w-40 rounded-full bg-white/5" />
            </div>
            {/* Corps : mini sidebar + chart */}
            <div className="flex gap-4 p-4">
              <div className="hidden w-28 shrink-0 flex-col gap-2 xl:flex">
                <span className="h-2 w-20 rounded bg-emerald-500/25" />
                <span className="h-2 w-16 rounded bg-white/8" />
                <span className="h-2 w-24 rounded bg-white/8" />
                <span className="h-2 w-14 rounded bg-white/8" />
                <span className="h-2 w-20 rounded bg-white/8" />
                <span className="mt-2 h-2 w-24 rounded bg-emerald-500/20" />
              </div>
              <div className="relative flex-1 overflow-hidden rounded-lg border border-white/5 bg-black/30 p-3">
                <div aria-hidden="true" className="preview-chart-grid absolute inset-3" />
                <svg viewBox="0 0 380 150" className="relative block h-auto w-full" fill="none">
                  <defs>
                    <linearGradient id="hero-dash-candle" x1="0" y1="0" x2="0" y2="1">
                      <stop stopColor="#34d399" />
                      <stop offset="1" stopColor="#10b981" stopOpacity="0.5" />
                    </linearGradient>
                    <linearGradient id="hero-dash-line" x1="0" y1="0" x2="380" y2="0" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#34d399" stopOpacity="0" />
                      <stop offset="0.5" stopColor="#34d399" stopOpacity="0.8" />
                      <stop offset="1" stopColor="#34d399" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Trend line ascendante */}
                  <path d="M10 120 L70 100 L120 108 L180 70 L240 80 L300 45 L370 30" stroke="url(#hero-dash-line)" strokeWidth="1.5" fill="none" />
                  {/* Chandeliers */}
                  <g stroke="#059669" strokeWidth="1.2">
                    <line x1="30" y1="96" x2="30" y2="128" /><line x1="70" y1="84" x2="70" y2="118" />
                    <line x1="110" y1="92" x2="110" y2="124" /><line x1="150" y1="60" x2="150" y2="104" />
                    <line x1="190" y1="66" x2="190" y2="100" /><line x1="230" y1="70" x2="230" y2="108" />
                    <line x1="270" y1="44" x2="270" y2="86" /><line x1="310" y1="50" x2="310" y2="84" />
                    <line x1="350" y1="28" x2="350" y2="64" />
                  </g>
                  <g fill="url(#hero-dash-candle)">
                    <rect x="25" y="104" width="10" height="18" rx="1" /><rect x="65" y="92" width="10" height="20" rx="1" />
                    <rect x="105" y="100" width="10" height="18" rx="1" /><rect x="145" y="70" width="10" height="28" rx="1" />
                    <rect x="185" y="74" width="10" height="20" rx="1" /><rect x="225" y="80" width="10" height="22" rx="1" />
                    <rect x="265" y="52" width="10" height="28" rx="1" /><rect x="305" y="58" width="10" height="20" rx="1" />
                    <rect x="345" y="36" width="10" height="22" rx="1" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-inner mx-auto max-w-[800px]">
          <span className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold tracking-wider text-emerald-400">
            {t.hero.badge}
          </span>

          <h1 className="mb-5 text-4xl font-extrabold tracking-tight leading-[1.05] md:text-[56px]">
            {t.hero.titleLine1}
            <br />
            <span className="text-emerald-500">{t.hero.titleLine2}</span>
          </h1>

          <p className="mx-auto mb-9 max-w-[580px] text-base leading-relaxed text-zinc-400 md:text-[17px]">
            {t.hero.subtitle}
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href={h("/pricing")}
              className="inline-flex items-center gap-1.5 rounded-[10px] bg-emerald-500 px-6 py-3.5 text-[15px] font-semibold text-zinc-950 transition-all hover:-translate-y-0.5 hover:bg-emerald-400 shadow-lg shadow-emerald-500/25"
            >
              {t.hero.ctaPrimary}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href={h("/activer-code")}
              className="inline-flex items-center gap-2 rounded-[10px] border border-zinc-700 bg-zinc-800/50 px-6 py-3.5 text-[15px] font-medium text-white transition-all hover:bg-zinc-800/80"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M4 6V4.5a3 3 0 1 1 6 0V6" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
                <rect x="2.5" y="6" width="9" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" fill="none" />
              </svg>
              {t.hero.ctaSecondary}
            </Link>
          </div>
          {/* Bullets retirées : la rangée de 4 cartes stats (section 1b) joue
              désormais ce rôle, conformément à la maquette validée. */}
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          1b. CARTES STATISTIQUES — 48h / 30+ leçons / 12+ stratégies / 4 piliers
              Rangée sous le hero. Grid 4 col (desktop) → 2 col (mobile).
              z-10 pour passer au-dessus du glow hero, fond transparent pour
              laisser transparaître le halo emerald.
          ═════════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 -mt-6 px-6 pb-6 md:-mt-10 md:pb-10">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {T.stats.map((s) => (
            <div
              key={s.value}
              className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/50 px-4 py-4 transition-colors hover:border-zinc-700 md:px-5"
            >
              <div
                aria-hidden="true"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/[0.12] text-emerald-400"
              >
                {STAT_ICON[s.icon]}
              </div>
              <div className="min-w-0">
                <div className="text-xl font-extrabold tabular-nums text-emerald-400 md:text-2xl">
                  {s.value}
                </div>
                <div className="text-[12px] leading-tight text-zinc-400 md:text-[13px]">
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          2. TON PARCOURS PROGRESSIF — 3 hexagones (avec blob de transition
             venant du hero, cf. .parcours-section dans globals.css)
          ═════════════════════════════════════════════════════════════════════ */}
      <section className="parcours-section px-6 pt-20 pb-16 md:pb-20">
        <div className="relative z-10 max-w-5xl mx-auto rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900/60 to-zinc-900/20 px-6 py-12 md:py-14 shadow-[0_0_60px_-20px_rgba(16,185,129,0.08)]">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{T.progression.title}</h2>
            <p className="text-zinc-400 mt-2 text-[15px]">
              {T.progression.subtitle}
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 items-start">
            {/*
              Deux segments distincts qui contournent l'hexagone du milieu :
              - Segment 1 : entre hex 1 et hex 2
              - Segment 2 : entre hex 2 et hex 3
              Hex centré dans sa colonne (chaque col = 33.33% large), donc
              entre col 1 et col 2 = de 16.67%+38px à 50%-38px (38px = demi-hex).
            */}
            <div
              aria-hidden="true"
              className="hidden md:block absolute top-[45px] h-px border-t-2 border-dashed border-zinc-700/60 pointer-events-none"
              style={{
                left: "calc(16.67% + 38px)",
                right: "calc(50% + 38px)",
              }}
            />
            <div
              aria-hidden="true"
              className="hidden md:block absolute top-[45px] h-px border-t-2 border-dashed border-zinc-700/60 pointer-events-none"
              style={{
                left: "calc(50% + 38px)",
                right: "calc(16.67% + 38px)",
              }}
            />

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
                href: "/formations",
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
                href: "/formations/intermediaire",
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
                href: "/formations/avance",
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
                <Link
                  href={h(step.href)}
                  className="mt-3.5 inline-flex items-center gap-1 text-[13px] font-semibold transition-opacity hover:opacity-80"
                  style={{ color: step.color }}
                >
                  {T.discover}
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M3 6h6M6 3l3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          2b. L'INTÉRIEUR DE LA PLATEFORME — mock screenshot + Order Block SVG
              + texte de leçon coupé (effet Zeigarnik). SVG copié à
              l'identique du mockup (coordonnées validées techniquement).
          ═════════════════════════════════════════════════════════════════════ */}
      <section className="platform-preview-section px-6 py-24 md:py-28">
        <div className="relative z-10">
          <div className="mb-8 text-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-400">
              {t.platformPreview.eyebrow}
            </span>
            <h2 className="mt-2.5 text-3xl font-extrabold tracking-tight md:text-[38px]">
              {t.platformPreview.title}
            </h2>
            <p className="mt-2 text-[15px] text-zinc-400">
              {t.platformPreview.subtitle}
            </p>
          </div>

          <div className="relative mx-auto max-w-[1180px]">
            {/* Double glow derrière le screenshot — emerald + bleu pétrole — pour
                que la pièce centrale "flotte" sur un halo riche et marqué. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-x-20 -inset-y-24 -z-10"
              style={{
                background: [
                  "radial-gradient(ellipse at 50% 42%, rgba(16,185,129,0.30), rgba(16,185,129,0.08) 50%, transparent 75%)",
                  "radial-gradient(circle at 20% 60%, rgba(11,92,116,0.20), transparent 68%)",
                  "radial-gradient(circle at 82% 36%, rgba(26,150,138,0.155), transparent 66%)",
                ].join(", "),
                filter: "blur(60px)",
              }}
            />
            <div className="relative overflow-hidden rounded-2xl border border-emerald-400/30 bg-gradient-to-b from-[#0a1f24] to-[#06141a] shadow-[0_60px_150px_-30px_rgba(16,185,129,0.50),0_0_0_1px_rgba(16,185,129,0.20)] ring-1 ring-emerald-400/10">
            {/* Toolbar browser */}
            <div className="flex items-center gap-2 border-b border-zinc-800 bg-black/30 px-4 py-3">
              <span aria-hidden="true" className="h-[11px] w-[11px] rounded-full bg-red-500" />
              <span aria-hidden="true" className="h-[11px] w-[11px] rounded-full bg-amber-400" />
              <span aria-hidden="true" className="h-[11px] w-[11px] rounded-full bg-emerald-500" />
              <span className="min-w-0 flex-1 truncate text-center font-mono text-xs text-zinc-500">
                {t.platformPreview.url}
              </span>
            </div>

            {/* Body */}
            <div className="grid grid-cols-1 gap-8 p-10 md:grid-cols-[250px_1fr]">
              {/* Sidebar — masquée en mobile */}
              <aside className="hidden rounded-[10px] bg-black/20 p-5 md:block">
                <p className="mb-3.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-zinc-500">
                  {t.platformPreview.sidebarTitle}
                </p>
                {t.platformPreview.lessons.map((title, i) => {
                  const state = LESSON_STATES[i];
                  const isActive = state === "active";
                  const isLocked = state === "locked";
                  const rowClass = isActive
                    ? "bg-emerald-500/10 text-emerald-400"
                    : isLocked
                      ? "text-zinc-500 opacity-40"
                      : "text-zinc-400";
                  const badgeClass = isLocked
                    ? "bg-white/[0.08] text-zinc-500"
                    : "bg-emerald-500/20 text-emerald-400";
                  return (
                    <div
                      key={title}
                      className={`mb-1 flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] ${rowClass}`}
                    >
                      <span
                        aria-hidden="true"
                        className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-[10px] ${badgeClass}`}
                      >
                        {isLocked ? i + 1 : "✓"}
                      </span>
                      <span>{title}</span>
                    </div>
                  );
                })}
              </aside>

              {/* Main lesson preview */}
              <div>
                <h4 className="mb-2 text-2xl font-semibold">
                  {t.platformPreview.lessonTitle}
                </h4>
                <p className="mb-6 text-sm text-zinc-400">
                  {t.platformPreview.lessonSubtitle}
                </p>

                {/* Chart Order Block (SVG copié pixel-perfect du mockup).
                    Hauteur pilotée par le ratio du viewBox (500:180) via
                    w-full + h-auto : le SVG remplit la largeur et le cadre
                    suit sa hauteur, donc plus d'espace noir vide sur mobile.
                    Padding réduit en mobile (p-3) pour maximiser la surface. */}
                <div className="relative overflow-hidden rounded-[10px] border border-zinc-800 bg-black/30 p-3 md:p-6">
                  <div aria-hidden="true" className="preview-chart-grid absolute inset-3 md:inset-6" />
                  <svg
                    viewBox="0 0 500 180"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="xMidYMid meet"
                    className="relative block h-auto w-full"
                    aria-hidden="true"
                  >
                    {/* Zone Order Block (englobe high/low de la bougie OB) */}
                    <rect x="75" y="105" width="405" height="37" fill="rgba(16,185,129,0.15)" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" />
                    <text x="470" y="137" textAnchor="end" fill="#10b981" fontSize="11" fontFamily="monospace" fontWeight="700">{t.platformPreview.chartBadge}</text>

                    {/* Bougies de consolidation */}
                    <rect x="20" y="115" width="7" height="20" fill="#ef4444" />
                    <line x1="23.5" y1="110" x2="23.5" y2="140" stroke="#b91c1c" strokeWidth="1.5" />
                    <rect x="40" y="118" width="7" height="18" fill="#10b981" />
                    <line x1="43.5" y1="112" x2="43.5" y2="140" stroke="#059669" strokeWidth="1.5" />
                    <rect x="60" y="115" width="7" height="22" fill="#ef4444" />
                    <line x1="63.5" y1="110" x2="63.5" y2="142" stroke="#b91c1c" strokeWidth="1.5" />

                    {/* Bougie OB (dernière baissière avant expansion) */}
                    <rect x="80" y="110" width="9" height="25" fill="#ef4444" stroke="#fbbf24" strokeWidth="1.5" />
                    <line x1="84.5" y1="105" x2="84.5" y2="142" stroke="#b91c1c" strokeWidth="1.5" />
                    <text x="76" y="158" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="700">{t.platformPreview.chartObLabel}</text>

                    {/* Mouvement explosif bullish (BOS) */}
                    <rect x="105" y="80" width="7" height="35" fill="#10b981" />
                    <line x1="108.5" y1="72" x2="108.5" y2="118" stroke="#059669" strokeWidth="1.5" />
                    <rect x="125" y="55" width="7" height="40" fill="#10b981" />
                    <line x1="128.5" y1="48" x2="128.5" y2="100" stroke="#059669" strokeWidth="1.5" />
                    <rect x="145" y="35" width="7" height="35" fill="#10b981" />
                    <line x1="148.5" y1="28" x2="148.5" y2="75" stroke="#059669" strokeWidth="1.5" />
                    <rect x="165" y="30" width="7" height="20" fill="#ef4444" />
                    <line x1="168.5" y1="25" x2="168.5" y2="55" stroke="#b91c1c" strokeWidth="1.5" />
                    <rect x="185" y="35" width="7" height="25" fill="#10b981" />
                    <line x1="188.5" y1="28" x2="188.5" y2="65" stroke="#059669" strokeWidth="1.5" />

                    {/* Retour vers le OB (mitigation) */}
                    <rect x="220" y="55" width="7" height="30" fill="#ef4444" />
                    <line x1="223.5" y1="48" x2="223.5" y2="90" stroke="#b91c1c" strokeWidth="1.5" />
                    <rect x="240" y="75" width="7" height="35" fill="#ef4444" />
                    <line x1="243.5" y1="65" x2="243.5" y2="115" stroke="#b91c1c" strokeWidth="1.5" />
                    <rect x="260" y="95" width="7" height="30" fill="#ef4444" />
                    <line x1="263.5" y1="85" x2="263.5" y2="130" stroke="#b91c1c" strokeWidth="1.5" />

                    {/* Bougie de mitigation : retour BAISSIER qui rentre dans l'OB (rouge) */}
                    <rect x="280" y="115" width="9" height="20" fill="#ef4444" stroke="#fbbf24" strokeWidth="1.5" />
                    <line x1="284.5" y1="108" x2="284.5" y2="140" stroke="#b91c1c" strokeWidth="1.5" />
                    <text x="266" y="155" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="700">MITIGATION</text>

                    {/* Rebond depuis OB = RÉACTION haussière (vert) */}
                    <text x="290" y="38" textAnchor="middle" fill="#10b981" fontSize="11" fontFamily="monospace" fontWeight="700">{t.platformPreview.chartReactionLabel}</text>
                    <rect x="305" y="85" width="7" height="25" fill="#10b981" />
                    <line x1="308.5" y1="78" x2="308.5" y2="115" stroke="#059669" strokeWidth="1.5" />
                    <rect x="325" y="60" width="7" height="30" fill="#10b981" />
                    <line x1="328.5" y1="52" x2="328.5" y2="95" stroke="#059669" strokeWidth="1.5" />
                    <rect x="345" y="40" width="7" height="25" fill="#10b981" />
                    <line x1="348.5" y1="32" x2="348.5" y2="70" stroke="#059669" strokeWidth="1.5" />
                    <rect x="365" y="25" width="7" height="20" fill="#10b981" />
                    <line x1="368.5" y1="18" x2="368.5" y2="50" stroke="#059669" strokeWidth="1.5" />
                    <rect x="385" y="20" width="7" height="15" fill="#ef4444" />
                    <line x1="388.5" y1="15" x2="388.5" y2="40" stroke="#b91c1c" strokeWidth="1.5" />
                    <rect x="405" y="22" width="7" height="13" fill="#10b981" />
                    <line x1="408.5" y1="18" x2="408.5" y2="40" stroke="#059669" strokeWidth="1.5" />
                    <rect x="425" y="15" width="7" height="18" fill="#10b981" />
                    <line x1="428.5" y1="10" x2="428.5" y2="38" stroke="#059669" strokeWidth="1.5" />
                    <rect x="445" y="10" width="7" height="13" fill="#10b981" />
                    <line x1="448.5" y1="5" x2="448.5" y2="28" stroke="#059669" strokeWidth="1.5" />
                  </svg>
                </div>

                {/* Texte d'intro coupé en fade-out (effet Zeigarnik) */}
                <div className="lesson-text-preview mt-6">
                  {t.platformPreview.intro.map((paragraph, i) => (
                    <p key={i} className="mb-2.5 text-[13.5px] leading-relaxed text-zinc-300">
                      {renderBold(paragraph)}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          3. 4 PILIERS — Trading / Macro / Stratégies / Jeux
             Couleurs limitées au design system : emerald, blue, amber.
             Games partage emerald (pas de violet/purple par règle DS).
          ═════════════════════════════════════════════════════════════════════ */}
      <section className="relative px-6 py-20">
        {/* Halo central (teal/pétrole) pour que le milieu de page ne retombe
            pas dans le noir plat entre l'aperçu plateforme et les objections. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[700px] w-[1300px] -translate-x-1/2 -translate-y-1/2"
          style={{
            background: [
              "radial-gradient(ellipse at 50% 50%, rgba(12,128,118,0.08), transparent 68%)",
              "radial-gradient(circle at 80% 40%, rgba(16,185,129,0.075), transparent 66%)",
            ].join(", "),
            filter: "blur(80px)",
          }}
        />
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-2xl font-extrabold tracking-tight md:text-[36px]">
              {t.piliers.title}
            </h2>
            <p className="mt-2 text-[15px] text-zinc-400">{t.piliers.subtitle}</p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {t.piliers.items.map((p) => {
              const colorClass =
                p.key === "macro"
                  ? "bg-blue-400/15 text-blue-400"
                  : p.key === "strategies"
                    ? "bg-amber-400/15 text-amber-400"
                    : "bg-emerald-500/15 text-emerald-400";
              return (
                <div
                  key={p.key}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-700"
                >
                  <div
                    aria-hidden="true"
                    className={`mb-3.5 flex h-11 w-11 items-center justify-center rounded-[10px] text-xl ${colorClass}`}
                  >
                    {p.icon}
                  </div>
                  <h3 className="mb-1.5 text-[17px] font-semibold">{p.title}</h3>
                  <p className="mb-4 text-[13px] leading-relaxed text-zinc-400">
                    {p.description}
                  </p>
                  <ul className="space-y-1">
                    {p.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-center gap-2 text-[13px] text-zinc-300"
                      >
                        <span
                          aria-hidden="true"
                          className="text-xs font-bold text-emerald-400"
                        >
                          ✓
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          (CTA intermédiaire retiré — doublonnait avec le finalCta de fin de page,
          per mockup version-e2-final.html un seul "Prêt à rejoindre" suffit)
          ═════════════════════════════════════════════════════════════════════ */}

      {/* ═════════════════════════════════════════════════════════════════════
          5. L'APPROCHE — 6 features en grille 3×2 (mockup section .methode)
          ═════════════════════════════════════════════════════════════════════ */}
      <section
        className="border-y border-emerald-500/10 px-6 py-20 md:py-24"
        style={{
          background:
            "linear-gradient(180deg, rgba(5,16,23,0.5), rgba(6,22,27,0.35) 50%, rgba(4,19,22,0.5))",
        }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Heading centré */}
          <div className="text-center mb-6">
            <span className="inline-block text-[11px] font-bold text-emerald-400 uppercase tracking-[0.15em] mb-3">
              {t.approche.eyebrow}
            </span>
            <h2 className="text-3xl md:text-[40px] font-extrabold tracking-tight leading-[1.1]">
              {t.approche.titleLine1}
              <br />
              {t.approche.titleLine2}
            </h2>
          </div>

          {/* Grille 3 colonnes × 2 lignes — chaque feature a un border-top */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.approche.features.map((f) => (
              <div key={f.title} className="border-t border-zinc-800 pt-7">
                <div
                  aria-hidden="true"
                  className="mb-[18px] flex h-[38px] w-[38px] items-center justify-center rounded-[10px] border border-emerald-500/20 bg-emerald-500/10 text-base text-emerald-400"
                >
                  {f.icon}
                </div>
                <h3 className="mb-2 text-[17px] font-semibold leading-snug">{f.title}</h3>
                <p className="text-sm leading-[1.55] text-zinc-400">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          5a-bis. TÉMOIGNAGES — carrousel infini CSS + leave-review + build spotlight
          ═════════════════════════════════════════════════════════════════════ */}
      <section className="testimonials-section px-6 py-20 md:py-24">
        {/* Halo emerald géré par .testimonials-section::before (globals.css) */}
        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Heading + trust bar */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-5 h-px bg-emerald-500/60" />
              <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-[0.18em]">
                {t.testimonialsSection.eyebrow}
              </p>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-5 leading-tight">
              {t.testimonialsSection.title}
            </h2>
            <div className="inline-flex items-center gap-3.5 bg-zinc-900/80 border border-zinc-800 px-5 py-2.5 rounded-full">
              <span className="text-emerald-400 text-base tracking-[2px]" aria-hidden="true">
                ★★★★★
              </span>
              <span className="text-[13px] text-zinc-400">
                <strong className="text-white font-semibold">
                  {t.testimonialsSection.trustRating}
                </strong>
                {" · "}
                {t.testimonialsSection.trustText}
              </span>
            </div>
          </div>

          {/* Carrousel infini (Server Component, animation CSS) */}
          <ReviewsCarousel locale={locale} />

          {/* Banner "laisser un avis" */}
          <div className="mt-14 mx-auto max-w-xl flex flex-wrap items-center justify-between gap-5 px-8 py-6 rounded-2xl border border-dashed border-zinc-700 bg-gradient-to-br from-zinc-900/60 to-zinc-900/30">
            <div className="flex-1 min-w-[200px]">
              <h4 className="text-[15px] font-semibold mb-1">{t.leaveReview.title}</h4>
              <p className="text-[13px] text-zinc-400 leading-relaxed">
                {t.leaveReview.subtitle}
              </p>
            </div>
            <Link
              href={h("/reviews/new")}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 font-semibold text-[13px] transition-colors"
            >
              {t.leaveReview.ctaLabel}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path
                  d="M3 6h6M6 3l3 3-3 3"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>

          {/* Build ton trade — panneau horizontal premium (texte à gauche,
              visuel cartes à droite). Gradient 135deg emerald→zinc, border
              emerald-500/20, fond grille 24px (.spotlight-grid).
              Le visuel cartes 3D est une version CSS légère (grille 2×2 en
              perspective) plutôt qu'une image exportée : conforme à l'audit
              (cartes 3D fragiles en responsive → simplifier), masquée < md
              car les transforms 3D sont peu fiables sur petit écran. */}
          <div className="relative mt-16">
            {/* Glow externe large multi-teintes (hors du panneau overflow-hidden
                → visible tout autour). Emerald + turquoise + pétrole. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-x-16 -inset-y-16 -z-10"
              style={{
                background: [
                  "radial-gradient(ellipse at 68% 50%, rgba(16,185,129,0.22), rgba(16,185,129,0.055) 52%, transparent 76%)",
                  "radial-gradient(circle at 88% 60%, rgba(26,150,138,0.14), transparent 66%)",
                  "radial-gradient(circle at 14% 40%, rgba(11,92,116,0.13), transparent 66%)",
                ].join(", "),
                filter: "blur(54px)",
              }}
            />
            <div
              className="relative overflow-hidden rounded-[24px] border border-emerald-400/35 p-8 shadow-[0_55px_150px_-30px_rgba(16,185,129,0.6),inset_0_1px_0_rgba(255,255,255,0.08)] md:p-12 lg:p-14"
              style={{
                background:
                  "linear-gradient(135deg, rgba(16,185,129,0.22) 0%, rgba(12,128,118,0.13) 38%, rgba(6,26,33,0.62) 68%, rgba(4,16,21,0.72))",
              }}
            >
              <div aria-hidden="true" className="spotlight-grid absolute inset-0" />
              <div className="relative grid items-center gap-10 md:grid-cols-[1fr_1.15fr] md:gap-12">
                {/* Colonne texte */}
                <div className="text-center md:text-left">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-400">
                    ⚡ {T.buildTag}
                  </span>
                  <h3 className="mb-3 mt-4 text-[32px] font-extrabold leading-tight tracking-tight md:text-[38px]">
                    {t.buildSpotlight.title}
                  </h3>
                  <p className="mx-auto mb-7 max-w-[480px] text-[15px] leading-relaxed text-zinc-300/90 md:mx-0">
                    {t.buildSpotlight.description}
                  </p>
                  <Link
                    href={h("/jeux")}
                    className="inline-flex items-center gap-1.5 rounded-[10px] bg-emerald-500 px-6 py-3.5 text-[15px] font-semibold text-zinc-950 shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-0.5 hover:bg-emerald-400"
                  >
                    {T.buildCta}
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>

                {/* Colonne visuel — cartes "jeu" premium en perspective.
                    Grille 2×2 inclinée (rotateY/rotateX) : profondeur sans
                    positionnement absolu fragile. Masquée en mobile. */}
                <div
                  className="hidden items-center justify-center md:flex"
                  style={{ perspective: "1100px" }}
                >
                  <div
                    className="grid grid-cols-2 gap-4"
                    style={{
                      transform: "rotateY(-17deg) rotateX(8deg)",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {T.buildCards.map((c) => (
                      <div
                        key={c.label}
                        className="w-[168px] rounded-2xl border border-emerald-400/45 bg-gradient-to-br from-[#0c2730]/95 to-[#08181e]/95 p-4 shadow-[0_26px_66px_-12px_rgba(16,185,129,0.55)] ring-1 ring-emerald-400/12 backdrop-blur-sm"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <div
                            aria-hidden="true"
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15 text-base ring-1 ring-emerald-500/20"
                          >
                            {c.icon}
                          </div>
                          <span className="rounded-md bg-emerald-500/12 px-1.5 py-0.5 text-[11px] font-bold tabular-nums text-emerald-400">
                            {c.delta}
                          </span>
                        </div>
                        <p className="text-[13px] font-semibold text-white">{c.label}</p>
                        <div className="mt-3 flex items-end gap-1" aria-hidden="true">
                          {c.bars.map((bh, bi) => (
                            <span
                              key={bi}
                              className="w-2 rounded-sm bg-gradient-to-t from-emerald-500/40 to-emerald-400/80"
                              style={{ height: `${bh + 4}px` }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          5b. COMMENT ACCÉDER — 2 cartes (broker partenaire / accès direct)
          ═════════════════════════════════════════════════════════════════════ */}
      <section className="relative px-6 pb-16 md:pb-20">
        {/* Halo emerald/pétrole derrière les cartes de pricing (continuité +
            mise en valeur), -z-10 et flouté pour ne pas gêner la lisibilité. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[640px] w-[1200px] -translate-x-1/2 -translate-y-1/2"
          style={{
            background: [
              "radial-gradient(ellipse at 50% 50%, rgba(16,185,129,0.10), transparent 68%)",
              "radial-gradient(circle at 78% 60%, rgba(11,92,116,0.10), transparent 66%)",
            ].join(", "),
            filter: "blur(70px)",
          }}
        />
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{T.access.title}</h2>
            <p className="text-zinc-400 mt-2 text-[15px]">{T.access.subtitle}</p>
          </div>

          {/* Carte 48h gratuites — entry-point trial.
              Réutilise exactement le flow du badge 48h de /pricing : <form>
              vers la server action requestTrialCode (déconnecté → /signup?from=trial,
              connecté → mail envoyé + /code-envoye). Aucune nouvelle route. */}
          <div className="mb-5 bg-zinc-900/60 border border-emerald-500/30 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            <div className="flex-1">
              <h3 className="text-lg md:text-xl font-bold text-white mb-1">{T.access.trial.title}</h3>
              <p className="text-[13px] text-zinc-400 leading-relaxed">{T.access.trial.desc}</p>
            </div>
            <form action={requestTrialCode} className="w-full md:w-auto shrink-0">
              <input type="hidden" name="locale" value={locale} />
              <button
                type="submit"
                className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold py-2.5 px-5 rounded-xl transition-colors text-sm whitespace-nowrap"
              >
                {T.access.trial.cta}
              </button>
            </form>
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
              <ul className="space-y-2.5 mb-4 flex-1">
                {T.access.broker.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-[13px] text-zinc-300">
                    <CheckSmall color="#34d399" />
                    {b}
                  </li>
                ))}
              </ul>
              <p className="mb-5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-[12px] leading-snug text-zinc-300">
                {T.access.broker.depositNote}
              </p>
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
          6. TRANSFORMATION — "Tu vas faire quoi demain ?"
             Question calibrée (Option A : continuer comme avant /
             Option B : passer à l'action). Glow via .transformation-section
             pseudo-element. Remplace l'ancien finalCta.
          ═════════════════════════════════════════════════════════════════════ */}
      <section className="transformation-section px-6 py-24 text-center">
        <div className="relative z-10 mx-auto max-w-[720px]">
          <span className="mb-5 inline-block text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-400">
            {t.transformation.label}
          </span>
          <h2 className="mb-8 text-3xl font-extrabold tracking-tight leading-tight md:text-[42px]">
            {t.transformation.titlePrefix}{" "}
            <span className="text-emerald-500">{t.transformation.titleAccent}</span>
          </h2>

          <div className="mb-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 px-7 py-6 text-left">
            <div className="mb-3 text-[13px] font-bold uppercase tracking-wider text-zinc-500">
              {t.transformation.choiceA.label}
            </div>
            <p className="text-[14.5px] leading-relaxed text-zinc-400">
              {t.transformation.choiceA.body}
            </p>
          </div>

          <div className="mb-9 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/[0.08] to-zinc-900/50 px-7 py-6 text-left">
            <div className="mb-3 text-[13px] font-bold uppercase tracking-wider text-emerald-400">
              {t.transformation.choiceB.label}
            </div>
            <p className="text-[14.5px] leading-relaxed text-zinc-300">
              {t.transformation.choiceB.body}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href={h("/pricing")}
              className="inline-flex items-center gap-1.5 rounded-[10px] bg-emerald-500 px-6 py-3.5 text-[15px] font-semibold text-zinc-950 transition-all hover:-translate-y-0.5 hover:bg-emerald-400 shadow-lg shadow-emerald-500/25"
            >
              {t.transformation.ctaPrimary}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href={h("/activer-code")}
              className="inline-flex items-center gap-2 rounded-[10px] border border-zinc-700 bg-zinc-800/50 px-6 py-3.5 text-[15px] font-medium text-white transition-all hover:bg-zinc-800/80"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M4 6V4.5a3 3 0 1 1 6 0V6" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
                <rect x="2.5" y="6" width="9" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" fill="none" />
              </svg>
              {t.transformation.ctaSecondary}
            </Link>
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
