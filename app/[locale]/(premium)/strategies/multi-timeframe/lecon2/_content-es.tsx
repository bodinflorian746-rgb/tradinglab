"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { ContreTendanceTrapDiagram } from "@/app/components/charts/ContreTendanceTrapDiagram";
import { DirectionDominanteDiagram } from "@/app/components/charts/DirectionDominanteDiagram";
import { HTFFilterDiagram } from "@/app/components/charts/HTFFilterDiagram";

const LESSONS = [
  { id: "lecon1", title: "Por qué analizar en multi-timeframe", disabled: false },
  { id: "lecon2", title: "El timeframe superior: el sesgo", disabled: false },
  { id: "lecon3", title: "El timeframe intermedio: la zona", disabled: false },
  { id: "lecon4", title: "El timeframe de ejecución: la entrada", disabled: false },
  { id: "lecon5", title: "El proceso completo", disabled: false },
];

export default function ContentEs() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "multi-timeframe", "lecon2"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Estrategias</Link>
          <span>/</span>
          <Link href="/strategies/multi-timeframe" className="hover:text-zinc-400 transition-colors">Multi-timeframe Process</Link>
          <span>/</span>
          <span className="text-zinc-500">Lección 2</span>
        </nav>

        {/* Header */}
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
            El timeframe superior: definir la dirección dominante
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              El timeframe superior construye el contexto antes de toda ejecución: identifica la dirección dominante, localiza las zonas importantes y muestra hacia dónde empuja realmente el mercado. No sirve para entrar en posición, sirve para evitar los trades tomados contra la tendencia de fondo.
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
            <span className="ml-auto text-xs text-zinc-600">2 / 5 lecciones</span>
          </div>
        </header>

        <div className="space-y-8">

          {/* Bloc 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-blue-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « El M5 muestra una vela. El HTF, en cambio, muestra la dirección real del mercado. »
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerrequisitos</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Lectura multi-timeframe → ver Lección 1</li>
              <li>- Estructura de mercado, HH/HL y LH/LL → ver módulo SMC</li>
              <li>- Soportes y resistencias HTF → ver módulo Soporte/Resistencia</li>
            </ul>
          </div>

          {/* Bloc 3 — LE PIÈGE DE LA CONTRE-TENDANCE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">La trampa de la contratendencia</h2>

            <div className="my-8">
              <ContreTendanceTrapDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Un setup limpio en M15 puede fracasar por una sola razón: va contra la dirección dominante del HTF. El timeframe pequeño muestra a menudo un simple retroceso local. El timeframe superior, en cambio, muestra si el mercado empuja realmente hacia arriba... o hacia abajo.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Ejemplo concreto</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD: el Daily es bajista, con una resistencia Daily/H4 en 1.1760 y un precio actual en 1.1715. En M15, un breakout alcista se forma en 1.1740. El precio sube hasta 1.1752... luego es rechazado violentamente hacia 1.1685. El breakout M15 existía; el problema venía de la tendencia de fondo, que seguía siendo vendedora.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Verifica la dirección HTF antes de toda entrada</li>
              <li>- Una impulsión local no es un giro global</li>
              <li>- Evita las compras contra una tendencia bajista clara</li>
              <li>- Observa qué dirección produce las impulsiones más fuertes</li>
            </ul>
          </section>

          {/* Bloc 4 — LIRE LA DIRECTION DOMINANTE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Leer la dirección dominante</h2>

            <div className="my-8">
              <DirectionDominanteDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              La dirección dominante se lee en la calidad de las impulsiones y de las correcciones. El objetivo no es contar las velas, es observar qué dirección controla realmente el mercado.
            </p>

            <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 mb-6">
              <p className="text-white font-semibold text-sm mb-2">Lo que hay que mirar</p>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>- Impulsiones alcistas vs bajistas</li>
                <li>- Fuerza de los rechazos</li>
                <li>- Velocidad de los desplazamientos</li>
                <li>- Tamaño de las correcciones</li>
              </ul>
            </div>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Ejemplo concreto</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                XAU/USD: las correcciones alcistas en M15 son lentas, pero las caídas en H4 son agresivas, del orden de 35 a 40 $, con rechazos sistemáticos por debajo de 4 680 $. El mercado sigue bajista a pesar de varios rebotes locales.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Compara impulsiones y correcciones</li>
              <li>- Observa qué dirección « aplasta » a la otra</li>
              <li>- Prioriza los setups en el sentido de la tendencia dominante</li>
              <li>- No confundas un rebote con un giro</li>
            </ul>
          </section>

          {/* Bloc 5 — LE HTF SERT À FILTRER */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">El HTF sirve para filtrar</h2>

            <div className="my-8">
              <HTFFilterDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              El HTF elimina los setups débiles antes incluso de buscar una entrada. El trader no busca « un trade », busca un trade alineado con la dirección dominante.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Ejemplo concreto</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD: el Daily es bajista, la resistencia Daily/H4 está en 1.1760, el precio actual en 1.1715. Lo que se busca: un regreso hacia 1.1760, un rechazo local, luego una continuación bajista. Lo que se evita: una compra impulsiva colocada directamente debajo de la resistencia HTF.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Empieza siempre por el HTF</li>
              <li>- Identifica la dirección dominante antes del setup</li>
              <li>- Anota las zonas HTF antes de bajar de timeframe</li>
              <li>- Filtra los trades tomados contra la tendencia</li>
            </ul>
          </section>

          {/* Bloc 6 — PLAN D'APPLICATION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan de aplicación: un caso EUR/USD</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              El HTF se lee del más grande al más pequeño. Aquí tienes la secuencia sobre un caso EUR/USD, sin buscar una entrada, el objetivo es solo establecer el contexto.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Paso 1. Daily</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observación: estructura en LH/LL, resistencia Daily en 1.1760, impulsiones bajistas más fuertes que los rebotes</li>
                <li>- Conclusión: dirección dominante bajista, prioridad a las ventas</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Paso 2. H4</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observación: zona de resistencia entre 1.1750 y 1.1760, rechazos repetidos debajo de la resistencia</li>
                <li>- Conclusión: zona ideal para esperar una reacción bajista</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Paso 3. Preparar el escenario</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Esperado: una subida hacia la resistencia, un rechazo local, luego una confirmación más tarde en el timeframe de ejecución</li>
                <li>- Evitado: una compra impulsiva contra la tendencia Daily</li>
              </ul>

              <div className="border-t border-zinc-800/60 pt-3 mt-3">
                <p className="text-sm text-zinc-300 italic text-center">
                  Daily = dirección dominante · H4 = zona de reacción · LTF = ejecución (Lección 4)
                </p>
              </div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "El HTF define la dirección dominante del mercado.",
              "Una impulsión local no cambia necesariamente la tendencia de fondo.",
              "Las impulsiones más fuertes muestran quién controla realmente el mercado.",
              "El HTF sirve para filtrar los malos trades antes de buscar una entrada.",
            ]}
          />

          <LessonExercice
            description="Abre EUR/USD en TradingView y aprende a reconocer la verdadera tendencia del mercado antes de toda ejecución."
            steps={[
              "En Daily: identifica la estructura dominante, compara la fuerza de las impulsiones y las correcciones, y determina la dirección principal del mercado.",
              "Pasa luego a H4: localiza una zona HTF importante y anota dónde el mercado podría reaccionar.",
              "Escribe finalmente la dirección dominante, los setups a privilegiar y los setups a evitar.",
            ]}
          />

          <LessonQuiz
            question="¿Qué elemento permite identificar mejor la dirección dominante del mercado?"
            options={[
              "El número total de velas verdes",
              "Las impulsiones más fuertes y los rechazos dominantes",
              "El timeframe M1 únicamente",
              "Una sola vela impulsiva aislada",
            ]}
            correctIndex={1}
            explanation="La dirección dominante se lee en la calidad de las impulsiones y las reacciones, no en el número de velas. Un mercado bajista produce en general caídas rápidas, correcciones débiles y rechazos vendedores agresivos. El M1 solo muestra ruido, y una vela aislada nunca basta para definir una tendencia duradera: es la fuerza comparada de los movimientos lo que revela qué dirección controla realmente el mercado."
          />

        </div>

        {/* Footer */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "multi-timeframe", "lecon2");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lección 2 del módulo Multi-timeframe Process completada.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between gap-4">
              <Link href="/strategies/multi-timeframe/lecon1" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lección anterior
              </Link>
              <Link href="/strategies/multi-timeframe/lecon3" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                Lección siguiente
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
