"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import TrendlineMADiagram from "@/app/components/charts/TrendlineMADiagram";
import MMHierarchyStackDiagram from "@/app/components/charts/MMHierarchyStackDiagram";
import TrendlineWrongDrawingDiagram from "@/app/components/charts/TrendlineWrongDrawingDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Reconnaître une tendance (HH/HL vs LH/LL)", disabled: false },
  { id: "lecon2", title: "Trendline et moyennes mobiles : tracer la tendance", disabled: false },
  { id: "lecon3", title: "Leçon 3",          disabled: true },
  { id: "lecon4", title: "Leçon 4",          disabled: true },
];

export default function ContentFr() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "trend-following", "lecon2"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Stratégies</Link>
          <span>/</span>
          <Link href="/strategies/trend-following" className="hover:text-zinc-400 transition-colors">Trend Following</Link>
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
            <span className="text-xs text-zinc-600">15 min</span>
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
            Trendline et moyennes mobiles : tracer la tendance
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Cette leçon enseigne à tracer une trendline tradable, à lire les MM20/MM50/MM200 en combinaison, et à exploiter la confluence trendline + MM.
            </p>
          </div>

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
                    {isCurrent ? (
                      <>
                        <span className="md:hidden">Leçon {lesson.id.replace("lecon", "")}</span>
                        <span className="hidden md:inline">{lesson.title}</span>
                      </>
                    ) : (
                      lesson.title
                    )}
                  </span>
                </div>
              );
            })}
            <span className="ml-auto text-xs text-zinc-600">2 / 4 leçons</span>
          </div>
        </header>

        <div className="space-y-8">

          {/* Bloc 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « La tendance se lit dans la structure. Trendlines et moyennes mobiles la rendent visible au pixel près. »
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prérequis</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Reconnaître une tendance → cf. Stratégie TF L1</li>
              <li>- Notion de trendline → cf. Formation Trading L3</li>
              <li>- MM20 / MM50 / MM200 → cf. Formation Trading L4</li>
            </ul>
          </div>

          {/* Bloc 3 — TRACER UNE TRENDLINE + MM */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Tracer une trendline + MM</h2>

            <div className="my-8">
              <TrendlineMADiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              La trendline et la MM50 forment une zone défendue dynamique. La confluence des deux multiplie la fiabilité du signal d&apos;entrée sur rebond.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Trendline haussière : reliée aux HL successifs (3 points minimum)</li>
              <li>- Trendline baissière : reliée aux LH successifs (3 points minimum)</li>
              <li>- Pente exploitable : entre 20° et 60° (sous 20° = faible, au-delà 60° = irréaliste)</li>
              <li>- MM20 = dynamique courte, MM50 = référence intermédiaire, MM200 = biais long terme</li>
            </ul>
          </section>

          {/* Bloc 4 — LIRE LES 3 MM EN COMBINAISON */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Lire les 3 MM en combinaison</h2>

            <div className="my-8">
              <MMHierarchyStackDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              L&apos;ordre relatif des 3 MM (MM20, MM50, MM200) signale le biais directionnel global. La hiérarchie détermine le sens des setups autorisés.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Golden cross : MM20 &gt; MM50 &gt; MM200, ascendantes → biais long, setups long uniquement</li>
              <li>- Death cross : MM20 &lt; MM50 &lt; MM200, descendantes → biais short, setups short uniquement</li>
              <li>- Range : 3 MM enchevêtrées, pente nulle → pas de biais, attendre clarification</li>
              <li>- Setup contraire au biais MM200 = taux de réussite réduit, à éviter sans confluence exceptionnelle</li>
            </ul>
          </section>

          {/* Bloc 5 — ERREURS DE TRACÉ FRÉQUENTES */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Erreurs de tracé fréquentes</h2>

            <div className="my-8">
              <TrendlineWrongDrawingDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Une trendline forcée perd toute valeur opérationnelle. 3 erreurs de tracé dégradent systématiquement la fiabilité du signal.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- 2 points isolés ignorent les autres pivots = trendline arbitraire</li>
              <li>- Pente irréaliste (&gt; 60°) = impulsion non durable, retournement rapide attendu</li>
              <li>- Cassure ignorée = trendline prolongée alors qu&apos;elle a perdu sa validité</li>
            </ul>
          </section>

          {/* Bloc 6 — PLAN DE TRADE CHIFFRÉ */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan de trade : confluence EUR/USD H4</h2>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              EUR/USD en tendance haussière confirmée sur H4 et Daily (prix au-dessus de la MM200 H4 depuis 6 semaines). Trendline haussière sur 3 HL (1.1680, 1.1720, 1.1755), pente modérée 35°. MM50 H4 à 1.1770. Confluence trendline + MM50 dans la zone 1.1768-1.1775. Pin bar haussière au contact.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Setup (trade long sur rebond confluence)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Entrée long : 1.1778 (clôture de la pin bar)</li>
                <li>- Stop loss : 1.1750 (10 pips sous la mèche basse à 1.1762)</li>
                <li>- Take profit niveau 1 : 1.1820 (HH précédent), niveau 2 : 1.1860 (extension)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Calcul du R/R</p>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>- Risque : 1.1778 - 1.1750 = 28 pips</li>
                <li>- Gain niveau 1 : 42 pips → R/R 1,50</li>
                <li>- Gain niveau 2 : 82 pips → R/R 82/28 = 2,93</li>
                <li>- Le setup vise prioritairement le TP niveau 2</li>
              </ul>
            </div>

            <p className="text-white font-semibold text-sm mb-2">Calcul retail</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-3">
              <li>- Compte 300€ → 5% = risque 15€, gain potentiel 44€</li>
              <li>- Compte 500€ → 3% = risque 15€, gain potentiel 44€</li>
              <li>- Compte 1 000€ → 2% = risque 20€, gain potentiel 59€</li>
              <li>- Compte 2 500€ → 2% = risque 50€, gain potentiel 147€</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">
              Le R/R reste 2,93:1 peu importe la taille du compte.
            </p>
          </section>

          <LessonKeyPoints
            points={[
              "Une trendline tradable s’appuie sur 2 points minimum (3 idéalement), avec une pente entre 20° et 60°.",
              "MM20 = dynamique courte. MM50 = référence intermédiaire. MM200 = biais structurel long terme.",
              "La confluence trendline + MM50 crée une zone défendue par 2 références dynamiques distinctes.",
              "Respecter le biais MM200 : trade long au-dessus, trade short en dessous. Aucune entrée sans signal de rejet.",
            ]}
          />

          <LessonExercice
            description="Sur XAU/USD H4 en tendance baissière confirmée, le prix évolue sous la MM200 H4 à 4 720$. Une trendline baissière a été tracée sur 3 LH successifs à 4 680$, 4 650$ et 4 620$. La MM50 H4 est actuellement à 4 605$. Le prix remonte vers 4 600$. Quel est le statut du setup et quel plan théorique ?"
            steps={[
              "Valider la trendline baissière : 3 LH confirmés à 4 680$, 4 650$, 4 620$, trendline tradable",
              "Identifier la confluence : MM50 H4 à 4 605$ + trendline qui passe à 4 600$ = zone de confluence 4 600$-4 605$",
              "Vérifier le biais MM200 H4 : prix sous 4 720$ = biais short aligné, setup conforme",
              "Attendre le signal de rejet baissier (pin bar haute, engulfing baissière) au contact de la zone 4 600$-4 605$ pour valider l’entrée",
              "Construire le plan : entrée short à la clôture du signal, stop loss à 4 615$ (10$ au-dessus de la MM50), take profit à 4 555$ (LL précédent, niveau 1) ou 4 510$ (extension baissière, niveau 2). Taille de position selon le risque par trade adapté au capital",
            ]}
          />

          <LessonQuiz
            question="Le prix touche la MM50 H4 sur EUR/USD sans signal de rejet explicite (pas de pin bar, pas d’engulfing), dans une tendance haussière confirmée. Quel est le verdict opérationnel ?"
            options={[
              "Setup exploitable, le simple contact avec la MM50 suffit",
              "Setup invalide, l’absence de signal de rejet disqualifie l’entrée",
              "Setup exploitable à condition d’un volume élevé",
              "Indéterminé sans confirmation Fibonacci",
            ]}
            correctIndex={1}
            explanation="Le contact avec une MM ne déclenche pas automatiquement une entrée. Un signal de price action explicite (pin bar de rejet, engulfing dans le sens de la tendance, ou réaction immédiate sans pénétration significative) doit confirmer le rebond. Sans signal, la MM peut être traversée sans rebond significatif, surtout en tendance modérée. Le trade pris sur simple contact se retrouve fréquemment en perte."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "trend-following", "lecon2");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Leçon 2 du module Trend Following complétée.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <Link href="/strategies/trend-following/lecon1" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Leçon 1
              </Link>
              <span className="inline-flex items-center gap-2 text-sm text-zinc-700 cursor-not-allowed">
                Leçon 3. À venir
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
