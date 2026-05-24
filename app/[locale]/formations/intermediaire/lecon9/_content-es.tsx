import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { FibonacciDiagram } from "@/app/components/charts/FibonacciDiagram";

export default function ContentEs() {
  return (
    <LessonPage
      formationId="intermediaire"
      lessonId="lecon9"
      title="Fibonacci, retrocesos y confluencias"
      subtitle="La herramienta Fibonacci identifica las zonas de retroceso probabilísticas en un movimiento. Combinada con otras confluencias, mejora considerablemente la precisión de entrada."
      duration="20 min"
      lessonNumber={9}
      prev={{ href: "/formations/intermediaire/lecon8", label: "Lección 8 : Plan de trading" }}
      next={null}
    >

      {/* ── Lo que debes VER ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Lo que debes ver en el gráfico</p>
        <h2 className="text-lg font-semibold text-white mb-4">Fibonacci en acción en EUR/USD</h2>
        <div className="space-y-3">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-emerald-400 mb-2">El movimiento impulsivo (punto de partida)</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              EUR/USD sube de 1.0800 (swing low) a 1.0980 (swing high) en tendencia alcista. Trazas Fibonacci de 1.0800 a 1.0980. Los niveles aparecen en el gráfico: 23.6% = 1.0937, 38.2% = 1.0911, 50% = 1.0890, <strong className="text-white">61.8% = 1.0869.</strong>
            </p>
          </div>
          <div className="bg-blue-500/5 border border-blue-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-blue-400 mb-2">El retroceso (zona de entrada)</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              El precio retrocede desde 1.0980. Baja, baja... y se detiene en 1.0870. Es el 61.8% de Fibonacci. Miras, también hay un soporte histórico en ese nivel. <strong className="text-white">Confluencia.</strong> Esperas una señal de vela antes de entrar en compra.
            </p>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-red-400 mb-2">Lo que NO debes hacer</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Entrar apenas el precio toque el 61.8%, sin señal. El precio puede atravesar hacia el 78.6% o más abajo. Fibonacci identifica la <strong className="text-white">zona de atención</strong>, no la entrada automática.
            </p>
          </div>
        </div>
      </section>

      {/* ── Los niveles ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Los niveles de Fibonacci que debes conocer</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Los niveles son ratios matemáticos aplicados a un movimiento de precio. Identifican las zonas de rebote probabilístico durante un retroceso.
        </p>
        <div className="space-y-2.5">
          {[
            { level: "23.6%", desc: "Retroceso superficial, tendencia muy fuerte, poca corrección. Raro.", color: "text-zinc-400" },
            { level: "38.2%", desc: "Retroceso moderado, común en tendencia sólida. Buena relación riesgo/recompensa.", color: "text-blue-400" },
            { level: "50%", desc: "Nivel psicológico fuerte, no es un Fibonacci puro, pero muy respetado por los traders.", color: "text-blue-400" },
            { level: "61.8%", desc: "El 'golden ratio', la zona de retroceso más usada y más poderosa. A vigilar prioritariamente.", color: "text-emerald-400" },
            { level: "78.6%", desc: "Retroceso profundo, útil para entradas agresivas cerca del swing low. Riesgoso sin confluencia.", color: "text-red-400" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 bg-zinc-800/40 rounded-xl px-4 py-3">
              <span className={`text-sm font-bold shrink-0 w-12 ${item.color}`}>{item.level}</span>
              <p className="text-sm text-zinc-300 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
        <FibonacciDiagram locale="es" />
      </div>

      {/* ── Trazar correctamente ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Cómo trazar Fibonacci correctamente</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Los niveles de Fibonacci se trazan sobre un movimiento impulsivo completo, del swing low al swing high (tendencia alcista), o del swing high al swing low (tendencia bajista).
        </p>
        <div className="space-y-2">
          {[
            { step: "1", text: "Identifica un movimiento impulsivo claro: un swing low y un swing high nítidos en el gráfico." },
            { step: "2", text: "En tendencia alcista: haz clic primero en el swing low, luego en el swing high. Los niveles aparecen entre ambos." },
            { step: "3", text: "El precio retrocede desde el swing high → vigila las zonas 38.2%, 50% y 61.8% en prioridad." },
            { step: "4", text: "Busca una confluencia en esas zonas: S/R histórico, zona SD, nivel psicológico (1.0850, 1.0900…). Ahí es donde preparas tu entrada." },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
              <span className="text-xs font-bold text-blue-400 shrink-0 mt-0.5 w-4">{item.step}</span>
              <p className="text-sm text-zinc-300 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Fibonacci + confluencias ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Fibonacci + confluencias = zonas de oro</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Fibonacci solo no es suficiente. Un nivel Fib que coincide con otras confluencias se convierte en una zona de interés mayor.
        </p>
        <div className="space-y-2.5">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-medium text-emerald-400 mb-1">Setup ideal, 3 confluencias + señal</p>
            <p className="text-xs text-zinc-400 leading-relaxed">
              EUR/USD Daily alcista → 61.8% Fib en 1.0869 → antiguo soporte histórico en 1.0870 → zona de Demand sin retest en la misma zona. El precio llega. Pin bar alcista. Entras en compra. SL debajo de la zona (1.0848), TP hacia 1.0980.
            </p>
          </div>
          <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
            <p className="text-sm text-zinc-400 leading-relaxed">
              <span className="text-white font-medium">Límite de Fibonacci:</span> los niveles no son imanes mágicos. El precio puede atravesar el 61.8% y continuar hasta el 78.6%. Usa Fibonacci para identificar zonas de atención, no para colocar órdenes sin señal.
            </p>
          </div>
        </div>
      </section>

      {/* ── 5 segundos ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3">Cómo analizar en 5 segundos</p>
        <h2 className="text-lg font-semibold text-white mb-4">Usar Fibonacci rápidamente</h2>
        <div className="space-y-2">
          {[
            { n: "1", t: "¿Hay un movimiento impulsivo claro y reciente?", d: "Si sí, traza Fibonacci sobre él (swing low → swing high en alcista). Si no → no hay Fibonacci utilizable." },
            { n: "2", t: "¿Hay una confluencia en el 61.8% o el 50%?", d: "¿S/R histórico, zona SD, nivel psicológico en el mismo nivel? Si sí → zona de oro a vigilar." },
            { n: "3", t: "Espera la señal de vela en la zona", d: "Pin bar o engulfing en el sentido de la tendencia Daily sobre la zona Fib = entrada. Sin señal = nada que hacer." },
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

      {/* ── Lo que debes hacer ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-3">Lo que debes hacer</p>
        <h2 className="text-lg font-semibold text-white mb-4">Frente a un nivel Fibonacci</h2>
        <div className="space-y-2.5">
          <div className="flex items-start gap-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <span className="text-lg">✓</span>
            <div>
              <p className="text-sm font-semibold text-emerald-400">Nivel Fib + confluencia + señal de vela</p>
              <p className="text-xs text-zinc-400 mt-0.5">Entras. Es el setup completo. SL debajo de la zona Fib entera, TP hacia el swing high anterior (o la próxima resistencia).</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-amber-400/5 border border-amber-400/15 rounded-xl px-4 py-3">
            <span className="text-lg">~</span>
            <div>
              <p className="text-sm font-semibold text-amber-400">Nivel Fib solo (sin confluencia)</p>
              <p className="text-xs text-zinc-400 mt-0.5">Vigilas pero todavía no entras. Fibonacci solo, sin otra razón = probabilidad insuficiente. Busca una confluencia antes de decidir.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
            <span className="text-lg">✗</span>
            <div>
              <p className="text-sm font-semibold text-red-400">Entrada al toque del nivel, sin señal</p>
              <p className="text-xs text-zinc-400 mt-0.5">No entras. El precio puede atravesar el 61.8% y continuar. Espera siempre una señal de vela que confirme que el precio reacciona a la zona.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Error clásico ── */}
      <section className="border border-red-500/20 bg-red-500/5 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">Error clásico</p>
        <p className="text-sm font-semibold text-white mb-2">Entrar en cada nivel Fibonacci automáticamente</p>
        <p className="text-sm text-zinc-300 leading-relaxed">
          El precio retrocede. Toca el 38.2% → compras. Sigue bajando. Compras en el 50%. Sigue. Compras en el 61.8%. Ahora tienes 3 posiciones perdedoras. El problema: Fibonacci no es una grilla de compras automáticas. Es una herramienta para identificar zonas. Si el 38.2% no tiene confluencia ni señal → no se toca. Esperas el nivel más fuerte, con confluencia, con señal.
        </p>
      </section>

      {/* ── Resumen ultrarrápido ── */}
      <div className="border border-zinc-700/40 rounded-2xl p-5 bg-zinc-900/30">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Resumen en 3 segundos</p>
        <div className="space-y-2 text-sm">
          <p className="text-zinc-200"><span className="text-emerald-400 font-bold mr-2">✔</span>61.8% + confluencia (S/R, SD) + señal de vela → entras</p>
          <p className="text-zinc-200"><span className="text-amber-400 font-bold mr-2">~</span>Nivel Fib sin confluencia → solo vigilas</p>
          <p className="text-zinc-500"><span className="text-red-400 font-bold mr-2">✖</span>Precio toca el Fib sin señal → no entras</p>
        </div>
      </div>

      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Revisión</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <LessonKeyPoints
        points={[
          "Fibonacci identifica zonas de retroceso probabilísticas: 38.2%, 50%, 61.8% son las más usadas.",
          "Traza Fibonacci sobre un movimiento impulsivo completo: swing low → swing high (tendencia alcista).",
          "El 61.8% (golden ratio) es el nivel más respetado, pero jamás infalible.",
          "Fibonacci solo no es una señal, espera una confluencia (S/R, zona SD) Y una señal de vela.",
          "Las 'zonas de oro' = intersección de varias confluencias incluyendo un nivel Fib clave.",
        ]}
      />

      <LessonExercice
        description="En TradingView, traza y analiza retrocesos de Fibonacci en EUR/USD."
        steps={[
          "Abre EUR/USD en H4. Usa la herramienta Fibonacci Retracement en las herramientas de dibujo de TradingView.",
          "Identifica el último gran movimiento alcista. Traza tu Fib del swing low al swing high.",
          "¿El precio retrocedió? ¿En qué nivel Fib se detuvo (38.2%, 50%, 61.8%)? ¿Hubo una señal de vela en ese nivel?",
          "¿Hay otras confluencias en ese nivel (S/R histórico, zona SD, nivel psicológico)? Si sí, anota por qué era una zona de oro.",
        ]}
      />

      <LessonQuiz
        question="Trazas Fibonacci sobre un movimiento alcista EUR/USD (1.0800 → 1.0980). El precio retrocede hasta el 61.8% en 1.0869. Este nivel coincide con un soporte histórico respetado 2 veces. ¿Qué haces?"
        options={[
          "Entras de inmediato en compra, el golden ratio + soporte es suficiente",
          "Esperas una señal de vela (pin bar o engulfing alcista) en la zona antes de entrar",
          "Lanzas una orden de venta, el retroceso probablemente continuará hasta el 78.6%",
          "Ignoras el 61.8%, el soporte ya fue tocado 2 veces, está debilitado",
        ]}
        correctIndex={1}
        explanation="Tienes 2 confluencias sólidas: 61.8% Fib + soporte histórico. Es una zona de oro a vigilar. Pero la señal de vela aún falta. Espera que una pin bar o un engulfing alcista confirme que el precio reacciona a la zona, luego entras con SL debajo de 1.0848 y TP hacia 1.0980."
        answerExplanations={[
          "Demasiado apresurado. Tienes 2 confluencias sólidas, pero sin señal de vela, entras en un precio que puede seguir bajando hacia 1.0840 o menos. La confluencia te dice 'mira aquí', no 'entra ahora'.",
          "Correcto. El 61.8% + soporte es una zona de oro. Pero la confirmación sigue siendo necesaria. Una pin bar alcista o un engulfing en esta zona te dice que los compradores reaccionan. Entonces entras con SL debajo de la zona (1.0848) y TP hacia el swing high (1.0980).",
          "Falso. En tendencia alcista Daily, el retroceso hacia el 61.8% es una oportunidad de compra, no de venta. Hacer short aquí es tradear contra la tendencia de fondo y contra 2 confluencias alcistas.",
          "Parcialmente. Un soporte tocado 2 veces es menos fuerte que un soporte virgen, pero sigue siendo válido, sobre todo combinado con el 61.8% Fib. La coincidencia de los dos niveles refuerza la zona, no la anula.",
        ]}
      />

    </LessonPage>
  );
}
