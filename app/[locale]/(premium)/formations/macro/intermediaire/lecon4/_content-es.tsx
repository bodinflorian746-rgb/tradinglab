"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { TradingSessionsLiquidityDiagram } from "@/app/components/charts/TradingSessionsLiquidityDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Hawkish vs Dovish",                      href: "/formations/macro/intermediaire/lecon1", disabled: false },
  { id: "lecon2", title: "Entender el calendario económico",        href: "/formations/macro/intermediaire/lecon2", disabled: false },
  { id: "lecon3", title: "CPI, PPI e inflación",                    href: "/formations/macro/intermediaire/lecon3", disabled: false },
  { id: "lecon4", title: "Sesiones de trading y liquidez",          href: "/formations/macro/intermediaire/lecon4", disabled: false },
  { id: "lecon5", title: "Las correlaciones",                       href: null,                                     disabled: true  },
  { id: "lecon6", title: "Construir tu sesgo semanal",              href: null,                                     disabled: true  },
];

export default function ContentEs() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-intermediaire", "lecon4"));
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
          <span className="text-zinc-500">Lección 4</span>
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
            Sesiones de trading y liquidez, cuándo el mercado se mueve de verdad
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Puedes tener una buena estrategia y perder solo porque operas en el momento equivocado.
            </p>
            <p className="text-[15px] text-zinc-400 leading-relaxed mt-2">
              El mercado no se mueve igual a las 15:00 que a las 23:00.
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

          {/* Pills de lecciones */}
          <div className="mt-6 flex items-center gap-2 flex-wrap">
            {LESSONS.map((lesson) => {
              const isCurrent = lesson.id === "lecon4";
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
            <span className="ml-auto text-xs text-zinc-600">4 / 6 lecciones</span>
          </div>
        </header>

        {/* ── Contenido ── */}
        <div className="space-y-8">

          {/* Bloque 1 — Las 3 grandes sesiones */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Las 3 grandes sesiones</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              El mercado forex opera desde el domingo por la noche (23:00 hora de París) hasta el viernes por la noche,{" "}
              <span className="font-semibold text-zinc-200">24/7 sin pausa real</span>. El único &apos;cierre&apos; es un corte corto diario alrededor de la medianoche (variable según los brokers de CFD), y luego arranca de nuevo de inmediato.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Pero &apos;abierto&apos; no significa &apos;activo&apos;. Hay{" "}
              <span className="font-semibold text-zinc-200">3 grandes sesiones</span>{" "}
              que se van turnando y que determinan la liquidez real:
            </p>

            <div className="space-y-4 mb-5">
              <div>
                <p className="text-sm font-semibold text-zinc-200 mb-1">Sesión Asia, 00:00 a 09:00 hora de París</p>
                <p className="text-sm text-zinc-300 mb-0.5">Tokio, Singapur, Hong Kong. Liquidez baja. Volatilidad baja.</p>
                <p className="text-sm text-zinc-400">Pares activos: USD/JPY, AUD/JPY, NZD/JPY, AUD/USD.</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-200 mb-1">Sesión Londres, 08:00 a 17:00 hora de París</p>
                <p className="text-sm text-zinc-300 mb-0.5">
                  <span className="font-semibold text-zinc-200">LA sesión más importante.</span> Representa aproximadamente el{" "}
                  <span className="font-semibold text-zinc-200">35-40% del volumen forex mundial</span>.
                </p>
                <p className="text-sm text-zinc-400">Pares activos: EUR/USD, GBP/USD, EUR/GBP, GBP/JPY, XAU/USD.</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-200 mb-1">Sesión New York, 14:00 a 22:00 hora de París</p>
                <p className="text-sm text-zinc-300 mb-0.5">
                  Wall Street, índices US, news americanas. Representa aproximadamente el{" "}
                  <span className="font-semibold text-zinc-200">20-25% del volumen forex mundial</span>.
                </p>
                <p className="text-sm text-zinc-400">Pares activos: EUR/USD, GBP/USD, USD/JPY, USD/CAD, XAU/USD, índices US.</p>
              </div>
            </div>

            {/* Componente visual */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden mb-5">
              <TradingSessionsLiquidityDiagram locale="es" />
            </div>

            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                El mercado no cierra. Lo que cambia es la liquidez.
              </p>
            </div>
          </section>

          {/* Bloque 2 — El overlap Londres-New York */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">El overlap Londres-New York</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              La mejor ventana de liquidity suele estar entre las{" "}
              <span className="font-semibold text-zinc-200">14:00 y las 17:00 hora de París</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              ¿Por qué? Porque Londres y New York están abiertos{" "}
              <span className="font-semibold text-zinc-200">al mismo tiempo</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Durante esas 3 horas:</p>
            <ul className="space-y-1.5 mb-4">
              {[
                "las instituciones europeas están activas",
                "las instituciones americanas llegan",
                "las news US salen a menudo a las 14:30",
                "los volúmenes explotan",
                "los movimientos reales se forman",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              En EUR/USD,{" "}
              <span className="font-semibold text-zinc-200">una buena parte de la volatilidad diaria se concentra</span>{" "}
              a menudo en esta ventana.
            </p>
            <div className="bg-zinc-900/60 rounded-xl px-4 py-3 mb-5">
              <p className="text-xs font-semibold text-zinc-400 mb-2">Lo mismo ocurre con los demás activos mayores:</p>
              <ul className="space-y-1.5">
                {[
                  { bold: "XAU/USD (oro)", rest: ": 50-60% de la volatilidad diaria se concentra en el overlap" },
                  { bold: "Nasdaq, S&P500", rest: ": apertura US a las 15:30 = pico de actividad institucional" },
                  { bold: "BTC/USD", rest: ": volatilidad institucional máxima entre las 14:00 y las 17:00" },
                ].map((item) => (
                  <li key={item.bold} className="flex items-start gap-2 text-xs text-zinc-400">
                    <div className="w-1 h-1 rounded-full bg-zinc-600 shrink-0 mt-1.5" />
                    <span><span className="font-semibold text-zinc-300">{item.bold}</span>{item.rest}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-zinc-500 mt-2 italic">El overlap no es solo una ventana forex. Es LA ventana, sin más.</p>
            </div>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                El overlap es donde el mercado deja de respirar suavemente y empieza a golpear.
              </p>
            </div>
          </section>

          {/* Bloque 3 — La trampa de la sesión Asia */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">La trampa de la sesión Asia</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Muchos traders latinoamericanos y europeos operan de noche después del trabajo.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              22:00. 23:00. Medianoche.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Problema: en EUR/USD o GBP/USD,{" "}
              <span className="font-semibold text-zinc-200">suele ser el peor momento</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              La misma trampa existe en{" "}
              <span className="font-semibold text-zinc-200">XAU/USD</span> y{" "}
              <span className="font-semibold text-zinc-200">los índices US</span>: entre las 22:00 y las 6:00, esos activos también están en zona tranquila con spreads ampliados. Solo los pares en JPY (USD/JPY, AUD/JPY) se mueven de verdad durante la sesión Asia.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Entre las 22:00 y las 6:00:</p>
            <ul className="space-y-1.5 mb-4">
              {[
                "liquidez baja",
                "spreads más amplios",
                "ranges frecuentes",
                "fakeouts más numerosos",
                "menos catalizadores macro",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Ves una ruptura. Entras. El precio vuelve al rango.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              No era un breakout real.{" "}
              <span className="font-semibold text-zinc-200">Era simplemente un mercado vacío.</span>
            </p>

            {/* Cuadro Realidad del retail */}
            <div className="bg-zinc-800/50 border-l-4 border-amber-400 px-5 py-4 rounded">
              <div className="flex items-center gap-2 mb-2">
                <span>💰</span>
                <span className="text-sm font-bold text-amber-400 tracking-wide">Realidad del retail</span>
              </div>
              <p className="text-base text-zinc-300 leading-relaxed">
                El retail opera a menudo cuando está disponible. No cuando el mercado está óptimo. ¿El resultado? Setups que parecen perfectos pero que fallan, no por la estrategia, sino por la hora.
              </p>
            </div>
          </section>

          {/* Bloque 4 — Qué par operar según la sesión */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Qué par operar según la sesión</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Cada activo tiene sus horas fuertes.
            </p>

            <div className="overflow-x-auto mb-5">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-zinc-700">
                    <th className="text-left py-2 pr-6 text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                      Activo / par
                    </th>
                    <th className="text-left py-2 text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                      Mejor sesión
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {[
                    ["EUR/USD", "Londres + overlap"],
                    ["GBP/USD", "Londres + overlap"],
                    ["USD/JPY", "New York + Asia"],
                    ["AUD/JPY", "Asia"],
                    ["NZD/JPY", "Asia"],
                    ["XAU/USD (oro)", "Londres + New York"],
                    ["Índices US", "New York"],
                    ["BTC/USD", "24/7, pero más limpio en Londres-New York"],
                  ].map(([pair, session]) => (
                    <tr key={pair}>
                      <td className="py-2.5 pr-6 font-semibold text-zinc-200">{pair}</td>
                      <td className="py-2.5 text-zinc-400">{session}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Si operas EUR/USD a las 23:00,{" "}
              <span className="font-semibold text-zinc-200">a menudo estás operando un mercado dormido</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Si operas EUR/USD entre las 14:00 y las 17:00,{" "}
              <span className="font-semibold text-zinc-200">estás operando cuando los grandes jugadores están ahí</span>.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                El par correcto en el horario equivocado se convierte en un mal setup.
              </p>
            </div>
          </section>

          {/* Bloque 5 — Adaptar tu estilo a la sesión */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Adaptar tu estilo a la sesión</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              No operas todas las sesiones de la misma forma.
            </p>
            <div className="space-y-3 mb-5">
              {[
                { bold: "Scalping", rest: ": necesita liquidez. Solo Londres y overlap." },
                { bold: "Day trading", rest: ": overlap Londres-New York ideal. Es donde los movimientos son más limpios." },
                { bold: "Swing trading", rest: ": puedes usar Londres para identificar las rupturas importantes." },
                { bold: "News trading", rest: ": a menudo alrededor de las 14:30 o 20:00. Pero solo con preparación." },
              ].map((item, i) => (
                <p key={i} className="text-zinc-300 leading-relaxed text-sm">
                  <span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}
                </p>
              ))}
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Si tu estrategia necesita movimiento,{" "}
              <span className="font-semibold text-zinc-200">no la pruebes en una sesión muerta</span>.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Una estrategia de scalping en sesión Asia es como jugar al tenis sin rival, puedes pegarle a la pelota, pero no pasa nada.
              </p>
            </div>
          </section>

          {/* Bloque 6 — Construir tu ventana de trading */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Construir tu ventana de trading</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              El objetivo no es <span className="font-semibold text-zinc-200">operar más</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              El objetivo es <span className="font-semibold text-zinc-200">operar en el momento correcto</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Para un trader basado en horario europeo:</p>
            <ul className="space-y-2 mb-5">
              {[
                { bold: "08:00-10:00", rest: ": apertura de Londres" },
                { bold: "14:00-17:00", rest: ": overlap Londres-New York (ideal)" },
                { bold: "15:30-18:00", rest: ": apertura de los índices US" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
              <li className="flex items-start gap-2.5 text-sm text-zinc-300">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                <span>
                  <span className="font-semibold text-zinc-200">22:00-06:00</span>
                  {": el mercado sigue abierto pero "}
                  <span className="font-semibold text-zinc-200">la liquidez es baja</span>
                  {" en EUR/USD, GBP/USD y XAU/USD. En cambio, los pares JPY pueden estar activos (Tokio abre alrededor de la 1:00)."}
                </span>
              </li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Estas ventanas son válidas para la mayoría de activos mayores: forex, oro, índices US y crypto. La única excepción: los pares en JPY pueden justificar que vigiles la sesión Asia (00:00-09:00).
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Si trabajas durante el día, la noche puede ser tentadora.{" "}
              <span className="font-semibold text-zinc-200">Pero tentador no significa rentable.</span>
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Tu edge no depende solo de tu estrategia. También depende de la hora en que la usas.
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
              "El mercado está abierto 24/7, pero la liquidez varía enormemente",
              "Londres y el overlap Londres-New York son las ventanas más limpias",
              "La sesión Asia suele ser peligrosa para EUR/USD, GBP/USD, XAU/USD y los índices US",
              "Adaptar tu par y tu estrategia a la sesión mejora tu edge",
            ]}
          />

          <LessonExercice
            description="Analiza tu propia ventana de trading."
            steps={[
              "Anota las horas en que operas con más frecuencia.",
              "Identifica la sesión correspondiente: Asia, Londres o New York.",
              "Compara tus resultados según el horario (si llevas un journal).",
              "Observa EUR/USD entre las 14:00 y las 17:00 durante 3 días consecutivos.",
              "Compáralo con el comportamiento del mismo activo después de las 22:00.",
            ]}
          />
          <p className="text-sm text-zinc-500 leading-relaxed px-1">
            El objetivo: verificar si operas{" "}
            <span className="font-semibold text-zinc-400">en el momento correcto o solo cuando estás disponible</span>.
          </p>

          <LessonQuiz
            question="Operas EUR/USD a las 23:00 hora de París. El precio rompe una resistencia, pero vuelve de inmediato al rango y te saca por tu stop loss. ¿Cuál es la explicación más probable?"
            options={[
              "Tu estrategia ya no funciona, hay que revisar todo",
              "La sesión tiene poca liquidez, por eso los fakeouts son más frecuentes en EUR/USD a esa hora",
              "EUR/USD nunca respeta las resistencias",
              "El mercado forex está cerrado a las 23:00",
            ]}
            correctIndex={1}
            explanation="A las 23:00 hora de París, Londres y New York están cerrados. En EUR/USD, la liquidez suele ser más baja, los spreads pueden ampliarse y las rupturas son menos confiables. Es exactamente la trampa de la sesión Asia en los pares europeos/US. La opción A es demasiado radical (tu estrategia puede funcionar muy bien en el overlap Londres-NY). La opción C es falsa (EUR/USD respeta perfectamente las resistencias cuando hay liquidez). La opción D es incorrecta: el forex está abierto, pero no siempre es bien operable. Este mismo principio aplica a XAU/USD, los índices US y BTC/USD, el timing es universal, no solo forex."
            answerExplanations={[
              "Falso. Tu estrategia no es el problema aquí. El problema viene del contexto horario, no del análisis técnico. Una estrategia puede funcionar perfectamente en el overlap y fallar de noche.",
              "Correcto. A las 23:00 hora de París, Londres y New York están cerrados. La liquidez en EUR/USD es baja, los spreads se amplían y las rupturas son menos confiables. Es la trampa clásica de la sesión Asia en los pares europeos.",
              "Falso. EUR/USD respeta muy bien los niveles técnicos, pero solo cuando hay liquidez, es decir principalmente durante las sesiones Londres y New York.",
              "Falso. El forex está técnicamente abierto 24/7. Pero 'abierto' no significa 'operable en buenas condiciones'.",
            ]}
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => { const p = getStoredProgress(); markLessonComplete(p, "macro-intermediaire", "lecon4"); setDone(true); }}
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
                  <p className="text-xs text-zinc-500 mt-0.5">La próxima lección (Las correlaciones) estará disponible pronto.</p>
                </div>
              </div>
            )}

            {/* Navegación */}
            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/formations/macro/intermediaire/lecon3"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lección 3. CPI, PPI e inflación
              </Link>
              <span className="text-sm text-zinc-700 cursor-default">
                Las correlaciones. Pronto disponible →
              </span>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
