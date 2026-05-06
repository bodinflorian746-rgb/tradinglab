"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import EngulfingSetupDiagram from "@/app/components/charts/EngulfingSetupDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Lire une bougie", disabled: false },
  { id: "lecon2", title: "Pin bar",          disabled: false },
  { id: "lecon3", title: "Engulfing",        disabled: false },
  { id: "lecon4", title: "Leçon 4",          disabled: true },
];

export default function EngulfingPage() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "price-action", "lecon3"));
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
          <span className="text-zinc-500">Leçon 3</span>
        </nav>

        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Débutant
            </span>
            <span className="text-zinc-700 text-xs">·</span>
            <span className="text-xs text-zinc-600">14 min</span>
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
            Engulfing : le retournement de force
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-300 leading-relaxed">
              Un engulfing = une bascule de pouvoir en 2 bougies.
            </p>
            <p className="text-[15px] text-zinc-300 leading-relaxed mt-2">
              La 2ème bougie englobe la 1ère et montre qu&apos;un camp vient de reprendre le contrôle avec force.
            </p>
            <p className="text-[15px] text-zinc-300 leading-relaxed mt-2">
              Là où la pin bar montre un rejet, l&apos;engulfing montre un changement de direction net.
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
                    {lesson.title}
                  </span>
                </div>
              );
            })}
            <span className="ml-auto text-xs text-zinc-600">3 / 4 leçons</span>
          </div>
        </header>

        {/* ── Contenu ── */}
        <div className="space-y-5">

          {/* Bloc 1 — Anatomie d'un engulfing valide */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Anatomie d&apos;un engulfing valide</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Un engulfing valide respecte 3 critères stricts.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">1. Le corps de la 2ème bougie englobe entièrement le corps de la 1ère.</span><br />
              Les mèches ne comptent pas. Seul le corps compte. Si la 2ème bougie ne recouvre qu&apos;une partie du corps précédent, ce n&apos;est pas un engulfing valide.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">2. Les 2 bougies sont de sens opposé.</span><br />
              Bullish engulfing : 1ère bougie bearish, 2ème bougie bullish. Les acheteurs reprennent le contrôle.<br />
              Bearish engulfing : 1ère bougie bullish, 2ème bougie bearish. Les vendeurs reprennent le contrôle.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              <span className="font-semibold text-zinc-200">3. La 2ème bougie est clairement plus grande que la 1ère.</span><br />
              Pas 5% plus grande. Il faut un vrai contraste. La 2ème bougie doit montrer une prise de force nette.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Un engulfing faible n&apos;est pas un signal.<br />
              C&apos;est juste une absorption.<br />
              Un vrai engulfing doit se voir immédiatement.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded mt-5">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « L&apos;engulfing ne propose pas. Il impose. La 2ème bougie est si forte qu&apos;elle efface la première. »
              </p>
            </div>
          </section>

          {/* Bloc 2 — Pin bar vs Engulfing */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Pin bar vs Engulfing : 2 signatures du même retournement</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Ne confonds pas pin bar et engulfing.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Pin bar :</span><br />
              1 seule bougie.<br />
              Signal de rejet.<br />
              La mèche longue prouve qu&apos;un camp a tenté de casser, puis a échoué.<br />
              C&apos;est souvent plus précoce dans le retournement.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              <span className="font-semibold text-zinc-200">Engulfing :</span><br />
              2 bougies.<br />
              Signal de bascule.<br />
              La 2ème bougie écrase la 1ère et montre qu&apos;un nouveau camp prend le contrôle.<br />
              C&apos;est souvent plus tardif, mais plus tranchant.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Les deux ne sont pas concurrents.<br />
              Ils racontent le même phénomène avec deux signatures différentes : un retournement à un niveau clé.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Sur un support, tu peux voir une pin bar bullish.<br />
              Tu peux aussi voir un bullish engulfing.<br />
              Parfois, tu peux voir une pin bar suivie d&apos;un engulfing. Dans ce cas, le rejet initial est confirmé par une bascule de force.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              En pratique :<br />
              Pin bar = entrée plus précoce, R/R souvent meilleur, mais plus subtil.<br />
              Engulfing = entrée plus tardive, confirmation plus forte, moins de faux signaux.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm">
              Tu choisis selon ton profil : agressif avec la pin bar, conservateur avec l&apos;engulfing.
            </p>
          </section>

          {/* Bloc 3 — Conditions d'application */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Conditions d&apos;application : où chercher un engulfing valide</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Un engulfing n&apos;a de valeur que s&apos;il apparaît au bon endroit.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">1. Sur un support clé pour un bullish engulfing.</span><br />
              Le prix descend, teste la zone, puis une grosse bougie bullish englobe la dernière bougie bearish. Les acheteurs reprennent le contrôle.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">2. Sur une résistance clé pour un bearish engulfing.</span><br />
              Le prix monte, échoue sur la zone, puis une grosse bougie bearish englobe la dernière bougie bullish. Les vendeurs reprennent la main.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">3. Sur un retracement Fibonacci 0.5 ou 0.618 dans une tendance saine.</span><br />
              Le marché respire, revient sur une zone logique, puis repart via engulfing.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              <span className="font-semibold text-zinc-200">4. En H1, H4 ou Daily.</span><br />
              En M1 ou M5, le bruit domine et les engulfings sont rarement exploitables. À éviter à ce stade. M15 et M30 sont OK pour de l&apos;intraday actif, mais demandent plus d&apos;expérience pour distinguer les vrais signaux.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm">
              Comme la pin bar : au milieu de nulle part, l&apos;engulfing ne vaut rien.<br />
              Il faut un niveau, une tendance, ou un retracement.
            </p>
          </section>

          {/* Bloc 4 — Setup d'entrée + SL + TP + R/R */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Setup d&apos;entrée + SL + TP + R/R</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Pour un bullish engulfing, la logique est simple. L&apos;inverse s&apos;applique pour un bearish engulfing.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Entrée agressive : à la cassure du high de la bougie engulfing.<br />
              Tu entres quand le marché confirme la force de la 2ème bougie.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Entrée conservatrice : à la cassure du high de la bougie suivante si elle confirme.<br />
              Tu entres plus tard, mais avec plus de validation.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">SL : sous le low de la bougie engulfing.</span><br />
              Pour XAU/USD : 5 à 30$ sous le low selon la qualité du niveau.<br />
              Pour EUR/USD : 5 à 15 pips sous le low.<br />
              Pour indices ou crypto : 0,3 à 0,8% sous le low.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Différence clé avec la pin bar : ici, le SL se place sous la bougie engulfing, pas sous une mèche de rejet.<br />
              Il est souvent plus serré, donc le R/R peut être meilleur.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">TP : prochain niveau clé.</span><br />
              Résistance, ancien high, zone de liquidité.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              R/R minimum : 1:2.<br />
              Idéal : 1:3 si la structure le permet.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm">
              Gestion : à 1R atteint, tu peux passer break-even.<br />
              Si la structure est propre, l&apos;engulfing peut viser 1:3 ou 1:4.
            </p>
          </section>

          {/* Intro visuel + EngulfingSetupDiagram */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Le schéma suivant montre un bullish engulfing sur un retracement Fibonacci 0.618 de XAU/USD H4, avec entrée, SL et TP. Observe surtout la géométrie : la 2ème bougie englobe entièrement le corps de la 1ère, l&apos;entrée se fait après confirmation, le SL protège sous la bougie engulfing, et le TP vise le prochain niveau logique.
            </p>
            <div className="border border-zinc-800 rounded-xl overflow-hidden">
              <EngulfingSetupDiagram />
            </div>
          </section>

          {/* Encadré ET TOI, RETAIL ? */}
          <div className="border border-emerald-500/20 bg-emerald-500/5 rounded-xl p-6 my-8">
            <p className="text-emerald-400 uppercase tracking-widest text-xs font-bold mb-4">ET TOI, RETAIL ?</p>
            <div className="text-zinc-300 leading-relaxed space-y-3">
              <p>
                Tu as 1 200€ sur ton compte XTB. Il est 13h, tu manges un sandwich à ton bureau, tu as 20 minutes. Tu ouvres ton chart XAU/USD H4. Le prix corrige depuis 2 jours et arrive sur ton niveau Fibonacci 0.618 à 4 600$ — exactement la zone que tu avais notée hier soir.
              </p>
              <p>
                Une bougie haussière imposante avale entièrement la précédente bougie baissière. C&apos;est ton engulfing : les acheteurs ont repris le contrôle de manière nette, sur une zone clé.
              </p>
              <p>
                Concrètement : entrée 4 630$, SL 4 590$, TP 4 720$. Tu risques 12€ (1% de 1 200€), tu peux gagner 27€. Tu coupes ton chart, tu finis ton sandwich. Tu vérifieras ce soir.
              </p>
            </div>
          </div>

          {/* Bloc 6 — Filtres */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Filtres : quand NE PAS prendre le setup</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">1. La 2ème bougie n&apos;englobe que partiellement le corps de la 1ère.</span><br />
              Pas valide. Un vrai engulfing englobe entièrement le corps précédent. Sinon, c&apos;est une bougie forte, mais pas un setup propre.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">2. Engulfing au milieu d&apos;un range, sans niveau clé.</span><br />
              Pas valide. Sans support, résistance, Fibo ou tendance claire, tu lis du bruit. Le contexte prime sur la forme.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">3. Engulfing contre une tendance forte.</span><br />
              Risqué. Si le marché chute violemment, prendre un bullish engulfing isolé revient à attraper un couteau qui tombe. Privilégie les engulfings dans le sens dominant.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              <span className="font-semibold text-zinc-200">4. Engulfing juste avant une news rouge majeure.</span><br />
              NFP, FOMC, CPI : la macro peut effacer le signal technique en quelques secondes. Dans ce cas, tu attends la news, puis tu réévalues.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm">
              L&apos;engulfing est visuellement puissant.<br />
              Mais un beau pattern dans un mauvais contexte reste un mauvais trade.
            </p>
          </section>

          {/* Bloc 7 — Exemple chiffré */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Exemple chiffré sur XAU/USD H4</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Contexte : XAU/USD a rebondi depuis le support 4 500$ et est remonté vers 4 720$. Le prix corrige ensuite et revient sur le retracement Fibonacci 0.618 de cette jambe haussière, autour de 4 600$.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Lecture de l&apos;engulfing :</span>
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">1ère bougie bearish :</span><br />
              Open 4 615$, Close 4 600$.<br />
              Corps de 15$. Le prix reste sous pression vendeuse.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">2ème bougie bullish :</span><br />
              Open 4 595$, Close 4 625$.<br />
              Corps de 30$, soit 2x le corps de la 1ère.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Le corps de la 2ème englobe entièrement celui de la 1ère :<br />
              4 595$ est sous 4 600$.<br />
              4 625$ est au-dessus de 4 615$.<br />
              Critère validé.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Le setup apparaît sur un Fibo 0.618 dans une tendance haussière.<br />
              Contexte propre.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Setup :</span>
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Entrée : 4 630$, à la cassure du high de la bougie engulfing.<br />
              Stop Loss : 4 590$, soit 5$ sous le low de la bougie engulfing.<br />
              Take Profit : 4 720$, ancien high récent.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Calcul du R/R :</span>
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Risque = 4 630$ - 4 590$ = 40$.<br />
              Gain potentiel = 4 720$ - 4 630$ = 90$.<br />
              R/R = 90 / 40 = 2,25.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Tu risques 40$ pour viser 90$.<br />
              La perte est définie. Le gain potentiel est supérieur au risque.<br />
              C&apos;est un setup exploitable.
            </p>
            <h3 className="text-base font-semibold text-zinc-200 mb-2 mt-5">Calcul retail</h3>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Tu risques 1% de ton capital par trade.
            </p>
            <ul className="text-zinc-300 leading-relaxed text-sm mb-3 space-y-1 list-disc list-inside">
              <li>Compte 500€ → tu risques 5€, gain potentiel 11€</li>
              <li>Compte 1 000€ → tu risques 10€, gain potentiel 22€</li>
              <li>Compte 2 500€ → tu risques 25€, gain potentiel 56€</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">
              Le calcul est universel : peu importe la taille de ton compte, le R/R reste 2,25:1. Ce qui change, c&apos;est la taille de lot.
            </p>
          </section>

          {/* ── Séparateur révision ── */}
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Révision</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          <LessonKeyPoints
            points={[
              "Engulfing = 2 bougies de sens opposé, la 2ème englobe entièrement le corps de la 1ère",
              "Pin bar = signal de rejet, Engulfing = signal de bascule : complémentaires, pas concurrents",
              "Toujours sur un niveau clé ou un retracement, jamais au milieu de nulle part",
              "SL sous le low de la bougie engulfing, souvent plus serré qu'avec une pin bar",
              "R/R minimum 1:2, idéalement 1:3 si la structure le permet",
            ]}
          />

          <LessonExercice
            description="Mets en pratique la lecture des bougies sur un graphique réel."
            steps={[
              "Ouvrir un graphique XAU/USD ou EUR/USD en timeframe H4",
              "Identifier 2 engulfings valides sur l'historique des 30 derniers jours et noter le contexte : support, résistance ou Fibo",
              "Pour chaque engulfing, vérifier que le corps de la 2ème bougie englobe entièrement le corps de la 1ère",
              "Calculer le R/R potentiel pour 1 engulfing valide : entrée à la cassure, SL sous le low de la bougie engulfing, TP au prochain niveau",
              "Repérer 1 cas où une pin bar et un engulfing apparaissent au même niveau, puis observer ce qui s'est passé après",
            ]}
          />

          <LessonQuiz
            question="Tu vois sur ton chart H4 EUR/USD une bougie bearish suivie d'une bougie bullish dont le corps fait 1,5x la taille du corps de la 1ère. La 2ème bougie englobe partiellement le corps de la 1ère mais pas entièrement. Le pattern apparaît sur un support clé. Que fais-tu ?"
            options={[
              "Tu prends le setup, le contexte de support est valide",
              "Tu attends une 3ème bougie de confirmation avant d'entrer",
              "Tu ignores le setup, ce n'est pas un vrai engulfing car le corps n'englobe pas entièrement celui de la 1ère",
              "Tu prends le setup avec une size réduite à cause du corps trop juste",
            ]}
            correctIndex={2}
            explanation="Le critère principal d'un engulfing valide est strict : le corps de la 2ème bougie doit englober entièrement le corps de la 1ère. Si l'englobement est seulement partiel, le pattern est invalide, même sur un bon support. Prendre ce setup revient à déformer la définition pour se justifier. Tu attends un vrai signal qui respecte tous les critères."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "price-action", "lecon3");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Leçon 3 du module Price Action complétée.</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/strategies/price-action/lecon2"
                className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="text-zinc-600">
                  <path d="M9.5 3.5l-4 4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Leçon 2 — Pin bar : le rejet de niveau
              </Link>
              <span className="inline-flex items-center gap-2 text-sm text-zinc-700 cursor-not-allowed">
                Leçon 4 — Setup multi-timeframe Daily → H1
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
