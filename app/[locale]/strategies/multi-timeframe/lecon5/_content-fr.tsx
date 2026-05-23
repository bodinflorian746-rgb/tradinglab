"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { ProcessFunnelDiagram } from "@/app/components/charts/ProcessFunnelDiagram";
import { DailyContextDiagram } from "@/app/components/charts/DailyContextDiagram";
import { H1ZonePreparationDiagram } from "@/app/components/charts/H1ZonePreparationDiagram";
import { M15ValidationDiagram } from "@/app/components/charts/M15ValidationDiagram";

const LESSONS = [
  { id: "lecon1", title: "Pourquoi analyser en multi-timeframe", disabled: false },
  { id: "lecon2", title: "Le timeframe supérieur : le biais", disabled: false },
  { id: "lecon3", title: "Le timeframe intermédiaire : la zone", disabled: false },
  { id: "lecon4", title: "Le timeframe d’exécution : l’entrée", disabled: false },
  { id: "lecon5", title: "Le process complet", disabled: false },
];

export default function ContentFr() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "multi-timeframe", "lecon5"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Stratégies</Link>
          <span>/</span>
          <Link href="/strategies/multi-timeframe" className="hover:text-zinc-400 transition-colors">Multi-timeframe Process</Link>
          <span>/</span>
          <span className="text-zinc-500">Leçon 5</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Intermédiaire
            </span>
            <span className="text-zinc-700 text-xs">·</span>
            <span className="text-xs text-zinc-600">20 min</span>
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
            Le process multi-timeframe complet : du Daily à l&apos;exécution
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Les traders perdants cherchent une entrée. Les traders structurés construisent un scénario avant même de penser à cliquer.
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
              const isCurrent = lesson.id === "lecon5";
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
            <span className="ml-auto text-xs text-zinc-600">5 / 5 leçons</span>
          </div>
        </header>

        <div className="space-y-8">

          {/* Bloc 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-blue-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « Un trade gagnant n&apos;est pas une bonne entrée. C&apos;est un scénario qui s&apos;est aligné du haut vers le bas. »
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prérequis</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Introduction multi-timeframe → cf. Leçon 1</li>
              <li>- Direction dominante HTF → cf. Leçon 2</li>
              <li>- Zones d&apos;intérêt H1-H4 → cf. Leçon 3</li>
              <li>- Confirmation LTF → cf. Leçon 4</li>
            </ul>
          </div>

          {/* Bloc 3 — LE PROCESS COMPLET */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Le process complet en un coup d&apos;œil</h2>

            <div className="my-8">
              <ProcessFunnelDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Le process multi-timeframe fonctionne comme un entonnoir : chaque étage filtre le suivant et réduit les possibilités. Daily / H4 → donner la direction ; H1 → identifier la zone d&apos;intérêt ; M15 / M30 → attendre la réaction et confirmer. Le trade n&apos;arrive qu&apos;au bout — c&apos;est l&apos;aboutissement d&apos;une chaîne logique, pas un signal isolé qu&apos;on attrape au vol.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- L&apos;analyse descend toujours du HTF vers le LTF, jamais l&apos;inverse</li>
              <li>- Chaque étage répond à une question précise : où va le marché, où il peut réagir, quand entrer</li>
              <li>- Un trade aligné sur les trois étages est rare — mais c&apos;est précisément ce qui en fait un setup haute probabilité</li>
              <li>- Sauter un étage = improviser ; le process protège contre l&apos;impulsivité</li>
            </ul>
          </section>

          {/* Bloc 4 — LE DAILY DONNE LA DIRECTION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Le Daily donne la direction</h2>

            <div className="my-8">
              <DailyContextDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Le Daily (ou H4) est l&apos;étage du contexte. Il répond à une seule question : dans quel sens le marché évolue-t-il sur plusieurs jours ou semaines ? La lecture se fait via la structure : Lower Highs / Lower Lows pour une tendance baissière, Higher Highs / Higher Lows pour une hausse. Les impulsions sont fortes et étendues dans le sens dominant, les corrections sont molles et limitées dans le sens opposé. Ce biais conditionne tout ce qui suit — on ne prendra des ventes que dans un contexte HTF baissier, des achats que dans un contexte HTF haussier.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Exemple concret</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD : sur Daily, trois LH consécutifs (1.1860, 1.1830, 1.1780) sous la résistance 1.1860, avec des impulsions baissières franches entre chaque correction. Le biais est clairement vendeur — toute idée d&apos;achat est écartée d&apos;office. On cherchera des shorts au retour du prix dans une zone supérieure.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Le HTF (Daily / H4) impose la direction des trades possibles</li>
              <li>- Structure LH/LL = vente uniquement ; HH/HL = achat uniquement</li>
              <li>- Tant que la structure HTF n&apos;est pas cassée, le biais reste le même</li>
              <li>- Trader contre le biais HTF = trader à contre-courant sans nécessité</li>
            </ul>
          </section>

          {/* Bloc 5 — LE H1 PRÉPARE LA ZONE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Le H1 prépare la zone</h2>

            <div className="my-8">
              <H1ZonePreparationDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Une fois la direction posée, le H1 localise la zone précise où le scénario peut s&apos;activer. Ces zones sont tracées à l&apos;avance — anciens supports devenus résistances, FVG non mitigés, blocs d&apos;ordres bearish, confluences. Le prix les approche en général en ralentissant : les bougies deviennent plus courtes, l&apos;élan diminue. Cette zone reste inerte tant que le prix ne l&apos;a pas réellement testée — elle ne déclenche aucun trade en soi, elle prépare le terrain.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Exemple concret</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD : à 1.1750-1.1760, un ancien support cassé se superpose à une FVG bearish non mitigé laissé par la dernière impulsion baissière. La zone est tracée sur le H1, dans le sens du biais Daily. Le prix remonte progressivement avec des bougies de plus en plus courtes en s&apos;approchant de 1.1760 — le terrain est prêt, on attend la réaction.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Une zone H1 se trace à l&apos;avance, jamais a posteriori</li>
              <li>- Plus la zone est confluente (FVG + ancien support + bloc d&apos;ordres) plus elle est forte</li>
              <li>- La zone ne déclenche rien — elle prépare l&apos;hypothèse de trade</li>
              <li>- Le ralentissement du prix à l&apos;approche est un signe d&apos;intérêt, pas un signal d&apos;entrée</li>
            </ul>
          </section>

          {/* Bloc 6 — LE M15 VALIDE L'EXÉCUTION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Le M15 valide l&apos;exécution</h2>

            <div className="my-8">
              <M15ValidationDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Le M15 est l&apos;étage du timing. Quand le prix entre dans la zone H1, on descend sur le LTF pour observer la réaction : mèches de rejet successives, formation d&apos;un sommet local, puis cassure structurelle d&apos;un creux récent en faveur du biais. Ce sont ces signaux concrets qui valident l&apos;entrée — pas la simple présence du prix dans la zone. L&apos;exécution se fait à la cassure, le SL est calé serré juste au-dessus du dernier sommet de rejet.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Exemple concret</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD : le prix arrive dans la zone 1.1750-1.1760 et imprime trois mèches hautes consécutives entre 1.1758 et 1.1762, sans clôturer au-dessus. Le dernier creux local entre les bougies de rejet est à 1.1750. Trois bougies M15 baissières enchaînent et cassent ce creux franchement vers 1.1745. La réaction est nette, la cassure confirme — entrée short à 1.1758 sur la cassure, SL à 1.1772 (juste au-dessus du dernier sommet de rejet).
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Le M15 ne sert pas à analyser le marché — il sert à confirmer une hypothèse construite plus haut</li>
              <li>- Mèche de rejet + cassure de creux local = combo classique de validation</li>
              <li>- Le SL serré exige une structure locale claire (sommet de rejet)</li>
              <li>- Aucune réaction = aucune entrée — la zone échoue, on attend la suivante</li>
            </ul>
          </section>

          {/* Bloc 7 — PLAN D'APPLICATION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan d&apos;application : un cas EUR/USD complet</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Voici un trade short EUR/USD déroulé du Daily à l&apos;exécution, étape par étape. Chaque étage joue son rôle distinct et conduit naturellement au suivant.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Étape 1 — Daily : direction</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation : structure LH/LL franche depuis trois semaines, résistance Daily à 1.1860</li>
                <li>- Conclusion : biais baissier confirmé — uniquement des shorts à privilégier</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Étape 2 — H1 : zone</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation : zone confluente 1.1750-1.1760 (ancien support cassé + FVG bearish non mitigé)</li>
                <li>- Conclusion : zone tracée à l&apos;avance, prête à recevoir le prix ; scénario short préparé au retour</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Étape 3 — M15 : confirmation</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation : prix dans la zone, trois mèches hautes consécutives, cassure du creux local à 1.1748</li>
                <li>- Conclusion : la réaction valide l&apos;entrée — exécution autorisée</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Étape 4 — Exécution</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Entrée short : 1.1758</li>
                <li>- Stop loss : 1.1772 (juste au-dessus du dernier sommet de rejet) — soit 14 pts de risque</li>
                <li>- Take profit : 1.1695 (au niveau du dernier LL Daily) — soit 63 pts de gain potentiel</li>
                <li>- R/R ≈ 1 : 4,5 — setup haute probabilité car aligné Daily + H1 + M15</li>
              </ul>

              <div className="border-t border-zinc-800/60 pt-3 mt-3">
                <p className="text-sm text-zinc-300 italic text-center">
                  Daily = direction · H1 = zone · M15 = timing · Exécution = aboutissement, pas point de départ
                </p>
              </div>
            </div>
          </section>

          {/* Bloc 8 — LES ERREURS QUI DÉTRUISENT LE PROCESS */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Les erreurs qui détruisent le process</h2>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Le process est puissant tant qu&apos;il est respecté dans l&apos;ordre. Le moment où l&apos;on saute un étage, le scénario perd toute sa logique — on retombe dans le trading impulsif. Voici les quatre dérapages typiques.
            </p>

            <div className="grid gap-3 my-6">
              <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-950/60">
                <p className="text-white font-semibold text-sm mb-1.5">1. Commencer directement par M15</p>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Repérer un setup sur M15 puis chercher à le justifier sur les TF supérieurs, c&apos;est inverser le process. On finit par valider mentalement un trade qu&apos;on a déjà décidé de prendre. Le HTF doit toujours venir en premier.
                </p>
              </div>

              <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-950/60">
                <p className="text-white font-semibold text-sm mb-1.5">2. Sauter la zone H1</p>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Avoir un biais Daily et entrer directement sur un signal M15, sans zone H1 tracée à l&apos;avance, c&apos;est trader des signaux isolés. La zone donne le contexte de l&apos;entrée — sans elle, le M15 produit du bruit en permanence.
                </p>
              </div>

              <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-950/60">
                <p className="text-white font-semibold text-sm mb-1.5">3. Entrer sans réaction M15</p>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Le prix touche la zone H1, on entre par anticipation parce que « tout le reste est aligné ». C&apos;est exactement là que la zone échoue le plus souvent. Sans signal LTF clair, l&apos;entrée n&apos;est pas validée — on attend ou on passe.
                </p>
              </div>

              <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-950/60">
                <p className="text-white font-semibold text-sm mb-1.5">4. Trader contre le biais HTF selon le dernier mouvement M15</p>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Biais Daily baissier, mais une « belle » zone de support H1 et un dernier mouvement M15 haussier invitent à un long. Trader contre-tendance sur la base d&apos;un mouvement LTF récent, sans raison structurelle HTF (CHoCH, retournement majeur), revient à parier sur le bruit. Le biais HTF reste prioritaire tant qu&apos;il n&apos;est pas cassé.
                </p>
              </div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "Le process descend toujours du HTF vers le LTF — jamais l’inverse.",
              "Chaque étage a un rôle distinct : Daily = direction, H1 = zone, M15 = timing.",
              "Le M15 valide l’exécution — il confirme la réaction, il ne la prédit pas.",
              "Sauter un étage = retomber dans le trading impulsif : le process protège contre l’improvisation.",
            ]}
          />

          <LessonExercice
            description="Sur TradingView, déroule un process multi-timeframe complet sur la paire de ton choix, du Daily au M15."
            steps={[
              "Daily : identifie la structure (LH/LL ou HH/HL) et conclus un biais directionnel clair. Si la structure est ambiguë, change de paire — sans biais HTF net, le process ne démarre pas.",
              "H1 : trace à l’avance la zone d’intérêt la plus confluente dans le sens du biais (ancien support/résistance, FVG, bloc d’ordres). Note les niveaux exacts en haut et en bas de la zone.",
              "M15 : attends que le prix entre dans la zone, puis observe la réaction. Si une mèche de rejet apparaît suivie d’une cassure structurelle, note l’entrée, le SL serré et le TP visé. Si rien ne se passe, ne force pas — note simplement que la zone a échoué.",
            ]}
          />

          <LessonQuiz
            question="Tu repères un signal M15 net (rejet + cassure) sur EUR/USD, mais sans avoir tracé de zone H1 au préalable et sans avoir vérifié le biais Daily. Que fais-tu ?"
            options={[
              "Tu descends sur M5 pour confirmer plus finement avant d'entrer",
              "Tu entres avec une taille réduite pour limiter le risque",
              "Tu prends l'autre sens, en supposant que le signal annonce un faux mouvement",
              "Tu n'entres pas : un signal M15 hors process n'est pas un setup valide",
            ]}
            correctIndex={3}
            explanation="Un signal LTF isolé, sans zone H1 préparée et sans biais Daily aligné, n'est pas un setup multi-timeframe — c'est juste du bruit qu'on a remarqué au vol. Le process exige que les trois étages soient cohérents AVANT le signal d'exécution. Trader un signal M15 hors contexte revient exactement à ce contre quoi le process est conçu : l'impulsivité."
            answerExplanations={[
              "Faux. Descendre encore plus bas (M5) n'ajoute pas le contexte HTF qui manque. Affiner un signal isolé ne le transforme pas en setup — ça augmente juste la précision d'une décision mal cadrée.",
              "Faux. Réduire la taille ne corrige pas le problème de fond : l'absence de contexte HTF. On ne diminue pas un mauvais setup en risquant moins, on le supprime.",
              "Faux. Prendre l'autre sens sur la base d'un seul signal LTF, sans biais structurel ni zone, c'est trader le bruit dans l'autre direction — exactement le même problème.",
              "Correct. Le process exige l'alignement Daily + H1 + M15. Un signal M15 hors process est par définition un signal isolé, qu'on a repéré sans préparation. La discipline est de ne pas trader hors process — la patience permet d'attendre un setup vraiment construit.",
            ]}
          />

          <LessonQuiz
            question="Tu as un biais Daily baissier et une zone H1 à 1.1750-1.1760. Le prix entre dans la zone, mais sur M15, aucune mèche de rejet, aucune cassure de creux local — juste une consolidation latérale. Que fais-tu ?"
            options={[
              "Tu entres : la zone H1 est confluente, la consolidation finira par casser à la baisse",
              "Tu entres au milieu de la zone en pariant sur la moyenne de fluctuation",
              "Tu n'entres pas tant que le M15 ne confirme pas la réaction",
              "Tu places un ordre limite au-dessus de la zone et tu laisses faire",
            ]}
            correctIndex={2}
            explanation="Sans confirmation M15, le process n'est pas complet — peu importe la qualité du Daily et de la zone H1. La consolidation latérale dans la zone n'est ni un rejet ni une cassure ; elle ne valide rien. Le rôle du M15 est précisément de filtrer ce genre de zone qui « aurait pu » fonctionner mais qui ne montre aucun signal concret. Patience."
            answerExplanations={[
              "Faux. « Finira par casser » est une prédiction, pas une observation. Le process se construit sur des signaux concrets, pas sur des projections.",
              "Faux. Entrer au milieu de la zone sans signal LTF est un pari sur la moyenne — exactement le contraire d'un setup confirmé. C'est ce qu'on évite.",
              "Correct. Le M15 doit valider la réaction (mèche de rejet + cassure structurelle). Sans ces signaux, l'étage d'exécution n'est pas franchi — pas d'entrée. Cette discipline protège des zones qui paraissent fortes mais ne réagissent pas.",
              "Faux. Un ordre limite passif transforme un setup non confirmé en automatisme — c'est le pire compromis : on prend le risque sans avoir validé le déclencheur.",
            ]}
          />

          <LessonQuiz
            question="Quel est le rôle exact du Daily dans le process multi-timeframe ?"
            options={[
              "Donner le point d'entrée précis grâce à sa lisibilité",
              "Affiner le timing au niveau M1 et compléter le signal d'exécution",
              "Définir la direction dominante et le sens des trades autorisés",
              "Fournir le SL grâce à des structures larges et stables",
            ]}
            correctIndex={2}
            explanation="Le Daily (ou H4) est l'étage du contexte. Son rôle unique est de définir la direction dominante via la structure (LH/LL ou HH/HL). Cette direction conditionne ensuite quels types de trades sont autorisés sur les étages inférieurs. Le Daily ne donne ni point d'entrée précis (trop large), ni la zone d'exécution (c'est le H1), ni le SL serré (c'est le M15)."
            answerExplanations={[
              "Faux. Le Daily est trop large pour fournir un point d'entrée précis — une bougie Daily représente une amplitude de plusieurs dizaines de pts. L'entrée se prépare sur H1 et se déclenche sur M15.",
              "Faux. Le Daily n'a rien à voir avec le timing fin. Affiner sur M1 relèverait du LTF, et le Daily est précisément à l'opposé de cet étage — il pose le contexte général, pas le déclencheur.",
              "Correct. Le Daily donne le contexte général : structure LH/LL = ventes uniquement, structure HH/HL = achats uniquement. C'est cette direction qui conditionne l'ensemble du process en aval.",
              "Faux. Le SL serré se construit sur la structure locale du M15 (sommet ou creux de rejet). Un SL calé sur une structure Daily serait beaucoup trop large et tuerait le R/R.",
            ]}
          />

        </div>

        {/* Footer */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "multi-timeframe", "lecon5");
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
                  <p className="text-sm font-semibold text-emerald-400">Module Multi-timeframe terminé</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Tu as complété les 5 leçons du module Multi-timeframe Process.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between gap-4">
              <Link href="/strategies/multi-timeframe/lecon4" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Leçon précédente
              </Link>
              <Link href="/strategies/multi-timeframe" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                Retour au module
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
