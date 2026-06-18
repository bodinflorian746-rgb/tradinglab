"use client";

// Bouton "Ajouter un trade" + modale avec formulaire en 5 sections accordéon.
// Mobile-first : seule la section "Essentiel" est ouverte par défaut, les
// autres sont repliées (on n'affiche jamais un formulaire géant d'un coup).
// Le formulaire appelle la Server Action createTradeEntry via useTransition.

import {
  useEffect,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from "react";
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
  EMOTIONS_DURING,
  EMOTIONS_AFTER,
} from "@/lib/journal/types";
import { createTradeEntry, type CreateTradeState } from "../actions";
import { CaptureFirstFlow } from "./CaptureFirstFlow";

const INITIAL: CreateTradeState = { ok: false };

// V0.2 — bascule capture-first. true = nouveau flux par capture (Wizard-of-Oz),
// false = ancien formulaire à accordéons (conservé pour comparer les 2 UX).
const USE_CAPTURE_FIRST = true;

const inputClass =
  "w-full bg-zinc-900/70 border border-zinc-700/70 focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none transition-colors";
const labelClass = "block text-xs font-medium text-zinc-400 mb-1.5";

// Valeur par défaut pour <input type="datetime-local"> = maintenant (heure locale).
function nowLocalValue(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// Génère les <option> d'un select à partir d'une liste de clés + labels localisés.
function options(values: readonly string[], labels: Record<string, string>) {
  return values.map((v) => (
    <option key={v} value={v}>
      {labels[v] ?? v}
    </option>
  ));
}

// Section accordéon (définie hors composant → pas de remount à chaque frappe).
function Section({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="border border-zinc-800 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-zinc-900/60 hover:bg-zinc-900/80 transition-colors text-left"
      >
        <span className="text-sm font-semibold text-white">{title}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className={`text-zinc-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {isOpen && <div className="px-4 py-4 space-y-4">{children}</div>}
    </div>
  );
}

type SectionId = "essential" | "setup" | "risk" | "psychology" | "notes";

export function AddTradeButton({ variant }: { variant: "primary" | "empty" }) {
  const t = useDict("journal");
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<CreateTradeState>(INITIAL);
  const [pending, startTransition] = useTransition();
  const [openSections, setOpenSections] = useState<Record<SectionId, boolean>>({
    essential: true,
    setup: false,
    risk: false,
    psychology: false,
    notes: false,
  });
  const [preview, setPreview] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function toggleSection(id: SectionId) {
    setOpenSections((s) => ({ ...s, [id]: !s[id] }));
  }

  function resetForm() {
    setState(INITIAL);
    setOpen(false);
    setOpenSections({
      essential: true,
      setup: false,
      risk: false,
      psychology: false,
      notes: false,
    });
    setPreview(null);
    formRef.current?.reset();
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await createTradeEntry(state, formData);
      if (res.ok) {
        resetForm();
      } else {
        setState(res);
        // Si une erreur concerne un champ non-essentiel, ouvrir sa section.
        if (res.errors) {
          const keys = Object.keys(res.errors);
          setOpenSections((s) => ({
            ...s,
            setup: s.setup || keys.includes("screenshot"),
            risk:
              s.risk ||
              keys.some((k) =>
                [
                  "account_capital",
                  "entry_price",
                  "stop_loss",
                  "take_profit",
                  "risk_percent",
                  "risk_amount",
                  "r_multiple",
                  "fees",
                ].includes(k),
              ),
          }));
        }
      }
    });
  }

  // Verrou de scroll du body quand la modale est ouverte.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const errors = state.errors ?? {};
  const err = (field: string) => {
    const code = errors[field];
    return code ? (t.errors as Record<string, string>)[code] ?? code : null;
  };
  const fieldError = (field: string) =>
    err(field) ? <p className="mt-1 text-xs text-red-400">{err(field)}</p> : null;

  const triggerClass =
    variant === "primary"
      ? "inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shrink-0"
      : "inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-sm font-semibold px-5 py-3 rounded-xl transition-colors";

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={triggerClass}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        {variant === "primary" ? t.addTrade : t.empty.cta}
      </button>

      {/* V0.2 : nouveau flux capture-first */}
      {open && USE_CAPTURE_FIRST && (
        <CaptureFirstFlow onClose={() => setOpen(false)} />
      )}

      {/* Ancien formulaire à accordéons (conservé derrière le flag) */}
      {open && !USE_CAPTURE_FIRST && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={t.form.title}
          onClick={(e) => {
            if (e.target === e.currentTarget && !pending) setOpen(false);
          }}
        >
          <div className="app-bg w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl border border-zinc-800 bg-zinc-950 max-h-[92vh] overflow-y-auto">
            {/* En-tête modale */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b border-zinc-800/70 bg-zinc-950/95 backdrop-blur">
              <h2 className="text-base font-semibold text-white">{t.form.title}</h2>
              <button
                type="button"
                onClick={() => !pending && setOpen(false)}
                aria-label={t.form.cancel}
                className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <path d="M5 5l10 10M15 5l-10 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="px-5 py-5 space-y-3">
              {/* ── Section 1 — Essentiel ── */}
              <Section
                title={t.form.sections.essential}
                isOpen={openSections.essential}
                onToggle={() => toggleSection("essential")}
              >
                <div>
                  <label htmlFor="asset" className={labelClass}>
                    {t.form.asset} *
                  </label>
                  <input
                    id="asset"
                    name="asset"
                    type="text"
                    required
                    maxLength={40}
                    placeholder={t.form.assetPlaceholder}
                    className={inputClass}
                  />
                  {fieldError("asset")}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="direction" className={labelClass}>
                      {t.form.direction} *
                    </label>
                    <select id="direction" name="direction" required defaultValue="" className={inputClass}>
                      <option value="" disabled>
                        {t.form.choose}
                      </option>
                      {options(DIRECTIONS, t.options.direction)}
                    </select>
                    {fieldError("direction")}
                  </div>
                  <div>
                    <label htmlFor="timeframe" className={labelClass}>
                      {t.form.timeframe} *
                    </label>
                    <select id="timeframe" name="timeframe" required defaultValue="" className={inputClass}>
                      <option value="" disabled>
                        {t.form.choose}
                      </option>
                      {TIMEFRAMES.map((tf) => (
                        <option key={tf} value={tf}>
                          {tf}
                        </option>
                      ))}
                    </select>
                    {fieldError("timeframe")}
                  </div>
                  <div>
                    <label htmlFor="trade_type" className={labelClass}>
                      {t.form.tradeType} *
                    </label>
                    <select id="trade_type" name="trade_type" required defaultValue="" className={inputClass}>
                      <option value="" disabled>
                        {t.form.choose}
                      </option>
                      {options(TRADE_TYPES, t.options.trade_type)}
                    </select>
                    {fieldError("trade_type")}
                  </div>
                  <div>
                    <label htmlFor="result" className={labelClass}>
                      {t.form.result} *
                    </label>
                    <select id="result" name="result" required defaultValue="" className={inputClass}>
                      <option value="" disabled>
                        {t.form.choose}
                      </option>
                      {options(RESULTS, t.options.result)}
                    </select>
                    {fieldError("result")}
                  </div>
                </div>

                <div>
                  <label htmlFor="trade_date" className={labelClass}>
                    {t.form.tradeDate} *
                  </label>
                  <input
                    id="trade_date"
                    name="trade_date"
                    type="datetime-local"
                    required
                    defaultValue={nowLocalValue()}
                    className={`${inputClass} [color-scheme:dark]`}
                  />
                  {fieldError("trade_date")}
                </div>
              </Section>

              {/* ── Section 2 — Analyse du setup ── */}
              <Section
                title={t.form.sections.setup}
                isOpen={openSections.setup}
                onToggle={() => toggleSection("setup")}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="platform" className={labelClass}>
                      {t.form.platform}
                    </label>
                    <select id="platform" name="platform" defaultValue="" className={inputClass}>
                      <option value="">—</option>
                      {options(PLATFORMS, t.options.platform)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="setup" className={labelClass}>
                      {t.form.setup}
                    </label>
                    <select id="setup" name="setup" defaultValue="" className={inputClass}>
                      <option value="">—</option>
                      {options(SETUPS, t.options.setup)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="market_trend" className={labelClass}>
                      {t.form.marketTrend}
                    </label>
                    <select id="market_trend" name="market_trend" defaultValue="" className={inputClass}>
                      <option value="">—</option>
                      {options(MARKET_TRENDS, t.options.market_trend)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="session" className={labelClass}>
                      {t.form.session}
                    </label>
                    <select id="session" name="session" defaultValue="" className={inputClass}>
                      <option value="">—</option>
                      {options(SESSIONS, t.options.session)}
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="entry_reason" className={labelClass}>
                    {t.form.entryReason}
                  </label>
                  <input
                    id="entry_reason"
                    name="entry_reason"
                    type="text"
                    placeholder={t.form.entryReasonPlaceholder}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="exit_reason" className={labelClass}>
                    {t.form.exitReason}
                  </label>
                  <input
                    id="exit_reason"
                    name="exit_reason"
                    type="text"
                    placeholder={t.form.exitReasonPlaceholder}
                    className={inputClass}
                  />
                </div>
              </Section>

              {/* ── Section 3 — Gestion du risque ── */}
              <Section
                title={t.form.sections.risk}
                isOpen={openSections.risk}
                onToggle={() => toggleSection("risk")}
              >
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: "account_capital", label: t.form.accountCapital },
                    { name: "entry_price", label: t.form.entryPrice },
                    { name: "stop_loss", label: t.form.stopLoss },
                    { name: "take_profit", label: t.form.takeProfit },
                    { name: "risk_percent", label: t.form.riskPercent },
                    { name: "risk_amount", label: t.form.riskAmount },
                    { name: "r_multiple", label: t.form.rMultiple },
                    { name: "fees", label: t.form.fees },
                  ].map((f) => (
                    <div key={f.name}>
                      <label htmlFor={f.name} className={labelClass}>
                        {f.label}
                      </label>
                      <input id={f.name} name={f.name} type="text" inputMode="decimal" className={inputClass} />
                      {fieldError(f.name)}
                    </div>
                  ))}
                </div>
              </Section>

              {/* ── Section 4 — Psychologie ── */}
              <Section
                title={t.form.sections.psychology}
                isOpen={openSections.psychology}
                onToggle={() => toggleSection("psychology")}
              >
                <div>
                  <label htmlFor="followed_plan" className={labelClass}>
                    {t.form.followedPlan}
                  </label>
                  <select id="followed_plan" name="followed_plan" defaultValue="" className={inputClass}>
                    <option value="">—</option>
                    {options(FOLLOWED_PLAN, t.options.followed_plan)}
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label htmlFor="emotion_before" className={labelClass}>
                      {t.form.emotionBefore}
                    </label>
                    <select id="emotion_before" name="emotion_before" defaultValue="" className={inputClass}>
                      <option value="">—</option>
                      {options(EMOTIONS_BEFORE, t.options.emotion_before)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="emotion_during" className={labelClass}>
                      {t.form.emotionDuring}
                    </label>
                    <select id="emotion_during" name="emotion_during" defaultValue="" className={inputClass}>
                      <option value="">—</option>
                      {options(EMOTIONS_DURING, t.options.emotion_during)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="emotion_after" className={labelClass}>
                      {t.form.emotionAfter}
                    </label>
                    <select id="emotion_after" name="emotion_after" defaultValue="" className={inputClass}>
                      <option value="">—</option>
                      {options(EMOTIONS_AFTER, t.options.emotion_after)}
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="perceived_mistake" className={labelClass}>
                    {t.form.perceivedMistake}
                  </label>
                  <select id="perceived_mistake" name="perceived_mistake" defaultValue="" className={inputClass}>
                    <option value="">—</option>
                    {options(MAIN_MISTAKES, t.options.main_mistake)}
                  </select>
                </div>
              </Section>

              {/* ── Section 5 — Notes & capture ── */}
              <Section
                title={t.form.sections.notes}
                isOpen={openSections.notes}
                onToggle={() => toggleSection("notes")}
              >
                <div>
                  <label htmlFor="user_comment" className={labelClass}>
                    {t.form.userComment}
                  </label>
                  <textarea
                    id="user_comment"
                    name="user_comment"
                    rows={3}
                    placeholder={t.form.userCommentPlaceholder}
                    className={`${inputClass} resize-none`}
                  />
                </div>
                <div>
                  <label htmlFor="screenshot" className={labelClass}>
                    {t.form.screenshot}
                  </label>
                  <input
                    id="screenshot"
                    name="screenshot"
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      setPreview(f ? URL.createObjectURL(f) : null);
                    }}
                    className="block w-full text-xs text-zinc-400 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-800 file:px-3 file:py-2 file:text-zinc-200 file:text-xs hover:file:bg-zinc-700 file:cursor-pointer"
                  />
                  <p className="mt-1 text-[11px] text-zinc-500">{t.form.screenshotHint}</p>
                  {fieldError("screenshot")}
                  {preview && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={preview}
                      alt="preview"
                      className="mt-3 w-full rounded-xl border border-zinc-800 object-cover max-h-48"
                    />
                  )}
                </div>
              </Section>

              {/* Erreur globale */}
              {state.error && (
                <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
                  {(t.errors as Record<string, string>)[state.error] ?? t.errors.generic}
                </p>
              )}
              {!state.error && state.errors && (
                <p className="text-xs text-red-400">{t.form.fixErrors}</p>
              )}

              {/* Disclaimer IA */}
              <p className="text-[11px] text-zinc-500 leading-relaxed">{t.ai.disclaimer}</p>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => !pending && setOpen(false)}
                  className="flex-1 border border-zinc-700 hover:border-zinc-500 text-zinc-200 text-sm font-medium py-2.5 rounded-xl transition-colors"
                >
                  {t.form.cancel}
                </button>
                <button
                  type="submit"
                  disabled={pending}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed text-zinc-950 text-sm font-semibold py-2.5 rounded-xl transition-colors"
                >
                  {pending ? t.form.submitting : t.form.submit}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
