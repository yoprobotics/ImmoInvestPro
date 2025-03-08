# Calculateur de Taxes de Mutation (Taxe de Bienvenue)

Ce calculateur permet d'estimer les taxes de mutation (communément appelées "taxe de bienvenue" au Québec) qui devront être payées lors de l'acquisition d'une propriété immobilière.

## Fonctionnalités

- Calcul des taxes de mutation selon les taux standards du Québec
- Gestion des taux spécifiques pour Montréal
- Prise en compte des exemptions pour les premiers acheteurs à Montréal
- Option pour utiliser un taux personnalisé pour les municipalités avec des taux différents
- Affichage détaillé du calcul par tranche

## Comment utiliser le calculateur

1. Entrez la valeur de la propriété (prix d'achat ou évaluation municipale, selon le montant le plus élevé)
2. Spécifiez la municipalité (important pour déterminer si des taux spécifiques à Montréal s'appliquent)
3. Si la propriété est à Montréal, vous pouvez indiquer si vous êtes admissible à une exemption
4. Pour les municipalités ayant des taux différents, vous pouvez activer l'option "Taux personnalisé" et entrer le taux applicable
5. Le résultat s'affiche immédiatement, avec un calcul approximatif local et la possibilité de faire un calcul précis via l'API

## Taux de taxation en vigueur (2023-2024)

### Taux standards au Québec

| Tranche                     | Taux     |
|-----------------------------|----------|
| 0 $ à 53 700 $              | 0,5 %    |
| 53 700,01 $ à 269 200 $     | 1,0 %    |
| 269 200,01 $ et plus        | 1,5 %    |

### Taux spécifiques à Montréal

| Tranche                     | Taux     |
|-----------------------------|----------|
| 0 $ à 53 700 $              | 0,5 %    |
| 53 700,01 $ à 269 200 $     | 1,0 %    |
| 269 200,01 $ à 500 000 $    | 1,5 %    |
| 500 000,01 $ à 1 000 000 $  | 2,0 %    |
| 1 000 000,01 $ et plus      | 2,5 %    |

## Exemptions

La Ville de Montréal offre un programme d'aide à l'acquisition d'une première résidence qui permet d'obtenir une exemption pouvant aller jusqu'à 5 000$ sur les taxes de mutation.

### Conditions d'admissibilité

- Être un premier acheteur, ou
- Acquérir sa première propriété au Québec
- Avoir l'intention d'y établir sa résidence principale

## Intégration dans les projets

Le calculateur de taxes de mutation peut être utilisé de trois façons différentes :

1. **Comme page autonome** : Accessible via `/calculators/transfer-tax`
2. **Comme composant intégré** : Pour être utilisé dans d'autres pages ou composants
3. **Via l'API** : Appels directs à l'endpoint `/api/calculators/transferTax`

### Exemple d'utilisation du composant dans un autre composant

```jsx
import React from 'react';
import TransferTaxCalculator from '../components/calculators/financial/TransferTaxCalculator';

const MyComponent = () => {
  const handleCalculationComplete = (result) => {
    console.log('Taxes de mutation calculées:', result.transferTaxTotal);
    // Utilisez le résultat comme vous le souhaitez
  };

  return (
    <div>
      <h2>Mon projet immobilier</h2>
      
      {/* Intégration du calculateur sans titre et sans être autonome */}
      <TransferTaxCalculator 
        initialValue={350000}
        initialMunicipality="Québec"
        onCalculationComplete={handleCalculationComplete}
        standalone={false}
        hideTitle={true}
      />
    </div>
  );
};
```

### Exemple d'appel API

```javascript
// Appel API pour calculer les taxes de mutation
const calculateTransferTax = async () => {
  try {
    const response = await fetch('/api/calculators/transferTax', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        propertyValue: 350000,
        municipality: 'Montréal',
        isFirstTimeHomeBuyer: true,
        isFirstHomeInQuebec: false,
        customRatePercentage: null // Optionnel
      }),
    });
    
    const data = await response.json();
    console.log('Résultat du calcul:', data);
    
    // Utilisez data.transferTaxTotal pour obtenir le montant total des taxes
    // data.details contient le détail du calcul par tranche
    // data.exemption contient les informations sur l'exemption appliquée
  } catch (error) {
    console.error('Erreur lors du calcul des taxes de mutation:', error);
  }
};
```

## Notes importantes

- Les montants et taux utilisés dans ce calculateur sont basés sur les informations disponibles pour 2023-2024 et peuvent changer. Vérifiez toujours les taux en vigueur auprès de la municipalité concernée.
- Le résultat est une estimation et ne constitue pas une garantie du montant exact qui sera facturé par la municipalité.
- Il est recommandé de consulter un notaire pour obtenir une information précise sur les taxes de mutation applicables à votre situation.
