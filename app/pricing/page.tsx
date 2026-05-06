import Link from "next/link";

const freeFeatures = [
  "Accès aux leçons débutant",
  "Introduction au trading",
  "Bases de la gestion du risque",
  "Quiz de validation basiques",
  "Accès à la communauté",
];

const premiumFeatures = [
  "Tout le contenu gratuit",
  "Formations ICT complètes",
  "Formations SMC complètes",
  "Price Action avancé",
  "Quiz & exercices sur graphiques",
  "Nouvelles leçons chaque semaine",
  "Support prioritaire",
];

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-emerald-400">
      <path
        d="M3 8l3.5 3.5L13 4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 py-20">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Un tarif simple et transparent
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Commence gratuitement, passe en premium quand tu veux progresser
            sérieusement.
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 flex flex-col">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-zinc-300 mb-1">Gratuit</h2>
              <div className="flex items-end gap-1 mb-3">
                <span className="text-5xl font-bold">0€</span>
                <span className="text-zinc-500 mb-2">/mois</span>
              </div>
              <p className="text-sm text-zinc-500">
                Pour découvrir le trading et les bases.
              </p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {freeFeatures.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-zinc-300">
                  <CheckIcon />
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href="/login"
              className="block text-center border border-zinc-700 hover:border-zinc-500 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              Commencer gratuitement
            </Link>
          </div>

          {/* Premium */}
          <div className="relative bg-zinc-900 border border-emerald-500/40 rounded-2xl p-8 flex flex-col">
            {/* Badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-emerald-500 text-zinc-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                Populaire
              </span>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white mb-1">Premium</h2>
              <div className="flex items-end gap-1 mb-3">
                <span className="text-5xl font-bold">49€</span>
                <span className="text-zinc-400 mb-2">/mois</span>
              </div>
              <p className="text-sm text-zinc-400">
                Accès complet pour progresser rapidement.
              </p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {premiumFeatures.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-zinc-200">
                  <CheckIcon />
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href="/login"
              className="block text-center bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              Commencer avec Premium
            </Link>
          </div>
        </div>

        {/* Guarantee */}
        <p className="text-center text-zinc-500 text-sm mt-10">
          Annulation à tout moment · Paiement sécurisé · Aucun engagement
        </p>
      </div>
    </main>
  );
}
