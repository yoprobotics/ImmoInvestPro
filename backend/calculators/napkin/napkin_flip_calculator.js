/**
 * Calculateur Napkin FLIP (FIP10)
 * 
 * Ce module implémente le calculateur rapide pour les projets FLIP selon la méthode des Secrets de l'Immobilier.
 * Il permet d'évaluer rapidement la rentabilité potentielle d'un projet de FLIP avec seulement 3 données.
 */

/**
 * Structure des entrées du calculateur Napkin FLIP
 * @typedef {Object} NapkinFlipInput
 * @property {number} finalPrice - Prix final (valeur de revente estimée après travaux)
 * @property {number} initialPrice - Prix initial (prix d'achat)
 * @property {number} renovationCost - Coût des rénovations
 */

/**
 * Structure des résultats du calculateur Napkin FLIP
 * @typedef {Object} NapkinFlipResult
 * @property {number} profit - Profit estimé
 * @property {number} profitPercent - Pourcentage de profit sur l'investissement total
 * @property {boolean} isViable - Indique si le projet est viable (profit minimum de 25 000$)
 * @property {string} rating - Évaluation du projet (EXCELLENT, GOOD, ACCEPTABLE, POOR)
 * @property {string} recommendation - Recommandation basée sur l'analyse
 */

/**
 * Seuils de rentabilité pour les projets FLIP
 * @const {Object}
 */
const FLIP_THRESHOLDS = {
  MINIMUM: 25000,   // Profit minimum acceptable (25 000$)
  TARGET: 40000,    // Profit cible (40 000$)
  EXCELLENT: 60000  // Profit excellent (60 000$)
};

/**
 * Pourcentage forfaitaire pour estimer les frais d'acquisition et de vente
 * @const {number}
 */
const STANDARD_FEE_PERCENTAGE = 10;

/**
 * Calcule la rentabilité d'un projet FLIP avec la méthode FIP10
 * @param {NapkinFlipInput} input - Données d'entrée pour le calcul
 * @returns {NapkinFlipResult} - Résultats de l'analyse
 */
function calculateNapkinFlip(input) {
  // Validation des entrées
  validateInput(input);
  
  // Extraction des valeurs
  const { finalPrice, initialPrice, renovationCost } = input;
  
  // Calcul du profit selon la méthode FIP10
  const standardFees = (finalPrice * STANDARD_FEE_PERCENTAGE) / 100;
  const profit = finalPrice - initialPrice - renovationCost - standardFees;
  
  // Calcul du pourcentage de profit sur l'investissement total
  const totalInvestment = initialPrice + renovationCost;
  const profitPercent = (profit / totalInvestment) * 100;
  
  // Déterminer si le projet est viable
  const isViable = profit >= FLIP_THRESHOLDS.MINIMUM;
  
  // Évaluation du projet
  const rating = getRating(profit);
  
  // Générer une recommandation
  const recommendation = generateRecommendation(profit, profitPercent, isViable);
  
  return {
    profit: roundToTwo(profit),
    profitPercent: roundToTwo(profitPercent),
    isViable,
    rating,
    recommendation,
    // Détails des calculs pour transparence
    breakdown: {
      finalPrice,
      initialPrice,
      renovationCost,
      standardFees: roundToTwo(standardFees),
      formula: "Prix Final - Prix Initial - Coût des Rénovations - 10% du Prix Final"
    }
  };
}

/**
 * Calcule le prix d'offre maximum pour obtenir un profit cible
 * @param {Object} params - Paramètres pour le calcul
 * @param {number} params.finalPrice - Prix final (valeur de revente estimée après travaux)
 * @param {number} params.renovationCost - Coût des rénovations
 * @param {number} [params.targetProfit] - Profit cible (par défaut: 25 000$)
 * @param {number} [params.feePercentage] - Pourcentage pour les frais standards (par défaut: 10%)
 * @returns {Object} - Prix d'offre maximum et détails
 */
