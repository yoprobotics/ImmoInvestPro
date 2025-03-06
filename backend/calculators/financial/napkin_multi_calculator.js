/**
 * Calculateur Napkin MULTI - Méthode PAR + HIGH-5
 * 
 * Ce module implémente le calculateur rapide (Napkin) pour les immeubles à revenus
 * selon la méthodologie des Secrets de l'Immobilier.
 * Il utilise la méthode PAR (Prix-Appartements-Revenus) et HIGH-5 pour estimer rapidement
 * la liquidité mensuelle par porte.
 */

/**
 * Structure des entrées du calculateur Napkin MULTI
 * @typedef {Object} NapkinMultiInput
 * @property {number} purchasePrice - Prix d'achat de l'immeuble (P)
 * @property {number} units - Nombre d'appartements/portes (A)
 * @property {number} grossRevenue - Revenus bruts annuels (R)
 */

/**
 * Structure des résultats du calculateur Napkin MULTI
 * @typedef {Object} NapkinMultiResult
 * @property {number} netOperatingIncome - Revenu net d'exploitation (RNE)
 * @property {number} annualExpenses - Dépenses annuelles estimées
 * @property {number} expenseRatio - Ratio des dépenses sur les revenus bruts (%)
 * @property {number} annualMortgagePayment - Paiement hypothécaire annuel estimé (méthode HIGH-5)
 * @property {number} annualCashflow - Liquidité annuelle estimée
 * @property {number} monthlyCashflowPerUnit - Liquidité mensuelle par porte
 * @property {boolean} isViable - Indique si le projet est viable (cashflow positif et suffisant)
 * @property {string} rating - Évaluation du projet (EXCELLENT, GOOD, ACCEPTABLE, POOR)
 * @property {string} recommendation - Recommandation basée sur l'analyse
 */

/**
 * Structure pour les résultats du calcul d'offre optimale
 * @typedef {Object} OptimalOfferResult
 * @property {number} optimalOffer - Prix d'offre optimal pour atteindre le cashflow cible
 * @property {number} targetCashflowPerUnit - Cashflow cible par porte par mois utilisé pour le calcul
 * @property {number} calculatedCashflowPerUnit - Cashflow par porte par mois calculé
 * @property {boolean} isPossible - Indique si l'offre est possible (montant positif)
 */

/**
 * Seuils de cashflow par porte pour évaluer la viabilité d'un projet MULTI
 * @const {Object}
 */
const CASHFLOW_THRESHOLDS = {
  MINIMUM: 50,   // Seuil minimum acceptable pour un cashflow par porte ($/mois)
  TARGET: 75,    // Seuil cible pour un bon cashflow par porte ($/mois)
  EXCELLENT: 100 // Seuil excellent pour un cashflow par porte ($/mois)
};

/**
 * Ratios de dépenses en fonction du nombre d'unités
 * @const {Object}
 */
const EXPENSE_RATIOS = {
  SMALL: 30,    // 1-2 logements = 30% du revenu brut
  MEDIUM: 35,   // 3-4 logements = 35% du revenu brut
  LARGE: 45,    // 5-6 logements = 45% du revenu brut
  XLARGE: 50    // 7+ logements = 50% du revenu brut
};

/**
 * Calcule la liquidité d'un projet MULTI en utilisant la méthode PAR + HIGH-5
 * @param {NapkinMultiInput} input - Les paramètres d'entrée pour le calcul
 * @returns {NapkinMultiResult} - Les résultats de l'analyse
 */
