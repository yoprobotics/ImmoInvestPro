/**
 * Utilitaire pour calculer les métriques de liquidité et de rentabilité des investissements immobiliers
 */
class LiquidityCalculatorUtility {
  /**
   * Valide les données d'entrée de la propriété
   * @param {Object} property - Objet contenant les détails de la propriété
   * @private
   */
  static _validatePropertyData(property) {
    // Validation des données requises
    if (!property) {
      throw new Error('Les données de la propriété sont requises');
    }
    
    if (!property.purchasePrice || property.purchasePrice <= 0) {
      throw new Error('Le prix d\'achat doit être un nombre positif');
    }
    
    if (!property.grossAnnualRent || property.grossAnnualRent <= 0) {
      throw new Error('Le revenu locatif annuel brut doit être un nombre positif');
    }
    
    if (!property.units || property.units <= 0) {
      throw new Error('Le nombre d\'unités doit être un nombre positif');
    }
    
    if (property.interestRate === undefined || property.interestRate <= 0) {
      throw new Error('Le taux d\'intérêt doit être un nombre positif');
    }
    
    if (property.amortizationYears === undefined || property.amortizationYears <= 0) {
      throw new Error('La période d\'amortissement doit être un nombre positif');
    }
  }
  
  /**
   * Calcule les métriques de liquidité pour un investissement immobilier
   * @param {Object} property - Objet contenant les détails de la propriété
   * @returns {Object} - Résultats des calculs de liquidité
   */
  static calculateLiquidity(property) {
    // Validation des données d'entrée
    this._validatePropertyData(property);
    
    // Extraction des paramètres avec valeurs par défaut
    const { 
      purchasePrice, 
      grossAnnualRent, 
      units,
      renovationCost = 0,
      downPaymentRatio = 0.25,
      interestRate,
      amortizationYears,
      expenseRatio = 40,
      vacancyRate = 0
    } = property;
    
    // Calcul du revenu annuel net après inoccupation
    const annualRevenueAfterVacancy = grossAnnualRent * (1 - vacancyRate / 100);
    
    // Calcul des dépenses annuelles
    const annualExpenses = annualRevenueAfterVacancy * (expenseRatio / 100);
    
    // Revenu net d'exploitation
    const netOperatingIncome = annualRevenueAfterVacancy - annualExpenses;
    
    // Calcul du paiement hypothécaire
    const loanAmount = purchasePrice * (1 - downPaymentRatio);
    const monthlyRate = interestRate / 100 / 12;
    const totalPayments = amortizationYears * 12;
    
    const monthlyMortgagePayment = loanAmount * (
      monthlyRate * Math.pow(1 + monthlyRate, totalPayments)
    ) / (
      Math.pow(1 + monthlyRate, totalPayments) - 1
    );
    
    const annualMortgagePayment = monthlyMortgagePayment * 12;
    
    // Calcul du cashflow
    const annualCashflow = netOperatingIncome - annualMortgagePayment;
    const monthlyCashflow = annualCashflow / 12;
    const cashflowPerUnit = monthlyCashflow / units;
    
    // Calcul des ratios
    const capRate = (netOperatingIncome / (purchasePrice + renovationCost)) * 100;
    const rentToValue = (grossAnnualRent / purchasePrice) * 100;
    const dscr = netOperatingIncome / annualMortgagePayment;
    const grm = purchasePrice / grossAnnualRent;
    const mrb = grossAnnualRent / purchasePrice;
    
    return {
      cashflow: {
        annualRevenueAfterVacancy,
        annualExpenses,
        netOperatingIncome,
        annualMortgagePayment,
        annualCashflow,
        monthlyCashflow,
        cashflowPerUnit
      },
      ratios: {
        capRate,
        rentToValue,
        dscr,
        grm,
        mrb
      }
    };
  }

