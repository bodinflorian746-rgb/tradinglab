"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { MultiTimeframeDiagram } from "@/app/components/charts/MultiTimeframeDiagram";
import MultiTFEntryDiagram from "@/app/components/charts/MultiTFEntryDiagram";
import { TradePlanDiagram } from "@/app/components/charts/TradePlanDiagram";
import MultiTFAlignmentCheckDiagram from "@/app/components/charts/MultiTFAlignmentCheckDiagram";
import MultiTFConflictDiagram from "@/app/components/charts/MultiTFConflictDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Leer una vela",   disabled: false },
  { id: "lecon2", title: "Pin bar",          disabled: false },
  { id: "lecon3", title: "Engulfing",        disabled: false },
  { id: "lecon4", title: "Setup MTF",        disabled: false },
];

export default function ContentEs() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "price-action", "lecon4"));
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
          <span className="text-zinc-500">Lección 4</span>
        </nav>

        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Principiante
            </span>
            <span className="text-zinc-700 text-xs">·</span>
            <span className="text-xs text-zinc-600">15 min</span>
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
            Setup multi-timeframe: alinear 3 horizontes
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Esta lección te enseña a construir una entrada precisa alineando 3 timeframes: Daily (sesgo), H4 (zona), M15 (señal). Sin alineación, no hay setup.
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

          {/* Bloque 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « Una entrada limpia se construye sobre 3 niveles: el contexto da la dirección, la zona da el lugar, la señal da el momento. »
              </p>
            </div>
          </section>

          {/* Bloque 2 — PRERREQUISITOS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerrequisitos</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Lectura de vela → cf. Estrategia PA L1</li>
              <li>- Pin bar y engulfing → cf. Estrategia PA L2 y L3</li>
              <li>- Concepto de timeframes → cf. Formación Trading L1</li>
            </ul>
          </div>

          {/* Bloque 3 — LECTURA TOP-DOWN */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Lectura top-down Daily → H4 → M15</h2>

            <div className="my-8">
              <MultiTimeframeDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Cada timeframe juega un rol distinto y no intercambiable. La secuencia top-down garantiza que las entradas se alineen siempre con el sesgo mayor.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- <span className="font-semibold text-zinc-100">Daily</span> = sesgo direccional global (HH/HL alcista o LH/LL bajista)</li>
              <li>- <span className="font-semibold text-zinc-100">H4</span> = zonas mayores de support / resistance, lugares potenciales de entrada</li>
              <li>- <span className="font-semibold text-zinc-100">H1</span> = confirmación estructural de la alineación con el Daily</li>
              <li>- <span className="font-semibold text-zinc-100">M15</span> = timing fino vía señal de price action (pin bar, engulfing)</li>
            </ul>
          </section>

          {/* Bloque 4 — VALIDAR LA ALINEACIÓN */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Validar la alineación</h2>

            <div className="my-8">
              <MultiTFAlignmentCheckDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Un setup multi-timeframe se valida únicamente cuando los 4 criterios de alineación están reunidos. Uno solo que falte invalida el setup.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Tendencia Daily claramente orientada (HH/HL o LH/LL en las últimas 30-50 velas)</li>
              <li>- Zona H4 identificada y tradable cerca del precio (distancia ≤ 100 pips/$ del precio actual)</li>
              <li>- Estructura H1 alineada con la tendencia Daily (sin corrección temporal en curso)</li>
              <li>- Señal M15 explícita al contacto con la zona H4 (pin bar, engulfing, reacción inmediata)</li>
            </ul>
          </section>

          {/* Bloque 5 — CONFLICTO MULTI-TF */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Conflicto multi-TF (no tradear)</h2>

            <div className="my-8">
              <MultiTFConflictDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Cuando los timeframes muestran sesgos en conflicto, ningún setup es explotable. La disciplina consiste en no tradear hasta que se restablezca la alineación.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Daily alcista + H4 bajista = corrección en curso, esperar la reanudación H4</li>
              <li>- Daily ambiguo (consolidación lateral) = sin sesgo, sin trade hasta que se aclare</li>
              <li>- M15 contra Daily = ruido de corto plazo, ignorar la señal aislada</li>
            </ul>
          </section>

          {/* Bloque 6 — PLAN DE TRADE CON NÚMEROS */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan de trade: setup MTF EUR/USD</h2>

            <div className="my-8">
              <MultiTFEntryDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              EUR/USD en tendencia alcista confirmada en Daily (HH/HL en 6 semanas). Zona H4 support en 1.1750-1.1770 (3 toques, fresca). H1 alineado alcista. Pin bar M15 impresa al contacto con la zona.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Setup</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Daily: último HH 1.1840, último HL 1.1720, sesgo long</li>
                <li>- H4: zona support 1.1750-1.1770, 3 toques en 5 semanas</li>
                <li>- M15: pin bar alcista, mecha inferior 1.1762, cierre 1.1778</li>
                <li>- Entrada long: 1.1778 (cierre de la pin bar M15)</li>
                <li>- Stop loss: 1.1745 (5 pips debajo de la zona H4)</li>
                <li>- Take profit nivel 1: 1.1840 (HH Daily), nivel 2: 1.1900 (extensión)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Cálculo del R/R</p>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>- Riesgo: 1.1778 - 1.1745 = 33 pips</li>
                <li>- Ganancia nivel 1: 1.1840 - 1.1778 = 62 pips → R/R 1,88</li>
                <li>- Ganancia nivel 2: 1.1900 - 1.1778 = 122 pips → R/R 3,70</li>
                <li>- El setup apunta prioritariamente al TP nivel 2 para un R/R óptimo</li>
              </ul>
            </div>

            <div className="my-8">
              <TradePlanDiagram locale="es" />
            </div>

            <p className="text-white font-semibold text-sm mb-2">Cálculo retail</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-3">
              <li>- Cuenta 300€ → 5% = riesgo 15€, ganancia potencial 56€</li>
              <li>- Cuenta 500€ → 3% = riesgo 15€, ganancia potencial 56€</li>
              <li>- Cuenta 1 000€ → 2% = riesgo 20€, ganancia potencial 74€</li>
              <li>- Cuenta 2 500€ → 2% = riesgo 50€, ganancia potencial 185€</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">
              El R/R se mantiene en 3,70:1 sin importar el tamaño de la cuenta.
            </p>
          </section>

          <LessonKeyPoints
            points={[
              "Procedimiento top-down obligatorio: Daily → H4 → H1 → M15. Sin análisis direccional sobre M15 aislado.",
              "Daily = sesgo. H4 = zonas. H1 = alineación estructural. M15 = timing de entrada.",
              "Los 4 criterios de alineación deben validarse todos. Uno solo que falte invalida el setup.",
              "Stop loss más allá de la zona H4 con margen 5-10 pips. Take profit hacia la próxima zona H4 en el sentido del trade.",
            ]}
          />

          <LessonExercice
            description="En XAU/USD, el Daily está en tendencia alcista con último HH en 4 680$ y último HL en 4 520$. Se identifica una zona de support H4 entre 4 560$ y 4 580$ (3 toques en 5 semanas). El precio actual está en 4 595$. La estructura H1 está alineada alcista. El precio baja a tocar 4 575$ y luego imprime un engulfing alcista M15 con cierre en 4 595$. ¿Cómo se construye el plan de trade?"
            steps={[
              "Validar los 4 criterios de alineación: tendencia Daily alcista confirmada, zona H4 4 560$-4 580$ tradable (3 toques, fresca), estructura H1 alineada alcista, señal M15 engulfing alcista al contacto con la zona H4",
              "Colocar la entrada long en 4 595$ (cierre del engulfing M15)",
              "Colocar el stop loss en 4 555$ (5$ debajo del límite inferior de la zona H4 en 4 560$)",
              "Colocar el take profit nivel 1 en 4 680$ (HH Daily anterior) o nivel 2 en 4 750$ (proyección de extensión Daily)",
              "Calcular los R/R: Riesgo 40$, ganancia nivel 1 = 85$ → R/R 2,12 ; ganancia nivel 2 = 155$ → R/R 3,88. Tamaño de posición según el riesgo por trade adaptado al capital",
            ]}
          />

          <LessonQuiz
            question="Una vela presenta un cuerpo reducido, una mecha inferior larga (3 veces el tamaño del cuerpo) y un cierre en el tercio superior del rango. ¿Qué patrón y qué mensaje del mercado?"
            options={[
              "Doji de indecisión, equilibrio entre los bandos",
              "Pin bar alcista, rechazo a la baja confirmado",
              "Marubozu bajista, dominación total de los vendedores",
              "Engulfing bajista, cambio de poder hacia los vendedores",
            ]}
            correctIndex={1}
            explanation="Cuerpo reducido + mecha inferior 3 veces más larga que el cuerpo + cierre en el tercio superior = firma exacta de una pin bar alcista. El mensaje del mercado: intento de extensión bajista rápidamente rechazado por los compradores, que retoman el control antes del cierre. Señal de rechazo a la baja particularmente operativa si aparece al contacto con un nivel estructural."
          />

          <LessonQuiz
            question="¿Cuál es la condición principal para validar una bullish engulfing como señal de reversión operativa?"
            options={[
              "El cuerpo de la 2ª vela envuelve por completo el cuerpo de la 1ª, en sentido opuesto, en un nivel estructural significativo",
              "La 2ª vela tiene un volumen superior en 200% al promedio",
              "La 2ª vela cierra exactamente en el máximo de la sesión",
              "La 2ª vela está precedida obligatoriamente de un doji",
            ]}
            correctIndex={0}
            explanation="Una bullish engulfing válida exige 3 condiciones: el cuerpo de la 2ª vela envuelve por completo el cuerpo de la 1ª (que es bajista), la dirección inversa a la 1ª, y la aparición en un nivel estructural significativo (support, resistance, zona OB). Sin contexto estructural, el engulfing pierde su potencia operativa."
          />

          <LessonQuiz
            question="En el procedimiento top-down multi-timeframe, ¿cuál es el rol exclusivo del M15?"
            options={[
              "Proporcionar el sesgo direccional global",
              "Identificar las zonas mayores de support y resistance",
              "Proporcionar el timing de entrada preciso vía una señal de price action",
              "Confirmar la tendencia Daily",
            ]}
            correctIndex={2}
            explanation="El M15 es exclusivamente una herramienta de timing fino. El sesgo direccional viene del Daily. Las zonas vienen del H4. La alineación estructural viene del H1. El M15 sólo proporciona la señal de price action (pin bar, engulfing, reacción neta) que confirma la entrada al contacto con la zona H4."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "price-action", "lecon4");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lección 4 del módulo Price Action completada.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/strategies/price-action/lecon3"
                className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="text-zinc-600">
                  <path d="M9.5 3.5l-4 4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lección 3. Engulfing: la reversión de fuerza
              </Link>
              <Link
                href="/strategies/price-action"
                className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Módulo terminado. Volver al módulo
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M5.5 10.5l4-4-4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
