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
  const isEs = locale === "es";
  const T = {
    // T.hero retiré — désormais 100% géré par t.hero du dictionnaire.
    // T.progression, T.poles, T.access, T.footer restent en FR/ES inline car
    // ces sections sont hors scope mockup F (parcours hexagones / footer).
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
    access: {
      title: isEs ? "¿Cómo acceder?" : "Comment accéder ?",
      subtitle: isEs ? "Dos vías pour unirte à la plataforma." : "Deux voies pour rejoindre la plateforme.",
      trial: {
        title: isEs ? "48h gratis" : "48h gratuites",
        desc: isEs
          ? "Prueba la plataforma durante 48h, sin compromiso."
          : "Teste la plateforme pendant 48h, sans engagement.",
        cta: isEs ? "Recibir mi código" : "Recevoir mon code",
      },
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
        depositNote: isEs
          ? "Depósito 200 € en tu cuenta broker · tu dinero, retirable cuando quieras"
          : "Dépôt 200 € sur ton compte broker · ton argent, retirable à tout moment",
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
    footer: {
      taglineL1: isEs ? "Aprende, comprende, progresa." : "Apprends, comprends, progresse.",
      taglineL2: isEs ? "De principiante a rentable." : "De débutant à rentable.",
      platform: isEs ? "Plataforma" : "Plateforme",
      account: isEs ? "Cuenta" : "Compte",
      resources: isEs ? "Recursos" : "Ressources",
      profile: isEs ? "Mi perfil" : "Mon profil",
      progress: isEs ? "Mi progreso" : "Ma progression",
      settings: isEs ? "Configuración" : "Paramètres",
      pricing: isEs ? "Nuestros accesos" : "Nos accès",
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
          1. HERO — 3 blobs glow emerald via .hero / .hero-inner pseudo-elements
                    (cf. globals.css). PAS d'overflow-hidden : le glow doit
                    déborder dans .parcours-section pour transition fluide.
          ═════════════════════════════════════════════════════════════════════ */}
      <section className="hero px-6 pt-24 pb-24 text-center md:pt-[120px] md:pb-[100px]">
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

          <div className="mb-12 flex flex-wrap justify-center gap-3">
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

          {/* Mobile : items empilés alignés à gauche, container centré (mx-auto + w-fit)
              → icônes check verticalement alignées. Desktop (sm+) : restaure le layout
              ligne wrap + justify-center d'origine. */}
          <div className="flex flex-col items-start gap-4 w-fit mx-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-10 sm:w-auto">
            {t.hero.bullets.map((b) => (
              <div key={b.title} className="flex items-center gap-3 text-left">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="text-[13px]">
                  <strong className="block font-semibold text-white">{b.title}</strong>
                  <span className="text-zinc-500">{b.description}</span>
                </div>
              </div>
            ))}
          </div>
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
          2b. L'INTÉRIEUR DE LA PLATEFORME — mock screenshot + Order Block SVG
              + texte de leçon coupé (effet Zeigarnik). SVG copié à
              l'identique du mockup (coordonnées validées techniquement).
          ═════════════════════════════════════════════════════════════════════ */}
      <section className="platform-preview-section px-6 py-20">
        <div className="relative z-10">
          <div className="mb-6 text-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-400">
              {t.platformPreview.eyebrow}
            </span>
            <h2 className="mt-2.5 text-2xl font-extrabold tracking-tight md:text-[28px]">
              {t.platformPreview.title}
            </h2>
            <p className="mt-1.5 text-sm text-zinc-400">
              {t.platformPreview.subtitle}
            </p>
          </div>

          <div className="mx-auto max-w-[960px] overflow-hidden rounded-2xl border border-zinc-700 bg-gradient-to-b from-zinc-900 to-zinc-950 shadow-[0_30px_80px_-20px_rgba(16,185,129,0.15),0_0_0_1px_rgba(16,185,129,0.10)]">
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
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          3. 4 PILIERS — Trading / Macro / Stratégies / Jeux
             Couleurs limitées au design system : emerald, blue, amber.
             Games partage emerald (pas de violet/purple par règle DS).
          ═════════════════════════════════════════════════════════════════════ */}
      <section className="px-6 py-20">
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
      <section className="border-y border-zinc-800 bg-zinc-900/20 px-6 py-20 md:py-24">
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

          {/* Build the Trade spotlight — mockup .build-spotlight :
              max-width 750px, margin-top 64px, padding 40px,
              gradient 135deg rgba(16,185,129,0.08) → rgba(24,24,27,0.4),
              border emerald-500/20, fond grille 24px ×24px (cf. .spotlight-grid). */}
          <div
            className="relative mt-16 mx-auto max-w-[750px] overflow-hidden rounded-[20px] border border-emerald-500/20 p-10 text-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(24,24,27,0.4))",
            }}
          >
            <div aria-hidden="true" className="spotlight-grid absolute inset-0" />
            <div className="relative">
              <span className="inline-block text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-400">
                ⚡ {t.buildSpotlight.tag}
              </span>
              <h3 className="mb-3 mt-3.5 text-[30px] font-extrabold tracking-tight leading-tight">
                {t.buildSpotlight.title}
              </h3>
              <p className="mx-auto max-w-[520px] text-[15px] leading-relaxed text-zinc-400">
                {t.buildSpotlight.description}
              </p>
            </div>
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
