/**
 * Calculateur Napkin MULTI (PAR + HIGH-5)
 * 
 * Ce module implémente le calculateur rapide pour les projets MULTI selon la méthode des Secrets de l'Immobilier.
 * Il permet d'évaluer rapidement la rentabilité potentielle d'un immeuble à revenus avec seulement 3 données.
 */

/**
 * Structure des entrées du calculateur Napkin MULTI
 * @typedef {Object} NapkinMultiInput
 * @property {number} purchasePrice - Prix d'achat
 * @property {number} units - Nombre d'unités (portes)
 * @property {number} grossRevenue - Revenus bruts annuels
 */

/**
 * Structure des résultats du calculateur Napkin MULTI
 * @typedef {Object} NapkinMultiResult
 * @property {number} cashflow - Liquidité annuelle
 * @property {number} cashflowPerUnit - Liquidité par porte par mois
 * @property {boolean} isViable - Indique si le projet est viable (cashflow minimum par porte)
 * @property {string} rating - Évaluation du projet (EXCELLENT, GOOD, ACCEPTABLE, POOR)
 * @property {string} recommendation - Recommandation basée sur l'analyse
 */

/**
 * Seuils de rentabilité par porte
 * @const {Object}
 */
const PROFITABILITY_THRESHOLDS = {
  MINIMUM: 50,   // Seuil minimum acceptable pour un cashflow par porte ($/mois)
  TARGET: 75,    // Seuil cible pour un bon cashflow par porte ($/mois)
  EXCELLENT: 100 // Seuil excellent pour un cashflow par porte ($/mois)
};

/**
 * Pourcentages de dépenses en fonction du nombre d'unités
 * @const {Object}
 */
const EXPENSE_RATIOS = {
  VERY_SMALL: 30,  // 1-2 logements
  SMALL: 35,       // 3-4 logements
  MEDIUM: 45,      // 5-6 logements
  LARGE: 50        // 7+ logements
};

/**
 * Taux pour le calcul simplifié du paiement hypothécaire (méthode HIGH-5)
 * @const {number}
 */
const HIGH_5_RATE = 0.005;

/**
 * Calcule la rentabilité d'un immeuble à revenus avec la méthode PAR + HIGH-5
 * @param {NapkinMultiInput} input - Données d'entrée pour le calcul
 * @returns {NapkinMultiResult} - Résultats de l'analyse
 */
function calculateNapkinMulti(input) {
  // Validation des entrées
  validateInput(input);
  
  // Extraction des valeurs
  const { purchasePrice, units, grossRevenue } = input;
  
  // Détermination du pourcentage de dépenses en fonction du nombre d'unités
  const expenseRatio = getExpenseRatio(units);
  
  // Calcul des dépenses d'opération
  const operatingExpenses = (grossRevenue * expenseRatio) / 100;
  
  // Calcul du revenu net d'opération (RNO)
  const netOperatingIncome = grossRevenue - operatingExpenses;
  
  // Calcul du paiement hypothécaire annuel avec la méthode HIGH-5
  const annualMortgagePayment = purchasePrice * HIGH_5_RATE * 12;
  
  // Calcul du cashflow annuel
  const cashflow = netOperatingIncome - annualMortgagePayment;
  
  // Calcul du cashflow par porte par mois
  const cashflowPerUnit = cashflow / units / 12;
  
  // Déterminer si le projet est viable
  const isViable = cashflow > 0 && cashflowPerUnit >= PROFITABILITY_THRESHOLDS.MINIMUM;
  
  // Évaluation du projet
  const rating = getRating(cashflowPerUnit);
  
  // Calcul du taux de capitalisation (Cap Rate)
  const capRate = (netOperatingIncome / purchasePrice) * 100;
  
  // Générer une recommandation
  const recommendation = generateRecommendation(cashflowPerUnit, capRate, isViable);
  
  return {
    cashflow: roundToTwo(cashflow),
    cashflowPerUnit: roundToTwo(cashflowPerUnit),
    isViable,
    rating,
    recommendation,
    // Détails des calculs pour transparence
    breakdown: {
      purchasePrice,
      units,
      grossRevenue,
      expenseRatio,
      operatingExpenses: roundToTwo(operatingExpenses),
      netOperatingIncome: roundToTwo(netOperatingIncome),
      annualMortgagePayment: roundToTwo(annualMortgagePayment),
      capRate: roundToTwo(capRate),
      formula: "(Revenus Bruts - Dépenses d'Opération - Paiement Hypothécaire) / Nombre d'Unités / 12"
    }
  };
}

