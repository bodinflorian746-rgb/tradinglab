"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { FOMCTimelineDiagram } from "@/app/components/charts/FOMCTimelineDiagram";
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
    setDone(isLessonComplete(getStoredProgress(), "macro-avance", "lecon1"));
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
          <span className="text-zinc-500">Lección 1</span>
        </nav>

        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">
              Avanzado
            </span>
            <span className="text-zinc-700 text-xs">·</span>
            <span className="text-xs text-zinc-600">22 min</span>
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
            FOMC, el evento que puede cambiar la dirección del mercado
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Puedes tener un setup perfecto, entrar al nivel correcto… y que te saquen en menos de un minuto. El FOMC genera movimientos que atrapan a los traders demasiado rápidos. Si no entiendes su timing, estás tradeando el ruido.
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
            <span className="ml-auto text-xs text-zinc-600">1 / 4 lecciones</span>
          </div>
        </header>

        {/* ── Contenu ── */}
        <div className="space-y-8">

          {/* Bloc 1 : Qu'est-ce que le FOMC ? */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">¿Qué es el FOMC?</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              El FOMC es el comité de la Fed que decide las tasas de interés y la política monetaria estadounidense.
            </p>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
              <p className="text-sm text-zinc-400 leading-relaxed">
                <span className="text-white font-medium">Para recordar:</span> el FOMC determina el costo del dinero, por lo tanto la dirección de los flujos en los mercados.
              </p>
            </div>
          </section>

          {/* Bloc 2 : Pourquoi le marché y réagit autant */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Por qué el mercado reacciona tanto</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Una decisión de tasas impacta directamente:
            </p>
            <ul className="space-y-1.5 mb-4 ml-1">
              {["el dólar", "los índices", "la cripto"].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm text-zinc-300 leading-relaxed mb-4">
              Tasas altas → presión sobre los mercados. Tasas bajas → soporte a los mercados.
            </p>
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl px-4 py-3">
              <p className="text-sm text-white font-semibold leading-relaxed">
                El mercado no reacciona a la decisión. Reacciona a lo que Powell deja entrever.
              </p>
            </div>
          </section>

          {/* Bloc 3 : Le timing exact */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">El timing exacto de un FOMC</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Un FOMC se lee en tres fases:
            </p>
            <div className="space-y-2 mb-6">
              {[
                { time: "20h00", label: "Decisión Fed", color: "text-blue-400" },
                { time: "20h30", label: "Discurso de Powell", color: "text-amber-400" },
                { time: "21h00+", label: "Dirección real", color: "text-emerald-400" },
              ].map((item) => (
                <div key={item.time} className="flex items-center gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
                  <span className={`text-xs font-bold shrink-0 w-14 ${item.color}`}>{item.time}</span>
                  <span className="text-sm text-zinc-300">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Visuel SVG */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden mb-5">
              <FOMCTimelineDiagram locale="es" />
            </div>

            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-4 mb-3">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Ejemplo concreto</p>
              <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                A las 20h00, EUR/USD puede mover +100 a +150 pips en 3 minutos, a veces más. Ves el breakout, entras. A las 20h30, Powell habla. El mercado se invierte. Entre las 20h30 y las 21h30, EUR/USD puede perder 200 a 400 pips.
              </p>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Matriz hawkish surprise, en 3 minutos</p>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {[
                  { asset: "EUR/USD", move: "-100 a -150 pips", note: "dólar más fuerte" },
                  { asset: "XAU/USD", move: "-30 a -60$", note: "oro penalizado por las tasas" },
                  { asset: "Nasdaq", move: "-1.5 a -2.5%", note: "tech bajo presión" },
                  { asset: "BTC/USD", move: "-800 a -2000$", note: "risk-off masivo" },
                ].map((item) => (
                  <div key={item.asset} className="bg-zinc-900/60 rounded-lg px-3 py-2">
                    <p className="text-xs font-bold text-zinc-300">{item.asset}</p>
                    <p className="text-xs text-red-400 font-semibold">{item.move}</p>
                    <p className="text-[10px] text-zinc-500">{item.note}</p>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-zinc-500 italic">
                En un FOMC dovish surprise, es lo contrario: EUR/USD +100/+150, XAU/USD +30/+60$, Nasdaq +2/+3%, BTC/USD +1000/+3000$.
              </p>
            </div>
            <div className="bg-zinc-800/30 rounded-xl px-4 py-3 mb-3">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">FOMC realmente sorpresa, amplitudes extremas</p>
              <div className="grid grid-cols-2 gap-2 mb-2">
                {[
                  { asset: "EUR/USD", move: "200 a 400 pips" },
                  { asset: "XAU/USD", move: "80 a 150$" },
                  { asset: "Nasdaq", move: "3 a 5%" },
                  { asset: "BTC/USD", move: "3000 a 6000$" },
                ].map((item) => (
                  <div key={item.asset} className="flex items-center justify-between bg-zinc-900/40 rounded-lg px-3 py-1.5">
                    <span className="text-xs font-semibold text-zinc-300">{item.asset}</span>
                    <span className="text-xs text-zinc-400">{item.move}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-zinc-500 italic">
                A este nivel de amplitud, ya no es trading. Es gestión de pánico.
              </p>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              El primer impulso es inestable y puede invertirse violentamente. Rara vez es la dirección real.
            </p>
          </section>

          {/* Bloc 4 : ERREUR CLASSIQUE */}
          <section className="border border-red-500/20 bg-red-500/5 rounded-2xl p-6">
            <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">Error clásico</p>
            <p className="text-sm font-semibold text-white mb-3">Te lanzas sobre la primera vela</p>
            <p className="text-sm text-zinc-300 leading-relaxed mb-3">
              Ves la vela disparándose al alza. Piensas: &quot;tengo que entrar ahora&quot;. Compras. 30 segundos después, el mercado se desacelera. Luego se invierte. Tu stop loss es tocado.
            </p>
            <div className="bg-zinc-900/40 border border-red-500/15 rounded-xl px-4 py-3">
              <p className="text-sm text-zinc-400 italic leading-relaxed">
                El primer impulso suele servir para barrer la liquidity, no para dar una dirección.
              </p>
            </div>
          </section>

          {/* Bloc 5 : Comment trader un FOMC */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Cómo tradear un FOMC</h2>
            <div className="space-y-2 mb-4">
              {[
                "Observa DXY + EUR/USD entre las 19h45 y las 21h00",
                "Espera un cierre M5 o M15 confirmado después de las 21h00",
                "Busca una confluencia con un nivel técnico fuerte",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl px-4 py-3">
                  <span className="text-emerald-500 font-bold text-base shrink-0 mt-0.5">✓</span>
                  <p className="text-sm text-zinc-300 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3 mb-3">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Activos a vigilar durante un FOMC</p>
              <div className="space-y-1.5">
                {[
                  { asset: "EUR/USD", role: "barómetro del dólar" },
                  { asset: "XAU/USD", role: "sensibilidad máxima a las tasas reales" },
                  { asset: "Nasdaq", role: "impacto directo de las tasas sobre la tech" },
                  { asset: "BTC/USD", role: "indicador de risk-on / risk-off" },
                ].map((item) => (
                  <div key={item.asset} className="flex items-center gap-3 text-sm">
                    <span className="font-semibold text-zinc-300 shrink-0 w-20">{item.asset}</span>
                    <span className="text-zinc-600">—</span>
                    <span className="text-zinc-400">{item.role}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-zinc-500 mt-3 italic">La regla pro: vigila la coherencia entre estos 4 activos para validar tu sesgo.</p>
            </div>
            <div className="space-y-2 mb-5">
              {[
                "No entras nunca entre las 20h00 y las 20h30",
                "No tradeas la primera vela de breakout",
                "No tradeas a ciegas si no escuchaste a Powell",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 bg-red-500/5 border border-red-500/10 rounded-xl px-4 py-3">
                  <span className="text-red-500 font-bold text-base shrink-0 mt-0.5">✗</span>
                  <p className="text-sm text-zinc-300 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
              <p className="text-sm text-white font-semibold leading-relaxed">
                No tradeas la noticia. Tradeas la reacción.
              </p>
            </div>
          </section>

          {/* Bloc 6 : Confluence avec analyse technique */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Confluencia con análisis técnico</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              FOMC + setup técnico = setup premium.
            </p>
            <div className="bg-zinc-800/50 border border-zinc-700/40 rounded-xl px-4 py-4 mb-4">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Ejemplo</p>
              <div className="space-y-1.5">
                {[
                  "Precio en una zona Order Block H1",
                  "DXY rompe una resistencia Daily",
                  "Powell hawkish a las 20h45",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                    <span className="text-zinc-600 shrink-0">—</span>
                    {item}
                  </div>
                ))}
                <div className="mt-3 flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold shrink-0">→</span>
                  <p className="text-sm text-emerald-400 font-medium">Confluencia triple, R/R realista 1:3 o más.</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed mb-3">
              Con un FOMC que produce 300+ pips de movimiento direccional, un setup confirmado puede apuntar a un R/R 1:5, incluso 1:10.
            </p>
            <div className="bg-zinc-800/30 rounded-xl px-4 py-3 mb-3">
              <p className="text-sm text-zinc-400 leading-relaxed">
                El mismo fenómeno se produce simultáneamente en XAU/USD, el Nasdaq y BTC/USD, los niveles técnicos son barridos en todos los activos ligados al dólar al mismo tiempo. Eso es lo que hace al FOMC tan peligroso: puedes recibir stop out en 4 activos en el mismo segundo.
              </p>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Sin confluencia técnica, tradeas solo la noticia. Con ella, tradeas la noticia + la estructura.
            </p>
          </section>

          {/* ET TOI, RETAIL ? */}
          <div className="border border-emerald-500/20 bg-emerald-500/5 rounded-xl p-6 my-8">
            <p className="text-emerald-400 uppercase tracking-widest text-xs font-bold mb-4">¿Y TÚ, RETAIL?</p>
            <div className="text-zinc-300 leading-relaxed space-y-3">
              <p>
                Miércoles por la noche 19h45. Capital 1 000€. El FOMC sale en 15 minutos. No tienes ninguna posición abierta en EUR/USD ni en los índices US. Todo está plano. Ayer ya habías identificado un Order Block H1 hacia 1.1820 en EUR/USD. Es tu nivel clave. Entre las 20h00 y las 20h30, sabes que el mercado puede irse en ambas direcciones sin lógica propia.
              </p>
              <p>
                20h00: la Fed deja las tasas sin cambios. Primer impulso violento. 20h30: Powell se vuelve hawkish e insiste en una inflación todavía demasiado alta. EUR/USD se hunde, rebota bruscamente, luego vuelve a hundirse. El caos clásico del FOMC. Sigues sin tocar nada. A las 21h05, una vela M15 cierra debajo de tu Order Block 1.1820. El dólar confirma su fuerza. La confluencia macro + técnica está ahí.
              </p>
              <p>
                Concretamente: entrada short a 1.1820, SL a 1.1850, TP a 1.1760. Arriesgas 20€ (2% de 1 000€), puedes ganar unos 40€. Cierras tu chart, te vas a dormir. Lo verificarás al despertar, los movimientos post-21h00 del FOMC suelen continuar durante toda la sesión asiática.
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
              "El FOMC decide las tasas y la política monetaria estadounidense.",
              "El discurso de Powell es determinante, es él quien da la dirección real.",
              "20h00–21h00 = zona inestable; la dirección real aparece después de las 21h.",
              "El primer impulso es inestable y suele servir como trampa de liquidity.",
              "El FOMC impacta simultáneamente EUR/USD, XAU/USD, Nasdaq y BTC/USD, vigila la coherencia entre ellos.",
            ]}
          />

          <LessonExercice
            description="En TradingView, analiza un FOMC reciente."
            steps={[
              "Abre EUR/USD en M5.",
              "Encuentra un FOMC reciente mediante un calendario económico (Investing.com, Forex Factory).",
              "Observa el movimiento a las 20h00 — ¿en qué dirección? ¿Qué amplitud?",
              "Observa la reacción a las 20h30 (inicio del discurso de Powell) — ¿hubo inversión?",
              "Identifica la dirección confirmada después de las 21h00.",
              "Pregunta: si hubieras estado frente a tu pantalla ese día, ¿a qué hora exacta habrías entrado? ¿Con qué confluencia? Anótalo.",
            ]}
          />

          <LessonQuiz
            question="A las 20h00, EUR/USD rompe una resistencia durante un FOMC. ¿Qué haces?"
            options={[
              "Compras inmediatamente, es un breakout claro",
              "Esperas el final del discurso y un cierre M5 confirmado después de las 21h00",
              "Vendes directamente apostando a una reversión",
              "Entras en ambos sentidos con dos órdenes opuestas",
            ]}
            correctIndex={1}
            explanation="El primer impulso de un FOMC es inestable y suele servir para tomar la liquidity antes de que Powell hable. Esperar un cierre confirmado después de las 21h00 evita esa trampa y te permite entrar en la dirección real con una confluencia técnica. Este principio aplica a todos los activos tocados por el FOMC: la misma trampa se produce en XAU/USD, el Nasdaq y BTC/USD al mismo tiempo."
            answerExplanations={[
              "Falso. Ese impulso a las 20h00 es muy a menudo una trampa, el mercado caza la liquidity de los stops antes de invertirse a las 20h30 cuando Powell habla. Comprar inmediatamente es entrar en la zona más inestable del FOMC.",
              "Correcto. La dirección real se confirma después de las 21h00. Esperando un cierre M5 con una confluencia técnica (OB, resistencia rota), evitas el ruido y entras con una probabilidad muy superior.",
              "Demasiado agresivo y sin lógica. No hay ninguna señal de reversión confirmada en esta etapa, no sabes si la resistencia va a aguantar o ceder. Vender a ciegas en un breakout es apostar, no tradear.",
              "Falso. Entrar en ambos sentidos es un error, pagas el spread de los dos lados y no tienes ningún sesgo direccional. El método correcto es esperar la confirmación, no cubrirse a ciegas.",
            ]}
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => { const p = getStoredProgress(); markLessonComplete(p, "macro-avance", "lecon1"); setDone(true); }}
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
                  <p className="text-xs text-zinc-500 mt-0.5">La próxima lección (NFP) estará pronto disponible.</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/formations/macro/avance"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Volver al módulo
              </Link>
              <span className="text-sm text-zinc-700 cursor-default">
                NFP. Pronto disponible →
              </span>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
