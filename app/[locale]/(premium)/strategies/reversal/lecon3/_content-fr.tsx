"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import RSIDivergenceDiagram from "@/app/components/charts/RSIDivergenceDiagram";
import DivergenceTypesComparisonDiagram from "@/app/components/charts/DivergenceTypesComparisonDiagram";
import DivergenceWithoutBreakoutDiagram from "@/app/components/charts/DivergenceWithoutBreakoutDiagram";

const LESSONS = [
  { id: "lecon1", slug: "lecon1", title: "Double top / Double bottom : la signature du retournement", duration: "16 min", disabled: false },
  { id: "lecon2", slug: "lecon2", title: "Head & Shoulders : le retournement majeur", duration: "18 min", disabled: false },
  { id: "lecon3", slug: "lecon3", title: "Divergence RSI : quand le momentum trahit la tendance", duration: "17 min", disabled: false },
  { id: "lecon4", slug: "lecon4", title: "Leçon 4", duration: "", disabled: true },
];

export default function ContentFr() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "reversal", "lecon3"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Stratégies</Link>
          <span>/</span>
          <Link href="/strategies/reversal" className="hover:text-zinc-400 transition-colors">Reversal &amp; Retournements</Link>
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
            <span className="text-xs text-zinc-600">17 min</span>
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
            Divergence RSI : quand le momentum trahit la tendance
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Le prix peut continuer à monter ou baisser visuellement alors que le momentum derrière le mouvement commence déjà à faiblir. La divergence RSI sert justement à rendre ce phénomène visible. C&apos;est un signal puissant quand il est bien lu, mais aussi un des pièges classiques des débutants quand il est utilisé sans confirmation.
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
              const isCurrent = lesson.id === "lecon3";
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
            <span className="ml-auto text-xs text-zinc-600">3 / 4 leçons</span>
          </div>
        </header>

        {/* ── Contenu ── */}
        <div className="space-y-8">

          {/* Bloc 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « Le prix peut mentir. Le momentum, rarement. »
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prérequis</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Structure de marché HH/HL/LL/LH → cf. Formation Trading L3</li>
              <li>- Indicateur RSI, oscillateur de momentum → cf. Formation Trading L4</li>
              <li>- Double Top / Head &amp; Shoulders → cf. Stratégie Reversal L1 ou L2</li>
            </ul>
          </div>

          {/* Bloc 3 — POURQUOI ÇA FONCTIONNE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Pourquoi la divergence RSI fonctionne</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Le RSI, ou Relative Strength Index, est un oscillateur qui mesure la force du mouvement entre 0 et 100. Au-dessus de 70, le marché entre en zone de surachat. En-dessous de 30, il entre en zone de survente. Dans cette leçon, la valeur exacte du RSI importe moins que sa direction par rapport au prix.</p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Une divergence apparaît quand le prix et le RSI ne pointent plus dans la même direction. Le prix peut continuer à faire un nouveau plus haut pendant que le RSI baisse. Ou inversement, le prix peut faire un nouveau plus bas pendant que le RSI remonte. Cela montre que la tendance continue visuellement, mais perd de la force en arrière-plan.</p>
            <p className="text-zinc-300 leading-relaxed text-sm">Le RSI mesure le vrai momentum des bougies : leur taille, leur vitesse et leur succession. Quand le prix grimpe vers un nouveau sommet avec des bougies plus faibles et moins agressives, le RSI le détecte immédiatement. C&apos;est un des rares outils capables de montrer une information invisible sur le prix nu. Mais pour un débutant, un signal puissant devient aussi un piège puissant si les filtres ne sont pas respectés.</p>
          </section>

          {/* Bloc 4 — DIVERGENCE BAISSIÈRE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Divergence baissière : tendance haussière qui faiblit</h2>
            <div className="my-8">
              <RSIDivergenceDiagram />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">Une divergence baissière apparaît dans une tendance haussière. Le prix crée deux sommets ascendants, donc deux Higher High. En parallèle, le RSI crée deux sommets descendants, donc deux Lower High. Le prix monte alors que le RSI baisse. C&apos;est le signal que la tendance haussière commence à perdre son momentum.</p>

            <p className="text-zinc-300 leading-relaxed text-sm font-semibold text-zinc-200 mb-2">Les 3 conditions pour qu&apos;une divergence baissière soit valide :</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-4">
              <li>- Une tendance haussière préalable claire avec au moins 2 sommets identifiables</li>
              <li>- Le 2ème sommet du prix doit être strictement plus haut que le 1er</li>
              <li>- Le 2ème sommet du RSI doit être strictement plus bas que le 1er</li>
            </ul>

            <p className="text-zinc-300 leading-relaxed text-sm">Exemple sur XAU/USD. Le prix monte vers un premier sommet à 4 600$, puis redescend vers 4 570$. Ensuite, il repart vers un nouveau sommet à 4 640$, donc un HH. Mais sur le RSI H1, le premier sommet avait atteint 75 alors que le second ne monte qu&apos;à 68. Divergence baissière confirmée.</p>
          </section>

          {/* Bloc 5 — LES 4 TYPES DE DIVERGENCE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Les 4 types de divergence</h2>
            <div className="my-8">
              <DivergenceTypesComparisonDiagram />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">La divergence se décline en 4 types selon le sens du prix et du RSI. Les classiques (baissière + haussière) annoncent un retournement. Les cachées (baissière + haussière) signalent une continuation de la tendance.</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- <span className="text-white font-semibold">Classique baissière</span>, prix HH + RSI LH = retournement baissier potentiel.</li>
              <li>- <span className="text-white font-semibold">Classique haussière</span>, prix LL + RSI HL = retournement haussier potentiel.</li>
              <li>- <span className="text-white font-semibold">Cachée baissière</span>, prix LH + RSI HH = continuation baissière (à éviter pour un débutant).</li>
              <li>- <span className="text-white font-semibold">Cachée haussière</span>, prix HL + RSI LL = continuation haussière (à éviter pour un débutant).</li>
            </ul>
          </section>

          {/* Bloc 6 — DIVERGENCE HAUSSIÈRE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Divergence haussière : tendance baissière qui faiblit</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">Une divergence haussière est le miroir de la divergence baissière. Elle se forme dans une tendance baissière. Le prix crée deux creux descendants, donc deux Lower Low. Pendant ce temps, le RSI crée deux creux ascendants, donc deux Higher Low. Le prix baisse mais le RSI monte. Cela montre que la tendance baissière commence à s&apos;épuiser.</p>

            <p className="text-zinc-300 leading-relaxed text-sm font-semibold text-zinc-200 mb-2">Les 3 conditions restent les mêmes, en miroir :</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-4">
              <li>- Une tendance baissière préalable claire avec au moins 2 creux identifiables</li>
              <li>- Le 2ème creux du prix doit être strictement plus bas que le 1er</li>
              <li>- Le 2ème creux du RSI doit être strictement plus haut que le 1er</li>
            </ul>

            <p className="text-zinc-300 leading-relaxed text-sm">Exemple sur XAU/USD. Le prix descend vers un premier creux à 4 480$, puis remonte vers 4 510$. Ensuite, il repart vers un nouveau creux à 4 450$, donc un LL. Mais sur le RSI H1, le premier creux avait touché 28 alors que le second remonte à 35. Divergence haussière confirmée.</p>
          </section>

          {/* Bloc 7 — LE PIÈGE : DIVERGENCE SANS CASSURE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Le piège : divergence sans cassure</h2>
            <div className="my-8">
              <DivergenceWithoutBreakoutDiagram />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">Une divergence seule, sans cassure de structure, est un piège classique. Tant que le prix continue à respecter sa structure HH/HL ou LH/LL, la tendance reste valide même avec une divergence présente.</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- La divergence signale un essoufflement du momentum, pas un retournement effectif.</li>
              <li>- La cassure du dernier creux ou sommet structurel reste obligatoire pour confirmer le retournement.</li>
              <li>- Sans cassure, le prix peut continuer dans le sens de la tendance malgré la divergence visible.</li>
            </ul>
          </section>

          {/* Bloc 8 — PLAN DE TRADE DIVERGENCE BAISSIÈRE XAU/USD H1 */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan de trade : Divergence baissière XAU/USD H1</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Le contexte de la divergence baissière du Bloc 4 est repris. La tendance reste haussière, le prix imprime un HH à 4 640$ et le RSI forme un LH à 68. La divergence est confirmée. Mais une divergence seule ne suffit jamais pour entrer short. Une confirmation supplémentaire est attendue.</p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">La confirmation classique est la cassure du dernier creux ascendant. Le creux entre les deux sommets se situe à 4 570$. Si le prix clôture une bougie sous 4 570$, la divergence est confirmée par la structure du marché. Ce signal déclenche l&apos;entrée short.</p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">L&apos;entrée short se fait juste sous le creux cassé, à 4 565$. Le SL classique se placerait au-dessus du deuxième sommet à 4 650$, mais cela donne un R/R trop faible. Le SL tactique plus serré se place au-dessus de la mèche du deuxième sommet à 4 605$, soit 40$ de risque. Le TP suit la measured move : hauteur entre le deuxième sommet à 4 640$ et le creux à 4 570$, soit 70$, étendue légèrement à 80$ sous le creux cassé pour obtenir un R/R rond de 2:1.</p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Setup</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Entrée short : 4 565$ (sous le creux cassé)</li>
                <li>- Stop loss : 4 605$ (40$ au-dessus de la mèche du 2ème sommet)</li>
                <li>- Take profit : 4 485$ (80$, measured move étendu)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Calcul du R/R</p>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>- Risque : 4 605 - 4 565 = 40$</li>
                <li>- Gain potentiel : 4 565 - 4 485 = 80$</li>
                <li>- R/R : 80 / 40 = 2:1</li>
                <li>- Setup exploitable.</li>
              </ul>
            </div>
          </section>

          {/* Bloc 9 — CALCUL RETAIL */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Calcul retail</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Le risque par trade s&apos;adapte au capital. Sur ce setup R/R 2:1, voici la répartition selon la taille du compte.</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-3">
              <li>- Compte 300€ → 5% = risque 15€, gain potentiel 30€</li>
              <li>- Compte 500€ → 3% = risque 15€, gain potentiel 30€</li>
              <li>- Compte 1 000€ → 2% = risque 20€, gain potentiel 40€</li>
              <li>- Compte 2 500€ → 2% = risque 50€, gain potentiel 100€</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">Le R/R 2:1 reste solide. La divergence RSI a un win rate moyen quand le pattern est propre et confirmé par la cassure de structure. Sans confirmation, le piège reste élevé.</p>
          </section>

          {/* Bloc 10 — FILTRES : QUAND NE PAS PRENDRE LE SETUP */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Filtres : quand ne pas prendre le setup</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-red-400 font-semibold">1. Divergence sans cassure de structure.</span> <span className="text-zinc-300">Une divergence seule ne suffit jamais. Tant que le prix continue à faire des HH/HL ou des LH/LL, la tendance reste valide. La cassure du dernier creux ou sommet structurel est attendue.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-red-400 font-semibold">2. Divergence sur petit timeframe (M5 ou M15).</span> <span className="text-zinc-300">Les divergences sur très petits timeframes produisent énormément de bruit. Timeframe minimum : H1. H4 reste le plus propre.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-red-400 font-semibold">3. Divergence cachée confondue avec classique.</span> <span className="text-zinc-300">Les divergences cachées servent à détecter une continuation, pas un retournement. Les classiques sont à privilégier en priorité pour leur lisibilité supérieure.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-red-400 font-semibold">4. News majeure dans la fenêtre.</span> <span className="text-zinc-300">Si FOMC, NFP ou CPI arrive dans les 30 minutes, le setup n&apos;est pas pris. Une news peut casser complètement la divergence.</span></div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "Divergence = prix et RSI pointent dans des directions opposées. Divergence baissière = prix HH + RSI LH. Divergence haussière = prix LL + RSI HL.",
              "Une divergence seule ne suffit JAMAIS. La cassure du dernier creux/sommet structurel est attendue pour confirmer.",
              "Minimum H1, idéalement H4. Les divergences sur petits timeframes sont du bruit.",
              "La divergence classique (retournement) se distingue de la divergence cachée (continuation). Pour débuter, seules les classiques sont à trader.",
            ]}
          />

          <LessonExercice
            description="Sur XAU/USD H1 : le prix fait un sommet 1 à 4 720$, redescend à 4 690$, puis fait un sommet 2 à 4 740$. Le RSI affichait 78 au sommet 1 et 72 au sommet 2. Le prix vient de clôturer à 4 685$. Tu prends le setup short ?"
            steps={[
              "Vérifier que le prix forme un HH : 4 740$ > 4 720$, OK",
              "Vérifier que le RSI forme un LH : 72 < 78, OK, divergence baissière confirmée",
              "Confirmer la cassure structurelle : clôture à 4 685$ sous le creux 4 690$, OK",
              "Vérifier qu’aucune news majeure n’est prévue dans les 30 prochaines minutes",
              "Prendre l’entrée short à 4 685$, SL au-dessus de la mèche du sommet 2 (par exemple 4 750$), TP measured move étendu vers 4 585$ pour viser un R/R 1,5 à 2:1",
            ]}
          />

          <LessonQuiz
            question="Une divergence RSI seule est-elle suffisante pour entrer en position ?"
            options={[
              "Oui, c’est un signal fort en soi",
              "Non, il faut une cassure de structure pour confirmer",
              "Oui, mais seulement sur H1",
              "Non, il faut une moyenne mobile en plus",
            ]}
            correctIndex={1}
            explanation="Une divergence seule ne suffit JAMAIS. Tant que le prix continue à respecter sa structure (HH/HL en hausse ou LH/LL en baisse), la tendance reste valide. C’est la cassure du dernier creux/sommet structurel qui confirme et déclenche l’entrée."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "reversal", "lecon3");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Leçon 3 du module Reversal &amp; Retournements complétée.</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-5 flex items-center justify-between">
              <Link href="/strategies/reversal/lecon2" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Leçon 2
              </Link>
              <Link href="/strategies/reversal/lecon4" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                Leçon 4
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M6 4l4 3-4 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
