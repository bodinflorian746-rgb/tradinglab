"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { OrderBlockDiagram } from "@/app/components/charts/OrderBlockDiagram";
import OBFreshnessDiagram from "@/app/components/charts/OBFreshnessDiagram";
import OBExecutionPlanDiagram from "@/app/components/charts/OBExecutionPlanDiagram";
import OBSLPlacementDiagram from "@/app/components/charts/OBSLPlacementDiagram";
import MitigationZoneEntryDiagram from "@/app/components/charts/MitigationZoneEntryDiagram";

const LESSONS = [
  { id: "lecon1", title: "Leçon 1", disabled: false },
  { id: "lecon2", title: "Leçon 2", disabled: false },
  { id: "lecon3", title: "Order Blocks : identifier les zones institutionnelles", disabled: false },
  { id: "lecon4", title: "Leçon 4", disabled: true },
  { id: "lecon5", title: "Leçon 5", disabled: true },
];

export default function ContentFr() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "smc", "lecon3"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Stratégies</Link>
          <span>/</span>
          <Link href="/strategies/smc" className="hover:text-zinc-400 transition-colors">SMC : Penser institutionnel</Link>
          <span>/</span>
          <span className="text-zinc-500">Leçon 3</span>
        </nav>

        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Intermédiaire
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
            Order Blocks : identifier les zones institutionnelles
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Les Order Blocks (OB) sont les zones de mémoire institutionnelle où des ordres importants ont été placés avant une impulsion. Cette leçon couvre la procédure d&apos;identification, les critères de qualification, le plan d&apos;exécution chiffré et les pièges à éviter.
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
            <span className="ml-auto text-xs text-zinc-600">3 / 5 leçons</span>
          </div>
        </header>

        {/* ── Contenu ── */}
        <div className="space-y-8">

          {/* Bloc 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-blue-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « Un Order Block n&apos;est pas une zone théorique. C&apos;est l&apos;empreinte visible du dernier ordre institutionnel avant l&apos;impulsion. »
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prérequis</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Market Structure SMC, swings, phases → cf. Stratégie SMC L1</li>
              <li>- BOS et CHoCH, cassure structurelle → cf. Stratégie SMC L2</li>
              <li>- Bougie d&apos;impulsion, displacement → cf. Formation Trading L2</li>
            </ul>
          </div>

          {/* Bloc 3 — IDENTIFIER UN ORDER BLOCK */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Identifier un Order Block</h2>
            <div className="my-8">
              <OrderBlockDiagram />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">L&apos;identification d&apos;un Order Block suit une procédure stricte en 4 étapes. Sauter l&apos;une de ces étapes mène à qualifier une zone non-institutionnelle comme OB.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">1. Impulsion directionnelle.</span> <span className="text-zinc-300">Mouvement franc à amplitude supérieure à la moyenne, qui produit un BOS. 3 à 8 bougies sur H4 ou Daily.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">2. Bougie opposée précédant l&apos;impulsion.</span> <span className="text-zinc-300">Pour impulsion haussière : dernière bougie baissière. Pour baissière : dernière haussière. Empreinte du dernier ordre institutionnel.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">3. Validation par BOS.</span> <span className="text-zinc-300">L&apos;impulsion qui suit la bougie opposée DOIT produire un BOS validé. Sans BOS : simple zone de réaction, pas un OB.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">4. Délimitation précise.</span> <span className="text-zinc-300">Corps de la bougie opposée = limites. Open haute / Close basse pour OB bullish. Coordonnées exactes définissent entrée et SL.</span></div>
            </div>
          </section>

          {/* Bloc 4 — OB FRAIS vs OB MITIGÉ */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">OB frais vs OB mitigé</h2>
            <div className="my-8">
              <OBFreshnessDiagram />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">Un OB frais (jamais retesté) présente un taux de réaction plus élevé qu&apos;un OB consommé. La fraîcheur conditionne directement l&apos;exploitabilité du setup.</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- OB frais : moins de 20 bougies H4 depuis formation, jamais retraversé. Réaction institutionnelle pleine attendue.</li>
              <li>- OB mitigé : prix déjà retraversé entièrement la zone du corps. Ordres exécutés, OB consommé, setup non exploitable.</li>
            </ul>
          </section>

          {/* Bloc 5 — CRITÈRES DE QUALIFICATION D'UN OB TRADABLE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Critères de qualification d&apos;un OB tradable</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">4 critères qualifient un OB comme tradable opérationnellement. Un OB qui ne valide pas ces critères reste structurellement présent mais expose à un taux de réussite réduit.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">1. Fraîcheur de l&apos;OB.</span> <span className="text-zinc-300">Moins de 20 bougies H4 depuis formation. Au-delà, l&apos;institutionnel a pu accumuler ailleurs.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">2. FVG associé dans l&apos;impulsion.</span> <span className="text-zinc-300">Écart entre mèches sans recouvrement. Signale une impulsion violente. Augmente la probabilité de réaction au retest.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">3. Alignement multi-timeframe.</span> <span className="text-zinc-300">OB H4 + biais Daily aligné. Prix au-dessus MM200 pour OB bullish, en dessous pour OB bearish.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">4. Non-mitigation préalable.</span> <span className="text-zinc-300">Le prix n&apos;a pas encore retraversé entièrement la zone. Mitigation complète consomme l&apos;OB.</span></div>
            </div>
          </section>

          {/* Bloc 6 — PLAN D'EXÉCUTION DU SETUP OB */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan d&apos;exécution du setup OB</h2>
            <div className="my-8">
              <OBExecutionPlanDiagram />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">Le plan d&apos;exécution suit une structure stricte en 4 éléments. Valable pour OB bullish (entrée long au retest) et bearish (entrée short au retest).</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">1. Niveau d&apos;entrée.</span> <span className="text-zinc-300">Limite externe du corps de l&apos;OB : limite haute (bullish), limite basse (bearish). Signal de rejet M15 confirme.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">2. Position du stop loss.</span> <span className="text-zinc-300">Au-delà de la mèche extrême, marge 5-10 pips EUR/USD ou 5-10$ XAU/USD. JAMAIS à l&apos;intérieur du corps.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">3. Position du take profit.</span> <span className="text-zinc-300">Ratio R/R 1:2 minimum. Cible : prochain HH, zone de supply, ou projection mesurée de l&apos;impulsion initiale.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">4. Taille de position.</span> <span className="text-zinc-300">Risque par trade : 5% pour 300€, 3% pour 500€, 2% pour 1 000€+. Lot calculé sur distance entrée-SL.</span></div>
            </div>
          </section>

          {/* Bloc 7 — PLACEMENT DU STOP LOSS */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Placement du Stop Loss</h2>
            <div className="my-8">
              <OBSLPlacementDiagram />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">Le placement du SL conditionne la survie du trade. 3 positions possibles, une seule est correcte.</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- <span className="text-red-400 font-semibold">SL dans la zone</span> : wick normal au retest déclenche le SL avant la réaction. Setup tué par stop hunt.</li>
              <li>- <span className="text-amber-400 font-semibold">SL à la limite</span> : tolérance zéro pour les wicks de retest. Risque élevé d&apos;invalidation prématurée.</li>
              <li>- <span className="text-emerald-400 font-semibold">SL avec marge (correct)</span> : 5-10 pips au-delà de la mèche extrême. Absorbe les wicks secondaires.</li>
            </ul>
          </section>

          {/* Bloc 8 — ZONE DE MITIGATION APRÈS CHoCH */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Zone de mitigation après CHoCH</h2>
            <div className="my-8">
              <MitigationZoneEntryDiagram />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">Après un CHoCH (cf. Stratégie SMC L2), l&apos;ex-niveau structurel cassé devient une zone d&apos;OB de mitigation pour entrer dans le nouveau sens. Setup d&apos;entrée précis avec stop serré.</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Ex-HL devient résistance (CHoCH baissier), ex-LH devient support (CHoCH haussier).</li>
              <li>- Entrée au retest de la zone avec signal de rejet M15.</li>
              <li>- Stop loss serré au-delà de la zone, take profit sur projection structurelle.</li>
            </ul>
          </section>

          {/* Bloc 9 — ERREURS COURANTES */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Erreurs courantes sur les Order Blocks</h2>
            <div className="space-y-3">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-red-400 font-semibold text-sm mb-1">1. Identifier un OB sans BOS validé</p>
                <p className="text-zinc-300 text-sm">Bougie opposée isolée sans impulsion ni cassure structurelle = zone sans valeur. Toujours valider l&apos;impulsion claire et le BOS avant qualification.</p>
              </div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-red-400 font-semibold text-sm mb-1">2. Trade sur un OB déjà mitigé</p>
                <p className="text-zinc-300 text-sm">Si le prix a retraversé entièrement la zone, les ordres institutionnels sont consommés. Privilégier les OB frais de moins de 20 bougies H4.</p>
              </div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-red-400 font-semibold text-sm mb-1">3. SL placé dans la zone de l&apos;OB</p>
                <p className="text-zinc-300 text-sm">Wick normal sur retest déclenche le SL. Placer au-delà de la mèche extrême avec marge 5-10 pips, jamais dans le corps.</p>
              </div>
            </div>
          </section>

          {/* Bloc 10 — PLAN DE TRADE EUR/USD H4 */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan de trade : OB bullish EUR/USD H4</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">EUR/USD en tendance haussière H4 confirmée. Prix au-dessus MM200 Daily (1.1500) et MM50 Daily (1.1700). Impulsion haussière de 4 bougies depuis 1.1740 jusqu&apos;à 1.1830, validée par un BOS au-dessus du HH précédent à 1.1820. Bougie opposée précédant l&apos;impulsion : corps 1.1780 (open) / 1.1752 (close), mèche basse 1.1745. Zone OB : 1.1752-1.1780, OB frais (5 bougies depuis formation), aligné Daily, non mitigé.</p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Setup</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Entrée : 1.1780 (limite haute du corps de l&apos;OB, ordre limite ou attente du signal M15)</li>
                <li>- Stop loss : 1.1752 (28 pips sous l&apos;entrée, au-delà de la mèche basse 1.1745 avec marge de 7 pips)</li>
                <li>- Take profit : 1.1858 (78 pips au-dessus, projection extension de l&apos;impulsion initiale)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Calcul du R/R</p>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>- Risque : 1.1780 - 1.1752 = 28 pips</li>
                <li>- Gain potentiel : 1.1858 - 1.1780 = 78 pips</li>
                <li>- R/R : 78 / 28 = 2,79</li>
                <li>- Setup exploitable.</li>
              </ul>
            </div>
          </section>

          {/* Bloc 11 — CALCUL RETAIL */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Calcul retail</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Le risque par trade selon le capital appliqué à ce setup.</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-3">
              <li>- Compte 300€ → 5% = risque 15€, gain potentiel 42€</li>
              <li>- Compte 500€ → 3% = risque 15€, gain potentiel 42€</li>
              <li>- Compte 1 000€ → 2% = risque 20€, gain potentiel 56€</li>
              <li>- Compte 2 500€ → 2% = risque 50€, gain potentiel 140€</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">Le R/R reste 2,79:1 peu importe la taille du compte. Ce qui change, c&apos;est la taille de lot et le pourcentage de risque adapté au capital.</p>
          </section>

          <LessonKeyPoints
            points={[
              "Un Order Block est la dernière bougie de sens opposé précédant une impulsion validée par un BOS. La procédure d’identification suit 4 étapes strictes.",
              "4 critères qualifient un OB tradable : fraîcheur (moins de 20 bougies H4), FVG associé, alignement multi-timeframe, non-mitigation préalable.",
              "L’entrée se place à la limite externe du corps de l’OB avec signal de rejet M15. Le SL au-delà de la mèche extrême, jamais à l’intérieur du corps.",
              "Le R/R minimum est 1:2. Le TP cible la prochaine zone structurelle ou la projection mesurée de l’impulsion initiale.",
            ]}
          />

          <LessonExercice
            description="Sur XAU/USD H4, tendance haussière confirmée (prix au-dessus de la MM200 Daily à 4 320$). Une impulsion haussière de 5 bougies a porté le prix de 4 540$ à 4 660$, validée par un BOS au-dessus du HH précédent à 4 650$. La dernière bougie baissière avant l’impulsion présente un corps entre 4 562$ (open) et 4 555$ (close), avec mèche basse à 4 547$. Aucune mitigation depuis la formation (8 bougies H4 écoulées). Le prix retrace actuellement vers la zone. Construis le plan complet et calcule deux variantes de R/R : variante naïve (TP éloigné) et variante réaliste (TP partiel intermédiaire)."
            steps={[
              "Délimiter l’Order Block bullish : corps de la bougie opposée entre 4 555$ et 4 562$, mèche basse à 4 547$. OB frais (8 bougies écoulées), aligné Daily haussier, non mitigé.",
              "Placer l’entrée à 4 562$ (limite haute du corps de l’OB) avec attente du signal de rejet M15 (pin bar, engulfing bullish).",
              "Placer le stop loss à 4 549$ (13$ sous l’entrée, au-delà de la mèche basse 4 547$ avec marge 2$). Risque = 13$ par unité.",
              "Variante naïve. TP éloigné à 4 720$ (projection extension complète de l’impulsion initiale) : Gain = 4 720 - 4 562 = 158$. R/R = 158 / 13 = 12,3. Ratio attractif sur le papier mais trop optimiste : la probabilité d’atteindre une cible à 12:1 sans pullback intermédiaire reste faible.",
              "Variante réaliste. TP partiel à 4 632$ (premier HH intermédiaire identifié, prise de profit partielle) : Gain = 4 632 - 4 562 = 70$. R/R = 70 / 13 = 5,4. Cible structurelle réaliste, atteignable sans détour. Le R/R 5,4 reste excellent pour un setup OB et permet de sécuriser la position avant le HH précédent à 4 650$, où le marché risque de produire une réaction technique avant le TP final.",
            ]}
          />

          <LessonQuiz
            question="Quel élément valide structurellement la qualification d’une bougie opposée comme Order Block tradable ?"
            options={[
              "La bougie opposée doit avoir un volume élevé",
              "L’impulsion qui suit la bougie opposée doit produire un BOS validé",
              "L’OB doit se former en zone de surachat RSI",
              "La bougie opposée doit être de couleur rouge",
            ]}
            correctIndex={1}
            explanation="Sans BOS validé après la bougie opposée, l’impulsion reste hypothétique et la bougie opposée n’est qu’une variation locale, pas un Order Block exploitable. La cassure structurelle (BOS) confirme que des ordres institutionnels significatifs ont effectivement été placés à la zone et déclenchent l’impulsion qui suit."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "smc", "lecon3");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Leçon 3 du module SMC : Penser institutionnel complétée.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <Link href="/strategies/smc/lecon2" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Leçon 2
              </Link>
              <span className="inline-flex items-center gap-2 text-sm text-zinc-700 cursor-not-allowed">
                Leçon 4. À venir
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
