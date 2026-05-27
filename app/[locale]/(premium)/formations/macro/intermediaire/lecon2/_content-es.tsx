"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { CalendarReadingComparisonDiagram } from "@/app/components/charts/CalendarReadingComparisonDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Hawkish vs Dovish",                          href: "/formations/macro/intermediaire/lecon1", disabled: false },
  { id: "lecon2", title: "Entender el calendario económico",            href: "/formations/macro/intermediaire/lecon2", disabled: false },
  { id: "lecon3", title: "CPI, PPI e inflación",                        href: null,                                     disabled: true  },
  { id: "lecon4", title: "El carry trade",                              href: null,                                     disabled: true  },
  { id: "lecon5", title: "Las correlaciones macro",                     href: null,                                     disabled: true  },
  { id: "lecon6", title: "Construir tu sesgo semanal",                  href: null,                                     disabled: true  },
];

export default function ContentEs() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-intermediaire", "lecon2"));
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
          <span className="text-zinc-500">Lección 2</span>
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
            Entender el calendario económico, cómo leer el mercado por adelantado
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Viernes 14:30. NFP sale en 205k vs 200k esperados. Movimiento nulo.
            </p>
            <p className="text-[15px] text-zinc-400 leading-relaxed mt-2">
              Tres minutos después, EUR/USD pierde 60 pips. No lo viste venir. El mercado, en cambio, sí vio la revisión.
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

          {/* Bloc 1 — Ce que tu rates en lecture débutant */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Lo que se te escapa en lectura principiante</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Leer un calendario económico no es solo identificar las news de 3 estrellas. <span className="font-semibold text-zinc-200">Eso es el nivel mínimo.</span>
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Un trader intermedio mira el contexto:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                "el consenso",
                "la cifra previa",
                "la cifra real",
                "las revisiones",
                "la semana macro completa",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span className="font-semibold text-zinc-200">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              <span className="font-semibold text-zinc-200">Analogía simple</span>: el calendario económico es un <span className="font-semibold text-zinc-200">GPS</span>. El principiante solo mira el destino. El trader preparado también mira las curvas, los atascos y las zonas peligrosas.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                El calendario no te da una alerta. Te da un mapa del riesgo.
              </p>
            </div>
          </section>

          {/* Bloc 2 — Les 4 colonnes à lire à chaque news */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Las 4 columnas que leer en cada news</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Cada publicación importante debe leerse con <span className="font-semibold text-zinc-200">4 datos</span>.
            </p>

            <div className="space-y-2 mb-4">
              <p className="text-zinc-300 leading-relaxed text-sm">
                <span className="font-semibold text-zinc-200">Consenso</span> → lo que espera el mercado.
              </p>
              <p className="text-zinc-300 leading-relaxed text-sm">
                <span className="font-semibold text-zinc-200">Previo</span> → la cifra publicada el mes pasado.
              </p>
              <p className="text-zinc-300 leading-relaxed text-sm">
                <span className="font-semibold text-zinc-200">Real</span> → la cifra que sale en el momento del anuncio.
              </p>
              <p className="text-zinc-300 leading-relaxed text-sm">
                <span className="font-semibold text-zinc-200">Revisiones</span> → <span className="font-semibold text-zinc-200">la trampa olvidada.</span> La cifra del mes previo puede ser corregida al alza o a la baja.
              </p>
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Ejemplo concreto</span>:
            </p>
            <ul className="space-y-1.5 mb-4">
              <li className="flex items-start gap-2.5 text-sm text-zinc-300">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                <span>NFP esperado: <span className="font-semibold text-zinc-200">200k</span></span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-zinc-300">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                <span>NFP real: <span className="font-semibold text-zinc-200">205k</span></span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-zinc-300">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                <span>Lectura principiante: &apos;nada especial&apos;</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-zinc-300">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                <span><span className="font-semibold text-zinc-200">Pero el mes previo se revisa de 250k a 170k</span></span>
              </li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Resultado: el mercado puede reaccionar fuerte, <span className="font-semibold text-zinc-200">aunque la cifra del día parezca neutra</span>. Es exactamente lo que pasó en el hero de esta lección.
            </p>

            <div className="bg-zinc-900/60 rounded-xl px-4 py-3 mb-5">
              <p className="text-xs font-semibold text-zinc-400 mb-2">Sobre esta revisión NFP (250k → 170k), todos estos activos se movieron simultáneamente:</p>
              <div className="space-y-1.5">
                {[
                  { asset: "EUR/USD", detail: "-60 pips", note: "dólar reevaluado al alza" },
                  { asset: "XAU/USD", detail: "-20 a -25$", note: "oro penalizado por el dólar fuerte" },
                  { asset: "Nasdaq", detail: "-0.8 a -1%", note: "mercado laboral sólido = tasas altas mantenidas" },
                  { asset: "BTC/USD", detail: "-300 a -500$", note: "risk-off sobre activos especulativos" },
                ].map((item) => (
                  <div key={item.asset} className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-300 w-20">{item.asset}</span>
                    <span className="text-red-400 font-semibold w-20">{item.detail}</span>
                    <span className="text-zinc-500 italic">{item.note}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-zinc-500 mt-2 italic">Una sola revisión NFP. Cuatro mercados impactados al mismo tiempo.</p>
            </div>

            {/* Composant visuel */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden mb-5">
              <CalendarReadingComparisonDiagram locale="es" />
            </div>

            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                La cifra del día no cuenta toda la historia.
              </p>
            </div>
          </section>

          {/* Bloc 3 — Paramétrer ton calendrier comme un trader */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Configurar tu calendario como un trader</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Tienes que dejar de mirar todo el calendario en bloque.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Configuración simple y profesional</span>:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                { bold: "Filtra las divisas", rest: " que operas" },
                { bold: "Mantén siempre el USD activado", rest: "" },
                { bold: "Muestra la vista semanal", rest: " (no solo el día)" },
                { bold: "Mantén los eventos de 3 estrellas", rest: " por defecto" },
                { bold: "Vigila ciertos de 2 estrellas", rest: " en contexto fuerte" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">¿Por qué el USD sigue siendo siempre importante?</span> Porque incluso si operas EUR/USD, XAU/USD, BTC/USD o NASDAQ, el dólar lo influye todo (ver lección Principiante Macro 5).
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              La <span className="font-semibold text-zinc-200">vista semanal</span> es esencial. Te permite ver las zonas de riesgo <span className="font-semibold text-zinc-200">antes de que lleguen</span>, no durante.
            </p>

            {/* Encadré 💰 Réalité du retail */}
            <div className="bg-zinc-800/50 border-l-4 border-amber-400 px-5 py-4 rounded">
              <div className="flex items-center gap-2 mb-2">
                <span>💰</span>
                <span className="text-sm font-bold text-amber-400 tracking-wide">Realidad del retail</span>
              </div>
              <p className="text-base text-zinc-300 leading-relaxed">
                El trader aficionado descubre la news a las 14:30. El trader preparado la ve venir <span className="font-semibold text-zinc-200">desde el domingo por la noche</span>. ¿La diferencia? 5 minutos de prep por semana.
              </p>
            </div>
          </section>

          {/* Bloc 4 — Les clusters de news */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Los clusters de news</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Algunas semanas son peligrosas porque <span className="font-semibold text-zinc-200">varios anuncios grandes caen casi juntos</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Ejemplo típico de cluster</span>:
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                { bold: "Miércoles", rest: ": FOMC" },
                { bold: "Jueves", rest: ": CPI" },
                { bold: "Viernes", rest: ": NFP" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              En este tipo de semana, el mercado puede volverse <span className="font-semibold text-zinc-200">nervioso incluso antes de los anuncios</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">¿Por qué?</span> Porque las instituciones reducen su exposición, ajustan sus posiciones y esperan las cifras. Ves a menudo <span className="font-semibold text-zinc-200">movimientos pre-news</span> desde el martes por la mañana en estas semanas.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Al revés, una semana <span className="font-semibold text-zinc-200">macro calma</span> deja más espacio al análisis técnico puro, es el buen momento para aplicar tus setups habituales sin sorpresas externas.
            </p>
            <div className="bg-zinc-800/30 rounded-xl px-4 py-3 mb-5">
              <p className="text-xs font-semibold text-zinc-400 mb-2">En una semana FOMC + CPI + NFP, estos activos se ven todos impactados:</p>
              <ul className="space-y-1.5">
                {[
                  { bold: "EUR/USD, GBP/USD", rest: ": volatilidad máxima durante los 3 días" },
                  { bold: "XAU/USD", rest: ": muy nervioso (sensible a las tasas y al dólar)" },
                  { bold: "Nasdaq, S&P500", rest: ": gaps posibles en la apertura NY" },
                  { bold: "BTC/USD", rest: ": amplificación del risk-off o risk-on general" },
                ].map((item) => (
                  <li key={item.bold} className="flex items-start gap-2 text-xs text-zinc-400">
                    <div className="w-1 h-1 rounded-full bg-zinc-600 shrink-0 mt-1.5" />
                    <span><span className="font-semibold text-zinc-300">{item.bold}</span>{item.rest}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-zinc-500 mt-2 italic">Un cluster no afecta solo a una divisa. Afecta a todo el mercado al mismo tiempo.</p>
            </div>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Una sola news mueve el mercado. Un cluster cambia toda la semana.
              </p>
            </div>
          </section>

          {/* Bloc 5 — Les chiffres secondaires qui peuvent surprendre */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Las cifras secundarias que pueden sorprender</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Una cifra de 2 estrellas <span className="font-semibold text-zinc-200">no siempre es débil</span>. Se vuelve importante cuando sale <span className="font-semibold text-zinc-200">muy lejos del consenso</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Ejemplo</span>:
            </p>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3 mb-4">
              <p className="text-sm text-zinc-300">ISM Manufacturing esperado: <span className="font-semibold text-zinc-200">50</span></p>
              <p className="text-sm text-zinc-300 mt-1">Resultado: <span className="font-semibold text-zinc-200">45</span></p>
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Interpretación pro:
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                { bold: "Bajo 50 =", rest: " contracción económica" },
                { bold: "Desviación fuerte", rest: " con las expectativas" },
                { bold: "Señal de desaceleración", rest: " económica" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Resultado posible:
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                "Índices bajo presión (Nasdaq, S&P500)",
                "Dólar volátil",
                "Mercado que reevalúa el riesgo de recesión",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              El nivel de impacto depende del <span className="font-semibold text-zinc-200">contexto global</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Una cifra promedio en una semana tranquila puede hacer poco ruido. La <span className="font-semibold text-zinc-200">misma cifra en una semana tensa</span> (cluster de news, contexto macro frágil) puede disparar un movimiento real.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Una cifra no tiene importancia absoluta. Tiene importancia contextual.
              </p>
            </div>
          </section>

          {/* Bloc 6 — Construire ta feuille de route hebdomadaire */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Construir tu hoja de ruta semanal</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Cada <span className="font-semibold text-zinc-200">domingo por la noche</span> o <span className="font-semibold text-zinc-200">lunes por la mañana</span>, preparas tu semana macro.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Método simple</span>:
            </p>
            <div className="space-y-2 mb-5">
              {[
                { n: "1", text: "Lista los 3 a 5 anuncios grandes de la semana" },
                { n: "2", text: "Anota los días y horas exactas" },
                { n: "3", text: "Identifica las divisas implicadas" },
                { n: "4", bold: "Clasifica los días:", rest: " agresivo, neutro, defensivo" },
                { n: "5", text: "Ajusta tus setups en consecuencia" },
              ].map((item) => (
                <div key={item.n} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
                  <span className="text-xs font-bold text-zinc-500 shrink-0 mt-0.5">{item.n}.</span>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {"bold" in item ? (
                      <><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</>
                    ) : item.text}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Ejemplo concreto</span>:
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Si el jueves hay CPI US y el viernes NFP:
            </p>
            <ul className="space-y-1.5 mb-5">
              {[
                { bold: "Lunes/martes", rest: ": trading más normal (la semana empieza calma)" },
                { bold: "Miércoles", rest: ": prudencia antes de cifras (anticipación del mercado)" },
                { bold: "Jueves/viernes", rest: ": tamaño reducido o espera post-news" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                No predices el mercado. Organizas tu riesgo para la semana.
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
              "Un calendario se lee con 4 parámetros: consenso, previo, real y revisiones",
              "Las revisiones pueden cambiar completamente la interpretación de una news",
              "Los clusters de news vuelven toda la semana más volátil (no solo el día D)",
              "Tu hoja de ruta macro debe prepararse antes de operar, no durante",
            ]}
          />

          <LessonExercice
            description="Prepara tu próxima semana como un trader macro pro."
            steps={[
              "Abre tu calendario económico en vista semanal (Investing.com o Forex Factory).",
              "Mantén solo USD + las divisas que operas.",
              "Lista los 3 a 5 eventos más importantes de la semana.",
              "Anota consenso, previo y hora exacta para cada evento.",
              "Clasifica cada jornada: agresiva, neutra o defensiva.",
            ]}
          />
          <p className="text-sm text-zinc-500 leading-relaxed px-1">
            El objetivo: <span className="font-semibold text-zinc-400">dejar de sufrir las news. Verlas venir</span>.
          </p>

          <LessonQuiz
            question="Un NFP sale en 205k mientras el consenso era de 200k. El movimiento parece débil al inicio, pero el dólar sube fuertemente después. ¿Qué explicación es la más probable?"
            options={[
              "El mercado es aleatorio, estos movimientos no se explican",
              "La cifra real es muy superior al consenso",
              "La cifra previa quizá fue revisada fuertemente a la baja",
              "Las news macro no sirven para nada en forex",
            ]}
            correctIndex={2}
            explanation="Una cifra real cercana al consenso no siempre basta para explicar un gran movimiento. Las revisiones pueden modificar toda la lectura de la tendencia del empleo (por ejemplo, una cifra previa revisada de 250k a 170k cambia la percepción del mercado laboral US). La opción A ignora la lógica macro, los movimientos casi siempre tienen una causa identificable. La opción B es falsa aquí: 205k vs 200k no es una desviación grande. La opción D contradice todo el módulo Macro. Es exactamente el escenario del hero de esta lección. Esta lógica de las revisiones aplica a todos los activos ligados al dólar: EUR/USD, XAU/USD, Nasdaq y BTC/USD reaccionan todos a la misma reevaluación."
            answerExplanations={[
              "Falso. El mercado sigue una lógica precisa basada en las expectativas y las revisiones. La reacción no es aleatoria, casi siempre tiene una causa identificable.",
              "Falso. 205k vs 200k es una desviación mínima, insuficiente para provocar un gran movimiento. No es la cifra del día la que explica la reacción.",
              "Correcto. Las revisiones pueden modificar toda la lectura macro. Una cifra previa revisada de 250k a 170k cambia la percepción del mercado laboral US, y el mercado reacciona a esta nueva realidad.",
              "Falso. Las news macro son una de las causas principales de los grandes movimientos en forex. Todo este módulo lo demuestra.",
            ]}
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => { const p = getStoredProgress(); markLessonComplete(p, "macro-intermediaire", "lecon2"); setDone(true); }}
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
                  <p className="text-xs text-zinc-500 mt-0.5">La próxima lección (CPI, PPI e inflación) estará disponible pronto.</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/formations/macro/intermediaire/lecon1"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lección 1. Hawkish vs Dovish
              </Link>
              <span className="text-sm text-zinc-700 cursor-default">
                CPI, PPI e inflación. Próximamente →
              </span>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
