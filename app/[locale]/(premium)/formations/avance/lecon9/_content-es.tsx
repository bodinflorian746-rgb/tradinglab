import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { BacktestMetricsDiagram } from "@/app/components/charts/BacktestMetricsDiagram";

export default function ContentEs() {
  return (
    <LessonPage
      formationId="avance"
      lessonId="lecon9"
      title="Backtesting, validar tu estrategia"
      subtitle="Antes de arriesgar dinero real, debes tener la prueba de que tu estrategia funciona. El backtesting es esa prueba, construida sobre datos históricos, no sobre la esperanza."
      duration="22 min"
      lessonNumber={9}
      prev={{ href: "/formations/avance/lecon8", label: "Lección 8 : Journaling" }}
      next={null}
    >

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">¿Qué es el backtesting?</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          El backtesting consiste en aplicar tu estrategia sobre datos de mercado pasados para evaluar su performance. Reproduces situaciones históricas como si estuvieras tradeando en tiempo real, y registras cada decisión en un journal.
        </p>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          No es lo mismo que mirar un gráfico pasado y decir &quot;habría vendido aquí&quot;. El backtesting riguroso oculta las velas futuras (replay mode) y obliga a tomar decisiones en tiempo real simulado.
        </p>
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
          <p className="text-sm text-zinc-400 leading-relaxed">
            <span className="text-white font-medium">Objetivo:</span> obtener una muestra de 50 a 100 trades para validar el edge de tu estrategia con datos estadísticos confiables.
          </p>
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Cómo hacer un backtest riguroso</h2>
        <div className="space-y-2">
          {[
            { step: "1", text: "Define tu estrategia con precisión: ¿qué confluencias se requieren? ¿En qué timeframe? ¿En qué Killzones? Sé específico, una estrategia vaga produce un backtest vago." },
            { step: "2", text: "Usa TradingView en modo Replay (flecha 'play' arriba) o Forex Tester. Retrocede 6 a 12 meses y avanza vela por vela." },
            { step: "3", text: "Aplica tu estrategia exactamente como lo harías en live: identifica los setups, marca la entrada, el SL y el TP antes de que se forme la siguiente vela." },
            { step: "4", text: "Registra cada trade en tu journal: confluencias presentes, resultado en R, screenshot." },
            { step: "5", text: "Después de 50 a 100 trades, analiza las estadísticas: win rate, R promedio, drawdown máximo, meses rentables vs deficitarios." },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
              <span className="text-xs font-bold text-blue-400 shrink-0 mt-0.5 w-4">{item.step}</span>
              <p className="text-sm text-zinc-300 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-zinc-800/50 border-l-4 border-amber-400 px-5 py-4 rounded">
        <div className="flex items-center gap-2 mb-2">
          <span>💰</span>
          <span className="text-sm font-bold text-amber-400 tracking-wide">Realidad del retail</span>
        </div>
        <p className="text-base text-zinc-300 leading-relaxed">
          Si haces backtest con un capital de 200 a 1 000 €, usa los % reales de tu grilla de risk management (cf. Debutante lección 8), no la regla teórica del 1%. Backtestear con 1% en una cuenta de 300 € equivale a arriesgar 3 € por trade, inaplicable con los lotes disponibles. Un backtest calibrado a tu capital real te dará resultados explotables en live, no cifras desconectadas de tu realidad.
        </p>
      </div>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Las métricas clave de un backtest</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Estas métricas te dan una imagen completa de tu estrategia. Deciden si puedes confiar en ella en live.
        </p>
        <div className="space-y-2.5">
          {[
            { metric: "Win Rate", good: "> 40%", desc: "Porcentaje de trades ganados. Con un buen R/R, incluso 40% de win rate puede ser rentable." },
            { metric: "R promedio", good: "> +0.5R", desc: "Ganancia promedio por trade en R. Un win rate del 50% con R promedio de +1R = muy rentable." },
            { metric: "Profit Factor", good: "> 1.5", desc: "Total de ganancias ÷ total de pérdidas. Debe ser superior a 1.0 para ser rentable." },
            { metric: "Drawdown máximo", good: "< 15%", desc: "Pérdida máxima desde un pico. Un drawdown elevado pone a prueba tu psicología en live, conócelo de antemano." },
            { metric: "Número de trades", good: "> 50", desc: "Por debajo de 50 trades, los resultados no son estadísticamente confiables. Apunta a 100 mínimo." },
          ].map((r, i) => (
            <div key={i} className="flex items-start gap-4 bg-zinc-800/40 rounded-xl px-4 py-3">
              <div className="shrink-0">
                <p className="text-sm font-semibold text-white">{r.metric}</p>
                <p className="text-xs font-mono text-emerald-400">{r.good}</p>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
        <BacktestMetricsDiagram />
      </div>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Los errores de backtesting a evitar</h2>
        <div className="space-y-2.5">
          {[
            { label: "Hindsight bias (sesgo retrospectivo)", detail: "Creer que 'obviamente' habrías visto el setup porque ves las velas pasadas. El replay vela por vela es el único remedio." },
            { label: "Over-fitting", detail: "Optimizar tu estrategia hasta que rinde perfectamente en el pasado. En live, esa estrategia sobreajustada a los datos históricos fracasa." },
            { label: "Ignorar las comisiones", detail: "Cada trade tiene un costo (spread, comisión). Inclúyelos en tu backtest : pueden transformar un edge positivo en uno negativo." },
            { label: "Backtest en muy pocas condiciones", detail: "Un backtest sobre 3 meses de alza no dice nada sobre la performance en range o en baja. Testea sobre al menos 12 meses con distintas condiciones." },
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
          "El backtesting valida tu estrategia sobre datos pasados antes de arriesgar dinero real.",
          "Usa el modo Replay de TradingView para simular el tiempo real, jamás el gráfico estático.",
          "50 trades mínimo para la validación, 100 para una confianza estadística sólida.",
          "Las métricas clave: win rate (>40%), R promedio (>+0.5R), profit factor (>1.5), drawdown (<15%).",
          "Incluye las comisiones (spread, commission) en cada trade, cuentan a la larga.",
        ]}
      />

      <LessonExercice
        description="Lanza tu primer backtest sobre tu estrategia principal."
        steps={[
          "En TradingView, abre EUR/USD en H1. Retrocede 3 meses en modo Replay (botón flecha en la parte superior de la interfaz).",
          "Avanza vela por vela. Aplica tu estrategia (BOS → retroceso OTE → OB → señal de vela). Anota cada trade potencial.",
          "Para los primeros 10 trades identificados, registra: confluencias presentes, entrada, SL, TP, resultado en R.",
          "Calcula tu win rate y tu R promedio en esos 10 trades. Es el inicio de tu edge personal.",
        ]}
      />

      <LessonQuiz
        question="Después de 20 trades en backtest, obtienes un win rate de 70% y un profit factor de 1.8. Decides pasar a live de inmediato. ¿Cuál es el error?"
        options={[
          "El win rate de 70% es demasiado alto, no es realista",
          "20 trades es una muestra demasiado pequeña para validar una estrategia de forma estadísticamente confiable",
          "El profit factor de 1.8 es insuficiente, se necesita al menos 3.0 para tradear en live",
          "Hay que hacer backtest en 5 instrumentos distintos antes de tradear EUR/USD",
        ]}
        correctIndex={1}
        explanation="20 trades representan una muestra demasiado pequeña para sacar conclusiones estadísticamente confiables. Una serie de 20 trades puede ser positiva por pura suerte, incluso con una estrategia sin edge. Se necesitan al menos 50 trades, idealmente 100, para que los resultados reflejen realmente la performance de la estrategia y no la varianza aleatoria."
        answerExplanations={[
          "Falso. Un win rate del 70% no es irrealista si el R/R es favorable (>1:1). Algunas estrategias de scalping o con muchas confluencias pueden alcanzar esas cifras. No es el problema aquí.",
          "Correcto. 20 trades = varianza aleatoria demasiado alta. El mismo backtest con otros 20 trades podría dar 30% de win rate y un profit factor de 0.8. Se necesitan 50 a 100 trades para que las estadísticas sean significativas.",
          "Falso. Un profit factor de 1.8 ya es sólido, por encima de 1.5 suele ser un objetivo válido. 3.0 es excepcional y no es requerido para tradear en live con un edge real.",
          "Falso. Hacer backtest en varios instrumentos puede ser útil pero no es una condición previa obligatoria. La prioridad es tener una muestra lo suficientemente grande en un solo instrumento antes de generalizar.",
        ]}
      />

    </LessonPage>
  );
}
