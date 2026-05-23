"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { NFPReportAnatomyDiagram } from "@/app/components/charts/NFPReportAnatomyDiagram";
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
    setDone(isLessonComplete(getStoredProgress(), "macro-avance", "lecon2"));
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
          <span className="text-zinc-500">Lección 2</span>
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
            NFP — la noticia mensual que hace temblar a todos los activos
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              El NFP no es solo &apos;un dato de empleo&apos;.
            </p>
            <p className="text-[15px] text-zinc-400 leading-relaxed mt-2">
              Es un reporte completo que puede cambiar en 30 segundos las expectativas de tasas, el DXY, el oro, el Nasdaq y el Bitcoin.
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
              const isCurrent = lesson.id === "lecon2";
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
            <span className="ml-auto text-xs text-zinc-600">2 / 4 lecciones</span>
          </div>
        </header>

        {/* ── Contenu ── */}
        <div className="space-y-8">

          {/* Bloc 1 — Pourquoi le NFP est si violent */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Por qué el NFP es tan violento</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              El <span className="font-semibold text-zinc-200">NFP</span> se publica el <span className="font-semibold text-zinc-200">primer viernes del mes a las 14h30 hora de París</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Mide la creación de empleos en Estados Unidos, fuera del sector agrícola.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              ¿Por qué es tan importante?
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Porque la Fed vigila <span className="font-semibold text-zinc-200">dos pilares</span>:
            </p>
            <ul className="space-y-1.5 mb-4">
              {["inflación", "empleo"].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Si el empleo se mantiene demasiado sólido, la Fed puede seguir restrictiva.
              Si el empleo se desacelera demasiado rápido, el mercado anticipa una Fed más flexible.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              El NFP toca por lo tanto directamente las <span className="font-semibold text-zinc-200">expectativas de tasas</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Amplitudes típicas en una gran diferencia</span>:
            </p>
            <div className="overflow-hidden rounded-xl border border-zinc-800 mb-5">
              <div className="grid grid-cols-2 border-b border-zinc-800">
                <div className="px-4 py-2 bg-zinc-800/50 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Activo</div>
                <div className="px-4 py-2 bg-zinc-800/50 text-xs font-semibold text-zinc-500 uppercase tracking-wider border-l border-zinc-800">Movimiento posible en 30 segundos</div>
              </div>
              <div className="divide-y divide-zinc-800/60">
                {[
                  { asset: "EUR/USD", move: "50 a 200 puntos" },
                  { asset: "XAU/USD", move: "20 a 80 puntos" },
                  { asset: "Nasdaq",  move: "30 a 200 puntos" },
                  { asset: "BTC/USD", move: "300 a 1500 puntos" },
                ].map((row) => (
                  <div key={row.asset} className="grid grid-cols-2">
                    <div className="px-4 py-2.5 text-sm font-semibold text-zinc-200">{row.asset}</div>
                    <div className="px-4 py-2.5 text-sm text-zinc-400 border-l border-zinc-800/60">{row.move}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Composant visuel */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden mb-5">
              <NFPReportAnatomyDiagram locale="es" />
            </div>

            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                El NFP no mueve un mercado. Sacude toda la cadena del riesgo.
              </p>
            </div>
          </section>

          {/* Bloc 2 — Les 4 données du rapport NFP */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Los 4 datos del reporte NFP</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              El retail mira solo el dato principal.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              El pro lee el <span className="font-semibold text-zinc-200">reporte completo</span>.
            </p>
            <div className="space-y-3 mb-5">
              {[
                {
                  bold: "1. Non-Farm Payrolls (NFP)",
                  body: "Es el dato headline: creación de empleos fuera del sector agrícola.",
                },
                {
                  bold: "2. Unemployment Rate",
                  body: "La tasa de desempleo. A veces más importante que el headline si el mercado busca una señal de desaceleración.",
                },
                {
                  bold: "3. Average Hourly Earnings (AHE)",
                  body: "Los salarios por hora promedio.",
                  extra: "Crucial, porque salarios demasiado altos pueden alimentar la inflación futura.",
                },
                {
                  bold: "4. Participation Rate",
                  body: "La tasa de participación. Muestra cuántas personas participan realmente en el mercado laboral.",
                },
              ].map((item) => (
                <div key={item.bold} className="bg-zinc-800/30 rounded-xl px-4 py-3">
                  <p className="text-sm font-semibold text-zinc-200 mb-1">{item.bold}</p>
                  <p className="text-sm text-zinc-300">
                    {item.body}
                    {item.extra && <span> <span className="font-semibold text-zinc-200">{item.extra}</span></span>}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-2">
              <span className="font-semibold text-zinc-200">Ejemplo 1</span>:
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              NFP fuerte, pero desempleo que sube. → Headline positivo, pero calidad del mercado laboral más frágil.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-2">
              <span className="font-semibold text-zinc-200">Ejemplo 2</span>:
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              NFP neutral, pero salarios demasiado fuertes. → El mercado puede volverse hawkish porque la Fed ve un riesgo inflacionario.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                El headline atrae la mirada. Los sub-datos dan la verdad.
              </p>
            </div>
          </section>

          {/* Bloc 3 — Les révisions : le piège silencieux */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Las revisiones: la trampa silenciosa</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Cada NFP puede <span className="font-semibold text-zinc-200">revisar los datos de los meses anteriores</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Y esas revisiones cambian a veces toda la lectura.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Caso concreto</span>:
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                { pre: "NFP esperado: ", bold: "200k" },
                { pre: "NFP real: ", bold: "250k" },
                { pre: "Sorpresa aparente: ", bold: "+50k" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>{item.pre}<span className="font-semibold text-zinc-200">{item.bold}</span></span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Lectura principiante: &apos;empleo fuerte, dólar alcista&apos;.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Pero si el mes anterior es <span className="font-semibold text-zinc-200">revisado en -80k</span>, el efecto neto cambia.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              El mercado ya no ve solo +50k. Ve una <span className="font-semibold text-zinc-200">dinámica menos sólida de lo previsto</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Resultado posible</span>:
            </p>
            <ul className="space-y-1.5 mb-5">
              {[
                "DXY duda o baja",
                "EUR/USD se invierte",
                "XAU/USD sube",
                "Nasdaq se recupera",
                "BTC/USD sigue el sentimiento risk-on",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Un buen NFP puede volverse mediocre si se reescribe el pasado.
              </p>
            </div>
          </section>

          {/* Bloc 4 — La timeline pro du jour NFP */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">La timeline pro del día NFP</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              El NFP no se tradea como una vela normal. Lees una <span className="font-semibold text-zinc-200">secuencia</span>.
            </p>
            <div className="space-y-2 mb-5">
              {[
                {
                  time: "13h00–14h25 — Aseguramiento",
                  body: "Cierras o reduces las posiciones frágiles. Verificas EUR/USD, DXY, XAU/USD, Nasdaq y BTC/USD.",
                },
                {
                  time: "14h25–14h30 — Pre-posicionamiento",
                  body: "Los spreads pueden ampliarse. No entras.",
                },
                {
                  time: "14h30–14h35 — Lectura cruda",
                  body: "El primer impulso puede ser violento.",
                  bold: "No tradeas los primeros minutos.",
                },
                {
                  time: "14h35–15h00 — Análisis completo",
                  items: ["headline", "desempleo", "salarios", "participación", "revisiones"],
                  suffix: "Luego comparas con DXY, XAU/USD y Nasdaq.",
                },
                {
                  time: "15h00–15h30 — Setup posible",
                  body: "Si la reacción es coherente y confirmada, puedes buscar una entrada con confluencia.",
                },
                {
                  time: "15h30+ — Continuación o digestión",
                  body: "Con la apertura US, el mercado confirma o anula la primera lectura.",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    <span className="font-semibold text-zinc-200">{item.time}</span>
                    <br />
                    {"body" in item && item.body}
                    {"bold" in item && <> <span className="font-semibold text-zinc-200">{item.bold}</span></>}
                    {"items" in item && (
                      <>
                        <span className="text-zinc-300"> Miras:</span>
                        {item.items!.map((sub, j) => (
                          <span key={j} className="block ml-2 text-zinc-400">– {sub}</span>
                        ))}
                        <span className="block mt-1">{item.suffix}</span>
                      </>
                    )}
                  </p>
                </div>
              ))}
            </div>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded mb-4">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                El retail tradea a las 14h30. El pro tradea a las 15h00. Treinta minutos que cambian el resultado.
              </p>
            </div>

            {/* Encadré 💰 Réalité du retail */}
            <div className="bg-zinc-800/50 border-l-4 border-amber-400 px-5 py-4 rounded">
              <div className="flex items-center gap-2 mb-2">
                <span>💰</span>
                <span className="text-sm font-bold text-amber-400 tracking-wide">Realidad del retail</span>
              </div>
              <p className="text-base text-zinc-300 leading-relaxed">
                El retail tradea el dato en 30 segundos. El pro lee el reporte, espera la confirmación y deja que los demás paguen el spread.
              </p>
            </div>
          </section>

          {/* Bloc 5 — Les 3 setups pros sur NFP */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Los 3 setups pro en NFP</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Existen tres maneras de trabajar un NFP.
            </p>
            <div className="space-y-4 mb-5">
              <div className="bg-zinc-800/30 rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-zinc-200 mb-1">1. Setup anticipación</p>
                <p className="text-sm text-zinc-300">
                  Basado en los datos previos: CPI, PPI, salarios, sesgo Fed. Es <span className="font-semibold text-zinc-200">arriesgado</span>. Reservado a traders muy experimentados.
                </p>
              </div>
              <div className="bg-zinc-800/30 rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-zinc-200 mb-2">2. Setup reacción confirmada <span className="text-zinc-500 font-normal">(el más limpio)</span></p>
                <p className="text-sm text-zinc-300 mb-2">Esperas:</p>
                <ul className="space-y-1 mb-3">
                  {[
                    "reporte coherente",
                    "DXY alineado",
                    "XAU/USD que confirma lo inverso del dólar",
                    "Nasdaq y BTC/USD coherentes con el risk-on / risk-off",
                    "nivel técnico válido",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                      <div className="w-1 h-1 rounded-full bg-zinc-600 shrink-0 mt-1.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-zinc-400 italic">
                  NFP fuerte + salarios fuertes + DXY rompe una resistencia. EUR/USD rompe un soporte. XAU/USD rechaza una zona alta.<br />
                  → Setup short EUR/USD o short XAU/USD más limpio.
                </p>
              </div>
              <div className="bg-zinc-800/30 rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-zinc-200 mb-1">3. Setup continuación</p>
                <p className="text-sm text-zinc-300">
                  Después de las 15h30, si el mercado continúa en la misma dirección con volumen, buscas una continuación en pullback.
                </p>
              </div>
            </div>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                El NFP crea el shock. La confluencia decide si tradeas.
              </p>
            </div>
          </section>

          {/* Bloc 6 — Les pièges spécifiques au NFP */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Las trampas específicas del NFP</h2>
            <div className="space-y-3 mb-5">
              {[
                {
                  bold: "Trampa 1 — El primer impulso",
                  body: "La primera vela se va en un sentido, luego se invierte. Ahí es donde el retail suele recibir el stop out.",
                },
                {
                  bold: "Trampa 2 — Tradear solo el headline",
                  body: "NFP superior a las expectativas no siempre significa dólar alcista. Los salarios, el desempleo y las revisiones pueden contradecir el dato.",
                },
                {
                  bold: "Trampa 3 — Ignorar los activos correlacionados",
                  body: "Si tradeas XAU/USD, mira el DXY. Si tradeas BTC/USD, mira el Nasdaq. Si tradeas EUR/USD, mira también GBP/USD y USD/CHF.",
                },
                {
                  bold: "Trampa 4 — Stop loss demasiado ajustado",
                  body: "Después del NFP, un stop clásico puede saltar sin invalidar la tesis. La volatilidad es diferente. Tu riesgo también debe serlo.",
                },
                {
                  bold: "Trampa 5 — Olvidar la cadena macro",
                  body: "El NFP llega después del CPI y PPI, luego influye en el próximo FOMC.",
                  chain: true,
                },
              ].map((item) => (
                <div key={item.bold} className="bg-zinc-800/30 rounded-xl px-4 py-3">
                  <p className="text-sm font-semibold text-zinc-200 mb-1">{item.bold}</p>
                  <p className="text-sm text-zinc-300">{item.body}</p>
                  {item.chain && (
                    <>
                      <p className="text-sm font-semibold text-zinc-200 mt-2 mb-1">Cadena completa:</p>
                      <p className="text-sm text-zinc-400">PPI → CPI → NFP → FOMC</p>
                      <p className="text-sm text-zinc-300 mt-2">
                        No lees el NFP solo. <span className="font-semibold text-zinc-200">Lo lees dentro del narrativo de la Fed.</span>
                      </p>
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                El NFP solo te da un dato. El NFP dentro de la cadena te da una tesis.
              </p>
            </div>
          </section>

          {/* ET TOI, RETAIL ? */}
          <div className="border border-emerald-500/20 bg-emerald-500/5 rounded-xl p-6 my-8">
            <p className="text-emerald-400 uppercase tracking-widest text-xs font-bold mb-4">¿Y TÚ, RETAIL?</p>
            <div className="text-zinc-300 leading-relaxed space-y-3">
              <p>
                Viernes 14h25. Capital 1 500€. El NFP sale en 5 minutos. Trabajas desde casa, tu mañana terminó. Cierras tus posiciones frágiles en EUR/USD y XAU/USD. Ningún interés en quedar expuesto durante el shock. Abres tus cuatro charts: EUR/USD, XAU/USD, Nasdaq y BTC/USD. Esperas la reacción del mercado, no el dato solo.
              </p>
              <p>
                14h30: el NFP sale en 220k contra 180k esperado. Desempleo estable. Salarios a +0,3%. Primera lectura: dólar fuerte. Pero las revisiones del mes anterior caen a -50k. La lectura se vuelve más matizada. DXY sube de todos modos, EUR/USD baja y XAU/USD se hunde. No tradeas la primera vela. A las 14h45, el mercado empieza a desacelerarse. Luego a las 15h00, XAU/USD rompe el soporte de los 4 580$ antes de retestearlo desde abajo. Reacción hawkish confirmada + ruptura técnica validada. El setup está limpio.
              </p>
              <p>
                Concretamente: entrada short XAU/USD a 4 575$, SL a 4 600$, TP a 4 525$. Arriesgas 30€ (2% de 1 500€), puedes ganar unos 60€. Cierras tu chart, te tomas tu viernes por la noche. Lo verificarás mañana por la mañana.
              </p>
            </div>
          </div>

          {/* ── Séparateur révision ── */}
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Repaso</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          <LessonKeyPoints
            points={[
              "El NFP es un reporte completo: headline, desempleo, salarios, participación y revisiones",
              "Los salarios y las revisiones pueden invertir la lectura del dato principal",
              "La lectura real se hace después de los primeros minutos, con DXY, XAU/USD, Nasdaq y BTC/USD",
              "El NFP debe leerse dentro de la cadena PPI → CPI → NFP → FOMC",
            ]}
          />

          <LessonExercice
            description="Toma un NFP antiguo y reconstruye la lectura completa."
            steps={[
              "Anota el NFP esperado, el NFP real y las revisiones del mes anterior.",
              "Anota la tasa de desempleo, los salarios por hora y la tasa de participación.",
              "Observa DXY, EUR/USD, XAU/USD, Nasdaq y BTC/USD entre las 14h30 y las 15h30.",
              "Identifica si el primer impulso aguantó o se invirtió.",
              "Anota cuál setup hubiera sido el más limpio: ninguna entrada, reacción confirmada o continuación post-15h30.",
            ]}
          />
          <p className="text-sm text-zinc-500 leading-relaxed px-1">
            El objetivo:{" "}
            <span className="font-semibold text-zinc-400">dejar de leer el NFP como un dato único</span>.
          </p>

          <LessonQuiz
            question="El NFP sale en 250k contra 200k esperado. Pero el mes anterior se revisa en -80k y los salarios salen por debajo de las expectativas. ¿Qué lectura es la más profesional?"
            options={[
              "Dólar alcista automáticamente, porque el NFP es superior a las expectativas",
              "Lectura mixta: el headline es fuerte, pero las revisiones y los salarios debilitan la señal",
              "XAU/USD debe forzosamente caer",
              "BTC/USD no puede ser impactado por el NFP",
            ]}
            correctIndex={1}
            explanation="El dato principal es positivo, pero no basta. Una revisión negativa del mes anterior (-80k) y salarios débiles pueden reducir o invertir el impacto del headline. La opción A es demasiado simplista (lectura principiante que ignora el contexto). La opción C ignora el contexto completo (los sub-datos pueden contradecir el headline). La opción D es falsa: BTC/USD reacciona a menudo al sentimiento de riesgo y a las expectativas de tasas, que son directamente impactadas por el NFP."
            answerExplanations={[
              "Falso. Leer únicamente el headline es un error clásico. Una revisión de -80k y salarios débiles pueden neutralizar o invertir el impacto de un NFP fuerte.",
              "Correcto. El dato principal es positivo, pero las revisiones negativas y los salarios débiles debilitan la señal. La lectura pro siempre integra los sub-datos.",
              "Falso. XAU/USD depende del contexto global: si las revisiones y los salarios debilitan el dólar, el oro puede subir incluso con un NFP headline fuerte.",
              "Falso. BTC/USD reacciona a menudo al sentimiento de riesgo y a las expectativas de tasas oficiales — dos variables directamente influenciadas por el NFP.",
            ]}
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => { const p = getStoredProgress(); markLessonComplete(p, "macro-avance", "lecon2"); setDone(true); }}
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
                  <p className="text-xs text-zinc-500 mt-0.5">La próxima lección (Rendimientos de bonos US) ya está disponible.</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/formations/macro/avance/lecon1"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lección 1 — FOMC
              </Link>
              <Link
                href="/formations/macro/avance/lecon3"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                Lección 3 — Rendimientos de bonos US
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
