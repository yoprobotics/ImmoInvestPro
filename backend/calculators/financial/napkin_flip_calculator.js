/**
 * Calculateur Napkin FLIP
 * 
 * Ce module implémente le calculateur Napkin FLIP selon la méthode FIP10 des Secrets de l'Immobilier.
 * Il permet d'évaluer rapidement la rentabilité d'un projet d'achat-revente (FLIP) immobilier.
 */

/**
 * Structure des entrées du calculateur Napkin FLIP
 * @typedef {Object} NapkinFlipInput
 * @property {number} finalPrice - Prix final (valeur de revente après travaux)
 * @property {number} initialPrice - Prix initial (prix d'achat)
 * @property {number} renovationCost - Prix des rénovations
 */

/**
 * Structure des résultats du calculateur Napkin FLIP
 * @typedef {Object} NapkinFlipResult
 * @property {number} profit - Profit estimé du projet
 * @property {number} roi - Rendement sur investissement (%)
 * @property {boolean} isViable - Indique si le projet est viable (profit minimum atteint)
 * @property {string} rating - Évaluation du projet (EXCELLENT, GOOD, ACCEPTABLE, POOR)
 * @property {string} recommendation - Recommandation basée sur l'analyse
 */

/**
 * Seuils de rentabilité pour un projet FLIP
 * @const {Object}
 */
const PROFITABILITY_THRESHOLDS_FLIP = {
  MINIMUM: 15000,  // Profit minimum acceptable pour un projet FLIP
  TARGET: 25000,   // Profit cible pour un bon projet FLIP
  EXCELLENT: 40000 // Profit excellent pour un projet FLIP
};

/**
 * Calcule rapidement la rentabilité d'un projet FLIP selon la méthode FIP10
 * @param {NapkinFlipInput} input - Données d'entrée pour le calcul
 * @returns {NapkinFlipResult} - Résultats de l'analyse
 */
function calculateNapkinFlip(input) {
  // Validation des entrées
  validateInput(input);
  
  // Extraction des valeurs
  const { finalPrice, initialPrice, renovationCost } = input;
  
  // Calcul selon la méthode FIP10
  const expenses = finalPrice * 0.1; // 10% de la valeur de revente pour couvrir les frais
  const profit = finalPrice - initialPrice - renovationCost - expenses;
  
  // Calcul du ROI (retour sur investissement)
  const investment = initialPrice + renovationCost;
  const roi = (profit / investment) * 100;
  
  // Déterminer si le projet est viable
  const isViable = profit >= PROFITABILITY_THRESHOLDS_FLIP.MINIMUM;
  
  // Évaluation du projet
  const rating = getRating(profit);
  
  // Générer une recommandation
  const recommendation = generateRecommendation(profit, roi, isViable);
  
  // Retourner les résultats
  return {
    profit: roundToTwo(profit),
    roi: roundToTwo(roi),
    isViable,
    rating,
    recommendation,
    breakdown: {
      finalPrice: finalPrice,
      initialPrice: initialPrice,
      renovationCost: renovationCost,
      expenses: roundToTwo(expenses),
      profit: roundToTwo(profit)
    }
  };
}

/**
 * Valide les entrées du calculateur
 * @param {NapkinFlipInput} input - Données d'entrée à valider
 * @throws {Error} Si les données sont invalides
 */
function validateInput(input) {
  if (!input) {
    throw new Error("Les données d'entrée sont requises");
  }
  
  if (input.finalPrice === undefined || input.finalPrice <= 0) {
    throw new Error("Le prix final (valeur de revente) doit être un nombre positif");
  }
  
  if (input.initialPrice === undefined || input.initialPrice <= 0) {
    throw new Error("Le prix initial (prix d'achat) doit être un nombre positif");
  }
  
  if (input.renovationCost === undefined || input.renovationCost < 0) {
    throw new Error("Le coût des rénovations doit être un nombre positif ou zéro");
  }
}

