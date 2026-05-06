# AUDIT_DEBUTANT.md — Niveau Débutant : Inventaire et audit complet

Date : 2026-04-24

---

## Section 1 — Inventaire des diagrammes Débutant

### 1.1 TradeDiagram

| Attribut | Valeur |
|---|---|
| **Localisation** | `app/formations/debutant/lecon1/page.tsx` lignes 438–469 |
| **Leçon** | Leçon 1 — "C'est quoi le trading ?" |
| **Description** | Deux mini-graphiques SVG côte à côte : une courbe verte ascendante (trade gagnant +2 000 €) et une courbe rouge descendante (trade perdant −1 500 €). Points d'entrée/sortie annotés avec valeurs. |
| **Type** | Graphique de prix simplifié / comparaison gain-perte |

---

### 1.2 CandleDiagram

| Attribut | Valeur |
|---|---|
| **Localisation** | `app/formations/debutant/_components/DebutantLessonView.tsx` lignes 12–70 |
| **Leçon** | Leçon 3 — "Lire un graphique en bougies" (via `diagram: "candle"` dans lessons.ts) |
| **Description** | SVG 420×240 montrant côte à côte une bougie verte (haussière) et une bougie rouge (baissière) avec leurs 4 composantes labelisées : High, Close, Open, Low + label "Corps". Les labels à gauche pointent la bougie verte, les labels à droite la bougie rouge. |
| **Type** | Schéma anatomique SVG |

> **Note architecturale** : `app/formations/debutant/lecon3/page.tsx` existe en tant que page custom avec ses propres `CandleDiagram` et `CandleExampleDiagram` distincts (composants séparés, non liés à `Candle.tsx`). Le `case "candle"` dans le switch de `DebutantLessonView` est donc **potentiellement du code mort** pour lecon3 si cette page custom prend la priorité dans le routeur Next.js.

---

### 1.3 LongShortDiagram

| Attribut | Valeur |
|---|---|
| **Localisation** | `DebutantLessonView.tsx` lignes 73–134 |
| **Leçon** | Leçon 2 — "Acheter / Vendre — Long et Short" |
| **Description** | Deux panneaux SVG 220×160 en grille 2 colonnes. Gauche : courbe ascendante avec zone de gain verte, prix entrée et sortie annotés (Long +2 000 €). Droite : courbe descendante, zone rouge, Short +3 000 €. Axes x/y tracés, flèches directionnelles. |
| **Type** | Graphique de prix comparatif / comparaison Long vs Short |

---

### 1.4 SpreadDiagram

| Attribut | Valeur |
|---|---|
| **Localisation** | `DebutantLessonView.tsx` lignes 137–191 |
| **Leçon** | Leçon 4 — "Spread, Bid et Ask" |
| **Description** | Composant HTML pur (pas de SVG). Barre horizontale tripartite : zone Bid (bleue), zone Spread (orange), zone Ask (verte). Labels sous chaque zone expliquant l'usage (vente / achat). Note encadrée sous la barre expliquant le coût du spread. |
| **Type** | Schéma conceptuel HTML / visualisation de prix |

---

### 1.5 StopLossDiagram

| Attribut | Valeur |
|---|---|
| **Localisation** | `DebutantLessonView.tsx` lignes 194–253 |
| **Leçon** | Leçon 5 — "Le Stop Loss" |
| **Description** | Composant HTML pur. Trois zones empilées verticalement : Take Profit (verte, 33 000 €), Entrée (zinc, 30 000 €), Stop Loss (rouge, 28 500 €). Montants gain/perte affichés. Ratio 1:2 symbolisé par flèches SVG inline. Note de synthèse en bas. |
| **Type** | Schéma conceptuel par zones empilées |

---

### 1.6 TakeProfitDiagram

| Attribut | Valeur |
|---|---|
| **Localisation** | `DebutantLessonView.tsx` lignes 256–294 |
| **Leçon** | Leçon 6 — "Le Take Profit" |
| **Description** | Deux panneaux SVG 130×145. Gauche : "avec TP" — courbe verte atteignant le TP à 33 000 €, +3 000 €. Droite : "sans TP" — courbe qui dépasse le TP puis retombe, −1 000 € final. Point de pic annoté en orange. |
| **Type** | Graphique de prix comparatif / pédagogie "avec vs sans" |

