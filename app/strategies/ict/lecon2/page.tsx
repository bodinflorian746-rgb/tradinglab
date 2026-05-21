"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { PDArrayContextDiagram } from "@/app/components/charts/PDArrayContextDiagram";
import { FVGMitigationDiagram } from "@/app/components/charts/FVGMitigationDiagram";
import { FVGMitigationScenariosDiagram } from "@/app/components/charts/FVGMitigationScenariosDiagram";
import { PDArrayConfluenceDiagram } from "@/app/components/charts/PDArrayConfluenceDiagram";

const LESSONS = [
  { id: "lecon1", title: "Liquidité et manipulation", disabled: false },
  { id: "lecon2", title: "PD Arrays", disabled: false },
  { id: "lecon3", title: "Killzones", disabled: false },
  { id: "lecon4", title: "Displacement", disabled: false },
  { id: "lecon5", title: "Modèle ICT complet", disabled: false },
];

export default function IctLecon2Page() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "ict", "lecon2"));
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
          <span className="text-zinc-500">Leçon 2</span>
        </nav>

        {/* Header */}
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
            PD Arrays : repérer les zones où le marché peut réagir
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Le marché ne réagit pas partout. Certaines zones concentrent naturellement plus de réactions, de rejets et de déplacements.
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
            <span className="ml-auto text-xs text-zinc-600">2 / 5 leçons</span>
          </div>
        </header>

        <div className="space-y-8">

          {/* Bloc 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-amber-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « Le marché ne s&apos;arrête pas n&apos;importe où. Il s&apos;arrête là où il a une raison structurelle de le faire. »
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS + INTRO */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prérequis</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Liquidité et manipulation → cf. module ICT, Leçon 1</li>
              <li>- FVG et Order Blocks → cf. module SMC, leçons « Order Blocks : identifier les zones institutionnelles » et « FVG et liquidité : trader le déséquilibre institutionnel »</li>
              <li>- Multi-timeframe → cf. module Multi-timeframe Process</li>
            </ul>
          </div>

          <section>
            <p className="text-zinc-300 leading-relaxed text-sm">
              Après la prise de liquidité vue en Leçon 1, la deuxième brique du modèle ICT consiste à savoir OÙ le marché peut réagir. PD Array signifie Premium/Discount Array : ce sont les zones de prix où le marché institutionnel a statistiquement le plus de chances de réagir. FVG, Order Blocks, anciens supports/résistances, sweeps récents — ces éléments sont les briques élémentaires d&apos;un PD Array. Bien lus, ils permettent d&apos;anticiper où une zone va probablement produire un rejet ; mal lus, ils noient le graphique sous une infinité de niveaux dont aucun ne tient.
            </p>
          </section>

          {/* Bloc 3 — TOUS LES FVG ET OB NE SE VALENT PAS */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Tous les FVG et OB ne se valent pas</h2>

            <div className="my-8">
              <PDArrayContextDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Sur n&apos;importe quel graphique, on peut trouver des dizaines de FVG et d&apos;Order Blocks. La majorité ne produiront rien — le prix passera à travers sans même ralentir. Le tri se fait par le CONTEXTE : un FVG créé par une impulsion juste après un sweep de liquidité est très différent d&apos;un FVG laissé par une bougie aléatoire en milieu de range. Le premier est porteur de l&apos;intention institutionnelle qui vient de prendre la liquidité ; le second n&apos;est qu&apos;un trou statistique sans signification structurelle.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Exemple concret</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD H1 : résistance H4 à 1.1780, deux equal highs visibles. Une bougie sweep à 1.1792 prend la liquidité au-dessus, puis une grosse bougie baissière crée un FVG entre 1.1758 et 1.1770. Ce FVG est qualifié : il est né juste après la prise de liquidité, dans une impulsion claire. Quand le prix remontera dans cette zone, la probabilité de rejet est élevée — pas parce que c&apos;est « un FVG », mais parce que c&apos;est un FVG dans un contexte structurel cohérent.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Un FVG ou un OB seul, hors contexte, n&apos;a aucune valeur prédictive</li>
              <li>- Le contexte = ce qui s&apos;est passé juste avant (sweep, BOS, CHoCH)</li>
              <li>- Un FVG né d&apos;une impulsion post-liquidité est qualifié — un FVG « du milieu de range » ne l&apos;est pas</li>
              <li>- La règle : pas de contexte = on ignore le niveau, même s&apos;il semble visuellement clair</li>
            </ul>
          </section>

          {/* Bloc 4 — LE MARCHÉ REVIENT SOUVENT DANS LES DÉSÉQUILIBRES */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Le marché revient souvent dans les déséquilibres</h2>

            <div className="my-8">
              <FVGMitigationDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Une impulsion qui laisse un FVG est par nature un déséquilibre — le prix est passé trop vite pour que toutes les transactions du « bon » prix soient exécutées. Le marché a tendance à revenir mitiger ces déséquilibres avant de continuer dans la direction de l&apos;impulsion. Cette mitigation est précisément l&apos;opportunité que cherche le trader ICT : le retour dans le FVG offre une zone d&apos;entrée beaucoup plus précise et serrée que l&apos;impulsion elle-même, qui se joue rarement à temps.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Exemple concret</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                XAU/USD H1 : depuis 4 690 $, une forte impulsion baissière laisse un FVG entre 4 655 et 4 665 $. Le prix continue jusqu&apos;à 4 620, puis remonte progressivement vers 4 660 — il rentre dans le FVG. Là, une bougie baissière impulsive marque le rejet ; le prix repart vers 4 610 dans la séance suivante. La mitigation a été le signal d&apos;entrée — pas l&apos;impulsion initiale, déjà passée.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Un FVG est un déséquilibre — le marché tend à y revenir pour combler les transactions manquées</li>
              <li>- La mitigation offre une seconde chance d&apos;entrer, avec un meilleur prix et un SL plus serré</li>
              <li>- Tous les FVG ne sont pas mitigés — mais ceux qui sont dans un contexte structurel fort le sont souvent</li>
              <li>- Ne pas confondre mitigation et invalidation : un FVG mitigé est rempli mais peut toujours réagir au prochain test</li>
            </ul>
          </section>

          {/* Bloc 4.5 — REBOND, MITIGATION PROFONDE OU INVALIDATION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Rebond, mitigation profonde ou invalidation : ne pas confondre</h2>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Quand le prix revient dans un FVG, il y a un piège classique : croire qu&apos;un FVG « rempli » est automatiquement mort. C&apos;est faux. Un FVG peut être traversé profondément, presque entièrement, et continuer à réagir parfaitement au test suivant. Ce qui invalide réellement un FVG, ce n&apos;est pas le remplissage — c&apos;est la <span className="text-white font-semibold">cassure structurelle propre</span> au-delà de la zone, accompagnée d&apos;une absence de réaction et d&apos;un contexte HTF qui ne soutient plus le scénario.
            </p>

            <div className="my-6">
              <FVGMitigationScenariosDiagram />
            </div>

            <div className="space-y-4">
              {/* 1. Rebond immédiat */}
              <div className="border-l-2 border-emerald-500/50 pl-4">
                <p className="text-white font-semibold text-sm mb-1">1. Rebond immédiat</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Le prix touche à peine la zone (haut du FVG)</li>
                  <li>- Réaction rapide, bougie de rejet visible</li>
                  <li>- Momentum fort à la reprise</li>
                  <li>- Contexte directionnel clair — c&apos;est la lecture textbook du FVG fresh</li>
                </ul>
              </div>

              {/* 2. Mitigation partielle */}
              <div className="border-l-2 border-emerald-500/30 pl-4">
                <p className="text-white font-semibold text-sm mb-1">2. Mitigation partielle</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Le prix entre dans une partie du FVG (~30-50%)</li>
                  <li>- La zone est rééquilibrée mais pas saturée</li>
                  <li>- Le setup reste valide tant que la structure tient</li>
                  <li>- Lecture intermédiaire : entre rebond et mitigation profonde, gérer comme un FVG actif</li>
                </ul>
              </div>

              {/* 3. Mitigation profonde */}
              <div className="border-l-2 border-amber-500/60 pl-4">
                <p className="text-white font-semibold text-sm mb-1">3. Mitigation profonde</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Le prix remplit 70-95% de la zone, parfois jusqu&apos;au bas</li>
                  <li>- <span className="text-amber-400 font-semibold">Pas automatiquement une invalidation</span></li>
                  <li>- Ce qui compte : la réaction qui suit (mèche de rejet, bougie de reprise nette)</li>
                  <li>- Si la structure HTF tient et que la réaction arrive — le FVG est mitigé mais valide</li>
                </ul>
              </div>

              {/* 4. Invalidation réelle */}
              <div className="border-l-2 border-red-500/60 pl-4">
                <p className="text-white font-semibold text-sm mb-1">4. Invalidation réelle</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Cassure structurelle propre au-delà de la zone d&apos;invalidation</li>
                  <li>- Close net au-delà du FVG, pas juste une mèche</li>
                  <li>- Absence totale de réaction sur plusieurs bougies</li>
                  <li>- Déplacement opposé propre — momentum continu dans le sens contraire</li>
                  <li>- Contexte HTF qui ne soutient plus le scénario (BOS / CHoCH contraire)</li>
                </ul>
              </div>
            </div>

            <div className="border border-amber-500/30 bg-amber-500/5 rounded-xl p-4 md:p-6 my-6">
              <p className="text-amber-400 font-semibold text-sm mb-2">Règle à retenir</p>
              <p className="text-sm text-zinc-200 leading-relaxed">
                FVG rempli <span className="text-zinc-500">≠</span> setup mort.
                <br />
                <span className="text-white font-semibold">FVG rempli SANS réaction + structure cassée = invalidation probable.</span>
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-3">Exemple concret — FVG haussier entre 1.0840 et 1.0860</p>
              <ul className="space-y-2 text-sm text-zinc-300">
                <li>
                  <span className="text-emerald-400 font-semibold">Cas A — Rebond immédiat :</span> le prix revient à 1.0860, marque une mèche, bougie verte de force, repart vers 1.0920. FVG fresh, setup A+, RR optimisé.
                </li>
                <li>
                  <span className="text-amber-400 font-semibold">Cas B — Mitigation profonde :</span> le prix descend à 1.0842 (presque tout le FVG), longue mèche d&apos;achat, close à 1.0855 puis reprise. Le FVG est mitigé mais le rejet est net — le setup reste actif. Stop à 1.0838.
                </li>
                <li>
                  <span className="text-red-400 font-semibold">Cas C — Invalidation :</span> le prix traverse le FVG sans réaction, close à 1.0825, casse le swing low précédent. Pas de mèche d&apos;achat, momentum continu baissier. Le FVG est mort — pas de trade, on attend une nouvelle structure.
                </li>
              </ul>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Avant de dire « FVG mort », vérifie : y a-t-il eu une bougie de réaction ?</li>
              <li>- Une mèche profonde sans close au-delà = mitigation, pas invalidation</li>
              <li>- L&apos;invalidation se confirme dans la suite — pas dans la touche elle-même</li>
              <li>- Si HTF tient et structure intacte, un FVG profondément mitigé peut donner le meilleur signal de la session</li>
            </ul>
          </section>

          {/* Bloc 5 — LES MEILLEURES ZONES = CONFLUENCE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Les meilleures zones = confluence</h2>

            <div className="my-8">
              <PDArrayConfluenceDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Une zone seule, même qualifiée, reste un pari probabiliste. La force d&apos;un PD Array augmente significativement quand plusieurs éléments structurels se superposent au même niveau de prix : un ancien support cassé devenu résistance, un FVG bearish dans la même bande, un sweep récent au-dessus. Quand trois éléments racontent la même histoire au même endroit, la zone devient un véritable point de pivot — c&apos;est ce qu&apos;on appelle une confluence. Les zones de confluence sont rares mais offrent les meilleurs setups du modèle ICT.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Exemple concret</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD H1 : à 1.1780, on retrouve simultanément un ancien support H1 cassé deux séances plus tôt, un FVG bearish laissé par l&apos;impulsion qui a cassé ce support, et un sweep récent juste au-dessus. Trois éléments, une seule zone. Quand le prix revient tester ce niveau, la probabilité de rejet est nettement supérieure à celle d&apos;un FVG isolé — le marché « voit » la zone par plusieurs canaux à la fois.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Une zone seule = setup correct ; une confluence = setup premium</li>
              <li>- Empiler ancien support/résistance + FVG + sweep dans le même prix multiplie la fiabilité</li>
              <li>- Les zones de confluence sont rares — on en repère 1 à 3 par semaine sur une paire majeure</li>
              <li>- Si aucun élément structurel ne se superpose au FVG, c&apos;est qu&apos;il faut probablement passer son tour</li>
            </ul>
          </section>

          {/* Bloc 6 — PLAN D'APPLICATION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan d&apos;application : un PD Array EUR/USD complet</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Voici la séquence complète pour qualifier et trader un PD Array sur EUR/USD. Quatre étapes, chacune avec son rôle.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Étape 1 — Daily : direction et contexte</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation : EUR/USD Daily en structure LH/LL, résistance Daily à 1.1780, prix actuel 1.1735</li>
                <li>- Conclusion : biais baissier — on cherchera des shorts sur PD Array haut</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Étape 2 — H1 : identifier les PD Arrays</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation : ancien support H1 cassé à 1.1780 + FVG bearish entre 1.1758 et 1.1770 + sweep récent à 1.1792</li>
                <li>- Conclusion : zone confluente 1.1758-1.1780 — PD Array premium, on prépare un scénario short au retour</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Étape 3 — Retour dans la zone : surveiller la mitigation</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation : sur 3 séances, le prix remonte progressivement vers 1.1760, rentre dans le FVG</li>
                <li>- Conclusion : la zone est testée — on passe en mode « guet » pour la réaction, pas d&apos;entrée encore</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Étape 4 — Exécution potentielle (M15)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation : sur M15, mèches hautes de rejet à 1.1768, puis bougie baissière impulsive qui casse le creux local à 1.1748</li>
                <li>- Conclusion : entrée short à 1.1758 sur la cassure, SL à 1.1772 (au-dessus du sommet de rejet), TP vers la prochaine zone de liquidité basse à 1.1695. Si aucune bougie impulsive n&apos;apparaît, la zone échoue — pas d&apos;entrée</li>
              </ul>

              <div className="border-t border-zinc-800/60 pt-3 mt-3">
                <p className="text-sm text-zinc-300 italic text-center">
                  Daily = contexte · H1 = PD Array · Retour = mitigation · M15 = exécution
                </p>
              </div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "Un FVG ou un OB seul ne vaut rien sans contexte structurel — sweep, BOS ou impulsion juste avant.",
              "Le marché tend à revenir mitiger les déséquilibres avant de continuer dans la direction de l’impulsion.",
              "Une confluence (support cassé + FVG + sweep dans la même zone) multiplie nettement la fiabilité du PD Array.",
              "Pas de contexte = on ignore le niveau ; pas de confluence = setup correct mais pas premium.",
            ]}
          />

          <LessonExercice
            description="Sur TradingView, repère un PD Array confluent sur la paire de ton choix et qualifie-le étape par étape."
            steps={[
              "HTF (Daily/H4) : conclus un biais directionnel clair. Sans biais, ne descends pas plus bas — un PD Array hors biais est très peu fiable.",
              "H1 : recherche un FVG dans le sens du biais, créé par une impulsion juste après un sweep ou un BOS. Vérifie qu&apos;il coïncide avec un ancien support/résistance cassé. Si oui, tu as une confluence.",
              "Attends le retour du prix dans le PD Array. Sur M15, observe la réaction : mèches de rejet + bougie impulsive = entrée validée. Si la zone est traversée sans réaction, le setup est invalidé — passe à la prochaine.",
            ]}
          />

          <LessonQuiz
            question="Tu as repéré un FVG bearish sur H1 EUR/USD. Quelle confluence le rend nettement plus fiable pour un short ?"
            options={[
              "Le FVG est bien isolé et proprement délimité, sans autre niveau autour",
              "Le FVG coïncide avec un ancien support cassé et un sweep récent au-dessus",
              "Le FVG est très éloigné de tous les autres niveaux structurels du graphique",
              "Le FVG s'est formé sans impulsion préalable, simplement par drift latéral",
            ]}
            correctIndex={1}
            explanation="Un PD Array isolé reste un pari probabiliste. La fiabilité augmente significativement quand plusieurs éléments racontent la même histoire au même niveau : ancien support cassé + FVG + sweep récent = confluence. C&apos;est précisément cette superposition qui fait passer un setup correct à un setup premium."
            answerExplanations={[
              "Faux. Un FVG isolé, sans autre niveau structurel autour, est un setup faible. Le marché peut le traverser sans réaction. L&apos;isolation n&apos;est pas une qualité — c&apos;est l&apos;absence de confluence.",
              "Correct. La confluence (ancien support cassé + FVG + sweep) signifie que plusieurs lectures structurelles convergent au même prix. Le marché « voit » la zone par plusieurs canaux, ce qui augmente nettement la probabilité de réaction.",
              "Faux. Un FVG éloigné de toute structure est tout sauf premium. L&apos;ICT cherche la concentration d&apos;éléments, pas leur dispersion — un niveau isolé n&apos;a aucune raison particulière de tenir.",
              "Faux. Un FVG né sans impulsion préalable, en simple drift latéral, n&apos;est pas qualifié. L&apos;impulsion est précisément ce qui donne sa valeur au FVG : elle traduit l&apos;intention institutionnelle qui a déséquilibré le prix.",
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
                  markLessonComplete(p, "ict", "lecon2");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Leçon 2 du module ICT complet complétée.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between gap-4">
              <Link href="/strategies/ict/lecon1" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Leçon précédente
              </Link>
              <Link href="/strategies/ict/lecon3" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                Leçon suivante
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
