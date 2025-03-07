/**
 * Calculateur Napkin MULTI (Méthode PAR + HIGH-5)
 * 
 * Ce module implémente la méthode Napkin pour l'évaluation rapide
 * de projets de type MULTI (immeubles à revenus).
 */

/**
 * Structure d'entrée pour le calculateur MULTI
 * @typedef {Object} MultiNapkinInput
 * @property {number} price - Prix d'achat de l'immeuble
 * @property {number} units - Nombre d'unités (appartements)
 * @property {number} grossRevenue - Revenus bruts annuels
 */

/**
 * Structure de sortie pour le calculateur MULTI
 * @typedef {Object} MultiNapkinResult
 * @property {number} price - Prix d'achat de l'immeuble
 * @property {number} units - Nombre d'unités (appartements)
 * @property {number} grossRevenue - Revenus bruts annuels
 * @property {number} expensePercentage - Pourcentage des dépenses calculé en fonction du nombre d'unités
 * @property {number} expenses - Dépenses annuelles estimées
 * @property {number} netOperatingIncome - Revenu net d'opération
 * @property {number} mortgagePayment - Versement hypothécaire annuel (méthode HIGH-5)
 * @property {number} cashflow - Liquidité (cashflow) annuelle
 * @property {number} cashflowPerUnit - Liquidité mensuelle par unité
 * @property {boolean} isViable - Indique si le projet est viable
 * @property {string} rating - Évaluation du projet (EXCELLENT, GOOD, ACCEPTABLE, POOR)
 * @property {string} recommendation - Recommandation basée sur l'analyse
 */

/**
 * Structure de sortie pour le calcul du prix d'achat maximum
 * @typedef {Object} MaxPurchasePriceResult
 * @property {number} units - Nombre d'unités (appartements)
 * @property {number} grossRevenue - Revenus bruts annuels
 * @property {number} expensePercentage - Pourcentage des dépenses
 * @property {number} expenses - Dépenses annuelles estimées
 * @property {number} netOperatingIncome - Revenu net d'opération
 * @property {number} targetCashflowPerUnit - Cashflow mensuel par unité ciblé
 * @property {number} targetAnnualCashflow - Cashflow annuel total ciblé
 * @property {number} maxMortgagePayment - Paiement hypothécaire maximum
 * @property {number} maxPurchasePrice - Prix d'achat maximum recommandé
 */

/**
 * Pourcentage des dépenses en fonction du nombre d'unités
 * @const {Object}
 */
const EXPENSE_PERCENTAGES = {
  SMALL: { max: 2, percentage: 30 },      // 1-2 logements : 30% des revenus bruts
  MEDIUM: { max: 4, percentage: 35 },     // 3-4 logements : 35% des revenus bruts
  LARGE: { max: 6, percentage: 45 },      // 5-6 logements : 45% des revenus bruts
  XLARGE: { max: Infinity, percentage: 50 } // 7+ logements : 50% des revenus bruts
};

/**
 * Facteur HIGH-5 pour estimer les versements hypothécaires
 * Price × 0.005 = paiement mensuel hypothécaire
 * @const {number}
 */
const HIGH_5_FACTOR = 0.005;

/**
 * Seuils de rentabilité pour l'évaluation des projets MULTI (cashflow par unité par mois)
 * @const {Object}
 */
const PROFITABILITY_THRESHOLDS = {
  MINIMUM: 50,    // Cashflow minimum acceptable
  TARGET: 75,     // Cashflow cible
  EXCELLENT: 100  // Seuil pour un cashflow excellent
};

/**
 * Calcule la rentabilité d'un immeuble à revenus selon la méthode Napkin PAR
 * 
 * @param {MultiNapkinInput} input - Données d'entrée pour le calcul
 * @returns {MultiNapkinResult} - Résultats de l'analyse Napkin MULTI
 */
