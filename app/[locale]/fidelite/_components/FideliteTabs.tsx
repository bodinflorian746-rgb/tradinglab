"use client";

// Bascule client entre les deux onglets de l'espace Fidélité : « Mes points »
// (actif par défaut) et « Rejoindre un groupe ». Le contenu des deux
// panneaux est fourni par le parent (Server Component) — ce composant ne
// fait que router l'affichage, aucune donnée n'est re-fetchée au clic.
// Fonctionne à l'identique sur desktop et mobile (simple groupe de boutons,
// pas de menu séparé à gérer).

import { useState, type ReactNode } from "react";
import { useDict } from "@/app/components/LocaleProvider";

type TabKey = "points" | "join";

export function FideliteTabs({
  pointsPanel,
  joinPanel,
}: {
  pointsPanel: ReactNode;
  joinPanel: ReactNode;
}) {
  const t = useDict("fidelite");
  const [active, setActive] = useState<TabKey>("points");

  const tabs: { key: TabKey; label: string }[] = [
    { key: "points", label: t.tabs.points },
    { key: "join", label: t.tabs.join },
  ];

  return (
    <div>
      <div
        role="tablist"
        aria-label={t.tabs.points}
        className="mb-8 flex flex-wrap gap-2 border-b border-zinc-800 pb-3"
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={active === tab.key}
            onClick={() => setActive(tab.key)}
            className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
              active === tab.key
                ? "bg-emerald-500/15 text-emerald-400"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" hidden={active !== "points"}>
        {pointsPanel}
      </div>
      <div role="tabpanel" hidden={active !== "join"}>
        {joinPanel}
      </div>
    </div>
  );
}
