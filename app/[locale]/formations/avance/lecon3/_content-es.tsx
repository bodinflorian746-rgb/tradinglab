import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { OrderBlockDiagram } from "@/app/components/charts/OrderBlockDiagram";

export default function ContentEs() {
  return (
    <LessonPage
      formationId="avance"
      lessonId="lecon3"
      title="Order Blocks"
      subtitle="Un Order Block es la última vela antes de un movimiento impulsivo institucional. Ahí es donde las instituciones colocaron sus órdenes — y donde el precio suele volver a buscarlas."
      duration="24 min"
      lessonNumber={3}
      prev={{ href: "/formations/avance/lecon2", label: "Lección 2 — Fair Value Gap" }}
      next={{ href: "/formations/avance/lecon4", label: "Lección 4 — Killzones" }}
    >

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">¿Qué es un Order Block?</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Cuando una institución coloca una orden masiva (de compra o venta), no puede ejecutarla de una sola vez — el mercado no tiene suficiente liquidity. Fracciona sus órdenes en varias velas y luego lanza el movimiento. La última vela antes de ese movimiento impulsivo se llama <span className="text-white font-medium">Order Block (OB)</span>.
        </p>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Cuando el precio regresa a la zona de ese OB durante un retroceso, las órdenes institucionales restantes se activan — lo que suele crear un rebote potente.
        </p>
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
          <p className="text-sm text-zinc-400 leading-relaxed">
            <span className="text-white font-medium">En resumen:</span> un OB es una zona donde las instituciones dejaron órdenes sin ejecutar. El precio regresa para completarlas — y ahí es donde tú entras.
          </p>
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Identificar un Order Block válido</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          No todos los agrupamientos de velas son Order Blocks. Para que un OB sea válido, debe cumplir criterios precisos.
        </p>
        <div className="space-y-3">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
            <p className="font-semibold text-emerald-400 text-sm mb-2">Bullish Order Block</p>
            <ul className="space-y-1.5">
              <li className="text-xs text-zinc-400 leading-relaxed">— Última vela <span className="text-white">bajista</span> antes de un movimiento alcista impulsivo</li>
              <li className="text-xs text-zinc-400 leading-relaxed">— El movimiento que sigue debe crear un BOS (Break of Structure) alcista</li>
              <li className="text-xs text-zinc-400 leading-relaxed">— La zona del OB = cuerpo de esa vela bajista (open → close)</li>
              <li className="text-xs text-zinc-400 leading-relaxed">— Señal de compra cuando el precio regresa a esa zona en retroceso</li>
            </ul>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
            <p className="font-semibold text-red-400 text-sm mb-2">Bearish Order Block</p>
            <ul className="space-y-1.5">
              <li className="text-xs text-zinc-400 leading-relaxed">— Última vela <span className="text-white">alcista</span> antes de un movimiento bajista impulsivo</li>
              <li className="text-xs text-zinc-400 leading-relaxed">— El movimiento que sigue debe crear un BOS bajista</li>
              <li className="text-xs text-zinc-400 leading-relaxed">— La zona del OB = cuerpo de esa vela alcista (open → close)</li>
              <li className="text-xs text-zinc-400 leading-relaxed">— Señal de venta cuando el precio regresa a esa zona</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
        <OrderBlockDiagram locale="es" />
      </div>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">OB vs Order Block &quot;mitigado&quot;</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Un Order Block solo es válido una vez. Cuando el precio regresa y reacciona, se dice que el OB está <span className="text-white font-medium">&quot;mitigado&quot;</span>. Después de la mitigation, la zona pierde su potencia institucional — no debes seguir tratando un OB mitigado como una señal.
        </p>
        <div className="space-y-2">
          {[
            { step: "1", text: "OB formado (movimiento impulsivo crea la zona) → zona activa, no mitigada" },
            { step: "2", text: "El precio regresa al OB → reacción alcista o bajista → OB mitigado" },
            { step: "3", text: "Si el precio cruza el OB sin reacción → OB invalidado, quítalo de tu análisis" },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
              <span className="text-xs font-bold text-blue-400 shrink-0 mt-0.5 w-4">{item.step}</span>
              <p className="text-sm text-zinc-300 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Order Block + confluencias = setup institucional</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Un OB solo no es suficiente. Su potencia se multiplica cuando coincide con otros elementos institucionales.
        </p>
        <div className="space-y-2.5">
          {[
            { label: "OB + FVG en la misma zona", detail: "Si un Fair Value Gap se ubica dentro de la zona del Order Block, la confluencia es extremadamente potente." },
            { label: "OB + nivel de liquidity", detail: "Un OB situado justo debajo de un pool de liquidity BSL o SSL aumenta drásticamente la probabilidad de una reacción." },
            { label: "OB + sesgo de estructura", detail: "En tendencia alcista, solo tradea los Bullish OB. El OB debe ir en el sentido del mercado dominante." },
            { label: "Confirmación de vela", detail: "Espera un rechazo en el OB (pin bar, engulfing) antes de entrar. No entres ciegamente en la zona." },
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
        <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Revisión</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <LessonKeyPoints
        points={[
          "Un Order Block = última vela antes de un movimiento impulsivo institucional que crea un BOS.",
          "Bullish OB = última vela bajista antes de un alza impulsiva. Bearish OB = inverso.",
          "La zona del OB se define por el cuerpo (open → close) de la vela, no por las mechas.",
          "Un OB es válido una sola vez: tras la mitigation, pierde su potencia — no lo sigas tradeando.",
          "La confluencia OB + FVG es una de las combinaciones más potentes en Smart Money.",
        ]}
      />

      <LessonExercice
        description="En TradingView, identifica Order Blocks activos en EUR/USD en H1."
        steps={[
          "Busca un movimiento alcista impulsivo reciente (una serie de velas direccionales sin retroceso). Anota la vela que lo precede.",
          "Verifica: ¿esa vela es bajista? Si sí, es un potencial Bullish Order Block. Anota sus niveles de open y close.",
          "¿El precio ha regresado a la zona desde entonces? Si sí, ¿hubo una reacción (rebote)? ¿El OB está mitigado o sigue activo?",
          "Repite el ejercicio para un movimiento bajista — encuentra un Bearish Order Block.",
        ]}
      />

      <LessonQuiz
        question="Identificas un movimiento alcista impulsivo en el gráfico. La vela justo antes de ese movimiento es bajista. ¿Qué representa?"
        options={[
          "Una señal de venta — la vela bajista significa que el mercado va a bajar",
          "Un Bullish Order Block — es la zona donde las instituciones colocaron sus órdenes de compra",
          "Un Fair Value Gap — no hubo intercambios a ese nivel",
          "Un nivel de soporte/resistencia clásico sin significado institucional",
        ]}
        correctIndex={1}
        explanation="La última vela bajista antes de un movimiento alcista impulsivo es un Bullish Order Block. Paradójicamente, es una vela bajista la que marca una zona de compra institucional — las instituciones absorbieron la presión vendedora en esa vela antes de lanzar su movimiento alcista."
        answerExplanations={[
          "Falso. La dirección de la vela por sí misma no es la señal — es su contexto. Una vela bajista que precede a un movimiento alcista impulsivo es un Bullish OB, no una señal de venta.",
          "Correcto. Es precisamente la definición de un Bullish Order Block. La última vela direccionalmente opuesta antes de un movimiento impulsivo marca la zona donde las instituciones ejecutaron sus órdenes.",
          "Falso. Un FVG se define en 3 velas y concierne a una zona de precio no intercambiada. El Order Block es la vela en sí (su cuerpo), no un espacio entre velas.",
          "Falso. No es un simple S/R — es una zona institucional con órdenes en espera. La diferencia es fundamental: los OB tienen una lógica de activación que los S/R clásicos no tienen.",
        ]}
      />

    </LessonPage>
  );
}
