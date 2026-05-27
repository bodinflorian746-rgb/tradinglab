"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { ConsensusVsRealDiagram } from "@/app/components/charts/ConsensusVsRealDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Qué es la macro",                       href: "/formations/macro/debutant/lecon1", disabled: false },
  { id: "lecon2", title: "Los 4 grandes bancos centrales",        href: "/formations/macro/debutant/lecon2", disabled: false },
  { id: "lecon3", title: "Los datos macro a vigilar",             href: "/formations/macro/debutant/lecon3", disabled: false },
  { id: "lecon4", title: "Entender la inflación",                 href: null,                                disabled: true  },
  { id: "lecon5", title: "El rol del dólar en el mundo",          href: null,                                disabled: true  },
  { id: "lecon6", title: "Macro y risk management",               href: null,                                disabled: true  },
];

export default function ContentEs() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-debutant", "lecon3"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/formations" className="hover:text-zinc-400 transition-colors">Cursos</Link>
          <span>/</span>
          <Link href="/formations/macro" className="hover:text-zinc-400 transition-colors">Macro Trading</Link>
          <span>/</span>
          <Link href="/formations/macro/debutant" className="hover:text-zinc-400 transition-colors">Principiante</Link>
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
            <span className="text-xs text-zinc-600">12 min</span>
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
            Los datos macro a vigilar, qué mirar y cuándo
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              14:30. Una vela M5 hace 80 pips de golpe. Buscas el patrón.
            </p>
            <p className="text-[15px] text-zinc-400 leading-relaxed mt-2">
              No hay ninguno. Es un dato que ignoraste y que acaba de salir.
            </p>
          </div>

          {/* Indicador de estructura */}
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

          {/* Pills de las lecciones */}
          <div className="mt-6 flex items-center gap-2 flex-wrap">
            {LESSONS.map((lesson) => {
              const isCurrent = lesson.id === "lecon3";
              const pill = (
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                  isCurrent
                    ? "bg-zinc-800 border-zinc-600 text-white"
                    : "border-zinc-800 text-zinc-500"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? "bg-white" : "bg-zinc-600"}`} />
                  {lesson.title}
                </span>
              );
              return <div key={lesson.id}>{pill}</div>;
            })}
            <span className="ml-auto text-xs text-zinc-600">3 / 6 lecciones</span>
          </div>
        </header>

        {/* ── Contenido ── */}
        <div className="space-y-8">

          {/* Bloque 1 — El principio que nadie te explica */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">El principio que nadie te explica</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Los datos macro no salen al azar. Se publican en momentos precisos:
            </p>
            <ul className="space-y-1.5 mb-4">
              {["cada mes", "cada trimestre", "siempre a las mismas horas"].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Pero aquí va el punto clave que la mayoría de los principiantes se pierde:
            </p>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3 mb-4">
              <p className="text-sm text-zinc-200 font-semibold leading-relaxed">
                El mercado no reacciona al dato en sí. Reacciona a la diferencia entre lo que se esperaba y lo que sale realmente.
              </p>
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              <span className="font-semibold text-zinc-200">Analogía simple</span>: el pronóstico anuncia sol. Llueve. No es la lluvia lo que te sorprende. Es la diferencia con lo que esperabas.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                El mercado no reacciona al dato. Reacciona a la sorpresa.
              </p>
            </div>
          </section>

          {/* Bloque 2 — Los 5 datos que mueven el mercado */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Los 5 datos que realmente mueven el mercado</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              No necesitas conocer 30. Concéntrate en estos 5:
            </p>
            <div className="space-y-3 mb-5">
              <div className="bg-zinc-800/30 rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-zinc-200 mb-1.5">NFP (Non-Farm Payrolls)</p>
                <ul className="space-y-1">
                  <li className="text-sm text-zinc-300">Creación de empleos en EE. UU.</li>
                  <li className="text-sm text-zinc-300">Se publica el <span className="font-semibold text-zinc-200">1er viernes del mes a las 14:30</span> (hora de París)</li>
                  <li className="text-sm text-zinc-300">A menudo extremadamente violento</li>
                </ul>
              </div>
              <div className="bg-zinc-800/30 rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-zinc-200 mb-1.5">CPI (Consumer Price Index)</p>
                <ul className="space-y-1">
                  <li className="text-sm text-zinc-300">Inflación en EE. UU.</li>
                  <li className="text-sm text-zinc-300">Se publica hacia <span className="font-semibold text-zinc-200">mediados de mes a las 14:30</span></li>
                  <li className="text-sm text-zinc-300">Impacto muy fuerte sobre el dólar</li>
                </ul>
              </div>
              <div className="bg-zinc-800/30 rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-zinc-200 mb-1.5">FOMC (decisión de tasas de la Fed)</p>
                <ul className="space-y-1">
                  <li className="text-sm text-zinc-300">Aproximadamente <span className="font-semibold text-zinc-200">8 veces al año a las 20:00</span></li>
                  <li className="text-sm text-zinc-300">Impacto enorme (ver lección Macro Avanzado sobre el FOMC)</li>
                </ul>
              </div>
              <div className="bg-zinc-800/30 rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-zinc-200 mb-1.5">PMI (Purchasing Managers Index)</p>
                <ul className="space-y-1">
                  <li className="text-sm text-zinc-300">Salud económica (industria / servicios)</li>
                  <li className="text-sm text-zinc-300">Se publica cada mes</li>
                </ul>
              </div>
              <div className="bg-zinc-800/30 rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-zinc-200 mb-1.5">GDP (PIB)</p>
                <ul className="space-y-1">
                  <li className="text-sm text-zinc-300">Crecimiento económico trimestral</li>
                  <li className="text-sm text-zinc-300">Impacto medio pero direccional</li>
                </ul>
              </div>
            </div>

            {/* Recuadro 💰 Realidad del retail */}
            <div className="bg-zinc-800/50 border-l-4 border-amber-400 px-5 py-4 rounded">
              <div className="flex items-center gap-2 mb-2">
                <span>💰</span>
                <span className="text-sm font-bold text-amber-400 tracking-wide">Realidad del retail</span>
              </div>
              <p className="text-base text-zinc-300 leading-relaxed">
                No necesitas seguir todo el calendario. Domina estos 5 datos y ya entiendes el <span className="font-semibold text-zinc-200">80% de los movimientos brutales</span> del mercado. El resto es ruido.
              </p>
            </div>
          </section>

          {/* Bloque 3 — Los datos secundarios */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Los datos secundarios (a conocer pero no sobrevalorar)</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Existen otros datos que mueven el mercado, pero con menos violencia:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                { bold: "PPI", rest: " (inflación del lado de los productores)" },
                { bold: "Retail Sales", rest: " (ventas minoristas)" },
                { bold: "Unemployment Rate", rest: " (tasa de desempleo)" },
                { bold: "Consumer Confidence", rest: " (confianza del consumidor)" },
                { bold: "ISM", rest: " (índice industrial)" },
              ].map((item) => (
                <li key={item.bold} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Pueden generar movimientos, pero rara vez tan violentos como los 5 principales. Apréndelos <span className="font-semibold text-zinc-200">después</span> de dominar los 5 primeros.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Todos los datos mueven el mercado. Pocos lo controlan realmente.
              </p>
            </div>
          </section>

          {/* Bloque 4 — El sistema de estrellas */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">El sistema de estrellas: lo que merece tu atención</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Ya conoces el sistema de impacto (visto en la lección 1): <span className="font-semibold text-zinc-200">1 estrella</span> = bajo, <span className="font-semibold text-zinc-200">2 estrellas</span> = medio, <span className="font-semibold text-zinc-200">3 estrellas</span> = fuerte.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Pero aquí va la regla que nadie aplica:
            </p>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3 mb-4">
              <p className="text-sm text-zinc-200 font-semibold leading-relaxed">
                Los datos de 1 o 2 estrellas puedes ignorarlos siendo principiante.
              </p>
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              ¿Por qué? Porque no romperán una tendencia fuerte, no invalidarán un setup limpio, y su impacto se diluye durante el día.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Los datos de 3 estrellas, en cambio, pueden:
            </p>
            <ul className="space-y-1.5 mb-5">
              {[
                "Borrar un setup perfecto en 30 segundos",
                "Invertir la tendencia del día",
                "Generar movimientos violentos: 100 a 300 pips en forex, 30 a 60$ en el oro, 1 a 2% en los índices",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Si está en rojo, cierras tu trade o esperas.
              </p>
            </div>
          </section>

          {/* Bloque 5 — Ejemplo concreto */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Ejemplo concreto (lo que realmente ocurre)</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Veamos un ejemplo con cifras.
            </p>
            <div className="bg-zinc-800/30 rounded-xl px-4 py-4 mb-4">
              <p className="text-sm font-semibold text-zinc-200 mb-2">Caso de sorpresa positiva:</p>
              <ul className="space-y-1 mb-3">
                <li className="text-sm text-zinc-300">NFP esperado: <span className="font-semibold text-zinc-200">200k</span></li>
                <li className="text-sm text-zinc-300">NFP real: <span className="font-semibold text-zinc-200">350k</span></li>
              </ul>
              <p className="text-sm text-zinc-300 mb-2">
                Enorme sorpresa positiva sobre la economía de EE. UU. → el dólar sube fuerte → EUR/USD cae.
              </p>
              <p className="text-sm font-semibold text-zinc-200">
                Movimiento típico: -50 a -100 pips en 30 segundos.
              </p>
              <div className="mt-3 bg-zinc-900/60 rounded-lg px-3 py-2.5">
                <p className="text-xs font-semibold text-zinc-400 mb-2">El mismo NFP también afecta a:</p>
                <ul className="space-y-1">
                  {[
                    { asset: "XAU/USD", move: "-25 a -40$ en 30 segundos" },
                    { asset: "Nasdaq", move: "-1 a -1.5% en los primeros minutos" },
                    { asset: "BTC/USD", move: "-300 a -800$ según la volatilidad" },
                  ].map((item) => (
                    <li key={item.asset} className="flex items-center justify-between text-xs text-zinc-400">
                      <span className="font-semibold text-zinc-300">{item.asset}</span>
                      <span>{item.move}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-zinc-500 mt-2 italic">El NFP no afecta solo a EUR/USD. Afecta a todo el mercado.</p>
              </div>
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Sobre 0.10 lote de EUR/USD, eso equivale a <span className="font-semibold text-zinc-200">50 a 100$ de variación en 30 segundos</span>. Si estabas long con un SL de 30 pips, <span className="font-semibold text-zinc-200">te sacan ANTES incluso de entender lo que ha pasado.</span>
            </p>
            <div className="bg-zinc-800/30 rounded-xl px-4 py-4 mb-5">
              <p className="text-sm font-semibold text-zinc-200 mb-2">Caso de sorpresa negativa:</p>
              <ul className="space-y-1 mb-3">
                <li className="text-sm text-zinc-300">NFP esperado: <span className="font-semibold text-zinc-200">200k</span></li>
                <li className="text-sm text-zinc-300">NFP real: <span className="font-semibold text-zinc-200">100k</span></li>
              </ul>
              <p className="text-sm text-zinc-300 mb-2">
                Economía de EE. UU. más débil de lo esperado → el dólar cae → EUR/USD sube.
              </p>
              <p className="text-sm font-semibold text-zinc-200">
                Movimiento típico: +50 a +100 pips en 30 segundos.
              </p>
              <div className="mt-3 bg-zinc-900/60 rounded-lg px-3 py-2.5">
                <p className="text-xs font-semibold text-zinc-400 mb-2">El mismo NFP también afecta a:</p>
                <ul className="space-y-1">
                  {[
                    { asset: "XAU/USD", move: "+25 a +40$ en 30 segundos" },
                    { asset: "Nasdaq", move: "+1 a +1.5% en los primeros minutos" },
                    { asset: "BTC/USD", move: "+300 a +800$ según la volatilidad" },
                  ].map((item) => (
                    <li key={item.asset} className="flex items-center justify-between text-xs text-zinc-400">
                      <span className="font-semibold text-zinc-300">{item.asset}</span>
                      <span>{item.move}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-zinc-500 mt-2 italic">El mecanismo es estrictamente simétrico: un NFP que decepciona hace subir lo que un NFP que sorprende hace bajar.</p>
              </div>
            </div>

            {/* Componente visual */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden mb-5">
              <ConsensusVsRealDiagram locale="es" />
            </div>

            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Cuanto mayor es la diferencia entre previsión y realidad, más violento es el movimiento.
              </p>
            </div>
          </section>

          {/* Bloque 6 — Cómo usar esto concretamente */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Cómo usar esto concretamente</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              No necesitas ser experto. Aquí va la rutina simple:
            </p>
            <div className="space-y-3 mb-5">
              {[
                { n: "1", text: "Mira únicamente los eventos de 3 estrellas (rojo)" },
                { n: "2", text: "Anota los horarios en tu agenda" },
                { n: "3", text: "No operes en los 30 minutos previos" },
                { n: "4", text: "Observa la reacción en el momento de la publicación" },
                { n: "5", text: "Si el setup está confirmado tras la reacción → puedes entrar siguiendo el movimiento" },
              ].map((item) => (
                <div key={item.n} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
                  <span className="text-xs font-bold text-zinc-500 shrink-0 mt-0.5">{item.n}.</span>
                  <p className="text-sm text-zinc-300 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3 mb-5">
              <p className="text-sm text-zinc-400 leading-relaxed">
                <span className="text-white font-medium">Método del trader experimentado</span>: <span className="font-semibold text-zinc-300">nunca</span> operarás la news en directo. Esperas 15-30 minutos después, el mercado se calma, la nueva dirección se dibuja, y entras con confluencia técnica.
              </p>
            </div>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                No operas la news. Operas la reacción.
              </p>
            </div>
          </section>

          {/* ── Separador revisión ── */}
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Revisión</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          <LessonKeyPoints
            points={[
              "El mercado reacciona a la sorpresa (real vs previsión), no al dato bruto",
              "5 datos dominan: NFP, CPI, FOMC, PMI, GDP, concéntrate en ellos",
              "Los eventos de 3 estrellas son los únicos que merecen tu atención",
              "Cuanto mayor es la diferencia entre previsión y realidad, más violento es el movimiento",
            ]}
          />

          <LessonExercice
            description="Esta semana, entrénate en leer los datos macro."
            steps={[
              "Abre un calendario económico (Investing.com o Forex Factory).",
              "Filtra solo por los eventos de 3 estrellas, para esta semana.",
              "Identifica un NFP, un CPI o un FOMC.",
              "Anota la hora exacta y la previsión (consenso) que aparece.",
              "El día D, observa el gráfico de un activo afectado (EUR/USD, XAU/USD o un índice estadounidense) 15 min antes, en el momento y 30 min después de la publicación.",
            ]}
          />
          <p className="text-sm text-zinc-500 leading-relaxed px-1">
            El objetivo: acostumbrarte a <span className="font-semibold text-zinc-400">anticipar la volatilidad</span> en lugar de sufrirla.
          </p>

          <LessonQuiz
            question="Un dato CPI se espera en 3.0%. Sale en 3.8%. ¿Qué ocurre con mayor frecuencia?"
            options={[
              "Nada, ya estaba previsto",
              "El mercado siempre sube",
              "El mercado reacciona con fuerza porque es una gran sorpresa",
              "El mercado siempre baja",
            ]}
            correctIndex={2}
            explanation="El mercado no reacciona al dato solo, sino a la diferencia con las expectativas. Aquí, la inflación sale en 3.8% en lugar del 3.0% esperado → gran sorpresa inflacionaria → movimiento violento casi garantizado. Las opciones A, B y D son falsas: el sentido siempre depende del contexto (la dirección del movimiento, en sí, depende de si una inflación más alta se percibe como positiva o negativa según la situación económica del momento). Este principio se aplica a todos los activos: forex, oro, índices, crypto."
            answerExplanations={[
              "Falso. Que un dato esté previsto no significa que no tendrá impacto. 3.8% vs 3.0% esperado representa una diferencia importante, el mercado siempre reacciona a una sorpresa así.",
              "Falso. La dirección del movimiento depende del contexto económico. Una inflación más alta puede percibirse como positiva o negativa según la situación. Lo único seguro: habrá un movimiento fuerte.",
              "Correcto. 3.8% vs 3.0% esperado = +0.8% de diferencia en la inflación, es una gran sorpresa. El mercado va a reaccionar con fuerza. La dirección exacta depende del contexto, pero el movimiento violento está casi garantizado.",
              "Falso. La dirección depende del contexto económico, no de una regla fija. Lo único seguro es que habrá un movimiento fuerte, no necesariamente a la baja.",
            ]}
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => { const p = getStoredProgress(); markLessonComplete(p, "macro-debutant", "lecon3"); setDone(true); }}
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
                  <p className="text-xs text-zinc-500 mt-0.5">La próxima lección (Entender la inflación) estará disponible pronto.</p>
                </div>
              </div>
            )}

            {/* Navegación */}
            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/formations/macro/debutant/lecon2"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lección 2. Los 4 grandes bancos centrales
              </Link>
              <span className="text-sm text-zinc-700 cursor-default">
                Entender la inflación. Pronto disponible →
              </span>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
