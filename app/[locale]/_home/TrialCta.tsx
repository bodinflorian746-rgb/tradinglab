"use client";

// Accès au parcours d'essai 48h existant depuis la home :
// - visiteur non connecté → lien direct vers l'inscription d'essai
//   (/signup?from=trial), la page vers laquelle requestTrialCode le redirige ;
// - utilisateur connecté → formulaire requestTrialCode (envoi du code, ou
//   redirection si l'essai n'est plus disponible).

import type { ReactNode } from "react";
import Link from "next/link";
import { useSession } from "@/app/components/SessionProvider";
import { requestTrialCode } from "@/app/[locale]/pricing/actions";

export function TrialCta({ locale, trialHref, className, formClassName, children }: {
  locale: string;
  trialHref: string;
  className: string;
  formClassName?: string;
  children: ReactNode;
}) {
  const { user } = useSession();
  if (!user) {
    return (
      <Link href={trialHref} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <form action={requestTrialCode} className={formClassName}>
      <input type="hidden" name="locale" value={locale} />
      <button type="submit" className={className}>
        {children}
      </button>
    </form>
  );
}
