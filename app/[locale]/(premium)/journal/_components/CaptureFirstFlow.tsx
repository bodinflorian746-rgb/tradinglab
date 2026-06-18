"use client";

// ─────────────────────────────────────────────────────────────────────────────
//  FLUX D'AJOUT / MODIFICATION DE TRADE — 2 CHEMINS (PROTOTYPE / MOCK)
// ─────────────────────────────────────────────────────────────────────────────
//  CHEMIN A (capture) : capture → analyse IA simulée → ressenti → résumé
//  CHEMIN B (manuel)  : « continuer sans capture » → saisie manuelle → résumé
//
//  ÉDITION (Priorité 2) : prop `initial` → pré-remplit tout et ouvre le MÊME
//  flux (capture-first ou manuel selon la présence d'une capture). Mock : la
//  sauvegarde ne fait aucune écriture réelle.
//
//  VALIDATION (Priorité 1) : erreurs par champ — bordure rouge, message sous le
//  champ, scroll + focus automatiques vers le premier champ invalide.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState, useTransition, type ReactNode } from "react";
import { useDict } from "@/app/components/LocaleProvider";
import {
  DIRECTIONS,
  TIMEFRAMES,
  TRADE_TYPES,
  RESULTS,
  PLATFORMS,
  SETUPS,
  MARKET_TRENDS,
  SESSIONS,
  FOLLOWED_PLAN,
  MAIN_MISTAKES,
  EMOTIONS_BEFORE,
  EMOTIONS_AFTER,
  type TradeEntryView,
} from "@/lib/journal/types";
import { createTradeEntry } from "../actions";
import { ScoreGauge } from "./analysis/ScoreGauge";

const DETECTED_MOCK = {
  asset: "EURUSD",
  timeframe: "H1",
  direction: "buy",
  market_trend: "bullish",
  setup: "order_block",
  entry_price: "1.0742",
  stop_loss: "1.0728",
  take_profit: "1.0790",
  r_multiple: "2.1",
};

const AI_VERDICT_MOCK = {
  confidence: 81,
  score: 78,
  positives: ["Entrée cohérente avec la structure", "Structure haussière respectée", "Ratio risque/rendement intéressant"],
  warnings: ["Stop loss un peu serré", "Entrée légèrement anticipée"],
  explanation:
    "L'entrée est cohérente avec la structure haussière observée. Le principal point d'amélioration concerne le placement du stop loss, un peu trop serré par rapport à la volatilité récente.",
};

type TradeForm = {
  asset: string; direction: string; timeframe: string; trade_type: string; result: string;
  trade_date: string; platform: string; setup: string; market_trend: string; session: string;
  entry_price: string; stop_loss: string; take_profit: string; risk_percent: string; r_multiple: string;
  emotion_before: string; emotion_after: string; followed_plan: string; perceived_mistake: string; user_comment: string;
};

const BASE_FORM: TradeForm = {
  asset: "", direction: "", timeframe: "", trade_type: "", result: "", trade_date: "",
  platform: "", setup: "", market_trend: "", session: "",
  entry_price: "", stop_loss: "", take_profit: "", risk_percent: "", r_multiple: "",
  emotion_before: "", emotion_after: "", followed_plan: "", perceived_mistake: "", user_comment: "",
};

type Mode = "capture" | "manual";
type StepId = "capture" | "analysis" | "manual" | "ressenti" | "summary";

function deriveTradeType(tf: string): string {
  if (["M1", "M5", "M15"].includes(tf)) return "scalp";
  if (["M30", "H1", "H4"].includes(tf)) return "intraday";
  if (["D1", "W1"].includes(tf)) return "swing";
  return "intraday";
}