  /**
   * Calcule le rendement total d'un investissement immobilier sur une période donnée
   * @param {Object} property - Objet contenant les détails de la propriété
   * @returns {Object} - Résultats du calcul de rendement total
   */
  static calculateTotalReturn(property) {
    // Validation des données d'entrée
    this._validatePropertyData(property);
    
    // Calculs de base de liquidité
    const liquidityResults = this.calculateLiquidity(property);
    
    // Paramètres requis
    const { 
      purchasePrice, 
      downPaymentRatio = 0.25, 
      appreciationRate = 2, 
      holdingPeriod = 5,
      renovationCost = 0
    } = property;
    
    const downPayment = purchasePrice * downPaymentRatio;
    const totalInvestment = downPayment + renovationCost;
    
    // Calcul de l'appréciation du capital
    const futureValue = purchasePrice * Math.pow(1 + (appreciationRate / 100), holdingPeriod);
    const capitalGain = futureValue - purchasePrice;
    
    // Calcul de l'équité constituée par le remboursement du prêt
    const loanAmount = purchasePrice * (1 - downPaymentRatio);
    const equityGainFromLoanPaydown = this._calculateEquityFromLoanPaydown(
      loanAmount, 
      property.interestRate, 
      property.amortizationYears, 
      holdingPeriod
    );
    
    // Calcul du cashflow cumulé
    const annualCashflow = liquidityResults.cashflow.annualCashflow;
    const cumulativeCashflow = annualCashflow * holdingPeriod;
    
    // Calcul du retour sur investissement total
    const totalGain = capitalGain + equityGainFromLoanPaydown + cumulativeCashflow;
    const totalROI = (totalGain / totalInvestment) * 100;
    const annualizedROI = Math.pow(1 + (totalROI / 100), 1 / holdingPeriod) * 100 - 100;
    
    return {
      initialInvestment: {
        downPayment,
        renovationCost,
        totalInvestment
      },
      futureValue: {
        initialPropertyValue: purchasePrice,
        finalPropertyValue: futureValue,
        appreciationRate: appreciationRate
      },
      gains: {
        capitalGain,
        equityGainFromLoanPaydown,
        cumulativeCashflow,
        totalGain
      },
      returns: {
        totalROI: parseFloat(totalROI.toFixed(2)),
        annualizedROI: parseFloat(annualizedROI.toFixed(2))
      },
      details: {
        holdingPeriod,
        monthlyCashflow: liquidityResults.cashflow.monthlyCashflow,
        annualCashflow
      }
    };
  }

  /**
   * Calcule l'équité constituée par le remboursement du prêt
   * @param {number} loanAmount - Montant initial du prêt
   * @param {number} interestRate - Taux d'intérêt en pourcentage
   * @param {number} amortizationYears - Durée d'amortissement en années
   * @param {number} holdingPeriod - Période de détention en années
   * @returns {number} - Montant de l'équité constituée
   * @private
   */
  static _calculateEquityFromLoanPaydown(loanAmount, interestRate, amortizationYears, holdingPeriod) {
    const monthlyRate = interestRate / 100 / 12;
    const totalPayments = amortizationYears * 12;
    
    const monthlyPayment = loanAmount * (
      monthlyRate * Math.pow(1 + monthlyRate, totalPayments)
    ) / (
      Math.pow(1 + monthlyRate, totalPayments) - 1
    );
    
    let remainingBalance = loanAmount;
    let accumulatedPrincipal = 0;
    
    for (let i = 0; i < holdingPeriod * 12; i++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      
      remainingBalance -= principalPayment;
      accumulatedPrincipal += principalPayment;
    }
    
    return accumulatedPrincipal;
  }

