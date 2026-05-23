"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { ConsensusVsRealDiagram } from "@/app/components/charts/ConsensusVsRealDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "C'est quoi la macro",              href: "/formations/macro/debutant/lecon1", disabled: false },
  { id: "lecon2", title: "Les 4 grandes banques centrales",  href: "/formations/macro/debutant/lecon2", disabled: false },
  { id: "lecon3", title: "Les chiffres macro à surveiller",  href: "/formations/macro/debutant/lecon3", disabled: false },
  { id: "lecon4", title: "Comprendre l'inflation",           href: null,                                disabled: true  },
  { id: "lecon5", title: "Le rôle du dollar dans le monde",  href: null,                                disabled: true  },
  { id: "lecon6", title: "Macro et risk management",         href: null,                                disabled: true  },
];

export default function ContentFr() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-debutant", "lecon3"));
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
          <span className="text-zinc-500">Leçon 3</span>
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
            Les chiffres macro à surveiller — quoi regarder et quand
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              14h30. Une bougie M5 fait 80 pips d&apos;un coup. Tu cherches le pattern.
            </p>
            <p className="text-[15px] text-zinc-400 leading-relaxed mt-2">
              Il n&apos;y en a pas. C&apos;est un chiffre que tu as ignoré qui vient de passer.
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
              const isCurrent = lesson.id === "lecon3";
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
            <span className="ml-auto text-xs text-zinc-600">3 / 6 leçons</span>
          </div>
        </header>

        {/* ── Contenu ── */}
        <div className="space-y-8">

          {/* Bloc 1 — Le principe que personne ne t'explique */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Le principe que personne ne t&apos;explique</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Les chiffres macro ne sortent pas au hasard. Ils sont publiés à des moments précis :
            </p>
            <ul className="space-y-1.5 mb-4">
              {["chaque mois", "chaque trimestre", "toujours aux mêmes heures"].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Mais voici le point clé que la plupart des débutants ratent :
            </p>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3 mb-4">
              <p className="text-sm text-zinc-200 font-semibold leading-relaxed">
                Le marché ne réagit pas au chiffre lui-même. Il réagit à la différence entre ce qui était prévu et ce qui sort réellement.
              </p>
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              <span className="font-semibold text-zinc-200">Analogie simple</span> : la météo annonce soleil. Il pleut. Ce n&apos;est pas la pluie qui te surprend. C&apos;est l&apos;écart avec ce que tu attendais.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Le marché ne réagit pas au chiffre. Il réagit à la surprise.
              </p>
            </div>
          </section>

          {/* Bloc 2 — Les 5 chiffres qui font vraiment bouger le marché */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Les 5 chiffres qui font vraiment bouger le marché</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Tu n&apos;as pas besoin d&apos;en connaître 30. Concentre-toi sur ces 5 :
            </p>
            <div className="space-y-3 mb-5">
              <div className="bg-zinc-800/30 rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-zinc-200 mb-1.5">NFP (Non-Farm Payrolls)</p>
                <ul className="space-y-1">
                  <li className="text-sm text-zinc-300">Créations d&apos;emplois US</li>
                  <li className="text-sm text-zinc-300">Publié le <span className="font-semibold text-zinc-200">1er vendredi du mois à 14h30</span> (heure de Paris)</li>
                  <li className="text-sm text-zinc-300">Souvent ultra violent</li>
                </ul>
              </div>
              <div className="bg-zinc-800/30 rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-zinc-200 mb-1.5">CPI (Consumer Price Index)</p>
                <ul className="space-y-1">
                  <li className="text-sm text-zinc-300">Inflation US</li>
                  <li className="text-sm text-zinc-300">Publié vers le <span className="font-semibold text-zinc-200">milieu du mois à 14h30</span></li>
                  <li className="text-sm text-zinc-300">Impact très fort sur le dollar</li>
                </ul>
              </div>
              <div className="bg-zinc-800/30 rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-zinc-200 mb-1.5">FOMC (décision de taux Fed)</p>
                <ul className="space-y-1">
                  <li className="text-sm text-zinc-300">Environ <span className="font-semibold text-zinc-200">8 fois par an à 20h00</span></li>
                  <li className="text-sm text-zinc-300">Impact énorme (cf leçon Macro Avancé sur le FOMC)</li>
                </ul>
              </div>
              <div className="bg-zinc-800/30 rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-zinc-200 mb-1.5">PMI (Purchasing Managers Index)</p>
                <ul className="space-y-1">
                  <li className="text-sm text-zinc-300">Santé économique (industrie / services)</li>
                  <li className="text-sm text-zinc-300">Publié chaque mois</li>
                </ul>
              </div>
              <div className="bg-zinc-800/30 rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-zinc-200 mb-1.5">GDP (PIB)</p>
                <ul className="space-y-1">
                  <li className="text-sm text-zinc-300">Croissance économique trimestrielle</li>
                  <li className="text-sm text-zinc-300">Impact moyen mais directionnel</li>
                </ul>
              </div>
            </div>

            {/* Encadré 💰 Réalité du retail */}
            <div className="bg-zinc-800/50 border-l-4 border-amber-400 px-5 py-4 rounded">
              <div className="flex items-center gap-2 mb-2">
                <span>💰</span>
                <span className="text-sm font-bold text-amber-400 tracking-wide">Réalité du retail</span>
              </div>
              <p className="text-base text-zinc-300 leading-relaxed">
                Tu n&apos;as pas besoin de suivre tout le calendrier. Maîtrise ces 5 chiffres et tu comprends déjà <span className="font-semibold text-zinc-200">80% des mouvements brutaux</span> du marché. Le reste, c&apos;est du bruit.
              </p>
            </div>
          </section>

          {/* Bloc 3 — Les chiffres secondaires */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Les chiffres secondaires (à connaître mais ne pas surévaluer)</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              D&apos;autres chiffres existent et bougent le marché, mais avec moins de violence :
            </p>
            <ul className="space-y-2 mb-4">
              {[
                { bold: "PPI", rest: " (inflation côté producteurs)" },
                { bold: "Retail Sales", rest: " (ventes au détail)" },
                { bold: "Unemployment Rate", rest: " (taux de chômage)" },
                { bold: "Consumer Confidence", rest: " (confiance des consommateurs)" },
                { bold: "ISM", rest: " (indice industriel)" },
              ].map((item) => (
                <li key={item.bold} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Ils peuvent créer des mouvements, mais rarement aussi violents que les 5 majeurs. Apprends-les <span className="font-semibold text-zinc-200">après</span> avoir maîtrisé les 5 premiers.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Tous les chiffres bougent le marché. Peu le contrôlent vraiment.
              </p>
            </div>
          </section>

          {/* Bloc 4 — Le système des étoiles */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Le système des étoiles : ce qui mérite ton attention</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Tu connais déjà le système d&apos;impact (vu en leçon 1) : <span className="font-semibold text-zinc-200">1 étoile</span> = faible, <span className="font-semibold text-zinc-200">2 étoiles</span> = moyen, <span className="font-semibold text-zinc-200">3 étoiles</span> = fort.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Mais voici la règle que personne n&apos;applique :
            </p>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3 mb-4">
              <p className="text-sm text-zinc-200 font-semibold leading-relaxed">
                Les chiffres 1 ou 2 étoiles, tu peux les ignorer en tant que débutant.
              </p>
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Pourquoi ? Parce qu&apos;ils ne casseront pas une tendance forte, ils n&apos;invalideront pas un setup propre, et leur impact se dilue dans la journée.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Les chiffres 3 étoiles, eux, peuvent :
            </p>
            <ul className="space-y-1.5 mb-5">
              {[
                "Effacer un setup parfait en 30 secondes",
                "Inverser la tendance de la journée",
                "Créer des mouvements violents : 100 à 300 pips forex, 30 à 60$ sur l'or, 1 à 2% sur les indices",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Si c&apos;est rouge, tu coupes ton trade ou tu attends.
              </p>
            </div>
          </section>

          {/* Bloc 5 — Exemple concret */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Exemple concret (ce qui se passe vraiment)</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Prenons un exemple chiffré.
            </p>
            <div className="bg-zinc-800/30 rounded-xl px-4 py-4 mb-4">
              <p className="text-sm font-semibold text-zinc-200 mb-2">Cas surprise positive :</p>
              <ul className="space-y-1 mb-3">
                <li className="text-sm text-zinc-300">NFP attendu : <span className="font-semibold text-zinc-200">200k</span></li>
                <li className="text-sm text-zinc-300">NFP réel : <span className="font-semibold text-zinc-200">350k</span></li>
              </ul>
              <p className="text-sm text-zinc-300 mb-2">
                Énorme surprise positive sur l&apos;économie US → le dollar monte fort → EUR/USD chute.
              </p>
              <p className="text-sm font-semibold text-zinc-200">
                Mouvement typique : -50 à -100 pips en 30 secondes.
              </p>
              <div className="mt-3 bg-zinc-900/60 rounded-lg px-3 py-2.5">
                <p className="text-xs font-semibold text-zinc-400 mb-2">Le même NFP touche aussi :</p>
                <ul className="space-y-1">
                  {[
                    { asset: "XAU/USD", move: "-25 à -40$ en 30 secondes" },
                    { asset: "Nasdaq", move: "-1 à -1.5% sur les premières minutes" },
                    { asset: "BTC/USD", move: "-300 à -800$ selon la volatilité" },
                  ].map((item) => (
                    <li key={item.asset} className="flex items-center justify-between text-xs text-zinc-400">
                      <span className="font-semibold text-zinc-300">{item.asset}</span>
                      <span>{item.move}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-zinc-500 mt-2 italic">Le NFP ne touche pas qu&apos;EUR/USD. Il touche tout le marché.</p>
              </div>
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Sur 0.10 lot d&apos;EUR/USD, ça fait <span className="font-semibold text-zinc-200">50 à 100$ de variation en 30 secondes</span>. Si tu étais long avec un SL de 30 pips, <span className="font-semibold text-zinc-200">tu te fais sortir AVANT même de comprendre ce qui s&apos;est passé.</span>
            </p>
            <div className="bg-zinc-800/30 rounded-xl px-4 py-4 mb-5">
              <p className="text-sm font-semibold text-zinc-200 mb-2">Cas surprise négative :</p>
              <ul className="space-y-1 mb-3">
                <li className="text-sm text-zinc-300">NFP attendu : <span className="font-semibold text-zinc-200">200k</span></li>
                <li className="text-sm text-zinc-300">NFP réel : <span className="font-semibold text-zinc-200">100k</span></li>
              </ul>
              <p className="text-sm text-zinc-300 mb-2">
                Économie US plus faible que prévu → le dollar chute → EUR/USD monte.
              </p>
              <p className="text-sm font-semibold text-zinc-200">
                Mouvement typique : +50 à +100 pips en 30 secondes.
              </p>
              <div className="mt-3 bg-zinc-900/60 rounded-lg px-3 py-2.5">
                <p className="text-xs font-semibold text-zinc-400 mb-2">Le même NFP touche aussi :</p>
                <ul className="space-y-1">
                  {[
                    { asset: "XAU/USD", move: "+25 à +40$ en 30 secondes" },
                    { asset: "Nasdaq", move: "+1 à +1.5% sur les premières minutes" },
                    { asset: "BTC/USD", move: "+300 à +800$ selon la volatilité" },
                  ].map((item) => (
                    <li key={item.asset} className="flex items-center justify-between text-xs text-zinc-400">
                      <span className="font-semibold text-zinc-300">{item.asset}</span>
                      <span>{item.move}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-zinc-500 mt-2 italic">Le mécanisme est strictement symétrique : un NFP qui déçoit fait monter ce que le NFP qui surprend fait baisser.</p>
              </div>
            </div>

            {/* Composant visuel */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden mb-5">
              <ConsensusVsRealDiagram />
            </div>

            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Plus l&apos;écart est grand entre prévision et réalité, plus le mouvement est violent.
              </p>
            </div>
          </section>

          {/* Bloc 6 — Comment utiliser ça concrètement */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Comment utiliser ça concrètement</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Tu n&apos;as pas besoin d&apos;être expert. Voici la routine simple :
            </p>
            <div className="space-y-3 mb-5">
              {[
                { n: "1", text: "Regarde uniquement les événements 3 étoiles (rouge)" },
                { n: "2", text: "Note les horaires dans ton agenda" },
                { n: "3", text: "Ne trade pas dans les 30 minutes avant" },
                { n: "4", text: "Observe la réaction au moment de la sortie" },
                { n: "5", text: "Si setup confirmé après réaction → tu peux entrer en suivant le mouvement" },
              ].map((item) => (
                <div key={item.n} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
                  <span className="text-xs font-bold text-zinc-500 shrink-0 mt-0.5">{item.n}.</span>
                  <p className="text-sm text-zinc-300 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3 mb-5">
              <p className="text-sm text-zinc-400 leading-relaxed">
                <span className="text-white font-medium">Méthode du trader expérimenté</span> : tu ne traderas <span className="font-semibold text-zinc-300">jamais</span> la news en direct. Tu attends 15-30 minutes après, le marché se calme, la nouvelle direction se dessine, et tu entres avec confluence technique.
              </p>
            </div>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Tu ne trades pas la news. Tu trades la réaction.
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
              "Le marché réagit à la surprise (réel vs prévision), pas au chiffre brut",
              "5 chiffres dominent : NFP, CPI, FOMC, PMI, GDP — concentre-toi dessus",
              "Les événements 3 étoiles sont les seuls qui méritent ton attention",
              "Plus l'écart entre prévision et réalité est grand, plus le mouvement est violent",
            ]}
          />

          <LessonExercice
            description="Cette semaine, entraîne-toi à lire les chiffres macro."
            steps={[
              "Ouvre un calendrier économique (Investing.com ou Forex Factory).",
              "Filtre par les événements 3 étoiles uniquement, pour cette semaine.",
              "Repère un NFP, un CPI ou un FOMC.",
              "Note l'heure exacte et la prévision (consensus) affichée.",
              "Le jour J, observe le graphique d'un actif concerné (EUR/USD, XAU/USD ou un indice US) 15 min avant, au moment et 30 min après la publication.",
            ]}
          />
          <p className="text-sm text-zinc-500 leading-relaxed px-1">
            L&apos;objectif : t&apos;habituer à <span className="font-semibold text-zinc-400">anticiper la volatilité</span> au lieu de la subir.
          </p>

          <LessonQuiz
            question="Un chiffre CPI est attendu à 3.0%. Il sort à 3.8%. Que se passe-t-il le plus souvent ?"
            options={[
              "Rien, c'est déjà prévu",
              "Le marché monte toujours",
              "Le marché réagit fortement car c'est une grosse surprise",
              "Le marché baisse toujours",
            ]}
            correctIndex={2}
            explanation="Le marché ne réagit pas au chiffre seul, mais à l'écart avec les attentes. Ici, l'inflation sort à 3.8% au lieu de 3.0% attendus → grosse surprise inflationniste → mouvement violent quasi garanti. Les options A, B et D sont fausses : le sens dépend toujours du contexte (la direction du mouvement, elle, dépend si une inflation plus haute est perçue comme positive ou négative selon la situation économique du moment). Ce principe s'applique à tous les actifs : forex, or, indices, crypto."
            answerExplanations={[
              "Faux. Ce n'est pas parce qu'un chiffre est attendu qu'il n'aura pas d'impact. 3.8% vs 3.0% attendus représente un écart important — le marché réagit toujours à une telle surprise.",
              "Faux. La direction du mouvement dépend du contexte économique. Une inflation plus haute peut être perçue positivement ou négativement selon la situation. Ce qui est certain : il y aura un mouvement fort.",
              "Correct. 3.8% vs 3.0% attendus = +0.8% d'écart sur l'inflation, c'est une grosse surprise. Le marché va réagir fortement. La direction exacte dépend du contexte, mais le mouvement violent est quasi garanti.",
              "Faux. La direction dépend du contexte économique, pas d'une règle fixe. Ce qui est certain, c'est qu'il y aura un mouvement fort — pas nécessairement à la baisse.",
            ]}
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => { const p = getStoredProgress(); markLessonComplete(p, "macro-debutant", "lecon3"); setDone(true); }}
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
                  <p className="text-xs text-zinc-500 mt-0.5">La prochaine leçon (Comprendre l&apos;inflation) sera bientôt disponible.</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/formations/macro/debutant/lecon2"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Leçon 2 — Les 4 grandes banques centrales
              </Link>
              <span className="text-sm text-zinc-700 cursor-default">
                Comprendre l&apos;inflation — Bientôt disponible →
              </span>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
