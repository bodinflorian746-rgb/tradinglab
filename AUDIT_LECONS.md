# AUDIT_LECONS.md — Audit visuel & structurel des leçons Intermédiaire et Avancé
> Généré le 2026-04-23 — Rapport uniquement, aucun fichier modifié.

---

## Synthèse globale

| Leçon | FAIL | WARN | Composants SVG | Notes |
|-------|------|------|----------------|-------|
| interm/lecon1 | 1 | 0 | MarketStructureDiagram×2, BOSDiagram, CHoCHDiagram | ✅ Référence Sprint 1 — 1 résidu violet |
| interm/lecon2 | 1 | 0 | SupportResistance, Candle×2 | Label violet seul |
| interm/lecon3 | 2 | 0 | Candle×2 | Label violet + ASCII Supply/Demand |
| interm/lecon4 | 2 | 1 | aucun | Label violet + ASCII structure + sans visuel |
| interm/lecon5 | 3 | 1 | aucun | Label violet + yellow-400 + ASCII confluence + sans visuel |
| interm/lecon6 | 1 | 0 | GraphFakeBreakout, Candle | Label violet — SVG directement après |
| interm/lecon7 | 2 | 1 | aucun | Label violet + ASCII multi-TF + sans visuel |
| interm/lecon8 | 2 | 1 | aucun | Label violet + font-mono table + sans visuel |
| interm/lecon9 | 2 | 1 | aucun | Label violet + ASCII Fibonacci + sans visuel |
| avance/lecon1 | 0 | 6 | aucun | 5 blocs structurels manquants + sans visuel |
| avance/lecon2 | 0 | 6 | aucun | 5 blocs structurels manquants + sans visuel |
| avance/lecon3 | 0 | 6 | aucun | 5 blocs structurels manquants + sans visuel |
| avance/lecon4 | 1 | 6 | aucun | purple-500 carte "London Close" + 5 blocs manquants + sans visuel |
| avance/lecon5 | 0 | 6 | aucun | 5 blocs structurels manquants + sans visuel |
| avance/lecon6 | 0 | 6 | aucun | 5 blocs structurels manquants + sans visuel |
| avance/lecon7 | 1 | 6 | aucun | purple-500 carte "Méthode 2" + 5 blocs manquants + sans visuel |
| avance/lecon8 | 0 | 6 | aucun | 5 blocs structurels manquants + sans visuel |
| avance/lecon9 | 0 | 6 | aucun | 5 blocs structurels manquants + sans visuel |

**Total FAIL : 18 occurrences** (réparties sur 11 leçons)  
**Total WARN : 55 occurrences** (réparties sur 14 leçons)

---

## Détail par problème

---

### Problèmes FAIL (à corriger obligatoirement)

---

#### FAIL 1 — Label "Schéma visuel" violet (text-purple-400)

Présent dans **9 leçons sur 9** du niveau Intermédiaire. Le label uppercase `Schéma visuel` est systématiquement rendu en `text-purple-400`, couleur "info secondaire" que le design system reserve à des usages différents. Ce pattern a été introduit uniformément avant Sprint 1 et n'a pas été corrigé, y compris dans la leçon de référence.

Fichiers concernés :

| Fichier | Ligne | Extrait |
|---------|-------|---------|
| `intermediaire/lecon1/page.tsx` | 50 | `<p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Schéma visuel</p>` |
| `intermediaire/lecon2/page.tsx` | 46 | `<p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-3">Schéma visuel</p>` |
| `intermediaire/lecon3/page.tsx` | 45 | `<p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-4">Schéma visuel</p>` |
| `intermediaire/lecon4/page.tsx` | 47 | `<p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-4">Schéma visuel</p>` |
| `intermediaire/lecon5/page.tsx` | 35 | `<p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-4">Schéma visuel</p>` |
| `intermediaire/lecon6/page.tsx` | 43 | `<p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Schéma visuel</p>` |
| `intermediaire/lecon7/page.tsx` | 47 | `<p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-4">Schéma visuel</p>` |
| `intermediaire/lecon8/page.tsx` | 41 | `<p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-4">Schéma visuel</p>` |
| `intermediaire/lecon9/page.tsx` | 47 | `<p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-4">Schéma visuel</p>` |