---

### 1.7 BreakEvenDiagram

| Attribut | Valeur |
|---|---|
| **Localisation** | `DebutantLessonView.tsx` lignes 297–342 |
| **Leçon** | Leçon 7 — "Le Break Even" |
| **Description** | Composant HTML pur. Séquence en 3 étapes : 1. Entrée à 30 000 € avec SL à 29 000 € (rouge) → 2. Prix monte à 31 000 €, SL déplacé au prix d'entrée (amber) → 3. Deux scénarios finaux : TP atteint (vert) ou BE déclenché (zinc). |
| **Type** | Diagramme de flux séquentiel HTML |

---

### 1.8 RiskDiagram

| Attribut | Valeur |
|---|---|
| **Localisation** | `DebutantLessonView.tsx` lignes 345–380 |
| **Leçon** | Leçon 8 — "Gestion du risque — la règle du 1%" |
| **Description** | Deux panneaux HTML. Gauche : risque 1%/trade — après 10 pertes, 904 € restants (barre verte haute). Droite : risque 20%/trade — après 10 pertes, 107 € restants (barre rouge quasi pleine). Labels chiffrés centrés, note de synthèse en bas. |
| **Type** | Diagramme à barres de progression HTML |

---

### 1.9 ErrorsDiagram

| Attribut | Valeur |
|---|---|
| **Localisation** | `DebutantLessonView.tsx` lignes 383–409 |
| **Leçon** | Leçon 9 — "Les erreurs des débutants" |
| **Description** | Grille 2×2 de 4 cartes HTML : FOMO (orange), Vengeance (rouge), Ancrage (violet), Overconfidence (amber). Chaque carte présente le biais en 2 lignes. Aucun graphique de prix. |
| **Type** | Grille de cartes conceptuelles HTML |

---

## Section 2 — Audit technique par diagramme

### 2.1 TradeDiagram

| Critère | Résultat |
|---|---|
| **Palette** | ✓ Conforme — emerald (`#10b981`) et red (`#ef4444`, `#52525b` zinc) uniquement |
| **Couleurs hors palette** | Aucune |
| **ViewBox** | `viewBox="0 0 140 140"` — correct, marges suffisantes (points de données à x=16..122, y=30..105) |
| **Labels avec fond opaque** | N/A — textes sur fond neutre, pas de superposition |
| **Style bougies** | Pas de bougies — courbes polyline uniquement |
| **Lignes pointillées** | `strokeDasharray="3 2"` — légèrement serré vs canonical "4 4" mais acceptable |

---

### 2.2 CandleDiagram

| Critère | Résultat |
|---|---|
| **Palette** | ⚠️ 1 violation |
| **Couleurs hors palette** | `fill="#6b7280"` (gray-500) sur le label "Corps" — ligne 43. La palette autorise zinc, pas gray. Remplacer par `#71717a` (zinc-500) |
| **ViewBox** | `viewBox="0 0 420 240"` avec `className="w-full max-w-lg mx-auto"` — correct |
| **Labels avec fond opaque** | Pas de rects opaques sous les textes SVG. Les labels `x=152` sont positionnés à droite des bougies sur fond neutre — acceptable. Le label "Corps" à `x=62` (start par défaut) risque un chevauchement mineur avec le corps vert débutant à `x=80` (police ~35px wide) |
| **Style bougies** | Hors standard canonique : corps vert `fill="#059669" fillOpacity="0.85"` (devrait être `#10b981`), corps rouge `fill="#dc2626" fillOpacity="0.80"` (devrait être `#ef4444`). Mèches `stroke="#52525b"` (zinc-600, neutre) vs canonique coloré. `strokeWidth="2"` vs canonique 1.5 |
| **Lignes pointillées** | `strokeDasharray="3,3"` — minor, vs canonical "4 4" |

