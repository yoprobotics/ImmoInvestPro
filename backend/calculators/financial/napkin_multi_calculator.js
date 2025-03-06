/**
 * Calculateur Napkin MULTI
 * 
 * Ce module implémente le calculateur Napkin MULTI selon la méthode PAR des Secrets de l'Immobilier.
 * Il permet d'évaluer rapidement la rentabilité d'un projet d'immeuble à revenus.
 */

/**
 * Structure des entrées du calculateur Napkin MULTI
 * @typedef {Object} NapkinMultiInput
 * @property {number} purchasePrice - Prix d'achat de l'immeuble
 * @property {number} units - Nombre d'appartements (portes)
 * @property {number} grossRevenue - Revenus bruts annuels
 */

/**
 * Structure des résultats du calculateur Napkin MULTI
 * @typedef {Object} NapkinMultiResult
 * @property {number} grossRevenue - Revenus bruts annuels
 * @property {number} expenses - Dépenses totales estimées
 * @property {number} noi - Revenu net d'exploitation (NOI)
 * @property {number} financing - Paiements hypothécaires annuels (méthode HIGH-5)
 * @property {number} cashflow - Liquidité annuelle
 * @property {number} cashflowPerUnit - Liquidité par porte par mois
 * @property {boolean} isViable - Indique si le projet est viable (cashflow minimum par porte atteint)
 * @property {string} rating - Évaluation du projet (EXCELLENT, GOOD, ACCEPTABLE, POOR)
 * @property {string} recommendation - Recommandation basée sur l'analyse
 */

/**
 * Seuils de rentabilité par porte pour un projet MULTI
 * @const {Object}
 */
const PROFITABILITY_THRESHOLDS_MULTI = {
  MINIMUM: 50,   // Seuil minimum acceptable pour un cashflow par porte ($/mois)
  TARGET: 75,    // Seuil cible pour un bon cashflow par porte ($/mois)
  EXCELLENT: 100 // Seuil excellent pour un cashflow par porte ($/mois)
};

/**
 * Ratio de dépenses par rapport aux revenus bruts selon le nombre d'unités
 * @const {Object}
 */
const EXPENSE_RATIOS = {
  SMALL: 0.30,  // 1-2 logements = 30% des revenus bruts
  MEDIUM: 0.35, // 3-4 logements = 35% des revenus bruts
  LARGE: 0.45,  // 5-6 logements = 45% des revenus bruts
  XLARGE: 0.50  // 7+ logements = 50% des revenus bruts
};

/**
 * Calcule rapidement la rentabilité d'un projet MULTI selon la méthode PAR et HIGH-5
 * @param {NapkinMultiInput} input - Données d'entrée pour le calcul
 * @returns {NapkinMultiResult} - Résultats de l'analyse
 */
