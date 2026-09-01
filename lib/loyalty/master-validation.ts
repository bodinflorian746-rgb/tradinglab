// Validation PURE des entrées de l'espace Group Admin (aucun accès DB/serveur →
// testable unitairement). Réutilisée par les Server Actions (lib côté serveur).

// Aucune limite MÉTIER de quantité ou de valeur (même décision explicite que
// pour les codes de déblocage de compte plus bas) : un admin de groupe peut
// générer autant de codes qu'il veut, avec la valeur qu'il veut. Les seuls
// plafonds ci-dessous sont des garde-fous TECHNIQUES (anti-timeout sur un lot
// d'insertion, anti-valeur absurde) — volontairement très larges pour ne
// jamais gêner un usage réel.
export const CODE_COUNT_MIN = 1;
export const CODE_COUNT_MAX = 5_000;
export const POINTS_VALUE_MIN = 1;
export const POINTS_VALUE_MAX = 1_000_000;

export type GenerateParamsError =
  | "invalid_count"
  | "invalid_value"
  | "invalid_expiry"
  | "expiry_not_future";

export type GenerateParams = {
  count: number;
  pointsValue: number;
  expiresAt: string | null; // ISO ou null
};

function toInt(raw: unknown): number | null {
  if (typeof raw === "number") return Number.isInteger(raw) ? raw : null;
  if (typeof raw === "string" && /^-?\d+$/.test(raw.trim())) return parseInt(raw.trim(), 10);
  return null;
}

/**
 * Valide les paramètres de génération de codes.
 *   • count entier dans [1, 5000] (garde-fou technique, pas une limite métier) ;
 *   • pointsValue entier dans [1, 1000000] (garde-fou technique, pas une limite métier) ;
 *   • expiresAt : vide/absent → null ; sinon date valide ET strictement future.
 * `nowMs` est injecté pour rester pur/déterministe.
 */
export function validateGenerateParams(
  raw: { count: unknown; pointsValue: unknown; expiresAt: unknown },
  nowMs: number,
): { ok: true; value: GenerateParams } | { ok: false; error: GenerateParamsError } {
  const count = toInt(raw.count);
  if (count === null || count < CODE_COUNT_MIN || count > CODE_COUNT_MAX) {
    return { ok: false, error: "invalid_count" };
  }
  const pointsValue = toInt(raw.pointsValue);
  if (pointsValue === null || pointsValue < POINTS_VALUE_MIN || pointsValue > POINTS_VALUE_MAX) {
    return { ok: false, error: "invalid_value" };
  }

  let expiresAt: string | null = null;
  const rawExp = raw.expiresAt;
  if (typeof rawExp === "string" && rawExp.trim() !== "") {
    const d = new Date(rawExp);
    if (Number.isNaN(d.getTime())) return { ok: false, error: "invalid_expiry" };
    if (d.getTime() <= nowMs) return { ok: false, error: "expiry_not_future" };
    expiresAt = d.toISOString();
  }

  return { ok: true, value: { count, pointsValue, expiresAt } };
}

// ─── Codes de déblocage de compte (access_codes) par groupe ──────────────────
// Un admin de groupe choisit librement entre 'lifetime' (aucune expiration
// effective) et 'duration' (durée en jours qu'il choisit lui-même) — jamais
// 'trial'/'broker', réservés au Super Admin via /admin/codes.
//
// Aucune limite MÉTIER de quantité ou de durée (décision explicite : un admin
// de groupe peut offrir autant d'accès gratuits qu'il veut, sans plafond ni
// protection de la monétisation). Les seuls plafonds ci-dessous sont des
// garde-fous TECHNIQUES (anti-timeout sur un lot d'insertion, anti-overflow
// sur une date) — volontairement très larges pour ne jamais gêner un usage
// réel.

export const ACCESS_CODE_COUNT_TECHNICAL_MAX = 5_000;
export const ACCESS_CODE_DURATION_DAYS_MAX = 36_500; // 100 ans

export type AccessCodeKind = "lifetime" | "duration";

export type AccessCodeGenerateParamsError =
  | "invalid_count"
  | "invalid_kind"
  | "invalid_duration"
  | "invalid_expiry"
  | "expiry_not_future";