function calculateMaxOfferPrice(params) {
  // Validation des entrées
  if (!params.finalPrice || params.finalPrice <= 0) {
    throw new Error("Le prix final (valeur de revente) est requis et doit être positif");
  }
  
  if (params.renovationCost === undefined || params.renovationCost < 0) {
    throw new Error("Le coût des rénovations est requis et doit être positif ou zéro");
  }
  
  const targetProfit = params.targetProfit || FLIP_THRESHOLDS.MINIMUM;
  const feePercentage = params.feePercentage || STANDARD_FEE_PERCENTAGE;
  
  // Calcul des frais standards
  const standardFees = (params.finalPrice * feePercentage) / 100;
  
  // Calcul du prix d'offre maximum
  const maxOfferPrice = params.finalPrice - params.renovationCost - standardFees - targetProfit;
  
  // Vérifier si le prix d'offre est cohérent
  if (maxOfferPrice <= 0) {
    throw new Error("Impossible d'atteindre le profit cible avec ces paramètres. Réduisez le profit cible, augmentez le prix final ou réduisez les coûts de rénovation.");
  }
  
  return {
    maxOfferPrice: roundToTwo(maxOfferPrice),
    targetProfit,
    breakdown: {
      finalPrice: params.finalPrice,
      renovationCost: params.renovationCost,
      standardFees: roundToTwo(standardFees),
      formula: "Prix Final - Coût des Rénovations - 10% du Prix Final - Profit Cible"
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
  
  if (!input.finalPrice || input.finalPrice <= 0) {
    throw new Error("Le prix final (valeur de revente) est requis et doit être positif");
  }
  
  if (!input.initialPrice || input.initialPrice <= 0) {
    throw new Error("Le prix initial (prix d'achat) est requis et doit être positif");
  }
  
  if (input.renovationCost === undefined || input.renovationCost < 0) {
    throw new Error("Le coût des rénovations est requis et doit être positif ou zéro");
  }
  
  if (input.initialPrice >= input.finalPrice) {
    throw new Error("Le prix initial ne peut pas être supérieur ou égal au prix final");
  }
}

/**
 * Évalue la qualité du projet en fonction du profit
 * @param {number} profit - Profit estimé
 * @returns {string} - Évaluation (EXCELLENT, GOOD, ACCEPTABLE, POOR)
 */
function getRating(profit) {
  if (profit >= FLIP_THRESHOLDS.EXCELLENT) {
    return "EXCELLENT";
  } else if (profit >= FLIP_THRESHOLDS.TARGET) {
    return "GOOD";
  } else if (profit >= FLIP_THRESHOLDS.MINIMUM) {
    return "ACCEPTABLE";
  } else {
    return "POOR";
  }
}

/**
 * Génère une recommandation basée sur les résultats de l'analyse
 * @param {number} profit - Profit estimé
 * @param {number} profitPercent - Pourcentage de profit
 * @param {boolean} isViable - Indique si le projet est viable
 * @returns {string} - Recommandation
 */
function generateRecommendation(profit, profitPercent, isViable) {
  if (!isViable) {
    if (profit <= 0) {
      return "Ce projet générera une perte. Il est fortement déconseillé d'investir à moins de pouvoir négocier un prix d'achat plus bas, réduire les coûts de rénovation ou augmenter la valeur finale.";
    } else {
      return `Ce projet génère un profit de ${profit.toFixed(2)}$, ce qui est inférieur au seuil minimum recommandé de ${FLIP_THRESHOLDS.MINIMUM}$. Envisagez de négocier un meilleur prix ou d'optimiser votre stratégie de rénovation.`;
    }
  }
  
  if (profit < FLIP_THRESHOLDS.TARGET) {
    return `Ce projet est acceptable avec un profit estimé de ${profit.toFixed(2)}$ (${profitPercent.toFixed(2)}% de rendement), mais reste sous le seuil cible de ${FLIP_THRESHOLDS.TARGET}$. Vérifiez si vous pouvez améliorer la rentabilité.`;
  } else if (profit < FLIP_THRESHOLDS.EXCELLENT) {
    return `Ce projet est bon avec un profit estimé de ${profit.toFixed(2)}$ (${profitPercent.toFixed(2)}% de rendement). Procédez à une analyse plus détaillée pour confirmer la viabilité.`;
  } else {
    return `Ce projet est excellent avec un profit estimé de ${profit.toFixed(2)}$ (${profitPercent.toFixed(2)}% de rendement). Fortement recommandé pour investissement.`;
  }
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
  FLIP_THRESHOLDS,
  STANDARD_FEE_PERCENTAGE,
  calculateNapkinFlip,
  calculateMaxOfferPrice
};