function nowLocalValue(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function isoToLocal(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return nowLocalValue();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function entryToForm(e: TradeEntryView): TradeForm {
  const s = (v: unknown) => (v === null || v === undefined ? "" : String(v));
  return {
    asset: s(e.asset), direction: s(e.direction), timeframe: s(e.timeframe), trade_type: s(e.trade_type),
    result: s(e.result), trade_date: isoToLocal(e.trade_date), platform: s(e.platform), setup: s(e.setup),
    market_trend: s(e.market_trend), session: s(e.session),
    entry_price: s(e.entry_price), stop_loss: s(e.stop_loss), take_profit: s(e.take_profit),
    risk_percent: s(e.risk_percent), r_multiple: s(e.r_multiple),
    emotion_before: s(e.emotion_before), emotion_after: s(e.emotion_after), followed_plan: s(e.followed_plan),
    perceived_mistake: s(e.perceived_mistake), user_comment: s(e.user_comment),
  };
}

const inputClass =
  "w-full bg-zinc-900/70 border border-zinc-700/70 focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none transition-colors";
const labelClass = "block text-xs font-medium text-zinc-400 mb-1.5";

function opt(values: readonly string[], labels: Record<string, string>) {
  return values.map((v) => (<option key={v} value={v}>{labels[v] ?? v}</option>));
}

function ChipGroup({ values, labels, value, onChange }: {
  values: readonly string[]; labels: Record<string, string>; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {values.map((v) => {
        const active = value === v;
        return (
          <button key={v} type="button" onClick={() => onChange(active ? "" : v)}
            className={active
              ? "text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/15 text-emerald-300 transition-colors"
              : "text-xs font-medium px-3 py-1.5 rounded-full border border-zinc-700/60 bg-zinc-800/40 text-zinc-300 hover:border-zinc-500 transition-colors"}>
            {labels[v] ?? v}
          </button>
        );
      })}
    </div>
  );
}

function BlockTitle({ children }: { children: ReactNode }) {
  return <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-400/80">{children}</p>;
}

export function CaptureFirstFlow({ onClose, initial }: { onClose: () => void; initial?: TradeEntryView | null }) {
  const t = useDict("journal");
  const c = t.capture;
  const isEdit = !!initial;
  const editMode: Mode = initial?.screenshot_url ? "capture" : "manual";

  const [mode, setMode] = useState<Mode>(isEdit ? editMode : "capture");
  const [step, setStep] = useState<StepId>(isEdit ? (editMode === "manual" ? "manual" : "analysis") : "capture");
  const [form, setForm] = useState<TradeForm>(() =>
    initial ? entryToForm(initial) : { ...BASE_FORM, trade_date: nowLocalValue() },
  );
  const [imageUrl, setImageUrl] = useState<string | null>(initial?.screenshot_signed_url ?? null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [phase, setPhase] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // set + efface l'erreur des champs modifiés (le rouge disparaît quand on corrige).
  const set = (patch: Partial<TradeForm>) => {
    setForm((f) => ({ ...f, ...patch }));
    setErrors((prev) => {
      if (Object.keys(patch).every((k) => !(k in prev))) return prev;
      const n = { ...prev };
      for (const k of Object.keys(patch)) delete n[k];
      return n;
    });
  };

  const eb = (name: string) => (errors[name] ? " !border-red-500 focus:!border-red-500 focus:!ring-red-500/40" : "");
  const msg = (name: string) =>
    errors[name] ? <p className="mt-1 text-xs text-red-400">{(c.req as Record<string, string>)[name]}</p> : null;

  function focusInvalid(name: string) {
    requestAnimationFrame(() => {
      const wrap = document.getElementById(`cf-field-${name}`);
      if (!wrap) return;
      wrap.scrollIntoView({ behavior: "smooth", block: "center" });
      const el = wrap.querySelector("input,select,textarea,button") as HTMLElement | null;
      el?.focus({ preventScroll: true });
    });
  }

  function validate(reqFields: (keyof TradeForm)[]): boolean {
    const missing = reqFields.filter((k) => !form[k]);
    const e: Record<string, string> = {};
    for (const k of missing) e[k] = "1";
    setErrors(e);
    if (missing.length) {
      focusInvalid(missing[0] as string);
      return false;
    }
    return true;
  }
  const MANUAL_REQ: (keyof TradeForm)[] = ["asset", "direction", "timeframe", "trade_type", "result", "setup", "emotion_before", "emotion_after", "followed_plan"];
  const RESSENTI_REQ: (keyof TradeForm)[] = ["result", "setup", "emotion_before", "emotion_after", "followed_plan"];

  // ── Chemin A : analyse IA simulée ──
  function startAnalysis(file: File) {
    setMode("capture");
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
    setStep("analysis");
    setAnalyzing(true);
    setPhase(0);
    const phaseCount = c.ai.phases.length;
    const PHASE_MS = 650;
    for (let i = 1; i <= phaseCount; i++) window.setTimeout(() => setPhase(i), i * PHASE_MS);
    window.setTimeout(() => {
      set(DETECTED_MOCK);
      setAnalyzing(false);
    }, phaseCount * PHASE_MS + 450);
  }
  function onPickFile(file: File | undefined) {
    if (file && file.type.startsWith("image/")) startAnalysis(file);
  }
  function goManual() {
    setMode("manual");
    setImageFile(null);
    setImageUrl(null);
    setStep("manual");
  }

  useEffect(() => {
    if (step !== "capture") return;
    function onPaste(e: ClipboardEvent) {
      const item = Array.from(e.clipboardData?.items ?? []).find((i) => i.type.startsWith("image/"));
      const file = item?.getAsFile();
      if (file) startAnalysis(file);
    }
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const flow: StepId[] = isEdit
    ? (mode === "manual" ? ["manual", "summary"] : ["analysis", "ressenti", "summary"])
    : (mode === "manual" ? ["capture", "manual", "summary"] : ["capture", "analysis", "ressenti", "summary"]);
  const idx = Math.max(0, flow.indexOf(step));

  function goBack() {
    setErrors({});
    const prev = flow[idx - 1];
    if (prev) setStep(prev);
  }

  function handleSave() {
    setSaveError(null);
    const fd = new FormData();
    fd.set("asset", form.asset);
    fd.set("direction", form.direction);
    fd.set("timeframe", form.timeframe);
    fd.set("trade_type", form.trade_type || deriveTradeType(form.timeframe));
    fd.set("result", form.result);
    fd.set("trade_date", form.trade_date);
    const optional: (keyof TradeForm)[] = ["platform", "setup", "market_trend", "session", "entry_price", "stop_loss", "take_profit", "risk_percent", "r_multiple", "emotion_before", "emotion_after", "followed_plan", "perceived_mistake", "user_comment"];
    for (const k of optional) if (form[k]) fd.set(k, form[k]);
    if (imageFile) fd.set("screenshot", imageFile);
    startTransition(async () => {
      const res = await createTradeEntry({ ok: false }, fd);
      if (res.ok) onClose();
      else setSaveError(res.error ?? "generic");
    });
  }

  const labelOf = (group: Record<string, string>, key: string) => (key ? group[key] ?? key : null);

  return (
    <div className="fixed inset-0 z-[60] flex items-stretch sm:items-center justify-center bg-black/75 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={isEdit ? c.editTitle : t.addTrade}>
      <div className="w-full sm:max-w-xl sm:rounded-2xl sm:max-h-[92vh] bg-zinc-950 border border-zinc-800 flex flex-col overflow-hidden">
        {/* En-tête */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-zinc-800/70 shrink-0">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide whitespace-nowrap">
            {c.step.replace("{n}", String(idx + 1)).replace("{total}", String(flow.length))}
          </span>
          <div className="flex-1 flex items-center gap-1.5 mx-2">
            {flow.map((s, i) => (<span key={s} className={`h-1 flex-1 rounded-full transition-colors ${i <= idx ? "bg-emerald-500" : "bg-zinc-800"}`} />))}
          </div>
          <button type="button" onClick={() => !pending && onClose()} aria-label={t.form.cancel} className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M5 5l10 10M15 5l-10 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6">
          {/* ── CAPTURE ── */}
          {step === "capture" && (
            <div className="flex flex-col items-center text-center min-h-[60vh] sm:min-h-0 justify-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{c.s1.title}</h2>
              <p className="text-sm text-zinc-400 mb-8 max-w-sm">{c.s1.subtitle}</p>
              <button type="button" onClick={() => fileInputRef.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); onPickFile(e.dataTransfer.files?.[0]); }}
                className="w-full border-2 border-dashed border-emerald-500/40 hover:border-emerald-500/70 bg-emerald-500/5 hover:bg-emerald-500/10 rounded-3xl px-6 py-16 sm:py-20 flex flex-col items-center gap-4 transition-all hover:scale-[1.01] shadow-[0_0_40px_-12px_rgba(16,185,129,0.35)]">
                <span className="w-20 h-20 rounded-3xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shadow-[0_0_30px_-6px_rgba(16,185,129,0.4)]">
                  <svg width="38" height="38" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 16V5m0 0L8 9m4-4l4 4" stroke="#34d399" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 15v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="#34d399" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </span>
                <span className="text-base sm:text-lg font-semibold text-white">{c.s1.dropzone}</span>
                <span className="inline-flex items-center bg-emerald-500 text-zinc-950 text-sm font-semibold px-5 py-2.5 rounded-xl">{c.s1.choose}</span>
              </button>
              <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="hidden" onChange={(e) => onPickFile(e.target.files?.[0])} />
              <button type="button" onClick={goManual} className="mt-7 text-sm text-zinc-400 hover:text-emerald-300 underline underline-offset-4 transition-colors">{c.s1.skip}</button>
            </div>
          )}

          {/* ── ANALYSE IA ── */}
          {step === "analysis" && (
            <div className="space-y-5">
              {imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl} alt="capture" className="w-full rounded-xl border border-zinc-800 object-contain max-h-64 bg-black/30" />
              )}
              {analyzing ? (
                <div className="py-6 space-y-3">
                  {c.ai.phases.map((label, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="w-6 h-6 flex items-center justify-center shrink-0">
                        {i < phase ? (
                          <span className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2.5 6.2l2.2 2.3L9.5 3.5" stroke="#34d399" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          </span>
                        ) : i === phase ? (
                          <span className="w-5 h-5 rounded-full border-2 border-emerald-500/30 border-t-emerald-400 animate-spin" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                        )}
                      </span>
                      <span className={`text-sm font-medium ${i <= phase ? "text-zinc-200" : "text-zinc-600"}`}>{label}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="bg-gradient-to-br from-emerald-500/10 to-zinc-900/40 border border-emerald-500/20 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-5">
                    <ScoreGauge value={AI_VERDICT_MOCK.score} max={100} label={c.ai.score} />
                    <div className="text-center sm:text-left">
                      <span className="inline-flex items-center text-sm font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1.5">{c.ai.confidence} · {AI_VERDICT_MOCK.confidence}%</span>
                      <p className="text-[11px] text-zinc-500 italic mt-3 max-w-xs">{c.s2.disclaimerSim}</p>
                    </div>
                  </div>
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4">
                    <p className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wide mb-2">{c.ai.explanation}</p>
                    <p className="text-sm text-zinc-300 leading-relaxed">{AI_VERDICT_MOCK.explanation}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4">
                      <p className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wide mb-2.5">{c.ai.positives}</p>
                      <ul className="space-y-2">{AI_VERDICT_MOCK.positives.map((p) => (<li key={p} className="flex items-start gap-2"><span className="w-4 h-4 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0 mt-0.5"><svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2.5 6.2l2.2 2.3L9.5 3.5" stroke="#34d399" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg></span><span className="text-sm text-zinc-300">{p}</span></li>))}</ul>
                    </div>
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4">
                      <p className="text-[11px] font-semibold text-amber-400 uppercase tracking-wide mb-2.5">{c.ai.warnings}</p>
                      <ul className="space-y-2">{AI_VERDICT_MOCK.warnings.map((w) => (<li key={w} className="flex items-start gap-2"><span className="w-4 h-4 rounded-full bg-amber-400/15 border border-amber-400/25 flex items-center justify-center shrink-0 mt-0.5"><svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M6 2.5v4M6 8.5h.01" stroke="#fbbf24" strokeWidth="1.7" strokeLinecap="round" /></svg></span><span className="text-sm text-zinc-300">{w}</span></li>))}</ul>
                    </div>
                  </div>
                  <details className="border border-zinc-800 rounded-xl">
                    <summary className="px-4 py-2.5 text-sm font-medium text-zinc-300 cursor-pointer select-none">{c.ai.detectedDetails}</summary>
                    <div className="px-4 pb-4 space-y-3">
                      <p className="text-[11px] text-zinc-500 leading-relaxed">{c.s2.editableHint}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div><label className={labelClass}>{c.s2.asset}</label><input value={form.asset} onChange={(e) => set({ asset: e.target.value })} className={inputClass} /></div>
                        <div><label className={labelClass}>{c.s2.timeframe}</label><select value={form.timeframe} onChange={(e) => set({ timeframe: e.target.value })} className={inputClass}>{TIMEFRAMES.map((tf) => (<option key={tf} value={tf}>{tf}</option>))}</select></div>
                        <div><label className={labelClass}>{c.s2.direction}</label><select value={form.direction} onChange={(e) => set({ direction: e.target.value })} className={inputClass}>{opt(DIRECTIONS, t.options.direction)}</select></div>
                        <div><label className={labelClass}>{c.s2.structure}</label><select value={form.market_trend} onChange={(e) => set({ market_trend: e.target.value })} className={inputClass}>{opt(MARKET_TRENDS, t.options.market_trend)}</select></div>
                        <div className="sm:col-span-2"><label className={labelClass}>{c.s2.setup}</label><select value={form.setup} onChange={(e) => set({ setup: e.target.value })} className={inputClass}>{opt(SETUPS, t.options.setup)}</select></div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {([["entry_price", c.s2.entry], ["stop_loss", c.s2.sl], ["take_profit", c.s2.tp], ["r_multiple", c.s2.rr]] as const).map(([k, label]) => (
                          <div key={k}><label className={labelClass}>{label}</label><input value={form[k]} onChange={(e) => set({ [k]: e.target.value })} inputMode="decimal" className={inputClass} /></div>
                        ))}
                      </div>
                    </div>
                  </details>
                </>
              )}
            </div>
          )}

          {/* ── SAISIE MANUELLE ── */}
          {step === "manual" && (
            <div className="space-y-6">
              <h2 className="text-base font-bold text-white">{c.manual.title}</h2>

              <div className="space-y-4">
                <BlockTitle>{c.manual.facts}</BlockTitle>
                <div id={`cf-field-asset`}>
                  <label className={labelClass}>{t.form.asset} *</label>
                  <input value={form.asset} onChange={(e) => set({ asset: e.target.value })} maxLength={40} placeholder={t.form.assetPlaceholder} className={inputClass + eb("asset")} />
                  {msg("asset")}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div id={`cf-field-direction`}>
                    <label className={labelClass}>{t.form.direction} *</label>
                    <select value={form.direction} onChange={(e) => set({ direction: e.target.value })} className={inputClass + eb("direction")}><option value="" disabled>{t.form.choose}</option>{opt(DIRECTIONS, t.options.direction)}</select>
                    {msg("direction")}
                  </div>
                  <div id={`cf-field-timeframe`}>
                    <label className={labelClass}>{t.form.timeframe} *</label>
                    <select value={form.timeframe} onChange={(e) => set({ timeframe: e.target.value })} className={inputClass + eb("timeframe")}><option value="" disabled>{t.form.choose}</option>{TIMEFRAMES.map((tf) => (<option key={tf} value={tf}>{tf}</option>))}</select>
                    {msg("timeframe")}
                  </div>
                  <div id={`cf-field-trade_type`}>
                    <label className={labelClass}>{t.form.tradeType} *</label>
                    <select value={form.trade_type} onChange={(e) => set({ trade_type: e.target.value })} className={inputClass + eb("trade_type")}><option value="" disabled>{t.form.choose}</option>{opt(TRADE_TYPES, t.options.trade_type)}</select>
                    {msg("trade_type")}
                  </div>
                  <div id={`cf-field-result`}>
                    <label className={labelClass}>{t.form.result} *</label>
                    <select value={form.result} onChange={(e) => set({ result: e.target.value })} className={inputClass + eb("result")}><option value="" disabled>{t.form.choose}</option>{opt(RESULTS, t.options.result)}</select>
                    {msg("result")}
                  </div>
                </div>
                <div>
                  <label className={labelClass}>{t.form.tradeDate} *</label>
                  <input type="datetime-local" value={form.trade_date} onChange={(e) => set({ trade_date: e.target.value })} className={`${inputClass} [color-scheme:dark]`} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className={labelClass}>{t.form.platform}</label><select value={form.platform} onChange={(e) => set({ platform: e.target.value })} className={inputClass}><option value="">—</option>{opt(PLATFORMS, t.options.platform)}</select></div>
                  <div id={`cf-field-setup`}>
                    <label className={labelClass}>{t.form.setup} *</label>
                    <select value={form.setup} onChange={(e) => set({ setup: e.target.value })} className={inputClass + eb("setup")}><option value="" disabled>{t.form.choose}</option>{opt(SETUPS, t.options.setup)}</select>
                    {msg("setup")}
                  </div>
                  <div><label className={labelClass}>{t.form.marketTrend}</label><select value={form.market_trend} onChange={(e) => set({ market_trend: e.target.value })} className={inputClass}><option value="">—</option>{opt(MARKET_TRENDS, t.options.market_trend)}</select></div>
                  <div><label className={labelClass}>{t.form.session}</label><select value={form.session} onChange={(e) => set({ session: e.target.value })} className={inputClass}><option value="">—</option>{opt(SESSIONS, t.options.session)}</select></div>
                </div>
              </div>

              <div className="space-y-4">
                <BlockTitle>{c.manual.risk}</BlockTitle>
                <div className="grid grid-cols-2 gap-3">
                  {([["entry_price", t.form.entryPrice], ["stop_loss", t.form.stopLoss], ["take_profit", t.form.takeProfit], ["risk_percent", t.form.riskPercent], ["r_multiple", t.form.rMultiple]] as const).map(([k, label]) => (
                    <div key={k}><label className={labelClass}>{label}</label><input value={form[k]} onChange={(e) => set({ [k]: e.target.value })} inputMode="decimal" className={inputClass} /></div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <BlockTitle>{c.manual.feeling}</BlockTitle>
                <div id={`cf-field-emotion_before`} className={errors.emotion_before ? "rounded-lg ring-1 ring-red-500/40 p-2 -m-2" : ""}>
                  <label className={labelClass}>{t.form.emotionBefore} *</label>
                  <ChipGroup values={EMOTIONS_BEFORE} labels={t.options.emotion_before} value={form.emotion_before} onChange={(v) => set({ emotion_before: v })} />
                  {msg("emotion_before")}
                </div>
                <div id={`cf-field-emotion_after`} className={errors.emotion_after ? "rounded-lg ring-1 ring-red-500/40 p-2 -m-2" : ""}>
                  <label className={labelClass}>{t.form.emotionAfter} *</label>
                  <ChipGroup values={EMOTIONS_AFTER} labels={t.options.emotion_after} value={form.emotion_after} onChange={(v) => set({ emotion_after: v })} />
                  {msg("emotion_after")}
                </div>
                <div id={`cf-field-followed_plan`} className={errors.followed_plan ? "rounded-lg ring-1 ring-red-500/40 p-2 -m-2" : ""}>
                  <label className={labelClass}>{t.form.followedPlan} *</label>
                  <ChipGroup values={FOLLOWED_PLAN} labels={t.options.followed_plan} value={form.followed_plan} onChange={(v) => set({ followed_plan: v })} />
                  {msg("followed_plan")}
                </div>
                <div><label className={labelClass}>{t.form.perceivedMistake} <span className="text-zinc-600">· {c.s3.optional}</span></label><select value={form.perceived_mistake} onChange={(e) => set({ perceived_mistake: e.target.value })} className={inputClass}><option value="">—</option>{opt(MAIN_MISTAKES, t.options.main_mistake)}</select></div>
                <div><label className={labelClass}>{t.form.userComment} <span className="text-zinc-600">· {c.s3.optional}</span></label><textarea rows={3} value={form.user_comment} onChange={(e) => set({ user_comment: e.target.value })} placeholder={t.form.userCommentPlaceholder} className={`${inputClass} resize-none`} /></div>
              </div>
            </div>
          )}

          {/* ── RESSENTI ── */}
          {step === "ressenti" && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-emerald-500/25 bg-gradient-to-b from-emerald-500/10 to-emerald-500/0 px-4 py-4">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-emerald-300 bg-emerald-500/15 border border-emerald-500/25 rounded-full px-2.5 py-1 mb-2.5">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 1.5l1.8 3.7 4 .6-2.9 2.8.7 4L8 10.7 4.4 12.6l.7-4L2.2 5.8l4-.6L8 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></svg>
                  {c.s3.aiCant}
                </span>
                <h2 className="text-lg font-bold text-white">{c.s3.title}</h2>
                <p className="text-sm text-zinc-400 mt-1">{c.s3.subtitle}</p>
              </div>
              <div id={`cf-field-result`} className={errors.result ? "rounded-lg ring-1 ring-red-500/40 p-2 -m-2" : ""}>
                <label className={labelClass}>{c.s3.result} *</label>
                <ChipGroup values={RESULTS} labels={t.options.result} value={form.result} onChange={(v) => set({ result: v })} />
                {msg("result")}
              </div>
              <div id={`cf-field-setup`}>
                <label className={labelClass}>{c.s3.strategy} *</label>
                <select value={form.setup} onChange={(e) => set({ setup: e.target.value })} className={inputClass + eb("setup")}><option value="">{t.form.choose}</option>{opt(SETUPS, t.options.setup)}</select>
                {msg("setup")}
              </div>
              <div id={`cf-field-emotion_before`} className={errors.emotion_before ? "rounded-lg ring-1 ring-red-500/40 p-2 -m-2" : ""}>
                <label className={labelClass}>{c.s3.emotionBefore} *</label>
                <ChipGroup values={EMOTIONS_BEFORE} labels={t.options.emotion_before} value={form.emotion_before} onChange={(v) => set({ emotion_before: v })} />
                {msg("emotion_before")}
              </div>
              <div id={`cf-field-emotion_after`} className={errors.emotion_after ? "rounded-lg ring-1 ring-red-500/40 p-2 -m-2" : ""}>
                <label className={labelClass}>{c.s3.emotionAfter} *</label>
                <ChipGroup values={EMOTIONS_AFTER} labels={t.options.emotion_after} value={form.emotion_after} onChange={(v) => set({ emotion_after: v })} />
                {msg("emotion_after")}
              </div>
              <div id={`cf-field-followed_plan`} className={errors.followed_plan ? "rounded-lg ring-1 ring-red-500/40 p-2 -m-2" : ""}>
                <label className={labelClass}>{c.s3.followedPlan} *</label>
                <ChipGroup values={FOLLOWED_PLAN} labels={t.options.followed_plan} value={form.followed_plan} onChange={(v) => set({ followed_plan: v })} />
                {msg("followed_plan")}
              </div>
              <div><label className={labelClass}>{c.s3.mistake} <span className="text-zinc-600">· {c.s3.optional}</span></label><select value={form.perceived_mistake} onChange={(e) => set({ perceived_mistake: e.target.value })} className={inputClass}><option value="">—</option>{opt(MAIN_MISTAKES, t.options.main_mistake)}</select></div>
              <div><label className={labelClass}>{c.s3.comment} <span className="text-zinc-600">· {c.s3.optional}</span></label><textarea rows={3} value={form.user_comment} onChange={(e) => set({ user_comment: e.target.value })} placeholder={c.s3.commentPlaceholder} className={`${inputClass} resize-none`} /></div>
            </div>
          )}

          {/* ── RÉSUMÉ ── */}
          {step === "summary" && (
            <div className="space-y-4">
              <div><h2 className="text-base font-bold text-white">{c.s4.title}</h2><p className="text-sm text-zinc-400">{c.s4.subtitle}</p></div>
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl} alt="capture" className="w-full rounded-xl border border-zinc-800 object-contain max-h-44 bg-black/30" />
              ) : (
                <div className="rounded-xl border border-dashed border-zinc-700 px-4 py-3 text-xs text-zinc-500 text-center">{c.s4.noCapture}</div>
              )}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4">
                <p className="text-[10px] uppercase tracking-wide text-zinc-500 mb-2">{c.manual.facts}</p>
                <p className="text-sm text-zinc-200 font-medium">{[form.asset, form.timeframe, labelOf(t.options.direction, form.direction), form.trade_type ? labelOf(t.options.trade_type, form.trade_type) : null, labelOf(t.options.setup, form.setup)].filter(Boolean).join(" · ")}</p>
                {(form.market_trend || form.session || form.result) && (
                  <p className="text-xs text-zinc-400 mt-1">{[form.result ? `${t.form.result}: ${labelOf(t.options.result, form.result)}` : null, form.market_trend ? labelOf(t.options.market_trend, form.market_trend) : null, form.session ? labelOf(t.options.session, form.session) : null].filter(Boolean).join(" · ")}</p>
                )}
              </div>
              {(form.entry_price || form.stop_loss || form.take_profit || form.risk_percent || form.r_multiple) && (
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4">
                  <p className="text-[10px] uppercase tracking-wide text-zinc-500 mb-2">{c.manual.risk}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-300 tabular-nums">
                    {form.entry_price && <span>{t.card.entry}: {form.entry_price}</span>}
                    {form.stop_loss && <span>{t.card.sl}: {form.stop_loss}</span>}
                    {form.take_profit && <span>{t.card.tp}: {form.take_profit}</span>}
                    {form.risk_percent && <span>{t.card.risk}: {form.risk_percent}%</span>}
                    {form.r_multiple && <span>{t.card.rMultiple}: {form.r_multiple}</span>}
                  </div>
                </div>
              )}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4">
                <p className="text-[10px] uppercase tracking-wide text-zinc-500 mb-2">{c.manual.feeling}</p>
                <div className="flex flex-wrap gap-2">
                  {form.emotion_before && <span className="text-[11px] text-zinc-300 bg-zinc-800/40 border border-zinc-700/50 rounded-full px-2.5 py-1">{t.card.emotionBefore}: {labelOf(t.options.emotion_before, form.emotion_before)}</span>}
                  {form.emotion_after && <span className="text-[11px] text-zinc-300 bg-zinc-800/40 border border-zinc-700/50 rounded-full px-2.5 py-1">{t.card.emotionAfter}: {labelOf(t.options.emotion_after, form.emotion_after)}</span>}
                  {form.followed_plan && <span className="text-[11px] text-zinc-300 bg-zinc-800/40 border border-zinc-700/50 rounded-full px-2.5 py-1">{t.card.plan}: {labelOf(t.options.followed_plan, form.followed_plan)}</span>}
                  {form.perceived_mistake && form.perceived_mistake !== "none" && <span className="text-[11px] text-amber-300 bg-amber-400/10 border border-amber-400/20 rounded-full px-2.5 py-1">{t.card.mistake}: {labelOf(t.options.main_mistake, form.perceived_mistake)}</span>}
                </div>
                {form.user_comment && <p className="text-sm text-zinc-300 mt-3 leading-relaxed">{form.user_comment}</p>}
              </div>
              {saveError && (<p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">{(t.errors as Record<string, string>)[saveError] ?? t.errors.generic}</p>)}
            </div>
          )}
        </div>

        {/* Pied : navigation */}
        <div className="flex items-center gap-3 px-5 py-4 border-t border-zinc-800/70 shrink-0">
          {idx > 0 ? (
            <button type="button" onClick={goBack} disabled={pending} className="px-4 py-2.5 text-sm font-medium text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded-xl transition-colors disabled:opacity-50">{c.back}</button>
          ) : (<span />)}
          <div className="flex-1" />
          {step === "analysis" && !analyzing && (<button type="button" onClick={() => setStep("ressenti")} className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-sm font-semibold rounded-xl transition-colors">{c.ai.addFeeling}</button>)}
          {step === "manual" && (<button type="button" onClick={() => validate(MANUAL_REQ) && setStep("summary")} className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-sm font-semibold rounded-xl transition-colors">{c.next}</button>)}
          {step === "ressenti" && (<button type="button" onClick={() => validate(RESSENTI_REQ) && setStep("summary")} className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-sm font-semibold rounded-xl transition-colors">{c.next}</button>)}
          {step === "summary" && (<button type="button" onClick={handleSave} disabled={pending} className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-zinc-950 text-sm font-semibold rounded-xl transition-colors">{pending ? c.s4.saving : c.s4.save}</button>)}
        </div>
      </div>
    </div>
  );
}
