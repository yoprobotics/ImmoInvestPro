# Analyseurs de fiches descriptives immobilières

Ce module est responsable de l'extraction automatique des données à partir des fiches descriptives immobilières du Québec. Il supporte actuellement les formats standards utilisés par les courtiers immobiliers québécois.

## Fonctionnalités

- Analyse de fiches descriptives à partir d'URL ou de fichiers PDF téléchargés
- Extraction de données structurées pour analyse immédiate
- Support des fiches de type résidentiel et immeubles à revenus
- Détection automatique du type de propriété (FLIP vs MULTI)
- Compatibilité avec les fiches Centris et DuProprio

## Architecture

Le module est organisé en plusieurs composants:

### 1. Analyseurs de formats spécifiques

- `centris_analyzer.js` - Extraction depuis les fiches Centris
- `duproprio_analyzer.js` - Extraction depuis les fiches DuProprio
- `generic_analyzer.js` - Extraction depuis formats non standards

### 2. Processeurs de données spécialisés

- `finance_extractor.js` - Extraction des données financières (prix, revenus, etc.)
- `property_extractor.js` - Extraction des caractéristiques physiques de la propriété
- `location_extractor.js` - Extraction et enrichissement des données de localisation

### 3. Adaptateurs pour calculateurs

- `flip_adapter.js` - Préparation des données pour calculateurs FLIP
- `multi_adapter.js` - Préparation des données pour calculateurs MULTI

## Données extraites

### Pour tous les types de propriétés

- Prix d'achat demandé
- Adresse complète
- Dimensions et superficie
- Année de construction
- Taxes municipales et scolaires

### Spécifiques MULTI

- Revenus bruts annuels
- Dépenses d'exploitation
- Composition des logements (nombre, taille)
- Taux d'occupation actuel
- Date d'échéance des baux

### Spécifiques FLIP

- Potentiel de rénovation
- État actuel
- Travaux récents effectués
- Comparables dans le secteur (si disponibles)

## Intégration

### Entrées

Le module d'analyse accepte:
- URLs directes vers des fiches en ligne
- Fichiers PDF téléchargés
- Données brutes (texte ou JSON) extraites manuellement

### Sorties

Les données extraites sont structurées en format JSON standard qui peut être directement utilisé par:
- Calculateurs Napkin
- Calculateurs financiers complets
- Système de scoring
- Module de simulation de scénarios

## Limites et précision

- L'extraction automatique peut parfois manquer certaines données ou les interpréter incorrectement
- Les utilisateurs sont encouragés à vérifier les données extraites avant analyse finale
- Certains champs peuvent nécessiter une saisie manuelle complémentaire

## Évolutions prévues

- Support pour d'autres formats de fiches descriptives
- Amélioration de la précision d'extraction par apprentissage machine
- Enrichissement automatique des données avec sources externes (évaluations municipales, données de quartier, etc.)
