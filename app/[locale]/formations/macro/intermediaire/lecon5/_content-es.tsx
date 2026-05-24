"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { CorrelationMatrixDiagram } from "@/app/components/charts/CorrelationMatrixDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Hawkish vs Dovish",                       href: "/formations/macro/intermediaire/lecon1", disabled: false },
  { id: "lecon2", title: "Entender el calendario económico",         href: "/formations/macro/intermediaire/lecon2", disabled: false },
  { id: "lecon3", title: "CPI, PPI e inflación",                     href: "/formations/macro/intermediaire/lecon3", disabled: false },
  { id: "lecon4", title: "Sesiones de trading y liquidity",          href: "/formations/macro/intermediaire/lecon4", disabled: false },
  { id: "lecon5", title: "Las correlaciones",                        href: "/formations/macro/intermediaire/lecon5", disabled: false },
  { id: "lecon6", title: "Construir tu sesgo semanal",               href: null,                                     disabled: true  },
];

export default function ContentEs() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-intermediaire", "lecon5"));
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
          <span className="text-zinc-500">Lección 5</span>
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
            Las correlaciones, cómo los mercados se mueven juntos (y por qué caes en la trampa)
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Abrir 3 trades diferentes no significa tomar 3 riesgos diferentes.
            </p>
            <p className="text-[15px] text-zinc-400 leading-relaxed mt-2">
              A veces, crees diversificar. En realidad, apilas la misma apuesta.
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
              const isCurrent = lesson.id === "lecon5";
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
            <span className="ml-auto text-xs text-zinc-600">5 / 6 lecciones</span>
          </div>
        </header>

        {/* ── Contenido ── */}
        <div className="space-y-8">

          {/* Bloque 1 — Qué es una correlación */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Qué es una correlación</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Una correlación mide la forma en que dos activos se mueven juntos.
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                { bold: "+1", rest: " = se mueven casi igual" },
                { bold: "0", rest: " = sin relación clara" },
                { bold: "-1", rest: " = se mueven en sentido inverso" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Ejemplos:
            </p>
            <ul className="space-y-1.5 mb-5">
              {[
                { bold: "EUR/USD y GBP/USD", rest: " suben a menudo juntos (correlación positiva fuerte)" },
                { bold: "XAU/USD y DXY", rest: " se mueven a menudo en sentido inverso (correlación negativa fuerte)" },
                { bold: "BTC/USD y Nasdaq", rest: " están a menudo correlacionados desde 2022 (correlación positiva)" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>

            {/* Componente visual */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden mb-5">
              <CorrelationMatrixDiagram />
            </div>

            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Dos gráficos diferentes pueden esconder el mismo trade.
              </p>
            </div>
          </section>

          {/* Bloque 2 — Las correlaciones mayores a conocer */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Las correlaciones mayores a conocer</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Estas son las relaciones más útiles a vigilar:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                { bold: "EUR/USD vs GBP/USD", rest: ": correlación positiva fuerte, a menudo alrededor de ", val: "+0.85" },
                { bold: "EUR/USD vs USD/CHF", rest: ": correlación negativa muy fuerte, a menudo alrededor de ", val: "-0.95" },
                { bold: "XAU/USD vs DXY", rest: ": correlación negativa fuerte, a menudo alrededor de ", val: "-0.80" },
                { bold: "Nasdaq vs DXY", rest: ": correlación negativa moderada, a menudo alrededor de ", val: "-0.60" },
                { bold: "BTC/USD vs Nasdaq", rest: ": correlación positiva fuerte desde 2022, a menudo alrededor de ", val: "+0.75" },
                { bold: "WTI vs USD/CAD", rest: ": correlación negativa fuerte, a menudo alrededor de ", val: "-0.75" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>
                    <span className="font-semibold text-zinc-200">{item.bold}</span>
                    {item.rest}
                    <span className="font-semibold text-zinc-200">{item.val}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="space-y-1.5 mb-5">
              {[
                { pre: "Cuando el DXY sube, ", bold: "XAU/USD", post: " a menudo está bajo presión." },
                { pre: "Cuando el Nasdaq sube, ", bold: "BTC/USD", post: " puede seguir." },
                { pre: "Cuando el DXY cae, ", bold: "XAU/USD", post: " puede respirar." },
              ].map((item, i) => (
                <p key={i} className="text-zinc-300 leading-relaxed text-sm">
                  {item.pre}<span className="font-semibold text-zinc-200">{item.bold}</span>{item.post}
                </p>
              ))}
            </div>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Conocer 6 correlaciones mayores es saber leer 6 mercados mirando 1 solo gráfico.
              </p>
            </div>
          </section>

          {/* Bloque 3 — La trampa de la falsa diversificación */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">La trampa de la falsa diversificación</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Caso clásico:
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-2">Abres:</p>
            <ul className="space-y-1.5 mb-4">
              {["long EUR/USD", "long GBP/USD", "short USD/CHF"].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Crees tener 3 trades diferentes.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              En realidad, sobre todo tomaste{" "}
              <span className="font-semibold text-zinc-200">3 posiciones anti-dólar</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Si el dólar explota tras un FOMC hawkish, puedes perder en las 3 al mismo tiempo.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Cálculo concreto</span>:
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                { bold: "2% de riesgo por trade", rest: " (gestión sana)" },
                { bold: "3 trades correlacionados", rest: " (long EUR/USD + long GBP/USD + short USD/CHF)" },
                { bold: "FOMC hawkish sorpresa", rest: " → el dólar explota" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>Tomas <span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Resultado:{" "}
              <span className="font-semibold text-zinc-200">-6% de la cuenta en una sola news</span>. Gestionaste bien tu riesgo por trade. Pero no viste que tus 3 trades eran{" "}
              <span className="font-semibold text-zinc-200">el mismo trade</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Sobre 500€, son{" "}
              <span className="font-semibold text-zinc-200">-30€ en una hora</span>. Sobre 2000€, son{" "}
              <span className="font-semibold text-zinc-200">-120€</span>. Y lo peor: vas a pensar que es &apos;mala suerte&apos;. Cuando en realidad es solo un riesgo mal calculado.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Misma lógica con</span>:
            </p>
            <ul className="space-y-1.5 mb-4">
              {["long XAU/USD", "long BTC/USD", "long Nasdaq"].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Crees diversificar entre oro, crypto e índices. Pero si el mercado pasa a risk-off y el DXY sube,{" "}
              <span className="font-semibold text-zinc-200">XAU/USD puede caer, BTC/USD puede caer, y el Nasdaq también puede caer</span>.
            </p>

            {/* Encadré 💰 Realidad del retail */}
            <div className="bg-zinc-800/50 border-l-4 border-amber-400 px-5 py-4 rounded">
              <div className="flex items-center gap-2 mb-2">
                <span>💰</span>
                <span className="text-sm font-bold text-amber-400 tracking-wide">Realidad del retail</span>
              </div>
              <p className="text-base text-zinc-300 leading-relaxed">
                El retail cree diversificar porque los nombres cambian. Los pros miran el riesgo escondido detrás.
              </p>
            </div>
          </section>

          {/* Bloque 4 — Usar las correlaciones como confirmación */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Usar las correlaciones como confirmación</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Las correlaciones no solo sirven para evitar el sobre-riesgo. También sirven para{" "}
              <span className="font-semibold text-zinc-200">confirmar un trade</span>.
            </p>
            <div className="space-y-4 mb-5">
              <div>
                <p className="text-sm font-semibold text-zinc-200 mb-2">Si quieres shortear EUR/USD:</p>
                <ul className="space-y-1.5">
                  {[
                    "DXY debe idealmente subir",
                    "GBP/USD también debe estar débil",
                    "USD/CHF debe confirmar la fuerza del dólar",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-200 mb-2">Si quieres comprar XAU/USD:</p>
                <ul className="space-y-1.5">
                  {[
                    "DXY debe idealmente bajar",
                    "los yields US deben estar bajo presión",
                    "XAU/USD debe mantener una estructura alcista",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-200 mb-2">Si quieres comprar BTC/USD:</p>
                <ul className="space-y-1.5">
                  {[
                    "Nasdaq debe idealmente estar fuerte",
                    "el DXY no debe explotar al alza",
                    "el contexto risk-on debe sostener los activos riesgosos",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Un buen trade rara vez está solo. Los mercados alrededor deben confirmar.
              </p>
            </div>
          </section>

          {/* Bloque 5 — Cuando las correlaciones se rompen */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Cuando las correlaciones se rompen</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Una correlación no es una ley fija. Puede romperse.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Y cuando se rompe, a menudo es una{" "}
              <span className="font-semibold text-zinc-200">señal importante</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Ejemplos</span>:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                { bold: "BTC/USD sube mientras el Nasdaq baja", rest: " → posible compra específica en crypto o flujo institucional" },
                { bold: "XAU/USD sube mientras el DXY sube", rest: " → posible estrés geopolítico o búsqueda de safe-haven extrema" },
                { bold: "EUR/USD baja pero GBP/USD se mantiene", rest: " → posible news específica al euro o a la libra" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Una ruptura de correlación no significa &apos;error del mercado&apos;. Significa:{" "}
              <span className="font-semibold text-zinc-200">algo específico está pasando</span>.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Cuando una correlación se rompe, el mercado te muestra dónde mirar.
              </p>
            </div>
          </section>

          {/* Bloque 6 — La regla pro de risk management */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">La regla pro de risk management</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              <span className="font-semibold text-zinc-200">Regla simple</span>: nunca demasiados trades fuertemente correlacionados abiertos al mismo tiempo.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Si tomas dos posiciones que van en el mismo sentido macro:
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                { bold: "reduces el tamaño", rest: "" },
                { bold: "asumes que el riesgo es acumulado", rest: "" },
                { bold: "evitas creer que es diversificación", rest: "" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Ejemplo</span>:
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Quieres comprar XAU/USD y BTC/USD.
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                { pre: "Si el DXY sube con fuerza, ", bold: "los dos pueden sufrir", post: "." },
                { pre: "Si el Nasdaq cae, ", bold: "BTC/USD puede ser arrastrado", post: "." },
                { pre: "Si el mercado pasa a risk-off, ", bold: "XAU/USD puede resistir a veces, pero BTC/USD y Nasdaq son a menudo vulnerables", post: "." },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>{item.pre}<span className="font-semibold text-zinc-200">{item.bold}</span>{item.post}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Por eso no lo cuentas como dos riesgos separados.{" "}
              <span className="font-semibold text-zinc-200">Lo cuentas como un bloque de riesgo.</span>
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                La diversificación empieza cuando los riesgos no caen juntos.
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
              "Una correlación muestra si dos activos se mueven juntos o en sentido inverso",
              "XAU/USD, BTC/USD, Nasdaq y DXY deben vigilarse juntos",
              "Varios trades pueden esconder el mismo riesgo macro",
              "Una ruptura de correlación a menudo es una señal anticipada",
            ]}
          />

          <LessonExercice
            description="Antes de abrir varios trades, verifica si realmente tomas varios riesgos."
            steps={[
              "Elige 3 activos que operas a menudo: por ejemplo XAU/USD, BTC/USD y Nasdaq.",
              "Compara su dirección con el DXY en las últimas sesiones.",
              "Verifica si tus setups van todos en el mismo sentido macro.",
              "Si dos activos están fuertemente correlacionados, divide el tamaño o elige el mejor setup.",
              "Anota si una correlación se rompe: a menudo es la señal más interesante.",
            ]}
          />
          <p className="text-sm text-zinc-500 leading-relaxed px-1">
            El objetivo:{" "}
            <span className="font-semibold text-zinc-400">dejar de apilar el mismo riesgo sin darte cuenta</span>.
          </p>

          <LessonQuiz
            question="Abres long XAU/USD, long BTC/USD y long Nasdaq el mismo día. El DXY empieza a subir con fuerza. ¿Cuál es el verdadero peligro?"
            options={[
              "Ninguno, son tres mercados diferentes",
              "Probablemente estás expuesto varias veces al mismo riesgo macro",
              "El DXY solo concierne a los pares forex",
              "El BTC/USD nunca tiene relación con el Nasdaq",
            ]}
            correctIndex={1}
            explanation="XAU/USD, BTC/USD y Nasdaq pueden todos sufrir en un contexto de dólar fuerte o risk-off. Aunque los activos sean diferentes, el riesgo puede ser el mismo. La opción A ignora las correlaciones (lectura principiante). La opción C es falsa porque el DXY también influye en el oro, la crypto y los índices US. La opción D es falsa desde que BTC/USD se comporta a menudo como un activo riesgoso correlacionado al Nasdaq (desde 2022)."
            answerExplanations={[
              "Falso. XAU/USD, BTC/USD y Nasdaq comparten una exposición al dólar fuerte y al risk-off. Aunque los nombres sean diferentes, todos pueden bajar al mismo tiempo.",
              "Correcto. XAU/USD, BTC/USD y Nasdaq pueden todos sufrir en un contexto de dólar fuerte o risk-off. El riesgo puede ser el mismo, aunque los activos sean diferentes.",
              "Falso. El DXY también influye en el oro (XAU/USD), la crypto (BTC/USD) y los índices US (Nasdaq). No está reservado a los pares forex.",
              "Falso. Desde 2022, BTC/USD se comporta a menudo como un activo riesgoso correlacionado al Nasdaq. Los dos tienden a subir o bajar juntos.",
            ]}
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => { const p = getStoredProgress(); markLessonComplete(p, "macro-intermediaire", "lecon5"); setDone(true); }}
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
                  <p className="text-xs text-zinc-500 mt-0.5">La próxima lección (Construir tu sesgo semanal) estará disponible pronto.</p>
                </div>
              </div>
            )}

            {/* Navegación */}
            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/formations/macro/intermediaire/lecon4"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lección 4. Sesiones de trading y liquidity
              </Link>
              <span className="text-sm text-zinc-700 cursor-default">
                Construir tu sesgo semanal. Pronto disponible →
              </span>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
