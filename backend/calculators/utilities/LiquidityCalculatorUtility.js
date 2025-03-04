/**
 * LiquidityCalculatorUtility.js
 * Utilitaire pour calculer la liquidité et le MRB (Multiplicateur de Revenu Brut)
 * des investissements immobiliers selon la méthode "Les secrets de l'immobilier"
 */

class LiquidityCalculatorUtility {
  /**
   * Calcule la liquidité et divers indicateurs d'un immeuble à revenus
   * @param {Object} property Données de la propriété
   * @returns {Object} Résultats de l'analyse de liquidité
   */
  static calculateLiquidity(property) {
    if (!property) {
      throw new Error('Veuillez fournir les données de la propriété');
    }

    // Validation des données d'entrée essentielles
    const requiredFields = ['purchasePrice', 'units', 'grossAnnualRent'];
    for (const field of requiredFields) {
      if (!property[field] && property[field] !== 0) {
        throw new Error(`Le champ '${field}' est requis pour le calcul de liquidité`);
      }
    }

    // Extraction des données de base avec valeurs par défaut
    const purchasePrice = Number(property.purchasePrice) || 0;
    const renovationCost = Number(property.renovationCost) || 0;
    const units = Number(property.units) || 0;
    const grossAnnualRent = Number(property.grossAnnualRent) || 0;
    const grossMonthlyRent = grossAnnualRent / 12;
    const totalInvestment = purchasePrice + renovationCost;

    // Calcul du MRB (Multiplicateur de Revenu Brut)
    const mrb = grossAnnualRent > 0 ? purchasePrice / grossAnnualRent : 0;
    
    // Évaluation du MRB selon les standards du marché
    const mrbEvaluation = this._evaluateMRB(mrb);

    // Calcul des dépenses selon la méthode du module (% selon le nombre d'unités)
    const expenseRatio = this._getExpenseRatio(units);
    const annualExpenses = property.annualExpenses || (grossAnnualRent * expenseRatio);
    const monthlyExpenses = annualExpenses / 12;

    // Calcul du NOI (Revenu Net d'Exploitation)
    const noi = grossAnnualRent - annualExpenses;
    const monthlyNOI = noi / 12;

    // Taux de capitalisation
    const capRate = totalInvestment > 0 ? (noi / totalInvestment) * 100 : 0;

    // Calcul du financement hypothécaire
    const downPaymentRatio = property.downPaymentRatio || 0.25;
    const downPayment = totalInvestment * downPaymentRatio;
    const mortgageAmount = totalInvestment - downPayment;
    const interestRate = property.interestRate || 4.5;
    const amortizationYears = property.amortizationYears || 25;

    const annualMortgagePayment = this._calculateAnnualMortgagePayment(
      mortgageAmount,
      interestRate,
      amortizationYears
    );
    const monthlyMortgagePayment = annualMortgagePayment / 12;

    // Calcul de la liquidité (Cashflow)
    const annualCashflow = noi - annualMortgagePayment;
    const monthlyCashflow = annualCashflow / 12;
    const cashflowPerUnit = units > 0 ? monthlyCashflow / units : 0;
    
    // Évaluation du cashflow par porte selon les recommandations du module
    const cashflowEvaluation = this._evaluateCashflowPerUnit(cashflowPerUnit);

    // Calcul du rendement sur investissement (Cash-on-Cash Return)
    const cashOnCash = downPayment > 0 ? (annualCashflow / downPayment) * 100 : 0;

    // Retour détaillé des résultats
    return {
      summary: {
        mrb: mrb,
        mrbEvaluation: mrbEvaluation,
        capRate: capRate,
        cashflowPerUnit: cashflowPerUnit,
        cashflowEvaluation: cashflowEvaluation,
        cashOnCash: cashOnCash
      },
      investment: {
        totalInvestment: totalInvestment,
        purchasePrice: purchasePrice,
        renovationCost: renovationCost,
        downPayment: downPayment,
        mortgageAmount: mortgageAmount
      },
      income: {
        grossAnnualRent: grossAnnualRent,
        grossMonthlyRent: grossMonthlyRent,
        annualExpenses: annualExpenses,
        monthlyExpenses: monthlyExpenses,
        expenseRatio: expenseRatio,
        noi: noi,
        monthlyNOI: monthlyNOI
      },
      cashflow: {
        annualMortgagePayment: annualMortgagePayment,
        monthlyMortgagePayment: monthlyMortgagePayment,
        annualCashflow: annualCashflow,
        monthlyCashflow: monthlyCashflow,
        cashflowPerUnit: cashflowPerUnit
      },
      ratios: {
        mrb: mrb,
        capRate: capRate,
        cashOnCash: cashOnCash,
        expenseRatio: expenseRatio
      },
      evaluation: {
        mrbEvaluation: mrbEvaluation,
        cashflowEvaluation: cashflowEvaluation,
        overallEvaluation: this._calculateOverallEvaluation(mrbEvaluation, cashflowEvaluation, capRate)
      },
      recommendations: this._generateRecommendations(mrb, cashflowPerUnit, capRate)
    };
  }

