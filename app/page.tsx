import Link from "next/link";
import { TOTAL_FREE_LESSONS } from "@/lib/progress";
import { FORMATIONS } from "@/lib/formations";
import { STRATEGY_MODULES } from "@/lib/strategies";

const stats = [
  { value: String(TOTAL_FREE_LESSONS), label: "Leçons gratuites" },
  { value: String(STRATEGY_MODULES.length), label: "Stratégies enseignées" },
  { value: "3 niveaux", label: "Débutant · Intermédiaire · Avancé" },
  { value: "100%", label: "En ligne, à ton rythme" },
];

const audiences = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        {/* Socle / fondations */}
        <path d="M3 13.5h12M4.5 13.5v-3h9v3M6 10.5v-2.5h6v2.5M7.5 8v-2h3v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Construire des bases solides",
    description:
      "Structure de marché, lecture des prix, gestion du risque, R/R. Les fondamentaux travaillés en profondeur — pas survolés en cinq minutes.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        {/* Système / blueprint */}
        <rect x="2.5" y="2.5" width="13" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M2.5 7h13M7 2.5v13" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="10.5" cy="11" r="1.5" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    ),
    title: "Développer une vraie méthode",
    description:
      "Transformer des connaissances dispersées en système cohérent : règles d'entrée, filtres HTF, plan de trade, journaling. Une approche, pas dix.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        {/* Cible / pratique */}
        <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="9" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="9" cy="9" r="1" fill="currentColor" />
      </svg>
    ),
    title: "S'entraîner sur des situations réelles",
    description:
      "Jeux interactifs, scénarios marché, erreurs retail décortiquées. Apprendre par la pratique et la répétition — pas par la théorie sèche.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        {/* Flèche d'exécution / momentum */}
        <path d="M2.5 9h11M9 4.5L13.5 9 9 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3.5 12.5l-1 2M14.5 5.5l1-2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
    title: "Passer de la théorie à l'exécution",
    description:
      "Discipline, gestion émotionnelle, exécution propre. Le vrai delta entre savoir et faire — c'est là que se joue la performance dans le temps.",
  },
];

const memberContent = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="2" width="14" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 9h6M6 12h4M6 6h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Formations par niveaux",
    description: "Débutant, Intermédiaire, Avancé — progression logique et sans trous. Tu construis sur des fondations solides.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M2 13L5.5 8 9 11 13 5.5l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Stratégies Price Action, SMC & ICT",
    description: "Trois approches complémentaires enseignées rigoureusement : principes, quand les utiliser, exemples concrets sur vrais graphiques.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 5.5v4l2.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Quiz et exercices pratiques",
    description: "À la fin de chaque leçon : questions ciblées et cas appliqués directement sur des graphiques pour valider ta compréhension.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="4" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 9h3M6 12h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Tableau de bord de progression",
    description: "Visualise exactement où tu en es : leçons complétées, ce qui reste à faire, progression étape par étape.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 2L11 7h5l-4 3 1.5 5L9 12l-4.5 3L6 10 2 7h5L9 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
    title: "Contenu mis à jour régulièrement",
    description: "Les formations évoluent avec le marché. Accès toujours à jour sans frais supplémentaires.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="3" y="3" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="10" y="3" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="3" y="10" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="10" y="10" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    title: "Accès desktop et mobile",
    description: "Apprends quand et où tu veux : ton ordinateur ou ton téléphone. Structuré pour les deux.",
  },
];

const tradingLevels = [
  {
    href: "/formations/debutant/lecon1",
    label: "Débutant",
    badgeClass: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    description: "Les fondamentaux du trading pour partir sur de bonnes bases. Aucun prérequis.",
    count: `${FORMATIONS.find(f => f.id === "debutant")?.lessons.length ?? 0} leçons`,
    disabled: false,
  },
  {
    href: "/formations/intermediaire/lecon1",
    label: "Intermédiaire",
    badgeClass: "bg-blue-400/10 text-blue-400 border border-blue-400/20",
    description: "Structure de marché, zones institutionnelles et lecture avancée du prix.",
    count: `${FORMATIONS.find(f => f.id === "intermediaire")?.lessons.length ?? 0} leçons`,
    disabled: false,
  },
  {
    href: "/formations/avance/lecon1",
    label: "Avancé",
    badgeClass: "bg-amber-400/10 text-amber-400 border border-amber-400/20",
    description: "Liquidité institutionnelle, Smart Money et techniques de trading de précision.",
    count: `${FORMATIONS.find(f => f.id === "avance")?.lessons.length ?? 0} leçons`,
    disabled: false,
  },
];

