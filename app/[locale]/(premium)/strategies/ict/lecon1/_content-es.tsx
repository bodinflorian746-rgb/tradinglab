"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { IctLiquidityGrabDiagram } from "@/app/components/charts/IctLiquidityGrabDiagram";
import { FalseBreakoutTrapDiagram } from "@/app/components/charts/FalseBreakoutTrapDiagram";
import { PostSweepReactionDiagram } from "@/app/components/charts/PostSweepReactionDiagram";

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
    setDone(isLessonComplete(getStoredProgress(), "ict", "lecon1"));
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
          <span className="text-zinc-500">Lección 1</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">
              Avanzado
            </span>
            <span className="text-zinc-700 text-xs">·</span>
            <span className="text-xs text-zinc-600">18 min</span>
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
            Entender el modelo ICT: liquidity y manipulación
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              El mercado no rompe los máximos por casualidad. Suele ir a buscar la liquidity antes del verdadero desplazamiento.
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
              const isCurrent = lesson.id === "lecon1";
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
            <span className="ml-auto text-xs text-zinc-600">1 / 5 lecciones</span>
          </div>
        </header>

        <div className="space-y-8">

          {/* Bloque 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-amber-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « El mercado no paga las obviedades. Paga a los que esperan a que la manipulación se consume. »
              </p>
            </div>
          </section>

          {/* Bloque 2 — PRERREQUISITOS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerrequisitos</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Estructura de mercado, BOS y CHoCH → ver módulo SMC, lección « BOS y CHoCH: leer las señales estructurales institucionales »</li>
              <li>- FVG y liquidity → ver módulo SMC, lección « FVG y liquidity: tradear el desequilibrio institucional »</li>
              <li>- Multi-timeframe → ver módulo Multi-timeframe Process</li>
            </ul>
          </div>

          {/* Bloque 3 — EL MERCADO BUSCA LAS ZONAS OBVIAS */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">El mercado busca las zonas obvias</h2>

            <div className="my-8">
              <IctLiquidityGrabDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              La grilla de lectura ICT parte de una constatación simple: los niveles más obvios, equal highs, equal lows, últimos máximos o mínimos claramente visibles en el gráfico, concentran las órdenes stop de los participantes retail. Stop loss arriba de un máximo, stop loss debajo de un mínimo: estas zonas forman bolsas de liquidity visibles a simple vista en el gráfico. El mercado va a ir ahí, mecánicamente, porque es donde duermen las órdenes que hacen funcionar los algoritmos institucionales.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Ejemplo concreto</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD H1: dos máximos casi idénticos se forman en 1.1780 durante algunas horas. Todos los traders en short ven esta resistencia y colocan su SL justo encima, hacia 1.1790-1.1795. El mercado sube por tercera vez, atraviesa 1.1780, alcanza 1.1792, todos los stops se disparan, y luego cae violentamente hacia 1.1720. La liquidity fue tomada, el movimiento real comienza después.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Equal highs / equal lows = liquidity visible a simple vista</li>
              <li>- Mientras más obvio sea un nivel, más stops concentra</li>
              <li>- El mercado va a buscar esas zonas, no es casualidad, es ejecución de órdenes</li>
              <li>- Tradear el breakout ingenuo de esos niveles = posicionarte del lado equivocado</li>
            </ul>
          </section>

          {/* Bloque 4 — UNA RUPTURA NO ES SIEMPRE UNA CONTINUACIÓN */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Una ruptura no siempre es una continuación</h2>

            <div className="my-8">
              <FalseBreakoutTrapDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              El reflejo natural de un trader principiante frente a una ruptura de resistencia es comprar el breakout. El reflejo ICT es preguntarse si esa ruptura se mantiene o si es una simple manipulación. Una ruptura que no se confirma, es decir que no es seguida de una continuación franca en la nueva dirección, es casi siempre una trampa. El precio regresa debajo de la resistencia, y todos los que compraron el breakout se encuentran en pérdida al instante.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Ejemplo concreto</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                XAU/USD M15: la resistencia está en 4 680 $, testeada varias veces. Una vela rompe arriba, alcanza 4 695 $, los traders breakout entran en compra con su SL debajo de 4 680. Algunas velas después, el precio regresa debajo de 4 680, baja rápido hacia 4 650. La ruptura no se mantuvo, solo servía para disparar las órdenes breakout y alimentar la caída.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Una ruptura solo tiene valor si se mantiene y va seguida de una continuación</li>
              <li>- Reintegración inmediata debajo del nivel roto = trampa, se invierte mentalmente el escenario</li>
              <li>- El breakout ingenuo es una de las configuraciones más caras para los traders retail</li>
              <li>- El ICT no tradea la ruptura, tradea lo que pasa DESPUÉS</li>
            </ul>
          </section>

          {/* Bloque 5 — LA VERDADERA SEÑAL = LA REACCIÓN DESPUÉS DE LA LIQUIDITY */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">La verdadera señal = la reacción después de la liquidity</h2>

            <div className="my-8">
              <PostSweepReactionDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              El corazón del modelo ICT cabe en una frase: no se tradea la toma de liquidity, se tradea la REACCIÓN que sigue. El sweep en sí mismo no es una señal, es una condición previa. La señal llega justo después: el precio debe reintegrarse debajo (o arriba, según el sentido) del nivel barrido, y luego una vela impulsiva franca debe confirmar el retroceso. Es esa secuencia sweep → reintegración → impulso la que valida una entrada, no la mecha del sweep sola.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Ejemplo concreto</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                Gráfico M15 EUR/USD: el precio acaba de imprimir una mecha arriba de 1.1780 (sweep). En la siguiente vela, cierra debajo de 1.1780 (reintegración). En la vela siguiente, gran cuerpo bajista de 35 pts (impulso). Es esa secuencia la que autoriza un short, entrada en la ruptura del último mínimo local, SL justo arriba del máximo del sweep, TP hacia la próxima zona de liquidity más abajo.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- El sweep solo no dispara nada, es una condición, no una señal</li>
              <li>- La reintegración debajo del nivel barrido es la primera confirmación</li>
              <li>- Una vela impulsiva franca en la nueva dirección valida la entrada</li>
              <li>- SL ajustado arriba del máximo del sweep, la estructura invalida el escenario</li>
            </ul>
          </section>

          {/* Bloque 6 — PLAN DE APLICACIÓN */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan de aplicación: un sweep EUR/USD completo</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Aquí está la secuencia completa HTF → Liquidity → Sweep → Reacción en un caso EUR/USD. Cuatro etapas, cada una con su rol.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Etapa 1. HTF (Daily): sesgo direccional</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observación: EUR/USD Daily en estructura LH/LL desde hace tres semanas, resistencia mayor 1.1860</li>
                <li>- Conclusión: sesgo bajista confirmado, se buscarán shorts en toma de liquidity alta</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Etapa 2. Liquidity (H1): identificar el objetivo</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observación: dos máximos casi idénticos formados en 1.1780 en la última sesión</li>
                <li>- Conclusión: equal highs en 1.1780 = liquidity visible. Los stops short duermen arriba, hacia 1.1790-1.1795</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Etapa 3. Sweep (M15): esperar la toma</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observación: una vela M15 imprime una mecha arriba de 1.1780, alcanza 1.1792, y cierra debajo de 1.1780</li>
                <li>- Conclusión: la liquidity fue tomada. Pasamos en modo « vigilancia » para la reacción, sin entrada todavía</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Etapa 4. Reacción (M15): ejecutar</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observación: la vela siguiente es un gran cuerpo bajista impulsivo (35 pts), ruptura del último mínimo local en 1.1762</li>
                <li>- Conclusión: entrada short en 1.1758 en la ruptura, SL en 1.1795 (3 pts arriba del máximo del sweep), TP hacia la próxima zona de liquidity baja en 1.1695. R/R ≈ 1 : 1,7, setup de alta probabilidad alineado Daily + sweep + reacción</li>
              </ul>

              <div className="border-t border-zinc-800/60 pt-3 mt-3">
                <p className="text-sm text-zinc-300 italic text-center">
                  HTF = sesgo · Liquidity = objetivo · Sweep = condición · Reacción = señal
                </p>
              </div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "El mercado va a buscar las zonas de liquidity obvias, equal highs/lows, últimos máximos/mínimos visibles.",
              "Una ruptura no es una continuación mientras no se mantenga. La reintegración debajo del nivel roto es señal de manipulación.",
              "La verdadera señal de entrada llega DESPUÉS del sweep: reintegración + vela impulsiva en la dirección opuesta.",
              "Sin reacción franca, el sweep solo no basta, la paciencia prima sobre la necesidad de tradear la mecha.",
            ]}
          />

          <LessonExercice
            description="En TradingView, identifica un sweep completo en el par de tu elección y traza la secuencia HTF → Liquidity → Sweep → Reacción."
            steps={[
              "HTF (Daily o H4): identifica la estructura y concluye un sesgo direccional claro. Sin sesgo HTF nítido, no bajes más.",
              "H1: identifica dos máximos casi idénticos (equal highs) o dos mínimos casi idénticos (equal lows) en el sentido del sesgo. Traza una línea horizontal en ese nivel, es la zona de liquidity objetivo.",
              "M15: espera a que el precio venga a hacer sweep de ese nivel (mecha que rebasa, cuerpo que cierra del lado correcto). Luego busca la reintegración y la vela impulsiva. Si la secuencia está completa, anota la entrada, el SL arriba/debajo del máximo/mínimo del sweep, y el TP hacia la próxima zona de liquidity.",
            ]}
          />

          <LessonQuiz
            question="El precio acaba de imprimir una mecha arriba de un equal high en 1.1780, alcanza 1.1792 y luego cierra debajo de 1.1780. ¿Qué buscas para validar una entrada short?"
            options={[
              "Entras de inmediato: el sweep solo es la señal de entrada",
              "Esperas una vela bajista impulsiva después de la reintegración debajo del nivel",
              "Esperas una vela verde en M1 que confirme la reanudación alcista",
              "Esperas que el precio retoque exactamente el máximo de la mecha en 1.1792 antes de entrar",
            ]}
            correctIndex={1}
            explanation="El sweep solo es una condición previa, no una señal. El modelo ICT exige una SECUENCIA completa: sweep → reintegración debajo del nivel → vela impulsiva en la nueva dirección. Sin esa vela impulsiva de confirmación, no se entra, la paciencia permite evitar las señales falsas donde el sweep va seguido de una consolidación lateral o de otro push alcista."
            answerExplanations={[
              "Falso. Entrar en el sweep solo, sin esperar la reacción, es tradear la mecha, exactamente lo que el modelo ICT busca evitar. El sweep puede ir seguido de una consolidación, de otro push alcista, o de nada. Sin confirmación, es una apuesta.",
              "Correcto. La secuencia ICT completa exige sweep → reintegración → vela impulsiva. Es el impulso bajista el que confirma que la toma de liquidity se tradujo en movimiento real. La entrada se hace en la ruptura del último mínimo local, SL ajustado arriba del máximo del sweep.",
              "Falso. Una vela verde indicaría la reanudación alcista, es decir la invalidación del escenario short. Para validar un short, se busca una vela ROJA impulsiva, no verde. Además, bajar hasta M1 para buscar una confirmación va en contra del modelo, que se ejecuta en M15.",
              "Falso. Un sweep nunca se vuelve a jugar exactamente al pip. Esperar la retocada del máximo de la mecha es esperar un evento que no llegará, el precio se va en la dirección opuesta mientras miras en el lugar equivocado.",
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
                  markLessonComplete(p, "ict", "lecon1");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lección 1 del módulo ICT completo terminada.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between gap-4">
              <Link href="/strategies/ict" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Módulo ICT. Vista general
              </Link>
              <Link href="/strategies/ict/lecon2" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                Lección siguiente
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
