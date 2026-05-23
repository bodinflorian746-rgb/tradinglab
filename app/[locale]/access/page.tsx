"use client";

import { useState } from "react";
import { useDict } from "@/app/components/LocaleProvider";

export default function AccessPage() {
  const [code, setCode] = useState("");
  const t = useDict("access");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 py-12 md:py-20 flex items-start justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            {t.title}
          </h1>
          <p className="text-zinc-400 text-base">
            {t.subtitle}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8"
        >
          <label
            htmlFor="access-code"
            className="block text-sm font-medium text-zinc-300 mb-2"
          >
            {t.label}
          </label>
          <input
            id="access-code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={t.placeholder}
            autoComplete="off"
            spellCheck={false}
            className="w-full bg-zinc-950 border border-zinc-700 focus:border-emerald-500 focus:outline-none rounded-xl px-4 py-3 text-white placeholder-zinc-600 text-sm mb-5 transition-colors tracking-wider"
          />
          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold py-3 rounded-xl transition-colors text-sm"
          >
            {t.submit}
          </button>
          <p className="text-xs text-zinc-500 text-center mt-5">
            {t.comingSoon}
          </p>
        </form>
      </div>
    </main>
  );
}
