/**
 * Utilitaire de comparaison de scénarios pour projets immobiliers
 * 
 * Permet de comparer différents scénarios pour un même projet et d'identifier
 * le scénario optimal selon différents critères
 */

const FlipDetailedCalculator = require('./FlipDetailedCalculator');
const MultiDetailedCalculator = require('./MultiDetailedCalculator');

class ScenarioComparisonUtility {
  /**
   * Compare plusieurs scénarios pour un projet FLIP
   * 
   * @param {Array<Object>} scenarios - Tableau de scénarios à comparer
   * @param {string} optimizationCriteria - Critère d'optimisation (profit, roi, annualizedRoi)
   * @returns {Object} Résultats de la comparaison
   */
  static compareFlipScenarios(scenarios, optimizationCriteria = 'profit') {
    if (!scenarios || scenarios.length === 0) {
      throw new Error('Au moins un scénario doit être fourni');
    }
    
    // Valider le critère d'optimisation
    const validCriteria = ['profit', 'roi', 'annualizedRoi'];
    if (!validCriteria.includes(optimizationCriteria)) {
      throw new Error(`Critère d'optimisation invalide. Valeurs acceptées: ${validCriteria.join(', ')}`);
    }
    
    // Calculer les résultats de chaque scénario
    const results = scenarios.map((scenario, index) => {
      const result = FlipDetailedCalculator.calculate(scenario);
      return {
        scenarioIndex: index,
        scenarioName: scenario.name || `Scénario ${index + 1}`,
        summary: result.summary
      };
    });
    
    // Trouver le scénario optimal selon le critère choisi
    const optimalScenario = results.reduce((best, current) => {
      return current.summary[optimizationCriteria] > best.summary[optimizationCriteria] ? current : best;
    }, results[0]);
    
    // Classer les scénarios du meilleur au pire
    const rankedScenarios = [...results].sort((a, b) => 
      b.summary[optimizationCriteria] - a.summary[optimizationCriteria]
    );
    
    return {
      optimizationCriteria,
      optimalScenario,
      rankedScenarios,
      scenarioCount: scenarios.length,
      allResults: results
    };
  }
  
  /**
   * Compare plusieurs scénarios pour un projet MULTI
   * 
   * @param {Array<Object>} scenarios - Tableau de scénarios à comparer
   * @param {string} optimizationCriteria - Critère d'optimisation (cashflowPerUnit, capRate, cashOnCash)
   * @returns {Object} Résultats de la comparaison
   */
  static compareMultiScenarios(scenarios, optimizationCriteria = 'cashflowPerUnit') {
    if (!scenarios || scenarios.length === 0) {
      throw new Error('Au moins un scénario doit être fourni');
    }
    
    // Valider le critère d'optimisation
    const validCriteria = ['cashflowPerUnit', 'capRate', 'cashOnCash', 'netOperatingIncome'];
    if (!validCriteria.includes(optimizationCriteria)) {
      throw new Error(`Critère d'optimisation invalide. Valeurs acceptées: ${validCriteria.join(', ')}`);
    }
    
    // Calculer les résultats de chaque scénario
    const results = scenarios.map((scenario, index) => {
      const result = MultiDetailedCalculator.calculate(scenario);
      return {
        scenarioIndex: index,
        scenarioName: scenario.name || `Scénario ${index + 1}`,
        summary: result.summary
      };
    });
    
    // Trouver le scénario optimal selon le critère choisi
    const optimalScenario = results.reduce((best, current) => {
      return current.summary[optimizationCriteria] > best.summary[optimizationCriteria] ? current : best;
    }, results[0]);
    
    // Classer les scénarios du meilleur au pire
    const rankedScenarios = [...results].sort((a, b) => 
      b.summary[optimizationCriteria] - a.summary[optimizationCriteria]
    );
    
    return {
      optimizationCriteria,
      optimalScenario,
      rankedScenarios,
      scenarioCount: scenarios.length,
      allResults: results
    };
  }
  
  /**
   * Analyse de sensibilité pour un scénario FLIP
   * 
   * @param {Object} baseScenario - Scénario de base
   * @param {string} variableToAnalyze - Variable à analyser (purchasePrice, sellingPrice, renovationCost)
   * @param {number} variationPercentage - Pourcentage de variation (positif ou négatif)
   * @param {number} steps - Nombre d'étapes dans l'analyse
   * @returns {Object} Résultats de l'analyse de sensibilité
   */
  static flipSensitivityAnalysis(baseScenario, variableToAnalyze, variationPercentage, steps = 5) {
    if (!baseScenario || !baseScenario[variableToAnalyze]) {
      throw new Error(`Scénario de base invalide ou variable ${variableToAnalyze} non définie`);
    }
    
    const baseValue = baseScenario[variableToAnalyze];
    const stepSize = (variationPercentage / 100) * baseValue / steps;
    
    const scenarios = [];
    
    // Créer les scénarios avec les variations
    for (let i = -steps; i <= steps; i++) {
      if (i === 0) continue; // Sauter le cas du milieu (base scenario)
      
      const variation = i * stepSize;
      const newValue = baseValue + variation;
      
      // Créer une copie du scénario de base et modifier la variable
      const scenario = { ...baseScenario, [variableToAnalyze]: newValue };
      scenario.name = `${variableToAnalyze} ${i > 0 ? '+' : ''}${(i * variationPercentage / steps).toFixed(1)}%`;
      
      scenarios.push(scenario);
    }
    
    // Ajouter le scénario de base
    const baseScenarioCopy = { ...baseScenario, name: 'Scénario de base' };
    scenarios.push(baseScenarioCopy);
    
    // Comparer les scénarios
    const comparison = this.compareFlipScenarios(scenarios, 'profit');
    
    return {
      variableAnalyzed: variableToAnalyze,
      baseValue,
      variationPercentage,
      steps,
      comparison
    };
  }
  
