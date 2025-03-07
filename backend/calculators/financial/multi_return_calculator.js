/**
 * Calculateur de rendement MULTI
 * 
 * Ce module implémente un calculateur détaillé pour les immeubles à revenus selon
 * la méthodologie des Secrets de l'Immobilier. Il permet d'analyser en profondeur
 * la rentabilité d'un immeuble multi-logements avec toutes les sources de revenus
 * et dépenses possibles.
 */

/**
 * Calcule le rendement détaillé d'un immeuble à revenus
 * @param {Object} property - Données de l'immeuble
 * @param {Object} property.purchase - Informations d'achat
 * @param {number} property.purchase.price - Prix d'achat de l'immeuble
 * @param {number} property.purchase.closingCosts - Frais de clôture (notaire, mutation, etc.)
 * @param {Object} property.revenues - Revenus de l'immeuble
 * @param {Array} property.revenues.units - Liste des unités locatives
 * @param {Object} property.revenues.other - Autres sources de revenus (stationnement, buanderie, etc.)
 * @param {Object} property.expenses - Dépenses d'exploitation
 * @param {Object} property.financing - Structure de financement
 * @param {number} property.financing.conventionalLoanPercentage - Pourcentage du prêt conventionnel (ex: 0.75 pour 75%)
 * @param {number} property.financing.conventionalLoanRate - Taux d'intérêt du prêt conventionnel (ex: 0.05 pour 5%)
 * @param {number} property.financing.conventionalLoanAmortization - Période d'amortissement en années (ex: 25)
 * @param {Object} property.financing.creativeFinancing - Financement créatif (love money, partenariat, balance de vente)
 * @param {Object} options - Options de calcul
 * @returns {Object} - Analyse détaillée du rendement
 */
function calculateMultiReturn(property, options = {}) {
  const { purchase, revenues, expenses, financing } = property;
  const { detailLevel = 'standard', additionalExpenseRatio = 0 } = options;
  
  // 1. Calculer les revenus totaux
  const totalRevenues = calculateTotalRevenues(revenues);
  
  // 2. Calculer les dépenses totales
  const totalExpenses = calculateTotalExpenses(expenses, totalRevenues, additionalExpenseRatio);
  
  // 3. Calculer le revenu net d'exploitation (RNE/NOI)
  const netOperatingIncome = totalRevenues - totalExpenses;
  
  // 4. Calculer les paiements de financement
  const financingDetails = calculateFinancing(purchase.price, financing);
  
  // 5. Calculer le cashflow
  const cashflow = netOperatingIncome - financingDetails.totalAnnualPayment;
  const cashflowPerDoor = cashflow / revenues.units.length / 12;
  
  // 6. Calculer les ratios importants
  const ratios = calculateRatios(purchase.price, totalRevenues, netOperatingIncome, financingDetails, cashflow);
  
  // 7. Calculer le rendement sur investissement (ROI)
  const roi = calculateROI(purchase, financing, cashflow, netOperatingIncome);
  
  // 8. Générer un résumé d'optimisation si demandé
  const optimization = detailLevel === 'advanced' ? 
                      suggestOptimizations(property, cashflowPerDoor) : null;
  
  // 9. Préparer l'analyse de scénarios si demandée
  const scenarios = detailLevel === 'advanced' ? 
                   generateScenarios(property) : null;
  
  // Assembler les résultats
  return {
    input: {
      purchasePrice: purchase.price,
      unitCount: revenues.units.length,
      totalInvestment: purchase.price + (purchase.closingCosts || 0)
    },
    revenues: {
      rentalIncome: totalRevenues - (revenues.other?.total || 0),
      otherIncome: revenues.other?.total || 0,
      totalAnnual: totalRevenues,
      averagePerUnit: totalRevenues / revenues.units.length
    },
    expenses: {
      totalAnnual: totalExpenses,
      percentOfRevenues: (totalExpenses / totalRevenues) * 100,
      perUnit: totalExpenses / revenues.units.length
    },
    operations: {
      netOperatingIncome,
      annualCashflow: cashflow,
      monthlyCashflow: cashflow / 12,
      cashflowPerDoor
    },
    financing: financingDetails,
    ratios,
    roi,
    optimization,
    scenarios
  };
}

/**
 * Calcule les revenus totaux de l'immeuble
 * @param {Object} revenues - Données des revenus
 * @returns {number} - Total des revenus annuels
 */
function calculateTotalRevenues(revenues) {
  // Revenus des unités locatives
  const rentalIncome = revenues.units.reduce((total, unit) => {
    return total + (unit.monthlyRent * 12);
  }, 0);
  
  // Autres revenus (stationnement, buanderie, etc.)
  const otherIncome = revenues.other?.total || 0;
  
  return rentalIncome + otherIncome;
}

