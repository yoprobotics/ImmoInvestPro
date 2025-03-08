# ImmoInvestPro

## Plateforme d'analyse et de suivi d'investissements immobiliers au Québec

ImmoInvestPro est une application complète d'analyse et de suivi d'investissements immobiliers spécifiquement adaptée au marché québécois. Elle permet aux investisseurs de tous niveaux d'analyser rapidement les opportunités, de détecter des optimisations potentielles et de suivre leurs projets.

## Caractéristiques principales

### Analyse rapide avec calculateurs Napkin
- **FLIP (FIP10)**: Analysez rapidement la rentabilité des projets d'achat-rénovation-revente
- **MULTI (PAR)**: Évaluez le potentiel des immeubles locatifs en quelques secondes ([Documentation complète](docs/calculateurs/napkin-multi.md))

### Planification stratégique
- **Un immeuble par AN**: Projetez l'évolution de votre portefeuille sur plusieurs années et planifiez votre chemin vers l'indépendance financière ([Documentation complète](docs/calculateurs/yearly-acquisition-calculator.md))
- **Estimation des rénovations**: Calculez rapidement et avec précision le coût des travaux de rénovation grâce à la méthode des 500$ ([Documentation complète](docs/calculateurs/renovation-calculator.md))

### Détection d'opportunités cachées
- Identification automatique d'optimisations potentielles
- Analyse des changements de vocation possibles
- Détection de potentiel de densification

### Tableau de bord personnalisé
- Vue d'ensemble de votre portefeuille
- Suivi des étapes de chaque projet
- Organisation par type de projet (FLIP/MULTI)

### Roadmaps détaillées
- Guides pas à pas pour les projets FLIP et MULTI
- Gestion des tâches par étape
- Centralisation des documents importants

## Documentation des calculateurs
- [Calculateur Napkin MULTI](docs/calculateurs/napkin-multi.md) - Évaluation rapide de la rentabilité d'un immeuble à revenus
- [Calculateur Un immeuble par AN](docs/calculateurs/yearly-acquisition-calculator.md) - Planification stratégique d'acquisition d'un immeuble par année
- [Calculateur d'estimation des rénovations](docs/calculateurs/renovation-calculator.md) - Évaluation des coûts de rénovation avec la méthode des 500$

## Modèle Freemium

### Version gratuite
- Calculateurs Napkin limités (5 analyses/mois)
- Analyse basique des fiches descriptives
- Dashboards limités (2 deals maximum)
- Score de rentabilité de base

### Version premium
- Calculateurs financiers complets et illimités
- Analyses avancées d'optimisation
- Dashboard illimité avec organisation par portefeuille
- Simulateur de scénarios
- Exportation de rapports professionnels
- Générateur de clauses légales personnalisées
- Alertes personnalisées pour les nouvelles opportunités

## Architecture technique

Le projet est structuré comme suit:

```
immoinvestpro/
├── backend/                  # API et logique métier
│   ├── auth/                 # Authentification et gestion des utilisateurs
│   ├── calculators/          # Calculateurs financiers
│   ├── opportunity_finder/   # Détection d'opportunités cachées
│   ├── recommendation_engine/# Moteur de recommandations
│   ├── project_tracker/      # Suivi des projets
│   └── user/                 # Gestion des utilisateurs et préférences
├── frontend/                 # Interface utilisateur
│   ├── auth/                 # Pages d'authentification
│   ├── dashboard/            # Tableau de bord
│   ├── deal_analyzer/        # Interface d'analyse
│   ├── project/              # Gestion de projets
│   └── subscription/         # Pages d'abonnement
├── shared/                   # Code partagé frontend/backend
└── config/                   # Configuration du projet
```

## Workflow utilisateur typique

1. **Phase initiale (gratuite)**:
   - L'utilisateur crée un compte
   - Il soumet l'URL d'une fiche descriptive Centris/DuProprio
   - Le système analyse rapidement le bien avec les calculateurs Napkin
   - L'application indique si l'opportunité vaut la peine d'être explorée davantage

2. **Phase d'exploration (partiellement gratuite)**:
   - Le système suggère des optimisations potentielles
   - L'utilisateur peut sauvegarder le projet dans son dashboard
   - Le système génère une roadmap personnalisée pour le projet

3. **Phase d'analyse approfondie (premium)**:
   - Accès aux calculateurs détaillés
   - Estimation précise des coûts de rénovation
   - Simulation de différents scénarios d'optimisation
   - Génération de rapports pour présentation à des partenaires ou financiers
   - Suivi détaillé des étapes d'acquisition

## Installation et développement

### Prérequis
- Node.js (v14+)
- MongoDB
- NPM ou Yarn

### Installation
1. Cloner le dépôt
```
git clone https://github.com/yoprobotics/ImmoInvestPro.git
cd ImmoInvestPro
```

2. Installer les dépendances
```
npm install
```

3. Configurer les variables d'environnement
```
cp .env.example .env
```
Éditez le fichier `.env` avec vos propres paramètres.

4. Lancer l'application en mode développement
```
npm run dev
```

## Licence
Ce projet est sous licence propriétaire. Tous droits réservés.
