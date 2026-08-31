-- ─── Emoji sur les articles de la boutique ────────────────────────────────────
-- L'admin de groupe choisit un emoji court pour chaque article, affiché côté
-- membre à côté du nom (onglet "Dépenser" de /fidelite). Colonne optionnelle :
-- un article sans emoji reste valide, aucun rétro-remplissage nécessaire.
-- char_length <= 16 : garde-fou technique (un emoji composé — famille, ton de
-- peau, ZWJ — peut compter plusieurs points de code), jamais une limite
-- métier ; empêche seulement un champ texte libre déguisé en emoji.

begin;

alter table public.group_shop_items
  add column emoji text check (emoji is null or char_length(emoji) <= 16);

commit;
