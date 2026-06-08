import Link from "next/link";

type Locale = "fr" | "es";

function ChevronDown({ className = "" }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 transition-transform ${className}`}
    >
      <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type Card = {
  amount: string;
  brokerLabel: string;
  brokerName: string;
  bonus: string;
  cta: string;
  url: string;
};

const content: Record<
  Locale,
  {
    breadcrumbHome: string;
    breadcrumbCurrent: string;
    title: string;
    subtitle: string;
    chooseDepositTitle: string;
    cards: [Card, Card];
    reassurance: string;
    faqTitle: string;
    faqs: { q: string; a: string }[];
    riskNote: string;
  }
> = {
  fr: {
    breadcrumbHome: "Accueil",
    breadcrumbCurrent: "Accès via un broker",
    title: "Accède gratuitement à TradeScaleX",
    subtitle:
      "Choisis ton montant de dépôt, ouvre ton compte chez un broker partenaire, puis reçois ton accès gratuit.",
    chooseDepositTitle: "Quel montant veux-tu déposer ?",
    cards: [
      {
        amount: "Moins de 1 000 €",
        brokerLabel: "Broker recommandé",
        brokerName: "RaiseFX",
        bonus: "100 % de bonus de marge\nValable jusqu'à 2 000 € de dépôt",
        cta: "Choisir RaiseFX",
        url: "https://partners.raisefx.com/visit/?bta=168801&brand=raisefx",
      },
      {
        amount: "1 000 € ou plus",
        brokerLabel: "Broker recommandé",
        brokerName: "FXLift",
        bonus: "40 % de bonus tradable",
        cta: "Choisir FXLift",
        url: "https://go.fxlift.com/visit/?bta=35146&brand=fxlift",
      },
    ],
    reassurance:
      "Le dépôt reste sur ton compte broker. TradeScaleX ne reçoit pas tes fonds.",
    faqTitle: "Questions fréquentes",
    faqs: [
      {
        q: "Est-ce que l'accès TradeScaleX est vraiment gratuit ?",
        a: "Oui. Ton accès est offert après ouverture du compte et dépôt validé chez un broker partenaire.",
      },
      {
        q: "Est-ce que les brokers partenaires sont régulés ?",
        a: "Oui. Nous travaillons uniquement avec des brokers régulés.",
      },
      {
        q: "Est-ce que je peux récupérer mon argent à tout moment ?",
        a: "Oui. Ton dépôt reste sur ton compte broker. TradeScaleX ne reçoit jamais tes fonds.",
      },
      {
        q: "Quand est-ce que je reçois mon accès ?",
        a: "Une fois ton dépôt vérifié, ton accès est activé rapidement.",
      },
    ],
    riskNote:
      "Le trading comporte un risque de perte en capital. Les conditions de bonus sont fixées par le broker et peuvent évoluer.",
  },
  es: {
    breadcrumbHome: "Inicio",
    breadcrumbCurrent: "Acceso a través de un bróker",
    title: "Accede gratis a TradeScaleX",
    subtitle:
      "Elige tu cantidad de depósito, abre tu cuenta con un bróker asociado y recibe tu acceso gratuito.",
    chooseDepositTitle: "¿Qué cantidad quieres depositar?",
    cards: [
      {
        amount: "Menos de 1 000 €",
        brokerLabel: "Bróker recomendado",
        brokerName: "RaiseFX",
        bonus: "100 % de bono de margen\nVálido hasta 2 000 € de depósito",
        cta: "Elegir RaiseFX",
        url: "https://partners.raisefx.com/visit/?bta=168801&brand=raisefx",
      },
      {
        amount: "1 000 € o más",
        brokerLabel: "Bróker recomendado",
        brokerName: "FXLift",
        bonus: "40 % de bono tradable",
        cta: "Elegir FXLift",
        url: "https://go.fxlift.com/visit/?bta=35146&brand=fxlift",
      },
    ],
    reassurance:
      "El depósito permanece en tu cuenta de bróker. TradeScaleX no recibe tus fondos.",
    faqTitle: "Preguntas frecuentes",
    faqs: [
      {
        q: "¿El acceso a TradeScaleX es realmente gratuito?",
        a: "Sí. Tu acceso se ofrece después de abrir tu cuenta y validar tu depósito con un broker asociado.",
      },
      {
        q: "¿Los brokers asociados están regulados?",
        a: "Sí. Trabajamos únicamente con brokers regulados.",
      },
      {
        q: "¿Puedo retirar mi dinero en cualquier momento?",
        a: "Sí. Tu depósito permanece en tu cuenta del broker. TradeScaleX nunca recibe tus fondos.",
      },
      {
        q: "¿Cuándo recibo mi acceso?",
        a: "Una vez verificado tu depósito, tu acceso se activa rápidamente.",
      },
    ],
    riskNote:
      "El trading conlleva un riesgo de pérdida de capital. Las condiciones del bono las establece el bróker y pueden evolucionar.",
  },
};

export default async function BrokerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const lang: Locale = locale === "es" ? "es" : "fr";
  const t = content[lang];

  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 py-12 md:py-20">
      <div className="max-w-4xl mx-auto">

        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-zinc-500">
          <Link href={`/${lang}`} className="hover:text-zinc-300 transition-colors">
            {t.breadcrumbHome}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-300">{t.breadcrumbCurrent}</span>
        </nav>

        {/* Hero court */}
        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{t.title}</h1>
          <p className="mt-4 text-zinc-400 text-base md:text-lg max-w-2xl leading-relaxed">
            {t.subtitle}
          </p>
        </header>

        {/* Section principale : 2 grosses cartes cliquables */}
        <section className="mb-12">
          <h2 className="text-xl md:text-2xl font-bold mb-6">{t.chooseDepositTitle}</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {t.cards.map((c) => (
              <a
                key={c.brokerName}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col bg-zinc-900/60 border border-zinc-800 hover:border-emerald-500/40 rounded-2xl p-6 md:p-8 transition-colors"
              >
                <div className="text-2xl md:text-3xl font-bold text-white mb-4">{c.amount}</div>
                <div className="text-[11px] uppercase tracking-widest text-zinc-500 mb-1">
                  {c.brokerLabel}
                </div>
                <div className="text-lg font-semibold text-emerald-400 mb-4">{c.brokerName}</div>
                <p className="text-sm text-zinc-400 mb-6 leading-relaxed whitespace-pre-line flex-1">{c.bonus}</p>
                <span className="inline-flex items-center justify-center w-full rounded-xl bg-emerald-500 group-hover:bg-emerald-400 text-zinc-950 font-semibold py-3 transition-colors">
                  {c.cta}
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Réassurance courte */}
        <p className="text-sm text-zinc-400 text-center mb-12 max-w-2xl mx-auto leading-relaxed">
          {t.reassurance}
        </p>

        {/* Mini FAQ */}
        <section className="mb-12">
          <h2 className="text-xl md:text-2xl font-bold mb-6">{t.faqTitle}</h2>
          <div className="divide-y divide-zinc-800/60 bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden">
            {t.faqs.map((f) => (
              <details key={f.q} className="group">
                <summary className="px-5 md:px-6 py-4 cursor-pointer list-none flex items-center justify-between gap-4 text-sm font-semibold text-white hover:bg-zinc-900/40 transition-colors">
                  <span>{f.q}</span>
                  <ChevronDown className="text-zinc-500 group-open:rotate-180 group-open:text-emerald-400" />
                </summary>
                <div className="px-5 md:px-6 pb-5 text-sm text-zinc-400 leading-relaxed">{f.a}</div>
              </details>
            ))}
          </div>
        </section>

        {/* Risk note */}
        <p className="text-xs text-zinc-500 leading-relaxed">{t.riskNote}</p>
      </div>
    </main>
  );
}
