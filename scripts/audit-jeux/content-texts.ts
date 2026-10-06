// Textes affichés en français et en espagnol (leçons Trading, Macro, Stratégies,
// home, hub et pages des jeux, modules des jeux, schémas, dictionnaires FR / ES),
// extraits des sources pour les règles « termes interdits » et « orthographe ».
//
// Extraction par l'arbre syntaxique (compilateur TypeScript) : textes JSX et
// chaînes littérales, hors attributs techniques (className, href, d, fill…),
// imports, clés d'objet techniques et segments anglais (isEn ? …, en: …).
// Langue : détectée chaîne par chaîne (mots outils, accents) ; pour une chaîne
// trop courte, langue du fichier (page FR, _content-es, dictionaries/es…).
// L'anglais est ignoré (dictionaries/en n'est jamais lu).
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

export type Lang = "fr" | "es";
export interface ContentText { lang: Lang | "?"; file: string; line: number; text: string }

const ROOT = path.join(__dirname, "..", "..");
const rel = (p: string) => path.relative(ROOT, p).replace(/\\/g, "/");
const walk = (d: string): string[] => (fs.existsSync(d) ? fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)])) : []);

/** Fichiers sources affichés (FR / ES), hors anglais */
export function contentFiles(): string[] {
  const L = path.join(ROOT, "app", "[locale]");
  const files = [
    ...walk(path.join(L, "(premium)", "formations")),
    ...walk(path.join(L, "(premium)", "strategies")),
    ...walk(path.join(L, "(premium)", "jeux")),
    ...walk(path.join(L, "_home")),
    ...walk(path.join(L, "pricing")),
    ...walk(path.join(ROOT, "app", "components", "charts")),
    ...walk(path.join(ROOT, "app", "components", "games")),
    ...["LessonPage.tsx", "LessonQuiz.tsx", "LessonKeyPoints.tsx", "LessonExercice.tsx", "LessonTemplate.tsx", "StrategyModuleIndex.tsx"].map((f) => path.join(ROOT, "app", "components", f)),
    ...["lessons.ts", "lessons-es.ts", "formations.ts", "strategies.ts"].map((f) => path.join(ROOT, "lib", f)),
    ...walk(path.join(ROOT, "lib", "games")).filter((f) => !/-en\.ts$/.test(f)),
    ...walk(path.join(ROOT, "lib", "trader-profile")),
    ...walk(path.join(ROOT, "dictionaries", "fr")),
    ...walk(path.join(ROOT, "dictionaries", "es")),
  ];
  return [...new Set(files)].filter((f) => fs.existsSync(f) && /\.(tsx?|json)$/.test(f)
    && !/_content-en\.tsx$|LegacyHomeEn\.tsx$|\.test\.ts$|lessons-en\.ts$|\.d\.ts$/.test(f));
}

