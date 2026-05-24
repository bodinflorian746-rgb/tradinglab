"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import FlipDiagram from "@/app/components/charts/FlipDiagram";
import FlipRetestValidationDiagram from "@/app/components/charts/FlipRetestValidationDiagram";
import FlipFailureDiagram from "@/app/components/charts/FlipFailureDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Soporte y resistencia: las zonas donde el mercado reacciona", disabled: false },
  { id: "lecon2", title: "Identificar un nivel real (vs una línea trazada al azar)", disabled: false },
  { id: "lecon3", title: "Flip support↔resistance y tradear un rebote", disabled: false },
  { id: "lecon4", title: "Lección 4",          disabled: true },
];

export default function ContentEs() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "support-resistance", "lecon3"));
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
          <span className="text-zinc-500">Lección 3</span>
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
            Flip support↔resistance y tradear un rebote
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Esta lección enseña a tradear el flip de polaridad: una resistencia rota se convierte en soporte (y al revés), con plan de ejecución numérico sobre el retest.
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

        <div className="space-y-8">

          {/* Bloc 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                «Un soporte roto se convierte en resistencia. Una resistencia rota se convierte en soporte. El mercado tiene memoria de los precios.»
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerrequisitos</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Identificación S/R → ver Estrategia SR L1</li>
              <li>- Calificación de un nivel → ver Estrategia SR L2</li>
              <li>- Concepto de ruptura (cierre claro) → ver Formación Trading L3</li>
            </ul>
          </div>

          {/* Bloc 3 — LE FLIP DE POLARITÉ */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">El flip de polaridad</h2>

            <div className="my-8">
              <FlipDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Una zona rota no es una zona muerta. Invierte su rol. La secuencia ruptura + retest + rebote constituye el setup flip.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Ruptura clara: cierre neto + distancia ≥ 15-20 pips/$ más allá del nivel</li>
              <li>- Sin reintegración en las 3-5 velas siguientes (si no, flip invalidado)</li>
              <li>- Retest: vuelta del precio hacia el nivel roto por el lado opuesto</li>
              <li>- Rebote confirmado por una señal de rechazo (pin bar, engulfing, reacción neta)</li>
            </ul>
          </section>

          {/* Bloc 4 — VALIDER LE RETEST */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Validar el retest</h2>

            <div className="my-8">
              <FlipRetestValidationDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Sin señal de rechazo al contacto con la zona invertida, el flip no se valida. 3 señales son operativamente aceptables.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Pin bar de rechazo (mecha larga del lado de la zona, cuerpo reducido del lado opuesto)</li>
              <li>- Engulfing en el sentido del flip (engloba la vela anterior)</li>
              <li>- Reacción inmediata (rebote neto en 1-2 velas sin penetración profunda)</li>
              <li>- Señal ausente = zona no confirmada, esperar otra oportunidad</li>
            </ul>
          </section>

          {/* Bloc 5 — PLAN DE TRADE CHIFFRÉ */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan de trade: flip EUR/USD H4</h2>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              EUR/USD en tendencia alcista desde hace 2 semanas. Resistencia mayor 1.1850 tocada 3 veces en 3 semanas antes de ser rota. 4 velas confirman la ruptura sin reintegración. Pin bar de rechazo en el retest.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Setup (trade long sobre flip confirmado)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Ruptura: cierre en 1.1878 (28 pips por encima de la zona)</li>
                <li>- Validación: 4 velas sin reintegración bajo 1.1850</li>
                <li>- Retest: pin bar con mecha baja en 1.1842 y cierre en 1.1858</li>
                <li>- Entrada long: 1.1858 (cierre de la pin bar)</li>
                <li>- Stop loss: 1.1830 (28 pips bajo el wick, margen 12 pips)</li>
                <li>- Take profit: 1.1950 (próxima resistencia H4)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Cálculo del R/R</p>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>- Riesgo: 1.1858 - 1.1830 = 28 pips</li>
                <li>- Ganancia potencial: 1.1950 - 1.1858 = 92 pips</li>
                <li>- R/R: 92 / 28 = 3,28</li>
              </ul>
            </div>

            <p className="text-white font-semibold text-sm mb-2">Cálculo retail</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-3">
              <li>- Cuenta 300€ → 5% = riesgo 15€, ganancia potencial 49€</li>
              <li>- Cuenta 500€ → 3% = riesgo 15€, ganancia potencial 49€</li>
              <li>- Cuenta 1 000€ → 2% = riesgo 20€, ganancia potencial 66€</li>
              <li>- Cuenta 2 500€ → 2% = riesgo 50€, ganancia potencial 164€</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">
              El R/R se mantiene en 3,28:1 sin importar el tamaño de la cuenta.
            </p>
          </section>

          {/* Bloc 6 — QUAND LE FLIP ÉCHOUE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Cuando el flip falla</h2>

            <div className="my-8">
              <FlipFailureDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Un flip puede fallar tras una ruptura aparentemente clara. El retorno rápido del precio bajo el nivel invalida el flip.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Retorno rápido bajo el nivel roto en las 3-5 velas = flip invalidado</li>
              <li>- El SL colocado al otro lado de la zona (con margen 5-10 pips) acota la pérdida</li>
              <li>- Ningún desplazamiento del SL en contra durante el trade</li>
            </ul>
          </section>

          <LessonKeyPoints
            points={[
              "Un flip exige una ruptura calificada: cierre claro, distancia suficiente, sin retorno inmediato.",
              "La zona rota invierte su rol en el retest: soporte roto → resistencia, resistencia rota → soporte.",
              "El retest se valida únicamente por una señal de rechazo al contacto (pin bar, engulfing, reacción neta).",
              "El stop loss se coloca al otro lado de la zona con margen 5-10 pips. Sin señal de rechazo, no hay entrada.",
            ]}
          />

          <LessonExercice
            description="En EUR/USD H4, una resistencia en 1.1850 es rota por una vela que cierra en 1.1875 con un cuerpo significativo. 4 velas después, el precio retrocede hacia 1.1850 e imprime una pin bar con mecha larga que rechaza. ¿Cómo se construye el plan de trade flip?"
            steps={[
              "Calificar la ruptura: cierre en 1.1875, distancia 25 pips por encima de la zona, cuerpo significativo, sin retorno inmediato en 4 velas, ruptura validada",
              "Constatar la inversión del rol: la resistencia 1.1850 se convierte en soporte",
              "Identificar la señal de rechazo: la pin bar al contacto con la zona valida el flip",
              "Colocar la entrada long en el cierre de la pin bar, stop loss en 1.1830 (20 pips bajo la zona para absorber las mechas)",
              "Definir el take profit en la próxima resistencia mayor identificada en el chart H4 (ratio mínimo 1:2), tamaño de posición según el risk management adaptado al capital",
            ]}
          />

          <LessonQuiz
            question="Una resistencia acaba de romperse al alza con un cierre claro. El precio retrocede luego hacia la zona. ¿Qué señal valida el flip y autoriza una entrada long?"
            options={[
              "El simple retorno del precio a la zona basta",
              "Una señal de rechazo (pin bar, engulfing, reacción neta) al contacto con la zona",
              "Una ruptura de la siguiente zona",
              "Ninguna señal necesaria, la entrada es mecánica",
            ]}
            correctIndex={1}
            explanation="Sin señal de rechazo, el flip no se valida. Una pin bar, un engulfing o una reacción neta al contacto con la zona confirman que la zona invertida cumple su nuevo rol. Sin esa señal, el precio puede atravesar la zona e invalidar el flip."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "support-resistance", "lecon3");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lección 3 del módulo Support / Resistance &amp; Range completada.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <Link href="/strategies/support-resistance/lecon2" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lección 2
              </Link>
              <span className="inline-flex items-center gap-2 text-sm text-zinc-700 cursor-not-allowed">
                Lección 4. Próximamente
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
