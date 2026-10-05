import ContentFr from "./_content-fr";
import ContentEs from "./_content-es";
import ContentEn from "./_content-en";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale === "es") return <ContentEs />;
  if (locale === "en") return <ContentEn />;
  return <ContentFr />;
}
