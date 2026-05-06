"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import PinBarSetupDiagram from "@/app/components/charts/PinBarSetupDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Lire une bougie", disabled: false },
  { id: "lecon2", title: "Pin bar",          disabled: false },
  { id: "lecon3", title: "Leçon 3",          disabled: true },
  { id: "lecon4", title: "Leçon 4",          disabled: true },
];

export default function PinBarPage() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "price-action", "lecon2"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Stratégies</Link>
          <span>/</span>
          <Link href="/strategies/price-action" className="hover:text-zinc-400 transition-colors">Price Action</Link>
          <span>/</span>
          <span className="text-zinc-500">Leçon 2</span>
        </nav>

        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Débutant
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
            Pin bar : le rejet de niveau
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-300 leading-relaxed">
              Une pin bar = un rejet brutal d&apos;un niveau.
            </p>
            <p className="text-[15px] text-zinc-300 leading-relaxed mt-2">
              Le marché a essayé de casser, il a échoué, puis il est revenu en force.
            </p>
            <p className="text-[15px] text-zinc-300 leading-relaxed mt-2">
              Quand tu sais lire cette mèche au bon endroit, tu ne regardes plus une bougie : tu lis une défense de prix.
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
              const isCurrent = lesson.id === "lecon2";
              return (
                <div key={lesson.id}>
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
                </div>
              );
            })}
            <span className="ml-auto text-xs text-zinc-600">2 / 4 leçons</span>
          </div>
        </header>

        {/* ── Contenu ── */}
        <div className="space-y-5">

          {/* Bloc 1 — Anatomie d'un pin bar valide */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Anatomie d&apos;un pin bar valide</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Une pin bar valide respecte 3 critères.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">1. Une mèche au moins 2x plus longue que le corps.</span><br />
              La mèche doit dominer visuellement la bougie. Si elle est à peine plus grande que le corps, ce n&apos;est pas un vrai rejet.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">2. Un petit corps placé à l&apos;opposé de la mèche.</span><br />
              Pour une pin bar bullish, la mèche basse est longue et le corps est en haut. Les vendeurs ont poussé, puis les acheteurs ont repris le contrôle.<br />
              Pour une pin bar bearish, la mèche haute est longue et le corps est en bas. Les acheteurs ont poussé, puis les vendeurs ont rejeté le mouvement.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              <span className="font-semibold text-zinc-200">3. La mèche dépasse clairement du contexte.</span><br />
              Elle doit sortir d&apos;un niveau, d&apos;un range, ou d&apos;une zone testée. Si elle reste noyée au milieu des bougies, le signal est faible.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Un pin bar n&apos;est pas juste une bougie avec une mèche. C&apos;est une tentative ratée de cassure.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « Le pin bar n&apos;est pas une bougie. C&apos;est l&apos;écho d&apos;un combat où un camp a perdu après avoir cru gagner. »
              </p>
            </div>
          </section>

          {/* Bloc 2 — Conditions d'application */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Conditions d&apos;application : où chercher un pin bar valide</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Un pin bar ne se cherche pas partout. Il se cherche là où le marché a une raison de réagir.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">1. Sur un support clé pour une pin bar bullish.</span><br />
              Le prix descend sur une zone défendue, casse brièvement, puis remonte. Les acheteurs absorbent la pression.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">2. Sur une résistance clé pour une pin bar bearish.</span><br />
              Le prix pousse au-dessus d&apos;une zone importante, échoue, puis clôture plus bas. Les vendeurs reprennent la main.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">3. Sur un retracement Fibonacci 0.5 ou 0.618 dans une tendance saine.</span><br />
              Le marché respire, revient sur une zone logique, puis rejette le niveau.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              <span className="font-semibold text-zinc-200">4. En timeframe (unité de temps du graphique) H1, H4 ou Daily.</span><br />
              En M1 ou M5, le bruit domine. Beaucoup de mèches ne sont que des micro-chasses au stop. À éviter à ce stade. M15 et M30 sont OK pour de l&apos;intraday actif, mais demandent plus d&apos;expérience pour filtrer les faux signaux.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Un pin bar au milieu de nulle part ne vaut rien.<br />
              Pas de niveau, pas de tendance, pas de contexte = pas de setup.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm">
              Le pin bar est un signal de confirmation. Jamais un signal isolé.
            </p>
          </section>

          {/* Bloc 3 — Setup d'entrée + SL + TP + R/R */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Setup d&apos;entrée + SL + TP + R/R</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Pour une pin bar bullish, la logique est simple. L&apos;inverse s&apos;applique pour une pin bar bearish.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Entry / Entrée = prix où tu rentres dans le trade.</span>
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Méthode 1 : entrée agressive.<br />
              Tu entres à la cassure du high de la pin bar. Le marché confirme qu&apos;il repart dans le sens du rejet.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Méthode 2 : entrée conservatrice.<br />
              Tu attends le close de la bougie suivante. Si elle confirme le mouvement, tu entres avec plus de sécurité, mais souvent plus tard.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">SL (Stop Loss) = prix où tu coupes ta perte.</span>
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Sur XAU/USD : SL 30 à 60$ sous le low de la mèche.<br />
              Sur EUR/USD : SL 10 à 20 pips sous le low de la mèche.<br />
              Sur indices ou crypto : SL 0,5 à 1% sous le low de la mèche.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Règle non négociable : le SL doit être sous la mèche. Jamais au milieu.<br />
              Si ton SL est dans la mèche, tu te fais sortir par le bruit.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">TP (Take Profit) = prix où tu prends tes gains.</span>
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Tu vises le prochain niveau clé : résistance, ancien high, zone de liquidité.<br />
              R/R (Risk-Reward) = ratio entre ce que tu risques et ce que tu peux gagner.<br />
              Minimum : 1:2. Tu risques 1 pour viser 2.<br />
              Idéal : 1:3 si la structure le permet.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm">
              Gestion : quand le prix atteint 1R, tu peux passer break-even (BE = SL déplacé au prix d&apos;entrée).<br />
              À partir de là, tu ne risques plus rien sur le trade.
            </p>
          </section>

          {/* Intro visuel + PinBarSetupDiagram */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Le schéma suivant montre une pin bar bullish sur support, avec une entrée, un SL et un TP. Ne mémorise pas les chiffres. Comprends la géométrie : la mèche rejette le niveau, l&apos;entrée se place après confirmation, le SL protège sous l&apos;excès, le TP vise le prochain niveau logique.
            </p>
            <div className="border border-zinc-800 rounded-xl overflow-hidden">
              <PinBarSetupDiagram />
            </div>
          </section>

          {/* Encadré ET TOI, RETAIL ? */}
          <div className="border border-emerald-500/20 bg-emerald-500/5 rounded-xl p-6 my-8">
            <p className="text-emerald-400 uppercase tracking-widest text-xs font-bold mb-4">ET TOI, RETAIL ?</p>
            <div className="text-zinc-300 leading-relaxed space-y-3">
              <p>
                Tu as 600€ sur ton compte XTB. Samedi matin 10h, tu as une heure devant toi avant de sortir. Tu ouvres ton chart XAU/USD H1. Le prix descend depuis 2 jours et s&apos;approche du support psychologique 4 500$ — un niveau que le marché a déjà respecté plusieurs fois dans le passé.
              </p>
              <p>
                Une bougie H1 arrive avec une grosse mèche basse qui pique sous les 4 500$ et un corps haussier qui clôture au-dessus. C&apos;est ton pin bar : le marché a testé le niveau, il l&apos;a refusé. Les vendeurs n&apos;ont pas tenu.
              </p>
              <p>
                Concrètement : entrée 4 520$, SL 4 470$, TP 4 650$. Tu risques 6€ (1% de 600€), tu peux gagner 16€. Tu coupes ton chart, tu sors. Tu vérifieras dans la journée.
              </p>
            </div>
          </div>

          {/* Bloc 5 — Filtres */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Filtres : quand NE PAS prendre le setup</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">1. Pin bar au milieu d&apos;un range sans niveau clé.</span><br />
              Pas valide. Dans un range (marché latéral, sans tendance claire), les mèches sont fréquentes. Sans support, résistance ou zone claire, tu lis du bruit.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">2. Pin bar avec une mèche trop courte.</span><br />
              Si la mèche fait moins de 2x le corps, ce n&apos;est pas un vrai pin bar. C&apos;est une bougie normale avec une mèche visible. Pas assez de rejet.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">3. Pin bar contre une tendance forte.</span><br />
              Très risqué. Si le marché chute violemment, prendre une pin bar bullish revient à attraper un couteau qui tombe. Privilégie les pin bars dans le sens de la tendance dominante.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              <span className="font-semibold text-zinc-200">4. Pin bar juste avant une news rouge majeure.</span><br />
              NFP, FOMC, CPI : le signal technique devient secondaire. La macro peut balayer ton setup en quelques secondes. Ce filtre est détaillé dans le module 8 — Macro Trading.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Un setup propre peut devenir mauvais à cause du contexte.<br />
              La qualité d&apos;un pin bar dépend autant de l&apos;endroit que de sa forme.
            </p>
          </section>

          {/* Bloc 6 — Exemple chiffré */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Exemple chiffré sur XAU/USD H4</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Contexte : XAU/USD consolide après un repli depuis les sommets. Le prix teste pour la deuxième fois le support psychologique des 4 500$ sur H4.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Lecture de la pin bar :</span>
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              La bougie pousse jusqu&apos;à 4 480$.<br />
              C&apos;est le low de la mèche basse.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Le corps clôture à 4 510$.<br />
              Le corps est petit et bullish.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              La mèche basse fait environ 30$.<br />
              Le corps fait environ 10$.<br />
              La mèche est donc 3x plus longue que le corps. Critère validé.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              La bougie apparaît juste au-dessus d&apos;un support psychologique fort.<br />
              Le contexte est propre. Le rejet a du sens.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Setup :</span>
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Entrée : 4 520$, à la cassure du high de la pin bar.<br />
              Stop Loss : 4 470$, soit 10$ sous le low de la mèche.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Ici on serre à 10$ car le support psychologique 4 500$ est très net — on accepte un SL plus tendu sur cette structure. La fourchette générale 30 à 60$ reste la référence, mais une zone très claire permet de réduire le risque.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Take Profit : 4 650$, prochaine résistance H4 identifiée.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Calcul du R/R :</span>
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Risque = 4 520$ - 4 470$ = 50$.<br />
              Gain potentiel = 4 650$ - 4 520$ = 130$.<br />
              R/R = 130 / 50 = 2,6.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Tu risques 50$ pour viser 130$.<br />
              Si tu as tort, la perte est limitée.<br />
              Si tu as raison, le gain est asymétrique.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm">
              C&apos;est ça un setup propre : lecture claire, invalidation claire, objectif clair.
            </p>
            <h3 className="text-base font-semibold text-zinc-200 mb-2 mt-5">Calcul retail</h3>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Tu risques 1% de ton capital par trade.
            </p>
            <ul className="text-zinc-300 leading-relaxed text-sm mb-3 space-y-1 list-disc list-inside">
              <li>Compte 500€ → tu risques 5€, gain potentiel 13€</li>
              <li>Compte 1 000€ → tu risques 10€, gain potentiel 26€</li>
              <li>Compte 2 500€ → tu risques 25€, gain potentiel 65€</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">
              Le calcul est universel : peu importe la taille de ton compte, le R/R reste 2,6:1. Ce qui change, c&apos;est la taille de lot.
            </p>
          </section>

          {/* ── Séparateur révision ── */}
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Révision</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          <LessonKeyPoints
            points={[
              "Pin bar = mèche 2x plus longue que le corps + corps à l'opposé",
              "Toujours sur un niveau clé ou un retracement, jamais au milieu de nulle part",
              "SL sous la mèche, entrée au-dessus du corps, TP au prochain niveau",
              "R/R minimum 1:2, idéalement 1:3",
              "Filtres impératifs : pas en M5/M15, pas contre-tendance forte, pas avant une news rouge",
            ]}
          />

          <LessonExercice
            description="Mets en pratique la lecture des bougies sur un graphique réel."
            steps={[
              "Ouvrir un graphique XAU/USD ou EUR/USD en timeframe H4",
              "Identifier 2 pin bars sur l'historique des 30 derniers jours et noter à quel niveau elles sont apparues",
              "Pour chaque pin bar trouvée, calculer le R/R potentiel si tu avais tradé le setup : entrée, SL sous la mèche, TP au prochain niveau",
              "Repérer 1 pin bar invalide au milieu d'un range, contre-tendance ou avec une mèche trop courte, puis expliquer pourquoi tu ne la prendrais pas",
              "Vérifier sur le calendrier économique si une de ces pin bars était proche d'une news rouge, puis observer ce qui s'est passé",
            ]}
          />

          <LessonQuiz
            question="Tu vois sur ton chart H4 XAU/USD une pin bar bullish avec une mèche basse de 25$ et un corps bullish de 8$. Elle se forme à 4 510$, juste au-dessus d'un support psychologique connu à 4 500$. Le NFP sort dans 2 heures. Que fais-tu ?"
            options={[
              "Tu entres immédiatement avec un SL serré pour profiter du momentum",
              "Tu prends le setup mais avec une size réduite à cause de la news",
              "Tu attends que la news soit passée puis tu réévalues le setup",
              "Tu ignores complètement le setup, le pin bar n'est pas valide à ce ratio mèche/corps",
            ]}
            correctIndex={2}
            explanation="Le pin bar est techniquement valide : mèche de 25$ contre corps de 8$, donc ratio supérieur à 3x. Il est aussi bien placé, juste au-dessus d'un support psychologique. Mais le NFP dans 2 heures invalide la prise immédiate, car la macro peut écraser le signal technique. La règle propre : tu attends la news, tu laisses le marché absorber le choc, puis tu réévalues le setup."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "price-action", "lecon2");
                  setDone(true);
                }}
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
                  <p className="text-xs text-zinc-500 mt-0.5">Leçon 2 du module Price Action complétée.</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/strategies/price-action/lecon1"
                className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="text-zinc-600">
                  <path d="M9.5 3.5l-4 4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Leçon 1 — Lire une bougie : corps, mèche, signal
              </Link>
              <span className="inline-flex items-center gap-2 text-sm text-zinc-700 cursor-not-allowed">
                Leçon 3 — Engulfing — le retournement de force
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-600 border border-zinc-700">
                  Bientôt
                </span>
              </span>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
