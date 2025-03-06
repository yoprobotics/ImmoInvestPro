/**
 * Calculateur Napkin
 * 
 * Ce module implémente les calculateurs rapides selon la méthode des Secrets de l'Immobilier.
 * Il permet d'évaluer rapidement la rentabilité d'un projet immobilier avec très peu de données.
 * 
 * Deux méthodes principales:
 * 1. Napkin FLIP (FIP10) - Pour les projets de type achat-revente (flip)
 * 2. Napkin MULTI (PAR + HIGH-5) - Pour les immeubles à revenus
 */

/**
 * Structure des entrées pour le calculateur Napkin FLIP
 * @typedef {Object} NapkinFlipInput
 * @property {number} finalPrice - Prix final (valeur de revente estimée)
 * @property {number} initialPrice - Prix initial (prix d'achat)
 * @property {number} renovationCost - Coût des rénovations
 */

/**
 * Structure des résultats pour le calculateur Napkin FLIP
 * @typedef {Object} NapkinFlipResult
 * @property {number} profit - Profit net estimé
 * @property {boolean} isViable - Indique si le projet est viable (profit >= seuil minimum)
 * @property {string} rating - Évaluation du projet (EXCELLENT, GOOD, ACCEPTABLE, POOR)
 * @property {string} recommendation - Recommandation basée sur l'analyse
 */

/**
 * Structure des entrées pour le calculateur Napkin MULTI
 * @typedef {Object} NapkinMultiInput
 * @property {number} purchasePrice - Prix d'achat
 * @property {number} units - Nombre d'unités (portes)
 * @property {number} grossRevenue - Revenus bruts annuels
 */

/**
 * Structure des résultats pour le calculateur Napkin MULTI
 * @typedef {Object} NapkinMultiResult
 * @property {number} cashflow - Liquidité annuelle
 * @property {number} cashflowPerUnit - Liquidité par porte par mois
 * @property {boolean} isViable - Indique si le projet est viable (cashflow par porte >= seuil minimum)
 * @property {string} rating - Évaluation du projet (EXCELLENT, GOOD, ACCEPTABLE, POOR)
 * @property {string} recommendation - Recommandation basée sur l'analyse
 */

/**
 * Seuils de rentabilité pour les projets FLIP
 * @const {Object}
 */
const FLIP_THRESHOLDS = {
  MINIMUM: 15000,   // Seuil minimum acceptable pour un profit ($/projet)
  TARGET: 25000,    // Seuil cible pour un bon profit ($/projet)
  EXCELLENT: 40000  // Seuil excellent pour un profit ($/projet)
};

/**
 * Seuils de rentabilité pour les projets MULTI
 * @const {Object}
 */
const MULTI_THRESHOLDS = {
  MINIMUM: 50,   // Seuil minimum acceptable pour un cashflow par porte ($/mois)
  TARGET: 75,    // Seuil cible pour un bon cashflow par porte ($/mois)
  EXCELLENT: 100 // Seuil excellent pour un cashflow par porte ($/mois)
};

/**
 * Pourcentages de dépenses par rapport aux revenus bruts, selon le nombre d'unités
 * @const {Object}
 */
const EXPENSE_RATIOS = {
  SMALL: 0.30,  // 1-2 logements = 30% du revenu brut
  MEDIUM: 0.35, // 3-4 logements = 35% du revenu brut
  LARGE: 0.45,  // 5-6 logements = 45% du revenu brut
  XLARGE: 0.50  // 7+ logements = 50% du revenu brut
};

/**
 * Calculateur Napkin FLIP - Méthode FIP10
 * 
 * Cette méthode utilise la formule:
 * Prix Final - Prix Initial - Prix des Rénovations - 10% de la valeur de revente = Profit
 * 
 * @param {NapkinFlipInput} input - Données d'entrée pour le calcul
 * @returns {NapkinFlipResult} - Résultats de l'analyse
 */
