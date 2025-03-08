const express = require('express');
const router = express.Router();
const yearlyAcquisitionCalculator = require('../../calculators/financial/yearly_acquisition_calculator');

/**
 * @route POST /api/calculators/yearly-acquisition-strategy
 * @desc Calcule une stratégie d'acquisition d'un immeuble par an
 * @access Public
 */
router.post('/yearly-acquisition-strategy', (req, res) => {
  try {
    const inputData = req.body;
    const result = yearlyAcquisitionCalculator.calculateYearlyAcquisitionStrategy(inputData);
    res.json(result);
  } catch (error) {
    console.error('Error in yearly acquisition strategy calculation:', error);
    res.status(400).json({ error: error.message });
  }
});

/**
 * @route POST /api/calculators/required-units
 * @desc Calcule le nombre d'unités nécessaires pour atteindre un revenu cible
 * @access Public
 */
router.post('/required-units', (req, res) => {
  try {
    const params = req.body;
    const result = yearlyAcquisitionCalculator.calculateRequiredUnits(params);
    res.json(result);
  } catch (error) {
    console.error('Error in required units calculation:', error);
    res.status(400).json({ error: error.message });
  }
});

/**
 * @route POST /api/calculators/generate-acquisition-model
 * @desc Génère un modèle d'acquisition basé sur les paramètres spécifiés
 * @access Public
 */
router.post('/generate-acquisition-model', (req, res) => {
  try {
    const params = req.body;
    const result = yearlyAcquisitionCalculator.generateAcquisitionModel(params);
    res.json(result);
  } catch (error) {
    console.error('Error in acquisition model generation:', error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
