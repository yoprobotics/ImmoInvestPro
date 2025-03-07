/**
 * Contrôleur pour les calculateurs immobiliers
 */

const LiquidityCalculator = require('../services/calculators/LiquidityCalculator');
const NapkinCalculator = require('../services/calculators/NapkinCalculator');

/**
 * @desc    Calcule les résultats du Calculateur Napkin FLIP
 * @route   POST /api/calculators/napkin-flip
 * @access  Public
 */
exports.calculateNapkinFlip = (req, res) => {
  try {
    const { finalPrice, initialPrice, renovationCost } = req.body;
    
    // Validation des entrées
    if (!finalPrice || !initialPrice || !renovationCost) {
      return res.status(400).json({ 
        success: false, 
        message: 'Veuillez fournir tous les paramètres requis: finalPrice, initialPrice, renovationCost' 
      });
    }
    
    const result = NapkinCalculator.calculateFlipProfit(
      Number(finalPrice), 
      Number(initialPrice), 
      Number(renovationCost)
    );
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors du calcul Napkin FLIP',
      error: error.message
    });
  }
};

/**
 * @desc    Calcule le prix d'offre pour un FLIP selon le profit visé
 * @route   POST /api/calculators/napkin-flip/offer
 * @access  Public
 */
exports.calculateNapkinFlipOffer = (req, res) => {
  try {
    const { finalPrice, renovationCost, targetProfit } = req.body;
    
    // Validation des entrées
    if (!finalPrice || !renovationCost || !targetProfit) {
      return res.status(400).json({ 
        success: false, 
        message: 'Veuillez fournir tous les paramètres requis: finalPrice, renovationCost, targetProfit' 
      });
    }
    
    const result = NapkinCalculator.calculateFlipOfferPrice(
      Number(finalPrice), 
      Number(renovationCost), 
      Number(targetProfit)
    );
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors du calcul du prix d\'offre Napkin FLIP',
      error: error.message
    });
  }
};

/**
 * @desc    Calcule les résultats du Calculateur Napkin MULTI
 * @route   POST /api/calculators/napkin-multi
 * @access  Public
 */
exports.calculateNapkinMulti = (req, res) => {
  try {
    const { purchasePrice, apartmentCount, grossRevenue } = req.body;
    
    // Validation des entrées
    if (!purchasePrice || !apartmentCount || !grossRevenue) {
      return res.status(400).json({ 
        success: false, 
        message: 'Veuillez fournir tous les paramètres requis: purchasePrice, apartmentCount, grossRevenue' 
      });
    }
    
    const result = NapkinCalculator.calculateMultiCashflow(
      Number(purchasePrice), 
      Number(apartmentCount), 
      Number(grossRevenue)
    );
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors du calcul Napkin MULTI',
      error: error.message
    });
  }
};

/**
 * @desc    Calcule le prix d'offre pour un MULTI selon le cashflow visé
 * @route   POST /api/calculators/napkin-multi/offer
 * @access  Public
 */
exports.calculateNapkinMultiOffer = (req, res) => {
  try {
    const { apartmentCount, grossRevenue, targetCashflowPerDoor } = req.body;
    
    // Validation des entrées
    if (!apartmentCount || !grossRevenue || !targetCashflowPerDoor) {
      return res.status(400).json({ 
        success: false, 
        message: 'Veuillez fournir tous les paramètres requis: apartmentCount, grossRevenue, targetCashflowPerDoor' 
      });
    }
    
    const result = NapkinCalculator.calculateMultiOfferPrice(
      Number(apartmentCount), 
      Number(grossRevenue), 
      Number(targetCashflowPerDoor)
    );
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors du calcul du prix d\'offre Napkin MULTI',
      error: error.message
    });
  }
};

/**
 * @desc    Calcule les résultats du Calculateur de Liquidité
 * @route   POST /api/calculators/liquidity
 * @access  Public
 */
