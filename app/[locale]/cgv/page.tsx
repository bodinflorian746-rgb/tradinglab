import { permanentRedirect } from "next/navigation";
import { hasLocale, DEFAULT_LOCALE } from "@/i18n/config";

// Les CGV n'ont plus d'objet (plus d'abonnement : essai 48h, puis accès gratuit via un dépôt chez le
// broker partenaire) ; ce qui restait utile est fondu dans les CGU. L'ancienne adresse redirige vers les
// CGU (liens externes et moteurs de recherche) ; plus aucun lien du site n'y mène.
export default async function CgvPage({ params }: { params: Promise<{ locale: string }> }) {
  const raw = (await params).locale;
  const locale = hasLocale(raw) ? raw : DEFAULT_LOCALE;
  permanentRedirect(`/${locale}/cgu`);
}
