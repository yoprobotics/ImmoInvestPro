/**
 * Calculateur Napkin pour les projets MULTI (PAR)
 * 
 * Ce module implémente la méthode rapide d'analyse de rentabilité
 * pour les projets de type MULTI (immeubles à revenus).
 * 
 * La méthode "PAR" est basée sur trois éléments clés:
 * - Prix d'achat (P)
 * - Appartements/nombre (A)
 * - Revenus bruts (R)
 */

/**
 * Ratios d'exploitation selon le nombre de logements
 * @const {Object}
 */
const EXPENSE_RATIOS = {
  VERY_SMALL: { min: 1, max: 2, ratio: 0.30 },  // 1-2 logements: 30% du revenu brut
  SMALL: { min: 3, max: 4, ratio: 0.35 },       // 3-4 logements: 35% du revenu brut
  MEDIUM: { min: 5, max: 6, ratio: 0.45 },      // 5-6 logements: 45% du revenu brut
  LARGE: { min: 7, max: 999, ratio: 0.50 }      // 7+ logements: 50% du revenu brut
};

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
 * Structure des entrées du calculateur Napkin MULTI
 * @typedef {Object} NapkinMultiInput
 * @property {number} purchasePrice - Prix d'achat de l'immeuble
 * @property {number} units - Nombre d'unités (portes)
 * @property {number} grossRevenue - Revenus bruts annuels
 */

/**
 * Structure des résultats du calculateur Napkin MULTI
 * @typedef {Object} NapkinMultiResult
 * @property {number} netOperatingIncome - Revenu net d'exploitation (RNE)
 * @property {number} mortgagePayment - Paiement hypothécaire annuel
 * @property {number} cashflow - Liquidité annuelle
 * @property {number} cashflowPerUnit - Liquidité par porte par mois
 * @property {number} capRate - Taux de capitalisation (%)
 * @property {boolean} isViable - Indique si le projet est viable
 * @property {string} rating - Évaluation du projet (EXCELLENT, GOOD, ACCEPTABLE, POOR)
 * @property {string} recommendation - Recommandation basée sur l'analyse
 * @property {Object} breakdown - Détail des calculs
 */

/**
 * Calcule la rentabilité d'un projet MULTI avec la méthode Napkin (PAR)
 * @param {NapkinMultiInput} input - Données d'entrée pour le calcul
 * @returns {NapkinMultiResult} - Résultats de l'analyse
 */
function calculateNapkinMulti(input) {
  // Validation des entrées
  validateInput(input);
  
  // Extraction des valeurs
  const { purchasePrice, units, grossRevenue } = input;
  
  // Déterminer le ratio d'exploitation selon le nombre de logements
  const expenseRatio = getExpenseRatio(units);
  
  // Calcul des dépenses d'exploitation
  const operatingExpenses = grossRevenue * expenseRatio;
  
  // Calcul du revenu net d'exploitation (RNE)
  const netOperatingIncome = grossRevenue - operatingExpenses;
  
  // Calcul du paiement hypothécaire approximatif (méthode HIGH-5)
  const mortgagePayment = purchasePrice * 0.005 * 12;
  
  // Calcul du cashflow
  const cashflow = netOperatingIncome - mortgagePayment;
  
  // Calcul du cashflow par porte par mois
  const cashflowPerUnit = cashflow / units / 12;
  
  // Calcul du taux de capitalisation
  const capRate = (netOperatingIncome / purchasePrice) * 100;
  
  // Déterminer si le projet est viable
  const isViable = cashflowPerUnit >= PROFITABILITY_THRESHOLDS.MINIMUM;
  
  // Évaluation du projet
  const rating = getRating(cashflowPerUnit);
  
  // Générer une recommandation
  const recommendation = generateRecommendation(cashflowPerUnit, capRate, isViable);
  
  // Retourner les résultats
  return {
    netOperatingIncome: Math.round(netOperatingIncome * 100) / 100,
    mortgagePayment: Math.round(mortgagePayment * 100) / 100,
    cashflow: Math.round(cashflow * 100) / 100,
    cashflowPerUnit: Math.round(cashflowPerUnit * 100) / 100,
    capRate: Math.round(capRate * 100) / 100,
    isViable,
    rating,
    recommendation,
    breakdown: {
      purchasePrice,
      units,
      grossRevenue,
      operatingExpenses: Math.round(operatingExpenses * 100) / 100,
      expenseRatio: Math.round(expenseRatio * 100) / 100,
      netOperatingIncome: Math.round(netOperatingIncome * 100) / 100,
      mortgagePayment: Math.round(mortgagePayment * 100) / 100,
      cashflow: Math.round(cashflow * 100) / 100,
      cashflowPerUnit: Math.round(cashflowPerUnit * 100) / 100
    }
  };
}

