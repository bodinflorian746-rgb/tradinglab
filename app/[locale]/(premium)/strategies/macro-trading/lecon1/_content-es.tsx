"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { FOMCImpulseExcessDiagram } from "@/app/components/charts/FOMCImpulseExcessDiagram";
import { FOMCExhaustionDiagram } from "@/app/components/charts/FOMCExhaustionDiagram";
import { FOMCFadeSetupDiagram } from "@/app/components/charts/FOMCFadeSetupDiagram";

const LESSONS = [
  { id: "lecon1", title: "FOMC Fade", disabled: false },
  { id: "lecon2", title: "NFP Overreaction", disabled: false },
  { id: "lecon3", title: "Régimen Risk-off", disabled: false },
  { id: "lecon4", title: "Filtro macro pre-trade", disabled: false },
];

export default function ContentEs() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-trading", "lecon1"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Estrategias</Link>
          <span>/</span>
          <Link href="/strategies/macro-trading" className="hover:text-zinc-400 transition-colors">Macro Trading</Link>
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
            FOMC Fade: tradear el retroceso después de la decisión
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              El mercado suele reaccionar demasiado rápido después del FOMC. El primer impulso atrae la atención. El retroceso muchas veces genera el verdadero setup explotable.
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
            <span className="ml-auto text-xs text-zinc-600">1 / 4 lecciones</span>
          </div>
        </header>

        <div className="space-y-8">

          {/* Bloc 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-amber-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « La decisión FOMC rara vez es la señal. Lo que pasa DESPUÉS del impulso inicial es lo que crea el verdadero trade. »
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerrequisitos</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Decisiones FOMC y conferencia de Powell → ver módulo Macro</li>
              <li>- Hawkish vs dovish → ver módulo Macro</li>
              <li>- Soportes, resistencias y liquidity → ver módulo Estrategias</li>
              <li>- Multi-timeframe → ver módulo Multi-timeframe Process</li>
            </ul>
          </div>

          {/* Bloc 3 — LA PREMIÈRE IMPULSION EST SOUVENT EXCESSIVE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">El primer impulso suele ser excesivo</h2>

            <div className="my-8">
              <FOMCImpulseExcessDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              La decisión FOMC casi siempre dispara una reacción inmediata del mercado, pero ese primer impulso rara vez es el verdadero movimiento direccional. Está impulsado por la emoción de los participantes que sobreinterpretan el tono de Powell, la redacción de las minutas o un cambio de postura marginal. Esta reacción emocional empuja al precio más allá del nivel estructural que habría sido coherente con el contenido real de la decisión, de ahí el exceso.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Ejemplo concreto</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                XAU/USD: precio previo al FOMC 4 660 $; primer impulso bearish hasta 4 590 $; movimiento inicial de 70 $ en pocos minutos. Treinta minutos después: regreso del precio hacia 4 638 $, corrección de la mayor parte del impulso inicial.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Puntos accionables: el primer impulso FOMC suele ser una reacción emocional, no una lectura estructural</li>
              <li>- El movimiento inicial frecuentemente supera lo que los datos reales justifican</li>
              <li>- Tradear el impulso = tradear el ruido, no la decisión</li>
              <li>- El verdadero movimiento direccional llega después, a veces dentro de la hora, a veces más tarde</li>
            </ul>
          </section>

          {/* Bloc 4 — LE SIGNAL APPARAÎT APRÈS L'ESSOUFFLEMENT */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">La señal aparece después del agotamiento</h2>

            <div className="my-8">
              <FOMCExhaustionDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              El agotamiento es la señal clave del FOMC Fade. Después del impulso inicial, el mercado alcanza un nivel donde ya no logra avanzar: las velas siguientes muestran mechas de rechazo repetidas, la aceleración se detiene, el precio falla en imprimir un nuevo máximo (o mínimo) significativo. Esa es la firma visible de que la emoción se agota, los participantes que persiguieron el impulso se dan cuenta de que están solos, y la presión en la dirección inicial se debilita. Este punto de agotamiento es la condición previa para la ejecución del fade.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Ejemplo concreto</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                XAU/USD: impulso bullish 4 640 $ → 4 705 $ después del FOMC. En el techo, tres velas M15 consecutivas imprimen mechas superiores de 6-8 $ sin cerrar por encima de 4 705. La aceleración está rota, el mercado deja de hacer nuevos máximos. Algunas velas después, el precio corrige hacia 4 670 $, el fade funciona.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Puntos accionables: agotamiento = mechas de rechazo repetidas + pérdida de aceleración</li>
              <li>- Falla al imprimir un nuevo máximo / mínimo significativo = señal de fin del impulso</li>
              <li>- Sin agotamiento visible = no se hace fade, se espera</li>
              <li>- El M15 es la escala de lectura del agotamiento</li>
            </ul>
          </section>

          {/* Bloc 5 — LE RETOUR DE BALANCIER DOIT RESTER STRUCTURÉ */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">El retroceso debe seguir siendo estructurado</h2>

            <div className="my-8">
              <FOMCFadeSetupDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              El FOMC Fade no consiste en anticipar un cambio completo de tendencia, es un trade de retorno PARCIAL, calibrado sobre la zona donde la mayor parte del impulso excesivo ha sido corregida. La estructura debe mantenerse clara: entrada después de la estabilización del precio en el punto de agotamiento, stop loss ajustado justo más allá del extremo del impulso, target sobre el nivel estructural desde donde partió el impulso. Sin estos tres elementos alineados, el setup no es válido.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Ejemplo concreto</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                XAU/USD: caída FOMC 4 660 $ → 4 590 $; estabilización M15 alrededor de 4 595 $; regreso progresivo hacia 4 638 $. Setup fade: entrada long 4 600 $, stop loss 4 578 $, target 4 638 $. El setup apunta a un retorno parcial del movimiento, no a un cambio Daily completo.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Puntos accionables: el fade apunta a un retorno parcial, típicamente 50-80 % del impulso</li>
              <li>- Entrada después de una estabilización visible, nunca durante el impulso</li>
              <li>- SL ajustado más allá del extremo, estructura de invalidación clara</li>
              <li>- Target sobre el nivel estructural previo al impulso (antiguo soporte / resistencia)</li>
            </ul>
          </section>

          {/* Bloc 6 — PLAN D'APPLICATION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan de aplicación: un FOMC Fade completo en XAU/USD</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Esta es la secuencia completa de un setup FOMC Fade, desde el contexto pre-FOMC hasta la gestión del riesgo. Cinco etapas, cada una con su rol.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Etapa 1. Contexto H4</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observación: XAU bajo resistencia H4 en 4 680 $, mercado expectante antes del FOMC, compresión de volatilidad</li>
                <li>- Conclusión: alta probabilidad de expansión sobre la decisión, se prepara el escenario de fade</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Etapa 2. Reacción FOMC</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observación: primer impulso bearish 4 660 $ → 4 590 $, movimiento de 70 $ en pocos minutos, volatilidad agresiva</li>
                <li>- Conclusión: reacción potencialmente excesiva, se espera el agotamiento, no la entrada inmediata</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Etapa 3. Agotamiento</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observación: el mercado deja de crear nuevos mínimos, mechas inferiores largas en M15, estabilización alrededor de 4 595 $</li>
                <li>- Conclusión: presión vendedora en desaceleración, la condición del fade está validada</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Etapa 4. Ejecución del Fade</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Entrada long: 4 600 $</li>
                <li>- Stop loss: 4 578 $ (más allá del extremo del impulso)</li>
                <li>- Target: 4 638 $ (retorno parcial hacia el nivel pre-FOMC)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Etapa 5. Gestión del riesgo</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Volatilidad superior a la normal → tamaño de posición prudente</li>
                <li>- Ejecución únicamente después de la estabilización, no durante el impulso</li>
                <li>- El peligro principal sigue siendo la entrada prematura en el impulso inicial</li>
              </ul>

              <div className="border-t border-zinc-800/60 pt-3 mt-3">
                <p className="text-sm text-zinc-300 italic text-center">
                  Exceso = condición · Agotamiento = señal · Estabilización = entrada · Retorno parcial = target
                </p>
              </div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "El primer impulso FOMC casi siempre está impulsado por la emoción, no por la interpretación estructural.",
              "La señal explotable aparece después del agotamiento: mechas de rechazo, falla al imprimir un nuevo mínimo / máximo.",
              "El FOMC Fade apunta a un retorno PARCIAL del movimiento inicial, no a un cambio completo de tendencia Daily.",
              "Sin estabilización visible = sin entrada. Entrar en el impulso inicial = tradear el ruido emocional.",
            ]}
          />

          <LessonExercice
            description="En TradingView, identifica un FOMC reciente en EUR/USD o XAU/USD y reconstruye a posteriori el setup FOMC Fade."
            steps={[
              "Identifica la vela M15 del FOMC: anota el precio previo al impulso, la amplitud de la primera reacción y el nivel extremo alcanzado.",
              "Observa lo que sucede en los 30-60 minutos siguientes: agotamiento visible? mechas de rechazo? estabilización? Anota el punto preciso donde la presión se detiene.",
              "Si hubo estabilización: reconstruye el setup fade (entrada, SL ajustado, target sobre el nivel pre-FOMC). Verifica a posteriori si el R/R habría sido favorable. Si no hubo estabilización visible: anota por qué el setup no debería haberse tomado.",
            ]}
          />

          <LessonQuiz
            question="Estás en posición frente al FOMC en XAU/USD. La decisión cae y provoca un impulso bearish violento de 70 $ en pocos minutos. Qué haces?"
            options={[
              "Entras short en el impulso para aprovechar el movimiento en curso",
              "No entras de inmediato: esperas el agotamiento del impulso antes de cualquier trade",
              "Entras long inmediatamente apostando a un cambio completo",
              "Colocas una orden limit justo en el extremo alcanzado por el impulso",
            ]}
            correctIndex={1}
            explanation="La regla central del FOMC Fade es clara: no se entra nunca durante el impulso. La primera reacción FOMC está impulsada por la emoción, su amplitud es imprevisible, y su extremo puede ser superado varias veces antes de la verdadera estabilización. La disciplina consiste en esperar a que el mercado señale por sí mismo su agotamiento, mechas de rechazo, falla al imprimir nuevos mínimos, estabilización alrededor de un nivel. Es esa señal la que abre la ventana de ejecución, no la amplitud del movimiento inicial."
            answerExplanations={[
              "Falso. Entrar short en el impulso es precisamente la trampa que el FOMC Fade busca evitar. El impulso emocional puede extenderse sin previo aviso, y entrar en pleno medio expone a un SL muy amplio o a un cambio violento contra la posición.",
              "Correcto. El agotamiento es la condición previa absoluta del setup. Sin señal visible de fin de impulso (mechas de rechazo, pérdida de aceleración, estabilización), no hay entrada. La paciencia es la disciplina estructural del Fade.",
              "Falso. El FOMC Fade no es un trade de cambio inmediato. Entrar long en pleno medio de un impulso bearish es anticipar un cambio que no tiene ninguna base estructural visible, es exactamente lo contrario del modelo.",
              "Falso. Colocar una orden limit en el extremo del impulso supone que se conoce de antemano el extremo, lo cual es imposible. El mercado puede superarlo varias veces antes de estabilizarse, y la orden limit se gatillaría sin confirmación estructural.",
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
                  markLessonComplete(p, "macro-trading", "lecon1");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lección 1 del módulo Macro Trading completada.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between gap-4">
              <Link href="/strategies/macro-trading" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Módulo Macro Trading. Vista general
              </Link>
              <Link href="/strategies/macro-trading/lecon2" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
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
