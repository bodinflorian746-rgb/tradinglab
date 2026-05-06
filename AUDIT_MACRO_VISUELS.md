# AUDIT_MACRO_VISUELS.md
## Audit des composants SVG réutilisables pour la formation Macro-économie

**Date :** 2026-04-24  
**Périmètre :** `app/components/charts/` — 27 composants audités  
**Objectif :** identifier ce qui peut être réutilisé tel quel, adapté, ou doit être créé from-scratch pour la formation Macro (17 leçons, 3 niveaux).

---

## Section 1 — Composants réutilisables TEL QUEL

> Aucune modification de code nécessaire. Utilisables directement ou via leurs props existantes.

---

### 1. `TrendDiagram.tsx`
**Description :** 3 panels côte à côte — ligne de prix haussière (HH/HL), range (oscillation), baissière (LH/LL). Labels "HAUSSIER / RANGE / BAISSIER" en bas.  
**Leçon Macro :** "Hawkish / Dovish / Neutre" — ton de politique monétaire  
**Raison :** Les 3 phases du diagramme mappent directement aux 3 postures des banques centrales : hausse de taux (haussier), plateau (range), baisse de taux (baissier). Aucune confusion sémantique pour l'élève — la structure visuelle est identique.

---

### 2. `SupportResistance.tsx`
**Description :** Ligne de support et résistance avec prix configurables via props `supportPrice` et `resistancePrice`. Courbe de prix rebondissant entre les deux niveaux.  
**Leçon Macro :** "Impact des annonces sur les trades" — réaction de prix sur niveaux macro clés  
**Raison :** Les props permettent de labeller les niveaux avec des valeurs macro réelles (ex. `resistancePrice="5.50%"` pour le plafond de taux Fed, `supportPrice="2.00%"` pour la cible inflation). Le comportement de rebond illustre parfaitement les réactions aux décisions FOMC ou aux publications CPI.

---

### 3. `Candle.tsx`
**Description :** Composant de bougie unique avec type (`bullish`, `bearish`, `doji`, `pin-bull`, `pin-bear`), `label`, et `caption` configurables. SVG 60×168.  
**Leçon Macro :** Toutes les leçons qui montrent une réaction de prix à un événement (NFP, CPI, décision FOMC)  
**Raison :** Composant générique par conception — aucune donnée hardcodée. Une bougie doji annotée "Décision FOMC" ou une pin bearish annotée "NFP surprenant à la baisse" illustre immédiatement l'impact d'une annonce sans créer un nouveau composant.

---

### 4. `BacktestMetricsDiagram.tsx`
**Description :** Dashboard complet 900×600 — 3 cartes KPIs (Win Rate, Profit Factor, Max Drawdown), equity curve sur 100 trades avec drawdown coloré, histogramme de distribution des R, ligne d'expectancy.  
**Leçon Macro :** Niveau avancé — "Trader avec la macro : mesurer sa performance sur les annonces économiques"  
**Raison :** Structure de mesure de performance parfaitement applicable à une stratégie qui trade les annonces macro. Win Rate + Profit Factor sur les publications NFP/CPI/FOMC sont les mêmes métriques. L'equity curve illustre l'impact cumulé d'une approche macro sur le capital.

---

### 5. `TradingJournalDiagram.tsx`
**Description :** Panneau gauche = table de 10 trades (date, setup, R/R, résultat), panneau droit = equity curve + annotations best streak / worst drawdown + insights band (meilleur setup, setup à éviter, erreur récurrente).  
**Leçon Macro :** Niveau avancé — "Journaliser ses trades macro pour progresser"  
**Raison :** Le journal s'applique identiquement à un trader macro. Les setups ("NFP Long", "CPI Short"…) remplacent "OB Bullish" / "OTE Long" dans les données affichées — mais le composant lui-même est purement structurel et ne référence pas les noms de setups dans le code.

---

**Bilan Section 1 : 5 composants réutilisables tel quel**

---

## Section 2 — Composants adaptables (modification mineure)

