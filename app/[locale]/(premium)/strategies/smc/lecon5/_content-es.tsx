"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import BOSCHoCHSequenceDiagram from "@/app/components/charts/BOSCHoCHSequenceDiagram";
import { LiquidityGrabDiagram } from "@/app/components/charts/LiquidityGrabDiagram";
import MitigationZoneEntryDiagram from "@/app/components/charts/MitigationZoneEntryDiagram";

const LESSONS = [
  { id: "lecon1", title: "Lección 1", disabled: false },
  { id: "lecon2", title: "Lección 2", disabled: false },
  { id: "lecon3", title: "Lección 3", disabled: false },
  { id: "lecon4", title: "Lección 4", disabled: false },
  { id: "lecon5", title: "El trade SMC completo: del análisis HTF a la ejecución", disabled: false },
];

export default function ContentEs() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "smc", "lecon5"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Estrategias</Link>
          <span>/</span>
          <Link href="/strategies/smc" className="hover:text-zinc-400 transition-colors">SMC: Pensar institucional</Link>
          <span>/</span>
          <span className="text-zinc-500">Lección 5</span>
        </nav>

        {/* ── Header ── */}
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
            El trade SMC completo: del análisis HTF a la ejecución
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Esta lección integra el conjunto del módulo SMC en un desarrollo operativo completo. La lógica institucional se reconstruye paso a paso: lectura HTF, identificación de la liquidity, sweep, confirmación estructural, mitigation y ejecución.
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

        {/* ── Contenido ── */}
        <div className="space-y-8">

          {/* Bloque 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-blue-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « Un trade SMC no es una señal aislada. Es una secuencia: liquidity → sweep → displacement → mitigation → ejecución. »
              </p>
            </div>
          </section>

          {/* Bloque 2 — PRERREQUISITOS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerrequisitos</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Market Structure → ver Estrategia SMC L1</li>
              <li>- BOS / CHoCH → ver Estrategia SMC L2</li>
              <li>- Order Blocks → ver Estrategia SMC L3</li>
              <li>- FVG &amp; Liquidity → ver Estrategia SMC L4</li>
            </ul>
          </div>

          {/* Bloque 3 — LA SECUENCIA INSTITUCIONAL COMPLETA */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">La secuencia institucional completa</h2>
            <div className="my-8">
              <BOSCHoCHSequenceDiagram locale="es" />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">La estructura (BOS/CHoCH) da el sesgo y el contexto, luego la mitigación del FVG o del Order Block provee la entrada.</p>
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Las 7 etapas del trade SMC</p>
            <ol className="space-y-1 text-sm text-zinc-300 list-decimal pl-5">
              <li>Análisis HTF: determinar el sesgo direccional vía la estructura de mercado</li>
              <li>Identificar la liquidity (BSL/SSL) que será el objetivo</li>
              <li>Esperar el sweep de la liquidity opuesta</li>
              <li>Confirmar el CHoCH en el timeframe de entrada</li>
              <li>Identificar el Order Block o el FVG en el displacement</li>
              <li>Entrar en la mitigation de esa zona</li>
              <li>Gestionar: SL más allá de la zona, TP en la liquidity objetivo</li>
            </ol>
          </section>

          {/* Bloque 4 — LEER LA ESTRUCTURA Y LA LIQUIDITY */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Leer la estructura y la liquidity</h2>
            <div className="my-8">
              <LiquidityGrabDiagram locale="es" />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">El sesgo HTF da la dirección prioritaria del trade. La liquidity identifica luego las zonas donde los institucionales buscarán provocar el movimiento antes del impulso real. El sweep suele aparecer en forma de mecha agresiva seguida de una reintegración rápida.</p>
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Puntos a vigilar</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Estructura HTF en LH/LL = sesgo bearish</li>
              <li>- Equal highs/lows = liquidity explotable</li>
              <li>- Sweep = toma de stops + rechazo rápido</li>
            </ul>
          </section>

          {/* Bloque 5 — CONFIRMAR Y EJECUTAR */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Confirmar y ejecutar</h2>
            <div className="my-8">
              <MitigationZoneEntryDiagram locale="es" />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">El CHoCH confirma que el control del mercado cambia de bando en el timeframe de entrada. El displacement luego deja un Order Block o un FVG que servirá de zona de mitigation. La entrada interviene cuando el precio regresa a esta zona antes de la reanudación impulsiva.</p>
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Lógica de ejecución</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- CHoCH = confirmación estructural</li>
              <li>- FVG/OB = zona de entrada institucional</li>
              <li>- Mitigation = optimización del ratio riesgo/recompensa</li>
            </ul>
          </section>

          {/* Bloque 6 — PLAN DE TRADE EUR/USD H4 */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan de trade completo con cifras (EUR/USD H4)</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">EUR/USD H4. Sesgo HTF bajista con estructura en LH/LL. Equal highs en 1.1780 = BSL identificada. Objetivo final: SSL debajo del mínimo 1.1690. Una vela H4 hace sweep de la BSL imprimiendo una mecha en 1.1792 y luego cierra en 1.1772. El precio rompe a continuación el último mínimo menor en 1.1755: CHoCH bearish confirmado. El displacement deja un FVG bearish entre 1.1758 y 1.1770 con un Order Block justo encima.</p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Desarrollo de las 7 etapas</p>
              <ol className="space-y-1 text-sm text-zinc-300 list-decimal pl-5 mb-4">
                <li>Análisis HTF: Estructura H4 en LH/LL · Sesgo direccional bearish</li>
                <li>Identificar la liquidity: Equal highs en 1.1780 · BSL claramente visible</li>
                <li>Sweep de liquidity: Mecha en 1.1792 · Reintegración inmediata debajo de la BSL</li>
                <li>Confirmación CHoCH: Ruptura del mínimo menor en 1.1755 · Cambio de carácter bearish confirmado</li>
                <li>Identificar la zona de entrada: FVG bearish 1.1758 → 1.1770 · Order Block justo encima</li>
                <li>Entrada en mitigation: Regreso del precio al FVG · Entrada short en mitigation</li>
                <li>Gestión: SL arriba de la mecha del sweep · TP en la SSL en 1.1690</li>
              </ol>

              <p className="text-white font-semibold text-sm mb-2">Setup</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Entrada short: 1.1765</li>
                <li>- Stop loss: 1.1798</li>
                <li>- Take profit: 1.1690</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Cálculo del R/R</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-3">
                <li>- Riesgo: 1.1798 - 1.1765 = 33 pips</li>
                <li>- Ganancia: 1.1765 - 1.1690 = 75 pips</li>
                <li>- R/R: 75 / 33 = 2,27</li>
              </ul>
              <p className="text-zinc-300 leading-relaxed text-sm">La ganancia potencial representa más del doble del riesgo asumido.</p>
            </div>

            <p className="text-white font-semibold text-sm mb-2">Cálculo retail</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-3">
              <li>- Cuenta 300€ → 5% = riesgo 15€, ganancia potencial 34€</li>
              <li>- Cuenta 500€ → 3% = riesgo 15€, ganancia potencial 34€</li>
              <li>- Cuenta 1 000€ → 2% = riesgo 20€, ganancia potencial 45€</li>
              <li>- Cuenta 2 500€ → 2% = riesgo 50€, ganancia potencial 113€</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">El R/R se mantiene 2,27:1 sin importar el tamaño de la cuenta.</p>
          </section>

          {/* Bloque 7 — LOS ERRORES */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Los errores que rompen el trade SMC</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">Error 1: Entrar antes del CHoCH</span> <span className="text-zinc-300">= ausencia de confirmación estructural.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">Error 2: Confundir sweep y breakout</span> <span className="text-zinc-300">= compra/venta directa dentro de la toma de liquidity.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">Error 3: Ignorar el sesgo HTF</span> <span className="text-zinc-300">= ejecución contra la estructura dominante.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">Error 4: Apuntar a una liquidity ya tomada</span> <span className="text-zinc-300">= ausencia de objetivo institucional claro.</span></div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "La estructura HTF define el sesgo.",
              "El sweep suele preceder el verdadero movimiento.",
              "El CHoCH confirma el cambio de control.",
              "El FVG/OB provee la zona de ejecución.",
            ]}
          />

          <LessonExercice
            description="En XAU/USD H4, el mercado evoluciona en un sesgo bajista. Los equal highs en 4 720$ representan una BSL visible, y el objetivo principal de liquidity se sitúa en la SSL del mínimo 4 600$. Una vela H4 hace sweep de la BSL con una mecha en 4 735$ y luego cierra en 4 705$. El mercado rompe enseguida el mínimo menor en 4 680$ y crea un FVG bearish entre 4 685$ y 4 700$. El precio regresa después a la zona. ¿Cómo se reconstruye el trade SMC completo en este setup?"
            steps={[
              "Plantear el sesgo HTF: la estructura H4 es bajista (LH/LL). El sesgo orienta hacia setups vendedores en prioridad.",
              "Identificar la liquidity: los equal highs en 4 720$ forman la BSL. La SSL del mínimo 4 600$ se convierte en el objetivo final del trade.",
              "Validar el sweep: la mecha en 4 735$ toma la liquidity por encima de 4 720$, y el cierre en 4 705$ confirma la reintegración debajo de la BSL.",
              "Confirmar el CHoCH: la ruptura del mínimo menor en 4 680$ valida el cambio de carácter bajista en el timeframe de entrada.",
              "Construir el plan: entrada short 4 692$ (mitigation del FVG 4 685$-4 700$), stop loss 4 740$ (por encima de la mecha del sweep), take profit 4 600$ (objetivo la SSL). Riesgo 48$, ganancia 92$, R/R ≈ 1,9.",
            ]}
          />

          <LessonQuiz
            question="¿Qué secuencia corresponde al desarrollo lógico de un trade SMC completo?"
            options={[
              "Sweep → mitigation → BOS → liquidity → entrada",
              "Análisis HTF → sweep → entrada → CHoCH → liquidity",
              "Análisis HTF → liquidity → sweep → CHoCH → mitigation → ejecución",
              "Liquidity → breakout → entrada → mitigation → BOS",
            ]}
            correctIndex={2}
            explanation="La estructura (BOS/CHoCH) da el sesgo y el contexto, luego la mitigación del FVG o del Order Block provee la entrada."
          />

          <LessonQuiz
            question="¿Qué elemento distingue con mayor frecuencia un sweep de un verdadero breakout impulsivo?"
            options={[
              "El precio cierra por encima del nivel con continuación inmediata",
              "El precio reintegra rápidamente la zona tras haber tomado la liquidity",
              "El sweep nunca deja una mecha",
              "El breakout solo aparece en timeframe Daily",
            ]}
            correctIndex={1}
            explanation="El sweep busca principalmente tomar los stops antes del verdadero movimiento. La característica principal sigue siendo la reintegración rápida del nivel barrido. Un verdadero breakout conserva en general el cierre más allá del nivel roto con continuación inmediata."
          />

          <LessonQuiz
            question="En un setup SMC bearish, ¿dónde se sitúa generalmente el stop loss más lógico?"
            options={[
              "En medio del FVG",
              "Directamente en el nivel de entrada",
              "Debajo de la SSL objetivo",
              "Por encima de la mecha que hizo sweep de la liquidity",
            ]}
            correctIndex={3}
            explanation="La mecha del sweep suele representar el extremo del movimiento de toma de liquidity. Colocar el stop loss más allá de esa zona permite dar aire al trade y al mismo tiempo invalida claramente el escenario institucional si el nivel es recuperado."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "smc", "lecon5");
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
                  <p className="text-sm font-semibold text-emerald-400">Módulo SMC: Pensar institucional completado</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Todas las lecciones del módulo han sido completadas.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <Link href="/strategies/smc/lecon4" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lección 4
              </Link>
              <Link href="/strategies/smc" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
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