  /**
   * Évalue la qualité du MRB selon les standards du marché
   * @param {number} mrb Multiplicateur de Revenu Brut
   * @returns {string} Évaluation qualitative du MRB
   */
  static _evaluateMRB(mrb) {
    if (mrb === 0) return 'Non applicable';
    if (mrb < 4) return 'Excellent';
    if (mrb < 6) return 'Très bon';
    if (mrb < 8) return 'Bon';
    if (mrb < 10) return 'Acceptable';
    if (mrb < 12) return 'Médiocre';
    return 'Risqué';
  }

  /**
   * Évalue la qualité du cashflow par unité selon les recommandations du module
   * @param {number} cashflowPerUnit Cashflow mensuel par unité
   * @returns {string} Évaluation qualitative du cashflow
   */
  static _evaluateCashflowPerUnit(cashflowPerUnit) {
    if (cashflowPerUnit >= 100) return 'Excellent';
    if (cashflowPerUnit >= 75) return 'Très bon';
    if (cashflowPerUnit >= 50) return 'Bon';
    if (cashflowPerUnit >= 25) return 'Acceptable';
    if (cashflowPerUnit >= 0) return 'Médiocre';
    return 'Négatif';
  }

  /**
   * Calcule une évaluation globale de l'investissement
   * @param {string} mrbEvaluation Évaluation du MRB
   * @param {string} cashflowEvaluation Évaluation du cashflow
   * @param {number} capRate Taux de capitalisation
   * @returns {string} Évaluation globale
   */
  static _calculateOverallEvaluation(mrbEvaluation, cashflowEvaluation, capRate) {
    const evaluationScores = {
      'Excellent': 5,
      'Très bon': 4,
      'Bon': 3,
      'Acceptable': 2,
      'Médiocre': 1,
      'Risqué': 0,
      'Négatif': 0,
      'Non applicable': 2
    };

    const mrbScore = evaluationScores[mrbEvaluation] || 0;
    const cashflowScore = evaluationScores[cashflowEvaluation] || 0;
    const capRateScore = capRate >= 6 ? 5 : capRate >= 5 ? 4 : capRate >= 4 ? 3 : capRate >= 3 ? 2 : 1;

    // Pondération: MRB (40%), Cashflow (40%), Cap Rate (20%)
    const weightedScore = (mrbScore * 0.4) + (cashflowScore * 0.4) + (capRateScore * 0.2);

    if (weightedScore >= 4.5) return 'Excellent investissement';
    if (weightedScore >= 3.5) return 'Très bon investissement';
    if (weightedScore >= 2.5) return 'Bon investissement';
    if (weightedScore >= 1.5) return 'Investissement acceptable';
    if (weightedScore >= 0.5) return 'Investissement risqué';
    return 'Investissement déconseillé';
  }