exports.calculateLiquidity = (req, res) => {
  try {
    const { 
      purchasePrice, 
      downPayment, 
      grossRevenue, 
      expenses, 
      interestRate, 
      amortizationYears,
      otherFinancing = [] 
    } = req.body;
    
    // Validation des entrées essentielles
    if (!purchasePrice || !downPayment || !grossRevenue || !expenses || !interestRate || !amortizationYears) {
      return res.status(400).json({ 
        success: false, 
        message: 'Veuillez fournir tous les paramètres requis: purchasePrice, downPayment, grossRevenue, expenses, interestRate, amortizationYears' 
      });
    }
    
    const calculator = new LiquidityCalculator({
      purchasePrice: Number(purchasePrice),
      downPayment: Number(downPayment),
      grossRevenue: Number(grossRevenue),
      expenses: Number(expenses),
      interestRate: Number(interestRate),
      amortizationYears: Number(amortizationYears),
      otherFinancing: otherFinancing
    });
    
    const result = calculator.calculateLiquidity();
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors du calcul de liquidité',
      error: error.message
    });
  }
};

/**
 * @desc    Calcule le prix d'achat maximum en fonction du cashflow cible
 * @route   POST /api/calculators/liquidity/max-price
 * @access  Public
 */
exports.calculateMaxPurchasePrice = (req, res) => {
  try {
    const { 
      targetCashflow, 
      downPaymentPercentage, 
      grossRevenue, 
      expenses, 
      interestRate, 
      amortizationYears,
      otherFinancing = [] 
    } = req.body;
    
    // Validation des entrées essentielles
    if (!targetCashflow || !downPaymentPercentage || !grossRevenue || !expenses || !interestRate || !amortizationYears) {
      return res.status(400).json({ 
        success: false, 
        message: 'Veuillez fournir tous les paramètres requis: targetCashflow, downPaymentPercentage, grossRevenue, expenses, interestRate, amortizationYears' 
      });
    }
    
    const calculator = new LiquidityCalculator({
      downPaymentPercentage: Number(downPaymentPercentage),
      grossRevenue: Number(grossRevenue),
      expenses: Number(expenses),
      interestRate: Number(interestRate),
      amortizationYears: Number(amortizationYears),
      otherFinancing: otherFinancing
    });
    
    const maxPrice = calculator.calculateMaxPurchasePrice(Number(targetCashflow));
    
    res.status(200).json({
      success: true,
      data: {
        maxPurchasePrice: maxPrice,
        downPayment: maxPrice * (Number(downPaymentPercentage) / 100),
        mortgage: maxPrice * (1 - Number(downPaymentPercentage) / 100)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors du calcul du prix d\'achat maximum',
      error: error.message
    });
  }
};

/**
 * @desc    Effectue une analyse de sensibilité du cashflow
 * @route   POST /api/calculators/liquidity/sensitivity
 * @access  Public
 */
exports.performSensitivityAnalysis = (req, res) => {
  try {
    const { 
      purchasePrice, 
      downPayment, 
      grossRevenue, 
      expenses, 
      interestRate, 
      amortizationYears,
      otherFinancing = [],
      parameters = ['interestRate', 'grossRevenue', 'expenses'],
      variationPercentage = 10,
      steps = 5
    } = req.body;
    
    // Validation des entrées essentielles
    if (!purchasePrice || !downPayment || !grossRevenue || !expenses || !interestRate || !amortizationYears) {
      return res.status(400).json({ 
        success: false, 
        message: 'Veuillez fournir tous les paramètres requis: purchasePrice, downPayment, grossRevenue, expenses, interestRate, amortizationYears' 
      });
    }
    
    const calculator = new LiquidityCalculator({
      purchasePrice: Number(purchasePrice),
      downPayment: Number(downPayment),
      grossRevenue: Number(grossRevenue),
      expenses: Number(expenses),
      interestRate: Number(interestRate),
      amortizationYears: Number(amortizationYears),
      otherFinancing: otherFinancing
    });
    
    const result = calculator.performSensitivityAnalysis(parameters, Number(variationPercentage), Number(steps));
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'analyse de sensibilité',
      error: error.message
    });
  }
};
