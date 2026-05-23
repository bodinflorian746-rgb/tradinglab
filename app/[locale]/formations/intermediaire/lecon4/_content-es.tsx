import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { TrendDiagram } from "@/app/components/charts/TrendDiagram";
import { RetracementInteractive } from "@/app/components/charts/RetracementInteractive";

export default function ContentEs() {
  return (
    <LessonPage
      formationId="intermediaire"
      lessonId="lecon4"
      title="Tendencias — tradear en el sentido del mercado"
      subtitle="El 90% de los traders perdedores tradean contra la tendencia sin saberlo. Aprender a leer la dirección dominante es poner las probabilidades de tu lado antes incluso de abrir un trade."
      duration="18 min"
      lessonNumber={4}
      prev={{ href: "/formations/intermediaire/lecon3", label: "Lección 3 — Supply & Demand" }}
      next={{ href: "/formations/intermediaire/lecon5", label: "Lección 5 — Confluencias" }}
    >

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Lo que debes ver en el gráfico</p>
        <h2 className="text-lg font-semibold text-white mb-4">Leer la tendencia en 3 segundos</h2>
        <div className="space-y-3">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-emerald-400 mb-2">Tendencia alcista</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              El gráfico &quot;sube en escalera&quot;. Ves: subida → corrección chica → subida más alta → corrección chica aún más alta. Cada ola sube más alto que la anterior. <strong className="text-white">Buscas compras, únicamente en las correcciones.</strong>
            </p>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-red-400 mb-2">Tendencia bajista</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              El gráfico &quot;baja en escalera&quot;. Cada rebote es más bajo que el anterior. <strong className="text-white">Buscas ventas, únicamente en los rebotes.</strong>
            </p>
          </div>
          <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-zinc-300 mb-2">Range</p>
            <p className="text-sm text-zinc-400 leading-relaxed">
              El precio va y viene entre dos niveles horizontales. Ni los compradores ni los vendedores ganan claramente. Sin trade direccional — esperar.
            </p>
          </div>
        </div>
      </section>

      <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
        <TrendDiagram locale="es" />
      </div>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3">Pon a prueba tu instinto</p>
        <h2 className="text-lg font-semibold text-white mb-4">¿Cuándo entras?</h2>
        <p className="text-zinc-300 text-sm leading-relaxed mb-4">
          El precio está en tendencia alcista. Retrocede al Higher Low. En ese punto preciso — ¿qué haces?
        </p>
        <RetracementInteractive locale="es" />
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Identificar la tendencia correctamente</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          La tendencia depende del timeframe. Un mercado puede ser alcista en Daily y bajista en H1. La regla: el timeframe alto define el sesgo. Tradeas en su sentido.
        </p>
        <div className="space-y-2.5">
          {[
            { label: "Daily o H4 — el sesgo principal", detail: "Es la tendencia que debes respetar. Si Daily es alcista, buscas únicamente compras." },
            { label: "H1 — las zonas de entrada", detail: "En tendencia alcista Daily, el H1 muestra los retrocesos (correcciones). Son tus ventanas de entrada." },
            { label: "M15 — el timing preciso", detail: "En M15, buscas la señal final (rechazo, pin bar, engulfing). Es el disparador de la entrada." },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-zinc-800/40 rounded-xl px-4 py-3">
              <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <span style={{ fontSize: 9, fontWeight: 700, color: "#10b981" }}>{i + 1}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">{item.label}</p>
                <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Escenario real — tradear el retroceso</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Es el setup básico en tendencia: esperar que el precio vuelva a un nivel de estructura, luego entrar en el sentido de la tendencia.
        </p>
        <div className="space-y-2">
          {[
            { step: "Situación", text: "EUR/USD Daily alcista. El precio acaba de hacer un nuevo HH a 1.0950. Empieza a corregir.", color: "text-zinc-400" },
            { step: "Espera", text: "Identificas el último Higher Low a 1.0850. Esperas que el precio baje a esa zona.", color: "text-zinc-400" },
            { step: "Señal", text: "El precio llega a 1.0850. Pasas a H1. Una pin bar alcista se forma. Señal validada.", color: "text-emerald-400" },
            { step: "Entrada", text: "Compras con SL bajo 1.0800 (debajo del HL) y TP hacia 1.0950 (hacia el HH). R/R = 1:2.", color: "text-emerald-400" },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
              <span className={`text-xs font-bold shrink-0 mt-0.5 w-12 ${item.color}`}>{item.step}</span>
              <p className="text-sm text-zinc-300 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3">Cómo analizar en 5 segundos</p>
        <h2 className="text-lg font-semibold text-white mb-4">Verificar la tendencia antes de cada trade</h2>
        <div className="space-y-2">
          {[
            { n: "1", t: "Abre el Daily", d: "Mira la dirección general: ¿los máximos y mínimos suben o bajan?" },
            { n: "2", t: "Anota tu sesgo: compras o ventas", d: "Alcista = solo compras. Bajista = solo ventas. Range = sin trade." },
            { n: "3", t: "Baja a H4 — ¿dónde está el último HL o LH?", d: "Ahí vas a vigilar para entrar. El retroceso debe llegar a esa zona." },
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
        <h2 className="text-lg font-semibold text-white mb-4">La lógica según la tendencia</h2>
        <div className="space-y-2.5">
          <div className="flex items-start gap-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <span className="text-lg">↑</span>
            <div>
              <p className="text-sm font-semibold text-emerald-400">Tendencia alcista</p>
              <p className="text-xs text-zinc-400 mt-0.5">Solo compras en los retrocesos (correcciones). Nunca en los impulsos. Esperas que el precio vuelva a un HL antes de entrar.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
            <span className="text-lg">↓</span>
            <div>
              <p className="text-sm font-semibold text-red-400">Tendencia bajista</p>
              <p className="text-xs text-zinc-400 mt-0.5">Solo entras en venta en los rebotes. Nunca en los impulsos bajistas. Esperas un LH para vender.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-zinc-800/40 border border-zinc-700/40 rounded-xl px-4 py-3">
            <span className="text-lg">—</span>
            <div>
              <p className="text-sm font-semibold text-zinc-300">Range</p>
              <p className="text-xs text-zinc-400 mt-0.5">Sin trade direccional. Si quieres tradear el range, compras el bottom y vendes el top — pero es avanzado. Por ahora, evítalo.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border border-red-500/20 bg-red-500/5 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">Error clásico</p>
        <p className="text-sm font-semibold text-white mb-2">Entrar en venta en una tendencia alcista &quot;porque el precio subió demasiado&quot;</p>
        <p className="text-sm text-zinc-300 leading-relaxed">
          EUR/USD está en tendencia alcista hace 2 semanas. El precio sigue subiendo. Te dices &quot;no puede seguir, vendo&quot;. Entras en short. El precio sube 200 pips más. La tendencia alcista puede durar semanas. Nunca tradees &quot;en contra&quot; porque crees que &quot;está muy alto&quot; o &quot;muy bajo&quot;. El mercado siempre tiene razón.
        </p>
      </section>

      <div className="border border-zinc-700/40 rounded-2xl p-5 bg-zinc-900/30">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Resumen en 3 segundos</p>
        <div className="space-y-2 text-sm">
          <p className="text-zinc-200"><span className="text-emerald-400 font-bold mr-2">✔</span>Daily alcista → compras únicamente en los retrocesos (HL)</p>
          <p className="text-zinc-200"><span className="text-emerald-400 font-bold mr-2">✔</span>Daily bajista → vendes únicamente en los rebotes (LH)</p>
          <p className="text-zinc-500"><span className="text-red-400 font-bold mr-2">✖</span>Range / dirección incierta → ningún trade direccional</p>
        </div>
      </div>

      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Repaso</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <LessonKeyPoints
        points={[
          "Tendencia alcista = HH+HL. Compras únicamente en los retrocesos.",
          "Tendencia bajista = LH+LL. Ventas únicamente en los rebotes.",
          "El Daily define el sesgo. H4 da las zonas. M15 da la entrada.",
          "Nunca entrar contra tendencia sin una razón estructural sólida.",
          "Un retroceso en una tendencia = oportunidad. No una señal de reversal.",
        ]}
      />

      <LessonExercice
        description="En TradingView, identifica la tendencia en 3 mercados diferentes y planifica una entrada."
        steps={[
          "Abre EUR/USD, GBP/USD y BTC/USD en Daily. Para cada uno, anota: ¿alcista, bajista o range?",
          "En el par alcista: identifica los 3 últimos Higher Lows. Ahí es donde buscarías comprar.",
          "Baja a H4 en ese par. ¿El precio está actualmente en retroceso o en impulso?",
          "Si el precio está en retroceso en un HL, baja a H1 y espera una señal de vela. Anota la zona, el SL lógico y el TP.",
        ]}
      />

      <LessonQuiz
        question="EUR/USD es claramente alcista en Daily (HH/HL). El precio acaba de hacer un nuevo máximo a 1.0950 y ahora retrocede. Baja hacia 1.0860 (último Higher Low). Ves una pin bar alcista en ese nivel en H1. ¿Qué haces?"
        options={[
          "Esperas más — quizá el retroceso siga hasta 1.0800",
          "Compras en la pin bar, SL bajo 1.0850, TP hacia 1.0990",
          "Vendes — el precio baja, es una señal de debilidad",
          "No haces nada — el mercado está muy incierto ahora",
        ]}
        correctIndex={1}
        explanation="Todos los elementos están alineados: tendencia alcista Daily, retroceso en el último HL, señal de confirmación (pin bar). Es el setup en tendencia por excelencia. Entras en compra con SL bajo el HL y TP hacia el cruce del último HH."
        answerExplanations={[
          "Demasiado prudente. Tienes 3 elementos alineados: tendencia, nivel de estructura, señal. Es exactamente el setup que esperabas. Esperar más sin razón es dejar pasar una oportunidad válida.",
          "Correcto. Tendencia alcista + retroceso en HL + señal pin bar = setup de alta probabilidad. SL a 1.0810 (bajo el HL a 1.0860), TP hacia el próximo HH (1.0960). R/R aproximado 1:2.",
          "Falso. El precio que baja hacia un HL en tendencia alcista es un retroceso normal — una corrección. No es debilidad. Es la oportunidad de compra que esperabas.",
          "Falso. La incertidumbre no justifica la inacción cuando el setup está claramente definido. Tendencia + estructura + señal = trade válido. La incertidumbre siempre está presente — el risk management (SL + tamaño) se encarga.",
        ]}
      />

    </LessonPage>
  );
}
