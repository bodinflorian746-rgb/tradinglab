// Micro-feedbacks subtils déclenchés à des moments clés (jamais > 1 toast
// par page, jamais 2 fois le même message).
//
// Pas de spam : chaque milestone est shown UNE FOIS et stocke un flag dans
// localStorage (tradinglab_milestones_v1).
//
// Usage côté page :
//   <MicroFeedback milestone="profile_forming" condition={events >= 3} />
//   → si condition true ET pas encore vu, affiche un toast subtil 4s

"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "tradinglab_milestones_v1";

export type MilestoneId =
  | "profile_forming"   // après 3 events tracking joués
  | "first_lesson"      // après la 1re leçon complète
  | "first_game_win";   // après le 1er event "win" tracking

const MILESTONE_MESSAGES: Record<MilestoneId, string> = {
  profile_forming: "Ton profil trader commence à prendre forme.",
  first_lesson:    "Première leçon terminée. Continue pour débloquer plus de statistiques.",
  first_game_win:  "Premier signal capté. Continue, c'est en jouant que les réflexes se construisent.",
};

interface Milestones {
  [key: string]: boolean;
}

function loadMilestones(): Milestones {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Milestones) : {};
  } catch {
    return {};
  }
}

function saveMilestone(id: MilestoneId): void {
  if (typeof window === "undefined") return;
  try {
    const current = loadMilestones();
    current[id] = true;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch {}
}

interface MicroFeedbackProps {
  milestone: MilestoneId;
  condition: boolean;
}

export function MicroFeedback({ milestone, condition }: MicroFeedbackProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!condition) return;
    const current = loadMilestones();
    if (current[milestone]) return; // déjà vu
    saveMilestone(milestone);
    // Léger délai pour laisser la page se monter, puis affiche 4s
    const t1 = setTimeout(() => setShow(true), 600);
    const t2 = setTimeout(() => setShow(false), 4800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [milestone, condition]);

  if (!show) return null;

  return (
    <>
      <div className="fixed top-20 sm:top-24 right-4 left-4 sm:left-auto sm:right-6 sm:max-w-sm z-[90] pointer-events-none micro-feedback-in">
        <div className="bg-zinc-900/95 backdrop-blur-sm border border-emerald-500/30 rounded-xl px-4 py-3 shadow-[0_0_30px_-5px_rgba(16,185,129,0.4)] flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M2.5 6.5l2 2 5-5" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-[12px] text-zinc-200 leading-snug font-medium">
            {MILESTONE_MESSAGES[milestone]}
          </p>
        </div>
      </div>
      <style jsx global>{`
        @keyframes micro-feedback-in {
          0%   { opacity: 0; transform: translateY(-12px); }
          15%  { opacity: 1; transform: translateY(0); }
          85%  { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-8px); }
        }
        .micro-feedback-in {
          animation: micro-feedback-in 4200ms ease-out forwards;
        }
      `}</style>
    </>
  );
}
