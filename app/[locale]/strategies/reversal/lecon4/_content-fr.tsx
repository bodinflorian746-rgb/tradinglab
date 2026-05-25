"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import InvalidationDiagram from "@/app/components/charts/InvalidationDiagram";
import InvalidationTriggersGridDiagram from "@/app/components/charts/InvalidationTriggersGridDiagram";
import SLManagementProgressionDiagram from "@/app/components/charts/SLManagementProgressionDiagram";

const LESSONS = [
  { id: "lecon1", slug: "lecon1", title: "Double top / Double bottom : la signature du retournement", duration: "16 min", disabled: false },
  { id: "lecon2", slug: "lecon2", title: "Head & Shoulders : le retournement majeur", duration: "18 min", disabled: false },
  { id: "lecon3", slug: "lecon3", title: "Divergence RSI : quand le momentum trahit la tendance", duration: "17 min", disabled: false },
  { id: "lecon4", slug: "lecon4", title: "Trader un reversal : checklist d’invalidation", duration: "18 min", disabled: false },
];

export default function ContentFr() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "reversal", "lecon4"));
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
          <span className="text-zinc-500">Leçon 4</span>
        </nav>

        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Débutant
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
            Trader un reversal : checklist d&apos;invalidation
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Entrer sur un reversal est relativement simple : trois patterns sont disponibles, Double top, H&amp;S et Divergence RSI. Le vrai problème : savoir quand le pattern a échoué. Cette leçon fournit une checklist pratique pour identifier une invalidation et couper avant de rendre le compte.
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
            <span className="ml-auto text-xs text-zinc-600">4 / 4 leçons</span>
          </div>
        </header>

        {/* ── Contenu ── */}
        <div className="space-y-8">

          {/* Bloc 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « Sortir d&apos;un trade qui foire vite, ça ne se discute pas. Ça s&apos;exécute. »
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prérequis</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Double Top / Double Bottom → cf. Stratégie Reversal L1</li>
              <li>- Head &amp; Shoulders → cf. Stratégie Reversal L2</li>
              <li>- Divergence RSI → cf. Stratégie Reversal L3</li>
            </ul>
          </div>

          {/* Bloc 3 — POURQUOI 70% ÉCHOUENT */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Pourquoi 70% des reversals échouent pour les retails</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Les patterns de retournement comme le Double top, le H&amp;S ou la divergence RSI ont un taux de réussite réel autour de 55-65% quand ils sont propres. Pour la majorité des retails, ce taux tombe à 30-40%. Pas parce que les patterns sont mauvais. Parce que les retails ne savent pas reconnaître quand le pattern a foiré.</p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Lors d&apos;une entrée sur un double top où le prix remonte au-dessus de la neckline, le cerveau humain présente deux réactions possibles. Soit la sortie est immédiate et la petite perte est encaissée. Soit le retail se dit : &apos;ça va revenir, j&apos;ai vu le pattern&apos;. Le retail moyen choisit la deuxième option. Sur 10 trades comme ça, il en sauve peut-être 2 et il rend 8 avec des pertes 3 à 5 fois plus grosses que prévu.</p>
            <p className="text-zinc-300 leading-relaxed text-sm">Un trader pro a une checklist d&apos;invalidation. Pas une intuition. Pas un feeling. Une liste mécanique de critères qui déclenchent la coupe dès qu&apos;ils s&apos;allument. Pas de débat. Pas de &apos;j&apos;attends une bougie de plus&apos;. La sortie est immédiate, la perte est actée, le trade suivant est étudié. Cette leçon présente cette checklist.</p>
          </section>

          {/* Bloc 4 — CHECKLIST 5 CRITÈRES */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Checklist d&apos;invalidation : 5 critères qui déclenchent la coupe</h2>
            <div className="my-8">
              <InvalidationTriggersGridDiagram />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">Une seule de ces 5 conditions allumée suffit à déclencher la sortie immédiate. Pas de débat, pas d&apos;attente d&apos;une bougie supplémentaire.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">1. Cassure rejetée.</span> <span className="text-zinc-300">Le prix re-clôture au-dessus (ou au-dessous) de la neckline dans les 1-3 bougies suivant l&apos;entrée. Pattern invalidé, sortie immédiate.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">2. Bougie de rejet violente.</span> <span className="text-zinc-300">Une grosse bougie verte englobant les 2-3 bougies baissières précédentes = signal d&apos;absorption. Sortie immédiate même sans re-cassure de neckline.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">3. Volume incohérent.</span> <span className="text-zinc-300">Cassure initiale sans volume particulier + reprise avec gros volume = lecture inversée. Pattern faible, sortie immédiate.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">4. News imprévue dans la fenêtre.</span> <span className="text-zinc-300">News macro qui sort pendant le trade (Fed minutes, géopolitique, données inattendues). Sortie par précaution requise, les news détruisent les patterns.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm md:col-span-2"><span className="text-white font-semibold">5. Temps écoulé sans confirmation.</span> <span className="text-zinc-300">Après 5-8 bougies sur le timeframe d&apos;entrée (H1 ou H4) sans progression vers le TP, pattern faible. Sortie pas obligatoire, mais SL resserré au break-even minimum. Si le pattern fonctionnait, ça serait déjà parti.</span></div>
            </div>
          </section>

          {/* Bloc 5 — RECONNAÎTRE UNE INVALIDATION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Reconnaître une invalidation</h2>
            <div className="my-8">
              <InvalidationDiagram />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">Visuellement, l&apos;invalidation se lit immédiatement sur le graphique. Le marché signale littéralement l&apos;invalidation, la seule action requise est d&apos;écouter le signal et d&apos;exécuter la coupe sans débat.</p>
            <p className="text-zinc-300 leading-relaxed text-sm font-semibold text-zinc-200 mb-2">Signaux visuels à repérer :</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Re-clôture franche au-dessus (ou en dessous) du niveau cassé, critère 1.</li>
              <li>- Bougie d&apos;absorption verte large englobant les 2-3 baissières précédentes, critère 2.</li>
              <li>- Volume contraire à la cassure initiale, critère 3.</li>
              <li>- Stagnation prolongée sans progression vers le TP, critère 5.</li>
            </ul>
          </section>

          {/* Bloc 6 — 3 CAS PRATIQUES CHIFFRÉS */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">3 cas pratiques chiffrés : quand le pattern foire</h2>

            {/* Cas 1 */}
            <div className="mb-6 last:mb-0">
              <h3 className="text-base font-semibold text-zinc-100 mb-2">Cas 1 : Double top sur EUR/USD qui s&apos;invalide</h3>
              <p className="text-zinc-300 leading-relaxed text-sm mb-2">Entrée short EUR/USD prise à 1.1795 après cassure de la neckline, scénario de la Leçon 4.1. SL à 1.1835, TP à 1.1715. Position ouverte depuis 30 minutes. Le prix descend d&apos;abord à 1.1780, puis remonte vivement. Bougie H1 qui clôture à 1.1810.</p>
              <p className="text-zinc-300 leading-relaxed text-sm mb-3">Le prix a re-cassé la neckline à 1.1800 vers le haut. Le double top est invalidé, critère 1. La bougie de remontée est large et englobe les 2 bougies baissières précédentes, critère 2. Pas de news imminente. 2 critères sur 5 sont allumés.</p>
              <p className="text-sm text-zinc-300 leading-relaxed border-l-2 border-emerald-500/50 pl-3 py-1">
                <span className="font-semibold text-emerald-400">Action :</span> la position est coupée à 1.1810. Perte : 15 pips au lieu des 40 pips prévus en cas d&apos;attente du SL. 25 pips sauvés.
              </p>
            </div>

            <div className="border-t border-zinc-800/60 my-6" />

            {/* Cas 2 */}
            <div className="mb-6 last:mb-0">
              <h3 className="text-base font-semibold text-zinc-100 mb-2">Cas 2 : H&amp;S sur XAU qui se transforme en continuation</h3>
              <p className="text-zinc-300 leading-relaxed text-sm mb-2">Entrée short XAU/USD prise à 4 570$ après cassure neckline d&apos;un H&amp;S, scénario Leçon 4.2. SL à 4 630$, TP à 4 480$. Le prix descend bien à 4 540$ pendant 2 bougies, puis remonte fortement.</p>
              <p className="text-zinc-300 leading-relaxed text-sm mb-3">Bougie H1 qui clôture à 4 595$, au-dessus de la neckline mais sous l&apos;épaule droite. Vérification : cassure rejetée, critère 1, volume cohérent sur la remontée, critère 3. Le pattern H&amp;S est en train de se transformer en simple pause dans la tendance haussière. Pas d&apos;attente que le prix re-teste l&apos;épaule droite à 4 625$.</p>
              <p className="text-sm text-zinc-300 leading-relaxed border-l-2 border-emerald-500/50 pl-3 py-1">
                <span className="font-semibold text-emerald-400">Action :</span> la position est coupée à 4 595$. Perte : 25$ par unité au lieu des 60$ prévus. Plus de la moitié du risque est sauvée.
              </p>
            </div>

            <div className="border-t border-zinc-800/60 my-6" />

            {/* Cas 3 */}
            <div>
              <h3 className="text-base font-semibold text-zinc-100 mb-2">Cas 3 : Divergence RSI sans cassure de structure</h3>
              <p className="text-zinc-300 leading-relaxed text-sm mb-2">Une divergence baissière propre est repérée sur XAU H1. Prix HH à 4 640$, RSI LH à 68. La tentation d&apos;entrer short directement reste forte. Mais la règle reste claire : &apos;une divergence seule ne suffit JAMAIS&apos;, Leçon 4.3.</p>
              <p className="text-zinc-300 leading-relaxed text-sm mb-3">La cassure du creux structurel à 4 570$ est attendue. Pendant 6 bougies H1, le prix oscille entre 4 580$ et 4 645$. Il ne casse JAMAIS le creux à 4 570$. Le critère 5, temps écoulé sans confirmation, s&apos;allume. L&apos;entrée n&apos;est pas prise, malgré la divergence visible.</p>
              <p className="text-sm text-zinc-300 leading-relaxed border-l-2 border-emerald-500/50 pl-3 py-1">
                <span className="font-semibold text-emerald-400">Action :</span> aucune entrée. 100% du capital est préservé sur ce trade non-pris. La divergence RSI sans cassure de structure n&apos;est pas un setup tradable.
              </p>
            </div>
          </section>

          {/* Bloc 7 — COUPER RAPIDEMENT */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Couper rapidement (sans hésiter)</h2>
            <div className="my-8">
              <SLManagementProgressionDiagram />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Lorsqu&apos;un critère de la checklist s&apos;active, la sortie est immédiate, manuelle, à la clôture de la bougie en cours sur le timeframe d&apos;entrée, H1 ou H4. Pas avant la clôture, sinon une sortie trop précoce reste possible sur un faux signal. Pas la bougie d&apos;après, sinon trop de risque est rendu. À la clôture confirmée.</p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Le piège émotionnel à éviter : &apos;j&apos;attends une bougie de plus pour confirmer&apos;. NON. Le SL est déjà placé dès l&apos;entrée, donc la perte max est limitée. Mais si une bougie supplémentaire est attendue à chaque invalidation, une coupe à -0,5R (à la moitié du SL) se transforme en perte complète à -1R (au SL). Sur 10 trades qui foirent, c&apos;est la différence entre -5R et -10R. La règle pro : la première confirmation déclenche l&apos;action.</p>
            <p className="text-zinc-300 leading-relaxed text-sm">En l&apos;absence de surveillance active, le SL doit être resserré après l&apos;entrée. Pour Double top ou H&amp;S, le SL se déplace de sa position classique (au-dessus de la tête ou de l&apos;épaule) vers la neckline elle-même. Pour divergence RSI, il se déplace au dernier creux structurel. Le marché coupera automatiquement si le pattern s&apos;invalide. Un peu de marge est sacrifiée en échange de la paix mentale, mais le SL initial reste TOUJOURS en place dès l&apos;entrée.</p>
          </section>

          {/* Bloc 8 — CALCUL RETAIL META */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Calcul retail : ce qui est sauvé en coupant tôt</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">Couper à l&apos;invalidation = ne perdre qu&apos;une fraction du risque initial. Comparaison concrète selon la taille du compte.</p>

            <p className="text-zinc-300 leading-relaxed text-sm font-semibold text-zinc-200 mb-2">Scénario : coupe à -50% du SL prévu (à l&apos;invalidation)</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-4">
              <li>- Compte 300€ → risque prévu 15€, perte réelle ~7€ (au lieu de 15€)</li>
              <li>- Compte 500€ → risque prévu 15€, perte réelle ~7€</li>
              <li>- Compte 1 000€ → risque prévu 20€, perte réelle ~10€</li>
              <li>- Compte 2 500€ → risque prévu 50€, perte réelle ~25€</li>
            </ul>

            <p className="text-zinc-300 leading-relaxed text-sm font-semibold text-zinc-200 mb-2">Sur 10 trades qui foirent : économie totale</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-3">
              <li>- Compte 300€ → ~70€ économisés au lieu de 150€ perdus</li>
              <li>- Compte 500€ → ~70€ économisés</li>
              <li>- Compte 1 000€ → ~100€ économisés</li>
              <li>- Compte 2 500€ → ~250€ économisés</li>
            </ul>

            <p className="text-zinc-300 leading-relaxed text-sm">En coupant à l&apos;invalidation, les pertes sont réduites de 50% sur les trades qui foirent. Sur 100 trades dont 40-50 perdants, ça fait la différence entre un compte qui survit et un compte qui fond.</p>
          </section>

          <LessonKeyPoints
            points={[
              "70% des reversals retails échouent parce que le trader ne sait pas reconnaître une invalidation. Pas parce que le pattern est mauvais.",
              "La checklist 5 critères : cassure rejetée, bougie de rejet violente, volume incohérent, news imprévue, temps écoulé.",
              "La sortie se fait à la clôture de la bougie en cours. Pas avant. Pas la bougie d’après. À la clôture.",
              "Couper à l’invalidation = réduire la perte de 50% par rapport au SL initial. Sur 100 trades, ça change la rentabilité globale.",
            ]}
          />

          <LessonExercice
            description="Tu es entré short XAU/USD à 4 720$ sur un double top. SL à 4 760$, TP à 4 640$. Position ouverte depuis 1 heure. Le prix descend à 4 705$, puis remonte fortement. Bougie H1 qui clôture à 4 745$ avec un volume 2x supérieur à la moyenne. Que fais-tu ?"
            steps={[
              "Vérifier le critère 1, cassure rejetée : le prix a re-cassé la neckline à 4 720$ vers le haut, OUI",
              "Vérifier le critère 2, bougie de rejet violente : large bougie verte qui clôture à 4 745$, OUI",
              "Vérifier le critère 3, volume incohérent : volume 2x supérieur pendant la remontée, OUI",
              "3 critères sur 5 allumés : aucun débat, tu coupes immédiatement à la clôture",
              "Couper à 4 745$ : perte de 25$ par unité au lieu des 40$ prévus si tu attendais le SL à 4 760$, tu sauves plus d’un tiers de ton risque",
            ]}
          />

          <LessonQuiz
            question="Quel est le critère principal d’invalidation d’un double top ou d’un H&S après l’entrée ?"
            options={[
              "Le prix descend trop vite vers le TP",
              "Le prix re-clôture au-dessus de la neckline dans les 1-3 bougies suivantes",
              "Le volume baisse",
              "Le RSI repasse au-dessus de 50",
            ]}
            correctIndex={1}
            explanation="Le critère 1, cassure rejetée, est le déclencheur principal. Si le prix re-clôture au-dessus de la neckline dans les 1-3 bougies qui suivent l’entrée, le pattern est invalidé. Le marché signale littéralement l’invalidation. La sortie est immédiate."
          />

          <LessonQuiz
            question="Quand une invalidation est identifiée, la position est coupée :"
            options={[
              "Immédiatement, avant la clôture de la bougie",
              "À la clôture de la bougie en cours",
              "À la bougie suivante pour confirmer",
              "Au SL initial sans rien changer",
            ]}
            correctIndex={1}
            explanation="La sortie se fait à la clôture de la bougie en cours sur le timeframe d’entrée. Avant la clôture = risque de sortir sur un faux signal. La bougie d’après = trop de risque rendu. La règle pro : première confirmation déclenche l’action."
          />

          <LessonQuiz
            question="Pourquoi 70% des reversals échouent pour les retails ?"
            options={[
              "Parce que les patterns ne fonctionnent pas",
              "Parce que les retails ne savent pas reconnaître une invalidation et gardent leurs positions perdantes",
              "Parce que les brokers manipulent les prix",
              "Parce que les retails utilisent le levier maximum proposé par leur broker",
            ]}
            correctIndex={1}
            explanation="Les patterns ont un taux de réussite réel autour de 55-65% quand ils sont propres. Pour la majorité des retails, ce taux tombe à 30-40% parce qu’ils ne savent pas reconnaître quand le pattern a foiré et gardent leurs positions en espérant un retour."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "reversal", "lecon4");
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
                  <p className="text-sm font-semibold text-emerald-400">Module Reversal &amp; Retournements terminé</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Toutes les leçons du module ont été complétées.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <Link href="/strategies/reversal/lecon3" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Leçon 3
              </Link>
              <Link href="/strategies/reversal" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
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
