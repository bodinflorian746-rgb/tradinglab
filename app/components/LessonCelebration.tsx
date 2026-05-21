// Composant célébration unifié pour toutes les leçons TradingLab.
// Quand triggerKey change (et != 0), joue une animation de ~2.8s :
//   - Confettis (60 particules colorées tombant)
//   - Toast XP "+20 XP" qui pop en haut
//
// Idempotent côté UI : si la leçon est déjà terminée et qu'on reclique,
// le parent ne change PAS triggerKey → pas de re-célébration.

"use client";

import { useEffect, useMemo, useState } from "react";
import { LESSON_XP } from "@/lib/progress";

interface Particle {
  id:       number;
  xPct:     number;   // position X de départ en % du viewport
  delayMs:  number;
  durMs:    number;
  color:    string;
  startRot: number;
}

const CONFETTI_COLORS = ["#10b981", "#34d399", "#f59e0b", "#fbbf24", "#3b82f6", "#a78bfa"];

function buildParticles(count: number, seed: number): Particle[] {
  let s = seed >>> 0;
  const rand = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return (s & 0x7fffffff) / 0x7fffffff;
  };
  return Array.from({ length: count }, (_, i) => ({
    id:       i,
    xPct:     rand() * 100,
    delayMs:  rand() * 200,
    durMs:    1800 + rand() * 900,
    color:    CONFETTI_COLORS[Math.floor(rand() * CONFETTI_COLORS.length)],
    startRot: rand() * 360,
  }));
}

interface LessonCelebrationProps {
  triggerKey: number;   // change pour déclencher (initial 0 = no-op)
  xp?:        number;   // XP gagné (défaut LESSON_XP = 20)
}

export function LessonCelebration({ triggerKey, xp = LESSON_XP }: LessonCelebrationProps) {
  const [active, setActive] = useState(false);
  const particles = useMemo(() => buildParticles(60, triggerKey + 1), [triggerKey]);

  useEffect(() => {
    if (triggerKey === 0) return;
    setActive(true);
    const t = setTimeout(() => setActive(false), 2800);
    return () => clearTimeout(t);
  }, [triggerKey]);

  if (!active) return null;

  return (
    <>
      {/* Toast XP : pop en haut de l'écran */}
      <div className="fixed top-24 left-1/2 z-50 pointer-events-none -translate-x-1/2">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-zinc-950 font-black text-base sm:text-lg px-5 py-2.5 rounded-full shadow-[0_0_40px_-5px_rgba(16,185,129,0.6)] flex items-center gap-2 lesson-xp-pop">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1l1.8 4.4L14 6l-3.2 3 .8 4.5L8 11.4 4.4 13.5l.8-4.5L2 6l4.2-.6L8 1z" fill="currentColor" />
          </svg>
          <span>+{xp} XP</span>
        </div>
      </div>

      {/* Confettis */}
      <div className="fixed inset-0 z-40 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute top-0 w-2 h-2 rounded-sm"
            style={{
              left:            `${p.xPct}%`,
              backgroundColor: p.color,
              animation:       `lesson-confetti-fall ${p.durMs}ms ${p.delayMs}ms ease-out forwards`,
              transform:       `rotate(${p.startRot}deg)`,
            }}
          />
        ))}
      </div>

      <style jsx global>{`
        @keyframes lesson-confetti-fall {
          0%   { transform: translateY(-12vh) rotate(0deg);   opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes lesson-xp-pop {
          0%   { transform: translate(-50%, -10px) scale(0.6); opacity: 0; }
          15%  { transform: translate(-50%, 0)     scale(1.15); opacity: 1; }
          25%  { transform: translate(-50%, 0)     scale(1);    opacity: 1; }
          80%  { transform: translate(-50%, 0)     scale(1);    opacity: 1; }
          100% { transform: translate(-50%, -16px) scale(0.92); opacity: 0; }
        }
        .lesson-xp-pop {
          animation: lesson-xp-pop 2600ms ease-out forwards;
        }
      `}</style>
    </>
  );
}
