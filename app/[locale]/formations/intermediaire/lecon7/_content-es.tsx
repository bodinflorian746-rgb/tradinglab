import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { MultiTimeframeDiagram } from "@/app/components/charts/MultiTimeframeDiagram";

export default function ContentEs() {
  return (
    <LessonPage
      formationId="intermediaire"
      lessonId="lecon7"
      title="Análisis Multi-Timeframe"
      subtitle="El mercado cuenta la misma historia a distintas escalas. Aprender a leer estos niveles en el orden correcto es una de las habilidades más potentes del trader."
      duration="22 min"
      lessonNumber={7}
      prev={{ href: "/formations/intermediaire/lecon6", label: "Lección 6 — Fake Breakout" }}
      next={{ href: "/formations/intermediaire/lecon8", label: "Lección 8 — Plan de trade" }}
    >

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Lo que debes ver en el gráfico</p>
        <h2 className="text-lg font-semibold text-white mb-4">El mismo par, dos historias distintas</h2>
        <div className="space-y-3">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-emerald-400 mb-2">EUR/USD — Daily (sesgo)</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Abres EUR/USD en Daily. El gráfico sube en escalera desde hace 3 semanas. HH/HL claros. <strong className="text-white">Sesgo alcista.</strong> Solo buscas compras para la semana.
            </p>
          </div>
          <div className="bg-blue-500/5 border border-blue-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-blue-400 mb-2">EUR/USD — H4 (zona de interés)</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Pasas a H4. El precio retrocede a 1.0850 — el último Higher Low. Es una zona de soporte. <strong className="text-white">Marcas la zona</strong> como zona de entrada potencial en compra.
            </p>
          </div>
          <div className="bg-blue-500/5 border border-blue-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-blue-400 mb-2">EUR/USD — M15 (disparador)</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Pasas a M15 cuando el precio toca la zona. Una pin bar alcista se forma. <strong className="text-white">Es la señal.</strong> Entras en compra en el sentido del Daily. Los 3 timeframes cuentan la misma historia.
            </p>
          </div>
        </div>
      </section>

      <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
        <MultiTimeframeDiagram locale="es" />
      </div>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Por qué los timeframes parecen contradecirse</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          El mismo mercado puede mostrar una tendencia alcista en Daily y una tendencia bajista en H1 simultáneamente. No es un error — son dos niveles de lectura distintos. El Daily muestra el contexto. El H1 muestra el movimiento en curso dentro de ese contexto.
        </p>
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
          <p className="text-sm text-zinc-400 leading-relaxed">
            <span className="text-white font-medium">Analogía: </span>
            Imagina mirar un mapa de un país (Daily) vs un mapa de tu ciudad (H1). El país te da la dirección — la ciudad te da las calles. Los dos son correctos, pero a escalas distintas.
          </p>
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">El rol de cada timeframe</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Cada timeframe tiene una función precisa. No lo usas por las mismas razones.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                {["Timeframe", "Rol", "Lo que buscas"].map((h, i) => (
                  <th key={i} className="text-left text-[10px] font-semibold text-zinc-500 uppercase tracking-widest pb-2.5 pr-6">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Weekly", "Contexto de fondo", "Tendencia largo plazo, zonas mayores"],
                ["Daily", "Sesgo direccional", "Tendencia actual, zonas clave importantes"],
                ["H4", "Zonas de interés", "Estructuras intermedias, zonas SD"],
                ["H1", "Confirmación de setup", "Patrón de continuación, señal de entrada"],
                ["M15 / M5", "Timing preciso", "Entrada en señal de vela, timing final"],
              ].map((row, i) => (
                <tr key={i} className="border-t border-zinc-800/70">
                  {row.map((cell, j) => (
                    <td key={j} className={`py-2.5 pr-6 leading-snug text-sm ${j === 0 ? "text-amber-400 font-semibold" : j === 1 ? "text-white font-medium" : "text-zinc-400"}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">El método Top-Down en la práctica</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          El método top-down consiste en analizar del timeframe grande al chico — nunca al revés. Cada nivel valida o invalida lo que ves en el nivel inferior.
        </p>
        <div className="space-y-2">
          {[
            { tf: "Daily", action: "Identifica la tendencia: alcista, bajista o range? Define tu sesgo para la semana." },
            { tf: "H4", action: "Ubica las zonas clave: soporte, resistencia, zonas SD. ¿Dónde reaccionó históricamente el precio?" },
            { tf: "H1", action: "Espera que el precio llegue a una zona H4. ¿Hay un setup en el sentido de la tendencia Daily?" },
            { tf: "M15", action: "Busca la señal de disparo: rechazo, engulfing, pin bar en la zona H4." },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
              <span className="text-xs font-bold text-blue-400 shrink-0 mt-0.5 w-6">{item.tf}</span>
              <p className="text-sm text-zinc-300 leading-relaxed">{item.action}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
          <p className="text-sm text-zinc-400 leading-relaxed">
            <span className="text-white font-medium">Regla absoluta:</span> si el Daily es alcista y el H1 muestra una señal de venta, no entras en venta. Esperas la próxima señal de compra alineada.
          </p>
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3">Cómo analizar en 5 segundos</p>
        <h2 className="text-lg font-semibold text-white mb-4">Verificar el alineamiento de los timeframes</h2>
        <div className="space-y-2">
          {[
            { n: "1", t: "Daily — ¿cuál es la tendencia?", d: "Alcista = busca compras. Bajista = busca ventas. Range = sin trade direccional." },
            { n: "2", t: "H4 — ¿el precio está en una zona clave?", d: "Soporte en tendencia alcista = potencial compra. Resistencia en tendencia bajista = potencial venta. Si no → espera." },
            { n: "3", t: "M15 — ¿hay una señal?", d: "Pin bar, engulfing en el sentido del Daily sobre la zona H4 = entrada. Si la señal va contra el Daily → ignora." },
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
        <h2 className="text-lg font-semibold text-white mb-4">Según el alineamiento de los timeframes</h2>
        <div className="space-y-2.5">
          <div className="flex items-start gap-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <span className="text-lg">✓</span>
            <div>
              <p className="text-sm font-semibold text-emerald-400">Daily + H4 + M15 alineados</p>
              <p className="text-xs text-zinc-400 mt-0.5">Entras. Es el setup de alta probabilidad. Sesgo Daily confirmado por zona H4, señal M15 en el mismo sentido.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-amber-400/5 border border-amber-400/15 rounded-xl px-4 py-3">
            <span className="text-lg">~</span>
            <div>
              <p className="text-sm font-semibold text-amber-400">Daily alineado, H4 todavía no en zona</p>
              <p className="text-xs text-zinc-400 mt-0.5">Todavía no entras. Esperas que el precio vuelva a una zona H4 en el sentido del Daily. La paciencia es una posición.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
            <span className="text-lg">✗</span>
            <div>
              <p className="text-sm font-semibold text-red-400">Señal M15 contra el Daily</p>
              <p className="text-xs text-zinc-400 mt-0.5">Ignoras. El timeframe chico que va contra el grande es un retroceso — no un reversal. Nunca tradees contra el sesgo Daily.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border border-red-500/20 bg-red-500/5 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">Error clásico</p>
        <p className="text-sm font-semibold text-white mb-2">Entrar en una señal M15 sin verificar el Daily</p>
        <p className="text-sm text-zinc-300 leading-relaxed">
          Miras EUR/USD en M15. Ves un engulfing bajista lindo. Vendes. Excepto que el Daily es alcista y el precio está en un soporte H4. Acabas de entrar exactamente a contracorriente. El precio retoma al alza y pierdes. La regla: antes de cualquier señal, siempre mirar el Daily primero. Siempre.
        </p>
      </section>

      <div className="border border-zinc-700/40 rounded-2xl p-5 bg-zinc-900/30">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Resumen en 3 segundos</p>
        <div className="space-y-2 text-sm">
          <p className="text-zinc-200"><span className="text-emerald-400 font-bold mr-2">✔</span>Daily + H4 + M15 alineados → entras</p>
          <p className="text-zinc-200"><span className="text-amber-400 font-bold mr-2">~</span>Daily claro, H4 todavía no en zona → esperas</p>
          <p className="text-zinc-500"><span className="text-red-400 font-bold mr-2">✖</span>Señal M15 contra el Daily → ignoras</p>
        </div>
      </div>

      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Repaso</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <LessonKeyPoints
        points={[
          "Siempre analizar del timeframe grande al chico — el Daily define el sesgo, el M15 afina la entrada.",
          "Una señal en el timeframe chico que contradice el grande hay que ignorarla.",
          "Weekly/Daily = contexto y tendencia. H4 = zonas. H1/M15 = timing y señal.",
          "Los 3 timeframes deben contar la misma historia para que un setup sea de alta probabilidad.",
          "Mientras más bajas en los timeframes, más ganas precisión — pero el sesgo siempre viene del grande.",
        ]}
      />

      <LessonExercice
        description="En TradingView, realiza un análisis top-down completo en EUR/USD."
        steps={[
          "Abre EUR/USD en Daily — ¿cuál es la tendencia? ¿Alcista, bajista o range? Anota tu sesgo.",
          "Baja a H4 — identifica las 2 zonas más importantes (soporte o resistencia según la tendencia). Anota los precios exactos.",
          "Baja a H1 — ¿el precio está cerca de una de esas zonas H4? ¿Hay una señal naciente en el sentido del Daily?",
          "Baja a M15 — si la señal H1 está presente, ¿el M15 la confirma? Anota si los 3 timeframes se alinean o se contradicen.",
        ]}
      />

      <LessonQuiz
        question="EUR/USD es claramente alcista en Daily. Pasas a H1 y ves un engulfing bajista nítido en una resistencia H1. ¿Qué haces?"
        options={[
          "Tomas el Short en H1 — la señal es limpia y reciente",
          "Ignoras la señal H1 — va contra la tendencia Daily, esperas una señal de compra alineada",
          "Esperas que el Daily vuelva a la baja para confirmar antes de entrar",
          "Tomas el Short pero con una posición la mitad para limitar el riesgo",
        ]}
        correctIndex={1}
        explanation="En análisis multi-timeframe, el timeframe grande siempre prima. Si el Daily es alcista, buscas compras — no ventas. La señal H1 bajista probablemente es un retroceso en la tendencia Daily alcista — exactamente donde podrías buscar un Long."
        answerExplanations={[
          "Falso. Tradear una señal H1 contra una tendencia Daily fuerte es estadísticamente desfavorable. Vas a contracorriente de la dirección dominante — aunque la señal técnica parezca limpia.",
          "Correcto. La regla top-down es clara: el Daily define el sesgo. Si Daily = alcista, solo buscas compras. La señal H1 bajista significa que el precio está en retroceso. Es justamente donde buscas una compra — no una venta.",
          "Parcialmente válido pero demasiado conservador. Esperar que el Daily se invierta es un enfoque muy lento. En la práctica, una señal H1 bajista en una tendencia Daily alcista es un retroceso temporal, no una señal de reversal.",
          "Falso. Reducir el tamaño no cambia el problema fundamental: tradeas contra la tendencia dominante. El tamaño de posición gestiona el riesgo — no compensa una mala dirección.",
        ]}
      />

    </LessonPage>
  );
}
