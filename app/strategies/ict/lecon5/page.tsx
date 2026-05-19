"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { ICTSequenceTimelineDiagram } from "@/app/components/charts/ICTSequenceTimelineDiagram";
import { ICTLiquidityPrepDiagram } from "@/app/components/charts/ICTLiquidityPrepDiagram";
import { ICTDisplacementSetupDiagram } from "@/app/components/charts/ICTDisplacementSetupDiagram";
import { ICTTimingDiagram } from "@/app/components/charts/ICTTimingDiagram";

const LESSONS = [
  { id: "lecon1", title: "Liquidité et manipulation", disabled: false },
  { id: "lecon2", title: "PD Arrays", disabled: false },
  { id: "lecon3", title: "Killzones", disabled: false },
  { id: "lecon4", title: "Displacement", disabled: false },
  { id: "lecon5", title: "Modèle ICT complet", disabled: false },
];

export default function IctLecon5Page() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "ict", "lecon5"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Stratégies</Link>
          <span>/</span>
          <Link href="/strategies/ict" className="hover:text-zinc-400 transition-colors">ICT complet</Link>
          <span>/</span>
          <span className="text-zinc-500">Leçon 5</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">
              Avancé
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
            Le modèle ICT complet : de la liquidité à l&apos;exécution
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Le marché ne produit pas les vrais mouvements au hasard. La majorité des setups ICT suivent une séquence précise : liquidité → manipulation → déplacement → exécution.
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
            <div className="bg-zinc-900 border-l-4 border-amber-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « Un trade ICT n&apos;est pas une réaction à un signal. C&apos;est l&apos;aboutissement d&apos;une séquence qu&apos;on a vue arriver. »
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prérequis</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Liquidité et manipulation → cf. module ICT, Leçon 1</li>
              <li>- PD Arrays et FVG → cf. module ICT, Leçon 2</li>
              <li>- Killzones → cf. module ICT, Leçon 3</li>
              <li>- Displacement → cf. module ICT, Leçon 4</li>
            </ul>
          </div>

          {/* Bloc 3 — LE MODÈLE ICT FONCTIONNE PAR SÉQUENCE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Le modèle ICT fonctionne par séquence</h2>

            <div className="my-8">
              <ICTSequenceTimelineDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Le modèle ICT ne se trade pas par signal isolé : il se trade par séquence. La majorité des trades à haute probabilité enchaînent une suite d&apos;événements structurels qui se construisent les uns sur les autres : un biais HTF qui pose la direction, une liquidité repérée comme cible probable, un sweep qui la prend, un displacement qui valide l&apos;intention, un FVG qui ouvre une fenêtre d&apos;entrée, puis l&apos;exécution sur le retour. Lire la séquence, c&apos;est anticiper le trade — pas le subir.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Le modèle ICT = séquence d&apos;événements, pas signal isolé</li>
              <li>- Chaque étape construit la suivante — sauter une étape brise la lecture</li>
              <li>- Lire la séquence permet d&apos;anticiper l&apos;exécution avant qu&apos;elle arrive</li>
              <li>- Trader hors séquence = retomber dans le pattern réactif</li>
            </ul>
          </section>

          {/* Bloc 4 — LA LIQUIDITÉ PRÉPARE LE MOUVEMENT */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">La liquidité prépare le mouvement</h2>

            <div className="my-8">
              <ICTLiquidityPrepDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              La première étape de toute séquence ICT, c&apos;est la liquidité. Avant qu&apos;un vrai mouvement institutionnel arrive, il faut identifier OÙ se trouve la liquidité visible — equal highs, equal lows, derniers sommets / creux clairement repérables. Cette liquidité est la cible probable du prochain sweep. La séquence ne démarre pas avant que cette poche soit prise : si le prix tourne autour sans la toucher, on attend.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Exemple concret</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD H1 : prix actuel 1.1745, biais Daily baissier, résistance Daily à 1.1780. Deux equal highs visibles à 1.1780 sur les heures précédentes — la liquidité au-dessus de ces sommets est la cible. Le scénario complet attend que cette liquidité soit prise (mèche au-dessus de 1.1780) avant de chercher l&apos;exécution short. Sans sweep, pas de séquence — on patiente.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- La liquidité = équivalent structurel de la cible probable</li>
              <li>- Equal highs / equal lows / derniers sommets-creux = poches visibles</li>
              <li>- Pas de sweep = pas de séquence ; on n&apos;anticipe pas la prise</li>
              <li>- La prise de liquidité est le déclencheur de la phase suivante (manipulation)</li>
            </ul>
          </section>

          {/* Bloc 5 — LE DISPLACEMENT CRÉE LE SETUP */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Le displacement crée le setup</h2>

            <div className="my-8">
              <ICTDisplacementSetupDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Une fois la liquidité prise par le sweep, l&apos;étape critique est le displacement : la séquence de bougies impulsives qui montre que le marché s&apos;est vraiment retourné dans la direction du biais HTF. Sans displacement, le sweep peut être un faux mouvement — le prix sweep, hésite, puis repart dans la direction initiale. AVEC displacement, l&apos;intention institutionnelle est claire et le FVG laissé dans la chute (ou la montée) devient la zone d&apos;exécution. L&apos;entrée se prend au retour du prix dans ce FVG.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Exemple concret</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD : après le sweep à 1.1792, 4 bougies baissières consécutives à grands corps ramènent le prix à 1.1748. Un FVG est laissé entre 1.1768 et 1.1780. Le displacement valide l&apos;intention vendeuse. Le prix remonte ensuite progressivement vers le FVG : entrée short au retour dans la bande, SL au-dessus de 1.1780 (extrémité du displacement), TP vers la prochaine liquidité basse.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Sweep sans displacement = faux mouvement, on n&apos;entre pas</li>
              <li>- Displacement valide l&apos;intention et crée le FVG (zone d&apos;exécution)</li>
              <li>- L&apos;entrée se prend au RETOUR dans le FVG, pas pendant le displacement</li>
              <li>- SL au-dessus de l&apos;extrémité du displacement = structure d&apos;invalidation claire</li>
            </ul>
          </section>

          {/* Bloc 6 — LE TIMING RESTE ESSENTIEL */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Le timing reste essentiel</h2>

            <div className="my-8">
              <ICTTimingDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              La séquence ICT n&apos;a sa pleine valeur qu&apos;en Killzone. Le même enchaînement liquidité → sweep → displacement → FVG peut techniquement se produire en Asia Session, mais avec une probabilité de continuation faible — le volume manque pour soutenir le mouvement. Les séquences à haute probabilité combinent toujours setup ICT ET timing : sweep d&apos;un range Asia en London Open, sweep d&apos;un equal high en NY Open, displacement à l&apos;ouverture d&apos;une Killzone. Sans timing favorable, on attend la prochaine fenêtre.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Exemple concret</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                XAU/USD : range Asia entre 4 642 et 4 655 $. À l&apos;ouverture de London, mèche de sweep au-dessus de 4 655 $, puis displacement bearish de 38 $ qui crée un FVG dans la chute. Setup complet ET en Killzone = setup premium. La même séquence à 03h UTC aurait probablement échoué — le marché manquait de volume pour soutenir le displacement.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Setup ICT + timing Killzone = setup premium</li>
              <li>- Setup ICT hors Killzone = probabilité réduite, déplacements limités</li>
              <li>- Les meilleures séquences se déroulent à l&apos;ouverture de London ou NY</li>
              <li>- Filtrer par timing élimine les setups techniques sans énergie pour aboutir</li>
            </ul>
          </section>

          {/* Bloc 7 — PLAN D'APPLICATION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan d&apos;application : une séquence ICT complète EUR/USD</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Voici la séquence complète, de la lecture du contexte à l&apos;exécution. Six étapes, chacune avec son rôle distinct.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Étape 1 — HTF (Daily) : biais directionnel</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation : EUR/USD Daily en LH/LL, résistance Daily à 1.1780</li>
                <li>- Conclusion : biais baissier — toute la séquence cherchera un short</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Étape 2 — Liquidité (H1) : identifier la cible</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation : deux equal highs visibles à 1.1780, stops accumulés au-dessus</li>
                <li>- Conclusion : la liquidité au-dessus de 1.1780 est la cible probable du prochain sweep</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Étape 3 — Sweep (M15 en Killzone)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation : à l&apos;ouverture NY, mèche à 1.1792 puis réintégration sous 1.1780</li>
                <li>- Conclusion : la liquidité est prise. On attend maintenant le displacement</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Étape 4 — Displacement bearish</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation : 4 bougies M15 baissières consécutives à grands corps, chute jusqu&apos;à 1.1748. FVG visible entre 1.1768 et 1.1780</li>
                <li>- Conclusion : displacement validé, le FVG est la zone d&apos;exécution</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Étape 5 — Retour dans le FVG</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation : sur les heures suivantes, le prix remonte progressivement et rentre dans la bande 1.1768-1.1780</li>
                <li>- Conclusion : zone d&apos;exécution active — on guette la confirmation de rejet</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Étape 6 — Exécution</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation : une bougie M15 de rejet apparaît dans le FVG, suivie d&apos;une bougie baissière impulsive</li>
                <li>- Conclusion : entrée short à 1.1774, SL à 1.1798 (au-dessus de l&apos;extrémité du displacement), TP vers 1.1695. R/R ≈ 1 : 3,3 — séquence ICT complète et alignée</li>
              </ul>

              <div className="border-t border-zinc-800/60 pt-3 mt-3">
                <p className="text-sm text-zinc-300 italic text-center">
                  HTF = biais · Liquidité = cible · Sweep = condition · Displacement = confirmation · FVG = exécution
                </p>
              </div>
            </div>
          </section>

          {/* Bloc 8 — LES ERREURS QUI CASSENT LE MODÈLE ICT */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Les erreurs qui cassent le modèle ICT</h2>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Le modèle est puissant tant qu&apos;il est respecté dans l&apos;ordre. Le moment où l&apos;on saute une étape ou qu&apos;on lit la séquence à l&apos;envers, on retombe dans le trading réactif. Voici les quatre dérapages les plus fréquents.
            </p>

            <div className="grid gap-3 my-6">
              <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-950/60">
                <p className="text-white font-semibold text-sm mb-1.5">1. Entrer sur le sweep seul</p>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Voir une mèche dépasser un equal high et entrer immédiatement, sans attendre le displacement, c&apos;est trader la mèche — exactement le piège que la séquence cherche à éviter. Le sweep n&apos;est qu&apos;une condition préalable ; sans displacement qui suit, c&apos;est juste un faux mouvement.
                </p>
              </div>

              <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-950/60">
                <p className="text-white font-semibold text-sm mb-1.5">2. Sauter le HTF</p>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Repérer un sweep et un displacement sans avoir d&apos;abord posé le biais Daily / H4, c&apos;est confondre setup local et trade. Le HTF dicte la direction des trades autorisés — sans cette lecture, la séquence peut bouger correctement et te placer du mauvais côté du mouvement réel.
                </p>
              </div>

              <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-950/60">
                <p className="text-white font-semibold text-sm mb-1.5">3. Trader hors Killzone</p>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Une séquence techniquement parfaite qui se déroule pendant l&apos;Asia Session a une probabilité de continuation très faible. Le volume manque pour soutenir le displacement, le FVG ne se respecte pas, l&apos;exécution se dilue dans la latéralisation. Setup correct + timing pourri = pas de trade.
                </p>
              </div>

              <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-950/60">
                <p className="text-white font-semibold text-sm mb-1.5">4. Entrer pendant le displacement</p>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Voir le displacement en cours et chercher à monter en marche, c&apos;est rater l&apos;entrée propre et prendre un SL beaucoup trop large. L&apos;entrée ICT se prend au RETOUR dans le FVG, jamais dans la séquence d&apos;impulsion elle-même. La patience entre displacement et retour est ce qui rend le R/R favorable.
                </p>
              </div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "Le modèle ICT est une SÉQUENCE — liquidité, manipulation, déplacement, exécution — pas un signal isolé.",
              "Chaque étape construit la suivante : sauter ou inverser l’ordre brise la lecture du marché.",
              "Le FVG créé par le displacement est la zone d’exécution — on entre au retour, jamais pendant l’impulsion.",
              "Le timing (Killzones) reste essentiel : un setup ICT hors Killzone est statistiquement non rentable.",
            ]}
          />

          <LessonExercice
            description="Sur TradingView, déroule une séquence ICT complète sur la paire de ton choix, du Daily à l&apos;exécution."
            steps={[
              "HTF (Daily) : conclus un biais directionnel clair. Repère sur H1 une poche de liquidité visible dans le sens du biais (equal highs/lows, dernier sommet/creux).",
              "Attends une Killzone (London ou NY Open). Surveille le sweep de la liquidité repérée, puis le displacement qui suit. Si la séquence s&apos;arrête au sweep sans displacement, c&apos;est un faux mouvement — pas de trade.",
              "Trace le FVG laissé par le displacement. Attends le retour du prix dans la bande. Si la réaction confirme (bougie de rejet + impulsion), note l&apos;entrée, le SL au-dessus de l&apos;extrémité du displacement, le TP vers la prochaine liquidité.",
            ]}
          />

          <LessonQuiz
            question="Tu vois sur EUR/USD une mèche qui sweep des equal highs à 1.1780, montant jusqu'à 1.1792. Aucune bougie de displacement bearish ne suit — le prix consolide autour de 1.1782 pendant 6 bougies. Que fais-tu ?"
            options={[
              "Tu entres short immédiatement : le sweep seul est le signal d'entrée du modèle ICT",
              "Tu n'entres pas : sans displacement après le sweep, la séquence ICT n'est pas validée",
              "Tu entres long en supposant que la consolidation va casser à la hausse",
              "Tu places un ordre limite à 1.1780 et tu laisses faire automatiquement",
            ]}
            correctIndex={1}
            explanation="Le sweep n'est qu'une condition préalable de la séquence ICT, pas un signal d'entrée. Sans le displacement bearish qui suit, l'intention institutionnelle n'est pas confirmée — la consolidation au-dessus du niveau balayé suggère même que le sweep pourrait être un faux mouvement. La discipline du modèle est claire : pas de displacement, pas de séquence, pas d'entrée. On attend que le marché parle plus clairement avant d'agir."
            answerExplanations={[
              "Faux. Entrer sur le sweep seul, c'est exactement le piège que la séquence ICT cherche à éviter. Le sweep est une condition, pas un signal — sans displacement, rien ne confirme l&apos;intention vendeuse.",
              "Correct. La séquence ICT exige sweep + displacement + FVG + retour. Si le displacement ne se matérialise pas après le sweep, l&apos;étape suivante manque — la séquence n&apos;est pas validée. La discipline est de ne pas entrer.",
              "Faux. Anticiper la direction d&apos;une consolidation sans signal structurel est de la spéculation pure. Et trader long contre le biais HTF baissier supposé est doublement risqué.",
              "Faux. Placer un ordre limite transforme un setup non confirmé en pari automatique. C&apos;est l&apos;une des pires habitudes — on prend le risque sans avoir vérifié que la séquence se déroule réellement.",
            ]}
          />

          <LessonQuiz
            question="Tu as un setup ICT complet techniquement (sweep, displacement, FVG) sur EUR/USD à 04h UTC en pleine Asia Session. Le prix vient de rentrer dans le FVG. Que fais-tu ?"
            options={[
              "Tu entres : le setup est techniquement validé, peu importe l'heure",
              "Tu entres avec un SL élargi pour absorber la faible liquidité d'Asia",
              "Tu n'entres pas : sans Killzone, le setup ICT a une probabilité de continuation très faible",
              "Tu attends que le prix sorte du FVG puis tu prends la cassure",
            ]}
            correctIndex={2}
            explanation="Le timing est une composante structurelle du modèle ICT, pas un détail secondaire. Une séquence ICT techniquement parfaite hors Killzone manque de volume institutionnel pour soutenir la continuation — le prix dans le FVG peut très bien rester latéral plusieurs heures sans déclencher quoi que ce soit. La discipline ICT consiste à filtrer par timing AVANT d&apos;exécuter, pas à exécuter tout setup techniquement valide. On attend la prochaine Killzone."
            answerExplanations={[
              "Faux. « Peu importe l&apos;heure » contredit le modèle ICT, qui intègre le timing comme une condition structurelle. Un setup techniquement parfait sans timing favorable est statistiquement non rentable.",
              "Faux. Élargir le SL ne corrige pas le problème de fond : le marché manque de volume pour exécuter le scénario. On prend juste plus de risque sur un setup qui ne se déclenchera probablement pas.",
              "Correct. La séquence ICT exige timing ET setup. Hors Killzone, la probabilité que le FVG soit respecté et que la continuation se produise chute drastiquement. La discipline est d&apos;attendre London ou NY pour exécuter.",
              "Faux. « Sortir du FVG » et « prendre la cassure » est une lecture mécanique sans logique structurelle. Le FVG n&apos;est pas un range qu&apos;on trade en cassure — c&apos;est une zone d&apos;entrée sur rejet, pas sur sortie.",
            ]}
          />

          <LessonQuiz
            question="Quelle est l'erreur la plus dangereuse dans l'application du modèle ICT ?"
            options={[
              "Entrer pendant le displacement au lieu d'attendre le retour dans le FVG",
              "Mal mémoriser les horaires exacts des Killzones en UTC",
              "Confondre un FVG bearish et un FVG bullish à l'œil sur le graphique",
              "Utiliser des paires majeures plutôt que des paires exotiques",
            ]}
            correctIndex={0}
            explanation="Entrer pendant le displacement, c&apos;est sauter l&apos;étape critique de la séquence ICT : attendre le retour dans le FVG. Cette erreur a deux conséquences majeures : un SL beaucoup plus large (puisqu&apos;on entre au milieu d&apos;une impulsion en cours) et un R/R catastrophique. La logique du modèle est de patienter entre le displacement et le retour pour obtenir une entrée serrée avec un SL structurel — sauter cette patience, c&apos;est inverser le rapport risque/rendement de toute la séquence."
            answerExplanations={[
              "Correct. C&apos;est l&apos;erreur la plus coûteuse car elle ruine le R/R du setup. Entrer au milieu du displacement = SL trop large + entrée trop tardive. L&apos;ICT impose la patience : on attend le retour dans le FVG.",
              "Faux. Les horaires exacts peuvent être consultés sur n&apos;importe quel terminal. Ce n&apos;est pas une erreur structurelle, c&apos;est un détail technique facile à corriger.",
              "Faux. La distinction bearish/bullish d&apos;un FVG vient de la direction du déplacement qui l&apos;a créé — pas d&apos;une lecture à l&apos;œil. C&apos;est une compréhension du concept, pas une erreur d&apos;application.",
              "Faux. Le choix de la paire est une préférence personnelle, pas une erreur de modèle. Les paires majeures sont simplement plus liquides et offrent des séquences plus propres.",
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
                  markLessonComplete(p, "ict", "lecon5");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Leçon 5 du module ICT complet complétée.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between gap-4">
              <Link href="/strategies/ict/lecon4" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Leçon précédente
              </Link>
              <Link href="/strategies/ict" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
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
