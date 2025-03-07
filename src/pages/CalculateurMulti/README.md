# Composant CalculateurMulti

Ce composant implémente le calculateur Napkin MULTI selon la méthodologie des "Secrets de l'immobilier".

## Structure du code

- `CalculateurMulti.js` : Composant principal
- `CalculateurMultiForm.js` : Formulaire de saisie des données
- `CalculateurMultiResults.js` : Affichage des résultats
- `CalculateurMultiContext.js` : Gestion de l'état global du calculateur
- `CalculateurMulti.test.js` : Tests unitaires

## Formules implémentées

### Calcul des dépenses
```javascript
function calculerDépenses(revenusBruts, nombreLogements) {
  let tauxDepenses;
  
  // Détermination du taux de dépenses selon le nombre de logements
  if (nombreLogements <= 2) {
    tauxDepenses = 30;
  } else if (nombreLogements <= 4) {
    tauxDepenses = 35;
  } else if (nombreLogements <= 6) {
    tauxDepenses = 45;
  } else {
    tauxDepenses = 50;
  }
  
  // Calcul des dépenses annuelles
  return revenusBruts * (tauxDepenses / 100);
}
```

### Méthode HIGH-5
```javascript
function calculerFinancement(prixAchat) {
  // Calcul du paiement mensuel selon la méthode HIGH-5
  const paiementMensuel = prixAchat * 0.005;
  
  // Calcul du financement annuel
  return paiementMensuel * 12;
}
```

### Calcul de la liquidité
```javascript
function calculerLiquidite(revenusNetsOperation, financementAnnuel) {
  // Calcul de la liquidité annuelle
  const liquiditeAnnuelle = revenusNetsOperation - financementAnnuel;
  
  // Calcul de la liquidité par porte/mois
  const liquiditeParPorte = liquiditeAnnuelle / nombreLogements / 12;
  
  return {
    liquiditeAnnuelle,
    liquiditeParPorte
  };
}
```

### Calcul du prix d'achat maximum
```javascript
function calculerPrixAchatMaximum(revenusNetsOperation, nombreLogements, liquiditeCible = 75) {
  // Liquidité annuelle cible
  const liquiditeAnnuelleCible = nombreLogements * liquiditeCible * 12;
  
  // Financement annuel maximum acceptable
  const financementMaximum = revenusNetsOperation - liquiditeAnnuelleCible;
  
  // Prix d'achat maximum
  return (financementMaximum / 12) / 0.005;
}
```

## Props et États

### Props du composant principal
- `initialValues`: Objet contenant les valeurs initiales du formulaire
- `onCalculate`: Fonction appelée après un calcul réussi
- `onSave`: Fonction pour sauvegarder l'analyse
- `onReset`: Fonction pour réinitialiser le formulaire
- `mode`: "napkin" (par défaut) ou "detailed" pour afficher les options avancées

### État global (Context)
- `formValues`: Valeurs du formulaire
- `results`: Résultats des calculs
- `isCalculating`: Booléen indiquant si un calcul est en cours
- `errors`: Erreurs de validation du formulaire
- `mode`: Mode actuel du calculateur

## Hooks personnalisés

### `useCalculateurMulti`
Hook principal pour accéder à l'état global et aux fonctions du calculateur:

```javascript
const { 
  formValues, 
  results, 
  isCalculating, 
  errors,
  mode,
  setFormValues,
  calculate,
  reset,
  setMode,
  validateForm
} = useCalculateurMulti();
```

## Exemple d'utilisation

```jsx
import React from 'react';
import { CalculateurMulti } from './CalculateurMulti';

function AnalysePage() {
  const handleCalculate = (results) => {
    console.log('Résultats du calcul:', results);
  };

  const handleSave = (formValues, results) => {
    console.log('Sauvegarde de l'analyse:', { formValues, results });
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Analyse d'immeuble à revenus</h1>
      <CalculateurMulti
        initialValues={{
          prixAchat: 500000,
          nombreAppartements: 6,
          revenusBruts: 60000
        }}
        onCalculate={handleCalculate}
        onSave={handleSave}
        mode="napkin"
      />
    </div>
  );
}
```

## Tests
Le composant inclut des tests unitaires qui vérifient:
- Le rendu correct des différents modes (napkin/détaillé)
- L'exactitude des calculs selon différents scénarios
- La validation du formulaire
- Le comportement interactif (changement de mode, etc.)

Pour exécuter les tests:
```bash
npm test src/pages/CalculateurMulti
```

## Personnalisation

Le composant utilise Tailwind CSS pour le style, mais peut être personnalisé via des classes CSS ou des props de style. Les couleurs s'adaptent automatiquement au thème de l'application.

## Documentation utilisateur

Pour la documentation utilisateur complète expliquant la méthodologie et l'interprétation des résultats, voir [docs/calculateurs/napkin-multi.md](../../../docs/calculateurs/napkin-multi.md).