/**
 * Évalue la qualité du projet en fonction du profit
 * @param {number} profit - Profit estimé du projet
 * @returns {string} - Évaluation (EXCELLENT, GOOD, ACCEPTABLE, POOR)
 */
function getRating(profit) {
  if (profit >= PROFITABILITY_THRESHOLDS_FLIP.EXCELLENT) {
    return "EXCELLENT";
  } else if (profit >= PROFITABILITY_THRESHOLDS_FLIP.TARGET) {
    return "GOOD";
  } else if (profit >= PROFITABILITY_THRESHOLDS_FLIP.MINIMUM) {
    return "ACCEPTABLE";
  } else {
    return "POOR";
  }
}

/**
 * Génère une recommandation basée sur les résultats de l'analyse
 * @param {number} profit - Profit estimé du projet
 * @param {number} roi - Rendement sur investissement (%)
 * @param {boolean} isViable - Indique si le projet est viable
 * @returns {string} - Recommandation
 */
function generateRecommendation(profit, roi, isViable) {
  if (!isViable) {
    if (profit <= 0) {
      return "Ce projet générera une perte. Il est fortement déconseillé d'investir à moins de pouvoir négocier un prix d'achat plus bas ou de réduire les coûts de rénovation.";
    } else {
      return `Ce projet génère un profit de ${profit.toFixed(2)}$, ce qui est inférieur au seuil minimum recommandé de ${PROFITABILITY_THRESHOLDS_FLIP.MINIMUM}$. Envisagez de négocier un meilleur prix ou de réduire les coûts de rénovation.`;
    }
  }
  
  if (profit < PROFITABILITY_THRESHOLDS_FLIP.TARGET) {
    return `Ce projet est acceptable avec un profit de ${profit.toFixed(2)}$ et un ROI de ${roi.toFixed(2)}%, mais reste sous le seuil cible de ${PROFITABILITY_THRESHOLDS_FLIP.TARGET}$. Vérifiez si vous pouvez améliorer la rentabilité.`;
  } else if (profit < PROFITABILITY_THRESHOLDS_FLIP.EXCELLENT) {
    return `Ce projet est bon avec un profit de ${profit.toFixed(2)}$ et un ROI de ${roi.toFixed(2)}%. Procédez à une analyse plus détaillée et évaluez les possibilités d'optimisation.`;
  } else {
    return `Ce projet est excellent avec un profit de ${profit.toFixed(2)}$ et un ROI de ${roi.toFixed(2)}%. Fortement recommandé pour investissement.`;
  }
}

/**
 * Calcule le prix d'achat maximum pour atteindre un profit cible
 * @param {Object} params - Paramètres pour le calcul
 * @param {number} params.finalPrice - Prix final (valeur de revente après travaux)
 * @param {number} params.renovationCost - Prix des rénovations
 * @param {number} [params.targetProfit] - Profit cible (par défaut: 25000$)
 * @returns {Object} - Résultats du calcul
 */
function calculateMaxPurchasePrice(params) {
  // Validation des entrées
  if (!params) {
    throw new Error("Les paramètres sont requis");
  }
  
  if (params.finalPrice === undefined || params.finalPrice <= 0) {
    throw new Error("Le prix final (valeur de revente) doit être un nombre positif");
  }
  
  if (params.renovationCost === undefined || params.renovationCost < 0) {
    throw new Error("Le coût des rénovations doit être un nombre positif ou zéro");
  }
  
  const targetProfit = params.targetProfit || PROFITABILITY_THRESHOLDS_FLIP.TARGET;
  
  // Calcul selon la méthode FIP10 inversée
  const expenses = params.finalPrice * 0.1; // 10% de la valeur de revente
  const maxInitialPrice = params.finalPrice - params.renovationCost - expenses - targetProfit;
  
  // Vérifier que le prix d'achat maximum est cohérent
  if (maxInitialPrice <= 0) {
    throw new Error("Impossible d'atteindre le profit cible avec ces paramètres. Réduisez le profit cible, augmentez le prix de revente ou réduisez les coûts de rénovation.");
  }
  
  return {
    maxPurchasePrice: roundToTwo(maxInitialPrice),
    finalPrice: params.finalPrice,
    renovationCost: params.renovationCost,
    expenses: roundToTwo(expenses),
    targetProfit: targetProfit
  };
}

