// Langues auditées : celles ouvertes aux visiteurs (i18n/config.ts, ACTIVE_LOCALES).
// Une langue désactivée (redirigée vers le FR) n'est plus contrôlée ; elle le
// redevient dès qu'on la rajoute à ACTIVE_LOCALES. Utilisé par les règles de
// l'audit des jeux (vite-node) ; run.mjs et dom.mjs lisent la même liste via
// langues-node.mjs.
import { ACTIVE_LOCALES } from "../../i18n/config";

export const LANGUES_AUDITEES: readonly string[] = ACTIVE_LOCALES;

/** Vrai si la langue est auditée (texte de langue inconnue « ? » : toujours). */
export const auditee = (lang: string) => lang === "?" || LANGUES_AUDITEES.includes(lang);
