import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { MarketStructureDiagram } from "@/app/components/charts/MarketStructureDiagram";
import { BOSDiagram } from "@/app/components/charts/BOSDiagram";
import { CHoCHDiagram } from "@/app/components/charts/CHoCHDiagram";

export default function ContentEs() {
  return (
    <LessonPage
      formationId="intermediaire"
      lessonId="lecon1"
      title="Estructura de mercado. BOS y CHoCH"
      subtitle="Antes de identificar una entrada, debes saber en qué dirección evoluciona el mercado. La estructura es tu brújula. Sin ella, tradeas a ciegas."
      duration="20 min"
      lessonNumber={1}
      prev={null}
      next={{ href: "/formations/intermediaire/lecon2", label: "Lección 2 : Zonas clave" }}
    >

      {/* ── Lo que debes VER ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Lo que debes ver en el gráfico</p>
        <h2 className="text-lg font-semibold text-white mb-4">Leer la estructura mirando el gráfico</h2>
        <div className="space-y-3">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-emerald-400 mb-1">Tendencia alcista</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              El precio sube → forma un máximo → retrocede un poco → vuelve a partir más alto que el máximo anterior → forma un mínimo más alto que el anterior. Es <strong className="text-white">HH (Higher High) + HL (Higher Low)</strong>.
            </p>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-red-400 mb-1">Tendencia bajista</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              El precio baja → forma un mínimo → rebota un poco → vuelve a partir más bajo → forma un máximo más bajo. Es <strong className="text-white">LH (Lower High) + LL (Lower Low)</strong>.
            </p>
          </div>
          <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-zinc-300 mb-1">Range (consolidación)</p>
            <p className="text-sm text-zinc-400 leading-relaxed">
              El precio oscila entre dos niveles horizontales. Sin nuevos máximos ni mínimos significativos. Ningún bando domina.
            </p>
          </div>
        </div>
      </section>

      {/* ── Esquema visual ── */}
      <div className="border border-zinc-800 rounded-2xl p-5 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <MarketStructureDiagram trend="bullish" />
          <MarketStructureDiagram trend="bearish" />
        </div>
      </div>

      {/* ── BOS ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Break of Structure (BOS) : la tendencia confirma</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Un BOS es cuando el precio rompe el último máximo (en alcista) o el último mínimo (en bajista). Confirma que la tendencia sigue. Es una información, no una señal de entrada.
        </p>
        <div className="space-y-2.5">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-medium text-emerald-400 mb-1">BOS alcista</p>
            <p className="text-xs text-zinc-400">EUR/USD en tendencia alcista. El precio rompe arriba del último HH a 1.0950 → BOS confirmado. Sigues buscando compras en los retrocesos.</p>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-medium text-red-400 mb-1">BOS bajista</p>
            <p className="text-xs text-zinc-400">BTC en tendencia bajista. El precio rompe debajo del último LL a 42 000$ → BOS confirmado. Sigues buscando ventas en los rebotes.</p>
          </div>
        </div>
        <div className="mt-4">
          <BOSDiagram trend="bullish" />
        </div>
      </section>

      {/* ── CHoCH ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Change of Character (CHoCH) : la tendencia se quiebra</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          El CHoCH es la primera fisura en la estructura. En tendencia alcista, es cuando el precio rompe debajo del último Higher Low. Todavía no es un reversal confirmado, es una alerta.
        </p>
        <div className="space-y-2.5">
          <div className="bg-zinc-800/50 rounded-xl px-4 py-3">
            <p className="text-sm font-medium text-white mb-1">Escenario real</p>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Observas EUR/USD en H4 alcista. El precio forma HH a 1.0950, retrocede, luego rompe su último HL a 1.0880. Es un CHoCH bajista. Pasas a modo observación, ya no compras. Esperas un BOS bajista para confirmar el reversal.
            </p>
          </div>
          <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
            <p className="text-sm text-zinc-400">
              <span className="text-white font-medium">CHoCH → BOS opuesto = reversal confirmado.</span> Un CHoCH solo = simple alerta. Espera siempre la confirmación.
            </p>
          </div>
        </div>
        <div className="mt-4">
          <CHoCHDiagram trend="bullish" />
        </div>
      </section>

      {/* ── 5 segundos ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3">Cómo analizar en 5 segundos</p>
        <h2 className="text-lg font-semibold text-white mb-4">Leer la estructura rápido</h2>
        <div className="space-y-2">
          {[
            { n: "1", t: "Zoom hacia atrás en el Daily o H4", d: "Nunca empieces por el M15, perderías el contexto global." },
            { n: "2", t: "Marca los 3 últimos máximos y mínimos significativos", d: "Ignora las fluctuaciones chicas, solo cuentan los swings importantes." },
            { n: "3", t: "La dirección de los máximos/mínimos = tu tendencia", d: "Máximos y mínimos que suben → alcista. Que bajan → bajista. Estancados → range, no tradear." },
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
        <h2 className="text-lg font-semibold text-white mb-4">La lógica del trader</h2>
        <div className="space-y-2.5">
          <div className="flex items-start gap-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <span className="text-lg">↑</span>
            <div>
              <p className="text-sm font-semibold text-emerald-400">Tendencia alcista</p>
              <p className="text-xs text-zinc-400 mt-0.5">Buscas únicamente compras. Esperas un retroceso al último Higher Low para entrar.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
            <span className="text-lg">↓</span>
            <div>
              <p className="text-sm font-semibold text-red-400">Tendencia bajista</p>
              <p className="text-xs text-zinc-400 mt-0.5">Buscas únicamente ventas. Esperas un rebote al último Lower High para entrar.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-zinc-800/40 border border-zinc-700/40 rounded-xl px-4 py-3">
            <span className="text-lg">—</span>
            <div>
              <p className="text-sm font-semibold text-zinc-300">Range / Sin estructura clara</p>
              <p className="text-xs text-zinc-400 mt-0.5">No haces nada. Sin tendencia definida no hay trade. Espera que la estructura se aclare.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Error clásico ── */}
      <section className="border border-red-500/20 bg-red-500/5 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">Error clásico</p>
        <p className="text-sm font-semibold text-white mb-2">Entrar en el BOS en vez de esperar el retorno a la estructura</p>
        <p className="text-sm text-zinc-300 leading-relaxed">
          Ves al precio romper un nuevo High → compras inmediatamente. Pero suele ser el momento en que el mercado retrocede. El buen timing es esperar que el precio vuelva al último HL, no comprar el breakout. Entrar en el BOS = pagar caro con un mal ratio R/R.
        </p>
      </section>

      {/* ── Resumen ultra-rápido ── */}
      <div className="border border-zinc-700/40 rounded-2xl p-5 bg-zinc-900/30">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Resumen en 3 segundos</p>
        <div className="space-y-2 text-sm">
          <p className="text-zinc-200"><span className="text-emerald-400 font-bold mr-2">✔</span>HH + HL → tendencia alcista → compras en los HL</p>
          <p className="text-zinc-200"><span className="text-emerald-400 font-bold mr-2">✔</span>LH + LL → tendencia bajista → vendes en los LH</p>
          <p className="text-zinc-500"><span className="text-red-400 font-bold mr-2">✖</span>Sin estructura clara → range → no haces nada</p>
        </div>
      </div>

      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Repaso</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <LessonKeyPoints
        points={[
          "HH + HL = tendencia alcista. LH + LL = tendencia bajista. Estancado = range.",
          "BOS = el precio rompe un máximo/mínimo previo → la tendencia sigue.",
          "CHoCH = primera señal de reversal → alerta, todavía no un trade.",
          "CHoCH + BOS opuesto = reversal confirmado.",
          "En range, no tradeas, esperas una estructura clara.",
        ]}
      />

      <LessonExercice
        description="Abre EUR/USD en H4 en TradingView. Analiza la estructura ahora."
        steps={[
          "Zoom hacia atrás para ver los 3 últimos meses. Marca los 4 últimos máximos y mínimos significativos.",
          "Clasifica cada máximo: ¿HH o LH? Cada mínimo: ¿HL o LL? Anota la secuencia.",
          "Identifica el último BOS: ¿a qué nivel rompió el precio? ¿En qué sentido?",
          "¿Hubo un CHoCH reciente? ¿La estructura cambió de carácter estas últimas 2 semanas?",
        ]}
      />

      <LessonQuiz
        question="Miras EUR/USD en H4. El precio está en tendencia alcista (HH/HL). Acaba de romper debajo del último Higher Low a 1.0820. ¿Qué significa?"
        options={[
          "La tendencia alcista está confirmada, es un buen momento para comprar ahora",
          "Es un CHoCH, la estructura alcista está fragilizada, pasas a observación",
          "La tendencia bajista es oficial, entras en short inmediatamente",
          "Es una información neutra, ninguna acción a tomar",
        ]}
        correctIndex={1}
        explanation="Romper el último Higher Low en tendencia alcista es la definición del CHoCH. La estructura alcista está comprometida. Ya no buscas compras, observas si un BOS bajista confirma el reversal."
        answerExplanations={[
          "Falso. Romper el último HL es lo opuesto de una señal de compra. Es la primera ruptura de la estructura alcista, no debes comprar ahora.",
          "Correcto. CHoCH = Change of Character. La estructura alcista está fragilizada. Pasas a modo observación y esperas un BOS bajista para confirmar el reversal antes de entrar en short.",
          "Falso. Un CHoCH solo no confirma un reversal. Hace falta un BOS bajista (ruptura del último LL) para oficializar la nueva tendencia. Entrar en short inmediatamente es anticipar sin confirmación.",
          "Falso. Un CHoCH es una información muy importante, es la primera señal de que el contexto cambia. Ignorarlo es perderte un aviso mayor del mercado.",
        ]}
      />

    </LessonPage>
  );
}