---

#### FAIL 2 — Couleurs hors palette

**Occurrence A — text-yellow-400 / bg-yellow-500**

Fichier : `intermediaire/lecon5/page.tsx`, ligne 57

La carte "Niveau psychologique" dans la section "Les confluences à combiner" utilise `text-yellow-400`, `bg-yellow-500/5`, `border-yellow-500/15`. La couleur `yellow` n'est pas dans la palette autorisée. Les couleurs proches autorisées sont `amber-400/500` (warning) et `orange-500` (erreur classique).

```tsx
{ label: "Niveau psychologique", ...,
  color: "bg-yellow-500/5 border-yellow-500/15 text-yellow-400" },
```

---

**Occurrence B — bg-purple-500 / text-purple-400 (carte thématique)**

Fichier : `avance/lecon4/page.tsx`, lignes 58–62

La killzone "London Close" utilise `bg-purple-500/5 border-purple-500/15 text-purple-400` comme couleur de carte thématique (au même rang que emerald, orange, blue pour les autres killzones). Ce n'est pas un label "info secondaire" — c'est un accent de contenu non référencé dans la palette.

```tsx
{
  name: "London Close",
  hours: "16h00 – 17h00",
  color: "bg-purple-500/5 border-purple-500/15 text-purple-400",
  ...
},
```

---

**Occurrence C — bg-purple-500 / text-purple-400 (carte de méthode)**

Fichier : `avance/lecon7/page.tsx`, lignes 48–51

La carte "2. Entrée sur retest d'un niveau cassé" dans la section "3 méthodes d'entrée de précision" utilise `bg-purple-500/5 border-purple-500/15` / `text-purple-400` comme accent de méthode (au même rang que blue-400 et orange-400 pour les deux autres méthodes). Même dérive que l'occurrence B.

```tsx
{
  title: "2. Entrée sur retest d'un niveau cassé",
  color: "bg-purple-500/5 border-purple-500/15",
  accentColor: "text-purple-400",
  ...
},
```

---

#### FAIL 3 — Schémas ASCII / pseudo-graphiques textuels

Les blocs suivants sont des tentatives de représenter des graphiques de prix, des structures de marché ou des flux de décision à l'aide de caractères Unicode (│ ── ▓ ↗ ↘ ·) en `font-mono`, alors que le design system impose du SVG pour toute représentation visuelle.

---

**Occurrence A — Supply & Demand (zones ▓▓▓▓)**

Fichier : `intermediaire/lecon3/page.tsx`, lignes 46–56

Zone Supply/Demand simulée avec des caractères ▓ (FULL BLOCK) et des flèches ↑↑↑ / ↓↓↓ en `font-mono`. Simule explicitement une structure de prix avec des zones.

```tsx
<div className="font-mono text-xs space-y-3">
  <div>
    <p><span className="text-red-400 font-bold">Zone Supply</span>
       <span className="text-zinc-700">▓▓▓▓▓▓▓▓</span>
       <span className="text-zinc-600">← institutions ont vendu ici</span></p>
    <p className="text-red-400 pl-2">↓ ↓ ↓ &nbsp; départ impulsif baissier</p>
  </div>
  <p className="text-zinc-800">· · · · · · · · · · · · · · · · · · · · ·</p>
  <div>
    <p className="text-emerald-400 pl-2">↑ ↑ ↑ &nbsp; départ impulsif haussier</p>
    <p><span className="text-emerald-400 font-bold">Zone Demand</span>
       <span className="text-zinc-700">▓▓▓▓▓▓▓▓</span> ...</p>
  </div>
</div>
```

---

**Occurrence B — Structure de marché HH/HL et LH/LL (·, ↗, ↘)**

Fichier : `intermediaire/lecon4/page.tsx`, lignes 48–64

Grille `grid-cols-2 font-mono` simulant la structure de marché haussière et baissière avec des points `·`, des labels `HH`, `HL`, `LH`, `LL` et des flèches Unicode ↗ ↘. Représentation d'une structure de prix en texte.