/**
 * Calcule le prix d'achat maximum pour atteindre un cashflow cible par porte
 * @param {Object} params - Paramètres pour le calcul
 * @param {number} params.units - Nombre d'unités (portes)
 * @param {number} params.grossRevenue - Revenus bruts annuels
 * @param {number} params.targetCashflowPerUnit - Cashflow cible par porte par mois (par défaut: 75)
 * @returns {number} - Prix d'achat maximum recommandé
 */
function calculateMaxPurchasePrice(params) {
  // Validation des entrées
  if (!params.units || params.units <= 0 || !Number.isInteger(params.units)) {
    throw new Error("Le nombre d'unités doit être un entier positif");
  }
  
  if (!params.grossRevenue || params.grossRevenue <= 0) {
    throw new Error("Les revenus bruts doivent être un nombre positif");
  }
  
  const targetCashflowPerUnit = params.targetCashflowPerUnit || PROFITABILITY_THRESHOLDS.TARGET;
  
  if (targetCashflowPerUnit <= 0) {
    throw new Error("Le cashflow cible par porte doit être un nombre positif");
  }
  
  // Déterminer le ratio d'exploitation selon le nombre de logements
  const expenseRatio = getExpenseRatio(params.units);
  
  // Calcul des dépenses d'exploitation
  const operatingExpenses = params.grossRevenue * expenseRatio;
  
  // Calcul du revenu net d'exploitation (RNE)
  const netOperatingIncome = params.grossRevenue - operatingExpenses;
  
  // Calcul du cashflow annuel cible
  const targetAnnualCashflow = targetCashflowPerUnit * params.units * 12;
  
  // Calcul du paiement hypothécaire maximum
  const maxMortgagePayment = netOperatingIncome - targetAnnualCashflow;
  
  // Vérifier si le paiement hypothécaire maximum est cohérent
  if (maxMortgagePayment <= 0) {
    throw new Error("Impossible d'atteindre le cashflow cible avec ces paramètres. Réduisez le cashflow cible ou augmentez les revenus bruts.");
  }
  
  // Calcul du prix d'achat maximum (méthode HIGH-5 inversée)
  const maxPurchasePrice = maxMortgagePayment / (0.005 * 12);
  
  return Math.round(maxPurchasePrice * 100) / 100;
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
 * Détermine le ratio d'exploitation selon le nombre de logements
 * @param {number} units - Nombre d'unités
 * @returns {number} - Ratio d'exploitation
 */
function getExpenseRatio(units) {
  if (units >= EXPENSE_RATIOS.VERY_SMALL.min && units <= EXPENSE_RATIOS.VERY_SMALL.max) {
    return EXPENSE_RATIOS.VERY_SMALL.ratio;
  } else if (units >= EXPENSE_RATIOS.SMALL.min && units <= EXPENSE_RATIOS.SMALL.max) {
    return EXPENSE_RATIOS.SMALL.ratio;
  } else if (units >= EXPENSE_RATIOS.MEDIUM.min && units <= EXPENSE_RATIOS.MEDIUM.max) {
    return EXPENSE_RATIOS.MEDIUM.ratio;
  } else {
    return EXPENSE_RATIOS.LARGE.ratio;
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
      return "Ce projet générera un cashflow négatif. Il est fortement déconseillé d'investir à moins de pouvoir négocier un prix d'achat plus bas ou d'optimiser les revenus.";
    } else {
      return `Ce projet génère un cashflow de ${cashflowPerUnit.toFixed(2)}$ par porte par mois, ce qui est inférieur au seuil minimum recommandé de ${PROFITABILITY_THRESHOLDS.MINIMUM}$. Envisagez de négocier un meilleur prix ou d'optimiser les revenus.`;
    }
  }
  
  if (cashflowPerUnit < PROFITABILITY_THRESHOLDS.TARGET) {
    return `Ce projet est acceptable avec un cashflow de ${cashflowPerUnit.toFixed(2)}$ par porte par mois, mais reste sous le seuil cible de ${PROFITABILITY_THRESHOLDS.TARGET}$. Le taux de capitalisation est de ${capRate.toFixed(2)}%. Vérifiez si vous pouvez améliorer la rentabilité.`;
  } else if (cashflowPerUnit < PROFITABILITY_THRESHOLDS.EXCELLENT) {
    return `Ce projet est bon avec un cashflow de ${cashflowPerUnit.toFixed(2)}$ par porte par mois et un taux de capitalisation de ${capRate.toFixed(2)}%. Procédez à une analyse plus détaillée.`;
  } else {
    return `Ce projet est excellent avec un cashflow de ${cashflowPerUnit.toFixed(2)}$ par porte par mois et un taux de capitalisation de ${capRate.toFixed(2)}%. Fortement recommandé pour investissement.`;
  }
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
    purchasePrice: scenarios.purchasePrice || [-5, 0, 5],  // % de variation du prix d'achat
    grossRevenue: scenarios.grossRevenue || [-5, 0, 5],    // % de variation des revenus bruts
  };
  
  const results = {
    baseCase: calculateNapkinMulti(baseInput),
    scenarios: []
  };
  
  // Analyse pour le prix d'achat
  variationScenarios.purchasePrice.forEach(purchasePriceVar => {
    if (purchasePriceVar === 0) return; // Ignorer le cas de base
    
    const newPurchasePrice = baseInput.purchasePrice * (1 + purchasePriceVar / 100);
    const scenario = {
      name: `Prix d'achat ${purchasePriceVar > 0 ? '+' : ''}${purchasePriceVar}%`,
      input: { ...baseInput, purchasePrice: newPurchasePrice },
      result: calculateNapkinMulti({ ...baseInput, purchasePrice: newPurchasePrice })
    };
    
    results.scenarios.push(scenario);
  });
  
  // Analyse pour les revenus bruts
  variationScenarios.grossRevenue.forEach(grossRevenueVar => {
    if (grossRevenueVar === 0) return; // Ignorer le cas de base
    
    const newGrossRevenue = baseInput.grossRevenue * (1 + grossRevenueVar / 100);
    const scenario = {
      name: `Revenus bruts ${grossRevenueVar > 0 ? '+' : ''}${grossRevenueVar}%`,
      input: { ...baseInput, grossRevenue: newGrossRevenue },
      result: calculateNapkinMulti({ ...baseInput, grossRevenue: newGrossRevenue })
    };
    
    results.scenarios.push(scenario);
  });
  
  // Trier les scénarios par cashflow par porte décroissant
  results.scenarios.sort((a, b) => b.result.cashflowPerUnit - a.result.cashflowPerUnit);
  
  return results;
}

module.exports = {
  EXPENSE_RATIOS,
  PROFITABILITY_THRESHOLDS,
  calculateNapkinMulti,
  calculateMaxPurchasePrice,
  performSensitivityAnalysis
};
