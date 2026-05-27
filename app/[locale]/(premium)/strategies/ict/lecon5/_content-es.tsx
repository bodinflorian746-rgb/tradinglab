"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { ICTSequenceTimelineDiagram } from "@/app/components/charts/ICTSequenceTimelineDiagram";
import { ICTLiquidityPrepDiagram } from "@/app/components/charts/ICTLiquidityPrepDiagram";
import { ICTDisplacementSetupDiagram } from "@/app/components/charts/ICTDisplacementSetupDiagram";
import { ICTTimingDiagram } from "@/app/components/charts/ICTTimingDiagram";

const LESSONS = [
  { id: "lecon1", title: "Liquidity y manipulación", disabled: false },
  { id: "lecon2", title: "PD Arrays", disabled: false },
  { id: "lecon3", title: "Killzones", disabled: false },
  { id: "lecon4", title: "Displacement", disabled: false },
  { id: "lecon5", title: "Modelo ICT completo", disabled: false },
];

export default function ContentEs() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "ict", "lecon5"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Estrategias</Link>
          <span>/</span>
          <Link href="/strategies/ict" className="hover:text-zinc-400 transition-colors">ICT completo</Link>
          <span>/</span>
          <span className="text-zinc-500">Lección 5</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">
              Avanzado
            </span>
            <span className="text-zinc-700 text-xs">·</span>
            <span className="text-xs text-zinc-600">20 min</span>
            {done && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                  <path d="M1 4.5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Terminada
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold leading-tight mb-4">
            El modelo ICT completo: de la liquidity a la ejecución
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              El mercado no produce los verdaderos movimientos al azar. La mayoría de los setups ICT siguen una secuencia precisa: liquidity → manipulación → displacement → ejecución.
            </p>
          </div>

          <div className="mt-5 flex items-center gap-2 text-xs text-zinc-600">
            {["Lectura", "Para recordar", "Ejercicio", "Quiz"].map((step, i, arr) => (
              <span key={step} className="flex items-center gap-2">
                <span>{step}</span>
                {i < arr.length - 1 && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-zinc-800 shrink-0">
                    <path d="M3 2l4 3-4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-2 flex-wrap">
            {LESSONS.map((lesson) => {
              const isCurrent = lesson.id === "lecon5";
              return (
                <div key={lesson.id}>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                    isCurrent
                      ? "bg-zinc-800 border-zinc-600 text-white"
                      : lesson.disabled
                      ? "border-zinc-800/50 text-zinc-700"
                      : "border-zinc-800 text-zinc-500"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? "bg-white" : lesson.disabled ? "bg-zinc-700" : "bg-zinc-600"}`} />
                    {isCurrent ? (
                      <>
                        <span className="md:hidden">Lección {lesson.id.replace("lecon", "")}</span>
                        <span className="hidden md:inline">{lesson.title}</span>
                      </>
                    ) : (
                      lesson.title
                    )}
                  </span>
                </div>
              );
            })}
            <span className="ml-auto text-xs text-zinc-600">5 / 5 lecciones</span>
          </div>
        </header>

        <div className="space-y-8">

          {/* Bloque 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-amber-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « Un trade ICT no es una reacción a una señal. Es la culminación de una secuencia que vimos venir. »
              </p>
            </div>
          </section>

          {/* Bloque 2 — PRERREQUISITOS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerrequisitos</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Liquidity y manipulación → ver módulo ICT, Lección 1</li>
              <li>- PD Arrays y FVG → ver módulo ICT, Lección 2</li>
              <li>- Killzones → ver módulo ICT, Lección 3</li>
              <li>- Displacement → ver módulo ICT, Lección 4</li>
            </ul>
          </div>

          {/* Bloque 3 — EL MODELO ICT FUNCIONA POR SECUENCIA */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">El modelo ICT funciona por secuencia</h2>

            <div className="my-8">
              <ICTSequenceTimelineDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              El modelo ICT no se tradea por señal aislada: se tradea por secuencia. La mayoría de los trades de alta probabilidad encadenan una serie de eventos estructurales que se construyen unos sobre otros: un sesgo HTF que define la dirección, una liquidity identificada como objetivo probable, un sweep que la toma, un displacement que valida la intención, un FVG que abre una ventana de entrada, y luego la ejecución al regreso. Leer la secuencia es anticipar el trade, no padecerlo.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- El modelo ICT = secuencia de eventos, no señal aislada</li>
              <li>- Cada etapa construye la siguiente, saltar una etapa rompe la lectura</li>
              <li>- Leer la secuencia permite anticipar la ejecución antes de que llegue</li>
              <li>- Tradear fuera de secuencia = caer de nuevo en el patrón reactivo</li>
            </ul>
          </section>

          {/* Bloque 4 — LA LIQUIDITY PREPARA EL MOVIMIENTO */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">La liquidity prepara el movimiento</h2>

            <div className="my-8">
              <ICTLiquidityPrepDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              La primera etapa de toda secuencia ICT es la liquidity. Antes de que llegue un verdadero movimiento institucional, hay que identificar DÓNDE se encuentra la liquidity visible, equal highs, equal lows, últimos máximos / mínimos claramente identificables. Esa liquidity es el objetivo probable del próximo sweep. La secuencia no arranca antes de que esa bolsa sea tomada: si el precio gira a su alrededor sin tocarla, se espera.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Ejemplo concreto</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD H1: precio actual 1.1745, sesgo Daily bajista, resistencia Daily en 1.1780. Dos equal highs visibles en 1.1780 en las horas anteriores, la liquidity arriba de esos máximos es el objetivo. El escenario completo espera a que esa liquidity sea tomada (mecha arriba de 1.1780) antes de buscar la ejecución short. Sin sweep, sin secuencia, se espera.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- La liquidity = equivalente estructural del objetivo probable</li>
              <li>- Equal highs / equal lows / últimos máximos-mínimos = bolsas visibles</li>
              <li>- Sin sweep = sin secuencia; no se anticipa la toma</li>
              <li>- La toma de liquidity es el disparador de la fase siguiente (manipulación)</li>
            </ul>
          </section>

          {/* Bloque 5 — EL DISPLACEMENT CREA EL SETUP */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">El displacement crea el setup</h2>

            <div className="my-8">
              <ICTDisplacementSetupDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Una vez la liquidity tomada por el sweep, la etapa crítica es el displacement: la secuencia de velas impulsivas que muestra que el mercado se ha invertido realmente en la dirección del sesgo HTF. Sin displacement, el sweep puede ser un movimiento falso, el precio hace sweep, duda, y luego se va en la dirección inicial. CON displacement, la intención institucional es clara y el FVG dejado en la caída (o el alza) se convierte en la zona de ejecución. La entrada se toma al regreso del precio a ese FVG.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Ejemplo concreto</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD: después del sweep en 1.1792, 4 velas bajistas consecutivas con cuerpos grandes regresan el precio a 1.1748. Se deja un FVG entre 1.1768 y 1.1780. El displacement valida la intención vendedora. El precio sube luego progresivamente hacia el FVG: entrada short al regreso a la banda, SL arriba de 1.1780 (extremo del displacement), TP hacia la próxima liquidity baja.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Sweep sin displacement = movimiento falso, no se entra</li>
              <li>- El displacement valida la intención y crea el FVG (zona de ejecución)</li>
              <li>- La entrada se toma al REGRESO al FVG, no durante el displacement</li>
              <li>- SL arriba del extremo del displacement = estructura de invalidación clara</li>
            </ul>
          </section>

          {/* Bloque 6 — EL TIMING SIGUE SIENDO ESENCIAL */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">El timing sigue siendo esencial</h2>

            <div className="my-8">
              <ICTTimingDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              La secuencia ICT solo tiene todo su valor en Killzone. El mismo encadenamiento liquidity → sweep → displacement → FVG puede producirse técnicamente en Asia Session, pero con una probabilidad de continuación baja, falta volumen para sostener el movimiento. Las secuencias de alta probabilidad siempre combinan setup ICT Y timing: sweep de un range Asia en London Open, sweep de un equal high en NY Open, displacement en la apertura de una Killzone. Sin timing favorable, se espera la próxima ventana.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Ejemplo concreto</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                XAU/USD: range Asia entre 4 642 y 4 655 $. En la apertura de London, mecha de sweep arriba de 4 655 $, luego displacement bearish de 38 $ que crea un FVG en la caída. Setup completo Y en Killzone = setup premium. La misma secuencia a las 03h UTC probablemente habría fracasado, al mercado le faltaba volumen para sostener el displacement.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Setup ICT + timing Killzone = setup premium</li>
              <li>- Setup ICT fuera de Killzone = probabilidad reducida, desplazamientos limitados</li>
              <li>- Las mejores secuencias se desarrollan en la apertura de London o NY</li>
              <li>- Filtrar por timing elimina los setups técnicos sin energía para concretarse</li>
            </ul>
          </section>

          {/* Bloque 7 — PLAN DE APLICACIÓN */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan de aplicación: una secuencia ICT completa EUR/USD</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Aquí está la secuencia completa, de la lectura del contexto a la ejecución. Seis etapas, cada una con su rol distinto.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Etapa 1. HTF (Daily): sesgo direccional</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observación: EUR/USD Daily en LH/LL, resistencia Daily en 1.1780</li>
                <li>- Conclusión: sesgo bajista, toda la secuencia buscará un short</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Etapa 2. Liquidity (H1): identificar el objetivo</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observación: dos equal highs visibles en 1.1780, stops acumulados arriba</li>
                <li>- Conclusión: la liquidity arriba de 1.1780 es el objetivo probable del próximo sweep</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Etapa 3. Sweep (M15 en Killzone)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observación: en la apertura NY, mecha en 1.1792 y luego reintegración debajo de 1.1780</li>
                <li>- Conclusión: la liquidity está tomada. Ahora se espera el displacement</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Etapa 4. Displacement bearish</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observación: 4 velas M15 bajistas consecutivas con cuerpos grandes, caída hasta 1.1748. FVG visible entre 1.1768 y 1.1780</li>
                <li>- Conclusión: displacement validado, el FVG es la zona de ejecución</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Etapa 5. Regreso al FVG</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observación: en las horas siguientes, el precio sube progresivamente y entra a la banda 1.1768-1.1780</li>
                <li>- Conclusión: zona de ejecución activa, se vigila la confirmación de rechazo</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Etapa 6. Ejecución</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observación: una vela M15 de rechazo aparece en el FVG, seguida de una vela bajista impulsiva</li>
                <li>- Conclusión: entrada short en 1.1774, SL en 1.1798 (arriba del extremo del displacement), TP hacia 1.1695. R/R ≈ 1 : 3,3, secuencia ICT completa y alineada</li>
              </ul>

              <div className="border-t border-zinc-800/60 pt-3 mt-3">
                <p className="text-sm text-zinc-300 italic text-center">
                  HTF = sesgo · Liquidity = objetivo · Sweep = condición · Displacement = confirmación · FVG = ejecución
                </p>
              </div>
            </div>
          </section>

          {/* Bloque 8 — LOS ERRORES QUE ROMPEN EL MODELO ICT */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Los errores que rompen el modelo ICT</h2>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              El modelo es potente mientras se respete en el orden. En el momento en que se salta una etapa o se lee la secuencia al revés, se cae de nuevo en el trading reactivo. Aquí están los cuatro deslices más frecuentes.
            </p>

            <div className="grid gap-3 my-6">
              <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-950/60">
                <p className="text-white font-semibold text-sm mb-1.5">1. Entrar en el sweep solo</p>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Ver una mecha rebasar un equal high y entrar de inmediato, sin esperar el displacement, es tradear la mecha, exactamente la trampa que la secuencia busca evitar. El sweep es solo una condición previa; sin displacement que siga, es apenas un movimiento falso.
                </p>
              </div>

              <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-950/60">
                <p className="text-white font-semibold text-sm mb-1.5">2. Saltar el HTF</p>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Identificar un sweep y un displacement sin haber puesto antes el sesgo Daily / H4 es confundir setup local con trade. El HTF dicta la dirección de los trades autorizados, sin esa lectura, la secuencia puede moverse correctamente y posicionarte del lado equivocado del movimiento real.
                </p>
              </div>

              <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-950/60">
                <p className="text-white font-semibold text-sm mb-1.5">3. Tradear fuera de Killzone</p>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Una secuencia técnicamente perfecta que se desarrolla durante la Asia Session tiene una probabilidad de continuación muy baja. Falta volumen para sostener el displacement, el FVG no se respeta, la ejecución se diluye en la lateralización. Setup correcto + timing podrido = sin trade.
                </p>
              </div>

              <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-950/60">
                <p className="text-white font-semibold text-sm mb-1.5">4. Entrar durante el displacement</p>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Ver el displacement en curso y buscar subirse en marcha es perder la entrada limpia y aceptar un SL demasiado amplio. La entrada ICT se toma al REGRESO al FVG, jamás durante la secuencia de impulso. La paciencia entre displacement y regreso es lo que hace que el R/R sea favorable.
                </p>
              </div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "El modelo ICT es una SECUENCIA, liquidity, manipulación, displacement, ejecución, no una señal aislada.",
              "Cada etapa construye la siguiente: saltar o invertir el orden rompe la lectura del mercado.",
              "El FVG creado por el displacement es la zona de ejecución, se entra al regreso, jamás durante el impulso.",
              "El timing (Killzones) sigue siendo esencial: un setup ICT fuera de Killzone es estadísticamente no rentable.",
            ]}
          />

          <LessonExercice
            description="En TradingView, desarrolla una secuencia ICT completa en el par de tu elección, del Daily a la ejecución."
            steps={[
              "HTF (Daily): concluye un sesgo direccional claro. Identifica en H1 una bolsa de liquidity visible en el sentido del sesgo (equal highs/lows, último máximo/mínimo).",
              "Espera una Killzone (London o NY Open). Vigila el sweep de la liquidity identificada, y luego el displacement que sigue. Si la secuencia se detiene en el sweep sin displacement, es un movimiento falso, sin trade.",
              "Traza el FVG dejado por el displacement. Espera el regreso del precio a la banda. Si la reacción confirma (vela de rechazo + impulso), anota la entrada, el SL arriba del extremo del displacement, el TP hacia la próxima liquidity.",
            ]}
          />

          <LessonQuiz
            question="Ves en EUR/USD una mecha que hace sweep de equal highs en 1.1780, subiendo hasta 1.1792. Ninguna vela de displacement bearish sigue, el precio consolida alrededor de 1.1782 durante 6 velas. ¿Qué haces?"
            options={[
              "Entras short de inmediato: el sweep solo es la señal de entrada del modelo ICT",
              "No entras: sin displacement después del sweep, la secuencia ICT no está validada",
              "Entras long suponiendo que la consolidación va a romper al alza",
              "Colocas una orden limit en 1.1780 y dejas que se ejecute automáticamente",
            ]}
            correctIndex={1}
            explanation="El sweep es solo una condición previa de la secuencia ICT, no una señal de entrada. Sin el displacement bearish que sigue, la intención institucional no está confirmada, la consolidación arriba del nivel barrido incluso sugiere que el sweep podría ser un movimiento falso. La disciplina del modelo es clara: sin displacement, sin secuencia, sin entrada. Se espera a que el mercado hable más claro antes de actuar."
            answerExplanations={[
              "Falso. Entrar en el sweep solo es exactamente la trampa que la secuencia ICT busca evitar. El sweep es una condición, no una señal, sin displacement, nada confirma la intención vendedora.",
              "Correcto. La secuencia ICT exige sweep + displacement + FVG + regreso. Si el displacement no se materializa tras el sweep, falta la etapa siguiente, la secuencia no está validada. La disciplina es no entrar.",
              "Falso. Anticipar la dirección de una consolidación sin señal estructural es especulación pura. Y tradear long contra el sesgo HTF bajista supuesto es doblemente riesgoso.",
              "Falso. Colocar una orden limit transforma un setup no confirmado en una apuesta automática. Es uno de los peores hábitos, se asume el riesgo sin haber verificado que la secuencia se desarrolle realmente.",
            ]}
          />

          <LessonQuiz
            question="Tienes un setup ICT técnicamente completo (sweep, displacement, FVG) en EUR/USD a las 04h UTC en plena Asia Session. El precio acaba de entrar al FVG. ¿Qué haces?"
            options={[
              "Entras: el setup está técnicamente validado, no importa la hora",
              "Entras con un SL ampliado para absorber la baja liquidity de Asia",
              "No entras: sin Killzone, el setup ICT tiene una probabilidad de continuación muy baja",
              "Esperas a que el precio salga del FVG y tomas la ruptura",
            ]}
            correctIndex={2}
            explanation="El timing es un componente estructural del modelo ICT, no un detalle secundario. Una secuencia ICT técnicamente perfecta fuera de Killzone carece de volumen institucional para sostener la continuación, el precio en el FVG puede quedarse lateral varias horas sin disparar nada. La disciplina ICT consiste en filtrar por timing ANTES de ejecutar, no en ejecutar todo setup técnicamente válido. Se espera la próxima Killzone."
            answerExplanations={[
              "Falso. « No importa la hora » contradice el modelo ICT, que integra el timing como una condición estructural. Un setup técnicamente perfecto sin timing favorable es estadísticamente no rentable.",
              "Falso. Ampliar el SL no corrige el problema de fondo: al mercado le falta volumen para ejecutar el escenario. Solo se asume más riesgo en un setup que probablemente no se disparará.",
              "Correcto. La secuencia ICT exige timing Y setup. Fuera de Killzone, la probabilidad de que el FVG sea respetado y de que la continuación se produzca cae drásticamente. La disciplina es esperar London o NY para ejecutar.",
              "Falso. « Salir del FVG » y « tomar la ruptura » es una lectura mecánica sin lógica estructural. El FVG no es un range que se tradea en breakout, es una zona de entrada por rechazo, no por salida.",
            ]}
          />

          <LessonQuiz
            question="¿Cuál es el error más peligroso en la aplicación del modelo ICT?"
            options={[
              "Entrar durante el displacement en lugar de esperar el regreso al FVG",
              "Memorizar mal los horarios exactos de las Killzones en UTC",
              "Confundir un FVG bearish y un FVG bullish a simple vista en el gráfico",
              "Usar pares mayores en vez de pares exóticos",
            ]}
            correctIndex={0}
            explanation="Entrar durante el displacement es saltarse la etapa crítica de la secuencia ICT: esperar el regreso al FVG. Ese error tiene dos consecuencias mayores: un SL mucho más amplio (porque se entra en pleno impulso en curso) y un R/R catastrófico. La lógica del modelo es esperar entre el displacement y el regreso para obtener una entrada ajustada con un SL estructural, saltarse esa paciencia es invertir la relación riesgo/recompensa de toda la secuencia."
            answerExplanations={[
              "Correcto. Es el error más costoso porque arruina el R/R del setup. Entrar en pleno displacement = SL demasiado amplio + entrada demasiado tardía. El ICT impone la paciencia: se espera el regreso al FVG.",
              "Falso. Los horarios exactos se pueden consultar en cualquier terminal. No es un error estructural, es un detalle técnico fácil de corregir.",
              "Falso. La distinción bearish/bullish de un FVG viene de la dirección del desplazamiento que lo creó, no de una lectura visual. Es una comprensión del concepto, no un error de aplicación.",
              "Falso. La elección del par es una preferencia personal, no un error del modelo. Los pares mayores son simplemente más líquidos y ofrecen secuencias más limpias.",
            ]}
          />

        </div>

        {/* Footer */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "ict", "lecon5");
                  setDone(true);
                }}
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] text-zinc-950 font-semibold py-3.5 rounded-xl transition-all duration-150 shadow-lg shadow-emerald-500/10"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8l3.5 3.5 6.5-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Marcar lección como completada
              </button>
            ) : (
              <div className="flex items-center gap-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-5 py-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-emerald-400">
                    <path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-emerald-400">Lección completada</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Lección 5 del módulo ICT completo terminada.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between gap-4">
              <Link href="/strategies/ict/lecon4" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lección anterior
              </Link>
              <Link href="/strategies/ict" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                Volver al módulo
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M6 4l4 3-4 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