function calculateNapkinFlip(input) {
  // Validation des entrées
  validateFlipInput(input);
  
  // Extraction des valeurs
  const { finalPrice, initialPrice, renovationCost } = input;
  
  // Calcul du profit selon la méthode FIP10
  const expenses = finalPrice * 0.1; // 10% de la valeur de revente pour couvrir frais et taxes
  const profit = finalPrice - initialPrice - renovationCost - expenses;
  
  // Évaluation du projet
  const isViable = profit >= FLIP_THRESHOLDS.MINIMUM;
  const rating = getFlipRating(profit);
  const recommendation = generateFlipRecommendation(profit, isViable);
  
  return {
    profit: roundToTwo(profit),
    isViable,
    rating,
    recommendation,
    breakdown: {
      finalPrice: roundToTwo(finalPrice),
      initialPrice: roundToTwo(initialPrice),
      renovationCost: roundToTwo(renovationCost),
      expenses: roundToTwo(expenses),
      total: roundToTwo(profit)
    }
  };
}

/**
 * Calculateur Napkin MULTI - Méthode PAR + HIGH-5
 * 
 * Cette méthode utilise:
 * 1. PAR (Prix d'achat, Appartements, Revenus bruts)
 * 2. HIGH-5 (0.5% du prix d'achat par mois pour estimer le paiement hypothécaire)
 * 
 * @param {NapkinMultiInput} input - Données d'entrée pour le calcul
 * @returns {NapkinMultiResult} - Résultats de l'analyse
 */
function calculateNapkinMulti(input) {
  // Validation des entrées
  validateMultiInput(input);
  
  // Extraction des valeurs
  const { purchasePrice, units, grossRevenue } = input;
  
  // Détermination du ratio de dépenses selon le nombre d'unités
  let expenseRatio;
  if (units <= 2) {
    expenseRatio = EXPENSE_RATIOS.SMALL;
  } else if (units <= 4) {
    expenseRatio = EXPENSE_RATIOS.MEDIUM;
  } else if (units <= 6) {
    expenseRatio = EXPENSE_RATIOS.LARGE;
  } else {
    expenseRatio = EXPENSE_RATIOS.XLARGE;
  }
  
  // Calcul des dépenses
  const expenses = grossRevenue * expenseRatio;
  
  // Calcul du revenu net d'exploitation (RNE)
  const noi = grossRevenue - expenses;
  
  // Calcul du paiement hypothécaire selon la méthode HIGH-5
  const monthlyMortgagePayment = purchasePrice * 0.005;
  const annualMortgagePayment = monthlyMortgagePayment * 12;
  
  // Calcul du cashflow
  const cashflow = noi - annualMortgagePayment;
  
  // Calcul du cashflow par porte par mois
  const cashflowPerUnit = cashflow / units / 12;
  
  // Évaluation du projet
  const isViable = cashflowPerUnit >= MULTI_THRESHOLDS.MINIMUM;
  const rating = getMultiRating(cashflowPerUnit);
  const recommendation = generateMultiRecommendation(cashflowPerUnit, isViable);
  
  return {
    cashflow: roundToTwo(cashflow),
    cashflowPerUnit: roundToTwo(cashflowPerUnit),
    isViable,
    rating,
    recommendation,
    breakdown: {
      grossRevenue: roundToTwo(grossRevenue),
      expenses: roundToTwo(expenses),
      noi: roundToTwo(noi),
      annualMortgagePayment: roundToTwo(annualMortgagePayment),
      cashflow: roundToTwo(cashflow)
    }
  };
}

/**
 * Calcule le prix d'offre maximum pour un projet FLIP avec un profit cible
 * @param {Object} params - Paramètres pour le calcul
 * @param {number} params.finalPrice - Prix final (valeur de revente estimée)
 * @param {number} params.renovationCost - Coût des rénovations
 * @param {number} [params.targetProfit] - Profit cible (par défaut: 25000)
 * @returns {number} - Prix d'offre maximum recommandé
 */
function calculateMaxOfferPriceFlip(params) {
  // Validation des entrées
  if (!params.finalPrice || params.finalPrice <= 0) {
    throw new Error("Le prix final doit être un nombre positif");
  }
  
  if (params.renovationCost === undefined || params.renovationCost < 0) {
    throw new Error("Le coût des rénovations doit être spécifié et être un nombre positif ou zéro");
  }
  
  const targetProfit = params.targetProfit || FLIP_THRESHOLDS.TARGET;
  const expenses = params.finalPrice * 0.1; // 10% de la valeur de revente
  
  // Calcul du prix d'offre maximum: Prix Final - Rénovations - 10% - Profit cible
  const maxOfferPrice = params.finalPrice - params.renovationCost - expenses - targetProfit;
  
  if (maxOfferPrice <= 0) {
    throw new Error("Impossible d'atteindre le profit cible avec ces paramètres. Le projet n'est pas viable aux prix actuels.");
  }
  
  return roundToTwo(maxOfferPrice);
}

