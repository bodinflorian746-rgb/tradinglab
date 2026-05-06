"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { TradingSessionsLiquidityDiagram } from "@/app/components/charts/TradingSessionsLiquidityDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Hawkish vs Dovish",                      href: "/formations/macro/intermediaire/lecon1", disabled: false },
  { id: "lecon2", title: "Comprendre le calendrier économique",     href: "/formations/macro/intermediaire/lecon2", disabled: false },
  { id: "lecon3", title: "CPI, PPI et inflation",                   href: "/formations/macro/intermediaire/lecon3", disabled: false },
  { id: "lecon4", title: "Sessions de trading et liquidité",        href: "/formations/macro/intermediaire/lecon4", disabled: false },
  { id: "lecon5", title: "Les corrélations",                        href: null,                                     disabled: true  },
  { id: "lecon6", title: "Construire son biais hebdomadaire",       href: null,                                     disabled: true  },
];

export default function SessionsLiquiditeLecon() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-intermediaire", "lecon4"));
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
          <span className="text-zinc-500">Leçon 4</span>
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
            Sessions de trading et liquidité — quand le marché bouge vraiment
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Tu peux avoir une bonne stratégie et perdre juste parce que tu trades au mauvais moment.
            </p>
            <p className="text-[15px] text-zinc-400 leading-relaxed mt-2">
              Le marché ne bouge pas pareil à 15h qu&apos;à 23h.
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
              const isCurrent = lesson.id === "lecon4";
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
            <span className="ml-auto text-xs text-zinc-600">4 / 6 leçons</span>
          </div>
        </header>

        {/* ── Contenu ── */}
        <div className="space-y-5">

          {/* Bloc 1 — Les 3 grandes sessions */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Les 3 grandes sessions</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Le marché forex tourne du dimanche soir (23h Paris) au vendredi soir,{" "}
              <span className="font-semibold text-zinc-200">24h/24 sans vraie pause</span>. La seule &apos;fermeture&apos; est une courte coupure quotidienne autour de minuit (variable selon les brokers CFD), puis ça repart immédiatement.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Mais &apos;ouvert&apos; ne veut pas dire &apos;actif&apos;. Il y a{" "}
              <span className="font-semibold text-zinc-200">3 grandes sessions</span>{" "}
              qui se relaient et qui déterminent la liquidité réelle :
            </p>

            <div className="space-y-4 mb-5">
              <div>
                <p className="text-sm font-semibold text-zinc-200 mb-1">Session Asie — 00h à 09h Paris</p>
                <p className="text-sm text-zinc-300 mb-0.5">Tokyo, Singapour, Hong Kong. Liquidité faible. Volatilité faible.</p>
                <p className="text-sm text-zinc-400">Paires actives : USD/JPY, AUD/JPY, NZD/JPY, AUD/USD.</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-200 mb-1">Session Londres — 08h à 17h Paris</p>
                <p className="text-sm text-zinc-300 mb-0.5">
                  <span className="font-semibold text-zinc-200">LA session la plus importante.</span> Elle représente environ{" "}
                  <span className="font-semibold text-zinc-200">35-40% du volume forex mondial</span>.
                </p>
                <p className="text-sm text-zinc-400">Paires actives : EUR/USD, GBP/USD, EUR/GBP, GBP/JPY, XAU/USD.</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-200 mb-1">Session New York — 14h à 22h Paris</p>
                <p className="text-sm text-zinc-300 mb-0.5">
                  Wall Street, indices US, news américaines. Elle représente environ{" "}
                  <span className="font-semibold text-zinc-200">20-25% du volume forex mondial</span>.
                </p>
                <p className="text-sm text-zinc-400">Paires actives : EUR/USD, GBP/USD, USD/JPY, USD/CAD, XAU/USD, indices US.</p>
              </div>
            </div>

            {/* Composant visuel */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden mb-5">
              <TradingSessionsLiquidityDiagram />
            </div>

            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Le marché ne ferme pas. C&apos;est la liquidité qui change.
              </p>
            </div>
          </section>

          {/* Bloc 2 — L'overlap Londres-New York */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">L&apos;overlap Londres-New York</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              La meilleure fenêtre de liquidité est souvent entre{" "}
              <span className="font-semibold text-zinc-200">14h et 17h Paris</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Pourquoi ? Parce que Londres et New York sont ouverts{" "}
              <span className="font-semibold text-zinc-200">en même temps</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Pendant ces 3 heures :</p>
            <ul className="space-y-1.5 mb-4">
              {[
                "les institutions européennes sont actives",
                "les institutions américaines arrivent",
                "les news US sortent souvent à 14h30",
                "les volumes explosent",
                "les vrais mouvements se forment",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Sur EUR/USD,{" "}
              <span className="font-semibold text-zinc-200">une grosse partie de la volatilité quotidienne se concentre</span>{" "}
              souvent dans cette fenêtre.
            </p>
            <div className="bg-zinc-900/60 rounded-xl px-4 py-3 mb-5">
              <p className="text-xs font-semibold text-zinc-400 mb-2">C&apos;est pareil pour les autres actifs majeurs :</p>
              <ul className="space-y-1.5">
                {[
                  { bold: "XAU/USD (or)", rest: " : 50-60% de la volatilité quotidienne se concentre sur l'overlap" },
                  { bold: "Nasdaq, S&P500", rest: " : ouverture US à 15h30 = pic d'activité institutionnelle" },
                  { bold: "BTC/USD", rest: " : volatilité institutionnelle maximale entre 14h et 17h" },
                ].map((item) => (
                  <li key={item.bold} className="flex items-start gap-2 text-xs text-zinc-400">
                    <div className="w-1 h-1 rounded-full bg-zinc-600 shrink-0 mt-1.5" />
                    <span><span className="font-semibold text-zinc-300">{item.bold}</span>{item.rest}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-zinc-500 mt-2 italic">L&apos;overlap n&apos;est pas qu&apos;une fenêtre forex. C&apos;est LA fenêtre tout court.</p>
            </div>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                L&apos;overlap, c&apos;est là où le marché arrête de respirer doucement et commence à frapper.
              </p>
            </div>
          </section>

          {/* Bloc 3 — Le piège de la session Asie */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Le piège de la session Asie</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Beaucoup de traders français tradent le soir après le travail.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              22h. 23h. Minuit.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Problème : sur EUR/USD ou GBP/USD,{" "}
              <span className="font-semibold text-zinc-200">c&apos;est souvent le pire moment</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Le même piège existe sur{" "}
              <span className="font-semibold text-zinc-200">XAU/USD</span> et{" "}
              <span className="font-semibold text-zinc-200">les indices US</span> : entre 22h et 6h, ces actifs sont aussi en zone calme avec des spreads élargis. Seules les paires en JPY (USD/JPY, AUD/JPY) bougent vraiment pendant la session Asie.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Entre 22h et 6h :</p>
            <ul className="space-y-1.5 mb-4">
              {[
                "liquidité faible",
                "spreads plus larges",
                "ranges fréquents",
                "fakeouts plus nombreux",
                "moins de catalyseurs macro",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Tu vois une cassure. Tu entres. Le prix revient dans le range.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Ce n&apos;était pas un vrai breakout.{" "}
              <span className="font-semibold text-zinc-200">C&apos;était juste un marché vide.</span>
            </p>

            {/* Encadré 💰 Réalité du retail */}
            <div className="bg-zinc-800/50 border-l-4 border-amber-400 px-5 py-4 rounded">
              <div className="flex items-center gap-2 mb-2">
                <span>💰</span>
                <span className="text-sm font-bold text-amber-400 tracking-wide">Réalité du retail</span>
              </div>
              <p className="text-base text-zinc-300 leading-relaxed">
                Le retail français trade souvent quand il est disponible. Pas quand le marché est optimal. Le résultat ? Des setups qui semblent parfaits mais qui échouent — pas à cause de la stratégie, à cause de l&apos;heure.
              </p>
            </div>
          </section>

          {/* Bloc 4 — Quelle paire trader selon la session */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Quelle paire trader selon la session</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Chaque actif a ses heures fortes.
            </p>

            <div className="overflow-x-auto mb-5">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-zinc-700">
                    <th className="text-left py-2 pr-6 text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                      Actif / paire
                    </th>
                    <th className="text-left py-2 text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                      Meilleure session
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {[
                    ["EUR/USD", "Londres + overlap"],
                    ["GBP/USD", "Londres + overlap"],
                    ["USD/JPY", "New York + Asie"],
                    ["AUD/JPY", "Asie"],
                    ["NZD/JPY", "Asie"],
                    ["XAU/USD (or)", "Londres + New York"],
                    ["Indices US", "New York"],
                    ["BTC/USD", "24/7, mais souvent plus propre Londres-New York"],
                  ].map(([pair, session]) => (
                    <tr key={pair}>
                      <td className="py-2.5 pr-6 font-semibold text-zinc-200">{pair}</td>
                      <td className="py-2.5 text-zinc-400">{session}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Si tu trades EUR/USD à 23h,{" "}
              <span className="font-semibold text-zinc-200">tu trades souvent un marché endormi</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Si tu trades EUR/USD entre 14h et 17h,{" "}
              <span className="font-semibold text-zinc-200">tu trades quand les gros acteurs sont là</span>.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                La bonne paire au mauvais horaire devient un mauvais setup.
              </p>
            </div>
          </section>

          {/* Bloc 5 — Adapter ton style à la session */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Adapter ton style à la session</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Tu ne trades pas toutes les sessions pareil.
            </p>
            <div className="space-y-3 mb-5">
              {[
                { bold: "Scalping", rest: " : besoin de liquidité. Londres et overlap uniquement." },
                { bold: "Day trading", rest: " : overlap Londres-New York idéal. C'est là que les mouvements sont les plus propres." },
                { bold: "Swing trading", rest: " : tu peux utiliser Londres pour repérer les cassures importantes." },
                { bold: "News trading", rest: " : souvent autour de 14h30 ou 20h00. Mais seulement avec préparation." },
              ].map((item, i) => (
                <p key={i} className="text-zinc-300 leading-relaxed text-sm">
                  <span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}
                </p>
              ))}
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Si ta stratégie demande du mouvement,{" "}
              <span className="font-semibold text-zinc-200">ne la teste pas sur une session morte</span>.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Une stratégie de scalping en session Asie, c&apos;est comme jouer au tennis sans adversaire — tu peux taper la balle, mais rien ne se passe.
              </p>
            </div>
          </section>

          {/* Bloc 6 — Construire ta fenêtre de trading */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Construire ta fenêtre de trading</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Le but n&apos;est pas de <span className="font-semibold text-zinc-200">trader plus</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Le but est de <span className="font-semibold text-zinc-200">trader au bon moment</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Pour un trader basé en France :</p>
            <ul className="space-y-2 mb-5">
              {[
                { bold: "08h-10h", rest: " : ouverture Londres" },
                { bold: "14h-17h", rest: " : overlap Londres-New York (idéal)" },
                { bold: "15h30-18h", rest: " : ouverture des indices US" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
              <li className="flex items-start gap-2.5 text-sm text-zinc-300">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                <span>
                  <span className="font-semibold text-zinc-200">22h-06h</span>
                  {" : marché reste ouvert mais "}
                  <span className="font-semibold text-zinc-200">liquidité faible</span>
                  {" sur EUR/USD, GBP/USD et XAU/USD. Pour les paires JPY, ça peut au contraire être actif (Tokyo s'ouvre vers 1h)."}
                </span>
              </li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Ces fenêtres sont valables pour la plupart des actifs majeurs : forex, or, indices US et crypto. La seule exception : les paires en JPY peuvent justifier de surveiller la session Asie (00h-09h).
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Si tu travailles en journée, le soir peut être tentant.{" "}
              <span className="font-semibold text-zinc-200">Mais tentant ne veut pas dire rentable.</span>
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Ton edge ne dépend pas seulement de ta stratégie. Il dépend aussi de l&apos;heure à laquelle tu l&apos;utilises.
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
              "Le marché est ouvert 24h/24, mais la liquidité varie énormément",
              "Londres et l'overlap Londres-New York sont les fenêtres les plus propres",
              "La session Asie est souvent dangereuse pour EUR/USD, GBP/USD, XAU/USD et les indices US",
              "Adapter ta paire et ta stratégie à la session améliore ton edge",
            ]}
          />

          <LessonExercice
            description="Analyse ta propre fenêtre de trading."
            steps={[
              "Note les heures auxquelles tu trades le plus souvent.",
              "Identifie la session correspondante : Asie, Londres ou New York.",
              "Compare tes résultats selon les horaires (si tu tiens un journal).",
              "Observe EUR/USD entre 14h et 17h pendant 3 jours consécutifs.",
              "Compare avec le comportement du même actif après 22h.",
            ]}
          />
          <p className="text-sm text-zinc-500 leading-relaxed px-1">
            L&apos;objectif : vérifier si tu trades{" "}
            <span className="font-semibold text-zinc-400">au bon moment ou seulement quand tu es disponible</span>.
          </p>

          <LessonQuiz
            question="Tu trades EUR/USD à 23h heure de Paris. Le prix casse une résistance, puis revient immédiatement dans le range et te sort sur ton stop loss. Quelle est l'explication la plus probable ?"
            options={[
              "Ta stratégie ne fonctionne plus, il faut tout revoir",
              "La session est peu liquide, donc les fakeouts sont plus fréquents sur EUR/USD à cette heure",
              "EUR/USD ne respecte jamais les résistances",
              "Le marché forex est fermé à 23h",
            ]}
            correctIndex={1}
            explanation="À 23h Paris, Londres et New York sont fermés. Sur EUR/USD, la liquidité est souvent plus faible, les spreads peuvent s'élargir et les cassures sont moins fiables. C'est exactement le piège de la session Asie sur les paires européennes/US. L'option A est trop radicale (ta stratégie peut très bien marcher en overlap Londres-NY). L'option C est fausse (EUR/USD respecte parfaitement les résistances quand la liquidité est là). L'option D est incorrecte : le forex est ouvert, mais pas toujours bien tradable. Ce même principe s'applique à XAU/USD, aux indices US et au BTC/USD — le timing est universel, pas seulement forex."
            answerExplanations={[
              "Faux. Ta stratégie n'est pas en cause ici. Le problème vient du contexte horaire, pas de l'analyse technique. Une stratégie peut fonctionner parfaitement en overlap et échouer la nuit.",
              "Correct. À 23h Paris, Londres et New York sont fermés. La liquidité sur EUR/USD est faible, les spreads s'élargissent et les cassures sont moins fiables. C'est le piège classique de la session Asie sur les paires européennes.",
              "Faux. EUR/USD respecte très bien les niveaux techniques — mais uniquement quand il y a de la liquidité, c'est-à-dire principalement durant les sessions Londres et New York.",
              "Faux. Le forex est techniquement ouvert 24h/24. Mais 'ouvert' ne veut pas dire 'tradable dans de bonnes conditions'.",
            ]}
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => { const p = getStoredProgress(); markLessonComplete(p, "macro-intermediaire", "lecon4"); setDone(true); }}
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
                  <p className="text-xs text-zinc-500 mt-0.5">La prochaine leçon (Les corrélations) sera bientôt disponible.</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/formations/macro/intermediaire/lecon3"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Leçon 3 — CPI, PPI et inflation
              </Link>
              <span className="text-sm text-zinc-700 cursor-default">
                Les corrélations — Bientôt disponible →
              </span>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