  /**
   * Effectue une analyse de sensibilité pour évaluer l'impact des changements de paramètres
   * @param {Object} property - Objet contenant les détails de la propriété
   * @param {Object} options - Options pour l'analyse de sensibilité
   * @returns {Object} - Résultats de l'analyse de sensibilité
   */
  static performSensitivityAnalysis(property, options = {}) {
    // Validation des données d'entrée
    this._validatePropertyData(property);
    
    // Paramètres par défaut pour l'analyse de sensibilité
    const {
      interestRateVariations = [-1, -0.5, 0, 0.5, 1, 2],
      vacancyRateVariations = [0, 2, 5, 10],
      expenseRatioVariations = [-5, 0, 5, 10],
      rentVariations = [-10, -5, 0, 5, 10]
    } = options;
    
    // Base case calculation
    const baseCaseResults = this.calculateLiquidity(property);
    
    // Analyse de sensibilité pour le taux d'intérêt
    const interestRateSensitivity = interestRateVariations.map(variation => {
      const modifiedProperty = { ...property, interestRate: property.interestRate + variation };
      const results = this.calculateLiquidity(modifiedProperty);
      return {
        variation: variation > 0 ? `+${variation}` : variation,
        interestRate: modifiedProperty.interestRate,
        monthlyCashflow: results.cashflow.monthlyCashflow,
        cashflowPerUnit: results.cashflow.cashflowPerUnit,
        capRate: results.ratios.capRate,
        dscr: results.ratios.dscr
      };
    });
    
    // Analyse de sensibilité pour le taux d'inoccupation
    const vacancyRateSensitivity = vacancyRateVariations.map(vacancyRate => {
      const modifiedProperty = { ...property, vacancyRate };
      const results = this.calculateLiquidity(modifiedProperty);
      return {
        vacancyRate,
        monthlyCashflow: results.cashflow.monthlyCashflow,
        cashflowPerUnit: results.cashflow.cashflowPerUnit,
        capRate: results.ratios.capRate,
        dscr: results.ratios.dscr
      };
    });
    
    // Analyse de sensibilité pour le ratio de dépenses
    const expenseRatioSensitivity = expenseRatioVariations.map(variation => {
      const baseExpenseRatio = property.expenseRatio || 40; // 40% par défaut
      const modifiedProperty = { ...property, expenseRatio: baseExpenseRatio + variation };
      const results = this.calculateLiquidity(modifiedProperty);
      return {
        variation: variation > 0 ? `+${variation}` : variation,
        expenseRatio: modifiedProperty.expenseRatio,
        monthlyCashflow: results.cashflow.monthlyCashflow,
        cashflowPerUnit: results.cashflow.cashflowPerUnit,
        capRate: results.ratios.capRate,
        dscr: results.ratios.dscr
      };
    });
    
    // Analyse de sensibilité pour le loyer
    const rentSensitivity = rentVariations.map(variation => {
      const rentMultiplier = 1 + (variation / 100);
      const modifiedProperty = { 
        ...property, 
        grossAnnualRent: property.grossAnnualRent * rentMultiplier 
      };
      const results = this.calculateLiquidity(modifiedProperty);
      return {
        variation: variation > 0 ? `+${variation}%` : `${variation}%`,
        grossAnnualRent: modifiedProperty.grossAnnualRent,
        monthlyCashflow: results.cashflow.monthlyCashflow,
        cashflowPerUnit: results.cashflow.cashflowPerUnit,
        capRate: results.ratios.capRate,
        dscr: results.ratios.dscr
      };
    });
    
    return {
      baseCase: {
        interestRate: property.interestRate,
        vacancyRate: property.vacancyRate || 0,
        expenseRatio: property.expenseRatio || 40,
        grossAnnualRent: property.grossAnnualRent,
        monthlyCashflow: baseCaseResults.cashflow.monthlyCashflow,
        cashflowPerUnit: baseCaseResults.cashflow.cashflowPerUnit,
        capRate: baseCaseResults.ratios.capRate,
        dscr: baseCaseResults.ratios.dscr
      },
      sensitivityResults: {
        interestRate: interestRateSensitivity,
        vacancyRate: vacancyRateSensitivity,
        expenseRatio: expenseRatioSensitivity,
        rent: rentSensitivity
      }
    };
  }

  /**
   * Compare plusieurs propriétés immobilières
   * @param {Array} properties - Tableau d'objets contenant les détails des propriétés
   * @returns {Object} - Résultats de la comparaison
   */
  static compareProperties(properties) {
    if (!Array.isArray(properties) || properties.length < 2) {
      throw new Error('Vous devez fournir au moins deux propriétés pour effectuer une comparaison');
    }
    
    // Calculer les résultats pour chaque propriété
    const results = properties.map((property, index) => {
      // Vérifier si la propriété a un identifiant
      const propertyId = property.id || `Propriété ${index + 1}`;
      
      // Calculer les indicateurs clés
      const liquidityResults = this.calculateLiquidity(property);
      const returnResults = this.calculateTotalReturn(property);
      
      return {
        id: propertyId,
        propertyDetails: {
          address: property.address || 'Adresse non spécifiée',
          units: property.units,
          purchasePrice: property.purchasePrice,
          grossAnnualRent: property.grossAnnualRent,
          pricePerUnit: property.purchasePrice / property.units
        },
        cashflow: {
          monthlyCashflow: liquidityResults.cashflow.monthlyCashflow,
          annualCashflow: liquidityResults.cashflow.annualCashflow,
          cashflowPerUnit: liquidityResults.cashflow.cashflowPerUnit
        },
        ratios: {
          capRate: liquidityResults.ratios.capRate,
          mrb: liquidityResults.ratios.mrb,
          dscr: liquidityResults.ratios.dscr,
          rentToValue: liquidityResults.ratios.rentToValue,
          grm: liquidityResults.ratios.grm
        },
        returns: {
          totalROI: returnResults.returns.totalROI,
          annualizedROI: returnResults.returns.annualizedROI
        }
      };
    });
    
    // Classer les propriétés selon différents critères
    const rankings = {
      cashflow: this._rankProperties(results, 'cashflow.cashflowPerUnit', true),
      capRate: this._rankProperties(results, 'ratios.capRate', true),
      dscr: this._rankProperties(results, 'ratios.dscr', true),
      roi: this._rankProperties(results, 'returns.annualizedROI', true),
      pricePerUnit: this._rankProperties(results, 'propertyDetails.pricePerUnit', false),
      overall: this._calculateOverallRanking(results)
    };
    
    return {
      properties: results,
      rankings
    };
  }

