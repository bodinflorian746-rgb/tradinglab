import Link from "next/link";

type Locale = "fr" | "es" | "en";

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
    sectionTitle: string;
    card: Card;
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
      "Ouvre ton compte chez notre broker partenaire, puis reçois ton accès gratuit.",
    sectionTitle: "Notre broker partenaire",
    card: {
      brokerLabel: "Broker partenaire",
      brokerName: "RaiseFX",
      bonus: "100 % de bonus de marge\nValable jusqu'à 2 000 € de dépôt",
      cta: "Ouvrir un compte RaiseFX",
      url: "https://partners.raisefx.com/visit/?bta=168801&brand=raisefx",
    },
    reassurance:
      "Le dépôt reste sur ton compte broker. TradeScaleX ne reçoit pas tes fonds.",
    faqTitle: "Questions fréquentes",
    faqs: [
      {
        q: "Est-ce que l'accès TradeScaleX est vraiment gratuit ?",
        a: "Oui. Ton accès est offert après ouverture du compte et dépôt validé chez un broker partenaire.",
      },
      {
        q: "Mon dépôt est-il en sécurité ?",
        a: "Ton dépôt reste sur ton compte broker personnel. TradeScaleX ne reçoit jamais tes fonds et n'a aucun accès à ton capital. Nous avons sélectionné nos brokers partenaires pour leur fiabilité opérationnelle et leurs conditions de trading.",
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
      "Abre tu cuenta con nuestro bróker asociado y recibe tu acceso gratuito.",
    sectionTitle: "Nuestro bróker asociado",
    card: {
      brokerLabel: "Bróker asociado",
      brokerName: "RaiseFX",
      bonus: "100 % de bono de margen\nVálido hasta 2 000 € de depósito",
      cta: "Abrir una cuenta en RaiseFX",
      url: "https://partners.raisefx.com/visit/?bta=168801&brand=raisefx",
    },
    reassurance:
      "El depósito permanece en tu cuenta de bróker. TradeScaleX no recibe tus fondos.",
    faqTitle: "Preguntas frecuentes",
    faqs: [
      {
        q: "¿El acceso a TradeScaleX es realmente gratuito?",
        a: "Sí. Tu acceso se ofrece después de abrir tu cuenta y validar tu depósito con un broker asociado.",
      },
      {
        q: "¿Mi depósito está seguro?",
        a: "Tu depósito permanece en tu cuenta de broker personal. TradeScaleX nunca recibe tus fondos ni tiene acceso a tu capital. Hemos seleccionado nuestros brokers asociados por su fiabilidad operativa y sus condiciones de trading.",
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
  en: {
    breadcrumbHome: "Home",
    breadcrumbCurrent: "Access via a broker",
    title: "Get free access to TradeScaleX",
    subtitle:
      "Open your account with our partner broker, then receive your free access.",
    sectionTitle: "Our partner broker",
    card: {
      brokerLabel: "Partner broker",
      brokerName: "RaiseFX",
      bonus: "100% margin bonus\nValid up to €2,000 deposit",
      cta: "Open a RaiseFX account",
      url: "https://partners.raisefx.com/visit/?bta=168801&brand=raisefx",
    },
    reassurance:
      "The deposit stays in your broker account. TradeScaleX does not receive your funds.",
    faqTitle: "Frequently asked questions",
    faqs: [
      {
        q: "Is TradeScaleX access really free?",
        a: "Yes. Your access is granted after opening your account and validating your deposit with a partner broker.",
      },
      {
        q: "Is my deposit safe?",
        a: "Your deposit stays in your personal broker account. TradeScaleX never receives your funds and has no access to your capital. We selected our partner brokers for their operational reliability and trading conditions.",
      },
      {
        q: "Can I withdraw my money at any time?",
        a: "Yes. Your deposit stays in your broker account. TradeScaleX never receives your funds.",
      },
      {
        q: "When do I receive my access?",
        a: "Once your deposit is verified, your access is activated quickly.",
      },
    ],
    riskNote:
      "Trading involves a risk of capital loss. Bonus conditions are set by the broker and may change.",
  },
};

export default async function BrokerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const lang: Locale = locale === "es" ? "es" : locale === "en" ? "en" : "fr";
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

        {/* Section principale : carte broker unique */}
        <section className="mb-12">
          <h2 className="text-xl md:text-2xl font-bold mb-6">{t.sectionTitle}</h2>
          <div className="max-w-md mx-auto">
            <a
              href={t.card.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col bg-zinc-900/60 border border-zinc-800 hover:border-emerald-500/40 rounded-2xl p-6 md:p-8 transition-colors"
            >
              <div className="text-[11px] uppercase tracking-widest text-zinc-500 mb-2">
                {t.card.brokerLabel}
              </div>
              <div className="text-2xl md:text-3xl font-semibold text-emerald-400 mb-5">{t.card.brokerName}</div>
              <p className="text-sm text-zinc-400 mb-6 leading-relaxed whitespace-pre-line">{t.card.bonus}</p>
              <span className="inline-flex items-center justify-center w-full rounded-xl bg-emerald-500 group-hover:bg-emerald-400 text-zinc-950 font-semibold py-3 transition-colors">
                {t.card.cta}
              </span>
            </a>
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
