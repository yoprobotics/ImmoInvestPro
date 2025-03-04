/**
 * Server principal de l'application ImmoInvestPro
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Configuration des variables d'environnement
dotenv.config();

// Import des routes
const comparisonRoutes = require('./routes/comparisonRoutes');

// Initialisation de l'application Express
const app = express();

// Configuration des middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Configuration des routes
app.use('/api/comparison', comparisonRoutes);

// Route de base pour vérifier que l'API fonctionne
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Bienvenue sur l\'API ImmoInvestPro',
    version: '1.0.0'
  });
});

// Middleware pour gérer les routes non trouvées
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

// Middleware pour gérer les erreurs
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);
  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Configuration du port
const PORT = process.env.PORT || 5000;

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT} en mode ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