```tsx
<div className="grid grid-cols-2 gap-6 font-mono text-xs">
  <div className="space-y-1">
    <p className="text-emerald-400 font-bold mb-2">HAUSSIER ↑</p>
    <p className="text-zinc-300">· · HH <span className="text-emerald-400">↑</span></p>
    <p className="text-zinc-400">· HL ↗ <span className="text-emerald-400 text-[10px]">← entre ici</span></p>
    ...
  </div>
  ...
</div>
```

> **Note** : ce bloc remplaçait le schéma textuel d'interm/lecon1 AVANT Sprint 1. Dans lecon4, il subsiste sans équivalent SVG.

---

**Occurrence C — Flux de confluences (───────────)**

Fichier : `intermediaire/lecon5/page.tsx`, lignes 36–44

Flux de décision "4 confluences → ENTRÉE ACHAT" dessiné avec des tirets U+2500 (`───────────`) en `font-mono`. Simule un diagramme de flux avec des connecteurs textuels.

```tsx
<div className="font-mono text-xs space-y-1.5">
  <p><span className="text-emerald-400">✔</span>
     <span className="text-zinc-300">Tendance Daily</span>
     <span className="text-zinc-700">───────────</span>
     <span className="text-emerald-400">haussier</span></p>
  <p><span className="text-emerald-400">✔</span>
     <span className="text-zinc-300">Zone S/R</span>
     <span className="text-zinc-700">───────────</span>
     <span className="text-emerald-400">support 1.0850</span></p>
  ...
  <p className="text-white font-bold">→ ENTRÉE ACHAT</p>
</div>
```

---

**Occurrence D — Multi-Timeframe Top-Down (──, ↓ en cascade)**

Fichier : `intermediaire/lecon7/page.tsx`, lignes 48–57

Flux top-down Daily → H4 → M15 → Entrée dessiné avec `──` et `↓` en `font-mono`. Simule un arbre de décision avec des caractères de tirets.

```tsx
<div className="font-mono text-xs space-y-1.5">
  <p><span className="text-emerald-400 font-bold">Daily</span>
     <span className="text-zinc-700">──</span> biais
     <span className="text-zinc-700">──</span>
     <span className="text-emerald-400">↑ haussier</span>
     <span className="text-zinc-700">/ ↓ baissier</span></p>
  <p className="text-zinc-700 pl-8">↓</p>
  <p><span className="text-blue-400 font-bold">H4</span>
     <span className="text-zinc-700">──</span> zone
     <span className="text-zinc-700">──</span>
     <span className="text-blue-400">support / résistance</span></p>
  ...
</div>
```

---

**Occurrence E — Table "AVANT / PENDANT le trade" (font-mono, →, ✔)**

Fichier : `intermediaire/lecon8/page.tsx`, lignes 42–60

Tableau de processus "Avant/Pendant le trade" en `grid-cols-2 font-mono`. Utilise `✔` et `→` pour simuler une check-list de procédure. Pas un graphique de prix, mais labelisé "Schéma visuel" et rendu en font-mono avec caractères pseudo-graphiques. Signé comme FAIL car il est dans le bloc "Schéma visuel" avec un rendu mono tabular.

```tsx
<div className="grid grid-cols-2 gap-4 font-mono text-xs">
  <div>
    <p className="text-blue-400 font-bold mb-2">AVANT le trade</p>
    <p className="text-zinc-300"><span className="text-emerald-400">✔</span> Biais défini</p>
    ...
  </div>
  <div>
    <p className="text-orange-400 font-bold mb-2">PENDANT le trade</p>
    <p className="text-zinc-300">→ Tu exécutes</p>
    ...
  </div>
</div>
```

---

**Occurrence F — Retracement Fibonacci (│, ●, ──)**

Fichier : `intermediaire/lecon9/page.tsx`, lignes 48–57

Représentation ASCII d'un outil de retracement Fibonacci complet : barre verticale `│` simulant l'axe de prix, `●` pour les swing points, `──` pour les niveaux. Simule explicitement un graphique de prix avec niveaux.

