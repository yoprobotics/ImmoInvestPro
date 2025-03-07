# Calculateurs d'investissement immobilier

Ce répertoire contient les différents calculateurs d'investissement immobilier de l'application ImmoInvestPro.

## Calculateur de rendement FLIP 3.0

Le calculateur FLIP permet d'évaluer la rentabilité d'un projet d'achat-rénovation-revente (FLIP) d'une propriété immobilière.

### Fonctionnalités

- Analyse rapide avec la méthode Napkin FIP10
- Calcul détaillé des coûts d'acquisition
- Budget de rénovation détaillé par pièce
- Estimation des frais de possession
- Calcul des frais de vente
- Analyse complète de rentabilité
- Détermination du prix d'offre optimal
- Évaluation de la viabilité du projet (profit minimum recommandé: 25 000$)

### Structure du calculateur

Le calculateur FLIP est composé de trois fichiers principaux:

1. **FlipCalculatorModel.js** - Modèle de données pour le calculateur FLIP
   - Structure complète des données d'un projet FLIP
   - Méthodes de calcul des totaux et résultats

2. **FlipCalculatorService.js** - Service pour effectuer les calculs
   - Formules et logiques de calcul selon la méthodologie "Les Secrets de l'Immobilier"
   - Méthodes d'évaluation rapide (Napkin FIP10)
   - Estimation des coûts selon des barèmes standards

3. **FlipCalculator.jsx** - Composant React pour l'interface utilisateur
   - Interface utilisateur complète avec onglets
   - Formulaires pour la saisie des données
   - Visualisation des résultats
   - Alertes et recommandations

### Comment utiliser le calculateur

1. **Onglet Propriété**
   - Entrez les informations de base de la propriété (adresse, prix d'achat, valeur de revente)
   - Renseignez les frais d'acquisition (ou utilisez le calcul automatique)
   - Configurez le financement (mise de fonds, taux d'intérêt)

2. **Onglet Rénovations**
   - Renseignez les coûts de rénovation par pièce et par catégorie
   - Ajoutez une contingence pour les imprévus (recommandé: 15%)

3. **Onglet Dépenses**
   - Entrez les frais de possession pendant les travaux
   - Configurez les frais de vente (commission, marketing, mise en valeur)

4. **Onglet Résultats**
   - Calculez les résultats complets
   - Analysez la viabilité du projet
   - Exportez ou sauvegardez les résultats

### Barèmes et recommandations

- **Profit minimum recommandé**: 25 000$ par projet
- **Contingence recommandée**: 15% du budget de rénovation
- **Commission immobilière standard**: 5% de la valeur de revente
- **Frais de notaire**: entre 1 000$ et 2 500$ selon le prix d'achat
- **Taxe de bienvenue**: calculée selon les barèmes du Québec

## Prochains développements

- Intégration avec la base de données pour sauvegarder les projets
- Exportation des résultats en PDF
- Calendrier interactif des travaux
- Intégration des comparables du marché
- Module de suivi des dépassements de coûts