function calculateNapkinMulti(input) {
  // Validation des entrées
  validateInput(input);
  
  // Extraire les valeurs
  const purchasePrice = input.purchasePrice;
  const units = input.units;
  const grossRevenue = input.grossRevenue;
  
  // Déterminer le ratio de dépenses en fonction du nombre d'unités
  const expenseRatio = getExpenseRatio(units);
  
  // Calcul des dépenses
  const annualExpenses = grossRevenue * (expenseRatio / 100);
  
  // Calcul du revenu net d'exploitation (RNE)
  const netOperatingIncome = grossRevenue - annualExpenses;
  
  // Calcul du paiement hypothécaire avec la méthode HIGH-5
  const annualMortgagePayment = purchasePrice * 0.005 * 12; // 0.5% par mois
  
  // Calcul de la liquidité
  const annualCashflow = netOperatingIncome - annualMortgagePayment;
  const monthlyCashflowPerUnit = annualCashflow / units / 12;
  
  // Évaluation du projet
  const isViable = monthlyCashflowPerUnit >= CASHFLOW_THRESHOLDS.MINIMUM;
  const rating = getRating(monthlyCashflowPerUnit);
  const recommendation = generateRecommendation(monthlyCashflowPerUnit, expenseRatio, units);
  
  return {
    netOperatingIncome: roundToTwo(netOperatingIncome),
    annualExpenses: roundToTwo(annualExpenses),
    expenseRatio: roundToTwo(expenseRatio),
    annualMortgagePayment: roundToTwo(annualMortgagePayment),
    annualCashflow: roundToTwo(annualCashflow),
    monthlyCashflowPerUnit: roundToTwo(monthlyCashflowPerUnit),
    isViable,
    rating,
    recommendation
  };
}

/**
 * Calcule le prix d'offre optimal pour atteindre un cashflow cible par porte
 * @param {Object} params - Les paramètres pour le calcul
 * @param {number} params.units - Nombre d'appartements/portes
 * @param {number} params.grossRevenue - Revenus bruts annuels
 * @param {number} [params.targetCashflowPerUnit=75] - Cashflow cible par porte par mois (par défaut: 75$)
 * @returns {OptimalOfferResult} - Les résultats du calcul d'offre optimale
 */
function calculateOptimalOffer(params) {
  // Validation des paramètres
  if (!params.units || params.units <= 0 || !Number.isInteger(params.units)) {
    throw new Error("Le nombre d'unités doit être un entier positif");
  }
  
  if (!params.grossRevenue || params.grossRevenue <= 0) {
    throw new Error("Les revenus bruts doivent être un nombre positif");
  }
  
  // Extraire les valeurs avec valeurs par défaut si nécessaire
  const units = params.units;
  const grossRevenue = params.grossRevenue;
  const targetCashflowPerUnit = params.targetCashflowPerUnit || CASHFLOW_THRESHOLDS.TARGET;
  
  // Déterminer le ratio de dépenses en fonction du nombre d'unités
  const expenseRatio = getExpenseRatio(units);
  
  // Calcul des dépenses
  const annualExpenses = grossRevenue * (expenseRatio / 100);
  
  // Calcul du revenu net d'exploitation (RNE)
  const netOperatingIncome = grossRevenue - annualExpenses;
  
  // Calcul de la liquidité annuelle cible
  const targetAnnualCashflow = targetCashflowPerUnit * units * 12;
  
  // Calcul du paiement hypothécaire maximum possible
  const maxMortgagePayment = netOperatingIncome - targetAnnualCashflow;
  
  // Vérifier si le paiement hypothécaire maximum est cohérent
  if (maxMortgagePayment <= 0) {
    return {
      optimalOffer: 0,
      targetCashflowPerUnit: targetCashflowPerUnit,
      calculatedCashflowPerUnit: 0,
      isPossible: false
    };
  }
  
  // Méthode HIGH-5 inversée
  const optimalOffer = maxMortgagePayment / (0.005 * 12);
  
  // Vérifier les résultats avec le calculateur direct
  const verification = calculateNapkinMulti({
    purchasePrice: optimalOffer,
    units: units,
    grossRevenue: grossRevenue
  });
  
  return {
    optimalOffer: roundToTwo(optimalOffer),
    targetCashflowPerUnit: roundToTwo(targetCashflowPerUnit),
    calculatedCashflowPerUnit: roundToTwo(verification.monthlyCashflowPerUnit),
    isPossible: true
  };
}

