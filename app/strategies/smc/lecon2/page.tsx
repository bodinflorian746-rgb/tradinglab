"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { BOSDiagram } from "@/app/components/charts/BOSDiagram";
import { CHoCHDiagram } from "@/app/components/charts/CHoCHDiagram";
import BOSvsCHoCHComparisonDiagram from "@/app/components/charts/BOSvsCHoCHComparisonDiagram";
import BOSCHoCHSequenceDiagram from "@/app/components/charts/BOSCHoCHSequenceDiagram";
import BOSFakeoutDiagram from "@/app/components/charts/BOSFakeoutDiagram";

const LESSONS = [
  { id: "lecon1", title: "Leçon 1", disabled: false },
  { id: "lecon2", title: "BOS et CHoCH : lire les signaux structurels institutionnels", disabled: false },
  { id: "lecon3", title: "Leçon 3", disabled: true },
  { id: "lecon4", title: "Leçon 4", disabled: true },
  { id: "lecon5", title: "Leçon 5", disabled: true },
];

export default function SmcLecon2Page() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "smc", "lecon2"));
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
          <span className="text-zinc-500">Leçon 2</span>
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
            BOS et CHoCH : lire les signaux structurels institutionnels
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              BOS et CHoCH sont les deux signaux structurels fondamentaux de la lecture SMC. Cette leçon enseigne à les qualifier opérationnellement, à comprendre la séquence de retournement en 3 étapes, et à éviter les pièges classiques.
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

        {/* ── Contenu ── */}
        <div className="space-y-8">

          {/* Bloc 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-blue-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « Un BOS confirme la tendance. Un CHoCH la remet en cause. Lire la différence en quelques secondes change la lecture du marché. »
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prérequis</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Market Structure SMC, HH/HL/LL/LH → cf. Stratégie SMC L1</li>
              <li>- Bougie de cassure, displacement → cf. Formation Trading L2</li>
              <li>- Tendance directionnelle multi-timeframe → cf. Formation Trading L3</li>
            </ul>
          </div>

          {/* Bloc 3 — DISTINCTION BOS vs CHoCH */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Distinction BOS vs CHoCH</h2>

            <div className="my-8">
              <BOSvsCHoCHComparisonDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              BOS et CHoCH désignent deux types distincts de cassure structurelle, avec des conséquences opérationnelles opposées. La distinction repose sur la nature du niveau cassé : extrême dans le sens de la tendance ou creux/sommet de structure inverse.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-emerald-400 font-semibold text-sm mb-2">BOS — Break of Structure</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Cassure dans le sens de la tendance (HH en haussier, LL en baissier)</li>
                  <li>- Valide la continuation, structure HH/HL ou LH/LL intacte</li>
                  <li>- Autorise les nouvelles positions dans le sens de la tendance</li>
                </ul>
              </div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-amber-400 font-semibold text-sm mb-2">CHoCH — Change of Character</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Cassure dans le sens opposé à la tendance (HL en haussier, LH en baissier)</li>
                  <li>- Signale un retournement potentiel, rupture de la structure</li>
                  <li>- Déclenche la sortie des positions, prépare l&apos;inversion après confirmation</li>
                </ul>
              </div>
            </div>

            <BOSDiagram />
            <CHoCHDiagram />
          </section>

          {/* Bloc 4 — CRITÈRES DE QUALIFICATION D'UN BOS VALIDE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Critères de qualification d&apos;un BOS valide</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">4 critères qualifient un BOS comme exploitable institutionnellement. Une cassure qui ne valide pas les 4 critères reste hypothétique et expose au fake breakout.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-white font-semibold text-sm mb-2">1. Clôture nette au-delà du niveau</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Bougie clôt complètement au-delà du HH/LL, mèche seule = test</li>
                  <li>- Validation sur clôture du timeframe d&apos;analyse (H4 ou Daily)</li>
                </ul>
              </div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-white font-semibold text-sm mb-2">2. Displacement directionnel marqué</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Amplitude nettement supérieure à la moyenne récente</li>
                  <li>- Seuil opérationnel : corps ≥ 1,5× moyenne des 20 bougies</li>
                </ul>
              </div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-white font-semibold text-sm mb-2">3. Absence de réintégration</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Prix maintenu au-delà du niveau cassé sur 3-5 bougies</li>
                  <li>- Réintégration immédiate invalide rétroactivement le BOS</li>
                </ul>
              </div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-white font-semibold text-sm mb-2">4. Alignement multi-timeframe</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- BOS H4 cohérent avec biais Daily (HTF)</li>
                  <li>- BOS haussier au-dessus MM200, baissier en dessous</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Bloc 5 — SÉQUENCE BOS → CHoCH → MITIGATION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Séquence opérationnelle BOS → CHoCH → mitigation</h2>

            <div className="my-8">
              <BOSCHoCHSequenceDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">Le retournement structurel institutionnel suit une séquence en 3 étapes. Cette séquence garantit que l&apos;inversion ne se prend qu&apos;après confirmation complète.</p>

            <ol className="space-y-2 text-sm text-zinc-300 list-decimal pl-5">
              <li><span className="font-semibold text-white">BOS contre-tendance</span> — cassure du dernier HL (haussier) ou LH (baissier). Ouvre la possibilité du retournement sans le confirmer. Sortie progressive des positions, pas encore d&apos;inversion.</li>
              <li><span className="font-semibold text-white">Formation de la nouvelle structure</span> — 5 à 15 bougies pour produire un premier LL/LH (retournement baissier) ou HH/HL (retournement haussier). Aucune entrée d&apos;inversion pendant cette phase d&apos;observation.</li>
              <li><span className="font-semibold text-white">CHoCH confirmé + mitigation</span> — nouvelle structure inverse complète. Entrée sur le retracement vers le niveau structurel cassé (ex-HL devenu résistance, ou ex-LH devenu support) avec signal de rejet. Stop loss serré possible.</li>
            </ol>
          </section>

          {/* Bloc 6 — FAUX BOS + ERREURS */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Faux BOS — mèche perce, clôture invalide</h2>

            <div className="my-8">
              <BOSFakeoutDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Un BOS qui paraît validé sur la mèche peut être invalidé rétroactivement par la clôture sous le niveau ou par une réintégration rapide. 3 erreurs récurrentes dégradent la lecture.
            </p>

            <div className="space-y-3">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-red-400 font-semibold text-sm mb-1">1. Confondre mèche et clôture</p>
                <p className="text-zinc-300 text-sm">Valider sur mèche expose au retour à la zone d&apos;origine. Attendre la clôture complète de la bougie.</p>
              </div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-red-400 font-semibold text-sm mb-1">2. Confondre BOS et CHoCH</p>
                <p className="text-zinc-300 text-sm">HH/LL cassé = BOS (continuation). HL/LH cassé = CHoCH (retournement potentiel).</p>
              </div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-red-400 font-semibold text-sm mb-1">3. Trader le 1er BOS contre-tendance sans CHoCH</p>
                <p className="text-zinc-300 text-sm">Inversion prise avant confirmation = retour à la tendance d&apos;origine. Attendre la séquence complète LL+LH ou HH+HL.</p>
              </div>
            </div>
          </section>

          {/* Bloc 7 — PLAN DE TRADE EUR/USD H4 */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan de trade : BOS haussier EUR/USD H4</h2>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              EUR/USD en tendance haussière H4 depuis 4 semaines. Structure : 3 HL à 1.1620, 1.1680, 1.1720, et 3 HH à 1.1700, 1.1760, 1.1820. MM200 Daily à 1.1500, prix au-dessus. Bougie H4 vient de clôturer à 1.1858, soit 38 pips au-dessus du HH 1.1820, displacement marqué. 5 bougies maintiennent leur clôture au-dessus de 1.1820 sans réintégration. Aucune news macro dans la fenêtre. Le dernier HL 1.1720 n&apos;a pas été cassé : aucun CHoCH, BOS haussier validé.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Setup</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Entrée : 1.1822 (retest du niveau ex-résistance devenu support, signal de rejet M15)</li>
                <li>- Stop loss : 1.1710 (sous le dernier HL 1.1720 avec marge de 10 pips)</li>
                <li>- Take profit : 1.1990 (projection structurelle, prochaine extension de l&apos;impulsion)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Calcul du R/R</p>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>- Risque : 1.1822 - 1.1710 = 112 pips</li>
                <li>- Gain potentiel : 1.1990 - 1.1822 = 168 pips</li>
                <li>- R/R : 168 / 112 = 1,5</li>
                <li>- Setup exploitable au seuil minimum institutionnel.</li>
              </ul>
            </div>
          </section>

          {/* Bloc 8 — CALCUL RETAIL */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Calcul retail</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Le risque par trade selon le capital appliqué à ce setup.
            </p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-3">
              <li>- Compte 300€ → 5% = risque 15€, gain potentiel 22,50€</li>
              <li>- Compte 500€ → 3% = risque 15€, gain potentiel 22,50€</li>
              <li>- Compte 1 000€ → 2% = risque 20€, gain potentiel 30€</li>
              <li>- Compte 2 500€ → 2% = risque 50€, gain potentiel 75€</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">
              Le R/R reste 1,5:1 peu importe la taille du compte. Ce qui change, c&apos;est la taille de lot et le pourcentage de risque adapté au capital.
            </p>
          </section>

          <LessonKeyPoints
            points={[
              "BOS confirme la tendance par la cassure d’un extrême structurel (HH ou LL). CHoCH la remet en cause par la cassure d’un creux ou sommet inverse (HL ou LH). Le niveau cassé dicte le signal.",
              "4 critères qualifient un BOS valide : clôture nette, displacement marqué, absence de réintégration, alignement multi-timeframe.",
              "La séquence de retournement suit 3 étapes : BOS contre-tendance, formation de la nouvelle structure, CHoCH confirmé.",
              "L’entrée d’inversion se prend uniquement après CHoCH confirmé, sur la zone de mitigation avec signal de rejet.",
            ]}
          />

          <LessonExercice
            description="Sur XAU/USD H4, la tendance baissière en cours affiche 3 LH successifs à 4 720$, 4 660$ et 4 620$, et 3 LL successifs à 4 660$, 4 600$ et 4 540$. Une bougie H4 vient de clôturer à 4 670$, soit 50$ au-dessus du dernier LH à 4 620$. 4 bougies suivantes maintiennent leur clôture au-dessus de 4 620$. Aucune news macro dans la fenêtre. Comment se construit la lecture BOS/CHoCH ?"
            steps={[
              "Identifier la nature du niveau cassé : 4 620$ est le dernier LH (sommet de structure baissière inverse) — il s’agit d’un signal de retournement potentiel, pas d’une continuation.",
              "Qualifier la cassure : clôture franche à 4 670$ (50$ au-dessus du LH), displacement supérieur à la moyenne récente, aucune réintégration sur 4 bougies — cassure validée structurellement.",
              "Classifier le signal : la cassure du dernier LH constitue un BOS contre-tendance, premier signal de retournement potentiel de la tendance baissière.",
              "Attendre la formation de la nouvelle structure : observer la formation d’un premier HL (creux plus haut que le précédent) après le BOS contre-tendance.",
              "Valider le CHoCH avant inversion : confirmer le CHoCH par la séquence complète HL plus HH dans la nouvelle structure haussière avant toute prise de position long. La sortie des positions short existantes peut se déclencher dès le BOS contre-tendance, l’inversion exige le CHoCH.",
            ]}
          />

          <LessonQuiz
            question="Quelle est la différence opérationnelle fondamentale entre un BOS et un CHoCH sur une tendance haussière ?"
            options={[
              "Le BOS casse un HL, le CHoCH casse un HH",
              "Le BOS casse un HH (extrême haussier), le CHoCH casse un HL (creux structurel)",
              "Les deux désignent la même cassure structurelle",
              "Le BOS s’utilise sur M15, le CHoCH sur Daily",
            ]}
            correctIndex={1}
            explanation="Sur tendance haussière, un BOS valide la continuation par la cassure du dernier HH (extrême dans le sens de la tendance). Un CHoCH amorce un retournement par la cassure du dernier HL (creux structurel qui définit la structure haussière). La nature du niveau cassé — HH vs HL — dicte la nature du signal et la décision opérationnelle."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "smc", "lecon2");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Leçon 2 du module SMC : Penser institutionnel complétée.</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-5 flex items-center justify-between">
              <Link href="/strategies/smc/lecon1" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Leçon 1
              </Link>
              <span className="inline-flex items-center gap-2 text-sm text-zinc-700 cursor-not-allowed">
                Leçon 3 — À venir
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