export type AccessCodeGenerateParams = {
  count: number;
  kind: AccessCodeKind;
  durationDays: number | null; // requis (non-null) si kind === 'duration', sinon null
  expiresAt: string | null; // ISO ou null — délai de rédemption du code, distinct de la durée d'accès
};

/**
 * Valide les paramètres de génération de codes de déblocage de compte.
 *   • count entier ≥ 1 (garde-fou technique ACCESS_CODE_COUNT_TECHNICAL_MAX,
 *     pas une limite métier) ;
 *   • kind : 'lifetime' ou 'duration' ;
 *   • durationDays : requis et entier ≥ 1 si kind === 'duration' (garde-fou
 *     technique ACCESS_CODE_DURATION_DAYS_MAX) ;
 *   • expiresAt (délai de rédemption du CODE, optionnel) : vide/absent → null ;
 *     sinon date valide ET strictement future.
 * `nowMs` est injecté pour rester pur/déterministe.
 */
export function validateAccessCodeGenerateParams(
  raw: { count: unknown; kind: unknown; durationDays: unknown; expiresAt: unknown },
  nowMs: number,
): { ok: true; value: AccessCodeGenerateParams } | { ok: false; error: AccessCodeGenerateParamsError } {
  const count = toInt(raw.count);
  if (count === null || count < 1 || count > ACCESS_CODE_COUNT_TECHNICAL_MAX) {
    return { ok: false, error: "invalid_count" };
  }

  if (raw.kind !== "lifetime" && raw.kind !== "duration") {
    return { ok: false, error: "invalid_kind" };
  }

  let durationDays: number | null = null;
  if (raw.kind === "duration") {
    const d = toInt(raw.durationDays);
    if (d === null || d < 1 || d > ACCESS_CODE_DURATION_DAYS_MAX) {
      return { ok: false, error: "invalid_duration" };
    }
    durationDays = d;
  }

  let expiresAt: string | null = null;
  const rawExp = raw.expiresAt;
  if (typeof rawExp === "string" && rawExp.trim() !== "") {
    const d = new Date(rawExp);
    if (Number.isNaN(d.getTime())) return { ok: false, error: "invalid_expiry" };
    if (d.getTime() <= nowMs) return { ok: false, error: "expiry_not_future" };
    expiresAt = d.toISOString();
  }

  return { ok: true, value: { count, kind: raw.kind, durationDays, expiresAt } };
}

// ─── Magasin par groupe ──────────────────────────────────────────────────────

// MIN = 0 (pas 1) : un article gratuit est une décision produit valide,
// explicitement supportée par le schéma (group_shop_items.price_points >= 0)
// et par purchase_shop_item (aucun débit ledger si price_points = 0).
export const SHOP_ITEM_PRICE_MIN = 0;
export const SHOP_ITEM_PRICE_MAX = 1_000_000;
export const SHOP_ITEM_NAME_MAX_LENGTH = 120;
export const SHOP_ITEM_DESCRIPTION_MAX_LENGTH = 2000;

export const SHOP_ITEM_STOCK_MAX = 1_000_000_000;
export const SHOP_ITEM_IMAGE_URL_MAX_LENGTH = 2000;
// Même borne que la contrainte DB (migration 20260901150000) : un emoji
// composé (famille, ton de peau, ZWJ) peut compter plusieurs points de code.
export const SHOP_ITEM_EMOJI_MAX_LENGTH = 16;

export type ShopItemParamsError =
  | "invalid_name"
  | "invalid_description"
  | "invalid_type"
  | "invalid_price"
  | "invalid_stock"
  | "invalid_image_url"
  | "invalid_emoji";

export type ShopItemParams = {
  name: string;
  description: string | null;
  itemType: "product" | "reward";
  pricePoints: number;
  stock: number | null;
  imageUrl: string | null;
  emoji: string | null;
};

