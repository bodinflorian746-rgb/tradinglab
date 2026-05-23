"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import DoubleTopBottomDiagram from "@/app/components/charts/DoubleTopBottomDiagram";
import DTBValidationGridDiagram from "@/app/components/charts/DTBValidationGridDiagram";
import DTBMeasuredMoveProjectionDiagram from "@/app/components/charts/DTBMeasuredMoveProjectionDiagram";

const LESSONS = [
  { id: "lecon1", slug: "lecon1", title: "Double top / Double bottom: la firma de la inversión", duration: "16 min", disabled: false },
  { id: "lecon2", slug: "lecon2", title: "Lección 2", duration: "", disabled: true },
  { id: "lecon3", slug: "lecon3", title: "Lección 3", duration: "", disabled: true },
  { id: "lecon4", slug: "lecon4", title: "Lección 4", duration: "", disabled: true },
];

export default function ContentEs() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "reversal", "lecon1"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Estrategias</Link>
          <span>/</span>
          <Link href="/strategies/reversal" className="hover:text-zinc-400 transition-colors">Reversal &amp; Inversiones</Link>
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
            <span className="text-xs text-zinc-600">16 min</span>
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
            Double top / Double bottom: la firma de la inversión
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Reconocer una inversión antes de que sea demasiado tarde hace la diferencia entre conservar las ganancias y devolverlas todas. El double top y el double bottom son los dos patrones de inversión más simples de detectar. Esta lección muestra cómo identificarlos y cómo tradearlos.
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

        {/* ── Contenido ── */}
        <div className="space-y-8">

          {/* Bloque 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                «Cuando el mercado falla dos veces en el mismo precio, ya no es casualidad. Es una señal.»
              </p>
            </div>
          </section>

          {/* Bloque 2 — PRERREQUISITOS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerrequisitos</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Estructura de mercado HH/HL/LL/LH → ver Curso Trading L3</li>
              <li>- Support / Resistance → ver Estrategia SR L1</li>
              <li>- Vela de breakout, cierre vs mecha → ver Curso Trading L2</li>
            </ul>
          </div>

          {/* Bloque — POR QUÉ FUNCIONAN ESTOS PATRONES */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Por qué funcionan estos patrones</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Cuando el precio toca una resistance, baja y vuelve a testear ese mismo nivel sin romperlo, es una señal clara. Los compradores ya no tienen fuerza suficiente para empujar por encima. El mercado muestra que ese nivel está defendido. En espejo, el double bottom muestra la misma lógica sobre un support.</p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Un double top no es solo un dibujo en un gráfico. Es la expresión visible de un desequilibrio. En cada test del nivel, vendedores toman sus ganancias o entran nuevos vendedores. En el segundo fallo, los que estaban long en pullback empiezan a salir, lo que acelera la caída.</p>
            <p className="text-zinc-300 leading-relaxed text-sm">Este patrón sigue siendo accesible al retail porque se lee rápido. A diferencia de los conceptos ICT o las estructuras complejas, un double top se ve en 5 segundos. No necesitás 6 indicadores para detectarlo.</p>
          </section>

          {/* Bloque 3 — DOUBLE TOP */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Double Top: fin de tendencia alcista</h2>
            <div className="my-8">
              <DoubleTopBottomDiagram locale="es" />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">Un double top se forma al final de una tendencia alcista. El precio toca una resistance, baja un poco y forma un mínimo llamado neckline. Vuelve a subir para testear el mismo nivel de resistance. Si falla en romperlo y baja, el patrón está completo. La confirmación llega cuando el precio rompe la neckline por debajo del mínimo intermedio.</p>

            <p className="text-zinc-300 leading-relaxed text-sm font-semibold text-zinc-200 mb-2">Las 3 condiciones para que un double top sea válido:</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-4">
              <li>- Una tendencia alcista previa clara (HH/HL)</li>
              <li>- Dos máximos casi iguales (diferencia tolerada: 0,2% máximo)</li>
              <li>- Un breakout confirmado de la neckline (cierre, no una simple mecha)</li>
            </ul>

            <p className="text-zinc-300 leading-relaxed text-sm">Ejemplo en EUR/USD. El mercado está alcista desde hace varios días. Toca una resistance en 1.1880 y baja hacia 1.1800. Vuelve a subir y testea 1.1895, casi igual al primer máximo, y falla. Baja y cierra una vela debajo de 1.1800. Double top confirmado.</p>
          </section>

          {/* Bloque 4 — VALIDAR EL PATRÓN */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Validar el patrón</h2>
            <div className="my-8">
              <DTBValidationGridDiagram locale="es" />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">La validación de un double top o bottom sigue 4 criterios estrictos. Una sola ausencia invalida estructuralmente el patrón.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">1. Tendencia previa clara.</span> <span className="text-zinc-300">Sin range antes de los máximos/mínimos. La estructura HH/HL o LH/LL debe ser nítida.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">2. Diferencia ≤ 0,3%.</span> <span className="text-zinc-300">En EUR/USD: 30 pips máximo entre los 2 máximos/mínimos. Más allá: patrón no válido.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">3. Breakout por cierre.</span> <span className="text-zinc-300">Cierre franco de vela debajo (o por encima) de la neckline. Mecha sola = test, no confirmación.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">4. Ausencia de news mayor.</span> <span className="text-zinc-300">FOMC, NFP, CPI dentro de los 30 minutos: el patrón puede romperse en cualquier dirección.</span></div>
            </div>
          </section>

          {/* Bloque 5 — DOUBLE BOTTOM */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Double Bottom: fin de tendencia bajista</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">El double bottom es el espejo perfecto del double top. El precio toca un support, sube un poco y forma una neckline. Baja de nuevo a testear el mismo support. Si falla en romperlo y sube, el patrón está completo. La confirmación llega cuando el precio rompe la neckline por encima del máximo intermedio.</p>

            <p className="text-zinc-300 leading-relaxed text-sm font-semibold text-zinc-200 mb-2">Las 3 condiciones, en espejo:</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-4">
              <li>- Una tendencia bajista previa clara (LH/LL)</li>
              <li>- Dos mínimos casi iguales</li>
              <li>- Un breakout confirmado de la neckline (cierre por encima)</li>
            </ul>

            <p className="text-zinc-300 leading-relaxed text-sm">Ejemplo en XAU/USD. El mercado está bajista desde hace 2 días. Toca un support en 4 480$ y sube hacia 4 520$. Baja a testear 4 478$ y rechaza. Sube y cierra una vela por encima de 4 520$. Double bottom confirmado.</p>
          </section>

          {/* Bloque 6 — PROYECCIÓN DEL TAKE PROFIT (MEASURED MOVE) */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Proyección del Take Profit (measured move)</h2>
            <div className="my-8">
              <DTBMeasuredMoveProjectionDiagram locale="es" />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">El take profit de un double top/bottom sigue el principio del measured move: la altura del patrón (del máximo a la neckline) se proyecta desde la neckline en el sentido del breakout.</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Altura del patrón = distancia máximo (o mínimo) → neckline.</li>
              <li>- TP teórico = neckline ± altura del patrón, según el sentido del breakout.</li>
              <li>- TP ajustado unos pips para obtener un RR redondo (2:1 o 3:1).</li>
            </ul>
          </section>

          {/* Bloque 7 — PLAN DE TRADE EUR/USD H1 */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan de trade: Double Top EUR/USD H1</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Se retoma el contexto del double top EUR/USD del Bloque 3. Tendencia alcista previa, dos máximos en 1.1880 y 1.1895, neckline en 1.1800. El precio acaba de cerrar una vela H1 en 1.1795, debajo de la neckline. Patrón confirmado.</p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">La entrada se hace short justo debajo de la neckline para tomar el breakdown. A un precio que ya cae no se le persigue. Se requiere una confirmación limpia con un cierre debajo de la neckline. El stop loss va por encima del último máximo para invalidar correctamente el patrón. El TP sigue el measured move: la altura del patrón, del máximo a la neckline, se proyecta desde la neckline hacia abajo.</p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">Altura del patrón: 1.1880 - 1.1800 = 80 pips. Proyección teórica debajo de la neckline: 1.1720. El TP se toma 5 pips más abajo en 1.1715 para obtener un RR redondo de 2:1 (40 pips de riesgo, 80 pips de ganancia).</p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Setup</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Entrada short: 1.1795 (cierre debajo de neckline)</li>
                <li>- Stop loss: 1.1835 (40 pips por encima de la mecha del 2do máximo)</li>
                <li>- Take profit: 1.1715 (80 pips, measured move ajustado)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Cálculo del R/R</p>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>- Riesgo: 1.1835 - 1.1795 = 40 pips</li>
                <li>- Ganancia potencial: 1.1795 - 1.1715 = 80 pips</li>
                <li>- R/R: 80 / 40 = 2:1</li>
                <li>- Setup explotable.</li>
              </ul>
            </div>
          </section>

          {/* Bloque 8 — CÁLCULO RETAIL */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Cálculo retail</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">El riesgo por trade se adapta al capital. Con este setup R/R 2:1, esta es la distribución según el tamaño de la cuenta.</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-3">
              <li>- Cuenta 300€ → 5% = riesgo 15€, ganancia potencial 30€</li>
              <li>- Cuenta 500€ → 3% = riesgo 15€, ganancia potencial 30€</li>
              <li>- Cuenta 1 000€ → 2% = riesgo 20€, ganancia potencial 40€</li>
              <li>- Cuenta 2 500€ → 2% = riesgo 50€, ganancia potencial 100€</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">El R/R 2:1 se mantiene constante sin importar el tamaño de la cuenta. Lo que cambia es el tamaño de lote y el porcentaje de riesgo adaptado al capital.</p>
          </section>

          {/* Bloque 9 — FILTROS: CUÁNDO NO TOMAR EL SETUP */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Filtros: cuándo no tomar el setup</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-red-400 font-semibold">1. Sin tendencia previa clara.</span> <span className="text-zinc-300">Si el mercado estaba en range antes de los 2 máximos/mínimos, no es una inversión. Setup a ignorar.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-red-400 font-semibold">2. Diferencia muy grande entre máximos/mínimos.</span> <span className="text-zinc-300">Más allá de 0,3% (30 pips en EUR/USD), la mecánica ya no es la del double top. Patrón no válido.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-red-400 font-semibold">3. Breakout por mecha, sin cierre.</span> <span className="text-zinc-300">Una mecha que pincha debajo de la neckline y vuelve por encima no confirma nada. Espera el cierre franco.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-red-400 font-semibold">4. News mayor en la ventana.</span> <span className="text-zinc-300">FOMC, NFP, CPI dentro de los 30 minutos: el setup no se toma. La news puede romper el patrón en cualquier dirección.</span></div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "Double top = 2 máximos casi iguales en una resistance después de tendencia alcista. Double bottom = espejo en un support.",
              "Confirmación = cierre (no mecha) del otro lado de la neckline.",
              "Entrada justo después del breakout. SL más allá del último máximo/mínimo. TP = measured move (altura del patrón proyectada).",
              "Setup ignorado si la tendencia previa no es clara, si la diferencia supera 0,3%, o si una news mayor está por salir.",
            ]}
          />

          <LessonExercice
            description="En EUR/USD H1, ves un double top con un primer máximo en 1.1850 y un segundo en 1.1825. Diferencia: 25 pips, aproximadamente 0,23%. La neckline está en 1.1750. El precio cierra en 1.1745. ¿Tomas el setup?"
            steps={[
              "Verifica que la diferencia entre los 2 máximos esté bajo el límite: 0,23% < 0,3% — OK",
              "Confirma que el breakout sea por cierre debajo de 1.1750, no una simple mecha — OK",
              "Verifica que la tendencia alcista previa sea clara (HH/HL)",
              "Verifica que no haya news mayor prevista en los próximos 30 minutos",
              "Toma la entrada short en 1.1745, SL por encima del 2do máximo, TP measured move",
            ]}
          />

          <LessonQuiz
            question="¿Qué confirma un double top?"
            options={[
              "El segundo máximo que toca la resistance",
              "Una mecha que pincha debajo de la neckline",
              "Un cierre de vela debajo de la neckline",
              "Un volumen muy elevado",
            ]}
            correctIndex={2}
            explanation="La confirmación de un double top llega únicamente cuando el precio cierra una vela debajo de la neckline. Una simple mecha que pincha debajo y vuelve por encima no valida nada — esperar un cierre franco sigue siendo indispensable para evitar las señales falsas."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "reversal", "lecon1");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lección 1 del módulo Reversal &amp; Inversiones completada.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <Link href="/strategies/reversal" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Volver al módulo
              </Link>
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
