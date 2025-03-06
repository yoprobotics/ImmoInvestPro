/**
 * Calculateur Napkin FLIP - Méthode FIP10
 * 
 * Ce module implémente le calculateur rapide (Napkin) pour les projets de type FLIP
 * selon la méthodologie des Secrets de l'Immobilier.
 * Il utilise la formule FIP10 pour estimer rapidement la rentabilité d'un projet.
 */

/**
 * Structure des entrées du calculateur Napkin FLIP
 * @typedef {Object} NapkinFlipInput
 * @property {number} finalPrice - Prix de vente estimé après travaux (F)
 * @property {number} initialPrice - Prix d'achat initial (I)
 * @property {number} renovationCost - Coût estimé des rénovations (P)
 * @property {number} [overheadPercentage=10] - Pourcentage du prix final pour les frais généraux, par défaut 10%
 */

/**
 * Structure des résultats du calculateur Napkin FLIP
 * @typedef {Object} NapkinFlipResult
 * @property {number} estimatedProfit - Profit estimé du projet
 * @property {number} profitPercentage - Pourcentage de profit par rapport à l'investissement total
 * @property {number} overheadAmount - Montant calculé pour les frais généraux (10% du prix final)
 * @property {number} totalInvestment - Investissement total (prix initial + rénovations)
 * @property {boolean} isViable - Indique si le projet est viable (profit positif et suffisant)
 * @property {string} rating - Évaluation du projet (EXCELLENT, GOOD, ACCEPTABLE, POOR)
 * @property {string} recommendation - Recommandation basée sur l'analyse
 */

/**
 * Structure pour les résultats du calcul d'offre optimale
 * @typedef {Object} OptimalOfferResult
 * @property {number} optimalOffer - Prix d'offre optimal pour atteindre le profit cible
 * @property {number} targetProfit - Profit cible utilisé pour le calcul
 * @property {number} calculatedProfit - Profit calculé (devrait être proche du profit cible)
 * @property {boolean} isPossible - Indique si l'offre est possible (montant positif)
 */

/**
 * Seuils de profit pour évaluer la viabilité d'un projet FLIP
 * @const {Object}
 */
const PROFIT_THRESHOLDS = {
  MINIMUM: 15000,  // Seuil minimum acceptable pour un profit de FLIP
  TARGET: 25000,   // Seuil cible pour un bon profit de FLIP
  EXCELLENT: 40000 // Seuil excellent pour un profit de FLIP
};

/**
 * Calcule la rentabilité d'un projet FLIP en utilisant la méthode FIP10
 * @param {NapkinFlipInput} input - Les paramètres d'entrée pour le calcul
 * @returns {NapkinFlipResult} - Les résultats de l'analyse
 */
function calculateNapkinFlip(input) {
  // Validation des entrées
  validateInput(input);
  
  // Extraire les valeurs avec valeurs par défaut si nécessaire
  const finalPrice = input.finalPrice;
  const initialPrice = input.initialPrice;
  const renovationCost = input.renovationCost;
  const overheadPercentage = input.overheadPercentage || 10;
  
  // Calcul selon la formule FIP10
  const overheadAmount = (finalPrice * overheadPercentage) / 100;
  const estimatedProfit = finalPrice - initialPrice - renovationCost - overheadAmount;
  const totalInvestment = initialPrice + renovationCost;
  const profitPercentage = (estimatedProfit / totalInvestment) * 100;
  
  // Évaluation du projet
  const isViable = estimatedProfit >= PROFIT_THRESHOLDS.MINIMUM;
  const rating = getRating(estimatedProfit);
  const recommendation = generateRecommendation(estimatedProfit, profitPercentage, totalInvestment);
  
  return {
    estimatedProfit: roundToTwo(estimatedProfit),
    profitPercentage: roundToTwo(profitPercentage),
    overheadAmount: roundToTwo(overheadAmount),
    totalInvestment: roundToTwo(totalInvestment),
    isViable,
    rating,
    recommendation
  };
}

/**
 * Calcule le prix d'offre optimal pour atteindre un profit cible
 * @param {Object} params - Les paramètres pour le calcul
 * @param {number} params.finalPrice - Prix de vente estimé après travaux
 * @param {number} params.renovationCost - Coût estimé des rénovations
 * @param {number} [params.targetProfit=25000] - Profit cible (par défaut: 25 000$)
 * @param {number} [params.overheadPercentage=10] - Pourcentage du prix final pour les frais généraux (par défaut: 10%)
 * @returns {OptimalOfferResult} - Les résultats du calcul d'offre optimale
 */
