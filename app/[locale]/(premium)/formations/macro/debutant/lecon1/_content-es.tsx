"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { MacroCalendarDiagram } from "@/app/components/charts/MacroCalendarDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Qué es la macro",                       href: "/formations/macro/debutant/lecon1", disabled: false },
  { id: "lecon2", title: "Los 4 grandes bancos centrales",        href: null,                                disabled: true  },
  { id: "lecon3", title: "Los datos macro a vigilar",             href: null,                                disabled: true  },
  { id: "lecon4", title: "Entender la inflación",                 href: null,                                disabled: true  },
  { id: "lecon5", title: "El rol del dólar en el mundo",          href: null,                                disabled: true  },
  { id: "lecon6", title: "Macro y risk management",               href: null,                                disabled: true  },
];

export default function ContentEs() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-debutant", "lecon1"));
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
          <span className="text-zinc-500">Lección 1</span>
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
            Qué es la macro y por qué importa en trading
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Un evento macro puede borrar el 2% de tu capital en 2 minutos.
            </p>
            <p className="text-[15px] text-zinc-400 leading-relaxed mt-2">
              En EUR/USD, en el oro, en el Nasdaq, en el Bitcoin, no importa qué operes, la macro te cae encima.
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
            <span className="ml-auto text-xs text-zinc-600">1 / 6 lecciones</span>
          </div>
        </header>

        {/* ── Contenu ── */}
        <div className="space-y-8">

          {/* Bloc 1 — La macro, c'est quoi exactement ? */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">¿Qué es exactamente la macro?</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              La <span className="font-semibold text-zinc-200">macro</span> (abreviación de macroeconomía) es el estudio de las <span className="font-semibold text-zinc-200">grandes fuerzas</span> que mueven la economía mundial: tasas de interés, inflación, empleo, crecimiento, decisiones de los bancos centrales.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              En trading, estas fuerzas tienen un impacto directo en <span className="font-semibold text-zinc-200">todos los mercados</span>: forex, índices, crypto, materias primas, bonos.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Una analogía simple: <span className="font-semibold text-zinc-200">la técnica te dice DÓNDE entrar. La macro te dice POR QUÉ se mueve el mercado.</span>
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded mb-4">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Si ignoras la macro, sufres el mercado. Si la entiendes, lo anticipas.
              </p>
            </div>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
              <p className="text-sm text-zinc-400 leading-relaxed">
                <span className="text-white font-medium">Para recordar:</span> Puedes ignorar la macro y operar solo la técnica. Pero serás barrido regularmente por movimientos que no entiendes. Entender la macro es dejar de ser sorprendido.
              </p>
            </div>
          </section>

          {/* Bloc 2 — Pourquoi un trader doit s'y intéresser */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Por qué un trader debe interesarse</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Imagina este escenario.</p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Detectas un setup perfecto en EUR/USD a las 14h25. Todas las velas están alineadas, tu plan de trade es sólido, entras en long. A las 14h30, EUR/USD cae 80 pips en 2 minutos. Tu stop salta. No entiendes nada.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-2">
              Y no es solo en el EUR/USD. Con la misma noticia macro, probablemente hubieras visto:
            </p>
            <ul className="space-y-1.5 mb-3">
              {[
                { asset: "XAU/USD", move: "-25 a -40$ en 2 minutos" },
                { asset: "Nasdaq", move: "-1 a -1.5% en los primeros minutos" },
                { asset: "BTC/USD", move: "-300 a -800$ según la volatilidad del momento" },
              ].map((item) => (
                <li key={item.asset} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.asset}</span>: {item.move}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              La macro no toca solo un par. Toca todo el mercado al mismo tiempo.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Lo que pasó</span>: a las 14h30 (hora de París), se publicaron los datos mensuales de inflación de EE.UU. Más altos de lo esperado. El mercado anticipó que la Fed iba a ser más hawkish. El dólar explotó al alza. Tu EUR/USD long, que apostaba a un dólar débil, fue barrido.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              <span className="font-semibold text-zinc-200">La técnica sola no podía advertirte.</span> Solo la macro (el calendario económico + entender los datos) podía hacerte <span className="font-semibold text-zinc-200">evitar</span> ese trade.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded mb-4">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                El mercado no premia al mejor gráfico. Premia al que sabe por qué se mueve.
              </p>
            </div>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
              <p className="text-sm text-zinc-400 leading-relaxed">
                <span className="text-white font-medium">Para recordar:</span> La macro no reemplaza a la técnica. La <span className="font-semibold text-zinc-300">complementa</span>. Te dice cuándo NO operar, y cuándo un movimiento probablemente va a durar.
              </p>
            </div>
          </section>

          {/* Bloc 3 — Les 4 forces macro */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Las 4 fuerzas macro que mueven los mercados</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              No necesitas convertirte en economista. Pero 4 fuerzas mueven el 90% de los mercados.
            </p>
            <div className="space-y-3 mb-6">
              {[
                {
                  n: "1",
                  label: "Tasas de interés",
                  text: "fijadas por los bancos centrales. Tasas que suben → divisa que se fortalece. Tasas que bajan → divisa que se debilita.",
                },
                {
                  n: "2",
                  label: "Inflación",
                  text: "la subida de los precios. Inflación alta → el banco central se ve forzado a subir las tasas para frenarla.",
                },
                {
                  n: "3",
                  label: "Empleo",
                  text: "un dato como el NFP (publicado cada primer viernes del mes) puede mover violentamente todos los activos al mismo tiempo.",
                },
                {
                  n: "4",
                  label: "Crecimiento económico",
                  text: "medido por el PIB. Economía fuerte → divisa atractiva para los inversionistas extranjeros.",
                },
              ].map((item) => (
                <div key={item.n} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
                  <span className="text-xs font-bold text-zinc-500 shrink-0 mt-0.5">{item.n}.</span>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    <span className="font-semibold text-zinc-200">{item.label}</span> — {item.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-zinc-800/30 rounded-xl px-4 py-3 mb-4">
              <p className="text-sm text-zinc-300 leading-relaxed mb-2">
                Un NFP que sorprende puede mover:
              </p>
              <ul className="space-y-1.5">
                {[
                  { asset: "EUR/USD", move: "de 100 a 200 pips" },
                  { asset: "XAU/USD", move: "de 30 a 60$" },
                  { asset: "Nasdaq", move: "de 1 a 2%" },
                  { asset: "BTC/USD", move: "de 500 a 1500$" },
                ].map((item) => (
                  <li key={item.asset} className="flex items-start gap-2.5 text-sm text-zinc-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                    <span><span className="font-semibold text-zinc-200">{item.asset}</span> {item.move}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-zinc-400 mt-2 italic">Todo eso en pocos minutos.</p>
            </div>

            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Ejemplo concreto del encadenamiento</p>
            <div className="bg-zinc-800/50 border border-zinc-700/40 rounded-xl px-4 py-4 mb-3">
              <div className="space-y-1.5">
                {[
                  "La inflación US sube al 4% (en vez del 3% esperado).",
                  "→ La Fed anuncia que va a subir sus tasas más rápido.",
                  "→ El dólar sube contra todas las divisas.",
                  "→ EUR/USD pierde 150 pips en un día.",
                ].map((item, i) => (
                  <p key={i} className={`text-sm leading-relaxed ${item.startsWith("→") ? "text-emerald-400 font-medium" : "text-zinc-300"}`}>
                    {item}
                  </p>
                ))}
              </div>
            </div>
            <p className="text-sm text-zinc-400 italic leading-relaxed mb-4">
              <span className="font-semibold text-zinc-300">Una causa macro, una reacción en cadena, un movimiento violento.</span>
            </p>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
              <p className="text-sm text-zinc-400 leading-relaxed">
                <span className="text-white font-medium">Para recordar:</span> Estas 4 fuerzas están conectadas. La inflación fuerza las tasas. Las tasas mueven las divisas. Las divisas mueven los mercados. <span className="font-semibold text-zinc-300">Seguir la cadena = anticipar el movimiento.</span>
              </p>
            </div>
          </section>

          {/* Bloc 4 — Qui décide quoi ? */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">¿Quién decide qué?</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              <span className="font-semibold text-zinc-200">Los actores principales</span> con los que te vas a cruzar en la macro:
            </p>
            <ul className="space-y-3 mb-5">
              {[
                {
                  label: "Los bancos centrales",
                  text: "(Fed para EE.UU., ECB para Europa, BoE para Reino Unido, BoJ para Japón). Son ellos quienes fijan las tasas de interés y orientan la política monetaria.",
                },
                {
                  label: "Los gobiernos",
                  text: "toman las decisiones de política fiscal (impuestos, gasto público, deuda).",
                },
                {
                  label: "Las agencias estadísticas",
                  text: "publican los datos oficiales de inflación, empleo, PIB. Son sus publicaciones las que disparan los movimientos brutales en los mercados.",
                },
                {
                  label: "Los inversionistas institucionales",
                  text: "bancos, fondos de inversión, gestores de activos. Representan la mayoría del volumen en los mercados. Cuando compran o venden en masa basados en una noticia macro, el precio se mueve violentamente.",
                },
              ].map((item) => (
                <li key={item.label} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.label}</span> {item.text}</span>
                </li>
              ))}
            </ul>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded mb-4">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                El retail no hace el mercado. El retail lo sufre o lo sigue.
              </p>
            </div>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
              <p className="text-sm text-zinc-400 leading-relaxed">
                <span className="text-white font-medium">Para recordar:</span> El retail (los traders particulares como tú) representa una fracción minúscula del volumen. <span className="font-semibold text-zinc-300">El mercado se mueve por las decisiones de los bancos centrales y los flujos de los institucionales.</span> Entender la macro = entender lo que ellos miran.
              </p>
            </div>
          </section>

          {/* Bloc 5 — Le calendrier économique */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">El calendario económico: tu herramienta n°1</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              El <span className="font-semibold text-zinc-200">calendario económico</span> es una herramienta gratuita que lista todas las publicaciones macro por venir, clasificadas por importancia.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              En sitios como <span className="font-semibold text-zinc-200">Investing.com</span> o <span className="font-semibold text-zinc-200">Forex Factory</span>, cada evento se marca con un ícono de impacto:
            </p>
            <ul className="space-y-2 mb-5">
              {[
                { label: "Impacto bajo", desc: "(1 estrella / verde) : poco movimiento esperado", color: "bg-emerald-400/60" },
                { label: "Impacto medio", desc: "(2 estrellas / amarillo o naranja) : movimiento moderado posible", color: "bg-amber-400/60" },
                { label: "Impacto fuerte", desc: "(3 estrellas / rojo) : movimiento violento casi garantizado", color: "bg-red-500/60" },
              ].map((item) => (
                <li key={item.label} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className={`w-1.5 h-1.5 rounded-full ${item.color} shrink-0 mt-1.5`} />
                  <span><span className="font-semibold text-zinc-200">{item.label}</span> {item.desc}</span>
                </li>
              ))}
            </ul>

            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Los eventos de 3 estrellas que debes conocer sí o sí</p>
            <ul className="space-y-1.5 mb-5">
              {[
                "Decisiones de tasas de la Fed (FOMC)",
                "Decisiones de tasas del ECB",
                "NFP (Non-Farm Payrolls US)",
                "CPI (inflación US)",
                "Discursos de Jerome Powell o Christine Lagarde",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500/60 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="border border-zinc-800 rounded-xl overflow-hidden mb-5">
              <MacroCalendarDiagram locale="es" />
            </div>

            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded mb-4">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                El calendario económico es la diferencia entre operar y apostar.
              </p>
            </div>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
              <p className="text-sm text-zinc-400 leading-relaxed">
                <span className="text-white font-medium">Para recordar:</span> Antes de cada jornada de trading, revisa el calendario económico. Los eventos de 3 estrellas pueden transformar un setup perfecto en una trampa mortal. Mejor <span className="font-semibold text-zinc-300">no operar</span> en los 30 minutos antes y después de una publicación importante.
              </p>
            </div>
          </section>

          {/* Bloc 6 — Comment commencer concrètement */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Cómo empezar concretamente</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              No necesitas saber todo. Esta es la <span className="font-semibold text-zinc-200">rutina simple</span> de un trader que integra la macro a su workflow.
            </p>

            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Cada mañana (5 minutos)</p>
            <div className="space-y-2 mb-5">
              {[
                "Abre Investing.com o Forex Factory.",
                "Mira el calendario del día.",
                "Identifica los eventos de 3 estrellas → marca las horas.",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
                  <span className="text-xs font-bold text-zinc-500 shrink-0 mt-0.5">{i + 1}.</span>
                  <p className="text-sm text-zinc-300 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>

            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Durante tu sesión de trading</p>
            <ul className="space-y-2 mb-5">
              {[
                "Evita entrar en posición en los 30 minutos antes de un evento de 3 estrellas.",
                "Si ya tienes una posición abierta, verifica tu stop loss antes de la publicación.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  {item}
                </li>
              ))}
            </ul>

            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Una vez al mes (15 minutos)</p>
            <ul className="space-y-2 mb-5">
              {[
                "Lee un resumen de las decisiones de la Fed y el ECB (Reuters, Bloomberg, o un sitio en español como Bloomberg en Línea).",
                "Anota la evolución de las tasas de interés principales.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3 mb-4">
              <p className="text-sm text-zinc-400 leading-relaxed">
                <span className="text-white font-medium">Para recordar:</span> <span className="font-semibold text-zinc-300">Eso es todo.</span> Con estos 2 hábitos, ya estás por encima del 80% de los traders particulares que operan a ciegas.
              </p>
            </div>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                5 minutos al día para dejar de ser barrido. El mejor ratio tiempo/resultado de toda tu carrera de trader.
              </p>
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
              "La macro es el estudio de las grandes fuerzas económicas (tasas, inflación, empleo, crecimiento) que mueven los mercados.",
              "La técnica te dice DÓNDE entrar, la macro te dice POR QUÉ se mueve el mercado, las dos son complementarias.",
              "Las 4 fuerzas clave: tasas de interés, inflación, empleo, crecimiento económico.",
              "El calendario económico es tu herramienta n°1, evita operar en los 30 min antes/después de un evento de 3 estrellas.",
            ]}
          />

          <LessonExercice
            description="Esta semana, integra la macro a tu rutina de trading."
            steps={[
              "Entra a Investing.com o Forex Factory y busca el calendario económico.",
              "Filtra solo por los eventos de 3 estrellas para esta semana.",
              "Anota en un cuaderno (o una nota en tu teléfono) la fecha y hora de cada evento.",
              "Identifica al menos 2 eventos que involucren una divisa que operes (USD, EUR, GBP, JPY).",
              "Durante la semana, observa el gráfico del par involucrado 15 minutos antes de la publicación, en el momento de la publicación, y 30 minutos después.",
              "Anota lo que observas: amplitud del movimiento (en pips), dirección, duración.",
            ]}
          />
          <p className="text-sm text-zinc-500 leading-relaxed px-1">
            El objetivo: acostumbrarte a vincular los <span className="font-semibold text-zinc-400">movimientos brutales del mercado</span> con sus <span className="font-semibold text-zinc-400">causas macro</span>. Después de 2-3 semanas, empezarás a anticipar.
          </p>

          <LessonQuiz
            question="Detectas un setup perfecto en EUR/USD a las 14h25. Revisas el calendario: hay una publicación CPI US a las 14h30 (impacto 3 estrellas). ¿Qué haces?"
            options={[
              "Entro igual, mi análisis técnico es sólido",
              "Espero 30 minutos después de la publicación para ver cómo reacciona el mercado, y luego reevalúo mi setup",
              "Hago short en EUR/USD porque el CPI siempre baja el euro",
              "Cambio a H4 para ignorar el ruido de la news",
            ]}
            correctIndex={1}
            explanation="Una publicación de 3 estrellas puede mover EUR/USD de 80-150 pips en pocos minutos, en una dirección imprevisible. Entrar justo antes (opción A) equivale a apostar a cara o cruz. La opción C es falsa: el CPI puede subir o bajar el euro según los datos sorprendan al alza o a la baja. La opción D es una fuga, cambiar de timeframe no te protege del movimiento violento. La buena práctica: espera a que pase la news, observa la reacción del mercado, y opera después con la nueva información. Este principio aplica a todos los activos: forex, oro, índices, crypto."
            answerExplanations={[
              "Falso. Entrar justo antes de una publicación de 3 estrellas equivale a apostar a cara o cruz. EUR/USD puede moverse 80-150 pips en pocos minutos en una dirección imprevisible. Tu análisis técnico ya no cuenta, la macro lo aplasta todo.",
              "Correcto. La buena práctica: espera a que pase la news, observa la reacción del mercado, y opera después con la nueva información. Conservas tu setup Y sabes en qué dirección el mercado decidió ir.",
              "Falso. El CPI puede subir o bajar el euro según los datos sorprendan al alza o a la baja. No hay una dirección sistemática, lo que cuenta es la diferencia respecto a las expectativas.",
              "Falso. Cambiar de timeframe no te protege del movimiento violento. Un movimiento de 80-150 pips en M5 es un movimiento de 80-150 pips en H4 también. El timeframe no cambia la amplitud real.",
            ]}
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => { const p = getStoredProgress(); markLessonComplete(p, "macro-debutant", "lecon1"); setDone(true); }}
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
                  <p className="text-xs text-zinc-500 mt-0.5">La próxima lección (Los 4 grandes bancos centrales) estará disponible pronto.</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/formations/macro/debutant"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Volver al módulo
              </Link>
              <span className="text-sm text-zinc-700 cursor-default">
                Los 4 grandes bancos centrales. Próximamente →
              </span>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
