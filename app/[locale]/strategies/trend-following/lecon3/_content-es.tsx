"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { FibonacciDiagram } from "@/app/components/charts/FibonacciDiagram";
import { OTEDiagram } from "@/app/components/charts/OTEDiagram";
import { PrecisionEntryDiagram } from "@/app/components/charts/PrecisionEntryDiagram";
import FibPullbackChecklistDiagram from "@/app/components/charts/FibPullbackChecklistDiagram";
import FibTPProjectionDiagram from "@/app/components/charts/FibTPProjectionDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Reconocer una tendencia (HH/HL vs LH/LL)", disabled: false },
  { id: "lecon2", title: "Trendline y medias móviles: trazar la tendencia", disabled: false },
  { id: "lecon3", title: "Pullback Fibonacci 0.618/0.786: entrada óptima", disabled: false },
  { id: "lecon4", title: "Lección 4",          disabled: true },
];

export default function ContentEs() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "trend-following", "lecon3"));
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
            Pullback Fibonacci 0.618/0.786: entrada óptima
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Esta lección enseña a tradear el pullback en la zona OTE (Fibonacci 0.618-0.786) con confluencia Order Block / FVG para una entrada de precisión.
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
                &quot;La zona OTE (0.618-0.786) es el punto donde el mercado respira antes de volver a moverse. Es también la entrada preferida de los institucionales.&quot;
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerrequisitos</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Pullback en tendencia → ver Estrategia TF L1</li>
              <li>- Fibonacci retracement → ver Curso de Trading L4</li>
              <li>- Order Block / FVG → ver Estrategia SMC L3 (mención rápida)</li>
            </ul>
          </div>

          {/* Bloc 3 — REPÉRER LA ZONE OTE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Ubicar la zona OTE</h2>

            <div className="my-8">
              <OTEDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              La zona OTE (Optimal Trade Entry) cubre los retracements Fibonacci de 0.618 a 0.786. Retracement profundo pero estructuralmente válido mientras el 0.786 se sostenga.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Trazado Fibo: último HL → último HH (alcista) o último LH → último LL (bajista)</li>
              <li>- Nivel 0.618: entrada privilegiada, equilibrio óptimo entre retroceso y riesgo</li>
              <li>- Nivel 0.786: límite aceptable, exige señal de rechazo fuerte</li>
              <li>- Más allá de 0.786: tendencia probablemente rota, sin trade en el sentido anterior</li>
            </ul>
          </section>

          {/* Bloc 4 — VALIDER LE PULLBACK FIBO */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Validar el pullback Fibo (checklist)</h2>

            <div className="my-8">
              <FibPullbackChecklistDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              4 criterios califican un pullback Fibonacci tradeable. Una vez validados, el setup entra en la selección prioritaria.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Impulso claro: displacement direccional marcado (cuerpos significativos)</li>
              <li>- Retracement 30-60% (idealmente 0.5 a 0.618): profundidad tradeable</li>
              <li>- Señal de rechazo al contacto (pin bar, engulfing, reacción inmediata)</li>
              <li>- Sesgo de TF superior (H4 o Daily) alineado con el sentido del impulso</li>
            </ul>
          </section>

          {/* Bloc 5 — CONFLUENCE MULTI-ÉLÉMENTS */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Confluencia multi-elemento</h2>

            <div className="my-8">
              <PrecisionEntryDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              La zona OTE gana fuerza cuando se superpone con otros elementos estructurales. La confluencia multiplica la probabilidad de reacción institucional.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- OTE + Order Block visible en la zona = defensa institucional confirmada</li>
              <li>- OTE + FVG (Fair Value Gap) no llenado = liquidity por absorber</li>
              <li>- OTE + Support / Resistance H4 o Daily = memoria colectiva</li>
              <li>- 3 confluencias o más = entrada de precisión</li>
            </ul>
          </section>

          {/* Bloc 6 — PLAN DE TRADE CHIFFRÉ */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan de trade: pullback Fibo XAU/USD H4</h2>

            <div className="my-8">
              <FibonacciDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              XAU/USD en tendencia alcista confirmada. Último HL en 4 480$, último HH en 4 660$ (impulso 180$). Fibonacci: 0.618 = 4 548$, 0.786 = 4 519$. El precio baja a tocar 4 550$ (prácticamente 0.618). Pin bar alcista al contacto.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Setup (trade long en pullback 0.618)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Entrada long: 4 565$ (cierre de la pin bar)</li>
                <li>- Stop loss: 4 510$ (10$ bajo el nivel 0.786 en 4 519$)</li>
                <li>- Take profit nivel 1: 4 660$ (HH anterior), nivel 2: 4 720$ (extensión 138%)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Cálculo del R/R</p>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>- Riesgo: 4 565$ - 4 510$ = 55$</li>
                <li>- Ganancia nivel 1: 95$ → RR 1,73</li>
                <li>- Ganancia nivel 2: 155$ → RR 155/55 = 2,82</li>
                <li>- El setup apunta prioritariamente al TP nivel 2</li>
              </ul>
            </div>

            <div className="my-8">
              <FibTPProjectionDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Proyección de los objetivos de extensión Fibonacci 1.272 y 1.618 para salir del trade en 2 partes.
            </p>

            <p className="text-white font-semibold text-sm mb-2">Cálculo retail</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-3">
              <li>- Cuenta 300€ → 5% = riesgo 15€, ganancia potencial 42€</li>
              <li>- Cuenta 500€ → 3% = riesgo 15€, ganancia potencial 42€</li>
              <li>- Cuenta 1 000€ → 2% = riesgo 20€, ganancia potencial 56€</li>
              <li>- Cuenta 2 500€ → 2% = riesgo 50€, ganancia potencial 141€</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">
              El RR se mantiene en 2,82:1 sin importar el tamaño de la cuenta.
            </p>
          </section>

          <LessonKeyPoints
            points={[
              "Trazado Fibonacci: último HL → HH (alcista) o LH → LL (bajista). 4 niveles clave: 0.382, 0.5, 0.618, 0.786.",
              "Zona de entrada privilegiada: OTE entre 0.618 y 0.786 con señal de rechazo confirmada.",
              "Confluencia OTE + OB + FVG + Support = entrada de precisión institucional.",
              "Stop loss más allá de 0.786 con margen 5-10 pips. Más allá, la tendencia está probablemente rota.",
            ]}
          />

          <LessonExercice
            description="En EUR/USD H4 en tendencia alcista, el último HL está en 1.1720 y el último HH en 1.1820. El precio retrocede actualmente a 1.1760. ¿A qué nivel Fibonacci corresponde este retroceso y cuál es el estatus del setup?"
            steps={[
              "Medir el impulso: 1.1820 - 1.1720 = 100 pips",
              "Calcular la posición del retroceso: 1.1820 - 1.1760 = 60 pips bajo el HH, o sea 60% del impulso",
              "Identificar el nivel Fibonacci: 60% corresponde a un nivel entre 0.5 (1.1770) y 0.618 (1.1758). El precio actual en 1.1760 se ubica prácticamente en el nivel 0.618, zona de entrada óptima",
              "Esperar la señal de rechazo (pin bar, engulfing) al contacto de 1.1758-1.1760 para validar el setup",
              "Armar el plan: entrada long al cierre de la señal, stop loss bajo 1.1741 (nivel 0.786 + margen 10 pips), take profit en 1.1820 (HH anterior) o 1.1858 (extensión 138%). Tamaño de posición según el riesgo por trade adaptado al capital",
            ]}
          />

          <LessonQuiz
            question="En una tendencia alcista confirmada, el precio retrocedió al 70% del último impulso. Una pin bar de rechazo se forma en ese nivel. ¿Cuál es el estatus operativo del setup?"
            options={[
              "Setup inválido, retroceso demasiado profundo",
              "Zona de entrada válida entre 0.618 y 0.786, setup explotable con señal de rechazo",
              "Setup superficial, esperar un retroceso más profundo",
              "Indeterminado, Fibonacci no se aplica en tendencia",
            ]}
            correctIndex={1}
            explanation="Un retroceso al 70% se ubica entre 0.618 (61,8%) y 0.786 (78,6%), zona de entrada válida pero profunda, explotable únicamente con una señal de rechazo confirmada. La pin bar de rechazo aporta esa confirmación. El stop loss se coloca más allá de 0.786 con margen 5-10 pips. Más allá de 0.786, la estructura de la tendencia quedaría en cuestión."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "trend-following", "lecon3");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lección 3 del módulo Trend Following completada.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <Link href="/strategies/trend-following/lecon2" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
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
