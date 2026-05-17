"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { DollarHubDiagram } from "@/app/components/charts/DollarHubDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "C'est quoi la macro",              href: "/formations/macro/debutant/lecon1", disabled: false },
  { id: "lecon2", title: "Les 4 grandes banques centrales",  href: "/formations/macro/debutant/lecon2", disabled: false },
  { id: "lecon3", title: "Les chiffres macro à surveiller",  href: "/formations/macro/debutant/lecon3", disabled: false },
  { id: "lecon4", title: "Comprendre l'inflation",           href: "/formations/macro/debutant/lecon4", disabled: false },
  { id: "lecon5", title: "Le rôle du dollar dans le monde",  href: "/formations/macro/debutant/lecon5", disabled: false },
  { id: "lecon6", title: "Macro et risk management",         href: null,                                disabled: true  },
];

export default function MacroDebutantLecon5() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-debutant", "lecon5"));
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
          <span className="text-zinc-500">Leçon 5</span>
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
            Le rôle du dollar dans le monde — pourquoi tout passe par lui
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Tu trades XAU/USD, EUR/USD, BTC/USD ? Regarde leur point commun.
            </p>
            <p className="text-[15px] text-zinc-400 leading-relaxed mt-2">
              Tu ne trades pas l&apos;or, l&apos;euro ou le Bitcoin. Tu trades le dollar — qu&apos;il soit en haut ou en bas du symbole.
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

          {/* Bloc 1 — Pourquoi le dollar est unique */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Pourquoi le dollar est unique</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Le dollar n&apos;est pas une devise comme les autres. <span className="font-semibold text-zinc-200">Il est au centre du système financier mondial.</span>
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Quelques chiffres à connaître :
            </p>
            <ul className="space-y-2 mb-4">
              {[
                { bold: "environ 60% des réserves mondiales", rest: " des banques centrales sont en dollars" },
                { bold: "environ 88% des transactions forex", rest: " impliquent le dollar" },
                { bold: "l'or, le pétrole et la plupart des matières premières", rest: " sont cotés en USD" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Depuis Bretton Woods (1944), le monde financier s&apos;est construit autour du dollar. Cette position centrale ne s&apos;est jamais remise en question.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Le dollar n&apos;est pas juste une devise. C&apos;est la colonne vertébrale du marché.
              </p>
            </div>
          </section>

          {/* Bloc 2 — Le DXY + visuel */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Le DXY : la météo du dollar</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Le <span className="font-semibold text-zinc-200">DXY</span> (Dollar Index) mesure la force du dollar face à un panier de 6 devises majeures :
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                { label: "EUR", note: "(poids le plus important : ~57.6%)" },
                { label: "JPY", note: null },
                { label: "GBP", note: null },
                { label: "CAD", note: null },
                { label: "SEK", note: null },
                { label: "CHF", note: null },
              ].map((item) => (
                <li key={item.label} className="flex items-center gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
                  <span className="font-semibold text-zinc-200">{item.label}</span>
                  {item.note && <span className="text-zinc-500">{item.note}</span>}
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Donc :</p>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3 mb-4">
              <div className="space-y-1.5">
                <p className="text-sm font-semibold text-zinc-200">
                  <span className="text-zinc-400 font-normal">DXY monte</span> → dollar fort
                </p>
                <p className="text-sm font-semibold text-zinc-200">
                  <span className="text-zinc-400 font-normal">DXY baisse</span> → dollar faible
                </p>
              </div>
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              <span className="font-semibold text-zinc-200">Analogie simple</span> : le DXY, c&apos;est le <span className="font-semibold text-zinc-200">thermomètre du dollar</span>. Tu le regardes pour savoir si le marché chauffe ou refroidit.
            </p>

            {/* Composant visuel */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden">
              <DollarHubDiagram />
            </div>
          </section>

          {/* Bloc 3 — Quand le dollar monte, tout change */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Quand le dollar monte, tout change</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Un dollar fort modifie la lecture de <span className="font-semibold text-zinc-200">presque tous les marchés</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Quand le DXY monte :
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                { bold: "EUR/USD", rest: " baisse souvent" },
                { bold: "XAU/USD", rest: " (l'or) peut baisser" },
                { bold: "Crypto", rest: " baisse souvent" },
                { bold: "Matières premières", rest: " sous pression" },
                { bold: "Indices", rest: " parfois sous pression" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              <span className="font-semibold text-zinc-200">Pourquoi ?</span> Parce qu&apos;un dollar fort rend les actifs libellés en USD plus chers pour le reste du monde. Et parce que les investisseurs préfèrent le dollar refuge quand l&apos;incertitude monte.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Quand le dollar se renforce, le risque respire moins bien.
              </p>
            </div>
          </section>

          {/* Bloc 4 — Exemple récent : 2022 */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Exemple récent : 2022</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Le meilleur exemple récent : <span className="font-semibold text-zinc-200">2022</span>. Le dollar (DXY) a gagné <span className="font-semibold text-zinc-200">+20%</span> sur l&apos;année.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Conséquences en cascade :
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                { bold: "EUR/USD", rest: " : -21% (passe de 1.20 à 0.95)" },
                { bold: "Or", rest: " : sous pression toute l'année" },
                { bold: "Crypto", rest: " : -65%" },
                { bold: "Indices US", rest: " : Nasdaq -33%" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Tu retrouves le détail complet de la chaîne dans la <span className="font-semibold text-zinc-200">leçon précédente sur l&apos;inflation</span>. Mais retiens ceci : c&apos;est le <span className="font-semibold text-zinc-200">dollar fort qui a serré tout le système</span>.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Une seule devise a serré tout le système. C&apos;est ça la puissance du dollar.
              </p>
            </div>
          </section>

          {/* Bloc 5 — Le dollar et les pays fragiles */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Le dollar et les pays fragiles</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Beaucoup de pays et d&apos;entreprises <span className="font-semibold text-zinc-200">empruntent en dollars</span> (et pas dans leur monnaie locale).
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Quand le dollar monte :
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                { bold: "leur dette devient plus chère", rest: " à rembourser" },
                { bold: "leur monnaie locale se fragilise", rest: "" },
                { bold: "les tensions financières", rest: " augmentent" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              C&apos;est pour ça que les périodes de dollar fort peuvent mettre sous pression des pays comme l&apos;<span className="font-semibold text-zinc-200">Argentine</span>, la <span className="font-semibold text-zinc-200">Turquie</span> ou le <span className="font-semibold text-zinc-200">Sri Lanka</span>. Crises monétaires, défauts de paiement, chute des devises locales.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Un dollar fort ne fait pas que bouger les graphiques. Il serre le système entier.
              </p>
            </div>
          </section>

          {/* Bloc 6 — Comment l'utiliser dans ton trading */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Comment l&apos;utiliser dans ton trading</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Voici la routine du trader qui utilise vraiment le DXY :
            </p>
            <div className="space-y-3 mb-5">
              <div className="bg-zinc-800/30 rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-zinc-200 mb-1.5">Étape 1 — Avant ton analyse technique</p>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  Ouvre le graphique du DXY en H1 ou H4. Regarde la tendance des 3 derniers jours.
                </p>
              </div>
              <div className="bg-zinc-800/30 rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-zinc-200 mb-2">Étape 2 — Identifie le contexte</p>
                <ul className="space-y-1">
                  {[
                    { bold: "DXY haussier fort", rest: " → dollar fort → contexte risk-off" },
                    { bold: "DXY baissier", rest: " → dollar faible → contexte risk-on" },
                    { bold: "DXY en range", rest: " → contexte neutre, l'analyse technique classique prime" },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                      <div className="w-1 h-1 rounded-full bg-zinc-600 shrink-0 mt-2" />
                      <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-zinc-800/30 rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-zinc-200 mb-1.5">Étape 3 — Adapte tes setups</p>
                <p className="text-sm text-zinc-300 leading-relaxed mb-2">
                  Si tu veux acheter (long) sur EUR/USD, XAU/USD ou BTC/USD → vérifie que le DXY n&apos;est <span className="font-semibold text-zinc-200">PAS en train de monter fort</span>. Sinon ton setup va probablement échouer même si techniquement il est parfait.
                </p>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  <span className="font-semibold text-zinc-200">L&apos;inverse est aussi vrai</span> : si tu veux vendre (short) ces mêmes actifs, un DXY haussier <span className="font-semibold text-zinc-200">renforce</span> ton setup.
                </p>
              </div>
            </div>

            {/* Encadré 💰 Réalité du retail */}
            <div className="bg-zinc-800/50 border-l-4 border-amber-400 px-5 py-4 rounded mb-5">
              <div className="flex items-center gap-2 mb-2">
                <span>💰</span>
                <span className="text-sm font-bold text-amber-400 tracking-wide">Réalité du retail</span>
              </div>
              <p className="text-base text-zinc-300 leading-relaxed">
                Si tu trades EUR/USD, XAU/USD ou BTC/USD sans regarder le DXY, il te manque la moitié de l&apos;histoire. Les setups techniques échouent souvent parce que <span className="font-semibold text-zinc-200">le contexte dollar n&apos;est pas favorable</span> — pas parce que la stratégie est mauvaise.
              </p>
            </div>

            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Une mauvaise lecture du DXY = un mauvais trade, même avec une stratégie parfaite.
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
              "Le dollar est la devise centrale du système financier mondial",
              "Le DXY mesure la force du dollar en un seul graphique",
              "DXY haussier = pression fréquente sur EUR/USD, or, crypto, actifs risqués",
              "Regarder le DXY chaque matin donne le contexte macro de ta journée",
            ]}
          />

          <LessonExercice
            description="Avant ta prochaine session, ajoute le DXY à ta routine."
            steps={[
              "Ouvre le graphique du DXY (sur TradingView ou Investing.com).",
              "Note la tendance : haussière, baissière ou range sur les 3 derniers jours.",
              "Compare avec le graphique de EUR/USD sur la même période.",
              "Compare avec XAU/USD ou BTC/USD sur la même période.",
              "Note si les mouvements sont cohérents avec la force du dollar (DXY haut = autres bas, et inversement).",
            ]}
          />
          <p className="text-sm text-zinc-500 leading-relaxed px-1">
            L&apos;objectif : <span className="font-semibold text-zinc-400">apprendre à voir le marché à travers le dollar</span>.
          </p>

          <LessonQuiz
            question="Le DXY monte fortement depuis plusieurs jours. Quelle lecture est la plus logique ?"
            options={[
              "Le dollar est faible, donc EUR/USD devrait monter",
              "Le dollar est fort, donc EUR/USD est probablement sous pression",
              "Le DXY ne sert qu'à trader les actions US",
              "Le DXY n'a aucun impact sur l'or ou la crypto",
            ]}
            correctIndex={1}
            explanation="Quand le DXY monte, cela signifie que le dollar se renforce. EUR/USD est généralement sous pression car l'euro baisse face au dollar. L'option A confond DXY haut et dollar faible (c'est l'inverse). L'option C est fausse : le DXY donne un contexte global sur le dollar, pas seulement sur les actions US — il influence le forex, les matières premières, l'or et la crypto. L'option D est fausse aussi : l'or (XAU/USD) et la crypto (BTC/USD) sont libellés en dollars, donc directement impactés par sa force."
            answerExplanations={[
              "Faux. DXY qui monte signifie dollar fort — c'est l'inverse d'un dollar faible. Quand le dollar se renforce, EUR/USD baisse généralement, pas l'inverse.",
              "Correct. Un DXY en hausse signifie un dollar fort. EUR/USD est généralement sous pression dans ce contexte car l'euro se déprécie face au dollar.",
              "Faux. Le DXY donne un contexte global sur la force du dollar — il influence le forex, les matières premières, l'or et la crypto, pas seulement les actions US.",
              "Faux. L'or (XAU/USD) et la crypto (BTC/USD) sont tous les deux libellés en dollars, donc directement impactés par la force du dollar. Un DXY haussier met souvent l'or et la crypto sous pression.",
            ]}
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => { const p = getStoredProgress(); markLessonComplete(p, "macro-debutant", "lecon5"); setDone(true); }}
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
                  <p className="text-xs text-zinc-500 mt-0.5">La prochaine leçon (Macro et risk management) sera bientôt disponible.</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/formations/macro/debutant/lecon4"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Leçon 4 — Comprendre l&apos;inflation
              </Link>
              <span className="text-sm text-zinc-700 cursor-default">
                Macro et risk management — Bientôt disponible →
              </span>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
