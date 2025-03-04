/**
 * ScenarioComparisonUtility.js
 * Utilitaire pour comparer différents scénarios d'investissement immobilier
 */

class ScenarioComparisonUtility {
  /**
   * Compare plusieurs scénarios d'investissement et identifie le meilleur selon différents critères
   * @param {Array} scenarios Tableau d'objets représentant différents scénarios
   * @param {Object} options Options de comparaison
   * @returns {Object} Résultats de la comparaison
   */
  static compareScenarios(scenarios, options = {}) {
    if (!scenarios || !Array.isArray(scenarios) || scenarios.length === 0) {
      throw new Error('Vous devez fournir au moins un scénario à comparer');
    }
    
    // Options par défaut
    const defaultOptions = {
      prioritizeCashflow: true, // Prioriser le cashflow vs ROI
      weightCashflow: 0.5,      // Poids du cashflow dans l'évaluation globale
      weightCapRate: 0.3,       // Poids du taux de capitalisation
      weightCashOnCash: 0.2,    // Poids du rendement sur investissement
      minViableCashflowPerUnit: 75 // Cashflow minimum par unité (multi)
    };
    
    const settings = { ...defaultOptions, ...options };
    
    // Analyse de chaque scénario
    const analyzedScenarios = scenarios.map((scenario, index) => {
      const analysis = this._analyzeScenario(scenario);
      return {
        id: index + 1,
        name: scenario.name || `Scénario ${index + 1}`,
        scenario: scenario,
        analysis: analysis,
        score: this._calculateScore(analysis, settings)
      };
    });
    
    // Trier les scénarios par score (du plus élevé au plus bas)
    analyzedScenarios.sort((a, b) => b.score - a.score);
    
    // Identifier le meilleur scénario selon différents critères
    const bestOverall = analyzedScenarios[0];
    const bestCashflow = this._findBestFor(analyzedScenarios, s => s.analysis.cashflow || 0);
    const bestCapRate = this._findBestFor(analyzedScenarios, s => s.analysis.capRate || 0);
    const bestCashOnCash = this._findBestFor(analyzedScenarios, s => s.analysis.cashOnCash || 0);
    
    return {
      scenarios: analyzedScenarios,
      bestOverall: bestOverall,
      bestCashflow: bestCashflow,
      bestCapRate: bestCapRate,
      bestCashOnCash: bestCashOnCash,
      summary: this._generateSummary(analyzedScenarios, bestOverall, settings)
    };
  }
  
  /**
   * Analyse un scénario individuel
   * @param {Object} scenario Le scénario à analyser
   * @returns {Object} Les résultats de l'analyse
   */
  static _analyzeScenario(scenario) {
    // Déterminer s'il s'agit d'un FLIP ou d'un MULTI
    const isFlip = scenario.hasOwnProperty('salePrice');
    
    if (isFlip) {
      return this._analyzeFlipScenario(scenario);
    } else {
      return this._analyzeMultiScenario(scenario);
    }
  }
  
  /**
   * Analyse un scénario de type FLIP
   * @param {Object} scenario Le scénario FLIP à analyser
   * @returns {Object} Les résultats de l'analyse
   */
  static _analyzeFlipScenario(scenario) {
    const purchasePrice = scenario.purchasePrice || 0;
    const renovationCost = scenario.renovationCost || 0;
    const sellingCosts = scenario.sellingCosts || (scenario.salePrice * 0.06); // ~6% par défaut
    const totalInvestment = purchasePrice + renovationCost;
    const profit = scenario.salePrice - totalInvestment - sellingCosts;
    const roi = (profit / totalInvestment) * 100;
    const monthsHeld = scenario.monthsHeld || 6;
    const annualizedRoi = roi * (12 / monthsHeld);
    
    return {
      type: 'FLIP',
      investment: totalInvestment,
      profit: profit,
      roi: roi,
      annualizedRoi: annualizedRoi,
      score: roi
    };
  }
  
