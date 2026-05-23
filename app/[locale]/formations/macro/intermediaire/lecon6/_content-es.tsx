"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { WeeklyBiasCalendarDiagram } from "@/app/components/charts/WeeklyBiasCalendarDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Hawkish vs Dovish",                       href: "/formations/macro/intermediaire/lecon1", disabled: false },
  { id: "lecon2", title: "Entender el calendario económico",         href: "/formations/macro/intermediaire/lecon2", disabled: false },
  { id: "lecon3", title: "CPI, PPI e inflación",                     href: "/formations/macro/intermediaire/lecon3", disabled: false },
  { id: "lecon4", title: "Sesiones de trading y liquidity",          href: "/formations/macro/intermediaire/lecon4", disabled: false },
  { id: "lecon5", title: "Las correlaciones",                        href: "/formations/macro/intermediaire/lecon5", disabled: false },
  { id: "lecon6", title: "Construir tu sesgo semanal",               href: "/formations/macro/intermediaire/lecon6", disabled: false },
];

export default function ContentEs() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-intermediaire", "lecon6"));
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
          <Link href="/formations/macro/intermediaire" className="hover:text-zinc-400 transition-colors">Intermedio</Link>
          <span>/</span>
          <span className="text-zinc-500">Lección 6</span>
        </nav>

        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-400/10 text-blue-400 border border-blue-400/20">
              Intermedio
            </span>
            <span className="text-zinc-700 text-xs">·</span>
            <span className="text-xs text-zinc-600">14 min</span>
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
            Construir tu sesgo semanal — la rutina macro que nadie hace
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              El retail descubre el mercado el lunes por la mañana.
            </p>
            <p className="text-[15px] text-zinc-400 leading-relaxed mt-2">
              El trader preparado llega con un sesgo, un plan y zonas a evitar.
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
              const isCurrent = lesson.id === "lecon6";
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
            <span className="ml-auto text-xs text-zinc-600">6 / 6 lecciones</span>
          </div>
        </header>

        {/* ── Contenido ── */}
        <div className="space-y-8">

          {/* Bloque 1 — Por qué el sesgo lo cambia todo */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Por qué el sesgo lo cambia todo</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Sin sesgo semanal, <span className="font-semibold text-zinc-200">reaccionas</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-1">
              Ves una vela subir, quieres comprar.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Ves una vela bajar, quieres vender.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              El problema: operas el <span className="font-semibold text-zinc-200">ruido del día</span> en lugar del <span className="font-semibold text-zinc-200">contexto de la semana</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Un sesgo semanal te da una <span className="font-semibold text-zinc-200">dirección prioritaria</span>:
            </p>
            <ul className="space-y-1.5 mb-5">
              {[
                "dónde buscar compras",
                "dónde buscar ventas",
                "cuándo no hacer nada",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Un trade sin sesgo es una decisión sin brújula.
              </p>
            </div>
          </section>

          {/* Bloque 2 — Los 4 pilares de un sesgo sólido */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Los 4 pilares de un sesgo sólido</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Tu sesgo no debe salir de tu intuición.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Debe venir de <span className="font-semibold text-zinc-200">4 pilares</span>:
            </p>
            <div className="space-y-4 mb-4">
              {[
                {
                  n: "1. El tono macro",
                  body: "¿Hawkish o dovish?",
                  ref: "(cf lección 1)",
                },
                {
                  n: "2. El calendario de la semana",
                  body: "¿Hay un CPI, un NFP, un FOMC o un cluster?",
                  ref: "(cf lección 2)",
                },
                {
                  n: "3. Las correlaciones",
                  body: "¿XAU/USD confirma al DXY? ¿BTC/USD sigue todavía al Nasdaq?",
                  ref: "(cf lección 5)",
                },
                {
                  n: "4. El contexto global",
                  body: "¿Risk-on o risk-off? ¿El mercado busca el riesgo o la seguridad?",
                  ref: null,
                },
              ].map((pilier) => (
                <div key={pilier.n} className="bg-zinc-800/30 rounded-xl px-4 py-3">
                  <p className="text-sm font-semibold text-zinc-200 mb-1">{pilier.n}</p>
                  <p className="text-sm text-zinc-300">
                    {pilier.body}{pilier.ref && <span className="text-zinc-500 ml-1 italic">{pilier.ref}</span>}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Sin estos 4 pilares, tu sesgo es una <span className="font-semibold text-zinc-200">opinión</span>.<br />
              Con ellos, es una <span className="font-semibold text-zinc-200">tesis</span>.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Tu opinión no vale nada. Tu tesis debe tener pruebas.
              </p>
            </div>
          </section>

          {/* Bloque 3 — La rutina del domingo por la noche */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">La rutina del domingo por la noche</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              La rutina toma <span className="font-semibold text-zinc-200">20 minutos</span>. No más.
            </p>
            <div className="space-y-3 mb-5">
              {[
                { bold: "Paso 1 — Calendario (5 min)", rest: "Abres la semana. Anotas las news 3 estrellas. Identificas los clusters." },
                { bold: "Paso 2 — Tono macro (5 min)", rest: "Miras la última comunicación Fed / BCE. ¿Hawkish, dovish o neutral?" },
                { bold: "Paso 3 — DXY (3 min)", rest: "¿El dólar está alcista, bajista o en range?" },
                { bold: "Paso 4 — Correlaciones (3 min)", rest: "¿XAU/USD confirma al DXY? ¿BTC/USD sigue al Nasdaq? ¿Se está rompiendo alguna correlación?" },
                { bold: "Paso 5 — Sesgo por activo (4 min)", rest: "Para cada activo que operas: long / short / neutral." },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    <span className="font-semibold text-zinc-200">{item.bold}</span>
                    <br />{item.rest}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              No necesitas 10 sesgos. <span className="font-semibold text-zinc-200">Dos o tres activos son suficientes</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              <span className="font-semibold text-zinc-200">Total: 20 minutos el domingo por la noche. Eso es todo.</span>
            </p>

            {/* Componente visual */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden mb-5">
              <WeeklyBiasCalendarDiagram />
            </div>

            {/* Encadré 💰 Realidad del retail */}
            <div className="bg-zinc-800/50 border-l-4 border-amber-400 px-5 py-4 rounded">
              <div className="flex items-center gap-2 mb-2">
                <span>💰</span>
                <span className="text-sm font-bold text-amber-400 tracking-wide">Realidad del retail</span>
              </div>
              <p className="text-base text-zinc-300 leading-relaxed">
                El retail elige su trade frente al gráfico. El pro elige su contexto antes de abrir el gráfico.
              </p>
            </div>
          </section>

          {/* Bloque 4 — Ejemplo concreto de sesgo semanal */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Ejemplo concreto de sesgo semanal</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Contexto de partida</span>:
            </p>
            <ul className="space-y-1.5 mb-5">
              {[
                "Fed hawkish, tasas a 5.50%",
                "CPI miércoles a las 14h30",
                "NFP viernes a las 14h30",
                "DXY alcista desde hace 3 semanas",
                "XAU/USD en range",
                "BTC/USD correlacionado con el Nasdaq, pero sin dirección clara",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Sesgo posible</span>:
            </p>
            <div className="space-y-2 mb-5">
              {[
                { asset: "EUR/USD", biais: "sesgo short", detail: "DXY fuerte + Fed hawkish." },
                { asset: "XAU/USD", biais: "sesgo neutral / short ligero", detail: "Dólar fuerte, pero range técnico." },
                { asset: "Nasdaq", biais: "sesgo short", detail: "Tasas altas = presión sobre la tech." },
                { asset: "BTC/USD", biais: "sesgo neutral", detail: "Correlación Nasdaq, pero estructura no clara." },
              ].map((item) => (
                <div key={item.asset} className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
                  <p className="text-sm font-semibold text-zinc-200 mb-0.5">
                    {item.asset} → <span className="text-zinc-300 font-normal">{item.biais}</span>
                  </p>
                  <p className="text-xs text-zinc-500">{item.detail}</p>
                </div>
              ))}
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Plan de la semana</span>:
            </p>
            <ul className="space-y-1.5 mb-5">
              {[
                { bold: "Lunes", rest: ": setups short EUR/USD únicamente" },
                { bold: "Martes", rest: ": prudencia antes del CPI" },
                { bold: "Miércoles", rest: ": ningún trade antes de la reacción CPI" },
                { bold: "Jueves", rest: ": recalibración según el CPI" },
                { bold: "Viernes", rest: ": ningún trade nuevo antes del NFP" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                El sesgo no te dice dónde hacer clic. Te dice dónde buscar.
              </p>
            </div>
          </section>

          {/* Bloque 5 — Cuándo modificar tu sesgo */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Cuándo modificar tu sesgo</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              No cambias de sesgo porque aparezca una vela roja.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Cambias de sesgo <span className="font-semibold text-zinc-200">solo si el contexto cambia</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Ejemplo</span>:
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-2">
              Tienes un sesgo long XAU/USD el domingo.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Martes, el CPI sale más alto que lo esperado. El DXY explota. La Fed vuelve a ser más hawkish.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              → Tu sesgo long XAU/USD está <span className="font-semibold text-zinc-200">invalidado</span>. Cierras la idea. Esperas.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">A la inversa</span>:
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              XAU/USD baja 20$ el lunes sin news mayor. Tu sesgo no está necesariamente invalidado. Quizás sea solo un pullback.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">La diferencia</span>:
            </p>
            <ul className="space-y-1.5 mb-5">
              {[
                { bold: "movimiento técnico", rest: " = paciencia" },
                { bold: "invalidación macro", rest: " = cambio de plan" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Un mal trade que sigue tu sesgo te cuesta dinero. Un cambio de sesgo en cada pullback te cuesta tu coherencia.
              </p>
            </div>
          </section>

          {/* Bloque 6 — Las 5 trampas clásicas */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Las 5 trampas clásicas</h2>
            <div className="space-y-3 mb-5">
              {[
                {
                  bold: "Trampa 1",
                  desc: ": construir un sesgo sin mirar el calendario.",
                  consequence: "Te sorprenderán las news.",
                },
                {
                  bold: "Trampa 2",
                  desc: ": cambiar de sesgo en cada pullback.",
                  consequence: "Te vuelves reactivo en lugar de estructurado.",
                },
                {
                  bold: "Trampa 3",
                  desc: ": tener demasiados sesgos.",
                  consequence: "Long XAU/USD, short EUR/USD, long BTC/USD, short Nasdaq, long GBP/USD… Terminas por no seguir nada.",
                },
                {
                  bold: "Trampa 4",
                  desc: ": olvidar las correlaciones.",
                  consequence: "Long XAU/USD + long BTC/USD + long Nasdaq puede volverse una sola gran apuesta risk-on.",
                  ref: "(cf lección 5)",
                },
                {
                  bold: "Trampa 5",
                  desc: ": no releer nunca tu plan.",
                  consequence: "Un sesgo semanal no es una prisión. Es un marco.",
                },
              ].map((item) => (
                <div key={item.bold} className="bg-zinc-800/30 rounded-xl px-4 py-3">
                  <p className="text-sm text-zinc-300 mb-1">
                    <span className="font-semibold text-zinc-200">{item.bold}</span>{item.desc}
                  </p>
                  <p className="text-sm text-zinc-400 italic">
                    → {item.consequence}{item.ref && <span className="text-zinc-500 ml-1">{item.ref}</span>}
                  </p>
                </div>
              ))}
            </div>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                La disciplina no es ser terco. Es saber qué invalida tu plan.
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
              "Un sesgo semanal transforma tus ideas en un plan estructurado",
              "Un buen sesgo se basa en macro, calendario, correlaciones y sentimiento global",
              "No cambias de sesgo por una vela, sino por una invalidación clara",
              "La rutina del domingo por la noche prepara tu semana antes de que el mercado te obligue a reaccionar",
            ]}
          />

          <LessonExercice
            description="Construye tu sesgo macro para la próxima semana."
            steps={[
              "Abre el calendario económico en vista semana.",
              "Anota los 3 a 5 eventos mayores.",
              "Analiza el DXY, XAU/USD, BTC/USD y Nasdaq.",
              "Define un sesgo long / short / neutral para 2 o 3 activos máximo.",
              "Clasifica tus jornadas: agresiva, neutral o defensiva.",
            ]}
          />
          <p className="text-sm text-zinc-500 leading-relaxed px-1">
            El objetivo: llegar el lunes con un{" "}
            <span className="font-semibold text-zinc-400">plan</span>, no con una reacción.
          </p>

          <LessonQuiz
            question="Construyes el domingo un sesgo long XAU/USD. El martes, el CPI sale mucho más alto que lo esperado, el DXY explota al alza y XAU/USD rompe un soporte importante. ¿Qué haces?"
            options={[
              "Mantienes tu sesgo long porque hay que respetar el plan",
              "Doblas tu posición para tener un mejor precio",
              "Consideras que tu sesgo está invalidado y esperas una nueva estructura",
              "Pasas inmediatamente a short sin otra confirmación",
            ]}
            correctIndex={2}
            explanation="Un sesgo debe respetarse, pero solo mientras sus condiciones sigan válidas. Aquí, el CPI más alto que lo esperado + el DXY que explota + la ruptura técnica forman una invalidación macro completa. Cierras la idea y esperas una nueva estructura. La opción A confunde disciplina y terquedad (un sesgo invalidado ya no se respeta). La opción B agrava el riesgo sobre una tesis rota. La opción D reacciona demasiado rápido sin reconstruir un plan — hay que esperar una nueva confirmación, no flippear directamente."
            answerExplanations={[
              "Falso. Respetar tu plan no significa ignorar una invalidación macro completa. Cuando las condiciones que fundaban tu sesgo cambian radicalmente, el sesgo también debe cambiar.",
              "Falso. Doblar una posición sobre una tesis invalidada por la macro agrava el riesgo. Es una de las trampas más costosas en trading.",
              "Correcto. El CPI más alto que lo esperado + el DXY que explota + la ruptura técnica forman una invalidación macro completa. Cierras la idea y esperas una nueva estructura antes de reposicionarte.",
              "Falso. Pasar directamente a short tras una invalidación, sin rebuscar un plan, es reemplazar una reacción por otra. Hace falta primero una nueva confirmación, no un flip inmediato.",
            ]}
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => { const p = getStoredProgress(); markLessonComplete(p, "macro-intermediaire", "lecon6"); setDone(true); }}
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
                  <p className="text-xs text-zinc-500 mt-0.5">Terminaste el módulo Intermedio Macro. Felicitaciones.</p>
                </div>
              </div>
            )}

            {/* Navegación */}
            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/formations/macro/intermediaire/lecon5"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lección 5 — Las correlaciones
              </Link>
              <span className="text-sm font-bold text-emerald-400 cursor-default">
                Módulo Intermedio Macro completo ✓
              </span>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
