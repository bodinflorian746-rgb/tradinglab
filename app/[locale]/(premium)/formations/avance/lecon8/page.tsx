import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { TradingJournalDiagram } from "@/app/components/charts/TradingJournalDiagram";
import ContentEs from "./_content-es";

function ContentFr() {
  return (
    <LessonPage
      formationId="avance"
      lessonId="lecon8"
      title="Journaling, analyser pour progresser"
      subtitle="Les meilleurs traders ne s'améliorent pas par intuition, ils s'améliorent par données. Le journal de trading est l'outil qui transforme l'expérience brute en progression mesurable."
      duration="18 min"
      lessonNumber={8}
      prev={{ href: "/formations/avance/lecon7", label: "Leçon 7 : Entrées de précision" }}
      next={{ href: "/formations/avance/lecon9", label: "Leçon 9 : Backtesting" }}
    >

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Pourquoi la plupart des traders ne progressent pas</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Sans journal, le trading reste une série d'expériences déconnectées. Tu perds un trade, tu passes au suivant. Tu gagnes, tu penses que ta stratégie est bonne. Mais sans données objectives, tu n'as aucun moyen de savoir ce qui fonctionne vraiment, ce que tu répètes comme erreur, ou où est ton edge.
        </p>
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
          <p className="text-sm text-zinc-400 leading-relaxed">
            <span className="text-white font-medium">Fait :</span> la majorité des traders professionnels tient un journal détaillé. Ce n'est pas une option, c'est un outil de performance au même titre qu'une stratégie.
          </p>
        </div>
        <p className="text-zinc-300 leading-relaxed text-sm mt-4">
          Tiens ton trading comme un jeu de probabilités. Aucun trade n&apos;est sûr ; sur un grand nombre de trades, c&apos;est ton avantage statistique qui décide. Le journal sert exactement à ça : repérer quels paramètres (setups, sessions, paires, conditions) te sont rentables et lesquels te coûtent, pour optimiser cet avantage. Le but n&apos;est pas de juger un trade isolé mais de comprendre tes erreurs récurrentes. Le trading s&apos;adapte à chacun : un trader = une stratégie, la tienne se construit avec tes propres données.
        </p>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Ce que contient un bon journal de trading</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Un journal efficace documente chaque trade de façon structurée, avant, pendant et après. Voici les informations essentielles à capturer.
        </p>
        <div className="space-y-2.5">
          {[
            {
              phase: "Avant le trade",
              items: ["Instrument & timeframe", "Biais de marché (haussier / baissier / neutre)", "Confluences identifiées (OB, FVG, liquidité, OTE...)", "Entrée prévue, SL, TP", "Ratio R/R calculé", "Screenshot du setup"],
            },
            {
              phase: "Après le trade",
              items: ["Résultat (gain/perte en R, pas en euros)", "Le prix s'est-il comporté comme prévu ?", "A-tu respecté le plan ?", "Erreurs commises (entrée trop tôt, SL déplacé, TP réduit...)", "Screenshot du résultat avec annotations"],
            },
            {
              phase: "Révision hebdomadaire",
              items: ["Taux de réussite (win rate)", "R moyen (gain moyen par trade)", "Drawdown maximum de la semaine", "Pattern d'erreur récurrent", "Condition de marché où ta stratégie performe ou sous-performe"],
            },
          ].map((section, i) => (
            <div key={i} className="bg-zinc-800/40 rounded-xl px-4 py-3">
              <p className="text-sm font-semibold text-white mb-2">{section.phase}</p>
              <ul className="space-y-1">
                {section.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-xs text-zinc-400">
                    <span className="text-zinc-600 shrink-0">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
        <TradingJournalDiagram />
      </div>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Analyser en R, pas en euros</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Le R (Risk/Reward) est l'unité standard pour mesurer la performance de trading. Analyser en euros biaise l'analyse, un trade gagné de 50€ peut être un mauvais trade si le R/R était 1:0.5. Un trade perdu de 20€ peut être un bon trade si le plan était respecté.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                {["Résultat", "En euros", "En R", "Verdict"].map((h) => (
                  <th key={h} className="text-left text-[10px] font-semibold text-zinc-500 uppercase tracking-widest pb-2.5 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Trade 1", "+85€", "+1.7R", "Bon trade"],
                ["Trade 2", "+10€", "+0.2R", "Mauvais trade"],
                ["Trade 3", "-50€", "-1R", "Bon trade (plan respecté)"],
                ["Trade 4", "-50€", "-3R", "Mauvais trade (SL déplacé)"],
              ].map((row, i) => (
                <tr key={i} className="border-t border-zinc-800/70">
                  <td className="py-2.5 pr-4 text-zinc-400 text-xs">{row[0]}</td>
                  <td className="py-2.5 pr-4 text-white text-xs font-mono">{row[1]}</td>
                  <td className="py-2.5 pr-4 text-emerald-400 text-xs font-mono">{row[2]}</td>
                  <td className={`py-2.5 pr-4 text-xs font-medium ${row[3].startsWith("Bon") ? "text-emerald-400" : "text-red-400"}`}>{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Révision</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <LessonKeyPoints
        points={[
          "Le journal transforme l'expérience brute en données utilisables pour progresser.",
          "Documente AVANT (plan, confluences, SL/TP) et APRÈS (résultat, comportement, erreurs).",
          "Mesure tout en R, pas en euros. L'euro biaise la perception de la qualité du trade.",
          "La révision hebdomadaire est aussi importante que le journal lui-même, c'est là que l'apprentissage se produit.",
          "Un trade perdu mais respectant le plan est un bon trade. Un trade gagné mais hors plan est une erreur.",
        ]}
      />

      <LessonExercice
        description="Crée et commence à remplir ton premier journal de trading."
        steps={[
          "Crée un document (Notion, Google Sheets, carnet) avec les colonnes : Date, Instrument, Confluences, Entrée, SL, TP, R/R, Résultat (R), Plan respecté ? (oui/non), Notes.",
          "Retrouve 3 trades passés (sur papier ou en demo) et remplis leur entrée dans le journal.",
          "Pour chaque trade : indique si tu as respecté le plan. Si non, note l'erreur exacte.",
          "Calcule ton win rate et ton R moyen sur ces 3 trades. Que constates-tu ?",
        ]}
      />

      <LessonQuiz
        question="Tu as gagné 3 trades cette semaine pour +1.5R total, et perdu 2 trades pour -2R. Que fait un bon journal te dire ?"
        options={[
          "Ta semaine est négative (-0.5R), tu dois changer de stratégie immédiatement",
          "Le résultat hebdomadaire n'est pas suffisant pour tirer des conclusions, analyse les 5 trades individuellement",
          "Ton win rate de 60% est excellent, continue exactement comme tu fais",
          "Les trades perdus sont plus importants que les gagnants, focus sur les erreurs",
        ]}
        correctIndex={1}
        explanation="5 trades ne permettent pas de tirer des conclusions statistiquement fiables. Un bon journal t'invite à analyser chaque trade individuellement : les trades gagnants étaient-ils bien construits ? Les trades perdants ont-ils respecté le plan ? Le résultat hebdomadaire (-0.5R) peut être normal avec une bonne stratégie sur une petite série."
        answerExplanations={[
          "Trop hâtif. -0.5R sur 5 trades ne justifie aucun changement de stratégie. Un échantillon si court peut représenter une variance normale. Changer de stratégie sur 5 trades, c'est du micro-management contre-productif.",
          "Correct. 5 trades = pas de signal statistique fiable. L'analyse individuelle de chaque trade (plan respecté ? confluences valides ? erreur d'exécution ?) est bien plus instructive que le résultat brut.",
          "Faux. 60% de win rate sur 5 trades ne dit rien de significatif. Et un win rate élevé peut masquer un mauvais R/R. Si les 3 wins font +0.5R chacun et les 2 pertes -1R chacune, le compte est perdant à long terme.",
          "Partiellement vrai. Analyser les erreurs est important, mais ignorer les trades gagnants est une erreur. Comprendre pourquoi un trade a gagné est aussi crucial que comprendre pourquoi un autre a perdu.",
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
