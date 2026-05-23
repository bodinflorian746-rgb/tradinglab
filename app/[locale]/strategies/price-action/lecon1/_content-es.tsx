"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { CandleAnatomyDiagram } from "@/app/components/charts/CandleAnatomyDiagram";
import CandleStrengthComparisonDiagram from "@/app/components/charts/CandleStrengthComparisonDiagram";
import CandleContextReadingDiagram from "@/app/components/charts/CandleContextReadingDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Leer una vela",   disabled: false },
  { id: "lecon2", title: "Pin bar",          disabled: true },
  { id: "lecon3", title: "Lección 3",        disabled: true },
  { id: "lecon4", title: "Lección 4",        disabled: true },
];

export default function ContentEs() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "price-action", "lecon1"));
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
          <span className="text-zinc-500">Lección 1</span>
        </nav>

        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Principiante
            </span>
            <span className="text-zinc-700 text-xs">·</span>
            <span className="text-xs text-zinc-600">12 min</span>
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
            Leer una vela: cuerpo, mecha, señal
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Esta lección te enseña a leer rápidamente el balance de fuerzas de una vela y a reconocer los 4 patrones clave (Marubozu, pin bar, doji, engulfing) que estructuran toda la price action.
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

          {/* Bloque 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « Una vela no es un dibujo. Es el resumen numérico de una batalla entre compradores y vendedores en un período determinado. »
              </p>
            </div>
          </section>

          {/* Bloque 2 — PRERREQUISITOS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerrequisitos</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Nociones de OHLC (open/high/low/close) → cf. Formación Trading L1</li>
              <li>- Velas japonesas → cf. Formación Trading L1</li>
              <li>- Concepto de swing high/low → cf. Formación Trading L2</li>
            </ul>
          </div>

          {/* Bloque 3 — ANATOMÍA DE UNA VELA */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Anatomía de una vela</h2>

            <div className="my-8">
              <CandleAnatomyDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Una vela resume 4 valores (OHLC) en un período determinado. La forma visible (cuerpo + mechas) cuenta el balance de fuerzas final.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Cuerpo significativo (&gt; 50% del promedio de las últimas 20 velas) = dirección clara</li>
              <li>- Mecha larga de un lado (≥ cuerpo) = rechazo neto en esa dirección</li>
              <li>- Cierre en el tercio superior o inferior = dominación sostenida hasta el cierre</li>
              <li>- Vela en formación = lectura provisional, esperar el cierre</li>
            </ul>
          </section>

          {/* Bloque 4 — RECONOCER LOS 4 TIPOS CLAVE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Reconocer los 4 tipos clave</h2>

            <div className="my-8">
              <CandleStrengthComparisonDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              4 patrones aparecen constantemente en los charts. Su identificación rápida orienta toda la lectura general.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- <span className="font-semibold text-zinc-100">Marubozu</span>: cuerpo grande, sin mecha = convicción máxima, señal de continuación</li>
              <li>- <span className="font-semibold text-zinc-100">Pin bar</span>: cuerpo reducido + mecha larga de un lado = rechazo de nivel, señal de reversión local</li>
              <li>- <span className="font-semibold text-zinc-100">Doji</span>: cuerpo casi inexistente = indecisión, señal de espera o reversión potencial en zona extrema</li>
              <li>- <span className="font-semibold text-zinc-100">Engulfing</span>: cuerpo que envuelve a la vela anterior en sentido opuesto = cambio claro de poder</li>
            </ul>
          </section>

          {/* Bloque 5 — EL CONTEXTO CAMBIA LA LECTURA */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">El contexto cambia la lectura</h2>

            <div className="my-8">
              <CandleContextReadingDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Una misma vela no tiene el mismo valor según las velas adyacentes y la posición estructural. La lectura aislada sobreestima sistemáticamente la señal.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Vela verde en la cima de un impulso = agotamiento, reversión potencial</li>
              <li>- Vela verde aislada en medio de una caída = ruido, continuación bajista probable</li>
              <li>- Vela verde en un range lateral = sin señal, oscilación normal</li>
              <li>- La vela analizada debe estar conectada con un nivel estructural para volverse una señal operativa</li>
            </ul>
          </section>

          <LessonKeyPoints
            points={[
              "Una vela se lee con 4 elementos: tamaño del cuerpo, mechas, posición del cierre, contexto adyacente.",
              "4 patrones clave: Marubozu (convicción), pin bar (rechazo), doji (indecisión), engulfing (cambio de poder).",
              "Lectura únicamente sobre velas completamente cerradas. La vela en curso queda provisional.",
              "El contexto estructural determina el valor de una señal: mismo patrón, valor distinto según su posición.",
            ]}
          />

          <LessonExercice
            description="En XAU/USD H4, una vela cierra con estas características: apertura 4 580$, máximo 4 595$, mínimo 4 530$, cierre 4 588$. ¿Cómo se lee esta vela según los 4 criterios del balance de fuerzas?"
            steps={[
              "Criterio 1 — Tamaño del cuerpo: apertura 4 580$ a cierre 4 588$ = cuerpo alcista de 8$ (a comparar con el promedio de las 20 velas recientes)",
              "Criterio 2 — Mechas: mecha inferior de 50$ (4 580$ - 4 530$), mecha superior de 7$ (4 595$ - 4 588$) — mecha inferior 6 veces más larga que el cuerpo, señal de rechazo alcista potente abajo",
              "Criterio 3 — Posición del cierre: 4 588$ dentro del rango 4 530$-4 595$ = 89% del rango, en el tercio superior, dominación de los compradores al final del período",
              "Criterio 4 — Contexto adyacente: a relacionar con las velas anteriores y un nivel estructural cercano",
              "Síntesis: la vela corresponde al patrón pin bar alcista (cuerpo reducido + mecha inferior larga + cierre arriba), señal de rechazo a la baja particularmente operativa si aparece al contacto con un support o una zona Order Block",
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

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "price-action", "lecon1");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lección 1 del módulo Price Action completada.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <span />
              <span className="inline-flex items-center gap-2 text-sm text-zinc-700 cursor-not-allowed">
                Lección 2 — Pin bar — el rechazo de nivel
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
