# Module d'Authentification et Gestion des Utilisateurs

Ce module gère toutes les fonctionnalités liées à l'authentification des utilisateurs, la création de compte, et la gestion des profils dans ImmoInvestPro.

## Fonctionnalités

- Inscription et création de compte
- Authentification (connexion/déconnexion)
- Gestion de profil utilisateur
- Récupération de mot de passe
- Vérification d'email
- Autorisations basées sur le niveau d'abonnement

## Architecture

Le module est organisé en plusieurs composants:

### Authentification

- `register.js` - Gestion des inscriptions
- `login.js` - Authentification des utilisateurs
- `password_reset.js` - Processus de récupération de mot de passe
- `token_manager.js` - Gestion des jetons JWT pour les sessions
- `social_auth.js` - Intégration avec des fournisseurs d'identité tiers (Google, Facebook) - *Optionnel pour les phases futures*

### Profils Utilisateurs

- `profile_manager.js` - Gestion des données de profil
- `preferences.js` - Gestion des préférences utilisateur (FLIP/MULTI, régions d'intérêt)
- `user_types.js` - Définition des types d'utilisateurs (débutant, intermédiaire, avancé)

## Niveaux d'Accès

Ce module définit également la structure des autorisations basée sur le plan d'abonnement:

### Utilisateur Gratuit
- Accès limité aux calculateurs Napkin (5 analyses/mois)
- Accès à un maximum de 2 projets actifs
- Détection d'opportunités basique
- Pas d'exportation de rapports

### Utilisateur Premium
- Accès illimité à tous les calculateurs
- Projets illimités
- Détection d'opportunités avancée
- Exportation de rapports professionnels
- Suivi détaillé des étapes d'acquisition
- Simulateur de scénarios

## Intégration

Le module d'authentification s'intègre avec:
- Le service de stockage de base de données pour les informations utilisateur
- Le système d'autorisation qui contrôle l'accès aux fonctionnalités premium
- Le module de gestion des abonnements pour la vérification des droits d'accès

## Sécurité

Toutes les données d'utilisateur sont cryptées selon les standards de l'industrie:
- Mots de passe hachés avec bcrypt
- Communications sécurisées via HTTPS
- Jetons JWT avec expiration
- Protection contre les attaques courantes (CSRF, XSS, injection SQL)

## Note sur la conformité

Le système est conçu pour respecter:
- La Loi sur la protection des renseignements personnels du Québec
- Les standards de sécurité des données de l'industrie
