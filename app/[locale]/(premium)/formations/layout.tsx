// Segment /formations/* — accès libre aux pages de liste / index.
//
// Le hub formations, les niveaux (débutant/intermédiaire/avancé) et les hubs
// Macro sont des pages de présentation (titres, descriptions, durées, niveaux)
// consultables sans compte. L'intérieur de chaque leçon reste verrouillé par
// son propre layout feuille (LockedContentLayout). Plus aucune redirection
// anonyme ici.

export default function FormationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
