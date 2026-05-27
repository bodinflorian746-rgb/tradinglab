import { LessonTemplate } from "@/app/components/LessonTemplate";
import { StopLossChartDiagram } from "@/app/components/charts/StopLossChartDiagram";

// ── Esquema: Trade con SL y TP ───────────────────────────────────────────────
function StopLossDiagram() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
      <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-4 text-center">
        Bitcoin, trade Long con Stop Loss y Take Profit
      </p>
      <div className="max-w-xs mx-auto space-y-0">
        {/* Zone TP */}
        <div className="rounded-t-xl bg-emerald-500/10 border border-emerald-500/25 px-4 py-3.5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide mb-0.5">Take Profit</p>
            <p className="text-lg font-mono font-bold text-emerald-400">81 000 $</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-zinc-500 mb-0.5">Si el precio sube hasta acá</p>
            <p className="text-sm font-bold text-emerald-400">Variación +3 000 $</p>
          </div>
        </div>

        {/* Flechas */}
        <div className="flex items-center justify-center bg-zinc-900 border-x border-zinc-700 h-8 gap-8">
          <div className="flex items-center gap-1 text-[9px] text-emerald-400">
            <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
              <path d="M5 13V2M2 5L5 2l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Objetivo</span>
          </div>
          <div className="flex items-center gap-1 text-[9px] text-red-400">
            <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
              <path d="M5 1v11M2 9l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Protección</span>
          </div>
        </div>

        {/* Entrada */}
        <div className="bg-zinc-800 border-x border-zinc-700 px-4 py-3.5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-white uppercase tracking-wide mb-0.5">Entrada</p>
            <p className="text-lg font-mono font-bold text-white">78 000 $</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-zinc-500 mb-0.5">Precio de compra</p>
            <span className="text-xs font-mono text-zinc-400">R/R 1:2</span>
          </div>
        </div>

        {/* Zone SL */}
        <div className="rounded-b-xl bg-red-500/10 border border-red-500/25 px-4 py-3.5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-red-400 uppercase tracking-wide mb-0.5">Stop Loss</p>
            <p className="text-lg font-mono font-bold text-red-400">76 500 $</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-zinc-500 mb-0.5">Si el precio baja hasta acá</p>
            <p className="text-sm font-bold text-red-400">Variación −1 500 $</p>
          </div>
        </div>

        {/* Resumen */}
        <div className="mt-3 rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 text-center">
          <p className="text-[10px] text-zinc-400">
            Variación arriesgada <strong className="text-red-400">1 500 $</strong> · buscada <strong className="text-emerald-400">3 000 $</strong>
            <span className="text-zinc-600 mx-1.5">·</span>
            Ratio <strong className="text-white">1:2</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Esquema: con SL vs sin SL ────────────────────────────────────────────────
function WithWithoutSLDiagram() {
  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
        <p className="text-[10px] font-bold text-emerald-400 mb-2 uppercase tracking-wide">Con Stop Loss ✓</p>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-zinc-500">Compra</span>
            <span className="text-white font-mono">78 000 $</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">SL activado a</span>
            <span className="text-white font-mono">76 500 $</span>
          </div>
          <div className="h-px bg-zinc-700 my-1" />
          <div className="flex justify-between">
            <span className="text-zinc-500">Variación</span>
            <span className="text-red-400 font-bold">−1 500 $</span>
          </div>
          <p className="text-[9px] text-emerald-400/80 mt-1">Riesgo limitado y definido de antemano</p>
        </div>
      </div>
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3">
        <p className="text-[10px] font-bold text-red-400 mb-2 uppercase tracking-wide">Sin Stop Loss ✗</p>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-zinc-500">Compra</span>
            <span className="text-white font-mono">78 000 $</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Caída nocturna a</span>
            <span className="text-white font-mono">70 000 $</span>
          </div>
          <div className="h-px bg-zinc-700 my-1" />
          <div className="flex justify-between">
            <span className="text-zinc-500">Variación</span>
            <span className="text-red-400 font-bold">−8 000 $</span>
          </div>
          <p className="text-[9px] text-red-400/80 mt-1">Riesgo sin tope</p>
        </div>
      </div>
    </div>
  );
}