  /**
   * Génère des recommandations basées sur les indicateurs
   * @param {number} mrb Multiplicateur de Revenu Brut
   * @param {number} cashflowPerUnit Cashflow mensuel par unité
   * @param {number} capRate Taux de capitalisation
   * @returns {Array} Liste de recommandations
   */
  static _generateRecommendations(mrb, cashflowPerUnit, capRate) {
    const recommendations = [];

    // Recommandations basées sur le MRB
    if (mrb > 10) {
      recommendations.push('Le MRB est élevé. Essayez de négocier le prix d\'achat ou d\'augmenter les revenus.');
    } else if (mrb < 5) {
      recommendations.push('Le MRB est excellent. C\'est une opportunité à saisir rapidement.');
    }

    // Recommandations basées sur le cashflow par unité
    if (cashflowPerUnit < 0) {
      recommendations.push('Le cashflow est négatif. Reconsidérez cet investissement ou trouvez des moyens d\'augmenter les revenus/réduire les dépenses.');
    } else if (cashflowPerUnit < 50) {
      recommendations.push('Le cashflow par unité est faible. Cherchez des moyens d\'optimiser les revenus ou de réduire les dépenses.');
    } else if (cashflowPerUnit >= 100) {
      recommendations.push('Le cashflow par unité est excellent. Considérez une stratégie d\'achat et de conservation à long terme.');
    }

    // Recommandations basées sur le taux de capitalisation
    if (capRate < 4) {
      recommendations.push('Le taux de capitalisation est bas. Cherchez des moyens d\'augmenter la valeur ou les revenus de la propriété.');
    } else if (capRate > 8) {
      recommendations.push('Le taux de capitalisation est élevé. Vérifiez s\'il y a des risques cachés ou si c\'est une réelle opportunité.');
    }

    // Si tout va bien
    if (recommendations.length === 0) {
      recommendations.push('Cet investissement présente de bons indicateurs. Procédez à une analyse plus approfondie.');
    }

    return recommendations;
  }

  /**
   * Détermine le ratio de dépenses en fonction du nombre d'unités
   * selon les recommandations du module
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
   * Calcule le paiement hypothécaire annuel
   * @param {number} principal Montant du prêt
   * @param {number} annualRate Taux d'intérêt annuel (%)
   * @param {number} years Années d'amortissement
   * @returns {number} Paiement annuel
   */
  static _calculateAnnualMortgagePayment(principal, annualRate, years) {
    const monthlyRate = annualRate / 100 / 12;
    const numPayments = years * 12;
    
    if (monthlyRate === 0) return principal / years;
    
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                         (Math.pow(1 + monthlyRate, numPayments) - 1);
                         
    return monthlyPayment * 12;
  }

  /**
   * Calcule rapidement la liquidité selon la méthode NAPKIN du module
   * @param {Object} property Données simplifiées de la propriété (PAR)
   * @returns {Object} Résultats simplifiés
   */
  static quickNapkinCalculation(property) {
    if (!property) {
      throw new Error('Veuillez fournir les données de la propriété');
    }

    // Validation des données d'entrée essentielles pour le calcul NAPKIN
    const requiredFields = ['purchasePrice', 'units', 'grossAnnualRent'];
    for (const field of requiredFields) {
      if (!property[field] && property[field] !== 0) {
        throw new Error(`Le champ '${field}' est requis pour le calcul NAPKIN`);
      }
    }

    // Extraction des données de base (PAR: Prix, Appartements, Revenus)
    const purchasePrice = Number(property.purchasePrice) || 0;
    const units = Number(property.units) || 0;
    const grossAnnualRent = Number(property.grossAnnualRent) || 0;

    // Calcul des dépenses selon le % du revenu brut basé sur le nombre d'unités
    const expenseRatio = this._getExpenseRatio(units);
    const annualExpenses = property.annualExpenses || (grossAnnualRent * expenseRatio);

    // Calcul du NOI (Revenu Net d'Exploitation)
    const noi = grossAnnualRent - annualExpenses;

    // Calcul du financement mensuel selon la méthode HIGH-5 du module
    const monthlyMortgagePayment = purchasePrice * 0.005;
    const annualMortgagePayment = monthlyMortgagePayment * 12;

    // Calcul du cashflow
    const annualCashflow = noi - annualMortgagePayment;
    const monthlyCashflow = annualCashflow / 12;
    const cashflowPerUnit = units > 0 ? monthlyCashflow / units : 0;

    // Calcul du MRB
    const mrb = grossAnnualRent > 0 ? purchasePrice / grossAnnualRent : 0;

    // Retour des résultats simplifiés
    return {
      mrb: mrb,
      mrbEvaluation: this._evaluateMRB(mrb),
      grossAnnualRent: grossAnnualRent,
      annualExpenses: annualExpenses,
      expenseRatio: expenseRatio,
      noi: noi,
      annualMortgagePayment: annualMortgagePayment,
      annualCashflow: annualCashflow,
      monthlyCashflow: monthlyCashflow,
      cashflowPerUnit: cashflowPerUnit,
      cashflowEvaluation: this._evaluateCashflowPerUnit(cashflowPerUnit),
      recommendations: this._generateRecommendations(mrb, cashflowPerUnit, 0)
    };
  }

