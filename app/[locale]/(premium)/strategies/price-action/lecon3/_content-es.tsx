"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import EngulfingSetupDiagram from "@/app/components/charts/EngulfingSetupDiagram";
import EngulfingValidationGridDiagram from "@/app/components/charts/EngulfingValidationGridDiagram";
import BullishVsBearishEngulfingDiagram from "@/app/components/charts/BullishVsBearishEngulfingDiagram";
import EngulfingContextDiagram from "@/app/components/charts/EngulfingContextDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Leer una vela",   disabled: false },
  { id: "lecon2", title: "Pin bar",          disabled: false },
  { id: "lecon3", title: "Engulfing",        disabled: false },
  { id: "lecon4", title: "Lección 4",        disabled: true },
];

export default function ContentEs() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "price-action", "lecon3"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Estrategias</Link>
          <span>/</span>
          <Link href="/strategies/price-action" className="hover:text-zinc-400 transition-colors">Price Action</Link>
          <span>/</span>
          <span className="text-zinc-500">Lección 3</span>
        </nav>

        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Principiante
            </span>
            <span className="text-zinc-700 text-xs">·</span>
            <span className="text-xs text-zinc-600">14 min</span>
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
            Engulfing: la reversión de fuerza
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Esta lección te enseña a tradear una vela envolvente (bullish o bearish) en nivel estructural: criterios de validación, confluence requerida, plan de ejecución con números.
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
            <span className="ml-auto text-xs text-zinc-600">3 / 4 lecciones</span>
          </div>
        </header>

        <div className="space-y-8">

          {/* Bloque 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « El engulfing no propone. Impone. La 2ª vela es tan fuerte que borra a la primera. »
              </p>
            </div>
          </section>

          {/* Bloque 2 — PRERREQUISITOS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerrequisitos</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Anatomía de una vela → cf. Estrategia PA L1</li>
              <li>- Concepto de envolvente / engulfing → cf. Formación Trading L2</li>
              <li>- Niveles support/resistance → cf. Formación Trading L3</li>
            </ul>
          </div>

          {/* Bloque 3 — BULLISH VS BEARISH */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Bullish vs Bearish engulfing</h2>

            <div className="my-8">
              <BullishVsBearishEngulfingDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Un engulfing = cambio de poder en 2 velas. La 2ª envuelve el cuerpo de la 1ª en sentido opuesto.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- <span className="font-semibold text-zinc-100">Bullish engulfing</span>: 1ª vela roja + 2ª vela verde que envuelve el cuerpo rojo, en un support clave</li>
              <li>- <span className="font-semibold text-zinc-100">Bearish engulfing</span>: 1ª vela verde + 2ª vela roja que envuelve el cuerpo verde, en una resistance clave</li>
              <li>- El sentido de la señal sigue la dirección de la 2ª vela (la que envuelve)</li>
            </ul>
          </section>

          {/* Bloque 4 — VALIDAR UN ENGULFING */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Validar un engulfing</h2>

            <div className="my-8">
              <EngulfingValidationGridDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              No todas las velas que se solapan son engulfings válidos. 4 criterios califican el patrón como tradable.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- El cuerpo de la 2ª vela envuelve POR COMPLETO el cuerpo de la 1ª (sin contar las mechas)</li>
              <li>- Las 2 velas son de sentido opuesto (roja y luego verde, o al revés)</li>
              <li>- La 2ª vela es claramente más grande que la 1ª (no 5%, contraste real)</li>
              <li>- Amplitud superior al promedio de las 20 velas anteriores</li>
            </ul>
          </section>

          {/* Bloque 5 — LA CONFLUENCE LO CAMBIA TODO */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">La confluence lo cambia todo</h2>

            <div className="my-8">
              <EngulfingContextDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Un engulfing aislado fuera del contexto estructural es sólo una vela grande. La confluence le da el valor operativo.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Engulfing en support / resistance calificado = setup tradable</li>
              <li>- Engulfing sobre retroceso Fibonacci 0.5 / 0.618 / 0.786 en tendencia = setup tradable</li>
              <li>- Engulfing en confluence con MM50 o MM200 = refuerzo de la señal</li>
              <li>- Engulfing aislado en pleno impulso = ruido, sin setup</li>
            </ul>
          </section>

          {/* Bloque 6 — PLAN DE TRADE CON NÚMEROS */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan de trade: engulfing bullish XAU/USD H4</h2>

            <div className="my-8">
              <EngulfingSetupDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              XAU/USD rebota desde 4 500$ hacia 4 720$, luego corrige sobre Fibonacci 0.618 en 4 600$. Bullish engulfing al contacto con el Fibo en una tendencia H4 alcista.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Setup</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- 1ª vela bearish: Open 4 615$, Close 4 600$ (cuerpo 15$)</li>
                <li>- 2ª vela bullish: Open 4 595$, Close 4 625$ (cuerpo 30$, 2x la 1ª)</li>
                <li>- El cuerpo de la 2ª envuelve por completo al de la 1ª</li>
                <li>- Entrada long: 4 630$ (ruptura del high de la vela envolvente)</li>
                <li>- Stop loss: 4 590$ (5$ debajo del low de la vela envolvente)</li>
                <li>- Take profit: 4 720$ (high reciente anterior)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Cálculo del R/R</p>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>- Riesgo: 4 630$ - 4 590$ = 40$</li>
                <li>- Ganancia potencial: 4 720$ - 4 630$ = 90$</li>
                <li>- R/R: 90 / 40 = 2,25</li>
              </ul>
            </div>

            <p className="text-white font-semibold text-sm mb-2">Cálculo retail</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-3">
              <li>- Cuenta 300€ → 5% = riesgo 15€, ganancia potencial 34€</li>
              <li>- Cuenta 500€ → 3% = riesgo 15€, ganancia potencial 34€</li>
              <li>- Cuenta 1 000€ → 2% = riesgo 20€, ganancia potencial 45€</li>
              <li>- Cuenta 2 500€ → 2% = riesgo 50€, ganancia potencial 113€</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">
              El R/R se mantiene en 2,25:1 sin importar el tamaño de la cuenta.
            </p>
          </section>

          <LessonKeyPoints
            points={[
              "Engulfing = 2 velas de sentido opuesto, la 2ª envuelve POR COMPLETO el cuerpo de la 1ª.",
              "Pin bar = señal de rechazo, Engulfing = señal de cambio de poder: complementarios, no competidores.",
              "Siempre en un nivel clave o un retroceso, nunca en medio de la nada.",
              "SL debajo del low de la vela envolvente (bullish) o por encima del high (bearish), R/R mínimo 1:2.",
            ]}
          />

          <LessonExercice
            description="Aplica la lectura de velas en un gráfico real."
            steps={[
              "Abrir un gráfico XAU/USD o EUR/USD en timeframe H4",
              "Identificar 2 engulfings válidos en el histórico de los últimos 30 días y anotar el contexto: support, resistance o Fibo",
              "Para cada engulfing, verificar que el cuerpo de la 2ª vela envuelve por completo el cuerpo de la 1ª",
              "Calcular el R/R potencial para 1 engulfing válido: entrada en la ruptura, SL debajo del low de la vela engulfing, TP en el próximo nivel",
              "Detectar 1 caso donde una pin bar y un engulfing aparecen en el mismo nivel, y observar lo que pasó después",
            ]}
          />

          <LessonQuiz
            question="En EUR/USD H4, una vela bearish engulfing aparece en medio de un range, sin support o resistance cercano, sin tendencia clara, sin confluence Fibonacci. ¿Cuál es el veredicto operativo?"
            options={[
              "Setup explotable, el engulfing es una señal autónoma",
              "Setup inválido, la ausencia de contexto estructural descalifica la señal",
              "Setup explotable a condición de un volumen elevado",
              "Indeterminado sin confirmación multi-timeframe",
            ]}
            correctIndex={1}
            explanation="Una vela engulfing aislada fuera del contexto estructural no constituye una señal operativa. El contacto con un nivel estructural calificado (support, resistance, Fibonacci, tendencia clara) es indispensable. Sin contexto, la vela engulfing queda informativa pero no dispara setup."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "price-action", "lecon3");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lección 3 del módulo Price Action completada.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/strategies/price-action/lecon2"
                className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="text-zinc-600">
                  <path d="M9.5 3.5l-4 4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lección 2. Pin bar: el rechazo de nivel
              </Link>
              <span className="inline-flex items-center gap-2 text-sm text-zinc-700 cursor-not-allowed">
                Lección 4. Setup multi-timeframe Daily → H1
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