const fileLang = (f: string): Lang | null => {
  const r = rel(f);
  if (/_content-es\.tsx$|-es\.ts$|lessons-es\.ts$|dictionaries\/es\//.test(r)) return "es";
  if (/_content-fr\.tsx$|dictionaries\/fr\/|lib\/(lessons|formations|strategies)\.ts$/.test(r)) return "fr";
  if (/lib\/games\/[a-z-]+\.ts$/.test(r)) return "fr";
  return null;
};

const FR_WORDS = /(?<![\p{L}])(le|la|les|des|est|une|du|et|pour|dans|avec|qui|pas|sur|au|aux|ce|cette|tu|ton|ta|tes|leur|ou|plus|mais|sont|être|à|où|ça|très|après|déjà|il|elle|on)(?![\p{L}])/giu;
const ES_WORDS = /(?<![\p{L}])(el|los|las|del|es|una|y|para|en|con|por|al|este|esta|tus|se|pero|muy|más|ya|después|también|está|cuando|qué|cómo|lo|su|sus)(?![\p{L}])/giu;
const EN_WORDS = /(?<![\p{L}])(the|is|and|of|to|you|your|with|for|this|that|are|on|it|be|by|from|or|an|at|not|will|can|has|have|was|which|when|into|than|its|their)(?![\p{L}])/giu;
export function detectLang(text: string): Lang | "en" | "?" {
  const fr = (text.match(FR_WORDS) || []).length + (/[àâçèêëîïôûùœ]/i.test(text) ? 2 : 0);
  const es = (text.match(ES_WORDS) || []).length + (/[ñ¿¡áíóú]/i.test(text) ? 2 : 0);
  const en = (text.match(EN_WORDS) || []).length;
  const best = Math.max(fr, es, en);
  if (best === 0) return "?";
  if (en === best && en > fr && en > es) return "en";
  if (fr === es) return "?";
  return fr > es ? "fr" : "es";
}

// Attributs JSX et clés d'objet qui ne portent pas de texte affiché
const CODE_KEYS = new Set(["className", "class", "href", "src", "d", "fill", "stroke", "id", "key", "type", "viewBox", "rel", "target", "xmlns",
  "fontWeight", "fontFamily", "textAnchor", "strokeLinecap", "strokeLinejoin", "strokeDasharray", "preserveAspectRatio", "role", "style",
  "formationId", "lessonId", "locale", "lang", "as", "name", "method", "encType", "autoComplete", "inputMode", "pattern", "icon", "color",
  "variant", "size", "kind", "tone", "accent", "dir", "dotClass", "textClass", "valueClass", "colorClass", "slug", "path", "url", "mode",
  "direction", "htfBias", "macroContext", "chartShape", "category", "correctMistake", "decoyMistakes", "difficulties", "showLines", "metric",
  "correctAnswer", "optimal", "metaOverride", "level", "duration", "session", "asset", "volatility", "spread", "outcome", "result", "state",
  "data-reveal", "data-pick", "data-choice", "data-line", "data-label-for", "aria-hidden", "transform", "transformOrigin", "fontSize", "opacity", "tags", "moduleId"]);
const looksLikeCode = (s: string) => {
  const t = s.trim();
  if (!/\p{L}{2}/u.test(t)) return true;
  // Classes CSS, chemins, identifiants, couleurs
  if (!/\s/.test(t) && /[-_:/.\[\]#()=@]/.test(t) && !/^[\p{Lu}]?[\p{Ll}'’-]+[.,!?…]?$/u.test(t)) return true;
  if (/^(?:[a-z0-9]+(?:[-:/.\[\]#%()!_][a-z0-9.%#()\[\]/]*)+\s+){2,}/i.test(t + " ") && /(?:^|\s)(?:flex|grid|text-|bg-|border|rounded|px-|py-|mt-|mb-|gap-|w-|h-|font-|items-|justify-|hidden|block|relative|absolute)/.test(t)) return true;
  if (/^(?:[a-z]+[A-Z]\w*|[A-Z_]{2,}[A-Z0-9_]*)$/.test(t)) return true;
  if (/^(?:use |@\/|\.\.?\/|https?:|mailto:|rgba?\(|var\(--)/i.test(t)) return true;
  return false;
};

/** Langue imposée par le code autour de la chaîne : ternaires sur la locale,
 *  propriétés fr / es / en, constantes nommées …_FR / …_ES / …_EN. */
let varLang: Lang | null = null;
function branchLang(node: ts.Node, sf: ts.SourceFile): Lang | "en" | null {
  varLang = null;
  let cur: ts.Node = node;
  let notEs = false, notEn = false;
  while (cur.parent) {
    const p = cur.parent;
    if (ts.isConditionalExpression(p) && (p.whenTrue === cur || p.whenFalse === cur)) {
      const c = p.condition.getText(sf);
      const yes = (p.whenTrue === cur) !== (/^\s*!/.test(c) || /!==/.test(c));
      if (/\bisEs\b|["']es["']/.test(c)) { if (yes) return "es"; notEs = true; }
      else if (/\bisEn\b|["']en["']/.test(c)) { if (yes) return "en"; notEn = true; }
      else if (/\bisFr\b|["']fr["']/.test(c)) { if (yes) return "fr"; }
      if (notEs && notEn) return "fr";
    }
    if (ts.isPropertyAssignment(p) && p.initializer === cur) {
      const n = p.name.getText(sf).replace(/["']/g, "");
      if (n === "fr" || n === "es") return n;
      if (n === "en") return "en";
    }
    if (ts.isVariableDeclaration(p) && ts.isIdentifier(p.name)) {
      const v = p.name.text;
      if (/_FR$|[a-z0-9]Fr$/.test(v)) varLang ??= "fr"; // indice faible : un texte non traduit peut y figurer
      else if (/_ES$|[a-z0-9]Es$/.test(v)) varLang ??= "es";
      if (/_EN$|[a-z0-9]En$/.test(v)) return "en";
    }
    cur = p;
  }
  return null;
}
// Indices nets d'une langue (mots outils propres à chacune) : texte non traduit dans un fichier de l'autre langue
const FR_ONLY = /(?<![\p{L}])(le|les|des|est|du|et|pour|dans|avec|qui|pas|sur|au|aux|ce|cette|tu|ton|ta|tes|ou|mais|sont|être|à|où|très|après|il|elle|on|ne|nous|vous|quand|sous|vers)(?![\p{L}])/giu;
const ES_ONLY = /(?<![\p{L}])(el|los|las|del|es|y|para|con|por|al|este|esta|tus|pero|muy|más|ya|está|cuando|qué|cómo|lo|su|sus|una|unos|unas|como|hacia|sobre|bajo|sin|entre|desde|hasta)(?![\p{L}])/giu;
function strongly(t: string, d: Lang): boolean {
  // Lettres propres à chaque langue (è ê à ç ù… / ñ ¿ ¡) : 2 points
  const fr = (t.match(FR_ONLY) || []).length + (/[èêàçùûîôœ]/i.test(t) ? 2 : 0);
  const es = (t.match(ES_ONLY) || []).length + (/[ñ¿¡]/.test(t) ? 2 : 0);
  const [a, b] = d === "fr" ? [fr, es] : [es, fr];
  return a >= b + 3 || (b === 0 && a >= 2);
}

function extractTs(file: string): ContentText[] {
  const raw = fs.readFileSync(file, "utf8");
  const sf = ts.createSourceFile(file, raw, ts.ScriptTarget.Latest, true, file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const keyLits = new Set<string>();
  const collectKeys = (n: ts.Node) => { if (ts.isElementAccessExpression(n) && ts.isStringLiteral(n.argumentExpression)) keyLits.add(n.argumentExpression.text); ts.forEachChild(n, collectKeys); };
  collectKeys(sf);
  const fixed = fileLang(file);
  const out: ContentText[] = [];
  const push = (text: string, node: ts.Node) => {
    const t = text.replace(/\s+/g, " ").replace(/&apos;|&#39;/g, "'").replace(/&quot;/g, "\"").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&gt;/g, ">").replace(/&lt;/g, "<").trim();
    if (!t || looksLikeCode(t)) return;
    // 1. Branche de langue dans le code (isEs ? … : isEn ? … : …, { fr, es, en }, LABELS_ES…)
    const b = branchLang(node, sf);
    if (b === "en") return;
    let lang: Lang | "?";
    if (b) lang = b;
    else {
      const d = detectLang(t);
      if (d === "en") return;
      // 2. Fichier d'une seule langue : sa langue, sauf indices nettement contraires
      const fx = varLang ?? fixed;
      if (fx && d !== "?" && d !== fx) lang = strongly(t, d) ? d : fx;
      // 3. Chaîne courte sans indice : langue du fichier ; sinon détection
      else lang = d === "?" ? (fx ?? "?") : d;
    }
    out.push({ lang, file: rel(file), line: sf.getLineAndCharacterOfPosition(node.getStart()).line + 1, text: t });
  };
  const isEnglishBranch = (node: ts.Node): boolean => {
    // isEn ? "…" : …  /  locale === "en" ? "…"  /  { en: "…" }
    const p = node.parent;
    if (ts.isConditionalExpression(p) && p.whenTrue === node) {
      const c = p.condition.getText(sf);
      if (/\bisEn\b|===\s*["']en["']/.test(c)) return true;
    }
    if (ts.isPropertyAssignment(p) && p.initializer === node && /^["']?en["']?$/.test(p.name.getText(sf))) return true;
    return false;
  };
  const skipKey = (node: ts.Node): boolean => {
    const p = node.parent;
    if (ts.isJsxAttribute(p) || (ts.isJsxExpression(p) && ts.isJsxAttribute(p.parent))) {
      const attr = ts.isJsxAttribute(p) ? p : (p.parent as ts.JsxAttribute);
      return CODE_KEYS.has(attr.name.getText(sf));
    }
    if (ts.isPropertyAssignment(p) && p.initializer === node) return CODE_KEYS.has(p.name.getText(sf).replace(/["']/g, ""));
    if (ts.isPropertyAssignment(p) && p.name === node) return true;           // clé d'objet
    if (ts.isImportDeclaration(p) || ts.isExportDeclaration(p) || ts.isExternalModuleReference(p)) return true;
    if (ts.isElementAccessExpression(p) || ts.isLiteralTypeNode(p)) return true;
    // Valeur utilisée ailleurs dans le fichier comme clé (seqs["pré-news"]) : identifiant de données
    if ((ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) && keyLits.has(node.text)) return true;
    if (ts.isBinaryExpression(p) && /^(===|!==|==|!=)$/.test(p.operatorToken.getText(sf))) return true; // comparaisons
    if (ts.isCaseClause(p)) return true;
    // Listes techniques ({ tags: ["fakeout", …] }) et identifiants passés en argument (markLessonComplete(p, "multi-timeframe", …))
    if (ts.isArrayLiteralExpression(p) && ts.isPropertyAssignment(p.parent) && CODE_KEYS.has(p.parent.name.getText(sf).replace(/["']/g, ""))) return true;
    if (ts.isCallExpression(p) && (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(node.text)) return true;
    if (ts.isCallExpression(p) && /\b(?:includes|startsWith|endsWith|test|match|replace|split|get|set|has|querySelector\w*|getAttribute|setAttribute|addEventListener|logGameEvent|useState)$/.test(p.expression.getText(sf))) return true;
    return false;
  };
  const visit = (node: ts.Node) => {
    if (ts.isJsxText(node)) push(node.getText(sf), node);
    else if ((ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) && !skipKey(node) && !isEnglishBranch(node)) push(node.text, node);
    else if (ts.isTemplateExpression(node) && !skipKey(node) && !isEnglishBranch(node)) {
      push(node.head.text, node);
      node.templateSpans.forEach((s) => push(s.literal.text, s));
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return out;
}

function extractJson(file: string): ContentText[] {
  const out: ContentText[] = [];
  const fixed = fileLang(file) ?? "?";
  const walkJson = (v: unknown) => {
    if (typeof v === "string") { const t = v.replace(/\s+/g, " ").trim(); if (t && !looksLikeCode(t)) out.push({ lang: fixed, file: rel(file), line: 0, text: t }); }
    else if (Array.isArray(v)) v.forEach(walkJson);
    else if (v && typeof v === "object") Object.values(v).forEach(walkJson);
  };
  walkJson(JSON.parse(fs.readFileSync(file, "utf8")));
  return out;
}

export function collectContentTexts(): ContentText[] {
  return contentFiles().flatMap((f) => (f.endsWith(".json") ? extractJson(f) : extractTs(f)));
}