/**
 * Calcule le prix d'offre maximum pour un immeuble MULTI avec un cashflow cible par porte
 * @param {Object} params - Paramètres pour le calcul
 * @param {number} params.units - Nombre d'unités (portes)
 * @param {number} params.grossRevenue - Revenus bruts annuels
 * @param {number} [params.targetCashflowPerUnit] - Cashflow cible par porte par mois (par défaut: 75)
 * @returns {number} - Prix d'offre maximum recommandé
 */
function calculateMaxOfferPriceMulti(params) {
  // Validation des entrées
  if (!params.units || params.units <= 0 || !Number.isInteger(params.units)) {
    throw new Error("Le nombre d'unités doit être un entier positif");
  }
  
  if (!params.grossRevenue || params.grossRevenue <= 0) {
    throw new Error("Les revenus bruts doivent être un nombre positif");
  }
  
  const targetCashflowPerUnit = params.targetCashflowPerUnit || MULTI_THRESHOLDS.TARGET;
  
  // Détermination du ratio de dépenses selon le nombre d'unités
  let expenseRatio;
  if (params.units <= 2) {
    expenseRatio = EXPENSE_RATIOS.SMALL;
  } else if (params.units <= 4) {
    expenseRatio = EXPENSE_RATIOS.MEDIUM;
  } else if (params.units <= 6) {
    expenseRatio = EXPENSE_RATIOS.LARGE;
  } else {
    expenseRatio = EXPENSE_RATIOS.XLARGE;
  }
  
  // Calcul des dépenses
  const expenses = params.grossRevenue * expenseRatio;
  
  // Calcul du revenu net d'exploitation (RNE)
  const noi = params.grossRevenue - expenses;
  
  // Cashflow annuel cible
  const targetAnnualCashflow = targetCashflowPerUnit * params.units * 12;
  
  // Paiement hypothécaire maximum possible
  const maxMortgagePayment = noi - targetAnnualCashflow;
  
  // Vérifier si le paiement hypothécaire maximum est cohérent
  if (maxMortgagePayment <= 0) {
    throw new Error("Impossible d'atteindre le cashflow cible avec ces paramètres. Les revenus sont insuffisants par rapport aux dépenses.");
  }
  
  // Calcul du prix d'achat maximum selon la méthode HIGH-5 inversée
  const maxPurchasePrice = (maxMortgagePayment / 12) / 0.005;
  
  return roundToTwo(maxPurchasePrice);
}

/**
 * Valide les entrées du calculateur Napkin FLIP
 * @param {NapkinFlipInput} input - Données d'entrée à valider
 * @throws {Error} Si les données sont invalides
 */
function validateFlipInput(input) {
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
    throw new Error("Le coût des rénovations doit être spécifié et être un nombre positif ou zéro");
  }
  
  if (input.finalPrice <= input.initialPrice) {
    throw new Error("Le prix final doit être supérieur au prix initial pour que le projet soit viable");
  }
}

/**
 * Valide les entrées du calculateur Napkin MULTI
 * @param {NapkinMultiInput} input - Données d'entrée à valider
 * @throws {Error} Si les données sont invalides
 */
