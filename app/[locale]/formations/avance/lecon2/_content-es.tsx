import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { FVGDiagram } from "@/app/components/charts/FVGDiagram";

export default function ContentEs() {
  return (
    <LessonPage
      formationId="avance"
      lessonId="lecon2"
      title="Fair Value Gap"
      subtitle="Los Fair Value Gaps son desequilibrios dejados por movimientos institucionales rápidos. El mercado busca cerrarlos, y ahí se esconden algunas de las mejores entradas."
      duration="20 min"
      lessonNumber={2}
      prev={{ href: "/formations/avance/lecon1", label: "Lección 1 : Liquidity" }}
      next={{ href: "/formations/avance/lecon3", label: "Lección 3 : Order Blocks" }}
    >

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">¿Qué es un Fair Value Gap?</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Un Fair Value Gap (FVG) es un desequilibrio de precio creado cuando un movimiento
          es tan rápido que las velas adyacentes no se superponen.
          Queda una zona de precio donde no se realizaron intercambios, el mercado
          tiende a regresar para &quot;cerrar&quot; ese desequilibrio.
        </p>
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3 mb-4">
          <p className="text-sm text-zinc-400 leading-relaxed">
            <span className="text-white font-medium">Principio:</span> un FVG se
            forma con 3 velas consecutivas. La zona entre la mecha superior de la
            vela 1 y la mecha inferior de la vela 3 no fue intercambiada, ese es
            el gap.
          </p>
        </div>
        <p className="text-zinc-300 text-sm leading-relaxed">
          En la práctica, los FVG aparecen después de news económicas importantes,
          aperturas de sesión con gap, o movimientos impulsivos institucionales.
          Representan zonas de desequilibrio que el mercado busca reintegrar
          naturalmente.
        </p>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Identificar un FVG en el gráfico</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          La lectura de un FVG siempre se hace en 3 velas. El análisis es simple
          una vez que sabes qué mirar.
        </p>
        <div className="space-y-3">
          <div className="bg-zinc-800/50 rounded-xl p-4">
            <p className="text-sm font-semibold text-white mb-2">Las 3 velas</p>
            <div className="space-y-2">
              {[
                { label: "Vela 1", desc: "La vela que precede al movimiento. Retén su mecha superior (para un FVG bullish) o inferior (para un bearish)." },
                { label: "Vela 2", desc: "La vela impulsiva : grande, direccional, a menudo sin mecha. Crea el desequilibrio." },
                { label: "Vela 3", desc: "La vela que sigue. Retén su mecha inferior (bullish) o superior (bearish). Si no se solapa con la mecha de la vela 1, el FVG existe." },
              ].map((b) => (
                <div key={b.label} className="flex items-start gap-3">
                  <span className="text-xs font-bold text-zinc-500 shrink-0 w-16 mt-0.5">{b.label}</span>
                  <p className="text-xs text-zinc-400 leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
            <p className="text-sm text-zinc-400 leading-relaxed">
              <span className="text-white font-medium">Test rápido:</span> un FVG
              existe si la mecha superior de la vela 1 es inferior a la mecha
              inferior de la vela 3 (bullish), o si la mecha inferior de la vela 1
              es superior a la mecha superior de la vela 3 (bearish).
            </p>
          </div>
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Bullish vs Bearish FVG</h2>
        <div className="space-y-3">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
            <p className="font-semibold text-emerald-400 text-sm mb-2">Bullish FVG</p>
            <ul className="space-y-1.5">
              <li className="text-xs text-zinc-400 leading-relaxed">
               . Formado tras un movimiento alcista impulsivo (vela 2 bullish)
              </li>
              <li className="text-xs text-zinc-400 leading-relaxed">
               . La zona está entre: mecha superior de V1 (parte baja del gap) y mecha inferior de V3 (parte alta del gap)
              </li>
              <li className="text-xs text-zinc-400 leading-relaxed">
               . Cuando el precio regresa a esa zona, es un potencial punto de compra
              </li>
              <li className="text-xs text-zinc-400 leading-relaxed">
               . Stop: debajo de la zona. Target: próximo nivel de resistencia o liquidity
              </li>
            </ul>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
            <p className="font-semibold text-red-400 text-sm mb-2">Bearish FVG</p>
            <ul className="space-y-1.5">
              <li className="text-xs text-zinc-400 leading-relaxed">
               . Formado tras un movimiento bajista impulsivo (vela 2 bearish)
              </li>
              <li className="text-xs text-zinc-400 leading-relaxed">
               . La zona está entre: mecha inferior de V1 (parte alta del gap) y mecha superior de V3 (parte baja del gap)
              </li>
              <li className="text-xs text-zinc-400 leading-relaxed">
               . Cuando el precio sube a esa zona, es un potencial punto de venta
              </li>
              <li className="text-xs text-zinc-400 leading-relaxed">
               . Stop: por encima de la zona. Target: próximo soporte o pool de liquidity
              </li>
            </ul>
          </div>
        </div>
      </section>

      <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
        <FVGDiagram locale="es" />
      </div>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Uso práctico</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Un FVG solo no es suficiente. Debe inscribirse en un contexto favorable
          para convertirse en una señal de entrada válida.
        </p>
        <div className="space-y-2.5">
          {[
            {
              label: "FVG en el sentido de la tendencia",
              detail: "En tendencia alcista, solo trabaja los bullish FVG. Ir contra la tendencia con un FVG multiplica el riesgo.",
            },
            {
              label: "FVG + confluencia de zona",
              detail: "Un FVG que coincide con un Order Block o un antiguo soporte histórico es mucho más confiable.",
            },
            {
              label: "FVG no cerrado = zona activa",
              detail: "Mientras un FVG no haya sido retesteado, sigue activo en el gráfico. Márcalos y vigílalos.",
            },
            {
              label: "FVG cerrado = invalidado",
              detail: "Si el precio cruza el gap por completo sin reaccionar, el FVG queda invalidado. Quítalo de tu análisis.",
            },
          ].map((r, i) => (
            <div key={i} className="flex items-start gap-3 bg-zinc-800/40 rounded-xl px-4 py-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
              <div>
                <p className="text-sm font-medium text-white">{r.label}</p>
                <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{r.detail}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
          <p className="text-sm text-zinc-400 leading-relaxed">
            <span className="text-white font-medium">Workflow completo:</span> estructura
            → liquidity → FVG + confluencia → entrada en rechazo dentro de la zona. Esos
            4 pasos combinados definen un setup institucional completo.
          </p>
        </div>
      </section>

      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Revisión</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <LessonKeyPoints
        points={[
          "Un FVG es un desequilibrio en 3 velas: no hubo intercambios en la zona entre la mecha superior de V1 y la mecha inferior de V3 (bullish).",
          "El mercado busca cerrar sus FVG, son zonas de retorno potencial a vigilar.",
          "Un FVG solo es válido en el sentido de la tendencia y con al menos una confluencia adicional.",
          "Un FVG cruzado sin reacción queda invalidado, quítalo de tu análisis de inmediato.",
        ]}
      />

      <LessonExercice
        description="En TradingView, abre BTC/USD o EUR/USD en M15 o H1. Tu misión: identificar 3 Fair Value Gaps activos en el gráfico."
        steps={[
          "Busca una secuencia de 3 velas con una V2 impulsiva. Verifica que la mecha superior de V1 no toque la mecha inferior de V3.",
          "Para cada FVG encontrado, determina si es bullish o bearish, y si el precio ya regresó o no.",
          "Si un FVG sigue intacto (no cerrado), márcalo y anota el sentido de entrada que sugiere en el contexto de tendencia.",
        ]}
      />

      <LessonQuiz
        question="Un Bullish Fair Value Gap se identifica cuando…"
        options={[
          "La vela 2 es más grande que las velas 1 y 3 combinadas",
          "La mecha superior de la vela 1 es inferior a la mecha inferior de la vela 3",
          "El precio cierra por encima del máximo de la vela anterior",
        ]}
        correctIndex={1}
        explanation="Un Bullish FVG existe cuando la mecha superior de la vela 1 es inferior a la mecha inferior de la vela 3, hay un espacio entre esas dos mechas que nunca fue intercambiado. Ese desequilibrio es el que el mercado busca cerrar al regresar, creando una oportunidad de entrada en compra dentro de un contexto alcista."
      />

    </LessonPage>
  );
}
