"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { BOSDiagram } from "@/app/components/charts/BOSDiagram";
import { CHoCHDiagram } from "@/app/components/charts/CHoCHDiagram";
import BOSvsCHoCHComparisonDiagram from "@/app/components/charts/BOSvsCHoCHComparisonDiagram";
import BOSCHoCHSequenceDiagram from "@/app/components/charts/BOSCHoCHSequenceDiagram";
import BOSFakeoutDiagram from "@/app/components/charts/BOSFakeoutDiagram";

const LESSONS = [
  { id: "lecon1", title: "Lección 1", disabled: false },
  { id: "lecon2", title: "BOS y CHoCH: leer las señales estructurales institucionales", disabled: false },
  { id: "lecon3", title: "Lección 3", disabled: true },
  { id: "lecon4", title: "Lección 4", disabled: true },
  { id: "lecon5", title: "Lección 5", disabled: true },
];

export default function ContentEs() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "smc", "lecon2"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Estrategias</Link>
          <span>/</span>
          <Link href="/strategies/smc" className="hover:text-zinc-400 transition-colors">SMC: Pensar institucional</Link>
          <span>/</span>
          <span className="text-zinc-500">Lección 2</span>
        </nav>

        {/* ── Header ── */}
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
            BOS y CHoCH: leer las señales estructurales institucionales
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              BOS y CHoCH son las dos señales estructurales fundamentales de la lectura SMC. Esta lección enseña a calificarlas operativamente, a comprender la secuencia de retroceso en 3 etapas, y a evitar las trampas clásicas.
            </p>
          </div>

          {/* Indicador de estructura */}
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

          {/* Pills de lecciones */}
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

        {/* ── Contenido ── */}
        <div className="space-y-8">

          {/* Bloque 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-blue-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « Un BOS confirma la tendencia. Un CHoCH la pone en duda. Leer la diferencia en pocos segundos cambia la lectura del mercado. »
              </p>
            </div>
          </section>

          {/* Bloque 2 — PRERREQUISITOS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerrequisitos</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Market Structure SMC, HH/HL/LL/LH → ver Estrategia SMC L1</li>
              <li>- Vela de ruptura, displacement → ver Formación Trading L2</li>
              <li>- Tendencia direccional multi-timeframe → ver Formación Trading L3</li>
            </ul>
          </div>

          {/* Bloque 3 — DISTINCIÓN BOS vs CHoCH */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Distinción BOS vs CHoCH</h2>

            <div className="my-8">
              <BOSvsCHoCHComparisonDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              BOS y CHoCH designan dos tipos distintos de ruptura estructural, con consecuencias operativas opuestas. La distinción se basa en la naturaleza del nivel roto: extremo en el sentido de la tendencia o mínimo/máximo de estructura inversa.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-emerald-400 font-semibold text-sm mb-2">BOS. Break of Structure</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Ruptura en el sentido de la tendencia (HH en alcista, LL en bajista)</li>
                  <li>- Valida la continuación, estructura HH/HL o LH/LL intacta</li>
                  <li>- Autoriza nuevas posiciones en el sentido de la tendencia</li>
                </ul>
              </div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-amber-400 font-semibold text-sm mb-2">CHoCH. Change of Character</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Ruptura en el sentido opuesto a la tendencia (HL en alcista, LH en bajista)</li>
                  <li>- Señala un retroceso potencial, ruptura de la estructura</li>
                  <li>- Dispara la salida de posiciones, prepara la inversión tras confirmación</li>
                </ul>
              </div>
            </div>

            <BOSDiagram locale="es" />
            <CHoCHDiagram locale="es" />
          </section>

          {/* Bloque 4 — CRITERIOS DE CALIFICACIÓN DE UN BOS VÁLIDO */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Criterios de calificación de un BOS válido</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">4 criterios califican un BOS como explotable institucionalmente. Una ruptura que no valide los 4 criterios queda hipotética y expone al fake breakout.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-white font-semibold text-sm mb-2">1. Cierre nítido más allá del nivel</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- La vela cierra completamente más allá del HH/LL, mecha sola = test</li>
                  <li>- Validación en el cierre del timeframe de análisis (H4 o Daily)</li>
                </ul>
              </div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-white font-semibold text-sm mb-2">2. Displacement direccional marcado</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Amplitud claramente superior al promedio reciente</li>
                  <li>- Umbral operativo: cuerpo ≥ 1,5× promedio de las 20 velas</li>
                </ul>
              </div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-white font-semibold text-sm mb-2">3. Ausencia de reintegración</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Precio mantenido más allá del nivel roto en 3-5 velas</li>
                  <li>- Reintegración inmediata invalida retroactivamente el BOS</li>
                </ul>
              </div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-white font-semibold text-sm mb-2">4. Alineación multi-timeframe</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- BOS H4 coherente con sesgo Daily (HTF)</li>
                  <li>- BOS alcista por encima MM200, bajista por debajo</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Bloque 5 — SECUENCIA BOS → CHoCH → MITIGATION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Secuencia operativa BOS → CHoCH → mitigation</h2>

            <div className="my-8">
              <BOSCHoCHSequenceDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">El retroceso estructural institucional sigue una secuencia en 3 etapas. Esta secuencia garantiza que la inversión solo se toma tras confirmación completa.</p>

            <ol className="space-y-2 text-sm text-zinc-300 list-decimal pl-5">
              <li><span className="font-semibold text-white">BOS contratendencia</span>, ruptura del último HL (alcista) o LH (bajista). Abre la posibilidad del retroceso sin confirmarlo. Salida progresiva de las posiciones, todavía sin inversión.</li>
              <li><span className="font-semibold text-white">Formación de la nueva estructura</span>, 5 a 15 velas para producir un primer LL/LH (retroceso bajista) o HH/HL (retroceso alcista). Ninguna entrada de inversión durante esta fase de observación.</li>
              <li><span className="font-semibold text-white">CHoCH confirmado + mitigation</span>, nueva estructura inversa completa. Entrada en el retroceso hacia el nivel estructural roto (ex-HL convertido en resistencia, o ex-LH convertido en soporte) con señal de rechazo. Stop loss ajustado posible.</li>
            </ol>
          </section>

          {/* Bloque 6 — FALSO BOS + ERRORES */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Falso BOS : la mecha perfora, el cierre invalida</h2>

            <div className="my-8">
              <BOSFakeoutDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Un BOS que parece validado en la mecha puede ser invalidado retroactivamente por el cierre debajo del nivel o por una reintegración rápida. 3 errores recurrentes degradan la lectura.
            </p>

            <div className="space-y-3">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-red-400 font-semibold text-sm mb-1">1. Confundir mecha y cierre</p>
                <p className="text-zinc-300 text-sm">Validar con mecha expone al regreso a la zona de origen. Esperar el cierre completo de la vela.</p>
              </div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-red-400 font-semibold text-sm mb-1">2. Confundir BOS y CHoCH</p>
                <p className="text-zinc-300 text-sm">HH/LL roto = BOS (continuación). HL/LH roto = CHoCH (retroceso potencial).</p>
              </div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-red-400 font-semibold text-sm mb-1">3. Tradear el 1er BOS contratendencia sin CHoCH</p>
                <p className="text-zinc-300 text-sm">Inversión tomada antes de la confirmación = regreso a la tendencia de origen. Esperar la secuencia completa LL+LH o HH+HL.</p>
              </div>
            </div>
          </section>

          {/* Bloque 7 — PLAN DE TRADE EUR/USD H4 */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan de trade: BOS alcista EUR/USD H4</h2>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              EUR/USD en tendencia alcista H4 desde hace 4 semanas. Estructura: 3 HL en 1.1620, 1.1680, 1.1720, y 3 HH en 1.1700, 1.1760, 1.1820. MM200 Daily en 1.1500, precio por encima. La vela H4 acaba de cerrar en 1.1858, es decir 38 pips por encima del HH 1.1820, displacement marcado. 5 velas mantienen su cierre por encima de 1.1820 sin reintegración. Sin news macro en la ventana. El último HL 1.1720 no ha sido roto: sin CHoCH, BOS alcista validado.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Setup</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Entrada: 1.1822 (retest del nivel ex-resistencia convertido en soporte, señal de rechazo M15)</li>
                <li>- Stop loss: 1.1710 (debajo del último HL 1.1720 con margen de 10 pips)</li>
                <li>- Take profit: 1.1990 (proyección estructural, próxima extensión del impulso)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Cálculo del R/R</p>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>- Riesgo: 1.1822 - 1.1710 = 112 pips</li>
                <li>- Ganancia potencial: 1.1990 - 1.1822 = 168 pips</li>
                <li>- R/R: 168 / 112 = 1,5</li>
                <li>- Setup explotable al umbral mínimo institucional.</li>
              </ul>
            </div>
          </section>

          {/* Bloque 8 — CÁLCULO RETAIL */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Cálculo retail</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              El riesgo por trade según el capital aplicado a este setup.
            </p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-3">
              <li>- Cuenta 300€ → 5% = riesgo 15€, ganancia potencial 22,50€</li>
              <li>- Cuenta 500€ → 3% = riesgo 15€, ganancia potencial 22,50€</li>
              <li>- Cuenta 1 000€ → 2% = riesgo 20€, ganancia potencial 30€</li>
              <li>- Cuenta 2 500€ → 2% = riesgo 50€, ganancia potencial 75€</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">
              El R/R se mantiene 1,5:1 sin importar el tamaño de la cuenta. Lo que cambia es el tamaño del lote y el porcentaje de riesgo adaptado al capital.
            </p>
          </section>

          <LessonKeyPoints
            points={[
              "BOS confirma la tendencia por la ruptura de un extremo estructural (HH o LL). CHoCH la pone en duda por la ruptura de un mínimo o máximo inverso (HL o LH). El nivel roto dicta la señal.",
              "4 criterios califican un BOS válido: cierre nítido, displacement marcado, ausencia de reintegración, alineación multi-timeframe.",
              "La secuencia de retroceso sigue 3 etapas: BOS contratendencia, formación de la nueva estructura, CHoCH confirmado.",
              "La entrada de inversión solo se toma tras CHoCH confirmado, en la zona de mitigation con señal de rechazo.",
            ]}
          />

          <LessonExercice
            description="En XAU/USD H4, la tendencia bajista en curso muestra 3 LH sucesivos en 4 720$, 4 660$ y 4 620$, y 3 LL sucesivos en 4 660$, 4 600$ y 4 540$. Una vela H4 acaba de cerrar en 4 670$, es decir 50$ por encima del último LH en 4 620$. 4 velas siguientes mantienen su cierre por encima de 4 620$. Sin news macro en la ventana. ¿Cómo se construye la lectura BOS/CHoCH?"
            steps={[
              "Identificar la naturaleza del nivel roto: 4 620$ es el último LH (máximo de estructura bajista inversa), se trata de una señal de retroceso potencial, no de continuación.",
              "Calificar la ruptura: cierre franco en 4 670$ (50$ por encima del LH), displacement superior al promedio reciente, sin reintegración en 4 velas, ruptura validada estructuralmente.",
              "Clasificar la señal: la ruptura del último LH constituye un BOS contratendencia, primera señal de retroceso potencial de la tendencia bajista.",
              "Esperar la formación de la nueva estructura: observar la formación de un primer HL (mínimo más alto que el anterior) tras el BOS contratendencia.",
              "Validar el CHoCH antes de la inversión: confirmar el CHoCH por la secuencia completa HL más HH en la nueva estructura alcista antes de cualquier toma de posición long. La salida de las posiciones short existentes puede dispararse desde el BOS contratendencia, la inversión exige el CHoCH.",
            ]}
          />

          <LessonQuiz
            question="¿Cuál es la diferencia operativa fundamental entre un BOS y un CHoCH en una tendencia alcista?"
            options={[
              "El BOS rompe un HL, el CHoCH rompe un HH",
              "El BOS rompe un HH (extremo alcista), el CHoCH rompe un HL (mínimo estructural)",
              "Los dos designan la misma ruptura estructural",
              "El BOS se usa en M15, el CHoCH en Daily",
            ]}
            correctIndex={1}
            explanation="En tendencia alcista, un BOS valida la continuación por la ruptura del último HH (extremo en el sentido de la tendencia). Un CHoCH inicia un retroceso por la ruptura del último HL (mínimo estructural que define la estructura alcista). La naturaleza del nivel roto, HH vs HL, dicta la naturaleza de la señal y la decisión operativa."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "smc", "lecon2");
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
                  <p className="text-sm font-semibold text-emerald-400">Lección completada</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Lección 2 del módulo SMC: Pensar institucional terminada.</p>
                </div>
              </div>
            )}

            {/* Navegación */}
            <div className="mt-5 flex items-center justify-between">
              <Link href="/strategies/smc/lecon1" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lección 1
              </Link>
              <span className="inline-flex items-center gap-2 text-sm text-zinc-700 cursor-not-allowed">
                Lección 3. Próximamente
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
