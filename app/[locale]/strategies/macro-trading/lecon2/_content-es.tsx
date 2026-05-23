"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { NFPHeadlineReactionDiagram } from "@/app/components/charts/NFPHeadlineReactionDiagram";
import { NFPStabilizationDiagram } from "@/app/components/charts/NFPStabilizationDiagram";
import { NFPReversalDiagram } from "@/app/components/charts/NFPReversalDiagram";

const LESSONS = [
  { id: "lecon1", title: "FOMC Fade", disabled: false },
  { id: "lecon2", title: "NFP Overreaction", disabled: false },
  { id: "lecon3", title: "Régimen Risk-off", disabled: false },
  { id: "lecon4", title: "Filtro macro pre-trade", disabled: false },
];

export default function ContentEs() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-trading", "lecon2"));
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
          <span className="text-zinc-500">Lección 2</span>
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
            NFP Overreaction: tradear la sobrerreacción al reporte de empleo US
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              El primer movimiento del NFP impresiona más de lo que informa realmente. El mercado reacciona al dato headline… luego reevalúa bruscamente el reporte unos minutos después.
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
            <div className="bg-zinc-900 border-l-4 border-amber-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « El dato NFP es apenas una línea del reporte. El mercado tarda unos minutos en leer todo el resto — y ahí es donde se juega el verdadero movimiento. »
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerrequisitos</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- NFP y calendario económico → ver módulo Macro</li>
              <li>- Consenso vs dato real → ver módulo Macro</li>
              <li>- Soportes, resistencias y liquidity → ver módulo Estrategias</li>
              <li>- Multi-timeframe → ver módulo Multi-timeframe Process</li>
            </ul>
          </div>

          {/* Bloc 3 — LE CHIFFRE HEADLINE PROVOQUE SOUVENT UNE SUR-RÉACTION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">El dato headline suele provocar una sobrerreacción</h2>

            <div className="my-8">
              <NFPHeadlineReactionDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              El NFP se publica cada primer viernes del mes y casi siempre dispara un impulso violento sobre el dólar y los activos sensibles — XAU/USD, EUR/USD, índices US. Pero esa primera reacción se construye sobre el dato headline (el número de empleos creados) en una fracción de segundo, mientras que el reporte completo contiene otros datos — salarios, tasa de desempleo, tasa de participación, revisiones de meses previos. El mercado reacciona primero al headline, luego integra bruscamente el resto del reporte unos minutos después. Esta doble fase es la firma misma del setup NFP Overreaction.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Ejemplo concreto</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                XAU/USD: precio previo al NFP 4 640 $. El dato cae por encima del consenso, headline interpretado hawkish. Primer impulso bearish hasta 4 575 $ en 5 minutos, rompiendo un soporte en 4 600 $. Luego el mercado digiere el detalle del reporte (salarios más débiles, revisiones bajistas), el precio se estabiliza alrededor de 4 580-4 585 $, después sube progresivamente hacia 4 625 $ en la hora siguiente.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Puntos accionables: el headline provoca una reacción instantánea, rara vez bien calibrada estructuralmente</li>
              <li>- La amplitud inicial puede superar largamente el nivel «lógico» del reporte completo</li>
              <li>- El mercado típicamente tarda de 15 a 60 minutos en digerir el reporte completo</li>
              <li>- Tradear en el primer impulso = tradear la lectura emocional del headline</li>
            </ul>
          </section>

          {/* Bloc 4 — LE RETOURNEMENT APPARAÎT APRÈS LA STABILISATION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">El cambio aparece después de la estabilización</h2>

            <div className="my-8">
              <NFPStabilizationDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              La ventana de ejecución del setup NFP se abre cuando el movimiento inicial deja de avanzar. Visualmente, esto se traduce en una SERIE de velas M15 con mechas repetidas en el sentido contrario del impulso — mechas inferiores si el impulso era bearish, mechas superiores si era bullish. El precio se comprime alrededor de un nivel, ya no logra hacer nuevos extremos. Es la huella visible de que los vendedores (o compradores) iniciales terminaron de actuar, y que la liquidity contraria empieza a absorber. Sin esa estabilización visible, el setup no está activado.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Ejemplo concreto</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                XAU/USD: tras la caída inicial NFP a 4 575 $, cuatro velas M15 consecutivas imprimen mechas inferiores de 6-8 $ cada una, sin cerrar por debajo. El precio se asienta entre 4 580-4 585 $. Una vez reconocida esa base, el mercado inicia una recuperación franca hacia 4 630 $ en la hora siguiente.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Puntos accionables: la estabilización se lee en el M15, no en timeframes más rápidos</li>
              <li>- Serie de mechas repetidas + pérdida de aceleración = señal de fin del impulso</li>
              <li>- Sin estabilización = sin setup, sin importar la amplitud inicial</li>
              <li>- La ejecución se toma después de la confirmación, nunca en anticipación</li>
            </ul>
          </section>

          {/* Bloc 5 — LE NFP PEUT PRODUIRE UN VRAI CHANGEMENT DE DIRECTION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">El NFP puede producir un verdadero cambio de dirección</h2>

            <div className="my-8">
              <NFPReversalDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              No todos los NFP producen un simple fade. Cuando la reevaluación post-estabilización se transforma en un movimiento franco, amplio y sostenido, el mercado realmente cambia de dirección — el reporte completo implica una lectura distinta del headline inicial, y los participantes institucionales se posicionan en sentido contrario. La señal distintiva: el retorno no se detiene en el nivel pre-NFP sino que lo supera claramente. Cuando aparece esta dinámica, el setup ya no es un fade táctico sino una oportunidad de tendencia corta/media.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Ejemplo concreto</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                XAU/USD: impulso inicial NFP de 4 640 $ hacia 4 575 $. Base alrededor de 4 580-4 585 $. Luego ruptura bullish por encima de 4 620 $, aceleración hasta 4 665 $ — más allá del nivel pre-NFP. El reporte completo (salarios sólidos, revisiones positivas) anulaba la interpretación hawkish del headline. El mercado revirtió completamente su sesgo.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Puntos accionables: la superación del nivel pre-NFP señala un verdadero cambio, no un simple fade</li>
              <li>- Una ruptura franca por encima (o debajo) del nivel pre-NFP cambia la naturaleza del setup</li>
              <li>- El cambio completo justifica un target más ambicioso que el fade táctico clásico</li>
              <li>- La distinción fade / cambio se confirma en los 30-60 minutos después de la estabilización</li>
            </ul>
          </section>

          {/* Bloc 6 — PLAN D'APPLICATION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan de aplicación: un NFP Overreaction completo en XAU/USD</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Esta es la secuencia completa de un trade NFP Overreaction, desde el contexto pre-NFP hasta la gestión del riesgo. Seis etapas, cada una con su rol.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Etapa 1 — Contexto H4 pre-NFP</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observación: XAU/USD se comprime entre 4 630 $ y 4 650 $ en las horas previas al NFP, volatilidad reducida</li>
                <li>- Conclusión: alta probabilidad de expansión sobre la publicación — se prepara el escenario de fade</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Etapa 2 — Publicación NFP</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observación: dato headline por encima del consenso, primer impulso bearish 4 640 → 4 575 $ en pocos minutos</li>
                <li>- Conclusión: reacción headline excesiva — se espera la estabilización, sin entrada inmediata</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Etapa 3 — Estabilización M15</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observación: el precio deja de hacer nuevos mínimos, cuatro velas M15 con mechas inferiores repetidas, precio asentado alrededor de 4 580-4 585 $</li>
                <li>- Conclusión: absorción compradora visible — la condición del setup está validada</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Etapa 4 — Confirmación de la reevaluación</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observación: primera vela de recuperación franca, el mercado empieza a imprimir máximos locales</li>
                <li>- Conclusión: la reevaluación está en marcha — se puede ejecutar el fade</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Etapa 5 — Ejecución del Fade</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Entrada long: 4 612 $</li>
                <li>- Stop loss: 4 568 $ (más allá del extremo del impulso)</li>
                <li>- Target: 4 655 $ (cerca del nivel pre-NFP)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Etapa 6 — Gestión del riesgo</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Volatilidad post-NFP superior a la normal → tamaño de posición prudente</li>
                <li>- Ejecución únicamente después de estabilización visible, nunca en el impulso</li>
                <li>- Si la estabilización no aparece en los 30 minutos: se pasa de turno</li>
              </ul>

              <div className="border-t border-zinc-800/60 pt-3 mt-3">
                <p className="text-sm text-zinc-300 italic text-center">
                  Headline = sobrerreacción · Estabilización = condición · Reevaluación = señal · Pre-NFP = target natural
                </p>
              </div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "El primer impulso NFP está impulsado por el dato headline — no por el reporte completo, que se digiere en 15-60 minutos.",
              "La señal explotable aparece después de la estabilización: mechas repetidas, pérdida de aceleración, precio asentado en una zona estrecha.",
              "El fade clásico apunta a un retorno parcial hacia el nivel pre-NFP; una superación franca señala un verdadero cambio de sesgo.",
              "Sin estabilización visible, sin entrada — la amplitud inicial no es por sí sola una señal de ejecución.",
            ]}
          />

          <LessonExercice
            description="En TradingView, identifica un NFP reciente en EUR/USD o XAU/USD y reconstruye a posteriori el setup NFP Overreaction."
            steps={[
              "Identifica el momento exacto de la publicación NFP: anota el precio justo antes, la amplitud del primer impulso y el nivel extremo alcanzado en los 5-10 minutos.",
              "Observa lo que ocurre en los 15-60 minutos siguientes: estabilización visible? mechas repetidas? ruptura del nivel pre-NFP en el sentido contrario? Anota el punto preciso donde la dinámica se invierte.",
              "Si hubo estabilización: reconstruye el setup fade (entrada, SL ajustado, target hacia el nivel pre-NFP). Si el retorno supera francamente el pre-NFP: anota el cambio completo. Si nada claro ocurre: anota por qué el setup no debería haberse tomado.",
            ]}
          />

          <LessonQuiz
            question="El NFP acaba de salir en XAU/USD: impulso bearish violento hacia 4 575 $, precio asentado alrededor de 4 580-4 585 $ desde hace 20 minutos con mechas inferiores repetidas. Qué haces?"
            options={[
              "Entras short suponiendo que la caída continuará",
              "Esperas una primera vela de recuperación franca y luego tomas el fade long",
              "Colocas una orden limit en 4 575 $ para comprar la mecha inferior exacta",
              "Ignoras el setup: la volatilidad post-NFP es demasiado peligrosa para tradear",
            ]}
            correctIndex={1}
            explanation="La secuencia NFP Overreaction es clara: impulso → estabilización → confirmación → ejecución. Aquí la estabilización es visible (mechas inferiores repetidas, precio asentado), pero la confirmación de la reevaluación aún no ha llegado. Se espera la primera vela de recuperación franca para validar que el mercado realmente ha basculado sobre la lectura completa del reporte. Sin esa confirmación, la entrada sería prematura — la estabilización puede durar más de lo previsto, o incluso ceder en el sentido inicial."
            answerExplanations={[
              "Falso. Entrar short después de la estabilización es tradear en el sentido del impulso emocional inicial, justo cuando el mercado señala que terminó de bajar. Es el contrapié del setup NFP Overreaction.",
              "Correcto. La secuencia exige estabilización Y LUEGO confirmación. La primera vela de recuperación franca valida la reevaluación y abre la ventana de ejecución del fade. Sin esa confirmación, se espera — la estabilización puede ser más larga, o prolongarse en lateralización.",
              "Falso. Una orden limit en el extremo del movimiento inicial parte del principio de que se conoce el límite — cuando puede ser testeado más abajo o no. E incluso si el precio vuelve allí, la entrada se haría sin confirmación estructural.",
              "Falso. La volatilidad post-NFP es precisamente lo que hace interesante este setup — es ella la que crea la amplitud explotada por el fade. La disciplina (esperar estabilización + confirmación) basta para gestionar el riesgo sin renunciar al setup.",
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
                  markLessonComplete(p, "macro-trading", "lecon2");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lección 2 del módulo Macro Trading completada.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between gap-4">
              <Link href="/strategies/macro-trading/lecon1" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lección anterior
              </Link>
              <Link href="/strategies/macro-trading/lecon3" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
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
