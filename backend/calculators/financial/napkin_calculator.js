/**
 * Calculateur Napkin pour analyse rapide de projets immobiliers
 * 
 * Ce module implémente les méthodes "Napkin" des Secrets de l'Immobilier
 * pour FLIP et MULTI, permettant d'évaluer rapidement la rentabilité
 * potentielle d'un investissement immobilier.
 */

/**
 * Constante pour le pourcentage des frais dans le calcul Napkin FLIP
 * @type {number}
 */
const FLIP_EXPENSE_PERCENTAGE = 10;

/**
 * Constante pour le cashflow cible par porte dans les projets MULTI
 * @type {number}
 */
const TARGET_CASHFLOW_PER_DOOR = 75;

/**
 * Calcule la rentabilité potentielle d'un projet FLIP selon la méthode FIP10 (Napkin)
 * 
 * Cette méthode utilise trois données principales:
 * - Prix Final (valeur de revente)
 * - Prix Initial (prix d'achat)
 * - Prix des rénovations
 * 
 * @param {Object} input Données d'entrée pour le calcul
 * @param {number} input.finalPrice Valeur estimée après rénovation (prix de revente)
 * @param {number} input.initialPrice Prix d'achat initial
 * @param {number} input.renovationCost Coût estimé des rénovations
 * @param {number} [input.expensePercentage=10] Pourcentage des frais d'acquisition et possession (par défaut 10%)
 * @returns {Object} Résultats du calcul Napkin FLIP
 */
function calculateNapkinFlip(input) {
  // Validation des entrées
  if (!input.finalPrice || !input.initialPrice || input.renovationCost === undefined) {
    throw new Error('Les prix final, initial et le coût des rénovations sont obligatoires');
  }

  const expensePercentage = input.expensePercentage || FLIP_EXPENSE_PERCENTAGE;
  
  // Calcul selon la méthode FIP10
  const expenses = input.finalPrice * (expensePercentage / 100);
  const profit = input.finalPrice - input.initialPrice - input.renovationCost - expenses;
  
  // Calcul du retour sur investissement (ROI)
  const investment = input.initialPrice + input.renovationCost;
  const roi = investment > 0 ? (profit / investment) * 100 : 0;
  
  // Calcul du prix d'achat maximum pour un profit cible
  const calculateMaxBidPrice = (targetProfit) => {
    return input.finalPrice - input.renovationCost - expenses - targetProfit;
  };
  
  // Prix d'achat maximum pour un profit de 25000$
  const maxBidPrice = calculateMaxBidPrice(25000);
  
  return {
    finalPrice: input.finalPrice,
    initialPrice: input.initialPrice,
    renovationCost: input.renovationCost,
    expenses: expenses,
    profit: profit,
    roi: roi,
    maxBidPrice: maxBidPrice,
    isViable: profit >= 25000, // Seuil de rentabilité recommandé
    recommendation: getFlipRecommendation(profit, roi)
  };
}

/**
 * Génère une recommandation pour un projet FLIP
 * 
 * @param {number} profit Profit estimé
 * @param {number} roi Retour sur investissement
 * @returns {string} Recommandation
 */
function getFlipRecommendation(profit, roi) {
  if (profit < 0) {
    return "Ce projet génère une perte. Il est fortement déconseillé d'y investir sans modification substantielle du prix d'achat ou des coûts de rénovation.";
  } else if (profit < 25000) {
    return `Ce projet génère un profit de ${profit.toFixed(2)}$, ce qui est inférieur au seuil minimal recommandé de 25000$. Négociez un meilleur prix d'achat ou réduisez les coûts de rénovation.`;
  } else if (profit < 40000) {
    return `Ce projet génère un profit acceptable de ${profit.toFixed(2)}$ avec un ROI de ${roi.toFixed(2)}%. Analysez plus en détail pour confirmer la viabilité.`;
  } else {
    return `Ce projet est excellent avec un profit estimé de ${profit.toFixed(2)}$ et un ROI de ${roi.toFixed(2)}%. Recommandé pour investissement après analyse détaillée.`;
  }
}

/**
 * Calcule rapidement la rentabilité d'un immeuble à revenus selon la méthode Napkin PAR + HIGH-5
 * 
 * Cette méthode utilise trois données principales:
 * - Prix d'achat
 * - Nombre d'Appartements (unités)
 * - Revenus bruts
 * 
 * @param {Object} input Données d'entrée pour le calcul
 * @param {number} input.purchasePrice Prix d'achat de l'immeuble
 * @param {number} input.unitCount Nombre d'unités (portes)
 * @param {number} input.grossIncome Revenus bruts annuels
 * @param {number} [input.targetCashflowPerDoor=75] Cashflow cible par porte par mois
 * @returns {Object} Résultats du calcul Napkin MULTI
 */
