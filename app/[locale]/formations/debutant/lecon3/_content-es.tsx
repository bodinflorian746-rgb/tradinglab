import { LessonTemplate } from "@/app/components/LessonTemplate";
import { CandleAnatomyDiagram } from "@/app/components/charts/CandleAnatomyDiagram";

// ── Esquema : ejemplo vela verde vs roja ─────────────────────────────────────
function CandleExampleDiagram() {
  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-center">
        <p className="text-xs font-bold text-emerald-400 mb-2">Vela verde</p>
        <svg viewBox="0 0 60 100" className="w-10 mx-auto mb-2" aria-label="Vela verde">
          <line x1="30" y1="5"  x2="30" y2="18" stroke="#4b5563" strokeWidth="2" />
          <rect x="18" y="18" width="24" height="52" rx="2" fill="#059669" fillOpacity="0.9" />
          <line x1="30" y1="70" x2="30" y2="92" stroke="#4b5563" strokeWidth="2" />
        </svg>
        <p className="text-[10px] text-emerald-400/80 leading-snug">Close &gt; Open<br />Compradores ganaron</p>
      </div>
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-center">
        <p className="text-xs font-bold text-red-400 mb-2">Vela roja</p>
        <svg viewBox="0 0 60 100" className="w-10 mx-auto mb-2" aria-label="Vela roja">
          <line x1="30" y1="5"  x2="30" y2="18" stroke="#4b5563" strokeWidth="2" />
          <rect x="18" y="18" width="24" height="52" rx="2" fill="#dc2626" fillOpacity="0.8" />
          <line x1="30" y1="70" x2="30" y2="92" stroke="#4b5563" strokeWidth="2" />
        </svg>
        <p className="text-[10px] text-red-400/80 leading-snug">Open &gt; Close<br />Vendedores ganaron</p>
      </div>
    </div>
  );
}

