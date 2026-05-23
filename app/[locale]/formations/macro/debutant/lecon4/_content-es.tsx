"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { InflationChainDiagram } from "@/app/components/charts/InflationChainDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Qué es la macro",                       href: "/formations/macro/debutant/lecon1", disabled: false },
  { id: "lecon2", title: "Los 4 grandes bancos centrales",        href: "/formations/macro/debutant/lecon2", disabled: false },
  { id: "lecon3", title: "Los datos macro a vigilar",             href: "/formations/macro/debutant/lecon3", disabled: false },
  { id: "lecon4", title: "Entender la inflación",                 href: "/formations/macro/debutant/lecon4", disabled: false },
  { id: "lecon5", title: "El rol del dólar en el mundo",          href: null,                                disabled: true  },
  { id: "lecon6", title: "Macro y risk management",               href: null,                                disabled: true  },
];

export default function ContentEs() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-debutant", "lecon4"));
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
          <span className="text-zinc-500">Lección 4</span>
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
            Entender la inflación — por qué todo parte de ahí
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              2022. La baguette pasa de 1€ a 1,30€. Y al mismo tiempo, la Fed sube sus tasas 20 veces en 18 meses.
            </p>
            <p className="text-[15px] text-zinc-400 leading-relaxed mt-2">
              No es una casualidad.
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

          {/* Bloque 1 — La inflación es concreta */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">La inflación es algo concreto (no teórico)</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              La inflación es simple:
            </p>
            <ul className="space-y-1.5 mb-4">
              {["los precios suben", "tu dinero vale menos"].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="bg-zinc-800/30 rounded-xl px-4 py-3 mb-4">
              <p className="text-sm font-semibold text-zinc-200 mb-2">Ejemplo real:</p>
              <ul className="space-y-1">
                <li className="text-sm text-zinc-300">una baguette a 1€</li>
                <li className="text-sm text-zinc-300">dos años después → 1,30€</li>
              </ul>
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              No hiciste nada. Pero tu poder adquisitivo bajó. <span className="font-semibold text-zinc-200">Eso es la inflación.</span>
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Se mide en % al año:
            </p>
            <ul className="space-y-1.5 mb-5">
              {[
                { bold: "2%", rest: " → normal" },
                { bold: "5%+", rest: " → problemático" },
              ].map((item) => (
                <li key={item.bold} className="flex items-center gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Cuando los precios suben, tu dinero baja.
              </p>
            </div>
          </section>

          {/* Bloque 2 — Por qué los bancos centrales la odian */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Por qué los bancos centrales la odian</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Una inflación demasiado alta es peligrosa:
            </p>
            <ul className="space-y-1.5 mb-4">
              {["destruye el ahorro", "genera inestabilidad", "puede llevar a una crisis"].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Los bancos centrales tienen una misión: <span className="font-semibold text-zinc-200">mantener la inflación en torno al 2%</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">¿Por qué?</p>
            <ul className="space-y-1.5 mb-4">
              {[
                { bold: "demasiado bajo", rest: " → economía lenta" },
                { bold: "demasiado alto", rest: " → economía inestable" },
              ].map((item) => (
                <li key={item.bold} className="flex items-center gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">
              Por eso, en cuanto la inflación sube demasiado, deben actuar.
            </p>
          </section>

          {/* Bloque 3 — La cadena que controla el mercado */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">La cadena que controla el mercado</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Aquí va el mecanismo más importante de toda la macro:
            </p>
            <div className="space-y-2 mb-4">
              {[
                { n: "1", text: "La inflación sube" },
                { n: "2", text: "El banco central reacciona" },
                { n: "3", text: "Sube las tasas" },
                { n: "4", text: "La divisa se vuelve más atractiva" },
                { n: "5", text: "Los mercados reaccionan" },
              ].map((item) => (
                <div key={item.n} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-2.5">
                  <span className="text-xs font-bold text-zinc-500 shrink-0 mt-0.5">{item.n}.</span>
                  <p className="text-sm text-zinc-300 leading-relaxed font-semibold text-zinc-200">{item.text}</p>
                </div>
              ))}
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Resultado</span>:
            </p>
            <ul className="space-y-1.5 mb-5">
              {[
                "la divisa sube",
                "los índices bajan a menudo",
                "el oro baja a menudo",
                "las crypto bajan a menudo",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Inflación = punto de partida. Todo lo demás sigue.
              </p>
            </div>
          </section>

          {/* Bloque 4 — Ejemplo real (2022-2023) */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Ejemplo real (2022-2023)</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Es exactamente lo que pasó recientemente.
            </p>
            <div className="space-y-3 mb-5">
              <div className="bg-zinc-800/30 rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-zinc-200 mb-1">Fase 1 — La inflación explota</p>
                <p className="text-sm text-zinc-300">
                  la inflación de EE. UU. sube de 1.4% a <span className="font-semibold text-zinc-200">9.1%</span> (récord en 40 años).
                </p>
              </div>
              <div className="bg-zinc-800/30 rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-zinc-200 mb-1">Fase 2 — La Fed entra en pánico y actúa</p>
                <p className="text-sm text-zinc-300">
                  sube las tasas de <span className="font-semibold text-zinc-200">0.25% a 5.5%</span> en menos de 18 meses — uno de los ciclos de subida más violentos de la historia.
                </p>
              </div>
              <div className="bg-zinc-800/30 rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-zinc-200 mb-1">Fase 3 — El dólar explota</p>
                <p className="text-sm text-zinc-300">
                  el DXY (índice del dólar) gana <span className="font-semibold text-zinc-200">+20%</span> en 2022. EUR/USD pasa de 1.20 a 0.95.
                </p>
              </div>
              <div className="bg-zinc-800/30 rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-zinc-200 mb-2">Fase 4 — Todos los mercados se desploman</p>
                <ul className="space-y-1">
                  <li className="text-sm text-zinc-300">Nasdaq: <span className="font-semibold text-zinc-200">-33%</span> en 2022</li>
                  <li className="text-sm text-zinc-300">Bitcoin: <span className="font-semibold text-zinc-200">-65%</span> en el año</li>
                  <li className="text-sm text-zinc-300">Oro: volátil con caídas hasta <span className="font-semibold text-zinc-200">-15%</span></li>
                  <li className="text-sm text-zinc-300">Bonos: el peor año en 100 años</li>
                </ul>
              </div>
            </div>

            {/* Componente visual */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden mb-5">
              <InflationChainDiagram locale="es" />
            </div>

            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Una sola causa macro hizo mover TODO el mercado.
              </p>
            </div>
          </section>

          {/* Bloque 5 — Cómo la siguen los traders */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Cómo la siguen los traders</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              No miras la inflación directamente todos los días.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Pero sí vigilas:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                { text: "las publicaciones mensuales (como ", bold: "CPI", after: ")" },
                { text: "los discursos de los bancos centrales", bold: null, after: null },
                { text: "las expectativas del mercado", bold: null, after: null },
                { text: "los indicadores relacionados (como el ", bold: "Core PCE", after: " — el indicador favorito de la Fed)" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>
                    {item.text}
                    {item.bold && <span className="font-semibold text-zinc-200">{item.bold}</span>}
                    {item.after}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">
              El objetivo no es ser experto. El objetivo es <span className="font-semibold text-zinc-200">entender la dirección</span>.
            </p>
          </section>

          {/* Bloque 6 — Por qué es vital para ti */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Por qué es vital para ti</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Si entiendes la inflación:
            </p>
            <ul className="space-y-1.5 mb-5">
              {[
                "entiendes por qué los bancos centrales se mueven",
                "entiendes por qué el dólar sube o baja",
                "entiendes por qué los mercados reaccionan",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            {/* Recuadro 💰 Realidad del retail */}
            <div className="bg-zinc-800/50 border-l-4 border-amber-400 px-5 py-4 rounded mb-5">
              <div className="flex items-center gap-2 mb-2">
                <span>💰</span>
                <span className="text-sm font-bold text-amber-400 tracking-wide">Realidad del retail</span>
              </div>
              <p className="text-base text-zinc-300 leading-relaxed">
                ¿Operas sin seguir la inflación de EE. UU.? Es como conducir en la autopista sin mirar el velocímetro. Quizás sobrevivas 10 minutos — pero no mucho más.
              </p>
            </div>

            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Si entiendes la inflación, entiendes el mercado.
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
              "La inflación = subida de precios + caída del poder adquisitivo",
              "Los bancos centrales la controlan a través de las tasas",
              "La cadena central: Inflación → Tasas → Divisa → Mercados",
              "Entender la inflación = entender el 80% de la macro",
            ]}
          />

          <LessonExercice
            description="Empieza a integrar la inflación en tu análisis."
            steps={[
              "Busca el nivel actual de inflación en EE. UU. (basta con una aproximación, en Investing.com).",
              "Anota si está alto o bajo (por encima o por debajo del 2-3%).",
              "Observa la tendencia en los últimos 6 meses (al alza o a la baja).",
              "Observa el comportamiento del dólar (DXY o EUR/USD) en el mismo período.",
              "Hazte la pregunta: ¿es coherente con la cadena de causalidad?",
            ]}
          />
          <p className="text-sm text-zinc-500 leading-relaxed px-1">
            El objetivo: <span className="font-semibold text-zinc-400">crear el vínculo entre inflación y mercado</span> en tu cabeza.
          </p>

          <LessonQuiz
            question="La inflación de EE. UU. sale en 5% (en lugar del 3% esperado). Sin siquiera conocer la continuación, ¿cuál es la reacción más probable del dólar en las horas siguientes?"
            options={[
              "El dólar baja — la inflación es mala para la divisa",
              "El dólar sube — el mercado anticipa que la Fed subirá sus tasas para combatir la inflación",
              "Ningún movimiento — la inflación solo afecta a los consumidores, no a los mercados",
              "El dólar solo reacciona cuando la Fed toma una decisión real",
            ]}
            correctIndex={1}
            explanation="El mercado anticipa la cadena de causalidad incluso antes de que la Fed actúe. Inflación sorpresa alta → anticipación de subida de tasas → mayor demanda de dólares → el dólar sube. Eso es exactamente lo que pasó en 2022 cuando la inflación explotó: el DXY subió incluso antes de las subidas de tasas. La opción A confunde causa a largo plazo y reacción inmediata. La opción C es falsa — la inflación es EL driver macro principal. La opción D ignora el papel de las anticipaciones: el mercado se mueve por anticipaciones, no por hechos consumados (ver lección 3 sobre consenso vs real)."
            answerExplanations={[
              "Falso. La inflación alta se percibe como positiva para la divisa a corto plazo porque señala que el banco central va a subir las tasas — lo que atrae capitales. La confusión viene del largo plazo, donde una inflación sin control puede destruir la divisa.",
              "Correcto. El mercado anticipa la cadena incluso antes de que la Fed actúe: inflación sorpresa → subida de tasas probable → dólar atractivo → el dólar sube. Eso es exactamente lo que pasó en 2022.",
              "Falso. La inflación es el driver macro principal de todos los mercados. Una sorpresa inflacionaria de +2% desata movimientos inmediatos en forex, bonos, acciones y materias primas.",
              "Falso. El mercado se mueve por anticipaciones, no por decisiones oficiales. En cuanto sale el dato CPI, los traders reevalúan la probabilidad de subida de tasas — y el dólar se mueve inmediatamente.",
            ]}
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => { const p = getStoredProgress(); markLessonComplete(p, "macro-debutant", "lecon4"); setDone(true); }}
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
                  <p className="text-xs text-zinc-500 mt-0.5">La próxima lección (El rol del dólar en el mundo) estará disponible pronto.</p>
                </div>
              </div>
            )}

            {/* Navegación */}
            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/formations/macro/debutant/lecon3"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lección 3 — Los datos macro a vigilar
              </Link>
              <span className="text-sm text-zinc-700 cursor-default">
                El rol del dólar en el mundo — Pronto disponible →
              </span>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