```tsx
<div className="font-mono text-xs space-y-1">
  <p><span className="text-zinc-300 font-bold">●</span> Swing High <span className="text-zinc-500">1.0980</span></p>
  <p className="text-zinc-700">│ &nbsp;23.6% <span className="text-zinc-500">── 1.0937</span></p>
  <p className="text-zinc-700">│ &nbsp;38.2% <span className="text-blue-400">── 1.0911</span> <span className="text-zinc-700">← modéré</span></p>
  <p className="text-zinc-700">│ &nbsp;50%   <span className="text-orange-400">── 1.0890</span> <span className="text-zinc-700">← psychologique</span></p>
  <p className="text-zinc-700">│ &nbsp;61.8% <span className="text-emerald-400 font-bold">── 1.0869</span> <span className="text-emerald-400">← GOLDEN RATIO ★</span></p>
  <p className="text-zinc-700">│ &nbsp;78.6% <span className="text-zinc-500">── 1.0838</span></p>
  <p><span className="text-zinc-300 font-bold">●</span> Swing Low  <span className="text-zinc-500">1.0800</span></p>
</div>
```

---

### Problèmes WARN (à évaluer)

---

#### WARN 5 — Structure de leçon incomplète (niveau Avancé, systématique)

Les 9 leçons du niveau Avancé suivent une architecture différente des leçons Intermédiaire : elles n'intègrent pas les blocs pédagogiques standardisés définis dans le design system. Les blocs suivants sont **absents de toutes les leçons avancées (lecon1 à lecon9)** :

| Bloc manquant | Label attendu | Couleur attendue |
|--------------|---------------|-----------------|
| "Ce que tu dois voir sur le graphique" | `text-emerald-400 uppercase tracking-widest` | Emerald |
| "Comment analyser en 5 secondes" | `text-blue-400 uppercase tracking-widest` | Blue |
| "Ce que tu dois faire" | `text-amber-400 uppercase tracking-widest` | Amber |
| Bloc "Erreur classique" | `text-orange-400 uppercase tracking-widest` | `border-orange-500/20 bg-orange-500/5` |
| Bloc "Résumé en 3 secondes" | `text-emerald-400 uppercase tracking-widest` | Zinc-900/30 avec ✔/~/✖ |

Blocs **présents** dans toutes les leçons avancées :
- Séparateur "Révision" ✓
- `<LessonKeyPoints>` ✓
- `<LessonExercice>` ✓
- `<LessonQuiz>` ✓

**Leçons concernées** : avance/lecon1, lecon2, lecon3, lecon4, lecon5, lecon6, lecon7, lecon8, lecon9

---

#### WARN 7 — Leçons sans aucun composant SVG

Les leçons suivantes ne contiennent **aucun import** depuis `@/app/components/charts/` et reposent uniquement sur du texte, des cartes et (pour certaines) des schémas ASCII déjà signalés ci-dessus.

**Niveau Intermédiaire — candidats prioritaires :**

| Leçon | Sujet | Schéma existant |
|-------|-------|-----------------|
| `intermediaire/lecon4` | Tendances HH/HL et LH/LL | ASCII grid-cols-2 (FAIL 3-B) |
| `intermediaire/lecon5` | Confluences et probabilité | ASCII flow `───────────` (FAIL 3-C) |
| `intermediaire/lecon7` | Analyse Multi-Timeframe | ASCII top-down `──↓──` (FAIL 3-D) |
| `intermediaire/lecon8` | Plan de trade | font-mono table (FAIL 3-E) |
| `intermediaire/lecon9` | Fibonacci — retracements | ASCII Fibonacci `│──●` (FAIL 3-F) |

**Niveau Avancé — 9 leçons sans visuel :**

