import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { TradePlanDiagram } from "@/app/components/charts/TradePlanDiagram";

export default function ContentEs() {
  return (
    <LessonPage
      formationId="intermediaire"
      lessonId="lecon8"
      title="Plan de trading"
      subtitle="Un trade sin plan es una decisión emocional. El plan de trading transforma tu análisis en acciones precisas — y elimina la improvisación en el peor momento."
      duration="20 min"
      lessonNumber={8}
      prev={{ href: "/formations/intermediaire/lecon7", label: "Lección 7 — Multi-Timeframe" }}
      next={{ href: "/formations/intermediaire/lecon9", label: "Lección 9 — Fibonacci" }}
    >

      {/* ── Lo que debes VER ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Lo que debes ver en el gráfico</p>
        <h2 className="text-lg font-semibold text-white mb-4">La diferencia entre tradear con y sin plan</h2>
        <div className="space-y-3">
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-red-400 mb-2">Sin plan — lo que pasa en la realidad</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              EUR/USD sube rápido. Ves +30 pips en 10 minutos. Entras por FOMO en 1.0980. El precio retrocede a 1.0960. Aguantas &quot;porque va a subir de nuevo&quot;. Baja a 1.0940. Entras en pánico y cortas. El precio se va a 1.1020 sin ti. Perdiste 40 pips y el trade que estabas esperando.
            </p>
          </div>
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-emerald-400 mb-2">Con plan — el mismo día</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Habías identificado 1.0850 como zona de compra en la mañana. Ves al precio subir sin ti — sin estrés. Retrocede a 1.0853. Pin bar en tu zona. Entras exactamente como lo previste. SL en 1.0835, TP en 1.0950. No improvisas nada. <strong className="text-white">Ejecutas.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* ── Por qué un plan ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Por qué un plan de trading es indispensable</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          La mayoría de traders pierden no porque les falte conocimiento, sino porque toman decisiones en el calor del momento. Un plan de trading te obliga a decidir ANTES de que la emoción entre en juego — cuando estás tranquilo, lúcido y objetivo.
        </p>
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
          <p className="text-sm text-zinc-400">
            <span className="text-white font-medium">Regla fundamental:</span> todo lo que vas a hacer durante un trade debe estar decidido antes de entrar. SL, TP, tamaño — fijados de antemano, jamás modificados bajo la emoción.
          </p>
        </div>
      </section>

      {/* ── Los 6 elementos ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Los elementos de un plan de trading completo</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Un buen plan de trading responde a 6 preguntas antes de cada sesión.
        </p>
        <div className="space-y-2.5">
          {[
            { q: "¿Cuál es mi sesgo?", r: "Alcista, bajista o neutro (no hay trade). Basado en el análisis Daily." },
            { q: "¿Cuáles son mis niveles clave?", r: "Las zonas de soporte/resistencia, zonas SD y estructuras importantes para la sesión." },
            { q: "¿En qué condición entro?", r: "El disparador preciso: 'Si el precio vuelve a 1.0850 y forma un rechazo, compro'." },
            { q: "¿Dónde está mi Stop Loss?", r: "Nivel definido de antemano, lógico en el gráfico — no modificable una vez abierto el trade." },
            { q: "¿Dónde está mi Take Profit?", r: "Objetivo basado en la estructura del mercado. R/R de al menos 1:2." },
            { q: "¿Cuál es mi regla de stop diario?", r: "Si pierdo X% hoy, paro. Protege contra el revenge trading." },
          ].map((item, i) => (
            <div key={i} className="bg-zinc-800/40 rounded-xl px-4 py-3">
              <p className="text-sm font-semibold text-white mb-1">{item.q}</p>
              <p className="text-xs text-zinc-400 leading-relaxed">{item.r}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
        <TradePlanDiagram locale="es" />
      </div>

      {/* ── Journal de trading ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">El journal de trading — lo que realmente te hace progresar</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          El journal es el registro de cada trade. Permite identificar tus patrones de éxito, tus errores recurrentes, y progresar de forma estructurada.
        </p>
        <div className="space-y-2.5">
          {[
            { label: "Antes del trade", detail: "Sesgo, niveles, disparador esperado, SL/TP, confluencias. Por qué tomas este trade." },
            { label: "Después del trade", detail: "Resultado en R (ganancia/pérdida), qué pasó, ¿respetaste el plan?, ¿qué harías diferente?" },
            { label: "Revisión semanal", detail: "Análisis de todos los trades de la semana: tasa de acierto, R promedio, errores repetidos, patrón de éxito." },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-zinc-800/40 rounded-xl px-4 py-3">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-blue-400 shrink-0 mt-0.5">
                <rect x="2" y="1.5" width="10" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
                <path d="M4.5 5h5M4.5 7.5h5M4.5 10h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <div>
                <p className="text-sm font-medium text-white">{item.label}</p>
                <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5 segundos ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3">Cómo analizar en 5 segundos</p>
        <h2 className="text-lg font-semibold text-white mb-4">Verificar tu plan antes de entrar</h2>
        <div className="space-y-2">
          {[
            { n: "1", t: "¿El disparador está validado?", d: "El precio está en mi zona Y tengo una señal de vela. Si no → no entro, sin importar la tentación." },
            { n: "2", t: "¿Mi SL y TP están definidos?", d: "Precio de entrada exacto, SL debajo de la zona, TP en la próxima estructura. ¿R/R superior a 1:2?" },
            { n: "3", t: "¿Mi regla diaria está respetada?", d: "¿Ya perdí mi límite de pérdida diaria? Si sí → cierro la plataforma." },
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
        <h2 className="text-lg font-semibold text-white mb-4">Las reglas no negociables</h2>
        <div className="space-y-2.5">
          <div className="flex items-start gap-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <span className="text-lg">✓</span>
            <div>
              <p className="text-sm font-semibold text-emerald-400">Trade dentro del plan → ejecutas</p>
              <p className="text-xs text-zinc-400 mt-0.5">El disparador previsto se produce en la zona prevista. Entras con SL y TP ya definidos. Sin improvisación.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-amber-400/5 border border-amber-400/15 rounded-xl px-4 py-3">
            <span className="text-lg">!</span>
            <div>
              <p className="text-sm font-semibold text-amber-400">Trade fuera del plan → pasas</p>
              <p className="text-xs text-zinc-400 mt-0.5">Aparece una oportunidad pero no estaba en tu plan. Pasas. Habrá otros trades. Mejor perderte un trade que perder por un impulso.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
            <span className="text-lg">✗</span>
            <div>
              <p className="text-sm font-semibold text-red-400">Mover el SL bajo la emoción → jamás</p>
              <p className="text-xs text-zinc-400 mt-0.5">El trade va contra ti. Quieres mover el SL &quot;para darle una oportunidad&quot;. Es el error más caro. Si el SL es lógico, lo dejas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Error clásico ── */}
      <section className="border border-red-500/20 bg-red-500/5 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">Error clásico</p>
        <p className="text-sm font-semibold text-white mb-2">Mover el SL &quot;para darle una oportunidad&quot;</p>
        <p className="text-sm text-zinc-300 leading-relaxed">
          Estás en short en EUR/USD. SL en 1.0965. El precio sube a 1.0960 — 5 pips de tu SL. Te dices &quot;si lo pongo en 1.0980 tendrá más espacio&quot;. Lo mueves. El precio sigue a 1.0975. Lo mueves de nuevo a 1.0995. Pasas de una pérdida de 15 pips a una pérdida de 35 pips. El SL inicial existía por una razón: la estructura. No lo toques una vez abierto el trade.
        </p>
      </section>

      {/* ── Resumen ultrarrápido ── */}
      <div className="border border-zinc-700/40 rounded-2xl p-5 bg-zinc-900/30">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Resumen en 3 segundos</p>
        <div className="space-y-2 text-sm">
          <p className="text-zinc-200"><span className="text-emerald-400 font-bold mr-2">✔</span>Disparador previsto en tu zona → ejecutas el plan</p>
          <p className="text-zinc-200"><span className="text-amber-400 font-bold mr-2">!</span>Oportunidad fuera del plan → pasas (habrá otros trades)</p>
          <p className="text-zinc-500"><span className="text-red-400 font-bold mr-2">✖</span>SL colocado bajo presión → no lo mueves jamás</p>
        </div>
      </div>

      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Revisión</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <LessonKeyPoints
        points={[
          "Un plan de trading se escribe ANTES de la sesión — jamás en tiempo real bajo la emoción.",
          "Los 6 elementos esenciales: sesgo, niveles clave, disparador, SL, TP, regla de stop diario.",
          "El journal de trading es la herramienta que permite progresar de forma estructurada.",
          "Un trade que no respeta el plan es un error — incluso si termina ganando.",
          "La disciplina es ejecutar el plan incluso cuando la emoción sugiere otra cosa.",
        ]}
      />

      <LessonExercice
        description="Escribe tu primer plan de trading completo para la próxima sesión en EUR/USD."
        steps={[
          "Analiza EUR/USD en Daily y H4 — anota tu sesgo para mañana (alcista, bajista, o sin trade).",
          "Identifica 2 zonas clave en las que podrías reaccionar. Escribe los precios exactos.",
          "Para cada zona, describe el disparador exacto: 'Si el precio llega a X y veo Y, entonces entro en Z'.",
          "Define tu SL (debajo de la zona), tu TP (próximo nivel de estructura), calcula el R/R y fija tu regla de stop diario.",
        ]}
      />

      <LessonQuiz
        question="Estás en compra en EUR/USD. SL en 1.0835. El trade va contra ti — el precio baja a 1.0845, a 10 pips de tu SL. Piensas 'va a subir de nuevo'. ¿Qué haces?"
        options={[
          "Mueves el SL a 1.0820 para darle más espacio",
          "Cierras el trade de inmediato — el mercado va contra tu plan",
          "Mantienes el SL en 1.0835 y dejas que el mercado decida — es la decisión del plan",
          "Agregas a tu posición long para mejorar tu precio promedio de entrada",
        ]}
        correctIndex={2}
        explanation="El SL fue colocado en 1.0835 por una razón estructural — debajo de la zona de entrada. El mercado puede oscilar antes de regresar en la dirección correcta. Mover el SL es pasar de una pérdida definida a una pérdida desconocida. Si el SL es lógico, lo dejas hacer su trabajo."
        answerExplanations={[
          "Falso. Mover el SL bajo la emoción es uno de los errores más caros. Tenías 1.0835 por una razón estructural. Moverlo es aceptar una pérdida más grande sin razón válida. La presión emocional no es una razón técnica.",
          "Parcialmente válido. Si la estructura que habías identificado está claramente rota (no solo 'bajando'), cerrar puede justificarse. Pero si el SL no ha sido tocado y la zona aguanta, el plan prevalece.",
          "Correcto. El plan se estableció fuera de la emoción. Si el SL es lógico en el gráfico, lo dejas en su lugar. El precio puede oscilar antes de irse. Es precisamente para eso que existe el SL — para definir tu pérdida máxima sin que tengas que decidir bajo presión.",
          "Falso. Agregar a una posición perdedora ('promediar') aumenta tu riesgo en un trade que ya va en la dirección equivocada. Es uno de los errores más peligrosos en trading — transforma pérdidas pequeñas en pérdidas grandes.",
        ]}
      />

    </LessonPage>
  );
}
