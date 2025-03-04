# Gestion des Utilisateurs

Ce dossier contient les modules responsables de la gestion des profils utilisateurs, des préférences et des niveaux d'abonnement dans ImmoInvestPro.

## Structure

- `profile.js` - Gestion des profils utilisateurs
- `preferences.js` - Gestion des préférences utilisateur (FLIP/MULTI)
- `subscription_tiers.js` - Définition des niveaux d'accès

## Fonctionnalités principales

- Mise à jour des informations de profil
- Sauvegarde des préférences d'investissement (FLIP ou MULTI)
- Définition des limites et droits d'accès par niveau d'abonnement
- Gestion des paramètres de notification

## Intégration

Ces modules sont utilisés par le système d'authentification et l'interface utilisateur pour gérer les informations spécifiques à chaque utilisateur et déterminer les fonctionnalités auxquelles ils ont accès en fonction de leur niveau d'abonnement.
