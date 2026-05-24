"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { SupportResistance } from "@/app/components/charts/SupportResistance";
import StrongVsWeakLevelDiagram from "@/app/components/charts/StrongVsWeakLevelDiagram";
import ZoneVsLineDiagram from "@/app/components/charts/ZoneVsLineDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Soporte y resistencia: las zonas donde el mercado reacciona", disabled: false },
  { id: "lecon2", title: "Lección 2",          disabled: true },
  { id: "lecon3", title: "Lección 3",          disabled: true },
  { id: "lecon4", title: "Lección 4",          disabled: true },
];

export default function ContentEs() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "support-resistance", "lecon1"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Estrategias</Link>
          <span>/</span>
          <Link href="/strategies/support-resistance" className="hover:text-zinc-400 transition-colors">Support / Resistance &amp; Range</Link>
          <span>/</span>
          <span className="text-zinc-500">Lección 1</span>
        </nav>

        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Principiante
            </span>
            <span className="text-zinc-700 text-xs">·</span>
            <span className="text-xs text-zinc-600">15 min</span>
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
            Soporte y resistencia: las zonas donde el mercado reacciona
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Esta lección enseña a identificar visualmente las zonas de soporte y resistencia en un chart: por los toques múltiples, por la distinción zona/línea, y por la evaluación de su fuerza.
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
              const isCurrent = lesson.id === "lecon1";
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
            <span className="ml-auto text-xs text-zinc-600">1 / 4 lecciones</span>
          </div>
        </header>

        <div className="space-y-8">

          {/* Bloc 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                «Encontrar una zona que aguanta se hace en 30 segundos en un chart. No en 30 minutos de lectura.»
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerrequisitos</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Noción de soporte y resistencia → ver Formación Trading L3</li>
              <li>- Lectura de velas → ver Estrategia PA L1</li>
              <li>- Concepto de swing high/low → ver Formación Trading L2</li>
            </ul>
          </div>

          {/* Bloc 3 — IDENTIFIER PAR LES TOUCHES MULTIPLES */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Identificar por los toques múltiples</h2>

            <div className="my-8">
              <SupportResistance supportPrice="4 500$" resistancePrice="4 650$" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Una zona se revela por los rebotes repetidos del precio sobre un mismo nivel. La repetición valida la memoria colectiva del mercado en torno a esa zona.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Mínimo 2 toques para calificar una zona, 3 toques para una confianza elevada</li>
              <li>- Timeframe de identificación principal: H4 (historial 100-150 velas)</li>
              <li>- En EUR/USD: grosor 10-20 pips. En XAU/USD: grosor 10-20$</li>
              <li>- Nada de trade en el 1er toque: el toque inicial valida la existencia, no la tradeabilidad</li>
            </ul>
          </section>

          {/* Bloc 4 — NIVEAU FORT VS NIVEAU FAIBLE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Nivel fuerte vs nivel débil</h2>

            <div className="my-8">
              <StrongVsWeakLevelDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              No todas las zonas trazadas tienen la misma fuerza. La cantidad de toques y la calidad de las reacciones distinguen los niveles aprovechables de los niveles marginales.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- 4 toques netos con rebotes claros = nivel fuerte, prioritario en la selección de setups</li>
              <li>- 2 toques blandos sin amplitud post-rebote = nivel débil, a excluir</li>
              <li>- Frescura: zona tocada en los últimos 30 días conserva su peso estructural</li>
              <li>- Zonas psicológicas (1.1800, 4 500$, 100 000$) refuerzan la fuerza del nivel</li>
            </ul>
          </section>

          {/* Bloc 5 — TOUJOURS UNE ZONE, PAS UNE LIGNE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Siempre una zona, no una línea</h2>

            <div className="my-8">
              <ZoneVsLineDiagram locale="es" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Un nivel institucional es una zona de interés, no una línea precisa. El trazado debe absorber las mechas naturales del mercado.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Trazado en línea fina = mechas repetidas hacen creer en una ruptura inexistente</li>
              <li>- Trazado en zona (rectángulo 10-20 pips) = mechas naturales absorbidas, lectura confiable</li>
              <li>- El trazado engloba cuerpos + mechas, nunca limitado solo a los cuerpos</li>
              <li>- Herramienta rectángulo de la plataforma, coloración translúcida (40% de opacidad)</li>
            </ul>
          </section>

          <LessonKeyPoints
            points={[
              "Una zona válida tiene mínimo 2 toques confirmados, idealmente 3 (memoria colectiva).",
              "El grosor de una zona: 10-20 pips en EUR/USD, 10-20$ en XAU/USD.",
              "El trazado en zona (no en línea) absorbe las mechas naturales y evita las señales falsas.",
              "Una zona fresca (tocada en los últimos 30 días) prima sobre una zona antigua.",
            ]}
          />

          <LessonExercice
            description="En EUR/USD H4, se identifican 3 mínimos en 1.1685, 1.1690 y 1.1688. El precio actual se sitúa en 1.1750. ¿Cómo se traza la zona de soporte?"
            steps={[
              "Iniciar el trazado con la herramienta Rectángulo, desde el más bajo de los 3 mínimos (1.1685) hasta el más alto (1.1690), zona inicial de 5 pips, demasiado fina",
              "Ampliar la zona: límite inferior en 1.1680, límite superior en 1.1695, zona final de 15 pips, conforme a la regla 10-20 pips",
              "Colorear el rectángulo en verde transparente (40% de opacidad)",
              "Verificar los 4 criterios: 3 toques confirmados (OK), grosor 15 pips (OK), distancia 60 pips del precio actual (OK), frescura a confirmar según historial",
              "Conclusión: la zona valida los 4 criterios y se vuelve tradeable",
            ]}
          />

          <LessonQuiz
            question="¿Cuántos toques mínimos son necesarios para validar una zona de soporte?"
            options={[
              "1 toque basta si el nivel es psicológico",
              "2 toques mínimo, 3 idealmente",
              "5 toques obligatorios",
              "Ningún umbral definido, juicio a ojo",
            ]}
            correctIndex={1}
            explanation="La regla operacional: 2 toques mínimo en el mismo nivel para calificar una zona tradeable. 3 toques elevan la confianza y confirman la memoria colectiva. Un solo toque, incluso en un nivel psicológico, sigue siendo un nivel puntual no confirmado."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "support-resistance", "lecon1");
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
                  <p className="text-sm font-semibold text-emerald-400">Lección terminada</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Lección 1 del módulo Support / Resistance &amp; Range completada.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <span />
              <span className="inline-flex items-center gap-2 text-sm text-zinc-700 cursor-not-allowed">
                Lección 2. Próximamente
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-600 border border-zinc-700">
                  Pronto
                </span>
              </span>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
