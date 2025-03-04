# Système de Scoring des Opportunités Immobilières

Ce module fournit une évaluation standardisée et objective des opportunités d'investissement immobilier, en attribuant un score global et des sous-scores par catégorie à chaque propriété analysée.

## Fonctionnement général

Le système de scoring utilise une approche multicritères pondérée pour évaluer les opportunités d'investissement selon les principes fondamentaux du FLIP ou du MULTI, tels que définis dans la méthodologie professionnelle d'investissement immobilier.

### Échelle d'évaluation

- **Score global**: 0-100 points
- **Classification**:
  - 85-100: Opportunité exceptionnelle
  - 70-84: Très bonne opportunité
  - 55-69: Bonne opportunité
  - 40-54: Opportunité moyenne
  - 0-39: Opportunité risquée

## Critères d'évaluation par type d'investissement

### 1. Scoring FLIP

| Critère | Pondération | Description |
|---------|-------------|-------------|
| Marge bénéficiaire projetée | 40% | Évalue le profit potentiel (minimum 25 000$) |
| Temps estimé de détention | 20% | Analyse du délai de revente (idéal: 3-6 mois) |
| Coût des rénovations | 20% | Évaluation du budget nécessaire et du ratio coût/valeur ajoutée |
| Attractivité du secteur | 15% | Analyse du marché local pour la revente |
| Complexité des travaux | 5% | Évaluation de la difficulté technique des rénovations |

### 2. Scoring MULTI

| Critère | Pondération | Description |
|---------|-------------|-------------|
| Cashflow par porte | 40% | Évalue le revenu net mensuel par logement (cible: 75$/porte) |
| Ratio prix/revenu | 20% | Analyse du multiplicateur du revenu brut |
| Localisation | 20% | Évaluation de la qualité du secteur et de sa croissance |
| Potentiel d'appréciation | 10% | Analyse des tendances démographiques et économiques |
| État du bâtiment | 10% | Évaluation des besoins en entretien et rénovation |

## Algorithmes et méthodes de calcul

### Calcul du score global

Le score global est calculé selon la formule:

```
Score = ∑(Valeur_critère × Pondération_critère)
```

### Ajustements et modificateurs

Des modificateurs sont appliqués pour prendre en compte:

- Risques spécifiques liés à la propriété
- Opportunités exceptionnelles d'optimisation
- Facteurs macroéconomiques (taux d'intérêt, tendances du marché)
- Spécificités régionales du marché québécois

## Utilisation et intégration

### Entrées requises

- Données de la propriété (depuis l'analyseur de fiches)
- Résultats des calculateurs Napkin
- Paramètres de marché (optionnels pour un scoring plus précis)

### Sorties produites

- Score global sur 100
- Sous-scores par catégorie
- Recommandations spécifiques basées sur les points forts/faibles
- Visualisation graphique des résultats (radar chart)

## Personnalisation

Le système permet une personnalisation selon:

- Le profil d'investisseur (débutant, intermédiaire, avancé)
- Les objectifs d'investissement (court, moyen, long terme)
- La tolérance au risque
- Les préférences régionales

## Validations et améliorations continues

Le système de scoring est régulièrement calibré et affiné en fonction:

- Des retours d'utilisateurs
- Des résultats réels des investissements évalués
- Des évolutions du marché immobilier québécois
- Des meilleures pratiques émergentes dans l'investissement immobilier

## Avertissement

Le score attribué ne constitue pas une garantie de réussite. Il s'agit d'un outil d'aide à la décision qui doit être complété par votre propre jugement et l'avis de professionnels qualifiés.