  /**
   * Classe les propriétés selon un critère spécifique
   * @param {Array} properties - Liste des propriétés avec leurs résultats
   * @param {string} criterion - Critère de classement (chemin d'accès à la propriété)
   * @param {boolean} isHigherBetter - Indique si une valeur plus élevée est meilleure
   * @returns {Array} - Classement des propriétés
   * @private
   */
  static _rankProperties(properties, criterion, isHigherBetter) {
    // Fonction pour accéder à une propriété imbriquée
    const getNestedProperty = (obj, path) => {
      return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };
    
    // Trier les propriétés selon le critère
    const sortedProperties = [...properties].sort((a, b) => {
      const valueA = getNestedProperty(a, criterion);
      const valueB = getNestedProperty(b, criterion);
      
      return isHigherBetter ? valueB - valueA : valueA - valueB;
    });
    
    // Créer le classement
    return sortedProperties.map((prop, index) => ({
      rank: index + 1,
      id: prop.id,
      value: getNestedProperty(prop, criterion)
    }));
  }

  /**
   * Calcule un classement global des propriétés
   * @param {Array} properties - Liste des propriétés avec leurs résultats
   * @returns {Array} - Classement global des propriétés
   * @private
   */
  static _calculateOverallRanking(properties) {
    // Critères importants pour un immeuble à revenus
    const criteria = [
      { path: 'cashflow.cashflowPerUnit', weight: 0.3, isHigherBetter: true },
      { path: 'ratios.capRate', weight: 0.2, isHigherBetter: true },
      { path: 'ratios.dscr', weight: 0.15, isHigherBetter: true },
      { path: 'returns.annualizedROI', weight: 0.25, isHigherBetter: true },
      { path: 'propertyDetails.pricePerUnit', weight: 0.1, isHigherBetter: false }
    ];
    
    // Fonction pour accéder à une propriété imbriquée
    const getNestedProperty = (obj, path) => {
      return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };
    
    // Calculer les scores normalisés pour chaque propriété
    const propertyScores = properties.map(property => {
      let totalScore = 0;
      
      criteria.forEach(criterion => {
        const values = properties.map(p => getNestedProperty(p, criterion.path));
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);
        const range = maxValue - minValue;
        
        // Éviter la division par zéro
        if (range === 0) return;
        
        const propertyValue = getNestedProperty(property, criterion.path);
        let normalizedScore;
        
        if (criterion.isHigherBetter) {
          normalizedScore = (propertyValue - minValue) / range;
        } else {
          normalizedScore = (maxValue - propertyValue) / range;
        }
        
        totalScore += normalizedScore * criterion.weight;
      });
      
      return {
        id: property.id,
        score: totalScore
      };
    });
    
    // Trier par score
    const sortedScores = [...propertyScores].sort((a, b) => b.score - a.score);
    
