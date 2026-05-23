export default function ZoneVsLineDiagram({ className = "", locale = "fr" }: { className?: string; locale?: "fr" | "es" }) {
  const L = locale === "es"
    ? {
        title: "Nivel = zona, no línea",
        linePrecise: "✗ Línea demasiado precisa",
        depasse: "↑ sobrepasa",
        linePreciseDesc1: "Mechas repetidas hacen creer en",
        linePreciseDesc2: "una ruptura que no existe",
        zoneGood: "✓ Zona bien dibujada",
        absorbe: "absorbido",
        zoneGoodDesc1: "La zona absorbe las mechas",
        zoneGoodDesc2: "naturales del mercado",
        lineLabel: "Línea 1.1750",
        zoneLabel: "Zona 1.1740-1.1760",
        footer: "Un nivel institucional es una zona de 15-20 pips, no una línea precisa",
        mobTitle: "Zona vs Línea precisa",
        mobLine: "✗ Línea demasiado precisa",
        mobLineDesc: "El precio sobrepasa unos pips y cae → SL tocado aunque el nivel se mantuvo.",
        mobZone: "✓ Zona (15-20 pips)",
        mobZoneDesc: "Las mechas son absorbidas en la zona → trade válido mientras el cierre permanezca dentro.",
        mobFooter: "Un nivel institucional = zona, no línea precisa.",
      }
    : {
        title: "Niveau = zone, pas ligne",
        linePrecise: "✗ Ligne trop précise",
        depasse: "↑ dépasse",
        linePreciseDesc1: "Mèches répétées font croire à",
        linePreciseDesc2: "une cassure qui n'existe pas",
        zoneGood: "✓ Zone bien dessinée",
        absorbe: "absorbé",
        zoneGoodDesc1: "La zone absorbe les wicks",
        zoneGoodDesc2: "naturels du marché",
        lineLabel: "Ligne 1.1750",
        zoneLabel: "Zone 1.1740-1.1760",
        footer: "Un niveau institutionnel est une zone de 15-20 pips, pas une ligne précise",
        mobTitle: "Zone vs Ligne précise",
        mobLine: "✗ Ligne trop précise",
        mobLineDesc: "Le prix dépasse de quelques pips et retombe → SL touché alors que le niveau a tenu.",
        mobZone: "✓ Zone (15-20 pips)",
        mobZoneDesc: "Les mèches sont absorbées dans la zone → trade valide tant que la clôture reste à l'intérieur.",
        mobFooter: "Un niveau institutionnel = zone, pas ligne précise.",
      };
  return (
    <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 400"
      className="hidden sm:block w-full h-auto"
    >
      <text x="400" y="22" fill="#d4d4d8" fontSize="13" fontWeight="600" textAnchor="middle">
        {L.title}
      </text>

      <line x1="400" y1="40" x2="400" y2="370" stroke="#3f3f46" strokeWidth="1" />

      {/* ═══ PANEL GAUCHE — Ligne précise (KO) ═══ */}
      <rect x="60" y="50" width="280" height="22" rx="11" fill="#ef444420" stroke="#ef4444" strokeWidth="1" />
      <text x="200" y="65" fill="#ef4444" fontSize="10" fontWeight="600" textAnchor="middle">{L.linePrecise}</text>

      {/* Ligne fine pointillée */}
      <line x1="50" y1="200" x2="380" y2="200" stroke="#a1a1aa" strokeWidth="1" strokeDasharray="3 2" />

      {/* Path prix avec mèches qui dépassent légèrement la ligne (3 touches) */}
      {/* Bougie 1 : mèche dépasse vers le haut */}
      <line x1="110" y1="180" x2="110" y2="240" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="103" y="205" width="14" height="30" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />

      {/* Bougie 2 : mèche dépasse */}
      <line x1="180" y1="175" x2="180" y2="235" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="173" y="205" width="14" height="25" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />

      {/* Bougie 3 : mèche dépasse */}
      <line x1="250" y1="170" x2="250" y2="245" stroke="#059669" strokeWidth="1.5" />
      <rect x="243" y="210" width="14" height="30" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />

      {/* Annotations "mèche dépasse" — décalées verticalement pour éviter chevauchement */}
      <text x="110" y="120" fill="#ef4444" fontSize="8" textAnchor="middle">{L.depasse}</text>
      <text x="180" y="110" fill="#ef4444" fontSize="8" textAnchor="middle">{L.depasse}</text>
      <text x="250" y="125" fill="#ef4444" fontSize="8" textAnchor="middle">{L.depasse}</text>

      <text x="200" y="335" fill="#a1a1aa" fontSize="8" textAnchor="middle">{L.linePreciseDesc1}</text>
      <text x="200" y="350" fill="#a1a1aa" fontSize="8" textAnchor="middle">{L.linePreciseDesc2}</text>

      {/* ═══ PANEL DROIT — Zone épaisse (OK) ═══ */}
      <rect x="460" y="50" width="280" height="22" rx="11" fill="#10b98120" stroke="#10b981" strokeWidth="1" />
      <text x="600" y="65" fill="#10b981" fontSize="10" fontWeight="600" textAnchor="middle">{L.zoneGood}</text>

      {/* Zone : rectangle emerald translucide entre y=190 et y=210 */}
      <rect x="450" y="190" width="330" height="20" fill="#10b98120" stroke="#10b981" strokeWidth="1" strokeDasharray="3 2" />

      {/* Path prix avec mèches qui restent DANS la zone */}
      <line x1="510" y1="195" x2="510" y2="240" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="503" y="208" width="14" height="25" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />

      <line x1="580" y1="192" x2="580" y2="235" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="573" y="208" width="14" height="22" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />

      <line x1="650" y1="198" x2="650" y2="245" stroke="#059669" strokeWidth="1.5" />
      <rect x="643" y="208" width="14" height="32" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />

      <text x="600" y="335" fill="#a1a1aa" fontSize="8" textAnchor="middle">{L.zoneGoodDesc1}</text>
      <text x="600" y="350" fill="#a1a1aa" fontSize="8" textAnchor="middle">{L.zoneGoodDesc2}</text>

      {/* Labels de niveau avec halos opaques placés en fin de svg */}
      <rect x="51" y="184" width="80" height="14" fill="#09090b" rx="3" />
      <text x="55" y="195" fill="#a1a1aa" fontSize="9" fontWeight="600">{L.lineLabel}</text>
      <rect x="451" y="174" width="122" height="14" fill="#09090b" rx="3" />
      <text x="455" y="185" fill="#10b981" fontSize="9" fontWeight="600">{L.zoneLabel}</text>

      {/* Labels "absorbé" replacés APRÈS le halo Zone pour rester au-dessus */}
      <text x="510" y="160" fill="#10b981" fontSize="8" textAnchor="middle">{L.absorbe}</text>
      <text x="580" y="160" fill="#10b981" fontSize="8" textAnchor="middle">{L.absorbe}</text>
      <text x="650" y="160" fill="#10b981" fontSize="8" textAnchor="middle">{L.absorbe}</text>

      <text x="400" y="385" fill="#a1a1aa" fontSize="9" textAnchor="middle">
        {L.footer}
      </text>
    </svg>

    {/* MOBILE : ligne vs zone ─────────────────────────────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2.5">
      <p className="text-[14px] font-bold text-white text-center">{L.mobTitle}</p>
      <div className="rounded-lg border border-red-500/40 bg-red-500/8 p-3">
        <p className="text-[13px] font-bold text-red-400">{L.mobLine}</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">{L.mobLineDesc}</p>
      </div>
      <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/8 p-3">
        <p className="text-[13px] font-bold text-emerald-400">{L.mobZone}</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">{L.mobZoneDesc}</p>
      </div>
      <p className="text-[13px] text-emerald-400 font-bold text-center pt-2 border-t border-zinc-800 leading-snug">
        {L.mobFooter}
      </p>
    </div>
    </div>
  );
}
