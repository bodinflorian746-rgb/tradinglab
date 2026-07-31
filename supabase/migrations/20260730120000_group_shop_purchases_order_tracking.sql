-- ─── Suivi minimal des commandes pour les administrateurs de groupe ──────────
--
-- Étend group_shop_purchases (existante, migration 20260724120000) avec le
-- strict nécessaire pour qu'un admin de groupe sache qu'un client a acheté et
-- puisse marquer la remise du produit. N'AJOUTE AUCUNE TABLE. Ne touche à
-- AUCUNE autre table, contrainte, RPC ou policy existante — purchase_shop_item
-- (RPC d'achat) n'est pas modifiée : la nouvelle colonne status a une valeur
-- par défaut, donc tout INSERT existant (y compris depuis cette RPC) reçoit
-- automatiquement status='pending' sans aucun changement de la RPC elle-même.
--
-- status : deux valeurs seulement — 'pending' (par défaut, dès l'achat) puis
-- 'delivered' (remise confirmée par l'admin). Statut de suivi ADMINISTRATIF
-- uniquement : ne rembourse jamais les points, ne restaure jamais le stock,
-- ne supprime jamais la ligne, ne modifie jamais price_paid (cf.
-- app/[locale]/master/[groupId]/commandes/actions.ts).
--
-- delivered_at : renseigné au moment où l'admin marque la commande comme
-- livrée (null tant qu'elle est 'pending').
--
-- RLS : aucune nouvelle policy. La policy SELECT existante
-- (group_shop_purchases_select, migration 20260724120000) couvre déjà la
-- lecture (admin du groupe ou acheteur lui-même). Comme pour le reste de ce
-- schéma (points_codes, group_shop_items, access_codes), AUCUNE policy UPDATE
-- n'est ajoutée pour authenticated : l'écriture du statut passe exclusivement
-- par une Server Action en service_role qui re-vérifie l'autorisation à
-- chaque appel (authorizeGroupWrite, déjà utilisé par tout le reste de
-- l'espace Master).

begin;

alter table public.group_shop_purchases
  add column status       text        not null default 'pending'
                check (status in ('pending', 'delivered')),
  add column delivered_at timestamptz null;

commit;
