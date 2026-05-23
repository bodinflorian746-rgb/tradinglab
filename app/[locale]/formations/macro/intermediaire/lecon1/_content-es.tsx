"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { HawkishDovishScale } from "@/app/components/charts/HawkishDovishScale";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Hawkish vs Dovish",                          href: "/formations/macro/intermediaire/lecon1", disabled: false },
  { id: "lecon2", title: "Entender el calendario económico",            href: null,                                     disabled: true  },
  { id: "lecon3", title: "CPI, PPI e inflación",                        href: null,                                     disabled: true  },
  { id: "lecon4", title: "El carry trade",                              href: null,                                     disabled: true  },
  { id: "lecon5", title: "Las correlaciones macro",                     href: null,                                     disabled: true  },
  { id: "lecon6", title: "Construir tu sesgo semanal",                  href: null,                                     disabled: true  },
];

export default function ContentEs() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-intermediaire", "lecon1"));
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
          <span className="text-zinc-500">Lección 1</span>
        </nav>

        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-400/10 text-blue-400 border border-blue-400/20">
              Intermedio
            </span>
            <span className="text-zinc-700 text-xs">·</span>
            <span className="text-xs text-zinc-600">18 min</span>
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
            Hawkish vs Dovish — cómo leer el tono de un banco central
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Puedes tener razón sobre las cifras y perder de todos modos. Porque lo que mueve al mercado no es la decisión de la Fed — es el tono con el que Powell la pronuncia.
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

          {/* Bloc 1 */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Hawkish, dovish: ¿qué es este vocabulario de aves?</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Cuando lees noticias financieras, te topas constantemente con estas dos palabras:
            </p>
            <ul className="space-y-2 mb-4 ml-1">
              <li className="flex items-start gap-2.5 text-sm text-zinc-300">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                <span><span className="text-white font-semibold">Hawkish</span> (halcón) = tono DURO. El banco central quiere <span className="font-semibold text-zinc-200">endurecer</span> la política monetaria: subir tasas, retirar liquidez, combatir la inflación.</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-zinc-300">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-1.5" />
                <span><span className="text-white font-semibold">Dovish</span> (paloma) = tono SUAVE. El banco central quiere <span className="font-semibold text-zinc-200">estimular</span> la economía: bajar tasas, inyectar liquidez, apoyar el crecimiento.</span>
              </li>
            </ul>
            <p className="text-sm text-zinc-400 leading-relaxed mb-4">
              Una analogía simple: <span className="text-white font-medium">el halcón aprieta las tuercas, la paloma abre las llaves.</span>
            </p>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
              <p className="text-sm text-zinc-400 leading-relaxed">
                <span className="text-white font-medium">Para recordar:</span> Estos términos describen la <span className="font-semibold text-zinc-200">orientación</span> del discurso de un banquero central, no una decisión en sí. Powell puede tener un discurso hawkish sin subir las tasas. Lagarde puede parecer dovish sin bajarlas. Lo que importa es el tono, no la acción inmediata.
              </p>
            </div>
          </section>

          {/* Bloc 2 */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Por qué esto lo cambia todo en tu trading</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              El mercado no espera las decisiones reales para moverse. Se mueve sobre las <span className="font-semibold text-zinc-200">expectativas</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Cuando Powell dice <span className="italic text-zinc-300">&quot;we remain data-dependent and prepared to hold rates higher for longer if needed&quot;</span>, no decidió nada en concreto. Pero el mercado escucha &quot;Fed más dura de lo previsto&quot; → el dólar sube de inmediato, el EUR/USD cae, el oro baja, los índices US corrigen.
            </p>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3 mb-4">
              <p className="text-sm text-zinc-400 leading-relaxed">
                <span className="text-white font-medium">Para recordar:</span> El tono precede a la acción. Aprender a leer el tono = anticipar el movimiento antes de que salgan las cifras.
              </p>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Por eso exactamente los mejores traders macro leen los <span className="font-semibold text-zinc-300">discursos</span> y las <span className="font-semibold text-zinc-300">minutes</span> (actas de las reuniones de los bancos centrales) — no solo las cifras.
            </p>
          </section>

          {/* Bloc 3 */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Cómo reconocer un tono hawkish vs dovish</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Estas son las <span className="font-semibold text-zinc-200">palabras-señal</span> que vas a encontrar en los comunicados oficiales (la mayoría se publican en inglés — aquí están las traducciones).
            </p>

            <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-3">Vocabulario HAWKISH (tono duro, pro-endurecimiento)</p>
            <ul className="space-y-2 mb-6">
              {[
                { en: "inflation remains elevated", fr: "la inflación sigue elevada" },
                { en: "further tightening may be appropriate", fr: "un nuevo endurecimiento podría ser apropiado" },
                { en: "labor market remains tight", fr: "el mercado laboral sigue tensionado" },
                { en: "premature easing would be a mistake", fr: "un easing prematuro sería un error" },
                { en: "higher for longer", fr: "más altas por más tiempo (las tasas se mantienen elevadas)" },
                { en: "more work to do", fr: "queda trabajo por hacer" },
                { en: "vigilant against persistent inflation", fr: "vigilantes frente a la inflación persistente" },
              ].map((item) => (
                <li key={item.en} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400/60 shrink-0 mt-1.5" />
                  <span><em className="text-zinc-300">&quot;{item.en}&quot;</em> → {item.fr}</span>
                </li>
              ))}
            </ul>

            <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">Vocabulario DOVISH (tono suave, pro-estímulo)</p>
            <ul className="space-y-2 mb-5">
              {[
                { en: "inflation is moderating", fr: "la inflación se modera" },
                { en: "risks are now balanced", fr: "los riesgos están ahora equilibrados" },
                { en: "we can be patient", fr: "podemos ser pacientes" },
                { en: "appropriate to consider easing", fr: "es apropiado considerar un easing" },
                { en: "growth is slowing", fr: "el crecimiento se desacelera" },
                { en: "downside risks have increased", fr: "los riesgos bajistas han aumentado" },
                { en: "policy is now restrictive enough", fr: "la política es ahora suficientemente restrictiva" },
              ].map((item) => (
                <li key={item.en} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400/60 shrink-0 mt-1.5" />
                  <span><em className="text-zinc-300">&quot;{item.en}&quot;</em> → {item.fr}</span>
                </li>
              ))}
            </ul>

            <p className="text-sm text-zinc-400 leading-relaxed">
              No necesitas memorizar todo. <span className="font-semibold text-zinc-300">Solo identifica la intención</span>: ¿el banco central habla de FRENAR la economía (hawkish) o de APOYARLA (dovish)?
            </p>
          </section>

          {/* Bloc 4 */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Impacto concreto en los mercados</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Veamos un ejemplo con cifras para fijar las ideas.
            </p>

            <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-3">Caso hawkish sobre el dólar US — la Fed endurece el tono</p>
            <div className="overflow-hidden rounded-xl border border-zinc-800 mb-2">
              <div className="grid grid-cols-2 border-b border-zinc-800">
                <div className="px-4 py-2 bg-zinc-800/50 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Activo</div>
                <div className="px-4 py-2 bg-zinc-800/50 text-xs font-semibold text-zinc-500 uppercase tracking-wider border-l border-zinc-800">Reacción típica</div>
              </div>
              <div className="divide-y divide-zinc-800/60">
                {[
                  { asset: "EUR/USD", reaction: "Cae — 100 a 300 pips en la sesión" },
                  { asset: "DXY", reaction: "Sube (mide la fortaleza del dólar)" },
                  { asset: "XAU/USD", reaction: "Cae (yields reales altos penalizan al oro)" },
                  { asset: "Nasdaq", reaction: "Cae (tasas altas penalizan a la tech)" },
                  { asset: "BTC/USD", reaction: "Cae (activo de riesgo huye en entorno hawkish)" },
                ].map((row) => (
                  <div key={row.asset} className="grid grid-cols-2">
                    <div className="px-4 py-2.5 text-sm font-semibold text-zinc-200">{row.asset}</div>
                    <div className="px-4 py-2.5 text-sm text-zinc-400 border-l border-zinc-800/60">{row.reaction}</div>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-zinc-500 italic mb-5">Una sola decisión hawkish dispara TODO eso al mismo tiempo.</p>

            <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">Caso dovish sobre el dólar US — la Fed suaviza el tono</p>
            <div className="overflow-hidden rounded-xl border border-zinc-800 mb-2">
              <div className="grid grid-cols-2 border-b border-zinc-800">
                <div className="px-4 py-2 bg-zinc-800/50 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Activo</div>
                <div className="px-4 py-2 bg-zinc-800/50 text-xs font-semibold text-zinc-500 uppercase tracking-wider border-l border-zinc-800">Reacción típica</div>
              </div>
              <div className="divide-y divide-zinc-800/60">
                {[
                  { asset: "EUR/USD", reaction: "Sube (dólar más débil)" },
                  { asset: "DXY", reaction: "Cae" },
                  { asset: "XAU/USD", reaction: "Sube (al oro le gustan las tasas bajas)" },
                  { asset: "Nasdaq", reaction: "Sube (a la tech le gustan las tasas bajas)" },
                  { asset: "BTC/USD", reaction: "Sube (risk-on, liquidez más abundante)" },
                ].map((row) => (
                  <div key={row.asset} className="grid grid-cols-2">
                    <div className="px-4 py-2.5 text-sm font-semibold text-zinc-200">{row.asset}</div>
                    <div className="px-4 py-2.5 text-sm text-zinc-400 border-l border-zinc-800/60">{row.reaction}</div>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-zinc-500 italic mb-5">El tono dovish es uno de los motores más potentes de los rallies cripto y tech.</p>

            <div className="border border-zinc-800 rounded-xl overflow-hidden mb-5">
              <HawkishDovishScale locale="es" />
            </div>

            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
              <p className="text-sm text-zinc-400 leading-relaxed">
                <span className="text-white font-medium">Para recordar:</span> Lógica clave: un dólar fuerte viene siempre de una Fed más hawkish que los otros bancos centrales. Un dólar débil, lo contrario. La fortaleza de una divisa siempre es <span className="font-semibold text-zinc-300">relativa</span> al tono de SU banco central comparado con los demás.
              </p>
            </div>
          </section>

          {/* Bloc 5 — Erreur classique */}
          <section className="border border-red-500/20 bg-red-500/5 rounded-2xl p-6">
            <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">Error clásico</p>
            <p className="text-sm font-semibold text-white mb-3">La trampa del &apos;hawkish but less than expected&apos;</p>
            <p className="text-sm font-semibold text-zinc-300 mb-3">Operas sobre el tono sin mirar las expectativas</p>
            <p className="text-sm text-zinc-300 leading-relaxed mb-3">
              Esta es LA trampa que arruina a los traders principiantes en macro.
            </p>
            <p className="text-sm text-zinc-300 leading-relaxed mb-3">
              <span className="font-semibold text-zinc-200">Ves a Powell subir las tasas 25bps y piensas</span>: &quot;Esto es hawkish, el dólar va a subir, voy short EUR/USD.&quot;
            </p>
            <p className="text-sm text-zinc-300 leading-relaxed mb-3">
              Y ahí, el EUR/USD <span className="font-semibold text-zinc-200">sube</span> en lugar de bajar. Te saca con stop loss.
            </p>
            <p className="text-sm text-zinc-300 leading-relaxed mb-4">
              ¿Por qué? Porque el mercado había anticipado una subida de <span className="font-semibold text-zinc-200">50bps</span>. Entonces 25bps es <span className="font-semibold text-zinc-200">menos hawkish de lo previsto</span>. Y &quot;menos hawkish de lo previsto&quot; = <span className="font-semibold text-zinc-200">dovish surprise</span> para el mercado. El dólar cae porque las expectativas eran demasiado optimistas.
            </p>
            <div className="bg-zinc-900/40 border border-red-500/15 rounded-xl px-4 py-3 mb-4">
              <p className="text-sm text-zinc-400 italic leading-relaxed">
                En las news macro, el mercado no reacciona a la decisión en sí, reacciona a la diferencia entre la decisión y lo que se había anticipado.
              </p>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Antes de cada reunión FOMC, mira lo que está <span className="font-semibold text-zinc-300">priceado</span> por el mercado (la FedWatch Tool de la CME da estas probabilidades). Si la Fed publica EXACTAMENTE lo que se esperaba, poco movimiento. Si publica algo más duro o más suave, movimiento violento en la dirección de la sorpresa.
            </p>
          </section>

          {/* Bloc 6 */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Cómo operar con esto: ajustar tu sesgo semanal</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              No vas a operar la news misma en el momento en que sale (ver lección FOMC para la técnica del timing exacto). Pero vas a usar el tono para <span className="font-semibold text-zinc-200">ajustar tu tesis macro de la semana</span>.
            </p>

            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Método simple en 3 pasos</p>
            <div className="space-y-3 mb-6">
              {[
                {
                  n: "1",
                  text: (
                    <><span className="font-semibold text-zinc-200">Después de cada reunión de banco central, identifica el tono</span>: hawkish, dovish o neutro. Lee el comunicado + 2-3 artículos de Reuters/Bloomberg que resuman la conferencia de prensa.</>
                  ),
                },
                {
                  n: "2",
                  text: (
                    <><span className="font-semibold text-zinc-200">Compara con el tono previo</span>: ¿el banco se vuelve más hawkish o más dovish que la última vez? Es la <span className="font-semibold text-zinc-200">inflexión</span> la que más importa, no el tono absoluto.</>
                  ),
                },
                {
                  n: "3",
                  text: (
                    <><span className="font-semibold text-zinc-200">Define tu sesgo direccional para la semana</span> en la divisa correspondiente. Ejemplo: &quot;ECB más hawkish de lo previsto → sesgo long EUR para los próximos 5 días → busco setups long EUR/USD, EUR/GBP, EUR/JPY, y evito los setups short EUR.&quot;</>
                  ),
                },
              ].map((item) => (
                <div key={item.n} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
                  <span className="text-xs font-bold text-zinc-500 shrink-0 mt-0.5">{item.n}.</span>
                  <p className="text-sm text-zinc-300 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2 mb-4">
              {[
                "Lee el tono después de cada reunión",
                "Compara con la reunión previa",
                "Define 1 sesgo por divisa mayor",
                "Busca tus setups en el sentido del sesgo",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl px-4 py-3">
                  <span className="text-emerald-500 font-bold text-base shrink-0 mt-0.5">✓</span>
                  <p className="text-sm text-zinc-300 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {[
                "Operar la news en vivo sin experiencia",
                "Ignorar las expectativas del mercado",
                "Mantener un sesgo de hace 2 meses",
                "Confundir decisión con tono",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 bg-red-500/5 border border-red-500/10 rounded-xl px-4 py-3">
                  <span className="text-red-500 font-bold text-base shrink-0 mt-0.5">✗</span>
                  <p className="text-sm text-zinc-300 leading-relaxed">{item}</p>
                </div>
              ))}
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
              "Hawkish = halcón = tono duro (el banco central quiere frenar). Dovish = paloma = tono suave (el banco central quiere apoyar).",
              "El tono precede a la acción: aprender a leer el tono es anticipar el movimiento antes de los cambios reales de tasas.",
              "El mercado reacciona a la diferencia entre decisión y expectativa, no a la decisión en sí.",
              "Usa el tono para definir tu sesgo direccional semanal en cada mercado relevante: forex, oro, índices, cripto.",
            ]}
          />

          <LessonExercice
            description="Elige una reunión reciente de la Fed, del ECB o del BoE."
            steps={[
              "Ve al sitio oficial del banco central (federalreserve.gov, ecb.europa.eu, bankofengland.co.uk).",
              "Encuentra el comunicado oficial (statement) de la última reunión.",
              "Léelo buscando las palabras-señal hawkish o dovish (ver bloque 3).",
              "Anota tu veredicto: hawkish, dovish o neutro. Justifica en 2 frases.",
              "Compara con un artículo de Reuters o Bloomberg que analice la misma reunión: ¿tu interpretación coincide con la de los analistas?",
              "Mira el gráfico del par principal (EUR/USD para el ECB o la Fed, GBP/USD para el BoE) en las 24h posteriores: ¿el movimiento coincide con tu veredicto?",
            ]}
          />
          <p className="text-sm text-zinc-500 leading-relaxed px-1">
            El objetivo no es acertar a la primera. Es entrenarte a leer el tono como lo hace un trader macro cada semana.
          </p>

          <LessonQuiz
            question="La Fed sube sus tasas 25bps. Lees el comunicado y el tono es globalmente hawkish. Sin embargo, el dólar CAE después del anuncio. ¿Cuál es la explicación más probable?"
            options={[
              "El mercado no siempre sigue la lógica fundamental, es aleatorio",
              "El mercado había anticipado una subida mayor (50bps) o un tono aún más duro — es una \"dovish surprise\"",
              "El dólar siempre cae en los anuncios de la Fed, sin importar el tono",
              "Powell cometió un error de comunicación",
            ]}
            correctIndex={1}
            explanation="El mercado no reacciona a la decisión en absoluto, sino a la diferencia entre la decisión y las expectativas. Si la Fed sube 25bps mientras el mercado priceaba 50bps, eso equivale a una señal 'menos hawkish de lo previsto' — por lo tanto dovish por contraste. Las opciones A y C son falsas: el mercado sigue una lógica precisa, y el sentido de la reacción siempre depende de las expectativas. La opción D desvía el tema: Powell no comete errores de comunicación, calibra cada palabra. Esta lógica de expectativas vale para todos los activos ligados al dólar: EUR/USD, XAU/USD, Nasdaq y BTC/USD reaccionan todos a la diferencia entre expectativas y realidad."
            answerExplanations={[
              "Falso. El mercado sigue una lógica muy precisa basada en las expectativas. La reacción no es aleatoria — mide la diferencia entre lo que se esperaba y lo que se anunció.",
              "Correcto. El mercado había priceado 50bps. Una subida de 25bps es entonces 'menos hawkish de lo previsto' — es una dovish surprise. El dólar cae porque las expectativas no se confirmaron.",
              "Falso. El dólar puede subir o caer en un anuncio Fed según la dirección de la sorpresa. No hay regla mecánica independiente del tono y de las expectativas.",
              "Falso. Powell calibra cada palabra con precisión. La reacción del mercado refleja la diferencia entre expectativas y realidad, no un error de comunicación.",
            ]}
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => { const p = getStoredProgress(); markLessonComplete(p, "macro-intermediaire", "lecon1"); setDone(true); }}
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
                  <p className="text-xs text-zinc-500 mt-0.5">La próxima lección (Entender el calendario económico) estará disponible pronto.</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/formations/macro/intermediaire"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Volver al módulo
              </Link>
              <span className="text-sm text-zinc-700 cursor-default">
                Entender el calendario económico — Próximamente →
              </span>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