/**
 * Calcule les dépenses totales de l'immeuble
 * @param {Object} expenses - Données des dépenses
 * @param {number} totalRevenues - Revenus totaux annuels
 * @param {number} additionalExpenseRatio - Ratio de dépenses supplémentaires à prévoir
 * @returns {number} - Total des dépenses annuelles
 */
function calculateTotalExpenses(expenses, totalRevenues, additionalExpenseRatio) {
  if (expenses.total) {
    return expenses.total;
  }
  
  // Si les dépenses détaillées sont fournies, les additionner
  if (expenses.detailed) {
    const detailedTotal = Object.values(expenses.detailed).reduce((sum, value) => sum + value, 0);
    // Ajouter un pourcentage supplémentaire pour les dépenses imprévues
    return detailedTotal * (1 + additionalExpenseRatio);
  }
  
  // Sinon, estimer les dépenses selon le nombre d'unités (méthode des Secrets de l'immobilier)
  const unitCount = expenses.unitCount || 1;
  let expenseRatio;
  
  if (unitCount <= 2) {
    expenseRatio = 0.3; // 30% pour 1-2 unités
  } else if (unitCount <= 4) {
    expenseRatio = 0.35; // 35% pour 3-4 unités
  } else if (unitCount <= 6) {
    expenseRatio = 0.45; // 45% pour 5-6 unités
  } else {
    expenseRatio = 0.5; // 50% pour 7+ unités
  }
  
  return totalRevenues * (expenseRatio + additionalExpenseRatio);
}

/**
 * Calcule les détails du financement
 * @param {number} price - Prix d'achat
 * @param {Object} financing - Structure de financement
 * @returns {Object} - Détails du financement
 */
