"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { MacroDangerWindowsDiagram } from "@/app/components/charts/MacroDangerWindowsDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Qué es la macro",                  href: "/formations/macro/debutant/lecon1", disabled: false },
  { id: "lecon2", title: "Los 4 grandes bancos centrales",    href: "/formations/macro/debutant/lecon2", disabled: false },
  { id: "lecon3", title: "Las cifras macro a vigilar",        href: "/formations/macro/debutant/lecon3", disabled: false },
  { id: "lecon4", title: "Entender la inflación",             href: "/formations/macro/debutant/lecon4", disabled: false },
  { id: "lecon5", title: "El rol del dólar en el mundo",      href: "/formations/macro/debutant/lecon5", disabled: false },
  { id: "lecon6", title: "Macro y risk management",           href: "/formations/macro/debutant/lecon6", disabled: false },
];

export default function ContentEs() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-debutant", "lecon6"));
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
          <span className="text-zinc-500">Lección 6</span>
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
            Macro y risk management, adapta tu riesgo al contexto
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Tu stop loss puede ser perfecto. Tu análisis también.
            </p>
            <p className="text-[15px] text-zinc-400 leading-relaxed mt-2">
              Pero si una news mayor sale en 5 minutos, tu SL puede saltar como si no existiera.
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

          {/* Bloque 1 — Por qué la macro cambia tu riesgo */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Por qué la macro cambia tu riesgo</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              En tiempo normal, tu stop loss técnico tiene sentido. Si tu análisis prevé un SL a 30 pips, el mercado puede respetar esa zona.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Pero durante una news mayor:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                { bold: "la volatilidad explota", rest: " (movimientos 2 a 5 veces más violentos que de costumbre)" },
                { bold: "los spreads pueden ampliarse", rest: " bruscamente" },
                { bold: "el precio puede atravesar varios niveles", rest: " en pocos segundos" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Resultado: <span className="font-semibold text-zinc-200">tu riesgo real se vuelve más grande que tu riesgo previsto</span>.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Durante una news macro, tu riesgo ya no está en el papel. Está en la velocidad del mercado.
              </p>
            </div>
          </section>

          {/* Bloque 2 — Las 3 reglas de oro */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Las 3 reglas de oro</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              En período macro, no operas con las mismas reglas que un día tranquilo.
            </p>

            <div className="space-y-5 mb-5">
              <div>
                <p className="text-sm font-semibold text-zinc-200 mb-2">Regla 1. Ninguna posición abierta en news 3 estrellas</p>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  Si una news mayor llega, verificas tus posiciones. Cierras, reduces, o asumes conscientemente el riesgo. Pero <span className="font-semibold text-zinc-200">nunca descubres</span> la news después de los hechos.
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-zinc-200 mb-2">Regla 2. Tamaño dividido por 2 después de la news</p>
                <p className="text-sm text-zinc-300 leading-relaxed mb-2">
                  Si operas después de la reacción (método visto en la lección 3):
                </p>
                <ul className="space-y-1.5 mb-2">
                  <li className="flex items-center gap-2.5 text-sm text-zinc-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
                    <span>tamaño normal: 0.10 lote</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-zinc-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
                    <span>tamaño post-news: <span className="font-semibold text-zinc-200">0.05 lote</span></span>
                  </li>
                </ul>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  El objetivo no es ganar más rápido. El objetivo es <span className="font-semibold text-zinc-200">sobrevivir a la volatilidad</span>.
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-zinc-200 mb-2">Regla 3. SL más amplio o no operar</p>
                <p className="text-sm text-zinc-300 leading-relaxed mb-2">
                  Si el mercado todavía se mueve demasiado rápido después de la news:
                </p>
                <ul className="space-y-1.5">
                  <li className="flex items-start gap-2.5 text-sm text-zinc-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                    <span>o bien <span className="font-semibold text-zinc-200">amplías tu SL inteligentemente</span> (50 pips mínimo en lugar de 20-30)</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-sm text-zinc-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                    <span>o bien <span className="font-semibold text-zinc-200">esperas 1 a 2 horas</span> a que se calme</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Cuando el mercado acelera, tu riesgo debe frenar.
              </p>
            </div>
          </section>

          {/* Bloque 3 — Las ventanas peligrosas */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Las ventanas peligrosas</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Ciertas horas deben volverse <span className="font-semibold text-zinc-200">automáticas en tu cabeza</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Las más importantes (hora de París):
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                { bold: "14h30", rest: " → cifras US mayores: NFP, CPI, Retail Sales" },
                { bold: "20h00", rest: " → decisiones Fed / FOMC" },
                { bold: "14h15", rest: " → decisiones BCE" },
                { bold: "13h00", rest: " → decisiones BoE" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-2">
              La zona más peligrosa:
            </p>
            <ul className="space-y-1.5 mb-4">
              <li className="flex items-start gap-2.5 text-sm text-zinc-300">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                <span><span className="font-semibold text-zinc-200">30 minutos antes</span> de la publicación</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-zinc-300">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                <span>hasta <span className="font-semibold text-zinc-200">1 hora después</span></span>
              </li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Durante esta ventana, el mercado puede volverse <span className="font-semibold text-zinc-200">irracional</span>. Ningún análisis técnico clásico se sostiene.
            </p>
            <div className="bg-zinc-800/30 rounded-xl px-4 py-3 mb-5">
              <p className="text-xs font-semibold text-zinc-400 mb-2">Activos afectados durante estas ventanas:</p>
              <ul className="space-y-1.5">
                {[
                  { bold: "Forex", rest: ": EUR/USD, GBP/USD (volatilidad máxima)" },
                  { bold: "Oro (XAU/USD)", rest: ": muy reactivo a las news US (dólar / tasas)" },
                  { bold: "Índices US", rest: ": Nasdaq, S&P500 reaccionan inmediatamente" },
                  { bold: "BTC/USD", rest: ": sensible a las news macro desde 2022" },
                ].map((item) => (
                  <li key={item.bold} className="flex items-start gap-2 text-xs text-zinc-400">
                    <div className="w-1 h-1 rounded-full bg-zinc-600 shrink-0 mt-1.5" />
                    <span><span className="font-semibold text-zinc-300">{item.bold}</span>{item.rest}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-zinc-500 mt-2 italic">La regla de los 30 minutos antes / 1h después se aplica a todos estos activos.</p>
            </div>

            {/* Componente visual */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden mb-5">
              <MacroDangerWindowsDiagram locale="es" />
            </div>

            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Una buena entrada en el mal momento sigue siendo una mala entrada.
              </p>
            </div>
          </section>

          {/* Bloque 4 — Buena gestión vs mala gestión */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Buena gestión vs mala gestión</h2>

            <div className="space-y-4 mb-5">
              <div className="bg-zinc-800/30 rounded-xl px-4 py-4">
                <p className="text-sm font-semibold text-zinc-200 mb-3">Caso de buena gestión:</p>
                <ul className="space-y-1.5">
                  {[
                    "14h30: NFP previsto",
                    "14h00: cierras o reduces tus posiciones",
                    "14h30: sale la cifra",
                    "EUR/USD hace 80 pips de movimiento",
                    "15h30: el mercado se calma",
                    "identificas un retroceso limpio",
                    "entras con un tamaño dividido por 2",
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-zinc-300 leading-relaxed mt-3">
                  No evitaste el mercado. <span className="font-semibold text-zinc-200">Evitaste el caos.</span>
                </p>
              </div>

              <div className="bg-zinc-800/30 rounded-xl px-4 py-4">
                <p className="text-sm font-semibold text-zinc-200 mb-3">Caso de mala gestión:</p>
                <p className="text-sm text-zinc-300 leading-relaxed mb-2">
                  Entras long EUR/USD a las 14h00 sin mirar el calendario. A las 14h30, NFP sale muy positivo. EUR/USD cae 80 pips en 30 segundos. Tu SL de 30 pips salta.
                </p>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  <span className="font-semibold text-zinc-200">Técnicamente, tu análisis podía ser correcto.</span> Pero tu timing era malo. Y el mercado no perdona el mal timing en macro.
                </p>
              </div>
            </div>

            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                La macro no recompensa la audacia. Recompensa la paciencia.
              </p>
            </div>
          </section>

          {/* Bloque 5 — Realidad del retail */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Realidad del retail</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Con una cuenta de 500€, un mal trade macro puede doler <span className="font-semibold text-zinc-200">mucho</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Cálculo concreto:
            </p>
            <ul className="space-y-1.5 mb-4">
              <li className="flex items-start gap-2.5 text-sm text-zinc-300">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                <span>EUR/USD cae 80 pips</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-zinc-300">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                <span>Posición: 0.10 lote</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-zinc-300">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                <span>Pérdida: <span className="font-semibold text-zinc-200">aproximadamente 80€</span></span>
              </li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              <span className="font-semibold text-zinc-200">80€ sobre 500€ = 16% de la cuenta en 30 segundos.</span>
            </p>
            <div className="bg-zinc-900/60 rounded-xl px-4 py-3 mb-5">
              <p className="text-xs font-semibold text-zinc-400 mb-2">Y no es solo un riesgo en EUR/USD. Con una cuenta de 500€ y una posición dimensionada según las reglas de risk management (2% por trade), una mala news macro puede borrar el mismo porcentaje de la cuenta en todos los activos:</p>
              <div className="space-y-1.5">
                {[
                  { asset: "EUR/USD", detail: "-80 pips → -80€", pct: "16% de la cuenta" },
                  { asset: "XAU/USD", detail: "-30$ → -90€", pct: "18% de la cuenta" },
                  { asset: "Nasdaq", detail: "-1.5% → -75€", pct: "15% de la cuenta" },
                  { asset: "BTC/USD", detail: "-800$ → -120€", pct: "24% de la cuenta" },
                ].map((item) => (
                  <div key={item.asset} className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-300 w-20">{item.asset}</span>
                    <span className="text-zinc-400">{item.detail}</span>
                    <span className="font-semibold text-red-400">{item.pct}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-zinc-500 mt-2 italic">Nota: estas equivalencias se calculan a tamaño de riesgo similar (no a mismo número de lotes). El objetivo es mostrar que sin importar el activo operado, un mal risk management en news macro puede borrar 15-25% de la cuenta en pocos minutos.</p>
            </div>

            {/* Encadré 💰 Realidad del retail */}
            <div className="bg-zinc-800/50 border-l-4 border-amber-400 px-5 py-4 rounded">
              <div className="flex items-center gap-2 mb-2">
                <span>💰</span>
                <span className="text-sm font-bold text-amber-400 tracking-wide">Realidad del retail</span>
              </div>
              <p className="text-base text-zinc-300 leading-relaxed">
                En 30 segundos, puedes perder más que <span className="font-semibold text-zinc-200">varias semanas de disciplina</span>. La macro no destruye las cuentas porque sea complicada. <span className="font-semibold text-zinc-200">Las destruye porque se la ignora.</span>
              </p>
            </div>
          </section>

          {/* Bloque 6 — Cómo adaptar tu risk management */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Cómo adaptar tu risk management</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Ya aprendiste a adaptar tu riesgo a tu capital (cf lección Trading &apos;Gestión del riesgo&apos;):
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                { bold: "cuenta pequeña (300€)", rest: " → 3% ideal, máx 5%" },
                { bold: "cuenta media (500-1000€)", rest: " → 2-3% ideal" },
                { bold: "cuenta más sólida (2000€+)", rest: " → 2% estricto" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              <span className="font-semibold text-zinc-200">La macro añade una capa adicional.</span>
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Esta es la grilla de decisión según el contexto macro:
            </p>

            {/* Grilla de decisión */}
            <div className="overflow-hidden rounded-xl border border-zinc-800 mb-5">
              <div className="grid grid-cols-2">
                <div className="px-4 py-2.5 bg-zinc-800/50 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Contexto</div>
                <div className="px-4 py-2.5 bg-zinc-800/50 text-xs font-semibold text-zinc-500 uppercase tracking-wider border-l border-zinc-800">Acción</div>
              </div>
              <div className="divide-y divide-zinc-800/60">
                {[
                  { ctx: "Macro tranquila", action: "Reglas estándar (% según tu capital)" },
                  { ctx: "News 3 estrellas en <2h", action: "Cerrar / reducir / esperar" },
                  { ctx: "Macro contra tu setup", action: "Dividir el tamaño por 2 o pasar" },
                  { ctx: "Macro confirma tu setup", action: "Setup estándar con confluencia reforzada" },
                ].map((row, i) => (
                  <div key={i} className="grid grid-cols-2">
                    <div className="px-4 py-3 text-sm font-semibold text-zinc-200">{row.ctx}</div>
                    <div className="px-4 py-3 text-sm text-zinc-400 border-l border-zinc-800/60">{row.action}</div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Si la macro va contra tu setup → <span className="font-semibold text-zinc-200">reduces el tamaño o pasas</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Si la macro confirma tu setup → puedes buscar una entrada limpia, <span className="font-semibold text-zinc-200">pero sin aumentar tu tamaño por ello</span>.
            </p>

            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                El buen trader no arriesga igual en la calma y en la tormenta.
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
              "Una news macro puede multiplicar tu riesgo real por 2 a 5 veces",
              "Las ventanas peligrosas: 30 min antes hasta 1h después de las news 3 estrellas",
              "En news 3 estrellas: cerrar, reducir o esperar (nunca ignorar)",
              "La grilla de decisión: macro favorable + técnica limpia = mejor contexto",
            ]}
          />

          <LessonExercice
            description="Antes de tu próxima sesión, construye tu plan de riesgo macro."
            steps={[
              "Abre el calendario económico del día (Investing.com o Forex Factory).",
              "Identifica todos los eventos 3 estrellas en tu sesión de trading.",
              "Anota las horas peligrosas en tu planificación (30 min antes + 1h después de cada news).",
              "Decide con antelación para cada news: ¿cierras, reduces o esperas?",
              "Después de cada news, observa si el mercado se vuelve tradable o sigue caótico.",
            ]}
          />
          <p className="text-sm text-zinc-500 leading-relaxed px-1">
            El objetivo: <span className="font-semibold text-zinc-400">nunca descubrir una news después de haber tomado posición</span>.
          </p>

          <LessonQuiz
            question="Quieres entrar long EUR/USD a las 14h10. El calendario indica un NFP a las 14h30. Tu setup técnico está limpio. ¿Qué haces?"
            options={[
              "Entras normalmente, tu setup está limpio, la macro es para los noticieros",
              "Entras con más tamaño para aprovechar el movimiento esperado",
              "Esperas la publicación del NFP, observas la reacción, y reevalúas el setup después",
              "Retiras tu stop loss para evitar que te saquen por la volatilidad",
            ]}
            correctIndex={2}
            explanation="Un NFP puede crear un movimiento violento e imprevisible (200-500 pips de movimiento total posible). Aunque tu setup esté técnicamente limpio, el riesgo real es demasiado alto justo antes de la publicación. La opción A ignora completamente el contexto macro y te hace sufrir la volatilidad. La opción B es aún peor, aumentas tu riesgo en la ventana más peligrosa. La opción D es catastrófica: retirar tu SL transforma una pérdida limitada en una pérdida potencialmente enorme. La única respuesta pro: esperar, observar, reevaluar. Este principio vale en todos los activos sensibles a la macro: EUR/USD, XAU/USD, Nasdaq, BTC/USD."
            answerExplanations={[
              "Falso. Ignorar una news 3 estrellas a 20 minutos es sufrir la volatilidad. Un NFP puede crear un movimiento de 200-500 pips, tu setup técnico no se sostiene frente a esta realidad.",
              "Falso. Aumentar el tamaño en la ventana de peligro máximo es un error grave. Maximizas tu riesgo en el peor momento posible.",
              "Correcto. Un NFP puede crear un movimiento violento e imprevisible. Esperar, observar la reacción, luego reevaluar el setup es el único enfoque profesional.",
              "Falso. Retirar tu SL es catastrófico: transforma una pérdida limitada en una pérdida potencialmente enorme si el mercado se va en la dirección equivocada.",
            ]}
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => { const p = getStoredProgress(); markLessonComplete(p, "macro-debutant", "lecon6"); setDone(true); }}
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
                  <p className="text-xs text-zinc-500 mt-0.5">Terminaste el módulo Principiante Macro. ¡Felicitaciones!</p>
                </div>
              </div>
            )}

            {/* Navegación */}
            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/formations/macro/debutant/lecon5"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lección 5. El rol del dólar en el mundo
              </Link>
              <span className="text-sm text-emerald-400 italic cursor-default">
                Módulo Principiante Macro completo ✓
              </span>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
