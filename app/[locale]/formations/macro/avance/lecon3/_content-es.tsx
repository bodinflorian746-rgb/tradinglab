"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { US10YHubDiagram } from "@/app/components/charts/US10YHubDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "FOMC",                        href: "/formations/macro/avance/lecon1", disabled: false },
  { id: "lecon2", title: "NFP",                         href: "/formations/macro/avance/lecon2", disabled: false },
  { id: "lecon3", title: "Los rendimientos de bonos US", href: "/formations/macro/avance/lecon3", disabled: false },
  { id: "lecon4", title: "Risk-on / Risk-off",          href: "/formations/macro/avance/lecon4", disabled: false },
];

export default function ContentEs() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-avance", "lecon3"));
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
          <span className="text-zinc-500">Lección 3</span>
        </nav>

        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">
              Avanzado
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
            Los rendimientos de bonos US — el mercado que dirige a todos los demás
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              El retail mira el oro, el Nasdaq o el Bitcoin.
            </p>
            <p className="text-[15px] text-zinc-400 leading-relaxed mt-2">
              Los pros miran primero los yields US.
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
              const isCurrent = lesson.id === "lecon3";
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
            <span className="ml-auto text-xs text-zinc-600">3 / 4 lecciones</span>
          </div>
        </header>

        {/* ── Contenu ── */}
        <div className="space-y-8">

          {/* Bloc 1 — Qué es un rendimiento de bonos */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Qué es un rendimiento de bonos</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Un rendimiento de bonos es la tasa que un gobierno paga para endeudarse.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              En Estados Unidos, estos bonos se llaman <span className="font-semibold text-zinc-200">US Treasuries</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-2">
              Los tres vencimientos principales:
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                { bold: "US2Y", suf: ": rendimiento a 2 años" },
                { bold: "US10Y", suf: ": rendimiento a 10 años" },
                { bold: "US30Y", suf: ": rendimiento a 30 años" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.suf}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              El más importante para los mercados: <span className="font-semibold text-zinc-200">US10Y</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-2">
              <span className="font-semibold text-zinc-200">¿Por qué?</span>
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Porque el 10 años US sirve de referencia mundial. Es la <span className="font-semibold text-zinc-200">&apos;tasa libre de riesgo&apos;</span> que las instituciones usan para comparar todos los demás activos.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Si la tasa libre de riesgo se vuelve atractiva, los activos riesgosos tienen que justificarse.
              </p>
            </div>
          </section>

          {/* Bloc 2 — Precio y rendimiento: la trampa de base */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Precio y rendimiento: la trampa de base</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Un bono funciona al <span className="font-semibold text-zinc-200">revés</span> de lo que muchos imaginan.
            </p>
            <div className="space-y-1.5 mb-4">
              {[
                { pre: "Cuando el precio del bono ", bold: "sube", mid: ", su rendimiento ", bold2: "baja", suf: "." },
                { pre: "Cuando el precio del bono ", bold: "baja", mid: ", su rendimiento ", bold2: "sube", suf: "." },
              ].map((item, i) => (
                <p key={i} className="text-zinc-300 leading-relaxed text-sm">
                  {item.pre}<span className="font-semibold text-zinc-200">{item.bold}</span>{item.mid}<span className="font-semibold text-zinc-200">{item.bold2}</span>{item.suf}
                </p>
              ))}
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Esto es crucial.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-2">
              Si los inversionistas venden los bonos US:
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                "el precio de los bonos baja",
                "los yields suben",
                "el mercado se vuelve más tenso",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Y cuando los yields suben, activos como <span className="font-semibold text-zinc-200">XAU/USD, Nasdaq y BTC/USD pueden sufrir</span>.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Cuando los yields suben, el mercado respira peor.
              </p>
            </div>
          </section>

          {/* Bloc 3 — Los 3 rendimientos a monitorear */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Los 3 rendimientos a monitorear</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              No necesitas mirar toda la curva cada mañana. Enfócate en <span className="font-semibold text-zinc-200">tres cifras</span>.
            </p>
            <div className="space-y-3 mb-5">
              {[
                {
                  bold: "US2Y",
                  body: "Refleja las expectativas de tasas Fed a corto plazo. Se mueve fuerte con CPI, NFP y FOMC.",
                },
                {
                  bold: "US10Y",
                  body: "Es el benchmark mundial. Impacta directamente a XAU/USD, Nasdaq, BTC/USD y DXY.",
                  highlight: true,
                },
                {
                  bold: "US30Y",
                  body: "Refleja las anticipaciones muy largas: inflación futura, deuda, crecimiento a largo plazo.",
                },
              ].map((item) => (
                <div key={item.bold} className="bg-zinc-800/30 rounded-xl px-4 py-3">
                  <p className="text-sm font-semibold text-zinc-200 mb-1">{item.bold}</p>
                  <p className="text-sm text-zinc-300">{item.body}</p>
                </div>
              ))}
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-2">
              <span className="font-semibold text-zinc-200">En la práctica</span>:
            </p>
            <ul className="space-y-1.5 mb-5">
              {[
                "US2Y = expectativas Fed corto plazo",
                "US10Y = sentimiento macro global",
                "US30Y = visión largo plazo",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                El 2 años escucha a la Fed. El 10 años escucha a la economía.
              </p>
            </div>
          </section>

          {/* Bloc 4 — US10Y vs XAU/USD, Nasdaq y BTC/USD */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">US10Y vs XAU/USD, Nasdaq y BTC/USD</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              El <span className="font-semibold text-zinc-200">US10Y</span> es uno de los gráficos más importantes para operar varios activos.
            </p>
            <div className="space-y-4 mb-5">
              {[
                {
                  bold: "US10Y vs XAU/USD",
                  intro: "El oro no paga rendimiento. Entonces cuando el rendimiento del 10 años US sube, el oro se vuelve",
                  boldMid: "menos atractivo",
                  items: ["US10Y pasa de 4.0% a 4.5%", "XAU/USD puede perder 50 a 100$", "sobre todo si el DXY también sube"],
                },
                {
                  bold: "US10Y vs Nasdaq",
                  intro: "Las acciones tech son",
                  boldMid: "muy sensibles a las tasas",
                  body: "¿Por qué? Porque sus valuaciones dependen mucho de las ganancias futuras. Cuando las tasas suben, esas ganancias futuras valen menos hoy.",
                  items: ["US10Y +50 basis points", "Nasdaq puede corregir de 2% a 3%"],
                },
                {
                  bold: "US10Y vs BTC/USD",
                  intro: "BTC/USD a menudo se trata como un",
                  boldMid: "activo riesgoso",
                  body: "Cuando los yields suben, el mercado a veces prefiere el rendimiento seguro antes que el riesgo crypto.",
                  items: ["US10Y rompe 4.5%", "BTC/USD puede perder su momentum", "sobre todo si el Nasdaq baja al mismo tiempo"],
                },
              ].map((item) => (
                <div key={item.bold} className="bg-zinc-800/30 rounded-xl px-4 py-3">
                  <p className="text-sm font-semibold text-zinc-200 mb-2">{item.bold}</p>
                  <p className="text-sm text-zinc-300 mb-2">
                    {item.intro} <span className="font-semibold text-zinc-200">{item.boldMid}</span>.
                  </p>
                  {item.body && (
                    <p className="text-sm text-zinc-300 mb-2">{item.body}</p>
                  )}
                  <p className="text-sm font-semibold text-zinc-400 mb-1">Ejemplo:</p>
                  <ul className="space-y-1">
                    {item.items.map((sub, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-zinc-300">
                        <div className="w-1 h-1 rounded-full bg-zinc-600 shrink-0 mt-1.5" />
                        <span>{sub}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Composant visuel */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden mb-5">
              <US10YHubDiagram locale="es" />
            </div>

            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded mb-4">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                El oro, la tech y el Bitcoin reaccionan a menudo a la misma cifra. Y esa cifra es US10Y.
              </p>
            </div>
            <div className="bg-zinc-800/50 border-l-4 border-amber-400 px-5 py-4 rounded">
              <div className="flex items-center gap-2 mb-2">
                <span>💰</span>
                <span className="text-sm font-bold text-amber-400 tracking-wide">Realidad del retail</span>
              </div>
              <p className="text-base text-zinc-300 leading-relaxed">
                El retail mira XAU/USD. El pro mira lo que empuja XAU/USD antes de que la vela arranque.
              </p>
            </div>
          </section>

          {/* Bloc 5 — La curva de tasas */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">La curva de tasas</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              La <span className="font-semibold text-zinc-200">curva de tasas</span> compara los rendimientos según los vencimientos.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              La más seguida: <span className="font-semibold text-zinc-200">US10Y - US2Y</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Tres situaciones:
            </p>
            <div className="space-y-3 mb-5">
              {[
                {
                  bold: "Curva normal",
                  body: "US10Y > US2Y. Ejemplo: 10Y a 4.5%, 2Y a 4.0%.",
                  result: "El mercado ve una economía relativamente sana.",
                },
                {
                  bold: "Curva plana",
                  body: "US10Y ≈ US2Y.",
                  result: "El mercado duda.",
                },
                {
                  bold: "Curva invertida",
                  body: "US10Y < US2Y. Ejemplo: 10Y a 4.0%, 2Y a 4.5%.",
                  result: "El mercado anticipa una desaceleración o una recesión futura.",
                },
              ].map((item) => (
                <div key={item.bold} className="bg-zinc-800/30 rounded-xl px-4 py-3">
                  <p className="text-sm font-semibold text-zinc-200 mb-1">{item.bold}</p>
                  <p className="text-sm text-zinc-300">{item.body}</p>
                  <p className="text-sm text-zinc-400 italic mt-1">→ {item.result}</p>
                </div>
              ))}
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              <span className="font-semibold text-zinc-200">Desde 1955, cada inversión duradera de la curva ha sido seguida de una recesión en Estados Unidos en los 6 a 24 meses siguientes.</span>
              {" "}No es un timing perfecto. Pero es una <span className="font-semibold text-zinc-200">señal macro mayor</span>.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                El 10Y te muestra la presión del día. La curva te muestra el riesgo del ciclo.
              </p>
            </div>
          </section>

          {/* Bloc 6 — Cómo integrarlo en tu rutina */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Cómo integrarlo en tu rutina</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Antes de la apertura US, agrega los yields a tu check.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Rutina simple</span>:
            </p>
            <div className="space-y-2 mb-5">
              {[
                { step: "1.", bold: "Mira US10Y", suf: ": ¿está al alza o a la baja?" },
                { step: "2.", bold: "Anota el nivel clave", suf: ": 4%, 4.5% y 5% son umbrales psicológicos." },
                { step: "3.", bold: "Compara con tu activo", suf: ": si quieres ir long XAU/USD pero US10Y sube fuerte, hay conflicto." },
                { step: "4.", bold: "Mira DXY", suf: ": US10Y al alza + DXY al alza = presión fuerte sobre el oro y los activos riesgosos." },
                { step: "5.", bold: "Verifica Nasdaq y BTC/USD", suf: ": si los dos se debilitan mientras US10Y sube, el mercado está reduciendo riesgo." },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    <span className="font-semibold text-zinc-200">{item.step} {item.bold}</span>{item.suf}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-2">
              <span className="font-semibold text-zinc-200">Trampas a evitar</span>:
            </p>
            <ul className="space-y-1.5 mb-5">
              {[
                "confundir precio del bono y rendimiento",
                "creer que la correlación es automática",
                "ignorar los umbrales psicológicos",
                "olvidar las tasas reales",
                "mirar US10Y sin mirar US2Y",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              La <span className="font-semibold text-zinc-200">tasa real</span> cuenta mucho para el oro:
            </p>
            <div className="bg-zinc-800/30 rounded-xl px-4 py-3 mb-5">
              <p className="text-sm font-semibold text-zinc-200 text-center">
                tasa real = rendimiento nominal - inflación
              </p>
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Si el rendimiento sube pero la inflación también sube, el impacto puede ser distinto.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                US10Y → DXY → XAU/USD, Nasdaq, BTC/USD. Esta es a menudo la cadena invisible del mercado.
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
              "US10Y es el benchmark mundial que los pros monitorean cada día",
              "Cuando los yields suben, XAU/USD, Nasdaq y BTC/USD pueden estar bajo presión",
              "La curva US10Y - US2Y da una señal clave sobre el ciclo económico",
              "Los yields deben leerse con DXY, inflación y contexto macro",
            ]}
          />

          <LessonExercice
            description="Agrega los yields US a tu rutina pre-mercado."
            steps={[
              "Abre US10Y y anota su dirección del día.",
              "Anota si está cerca de un umbral clave: 4%, 4.5% o 5%.",
              "Compara con XAU/USD: ¿el oro confirma el movimiento?",
              "Compara con Nasdaq y BTC/USD: ¿los activos riesgosos reaccionan?",
              "Mira US2Y y verifica si la curva 10Y - 2Y es normal, plana o invertida.",
            ]}
          />
          <p className="text-sm text-zinc-500 leading-relaxed px-1">
            El objetivo: entender si tu trade{" "}
            <span className="font-semibold text-zinc-400">sigue o pelea contra el mercado de bonos</span>.
          </p>

          <LessonQuiz
            question="US10Y sube fuertemente, DXY también sube, y XAU/USD rompe un soporte. ¿Cuál es la lectura más profesional?"
            options={[
              "El oro baja sin razón, hay que comprar el dip sí o sí",
              "Los yields y el dólar confirman una presión macro sobre XAU/USD",
              "US10Y solo concierne a los bonos, no al oro",
              "El Nasdaq debería subir sí o sí cuando las tasas suben",
            ]}
            correctIndex={1}
            explanation="Cuando US10Y sube, el rendimiento sin riesgo se vuelve más atractivo. Si DXY sube al mismo tiempo, la presión sobre XAU/USD se refuerza. La opción A ignora el contexto macro (comprar un dip sin analizar yields ni dólar = lectura principiante). La opción C es falsa: US10Y influye directamente al oro, los índices y la crypto. La opción D está generalmente invertida: tasas más altas pesan a menudo sobre el Nasdaq porque reducen la valuación de las ganancias futuras de las empresas tech."
            answerExplanations={[
              "Falso. El oro baja por una razón precisa: el rendimiento sin riesgo sube (US10Y) y el dólar se fortalece (DXY). Ignorar este contexto y comprar el dip es lectura principiante.",
              "Correcto. US10Y al alza vuelve la tasa libre de riesgo más atractiva. DXY al alza refuerza la presión sobre XAU/USD. Los dos elementos confirman la presión macro bajista sobre el oro.",
              "Falso. US10Y influye directamente al oro, los índices y la crypto vía las tasas reales, el DXY y el sentimiento de riesgo global.",
              "Falso. Tasas más altas pesan generalmente sobre el Nasdaq porque reducen la valuación de las ganancias futuras de las empresas tech. La relación es inversa.",
            ]}
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => { const p = getStoredProgress(); markLessonComplete(p, "macro-avance", "lecon3"); setDone(true); }}
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
                  <p className="text-xs text-zinc-500 mt-0.5">La próxima lección (Risk-on / Risk-off) ya está disponible.</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/formations/macro/avance/lecon2"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lección 2 — NFP
              </Link>
              <Link
                href="/formations/macro/avance/lecon4"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                Lección 4 — Risk-on / Risk-off
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