function calculateNapkinMulti(input) {
  // Validation des entrées
  if (!input.purchasePrice || !input.unitCount || !input.grossIncome) {
    throw new Error('Le prix d\'achat, le nombre d\'unités et les revenus bruts sont obligatoires');
  }

  const targetCashflowPerDoor = input.targetCashflowPerDoor || TARGET_CASHFLOW_PER_DOOR;
  
  // Déterminer le pourcentage de dépenses selon le nombre d'unités
  let expensePercentage;
  if (input.unitCount <= 2) {
    expensePercentage = 30;
  } else if (input.unitCount <= 4) {
    expensePercentage = 35;
  } else if (input.unitCount <= 6) {
    expensePercentage = 45;
  } else {
    expensePercentage = 50;
  }
  
  // Calcul des dépenses
  const expenses = input.grossIncome * (expensePercentage / 100);
  
  // Calcul du revenu net d'exploitation (NOI)
  const netOperatingIncome = input.grossIncome - expenses;
  
  // Estimation des paiements hypothécaires avec la méthode HIGH-5
  const mortgagePayments = input.purchasePrice * 0.005 * 12;
  
  // Calcul du cashflow
  const cashflow = netOperatingIncome - mortgagePayments;
  
  // Calcul du cashflow par porte par mois
  const cashflowPerDoor = cashflow / input.unitCount / 12;
  
  // Calcul du prix d'achat maximum pour atteindre le cashflow cible
  const calculateMaxPurchasePrice = (targetMonthlyPerDoor) => {
    // Cashflow annuel cible
    const targetAnnualCashflow = targetMonthlyPerDoor * input.unitCount * 12;
    
    // Financements maximum disponible
    const maxFinancing = netOperatingIncome - targetAnnualCashflow;
    
    // Prix d'achat maximum (formule inversée de HIGH-5)
    return maxFinancing / 0.06; // 0.005 * 12 = 0.06
  };
  
  const maxPurchasePrice = calculateMaxPurchasePrice(targetCashflowPerDoor);
  
  // Calcul du taux de capitalisation
  const capRate = (netOperatingIncome / input.purchasePrice) * 100;
  
  // Calcul du multiplicateur de revenu brut (GRM)
  const grm = input.purchasePrice / input.grossIncome;
  
  return {
    purchasePrice: input.purchasePrice,
    unitCount: input.unitCount,
    grossIncome: input.grossIncome,
    expenses: expenses,
    expensePercentage: expensePercentage,
    netOperatingIncome: netOperatingIncome,
    mortgagePayments: mortgagePayments,
    cashflow: cashflow,
    cashflowPerDoor: cashflowPerDoor,
    capRate: capRate,
    grm: grm,
    maxPurchasePrice: maxPurchasePrice,
    isViable: cashflowPerDoor >= targetCashflowPerDoor,
    recommendation: getMultiRecommendation(cashflowPerDoor, targetCashflowPerDoor, capRate)
  };
}

/**
 * Génère une recommandation pour un projet MULTI
 * 
 * @param {number} cashflowPerDoor Cashflow par porte par mois
 * @param {number} targetCashflowPerDoor Cashflow cible par porte par mois
 * @param {number} capRate Taux de capitalisation
 * @returns {string} Recommandation
 */
function getMultiRecommendation(cashflowPerDoor, targetCashflowPerDoor, capRate) {
  if (cashflowPerDoor < 0) {
    return "Ce projet génère un cashflow négatif. Il est fortement déconseillé d'y investir sans modification substantielle du prix d'achat ou des revenus.";
  } else if (cashflowPerDoor < 50) {
    return `Ce projet génère seulement ${cashflowPerDoor.toFixed(2)}$ par porte par mois, ce qui est insuffisant. Le minimum acceptable est de 50$ et la cible est de ${targetCashflowPerDoor}$.`;
  } else if (cashflowPerDoor < targetCashflowPerDoor) {
    return `Ce projet génère ${cashflowPerDoor.toFixed(2)}$ par porte par mois, ce qui est en dessous de la cible de ${targetCashflowPerDoor}$. Le taux de capitalisation est de ${capRate.toFixed(2)}%. Envisagez de négocier un meilleur prix.`;
  } else {
    return `Ce projet est viable avec ${cashflowPerDoor.toFixed(2)}$ par porte par mois et un taux de capitalisation de ${capRate.toFixed(2)}%. Procédez à une analyse plus détaillée pour confirmer la rentabilité.`;
  }
}

module.exports = {
  calculateNapkinFlip,
  calculateNapkinMulti,
  FLIP_EXPENSE_PERCENTAGE,
  TARGET_CASHFLOW_PER_DOOR
};