"use client";

import { useState, useEffect, useRef, useMemo, Fragment } from "react";
import Link from "next/link";
import { LESSONS } from "@/lib/lessons";
import type { LessonContent } from "@/lib/lessons";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";

type Section = LessonContent["sections"][number];

// ─── Constants ────────────────────────────────────────────────────────────────

const PHASE_LABELS  = ["Lecture", "À retenir", "Exercice", "Quiz"];
const PHASE_XP      = [0, 5, 10, 5];
const SECTION_IDS   = ["lesson-content", "lesson-keypoints", "lesson-exercice", "lesson-quiz"];

const CONFETTI_COLORS = [
  "#10b981", "#34d399", "#6ee7b7",
  "#fbbf24", "#fcd34d",
  "#60a5fa", "#a78bfa", "#f472b6",
];

const PHASE_TOASTS = [
  null,
  { message: "Bien joué !", sub: "Points clés assimilés" },
  { message: "Tu progresses !", sub: "Exercice complété" },
  { message: "Continue comme ça !", sub: "Quiz validé — leçon terminée" },
];

const MOTIVATIONAL_PHRASES = [
  "Bravo, tu progresses !",
  "Excellent travail !",
  "Continue comme ça !",
];

// ─── CSS keyframes ────────────────────────────────────────────────────────────

