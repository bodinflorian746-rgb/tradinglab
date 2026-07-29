"use client";

// Bouton copier générique — même comportement que le pattern déjà utilisé dans
// admin/codes/CodesAdmin.tsx (navigator.clipboard, feedback temporaire).

import { useState } from "react";

export function CopyButton({
  value,
  label,
  copiedLabel,
  className,
}: {
  value: string;
  label: string;
  copiedLabel: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard indisponible (http non sécurisé) : on ignore silencieusement
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={
        className ??
        "rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-emerald-500/50 hover:text-emerald-400"
      }
    >
      {copied ? copiedLabel : label}
    </button>
  );
}