  /**
   * Analyse un scénario de type MULTI (immeuble à revenus)
   * @param {Object} scenario Le scénario MULTI à analyser
   * @returns {Object} Les résultats de l'analyse
   */
  static _analyzeMultiScenario(scenario) {
    const purchasePrice = scenario.purchasePrice || 0;
    const renovationCost = scenario.renovationCost || 0;
    const totalInvestment = purchasePrice + renovationCost;
    const units = scenario.units || 1;
    
    // Calcul du revenu net d'exploitation (NOI)
    const grossIncome = scenario.grossAnnualRent || 0;
    const expenseRatio = this._getExpenseRatio(units);
    const expenses = scenario.annualExpenses || (grossIncome * expenseRatio);
    const noi = grossIncome - expenses;
    
    // Calcul du taux de capitalisation
    const capRate = (noi / totalInvestment) * 100;
    
    // Calcul du financement
    const downPaymentRatio = scenario.downPaymentRatio || 0.25;
    const interestRate = scenario.interestRate || 4.5;
    const amortizationYears = scenario.amortizationYears || 25;
    
    const downPayment = totalInvestment * downPaymentRatio;
    const mortgageAmount = totalInvestment - downPayment;
    const annualMortgagePayment = this._calculateAnnualMortgagePayment(
      mortgageAmount, 
      interestRate, 
      amortizationYears
    );
    
    // Calcul du cashflow
    const annualCashflow = noi - annualMortgagePayment;
    const monthlyCashflow = annualCashflow / 12;
    const cashflowPerUnit = monthlyCashflow / units;
    const cashOnCash = (annualCashflow / downPayment) * 100;
    
    return {
      type: 'MULTI',
      investment: totalInvestment,
      downPayment: downPayment,
      noi: noi,
      capRate: capRate,
      cashflow: annualCashflow,
      cashflowPerUnit: cashflowPerUnit,
      cashOnCash: cashOnCash,
      score: cashOnCash
    };
  }
  
  /**
   * Calcule un score global pour un scénario
   * @param {Object} analysis Résultats de l'analyse du scénario
   * @param {Object} settings Options de pondération
   * @returns {number} Score du scénario
   */
  static _calculateScore(analysis, settings) {
    if (analysis.type === 'FLIP') {
      return analysis.roi;
    } else {
      // Pour MULTI, calcul pondéré selon les critères
      let score = 0;
      
      if (analysis.cashflowPerUnit < settings.minViableCashflowPerUnit) {
        // Pénalité pour les cashflows trop faibles
        score -= (settings.minViableCashflowPerUnit - analysis.cashflowPerUnit) * 0.5;
      }
      
      score += (analysis.cashflowPerUnit * settings.weightCashflow);
      score += (analysis.capRate * settings.weightCapRate);
      score += (analysis.cashOnCash * settings.weightCashOnCash);
      
      return score;
    }
  }
  
  /**
   * Trouve le meilleur scénario selon un critère spécifique
   * @param {Array} scenarios Scénarios analysés
   * @param {Function} criteriaFn Fonction extrayant le critère de comparaison
   * @returns {Object} Le meilleur scénario selon le critère
   */
  static _findBestFor(scenarios, criteriaFn) {
    return scenarios.reduce((best, current) => {
      return criteriaFn(current) > criteriaFn(best) ? current : best;
    }, scenarios[0]);
  }
  
  /**
   * Génère un résumé textuel de la comparaison
   * @param {Array} scenarios Scénarios analysés
   * @param {Object} bestOverall Meilleur scénario global
   * @param {Object} settings Options utilisées
   * @returns {string} Résumé de la comparaison
   */
  static _generateSummary(scenarios, bestOverall, settings) {
    const scenarioType = bestOverall.analysis.type;
    let summary = `Analyse comparative de ${scenarios.length} scénarios. `;
    
    if (scenarioType === 'FLIP') {
      summary += `Le scénario "${bestOverall.name}" offre le meilleur rendement avec un ROI de ${bestOverall.analysis.roi.toFixed(2)}%.`;
    } else {
      summary += `Le scénario "${bestOverall.name}" est le plus avantageux avec un cashflow mensuel par unité de ${bestOverall.analysis.cashflowPerUnit.toFixed(2)}$, `;
      summary += `un taux de capitalisation de ${bestOverall.analysis.capRate.toFixed(2)}% `;
      summary += `et un rendement sur investissement de ${bestOverall.analysis.cashOnCash.toFixed(2)}%.`;
    }
    
    return summary;
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
}

module.exports = ScenarioComparisonUtility;