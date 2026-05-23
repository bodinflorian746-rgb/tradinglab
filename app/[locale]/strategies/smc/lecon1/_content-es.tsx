"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { MarketStructureDiagram } from "@/app/components/charts/MarketStructureDiagram";
import InternalVsExternalStructureZoomDiagram from "@/app/components/charts/InternalVsExternalStructureZoomDiagram";
import SMCPhasesDiagram from "@/app/components/charts/SMCPhasesDiagram";

const LESSONS = [
  { id: "lecon1", title: "Market Structure SMC: leer la estructura del mercado como una institución", disabled: false },
  { id: "lecon2", title: "Lección 2", disabled: false },
  { id: "lecon3", title: "Lección 3", disabled: false },
  { id: "lecon4", title: "Lección 4", disabled: true },
  { id: "lecon5", title: "Lección 5", disabled: true },
];

export default function ContentEs() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "smc", "lecon1"));
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
          <span className="text-zinc-500">Lección 1</span>
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
            Market Structure SMC: leer la estructura del mercado como una institución
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Esta lección cubre la lectura institucional de la estructura del mercado: identificar los swings significativos, distinguir estructura interna y externa, y reconocer las fases de acumulación, expansión y distribución.
            </p>
          </div>

          {/* Indicador de estructura */}
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

          {/* Pills de lecciones */}
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

        {/* ── Contenido ── */}
        <div className="space-y-8">

          {/* Bloque 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-blue-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « El retail ve una tendencia. El institucional ve una estructura con intenciones precisas en cada swing. »
              </p>
            </div>
          </section>

          {/* Bloque 2 — PRERREQUISITOS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerrequisitos</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- HH/HL/LL/LH y tendencia direccional → ver Formación Trading L3</li>
              <li>- Swing high / swing low → ver Formación Trading L2</li>
              <li>- Fases acumulación/distribución → ver Formación Macro L4</li>
            </ul>
          </div>

          {/* Bloque 3 — RECONOCER LA ESTRUCTURA */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Reconocer la estructura</h2>

            <div className="my-8">
              <MarketStructureDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              La lectura SMC se basa en la identificación de los swing highs y swing lows significativos, no de cada oscilación del precio. Un swing significativo deja una huella estructural visible.
            </p>

            <h3 className="text-sm font-semibold text-zinc-200 mb-2">Criterios de un swing significativo</h3>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Amplitud mínima: 50-80 pips EUR/USD H4, 50-100$ XAU/USD H4</li>
              <li>- Vela de pivote clara con mecha significativa de rechazo</li>
              <li>- Reacción post-swing: retroceso ≥ 20% en dirección opuesta</li>
              <li>- Visibilidad multi-timeframe: visible Daily y H4</li>
            </ul>
          </section>

          {/* Bloque 4 — ESTRUCTURA INTERNA VS EXTERNA */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Estructura interna vs externa</h2>

            <div className="my-8">
              <InternalVsExternalStructureZoomDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              La lectura SMC distingue 2 niveles de estructura imbricados en el mismo gráfico. La alineación de ambos da el sesgo direccional fuerte.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-white font-semibold text-sm mb-2">Estructura interna (M15 - H1)</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Movimientos visibles en timeframes cortos</li>
                  <li>- Puede mostrar HH/HL dentro de un LL/LH externo</li>
                  <li>- Tradear en el sentido externo = alineación institucional</li>
                </ul>
              </div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-white font-semibold text-sm mb-2">Estructura externa (H4 - Daily)</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Swings mayores visibles en timeframes largos</li>
                  <li>- Da el sesgo direccional a varios días/semanas</li>
                  <li>- Ninguna posición institucional va en contra sin BOS + CHoCH</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Bloque 5 — LAS 3 FASES DEL MERCADO */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Las 3 fases del mercado</h2>

            <div className="my-8">
              <SMCPhasesDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              El mercado alterna 3 fases reconocibles. Identificar la fase en curso determina la naturaleza de los setups explotables.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-emerald-400 font-semibold text-sm mb-2">Acumulación</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Range lateral tras tendencia bajista</li>
                  <li>- Amplitud reducida, false breakouts frecuentes</li>
                  <li>- Setups range + breakout alcista post-confirmación</li>
                </ul>
              </div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-emerald-400 font-semibold text-sm mb-2">Expansión (markup/markdown)</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Tendencia direccional nítida HH/HL o LL/LH</li>
                  <li>- Amplitud de los swings superior al promedio</li>
                  <li>- Setups pullback + BOS de continuación prioritarios</li>
                </ul>
              </div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-amber-400 font-semibold text-sm mb-2">Distribución</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Range lateral tras tendencia alcista</li>
                  <li>- False breakouts alcistas para atrapar compradores retail</li>
                  <li>- Setups range + breakout bajista post-confirmación</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Bloque 6 — MÉTODO 4 ETAPAS */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Lectura top-down en 4 etapas</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              La cartografía SMC de un gráfico sigue un método top-down estructurado.
            </p>
            <ol className="space-y-2 text-sm text-zinc-300 list-decimal pl-5">
              <li><span className="font-semibold text-white">Daily o Weekly</span> — identificar los 3-5 últimos swings mayores (estructura externa)</li>
              <li><span className="font-semibold text-white">Clasificar la fase</span> — acumulación, expansión, o distribución</li>
              <li><span className="font-semibold text-white">H4</span> — verificar la alineación de la estructura interna con la estructura externa</li>
              <li><span className="font-semibold text-white">H1 o M15</span> — pre-identificar zonas de interés (HL, liquidity, OB potenciales)</li>
            </ol>
          </section>

          {/* Bloque 7 — EJEMPLO CON CIFRAS XAU/USD */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Ejemplo con cifras: lectura SMC en XAU/USD</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              XAU/USD en dinámica alcista desde hace 8 semanas. Aplicación del método SMC para cartografiar el mercado.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Swings Daily mayores</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Swing low: 4 380$ (-5 sem.)</li>
                <li>- Swing high: 4 520$ (-4 sem.)</li>
                <li>- HL: 4 460$ (-3 sem.)</li>
                <li>- HH: 4 720$ (-1 sem.)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Veredicto</p>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>- Fase: expansión alcista (markup) confirmada</li>
                <li>- Sesgo: long</li>
                <li>- Zona de pullback activa: 4 580$-4 600$ (último HL H4)</li>
                <li>- Zona secundaria: 4 540$-4 560$ (61.8% Fibo)</li>
                <li>- Setup a vigilar: señal de rechazo M15 al contacto 4 580$-4 600$ para long en el sentido del markup Daily</li>
              </ul>
            </div>
          </section>

          {/* Bloque 8 — ERRORES COMUNES */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Errores comunes</h2>
            <div className="space-y-3">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-red-400 font-semibold text-sm mb-2">1. Confundir estructura interna y externa</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- HH/HL M15 en un Daily bajista = pullback, no retroceso</li>
                  <li>- Siempre establecer la estructura externa primero</li>
                </ul>
              </div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-red-400 font-semibold text-sm mb-2">2. Leer el M15 sin contexto HTF</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Cada oscilación se vuelve una señal sin coherencia</li>
                  <li>- Procedimiento top-down obligatorio: Daily → M15</li>
                </ul>
              </div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-red-400 font-semibold text-sm mb-2">3. Swing significativo con amplitud insuficiente</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Un swing de 20 pips EUR/USD H4 NO es una referencia estructural</li>
                  <li>- Aplicar estrictamente los umbrales del Bloque 3</li>
                </ul>
              </div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "La lectura SMC distingue estructura interna (M15/H1) y externa (H4/Daily). La alineación da el sesgo.",
              "El mercado alterna 3 fases: acumulación, expansión (markup/markdown), distribución.",
              "Procedimiento top-down obligatorio: Daily → H4 → H1 → M15. Sin análisis direccional en M15 aislado.",
              "Ningún setup contra la estructura externa Daily sin BOS contratendencia + CHoCH confirmado.",
            ]}
          />

          <LessonExercice
            description="En EUR/USD, el Daily muestra una estructura bajista con LL/LH en las últimas 6 semanas. El H4 muestra desde hace 3 días una estructura interna con un HH reciente en 1.1780 y un HL en 1.1720. El precio actual es 1.1760. ¿Cómo clasificar esta situación y qué sesgo operativo deriva?"
            steps={[
              "Identificar la estructura externa Daily: estructura bajista confirmada (LL/LH) en las últimas 6 semanas — sesgo direccional mayor bajista.",
              "Identificar la estructura interna H4: estructura alcista de corto plazo (HH reciente en 1.1780, HL en 1.1720) — movimiento contratendencia respecto al Daily.",
              "Clasificar la situación: estructura interna H4 alcista INTERNA a una estructura externa Daily bajista → pullback técnico dentro de la tendencia bajista mayor.",
              "Verificar la ausencia de señal de retroceso: ningún BOS contratendencia Daily ni CHoCH confirmado. La estructura externa Daily sigue válida.",
              "Sesgo operativo: SHORT, en el sentido de la estructura externa Daily. Ningún setup long es explotable mientras el Daily no produzca BOS + CHoCH. La estructura interna H4 sirve únicamente para identificar la zona de rechazo potencial alrededor de 1.1780 (último HH H4 = resistencia short potencial al contacto).",
            ]}
          />

          <LessonQuiz
            question="En un setup SMC, ¿qué timeframe dicta la dirección global del trade?"
            options={[
              "M15, que da la señal más reciente",
              "H4, que combina dirección y timing",
              "Daily, que establece la estructura externa y el sesgo direccional",
              "M1, para la precisión máxima",
            ]}
            correctIndex={2}
            explanation="La estructura externa Daily dicta el sesgo direccional global. H4 afina el contexto (estructura interna y niveles operativos), M15 sirve únicamente para el timing fino de la entrada. Ningún setup SMC se toma contra la dirección dada por el Daily."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "smc", "lecon1");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lección 1 del módulo SMC: Pensar institucional terminada.</p>
                </div>
              </div>
            )}

            {/* Navegación */}
            <div className="mt-5 flex items-center justify-between">
              <Link href="/strategies/smc" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Módulo SMC — Vista general
              </Link>
              <Link href="/strategies/smc/lecon2" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                Lección 2
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
