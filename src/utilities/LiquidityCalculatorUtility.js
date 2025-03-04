/**
 * Utilitaire de calcul pour l'analyse de liquidité et de rentabilité immobilière
 * Cet utilitaire fournit des fonctions pour analyser les aspects financiers
 * d'un investissement immobilier, y compris:
 * - Calcul de liquidité (cashflow)
 * - Analyse de rentabilité
 * - Analyse de sensibilité
 * - Points d'équilibre
 * - Analyse des risques
 */

class LiquidityCalculatorUtility {
  /**
   * Calcule les indicateurs de liquidité d'un investissement immobilier
   * @param {Object} propertyData - Données de la propriété
   * @returns {Object} Résultats des calculs de liquidité
   */
  static calculateLiquidity(propertyData) {
    // 1. Calculer le cashflow
    const cashflow = this.calculateCashflow(propertyData);
    
    // 2. Calculer les ratios financiers
    const ratios = this.calculateFinancialRatios(propertyData, cashflow);
    
    return {
      cashflow,
      ratios
    };
  }
  
  /**
   * Calcule le cashflow d'une propriété
   * @param {Object} propertyData - Données de la propriété
   * @returns {Object} Résultats du calcul de cashflow
   */
  static calculateCashflow(propertyData) {
    // Extraire les données nécessaires
    const {
      purchasePrice,
      grossAnnualRent,
      units,
      downPaymentRatio,
      interestRate,
      amortizationYears,
      expenseRatio,
      vacancyRate
    } = propertyData;
    
    // Calcul des revenus après déduction du taux d'inoccupation
    const annualRevenueAfterVacancy = grossAnnualRent * (1 - vacancyRate / 100);
    
    // Calcul des dépenses annuelles
    const annualExpenses = grossAnnualRent * (expenseRatio / 100);
    
    // Calcul du revenu net d'exploitation (NOI)
    const netOperatingIncome = annualRevenueAfterVacancy - annualExpenses;
    
    // Calcul de l'hypothèque
    const loanAmount = purchasePrice * (1 - downPaymentRatio);
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = amortizationYears * 12;
    
    // Formule de calcul d'un prêt avec versements mensuels constants
    let monthlyMortgagePayment = 0;
    if (monthlyInterestRate > 0) {
      monthlyMortgagePayment = loanAmount * 
        (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    } else {
      // Si taux d'intérêt est 0, simple division
      monthlyMortgagePayment = loanAmount / numberOfPayments;
    }
    
    const annualMortgagePayment = monthlyMortgagePayment * 12;
    
    // Calcul du cashflow
    const annualCashflow = netOperatingIncome - annualMortgagePayment;
    const monthlyCashflow = annualCashflow / 12;
    const cashflowPerUnit = units > 0 ? monthlyCashflow / units : 0;
    
    return {
      annualRevenueAfterVacancy,
      annualExpenses,
      netOperatingIncome,
      annualMortgagePayment,
      annualCashflow,
      monthlyCashflow,
      cashflowPerUnit
    };
  }
  
  /**
   * Calcule les ratios financiers
   * @param {Object} propertyData - Données de la propriété
   * @param {Object} cashflow - Résultats du calcul de cashflow
   * @returns {Object} Ratios financiers
   */
  static calculateFinancialRatios(propertyData, cashflow) {
    const { purchasePrice, grossAnnualRent } = propertyData;
    const { netOperatingIncome, annualMortgagePayment } = cashflow;
    
    // Taux de capitalisation (Cap Rate) = NOI / Prix d'achat
    const capRate = (netOperatingIncome / purchasePrice) * 100;
    
    // Ratio Loyer/Valeur = Revenu locatif brut annuel / Prix d'achat
    const rentToValue = (grossAnnualRent / purchasePrice) * 100;
    
    // Ratio de couverture du service de la dette (DSCR) = NOI / Paiement hypothécaire annuel
    const dscr = annualMortgagePayment > 0 ? netOperatingIncome / annualMortgagePayment : 0;
    
    // Multiplicateur de revenu brut (GRM) = Prix d'achat / Revenu locatif brut annuel
    const grm = grossAnnualRent > 0 ? purchasePrice / grossAnnualRent : 0;
    
    // Ratio MRB (Multiple du Revenu Brut inversé) = 1 / GRM
    const mrb = grm > 0 ? 1 / grm : 0;
    
    return {
      capRate,
      rentToValue,
      dscr,
      grm,
      mrb
    };
  }
  
  /**
   * Calcule le rendement total d'un investissement immobilier
   * @param {Object} propertyData - Données de la propriété
   * @returns {Object} Résultats des calculs de rendement
   */
  static calculateTotalReturn(propertyData) {
    const {
      purchasePrice,
      renovationCost,
      downPaymentRatio,
      interestRate,
      amortizationYears,
      appreciationRate,
      holdingPeriod
    } = propertyData;
    
    // Calculer le cashflow pour obtenir le revenu mensuel
    const cashflowResults = this.calculateCashflow(propertyData);
    
    // Calcul de l'investissement initial
    const downPayment = purchasePrice * downPaymentRatio;
    const totalInvestment = downPayment + renovationCost;
    
    // Valeur future de la propriété
    const futurePropertyValue = purchasePrice * Math.pow(1 + appreciationRate / 100, holdingPeriod);
    
    // Calcul de l'équité générée par le remboursement du prêt
    const loanAmount = purchasePrice * (1 - downPaymentRatio);
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = amortizationYears * 12;
    const numberOfPaymentsMade = Math.min(holdingPeriod * 12, numberOfPayments);
    
    // Calculer le solde restant du prêt après la période de détention
    let remainingLoanBalance = loanAmount;
    if (monthlyInterestRate > 0) {
      remainingLoanBalance = this.calculateRemainingLoanBalance(
        loanAmount,
        monthlyInterestRate,
        numberOfPayments,
        numberOfPaymentsMade
      );
    } else {
      // Si taux d'intérêt est 0, simple amortissement linéaire
      remainingLoanBalance = loanAmount * (1 - numberOfPaymentsMade / numberOfPayments);
    }
    
    const equityGainFromLoanPaydown = loanAmount - remainingLoanBalance;
    
    // Cashflow cumulé sur la période de détention
    const cumulativeCashflow = cashflowResults.annualCashflow * holdingPeriod;
    
    // Gain en capital (appréciation)
    const capitalGain = futurePropertyValue - purchasePrice;
    
    // Gain total
    const totalGain = capitalGain + equityGainFromLoanPaydown + cumulativeCashflow;
    
    // ROI total sur la période
    const totalROI = totalInvestment > 0 ? (totalGain / totalInvestment) * 100 : 0;
    
    // ROI annualisé
    const annualizedROI = holdingPeriod > 0 ? totalROI / holdingPeriod : 0;
    
    return {
      initialInvestment: {
        downPayment,
        renovationCost,
        totalInvestment
      },
      futureValue: {
        initialPropertyValue: purchasePrice,
        finalPropertyValue: futurePropertyValue,
        appreciationRate
      },
      gains: {
        capitalGain,
        equityGainFromLoanPaydown,
        cumulativeCashflow,
        totalGain
      },
      returns: {
        totalROI,
        annualizedROI
      },
      details: {
        holdingPeriod,
        monthlyCashflow: cashflowResults.monthlyCashflow,
        annualCashflow: cashflowResults.annualCashflow
      }
    };
  }
  
  /**
   * Calcule le solde restant d'un prêt après un certain nombre de paiements
   * @param {Number} principal - Capital initial
   * @param {Number} monthlyRate - Taux d'intérêt mensuel
   * @param {Number} totalPayments - Nombre total de paiements
   * @param {Number} paymentsMade - Nombre de paiements effectués
   * @returns {Number} Solde restant du prêt
   */
  static calculateRemainingLoanBalance(principal, monthlyRate, totalPayments, paymentsMade) {
    // Calcul du paiement mensuel
    const monthlyPayment = principal * 
      (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
      (Math.pow(1 + monthlyRate, totalPayments) - 1);
    
    // Calcul du solde restant après un certain nombre de paiements
    const remainingBalance = principal * 
      (Math.pow(1 + monthlyRate, totalPayments) - Math.pow(1 + monthlyRate, paymentsMade)) / 
      (Math.pow(1 + monthlyRate, totalPayments) - 1);
    
    return remainingBalance;
  }
  
  /**
   * Effectue une analyse de sensibilité
   * @param {Object} propertyData - Données de la propriété
   * @returns {Object} Résultats de l'analyse de sensibilité
   */
  static performSensitivityAnalysis(propertyData) {
    const baseCase = {
      interestRate: propertyData.interestRate,
      vacancyRate: propertyData.vacancyRate,
      expenseRatio: propertyData.expenseRatio
    };
    
    // 1. Sensibilité au taux d'intérêt
    const interestRateSensitivity = this.analyzeInterestRateSensitivity(propertyData);
    
    // 2. Sensibilité au taux d'inoccupation
    const vacancyRateSensitivity = this.analyzeVacancyRateSensitivity(propertyData);
    
    // 3. Sensibilité au ratio de dépenses
    const expenseRatioSensitivity = this.analyzeExpenseRatioSensitivity(propertyData);
    
    // 4. Sensibilité au loyer
    const rentSensitivity = this.analyzeRentSensitivity(propertyData);
    
    return {
      baseCase,
      sensitivityResults: {
        interestRate: interestRateSensitivity,
        vacancyRate: vacancyRateSensitivity,
        expenseRatio: expenseRatioSensitivity,
        rent: rentSensitivity
      }
    };
  }
  
  /**
   * Analyse la sensibilité au taux d'intérêt
   * @param {Object} propertyData - Données de la propriété
   * @returns {Array} Résultats de l'analyse
   */
  static analyzeInterestRateSensitivity(propertyData) {
    const baseInterestRate = propertyData.interestRate;
    const results = [];
    
    // Variations du taux d'intérêt de -2% à +3% par incréments de 1%
    for (let variation = -2; variation <= 3; variation++) {
      const modifiedPropertyData = { ...propertyData };
      modifiedPropertyData.interestRate = Math.max(0.1, baseInterestRate + variation);
      
      const cashflow = this.calculateCashflow(modifiedPropertyData);
      const ratios = this.calculateFinancialRatios(modifiedPropertyData, cashflow);
      
      results.push({
        variation,
        interestRate: modifiedPropertyData.interestRate,
        cashflowPerUnit: cashflow.cashflowPerUnit,
        monthlyCashflow: cashflow.monthlyCashflow,
        dscr: ratios.dscr,
        capRate: ratios.capRate
      });
    }
    
    return results;
  }
  
  /**
   * Analyse la sensibilité au taux d'inoccupation
   * @param {Object} propertyData - Données de la propriété
   * @returns {Array} Résultats de l'analyse
   */
  static analyzeVacancyRateSensitivity(propertyData) {
    const results = [];
    
    // Variations du taux d'inoccupation: 0%, 2%, 5%, 8%, 10%, 15%
    const vacancyRates = [0, 2, 5, 8, 10, 15];
    
    for (const vacancyRate of vacancyRates) {
      const modifiedPropertyData = { ...propertyData };
      modifiedPropertyData.vacancyRate = vacancyRate;
      
      const cashflow = this.calculateCashflow(modifiedPropertyData);
      const ratios = this.calculateFinancialRatios(modifiedPropertyData, cashflow);
      
      results.push({
        vacancyRate,
        cashflowPerUnit: cashflow.cashflowPerUnit,
        monthlyCashflow: cashflow.monthlyCashflow,
        dscr: ratios.dscr,
        capRate: ratios.capRate
      });
    }
    
    return results;
  }
  
  /**
   * Analyse la sensibilité au ratio de dépenses
   * @param {Object} propertyData - Données de la propriété
   * @returns {Array} Résultats de l'analyse
   */
  static analyzeExpenseRatioSensitivity(propertyData) {
    const baseExpenseRatio = propertyData.expenseRatio;
    const results = [];
    
    // Variations du ratio de dépenses de -10% à +15% par incréments de 5%
    for (let variation = -10; variation <= 15; variation += 5) {
      const modifiedPropertyData = { ...propertyData };
      modifiedPropertyData.expenseRatio = Math.max(10, baseExpenseRatio + variation);
      
      const cashflow = this.calculateCashflow(modifiedPropertyData);
      const ratios = this.calculateFinancialRatios(modifiedPropertyData, cashflow);
      
      results.push({
        variation,
        expenseRatio: modifiedPropertyData.expenseRatio,
        cashflowPerUnit: cashflow.cashflowPerUnit,
        monthlyCashflow: cashflow.monthlyCashflow,
        dscr: ratios.dscr,
        capRate: ratios.capRate
      });
    }
    
    return results;
  }
  
  /**
   * Analyse la sensibilité au loyer
   * @param {Object} propertyData - Données de la propriété
   * @returns {Array} Résultats de l'analyse
   */
  static analyzeRentSensitivity(propertyData) {
    const baseRent = propertyData.grossAnnualRent;
    const results = [];
    
    // Variations du loyer de -15% à +15% par incréments de 5%
    for (let variation = -15; variation <= 15; variation += 5) {
      const modifiedPropertyData = { ...propertyData };
      modifiedPropertyData.grossAnnualRent = baseRent * (1 + variation / 100);
      
      const cashflow = this.calculateCashflow(modifiedPropertyData);
      const ratios = this.calculateFinancialRatios(modifiedPropertyData, cashflow);
      
      results.push({
        variation,
        grossAnnualRent: modifiedPropertyData.grossAnnualRent,
        cashflowPerUnit: cashflow.cashflowPerUnit,
        monthlyCashflow: cashflow.monthlyCashflow,
        dscr: ratios.dscr,
        capRate: ratios.capRate
      });
    }
    
    return results;
  }
  
  /**
   * Calcule les points d'équilibre
   * @param {Object} propertyData - Données de la propriété
   * @returns {Object} Résultats du calcul des points d'équilibre
   */
  static calculateBreakeven(propertyData) {
    const baseResults = this.calculateLiquidity(propertyData);
    
    // 1. Point d'équilibre d'occupation
    const breakEvenOccupancyRate = this.calculateBreakEvenOccupancyRate(propertyData, baseResults);
    
    // 2. Point d'équilibre de loyer
    const { breakEvenRentPercent, minimumMonthlyRentPerUnit } = this.calculateBreakEvenRent(propertyData, baseResults);
    
    // 3. Taux d'intérêt maximum
    const maxInterestRate = this.calculateMaxInterestRate(propertyData, baseResults);
    
    // Calcul des marges de sécurité
    const occupancyMargin = Math.max(0, 100 - propertyData.vacancyRate - breakEvenOccupancyRate);
    const rentMargin = Math.max(0, 100 - breakEvenRentPercent);
    const interestRateMargin = Math.max(0, maxInterestRate - propertyData.interestRate);
    
    return {
      breakEvenPoints: {
        occupancyRate: breakEvenOccupancyRate.toFixed(1),
        rentPercent: breakEvenRentPercent.toFixed(1),
        minimumMonthlyRentPerUnit,
        maxInterestRate: maxInterestRate.toFixed(2)
      },
      safety: {
        occupancyMargin: occupancyMargin.toFixed(1),
        rentMargin: rentMargin.toFixed(1),
        interestRateMargin: interestRateMargin.toFixed(2)
      }
    };
  }
  
  /**
   * Calcule le taux d'occupation minimum requis pour atteindre le point d'équilibre
   * @param {Object} propertyData - Données de la propriété
   * @param {Object} baseResults - Résultats de base des calculs de liquidité
   * @returns {Number} Taux d'occupation minimum
   */
  static calculateBreakEvenOccupancyRate(propertyData, baseResults) {
    const { annualMortgagePayment, annualExpenses } = baseResults.cashflow;
    const grossAnnualRent = propertyData.grossAnnualRent;
    
    if (grossAnnualRent <= 0) return 100;
    
    // Pour atteindre le point d'équilibre, le revenu après inoccupation doit couvrir les dépenses et l'hypothèque
    // Revenu * (1 - TauxInoccupation/100) = Dépenses + Hypothèque
    // TauxInoccupation = (1 - (Dépenses + Hypothèque) / Revenu) * 100
    const breakEvenVacancyRate = (1 - (annualExpenses + annualMortgagePayment) / grossAnnualRent) * 100;
    
    // Le taux d'occupation minimum est 100% - taux d'inoccupation au point d'équilibre
    return Math.min(100, Math.max(0, 100 - breakEvenVacancyRate));
  }
  
  /**
   * Calcule le pourcentage minimum du loyer actuel requis pour atteindre le point d'équilibre
   * @param {Object} propertyData - Données de la propriété
   * @param {Object} baseResults - Résultats de base des calculs de liquidité
   * @returns {Object} Pourcentage du loyer et loyer mensuel minimum par unité
   */
  static calculateBreakEvenRent(propertyData, baseResults) {
    const { annualMortgagePayment } = baseResults.cashflow;
    const { grossAnnualRent, expenseRatio, vacancyRate, units } = propertyData;
    
    if (grossAnnualRent <= 0) return { breakEvenRentPercent: 100, minimumMonthlyRentPerUnit: 0 };
    
    // Pour atteindre le point d'équilibre:
    // Revenu * (1 - VacancyRate/100) - (Revenu * ExpenseRatio/100) = Hypothèque
    // Revenu * [(1 - VacancyRate/100) - (ExpenseRatio/100)] = Hypothèque
    // Revenu = Hypothèque / [(1 - VacancyRate/100) - (ExpenseRatio/100)]
    const effectiveRate = (1 - vacancyRate/100) - (expenseRatio/100);
    
    if (effectiveRate <= 0) return { breakEvenRentPercent: 100, minimumMonthlyRentPerUnit: 0 };
    
    const breakEvenAnnualRent = annualMortgagePayment / effectiveRate;
    const breakEvenRentPercent = (breakEvenAnnualRent / grossAnnualRent) * 100;
    
    // Calcul du loyer mensuel minimum par unité
    const minimumMonthlyRentPerUnit = units > 0 ? (breakEvenAnnualRent / 12) / units : 0;
    
    return { 
      breakEvenRentPercent: Math.min(100, Math.max(0, breakEvenRentPercent)),
      minimumMonthlyRentPerUnit
    };
  }
  
  /**
   * Calcule le taux d'intérêt maximum que peut supporter l'investissement
   * @param {Object} propertyData - Données de la propriété
   * @param {Object} baseResults - Résultats de base des calculs de liquidité
   * @returns {Number} Taux d'intérêt maximum
   */
  static calculateMaxInterestRate(propertyData, baseResults) {
    const { netOperatingIncome } = baseResults.cashflow;
    const { purchasePrice, downPaymentRatio, amortizationYears } = propertyData;
    
    // Montant du prêt
    const loanAmount = purchasePrice * (1 - downPaymentRatio);
    if (loanAmount <= 0 || netOperatingIncome <= 0) return 0;
    
    // Nombre de paiements
    const numberOfPayments = amortizationYears * 12;
    
    // Pour trouver le taux d'intérêt maximum, nous devons résoudre l'équation du paiement hypothécaire
    // pour le taux d'intérêt, en sachant que le paiement annuel maximum est égal au NOI
    // Ceci est complexe et nécessite une approche itérative
    
    // Approche simplifiée: utiliser une recherche binaire pour trouver le taux d'intérêt maximum
    let low = 0;
    let high = 50; // Limite supérieure arbitraire de 50%
    const tolerance = 0.001;
    
    while (high - low > tolerance) {
      const mid = (low + high) / 2;
      const monthlyInterestRate = mid / 100 / 12;
      
      // Calcul du paiement hypothécaire mensuel avec le taux d'intérêt actuel
      let monthlyMortgagePayment = 0;
      if (monthlyInterestRate > 0) {
        monthlyMortgagePayment = loanAmount * 
          (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
          (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
      } else {
        monthlyMortgagePayment = loanAmount / numberOfPayments;
      }
      
      const annualMortgagePayment = monthlyMortgagePayment * 12;
      
      // Si le paiement hypothécaire est supérieur au NOI, le taux est trop élevé
      if (annualMortgagePayment > netOperatingIncome) {
        high = mid;
      } else {
        low = mid;
      }
    }
    
    return low;
  }
  
  /**
   * Analyse les risques de l'investissement
   * @param {Object} propertyData - Données de la propriété
   * @returns {Object} Résultats de l'analyse des risques
   */
  static analyzeRisks(propertyData) {
    const baseResults = this.calculateLiquidity(propertyData);
    const { cashflow, ratios } = baseResults;
    
    // 1. Identifier les facteurs de risque
    const riskFactors = {};
    
    // Risque lié au cashflow
    if (cashflow.cashflowPerUnit <= 0) {
      riskFactors.cashflow = { level: 'Élevé', description: 'Aucun cashflow positif par unité' };
    } else if (cashflow.cashflowPerUnit < 50) {
      riskFactors.cashflow = { level: 'Moyen', description: 'Cashflow positif mais faible par unité' };
    } else {
      riskFactors.cashflow = { level: 'Faible', description: 'Bon cashflow par unité' };
    }
    
    // Risque lié au DSCR
    if (ratios.dscr < 1) {
      riskFactors.dscr = { level: 'Élevé', description: 'Le NOI ne couvre pas le service de la dette' };
    } else if (ratios.dscr < 1.2) {
      riskFactors.dscr = { level: 'Moyen', description: 'Couverture du service de la dette limitée' };
    } else {
      riskFactors.dscr = { level: 'Faible', description: 'Bonne couverture du service de la dette' };
    }
    
    // Risque lié au ratio prêt/valeur (LVR)
    const lvr = (1 - propertyData.downPaymentRatio) * 100;
    if (lvr > 80) {
      riskFactors.lvr = { level: 'Élevé', description: 'Ratio prêt/valeur élevé' };
    } else if (lvr > 70) {
      riskFactors.lvr = { level: 'Moyen', description: 'Ratio prêt/valeur modéré' };
    } else {
      riskFactors.lvr = { level: 'Faible', description: 'Ratio prêt/valeur conservateur' };
    }
    
    // Risque lié au taux d'inoccupation
    if (propertyData.vacancyRate > 8) {
      riskFactors.vacancy = { level: 'Élevé', description: 'Taux d\'inoccupation élevé' };
    } else if (propertyData.vacancyRate > 5) {
      riskFactors.vacancy = { level: 'Moyen', description: 'Taux d\'inoccupation modéré' };
    } else {
      riskFactors.vacancy = { level: 'Faible', description: 'Taux d\'inoccupation faible' };
    }
    
    // Risque lié au taux d'intérêt
    if (propertyData.interestRate > 5) {
      riskFactors.interestRate = { level: 'Élevé', description: 'Taux d\'intérêt élevé' };
    } else if (propertyData.interestRate > 3.5) {
      riskFactors.interestRate = { level: 'Moyen', description: 'Taux d\'intérêt modéré' };
    } else {
      riskFactors.interestRate = { level: 'Faible', description: 'Taux d\'intérêt faible' };
    }
    
    // 2. Calculer un score de risque global
    const riskLevels = {
      'Élevé': 3,
      'Moyen': 2,
      'Faible': 1
    };
    
    let totalRiskScore = 0;
    let maxPossibleScore = 0;
    
    for (const factor in riskFactors) {
      totalRiskScore += riskLevels[riskFactors[factor].level];
      maxPossibleScore += 3; // 3 est le score maximum pour un facteur (niveau Élevé)
    }
    
    const riskScorePercentage = (totalRiskScore / maxPossibleScore) * 100;
    
    // Déterminer le niveau de risque global
    let overallRisk;
    if (riskScorePercentage >= 70) {
      overallRisk = 'Élevé';
    } else if (riskScorePercentage >= 40) {
      overallRisk = 'Modéré';
    } else {
      overallRisk = 'Faible';
    }
    
    // 3. Générer des recommandations
    const recommendations = [];
    
    if (riskFactors.cashflow.level === 'Élevé') {
      recommendations.push('Augmenter les loyers ou réduire les dépenses pour améliorer le cashflow');
    }
    
    if (riskFactors.dscr.level === 'Élevé') {
      recommendations.push('Augmenter la mise de fonds pour réduire les paiements hypothécaires');
    }
    
    if (riskFactors.lvr.level === 'Élevé') {
      recommendations.push('Envisager une mise de fonds plus importante pour réduire le ratio prêt/valeur');
    }
    
    if (riskFactors.vacancy.level === 'Élevé') {
      recommendations.push('Vérifier les tendances locatives dans la région et envisager des améliorations pour réduire l\'inoccupation');
    }
    
    // 4. Effectuer des tests de stress
    const stressTest = this.performStressTests(propertyData);
    
    return {
      riskFactors,
      riskScore: Math.round(riskScorePercentage),
      overallRisk,
      recommendations,
      stressTest
    };
  }
  
  /**
   * Effectue des tests de stress sur l'investissement
   * @param {Object} propertyData - Données de la propriété
   * @returns {Object} Résultats des tests de stress
   */
  static performStressTests(propertyData) {
    // 1. Taux d'intérêt +3%
    const interestRateStressData = { ...propertyData };
    interestRateStressData.interestRate += 3;
    const interestRateStressResults = this.calculateLiquidity(interestRateStressData);
    
    // 2. Taux d'inoccupation de 10%
    const vacancyStressData = { ...propertyData };
    vacancyStressData.vacancyRate = 10;
    const vacancyStressResults = this.calculateLiquidity(vacancyStressData);
    
    // 3. Augmentation des dépenses de 15%
    const expenseStressData = { ...propertyData };
    expenseStressData.expenseRatio += 15;
    const expenseStressResults = this.calculateLiquidity(expenseStressData);
    
    // 4. Combinaison de stress (intérêt +2%, inoccupation 5%, dépenses +10%)
    const combinedStressData = { ...propertyData };
    combinedStressData.interestRate += 2;
    combinedStressData.vacancyRate = Math.max(5, combinedStressData.vacancyRate);
    combinedStressData.expenseRatio += 10;
    const combinedStressResults = this.calculateLiquidity(combinedStressData);
    
    return {
      interestRateIncrease3: {
        cashflowPerUnit: interestRateStressResults.cashflow.cashflowPerUnit,
        dscr: interestRateStressResults.ratios.dscr,
        interestRate: interestRateStressData.interestRate
      },
      vacancy10Percent: {
        cashflowPerUnit: vacancyStressResults.cashflow.cashflowPerUnit,
        dscr: vacancyStressResults.ratios.dscr,
        vacancyRate: vacancyStressData.vacancyRate
      },
      expenseIncrease15Percent: {
        cashflowPerUnit: expenseStressResults.cashflow.cashflowPerUnit,
        dscr: expenseStressResults.ratios.dscr,
        expenseRatio: expenseStressData.expenseRatio
      },
      combinedStress: {
        cashflowPerUnit: combinedStressResults.cashflow.cashflowPerUnit,
        dscr: combinedStressResults.ratios.dscr,
        interestRate: combinedStressData.interestRate,
        vacancyRate: combinedStressData.vacancyRate,
        expenseRatio: combinedStressData.expenseRatio
      }
    };
  }
}

export default LiquidityCalculatorUtility;