function calculateMultiNapkin(input) {
  // Validation des entrées
  validateInput(input);
  
  // Calcul du pourcentage des dépenses selon le nombre d'unités
  const expensePercentage = getExpensePercentage(input.units);
  
  // Calcul des dépenses annuelles
  const expenses = input.grossRevenue * (expensePercentage / 100);
  
  // Calcul du revenu net d'opération (RNO)
  const netOperatingIncome = input.grossRevenue - expenses;
  
  // Calcul du versement hypothécaire annuel (méthode HIGH-5)
  const mortgagePayment = input.price * HIGH_5_FACTOR * 12;
  
  // Calcul du cashflow annuel
  const cashflow = netOperatingIncome - mortgagePayment;
  
  // Calcul du cashflow mensuel par unité
  const cashflowPerUnit = cashflow / input.units / 12;
  
  // Déterminer si le projet est viable
  const isViable = cashflowPerUnit > 0;
  
  // Évaluation du projet
  const rating = getRating(cashflowPerUnit);
  
  // Générer une recommandation
  const recommendation = generateRecommendation(cashflowPerUnit, isViable);
  
  return {
    price: input.price,
    units: input.units,
    grossRevenue: input.grossRevenue,
    expensePercentage,
    expenses: roundToTwo(expenses),
    netOperatingIncome: roundToTwo(netOperatingIncome),
    mortgagePayment: roundToTwo(mortgagePayment),
    cashflow: roundToTwo(cashflow),
    cashflowPerUnit: roundToTwo(cashflowPerUnit),
    isViable,
    rating,
    recommendation
  };
}

/**
 * Calcule le prix d'achat maximum pour atteindre un cashflow cible par unité
 * 
 * @param {Object} params - Paramètres pour le calcul
 * @param {number} params.units - Nombre d'unités (appartements)
 * @param {number} params.grossRevenue - Revenus bruts annuels
 * @param {number} [params.targetCashflowPerUnit] - Cashflow mensuel par unité ciblé (par défaut: 75)
 * @returns {MaxPurchasePriceResult} - Résultats du calcul du prix d'achat maximum
 */
function calculateMaxPurchasePrice(params) {
  // Validation des paramètres
  if (!params.units || params.units <= 0 || !Number.isInteger(params.units)) {
    throw new Error("Le nombre d'unités doit être un entier positif");
  }
  
  if (!params.grossRevenue || params.grossRevenue <= 0) {
    throw new Error("Les revenus bruts doivent être un nombre positif");
  }
  
  // Utiliser le cashflow cible par défaut si non spécifié
  const targetCashflowPerUnit = params.targetCashflowPerUnit || PROFITABILITY_THRESHOLDS.TARGET;
  
  // Calcul du pourcentage des dépenses selon le nombre d'unités
  const expensePercentage = getExpensePercentage(params.units);
  
  // Calcul des dépenses annuelles
  const expenses = params.grossRevenue * (expensePercentage / 100);
  
  // Calcul du revenu net d'opération (RNO)
  const netOperatingIncome = params.grossRevenue - expenses;
  
  // Calcul du cashflow annuel ciblé
  const targetAnnualCashflow = targetCashflowPerUnit * params.units * 12;
  
  // Calcul du versement hypothécaire maximum possible
  const maxMortgagePayment = netOperatingIncome - targetAnnualCashflow;
  
  // Vérifier si le cashflow cible est atteignable
  if (maxMortgagePayment <= 0) {
    throw new Error("Impossible d'atteindre le cashflow cible avec ces revenus et dépenses. Augmentez les revenus ou réduisez le cashflow cible.");
  }
  
  // Calcul du prix d'achat maximum (formule inversée de HIGH-5)
  const maxPurchasePrice = maxMortgagePayment / 12 / HIGH_5_FACTOR;
  
  return {
    units: params.units,
    grossRevenue: params.grossRevenue,
    expensePercentage,
    expenses: roundToTwo(expenses),
    netOperatingIncome: roundToTwo(netOperatingIncome),
    targetCashflowPerUnit: targetCashflowPerUnit,
    targetAnnualCashflow: roundToTwo(targetAnnualCashflow),
    maxMortgagePayment: roundToTwo(maxMortgagePayment),
    maxPurchasePrice: roundToTwo(maxPurchasePrice)
  };
}

/**
 * Valide les entrées du calculateur Napkin MULTI
 * 
 * @param {MultiNapkinInput} input - Données d'entrée à valider
 * @throws {Error} Si les données sont invalides
 */
