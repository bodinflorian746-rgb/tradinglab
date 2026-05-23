import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { PrecisionEntryDiagram } from "@/app/components/charts/PrecisionEntryDiagram";
import ContentEs from "./_content-es";

function ContentFr() {
  return (
    <LessonPage
      formationId="avance"
      lessonId="lecon7"
      title="Entrées de précision"
      subtitle="L'entrée est le moment où tout se joue. Une entrée précise te donne un SL serré, un R/R élevé, et moins de stress une fois le trade ouvert. Voici comment affiner chaque entrée."
      duration="25 min"
      lessonNumber={7}
      prev={{ href: "/formations/avance/lecon6", label: "Leçon 6 — Stop Hunts" }}
      next={{ href: "/formations/avance/lecon8", label: "Leçon 8 — Journaling" }}
    >

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Pourquoi l'entrée précise change tout</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Deux traders peuvent analyser le même setup et avoir des résultats très différents selon leur point d'entrée. Un trader qui entre en plein milieu d'un OB a un SL large et un mauvais R/R. Un trader qui entre sur le rejet dans l'OB a un SL serré et un R/R potentiellement supérieur à 1:5.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
            <p className="font-semibold text-red-400 text-sm mb-2">Entrée imprécise</p>
            <p className="text-xs text-zinc-400 leading-relaxed">Le trader entre dès que le prix arrive dans la zone. SL large (sous toute la zone). R/R souvent inférieur à 1:2. Plus de probabilité d'être stoppé sur un retracement interne.</p>
          </div>
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
            <p className="font-semibold text-emerald-400 text-sm mb-2">Entrée de précision</p>
            <p className="text-xs text-zinc-400 leading-relaxed">Le trader attend un signal de rejet sur le M5/M15 dans la zone. SL serré (sous le signal). R/R souvent supérieur à 1:3 ou 1:5. Moins d'exposition au risque.</p>
          </div>
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Les 3 méthodes d'entrée de précision</h2>
        <div className="space-y-3">
          {[
            {
              title: "1. Entrée sur rejet de bougie (M5/M15)",
              color: "bg-blue-500/5 border-blue-500/15",
              accentColor: "text-blue-400",
              detail: "Quand le prix arrive dans la zone (OB, FVG, OTE), descends en M5 ou M15. Attends une bougie de rejet : pin bar avec longue mèche dans la zone, ou engulfing dans le sens opposé. Entre sur la clôture de cette bougie. SL sous le bas de la mèche.",
            },
            {
              title: "2. Entrée sur retest d'un niveau cassé",
              color: "bg-blue-500/5 border-blue-500/15",
              accentColor: "text-blue-400",
              detail: "Après un BOS, le prix revient souvent tester l'ancien niveau cassé (maintenant support ou résistance). C'est une entrée classique : précise, avec un contexte fort. Entre sur le rejet du retour sur le niveau cassé.",
            },
            {
              title: "3. Entrée sur le sweep + retournement",
              color: "bg-amber-400/5 border-amber-400/15",
              accentColor: "text-amber-400",
              detail: "Après un stop hunt (sweep d'un EQH ou EQL), le retournement est souvent rapide et fort. Entre dès la première bougie qui confirme le retournement en M5. SL au-delà du pic du sweep. C'est l'entrée post-stop-hunt.",
            },
          ].map((m, i) => (
            <div key={i} className={`rounded-xl p-4 border ${m.color}`}>
              <p className={`text-sm font-semibold mb-2 ${m.accentColor}`}>{m.title}</p>
              <p className="text-xs text-zinc-400 leading-relaxed">{m.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
        <PrecisionEntryDiagram />
      </div>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Placement du Stop Loss de précision</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Un SL de précision se place sur une logique de structure — jamais arbitrairement. Il doit être invalidant : si le prix l'atteint, le setup est vraiment invalidé.
        </p>
        <div className="space-y-2.5">
          {[
            { rule: "Sous le bas de la zone (OB ou FVG)", detail: "Si le prix traverse entièrement l'OB ou le FVG, le niveau institutionnel est consommé — l'idée de trade est invalidée." },
            { rule: "Sous le swing low de l'entrée", detail: "Si tu entres sur un rejet en M15, le SL va sous le plus bas de la pin bar ou de l'engulfing." },
            { rule: "Quelques pips de marge", detail: "Laisse 2 à 5 pips (selon l'instrument) sous le niveau exact pour éviter d'être stoppé par le spread ou le bruit naturel du marché." },
            { rule: "Jamais un montant fixe", detail: "Un SL de 20 pips 'parce que c'est ton habitude' n'a aucun sens structurel. Le SL doit refléter la géographie du graphique." },
          ].map((r, i) => (
            <div key={i} className="flex items-start gap-3 bg-zinc-800/40 rounded-xl px-4 py-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
              <div>
                <p className="text-sm font-medium text-white">{r.rule}</p>
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
          "L'entrée précise = attendre un signal de confirmation sur M5/M15 dans la zone institutionnelle.",
          "Les 3 méthodes : rejet de bougie, retest du niveau cassé, sweep + retournement.",
          "Un SL précis se base sur la structure du graphique — jamais sur un montant fixe arbitraire.",
          "Descendre en M5 pour affiner l'entrée permet un SL plus serré et un R/R significativement meilleur.",
          "L'attente d'une confirmation réduit le nombre de trades — mais améliore la qualité de chacun.",
        ]}
      />

      <LessonExercice
        description="Sur un setup que tu as identifié, entraîne-toi à affiner l'entrée sur un petit timeframe."
        steps={[
          "Identifie un Bullish Order Block actif sur H1. Marque la zone (open → close de la bougie OB).",
          "Descends en M5. Si le prix est dans la zone, observe : y a-t-il un rejet (pin bar, engulfing haussier) ?",
          "Si le signal est là : note le prix d'entrée (clôture de la pin bar/engulfing), le SL (sous la mèche basse), et le TP (prochain niveau de résistance ou liquidité).",
          "Calcule ton R/R. Est-il supérieur à 1:3 ? Si non, le setup est-il vraiment valide ?",
        ]}
      />

      <LessonQuiz
        question="Le prix arrive dans un Bullish Order Block sur H1. Quelle est la meilleure entrée ?"
        options={[
          "Entrer immédiatement au prix du marché dès que le prix touche le bas de l'OB",
          "Placer un ordre limit au milieu de l'OB pour ne pas rater le mouvement",
          "Descendre en M5/M15 et attendre un signal de rejet (pin bar ou engulfing haussier) avant d'entrer",
          "Entrer en achat sur la prochaine bougie M15 qui clôture haussière dans l'OB",
        ]}
        correctIndex={2}
        explanation="Attendre un signal de rejet sur M5/M15 est l'approche la plus précise. Elle te donne une confirmation que le prix réagit effectivement à l'OB (pas juste en transit), un SL serré sur le bas du signal, et un R/R nettement supérieur à une entrée au toucher ou au milieu de la zone."
        answerExplanations={[
          "Trop hâtif. Le prix peut traverser le bas de l'OB puis revenir — ou le traverser complètement. Entrer au toucher sans confirmation expose à un SL large ou à un stop prématuré.",
          "Mieux que le toucher, mais encore imprécis. Le milieu de l'OB n'a pas de logique structurelle particulière. Un ordre limit ici peut aussi être déclenché sans que le prix réagisse.",
          "Correct. C'est l'entrée de précision : descendre en M5/M15, attendre un rejet dans la zone OB, entrer sur la clôture du signal avec un SL sous le bas de la mèche. C'est l'équilibre optimal entre confirmation et timing.",
          "Pas assez précis. 'La prochaine bougie haussière' dans l'OB peut être n'importe quelle petite bougie verte — ce n'est pas nécessairement un signal de rejet fort. Une pin bar ou un engulfing est requis pour une confirmation institutionnelle.",
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
