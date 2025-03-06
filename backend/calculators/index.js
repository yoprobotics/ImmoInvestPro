/**
 * Point d'entrée pour tous les calculateurs disponibles dans l'application
 * Ce fichier exporte tous les calculateurs pour les rendre accessibles via une interface unifiée
 */

// Calculateurs financiers
const liquidityCalculator = require('./financial/liquidity_calculator');
const napkinFlipCalculator = require('./financial/napkin_flip_calculator');
const napkinMultiCalculator = require('./financial/napkin_multi_calculator');

// Exporter tous les calculateurs
module.exports = {
  financial: {
    // Calculateurs détaillés
    liquidityCalculator,
    
    // Calculateurs Napkin
    napkinFlipCalculator,
    napkinMultiCalculator
  }
};
