"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import RiskRegimesQuadrantDiagram from "@/app/components/charts/RiskRegimesQuadrantDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "FOMC",                          href: "/formations/macro/avance/lecon1", disabled: false },
  { id: "lecon2", title: "NFP",                           href: "/formations/macro/avance/lecon2", disabled: false },
  { id: "lecon3", title: "Los rendimientos de bonos US", href: "/formations/macro/avance/lecon3", disabled: false },
  { id: "lecon4", title: "Risk-on / Risk-off",            href: "/formations/macro/avance/lecon4", disabled: false },
];

export default function ContentEs() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-avance", "lecon4"));
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
          <Link href="/formations/macro/avance" className="hover:text-zinc-400 transition-colors">Avanzado</Link>
          <span>/</span>
          <span className="text-zinc-500">Lección 4</span>
        </nav>

        {/* ── Header ── */}
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
            Risk-on / Risk-off — el marco mental del pro
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              El retail mira un gráfico. El pro lee un régimen.
            </p>
            <p className="text-[15px] text-zinc-400 leading-relaxed mt-2">
              Dos traders, mismo setup, resultados opuestos porque no están en el mismo entorno.
            </p>
            <p className="text-[15px] text-zinc-400 leading-relaxed mt-2">
              Risk-on, risk-off, reflation, flight to quality: no es jerga, es el mapa del terreno.
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
              const isCurrent = lesson.id === "lecon4";
              const pill = (
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                  isCurrent
                    ? "bg-zinc-800 border-zinc-600 text-white"
                    : lesson.disabled
                    ? "border-zinc-800/50 text-zinc-700"
                    : "border-zinc-800 text-zinc-500"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? "bg-white" : lesson.disabled ? "bg-zinc-700" : "bg-zinc-600"}`} />
                  {lesson.title}
                </span>
              );
              return <div key={lesson.id}>{pill}</div>;
            })}
            <span className="ml-auto text-xs text-zinc-600">4 / 4 lecciones</span>
          </div>
        </header>

        {/* ── Contenu ── */}
        <div className="space-y-8">

          {/* Bloc 1 — Risk-on / Risk-off: la grilla mental del pro */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Risk-on / Risk-off: la grilla mental del pro</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Risk-on = el capital busca rendimiento y acepta la volatilidad. Risk-off = huye hacia la seguridad.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              No es una opinión, es un flujo. Y los flujos dominan a tus patrones.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Por qué es crítico</span>: un breakout no tiene el mismo valor según el régimen.
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                "Nasdaq rompe una resistencia en risk-on → compras, continuación probable.",
                "El mismo breakout en risk-off → vendes la trampa, squeeze y luego rechazo.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-2">
              Ejemplo concreto: Nasdaq +140 puntos con una noticia soft CPI en risk-on, seguido de +220 puntos en extensión.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Mismo patrón en risk-off: +120 puntos de spike y luego -260 puntos de regreso bajo el nivel.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              El mercado no te paga por ver una señal. Te paga por entender el contexto en el que aparece esa señal.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              No operas un activo. Operas un entorno.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « Antes de preguntar DÓNDE operas, pregunta EN QUÉ estás operando. »
              </p>
            </div>
          </section>

          {/* Bloc 2 — La tipología de los 4 regímenes */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">La tipología de los 4 regímenes</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              No es binario. Entre apetito y aversión al riesgo, existen 4 estados distintos. Cada uno tiene su firma y sus trades.
            </p>
            <div className="space-y-4">

              <div className="bg-zinc-800/30 rounded-xl px-4 py-4">
                <h3 className="text-sm font-semibold text-zinc-200 mb-3">Risk-on clásico</h3>
                <p className="text-sm text-zinc-300 mb-1">
                  <span className="font-semibold text-zinc-400">Firma:</span>{" "}DXY -30 a -60 puntos, US10Y estable o +5 puntos, oro estable a moderadamente alcista (+10 a +30 puntos), índices US +150 a +300 puntos, BTC/USD +800 a +2000.
                </p>
                <p className="text-sm text-zinc-300 mb-1">
                  <span className="font-semibold text-zinc-400">Lectura:</span>{" "}crecimiento ok, inflación bajo control, liquidez suficiente.
                </p>
                <p className="text-sm text-zinc-300 mb-1">
                  <span className="font-semibold text-zinc-400">Trade típico:</span>{" "}long índices, long BTC, short USD contra AUD/NZD.
                </p>
                <p className="text-sm text-zinc-300">
                  <span className="font-semibold text-zinc-400">Caso concreto:</span>{" "}fin de 2023, narrativa pivot Fed. Nasdaq encadena +250 y luego +320 puntos en la semana, DXY retrocede -80 puntos.
                </p>
              </div>

              <div className="bg-zinc-800/30 rounded-xl px-4 py-4">
                <h3 className="text-sm font-semibold text-zinc-200 mb-3">Risk-off pánico</h3>
                <p className="text-sm text-zinc-300 mb-1">
                  <span className="font-semibold text-zinc-400">Firma:</span>{" "}DXY +80 a +150 puntos, US10Y -20 a -40 puntos (huida hacia USTs), oro +40 a +90 puntos, índices -300 a -800 puntos, BTC/USD -2000 a -6000.
                </p>
                <p className="text-sm text-zinc-300 mb-1">
                  <span className="font-semibold text-zinc-400">Lectura:</span>{" "}liquidación global, búsqueda de cash y seguridad.
                </p>
                <p className="text-sm text-zinc-300 mb-1">
                  <span className="font-semibold text-zinc-400">Trade típico:</span>{" "}long USD, long CHF/JPY, long oro, short índices o flat.
                </p>
                <p className="text-sm text-zinc-300">
                  <span className="font-semibold text-zinc-400">Caso concreto:</span>{" "}16 de marzo de 2020. Nasdaq -900 puntos en sesión, DXY +140 puntos, US10Y -35 puntos.
                </p>
              </div>

              <div className="bg-zinc-800/30 rounded-xl px-4 py-4">
                <h3 className="text-sm font-semibold text-zinc-200 mb-3">Reflation trade</h3>
                <p className="text-sm text-zinc-300 mb-1">
                  <span className="font-semibold text-zinc-400">Firma:</span>{" "}DXY mixto (+/-30 puntos), US10Y +15 a +40 puntos, oro +20 a +70 puntos, índices suben pero con rotación interna, BTC/USD alcista.
                </p>
                <p className="text-sm text-zinc-300 mb-1">
                  <span className="font-semibold text-zinc-400">Lectura:</span>{" "}crecimiento + inflación que vuelve a arrancar. El dinero va hacia los activos reales.
                </p>
                <p className="text-sm text-zinc-300 mb-1">
                  <span className="font-semibold text-zinc-400">Trade típico:</span>{" "}long commodities, long financieras, short tech de larga duración.
                </p>
                <p className="text-sm text-zinc-300">
                  <span className="font-semibold text-zinc-400">Caso concreto:</span>{" "}inicio de 2021. US10Y toma +30 puntos en pocas semanas, Nasdaq subperforma, rotación hacia value.
                </p>
              </div>

              <div className="bg-zinc-800/30 rounded-xl px-4 py-4">
                <h3 className="text-sm font-semibold text-zinc-200 mb-3">Flight to quality</h3>
                <p className="text-sm text-zinc-300 mb-1">
                  <span className="font-semibold text-zinc-400">Firma:</span>{" "}DXY +30 a +80 puntos, US10Y -10 a -25 puntos, oro +20 a +60 puntos, índices -80 a -200 puntos, BTC/USD a la baja moderada.
                </p>
                <p className="text-sm text-zinc-300 mb-1">
                  <span className="font-semibold text-zinc-400">Definición:</span>{" "}flight to quality = desplazamiento del capital hacia los activos percibidos como seguros.
                </p>
                <p className="text-sm text-zinc-300 mb-1">
                  <span className="font-semibold text-zinc-400">Trade típico:</span>{" "}long USD, long oro, reducción del riesgo en acciones.
                </p>
                <p className="text-sm text-zinc-300">
                  <span className="font-semibold text-zinc-400">Caso concreto:</span>{" "}inicio de 2022, tensiones Ucrania. Nasdaq -150 puntos, oro +50 puntos, DXY +60 puntos sin crash global.
                </p>
              </div>

            </div>
          </section>

          {/* Bloc 3 — Cómo reconocer el régimen actual */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Cómo reconocer el régimen actual</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Rutina simple. Cuatro preguntas. Cuatro respuestas.
            </p>
            <div className="space-y-3 mb-5">
              {[
                {
                  q: "¿DXY sube o baja?",
                  a: "Subida = demanda de dólar, estrés o atractivo. Bajada = apetito por riesgo global.",
                },
                {
                  q: "¿US10Y sube o baja?",
                  a: "Subida = anticipación inflación/crecimiento. Bajada = búsqueda de seguridad o miedo a recesión.",
                },
                {
                  q: "¿Oro sube o baja?",
                  a: "Subida = cobertura contra riesgo o inflación. Bajada = desinterés por protección.",
                },
                {
                  q: "¿Índices US y BTC se mueven juntos o se desacoplan?",
                  a: "Juntos = régimen claro. Desacople = transición o rotación interna.",
                },
              ].map((item, i) => (
                <div key={i} className="bg-zinc-800/30 rounded-xl px-4 py-3">
                  <p className="text-sm font-semibold text-zinc-200 mb-1">{i + 1}. {item.q}</p>
                  <p className="text-sm text-zinc-400 italic">→ {item.a}</p>
                </div>
              ))}
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm">
              Cruza las respuestas. Identificas el régimen sin terminal pro. Solo 4 charts.
            </p>
          </section>

          {/* Bloc 4 — Visuel */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Los 4 regímenes de mercado</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              El mercado puede leerse como un cuadrante. Eje horizontal: inflación baja a alta. Eje vertical: crecimiento fuerte a débil. Cada esquina corresponde a un régimen distinto. Este esquema te permite ubicar rápidamente el entorno macro y anticipar qué activos deberían sobreperformar o subperformar.
            </p>
            <div className="border border-zinc-800 rounded-xl overflow-hidden">
              <RiskRegimesQuadrantDiagram locale="es" />
            </div>
          </section>

          {/* Bloc 5 — Las transiciones entre regímenes */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Las transiciones entre regímenes: ahí se esconde el edge</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              El mercado no hace switch. Resbala. Tu edge está en las primeras fisuras.
            </p>
            <div className="space-y-4 mb-5">
              {[
                {
                  signal: "El oro sube mientras los yields suben",
                  body: "Normalmente inverso. Si XAU/USD +40 puntos y US10Y +20 puntos al mismo tiempo, el mercado está priceando una inflación persistente.",
                },
                {
                  signal: "Los yields caen pese a un discurso Fed hawkish",
                  body: "El mercado no le cree a la Fed. Ejemplo: US10Y -25 puntos post FOMC mientras el tono sigue restrictivo → pricing de recesión.",
                },
                {
                  signal: "El DXY sube con yields que también suben",
                  body: "Doble presión: atractivo de tasas + demanda de seguridad. Ejemplo: DXY +70 puntos con US10Y +15 puntos = tensión latente.",
                },
                {
                  signal: "Nasdaq diverge del Russell 2000",
                  body: "Si Nasdaq +120 puntos mientras Russell -80 puntos = mercado que pricea una bajada de yields anticipada (favorable a la tech de larga duración), no una verdadera recuperación económica. Inverso (Russell +80 / Nasdaq -120) = reflation, crecimiento doméstico real favorecido.",
                },
              ].map((item, i) => (
                <div key={i} className="bg-zinc-800/30 rounded-xl px-4 py-3">
                  <p className="text-sm font-semibold text-zinc-200 mb-2">— {item.signal}</p>
                  <p className="text-sm text-zinc-400">→ {item.body}</p>
                </div>
              ))}
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm">
              Estas señales aparecen antes que los headlines. Ahí es donde tomas la delantera.
            </p>
          </section>

          {/* Bloc 6 — El vocabulario institucional a conocer */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">El vocabulario institucional a conocer</h2>
            <div className="space-y-3">
              {[
                {
                  term: "Flight to quality",
                  def: "Desplazamiento del capital hacia activos seguros.",
                  util: "Identificar las fases defensivas sin pánico.",
                  cas: "Oro +50 puntos, US10Y -15 puntos, índices -100 puntos.",
                },
                {
                  term: "Reflation trade",
                  def: "Posicionamiento sobre el regreso del crecimiento y la inflación.",
                  util: "Entender las rotaciones sectoriales.",
                  cas: "US10Y +25 puntos, bancos suben, tech subperforma.",
                },
                {
                  term: "Carry trade",
                  def: "Endeudarse en una moneda de tasa baja para invertir en una moneda de tasa alta.",
                  util: "Capturar el rendimiento diferencial.",
                  cas: "Posiciones short JPY masivas acumuladas durante meses, luego desarme violento en agosto 2024 con USD/JPY -2000 pips en pocas sesiones (del 31 de julio al 5 de agosto).",
                },
                {
                  term: "Safe haven flow",
                  def: "Flujos hacia los activos refugio.",
                  util: "Confirmar un sesgo defensivo.",
                  cas: "USD, CHF y oro suben juntos sobre una tensión geopolítica.",
                },
                {
                  term: "Risk parity",
                  def: "Estrategia que equilibra el riesgo entre acciones y bonos.",
                  util: "Entender las ventas forzadas.",
                  cas: "Cuando yields y acciones suben juntos, los fondos reducen ambos → movimientos violentos y sincronizados.",
                },
              ].map((item) => (
                <div key={item.term} className="bg-zinc-800/30 rounded-xl px-4 py-3">
                  <p className="text-sm font-semibold text-zinc-200 mb-1">{item.term}</p>
                  <p className="text-sm text-zinc-300 mb-1">{item.def}</p>
                  <p className="text-xs text-zinc-500"><span className="font-semibold">Utilidad:</span> {item.util}</p>
                  <p className="text-xs text-zinc-500 mt-0.5"><span className="font-semibold">Caso:</span> {item.cas}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Bloc 7 — Multi-activos */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Multi-activos: dónde se lee mejor cada régimen</h2>
            <div className="space-y-3">
              {[
                { bold: "DXY + US10Y", body: "= barómetro principal. Si los dos suben, tensión. Si DXY baja y yields estables, risk-on." },
                { bold: "XAU/USD", body: "= árbitro. Distingue un miedo controlado de un pánico. Oro que sube sin crash de acciones = flight to quality." },
                { bold: "Nasdaq", body: "= sensible a los yields. +25 puntos en US10Y pueden bastar para provocar -150 puntos en el índice." },
                { bold: "Russell 2000", body: "= proxy del crecimiento US doméstico. Sobreperforma en reflation, subperforma en estrés y en flight to quality." },
                { bold: "BTC/USD", body: "= versión amplificada del Nasdaq. Si Nasdaq +120 puntos, BTC puede hacer +1500. Ideal para leer el sentimiento puro." },
              ].map((item) => (
                <div key={item.bold} className="bg-zinc-800/30 rounded-xl px-4 py-3">
                  <p className="text-sm text-zinc-300">
                    <span className="font-semibold text-zinc-200">{item.bold}</span> {item.body}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Séparateur révision ── */}
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Repaso</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          <LessonKeyPoints
            points={[
              "Risk-on/off NO es binario, es un cuadrante de 4 regímenes",
              "DXY + US10Y + Oro + Índices = los 4 charts a leer cada mañana",
              "El mismo setup técnico se opera distinto según el régimen",
              "Las transiciones se ven en las señales débiles ANTES de la evidencia",
              "Flight to quality / reflation trade / carry trade = vocabulario pro que describe flujos reales",
            ]}
          />

          <LessonExercice
            description="Pon en práctica la grilla de los 4 regímenes antes de tu próxima sesión."
            steps={[
              "Identificar el régimen actual del mercado según la checklist de 4 preguntas",
              "Verificar los 4 charts (DXY, US10Y, XAU/USD, Nasdaq) esta mañana y nombrar el régimen en voz alta",
              "Encontrar en las noticias una mención de \"flight to quality\" o \"reflation trade\" y entender el contexto",
              "Comparar cómo se comportó tu activo principal la última vez que estábamos en el régimen opuesto al de hoy",
              "Agregar a tu journal de trading una línea \"Régimen del día\" antes de cada sesión",
            ]}
          />

          <LessonQuiz
            question="Esta mañana: DXY ↑, US10Y ↓, Oro ↑, Nasdaq ↓ ligeramente. ¿En qué régimen estás?"
            options={[
              "Risk-on clásico",
              "Risk-off pánico",
              "Reflation trade",
              "Flight to quality",
            ]}
            correctIndex={3}
            explanation="DXY que sube + yields que bajan + oro que sube + índices que bajan ligeramente = capital que se posiciona defensivamente sin pánico. No es un derrumbe, es solo un reposicionamiento. Diferencia clave con el risk-off pánico: en risk-off pánico, índices y BTC caen violentamente. Aquí la caída está contenida, señal de un miedo medido."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => { const p = getStoredProgress(); markLessonComplete(p, "macro-avance", "lecon4"); setDone(true); }}
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
                  <p className="text-xs text-zinc-500 mt-0.5">Completaste el módulo Macro Avanzado completo.</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/formations/macro/avance/lecon3"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lección 3 — Rendimientos de bonos US
              </Link>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
