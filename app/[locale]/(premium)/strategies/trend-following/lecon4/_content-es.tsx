"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { BOSDiagram } from "@/app/components/charts/BOSDiagram";
import { CHoCHDiagram } from "@/app/components/charts/CHoCHDiagram";
import BOSvsCHoCHComparisonDiagram from "@/app/components/charts/BOSvsCHoCHComparisonDiagram";
import BOSFakeoutDiagram from "@/app/components/charts/BOSFakeoutDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Reconocer una tendencia (HH/HL vs LH/LL)", disabled: false },
  { id: "lecon2", title: "Trendline y medias móviles: trazar la tendencia", disabled: false },
  { id: "lecon3", title: "Tradear con la tendencia: pullback y entrada", disabled: false },
  { id: "lecon4", title: "Cuándo salir: reversión de tendencia", disabled: false },
];

export default function ContentEs() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "trend-following", "lecon4"));
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
          <span className="text-zinc-500">Lección 4</span>
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
            Cuándo salir: reversión de tendencia
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Esta lección enseña a distinguir BOS (continuación) y CHoCH (reversión): criterios numéricos, falsos BOS a evitar, plan de ejecución en una inversión confirmada.
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

          {/* Bloc 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                &quot;Una tendencia no se termina con una vela roja. Se termina con una ruptura estructural confirmada.&quot;
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerrequisitos</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Estructura HH/HL/LL/LH → ver Curso de Trading L3</li>
              <li>- Ruptura estructural → ver Curso de Trading L3</li>
              <li>- Enfoque SMC completo → ver Estrategias SMC L1 y L2</li>
            </ul>
          </div>

          {/* Bloc 3 — BOS VS CHoCH CÔTE À CÔTE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">BOS vs CHoCH lado a lado</h2>

            <div className="my-8">
              <BOSvsCHoCHComparisonDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Misma estructura de partida, sentido de ruptura opuesto. La naturaleza del nivel roto dicta la naturaleza de la señal.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- <span className="font-semibold text-zinc-100">BOS</span>: ruptura en el sentido de la tendencia (HH en alcista, LL en bajista) = continuación</li>
              <li>- <span className="font-semibold text-zinc-100">CHoCH</span>: ruptura contra el sentido (HL en alcista, LH en bajista) = reversión</li>
              <li>- La salida en BOS protege las ganancias. La inversión exige el CHoCH confirmado</li>
            </ul>
          </section>

          {/* Bloc 4 — RECONNAÎTRE UN BOS */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Reconocer un BOS</h2>

            <div className="my-8">
              <BOSDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Un Break of Structure (BOS) valida la continuación de la tendencia mediante la ruptura clara del último extremo estructural.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- BOS alcista: ruptura del último HH con cierre neto por encima</li>
              <li>- BOS bajista: ruptura del último LL con cierre neto por debajo</li>
              <li>- Distancia mínima: 15-20 pips EUR/USD H4 o 15-20$ XAU/USD H4</li>
              <li>- Sin reintegración en las 3-5 velas siguientes</li>
            </ul>
          </section>

          {/* Bloc 5 — RECONNAÎTRE UN CHoCH */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Reconocer un CHoCH</h2>

            <div className="my-8">
              <CHoCHDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Un Change of Character (CHoCH) inicia una reversión mediante la ruptura del último mínimo o máximo de estructura inversa.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- CHoCH bajista (desde alcista): ruptura del último HL</li>
              <li>- CHoCH alcista (desde bajista): ruptura del último LH</li>
              <li>- Primera señal de reversión estructural, dispara la salida de las posiciones</li>
              <li>- La inversión (entrada en el nuevo sentido) exige la confirmación mediante formación de nueva estructura + CHoCH completo</li>
            </ul>
          </section>

          {/* Bloc 6 — FAUX BOS À ÉVITER */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Falsos BOS a evitar</h2>

            <div className="my-8">
              <BOSFakeoutDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Una mecha que perfora el nivel estructural sin cierre claro no es un BOS. Es a menudo un liquidity grab institucional.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- La mecha supera el HH/LL, pero el cuerpo cierra por debajo/encima = BOS inválido</li>
              <li>- Liquidity grab: las instituciones apuntan a los stops acumulados más allá del nivel</li>
              <li>- Esperar el cierre completo de la vela antes de cualquier lectura de BOS</li>
            </ul>
          </section>

          {/* Bloc 7 — PLAN DE TRADE CHIFFRÉ */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan de trade: reversión en CHoCH XAU/USD H4</h2>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              XAU/USD en tendencia alcista H4 desde hace 3 semanas (2 HL en 4 520$ y 4 580$, 2 HH en 4 620$ y 4 660$). BOS bajista: cierre en 4 555$ (25$ bajo el HL 4 580$). Validación en 4 velas sin reintegración. Formación de nueva estructura: LH en 4 600$ luego LL en 4 530$ = CHoCH confirmado.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Setup (trade short en reversión confirmada)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Entrada short: 4 580$ (retroceso al ex-HL convertido en resistance, señal de rechazo esperada)</li>
                <li>- Stop loss: 4 615$ (más allá del LH en 4 600$, margen 15$)</li>
                <li>- Take profit: 4 450$ (zona de support identificada más abajo)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Cálculo del R/R</p>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>- Riesgo: 4 615$ - 4 580$ = 35$</li>
                <li>- Ganancia potencial: 4 580$ - 4 450$ = 130$</li>
                <li>- R/R: 130 / 35 = 3,71</li>
              </ul>
            </div>

            <p className="text-white font-semibold text-sm mb-2">Cálculo retail</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-3">
              <li>- Cuenta 300€ → 5% = riesgo 15€, ganancia potencial 55€</li>
              <li>- Cuenta 500€ → 3% = riesgo 15€, ganancia potencial 55€</li>
              <li>- Cuenta 1 000€ → 2% = riesgo 20€, ganancia potencial 74€</li>
              <li>- Cuenta 2 500€ → 2% = riesgo 50€, ganancia potencial 185€</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">
              El RR se mantiene en 3,71:1 sin importar el tamaño de la cuenta.
            </p>
          </section>

          <LessonKeyPoints
            points={[
              "BOS = ruptura del último extremo estructural en el sentido de la tendencia (continuación).",
              "CHoCH = ruptura del último mínimo/máximo de estructura inversa (reversión).",
              "La salida de una posición se dispara apenas el BOS quede validado. La inversión exige el CHoCH confirmado.",
              "Sin cierre claro (solo mecha), no hay BOS, es un liquidity grab.",
            ]}
          />

          <LessonExercice
            description="En XAU/USD H4, la tendencia alcista en curso formó un último HL en 4 580$ y un último HH en 4 660$. Una vela cierra en 4 555$ con un cuerpo significativo, o sea 25$ bajo el último HL. Las 4 velas siguientes mantienen su cierre bajo 4 580$. Luego el precio forma un máximo en 4 600$ y vuelve a bajar a formar un mínimo en 4 530$. ¿Cómo se construye el plan completo?"
            steps={[
              "Calificar el BOS bajista: cierre claro en 4 555$ (25$ bajo el HL 4 580$), cuerpo significativo, sin reintegración en 4 velas. BOS validado",
              "Disparar la salida de toda posición long existente apenas el cierre en 4 555$",
              "Observar la estructura post-ruptura: máximo en 4 600$ (primer LH potencial) luego mínimo en 4 530$ (primer LL)",
              "Confirmar el CHoCH bajista: la secuencia LH (4 600$) + LL (4 530$) invierte oficialmente la tendencia",
              "Armar el plan de inversión: entrada short en el retroceso hacia 4 580$ (ex-HL convertido en resistance) con señal de rechazo, stop loss en 4 615$ (más allá del LH 4 600$ + margen 15$), take profit en 4 450$ (ratio R/R 1:3,7), tamaño de posición según el riesgo por trade",
            ]}
          />

          <LessonQuiz
            question="¿Cuál es la condición mínima para calificar una tendencia alcista como explotable en un chart H4?"
            options={[
              "1 máximo más alto es suficiente",
              "2 mínimos ascendentes (HL) y 2 máximos ascendentes (HH) sucesivos",
              "Una media móvil orientada al alza",
              "Un volumen elevado en 5 velas",
            ]}
            correctIndex={1}
            explanation="Una tendencia explotable exige mínimo 2 HL + 2 HH sucesivos en el timeframe H4. Por debajo de ese umbral, el mercado se mantiene en range o consolidación, no en tendencia estructuralmente confirmada."
          />

          <LessonQuiz
            question="En una tendencia alcista confirmada, ¿qué profundidad de retroceso define un pullback explotable?"
            options={[
              "Inferior al 10% del impulso",
              "Entre 30% y 60% del impulso anterior",
              "Superior al 80% del impulso",
              "Sin umbral definido",
            ]}
            correctIndex={1}
            explanation="El pullback explotable se ubica entre 30% y 60% del impulso anterior. Un retroceso inferior al 30% se mantiene superficial y no ofrece un nivel de entrada limpio. Un retroceso superior al 60% pone en duda la estructura de la tendencia."
          />

          <LessonQuiz
            question="Se confirma una ruptura del último HL en tendencia alcista. Se contempla una posición de inversión (entrada short). ¿En qué momento ejecutar esta inversión?"
            options={[
              "Apenas la ruptura del HL (BOS)",
              "Tras la confirmación del CHoCH (primer LH + primer LL en la nueva estructura)",
              "Al regreso del precio al HL roto sin otra confirmación",
              "Sin esperar, la entrada es inmediata",
            ]}
            correctIndex={1}
            explanation="La inversión exige la confirmación CHoCH antes de la ejecución. La salida de una posición existente puede dispararse apenas el BOS, pero una posición de inversión solo se toma tras la formación del primer LH + primer LL en la nueva estructura bajista. Sin CHoCH, el BOS puede invalidarse."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "trend-following", "lecon4");
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
                  <p className="text-sm font-semibold text-emerald-400">Módulo Trend Following terminado</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Todas las lecciones del módulo han sido completadas.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <Link href="/strategies/trend-following/lecon3" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lección 3
              </Link>
              <Link href="/strategies/trend-following" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                Volver al módulo
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
