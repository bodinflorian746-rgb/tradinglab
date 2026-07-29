// Segment /journal — chantier séparé, pas encore livré (cf. isJournalEnabled).
// Tant que NEXT_PUBLIC_JOURNAL_ENABLED n'est pas explicitement "true" (aucun
// environnement, y compris production), /journal et toutes ses sous-routes
// renvoient 404 — avant même le garde premium générique, qui reste appliqué
// une fois le chantier activé.
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { isJournalEnabled } from "@/lib/journal/feature-flag";
import LockedContentLayout from "@/app/components/premium/LockedContentLayout";

export default async function JournalLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  if (!isJournalEnabled()) notFound();
  return <LockedContentLayout params={params}>{children}</LockedContentLayout>;
}
