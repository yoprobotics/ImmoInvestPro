/**
 * Calculateur Napkin FLIP (Méthode FIP10)
 * 
 * Ce module implémente la méthode Napkin pour l'évaluation rapide
 * de projets de type FLIP (achat, rénovation, revente).
 */

/**
 * Structure d'entrée pour le calculateur FLIP
 * @typedef {Object} FlipNapkinInput
 * @property {number} finalPrice - Prix final (valeur de revente)
 * @property {number} initialPrice - Prix initial (prix d'achat)
 * @property {number} renovationCost - Coût des rénovations
 */

/**
 * Structure de sortie pour le calculateur FLIP
 * @typedef {Object} FlipNapkinResult
 * @property {number} finalPrice - Prix final (valeur de revente)
 * @property {number} initialPrice - Prix initial (prix d'achat)
 * @property {number} renovationCost - Coût des rénovations
 * @property {number} carryCosts - Coûts de portage (10% de la valeur de revente)
 * @property {number} profit - Profit estimé
 * @property {number} profitPercentage - Pourcentage de profit par rapport à l'investissement total
 * @property {boolean} isViable - Indique si le projet est viable (profit > 0)
 * @property {string} rating - Évaluation du projet (EXCELLENT, GOOD, ACCEPTABLE, POOR)
 * @property {string} recommendation - Recommandation basée sur l'analyse
 */

/**
 * Structure de sortie pour le calcul du prix d'offre
 * @typedef {Object} FlipOfferPriceResult
 * @property {number} finalPrice - Prix final (valeur de revente)
 * @property {number} renovationCost - Coût des rénovations
 * @property {number} carryCosts - Coûts de portage (10% de la valeur de revente)
 * @property {number} targetProfit - Profit visé
 * @property {number} maxOfferPrice - Prix d'offre maximal recommandé
 */

/**
 * Pourcentage standard pour les coûts de portage (frais d'acquisition, possession, vente, etc.)
 * @const {number}
 */
const CARRY_COSTS_PERCENTAGE = 10;

/**
 * Seuils de rentabilité pour l'évaluation des projets FLIP
 * @const {Object}
 */
const PROFITABILITY_THRESHOLDS = {
  MINIMUM: 15000,   // Profit minimum acceptable
  TARGET: 25000,    // Profit cible
  EXCELLENT: 40000  // Seuil pour un profit excellent
};

/**
 * Calcule le profit d'un projet FLIP selon la méthode Napkin (FIP10)
 * 
 * @param {FlipNapkinInput} input - Données d'entrée pour le calcul
 * @returns {FlipNapkinResult} - Résultats de l'analyse Napkin FLIP
 */
function calculateFlipNapkin(input) {
  // Validation des entrées
  validateInput(input);
  
  // Calcul des coûts de portage (10% de la valeur de revente)
  const carryCosts = input.finalPrice * (CARRY_COSTS_PERCENTAGE / 100);
  
  // Calcul du profit selon la méthode FIP10
  const profit = input.finalPrice - input.initialPrice - input.renovationCost - carryCosts;
  
  // Calcul du pourcentage de profit par rapport à l'investissement total
  const totalInvestment = input.initialPrice + input.renovationCost;
  const profitPercentage = (profit / totalInvestment) * 100;
  
  // Déterminer si le projet est viable
  const isViable = profit > 0;
  
  // Évaluation du projet
  const rating = getRating(profit);
  
  // Générer une recommandation
  const recommendation = generateRecommendation(profit, profitPercentage, isViable);
  
  return {
    finalPrice: input.finalPrice,
    initialPrice: input.initialPrice,
    renovationCost: input.renovationCost,
    carryCosts: roundToTwo(carryCosts),
    profit: roundToTwo(profit),
    profitPercentage: roundToTwo(profitPercentage),
    isViable,
    rating,
    recommendation
  };
}

/**
 * Calcule le prix d'offre maximal pour obtenir un profit cible
 * 
 * @param {Object} params - Paramètres pour le calcul
 * @param {number} params.finalPrice - Prix final (valeur de revente)
 * @param {number} params.renovationCost - Coût des rénovations
 * @param {number} [params.targetProfit] - Profit visé (par défaut: 25000)
 * @returns {FlipOfferPriceResult} - Résultats du calcul du prix d'offre
 */
