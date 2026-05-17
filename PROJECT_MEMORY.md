# CONTEXTE PROJET — EDGETRADE / TradingLab

> Document mis à jour à chaque clôture de session. À lire IN
> EXTENSO en début de session avant toute action.

## Path projet
- Racine : `c:\Users\flori\tradinglab`
- Nom UI affiché : "TradingLab" (rebrand EDGETRADE prévu plus tard)

## STACK TECHNIQUE (strict)

- Next.js 16.2.4 (App Router, Turbopack) — APIs récentes, ne
  JAMAIS supposer que les patterns Next.js 13/14/15 fonctionnent
- React 19.2.4
- TypeScript strict (pas de `any`, pas de `@ts-ignore`)
- Tailwind CSS v4 (`@theme` dans globals.css, PAS de
  tailwind.config.js)
- Supabase auth partiel (3 erreurs TS tolérées sur
  `lib/supabase/client` manquant)
- Aucune librairie tierce de composants (pas de shadcn, Radix,
  MUI, framer-motion, recharts, chart.js, d3)
- Tous les visuels en SVG inline custom

## DESIGN SYSTEM STRICT

### Palette autorisée
- Fond principal : zinc-950 (#09090b)
- Surfaces : zinc-900, zinc-800
- Bordures : zinc-800 / zinc-700
- Texte : white, zinc-300, zinc-400, zinc-500
- Accent primaire : emerald-500 (#10b981), hover emerald-400
- Erreur : red-500, red-400, red-700
- Warning : amber-400 (PAS amber-500)
- Info : blue-400

### Mapping couleur par niveau
- Débutant : EMERALD-500
- Intermédiaire : BLUE-400
- Avancé : AMBER-400

### Interdits absolus
- orange-*, yellow-*, purple-*, violet-*, pink-*, cyan-*,
  lime-*, indigo-*, slate-*, gray-*
- amber-500 (utiliser amber-400)

### Bougies canoniques
- Bullish corps : #10b981, mèche #059669, strokeWidth 1.5
- Bearish corps : #ef4444, mèche #b91c1c, strokeWidth 1.5

### Style global
- Minimaliste, dark-only
- Pas d'ombres, pas de dégradés
- Typo Inter via next/font
- Pastilles opaques obligatoires derrière badges/textes en
  superposition

## CONVENTIONS

- IDs leçons : `lecon1`, `lecon2`... (sans accent)
- IDs formations : `debutant`, `intermediaire`, `avance`,
  `macro-debutant`, `macro-intermediaire`, `macro-avance`
- Diagram IDs : kebab-case
- Tout en FRANÇAIS
- localStorage key : `tradinglab_progress` (NE JAMAIS changer)
- Naming : PascalCase composants / camelCase utilitaires

## ARCHITECTURE LEÇONS — 3 SYSTÈMES COEXISTANTS (PIÈGE)

1. `DebutantLessonView` (data-driven via `lib/lessons.ts`) →
   Débutant 2, 6, 7, 8, 9
2. `LessonTemplate` (semi-custom, prop `visual`) → Débutant 3, 4, 5
3. Custom JSX → Débutant 1 + TOUTES Intermédiaire/Avancé +
   TOUTES Macro + TOUTES Stratégies

⚠️ DOUBLONS POSSIBLES : un même composant peut exister en local
ET global. TOUJOURS faire un GREP GLOBAL avant de modifier un
composant existant.

## ROADMAP PRODUIT

- ✅ Phase 1, 1bis, 1ter, cleanup — TERMINÉES
- ✅ Phase 2 Macro — TERMINÉE (16 leçons live : 6/6/4)
- 🔄 Phase 3 Stratégies — EN COURS
  - ✅ Module 1 Price Action : 4 sous-leçons live, retail-calibrées
  - ⏸️ Modules 2-8 : à démarrer
- ⏸️ Phase 4 Mini-jeux pédagogiques
- ⏸️ Phase 4.5 Risk Manager interactif 7 actifs
- ⏸️ Phase 4.7 Refonte responsive mobile globale
- ⏸️ Phase 5 Backend (Supabase auth, Stripe, paywall)
- 🚀 LANCEMENT V1 — Mois 3-4
- ⏸️ Phase 6+ Jeux, design, journal IA, Discord, IA temps réel

## COMPTEURS ACTUELS

- `TOTAL_FREE_LESSONS = 47` dans `lib/progress.ts`
- Trading Débutant 9, Inter 9, Avancé 9 (=27)
- Macro Débutant 6, Inter 6, Avancé 4 (=16)
- Module 1 Stratégies Price Action 4 (=4)
- Total : 47

## COMPOSANTS DÉJÀ EN PLACE (ne JAMAIS recréer)

Dans `app/components/charts/` :

**Trading classique** :
Candle, SupportResistance, GraphFakeBreakout,
MarketStructureDiagram, BOSDiagram, CHoCHDiagram,
SupplyDemandDiagram, TrendDiagram, ConfluenceDiagram,
MultiTimeframeDiagram, TradePlanDiagram, FibonacciDiagram,
RetracementInteractive, LiquidityPoolsDiagram, FVGDiagram,
OrderBlockDiagram, KillzonesDiagram, OTEDiagram,
StopHuntInteractive, PrecisionEntryDiagram,
TradingJournalDiagram, BacktestMetricsDiagram, SpreadDiagram,
CandleAnatomyDiagram, SpreadVariationDiagram,
StopLossChartDiagram, BiasDiagram

**Macro** :
DollarHubDiagram, CentralBanksHierarchy, MacroCalendarDiagram,
TradingSessionsLiquidityDiagram, InflationIndicatorsChainDiagram,
InflationChainDiagram, CorrelationMatrixDiagram,
WeeklyBiasCalendarDiagram, NFPReportAnatomyDiagram,
US10YHubDiagram, FOMCTimelineDiagram, HawkishDovishScale,
ConsensusVsRealDiagram, MacroDangerWindowsDiagram,
CalendarReadingComparisonDiagram, RiskRegimesQuadrantDiagram

**Stratégies (Phase 3 Module 1)** :
PinBarSetupDiagram, EngulfingSetupDiagram, MultiTFEntryDiagram

## PROTOCOLES MÉTHODOLOGIQUES (OBLIGATOIRES)

1. **Audit qualité ET exhaustivité** avant chaque phase qui
   touche à l'existant
2. **"Le rendu prouve, pas le code"** — validation visuelle
   uniquement, jamais sur parole de Claude Code
3. **Règle du 1er échec visuel** : si la modif ne change pas
   l'écran, ARRÊT et diagnostic source obligatoire (grep +
   imports réels)
4. **Critères de validation explicites** dans chaque prompt
   Claude Code
5. **Auto-audit obligatoire en fin de sprint** : modifié /
   vérifié / pas vérifié / risques / prochaine action
6. **Captures pleine page (GoFullPage Chrome)** pour validation
   fin de phase
7. **Mini-sprints** (3-5 fichiers max, 3-5 leçons max par lot)
8. **"1 composant par prompt Claude Code"**
9. **Plan pédagogique complet AVANT code** pour toute nouvelle
   phase visuelle
10. **Règle des 2 échecs → refonte** : 2 patches qui ne
    produisent pas le résultat = refonte complète

## RÈGLES VALIDÉES PHASE 2 MACRO

11. **FORMAT AUTO-CHECK OBLIGATOIRE** en début de chaque
    réponse (instruction en cours, consigne ancienne, attentes
    PO, risques de dérapage, validation respect)
12. **Critère équilibre multi-actifs = PERTINENCE, PAS QUOTA**.
    Jamais "minimum X mentions XAU/BTC"
13. **Hero = phrase conceptuelle** qui pose le problème. PAS
    de hero immersif "23h45 setup parfait"
14. **POINTS pour intra-day** (vocabulaire trader retail +
    institutionnel). Exception : % pour mouvements annuels
15. **Workflow hybride strict** : Claude prépare brief →
    ChatGPT rédige → Claude review → PO valide → Claude livre
    PROMPT 1 (SVG si nouveau composant) puis PROMPT 2 (page)
    en BATCH → Claude Code intègre → screen validation → audit
16. **Format BATCH** : tous les prompts d'un coup, pas 1 par 1
17. **Anti-réécriture renforcée** : consigne explicite à Claude
    Code de COPIER MOT POUR MOT le contenu pédagogique sans
    paraphraser
18. **Pas de "stop forcé" non sollicité** : ne PAS proposer
    d'arrêter la session si le PO n'a pas demandé
19. **Cohérence chiffres marché actuel** : pour les ordres de
    grandeur, demander confirmation au PO au lieu d'inventer
20. **Bug visuel suspect → vérification source AVANT patch** :
    grep source avant patches à l'aveugle (application concrète
    de #3)
21. *(réservé)*
22. *(réservé)*

## RÈGLES RETAIL-FIRST (session post-vacances)

23. **CIBLE RETAIL-FIRST** : capital 300-1 000€ (max 2 000€)
    en fonds propres sur broker classique (XTB, IG,
    Pepperstone, RoboForex). **PAS de propfirm**. Job à côté
    → format "trader en 15 min/jour". 4 objections à adresser :
    - Temps ("j'ai 30 min ce soir")
    - Capital ("j'ai 500€, je peux pas me planter")
    - Connaissance ("je viens du YouTube, j'ai des trous")
    - Confiance ("j'ai déjà perdu, j'ai peur")
    Exemples chiffrés en % du capital + déclinaison € pour 3
    tailles de compte (ex : 500€ / 1 000€ / 2 500€). JAMAIS
    d'angle institutionnel par défaut. EXCEPTION : Trading
    Avancé positionné ICT/Smart Money → on garde le ton ICT
    sur Avancé, on ajoute juste un encadré retail pour incarner.

24. **ADAPTER À TOUS LES STYLES MULTI-TF** : présenter les 4
    hiérarchies sur le même plan :
    - Swing : Weekly → Daily → H4
    - Intraday calme : Daily → H4 → H1
    - **INTRADAY ACTIF : H4 → H1 → M30** ⭐ cible majoritaire
    - **DAY TRADING ACTIF : H1 → M30 → M15** ⭐ cible majoritaire
    Les 2 hiérarchies majoritaires (intraday actif + day
    trading actif) doivent être incarnées dans les exemples
    concrets. M1/M5 déconseillés explicitement pour Débutant.
    PAS de scalping pour Débutant. NE JAMAIS écrire "uniquement
    en H1 que tu entres".

25. **ENCADRÉ "ET TOI, RETAIL ?"** dans toutes les leçons avec
    setup chiffré concret. Format strict :
    - Couleur emerald (cohérence Débutant)
    - Classes Tailwind validées :
      wrapper `border border-emerald-500/20 bg-emerald-500/5 rounded-xl p-6 my-8`
      titre `text-emerald-400 uppercase tracking-widest text-xs font-bold mb-4`
      contenu `text-zinc-300 leading-relaxed space-y-3`
    - Structure : 3 paragraphes en prose continue (PAS de
      bullets)
      1. Mise en situation (capital concret + heure + contexte)
      2. Le signal (setup tiré directement de la leçon)
      3. Action concrète (entrée + SL + TP + risque/gain en €)
         + phrase finale d'ancrage "Tu coupes ton chart, [action
         post-trade]"
    - Variabilité OBLIGATOIRE : capital et heure différents
      entre encadrés (anti-redondance)
    - Position : vers les 2/3, avant le bloc "Erreurs/Pièges"

