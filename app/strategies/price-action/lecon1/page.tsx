"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { CandleAnatomyDiagram } from "@/app/components/charts/CandleAnatomyDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Lire une bougie", disabled: false },
  { id: "lecon2", title: "Pin bar",          disabled: true },
  { id: "lecon3", title: "Leçon 3",          disabled: true },
  { id: "lecon4", title: "Leçon 4",          disabled: true },
];

export default function LireUneBougiePage() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "price-action", "lecon1"));
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
          <span className="text-zinc-500">Leçon 1</span>
        </nav>

        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Débutant
            </span>
            <span className="text-zinc-700 text-xs">·</span>
            <span className="text-xs text-zinc-600">12 min</span>
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
            Lire une bougie : corps, mèche, signal
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              La bougie est l&apos;unité de base du trading. Tant que tu ne sais pas lire UNE bougie, tu ne sais rien lire.
            </p>
            <p className="text-[15px] text-zinc-400 leading-relaxed mt-2">
              Mais une bougie ne dit pas juste &quot;le prix monte ou descend&quot;. Elle te montre qui a attaqué, qui a résisté, et qui a gagné.
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
              const isCurrent = lesson.id === "lecon1";
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
            <span className="ml-auto text-xs text-zinc-600">1 / 4 leçons</span>
          </div>
        </header>

        {/* ── Contenu ── */}
        <div className="space-y-5">

          {/* Bloc 1 — Une bougie = une bataille en 4 chiffres */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Une bougie = une bataille en 4 chiffres</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Une bougie te raconte une bataille en 4 chiffres : Open, High, Low, Close.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Open = prix d&apos;ouverture de la période.<br />
              Close = prix de fermeture.<br />
              High = point le plus haut atteint.<br />
              Low = point le plus bas atteint.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Peu importe le timeframe. 1 minute, 1 heure, 1 jour. La logique reste identique.<br />
              Chaque bougie est un résumé complet de ce qui s&apos;est passé pendant cette période.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Entre l&apos;Open et le Close, le prix monte, descend, hésite. Les acheteurs poussent, les vendeurs répondent.<br />
              Le High montre jusqu&apos;où les acheteurs ont réussi à aller.<br />
              Le Low montre jusqu&apos;où les vendeurs ont réussi à pousser.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Tu ne regardes pas un point. Tu lis un combat entier.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « Une bougie n&apos;est pas un prix. C&apos;est l&apos;histoire de tous les prix pendant cette période. »
              </p>
            </div>
          </section>

          {/* Bloc 2 — L'anatomie : corps + mèches */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">L&apos;anatomie : corps + mèches</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Une bougie a 3 parties.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Le corps.</span><br />
              C&apos;est le rectangle plein. Il représente la différence entre l&apos;Open et le Close.<br />
              C&apos;est la zone où la bataille s&apos;est terminée. Celui qui contrôle le corps a gagné la période.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">La mèche haute (wick supérieur).</span><br />
              C&apos;est le trait fin entre le sommet du corps et le High.<br />
              Elle montre jusqu&apos;où les acheteurs ont poussé avant de se faire contrer.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              <span className="font-semibold text-zinc-200">La mèche basse (wick inférieur).</span><br />
              C&apos;est le trait fin entre le bas du corps et le Low.<br />
              Elle montre jusqu&apos;où les vendeurs ont poussé avant de se faire repousser.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Corps = résultat final.<br />
              Mèches = tentatives et excès.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Regarde maintenant le schéma associé. Il découpe une bougie en Open, Close, High, Low, corps et mèches. L&apos;objectif n&apos;est pas de mémoriser un dessin, mais de comprendre ce que chaque partie signifie dans le combat acheteurs vs vendeurs.
            </p>
            <div className="border border-zinc-800 rounded-xl overflow-hidden">
              <CandleAnatomyDiagram />
            </div>
          </section>

          {/* Bloc 3 — Bullish vs Bearish : qui a gagné cette période */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Bullish vs Bearish : qui a gagné cette période</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Bullish (haussière)</span> = Close &gt; Open.<br />
              Les acheteurs ont gagné. Le prix a fini au-dessus de son point de départ.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Bearish (baissière)</span> = Close &lt; Open.<br />
              Les vendeurs ont gagné. Le prix a fini en dessous.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              <span className="font-semibold text-zinc-200">Doji</span> = Close ≈ Open.<br />
              Aucun camp n&apos;a pris le contrôle. Indécision totale.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Important : la direction du corps te donne le vainqueur.<br />
              Mais elle ne te dit pas comment la bataille s&apos;est déroulée.<br />
              C&apos;est là que les mèches deviennent essentielles.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Une bougie bullish peut cacher une forte pression vendeuse si la mèche haute est longue.<br />
              Une bougie bearish peut cacher une défense acheteuse si la mèche basse est longue.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « Le corps te dit qui a gagné. Les mèches te disent qui a essayé. »
              </p>
            </div>
          </section>

          {/* Bloc 4 — La taille du corps : la force de la conviction */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">La taille du corps : la force de la conviction</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              La taille du corps change tout.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Grand corps</span> = mouvement clair.<br />
              Un camp a dominé presque toute la période. Peu d&apos;hésitation.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              <span className="font-semibold text-zinc-200">Petit corps</span> = équilibre.<br />
              Acheteurs et vendeurs se neutralisent. Aucun contrôle net.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Une bougie bullish avec un grand corps montre une pression acheteuse forte.<br />
              Une bougie bearish avec un grand corps montre une pression vendeuse forte.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              À l&apos;inverse, un petit corps signale un marché qui hésite.<br />
              Le prix avance, mais sans conviction.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              En pratique :<br />
              Grand corps → souvent continuation (le mouvement continue dans le même sens).<br />
              Petit corps → souvent pause ou retournement possible.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm">
              Tu ne regardes pas juste le sens. Tu mesures l&apos;intensité.
            </p>
          </section>

          {/* Bloc 5 — Les mèches : qui a essayé puis abandonné */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Les mèches : qui a essayé puis abandonné</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Les mèches racontent ce que le corps ne montre pas.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Mèche haute longue.</span><br />
              Les acheteurs ont poussé le prix vers le haut, mais les vendeurs sont revenus et ont repris le contrôle avant la clôture.<br />
              C&apos;est un rejet par le haut.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              <span className="font-semibold text-zinc-200">Mèche basse longue.</span><br />
              Les vendeurs ont poussé vers le bas, mais les acheteurs ont absorbé et ont fait remonter le prix.<br />
              C&apos;est un rejet par le bas.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              <span className="font-semibold text-zinc-200">Deux mèches longues avec un petit corps.</span><br />
              Combat total. Personne ne gagne. Indécision forte (doji à longues mèches).
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Point clé :<br />
              Les mèches longues sont souvent plus importantes que le corps.<br />
              Elles montrent les zones où le marché a tenté et échoué.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm">
              C&apos;est exactement ce que tu utiliseras plus tard dans des patterns comme la pin bar.
            </p>
          </section>

          {/* Bloc 6 — Lire le signal selon le contexte */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Lire le signal selon le contexte</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Une bougie seule ne suffit jamais. Le contexte change tout.
            </p>
            <div className="space-y-3 mb-5">
              {[
                { label: "Bougie bullish à grand corps en bas d'une chute.", body: "Les acheteurs reprennent le contrôle → possible retournement." },
                { label: "Bougie bullish à grand corps en haut d'un range.", body: "Les acheteurs poussent encore → possible continuation." },
                { label: "Mèche haute longue sur une résistance.", body: "Les vendeurs défendent la zone → rejet clair." },
                { label: "Mèche basse longue sur un support.", body: "Les acheteurs défendent la zone → rejet clair." },
              ].map((item, i) => (
                <div key={i} className="bg-zinc-800/30 rounded-xl px-4 py-3">
                  <p className="text-sm font-semibold text-zinc-200 mb-1">{item.label}</p>
                  <p className="text-sm text-zinc-400">→ {item.body}</p>
                </div>
              ))}
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Même forme, sens différent.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              La vraie lecture = bougie + niveau + tendance.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm">
              Les patterns comme la pin bar (1.2), l&apos;engulfing (1.3) et le multi-timeframe (1.4) vont te montrer comment exploiter ça.<br />
              Ici, ton objectif est simple : voir ce que la bougie raconte.
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
              "Une bougie = 4 chiffres : Open, High, Low, Close",
              "Le corps mesure qui a gagné, les mèches mesurent qui a essayé",
              "Grand corps = conviction, petit corps = hésitation",
              "Mèche longue à un niveau clé = signal de rejet fort",
              "Une bougie ne se lit jamais seule — toujours dans son contexte",
            ]}
          />

          <LessonExercice
            description="Mets en pratique la lecture des bougies sur un graphique réel."
            steps={[
              "Ouvrir un graphique sur ton actif préféré (EUR/USD, Nasdaq, BTC...) en timeframe 1h",
              "Identifier 3 bougies bullish et 3 bougies bearish — repérer la couleur, le sens du corps",
              "Repérer une bougie avec une mèche longue (plus longue que le corps) et noter à quel niveau elle est apparue",
              "Trouver une bougie à grand corps et une bougie à petit corps — comparer ce qui s'est passé après chacune",
              "Repérer un doji (corps minuscule, 2 mèches) et noter ce qui s'est passé dans les 3 bougies suivantes",
            ]}
          />

          <LessonQuiz
            question="Tu vois une bougie avec un petit corps bullish et une mèche basse très longue, qui se forme sur un niveau de support connu. Que te dit-elle ?"
            options={[
              "Les vendeurs ont gagné cette période, continuation baissière probable",
              "Les acheteurs ont gagné massivement, signal d'achat clair",
              "Les vendeurs ont essayé de casser le support mais les acheteurs sont revenus le défendre — signal de rejet par le bas",
              "La bougie ne signifie rien sans regarder les bougies suivantes",
            ]}
            correctIndex={2}
            explanation="La mèche basse très longue montre que les vendeurs ont poussé le prix sous le support. Mais le corps bullish en haut de la mèche prouve que les acheteurs ont repris le contrôle avant la clôture. C'est un rejet clair par le bas. La réponse D rappelle que le contexte compte, mais cette bougie donne déjà une information forte à elle seule."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "price-action", "lecon1");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Leçon 1 du module Price Action complétée.</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-5 flex items-center justify-between">
              <span />
              <span className="inline-flex items-center gap-2 text-sm text-zinc-700 cursor-not-allowed">
                Leçon 2 — Pin bar — le rejet de niveau
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
