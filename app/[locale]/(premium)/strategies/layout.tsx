// Segment /strategies/* — accès libre aux pages de liste / index.
//
// Le hub stratégies et les vues d'ensemble de chaque module sont consultables
// sans compte (titres, descriptions, niveaux). L'intérieur de chaque leçon de
// stratégie reste verrouillé par son propre layout feuille
// (LockedContentLayout). Plus aucune redirection anonyme ici.

export default function StrategiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
