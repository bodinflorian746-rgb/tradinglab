"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { CorrelationMatrixDiagram } from "@/app/components/charts/CorrelationMatrixDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Hawkish vs Dovish",                      href: "/formations/macro/intermediaire/lecon1", disabled: false },
  { id: "lecon2", title: "Comprendre le calendrier économique",     href: "/formations/macro/intermediaire/lecon2", disabled: false },
  { id: "lecon3", title: "CPI, PPI et inflation",                   href: "/formations/macro/intermediaire/lecon3", disabled: false },
  { id: "lecon4", title: "Sessions de trading et liquidité",        href: "/formations/macro/intermediaire/lecon4", disabled: false },
  { id: "lecon5", title: "Les corrélations",                        href: "/formations/macro/intermediaire/lecon5", disabled: false },
  { id: "lecon6", title: "Construire son biais hebdomadaire",       href: null,                                     disabled: true  },
];

export default function ContentFr() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-intermediaire", "lecon5"));
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
          <Link href="/formations/macro/intermediaire" className="hover:text-zinc-400 transition-colors">Intermédiaire</Link>
          <span>/</span>
          <span className="text-zinc-500">Leçon 5</span>
        </nav>

        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-400/10 text-blue-400 border border-blue-400/20">
              Intermédiaire
            </span>
            <span className="text-zinc-700 text-xs">·</span>
            <span className="text-xs text-zinc-600">14 min</span>
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
            Les corrélations — comment les marchés bougent ensemble (et pourquoi tu te fais piéger)
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Ouvrir 3 trades différents ne veut pas dire prendre 3 risques différents.
            </p>
            <p className="text-[15px] text-zinc-400 leading-relaxed mt-2">
              Parfois, tu crois diversifier. En réalité, tu empiles le même pari.
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
              const isCurrent = lesson.id === "lecon5";
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
            <span className="ml-auto text-xs text-zinc-600">5 / 6 leçons</span>
          </div>
        </header>

        {/* ── Contenu ── */}
        <div className="space-y-8">

          {/* Bloc 1 — C'est quoi une corrélation */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">C&apos;est quoi une corrélation</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Une corrélation mesure la façon dont deux actifs bougent ensemble.
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                { bold: "+1", rest: " = ils bougent presque pareil" },
                { bold: "0", rest: " = pas de lien clair" },
                { bold: "-1", rest: " = ils bougent en sens inverse" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Exemples :
            </p>
            <ul className="space-y-1.5 mb-5">
              {[
                { bold: "EUR/USD et GBP/USD", rest: " montent souvent ensemble (corrélation positive forte)" },
                { bold: "XAU/USD et DXY", rest: " bougent souvent en sens inverse (corrélation négative forte)" },
                { bold: "BTC/USD et Nasdaq", rest: " sont souvent corrélés depuis 2022 (corrélation positive)" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>

            {/* Composant visuel */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden mb-5">
              <CorrelationMatrixDiagram />
            </div>

            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Deux graphiques différents peuvent cacher le même trade.
              </p>
            </div>
          </section>

          {/* Bloc 2 — Les corrélations majeures à connaître */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Les corrélations majeures à connaître</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Voici les relations les plus utiles à surveiller :
            </p>
            <ul className="space-y-2 mb-4">
              {[
                { bold: "EUR/USD vs GBP/USD", rest: " : corrélation positive forte, souvent autour de ", val: "+0.85" },
                { bold: "EUR/USD vs USD/CHF", rest: " : corrélation négative très forte, souvent autour de ", val: "-0.95" },
                { bold: "XAU/USD vs DXY", rest: " : corrélation négative forte, souvent autour de ", val: "-0.80" },
                { bold: "Nasdaq vs DXY", rest: " : corrélation négative modérée, souvent autour de ", val: "-0.60" },
                { bold: "BTC/USD vs Nasdaq", rest: " : corrélation positive forte depuis 2022, souvent autour de ", val: "+0.75" },
                { bold: "WTI vs USD/CAD", rest: " : corrélation négative forte, souvent autour de ", val: "-0.75" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>
                    <span className="font-semibold text-zinc-200">{item.bold}</span>
                    {item.rest}
                    <span className="font-semibold text-zinc-200">{item.val}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="space-y-1.5 mb-5">
              {[
                { pre: "Quand le DXY monte, ", bold: "XAU/USD", post: " est souvent sous pression." },
                { pre: "Quand le Nasdaq monte, ", bold: "BTC/USD", post: " peut suivre." },
                { pre: "Quand le DXY chute, ", bold: "XAU/USD", post: " peut respirer." },
              ].map((item, i) => (
                <p key={i} className="text-zinc-300 leading-relaxed text-sm">
                  {item.pre}<span className="font-semibold text-zinc-200">{item.bold}</span>{item.post}
                </p>
              ))}
            </div>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Connaître 6 corrélations majeures, c&apos;est savoir lire 6 marchés en regardant 1 seul graphique.
              </p>
            </div>
          </section>

          {/* Bloc 3 — Le piège de la fausse diversification */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Le piège de la fausse diversification</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Cas classique :
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-2">Tu ouvres :</p>
            <ul className="space-y-1.5 mb-4">
              {["long EUR/USD", "long GBP/USD", "short USD/CHF"].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Tu penses avoir 3 trades différents.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              En réalité, tu as surtout pris{" "}
              <span className="font-semibold text-zinc-200">3 positions anti-dollar</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Si le dollar explose après un FOMC hawkish, tu peux perdre sur les 3 en même temps.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Calcul concret</span> :
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                { bold: "2% de risque par trade", rest: " (gestion saine)" },
                { bold: "3 trades corrélés", rest: " (long EUR/USD + long GBP/USD + short USD/CHF)" },
                { bold: "FOMC hawkish surprise", rest: " → le dollar explose" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>Tu prends <span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Résultat :{" "}
              <span className="font-semibold text-zinc-200">-6% du compte sur une seule news</span>. Tu as bien géré ton risque par trade. Mais tu n&apos;as pas vu que tes 3 trades étaient{" "}
              <span className="font-semibold text-zinc-200">le même trade</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Sur 500€, c&apos;est{" "}
              <span className="font-semibold text-zinc-200">-30€ en une heure</span>. Sur 2000€, c&apos;est{" "}
              <span className="font-semibold text-zinc-200">-120€</span>. Et le pire : tu vas penser que c&apos;est &apos;pas de chance&apos;. Alors que c&apos;est juste un risque mal calculé.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Même logique avec</span> :
            </p>
            <ul className="space-y-1.5 mb-4">
              {["long XAU/USD", "long BTC/USD", "long Nasdaq"].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Tu crois diversifier entre or, crypto et indices. Mais si le marché passe en risk-off et que le DXY monte,{" "}
              <span className="font-semibold text-zinc-200">XAU/USD peut chuter, BTC/USD peut chuter, et le Nasdaq peut chuter aussi</span>.
            </p>

            {/* Encadré 💰 Réalité du retail */}
            <div className="bg-zinc-800/50 border-l-4 border-amber-400 px-5 py-4 rounded">
              <div className="flex items-center gap-2 mb-2">
                <span>💰</span>
                <span className="text-sm font-bold text-amber-400 tracking-wide">Réalité du retail</span>
              </div>
              <p className="text-base text-zinc-300 leading-relaxed">
                Le retail croit diversifier parce que les noms changent. Les pros regardent le risque caché derrière.
              </p>
            </div>
          </section>

          {/* Bloc 4 — Utiliser les corrélations comme confirmation */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Utiliser les corrélations comme confirmation</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Les corrélations ne servent pas seulement à éviter le sur-risque. Elles servent aussi à{" "}
              <span className="font-semibold text-zinc-200">confirmer un trade</span>.
            </p>
            <div className="space-y-4 mb-5">
              <div>
                <p className="text-sm font-semibold text-zinc-200 mb-2">Si tu veux shorter EUR/USD :</p>
                <ul className="space-y-1.5">
                  {[
                    "DXY doit idéalement monter",
                    "GBP/USD doit aussi être faible",
                    "USD/CHF doit confirmer la force du dollar",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-200 mb-2">Si tu veux acheter XAU/USD :</p>
                <ul className="space-y-1.5">
                  {[
                    "DXY doit idéalement baisser",
                    "les taux US doivent être sous pression",
                    "XAU/USD doit tenir une structure haussière",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-200 mb-2">Si tu veux acheter BTC/USD :</p>
                <ul className="space-y-1.5">
                  {[
                    "Nasdaq doit idéalement être fort",
                    "le DXY ne doit pas exploser à la hausse",
                    "le contexte risk-on doit soutenir les actifs risqués",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Un bon trade est rarement seul. Les marchés autour doivent confirmer.
              </p>
            </div>
          </section>

          {/* Bloc 5 — Quand les corrélations cassent */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Quand les corrélations cassent</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Une corrélation n&apos;est pas une loi fixe. Elle peut casser.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Et quand elle casse, c&apos;est souvent un{" "}
              <span className="font-semibold text-zinc-200">signal important</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Exemples</span> :
            </p>
            <ul className="space-y-2 mb-4">
              {[
                { bold: "BTC/USD monte alors que le Nasdaq baisse", rest: " → possible achat spécifique sur crypto ou flux institutionnel" },
                { bold: "XAU/USD monte alors que le DXY monte", rest: " → possible stress géopolitique ou recherche de refuge extrême" },
                { bold: "EUR/USD baisse mais GBP/USD tient", rest: " → possible news spécifique à l'euro ou à la livre" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Une cassure de corrélation ne veut pas dire &apos;erreur du marché&apos;. Elle veut dire :{" "}
              <span className="font-semibold text-zinc-200">quelque chose de spécifique est en train de se passer</span>.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Quand une corrélation casse, le marché te montre où regarder.
              </p>
            </div>
          </section>

          {/* Bloc 6 — La règle pro de gestion du risque */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">La règle pro de gestion du risque</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              <span className="font-semibold text-zinc-200">Règle simple</span> : jamais trop de trades fortement corrélés ouverts en même temps.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Si tu prends deux positions qui vont dans le même sens macro :
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                { bold: "tu réduis la taille", rest: "" },
                { bold: "tu assumes que le risque est cumulé", rest: "" },
                { bold: "tu évites de croire que c'est de la diversification", rest: "" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Exemple</span> :
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Tu veux acheter XAU/USD et BTC/USD.
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                { pre: "Si le DXY monte fort, ", bold: "les deux peuvent souffrir", post: "." },
                { pre: "Si le Nasdaq chute, ", bold: "BTC/USD peut être entraîné", post: "." },
                { pre: "Si le marché passe risk-off, ", bold: "XAU/USD peut résister parfois, mais BTC/USD et Nasdaq sont souvent vulnérables", post: "." },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>{item.pre}<span className="font-semibold text-zinc-200">{item.bold}</span>{item.post}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Donc tu ne comptes pas ça comme deux risques séparés.{" "}
              <span className="font-semibold text-zinc-200">Tu comptes ça comme un bloc de risque.</span>
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                La diversification commence quand les risques ne tombent pas ensemble.
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
              "Une corrélation montre si deux actifs bougent ensemble ou en sens inverse",
              "XAU/USD, BTC/USD, Nasdaq et DXY doivent être surveillés ensemble",
              "Plusieurs trades peuvent cacher le même risque macro",
              "Une cassure de corrélation est souvent un signal avancé",
            ]}
          />

          <LessonExercice
            description="Avant d'ouvrir plusieurs trades, vérifie si tu prends vraiment plusieurs risques."
            steps={[
              "Choisis 3 actifs que tu trades souvent : par exemple XAU/USD, BTC/USD et Nasdaq.",
              "Compare leur direction avec le DXY sur les dernières sessions.",
              "Vérifie si tes setups vont tous dans le même sens macro.",
              "Si deux actifs sont fortement corrélés, divise la taille ou choisis le meilleur setup.",
              "Note si une corrélation casse : c'est souvent le signal le plus intéressant.",
            ]}
          />
          <p className="text-sm text-zinc-500 leading-relaxed px-1">
            L&apos;objectif :{" "}
            <span className="font-semibold text-zinc-400">arrêter d&apos;empiler le même risque sans t&apos;en rendre compte</span>.
          </p>

          <LessonQuiz
            question="Tu ouvres long XAU/USD, long BTC/USD et long Nasdaq le même jour. Le DXY commence à monter fortement. Quel est le vrai danger ?"
            options={[
              "Aucun, ce sont trois marchés différents",
              "Tu es probablement exposé plusieurs fois au même risque macro",
              "Le DXY ne concerne que les paires forex",
              "Le BTC/USD n'a jamais de lien avec le Nasdaq",
            ]}
            correctIndex={1}
            explanation="XAU/USD, BTC/USD et Nasdaq peuvent tous souffrir dans un contexte de dollar fort ou de risk-off. Même si les actifs sont différents, le risque peut être le même. L'option A ignore les corrélations (lecture débutant). L'option C est fausse car le DXY influence aussi l'or, la crypto et les indices US. L'option D est fausse depuis que BTC/USD se comporte souvent comme un actif risqué corrélé au Nasdaq (depuis 2022)."
            answerExplanations={[
              "Faux. XAU/USD, BTC/USD et Nasdaq partagent une exposition au dollar fort et au risk-off. Même si les noms sont différents, ils peuvent tous baisser en même temps.",
              "Correct. XAU/USD, BTC/USD et Nasdaq peuvent tous souffrir dans un contexte de dollar fort ou de risk-off. Le risque peut être le même, même si les actifs sont différents.",
              "Faux. Le DXY influence aussi l'or (XAU/USD), la crypto (BTC/USD) et les indices US (Nasdaq). Ce n'est pas réservé aux paires forex.",
              "Faux. Depuis 2022, BTC/USD se comporte souvent comme un actif risqué corrélé au Nasdaq. Les deux ont tendance à monter ou baisser ensemble.",
            ]}
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => { const p = getStoredProgress(); markLessonComplete(p, "macro-intermediaire", "lecon5"); setDone(true); }}
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
                  <p className="text-xs text-zinc-500 mt-0.5">La prochaine leçon (Construire son biais hebdomadaire) sera bientôt disponible.</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/formations/macro/intermediaire/lecon4"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Leçon 4 — Sessions de trading et liquidité
              </Link>
              <span className="text-sm text-zinc-700 cursor-default">
                Construire son biais hebdomadaire — Bientôt disponible →
              </span>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
