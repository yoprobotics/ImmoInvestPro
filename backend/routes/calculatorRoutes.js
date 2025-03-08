/**
 * Routes pour les calculateurs
 */
const express = require('express');
const router = express.Router();
const calculatorController = require('../controllers/calculatorController');

/**
 * @route   POST /api/calculators/napkin/flip
 * @desc    Calculer le profit approximatif d'un FLIP avec la méthode Napkin
 * @access  Public
 */
router.post('/napkin/flip', calculatorController.calculateNapkinFlip);

/**
 * @route   POST /api/calculators/napkin/multi
 * @desc    Calculer la rentabilité approximative d'un MULTI avec la méthode Napkin
 * @access  Public
 */
router.post('/napkin/multi', calculatorController.calculateNapkinMulti);

/**
 * @route   POST /api/calculators/transferTax
 * @desc    Calculer les taxes de mutation (taxe de bienvenue) pour une propriété
 * @access  Public
 */
router.post('/transferTax', calculatorController.calculateTransferTax);

module.exports = router;
