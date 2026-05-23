import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { Candle } from "@/app/components/charts/Candle";
import { SupportResistance } from "@/app/components/charts/SupportResistance";

export default function ContentEs() {
  return (
    <LessonPage
      formationId="intermediaire"
      lessonId="lecon2"
      title="Zonas clave — Soporte y Resistencia"
      subtitle="Las zonas clave son los niveles donde el precio ya se detuvo. Son los únicos lugares donde debes tradear — el resto es ruido."
      duration="22 min"
      lessonNumber={2}
      prev={{ href: "/formations/intermediaire/lecon1", label: "Lección 1 — Estructura" }}
      next={{ href: "/formations/intermediaire/lecon3", label: "Lección 3 — Supply & Demand" }}
    >

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Lo que debes ver en el gráfico</p>
        <h2 className="text-lg font-semibold text-white mb-4">Identificar las zonas de un vistazo</h2>
        <div className="space-y-3">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-emerald-400 mb-2">Zona de soporte</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Ves al precio bajar, llegar a un nivel, rebotar hacia arriba. Bajar de nuevo, llegar al mismo nivel, rebotar otra vez. <strong className="text-white">Ese nivel repetido = zona de soporte.</strong> Los compradores defienden ese piso.
            </p>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-red-400 mb-2">Zona de resistencia</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              El precio sube, llega a un nivel, es empujado hacia abajo. Sube de nuevo, llega al mismo nivel, rechazado otra vez. <strong className="text-white">Ese techo repetido = zona de resistencia.</strong> Los vendedores defienden esa cima.
            </p>
          </div>
        </div>
        <div className="mt-3 bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-3 py-2">
          <p className="text-xs text-zinc-400"><span className="text-white font-medium">Clave:</span> son <span className="text-white font-medium">zonas</span> (rectángulos), no líneas. El precio nunca respeta un nivel a la vela exacta.</p>
        </div>
      </section>

      <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
        <SupportResistance supportPrice="1.0800" resistancePrice="1.0950" />
        <div className="flex justify-around items-start pt-1 border-t border-zinc-800/50">
          <Candle type="pin-bull" label="Rechazo soporte" caption="Pin bar alcista" />
          <div className="flex flex-col items-center justify-center gap-1 mt-8">
            <p className="text-[10px] text-zinc-600 font-mono text-center leading-relaxed">Señal<br/>→ entrada<br/>+ SL bajo zona</p>
          </div>
          <Candle type="pin-bear" label="Rechazo resistencia" caption="Pin bar bajista" />
        </div>
      </div>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Polaridad — cuando el rol se invierte</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Cuando un soporte se rompe con convicción, se vuelve resistencia. Cuando una resistencia se rompe, se vuelve soporte. Es una de las dinámicas más fiables del mercado.
        </p>
        <div className="space-y-2.5">
          <div className="bg-zinc-800/50 rounded-xl px-4 py-3">
            <p className="text-sm font-medium text-white mb-1">Escenario real — EUR/USD</p>
            <p className="text-xs text-zinc-500 leading-relaxed">
              EUR/USD rebota 3× en 1.0800 (soporte). Después el precio rompe 1.0800 con una gran vela bajista. Luego sube a testear 1.0800 → esa zona era un soporte, ahora se vuelve resistencia. Puedes vender ahí con un SL arriba.
            </p>
          </div>
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-medium text-emerald-400 mb-1">Sentido opuesto</p>
            <p className="text-xs text-zinc-400">Resistencia rota → se vuelve soporte. El precio rompe 1.0950, pullback a 1.0950 → zona de compra. Los antiguos vendedores quedan atrapados, los compradores retoman el control.</p>
          </div>
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Order Blocks — donde actuaron las instituciones</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Un Order Block (OB) es la última vela de dirección opuesta antes de un movimiento impulsivo. Es donde una institución colocó una orden grande. El precio suele volver ahí para completar la ejecución.
        </p>
        <div className="space-y-2.5 mb-3">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-medium text-emerald-400 mb-1">Bullish OB</p>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Ves una vela roja, luego una explosión alcista. La vela roja = el OB bullish. Cuando el precio vuelve a esa zona roja, busca una compra.
            </p>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-medium text-red-400 mb-1">Bearish OB</p>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Ves una vela verde, luego una explosión bajista. La vela verde = el OB bearish. Cuando el precio sube a esa zona verde, busca una venta.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3">Cómo analizar en 5 segundos</p>
        <h2 className="text-lg font-semibold text-white mb-4">Encontrar las zonas importantes rápido</h2>
        <div className="space-y-2">
          {[
            { n: "1", t: "Busca los mínimos alineados en el gráfico", d: "Varios mínimos al mismo nivel = zona de soporte. Marca un rectángulo que los englobe." },
            { n: "2", t: "Busca los máximos alineados", d: "Varios máximos al mismo nivel = zona de resistencia. Marca un rectángulo horizontal." },
            { n: "3", t: "Anota si una zona cambió de rol", d: "Un soporte roto + pullback en ese nivel = venta. Una resistencia rota + pullback = compra." },
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
        <h2 className="text-lg font-semibold text-white mb-4">La lógica del trader en las zonas</h2>
        <div className="space-y-2.5">
          <div className="flex items-start gap-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <span className="text-lg">↑</span>
            <div>
              <p className="text-sm font-semibold text-emerald-400">El precio llega a un soporte</p>
              <p className="text-xs text-zinc-400 mt-0.5">Esperas una señal de rechazo (pin bar, engulfing alcista). Si la señal está + la tendencia es alcista → compra con SL bajo la zona.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
            <span className="text-lg">↓</span>
            <div>
              <p className="text-sm font-semibold text-red-400">El precio llega a una resistencia</p>
              <p className="text-xs text-zinc-400 mt-0.5">Esperas un rechazo (mecha alta, engulfing bajista). Si la señal está + la tendencia es bajista → venta con SL encima de la zona.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-zinc-800/40 border border-zinc-700/40 rounded-xl px-4 py-3">
            <span className="text-lg">—</span>
            <div>
              <p className="text-sm font-semibold text-zinc-300">Precio en medio entre dos zonas</p>
              <p className="text-xs text-zinc-400 mt-0.5">Nada que hacer. Nunca entras en medio del range. Esperas que el precio llegue a una zona clave.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border border-red-500/20 bg-red-500/5 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">Error clásico</p>
        <p className="text-sm font-semibold text-white mb-2">Trazar una línea en vez de una zona</p>
        <p className="text-sm text-zinc-300 leading-relaxed">
          Trazas una línea exacta a 1.0800 y colocas tu SL a 1.0798. El precio baja a 1.0796, activa tu SL, y luego sube. El problema: el precio nunca es exacto. Hay que trazar una zona de 10-20 pips de grosor y colocar el SL bajo la zona entera — no bajo la línea.
        </p>
      </section>

      <div className="border border-zinc-700/40 rounded-2xl p-5 bg-zinc-900/30">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Resumen en 3 segundos</p>
        <div className="space-y-2 text-sm">
          <p className="text-zinc-200"><span className="text-emerald-400 font-bold mr-2">✔</span>Precio en soporte + señal de rechazo → compras</p>
          <p className="text-zinc-200"><span className="text-emerald-400 font-bold mr-2">✔</span>Precio en resistencia + señal de rechazo → vendes</p>
          <p className="text-zinc-500"><span className="text-red-400 font-bold mr-2">✖</span>Precio entre dos zonas → no haces nada</p>
        </div>
      </div>

      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Repaso</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <LessonKeyPoints
        points={[
          "Soporte = zona donde los compradores empujaron la bajada varias veces.",
          "Resistencia = zona donde los vendedores empujaron la subida varias veces.",
          "Polaridad: soporte roto → resistencia. Resistencia rota → soporte.",
          "Order Block = última vela opuesta antes de un movimiento impulsivo — zona institucional.",
          "Nunca tradees en el medio — siempre espera que un precio llegue a una zona clave.",
        ]}
      />

      <LessonExercice
        description="En TradingView, abre EUR/USD en H4 y marca tus zonas."
        steps={[
          "Identifica 2 zonas de soporte: marca rectángulos horizontales sobre los mínimos alineados. Dales grosor (10-20 pips mínimo).",
          "Identifica 2 zonas de resistencia: haz lo mismo sobre los máximos alineados.",
          "Verifica la polaridad: ¿hay un nivel que cambió de rol recientemente? ¿Soporte vuelto resistencia?",
          "Identifica un Order Block reciente: la última vela de dirección opuesta antes del último gran movimiento. Anota el nivel exacto.",
        ]}
      />

      <LessonQuiz
        question="EUR/USD rebotaba en 1.0800 desde hace 3 semanas. El precio acaba de romper 1.0800 a la baja con una gran vela bajista. Ahora sube hacia 1.0800. ¿Qué haces?"
        options={[
          "Compras — 1.0800 es un soporte histórico fuerte",
          "Vendes en 1.0800 — el viejo soporte se vuelve resistencia por polaridad",
          "No haces nada — el nivel es muy conocido, no va a funcionar",
          "Esperas que el precio vuelva a pasar arriba de 1.0800 para confirmar",
        ]}
        correctIndex={1}
        explanation="Es la polaridad en acción. 1.0800 era un soporte. Se rompió con convicción. Ahora que el precio vuelve a testear ese nivel, se comporta como una resistencia. Vendes en el pullback con SL arriba de 1.0800."
        answerExplanations={[
          "Falso. 1.0800 era un soporte, pero se rompió. Una vez roto, un soporte ya no cumple su rol de comprador — se invierte en resistencia. Comprar acá es ignorar la polaridad.",
          "Correcto. La polaridad es uno de los comportamientos más fiables del mercado. 1.0800 roto → se vuelve resistencia. El pullback en ese nivel es una oportunidad de venta con un SL lógico encima.",
          "Falso. Los niveles muy conocidos suelen funcionar mejor, no peor — es ahí donde se concentran las órdenes. La popularidad de un nivel no es razón para ignorarlo.",
          "Falso. Esperar que el precio vuelva arriba para confirmar es perder la entrada. La señal de venta es el retorno a 1.0800 con un rechazo — no la ruptura al alza.",
        ]}
      />

    </LessonPage>
  );
}
