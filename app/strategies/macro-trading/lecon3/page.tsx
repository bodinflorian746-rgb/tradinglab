"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { RiskoffSignalsDiagram } from "@/app/components/charts/RiskoffSignalsDiagram";
import { RiskoffTrendDiagram } from "@/app/components/charts/RiskoffTrendDiagram";
import { RiskoffExhaustionDiagram } from "@/app/components/charts/RiskoffExhaustionDiagram";

const LESSONS = [
  { id: "lecon1", title: "FOMC Fade", disabled: false },
  { id: "lecon2", title: "NFP Overreaction", disabled: false },
  { id: "lecon3", title: "Régime Risk-off", disabled: false },
  { id: "lecon4", title: "Filtre macro pré-trade", disabled: false },
];

export default function MacroTradingLecon3Page() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-trading", "lecon3"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Stratégies</Link>
          <span>/</span>
          <Link href="/strategies/macro-trading" className="hover:text-zinc-400 transition-colors">Macro Trading</Link>
          <span>/</span>
          <span className="text-zinc-500">Leçon 3</span>
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
            Régime Risk-off : trader quand le marché fuit le risque
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Le marché ne change pas de régime sur une seule bougie. Le risk-off s&apos;installe progressivement, puis influence durablement la direction dominante des actifs refuges.
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

        <div className="space-y-8">

          {/* Bloc 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-amber-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « Un régime ne se trade pas comme un signal. C&apos;est un contexte qui dure — on l&apos;identifie, on le respecte, on l&apos;exploite tant qu&apos;il tient. »
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prérequis</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Risk-on / risk-off → cf. module Macro</li>
              <li>- Corrélations macro et actifs refuges → cf. module Macro</li>
              <li>- Structures de marché et tendances → cf. module Stratégies</li>
              <li>- Multi-timeframe → cf. module Multi-timeframe Process</li>
            </ul>
          </div>

          {/* Bloc 3 — LE RISK-OFF SE CONFIRME PAR DES SIGNAUX CONCORDANTS */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Le risk-off se confirme par des signaux concordants</h2>

            <div className="my-8">
              <RiskoffSignalsDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Le régime risk-off ne se déduit jamais d&apos;un seul marché. Il s&apos;installe quand plusieurs indicateurs racontent simultanément la même histoire : les indices actions descendent, la volatilité (VIX) monte, le dollar se renforce face aux devises plus risquées, l&apos;or et le franc suisse attirent les flux. Quand ces quatre signaux pointent dans le même sens pendant plusieurs séances, on n&apos;est plus dans un mouvement isolé — on est dans un changement de régime. C&apos;est cette concordance qui permet d&apos;avoir confiance dans la direction des actifs refuges.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Exemple concret</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                Sur une semaine de tensions géopolitiques, le S&amp;P 500 baisse de 3 %, le VIX passe de 14 à 22, le DXY monte de 1,5 %, et XAU/USD passe progressivement de 4 585 $ à 4 705 $ en structure haussière. Les quatre marchés convergent — le régime risk-off est installé, l&apos;or est l&apos;actif directionnel à privilégier dans le sens long tant que la concordance tient.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Points actionnables : la concordance de 3-4 signaux macro confirme le régime — pas un seul</li>
              <li>- Indices baissiers + VIX haussier + Dollar fort + or fort = signature risk-off classique</li>
              <li>- Sans concordance, on ne parle pas encore de régime — juste d&apos;un mouvement</li>
              <li>- La lecture macro précède la lecture technique sur les actifs refuges</li>
            </ul>
          </section>

          {/* Bloc 4 — TRADER DANS LE SENS DU RÉGIME, PAS CONTRE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Trader dans le sens du régime, pas contre</h2>

            <div className="my-8">
              <RiskoffTrendDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Une fois le régime identifié, la discipline opérationnelle est simple : on trade dans son sens, jamais contre. Cela signifie privilégier exclusivement les longs sur l&apos;or et les courts sur les paires risquées tant que la structure macro reste cohérente. Les pullbacks H4 deviennent alors des opportunités d&apos;entrée — on attend que le prix se réajuste sur un support technique, qu&apos;il stabilise, et on entre pour profiter de la continuation. Contre-trader un régime établi, c&apos;est lutter contre la direction de fond — statistiquement perdant.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Exemple concret</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                XAU/USD H4 en régime risk-off établi : impulsion haussière de 4 610 $ à 4 690 $, puis pullback contrôlé vers 4 655 $ sur un ancien support. Stabilisation, puis nouvelle impulsion bullish jusqu&apos;à 4 730 $. Entrée long au retest de 4 655 $ avec SL sous le pullback, target sur la zone de continuation 4 730 $. La structure HH/HL respecte le régime.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Points actionnables : longs prioritaires sur l&apos;or en régime risk-off, jamais l&apos;inverse</li>
              <li>- Les pullbacks sont des entrées, pas des retournements à anticiper</li>
              <li>- Structure HH/HL intacte = régime intact = continuation probable</li>
              <li>- Contre-trader un régime établi = aller contre la statistique</li>
            </ul>
          </section>

          {/* Bloc 5 — LE RISK-OFF S'ESSOUFFLE PROGRESSIVEMENT */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Le risk-off s&apos;essouffle progressivement</h2>

            <div className="my-8">
              <RiskoffExhaustionDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Aucun régime ne dure indéfiniment. L&apos;essoufflement d&apos;un risk-off se lit progressivement : les sommets de plus en plus faibles sur les actifs refuges (chaque nouveau high est moins élevé que le précédent), des corrections H4 plus profondes que dans la phase d&apos;installation, des impulsions bullish qui perdent en amplitude. Les signaux macro accompagnent ce ralentissement : le VIX redescend, les indices se stabilisent, le dollar s&apos;arrête de monter. Quand ces signes apparaissent, on réduit progressivement l&apos;exposition aux longs sur l&apos;or — on n&apos;attend pas la cassure structurelle.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Exemple concret</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                XAU/USD H4 : après une forte tendance haussière depuis 4 590 $, trois sommets successifs faiblissent — 4 735 $, puis 4 720 $, puis 4 705 $. Les corrections passent de 25 $ à 40 $ puis 65 $ d&apos;amplitude. Les impulsions haussières deviennent plus courtes. Le régime n&apos;est pas encore cassé, mais il perd en force — on resserre les SL, on réduit la taille de position, on prépare la transition.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Points actionnables : sommets plus faibles + corrections plus profondes = signal d&apos;essoufflement</li>
              <li>- Le VIX qui redescend confirme le ralentissement macro</li>
              <li>- On réduit l&apos;exposition AVANT la cassure structurelle, pas après</li>
              <li>- L&apos;essoufflement n&apos;est pas un retournement — c&apos;est une transition à surveiller</li>
            </ul>
          </section>

          {/* Bloc 6 — PLAN D'APPLICATION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan d&apos;application : un trade en régime risk-off sur XAU/USD</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Voici la séquence complète d&apos;un trade aligné sur un régime risk-off, du diagnostic macro à la gestion. Cinq étapes, chacune avec son rôle.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Étape 1 — Diagnostic macro</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation : S&amp;P 500 en baisse depuis 3 séances, VIX au-dessus de 20, DXY haussier, XAU haussier</li>
                <li>- Conclusion : régime risk-off confirmé par concordance — biais long uniquement sur l&apos;or</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Étape 2 — Contexte technique H4</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation : XAU/USD en structure HH/HL claire depuis le début du régime, prix actuel 4 690 $</li>
                <li>- Conclusion : structure intacte — on cherche le prochain pullback pour entrer long</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Étape 3 — Attente du pullback</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation : correction H4 vers 4 655 $ (ancien sommet devenu support), stabilisation visible avec mèches basses sur M15</li>
                <li>- Conclusion : zone d&apos;entrée préparée — on attend la première bougie de reprise franche</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Étape 4 — Exécution</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Entrée long : 4 660 $</li>
                <li>- Stop loss : 4 640 $ (sous le pullback)</li>
                <li>- Target : 4 730 $ (zone de continuation)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Étape 5 — Suivi du régime</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Surveiller la concordance des signaux macro tant que la position est ouverte</li>
                <li>- Si le VIX redescend franchement OU si les indices se stabilisent : alerte essoufflement</li>
                <li>- Si la structure HH/HL casse : sortie immédiate, le régime n&apos;est plus valide</li>
              </ul>

              <div className="border-t border-zinc-800/60 pt-3 mt-3">
                <p className="text-sm text-zinc-300 italic text-center">
                  Macro = régime · Structure = direction · Pullback = entrée · Concordance = condition de maintien
                </p>
              </div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "Un régime risk-off se confirme par CONCORDANCE de plusieurs signaux macro — jamais par un seul marché.",
              "Tant que la structure HH/HL tient sur les actifs refuges, on trade dans le sens du régime et on évite tout contre-trade.",
              "Les pullbacks H4 sont des opportunités d’entrée, pas des retournements à anticiper.",
              "L’essoufflement se lit progressivement : sommets plus faibles, corrections plus profondes, VIX qui redescend.",
            ]}
          />

          <LessonExercice
            description="Identifie un régime risk-off récent sur le marché et reconstruis a posteriori le diagnostic + un setup aligné."
            steps={[
              "Repère une semaine où le VIX a clairement monté. Vérifie sur la même fenêtre la direction des indices US, du DXY et de XAU/USD. Note la durée pendant laquelle la concordance a tenu.",
              "Sur XAU/USD H4 pendant cette période : trace la structure HH/HL. Identifie les pullbacks H4 et marque les zones où une entrée long aurait été cohérente avec le régime.",
              "Surveille la transition : à quel moment les sommets ont commencé à faiblir, les corrections à s&apos;approfondir ? Note ce signal d&apos;essoufflement et combien de temps il s&apos;est exprimé avant que la structure ne casse réellement.",
            ]}
          />

          <LessonQuiz
            question="Tu observes un régime risk-off bien installé sur XAU/USD avec structure HH/HL claire en H4. Le prix entame un pullback de 30 $ vers un ancien sommet devenu support. Que fais-tu ?"
            options={[
              "Tu shortes le pullback pour profiter de la correction",
              "Tu attends la stabilisation sur le support puis tu entres long pour profiter de la continuation",
              "Tu fermes ta position long existante : le régime est probablement fini",
              "Tu n'interviens pas tant que le prix n'a pas cassé le sommet précédent",
            ]}
            correctIndex={1}
            explanation="Dans un régime risk-off établi avec structure HH/HL intacte, un pullback H4 vers un ancien support est précisément l&apos;opportunité d&apos;entrée recommandée. On laisse le prix se stabiliser sur le niveau technique, on cherche la première bougie de reprise franche, et on entre dans le sens du régime. Trader contre la direction de fond (shorter le pullback) ou anticiper la fin du régime sans signal d&apos;essoufflement, c&apos;est lutter contre la logique macro qui pilote le mouvement."
            answerExplanations={[
              "Faux. Shorter dans un régime risk-off établi, c&apos;est trader contre le contexte macro qui soutient l&apos;or. Le pullback est une correction technique, pas un retournement — la statistique favorise la continuation.",
              "Correct. La discipline du régime est claire : on entre dans son sens sur les pullbacks. Le support technique offre une entrée serrée, la concordance macro soutient le trade, la structure HH/HL valide la continuation probable.",
              "Faux. Fermer une position long sur un pullback de 30 $, sans signe d&apos;essoufflement (sommets faiblissants, corrections plus profondes, VIX qui redescend), c&apos;est sortir prématurément. Les pullbacks font partie d&apos;une tendance saine.",
              "Faux. Attendre la cassure du sommet précédent pour entrer, c&apos;est entrer beaucoup trop tard — au-dessus du dernier high, sans support technique pour caler le SL. Les meilleures entrées en régime sont sur pullback, pas sur breakout.",
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
                  markLessonComplete(p, "macro-trading", "lecon3");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Leçon 3 du module Macro Trading complétée.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between gap-4">
              <Link href="/strategies/macro-trading/lecon2" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Leçon précédente
              </Link>
              <Link href="/strategies/macro-trading/lecon4" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
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