/**
 * Valide les paramètres de création/édition d'un article du magasin.
 *   • name : chaîne non vide après trim, ≤ 120 caractères ;
 *   • description : optionnelle, ≤ 2000 caractères, vide → null ;
 *   • itemType : 'product' ou 'reward' uniquement ;
 *   • pricePoints : entier dans [0, 1000000] — libre, aucun catalogue ni prix
 *     prédéfini ; 0 = article gratuit (décision produit valide).
 *   • stock : optionnel, vide/absent → null (illimité, jamais décrémenté),
 *     sinon entier dans [0, 1000000000] (garde-fou technique, pas métier).
 *   • imageUrl : optionnelle, ≤ 2000 caractères, vide → null. Aucune
 *     validation de format (URL publique ou chemin Storage — choix
 *     applicatif, cf. migration 20260724120000).
 *   • emoji : optionnel, ≤ 16 caractères (compté par point de code via
 *     `[...str]`, pas `.length`, pour ne pas sur-compter les emoji hors BMP),
 *     vide → null. Aucune validation de format : un simple champ texte court,
 *     pas de vérification que la valeur EST réellement un emoji.
 */
export function validateShopItemParams(raw: {
  name: unknown;
  description: unknown;
  itemType: unknown;
  pricePoints: unknown;
  stock?: unknown;
  imageUrl?: unknown;
  emoji?: unknown;
}): { ok: true; value: ShopItemParams } | { ok: false; error: ShopItemParamsError } {
  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  if (!name || name.length > SHOP_ITEM_NAME_MAX_LENGTH) {
    return { ok: false, error: "invalid_name" };
  }

  let description: string | null = null;
  if (typeof raw.description === "string" && raw.description.trim() !== "") {
    const d = raw.description.trim();
    if (d.length > SHOP_ITEM_DESCRIPTION_MAX_LENGTH) return { ok: false, error: "invalid_description" };
    description = d;
  }

  if (raw.itemType !== "product" && raw.itemType !== "reward") {
    return { ok: false, error: "invalid_type" };
  }

  const pricePoints = toInt(raw.pricePoints);
  if (pricePoints === null || pricePoints < SHOP_ITEM_PRICE_MIN || pricePoints > SHOP_ITEM_PRICE_MAX) {
    return { ok: false, error: "invalid_price" };
  }

  let stock: number | null = null;
  if (raw.stock !== undefined && raw.stock !== null && raw.stock !== "") {
    const s = toInt(raw.stock);
    if (s === null || s < 0 || s > SHOP_ITEM_STOCK_MAX) return { ok: false, error: "invalid_stock" };
    stock = s;
  }

  let imageUrl: string | null = null;
  if (typeof raw.imageUrl === "string" && raw.imageUrl.trim() !== "") {
    const u = raw.imageUrl.trim();
    if (u.length > SHOP_ITEM_IMAGE_URL_MAX_LENGTH) return { ok: false, error: "invalid_image_url" };
    imageUrl = u;
  }

  let emoji: string | null = null;
  if (typeof raw.emoji === "string" && raw.emoji.trim() !== "") {
    const e = raw.emoji.trim();
    if ([...e].length > SHOP_ITEM_EMOJI_MAX_LENGTH) return { ok: false, error: "invalid_emoji" };
    emoji = e;
  }

  return { ok: true, value: { name, description, itemType: raw.itemType, pricePoints, stock, imageUrl, emoji } };
}

// ─── Barème de points par groupe (group_point_rules) ─────────────────────────
// Une action ("Témoignage écrit", "Parrainage", ...) = un label libre + un
// nombre de points fixe > 0 (contrainte DB, cf. migration 20260828130000).
// Le slug est DÉRIVÉ du label à la création, jamais saisi ni modifiable
// ensuite : il est copié dans points_ledger.rule_slug à chaque crédit et sert
// d'identité stable de l'action dans l'historique, même si le label est
// renommé plus tard.

export const RULE_LABEL_MAX_LENGTH = 80;
export const RULE_POINTS_MIN = 1;
export const RULE_POINTS_MAX = 100_000;
export const RULE_SLUG_MAX_LENGTH = 40;

export type GroupPointRuleParamsError = "invalid_label" | "invalid_points";

export type GroupPointRuleParams = { label: string; points: number };

/**
 * Valide les paramètres de création/édition d'une règle de barème.
 *   • label : chaîne non vide après trim, ≤ 80 caractères ;
 *   • points : entier dans [1, 100000] (garde-fou technique — la contrainte
 *     DB n'exige que > 0, la borne haute évite une valeur absurde).
 */
