// Onboarding 2 étapes pour les nouveaux visiteurs TradingLab.
//
// Étape 1 — Welcome : présentation rapide + progression recommandée
// Étape 2 — Choix : 3 portes d'entrée (Bases / Jeux / Stratégies)
//
// Première visite uniquement (état persisté dans tradinglab_onboarding_v1).
// Mount dans le layout root pour fonctionner sur toutes les pages.

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale, useDict } from "@/app/components/LocaleProvider";
import { localizedHref } from "@/lib/i18n/href";

const STORAGE_KEY = "tradinglab_onboarding_v1";

type DoorKey = "bases" | "games" | "strategies";

interface DoorMeta {
  key:    DoorKey;
  href:   string;
  emoji:  string;
  accent: "emerald" | "blue" | "amber";
}

const DOORS: DoorMeta[] = [
  { key: "bases",      href: "/formations/debutant/lecon1", emoji: "🟢", accent: "emerald" },
  { key: "games",      href: "/jeux",                       emoji: "🔵", accent: "blue"    },
  { key: "strategies", href: "/strategies",                 emoji: "🟠", accent: "amber"   },
];

const ACCENT_CLASSES: Record<DoorMeta["accent"], { border: string; bg: string; text: string }> = {
  emerald: { border: "border-emerald-500/40", bg: "bg-emerald-500/8", text: "text-emerald-400" },
  blue:    { border: "border-blue-500/40",    bg: "bg-blue-500/8",    text: "text-blue-400"    },
  amber:   { border: "border-amber-500/40",   bg: "bg-amber-500/8",   text: "text-amber-400"   },
};

export function OnboardingOverlay() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const t = useDict("onboarding");

  // Lecture localStorage côté client uniquement.
  // Légère délay (350ms) pour laisser la page se peindre avant que l'overlay arrive.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const done = window.localStorage.getItem(STORAGE_KEY);
      if (done) return;
      const tid = setTimeout(() => setShow(true), 350);
      return () => clearTimeout(tid);
    } catch {
      // localStorage indisponible (mode privé) — on n'affiche pas l'overlay
    }
  }, []);

  function markDone() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "done");
    } catch {}
    setShow(false);
  }

  function handleDoorClick() {
    markDone();
    // Le Link navigue ensuite naturellement
  }

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center px-4 sm:px-6 py-6 onboarding-fade-in"
      onClick={markDone}
      role="dialog"
      aria-modal="true"
      aria-label={t.aria.dialog}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-zinc-900/95 border border-emerald-500/25 rounded-2xl shadow-[0_0_60px_-10px_rgba(16,185,129,0.3)] overflow-hidden onboarding-card-in"
      >

        {/* Header — logo glow */}
        <div className="px-5 sm:px-6 pt-6 sm:pt-7 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center shadow-[0_0_20px_-2px_rgba(16,185,129,0.6)]">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 14L7 9l3 3 5-7" stroke="#09090b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-base font-bold text-white">TradingLab</span>
          </div>
          <button
            onClick={markDone}
            aria-label={t.aria.close}
            className="text-zinc-600 hover:text-zinc-300 w-7 h-7 rounded-lg flex items-center justify-center hover:bg-zinc-800 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {step === 1 && <Step1 onNext={() => setStep(2)} onSkip={markDone} />}
        {step === 2 && <Step2 onBack={() => setStep(1)} onPick={handleDoorClick} onSkip={markDone} />}
      </div>

      <style jsx global>{`
        @keyframes onboarding-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes onboarding-card-in {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        .onboarding-fade-in  { animation: onboarding-fade-in 250ms ease-out; }
        .onboarding-card-in  { animation: onboarding-card-in 350ms cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
}

// ─── Step 1 : Welcome ────────────────────────────────────────────────────────

function Step1({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) {
  const t = useDict("onboarding").step1;
  return (
    <div className="px-5 sm:px-6 pb-5 sm:pb-6">
      <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1.5">
        {t.eyebrow}
      </p>
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 leading-tight">
        {t.title}
      </h2>

      <ul className="space-y-2 mb-5">
        {t.bullets.map((text) => (
          <li key={text} className="flex items-start gap-2.5 text-[13px] text-zinc-300 leading-relaxed">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-emerald-400 shrink-0 mt-0.5">
              <path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{text}</span>
          </li>
        ))}
      </ul>

      <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl px-3.5 py-3 mb-5">
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
          {t.progressEyebrow}
        </p>
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-medium flex-wrap">
          {t.steps.map((step, i, arr) => (
            <span key={step} className="flex items-center gap-1.5">
              <span className="text-zinc-600 tabular-nums">{i + 1}.</span>
              <span className="text-zinc-300">{step}</span>
              {i < arr.length - 1 && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-zinc-700">
                  <path d="M3 2l4 3-4 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full flex items-center justify-center gap-2 bg-emerald-500 text-zinc-950 font-bold text-sm px-5 py-3.5 rounded-xl hover:bg-emerald-400 active:scale-[0.98] transition-all shadow-[0_0_30px_-5px_rgba(16,185,129,0.5)]"
      >
        {t.next}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <button
        onClick={onSkip}
        className="block w-full text-center text-[11px] text-zinc-600 hover:text-zinc-400 font-medium mt-3 transition-colors"
      >
        {t.skip}
      </button>
    </div>
  );
}

// ─── Step 2 : Choix de porte d'entrée ────────────────────────────────────────

function Step2({ onBack, onPick, onSkip }: { onBack: () => void; onPick: () => void; onSkip: () => void }) {
  const locale = useLocale();
  const t = useDict("onboarding").step2;
  return (
    <div className="px-5 sm:px-6 pb-5 sm:pb-6">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-[11px] text-zinc-500 hover:text-zinc-300 mb-3 transition-colors"
      >
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
          <path d="M9 5.5H2M5 3.5l-3 2-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {t.back}
      </button>

      <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1.5">
        {t.eyebrow}
      </p>
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-tight">
        {t.title}
      </h2>
      <p className="text-[12px] text-zinc-500 leading-relaxed mb-5">
        {t.subtitle}
      </p>

      <div className="flex flex-col gap-2.5 mb-5">
        {DOORS.map((door) => {
          const a = ACCENT_CLASSES[door.accent];
          const doorText = t.doors[door.key];
          return (
            <Link
              key={door.href}
              href={localizedHref(door.href, locale)}
              onClick={onPick}
              className={`group flex items-center gap-3 sm:gap-4 ${a.bg} ${a.border} border hover:brightness-110 active:scale-[0.99] rounded-xl px-4 py-3.5 transition-all`}
            >
              <span className="text-xl shrink-0">{door.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-[13px] font-bold ${a.text}`}>{doorText.title}</p>
                <p className="text-[11px] text-zinc-400 leading-snug">{doorText.description}</p>
              </div>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-zinc-600 shrink-0 group-hover:translate-x-0.5 transition-transform">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          );
        })}
      </div>

      <button
        onClick={onSkip}
        className="block w-full text-center text-[11px] text-zinc-600 hover:text-zinc-400 font-medium transition-colors"
      >
        {t.later}
      </button>
    </div>
  );
}
