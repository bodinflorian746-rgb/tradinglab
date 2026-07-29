// Feature flag du Journal IA — chantier séparé, pas encore livré aux
// utilisateurs. Désactivé par défaut dans TOUS les environnements (dev,
// preview, production) : seule une activation EXPLICITE via
// NEXT_PUBLIC_JOURNAL_ENABLED=true rend les routes /journal accessibles.
//
// Ne dépend jamais de NODE_ENV : le comportement doit être identique en local
// et en prod tant que le flag n'est pas positionné, pour ne jamais découvrir
// une différence de comportement au déploiement.

export function isJournalEnabled(): boolean {
  return process.env.NEXT_PUBLIC_JOURNAL_ENABLED === "true";
}