const macroLevels = [
  {
    href: "/formations/macro/debutant",
    label: "Débutant",
    badgeClass: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    commencerClass: "text-emerald-400",
    description: "Les fondamentaux : qui contrôle le marché, pourquoi la macro compte en trading.",
    count: "6 leçons",
    disabled: false,
  },
  {
    href: "/formations/macro/intermediaire",
    label: "Intermédiaire",
    badgeClass: "bg-blue-400/10 text-blue-400 border border-blue-400/20",
    commencerClass: "text-blue-400",
    description: "Hawkish vs Dovish, prévision vs réel, corrélations entre marchés.",
    count: "6 leçons",
    disabled: false,
  },
  {
    href: "/formations/macro/avance",
    label: "Avancé",
    badgeClass: "bg-amber-400/10 text-amber-400 border border-amber-400/20",
    commencerClass: "text-amber-400",
    description: "FOMC, NFP, rendements obligataires US et régimes de marché — comprendre les news qui font bouger les marchés",
    count: "4 leçons",
    disabled: false,
  },
];

const communityBenefits = [
  {
    title: "Un parcours structuré, pas du contenu en vrac",
    description:
      "Les leçons s'enchaînent dans un ordre logique et progressif. Tu construis tes connaissances sur des bases solides, sans sauter d'étapes essentielles.",
  },
  {
    title: "Tu valides ce que tu as compris, leçon par leçon",
    description:
      "Chaque module se termine par un quiz. Tu sais exactement ce que tu maîtrises et ce sur quoi tu dois encore travailler.",
  },
  {
    title: "Des stratégies enseignées dans leur contexte",
    description:
      "Price Action, SMC, ICT — chaque méthode est expliquée avec ses fondements, ses conditions d'application et des exemples tirés de marchés réels.",
  },
  {
    title: "Un rythme qui s'adapte au tien",
    description:
      "Pas de deadline, pas de pression. Tu avances à ta vitesse et tu reviens sur une leçon autant de fois que nécessaire.",
  },
];

