"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LiquidityPoolsDiagram } from "@/app/components/charts/LiquidityPoolsDiagram";
import { LiquidityGrabDiagram } from "@/app/components/charts/LiquidityGrabDiagram";
import { FVGDiagram } from "@/app/components/charts/FVGDiagram";

const LESSONS = [
  { id: "lecon1", title: "Lección 1", disabled: false },
  { id: "lecon2", title: "Lección 2", disabled: false },
  { id: "lecon3", title: "Lección 3", disabled: false },
  { id: "lecon4", title: "FVG y liquidity: tradear el desequilibrio institucional", disabled: false },
  { id: "lecon5", title: "Lección 5", disabled: true },
];

export default function ContentEs() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "smc", "lecon4"));
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
          <span className="text-zinc-500">Lección 4</span>
        </nav>

        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Intermedio
            </span>
            <span className="text-zinc-700 text-xs">·</span>
            <span className="text-xs text-zinc-600">16 min</span>
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
            FVG y liquidity: tradear el desequilibrio institucional
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              El mercado no se mueve únicamente por tendencia o estructura. Los movimientos más agresivos suelen aparecer tras una toma de liquidity seguida de un desequilibrio de precio. Esta lección enlaza 3 conceptos operativos: la liquidity (BSL/SSL), el sweep y el Fair Value Gap (FVG).
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

        {/* ── Contenido ── */}
        <div className="space-y-8">

          {/* Bloque 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-blue-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « El retail ve un breakout. Las instituciones ven una zona de stops a barrer antes del verdadero movimiento. »
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
            </ul>
          </div>

          {/* Bloque 3 — LOS POOLS DE LIQUIDITY */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Los pools de liquidity</h2>
            <div className="my-8">
              <LiquidityPoolsDiagram locale="es" />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">Las zonas de liquidity corresponden a los lugares donde se concentran los stops del retail. Los máximos recientes atraen los stops vendedores (BSL), mientras que los mínimos recientes concentran los stops compradores (SSL). Los equal highs y equal lows crean zonas de liquidity evidentes para los institucionales.</p>
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Puntos a identificar</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Equal highs = BSL potencial</li>
              <li>- Equal lows = SSL potencial</li>
              <li>- Máximos/mínimos HTF = liquidity mayor</li>
            </ul>
          </section>

          {/* Bloque 4 — EL SWEEP */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">El sweep: el grab de liquidity</h2>
            <div className="my-8">
              <LiquidityGrabDiagram locale="es" />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">El sweep aparece cuando el precio atraviesa brutalmente una zona de liquidity antes de reintegrar rápidamente el range o la estructura anterior. La mecha toma los stops. El cierre rechaza el movimiento. El sweep sirve a menudo para llenar órdenes institucionales antes del impulso opuesto.</p>
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Características del sweep</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Perforación rápida de un máximo o de un mínimo</li>
              <li>- Mecha agresiva con rechazo visible</li>
              <li>- Cierre reintegrado debajo/por encima del nivel barrido</li>
            </ul>
          </section>

          {/* Bloque 5 — EL FAIR VALUE GAP */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">El Fair Value Gap (FVG)</h2>
            <div className="my-8">
              <FVGDiagram locale="es" />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">El Fair Value Gap representa un desequilibrio dejado por un impulso rápido. En una secuencia de 3 velas, un espacio queda sin operar entre la mecha de la vela 1 y la de la vela 3. El mercado regresa frecuentemente a esta zona para mitigar la ineficiencia antes de continuar su movimiento.</p>
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Características del FVG</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Aparición en un impulso fuerte</li>
              <li>- Desequilibrio visible entre 3 velas</li>
              <li>- Regreso frecuente del precio para mitigation</li>
            </ul>
          </section>

          {/* Bloque 6 — COMBINAR SWEEP + FVG */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Combinar sweep + FVG: el setup completo</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">El sweep crea a menudo un desplazamiento brutal que deja un FVG en el movimiento de rechazo. El regreso del precio al FVG permite obtener una entrada más precisa con un stop reducido.</p>
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Secuencia tipo</p>
            <ol className="space-y-1 text-sm text-zinc-300 list-decimal pl-5">
              <li>Liquidity identificada (BSL/SSL)</li>
              <li>Sweep de la zona</li>
              <li>Displacement agresivo</li>
              <li>Creación del FVG</li>
              <li>Regreso al FVG</li>
              <li>Objetivo hacia la liquidity opuesta</li>
            </ol>
          </section>

          {/* Bloque 7 — PLAN DE TRADE EUR/USD H4 */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan de trade con cifras (EUR/USD H4)</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">EUR/USD H4. Acumulación entre 1.1700 y 1.1750. Equal highs en 1.1760 = BSL identificada. Una vela H4 perfora 1.1760 y luego cierra en 1.1745. El rechazo crea un FVG bearish entre 1.1735 y 1.1748. El setup consiste en esperar el regreso del precio al FVG para buscar una entrada short hacia la SSL situada debajo de 1.1700.</p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Setup</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Entrada short: 1.1745</li>
                <li>- Stop loss: 1.1768</li>
                <li>- Take profit: 1.1700</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Lectura del setup</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Sweep alcista por encima de 1.1760</li>
                <li>- Reintegración inmediata debajo de la BSL</li>
                <li>- Displacement bearish agresivo</li>
                <li>- Creación del FVG bearish</li>
                <li>- Regreso al FVG = zona de entrada</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Cálculo del R/R</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-3">
                <li>- Riesgo: 1.1768 - 1.1745 = 23 pips</li>
                <li>- Ganancia: 1.1745 - 1.1700 = 45 pips</li>
                <li>- R/R: 45 / 23 = 1,96</li>
              </ul>
              <p className="text-zinc-300 leading-relaxed text-sm">El setup presenta un rendimiento casi el doble del riesgo asumido.</p>
            </div>

            <p className="text-white font-semibold text-sm mb-2">Cálculo retail</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-3">
              <li>- Cuenta 300€ → 5% = riesgo 15€, ganancia potencial 29€</li>
              <li>- Cuenta 500€ → 3% = riesgo 15€, ganancia potencial 29€</li>
              <li>- Cuenta 1 000€ → 2% = riesgo 20€, ganancia potencial 39€</li>
              <li>- Cuenta 2 500€ → 2% = riesgo 50€, ganancia potencial 98€</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">El R/R se mantiene 1,96:1 sin importar el tamaño de la cuenta.</p>
          </section>

          {/* Bloque 8 — FILTROS */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Filtros: cuándo no tomar el setup</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">Sweep sin FVG claro</span> <span className="text-zinc-300">= falta de desequilibrio explotable.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">FVG ya totalmente mitigado</span> <span className="text-zinc-300">= ineficiencia ya cubierta.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">Contexto de range sucio</span> <span className="text-zinc-300">= ausencia de dirección HTF.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">News macro mayor inminente</span> <span className="text-zinc-300">= volatilidad imprevisible.</span></div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "La liquidity se concentra por encima de los máximos y debajo de los mínimos.",
              "El sweep barre los stops antes del verdadero movimiento.",
              "El FVG representa una ineficiencia dejada por el impulso.",
              "El setup SMC completo = sweep → displacement → FVG → mitigation.",
            ]}
          />

          <LessonExercice
            description="En XAU/USD H4, el mercado muestra 2 equal highs en 4 680$ y un mínimo reciente en 4 600$. Una vela H4 perfora 4 680$, imprime una mecha en 4 690$, y luego cierra en 4 660$. Las velas siguientes crean un FVG bearish entre 4 645$ y 4 658$. El precio regresa luego al FVG. ¿Cómo se construye el plan de trade en este setup?"
            steps={[
              "Identificar la liquidity: los 2 equal highs en 4 680$ constituyen una BSL. La mecha en 4 690$ confirma el sweep por encima del nivel.",
              "Confirmar el rechazo: el cierre en 4 660$, debajo de los equal highs, valida la reintegración — el breakout era un sweep, no una ruptura.",
              "Localizar el FVG: el desequilibrio bearish se sitúa entre 4 645$ y 4 658$. El regreso del precio a esta zona da el punto de entrada short.",
              "Plantear el plan: entrada short 4 655$ (dentro del FVG), stop loss 4 695$ (arriba de la mecha del sweep), take profit 4 605$ (objetivo la SSL debajo del mínimo 4 600$).",
              "Calcular el R/R: riesgo 40$, ganancia potencial 50$, R/R 1,25. El setup sigue siendo aceptable pero presenta un rendimiento menos favorable que el caso EUR/USD H4.",
            ]}
          />

          <LessonQuiz
            question="¿Qué característica distingue con mayor frecuencia un sweep de un verdadero breakout institucional?"
            options={[
              "El mercado cierra por encima del nivel roto con continuación fuerte",
              "El sweep rara vez deja una mecha visible",
              "El precio reintegra rápidamente el nivel barrido tras haber tomado la liquidity",
              "Un sweep solo aparece durante las news macro",
            ]}
            correctIndex={2}
            explanation="El sweep se reconoce por la reintegración rápida del nivel barrido tras haber tomado la liquidity. La mecha perfora, los stops se disparan, y luego el precio regresa debajo (o por encima) del nivel y rechaza el movimiento. Un verdadero breakout institucional se traduciría al contrario por un cierre franco más allá del nivel con continuación direccional."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "smc", "lecon4");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lección 4 del módulo SMC: Pensar institucional terminada.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <Link href="/strategies/smc/lecon3" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lección 3
              </Link>
              <span className="inline-flex items-center gap-2 text-sm text-zinc-700 cursor-not-allowed">
                Lección 5 — Próximamente
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-600 border border-zinc-700">
                  Pronto
                </span>
              </span>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
