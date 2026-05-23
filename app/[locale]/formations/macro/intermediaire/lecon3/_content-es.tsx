"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { InflationIndicatorsChainDiagram } from "@/app/components/charts/InflationIndicatorsChainDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Hawkish vs Dovish",                      href: "/formations/macro/intermediaire/lecon1", disabled: false },
  { id: "lecon2", title: "Entender el calendario económico",        href: "/formations/macro/intermediaire/lecon2", disabled: false },
  { id: "lecon3", title: "CPI, PPI e inflación",                    href: "/formations/macro/intermediaire/lecon3", disabled: false },
  { id: "lecon4", title: "El carry trade",                          href: null,                                     disabled: true  },
  { id: "lecon5", title: "Las correlaciones macro",                 href: null,                                     disabled: true  },
  { id: "lecon6", title: "Construir tu sesgo semanal",              href: null,                                     disabled: true  },
];

export default function ContentEs() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-intermediaire", "lecon3"));
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
          <span className="text-zinc-500">Lección 3</span>
        </nav>

        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-400/10 text-blue-400 border border-blue-400/20">
              Intermedio
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
            CPI, PPI e inflación — descifrar los datos que mueven al mercado
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              14:30. Sale el CPI, el mercado explota. Pero los pros no esperaron el shock.
            </p>
            <p className="text-[15px] text-zinc-400 leading-relaxed mt-2">
              La verdadera señal había salido 12 días antes — en un dato que nadie mira: el PPI.
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
              const isCurrent = lesson.id === "lecon3";
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
            <span className="ml-auto text-xs text-zinc-600">3 / 6 lecciones</span>
          </div>
        </header>

        {/* ── Contenido ── */}
        <div className="space-y-8">

          {/* Bloque 1 — La cadena de inflación */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">La cadena de inflación — del productor al consumidor</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              La inflación no cae del cielo. Sigue una <span className="font-semibold text-zinc-200">cadena lógica</span>: del productor hacia el consumidor, con indicadores en cada etapa.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              El mercado vigila <span className="font-semibold text-zinc-200">4 indicadores clave</span>, en este orden:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                { bold: "PPI", rest: " (Producer Price Index) — los precios a la salida de fábrica" },
                { bold: "CPI Headline", rest: " — la inflación total que siente el consumidor" },
                { bold: "Core CPI", rest: " — la inflación excluyendo energía y alimentación" },
                { bold: "Core PCE", rest: " — el indicador oficial de la Fed" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>

            {/* Componente visual */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden mb-5">
              <InflationIndicatorsChainDiagram locale="es" />
            </div>

            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                El PPI avisa. El CPI dispara. El Core confirma.
              </p>
            </div>
          </section>

          {/* Bloque 2 — El PPI, la señal temprana */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">El PPI — la señal temprana que el mercado ignora</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              El PPI sale aproximadamente <span className="font-semibold text-zinc-200">12 días antes que el CPI</span>. Es el precio que reciben los productores por sus bienes — antes de que la inflación llegue al consumidor.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">¿Por qué es una señal temprana?</span> Porque los aumentos de costos en los productores casi siempre terminan trasladándose aguas abajo.
            </p>
            <ul className="space-y-2 mb-4">
              {[
                { bold: "PPI al alza", rest: " → los productores trasladan → el CPI sube en las semanas siguientes" },
                { bold: "PPI estable o a la baja", rest: " → presión inflacionaria reducida → el CPI puede bajar" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Ejemplo concreto</span>: si el PPI de enero sale muy por encima de las expectativas, los traders experimentados empiezan a reposicionar su exposición <span className="font-semibold text-zinc-200">antes incluso del CPI</span> de febrero.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              El principiante reacciona al CPI. El trader intermedio <span className="font-semibold text-zinc-200">se prepara con el PPI</span>.
            </p>
            <div className="bg-zinc-800/30 rounded-xl px-4 py-3 mb-5">
              <p className="text-xs font-semibold text-zinc-400 mb-2">Cuando el PPI sorprende con fuerza, los pros vigilan en paralelo:</p>
              <ul className="space-y-1.5">
                {[
                  { bold: "DXY", rest: " (fuerza del dólar) — anticipación de la reacción de la Fed" },
                  { bold: "XAU/USD", rest: " — a menudo el primero en reaccionar a las señales inflacionarias" },
                  { bold: "Nasdaq", rest: " — sensible a los yields largos US (inflación = tasas altas = tech bajo presión)" },
                  { bold: "BTC/USD", rest: " — tiende a anticipar el risk-on/risk-off global" },
                ].map((item) => (
                  <li key={item.bold} className="flex items-start gap-2 text-xs text-zinc-400">
                    <div className="w-1 h-1 rounded-full bg-zinc-600 shrink-0 mt-1.5" />
                    <span><span className="font-semibold text-zinc-300">{item.bold}</span>{item.rest}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-zinc-500 mt-2 italic">Las instituciones no se conforman con EUR/USD para validar una hipótesis inflacionaria.</p>
            </div>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Leer el PPI es ver la inflación antes de que llegue.
              </p>
            </div>
          </section>

          {/* Bloque 3 — CPI Headline vs Core CPI */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">CPI Headline vs Core CPI — por qué lo cambia todo</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Cuando sale el CPI, ves dos números. La mayoría de los principiantes solo mira el primero.
            </p>
            <div className="space-y-2 mb-4">
              <p className="text-zinc-300 leading-relaxed text-sm">
                <span className="font-semibold text-zinc-200">CPI Headline</span> → la inflación total, energía y alimentación incluidas. Es el dato que sale en los medios. Es <span className="font-semibold text-zinc-200">volátil</span> — sube y baja con el precio del petróleo.
              </p>
              <p className="text-zinc-300 leading-relaxed text-sm">
                <span className="font-semibold text-zinc-200">Core CPI</span> → la inflación excluyendo energía y alimentación. Es la <span className="font-semibold text-zinc-200">tendencia de fondo</span>. Es lo que realmente miran los pros.
              </p>
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Ejemplo típico</span>:
            </p>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3 mb-4">
              <p className="text-sm text-zinc-300">CPI Headline: <span className="font-semibold text-zinc-200">+2,1%</span> (en línea con las expectativas)</p>
              <p className="text-sm text-zinc-300 mt-1">Core CPI: <span className="font-semibold text-zinc-200">+3,6%</span> (superior a las expectativas de 3,2%)</p>
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              ¿La reacción del mercado? <span className="font-semibold text-zinc-200">Alza del dólar, caída del oro, retroceso de los índices</span>. Y sin embargo el Headline estaba dentro de lo esperado.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Fue el <span className="font-semibold text-zinc-200">Core el que disparó todo</span>. Porque es el que envía una señal sobre la política monetaria que viene.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                El Headline hace el ruido. El Core hace el movimiento.
              </p>
            </div>
          </section>

          {/* Bloque 4 — Core PCE, el indicador oficial de la Fed */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Core PCE — el indicador oficial de la Fed</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              El Core PCE (Personal Consumption Expenditures) es el <span className="font-semibold text-zinc-200">indicador de inflación oficialmente preferido por la Fed</span>. Sale aproximadamente 2 semanas después del CPI.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">¿Por qué la Fed prefiere el PCE?</span>
            </p>
            <ul className="space-y-2 mb-4">
              {[
                { bold: "Cubre una canasta más amplia", rest: " que el CPI" },
                { bold: "Ajusta automáticamente", rest: " los hábitos de consumo (si la carne sube, la gente compra pollo — el PCE lo captura)" },
                { bold: "Suaviza mejor", rest: " las variaciones temporales" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Meta oficial de la Fed</span>: 2% de Core PCE anual.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Cuando el Core PCE supera esa meta, la Fed se vuelve hawkish. Cuando se acerca al 2%, puede empezar a hablar de recorte de tasas. <span className="font-semibold text-zinc-200">Todo parte de ahí.</span>
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                El Core PCE es el termómetro que mira la Fed antes de decidir.
              </p>
            </div>
          </section>

          {/* Bloque 5 — Reacción del mercado en la práctica */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Reacción del mercado — lo que pasa en la práctica</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              El escenario más frecuente el día del CPI:
            </p>
            <div className="space-y-2 mb-4">
              <p className="text-zinc-300 leading-relaxed text-sm">
                <span className="font-semibold text-zinc-200">Core CPI superior a las expectativas</span> → dólar fuerte, oro a la baja, crypto e índices bajo presión.
              </p>
              <p className="text-zinc-300 leading-relaxed text-sm">
                <span className="font-semibold text-zinc-200">Core CPI inferior a las expectativas</span> → dólar débil, oro e índices al alza, anticipación de recorte de tasas.
              </p>
            </div>

            <div className="bg-zinc-900/60 rounded-xl px-4 py-3 mb-5">
              <p className="text-xs font-semibold text-zinc-400 mb-2">Concretamente, en un Core CPI que sorprende con fuerza al alza (ej: 3.5% vs 3.2% esperado) — primeros 30 minutos:</p>
              <div className="overflow-hidden rounded-xl border border-zinc-800">
                <div className="grid grid-cols-2 border-b border-zinc-800">
                  <div className="px-4 py-2 bg-zinc-800/50 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Activo</div>
                  <div className="px-4 py-2 bg-zinc-800/50 text-xs font-semibold text-zinc-500 uppercase tracking-wider border-l border-zinc-800">Reacción típica</div>
                </div>
                <div className="divide-y divide-zinc-800/60">
                  {[
                    { asset: "EUR/USD", reaction: "-100 a -150 pips" },
                    { asset: "XAU/USD", reaction: "-30 a -50$" },
                    { asset: "Nasdaq", reaction: "-1.5 a -2%" },
                    { asset: "BTC/USD", reaction: "-800 a -1500$" },
                  ].map((row) => (
                    <div key={row.asset} className="grid grid-cols-2">
                      <div className="px-4 py-2.5 text-sm font-semibold text-zinc-200">{row.asset}</div>
                      <div className="px-4 py-2.5 text-sm text-red-400 font-semibold border-l border-zinc-800/60">{row.reaction}</div>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs text-zinc-500 mt-2 italic">La inflación Core sorprende → la Fed puede mantenerse hawkish por más tiempo → todos los activos de riesgo corrigen al mismo tiempo.</p>
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Pero cuidado con el primer movimiento</span>. A menudo llamado &apos;fakeout&apos;: el mercado salta en una dirección, luego se invierte unos minutos después cuando los algos y los traders institucionales absorben todo el reporte.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Regla práctica</span>: esperar <span className="font-semibold text-zinc-200">2 a 5 minutos</span> después de la publicación para ver la dirección real confirmarse. El primer tick a menudo no es el verdadero movimiento.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              La combinación PPI + CPI + Core PCE en la misma dirección es la señal más fuerte. Cuando los 3 convergen, la Fed ya no tiene excusa para no actuar.
            </p>

            {/* Cuadro Realidad del retail */}
            <div className="bg-zinc-800/50 border-l-4 border-amber-400 px-5 py-4 rounded">
              <div className="flex items-center gap-2 mb-2">
                <span>💰</span>
                <span className="text-sm font-bold text-amber-400 tracking-wide">Realidad del retail</span>
              </div>
              <p className="text-base text-zinc-300 leading-relaxed">
                El retail entra en el primer movimiento y termina saliendo en la reversión. El pro espera la confirmación y entra en el verdadero momentum. ¿La diferencia entre los dos? <span className="font-semibold text-zinc-200">2 a 5 minutos de paciencia</span>.
              </p>
            </div>
          </section>

          {/* Bloque 6 — Cómo leer estos datos como un trader */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Cómo leer estos datos como un trader</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              El día del CPI, tu proceso debe ser estructurado. Sin decisiones por instinto.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Check-list previo a la publicación</span>:
            </p>
            <div className="space-y-2 mb-5">
              {[
                { n: "1", bold: "PPI de la semana anterior:", rest: " ¿al alza o a la baja?" },
                { n: "2", bold: "Consenso del Core CPI:", rest: " ¿en qué nivel?" },
                { n: "3", bold: "Core CPI previo:", rest: " ¿tendencia alcista o bajista?" },
                { n: "4", bold: "Contexto Fed:", rest: " ¿ciclo de subidas, pausa o recortes en curso?" },
                { n: "5", bold: "Tu plan A y plan B:", rest: " listos antes de las 14:30" },
              ].map((item) => (
                <div key={item.n} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
                  <span className="text-xs font-bold text-zinc-500 shrink-0 mt-0.5">{item.n}.</span>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    <span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Si el escenario se confirma después de 2-5 minutos: entras con tu tamaño habitual.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Si la reacción es confusa o contradictoria: <span className="font-semibold text-zinc-200">no operas</span>. No es una oportunidad perdida — es capital preservado.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Un dato de inflación bien preparado es una oportunidad. Mal preparado, es una trampa.
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
              "La cadena de inflación sigue un orden: PPI → CPI Headline → Core CPI → Core PCE",
              "El PPI sale 12 días antes del CPI — es la señal temprana que el mercado subestima",
              "El Core CPI (excluyendo energía y alimentación) es lo que realmente miran los pros",
              "El Core PCE es el indicador oficial de la Fed, con una meta del 2% anual",
              "Esperar 2-5 minutos después de la publicación para evitar el fakeout del primer tick",
            ]}
          />

          <LessonExercice
            description="Prepara una publicación de CPI como un trader intermedio."
            steps={[
              "Encuentra la fecha del próximo CPI US en tu calendario económico.",
              "Anota el consenso del Core CPI y el dato anterior.",
              "Revisa el PPI publicado en las semanas previas — ¿estuvo al alza o a la baja?",
              "Escribe tu plan A (Core CPI > expectativas) y tu plan B (Core CPI < expectativas) con los mercados involucrados.",
              "El día D, espera 2-5 minutos después de las 14:30 antes de cualquier decisión.",
            ]}
          />
          <p className="text-sm text-zinc-500 leading-relaxed px-1">
            El objetivo: <span className="font-semibold text-zinc-400">dejar de sufrir el CPI. Anticiparlo con el PPI y operarlo con un plan</span>.
          </p>

          <LessonQuiz
            question="El PPI acaba de salir muy por encima de las expectativas. El CPI todavía no se publica. ¿Qué indica esta información con mayor probabilidad?"
            options={[
              "Nada — el PPI y el CPI son indicadores independientes sin relación directa",
              "Una presión inflacionaria aguas arriba que probablemente se reflejará en el próximo CPI",
              "El dólar necesariamente va a bajar en los próximos días",
              "La Fed va a anunciar de inmediato una subida de tasas",
            ]}
            correctIndex={1}
            explanation="El PPI mide los precios a la salida de fábrica. Cuando supera las expectativas, los costos de producción más altos generalmente se trasladan a los consumidores en las semanas siguientes — lo que tiende a hacer subir el CPI. Es la lógica de la cadena de inflación. La opción A es falsa: existe un vínculo documentado entre PPI y CPI. La opción C es demasiado directa y demasiado segura — la reacción del dólar depende del contexto global. La opción D es falsa: la Fed espera varias publicaciones antes de actuar, no reacciona a un solo dato PPI aislado. Un PPI que sorprende al alza no impacta solo a EUR/USD — XAU/USD, Nasdaq y BTC/USD a menudo anticipan la misma reevaluación hawkish antes incluso de la publicación del CPI."
            answerExplanations={[
              "Falso. PPI y CPI están conectados por la cadena de transmisión de la inflación. Los aumentos de costos de los productores se trasladan a los consumidores en las semanas siguientes.",
              "Correcto. Un PPI alto señala una presión inflacionaria aguas arriba. Esos costos adicionales generalmente terminan trasladándose, lo que puede hacer subir el próximo CPI.",
              "Falso. La reacción del dólar depende del contexto global, de las expectativas de la Fed y de otros factores. Un PPI alto por sí solo no garantiza una caída inmediata del dólar.",
              "Falso. La Fed observa varias publicaciones a lo largo del tiempo antes de modificar su política. Un solo dato PPI no desencadena un anuncio de subida de tasas.",
            ]}
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => { const p = getStoredProgress(); markLessonComplete(p, "macro-intermediaire", "lecon3"); setDone(true); }}
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
                  <p className="text-xs text-zinc-500 mt-0.5">La próxima lección (El carry trade) estará disponible pronto.</p>
                </div>
              </div>
            )}

            {/* Navegación */}
            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/formations/macro/intermediaire/lecon2"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lección 2 — Entender el calendario económico
              </Link>
              <span className="text-sm text-zinc-700 cursor-default">
                El carry trade — Pronto disponible →
              </span>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
