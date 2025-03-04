/**
 * Routes pour l'API de comparaison de scénarios
 */

const express = require('express');
const comparisonController = require('../controllers/comparisonController');
const router = express.Router();

/**
 * @route   POST /api/comparison/analyze
 * @desc    Analyse un scénario unique d'investissement
 * @access  Public
 */
router.post('/analyze', comparisonController.analyzeScenario);

/**
 * @route   POST /api/comparison/compare
 * @desc    Compare plusieurs scénarios d'investissement
 * @access  Public
 */
router.post('/compare', comparisonController.compareScenarios);

module.exports = router;
