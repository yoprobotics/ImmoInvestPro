/**
 * Contrôleur pour les endpoints des calculateurs
 */

const napkinFlipCalculator = require('../calculators/flip/napkin_flip_calculator');
const napkinMultiCalculator = require('../calculators/multi/napkin_multi_calculator');
const liquidityCalculator = require('../calculators/financial/liquidity_calculator');

/**
 * @desc    Calcule le profit estimé d'un FLIP avec la méthode Napkin (FIP10)
 * @route   POST /api/calculators/napkin-flip
 * @access  Public
 */
exports.calculateNapkinFlip = (req, res) => {
  try {
    const { finalPrice, initialPrice, renovationCost } = req.body;
    
    if (!finalPrice || !initialPrice || renovationCost === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Veuillez fournir tous les paramètres requis: finalPrice, initialPrice, renovationCost'
      });
    }
    
    const result = napkinFlipCalculator.calculateFlipProfit(
      parseFloat(finalPrice),
      parseFloat(initialPrice),
      parseFloat(renovationCost)
    );
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * @desc    Calcule l'offre d'achat pour un profit cible d'un FLIP avec la méthode Napkin
 * @route   POST /api/calculators/napkin-flip/offer
 * @access  Public
 */
exports.calculateNapkinFlipOffer = (req, res) => {
  try {
    const { finalPrice, renovationCost, targetProfit } = req.body;
    
    if (!finalPrice || renovationCost === undefined || !targetProfit) {
      return res.status(400).json({
        success: false,
        error: 'Veuillez fournir tous les paramètres requis: finalPrice, renovationCost, targetProfit'
      });
    }
    
    const result = napkinFlipCalculator.calculateFlipOffer(
      parseFloat(finalPrice),
      parseFloat(renovationCost),
      parseFloat(targetProfit)
    );
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * @desc    Calcule la rentabilité d'un MULTI avec la méthode Napkin (PAR et HIGH-5)
 * @route   POST /api/calculators/napkin-multi
 * @access  Public
 */
exports.calculateNapkinMulti = (req, res) => {
  try {
    const { purchasePrice, units, grossRevenue } = req.body;
    
    if (!purchasePrice || !units || !grossRevenue) {
      return res.status(400).json({
        success: false,
        error: 'Veuillez fournir tous les paramètres requis: purchasePrice, units, grossRevenue'
      });
    }
    
    const result = napkinMultiCalculator.calculateMultiCashflow(
      parseFloat(purchasePrice),
      parseInt(units),
      parseFloat(grossRevenue)
    );
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * @desc    Calcule l'offre d'achat pour un cashflow cible d'un MULTI avec la méthode Napkin
 * @route   POST /api/calculators/napkin-multi/offer
 * @access  Public
 */
exports.calculateNapkinMultiOffer = (req, res) => {
  try {
    const { units, grossRevenue, targetCashflowPerUnit } = req.body;
    
    if (!units || !grossRevenue || !targetCashflowPerUnit) {
      return res.status(400).json({
        success: false,
        error: 'Veuillez fournir tous les paramètres requis: units, grossRevenue, targetCashflowPerUnit'
      });
    }
    
    const result = napkinMultiCalculator.calculateMultiOffer(
      parseInt(units),
      parseFloat(grossRevenue),
      parseFloat(targetCashflowPerUnit)
    );
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * @desc    Calcule la liquidité détaillée d'un immeuble
 * @route   POST /api/calculators/liquidity
 * @access  Public
 */
exports.calculateLiquidity = (req, res) => {
  try {
    const { units, revenues, expenses, financing } = req.body;
    
    if (!units || !revenues || !expenses || !financing) {
      return res.status(400).json({
        success: false,
        error: 'Veuillez fournir tous les paramètres requis: units, revenues, expenses, financing'
      });
    }
    
    const input = {
      units: parseInt(units),
      revenues,
      expenses,
      financing
    };
    
    const result = liquidityCalculator.calculateLiquidity(input);
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * @desc    Calcule le prix d'achat maximum pour un cashflow cible
 * @route   POST /api/calculators/liquidity/max-price
 * @access  Public
 */
exports.calculateMaxPurchasePrice = (req, res) => {
  try {
    const { units, revenues, expenses, mortgageTerms, targetCashflowPerUnit } = req.body;
    
    if (!units || !revenues || !expenses || !mortgageTerms) {
      return res.status(400).json({
        success: false,
        error: 'Veuillez fournir tous les paramètres requis: units, revenues, expenses, mortgageTerms'
      });
    }
    
    const params = {
      units: parseInt(units),
      revenues,
      expenses,
      mortgageTerms,
      targetCashflowPerUnit: targetCashflowPerUnit || liquidityCalculator.PROFITABILITY_THRESHOLDS.TARGET
    };
    
    const result = liquidityCalculator.calculateMaxPurchasePrice(params);
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * @desc    Effectue une analyse de sensibilité pour différents scénarios
 * @route   POST /api/calculators/liquidity/sensitivity
 * @access  Public
 */
exports.performSensitivityAnalysis = (req, res) => {
  try {
    const { baseInput, scenarios } = req.body;
    
    if (!baseInput) {
      return res.status(400).json({
        success: false,
        error: 'Veuillez fournir le paramètre baseInput'
      });
    }
    
    const result = liquidityCalculator.performSensitivityAnalysis(baseInput, scenarios);
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
