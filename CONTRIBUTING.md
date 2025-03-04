# Guide de contribution à ImmoInvestPro

Merci de considérer une contribution au projet ImmoInvestPro! Ce guide vous aidera à comprendre le processus de contribution et à respecter les standards du projet.

## Table des matières

1. [Code de conduite](#code-de-conduite)
2. [Processus de développement](#processus-de-développement)
3. [Structure du projet](#structure-du-projet)
4. [Standards de codage](#standards-de-codage)
5. [Tests](#tests)
6. [Documentation](#documentation)
7. [Soumettre des changements](#soumettre-des-changements)

## Code de conduite

Ce projet et tous ses participants sont gouvernés par notre code de conduite. En participant, vous êtes censé respecter ce code. Veuillez signaler tout comportement inacceptable à [contact@immoinvestpro.com](mailto:contact@immoinvestpro.com).

## Processus de développement

Nous utilisons le flux de travail GitHub standard:

1. Forkez le dépôt
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/ma-nouvelle-fonctionnalite`)
3. Committez vos changements (`git commit -am 'Ajout de la fonctionnalité X'`)
4. Poussez vers la branche (`git push origin feature/ma-nouvelle-fonctionnalite`)
5. Créez une Pull Request

## Structure du projet

```
immobilier-quebec/
├── frontend/              # Interface utilisateur React
├── backend/               # Logique métier et API
│   ├── analyzers/         # Extraction de données des fiches descriptives
│   ├── calculators/       # Calculateurs financiers
│   ├── scoring/           # Système d'évaluation des opportunités
│   └── simulators/        # Moteur de simulation de scénarios
├── data/                  # Données statiques et templates
├── docs/                  # Documentation
└── tests/                 # Tests automatisés
```

## Standards de codage

### JavaScript / Node.js

- Suivez la norme [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Utilisez ESLint avec la configuration fournie
- Utilisez les fonctionnalités ES6+ où approprié
- Documentez toutes les fonctions avec JSDoc

### Nommage

- Utilisez `camelCase` pour les variables et fonctions
- Utilisez `PascalCase` pour les classes
- Utilisez `UPPER_CASE` pour les constantes
- Préfixez les interfaces avec `I` (ex: `IPropertyAnalysis`)

### Modèles métiers

Tous les calculateurs doivent:
- Suivre fidèlement les formules et méthodes définies dans la documentation de formation
- Inclure des contrôles de validation des entrées
- Retourner des résultats détaillés incluant les étapes intermédiaires du calcul
- Être accompagnés de tests qui vérifient la conformité avec les exemples de la formation

## Tests

Tous les composants doivent être accompagnés de tests:

- **Tests unitaires**: Pour chaque fonction/classe
- **Tests d'intégration**: Pour les flux complets
- **Tests de comparaison**: Pour vérifier que les résultats correspondent aux calculateurs Excel originaux

Exécutez les tests avec la commande:

```bash
npm test
```

## Documentation

La documentation doit être maintenue à jour avec le code:

- Commentaires JSDoc pour tous les modules, classes et fonctions
- Documentation utilisateur dans le dossier `docs/user/`
- Documentation technique dans le dossier `docs/technical/`
- Exemples d'utilisation pour chaque calculateur

## Soumettre des changements

1. Assurez-vous que votre code respecte les standards
2. Exécutez et passez tous les tests
3. Mettez à jour la documentation si nécessaire
4. Soumettez une pull request avec une description claire:
   - Le problème résolu
   - Les changements effectués
   - Toute information pertinente pour les testeurs

## Précision des calculs immobiliers

Une attention particulière doit être portée à la précision des calculs financiers:

1. Utilisez les méthodes `toFixed()` uniquement pour l'affichage, jamais pour les calculs intermédiaires
2. Validez les résultats avec les calculateurs Excel de référence
3. Documentez toute décision concernant l'arrondi ou la précision
4. Respectez les conventions québécoises pour les formats monétaires (ex: séparateur de milliers)

## Questions?

Si vous avez des questions ou besoin d'aide, n'hésitez pas à:
- Ouvrir une issue pour discussion
- Contacter l'équipe à [dev@immoinvestpro.com](mailto:dev@immoinvestpro.com)

Merci pour votre contribution!