> Modification mineure = changement de données hardcodées, labels textuels, ou ajout d'une prop. Structure SVG et logique inchangées.

---

### 1. `SpreadVariationDiagram.tsx`
**Adaptation nécessaire :** Remplacer `CURVE_PTS` (courbe spread 24h) par une série temporelle macro (ex. taux Fed de 2015 à 2024, ou CPI mensuel sur 3 ans). Changer l'axe X de heures à années/mois. Adapter les zones rouge/emerald aux périodes de politique restrictive/accommodante. Changer le label header.  
**Leçon Macro ciblée :** "Taux d'intérêt — évolution historique de la Fed Funds Rate" ou "Inflation — courbe CPI avec cible 2%"  
**Note :** Ce composant EST le template idéal pour `RateCurveDiagram` et `InflationChart`. La logique `vy()`, les zones colorées, la polyline et le pattern legend div sont réutilisables à 90%.

---

### 2. `KillzonesDiagram.tsx`
**Adaptation nécessaire :** Remplacer les zones horaires (Asian/London/NY) par des plages d'événements hebdomadaires ou mensuels (NFP = 1er vendredi du mois, FOMC = 8 fois/an…). Adapter `hx()` à une échelle temporelle mensuelle. Changer les labels de zones et la courbe de volatilité par une courbe d'impact attendu. Header et légende à mettre à jour.  
**Leçon Macro ciblée :** "Le calendrier économique — savoir quand les annonces se produisent et leur impact attendu"  
**Note :** La structure (axe timeline horizontal, zones surlignées, labels avec badges opaques, légende div) est exactement ce qu'il faut pour un calendrier d'annonces macro.

---

### 3. `StopLossChartDiagram.tsx`
**Adaptation nécessaire :** Réutiliser la structure 2 zones côte à côte (viewBox 900×280, séparateur central) pour comparer "Décision Hawkish" vs "Décision Dovish" — même bougies et même logique de zones, avec des labels différents (badges "HAUSSE TAUX" / "BAISSE TAUX", lignes de niveaux renommées, texte explicatif adapté).  
**Leçon Macro ciblée :** "Hawkish vs Dovish — impact sur le marché"  
**Note :** La comparaison côte-à-côte avec mini-charts de bougies est la structure visuelle la plus directe pour opposer deux scénarios de politique monétaire.

---

### 4. `BiasDiagram.tsx`
**Adaptation nécessaire :** Réutiliser la grille 2×2 de mini-SVGs (structure CSS grid + mini-charts) pour illustrer 4 scénarios macro différents — ex. "FOMC hawkish surprise", "NFP au-dessus des attentes", "CPI sous la cible", "Récession confirmée". Remplacer les données FOMO/Vengeance/etc. par des scénarios de réaction de prix aux annonces.  
**Leçon Macro ciblée :** "Les 4 réactions typiques du marché aux annonces économiques" (niveau intro macro)  
**Note :** La grille 2×2 avec titre thématique + mini-chart SVG + texte explicatif est une structure pédagogique directement réutilisable.

---

### 5. `MarketStructureDiagram.tsx`
**Adaptation nécessaire :** Changer les labels "HH/HL/LH/LL" en "PIB Q1/Q2/Q3" ou "Inflation M1/M2/M3" via les `labels` arrays internes. Modifier les textes de légende. La prop `trend` (bullish/bearish) reste fonctionnelle.  
**Leçon Macro ciblée :** "Structure d'un cycle économique — expansion et récession vus sur le graphique"  
**Note :** La séquence alternée de sommets et creux avec annotations labeled est visuellement parfaite pour montrer la progression d'un indicateur macro dans le temps.

---

### 6. `TradePlanDiagram.tsx`
**Adaptation nécessaire :** Changer les labels "ENTRÉE / Take Profit / Stop Loss" en "ACHAT PRÉ-ANNONCE / OBJECTIF / PROTECTION" et adapter les prix affichés. Ajouter optionnellement une zone "fenêtre d'annonce" en vertical. Modification superficielle (3-4 lignes).  
**Leçon Macro ciblée :** "Comment structurer un trade autour d'une annonce macro (NFP, CPI)"  
**Note :** La structure entrée/TP/SL avec R/R est universelle et directement applicable à un trade macro avec objectif et protection définis avant l'annonce.

