import type { Metadata } from "next";
import { hasLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";

// Page légale « Conditions générales de vente (CGV) ». Server Component, sous
// [locale]/layout.tsx. Localisation inline FR/ES/EN (pattern page.tsx).
// FR verbatim ; ES/EN traduction fidèle, même structure de titres.

type Block = string | { list: string[] } | { lines: string[] };
type Section = { heading: string; blocks: Block[] };
type Content = { title: string; description: string; sections: Section[] };

const CONTENT: Record<Locale, Content> = {
  fr: {
    title: "Conditions générales de vente",
    description:
      "Conditions générales de vente et d'abonnement TradeScaleX.",
    sections: [
      {
        heading: "Objet",
        blocks: [
          "Les présentes CGV s'appliquent à tout abonnement souscrit sur TradeScaleX.",
        ],
      },
      {
        heading: "Offre et tarifs",
        blocks: [
          "Abonnement mensuel à 19€ TTC/mois, sans engagement, avec période d'essai gratuite de 48 heures pour tout nouvel utilisateur. Les prix sont indiqués en euros, toutes taxes comprises.",
        ],
      },
      {
        heading: "Paiement",
        blocks: [
          "Le paiement est effectué par carte bancaire via Stripe, prestataire de paiement sécurisé. L'abonnement est renouvelé automatiquement chaque mois tant qu'il n'a pas été résilié.",
        ],
      },
      {
        heading: "Droit de rétractation",
        blocks: [
          "Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne s'applique pas aux contenus numériques dont l'exécution a commencé avec l'accord exprès du consommateur avant la fin du délai de rétractation (ce qui est le cas dès l'accès au service pendant l'essai gratuit ou après souscription). En souscrivant, l'utilisateur reconnaît et accepte cette renonciation.",
        ],
      },
      {
        heading: "Résiliation par l'utilisateur",
        blocks: [
          "L'utilisateur peut résilier son abonnement à tout moment depuis son espace compte (portail Stripe). La résiliation prend effet à la fin de la période déjà payée ; aucun remboursement au prorata n'est effectué.",
        ],
      },
      {
        heading: "Modification tarifaire",
        blocks: [
          "TradeScaleX se réserve le droit de modifier ses tarifs. Toute modification sera communiquée aux abonnés existants avec un préavis raisonnable avant application.",
        ],
      },
      {
        heading: "Facturation",
        blocks: [
          "Les factures sont accessibles depuis l'espace compte de l'utilisateur (portail Stripe).",
        ],
      },
      {
        heading: "Litiges",
        blocks: [
          "En cas de litige, l'utilisateur peut contacter contact@tradescalex.com. À défaut de résolution amiable, les tribunaux français compétents seront saisis, sauf disposition impérative contraire applicable au consommateur.",
        ],
      },
    ],
  },
  en: {
    title: "Terms of sale",
    description: "TradeScaleX terms of sale and subscription.",
    sections: [
      {
        heading: "Purpose",
        blocks: [
          "These Terms of Sale apply to any subscription taken out on TradeScaleX.",
        ],
      },
      {
        heading: "Offer and pricing",
        blocks: [
          "Monthly subscription at €19 incl. tax/month, with no commitment, with a 48-hour free trial period for any new user. Prices are shown in euros, all taxes included.",
        ],
      },
      {
        heading: "Payment",
        blocks: [
          "Payment is made by bank card via Stripe, a secure payment provider. The subscription is automatically renewed each month until it is cancelled.",
        ],
      },
      {
        heading: "Right of withdrawal",
        blocks: [
          "In accordance with Article L221-28 of the French Consumer Code, the right of withdrawal does not apply to digital content whose performance has begun with the consumer's express consent before the end of the withdrawal period (which is the case as soon as the service is accessed during the free trial or after subscription). By subscribing, the user acknowledges and accepts this waiver.",
        ],
      },
      {
        heading: "Cancellation by the user",
        blocks: [
          "The user may cancel their subscription at any time from their account area (Stripe portal). Cancellation takes effect at the end of the period already paid for; no pro rata refund is made.",
        ],
      },
      {
        heading: "Price changes",
        blocks: [
          "TradeScaleX reserves the right to change its prices. Any change will be communicated to existing subscribers with reasonable notice before it applies.",
        ],
      },
      {
        heading: "Billing",
        blocks: [
          "Invoices are accessible from the user's account area (Stripe portal).",
        ],
      },
      {
        heading: "Disputes",
        blocks: [
          "In the event of a dispute, the user may contact contact@tradescalex.com. Failing an amicable resolution, the competent French courts will have jurisdiction, unless a mandatory provision applicable to the consumer states otherwise.",
        ],
      },
    ],
  },
  es: {
    title: "Condiciones generales de venta",
    description: "Condiciones generales de venta y suscripción de TradeScaleX.",
    sections: [
      {
        heading: "Objeto",
        blocks: [
          "Las presentes Condiciones Generales de Venta se aplican a toda suscripción contratada en TradeScaleX.",
        ],
      },
      {
        heading: "Oferta y tarifas",
        blocks: [
          "Suscripción mensual de 19 € IVA incluido/mes, sin compromiso, con un periodo de prueba gratuito de 48 horas para todo nuevo usuario. Los precios se indican en euros, con todos los impuestos incluidos.",
        ],
      },
      {
        heading: "Pago",
        blocks: [
          "El pago se realiza con tarjeta bancaria a través de Stripe, proveedor de pago seguro. La suscripción se renueva automáticamente cada mes mientras no haya sido cancelada.",
        ],
      },
      {
        heading: "Derecho de desistimiento",
        blocks: [
          "De conformidad con el artículo L221-28 del Código de Consumo francés, el derecho de desistimiento no se aplica a los contenidos digitales cuya ejecución ha comenzado con el consentimiento expreso del consumidor antes del final del plazo de desistimiento (lo cual es el caso desde el acceso al servicio durante la prueba gratuita o tras la suscripción). Al suscribirse, el usuario reconoce y acepta esta renuncia.",
        ],
      },
      {
        heading: "Cancelación por parte del usuario",
        blocks: [
          "El usuario puede cancelar su suscripción en cualquier momento desde su espacio de cuenta (portal Stripe). La cancelación surte efecto al final del periodo ya pagado; no se efectúa ningún reembolso prorrateado.",
        ],
      },
      {
        heading: "Modificación tarifaria",
        blocks: [
          "TradeScaleX se reserva el derecho de modificar sus tarifas. Toda modificación se comunicará a los abonados existentes con un preaviso razonable antes de su aplicación.",
        ],
      },
      {
        heading: "Facturación",
        blocks: [
          "Las facturas están accesibles desde el espacio de cuenta del usuario (portal Stripe).",
        ],
      },
      {
        heading: "Litigios",
        blocks: [
          "En caso de litigio, el usuario puede contactar con contact@tradescalex.com. A falta de resolución amistosa, se recurrirá a los tribunales franceses competentes, salvo disposición imperativa contraria aplicable al consumidor.",
        ],
      },
    ],
  },
};

function renderBlock(block: Block, key: number) {
  if (typeof block === "string") {
    return (
      <p key={key} className="text-[15px] text-zinc-400 leading-relaxed">
        {block}
      </p>
    );
  }
  if ("list" in block) {
    return (
      <ul key={key} className="space-y-2">
        {block.list.map((item, i) => (
          <li key={i} className="flex gap-2.5 text-[15px] text-zinc-400 leading-relaxed">
            <span className="text-emerald-500 shrink-0" aria-hidden="true">—</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <div key={key} className="text-[15px] text-zinc-300 leading-relaxed">
      {block.lines.map((line, i) => (
        <p key={i}>{line}</p>
      ))}
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const raw = (await params).locale;
  const locale: Locale = hasLocale(raw) ? raw : DEFAULT_LOCALE;
  const c = CONTENT[locale];
  return { title: `${c.title} — TradeScaleX`, description: c.description };
}

export default async function CgvPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const raw = (await params).locale;
  const locale: Locale = hasLocale(raw) ? raw : DEFAULT_LOCALE;
  const c = CONTENT[locale];

  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 py-16 md:py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-10">{c.title}</h1>
        <div className="space-y-10">
          {c.sections.map((section, i) => (
            <section key={i}>
              <h2 className="text-lg font-semibold text-white mb-3">{section.heading}</h2>
              <div className="space-y-3">
                {section.blocks.map((block, j) => renderBlock(block, j))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