/**
 * Détermine le ratio de dépenses en fonction du nombre d'unités
 * @param {number} units - Nombre d'unités dans l'immeuble
 * @returns {number} - Ratio de dépenses en pourcentage
 */
function getExpenseRatio(units) {
  if (units <= 2) {
    return EXPENSE_RATIOS.SMALL;  // 30%
  } else if (units <= 4) {
    return EXPENSE_RATIOS.MEDIUM; // 35%
  } else if (units <= 6) {
    return EXPENSE_RATIOS.LARGE;  // 45%
  } else {
    return EXPENSE_RATIOS.XLARGE; // 50%
  }
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
    throw new Error("Le prix d'achat doit être un nombre positif");
  }
  
  if (!input.units || input.units <= 0 || !Number.isInteger(input.units)) {
    throw new Error("Le nombre d'unités doit être un entier positif");
  }
  
  if (!input.grossRevenue || input.grossRevenue <= 0) {
    throw new Error("Les revenus bruts doivent être un nombre positif");
  }
}

/**
 * Évalue la qualité du projet en fonction du cashflow par porte
 * @param {number} cashflowPerUnit - Cashflow par porte par mois
 * @returns {string} - Évaluation (EXCELLENT, GOOD, ACCEPTABLE, POOR)
 */
function getRating(cashflowPerUnit) {
  if (cashflowPerUnit >= CASHFLOW_THRESHOLDS.EXCELLENT) {
    return "EXCELLENT";
  } else if (cashflowPerUnit >= CASHFLOW_THRESHOLDS.TARGET) {
    return "GOOD";
  } else if (cashflowPerUnit >= CASHFLOW_THRESHOLDS.MINIMUM) {
    return "ACCEPTABLE";
  } else {
    return "POOR";
  }
}

/**
 * Génère une recommandation basée sur les résultats de l'analyse
 * @param {number} cashflowPerUnit - Cashflow par porte par mois
 * @param {number} expenseRatio - Ratio des dépenses (%)
 * @param {number} units - Nombre d'unités
 * @returns {string} - Recommandation
 */
function generateRecommendation(cashflowPerUnit, expenseRatio, units) {
  if (cashflowPerUnit <= 0) {
    return `Ce projet générera un cashflow négatif. Il est fortement déconseillé d'investir à moins de pouvoir négocier un prix d'achat plus bas, optimiser les revenus ou réduire les dépenses.`;
  }
  
  if (cashflowPerUnit < CASHFLOW_THRESHOLDS.MINIMUM) {
    return `Ce projet génère un cashflow de ${cashflowPerUnit.toFixed(2)}$ par porte par mois, ce qui est inférieur au seuil minimum recommandé de ${CASHFLOW_THRESHOLDS.MINIMUM}$. Envisagez de négocier un meilleur prix ou d'optimiser la structure de revenus et dépenses.`;
  }
  
  if (cashflowPerUnit < CASHFLOW_THRESHOLDS.TARGET) {
    return `Ce projet est acceptable avec un cashflow de ${cashflowPerUnit.toFixed(2)}$ par porte par mois, mais reste sous le seuil cible de ${CASHFLOW_THRESHOLDS.TARGET}$. Vérifiez si vous pouvez améliorer la rentabilité en optimisant les revenus ou en réduisant les dépenses.`;
  }
  
  if (cashflowPerUnit < CASHFLOW_THRESHOLDS.EXCELLENT) {
    return `Ce projet est bon avec un cashflow de ${cashflowPerUnit.toFixed(2)}$ par porte par mois. Procédez à une analyse plus détaillée et évaluez les possibilités d'optimisation des revenus et des dépenses.`;
  }
  
  return `Ce projet est excellent avec un cashflow de ${cashflowPerUnit.toFixed(2)}$ par porte par mois. Fortement recommandé pour investissement, sous réserve d'une vérification diligente approfondie.`;
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
  CASHFLOW_THRESHOLDS,
  EXPENSE_RATIOS,
  calculateNapkinMulti,
  calculateOptimalOffer
};
