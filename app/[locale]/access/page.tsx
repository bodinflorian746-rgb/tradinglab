// /access est conservé comme route de compatibilité : tout accès est
// redirigé vers /activer-code (la seule page d'activation fonctionnelle).
import { redirect } from "next/navigation";
import { hasLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";

export default async function AccessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const raw = (await params).locale;
  const locale: Locale = hasLocale(raw) ? raw : DEFAULT_LOCALE;
  redirect(`/${locale}/activer-code`);
}