function validateMultiInput(input) {
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
 * Évalue la qualité du projet FLIP en fonction du profit
 * @param {number} profit - Profit net estimé
 * @returns {string} - Évaluation (EXCELLENT, GOOD, ACCEPTABLE, POOR)
 */
function getFlipRating(profit) {
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
 * Évalue la qualité du projet MULTI en fonction du cashflow par porte
 * @param {number} cashflowPerUnit - Cashflow par porte par mois
 * @returns {string} - Évaluation (EXCELLENT, GOOD, ACCEPTABLE, POOR)
 */
function getMultiRating(cashflowPerUnit) {
  if (cashflowPerUnit >= MULTI_THRESHOLDS.EXCELLENT) {
    return "EXCELLENT";
  } else if (cashflowPerUnit >= MULTI_THRESHOLDS.TARGET) {
    return "GOOD";
  } else if (cashflowPerUnit >= MULTI_THRESHOLDS.MINIMUM) {
    return "ACCEPTABLE";
  } else {
    return "POOR";
  }
}

/**
 * Génère une recommandation basée sur les résultats de l'analyse pour un projet FLIP
 * @param {number} profit - Profit net estimé
 * @param {boolean} isViable - Indique si le projet est viable
 * @returns {string} - Recommandation
 */
function generateFlipRecommendation(profit, isViable) {
  if (!isViable) {
    if (profit <= 0) {
      return "Ce projet générera une perte financière. Il est fortement déconseillé d'investir à ce prix d'achat. Envisagez de négocier un prix plus bas ou de chercher un autre projet.";
    } else {
      return `Ce projet génère un profit de ${profit.toFixed(2)}$, ce qui est inférieur au seuil minimum recommandé de ${FLIP_THRESHOLDS.MINIMUM}$. Envisagez de négocier un meilleur prix ou de réduire les coûts de rénovation.`;
    }
  }
  
  if (profit < FLIP_THRESHOLDS.TARGET) {
    return `Ce projet est acceptable avec un profit de ${profit.toFixed(2)}$, mais reste sous le seuil cible de ${FLIP_THRESHOLDS.TARGET}$. Analysez plus en détail pour confirmer les coûts et la valeur de revente.`;
  } else if (profit < FLIP_THRESHOLDS.EXCELLENT) {
    return `Ce projet est bon avec un profit de ${profit.toFixed(2)}$. Procédez à une analyse plus détaillée pour confirmer la valeur de revente et les coûts de rénovation.`;
  } else {
    return `Ce projet est excellent avec un profit de ${profit.toFixed(2)}$. Fortement recommandé pour investissement, mais validez tout de même les estimations de rénovation et la valeur après travaux.`;
  }
}

/**
 * Génère une recommandation basée sur les résultats de l'analyse pour un projet MULTI
 * @param {number} cashflowPerUnit - Cashflow par porte par mois
 * @param {boolean} isViable - Indique si le projet est viable
 * @returns {string} - Recommandation
 */
function generateMultiRecommendation(cashflowPerUnit, isViable) {
  if (!isViable) {
    if (cashflowPerUnit <= 0) {
      return "Ce projet générera un cashflow négatif. Il est fortement déconseillé d'investir à moins de pouvoir négocier un prix d'achat plus bas, optimiser les revenus ou réduire les dépenses.";
    } else {
      return `Ce projet génère un cashflow de ${cashflowPerUnit.toFixed(2)}$ par porte par mois, ce qui est inférieur au seuil minimum recommandé de ${MULTI_THRESHOLDS.MINIMUM}$. Envisagez de négocier un meilleur prix ou d'optimiser la structure de revenus et dépenses.`;
    }
  }
  
  if (cashflowPerUnit < MULTI_THRESHOLDS.TARGET) {
    return `Ce projet est acceptable avec un cashflow de ${cashflowPerUnit.toFixed(2)}$ par porte par mois, mais reste sous le seuil cible de ${MULTI_THRESHOLDS.TARGET}$. Vérifiez si vous pouvez améliorer la rentabilité.`;
  } else if (cashflowPerUnit < MULTI_THRESHOLDS.EXCELLENT) {
    return `Ce projet est bon avec un cashflow de ${cashflowPerUnit.toFixed(2)}$ par porte par mois. Procédez à une analyse plus détaillée et évaluez les possibilités d'optimisation.`;
  } else {
    return `Ce projet est excellent avec un cashflow de ${cashflowPerUnit.toFixed(2)}$ par porte par mois. Fortement recommandé pour investissement.`;
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
  MULTI_THRESHOLDS,
  EXPENSE_RATIOS,
  calculateNapkinFlip,
  calculateNapkinMulti,
  calculateMaxOfferPriceFlip,
  calculateMaxOfferPriceMulti
};
