import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { BacktestMetricsDiagram } from "@/app/components/charts/BacktestMetricsDiagram";
import ContentEs from "./_content-es";

function ContentFr() {
  return (
    <LessonPage
      formationId="avance"
      lessonId="lecon9"
      title="Backtesting — valider sa stratégie"
      subtitle="Avant de risquer de l'argent réel, tu dois avoir la preuve que ta stratégie fonctionne. Le backtesting est cette preuve — construite sur des données historiques, pas sur l'espoir."
      duration="22 min"
      lessonNumber={9}
      prev={{ href: "/formations/avance/lecon8", label: "Leçon 8 — Journaling" }}
      next={null}
    >

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Qu'est-ce que le backtesting ?</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Le backtesting consiste à appliquer ta stratégie sur des données de marché passées pour évaluer sa performance. Tu rejoues des situations historiques comme si tu tradais en temps réel — et tu enregistres chaque décision dans un journal.
        </p>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Ce n'est pas la même chose que regarder un graphique passé et dire "j'aurais vendu ici". Le backtesting rigoureux cache les bougies futures (replay mode) et force des décisions en temps réel simulé.
        </p>
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
          <p className="text-sm text-zinc-400 leading-relaxed">
            <span className="text-white font-medium">Objectif :</span> obtenir un échantillon de 50 à 100 trades pour valider l'edge de ta stratégie avec des données statistiques fiables.
          </p>
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Comment faire un backtest rigoureux</h2>
        <div className="space-y-2">
          {[
            { step: "1", text: "Définis ta stratégie précisément : quelles confluences sont requises ? Sur quel timeframe ? Dans quelles Killzones ? Sois spécifique — une stratégie vague donne un backtest vague." },
            { step: "2", text: "Utilise TradingView en mode Replay (flèche 'play' en haut) ou Forex Tester. Remonte 6 à 12 mois en arrière et avance bougie par bougie." },
            { step: "3", text: "Applique ta stratégie exactement comme tu le ferais en live : identifie les setups, marque l'entrée, le SL et le TP avant que la bougie suivante se forme." },
            { step: "4", text: "Enregistre chaque trade dans ton journal : confluences présentes, résultat en R, screenshot." },
            { step: "5", text: "Après 50 à 100 trades, analyse les statistiques : win rate, R moyen, drawdown max, mois profitables vs déficitaires." },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
              <span className="text-xs font-bold text-blue-400 shrink-0 mt-0.5 w-4">{item.step}</span>
              <p className="text-sm text-zinc-300 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-zinc-800/50 border-l-4 border-amber-400 px-5 py-4 rounded">
        <div className="flex items-center gap-2 mb-2">
          <span>💰</span>
          <span className="text-sm font-bold text-amber-400 tracking-wide">Réalité du retail</span>
        </div>
        <p className="text-base text-zinc-300 leading-relaxed">
          Si tu backtestes avec un capital de 200 à 1 000 €, utilise les vrais % de ta grille de risque (cf. Débutant leçon 8) — pas la règle théorique du 1%. Backtester avec 1% sur un compte de 300 € revient à risquer 3 € par trade, inapplicable avec les lots disponibles. Un backtest calibré sur ton capital réel te donnera des résultats exploitables en live — pas des chiffres déconnectés de ta réalité.
        </p>
      </div>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Les métriques clés d'un backtest</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Ces métriques te donnent une image complète de ta stratégie. Elles décident si tu peux y faire confiance en live.
        </p>
        <div className="space-y-2.5">
          {[
            { metric: "Win Rate", good: "> 40%", desc: "Pourcentage de trades gagnants. Avec un bon R/R, même 40% de win rate peut être profitable." },
            { metric: "R moyen", good: "> +0.5R", desc: "Gain moyen par trade en R. Un win rate de 50% avec R moyen de +1R = très rentable." },
            { metric: "Profit Factor", good: "> 1.5", desc: "Total des gains ÷ total des pertes. Doit être supérieur à 1.0 pour être rentable." },
            { metric: "Drawdown max", good: "< 15%", desc: "Perte maximale depuis un pic. Un drawdown élevé teste ta psychologie en live — connais-le à l'avance." },
            { metric: "Nombre de trades", good: "> 50", desc: "En dessous de 50 trades, les résultats ne sont pas statistiquement fiables. Vise 100 minimum." },
          ].map((r, i) => (
            <div key={i} className="flex items-start gap-4 bg-zinc-800/40 rounded-xl px-4 py-3">
              <div className="shrink-0">
                <p className="text-sm font-semibold text-white">{r.metric}</p>
                <p className="text-xs font-mono text-emerald-400">{r.good}</p>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
        <BacktestMetricsDiagram />
      </div>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Les erreurs de backtesting à éviter</h2>
        <div className="space-y-2.5">
          {[
            { label: "Hindsight bias (biais rétrospectif)", detail: "Croire que tu aurais 'évidemment' vu le setup parce que tu vois les bougies passées. Le replay bougie par bougie est le seul remède." },
            { label: "Over-fitting", detail: "Optimiser ta stratégie jusqu'à ce qu'elle performe parfaitement sur le passé. En live, cette stratégie surgénérée sur les données historiques échoue." },
            { label: "Ignorer les frais", detail: "Chaque trade a un coût (spread, commission). Intègre-les dans ton backtest — ils peuvent transformer un edge positif en edge négatif." },
            { label: "Backtest sur trop peu de conditions", detail: "Un backtest sur 3 mois de hausse ne dit rien de la performance en range ou en baisse. Teste sur au moins 12 mois avec différentes conditions." },
          ].map((r, i) => (
            <div key={i} className="flex items-start gap-3 bg-zinc-800/40 rounded-xl px-4 py-3">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-red-400 shrink-0 mt-0.5">
                <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <div>
                <p className="text-sm font-medium text-white">{r.label}</p>
                <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{r.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Révision</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <LessonKeyPoints
        points={[
          "Le backtesting valide ta stratégie sur des données passées avant de risquer de l'argent réel.",
          "Utilise le mode Replay de TradingView pour simuler le temps réel — jamais le graphique statique.",
          "50 trades minimum pour la validation, 100 pour une confiance statistique solide.",
          "Les métriques clés : win rate (>40%), R moyen (>+0.5R), profit factor (>1.5), drawdown (<15%).",
          "Intègre les frais (spread, commission) dans chaque trade — ils comptent sur la durée.",
        ]}
      />

      <LessonExercice
        description="Lance ton premier backtest sur ta stratégie principale."
        steps={[
          "Sur TradingView, ouvre EUR/USD en H1. Remonte 3 mois en arrière en mode Replay (bouton flèche en haut de l'interface).",
          "Avance bougie par bougie. Applique ta stratégie (BOS → retracement OTE → OB → signal bougie). Note chaque trade potentiel.",
          "Pour les 10 premiers trades identifiés, enregistre : confluences présentes, entrée, SL, TP, résultat en R.",
          "Calcule ton win rate et ton R moyen sur ces 10 trades. C'est le début de ton edge personnel.",
        ]}
      />

      <LessonQuiz
        question="Après 20 trades en backtest, tu obtiens un win rate de 70% et un profit factor de 1.8. Tu décides de passer en live immédiatement. Quelle est l'erreur ?"
        options={[
          "Le win rate de 70% est trop élevé — ce n'est pas réaliste",
          "20 trades est un échantillon trop petit pour valider une stratégie de façon statistiquement fiable",
          "Le profit factor de 1.8 est insuffisant — il faut au moins 3.0 pour trader en live",
          "Il faut d'abord backtester sur 5 instruments différents avant de trader EUR/USD",
        ]}
        correctIndex={1}
        explanation="20 trades représente un échantillon trop petit pour tirer des conclusions statistiques fiables. Une série de 20 trades peut être positive par chance pure, même avec une stratégie sans edge. Il faut au minimum 50 trades, idéalement 100, pour que les résultats reflètent réellement la performance de la stratégie plutôt que la variance aléatoire."
        answerExplanations={[
          "Faux. Un win rate de 70% n'est pas irréaliste si le R/R est favorable (>1:1). Certaines stratégies scalping ou à hautes confluences peuvent atteindre ces chiffres. Ce n'est pas le problème ici.",
          "Correct. 20 trades = variance aléatoire trop élevée. Le même backtest avec 20 autres trades pourrait donner 30% de win rate et un profit factor de 0.8. Il faut 50 à 100 trades pour que les statistiques soient significatives.",
          "Faux. Un profit factor de 1.8 est déjà solide — au-dessus de 1.5 est généralement un objectif valide. 3.0 est exceptionnel et n'est pas requis pour trader en live avec un edge réel.",
          "Faux. Backtester sur plusieurs instruments peut être utile mais n'est pas une condition préalable obligatoire. La priorité est d'avoir un échantillon suffisamment large sur un seul instrument avant de généraliser.",
        ]}
      />

    </LessonPage>
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale === "es") return <ContentEs />;
  return <ContentFr />;
}
