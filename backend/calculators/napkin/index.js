/**
 * Point d'entrée pour les calculateurs Napkin
 * Exporte les fonctions des calculateurs FIP10 (FLIP) et PAR (MULTI)
 */

const flipCalculator = require('./flip_calculator');
const multiCalculator = require('./multi_calculator');

module.exports = {
  /**
   * Calculateur Napkin FLIP (méthode FIP10)
   */
  flip: {
    CARRY_COSTS_PERCENTAGE: flipCalculator.CARRY_COSTS_PERCENTAGE,
    PROFITABILITY_THRESHOLDS: flipCalculator.PROFITABILITY_THRESHOLDS,
    calculate: flipCalculator.calculateFlipNapkin,
    calculateMaxOffer: flipCalculator.calculateMaxOfferPrice
  },
  
  /**
   * Calculateur Napkin MULTI (méthode PAR + HIGH-5)
   */
  multi: {
    EXPENSE_PERCENTAGES: multiCalculator.EXPENSE_PERCENTAGES,
    HIGH_5_FACTOR: multiCalculator.HIGH_5_FACTOR,
    PROFITABILITY_THRESHOLDS: multiCalculator.PROFITABILITY_THRESHOLDS,
    calculate: multiCalculator.calculateMultiNapkin,
    calculateMaxPrice: multiCalculator.calculateMaxPurchasePrice
  }
};
