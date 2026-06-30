// Segment /jeux/* — accès libre à la liste des jeux.
//
// La page liste des jeux (cartes de présentation : titres, descriptions) est
// consultable sans compte. L'intérieur de chaque jeu reste verrouillé par son
// propre layout feuille (LockedContentLayout). Plus aucune redirection anonyme
// ici.

export default function JeuxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