26. **AUDIT RÉTROSPECTIF SYSTÉMATIQUE** : à chaque clôture de
    phase/module, audit anti-biais de TOUTES les leçons
    produites AVANT de bouger sur la suite. Inclut cohérence
    cible, absence d'angle institutionnel non assumé, présence
    d'encadrés retail, calibration % capital.

27. **ANTI-SYCOPHANCY / ANTI-SUPPOSITION** : Claude cherche
    activement si SA proposition était fausse AVANT que le PO
    le challenge.
    - NE PAS inventer des concepts (propfirm, etc.) jamais
      mentionnés par le PO
    - Si pas sûr → demander, pas supposer
    - Vérifier SES propres calculs (R/R, conversions €, math)
      AVANT de livrer un brief
    - Reconnaître ouvertement quand une supposition antérieure
      était fausse
    - "Trop sycophant" ou "tu supposes" du PO → arrêt et
      correction immédiate

## RÈGLES DE COLLABORATION

- Prompts Claude Code SCOPÉS ET PETITS (3 fichiers max par
  session, jamais de gros chantier en masse)
- Chaque prompt Claude Code commence par LECTURE OBLIGATOIRE
  de 2-3 fichiers de référence
- Format : direct, structuré, contraintes claires + "ne fais
  rien d'autre que X" + "ce que tu ne dois PAS faire" 
  explicite
