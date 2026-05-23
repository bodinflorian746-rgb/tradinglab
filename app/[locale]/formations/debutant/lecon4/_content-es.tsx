import { LessonTemplate } from "@/app/components/LessonTemplate";
import { SpreadDiagram } from "@/app/components/charts/SpreadDiagram";
import { SpreadVariationDiagram } from "@/app/components/charts/SpreadVariationDiagram";

// ── Esquema: ganancia y pérdida con el spread ────────────────────────────────
function SpreadImpactDiagram() {
  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
        <p className="text-[10px] font-bold text-emerald-400 mb-2 uppercase tracking-wide">Movimiento suficiente ✓</p>
        <div className="space-y-1 font-mono text-xs">
          <div className="flex justify-between">
            <span className="text-zinc-500">Compra (Ask)</span>
            <span className="text-white">1,0805</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Venta (Bid)</span>
            <span className="text-white">1,0870</span>
          </div>
          <div className="h-px bg-zinc-700 my-1" />
          <div className="flex justify-between">
            <span className="text-zinc-500">Ganancia neta</span>
            <span className="text-emerald-400 font-bold">+65 pts ✓</span>
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3">
        <p className="text-[10px] font-bold text-red-400 mb-2 uppercase tracking-wide">Movimiento muy chico ✗</p>
        <div className="space-y-1 font-mono text-xs">
          <div className="flex justify-between">
            <span className="text-zinc-500">Compra (Ask)</span>
            <span className="text-white">1,0805</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Venta (Bid)</span>
            <span className="text-white">1,0806</span>
          </div>
          <div className="h-px bg-zinc-700 my-1" />
          <div className="flex justify-between">
            <span className="text-zinc-500">Resultado</span>
            <span className="text-red-400 font-bold">−4 pts ✗</span>
          </div>
        </div>
        <p className="text-[9px] text-zinc-600 mt-1.5">El spread borra la ganancia</p>
      </div>
    </div>
  );
}

