# ImmoInvestPro

ImmoInvestPro est une suite complète d'outils d'analyse et de calculateurs pour les investisseurs immobiliers, conçue pour faciliter la prise de décision et maximiser la rentabilité des investissements.

## Fonctionnalités

ImmoInvestPro propose plusieurs modules et calculateurs pour vous aider dans votre parcours d'investissement immobilier :

### Calculateurs financiers

- **[Calculateur ABD ATD](calculateurs/abd-atd/)** - Évaluez votre capacité d'emprunt avec les ratios d'Amortissement Brut de la Dette et d'Amortissement Total de la Dette
- **[Calculateur d'Estimation et Suivi des Rénovations](calculateurs/renovation/)** - Planifiez, estimez et suivez vos projets de rénovation immobilière avec précision
- Calculateur hypothécaire (à venir)
- Calculateur de rendement (à venir)
- Calculateur de cash-flow (à venir)
- Calculateur de flip (à venir)
- Calculateur de taxes de mutation (à venir)

### Outils d'analyse

- Analyseur de marché (à venir)
- Évaluateur de propriétés (à venir)
- Gestionnaire de portefeuille (à venir)

## Installation et démarrage

ImmoInvestPro est une application web qui ne nécessite pas d'installation particulière. Vous pouvez simplement cloner ce dépôt et ouvrir le fichier `index.html` dans votre navigateur pour commencer.

```bash
git clone https://github.com/yoprobotics/ImmoInvestPro.git
cd ImmoInvestPro
# Ouvrez index.html dans votre navigateur
```

Alternativement, vous pouvez accéder à l'application via GitHub Pages (lien à venir).

## Structure du projet

```
ImmoInvestPro/
├── index.html                 # Page d'accueil principale
├── calculateurs/              # Répertoire des calculateurs
│   ├── index.html             # Page d'accueil des calculateurs
│   ├── abd-atd/               # Calculateur ABD ATD
│   │   ├── index.html         # Interface du calculateur
│   │   ├── script.js          # Logique de calcul
│   │   ├── styles.css         # Styles CSS
│   │   └── README.md          # Documentation du calculateur
│   ├── renovation/             # Calculateur d'Estimation et Suivi des Rénovations
│   │   ├── index.html         # Interface du calculateur
│   │   ├── script.js          # Logique de calcul
│   │   ├── styles.css         # Styles CSS
│   │   └── README.md          # Documentation du calculateur
│   └── [autres calculateurs]  # Futurs calculateurs
└── [autres modules]           # Futurs modules
```

## Calculateur ABD ATD

Le [calculateur ABD ATD](calculateurs/abd-atd/) est un outil essentiel pour les investisseurs immobiliers qui souhaitent évaluer leur capacité d'emprunt. Il calcule deux ratios importants utilisés par les institutions financières :

- **ABD (Amortissement Brut de la Dette)** - Pourcentage du revenu mensuel brut consacré aux dépenses d'habitation (paiement hypothécaire, taxes, chauffage, etc.)
- **ATD (Amortissement Total de la Dette)** - Pourcentage du revenu mensuel brut consacré à l'ensemble des dettes (habitation + autres dettes)

Les seuils généralement acceptés sont de 32% pour l'ABD et 40% pour l'ATD pour un prêt conventionnel.

### Fonctionnalités du calculateur ABD ATD

- Calcul précis des ratios ABD et ATD
- Évaluation automatique de la qualification de l'emprunteur
- Visualisation graphique des ratios
- Conseils personnalisés pour améliorer les ratios
- Interface réactive et intuitive

## Calculateur d'Estimation et Suivi des Rénovations

Le [calculateur d'Estimation et Suivi des Rénovations](calculateurs/renovation/) est un outil complet pour planifier, estimer et suivre vos projets de rénovation immobilière. Il vous permet de gérer précisément vos coûts de rénovation et d'optimiser votre retour sur investissement.

### Fonctionnalités du calculateur de rénovations

- Gestion de projet avec informations générales et suivi d'avancement
- Ajout et gestion des pièces à rénover avec leurs spécificités
- Suivi budgétaire avec comparaison des coûts estimés et réels
- Visualisations graphiques de la répartition des coûts par catégorie et par pièce
- Synthèse complète du projet avec tableaux de bord et indicateurs de performance
- Exportation des données en format CSV

## Contribution

Les contributions sont les bienvenues ! Si vous souhaitez améliorer ImmoInvestPro, n'hésitez pas à :

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committer vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Pousser vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## Prochaines étapes

- Implémentation des autres calculateurs
- Développement d'une version responsive mobile
- Intégration d'une base de données pour enregistrer les calculs
- Déploiement sur GitHub Pages
- Ajout de fonctionnalités de partage et d'exportation des résultats

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## Contact

Pour toute question ou suggestion, veuillez contacter :
- Email : [contact@immoinvestpro.com](mailto:contact@immoinvestpro.com)
- GitHub : [yoprobotics](https://github.com/yoprobotics)
