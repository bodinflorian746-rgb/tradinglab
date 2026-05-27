"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { CentralBanksHierarchy } from "@/app/components/charts/CentralBanksHierarchy";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Qué es la macro",                       href: "/formations/macro/debutant/lecon1", disabled: false },
  { id: "lecon2", title: "Los 4 grandes bancos centrales",        href: "/formations/macro/debutant/lecon2", disabled: false },
  { id: "lecon3", title: "Los datos macro a vigilar",             href: null,                                disabled: true  },
  { id: "lecon4", title: "Entender la inflación",                 href: null,                                disabled: true  },
  { id: "lecon5", title: "El rol del dólar en el mundo",          href: null,                                disabled: true  },
  { id: "lecon6", title: "Macro y risk management",               href: null,                                disabled: true  },
];

export default function ContentEs() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-debutant", "lecon2"));
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
          <span className="text-zinc-500">Lección 2</span>
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
            Los 4 grandes bancos centrales, quién controla el mercado
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Si Powell tose, el planeta trading agarra un resfriado.
            </p>
            <p className="text-[15px] text-zinc-400 leading-relaxed mt-2">
              Y tú operas ese planeta, lo sepas o no.
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
                    : "border-zinc-800 text-zinc-500"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? "bg-white" : "bg-zinc-600"}`} />
                  {lesson.title}
                </span>
              );
              return <div key={lesson.id}>{pill}</div>;
            })}
            <span className="ml-auto text-xs text-zinc-600">2 / 6 lecciones</span>
          </div>
        </header>

        {/* ── Contenu ── */}
        <div className="space-y-8">

          {/* Bloc 1 — Les 4 banques que tu dois connaître */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Los 4 bancos que debes conocer</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              No necesitas conocer 50 instituciones. En realidad, <span className="font-semibold text-zinc-200">4 bancos centrales manejan lo esencial del mercado</span>:
            </p>
            <div className="space-y-2.5 mb-4">
              {[
                { label: "Fed", desc: "Reserva Federal estadounidense", devise: "dólar (USD)" },
                { label: "ECB", desc: "Banco Central Europeo",          devise: "euro (EUR)"   },
                { label: "BoE", desc: "Bank of England",                devise: "libra (GBP)"  },
                { label: "BoJ", desc: "Banco de Japón",                 devise: "yen (JPY)"    },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 shrink-0 mt-1.5" />
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    <span className="font-semibold text-zinc-200">{item.label}</span> ({item.desc}) → controla el <span className="font-semibold text-zinc-200">{item.devise}</span>
                  </p>
                </div>
              ))}
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Estas 4 divisas representan la mayoría de los intercambios en el mercado mundial.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Entender estos 4 bancos es entender la mayoría de los movimientos del mercado.
              </p>
            </div>
          </section>

          {/* Bloc 2 — Pourquoi elles sont si importantes */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Por qué son tan importantes</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Estos bancos influyen en <span className="font-semibold text-zinc-200">todos los mercados</span>:
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                "Forex (EUR/USD, GBP/USD, USD/JPY…)",
                "Índices (NASDAQ, S&P500, CAC40…)",
                "Oro (XAU/USD)",
                "Crypto (BTC, ETH)",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              ¿Por qué? Porque controlan <span className="font-semibold text-zinc-200">el costo del dinero</span>.
            </p>
            <div className="bg-zinc-800/50 border border-zinc-700/40 rounded-xl px-4 py-4 mb-4">
              <div className="space-y-1.5">
                <p className="text-sm leading-relaxed text-emerald-400 font-medium">
                  Cuando un banco central <span className="font-semibold">sube</span> sus tasas → el dinero se vuelve más caro → los mercados se frenan.
                </p>
                <p className="text-sm leading-relaxed text-emerald-400 font-medium">
                  Cuando <span className="font-semibold">baja</span> sus tasas → el dinero circula más → los mercados suben.
                </p>
              </div>
            </div>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
              <p className="text-sm text-zinc-400 leading-relaxed">
                <span className="text-white font-medium">Ejemplo concreto:</span> Cuando la Fed endurece su tono (solo un discurso, ni siquiera una decisión), el EUR/USD puede perder <span className="font-semibold text-zinc-300">100 a 300 pips en 24h</span>. En 0.10 lote, eso son <span className="font-semibold text-zinc-300">100 a 300$ de movimiento</span> a digerir en pocas horas.
              </p>
            </div>
          </section>

          {/* Bloc 3 — Ce qu'elles font concrètement */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Qué hacen concretamente</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Un banco central no opera directamente. <span className="font-semibold text-zinc-200">Influye</span> en el mercado.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Actúa principalmente sobre 3 palancas:
            </p>
            <div className="space-y-3 mb-5">
              {[
                { n: "1", label: "Las tasas de interés",  text: "cuánto cuesta el dinero prestado" },
                { n: "2", label: "La liquidity",          text: "inyectar o retirar dinero del sistema" },
                { n: "3", label: "La comunicación",       text: "discursos, decisiones, proyecciones futuras" },
              ].map((item) => (
                <div key={item.n} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
                  <span className="text-xs font-bold text-zinc-500 shrink-0 mt-0.5">{item.n}.</span>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    <span className="font-semibold text-zinc-200">{item.label}</span> → {item.text}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              La 3ra palanca es la más poderosa a corto plazo. Una sola palabra de Powell puede mover los mercados mundiales durante 48h, <span className="font-semibold text-zinc-200">antes incluso de que se tome una decisión</span>.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                El mercado no sigue a los traders. Sigue a los bancos centrales.
              </p>
            </div>
          </section>

          {/* Bloc 4 — La Fed : le boss du jeu */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">La Fed: el jefe del juego</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Todos los bancos cuentan. Pero uno domina.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              <span className="font-semibold text-zinc-200">La Fed.</span>
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">¿Por qué?</p>
            <ul className="space-y-2 mb-5">
              {[
                { bold: "El dólar US es la divisa de reserva mundial", rest: "" },
                { bold: "El comercio internacional se hace en USD", rest: "" },
                { bold: "Las materias primas", rest: " (oro, petróleo, trigo) se cotizan en USD" },
                { bold: "Más del 60% de las reservas mundiales", rest: " de los bancos centrales están en USD" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Cuando la Fed se mueve, <span className="font-semibold text-zinc-200">el mundo entero reacciona</span>. Los demás bancos centrales suelen ajustar su política en reacción a la Fed, no al revés.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              <span className="font-semibold text-zinc-200">Analogía simple</span>: la Fed es el director de orquesta. Los otros 3 tocan su partitura alrededor.
            </p>

            {/* Composant visuel */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden mb-5">
              <CentralBanksHierarchy />
            </div>

            {/* Encadré 💰 Réalité du retail */}
            <div className="bg-zinc-800/50 border-l-4 border-amber-400 px-5 py-4 rounded mb-5">
              <div className="flex items-center gap-2 mb-2">
                <span>💰</span>
                <span className="text-sm font-bold text-amber-400 tracking-wide">Realidad del retail</span>
              </div>
              <p className="text-base text-zinc-300 leading-relaxed">
                ¿Seguro operas EUR/USD, GBP/USD o XAU/USD? Esos 3 pares están <span className="font-semibold text-zinc-200">todos contra el dólar</span>. Entonces en la práctica, <span className="font-semibold text-zinc-200">operas la Fed el 80% del tiempo</span>, aunque creas estar operando &apos;solo el euro&apos; o &apos;solo el oro&apos;. Entender la Fed = entender el 80% de tus trades.
              </p>
            </div>

            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Si ignoras a la Fed, operas a ciegas.
              </p>
            </div>
          </section>

          {/* Bloc 5 — Le calendrier de leurs réunions */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">El calendario de sus reuniones</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Estos 4 bancos toman sus decisiones de tasas en fechas <span className="font-semibold text-zinc-200">conocidas con anticipación</span>:
            </p>
            <ul className="space-y-2 mb-5">
              {[
                { label: "FOMC (Fed)", freq: "~8 reuniones por año" },
                { label: "ECB",        freq: "~8 reuniones por año" },
                { label: "BoE",        freq: "~8 reuniones por año" },
                { label: "BoJ",        freq: "~8 reuniones por año" },
              ].map((item) => (
                <li key={item.label} className="flex items-center gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
                  <span><span className="font-semibold text-zinc-200">{item.label}</span> → {item.freq}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              ¿Por qué es importante para ti como trader?
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Porque esos días, el mercado se vuelve <span className="font-semibold text-zinc-200">mucho más volátil</span>. No solo el día D, sino también <span className="font-semibold text-zinc-200">las horas previas</span> (anticipación) y las que siguen (reacción).
            </p>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
              <p className="text-sm text-zinc-400 leading-relaxed">
                <span className="text-white font-medium">Para recordar:</span> En EUR/USD, una decisión FOMC puede generar <span className="font-semibold text-zinc-300">200 a 500 pips de movimiento total</span> en pocas horas (ver lección Macro Avanzado sobre el FOMC para detalles).
              </p>
            </div>
          </section>

          {/* Bloc 6 — Comment suivre concrètement */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Cómo seguirlos concretamente</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              No necesitas volverte experto macro. Esta es la rutina simple:
            </p>
            <div className="space-y-3 mb-5">
              {[
                { n: "1", text: "Revisar el calendario económico cada semana (Investing.com, Forex Factory)" },
                { n: "2", text: "Identificar las decisiones de los 4 bancos centrales" },
                { n: "3", text: "Anotar las horas importantes en tu planning" },
                { n: "4", text: "Evitar operar sin entender el contexto de las 24-48h que rodean esas fechas" },
              ].map((item) => (
                <div key={item.n} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
                  <span className="text-xs font-bold text-zinc-500 shrink-0 mt-0.5">{item.n}.</span>
                  <p className="text-sm text-zinc-300 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Estos 4 bancos mueven los mercados en fechas conocidas. Si operas a ciegas esos días, es porque no miraste el calendario.
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
              "4 bancos centrales dominan el mercado: Fed, ECB, BoE, BoJ",
              "Controlan las tasas, la liquidity y la dirección de los mercados",
              "La Fed es la más importante (USD = divisa mundial, 80% de los pares mayores)",
              "Sus decisiones crean los mayores movimientos, conocer el calendario es indispensable",
            ]}
          />

          <LessonExercice
            description="Esta semana, empieza a seguir a los bancos centrales."
            steps={[
              "Entra a un calendario económico (Investing.com o Forex Factory).",
              "Busca las próximas reuniones Fed, ECB, BoE o BoJ del mes.",
              "Anota las fechas y horas en tu agenda personal.",
              "El día D, observa el gráfico del par involucrado (EUR/USD para ECB/Fed, GBP/USD para BoE, USD/JPY para BoJ) 30 min antes y 30 min después de la decisión.",
              "Anota lo que observas: dirección, amplitud en pips, volatilidad.",
            ]}
          />
          <p className="text-sm text-zinc-500 leading-relaxed px-1">
            El objetivo: acostumbrarte a <span className="font-semibold text-zinc-400">vincular los movimientos brutales</span> con sus <span className="font-semibold text-zinc-400">causas macro</span>.
          </p>

          <LessonQuiz
            question="Operas GBP/USD durante la semana de decisiones de tasas. La BoE anunció su tasa esta mañana (8h00 GMT) y la Fed anuncia la suya a las 20h00. ¿Qué evento moverá más probablemente tu par durante el día?"
            options={[
              "La BoE, es el banco central del GBP, así que impacto directo en GBP/USD",
              "La Fed, el dólar US influye en todos los pares mayores, y su impacto suele ser más fuerte",
              "Ninguno de los dos, las dos decisiones se anulan",
              "La BoE por la mañana, pero la Fed retomará el control por la noche",
            ]}
            correctIndex={1}
            explanation="Incluso en un par que contiene el GBP, la Fed sigue siendo el primer driver. El dólar US influye en todos los pares mayores, e históricamente, las decisiones de la Fed tienen más impacto en GBP/USD que las decisiones de la BoE misma. Es la confirmación de que la Fed es 'el jefe del juego' aun cuando crees estar operando 'otra cosa'. La opción D parece lógica pero no refleja la realidad, a menudo el efecto Fed borra completamente el efecto BoE más tarde en el día."
            answerExplanations={[
              "Falso. La BoE sí tiene un impacto en GBP/USD, pero históricamente, la Fed genera movimientos más fuertes en todos los pares mayores. Siendo el dólar US la divisa de reserva mundial, una decisión Fed impacta el conjunto del mercado forex, incluido GBP/USD.",
              "Correcto. La Fed es el primer driver incluso en GBP/USD. Su anuncio a las 20h00 va a dominar los movimientos del día. Es la confirmación del principio: la Fed es 'el jefe del juego' incluso en pares que parecen involucrar otras divisas.",
              "Falso. Las dos decisiones no se anulan automáticamente. Pueden superponerse, amplificarse o contradecirse, pero en la práctica, la Fed sigue siendo el driver dominante. El efecto 'anulación' es una simplificación incorrecta.",
              "Parcialmente lógico, pero incompleto. El efecto BoE por la mañana existe, pero la respuesta completa es que la Fed es globalmente el driver dominante, no solo en retoma nocturna. Históricamente, el efecto Fed a menudo borra completamente el efecto BoE anterior.",
            ]}
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => { const p = getStoredProgress(); markLessonComplete(p, "macro-debutant", "lecon2"); setDone(true); }}
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
                  <p className="text-xs text-zinc-500 mt-0.5">La próxima lección (Los datos macro a vigilar) estará disponible pronto.</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/formations/macro/debutant/lecon1"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lección 1. Qué es la macro
              </Link>
              <span className="text-sm text-zinc-700 cursor-default">
                Los datos macro a vigilar. Próximamente →
              </span>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