- Priorités : Phase 3 Stratégies > jeux > backend
- Communication en français, direct, prises d'initiative
  bienvenues
- Claude peut challenger les décisions PO si raison

## PRÉFÉRENCES PO

- Réponses claires, structurées markdown
- Pas de baratin commercial, pas de flatterie
- Estimations de temps réalistes
- Avis franc à la fin des options proposées (pas "à toi de
  voir")
- Limiter A/B/C/D — trancher quand la bonne réponse est claire
- Dictée vocale parfois → tolérer tournures orales

## INCIDENT HISTORIQUE 1 — SpreadDiagram (Phase 1ter)

1h perdue à patcher SpreadDiagram sans rendu visuel qui
changeait. Cause : doublon local de SpreadDiagram dans
`lecon4/page.tsx` surchargeait le composant global. Leçon :
 audit d'exhaustivité (grep global + matrice
 leçon→composant réel) OBLIGATOIRE avant toute phase qui
 touche l'existant.

## INCIDENT HISTORIQUE 2 — Pivot retail-first (session post-vacances)

J'ai construit un brief de refonte Module 1 Stratégies sur
des suppositions FAUSSES :
- Hallucination du mot "propfirm" à partir d'une mention
  d'affiliation 300€
- Cadrage swing pur (cible 1% des retails)
- Voix retail-direct abandonnée pendant 20 leçons (Phase 2
  Macro + Module 1 Stratégies) sans m'en rendre compte

