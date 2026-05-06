"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import RiskRegimesQuadrantDiagram from "@/app/components/charts/RiskRegimesQuadrantDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "FOMC",                          href: "/formations/macro/avance/lecon1", disabled: false },
  { id: "lecon2", title: "NFP",                           href: "/formations/macro/avance/lecon2", disabled: false },
  { id: "lecon3", title: "Les rendements obligataires US", href: "/formations/macro/avance/lecon3", disabled: false },
  { id: "lecon4", title: "Risk-on / Risk-off",            href: "/formations/macro/avance/lecon4", disabled: false },
];

export default function RiskRegimesLecon() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-avance", "lecon4"));
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
          <Link href="/formations/macro/avance" className="hover:text-zinc-400 transition-colors">Avancé</Link>
          <span>/</span>
          <span className="text-zinc-500">Leçon 4</span>
        </nav>

        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">
              Avancé
            </span>
            <span className="text-zinc-700 text-xs">·</span>
            <span className="text-xs text-zinc-600">18 min</span>
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
            Risk-on / Risk-off — le cadre mental du pro
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Le retail regarde un graphique. Le pro lit un régime.
            </p>
            <p className="text-[15px] text-zinc-400 leading-relaxed mt-2">
              Deux traders, même setup, résultats opposés parce qu&apos;ils ne sont pas dans le même environnement.
            </p>
            <p className="text-[15px] text-zinc-400 leading-relaxed mt-2">
              Risk-on, risk-off, reflation, flight to quality : ce n&apos;est pas du jargon, c&apos;est la carte du terrain.
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
                    : lesson.disabled
                    ? "border-zinc-800/50 text-zinc-700"
                    : "border-zinc-800 text-zinc-500"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? "bg-white" : lesson.disabled ? "bg-zinc-700" : "bg-zinc-600"}`} />
                  {lesson.title}
                </span>
              );
              return <div key={lesson.id}>{pill}</div>;
            })}
            <span className="ml-auto text-xs text-zinc-600">4 / 4 leçons</span>
          </div>
        </header>

        {/* ── Contenu ── */}
        <div className="space-y-5">

          {/* Bloc 1 — Risk-on / Risk-off : la grille mentale du pro */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Risk-on / Risk-off : la grille mentale du pro</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Risk-on = le capital cherche du rendement et accepte la volatilité. Risk-off = il fuit vers la sécurité.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Ce n&apos;est pas une opinion, c&apos;est un flux. Et les flux dominent tes patterns.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Pourquoi c&apos;est critique</span> : un breakout n&apos;a pas la même valeur selon le régime.
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                "Nasdaq casse une résistance en risk-on → tu achètes, continuation probable.",
                "Le même breakout en risk-off → tu vends le piège, squeeze puis rejet.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-2">
              Exemple concret : Nasdaq +140 points sur une news soft CPI en risk-on, suivi de +220 points en extension.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Même pattern en risk-off : +120 points spike puis -260 points en retour sous le niveau.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Le marché ne te paie pas pour voir un signal. Il te paie pour comprendre le contexte dans lequel ce signal apparaît.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Tu ne trades pas un actif. Tu trades un environnement.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « Avant de demander OÙ tu trades, demande DANS QUOI tu trades. »
              </p>
            </div>
          </section>

          {/* Bloc 2 — La typologie des 4 régimes */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">La typologie des 4 régimes</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Ce n&apos;est pas binaire. Entre appétit et aversion au risque, il existe 4 états distincts. Chacun a sa signature et ses trades.
            </p>
            <div className="space-y-4">

              <div className="bg-zinc-800/30 rounded-xl px-4 py-4">
                <h3 className="text-sm font-semibold text-zinc-200 mb-3">Risk-on classique</h3>
                <p className="text-sm text-zinc-300 mb-1">
                  <span className="font-semibold text-zinc-400">Signature :</span>{" "}DXY -30 à -60 points, US10Y stable ou +5 points, or stable à modérément haussier (+10 à +30 points), indices US +150 à +300 points, BTC/USD +800 à +2000.
                </p>
                <p className="text-sm text-zinc-300 mb-1">
                  <span className="font-semibold text-zinc-400">Lecture :</span>{" "}croissance ok, inflation sous contrôle, liquidité suffisante.
                </p>
                <p className="text-sm text-zinc-300 mb-1">
                  <span className="font-semibold text-zinc-400">Trade typique :</span>{" "}long indices, long BTC, short USD contre AUD/NZD.
                </p>
                <p className="text-sm text-zinc-300">
                  <span className="font-semibold text-zinc-400">Cas concret :</span>{" "}fin 2023, narratif pivot Fed. Nasdaq enchaîne +250 puis +320 points sur la semaine, DXY recule de -80 points.
                </p>
              </div>

              <div className="bg-zinc-800/30 rounded-xl px-4 py-4">
                <h3 className="text-sm font-semibold text-zinc-200 mb-3">Risk-off panique</h3>
                <p className="text-sm text-zinc-300 mb-1">
                  <span className="font-semibold text-zinc-400">Signature :</span>{" "}DXY +80 à +150 points, US10Y -20 à -40 points (fuite vers Treasuries), or +40 à +90 points, indices -300 à -800 points, BTC/USD -2000 à -6000.
                </p>
                <p className="text-sm text-zinc-300 mb-1">
                  <span className="font-semibold text-zinc-400">Lecture :</span>{" "}liquidation globale, recherche de cash et de sécurité.
                </p>
                <p className="text-sm text-zinc-300 mb-1">
                  <span className="font-semibold text-zinc-400">Trade typique :</span>{" "}long USD, long CHF/JPY, long or, short indices ou flat.
                </p>
                <p className="text-sm text-zinc-300">
                  <span className="font-semibold text-zinc-400">Cas concret :</span>{" "}16 mars 2020. Nasdaq -900 points en séance, DXY +140 points, US10Y -35 points.
                </p>
              </div>

              <div className="bg-zinc-800/30 rounded-xl px-4 py-4">
                <h3 className="text-sm font-semibold text-zinc-200 mb-3">Reflation trade</h3>
                <p className="text-sm text-zinc-300 mb-1">
                  <span className="font-semibold text-zinc-400">Signature :</span>{" "}DXY mixte (+/-30 points), US10Y +15 à +40 points, or +20 à +70 points, indices montent mais rotation interne, BTC/USD haussier.
                </p>
                <p className="text-sm text-zinc-300 mb-1">
                  <span className="font-semibold text-zinc-400">Lecture :</span>{" "}croissance + inflation qui repart. L&apos;argent va vers les actifs réels.
                </p>
                <p className="text-sm text-zinc-300 mb-1">
                  <span className="font-semibold text-zinc-400">Trade typique :</span>{" "}long matières premières, long financières, short tech longue duration.
                </p>
                <p className="text-sm text-zinc-300">
                  <span className="font-semibold text-zinc-400">Cas concret :</span>{" "}début 2021. US10Y prend +30 points en quelques semaines, Nasdaq sous-performe, rotation vers value.
                </p>
              </div>

              <div className="bg-zinc-800/30 rounded-xl px-4 py-4">
                <h3 className="text-sm font-semibold text-zinc-200 mb-3">Flight to quality</h3>
                <p className="text-sm text-zinc-300 mb-1">
                  <span className="font-semibold text-zinc-400">Signature :</span>{" "}DXY +30 à +80 points, US10Y -10 à -25 points, or +20 à +60 points, indices -80 à -200 points, BTC/USD en baisse modérée.
                </p>
                <p className="text-sm text-zinc-300 mb-1">
                  <span className="font-semibold text-zinc-400">Définition :</span>{" "}flight to quality = déplacement du capital vers les actifs perçus comme sûrs.
                </p>
                <p className="text-sm text-zinc-300 mb-1">
                  <span className="font-semibold text-zinc-400">Trade typique :</span>{" "}long USD, long or, réduction du risque sur actions.
                </p>
                <p className="text-sm text-zinc-300">
                  <span className="font-semibold text-zinc-400">Cas concret :</span>{" "}début 2022, tensions Ukraine. Nasdaq -150 points, or +50 points, DXY +60 points sans crash global.
                </p>
              </div>

            </div>
          </section>

          {/* Bloc 3 — Comment reconnaître le régime en cours */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Comment reconnaître le régime en cours</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Routine simple. Quatre questions. Quatre réponses.
            </p>
            <div className="space-y-3 mb-5">
              {[
                {
                  q: "DXY monte ou descend ?",
                  a: "Montée = demande de dollar, stress ou attractivité. Baisse = appétit pour le risque global.",
                },
                {
                  q: "US10Y monte ou descend ?",
                  a: "Montée = anticipation inflation/croissance. Baisse = recherche de sécurité ou peur de récession.",
                },
                {
                  q: "Or monte ou descend ?",
                  a: "Montée = couverture contre risque ou inflation. Baisse = désintérêt pour protection.",
                },
                {
                  q: "Indices US et BTC bougent ensemble ou se décorrèlent ?",
                  a: "Ensemble = régime clair. Décorrélation = transition ou rotation interne.",
                },
              ].map((item, i) => (
                <div key={i} className="bg-zinc-800/30 rounded-xl px-4 py-3">
                  <p className="text-sm font-semibold text-zinc-200 mb-1">{i + 1}. {item.q}</p>
                  <p className="text-sm text-zinc-400 italic">→ {item.a}</p>
                </div>
              ))}
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm">
              Croise les réponses. Tu identifies le régime sans terminal pro. Juste 4 charts.
            </p>
          </section>

          {/* Bloc 4 — Visuel */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Les 4 régimes de marché</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Le marché peut se lire comme un quadrant. Axe horizontal : inflation faible à élevée. Axe vertical : croissance forte à faible. Chaque coin correspond à un régime distinct. Ce schéma te permet de positionner rapidement l&apos;environnement macro et d&apos;anticiper quels actifs doivent surperformer ou sous-performer.
            </p>
            <div className="border border-zinc-800 rounded-xl overflow-hidden">
              <RiskRegimesQuadrantDiagram />
            </div>
          </section>

          {/* Bloc 5 — Les transitions entre régimes */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Les transitions entre régimes : là où se cache l&apos;edge</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Le marché ne switch pas. Il glisse. Ton edge est dans les premières fissures.
            </p>
            <div className="space-y-4 mb-5">
              {[
                {
                  signal: "L'or monte alors que les yields montent",
                  body: "Normalement inverse. Si XAU/USD +40 points et US10Y +20 points simultanément, le marché price une inflation persistante.",
                },
                {
                  signal: "Les yields chutent malgré un discours Fed hawkish",
                  body: "Le marché ne croit pas la Fed. Exemple : US10Y -25 points post FOMC alors que le ton reste restrictif → pricing récession.",
                },
                {
                  signal: "Le DXY monte avec des yields qui montent",
                  body: "Double pression : attractivité taux + demande de sécurité. Exemple : DXY +70 points avec US10Y +15 points = tension latente.",
                },
                {
                  signal: "Nasdaq diverge du Russell 2000",
                  body: "Si Nasdaq +120 points pendant que Russell -80 points = marché qui price une baisse de yields anticipée (favorable à la tech longue duration), pas une vraie reprise économique. Inverse (Russell +80 / Nasdaq -120) = reflation, croissance domestique réelle favorisée.",
                },
              ].map((item, i) => (
                <div key={i} className="bg-zinc-800/30 rounded-xl px-4 py-3">
                  <p className="text-sm font-semibold text-zinc-200 mb-2">— {item.signal}</p>
                  <p className="text-sm text-zinc-400">→ {item.body}</p>
                </div>
              ))}
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm">
              Ces signaux apparaissent avant les headlines. C&apos;est là que tu prends l&apos;avance.
            </p>
          </section>

          {/* Bloc 6 — Le vocabulaire institutionnel à connaître */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Le vocabulaire institutionnel à connaître</h2>
            <div className="space-y-3">
              {[
                {
                  term: "Flight to quality",
                  def: "Déplacement du capital vers des actifs sûrs.",
                  util: "Identifier les phases défensives sans panique.",
                  cas: "Or +50 points, US10Y -15 points, indices -100 points.",
                },
                {
                  term: "Reflation trade",
                  def: "Positionnement sur le retour de croissance et inflation.",
                  util: "Comprendre les rotations sectorielles.",
                  cas: "US10Y +25 points, banques montent, tech sous-performe.",
                },
                {
                  term: "Carry trade",
                  def: "Emprunter dans une devise à faible taux pour investir dans une devise à taux élevé.",
                  util: "Capter le rendement différentiel.",
                  cas: "Positions short JPY massives accumulées pendant des mois, puis débouclage violent en août 2024 avec USD/JPY -2000 pips en quelques séances (du 31 juillet au 5 août).",
                },
                {
                  term: "Safe haven flow",
                  def: "Flux vers les actifs refuges.",
                  util: "Confirmer un biais défensif.",
                  cas: "USD, CHF et or montent ensemble sur une tension géopolitique.",
                },
                {
                  term: "Risk parity",
                  def: "Stratégie qui équilibre le risque entre actions et obligations.",
                  util: "Comprendre les ventes forcées.",
                  cas: "Quand yields et actions montent ensemble, les fonds réduisent les deux → mouvements violents et synchronisés.",
                },
              ].map((item) => (
                <div key={item.term} className="bg-zinc-800/30 rounded-xl px-4 py-3">
                  <p className="text-sm font-semibold text-zinc-200 mb-1">{item.term}</p>
                  <p className="text-sm text-zinc-300 mb-1">{item.def}</p>
                  <p className="text-xs text-zinc-500"><span className="font-semibold">Utilité :</span> {item.util}</p>
                  <p className="text-xs text-zinc-500 mt-0.5"><span className="font-semibold">Cas :</span> {item.cas}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Bloc 7 — Multi-actifs */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Multi-actifs : où chaque régime se lit le mieux</h2>
            <div className="space-y-3">
              {[
                { bold: "DXY + US10Y", body: "= baromètre principal. Si les deux montent, tension. Si DXY baisse et yields stables, risk-on." },
                { bold: "XAU/USD", body: "= arbitre. Il distingue une peur contrôlée d'une panique. Or qui monte sans crash actions = flight to quality." },
                { bold: "Nasdaq", body: "= sensible aux yields. +25 points sur US10Y peut suffire à provoquer -150 points sur l'indice." },
                { bold: "Russell 2000", body: "= proxy de la croissance US domestique. Surperforme en reflation, sous-performe en stress et en flight to quality." },
                { bold: "BTC/USD", body: "= version amplifiée du Nasdaq. Si Nasdaq +120 points, BTC peut faire +1500. Idéal pour lire le sentiment brut." },
              ].map((item) => (
                <div key={item.bold} className="bg-zinc-800/30 rounded-xl px-4 py-3">
                  <p className="text-sm text-zinc-300">
                    <span className="font-semibold text-zinc-200">{item.bold}</span> {item.body}
                  </p>
                </div>
              ))}
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
              "Risk-on/off n'est PAS binaire, c'est un quadrant de 4 régimes",
              "DXY + US10Y + Or + Indices = les 4 charts à lire chaque matin",
              "Le même setup technique se trade différemment selon le régime",
              "Les transitions se voient dans les signaux faibles AVANT l'évidence",
              "Flight to quality / reflation trade / carry trade = vocabulaire pro qui décrit des flux réels",
            ]}
          />

          <LessonExercice
            description="Mets en pratique la grille des 4 régimes avant ta prochaine session."
            steps={[
              "Identifier le régime actuel du marché selon la checklist 4 questions",
              "Vérifier les 4 charts (DXY, US10Y, XAU/USD, Nasdaq) ce matin et nommer le régime à voix haute",
              "Trouver dans l'actualité une mention de \"flight to quality\" ou \"reflation trade\" et comprendre le contexte",
              "Comparer comment ton actif principal s'est comporté la dernière fois qu'on était dans le régime opposé à celui d'aujourd'hui",
              "Ajouter à ton journal de trading une ligne \"Régime du jour\" avant chaque session",
            ]}
          />

          <LessonQuiz
            question="Ce matin : DXY ↑, US10Y ↓, Or ↑, Nasdaq ↓ légèrement. Dans quel régime es-tu ?"
            options={[
              "Risk-on classique",
              "Risk-off panique",
              "Reflation trade",
              "Flight to quality",
            ]}
            correctIndex={3}
            explanation="DXY qui monte + yields qui baissent + or qui monte + indices qui baissent légèrement = capital qui se positionne défensivement sans panique. Pas un effondrement, juste un repositionnement. Différence clé avec le risk-off panique : en risk-off panique, indices et BTC chutent violemment. Ici, la baisse est contenue, signe d'une peur mesurée."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => { const p = getStoredProgress(); markLessonComplete(p, "macro-avance", "lecon4"); setDone(true); }}
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
                  <p className="text-xs text-zinc-500 mt-0.5">Tu as complété le module Macro Avancé complet.</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/formations/macro/avance/lecon3"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Leçon 3 — Rendements obligataires US
              </Link>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
