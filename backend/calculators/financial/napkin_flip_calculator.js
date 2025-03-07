/**
 * Calculateur Napkin FLIP (FIP10)
 * 
 * Ce module implémente la méthode "FIP10" des Secrets de l'Immobilier qui permet
 * d'évaluer rapidement la rentabilité d'un projet de flip immobilier avec seulement
 * trois variables: prix Final, prix Initial et prix des Rénovations.
 */

/**
 * Structure des entrées pour le calculateur Napkin FLIP
 * @typedef {Object} NapkinFlipInput
 * @property {number} finalPrice - Prix final (valeur de revente estimée)
 * @property {number} initialPrice - Prix initial (prix d'achat)
 * @property {number} renovationCost - Coût estimé des rénovations
 */

/**
 * Structure des résultats du calculateur Napkin FLIP
 * @typedef {Object} NapkinFlipResult
 * @property {number} profit - Profit estimé
 * @property {boolean} isViable - Indique si le projet est viable (profit > seuil minimum)
 * @property {string} rating - Évaluation du projet (EXCELLENT, GOOD, ACCEPTABLE, POOR)
 * @property {Object} breakdown - Détail des calculs avec les pourcentages
 */

/**
 * Seuils de rentabilité pour un projet FLIP
 * @const {Object}
 */
const PROFITABILITY_THRESHOLDS = {
  MINIMUM: 15000,   // Seuil minimum acceptable pour un profit (en $)
  TARGET: 25000,    // Seuil cible pour un bon profit (en $)
  EXCELLENT: 40000  // Seuil excellent pour un profit (en $)
};

/**
 * Calcule le profit estimé d'un projet FLIP avec la méthode FIP10
 * @param {NapkinFlipInput} input - Données d'entrée pour le calcul
 * @returns {NapkinFlipResult} - Résultats de l'analyse
 */
function calculateNapkinFlip(input) {
  // Validation des entrées
  validateInput(input);
  
  // Extraction des valeurs
  const { finalPrice, initialPrice, renovationCost } = input;
  
  // Calcul des frais additionnels (10% de la valeur de revente)
  const additionalCosts = finalPrice * 0.1;
  
  // Calcul du profit selon la méthode FIP10
  const profit = finalPrice - initialPrice - renovationCost - additionalCosts;
  
  // Déterminer si le projet est viable
  const isViable = profit >= PROFITABILITY_THRESHOLDS.MINIMUM;
  
  // Évaluation du projet
  const rating = getRating(profit);
  
  // Générer la recommandation
  const recommendation = generateRecommendation(profit, isViable);
  
  // Retourner les résultats
  return {
    profit: roundToTwo(profit),
    isViable,
    rating,
    recommendation,
    breakdown: {
      finalPrice: roundToTwo(finalPrice),
      initialPrice: roundToTwo(initialPrice),
      renovationCost: roundToTwo(renovationCost),
      additionalCosts: roundToTwo(additionalCosts),
      profit: roundToTwo(profit)
    }
  };
}

/**
 * Calcule le prix d'achat maximal pour atteindre un profit cible
 * @param {Object} params - Paramètres pour le calcul
 * @param {number} params.finalPrice - Prix final estimé (valeur de revente)
 * @param {number} params.renovationCost - Coût estimé des rénovations
 * @param {number} [params.targetProfit] - Profit cible (par défaut: 25 000$)
 * @returns {Object} - Résultats du calcul
 */
function calculateMaxPurchasePrice(params) {
  // Validation des entrées
  if (!params.finalPrice || params.finalPrice <= 0) {
    throw new Error("Le prix final (valeur de revente) est requis et doit être positif");
  }
  
  if (params.renovationCost === undefined || params.renovationCost < 0) {
    throw new Error("Le coût des rénovations est requis et doit être positif ou zéro");
  }
  
  const targetProfit = params.targetProfit || PROFITABILITY_THRESHOLDS.TARGET;
  
  // Calcul du prix d'achat maximal selon la méthode FIP10
  const additionalCosts = params.finalPrice * 0.1;
  const maxPurchasePrice = params.finalPrice - params.renovationCost - additionalCosts - targetProfit;
  
  // Vérifier si le prix d'achat est cohérent
  if (maxPurchasePrice <= 0) {
    throw new Error("Impossible d'atteindre le profit cible avec ces paramètres. Réduisez le profit cible, augmentez le prix final ou réduisez les coûts de rénovation.");
  }
  
  return {
    maxPurchasePrice: roundToTwo(maxPurchasePrice),
    targetProfit: roundToTwo(targetProfit),
    breakdown: {
      finalPrice: roundToTwo(params.finalPrice),
      renovationCost: roundToTwo(params.renovationCost),
      additionalCosts: roundToTwo(additionalCosts)
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
    throw new Error("Le prix final (valeur de revente) doit être un nombre positif");
  }
  
  if (!input.initialPrice || input.initialPrice <= 0) {
    throw new Error("Le prix initial (prix d'achat) doit être un nombre positif");
  }
  
  if (input.renovationCost === undefined || input.renovationCost < 0) {
    throw new Error("Le coût des rénovations doit être un nombre positif ou zéro");
  }
  
  if (input.initialPrice >= input.finalPrice) {
    throw new Error("Le prix initial (prix d'achat) doit être inférieur au prix final (valeur de revente)");
  }
}

/**
 * Évalue la qualité du projet en fonction du profit
 * @param {number} profit - Profit estimé
 * @returns {string} - Évaluation (EXCELLENT, GOOD, ACCEPTABLE, POOR)
 */
function getRating(profit) {
  if (profit >= PROFITABILITY_THRESHOLDS.EXCELLENT) {
    return "EXCELLENT";
  } else if (profit >= PROFITABILITY_THRESHOLDS.TARGET) {
    return "GOOD";
  } else if (profit >= PROFITABILITY_THRESHOLDS.MINIMUM) {
    return "ACCEPTABLE";
  } else {
    return "POOR";
  }
}

/**
 * Génère une recommandation basée sur les résultats de l'analyse
 * @param {number} profit - Profit estimé
 * @param {boolean} isViable - Indique si le projet est viable
 * @returns {string} - Recommandation
 */
function generateRecommendation(profit, isViable) {
  if (!isViable) {
    if (profit <= 0) {
      return "Ce projet générerait une perte. Il est fortement déconseillé d'investir à moins de pouvoir négocier un prix d'achat plus bas.";
    } else {
      return `Ce projet génère un profit estimé de ${profit.toFixed(2)}$, ce qui est inférieur au seuil minimum recommandé de ${PROFITABILITY_THRESHOLDS.MINIMUM}$. Envisagez de négocier un meilleur prix ou de revoir votre estimation de la valeur finale.`;
    }
  }
  
  if (profit < PROFITABILITY_THRESHOLDS.TARGET) {
    return `Ce projet est acceptable avec un profit estimé de ${profit.toFixed(2)}$, mais reste sous le seuil cible de ${PROFITABILITY_THRESHOLDS.TARGET}$. Vérifiez si vous pouvez améliorer la rentabilité.`;
  } else if (profit < PROFITABILITY_THRESHOLDS.EXCELLENT) {
    return `Ce projet est bon avec un profit estimé de ${profit.toFixed(2)}$. Procédez à une analyse plus détaillée et évaluez les possibilités d'optimisation.`;
  } else {
    return `Ce projet est excellent avec un profit estimé de ${profit.toFixed(2)}$. Fortement recommandé pour investissement.`;
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
  PROFITABILITY_THRESHOLDS,
  calculateNapkinFlip,
  calculateMaxPurchasePrice
};
