"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { KillzonesTimelineDiagram } from "@/app/components/charts/KillzonesTimelineDiagram";
import { AsiaRangeSweepDiagram } from "@/app/components/charts/AsiaRangeSweepDiagram";
import { NYOpenExpansionDiagram } from "@/app/components/charts/NYOpenExpansionDiagram";
import { TimingComparisonDiagram } from "@/app/components/charts/TimingComparisonDiagram";

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
    setDone(isLessonComplete(getStoredProgress(), "ict", "lecon3"));
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
          <span className="text-zinc-500">Lección 3</span>
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
            Killzones: cuando el mercado realmente se mueve
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              El mercado no produce sus mayores movimientos al azar. Ciertas horas concentran la mayoría de los impulsos, manipulaciones y expansiones.
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
              const isCurrent = lesson.id === "lecon3";
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
            <span className="ml-auto text-xs text-zinc-600">3 / 5 lecciones</span>
          </div>
        </header>

        <div className="space-y-8">

          {/* Bloque 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-amber-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « El mercado pasa el 80 % de su día esperando. Todo lo que cuenta se juega en el 20 % restante. »
              </p>
            </div>
          </section>

          {/* Bloque 2 — PRERREQUISITOS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerrequisitos</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Liquidity y manipulación → ver módulo ICT, Lección 1</li>
              <li>- PD Arrays y FVG → ver módulo ICT, Lección 2</li>
              <li>- Multi-timeframe → ver módulo Multi-timeframe Process</li>
            </ul>
          </div>

          {/* Bloque 3 — EL MERCADO NO SE MUEVE IGUAL TODO EL DÍA */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">El mercado no se mueve igual todo el día</h2>

            <div className="my-8">
              <KillzonesTimelineDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              La volatilidad del mercado no se distribuye uniformemente a lo largo de 24 horas. Ciertas ventanas horarias, llamadas Killzones por la metodología ICT, concentran casi la totalidad de los movimientos significativos: impulsos, tomas de liquidity, expansiones de range, retrocesos estructurales. Fuera de las Killzones, el mercado suele estar plano — velas planas, lateralización, señales falsas. Reconocer estas ventanas es traducir el timing en ventaja estadística.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- 80 % de los movimientos significativos se producen en el 20 % de las horas</li>
              <li>- Fuera de Killzone: range estrecho, velas planas, sweeps lentos</li>
              <li>- En Killzone: expansión, impulsos francos, verdaderos desplazamientos</li>
              <li>- Tradear sin mirar la hora es tradear a ciegas</li>
            </ul>
          </section>

          {/* Bloque 4 — LA ASIA SESSION SUELE SERVIR DE LIQUIDITY */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">La Asia Session suele servir de liquidity</h2>

            <div className="my-8">
              <AsiaRangeSweepDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              La sesión asiática (aproximadamente 00h-07h UTC) rara vez produce grandes movimientos direccionales. Suele dibujar un range estrecho, con velas de baja amplitud y poco volumen. Pero ese range tiene una función estructural mayor: sirve de objetivo de liquidity para las sesiones siguientes. El máximo y el mínimo del range Asia concentran los stops depositados por los traders que posicionaron su SL « justo arriba » o « justo debajo » de la sesión tranquila. Londres o Nueva York suelen venir a hacer sweep de esos niveles desde la apertura, y luego impulsan en la dirección opuesta.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Ejemplo concreto</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD M15: durante la sesión asiática, el precio oscila en un range estrecho entre 1.1710 y 1.1725. En la apertura de Londres, una vela rompe debajo de 1.1710, baja hasta 1.1702 — los stops debajo del range Asia se disparan. De inmediato, el precio sale disparado hacia 1.1750 en una secuencia alcista impulsiva. El objetivo no era la ruptura bajista, era la liquidity.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- El range Asia = bolsa de liquidity visible</li>
              <li>- Los stops acumulados arriba y debajo de ese range son el objetivo de London / NY</li>
              <li>- Sweep del range Asia + reintegración = señal clásica de expansión</li>
              <li>- Tradear Asia sin contexto de sesión = sufrir los sweeps que vendrán</li>
            </ul>
          </section>

          {/* Bloque 5 — NY OPEN SUELE PRODUCIR LOS MAYORES DESPLAZAMIENTOS */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">New York Open suele producir los mayores desplazamientos</h2>

            <div className="my-8">
              <NYOpenExpansionDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              La apertura de Nueva York (13h30-14h30 UTC según la estación) coincide con la llegada masiva del volumen institucional americano, además de la sesión de Londres ya activa. Esta superposición produce frecuentemente las expansiones más violentas del día: impulso explosivo en una dirección, sweep de un máximo o un mínimo reciente, y luego retroceso franco en el otro sentido. Los setups SMC/ICT preparados con antelación (PD Arrays, equal highs/lows) suelen « resolverse » en pocas velas en la apertura de NY.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Ejemplo concreto</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                Gráfico M15 XAU/USD: justo antes de la apertura de Nueva York, el precio consolida alrededor de 4 640 $ en velas planas de baja amplitud. En la apertura, después de 13h30-14h30 UTC según la estación, una vela explosiva alcista de 28 $ proyecta el precio a 4 668 $, donde una mecha de sweep marca el máximo. En los minutos que siguen, una cascada roja regresa el precio a 4 610 $ — una amplitud de 58 $ total en la primera hora de NY, es decir más que toda la víspera.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- NY Open = superposición London + flujo US = pico de volatilidad</li>
              <li>- Los setups preparados en HTF suelen resolverse en esta ventana</li>
              <li>- Sweep + retroceso franco es el patrón más frecuente</li>
              <li>- Tradear antes de NY Open sin plan = tradear el ruido que lo precede</li>
            </ul>
          </section>

          {/* Bloque 6 — LAS KILLZONES SIRVEN PARA FILTRAR EL TIMING */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Las Killzones sirven para filtrar el timing</h2>

            <div className="my-8">
              <TimingComparisonDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              El mismo setup técnico — una resistencia H1 testeada — producirá reacciones radicalmente diferentes según el momento en que llega el test. En plena Asia Session, la resistencia puede ser tocada y solo generar una lateralización floja; en London Open, el mismo nivel puede producir un sweep franco seguido de un impulso bajista de 30 pips. La Killzone no es un disparador en sí — es un FILTRO de timing: se espera que el contexto horario sea propicio antes de tomar un setup, aunque esté bien preparado técnicamente.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Ejemplo concreto</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD: la resistencia H1 en 1.1780 es testeada dos veces el mismo día. Primer test a las 03h UTC en plena Asia: el precio toca, produce una vela de rechazo de 4 pips, y luego se cala en lateralización durante 2h sin desplazamiento. Segundo test en la apertura de London: el precio toca, sweep en 1.1792, y luego cascada bajista de 35 pips en 4 velas. Mismo setup, dos resultados — la diferencia es únicamente el timing.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Un setup ICT solo vale si el timing también lo es</li>
              <li>- Fuera de Killzone: reacción floja, lateralización, señales falsas</li>
              <li>- En Killzone: sweep franco, impulso, desplazamiento real</li>
              <li>- El filtro horario elimina el 80 % de los « setups correctos » no rentables</li>
            </ul>
          </section>

          {/* Bloque 7 — PLAN DE APLICACIÓN */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan de aplicación: un trade Killzone EUR/USD</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Aquí está la secuencia completa para explotar una Killzone en EUR/USD. Cuatro etapas, cada una con su rol.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Etapa 1 — HTF (Daily): sesgo direccional</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observación: EUR/USD Daily en LH/LL, resistencia Daily en 1.1780</li>
                <li>- Conclusión: sesgo bajista — se buscarán shorts en el próximo test de zona superior</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Etapa 2 — Asia Session (00h-07h UTC): identificar el range</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observación: el precio oscila entre 1.1710 y 1.1725 durante la sesión asiática</li>
                <li>- Conclusión: range Asia trazado, niveles anotados. Los stops debajo de 1.1710 y arriba de 1.1725 son objetivos potenciales para London / NY</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Etapa 3 — London Open (07h-10h UTC): esperar el sweep</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observación: a las 08h15, el precio rompe debajo de 1.1710, baja a 1.1702 (sweep de los stops debajo del range Asia), y luego un impulso alcista arranca</li>
                <li>- Conclusión: sweep completo — pero el sesgo Daily sigue vendedor. Se espera el siguiente objetivo: la resistencia 1.1780</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Etapa 4 — Ejecución (M15 durante NY Open)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observación: en la apertura NY (13h30-14h30 UTC según la estación), el precio sube a testear 1.1780, sweep en 1.1792, reintegración debajo de 1.1780, vela bajista impulsiva M15 que rompe el mínimo local en 1.1762</li>
                <li>- Conclusión: entrada short en 1.1758 (timing Killzone + setup ICT alineado), SL en 1.1795 (arriba del sweep), TP hacia 1.1695. R/R ≈ 1 : 1,7 — setup de alta probabilidad porque está alineado Daily + range Asia + NY Open</li>
              </ul>

              <div className="border-t border-zinc-800/60 pt-3 mt-3">
                <p className="text-sm text-zinc-300 italic text-center">
                  HTF = sesgo · Asia = liquidity · London/NY = ejecución · Fuera de Killzone = se espera
                </p>
              </div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "El mercado solo produce sus verdaderos movimientos en ciertas ventanas horarias (Killzones) — no de forma continua.",
              "La Asia Session suele servir de bolsa de liquidity; Londres y NY vienen a hacer sweep antes de impulsar.",
              "El mismo setup técnico produce reacciones radicalmente distintas según el timing horario.",
              "La Killzone es un filtro, no un disparador: sin timing favorable, se espera incluso ante un setup perfecto.",
            ]}
          />

          <LessonExercice
            description="En TradingView, observa un día completo en un par mayor e identifica dónde las Killzones producen los verdaderos movimientos."
            steps={[
              "Identifica visualmente la sesión asiática (00h-07h UTC) en M15: anota la amplitud del range y el tamaño de las velas.",
              "Marca la apertura de London (07h UTC) y de NY (13h30-14h30 UTC según la estación). Observa las 1-2 primeras horas de cada Killzone: ¿sweep del range Asia? ¿impulso franco? ¿amplitud comparada con la sesión asiática?",
              "El mismo día, identifica un setup técnico (test de resistencia, FVG, equal highs) que se haya jugado EN Killzone y otro que se haya jugado FUERA de Killzone. Compara la calidad de la reacción.",
            ]}
          />

          <LessonQuiz
            question="Tienes un setup ICT perfecto en EUR/USD: sesgo Daily bajista, zona H1 confluente, el precio viene a tocar la zona a las 04h UTC en plena Asia Session. ¿Qué haces?"
            options={[
              "No entras: el setup es correcto pero el timing no es una Killzone — la reacción será floja o nula",
              "Entras de inmediato: el setup está alineado, no importa la hora",
              "Entras con un SL muy amplio para absorber la lentitud de la sesión asiática",
              "Tomas el otro sentido suponiendo que la Asia va a romper el sesgo Daily",
            ]}
            correctIndex={0}
            explanation="La Killzone es un filtro de timing, no un detalle accesorio. Un setup perfecto técnicamente pero que se presenta durante la Asia Session tiene una probabilidad muy baja de reacción franca — al mercado simplemente le falta volumen para producir un verdadero impulso. La disciplina consiste en esperar London Open o NY Open. Si el precio hace sweep del nivel durante la Asia, es a menudo un movimiento falso que será reintegrado cuando llegue el verdadero volumen."
            answerExplanations={[
              "Correcto. La Killzone filtra el timing incluso cuando el setup es técnicamente perfecto. Fuera de Killzone, la probabilidad de reacción franca cae drásticamente. La disciplina ICT consiste en esperar que el timing horario valide el setup antes de entrar.",
              "Falso. « No importa la hora » es lo opuesto del modelo ICT. El timing es tan estructurante como el setup mismo — un setup perfecto fuera de Killzone es estadísticamente no rentable, sin importar su calidad técnica.",
              "Falso. Ampliar el SL no corrige el problema de timing: el mercado simplemente no tiene el volumen para impulsar durante la Asia. Solo se tomaría más riesgo en un setup que probablemente no se disparará.",
              "Falso. Tomar el otro sentido únicamente porque la Killzone no es favorable no tiene ningún sentido estructural. El sesgo Daily sigue siendo prioritario — lo único que hay que hacer es esperar la próxima Killzone para ejecutar el escenario alineado.",
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
                  markLessonComplete(p, "ict", "lecon3");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lección 3 del módulo ICT completo terminada.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between gap-4">
              <Link href="/strategies/ict/lecon2" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lección anterior
              </Link>
              <Link href="/strategies/ict/lecon4" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
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
