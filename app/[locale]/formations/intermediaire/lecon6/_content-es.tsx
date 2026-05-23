import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { Candle } from "@/app/components/charts/Candle";
import { GraphFakeBreakout } from "@/app/components/charts/GraphFakeBreakout";

export default function ContentEs() {
  return (
    <LessonPage
      formationId="intermediaire"
      lessonId="lecon6"
      title="Fake Breakout — no caer en la trampa"
      subtitle="El precio rompe un nivel, entras en el sentido de la ruptura — y el precio vuelve inmediatamente en el otro sentido. Esta trampa pasa varias veces por semana. Acá tienes cómo reconocerla e incluso tradearla."
      duration="18 min"
      lessonNumber={6}
      prev={{ href: "/formations/intermediaire/lecon5", label: "Lección 5 — Confluencias" }}
      next={{ href: "/formations/intermediaire/lecon7", label: "Lección 7 — Multi-Timeframe" }}
    >

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Lo que debes ver en el gráfico</p>
        <h2 className="text-lg font-semibold text-white mb-4">Cómo se ve un fake breakout</h2>
        <div className="space-y-3">
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-red-400 mb-2">Fake breakout alcista (trampa a compradores)</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Miras EUR/USD. El precio se acerca a una resistencia a 1.0950. Perfora encima → 1.0960, 1.0965. Ves compradores entrar. Después el precio vuelve violentamente bajo 1.0950. La vela H1 tiene una mecha alta larga y cierra <strong className="text-white">bajo la resistencia</strong>. Los compradores quedan atrapados.
            </p>
          </div>
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-emerald-400 mb-2">Fake breakout bajista (trampa a vendedores)</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              El precio perfora bajo un soporte a 1.0850 → baja a 1.0840. Los vendedores entran. El precio sube violentamente y cierra <strong className="text-white">encima del soporte</strong>. Mecha baja larga visible. Los vendedores quedan atrapados.
            </p>
          </div>
        </div>
      </section>

      <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
        <GraphFakeBreakout />
        <div className="flex justify-center pt-1 border-t border-zinc-800/50">
          <Candle
            type="pin-bear"
            label="La vela trampa"
            caption="Mecha alta + cierre bajo la resistencia"
          />
        </div>
      </div>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Por qué pasan los fake breakouts</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Los niveles obvios concentran naturalmente órdenes. Encima de una resistencia → stops de compradores en short + órdenes de entrada de compradores breakout. El mercado va a buscar esa liquidity, activa todas esas órdenes, y luego retoma en el otro sentido.
        </p>
        <div className="space-y-2.5">
          <div className="bg-zinc-800/50 rounded-xl px-4 py-3">
            <p className="text-sm font-medium text-white mb-1">Lo que pasa</p>
            <p className="text-xs text-zinc-500 leading-relaxed">
              El precio sube, activa las órdenes de compra encima de la resistencia. Esas compras suben ligeramente. Pero no hay suficiente momentum para seguir. El precio vuelve abajo — y los compradores que siguieron la ruptura están ahora en pérdida.
            </p>
          </div>
          <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
            <p className="text-sm text-zinc-400">
              <span className="text-white font-medium">Regla clave:</span> mientras más obvio y conocido es un nivel, más alto el riesgo de fake breakout. Cuidado con las rupturas &quot;muy lindas&quot;.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Cómo reconocer un fake breakout</h2>
        <div className="space-y-2.5">
          {[
            { label: "La vela cierra del otro lado del nivel", detail: "Señal principal. El precio perfora el nivel pero el cierre queda del otro lado → fake breakout. Espera siempre el cierre — nunca el intrabar." },
            { label: "Mecha larga en la dirección de la ruptura", detail: "Una mecha alta encima de una resistencia con cierre debajo = rechazo fuerte. Es la señal visual número 1 del fake breakout." },
            { label: "El retorno es rápido y agresivo", detail: "Después de un fake, el reversal es violento. El precio no duda — vuelve con momentum. Es en sí mismo una señal." },
            { label: "La tendencia de fondo contradice la ruptura", detail: "Ruptura alcista en una tendencia bajista fuerte = sospechoso. El mercado busca stops, no una verdadera dirección." },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-zinc-800/40 rounded-xl px-4 py-3">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-blue-400 shrink-0 mt-0.5">
                <path d="M7 2v5M7 10v1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.4" />
              </svg>
              <div>
                <p className="text-sm font-medium text-white">{item.label}</p>
                <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Tradear el fake breakout — el setup en sentido inverso</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Una vez identificado, puedes tradear el fake breakout en el sentido del reversal. Es uno de los setups más potentes: entras justo después de que los stops fueron barridos.
        </p>
        <div className="space-y-2">
          {[
            { step: "1", text: "EUR/USD resistencia a 1.0950. El precio sube a 1.0962 y luego vuelve.", color: "text-zinc-400" },
            { step: "2", text: "La vela H1 cierra DEBAJO de 1.0950. Mecha alta visible. Fake breakout confirmado.", color: "text-amber-400" },
            { step: "3", text: "Entras en short al cierre de esa vela. SL encima del pico (1.0965).", color: "text-emerald-400" },
            { step: "4", text: "TP hacia el próximo soporte (1.0880). R/R = 1:3. Los compradores atrapados alimentan la bajada.", color: "text-emerald-400" },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
              <span className={`text-xs font-bold shrink-0 mt-0.5 w-4 ${item.color}`}>{item.step}</span>
              <p className="text-sm text-zinc-300 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3">Cómo analizar en 5 segundos</p>
        <h2 className="text-lg font-semibold text-white mb-4">Verificar si una ruptura es real o falsa</h2>
        <div className="space-y-2">
          {[
            { n: "1", t: "Espera el cierre de la vela", d: "Regla absoluta. Nunca juzgues una ruptura en un precio intrabar. El cierre es el único juez." },
            { n: "2", t: "¿El cierre está del otro lado del nivel?", d: "Sí = potencialmente ruptura real. No (mecha larga + cierre del otro lado) = fake breakout." },
            { n: "3", t: "¿El reversal es violento?", d: "Retorno rápido y agresivo bajo el nivel = confirmación del fake. Puedes entrar en sentido inverso." },
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
        <h2 className="text-lg font-semibold text-white mb-4">Frente a una ruptura de nivel</h2>
        <div className="space-y-2.5">
          <div className="flex items-start gap-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <span className="text-lg">✓</span>
            <div>
              <p className="text-sm font-semibold text-emerald-400">Ruptura real (cierre franco más allá)</p>
              <p className="text-xs text-zinc-400 mt-0.5">Puedes seguir la ruptura con un SL del otro lado del nivel. Pero idealmente espera un pullback al nivel roto antes de entrar.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-amber-400/5 border border-amber-400/15 rounded-xl px-4 py-3">
            <span className="text-lg">!</span>
            <div>
              <p className="text-sm font-semibold text-amber-400">Fake breakout (mecha + cierre del otro lado)</p>
              <p className="text-xs text-zinc-400 mt-0.5">No sigas la ruptura. Puedes entrar en sentido inverso con SL más allá del pico, TP hacia el próximo nivel.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-zinc-800/40 border border-zinc-700/40 rounded-xl px-4 py-3">
            <span className="text-lg">—</span>
            <div>
              <p className="text-sm font-semibold text-zinc-300">Incertidumbre (vela todavía abierta)</p>
              <p className="text-xs text-zinc-400 mt-0.5">No haces nada. Nunca una decisión en una vela no cerrada. Espera.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border border-red-500/20 bg-red-500/5 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">Error clásico</p>
        <p className="text-sm font-semibold text-white mb-2">Entrar en la ruptura antes del cierre de la vela</p>
        <p className="text-sm text-zinc-300 leading-relaxed">
          El precio perfora la resistencia a 1.0950 → trepa a 1.0962 en intrabar. Compras inmediatamente &quot;para no perder el movimiento&quot;. La vela cierra a 1.0945 — debajo de la resistencia. Estás en short involuntariamente. La regla es simple: cierre de vela primero, decisión después.
        </p>
      </section>

      <div className="border border-zinc-700/40 rounded-2xl p-5 bg-zinc-900/30">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Resumen en 3 segundos</p>
        <div className="space-y-2 text-sm">
          <p className="text-zinc-200"><span className="text-emerald-400 font-bold mr-2">✔</span>Cierre franco ENCIMA del nivel → ruptura real → puedes seguir</p>
          <p className="text-zinc-200"><span className="text-emerald-400 font-bold mr-2">✔</span>Mecha + cierre DEBAJO → fake breakout → vendes en sentido inverso</p>
          <p className="text-zinc-500"><span className="text-red-400 font-bold mr-2">✖</span>Vela todavía abierta → siempre esperas el cierre</p>
        </div>
      </div>

      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Repaso</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <LessonKeyPoints
        points={[
          "Fake breakout = el precio perfora un nivel pero la vela cierra del otro lado.",
          "Señal visual: mecha larga más allá del nivel + cierre que queda del otro lado.",
          "Regla absoluta: esperar el cierre de vela antes de juzgar una ruptura.",
          "El fake breakout se tradea en sentido inverso: entrada al reversal, SL más allá del pico.",
          "Mientras más obvio sea un nivel, más alto el riesgo de fake breakout.",
        ]}
      />

      <LessonExercice
        description="En TradingView, abre EUR/USD en H1 y caza los fake breakouts recientes."
        steps={[
          "Identifica los 3 niveles de soporte y resistencia más visibles de las últimas 4 semanas.",
          "Para cada nivel, examina las velas que lo acercaron: ¿hay mechas que perforan el nivel con un cierre del otro lado?",
          "Para cada fake breakout encontrado, anota: ¿el precio se fue en la dirección opuesta? ¿En cuántas velas?",
          "Identifica el mejor fake breakout que hubieras podido tradear. Anota la entrada, el SL y el TP teóricos.",
        ]}
      />

      <LessonQuiz
        question="En EUR/USD H1, el precio sube y perfora la resistencia a 1.0950 durante la vela en curso. La vela todavía no cerró y muestra +18 pips encima del nivel. ¿Qué haces?"
        options={[
          "Compras inmediatamente — la ruptura está en curso y quieres estar en el movimiento",
          "Esperas el cierre de esa vela H1 antes de tomar una decisión",
          "Vendes — el precio subió muy rápido, es seguramente un fake",
          "Colocas una orden de compra justo encima de 1.0950 para la próxima vela",
        ]}
        correctIndex={1}
        explanation="La regla es absoluta: espera el cierre de la vela. El precio puede estar a +18 pips encima en intrabar y cerrar bajo la resistencia — es exactamente la definición de un fake breakout. Decidir antes del cierre es tradear en un precio provisorio."
        answerExplanations={[
          "Falso. La ruptura todavía no está confirmada. El precio puede volver bajo 1.0950 antes del cierre. Entrar ahora es reaccionar a un precio temporal. Si la vela cierra bajo 1.0950, estás en el sentido equivocado.",
          "Correcto. El cierre de vela es el único momento en que puedes juzgar una ruptura. Si cierra encima de 1.0950 → potencialmente ruptura real. Si cierra debajo → fake breakout. Esperas.",
          "Falso. +18 pips en una resistencia puede ser el inicio de una ruptura real — no necesariamente un fake. No puedes concluir &apos;fake breakout&apos; sin el cierre de la vela.",
          "Riesgoso. Colocar una orden limit justo encima de 1.0950 para la próxima vela es anticipar una continuación sin confirmación. Espera el cierre primero.",
        ]}
      />

    </LessonPage>
  );
}
