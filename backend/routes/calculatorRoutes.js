/**
 * Routes pour les calculateurs
 */

const express = require('express');
const router = express.Router();
const calculatorController = require('../controllers/calculatorController');

/**
 * @desc    Calculateurs Napkin FLIP
 */
router.post('/napkin-flip', calculatorController.calculateNapkinFlip);
router.post('/napkin-flip/offer', calculatorController.calculateNapkinFlipOffer);

/**
 * @desc    Calculateurs Napkin MULTI
 */
router.post('/napkin-multi', calculatorController.calculateNapkinMulti);
router.post('/napkin-multi/offer', calculatorController.calculateNapkinMultiOffer);

/**
 * @desc    Calculateur de liquidité
 */
router.post('/liquidity', calculatorController.calculateLiquidity);
router.post('/liquidity/max-price', calculatorController.calculateMaxPurchasePrice);
router.post('/liquidity/sensitivity', calculatorController.performSensitivityAnalysis);

module.exports = router;
