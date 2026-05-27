"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import RSIDivergenceDiagram from "@/app/components/charts/RSIDivergenceDiagram";
import DivergenceTypesComparisonDiagram from "@/app/components/charts/DivergenceTypesComparisonDiagram";
import DivergenceWithoutBreakoutDiagram from "@/app/components/charts/DivergenceWithoutBreakoutDiagram";

const LESSONS = [
  { id: "lecon1", slug: "lecon1", title: "Double top / Double bottom: la firma de la inversión", duration: "16 min", disabled: false },
  { id: "lecon2", slug: "lecon2", title: "Head & Shoulders: la inversión mayor", duration: "18 min", disabled: false },
  { id: "lecon3", slug: "lecon3", title: "Divergencia RSI: cuando el momentum traiciona la tendencia", duration: "17 min", disabled: false },
  { id: "lecon4", slug: "lecon4", title: "Lección 4", duration: "", disabled: true },
];

export default function ContentEs() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "reversal", "lecon3"));
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
          <span className="text-zinc-500">Lección 3</span>
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
            Divergencia RSI: cuando el momentum traiciona la tendencia
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              El precio puede seguir subiendo o bajando visualmente mientras el momentum detrás del movimiento ya empieza a debilitarse. La divergencia RSI sirve justamente para hacer visible ese fenómeno. Es una señal poderosa cuando se lee bien, pero también una de las trampas clásicas de los principiantes cuando se usa sin confirmación.
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

        {/* ── Contenido ── */}
        <div className="space-y-8">

          {/* Bloque 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                «El precio puede mentir. El momentum, casi nunca.»
              </p>
            </div>
          </section>

          {/* Bloque 2 — PRERREQUISITOS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerrequisitos</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Estructura de mercado HH/HL/LL/LH → ver Curso Trading L3</li>
              <li>- Indicador RSI, oscilador de momentum → ver Curso Trading L4</li>
              <li>- Double Top / Head &amp; Shoulders → ver Estrategia Reversal L1 o L2</li>
            </ul>
          </div>

          {/* Bloque 3 — POR QUÉ FUNCIONA */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Por qué funciona la divergencia RSI</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">El RSI, o Relative Strength Index, es un oscilador que mide la fuerza del movimiento entre 0 y 100. Por encima de 70, el mercado entra en zona de sobrecompra. Debajo de 30, entra en zona de sobreventa. En esta lección, el valor exacto del RSI importa menos que su dirección respecto al precio.</p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Una divergencia aparece cuando el precio y el RSI dejan de apuntar en la misma dirección. El precio puede seguir haciendo un nuevo máximo mientras el RSI baja. O al revés, el precio puede hacer un nuevo mínimo mientras el RSI sube. Eso muestra que la tendencia continúa visualmente, pero pierde fuerza en el fondo.</p>
            <p className="text-zinc-300 leading-relaxed text-sm">El RSI mide el verdadero momentum de las velas: su tamaño, su velocidad y su sucesión. Cuando el precio trepa hacia un nuevo máximo con velas más débiles y menos agresivas, el RSI lo detecta de inmediato. Es una de las pocas herramientas capaces de mostrar una información invisible en el precio desnudo. Pero para un principiante, una señal poderosa también se vuelve una trampa poderosa si los filtros no se respetan.</p>
          </section>

          {/* Bloque 4 — DIVERGENCIA BAJISTA */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Divergencia bajista: tendencia alcista que se debilita</h2>
            <div className="my-8">
              <RSIDivergenceDiagram locale="es" />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">Una divergencia bajista aparece en una tendencia alcista. El precio crea dos máximos ascendentes, o sea dos Higher High. En paralelo, el RSI crea dos máximos descendentes, o sea dos Lower High. El precio sube mientras el RSI baja. Es la señal de que la tendencia alcista empieza a perder su momentum.</p>

            <p className="text-zinc-300 leading-relaxed text-sm font-semibold text-zinc-200 mb-2">Las 3 condiciones para que una divergencia bajista sea válida:</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-4">
              <li>- Una tendencia alcista previa clara con al menos 2 máximos identificables</li>
              <li>- El 2do máximo del precio debe estar estrictamente más alto que el 1ro</li>
              <li>- El 2do máximo del RSI debe estar estrictamente más bajo que el 1ro</li>
            </ul>

            <p className="text-zinc-300 leading-relaxed text-sm">Ejemplo en XAU/USD. El precio sube hacia un primer máximo en 4 600$, luego baja hacia 4 570$. Después vuelve a subir hacia un nuevo máximo en 4 640$, o sea un HH. Pero en el RSI H1, el primer máximo había alcanzado 75 mientras que el segundo solo sube a 68. Divergencia bajista confirmada.</p>
          </section>

          {/* Bloque 5 — LOS 4 TIPOS DE DIVERGENCIA */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Los 4 tipos de divergencia</h2>
            <div className="my-8">
              <DivergenceTypesComparisonDiagram locale="es" />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">La divergencia se divide en 4 tipos según el sentido del precio y del RSI. Las clásicas (bajista + alcista) anuncian una inversión. Las ocultas (bajista + alcista) señalan una continuación de la tendencia.</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- <span className="text-white font-semibold">Clásica bajista</span>, precio HH + RSI LH = inversión bajista potencial.</li>
              <li>- <span className="text-white font-semibold">Clásica alcista</span>, precio LL + RSI HL = inversión alcista potencial.</li>
              <li>- <span className="text-white font-semibold">Oculta bajista</span>, precio LH + RSI HH = continuación bajista (a evitar para un principiante).</li>
              <li>- <span className="text-white font-semibold">Oculta alcista</span>, precio HL + RSI LL = continuación alcista (a evitar para un principiante).</li>
            </ul>
          </section>

          {/* Bloque 6 — DIVERGENCIA ALCISTA */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Divergencia alcista: tendencia bajista que se debilita</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">Una divergencia alcista es el espejo de la divergencia bajista. Se forma en una tendencia bajista. El precio crea dos mínimos descendentes, o sea dos Lower Low. Mientras tanto, el RSI crea dos mínimos ascendentes, o sea dos Higher Low. El precio baja pero el RSI sube. Eso muestra que la tendencia bajista empieza a agotarse.</p>

            <p className="text-zinc-300 leading-relaxed text-sm font-semibold text-zinc-200 mb-2">Las 3 condiciones se mantienen, en espejo:</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-4">
              <li>- Una tendencia bajista previa clara con al menos 2 mínimos identificables</li>
              <li>- El 2do mínimo del precio debe estar estrictamente más bajo que el 1ro</li>
              <li>- El 2do mínimo del RSI debe estar estrictamente más alto que el 1ro</li>
            </ul>

            <p className="text-zinc-300 leading-relaxed text-sm">Ejemplo en XAU/USD. El precio baja hacia un primer mínimo en 4 480$, luego sube hacia 4 510$. Después vuelve a bajar hacia un nuevo mínimo en 4 450$, o sea un LL. Pero en el RSI H1, el primer mínimo había tocado 28 mientras que el segundo sube a 35. Divergencia alcista confirmada.</p>
          </section>

          {/* Bloque 7 — LA TRAMPA: DIVERGENCIA SIN BREAKOUT */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">La trampa: divergencia sin breakout</h2>
            <div className="my-8">
              <DivergenceWithoutBreakoutDiagram locale="es" />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">Una divergencia sola, sin breakout de estructura, es una trampa clásica. Mientras el precio siga respetando su estructura HH/HL o LH/LL, la tendencia se mantiene válida incluso con una divergencia presente.</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- La divergencia señala un agotamiento del momentum, no una inversión efectiva.</li>
              <li>- El breakout del último mínimo o máximo estructural sigue siendo obligatorio para confirmar la inversión.</li>
              <li>- Sin breakout, el precio puede seguir en el sentido de la tendencia a pesar de la divergencia visible.</li>
            </ul>
          </section>

          {/* Bloque 8 — PLAN DE TRADE DIVERGENCIA BAJISTA XAU/USD H1 */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan de trade: Divergencia bajista XAU/USD H1</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Se retoma el contexto de la divergencia bajista del Bloque 4. La tendencia sigue alcista, el precio imprime un HH en 4 640$ y el RSI forma un LH en 68. La divergencia está confirmada. Pero una divergencia sola nunca alcanza para entrar short. Se espera una confirmación adicional.</p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">La confirmación clásica es el breakout del último mínimo ascendente. El mínimo entre los dos máximos está en 4 570$. Si el precio cierra una vela debajo de 4 570$, la divergencia queda confirmada por la estructura del mercado. Esa señal dispara la entrada short.</p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">La entrada short se hace justo debajo del mínimo roto, en 4 565$. El stop loss clásico se colocaría por encima del segundo máximo en 4 650$, pero eso da un R/R demasiado bajo. El stop loss táctico más ajustado se coloca por encima de la mecha del segundo máximo en 4 605$, o sea 40$ de riesgo. El TP sigue el measured move: altura entre el segundo máximo en 4 640$ y el mínimo en 4 570$, o sea 70$, extendida levemente a 80$ debajo del mínimo roto para obtener un R/R redondo de 2:1.</p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Setup</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Entrada short: 4 565$ (debajo del mínimo roto)</li>
                <li>- Stop loss: 4 605$ (40$ por encima de la mecha del 2do máximo)</li>
                <li>- Take profit: 4 485$ (80$, measured move extendido)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Cálculo del R/R</p>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>- Riesgo: 4 605 - 4 565 = 40$</li>
                <li>- Ganancia potencial: 4 565 - 4 485 = 80$</li>
                <li>- R/R: 80 / 40 = 2:1</li>
                <li>- Setup explotable.</li>
              </ul>
            </div>
          </section>

          {/* Bloque 9 — CÁLCULO RETAIL */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Cálculo retail</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">El riesgo por trade se adapta al capital. Con este setup R/R 2:1, esta es la distribución según el tamaño de la cuenta.</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-3">
              <li>- Cuenta 300€ → 5% = riesgo 15€, ganancia potencial 30€</li>
              <li>- Cuenta 500€ → 3% = riesgo 15€, ganancia potencial 30€</li>
              <li>- Cuenta 1 000€ → 2% = riesgo 20€, ganancia potencial 40€</li>
              <li>- Cuenta 2 500€ → 2% = riesgo 50€, ganancia potencial 100€</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">El R/R 2:1 se mantiene sólido. La divergencia RSI tiene un win rate medio cuando el patrón es limpio y confirmado por el breakout de estructura. Sin confirmación, la trampa sigue siendo grande.</p>
          </section>

          {/* Bloque 10 — FILTROS: CUÁNDO NO TOMAR EL SETUP */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Filtros: cuándo no tomar el setup</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-red-400 font-semibold">1. Divergencia sin breakout de estructura.</span> <span className="text-zinc-300">Una divergencia sola nunca alcanza. Mientras el precio siga haciendo HH/HL o LH/LL, la tendencia sigue válida. Se espera el breakout del último mínimo o máximo estructural.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-red-400 font-semibold">2. Divergencia en timeframe pequeño (M5 o M15).</span> <span className="text-zinc-300">Las divergencias en timeframes muy pequeños producen muchísimo ruido. Timeframe mínimo: H1. H4 sigue siendo el más limpio.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-red-400 font-semibold">3. Divergencia oculta confundida con clásica.</span> <span className="text-zinc-300">Las divergencias ocultas sirven para detectar una continuación, no una inversión. Las clásicas son las que se priorizan por su lectura superior.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-red-400 font-semibold">4. News mayor en la ventana.</span> <span className="text-zinc-300">Si FOMC, NFP o CPI sale en los próximos 30 minutos, el setup no se toma. Una news puede romper completamente la divergencia.</span></div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "Divergencia = precio y RSI apuntan en direcciones opuestas. Divergencia bajista = precio HH + RSI LH. Divergencia alcista = precio LL + RSI HL.",
              "Una divergencia sola NUNCA alcanza. Se espera el breakout del último mínimo/máximo estructural para confirmar.",
              "Mínimo H1, idealmente H4. Las divergencias en timeframes pequeños son ruido.",
              "La divergencia clásica (inversión) se distingue de la divergencia oculta (continuación). Para arrancar, solo las clásicas se tradean.",
            ]}
          />

          <LessonExercice
            description="En XAU/USD H1: el precio hace un máximo 1 en 4 720$, baja a 4 690$, y luego hace un máximo 2 en 4 740$. El RSI marcaba 78 en el máximo 1 y 72 en el máximo 2. El precio acaba de cerrar en 4 685$. ¿Tomas el setup short?"
            steps={[
              "Verifica que el precio forme un HH: 4 740$ > 4 720$, OK",
              "Verifica que el RSI forme un LH: 72 < 78, OK, divergencia bajista confirmada",
              "Confirma el breakout estructural: cierre en 4 685$ debajo del mínimo 4 690$, OK",
              "Verifica que no haya news mayor prevista en los próximos 30 minutos",
              "Toma la entrada short en 4 685$, SL por encima de la mecha del máximo 2 (por ejemplo 4 750$), TP measured move extendido hacia 4 585$ para apuntar a un R/R 1,5 a 2:1",
            ]}
          />

          <LessonQuiz
            question="¿Alcanza con una divergencia RSI sola para entrar en posición?"
            options={[
              "Sí, es una señal fuerte en sí misma",
              "No, hace falta un breakout de estructura para confirmar",
              "Sí, pero solo en H1",
              "No, hace falta una media móvil adicional",
            ]}
            correctIndex={1}
            explanation="Una divergencia sola NUNCA alcanza. Mientras el precio siga respetando su estructura (HH/HL en alza o LH/LL en baja), la tendencia sigue válida. Es el breakout del último mínimo/máximo estructural el que confirma y dispara la entrada."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "reversal", "lecon3");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lección 3 del módulo Reversal &amp; Inversiones completada.</p>
                </div>
              </div>
            )}

            {/* Navegación */}
            <div className="mt-5 flex items-center justify-between">
              <Link href="/strategies/reversal/lecon2" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lección 2
              </Link>
              <Link href="/strategies/reversal/lecon4" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                Lección 4
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
