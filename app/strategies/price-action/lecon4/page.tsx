"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import MultiTFEntryDiagram from "@/app/components/charts/MultiTFEntryDiagram";
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

          {/* ── Hero ── */}
          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-300 leading-relaxed">
              Sans multi-timeframe, tu vois un pin bar ou un engulfing isolé sans savoir s&apos;il mérite d&apos;être tradé.
            </p>
            <p className="text-[15px] text-zinc-300 leading-relaxed mt-2">
              Avec le multi-timeframe, tu lis le marché à 3 niveaux : un grand pour le biais, un moyen pour la zone, un petit pour l&apos;entrée. Selon ton style, ces 3 niveaux changent — on voit ça juste après.
            </p>
            <p className="text-[15px] text-zinc-300 leading-relaxed mt-2">
              C&apos;est le passage du signal &quot;joli&quot; au setup structuré.
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
                    {lesson.title}
                  </span>
                </div>
              );
            })}
            <span className="ml-auto text-xs text-zinc-600">4 / 4 leçons</span>
          </div>
        </header>

        {/* ── Contenu ── */}
        <div className="space-y-5">

          {/* Bloc 1 — Pourquoi le multi-timeframe change tout */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Pourquoi le multi-timeframe change tout</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Tu peux trouver le plus beau pin bar du monde sur H1.<br />
              Si la Daily est baissière puissante, ton signal peut se faire écraser.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Un seul timeframe te montre le détail.<br />
              Mais il peut te cacher la direction.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Le multi-timeframe aligne 3 éléments : contexte, niveau, déclencheur.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              La 1.1 t&apos;a appris à lire une bougie.<br />
              La 1.2 t&apos;a appris le pin bar : le rejet.<br />
              La 1.3 t&apos;a appris l&apos;engulfing : la bascule.<br />
              La 1.4 te montre comment assembler tout ça dans un process complet.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Daily : tu vois la route.<br />
              H4 : tu repères la zone.<br />
              H1 : tu cherches le signal.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Tu ne prends plus un setup parce qu&apos;il est beau.<br />
              Tu le prends parce qu&apos;il est aligné.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded mt-5">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « Le multi-timeframe ne te donne pas plus de signaux. Il te donne les BONS signaux. »
              </p>
            </div>
          </section>

          {/* Bloc 2 — La hiérarchie multi-timeframe selon ton style */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">La hiérarchie multi-timeframe selon ton style</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Le multi-TF, c&apos;est 3 horizons : un grand pour le biais, un moyen pour la zone, un petit pour l&apos;entrée. Le choix de ces 3 horizons dépend de ton style.
            </p>
            <ul className="text-zinc-300 leading-relaxed text-sm mb-3 space-y-1 list-disc list-inside">
              <li>Swing trader : Weekly (biais) → Daily (zone) → H4 (entrée)</li>
              <li>Intraday calme : Daily → H4 → H1</li>
              <li>INTRADAY ACTIF : H4 → H1 → M30</li>
              <li>DAY TRADING ACTIF : H1 → M30 → M15</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Ces 4 hiérarchies sont valides. Les deux dernières — INTRADAY ACTIF et DAY TRADING ACTIF — correspondent à la majorité des retails. C&apos;est sans doute la tienne.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              M1/M5 sont déconseillés à ce stade — trop bruyant, demande de l&apos;expérience pour filtrer.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm">
              Voyons ces 2 hiérarchies majoritaires sur un cas concret.
            </p>
          </section>

          {/* Bloc 3 — Comment lire chaque timeframe étape par étape */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Comment lire chaque timeframe étape par étape</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Étape 1 — Ouvre le Daily.</span>
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Pose une seule question : la tendance est haussière, baissière, ou en range ?
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Haussière → tu cherches uniquement des setups bullish.<br />
              Baissière → tu cherches uniquement des setups bearish.<br />
              Range → pas de setup multi-TF propre aujourd&apos;hui.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Étape 2 — Passe en H4.</span>
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Cherche le prochain niveau logique dans le sens de la Daily.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              En tendance haussière : support, ancien high retesté, Fibonacci 0.5 ou 0.618.<br />
              En tendance baissière : résistance, ancien low retesté, Fibonacci 0.5 ou 0.618.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Note le niveau. Pas une zone floue. Un vrai prix.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Étape 3 — Passe en H1.</span>
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Attends que le prix touche ou approche le niveau H4.<br />
              Puis cherche un pin bar ou un engulfing dans le sens de la tendance Daily.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Signal valide → tu prépares l&apos;entrée selon la règle du pattern.<br />
              Pas de signal → pas de trade.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm">
              Tu ne sautes pas d&apos;étape.<br />
              Daily d&apos;abord. H4 ensuite. H1 seulement à la fin.
            </p>
          </section>

          {/* Bloc 3bis — Exemple n°2 intraday actif */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Exemple n°2 — Style intraday actif (H4 → H1 → M30)</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Tu trades 3 à 5 fois par semaine, tu regardes ton chart 2-3 fois par jour. Voici comment tu utilises le multi-TF sur le même setup XAU/USD.
            </p>
            <h3 className="text-base font-semibold text-zinc-200 mb-2">H4 — Le biais</h3>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Tu regardes le H4 sur XAU/USD. Tu vois une structure haussière claire avec des sommets et creux ascendants sur les dernières semaines. Le marché reste au-dessus de ses derniers supports.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Conclusion : ton biais est haussier. Tu cherches uniquement des achats.
            </p>
            <h3 className="text-base font-semibold text-zinc-200 mb-2">H1 — La zone</h3>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Tu passes sur le H1. Le prix est en train de corriger à la baisse après une impulsion. Il revient vers une zone de demande récente autour des 4 580$.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Tu identifies une zone entre 4 575$ et 4 590$ où le prix a déjà rebondi par le passé.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Conclusion : ta zone d&apos;achat est entre 4 575$ et 4 590$. Tu attends un signal dans cette zone.
            </p>
            <h3 className="text-base font-semibold text-zinc-200 mb-2">M30 — L&apos;entrée</h3>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Le prix arrive dans ta zone H1. Tu passes sur M30.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Tu vois une bougie avec une mèche basse marquée qui rejette les 4 580$, et un corps haussier qui clôture au-dessus de 4 590$. C&apos;est un signal clair.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Entrée : 4 590$<br />
              SL : 4 565$ (sous la mèche, 25$ de risque)<br />
              TP : 4 640$ (R/R 2:1, 50$ de gain)
            </p>
            <h3 className="text-base font-semibold text-zinc-200 mb-2">Calcul retail</h3>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Tu risques 1% de ton capital par trade.
            </p>
            <ul className="text-zinc-300 leading-relaxed text-sm mb-3 space-y-1 list-disc list-inside">
              <li>Compte 500€ → tu risques 5€, gain potentiel 10€</li>
              <li>Compte 1 000€ → tu risques 10€, gain potentiel 20€</li>
              <li>Compte 2 500€ → tu risques 25€, gain potentiel 50€</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">
              Le calcul est universel : peu importe la taille de ton compte, le R/R reste 2:1. Ce qui change, c&apos;est la taille de lot.
            </p>
          </section>

          {/* Bloc 4 — Setup d'entrée + SL + TP + R/R en multi-TF */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Setup d&apos;entrée + SL + TP + R/R en multi-TF</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              L&apos;entrée vient toujours du signal H1.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Si le déclencheur est une pin bar : entrée à la cassure du high en bullish, ou du low en bearish.<br />
              Si le déclencheur est un engulfing : entrée à la cassure du high de la bougie engulfing en bullish, ou du low en bearish.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Le SL reste celui du pattern.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Pin bar → SL sous le low de la mèche.<br />
              Engulfing → SL sous le low de la bougie engulfing.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Le multi-TF ne change pas l&apos;invalidation.<br />
              Il change surtout la qualité de la cible.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              TP standard : prochain niveau H4.<br />
              Résistance, ancien high, ancien low, zone de liquidité.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              TP étendu : prochain niveau Daily.<br />
              Si la tendance Daily est saine, cette cible peut être beaucoup plus loin.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              C&apos;est là que le multi-timeframe devient puissant.<br />
              En H1 seul, tu vois une petite cible.<br />
              Avec la Daily, tu vois le potentiel complet.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              R/R standard : minimum 1:2.<br />
              R/R étendu : peut atteindre 1:3 à 1:4 quand la tendance Daily est saine. Au-delà, c&apos;est rare et tu finis souvent par sortir avant la cible.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Ce qui rend une stratégie rentable, ce n&apos;est pas juste le R/R.<br />
              C&apos;est R/R × win rate.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Tu peux gagner 7 trades sur 10 et finir perdant si ton R/R est trop faible.<br />
              Tu peux gagner 4 trades sur 10 et finir gagnant si ton R/R est solide.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Tu risques 1% de ton capital par trade. Voici ce que ça donne sur 100 trades selon ton win rate et ton R/R.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Win rate 50%, R/R 1:1 → break-even.<br />
              <br />
              Win rate 50%, R/R 1:2 → +50% du capital.<br />
              - Compte 500€ → +250€<br />
              - Compte 1 000€ → +500€<br />
              - Compte 2 500€ → +1 250€<br />
              <br />
              Win rate 40%, R/R 1:2 → +20% du capital.<br />
              - Compte 500€ → +100€<br />
              - Compte 1 000€ → +200€<br />
              - Compte 2 500€ → +500€<br />
              <br />
              Win rate 60%, R/R 1:1 → +20% du capital.<br />
              Win rate 30%, R/R 1:3 → +20% du capital.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm">
              Tu vois la leçon : tu n&apos;as pas besoin d&apos;un win rate à 70% pour être rentable. Un R/R à 1:2 avec un win rate à 40% suffit. C&apos;est ça que le multi-TF te permet de viser : des entrées avec un R/R favorable, pas plus de signaux.
            </p>
          </section>

          {/* Encadré ET TOI, RETAIL ? */}
          <div className="border border-emerald-500/20 bg-emerald-500/5 rounded-xl p-6 my-8">
            <p className="text-emerald-400 uppercase tracking-widest text-xs font-bold mb-4">ET TOI, RETAIL ?</p>
            <div className="text-zinc-300 leading-relaxed space-y-3">
              <p>
                Tu as 800€ sur ton compte XTB. Il est 19h, tu rentres du boulot, tu as 30 minutes devant toi avant de dîner. Tu ouvres ton chart XAU/USD H4 d&apos;abord — biais haussier confirmé. Puis H1 — pullback en cours sur ta zone de demande à 4 580$. Puis M30 — tu attends.
              </p>
              <p>
                Une bougie M30 arrive avec une grosse mèche basse qui rejette les 4 580$, et un corps vert au-dessus. C&apos;est ton signal.
              </p>
              <p>
                Concrètement : entrée 4 590$, SL 4 565$, TP 4 640$. Tu risques 8€ (1% de 800€), tu peux gagner 16€. Tu coupes ton chart, tu vas dîner. Tu vérifieras dans 2-3 heures.
              </p>
            </div>
          </div>

          {/* Intro visuel + MultiTFEntryDiagram */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Le schéma suivant montre le process complet sur XAU/USD : Daily pour la tendance, H4 pour le retracement Fibonacci 0.618, H1 pour l&apos;engulfing d&apos;entrée. Observe le zoom progressif. Tu pars du contexte, tu descends vers le niveau, puis tu termines par le déclencheur précis.
            </p>
            <div className="border border-zinc-800 rounded-xl overflow-hidden">
              <MultiTFEntryDiagram />
            </div>
          </section>

          {/* Bloc 6 — Filtres */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Filtres : quand NE PAS prendre le setup multi-TF</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">1. Daily en range, sans tendance claire.</span><br />
              Pas de setup. Sans direction Daily, tu n&apos;as pas de boussole. Tu attends une tendance plus propre.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">2. H4 sans niveau identifiable.</span><br />
              Si le prix flotte au milieu de nulle part, tu n&apos;as pas de zone de réaction. Pas de support, pas de résistance, pas de Fibo propre = pas de plan.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">3. Signal H1 contre la tendance Daily.</span><br />
              Piège classique. Un beau pin bar bearish H1 dans une Daily haussière reste un signal contre-tendance. Tu ignores.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              <span className="font-semibold text-zinc-200">4. News rouge majeure dans les prochaines heures.</span><br />
              NFP, FOMC, CPI : la macro peut effacer le meilleur setup technique. Tu attends la news, puis tu réévalues.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm">
              Le multi-TF filtre beaucoup de mauvais trades.<br />
              Mais il ne remplace pas la discipline.
            </p>
          </section>

          {/* Bloc 7 — Exemple n°1 swing/intraday calme */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Exemple n°1 — Style swing ou intraday calme (Daily → H4 → H1)</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Tu trades 1 à 3 fois par semaine, tu ne regardes ton chart que 2 fois par jour. Voici le détail step-by-step.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              On reprend le même XAU/USD que les leçons 1.2 et 1.3.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Étape 1 — Daily.</span>
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              XAU/USD est haussier depuis le rebond sur 4 500$ vu en leçon 1.2.<br />
              Le prix a marqué un higher high vers 4 720$.<br />
              La structure Daily reste haussière.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Conclusion : tu cherches uniquement des setups bullish.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Étape 2 — H4.</span>
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Le prix corrige depuis 4 720$.<br />
              Tu traces le Fibonacci de la jambe haussière récente.<br />
              Le retracement 0.618 tombe autour de 4 600$, exactement la zone vue en leçon 1.3.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Conclusion : 4 600$ devient ta zone H4 à surveiller.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Étape 3 — H1.</span>
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Le prix arrive sur 4 600$.<br />
              Un bullish engulfing apparaît.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              1ère bougie bearish : Open 4 615$, Close 4 600$.<br />
              2ème bougie bullish : Open 4 595$, Close 4 625$.<br />
              La 2ème englobe entièrement le corps de la 1ère.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Le signal est valide.<br />
              Il est sur un niveau H4 propre.<br />
              Il est dans le sens de la Daily.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Setup :</span>
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Entrée : 4 630$.<br />
              Stop Loss : 4 590$.<br />
              Risque = 40$.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              TP standard H4 : 4 720$.<br />
              Gain = 90$.<br />
              R/R = 2,25.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              TP étendu Daily : 4 800$.<br />
              Gain = 170$.<br />
              R/R = 4,25.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Plan propre : prendre 50% à 4 720$, passer le reste à break-even, laisser courir vers 4 800$.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm">
              Le même engulfing que la leçon 1.3 devient plus puissant avec la lecture multi-TF.<br />
              Tu ne vois plus seulement une entrée. Tu vois tout le chemin possible.
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
              "Daily = contexte de tendance, H4 = niveau d'entrée, H1 = déclencheur : chaque TF a un rôle précis",
              "Tu entres uniquement en H1 sur un signal validé — jamais en Daily ou H4 directement",
              "Le signal H1 doit aller dans le sens de la tendance Daily : contre la tendance = pas de trade",
              "La tendance Daily permet de viser des TP étendus et d'obtenir de meilleurs R/R",
              "Sans tendance Daily claire et sans niveau H4 identifiable, il n'y a pas de setup",
            ]}
          />

          <LessonExercice
            description="Applique le process MTF sur un graphique réel en suivant les étapes dans l'ordre."
            steps={[
              "Ouvrir un graphique XAU/USD en Daily et identifier clairement la tendance : haussière, baissière ou range",
              "Descendre en H4 et repérer le prochain niveau clé dans la direction de la tendance : support, résistance ou Fibo 0.618",
              "Descendre en H1 et surveiller la zone H4 jusqu'à l'apparition d'un signal valide : pin bar ou engulfing",
              "Calculer l'entrée, le SL, le TP standard (niveau H4 suivant) et le TP étendu (niveau Daily suivant) avec le R/R de chaque option",
              "Trouver dans l'historique 1 exemple de signal H1 propre contre la tendance Daily qui a échoué, et noter ce que tu aurais perdu en le prenant",
            ]}
          />

          <LessonQuiz
            question="Le Daily est clairement baissier sur XAU/USD. En H4, le prix remonte vers une résistance majeure à 4 720$. En H1, tu vois un bullish engulfing propre sur cette résistance. Que fais-tu ?"
            options={[
              "Tu prends le Long en H1 — le setup engulfing est techniquement parfait",
              "Tu prends le Long mais avec une taille réduite car le Daily est contre toi",
              "Tu ignores le Long — le signal H1 est contre la tendance Daily baissière. Tu surveilles plutôt un signal Short sur cette résistance",
              "Tu attends que le Daily forme un signal de retournement avant d'agir en H1",
            ]}
            correctIndex={2}
            explanation="La hiérarchie MTF est claire : le Daily prime toujours. Un Daily baissier signifie que tu cherches uniquement des Shorts. Le bullish engulfing H1 est visuellement propre, mais il est contre la tendance de fond. Le prendre revient à aller à contre-courant sans raison valide. La résistance H4 est au contraire un excellent endroit pour chercher un signal bearish en H1."
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

            {/* Navigation */}
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