    // Créer le classement
    return sortedScores.map((prop, index) => ({
      rank: index + 1,
      id: prop.id,
      score: parseFloat(prop.score.toFixed(2))
    }));
  }

  /**
   * Calcule le point d'équilibre pour une propriété immobilière
   * @param {Object} property - Objet contenant les détails de la propriété
   * @returns {Object} - Résultats du calcul du point d'équilibre
   */
  static calculateBreakeven(property) {
    // Validation des données d'entrée
    this._validatePropertyData(property);
    
    // Paramètres requis
    const { 
      purchasePrice, 
      grossAnnualRent,
      units,
      downPaymentRatio = 0.25,
      interestRate,
      amortizationYears,
      expenseRatio = 40
    } = property;
    
    // Calcul des dépenses fixes annuelles (sans le prêt hypothécaire)
    const annualExpenses = grossAnnualRent * (expenseRatio / 100);
    
    // Calcul du paiement hypothécaire
    const loanAmount = purchasePrice * (1 - downPaymentRatio);
    const monthlyRate = interestRate / 100 / 12;
    const totalPayments = amortizationYears * 12;
    
    const monthlyMortgagePayment = loanAmount * (
      monthlyRate * Math.pow(1 + monthlyRate, totalPayments)
    ) / (
      Math.pow(1 + monthlyRate, totalPayments) - 1
    );
    
    const annualMortgagePayment = monthlyMortgagePayment * 12;
    
    // Calcul du taux d'occupation au point d'équilibre
    const totalAnnualCosts = annualExpenses + annualMortgagePayment;
    const breakEvenOccupancyRate = Math.min(100, Math.max(0, (totalAnnualCosts / grossAnnualRent) * 100));
    
    // Calcul du pourcentage du loyer actuel pour atteindre le point d'équilibre
    const breakEvenRentPercent = Math.max(0, (totalAnnualCosts / grossAnnualRent) * 100);
    
    // Calcul du loyer minimum par unité pour atteindre le point d'équilibre
    const minimumGrossRent = totalAnnualCosts;
    const minimumMonthlyRentPerUnit = minimumGrossRent / 12 / units;
    
    // Calcul du taux d'intérêt maximum pour rester au point d'équilibre
    let maxInterestRate = interestRate;
    let maxInterestFound = false;
    
    // Recherche par incréments de 0.1%
    while (!maxInterestFound && maxInterestRate < 25) { // Limite à 25% pour éviter les boucles infinies
      maxInterestRate += 0.1;
      
      const testRate = maxInterestRate / 100 / 12;
      const testMonthlyPayment = loanAmount * (
        testRate * Math.pow(1 + testRate, totalPayments)
      ) / (
        Math.pow(1 + testRate, totalPayments) - 1
      );
      
      const testAnnualPayment = testMonthlyPayment * 12;
      const testTotalCosts = annualExpenses + testAnnualPayment;
      
      if (testTotalCosts > grossAnnualRent) {
        maxInterestFound = true;
        maxInterestRate -= 0.1; // Revenir au dernier taux viable
      }
    }
    
    return {
      currentState: {
        grossAnnualRent,
        annualExpenses,
        annualMortgagePayment,
        totalAnnualCosts,
        cashflow: grossAnnualRent - totalAnnualCosts
      },
      breakEvenPoints: {
        occupancyRate: parseFloat(breakEvenOccupancyRate.toFixed(2)),
        rentPercent: parseFloat(breakEvenRentPercent.toFixed(2)),
        minimumMonthlyRentPerUnit: parseFloat(minimumMonthlyRentPerUnit.toFixed(2)),
        maxInterestRate: parseFloat(maxInterestRate.toFixed(2))
      },
      safety: {
        occupancyMargin: parseFloat((100 - breakEvenOccupancyRate).toFixed(2)),
        rentMargin: parseFloat((100 - breakEvenRentPercent).toFixed(2)),
        interestRateMargin: parseFloat((maxInterestRate - interestRate).toFixed(2))
      }
    };
  }

  /**
   * Analyse les risques d'un investissement immobilier
   * @param {Object} property - Objet contenant les détails de la propriété
   * @returns {Object} - Résultats de l'analyse des risques
   */
  static analyzeRisks(property) {
    // Validation des données d'entrée
    this._validatePropertyData(property);
    
    // Calculs de base
    const liquidityResults = this.calculateLiquidity(property);
    const breakEvenResults = this.calculateBreakeven(property);
    
    // Évaluation du risque de cashflow
    const cashflowPerUnit = liquidityResults.cashflow.cashflowPerUnit;
    let cashflowRisk;
    
    if (cashflowPerUnit < 0) {
      cashflowRisk = { level: 'Élevé', score: 3, description: 'Cashflow négatif' };
    } else if (cashflowPerUnit < 50) {
      cashflowRisk = { level: 'Moyen', score: 2, description: 'Cashflow faible, risque en cas d\'imprévus' };
    } else if (cashflowPerUnit < 100) {
      cashflowRisk = { level: 'Faible', score: 1, description: 'Cashflow positif mais marge limitée' };
    } else {
      cashflowRisk = { level: 'Très faible', score: 0, description: 'Cashflow solide avec bonne marge' };
    }
    
    // Évaluation du risque lié au ratio de couverture du service de la dette (DSCR)
    const dscr = liquidityResults.ratios.dscr;
    let dscrRisk;
    
    if (dscr < 1) {
      dscrRisk = { level: 'Élevé', score: 3, description: 'DSCR inférieur à 1, revenus insuffisants pour couvrir le prêt' };
    } else if (dscr < 1.2) {
      dscrRisk = { level: 'Moyen', score: 2, description: 'DSCR entre 1 et 1.2, marge faible pour les imprévus' };
    } else if (dscr < 1.5) {
      dscrRisk = { level: 'Faible', score: 1, description: 'DSCR entre 1.2 et 1.5, marge raisonnable' };
    } else {
      dscrRisk = { level: 'Très faible', score: 0, description: 'DSCR supérieur à 1.5, excellente couverture du service de la dette' };
    }
    
    // Évaluation du risque lié au ratio mise de fonds / valeur
    const lvr = (1 - (property.downPaymentRatio || 0.25)) * 100;
    let lvrRisk;
    
    if (lvr > 80) {
      lvrRisk = { level: 'Élevé', score: 3, description: 'Ratio prêt/valeur élevé, peu d\'équité dans la propriété' };
    } else if (lvr > 70) {
      lvrRisk = { level: 'Moyen', score: 2, description: 'Ratio prêt/valeur modéré' };
    } else if (lvr > 60) {
      lvrRisk = { level: 'Faible', score: 1, description: 'Ratio prêt/valeur conservateur' };
    } else {
      lvrRisk = { level: 'Très faible', score: 0, description: 'Ratio prêt/valeur très faible, bonne équité' };
    }
    
    // Évaluation du risque de taux d'inoccupation
    const occupancyMargin = breakEvenResults.safety.occupancyMargin;
    let vacancyRisk;
    
    if (occupancyMargin < 5) {
      vacancyRisk = { level: 'Élevé', score: 3, description: 'Marge d\'inoccupation très faible, risque élevé' };
    } else if (occupancyMargin < 15) {
      vacancyRisk = { level: 'Moyen', score: 2, description: 'Marge d\'inoccupation limitée' };
    } else if (occupancyMargin < 25) {
      vacancyRisk = { level: 'Faible', score: 1, description: 'Bonne marge d\'inoccupation' };
    } else {
      vacancyRisk = { level: 'Très faible', score: 0, description: 'Excellente marge d\'inoccupation' };
    }
    
    // Évaluation du risque de taux d'intérêt
    const interestRateMargin = breakEvenResults.safety.interestRateMargin;
    let interestRateRisk;
    
    if (interestRateMargin < 1) {
      interestRateRisk = { level: 'Élevé', score: 3, description: 'Très sensible aux hausses de taux d\'intérêt' };
    } else if (interestRateMargin < 2) {
      interestRateRisk = { level: 'Moyen', score: 2, description: 'Sensibilité modérée aux hausses de taux d\'intérêt' };
    } else if (interestRateMargin < 4) {
      interestRateRisk = { level: 'Faible', score: 1, description: 'Bonne résistance aux hausses de taux d\'intérêt' };
    } else {
      interestRateRisk = { level: 'Très faible', score: 0, description: 'Excellente résistance aux hausses de taux d\'intérêt' };
    }
    
    // Tests de stress
    const stressTest = {};
    
    // Test de stress: augmentation du taux d'intérêt de 3%
    const interestStressProperty = { ...property, interestRate: property.interestRate + 3 };
    const interestStressResults = this.calculateLiquidity(interestStressProperty);
    stressTest.interestRateIncrease3 = {
      monthlyCashflow: interestStressResults.cashflow.monthlyCashflow,
      cashflowPerUnit: interestStressResults.cashflow.cashflowPerUnit,
      dscr: interestStressResults.ratios.dscr
    };
    
    // Test de stress: taux d'inoccupation de 10%
    const vacancyStressProperty = { ...property, vacancyRate: 10 };
    const vacancyStressResults = this.calculateLiquidity(vacancyStressProperty);
    stressTest.vacancy10Percent = {
      monthlyCashflow: vacancyStressResults.cashflow.monthlyCashflow,
      cashflowPerUnit: vacancyStressResults.cashflow.cashflowPerUnit,
      dscr: vacancyStressResults.ratios.dscr
    };
    
    // Test de stress: augmentation des dépenses de 15%
    const expenseRatio = property.expenseRatio || 40;
    const expenseStressProperty = { ...property, expenseRatio: expenseRatio + 15 };
    const expenseStressResults = this.calculateLiquidity(expenseStressProperty);
    stressTest.expenseIncrease15Percent = {
      monthlyCashflow: expenseStressResults.cashflow.monthlyCashflow,
      cashflowPerUnit: expenseStressResults.cashflow.cashflowPerUnit,
      dscr: expenseStressResults.ratios.dscr
    };
    
    // Test de stress combiné: taux d'intérêt +2%, inoccupation 5%, dépenses +10%
    const combinedStressProperty = { 
      ...property, 
      interestRate: property.interestRate + 2,
      vacancyRate: 5,
      expenseRatio: expenseRatio + 10
    };
    const combinedStressResults = this.calculateLiquidity(combinedStressProperty);
    stressTest.combinedStress = {
      monthlyCashflow: combinedStressResults.cashflow.monthlyCashflow,
      cashflowPerUnit: combinedStressResults.cashflow.cashflowPerUnit,
      dscr: combinedStressResults.ratios.dscr
    };
    
    // Calcul du score de risque global (0-3)
    const riskFactors = [cashflowRisk, dscrRisk, lvrRisk, vacancyRisk, interestRateRisk];
    const totalRiskScore = riskFactors.reduce((total, risk) => total + risk.score, 0);
    const maxPossibleScore = riskFactors.length * 3;
    const riskScoreNormalized = totalRiskScore / maxPossibleScore;
    
    let overallRisk;
    if (riskScoreNormalized < 0.25) {
      overallRisk = 'Faible';
    } else if (riskScoreNormalized < 0.5) {
      overallRisk = 'Modéré';
    } else if (riskScoreNormalized < 0.75) {
      overallRisk = 'Élevé';
    } else {
      overallRisk = 'Très élevé';
    }
    
    return {
      riskFactors: {
        cashflow: cashflowRisk,
        dscr: dscrRisk,
        lvr: lvrRisk,
        vacancy: vacancyRisk,
        interestRate: interestRateRisk
      },
      overallRisk,
      riskScore: parseFloat((riskScoreNormalized * 100).toFixed(2)),
      stressTest,
      recommendations: this._generateRiskRecommendations(riskFactors)
    };
  }

  /**
   * Génère des recommandations basées sur l'analyse des risques
   * @param {Array} riskFactors - Facteurs de risque analysés
   * @returns {Array} - Liste de recommandations
   * @private
   */
  static _generateRiskRecommendations(riskFactors) {
    const recommendations = [];
    
    // Recommandations basées sur le risque de cashflow
    if (riskFactors.cashflow.score >= 2) {
      recommendations.push('Augmenter le cashflow en optimisant les revenus ou en réduisant les dépenses');
    }
    
    // Recommandations basées sur le DSCR
    if (riskFactors.dscr.score >= 2) {
      recommendations.push('Améliorer le ratio de couverture du service de la dette en refinançant à un taux plus bas ou en augmentant la mise de fonds');
    }
    
    // Recommandations basées sur le LVR
    if (riskFactors.lvr.score >= 2) {
      recommendations.push('Réduire le ratio prêt/valeur en augmentant la mise de fonds');
    }
    
    // Recommandations basées sur le risque d'inoccupation
    if (riskFactors.vacancy.score >= 2) {
      recommendations.push('Améliorer la résistance aux périodes d\'inoccupation en constituant une réserve de trésorerie');
    }
    
    // Recommandations basées sur le risque de taux d'intérêt
    if (riskFactors.interestRate.score >= 2) {
      recommendations.push('Se protéger contre les hausses de taux d\'intérêt en optant pour un taux fixe à plus long terme');
    }
    
    // Recommandations générales si le risque global est élevé
    const highRiskFactors = riskFactors.filter(factor => factor.score >= 2).length;
    if (highRiskFactors >= 3) {
      recommendations.push('Reconsidérer l\'investissement ou négocier un prix d\'achat plus bas pour améliorer la rentabilité et réduire le risque global');
    }
    
    return recommendations;
  }
}

module.exports = LiquidityCalculatorUtility;