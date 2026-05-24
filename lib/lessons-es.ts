// Version ES (LATAM neutro) de lib/lessons.ts — uniquement les 9 leçons
// débutant car DebutantLessonView ne lit que `level === "debutant"`.
//
// Structure mirror exact de LESSONS[0] pour permettre un switch propre dans
// DebutantLessonView selon la locale. Les IDs/slugs restent identiques pour
// que la progression localStorage reste compatible.
//
// Traduction trader-native LATAM (tú, tradear, terminologie EN conservée
// quand naturelle : Long, Short, Buy, Sell, Bid, Ask, Stop Loss, Take Profit,
// Break Even, R/R, FOMO, etc.).

import type { LevelData } from "./lessons";

export const LESSONS_ES: LevelData[] = [
  {
    level: "debutant",
    title: "Los Fundamentos",
    promise: "Entender los mercados antes de arriesgar un solo centavo.",
    lessons: [

      // ─── Leçon 1 ────────────────────────────────────────────────────────────
      {
        id: "lecon-1",
        slug: "lecon1",
        title: "¿Qué es el trading?",
        duration: "8 min",
        introduction:
          "La mayoría de personas que abren una cuenta de trading pierden plata en los primeros 3 meses. No por falta de inteligencia. Porque empezaron sin entender lo que realmente estaban haciendo.",
        sections: [
          {
            heading: "El principio, en una frase",
            body: "El trading es apostar a la dirección de un precio. Crees que va a subir → compras. Crees que va a bajar → vendes. Tienes razón → ganas. Te equivocas → pierdes. Es así de simple, y por eso mismo es difícil.",
            items: [
              "Los mercados son compradores y vendedores que se ponen de acuerdo en un precio",
              "Si los compradores son más numerosos y más agresivos → el precio sube",
              "Si los vendedores dominan → el precio baja",
              "Puedes ganar en ambos sentidos: tanto al alza como a la baja",
            ],
          },
          {
            heading: "Ejemplo concreto : ganancia y pérdida",
            body: "Caso 1, el precio sube a tu favor: Compras Bitcoin a 78 000 $. Unas horas después, Bitcoin sube a 81 000 $. El precio avanzó 3 000 $ a favor de tu posición. Mantienes tu plan, dejas el trade respirar, después tomas tus ganancias. Caso 2, el precio baja en tu contra: Compras Bitcoin a 78 000 $. Unas horas después, Bitcoin cae a 76 500 $. El precio bajó 1 500 $ en contra de tu posición. Bajo el miedo, cierras la posición en pánico y asumes la pérdida. El trading consiste en intentar anticipar estos movimientos de precio. El monto realmente ganado o perdido en dinero depende después del tamaño de tu posición. El cálculo preciso de ese tamaño se ve en la Lección 8. ¿La diferencia entre los dos casos? No es el análisis, es el comportamiento frente a la pérdida.",
            diagram: "trade",
            items: [
              "Un trade que gana ≠ un buen trade (pudiste simplemente tener suerte)",
              "Un trade que pierde ≠ un mal trade (si seguiste un plan sólido, es normal)",
              "Lo que cuenta a largo plazo: el método y la disciplina, no cada resultado individual",
            ],
          },
          {
            heading: "Trading, inversión, casino : los 3 no son lo mismo",
            body: "Muchos principiantes confunden estos tres conceptos. Esa confusión cuesta plata.",
            table: {
              headers: ["", "Trading", "Inversión", "Casino"],
              rows: [
                ["Duración", "Minutos a semanas", "Meses a años", "Segundos"],
                ["Decisión", "Análisis técnico", "Análisis fundamental", "Puro azar"],
                ["Resultado", "Reproducible", "Reproducible", "No reproducible"],
                ["Control", "Alto (SL, TP)", "Medio", "Ninguno"],
              ],
            },
          },
          {
            heading: "Errores frecuentes del principiante",
            body: "Estos errores son universales. Casi todos los traders nuevos cometen al menos uno en las primeras semanas.",
            items: [
              "Confundir trading e inversión, un trader que 'mantiene su posición porque cree en el proyecto' ya no es un trader, es un inversor",
              "Creer que hay que tener razón seguido para ser rentable, falso: un buen ratio riesgo/recompensa basta",
              "Seguir consejos de trading sin entender por qué, no puedes aprender a cocinar mirando a otro comer",
              "Empezar con plata real sin período de entrenamiento, el estrés de la plata real cambia totalmente las decisiones",
            ],
          },
          {
            heading: "El error fatal",
            body: "Abrir una cuenta real y depositar plata sin haber pasado mínimo 4 a 6 semanas en cuenta demo. En demo, aprendes los mecanismos sin arriesgar nada. En real, sin esa base, las emociones toman el control desde el primer trade perdedor, y ya no te sueltan.",
          },
        ],
        keyPoints: [
          "El trading = apostar a la dirección de un precio, al alza o a la baja",
          "Puedes ganar en ambos sentidos, cuando sube y cuando baja",
          "Trading ≠ inversión ≠ casino, son tres actividades distintas",
          "Lo que cuenta: el método y la disciplina, no el resultado de cada trade",
          "Empieza siempre en cuenta demo antes de arriesgar plata real",
        ],
        exercise: {
          title: "Observar los mercados en TradingView",
          steps: [
            "Anda a TradingView.com y crea una cuenta gratis",
            "Busca 'EURUSD', el precio actual aparece arriba a la izquierda. Anótalo.",
            "Espera 10 minutos. ¿El precio se movió? ¿En qué sentido? ¿Cuánto?",
            "Busca 'BTCUSD', compara la velocidad y la amplitud de los movimientos con EUR/USD",
          ],
        },
        quiz: {
          question: "Compras Bitcoin a 78 000 $ y después lo revendes a 81 000 $. ¿Qué afirmación es correcta?",
          answers: [
            "El movimiento de precio es de +3 000 $",
            "Ganas automáticamente 3 000 $",
            "Duplicas obligatoriamente tu capital",
            "El resultado depende únicamente del precio de venta final",
          ],
          correct: 0,
          explanation:
            "El trading se basa en las variaciones de precio entre la entrada y la salida. En este ejemplo, Bitcoin pasa de 78 000 $ a 81 000 $, o sea un movimiento de +3 000 $. Por otro lado, el monto realmente ganado en dinero depende del tamaño de tu posición. Dos traders pueden tomar exactamente el mismo movimiento y ganar montos muy diferentes.",
          answerExplanations: [
            "Correcto. El precio pasó de 78 000 $ a 81 000 $, o sea una variación positiva de 3 000 $.",
            "Incorrecto. 3 000 $ corresponde al movimiento del precio, no automáticamente a la ganancia real en dinero. El resultado final depende también del tamaño de tu posición.",
            "Incorrecto. El movimiento del precio no permite conocer la evolución exacta del capital sin saber el tamaño de la posición.",
            "Incorrecto. El precio de venta solo no basta. El resultado depende de la diferencia entre entrada y salida, además del tamaño de tu posición.",
          ],
        },
      },

      // ─── Leçon 2 ────────────────────────────────────────────────────────────
      {
        id: "lecon-2",
        slug: "lecon2",
        title: "Comprar / Vender : Long y Short",
        duration: "9 min",
        introduction:
          "En 2022, Bitcoin perdió 70% de su valor en pocos meses. Miles de personas lo perdieron todo. Sin embargo, algunos traders ganaron exactamente con esa caída. ¿Cómo? Sabiendo vender en corto. Esta lección te explica cómo.",
        sections: [
          {
            heading: "Long = apuestas al alza",
            body: "Ir Long (o Buy) es comprar un activo esperando que su precio suba. Compras ahora y revendes después a un precio más alto. Es la dirección más intuitiva, como comprar zapatillas para revenderlas más caras.",
            items: [
              "El oro está a 4 600 $. Crees que va a subir. Compras (Long).",
              "El oro sube a 4 720 $. El precio subió 120 $: el movimiento va a tu favor.",
              "El oro baja a 4 510 $. El precio retrocedió 90 $: el movimiento juega en tu contra.",
              "Long = quieres que el precio SUBA DESPUÉS de haber comprado",
            ],
          },
          {
            heading: "Short = apuestas a la baja",
            body: "Ir Short (o Sell) es vender un activo que no posees físicamente, esperando recomprarlo más barato después. En la práctica, tu broker gestiona la técnica, simplemente haces clic en 'Sell'. Si el precio baja, ganas.",
            items: [
              "El oro está a 4 700 $. Crees que va a bajar. Vendes (Short).",
              "El oro baja a 4 580 $. El precio bajó 120 $: para un Short, una bajada va a tu favor.",
              "El oro sube a 4 790 $. El precio subió 90 $: para un Short, una subida juega en tu contra.",
              "Short = quieres que el precio BAJE después de haber vendido",
            ],
          },
          {
            heading: "Long vs Short : la comparación",
            body: "Las dos direcciones son simétricas. Solo cambia la dirección de la ganancia. El risk management funciona exactamente igual en ambos casos.",
            diagram: "long-short",
            table: {
              headers: ["", "Long (Buy, Compra)", "Short (Sell. Venta)"],
              rows: [
                ["Ganas si…", "El precio sube", "El precio baja"],
                ["Pierdes si…", "El precio baja", "El precio sube"],
                ["Otro término", "Alcista / Bullish", "Bajista / Bearish"],
                ["Botón MT5", "BUY", "SELL"],
              ],
            },
          },
          {
            heading: "Errores frecuentes del principiante",
            body: "Estas confusiones pasan seguido. Pueden costar trades enteros tomados en la dirección equivocada.",
            items: [
              "Creer que solo se puede ganar cuando sube, el Short existe precisamente para aprovechar las bajadas",
              "Confundir 'Sell para cerrar un Long' y 'abrir un Short', en MT5 ambos se llaman Sell pero no es lo mismo",
              "Hacer Short sin Stop Loss, un error aún más grave que un Long sin SL (explicado abajo)",
              "Buscar el Short en todo 'porque siempre baja', los mercados suben a largo plazo, el Long está estadísticamente favorecido",
            ],
          },
          {
            heading: "El error fatal",
            body: "Abrir un Short sin Stop Loss. Un activo que baja tiene un límite natural: el precio no puede bajar de 0. Pero un activo que sube no tiene límite teórico. Si haces Short y el precio explota al alza, tu pérdida puede superar tu apuesta inicial. Sin SL, un Short descontrolado puede arruinar una cuenta entera en unas horas.",
          },
        ],
        keyPoints: [
          "Long (Buy) = compras = ganas si el precio sube",
          "Short (Sell) = vendes = ganas si el precio baja",
          "Puedes ganar en ambos sentidos, al alza como a la baja",
          "BUY = Long / SELL = Short en todos los softwares de trading",
          "Short sin Stop Loss = riesgo potencialmente ilimitado, siempre proteger tus posiciones",
        ],
        exercise: {
          title: "Identificar oportunidades Long y Short en un gráfico",
          steps: [
            "En TradingView, abre BTC/USD en Daily (gráfico diario)",
            "Detecta el último gran movimiento alcista del gráfico. ¿Cuándo empezó? ¿Cuánto duró?",
            "Detecta la última gran bajada. ¿Qué porcentaje cayó el precio?",
            "Si hubieras abierto un Short al inicio de esa bajada, ¿cuánto se habría movido el precio a tu favor?",
          ],
        },
        quiz: {
          question: "Bitcoin está a 78 000 $. Crees que va a bajar a 75 000 $. ¿Qué orden abres?",
          answers: [
            "Un Long (Buy), para aprovechar la bajada anticipada",
            "Un Short (Sell), para aprovechar la bajada anticipada",
            "Ninguno, solo se puede ganar cuando el precio sube",
            "Un Long y un Short al mismo tiempo para cubrir ambos sentidos",
          ],
          correct: 1,
          explanation:
            "Para aprovechar una bajada anticipada, abres un Short (Sell). Vendes a 78 000 $ y recompras a 75 000 $. El precio bajó 3 000 $, y ese movimiento juega a tu favor. El monto realmente ganado en dinero depende después del tamaño de tu posición, es el tema de la Lección 8.",
          answerExplanations: [
            "Falso. Un Long (Buy) = apostar a una SUBIDA. Si crees que Bitcoin va a bajar y abres un Long, perderás cuando el precio baje a 75 000 $, exactamente lo opuesto de lo que querías.",
            "Correcto. Un Short (Sell) = apostar a una BAJADA. Vendes a 78 000 $, el precio baja a 75 000 $, recompras: bajó 3 000 $. Es ese movimiento el que el Short busca capturar, la ganancia real en dinero depende del tamaño de tu posición (Lección 8).",
            "Falso. El Short existe precisamente para aprovechar las bajadas. En trading, se puede ganar en ambos sentidos. Limitarse a las subidas es privarse de la mitad de las oportunidades del mercado.",
            "Falso. Abrir un Long y un Short simultáneamente sobre el mismo activo se anula perfectamente, las ganancias de uno compensan las pérdidas del otro. No ganas nada, pero pagas las fees dos veces.",
          ],
        },
      },

      // ─── Leçon 3 ────────────────────────────────────────────────────────────
      {
        id: "lecon-3",
        slug: "lecon3",
        title: "Leer un gráfico de velas",
        duration: "10 min",
        introduction:
          "Un gráfico de velas es una imagen del combate entre compradores y vendedores. Cada vela te dice quién ganó, con qué fuerza, y si hubo resistencia. Aprender a leerlas es aprender a ver lo que la mayoría no ve.",
        sections: [
          {
            heading: "Anatomía de una vela : 4 datos en una imagen",
            body: "Cada vela muestra exactamente 4 datos. Juntos, resumen todo lo que pasó durante un período dado, ya sea 1 minuto, 1 hora o 1 día.",
            diagram: "candle",
            items: [
              "Open (O), el precio al inicio del período",
              "Close (C), el precio al final del período",
              "High (H), el precio más alto alcanzado durante el período",
              "Low (L), el precio más bajo alcanzado durante el período",
            ],
          },
          {
            heading: "Ejemplo concreto : leer una vela paso a paso",
            body: "Caso 1, vela verde (compradores ganadores): Bitcoin abre a 20 000 €. Sube hasta 20 800 €. Baja un poco a 19 700 €. Cierra a 20 400 €. Resultado: cuerpo verde de 20 000 a 20 400 (close > open). Mecha alta de 20 400 a 20 800 (los vendedores empujaron a los compradores desde los máximos). Mecha baja de 20 000 a 19 700 (los compradores defendieron los precios bajos).\n\nCaso 2, vela roja (vendedores ganadores): Bitcoin abre a 20 400 €. Sube a 20 600 €. Cae a 19 500 €. Cierra a 19 800 €. Resultado: cuerpo rojo de 20 400 a 19 800 (close < open). Los vendedores dominaron el período.",
            items: [
              "Cuerpo verde = los compradores ganaron (close > open)",
              "Cuerpo rojo = los vendedores ganaron (close < open)",
              "Mecha alta = intento de subida rechazado por los vendedores",
              "Mecha baja = intento de bajada rechazado por los compradores",
            ],
          },
          {
            heading: "Patrones de velas para conocer",
            body: "Estas configuraciones aparecen seguido. Dan información, pero nunca son señales por sí solas. Su valor depende totalmente del lugar donde aparecen.",
            table: {
              headers: ["Patrón", "Cómo se ve", "Lo que dice"],
              rows: [
                ["Martillo", "Cuerpo chico arriba, mecha larga abajo", "Los vendedores fracasaron en bajar, los compradores defendieron"],
                ["Estrella fugaz", "Cuerpo chico abajo, mecha larga arriba", "Los compradores fracasaron en subir, los vendedores rechazaron"],
                ["Doji", "Cuerpo casi nulo, mechas de ambos lados", "Indecisión total, ni compradores ni vendedores ganan"],
                ["Engulfing alcista", "Gran vela verde que engulle a la roja anterior", "Los compradores tomaron el control de forma decisiva"],
                ["Engulfing bajista", "Gran vela roja que engulle a la verde anterior", "Los vendedores tomaron el control de forma decisiva"],
              ],
            },
          },
          {
            heading: "Errores frecuentes del principiante",
            body: "Estos errores de lectura cuestan caro. Saber nombrar los patrones no basta, también hay que saber cuándo importan.",
            items: [
              "Entrar a un trade solo porque una vela 'parece' un martillo, sin verificar si está en un nivel importante",
              "Confundir el color de una vela con una señal de trade: una vela roja no significa 'vender ahora'",
              "Analizar una sola vela: siempre es la secuencia de velas la que cuenta la historia, no una vela aislada",
              "Ignorar las mechas: una vela verde con una mecha alta muy larga no es necesariamente una señal alcista fuerte",
            ],
          },
          {
            heading: "El error fatal",
            body: "Entrar a un trade solo porque un patrón de vela te parece interesante, sin mirar la tendencia global y sin que la vela esté en un nivel clave. Un martillo en medio de la nada no significa nada. Un martillo en un soporte mayor, dentro de una tendencia alcista, ahí se vuelve relevante.",
          },
        ],
        keyPoints: [
          "Cada vela = 4 datos: Open, High, Low, Close",
          "Cuerpo verde = compradores ganadores. Cuerpo rojo = vendedores ganadores.",
          "Las mechas = intentos fallidos, muestran la resistencia del bando opuesto",
          "Doji = indecisión. Martillo = rechazo de precios bajos. Engulfing = toma de control clara.",
          "Un patrón de vela solo no significa nada, el contexto (zona, tendencia) le da valor",
        ],
        exercise: {
          title: "Leer velas en un gráfico real",
          steps: [
            "En TradingView, abre EUR/USD en timeframe Daily",
            "Encuentra una vela verde con una mecha alta larga — ¿qué pasó en los días siguientes?",
            "Encuentra un Doji — ¿el mercado eligió una dirección clara en las velas siguientes?",
            "Identifica un Engulfing (una gran vela que engulle a la anterior) — ¿qué impacto tuvo en lo que siguió?",
          ],
        },
        quiz: {
          question: "Ves una vela roja con una mecha baja muy larga. ¿Qué indica esto con mayor precisión?",
          answers: [
            "El mercado está fuertemente bajista y va a seguir bajando",
            "Los vendedores dominaron el período, pero los compradores defendieron los precios bajos con fuerza",
            "El cierre de la vela ocurrió en el nivel más bajo del período",
            "Es una señal de compra inmediata, entra ahora",
          ],
          correct: 1,
          explanation:
            "Cuerpo rojo = los vendedores ganaron el período (close < open). Mecha baja larga = el precio cayó muy bajo, pero los compradores rechazaron esa bajada antes del cierre. Es una señal de resistencia compradora, no una dominación vendedora total.",
          answerExplanations: [
            "Falso. La mecha baja larga prueba lo contrario de una dominación vendedora total. Si los vendedores lo hubieran controlado todo, no habría mecha baja, el cierre habría sido en el mínimo. La mecha baja muestra que los compradores reaccionaron fuerte.",
            "Correcto. Cuerpo rojo = vendedores ganadores en el período. Mecha baja larga = los compradores empujaron los precios desde los mínimos con fuerza. No es una dominación vendedora aplastante, hubo combate y resistencia visible.",
            "Falso. Si el cierre fuera en el mínimo, la mecha baja sería nula o inexistente. Acá, la mecha baja larga prueba que el precio bajó muy bajo Y DESPUÉS subió antes de cerrar, el cierre está entonces por encima del mínimo.",
            "Falso. Ninguna vela aislada es una señal de compra o venta suficiente. Para que esta vela sea una señal, tendría que estar en un nivel de soporte importante, en un contexto de tendencia favorable. Sola, no indica nada accionable.",
          ],
        },
      },

      // ─── Leçon 4 ────────────────────────────────────────────────────────────
      {
        id: "lecon-4",
        slug: "lecon4",
        title: "Spread, Bid y Ask",
        duration: "8 min",
        introduction:
          "Analizas el mercado perfectamente. Entras en el momento justo. Y aun así, ya estás en rojo desde el primer segundo, sin que el precio se haya movido. No es un error. Es el spread. Y todo trader lo paga, en cada trade, sin excepción.",
        sections: [
          {
            heading: "Bid y Ask : dos precios en permanencia",
            body: "En cualquier mercado, siempre hay dos precios mostrados al mismo tiempo. No es un bug, es el funcionamiento normal del mercado. El Bid es el precio al que puedes vender. El Ask es el precio al que puedes comprar. El Ask siempre es ligeramente más alto que el Bid.",
            diagram: "spread",
            items: [
              "BID = precio de venta (el más bajo de los dos)",
              "ASK = precio de compra (el más alto de los dos)",
              "Ejemplo: EUR/USD muestra Bid = 1,0800 / Ask = 1,0804",
              "Si compras ahora → pagas 1,0804. Si vendes ahora → recibes 1,0800.",
            ],
          },
          {
            heading: "Ejemplo concreto : ganancia y pérdida con el spread",
            body: "Caso 1, ganas a pesar del spread: Compras EUR/USD al Ask (1,0804). El precio sube a 1,0870. Vendes al Bid (1,0866). Ganas 1,0866 - 1,0804 = 62 euros por 1 euro por punto. El spread redujo tu ganancia en 4 euros, pero sigues ampliamente en positivo.\n\nCaso 2, el spread se vuelve problemático: Compras a 1,0804. El precio solo sube 2 puntos a 1,0806. Vendes al Bid: 1,0802. Pierdes 2 euros a pesar de un movimiento a tu favor. El spread de 4 puntos borró tu ganancia y te dejó en pérdida.",
            items: [
              "El spread se paga a la ENTRADA, no a la salida",
              "Empiezas cada trade en rojo por el monto del spread",
              "Para EUR/USD con un spread de 4 puntos: tu trade tiene que ganar más de 4 puntos para ser rentable",
              "En objetivos chicos, el spread representa una parte significativa de la ganancia buscada",
            ],
          },
          {
            heading: "El spread varía según las condiciones",
            body: "El spread no es fijo. Depende de la liquidity del mercado, cuántos compradores y vendedores están activos en ese momento. Mientras más actividad, más ajustado es el spread.",
            table: {
              headers: ["Situación", "Spread típico", "Impacto"],
              rows: [
                ["EUR/USD en horas pico (9h–17h)", "1–2 puntos", "Bajo costo de entrada"],
                ["EUR/USD de noche (22h–6h)", "4–8 puntos", "Costo más alto"],
                ["Cryptos el fin de semana", "Muy variable", "Puede ser muy costoso"],
                ["Pares exóticos (USD/TRY…)", "20–100 puntos", "Peligroso para objetivos chicos"],
              ],
            },
          },
          {
            heading: "Errores frecuentes del principiante",
            body: "Estos errores ligados al spread pasan seguido desapercibidos, hasta que te das cuenta por qué la cuenta baja incluso en trades 'en el sentido correcto'.",
            items: [
              "Tradear activos con spread alto (pares exóticos, crypto el fin de semana) sin verificar el costo",
              "Querer ganar 5 euros en un trade con 4 euros de spread, el umbral de rentabilidad es casi imposible de alcanzar",
              "Tradear en horas muertas o de noche sin saber que el spread se amplía",
              "Elegir un broker solo por la publicidad sin comparar los spreads, 1 punto de diferencia × 100 trades = impacto real en los resultados",
            ],
          },
          {
            heading: "El error fatal",
            body: "Tradear un activo con spread alto con un objetivo de ganancia inferior al spread. Si tu spread es de 20 puntos y buscas una ganancia de 15 puntos, estás en pérdida antes incluso de que el mercado se mueva. Siempre calcula el spread antes de elegir tu objetivo.",
          },
        ],
        keyPoints: [
          "Bid = precio de venta. Ask = precio de compra. El Ask siempre es más alto.",
          "Spread = Ask − Bid = el costo pagado en cada trade, desde la apertura",
          "Empiezas cada trade en rojo por el monto del spread",
          "El spread es más bajo en las horas de fuerte actividad (Londres 8h–10h, Nueva York 14h–17h)",
          "Tu objetivo de ganancia siempre debe ser superior al spread, sino el trade está perdido de entrada",
        ],
        exercise: {
          title: "Observar el spread en condiciones reales",
          steps: [
            "En TradingView, abre EUR/USD. Busca la opción de mostrar los precios Bid y Ask (configuración del gráfico).",
            "Anota la diferencia entre Bid y Ask a las 10h un día de semana, es el spread en ese momento.",
            "Vuelve a ver ese spread a las 23h o un domingo — ¿está más ancho o más ajustado?",
            "Abre un par exótico como USD/MXN y compara su spread con el de EUR/USD.",
          ],
        },
        quiz: {
          question: "EUR/USD: Bid = 1,0800, Ask = 1,0805. Abres una compra (Long). ¿A qué precio se ejecuta tu trade, y cuánto estás en rojo al inicio?",
          answers: [
            "A 1,0800, empiezas en equilibrio, spread nulo",
            "A 1,0802, estás 2 puntos en rojo",
            "A 1,0805, estás 5 puntos en rojo inmediatamente",
            "El precio depende del tamaño de tu posición",
          ],
          correct: 2,
          explanation:
            "Una compra siempre se ejecuta al Ask = 1,0805. El spread = Ask - Bid = 1,0805 - 1,0800 = 5 puntos. Si cierras inmediatamente, vendes al Bid = 1,0800. Pierdes 5 puntos: es el costo de entrada del trade.",
          answerExplanations: [
            "Falso. El Bid (1,0800) es el precio al que VENDES, no al que compras. En compra, tu orden se ejecuta al Ask (1,0805). Empiezas entonces con 5 puntos de déficit, no en equilibrio.",
            "Falso. No existe 'precio promedio' entre Bid y Ask para una orden a mercado. El mercado es binario: compras al Ask o vendes al Bid. Acá, la compra se ejecuta al Ask = 1,0805, y el spread es de 5 puntos.",
            "Correcto. Un Long se ejecuta al Ask = 1,0805. Spread = 1,0805 - 1,0800 = 5 puntos. Si cierras inmediatamente, vendes al Bid = 1,0800. Pérdida = 5 puntos. Es el costo de entrada que pagas en cada trade.",
            "Falso. El precio de ejecución siempre es el Ask para una compra, sin importar el tamaño de la posición. El tamaño de posición afecta el monto en euros ganado o perdido por punto, no el precio al que se ejecuta la orden.",
          ],
        },
      },

      // ─── Leçon 5 ────────────────────────────────────────────────────────────
      {
        id: "lecon-5",
        slug: "lecon5",
        title: "El Stop Loss",
        duration: "10 min",
        introduction:
          "Sin Stop Loss, un solo trade puede arruinar meses de trabajo en pocos minutos. No porque analices mal, porque el mercado puede ir mucho más lejos de lo que imaginas, y nada te detiene. El Stop Loss es la regla más importante del trading.",
        sections: [
          {
            heading: "¿Qué es un Stop Loss?",
            body: "Un Stop Loss (SL) es una orden automática que cierra tu trade si el precio va demasiado lejos en la dirección equivocada. Lo defines antes de entrar al trade. Cuando el precio lo toca, tu posición se cierra sola, estés frente a la pantalla o no.",
            items: [
              "Trade Long (compra): tu SL se coloca DEBAJO de tu precio de entrada",
              "Trade Short (venta): tu SL se coloca ENCIMA de tu precio de entrada",
              "Cuando el precio toca el SL, el trade se cierra automáticamente",
              "Pierdes exactamente el monto previsto, ni un euro más",
            ],
          },
          {
            heading: "Ejemplo concreto : con y sin Stop Loss",
            body: "Caso 1, con Stop Loss: Compras Bitcoin a 30 000 €. Colocas un SL a 28 500 €. El mercado cae a 28 500 €. Tu SL se activa. Pierdes 1 500 € por Bitcoin. Te queda el 98,5% de tu capital. Sigues tradeando.\n\nCaso 2, sin Stop Loss: Compras Bitcoin a 30 000 €. Sin SL. En la noche, una mala noticia hace caer a Bitcoin a 22 000 €. Despiertas con una pérdida de 8 000 € por Bitcoin, 27% de tu capital perdido en una noche. Sin que pudieras reaccionar.",
            diagram: "stoploss",
            items: [
              "Con SL: la pérdida está limitada y conocida de antemano",
              "Sin SL: la pérdida puede ser ilimitada, el mercado no espera a que estés listo",
              "Los traders sin SL siempre piensan 'el precio va a volver', a veces sí, a veces no. Y el 'no' destruye la cuenta.",
            ],
          },
          {
            heading: "¿Dónde colocar tu Stop Loss?",
            body: "Un buen SL no se coloca al azar. Se coloca en un lugar lógico del gráfico, ahí donde tu análisis sería claramente falso si el precio lo tocara.",
            items: [
              "Long: SL justo debajo del último punto bajo significativo (el soporte)",
              "Short: SL justo arriba del último punto alto significativo (la resistencia)",
              "Ejemplo: compras en el rebote de un soporte a 30 000 €. El último punto bajo está a 29 200 €. Tu SL va a 29 100 €.",
              "Regla: si el precio toca mi SL, mi análisis era falso. La pérdida es normal.",
            ],
          },
          {
            heading: "Errores frecuentes del principiante",
            body: "Estos errores con el Stop Loss son los más destructivos del trading. A veces actúan en silencio, hasta el día en que destruyen la cuenta.",
            items: [
              "No poner SL 'para darle una chance al trade', es la causa #1 de cuentas destruidas en principiantes",
              "SL demasiado ajustado: 3 euros de SL en Bitcoin, el mercado fluctúa normalmente 100-200 euros, vas a salir sin razón",
              "SL colocado al azar ('50 euros porque me parece bien'), el SL debe corresponder a un nivel lógico en el gráfico",
              "Olvidar colocar el SL al entrar pensando 'lo pongo después', y nunca ponerlo",
            ],
          },
          {
            heading: "El error fatal",
            body: "Mover el Stop Loss en la dirección equivocada para evitar que te saque. Tu trade pierde, estás en -500 €. Alejas el SL para 'darle una chance'. El trade sigue perdiendo. Lo alejas más. Al final, pierdes 5 o 10 veces más de lo previsto. Este error, cometido bajo emoción, es responsable de la destrucción de miles de cuentas de traders principiantes.",
          },
        ],
        keyPoints: [
          "Stop Loss = orden automática que limita tu pérdida a un monto definido de antemano",
          "Long: SL debajo de la entrada. Short: SL arriba de la entrada.",
          "Sin SL, tu pérdida es potencialmente ilimitada, es un riesgo inaceptable",
          "Coloca el SL en un lugar lógico del gráfico, no al azar",
          "NUNCA muevas el SL en el sentido de la pérdida, es el error fatal",
        ],
        exercise: {
          title: "Identificar colocaciones lógicas de Stop Loss",
          steps: [
            "En TradingView, abre Bitcoin (BTC/USD) en H1",
            "Detecta el último movimiento alcista. Identifica el último punto bajo antes de esa subida.",
            "Si comprabas al precio actual, tu SL iría justo debajo de ese punto bajo. Anota el precio exacto.",
            "Calcula la diferencia en euros entre ese SL y el precio actual. Es el riesgo máximo de este trade.",
          ],
        },
        quiz: {
          question: "Compras Bitcoin a 30 000 €. El último punto bajo del gráfico está a 29 000 €. ¿Dónde colocas tu Stop Loss?",
          answers: [
            "A 31 000 €, arriba de la entrada para no perder plata",
            "A 29 950 €, solo 50 € bajo la entrada, para minimizar la pérdida",
            "A 28 900 €, justo bajo el punto bajo lógico, ahí donde tu análisis sería falso",
            "Sin Stop Loss. Bitcoin siempre termina subiendo",
          ],
          correct: 2,
          explanation:
            "El SL de un Long va debajo de la entrada, en un nivel lógico. El último punto bajo a 29 000 € es el nivel que invalida tu escenario alcista. Colocando el SL a 28 900 € (justo debajo), si el precio llega ahí, tu análisis era falso. La pérdida = 1 100 € por Bitcoin, conocida y aceptada de antemano.",
          answerExplanations: [
            "Falso. Un SL arriba de la entrada en un Long cierra la posición cuando el precio sube, cuando ganas. Es totalmente al revés. El SL de un Long siempre va DEBAJO de la entrada para protegerte de una bajada.",
            "Falso. 50 € de SL en Bitcoin es demasiado ajustado. Bitcoin fluctúa normalmente cientos de euros por hora. Vas a salir automáticamente por el simple ruido del mercado, antes incluso de que el trade se desarrolle.",
            "Correcto. El SL lógico se coloca justo bajo el nivel que invalida tu análisis. El punto bajo a 29 000 € es ese nivel. A 28 900 €, si el precio llega ahí, la estructura alcista está rota, te equivocaste. La pérdida es de 1 100 €: definida y aceptada desde el inicio.",
            "Falso. 'Bitcoin siempre termina subiendo' es cierto en 10 años, pero en una posición abierta sin SL, una caída del 30% puede pasar en pocos días. Sin SL, 30% de pérdida en una posición = potencialmente todo el capital comprometido. Un SL no impide el rebote, limita la pérdida si el rebote tarda demasiado.",
          ],
        },
      },

      // ─── Leçon 6 ────────────────────────────────────────────────────────────
      {
        id: "lecon-6",
        slug: "lecon6",
        title: "El Take Profit",
        duration: "9 min",
        introduction:
          "Estás en trade, estás en profit, y miras. El precio sube más. Mantienes. Baja. Mantienes más 'porque va a volver a subir'. Sigue bajando y borra toda tu ganancia. Es uno de los escenarios más frustrantes del trading. El Take Profit lo evita.",
        sections: [
          {
            heading: "El principio, en una frase",
            body: "Un Take Profit (TP) es una orden automática que cierra tu trade en cuanto el precio toca el objetivo que fijaste. Defines ese objetivo antes de entrar, el broker ejecuta solo cuando el precio llega, estés frente a la pantalla o no.",
            diagram: "takeprofit",
            items: [
              "Long: tu TP se coloca ARRIBA de tu precio de entrada",
              "Short: tu TP se coloca ABAJO de tu precio de entrada",
              "Ejemplo: compras Bitcoin a 78 000 $. Colocas un TP a 84 000 $.",
              "Cuando Bitcoin toca 84 000 $, el trade se cierra solo en tu objetivo, el precio habrá recorrido 6 000 $ a tu favor",
            ],
          },
          {
            heading: "Ejemplo concreto : con y sin Take Profit",
            body: "Caso 1, con Take Profit: Compras Bitcoin a 78 000 $. Colocas un TP a 84 000 $. El precio sube hasta 84 000 $. El trade se cierra automáticamente en tu objetivo: el precio recorrió 6 000 $ a tu favor. Incluso si el precio baja después a 73 000 $, tu salida ya está hecha, el movimiento está asegurado.\n\nCaso 2, sin Take Profit: Compras Bitcoin a 78 000 $. El precio sube a 84 000 $. Miras y mantienes 'porque sigue subiendo'. El precio baja a 75 000 $. Entras en pánico y cierras. En ese instante, el precio está 3 000 $ ABAJO de tu entrada, mientras que antes estaba 6 000 $ ARRIBA.",
            items: [
              "Con TP: tu salida se activa automáticamente en el objetivo, sin emoción",
              "Sin TP: la emoción decide cuándo salir, casi siempre en el mal momento",
              "Sin TP, un precio que estaba 6 000 $ arriba de tu entrada puede volver a estar abajo",
            ],
          },
          {
            heading: "El ratio Riesgo / Recompensa (R/R)",
            body: "El R/R compara dos distancias: la que separa tu entrada de tu Stop Loss (el riesgo), y la que separa tu entrada de tu Take Profit (el objetivo). Es una relación, no depende del tamaño de tu posición. Es la métrica más importante en risk management: determina si tu estrategia es rentable a largo plazo, independientemente de tu winrate.",
            table: {
              headers: ["Ratio R/R", "Ejemplo concreto", "Lo que permite"],
              rows: [
                ["1:1", "Stop a 3 000 $, objetivo a 3 000 $", "Hay que ganar 1 trade de 2 para ser rentable"],
                ["1:2", "Stop a 3 000 $, objetivo a 6 000 $", "Puedes perder 2 trades de 3 y quedar positivo"],
                ["1:3", "Stop a 3 000 $, objetivo a 9 000 $", "Puedes perder 3 trades de 4 y quedar positivo"],
              ],
            },
          },
          {
            heading: "Errores frecuentes del principiante",
            body: "Estos errores en el Take Profit transforman trades ganadores en trades nulos o perdedores.",
            items: [
              "Cerrar el trade demasiado pronto por miedo: el precio solo recorrió 1 500 $ a tu favor, cierras. Después recorre 4 500 $.",
              "TP demasiado ambicioso: apuntar a un R/R de 1:10 en cada trade, el TP casi nunca se alcanza.",
              "No tener TP del nada: 'ya veré cuándo salir.' Resultado: una posición ganadora que se vuelve perdedora.",
              "Mover el TP en el camino: el precio se acerca al TP, lo mueves más lejos 'porque sube bien'. La emoción retoma el control.",
            ],
          },
          {
            heading: "El error fatal",
            body: "No tener Take Profit y dejar una posición ganadora abierta indefinidamente. El mercado nunca sube en línea recta. Sin TP, miras al precio erosionarse desde su máximo: estaba 6 000 $ arriba de tu entrada, después 4 500 $, después 2 500 $, después 800 $. Esperas el rebote. El rebote no viene. El precio vuelve a estar 3 000 $ abajo de tu entrada. Un trade que era excelente se vuelve perdedor, únicamente porque no había orden para fijar la salida en el buen nivel.",
          },
        ],
        keyPoints: [
          "Take Profit = orden automática que cierra tu trade cuando el precio toca tu objetivo",
          "Long: TP arriba de la entrada. Short: TP abajo de la entrada.",
          "Coloca el TP justo ANTES de la próxima resistencia (Long) o del próximo soporte (Short)",
          "Ratio R/R mínimo recomendado: 1:2, tu objetivo está 2 veces más lejos de tu entrada que tu Stop Loss",
          "Define tu TP antes de entrar al trade, nunca en el camino bajo emoción",
        ],
        exercise: {
          title: "Calcular un Take Profit con un buen ratio R/R",
          steps: [
            "En TradingView, abre Bitcoin (BTC/USD) en H1. Anota el precio actual.",
            "Identifica la próxima resistencia arriba del precio actual, anota ese nivel.",
            "Imagina una entrada Long al precio actual con un SL colocado 3 000 $ abajo. Para un R/R de 1:2, tu TP debe estar 6 000 $ arriba (2 veces la distancia del stop).",
            "¿La próxima resistencia identificada está más allá de ese TP? Si sí, el setup tiene buen potencial.",
          ],
        },
        quiz: {
          question: "Compras Bitcoin a 78 000 $. Tu Stop Loss está a 75 000 $, o sea 3 000 $ bajo tu entrada. Para un ratio R/R de 1:2, ¿dónde colocas tu Take Profit?",
          answers: [
            "A 79 500 $, el objetivo está a 1 500 $, el stop a 3 000 $",
            "A 81 000 $, objetivo y stop a la misma distancia (ratio 1:1)",
            "A 84 000 $, el objetivo está a 6 000 $, o sea 2 veces la distancia del stop",
            "El más alto posible para maximizar la ganancia",
          ],
          correct: 2,
          explanation:
            "Ratio 1:2 = tu objetivo está 2 veces más lejos que tu stop. El Stop Loss está a 3 000 $ bajo la entrada; el Take Profit debe estar entonces a 6 000 $ arriba: 78 000 + 6 000 = 84 000 $. La ganancia o pérdida en dinero depende después del tamaño de tu posición (ver Lección 8), pero el ratio, ese, queda en 1:2 sin importar el tamaño. Con este ratio, puedes perder 2 trades de 3 y quedar rentable a largo plazo.",
          answerExplanations: [
            "Falso. Un objetivo a 1 500 $ para un stop a 3 000 $ es un ratio 1:0,5: tu objetivo está 2 veces más cerca que tu stop. Incluso con 70% de trades ganadores, una estrategia con ese ratio es perdedora a largo plazo.",
            "Falso. Objetivo y stop a la misma distancia = ratio 1:1. No es suficiente: tendrías que ganar más de un trade de dos para ser rentable, difícil de mantener en el tiempo.",
            "Correcto. Un objetivo a 6 000 $ para un stop a 3 000 $ = ratio 1:2. Es el mínimo recomendado para una estrategia sana: con este ratio, 34% de trades ganadores basta para estar en profit global.",
            "Falso. Apuntar al 'más alto posible' sin nivel definido es tradear sin plan. Un TP demasiado lejano casi nunca se alcanza, miras el precio subir, tocar tu zona, y después bajar sin que tu salida se haya activado.",
          ],
        },
      },

      // ─── Leçon 7 ────────────────────────────────────────────────────────────
      {
        id: "lecon-7",
        slug: "lecon7",
        title: "El Break Even",
        duration: "8 min",
        introduction:
          "Estás en trade, el precio recorrió una buena distancia a tu favor, te relajas. El mercado hace una corrección, vuelve para atrás, y borra toda tu ventaja. El trade se cierra en tu Stop Loss inicial, sales en pérdida cuando el precio estaba ampliamente a tu favor poco antes. Es evitable. Eso es lo que el Break Even corrige.",
        sections: [
          {
            heading: "El principio, en una frase",
            body: "El Break Even (BE) es mover tu Stop Loss a tu precio de entrada exacto. Si el precio vuelve para atrás, sales en cero, ni ganancia, ni pérdida. Si el precio sigue en tu sentido, te mantienes en carrera. Tu trade ya no puede terminar en pérdida.",
            diagram: "breakeven",
            items: [
              "Compras Bitcoin a 78 000 $ con un SL inicial a 75 000 $",
              "Bitcoin sube a 81 000 $, el precio recorrió 3 000 $ a tu favor, o sea la distancia exacta de tu riesgo (1R)",
              "Mueves tu SL de 75 000 $ a 78 000 $ (tu precio de entrada), eso es el Break Even",
              "Ahora: si Bitcoin baja a 78 000 $, sales en cero. Si sigue subiendo, te quedas en carrera.",
            ],
          },
          {
            heading: "Ejemplo concreto : con y sin Break Even",
            body: "Caso 1, con Break Even: Compras Bitcoin a 78 000 $, SL a 75 000 $. El precio sube a 81 000 $, recorrió 3 000 $ a tu favor, o sea 1R. Activas el BE (SL → 78 000 $). El mercado hace una corrección y baja a 78 000 $. Salida automática: sales exactamente en tu precio de entrada, ni ganancia ni pérdida. Y si el precio hubiera seguido hasta 84 000 $, te habrías quedado en carrera por un movimiento de 6 000 $ a tu favor.\n\nCaso 2, sin Break Even: Mismo trade. Bitcoin sube a 81 000 $. No tocas nada. El mercado baja brutalmente a 73 500 $. Tu SL original a 75 000 $ se activa, el precio termina 3 000 $ ABAJO de tu entrada, cuando había estado 3 000 $ ARRIBA.",
            items: [
              "Con BE: el trade ya no puede terminar en pérdida una vez activado",
              "Sin BE: un precio que estaba 3 000 $ arriba de tu entrada puede volver 3 000 $ abajo",
              "El BE te libera del estrés, puedes esperar tu TP tranquilo",
            ],
          },
          {
            heading: "¿Cuándo activar el Break Even?",
            body: "El timing es crucial. Demasiado pronto, el mercado te saca en una simple fluctuación normal. En el buen momento, el BE te protege de verdad. La regla: espera que el precio haya recorrido al menos 1R a tu favor, o sea la distancia que separa tu entrada de tu Stop Loss.",
            table: {
              headers: ["Distancia entrada → SL", "Activar el BE cuando…", "Por qué"],
              rows: [
                ["2 000 $", "el precio recorrió 2 000 $ a tu favor", "1R alcanzado, la protección se vuelve lógica"],
                ["3 000 $", "el precio recorrió 3 000 $ a tu favor", "Antes de eso, una fluctuación normal te sacaría"],
                ["No importa", "el precio aún no recorrió 1R → espera", "Demasiado pronto: el mercado fluctúa, saldrías sin razón"],
              ],
            },
          },
          {
            heading: "Errores frecuentes del principiante",
            body: "Estos errores en el Break Even hacen perder trades ganadores o crean una falsa sensación de seguridad.",
            items: [
              "Activar el BE demasiado pronto: el precio solo recorrió 200 $ a tu favor cuando tu riesgo es de 3 000 $, la mínima fluctuación te saca en cero",
              "Nunca activar el BE: sufres reversales completos en trades que estaban ampliamente ganadores",
              "Confundir BE y toma de profit parcial: el BE = asegurar el riesgo (cero pérdida), no embolsar una ganancia",
              "Creer que el BE garantiza un profit: no, el BE garantiza cero pérdida. El profit depende siempre del TP.",
            ],
          },
          {
            heading: "El error fatal",
            body: "Activar el Break Even demasiado pronto bajo estrés. El precio solo recorrió 800 $ a tu favor, cuando tu riesgo (distancia entrada → SL) es de 3 000 $. Te asustas a la idea de perderlo todo de nuevo. Mueves tu SL a tu precio de entrada. El mercado fluctúa normalmente, vuelve brevemente bajo tu entrada, activa tu BE, sales en cero. Después, el precio sube 6 000 $. Miras al trade hacer exactamente lo que habías previsto, sin ti. La impaciencia te sacó de un trade ganador.",
          },
        ],
        keyPoints: [
          "Break Even = mover el Stop Loss al precio de entrada → ya no hay riesgo de pérdida",
          "Activar el BE cuando el precio recorrió al menos 1R a tu favor, 1R = la distancia entre tu entrada y tu Stop Loss",
          "Demasiado pronto = el mercado te saca en una simple fluctuación normal",
          "Un trade en BE puede salir en cero o seguir ganando, nunca perder",
          "El BE no reemplaza un buen TP, es una protección adicional",
        ],
        exercise: {
          title: "Simular el Break Even en trades históricos",
          steps: [
            "En TradingView, abre Bitcoin (BTC/USD) en H1. Detecta un trade Long que hubieras podido abrir hace 2 semanas.",
            "Anota la entrada y el SL lógico (justo bajo el último punto bajo). Mide la distancia entre los dos: es tu 1R.",
            "¿En qué momento el precio había recorrido +1R a tu favor (la distancia que acabas de medir)? Anota ese nivel, ahí es donde habrías activado el BE.",
            "¿Qué habría dado el BE activado en ese momento: salida en cero o continuación en profit?",
          ],
        },
        quiz: {
          question: "Compras Bitcoin a 78 000 $ con un SL a 75 000 $. El precio sube a 81 000 $. ¿Qué haces?",
          answers: [
            "Activas el Break Even: mueves tu SL de 75 000 $ a 78 000 $",
            "Mantienes el SL a 75 000 $, nunca hay que mover un SL",
            "Cierras el trade a 81 000 $ ya mismo, para no arriesgar nada más",
            "Mueves el SL a 78 900 $ para bloquear una parte del movimiento",
          ],
          correct: 0,
          explanation:
            "A 81 000 $, el precio recorrió 3 000 $ a tu favor, exactamente la distancia entre tu entrada y tu SL, o sea 1R. Es el buen momento para activar el BE: mueves el SL de 75 000 $ a 78 000 $. A partir de ahí, el trade ya no puede terminar en pérdida, y si el precio sigue hacia tu TP, te quedas en carrera. El monto en dinero, ese, depende del tamaño de tu posición (ver Lección 8).",
          answerExplanations: [
            "Correcto. El precio recorrió 3 000 $ a tu favor = exactamente 1R (la distancia entrada → SL). Mueves el SL de 75 000 $ a 78 000 $. El trade ya no puede terminar en pérdida: si el precio vuelve a 78 000 $, salida en cero; si sigue subiendo, te quedas en carrera.",
            "Falso. Es perfectamente válido, e incluso recomendado, mover el SL en el sentido favorable. La regla es nunca mover el SL en el sentido de la PÉRDIDA. Acá, lo mueves hacia tu precio de entrada para protegerte.",
            "Falso. Cerrar a 81 000 $ bloquea el movimiento ya ganado, pero renuncias a una posible prolongación hacia 84 000 $ o más. Activar el BE te permite quedarte en el trade sin más riesgo de pérdida, a menudo es la mejor elección.",
            "Falso. Mover el SL a 78 900 $ (900 $ arriba de la entrada) es una técnica llamada 'trailing stop parcial'. Es diferente del Break Even estándar, que coloca el SL exactamente en el precio de entrada. El riesgo acá: hacerte sacar en una simple fluctuación normal de 900 $.",
          ],
        },
      },

      // ─── Leçon 8 ────────────────────────────────────────────────────────────
      {
        id: "lecon-8",
        slug: "lecon8",
        title: "Risk management : el money management",
        duration: "12 min",
        introduction:
          "Un solo trade puede arruinar semanas enteras de trabajo. No porque el análisis fuera malo, porque el riesgo era demasiado alto. ¿Pero el riesgo adaptado a qué capital? La mayoría de guías habla de '1% por trade' para cuentas de 5 000 €+. Si arrancas con 300 o 700 €, necesitas una grilla diferente.",
        sections: [
          {
            heading: "Lo que nadie te dice del '1%'",
            body: "El money management es lo que separa a los traders que sobreviven de los que queman su cuenta en 2 meses. La regla de oro: NUNCA arriesgar más de lo que tu capital permite. La regla teórica '1% por trade' está hecha para cuentas de 5 000 €+. Por debajo, 1% = 2 a 10 € de riesgo, un monto a menudo inferior al riesgo mínimo que generan los lotes disponibles en los pares mayores.",
            items: [
              "Los lotes mínimo en Forex generan a menudo 10 a 20 € de riesgo incluso con un Stop Loss ajustado",
              "Capital de 300 € → 1% = 3 € de riesgo max. Inaplicable con los lotes estándar.",
              "La solución: adaptar tu % de riesgo a tu tramo de capital, no aplicar una regla genérica",
              "El riesgo = monto que pierdes si tu Stop Loss se activa",
            ],
          },
          {
            heading: "La grilla adaptada al retail",
            body: "Acá tienes la grilla de referencia: adapta tu riesgo por trade a tu capital real. El % baja a medida que el capital sube, porque tienes más que proteger.",
            table: {
              headers: ["Capital inicial", "Riesgo por trade", "Ejemplo concreto"],
              rows: [
                ["200 – 500 €", "5 %", "10 – 25 € máx por trade"],
                ["500 – 1 000 €", "3 %", "15 – 30 € máx por trade"],
                ["1 000 – 5 000 €", "2 %", "20 – 100 € máx por trade"],
                ["5 000 € y +", "0,5 – 2 %", "25 – 100 €+ por trade"],
              ],
            },
            note: "La regla 1% que vas a leer en todos lados es técnicamente correcta para cuentas 5 000 €+. En una cuenta chica (200–1 000 €), 1% = 2 a 10 € de riesgo, a menudo inaplicable en la práctica porque el lote mínimo ya genera más. Adaptar tu % no es hacer trampa: es alinearse con la realidad de los lotes disponibles.",
          },
          {
            heading: "Las cifras en la práctica",
            body: "Acá te muestro cómo calcular tu riesgo máx con la grilla:",
            items: [
              "Capital 300 €, ideal 3% (9 €), máx 5% (15 €) por trade",
              "Capital 500 €, ideal 2-3% (12-15 €), máx 5% (25 €) por trade",
              "Capital 1 000 €, ideal 2-3% (20-30 €), máx 3% (30 €) por trade",
              "Capital 2 000 €, 2% (40 €) por trade (ideal = máx)",
            ],
            diagram: "risk",
          },
          {
            heading: "Por qué el sobre-riesgo destruye las cuentas",
            body: "Imagina 10 malos trades seguidos. Es una serie normal, incluso los mejores traders atraviesan series de pérdidas. Acá te muestro lo que queda de tu capital según el riesgo por trade.",
            table: {
              headers: ["Riesgo por trade", "Capital restante después de 10 pérdidas consecutivas"],
              rows: [
                ["1%", "90,4 %, sigues tradeando tranquilo"],
                ["2%", "81,7 %, todavía manejable"],
                ["5%", "59,9 %, moral por el piso, errores que se acumulan"],
                ["10%", "34,9 %, muy difícil de levantarte"],
                ["20%", "10,7 %, cuenta casi destruida"],
              ],
            },
          },
          {
            heading: "Errores frecuentes del principiante",
            body: "Estos errores de risk management son los más destructivos, actúan en silencio hasta el momento en que todo se derrumba.",
            items: [
              "Arriesgar más después de una victoria: 'Tradeé bien, me puedo permitir arriesgar más.' Es el overconfidence, siempre precede a las grandes pérdidas.",
              "Arriesgar más después de una pérdida para recuperar: exactamente lo opuesto de lo que hay que hacer.",
              "No calcular el tamaño de posición y 'estimar a ojo': un error de calibración puede duplicar o triplicar el riesgo real.",
              "Ignorar el spread en el cálculo: el spread se suma a la pérdida potencial, hay que tenerlo en cuenta.",
            ],
          },
          {
            heading: "El error fatal",
            body: "Duplicar la apuesta después de una serie de pérdidas para 'recuperarse' más rápido. Ejemplo: cuenta de 1 000 €, riesgo al 3%. Pierdes 3 trades → -30 € × 3 = -90 €. Te quedan 910 €. Te dices: 'Arriesgo 10% en el próximo para recuperar de un golpe.' Pierdes ese trade también. -91 € más. Total: -181 € en 4 trades en vez de -90 € siguiendo la grilla. Multiplicar el riesgo después de pérdidas es el camino más rápido hacia la cuenta en cero.",
          },
        ],
        keyPoints: [
          "Adapta tu % de riesgo a tu capital: 200-500 € → 5%, 500-1000 € → 3%, 1000-5000 € → 2%",
          "Calcula tu riesgo en euros ANTES de entrar: Capital × % adaptado = monto máximo a perder",
          "Con 3% de riesgo, 10 pérdidas consecutivas = 74% del capital intacto. Puedes rebotar.",
          "Ratio R/R recomendado: 1:2 mínimo, apuntar a 2 veces lo que se arriesga",
          "Nunca aumentar el riesgo para 'recuperar', es el camino a la cuenta en cero",
        ],
        exercise: {
          title: "Calcular tu riesgo adaptado a tu capital",
          steps: [
            "Anota tu capital de demo (o el capital que piensas usar). Identifica tu tramo en la grilla: 200-500 € → 5%, 500-1000 € → 3%, 1000-5000 € → 2%.",
            "Calcula tu riesgo máximo por trade. Ejemplo: 700 € × 3% = 21 € máximo por trade.",
            "En TradingView (EUR/USD, H1), identifica un setup Long. ¿Dónde pondrás tu Stop Loss? Estima la pérdida en euros si el SL se activa con 0,1 lote.",
            "Compara ese monto con tu riesgo adaptado. Si superas tu máx, reduce el tamaño de posición hasta respetar el monto calculado.",
          ],
        },
        quiz: {
          question: "Tienes un capital de 700 €. ¿Cuál es la buena aplicación de la grilla de riesgo?",
          answers: [
            "1% de 700 € = 7 €, la regla universal siempre se aplica",
            "3% de 700 € = 21 €, adaptado al tramo 500-1 000 €",
            "5% de 700 € = 35 €, para maximizar las ganancias en capital chico",
            "10% de 700 € = 70 €, aceptable si el setup es 'seguro'",
          ],
          correct: 1,
          explanation:
            "700 € se ubica en el tramo 500-1 000 € → 3% de riesgo por trade = 21 € máximo. La regla 1% está diseñada para cuentas 5 000 €+, con 700 €, 1% = 7 €, a menudo inferior al riesgo generado por el lote mínimo disponible en los pares mayores.",
          answerExplanations: [
            "Falso. La regla 1% se aplica a cuentas de 5 000 €+. En 700 €, 1% = 7 €, a menudo inaplicable porque los lotes mínimo generan 10-20 € de riesgo en los pares mayores.",
            "Correcto. 700 € está en el tramo 500-1 000 €, entonces 3% de riesgo por trade = 21 €. Es el % adaptado que te permite ejecutar correctamente tus órdenes mientras proteges tu capital.",
            "Falso. 5% está adaptado al tramo 200-500 €. Con 700 €, estás en el tramo superior (3%). Usar 5% en 700 € sería sobre-arriesgar.",
            "Falso. 10% por trade = cuenta destruida en pocas series de pérdidas normales. No existe trade seguro.",
          ],
        },
      },

      // ─── Leçon 9 ────────────────────────────────────────────────────────────
      {
        id: "lecon-9",
        slug: "lecon9",
        title: "Los errores del principiante",
        duration: "11 min",
        introduction:
          "Los principiantes que pierden su cuenta casi nunca cometen errores de análisis. Cometen errores de comportamiento. Los mismos errores, repetidos por casi todo el mundo, en el mismo orden. Esta lección te los muestra antes de que los cometas.",
        sections: [
          {
            heading: "El principio, en una frase",
            body: "La mayoría de cuentas no se destruyen por malos análisis, se destruyen por malas decisiones tomadas bajo emoción. Reconocer estos errores de antemano es la primera línea de defensa.",
            items: [
              "Los errores de comportamiento cuestan más caro que los errores de análisis",
              "Estos errores son universales, experimentados y principiantes todos los cometen",
              "Conocerlos no basta, hay que haberlos vivido en cuenta demo para realmente evitarlos",
              "Un diario de trading es la única herramienta que permite detectarlos y corregirlos",
            ],
          },
          {
            heading: "Los 5 errores que destruyen las cuentas",
            body: "Estos errores no parecen peligrosos en el momento. Es exactamente por eso que hacen tanto daño.",
            items: [
              "1. Tradear sin Stop Loss — 'Vigilo el trade.' Una noticia económica, una conexión perdida, y pierdes 40% de la cuenta en 10 minutos.",
              "2. Sobre-tradear, abrir 15 trades por día porque te aburres. Más trades = más spreads pagados = cuenta que se derrite lento.",
              "3. Arriesgar demasiado, 10, 20% del capital en un trade 'seguro'. No existe trade seguro. Una serie de 3 pérdidas al 20% = 49% de la cuenta perdido.",
              "4. No respetar tu plan, entrar muy pronto, mover el SL, cerrar el TP a mitad de camino. La emoción retoma el control.",
              "5. Tradear directamente con plata real, sin haberse entrenado en cuenta demo. El estrés de la plata real lo cambia todo.",
            ],
          },
          {
            heading: "Las trampas psicológicas",
            body: "El trading no solo pone a prueba tu análisis, pone a prueba tu psicología. Estos sesgos golpean a todos los traders, incluso los experimentados. Conocerlos ayuda a detectarlos en el buen momento.",
            diagram: "errors",
          },
          {
            heading: "Cómo se ve cada sesgo en la práctica",
            body: "Acá tienes los 4 escenarios típicos que debes aprender a reconocer en el gráfico antes de que te cuesten caro.",
            diagram: "biaschart",
            table: {
              headers: ["Sesgo", "Lo que pasa", "Consecuencia típica"],
              rows: [
                ["FOMO", "El mercado sube fuerte, compras con urgencia", "Compras en el techo, justo antes del reversal"],
                ["Revenge trading", "Pierdes un trade, re-abres inmediatamente", "Pierdes aún más, con menos lucidez"],
                ["Anclaje", "Te niegas a cerrar un trade perdedor", "La pérdida se duplica, cierras en el peor momento"],
                ["Overconfidence", "5 trades ganadores seguidos, te sientes invencible", "Duplicas los lotes, el próximo trade borra todo"],
              ],
            },
          },
          {
            heading: "Errores frecuentes en esta última lección",
            body: "Hay un error específico en esta etapa del recorrido: leer estos errores, asentir con la cabeza, y pensar que no se aplican a ti.",
            items: [
              "Pensar 'yo no cometeré estos errores', si no los experimentas en cuenta demo, los cometerás en cuenta real",
              "Ignorar el diario de trading porque 'toma tiempo', es exactamente lo que separa a los traders que progresan del resto",
              "Pasar a cuenta real demasiado pronto: 3 semanas de demo no bastan. La disciplina se construye.",
              "Subestimar la psicología: la gestión de las emociones es tan importante, incluso más, como la estrategia técnica",
            ],
          },
          {
            heading: "El error fatal",
            body: "Pasar a cuenta real después de solo 2 semanas de demo porque 'va bien'. En demo, tomas buenas decisiones porque no hay nada en juego. En real, en la primera pérdida de 100 €, tu psicología cambia totalmente. Entras en pánico. Cierras muy pronto. Mueves tu Stop Loss. Abres por revanche. Todo lo que habías aprendido desaparece bajo la presión de la plata real. Mínimo 1 mes de demo rentable, sin excepción.",
          },
        ],
        keyPoints: [
          "Stop Loss obligatorio en cada trade, sin excepción, sin justificación",
          "Adapta tu % de riesgo a tu capital (ver lección 8), nunca sobre-arriesgar incluso en un trade 'seguro'",
          "Entrenarse en cuenta demo antes de pasar a plata real, mínimo 1 mes",
          "Tener un diario de trading, es la única herramienta que permite progresar de verdad",
          "Si pierdes 2 trades seguidos: detente, analiza, retoma fresco al día siguiente",
        ],
        exercise: {
          title: "Preparar tu plan de disciplina personal",
          steps: [
            "Escribe tus 3 reglas no-negociables: por ejemplo 'Stop Loss obligatorio, riesgo adaptado a mi capital (ver grilla lección 8), nunca entrar por FOMO'",
            "Define tu regla de stop diario: ¿en qué % de pérdida te detienes por el día?",
            "Abre una cuenta demo en MetaTrader 5 si todavía no lo hiciste. Empieza a aplicar estas reglas ya.",
            "Pasa tus 5 próximos trades en cuenta demo. Para cada trade, anota: entrada, SL, TP, resultado, y cómo te sentiste durante el trade.",
          ],
        },
        quiz: {
          question: "Acabas de perder dos trades seguidos. Estás estresado. ¿Cuál es la reacción más disciplinada?",
          answers: [
            "Abrir inmediatamente un tercer trade para recuperar las pérdidas",
            "Aumentar tu tamaño de posición para compensar las pérdidas más rápido",
            "Detenerte, analizar los dos trades en tu diario, retomar al día siguiente",
            "Pasar sin Stop Loss para tener más flexibilidad",
          ],
          correct: 2,
          explanation:
            "Dos pérdidas consecutivas en un estado de estrés es el terreno ideal para el revenge trading. La reacción disciplinada: detenerte por completo, analizar por qué perdiste (¿error de plan? ¿mal timing? ¿emoción?), y retomar fresco al día siguiente. El mercado va a seguir ahí mañana.",
          answerExplanations: [
            "Falso. Abrir un trade inmediatamente después de dos pérdidas para 'recuperar' es la definición del revenge trading. Tomas una decisión emocional bajo estrés, no analítica. Las probabilidades de perder de nuevo son estadísticamente mucho más altas en ese estado.",
            "Falso. Aumentar el tamaño de posición después de pérdidas es exactamente lo opuesto de lo que hay que hacer. Estás en el peor estado emocional posible. Si pierdes de nuevo con un tamaño aumentado, los daños son exponencialmente más grandes.",
            "Correcto. Detenerse y analizar en el diario: ¿los dos trades seguían el plan? ¿Hubo errores de ejecución? Es tranquilo, es factual, y es lo que permite progresar. Retomar mañana, descansado, con un plan claro.",
            "Falso. Quitar el Stop Loss después de pérdidas en un estado de estrés es la decisión más peligrosa posible. Aumentas tu exposición al riesgo en el momento en que estás menos en condición de gestionar una mala situación.",
          ],
        },
      },
    ],
  },
];
