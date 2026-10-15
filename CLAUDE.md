@AGENTS.md

## Audits des jeux et des schémas

Un audit n'est jamais terminé parce que les règles sont à 0. Sur tout chantier qui touche un jeu ou un schéma : jouer un round de chaque scénario touché en 390 et 1440, regarder chaque capture comme un trader, et lister dans le rapport tout ce qui paraît faux, laid ou douteux, même hors périmètre. Sur téléphone, un graphique tient toujours en entier dans l'écran. Chaque défaut trouvé par le PO devient une règle automatique.

## Session premium des tests

La session premium (jeux et leçons réservés aux membres) reste active d'un chantier à l'autre. Elle est gardée hors du dépôt, dans `C:\Users\flori\tsx-session\premium-state.json`, et n'est jamais commitée. Avant chaque série de tests, la rafraîchir soi-même (`node C:\Users\flori\tsx-session\refresh-session.cjs C:\Users\flori\tsx-session\premium-state.json`). Ne la supprimer que sur demande du PO. Ne demander au PO de se reconnecter (`login-window.cjs`, même dossier) que si le rafraîchissement échoue.

## Langues

Le site est en français seulement (anglais et espagnol désactivés). Travailler, tester et auditer uniquement en français. Ne reporter aucun changement dans les fichiers anglais ou espagnols ; vérifier seulement que le build et les audits ne cassent pas à cause d'eux. Une règle d'audit qui vérifie encore l'anglais ou l'espagnol est retirée de l'audit, sans supprimer les fichiers.
