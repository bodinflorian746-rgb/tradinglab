"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { DollarHubDiagram } from "@/app/components/charts/DollarHubDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Qué es la macro",                       href: "/formations/macro/debutant/lecon1", disabled: false },
  { id: "lecon2", title: "Los 4 grandes bancos centrales",         href: "/formations/macro/debutant/lecon2", disabled: false },
  { id: "lecon3", title: "Las cifras macro a vigilar",             href: "/formations/macro/debutant/lecon3", disabled: false },
  { id: "lecon4", title: "Entender la inflación",                  href: "/formations/macro/debutant/lecon4", disabled: false },
  { id: "lecon5", title: "El rol del dólar en el mundo",           href: "/formations/macro/debutant/lecon5", disabled: false },
  { id: "lecon6", title: "Macro y risk management",                href: null,                                disabled: true  },
];

export default function ContentEs() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-debutant", "lecon5"));
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
          <span className="text-zinc-500">Lección 5</span>
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
            El rol del dólar en el mundo, por qué todo pasa por él
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              ¿Operas XAU/USD, EUR/USD, BTC/USD? Mira su punto en común.
            </p>
            <p className="text-[15px] text-zinc-400 leading-relaxed mt-2">
              No operas el oro, el euro o el Bitcoin. Operas el dólar, ya sea que esté arriba o abajo del símbolo.
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

          {/* Bloque 1 — Por qué el dólar es único */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Por qué el dólar es único</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              El dólar no es una divisa como las demás. <span className="font-semibold text-zinc-200">Está en el centro del sistema financiero mundial.</span>
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Algunas cifras que debes conocer:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                { bold: "alrededor del 60% de las reservas mundiales", rest: " de los bancos centrales están en dólares" },
                { bold: "alrededor del 88% de las transacciones forex", rest: " involucran al dólar" },
                { bold: "el oro, el petróleo y la mayoría de las materias primas", rest: " se cotizan en USD" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Desde Bretton Woods (1944), el mundo financiero se construyó alrededor del dólar. Esta posición central nunca se ha cuestionado.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                El dólar no es solo una divisa. Es la columna vertebral del mercado.
              </p>
            </div>
          </section>

          {/* Bloque 2 — El DXY + visual */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">El DXY: el termómetro del dólar</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              El <span className="font-semibold text-zinc-200">DXY</span> (Dollar Index) mide la fuerza del dólar frente a una canasta de 6 divisas mayores:
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                { label: "EUR", note: "(el peso más importante: ~57.6%)" },
                { label: "JPY", note: null },
                { label: "GBP", note: null },
                { label: "CAD", note: null },
                { label: "SEK", note: null },
                { label: "CHF", note: null },
              ].map((item) => (
                <li key={item.label} className="flex items-center gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
                  <span className="font-semibold text-zinc-200">{item.label}</span>
                  {item.note && <span className="text-zinc-500">{item.note}</span>}
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Entonces:</p>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3 mb-4">
              <div className="space-y-1.5">
                <p className="text-sm font-semibold text-zinc-200">
                  <span className="text-zinc-400 font-normal">DXY sube</span> → dólar fuerte
                </p>
                <p className="text-sm font-semibold text-zinc-200">
                  <span className="text-zinc-400 font-normal">DXY baja</span> → dólar débil
                </p>
              </div>
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              <span className="font-semibold text-zinc-200">Analogía simple</span>: el DXY es el <span className="font-semibold text-zinc-200">termómetro del dólar</span>. Lo miras para saber si el mercado se calienta o se enfría.
            </p>

            {/* Componente visual */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden">
              <DollarHubDiagram locale="es" />
            </div>
          </section>

          {/* Bloque 3 — Cuando el dólar sube, todo cambia */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Cuando el dólar sube, todo cambia</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Un dólar fuerte modifica la lectura de <span className="font-semibold text-zinc-200">casi todos los mercados</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Cuando el DXY sube:
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                { bold: "EUR/USD", rest: " a menudo baja" },
                { bold: "XAU/USD", rest: " (el oro) puede bajar" },
                { bold: "Crypto", rest: " a menudo baja" },
                { bold: "Materias primas", rest: " bajo presión" },
                { bold: "Índices", rest: " a veces bajo presión" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              <span className="font-semibold text-zinc-200">¿Por qué?</span> Porque un dólar fuerte hace que los activos denominados en USD sean más caros para el resto del mundo. Y porque los inversores prefieren el dólar refugio cuando aumenta la incertidumbre.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Cuando el dólar se fortalece, el risk-on respira menos bien.
              </p>
            </div>
          </section>

          {/* Bloque 4 — Ejemplo reciente: 2022 */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Ejemplo reciente: 2022</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              El mejor ejemplo reciente: <span className="font-semibold text-zinc-200">2022</span>. El dólar (DXY) ganó <span className="font-semibold text-zinc-200">+20%</span> en el año.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Consecuencias en cascada:
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                { bold: "EUR/USD", rest: " : -21% (pasa de 1.20 a 0.95)" },
                { bold: "Oro", rest: " : bajo presión todo el año" },
                { bold: "Crypto", rest: " : -65%" },
                { bold: "Índices US", rest: " : Nasdaq -33%" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Encuentras el detalle completo de la cadena en la <span className="font-semibold text-zinc-200">lección anterior sobre la inflación</span>. Pero recuerda esto: fue el <span className="font-semibold text-zinc-200">dólar fuerte el que apretó todo el sistema</span>.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Una sola divisa apretó todo el sistema. Eso es el poder del dólar.
              </p>
            </div>
          </section>

          {/* Bloque 5 — El dólar y los países frágiles */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">El dólar y los países frágiles</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Muchos países y empresas <span className="font-semibold text-zinc-200">se endeudan en dólares</span> (y no en su moneda local).
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Cuando el dólar sube:
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                { bold: "su deuda se vuelve más cara", rest: " de pagar" },
                { bold: "su moneda local se debilita", rest: "" },
                { bold: "las tensiones financieras", rest: " aumentan" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Por eso los períodos de dólar fuerte pueden poner bajo presión a países como <span className="font-semibold text-zinc-200">Argentina</span>, <span className="font-semibold text-zinc-200">Turquía</span> o <span className="font-semibold text-zinc-200">Sri Lanka</span>. Crisis monetarias, defaults, caída de las divisas locales.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Un dólar fuerte no solo mueve los gráficos. Aprieta el sistema entero.
              </p>
            </div>
          </section>

          {/* Bloque 6 — Cómo usarlo en tu trading */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Cómo usarlo en tu trading</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Esta es la rutina del trader que realmente usa el DXY:
            </p>
            <div className="space-y-3 mb-5">
              <div className="bg-zinc-800/30 rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-zinc-200 mb-1.5">Paso 1. Antes de tu análisis técnico</p>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  Abre el gráfico del DXY en H1 o H4. Mira la tendencia de los últimos 3 días.
                </p>
              </div>
              <div className="bg-zinc-800/30 rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-zinc-200 mb-2">Paso 2. Identifica el contexto</p>
                <ul className="space-y-1">
                  {[
                    { bold: "DXY alcista fuerte", rest: " → dólar fuerte → contexto risk-off" },
                    { bold: "DXY bajista", rest: " → dólar débil → contexto risk-on" },
                    { bold: "DXY en range", rest: " → contexto neutro, el análisis técnico clásico prima" },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                      <div className="w-1 h-1 rounded-full bg-zinc-600 shrink-0 mt-2" />
                      <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-zinc-800/30 rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-zinc-200 mb-1.5">Paso 3. Adapta tus setups</p>
                <p className="text-sm text-zinc-300 leading-relaxed mb-2">
                  Si quieres comprar (long) en EUR/USD, XAU/USD o BTC/USD → verifica que el DXY <span className="font-semibold text-zinc-200">NO esté subiendo con fuerza</span>. Si no, tu setup probablemente fallará incluso si técnicamente es perfecto.
                </p>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  <span className="font-semibold text-zinc-200">Lo inverso también es cierto</span>: si quieres vender (short) estos mismos activos, un DXY alcista <span className="font-semibold text-zinc-200">refuerza</span> tu setup.
                </p>
              </div>
            </div>

            {/* Encadré 💰 Realidad del retail */}
            <div className="bg-zinc-800/50 border-l-4 border-amber-400 px-5 py-4 rounded mb-5">
              <div className="flex items-center gap-2 mb-2">
                <span>💰</span>
                <span className="text-sm font-bold text-amber-400 tracking-wide">Realidad del retail</span>
              </div>
              <p className="text-base text-zinc-300 leading-relaxed">
                Si operas EUR/USD, XAU/USD o BTC/USD sin mirar el DXY, te falta la mitad de la historia. Los setups técnicos fallan a menudo porque <span className="font-semibold text-zinc-200">el contexto del dólar no es favorable</span>, no porque la estrategia sea mala.
              </p>
            </div>

            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Una mala lectura del DXY = un mal trade, incluso con una estrategia perfecta.
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
              "El dólar es la divisa central del sistema financiero mundial",
              "El DXY mide la fuerza del dólar en un solo gráfico",
              "DXY alcista = presión frecuente sobre EUR/USD, oro, crypto, activos riesgosos",
              "Mirar el DXY cada mañana da el contexto macro de tu día",
            ]}
          />

          <LessonExercice
            description="Antes de tu próxima sesión, agrega el DXY a tu rutina."
            steps={[
              "Abre el gráfico del DXY (en TradingView o Investing.com).",
              "Anota la tendencia: alcista, bajista o range en los últimos 3 días.",
              "Compara con el gráfico de EUR/USD en el mismo período.",
              "Compara con XAU/USD o BTC/USD en el mismo período.",
              "Anota si los movimientos son coherentes con la fuerza del dólar (DXY alto = otros bajos, y viceversa).",
            ]}
          />
          <p className="text-sm text-zinc-500 leading-relaxed px-1">
            El objetivo: <span className="font-semibold text-zinc-400">aprender a ver el mercado a través del dólar</span>.
          </p>

          <LessonQuiz
            question="El DXY sube con fuerza desde hace varios días. ¿Cuál es la lectura más lógica?"
            options={[
              "El dólar está débil, por lo tanto EUR/USD debería subir",
              "El dólar está fuerte, por lo tanto EUR/USD probablemente está bajo presión",
              "El DXY solo sirve para tradear acciones US",
              "El DXY no tiene ningún impacto sobre el oro o la crypto",
            ]}
            correctIndex={1}
            explanation="Cuando el DXY sube, significa que el dólar se fortalece. EUR/USD generalmente está bajo presión porque el euro baja frente al dólar. La opción A confunde DXY alto con dólar débil (es lo inverso). La opción C es falsa: el DXY da un contexto global sobre el dólar, no solo sobre las acciones US, influye en el forex, las materias primas, el oro y la crypto. La opción D también es falsa: el oro (XAU/USD) y la crypto (BTC/USD) están denominados en dólares, por lo que están directamente impactados por su fuerza."
            answerExplanations={[
              "Falso. DXY subiendo significa dólar fuerte, es lo inverso de un dólar débil. Cuando el dólar se fortalece, EUR/USD generalmente baja, no lo inverso.",
              "Correcto. Un DXY al alza significa un dólar fuerte. EUR/USD generalmente está bajo presión en este contexto porque el euro se deprecia frente al dólar.",
              "Falso. El DXY da un contexto global sobre la fuerza del dólar, influye en el forex, las materias primas, el oro y la crypto, no solo en las acciones US.",
              "Falso. El oro (XAU/USD) y la crypto (BTC/USD) están ambos denominados en dólares, por lo que están directamente impactados por la fuerza del dólar. Un DXY alcista a menudo pone al oro y a la crypto bajo presión.",
            ]}
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => { const p = getStoredProgress(); markLessonComplete(p, "macro-debutant", "lecon5"); setDone(true); }}
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
                  <p className="text-xs text-zinc-500 mt-0.5">La próxima lección (Macro y risk management) estará disponible pronto.</p>
                </div>
              </div>
            )}

            {/* Navegación */}
            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/formations/macro/debutant/lecon4"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lección 4. Entender la inflación
              </Link>
              <span className="text-sm text-zinc-700 cursor-default">
                Macro y risk management. Pronto disponible →
              </span>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
