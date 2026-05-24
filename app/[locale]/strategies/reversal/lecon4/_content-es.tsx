"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import InvalidationDiagram from "@/app/components/charts/InvalidationDiagram";
import InvalidationTriggersGridDiagram from "@/app/components/charts/InvalidationTriggersGridDiagram";
import SLManagementProgressionDiagram from "@/app/components/charts/SLManagementProgressionDiagram";

const LESSONS = [
  { id: "lecon1", slug: "lecon1", title: "Double top / Double bottom: la firma de la inversión", duration: "16 min", disabled: false },
  { id: "lecon2", slug: "lecon2", title: "Head & Shoulders: la inversión mayor", duration: "18 min", disabled: false },
  { id: "lecon3", slug: "lecon3", title: "Divergencia RSI: cuando el momentum traiciona la tendencia", duration: "17 min", disabled: false },
  { id: "lecon4", slug: "lecon4", title: "Tradear un reversal: checklist de invalidación", duration: "18 min", disabled: false },
];

export default function ContentEs() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "reversal", "lecon4"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Estrategias</Link>
          <span>/</span>
          <Link href="/strategies/reversal" className="hover:text-zinc-400 transition-colors">Reversal &amp; Inversiones</Link>
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
            Tradear un reversal: checklist de invalidación
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Entrar en un reversal es relativamente simple: hay tres patrones disponibles, Double top, H&amp;S y Divergencia RSI. El verdadero problema: saber cuándo el patrón falló. Esta lección entrega una checklist práctica para identificar una invalidación y cortar antes de devolver la cuenta.
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

        {/* ── Contenido ── */}
        <div className="space-y-8">

          {/* Bloque 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                «Salir rápido de un trade que falla no se discute. Se ejecuta.»
              </p>
            </div>
          </section>

          {/* Bloque 2 — PRERREQUISITOS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerrequisitos</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Double Top / Double Bottom → ver Estrategia Reversal L1</li>
              <li>- Head &amp; Shoulders → ver Estrategia Reversal L2</li>
              <li>- Divergencia RSI → ver Estrategia Reversal L3</li>
            </ul>
          </div>

          {/* Bloque 3 — POR QUÉ 70% FALLAN */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Por qué el 70% de los reversals fallan para los retails</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Los patrones de inversión como el Double top, el H&amp;S o la divergencia RSI tienen un win rate real en torno al 55-65% cuando son limpios. Para la mayoría de los retails, ese ratio cae al 30-40%. No porque los patrones sean malos. Porque los retails no saben reconocer cuándo el patrón falló.</p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">En una entrada en un double top donde el precio vuelve por encima de la neckline, el cerebro humano tiene dos reacciones posibles. O la salida es inmediata y se asume la pérdida chica. O el retail se dice: &apos;ya va a volver, vi el patrón&apos;. El retail promedio elige la segunda opción. En 10 trades así, salva quizás 2 y devuelve 8 con pérdidas 3 a 5 veces más grandes que lo previsto.</p>
            <p className="text-zinc-300 leading-relaxed text-sm">Un trader pro tiene una checklist de invalidación. Sin intuición. Sin feeling. Una lista mecánica de criterios que disparan el corte apenas se encienden. Sin debate. Sin &apos;espero una vela más&apos;. La salida es inmediata, la pérdida se asume, el siguiente trade se analiza. Esta lección presenta esa checklist.</p>
          </section>

          {/* Bloque 4 — CHECKLIST 5 CRITERIOS */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Checklist de invalidación: 5 criterios que disparan el corte</h2>
            <div className="my-8">
              <InvalidationTriggersGridDiagram locale="es" />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">Una sola de estas 5 condiciones encendida alcanza para disparar la salida inmediata. Sin debate, sin esperar una vela adicional.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">1. Breakout rechazado.</span> <span className="text-zinc-300">El precio vuelve a cerrar por encima (o por debajo) de la neckline en las 1-3 velas siguientes a la entrada. Patrón invalidado, salida inmediata.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">2. Vela de rechazo violenta.</span> <span className="text-zinc-300">Una vela verde grande englobando las 2-3 velas bajistas previas = señal de absorción. Salida inmediata incluso sin re-breakout de la neckline.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">3. Volumen incoherente.</span> <span className="text-zinc-300">Breakout inicial sin volumen particular + recuperación con volumen grande = lectura invertida. Patrón débil, salida inmediata.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">4. News imprevista en la ventana.</span> <span className="text-zinc-300">News macro que sale durante el trade (Fed minutes, geopolítica, datos inesperados). Salida por precaución requerida, las news destruyen los patrones.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm md:col-span-2"><span className="text-white font-semibold">5. Tiempo transcurrido sin confirmación.</span> <span className="text-zinc-300">Después de 5-8 velas en el timeframe de entrada (H1 o H4) sin progresión hacia el TP, patrón débil. La salida no es obligatoria, pero SL ajustado al break-even como mínimo. Si el patrón funcionaba, ya habría arrancado.</span></div>
            </div>
          </section>

          {/* Bloque 5 — RECONOCER UNA INVALIDACIÓN */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Reconocer una invalidación</h2>
            <div className="my-8">
              <InvalidationDiagram locale="es" />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">Visualmente, la invalidación se lee de inmediato en el gráfico. El mercado señala literalmente la invalidación, la única acción requerida es escuchar la señal y ejecutar el corte sin debate.</p>
            <p className="text-zinc-300 leading-relaxed text-sm font-semibold text-zinc-200 mb-2">Señales visuales para detectar:</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Re-cierre franco por encima (o por debajo) del nivel roto, criterio 1.</li>
              <li>- Vela de absorción verde grande englobando las 2-3 bajistas previas, criterio 2.</li>
              <li>- Volumen contrario al breakout inicial, criterio 3.</li>
              <li>- Estancamiento prolongado sin progresión hacia el TP, criterio 5.</li>
            </ul>
          </section>

          {/* Bloque 6 — 3 CASOS PRÁCTICOS CON CIFRAS */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">3 casos prácticos con cifras: cuando el patrón falla</h2>

            {/* Caso 1 */}
            <div className="mb-6 last:mb-0">
              <h3 className="text-base font-semibold text-zinc-100 mb-2">Caso 1: Double top en EUR/USD que se invalida</h3>
              <p className="text-zinc-300 leading-relaxed text-sm mb-2">Entrada short EUR/USD tomada en 1.1795 después del breakout de la neckline, escenario de la Lección 4.1. SL en 1.1835, TP en 1.1715. Posición abierta desde hace 30 minutos. El precio baja primero a 1.1780, y luego sube con fuerza. Vela H1 que cierra en 1.1810.</p>
              <p className="text-zinc-300 leading-relaxed text-sm mb-3">El precio rompió de nuevo la neckline en 1.1800 hacia arriba. El double top queda invalidado, criterio 1. La vela de subida es ancha y engloba las 2 velas bajistas previas, criterio 2. Sin news inminente. 2 criterios sobre 5 están encendidos.</p>
              <p className="text-sm text-zinc-300 leading-relaxed border-l-2 border-emerald-500/50 pl-3 py-1">
                <span className="font-semibold text-emerald-400">Acción:</span> la posición se corta en 1.1810. Pérdida: 15 pips en vez de los 40 pips previstos si se hubiera esperado el SL. 25 pips salvados.
              </p>
            </div>

            <div className="border-t border-zinc-800/60 my-6" />

            {/* Caso 2 */}
            <div className="mb-6 last:mb-0">
              <h3 className="text-base font-semibold text-zinc-100 mb-2">Caso 2: H&amp;S en XAU que se transforma en continuación</h3>
              <p className="text-zinc-300 leading-relaxed text-sm mb-2">Entrada short XAU/USD tomada en 4 570$ después del breakout de la neckline de un H&amp;S, escenario Lección 4.2. SL en 4 630$, TP en 4 480$. El precio baja bien a 4 540$ durante 2 velas, y luego sube con fuerza.</p>
              <p className="text-zinc-300 leading-relaxed text-sm mb-3">Vela H1 que cierra en 4 595$, por encima de la neckline pero debajo del hombro derecho. Verificación: breakout rechazado, criterio 1, volumen coherente en la subida, criterio 3. El patrón H&amp;S se está transformando en una simple pausa en la tendencia alcista. No se espera que el precio re-testee el hombro derecho en 4 625$.</p>
              <p className="text-sm text-zinc-300 leading-relaxed border-l-2 border-emerald-500/50 pl-3 py-1">
                <span className="font-semibold text-emerald-400">Acción:</span> la posición se corta en 4 595$. Pérdida: 25$ por unidad en vez de los 60$ previstos. Más de la mitad del riesgo está salvado.
              </p>
            </div>

            <div className="border-t border-zinc-800/60 my-6" />

            {/* Caso 3 */}
            <div>
              <h3 className="text-base font-semibold text-zinc-100 mb-2">Caso 3: Divergencia RSI sin breakout de estructura</h3>
              <p className="text-zinc-300 leading-relaxed text-sm mb-2">Una divergencia bajista limpia se detecta en XAU H1. Precio HH en 4 640$, RSI LH en 68. La tentación de entrar short directamente sigue siendo fuerte. Pero la regla es clara: &apos;una divergencia sola NUNCA alcanza&apos;, Lección 4.3.</p>
              <p className="text-zinc-300 leading-relaxed text-sm mb-3">Se espera el breakout del mínimo estructural en 4 570$. Durante 6 velas H1, el precio oscila entre 4 580$ y 4 645$. NUNCA rompe el mínimo en 4 570$. El criterio 5, tiempo transcurrido sin confirmación, se enciende. La entrada no se toma, a pesar de la divergencia visible.</p>
              <p className="text-sm text-zinc-300 leading-relaxed border-l-2 border-emerald-500/50 pl-3 py-1">
                <span className="font-semibold text-emerald-400">Acción:</span> ninguna entrada. 100% del capital queda preservado en este trade no tomado. La divergencia RSI sin breakout de estructura no es un setup tradable.
              </p>
            </div>
          </section>

          {/* Bloque 7 — CORTAR RÁPIDO */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Cortar rápido (sin dudar)</h2>
            <div className="my-8">
              <SLManagementProgressionDiagram locale="es" />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Cuando un criterio de la checklist se activa, la salida es inmediata, manual, al cierre de la vela en curso en el timeframe de entrada, H1 o H4. No antes del cierre, sino una salida demasiado temprana sigue siendo posible sobre una señal falsa. No la vela siguiente, sino se devuelve demasiado riesgo. Al cierre confirmado.</p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">La trampa emocional a evitar: &apos;espero una vela más para confirmar&apos;. NO. El stop loss ya está colocado desde la entrada, así que la pérdida máxima está limitada. Pero si se espera una vela adicional en cada invalidación, un corte a -0,5R (a la mitad del SL) se transforma en pérdida completa a -1R (al SL). Sobre 10 trades que fallan, es la diferencia entre -5R y -10R. La regla pro: la primera confirmación dispara la acción.</p>
            <p className="text-zinc-300 leading-relaxed text-sm">En ausencia de supervisión activa, el stop loss debe ajustarse después de la entrada. Para Double top o H&amp;S, el stop loss se desplaza de su posición clásica (por encima de la cabeza o del hombro) hacia la neckline misma. Para divergencia RSI, se desplaza al último mínimo estructural. El mercado cortará automáticamente si el patrón se invalida. Se sacrifica un poco de margen a cambio de la paz mental, pero el stop loss inicial queda SIEMPRE en su lugar desde la entrada.</p>
          </section>

          {/* Bloque 8 — CÁLCULO RETAIL META */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Cálculo retail: lo que se salva cortando temprano</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">Cortar en la invalidación = perder solo una fracción del riesgo inicial. Comparación concreta según el tamaño de la cuenta.</p>

            <p className="text-zinc-300 leading-relaxed text-sm font-semibold text-zinc-200 mb-2">Escenario: corte a -50% del SL previsto (en la invalidación)</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-4">
              <li>- Cuenta 300€ → riesgo previsto 15€, pérdida real ~7€ (en vez de 15€)</li>
              <li>- Cuenta 500€ → riesgo previsto 15€, pérdida real ~7€</li>
              <li>- Cuenta 1 000€ → riesgo previsto 20€, pérdida real ~10€</li>
              <li>- Cuenta 2 500€ → riesgo previsto 50€, pérdida real ~25€</li>
            </ul>

            <p className="text-zinc-300 leading-relaxed text-sm font-semibold text-zinc-200 mb-2">Sobre 10 trades que fallan: ahorro total</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-3">
              <li>- Cuenta 300€ → ~70€ ahorrados en vez de 150€ perdidos</li>
              <li>- Cuenta 500€ → ~70€ ahorrados</li>
              <li>- Cuenta 1 000€ → ~100€ ahorrados</li>
              <li>- Cuenta 2 500€ → ~250€ ahorrados</li>
            </ul>

            <p className="text-zinc-300 leading-relaxed text-sm">Cortando en la invalidación, las pérdidas se reducen un 50% en los trades que fallan. Sobre 100 trades con 40-50 perdedores, es la diferencia entre una cuenta que sobrevive y una cuenta que se funde.</p>
          </section>

          <LessonKeyPoints
            points={[
              "El 70% de los reversals retails fallan porque el trader no sabe reconocer una invalidación. No porque el patrón sea malo.",
              "La checklist 5 criterios: breakout rechazado, vela de rechazo violenta, volumen incoherente, news imprevista, tiempo transcurrido.",
              "La salida se hace al cierre de la vela en curso. No antes. No la vela siguiente. Al cierre.",
              "Cortar en la invalidación = reducir la pérdida un 50% respecto al SL inicial. Sobre 100 trades, cambia la rentabilidad global.",
            ]}
          />

          <LessonExercice
            description="Entraste short XAU/USD en 4 720$ en un double top. SL en 4 760$, TP en 4 640$. Posición abierta desde hace 1 hora. El precio baja a 4 705$, y luego sube con fuerza. Vela H1 que cierra en 4 745$ con un volumen 2x superior al promedio. ¿Qué haces?"
            steps={[
              "Verifica el criterio 1, breakout rechazado: el precio rompió de nuevo la neckline en 4 720$ hacia arriba, SÍ",
              "Verifica el criterio 2, vela de rechazo violenta: vela verde ancha que cierra en 4 745$, SÍ",
              "Verifica el criterio 3, volumen incoherente: volumen 2x superior durante la subida, SÍ",
              "3 criterios sobre 5 encendidos: ningún debate, cortas de inmediato al cierre",
              "Cortar en 4 745$: pérdida de 25$ por unidad en vez de los 40$ previstos si esperabas el SL en 4 760$, salvas más de un tercio de tu riesgo",
            ]}
          />

          <LessonQuiz
            question="¿Cuál es el criterio principal de invalidación de un double top o de un H&S después de la entrada?"
            options={[
              "El precio baja demasiado rápido hacia el TP",
              "El precio vuelve a cerrar por encima de la neckline en las 1-3 velas siguientes",
              "El volumen baja",
              "El RSI vuelve por encima de 50",
            ]}
            correctIndex={1}
            explanation="El criterio 1, breakout rechazado, es el disparador principal. Si el precio vuelve a cerrar por encima de la neckline en las 1-3 velas que siguen a la entrada, el patrón queda invalidado. El mercado señala literalmente la invalidación. La salida es inmediata."
          />

          <LessonQuiz
            question="Cuando una invalidación se identifica, la posición se corta:"
            options={[
              "Inmediatamente, antes del cierre de la vela",
              "Al cierre de la vela en curso",
              "En la vela siguiente para confirmar",
              "En el SL inicial sin cambiar nada",
            ]}
            correctIndex={1}
            explanation="La salida se hace al cierre de la vela en curso en el timeframe de entrada. Antes del cierre = riesgo de salir sobre una señal falsa. La vela siguiente = demasiado riesgo devuelto. La regla pro: la primera confirmación dispara la acción."
          />

          <LessonQuiz
            question="¿Por qué el 70% de los reversals fallan para los retails?"
            options={[
              "Porque los patrones no funcionan",
              "Porque los retails no saben reconocer una invalidación y mantienen sus posiciones perdedoras",
              "Porque los brokers manipulan los precios",
              "Porque los retails usan demasiado apalancamiento",
            ]}
            correctIndex={1}
            explanation="Los patrones tienen un win rate real en torno al 55-65% cuando son limpios. Para la mayoría de los retails, ese ratio cae al 30-40% porque no saben reconocer cuándo el patrón falló y mantienen sus posiciones esperando un retorno."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "reversal", "lecon4");
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
                  <p className="text-sm font-semibold text-emerald-400">Módulo Reversal &amp; Inversiones terminado</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Todas las lecciones del módulo fueron completadas.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <Link href="/strategies/reversal/lecon3" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lección 3
              </Link>
              <Link href="/strategies/reversal" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
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
