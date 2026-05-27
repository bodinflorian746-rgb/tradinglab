"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { OrderBlockDiagram } from "@/app/components/charts/OrderBlockDiagram";
import OBFreshnessDiagram from "@/app/components/charts/OBFreshnessDiagram";
import OBExecutionPlanDiagram from "@/app/components/charts/OBExecutionPlanDiagram";
import OBSLPlacementDiagram from "@/app/components/charts/OBSLPlacementDiagram";
import MitigationZoneEntryDiagram from "@/app/components/charts/MitigationZoneEntryDiagram";

const LESSONS = [
  { id: "lecon1", title: "Lección 1", disabled: false },
  { id: "lecon2", title: "Lección 2", disabled: false },
  { id: "lecon3", title: "Order Blocks: identificar las zonas institucionales", disabled: false },
  { id: "lecon4", title: "Lección 4", disabled: true },
  { id: "lecon5", title: "Lección 5", disabled: true },
];

export default function ContentEs() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "smc", "lecon3"));
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
          <span className="text-zinc-500">Lección 3</span>
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
            Order Blocks: identificar las zonas institucionales
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Los Order Blocks (OB) son las zonas de memoria institucional donde se colocaron órdenes importantes antes de un impulso. Esta lección cubre el procedimiento de identificación, los criterios de calificación, el plan de ejecución con cifras y las trampas a evitar.
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
            <span className="ml-auto text-xs text-zinc-600">3 / 5 lecciones</span>
          </div>
        </header>

        {/* ── Contenido ── */}
        <div className="space-y-8">

          {/* Bloque 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-blue-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « Un Order Block no es una zona teórica. Es la huella visible de la última orden institucional antes del impulso. »
              </p>
            </div>
          </section>

          {/* Bloque 2 — PRERREQUISITOS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerrequisitos</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Market Structure SMC, swings, fases → ver Estrategia SMC L1</li>
              <li>- BOS y CHoCH, ruptura estructural → ver Estrategia SMC L2</li>
              <li>- Vela de impulso, displacement → ver Formación Trading L2</li>
            </ul>
          </div>

          {/* Bloque 3 — IDENTIFICAR UN ORDER BLOCK */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Identificar un Order Block</h2>
            <div className="my-8">
              <OrderBlockDiagram locale="es" />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">La identificación de un Order Block sigue un procedimiento estricto en 4 etapas. Saltarse una de estas etapas lleva a calificar una zona no institucional como OB.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">1. Impulso direccional.</span> <span className="text-zinc-300">Movimiento franco con amplitud superior al promedio, que produce un BOS. 3 a 8 velas en H4 o Daily.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">2. Vela opuesta que precede al impulso.</span> <span className="text-zinc-300">Para impulso alcista: última vela bajista. Para bajista: última alcista. Huella de la última orden institucional.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">3. Validación por BOS.</span> <span className="text-zinc-300">El impulso que sigue a la vela opuesta DEBE producir un BOS validado. Sin BOS: simple zona de reacción, no un OB.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">4. Delimitación precisa.</span> <span className="text-zinc-300">Cuerpo de la vela opuesta = límites. Open alto / Close bajo para OB bullish. Coordenadas exactas definen entrada y SL.</span></div>
            </div>
          </section>

          {/* Bloque 4 — OB FRESH vs OB MITIGADO */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">OB fresh vs OB mitigado</h2>
            <div className="my-8">
              <OBFreshnessDiagram locale="es" />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">Un OB fresh (nunca retesteado) presenta una tasa de reacción más alta que un OB consumido. La frescura condiciona directamente la explotabilidad del setup.</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- OB fresh: menos de 20 velas H4 desde la formación, jamás atravesado. Reacción institucional plena esperada.</li>
              <li>- OB mitigado: el precio ya atravesó completamente la zona del cuerpo. Órdenes ejecutadas, OB consumido, setup no explotable.</li>
            </ul>
          </section>

          {/* Bloque 5 — CRITERIOS DE CALIFICACIÓN DE UN OB TRADABLE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Criterios de calificación de un OB tradable</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">4 criterios califican un OB como tradable operativamente. Un OB que no valida estos criterios sigue estructuralmente presente pero expone a una tasa de éxito reducida.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">1. Frescura del OB.</span> <span className="text-zinc-300">Menos de 20 velas H4 desde la formación. Más allá, el institucional pudo acumular en otra parte.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">2. FVG asociado en el impulso.</span> <span className="text-zinc-300">Brecha entre mechas sin solapamiento. Señala un impulso violento. Aumenta la probabilidad de reacción al retest.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">3. Alineación multi-timeframe.</span> <span className="text-zinc-300">OB H4 + sesgo Daily alineado. Precio por encima MM200 para OB bullish, por debajo para OB bearish.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">4. No-mitigation previa.</span> <span className="text-zinc-300">El precio todavía no atravesó por completo la zona. Mitigation completa consume el OB.</span></div>
            </div>
          </section>

          {/* Bloque 6 — PLAN DE EJECUCIÓN DEL SETUP OB */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan de ejecución del setup OB</h2>
            <div className="my-8">
              <OBExecutionPlanDiagram locale="es" />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">El plan de ejecución sigue una estructura estricta en 4 elementos. Válido para OB bullish (entrada long al retest) y bearish (entrada short al retest).</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">1. Nivel de entrada.</span> <span className="text-zinc-300">Límite externo del cuerpo del OB: límite alto (bullish), límite bajo (bearish). Señal de rechazo M15 confirma.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">2. Posición del stop loss.</span> <span className="text-zinc-300">Más allá de la mecha extrema, margen 5-10 pips EUR/USD o 5-10$ XAU/USD. JAMÁS dentro del cuerpo.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">3. Posición del take profit.</span> <span className="text-zinc-300">Ratio R/R 1:2 mínimo. Objetivo: próximo HH, zona de supply, o proyección medida del impulso inicial.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">4. Tamaño de posición.</span> <span className="text-zinc-300">Riesgo por trade: 5% para 300€, 3% para 500€, 2% para 1 000€+. Lote calculado sobre distancia entrada-SL.</span></div>
            </div>
          </section>

          {/* Bloque 7 — COLOCACIÓN DEL STOP LOSS */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Colocación del Stop Loss</h2>
            <div className="my-8">
              <OBSLPlacementDiagram locale="es" />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">La colocación del SL condiciona la supervivencia del trade. 3 posiciones posibles, una sola es correcta.</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- <span className="text-red-400 font-semibold">SL dentro de la zona</span>: wick normal al retest dispara el SL antes de la reacción. Setup matado por stop hunt.</li>
              <li>- <span className="text-amber-400 font-semibold">SL en el límite</span>: tolerancia cero para los wicks de retest. Riesgo alto de invalidación prematura.</li>
              <li>- <span className="text-emerald-400 font-semibold">SL con margen (correcto)</span>: 5-10 pips más allá de la mecha extrema. Absorbe los wicks secundarios.</li>
            </ul>
          </section>

          {/* Bloque 8 — ZONA DE MITIGATION TRAS CHoCH */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Zona de mitigation tras CHoCH</h2>
            <div className="my-8">
              <MitigationZoneEntryDiagram locale="es" />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">Tras un CHoCH (ver Estrategia SMC L2), el ex-nivel estructural roto se convierte en una zona de OB de mitigation para entrar en el nuevo sentido. Setup de entrada preciso con stop ajustado.</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Ex-HL se convierte en resistencia (CHoCH bajista), ex-LH se convierte en soporte (CHoCH alcista).</li>
              <li>- Entrada al retest de la zona con señal de rechazo M15.</li>
              <li>- Stop loss ajustado más allá de la zona, take profit en proyección estructural.</li>
            </ul>
          </section>

          {/* Bloque 9 — ERRORES COMUNES */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Errores comunes en los Order Blocks</h2>
            <div className="space-y-3">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-red-400 font-semibold text-sm mb-1">1. Identificar un OB sin BOS validado</p>
                <p className="text-zinc-300 text-sm">Vela opuesta aislada sin impulso ni ruptura estructural = zona sin valor. Siempre validar el impulso claro y el BOS antes de la calificación.</p>
              </div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-red-400 font-semibold text-sm mb-1">2. Trade en un OB ya mitigado</p>
                <p className="text-zinc-300 text-sm">Si el precio atravesó por completo la zona, las órdenes institucionales están consumidas. Priorizar los OB fresh de menos de 20 velas H4.</p>
              </div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-red-400 font-semibold text-sm mb-1">3. SL colocado dentro de la zona del OB</p>
                <p className="text-zinc-300 text-sm">Wick normal en el retest dispara el SL. Colocar más allá de la mecha extrema con margen 5-10 pips, jamás dentro del cuerpo.</p>
              </div>
            </div>
          </section>

          {/* Bloque 10 — PLAN DE TRADE EUR/USD H4 */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan de trade: OB bullish EUR/USD H4</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">EUR/USD en tendencia alcista H4 confirmada. Precio por encima MM200 Daily (1.1500) y MM50 Daily (1.1700). Impulso alcista de 4 velas desde 1.1740 hasta 1.1830, validado por un BOS por encima del HH anterior en 1.1820. Vela opuesta que precede al impulso: cuerpo 1.1780 (open) / 1.1752 (close), mecha baja 1.1745. Zona OB: 1.1752-1.1780, OB fresh (5 velas desde la formación), alineado Daily, no mitigado.</p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Setup</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Entrada: 1.1780 (límite alto del cuerpo del OB, orden limit o espera de la señal M15)</li>
                <li>- Stop loss: 1.1752 (28 pips debajo de la entrada, más allá de la mecha baja 1.1745 con margen de 7 pips)</li>
                <li>- Take profit: 1.1858 (78 pips por encima, proyección extensión del impulso inicial)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Cálculo del R/R</p>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>- Riesgo: 1.1780 - 1.1752 = 28 pips</li>
                <li>- Ganancia potencial: 1.1858 - 1.1780 = 78 pips</li>
                <li>- R/R: 78 / 28 = 2,79</li>
                <li>- Setup explotable.</li>
              </ul>
            </div>
          </section>

          {/* Bloque 11 — CÁLCULO RETAIL */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Cálculo retail</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">El riesgo por trade según el capital aplicado a este setup.</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-3">
              <li>- Cuenta 300€ → 5% = riesgo 15€, ganancia potencial 42€</li>
              <li>- Cuenta 500€ → 3% = riesgo 15€, ganancia potencial 42€</li>
              <li>- Cuenta 1 000€ → 2% = riesgo 20€, ganancia potencial 56€</li>
              <li>- Cuenta 2 500€ → 2% = riesgo 50€, ganancia potencial 140€</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">El R/R se mantiene 2,79:1 sin importar el tamaño de la cuenta. Lo que cambia es el tamaño del lote y el porcentaje de riesgo adaptado al capital.</p>
          </section>

          <LessonKeyPoints
            points={[
              "Un Order Block es la última vela de sentido opuesto que precede a un impulso validado por un BOS. El procedimiento de identificación sigue 4 etapas estrictas.",
              "4 criterios califican un OB tradable: frescura (menos de 20 velas H4), FVG asociado, alineación multi-timeframe, no-mitigation previa.",
              "La entrada se coloca en el límite externo del cuerpo del OB con señal de rechazo M15. El SL más allá de la mecha extrema, jamás dentro del cuerpo.",
              "El R/R mínimo es 1:2. El TP apunta a la próxima zona estructural o a la proyección medida del impulso inicial.",
            ]}
          />

          <LessonExercice
            description="En XAU/USD H4, tendencia alcista confirmada (precio por encima de la MM200 Daily en 4 320$). Un impulso alcista de 5 velas llevó el precio de 4 540$ a 4 660$, validado por un BOS por encima del HH anterior en 4 650$. La última vela bajista antes del impulso presenta un cuerpo entre 4 562$ (open) y 4 555$ (close), con mecha baja en 4 547$. Sin mitigation desde la formación (8 velas H4 transcurridas). El precio retrocede actualmente hacia la zona. Construye el plan completo y calcula dos variantes de R/R: variante naive (TP alejado) y variante realista (TP parcial intermedio)."
            steps={[
              "Delimitar el Order Block bullish: cuerpo de la vela opuesta entre 4 555$ y 4 562$, mecha baja en 4 547$. OB fresh (8 velas transcurridas), alineado Daily alcista, no mitigado.",
              "Colocar la entrada en 4 562$ (límite alto del cuerpo del OB) con espera de la señal de rechazo M15 (pin bar, engulfing bullish).",
              "Colocar el stop loss en 4 549$ (13$ debajo de la entrada, más allá de la mecha baja 4 547$ con margen 2$). Riesgo = 13$ por unidad.",
              "Variante naive. TP alejado en 4 720$ (proyección extensión completa del impulso inicial): Ganancia = 4 720 - 4 562 = 158$. R/R = 158 / 13 = 12,3. Ratio atractivo sobre el papel pero demasiado optimista: la probabilidad de alcanzar un objetivo a 12:1 sin pullback intermedio sigue siendo baja.",
              "Variante realista. TP parcial en 4 632$ (primer HH intermedio identificado, toma de profit parcial): Ganancia = 4 632 - 4 562 = 70$. R/R = 70 / 13 = 5,4. Objetivo estructural realista, alcanzable sin desvío. El R/R 5,4 sigue siendo excelente para un setup OB y permite asegurar la posición antes del HH anterior en 4 650$, donde el mercado arriesga producir una reacción técnica antes del TP final.",
            ]}
          />

          <LessonQuiz
            question="¿Qué elemento valida estructuralmente la calificación de una vela opuesta como Order Block tradable?"
            options={[
              "La vela opuesta debe tener un volumen elevado",
              "El impulso que sigue a la vela opuesta debe producir un BOS validado",
              "El OB debe formarse en zona de sobrecompra RSI",
              "La vela opuesta debe ser de color rojo",
            ]}
            correctIndex={1}
            explanation="Sin BOS validado tras la vela opuesta, el impulso queda hipotético y la vela opuesta es solo una variación local, no un Order Block explotable. La ruptura estructural (BOS) confirma que órdenes institucionales significativas fueron efectivamente colocadas en la zona y disparan el impulso que sigue."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "smc", "lecon3");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lección 3 del módulo SMC: Pensar institucional terminada.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <Link href="/strategies/smc/lecon2" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
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