function validateInput(input) {
  if (!input) {
    throw new Error("Les données d'entrée sont requises");
  }
  
  if (!input.price || input.price <= 0) {
    throw new Error("Le prix d'achat doit être un nombre positif");
  }
  
  if (!input.units || input.units <= 0 || !Number.isInteger(input.units)) {
    throw new Error("Le nombre d'unités doit être un entier positif");
  }
  
  if (!input.grossRevenue || input.grossRevenue <= 0) {
    throw new Error("Les revenus bruts doivent être un nombre positif");
  }
  
  // Vérification de la cohérence des revenus par rapport au prix
  const minRevenueRatio = 0.04; // 4% minimum
  if (input.grossRevenue / input.price < minRevenueRatio) {
    throw new Error(`Les revenus bruts semblent trop faibles par rapport au prix d'achat. Le ratio minimum recommandé est de ${minRevenueRatio * 100}%.`);
  }
}

/**
 * Détermine le pourcentage des dépenses en fonction du nombre d'unités
 * 
 * @param {number} units - Nombre d'unités (appartements)
 * @returns {number} - Pourcentage des dépenses
 */
function getExpensePercentage(units) {
  if (units <= EXPENSE_PERCENTAGES.SMALL.max) {
    return EXPENSE_PERCENTAGES.SMALL.percentage;
  } else if (units <= EXPENSE_PERCENTAGES.MEDIUM.max) {
    return EXPENSE_PERCENTAGES.MEDIUM.percentage;
  } else if (units <= EXPENSE_PERCENTAGES.LARGE.max) {
    return EXPENSE_PERCENTAGES.LARGE.percentage;
  } else {
    return EXPENSE_PERCENTAGES.XLARGE.percentage;
  }
}

/**
 * Évalue la qualité du projet en fonction du cashflow par unité
 * 
 * @param {number} cashflowPerUnit - Cashflow mensuel par unité
 * @returns {string} - Évaluation (EXCELLENT, GOOD, ACCEPTABLE, POOR)
 */
function getRating(cashflowPerUnit) {
  if (cashflowPerUnit >= PROFITABILITY_THRESHOLDS.EXCELLENT) {
    return "EXCELLENT";
  } else if (cashflowPerUnit >= PROFITABILITY_THRESHOLDS.TARGET) {
    return "GOOD";
  } else if (cashflowPerUnit >= PROFITABILITY_THRESHOLDS.MINIMUM) {
    return "ACCEPTABLE";
  } else if (cashflowPerUnit > 0) {
    return "POOR";
  } else {
    return "NOT_VIABLE";
  }
}

/**
 * Génère une recommandation basée sur les résultats de l'analyse
 * 
 * @param {number} cashflowPerUnit - Cashflow mensuel par unité
 * @param {boolean} isViable - Indique si le projet est viable
 * @returns {string} - Recommandation
 */
function generateRecommendation(cashflowPerUnit, isViable) {
  if (!isViable) {
    return `Ce projet génère un cashflow négatif de ${cashflowPerUnit.toFixed(2)}$ par porte par mois. Il est fortement déconseillé d'investir à moins de pouvoir négocier un prix d'achat inférieur, augmenter les revenus ou réduire les dépenses.`;
  }
  
  if (cashflowPerUnit < PROFITABILITY_THRESHOLDS.MINIMUM) {
    return `Ce projet génère un cashflow de ${cashflowPerUnit.toFixed(2)}$ par porte par mois, ce qui est inférieur au seuil minimum recommandé de ${PROFITABILITY_THRESHOLDS.MINIMUM}$. Envisagez de négocier un meilleur prix ou d'optimiser les revenus et les dépenses.`;
  } else if (cashflowPerUnit < PROFITABILITY_THRESHOLDS.TARGET) {
    return `Ce projet est acceptable avec un cashflow de ${cashflowPerUnit.toFixed(2)}$ par porte par mois, mais reste sous le seuil cible de ${PROFITABILITY_THRESHOLDS.TARGET}$. Vérifiez si vous pouvez améliorer la rentabilité.`;
  } else if (cashflowPerUnit < PROFITABILITY_THRESHOLDS.EXCELLENT) {
    return `Ce projet est bon avec un cashflow de ${cashflowPerUnit.toFixed(2)}$ par porte par mois. Procédez à une analyse plus détaillée et évaluez les possibilités d'optimisation.`;
  } else {
    return `Ce projet est excellent avec un cashflow de ${cashflowPerUnit.toFixed(2)}$ par porte par mois. Fortement recommandé pour investissement si l'analyse détaillée confirme ces estimations.`;
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
  EXPENSE_PERCENTAGES,
  HIGH_5_FACTOR,
  PROFITABILITY_THRESHOLDS,
  calculateMultiNapkin,
  calculateMaxPurchasePrice
};
