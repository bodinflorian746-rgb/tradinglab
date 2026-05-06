# AUDIT_CANDLE.md — Cartographie complète avant refactor

---

## Section 1 — Fichier source : `app/components/charts/Candle.tsx`

### Props

| Prop | Type | Défaut | Rôle |
|---|---|---|---|
| `type` | `'bullish' \| 'bearish' \| 'pin-bull' \| 'pin-bear' \| 'doji'` | `'bullish'` | Variante de bougie |
| `label` | `string` (optionnel) | — | Texte au-dessus en zinc-500, 10px, uppercase |
| `caption` | `string` (optionnel) | — | Texte en dessous en zinc-500, 11px, centré |
| `className` | `string` | `''` | Classe CSS sur le wrapper `div` |

### Dimensions SVG

- `width="60"`, `height="168"`, `viewBox="0 0 60 168"`
- Corps (`<rect>`) : `x=13`, `width=34`, `height=max(bodyH, 4)`, `rx=2`
- Mèches (`<line>`) : `x1=30 x2=30` (axe centré), `strokeWidth="2"`, `strokeLinecap="round"`

### Variantes — coordonnées y dans SHAPES

| Variante | Mèche haute (uw) | Corps (body) | Mèche basse (lw) | Proportion |
|---|---|---|---|---|
| `bullish` | 10 → 42 | 42 → 132 | 132 → 158 | corps = 54% de la hauteur |
| `bearish` | 10 → 42 | 42 → 132 | 132 → 158 | identique à bullish |
| `pin-bull` | 10 → 30 | 30 → 58 | 58 → 158 | corps court, longue mèche basse |
| `pin-bear` | 10 → 108 | 108 → 138 | 138 → 158 | longue mèche haute, corps court bas |
| `doji` | 10 → 82 | 82 → 88 | 88 → 158 | corps minuscule (6px) |

### Couleurs actuelles

| Élément | bullish | bearish | doji |
|---|---|---|---|
| Corps `fill` | `#10b981` (emerald-500) | `#ef4444` (red-500) | `#71717a` (zinc-500) |
| Corps `stroke` | `#059669` (emerald-600) | `#dc2626` (red-700) | `#52525b` (zinc-600) |
| Mèche haute `stroke` | `#3f3f46` (zinc-700) — **neutre** | `#3f3f46` — **neutre** | `#3f3f46` — **neutre** |
| Mèche basse `stroke` | `#3f3f46` (zinc-700) — **neutre** | `#3f3f46` — **neutre** | `#3f3f46` — **neutre** |

**Point clé** : les mèches sont uniformément zinc-700, indépendantes du type. C'est le seul écart avec le style canonique cible.

---

## Section 2 — Usages dans le projet

### 2a. Fichiers qui importent `{ Candle }` depuis `Candle.tsx` (3 fichiers)

#### `app/formations/intermediaire/lecon2/page.tsx`
- **Nombre d'usages** : 2
- **Contexte** : `<div className="flex justify-around items-start ...">` avec `SupportResistance` au-dessus
- **Usages** :
  ```tsx
  <Candle type="pin-bull" label="Rejet support" caption="Pin bar haussière" />
  <Candle type="pin-bear" label="Rejet résistance" caption="Pin bar baissière" />
  ```
- **Props passées** : `type`, `label`, `caption` — pas de `className`
- **Wrapper** : flex item, pas de dimensions forcées → taille naturelle (60×168 + textes)

#### `app/formations/intermediaire/lecon3/page.tsx`
- **Nombre d'usages** : 2
- **Contexte** : `<div className="flex justify-around items-start ...">` dans un wrapper border zinc-800
- **Usages** :
  ```tsx
  <Candle type="bullish" label="Signal Demand" caption="Rejet haussier dans la zone" />
  <Candle type="bearish" label="Signal Supply" caption="Rejet baissier dans la zone" />
  ```
- **Props passées** : `type`, `label`, `caption` — pas de `className`
- **Wrapper** : flex item, taille naturelle

#### `app/formations/intermediaire/lecon6/page.tsx`
- **Nombre d'usages** : 1
- **Contexte** : `<div className="flex justify-center pt-1 border-t border-zinc-800/50">` sous `GraphFakeBreakout`
- **Usage** :
  ```tsx
  <Candle type="pin-bear" label="La bougie piège" caption="Mèche haute + clôture sous la résistance" />
  ```
- **Props passées** : `type`, `label`, `caption` — pas de `className`
- **Wrapper** : flex justify-center, taille naturelle

---

### 2b. Fichiers avec une fonction `Candle` ou `MiniCandle` LOCALE (ne modifient pas Candle.tsx)

Ces fichiers définissent leur propre composant interne inline — ils ne sont **pas impactés** par un refactor de `Candle.tsx`.

| Fichier | Fonction locale | Interface | Style mèches |
|---|---|---|---|
| `PrecisionEntryDiagram.tsx` | `function Candle(CD)` | `cx, wickTop, bodyTop, bodyBot, wickBot, bull, wide?` | bull: `#059669` / bear: `#dc2626` |
| `StopHuntInteractive.tsx` | `function MiniCandle(CD)` | même interface | bull: `#059669` / bear: `#dc2626` |
| `OTEDiagram.tsx` | `function MiniCandle(CandleData)` | même | à vérifier |
| `OrderBlockDiagram.tsx` | `function MiniCandle(CandleData)` | `wide?` en plus | à vérifier |
| `FVGDiagram.tsx` | `function MiniCandle(CandleData)` | même | à vérifier |
| `GraphFakeBreakout.tsx` | `function MiniCandle(MiniCandleProps)` | `bullish: boolean` (pas `bull`) | neutre zinc-700 |

