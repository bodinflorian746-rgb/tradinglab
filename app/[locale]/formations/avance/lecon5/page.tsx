import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { OTEDiagram } from "@/app/components/charts/OTEDiagram";
import ContentEs from "./_content-es";

function ContentFr() {
  return (
    <LessonPage
      formationId="avance"
      lessonId="lecon5"
      title="OTE. Optimal Trade Entry"
      subtitle="L'OTE est une technique d'entrée de précision basée sur les retracements de Fibonacci. Elle te permet d'entrer au meilleur prix possible dans le sens du mouvement institutionnel."
      duration="22 min"
      lessonNumber={5}
      prev={{ href: "/formations/avance/lecon4", label: "Leçon 4 : Killzones" }}
      next={{ href: "/formations/avance/lecon6", label: "Leçon 6 : Stop Hunts" }}
    >

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Qu'est-ce que l'OTE ?</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          L'OTE (Optimal Trade Entry) est une zone de retracement identifiée par les niveaux Fibonacci 61.8% et 78.6% d'un mouvement impulsif. Après un BOS (Break of Structure), le prix revient souvent dans cette zone, qui coïncide avec un Order Block ou un FVG, avant de repartir dans la direction institutionnelle.
        </p>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          L'OTE n'est pas un signal d'entrée en lui-même. C'est une <span className="text-white font-medium">zone de timing</span> qui te dit où chercher ton entrée, pas directement pourquoi.
        </p>
        <div className="bg-blue-500/5 border border-blue-500/15 rounded-xl px-4 py-3">
          <p className="text-sm text-zinc-400 leading-relaxed">
            <span className="text-blue-400 font-medium">Zone OTE :</span> retracement entre 61.8% et 78.6% d'un swing. C'est là que les institutions rachètent (en haussier) ou revendent (en baissier) à un prix avantageux.
          </p>
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Comment tracer l'OTE</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          L'OTE se trace sur le dernier swing significatif, après un BOS ou CHoCH confirmé.
        </p>
        <div className="space-y-2">
          {[
            { step: "1", text: "Identifie un BOS haussier : le prix a cassé un Higher High. C'est le point de départ." },
            { step: "2", text: "Note le swing low (A) et le swing high (B) du mouvement impulsif qui a créé le BOS." },
            { step: "3", text: "Trace le Fibonacci de A (swing low) à B (swing high)." },
            { step: "4", text: "La zone OTE = entre le retracement 61.8% et 78.6%. C'est ta zone d'attention pour l'entrée." },
            { step: "5", text: "Cherche une confluence dans cette zone : OB, FVG, ou ancien niveau de structure. C'est là qu'on entre." },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
              <span className="text-xs font-bold text-blue-400 shrink-0 mt-0.5 w-4">{item.step}</span>
              <p className="text-sm text-zinc-300 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
        <OTEDiagram />
      </div>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">OTE + Structure institutionnelle</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          L'OTE seul n'est pas suffisant. Sa puissance vient de sa combinaison avec les concepts institutionnels vus précédemment.
        </p>
        <div className="space-y-2.5">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
            <p className="font-semibold text-emerald-400 text-sm mb-2">Setup OTE complet (haussier)</p>
            <ul className="space-y-1.5">
              <li className="text-xs text-zinc-400 leading-relaxed">1. Biais haussier confirmé (HH/HL en Daily)</li>
              <li className="text-xs text-zinc-400 leading-relaxed">2. BOS haussier sur le timeframe de travail (H1/H4)</li>
              <li className="text-xs text-zinc-400 leading-relaxed">3. Retracement dans la zone OTE (61.8%–78.6%)</li>
              <li className="text-xs text-zinc-400 leading-relaxed">4. Confluence dans l'OTE : Bullish OB ou Bullish FVG</li>
              <li className="text-xs text-zinc-400 leading-relaxed">5. Signal de bougie sur M15 (pin bar, engulfing haussier) → entrée</li>
            </ul>
          </div>
          <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
            <p className="text-sm text-zinc-400 leading-relaxed">
              <span className="text-white font-medium">SL et TP :</span> le Stop Loss se place en dessous du swing low (point A) avec une petite marge. Le Take Profit vise le prochain pool de liquidité ou niveau de résistance au-dessus du BOS.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Ce que l'OTE n'est pas</h2>
        <div className="space-y-2.5">
          {[
            { label: "Pas un ordre automatique", detail: "Arriver dans la zone OTE ne déclenche pas automatiquement une entrée. C'est une zone d'attention qui requiert une confirmation." },
            { label: "Pas toujours à 61.8%", detail: "Le prix peut réagir à 63%, 70% ou 78%. La zone OTE est une plage : pas un niveau unique. Utilise un OB ou FVG pour préciser l'entrée." },
            { label: "Pas valide sans BOS", detail: "L'OTE n'a de sens qu'après un BOS. Sans rupture de structure confirmée, tracer un Fibonacci est un exercice sans fondement institutionnel." },
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
          "OTE = zone de retracement 61.8%–78.6% d'un swing après un BOS confirmé.",
          "L'OTE est une zone de timing, pas un signal, il faut une confluence (OB ou FVG) pour entrer.",
          "Le setup OTE complet : biais → BOS → retracement OTE → OB/FVG → signal bougie → entrée.",
          "Le SL se place sous le swing low (point A), le TP vise le prochain pool de liquidité.",
          "Sans BOS préalable, tracer l'OTE n'a pas de sens institutionnel.",
        ]}
      />

      <LessonExercice
        description="Applique le setup OTE sur un graphique réel."
        steps={[
          "Sur EUR/USD en H1, identifie le dernier BOS haussier. Note le swing low (A) et swing high (B) qui l'ont créé.",
          "Trace le Fibonacci de A vers B. Identifie la zone 61.8%–78.6%, c'est ta zone OTE.",
          "Y a-t-il un Bullish Order Block ou un Bullish FVG dans cette zone ? Si oui, tu as une confluence.",
          "Si le prix revient dans l'OTE, note le signal de bougie attendu pour l'entrée. Définis SL et TP.",
        ]}
      />

      <LessonQuiz
        question="Tu identifies un BOS haussier sur H1. Le prix retrace à 65% du swing A→B et forme une pin bar haussière dans un Bullish OB. Que fais-tu ?"
        options={[
          "Tu n'entres pas, 65% n'est pas exactement le golden ratio à 61.8%",
          "Tu entres en achat. BOS confirmé, retracement dans la zone OTE, confluence OB, signal de bougie",
          "Tu attends que le prix revienne à 78.6% pour être dans la zone OTE exacte",
          "Tu entres en vente, le retracement de 65% suggère une faiblesse des acheteurs",
        ]}
        correctIndex={1}
        explanation="65% est dans la zone OTE (61.8%–78.6%). La confluence Bullish OB + pin bar haussière dans cette zone après un BOS confirmé constitue un setup institutionnel complet à haute probabilité. L'OTE est une plage, 65% est valide."
        answerExplanations={[
          "Faux. La zone OTE s'étend de 61.8% à 78.6%. Le 65% est pleinement dans cette zone. Attendre exactement 61.8% est une erreur de précision qui fait manquer des entrées valides.",
          "Correct. Tous les éléments du setup OTE complet sont réunis : BOS haussier → retracement dans l'OTE → Bullish OB comme confluence → pin bar comme signal. C'est un setup institutionnel à haute probabilité.",
          "Faux. 78.6% est la limite haute de la zone OTE, si une confluence et un signal apparaissent à 65%, il n'y a aucune raison d'attendre plus loin. Attendre 78.6% sans raison, c'est potentiellement rater l'entrée optimale.",
          "Faux. En tendance haussière avec BOS confirmé, un retracement de 65% est attendu et normal. Ce n'est pas une faiblesse, c'est précisément la zone de recharge institutionnelle avant la reprise haussière.",
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