---

### 7. `ConfluenceDiagram.tsx`
**Adaptation nécessaire :** Remplacer les 3 confluences techniques (Fibonacci, Support S/R, niveau psychologique) par 3 signaux macro convergents (ex. "CPI > cible", "NFP solide", "Fed tone hawkish"). Modifier les labels des 3 lignes et du badge "3 confluences ✓". Structure de flèches convergentes inchangée.  
**Leçon Macro ciblée :** "Convergence de signaux macro — quand plusieurs indicateurs pointent dans le même sens"  
**Note :** Le principe visuel (plusieurs signaux convergents vers une zone de décision) est exactement la logique macro "tous les indicateurs pointent vers une hausse de taux".

---

### 8. `BOSDiagram.tsx` + `CHoCHDiagram.tsx`
**Adaptation nécessaire (les deux) :** Relabeller les badges "HH/BOS" / "CHoCH" en termes macro ("Pic d'inflation / Retournement" ou "Record historique / Changement de régime"). Les couleurs et la structure restent.  
**Leçon Macro ciblée :** "Retournements de tendance macro — quand la Fed pivote" ou "Identifier un changement de régime économique"  
**Note :** La rupture de structure (BOS) et le changement de caractère (CHoCH) sont conceptuellement identiques à un "pivot Fed" ou à la fin d'un cycle de hausse. Le visuel parle de lui-même avec les bons labels.

---

**Bilan Section 2 : 9 composants adaptables avec modification mineure**  
*(BOSDiagram + CHoCHDiagram comptés ensemble)*

---

## Section 3 — Composants Macro à CRÉER from-scratch

> Ces concepts macro n'ont pas d'équivalent structurel dans les composants existants. Création standalone requise dans `app/components/charts/`.

---

### 1. `RateCurveDiagram.tsx`
**Utilité pédagogique :** Montrer l'évolution de la Fed Funds Rate (ou BCE) sur plusieurs années avec des zones de phase (hausse, plateau, baisse) et des annotations sur les événements clés (COVID, inflation 2022, pause 2023).  
**Complexité estimée :** Faible — adaptée directement de `SpreadVariationDiagram` (même polyline + zones + légende div)  
**Priorité pilotes :** Oui — leçon fondatrice "Les taux d'intérêt"

---

### 2. `InflationChart.tsx`
**Utilité pédagogique :** Courbe CPI mensuelle ou annuelle avec ligne cible 2%, zones "au-dessus de la cible" (rouge) et "sous la cible" (emerald), annotations des pics et des décisions de politique monétaire associées.  
**Complexité estimée :** Faible — même pattern que `SpreadVariationDiagram`, juste des données et zones différentes  
**Priorité pilotes :** Oui — leçon fondatrice "L'inflation"

---

### 3. `NFPSurpriseDiagram.tsx`
**Utilité pédagogique :** Montrer graphiquement le mécanisme "chiffre attendu → chiffre réel → impact immédiat sur le prix" : une barre "prévision" en zinc, une barre "réel" plus haute/basse en emerald/red, et une mini-courbe de prix qui réagit immédiatement après la publication.  
**Complexité estimée :** Moyenne — combine barres comparatives (pattern `BacktestMetricsDiagram` histogram) + mini-courbe de prix  
**Priorité pilotes :** Oui — leçon "Chômage et NFP" ou "Comment trader les publications"

---

### 4. `HawkishDovishScale.tsx`
**Utilité pédagogique :** Échelle linéaire horizontale (de "Ultra Dovish" à "Ultra Hawkish") avec des marqueurs positionnant différentes banques centrales ou différentes phases historiques de la même banque. Visuellement : gradient de couleur blue-400 (dovish) → emerald (neutre) → red-400 (hawkish).  
**Complexité estimée :** Faible — SVG linéaire avec gradient de zones et points nommés  
**Priorité pilotes :** Oui — leçon "Comprendre le ton des banques centrales"