**Violations listées** :
- L43 : `fill="#6b7280"` → `#71717a` (zinc-500)
- L24 : `fill="#059669" fillOpacity="0.85"` → `fill="#10b981"` (cohérence canonique corps bullish)
- L50 : `fill="#dc2626" fillOpacity="0.80"` → `fill="#ef4444"` (cohérence canonique corps bearish)

---

### 2.3 LongShortDiagram

| Critère | Résultat |
|---|---|
| **Palette** | ✓ Conforme — emerald (`#059669`, `#34d399`) et red (`#dc2626`, `#f87171`), zinc `#3f3f46` |
| **Couleurs hors palette** | Aucune |
| **ViewBox** | `viewBox="0 0 220 160"` ×2 dans grid cols-2 — correct |
| **Labels avec fond opaque** | N/A — textes positionnés dans zones dégagées |
| **Style bougies** | Pas de bougies |
| **Lignes pointillées** | `strokeDasharray="4,3"` — conforme (1pt d'écart non significatif) |

---

### 2.4 SpreadDiagram

| Critère | Résultat |
|---|---|
| **Palette** | ✗ **5 violations orange** |
| **Couleurs hors palette** | `bg-orange-500/10` (l.152), `text-orange-400` (l.153), `text-orange-400` (l.154), `bg-orange-500/5` (l.183), `border-orange-500/15` (l.183), `text-orange-400` (l.184–185) |
| **ViewBox** | Pas de SVG — HTML uniquement |
| **Labels avec fond opaque** | N/A |
| **Style bougies** | Pas de bougies |
| **Lignes pointillées** | N/A |

**Orange à remplacer** :
- Zone SPREAD : `bg-orange-500/10` → `bg-zinc-800/60`, `text-orange-400` → `text-zinc-400` ou `text-white` (neutre, c'est une valeur factuelle)
- Note spread : `bg-orange-500/5 border-orange-500/15 text-orange-400` → `bg-zinc-900 border-zinc-800 text-zinc-400`

---

### 2.5 StopLossDiagram

| Critère | Résultat |
|---|---|
| **Palette** | ✓ Conforme — emerald-500/400, red-500/400, zinc, white |
| **Couleurs hors palette** | Aucune |
| **ViewBox** | Pas de SVG |
| **Labels avec fond opaque** | N/A |
| **Style bougies** | Pas de bougies |
| **Lignes pointillées** | N/A |

---

### 2.6 TakeProfitDiagram

| Critère | Résultat |
|---|---|
| **Palette** | ✗ **2 violations orange** |
| **Couleurs hors palette** | `fill="#f97316"` sur `<circle>` (l.285) et `<text>` annotation "+3 000 €" (l.286) dans le panneau "SANS Take Profit" |
| **ViewBox** | `viewBox="0 0 130 145"` — correct |
| **Labels avec fond opaque** | Textes SVG positionnés dans zones dégagées — acceptable |
| **Style bougies** | Pas de bougies — courbes polyline |
| **Lignes pointillées** | `strokeDasharray="4 2"` et `strokeDasharray="3 2"` — acceptables |

**Orange à remplacer** :
- L285 : `fill="#f97316"` (circle pic raté) → `fill="#f87171"` (red-400, cohérent : c'est un point de perte manquée)
- L286 : `fill="#f97316"` (text "+3 000 €" sous le pic) → `fill="#f87171"` (red-400)

---

### 2.7 BreakEvenDiagram

| Critère | Résultat |
|---|---|
| **Palette** | ✓ Conforme — amber-400 autorisé pour "avertissement/transition" |
| **Couleurs hors palette** | Aucune — `text-amber-400`, `bg-amber-500/5`, `border-amber-500/20` utilisés pour l'étape pivot Break Even. L'étape BE est sémantiquement un "point de vigilance" — usage amber justifié |
| **ViewBox** | Pas de SVG |
| **Labels avec fond opaque** | N/A |
| **Style bougies** | Pas de bougies |

---

### 2.8 RiskDiagram

| Critère | Résultat |
|---|---|
| **Palette** | ✓ Conforme — emerald-500/400, red-500/30, zinc |
| **Couleurs hors palette** | Aucune |
| **ViewBox** | Pas de SVG — barres CSS avec hauteurs inline |
| **Labels avec fond opaque** | N/A |
| **Style bougies** | Pas de bougies |

---

### 2.9 ErrorsDiagram

| Critère | Résultat |
|---|---|
| **Palette** | ✗ **3 violations** (orange + purple) |
| **Couleurs hors palette** | `border-orange-500/20`, `bg-orange-500/5`, `text-orange-400` pour carte FOMO (l.390–393) ; `border-purple-500/20`, `bg-purple-500/5`, `text-purple-400` pour carte Ancrage (l.398–401). Purple est explicitement interdit. |
| **ViewBox** | Pas de SVG |
| **Labels avec fond opaque** | N/A |
| **Style bougies** | Pas de bougies |

**Violations à corriger** :
- FOMO : orange → amber-400 (warning justifié sémantiquement : FOMO = urgence = alerte)
- Ancrage : purple → `text-zinc-400`, `border-zinc-700`, `bg-zinc-800/30` (ton neutre-zinc, car l'ancrage est un biais "silencieux" — pas besoin de couleur chaude)

---

## Section 3 — Audit pédagogique par diagramme

### 3.1 TradeDiagram
- **Lisibilité en 3s** : ✓ Deux courbes opposées + montants chiffrés = immédiatement compréhensible
- **Annotations** : prix d'entrée et de sortie labelisés, montants finaux en gras
- **vs Phase 1** : Plus simple que TrendDiagram/FVGDiagram, mais la leçon 1 cible des débutants absolus — la simplicité est une qualité ici
- **Note : OK** — adapté au niveau et au contexte d'une page gamifiée

### 3.2 CandleDiagram
- **Lisibilité en 3s** : ✓ Les 4 composantes (High/Close/Open/Low) sont bien labelisées avec des lignes de connexion
- **Annotations** : complètes, usage de `fontFamily="monospace"` donne un style "terminal" cohérent
- **vs Phase 1** : Qualité comparable à CandleExampleDiagram. Moins premium que les composants avancés (pas de fond teinté, pas de badges) mais fonctionnel
- **Note : À améliorer** — corrections palette et couleurs de corps nécessaires pour cohérence canonique

### 3.3 LongShortDiagram
- **Lisibilité en 3s** : ✓ Côte à côte avec titres "LONG — Buy ↑" et "SHORT — Sell ↓", la comparaison est instantanée
- **Annotations** : prix d'entrée/sortie, montants de gain, flèches directionnelles — complet
- **vs Phase 1** : Qualité similaire aux diagrammes de comparaison intermédiaires (ex: BreakoutDiagram). Bon équilibre information/lisibilité
- **Note : OK** — aucune correction requise hors annotations mineures

### 3.4 SpreadDiagram
- **Lisibilité en 3s** : ✓ La barre tripartite Bid/Spread/Ask est une métaphore visuelle directe
- **Annotations** : "Tu vends ici" / "Tu achètes ici" avec flèches — pédagogiquement très clair
- **vs Phase 1** : Format HTML sans SVG — plus limité visuellement mais la métaphore de la barre est efficace. Le concept de spread variable n'est pas représenté
- **Note : À améliorer** — palette orange à corriger, concept de variabilité du spread manquant

### 3.5 StopLossDiagram
- **Lisibilité en 3s** : ✓ Les 3 zones empilées TP/Entrée/SL avec les montants sont immédiatement lisibles
- **Annotations** : très complètes — prix, montants de gain/perte, ratio 1:2
- **vs Phase 1** : Format HTML sans graphique de prix. Moins riche que les diagrammes SVG Phase 1, mais le format "zones empilées" est efficace pour ce concept abstrait
- **Note : OK** — format bien adapté, palette propre

### 3.6 TakeProfitDiagram
- **Lisibilité en 3s** : ✓ La comparaison "avec TP = gain" vs "sans TP = perte" est immédiate
- **Annotations** : montants annotés, lignes de TP visibles, résultats finaux en gras
- **vs Phase 1** : Qualité SVG comparable à LongShortDiagram mais panneau "SANS TP" visuellement chargé (le pic orange + rechute crée une courbe difficile à interpréter au premier regard)
- **Note : À améliorer** — violation orange à corriger, le panneau "sans TP" gagnerait en clarté

### 3.7 BreakEvenDiagram
- **Lisibilité en 3s** : ✓ Le format étapes numérotées 1→2→scénarios est très clair
- **Annotations** : chaque étape est auto-descriptive avec prix et montants
- **vs Phase 1** : Format original, pas d'équivalent dans Phase 1. L'approche "flux séquentiel" est mieux adaptée que du SVG pour ce concept dynamique
- **Note : OK** — le meilleur diagramme HTML du lot en termes de clarté pédagogique

### 3.8 RiskDiagram
- **Lisibilité en 3s** : ✓✓ L'impact visuel est immédiat — 904 € vs 107 € en chiffres géants
- **Annotations** : montants, labels "risque X%/trade", "Tu continues à trader ✔" vs "Compte quasi détruit ✖"
- **vs Phase 1** : Comparable à RiskRewardDiagram en puissance pédagogique. L'utilisation de barres de hauteur proportionnelle est plus parlante qu'un SVG abstrait
- **Note : OK** — l'un des meilleurs diagrammes Débutant, aucune correction requise

### 3.9 ErrorsDiagram
- **Lisibilité en 3s** : ✓ La grille 2×2 avec noms en gras et descriptions courtes est lisible
- **Annotations** : chaque biais est nommé et expliqué en 1-2 lignes
- **vs Phase 1** : Très en-dessous du standard Phase 1 — aucun graphique de prix, aucune illustration concrète du biais en action. Le concept "FOMO = tu achètes au sommet" n'est illustré que par du texte
- **Note : À améliorer** — palette à corriger en priorité, enrichissement SVG recommandé à terme

---

## Section 4 — Manques visuels par leçon

### Leçon 1 — "C'est quoi le trading ?"
- **Concepts enseignés** : principe gain/perte, trading vs investissement vs casino, erreurs débutants
- **Visuel présent** : TradeDiagram (comparaison gain/perte) — OK
- **Visuel manquant** : Pas de diagramme pour le tableau comparatif "Trading / Investissement / Casino" (présent en `table` dans lessons.ts mais rendu purement textuel). Un visuel simple 3-colonnes renforcerait la mémorisation.
- **Suggestion** : `TradingTypesDiagram` — 3 cards SVG illustrant vitesse/horizon décisionnel

### Leçon 2 — "Long et Short"
- **Concepts enseignés** : Long = hausse, Short = baisse, comparaison symétrique
- **Visuel présent** : LongShortDiagram — couvre le sujet intégralement
- **Visuel manquant** : Rien de critique. Le tableau de données complète bien le diagramme.
- **Suggestion** : aucune

### Leçon 3 — "Lire un graphique en bougies"
- **Concepts enseignés** : anatomie de la bougie, patterns de bougies
- **Visuel présent** : CandleDiagram + CandleExampleDiagram dans page custom — bien couvert
- **Visuel manquant** : Rien de critique sur les concepts principaux
- **Note** : Le CandleDiagram de DebutantLessonView (case "candle") est potentiellement mort si lecon3/page.tsx est prioritaire dans le routeur

### Leçon 4 — "Spread, Bid et Ask"
- **Concepts enseignés** : bid/ask, spread = coût, spread variable selon heures
- **Visuel présent** : SpreadDiagram (spread fixe statique) — couvre le concept de base
- **Visuel manquant** : L'évolution du spread selon les heures de marché (serré aux Killzones, large aux heures creuses) n'est pas illustrée
- **Suggestion** : `SpreadVariationDiagram` — deux barres bid/ask, l'une serrée (Killzone) et l'autre large (heure creuse), avec horodatage

### Leçon 5 — "Le Stop Loss"
- **Concepts enseignés** : rôle du SL, placement logique, sans SL = risque infini
- **Visuel présent** : StopLossDiagram (zones abstraites TP/Entrée/SL) — clair pour le ratio
- **Visuel manquant** : Placement du SL sur un graphique de prix avec des bougies réelles (sous un support, sous un swing low). L'élève voit le SL comme zone abstraite mais pas ancré dans la structure du marché.
- **Suggestion** : `StopLossChartDiagram` — mini-chart 5 bougies, SL sous le dernier swing low, flèches de placement

### Leçon 6 — "Le Take Profit"
- **Concepts enseignés** : TP = exit planifié, ratio R/R, avec vs sans TP
- **Visuel présent** : TakeProfitDiagram (avec vs sans TP) — comparaison pédagogique, mais orange violation
- **Visuel manquant** : Visualisation explicite du ratio R/R (ex: barre verticale "risque 1R" vs "reward 2R"). La donnée R:R=1:2 apparaît textuellement dans StopLossDiagram mais pas comme visuel dédié dans lecon6.
- **Suggestion** : Enrichir TakeProfitDiagram d'une note R/R chiffrée après correction palette

### Leçon 7 — "Le Break Even"
- **Concepts enseignés** : déplacement du SL au prix d'entrée, scénarios possibles
- **Visuel présent** : BreakEvenDiagram (séquence d'étapes) — excellent
- **Visuel manquant** : Rien de critique
- **Suggestion** : aucune

### Leçon 8 — "Gestion du risque — 1%"
- **Concepts enseignés** : règle du 1%, calcul de la taille de position, sur-risque
- **Visuel présent** : RiskDiagram (900 € vs 107 € après 10 pertes) — fort impact
- **Visuel manquant** : Le calcul concret de taille de position (capital × 1% ÷ distance SL en pips = lots) n'est pas illustré. Le diagramme montre l'EFFET mais pas le CALCUL.
- **Suggestion** : `LotSizeDiagram` — tableau de calcul interactif ou schéma formule visuelle (future amélioration, pas prioritaire)

### Leçon 9 — "Les erreurs des débutants"
- **Concepts enseignés** : FOMO, vengeance, ancrage, overconfidence
- **Visuel présent** : ErrorsDiagram (4 cartes textuelles) — violations palette + pas de contexte graphique
- **Visuel manquant** : Chaque biais gagnerait à être illustré sur un mini-graphique de prix (FOMO = entrée sur spike, vengeance = entrée précipitée après perte, etc.)
- **Suggestion** : `BiasDiagram` — 4 mini-charts SVG, un par biais, montrant le comportement type sur une courbe de prix avec annotation

---

## Section 5 — Architecture

### Situation actuelle

Les 8 diagrammes Débutant (CandleDiagram, LongShortDiagram, SpreadDiagram, StopLossDiagram, TakeProfitDiagram, BreakEvenDiagram, RiskDiagram, ErrorsDiagram) sont définis **inline** dans `app/formations/debutant/_components/DebutantLessonView.tsx`, un fichier de ~557 lignes.

TradeDiagram est inline dans `app/formations/debutant/lecon1/page.tsx`.

Les diagrammes Intermédiaire et Avancé sont dans `app/components/charts/` (fichiers dédiés : `SupportResistance.tsx`, `SupplyDemandDiagram.tsx`, `FVGDiagram.tsx`, etc.).

### Recommandation : **OUI, extraire**

#### Arguments pour l'extraction
1. **Cohérence** : tous les diagrammes des niveaux Intermédiaire/Avancé sont dans `app/components/charts/`. Les débutants devraient suivre la même convention.
2. **Testabilité** : un composant isolé est plus facile à tester/preview indépendamment.
3. **Réutilisabilité** : SpreadDiagram ou StopLossDiagram pourraient être référencés depuis des leçons avancées comme rappels visuels.
4. **Maintenabilité** : `DebutantLessonView.tsx` à 557 lignes est déjà volumineux ; les corrections de palette nécessitent de naviguer dans un gros fichier monolithique.
5. **Convention équipe** : si un développeur cherche "les diagrammes", il ira naturellement dans `charts/`, pas dans `_components/`.

#### Arguments contre l'extraction
1. **Effort non nul** : 8 fichiers à créer + 8 imports à refactoriser dans `DebutantLessonView.tsx` + mise à jour du switch Diagram + TradeDiagram dans lecon1/page.tsx.
2. **Pas de bug actif** : l'inline fonctionne, les diagrammes s'affichent. C'est de la dette technique, pas un bug.
3. **Risque de régression** : faible mais non nul — chaque déplacement peut introduire des erreurs d'import.

#### Estimation effort de migration
- 8 composants × ~15 min (copie + création fichier + import) = **~2h**
- Tests visuels leçons 2–9 : ~30 min
- **Total : ~2h30** — effort faible, risque très faible

---

## Section 6 — Synthèse et priorisation

### Top 3 des actions prioritaires

**1. Corriger les violations orange dans SpreadDiagram et TakeProfitDiagram**
Orange est interdit dans la charte et ces deux composants sont dans des leçons fondamentales (leçon 4 et 6). SpreadDiagram utilise orange pour le concept central (la zone SPREAD) — les élèves associeront visuellement "spread" à orange, une couleur qui n'existe nulle part ailleurs dans le design system.

**2. Corriger les violations orange + purple dans ErrorsDiagram**
Purple est strictement interdit. La carte "Ancrage" en purple crée une incohérence visuelle forte. Cette correction est à la fois palette et pédagogique (le biais d'ancrage ne mérite pas de couleur spéciale distinctive — il est aussi dangereux que les autres).

**3. Aligner les couleurs de corps du CandleDiagram avec le standard canonique**
`fill="#059669"` (emerald-600) pour le corps bullish et `fill="#dc2626"` (red-700) pour le corps bearish sont les COULEURS DE BORD (stroke) dans le standard `Candle.tsx`. Utiliser les couleurs de bord comme fill crée une dissonance — les bougies débutant paraissent plus sombres que les bougies avancées. Correction : `#059669` → `#10b981` et `#dc2626` → `#ef4444`. Aussi corriger `fill="#6b7280"` (gray-500) → `#71717a` (zinc-500) sur le label "Corps".

---

### Ordre suggéré pour la refonte (mini-sprints)

**Mini-sprint A — Corrections palette urgentes** (1 fichier : DebutantLessonView.tsx)
- SpreadDiagram : 5 occurrences orange → zinc-400/zinc-800
- TakeProfitDiagram : 2 occurrences orange → red-400
- ErrorsDiagram : 3 occurrences orange/purple → amber-400 (FOMO) + zinc (Ancrage)
- Estimation : ~30 min

**Mini-sprint B — Cohérence canonique CandleDiagram** (1 fichier : DebutantLessonView.tsx ou fichier extrait)
- Corps bullish : `#059669 fillOpacity=0.85` → `fill="#10b981"` sans fillOpacity
- Corps bearish : `#dc2626 fillOpacity=0.80"` → `fill="#ef4444"` sans fillOpacity
- Label "Corps" : `#6b7280` → `#71717a`
- Mèches : aligner strokeWidth sur 1.5 et envisager couleurs colorées (emerald-600/red-700) pour cohérence Candle.tsx
- Estimation : ~20 min

**Mini-sprint C — Extraction + nouveaux viagrammes optionnels**
- Extraire les 8 diagrammes vers `app/components/charts/` (nommage proposé : `SpreadDiagram.tsx`, `StopLossDiagram.tsx`, etc.)
- Nouveau `SpreadVariationDiagram` pour leçon 4 (spread serré vs large)
- Nouveau `StopLossChartDiagram` pour leçon 5 (SL sur graphique de bougies)
- Estimation : ~3h30

---

### Résumé chiffré

| Métrique | Valeur |
|---|---|
| Diagrammes inventoriés | 9 (8 inline + 1 dans lecon1) |
| Diagrammes avec violations palette | 4 (SpreadDiagram, TakeProfitDiagram, ErrorsDiagram, CandleDiagram) |
| Occurrences de couleurs interdites | 10 (6 orange, 3 purple, 1 gray) |
| Diagrammes techniquement propres | 5 (TradeDiagram, LongShortDiagram, StopLossDiagram, BreakEvenDiagram, RiskDiagram) |
| Diagrammes à refaire complètement | 0 |
| Diagrammes à améliorer (palette + cohérence) | 3 |
| Visuels manquants identifiés | 4 (SpreadVariation, StopLossChart, RR, BiasDiagram) |
| Ruptures d'API si extraction | 0 (réexport suffisant) |
