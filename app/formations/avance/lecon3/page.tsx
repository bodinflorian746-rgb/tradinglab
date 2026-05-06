import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { OrderBlockDiagram } from "@/app/components/charts/OrderBlockDiagram";

export default function Page() {
  return (
    <LessonPage
      formationId="avance"
      lessonId="lecon3"
      title="Order Blocks"
      subtitle="Un Order Block est la dernière bougie avant un mouvement impulsif institutionnel. C'est là que les institutions ont placé leurs ordres — et où le prix revient souvent les chercher."
      duration="24 min"
      lessonNumber={3}
      prev={{ href: "/formations/avance/lecon2", label: "Leçon 2 — Fair Value Gap" }}
      next={{ href: "/formations/avance/lecon4", label: "Leçon 4 — Killzones" }}
    >

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Qu'est-ce qu'un Order Block ?</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Quand une institution place un ordre massif (achat ou vente), elle ne peut pas l'exécuter en une seule fois — le marché n'a pas assez de liquidité. Elle fractionne ses ordres sur plusieurs bougies, puis lance le mouvement. La dernière bougie avant ce mouvement impulsif est appelée <span className="text-white font-medium">Order Block (OB)</span>.
        </p>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Quand le prix revient dans la zone de cet OB lors d'un retracement, les ordres institutionnels restants s'activent — ce qui crée souvent un rebond puissant.
        </p>
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
          <p className="text-sm text-zinc-400 leading-relaxed">
            <span className="text-white font-medium">En résumé :</span> un OB est une zone où les institutions ont laissé des ordres non exécutés. Le prix y revient pour les combler — et c'est là que tu entres.
          </p>
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Identifier un Order Block valide</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Tous les regroupements de bougies ne sont pas des Order Blocks. Pour qu'un OB soit valide, il doit respecter des critères précis.
        </p>
        <div className="space-y-3">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
            <p className="font-semibold text-emerald-400 text-sm mb-2">Bullish Order Block</p>
            <ul className="space-y-1.5">
              <li className="text-xs text-zinc-400 leading-relaxed">— Dernière bougie <span className="text-white">baissière</span> avant un mouvement haussier impulsif</li>
              <li className="text-xs text-zinc-400 leading-relaxed">— Le mouvement qui suit doit créer un BOS (Break of Structure) haussier</li>
              <li className="text-xs text-zinc-400 leading-relaxed">— La zone de l'OB = corps de cette bougie baissière (open → close)</li>
              <li className="text-xs text-zinc-400 leading-relaxed">— Signal d'achat quand le prix revient dans cette zone en retracement</li>
            </ul>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
            <p className="font-semibold text-red-400 text-sm mb-2">Bearish Order Block</p>
            <ul className="space-y-1.5">
              <li className="text-xs text-zinc-400 leading-relaxed">— Dernière bougie <span className="text-white">haussière</span> avant un mouvement baissier impulsif</li>
              <li className="text-xs text-zinc-400 leading-relaxed">— Le mouvement qui suit doit créer un BOS baissier</li>
              <li className="text-xs text-zinc-400 leading-relaxed">— La zone de l'OB = corps de cette bougie haussière (open → close)</li>
              <li className="text-xs text-zinc-400 leading-relaxed">— Signal de vente quand le prix revient dans cette zone</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
        <OrderBlockDiagram />
      </div>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">OB vs Order Block "mitigé"</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Un Order Block n'est valide qu'une seule fois. Quand le prix y revient et réagit, on dit que l'OB est <span className="text-white font-medium">"mitigé"</span>. Après mitigation, la zone perd sa puissance institutionnelle — tu ne dois plus traiter un OB mitigé comme un signal.
        </p>
        <div className="space-y-2">
          {[
            { step: "1", text: "OB formé (mouvement impulsif crée la zone) → zone active, non mitigée" },
            { step: "2", text: "Le prix revient dans l'OB → réaction haussière ou baissière → OB mitigé" },
            { step: "3", text: "Si le prix traverse l'OB sans réaction → OB invalidé, retire-le de ton analyse" },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
              <span className="text-xs font-bold text-blue-400 shrink-0 mt-0.5 w-4">{item.step}</span>
              <p className="text-sm text-zinc-300 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Order Block + confluences = setup institutionnel</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Un OB seul n'est pas suffisant. Sa puissance est décuplée quand il coïncide avec d'autres éléments institutionnels.
        </p>
        <div className="space-y-2.5">
          {[
            { label: "OB + FVG dans la même zone", detail: "Si un Fair Value Gap se trouve dans la zone de l'Order Block, la confluence est extrêmement puissante." },
            { label: "OB + niveau de liquidité", detail: "Un OB situé juste en dessous d'un pool de liquidité BSL ou SSL augmente drastiquement la probabilité d'une réaction." },
            { label: "OB + biais de structure", detail: "En tendance haussière, ne trader que les Bullish OB. L'OB doit être dans le sens du marché dominant." },
            { label: "Confirmation bougie", detail: "Attends un rejet dans l'OB (pin bar, engulfing) avant d'entrer. Ne pas entrer aveuglément dans la zone." },
          ].map((r, i) => (
            <div key={i} className="flex items-start gap-3 bg-zinc-800/40 rounded-xl px-4 py-3">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-1.5" />
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
          "Un Order Block = dernière bougie avant un mouvement impulsif institutionnel créant un BOS.",
          "Bullish OB = dernière bougie baissière avant une hausse impulsive. Bearish OB = inverse.",
          "La zone de l'OB est définie par le corps (open → close) de la bougie, pas les mèches.",
          "Un OB est valide une seule fois : après mitigation, il perd sa puissance — ne plus le trader.",
          "La confluence OB + FVG est l'une des combinaisons les plus puissantes en Smart Money.",
        ]}
      />

      <LessonExercice
        description="Sur TradingView, identifie des Order Blocks actifs sur EUR/USD en H1."
        steps={[
          "Cherche un mouvement impulsif haussier récent (une série de bougies directionnelles sans retracement). Note la bougie qui le précède.",
          "Vérifie : cette bougie est-elle baissière ? Si oui, c'est un Bullish Order Block potentiel. Note ses niveaux open et close.",
          "Le prix est-il revenu dans la zone depuis ? Si oui, y a-t-il eu une réaction (rebond) ? L'OB est-il mitigé ou encore actif ?",
          "Répète l'exercice pour un mouvement baissier — trouve un Bearish Order Block.",
        ]}
      />

      <LessonQuiz
        question="Tu identifies un mouvement haussier impulsif sur le graphique. La bougie juste avant ce mouvement est une bougie baissière. Que représente-t-elle ?"
        options={[
          "Un signal de vente — la bougie baissière signifie que le marché va baisser",
          "Un Bullish Order Block — c'est la zone où les institutions ont placé leurs ordres d'achat",
          "Un Fair Value Gap — il n'y a pas eu d'échanges à ce niveau",
          "Un niveau de support/résistance classique sans signification institutionnelle",
        ]}
        correctIndex={1}
        explanation="La dernière bougie baissière avant un mouvement haussier impulsif est un Bullish Order Block. Paradoxalement, c'est une bougie baissière qui marque une zone d'achat institutionnel — les institutions ont absorbé la pression vendeuse dans cette bougie avant de lancer leur mouvement haussier."
        answerExplanations={[
          "Faux. La direction de la bougie en elle-même n'est pas le signal — c'est son contexte. Une bougie baissière précédant un mouvement haussier impulsif est un Bullish OB, pas un signal de vente.",
          "Correct. C'est précisément la définition d'un Bullish Order Block. La dernière bougie directionnellement opposée avant un mouvement impulsif marque la zone où les institutions ont exécuté leurs ordres.",
          "Faux. Un FVG se définit sur 3 bougies et concerne une zone de prix non échangée. L'Order Block est la bougie elle-même (son corps), pas un espace entre bougies.",
          "Faux. Ce n'est pas un simple S/R — c'est une zone institutionnelle avec des ordres en attente. La différence est fondamentale : les OB ont une logique de déclenchement que les S/R classiques n'ont pas.",
        ]}
      />

    </LessonPage>
  );
}