function calculateNapkinMulti(input) {
  // Validation des entrées
  validateInput(input);
  
  // Extraction des valeurs
  const { purchasePrice, units, grossRevenue } = input;
  
  // Calcul des dépenses selon le nombre d'unités
  const expenseRatio = getExpenseRatio(units);
  const expenses = grossRevenue * expenseRatio;
  
  // Calcul du revenu net d'exploitation (NOI)
  const noi = grossRevenue - expenses;
  
  // Calcul du paiement hypothécaire avec la méthode HIGH-5
  const financing = purchasePrice * 0.005 * 12; // 0.5% du prix d'achat par mois * 12 mois
  
  // Calcul du cashflow
  const cashflow = noi - financing;
  
  // Calcul du cashflow par porte par mois
  const cashflowPerUnit = cashflow / units / 12;
  
  // Déterminer si le projet est viable
  const isViable = cashflow > 0 && cashflowPerUnit >= PROFITABILITY_THRESHOLDS_MULTI.MINIMUM;
  
  // Évaluation du projet
  const rating = getRating(cashflowPerUnit);
  
  // Générer une recommandation
  const recommendation = generateRecommendation(cashflowPerUnit, isViable);
  
  // Retourner les résultats
  return {
    grossRevenue: roundToTwo(grossRevenue),
    expenses: roundToTwo(expenses),
    noi: roundToTwo(noi),
    financing: roundToTwo(financing),
    cashflow: roundToTwo(cashflow),
    cashflowPerUnit: roundToTwo(cashflowPerUnit),
    expenseRatio: roundToTwo(expenseRatio * 100), // Convertir en pourcentage
    isViable,
    rating,
    recommendation,
    breakdown: {
      purchasePrice: purchasePrice,
      units: units,
      grossRevenue: grossRevenue,
      expenses: roundToTwo(expenses),
      noi: roundToTwo(noi),
      financing: roundToTwo(financing),
      cashflow: roundToTwo(cashflow),
      cashflowPerUnit: roundToTwo(cashflowPerUnit)
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
  
  if (input.purchasePrice === undefined || input.purchasePrice <= 0) {
    throw new Error("Le prix d'achat doit être un nombre positif");
  }
  
  if (!input.units || input.units <= 0 || !Number.isInteger(input.units)) {
    throw new Error("Le nombre d'unités doit être un entier positif");
  }
  
  if (input.grossRevenue === undefined || input.grossRevenue <= 0) {
    throw new Error("Les revenus bruts doivent être un nombre positif");
  }
}

/**
 * Détermine le ratio de dépenses en fonction du nombre d'unités
 * @param {number} units - Nombre d'unités (portes)
 * @returns {number} - Ratio de dépenses
 */
function getExpenseRatio(units) {
  if (units <= 2) {
    return EXPENSE_RATIOS.SMALL;
  } else if (units <= 4) {
    return EXPENSE_RATIOS.MEDIUM;
  } else if (units <= 6) {
    return EXPENSE_RATIOS.LARGE;
  } else {
    return EXPENSE_RATIOS.XLARGE;
  }
}

/**
 * Évalue la qualité du projet en fonction du cashflow par porte
 * @param {number} cashflowPerUnit - Cashflow par porte par mois
 * @returns {string} - Évaluation (EXCELLENT, GOOD, ACCEPTABLE, POOR)
 */
function getRating(cashflowPerUnit) {
  if (cashflowPerUnit >= PROFITABILITY_THRESHOLDS_MULTI.EXCELLENT) {
    return "EXCELLENT";
  } else if (cashflowPerUnit >= PROFITABILITY_THRESHOLDS_MULTI.TARGET) {
    return "GOOD";
  } else if (cashflowPerUnit >= PROFITABILITY_THRESHOLDS_MULTI.MINIMUM) {
    return "ACCEPTABLE";
  } else {
    return "POOR";
  }
}

/**
 * Génère une recommandation basée sur les résultats de l'analyse
 * @param {number} cashflowPerUnit - Cashflow par porte par mois
 * @param {boolean} isViable - Indique si le projet est viable
 * @returns {string} - Recommandation
 */
function generateRecommendation(cashflowPerUnit, isViable) {
  if (!isViable) {
    if (cashflowPerUnit <= 0) {
      return "Ce projet générera un cashflow négatif. Il est fortement déconseillé d'investir à moins de pouvoir négocier un prix d'achat plus bas, optimiser les revenus ou réduire les dépenses.";
    } else {
      return `Ce projet génère un cashflow de ${cashflowPerUnit.toFixed(2)}$ par porte par mois, ce qui est inférieur au seuil minimum recommandé de ${PROFITABILITY_THRESHOLDS_MULTI.MINIMUM}$. Envisagez de négocier un meilleur prix ou d'optimiser la structure de revenus et dépenses.`;
    }
  }
  
  if (cashflowPerUnit < PROFITABILITY_THRESHOLDS_MULTI.TARGET) {
    return `Ce projet est acceptable avec un cashflow de ${cashflowPerUnit.toFixed(2)}$ par porte par mois, mais reste sous le seuil cible de ${PROFITABILITY_THRESHOLDS_MULTI.TARGET}$. Vérifiez si vous pouvez améliorer la rentabilité.`;
  } else if (cashflowPerUnit < PROFITABILITY_THRESHOLDS_MULTI.EXCELLENT) {
    return `Ce projet est bon avec un cashflow de ${cashflowPerUnit.toFixed(2)}$ par porte par mois. Procédez à une analyse plus détaillée et évaluez les possibilités d'optimisation.`;
  } else {
    return `Ce projet est excellent avec un cashflow de ${cashflowPerUnit.toFixed(2)}$ par porte par mois. Fortement recommandé pour investissement.`;
  }
}

/**
 * Calcule le prix d'achat maximum pour atteindre un cashflow cible par porte
 * @param {Object} params - Paramètres pour le calcul
 * @param {number} params.units - Nombre d'unités (portes)
 * @param {number} params.grossRevenue - Revenus bruts annuels
 * @param {number} [params.targetCashflowPerUnit] - Cashflow cible par porte par mois (par défaut: 75)
 * @returns {Object} - Résultats du calcul
 */
function calculateMaxPurchasePrice(params) {
  // Validation des entrées
  if (!params) {
    throw new Error("Les paramètres sont requis");
  }
  
  if (!params.units || params.units <= 0 || !Number.isInteger(params.units)) {
    throw new Error("Le nombre d'unités doit être un entier positif");
  }
  
  if (params.grossRevenue === undefined || params.grossRevenue <= 0) {
    throw new Error("Les revenus bruts doivent être un nombre positif");
  }
  
  const targetCashflowPerUnit = params.targetCashflowPerUnit || PROFITABILITY_THRESHOLDS_MULTI.TARGET;
  
  // Cashflow annuel cible
  const targetAnnualCashflow = targetCashflowPerUnit * params.units * 12;
  
  // Calcul des dépenses selon le nombre d'unités
  const expenseRatio = getExpenseRatio(params.units);
  const expenses = params.grossRevenue * expenseRatio;
  
  // Revenu net d'exploitation (NOI)
  const noi = params.grossRevenue - expenses;
  
  // Paiement hypothécaire maximum possible
  const maxMortgagePayment = noi - targetAnnualCashflow;
  
  // Vérifier si le paiement hypothécaire maximum est cohérent
  if (maxMortgagePayment <= 0) {
    throw new Error("Impossible d'atteindre le cashflow cible avec ces paramètres. Réduisez le cashflow cible, augmentez les revenus ou réduisez les dépenses.");
  }
  
  // Calcul du prix d'achat maximum avec la méthode HIGH-5 inversée
  const maxPurchasePrice = maxMortgagePayment / (0.005 * 12);
  
  return {
    maxPurchasePrice: roundToTwo(maxPurchasePrice),
    units: params.units,
    grossRevenue: params.grossRevenue,
    expenses: roundToTwo(expenses),
    noi: roundToTwo(noi),
    maxMortgagePayment: roundToTwo(maxMortgagePayment),
    targetCashflow: roundToTwo(targetAnnualCashflow),
    targetCashflowPerUnit: roundToTwo(targetCashflowPerUnit)
  };
}

/**
 * Analyse la sensibilité du cashflow en fonction de différents scénarios
 * @param {NapkinMultiInput} baseInput - Données d'entrée de base
 * @param {Object} scenarios - Pourcentages de variation pour chaque paramètre
 * @returns {Object} - Résultats de l'analyse de sensibilité
 */
function performSensitivityAnalysis(baseInput, scenarios = {}) {
  // Scénarios par défaut si non spécifiés
  const variationScenarios = {
    purchasePrice: scenarios.purchasePrice || [-5, 0, 5],    // % de variation du prix d'achat
    grossRevenue: scenarios.grossRevenue || [-5, 0, 5]      // % de variation des revenus bruts
  };
  
  const results = {
    baseCase: calculateNapkinMulti(baseInput),
    scenarios: []
  };
  
  // ----- ANALYSE POUR LE PRIX D'ACHAT -----
  variationScenarios.purchasePrice.forEach(purchasePriceVar => {
    if (purchasePriceVar === 0) return; // Ignorer le cas de base
    
    const newPurchasePrice = baseInput.purchasePrice * (1 + purchasePriceVar / 100);
    
    const newInput = {
      ...baseInput,
      purchasePrice: newPurchasePrice
    };
    
    const scenario = {
      name: `Prix d'achat ${purchasePriceVar > 0 ? '+' : ''}${purchasePriceVar}%`,
      input: newInput,
      result: calculateNapkinMulti(newInput)
    };
    
    results.scenarios.push(scenario);
  });
  
  // ----- ANALYSE POUR LES REVENUS BRUTS -----
  variationScenarios.grossRevenue.forEach(grossRevenueVar => {
    if (grossRevenueVar === 0) return; // Ignorer le cas de base
    
    const newGrossRevenue = baseInput.grossRevenue * (1 + grossRevenueVar / 100);
    
    const newInput = {
      ...baseInput,
      grossRevenue: newGrossRevenue
    };
    
    const scenario = {
      name: `Revenus bruts ${grossRevenueVar > 0 ? '+' : ''}${grossRevenueVar}%`,
      input: newInput,
      result: calculateNapkinMulti(newInput)
    };
    
    results.scenarios.push(scenario);
  });
  
  // Trier les scénarios par cashflow par porte décroissant
  results.scenarios.sort((a, b) => b.result.cashflowPerUnit - a.result.cashflowPerUnit);
  
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
  PROFITABILITY_THRESHOLDS_MULTI,
  EXPENSE_RATIOS,
  calculateNapkinMulti,
  calculateMaxPurchasePrice,
  performSensitivityAnalysis
};
