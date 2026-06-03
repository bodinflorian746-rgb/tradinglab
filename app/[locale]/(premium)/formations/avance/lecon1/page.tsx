import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LiquidityPoolsDiagram } from "@/app/components/charts/LiquidityPoolsDiagram";
import ContentEs from "./_content-es";

function ContentFr() {
  return (
    <LessonPage
      formationId="avance"
      lessonId="lecon1"
      title="Liquidité"
      subtitle="Les institutions ont besoin de liquidité pour exécuter leurs ordres. Comprendre où elle se trouve, c'est comprendre où le marché va réellement aller."
      duration="25 min"
      lessonNumber={1}
      prev={null}
      next={{ href: "/formations/avance/lecon2", label: "Leçon 2 : Fair Value Gap" }}
    >

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Qu'est-ce que la liquidité ?</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          La liquidité, c'est la capacité à exécuter un ordre sans faire bouger
          le prix. Pour une institution qui place un ordre de plusieurs millions,
          il lui faut un contrepartiste, quelqu'un qui vend quand elle achète,
          et vice versa.
        </p>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Ces contreparties se trouvent là où les autres traders ont placé leurs
          stop-loss. Les stops sont des ordres en attente, ils constituent un
          pool de liquidité que les institutions exploitent.
        </p>
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
          <p className="text-sm text-zinc-400 leading-relaxed">
            <span className="text-white font-medium">À retenir :</span> le marché
            se déplace vers la liquidité, pas l'inverse. Avant tout grand mouvement,
            le prix va souvent chercher les stops pour alimenter le mouvement suivant.
          </p>
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Buy-side et Sell-side Liquidity</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Les pools de liquidité se forment autour des niveaux évidents que tout
          le monde surveille, c'est précisément là que s'accumulent les stops.
        </p>
        <div className="space-y-3 mb-4">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
            <p className="font-semibold text-emerald-400 text-sm mb-2">Buy-side Liquidity (BSL)</p>
            <p className="text-xs text-zinc-400 leading-relaxed mb-2">
              Se trouve <span className="text-white">au-dessus</span> des résistances
              et des Equal Highs (EQH). Les traders short y ont placé leurs stops.
              Quand le prix y monte, il déclenche ces stops, des ordres d'achat
              qui alimentent une vente institutionnelle.
            </p>
            <p className="text-xs text-zinc-500">
              EQH = Equal Highs : deux sommets au même niveau. Signal classique de liquidité accumulée.
            </p>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
            <p className="font-semibold text-red-400 text-sm mb-2">Sell-side Liquidity (SSL)</p>
            <p className="text-xs text-zinc-400 leading-relaxed mb-2">
              Se trouve <span className="text-white">en dessous</span> des supports
              et des Equal Lows (EQL). Les traders long y ont placé leurs stops.
              Quand le prix y descend, il déclenche ces stops, des ordres de vente
              qui alimentent un achat institutionnel.
            </p>
            <p className="text-xs text-zinc-500">
              EQL = Equal Lows : deux creux au même niveau. Zone typique de liquidité vendeuse.
            </p>
          </div>
        </div>
      </section>

      <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
        <LiquidityPoolsDiagram />
      </div>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-sm text-zinc-300 leading-relaxed">
          Ces zones de liquidité sont précisément ce que visent les stop hunts :
          des mouvements brusques qui déclenchent les stops accumulés avant de
          repartir dans l&apos;autre sens. On les étudie en détail en leçon 6.
        </p>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Exploiter la liquidité dans tes setups</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Une fois que tu identifies les pools de liquidité, tu peux anticiper où
          le prix va aller chercher avant de s'inverser, et positionner ton entrée en conséquence.
        </p>
        <div className="space-y-2.5">
          {[
            {
              label: "Identifie les EQH / EQL sur le graphique",
              detail: "Cherche deux ou trois sommets ou creux au même niveau, c'est là que les stops s'accumulent.",
            },
            {
              label: "Attends que le prix y aille",
              detail: "Ne suis pas la mèche. Observe le comportement à l'arrivée dans la zone de liquidité.",
            },
            {
              label: "Confirme le rejet avant d'entrer",
              detail: "Une bougie de rejet (pin bar, engulfing) après le stop hunt est ton signal d'entrée.",
            },
            {
              label: "Cible la liquidité opposée comme objectif",
              detail: "Si tu entres après une prise de SSL, vise le BSL au-dessus comme take profit.",
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
          "Les institutions ont besoin de liquidité pour exécuter leurs ordres, elles vont la chercher là où se trouvent les stops.",
          "Buy-side Liquidity = au-dessus des Equal Highs. Sell-side Liquidity = en dessous des Equal Lows.",
          "Le prix se déplace vers la liquidité avant de partir dans sa vraie direction, anticipe ce mouvement.",
        ]}
      />

      <LessonExercice
        description="Sur n'importe quel graphique en H1, pars à la chasse aux pools de liquidité. C'est l'analyse la plus importante avant tout trade."
        steps={[
          "Identifie au moins un ensemble d'Equal Highs (EQH), deux ou plusieurs sommets alignés au même niveau.",
          "Identifie au moins un ensemble d'Equal Lows (EQL), deux ou plusieurs creux alignés au même niveau.",
          "Le prix est-il récemment allé prendre l'un de ces niveaux avant de repartir dans l'autre sens ? Tu viens d'identifier un stop hunt.",
        ]}
      />

      <LessonQuiz
        question="Pourquoi les institutions chassent-elles les stops des retail traders ?"
        options={[
          "Pour manipuler le marché de façon illégale et profiter seules",
          "Pour générer la liquidité nécessaire à l'exécution de leurs propres ordres",
          "Pour déclencher des signaux techniques et attirer de nouveaux acheteurs",
        ]}
        correctIndex={1}
        explanation="Les institutions passent des ordres massifs qui nécessitent une contrepartie équivalente. Les stop-loss des retail traders sont des ordres en attente, en poussant le prix vers ces niveaux, les institutions déclenchent ces stops et obtiennent la liquidité dont elles ont besoin pour entrer ou sortir du marché à grande échelle."
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
