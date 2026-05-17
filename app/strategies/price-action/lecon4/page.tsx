"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { MultiTimeframeDiagram } from "@/app/components/charts/MultiTimeframeDiagram";
import MultiTFEntryDiagram from "@/app/components/charts/MultiTFEntryDiagram";
import { TradePlanDiagram } from "@/app/components/charts/TradePlanDiagram";
import MultiTFAlignmentCheckDiagram from "@/app/components/charts/MultiTFAlignmentCheckDiagram";
import MultiTFConflictDiagram from "@/app/components/charts/MultiTFConflictDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Lire une bougie", disabled: false },
  { id: "lecon2", title: "Pin bar",          disabled: false },
  { id: "lecon3", title: "Engulfing",        disabled: false },
  { id: "lecon4", title: "Setup MTF",        disabled: false },
];

export default function SetupMTFPage() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "price-action", "lecon4"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Stratégies</Link>
          <span>/</span>
          <Link href="/strategies/price-action" className="hover:text-zinc-400 transition-colors">Price Action</Link>
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
            Setup multi-timeframe : aligner 3 horizons
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Cette leçon enseigne à construire une entrée précise en alignant 3 timeframes : Daily (biais), H4 (zone), M15 (signal). Sans alignement, pas de setup.
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

        <div className="space-y-8">

          {/* Bloc 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « Une entrée propre se construit sur 3 niveaux : le contexte donne la direction, la zone donne le lieu, le signal donne le moment. »
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prérequis</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Lecture de bougie → cf. Stratégie PA L1</li>
              <li>- Pin bar et engulfing → cf. Stratégie PA L2 et L3</li>
              <li>- Concept de timeframes → cf. Formation Trading L1</li>
            </ul>
          </div>

          {/* Bloc 3 — LECTURE TOP-DOWN */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Lecture top-down Daily → H4 → M15</h2>

            <div className="my-8">
              <MultiTimeframeDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Chaque timeframe joue un rôle distinct et non interchangeable. La séquence top-down garantit que les entrées s&apos;alignent toujours sur le biais majeur.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- <span className="font-semibold text-zinc-100">Daily</span> = biais directionnel global (HH/HL haussier ou LH/LL baissier)</li>
              <li>- <span className="font-semibold text-zinc-100">H4</span> = zones majeures de support / résistance, lieux potentiels d&apos;entrée</li>
              <li>- <span className="font-semibold text-zinc-100">H1</span> = confirmation structurelle de l&apos;alignement avec le Daily</li>
              <li>- <span className="font-semibold text-zinc-100">M15</span> = timing fin via signal de price action (pin bar, engulfing)</li>
            </ul>
          </section>

          {/* Bloc 4 — VALIDER L'ALIGNEMENT */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Valider l&apos;alignement</h2>

            <div className="my-8">
              <MultiTFAlignmentCheckDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Un setup multi-timeframe est validé uniquement lorsque les 4 critères d&apos;alignement sont réunis. Un seul manquant invalide le setup.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Tendance Daily clairement orientée (HH/HL ou LH/LL sur 30-50 dernières bougies)</li>
              <li>- Zone H4 identifiée et tradable à proximité du prix (distance ≤ 100 pips/$ du prix actuel)</li>
              <li>- Structure H1 alignée avec la tendance Daily (pas de correction temporaire en cours)</li>
              <li>- Signal M15 explicite au contact de la zone H4 (pin bar, engulfing, réaction immédiate)</li>
            </ul>
          </section>

          {/* Bloc 5 — CONFLIT MULTI-TF */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Conflit multi-TF (à ne pas trader)</h2>

            <div className="my-8">
              <MultiTFConflictDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Lorsque les timeframes affichent des biais conflictuels, aucun setup n&apos;est exploitable. La discipline consiste à ne pas trader tant que l&apos;alignement n&apos;est pas rétabli.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Daily haussier + H4 baissier = correction en cours, attendre la reprise H4</li>
              <li>- Daily ambigu (consolidation latérale) = pas de biais, pas de trade jusqu&apos;à clarification</li>
              <li>- M15 contre Daily = bruit de court terme, ignorer le signal isolé</li>
            </ul>
          </section>

          {/* Bloc 6 — PLAN DE TRADE CHIFFRÉ */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan de trade : setup MTF EUR/USD</h2>

            <div className="my-8">
              <MultiTFEntryDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              EUR/USD en tendance haussière confirmée sur Daily (HH/HL sur 6 semaines). Zone H4 support à 1.1750-1.1770 (3 touches, fraîche). H1 aligné haussier. Pin bar M15 imprimée au contact de la zone.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Setup</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Daily : dernier HH 1.1840, dernier HL 1.1720, biais long</li>
                <li>- H4 : zone support 1.1750-1.1770, 3 touches en 5 semaines</li>
                <li>- M15 : pin bar haussière, mèche basse 1.1762, clôture 1.1778</li>
                <li>- Entrée long : 1.1778 (clôture de la pin bar M15)</li>
                <li>- Stop loss : 1.1745 (5 pips sous la zone H4)</li>
                <li>- Take profit niveau 1 : 1.1840 (HH Daily) — niveau 2 : 1.1900 (extension)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Calcul du R/R</p>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>- Risque : 1.1778 - 1.1745 = 33 pips</li>
                <li>- Gain niveau 1 : 1.1840 - 1.1778 = 62 pips → R/R 1,88</li>
                <li>- Gain niveau 2 : 1.1900 - 1.1778 = 122 pips → R/R 3,70</li>
                <li>- Le setup vise prioritairement le TP niveau 2 pour un R/R optimal</li>
              </ul>
            </div>

            <div className="my-8">
              <TradePlanDiagram />
            </div>

            <p className="text-white font-semibold text-sm mb-2">Calcul retail</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-3">
              <li>- Compte 300€ → 5% = risque 15€, gain potentiel 56€</li>
              <li>- Compte 500€ → 3% = risque 15€, gain potentiel 56€</li>
              <li>- Compte 1 000€ → 2% = risque 20€, gain potentiel 74€</li>
              <li>- Compte 2 500€ → 2% = risque 50€, gain potentiel 185€</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">
              Le R/R reste 3,70:1 peu importe la taille du compte.
            </p>
          </section>

          <LessonKeyPoints
            points={[
              "Procédure top-down obligatoire : Daily → H4 → H1 → M15. Pas d’analyse directionnelle sur M15 isolé.",
              "Daily = biais. H4 = zones. H1 = alignement structurel. M15 = timing d’entrée.",
              "Les 4 critères d’alignement doivent tous être validés. Un seul manquant invalide le setup.",
              "Stop loss au-delà de la zone H4 avec marge 5-10 pips. Take profit vers la prochaine zone H4 dans le sens du trade.",
            ]}
          />

          <LessonExercice
            description="Sur XAU/USD, le Daily est en tendance haussière avec dernier HH à 4 680$ et dernier HL à 4 520$. Une zone de support H4 est identifiée entre 4 560$ et 4 580$ (3 touches en 5 semaines). Le prix actuel est à 4 595$. La structure H1 est alignée haussière. Le prix descend toucher 4 575$ puis imprime une engulfing haussière M15 avec clôture à 4 595$. Comment se construit le plan de trade ?"
            steps={[
              "Valider les 4 critères d’alignement : tendance Daily haussière confirmée, zone H4 4 560$-4 580$ tradable (3 touches, fraîche), structure H1 alignée haussière, signal M15 engulfing haussière au contact de la zone H4",
              "Placer l’entrée long à 4 595$ (clôture de l’engulfing M15)",
              "Placer le stop loss à 4 555$ (5$ sous le bas de la zone H4 à 4 560$)",
              "Placer le take profit niveau 1 à 4 680$ (HH Daily précédent) ou niveau 2 à 4 750$ (projection extension Daily)",
              "Calculer les R/R : Risque 40$, gain niveau 1 = 85$ → R/R 2,12 ; gain niveau 2 = 155$ → R/R 3,88. Taille de position selon le risque par trade adapté au capital",
            ]}
          />

          <LessonQuiz
            question="Une bougie présente un corps réduit, une mèche basse longue (3 fois la taille du corps) et une clôture dans le tiers supérieur de la fourchette. Quel pattern et quel message du marché ?"
            options={[
              "Doji d’indécision, équilibre entre les camps",
              "Pin bar haussière, rejet à la baisse confirmé",
              "Marubozu baissier, domination totale des vendeurs",
              "Engulfing baissier, bascule de pouvoir vers les vendeurs",
            ]}
            correctIndex={1}
            explanation="Corps réduit + mèche basse 3 fois plus longue que le corps + clôture dans le tiers supérieur = signature exacte d’une pin bar haussière. Le message du marché : tentative d’extension baissière rapidement rejetée par les acheteurs, qui reprennent le contrôle avant la clôture. Signal de rejet à la baisse particulièrement opérationnel s’il apparaît au contact d’un niveau structurel."
          />

          <LessonQuiz
            question="Quelle est la condition principale pour valider une bullish engulfing comme signal de retournement opérationnel ?"
            options={[
              "Le corps de la 2e bougie englobe entièrement le corps de la 1ère, dans le sens opposé, à un niveau structurel significatif",
              "La 2e bougie a un volume supérieur de 200% à la moyenne",
              "La 2e bougie clôture exactement au plus haut de la session",
              "La 2e bougie est précédée d’un doji obligatoire",
            ]}
            correctIndex={0}
            explanation="Une bullish engulfing valide exige 3 conditions : le corps de la 2e bougie englobe entièrement le corps de la 1ère (qui est baissière), la direction inverse de la 1ère, et l’apparition à un niveau structurel significatif (support, résistance, zone OB). Sans contexte structurel, l’engulfing perd sa puissance opérationnelle."
          />

          <LessonQuiz
            question="Dans la procédure top-down multi-timeframe, quel est le rôle exclusif du M15 ?"
            options={[
              "Fournir le biais directionnel global",
              "Identifier les zones majeures de support et résistance",
              "Fournir le timing d’entrée précis via un signal de price action",
              "Confirmer la tendance Daily",
            ]}
            correctIndex={2}
            explanation="Le M15 est exclusivement un outil de timing fin. Le biais directionnel vient du Daily. Les zones viennent du H4. L’alignement structurel vient du H1. Le M15 fournit uniquement le signal de price action (pin bar, engulfing, réaction nette) qui confirme l’entrée au contact de la zone H4."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "price-action", "lecon4");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Leçon 4 du module Price Action complétée.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/strategies/price-action/lecon3"
                className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="text-zinc-600">
                  <path d="M9.5 3.5l-4 4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Leçon 3 — Engulfing : le retournement de force
              </Link>
              <Link
                href="/strategies/price-action"
                className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Module terminé — Retour au module
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M5.5 10.5l4-4-4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
