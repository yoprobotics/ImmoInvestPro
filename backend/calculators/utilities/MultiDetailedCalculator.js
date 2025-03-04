/**
 * MultiDetailedCalculator.js
 * Calculateur spécialisé pour l'analyse détaillée des immeubles à revenus (multi-logements)
 */

class MultiDetailedCalculator {
  /**
   * Calcule la rentabilité d'un immeuble à revenus
   * @param {Object} data Les données de l'immeuble
   * @param {number} data.purchasePrice Prix d'achat de l'immeuble
   * @param {number} data.grossAnnualRent Revenus bruts annuels
   * @param {number} data.units Nombre d'unités/logements
   * @param {number} data.renovationCost Coût des rénovations (optionnel)
   * @param {Object} data.financing Informations sur le financement (optionnel)
   * @param {number} data.financing.loanToValue Ratio prêt/valeur (0-1)
   * @param {number} data.financing.interestRate Taux d'intérêt (%)
   * @param {number} data.financing.amortizationYears Années d'amortissement
   * @returns {Object} Résultats de l'analyse
   */
  static calculate(data) {
    // Valeurs par défaut
    const renovationCost = data.renovationCost || 0;
    const totalInvestment = data.purchasePrice + renovationCost;
    const expenseRatio = this._getExpenseRatio(data.units);
    
    // Calcul des dépenses opérationnelles
    const operatingExpenses = data.grossAnnualRent * expenseRatio;
    const netOperatingIncome = data.grossAnnualRent - operatingExpenses;
    
    // Calcul du financement
    const financing = data.financing || {
      loanToValue: 0.75,
      interestRate: 4.5,
      amortizationYears: 25
    };
    
    const loanAmount = totalInvestment * financing.loanToValue;
    const downPayment = totalInvestment - loanAmount;
    const monthlyMortgagePayment = this._calculateMortgagePayment(
      loanAmount,
      financing.interestRate,
      financing.amortizationYears
    );
    const annualMortgagePayment = monthlyMortgagePayment * 12;
    
    // Calcul du cashflow
    const annualCashflow = netOperatingIncome - annualMortgagePayment;
    const monthlyCashflow = annualCashflow / 12;
    const cashflowPerUnit = monthlyCashflow / data.units;
    
    // Indicateurs de performance
    const capRate = (netOperatingIncome / totalInvestment) * 100;
    const cashOnCash = (annualCashflow / downPayment) * 100;
    
    // Évaluation de viabilité
    const isViable = cashflowPerUnit >= 75; // Minimum 75$ par porte par mois
    
    // Message d'évaluation
    let message;
    if (isViable) {
      message = "Ce projet est viable avec un cashflow positif suffisant par unité.";
    } else if (cashflowPerUnit > 0) {
      message = "Ce projet a un cashflow positif, mais inférieur au seuil recommandé de 75$/unité/mois.";
    } else {
      message = "Attention! Ce projet génère un cashflow négatif.";
    }
    
    return {
      details: {
        purchasePrice: data.purchasePrice,
        renovationCost: renovationCost,
        totalInvestment: totalInvestment,
        grossAnnualRent: data.grossAnnualRent,
        operatingExpenses: operatingExpenses,
        netOperatingIncome: netOperatingIncome,
        loanAmount: loanAmount,
        downPayment: downPayment,
        monthlyMortgagePayment: monthlyMortgagePayment,
        annualMortgagePayment: annualMortgagePayment,
        annualCashflow: annualCashflow,
        monthlyCashflow: monthlyCashflow
      },
      summary: {
        purchasePrice: data.purchasePrice,
        grossAnnualRent: data.grossAnnualRent,
        units: data.units,
        netOperatingIncome: netOperatingIncome,
        monthlyCashflow: monthlyCashflow,
        cashflowPerUnit: cashflowPerUnit,
        capRate: capRate.toFixed(2),
        cashOnCash: cashOnCash.toFixed(2),
        isViable: isViable,
        message: message
      }
    };
  }
  
  /**
   * Détermine le ratio de dépenses en fonction du nombre d'unités
   * @param {number} units Nombre d'unités
   * @returns {number} Ratio de dépenses (0-1)
   */
  static _getExpenseRatio(units) {
    if (units <= 2) return 0.30; // 30% pour 1-2 logements
    if (units <= 4) return 0.35; // 35% pour 3-4 logements
    if (units <= 6) return 0.45; // 45% pour 5-6 logements
    return 0.50; // 50% pour 7+ logements
  }
  
  /**
   * Calcule le paiement hypothécaire mensuel
   * @param {number} principal Montant du prêt
   * @param {number} annualRate Taux d'intérêt annuel (%)
   * @param {number} years Années d'amortissement
   * @returns {number} Paiement mensuel
   */
  static _calculateMortgagePayment(principal, annualRate, years) {
    const monthlyRate = annualRate / 100 / 12;
    const numPayments = years * 12;
    
    if (monthlyRate === 0) return principal / numPayments;
    
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
           (Math.pow(1 + monthlyRate, numPayments) - 1);
  }
}

module.exports = MultiDetailedCalculator;