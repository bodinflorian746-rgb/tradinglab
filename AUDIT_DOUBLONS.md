# Audit anti-doublons — Niveau Débutant

> Lecture seule. Aucune modification effectuée.  
> Date : 2026-04-24

---

## Synthèse

| Leçon | Système | Composants locaux (visuels pédagogiques) | Couleurs hors palette dans local | Doublon potentiel |
|-------|---------|------------------------------------------|----------------------------------|-------------------|
| 1 | Custom JSX complet | TradeDiagram + 14 composants UI/nav | Confetti : amber + violet + pink | TradeDiagram — même nom que DebutantLessonView.tsx |
| 2 | DebutantLessonView | aucun | — | — |
| 3 | LessonTemplate | CandleDiagram, CandleExampleDiagram | CandleDiagram : corps #059669/#dc2626 (faux); CandleExampleDiagram : wicks gray-600 (#4b5563) | CandleDiagram — même nom que DebutantLessonView.tsx |
| 4 | LessonTemplate | SpreadImpactDiagram | non | non |
| 5 | LessonTemplate | StopLossDiagram, WithWithoutSLDiagram | non | StopLossDiagram — même nom que DebutantLessonView.tsx |
| 6 | DebutantLessonView | aucun | — | — |
| 7 | DebutantLessonView | aucun | — | — |
| 8 | DebutantLessonView | aucun | — | — |
| 9 | DebutantLessonView | aucun | — | — |

---

## Détail par leçon

### Leçon 1 — Custom JSX complet (`lecon1/page.tsx`)

Toute la page est auto-contenue : structure unique, aucun `LessonTemplate` ni `DebutantLessonView`.

**Composants visuels pédagogiques :**
- `TradeDiagram` (lignes 438–469, ~32 lignes) — deux SVG côte à côte gain/perte. Palette OK (emerald/red/zinc).

**Composants UI/navigation (propres à cette architecture) :**
- `ProgressRing` (78–111), `Sidebar` (122–236), `TabBar` (240–284), `ProgressBar` (288–334)
- `Confetti` (338–372), `XPToastContainer` (383–411), `FadeIn` (415–434)
- `SectionCard` (473–523), `KeyPointsCard` (527–612), `ExerciceCard` (616–700)
- `QuizOptionBadge` (706–730), `QuizOptionRow` (732–769), `QuizCard` (771–890)
- `CompletionScreen` (894–979)

**Aucun import de composant visuel externe.**

---

### Leçon 2 — `lecon2/page.tsx`

```tsx
import { DebutantLessonView } from "../_components/DebutantLessonView";
export default function Page() { return <DebutantLessonView slug="lecon2" />; }
```

Aucun composant local. Aucun risque.

---

### Leçon 3 — `lecon3/page.tsx` (LessonTemplate)

**Composants visuels pédagogiques locaux :**

- `CandleDiagram` (lignes 4–58, ~55 lignes)  
  Passé comme `visual` à `LessonTemplate` pour la section 1.  
  **Couleurs hors palette :**
  - Corps bougie verte : `fill="#059669" fillOpacity="0.85"` → devrait être `fill="#10b981"` (emerald-500, sans opacité)
  - Corps bougie rouge : `fill="#dc2626" fillOpacity="0.80"` → devrait être `fill="#ef4444"` (red-500, sans opacité)
  - Mèches : `stroke="#52525b"` (zinc-600, autorisé) — mais devrait être `#059669`/`#b91c1c` par convention

- `CandleExampleDiagram` (lignes 61–84, ~24 lignes)  
  Passé comme `visual` à `LessonTemplate` pour la section 2.  
  **Couleurs hors palette :**
  - Mèches des deux bougies : `stroke="#4b5563"` → `#4b5563` est **gray-600** (interdit — utiliser zinc)
  - Corps bougie verte : `fill="#059669" fillOpacity="0.9"` → même erreur que CandleDiagram
  - Corps bougie rouge : `fill="#dc2626" fillOpacity="0.8"` → même erreur que CandleDiagram

**Imports visuels :** aucun.

---

### Leçon 4 — `lecon4/page.tsx` (LessonTemplate)

**Composants visuels pédagogiques locaux :**

- `SpreadImpactDiagram` (lignes 5–47, ~43 lignes)  
  Deux cartes côte à côte (trade gagnant vs perdant face au spread).  
  Palette OK : emerald/red/zinc uniquement.

**Import visuel :**  
```tsx
import { SpreadDiagram } from "@/app/components/charts/SpreadDiagram";
```
Composant global, déjà corrigé. Aucun risque.

---

### Leçon 5 — `lecon5/page.tsx` (LessonTemplate)

**Composants visuels pédagogiques locaux :**

- `StopLossDiagram` (lignes 4–74, ~71 lignes)  
  Trade Long avec zones TP / Entrée / SL empilées verticalement.  
  Palette OK : emerald/red/zinc/white uniquement.

- `WithWithoutSLDiagram` (lignes 77–120, ~44 lignes)  
  Deux cartes côte à côte (avec SL vs sans SL).  
  Palette OK : emerald/red/zinc uniquement.

**Imports visuels :** aucun.

---

### Leçons 6, 7, 8, 9

```tsx
import { DebutantLessonView } from "../_components/DebutantLessonView";
export default function Page() { return <DebutantLessonView slug="leconX" />; }
```

Aucun composant local dans aucune de ces quatre leçons. Aucun risque.

---

## Détail des doublons détectés