Cause racine : je n'ai JAMAIS lu une leçon Phase 1 Trading
Débutant au démarrage Phase 2 pour étalonner le ton retail.
J'ai supposé au lieu de vérifier.

Leçon : règle #27 (anti-sycophancy / anti-supposition) +
 règle #1 (audit d'exhaustivité). Lire 1-2 leçons existantes
 représentatives AVANT toute nouvelle phase pédagogique pour
 étalonner le ton.

## COMMENT COMMENCER UNE SESSION

1. Lire `PROJECT_MEMORY.md` (ce fichier) IN EXTENSO
2. Lire les fichiers `AUDIT_*.md` à la racine s'ils existent
3. Demander au PO ce qu'on fait aujourd'hui
4. Appliquer les protocoles méthodologiques dès le départ
5. FORMAT AUTO-CHECK obligatoire à chaque réponse

## DETTE TRACÉE

- #1 Cas surprise négative NFP Débutant 3 manque matrice
- #4 Test mobile composants Macro → Phase 4.7
- #5 Tracking progression macro/MT5 dashboard → Phase 5
- #8 Refonte design globale → Phase 7
- #9 Pas de menu burger mobile → Phase 4/5
- #10 2× #f59e0b app/jeux + 1× text-gray-400 app/login à
  re-vérifier
- #11 Refacto architecture Option A → Phase 5
- #12 Risk Manager interactif 7 actifs → Phase 4.5
- #13 Refonte responsive mobile globale → Phase 4.7
- #14 Erreurs Supabase build (lib/supabase/client manquant)
  tolérées
- #16 Filtre binaire pré-trade + psycho à recycler → Phase 6+
- #17 Ariane pages module Stratégies : ajouter le niveau
- #18 Mini-fiche récap stratégie en haut leçons stratégie
- #19 Module 6 Multi-TF Process = LE module multi-style
  (tranché, pas de fusion)
- #20 Matrice formelle leçons Stratégies → Formation
  référencées avant Modules 4/7/8
- #27 *(réservé)*
- #30 CandleDiagram lecon3 local : couleurs #059669/#dc2626
  fillOpacity au lieu de #10b981/#ef4444
- #31 Confetti lecon1 : violet-400 + pink-400 (interdits)
- #32 Refactor `Candle.tsx` mèches zinc-700 → emerald-400/red-400
- #33 *(résolu Sprint 2A)*
- #34 Trading Avancé 9 leçons sans blocs structurels
  signature ("Erreur classique", "Résumé en 3 secondes",
  etc.) — incohérence avec Inter
- #35 Page d'accueil silencieuse sur cible retail 300-1 000€
  → URGENCE 4.1 à faire
- #36 Middleware Next.js 16 deprecated (renommer en proxy.ts)
- #37 Progression "0/9" sous MT5 disabled = trompeur, à
  masquer
- #38 Vérifier cliquabilité MT5 disabled (devrait pas être
  cliquable)

## SESSION POST-VACANCES (DERNIÈRE) — RÉSUMÉ

URGENCES RÉSOLUES :
- ✅ URGENCE 1 : Build TS débloqué (DebutantLessonView.tsx
  ligne 307 : `tier.colorFade ?? undefined`)
- ✅ URGENCE 2 : Module 1 Stratégies Price Action refonte
  retail-first (lecon2 Pin bar, lecon3 Engulfing, lecon4
  Multi-TF profonde — lecon1 sautée car 100% conceptuelle)
- ✅ URGENCE 3 partielle : 3 leçons critiques avec encadré
  retail (Stop Hunts + FOMC + NFP)
- ✅ URGENCE 4 : 3 quick wins cohérence produit (orphan
  supprimé + MT5 disabled + compteurs dynamiques home)

URGENCES RESTANTES :
- ⏸️ URGENCE 3 résiduel : Trading Inter 7 (Multi-TF), Macro
  Inter 6 (Biais hebdo), 8 autres leçons Trading Avancé ICT
- ⏸️ URGENCE 4.1 : Refonte page accueil retail-first (1-2h
  de copy)
