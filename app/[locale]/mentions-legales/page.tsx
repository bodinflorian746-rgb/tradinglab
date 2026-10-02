import type { Metadata } from "next";
import { hasLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";

// Page légale « Mentions légales ». Server Component, sous [locale]/layout.tsx
// (Navbar + fond global). Localisation inline FR/ES/EN — même pattern que
// app/[locale]/page.tsx (objet T). Le FR est la source verbatim ; ES/EN sont la
// traduction fidèle avec la même structure de titres.

type Block = string | { list: string[] } | { lines: string[] };
type Section = { heading: string; blocks: Block[] };
type Content = { title: string; description: string; sections: Section[] };

const CONTENT: Record<Locale, Content> = {
  fr: {
    title: "Mentions légales",
    description:
      "Mentions légales de TradeScaleX : éditeur, hébergement, propriété intellectuelle.",
    sections: [
      {
        heading: "Éditeur du site",
        blocks: [
          "Le site TradeScaleX (tradescalex.com) est édité par :",
          {
            lines: [
              "Florian B., entrepreneur individuel (auto-entreprise)",
              "SIRET : 842 580 813 00041",
              "Code NAF/APE : 7022Z — Conseil pour les affaires et autres conseils de gestion",
              "Immatriculé depuis le 14/02/2025",
              "Email de contact : contact@tradescalex.com",
            ],
          },
        ],
      },
      {
        heading: "Directeur de la publication",
        blocks: ["Florian B."],
      },
      {
        heading: "Hébergement",
        blocks: [
          "Le site est hébergé par :",
          {
            lines: [
              "Vercel Inc.",
              "440 N Barranca Ave #4133, Covina, CA 91723, États-Unis",
              "https://vercel.com",
            ],
          },
          "Les données utilisateurs (comptes, progression) sont stockées via Supabase.",
          "Les paiements sont traités par Stripe. TradeScaleX ne stocke aucune donnée bancaire.",
          "Les emails transactionnels sont envoyés via Resend.",
        ],
      },
      {
        heading: "Propriété intellectuelle",
        blocks: [
          "L'ensemble des contenus du site TradeScaleX (textes, visuels, schémas pédagogiques, illustrations SVG, structure des formations) est protégé par le droit d'auteur. Toute reproduction, distribution ou exploitation commerciale sans autorisation écrite préalable est interdite.",
        ],
      },
      {
        heading: "Avertissement sur le contenu",
        blocks: [
          "TradeScaleX est une plateforme à vocation strictement pédagogique. Le contenu proposé (formations, analyses, outils) ne constitue en aucun cas un conseil en investissement financier, une incitation à investir, ni une recommandation personnalisée au sens de la réglementation applicable. Le trading sur les marchés financiers comporte un risque de perte en capital. Chaque utilisateur est seul responsable de ses décisions de trading.",
        ],
      },
    ],
  },
  en: {
    title: "Legal notice",
    description:
      "TradeScaleX legal notice: publisher, hosting, intellectual property.",
    sections: [
      {
        heading: "Site publisher",
        blocks: [
          "The TradeScaleX website (tradescalex.com) is published by:",
          {
            lines: [
              "Florian B., sole trader (auto-entreprise, French individual business)",
              "SIRET: 842 580 813 00041",
              "NAF/APE code: 7022Z — Business and other management consulting activities",
              "Registered since 14/02/2025",
              "Contact email: contact@tradescalex.com",
            ],
          },
        ],
      },
      {
        heading: "Publication director",
        blocks: ["Florian B."],
      },
      {
        heading: "Hosting",
        blocks: [
          "The website is hosted by:",
          {
            lines: [
              "Vercel Inc.",
              "440 N Barranca Ave #4133, Covina, CA 91723, United States",
              "https://vercel.com",
            ],
          },
          "User data (accounts, progress, trading journal) is stored via Supabase.",
          "Payments are processed by Stripe. TradeScaleX does not store any banking data.",
          "Transactional emails are sent via Resend.",
        ],
      },
      {
        heading: "Intellectual property",
        blocks: [
          "All content on the TradeScaleX website (texts, visuals, educational diagrams, SVG illustrations, course structure) is protected by copyright. Any reproduction, distribution or commercial use without prior written authorization is prohibited.",
        ],
      },
      {
        heading: "Content disclaimer",
        blocks: [
          "TradeScaleX is a strictly educational platform. The content provided (courses, analyses, trading journal, tools) in no way constitutes financial investment advice, an incentive to invest, or a personalized recommendation within the meaning of the applicable regulations. Trading on the financial markets involves a risk of capital loss. Each user is solely responsible for their own trading decisions.",
        ],
      },
    ],
  },
  es: {
    title: "Aviso legal",
    description:
      "Aviso legal de TradeScaleX: editor, alojamiento, propiedad intelectual.",
    sections: [
      {
        heading: "Editor del sitio",
        blocks: [
          "El sitio TradeScaleX (tradescalex.com) está editado por:",
          {
            lines: [
              "Florian B., empresario individual (auto-empresa)",
              "SIRET: 842 580 813 00041",
              "Código NAF/APE: 7022Z — Consultoría de gestión empresarial y otras consultorías",
              "Registrado desde el 14/02/2025",
              "Email de contacto: contact@tradescalex.com",
            ],
          },
        ],
      },
      {
        heading: "Director de la publicación",
        blocks: ["Florian B."],
      },
      {
        heading: "Alojamiento",
        blocks: [
          "El sitio está alojado por:",
          {
            lines: [
              "Vercel Inc.",
              "440 N Barranca Ave #4133, Covina, CA 91723, Estados Unidos",
              "https://vercel.com",
            ],
          },
          "Los datos de los usuarios (cuentas, progreso) se almacenan a través de Supabase.",
          "Los pagos son procesados por Stripe. TradeScaleX no almacena ningún dato bancario.",
          "Los emails transaccionales se envían a través de Resend.",
        ],
      },
      {
        heading: "Propiedad intelectual",
        blocks: [
          "Todo el contenido del sitio TradeScaleX (textos, visuales, esquemas pedagógicos, ilustraciones SVG, estructura de las formaciones) está protegido por derechos de autor. Queda prohibida toda reproducción, distribución o explotación comercial sin autorización escrita previa.",
        ],
      },
      {
        heading: "Advertencia sobre el contenido",
        blocks: [
          "TradeScaleX es una plataforma con una finalidad estrictamente pedagógica. El contenido ofrecido (formaciones, análisis, herramientas) no constituye en ningún caso un asesoramiento en inversión financiera, una incitación a invertir, ni una recomendación personalizada en el sentido de la normativa aplicable. El trading en los mercados financieros conlleva un riesgo de pérdida de capital. Cada usuario es el único responsable de sus decisiones de trading.",
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

export default async function MentionsLegalesPage({
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
