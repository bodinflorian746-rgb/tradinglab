// Ancienne URL du Sprint 1 — l'écran de crédit est désormais fusionné dans
// membres/page.tsx (une seule recherche pseudo/email pour consulter ET
// créditer). On redirige plutôt que de renvoyer 404, en conservant ?userId=
// si présent : les deux écrans partagent le même paramètre de sélection.

import { redirect } from "next/navigation";
import { hasLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { localizedHref } from "@/lib/i18n/href";

export default async function MasterCrediterRedirect({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; groupId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale: raw, groupId } = await params;
  const locale: Locale = hasLocale(raw) ? raw : DEFAULT_LOCALE;
  const sp = await searchParams;
  const userId = Array.isArray(sp.userId) ? sp.userId[0] : sp.userId;

  const target = localizedHref(`/master/${groupId}/membres`, locale);
  redirect(userId ? `${target}?userId=${encodeURIComponent(userId)}` : target);
}