function calculateMaxOfferPrice(params) {
  // Validation des paramètres
  if (!params.finalPrice || params.finalPrice <= 0) {
    throw new Error("Le prix final doit être un nombre positif");
  }
  
  if (params.renovationCost === undefined || params.renovationCost < 0) {
    throw new Error("Le coût des rénovations doit être un nombre positif ou zéro");
  }
  
  // Utiliser le profit cible par défaut si non spécifié
  const targetProfit = params.targetProfit || PROFITABILITY_THRESHOLDS.TARGET;
  
  // Calcul des coûts de portage (10% de la valeur de revente)
  const carryCosts = params.finalPrice * (CARRY_COSTS_PERCENTAGE / 100);
  
  // Calcul du prix d'offre maximal selon la formule inversée
  // Prix Final - Coût Rénovations - Coûts de Portage - Profit Visé = Prix d'Offre
  const maxOfferPrice = params.finalPrice - params.renovationCost - carryCosts - targetProfit;
  
  // Vérifier si le prix d'offre est cohérent
  if (maxOfferPrice <= 0) {
    throw new Error("Impossible d'atteindre le profit cible avec ces paramètres. Réduisez le profit visé, augmentez le prix final ou réduisez les coûts de rénovation.");
  }
  
  return {
    finalPrice: params.finalPrice,
    renovationCost: params.renovationCost,
    carryCosts: roundToTwo(carryCosts),
    targetProfit: targetProfit,
    maxOfferPrice: roundToTwo(maxOfferPrice)
  };
}

/**
 * Valide les entrées du calculateur Napkin FLIP
 * 
 * @param {FlipNapkinInput} input - Données d'entrée à valider
 * @throws {Error} Si les données sont invalides
 */
function validateInput(input) {
  if (!input) {
    throw new Error("Les données d'entrée sont requises");
  }
  
  if (!input.finalPrice || input.finalPrice <= 0) {
    throw new Error("Le prix final doit être un nombre positif");
  }
  
  if (!input.initialPrice || input.initialPrice <= 0) {
    throw new Error("Le prix initial doit être un nombre positif");
  }
  
  if (input.renovationCost === undefined || input.renovationCost < 0) {
    throw new Error("Le coût des rénovations doit être un nombre positif ou zéro");
  }
  
  if (input.initialPrice >= input.finalPrice) {
    throw new Error("Le prix initial doit être inférieur au prix final pour envisager un FLIP rentable");
  }
}

/**
 * Évalue la qualité du projet en fonction du profit
 * 
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
 * 
 * @param {number} profit - Profit estimé
 * @param {number} profitPercentage - Pourcentage de profit
 * @param {boolean} isViable - Indique si le projet est viable
 * @returns {string} - Recommandation
 */
function generateRecommendation(profit, profitPercentage, isViable) {
  if (!isViable) {
    return `Ce projet générera une perte de ${Math.abs(profit).toFixed(2)}$. Il est fortement déconseillé d'investir à moins de pouvoir négocier un prix d'achat inférieur, réduire les coûts de rénovation ou augmenter le prix de revente.`;
  }
  
  if (profit < PROFITABILITY_THRESHOLDS.MINIMUM) {
    return `Ce projet générera un profit de ${profit.toFixed(2)}$, ce qui est inférieur au seuil minimum recommandé de ${PROFITABILITY_THRESHOLDS.MINIMUM}$. Le rendement est de ${profitPercentage.toFixed(2)}%. Envisagez de négocier un meilleur prix ou d'optimiser les rénovations.`;
  } else if (profit < PROFITABILITY_THRESHOLDS.TARGET) {
    return `Ce projet est acceptable avec un profit de ${profit.toFixed(2)}$, mais reste sous le seuil cible de ${PROFITABILITY_THRESHOLDS.TARGET}$. Le rendement est de ${profitPercentage.toFixed(2)}%. Vérifiez si vous pouvez améliorer la rentabilité.`;
  } else if (profit < PROFITABILITY_THRESHOLDS.EXCELLENT) {
    return `Ce projet est bon avec un profit estimé de ${profit.toFixed(2)}$ et un rendement de ${profitPercentage.toFixed(2)}%. Procédez à une analyse plus détaillée et évaluez les possibilités d'optimisation.`;
  } else {
    return `Ce projet est excellent avec un profit de ${profit.toFixed(2)}$ et un rendement de ${profitPercentage.toFixed(2)}%. Fortement recommandé pour investissement si l'analyse détaillée confirme ces estimations.`;
  }
}

/**
 * Arrondit un nombre à deux décimales
 * 
 * @param {number} num - Nombre à arrondir
 * @returns {number} - Nombre arrondi
 */
function roundToTwo(num) {
  return Math.round(num * 100) / 100;
}

module.exports = {
  CARRY_COSTS_PERCENTAGE,
  PROFITABILITY_THRESHOLDS,
  calculateFlipNapkin,
  calculateMaxOfferPrice
};