export default function ContentEs() {
  return (
    <LessonTemplate
      formationId="debutant"
      lessonId="lecon3"
      lessonNumber={3}
      duration="10 min"
      prev={{ href: "/formations/debutant/lecon2", label: "Lección 2 : Long y Short" }}
      next={{ href: "/formations/debutant/lecon4", label: "Lección 4 : Spread" }}
      title="Leer un gráfico de velas"
      hook="Un gráfico de velas es una imagen del combate entre compradores y vendedores. Cada vela te dice quién ganó, con qué fuerza, y si hubo resistencia. Aprender a leerlas es ver lo que la mayoría no ve."
      sections={[
        {
          title: "Anatomía de una vela : 4 datos en una imagen",
          content: "Cada vela muestra exactamente 4 datos. Juntos, resumen todo lo que pasó durante un período, 1 minuto, 1 hora o 1 día.",
          visual: <CandleAnatomyDiagram locale="es" />,
          items: [
            "Open (O), el precio en el momento en que empieza el período",
            "Close (C), el precio en el momento en que termina el período",
            "High (H), el precio más alto alcanzado durante el período",
            "Low (L), el precio más bajo alcanzado durante el período",
          ],
        },
        {
          title: "Ejemplo concreto : una vela verde, una vela roja",
          content: "Vela verde: Bitcoin abre a 78 000 $, sube a 79 000 $, baja a 77 500 $, cierra a 78 600 $. El precio termina más alto que en la apertura: Close (78 600) > Open (78 000). Los compradores ganan entonces la batalla. Vela roja: Bitcoin abre a 78 600 $, sube a 78 900 $, cae a 77 000 $, cierra a 77 400 $. El precio termina más bajo que en la apertura: Close (77 400) < Open (78 600). Los vendedores ganan entonces la batalla.",
          visual: <CandleExampleDiagram />,
          items: [
            "Cuerpo verde = close > open, los compradores dominaron el período",
            "Cuerpo rojo = close < open, los vendedores dominaron el período",
            "Mecha alta = intento de subida rechazado por los vendedores",
            "Mecha baja = intento de bajada rechazado por los compradores",
          ],
        },
        {
          title: "Patrones de velas para conocer",
          content: "Estas configuraciones aparecen seguido. Dan información, pero su valor depende totalmente del lugar donde aparecen en el gráfico.",
          items: [
            "Martillo: cuerpo chico arriba, mecha baja larga → los vendedores intentaron bajar, los compradores resistieron fuerte",
            "Estrella fugaz: cuerpo chico abajo, mecha alta larga → los compradores intentaron subir, los vendedores rechazaron",
            "Doji: cuerpo casi nulo, mechas de ambos lados → indecisión total entre compradores y vendedores",
            "Engulfing alcista: gran vela verde que engulle a la roja anterior → los compradores toman el control",
          ],
        },
      ]}
      errors={[
        "Entrar a un trade porque una vela 'parece' un martillo, sin verificar si está en un nivel importante",
        "Confundir el color con una señal de compra o venta: una vela roja no significa 'vender ahora'",
        "Analizar una sola vela aislada: siempre es la secuencia de velas la que cuenta la historia",
        "Ignorar las mechas: una vela verde con una mecha alta muy larga no es una señal alcista fuerte",
      ]}
      fatalError="Entrar a un trade solo porque un patrón de vela te parece interesante, sin mirar la tendencia global y sin que la vela esté en un nivel clave. Un martillo en medio del gráfico no significa nada. Un martillo en un soporte mayor, dentro de una tendencia alcista, ahí se vuelve relevante."
      keyPoints={[
        "Cada vela = 4 datos: Open, High, Low, Close",
        "Cuerpo verde = compradores ganadores. Cuerpo rojo = vendedores ganadores.",
        "Las mechas = intentos fallidos, muestran la resistencia del bando opuesto",
        "Doji = indecisión. Martillo = rechazo de precios bajos. Engulfing = toma de control clara.",
        "Un patrón de vela solo no significa nada, el contexto le da valor",
      ]}
      exerciseTitle="Leer velas en un gráfico real"
      exercise={[
        "En TradingView.com, abre EUR/USD en timeframe Daily",
        "Encuentra una vela verde con una mecha alta larga — ¿qué pasó en los días siguientes?",
        "Encuentra un Doji — ¿el mercado eligió una dirección clara en las velas siguientes?",
        "Identifica un Engulfing (una gran vela que engulle a la anterior) — ¿qué impacto tuvo en lo que siguió?",
      ]}
      quiz={{
        question: "Ves una vela roja con una mecha baja muy larga. ¿Qué indica esto con mayor precisión?",
        answers: [
          "El mercado está fuertemente bajista y va a seguir bajando",
          "Los vendedores dominaron el período, pero los compradores defendieron los precios bajos con fuerza",
          "El cierre de la vela ocurrió en el nivel más bajo del período",
          "Es una señal de compra inmediata, entra ahora",
        ],
        correctIndex: 1,
        explanation: "Cuerpo rojo = los vendedores ganaron el período (close < open). Mecha baja larga = el precio cayó muy bajo, pero los compradores rechazaron esa bajada antes del cierre. Es una señal de resistencia compradora, no una dominación vendedora total.",
        answerExplanations: [
          "Falso. La mecha baja larga prueba lo contrario de una dominación vendedora total. Los compradores reaccionaron fuerte desde los mínimos, es resistencia, no una confirmación de tendencia bajista.",
          "Correcto. Cuerpo rojo = vendedores ganadores en el período. Mecha baja larga = los compradores empujaron los precios desde los mínimos con fuerza. Hubo un combate visible, no una dominación aplastante.",
          "Falso. La mecha baja larga prueba que el precio bajó muy bajo Y DESPUÉS subió antes de cerrar. El cierre está entonces por encima del mínimo, sino la mecha sería nula.",
          "Falso. Ninguna vela sola es una señal de compra suficiente. Para que esta vela sea accionable, tendría que estar en un soporte importante, en un contexto de tendencia favorable.",
        ],
      }}
    />
  );
}
