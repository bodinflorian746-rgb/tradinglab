import type { Metadata } from "next";
import { hasLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";

// Page légale « Politique de confidentialité (RGPD) ». Server Component, sous
// [locale]/layout.tsx. Localisation inline FR/ES/EN (pattern app/[locale]/page.tsx).
// FR verbatim ; ES/EN traduction fidèle, même structure de titres.

type Block = string | { list: string[] } | { lines: string[] };
type Section = { heading: string; blocks: Block[] };
type Content = { title: string; description: string; updated: string; sections: Section[] };

const CONTENT: Record<Locale, Content> = {
  fr: {
    title: "Politique de confidentialité",
    description:
      "Politique de confidentialité et gestion des données personnelles (RGPD) de TradeScaleX.",
    updated: "Dernière mise à jour : 2 juillet 2026",
    sections: [
      {
        heading: "Responsable du traitement",
        blocks: ["Florian B. (TradeScaleX), contact@tradescalex.com"],
      },
      {
        heading: "Données collectées",
        blocks: [
          "Selon votre usage du site, nous collectons :",
          {
            list: [
              "Compte : email, mot de passe (hashé), langue préférée",
              "Paiement : géré intégralement par Stripe — TradeScaleX n'a jamais accès à vos coordonnées bancaires",
              "Usage : progression dans les formations, données saisies dans le journal de trading, préférences de compte",
              "Technique : logs de connexion, adresse IP (à des fins de sécurité)",
            ],
          },
        ],
      },
      {
        heading: "Finalités",
        blocks: [
          {
            list: [
              "Fournir l'accès au service et à votre progression personnelle",
              "Gérer votre abonnement et facturation (via Stripe)",
              "Vous envoyer les emails nécessaires au service (confirmation, réinitialisation de mot de passe, factures) via Resend",
              "Améliorer le produit",
            ],
          },
        ],
      },
      {
        heading: "Base légale",
        blocks: [
          "Exécution du contrat (accès au service souscrit) et intérêt légitime (sécurité, amélioration du produit).",
        ],
      },
      {
        heading: "Durée de conservation",
        blocks: [
          "Les données sont conservées tant que votre compte est actif. En cas de suppression de compte, vos données personnelles sont supprimées sous 30 jours, sauf obligation légale de conservation (facturation).",
        ],
      },
      {
        heading: "Sous-traitants",
        blocks: [
          {
            list: [
              "Supabase (hébergement base de données et authentification)",
              "Stripe (paiement)",
              "Resend (envoi d'emails transactionnels)",
              "Vercel (hébergement du site)",
            ],
          },
          "Ces prestataires peuvent traiter des données en dehors de l'UE ; ils sont contractuellement engagés à respecter des standards de protection équivalents au RGPD (clauses contractuelles types).",
        ],
      },
      {
        heading: "Vos droits",
        blocks: [
          "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité de vos données. Pour exercer ces droits : contact@tradescalex.com.",
          "Vous pouvez également introduire une réclamation auprès de la CNIL (www.cnil.fr).",
        ],
      },
      {
        heading: "Cookies",
        blocks: [
          "Le site utilise des cookies strictement nécessaires au fonctionnement (authentification, session).",
        ],
      },
    ],
  },
  en: {
    title: "Privacy policy",
    description:
      "TradeScaleX privacy policy and personal data handling (GDPR).",
    updated: "Last updated: July 2, 2026",
    sections: [
      {
        heading: "Data controller",
        blocks: ["Florian B. (TradeScaleX), contact@tradescalex.com"],
      },
      {
        heading: "Data collected",
        blocks: [
          "Depending on your use of the site, we collect:",
          {
            list: [
              "Account: email, password (hashed), preferred language",
              "Payment: fully handled by Stripe — TradeScaleX never has access to your banking details",
              "Usage: course progress, data entered in the trading journal, account preferences",
              "Technical: connection logs, IP address (for security purposes)",
            ],
          },
        ],
      },
      {
        heading: "Purposes",
        blocks: [
          {
            list: [
              "Provide access to the service and to your personal progress",
              "Manage your subscription and billing (via Stripe)",
              "Send you the emails necessary for the service (confirmation, password reset, invoices) via Resend",
              "Improve the product",
            ],
          },
        ],
      },
      {
        heading: "Legal basis",
        blocks: [
          "Performance of the contract (access to the subscribed service) and legitimate interest (security, product improvement).",
        ],
      },
      {
        heading: "Retention period",
        blocks: [
          "Data is kept for as long as your account is active. If your account is deleted, your personal data is deleted within 30 days, unless there is a legal obligation to retain it (billing).",
        ],
      },
      {
        heading: "Subprocessors",
        blocks: [
          {
            list: [
              "Supabase (database hosting and authentication)",
              "Stripe (payment)",
              "Resend (sending of transactional emails)",
              "Vercel (website hosting)",
            ],
          },
          "These providers may process data outside the EU; they are contractually committed to complying with protection standards equivalent to the GDPR (standard contractual clauses).",
        ],
      },
      {
        heading: "Your rights",
        blocks: [
          "In accordance with the GDPR, you have the right to access, rectify, erase, restrict, object to and port your data. To exercise these rights: contact@tradescalex.com.",
          "You may also lodge a complaint with the CNIL (www.cnil.fr).",
        ],
      },
      {
        heading: "Cookies",
        blocks: [
          "The site uses cookies strictly necessary for its operation (authentication, session).",
        ],
      },
    ],
  },
  es: {
    title: "Política de privacidad",
    description:
      "Política de privacidad y gestión de datos personales (RGPD) de TradeScaleX.",
    updated: "Última actualización: 2 de julio de 2026",
    sections: [
      {
        heading: "Responsable del tratamiento",
        blocks: ["Florian B. (TradeScaleX), contact@tradescalex.com"],
      },
      {
        heading: "Datos recopilados",
        blocks: [
          "Según su uso del sitio, recopilamos:",
          {
            list: [
              "Cuenta: email, contraseña (con hash), idioma preferido",
              "Pago: gestionado íntegramente por Stripe — TradeScaleX nunca tiene acceso a sus datos bancarios",
              "Uso: progreso en las formaciones, datos introducidos en el diario de trading, preferencias de cuenta",
              "Técnico: registros de conexión, dirección IP (con fines de seguridad)",
            ],
          },
        ],
      },
      {
        heading: "Finalidades",
        blocks: [
          {
            list: [
              "Proporcionar el acceso al servicio y a su progreso personal",
              "Gestionar su suscripción y facturación (a través de Stripe)",
              "Enviarle los emails necesarios para el servicio (confirmación, restablecimiento de contraseña, facturas) a través de Resend",
              "Mejorar el producto",
            ],
          },
        ],
      },
      {
        heading: "Base legal",
        blocks: [
          "Ejecución del contrato (acceso al servicio suscrito) e interés legítimo (seguridad, mejora del producto).",
        ],
      },
      {
        heading: "Plazo de conservación",
        blocks: [
          "Los datos se conservan mientras su cuenta esté activa. En caso de eliminación de la cuenta, sus datos personales se eliminan en un plazo de 30 días, salvo obligación legal de conservación (facturación).",
        ],
      },
      {
        heading: "Encargados del tratamiento",
        blocks: [
          {
            list: [
              "Supabase (alojamiento de la base de datos y autenticación)",
              "Stripe (pago)",
              "Resend (envío de emails transaccionales)",
              "Vercel (alojamiento del sitio)",
            ],
          },
          "Estos proveedores pueden tratar datos fuera de la UE; están comprometidos contractualmente a respetar estándares de protección equivalentes al RGPD (cláusulas contractuales tipo).",
        ],
      },
      {
        heading: "Sus derechos",
        blocks: [
          "De conformidad con el RGPD, usted dispone de un derecho de acceso, rectificación, supresión, limitación, oposición y portabilidad de sus datos. Para ejercer estos derechos: contact@tradescalex.com.",
          "También puede presentar una reclamación ante la CNIL (www.cnil.fr).",
        ],
      },
      {
        heading: "Cookies",
        blocks: [
          "El sitio utiliza cookies estrictamente necesarias para su funcionamiento (autenticación, sesión).",
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

export default async function ConfidentialitePage({
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
        <h1 className="text-3xl md:text-4xl font-bold mb-3">{c.title}</h1>
        <p className="text-sm text-zinc-500 mb-10">{c.updated}</p>
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