/**
 * Calcule le prix d'achat maximum pour obtenir un cashflow cible par porte par mois
 * @param {Object} params - Paramètres pour le calcul
 * @param {number} params.units - Nombre d'unités (portes)
 * @param {number} params.grossRevenue - Revenus bruts annuels
 * @param {number} [params.targetCashflowPerUnit] - Cashflow cible par porte par mois (par défaut: 75)
 * @returns {Object} - Prix d'achat maximum et détails
 */
function calculateMaxPurchasePrice(params) {
  // Validation des entrées
  if (!params.units || params.units <= 0 || !Number.isInteger(params.units)) {
    throw new Error("Le nombre d'unités doit être un entier positif");
  }
  
  if (!params.grossRevenue || params.grossRevenue <= 0) {
    throw new Error("Les revenus bruts annuels sont requis et doivent être positifs");
  }
  
  const targetCashflowPerUnit = params.targetCashflowPerUnit || PROFITABILITY_THRESHOLDS.TARGET;
  
  // Détermination du pourcentage de dépenses en fonction du nombre d'unités
  const expenseRatio = getExpenseRatio(params.units);
  
  // Calcul des dépenses d'opération
  const operatingExpenses = (params.grossRevenue * expenseRatio) / 100;
  
  // Calcul du revenu net d'opération (RNO)
  const netOperatingIncome = params.grossRevenue - operatingExpenses;
  
  // Cashflow annuel cible
  const targetAnnualCashflow = targetCashflowPerUnit * params.units * 12;
  
  // Paiement hypothécaire maximum possible
  const maxMortgagePayment = netOperatingIncome - targetAnnualCashflow;
  
  // Vérifier si le paiement hypothécaire maximum est cohérent
  if (maxMortgagePayment <= 0) {
    throw new Error("Impossible d'atteindre le cashflow cible avec ces paramètres. Réduisez le cashflow cible, augmentez les revenus ou réduisez les dépenses.");
  }
  
  // Calcul du prix d'achat maximum avec la méthode HIGH-5 à l'inverse
  const maxPurchasePrice = maxMortgagePayment / (HIGH_5_RATE * 12);
  
  return {
    maxPurchasePrice: roundToTwo(maxPurchasePrice),
    targetCashflowPerUnit: roundToTwo(targetCashflowPerUnit),
    breakdown: {
      units: params.units,
      grossRevenue: params.grossRevenue,
      expenseRatio,
      operatingExpenses: roundToTwo(operatingExpenses),
      netOperatingIncome: roundToTwo(netOperatingIncome),
      maxMortgagePayment: roundToTwo(maxMortgagePayment),
      formula: "Prix d'achat maximum = (Revenus Bruts - Dépenses - (Cashflow Cible × Unités × 12)) / (0.005 × 12)"
    }
  };
}

/**
 * Valide les entrées du calculateur
 * @param {NapkinMultiInput} input - Données d'entrée à valider
 * @throws {Error} Si les données sont invalides
 */
