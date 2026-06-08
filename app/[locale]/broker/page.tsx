import Image from "next/image";
import Link from "next/link";

type Locale = "fr" | "es";
type BrokerId = "raisefx" | "fxlift";

function Check({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className={`shrink-0 ${className}`}>
      <path d="M3 7l3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Cross({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className={`shrink-0 ${className}`}>
      <path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDown({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className={`shrink-0 transition-transform ${className}`}>
      <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type BonusBullet = { kind: "pro" | "con"; label: string };
type DepositCard = { amount: string; brokerId: BrokerId; brokerName: string; desc: string };

const BROKER_LOGOS: Record<BrokerId, { src: string; alt: string; width: number; height: number }> = {
  raisefx: { src: "/brokers/raisefx.png", alt: "RaiseFX", width: 120, height: 32 },
  fxlift:  { src: "/brokers/fxlift.png",  alt: "FXLift",  width: 120, height: 32 },
};

const content: Record<
  Locale,
  {
    breadcrumbHome: string;
    breadcrumbCurrent: string;
    title: string;
    subtitle: string;
    unlockTitle: string;
    unlockSubtitle: string;
    features: string[];
    stepsTitle: string;
    steps: string[];
    bonusEduTitle: string;
    bonusEduIntro: string;
    bonusProtectionHeader: string;
    bonusProtectionBullets: BonusBullet[];
    bonusMarginHeader: string;
    bonusMarginBullets: BonusBullet[];
    depositTitle: string;
    depositRecLabel: string;
    depositCards: DepositCard[];
    brokersTitle: string;
    brokersSubtitle: string;
    idealFor: string;
    bonusLabel: string;
    cta: string;
    faqTitle: string;
    faqs: { q: string; a: string }[];
    riskNote: string;
  }
> = {
  fr: {
    breadcrumbHome: "Accueil",
    breadcrumbCurrent: "Accès via un broker",
    title: "Accède gratuitement via un broker partenaire",
    subtitle:
      "Ouvre un compte chez l'un de nos brokers partenaires, effectue ton dépôt, et débloque ton accès complet à TradeScaleX — sans abonnement mensuel.",
    unlockTitle: "Ce que tu débloques",
    unlockSubtitle:
      "Même contenu que l'accès direct à 19 €/mois. Aucune limite, aucune option payante en plus.",
    features: [
      "Toutes les formations",
      "Toutes les stratégies",
      "Tous les jeux pédagogiques",
      "Mises à jour incluses",
      "Accès complet à TradeScaleX",
    ],
    stepsTitle: "Comment ça marche",
    steps: [
      "Ouvre un compte via l'un des brokers partenaires ci-dessous.",
      "Effectue ton dépôt initial sur ton compte broker.",
      "Une fois ton dépôt vérifié, tu reçois ton code d'accès gratuit à TradeScaleX.",
    ],
    bonusEduTitle: "Comprendre les 2 types de bonus",
    bonusEduIntro: "Avant de choisir un broker, voici la différence concrète entre leur bonus.",
    bonusProtectionHeader: "Bonus de protection",
    bonusProtectionBullets: [
      { kind: "pro", label: "Peut absorber une partie des pertes selon les conditions du broker" },
      { kind: "pro", label: "Plus rassurant pour certains profils" },
      { kind: "pro", label: "Offre également de la marge supplémentaire" },
    ],
    bonusMarginHeader: "Bonus de marge",
    bonusMarginBullets: [
      { kind: "pro", label: "Davantage de marge disponible" },
      { kind: "pro", label: "Plus de flexibilité dans la gestion des positions" },
      { kind: "con", label: "Ne couvre pas les pertes" },
    ],
    depositTitle: "Quel montant prévois-tu de déposer ?",
    depositRecLabel: "Broker recommandé",
    depositCards: [
      {
        amount: "Moins de 1 000 €",
        brokerId: "raisefx",
        brokerName: "RaiseFX",
        desc: "Idéal si tu veux un bonus de marge plus généreux sur un petit ou moyen dépôt.",
      },
      {
        amount: "1 000 € ou plus",
        brokerId: "fxlift",
        brokerName: "FXLift",
        desc: "Idéal si tu veux un bonus de protection sur un dépôt plus important.",
      },
    ],
    brokersTitle: "Choisir ton broker",
    brokersSubtitle:
      "Les deux brokers donnent le même accès TradeScaleX. La différence est dans leur bonus.",
    idealFor: "Idéal si tu veux :",
    bonusLabel: "Bonus de dépôt",
    cta: "Ouvrir un compte",
    faqTitle: "Questions fréquentes",
    faqs: [
      {
        q: "Qu'est-ce qu'un bonus de marge concrètement ?",
        a: "Si tu déposes 500 € chez un broker offrant un bonus de marge 100 %, le broker ajoute jusqu'à 500 € de marge supplémentaire sur ton compte. Cette marge n'est pas retirable — c'est de la marge disponible pour positionner tes trades, pas du cash que tu peux sortir. Tu conserves tes 500 € de dépôt initial, eux retirables normalement.",
      },
      {
        q: "Lequel choisir ?",
        a: "Le plus simple : choisis selon ton dépôt prévu. En dessous de 1 000 €, le bonus de marge de RaiseFX (100 %) est plus avantageux. À partir de 1 000 €, le bonus de protection de FXLift devient plus intéressant car il absorbe aussi une partie des pertes. Les deux donnent le même accès à TradeScaleX.",
      },
      {
        q: "Mes fonds sont-ils en sécurité ?",
        a: "Ton dépôt est versé directement sur ton compte chez le broker — TradeScaleX n'y a aucun accès et ne détient pas ton argent. Les conditions de dépôt, de retrait et de protection des fonds dépendent du broker : lis ses conditions avant de déposer. Le bonus, lui, n'est pas retirable.",
      },
      {
        q: "Quand mon accès TradeScaleX est-il activé ?",
        a: "Une fois ton dépôt vérifié par le broker (généralement sous 24 à 72 h), tu reçois ton code d'accès TradeScaleX par email. Tu l'actives sur la page d'activation et tu débloques tout le contenu immédiatement.",
      },
    ],
    riskNote:
      "Le trading comporte un risque de perte en capital. Les conditions de bonus sont fixées par le broker et peuvent évoluer.",
  },
  es: {
    breadcrumbHome: "Inicio",
    breadcrumbCurrent: "Acceso a través de un bróker",
    title: "Accede gratis a través de un bróker asociado",
    subtitle:
      "Abre una cuenta con uno de nuestros brókers asociados, realiza tu depósito y desbloquea tu acceso completo a TradeScaleX — sin suscripción mensual.",
    unlockTitle: "Lo que desbloqueas",
    unlockSubtitle:
      "Mismo contenido que el acceso directo de 19 €/mes. Sin límites, sin opciones de pago adicionales.",
    features: [
      "Todas las formaciones",
      "Todas las estrategias",
      "Todos los juegos pedagógicos",
      "Actualizaciones incluidas",
      "Acceso completo a TradeScaleX",
    ],
    stepsTitle: "Cómo funciona",
    steps: [
      "Abre una cuenta con uno de los brókers asociados a continuación.",
      "Realiza tu depósito inicial en tu cuenta de bróker.",
      "Una vez verificado tu depósito, recibes tu código de acceso gratuito a TradeScaleX.",
    ],
    bonusEduTitle: "Entender los 2 tipos de bono",
    bonusEduIntro: "Antes de elegir un bróker, esta es la diferencia concreta entre sus bonos.",
    bonusProtectionHeader: "Bono de protección",
    bonusProtectionBullets: [
      { kind: "pro", label: "Puede absorber parte de las pérdidas según las condiciones del bróker" },
      { kind: "pro", label: "Más tranquilizador para ciertos perfiles" },
      { kind: "pro", label: "También ofrece margen adicional" },
    ],
    bonusMarginHeader: "Bono de margen",
    bonusMarginBullets: [
      { kind: "pro", label: "Más margen disponible" },
      { kind: "pro", label: "Más flexibilidad en la gestión de posiciones" },
      { kind: "con", label: "No cubre las pérdidas" },
    ],
    depositTitle: "¿Qué cantidad prevés depositar?",
    depositRecLabel: "Bróker recomendado",
    depositCards: [
      {
        amount: "Menos de 1 000 €",
        brokerId: "raisefx",
        brokerName: "RaiseFX",
        desc: "Ideal si quieres un bono de margen más generoso en un depósito pequeño o mediano.",
      },
      {
        amount: "1 000 € o más",
        brokerId: "fxlift",
        brokerName: "FXLift",
        desc: "Ideal si quieres un bono de protección en un depósito más importante.",
      },
    ],
    brokersTitle: "Elige tu bróker",
    brokersSubtitle:
      "Los dos brókers dan el mismo acceso a TradeScaleX. La diferencia está en el bono.",
    idealFor: "Ideal si quieres:",
    bonusLabel: "Bono de depósito",
    cta: "Abrir una cuenta",
    faqTitle: "Preguntas frecuentes",
    faqs: [
      {
        q: "¿Qué es un bono de margen concretamente?",
        a: "Si depositas 500 € en un bróker que ofrece un bono de margen del 100 %, el bróker añade hasta 500 € de margen adicional en tu cuenta. Este margen no es retirable — es margen disponible para posicionar tus operaciones, no efectivo que puedas sacar. Conservas tus 500 € de depósito inicial, esos sí retirables normalmente.",
      },
      {
        q: "¿Cuál elegir?",
        a: "Lo más simple: elige según tu depósito previsto. Por debajo de 1 000 €, el bono de margen de RaiseFX (100 %) es más ventajoso. A partir de 1 000 €, el bono de protección de FXLift resulta más interesante porque también absorbe parte de las pérdidas. Ambos dan el mismo acceso a TradeScaleX.",
      },
      {
        q: "¿Mis fondos están seguros?",
        a: "Tu depósito se ingresa directamente en tu cuenta del bróker — TradeScaleX no tiene ningún acceso ni retiene tu dinero. Las condiciones de depósito, retirada y protección de fondos dependen del bróker: lee sus condiciones antes de depositar. El bono no es retirable.",
      },
      {
        q: "¿Cuándo se activa mi acceso a TradeScaleX?",
        a: "Una vez que el bróker verifique tu depósito (normalmente en 24 a 72 h), recibes tu código de acceso a TradeScaleX por email. Lo activas en la página de activación y desbloqueas todo el contenido al instante.",
      },
    ],
    riskNote:
      "El trading conlleva un riesgo de pérdida de capital. Las condiciones del bono las establece el bróker y pueden evolucionar.",
  },
};

const brokers: {
  id: BrokerId;
  name: string;
  badge: Record<Locale, string>;
  idealForBullets: Record<Locale, string[]>;
  bonusHeadline: Record<Locale, string>;
  mechanic: Record<Locale, string>;
  url: string;
}[] = [
  {
    id: "raisefx",
    name: "RaiseFX",
    badge: { fr: "Recommandé sous 1 000 €", es: "Recomendado por debajo de 1 000 €" },
    idealForBullets: {
      fr: [
        "Davantage de marge disponible sur ton compte",
        "Plus de flexibilité dans ta gestion de positions",
        "Adapté si tu utilises régulièrement le levier",
      ],
      es: [
        "Más margen disponible en tu cuenta",
        "Más flexibilidad en tu gestión de posiciones",
        "Adaptado si utilizas el apalancamiento regularmente",
      ],
    },
    bonusHeadline: {
      fr: "100 % jusqu'à 2 000 € de marge supplémentaire",
      es: "100 % hasta 2 000 € de margen adicional",
    },
    mechanic: {
      fr: "Le bonus est utilisable uniquement comme marge. Il n'absorbe pas les pertes.",
      es: "El bono solo es utilizable como margen. No absorbe las pérdidas.",
    },
    url: "https://partners.raisefx.com/visit/?bta=168801&brand=raisefx",
  },
  {
    id: "fxlift",
    name: "FXLift",
    badge: { fr: "Recommandé dès 1 000 €", es: "Recomendado a partir de 1 000 €" },
    idealForBullets: {
      fr: [
        "Une approche plus conservative du trading",
        "Une protection supplémentaire en cas de série de pertes",
        "Un bonus qui te couvre, pas uniquement de la marge",
      ],
      es: [
        "Un enfoque más conservador del trading",
        "Protección adicional en caso de racha de pérdidas",
        "Un bono que te cubre, no solo margen",
      ],
    },
    bonusHeadline: {
      fr: "40 % du dépôt",
      es: "40 % del depósito",
    },
    mechanic: {
      fr: "Le bonus absorbe aussi les pertes, pas seulement la marge.",
      es: "El bono también absorbe las pérdidas, no solo el margen.",
    },
    url: "https://go.fxlift.com/visit/?bta=35146&brand=fxlift",
  },
];

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
      <div className="max-w-5xl mx-auto">

        <nav className="mb-8 text-sm text-zinc-500">
          <Link href={`/${lang}`} className="hover:text-zinc-300 transition-colors">
            {t.breadcrumbHome}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-300">{t.breadcrumbCurrent}</span>
        </nav>

        <header className="mb-14">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{t.title}</h1>
          <p className="mt-4 text-zinc-400 text-base md:text-lg max-w-2xl leading-relaxed">{t.subtitle}</p>
        </header>

        <section className="mb-16">
          <h2 className="text-xl md:text-2xl font-bold mb-2">{t.unlockTitle}</h2>
          <p className="text-sm text-zinc-400 mb-6 max-w-2xl">{t.unlockSubtitle}</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {t.features.map((f) => (
              <div key={f} className="flex items-start gap-2 bg-zinc-900/60 border border-zinc-800 rounded-xl px-3 py-3">
                <Check className="text-emerald-400 mt-0.5" />
                <span className="text-xs md:text-sm text-zinc-200 leading-snug">{f}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-xl md:text-2xl font-bold mb-6">{t.stepsTitle}</h2>
          <ol className="space-y-4">
            {t.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="flex-none flex items-center justify-center w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 text-emerald-500 text-sm font-semibold">
                  {i + 1}
                </span>
                <span className="text-zinc-300 pt-1">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-16">
          <h2 className="text-xl md:text-2xl font-bold mb-2">{t.bonusEduTitle}</h2>
          <p className="text-sm text-zinc-400 mb-6 max-w-2xl">{t.bonusEduIntro}</p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500 mb-3">{t.bonusProtectionHeader}</p>
              <ul className="space-y-2.5">
                {t.bonusProtectionBullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed">
                    {b.kind === "pro" ? <Check className="text-emerald-400 mt-1" /> : <Cross className="text-zinc-500 mt-1" />}
                    <span className={b.kind === "pro" ? "text-zinc-200" : "text-zinc-500"}>{b.label}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500 mb-3">{t.bonusMarginHeader}</p>
              <ul className="space-y-2.5">
                {t.bonusMarginBullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed">
                    {b.kind === "pro" ? <Check className="text-emerald-400 mt-1" /> : <Cross className="text-zinc-500 mt-1" />}
                    <span className={b.kind === "pro" ? "text-zinc-200" : "text-zinc-500"}>{b.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-xl md:text-2xl font-bold mb-6">{t.depositTitle}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {t.depositCards.map((c, i) => {
              const logo = BROKER_LOGOS[c.brokerId];
              return (
                <div key={i} className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5">
                  <div className="text-lg font-bold text-white mb-3">{c.amount}</div>
                  <div className="text-[11px] uppercase tracking-widest text-zinc-500 mb-2">{t.depositRecLabel}</div>
                  <div className="flex items-center gap-2.5 mb-3">
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      width={logo.width}
                      height={logo.height}
                      className="h-6 w-auto"
                    />
                    <span className="text-base font-semibold text-emerald-400">{c.brokerName}</span>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed">{c.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-xl md:text-2xl font-bold mb-2">{t.brokersTitle}</h2>
          <p className="text-sm text-zinc-400 mb-8 max-w-2xl leading-relaxed">{t.brokersSubtitle}</p>
          <div className="grid gap-5 md:grid-cols-2">
            {brokers.map((b) => {
              const logo = BROKER_LOGOS[b.id];
              return (
                <div key={b.id} className="flex flex-col bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
                  <span className="self-start inline-flex items-center text-[11px] font-semibold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1 mb-4">
                    {b.badge[lang]}
                  </span>
                  <div className="flex items-center gap-3 mb-5">
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      width={logo.width}
                      height={logo.height}
                      className="h-7 w-auto"
                    />
                    <h3 className="text-2xl font-bold text-white">{b.name}</h3>
                  </div>
                  <p className="text-xs uppercase tracking-widest text-zinc-500 mb-3">{t.idealFor}</p>
                  <ul className="space-y-2.5 mb-6">
                    {b.idealForBullets[lang].map((bullet, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-200 leading-relaxed">
                        <Check className="text-emerald-400 mt-1" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-zinc-800/70 my-2" />
                  <div className="mb-1 text-[11px] uppercase tracking-widest text-zinc-500 mt-4">{t.bonusLabel}</div>
                  <div className="text-lg font-semibold text-emerald-400 mb-2">{b.bonusHeadline[lang]}</div>
                  <p className="text-sm text-zinc-400 mb-6 leading-relaxed flex-1">{b.mechanic[lang]}</p>
                  <a
                    href={b.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold py-3 transition-colors"
                  >
                    {t.cta}
                  </a>
                </div>
              );
            })}
          </div>
        </section>

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

        <p className="text-xs text-zinc-500 leading-relaxed">{t.riskNote}</p>
      </div>
    </main>
  );
}
