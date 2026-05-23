import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { StopHuntInteractive } from "@/app/components/charts/StopHuntInteractive";

export default function ContentEs() {
  return (
    <LessonPage
      formationId="avance"
      lessonId="lecon6"
      title="Stop Hunts — la cacería de stops"
      subtitle="Los stop hunts no son manipulación ilegal — son una mecánica estructural del mercado. Aprender a leerlos te transforma de víctima en observador atento."
      duration="22 min"
      lessonNumber={6}
      prev={{ href: "/formations/avance/lecon5", label: "Lección 5 — OTE" }}
      next={{ href: "/formations/avance/lecon7", label: "Lección 7 — Entradas de precisión" }}
    >

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">La mecánica del Stop Hunt</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Un stop hunt ocurre cuando el precio rebasa brevemente un nivel clave — soporte, resistencia, Equal High o Equal Low — solo para disparar los stops de los traders posicionados en ese nivel. Una vez ejecutados los stops, el precio regresa de inmediato en dirección opuesta.
        </p>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          No es una conspiración. Es una mecánica natural: los stops de los traders retail constituyen <span className="text-white font-medium">pools de liquidity</span> que las instituciones deben consumir para ejecutar sus propias órdenes masivas.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
            <p className="font-semibold text-red-400 text-sm mb-2">Stop Hunt en resistencia (BSL)</p>
            <p className="text-xs text-zinc-400 leading-relaxed">El precio sube por encima de una resistencia o EQH, dispara los stops de los shorts, y luego regresa bajo la resistencia. Las instituciones venden en ese spike alcista.</p>
          </div>
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
            <p className="font-semibold text-emerald-400 text-sm mb-2">Stop Hunt en soporte (SSL)</p>
            <p className="text-xs text-zinc-400 leading-relaxed">El precio baja debajo de un soporte o EQL, dispara los stops de los longs, y luego sube por encima del soporte. Las instituciones compran en ese spike bajista.</p>
          </div>
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Reconocer un Stop Hunt en tiempo real</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Varias señales permiten identificar un stop hunt antes o durante su formación.
        </p>
        <div className="space-y-2.5">
          {[
            {
              label: "Mecha larga que rebasa un nivel evidente",
              detail: "Una vela con mecha que perfora una resistencia o un soporte visible para todos — es la señal de que los stops fueron cazados.",
            },
            {
              label: "Cierre del otro lado del nivel",
              detail: "La vela perfora el nivel pero cierra del lado opuesto. Eso confirma que la penetración fue temporal (stop hunt), no una verdadera ruptura.",
            },
            {
              label: "Retroceso brutal y rápido",
              detail: "Tras el spike, el precio se va con violencia en el otro sentido. Ese movimiento está alimentado por las posiciones de las instituciones que acaban de obtener su liquidity.",
            },
            {
              label: "Niveles a evitar: EQH y EQL",
              detail: "Equal Highs y Equal Lows son los blancos favoritos de los stop hunts. Dos o tres máximos/mínimos al mismo nivel = acumulación de stops = blanco evidente.",
            },
          ].map((r, i) => (
            <div key={i} className="flex items-start gap-3 bg-zinc-800/40 rounded-xl px-4 py-3">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-blue-400 shrink-0 mt-0.5">
                <path d="M7 2v5M7 10v1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.4" />
              </svg>
              <div>
                <p className="text-sm font-medium text-white">{r.label}</p>
                <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{r.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Tradear DESPUÉS del Stop Hunt</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Un stop hunt confirmado es uno de los setups más potentes en Smart Money. Entras después de la cacería — en el sentido del retroceso institucional.
        </p>
        <div className="space-y-2">
          {[
            { step: "1", text: "Identifica un nivel con acumulación de stops: EQH, EQL, resistencia o soporte evidente." },
            { step: "2", text: "Espera que el precio haga spike más allá del nivel pero no cierre del lado opuesto." },
            { step: "3", text: "Confirma el retroceso: vela de rechazo (pin bar, engulfing) que regresa a la zona." },
            { step: "4", text: "Entra en el sentido del retroceso. SL más allá del pico del spike. TP hacia el nivel de liquidity opuesto." },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
              <span className="text-xs font-bold text-emerald-400 shrink-0 mt-0.5 w-4">{item.step}</span>
              <p className="text-sm text-zinc-300 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
          <p className="text-sm text-zinc-400 leading-relaxed">
            <span className="text-white font-medium">Ventaja:</span> al entrar después del stop hunt, tienes un SL muy ajustado (justo más allá del spike) para un TP potencialmente amplio (el mercado acaba de posicionarse institucionalmente).
          </p>
        </div>
      </section>

      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-widest">Pon a prueba tu instinto — frente a un stop hunt</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
        <StopHuntInteractive locale="es" />
      </div>

      {/* ¿Y TÚ, RETAIL? */}
      <div className="border border-emerald-500/20 bg-emerald-500/5 rounded-xl p-6 my-8">
        <p className="text-emerald-400 uppercase tracking-widest text-xs font-bold mb-4">¿Y TÚ, RETAIL?</p>
        <div className="text-zinc-300 leading-relaxed space-y-3">
          <p>
            Martes en la noche, 20h. Capital 700€. Tienes 30 minutos antes de cenar. Abres tu chart XAU/USD H1. Ves una resistencia que ya fue testeada 3 veces estas últimas semanas en 4 650$. Una zona demasiado evidente. Exactamente el tipo de nivel donde las instituciones saben que hay liquidity arriba de los highs.
          </p>
          <p>
            Una vela H1 hace spike hasta 4 670$, con una larga mecha por encima de la resistencia, y luego cierra debajo de los 4 650$. La vela siguiente es bearish y confirma el rechazo. La BSL acaba de ser tomada. Los stops de los vendedores saltaron, la liquidity fue recuperada y el mercado se niega a aguantar arriba de la zona. La trampa terminó.
          </p>
          <p>
            En concreto: entrada short a 4 645$, SL en 4 680$ por encima del spike, TP en 4 580$ hacia la próxima liquidity baja. Arriesgas 21€ (3% de 700€, adaptado a tu capital), puedes ganar unos 39€. Cierras tu chart, te vas a cenar. Lo revisarás antes de dormir.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Revisión</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <LessonKeyPoints
        points={[
          "Un stop hunt: spike rápido más allá de un nivel clave → disparo de stops → retroceso brutal.",
          "Los EQH y EQL son los blancos favoritos de los stop hunts — desconfía de los niveles 'demasiado evidentes'.",
          "Señal: mecha larga que perfora un nivel + cierre del lado opuesto + retroceso violento.",
          "Nunca sigas la mecha de un spike — espera la confirmación del retroceso antes de entrar.",
          "Después de un stop hunt confirmado: SL ajustado más allá del pico, TP hacia la liquidity opuesta.",
        ]}
      />

      <LessonExercice
        description="Sal a cazar stop hunts en los gráficos recientes."
        steps={[
          "En EUR/USD en H1, identifica Equal Highs o Equal Lows de las 2 últimas semanas.",
          "Para cada nivel, verifica: ¿hubo un spike más allá seguido de un retroceso rápido?",
          "Si sí, mide la amplitud del retroceso tras el stop hunt. ¿El movimiento fue significativo?",
          "Practica colocando mentalmente una entrada: ¿dónde habría sido tu entrada, SL y TP en ese stop hunt?",
        ]}
      />

      <LessonQuiz
        question="El precio sube brevemente por encima de una resistencia mayor (Equal Highs) y luego cierra de inmediato debajo, con una mecha superior larga. ¿Qué haces?"
        options={[
          "Compras en breakout — el precio claramente rebasó la resistencia",
          "Ignoras — ese movimiento es demasiado ambiguo para sacar una conclusión",
          "Vigilas una señal de retroceso bajista — probablemente es un stop hunt sobre la BSL",
          "Colocas una orden de compra arriba del pico del spike para seguir el momentum",
        ]}
        correctIndex={2}
        explanation="Un spike por encima de los Equal Highs con cierre por debajo es la firma de un stop hunt sobre la Buy-side Liquidity (BSL). Las instituciones acaban de tomar la liquidity de los stops de los shorts. El retroceso bajista que sigue está alimentado por las ventas institucionales — ahí es donde se busca una señal de venta."
        answerExplanations={[
          "Falso. El cierre debajo de la resistencia invalida la ruptura. No es un breakout — es precisamente un false breakout (stop hunt). Comprar aquí es posicionarte del lado equivocado del movimiento institucional.",
          "Falso. No es ambiguo para alguien que conoce los stop hunts. La firma es clara: spike + mecha larga + cierre del lado opuesto. Es una señal de alerta, no una situación neutra.",
          "Correcto. Un spike en los EQH con regreso debajo de la resistencia = stop hunt sobre la BSL. Las instituciones vendieron en ese spike. La probabilidad de una continuación bajista es alta — vigila un engulfing o pin bar bajista para entrar.",
          "Falso. Colocar una orden por encima del spike es esperar que la ruptura sea real. Pero la señal es exactamente la opuesta: el precio rechazó ese nivel con fuerza. Te dispondrías a entrar en la dirección del stop hunt, no en la dirección institucional.",
        ]}
      />

    </LessonPage>
  );
}
