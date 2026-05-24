"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { PDArrayContextDiagram } from "@/app/components/charts/PDArrayContextDiagram";
import { FVGMitigationDiagram } from "@/app/components/charts/FVGMitigationDiagram";
import { FVGMitigationScenariosDiagram } from "@/app/components/charts/FVGMitigationScenariosDiagram";
import { PDArrayConfluenceDiagram } from "@/app/components/charts/PDArrayConfluenceDiagram";

const LESSONS = [
  { id: "lecon1", title: "Liquidity y manipulación", disabled: false },
  { id: "lecon2", title: "PD Arrays", disabled: false },
  { id: "lecon3", title: "Killzones", disabled: false },
  { id: "lecon4", title: "Displacement", disabled: false },
  { id: "lecon5", title: "Modelo ICT completo", disabled: false },
];

export default function ContentEs() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "ict", "lecon2"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Estrategias</Link>
          <span>/</span>
          <Link href="/strategies/ict" className="hover:text-zinc-400 transition-colors">ICT completo</Link>
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
            PD Arrays: identificar las zonas donde el mercado puede reaccionar
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              El mercado no reacciona en cualquier lugar. Ciertas zonas concentran naturalmente más reacciones, rechazos y desplazamientos.
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
            <span className="ml-auto text-xs text-zinc-600">2 / 5 lecciones</span>
          </div>
        </header>

        <div className="space-y-8">

          {/* Bloque 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-amber-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « El mercado no se detiene en cualquier lugar. Se detiene donde tiene una razón estructural para hacerlo. »
              </p>
            </div>
          </section>

          {/* Bloque 2 — PRERREQUISITOS + INTRO */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerrequisitos</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Liquidity y manipulación → ver módulo ICT, Lección 1</li>
              <li>- FVG y Order Blocks → ver módulo SMC, lecciones « Order Blocks: identificar las zonas institucionales » y « FVG y liquidity: tradear el desequilibrio institucional »</li>
              <li>- Multi-timeframe → ver módulo Multi-timeframe Process</li>
            </ul>
          </div>

          <section>
            <p className="text-zinc-300 leading-relaxed text-sm">
              Después de la toma de liquidity vista en la Lección 1, el segundo ladrillo del modelo ICT consiste en saber DÓNDE el mercado puede reaccionar. PD Array significa Premium/Discount Array: son las zonas de precio donde el mercado institucional tiene estadísticamente más chances de reaccionar. FVG, Order Blocks, antiguos soportes/resistencias, sweeps recientes, estos elementos son los ladrillos elementales de un PD Array. Bien leídos, permiten anticipar dónde una zona probablemente producirá un rechazo; mal leídos, inundan el gráfico con una infinidad de niveles de los cuales ninguno aguanta.
            </p>
          </section>

          {/* Bloque 3 — TODOS LOS FVG Y OB NO SON IGUALES */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Todos los FVG y OB no son iguales</h2>

            <div className="my-8">
              <PDArrayContextDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              En cualquier gráfico, se pueden encontrar decenas de FVG y Order Blocks. La mayoría no producirá nada, el precio pasará a través sin siquiera frenar. La selección se hace por el CONTEXTO: un FVG creado por un impulso justo después de un sweep de liquidity es muy diferente de un FVG dejado por una vela aleatoria en medio de un range. El primero lleva la intención institucional que acaba de tomar la liquidity; el segundo es solo un hueco estadístico sin significado estructural.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Ejemplo concreto</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD H1: resistencia H4 en 1.1780, dos equal highs visibles. Una vela hace sweep en 1.1792 y toma la liquidity de arriba, luego una gran vela bajista crea un FVG entre 1.1758 y 1.1770. Ese FVG está calificado: nació justo después de la toma de liquidity, en un impulso claro. Cuando el precio regrese a esa zona, la probabilidad de rechazo es alta, no porque sea « un FVG », sino porque es un FVG en un contexto estructural coherente.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Un FVG o un OB solo, fuera de contexto, no tiene ningún valor predictivo</li>
              <li>- El contexto = lo que pasó justo antes (sweep, BOS, CHoCH)</li>
              <li>- Un FVG nacido de un impulso post-liquidity está calificado, un FVG « de medio de range » no</li>
              <li>- La regla: sin contexto = se ignora el nivel, incluso si visualmente parece claro</li>
            </ul>
          </section>

          {/* Bloque 4 — EL MERCADO REGRESA A MENUDO A LOS DESEQUILIBRIOS */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">El mercado regresa a menudo a los desequilibrios</h2>

            <div className="my-8">
              <FVGMitigationDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Un impulso que deja un FVG es por naturaleza un desequilibrio, el precio pasó demasiado rápido para que todas las transacciones del « buen » precio fueran ejecutadas. El mercado tiende a regresar a mitigar esos desequilibrios antes de continuar en la dirección del impulso. Esa mitigation es precisamente la oportunidad que busca el trader ICT: el regreso al FVG ofrece una zona de entrada mucho más precisa y ajustada que el impulso en sí, que rara vez se juega a tiempo.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Ejemplo concreto</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                XAU/USD H1: desde 4 690 $, un fuerte impulso bajista deja un FVG entre 4 655 y 4 665 $. El precio continúa hasta 4 620, luego sube progresivamente hacia 4 660, entra al FVG. Ahí, una vela bajista impulsiva marca el rechazo; el precio se va hacia 4 610 en la siguiente sesión. La mitigation fue la señal de entrada, no el impulso inicial, ya pasado.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Un FVG es un desequilibrio, el mercado tiende a regresar para llenar las transacciones faltantes</li>
              <li>- La mitigation ofrece una segunda oportunidad de entrar, con mejor precio y un SL más ajustado</li>
              <li>- No todos los FVG son mitigados, pero los que están en un contexto estructural fuerte sí lo son a menudo</li>
              <li>- No confundir mitigation e invalidación: un FVG mitigado está llenado pero todavía puede reaccionar en el siguiente test</li>
            </ul>
          </section>

          {/* Bloque 4.5 — REBOTE, MITIGATION PROFUNDA O INVALIDACIÓN */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Rebote, mitigation profunda o invalidación: no confundir</h2>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Cuando el precio regresa a un FVG, hay una trampa clásica: creer que un FVG « llenado » está automáticamente muerto. Es falso. Un FVG puede ser atravesado profundamente, casi por completo, y seguir reaccionando perfectamente en el siguiente test. Lo que invalida realmente un FVG no es el llenado, es la <span className="text-white font-semibold">ruptura estructural limpia</span> más allá de la zona, acompañada de una ausencia de reacción y de un contexto HTF que ya no sostiene el escenario.
            </p>

            <div className="my-6">
              <FVGMitigationScenariosDiagram locale="es" />
            </div>

            <div className="space-y-4">
              {/* 1. Rebote inmediato */}
              <div className="border-l-2 border-emerald-500/50 pl-4">
                <p className="text-white font-semibold text-sm mb-1">1. Rebote inmediato</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- El precio apenas toca la zona (parte alta del FVG)</li>
                  <li>- Reacción rápida, vela de rechazo visible</li>
                  <li>- Momentum fuerte en la reanudación</li>
                  <li>- Contexto direccional claro, es la lectura textbook del FVG fresh</li>
                </ul>
              </div>

              {/* 2. Mitigation parcial */}
              <div className="border-l-2 border-emerald-500/30 pl-4">
                <p className="text-white font-semibold text-sm mb-1">2. Mitigation parcial</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- El precio entra en una parte del FVG (~30-50%)</li>
                  <li>- La zona está reequilibrada pero no saturada</li>
                  <li>- El setup sigue válido mientras la estructura aguante</li>
                  <li>- Lectura intermedia: entre rebote y mitigation profunda, manejar como un FVG activo</li>
                </ul>
              </div>

              {/* 3. Mitigation profunda */}
              <div className="border-l-2 border-amber-500/60 pl-4">
                <p className="text-white font-semibold text-sm mb-1">3. Mitigation profunda</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- El precio llena 70-95% de la zona, a veces hasta el extremo inferior</li>
                  <li>- <span className="text-amber-400 font-semibold">No es automáticamente una invalidación</span></li>
                  <li>- Lo que importa: la reacción que sigue (mecha de rechazo, vela de reanudación nítida)</li>
                  <li>- Si la estructura HTF aguanta y la reacción llega, el FVG está mitigado pero válido</li>
                </ul>
              </div>

              {/* 4. Invalidación real */}
              <div className="border-l-2 border-red-500/60 pl-4">
                <p className="text-white font-semibold text-sm mb-1">4. Invalidación real</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Ruptura estructural limpia más allá de la zona de invalidación</li>
                  <li>- Close nítido más allá del FVG, no solo una mecha</li>
                  <li>- Ausencia total de reacción durante varias velas</li>
                  <li>- Displacement opuesto limpio, momentum continuo en el sentido contrario</li>
                  <li>- Contexto HTF que ya no sostiene el escenario (BOS / CHoCH contrario)</li>
                </ul>
              </div>
            </div>

            <div className="border border-amber-500/30 bg-amber-500/5 rounded-xl p-4 md:p-6 my-6">
              <p className="text-amber-400 font-semibold text-sm mb-2">Regla a retener</p>
              <p className="text-sm text-zinc-200 leading-relaxed">
                FVG llenado <span className="text-zinc-500">≠</span> setup muerto.
                <br />
                <span className="text-white font-semibold">FVG llenado SIN reacción + estructura rota = invalidación probable.</span>
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-3">Ejemplo concreto. FVG alcista entre 1.0840 y 1.0860</p>
              <ul className="space-y-2 text-sm text-zinc-300">
                <li>
                  <span className="text-emerald-400 font-semibold">Caso A. Rebote inmediato:</span> el precio regresa a 1.0860, marca una mecha, vela verde de fuerza, se va hacia 1.0920. FVG fresh, setup A+, RR optimizado.
                </li>
                <li>
                  <span className="text-amber-400 font-semibold">Caso B. Mitigation profunda:</span> el precio baja a 1.0842 (casi todo el FVG), larga mecha de compra, close en 1.0855 y luego reanudación. El FVG está mitigado pero el rechazo es nítido, el setup sigue activo. Stop en 1.0838.
                </li>
                <li>
                  <span className="text-red-400 font-semibold">Caso C. Invalidación:</span> el precio atraviesa el FVG sin reacción, close en 1.0825, rompe el swing low anterior. Sin mecha de compra, momentum continuo bajista. El FVG está muerto, sin trade, se espera una nueva estructura.
                </li>
              </ul>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Antes de decir « FVG muerto », verifica: ¿hubo una vela de reacción?</li>
              <li>- Una mecha profunda sin close más allá = mitigation, no invalidación</li>
              <li>- La invalidación se confirma en lo que sigue, no en el toque mismo</li>
              <li>- Si HTF aguanta y la estructura está intacta, un FVG profundamente mitigado puede dar la mejor señal de la sesión</li>
            </ul>
          </section>

          {/* Bloque 5 — LAS MEJORES ZONAS = CONFLUENCIA */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Las mejores zonas = confluencia</h2>

            <div className="my-8">
              <PDArrayConfluenceDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Una zona sola, incluso calificada, sigue siendo una apuesta probabilística. La fuerza de un PD Array aumenta significativamente cuando varios elementos estructurales se superponen al mismo nivel de precio: un antiguo soporte roto convertido en resistencia, un FVG bearish en la misma banda, un sweep reciente arriba. Cuando tres elementos cuentan la misma historia en el mismo lugar, la zona se convierte en un verdadero punto pivote, es lo que se llama una confluencia. Las zonas de confluencia son raras pero ofrecen los mejores setups del modelo ICT.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Ejemplo concreto</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD H1: en 1.1780 se encuentran simultáneamente un antiguo soporte H1 roto dos sesiones antes, un FVG bearish dejado por el impulso que rompió ese soporte, y un sweep reciente justo arriba. Tres elementos, una sola zona. Cuando el precio regrese a testear ese nivel, la probabilidad de rechazo es claramente superior a la de un FVG aislado, el mercado « ve » la zona por varios canales a la vez.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Una zona sola = setup correcto; una confluencia = setup premium</li>
              <li>- Apilar antiguo soporte/resistencia + FVG + sweep en el mismo precio multiplica la confiabilidad</li>
              <li>- Las zonas de confluencia son raras, se identifican 1 a 3 por semana en un par mayor</li>
              <li>- Si ningún elemento estructural se superpone al FVG, probablemente hay que pasar al siguiente</li>
            </ul>
          </section>

          {/* Bloque 6 — PLAN DE APLICACIÓN */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan de aplicación: un PD Array EUR/USD completo</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Aquí está la secuencia completa para calificar y tradear un PD Array en EUR/USD. Cuatro etapas, cada una con su rol.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Etapa 1. Daily: dirección y contexto</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observación: EUR/USD Daily en estructura LH/LL, resistencia Daily en 1.1780, precio actual 1.1735</li>
                <li>- Conclusión: sesgo bajista, se buscarán shorts en PD Array alto</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Etapa 2. H1: identificar los PD Arrays</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observación: antiguo soporte H1 roto en 1.1780 + FVG bearish entre 1.1758 y 1.1770 + sweep reciente en 1.1792</li>
                <li>- Conclusión: zona confluente 1.1758-1.1780. PD Array premium, se prepara un escenario short al regreso</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Etapa 3. Regreso a la zona: vigilar la mitigation</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observación: en 3 sesiones, el precio sube progresivamente hacia 1.1760, entra al FVG</li>
                <li>- Conclusión: la zona está testeada, se pasa en modo « vigilancia » para la reacción, sin entrada todavía</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Etapa 4. Ejecución potencial (M15)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observación: en M15, mechas superiores de rechazo en 1.1768, luego vela bajista impulsiva que rompe el mínimo local en 1.1748</li>
                <li>- Conclusión: entrada short en 1.1758 en la ruptura, SL en 1.1772 (arriba del máximo de rechazo), TP hacia la próxima zona de liquidity baja en 1.1695. Si ninguna vela impulsiva aparece, la zona falla, sin entrada</li>
              </ul>

              <div className="border-t border-zinc-800/60 pt-3 mt-3">
                <p className="text-sm text-zinc-300 italic text-center">
                  Daily = contexto · H1 = PD Array · Regreso = mitigation · M15 = ejecución
                </p>
              </div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "Un FVG o un OB solo no vale nada sin contexto estructural, sweep, BOS o impulso justo antes.",
              "El mercado tiende a regresar a mitigar los desequilibrios antes de continuar en la dirección del impulso.",
              "Una confluencia (soporte roto + FVG + sweep en la misma zona) multiplica claramente la confiabilidad del PD Array.",
              "Sin contexto = se ignora el nivel; sin confluencia = setup correcto pero no premium.",
            ]}
          />

          <LessonExercice
            description="En TradingView, identifica un PD Array confluente en el par de tu elección y califícalo paso a paso."
            steps={[
              "HTF (Daily/H4): concluye un sesgo direccional claro. Sin sesgo, no bajes más, un PD Array fuera de sesgo es muy poco confiable.",
              "H1: busca un FVG en el sentido del sesgo, creado por un impulso justo después de un sweep o un BOS. Verifica que coincida con un antiguo soporte/resistencia roto. Si sí, tienes una confluencia.",
              "Espera el regreso del precio al PD Array. En M15, observa la reacción: mechas de rechazo + vela impulsiva = entrada validada. Si la zona es atravesada sin reacción, el setup está invalidado, pasa al siguiente.",
            ]}
          />

          <LessonQuiz
            question="Identificaste un FVG bearish en H1 EUR/USD. ¿Qué confluencia lo vuelve claramente más confiable para un short?"
            options={[
              "El FVG está bien aislado y limpiamente delimitado, sin otro nivel alrededor",
              "El FVG coincide con un antiguo soporte roto y un sweep reciente arriba",
              "El FVG está muy alejado de todos los demás niveles estructurales del gráfico",
              "El FVG se formó sin impulso previo, simplemente por drift lateral",
            ]}
            correctIndex={1}
            explanation="Un PD Array aislado sigue siendo una apuesta probabilística. La confiabilidad aumenta significativamente cuando varios elementos cuentan la misma historia en el mismo nivel: antiguo soporte roto + FVG + sweep reciente = confluencia. Es precisamente esa superposición la que hace pasar un setup correcto a un setup premium."
            answerExplanations={[
              "Falso. Un FVG aislado, sin otro nivel estructural alrededor, es un setup débil. El mercado puede atravesarlo sin reacción. El aislamiento no es una cualidad, es la ausencia de confluencia.",
              "Correcto. La confluencia (antiguo soporte roto + FVG + sweep) significa que varias lecturas estructurales convergen al mismo precio. El mercado « ve » la zona por varios canales, lo que aumenta claramente la probabilidad de reacción.",
              "Falso. Un FVG alejado de toda estructura es todo menos premium. El ICT busca la concentración de elementos, no su dispersión, un nivel aislado no tiene ninguna razón particular para aguantar.",
              "Falso. Un FVG nacido sin impulso previo, en simple drift lateral, no está calificado. El impulso es precisamente lo que le da valor al FVG: traduce la intención institucional que desequilibró el precio.",
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
                  markLessonComplete(p, "ict", "lecon2");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lección 2 del módulo ICT completo terminada.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between gap-4">
              <Link href="/strategies/ict/lecon1" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lección anterior
              </Link>
              <Link href="/strategies/ict/lecon3" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
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
