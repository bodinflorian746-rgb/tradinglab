// Carrousel témoignages homepage — Server Component (animation pure CSS).
// Boucle infinie : on duplique la liste 2× et on translate de 0 à -50% via
// keyframe défini dans globals.css (.ts-carousel-track).
//
// Hover sur le wrapper met l'animation en pause (cf. .ts-carousel-wrapper:hover).
// Surligne automatiquement les segments [[mot]] dans le texte (vert emerald).

import { Fragment, type ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import { REVIEWS, type AvatarColor, type Review } from "@/lib/reviews";

type Strings = {
  verifiedBadge: string;
  earlyUserBadge: string;
  founderSignature: string;
};

const STRINGS: Record<Locale, Strings> = {
  fr: {
    verifiedBadge: "✓ VÉRIFIÉ",
    earlyUserBadge: "EARLY USER",
    founderSignature: "Florian · Fondateur",
  },
  en: {
    verifiedBadge: "✓ VERIFIED",
    earlyUserBadge: "EARLY USER",
    founderSignature: "Florian · Founder",
  },
  es: {
    verifiedBadge: "✓ VERIFICADO",
    earlyUserBadge: "EARLY USER",
    founderSignature: "Florian · Fundador",
  },
};

const AVATAR_GRADIENTS: Record<AvatarColor, string> = {
  a1: "bg-gradient-to-br from-emerald-500 to-emerald-600",
  a2: "bg-gradient-to-br from-blue-400 to-blue-500",
  a3: "bg-gradient-to-br from-amber-400 to-amber-500",
  a4: "bg-gradient-to-br from-violet-400 to-violet-500",
  a5: "bg-gradient-to-br from-red-500 to-red-600",
};

/** Parse "...texte [[mot]] texte..." en nodes React, avec mot surligné en vert. */
function renderText(text: string): ReactNode {
  const parts = text.split(/(\[\[[^\]]+\]\])/g);
  return parts.map((part, i) => {
    if (part.startsWith("[[") && part.endsWith("]]")) {
      return (
        <span key={i} className="text-emerald-400 font-semibold">
          {part.slice(2, -2)}
        </span>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

function Stars({ count }: { count: 3 | 4 | 5 }) {
  // 5 étoiles affichées, count = combien sont actives.
  return (
    <div className="text-emerald-400 text-sm tracking-[2px]" aria-label={`${count}/5`}>
      {"★".repeat(count)}
      {count < 5 && <span className="text-zinc-700">{"★".repeat(5 - count)}</span>}
    </div>
  );
}

function ReviewCard({ review, locale }: { review: Review; locale: Locale }) {
  const s = STRINGS[locale];
  const badgeLabel = review.verified ? s.verifiedBadge : s.earlyUserBadge;
  const badgeClass = review.verified
    ? "bg-emerald-500/15 text-emerald-400"
    : "bg-blue-400/15 text-blue-400";

  return (
    <article
      className={`flex w-[320px] flex-shrink-0 flex-col rounded-2xl border border-zinc-800 bg-zinc-900 md:w-[380px] ${
        review.founderReply ? "pb-0" : ""
      }`}
    >
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3.5 flex items-center justify-between">
          <Stars count={review.rating} />
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-[3px] text-[10px] font-bold tracking-wide ${badgeClass}`}
          >
            {badgeLabel}
          </span>
        </div>

        <p className="mb-5 flex-grow text-sm leading-relaxed text-zinc-300">
          &ldquo;{renderText(review.text[locale])}&rdquo;
        </p>

        <div className="flex items-center gap-2.5 border-t border-zinc-800 pt-3.5">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-bold text-zinc-950 ${AVATAR_GRADIENTS[review.avatarColor]}`}
            aria-hidden="true"
          >
            {review.initial}
          </div>
          <div className="text-xs">
            <strong className="block font-semibold text-white">{review.name}</strong>
            <span className="text-[11px] text-zinc-500">{review.role[locale]}</span>
          </div>
        </div>
      </div>

      {review.founderReply && (
        <div className="flex gap-2.5 rounded-b-2xl border-t border-emerald-500/15 bg-emerald-500/[0.05] px-6 py-3.5">
          <div
            aria-hidden="true"
            className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-emerald-500 text-[12px] font-extrabold text-zinc-950"
          >
            F
          </div>
          <div className="flex-grow">
            <div className="mb-0.5 text-[11px] font-bold text-emerald-400">
              {STRINGS[locale].founderSignature}
            </div>
            <div className="text-xs leading-relaxed text-zinc-300">
              {review.founderReply[locale]}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

export function ReviewsCarousel({ locale }: { locale: Locale }) {
  // On duplique la liste pour que la translation 0 → -50% boucle sans saut.
  const doubled = [...REVIEWS, ...REVIEWS];

  return (
    <div className="ts-carousel-wrapper relative -mx-6 mt-14 overflow-hidden px-6 [mask-image:linear-gradient(90deg,transparent,#000_120px,#000_calc(100%-120px),transparent)]">
      <div className="ts-carousel-track flex w-max gap-5">
        {doubled.map((review, idx) => (
          <ReviewCard
            key={`${review.id}-${idx}`}
            review={review}
            locale={locale}
          />
        ))}
      </div>
    </div>
  );
}