function validateInput(input) {
  if (!input) {
    throw new Error("Les données d'entrée sont requises");
  }
  
  if (!input.purchasePrice || input.purchasePrice <= 0) {
    throw new Error("Le prix d'achat est requis et doit être positif");
  }
  
  if (!input.units || input.units <= 0 || !Number.isInteger(input.units)) {
    throw new Error("Le nombre d'unités doit être un entier positif");
  }
  
  if (!input.grossRevenue || input.grossRevenue <= 0) {
    throw new Error("Les revenus bruts annuels sont requis et doivent être positifs");
  }
}

/**
 * Détermine le pourcentage de dépenses en fonction du nombre d'unités
 * @param {number} units - Nombre d'unités
 * @returns {number} - Pourcentage de dépenses
 */
function getExpenseRatio(units) {
  if (units <= 2) {
    return EXPENSE_RATIOS.VERY_SMALL;
  } else if (units <= 4) {
    return EXPENSE_RATIOS.SMALL;
  } else if (units <= 6) {
    return EXPENSE_RATIOS.MEDIUM;
  } else {
    return EXPENSE_RATIOS.LARGE;
  }
}

/**
 * Évalue la qualité du projet en fonction du cashflow par porte
 * @param {number} cashflowPerUnit - Cashflow par porte par mois
 * @returns {string} - Évaluation (EXCELLENT, GOOD, ACCEPTABLE, POOR)
 */
function getRating(cashflowPerUnit) {
  if (cashflowPerUnit >= PROFITABILITY_THRESHOLDS.EXCELLENT) {
    return "EXCELLENT";
  } else if (cashflowPerUnit >= PROFITABILITY_THRESHOLDS.TARGET) {
    return "GOOD";
  } else if (cashflowPerUnit >= PROFITABILITY_THRESHOLDS.MINIMUM) {
    return "ACCEPTABLE";
  } else {
    return "POOR";
  }
}

/**
 * Génère une recommandation basée sur les résultats de l'analyse
 * @param {number} cashflowPerUnit - Cashflow par porte par mois
 * @param {number} capRate - Taux de capitalisation (%)
 * @param {boolean} isViable - Indique si le projet est viable
 * @returns {string} - Recommandation
 */
function generateRecommendation(cashflowPerUnit, capRate, isViable) {
  if (!isViable) {
    if (cashflowPerUnit <= 0) {
      return "Ce projet générera un cashflow négatif. Il est fortement déconseillé d'investir à moins de pouvoir négocier un prix d'achat plus bas, optimiser les revenus ou réduire les dépenses.";
    } else {
      return `Ce projet génère un cashflow de ${cashflowPerUnit.toFixed(2)}$ par porte par mois, ce qui est inférieur au seuil minimum recommandé de ${PROFITABILITY_THRESHOLDS.MINIMUM}$. Envisagez de négocier un meilleur prix ou d'optimiser la structure de revenus et dépenses.`;
    }
  }
  
  if (cashflowPerUnit < PROFITABILITY_THRESHOLDS.TARGET) {
    return `Ce projet est acceptable avec un cashflow de ${cashflowPerUnit.toFixed(2)}$ par porte par mois, mais reste sous le seuil cible de ${PROFITABILITY_THRESHOLDS.TARGET}$. Le taux de capitalisation est de ${capRate.toFixed(2)}%. Vérifiez si vous pouvez améliorer la rentabilité.`;
  } else if (cashflowPerUnit < PROFITABILITY_THRESHOLDS.EXCELLENT) {
    return `Ce projet est bon avec un cashflow de ${cashflowPerUnit.toFixed(2)}$ par porte par mois et un taux de capitalisation de ${capRate.toFixed(2)}%. Procédez à une analyse plus détaillée pour confirmer la viabilité.`;
  } else {
    return `Ce projet est excellent avec un cashflow de ${cashflowPerUnit.toFixed(2)}$ par porte par mois et un taux de capitalisation de ${capRate.toFixed(2)}%. Fortement recommandé pour investissement.`;
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
  EXPENSE_RATIOS,
  HIGH_5_RATE,
  calculateNapkinMulti,
  calculateMaxPurchasePrice
};