export default function ContentEs() {
  return (
    <LessonTemplate
      formationId="debutant"
      lessonId="lecon5"
      lessonNumber={5}
      duration="10 min"
      prev={{ href: "/formations/debutant/lecon4", label: "Lección 4 : Spread" }}
      next={{ href: "/formations/debutant/lecon6", label: "Lección 6 : Take Profit" }}
      title="El Stop Loss"
      hook="Sin Stop Loss, un solo trade puede arruinar meses de trabajo en pocos minutos. No porque analices mal, porque el mercado puede ir mucho más lejos de lo que imaginas, y nada te detiene. El Stop Loss es la regla más importante del trading."
      sections={[
        {
          title: "¿Qué es un Stop Loss?",
          content: "Un Stop Loss (SL) es una orden automática que cierra tu trade si el precio va demasiado lejos en la dirección equivocada. Lo defines antes de entrar al trade. Cuando el precio lo toca, tu posición se cierra sola, estés frente a la pantalla o no.",
          visual: <StopLossDiagram />,
          items: [
            "Trade Long (compra): tu SL se coloca DEBAJO de tu precio de entrada",
            "Trade Short (venta): tu SL se coloca ENCIMA de tu precio de entrada",
            "Cuando el precio toca el SL, el trade se cierra automáticamente",
            "Tu pérdida queda topeada y conocida de antemano, su monto exacto en dinero depende del tamaño de tu posición",
          ],
        },
        {
          title: "Variación de precio y tamaño de posición",
          content: "La variación de precio entre la entrada y el Stop Loss es idéntica para todos los traders en este trade. En este ejemplo, el mercado evoluciona 1 500 $ entre 78 000 $ y 76 500 $. Por otro lado, la ganancia o pérdida en dinero depende del tamaño de la posición usada (el lote). En exactamente el mismo movimiento de precio, un trader posicionado con 1 lote perderá 10× más que un trader posicionado con 0,1 lote, y 100× más que un trader posicionado con 0,01 lote. Dos traders pueden entonces tomar exactamente el mismo trade, con el mismo SL y el mismo TP, ganando o perdiendo montos totalmente diferentes. El cálculo preciso del tamaño de posición se ve en la Lección 8 (Money Management).",
          items: [
            "La variación de precio hasta el SL es idéntica para todos los traders en el trade",
            "La ganancia o pérdida en dinero depende del tamaño de tu posición, tu lote",
            "Mismo trade, mismo SL, mismo TP: con lotes diferentes, los montos ganados o perdidos son totalmente diferentes",
          ],
        },
        {
          title: "Ejemplo concreto : con y sin Stop Loss",
          content: "Caso 1, con Stop Loss: Entrada Bitcoin a 78 000 $, Stop Loss a 76 500 $. Durante la noche, el mercado cae brutalmente y el Stop Loss cierra automáticamente la posición cerca de 76 500 $. La variación de precio negativa se limita a unos 1 500 $: un riesgo definido de antemano y controlado. Caso 2, sin Stop Loss: misma entrada a 78 000 $, pero sin protección. En la noche, el mercado se derrumba hasta 70 000 $: la variación de precio negativa llega a 8 000 $, un riesgo sin tope. En ambos casos, el monto realmente perdido en dinero depende del tamaño de la posición. El Stop Loss no garantiza un trade ganador, garantiza sobre todo que una mala posición no se transforme en catástrofe.",
          visual: <WithWithoutSLDiagram />,
          items: [
            "Con SL: la pérdida está limitada y conocida de antemano desde la entrada",
            "Sin SL: la pérdida puede ser ilimitada, el mercado no espera a que estés listo",
            "Los traders sin SL piensan 'el precio va a volver', a veces sí, a veces no. El 'no' destruye la cuenta.",
          ],
        },
        {
          title: "¿Dónde colocar tu Stop Loss?",
          content: "Un buen SL no se coloca al azar. Se coloca en un lugar lógico del gráfico, ahí donde tu análisis sería claramente falso si el precio lo tocara.",
          visual: <StopLossChartDiagram />,
          items: [
            "Long: SL justo debajo del último punto bajo significativo (el soporte)",
            "Short: SL justo encima del último punto alto significativo (la resistencia)",
            "Ejemplo: compras en el rebote de un soporte a 78 000 $. El último punto bajo está a 77 200 $. Tu SL va a 77 000 $.",
            "Regla: si el precio toca mi SL, mi análisis era falso. La pérdida es normal.",
          ],
        },
      ]}
      errors={[
        "No poner SL 'para darle una chance al trade', es la causa #1 de cuentas destruidas en principiantes",
        "SL demasiado ajustado: 100 $ de SL en Bitcoin que fluctúa normalmente más de 1 000 $ por hora, vas a salir sin razón",
        "SL colocado al azar ('1 500 $ porque me parece bien'), el SL debe corresponder a un nivel lógico en el gráfico",
        "Olvidar colocar el SL al entrar pensando 'lo pongo después', y nunca ponerlo",
      ]}
      fatalError="Mover el Stop Loss en la dirección equivocada para evitar que te saque. Tu trade pierde, estás en −500 $. Alejas el SL para 'darle una chance'. El trade sigue perdiendo. Lo alejas más. Al final, pierdes 5 o 10 veces más de lo previsto. Este error, cometido bajo emoción, es responsable de la destrucción de miles de cuentas de traders principiantes."
      keyPoints={[
        "Stop Loss = orden automática que limita tu pérdida a un monto definido de antemano",
        "Long: SL debajo de la entrada. Short: SL encima de la entrada.",
        "Sin SL, tu pérdida es potencialmente ilimitada, es un riesgo inaceptable",
        "Coloca el SL en un lugar lógico del gráfico, no al azar",
        "NUNCA muevas el SL en el sentido de la pérdida, es el error fatal",
      ]}
      exerciseTitle="Identificar colocaciones lógicas de Stop Loss"
      exercise={[
        "En TradingView, abre Bitcoin (BTC/USD) en H1",
        "Detecta el último movimiento alcista. Identifica el último punto bajo antes de esa subida.",
        "Si comprabas al precio actual, tu SL iría justo debajo de ese punto bajo. Anota el precio exacto.",
        "Calcula la diferencia en euros entre ese SL y el precio actual. Es el riesgo máximo de este trade.",
      ]}
      quiz={{
        question: "Una posición compradora en BTC/USD está abierta a 78 000 $. El último punto bajo significativo se ubica en 77 000 $. ¿Qué colocación de Stop Loss respeta mejor la lógica técnica?",
        answers: [
          "77 900 $",
          "77 500 $",
          "76 900 $",
          "78 200 $",
        ],
        correctIndex: 2,
        explanation: "El Stop Loss debe colocarse más allá del nivel técnico que invalida el escenario. El último punto bajo importante se ubica en 77 000 $. Un Stop Loss a 76 900 $ deja un pequeño margen bajo ese nivel mientras mantiene un riesgo coherente. La variación entre la entrada (78 000 $) y el SL (76 900 $) representa una variación de precio de 1 100 $. La pérdida realmente sufrida en dinero depende después del tamaño de la posición usada.",
        answerExplanations: [
          "Incorrecto. El Stop Loss está colocado demasiado cerca de la entrada. Una fluctuación normal de Bitcoin puede tocar fácilmente este nivel sin invalidar el escenario.",
          "Incorrecto. El Stop Loss queda por encima del último punto bajo significativo. El mercado podría barrer ese nivel antes de retomar.",
          "Correcto. El Stop Loss se ubica justo debajo del último punto bajo importante a 77 000 $. El nivel invalida realmente el escenario si el precio se rompe.",
          "Incorrecto. El Stop Loss está colocado encima del precio de entrada. El trade se cerraría inmediatamente o casi.",
        ],
      }}
    />
  );
}
