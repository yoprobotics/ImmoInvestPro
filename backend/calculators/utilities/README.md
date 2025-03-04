# Utilitaire de Comparaison de Scénarios d'Investissement

Cet utilitaire permet de comparer différents scénarios d'investissement immobilier pour déterminer la meilleure option selon plusieurs critères financiers.

## Fonctionnalités

- Analyse de scénarios de type FLIP (achat-rénovation-revente)
- Analyse de scénarios de type MULTI (immeubles à revenus)
- Calcul des indicateurs financiers clés (ROI, cashflow, taux de capitalisation, etc.)
- Comparaison multicritères pour identifier le meilleur scénario

## Installation

L'utilitaire est déjà intégré dans le projet. Aucune installation supplémentaire n'est nécessaire.

## Utilisation

### Depuis le backend (Node.js)

```javascript
const ScenarioComparisonUtility = require('../calculators/utilities/ScenarioComparisonUtility');

// Définition des scénarios
const scenarios = [
  {
    name: "Flip Maison Longueuil",
    purchasePrice: 300000,
    renovationCost: 50000,
    salePrice: 425000,
    monthsHeld: 4
  },
  {
    name: "Quintuplex St-Hubert",
    purchasePrice: 650000,
    renovationCost: 25000,
    units: 5,
    grossAnnualRent: 72000,
    downPaymentRatio: 0.20,
    interestRate: 4.25
  }
];

// Options de comparaison (facultatif)
const options = {
  prioritizeCashflow: true,
  weightCashflow: 0.5,
  weightCapRate: 0.3,
  weightCashOnCash: 0.2,
  minViableCashflowPerUnit: 75
};

// Comparer les scénarios
const results = ScenarioComparisonUtility.compareScenarios(scenarios, options);

console.log(results.summary);
console.log(`Meilleur scénario: ${results.bestOverall.name}`);
```

### Depuis l'API REST

Endpoint: `POST /api/comparison/compare`

Corps de la requête:

```json
{
  "scenarios": [
    {
      "name": "Flip Maison Longueuil",
      "purchasePrice": 300000,
      "renovationCost": 50000,
      "salePrice": 425000,
      "monthsHeld": 4
    },
    {
      "name": "Quintuplex St-Hubert",
      "purchasePrice": 650000,
      "renovationCost": 25000,
      "units": 5,
      "grossAnnualRent": 72000,
      "downPaymentRatio": 0.20,
      "interestRate": 4.25
    }
  ],
  "options": {
    "prioritizeCashflow": true,
    "weightCashflow": 0.5,
    "weightCapRate": 0.3,
    "weightCashOnCash": 0.2,
    "minViableCashflowPerUnit": 75
  }
}
```

### Depuis l'interface utilisateur

1. Accédez à la page "Comparaison de scénarios" dans l'application
2. Ajoutez autant de scénarios que vous souhaitez comparer
3. Configurez les options de comparaison selon vos préférences
4. Cliquez sur "Comparer les scénarios" pour voir les résultats

## Structure des données

### Scénarios FLIP

| Champ | Type | Description |
|-------|------|-------------|
| name | string | Nom du scénario |
| purchasePrice | number | Prix d'achat de la propriété |
| renovationCost | number | Coût des rénovations |
| salePrice | number | Prix de vente estimé |
| monthsHeld | number | Durée du projet en mois |

### Scénarios MULTI

| Champ | Type | Description |
|-------|------|-------------|
| name | string | Nom du scénario |
| purchasePrice | number | Prix d'achat de l'immeuble |
| renovationCost | number | Coût des rénovations |
| units | number | Nombre d'unités (logements) |
| grossAnnualRent | number | Revenus bruts annuels |
| downPaymentRatio | number | Ratio de mise de fonds (0-1) |
| interestRate | number | Taux d'intérêt annuel (%) |
| amortizationYears | number | Durée d'amortissement en années |

### Options de comparaison

| Option | Type | Défaut | Description |
|--------|------|--------|-------------|
| prioritizeCashflow | boolean | true | Prioriser le cashflow plutôt que le ROI |
| weightCashflow | number | 0.5 | Poids du cashflow dans l'évaluation globale |
| weightCapRate | number | 0.3 | Poids du taux de capitalisation |
| weightCashOnCash | number | 0.2 | Poids du rendement sur investissement |
| minViableCashflowPerUnit | number | 75 | Cashflow minimum par unité (Multi) |

## Formules utilisées

### FLIP

- **Profit** = Prix de vente - (Prix d'achat + Coût des rénovations + Frais de vente)
- **ROI** = (Profit / Investissement total) × 100
- **ROI annualisé** = ROI × (12 / Durée en mois)

### MULTI

- **NOI (Revenu net d'exploitation)** = Revenus bruts - Dépenses
- **Taux de capitalisation** = (NOI / Investissement total) × 100
- **Cashflow** = NOI - Paiements hypothécaires
- **Cashflow par unité** = Cashflow mensuel / Nombre d'unités
- **Rendement sur mise de fonds** = (Cashflow annuel / Mise de fonds) × 100

## Développement

### Tests

Des tests unitaires sont disponibles dans le dossier `backend/tests/utilities`. Pour les exécuter:

```bash
cd backend
npm test
```

### Améliorer l'utilitaire

Voici quelques idées pour améliorer cet utilitaire:

1. Ajouter plus de métriques financières (TRI, VAN, délai de récupération)
2. Intégrer des prévisions de croissance des loyers et de la valeur des propriétés
3. Ajouter un modèle pour les propriétés commerciales
4. Générer des graphiques comparatifs
5. Exporter les résultats en PDF ou Excel

## Contributeurs

- Équipe ImmoInvestPro
