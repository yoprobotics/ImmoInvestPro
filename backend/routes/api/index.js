const express = require('express');
const router = express.Router();

/**
 * Fichier principal des routes API
 * Regroupe toutes les routes disponibles dans l'API
 */

// Routes des calculateurs
router.use('/calculators/multi', require('./calculators/multi'));
router.use('/calculators/flip', require('./calculators/flip'));

// Routes d'authentification
router.use('/auth', require('./auth'));

// Routes des utilisateurs
router.use('/users', require('./users'));

// Routes des analyses
router.use('/analyzers', require('./analyzers'));

// Routes des opportunités
router.use('/opportunities', require('./opportunities'));

// Routes des projets
router.use('/projects', require('./projects'));

// Routes des comparaisons
router.use('/comparisons', require('./comparisons'));

module.exports = router;