function calculateOptimalOffer(params) {
  // Validation des paramètres
  if (!params.finalPrice || params.finalPrice <= 0) {
    throw new Error("Le prix final doit être un nombre positif");
  }
  
  if (!params.renovationCost && params.renovationCost !== 0) {
    throw new Error("Le coût des rénovations est requis");
  }
  
  // Extraire les valeurs avec valeurs par défaut si nécessaire
  const finalPrice = params.finalPrice;
  const renovationCost = params.renovationCost;
  const targetProfit = params.targetProfit || PROFIT_THRESHOLDS.TARGET;
  const overheadPercentage = params.overheadPercentage || 10;
  
  // Calcul selon la formule FIP10 inversée
  const overheadAmount = (finalPrice * overheadPercentage) / 100;
  const optimalOffer = finalPrice - renovationCost - overheadAmount - targetProfit;
  
  // Vérifier si l'offre est possible (montant positif)
  const isPossible = optimalOffer > 0;
  
  // Calculer le profit réel pour vérification
  const calculatedProfit = finalPrice - optimalOffer - renovationCost - overheadAmount;
  
  return {
    optimalOffer: roundToTwo(optimalOffer),
    targetProfit: roundToTwo(targetProfit),
    calculatedProfit: roundToTwo(calculatedProfit),
    isPossible
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
    throw new Error("Le prix final doit être un nombre positif");
  }
  
  if (!input.initialPrice || input.initialPrice <= 0) {
    throw new Error("Le prix initial doit être un nombre positif");
  }
  
  if (!input.renovationCost && input.renovationCost !== 0) {
    throw new Error("Le coût des rénovations est requis");
  }
  
  if (input.renovationCost < 0) {
    throw new Error("Le coût des rénovations doit être un nombre positif ou zéro");
  }
  
  // Valider le pourcentage de frais généraux si fourni
  if (input.overheadPercentage !== undefined && 
      (typeof input.overheadPercentage !== 'number' || 
       input.overheadPercentage <= 0 || 
       input.overheadPercentage > 30)) {
    throw new Error("Le pourcentage de frais généraux doit être un nombre positif entre 1 et 30");
  }
}

/**
 * Évalue la qualité du projet en fonction du profit estimé
 * @param {number} estimatedProfit - Profit estimé du projet
 * @returns {string} - Évaluation (EXCELLENT, GOOD, ACCEPTABLE, POOR)
 */
function getRating(estimatedProfit) {
  if (estimatedProfit >= PROFIT_THRESHOLDS.EXCELLENT) {
    return "EXCELLENT";
  } else if (estimatedProfit >= PROFIT_THRESHOLDS.TARGET) {
    return "GOOD";
  } else if (estimatedProfit >= PROFIT_THRESHOLDS.MINIMUM) {
    return "ACCEPTABLE";
  } else {
    return "POOR";
  }
}

/**
 * Génère une recommandation basée sur les résultats de l'analyse
 * @param {number} estimatedProfit - Profit estimé du projet
 * @param {number} profitPercentage - Pourcentage de profit
 * @param {number} totalInvestment - Investissement total
 * @returns {string} - Recommandation
 */
function generateRecommendation(estimatedProfit, profitPercentage, totalInvestment) {
  if (estimatedProfit < 0) {
    return `Ce projet générera une perte de ${Math.abs(estimatedProfit).toFixed(2)}$. Il est fortement déconseillé d'investir à moins de pouvoir négocier un prix d'achat plus bas, réduire les coûts de rénovation ou augmenter la valeur de revente.`;
  }
  
  if (estimatedProfit < PROFIT_THRESHOLDS.MINIMUM) {
    return `Ce projet génère un profit de ${estimatedProfit.toFixed(2)}$, ce qui est inférieur au seuil minimum recommandé de ${PROFIT_THRESHOLDS.MINIMUM}$. Envisagez de négocier un meilleur prix ou de réévaluer la stratégie de rénovation.`;
  }
  
  if (estimatedProfit < PROFIT_THRESHOLDS.TARGET) {
    return `Ce projet est acceptable avec un profit de ${estimatedProfit.toFixed(2)}$ (${profitPercentage.toFixed(2)}% de l'investissement), mais reste sous le seuil cible de ${PROFIT_THRESHOLDS.TARGET}$. Vérifiez si vous pouvez améliorer la rentabilité.`;
  } 
  
  if (estimatedProfit < PROFIT_THRESHOLDS.EXCELLENT) {
    return `Ce projet est bon avec un profit de ${estimatedProfit.toFixed(2)}$ (${profitPercentage.toFixed(2)}% de l'investissement total de ${totalInvestment.toFixed(2)}$). Procédez à une analyse plus détaillée pour confirmer les coûts de rénovation.`;
  }
  
  return `Ce projet est excellent avec un profit de ${estimatedProfit.toFixed(2)}$ (${profitPercentage.toFixed(2)}% de l'investissement). Fortement recommandé pour investissement, sous réserve de confirmation des coûts de rénovation et du prix de revente.`;
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
  PROFIT_THRESHOLDS,
  calculateNapkinFlip,
  calculateOptimalOffer
};
