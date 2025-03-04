# Calculateurs Napkin

Cette section contient les implémentations des calculateurs rapides d'évaluation d'opportunités immobilières, basés sur les méthodes Napkin FLIP (FIP10) et MULTI (PAR).

## Objectif

Les calculateurs Napkin sont conçus pour fournir une évaluation préliminaire rapide d'une opportunité immobilière, permettant de déterminer en quelques minutes si une propriété mérite une analyse plus approfondie.

## Types de calculateurs

### 1. Calculateur Napkin FLIP (FIP10)

Permet d'évaluer rapidement le potentiel de profit d'un projet de rénovation-revente (FLIP) en utilisant la formule FIP10:

```
Profit = Prix Final - Prix Initial - Prix des Rénos - 10% de la valeur de revente
```

**Fichiers associés:**
- `flip_napkin.js` - Algorithme de calcul
- `flip_napkin_validator.js` - Validation des entrées
- `flip_napkin_ui.js` - Interface utilisateur

### 2. Calculateur Napkin MULTI (PAR)

Permet d'évaluer rapidement le cashflow mensuel potentiel par porte d'un immeuble à revenus en utilisant la méthode PAR:

```
1. Calculer les dépenses selon % des revenus bruts (varie selon nombre d'unités)
2. Calculer le paiement hypothécaire avec méthode HIGH-5 (Prix d'achat × 0.005 × 12)
3. Déterminer le cashflow par porte
```

**Fichiers associés:**
- `multi_napkin.js` - Algorithme de calcul
- `multi_napkin_validator.js` - Validation des entrées
- `multi_napkin_ui.js` - Interface utilisateur

## Intégration avec les extracteurs de données

Les calculateurs Napkin sont conçus pour fonctionner avec les extracteurs automatiques de fiches descriptives, permettant une évaluation instantanée dès qu'une fiche est téléchargée ou qu'une URL est fournie.

## Utilisation en mode standalone

Ces calculateurs peuvent également être utilisés de manière autonome, l'utilisateur saisissant manuellement les valeurs clés:

### FLIP:
- Prix d'achat envisagé
- Valeur de revente estimée
- Budget de rénovation prévu

### MULTI:
- Prix d'achat
- Nombre d'unités (portes)
- Revenus bruts annuels

## Limites

Ces calculateurs fournissent des estimations simplifiées et ne remplacent pas une analyse financière complète. Ils sont destinés à un filtrage initial des opportunités et doivent être suivis d'une analyse plus détaillée pour les projets qui semblent prometteurs.
