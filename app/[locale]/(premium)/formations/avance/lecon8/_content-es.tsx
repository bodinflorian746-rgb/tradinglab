import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { TradingJournalDiagram } from "@/app/components/charts/TradingJournalDiagram";

export default function ContentEs() {
  return (
    <LessonPage
      formationId="avance"
      lessonId="lecon8"
      title="Journaling, analizar para progresar"
      subtitle="Los mejores traders no mejoran por intuición, mejoran por datos. El journal de trading es la herramienta que transforma la experiencia bruta en progresión medible."
      duration="18 min"
      lessonNumber={8}
      prev={{ href: "/formations/avance/lecon7", label: "Lección 7 : Entradas de precisión" }}
      next={{ href: "/formations/avance/lecon9", label: "Lección 9 : Backtesting" }}
    >

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Por qué la mayoría de traders no progresa</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Sin journal, el trading sigue siendo una serie de experiencias desconectadas. Pierdes un trade, pasas al siguiente. Ganas, piensas que tu estrategia es buena. Pero sin datos objetivos no tienes manera de saber qué funciona realmente, qué repites como error, o dónde está tu edge.
        </p>
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
          <p className="text-sm text-zinc-400 leading-relaxed">
            <span className="text-white font-medium">Hecho:</span> la mayoría de los traders profesionales lleva un journal detallado. No es opcional, es una herramienta de performance al mismo nivel que una estrategia.
          </p>
        </div>
        <p className="text-zinc-300 leading-relaxed text-sm mt-4">
          Lleva tu trading como un juego de probabilidades. Ninguna operación es segura; sobre un gran número de operaciones, lo que decide es tu ventaja estadística. El diario sirve exactamente para eso: detectar qué parámetros (setups, sesiones, pares, condiciones) te resultan rentables y cuáles te cuestan, para optimizar esa ventaja. El objetivo no es juzgar una operación aislada sino entender tus errores recurrentes. El trading se adapta a cada uno: un trader = una estrategia, la tuya se construye con tus propios datos.
        </p>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Lo que contiene un buen journal de trading</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Un journal eficaz documenta cada trade de forma estructurada, antes, durante y después. Aquí están las informaciones esenciales a capturar.
        </p>
        <div className="space-y-2.5">
          {[
            {
              phase: "Antes del trade",
              items: ["Instrumento & timeframe", "Sesgo de mercado (alcista / bajista / neutro)", "Confluencias identificadas (OB, FVG, liquidity, OTE...)", "Entrada prevista, SL, TP", "Ratio R/R calculado", "Screenshot del setup"],
            },
            {
              phase: "Después del trade",
              items: ["Resultado (ganancia/pérdida en R, no en euros)", "¿El precio se comportó como lo previste?", "¿Respetaste el plan?", "Errores cometidos (entrada muy temprana, SL movido, TP reducido...)", "Screenshot del resultado con anotaciones"],
            },
            {
              phase: "Revisión semanal",
              items: ["Tasa de acierto (win rate)", "R promedio (ganancia promedio por trade)", "Drawdown máximo de la semana", "Patrón de error recurrente", "Condición de mercado donde tu estrategia rinde o no rinde"],
            },
          ].map((section, i) => (
            <div key={i} className="bg-zinc-800/40 rounded-xl px-4 py-3">
              <p className="text-sm font-semibold text-white mb-2">{section.phase}</p>
              <ul className="space-y-1">
                {section.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-xs text-zinc-400">
                    <span className="text-zinc-600 shrink-0">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
        <TradingJournalDiagram locale="es" />
      </div>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Analizar en R, no en euros</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          El R (Risk/Reward) es la unidad estándar para medir la performance de trading. Analizar en euros sesga el análisis, un trade ganado de 50€ puede ser un mal trade si el R/R era 1:0.5. Un trade perdido de 20€ puede ser un buen trade si el plan fue respetado.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                {["Resultado", "En euros", "En R", "Veredicto"].map((h) => (
                  <th key={h} className="text-left text-[10px] font-semibold text-zinc-500 uppercase tracking-widest pb-2.5 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Trade 1", "+85€", "+1.7R", "Buen trade"],
                ["Trade 2", "+10€", "+0.2R", "Mal trade"],
                ["Trade 3", "-50€", "-1R", "Buen trade (plan respetado)"],
                ["Trade 4", "-50€", "-3R", "Mal trade (SL movido)"],
              ].map((row, i) => (
                <tr key={i} className="border-t border-zinc-800/70">
                  <td className="py-2.5 pr-4 text-zinc-400 text-xs">{row[0]}</td>
                  <td className="py-2.5 pr-4 text-white text-xs font-mono">{row[1]}</td>
                  <td className="py-2.5 pr-4 text-emerald-400 text-xs font-mono">{row[2]}</td>
                  <td className={`py-2.5 pr-4 text-xs font-medium ${row[3].startsWith("Buen") ? "text-emerald-400" : "text-red-400"}`}>{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Revisión</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <LessonKeyPoints
        points={[
          "El journal transforma la experiencia bruta en datos utilizables para progresar.",
          "Documenta ANTES (plan, confluencias, SL/TP) y DESPUÉS (resultado, comportamiento, errores).",
          "Mide todo en R, no en euros. El euro sesga la percepción de la calidad del trade.",
          "La revisión semanal es tan importante como el journal mismo, ahí es donde se produce el aprendizaje.",
          "Un trade perdido pero que respeta el plan es un buen trade. Un trade ganado pero fuera del plan es un error.",
        ]}
      />

      <LessonExercice
        description="Crea y comienza a llenar tu primer journal de trading."
        steps={[
          "Crea un documento (Notion, Google Sheets, cuaderno) con las columnas: Fecha, Instrumento, Confluencias, Entrada, SL, TP, R/R, Resultado (R), ¿Plan respetado? (sí/no), Notas.",
          "Recupera 3 trades pasados (en papel o demo) y llena su entrada en el journal.",
          "Para cada trade: indica si respetaste el plan. Si no, anota el error exacto.",
          "Calcula tu win rate y tu R promedio en esos 3 trades. ¿Qué constatas?",
        ]}
      />

      <LessonQuiz
        question="Ganaste 3 trades esta semana con +1.5R total y perdiste 2 trades con -2R. ¿Qué te dice un buen journal?"
        options={[
          "Tu semana es negativa (-0.5R), debes cambiar de estrategia de inmediato",
          "El resultado semanal no es suficiente para sacar conclusiones, analiza los 5 trades individualmente",
          "Tu win rate de 60% es excelente, sigue exactamente como lo haces",
          "Los trades perdidos son más importantes que los ganados, concéntrate en los errores",
        ]}
        correctIndex={1}
        explanation="5 trades no permiten sacar conclusiones estadísticamente confiables. Un buen journal te invita a analizar cada trade individualmente: ¿los trades ganados estaban bien construidos? ¿Los trades perdidos respetaron el plan? El resultado semanal (-0.5R) puede ser normal con una buena estrategia sobre una serie pequeña."
        answerExplanations={[
          "Demasiado apresurado. -0.5R en 5 trades no justifica ningún cambio de estrategia. Una muestra tan corta puede representar varianza normal. Cambiar de estrategia con 5 trades es micromanagement contraproducente.",
          "Correcto. 5 trades = sin señal estadística confiable. El análisis individual de cada trade (¿plan respetado? ¿confluencias válidas? ¿error de ejecución?) es mucho más instructivo que el resultado bruto.",
          "Falso. 60% de win rate en 5 trades no dice nada significativo. Y un win rate elevado puede ocultar un mal R/R. Si los 3 wins son +0.5R cada uno y las 2 pérdidas -1R cada una, la cuenta es perdedora a largo plazo.",
          "Parcialmente cierto. Analizar los errores es importante, pero ignorar los trades ganados es un error. Entender por qué un trade ganó es tan crucial como entender por qué otro perdió.",
        ]}
      />

    </LessonPage>
  );
}
