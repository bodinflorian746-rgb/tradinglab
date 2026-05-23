"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { SupportResistance } from "@/app/components/charts/SupportResistance";
import { ConfluenceDiagram } from "@/app/components/charts/ConfluenceDiagram";
import SRQualificationChecklistDiagram from "@/app/components/charts/SRQualificationChecklistDiagram";
import SRHierarchyDiagram from "@/app/components/charts/SRHierarchyDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Soporte y resistencia: las zonas donde el mercado reacciona", disabled: false },
  { id: "lecon2", title: "Identificar un nivel real (vs una línea trazada al azar)", disabled: false },
  { id: "lecon3", title: "Lección 3",          disabled: true },
  { id: "lecon4", title: "Lección 4",          disabled: true },
];

export default function ContentEs() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "support-resistance", "lecon2"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Estrategias</Link>
          <span>/</span>
          <Link href="/strategies/support-resistance" className="hover:text-zinc-400 transition-colors">Support / Resistance &amp; Range</Link>
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
            Identificar un nivel real (vs una línea trazada al azar)
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Esta lección enseña a distinguir un nivel real de una línea decorativa mediante 4 criterios de calificación, la jerarquía multi-timeframe y la búsqueda de confluencias.
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
                «No todas las zonas trazadas valen lo mismo. Calificar un nivel real es saber cuál merece un setup y cuál es solo decorativo.»
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerrequisitos</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Identificación de zonas S/R → ver Estrategia SR L1</li>
              <li>- Noción de confluencia → ver Formación Trading L3</li>
              <li>- Timeframes → ver Formación Trading L1</li>
            </ul>
          </div>

          {/* Bloc 3 — 4 CRITÈRES DE QUALIFICATION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">4 criterios de calificación</h2>

            <div className="my-8">
              <SRQualificationChecklistDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Una zona tradeable debe validar 4 criterios numéricos aplicados secuencialmente. Una zona que solo valida 2 o 3 queda en seguimiento sin constituir una prioridad operativa.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Toques múltiples: ≥ 2 toques confirmados, idealmente 3 para confianza elevada</li>
              <li>- Reacciones claras: rebote ≥ 1% en EUR/USD o 25-50$ en XAU/USD en cada toque</li>
              <li>- Frescura: zona tocada en los últimos 30 días = memoria colectiva fuerte</li>
              <li>- Confluencia con nivel redondo, Fibonacci, MM u Order Block = prioridad</li>
            </ul>
          </section>

          {/* Bloc 4 — LA CONFLUENCE RENFORCE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">La confluencia refuerza</h2>

            <div className="my-8">
              <ConfluenceDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              La fuerza de una zona aumenta cuando coincide con otros elementos estructurales. Una zona con 2 confluencias o más se vuelve prioritaria.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Confluencia Fibonacci 0.5 / 0.618 / 0.786 = zona respetada por los institucionales</li>
              <li>- Confluencia MM50 o MM200 (Daily o H4) = nivel dinámico defendido</li>
              <li>- Confluencia nivel redondo psicológico (1.1800, 4 500$) = memoria emocional</li>
              <li>- 3 confluencias o más = nivel mayor real, selección prioritaria</li>
            </ul>
          </section>

          {/* Bloc 5 — HIÉRARCHIE MULTI-TIMEFRAME */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Jerarquía multi-timeframe</h2>

            <div className="my-8">
              <SRHierarchyDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              La fuerza de un nivel también depende del timeframe en el que está trazado. Cuanto más elevado es el timeframe, más defendida está la zona institucionalmente.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Daily = nivel mayor, referencia prioritaria para la selección de setups</li>
              <li>- H4 = nivel secundario, zona de trade principal en alineación con Daily</li>
              <li>- H1 = nivel intermedio, sirve para la aproximación y la observación</li>
              <li>- M15/M30 = nivel marginal, utilizado únicamente para el timing al contacto con un nivel superior</li>
            </ul>
          </section>

          <LessonKeyPoints
            points={[
              "Una zona tradeable valida 4 criterios: 2 toques mínimo, reacciones claras, frescura reciente, confluencia con otros elementos estructurales.",
              "Jerarquía de fuerza por timeframe: Daily > H4 > H1 > M30/M15.",
              "Las confluencias (nivel redondo, Fibonacci, MM, Order Block) multiplican la fuerza. 2 confluencias o más = prioridad.",
              "Un nivel M15 aislado no aguanta solo. Sirve para el timing de entrada al contacto con un nivel superior.",
            ]}
          />

          <LessonExercice
            description="Una zona de resistencia EUR/USD entre 1.1880 y 1.1900 fue tocada 2 veces en las últimas 8 semanas con rechazos netos (mechas de 30 a 40 pips). El nivel psicológico 1.1900 está en el techo de la zona. La MM50 H4 pasa actualmente por 1.1875. ¿Cuál es el veredicto de calificación?"
            steps={[
              "Criterio 1 — Toques: 2 toques confirmados en las últimas 8 semanas = mínimo requerido validado",
              "Criterio 2 — Reacciones: rechazos netos con mechas de 30 a 40 pips = reacciones claras proporcionadas",
              "Criterio 3 — Frescura: zona tocada en las últimas 8 semanas = frescura aceptable",
              "Criterio 4 — Confluencias: nivel psicológico 1.1900 en el techo de la zona (confluencia 1) + MM50 H4 en 1.1875 dentro de la zona (confluencia 2) = 2 confluencias identificadas",
              "Veredicto: zona tradeable confirmada. 3 criterios validados claramente + 2 confluencias. Nota operativa elevada. La zona entra en la selección prioritaria para un setup short en retroceso con señal de rechazo confirmada",
            ]}
          />

          <LessonQuiz
            question="Una zona visible únicamente en M15, tocada 2 veces en el último día, sin alineación con H4 o Daily, ¿puede constituir una referencia principal para un setup?"
            options={[
              "Sí, 2 toques bastan sin importar el timeframe",
              "No, los niveles M15 aislados sirven únicamente para el timing de entrada al contacto con un nivel superior",
              "Sí, siempre que haya una confluencia Fibonacci",
              "No, hace falta mínimo 5 toques en M15",
            ]}
            correctIndex={1}
            explanation="Los niveles M15 aislados tienen una vida útil reducida y pueden ser ignorados o rotos por el mercado sin verdadera contestación. La jerarquía por timeframe coloca Daily > H4 > H1 > M30/M15. Un nivel M15 sirve únicamente como punto de timing de entrada al contacto con una zona superior, nunca como referencia principal, incluso con 2 toques recientes."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "support-resistance", "lecon2");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lección 2 del módulo Support / Resistance &amp; Range completada.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <Link href="/strategies/support-resistance/lecon1" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
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