  /**
   * Analyse de sensibilité pour un scénario MULTI
   * 
   * @param {Object} baseScenario - Scénario de base
   * @param {string} variableToAnalyze - Variable à analyser (purchasePrice, grossAnnualRent, operatingExpenses)
   * @param {number} variationPercentage - Pourcentage de variation (positif ou négatif)
   * @param {number} steps - Nombre d'étapes dans l'analyse
   * @returns {Object} Résultats de l'analyse de sensibilité
   */
  static multiSensitivityAnalysis(baseScenario, variableToAnalyze, variationPercentage, steps = 5) {
    if (!baseScenario || !baseScenario[variableToAnalyze]) {
      throw new Error(`Scénario de base invalide ou variable ${variableToAnalyze} non définie`);
    }
    
    const baseValue = baseScenario[variableToAnalyze];
    const stepSize = (variationPercentage / 100) * baseValue / steps;
    
    const scenarios = [];
    
    // Créer les scénarios avec les variations
    for (let i = -steps; i <= steps; i++) {
      if (i === 0) continue; // Sauter le cas du milieu (base scenario)
      
      const variation = i * stepSize;
      const newValue = baseValue + variation;
      
      // Créer une copie du scénario de base et modifier la variable
      const scenario = { ...baseScenario, [variableToAnalyze]: newValue };
      scenario.name = `${variableToAnalyze} ${i > 0 ? '+' : ''}${(i * variationPercentage / steps).toFixed(1)}%`;
      
      scenarios.push(scenario);
    }
    
    // Ajouter le scénario de base
    const baseScenarioCopy = { ...baseScenario, name: 'Scénario de base' };
    scenarios.push(baseScenarioCopy);
    
    // Comparer les scénarios
    const comparison = this.compareMultiScenarios(scenarios, 'cashflowPerUnit');
    
    return {
      variableAnalyzed: variableToAnalyze,
      baseValue,
      variationPercentage,
      steps,
      comparison
    };
  }
  
  /**
   * Génère un rapport comparatif détaillé pour plusieurs projets différents
   * 
   * @param {Array<Object>} projects - Tableau de projets à comparer (FLIP et/ou MULTI)
   * @returns {Object} Rapport comparatif détaillé
   */
  static generatePortfolioComparison(projects) {
    if (!projects || projects.length === 0) {
      throw new Error('Au moins un projet doit être fourni');
    }
    
    const results = projects.map((project, index) => {
      // Déterminer le type de projet
      const isFlip = project.type === 'FLIP' || project.hasOwnProperty('sellingPrice');
      const calculator = isFlip ? FlipDetailedCalculator : MultiDetailedCalculator;
      
      const result = calculator.calculate(project);
      
      return {
        projectIndex: index,
        projectName: project.name || `Projet ${index + 1}`,
        projectType: isFlip ? 'FLIP' : 'MULTI',
        summary: result.summary,
        // Calculer les métriques communes pour permettre la comparaison
        metrics: {
          totalInvestment: isFlip ? result.summary.totalInvestment : (project.purchasePrice + (project.renovationCost || 0)),
          annualizedROI: isFlip ? result.summary.annualizedRoi : result.summary.cashOnCash,
          paybackPeriod: isFlip ? null : (result.summary.cashflowPerUnit > 0 ? 
            (project.purchasePrice / (result.summary.cashflowPerUnit * project.units * 12)) : Infinity)
        }
      };
    });
    
    // Trier par différents critères pour la comparaison
    const byROI = [...results].sort((a, b) => b.metrics.annualizedROI - a.metrics.annualizedROI);
    const byInvestment = [...results].sort((a, b) => a.metrics.totalInvestment - b.metrics.totalInvestment);
    
    return {
      projectCount: projects.length,
      flipCount: results.filter(r => r.projectType === 'FLIP').length,
      multiCount: results.filter(r => r.projectType === 'MULTI').length,
      highestROI: byROI[0],
      lowestInvestment: byInvestment[0],
      allResults: results,
      rankings: {
        byROI,
        byInvestment
      }
    };
  }
}

module.exports = ScenarioComparisonUtility;