import ContentFr from "./_content-fr";
import ContentEs from "./_content-es";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale === "es") return <ContentEs />;
  return <ContentFr />;
}