---

### 5. `CentralBankCycleDiagram.tsx`
**Utilité pédagogique :** Vue chronologique du cycle de politique monétaire complet — Phase 1 (taux bas, QE) → Phase 2 (tapering) → Phase 3 (hausses) → Phase 4 (plateau) → Phase 5 (baisses). Chaque phase en couleur différente (blue → zinc → red → zinc → emerald) avec annotations.  
**Complexité estimée :** Moyenne — frise temporelle linéaire avec zones colorées et labels, similaire à KillzonesDiagram mais avec phases longues  
**Priorité pilotes :** Oui — leçon "Cycle de politique monétaire — de QE au QT"

---

### 6. `EconomicCalendarDiagram.tsx`
**Utilité pédagogique :** Timeline mensuelle ou hebdomadaire des annonces économiques avec intensité d'impact (faible/moyen/fort) représentée par la hauteur ou la couleur des marqueurs d'événements. Montre la concentration des événements clés en début de mois (NFP) ou 8 fois/an (FOMC).  
**Complexité estimée :** Moyenne — adaptée de `KillzonesDiagram` mais avec axe hebdomadaire et markers verticaux  
**Priorité pilotes :** Peut-être — utile mais pas indispensable pour les 3 leçons pilotes

---

### 7. `RiskOnRiskOffDiagram.tsx`
**Utilité pédagogique :** Deux colonnes "RISK-ON" vs "RISK-OFF" avec des flux de capitaux représentés par des flèches : vers quels actifs les investisseurs se déplacent en mode risk-on (actions, crypto, AUD) vs risk-off (USD, Or, JPY, obligations). Bascule visuelle entre les deux états.  
**Complexité estimée :** Moyenne — grille 2 colonnes + flèches directionnelles + icônes texte  
**Priorité pilotes :** Peut-être — concept important mais pas dans les 3 leçons pilotes immédiates

---

### 8. `DotPlotDiagram.tsx`
**Utilité pédagogique :** Reproduire visuellement le "dot plot" de la Fed (graphique en points des projections des membres du FOMC sur la trajectoire future des taux). Axe Y = niveau de taux, axe X = années futures, chaque "dot" = un membre votant.  
**Complexité estimée :** Élevée — scatter plot SVG avec axes calibrés, gestion de la densité de points, annotations  
**Priorité pilotes :** Peut-être — pédagogiquement fort mais complexe à implémenter proprement

---

### 9. `CorrelationMatrix.tsx`
**Utilité pédagogique :** Heatmap carrée montrant la corrélation entre DXY, EUR/USD, Or, S&P500, VIX — chaque cellule colorée selon l'intensité de corrélation (emerald = corrélation positive forte, red = inverse forte, zinc = faible).  
**Complexité estimée :** Élevée — grid SVG avec N×N cellules, dégradé de couleur encodant une valeur continue, légende de corrélation  
**Priorité pilotes :** Non — concept avancé, visuellement complexe, pas adapté aux 3 leçons pilotes

---

### 10. `CrisisTimelineDiagram.tsx`
**Utilité pédagogique :** Frise historique horizontale des grandes crises (2000 dot-com, 2008 GFC, 2020 COVID, 2022 inflation) avec pour chaque crise : déclencheur, réponse de la banque centrale (QE/taux), durée, amplitude de la chute des marchés.  
**Complexité estimée :** Élevée — frise multi-événements avec callouts détaillés, balance entre densité d'info et lisibilité  
**Priorité pilotes :** Non — leçon de contexte historique, non fondatrice

---

### 11. `MacroImpactSpikeDiagram.tsx` *(ajout recommandé)*
**Utilité pédagogique :** Montrer visuellement le "spike" de volatilité immédiat sur une paire de devises au moment d'une annonce macro — bougies normales, puis une très longue mèche/corps sur la bougie d'annonce, puis retour progressif au calme. Illustre le danger d'être en position au moment de la publication.  
**Complexité estimée :** Faible — variante de `StopLossChartDiagram` avec bougies + mèche extrême annotée  
**Priorité pilotes :** Oui — applicable à n'importe quelle leçon sur les risques des annonces

