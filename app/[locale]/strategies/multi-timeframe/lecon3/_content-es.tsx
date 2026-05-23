"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { ZoneHistoireDiagram } from "@/app/components/charts/ZoneHistoireDiagram";
import { RetourDesequilibreDiagram } from "@/app/components/charts/RetourDesequilibreDiagram";
import { ScenarioZoneDiagram } from "@/app/components/charts/ScenarioZoneDiagram";

const LESSONS = [
  { id: "lecon1", title: "Por qué analizar en multi-timeframe", disabled: false },
  { id: "lecon2", title: "El timeframe superior: el sesgo", disabled: false },
  { id: "lecon3", title: "El timeframe intermedio: la zona", disabled: false },
  { id: "lecon4", title: "El timeframe de ejecución: la entrada", disabled: false },
  { id: "lecon5", title: "El proceso completo", disabled: false },
];

export default function ContentEs() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "multi-timeframe", "lecon3"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Estrategias</Link>
          <span>/</span>
          <Link href="/strategies/multi-timeframe" className="hover:text-zinc-400 transition-colors">Multi-timeframe Process</Link>
          <span>/</span>
          <span className="text-zinc-500">Lección 3</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Intermedio
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
            El timeframe intermedio: localizar la zona que cuenta
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              El HTF da la dirección. El timeframe intermedio muestra dónde el mercado tiene una verdadera razón para reaccionar.
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

          {/* Bloc 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-blue-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « Una zona fuerte nunca es una línea trazada al azar. Es un nivel que acumula varias razones para reaccionar. »
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerrequisitos</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Dirección dominante HTF → ver Lección 2</li>
              <li>- Soportes y resistencias → ver módulo Soporte/Resistencia</li>
              <li>- FVG, liquidity, sweep → ver módulo SMC</li>
            </ul>
          </div>

          {/* Bloc 3 — UNE ZONE DOIT RACONTER UNE HISTOIRE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Una zona debe contar una historia</h2>

            <div className="my-8">
              <ZoneHistoireDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Una zona de interés válida no se resume a una línea trazada al azar. Una zona fuerte cuenta una historia: acumula varias razones de reacción en el mismo nivel — un antiguo soporte vuelto resistencia, un FVG dejado por una impulsión, una zona de liquidity aún no tomada. Mientras más razones acumule el nivel, mayor es la probabilidad de reacción.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Ejemplo concreto</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD H1: 1.1760 es un antiguo soporte roto durante una caída. El precio luego dejó un FVG bearish entre 1.1750 y 1.1760 en la impulsión bajista. En la subida actual, este nivel acumula entonces dos razones: antiguo soporte vuelto resistencia y FVG no mitigado. La zona concentra varias razones de reacción en el mismo lugar.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Busca la confluencia antes de trazar una zona</li>
              <li>- Acumula las razones: antiguo S/R, FVG, liquidity, proyección</li>
              <li>- Privilegia las zonas que acumulan al menos dos criterios</li>
              <li>- Ignora los niveles aislados sin contexto técnico</li>
            </ul>
          </section>

          {/* Bloc 4 — LE MARCHÉ REVIENT DANS LES ZONES FORTES */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">El mercado regresa a las zonas fuertes</h2>

            <div className="my-8">
              <RetourDesequilibreDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              El mercado no sube ni baja en línea recta. Después de una impulsión fuerte, el precio regresa frecuentemente a las zonas de desequilibrio dejadas en el camino — FVG, Order Block, mecha de rechazo. Este regreso no es un giro: es una mitigation del desequilibrio antes de la reanudación del movimiento inicial.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Ejemplo concreto</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                XAU/USD H1: impulsión bearish brutal desde 4 680 $. El movimiento deja un FVG bearish entre 4 648 $ y 4 660 $. Varias horas más tarde, el precio sube progresivamente a esa banda. Al contacto, la mecha atraviesa parcialmente el FVG, luego el rechazo se activa con fuerza hacia abajo. El regreso al desequilibrio precedió a la continuación bajista.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Localiza los FVG dejados por las impulsiones HTF</li>
              <li>- Espera el regreso del precio a la zona, no anticipes</li>
              <li>- Un regreso no es un giro — es una mitigation</li>
              <li>- Privilegia las zonas coherentes con el sesgo HTF</li>
            </ul>
          </section>

          {/* Bloc 5 — LE TIMEFRAME INTERMÉDIAIRE PRÉPARE LE SCÉNARIO */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">El timeframe intermedio prepara el escenario</h2>

            <div className="my-8">
              <ScenarioZoneDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              El timeframe intermedio no sirve para entrar — sirve para preparar el terreno. Es el nivel que transforma la dirección HTF en un plan explotable. Aquí se traza la zona, se anotan los niveles, se prepara lo que se va a esperar después en el timeframe de ejecución. El escenario se establece mucho antes de que aparezca una señal.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Ejemplo concreto</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD H1: sesgo HTF bajista, zona de resistencia amplia entre 1.1750 y 1.1760 trazada con antelación. Al acercarse a la banda, las velas alcistas pierden amplitud — las impulsiones se acortan, las correcciones se alargan. El mercado se queda sin aliento sin que se haya emitido aún ninguna señal de entrada. El escenario está listo: solo queda esperar el disparador en el timeframe de ejecución.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Traza la zona ANTES de que el precio la alcance</li>
              <li>- Anota los niveles clave por anticipado</li>
              <li>- Observa la pérdida de impulsión al acercarse a la zona</li>
              <li>- No entres en el timeframe intermedio — preparar es todo</li>
            </ul>
          </section>

          {/* Bloc 6 — PLAN D'APPLICATION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan de aplicación: un caso EUR/USD</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              El timeframe intermedio se lee después del HTF y antes del LTF. Así se establece la zona sobre un caso EUR/USD — el objetivo no es entrar, sino preparar el escenario.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Paso 1 — HTF (Daily/H4)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observación: estructura en LH/LL, sesgo bajista ya identificado (ver Lección 2)</li>
                <li>- Conclusión: dirección dominante bajista, ventas prioritarias</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Paso 2 — Timeframe intermedio (H1)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observación: antiguo soporte en 1.1760 vuelto resistencia, FVG bearish 1.1750-1.1760 no mitigado</li>
                <li>- Conclusión: zona confluente a vigilar — prepara un escenario short al regreso del precio</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Paso 3 — Preparar el escenario</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Esperado: una subida hacia la banda 1.1750-1.1760, pérdida de impulsión al acercarse, luego confirmación en el timeframe de ejecución (Lección 4)</li>
                <li>- Evitado: una entrada anticipada antes del regreso efectivo del precio a la zona</li>
              </ul>

              <div className="border-t border-zinc-800/60 pt-3 mt-3">
                <p className="text-sm text-zinc-300 italic text-center">
                  HTF = dirección · Timeframe intermedio = zona · LTF = ejecución (Lección 4)
                </p>
              </div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "Una zona fuerte acumula varias razones de reacción — la confluencia ante todo.",
              "El mercado regresa a los desequilibrios dejados por las impulsiones HTF.",
              "El timeframe intermedio prepara el escenario, no ejecuta.",
              "Traza la zona antes de que el precio la alcance — nunca después.",
            ]}
          />

          <LessonExercice
            description="Abre EUR/USD en TradingView en H1 y entrénate a identificar una zona que cuente una historia."
            steps={[
              "Localiza un antiguo soporte importante en H1 y trázalo. Verifica si fue roto y luego transformado en resistencia.",
              "Busca un FVG dejado por la última impulsión bajista. Traza la banda completa, no una simple línea.",
              "Anota todas las razones que se acumulan en ese nivel: antiguo S/R, FVG, liquidity, proyección. Si acumulas al menos dos, la zona cuenta una historia.",
            ]}
          />

          <LessonQuiz
            question="¿Qué hace que una zona de interés sea particularmente fuerte en el timeframe intermedio?"
            options={[
              "El simple hecho de que el precio ya la haya tocado varias veces",
              "La confluencia — varias razones de reacción acumuladas en el mismo nivel",
              "Su posición en un número redondo como 1.1800 o 1.2000",
              "El hecho de que sea el máximo o mínimo absoluto del día",
            ]}
            correctIndex={1}
            explanation="Una zona fuerte cuenta una historia: un antiguo soporte vuelto resistencia, un FVG dejado por una impulsión, una zona de liquidity aún no tomada. Mientras más razones acumule el nivel, mayor es la probabilidad de reacción. Un simple toque repetido, un número redondo o un extremo diario no bastan por sí solos — es la acumulación de criterios técnicos la que crea una zona realmente explotable."
            answerExplanations={[
              "Incorrecto. Un nivel tocado varias veces llama la atención, pero sin contexto (antiguo S/R, FVG, liquidity), sigue siendo frágil. El número de toques no crea confluencia por sí solo.",
              "Correcto. La confluencia — la acumulación de varias razones de reacción en el mismo lugar — es el criterio central. Mientras más argumentos técnicos acumule la zona, más fuerte es la probabilidad de reacción.",
              "Incorrecto. Los números redondos atraen la atención psicológica de los participantes, pero no crean, por sí solos, una zona de interés institucional. Sin confluencia técnica real, son niveles débiles.",
              "Incorrecto. El máximo o mínimo del día solo es una referencia estadística. Sin alineación con una zona estructural, un FVG o liquidity, ese nivel no cuenta ninguna historia explotable.",
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
                  markLessonComplete(p, "multi-timeframe", "lecon3");
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
                  <p className="text-sm font-semibold text-emerald-400">Lección terminada</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Lección 3 del módulo Multi-timeframe Process completada.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between gap-4">
              <Link href="/strategies/multi-timeframe/lecon2" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lección anterior
              </Link>
              <Link href="/strategies/multi-timeframe/lecon4" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
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
