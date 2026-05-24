"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { ConfirmationM5Diagram } from "@/app/components/charts/ConfirmationM5Diagram";
import { RiskAffineDiagram } from "@/app/components/charts/RiskAffineDiagram";
import { ZoneEchecDiagram } from "@/app/components/charts/ZoneEchecDiagram";

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
    setDone(isLessonComplete(getStoredProgress(), "multi-timeframe", "lecon4"));
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
          <span className="text-zinc-500">Lección 4</span>
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
            El timeframe de ejecución: esperar la confirmación
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Una buena zona no basta. El mercado debe mostrar que reacciona realmente antes de la entrada.
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
            <span className="ml-auto text-xs text-zinc-600">4 / 5 lecciones</span>
          </div>
        </header>

        <div className="space-y-8">

          {/* Bloc 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-blue-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « El LTF no predice el mercado. Confirma que el mercado reacciona. »
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerrequisitos</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Dirección dominante HTF → ver Lección 2</li>
              <li>- Zonas de interés H1-H4 → ver Lección 3</li>
              <li>- Estructura de mercado, BOS, CHoCH → ver módulo SMC</li>
            </ul>
          </div>

          {/* Bloc 3 — LE LTF SERT À VALIDER LA RÉACTION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">El LTF sirve para validar la reacción</h2>

            <div className="my-8">
              <ConfirmationM5Diagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              El timeframe de ejecución (M1/M5/M15) es el timeframe del timing, no el del análisis. Su rol es confirmar que el mercado reacciona físicamente en la zona preparada en el nivel superior. Una reacción nítida dispara la entrada; ninguna reacción = no hay trade. El LTF no predice nada, verifica.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Ejemplo concreto</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD: la zona H1 está entre 1.1750 y 1.1760. En M5, el precio llega a la banda, imprime tres mechas altas consecutivas por encima de 1.1755, luego una impulsión bajista rompe el último mínimo local en 1.1748. La reacción es visible, el breakout estructural confirma, la señal de entrada es válida.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Espera una reacción visible en la zona, no una simple presencia del precio</li>
              <li>- Mechas de rechazo, breakout de mínimo local, BOS bearish = señales LTF</li>
              <li>- Ninguna reacción = ninguna entrada, la paciencia prima</li>
              <li>- El LTF no predice, confirma</li>
            </ul>
          </section>

          {/* Bloc 4 — LE LTF SERT À AFFINER LE RISQUE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">El LTF sirve para afinar el risk</h2>

            <div className="my-8">
              <RiskAffineDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              El LTF no sirve solo para confirmar: también permite reducir la distancia entre la entrada y el Stop Loss. La misma idea se juega con dos dimensiones de risk muy diferentes según se entre desde el HTF o después de la confirmación local. El SL queda calado en una estructura que invalida el escenario, pero esa estructura es más ajustada en el LTF.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Ejemplo concreto</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD: entrada short en 1.1758 debajo de la zona. Sin confirmación LTF, el SL debe cubrir la totalidad de la zona H4, colocado en 1.1790, o sea 35 pts de risk. Con confirmación M5, el SL pasa justo por encima del último máximo local de rechazo, colocado en 1.1772, o sea 14 pts. Misma idea de trade, mismo objetivo, pero la distancia entrada-SL se divide entre 2,5.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- El SL ajustado exige una estructura local clara (máximo de rechazo, mecha)</li>
              <li>- Distancia entrada-SL reducida = mejor R/R sobre el mismo objetivo</li>
              <li>- El SL nunca se coloca arbitrariamente, invalida una estructura</li>
              <li>- Risk medido en pts/pips, independientemente del tamaño de posición (ver Lección 8 Principiante)</li>
            </ul>
          </section>

          {/* Bloc 5 — UNE ZONE PEUT ÉCHOUER */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Una zona puede fallar</h2>

            <div className="my-8">
              <ZoneEchecDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              No todas las zonas reaccionan. Una zona fuerte sobre el papel puede ser atravesada sin ninguna señal, el mercado no se detiene en ella, no produce ninguna mecha de rechazo, ningún breakout local a favor del escenario. El LTF protege entonces el capital: sin reacción = sin entrada. La paciencia permite esperar la siguiente zona en lugar de forzar un trade.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Ejemplo concreto</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                XAU/USD: soporte H1 esperado en 4 545 $. En M5, el precio llega y atraviesa la banda sin ninguna mecha baja de rechazo, en una secuencia bajista clara. La continuación se prolonga netamente por debajo de la zona, sin rebote ni signo de recuperación. No se emite ninguna señal de entrada, el setup queda invalidado.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Una zona puede ser atravesada sin reacción, es esperable</li>
              <li>- La ausencia de reacción es en sí una señal, no entres</li>
              <li>- Mantén la paciencia: la siguiente zona o un regreso puede dar una mejor señal</li>
              <li>- Opera sobre confirmación, nunca sobre predicción</li>
            </ul>
          </section>

          {/* Bloc 6 — PLAN D'APPLICATION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan de aplicación: un caso EUR/USD completo</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Aquí tienes la secuencia completa Daily → H1 → M5 sobre un caso EUR/USD. El objetivo es recorrer los tres niveles encadenados y materializar el rol distinto de cada uno.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Paso 1. HTF (Daily / H4)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observación: sesgo bajista en LH/LL, resistencia Daily 1.1780, precio actual 1.1715</li>
                <li>- Conclusión: dirección dominante bajista, ventas prioritarias</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Paso 2. Timeframe intermedio (H1)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observación: zona confluente 1.1750-1.1760 (antiguo soporte roto + FVG bearish no mitigado)</li>
                <li>- Conclusión: prepara un escenario short al regreso del precio a la zona</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Paso 3. LTF (M5)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observación: precio en la zona, tres mechas altas de rechazo consecutivas, breakout del mínimo local en 1.1748</li>
                <li>- Conclusión: confirmación válida, entrada short en 1.1758, SL ajustado justo por encima del último máximo de rechazo (1.1772, 14 pts)</li>
              </ul>

              <div className="border-t border-zinc-800/60 pt-3 mt-3">
                <p className="text-sm text-zinc-300 italic text-center">
                  HTF = dirección · Timeframe intermedio = zona · LTF = timing + risk reducido
                </p>
              </div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "El LTF no sirve para analizar, sirve para confirmar que la zona reacciona.",
              "Una reacción visible (mecha de rechazo, breakout de estructura local) dispara la entrada.",
              "El LTF también permite reducir el risk mediante un SL ajustado sobre la estructura local.",
              "Ninguna reacción = ninguna entrada, proteger el capital prima sobre la necesidad de operar.",
            ]}
          />

          <LessonExercice
            description="Abre EUR/USD en TradingView y entrénate a esperar la confirmación LTF antes de toda entrada."
            steps={[
              "Traza una zona de interés en H1 (ver Lección 3) y espera que el precio regrese.",
              "Cuando el precio toque la zona, baja a M5. Busca un rechazo (mecha), un breakout de estructura local (BOS) o una acumulación de señales en el sentido del sesgo HTF.",
              "Si la reacción es nítida: anota el punto de entrada y el SL ajustado, calado en la estructura local. Si no aparece ninguna reacción: quédate al margen, toma nota del paso y pasa a la siguiente zona.",
            ]}
          />

          <LessonQuiz
            question="El precio llega a una zona HTF preparada. En M5, ninguna mecha de rechazo, ningún breakout de estructura local, solo un paso franco. ¿Qué haces?"
            options={[
              "Entras igual: la zona HTF es sólida, el LTF solo tiene un rol secundario",
              "Entras con un SL muy amplio para absorber la fluctuación",
              "No entras: sin reacción LTF, el setup queda invalidado",
              "Tomas el otro lado, asumiendo un giro",
            ]}
            correctIndex={2}
            explanation="El rol del LTF es CONFIRMAR la reacción del mercado en la zona. Si la zona es atravesada sin ninguna señal de rechazo o breakout estructural, el escenario queda invalidado. La ausencia de reacción es en sí una señal, la paciencia permite esperar la próxima oportunidad en lugar de entrar a ciegas."
            answerExplanations={[
              "Falso. El LTF no es accesorio, es la condición misma de la entrada. Una zona que no reacciona no es explotable, sin importar su calidad HTF.",
              "Falso. Ampliar el SL para 'absorber el risk' no corrige el problema de fondo: sin reacción LTF, nada indica que el escenario vaya a activarse. Es solo una apuesta más cara.",
              "Correcto. Sin señal LTF (mecha de rechazo, BOS, breakout de mínimo local), el setup no está confirmado. La regla es clara: ninguna reacción = ninguna entrada. El capital queda protegido.",
              "Falso. Tomar el otro lado en el simple paso por una zona, sin contexto HTF favorable ni señal de giro estructural, es operar contra la tendencia dominante sin ninguna base.",
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
                  markLessonComplete(p, "multi-timeframe", "lecon4");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lección 4 del módulo Multi-timeframe Process completada.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between gap-4">
              <Link href="/strategies/multi-timeframe/lecon3" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lección anterior
              </Link>
              <Link href="/strategies/multi-timeframe/lecon5" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
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
