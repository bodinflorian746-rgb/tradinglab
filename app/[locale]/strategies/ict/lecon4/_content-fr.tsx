"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { DisplacementImpulseDiagram } from "@/app/components/charts/DisplacementImpulseDiagram";
import { DisplacementControlDiagram } from "@/app/components/charts/DisplacementControlDiagram";
import { DisplacementSetupDiagram } from "@/app/components/charts/DisplacementSetupDiagram";
import { DisplacementVsVolatilityDiagram } from "@/app/components/charts/DisplacementVsVolatilityDiagram";

const LESSONS = [
  { id: "lecon1", title: "Liquidité et manipulation", disabled: false },
  { id: "lecon2", title: "PD Arrays", disabled: false },
  { id: "lecon3", title: "Killzones", disabled: false },
  { id: "lecon4", title: "Displacement", disabled: false },
  { id: "lecon5", title: "Modèle ICT complet", disabled: false },
];

export default function ContentFr() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "ict", "lecon4"));
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
          <span className="text-zinc-500">Leçon 4</span>
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
            Le displacement : reconnaître le vrai déplacement institutionnel
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Le marché ne se déplace pas toujours avec conviction. Certaines impulsions montrent une vraie prise de contrôle.
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
              const isCurrent = lesson.id === "lecon4";
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
            <span className="ml-auto text-xs text-zinc-600">4 / 5 leçons</span>
          </div>
        </header>

        <div className="space-y-8">

          {/* Bloc 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-amber-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « Une grande bougie n&apos;est pas un signal. Une grande bougie qui casse une structure et continue, oui. »
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
              <li>- BOS et CHoCH → cf. module SMC, leçon « BOS et CHoCH : lire les signaux structurels institutionnels »</li>
            </ul>
          </div>

          {/* Bloc 3 — UN DISPLACEMENT N'EST PAS UNE SIMPLE IMPULSION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Un displacement n&apos;est pas une simple impulsion</h2>

            <div className="my-8">
              <DisplacementImpulseDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Un displacement est une séquence de bougies impulsives, à grands corps, qui se déplace dans une direction sans correction significative, pas une simple grande bougie isolée. La séquence se reconnaît à trois caractéristiques : amplitude des corps anormalement supérieure aux bougies précédentes, absence de mèches significatives dans le sens contraire (le marché ne reprend pas son souffle), et création quasi-systématique d&apos;un ou plusieurs FVG dans la chute ou la montée. C&apos;est cette combinaison qui distingue le displacement d&apos;une simple volatilité.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Exemple concret</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                Graphique M15 EUR/USD : depuis 1.1780, le prix imprime une mèche de sweep à 1.1792 puis enchaîne 4 bougies baissières consécutives, chacune avec un corps de 12-15 pips, sans aucune mèche haute notable. Le prix chute jusqu&apos;à 1.1748 en moins d&apos;une heure, laissant deux FVG bearish visibles dans la chute. C&apos;est un displacement caractéristique, pas une volatilité passagère, mais une séquence orientée.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Displacement = séquence de bougies impulsives à grands corps, pas une bougie isolée</li>
              <li>- Absence de mèches dans le sens contraire = le marché ne respire pas</li>
              <li>- Création de FVG dans le mouvement = trace structurelle du déséquilibre</li>
              <li>- Amplitude des corps nettement supérieure à la moyenne des dernières bougies</li>
            </ul>
          </section>

          {/* Bloc 4 — LE DISPLACEMENT MONTRE QUI PREND LE CONTRÔLE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Le displacement montre qui prend le contrôle</h2>

            <div className="my-8">
              <DisplacementControlDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Avant un displacement, le marché est généralement en équilibre, bougies de faible amplitude, alternance verte/rouge, latéralisation. Quand le displacement arrive, c&apos;est l&apos;équilibre qui rompt : un côté prend brutalement le dessus et impose la direction. Cette rupture est la signature d&apos;une intention institutionnelle. Lire un displacement, c&apos;est lire qui, vendeurs ou acheteurs, vient de gagner la bataille en cours. La direction du displacement définit le biais immédiat des minutes / heures qui suivent.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Exemple concret</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                XAU/USD M15 : le prix consolide autour de 4 650 $ pendant 3 heures, bougies plates, marché équilibré. À 14h UTC, une bougie sweep un sommet à 4 668 $, suivie immédiatement par 5 bougies baissières à grands corps qui ramènent le prix à 4 608 $. L&apos;équilibre est rompu : ce sont les vendeurs qui prennent le contrôle. Le biais des heures suivantes est défini, on ne cherche plus de longs jusqu&apos;à preuve du contraire.
            </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Le displacement marque le passage de l&apos;équilibre à la prise de contrôle</li>
              <li>- La direction du displacement définit le biais des minutes / heures qui suivent</li>
              <li>- Avant le displacement = marché plat, équilibré ; après = direction imposée</li>
              <li>- Ignorer un displacement = trader contre l&apos;intention institutionnelle qui vient de s&apos;exprimer</li>
            </ul>
          </section>

          {/* Bloc 5 — LE DISPLACEMENT CRÉE SOUVENT LE SETUP */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Le displacement crée souvent le setup</h2>

            <div className="my-8">
              <DisplacementSetupDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Un displacement laisse derrière lui une zone exploitable : le FVG créé par les grandes bougies de la séquence. Le marché vient souvent revisiter cette zone avant de continuer dans la direction du displacement, c&apos;est le scénario de mitigation déjà vu en Leçon 2, mais ici dans un contexte particulièrement fiable car le FVG est né d&apos;une intention institutionnelle visible. Le retour dans le FVG offre une entrée serrée, avec un SL au-dessus de l&apos;extrémité du displacement et un TP vers la prochaine zone de liquidité dans la direction du mouvement.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Exemple concret</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD H1 : le sweep à 1.1792 et le displacement bearish jusqu&apos;à 1.1748 laissent un FVG visible entre 1.1768 et 1.1780. Sur les heures suivantes, le prix remonte progressivement, rentre dans la bande FVG, puis une bougie baissière franche relance la baisse. Entrée short au retour dans le FVG, SL juste au-dessus de 1.1780, TP vers la prochaine zone de liquidité basse, le displacement initial a créé à lui seul l&apos;entrée et le SL.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Le FVG créé par un displacement est une zone d&apos;entrée premium</li>
              <li>- Le retour dans le FVG offre une entrée serrée avec SL structurel</li>
              <li>- L&apos;intention du displacement reste valable tant que le FVG n&apos;est pas violé dans le sens contraire</li>
              <li>- Le displacement crée à la fois l&apos;entrée (FVG) et l&apos;invalidation (extrémité du mouvement)</li>
            </ul>
          </section>

          {/* Bloc 6 — TOUS LES MOUVEMENTS RAPIDES NE SONT PAS DES DISPLACEMENTS */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Tous les mouvements rapides ne sont pas des displacements</h2>

            <div className="my-8">
              <DisplacementVsVolatilityDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Le piège classique est de confondre toute grande bougie avec un displacement. Une bougie isolée, même très grande, qui n&apos;est ni précédée d&apos;une structure exploitée ni suivie d&apos;une continuité, est simplement de la volatilité, un événement ponctuel sans suite. Le vrai displacement se distingue par deux éléments : il casse une structure locale (BOS dans le sens du mouvement) et il est suivi d&apos;une continuation, pas d&apos;un rejet immédiat. Sans ces deux conditions, c&apos;est juste une mèche que le marché va effacer dans les minutes qui suivent. La taille de 18 pips n&apos;est jamais en soi un critère, c&apos;est la cassure et la continuité qui le sont.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Exemple concret</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                Sur EUR/USD, une bougie M15 imprime brutalement 18 pips à la hausse suite à une news mineure, puis la bougie suivante referme entièrement le mouvement, pas de cassure structurelle, pas de continuation. C&apos;est de la volatilité, pas un displacement. À l&apos;inverse, une séquence de 4 bougies baissières de 10-12 pips chacune qui casse un creux local et enchaîne dans la même direction est un displacement, même si aucune bougie ne dépasse 12 pips.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Grande bougie isolée + rejet immédiat = volatilité, pas displacement</li>
              <li>- Displacement = cassure de structure (BOS) + continuation dans la direction</li>
              <li>- La taille d&apos;une seule bougie n&apos;est jamais un critère, c&apos;est la séquence et la suite qui comptent</li>
              <li>- Trader la volatilité comme un displacement = se faire prendre du mauvais côté</li>
            </ul>
          </section>

          {/* Bloc 7 — PLAN D'APPLICATION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan d&apos;application : un displacement EUR/USD complet</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Voici la séquence pour identifier et exploiter un displacement sur EUR/USD. Cinq étapes, chacune avec son rôle.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Étape 1. HTF (Daily) : biais directionnel</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation : EUR/USD Daily en LH/LL, résistance Daily 1.1780</li>
                <li>- Conclusion : biais baissier, on cherchera un displacement dans le sens vendeur</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Étape 2. Liquidité (H1) : identifier la cible</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation : equal highs récents à 1.1780, stops accumulés au-dessus</li>
                <li>- Conclusion : la liquidité au-dessus de 1.1780 est la cible probable avant tout vrai mouvement bearish</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Étape 3. Sweep (M15 en Killzone)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation : à l&apos;ouverture NY, le prix sweep à 1.1792 puis réintègre sous 1.1780</li>
                <li>- Conclusion : la liquidité est prise. On guette maintenant le displacement</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Étape 4. Displacement bearish</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation : 4 bougies baissières consécutives à grands corps, sans mèches hautes, le prix chute à 1.1748. FVG visible entre 1.1768 et 1.1780</li>
                <li>- Conclusion : displacement validé. L&apos;entrée n&apos;est pas dans le displacement (déjà passé), elle est dans le FVG qu&apos;il a créé</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Étape 5. Retour dans le FVG : exécution</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation : le prix remonte progressivement vers 1.1768-1.1780, rentre dans la bande FVG, puis bougie baissière de rejet</li>
                <li>- Conclusion : entrée short au retour dans le FVG, SL juste au-dessus de 1.1780 (extrémité du displacement), TP vers 1.1695. R/R ≈ 1 : 2, setup haute probabilité car aligné HTF + liquidité + sweep + displacement + FVG</li>
              </ul>

              <div className="border-t border-zinc-800/60 pt-3 mt-3">
                <p className="text-sm text-zinc-300 italic text-center">
                  HTF = biais · Liquidité = cible · Sweep = condition · Displacement = confirmation · FVG = exécution
                </p>
              </div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "Un displacement est une séquence de bougies impulsives, pas une bougie isolée, corps grands, peu de mèches contraires, FVG laissés derrière.",
              "Le displacement marque le passage de l’équilibre à la prise de contrôle institutionnelle.",
              "Le FVG créé par un displacement est une zone d’entrée premium, l’entrée se prend au retour, pas dans le displacement lui-même.",
              "Une grande bougie isolée sans cassure ni continuation est de la volatilité, pas un displacement.",
            ]}
          />

          <LessonExercice
            description="Sur TradingView, repère un displacement complet sur la paire de ton choix et qualifie-le étape par étape."
            steps={[
              "Repère une séquence de 3-5 bougies M15 ou H1 consécutives, toutes dans la même direction, avec des corps plus grands que la moyenne des 10 bougies précédentes et peu ou pas de mèches contraires.",
              "Vérifie que la séquence casse une structure locale (creux ou sommet récent) et qu&apos;elle laisse au moins un FVG visible. Si oui, c&apos;est un displacement qualifié.",
              "Trace le FVG sur le graphique. Attends que le prix y revienne. Si la réaction au retour confirme la direction du displacement (bougie de rejet, cassure dans le sens), note l&apos;entrée, le SL au-dessus de l&apos;extrémité du displacement et le TP vers la prochaine liquidité.",
            ]}
          />

          <LessonQuiz
            question="Sur EUR/USD, une bougie M15 imprime brutalement 18 pips à la hausse, puis la bougie suivante referme entièrement le mouvement. Aucune cassure structurelle n'est visible. Comment qualifies-tu ce mouvement ?"
            options={[
              "C'est un displacement haussier, 18 pips en une bougie est un signal fort",
              "C'est de la volatilité sans suite, pas un displacement, pas de cassure ni de continuation",
              "C'est un sweep, donc le scénario inverse est validé pour entrer short immédiatement",
              "C'est un signal indéterminé, il faut attendre 1h pour décider",
            ]}
            correctIndex={1}
            explanation="Un displacement n'est jamais défini par la taille d'une seule bougie. Les deux critères structurels sont : une cassure de structure locale (BOS) ET une continuation dans la direction. Ici, la bougie suivante referme intégralement le mouvement et il n'y a pas de cassure, c'est exactement la définition de la volatilité sans suite, pas un displacement. Trader cette bougie comme un signal d'achat reviendrait à acheter le sommet du faux mouvement."
            answerExplanations={[
              "Faux. La taille d'une bougie n'a aucune valeur sans cassure de structure et continuation. 18 pips isolés et immédiatement rejetés = volatilité ponctuelle, exactement le piège que le concept de displacement vise à éviter.",
              "Correct. Sans cassure structurelle ni continuation, c'est une bougie isolée, donc de la volatilité, pas un displacement. La règle de l'ICT est claire : un displacement n'est validé que par une séquence orientée qui casse une structure et continue.",
              "Faux. Un sweep n'est qu'une condition préalable, jamais un signal d'entrée seul. Entrer short immédiatement sur la base d'une bougie haussière isolée n'a aucune logique structurelle, il faut attendre la confirmation (réintégration + bougie impulsive opposée).",
              "Faux. Attendre 1h arbitrairement ne change pas la lecture. Le mouvement est déjà qualifié de volatilité par les critères structurels (pas de cassure, rejet immédiat). Pas besoin de timer, il faut juste lire correctement ce qu&apos;on voit.",
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
                  markLessonComplete(p, "ict", "lecon4");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Leçon 4 du module ICT complet complétée.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between gap-4">
              <Link href="/strategies/ict/lecon3" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Leçon précédente
              </Link>
              <Link href="/strategies/ict/lecon5" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
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
