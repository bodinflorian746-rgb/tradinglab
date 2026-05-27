"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { DisplacementImpulseDiagram } from "@/app/components/charts/DisplacementImpulseDiagram";
import { DisplacementControlDiagram } from "@/app/components/charts/DisplacementControlDiagram";
import { DisplacementSetupDiagram } from "@/app/components/charts/DisplacementSetupDiagram";
import { DisplacementVsVolatilityDiagram } from "@/app/components/charts/DisplacementVsVolatilityDiagram";

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
    setDone(isLessonComplete(getStoredProgress(), "ict", "lecon4"));
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
          <span className="text-zinc-500">Lección 4</span>
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
            El displacement: reconocer el verdadero desplazamiento institucional
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              El mercado no siempre se desplaza con convicción. Algunos impulsos muestran una verdadera toma de control.
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
              const isCurrent = lesson.id === "lecon4";
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
            <span className="ml-auto text-xs text-zinc-600">4 / 5 lecciones</span>
          </div>
        </header>

        <div className="space-y-8">

          {/* Bloque 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-amber-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « Una gran vela no es una señal. Una gran vela que rompe una estructura y continúa, sí. »
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
              <li>- BOS y CHoCH → ver módulo SMC, lección « BOS y CHoCH: leer las señales estructurales institucionales »</li>
            </ul>
          </div>

          {/* Bloque 3 — UN DISPLACEMENT NO ES UN SIMPLE IMPULSO */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Un displacement no es un simple impulso</h2>

            <div className="my-8">
              <DisplacementImpulseDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Un displacement es una secuencia de velas impulsivas, con cuerpos grandes, que se desplaza en una dirección sin corrección significativa, no una simple vela grande aislada. La secuencia se reconoce por tres características: amplitud de los cuerpos anormalmente superior a las velas anteriores, ausencia de mechas significativas en el sentido contrario (el mercado no retoma aliento), y creación casi sistemática de uno o varios FVG en la caída o el alza. Es esa combinación la que distingue el displacement de una simple volatilidad.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Ejemplo concreto</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                Gráfico M15 EUR/USD: desde 1.1780, el precio imprime una mecha de sweep en 1.1792 y luego encadena 4 velas bajistas consecutivas, cada una con un cuerpo de 12-15 pips, sin ninguna mecha superior notable. El precio cae hasta 1.1748 en menos de una hora, dejando dos FVG bearish visibles en la caída. Es un displacement característico, no una volatilidad pasajera, sino una secuencia orientada.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Displacement = secuencia de velas impulsivas con cuerpos grandes, no una vela aislada</li>
              <li>- Ausencia de mechas en el sentido contrario = el mercado no respira</li>
              <li>- Creación de FVG en el movimiento = rastro estructural del desequilibrio</li>
              <li>- Amplitud de los cuerpos claramente superior al promedio de las últimas velas</li>
            </ul>
          </section>

          {/* Bloque 4 — EL DISPLACEMENT MUESTRA QUIÉN TOMA EL CONTROL */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">El displacement muestra quién toma el control</h2>

            <div className="my-8">
              <DisplacementControlDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Antes de un displacement, el mercado suele estar en equilibrio, velas de baja amplitud, alternancia verde/rojo, lateralización. Cuando llega el displacement, es el equilibrio el que se rompe: un lado toma bruscamente la ventaja e impone la dirección. Esa ruptura es la firma de una intención institucional. Leer un displacement es leer quién, vendedores o compradores, acaba de ganar la batalla en curso. La dirección del displacement define el sesgo inmediato de los minutos / horas que siguen.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Ejemplo concreto</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                XAU/USD M15: el precio consolida alrededor de 4 650 $ durante 3 horas, velas planas, mercado equilibrado. A las 14h UTC, una vela hace sweep de un máximo en 4 668 $, seguida de inmediato por 5 velas bajistas con cuerpos grandes que regresan el precio a 4 608 $. El equilibrio está roto: son los vendedores los que toman el control. El sesgo de las horas siguientes está definido, ya no se buscan longs hasta nueva orden.
            </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- El displacement marca el paso del equilibrio a la toma de control institucional</li>
              <li>- La dirección del displacement define el sesgo de los minutos / horas que siguen</li>
              <li>- Antes del displacement = mercado plano, equilibrado; después = dirección impuesta</li>
              <li>- Ignorar un displacement = tradear contra la intención institucional que acaba de expresarse</li>
            </ul>
          </section>

          {/* Bloque 5 — EL DISPLACEMENT SUELE CREAR EL SETUP */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">El displacement suele crear el setup</h2>

            <div className="my-8">
              <DisplacementSetupDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Un displacement deja tras de sí una zona explotable: el FVG creado por las grandes velas de la secuencia. El mercado suele venir a revisitar esa zona antes de continuar en la dirección del displacement, es el escenario de mitigation ya visto en la Lección 2, pero aquí en un contexto particularmente confiable porque el FVG nació de una intención institucional visible. El regreso al FVG ofrece una entrada ajustada, con un SL arriba del extremo del displacement y un TP hacia la próxima zona de liquidity en la dirección del movimiento.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Ejemplo concreto</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD H1: el sweep en 1.1792 y el displacement bearish hasta 1.1748 dejan un FVG visible entre 1.1768 y 1.1780. En las horas siguientes, el precio sube progresivamente, entra a la banda FVG, y luego una vela bajista franca relanza la baja. Entrada short al regreso al FVG, SL justo arriba de 1.1780, TP hacia la próxima zona de liquidity baja, el displacement inicial creó por sí solo la entrada y el SL.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- El FVG creado por un displacement es una zona de entrada premium</li>
              <li>- El regreso al FVG ofrece una entrada ajustada con SL estructural</li>
              <li>- La intención del displacement sigue válida mientras el FVG no sea violado en el sentido contrario</li>
              <li>- El displacement crea a la vez la entrada (FVG) y la invalidación (extremo del movimiento)</li>
            </ul>
          </section>

          {/* Bloque 6 — NO TODOS LOS MOVIMIENTOS RÁPIDOS SON DISPLACEMENTS */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">No todos los movimientos rápidos son displacements</h2>

            <div className="my-8">
              <DisplacementVsVolatilityDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              La trampa clásica es confundir cualquier vela grande con un displacement. Una vela aislada, incluso muy grande, que no esté precedida de una estructura explotada ni seguida de una continuidad, es simplemente volatilidad, un evento puntual sin secuela. El verdadero displacement se distingue por dos elementos: rompe una estructura local (BOS en el sentido del movimiento) y va seguido de una continuación, no de un rechazo inmediato. Sin estas dos condiciones, es solo una mecha que el mercado va a borrar en los minutos siguientes. El tamaño de 18 pips nunca es en sí mismo un criterio, la ruptura y la continuidad sí lo son.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Ejemplo concreto</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                En EUR/USD, una vela M15 imprime brutalmente 18 pips al alza tras una news menor, y luego la siguiente vela cierra completamente el movimiento, sin ruptura estructural, sin continuación. Es volatilidad, no un displacement. Al contrario, una secuencia de 4 velas bajistas de 10-12 pips cada una que rompe un mínimo local y encadena en la misma dirección es un displacement, aunque ninguna vela supere los 12 pips.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Vela grande aislada + rechazo inmediato = volatilidad, no displacement</li>
              <li>- Displacement = ruptura de estructura (BOS) + continuación en la dirección</li>
              <li>- El tamaño de una sola vela nunca es un criterio, la secuencia y lo que sigue son lo que cuentan</li>
              <li>- Tradear la volatilidad como un displacement = posicionarte del lado equivocado</li>
            </ul>
          </section>

          {/* Bloque 7 — PLAN DE APLICACIÓN */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan de aplicación: un displacement EUR/USD completo</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Aquí está la secuencia para identificar y explotar un displacement en EUR/USD. Cinco etapas, cada una con su rol.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Etapa 1. HTF (Daily): sesgo direccional</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observación: EUR/USD Daily en LH/LL, resistencia Daily 1.1780</li>
                <li>- Conclusión: sesgo bajista, se buscará un displacement en el sentido vendedor</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Etapa 2. Liquidity (H1): identificar el objetivo</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observación: equal highs recientes en 1.1780, stops acumulados arriba</li>
                <li>- Conclusión: la liquidity arriba de 1.1780 es el objetivo probable antes de cualquier verdadero movimiento bearish</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Etapa 3. Sweep (M15 en Killzone)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observación: en la apertura NY, el precio hace sweep en 1.1792 y luego se reintegra debajo de 1.1780</li>
                <li>- Conclusión: la liquidity está tomada. Ahora se vigila el displacement</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Etapa 4. Displacement bearish</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observación: 4 velas bajistas consecutivas con cuerpos grandes, sin mechas superiores, el precio cae a 1.1748. FVG visible entre 1.1768 y 1.1780</li>
                <li>- Conclusión: displacement validado. La entrada no está en el displacement (ya pasó), está en el FVG que creó</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Etapa 5. Regreso al FVG: ejecución</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observación: el precio sube progresivamente hacia 1.1768-1.1780, entra a la banda FVG, y luego vela bajista de rechazo</li>
                <li>- Conclusión: entrada short al regreso al FVG, SL justo arriba de 1.1780 (extremo del displacement), TP hacia 1.1695. R/R ≈ 1 : 2, setup de alta probabilidad alineado HTF + liquidity + sweep + displacement + FVG</li>
              </ul>

              <div className="border-t border-zinc-800/60 pt-3 mt-3">
                <p className="text-sm text-zinc-300 italic text-center">
                  HTF = sesgo · Liquidity = objetivo · Sweep = condición · Displacement = confirmación · FVG = ejecución
                </p>
              </div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "Un displacement es una secuencia de velas impulsivas, no una vela aislada, cuerpos grandes, pocas mechas contrarias, FVG dejados atrás.",
              "El displacement marca el paso del equilibrio a la toma de control institucional.",
              "El FVG creado por un displacement es una zona de entrada premium, la entrada se toma al regreso, no dentro del displacement mismo.",
              "Una gran vela aislada sin ruptura ni continuación es volatilidad, no un displacement.",
            ]}
          />

          <LessonExercice
            description="En TradingView, identifica un displacement completo en el par de tu elección y califícalo paso a paso."
            steps={[
              "Identifica una secuencia de 3-5 velas M15 o H1 consecutivas, todas en la misma dirección, con cuerpos más grandes que el promedio de las 10 velas anteriores y pocas o ninguna mecha contraria.",
              "Verifica que la secuencia rompe una estructura local (mínimo o máximo reciente) y deja al menos un FVG visible. Si es así, es un displacement calificado.",
              "Traza el FVG en el gráfico. Espera que el precio regrese ahí. Si la reacción al regreso confirma la dirección del displacement (vela de rechazo, ruptura en el sentido), anota la entrada, el SL arriba del extremo del displacement y el TP hacia la próxima liquidity.",
            ]}
          />

          <LessonQuiz
            question="En EUR/USD, una vela M15 imprime brutalmente 18 pips al alza, y luego la siguiente vela cierra completamente el movimiento. No hay ruptura estructural visible. ¿Cómo calificas este movimiento?"
            options={[
              "Es un displacement alcista, 18 pips en una vela es una señal fuerte",
              "Es volatilidad sin secuela, no un displacement, sin ruptura ni continuación",
              "Es un sweep, así que el escenario inverso queda validado para entrar short de inmediato",
              "Es una señal indeterminada, hay que esperar 1h para decidir",
            ]}
            correctIndex={1}
            explanation="Un displacement nunca se define por el tamaño de una sola vela. Los dos criterios estructurales son: una ruptura de estructura local (BOS) Y una continuación en la dirección. Aquí, la siguiente vela cierra íntegramente el movimiento y no hay ruptura, es exactamente la definición de volatilidad sin secuela, no un displacement. Tradear esa vela como una señal de compra equivaldría a comprar el máximo del movimiento falso."
            answerExplanations={[
              "Falso. El tamaño de una vela no tiene ningún valor sin ruptura de estructura y continuación. 18 pips aislados e inmediatamente rechazados = volatilidad puntual, exactamente la trampa que el concepto de displacement busca evitar.",
              "Correcto. Sin ruptura estructural ni continuación, es una vela aislada, entonces volatilidad, no un displacement. La regla del ICT es clara: un displacement solo se valida con una secuencia orientada que rompe una estructura y continúa.",
              "Falso. Un sweep es solo una condición previa, jamás una señal de entrada por sí sola. Entrar short de inmediato sobre la base de una vela alcista aislada no tiene ninguna lógica estructural, hay que esperar la confirmación (reintegración + vela impulsiva opuesta).",
              "Falso. Esperar 1h arbitrariamente no cambia la lectura. El movimiento ya está calificado de volatilidad por los criterios estructurales (sin ruptura, rechazo inmediato). No se necesita un timer, solo hay que leer correctamente lo que se ve.",
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
                  markLessonComplete(p, "ict", "lecon4");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lección 4 del módulo ICT completo terminada.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between gap-4">
              <Link href="/strategies/ict/lecon3" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lección anterior
              </Link>
              <Link href="/strategies/ict/lecon5" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
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