| Leçon | Sujet |
|-------|-------|
| `avance/lecon1` | Liquidité (BSL/SSL, Stop Hunts) |
| `avance/lecon2` | Fair Value Gap |
| `avance/lecon3` | Order Blocks |
| `avance/lecon4` | Killzones |
| `avance/lecon5` | OTE — Optimal Trade Entry |
| `avance/lecon6` | Stop Hunts |
| `avance/lecon7` | Entrées de précision |
| `avance/lecon8` | Journaling |
| `avance/lecon9` | Backtesting |

---

## Leçons sans aucun visuel

14 leçons sur 18 ne contiennent aucun composant SVG :

**Intermédiaire (5) :**
- `intermediaire/lecon4` — Tendances
- `intermediaire/lecon5` — Confluences
- `intermediaire/lecon7` — Multi-Timeframe
- `intermediaire/lecon8` — Plan de trade
- `intermediaire/lecon9` — Fibonacci

**Avancé (9) — intégralité du niveau :**
- `avance/lecon1` — Liquidité
- `avance/lecon2` — Fair Value Gap
- `avance/lecon3` — Order Blocks
- `avance/lecon4` — Killzones
- `avance/lecon5` — OTE
- `avance/lecon6` — Stop Hunts
- `avance/lecon7` — Entrées de précision
- `avance/lecon8` — Journaling
- `avance/lecon9` — Backtesting

---

## Recommandations prioritaires

### Priorité 1 — Corriger les labels "Schéma visuel" violets (FAIL 1 × 9)

**Impact :** 9 leçons, correction identique à chaque fois. Changer `text-purple-400` → `text-zinc-500` sur le label `Schéma visuel` dans toutes les leçons Intermédiaire. Correction mécanique, très faible risque.

> Remarque : le label "Schéma visuel" n'a pas d'équivalent dans la liste des labels standards. Une alternative serait de le supprimer (les composants SVG sont auto-explicites) ou de lui attribuer `text-zinc-500` si un label est souhaité.

---

### Priorité 2 — Remplacer les 6 blocs ASCII par des composants SVG (FAIL 3 × 6)

**Impact pédagogique maximal.** Les leçons intermédiaires 3, 4, 5, 7, 8 et 9 ont toutes un schéma visuel dont le rendu actuel est techniquement invalide (ASCII) et visuellement inférieur. Chacun correspond à un concept tradeable concret qui bénéficierait d'un composant SVG dédié :

| Leçon | Concept | Composant SVG suggéré |
|-------|---------|----------------------|
| lecon3 | Supply/Demand zones impulsives | `SupplyDemandDiagram` (zone + flèche impulsive) |
| lecon4 | Tendances HH/HL en escalier | `TrendDiagram` (variante de `MarketStructureDiagram`) |
| lecon5 | Flux de confluences → entrée | `ConfluenceDiagram` (checklist visuelle SVG) |
| lecon7 | Top-Down Daily→H4→M15 | `MultiTimeframeDiagram` (3 panels empilés) |
| lecon8 | Avant/Pendant le trade | `TradePlanDiagram` (2 colonnes SVG) |
| lecon9 | Retracement Fibonacci | `FibonacciDiagram` (axe vertical + niveaux) |

---

### Priorité 3 — Enrichir les leçons Avancé avec blocs structurels et visuels (WARN 5+7 × 9)

**Impact structurel.** Les 9 leçons avancées forment un niveau homogène mais sans les blocs pédagogiques qui font la signature d'EDGETRADE (Erreur classique, Résumé en 3 secondes, Ce que tu dois voir, etc.). Elles sont également les seules à n'avoir aucun composant SVG, alors qu'elles traitent de concepts institutionnels visuellement complexes (FVG, OB, liquidité, OTE) qui se prêteraient particulièrement bien à des schémas.

Ordre d'impact suggéré pour les visuels avancés :
1. `avance/lecon2` — Fair Value Gap (3 bougies avec gap visible = SVG simple à forte valeur pédagogique)
2. `avance/lecon1` — Liquidité / EQH / EQL (niveau répété avec stop hunt = extension de `BOSDiagram`)
3. `avance/lecon3` — Order Block (dernière bougie opposée avant impulsion = extension de `Candle`)

---

*Fichier créé : `AUDIT_LECONS.md` — aucun autre fichier modifié.*
