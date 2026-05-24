import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { OTEDiagram } from "@/app/components/charts/OTEDiagram";

export default function ContentEs() {
  return (
    <LessonPage
      formationId="avance"
      lessonId="lecon5"
      title="OTE. Optimal Trade Entry"
      subtitle="El OTE es una técnica de entrada de precisión basada en los retrocesos de Fibonacci. Te permite entrar al mejor precio posible en el sentido del movimiento institucional."
      duration="22 min"
      lessonNumber={5}
      prev={{ href: "/formations/avance/lecon4", label: "Lección 4 : Killzones" }}
      next={{ href: "/formations/avance/lecon6", label: "Lección 6 : Stop Hunts" }}
    >

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">¿Qué es el OTE?</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          El OTE (Optimal Trade Entry) es una zona de retroceso identificada por los niveles de Fibonacci 61.8% y 78.6% de un movimiento impulsivo. Después de un BOS (Break of Structure), el precio suele regresar a esa zona, que coincide con un Order Block o un FVG, antes de retomar la dirección institucional.
        </p>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          El OTE no es una señal de entrada en sí mismo. Es una <span className="text-white font-medium">zona de timing</span> que te dice dónde buscar tu entrada, no directamente por qué.
        </p>
        <div className="bg-blue-500/5 border border-blue-500/15 rounded-xl px-4 py-3">
          <p className="text-sm text-zinc-400 leading-relaxed">
            <span className="text-blue-400 font-medium">Zona OTE:</span> retroceso entre 61.8% y 78.6% de un swing. Ahí es donde las instituciones recompran (en alcista) o revenden (en bajista) a un precio ventajoso.
          </p>
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Cómo trazar el OTE</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          El OTE se traza sobre el último swing significativo, después de un BOS o CHoCH confirmado.
        </p>
        <div className="space-y-2">
          {[
            { step: "1", text: "Identifica un BOS alcista: el precio rompió un Higher High. Ese es el punto de partida." },
            { step: "2", text: "Anota el swing low (A) y el swing high (B) del movimiento impulsivo que creó el BOS." },
            { step: "3", text: "Traza el Fibonacci de A (swing low) a B (swing high)." },
            { step: "4", text: "La zona OTE = entre el retroceso 61.8% y 78.6%. Es tu zona de atención para la entrada." },
            { step: "5", text: "Busca una confluencia en esa zona: OB, FVG, o antiguo nivel de estructura. Ahí es donde entras." },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
              <span className="text-xs font-bold text-blue-400 shrink-0 mt-0.5 w-4">{item.step}</span>
              <p className="text-sm text-zinc-300 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
        <OTEDiagram locale="es" />
      </div>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">OTE + estructura institucional</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          El OTE solo no es suficiente. Su potencia viene de su combinación con los conceptos institucionales vistos previamente.
        </p>
        <div className="space-y-2.5">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
            <p className="font-semibold text-emerald-400 text-sm mb-2">Setup OTE completo (alcista)</p>
            <ul className="space-y-1.5">
              <li className="text-xs text-zinc-400 leading-relaxed">1. Sesgo alcista confirmado (HH/HL en Daily)</li>
              <li className="text-xs text-zinc-400 leading-relaxed">2. BOS alcista en el timeframe de trabajo (H1/H4)</li>
              <li className="text-xs text-zinc-400 leading-relaxed">3. Retroceso dentro de la zona OTE (61.8%–78.6%)</li>
              <li className="text-xs text-zinc-400 leading-relaxed">4. Confluencia en el OTE: Bullish OB o Bullish FVG</li>
              <li className="text-xs text-zinc-400 leading-relaxed">5. Señal de vela en M15 (pin bar, engulfing alcista) → entrada</li>
            </ul>
          </div>
          <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
            <p className="text-sm text-zinc-400 leading-relaxed">
              <span className="text-white font-medium">SL y TP:</span> el stop loss se coloca debajo del swing low (punto A) con un pequeño margen. El take profit apunta al próximo pool de liquidity o nivel de resistencia por encima del BOS.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Lo que el OTE NO es</h2>
        <div className="space-y-2.5">
          {[
            { label: "No es una orden automática", detail: "Llegar a la zona OTE no dispara automáticamente una entrada. Es una zona de atención que requiere confirmación." },
            { label: "No siempre a 61.8%", detail: "El precio puede reaccionar en 63%, 70% o 78%. La zona OTE es un rango : no un nivel único. Usa un OB o FVG para precisar la entrada." },
            { label: "No es válido sin BOS", detail: "El OTE solo tiene sentido tras un BOS. Sin ruptura de estructura confirmada, trazar un Fibonacci es un ejercicio sin fundamento institucional." },
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
        <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Revisión</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <LessonKeyPoints
        points={[
          "OTE = zona de retroceso 61.8%–78.6% de un swing tras un BOS confirmado.",
          "El OTE es una zona de timing, no una señal, necesitas una confluencia (OB o FVG) para entrar.",
          "El setup OTE completo: sesgo → BOS → retroceso OTE → OB/FVG → señal de vela → entrada.",
          "El SL se coloca bajo el swing low (punto A), el TP apunta al próximo pool de liquidity.",
          "Sin BOS previo, trazar el OTE no tiene sentido institucional.",
        ]}
      />

      <LessonExercice
        description="Aplica el setup OTE en un gráfico real."
        steps={[
          "En EUR/USD en H1, identifica el último BOS alcista. Anota el swing low (A) y swing high (B) que lo formaron.",
          "Traza el Fibonacci de A hacia B. Identifica la zona 61.8%–78.6%, es tu zona OTE.",
          "¿Hay un Bullish Order Block o un Bullish FVG dentro de esa zona? Si sí, tienes una confluencia.",
          "Si el precio regresa al OTE, anota la señal de vela esperada para la entrada. Define SL y TP.",
        ]}
      />

      <LessonQuiz
        question="Identificas un BOS alcista en H1. El precio retrocede al 65% del swing A→B y forma una pin bar alcista en un Bullish OB. ¿Qué haces?"
        options={[
          "No entras, 65% no es exactamente el golden ratio en 61.8%",
          "Entras en compra. BOS confirmado, retroceso en la zona OTE, confluencia OB, señal de vela",
          "Esperas que el precio llegue al 78.6% para estar en la zona OTE exacta",
          "Entras en venta, el retroceso de 65% sugiere una debilidad de los compradores",
        ]}
        correctIndex={1}
        explanation="65% está dentro de la zona OTE (61.8%–78.6%). La confluencia Bullish OB + pin bar alcista en esa zona tras un BOS confirmado constituye un setup institucional completo de alta probabilidad. El OTE es un rango, 65% es válido."
        answerExplanations={[
          "Falso. La zona OTE se extiende de 61.8% a 78.6%. El 65% está plenamente dentro de esa zona. Esperar exactamente 61.8% es un error de precisión que hace perder entradas válidas.",
          "Correcto. Todos los elementos del setup OTE completo están reunidos: BOS alcista → retroceso en el OTE → Bullish OB como confluencia → pin bar como señal. Es un setup institucional de alta probabilidad.",
          "Falso. 78.6% es el límite superior de la zona OTE, si una confluencia y una señal aparecen al 65%, no hay ninguna razón para esperar más lejos. Esperar 78.6% sin razón es potencialmente perder la entrada óptima.",
          "Falso. En tendencia alcista con BOS confirmado, un retroceso del 65% es esperado y normal. No es una debilidad, es precisamente la zona de recarga institucional antes de retomar el alza.",
        ]}
      />

    </LessonPage>
  );
}