### Doublon 1 — `TradeDiagram`

| | Fichier | Lignes |
|-|---------|--------|
| **Local** | `app/formations/debutant/lecon1/page.tsx` | 438–469 |
| **Global** | `app/formations/debutant/_components/DebutantLessonView.tsx` | (inventorié dans AUDIT_DEBUTANT.md, clean) |

**Risque d'exécution :** aucun — leçon 1 utilise un système entièrement distinct.  
**Risque maintenance :** les deux composants portent le même nom. Si on extrait `TradeDiagram` en global, un import mal ciblé pourrait prendre la mauvaise version.  
**Recommandation :** extraire vers `app/components/charts/TradeDiagram.tsx` et importer dans leçon 1 et dans `DebutantLessonView.tsx`.

---

### Doublon 2 — `CandleDiagram` ⚠️ PRIORITAIRE

| | Fichier | Lignes |
|-|---------|--------|
| **Local** | `app/formations/debutant/lecon3/page.tsx` | 4–58 |
| **Global (corrigé)** | `app/formations/debutant/_components/DebutantLessonView.tsx` | (corrigé en mini-sprint A) |

**Risque d'exécution :** aucun — leçon 3 utilise `LessonTemplate`, jamais `DebutantLessonView`.  
**Risque maintenance élevé :** même situation que `SpreadDiagram`/leçon 4 avant correction.  
La version dans `DebutantLessonView.tsx` a été corrigée (corps `#10b981`/`#ef4444`, mèches colorées). La version locale dans leçon 3 n'a **pas été corrigée** : corps #059669/#dc2626 avec opacité, mèches gray (#4b5563 dans `CandleExampleDiagram`).  
**Recommandation :** même traitement que SpreadDiagram/leçon 4 — extraire en `app/components/charts/CandleDiagram.tsx` (le composant `Candle.tsx` global existe déjà), remplacer la définition locale de leçon 3 par un import.

---

### Doublon 3 — `StopLossDiagram`

| | Fichier | Lignes |
|-|---------|--------|
| **Local** | `app/formations/debutant/lecon5/page.tsx` | 4–74 |
| **Global** | `app/formations/debutant/_components/DebutantLessonView.tsx` | (inventorié dans AUDIT_DEBUTANT.md, clean) |

**Risque d'exécution :** aucun — leçon 5 utilise `LessonTemplate`.  
**Risque maintenance :** même motif de nommage collision. Les deux versions semblent représenter le même concept mais avec des données différentes (le local de leçon 5 utilise Bitcoin 30 000 €).  
**Recommandation :** vérifier si les deux sont fonctionnellement identiques. Si oui, extraire en global. Si les données pédagogiques diffèrent, renommer l'un des deux (`StopLossDetailDiagram` par exemple) pour clarifier l'intention.

---

## Composants locaux avec couleurs hors palette

### `Confetti` — `lecon1/page.tsx` (lignes 338–372)

```ts
const CONFETTI_COLORS = [
  "#10b981", "#34d399", "#6ee7b7",   // ✓ emerald
  "#fbbf24", "#f59e0b",              // ✗ amber-400, amber-500 (usage non-warning)
  "#60a5fa", "#a78bfa", "#f472b6",   // ✗ #a78bfa = violet-400, #f472b6 = pink-400
];
```

Violations : `violet-400` et `pink-400` sont explicitement **interdits** dans la palette. `amber` est réservé aux warnings pédagogiques.  
Note : ce composant est un effet décoratif (célébration), pas un diagramme pédagogique. Priorité basse.

---

### `CandleDiagram` — `lecon3/page.tsx` (lignes 4–58)

| Élément | Valeur actuelle | Valeur correcte |
|---------|----------------|-----------------|
| Corps bougie verte | `fill="#059669" fillOpacity="0.85"` | `fill="#10b981"` (sans opacité) |
| Corps bougie rouge | `fill="#dc2626" fillOpacity="0.80"` | `fill="#ef4444"` (sans opacité) |
| Mèches (les deux) | `stroke="#52525b"` | `stroke="#059669"` (verte) / `stroke="#b91c1c"` (rouge) |

---

### `CandleExampleDiagram` — `lecon3/page.tsx` (lignes 61–84)

| Élément | Valeur actuelle | Valeur correcte |
|---------|----------------|-----------------|
| Mèches bougie verte | `stroke="#4b5563"` (gray-600 **interdit**) | `stroke="#059669"` |
| Mèches bougie rouge | `stroke="#4b5563"` (gray-600 **interdit**) | `stroke="#b91c1c"` |
| Corps bougie verte | `fill="#059669" fillOpacity="0.9"` | `fill="#10b981"` |
| Corps bougie rouge | `fill="#dc2626" fillOpacity="0.8"` | `fill="#ef4444"` |

---

## Carte des priorités

| Priorité | Action | Cible |
|----------|--------|-------|
| 🔴 Haute | Corriger `CandleDiagram` et `CandleExampleDiagram` dans leçon 3 (couleurs fausses visibles à l'écran) | `lecon3/page.tsx` |
| 🟡 Moyenne | Extraire `StopLossDiagram` (leçon 5) en global + clarifier le doublon nominal avec DebutantLessonView | `lecon5/page.tsx` |
| 🟢 Basse | Extraire `TradeDiagram` (leçon 1) en global | `lecon1/page.tsx` |
| 🟢 Basse | Corriger `Confetti` (leçon 1) : remplacer violet/pink par des couleurs palette | `lecon1/page.tsx` |
