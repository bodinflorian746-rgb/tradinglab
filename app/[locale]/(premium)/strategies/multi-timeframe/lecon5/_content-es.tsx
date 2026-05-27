"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { ProcessFunnelDiagram } from "@/app/components/charts/ProcessFunnelDiagram";
import { DailyContextDiagram } from "@/app/components/charts/DailyContextDiagram";
import { H1ZonePreparationDiagram } from "@/app/components/charts/H1ZonePreparationDiagram";
import { M15ValidationDiagram } from "@/app/components/charts/M15ValidationDiagram";

const LESSONS = [
  { id: "lecon1", title: "Por qué analizar en multi-timeframe", disabled: false },
  { id: "lecon2", title: "El timeframe superior: el sesgo", disabled: false },
  { id: "lecon3", title: "El timeframe intermedio: la zona", disabled: false },
  { id: "lecon4", title: "El timeframe de ejecución: la entrada", disabled: false },
  { id: "lecon5", title: "El proceso completo", disabled: false },
];

export default function ContentEs() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "multi-timeframe", "lecon5"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Estrategias</Link>
          <span>/</span>
          <Link href="/strategies/multi-timeframe" className="hover:text-zinc-400 transition-colors">Multi-timeframe Process</Link>
          <span>/</span>
          <span className="text-zinc-500">Lección 5</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Intermedio
            </span>
            <span className="text-zinc-700 text-xs">·</span>
            <span className="text-xs text-zinc-600">20 min</span>
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
            El proceso multi-timeframe completo: del Daily a la ejecución
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Los traders perdedores buscan una entrada. Los traders estructurados construyen un escenario antes incluso de pensar en hacer clic.
            </p>
          </div>

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

          <div className="mt-6 flex items-center gap-2 flex-wrap">
            {LESSONS.map((lesson) => {
              const isCurrent = lesson.id === "lecon5";
              return (
                <div key={lesson.id}>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                    isCurrent
                      ? "bg-zinc-800 border-zinc-600 text-white"
                      : lesson.disabled
                      ? "border-zinc-800/50 text-zinc-700"
                      : "border-zinc-800 text-zinc-500"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? "bg-white" : lesson.disabled ? "bg-zinc-700" : "bg-zinc-600"}`} />
                    {isCurrent ? (
                      <>
                        <span className="md:hidden">Lección {lesson.id.replace("lecon", "")}</span>
                        <span className="hidden md:inline">{lesson.title}</span>
                      </>
                    ) : (
                      lesson.title
                    )}
                  </span>
                </div>
              );
            })}
            <span className="ml-auto text-xs text-zinc-600">5 / 5 lecciones</span>
          </div>
        </header>

        <div className="space-y-8">

          {/* Bloc 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-blue-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « Un trade ganador no es una buena entrada. Es un escenario que se alineó de arriba hacia abajo. »
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerrequisitos</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Introducción multi-timeframe → ver Lección 1</li>
              <li>- Dirección dominante HTF → ver Lección 2</li>
              <li>- Zonas de interés H1-H4 → ver Lección 3</li>
              <li>- Confirmación LTF → ver Lección 4</li>
            </ul>
          </div>

          {/* Bloc 3 — LE PROCESS COMPLET */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">El proceso completo de un vistazo</h2>

            <div className="my-8">
              <ProcessFunnelDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              El proceso multi-timeframe funciona como un embudo: cada nivel filtra al siguiente y reduce las posibilidades. Daily / H4 → dar la dirección; H1 → identificar la zona de interés; M15 / M30 → esperar la reacción y confirmar. El trade solo llega al final, es la culminación de una cadena lógica, no una señal aislada que se atrapa al vuelo.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- El análisis baja siempre del HTF al LTF, nunca al revés</li>
              <li>- Cada nivel responde a una pregunta precisa: hacia dónde va el mercado, dónde puede reaccionar, cuándo entrar</li>
              <li>- Un trade alineado en los tres niveles es raro, pero precisamente eso lo convierte en un setup de alta probabilidad</li>
              <li>- Saltar un nivel = improvisar; el proceso protege contra la impulsividad</li>
            </ul>
          </section>

          {/* Bloc 4 — LE DAILY DONNE LA DIRECTION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">El Daily da la dirección</h2>

            <div className="my-8">
              <DailyContextDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              El Daily (o H4) es el nivel del contexto. Responde a una sola pregunta: ¿en qué sentido evoluciona el mercado durante varios días o semanas? La lectura se hace vía la estructura: Lower Highs / Lower Lows para una tendencia bajista, Higher Highs / Higher Lows para una alcista. Las impulsiones son fuertes y extendidas en el sentido dominante, las correcciones son blandas y limitadas en el sentido opuesto. Este sesgo condiciona todo lo que sigue, solo se tomarán ventas en un contexto HTF bajista, compras solo en un contexto HTF alcista.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Ejemplo concreto</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD: en Daily, tres LH consecutivos (1.1860, 1.1830, 1.1780) debajo de la resistencia 1.1860, con impulsiones bajistas claras entre cada corrección. El sesgo es claramente vendedor, toda idea de compra queda descartada de entrada. Se buscarán shorts al regreso del precio a una zona superior.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- El HTF (Daily / H4) impone la dirección de los trades posibles</li>
              <li>- Estructura LH/LL = venta únicamente; HH/HL = compra únicamente</li>
              <li>- Mientras la estructura HTF no esté rota, el sesgo sigue siendo el mismo</li>
              <li>- Operar contra el sesgo HTF = operar a contracorriente sin necesidad</li>
            </ul>
          </section>

          {/* Bloc 5 — LE H1 PRÉPARE LA ZONE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">El H1 prepara la zona</h2>

            <div className="my-8">
              <H1ZonePreparationDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Una vez establecida la dirección, el H1 localiza la zona precisa donde el escenario puede activarse. Estas zonas se trazan con antelación, antiguos soportes vueltos resistencias, FVG no mitigados, Order Blocks bearish, confluencias. El precio las aborda en general desacelerando: las velas se vuelven más cortas, el impulso disminuye. Esta zona queda inerte mientras el precio no la haya testeado realmente, no dispara ningún trade por sí misma, prepara el terreno.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Ejemplo concreto</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD: en 1.1750-1.1760, un antiguo soporte roto se superpone a un FVG bearish no mitigado dejado por la última impulsión bajista. La zona se traza en el H1, en el sentido del sesgo Daily. El precio sube progresivamente con velas cada vez más cortas al acercarse a 1.1760, el terreno está listo, se espera la reacción.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Una zona H1 se traza con antelación, nunca a posteriori</li>
              <li>- Mientras más confluente sea la zona (FVG + antiguo soporte + Order Block) más fuerte es</li>
              <li>- La zona no dispara nada, prepara la hipótesis de trade</li>
              <li>- La desaceleración del precio al acercarse es un signo de interés, no una señal de entrada</li>
            </ul>
          </section>

          {/* Bloc 6 — LE M15 VALIDE L'EXÉCUTION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">El M15 valida la ejecución</h2>

            <div className="my-8">
              <M15ValidationDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              El M15 es el nivel del timing. Cuando el precio entra en la zona H1, se baja al LTF para observar la reacción: mechas de rechazo sucesivas, formación de un máximo local, luego breakout estructural de un mínimo reciente a favor del sesgo. Son estas señales concretas las que validan la entrada, no la simple presencia del precio en la zona. La ejecución se hace en el breakout, el SL queda calado ajustado justo por encima del último máximo de rechazo.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Ejemplo concreto</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD: el precio llega a la zona 1.1750-1.1760 e imprime tres mechas altas consecutivas entre 1.1758 y 1.1762, sin cerrar por encima. El último mínimo local entre las velas de rechazo está en 1.1750. Tres velas M15 bajistas se encadenan y rompen ese mínimo francamente hacia 1.1745. La reacción es nítida, el breakout confirma, entrada short en 1.1758 en el breakout, SL en 1.1772 (justo por encima del último máximo de rechazo).
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- El M15 no sirve para analizar el mercado, sirve para confirmar una hipótesis construida más arriba</li>
              <li>- Mecha de rechazo + breakout de mínimo local = combo clásico de validación</li>
              <li>- El SL ajustado exige una estructura local clara (máximo de rechazo)</li>
              <li>- Ninguna reacción = ninguna entrada, la zona falla, se espera la siguiente</li>
            </ul>
          </section>

          {/* Bloc 7 — PLAN D'APPLICATION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan de aplicación: un caso EUR/USD completo</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Aquí tienes un trade short EUR/USD desarrollado del Daily a la ejecución, paso a paso. Cada nivel cumple su rol distinto y conduce naturalmente al siguiente.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Paso 1. Daily: dirección</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observación: estructura LH/LL clara desde hace tres semanas, resistencia Daily en 1.1860</li>
                <li>- Conclusión: sesgo bajista confirmado, únicamente shorts a privilegiar</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Paso 2. H1: zona</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observación: zona confluente 1.1750-1.1760 (antiguo soporte roto + FVG bearish no mitigado)</li>
                <li>- Conclusión: zona trazada con antelación, lista para recibir el precio; escenario short preparado al regreso</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Paso 3. M15: confirmación</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observación: precio en la zona, tres mechas altas consecutivas, breakout del mínimo local en 1.1748</li>
                <li>- Conclusión: la reacción valida la entrada, ejecución autorizada</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Paso 4. Ejecución</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Entrada short: 1.1758</li>
                <li>- Stop loss: 1.1772 (justo por encima del último máximo de rechazo), o sea 14 pts de risk</li>
                <li>- Take profit: 1.1695 (al nivel del último LL Daily), o sea 63 pts de ganancia potencial</li>
                <li>- R/R ≈ 1 : 4,5, setup de alta probabilidad porque está alineado Daily + H1 + M15</li>
              </ul>

              <div className="border-t border-zinc-800/60 pt-3 mt-3">
                <p className="text-sm text-zinc-300 italic text-center">
                  Daily = dirección · H1 = zona · M15 = timing · Ejecución = culminación, no punto de partida
                </p>
              </div>
            </div>
          </section>

          {/* Bloc 8 — LES ERREURS QUI DÉTRUISENT LE PROCESS */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Los errores que destruyen el proceso</h2>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              El proceso es potente mientras se respete el orden. En el momento en que se salta un nivel, el escenario pierde toda su lógica, se recae en el trading impulsivo. Aquí tienes los cuatro desvíos típicos.
            </p>

            <div className="grid gap-3 my-6">
              <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-950/60">
                <p className="text-white font-semibold text-sm mb-1.5">1. Empezar directamente por M15</p>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Localizar un setup en M15 y luego buscar justificarlo en los TF superiores es invertir el proceso. Se acaba validando mentalmente un trade que ya se decidió tomar. El HTF debe siempre venir primero.
                </p>
              </div>

              <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-950/60">
                <p className="text-white font-semibold text-sm mb-1.5">2. Saltar la zona H1</p>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Tener un sesgo Daily y entrar directamente en una señal M15, sin zona H1 trazada con antelación, es operar señales aisladas. La zona da el contexto de la entrada, sin ella, el M15 produce ruido en permanencia.
                </p>
              </div>

              <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-950/60">
                <p className="text-white font-semibold text-sm mb-1.5">3. Entrar sin reacción M15</p>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  El precio toca la zona H1, se entra por anticipación porque « todo lo demás está alineado ». Es exactamente ahí donde la zona falla con más frecuencia. Sin señal LTF clara, la entrada no está validada, se espera o se pasa.
                </p>
              </div>

              <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-950/60">
                <p className="text-white font-semibold text-sm mb-1.5">4. Operar contra el sesgo HTF según el último movimiento M15</p>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Sesgo Daily bajista, pero una « bonita » zona de soporte H1 y un último movimiento M15 alcista invitan a un long. Operar contratendencia con base en un movimiento LTF reciente, sin razón estructural HTF (CHoCH, giro mayor), equivale a apostar al ruido. El sesgo HTF sigue siendo prioritario mientras no esté roto.
                </p>
              </div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "El proceso baja siempre del HTF al LTF, nunca al revés.",
              "Cada nivel tiene un rol distinto: Daily = dirección, H1 = zona, M15 = timing.",
              "El M15 valida la ejecución, confirma la reacción, no la predice.",
              "Saltar un nivel = recaer en el trading impulsivo: el proceso protege contra la improvisación.",
            ]}
          />

          <LessonExercice
            description="En TradingView, recorre un proceso multi-timeframe completo sobre el par de tu elección, del Daily al M15."
            steps={[
              "Daily: identifica la estructura (LH/LL o HH/HL) y concluye un sesgo direccional claro. Si la estructura es ambigua, cambia de par, sin un sesgo HTF nítido, el proceso no arranca.",
              "H1: traza con antelación la zona de interés más confluente en el sentido del sesgo (antiguo soporte/resistencia, FVG, Order Block). Anota los niveles exactos arriba y abajo de la zona.",
              "M15: espera a que el precio entre en la zona, luego observa la reacción. Si aparece una mecha de rechazo seguida de un breakout estructural, anota la entrada, el SL ajustado y el TP buscado. Si no pasa nada, no fuerces, anota simplemente que la zona falló.",
            ]}
          />

          <LessonQuiz
            question="Localizas una señal M15 nítida (rechazo + breakout) en EUR/USD, pero sin haber trazado una zona H1 antes y sin haber verificado el sesgo Daily. ¿Qué haces?"
            options={[
              "Bajas a M5 para confirmar con más finura antes de entrar",
              "Entras con un tamaño reducido para limitar el risk",
              "Tomas el otro lado, asumiendo que la señal anuncia un falso movimiento",
              "No entras: una señal M15 fuera de proceso no es un setup válido",
            ]}
            correctIndex={3}
            explanation="Una señal LTF aislada, sin zona H1 preparada y sin sesgo Daily alineado, no es un setup multi-timeframe, es solo ruido que se notó al vuelo. El proceso exige que los tres niveles sean coherentes ANTES de la señal de ejecución. Operar una señal M15 fuera de contexto es exactamente aquello contra lo que el proceso fue diseñado: la impulsividad."
            answerExplanations={[
              "Falso. Bajar aún más (M5) no añade el contexto HTF que falta. Afinar una señal aislada no la transforma en setup, solo aumenta la precisión de una decisión mal encuadrada.",
              "Falso. Reducir el tamaño no corrige el problema de fondo: la ausencia de contexto HTF. No se reduce un mal setup arriesgando menos, se elimina.",
              "Falso. Tomar el otro lado con base en una sola señal LTF, sin sesgo estructural ni zona, es operar el ruido en la otra dirección, exactamente el mismo problema.",
              "Correcto. El proceso exige la alineación Daily + H1 + M15. Una señal M15 fuera de proceso es por definición una señal aislada, localizada sin preparación. La disciplina es no operar fuera de proceso, la paciencia permite esperar un setup realmente construido.",
            ]}
          />

          <LessonQuiz
            question="Tienes un sesgo Daily bajista y una zona H1 en 1.1750-1.1760. El precio entra en la zona, pero en M15, ninguna mecha de rechazo, ningún breakout de mínimo local, solo una consolidación lateral. ¿Qué haces?"
            options={[
              "Entras: la zona H1 es confluente, la consolidación terminará por romper a la baja",
              "Entras en medio de la zona apostando por la media de fluctuación",
              "No entras mientras el M15 no confirme la reacción",
              "Colocas una orden limitada por encima de la zona y dejas que actúe",
            ]}
            correctIndex={2}
            explanation="Sin confirmación M15, el proceso no está completo, sin importar la calidad del Daily y de la zona H1. La consolidación lateral en la zona no es ni un rechazo ni un breakout; no valida nada. El rol del M15 es precisamente filtrar este tipo de zona que « habría podido » funcionar pero no muestra ninguna señal concreta. Paciencia."
            answerExplanations={[
              "Falso. « Terminará por romper » es una predicción, no una observación. El proceso se construye sobre señales concretas, no sobre proyecciones.",
              "Falso. Entrar en medio de la zona sin señal LTF es una apuesta a la media, exactamente lo contrario de un setup confirmado. Es lo que se evita.",
              "Correcto. El M15 debe validar la reacción (mecha de rechazo + breakout estructural). Sin estas señales, el nivel de ejecución no se franquea, no hay entrada. Esta disciplina protege contra las zonas que parecen fuertes pero no reaccionan.",
              "Falso. Una orden limitada pasiva transforma un setup no confirmado en automatismo, es el peor compromiso: se asume el risk sin haber validado el disparador.",
            ]}
          />

          <LessonQuiz
            question="¿Cuál es el rol exacto del Daily en el proceso multi-timeframe?"
            options={[
              "Dar el punto de entrada preciso gracias a su legibilidad",
              "Afinar el timing al nivel M1 y completar la señal de ejecución",
              "Definir la dirección dominante y el sentido de los trades autorizados",
              "Proporcionar el SL gracias a estructuras amplias y estables",
            ]}
            correctIndex={2}
            explanation="El Daily (o H4) es el nivel del contexto. Su rol único es definir la dirección dominante vía la estructura (LH/LL o HH/HL). Esta dirección condiciona luego qué tipos de trades están autorizados en los niveles inferiores. El Daily no da ni punto de entrada preciso (demasiado amplio), ni la zona de ejecución (eso es el H1), ni el SL ajustado (eso es el M15)."
            answerExplanations={[
              "Falso. El Daily es demasiado amplio para proporcionar un punto de entrada preciso, una vela Daily representa una amplitud de varias decenas de pts. La entrada se prepara en H1 y se dispara en M15.",
              "Falso. El Daily no tiene nada que ver con el timing fino. Afinar en M1 sería competencia del LTF, y el Daily está precisamente en el extremo opuesto a ese nivel, establece el contexto general, no el disparador.",
              "Correcto. El Daily da el contexto general: estructura LH/LL = ventas únicamente, estructura HH/HL = compras únicamente. Es esta dirección la que condiciona el conjunto del proceso aguas abajo.",
              "Falso. El SL ajustado se construye sobre la estructura local del M15 (máximo o mínimo de rechazo). Un SL calado en una estructura Daily sería demasiado amplio y mataría el R/R.",
            ]}
          />

        </div>

        {/* Footer */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "multi-timeframe", "lecon5");
                  setDone(true);
                }}
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
                  <p className="text-sm font-semibold text-emerald-400">Módulo Multi-timeframe terminado</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Has completado las 5 lecciones del módulo Multi-timeframe Process.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between gap-4">
              <Link href="/strategies/multi-timeframe/lecon4" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lección anterior
              </Link>
              <Link href="/strategies/multi-timeframe" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                Volver al módulo
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M6 4l4 3-4 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