function calculateFinancing(price, financing) {
  const result = {
    components: [],
    totalAnnualPayment: 0,
    downPayment: 0,
    totalDebt: 0
  };
  
  // 1. Financement conventionnel
  if (financing.conventionalLoanPercentage > 0) {
    const loanAmount = price * financing.conventionalLoanPercentage;
    const monthlyRate = financing.conventionalLoanRate / 12;
    const numPayments = financing.conventionalLoanAmortization * 12;
    
    const monthlyPayment = loanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
      (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    const annualPayment = monthlyPayment * 12;
    
    result.components.push({
      type: 'conventional',
      loanAmount,
      rate: financing.conventionalLoanRate,
      amortization: financing.conventionalLoanAmortization,
      monthlyPayment,
      annualPayment
    });
    
    result.totalAnnualPayment += annualPayment;
    result.totalDebt += loanAmount;
  }
  
  // 2. Financement créatif (si applicable)
  if (financing.creativeFinancing) {
    const { type, amount, rate, term } = financing.creativeFinancing;
    
    const monthlyRate = rate / 12;
    const numPayments = term * 12;
    
    const monthlyPayment = amount * 
      (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
      (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    const annualPayment = monthlyPayment * 12;
    
    result.components.push({
      type,
      loanAmount: amount,
      rate,
      term,
      monthlyPayment,
      annualPayment
    });
    
    result.totalAnnualPayment += annualPayment;
    result.totalDebt += amount;
  }
  
  // Calculer la mise de fonds
  result.downPayment = price - result.totalDebt;
  result.downPaymentPercentage = result.downPayment / price;
  
  return result;
}

/**
 * Calcule les ratios financiers importants
 * @param {number} price - Prix d'achat
 * @param {number} totalRevenues - Revenus totaux annuels
 * @param {number} noi - Revenu net d'exploitation
 * @param {Object} financingDetails - Détails du financement
 * @param {number} cashflow - Cashflow annuel
 * @returns {Object} - Ratios financiers
 */
function calculateRatios(price, totalRevenues, noi, financingDetails, cashflow) {
  // Taux de capitalisation (Cap Rate)
  const capRate = (noi / price) * 100;
  
  // Multiplicateur de revenu brut (GRM)
  const grm = price / totalRevenues;
  
  // Ratio de couverture de la dette (DCR)
  const dcr = financingDetails.totalAnnualPayment > 0 ? 
              noi / financingDetails.totalAnnualPayment : Infinity;
  
  // Ratio dette/revenu
  const debtToIncomeRatio = financingDetails.totalDebt / totalRevenues;
  
  // Ratio cashflow/mise de fonds
  const cashOnCashReturn = financingDetails.downPayment > 0 ? 
                          (cashflow / financingDetails.downPayment) * 100 : 0;
  
  return {
    capRate,
    grm,
    dcr,
    debtToIncomeRatio,
    cashOnCashReturn
  };
}

/**
 * Calcule le retour sur investissement (ROI)
 * @param {Object} purchase - Informations d'achat
 * @param {Object} financing - Structure de financement
 * @param {number} cashflow - Cashflow annuel
 * @param {number} noi - Revenu net d'exploitation
 * @returns {Object} - Analyse du ROI
 */
function calculateROI(purchase, financing, cashflow, noi) {
  const totalInvestment = financing.downPayment || 
                         (purchase.price * (1 - financing.conventionalLoanPercentage));
  
  // ROI sur le cashflow (Cash-on-Cash Return)
  const cashROI = (cashflow / totalInvestment) * 100;
  
  // ROI sur l'équité (basé sur le NOI)
  const equityROI = (noi / totalInvestment) * 100;
  
  return {
    totalInvestment,
    cashROI,
    equityROI,
    // Estimation simplifiée du ROI sur 5 ans (incluant appréciation)
    fiveYearProjection: {
      cashflowROI: cashROI * 5,
      appreciationROI: 15, // Hypothèse de 3% par an sur 5 ans
      totalROI: (cashROI * 5) + 15
    }
  };
}

/**
 * Suggère des optimisations possibles pour améliorer le rendement
 * @param {Object} property - Données de l'immeuble
 * @param {number} cashflowPerDoor - Cashflow mensuel par porte
 * @returns {Object} - Suggestions d'optimisation
 */
function suggestOptimizations(property, cashflowPerDoor) {
  const suggestions = [];
  const targetCashflow = 75; // Cible de 75$ par porte selon les Secrets de l'immobilier
  
  // Si le cashflow par porte est inférieur à la cible
  if (cashflowPerDoor < targetCashflow) {
    const deficit = targetCashflow - cashflowPerDoor;
    
    // Suggérer d'augmenter les loyers
    suggestions.push({
      type: 'revenue',
      action: 'Augmenter les loyers',
      impact: `+${Math.ceil(deficit)}$ par porte par mois`,
      description: `Une augmentation moyenne de ${Math.ceil(deficit)}$ par mois par unité permettrait d'atteindre le cashflow cible de 75$ par porte.`
    });
    
    // Suggérer d'ajouter des revenus accessoires
    suggestions.push({
      type: 'revenue',
      action: 'Ajouter des revenus accessoires',
      impact: 'Variable',
      description: 'Considérer l'ajout de services payants: stationnement, buanderie, stockage, etc.'
    });
    
    // Suggérer de réduire les dépenses
    suggestions.push({
      type: 'expense',
      action: 'Optimiser les dépenses',
      impact: 'Moyen',
      description: 'Revoir les contrats de services, assurances, et identifier les possibilités d'économies d'énergie.'
    });
    
    // Suggérer de refinancer si applicable
    if (property.financing.conventionalLoanRate > 0.04) { // Taux arbitraire pour l'exemple
      suggestions.push({
        type: 'financing',
        action: 'Refinancer à un taux plus bas',
        impact: 'Élevé',
        description: `Un refinancement à un taux plus bas pourrait améliorer significativement le cashflow.`
      });
    }
  }
  
  return {
    currentCashflowPerDoor: cashflowPerDoor,
    targetCashflowPerDoor: targetCashflow,
    gap: targetCashflow - cashflowPerDoor,
    meetsCriteria: cashflowPerDoor >= targetCashflow,
    suggestions
  };
}

/**
 * Génère des scénarios alternatifs pour l'analyse
 * @param {Object} property - Données de l'immeuble
 * @returns {Array} - Scénarios alternatifs
 */
function generateScenarios(property) {
  // Créer une copie de base des données
  const baseProperty = JSON.parse(JSON.stringify(property));
  
  // Scénario 1: Augmentation des loyers de 10%
  const revenueIncrease = JSON.parse(JSON.stringify(baseProperty));
  revenueIncrease.revenues.units = revenueIncrease.revenues.units.map(unit => {
    unit.monthlyRent *= 1.1; // +10%
    return unit;
  });
  
  // Scénario 2: Réduction des dépenses de 5%
  const expenseReduction = JSON.parse(JSON.stringify(baseProperty));
  if (expenseReduction.expenses.detailed) {
    Object.keys(expenseReduction.expenses.detailed).forEach(key => {
      expenseReduction.expenses.detailed[key] *= 0.95; // -5%
    });
  } else if (expenseReduction.expenses.total) {
    expenseReduction.expenses.total *= 0.95; // -5%
  }
  
  // Scénario 3: Refinancement à taux plus bas
  const refinancing = JSON.parse(JSON.stringify(baseProperty));
  if (refinancing.financing.conventionalLoanRate > 0.03) {
    refinancing.financing.conventionalLoanRate -= 0.01; // -1%
  }
  
  // Analyser chaque scénario
  return [
    {
      name: 'Augmentation des loyers (+10%)',
      result: calculateMultiReturn(revenueIncrease)
    },
    {
      name: 'Réduction des dépenses (-5%)',
      result: calculateMultiReturn(expenseReduction)
    },
    {
      name: 'Refinancement à taux réduit',
      result: calculateMultiReturn(refinancing)
    }
  ];
}

module.exports = {
  calculateMultiReturn
};
