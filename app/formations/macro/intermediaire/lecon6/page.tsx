"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { WeeklyBiasCalendarDiagram } from "@/app/components/charts/WeeklyBiasCalendarDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Hawkish vs Dovish",                      href: "/formations/macro/intermediaire/lecon1", disabled: false },
  { id: "lecon2", title: "Comprendre le calendrier économique",     href: "/formations/macro/intermediaire/lecon2", disabled: false },
  { id: "lecon3", title: "CPI, PPI et inflation",                   href: "/formations/macro/intermediaire/lecon3", disabled: false },
  { id: "lecon4", title: "Sessions de trading et liquidité",        href: "/formations/macro/intermediaire/lecon4", disabled: false },
  { id: "lecon5", title: "Les corrélations",                        href: "/formations/macro/intermediaire/lecon5", disabled: false },
  { id: "lecon6", title: "Construire son biais hebdomadaire",       href: "/formations/macro/intermediaire/lecon6", disabled: false },
];

export default function BiaisHebdomadaireLecon() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-intermediaire", "lecon6"));
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
          <span className="text-zinc-500">Leçon 6</span>
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
            Construire son biais hebdomadaire — la routine macro que personne ne fait
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Le retail découvre le marché le lundi matin.
            </p>
            <p className="text-[15px] text-zinc-400 leading-relaxed mt-2">
              Le trader préparé arrive avec un biais, un plan et des zones à éviter.
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
              const isCurrent = lesson.id === "lecon6";
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
            <span className="ml-auto text-xs text-zinc-600">6 / 6 leçons</span>
          </div>
        </header>

        {/* ── Contenu ── */}
        <div className="space-y-5">

          {/* Bloc 1 — Pourquoi le biais change tout */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Pourquoi le biais change tout</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Sans biais hebdomadaire, tu <span className="font-semibold text-zinc-200">réagis</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-1">
              Tu vois une bougie monter, tu veux acheter.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Tu vois une bougie baisser, tu veux vendre.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Le problème : tu trades le <span className="font-semibold text-zinc-200">bruit du jour</span> au lieu du <span className="font-semibold text-zinc-200">contexte de la semaine</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Un biais hebdomadaire te donne une <span className="font-semibold text-zinc-200">direction prioritaire</span> :
            </p>
            <ul className="space-y-1.5 mb-5">
              {[
                "où chercher des achats",
                "où chercher des ventes",
                "quand ne rien faire",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Un trade sans biais, c&apos;est une décision sans boussole.
              </p>
            </div>
          </section>

          {/* Bloc 2 — Les 4 piliers d'un biais solide */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Les 4 piliers d&apos;un biais solide</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Ton biais ne doit pas sortir de ton intuition.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Il doit venir de <span className="font-semibold text-zinc-200">4 piliers</span> :
            </p>
            <div className="space-y-4 mb-4">
              {[
                {
                  n: "1. Le ton macro",
                  body: "Hawkish ou dovish ?",
                  ref: "(cf leçon 1)",
                },
                {
                  n: "2. Le calendrier de la semaine",
                  body: "Y a-t-il un CPI, un NFP, un FOMC ou un cluster ?",
                  ref: "(cf leçon 2)",
                },
                {
                  n: "3. Les corrélations",
                  body: "XAU/USD confirme-t-il le DXY ? BTC/USD suit-il encore le Nasdaq ?",
                  ref: "(cf leçon 5)",
                },
                {
                  n: "4. Le contexte global",
                  body: "Risk-on ou risk-off ? Le marché cherche-t-il le risque ou la sécurité ?",
                  ref: null,
                },
              ].map((pilier) => (
                <div key={pilier.n} className="bg-zinc-800/30 rounded-xl px-4 py-3">
                  <p className="text-sm font-semibold text-zinc-200 mb-1">{pilier.n}</p>
                  <p className="text-sm text-zinc-300">
                    {pilier.body}{pilier.ref && <span className="text-zinc-500 ml-1 italic">{pilier.ref}</span>}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Sans ces 4 piliers, ton biais est une <span className="font-semibold text-zinc-200">opinion</span>.<br />
              Avec eux, c&apos;est une <span className="font-semibold text-zinc-200">thèse</span>.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Ton avis ne vaut rien. Ta thèse doit avoir des preuves.
              </p>
            </div>
          </section>

          {/* Bloc 3 — La routine du dimanche soir */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">La routine du dimanche soir</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              La routine prend <span className="font-semibold text-zinc-200">20 minutes</span>. Pas plus.
            </p>
            <div className="space-y-3 mb-5">
              {[
                { bold: "Étape 1 — Calendrier (5 min)", rest: "Tu ouvres la semaine. Tu notes les news 3 étoiles. Tu repères les clusters." },
                { bold: "Étape 2 — Ton macro (5 min)", rest: "Tu regardes la dernière communication Fed / BCE. Hawkish, dovish ou neutre ?" },
                { bold: "Étape 3 — DXY (3 min)", rest: "Le dollar est-il haussier, baissier ou en range ?" },
                { bold: "Étape 4 — Corrélations (3 min)", rest: "XAU/USD confirme-t-il le DXY ? BTC/USD suit-il le Nasdaq ? Une corrélation casse-t-elle ?" },
                { bold: "Étape 5 — Biais par actif (4 min)", rest: "Pour chaque actif que tu trades : long / short / neutre." },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    <span className="font-semibold text-zinc-200">{item.bold}</span>
                    <br />{item.rest}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Tu n&apos;as pas besoin de 10 biais. <span className="font-semibold text-zinc-200">Deux ou trois actifs suffisent</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              <span className="font-semibold text-zinc-200">Total : 20 minutes le dimanche soir. C&apos;est tout.</span>
            </p>

            {/* Composant visuel */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden mb-5">
              <WeeklyBiasCalendarDiagram />
            </div>

            {/* Encadré 💰 Réalité du retail */}
            <div className="bg-zinc-800/50 border-l-4 border-amber-400 px-5 py-4 rounded">
              <div className="flex items-center gap-2 mb-2">
                <span>💰</span>
                <span className="text-sm font-bold text-amber-400 tracking-wide">Réalité du retail</span>
              </div>
              <p className="text-base text-zinc-300 leading-relaxed">
                Le retail choisit son trade devant le graphique. Le pro choisit son contexte avant d&apos;ouvrir le graphique.
              </p>
            </div>
          </section>

          {/* Bloc 4 — Exemple concret de biais hebdomadaire */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Exemple concret de biais hebdomadaire</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Contexte de départ</span> :
            </p>
            <ul className="space-y-1.5 mb-5">
              {[
                "Fed hawkish, taux à 5.50%",
                "CPI mercredi à 14h30",
                "NFP vendredi à 14h30",
                "DXY haussier depuis 3 semaines",
                "XAU/USD en range",
                "BTC/USD corrélé au Nasdaq, mais sans direction claire",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Biais possible</span> :
            </p>
            <div className="space-y-2 mb-5">
              {[
                { asset: "EUR/USD", biais: "biais short", detail: "DXY fort + Fed hawkish." },
                { asset: "XAU/USD", biais: "biais neutre / short léger", detail: "Dollar fort, mais range technique." },
                { asset: "Nasdaq", biais: "biais short", detail: "Taux élevés = pression sur la tech." },
                { asset: "BTC/USD", biais: "biais neutre", detail: "Corrélation Nasdaq, mais structure pas claire." },
              ].map((item) => (
                <div key={item.asset} className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
                  <p className="text-sm font-semibold text-zinc-200 mb-0.5">
                    {item.asset} → <span className="text-zinc-300 font-normal">{item.biais}</span>
                  </p>
                  <p className="text-xs text-zinc-500">{item.detail}</p>
                </div>
              ))}
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Plan de semaine</span> :
            </p>
            <ul className="space-y-1.5 mb-5">
              {[
                { bold: "Lundi", rest: " : setups short EUR/USD seulement" },
                { bold: "Mardi", rest: " : prudence avant CPI" },
                { bold: "Mercredi", rest: " : pas de trade avant la réaction CPI" },
                { bold: "Jeudi", rest: " : recalibrage selon CPI" },
                { bold: "Vendredi", rest: " : pas de nouveau trade avant NFP" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Le biais ne te dit pas où cliquer. Il te dit où chercher.
              </p>
            </div>
          </section>

          {/* Bloc 5 — Quand modifier ton biais */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Quand modifier ton biais</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Tu ne changes pas de biais parce qu&apos;une bougie rouge apparaît.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Tu changes de biais <span className="font-semibold text-zinc-200">seulement si le contexte change</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Exemple</span> :
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-2">
              Tu as un biais long XAU/USD dimanche.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Mardi, CPI sort plus haut que prévu. Le DXY explose. La Fed redevient plus hawkish.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              → Ton biais long XAU/USD est <span className="font-semibold text-zinc-200">invalidé</span>. Tu fermes l&apos;idée. Tu attends.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">À l&apos;inverse</span> :
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              XAU/USD baisse de 20$ lundi sans news majeure. Ton biais n&apos;est pas forcément invalidé. C&apos;est peut-être juste un pullback.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">La différence</span> :
            </p>
            <ul className="space-y-1.5 mb-5">
              {[
                { bold: "mouvement technique", rest: " = patience" },
                { bold: "invalidation macro", rest: " = changement de plan" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Un mauvais trade qui suit ton biais te coûte de l&apos;argent. Un changement de biais à chaque pullback te coûte ta cohérence.
              </p>
            </div>
          </section>

          {/* Bloc 6 — Les 5 pièges classiques */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Les 5 pièges classiques</h2>
            <div className="space-y-3 mb-5">
              {[
                {
                  bold: "Piège 1",
                  desc: " : construire un biais sans regarder le calendrier.",
                  consequence: "Tu seras surpris par les news.",
                },
                {
                  bold: "Piège 2",
                  desc: " : changer de biais à chaque pullback.",
                  consequence: "Tu deviens réactif au lieu d'être structuré.",
                },
                {
                  bold: "Piège 3",
                  desc: " : avoir trop de biais.",
                  consequence: "Long XAU/USD, short EUR/USD, long BTC/USD, short Nasdaq, long GBP/USD… Tu finis par ne plus rien suivre.",
                },
                {
                  bold: "Piège 4",
                  desc: " : oublier les corrélations.",
                  consequence: "Long XAU/USD + long BTC/USD + long Nasdaq peut devenir un seul gros pari risk-on.",
                  ref: "(cf leçon 5)",
                },
                {
                  bold: "Piège 5",
                  desc: " : ne jamais relire ton plan.",
                  consequence: "Un biais hebdomadaire n'est pas une prison. C'est un cadre.",
                },
              ].map((item) => (
                <div key={item.bold} className="bg-zinc-800/30 rounded-xl px-4 py-3">
                  <p className="text-sm text-zinc-300 mb-1">
                    <span className="font-semibold text-zinc-200">{item.bold}</span>{item.desc}
                  </p>
                  <p className="text-sm text-zinc-400 italic">
                    → {item.consequence}{item.ref && <span className="text-zinc-500 ml-1">{item.ref}</span>}
                  </p>
                </div>
              ))}
            </div>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                La discipline, ce n&apos;est pas rester têtu. C&apos;est savoir ce qui invalide ton plan.
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
              "Un biais hebdomadaire transforme tes idées en plan structuré",
              "Un bon biais repose sur macro, calendrier, corrélations et sentiment global",
              "Tu ne changes pas de biais sur une bougie, mais sur une invalidation claire",
              "La routine du dimanche soir prépare ta semaine avant que le marché te force à réagir",
            ]}
          />

          <LessonExercice
            description="Construis ton biais macro pour la semaine prochaine."
            steps={[
              "Ouvre le calendrier économique en vue semaine.",
              "Note les 3 à 5 événements majeurs.",
              "Analyse le DXY, XAU/USD, BTC/USD et Nasdaq.",
              "Définis un biais long / short / neutre pour 2 ou 3 actifs maximum.",
              "Classe tes journées : agressive, neutre ou défensive.",
            ]}
          />
          <p className="text-sm text-zinc-500 leading-relaxed px-1">
            L&apos;objectif : arriver lundi avec un{" "}
            <span className="font-semibold text-zinc-400">plan</span>, pas avec une réaction.
          </p>

          <LessonQuiz
            question="Tu construis dimanche un biais long XAU/USD. Mardi, le CPI sort beaucoup plus haut que prévu, le DXY explose à la hausse et XAU/USD casse un support important. Que fais-tu ?"
            options={[
              "Tu gardes ton biais long parce qu'il faut respecter son plan",
              "Tu doubles ta position pour avoir un meilleur prix",
              "Tu considères que ton biais est invalidé et tu attends une nouvelle structure",
              "Tu passes immédiatement short sans autre confirmation",
            ]}
            correctIndex={2}
            explanation="Un biais doit être respecté, mais seulement tant que ses conditions restent valides. Ici, le CPI plus haut que prévu + le DXY qui explose + la cassure technique forment une invalidation macro complète. Tu fermes l'idée et tu attends une nouvelle structure. L'option A confond discipline et entêtement (un biais invalidé ne se respecte plus). L'option B aggrave le risque sur une thèse cassée. L'option D réagit trop vite sans reconstruire de plan — il faut attendre une nouvelle confirmation, pas flipper directement."
            answerExplanations={[
              "Faux. Respecter son plan ne signifie pas ignorer une invalidation macro complète. Quand les conditions qui fondaient ton biais changent radicalement, le biais doit changer aussi.",
              "Faux. Doubler une position sur une thèse invalidée par le macro aggrave le risque. C'est l'un des pièges les plus coûteux en trading.",
              "Correct. Le CPI plus haut que prévu + le DXY qui explose + la cassure technique forment une invalidation macro complète. Tu fermes l'idée et tu attends une nouvelle structure avant de repositionner.",
              "Faux. Passer directement short après une invalidation, sans rebâtir un plan, c'est remplacer une réaction par une autre. Il faut d'abord une nouvelle confirmation, pas un flip immédiat.",
            ]}
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => { const p = getStoredProgress(); markLessonComplete(p, "macro-intermediaire", "lecon6"); setDone(true); }}
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
                  <p className="text-xs text-zinc-500 mt-0.5">Tu as terminé le module Intermédiaire Macro. Bravo.</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/formations/macro/intermediaire/lecon5"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Leçon 5 — Les corrélations
              </Link>
              <span className="text-sm font-bold text-emerald-400 cursor-default">
                Module Intermédiaire Macro complet ✓
              </span>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
