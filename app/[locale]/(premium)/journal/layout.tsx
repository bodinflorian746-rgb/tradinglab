import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { requirePremium } from "@/lib/auth/require-premium";
import { isJournalAllowed } from "@/lib/journal/access";

// Journal en accès restreint : garde premium existante (groupe (premium))
// ET liste blanche JOURNAL_EMAILS (cf. lib/journal/access.ts). Un non-premium
// ou un premium hors liste reçoit notFound() — jamais une page d'erreur ou un
// écran de paywall — pour que la route reste invisible plutôt que de signaler
// l'existence d'une fonctionnalité en accès restreint.
export default async function JournalLayout({ children }: { children: ReactNode }) {
  const { isPremium, user } = await requirePremium();
  if (!isPremium) notFound();
  if (!isJournalAllowed(user?.email)) notFound();

  return <>{children}</>;
}
