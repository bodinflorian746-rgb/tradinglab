import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { Candle } from "@/app/components/charts/Candle";
import { SupplyDemandDiagram } from "@/app/components/charts/SupplyDemandDiagram";

export default function ContentEs() {
  return (
    <LessonPage
      formationId="intermediaire"
      lessonId="lecon3"
      title="Supply & Demand"
      subtitle="Las zonas SD no son líneas mágicas — son las cicatrices que dejan las instituciones cuando pasaron órdenes grandes. El precio vuelve ahí a ejecutar el resto."
      duration="20 min"
      lessonNumber={3}
      prev={{ href: "/formations/intermediaire/lecon2", label: "Lección 2 — Zonas clave" }}
      next={{ href: "/formations/intermediaire/lecon4", label: "Lección 4 — Tendencias" }}
    >

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Lo que debes ver en el gráfico</p>
        <h2 className="text-lg font-semibold text-white mb-4">Reconocer una zona SD sin dudar</h2>
        <div className="space-y-3">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-emerald-400 mb-2">Zona de Demand (compra)</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              El precio baja lento → entra a una zona → BOOM, una o dos grandes velas alcistas explotan hacia arriba. <strong className="text-white">Esa zona = Demand.</strong> Las instituciones compraron masivamente ahí. Cuando el precio vuelve, sus órdenes restantes se activan.
            </p>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-red-400 mb-2">Zona de Supply (venta)</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              El precio sube lento → entra a una zona → BOOM, gran vela bajista explota hacia abajo. <strong className="text-white">Esa zona = Supply.</strong> Las instituciones vendieron masivamente ahí. En el retorno del precio, sus órdenes residuales se ejecutan.
            </p>
          </div>
        </div>
        <div className="mt-3 bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-3 py-2">
          <p className="text-xs text-zinc-400"><span className="text-white font-medium">Señal clave:</span> la salida de la zona siempre es IMPULSIVA — fuerte, rápida, pocas mechas. Si la salida es lenta, no es una zona SD válida.</p>
        </div>
      </section>

      <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
        <SupplyDemandDiagram />
      </div>

      <div className="border border-zinc-800 rounded-2xl p-5">
        <div className="flex justify-around items-start pt-4 mt-2 border-t border-zinc-800/50">
          <Candle type="bullish" label="Señal Demand" caption="Rechazo alcista en la zona" />
          <Candle type="bearish" label="Señal Supply" caption="Rechazo bajista en la zona" />
        </div>
      </div>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Cómo trazar una zona SD válida</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Una zona SD se traza en las velas de consolidación justo antes de la salida impulsiva — no en la salida misma. La zona = el lugar donde se pasaron las órdenes. La salida = la prueba de que se ejecutaron.
        </p>
        <div className="space-y-2">
          {[
            { n: "1", t: "Identifica la salida impulsiva", d: "Una o varias grandes velas en la misma dirección, pocas mechas. Es la señal de que una institución actuó." },
            { n: "2", t: "Sube justo antes de esa salida", d: "Sueles encontrar 1 a 3 velas de consolidación (velas chicas). Ahí empieza la zona." },
            { n: "3", t: "Marca tu rectángulo en esa consolidación", d: "Desde el bottom hasta el top de la última vela antes de la salida. Es tu zona SD." },
            { n: "4", t: "Verifica que la zona siga fresca", d: "Si el precio ya volvió varias veces a la zona, es menos potente. Una zona no-retesteada = zona fuerte." },
          ].map((item) => (
            <div key={item.n} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
              <span className="text-xs font-bold text-emerald-400 shrink-0 mt-0.5 w-4">{item.n}</span>
              <div>
                <p className="text-sm font-medium text-white">{item.t}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{item.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">SD vs S/R — la diferencia en la práctica</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Los dos parecen similares pero su lógica es diferente. En la práctica, se complementan — una zona SD que coincide con un S/R es una confluencia potente.
        </p>
        <div className="space-y-2.5">
          <div className="bg-zinc-800/50 rounded-xl px-4 py-3">
            <p className="text-sm font-medium text-white mb-1">Soporte y Resistencia</p>
            <p className="text-xs text-zinc-500 leading-relaxed">Basado en las reacciones repetidas. El precio rebotó varias veces → zona importante. Mientras más se toca, más puede ceder.</p>
          </div>
          <div className="bg-zinc-800/50 rounded-xl px-4 py-3">
            <p className="text-sm font-medium text-white mb-1">Supply & Demand</p>
            <p className="text-xs text-zinc-500 leading-relaxed">Basado en el origen del movimiento. Una sola reacción impulsiva basta. Mientras más fresca la zona (no-retesteada), más potente.</p>
          </div>
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3">Cómo analizar en 5 segundos</p>
        <h2 className="text-lg font-semibold text-white mb-4">Identificar una zona SD rápido</h2>
        <div className="space-y-2">
          {[
            { n: "1", t: "Busca los grandes movimientos impulsivos en el gráfico", d: "Las velas grandes sin dudar. Son los rastros que dejan las instituciones." },
            { n: "2", t: "Sube justo antes de cada salida", d: "Unas pocas velas chicas de consolidación = tu zona SD. Marca el rectángulo." },
            { n: "3", t: "¿El precio ya volvió a esa zona?", d: "Si no → zona fresca, fuerte. Si sí varias veces → zona debilitada, menos fiable." },
          ].map((item) => (
            <div key={item.n} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
              <span className="text-xs font-bold text-blue-400 shrink-0 mt-0.5 w-4">{item.n}</span>
              <div>
                <p className="text-sm font-medium text-white">{item.t}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{item.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-3">Lo que debes hacer</p>
        <h2 className="text-lg font-semibold text-white mb-4">La lógica del trader en las zonas SD</h2>
        <div className="space-y-2.5">
          <div className="flex items-start gap-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <span className="text-lg">↑</span>
            <div>
              <p className="text-sm font-semibold text-emerald-400">El precio vuelve a una zona de Demand</p>
              <p className="text-xs text-zinc-400 mt-0.5">Esperas una señal de rechazo en la zona (pin bar, engulfing alcista). Si la tendencia Daily es alcista → compra. SL bajo la zona entera.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
            <span className="text-lg">↓</span>
            <div>
              <p className="text-sm font-semibold text-red-400">El precio sube a una zona de Supply</p>
              <p className="text-xs text-zinc-400 mt-0.5">Esperas un rechazo en la zona (mecha alta, engulfing bajista). Si la tendencia Daily es bajista → venta. SL encima de la zona.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-zinc-800/40 border border-zinc-700/40 rounded-xl px-4 py-3">
            <span className="text-lg">—</span>
            <div>
              <p className="text-sm font-semibold text-zinc-300">Zona ya testeada varias veces</p>
              <p className="text-xs text-zinc-400 mt-0.5">La ignoras o reduces tu confianza. Una zona tocada 3+ veces pierde su fuerza — las órdenes institucionales se agotaron.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border border-red-500/20 bg-red-500/5 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">Error clásico</p>
        <p className="text-sm font-semibold text-white mb-2">Entrar en la zona antes de la señal de confirmación</p>
        <p className="text-sm text-zinc-300 leading-relaxed">
          Ves al precio bajar hacia tu zona de Demand. Te apuras a comprar &quot;porque la zona está ahí&quot;. Pero el precio sigue bajando y atraviesa tu zona. El problema: una zona SD indica dónde MIRAR, no dónde entrar sin señal. Espera siempre una vela de rechazo en la zona antes de entrar.
        </p>
      </section>

      <div className="border border-zinc-700/40 rounded-2xl p-5 bg-zinc-900/30">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Resumen en 3 segundos</p>
        <div className="space-y-2 text-sm">
          <p className="text-zinc-200"><span className="text-emerald-400 font-bold mr-2">✔</span>Zona Demand + señal alcista → compras (SL bajo la zona)</p>
          <p className="text-zinc-200"><span className="text-emerald-400 font-bold mr-2">✔</span>Zona Supply + señal bajista → vendes (SL encima de la zona)</p>
          <p className="text-zinc-500"><span className="text-red-400 font-bold mr-2">✖</span>Zona tocada 3× o sin señal → la ignoras</p>
        </div>
      </div>

      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Repaso</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <LessonKeyPoints
        points={[
          "Demand = el precio sale de una zona con una salida alcista impulsiva → las instituciones compraron.",
          "Supply = el precio sale de una zona con una salida bajista impulsiva → las instituciones vendieron.",
          "Zona fresca (no-retesteada) = zona fuerte. Zona testeada 3× = zona debilitada.",
          "La zona se traza en la consolidación antes de la salida — no en la salida misma.",
          "La zona SD indica dónde mirar — la señal de vela indica cuándo entrar.",
        ]}
      />

      <LessonExercice
        description="En TradingView, abre EUR/USD en H4 e identifica zonas SD válidas."
        steps={[
          "Detecta el último gran movimiento alcista (varias velas verdes consecutivas). Sube justo antes — ahí está tu zona de Demand. Marca un rectángulo.",
          "Haz lo mismo para el último gran movimiento bajista. Marca tu zona de Supply.",
          "Verifica si el precio volvió a testear alguna de estas zonas desde entonces. ¿Cómo reaccionó?",
          "Busca una zona SD que coincida con un nivel de S/R histórico — es una confluencia fuerte. Anota el precio exacto.",
        ]}
      />

      <LessonQuiz
        question="Marcas una zona de Demand en EUR/USD H4. El precio baja hacia ella. ¿Qué haces?"
        options={[
          "Compras inmediatamente apenas el precio entra a la zona",
          "Esperas una señal de rechazo en la zona (pin bar o engulfing alcista), luego entras",
          "Ignoras la zona — el precio baja, es señal de debilidad",
          "Colocas una orden limit en el bottom de la zona sin esperar señal",
        ]}
        correctIndex={1}
        explanation="La zona te dice dónde mirar — la señal de vela te dice cuándo entrar. Esperar un rechazo (pin bar, engulfing alcista) en la zona de Demand confirma que los compradores institucionales están activos. Sin señal, anticipas sin prueba."
        answerExplanations={[
          "Demasiado apurado. El precio puede atravesar la zona y seguir bajando. Entrar sin señal de confirmación es tomar el riesgo de entrar en una zona que no aguanta. La zona es de atención, no un disparador de compra automático.",
          "Correcto. Es el método en dos tiempos: la zona define el nivel de interés, la señal de vela confirma que los compradores reaccionan. Pin bar = rechazo de precios bajos. Engulfing alcista = los compradores toman el control. Entras con SL bajo la zona.",
          "Falso. El precio que baja hacia una zona de Demand es exactamente el escenario esperado. Es el retroceso que crea la oportunidad de compra. El precio debe bajar a la zona para que el setup sea válido.",
          "Riesgoso. Una orden limit en el bottom de la zona puede funcionar, pero entras sin confirmación. El precio puede atravesar el bottom de la zona y seguir. Esperar la señal de vela te da una ventaja adicional.",
        ]}
      />

    </LessonPage>
  );
}
