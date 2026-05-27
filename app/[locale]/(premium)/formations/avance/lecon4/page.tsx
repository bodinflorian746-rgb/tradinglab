import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { KillzonesDiagram } from "@/app/components/charts/KillzonesDiagram";
import ContentEs from "./_content-es";

function ContentFr() {
  return (
    <LessonPage
      formationId="avance"
      lessonId="lecon4"
      title="Killzones, les sessions qui comptent"
      subtitle="Le marché ne bouge pas uniformément. Il existe des fenêtres horaires précises où l'activité institutionnelle est maximale, c'est là que se forment les meilleurs setups."
      duration="20 min"
      lessonNumber={4}
      prev={{ href: "/formations/avance/lecon3", label: "Leçon 3 : Order Blocks" }}
      next={{ href: "/formations/avance/lecon5", label: "Leçon 5 : OTE" }}
    >

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Pourquoi le timing est critique</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          La plupart des traders analysent <em>quoi</em> trader, mais ignorent <em>quand</em> trader. Or, les institutions opèrent selon des horaires précis liés aux ouvertures des grandes places financières. En dehors de ces fenêtres, le marché est dominé par les retail traders, les mouvements sont moins fiables, plus aléatoires.
        </p>
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
          <p className="text-sm text-zinc-400 leading-relaxed">
            <span className="text-white font-medium">Killzone :</span> fenêtre horaire où l'activité institutionnelle est concentrée. Les prix bougent avec plus de force, les niveaux sont plus respectés, et les faux signaux sont moins fréquents.
          </p>
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Les 4 Killzones principales</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Ces horaires sont en heure de Paris (CET/CEST). Adapte selon l'heure d'été ou d'hiver.
        </p>
        <div className="space-y-3">
          {[
            {
              name: "Asian Killzone",
              hours: "01h00 – 04h00",
              color: "bg-blue-500/5 border-blue-500/15 text-blue-400",
              detail: "Session asiatique (Tokyo). Faible volume, le marché accumule souvent. Les niveaux formés ici servent de référence pour les sessions européenne et américaine. Utile pour identifier les manipulations de nuit (NY Midnight Open).",
            },
            {
              name: "London Killzone",
              hours: "07h00 – 10h00",
              color: "bg-emerald-500/5 border-emerald-500/15 text-emerald-400",
              detail: "Ouverture de Londres, l'une des fenêtres les plus puissantes. Les institutions européennes entrent sur le marché. On voit souvent un sweep de liquidité suivi d'un mouvement directionnel fort. C'est ici que se forment les highs ou lows de la journée.",
            },
            {
              name: "New York Killzone",
              hours: "13h00 – 16h00",
              color: "bg-emerald-500/5 border-emerald-500/15 text-emerald-400",
              detail: "Ouverture de New York, la plus volatile. Recoupement avec Londres pendant 1h à 2h : liquidité maximale. Les annonces économiques majeures tombent à 13h30 ou 15h00. Les mouvements ici sont rapides et puissants.",
            },
            {
              name: "London Close",
              hours: "16h00 – 17h00",
              color: "bg-blue-500/5 border-blue-500/15 text-blue-400",
              detail: "Fermeture de Londres. Les institutions européennes liquident ou ajustent leurs positions. On voit souvent un retournement ou un mouvement de retracement. Utile pour les exits et les prises de profit partielles.",
            },
          ].map((kz, i) => (
            <div key={i} className={`rounded-xl p-4 border ${kz.color}`}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold">{kz.name}</p>
                <span className="text-xs font-mono text-zinc-400">{kz.hours}</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">{kz.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
        <KillzonesDiagram />
      </div>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Comment utiliser les Killzones</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Les Killzones structurent ta journée de trading. Elles te disent quand être devant l'écran, et surtout quand ne pas trader.
        </p>
        <div className="space-y-2.5">
          {[
            {
              label: "Analyse avant la Killzone",
              detail: "Identifie tes zones clés (OB, FVG, liquidité) AVANT l'ouverture. Entre dans la Killzone avec un plan déjà défini.",
            },
            {
              label: "Observe les 15 premières minutes",
              detail: "La toute première bougie de la session donne souvent l'orientation. Un sweep de liquidité suivi d'un retournement dans les 15 min est un signal classique.",
            },
            {
              label: "N'entre pas en milieu de Killzone",
              detail: "Le meilleur moment d'entrée est proche du début de la Killzone. En plein milieu, tu risques d'entrer à contre-temps.",
            },
            {
              label: "Évite les heures creuses",
              detail: "Entre 10h et 13h (après Londres et avant NY), la liquidité chute. Les faux signaux sont beaucoup plus fréquents.",
            },
          ].map((r, i) => (
            <div key={i} className="flex items-start gap-3 bg-zinc-800/40 rounded-xl px-4 py-3">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-emerald-400 shrink-0 mt-0.5">
                <path d="M2 7l3.5 3.5 6.5-6.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
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
          "Les Killzones sont les fenêtres horaires d'activité institutionnelle maximale.",
          "London Killzone (07h–10h) et NY Killzone (13h–16h) sont les plus importantes pour le Forex.",
          "Analyse et planifie AVANT l'ouverture, entre dans la Killzone avec un plan, pas des questions.",
          "Les heures creuses (10h–13h) sont piégeuses : faible liquidité, mouvements aléatoires.",
          "La Asian Session (01h–04h) forme souvent les niveaux que Londres et NY viennent chercher.",
        ]}
      />

      <LessonExercice
        description="Observe un jour complet de trading en temps réel en te concentrant sur les Killzones."
        steps={[
          "Sur TradingView, ouvre EUR/USD en M15. Ajoute des lignes verticales à 07h00 et 10h00 (London KZ) et à 13h00 et 16h00 (NY KZ).",
          "Identifie les niveaux de liquidité la veille au soir (EQH, EQL, OB). Note-les sur le graphique.",
          "À l'ouverture de la London KZ (07h00), observe : y a-t-il un sweep d'un niveau de la nuit ? Suivi d'un retournement ?",
          "Répète à 13h00 pour la NY KZ. Note la différence de volatilité entre les Killzones et les heures creuses.",
        ]}
      />

      <LessonQuiz
        question="Tu veux trader EUR/USD. Il est 11h30 (heure de Paris). Que fais-tu ?"
        options={[
          "Tu trades normalement, le marché est toujours ouvert et actif",
          "Tu attends la NY Killzone (13h00), la liquidité actuelle est trop faible pour des setups fiables",
          "Tu passes en M5 pour capter les micro-mouvements de cette heure creuse",
          "Tu shortcut en cassure de range, les heures creuses sont idéales pour les breakouts",
        ]}
        correctIndex={1}
        explanation="11h30 est en pleine heure creuse, après la fermeture de la London Killzone et avant l'ouverture de New York. La liquidité institutionnelle est minimale, les mouvements sont aléatoires et les faux signaux nombreux. La décision disciplinée est d'attendre la NY Killzone à 13h00."
        answerExplanations={[
          "Faux. Le marché est ouvert, mais ce n'est pas suffisant pour trader. Les heures creuses (10h–13h) ont une liquidité institutionnelle très faible, les mouvements manquent de direction et les faux signaux pullulent.",
          "Correct. En attendant la NY Killzone, tu t'assures d'opérer dans une fenêtre où l'activité institutionnelle est forte, les mouvements directionnels et les setups plus fiables.",
          "Faux. Descendre en M5 pendant les heures creuses amplifie le problème, le bruit est encore plus fort sur les petits timeframes quand la liquidité est faible.",
          "Faux. Les heures creuses ne sont pas idéales pour les breakouts, elles sont connues pour les faux breakouts précisément parce que le volume institutionnel manque pour confirmer les cassures.",
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