/**
 * Analyse la sensibilité du profit en fonction de différents scénarios
 * @param {NapkinFlipInput} baseInput - Données d'entrée de base
 * @param {Object} scenarios - Pourcentages de variation pour chaque paramètre
 * @returns {Object} - Résultats de l'analyse de sensibilité
 */
function performSensitivityAnalysis(baseInput, scenarios = {}) {
  // Scénarios par défaut si non spécifiés
  const variationScenarios = {
    initialPrice: scenarios.initialPrice || [-5, 0, 5],    // % de variation du prix d'achat
    finalPrice: scenarios.finalPrice || [-5, 0, 5],       // % de variation du prix de revente
    renovationCost: scenarios.renovationCost || [-10, 0, 10] // % de variation des coûts de rénovation
  };
  
  const results = {
    baseCase: calculateNapkinFlip(baseInput),
    scenarios: []
  };
  
  // ----- ANALYSE POUR LE PRIX D'ACHAT -----
  variationScenarios.initialPrice.forEach(initialPriceVar => {
    if (initialPriceVar === 0) return; // Ignorer le cas de base
    
    const newInitialPrice = baseInput.initialPrice * (1 + initialPriceVar / 100);
    
    const newInput = {
      ...baseInput,
      initialPrice: newInitialPrice
    };
    
    const scenario = {
      name: `Prix d'achat ${initialPriceVar > 0 ? '+' : ''}${initialPriceVar}%`,
      input: newInput,
      result: calculateNapkinFlip(newInput)
    };
    
    results.scenarios.push(scenario);
  });
  
  // ----- ANALYSE POUR LE PRIX DE REVENTE -----
  variationScenarios.finalPrice.forEach(finalPriceVar => {
    if (finalPriceVar === 0) return; // Ignorer le cas de base
    
    const newFinalPrice = baseInput.finalPrice * (1 + finalPriceVar / 100);
    
    const newInput = {
      ...baseInput,
      finalPrice: newFinalPrice
    };
    
    const scenario = {
      name: `Prix de revente ${finalPriceVar > 0 ? '+' : ''}${finalPriceVar}%`,
      input: newInput,
      result: calculateNapkinFlip(newInput)
    };
    
    results.scenarios.push(scenario);
  });
  
  // ----- ANALYSE POUR LES COÛTS DE RÉNOVATION -----
  variationScenarios.renovationCost.forEach(renovationCostVar => {
    if (renovationCostVar === 0) return; // Ignorer le cas de base
    
    const newRenovationCost = baseInput.renovationCost * (1 + renovationCostVar / 100);
    
    const newInput = {
      ...baseInput,
      renovationCost: newRenovationCost
    };
    
    const scenario = {
      name: `Coût des rénovations ${renovationCostVar > 0 ? '+' : ''}${renovationCostVar}%`,
      input: newInput,
      result: calculateNapkinFlip(newInput)
    };
    
    results.scenarios.push(scenario);
  });
  
  // Trier les scénarios par profit décroissant
  results.scenarios.sort((a, b) => b.result.profit - a.result.profit);
  
  return results;
}

/**
 * Arrondit un nombre à deux décimales
 * @param {number} num - Nombre à arrondir
 * @returns {number} - Nombre arrondi
 */
function roundToTwo(num) {
  return Math.round(num * 100) / 100;
}

module.exports = {
  PROFITABILITY_THRESHOLDS_FLIP,
  calculateNapkinFlip,
  calculateMaxPurchasePrice,
  performSensitivityAnalysis
};
