// /dashboard est conservé comme route de compatibilité : tout accès est
// redirigé vers la home connectée (plus de page "cul-de-sac" intermédiaire).
import { redirect } from "next/navigation";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}`);
}