function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="shrink-0 text-emerald-400 mt-0.5">
      <path d="M2.5 7.5l3.5 3.5 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Home() {
  return (
    <main>

      {/* ── Hero ────────────────────────────────── */}
      <section className="relative overflow-hidden py-14 md:py-36 px-6">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-500/6 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-1.5 text-sm text-zinc-400 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Formations structurées · Du débutant à l'avancé
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
            Trader avec ton capital,
            <br />
            <span className="text-zinc-400">à ton rythme.</span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Apprends le trading avec une méthode structurée et des cas pratiques calibrés pour les retails. Du débutant à l'avancé, à ton rythme.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/formations"
              className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold px-8 py-4 rounded-xl transition-colors text-base"
            >
              Commencer gratuitement
            </Link>
            <Link
              href="/formations"
              className="border border-zinc-700 hover:border-zinc-500 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-base"
            >
              Voir les formations
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ───────────────────────────────── */}
      <section className="border-y border-zinc-800/60 bg-zinc-900/30 py-8 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-bold text-white mb-1">{s.value}</div>
              <div className="text-sm text-zinc-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Formations ──────────────────────────── */}
      <section className="py-14 md:py-24 px-6 border-t border-zinc-800/60">
        <div className="max-w-5xl mx-auto space-y-16">

          {/* Formation Trading */}
          <div>
            <div className="mb-6">
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-2">Formation Trading</p>
              <h2 className="text-2xl md:text-3xl font-bold mb-1">Apprends à lire les graphiques et construire des setups solides.</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {tradingLevels.map((level) => (
                <Link
                  key={level.label}
                  href={level.href}
                  className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-colors flex flex-col gap-3"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-white">{level.label}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${level.badgeClass}`}>
                      {level.count}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed flex-1">{level.description}</p>
                  <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1">
                    Commencer
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                      <path d="M4 9l4-3-4-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="border-t border-zinc-800" />

          {/* Macro Trading */}
          <div>
            <div className="mb-6">
              <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-2">Macro Trading</p>
              <h2 className="text-2xl md:text-3xl font-bold mb-1">Comprends pourquoi les marchés bougent et utilise-le pour mieux trader.</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {macroLevels.map((level) =>
                level.disabled ? (
                  <div
                    key={level.label}
                    className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-5 opacity-50 flex flex-col gap-3"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-white">{level.label}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${level.badgeClass}`}>
                        {level.count}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500 border border-zinc-700">
                        Bientôt
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed flex-1">{level.description}</p>
                  </div>
                ) : (
                  <Link
                    key={level.label}
                    href={level.href}
                    className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-colors flex flex-col gap-3"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-white">{level.label}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${level.badgeClass}`}>
                        {level.count}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed flex-1">{level.description}</p>
                    <span className={`text-xs font-semibold ${level.commencerClass} flex items-center gap-1`}>
                      Commencer
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                        <path d="M4 9l4-3-4-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </Link>
                )
              )}
            </div>
          </div>

        </div>
      </section>

      {/* ── Ce que tu construis ici ─────────────── */}
      <section className="py-14 md:py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="text-emerald-500 text-sm font-semibold uppercase tracking-widest mb-3">
              Ta progression
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 max-w-2xl">
              Une plateforme de progression trading
            </h2>
            <p className="text-zinc-400 max-w-xl leading-relaxed">
              Que tu démarres ou que tu cherches à affiner ton edge, TradingLab structure ta montée en compétence — fondamentaux, méthode, pratique, exécution.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {audiences.map((a) => (
              <div
                key={a.title}
                className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 mb-4">
                  {a.icon}
                </div>
                <h3 className="font-semibold text-white mb-2">{a.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{a.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Ce que tu trouveras ─────────────────── */}
      <section className="py-14 md:py-24 px-6 border-t border-zinc-800/60">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="text-emerald-500 text-sm font-semibold uppercase tracking-widest mb-3">
              Ce que tu trouveras
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 max-w-2xl">
              Un parcours complet, du premier graphique à la stratégie avancée
            </h2>
            <p className="text-zinc-400 max-w-xl leading-relaxed">
              Exemples et exercices calibrés pour 300€ à 2 500€. Leçons 15-25 min, structurées pour avancer à ton rythme sans être submergé.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {memberContent.map((c) => (
              <div
                key={c.title}
                className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 hover:border-zinc-700 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
                  {c.icon}
                </div>
                <h3 className="font-semibold text-white text-sm mb-1.5">{c.title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Approche pédagogique ────────────────── */}
      <section className="py-14 md:py-24 px-6 border-t border-zinc-800/60">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            {/* Left */}
            <div>
              <p className="text-emerald-500 text-sm font-semibold uppercase tracking-widest mb-3">
                Une approche pédagogique sérieuse
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-5 leading-tight">
                Apprendre avec méthode,
                pas au hasard
              </h2>
              <p className="text-zinc-400 leading-relaxed mb-8">
                Le trading s'apprend. Mais il s'apprend mieux avec une structure
                claire, des objectifs définis et des outils pour mesurer ta
                progression. TradingLab est construit autour de cette conviction.
              </p>
              <Link
                href="/formations"
                className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-colors"
              >
                Voir les formations
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

            {/* Right */}
            <div className="space-y-5">
              {communityBenefits.map((b) => (
                <div key={b.title} className="flex gap-4">
                  <CheckIcon />
                  <div>
                    <p className="font-semibold text-white text-sm mb-1">{b.title}</p>
                    <p className="text-sm text-zinc-500 leading-relaxed">{b.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA final ───────────────────────────── */}
      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto">
          <div className="border border-zinc-800 bg-zinc-900/40 rounded-2xl px-8 py-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Commence ton parcours dès maintenant
            </h2>
            <p className="text-zinc-400 mb-8 max-w-md mx-auto leading-relaxed">
              Les premières leçons sont accessibles gratuitement. Tu explores
              le contenu, tu testes la plateforme, et tu décides ensuite.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/formations"
                className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold px-7 py-3.5 rounded-xl transition-colors text-sm"
              >
                Commencer gratuitement
              </Link>
              <Link
                href="/pricing"
                className="border border-zinc-700 hover:border-zinc-500 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors text-sm"
              >
                Voir les offres
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
