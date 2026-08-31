// Types TS du programme de fidélité (écrits à la main, à l'image de
// lib/journal/types.ts — aucune génération Supabase configurée dans le repo).
// Ils doivent rester alignés sur la migration
// supabase/migrations/20260721120000_create_loyalty_program.sql.

export type GroupStatus = "active" | "suspended";
export type MembershipRole = "admin" | "member";
export type MembershipStatus = "active" | "suspended";

export type PointsCodeStatus = "available" | "used" | "revoked" | "expired";

/** Types d'opérations du registre. Crédits > 0, débits < 0 (cf. LEDGER_SIGN). */
export type LedgerKind =
  | "code_reward"
  | "tier_bonus"
  | "purchase"
  | "manual_credit"
  | "manual_debit"
  | "cancellation"
  | "correction";

/** Niveaux calculés à partir du total historique des points gagnés. */
export type Tier = "bronze" | "silver" | "gold";

export type PartnerGroup = {
  id: string;
  name: string;
  slug: string;
  telegram_reference: string | null;
  status: GroupStatus;
  reference_code: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type GroupMembership = {
  id: string;
  group_id: string;
  user_id: string;
  role: MembershipRole;
  status: MembershipStatus;
  joined_at: string;
  created_at: string;
};

export type PointsCode = {
  code: string;
  group_id: string;
  points_value: number;
  status: PointsCodeStatus;
  created_by: string | null;
  used_by_user_id: string | null;
  used_at: string | null;
  expires_at: string | null;
  created_at: string;
};

export type PointsLedgerEntry = {
  id: string;
  group_id: string;
  user_id: string;
  kind: LedgerKind;
  amount: number;
  points_code: string | null;
  reason: string | null;
  created_by: string | null;
  created_at: string;
  // Migration 20260828130000 : figent le libellé de la règle de barème au
  // moment du crédit (kind='manual_credit' via group_point_rules) — null
  // pour toute ligne sans règle associée (code_reward, purchase, ...).
  rule_slug: string | null;
  rule_label: string | null;
};

// ─── Magasin par groupe (migration 20260724120000) ──────────────────────────

export type ShopItemType = "product" | "reward";
export type ShopItemStatus = "active" | "inactive";

export type GroupShopItem = {
  id: string;
  group_id: string;
  name: string;
  description: string | null;
  item_type: ShopItemType;
  price_points: number;
  image_url: string | null;
  stock: number | null;
  status: ShopItemStatus;
  // Emoji court choisi par l'admin de groupe (migration 20260901150000),
  // affiché à côté du nom côté membre. null = aucun emoji choisi.
  emoji: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type GroupShopPurchase = {
  id: string;
  group_id: string;
  item_id: string;
  user_id: string;
  price_paid: number;
  idempotency_key: string;
  created_at: string;
};

// ─── Codes de déblocage de compte scopés par groupe (migration 20260725100000)
// access_codes est un système préexistant (accès premium trial|broker|
// lifetime|duration), plus large que le programme de fidélité — group_id est
// nullable en base (les codes globaux du Super Admin restent group_id=null).
// Ce type ne modélise que la vue "codes d'UN groupe" (group_id non-null ici).
// 'duration' : type dédié aux codes générés par un admin de groupe avec une
// durée d'accès choisie librement (duration_days) — jamais 'trial'/'broker',
// réservés au Super Admin.

export type AccessCodeStatus = "available" | "used" | "revoked";
export type AccessCodeType = "trial" | "broker" | "lifetime" | "duration";

export type GroupAccessCode = {
  code: string;
  group_id: string;
  status: AccessCodeStatus;
  type: AccessCodeType;
  duration_days: number | null;
  used_by_user_id: string | null;
  used_at: string | null;
  expires_at: string | null;
  created_at: string;
};

// ─── Profil public (migration 20260825120000_profiles.sql) ─────────────────

export type Profile = {
  id: string;
  username: string;
  created_at: string;
  updated_at: string;
};

// ─── Barème de points par groupe (migration 20260828130000_group_point_rules.sql)
// slug texte libre (pas un enum Postgres) : "actions libres", is_system
// distingue les 3 règles semées par défaut d'une règle future ajoutée par un
// admin (écran d'édition = Sprint 2). sort_order = ordre d'affichage stable.

export type GroupPointRule = {
  id: string;
  group_id: string;
  slug: string;
  label: string;
  points: number;
  is_active: boolean;
  is_system: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};
