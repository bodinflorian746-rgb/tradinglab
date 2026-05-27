import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { PrecisionEntryDiagram } from "@/app/components/charts/PrecisionEntryDiagram";

export default function ContentEs() {
  return (
    <LessonPage
      formationId="avance"
      lessonId="lecon7"
      title="Entradas de precisión"
      subtitle="La entrada es el momento donde todo se juega. Una entrada precisa te da un SL ajustado, un R/R elevado y menos estrés una vez abierto el trade. Aquí está cómo afinar cada entrada."
      duration="25 min"
      lessonNumber={7}
      prev={{ href: "/formations/avance/lecon6", label: "Lección 6 : Stop Hunts" }}
      next={{ href: "/formations/avance/lecon8", label: "Lección 8 : Journaling" }}
    >

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Por qué la entrada precisa lo cambia todo</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Dos traders pueden analizar el mismo setup y obtener resultados muy distintos según su punto de entrada. Un trader que entra en pleno medio de un OB tiene un SL amplio y un mal R/R. Un trader que entra en el rechazo dentro del OB tiene un SL ajustado y un R/R potencialmente superior a 1:5.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
            <p className="font-semibold text-red-400 text-sm mb-2">Entrada imprecisa</p>
            <p className="text-xs text-zinc-400 leading-relaxed">El trader entra apenas el precio llega a la zona. SL amplio (debajo de toda la zona). R/R a menudo inferior a 1:2. Más probabilidad de ser stopeado en un retroceso interno.</p>
          </div>
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
            <p className="font-semibold text-emerald-400 text-sm mb-2">Entrada de precisión</p>
            <p className="text-xs text-zinc-400 leading-relaxed">El trader espera una señal de rechazo en M5/M15 dentro de la zona. SL ajustado (debajo de la señal). R/R a menudo superior a 1:3 o 1:5. Menos exposición al riesgo.</p>
          </div>
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Los 3 métodos de entrada de precisión</h2>
        <div className="space-y-3">
          {[
            {
              title: "1. Entrada en rechazo de vela (M5/M15)",
              color: "bg-blue-500/5 border-blue-500/15",
              accentColor: "text-blue-400",
              detail: "Cuando el precio llega a la zona (OB, FVG, OTE), baja a M5 o M15. Espera una vela de rechazo: pin bar con mecha larga dentro de la zona, o engulfing en sentido opuesto. Entra al cierre de esa vela. SL debajo del extremo de la mecha.",
            },
            {
              title: "2. Entrada en retest de un nivel roto",
              color: "bg-blue-500/5 border-blue-500/15",
              accentColor: "text-blue-400",
              detail: "Después de un BOS, el precio suele regresar a testear el antiguo nivel roto (ahora soporte o resistencia). Es una entrada clásica: precisa, con un contexto fuerte. Entra en el rechazo del regreso sobre el nivel roto.",
            },
            {
              title: "3. Entrada en sweep + retroceso",
              color: "bg-amber-400/5 border-amber-400/15",
              accentColor: "text-amber-400",
              detail: "Después de un stop hunt (sweep de un EQH o EQL), el retroceso suele ser rápido y fuerte. Entra apenas la primera vela que confirma el retroceso en M5. SL más allá del pico del sweep. Es la entrada post-stop-hunt.",
            },
          ].map((m, i) => (
            <div key={i} className={`rounded-xl p-4 border ${m.color}`}>
              <p className={`text-sm font-semibold mb-2 ${m.accentColor}`}>{m.title}</p>
              <p className="text-xs text-zinc-400 leading-relaxed">{m.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
        <PrecisionEntryDiagram locale="es" />
      </div>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Colocación del Stop Loss de precisión</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Un SL de precisión se coloca con lógica de estructura, jamás arbitrariamente. Debe ser invalidante: si el precio lo alcanza, el setup queda verdaderamente invalidado.
        </p>
        <div className="space-y-2.5">
          {[
            { rule: "Debajo del extremo de la zona (OB o FVG)", detail: "Si el precio cruza por completo el OB o el FVG, el nivel institucional queda consumido, la idea de trade queda invalidada." },
            { rule: "Debajo del swing low de la entrada", detail: "Si entras en un rechazo en M15, el SL va debajo del extremo inferior de la pin bar o del engulfing." },
            { rule: "Algunos pips de margen", detail: "Deja 2 a 5 pips (según el instrumento) debajo del nivel exacto para evitar ser stopeado por el spread o el ruido natural del mercado." },
            { rule: "Jamás un monto fijo", detail: "Un SL de 20 pips 'porque es tu costumbre' no tiene ningún sentido estructural. El SL debe reflejar la geografía del gráfico." },
          ].map((r, i) => (
            <div key={i} className="flex items-start gap-3 bg-zinc-800/40 rounded-xl px-4 py-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
              <div>
                <p className="text-sm font-medium text-white">{r.rule}</p>
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
          "La entrada precisa = esperar una señal de confirmación en M5/M15 dentro de la zona institucional.",
          "Los 3 métodos: rechazo de vela, retest del nivel roto, sweep + retroceso.",
          "Un SL preciso se basa en la estructura del gráfico, jamás en un monto fijo arbitrario.",
          "Bajar a M5 para afinar la entrada permite un SL más ajustado y un R/R significativamente mejor.",
          "La espera de una confirmación reduce el número de trades, pero mejora la calidad de cada uno.",
        ]}
      />

      <LessonExercice
        description="En un setup que hayas identificado, practica afinando la entrada en un timeframe pequeño."
        steps={[
          "Identifica un Bullish Order Block activo en H1. Marca la zona (open → close de la vela OB).",
          "Baja a M5. Si el precio está en la zona, observa: ¿hay un rechazo (pin bar, engulfing alcista)?",
          "Si la señal está: anota el precio de entrada (cierre de la pin bar/engulfing), el SL (debajo de la mecha inferior) y el TP (próximo nivel de resistencia o liquidity).",
          "Calcula tu R/R. ¿Es superior a 1:3? Si no, ¿el setup es realmente válido?",
        ]}
      />

      <LessonQuiz
        question="El precio llega a un Bullish Order Block en H1. ¿Cuál es la mejor entrada?"
        options={[
          "Entrar de inmediato al precio del mercado apenas el precio toca el extremo inferior del OB",
          "Colocar una orden limit en medio del OB para no perder el movimiento",
          "Bajar a M5/M15 y esperar una señal de rechazo (pin bar o engulfing alcista) antes de entrar",
          "Entrar en compra en la próxima vela M15 que cierre alcista dentro del OB",
        ]}
        correctIndex={2}
        explanation="Esperar una señal de rechazo en M5/M15 es el enfoque más preciso. Te da una confirmación de que el precio efectivamente reacciona al OB (no solo en tránsito), un SL ajustado al extremo inferior de la señal y un R/R claramente superior a una entrada al toque o a media zona."
        answerExplanations={[
          "Demasiado apresurado. El precio puede cruzar el extremo inferior del OB y regresar, o cruzarlo por completo. Entrar al toque sin confirmación expone a un SL amplio o a un stop prematuro.",
          "Mejor que el toque, pero todavía impreciso. El medio del OB no tiene una lógica estructural particular. Una orden limit aquí puede también ser activada sin que el precio reaccione.",
          "Correcto. Es la entrada de precisión: bajar a M5/M15, esperar un rechazo dentro de la zona OB, entrar al cierre de la señal con un SL debajo del extremo de la mecha. Es el balance óptimo entre confirmación y timing.",
          "No es lo bastante preciso. 'La próxima vela alcista' dentro del OB puede ser cualquier pequeña vela verde, no es necesariamente una señal de rechazo fuerte. Una pin bar o un engulfing es requerido para una confirmación institucional.",
        ]}
      />

    </LessonPage>
  );
}
