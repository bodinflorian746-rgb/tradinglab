# AUDIT CLEANUP — Orange / Amber-500 / #f59e0b

Audit exhaustif des violations de palette (orange-\*, amber-500, #f59e0b) dans `app/formations/`.  
Date : 2026-04-24 — Toutes les corrections ont été appliquées.

---

## Règles de remplacement appliquées

| Couleur source | Contexte sémantique | Remplacement |
|---|---|---|
| `orange-*` / `amber-500` | Erreur pédagogique / interdiction forte | → `red-*` |
| `orange-*` / `amber-500` | Avertissement / caution / état neutre | → `amber-400` |
| `orange-*` / `amber-500` | Étiquette informationnelle / catégorie / icône neutre | → `blue-400` |
| `#f59e0b` (amber-500 hex) | Confetti décoratif | → `#fcd34d` (amber-300) |

---

## Section A — Corrections en RED

**Sémantique :** erreurs pédagogiques, interdictions, comportements à ne jamais adopter.

| Fichier | Élément | Avant | Après |
|---|---|---|---|
| `intermediaire/lecon1/page.tsx` | Section "Erreur classique" | `border-orange-500/20 bg-orange-500/5 text-orange-400` | `border-red-500/20 bg-red-500/5 text-red-400` |
| `intermediaire/lecon2/page.tsx` | Section "Erreur classique" | `border-orange-500/20 bg-orange-500/5 text-orange-400` | `border-red-500/20 bg-red-500/5 text-red-400` |
| `intermediaire/lecon3/page.tsx` | Section "Erreur classique" | `border-orange-500/20 bg-orange-500/5 text-orange-400` | `border-red-500/20 bg-red-500/5 text-red-400` |
| `intermediaire/lecon4/page.tsx` | Section "Erreur classique" | `border-orange-500/20 bg-orange-500/5 text-orange-400` | `border-red-500/20 bg-red-500/5 text-red-400` |
| `intermediaire/lecon5/page.tsx` | Section "Erreur classique" | `border-orange-500/20 bg-orange-500/5 text-orange-400` | `border-red-500/20 bg-red-500/5 text-red-400` |
| `intermediaire/lecon6/page.tsx` | Section "Erreur classique" | `border-orange-500/20 bg-orange-500/5 text-orange-400` | `border-red-500/20 bg-red-500/5 text-red-400` |
| `intermediaire/lecon7/page.tsx` | Section "Erreur classique" | `border-orange-500/20 bg-orange-500/5 text-orange-400` | `border-red-500/20 bg-red-500/5 text-red-400` |
| `intermediaire/lecon8/page.tsx` | Section "Erreur classique" | `border-orange-500/20 bg-orange-500/5 text-orange-400` | `border-red-500/20 bg-red-500/5 text-red-400` |
| `intermediaire/lecon9/page.tsx` | Section "Erreur classique" | `border-orange-500/20 bg-orange-500/5 text-orange-400` | `border-red-500/20 bg-red-500/5 text-red-400` |
| `intermediaire/lecon9/page.tsx` | Card "Ce que tu ne dois PAS faire" | `bg-orange-500/5 border-orange-500/15 text-orange-400` | `bg-red-500/5 border-red-500/15 text-red-400` |

---

## Section B — Corrections en AMBER-400

**Sémantique :** avertissements, cautions, états intermédiaires, UI de navigation active.

| Fichier | Élément | Avant | Après |
|---|---|---|---|
| `formations/page.tsx` | Badge "En cours" (isActive) | `bg-amber-500/10 border-amber-500/20` | `bg-amber-400/10 border-amber-400/20` |
| `formations/page.tsx` | Fond ligne active (isActive) | `bg-amber-500/5 hover:bg-amber-500/10` | `bg-amber-400/5 hover:bg-amber-400/10` |
| `debutant/_components/DebutantLessonView.tsx` | BreakEven step 2 | `bg-amber-500/5 border-amber-500/20` + `bg-amber-500/10 border-amber-500/20` | `bg-amber-400/5 border-amber-400/20` + `bg-amber-400/10 border-amber-400/20` |
| `debutant/_components/DebutantLessonView.tsx` | Overconfidence card (ErrorsDiagram) | `border-amber-500/20 bg-amber-500/5` | `border-amber-400/20 bg-amber-400/5` |
| `intermediaire/lecon5/page.tsx` | "Niveau psychologique" categorie | `bg-amber-500/5 border-amber-500/15` | `bg-amber-400/5 border-amber-400/15` |
| `intermediaire/lecon5/page.tsx` | Card "2 confluences + signal" | `bg-amber-500/5 border-amber-500/15` | `bg-amber-400/5 border-amber-400/15` |
| `intermediaire/lecon6/page.tsx` | Step 2 indicateur "Fake breakout confirmé" | `text-orange-400` | `text-amber-400` |
| `intermediaire/lecon6/page.tsx` | Card "Fake breakout" (action caution) | `bg-orange-500/5 border-orange-500/15 text-orange-400` | `bg-amber-400/5 border-amber-400/15 text-amber-400` |
| `intermediaire/lecon7/page.tsx` | Card "Daily aligné, H4 pas encore sur zone" | `bg-amber-500/5 border-amber-500/15` | `bg-amber-400/5 border-amber-400/15` |
| `intermediaire/lecon8/page.tsx` | Card "Trade hors plan → tu passes" | `bg-orange-500/5 border-orange-500/15 text-orange-400` | `bg-amber-400/5 border-amber-400/15 text-amber-400` |
| `intermediaire/lecon9/page.tsx` | Card "Niveau Fib seul (sans confluence)" | `bg-amber-500/5 border-amber-500/15` | `bg-amber-400/5 border-amber-400/15` |
| `avance/lecon7/page.tsx` | Card "Entrée sur le sweep + retournement" | `bg-orange-500/5 border-orange-500/15 text-orange-400` | `bg-amber-400/5 border-amber-400/15 text-amber-400` |

---

## Section C — Corrections en BLUE-400

**Sémantique :** étiquettes informationnelles, catégories, icônes neutres, indicateurs de progression.

| Fichier | Élément | Avant | Après |
|---|---|---|---|
| `intermediaire/lecon5/page.tsx` | "Niveau Fibonacci" categorie label | `bg-orange-500/5 border-orange-500/15 text-orange-400` | `bg-blue-500/5 border-blue-500/15 text-blue-400` |
| `intermediaire/lecon6/page.tsx` | Icône SVG info (liste reconnaître fake) | `text-orange-400` | `text-blue-400` |
| `intermediaire/lecon7/page.tsx` | Card "EUR/USD — M15 (déclencheur)" | `bg-orange-500/5 border-orange-500/15 text-orange-400` | `bg-blue-500/5 border-blue-500/15 text-blue-400` |
| `intermediaire/lecon9/page.tsx` | Niveau "50%" dans tableau Fibonacci | `text-orange-400` | `text-blue-400` |
| `intermediaire/lecon9/page.tsx` | Steps 1-4 indicateurs (tracer Fibonacci) | `text-orange-400` | `text-blue-400` |
| `avance/lecon3/page.tsx` | Steps 1-3 indicateurs (cycle OB) | `text-orange-400` | `text-blue-400` |
| `avance/lecon3/page.tsx` | Bullet point list (OB + confluences) | `bg-orange-500` (dot) | `bg-blue-400` |
| `avance/lecon5/page.tsx` | Card "Zone OTE" info | `bg-orange-500/5 border-orange-500/15 text-orange-400` | `bg-blue-500/5 border-blue-500/15 text-blue-400` |
| `avance/lecon5/page.tsx` | Steps 1-5 indicateurs (tracer OTE) | `text-orange-400` | `text-blue-400` |
| `avance/lecon6/page.tsx` | Icône SVG info (liste liquidité) | `text-orange-400` | `text-blue-400` |
| `avance/lecon9/page.tsx` | Steps 2-5 indicateurs (backtest) | `text-orange-400` | `text-blue-400` |

---

## Section D — Remplacement hex

| Fichier | Élément | Avant | Après |
|---|---|---|---|
| `debutant/lecon1/page.tsx` | CONFETTI_COLORS array | `"#f59e0b"` (amber-500) | `"#fcd34d"` (amber-300) |

---

## Bilan

- **Fichiers modifiés :** 16
- **Violations corrigées :** 36
- **Violations restantes :** 0 (vérification grep post-correction)
- **Palette finale autorisée :** zinc / emerald / red / blue-400 / amber-400 / white

Les 3 fichiers traités lors de la session précédente (RetracementInteractive, StopHuntInteractive, MultiTimeframeDiagram) ne sont pas inclus dans ce rapport — ils ont été corrigés dans la session antérieure (AUDIT_MACRO_VISUELS.md).
