import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { ConfluenceDiagram } from "@/app/components/charts/ConfluenceDiagram";

export default function ContentEs() {
  return (
    <LessonPage
      formationId="intermediaire"
      lessonId="lecon5"
      title="Confluencias y probabilidad"
      subtitle="Una sola señal es una apuesta. Tres señales alineadas en el mismo nivel es un trade construido. La diferencia es tu probabilidad de éxito."
      duration="20 min"
      lessonNumber={5}
      prev={{ href: "/formations/intermediaire/lecon4", label: "Lección 4 — Tendencias" }}
      next={{ href: "/formations/intermediaire/lecon6", label: "Lección 6 — Fake Breakout" }}
    >

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Lo que debes ver en el gráfico</p>
        <h2 className="text-lg font-semibold text-white mb-4">Cuando las confluencias se alinean</h2>
        <p className="text-zinc-300 text-sm leading-relaxed mb-4">
          Abres EUR/USD en H4. Ves: el precio está en un soporte histórico → Y es también el último Higher Low en tendencia alcista → Y un nivel de Fibonacci 61.8% apunta a la misma zona. Tres razones independientes en el mismo lugar. <strong className="text-white">Eso es una confluencia.</strong>
        </p>
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
          <p className="text-sm text-zinc-400">
            <span className="text-white font-medium">Regla fundamental:</span> nunca entres por una sola razón. Cada confluencia adicional independiente aumenta la probabilidad — y reduce el riesgo de una entrada en el sentido equivocado.
          </p>
        </div>
      </section>

      <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
        <ConfluenceDiagram locale="es" />
      </div>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Las confluencias para combinar</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Cada categoría aporta un tipo de información distinto. Es su combinación la que crea el valor — no su número solo.
        </p>
        <div className="space-y-2.5">
          {[
            { label: "Tendencia (estructura de mercado)", detail: "La dirección dominante — alcista o bajista. Es la base. Verifica en Daily primero.", color: "bg-emerald-500/5 border-emerald-500/15 text-emerald-400" },
            { label: "Zona S/R o SD", detail: "Un nivel donde el precio ya reaccionó. Un viejo soporte, una resistencia, o una zona de Demand/Supply.", color: "bg-blue-500/5 border-blue-500/15 text-blue-400" },
            { label: "Nivel Fibonacci", detail: "38.2%, 50% o 61.8% del último movimiento impulsivo. Suele coincidir con un S/R — ahí está la potencia.", color: "bg-blue-500/5 border-blue-500/15 text-blue-400" },
            { label: "Nivel psicológico", detail: "1.1000, 45 000$, 2 000$... Los traders colocan naturalmente stops y órdenes en los números redondos.", color: "bg-amber-400/5 border-amber-400/15 text-amber-400" },
            { label: "Señal de vela (disparador)", detail: "Pin bar, engulfing, rechazo. Es el gatillo — no la razón de entrar. La razón son las confluencias de arriba.", color: "bg-zinc-800/50 border-zinc-700/50 text-zinc-300" },
          ].map((item, i) => (
            <div key={i} className={`rounded-xl px-4 py-3 border ${item.color}`}>
              <p className="text-sm font-semibold mb-1">{item.label}</p>
              <p className="text-xs text-zinc-400 leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Escenario completo — 4 confluencias alineadas</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Acá tienes cómo construir un trade de alta probabilidad, paso a paso.
        </p>
        <div className="space-y-2">
          {[
            { step: "1", text: "Daily alcista (HH/HL) — tu sesgo: compras únicamente." },
            { step: "2", text: "H4: el precio retrocede al último Higher Low a 1.0850." },
            { step: "3", text: "1.0850 coincide con un soporte histórico respetado 2× en el pasado." },
            { step: "4", text: "Fibonacci 61.8% del último movimiento impulsivo = 1.0848." },
            { step: "✓", text: "M15: una pin bar alcista se forma en la zona. Señal validada. Entras en compra." },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
              <span className={`text-xs font-bold shrink-0 mt-0.5 w-5 ${item.step === "✓" ? "text-emerald-400" : "text-emerald-400/60"}`}>{item.step}</span>
              <p className="text-sm text-zinc-300 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
          <p className="text-sm text-zinc-400">
            <span className="text-white font-medium">Resultado:</span> 4 confluencias independientes en el mismo nivel. Entrada a 1.0851, SL a 1.0835, TP a 1.0950. R/R = 1:6.
          </p>
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3">Cómo analizar en 5 segundos</p>
        <h2 className="text-lg font-semibold text-white mb-4">Contar tus confluencias antes de entrar</h2>
        <div className="space-y-2">
          {[
            { n: "1", t: "¿Cuál es la tendencia?", d: "Daily alcista → compras. Bajista → ventas. Sin tendencia → sin trade." },
            { n: "2", t: "¿Hay un nivel de estructura en mi zona?", d: "¿S/R, Higher Low, zona SD? Si sí, primera confluencia validada." },
            { n: "3", t: "¿Hay una segunda confluencia independiente?", d: "¿Fibonacci? ¿Nivel psicológico? Si sí, el trade está calificado. Si no, esperamos." },
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
        <h2 className="text-lg font-semibold text-white mb-4">La regla de las confluencias</h2>
        <div className="space-y-2.5">
          <div className="flex items-start gap-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <span className="text-lg">✓</span>
            <div>
              <p className="text-sm font-semibold text-emerald-400">3+ confluencias alineadas + señal de vela</p>
              <p className="text-xs text-zinc-400 mt-0.5">Entras. Es un trade de alta probabilidad. SL lógico bajo/encima de la zona. TP hacia la próxima zona de estructura.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-amber-400/5 border border-amber-400/15 rounded-xl px-4 py-3">
            <span className="text-lg">~</span>
            <div>
              <p className="text-sm font-semibold text-amber-400">2 confluencias + señal de vela</p>
              <p className="text-xs text-zinc-400 mt-0.5">Puedes entrar con un tamaño reducido. El trade es posible pero menos sólido. Asegúrate de que la tendencia esté alineada.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
            <span className="text-lg">✗</span>
            <div>
              <p className="text-sm font-semibold text-red-400">1 sola confluencia</p>
              <p className="text-xs text-zinc-400 mt-0.5">No tradeas. Una sola señal = una apuesta. Espera que se sumen otras confluencias o pasa a la próxima oportunidad.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border border-red-500/20 bg-red-500/5 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">Error clásico</p>
        <p className="text-sm font-semibold text-white mb-2">Contar confluencias redundantes como confluencias independientes</p>
        <p className="text-sm text-zinc-300 leading-relaxed">
          Ves: RSI en sobreventa + MACD cruzado + Estocástico bajo. Piensas &quot;3 confluencias&quot;. Pero estos 3 indicadores usan los mismos datos de precio — todos dicen lo mismo de 3 formas distintas. 3 indicadores = 1 sola confluencia. Las verdaderas confluencias son independientes: tendencia, S/R, Fibonacci, nivel psicológico.
        </p>
      </section>

      <div className="border border-zinc-700/40 rounded-2xl p-5 bg-zinc-900/30">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Resumen en 3 segundos</p>
        <div className="space-y-2 text-sm">
          <p className="text-zinc-200"><span className="text-emerald-400 font-bold mr-2">✔</span>3+ confluencias + señal → entras (tamaño normal)</p>
          <p className="text-zinc-200"><span className="text-amber-400 font-bold mr-2">~</span>2 confluencias + señal → tamaño reducido, sigues buscando</p>
          <p className="text-zinc-500"><span className="text-red-400 font-bold mr-2">✖</span>1 sola confluencia → no tradeas</p>
        </div>
      </div>

      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Repaso</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <LessonKeyPoints
        points={[
          "Confluencia = una razón independiente que sostiene tu trade. Mínimo 2-3 antes de entrar.",
          "Las 5 principales: tendencia, S/R, zona SD, Fibonacci, nivel psicológico.",
          "La señal de vela es el disparador — no la razón principal de entrar.",
          "Los indicadores (RSI, MACD) no son confluencias independientes entre ellos.",
          "Calidad prima sobre cantidad: 3 confluencias sólidas valen más que 6 mediocres.",
        ]}
      />

      <LessonExercice
        description="En TradingView, construye un setup completo con 3 confluencias mínimo en EUR/USD."
        steps={[
          "Analiza EUR/USD en Daily — ¿cuál es la tendencia? Anota tu sesgo (compra o venta únicamente).",
          "Baja a H4 — identifica el próximo nivel de estructura clave (HL en alcista, LH en bajista).",
          "Verifica: ¿hay un S/R histórico o una zona SD que coincida con ese nivel? Anota la confluencia.",
          "Marca Fibonacci en el último movimiento impulsivo — ¿un nivel Fib coincide con tu zona? Si sí, 3 confluencias alineadas. Anota la entrada, el SL y el TP con el R/R.",
        ]}
      />

      <LessonQuiz
        question="Ves EUR/USD Daily alcista. El precio retrocede a 1.0850. También es un soporte histórico respetado 2×. Sin otra confluencia. ¿Qué haces?"
        options={[
          "Compras inmediatamente — 2 confluencias (tendencia + soporte) alcanzan de sobra",
          "Esperas una señal de vela de rechazo en 1.0850 antes de entrar",
          "Buscas una 3ª confluencia (Fibonacci, nivel psicológico) y luego una señal de vela",
          "No entras — 2 confluencias es muy poco para un trade",
        ]}
        correctIndex={2}
        explanation="2 confluencias son un comienzo, pero no todavía suficiente para entrar con confianza. Buscas una 3ª confluencia (¿Fibonacci 61.8%? ¿Nivel psicológico 1.0850?) y luego esperas una señal de vela en la zona. Es el proceso completo."
        answerExplanations={[
          "Demasiado apurado. 2 confluencias sin señal de confirmación es entrar muy pronto. El precio puede seguir bajando en la zona. Espera al menos una señal de vela en el nivel.",
          "Mejor, pero incompleto. Esperar la señal es una buena práctica, pero buscar una 3ª confluencia antes refuerza aún más el trade. La combinación de ambas es el método óptimo.",
          "Correcto. Tienes 2 confluencias sólidas. Busca si un nivel Fibonacci (61.8% del movimiento) o un nivel psicológico coincide con 1.0850 — si sí, tienes 3 confluencias. Luego esperas la señal de vela. Es el proceso completo.",
          "No del todo. 2 confluencias pueden justificar un trade con tamaño reducido. 3 confluencias + señal = tamaño normal. No es la ausencia de trade lo recomendado, sino el agregado de una 3ª confirmación.",
        ]}
      />

    </LessonPage>
  );
}