const KEYFRAMES = `
  @keyframes confettiFall {
    0%   { opacity: 1; transform: translateY(0) rotate(0deg) scale(1); }
    70%  { opacity: 1; }
    100% { opacity: 0; transform: translateY(105vh) rotate(600deg) scale(0.4); }
  }
  @keyframes xpPop {
    0%   { opacity: 0; transform: translateY(10px) scale(0.85); }
    18%  { opacity: 1; transform: translateY(0) scale(1.04); }
    35%  { transform: scale(1); }
    72%  { opacity: 1; transform: translateY(-6px); }
    100% { opacity: 0; transform: translateY(-20px) scale(0.95); }
  }
  @keyframes stepRing {
    0%, 100% { box-shadow: 0 0 0 0   rgba(16,185,129,0.45); }
    50%       { box-shadow: 0 0 0 6px rgba(16,185,129,0);    }
  }
  @keyframes badgePop {
    0%   { transform: scale(0.5); opacity: 0; }
    60%  { transform: scale(1.15); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%      { transform: translateX(-5px); }
    40%      { transform: translateX(5px); }
    60%      { transform: translateX(-3px); }
    80%      { transform: translateX(3px); }
  }
  @keyframes glowPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.3); }
    50%      { box-shadow: 0 0 0 6px rgba(16,185,129,0); }
  }
  @keyframes fadeExplain {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

// ─── Progress ring (SVG) ──────────────────────────────────────────────────────

function ProgressRing({ pct }: { pct: number }) {
  const r = 19;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);

  return (
    <svg width="50" height="50" viewBox="0 0 50 50">
      <circle cx="25" cy="25" r={r} stroke="#27272a" strokeWidth="3" fill="none" />
      <circle
        cx="25" cy="25" r={r}
        stroke={pct === 100 ? "#34d399" : "#10b981"}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{
          transition: "stroke-dashoffset 0.7s ease",
          transformOrigin: "50% 50%",
          transform: "rotate(-90deg)",
        }}
      />
      <text
        x="25" y="29"
        textAnchor="middle"
        fontSize="9"
        fontWeight="700"
        fill={pct === 100 ? "#34d399" : "#ffffff"}
      >
        {pct}%
      </text>
    </svg>
  );
}

// ─── Sidebar (desktop only) ───────────────────────────────────────────────────

interface SidebarProps {
  phases:        boolean[];
  activeSection: number;
  onNavigate:    (i: number) => void;
  duration:      string;
}

function Sidebar({ phases, activeSection, onNavigate, duration }: SidebarProps) {
  const pct    = Math.round((phases.filter(Boolean).length / phases.length) * 100);
  const active = phases.findIndex((p) => !p);

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-[116px] space-y-3 w-[210px]">

        {/* Progress + nav */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4">
          {/* Ring + label */}
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-zinc-800/60">
            <ProgressRing pct={pct} />
            <div>
              <p className="text-xs font-bold text-white leading-tight">
                {pct === 100 ? "Terminé !" : "En cours"}
              </p>
              <p className="text-[10px] text-zinc-600 mt-0.5">
                {phases.filter(Boolean).length} / {phases.length} étapes
              </p>
            </div>
          </div>

          {/* Phase list */}
          <ul className="space-y-0.5">
            {PHASE_LABELS.map((label, i) => {
              const done    = phases[i];
              const current = i === active;
              const isActive = activeSection === i;

              return (
                <li key={i}>
                  <button
                    onClick={() => onNavigate(i)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all duration-200 group ${
                      isActive
                        ? "bg-zinc-800/80 text-white"
                        : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40"
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`shrink-0 w-[18px] h-[18px] rounded-full flex items-center justify-center border transition-all duration-300 ${
                        done
                          ? "bg-emerald-500 border-emerald-500"
                          : current
                          ? "border-emerald-500"
                          : "border-zinc-700"
                      }`}
                    >
                      {done ? (
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M1.5 4l2 2 3-3" stroke="#09090b" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <span style={{ fontSize: 7, fontWeight: 700, color: current ? "#10b981" : "#52525b" }}>
                          {i + 1}
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] font-semibold">{label}</span>

                    {/* Active dot */}
                    {isActive && !done && (
                      <div
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"
                        style={{ boxShadow: "0 0 5px rgba(16,185,129,0.7)" }}
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Meta */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-[11px] text-zinc-600">
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M5.5 3v2.5l1.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {duration}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-zinc-600">
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <rect x="1.5" y="1.5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M3.5 5.5h4M3.5 7.5h2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
            </svg>
            Leçon 1 sur 9
          </div>
          <div className="flex items-center gap-2 text-[11px] text-zinc-600">
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M2 9l3-4 2 2 2-3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Débutant
          </div>
        </div>

        {/* Next lesson */}
        <Link
          href="/formations/debutant/lecon2"
          className="flex items-center justify-between w-full text-[11px] font-semibold text-zinc-600 hover:text-zinc-300 border border-zinc-800 hover:border-zinc-700 rounded-xl px-4 py-2.5 transition-all duration-200 group"
        >
          Leçon suivante
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="transition-transform duration-200 group-hover:translate-x-0.5">
            <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </aside>
  );
}

// ─── Mobile tab bar ───────────────────────────────────────────────────────────

function TabBar({
  phases,
  activeSection,
  onNavigate,
}: {
  phases: boolean[];
  activeSection: number;
  onNavigate: (i: number) => void;
}) {
  return (
    <div
      className="lg:hidden sticky z-30 border-b border-zinc-800/60 bg-zinc-950/95 backdrop-blur-sm"
      style={{ top: 105 }}
    >
      <div
        className="flex overflow-x-auto px-4 py-2 gap-1"
        style={{ scrollbarWidth: "none" }}
      >
        {PHASE_LABELS.map((label, i) => {
          const done    = phases[i];
          const isActive = activeSection === i;

          return (
            <button
              key={i}
              onClick={() => onNavigate(i)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-600 hover:text-zinc-400"
              }`}
            >
              {done && (
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none" className="text-emerald-400 shrink-0">
                  <path d="M1.5 4.5l2.5 2.5 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Sticky progress bar ──────────────────────────────────────────────────────

function ProgressBar({ phases }: { phases: boolean[] }) {
  const count  = phases.filter(Boolean).length;
  const pct    = Math.round((count / phases.length) * 100);
  const active = phases.findIndex((p) => !p);

  return (
    <div className="sticky top-[57px] z-40 border-b border-zinc-800/60 bg-zinc-950/95 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-5">
            {PHASE_LABELS.map((label, i) => {
              const done    = phases[i];
              const current = i === active;
              return (
                <div key={i} className="flex items-center gap-1.5">
                  <div
                    style={{
                      background: done ? "#10b981" : current ? "transparent" : "#3f3f46",
                      border:     current ? "1.5px solid #10b981" : "none",
                      boxShadow:  done ? "0 0 6px rgba(16,185,129,0.5)" : "none",
                      animation:  current ? "stepRing 1.8s ease-out infinite" : "none",
                      width: 7, height: 7, borderRadius: "50%",
                      transition: "all 0.4s ease",
                    }}
                  />
                  <span
                    className="text-[10px] font-medium hidden sm:block transition-colors duration-300"
                    style={{ color: done ? "#34d399" : current ? "#e4e4e7" : "#52525b" }}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
          <span className="text-xs font-bold text-zinc-400 tabular-nums">{pct}%</span>
        </div>
        <div className="h-0.5 rounded-full bg-zinc-800 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${pct}%`, background: "linear-gradient(90deg,#10b981,#34d399)" }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Confetti ─────────────────────────────────────────────────────────────────

function Confetti() {
  const particles = useMemo(
    () =>
      Array.from({ length: 70 }, (_, i) => ({
        id:       i,
        left:     4 + Math.random() * 92,
        color:    CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        delay:    Math.random() * 0.9,
        duration: 1.4 + Math.random() * 1.4,
        size:     5 + Math.floor(Math.random() * 8),
        circle:   Math.random() > 0.45,
      })),
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-[200] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position:        "absolute",
            left:            `${p.left}%`,
            top:             -16,
            width:           p.size,
            height:          p.size,
            backgroundColor: p.color,
            borderRadius:    p.circle ? "50%" : "2px",
            animation:       `confettiFall ${p.duration}s ${p.delay}s ease-in forwards`,
          }}
        />
      ))}
    </div>
  );
}

// ─── XP toasts ────────────────────────────────────────────────────────────────

interface ToastData {
  id: number;
  xp: number;
  message: string;
  sub: string;
}

function XPToastContainer({ toasts }: { toasts: ToastData[] }) {
  return (
    <div className="fixed bottom-6 right-5 z-[150] flex flex-col-reverse gap-2.5 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-3 bg-zinc-900 border border-zinc-700/80 rounded-2xl px-4 py-3 shadow-2xl shadow-black/40"
          style={{ animation: "xpPop 2.6s ease forwards" }}
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="text-emerald-400">
              <path d="M7.5 1.5l1.6 4.3H13l-3.7 2.7 1.4 4.2L7.5 10l-3.2 2.7 1.4-4.2L2 5.8h3.9l1.6-4.3z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" fill="rgba(16,185,129,0.15)" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white leading-tight">{t.message}</p>
            <p className="text-[11px] text-zinc-500 leading-tight mt-0.5">{t.sub}</p>
          </div>
          <div
            className="shrink-0 bg-emerald-500/10 border border-emerald-500/25 rounded-full px-2.5 py-1"
            style={{ animation: "badgePop 0.4s 0.2s cubic-bezier(0.34,1.56,0.64,1) both" }}
          >
            <span className="text-xs font-bold text-emerald-400 tabular-nums">+{t.xp} XP</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Fade-in wrapper ──────────────────────────────────────────────────────────

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      style={{
        opacity:    visible ? 1 : 0,
        transform:  visible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.55s ease, transform 0.55s ease",
      }}
    >
      {children}
    </div>
  );
}

// ─── Trade outcome diagram ────────────────────────────────────────────────────

function TradeDiagram() {
  return (
    <>
      {/* ── DESKTOP (inchangé) ────────────────────────────────────────── */}
      <div className="hidden sm:grid mt-5 grid-cols-2 gap-3">
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
          <p className="text-[10px] font-bold text-emerald-400 text-center mb-2">Tu as raison ↑</p>
          <svg viewBox="0 0 140 140" className="w-full" fill="none">
            <line x1="12" y1="105" x2="128" y2="105" stroke="#3f3f46" strokeWidth="1" />
            <line x1="12" y1="30" x2="128" y2="30" stroke="#10b981" strokeWidth="1" strokeDasharray="3 2" opacity="0.4" />
            <polyline points="16,98 40,82 68,64 96,46 122,30" stroke="#10b981" strokeWidth="2" strokeLinejoin="round" />
            <circle cx="16" cy="98" r="3.5" fill="#10b981" />
            <circle cx="122" cy="30" r="4" fill="#10b981" />
            <text x="16" y="116" fontSize="8" fill="#a1a1aa">78 000 $</text>
            <text x="69" y="24" fontSize="8" fill="#10b981" textAnchor="middle">81 000 $</text>
            <text x="69" y="138" fontSize="10" fill="#10b981" textAnchor="middle" fontWeight="700">+3 000 $ de hausse ✔</text>
          </svg>
        </div>
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3">
          <p className="text-[10px] font-bold text-red-400 text-center mb-2">Tu as tort ↓</p>
          <svg viewBox="0 0 140 140" className="w-full" fill="none">
            <line x1="12" y1="105" x2="128" y2="105" stroke="#3f3f46" strokeWidth="1" />
            <line x1="12" y1="30" x2="128" y2="30" stroke="#52525b" strokeWidth="1" strokeDasharray="3 2" opacity="0.4" />
            <polyline points="16,30 40,46 68,62 96,78 122,94" stroke="#ef4444" strokeWidth="2" strokeLinejoin="round" />
            <circle cx="16" cy="30" r="3.5" fill="#ef4444" />
            <circle cx="122" cy="94" r="4" fill="#ef4444" />
            <text x="16" y="24" fontSize="8" fill="#a1a1aa">78 000 $ (achat)</text>
            <text x="69" y="102" fontSize="8" fill="#ef4444" textAnchor="middle">76 500 $</text>
            <text x="69" y="138" fontSize="10" fill="#ef4444" textAnchor="middle" fontWeight="700">−1 500 $ de baisse ✖</text>
          </svg>
        </div>
      </div>

      {/* ── MOBILE (variante dédiée — pas de texte dans le SVG) ─────── */}
      <div className="sm:hidden mt-5 space-y-3">
        <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-4">
          <p className="text-[13px] font-bold text-emerald-400 mb-3">Scénario A — Tu as raison ↑</p>
          <svg viewBox="0 0 200 70" className="w-full mb-3" fill="none" aria-label="Prix monte">
            <polyline points="10,60 50,46 100,30 150,18 190,8" stroke="#10b981" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            <circle cx="10" cy="60" r="5" fill="#10b981" />
            <circle cx="190" cy="8" r="5.5" fill="#10b981" />
          </svg>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2">
              <p className="text-[10px] text-zinc-500 uppercase tracking-wide">Achat</p>
              <p className="text-[15px] font-bold text-white font-mono">78 000 $</p>
            </div>
            <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-2">
              <p className="text-[10px] text-emerald-400 uppercase tracking-wide">Revente</p>
              <p className="text-[15px] font-bold text-emerald-400 font-mono">81 000 $</p>
            </div>
          </div>
          <p className="text-center text-[14px] font-bold text-emerald-400">+3 000 $ de hausse ✔</p>
        </div>

        <div className="rounded-xl border border-red-500/25 bg-red-500/5 p-4">
          <p className="text-[13px] font-bold text-red-400 mb-3">Scénario B — Tu as tort ↓</p>
          <svg viewBox="0 0 200 70" className="w-full mb-3" fill="none" aria-label="Prix baisse">
            <polyline points="10,8 50,22 100,36 150,50 190,62" stroke="#ef4444" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            <circle cx="10" cy="8" r="5" fill="#ef4444" />
            <circle cx="190" cy="62" r="5.5" fill="#ef4444" />
          </svg>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2">
              <p className="text-[10px] text-zinc-500 uppercase tracking-wide">Achat</p>
              <p className="text-[15px] font-bold text-white font-mono">78 000 $</p>
            </div>
            <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2">
              <p className="text-[10px] text-red-400 uppercase tracking-wide">Revente</p>
              <p className="text-[15px] font-bold text-red-400 font-mono">76 500 $</p>
            </div>
          </div>
          <p className="text-center text-[14px] font-bold text-red-400">−1 500 $ de baisse ✖</p>
        </div>
      </div>
    </>
  );
}

// ─── Section card ─────────────────────────────────────────────────────────────

function SectionCard({ section }: { section: Section }) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 hover:bg-zinc-900/70 transition-all duration-300">
      <h2 className="text-[15px] font-semibold text-white mb-3 leading-snug">{section.heading}</h2>
      <p className="text-zinc-400 text-sm leading-[1.75]">{section.body}</p>

      {section.diagram === "trade" && <TradeDiagram />}

      {section.items && (
        <ul className="mt-4 space-y-2">
          {section.items.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-3 bg-zinc-800/40 rounded-xl px-4 py-3 text-sm text-zinc-300 leading-relaxed hover:bg-zinc-800/60 transition-colors duration-150"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 mt-0.5 text-emerald-400">
                <path d="M2 7l3.5 3.5 6.5-6.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {item}
            </li>
          ))}
        </ul>
      )}

      {section.table && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                {section.table.headers.map((h, i) => (
                  <th key={i} className="text-left text-[10px] font-semibold text-zinc-500 uppercase tracking-widest pb-2.5 pr-6">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.table.rows.map((row, i) => (
                <tr key={i} className="border-t border-zinc-800/70">
                  {row.map((cell, j) => (
                    <td key={j} className={`py-2.5 pr-6 leading-snug text-sm ${j === 0 ? "text-white font-medium" : "text-zinc-400"}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Key points card ──────────────────────────────────────────────────────────

function KeyPointsCard({ points, onComplete }: { points: string[]; onComplete: () => void }) {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const firedRef = useRef(false);

  function toggle(i: number) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) {
        next.delete(i);
      } else {
        next.add(i);
        if (next.size === points.length && !firedRef.current) {
          firedRef.current = true;
          setTimeout(onComplete, 300);
        }
      }
      return next;
    });
  }

  const allChecked = checked.size === points.length;

  return (
    <div>
      <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-2 px-1">À retenir</p>
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="text-emerald-400">
                <path d="M6.5 1.5l1.2 3.6H11l-2.9 2.1 1.1 3.6L6.5 9 3.8 10.8l1.1-3.6L2 5.1h3.3L6.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-white">Points clés</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-600 tabular-nums">{checked.size}/{points.length}</span>
            {allChecked && (
              <span
                className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full"
                style={{ animation: "badgePop 0.4s cubic-bezier(0.34,1.56,0.64,1) both" }}
              >
                Tout maîtrisé ✓
              </span>
            )}
          </div>
        </div>

        <ul className="space-y-2">
          {points.map((point, i) => {
            const active = checked.has(i);
            return (
              <li key={i}>
                <button
                  onClick={() => toggle(i)}
                  className={`w-full flex items-start gap-3 text-left px-4 py-3 rounded-xl border transition-all duration-200 active:scale-[0.99] ${
                    active
                      ? "border-emerald-500/20 bg-emerald-500/5"
                      : "border-zinc-800 bg-zinc-800/30 hover:border-zinc-600 hover:bg-zinc-800/60 hover:translate-x-0.5"
                  }`}
                >
                  <div className={`shrink-0 mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-200 ${active ? "bg-emerald-500 border-emerald-500" : "border-zinc-600"}`}>
                    {active && (
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M1.5 4l2 2 3-3" stroke="#09090b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-sm leading-relaxed transition-colors duration-200 ${active ? "text-zinc-500 line-through decoration-zinc-600" : "text-zinc-300"}`}>
                    {point}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {!allChecked && (
          <p className="mt-4 text-center text-xs text-zinc-700">
            Coche chaque point pour confirmer que tu l'as assimilé
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Exercise card ────────────────────────────────────────────────────────────

function ExerciceCard({ exercise, onComplete }: { exercise: { title: string; steps: string[] }; onComplete: () => void }) {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [done, setDone]       = useState(false);

  function toggle(i: number) {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  const allChecked = checked.size === exercise.steps.length;

  function handleComplete() {
    setDone(true);
    onComplete();
  }

  return (
    <div>
      <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-2 px-1">Exercice pratique</p>
      <div className={`rounded-2xl border p-6 transition-all duration-500 ${done ? "bg-zinc-900/30 border-zinc-800/50" : "bg-zinc-900/50 border-zinc-800"}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 ${done ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-zinc-800 border border-zinc-700"}`}>
              {done ? (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-emerald-400">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-zinc-400">
                  <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M6 3.5v2.5l2 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span className={`text-sm font-semibold transition-colors duration-300 ${done ? "text-zinc-500" : "text-white"}`}>
              {exercise.title}
            </span>
          </div>
          {done && <span className="text-xs font-medium text-emerald-400">Complété ✓</span>}
        </div>

        {!done ? (
          <>
            <ul className="space-y-1.5 mb-5">
              {exercise.steps.map((step, i) => (
                <li key={i}>
                  <button
                    onClick={() => toggle(i)}
                    className={`w-full flex items-start gap-3 text-left px-3.5 py-2.5 rounded-xl transition-all duration-150 active:scale-[0.99] ${
                      checked.has(i) ? "bg-emerald-500/5" : "hover:bg-zinc-800/60 hover:translate-x-0.5"
                    }`}
                  >
                    <div className={`shrink-0 mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-all duration-150 ${checked.has(i) ? "bg-emerald-500 border-emerald-500" : "border-zinc-600"}`}>
                      {checked.has(i) && (
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M1.5 4l2 2 3-3" stroke="#09090b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-xs leading-relaxed transition-colors duration-150 ${checked.has(i) ? "text-zinc-500 line-through decoration-zinc-600" : "text-zinc-400"}`}>
                      {step}
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <button
              onClick={handleComplete}
              disabled={!allChecked}
              className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-[0.99] ${allChecked ? "bg-zinc-700 hover:bg-zinc-600 text-white" : "bg-zinc-800/40 text-zinc-700 cursor-not-allowed"}`}
            >
              {allChecked ? "Marquer comme complété" : `${checked.size} / ${exercise.steps.length} étapes cochées`}
            </button>
          </>
        ) : (
          <p className="text-sm text-zinc-600 leading-relaxed">{exercise.title}</p>
        )}
      </div>
    </div>
  );
}

// ─── Quiz card ────────────────────────────────────────────────────────────────

type QuizOptionState = "idle" | "selected" | "correct" | "wrong" | "dimmed";

function QuizOptionBadge({ letter, state }: { letter: string; state: QuizOptionState }) {
  const cls: Record<QuizOptionState, string> = {
    idle:     "border-zinc-700 text-zinc-600 bg-transparent",
    selected: "border-emerald-500/60 text-emerald-400 bg-emerald-500/10",
    correct:  "border-emerald-500 bg-emerald-500 text-zinc-950",
    wrong:    "border-red-500/60 bg-red-500/15 text-red-400",
    dimmed:   "border-zinc-800 text-zinc-700 bg-transparent",
  };
  return (
    <span
      className={`shrink-0 w-[22px] h-[22px] mt-0.5 rounded-full border flex items-center justify-center transition-all duration-300 ${cls[state]}`}
      style={{ fontSize: 10, fontWeight: 700 }}
    >
      {state === "correct" ? (
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
          <path d="M1.5 5.5l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : state === "wrong" ? (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M8 2L2 8M2 2l6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      ) : letter}
    </span>
  );
}

function QuizOptionRow({
  index, text, explanation, state, onClick,
}: {
  index: number; text: string; explanation?: string;
  state: QuizOptionState; onClick?: () => void;
}) {
  const letter = String.fromCharCode(65 + index);
  const container: Record<QuizOptionState, string> = {
    idle:     "border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-900/60 hover:text-zinc-200 hover:translate-x-1 cursor-pointer",
    selected: "border-emerald-500/40 bg-emerald-500/5 text-white cursor-pointer",
    correct:  "border-emerald-500/40 bg-emerald-500/8 text-white cursor-default",
    wrong:    "border-red-500/30 bg-red-500/8 text-red-200 cursor-default",
    dimmed:   "border-zinc-800/60 bg-zinc-900/20 text-zinc-600 cursor-default",
  };
  const explainColor: Record<QuizOptionState, string> = {
    idle: "", selected: "",
    correct: "text-emerald-400/80", wrong: "text-red-400/70", dimmed: "text-zinc-600",
  };
  const showExplain = explanation && (state === "correct" || state === "wrong" || state === "dimmed");

  return (
    <button
      onClick={onClick}
      disabled={state === "correct" || state === "wrong" || state === "dimmed"}
      className={`w-full flex items-start gap-3 text-left px-4 py-3.5 rounded-xl border text-sm transition-all duration-200 active:scale-[0.99] ${container[state]}`}
    >
      <QuizOptionBadge letter={letter} state={state} />
      <div className="min-w-0">
        <p className="leading-snug">{text}</p>
        {showExplain && (
          <p className={`text-xs mt-2 leading-relaxed ${explainColor[state]}`} style={{ animation: "fadeExplain 0.35s ease both" }}>
            {explanation}
          </p>
        )}
      </div>
    </button>
  );
}

function QuizCard({ quiz, onComplete }: {
  quiz: { question: string; answers: string[]; correct: number; explanation: string; answerExplanations?: string[] };
  onComplete: () => void;
}) {
  const [selected,  setSelected]  = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [shaking,   setShaking]   = useState(false);
  const firedRef = useRef(false);

  const isCorrect = submitted && selected === quiz.correct;

  function handleSubmit() {
    if (selected === null) return;
    setSubmitted(true);
    if (selected !== quiz.correct) {
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
    if (!firedRef.current) {
      firedRef.current = true;
      setTimeout(onComplete, 700);
    }
  }

  function getState(i: number): QuizOptionState {
    if (!submitted) return selected === i ? "selected" : "idle";
    if (i === quiz.correct) return "correct";
    if (i === selected)     return "wrong";
    return "dimmed";
  }

  return (
    <div>
      <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-2 px-1">Quiz</p>
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700/80 flex items-center justify-center shrink-0">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="text-zinc-400">
                <path d="M6.5 2.5c-1.6 0-2.8 1-2.8 2.3 0 .6.3 1.1.7 1.5L5 7.5h3l.6-1.2c.4-.4.7-.9.7-1.5C9.3 3.5 8.1 2.5 6.5 2.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                <path d="M5 7.5v.5a1.5 1.5 0 003 0v-.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-white">Quiz de validation</span>
          </div>
          {submitted && (
            <span
              className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${isCorrect ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25" : "bg-red-500/10 text-red-400 border-red-500/20"}`}
              style={{ animation: "fadeExplain 0.3s ease both" }}
            >
              {isCorrect ? (
                <><svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.5 4.5l2.5 2.5 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>Bonne réponse</>
              ) : (
                <><svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M7 2L2 7M2 2l5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>Mauvaise réponse</>
              )}
            </span>
          )}
        </div>

        {/* Question */}
        <p className="text-[15px] font-medium text-white leading-snug mb-5">{quiz.question}</p>

        {/* Options */}
        <div
          className="space-y-2.5 mb-5"
          style={shaking ? { animation: "shake 0.45s ease" } : undefined}
        >
          {quiz.answers.map((answer, i) => (
            <QuizOptionRow
              key={i}
              index={i}
              text={answer}
              explanation={quiz.answerExplanations?.[i]}
              state={getState(i)}
              onClick={!submitted ? () => setSelected(i) : undefined}
            />
          ))}
        </div>

        {/* Validate */}
        {!submitted && (
          <button
            onClick={handleSubmit}
            disabled={selected === null}
            className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[0.99] ${
              selected !== null
                ? "bg-emerald-500 hover:bg-emerald-400 text-zinc-950"
                : "bg-zinc-900 border border-zinc-800 text-zinc-700 cursor-not-allowed"
            }`}
          >
            {selected !== null ? "Valider ma réponse" : "Choisis une réponse"}
          </button>
        )}

        {/* Global fallback explanation (no per-answer data) */}
        {submitted && !quiz.answerExplanations && (
          <div
            className={`rounded-xl px-4 py-3.5 flex items-start gap-3 ${isCorrect ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-red-500/10 border border-red-500/20"}`}
            style={{ animation: "fadeExplain 0.35s ease both" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={`shrink-0 mt-0.5 ${isCorrect ? "text-emerald-400" : "text-red-400"}`}>
              {isCorrect
                ? <path d="M3 8l3.5 3.5 6.5-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                : <path d="M11 5L5 11M5 5l6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              }
            </svg>
            <div>
              <p className={`text-sm font-semibold mb-1 ${isCorrect ? "text-emerald-400" : "text-red-400"}`}>
                {isCorrect ? "Excellente réponse !" : "Pas tout à fait."}
              </p>
              <p className="text-xs text-zinc-400 leading-relaxed">{quiz.explanation}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Completion screen ────────────────────────────────────────────────────────

function CompletionScreen() {
  const [xp,      setXp]      = useState(0);
  const [visible, setVisible] = useState(false);

  const phrase = MOTIVATIONAL_PHRASES[Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length)];

  useEffect(() => {
    const show = setTimeout(() => setVisible(true), 60);
    let count = 0;
    const counter = setInterval(() => {
      count += 1;
      setXp(count);
      if (count >= 20) clearInterval(counter);
    }, 50);
    return () => { clearTimeout(show); clearInterval(counter); };
  }, []);

  return (
    <div
      className="rounded-2xl border p-8 text-center"
      style={{
        opacity:     visible ? 1 : 0,
        transform:   visible ? "translateY(0) scale(1)" : "translateY(22px) scale(0.97)",
        transition:  "opacity 0.7s ease, transform 0.7s ease",
        background:  "radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.08) 0%, transparent 65%)",
        borderColor: "rgba(16,185,129,0.28)",
      }}
    >
      <div
        className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mx-auto mb-5"
        style={{ animation: visible ? "badgePop 0.5s 0.1s cubic-bezier(0.34,1.56,0.64,1) both" : "none" }}
      >
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" className="text-emerald-400">
          <path d="M5 13l6 6L21 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <p className="text-[11px] font-semibold tracking-widest uppercase text-emerald-500/70 mb-2">Leçon terminée</p>
      <h2 className="text-xl font-bold text-white mb-2">{phrase}</h2>
      <p className="text-zinc-400 text-sm leading-relaxed mb-6 max-w-xs mx-auto">
        Contenu lu · Points assimilés · Exercice complété · Quiz validé
      </p>

      <div
        className="inline-flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/25 rounded-full px-5 py-2.5 mb-7"
        style={{ animation: visible ? "badgePop 0.5s 0.35s cubic-bezier(0.34,1.56,0.64,1) both" : "none", opacity: 0 }}
      >
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="text-emerald-400">
          <path d="M7.5 1.5l1.6 4.3H13l-3.7 2.7 1.4 4.2L7.5 10l-3.2 2.7 1.4-4.2L2 5.8h3.9l1.6-4.3z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" fill="rgba(16,185,129,0.15)" />
        </svg>
        <span className="text-emerald-400 font-bold text-sm tabular-nums">+{xp} XP</span>
      </div>

      <div className="flex items-center justify-center gap-6 mb-7">
        {[
          { label: "Leçon",  value: "1/9" },
          { label: "Niveau", value: "Débutant" },
          { label: "Série",  value: "1 jour 🔥" },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-sm font-bold text-white">{s.value}</p>
            <p className="text-[10px] text-zinc-600 uppercase tracking-wide">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/dashboard"
          className="px-5 py-2.5 rounded-xl text-sm font-medium text-zinc-400 border border-zinc-800 hover:border-zinc-600 hover:text-white transition-all duration-200 active:scale-[0.99]"
        >
          Tableau de bord
        </Link>
        <Link
          href="/formations/debutant/lecon2"
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] text-zinc-950 transition-all duration-200"
        >
          Leçon suivante
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Lecon1Page() {
  const level  = LESSONS.find((l) => l.level === "debutant")!;
  const lesson = level.lessons.find((l) => l.slug === "lecon1")!;

  const [phases,         setPhases]         = useState([true, false, false, false]);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showConfetti,   setShowConfetti]   = useState(false);
  const [toasts,         setToasts]         = useState<ToastData[]>([]);
  const [activeSection,  setActiveSection]  = useState(0);
  const toastIdRef = useRef(0);

  // Scroll tracking — update activeSection based on viewport position
  useEffect(() => {
    function handleScroll() {
      const midpoint = window.innerHeight * 0.45;
      let current = 0;
      SECTION_IDS.forEach((id, i) => {
        const el = document.getElementById(id);
        if (!el) return;
        if (el.getBoundingClientRect().top < midpoint) current = i;
      });
      setActiveSection(current);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollToSection(idx: number) {
    const el = document.getElementById(SECTION_IDS[idx]);
    if (!el) return;
    const offset = 160;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  }

  function fireToast(phaseIdx: number) {
    const meta = PHASE_TOASTS[phaseIdx];
    if (!meta) return;
    const id  = ++toastIdRef.current;
    const xp  = PHASE_XP[phaseIdx];
    setToasts((prev) => [...prev, { id, xp, ...meta }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2800);
  }

  function completePhase(i: number) {
    setPhases((prev) => {
      if (prev[i]) return prev;
      const next = [...prev];
      next[i] = true;
      return next;
    });
    fireToast(i);
  }

  useEffect(() => {
    if (phases.every(Boolean) && !showCompletion) {
      // Persiste la complétion dans localStorage (tradinglab_progress) —
      // idempotent : markLessonComplete ne double-compte jamais. Le système
      // global voit ainsi la leçon 1 comme toutes les autres.
      const cur = getStoredProgress();
      if (!isLessonComplete(cur, "debutant", "lecon1")) {
        markLessonComplete(cur, "debutant", "lecon1");
      }
      const t1 = setTimeout(() => setShowConfetti(true),   350);
      const t2 = setTimeout(() => setShowCompletion(true), 550);
      const t3 = setTimeout(() => setShowConfetti(false), 4000);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
  }, [phases, showCompletion]);

  const sc = lesson.sections.length;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <style>{KEYFRAMES}</style>

      {showConfetti && <Confetti />}
      <XPToastContainer toasts={toasts} />

      {/* Sticky progress bar */}
      <ProgressBar phases={phases} />

      {/* Mobile tab bar */}
      <TabBar phases={phases} activeSection={activeSection} onNavigate={scrollToSection} />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="lg:grid lg:grid-cols-[210px_1fr] lg:gap-12">

          {/* ── Sidebar (desktop) ── */}
          <Sidebar
            phases={phases}
            activeSection={activeSection}
            onNavigate={scrollToSection}
            duration={lesson.duration}
          />

          {/* ── Main content ── */}
          <div className="min-w-0">

            {/* Header */}
            <FadeIn delay={0}>
              <div className="mb-8">
                <div className="flex items-center gap-2 text-[11px] text-zinc-600 mb-4">
                  <Link href="/formations" className="hover:text-zinc-400 transition-colors">Formations</Link>
                  <span>/</span>
                  <Link href="/formations" className="hover:text-zinc-400 transition-colors">Débutant</Link>
                  <span>/</span>
                  <span className="text-zinc-500">Leçon 1</span>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest border border-zinc-700 rounded-md px-2 py-0.5">
                    Débutant
                  </span>
                  <span className="text-[10px] text-zinc-600 flex items-center gap-1">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.2" />
                      <path d="M5 3v2l1.5 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {lesson.duration}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-white mb-4 leading-snug">{lesson.title}</h1>
                <div className="border-l-2 border-emerald-500/30 pl-4">
                  <p className="text-zinc-400 text-sm leading-[1.8]">{lesson.introduction}</p>
                </div>
              </div>
            </FadeIn>

            {/* ── Lecture section ── */}
            <div id="lesson-content">
              <FadeIn delay={60}>
                <div className="flex items-center gap-3 mb-5">
                  <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest">Lecture</p>
                  <div className="flex-1 h-px bg-zinc-800/60" />
                </div>
              </FadeIn>

              <div className="space-y-4 mb-10">
                {lesson.sections.map((section, i) => (
                  <FadeIn key={i} delay={120 + i * 90}>
                    <SectionCard section={section} />
                  </FadeIn>
                ))}
              </div>
            </div>

            {/* ── Divider ── */}
            <FadeIn delay={120 + sc * 90 + 60}>
              <div className="flex items-center gap-4 py-2 mb-6">
                <div className="flex-1 h-px bg-zinc-800" />
                <span className="text-[10px] font-semibold text-zinc-700 uppercase tracking-widest">Révision</span>
                <div className="flex-1 h-px bg-zinc-800" />
              </div>
            </FadeIn>

            {/* ── Interactive blocks ── */}
            <div className="space-y-4">

              <div id="lesson-keypoints">
                <FadeIn delay={120 + sc * 90 + 160}>
                  <KeyPointsCard points={lesson.keyPoints} onComplete={() => completePhase(1)} />
                </FadeIn>
              </div>

              <div id="lesson-exercice">
                <FadeIn delay={120 + sc * 90 + 240}>
                  <ExerciceCard exercise={lesson.exercise} onComplete={() => completePhase(2)} />
                </FadeIn>
              </div>

              <div id="lesson-quiz">
                <FadeIn delay={120 + sc * 90 + 320}>
                  <QuizCard quiz={lesson.quiz} onComplete={() => completePhase(3)} />
                </FadeIn>
              </div>

              {showCompletion && (
                <FadeIn delay={0}>
                  <CompletionScreen />
                </FadeIn>
              )}
            </div>

            {/* Footer nav */}
            <div className="mt-10 pt-6 border-t border-zinc-800/60 flex items-center justify-between">
              <span className="text-xs text-zinc-700">Leçon 1 sur 9</span>
              <Link
                href="/formations/debutant/lecon2"
                className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors group"
              >
                Leçon suivante
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform duration-200 group-hover:translate-x-0.5">
                  <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
