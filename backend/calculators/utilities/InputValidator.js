/**
 * InputValidator.js
 * Module de validation des données d'entrée pour les calculateurs immobiliers
 */

class InputValidator {
  /**
   * Valide les données d'entrée pour un calculateur de type FLIP
   * @param {Object} input Les données à valider
   * @returns {Object} Résultat de la validation avec erreurs et avertissements
   */
  static validateFlipInput(input) {
    const errors = [];
    const warnings = [];
    
    // Valider les champs obligatoires
    if (!input) {
      errors.push("Aucune donnée d'entrée fournie");
      return this._createResult(errors, warnings);
    }
    
    if (!input.purchasePrice) {
      errors.push("Le prix d'achat est requis");
    } else if (input.purchasePrice <= 0) {
      errors.push("Le prix d'achat doit être supérieur à 0");
    }
    
    if (!input.salePrice) {
      errors.push("Le prix de vente est requis");
    } else if (input.salePrice <= 0) {
      errors.push("Le prix de vente doit être supérieur à 0");
    }
    
    // Valider les valeurs numériques
    if (input.renovationCost && input.renovationCost < 0) {
      errors.push("Le coût des rénovations ne peut pas être négatif");
    }
    
    if (input.holdingCosts && input.holdingCosts < 0) {
      errors.push("Les coûts de possession ne peuvent pas être négatifs");
    }
    
    // Générer des avertissements
    if (input.purchasePrice && input.salePrice && input.salePrice <= input.purchasePrice) {
      warnings.push("Le prix de vente est inférieur ou égal au prix d'achat, ce qui pourrait résulter en une perte");
    }
    
    if (input.purchasePrice && input.renovationCost && input.salePrice && 
        input.salePrice < (input.purchasePrice + input.renovationCost)) {
      warnings.push("Le prix de vente est inférieur à la somme du prix d'achat et du coût des rénovations");
    }
    
    if (input.renovationCost && input.purchasePrice && (input.renovationCost > input.purchasePrice * 0.5)) {
      warnings.push("Le coût des rénovations représente plus de 50% du prix d'achat, ce qui est inhabituellement élevé");
    }
    
    return this._createResult(errors, warnings);
  }
  
  /**
   * Valide les données d'entrée pour un calculateur de type MULTI
   * @param {Object} input Les données à valider
   * @returns {Object} Résultat de la validation avec erreurs et avertissements
   */
  static validateMultiInput(input) {
    const errors = [];
    const warnings = [];
    
    // Valider les champs obligatoires
    if (!input) {
      errors.push("Aucune donnée d'entrée fournie");
      return this._createResult(errors, warnings);
    }
    
    if (!input.purchasePrice) {
      errors.push("Le prix d'achat est requis");
    } else if (input.purchasePrice <= 0) {
      errors.push("Le prix d'achat doit être supérieur à 0");
    }
    
    if (!input.grossAnnualRent) {
      errors.push("Les revenus bruts annuels sont requis");
    } else if (input.grossAnnualRent <= 0) {
      errors.push("Les revenus bruts annuels doivent être supérieurs à 0");
    }
    
    if (!input.units) {
      errors.push("Le nombre d'unités est requis");
    } else if (input.units <= 0 || !Number.isInteger(input.units)) {
      errors.push("Le nombre d'unités doit être un entier positif");
    }
    
    // Valider les valeurs numériques
    if (input.renovationCost && input.renovationCost < 0) {
      errors.push("Le coût des rénovations ne peut pas être négatif");
    }
    
    // Valider le ratio revenus/prix
    if (input.purchasePrice && input.grossAnnualRent) {
      const multiplier = input.purchasePrice / input.grossAnnualRent;
      if (multiplier > 12) {
        warnings.push(`Le multiplicateur des revenus bruts est élevé (${multiplier.toFixed(2)}x). Le seuil recommandé est de 10x.`);
      }
    }
    
    // Valider le financement si fourni
    if (input.financing) {
      if (input.financing.loanToValue && (input.financing.loanToValue < 0 || input.financing.loanToValue > 1)) {
        errors.push("Le ratio prêt/valeur doit être entre 0 et 1");
      }
      
      if (input.financing.interestRate && (input.financing.interestRate < 0 || input.financing.interestRate > 20)) {
        warnings.push("Le taux d'intérêt semble anormal (doit généralement être entre 0 et 20%)");
      }
      
      if (input.financing.amortizationYears && (input.financing.amortizationYears < 1 || input.financing.amortizationYears > 40)) {
        warnings.push("La période d'amortissement semble anormale (généralement entre 15 et 30 ans)");
      }
    }
    
    return this._createResult(errors, warnings);
  }
  
  /**
   * Crée un objet résultat standardisé pour la validation
   * @param {Array} errors Tableau des erreurs
   * @param {Array} warnings Tableau des avertissements
   * @returns {Object} Résultat de la validation
   */
  static _createResult(errors, warnings) {
    return {
      isValid: errors.length === 0,
      hasWarnings: warnings.length > 0,
      errors: errors,
      warnings: warnings
    };
  }
}

module.exports = InputValidator;