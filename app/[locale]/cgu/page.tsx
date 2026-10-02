import type { Metadata } from "next";
import { hasLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";

// Page légale « Conditions générales d'utilisation (CGU) ». Server Component,
// sous [locale]/layout.tsx. Localisation inline FR/ES/EN (pattern page.tsx).
// FR verbatim ; ES/EN traduction fidèle, même structure de titres.

type Block = string | { list: string[] } | { lines: string[] };
type Section = { heading: string; blocks: Block[] };
type Content = { title: string; description: string; sections: Section[] };

const CONTENT: Record<Locale, Content> = {
  fr: {
    title: "Conditions générales d'utilisation",
    description:
      "Conditions générales d'utilisation du site et de l'application TradeScaleX.",
    sections: [
      {
        heading: "Objet",
        blocks: [
          "Les présentes CGU régissent l'accès et l'utilisation du site et de l'application TradeScaleX par tout utilisateur.",
        ],
      },
      {
        heading: "Accès au service",
        blocks: [
          "L'accès à certains contenus nécessite la création d'un compte et, au-delà de la période d'essai gratuite de 48h, la souscription d'un abonnement payant (voir CGV).",
        ],
      },
      {
        heading: "Compte utilisateur",
        blocks: [
          "L'utilisateur est responsable de la confidentialité de ses identifiants. Toute activité réalisée depuis son compte est présumée lui être imputable.",
        ],
      },
      {
        heading: "Usage autorisé",
        blocks: [
          "L'utilisateur s'engage à ne pas :",
          {
            list: [
              "Partager ses identifiants de connexion avec des tiers",
              "Reproduire, diffuser ou revendre tout ou partie du contenu pédagogique",
              "Utiliser le service à des fins illégales",
            ],
          },
        ],
      },
      {
        heading: "Nature du contenu",
        blocks: [
          "Le contenu de TradeScaleX est strictement pédagogique. Il ne constitue ni un conseil en investissement, ni une garantie de résultat. Les performances passées ou hypothétiques présentées à des fins d'exemple ne préjugent pas des performances futures.",
        ],
      },
      {
        heading: "Liens et partenaires tiers",
        blocks: [
          "TradeScaleX peut recommander des brokers ou plateformes tierces (partenaires affiliés). TradeScaleX n'est ni responsable de leurs services, ni de leur statut réglementaire, et perçoit une commission d'affiliation le cas échéant sans surcoût pour l'utilisateur.",
        ],
      },
      {
        heading: "Résiliation",
        blocks: [
          "TradeScaleX se réserve le droit de suspendre ou résilier l'accès d'un utilisateur en cas de non-respect des présentes CGU.",
        ],
      },
      {
        heading: "Modification des CGU",
        blocks: [
          "TradeScaleX peut modifier les présentes CGU à tout moment. Les utilisateurs seront informés de toute modification substantielle par email.",
        ],
      },
    ],
  },
  en: {
    title: "Terms of use",
    description:
      "Terms of use of the TradeScaleX website and application.",
    sections: [
      {
        heading: "Purpose",
        blocks: [
          "These Terms of Use govern access to and use of the TradeScaleX website and application by any user.",
        ],
      },
      {
        heading: "Access to the service",
        blocks: [
          "Access to certain content requires the creation of an account and, beyond the 48-hour free trial period, the subscription to a paid plan (see Terms of Sale).",
        ],
      },
      {
        heading: "User account",
        blocks: [
          "The user is responsible for keeping their login credentials confidential. Any activity carried out from their account is presumed to be attributable to them.",
        ],
      },
      {
        heading: "Permitted use",
        blocks: [
          "The user agrees not to:",
          {
            list: [
              "Share their login credentials with third parties",
              "Reproduce, distribute or resell all or part of the educational content",
              "Use the service for illegal purposes",
            ],
          },
        ],
      },
      {
        heading: "Nature of the content",
        blocks: [
          "TradeScaleX content is strictly educational. It constitutes neither investment advice nor a guarantee of results. Past or hypothetical performance presented for illustrative purposes does not predict future performance.",
        ],
      },
      {
        heading: "Third-party links and partners",
        blocks: [
          "TradeScaleX may recommend third-party brokers or platforms (affiliate partners). TradeScaleX is neither responsible for their services nor for their regulatory status, and receives an affiliate commission where applicable at no extra cost to the user.",
        ],
      },
      {
        heading: "Termination",
        blocks: [
          "TradeScaleX reserves the right to suspend or terminate a user's access in the event of non-compliance with these Terms of Use.",
        ],
      },
      {
        heading: "Amendment of the Terms of Use",
        blocks: [
          "TradeScaleX may amend these Terms of Use at any time. Users will be informed of any substantial change by email.",
        ],
      },
    ],
  },
  es: {
    title: "Condiciones generales de uso",
    description:
      "Condiciones generales de uso del sitio y de la aplicación TradeScaleX.",
    sections: [
      {
        heading: "Objeto",
        blocks: [
          "Las presentes Condiciones Generales de Uso rigen el acceso y la utilización del sitio y de la aplicación TradeScaleX por parte de cualquier usuario.",
        ],
      },
      {
        heading: "Acceso al servicio",
        blocks: [
          "El acceso a determinados contenidos requiere la creación de una cuenta y, más allá del periodo de prueba gratuito de 48 h, la suscripción de un abono de pago (ver CGV).",
        ],
      },
      {
        heading: "Cuenta de usuario",
        blocks: [
          "El usuario es responsable de la confidencialidad de sus credenciales. Toda actividad realizada desde su cuenta se presume imputable a él.",
        ],
      },
      {
        heading: "Uso autorizado",
        blocks: [
          "El usuario se compromete a no:",
          {
            list: [
              "Compartir sus credenciales de conexión con terceros",
              "Reproducir, difundir o revender todo o parte del contenido pedagógico",
              "Utilizar el servicio con fines ilegales",
            ],
          },
        ],
      },
      {
        heading: "Naturaleza del contenido",
        blocks: [
          "El contenido de TradeScaleX es estrictamente pedagógico. No constituye ni un asesoramiento en inversión, ni una garantía de resultado. Las rentabilidades pasadas o hipotéticas presentadas con fines de ejemplo no prejuzgan las rentabilidades futuras.",
        ],
      },
      {
        heading: "Enlaces y socios de terceros",
        blocks: [
          "TradeScaleX puede recomendar brókers o plataformas de terceros (socios afiliados). TradeScaleX no es responsable ni de sus servicios ni de su estatus regulatorio, y percibe una comisión de afiliación en su caso sin coste adicional para el usuario.",
        ],
      },
      {
        heading: "Resolución",
        blocks: [
          "TradeScaleX se reserva el derecho de suspender o resolver el acceso de un usuario en caso de incumplimiento de las presentes Condiciones Generales de Uso.",
        ],
      },
      {
        heading: "Modificación de las CGU",
        blocks: [
          "TradeScaleX puede modificar las presentes Condiciones Generales de Uso en cualquier momento. Los usuarios serán informados de toda modificación sustancial por email.",
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

export default async function CguPage({
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