  /**
   * Calcule le prix d'achat maximal pour atteindre un cashflow par unité cible
   * @param {Object} property Données de la propriété
   * @param {number} targetCashflowPerUnit Cashflow cible par unité
   * @returns {Object} Prix d'achat maximal et détails
   */
  static calculateMaxPurchasePrice(property, targetCashflowPerUnit = 75) {
    if (!property) {
      throw new Error('Veuillez fournir les données de la propriété');
    }

    // Validation des données d'entrée essentielles
    const requiredFields = ['units', 'grossAnnualRent'];
    for (const field of requiredFields) {
      if (!property[field] && property[field] !== 0) {
        throw new Error(`Le champ '${field}' est requis pour le calcul du prix maximal`);
      }
    }

    const units = Number(property.units) || 0;
    const grossAnnualRent = Number(property.grossAnnualRent) || 0;
    const renovationCost = Number(property.renovationCost) || 0;
    const downPaymentRatio = property.downPaymentRatio || 0.25;
    const interestRate = property.interestRate || 4.5;
    const amortizationYears = property.amortizationYears || 25;

    // Calcul des dépenses
    const expenseRatio = this._getExpenseRatio(units);
    const annualExpenses = property.annualExpenses || (grossAnnualRent * expenseRatio);
    const noi = grossAnnualRent - annualExpenses;

    // Calcul du cashflow mensuel cible total
    const targetMonthlyCashflow = targetCashflowPerUnit * units;
    const targetAnnualCashflow = targetMonthlyCashflow * 12;

    // Calcul du paiement hypothécaire maximal
    const maxAnnualMortgagePayment = noi - targetAnnualCashflow;

    // Calcul du montant de prêt maximal basé sur le paiement hypothécaire maximal
    // Utilise la formule inverse du calcul de paiement hypothécaire
    let maxMortgageAmount = 0;
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = amortizationYears * 12;
    
    if (monthlyRate === 0) {
      maxMortgageAmount = maxAnnualMortgagePayment * amortizationYears;
    } else {
      const monthlyPayment = maxAnnualMortgagePayment / 12;
      maxMortgageAmount = monthlyPayment * ((Math.pow(1 + monthlyRate, numPayments) - 1) / 
                        (monthlyRate * Math.pow(1 + monthlyRate, numPayments)));
    }

    // Calcul du prix d'achat maximal
    const maxTotalInvestment = maxMortgageAmount / (1 - downPaymentRatio);
    const maxPurchasePrice = maxTotalInvestment - renovationCost;

    // Calcul du MRB correspondant
    const mrb = grossAnnualRent > 0 ? maxPurchasePrice / grossAnnualRent : 0;

    return {
      targetCashflowPerUnit: targetCashflowPerUnit,
      maxPurchasePrice: maxPurchasePrice,
      maxMortgageAmount: maxMortgageAmount,
      maxDownPayment: maxTotalInvestment * downPaymentRatio,
      maxAnnualMortgagePayment: maxAnnualMortgagePayment,
      maxMonthlyMortgagePayment: maxAnnualMortgagePayment / 12,
      mrb: mrb,
      mrbEvaluation: this._evaluateMRB(mrb)
    };
  }
}

module.exports = LiquidityCalculatorUtility;
