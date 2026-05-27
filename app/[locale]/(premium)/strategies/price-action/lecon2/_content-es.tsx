"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import PinBarSetupDiagram from "@/app/components/charts/PinBarSetupDiagram";
import PinBarValidationGridDiagram from "@/app/components/charts/PinBarValidationGridDiagram";
import PinBarLocationDiagram from "@/app/components/charts/PinBarLocationDiagram";
import PinBarFailureDiagram from "@/app/components/charts/PinBarFailureDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Leer una vela",   disabled: false },
  { id: "lecon2", title: "Pin bar",          disabled: false },
  { id: "lecon3", title: "Lección 3",        disabled: true },
  { id: "lecon4", title: "Lección 4",        disabled: true },
];

export default function ContentEs() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "price-action", "lecon2"));
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
          <span className="text-zinc-500">Lección 2</span>
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
            Pin bar: el rechazo de nivel
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Esta lección te enseña a tradear una pin bar de rechazo en un nivel estructural: criterios de validación, plan de ejecución con números, y reconocimiento de un setup que falla.
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
              const isCurrent = lesson.id === "lecon2";
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
            <span className="ml-auto text-xs text-zinc-600">2 / 4 lecciones</span>
          </div>
        </header>

        <div className="space-y-8">

          {/* Bloque 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « Una pin bar aislada no dice nada. Una pin bar al contacto con un nivel lo dice todo. »
              </p>
            </div>
          </section>

          {/* Bloque 2 — PRERREQUISITOS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerrequisitos</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Anatomía de una vela → cf. Estrategia PA L1</li>
              <li>- Concepto de rechazo / mecha significativa → cf. Formación Trading L2</li>
              <li>- Niveles support/resistance → cf. Formación Trading L3</li>
            </ul>
          </div>

          {/* Bloque 3 — VALIDAR UNA PIN BAR */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Validar una pin bar</h2>

            <div className="my-8">
              <PinBarValidationGridDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              4 criterios cuantificados califican una pin bar tradable. Sin validar los 4, la vela queda informativa pero no dispara setup.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Ratio mecha / cuerpo ≥ 2:1 (idealmente 3:1)</li>
              <li>- Mecha direccional coherente: larga abajo para pin bar alcista, larga arriba para bajista</li>
              <li>- Cierre en el tercio opuesto a la mecha direccional</li>
              <li>- Contacto directo con un nivel estructural calificado (support, resistance, Fibonacci, OB)</li>
            </ul>
          </section>

          {/* Bloque 4 — LA PIN BAR NECESITA UN NIVEL */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">La pin bar necesita un nivel</h2>

            <div className="my-8">
              <PinBarLocationDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              El contacto con un nivel estructural es el criterio más discriminante. Una pin bar perfecta en medio de un range no vale nada.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Pin bar en support fuerte = tradable (rebote institucional esperado)</li>
              <li>- Pin bar en resistance fuerte = tradable (rechazo institucional esperado)</li>
              <li>- Pin bar en medio de range = fuera de nivel, señal descalificada</li>
              <li>- Condiciones externas: alineación TF superior, ausencia de noticia mayor en los 60 min</li>
            </ul>
          </section>

          {/* Bloque 5 — PLAN DE TRADE CON NÚMEROS */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan de trade: pin bar alcista XAU/USD H4</h2>

            <div className="my-8">
              <PinBarSetupDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              XAU/USD baja hacia el support psicológico 4 500$ (ya tocado 3 veces en 6 semanas). Tendencia H4 alcista. Pin bar bullish al contacto con el support.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Setup</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Entrada long: 4 520$ (cierre de la pin bar)</li>
                <li>- Stop loss: 4 470$ (debajo de la mecha inferior, con margen)</li>
                <li>- Take profit: 4 650$ (siguiente resistance H4)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Cálculo del R/R</p>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>- Riesgo: 4 520$ - 4 470$ = 50$</li>
                <li>- Ganancia potencial: 4 650$ - 4 520$ = 130$</li>
                <li>- R/R: 130 / 50 = 2,6</li>
              </ul>
            </div>

            <p className="text-white font-semibold text-sm mb-2">Cálculo retail</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-3">
              <li>- Cuenta 300€ → 5% = riesgo 15€, ganancia potencial 39€</li>
              <li>- Cuenta 500€ → 3% = riesgo 15€, ganancia potencial 39€</li>
              <li>- Cuenta 1 000€ → 2% = riesgo 20€, ganancia potencial 52€</li>
              <li>- Cuenta 2 500€ → 2% = riesgo 50€, ganancia potencial 130€</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">
              El R/R se mantiene en 2,6:1 sin importar el tamaño de la cuenta.
            </p>
          </section>

          {/* Bloque 6 — CUANDO EL SETUP FALLA */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Cuando el setup falla</h2>

            <div className="my-8">
              <PinBarFailureDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Una pin bar perfectamente válida puede fallar. El SL está para acotar la pérdida cuando el escenario se invalida.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- El mercado puede romper el nivel estructural = invalidación del rechazo</li>
              <li>- El SL debe colocarse más allá de la mecha direccional, con margen de 5-10 pips / 5-10$</li>
              <li>- Nunca mover el SL en contra durante el trade</li>
            </ul>
          </section>

          <LessonKeyPoints
            points={[
              "Una pin bar tradable valida 4 criterios: ratio mecha/cuerpo ≥ 2:1, dirección coherente, cierre en el tercio opuesto, contacto con un nivel estructural.",
              "El contacto con un nivel estructural es el criterio más discriminante. Pin bar aislada fuera de contexto = sin setup.",
              "Stop loss más allá de la mecha con margen 5-10 pips/$. Nunca en el cierre o dentro del cuerpo.",
              "No tradear en los 60 minutos alrededor de una noticia mayor (NFP, FOMC, CPI).",
            ]}
          />

          <LessonExercice
            description="En EUR/USD H1, el precio se acerca a una resistance calificada en 1.1820 (3 toques en las últimas 5 semanas, MM50 H4 en 1.1815 = confluence). Una vela H1 imprime una mecha superior hasta 1.1835 y luego cierra en 1.1803. Apertura en 1.1815. ¿Qué calificación tiene esta señal y cuál es el plan de trade?"
            steps={[
              "Medir la pin bar: mecha superior 32 pips (de 1.1803 a 1.1835), cuerpo 12 pips (de 1.1815 a 1.1803). Ratio mecha/cuerpo = 32/12 = 2,67:1, criterio 1 validado",
              "Verificar la dirección y el contacto: mecha larga arriba, pin bar bajista al contacto con la resistance 1.1820, criterios 2 y 4 validados",
              "Posición del cierre: 1.1803 dentro del rango 1.1803-1.1835, en el mínimo absoluto, cierre en el tercio inferior, criterio 3 validado",
              "Confluence: MM50 H4 en 1.1815 dentro de la zona = refuerzo de la señal",
              "Plan: entrada short en 1.1803 (cierre pin bar), stop loss en 1.1843 (8 pips por encima del wick en 1.1835), take profit en 1.1720 (siguiente support H4). Riesgo 40 pips, ganancia 83 pips, R/R 2,07. Tamaño de posición según el riesgo por trade adaptado al capital",
            ]}
          />

          <LessonQuiz
            question="Una pin bar alcista imprime una mecha inferior 3 veces más grande que su cuerpo y cierra en el tercio superior, pero aparece en medio de un range lateral sin nivel estructural cercano. ¿Cuál es el veredicto operativo?"
            options={[
              "Setup explotable, la calidad de la pin bar es suficiente",
              "Setup inválido, la ausencia de contacto con un nivel estructural descalifica la señal",
              "Setup explotable a condición de un volumen elevado",
              "Indeterminado sin confirmación Fibonacci",
            ]}
            correctIndex={1}
            explanation="El contacto con un nivel estructural calificado es el criterio más discriminante de una pin bar tradable. Sin ese contacto, el rechazo no está anclado en una zona de memoria colectiva. El movimiento post-pin bar carece de combustible estructural y la señal se invalida frecuentemente en las velas siguientes. Incluso un ratio 3:1 y un cierre perfecto no compensan la ausencia de nivel."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "price-action", "lecon2");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lección 2 del módulo Price Action completada.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/strategies/price-action/lecon1"
                className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="text-zinc-600">
                  <path d="M9.5 3.5l-4 4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lección 1. Leer una vela: cuerpo, mecha, señal
              </Link>
              <span className="inline-flex items-center gap-2 text-sm text-zinc-700 cursor-not-allowed">
                Lección 3, Engulfing, la reversión de fuerza
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
