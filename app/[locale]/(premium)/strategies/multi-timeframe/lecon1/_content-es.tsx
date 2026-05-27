"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { SingleTimeframeTrapDiagram } from "@/app/components/charts/SingleTimeframeTrapDiagram";
import { HTFBiasDiagram } from "@/app/components/charts/HTFBiasDiagram";
import { IntermediateZoneDiagram } from "@/app/components/charts/IntermediateZoneDiagram";
import { LTFExecutionDiagram } from "@/app/components/charts/LTFExecutionDiagram";

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
    setDone(isLessonComplete(getStoredProgress(), "multi-timeframe", "lecon1"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Estrategias</Link>
          <span>/</span>
          <Link href="/strategies/multi-timeframe" className="hover:text-zinc-400 transition-colors">Multi-timeframe Process</Link>
          <span>/</span>
          <span className="text-zinc-500">Lección 1</span>
        </nav>

        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Intermedio
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
            Por qué analizar en multi-timeframe
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Esta lección establece la lógica del multi-timeframe: por qué operar un solo gráfico te deja ciego, y el rol concreto de cada nivel, el timeframe superior da el sesgo, el timeframe intermedio localiza la zona, el timeframe de ejecución dispara la entrada.
            </p>
          </div>

          {/* Indicateur de structure */}
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

          {/* Pills des leçons */}
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
            <span className="ml-auto text-xs text-zinc-600">1 / 5 lecciones</span>
          </div>
        </header>

        {/* ── Contenu ── */}
        <div className="space-y-8">

          {/* Bloc 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-blue-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « Un setup perfecto en M15 puede convertirse en una trampa completa si el Daily cuenta la historia inversa. »
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerrequisitos</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Tendencias y lectura de gráfico → ver Formaciones Trading</li>
              <li>- Estructura de mercado, BOS y CHoCH → ver módulo SMC, Lección 2</li>
              <li>- Soportes, resistencias y zonas clave → ver módulo Soporte/Resistencia</li>
            </ul>
          </div>

          {/* Bloc 3 — LE PIÈGE DU GRAPHIQUE UNIQUE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">La trampa del gráfico único</h2>

            <div className="my-8">
              <SingleTimeframeTrapDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Un solo timeframe muestra apenas una parte del mercado, nunca el conjunto. Un gráfico M15 puede mostrar un rebote limpio mientras el Daily sigue en una tendencia bajista pesada. El resultado: una « compra obvia » en el timeframe pequeño se transforma en simple retroceso antes de la reanudación bajista.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Ejemplo concreto</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD: el Daily muestra una estructura bajista en LH/LL, con una resistencia mayor alrededor de 1.1820. En M15, un breakout alcista local se forma cerca de 1.1760. El precio sube hasta 1.1775, luego cae de nuevo hacia 1.1700. La señal M15 era técnicamente válida; el problema venía del contexto HTF.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Siempre verifica el sentido del HTF antes de entrar</li>
              <li>- Una señal LTF contra el HTF = probabilidad reducida</li>
              <li>- El timeframe pequeño muestra a menudo un retroceso, no un giro</li>
              <li>- El contexto HTF prima sobre la señal local</li>
            </ul>
          </section>

          {/* Bloc 4 — HTF : TROUVER LE BIAIS */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">El timeframe superior: encontrar el sesgo</h2>

            <div className="my-8">
              <HTFBiasDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              El HTF responde a una sola pregunta: ¿en qué sentido tiene el mercado estadísticamente más probabilidades de continuar? No sirve para entrar, sirve para filtrar los malos trades antes incluso de buscar un setup.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-white font-semibold text-sm mb-2">Lo que hay que mirar</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Estructura del mercado: HH/HL o LH/LL</li>
                  <li>- Zonas Daily y H4 importantes</li>
                  <li>- Dirección de las impulsiones dominantes</li>
                  <li>- Liquidity HTF visible</li>
                </ul>
              </div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-white font-semibold text-sm mb-2">Lo que hay que concluir</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Sesgo alcista = prioridad a las compras</li>
                  <li>- Sesgo bajista = prioridad a las ventas</li>
                  <li>- Zona HTF cercana = prudencia</li>
                  <li>- Mercado sin estructura clara = evitar los setups agresivos</li>
                </ul>
              </div>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Empieza siempre por el HTF</li>
              <li>- Identifica una dirección antes de buscar una entrada</li>
              <li>- Ignora las señales opuestas al sesgo principal</li>
              <li>- Anota las zonas HTF antes de bajar de timeframe</li>
            </ul>
          </section>

          {/* Bloc 5 — TIMEFRAME INTERMÉDIAIRE : ZONE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">El timeframe intermedio: encontrar la zona</h2>

            <div className="my-8">
              <IntermediateZoneDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              El timeframe intermedio localiza la zona donde el mercado puede reaccionar. Es el nivel que transforma una idea general del HTF en un escenario explotable. El HTF dice « vender »; el timeframe intermedio dice « dónde ».
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-white font-semibold text-sm mb-2">Lo que hay que buscar</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Soporte / resistencia H1 o H4</li>
                  <li>- Order Block o FVG</li>
                  <li>- Zona de liquidity</li>
                  <li>- Retest después de una impulsión</li>
                </ul>
              </div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-white font-semibold text-sm mb-2">Lo que hay que hacer</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Espera el regreso del precio a la zona</li>
                  <li>- Prepara el escenario antes de la entrada</li>
                  <li>- Evita las entradas « en medio del vacío »</li>
                </ul>
              </div>
            </div>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Ejemplo concreto</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD: el HTF es bajista. En H1, una zona de resistencia se dibuja entre 1.1765 y 1.1780. El precio regresa, entonces se vigila una señal vendedora en el LTF.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Opera desde zonas precisas</li>
              <li>- Espera el regreso del precio a la zona</li>
              <li>- Prepara el escenario antes del disparo</li>
              <li>- Una zona HTF + H1 alineada = reacción más limpia</li>
            </ul>
          </section>

          {/* Bloc 6 — LTF : EXÉCUTION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">El timeframe de ejecución: disparar el trade</h2>

            <div className="my-8">
              <LTFExecutionDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              El LTF sirve únicamente para ejecutar. Es el timeframe del timing, no el del sesgo. Su rol es mostrar que el mercado reacciona realmente en la zona preparada en los timeframes superiores.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-white font-semibold text-sm mb-2">Lo que hay que buscar</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- CHoCH o BOS local</li>
                  <li>- Rechazo violento</li>
                  <li>- Sweep de liquidity</li>
                  <li>- Vela impulsiva de salida de zona</li>
                </ul>
              </div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-white font-semibold text-sm mb-2">Lo que hay que hacer</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Entra después de la confirmación</li>
                  <li>- Coloca el SL detrás de la estructura local</li>
                  <li>- Ejecuta en el sentido del HTF</li>
                </ul>
              </div>
            </div>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Ejemplo concreto</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD: la zona H1 está en 1.1765-1.1780. En M15, un sweep alcista busca la liquidity hasta 1.1778. Un CHoCH bajista se forma en M5. La entrada short se dispara después del rechazo.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- El LTF sirve para el timing, no para el contexto</li>
              <li>- Espera una reacción clara en la zona</li>
              <li>- Evita las entradas anticipadas</li>
              <li>- Ejecuta solo en el sentido preparado por el HTF</li>
            </ul>
          </section>

          {/* Bloc 7 — PROCESS COMPLET (sans SVG) */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">El proceso completo: un trade EUR/USD paso a paso</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Encadenados, los tres niveles forman un embudo: el contexto reduce las posibilidades, luego el timing afina la ejecución. Aquí tienes la secuencia completa sobre un caso EUR/USD.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Paso 1. HTF (H4)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observación: estructura bajista en LH/LL, resistencia importante en 1.1780, precio actual en 1.1725</li>
                <li>- Conclusión: prioridad a las ventas, ninguna compra agresiva buscada</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Paso 2. Timeframe intermedio (H1)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observación: zona de resistencia entre 1.1765 y 1.1780, antiguo soporte vuelto resistencia, rechazo ya observado</li>
                <li>- Conclusión: zona ideal para esperar una reacción bajista</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Paso 3. LTF (M5 / M15)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observación: sweep alcista hasta 1.1778, CHoCH bajista en M5, vela impulsiva de rechazo</li>
                <li>- Conclusión: confirmación vendedora válida, entrada short posible después del breakout local</li>
              </ul>

              <div className="border-t border-zinc-800/60 pt-3 mt-3">
                <p className="text-sm text-zinc-300 italic text-center">
                  HTF = dirección · Timeframe intermedio = zona · LTF = timing
                </p>
              </div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "Un solo timeframe da una visión incompleta del mercado.",
              "El HTF define el sesgo principal, la dirección del trade.",
              "El timeframe intermedio localiza la zona de interés donde actuar.",
              "El LTF sirve únicamente para el disparo: da el timing, no el sesgo.",
            ]}
          />

          <LessonExercice
            description="Abre EUR/USD en TradingView y recorre el proceso multi-timeframe por ti mismo, del timeframe grande al pequeño. El objetivo: ver concretamente lo que cada nivel aporta a la decisión."
            steps={[
              "En H4, identifica la estructura dominante (HH/HL o LH/LL), el último swing mayor, y una zona importante.",
              "Baja a H1: localiza una zona donde el precio podría reaccionar en el sentido del sesgo H4, y trázala.",
              "Termina en M5 o M15: espera un disparador en la zona (rechazo, CHoCH o sweep) y anota precisamente lo que validaría una entrada.",
              "Compara: ¿qué te decía el H4 que el M5 no mostraba? ¿Qué precisa el M5 que el H4 no podía dar?",
            ]}
          />

          <LessonQuiz
            question="¿Cuál es el rol principal del timeframe de ejecución (LTF) en un proceso multi-timeframe?"
            options={[
              "Determinar el sesgo principal del mercado",
              "Identificar las zonas Daily mayores",
              "Dar el timing preciso de la entrada",
              "Reemplazar completamente el análisis HTF",
            ]}
            correctIndex={2}
            explanation="El LTF sirve para confirmar la ejecución en una zona ya preparada por los timeframes superiores. El sesgo viene del HTF, la zona viene del timeframe intermedio; el LTF interviene solo para afinar el timing y reducir el risk. Complementa el análisis HTF, nunca lo reemplaza."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "multi-timeframe", "lecon1");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lección 1 del módulo Multi-timeframe Process completada.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between gap-4">
              <Link href="/strategies/multi-timeframe" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Módulo Multi-timeframe. Vista general
              </Link>
              <Link href="/strategies/multi-timeframe/lecon2" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
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