---

### 2c. Fichiers utilisant `CandleDiagram` ou `CandleExampleDiagram` (composants différents, non impactés)

- `app/formations/debutant/lecon3/page.tsx` — utilise `<CandleDiagram />` et `<CandleExampleDiagram />` (composants distincts, pas `Candle.tsx`)
- `app/formations/debutant/_components/DebutantLessonView.tsx` — `case "candle": return <CandleDiagram />;`

Ces fichiers ne font **aucun appel** à `Candle.tsx`.

---

## Section 3 — Style actuel vs style canonique cible

### Style actuel de `Candle.tsx`

| Élément | Valeur actuelle |
|---|---|
| Corps bullish | `fill="#10b981"` (emerald-500) |
| Corps bearish | `fill="#ef4444"` (red-500) |
| Mèche bullish | `stroke="#3f3f46"` (zinc-700) — **neutre, sans rapport avec la couleur du corps** |
| Mèche bearish | `stroke="#3f3f46"` (zinc-700) — **neutre** |
| strokeWidth mèche | `2` |
| strokeLinecap | `round` |

### Style canonique observé dans `StopHuntInteractive.tsx` et `PrecisionEntryDiagram.tsx`

| Élément | Valeur observée |
|---|---|
| Corps bullish | `fill="#10b981"` (emerald-500) ← identique |
| Corps bearish | `fill="#ef4444"` (red-500) ← identique |
| Mèche bullish | `stroke="#059669"` (emerald-**600**) — **colorée, plus FONCÉE que le corps** |
| Mèche bearish | `stroke="#dc2626"` (red-**700**) — **colorée, plus FONCÉE que le corps** |
| strokeWidth mèche | `1.5` (vs `2` dans Candle.tsx) |

### Style canonique cible demandé par le brief du Mini-sprint C

| Élément | Valeur cible |
|---|---|
| Corps bullish | `#10b981` (emerald-500) — inchangé |
| Corps bearish | `#ef4444` (red-500) — inchangé |
| Mèche bullish | `#34d399` (emerald-**400**) — colorée ET **plus CLAIRE** que le corps |
| Mèche bearish | `#f87171` (red-**400**) — colorée ET **plus CLAIRE** que le corps |
| strokeWidth mèche | à préciser — probablement `1.5` pour aligner avec les locaux |

### Tableau comparatif complet

| | Candle.tsx actuel | Locaux (StopHunt/Precision) | Cible brief |
|---|---|---|---|
| Mèche bull stroke | `#3f3f46` zinc-700 | `#059669` emerald-600 | `#34d399` emerald-400 |
| Mèche bear stroke | `#3f3f46` zinc-700 | `#dc2626` red-700 | `#f87171` red-400 |
| strokeWidth | `2` | `1.5` | non spécifié (`1.5` probable) |
| Corps = inchangé | ✓ | ✓ | ✓ |

**Note** : le brief dit "plus clair que le corps" → emerald-400 est PLUS CLAIR qu'emerald-500 ✓. Les composants locaux utilisent emerald-600 (PLUS FONCÉ). La cible brief = intention de luminosité inversée par rapport aux locaux.

---

## Section 4 — Recommandations pour le refactor

### Fichiers à modifier

| Fichier | Action | Raison |
|---|---|---|
| `app/components/charts/Candle.tsx` | **Modifier** | Source unique à corriger |

### Fichiers impactés après refactor (changement visuel automatique)

| Fichier | Impact | Risque |
|---|---|---|
| `intermediaire/lecon2/page.tsx` | Mèches pin-bull et pin-bear changent de couleur | Faible — amélioration visuelle |
| `intermediaire/lecon3/page.tsx` | Mèches bullish et bearish changent de couleur | Faible |
| `intermediaire/lecon6/page.tsx` | Mèche pin-bear change de couleur | Faible |

### Fichiers NON impactés (fonctions locales autonomes)

`PrecisionEntryDiagram`, `StopHuntInteractive`, `OTEDiagram`, `OrderBlockDiagram`, `FVGDiagram`, `GraphFakeBreakout` — tous définissent leurs propres fonctions, independamment de `Candle.tsx`.

### Propositions de backward compatibility

1. **Garder les mêmes props** : `type`, `label`, `caption`, `className` — aucun changement d'API
2. **Garder les mêmes dimensions** : SVG 60×168, corps x=13 w=34, même SHAPES pour toutes les variantes
3. **Seuls changements** :
   - Mèche bull : `#3f3f46` → `#34d399` (emerald-400)
   - Mèche bear : `#3f3f46` → `#f87171` (red-400)
   - Mèche doji : laisser `#3f3f46` OU passer à `#71717a` (zinc-500) pour cohérence avec le corps doji
   - Optionnel : `strokeWidth` de `2` → `1.5` pour aligner avec les composants locaux
4. **Ne pas changer** : `fill`/`stroke` des corps, les SHAPES, les coordonnées, le layout HTML

### Résumé chiffré

- **1 fichier source** à modifier
- **3 pages** visuellement impactées (automatiquement, pas de modification requise)
- **6 composants SVG locaux** non impactés
- **0 rupture d'API** si le refactor respecte backward compatibility
