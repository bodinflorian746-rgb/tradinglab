import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LiquidityPoolsDiagram } from "@/app/components/charts/LiquidityPoolsDiagram";

export default function ContentEs() {
  return (
    <LessonPage
      formationId="avance"
      lessonId="lecon1"
      title="Liquidity"
      subtitle="Las instituciones necesitan liquidity para ejecutar sus órdenes. Entender dónde se encuentra es entender hacia dónde va realmente el mercado."
      duration="25 min"
      lessonNumber={1}
      prev={null}
      next={{ href: "/formations/avance/lecon2", label: "Lección 2 : Fair Value Gap" }}
    >

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">¿Qué es la liquidity?</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          La liquidity es la capacidad de ejecutar una orden sin mover el precio.
          Para una institución que coloca una orden de varios millones, necesita una
          contraparte, alguien que venda cuando ella compra, y viceversa.
        </p>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Esas contrapartes se encuentran donde los demás traders han colocado sus
          stops. Los stops son órdenes en espera, forman un pool de liquidity que
          las instituciones explotan.
        </p>
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
          <p className="text-sm text-zinc-400 leading-relaxed">
            <span className="text-white font-medium">Para recordar:</span> el mercado
            se mueve hacia la liquidity, no al revés. Antes de cualquier gran movimiento,
            el precio suele ir a buscar los stops para alimentar el siguiente movimiento.
          </p>
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Buy-side y Sell-side Liquidity</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Los pools de liquidity se forman alrededor de los niveles evidentes que todo
          el mundo vigila, es precisamente ahí donde se acumulan los stops.
        </p>
        <div className="space-y-3 mb-4">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
            <p className="font-semibold text-emerald-400 text-sm mb-2">Buy-side Liquidity (BSL)</p>
            <p className="text-xs text-zinc-400 leading-relaxed mb-2">
              Se encuentra <span className="text-white">por encima</span> de las resistencias
              y de los Equal Highs (EQH). Los traders en short han puesto ahí sus stops.
              Cuando el precio sube hasta ahí, dispara esos stops, órdenes de compra
              que alimentan una venta institucional.
            </p>
            <p className="text-xs text-zinc-500">
              EQH = Equal Highs: dos máximos al mismo nivel. Señal clásica de liquidity acumulada.
            </p>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
            <p className="font-semibold text-red-400 text-sm mb-2">Sell-side Liquidity (SSL)</p>
            <p className="text-xs text-zinc-400 leading-relaxed mb-2">
              Se encuentra <span className="text-white">debajo</span> de los soportes
              y de los Equal Lows (EQL). Los traders en long han puesto ahí sus stops.
              Cuando el precio baja hasta ahí, dispara esos stops, órdenes de venta
              que alimentan una compra institucional.
            </p>
            <p className="text-xs text-zinc-500">
              EQL = Equal Lows: dos mínimos al mismo nivel. Zona típica de liquidity vendedora.
            </p>
          </div>
        </div>
      </section>

      <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
        <LiquidityPoolsDiagram locale="es" />
      </div>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-sm text-zinc-300 leading-relaxed">
          Estas zonas de liquidez son precisamente lo que buscan los stop hunts:
          movimientos bruscos que activan los stops acumulados antes de girar en
          sentido contrario. Los estudiamos en detalle en la lección 6.
        </p>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Explotar la liquidity en tus setups</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Una vez que identificas los pools de liquidity, puedes anticipar a dónde
          va a ir el precio a buscar antes de invertirse, y posicionar tu entrada en consecuencia.
        </p>
        <div className="space-y-2.5">
          {[
            {
              label: "Identifica los EQH / EQL en el gráfico",
              detail: "Busca dos o tres máximos o mínimos al mismo nivel, ahí es donde se acumulan los stops.",
            },
            {
              label: "Espera a que el precio llegue",
              detail: "No sigas la mecha. Observa el comportamiento al llegar a la zona de liquidity.",
            },
            {
              label: "Confirma el rechazo antes de entrar",
              detail: "Una vela de rechazo (pin bar, engulfing) después del stop hunt es tu señal de entrada.",
            },
            {
              label: "Apunta a la liquidity opuesta como objetivo",
              detail: "Si entras tras una toma de SSL, apunta al BSL de arriba como take profit.",
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
        <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Revisión</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <LessonKeyPoints
        points={[
          "Las instituciones necesitan liquidity para ejecutar sus órdenes, van a buscarla donde están los stops.",
          "Buy-side Liquidity = por encima de los Equal Highs. Sell-side Liquidity = debajo de los Equal Lows.",
          "El precio se mueve hacia la liquidity antes de irse en su verdadera dirección, anticipa ese movimiento.",
        ]}
      />

      <LessonExercice
        description="En cualquier gráfico en H1, sal a cazar los pools de liquidity. Es el análisis más importante antes de cualquier trade."
        steps={[
          "Identifica al menos un conjunto de Equal Highs (EQH), dos o más máximos alineados al mismo nivel.",
          "Identifica al menos un conjunto de Equal Lows (EQL), dos o más mínimos alineados al mismo nivel.",
          "¿El precio fue recientemente a tomar uno de esos niveles antes de irse en el otro sentido? Acabas de identificar un stop hunt.",
        ]}
      />

      <LessonQuiz
        question="¿Por qué las instituciones cazan los stops de los traders retail?"
        options={[
          "Para manipular el mercado de forma ilegal y aprovechar solas",
          "Para generar la liquidity necesaria para la ejecución de sus propias órdenes",
          "Para disparar señales técnicas y atraer nuevos compradores",
        ]}
        correctIndex={1}
        explanation="Las instituciones colocan órdenes masivas que requieren una contraparte equivalente. Los stop loss de los traders retail son órdenes en espera, al empujar el precio hacia esos niveles, las instituciones disparan esos stops y obtienen la liquidity que necesitan para entrar o salir del mercado a gran escala."
      />

    </LessonPage>
  );
}