---

**Bilan Section 3 : 11 nouveaux composants à créer**  
*(dont 1 ajout recommandé non suggéré dans la mission)*

---

## Section 4 — Synthèse et recommandations

### Récapitulatif chiffré

| Catégorie | Nombre |
|---|---|
| Réutilisables TEL QUEL | 5 |
| Adaptables (modification mineure) | 9 |
| À créer from-scratch | 11 |
| **Total composants concernés** | **25** |
| Composants hors scope Macro (très techniques, ICT-specific) | 2 ¹ |

¹ `LiquidityPoolsDiagram`, `FVGDiagram`, `OrderBlockDiagram`, `OTEDiagram`, `PrecisionEntryDiagram`, `FibonacciDiagram`, `GraphFakeBreakout`, `RetracementInteractive`, `StopHuntInteractive` sont très spécifiques au trading ICT/SMC et n'ont pas d'utilité directe dans la formation Macro sans refonte complète. Ils ne sont pas comptés dans les adaptables.

---

### ⚠️ Violations palette détectées dans les composants existants

Deux composants contiennent des couleurs hors palette autorisée (orange/amber) :

- **`RetracementInteractive.tsx`** : classes `bg-amber-500/10`, `border-amber-500/20`, `text-amber-400` sur les boutons. Si réutilisé en Macro, ces classes devront être remplacées.
- **`StopHuntInteractive.tsx`** : même violation, mêmes classes amber sur un bouton.
- **`MultiTimeframeDiagram.tsx`** : couleur `#f59e0b` hardcodée dans le SVG pour la zone M15 "Signal" (amber non autorisé).

Ces 3 composants ne peuvent pas être réutilisés tel quel sans corriger d'abord les violations palette.

---

### Top 5 composants Macro PRIORITAIRES à créer

Ces 5 composants couvrent les concepts macro les plus fondamentaux et sont nécessaires pour les 3 leçons pilotes.

| Rang | Composant | Leçon pilote | Raison de la priorité |
|---|---|---|---|
| 1 | **`RateCurveDiagram.tsx`** | "Les taux d'intérêt" | Concept central de toute la formation Macro. Faible complexité — adapté directement de SpreadVariationDiagram. |
| 2 | **`HawkishDovishScale.tsx`** | "Hawkish / Dovish" | Concept fondateur que chaque élève doit visualiser avant tout. Faible complexité — SVG linéaire. |
| 3 | **`InflationChart.tsx`** | "L'inflation" | Deuxième concept central. Faible complexité — même template que RateCurveDiagram. |
| 4 | **`NFPSurpriseDiagram.tsx`** | "Trading les annonces" | Concept très visuel et immédiatement actionnable. Complexité moyenne mais fort impact pédagogique. |
| 5 | **`CentralBankCycleDiagram.tsx`** | "Cycle monétaire / QE-QT" | Vue d'ensemble unificatrice — donne le contexte de toutes les autres leçons. Complexité moyenne. |

---

### Estimation de l'effort total

| Phase | Composants | Effort estimé |
|---|---|---|
| Réutilisation directe | 5 composants | 0 création |
| Adaptations mineures | 9 composants | ~1-2h de travail par adaptation (labels, data) |
| Créations from-scratch | 11 composants | ~2-4h par composant selon complexité |
| **Total création nette** | **11 nouveaux composants** | **~30-40h de travail SVG** |

**Recommendation d'ordre :** Créer les 5 prioritaires d'abord (environ 10-15h), puis les adaptations mineures au fur et à mesure des leçons concernées. Ne créer CorrelationMatrix et CrisisTimelineDiagram qu'en dernière phase — leur complexité est élevée et leur priorité pédagogique est faible pour les leçons fondatrices.
