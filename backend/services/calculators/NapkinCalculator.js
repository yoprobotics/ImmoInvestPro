/**
 * Service pour les calculateurs Napkin (FLIP et MULTI)
 * Implémentation des méthodes de calcul rapide utilisées dans la formation "Secrets de l'immobilier"
 */

class NapkinCalculator {

  /**
   * Calculateur Napkin FLIP - Formule FIP10
   * Calcule le profit estimé d'un projet FLIP
   * 
   * @param {number} finalPrice - Prix de vente estimé après travaux
   * @param {number} initialPrice - Prix d'achat
   * @param {number} renovationCost - Coût des rénovations
   * @returns {Object} Résultat du calcul avec profit estimé
   */
  static calculateFlipProfit(finalPrice, initialPrice, renovationCost) {
    // Validation des paramètres
    if (!finalPrice || !initialPrice || !renovationCost) {
      throw new Error('Tous les paramètres sont requis: finalPrice, initialPrice, renovationCost');
    }
    
    // Calcul du 10% de la valeur de revente (frais divers)
    const expenses = finalPrice * 0.1;
    
    // Calcul du profit selon la formule FIP10
    const profit = finalPrice - initialPrice - renovationCost - expenses;
    
    return {
      finalPrice,
      initialPrice,
      renovationCost,
      expenses,
      profit,
      profitPercentage: (profit / (initialPrice + renovationCost)) * 100
    };
  }
  
  /**
   * Calculateur Napkin FLIP - Prix d'offre
   * Calcule le prix d'offre maximum pour atteindre un profit cible
   * 
   * @param {number} finalPrice - Prix de vente estimé après travaux
   * @param {number} renovationCost - Coût des rénovations
   * @param {number} targetProfit - Profit visé (généralement 25000$)
   * @returns {Object} Résultat du calcul avec prix d'offre maximum
   */
  static calculateFlipOfferPrice(finalPrice, renovationCost, targetProfit) {
    // Validation des paramètres
    if (!finalPrice || !renovationCost || !targetProfit) {
      throw new Error('Tous les paramètres sont requis: finalPrice, renovationCost, targetProfit');
    }
    
    // Calcul du 10% de la valeur de revente (frais divers)
    const expenses = finalPrice * 0.1;
    
    // Calcul du prix d'offre maximum
    const maxOfferPrice = finalPrice - renovationCost - expenses - targetProfit;
    
    return {
      finalPrice,
      renovationCost,
      expenses,
      targetProfit,
      maxOfferPrice
    };
  }
  
  /**
   * Calculateur Napkin MULTI - Méthode PAR et HIGH-5
   * Calcule le cashflow estimé d'un immeuble à revenus
   * 
   * @param {number} purchasePrice - Prix d'achat
   * @param {number} apartmentCount - Nombre d'appartements
   * @param {number} grossRevenue - Revenus bruts annuels
   * @returns {Object} Résultat du calcul avec cashflow estimé
   */
  static calculateMultiCashflow(purchasePrice, apartmentCount, grossRevenue) {
    // Validation des paramètres
    if (!purchasePrice || !apartmentCount || !grossRevenue) {
      throw new Error('Tous les paramètres sont requis: purchasePrice, apartmentCount, grossRevenue');
    }
    
    // Détermination du pourcentage de dépenses selon le nombre d'appartements
    let expensesPercentage;
    if (apartmentCount <= 2) {
      expensesPercentage = 30;
    } else if (apartmentCount <= 4) {
      expensesPercentage = 35;
    } else if (apartmentCount <= 6) {
      expensesPercentage = 45;
    } else {
      expensesPercentage = 50;
    }
    
    // Calcul des dépenses
    const expenses = grossRevenue * (expensesPercentage / 100);
    
    // Calcul du Revenu Net d'Opération (RNO)
    const netOperatingIncome = grossRevenue - expenses;
    
    // Calcul du paiement hypothécaire annuel avec la méthode HIGH-5
    const annualMortgagePayment = purchasePrice * 0.005 * 12;
    
    // Calcul de la liquidité (cashflow) annuelle
    const annualCashflow = netOperatingIncome - annualMortgagePayment;
    
    // Calcul du cashflow mensuel par porte
    const monthlyCashflowPerDoor = annualCashflow / (apartmentCount * 12);
    
    return {
      purchasePrice,
      apartmentCount,
      grossRevenue,
      expensesPercentage,
      expenses,
      netOperatingIncome,
      annualMortgagePayment,
      annualCashflow,
      monthlyCashflowPerDoor
    };
  }
  
  /**
   * Calculateur Napkin MULTI - Prix d'offre
   * Calcule le prix d'offre maximum pour atteindre un cashflow par porte cible
   * 
   * @param {number} apartmentCount - Nombre d'appartements
   * @param {number} grossRevenue - Revenus bruts annuels
   * @param {number} targetCashflowPerDoor - Cashflow mensuel par porte visé (généralement 75$)
   * @returns {Object} Résultat du calcul avec prix d'offre maximum
   */
  static calculateMultiOfferPrice(apartmentCount, grossRevenue, targetCashflowPerDoor) {
    // Validation des paramètres
    if (!apartmentCount || !grossRevenue || !targetCashflowPerDoor) {
      throw new Error('Tous les paramètres sont requis: apartmentCount, grossRevenue, targetCashflowPerDoor');
    }
    
    // Détermination du pourcentage de dépenses selon le nombre d'appartements
    let expensesPercentage;
    if (apartmentCount <= 2) {
      expensesPercentage = 30;
    } else if (apartmentCount <= 4) {
      expensesPercentage = 35;
    } else if (apartmentCount <= 6) {
      expensesPercentage = 45;
    } else {
      expensesPercentage = 50;
    }
    
    // Calcul des dépenses
    const expenses = grossRevenue * (expensesPercentage / 100);
    
    // Calcul du Revenu Net d'Opération (RNO)
    const netOperatingIncome = grossRevenue - expenses;
    
    // Calcul de la liquidité annuelle cible
    const targetAnnualCashflow = targetCashflowPerDoor * apartmentCount * 12;
    
    // Calcul du paiement hypothécaire maximum
    const maxAnnualMortgagePayment = netOperatingIncome - targetAnnualCashflow;
    
    // Calcul du prix d'achat maximum selon la méthode HIGH-5 inversée
    const maxPurchasePrice = maxAnnualMortgagePayment / 12 / 0.005;
    
    return {
      apartmentCount,
      grossRevenue,
      expensesPercentage,
      expenses,
      netOperatingIncome,
      targetCashflowPerDoor,
      targetAnnualCashflow,
      maxAnnualMortgagePayment,
      maxPurchasePrice
    };
  }
}

module.exports = NapkinCalculator;
