/**
 * Contrôleur pour les calculateurs
 * Gère les routes API pour tous les calculateurs
 */

const { transferTaxCalculator } = require('../calculators/financial');
const napkinFlipCalculator = require('../calculators/napkin_flip_calculator');
const napkinMultiCalculator = require('../calculators/napkin_multi_calculator');

/**
 * @route   POST /api/calculators/napkin/flip
 * @desc    Calculer le profit approximatif d'un FLIP avec la méthode Napkin
 * @access  Public
 */
exports.calculateNapkinFlip = (req, res) => {
  try {
    const result = napkinFlipCalculator.calculateFlipProfit(req.body);
    res.json(result);
  } catch (error) {
    console.error('Erreur dans le calcul Napkin FLIP:', error);
    res.status(400).json({ error: error.message || 'Erreur de calcul' });
  }
};

/**
 * @route   POST /api/calculators/napkin/multi
 * @desc    Calculer la rentabilité approximative d'un MULTI avec la méthode Napkin
 * @access  Public
 */
exports.calculateNapkinMulti = (req, res) => {
  try {
    const result = napkinMultiCalculator.calculateMultiProfit(req.body);
    res.json(result);
  } catch (error) {
    console.error('Erreur dans le calcul Napkin MULTI:', error);
    res.status(400).json({ error: error.message || 'Erreur de calcul' });
  }
};

/**
 * @route   POST /api/calculators/transferTax
 * @desc    Calculer les taxes de mutation (taxe de bienvenue) pour une propriété
 * @access  Public
 */
exports.calculateTransferTax = (req, res) => {
  try {
    const { 
      propertyValue, 
      municipality,
      isFirstTimeHomeBuyer,
      isFirstHomeInQuebec,
      customRatePercentage
    } = req.body;
    
    // Vérifier la présence des paramètres obligatoires
    if (!propertyValue || propertyValue <= 0) {
      return res.status(400).json({ 
        error: 'La valeur de la propriété est requise et doit être supérieure à 0' 
      });
    }
    
    // Calculer les taxes de mutation
    const result = transferTaxCalculator.calculateTransferTax({
      propertyValue,
      municipality,
      isFirstTimeHomeBuyer,
      isFirstHomeInQuebec,
      customRatePercentage
    });
    
    res.json(result);
  } catch (error) {
    console.error('Erreur dans le calcul des taxes de mutation:', error);
    res.status(400).json({ error: error.message || 'Erreur de calcul' });
  }
};
