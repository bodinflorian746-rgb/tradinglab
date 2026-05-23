import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { KillzonesDiagram } from "@/app/components/charts/KillzonesDiagram";

export default function ContentEs() {
  return (
    <LessonPage
      formationId="avance"
      lessonId="lecon4"
      title="Killzones — las sesiones que cuentan"
      subtitle="El mercado no se mueve de manera uniforme. Existen ventanas horarias precisas donde la actividad institucional es máxima — ahí es donde se forman los mejores setups."
      duration="20 min"
      lessonNumber={4}
      prev={{ href: "/formations/avance/lecon3", label: "Lección 3 — Order Blocks" }}
      next={{ href: "/formations/avance/lecon5", label: "Lección 5 — OTE" }}
    >

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Por qué el timing es crítico</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          La mayoría de los traders analizan <em>qué</em> tradear, pero ignoran <em>cuándo</em> tradear. Sin embargo, las instituciones operan según horarios precisos ligados a las aperturas de las grandes plazas financieras. Fuera de esas ventanas, el mercado está dominado por los traders retail — los movimientos son menos confiables, más aleatorios.
        </p>
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
          <p className="text-sm text-zinc-400 leading-relaxed">
            <span className="text-white font-medium">Killzone:</span> ventana horaria donde la actividad institucional está concentrada. Los precios se mueven con más fuerza, los niveles son más respetados y las señales falsas son menos frecuentes.
          </p>
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Las 4 Killzones principales</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Estos horarios son en hora de París (CET/CEST). Adáptalos según el horario de verano o invierno y tu zona horaria local.
        </p>
        <div className="space-y-3">
          {[
            {
              name: "Asian Killzone",
              hours: "01h00 – 04h00",
              color: "bg-blue-500/5 border-blue-500/15 text-blue-400",
              detail: "Sesión asiática (Tokio). Volumen bajo, el mercado suele acumular. Los niveles formados aquí sirven de referencia para las sesiones europea y americana. Útil para identificar manipulaciones nocturnas (NY Midnight Open).",
            },
            {
              name: "London Killzone",
              hours: "07h00 – 10h00",
              color: "bg-emerald-500/5 border-emerald-500/15 text-emerald-400",
              detail: "Apertura de Londres — una de las ventanas más potentes. Las instituciones europeas entran al mercado. Es común ver un sweep de liquidity seguido de un movimiento direccional fuerte. Aquí se forman los highs o lows del día.",
            },
            {
              name: "New York Killzone",
              hours: "13h00 – 16h00",
              color: "bg-emerald-500/5 border-emerald-500/15 text-emerald-400",
              detail: "Apertura de Nueva York — la más volátil. Solapamiento con Londres durante 1 a 2 horas: liquidity máxima. Los anuncios económicos mayores caen a las 13h30 o 15h00. Los movimientos aquí son rápidos y potentes.",
            },
            {
              name: "London Close",
              hours: "16h00 – 17h00",
              color: "bg-blue-500/5 border-blue-500/15 text-blue-400",
              detail: "Cierre de Londres. Las instituciones europeas liquidan o ajustan sus posiciones. Es común ver un retroceso o un movimiento de pullback. Útil para los exits y las tomas de profit parciales.",
            },
          ].map((kz, i) => (
            <div key={i} className={`rounded-xl p-4 border ${kz.color}`}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold">{kz.name}</p>
                <span className="text-xs font-mono text-zinc-400">{kz.hours}</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">{kz.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
        <KillzonesDiagram locale="es" />
      </div>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Cómo usar las Killzones</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Las Killzones estructuran tu día de trading. Te dicen cuándo estar frente a la pantalla — y sobre todo cuándo no tradear.
        </p>
        <div className="space-y-2.5">
          {[
            {
              label: "Análisis antes de la Killzone",
              detail: "Identifica tus zonas clave (OB, FVG, liquidity) ANTES de la apertura. Entra en la Killzone con un plan ya definido.",
            },
            {
              label: "Observa los primeros 15 minutos",
              detail: "La primera vela de la sesión suele dar la orientación. Un sweep de liquidity seguido de un retroceso en los primeros 15 min es una señal clásica.",
            },
            {
              label: "No entres a media Killzone",
              detail: "El mejor momento de entrada está cerca del inicio de la Killzone. En pleno medio, te arriesgas a entrar a contratiempo.",
            },
            {
              label: "Evita las horas muertas",
              detail: "Entre las 10h y las 13h (después de Londres y antes de NY), la liquidity cae. Las señales falsas son mucho más frecuentes.",
            },
          ].map((r, i) => (
            <div key={i} className="flex items-start gap-3 bg-zinc-800/40 rounded-xl px-4 py-3">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-emerald-400 shrink-0 mt-0.5">
                <path d="M2 7l3.5 3.5 6.5-6.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <p className="text-sm font-medium text-white">{r.label}</p>
                <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{r.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Revisión</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <LessonKeyPoints
        points={[
          "Las Killzones son las ventanas horarias de actividad institucional máxima.",
          "London Killzone (07h–10h) y NY Killzone (13h–16h) son las más importantes para el Forex.",
          "Analiza y planifica ANTES de la apertura — entra en la Killzone con un plan, no con preguntas.",
          "Las horas muertas (10h–13h) son traicioneras: liquidity baja, movimientos aleatorios.",
          "La Asian Session (01h–04h) suele formar los niveles que Londres y NY vienen a buscar.",
        ]}
      />

      <LessonExercice
        description="Observa un día completo de trading en tiempo real concentrándote en las Killzones."
        steps={[
          "En TradingView, abre EUR/USD en M15. Añade líneas verticales a las 07h00 y 10h00 (London KZ) y a las 13h00 y 16h00 (NY KZ).",
          "Identifica los niveles de liquidity de la noche anterior (EQH, EQL, OB). Anótalos en el gráfico.",
          "Al abrir la London KZ (07h00), observa: ¿hay un sweep de algún nivel nocturno? ¿Seguido de un retroceso?",
          "Repite a las 13h00 con la NY KZ. Anota la diferencia de volatilidad entre las Killzones y las horas muertas.",
        ]}
      />

      <LessonQuiz
        question="Quieres tradear EUR/USD. Son las 11h30 (hora de París). ¿Qué haces?"
        options={[
          "Tradeas normalmente — el mercado sigue abierto y activo",
          "Esperas la NY Killzone (13h00) — la liquidity actual es demasiado baja para setups confiables",
          "Bajas a M5 para captar los micromovimientos de esta hora muerta",
          "Tradeas en breakout de range — las horas muertas son ideales para los breakouts",
        ]}
        correctIndex={1}
        explanation="11h30 está en plena hora muerta — tras el cierre de la London Killzone y antes de la apertura de Nueva York. La liquidity institucional es mínima, los movimientos son aleatorios y las señales falsas abundan. La decisión disciplinada es esperar la NY Killzone a las 13h00."
        answerExplanations={[
          "Falso. El mercado está abierto, pero no es suficiente para tradear. Las horas muertas (10h–13h) tienen una liquidity institucional muy baja — los movimientos carecen de dirección y abundan las señales falsas.",
          "Correcto. Esperando la NY Killzone te aseguras de operar en una ventana donde la actividad institucional es fuerte, los movimientos son direccionales y los setups más confiables.",
          "Falso. Bajar a M5 durante las horas muertas amplifica el problema — el ruido es aún más fuerte en timeframes pequeños cuando la liquidity es baja.",
          "Falso. Las horas muertas no son ideales para los breakouts — son conocidas por los false breakouts, precisamente porque falta volumen institucional para confirmar las rupturas.",
        ]}
      />

    </LessonPage>
  );
}