export function validateGroupPointRuleParams(raw: {
  label: unknown;
  points: unknown;
}): { ok: true; value: GroupPointRuleParams } | { ok: false; error: GroupPointRuleParamsError } {
  const label = typeof raw.label === "string" ? raw.label.trim() : "";
  if (!label || label.length > RULE_LABEL_MAX_LENGTH) {
    return { ok: false, error: "invalid_label" };
  }
  const points = toInt(raw.points);
  if (points === null || points < RULE_POINTS_MIN || points > RULE_POINTS_MAX) {
    return { ok: false, error: "invalid_points" };
  }
  return { ok: true, value: { label, points } };
}

/**
 * Dérive un slug technique (a-z0-9_, ≤ 40 caractères) à partir d'un label
 * libre : minuscules, diacritiques retirés, tout caractère non [a-z0-9]
 * remplacé par "_", underscores dupliqués/en bord retirés. Ne garantit PAS
 * l'unicité (group_id, slug) — l'appelant retente avec un suffixe numérique
 * sur collision (23505), même principe que resolve_unique_username() côté SQL
 * pour les pseudos.
 */
export function deriveRuleSlug(label: string): string {
  const base = label
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, RULE_SLUG_MAX_LENGTH);
  return base || "action";
}

// ─── Bonus mensuel de complétion (group_completion_bonus) ────────────────────
// Un seul bonus par groupe : montant + ensemble d'actions du barème (par
// slug) qui doivent CHACUNE être créditées dans le mois pour déclencher le
// versement. Cf. migration 20260901160000 pour la logique complète.

export const COMPLETION_BONUS_POINTS_MIN = 1;
export const COMPLETION_BONUS_POINTS_MAX = 100_000;

export type CompletionBonusParamsError = "invalid_points" | "invalid_rules";

export type CompletionBonusParams = {
  points: number;
  ruleSlugs: string[];
  isActive: boolean;
};

/**
 * Valide les paramètres du bonus de complétion.
 *   • points : entier dans [1, 100000] (même style de garde-fou technique que
 *     RULE_POINTS_*) ;
 *   • ruleSlugs : dédoublonnés, filtrés contre `validSlugs` (les slugs des
 *     règles ACTIVES du groupe au moment de l'appel — un slug inconnu ou
 *     désactivé fourni par le client est silencieusement ignoré, jamais
 *     une confiance aveugle dans l'input) ; au moins 1 requis — un ensemble
 *     vide ne peut jamais être complété (cf. isCompletionSetFulfilled), donc
 *     on refuse de l'enregistrer plutôt que de créer un bonus inatteignable ;
 *   • isActive : coercé en booléen strict (`=== true`).
 */
export function validateCompletionBonusParams(
  raw: { points: unknown; ruleSlugs: unknown; isActive: unknown },
  validSlugs: ReadonlySet<string>,
): { ok: true; value: CompletionBonusParams } | { ok: false; error: CompletionBonusParamsError } {
  const points = toInt(raw.points);
  if (points === null || points < COMPLETION_BONUS_POINTS_MIN || points > COMPLETION_BONUS_POINTS_MAX) {
    return { ok: false, error: "invalid_points" };
  }

  const rawSlugs = Array.isArray(raw.ruleSlugs) ? raw.ruleSlugs : [];
  const ruleSlugs = [
    ...new Set(rawSlugs.filter((s): s is string => typeof s === "string" && validSlugs.has(s))),
  ];
  if (ruleSlugs.length === 0) return { ok: false, error: "invalid_rules" };

  return { ok: true, value: { points, ruleSlugs, isActive: raw.isActive === true } };
}

export type RevokeFailure = "not_found" | "wrong_group" | "not_revocable";

/**
 * Classe l'échec d'une révocation quand aucune ligne available du bon groupe n'a
 * été modifiée, à partir de la ligne réellement trouvée (par code = PK).
 *   • row absent            → not_found
 *   • row.group_id ≠ group  → wrong_group
 *   • sinon (statut ≠ available) → not_revocable
 */
export function classifyRevokeFailure(
  row: { group_id: string; status: string } | null,
  groupId: string,
): RevokeFailure {
  if (!row) return "not_found";
  if (row.group_id !== groupId) return "wrong_group";
  return "not_revocable";
}
