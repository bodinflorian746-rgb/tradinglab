"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import HeadShouldersDiagram from "@/app/components/charts/HeadShouldersDiagram";
import HSNecklineSlopeDiagram from "@/app/components/charts/HSNecklineSlopeDiagram";
import HSTradeExecutionDiagram from "@/app/components/charts/HSTradeExecutionDiagram";

const LESSONS = [
  { id: "lecon1", slug: "lecon1", title: "Double top / Double bottom: la firma de la inversión", duration: "16 min", disabled: false },
  { id: "lecon2", slug: "lecon2", title: "Head & Shoulders: la inversión mayor", duration: "18 min", disabled: false },
  { id: "lecon3", slug: "lecon3", title: "Lección 3", duration: "", disabled: true },
  { id: "lecon4", slug: "lecon4", title: "Lección 4", duration: "", disabled: true },
];

export default function ContentEs() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "reversal", "lecon2"));
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
          <span className="text-zinc-500">Lección 2</span>
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
            Head &amp; Shoulders: la inversión mayor
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              El Head &amp; Shoulders es el patrón de inversión más reconocido del trading técnico. Más complejo que un double top, se vuelve más confiable cuando se forma de manera limpia. Esta lección muestra cómo detectarlo, validarlo y tradearlo con un R/R modesto pero un win rate elevado.
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

        {/* ── Contenido ── */}
        <div className="space-y-8">

          {/* Bloque 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                «Cuando el mercado hace 3 máximos y el tercero falla por debajo del anterior, rara vez es casualidad.»
              </p>
            </div>
          </section>

          {/* Bloque 2 — PRERREQUISITOS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerrequisitos</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Estructura de mercado, máximos y mínimos → ver Curso Trading L3</li>
              <li>- Support / Resistance → ver Estrategia SR L1</li>
              <li>- Double Top / Double Bottom → ver Estrategia Reversal L1</li>
            </ul>
          </div>

          {/* Bloque 3 — POR QUÉ FUNCIONA EL H&S */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Por qué funciona el Head &amp; Shoulders</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Un H&amp;S se forma al final de una tendencia alcista. El precio crea tres máximos: un primer máximo llamado hombro izquierdo, un máximo más alto llamado cabeza, y un tercer máximo más bajo que la cabeza llamado hombro derecho. Los dos mínimos entre los máximos forman la neckline. Cuando esa neckline se rompe, la inversión queda confirmada.</p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Cada máximo sucesivo muestra una pérdida de fuerza de los compradores. La cabeza representa el último movimiento alcista verdadero. Cuando el hombro derecho falla en volver al nivel de la cabeza, el mercado muestra que los compradores están llegando al límite del movimiento. El breakout de la neckline luego dispara los stops de los compradores y acelera la caída.</p>
            <p className="text-zinc-300 leading-relaxed text-sm">El H&amp;S sigue siendo un patrón muy accesible para un retail. No hace falta ningún indicador complicado ni cálculo avanzado. Se ve directamente en el chart, sin importar el activo o el timeframe. Es el patrón de inversión más enseñado desde hace más de 100 años, y sigue funcionando.</p>
          </section>

          {/* Bloque 4 — H&S CLÁSICO */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Head &amp; Shoulders: fin de tendencia alcista</h2>
            <div className="my-8">
              <HeadShouldersDiagram locale="es" />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">El H&amp;S clásico aparece al final de una tendencia alcista. Forma tres máximos: un hombro izquierdo con un máximo moderado, una cabeza con un máximo más alto, y un hombro derecho con un máximo cercano al del hombro izquierdo. Los dos mínimos entre esos máximos definen la neckline.</p>

            <p className="text-zinc-300 leading-relaxed text-sm font-semibold text-zinc-200 mb-2">Las 3 condiciones para que un H&amp;S sea válido:</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-4">
              <li>- Una tendencia alcista previa clara</li>
              <li>- La cabeza debe estar estrictamente más alta que los 2 hombros</li>
              <li>- Un breakout confirmado de la neckline (cierre, no mecha)</li>
            </ul>

            <p className="text-zinc-300 leading-relaxed text-sm">Ejemplo en XAU/USD. El mercado está alcista desde hace varias sesiones. Sube hacia 4 620$ para formar el hombro izquierdo, baja a 4 580$, vuelve a subir hacia 4 660$ para formar la cabeza, y luego baja a 4 575$. Después sube hacia 4 625$ para formar el hombro derecho, al mismo nivel que el hombro izquierdo. La neckline conecta los dos mínimos en torno a 4 578$. Cuando el precio cierra debajo de 4 575$, el H&amp;S queda confirmado.</p>
          </section>

          {/* Bloque 5 — VARIANTES DE NECKLINE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Variantes de neckline</h2>
            <div className="my-8">
              <HSNecklineSlopeDiagram locale="es" />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">La neckline de un H&amp;S no siempre es estrictamente horizontal. Su pendiente condiciona el measured move y por lo tanto el objetivo de TP.</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- <span className="text-white font-semibold">Neckline horizontal</span> — measured move estándar, TP pleno conservado.</li>
              <li>- <span className="text-white font-semibold">Neckline ascendente</span> — measured move extendido, el TP gana algunos pips adicionales.</li>
              <li>- <span className="text-white font-semibold">Neckline descendente</span> — measured move reducido, TP más ajustado, R/R a menudo menos favorable.</li>
            </ul>
          </section>

          {/* Bloque 6 — H&S INVERSO */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Head &amp; Shoulders Inverso: fin de tendencia bajista</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">El H&amp;S inverso es el espejo del H&amp;S clásico. Aparece al final de una tendencia bajista. El precio forma tres mínimos: un hombro izquierdo con un mínimo moderado, una cabeza con un mínimo más bajo, y un hombro derecho con un mínimo cercano al del hombro izquierdo. La neckline conecta los dos máximos entre los mínimos.</p>

            <p className="text-zinc-300 leading-relaxed text-sm font-semibold text-zinc-200 mb-2">Las 3 condiciones se mantienen, en espejo:</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-4">
              <li>- Una tendencia bajista previa clara</li>
              <li>- La cabeza debe estar estrictamente más baja que los 2 hombros</li>
              <li>- Un breakout confirmado de la neckline hacia arriba (cierre)</li>
            </ul>

            <p className="text-zinc-300 leading-relaxed text-sm">Ejemplo en XAU/USD. El mercado está bajista desde hace varias sesiones. Baja hacia 4 470$ para formar el hombro izquierdo, sube a 4 510$, vuelve a bajar hacia 4 430$ para formar la cabeza, y luego sube a 4 515$. Después baja hacia 4 475$ para formar el hombro derecho. La neckline conecta los dos máximos en torno a 4 512$. Cuando el precio cierra por encima de 4 515$, el H&amp;S inverso queda confirmado.</p>
          </section>

          {/* Bloque 7 — PLAN DE EJECUCIÓN DEL TRADE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan de ejecución del trade</h2>
            <div className="my-8">
              <HSTradeExecutionDiagram locale="es" />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">La entrada se hace short justo debajo de la neckline para tomar el breakdown. Al precio no se le persigue durante la caída. Se requiere un cierre limpio debajo de la neckline.</p>
            <p className="text-zinc-300 leading-relaxed text-sm">El stop loss clásico se coloca por encima de la cabeza para una invalidación máxima, pero eso muchas veces da un R/R demasiado bajo. El stop loss táctico más ajustado se coloca por encima del hombro derecho: menos seguro, pero más explotable. El TP sigue el measured move: altura del patrón entre la cabeza y la neckline, proyectada debajo de la neckline.</p>
          </section>

          {/* Bloque 8 — PLAN DE TRADE XAU/USD H1 */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan de trade: H&amp;S XAU/USD H1</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Se retoma el contexto del H&amp;S clásico del Bloque 4. La tendencia alcista ya estaba en marcha. El hombro izquierdo se forma en 4 620$, la cabeza en 4 660$, el hombro derecho en 4 625$, con una neckline en torno a 4 578$. El precio acaba de cerrar una vela H1 en 4 570$, debajo de la neckline. El patrón está confirmado.</p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">El stop loss táctico se coloca justo por encima del hombro derecho en 4 630$. El stop loss clásico por encima de la cabeza en 4 670$ daría un R/R demasiado bajo: la opción táctica es la que se mantiene para este setup.</p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">El TP sigue el measured move: altura del patrón entre la cabeza en 4 660$ y la neckline en 4 578$, o sea 82$. Esa altura se proyecta debajo de la neckline hacia 4 496$. El objetivo se extiende levemente a 4 480$ para obtener un R/R redondo de 1,5:1.</p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Setup</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Entrada short: 4 570$ (cierre debajo de neckline)</li>
                <li>- Stop loss: 4 630$ (60$ por encima del hombro derecho en 4 625$)</li>
                <li>- Take profit: 4 480$ (90$, measured move extendido)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Cálculo del R/R</p>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>- Riesgo: 4 630 - 4 570 = 60$</li>
                <li>- Ganancia potencial: 4 570 - 4 480 = 90$</li>
                <li>- R/R: 90 / 60 = 1,5:1</li>
                <li>- Setup explotable al umbral mínimo.</li>
              </ul>
            </div>
          </section>

          {/* Bloque 9 — CÁLCULO RETAIL */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Cálculo retail</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">El riesgo por trade se adapta al capital. Con este setup R/R 1,5:1, esta es la distribución según el tamaño de la cuenta.</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-3">
              <li>- Cuenta 300€ → 5% = riesgo 15€, ganancia potencial aprox. 22€</li>
              <li>- Cuenta 500€ → 3% = riesgo 15€, ganancia potencial aprox. 22€</li>
              <li>- Cuenta 1 000€ → 2% = riesgo 20€, ganancia potencial aprox. 30€</li>
              <li>- Cuenta 2 500€ → 2% = riesgo 50€, ganancia potencial aprox. 75€</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">El R/R 1,5:1 sigue siendo modesto comparado con un Pin bar o un pullback de tendencia, pero el H&amp;S tiene un win rate más elevado cuando el patrón es limpio. Sobre 100 trades, la rentabilidad se alcanza incluso con un R/R modesto si el win rate supera el 50%.</p>
          </section>

          {/* Bloque 10 — FILTROS: CUÁNDO NO TOMAR EL SETUP */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Filtros: cuándo no tomar el setup</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-red-400 font-semibold">1. Cabeza poco marcada.</span> <span className="text-zinc-300">Si la cabeza apenas supera los hombros, menos de 0,3% por encima, el patrón se vuelve débil. El mercado duda sin un breakout estructural franco. Setup a ignorar.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-red-400 font-semibold">2. Hombros muy asimétricos.</span> <span className="text-zinc-300">Si el hombro derecho es mucho más alto o más bajo que el izquierdo, con más de 0,5% de diferencia, el patrón pierde su lógica clásica. La estructura se vuelve menos confiable.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-red-400 font-semibold">3. Breakout por mecha, sin cierre.</span> <span className="text-zinc-300">Una mecha que rompe brevemente la neckline y vuelve no valida nada. Se espera un verdadero cierre franco. En H&amp;S, la paciencia es crítica.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-red-400 font-semibold">4. News mayor en la ventana.</span> <span className="text-zinc-300">Si FOMC, NFP o CPI sale en los próximos 30 minutos, el setup no se toma. Una news puede invalidar el patrón al instante.</span></div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "Head & Shoulders = 3 máximos después de una tendencia alcista. La cabeza está más alta que los 2 hombros. H&S Inverso = espejo en tendencia bajista.",
              "Confirmación = cierre franco debajo o por encima de la neckline. Nada de mecha.",
              "SL clásico por encima de la cabeza, SL táctico por encima del hombro derecho para un R/R más explotable. TP = measured move (altura cabeza → neckline proyectada).",
              "El R/R del H&S es modesto, a menudo en torno a 1,5:1, pero el win rate se mantiene elevado cuando el patrón es limpio.",
            ]}
          />

          <LessonExercice
            description="En XAU/USD H1, ves un H&S con hombro izquierdo en 4 650$, cabeza en 4 680$, hombro derecho en 4 658$. Neckline en 4 620$. La cabeza está 30 pips por encima de los hombros (0,65%). El precio acaba de cerrar en 4 615$. ¿Tomas el setup?"
            steps={[
              "Verifica que la cabeza (4 680$) esté estrictamente más alta que los 2 hombros: 30 pips por encima, o sea 0,65% — superior al umbral de 0,3%, OK",
              "Confirma que los hombros sean simétricos: 4 650$ vs 4 658$, diferencia de 8 pips (0,17%) — debajo del umbral de 0,5%, OK",
              "Confirma el breakout: cierre en 4 615$ debajo de la neckline en 4 620$, no una simple mecha",
              "Verifica que no haya news mayor prevista en los próximos 30 minutos",
              "Toma la entrada short en 4 615$, SL por encima del hombro derecho en 4 668$, TP measured move extendido a 4 540$ para un R/R redondo de 1,5:1",
            ]}
          />

          <LessonQuiz
            question="¿Qué caracteriza a un Head & Shoulders?"
            options={[
              "Dos máximos casi iguales",
              "Tres máximos donde el central es el más alto",
              "Una línea de tendencia rota",
              "Un cruce de medias móviles",
            ]}
            correctIndex={1}
            explanation="El H&S se define por 3 máximos: hombro izquierdo, cabeza (el más alto), hombro derecho. La cabeza debe estar estrictamente más alta que los 2 hombros para que el patrón sea válido. Los dos mínimos entre esos máximos forman la neckline."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "reversal", "lecon2");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lección 2 del módulo Reversal &amp; Inversiones completada.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <Link href="/strategies/reversal/lecon1" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lección 1
              </Link>
              <span className="inline-flex items-center gap-2 text-sm text-zinc-700 cursor-not-allowed">
                Lección 3 — Próximamente
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