export default function ContentEs() {
  return (
    <LessonTemplate
      formationId="debutant"
      lessonId="lecon4"
      lessonNumber={4}
      duration="8 min"
      prev={{ href: "/formations/debutant/lecon3", label: "Lección 3 — Velas" }}
      next={{ href: "/formations/debutant/lecon5", label: "Lección 5 — Stop Loss" }}
      title="Spread, Bid y Ask"
      hook="Analizas el mercado perfectamente. Entras en el momento justo. Y aun así, ya estás en rojo desde el primer segundo — sin que el precio se haya movido. No es un error. Es el spread. Y todo trader lo paga, en cada trade, sin excepción."
      sections={[
        {
          title: "Bid y Ask — dos precios en permanencia",
          content: "En cualquier mercado, dos precios se muestran siempre simultáneamente. No es un bug — es el funcionamiento normal. El Bid es el precio al que puedes vender. El Ask es el precio al que puedes comprar. El Ask siempre es ligeramente más alto que el Bid.",
          visual: <SpreadDiagram />,
          items: [
            "BID = precio de venta (siempre el más bajo de los dos)",
            "ASK = precio de compra (siempre el más alto de los dos)",
            "SPREAD = Ask − Bid = el costo pagado en cada apertura de trade",
            "Ejemplo: EUR/USD Bid = 1,0800, Ask = 1,0805 → spread de 5 puntos",
          ],
        },
        {
          title: "Ejemplo concreto — el impacto del spread en tus trades",
          content: "Compras EUR/USD al Ask (1,0805). Para ser rentable, el precio Bid debe superar 1,0805 — o sea que el mercado debe moverse al menos 5 puntos en tu dirección antes de que empieces a ganar.",
          visual: <SpreadImpactDiagram />,
          items: [
            "El spread se paga a la ENTRADA del trade — no a la salida",
            "Empiezas cada trade en rojo por el monto del spread",
            "Para EUR/USD con 5 puntos de spread: el mercado debe moverse +5 puntos antes del equilibrio",
            "En objetivos chicos, el spread puede representar 50% de la ganancia buscada",
          ],
        },
        {
          title: "El spread varía según las condiciones",
          content: "El spread no es fijo. Depende de la liquidity del mercado — cuántos compradores y vendedores están activos en ese momento. Mientras más actividad, más ajustado es el spread y menos pagas.",
          visual: <SpreadVariationDiagram />,
          items: [
            "EUR/USD en horas pico (9h–17h): 1–2 puntos — costo mínimo",
            "EUR/USD de noche (22h–6h): 4–8 puntos — costo más alto",
            "Cryptos el fin de semana: muy variable — puede ser muy costoso",
            "Pares exóticos (USD/TRY…): 20–100 puntos — peligroso para objetivos chicos",
          ],
        },
      ]}
      errors={[
        "Tradear activos con spread alto (pares exóticos, crypto el fin de semana) sin verificar el costo de entrada",
        "Querer ganar 3 puntos en un trade con 5 puntos de spread — imposible ser rentable",
        "Tradear de noche o en horas muertas sin saber que el spread se amplía significativamente",
        "Elegir un broker solo por la publicidad sin comparar los spreads — 1 punto de diferencia × 100 trades = impacto real",
      ]}
      fatalError="Tradear un activo con spread alto con un objetivo de ganancia inferior al spread. Si tu spread es de 20 puntos y buscas una ganancia de 15 puntos, estás en pérdida antes incluso de que el mercado se mueva un solo punto. Siempre calcula el spread antes de definir tu objetivo."
      keyPoints={[
        "Bid = precio de venta. Ask = precio de compra. El Ask siempre es más alto.",
        "Spread = Ask − Bid = costo pagado a la entrada de cada trade",
        "Empiezas cada trade en rojo por el monto del spread",
        "El spread es más bajo en las horas de fuerte actividad (9h–17h hora de París)",
        "Tu objetivo de ganancia siempre debe superar el spread — sino el trade está perdido de entrada",
      ]}
      exerciseTitle="Observar el spread en condiciones reales"
      exercise={[
        "En TradingView.com, abre EUR/USD. En las opciones del gráfico, activa la opción de mostrar Bid y Ask.",
        "Anota la diferencia entre Bid y Ask un día de semana a las 10h — es el spread en ese momento.",
        "Vuelve a ver ese spread a las 23h o un domingo — ¿está más ancho o más ajustado? ¿Por qué?",
        "Abre un par exótico como USD/MXN y compara su spread con el de EUR/USD.",
      ]}
      quiz={{
        question: "EUR/USD: Bid = 1,0800, Ask = 1,0805. Abres una compra (Long). ¿A qué precio se ejecuta tu trade, y cuánto estás en rojo inmediatamente?",
        answers: [
          "A 1,0800 — empiezas en equilibrio, spread nulo",
          "A 1,0802 — estás 2 puntos en rojo",
          "A 1,0805 — estás 5 puntos en rojo inmediatamente",
          "El precio de ejecución depende del tamaño de tu posición",
        ],
        correctIndex: 2,
        explanation: "Una compra siempre se ejecuta al Ask = 1,0805. El spread = Ask − Bid = 1,0805 − 1,0800 = 5 puntos. Si cierras inmediatamente, vendes al Bid = 1,0800 y pierdes 5 puntos. Es el costo de entrada pagado en cada trade.",
        answerExplanations: [
          "Falso. El Bid (1,0800) es el precio al que VENDES — no al que compras. En compra, la orden se ejecuta al Ask (1,0805). Empiezas con 5 puntos de déficit, no en equilibrio.",
          "Falso. No existe precio intermedio entre Bid y Ask para una orden a mercado. Compras al Ask (1,0805) o vendes al Bid (1,0800). Acá: 1,0805, o sea 5 puntos en rojo.",
          "Correcto. La compra se ejecuta al Ask = 1,0805. Spread = 5 puntos. Cierre inmediato al Bid = 1,0800 → pérdida de 5 puntos. Este costo se paga a la apertura de cada trade, sin excepción.",
          "Falso. El precio de ejecución siempre es el Ask para una compra, sin importar el tamaño de posición. El tamaño afecta el monto en euros perdido por punto — no el nivel de precio de ejecución.",
        ],
      }}
    />
  );
}
