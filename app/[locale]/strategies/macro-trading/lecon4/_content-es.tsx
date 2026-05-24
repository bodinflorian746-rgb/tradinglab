"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { MacroFilterCalendarDiagram } from "@/app/components/charts/MacroFilterCalendarDiagram";
import { MacroFilterRegimeDiagram } from "@/app/components/charts/MacroFilterRegimeDiagram";
import { MacroFilterFlowchartDiagram } from "@/app/components/charts/MacroFilterFlowchartDiagram";

const LESSONS = [
  { id: "lecon1", title: "FOMC Fade", disabled: false },
  { id: "lecon2", title: "NFP Overreaction", disabled: false },
  { id: "lecon3", title: "Régimen Risk-off", disabled: false },
  { id: "lecon4", title: "Filtro macro pre-trade", disabled: false },
];

export default function ContentEs() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-trading", "lecon4"));
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
          <span className="text-zinc-500">Lección 4</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">
              Avanzado
            </span>
            <span className="text-zinc-700 text-xs">·</span>
            <span className="text-xs text-zinc-600">20 min</span>
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
            El filtro macro pre-trade: validar el contexto antes de ejecutar
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Un setup técnico limpio puede convertirse en un mal trade en un mal contexto macro. El filtro macro no sirve para encontrar trades. Sirve para evitar los que nunca debieron tomarse.
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
            <div className="bg-zinc-900 border-l-4 border-amber-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « Los mejores trades empiezan con una negativa: rehusarse a ejecutar cuando el contexto macro no valida el setup. »
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerrequisitos</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- FOMC Fade → ver módulo Macro Trading, Lección 1</li>
              <li>- NFP Overreaction → ver módulo Macro Trading, Lección 2</li>
              <li>- Régimen Risk-off → ver módulo Macro Trading, Lección 3</li>
              <li>- Calendario económico → ver módulo Macro</li>
              <li>- Multi-timeframe → ver módulo Multi-timeframe Process</li>
            </ul>
          </div>

          {/* Bloc 3 — LE CALENDRIER ÉCONOMIQUE EST LE PREMIER FILTRE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">El calendario económico es el primer filtro</h2>

            <div className="my-8">
              <MacroFilterCalendarDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Antes de cualquier setup, la primera pregunta a hacerse es simple: hay una publicación económica mayor en la ventana que viene? FOMC, NFP, CPI, datos de empleo, conferencia de Powell, estos eventos provocan volatilidades extremas e imprevisibles que desorganizan completamente las estructuras técnicas. Un setup técnicamente perfecto a las 10h UTC puede ser arrasado por una vela de 70 $ a las 13h30 UTC en la publicación del NFP. El calendario económico es por lo tanto el filtro más simple y más eficaz: si una news mayor está en la ventana del trade, no se toma el trade, sin importar la calidad técnica del setup.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Ejemplo concreto</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                XAU/USD 13h25 UTC: setup short H4 perfecto, precio bajo resistencia, estructura bajista clara. Pero el calendario indica la publicación del CPI estadounidense a las 13h30 UTC. La probabilidad de una volatilidad de 50-100 $ en los minutos siguientes es muy alta, el SL sería arrasado antes de que el escenario tenga la mínima oportunidad de expresarse. Filtro rojo: sin trade. Se espera que la publicación sea digerida (típicamente 30-60 minutos) antes de reevaluar.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Puntos accionables: consultar el calendario económico ANTES de analizar el gráfico</li>
              <li>- News mayor en los próximos 30 minutos = filtro rojo, sin ejecución</li>
              <li>- News mayor en la última hora = esperar la digestión antes de cualquier trade</li>
              <li>- Ningún setup técnico justifica tradear a ciegas sobre una publicación mayor</li>
            </ul>
          </section>

          {/* Bloc 4 — LE TRADE DOIT ÊTRE ALIGNÉ AVEC LE RÉGIME DOMINANT */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">El trade debe estar alineado con el régimen dominante</h2>

            <div className="my-8">
              <MacroFilterRegimeDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              El segundo filtro es el régimen macro. Si el contexto general (risk-on, risk-off, sesgo Daily de los activos safe-haven, estructura HTF) apunta en una dirección, tomar un trade contra esa dirección no solo es riesgoso, es estadísticamente perdedor. Una señal bearish M15 aislada sobre el oro durante un régimen risk-off bullish establecido tiene una probabilidad de continuación muy baja. La estructura HTF generalmente absorbe estas señales contrarias en algunas velas, el SL es alcanzado, y el trade falla. Tradear en el sentido del régimen, nunca en contra.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Ejemplo concreto</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                XAU/USD H4 en régimen risk-off establecido, estructura HH/HL clara que apunta hacia 4 740 $. Aparece una señal bearish M15 durante un mini-pullback: rechazo en resistencia local, inicio de ruptura del último mínimo. Técnicamente, es un short válido. Macro-contextualmente, es un trade a contracorriente del régimen dominante. Filtro rojo: no se toma. El mercado efectivamente sigue subiendo y rompe los máximos previos en las horas siguientes.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Puntos accionables: verificar el régimen macro y la estructura HTF antes de cada trade</li>
              <li>- Setup contra-tendencia = filtro ámbar o rojo, salvo prueba estructural de cambio</li>
              <li>- El régimen dominante prima sobre la señal local, siempre</li>
              <li>- Una señal técnicamente válida pero fuera del régimen = setup que se pasa de turno</li>
            </ul>
          </section>

          {/* Bloc 5 — LE FILTRE MACRO SERT À RÉDUIRE LES MAUVAIS TRADES */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">El filtro macro sirve para reducir los malos trades</h2>

            <div className="my-8">
              <MacroFilterFlowchartDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              El filtro macro NO es una herramienta para encontrar trades. Es una herramienta para evitarlos. Su lógica es negativa: en cada etapa, se busca una razón para NO tomar el trade. News mayor inminente? Rechazo. Régimen contrario? Rechazo. Setup débil? Rechazo. Solo los setups que pasan los tres filtros merecen la ejecución. Esta lógica inversa, buscar razones para rechazar en lugar de razones para entrar, es exactamente lo que separa a los traders rentables de los demás: toman pocos trades, pero los que toman han pasado todos los controles.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Ejemplo concreto</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                En una semana de trading, un trader disciplinado puede identificar 15 setups técnicos. Aplicando el filtro macro: 5 son rechazados por news mayores en la ventana, 4 son rechazados porque van contra el régimen dominante, 2 son rechazados porque al setup técnico le falta una confluencia clara. Quedan 4, que se ejecutan. Esa selectividad, percibida como «tradear menos», es en realidad el principal multiplicador de performance.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Puntos accionables: aplicar los 3 filtros sistemáticamente a cada setup considerado</li>
              <li>- Un solo filtro rojo basta para rechazar el trade, sin negociación</li>
              <li>- Tradear menos setups pero de mejor calidad = principal palanca de performance</li>
              <li>- La lógica del filtro es NEGATIVA: buscar evitar, no buscar encontrar</li>
            </ul>
          </section>

          {/* Bloc 6 — PLAN D'APPLICATION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan de aplicación: dos casos concretos en XAU/USD</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Estos son dos casos concretos, un trade validado a través del filtro, y un trade rechazado, para ilustrar la decisión paso a paso.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Caso 1. Trade validado en 3 etapas</p>

              <p className="text-zinc-300 leading-relaxed text-sm mb-2"><span className="font-semibold text-white">Etapa 1. Calendario:</span></p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-3">
                <li>- Observación: ninguna publicación mayor en las 2 horas previas ni en las 4 horas siguientes</li>
                <li>- Conclusión: filtro calendario VERDE, se continúa</li>
              </ul>

              <p className="text-zinc-300 leading-relaxed text-sm mb-2"><span className="font-semibold text-white">Etapa 2. Régimen macro:</span></p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-3">
                <li>- Observación: régimen risk-off establecido, estructura HH/HL clara en H4 sobre XAU, sesgo Daily alcista confirmado</li>
                <li>- Conclusión: filtro régimen VERDE, un setup long está alineado</li>
              </ul>

              <p className="text-zinc-300 leading-relaxed text-sm mb-2"><span className="font-semibold text-white">Etapa 3. Setup técnico:</span></p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-3">
                <li>- Observación: pullback H4 hacia un antiguo máximo convertido en soporte, estabilización M15 visible, vela de recuperación franca</li>
                <li>- Conclusión: filtro setup VERDE, ejecución validada. Entrada long con SL bajo el pullback, target en la próxima zona de continuación</li>
              </ul>

              <div className="border-t border-zinc-800/60 pt-3 mt-3 mb-5">
                <p className="text-sm text-emerald-400 font-semibold text-center">
                  3 filtros VERDES → trade ejecutado
                </p>
              </div>

              <p className="text-white font-semibold text-sm mb-2">Caso 2. Trade rechazado</p>

              <p className="text-zinc-300 leading-relaxed text-sm mb-2"><span className="font-semibold text-white">Etapa 1. Calendario:</span></p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-3">
                <li>- Observación: publicación CPI US a las 13h30 UTC, en 25 minutos</li>
                <li>- Conclusión: filtro calendario ROJO, sin trade, sin importar el resto</li>
              </ul>

              <p className="text-sm text-zinc-400 italic leading-relaxed mb-1">
                Nota: no se van a verificar los otros filtros. Un solo filtro rojo basta para rechazar. El setup técnico puede ser excelente, el régimen puede estar alineado, la news inminente hace que la ejecución sea demasiado riesgosa. Se espera la publicación digerida para reevaluar.
              </p>

              <div className="border-t border-zinc-800/60 pt-3 mt-3">
                <p className="text-sm text-red-400 font-semibold text-center">
                  Filtro ROJO desde la etapa 1 → trade rechazado
                </p>
              </div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "El filtro macro es una lógica NEGATIVA: buscar razones para rechazar un trade, no para tomarlo.",
              "Tres filtros en serie: calendario económico, régimen macro, setup técnico. Un solo rojo = sin trade.",
              "Tradear menos pero mejor es la principal palanca de performance, la selectividad prima sobre la frecuencia.",
              "Ningún setup técnico justifica tradear contra el calendario o contra el régimen dominante.",
            ]}
          />

          <LessonExercice
            description="Durante una semana, aplica el filtro macro a cada setup que identifiques. Anota los rechazos y las ejecuciones."
            steps={[
              "Para cada setup técnico detectado, consulta primero el calendario económico para las 2 horas siguientes. Si una news mayor está en esa ventana, marca el setup RECHAZADO por calendario.",
              "Si el calendario está verde, verifica el régimen macro y la estructura HTF. Si el setup va contra el régimen dominante, márcalo RECHAZADO por régimen.",
              "Si los dos primeros filtros pasan, evalúa la calidad técnica del setup (confluencia, estructura, niveles). Si es insuficiente, marca RECHAZADO por setup débil. Si no, marca EJECUTADO. Al final de la semana, compara el número de setups identificados con el número de setups ejecutados, esa es tu selectividad.",
            ]}
          />

          <LessonQuiz
            question="Identificas un setup short H4 técnicamente perfecto en XAU/USD a las 13h00 UTC. El calendario indica una publicación NFP a las 13h30 UTC. El régimen macro es neutro. Qué haces?"
            options={[
              "Ejecutas: el setup técnico es sólido, eso es lo que cuenta",
              "No ejecutas: la news inminente es un filtro rojo, sin importar la calidad del setup",
              "Ejecutas con tamaño reducido para limitar el riesgo",
              "Colocas una orden limit más lejos para evitar la volatilidad inicial",
            ]}
            correctIndex={1}
            explanation="La regla del filtro macro es innegociable: un solo filtro rojo basta para rechazar el trade. Aquí, el calendario está explícitamente rojo (NFP en 30 minutos), lo que hace la ejecución demasiado riesgosa, la volatilidad post-NFP puede arrasar el SL en pocos minutos sin relación con la calidad técnica del setup. La calidad del régimen macro o del setup técnico nunca compensan un filtro calendario rojo. La disciplina es esperar la publicación digerida (típicamente 30-60 minutos) antes de reevaluar."
            answerExplanations={[
              "Falso. «El setup técnico es sólido» nunca basta para compensar un filtro calendario rojo. La volatilidad NFP es imprevisible y puede arrasar el SL antes de que el setup tenga la mínima oportunidad de expresarse.",
              "Correcto. Un solo filtro rojo basta para rechazar, y el calendario es el filtro más simple de respetar. Se espera la publicación, se observa la reacción, y se reevalúa después. La disciplina prima sobre el apego al setup identificado.",
              "Falso. Reducir el tamaño no cambia la naturaleza del problema: la volatilidad NFP puede superar largamente cualquier SL razonable. No se atenúa un mal trade arriesgando menos, se suprime.",
              "Falso. Colocar una orden limit más lejos no evade el filtro. Es una racionalización para ejecutar de todos modos un setup que ya se decidió mentalmente tomar, exactamente lo que el filtro debe impedir.",
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
                  markLessonComplete(p, "macro-trading", "lecon4");
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
                  <p className="text-sm font-semibold text-emerald-400">Módulo Macro Trading terminado</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Has completado las 4 lecciones del módulo Macro Trading.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between gap-4">
              <Link href="/strategies/macro-trading/lecon3" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lección anterior
              </Link>
              <Link href="/strategies/macro-trading" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
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
