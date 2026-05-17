"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { MacroCalendarDiagram } from "@/app/components/charts/MacroCalendarDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "C'est quoi la macro",              href: "/formations/macro/debutant/lecon1", disabled: false },
  { id: "lecon2", title: "Les 4 grandes banques centrales",  href: null,                                disabled: true  },
  { id: "lecon3", title: "Les chiffres macro à surveiller",  href: null,                                disabled: true  },
  { id: "lecon4", title: "Comprendre l'inflation",           href: null,                                disabled: true  },
  { id: "lecon5", title: "Le rôle du dollar dans le monde",  href: null,                                disabled: true  },
  { id: "lecon6", title: "Macro et risk management",         href: null,                                disabled: true  },
];

export default function MacroDebutantLecon1() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-debutant", "lecon1"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/formations" className="hover:text-zinc-400 transition-colors">Formations</Link>
          <span>/</span>
          <Link href="/formations/macro" className="hover:text-zinc-400 transition-colors">Macro Trading</Link>
          <span>/</span>
          <Link href="/formations/macro/debutant" className="hover:text-zinc-400 transition-colors">Débutant</Link>
          <span>/</span>
          <span className="text-zinc-500">Leçon 1</span>
        </nav>

        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Débutant
            </span>
            <span className="text-zinc-700 text-xs">·</span>
            <span className="text-xs text-zinc-600">12 min</span>
            {done && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                  <path d="M1 4.5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Terminée
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold leading-tight mb-4">
            C&apos;est quoi la macro et pourquoi ça compte en trading
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Un événement macro peut effacer 2% de ton capital en 2 minutes.
            </p>
            <p className="text-[15px] text-zinc-400 leading-relaxed mt-2">
              Sur EUR/USD, sur l&apos;or, sur le Nasdaq, sur le Bitcoin — peu importe ce que tu trades, la macro te tombe dessus.
            </p>
          </div>

          {/* Indicateur de structure */}
          <div className="mt-5 flex items-center gap-2 text-xs text-zinc-600">
            {["Lecture", "À retenir", "Exercice", "Quiz"].map((step, i, arr) => (
              <span key={step} className="flex items-center gap-2">
                <span>{step}</span>
                {i < arr.length - 1 && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-zinc-800 shrink-0">
                    <path d="M3 2l4 3-4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
            ))}
          </div>

          {/* Pills des leçons */}
          <div className="mt-6 flex items-center gap-2 flex-wrap">
            {LESSONS.map((lesson) => {
              const isCurrent = lesson.id === "lecon1";
              const pill = (
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                  isCurrent
                    ? "bg-zinc-800 border-zinc-600 text-white"
                    : "border-zinc-800 text-zinc-500"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? "bg-white" : "bg-zinc-600"}`} />
                  {lesson.title}
                </span>
              );
              return <div key={lesson.id}>{pill}</div>;
            })}
            <span className="ml-auto text-xs text-zinc-600">1 / 6 leçons</span>
          </div>
        </header>

        {/* ── Contenu ── */}
        <div className="space-y-8">

          {/* Bloc 1 — La macro, c'est quoi exactement ? */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">La macro, c&apos;est quoi exactement ?</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              La <span className="font-semibold text-zinc-200">macro</span> (raccourci pour macroéconomie), c&apos;est l&apos;étude des <span className="font-semibold text-zinc-200">grandes forces</span> qui font bouger l&apos;économie mondiale : taux d&apos;intérêt, inflation, emploi, croissance, décisions des banques centrales.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              En trading, ces forces ont un impact direct sur <span className="font-semibold text-zinc-200">tous les marchés</span> : forex, indices, crypto, matières premières, obligations.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Une analogie simple : <span className="font-semibold text-zinc-200">la technique te dit OÙ entrer. La macro te dit POURQUOI le marché bouge.</span>
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded mb-4">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Si tu ignores la macro, tu subis le marché. Si tu la comprends, tu l&apos;anticipes.
              </p>
            </div>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
              <p className="text-sm text-zinc-400 leading-relaxed">
                <span className="text-white font-medium">À retenir :</span> Tu peux ignorer la macro et trader uniquement la technique. Mais tu seras régulièrement balayé par des mouvements que tu ne comprends pas. Comprendre la macro, c&apos;est arrêter d&apos;être surpris.
              </p>
            </div>
          </section>

          {/* Bloc 2 — Pourquoi un trader doit s'y intéresser */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Pourquoi un trader doit s&apos;y intéresser</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Imagine ce scénario.</p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Tu repères un setup parfait sur EUR/USD à 14h25. Toutes les bougies sont alignées, ton plan de trade est béton, tu entres long. À 14h30, EUR/USD chute de 80 pips en 2 minutes. Ton stop saute. Tu ne comprends pas.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-2">
              Et ce n&apos;est pas que sur l&apos;EUR/USD. Sur la même news macro, tu aurais probablement vu :
            </p>
            <ul className="space-y-1.5 mb-3">
              {[
                { asset: "XAU/USD", move: "-25 à -40$ en 2 minutes" },
                { asset: "Nasdaq", move: "-1 à -1.5% sur les premières minutes" },
                { asset: "BTC/USD", move: "-300 à -800$ selon la volatilité du moment" },
              ].map((item) => (
                <li key={item.asset} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.asset}</span> : {item.move}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              La macro ne touche pas qu&apos;une paire. Elle touche tout le marché en même temps.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Ce qui s&apos;est passé</span> : à 14h30 (heure de Paris), les chiffres mensuels de l&apos;inflation US ont été publiés. Plus élevés que prévu. Le marché a anticipé que la Fed allait être plus dure. Le dollar a explosé à la hausse. Ton EUR/USD long, qui pariait sur un dollar faible, a été balayé.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              <span className="font-semibold text-zinc-200">La technique seule ne pouvait pas te prévenir.</span> Seule la macro (le calendrier économique + la compréhension des chiffres) pouvait te faire <span className="font-semibold text-zinc-200">éviter</span> ce trade.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded mb-4">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Le marché ne récompense pas le meilleur graphique. Il récompense celui qui sait pourquoi il bouge.
              </p>
            </div>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
              <p className="text-sm text-zinc-400 leading-relaxed">
                <span className="text-white font-medium">À retenir :</span> La macro ne remplace pas la technique. Elle la <span className="font-semibold text-zinc-300">complète</span>. Elle te dit quand ne PAS trader, et quand un mouvement est probablement amené à durer.
              </p>
            </div>
          </section>

          {/* Bloc 3 — Les 4 forces macro */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Les 4 forces macro qui bougent les marchés</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Tu n&apos;as pas besoin de devenir économiste. Mais 4 forces font bouger 90% des marchés.
            </p>
            <div className="space-y-3 mb-6">
              {[
                {
                  n: "1",
                  label: "Taux d'intérêt",
                  text: "fixés par les banques centrales. Taux qui montent → devise qui se renforce. Taux qui baissent → devise qui s'affaiblit.",
                },
                {
                  n: "2",
                  label: "Inflation",
                  text: "la hausse des prix. Inflation forte → la banque centrale est forcée de monter les taux pour l'arrêter.",
                },
                {
                  n: "3",
                  label: "Emploi",
                  text: "un chiffre comme le NFP (publié chaque 1er vendredi du mois) peut faire bouger violemment tous les actifs en même temps.",
                },
                {
                  n: "4",
                  label: "Croissance économique",
                  text: "mesurée par le PIB. Économie forte → devise attractive pour les investisseurs étrangers.",
                },
              ].map((item) => (
                <div key={item.n} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
                  <span className="text-xs font-bold text-zinc-500 shrink-0 mt-0.5">{item.n}.</span>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    <span className="font-semibold text-zinc-200">{item.label}</span> — {item.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-zinc-800/30 rounded-xl px-4 py-3 mb-4">
              <p className="text-sm text-zinc-300 leading-relaxed mb-2">
                Un NFP qui surprend peut faire bouger :
              </p>
              <ul className="space-y-1.5">
                {[
                  { asset: "EUR/USD", move: "de 100 à 200 pips" },
                  { asset: "XAU/USD", move: "de 30 à 60$" },
                  { asset: "Nasdaq", move: "de 1 à 2%" },
                  { asset: "BTC/USD", move: "de 500 à 1500$" },
                ].map((item) => (
                  <li key={item.asset} className="flex items-start gap-2.5 text-sm text-zinc-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                    <span><span className="font-semibold text-zinc-200">{item.asset}</span> {item.move}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-zinc-400 mt-2 italic">Tout ça en quelques minutes.</p>
            </div>

            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Exemple concret de l&apos;enchaînement</p>
            <div className="bg-zinc-800/50 border border-zinc-700/40 rounded-xl px-4 py-4 mb-3">
              <div className="space-y-1.5">
                {[
                  "L'inflation US monte à 4% (au lieu des 3% attendus).",
                  "→ La Fed annonce qu'elle va monter ses taux plus vite.",
                  "→ Le dollar grimpe contre toutes les devises.",
                  "→ EUR/USD perd 150 pips en une journée.",
                ].map((item, i) => (
                  <p key={i} className={`text-sm leading-relaxed ${item.startsWith("→") ? "text-emerald-400 font-medium" : "text-zinc-300"}`}>
                    {item}
                  </p>
                ))}
              </div>
            </div>
            <p className="text-sm text-zinc-400 italic leading-relaxed mb-4">
              <span className="font-semibold text-zinc-300">Une cause macro, une réaction en chaîne, un mouvement violent.</span>
            </p>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
              <p className="text-sm text-zinc-400 leading-relaxed">
                <span className="text-white font-medium">À retenir :</span> Ces 4 forces sont liées. L&apos;inflation force les taux. Les taux bougent les devises. Les devises bougent les marchés. <span className="font-semibold text-zinc-300">Suivre la chaîne = anticiper le mouvement.</span>
              </p>
            </div>
          </section>

          {/* Bloc 4 — Qui décide quoi ? */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Qui décide quoi ?</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              <span className="font-semibold text-zinc-200">Les acteurs principaux</span> que tu vas croiser dans la macro :
            </p>
            <ul className="space-y-3 mb-5">
              {[
                {
                  label: "Les banques centrales",
                  text: "(Fed pour les USA, BCE pour l'Europe, BoE pour le Royaume-Uni, BoJ pour le Japon). Ce sont elles qui fixent les taux d'intérêt et orientent la politique monétaire.",
                },
                {
                  label: "Les gouvernements",
                  text: "— ils prennent les décisions de politique fiscale (impôts, dépenses publiques, dette).",
                },
                {
                  label: "Les agences statistiques",
                  text: "— elles publient les chiffres officiels de l'inflation, de l'emploi, du PIB. Ce sont leurs publications qui déclenchent les mouvements brutaux sur les marchés.",
                },
                {
                  label: "Les investisseurs institutionnels",
                  text: "— banques, fonds d'investissement, gestionnaires d'actifs. Ils représentent la majorité du volume sur les marchés. Quand ils achètent ou vendent en masse sur la base d'une nouvelle macro, le prix bouge violemment.",
                },
              ].map((item) => (
                <li key={item.label} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.label}</span> {item.text}</span>
                </li>
              ))}
            </ul>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded mb-4">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Le retail ne fait pas le marché. Le retail le subit ou le suit.
              </p>
            </div>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
              <p className="text-sm text-zinc-400 leading-relaxed">
                <span className="text-white font-medium">À retenir :</span> Le retail (les traders particuliers comme toi) représente une fraction minuscule du volume. <span className="font-semibold text-zinc-300">Le marché bouge sur les décisions des banques centrales et les flux des institutionnels.</span> Comprendre la macro = comprendre ce qu&apos;ils regardent.
              </p>
            </div>
          </section>

          {/* Bloc 5 — Le calendrier économique */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Le calendrier économique : ton outil n°1</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Le <span className="font-semibold text-zinc-200">calendrier économique</span> est un outil gratuit qui liste toutes les publications macro à venir, classées par importance.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Sur les sites comme <span className="font-semibold text-zinc-200">Investing.com</span> ou <span className="font-semibold text-zinc-200">Forex Factory</span>, chaque événement est noté avec une icône d&apos;impact :
            </p>
            <ul className="space-y-2 mb-5">
              {[
                { label: "Impact faible", desc: "(1 étoile / vert) — peu de mouvement attendu", color: "bg-emerald-400/60" },
                { label: "Impact moyen", desc: "(2 étoiles / jaune ou orange) — mouvement modéré possible", color: "bg-amber-400/60" },
                { label: "Impact fort", desc: "(3 étoiles / rouge) — mouvement violent quasi garanti", color: "bg-red-500/60" },
              ].map((item) => (
                <li key={item.label} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className={`w-1.5 h-1.5 rounded-full ${item.color} shrink-0 mt-1.5`} />
                  <span><span className="font-semibold text-zinc-200">{item.label}</span> {item.desc}</span>
                </li>
              ))}
            </ul>

            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Les événements à 3 étoiles à connaître absolument</p>
            <ul className="space-y-1.5 mb-5">
              {[
                "Décisions de taux de la Fed (FOMC)",
                "Décisions de taux de la BCE",
                "NFP (Non-Farm Payrolls US)",
                "CPI (inflation US)",
                "Discours de Jerome Powell ou Christine Lagarde",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500/60 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="border border-zinc-800 rounded-xl overflow-hidden mb-5">
              <MacroCalendarDiagram />
            </div>

            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded mb-4">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Le calendrier économique, c&apos;est la différence entre trader et parier.
              </p>
            </div>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
              <p className="text-sm text-zinc-400 leading-relaxed">
                <span className="text-white font-medium">À retenir :</span> Avant chaque journée de trading, regarde le calendrier économique. Les événements à 3 étoiles peuvent transformer un setup parfait en piège mortel. Mieux vaut <span className="font-semibold text-zinc-300">ne pas trader</span> dans les 30 minutes avant et après une publication majeure.
              </p>
            </div>
          </section>

          {/* Bloc 6 — Comment commencer concrètement */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Comment commencer concrètement</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Tu n&apos;as pas besoin de tout savoir. Voici la <span className="font-semibold text-zinc-200">routine simple</span> d&apos;un trader qui intègre la macro à son workflow.
            </p>

            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Chaque matin (5 minutes)</p>
            <div className="space-y-2 mb-5">
              {[
                "Ouvre Investing.com ou Forex Factory.",
                "Regarde le calendrier de la journée.",
                "Identifie les événements à 3 étoiles → marque les heures.",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
                  <span className="text-xs font-bold text-zinc-500 shrink-0 mt-0.5">{i + 1}.</span>
                  <p className="text-sm text-zinc-300 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>

            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Pendant ta session de trading</p>
            <ul className="space-y-2 mb-5">
              {[
                "Évite d'entrer en position dans les 30 minutes avant un événement à 3 étoiles.",
                "Si tu as déjà une position ouverte, vérifie ton stop loss avant la publication.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  {item}
                </li>
              ))}
            </ul>

            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Une fois par mois (15 minutes)</p>
            <ul className="space-y-2 mb-5">
              {[
                "Lis un résumé des décisions de la Fed et de la BCE (Reuters, Bloomberg, ou un site français comme Boursorama).",
                "Note l'évolution des taux d'intérêt principaux.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3 mb-4">
              <p className="text-sm text-zinc-400 leading-relaxed">
                <span className="text-white font-medium">À retenir :</span> <span className="font-semibold text-zinc-300">C&apos;est tout.</span> Avec ces 2 habitudes, tu es déjà au-dessus de 80% des traders particuliers qui tradent dans le brouillard.
              </p>
            </div>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                5 minutes par jour pour arrêter d&apos;être balayé. Le meilleur ratio temps/résultat de toute ta carrière de trader.
              </p>
            </div>
          </section>

          {/* ── Séparateur révision ── */}
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Révision</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          <LessonKeyPoints
            points={[
              "La macro, c'est l'étude des grandes forces économiques (taux, inflation, emploi, croissance) qui font bouger les marchés.",
              "La technique te dit OÙ entrer, la macro te dit POURQUOI le marché bouge — les deux sont complémentaires.",
              "Les 4 forces clés : taux d'intérêt, inflation, emploi, croissance économique.",
              "Le calendrier économique est ton outil n°1 — évite de trader dans les 30 min avant/après un événement à 3 étoiles.",
            ]}
          />

          <LessonExercice
            description="Cette semaine, intègre la macro à ta routine de trading."
            steps={[
              "Va sur Investing.com ou Forex Factory et trouve le calendrier économique.",
              "Filtre par les événements à 3 étoiles uniquement, pour cette semaine.",
              "Note dans un carnet (ou une note sur ton téléphone) la date et l'heure de chaque événement.",
              "Identifie au moins 2 événements qui concernent une devise que tu trades (USD, EUR, GBP, JPY).",
              "Pendant la semaine, observe le graphique de la paire concernée 15 minutes avant la publication, au moment de la publication, et 30 minutes après.",
              "Note ce que tu observes : amplitude du mouvement (en pips), direction, durée.",
            ]}
          />
          <p className="text-sm text-zinc-500 leading-relaxed px-1">
            L&apos;objectif : t&apos;habituer à lier les <span className="font-semibold text-zinc-400">mouvements brutaux du marché</span> à leurs <span className="font-semibold text-zinc-400">causes macro</span>. Au bout de 2-3 semaines, tu commenceras à anticiper.
          </p>

          <LessonQuiz
            question="Tu repères un setup parfait sur EUR/USD à 14h25. Tu vérifies le calendrier : il y a une publication CPI US à 14h30 (impact 3 étoiles). Que fais-tu ?"
            options={[
              "J'entre quand même, mon analyse technique est solide",
              "J'attends 30 minutes après la publication pour voir comment le marché réagit, puis je réévalue mon setup",
              "Je shorte EUR/USD car le CPI fait toujours baisser l'euro",
              "Je passe en H4 pour ignorer le bruit de la news",
            ]}
            correctIndex={1}
            explanation="Une publication à 3 étoiles peut faire bouger EUR/USD de 80-150 pips en quelques minutes, dans une direction imprévisible. Entrer juste avant (option A) revient à parier à pile ou face. L'option C est fausse : le CPI peut faire monter ou baisser l'euro selon que les chiffres surprennent à la hausse ou à la baisse. L'option D est une fuite — changer de timeframe ne te protège pas du mouvement violent. La bonne pratique : attends que la news passe, observe la réaction du marché, et trade ensuite avec la nouvelle information. Ce principe s'applique à tous les actifs : forex, or, indices, crypto."
            answerExplanations={[
              "Faux. Entrer juste avant une publication à 3 étoiles revient à parier à pile ou face. EUR/USD peut bouger de 80-150 pips en quelques minutes dans une direction imprévisible. Ton analyse technique ne compte plus — la macro écrase tout.",
              "Correct. La bonne pratique : attends que la news passe, observe la réaction du marché, et trade ensuite avec la nouvelle information. Tu gardes ton setup ET tu sais dans quelle direction le marché a décidé d'aller.",
              "Faux. Le CPI peut faire monter ou baisser l'euro selon que les chiffres surprennent à la hausse ou à la baisse. Il n'y a pas de direction systématique — c'est l'écart par rapport aux attentes qui compte.",
              "Faux. Changer de timeframe ne te protège pas du mouvement violent. Un mouvement de 80-150 pips sur M5 est un mouvement de 80-150 pips sur H4 aussi. La timeframe ne change pas l'amplitude réelle.",
            ]}
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => { const p = getStoredProgress(); markLessonComplete(p, "macro-debutant", "lecon1"); setDone(true); }}
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] text-zinc-950 font-semibold py-3.5 rounded-xl transition-all duration-150 shadow-lg shadow-emerald-500/10"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8l3.5 3.5 6.5-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Marquer la leçon comme terminée
              </button>
            ) : (
              <div className="flex items-center gap-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-5 py-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-emerald-400">
                    <path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-emerald-400">Leçon terminée</p>
                  <p className="text-xs text-zinc-500 mt-0.5">La prochaine leçon (Les 4 grandes banques centrales) sera bientôt disponible.</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/formations/macro/debutant"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Retour au module
              </Link>
              <span className="text-sm text-zinc-700 cursor-default">
                Les 4 grandes banques centrales — Bientôt disponible →
              </span>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
