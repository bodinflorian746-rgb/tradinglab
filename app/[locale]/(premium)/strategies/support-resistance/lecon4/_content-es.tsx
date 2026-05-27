"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { GraphFakeBreakout } from "@/app/components/charts/GraphFakeBreakout";
import FakeVsRealBreakoutComparisonDiagram from "@/app/components/charts/FakeVsRealBreakoutComparisonDiagram";
import StopHuntDiagram from "@/app/components/charts/StopHuntDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Soporte y resistencia: las zonas donde el mercado reacciona", disabled: false },
  { id: "lecon2", title: "Identificar un nivel real (vs una línea trazada al azar)", disabled: false },
  { id: "lecon3", title: "Flip support↔resistance y tradear un rebote", disabled: false },
  { id: "lecon4", title: "Ruptura real vs fake breakout", disabled: false },
];

export default function ContentEs() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "support-resistance", "lecon4"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Estrategias</Link>
          <span>/</span>
          <Link href="/strategies/support-resistance" className="hover:text-zinc-400 transition-colors">Support / Resistance &amp; Range</Link>
          <span>/</span>
          <span className="text-zinc-500">Lección 4</span>
        </nav>

        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Principiante
            </span>
            <span className="text-zinc-700 text-xs">·</span>
            <span className="text-xs text-zinc-600">17 min</span>
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
            Ruptura real vs fake breakout
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Esta lección enseña a reconocer un fake breakout y tradear el retorno: distinción real/falso, mecánica del stop hunt institucional, plan de ejecución numérico.
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
            <span className="ml-auto text-xs text-zinc-600">4 / 4 lecciones</span>
          </div>
        </header>

        <div className="space-y-8">

          {/* Bloc 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                «La falsa ruptura atrapa a los retails que entran demasiado rápido. La misma ruptura, tomada a contracorriente, se vuelve un setup limpio.»
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerrequisitos</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Identificación S/R → ver Estrategia SR L1</li>
              <li>- Concepto de cierre vs mecha → ver Formación Trading L2</li>
              <li>- Noción de stop hunt / liquidity → ver Formación Trading L4</li>
            </ul>
          </div>

          {/* Bloc 3 — VRAI VS FAUX BREAKOUT */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Breakout real vs falso</h2>

            <div className="my-8">
              <FakeVsRealBreakoutComparisonDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              La distinción entre breakout real y fake breakout se basa en el comportamiento de la vela de ruptura y de las siguientes. El criterio esencial: cierre neto o mecha y luego retorno.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Breakout real: cierre neto más allá del nivel + follow-through en 3-5 velas</li>
              <li>- Falso breakout: la mecha supera el nivel, pero el cierre vuelve a la zona</li>
              <li>- Reintegración en 1-3 velas tras la mecha = fake confirmado</li>
              <li>- Zona fuerte (3+ toques, nivel psicológico) = terreno favorable a los fakes</li>
            </ul>
          </section>

          {/* Bloc 4 — RECONNAÎTRE UN FAKE BREAKOUT */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Reconocer un fake breakout</h2>

            <div className="my-8">
              <GraphFakeBreakout />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              4 criterios califican un fake breakout operativamente aprovechable.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Mecha de al menos 50% del cuerpo de la vela, sobresaliendo del lado de la ruptura</li>
              <li>- Reintegración clara en la zona en 1-3 velas siguientes</li>
              <li>- Volumen relativo elevado en la mecha, luego desplome post-rechazo</li>
              <li>- Contexto de zona fuerte (3+ toques, nivel psicológico, OB visible)</li>
            </ul>
          </section>

          {/* Bloc 5 — LE STOP HUNT INSTITUTIONNEL */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">El stop hunt institucional</h2>

            <div className="my-8">
              <StopHuntDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              El fake breakout es a menudo un stop hunt institucional: las órdenes stop son objetivo y se disparan, luego el precio vuelve a su dirección de origen.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Zona de cluster de stops situada justo más allá del nivel estructural (4 720$ → 4 745$)</li>
              <li>- La mecha pincha en la zona, dispara los stops, luego cierra bajo el nivel</li>
              <li>- Continuación bajista rápida tras la absorción de la liquidity</li>
              <li>- El trade se toma en el sentido opuesto a la ruptura rechazada</li>
            </ul>
          </section>

          {/* Bloc 6 — PLAN DE TRADE CHIFFRÉ */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan de trade: fake breakout XAU/USD H1</h2>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Resistencia 4 650$ tocada 3 veces en 2 meses (nivel psicológico fuerte). 4ª aproximación provoca una ruptura sospechosa. Vela 1: mecha hasta 4 680$ + cierre en 4 655$. Vela 2: cierre en 4 640$.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Setup (trade short sobre fake breakout)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Vela 1: mecha 25$ por encima, cuerpo 5$, cierre en el límite</li>
                <li>- Vela 2: cierre claro en 4 640$ (reintegración confirmada)</li>
                <li>- Entrada short: 4 640$ (cierre de la vela de confirmación)</li>
                <li>- Stop loss: 4 685$ (5$ por encima del wick en 4 680$)</li>
                <li>- Take profit: 4 540$ (zona de soporte identificada más abajo)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Cálculo del R/R</p>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>- Riesgo: 4 685$ - 4 640$ = 45$</li>
                <li>- Ganancia potencial: 4 640$ - 4 540$ = 100$</li>
                <li>- R/R: 100 / 45 = 2,22</li>
              </ul>
            </div>

            <p className="text-white font-semibold text-sm mb-2">Cálculo retail</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-3">
              <li>- Cuenta 300€ → 5% = riesgo 15€, ganancia potencial 33€</li>
              <li>- Cuenta 500€ → 3% = riesgo 15€, ganancia potencial 33€</li>
              <li>- Cuenta 1 000€ → 2% = riesgo 20€, ganancia potencial 44€</li>
              <li>- Cuenta 2 500€ → 2% = riesgo 50€, ganancia potencial 111€</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">
              El R/R se mantiene en 2,22:1 sin importar el tamaño de la cuenta.
            </p>
          </section>

          <LessonKeyPoints
            points={[
              "Un fake breakout combina 4 criterios: wick largo sin cierre claro, reintegración rápida, volumen desproporcionado, zona fuerte.",
              "El trade se toma en el sentido opuesto a la ruptura rechazada, tras doble confirmación (cierre + 2ª vela).",
              "El stop loss se coloca más allá del wick inicial con margen 3-5 pips.",
              "Los fake breakouts se observan preferentemente en zonas fuertes (3+ toques, niveles psicológicos).",
            ]}
          />

          <LessonExercice
            description="En XAU/USD H1, la resistencia 4 650$ ha sido tocada 3 veces en 2 meses. Una vela imprime una mecha hasta 4 680$ y luego cierra en 4 655$. La vela siguiente cierra en 4 640$. ¿Cómo se construye el plan de trade fake breakout?"
            steps={[
              "Validar los 4 criterios de detección: wick de 25$ por encima de la zona sin cierre claro, reintegración en 1 vela, zona fuerte (3 toques + nivel psicológico 4 650$)",
              "Validar la doble confirmación: vela 1 cierra en 4 655$ (en el límite), vela 2 cierra en 4 640$ (reintegración clara)",
              "Colocar la entrada short en 4 640$ (cierre de la vela de confirmación)",
              "Colocar el stop loss en 4 685$ (5$ por encima del wick inicial en 4 680$)",
              "Colocar el take profit en 4 560$ (zona de soporte identificada más abajo, ratio R/R 1:1,8), tamaño de posición según el risk management adaptado al capital",
            ]}
          />

          <LessonQuiz
            question="¿Cuál es el número mínimo de toques requeridos para calificar una zona de soporte o resistencia como tradeable?"
            options={[
              "1 toque, si es fuerte",
              "2 toques mínimo, 3 idealmente",
              "5 toques obligatorios",
              "Ningún umbral definido",
            ]}
            correctIndex={1}
            explanation="2 toques mínimo confirman la existencia de la zona, 3 toques elevan el nivel de confianza y confirman la memoria colectiva del mercado. Un solo toque sigue siendo un nivel puntual no confirmado."
          />

          <LessonQuiz
            question="Una resistencia acaba de romperse al alza con un cierre claro. El precio retrocede luego hacia la zona. ¿Qué señal valida el flip y autoriza una entrada long sobre la zona convertida en soporte?"
            options={[
              "El simple retorno del precio a la zona basta",
              "Una señal de rechazo (pin bar, engulfing, reacción neta) al contacto con la zona",
              "Una ruptura de la siguiente zona",
              "Ninguna señal requerida, la entrada es mecánica",
            ]}
            correctIndex={1}
            explanation="Sin señal de rechazo al contacto con la zona invertida, el flip no se valida. Una pin bar, un engulfing o una reacción neta confirman que la zona cumple su nuevo rol de soporte."
          />

          <LessonQuiz
            question="Una vela imprime una mecha más allá de una resistencia fuerte, luego cierra bajo el límite. ¿Qué confirmación adicional se requiere antes de considerar un trade short fake breakout?"
            options={[
              "Una segunda vela que mantiene o refuerza la reintegración en la zona",
              "Ninguna confirmación, la entrada se hace en el wick rechazado",
              "Una ruptura de la siguiente zona",
              "Un retroceso completo hacia la zona opuesta",
            ]}
            correctIndex={0}
            explanation="La doble confirmación (cierre de la vela de rechazo en la zona + segunda vela que mantiene la reintegración) filtra los rechazos puntuales que finalmente se transforman en ruptura válida. Entrar en el wick inicial expone a un riesgo elevado."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "support-resistance", "lecon4");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lección 4 del módulo Support / Resistance &amp; Range completada.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <Link href="/strategies/support-resistance/lecon3" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lección 3
              </Link>
              <span className="inline-flex items-center gap-2 text-sm text-zinc-700 cursor-not-allowed">
                Módulo terminado
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-600 border border-zinc-700">
                  ✓
                </span>
              </span>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
