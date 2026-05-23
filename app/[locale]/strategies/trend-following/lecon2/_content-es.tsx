"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import TrendlineMADiagram from "@/app/components/charts/TrendlineMADiagram";
import MMHierarchyStackDiagram from "@/app/components/charts/MMHierarchyStackDiagram";
import TrendlineWrongDrawingDiagram from "@/app/components/charts/TrendlineWrongDrawingDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Reconocer una tendencia (HH/HL vs LH/LL)", disabled: false },
  { id: "lecon2", title: "Trendline y medias móviles: trazar la tendencia", disabled: false },
  { id: "lecon3", title: "Lección 3",          disabled: true },
  { id: "lecon4", title: "Lección 4",          disabled: true },
];

export default function ContentEs() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "trend-following", "lecon2"));
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
          <span className="text-zinc-500">Lección 2</span>
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
            Trendline y medias móviles: trazar la tendencia
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Esta lección enseña a trazar una trendline tradeable, a leer las MM20/MM50/MM200 en combinación, y a explotar la confluencia trendline + MM.
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

          {/* Bloc 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                &quot;La tendencia se lee en la estructura. Trendlines y medias móviles la hacen visible al pixel.&quot;
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerrequisitos</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Reconocer una tendencia → ver Estrategia TF L1</li>
              <li>- Noción de trendline → ver Curso de Trading L3</li>
              <li>- MM20 / MM50 / MM200 → ver Curso de Trading L4</li>
            </ul>
          </div>

          {/* Bloc 3 — TRACER UNE TRENDLINE + MM */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Trazar una trendline + MM</h2>

            <div className="my-8">
              <TrendlineMADiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              La trendline y la MM50 forman una zona defendida dinámica. La confluencia de ambas multiplica la fiabilidad de la señal de entrada en rebote.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Trendline alcista: conectada a los HL sucesivos (3 puntos mínimo)</li>
              <li>- Trendline bajista: conectada a los LH sucesivos (3 puntos mínimo)</li>
              <li>- Pendiente explotable: entre 20° y 60° (bajo 20° = débil, sobre 60° = irreal)</li>
              <li>- MM20 = dinámica corta, MM50 = referencia intermedia, MM200 = sesgo de largo plazo</li>
            </ul>
          </section>

          {/* Bloc 4 — LIRE LES 3 MM EN COMBINAISON */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Leer las 3 MM en combinación</h2>

            <div className="my-8">
              <MMHierarchyStackDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              El orden relativo de las 3 MM (MM20, MM50, MM200) señala el sesgo direccional global. La jerarquía determina el sentido de los setups autorizados.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Golden cross: MM20 &gt; MM50 &gt; MM200, ascendentes → sesgo long, setups long únicamente</li>
              <li>- Death cross: MM20 &lt; MM50 &lt; MM200, descendentes → sesgo short, setups short únicamente</li>
              <li>- Range: 3 MM entrelazadas, pendiente nula → sin sesgo, esperar clarificación</li>
              <li>- Setup contrario al sesgo MM200 = tasa de éxito reducida, evitar sin confluencia excepcional</li>
            </ul>
          </section>

          {/* Bloc 5 — ERREURS DE TRACÉ FRÉQUENTES */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Errores de trazado frecuentes</h2>

            <div className="my-8">
              <TrendlineWrongDrawingDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Una trendline forzada pierde todo valor operativo. 3 errores de trazado degradan sistemáticamente la fiabilidad de la señal.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- 2 puntos aislados que ignoran otros pivots = trendline arbitraria</li>
              <li>- Pendiente irreal (&gt; 60°) = impulso no sostenible, retorno rápido esperado</li>
              <li>- Ruptura ignorada = trendline prolongada cuando ya perdió su validez</li>
            </ul>
          </section>

          {/* Bloc 6 — PLAN DE TRADE CHIFFRÉ */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan de trade: confluencia EUR/USD H4</h2>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              EUR/USD en tendencia alcista confirmada en H4 y Daily (precio por encima de la MM200 H4 desde hace 6 semanas). Trendline alcista sobre 3 HL (1.1680, 1.1720, 1.1755), pendiente moderada 35°. MM50 H4 en 1.1770. Confluencia trendline + MM50 en la zona 1.1768-1.1775. Pin bar alcista al contacto.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Setup (trade long en rebote de confluencia)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Entrada long: 1.1778 (cierre de la pin bar)</li>
                <li>- Stop loss: 1.1750 (10 pips bajo la mecha inferior en 1.1762)</li>
                <li>- Take profit nivel 1: 1.1820 (HH anterior) — nivel 2: 1.1860 (extensión)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Cálculo del R/R</p>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>- Riesgo: 1.1778 - 1.1750 = 28 pips</li>
                <li>- Ganancia nivel 1: 42 pips → RR 1,50</li>
                <li>- Ganancia nivel 2: 82 pips → RR 82/28 = 2,93</li>
                <li>- El setup apunta prioritariamente al TP nivel 2</li>
              </ul>
            </div>

            <p className="text-white font-semibold text-sm mb-2">Cálculo retail</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-3">
              <li>- Cuenta 300€ → 5% = riesgo 15€, ganancia potencial 44€</li>
              <li>- Cuenta 500€ → 3% = riesgo 15€, ganancia potencial 44€</li>
              <li>- Cuenta 1 000€ → 2% = riesgo 20€, ganancia potencial 59€</li>
              <li>- Cuenta 2 500€ → 2% = riesgo 50€, ganancia potencial 147€</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">
              El RR se mantiene en 2,93:1 sin importar el tamaño de la cuenta.
            </p>
          </section>

          <LessonKeyPoints
            points={[
              "Una trendline tradeable se apoya en 2 puntos mínimo (3 idealmente), con una pendiente entre 20° y 60°.",
              "MM20 = dinámica corta. MM50 = referencia intermedia. MM200 = sesgo estructural de largo plazo.",
              "La confluencia trendline + MM50 crea una zona defendida por 2 referencias dinámicas distintas.",
              "Respetar el sesgo de la MM200: trade long por encima, trade short por debajo. Ninguna entrada sin señal de rechazo.",
            ]}
          />

          <LessonExercice
            description="En XAU/USD H4 en tendencia bajista confirmada, el precio evoluciona bajo la MM200 H4 en 4 720$. Se trazó una trendline bajista sobre 3 LH sucesivos en 4 680$, 4 650$ y 4 620$. La MM50 H4 está actualmente en 4 605$. El precio sube hacia 4 600$. ¿Cuál es el estatus del setup y qué plan teórico aplica?"
            steps={[
              "Validar la trendline bajista: 3 LH confirmados en 4 680$, 4 650$, 4 620$ — trendline tradeable",
              "Identificar la confluencia: MM50 H4 en 4 605$ + trendline que pasa por 4 600$ = zona de confluencia 4 600$-4 605$",
              "Verificar el sesgo MM200 H4: precio bajo 4 720$ = sesgo short alineado, setup conforme",
              "Esperar la señal de rechazo bajista (pin bar alta, engulfing bajista) al contacto de la zona 4 600$-4 605$ para validar la entrada",
              "Armar el plan: entrada short al cierre de la señal, stop loss en 4 615$ (10$ por encima de la MM50), take profit en 4 555$ (LL anterior, nivel 1) o 4 510$ (extensión bajista, nivel 2). Tamaño de posición según el riesgo por trade adaptado al capital",
            ]}
          />

          <LessonQuiz
            question="El precio toca la MM50 H4 en EUR/USD sin señal de rechazo explícita (sin pin bar, sin engulfing), en una tendencia alcista confirmada. ¿Cuál es el veredicto operativo?"
            options={[
              "Setup explotable, el simple contacto con la MM50 basta",
              "Setup inválido, la ausencia de señal de rechazo descalifica la entrada",
              "Setup explotable a condición de un volumen elevado",
              "Indeterminado sin confirmación Fibonacci",
            ]}
            correctIndex={1}
            explanation="El contacto con una MM no dispara automáticamente una entrada. Una señal de price action explícita (pin bar de rechazo, engulfing en el sentido de la tendencia, o reacción inmediata sin penetración significativa) debe confirmar el rebote. Sin señal, la MM puede atravesarse sin rebote significativo, sobre todo en tendencia moderada. El trade tomado por simple contacto termina frecuentemente en pérdida."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "trend-following", "lecon2");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lección 2 del módulo Trend Following completada.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <Link href="/strategies/trend-following/lecon1" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
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
