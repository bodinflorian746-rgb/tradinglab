"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { TrendDiagram } from "@/app/components/charts/TrendDiagram";
import TrendIdentificationStepsDiagram from "@/app/components/charts/TrendIdentificationStepsDiagram";
import TrendStrengthGradationDiagram from "@/app/components/charts/TrendStrengthGradationDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Reconocer una tendencia (HH/HL vs LH/LL)", disabled: false },
  { id: "lecon2", title: "Lección 2",          disabled: true },
  { id: "lecon3", title: "Lección 3",          disabled: true },
  { id: "lecon4", title: "Lección 4",          disabled: true },
];

export default function ContentEs() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "trend-following", "lecon1"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Estrategias</Link>
          <span>/</span>
          <Link href="/strategies/trend-following" className="hover:text-zinc-400 transition-colors">Trend Following</Link>
          <span>/</span>
          <span className="text-zinc-500">Lección 1</span>
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
            Reconocer una tendencia (HH/HL vs LH/LL)
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Esta lección enseña a identificar una tendencia explotable y a tradear el pullback en el sentido de esa tendencia.
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
            <span className="ml-auto text-xs text-zinc-600">1 / 4 lecciones</span>
          </div>
        </header>

        <div className="space-y-8">

          {/* Bloc 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                &quot;Una tendencia sana se reconoce por su regularidad. Una entrada limpia se toma en el retroceso, no en la extensión.&quot;
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerrequisitos</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- HH/HL/LL/LH → ver Curso de Trading L3</li>
              <li>- Noción de pullback → ver Curso de Trading L3</li>
              <li>- Niveles de support/resistance para objetivos → ver Estrategia SR L1</li>
            </ul>
          </div>

          {/* Bloc 3 — RECONNAÎTRE LA TENDANCE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Reconocer la tendencia (3 estados)</h2>

            <div className="my-8">
              <TrendDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              El mercado alterna 3 estados reconocibles. Identificar el estado actual determina el tipo de setup a privilegiar.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Tendencia alcista: sucesión HH/HL ascendente → trade long en pullback</li>
              <li>- Range lateral: oscilación entre 2 niveles → trade en range o esperar el breakout</li>
              <li>- Tendencia bajista: sucesión LL/LH descendente → trade short en pullback</li>
              <li>- Timeframe principal de identificación: H4. La confirmación en Daily refuerza el sesgo</li>
            </ul>
          </section>

          {/* Bloc 4 — IDENTIFIER EN 3 ÉTAPES */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Identificar en 3 pasos</h2>

            <div className="my-8">
              <TrendIdentificationStepsDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              La calificación de una tendencia sigue un procedimiento metódico en 3 pasos sucesivos.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Paso 1: ubicar los pivots (mínimos y máximos) en las últimas 30-50 velas</li>
              <li>- Paso 2: confirmar la sucesión (2 HL + 2 HH mínimo, o 2 LH + 2 LL mínimo)</li>
              <li>- Paso 3: validar la amplitud (≥ 30-50 pips en EUR/USD H4, 50-100$ en XAU/USD H4)</li>
            </ul>
          </section>

          {/* Bloc 5 — QUALIFIER LA FORCE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Calificar la fuerza</h2>

            <div className="my-8">
              <TrendStrengthGradationDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              No todas las tendencias tienen la misma fuerza. La amplitud de los swings y la pendiente condicionan el RR estructural.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Tendencia débil (pendiente &lt; 20°, amplitud ~50 pips): poco explotable</li>
              <li>- Tendencia moderada (pendiente ~35°, amplitud ~100 pips): explotable con disciplina</li>
              <li>- Tendencia fuerte (pendiente &gt; 55°, amplitud ~200 pips): setup a privilegiar</li>
              <li>- Pullback explotable: entre 30% y 60% del impulso anterior</li>
            </ul>
          </section>

          {/* Bloc 6 — PLAN DE TRADE CHIFFRÉ */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan de trade: pullback EUR/USD H4</h2>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              EUR/USD en tendencia alcista confirmada (2 HL en 1.1700 y 1.1730, 2 HH en 1.1780 y 1.1810). El precio retrocede hacia 1.1760 (62% del impulso de 80 pips) e imprime una pin bar alcista.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Setup (trade long en pullback)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Entrada long: 1.1765 (cierre de la pin bar)</li>
                <li>- Stop loss: 1.1720 (10 pips por debajo del último HL en 1.1730)</li>
                <li>- Take profit nivel 1: 1.1810 (HH anterior) — nivel 2: 1.1890 (proyección 80 pips)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Cálculo del R/R</p>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>- Riesgo: 1.1765 - 1.1720 = 45 pips</li>
                <li>- Ganancia nivel 1: 45 pips → RR 1:1 (salida parcial posible)</li>
                <li>- Ganancia nivel 2: 125 pips → RR 125/45 = 2,78</li>
                <li>- El setup apunta prioritariamente al TP nivel 2</li>
              </ul>
            </div>

            <p className="text-white font-semibold text-sm mb-2">Cálculo retail</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-3">
              <li>- Cuenta 300€ → 5% = riesgo 15€, ganancia potencial 42€</li>
              <li>- Cuenta 500€ → 3% = riesgo 15€, ganancia potencial 42€</li>
              <li>- Cuenta 1 000€ → 2% = riesgo 20€, ganancia potencial 56€</li>
              <li>- Cuenta 2 500€ → 2% = riesgo 50€, ganancia potencial 139€</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">
              El RR se mantiene en 2,78:1 sin importar el tamaño de la cuenta.
            </p>
          </section>

          <LessonKeyPoints
            points={[
              "Una tendencia explotable exige 2 HL + 2 HH (alcista) o 2 LH + 2 LL (bajista) mínimo en H4.",
              "La alineación Daily + H4 en el mismo sentido maximiza la fiabilidad del setup.",
              "El pullback explotable se ubica entre 30% y 60% del impulso anterior.",
              "Stop loss más allá del último mínimo/máximo estructural con margen de 5-10 pips. La entrada exige una señal de rechazo.",
            ]}
          />

          <LessonExercice
            description="En EUR/USD H4, el precio formó 2 mínimos sucesivos en 1.1700 y 1.1730, luego 2 máximos sucesivos en 1.1780 y 1.1810. Después el precio retrocede hacia 1.1760 e imprime una pin bar de rechazo. ¿Cómo se construye el plan de trade de pullback?"
            steps={[
              "Confirmar la tendencia alcista: 2 HL en 1.1700 y 1.1730 + 2 HH en 1.1780 y 1.1810",
              "Medir el impulso: del último HL (1.1730) al último HH (1.1810) = 80 pips",
              "Calcular el retroceso: regreso a 1.1760 = 62% del impulso (50/80), en el límite alto del retroceso explotable",
              "Validar la señal: la pin bar al contacto del nivel confirma el rechazo",
              "Armar el plan: entrada long en el cierre (1.1762), stop loss en 1.1720 (10 pips bajo el último HL), take profit en 1.1810 (HH anterior) o 1.1890 (proyección sobre 80 pips, ratio 1:3)",
            ]}
          />

          <LessonQuiz
            question="En un chart H4 en tendencia alcista confirmada, el precio retrocede 45% del impulso anterior e imprime una señal de rechazo al contacto del último mínimo estructural (HL). ¿Cuál es la ubicación correcta del stop loss?"
            options={[
              "A mitad de camino entre el nivel de entrada y el último HL",
              "Más allá del último HL con un margen de 5-10 pips",
              "En el último HH",
              "Ningún stop loss, manejo manual",
            ]}
            correctIndex={1}
            explanation="El stop loss se coloca más allá del último mínimo estructural (HL en tendencia alcista) con un margen de 5-10 pips para absorber las mechas. Esta posición invalida estructuralmente la tendencia: si el precio rompe el último HL, la estructura HL/HH queda rota. Un stop colocado a mitad de camino se activa con el pullback normal."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "trend-following", "lecon1");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lección 1 del módulo Trend Following completada.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-sm text-zinc-700 cursor-not-allowed">
                Lección anterior
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-600 border border-zinc-700">
                  Inicio del módulo
                </span>
              </span>
              <span className="inline-flex items-center gap-2 text-sm text-zinc-700 cursor-not-allowed">
                Lección 2 — Próximamente
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
