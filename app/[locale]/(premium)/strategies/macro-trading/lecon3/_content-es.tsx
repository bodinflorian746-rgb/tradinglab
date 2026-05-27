"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { RiskoffSignalsDiagram } from "@/app/components/charts/RiskoffSignalsDiagram";
import { RiskoffTrendDiagram } from "@/app/components/charts/RiskoffTrendDiagram";
import { RiskoffExhaustionDiagram } from "@/app/components/charts/RiskoffExhaustionDiagram";

const LESSONS = [
  { id: "lecon1", title: "FOMC Fade", disabled: false },
  { id: "lecon2", title: "NFP Overreaction", disabled: false },
  { id: "lecon3", title: "Régimen Risk-off", disabled: false },
  { id: "lecon4", title: "Filtro macro pre-trade", disabled: false },
];

export default function ContentEs() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-trading", "lecon3"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Estrategias</Link>
          <span>/</span>
          <Link href="/strategies/macro-trading" className="hover:text-zinc-400 transition-colors">Macro Trading</Link>
          <span>/</span>
          <span className="text-zinc-500">Lección 3</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">
              Avanzado
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
            Régimen Risk-off: tradear cuando el mercado huye del riesgo
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              El mercado no cambia de régimen en una sola vela. El risk-off se instala progresivamente y luego influye de forma duradera en la dirección dominante de los activos refugio (safe-haven).
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
            <div className="bg-zinc-900 border-l-4 border-amber-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « Un régimen no se tradea como una señal. Es un contexto que dura, se lo identifica, se lo respeta, se lo explota mientras se sostenga. »
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerrequisitos</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Risk-on / risk-off → ver módulo Macro</li>
              <li>- Correlaciones macro y activos safe-haven → ver módulo Macro</li>
              <li>- Estructuras de mercado y tendencias → ver módulo Estrategias</li>
              <li>- Multi-timeframe → ver módulo Multi-timeframe Process</li>
            </ul>
          </div>

          {/* Bloc 3 — LE RISK-OFF SE CONFIRME PAR DES SIGNAUX CONCORDANTS */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">El risk-off se confirma con señales concordantes</h2>

            <div className="my-8">
              <RiskoffSignalsDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              El régimen risk-off nunca se deduce de un solo mercado. Se instala cuando varios indicadores cuentan simultáneamente la misma historia: los índices accionarios bajan, la volatilidad (VIX) sube, el dólar se fortalece frente a las divisas más riesgosas, el oro y el franco suizo atraen los flujos. Cuando estas cuatro señales apuntan en el mismo sentido durante varias sesiones, ya no estamos en un movimiento aislado, estamos en un cambio de régimen. Es esa concordancia la que permite tener confianza en la dirección de los activos safe-haven.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Ejemplo concreto</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                En una semana de tensiones geopolíticas, el S&amp;P 500 baja 3 %, el VIX pasa de 14 a 22, el DXY sube 1,5 % y XAU/USD pasa progresivamente de 4 585 $ a 4 705 $ en estructura alcista. Los cuatro mercados convergen, el régimen risk-off está instalado, el oro es el activo direccional a priorizar en sentido long mientras la concordancia se mantenga.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Puntos accionables: la concordancia de 3-4 señales macro confirma el régimen, no una sola</li>
              <li>- Índices bajistas + VIX alcista + Dólar fuerte + oro fuerte = firma risk-off clásica</li>
              <li>- Sin concordancia, no hablamos todavía de régimen, solo de un movimiento</li>
              <li>- La lectura macro precede a la lectura técnica sobre los activos safe-haven</li>
            </ul>
          </section>

          {/* Bloc 4 — TRADER DANS LE SENS DU RÉGIME, PAS CONTRE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Tradear en el sentido del régimen, no en contra</h2>

            <div className="my-8">
              <RiskoffTrendDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Una vez identificado el régimen, la disciplina operacional es simple: se tradea en su sentido, nunca en contra. Esto significa privilegiar exclusivamente los longs sobre el oro y los shorts sobre los pares riesgosos mientras la estructura macro siga coherente. Los pullbacks H4 se vuelven entonces oportunidades de entrada, se espera que el precio se reajuste sobre un soporte técnico, que se estabilice, y se entra para aprovechar la continuación. Contratradear un régimen establecido es luchar contra la dirección de fondo, estadísticamente perdedor.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Ejemplo concreto</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                XAU/USD H4 en régimen risk-off establecido: impulso alcista de 4 610 $ a 4 690 $, luego pullback controlado hacia 4 655 $ sobre un antiguo soporte. Estabilización, luego nuevo impulso bullish hasta 4 730 $. Entrada long en el retest de 4 655 $ con SL bajo el pullback, target en la zona de continuación 4 730 $. La estructura HH/HL respeta el régimen.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Puntos accionables: longs prioritarios sobre el oro en régimen risk-off, nunca al revés</li>
              <li>- Los pullbacks son entradas, no cambios a anticipar</li>
              <li>- Estructura HH/HL intacta = régimen intacto = continuación probable</li>
              <li>- Contratradear un régimen establecido = ir contra la estadística</li>
            </ul>
          </section>

          {/* Bloc 5 — LE RISK-OFF S'ESSOUFFLE PROGRESSIVEMENT */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">El risk-off se agota progresivamente</h2>

            <div className="my-8">
              <RiskoffExhaustionDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Ningún régimen dura indefinidamente. El agotamiento de un risk-off se lee progresivamente: máximos cada vez más débiles en los activos safe-haven (cada nuevo high es menos alto que el anterior), correcciones H4 más profundas que en la fase de instalación, impulsos bullish que pierden amplitud. Las señales macro acompañan esta desaceleración: el VIX baja, los índices se estabilizan, el dólar deja de subir. Cuando aparecen estas señales, se reduce progresivamente la exposición a los longs sobre el oro, no se espera la ruptura estructural.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Ejemplo concreto</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                XAU/USD H4: tras una fuerte tendencia alcista desde 4 590 $, tres máximos sucesivos se debilitan, 4 735 $, luego 4 720 $, luego 4 705 $. Las correcciones pasan de 25 $ a 40 $ y luego 65 $ de amplitud. Los impulsos alcistas se vuelven más cortos. El régimen aún no está roto, pero pierde fuerza, se ajustan los SL, se reduce el tamaño de posición, se prepara la transición.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Puntos accionables: máximos más débiles + correcciones más profundas = señal de agotamiento</li>
              <li>- El VIX bajando confirma la desaceleración macro</li>
              <li>- Se reduce la exposición ANTES de la ruptura estructural, no después</li>
              <li>- El agotamiento no es un cambio, es una transición a vigilar</li>
            </ul>
          </section>

          {/* Bloc 6 — PLAN D'APPLICATION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan de aplicación: un trade en régimen risk-off en XAU/USD</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Esta es la secuencia completa de un trade alineado con un régimen risk-off, desde el diagnóstico macro hasta la gestión. Cinco etapas, cada una con su rol.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Etapa 1. Diagnóstico macro</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observación: S&amp;P 500 bajando desde hace 3 sesiones, VIX por encima de 20, DXY alcista, XAU alcista</li>
                <li>- Conclusión: régimen risk-off confirmado por concordancia, sesgo long únicamente sobre el oro</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Etapa 2. Contexto técnico H4</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observación: XAU/USD en estructura HH/HL clara desde el inicio del régimen, precio actual 4 690 $</li>
                <li>- Conclusión: estructura intacta, se busca el próximo pullback para entrar long</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Etapa 3. Espera del pullback</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observación: corrección H4 hacia 4 655 $ (antiguo máximo convertido en soporte), estabilización visible con mechas inferiores en M15</li>
                <li>- Conclusión: zona de entrada preparada, se espera la primera vela de recuperación franca</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Etapa 4. Ejecución</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Entrada long: 4 660 $</li>
                <li>- Stop loss: 4 640 $ (bajo el pullback)</li>
                <li>- Target: 4 730 $ (zona de continuación)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Etapa 5. Seguimiento del régimen</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Vigilar la concordancia de las señales macro mientras la posición esté abierta</li>
                <li>- Si el VIX baja con fuerza O si los índices se estabilizan: alerta de agotamiento</li>
                <li>- Si la estructura HH/HL se rompe: salida inmediata, el régimen ya no es válido</li>
              </ul>

              <div className="border-t border-zinc-800/60 pt-3 mt-3">
                <p className="text-sm text-zinc-300 italic text-center">
                  Macro = régimen · Estructura = dirección · Pullback = entrada · Concordancia = condición de mantenimiento
                </p>
              </div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "Un régimen risk-off se confirma por CONCORDANCIA de varias señales macro, nunca por un solo mercado.",
              "Mientras la estructura HH/HL se mantenga en los activos safe-haven, se tradea en el sentido del régimen y se evita todo contra-trade.",
              "Los pullbacks H4 son oportunidades de entrada, no cambios a anticipar.",
              "El agotamiento se lee progresivamente: máximos más débiles, correcciones más profundas, VIX que baja.",
            ]}
          />

          <LessonExercice
            description="Identifica un régimen risk-off reciente en el mercado y reconstruye a posteriori el diagnóstico + un setup alineado."
            steps={[
              "Identifica una semana donde el VIX haya subido claramente. Verifica en la misma ventana la dirección de los índices US, del DXY y de XAU/USD. Anota la duración durante la cual la concordancia se mantuvo.",
              "En XAU/USD H4 durante ese período: traza la estructura HH/HL. Identifica los pullbacks H4 y marca las zonas donde una entrada long habría sido coherente con el régimen.",
              "Vigila la transición: en qué momento los máximos empezaron a debilitarse, las correcciones a profundizarse? Anota esa señal de agotamiento y cuánto tiempo se expresó antes de que la estructura realmente se rompiera.",
            ]}
          />

          <LessonQuiz
            question="Observas un régimen risk-off bien instalado en XAU/USD con estructura HH/HL clara en H4. El precio inicia un pullback de 30 $ hacia un antiguo máximo convertido en soporte. Qué haces?"
            options={[
              "Entras short en el pullback para aprovechar la corrección",
              "Esperas la estabilización en el soporte y luego entras long para aprovechar la continuación",
              "Cierras tu posición long existente: el régimen probablemente terminó",
              "No intervienes mientras el precio no haya roto el máximo anterior",
            ]}
            correctIndex={1}
            explanation="En un régimen risk-off establecido con estructura HH/HL intacta, un pullback H4 hacia un antiguo soporte es precisamente la oportunidad de entrada recomendada. Se deja al precio estabilizarse en el nivel técnico, se busca la primera vela de recuperación franca, y se entra en el sentido del régimen. Tradear contra la dirección de fondo (entrar short en el pullback) o anticipar el fin del régimen sin señal de agotamiento, es luchar contra la lógica macro que conduce el movimiento."
            answerExplanations={[
              "Falso. Entrar short en un régimen risk-off establecido es tradear contra el contexto macro que sostiene el oro. El pullback es una corrección técnica, no un cambio, la estadística favorece la continuación.",
              "Correcto. La disciplina del régimen es clara: se entra en su sentido sobre los pullbacks. El soporte técnico ofrece una entrada ajustada, la concordancia macro respalda el trade, la estructura HH/HL valida la continuación probable.",
              "Falso. Cerrar una posición long en un pullback de 30 $, sin señal de agotamiento (máximos debilitándose, correcciones más profundas, VIX que baja), es salir prematuramente. Los pullbacks forman parte de una tendencia sana.",
              "Falso. Esperar la ruptura del máximo anterior para entrar es entrar demasiado tarde, por encima del último high, sin soporte técnico para asentar el SL. Las mejores entradas en régimen son sobre pullback, no sobre breakout.",
            ]}
          />

        </div>

        {/* Footer */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "macro-trading", "lecon3");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lección 3 del módulo Macro Trading completada.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between gap-4">
              <Link href="/strategies/macro-trading/lecon2" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lección anterior
              </Link>
              <Link href="/strategies/macro-trading/lecon4" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
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
