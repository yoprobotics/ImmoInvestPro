const ScenarioComparisonUtility = require('../calculators/utilities/ScenarioComparisonUtility');

describe('ScenarioComparisonUtility', () => {
  test('devrait pouvoir comparer deux scénarios FLIP', () => {
    const scenarios = [
      {
        name: "Flip Budget",
        purchasePrice: 200000,
        renovationCost: 30000,
        salePrice: 280000,
        sellingCosts: 16800,
        monthsHeld: 6
      },
      {
        name: "Flip Premium",
        purchasePrice: 250000,
        renovationCost: 50000,
        salePrice: 370000,
        sellingCosts: 22200,
        monthsHeld: 8
      }
    ];
    
    const result = ScenarioComparisonUtility.compareScenarios(scenarios);
    
    expect(result.scenarios.length).toBe(2);
    expect(result.bestOverall).toBeDefined();
    expect(result.summary).toContain("meilleur rendement");
  });
  
  test('devrait pouvoir comparer deux scénarios MULTI', () => {
    const scenarios = [
      {
        name: "Duplex",
        purchasePrice: 300000,
        grossAnnualRent: 30000,
        units: 2,
        downPaymentRatio: 0.25,
        interestRate: 4.5,
        amortizationYears: 25
      },
      {
        name: "Quadruplex",
        purchasePrice: 550000,
        grossAnnualRent: 60000,
        units: 4,
        downPaymentRatio: 0.25,
        interestRate: 4.5,
        amortizationYears: 25
      }
    ];
    
    const result = ScenarioComparisonUtility.compareScenarios(scenarios);
    
    expect(result.scenarios.length).toBe(2);
    expect(result.bestOverall).toBeDefined();
    expect(result.bestCashflow).toBeDefined();
    expect(result.bestCapRate).toBeDefined();
    expect(result.bestCashOnCash).toBeDefined();
  });
  
  test('devrait lancer une erreur si aucun scénario n\'est fourni', () => {
    expect(() => {
      ScenarioComparisonUtility.compareScenarios([]);
    }).toThrow();
    
    expect(() => {
      ScenarioComparisonUtility.compareScenarios(null);
    }).toThrow();
  });
  
  test('devrait permettre de personnaliser les poids de comparaison', () => {
    const scenarios = [
      {
        name: "Propriété A",
        purchasePrice: 400000,
        grossAnnualRent: 40000,
        units: 3,
      },
      {
        name: "Propriété B",
        purchasePrice: 500000,
        grossAnnualRent: 55000,
        units: 4,
      }
    ];
    
    // Comparaison avec poids par défaut
    const defaultResult = ScenarioComparisonUtility.compareScenarios(scenarios);
    
    // Comparaison en priorisant le taux de capitalisation
    const customResult = ScenarioComparisonUtility.compareScenarios(scenarios, {
      weightCashflow: 0.2,
      weightCapRate: 0.7,
      weightCashOnCash: 0.1
    });
    
    // Les résultats pourraient être différents selon les valeurs fournies
    expect(defaultResult.bestOverall.name).toBeDefined();
    expect(customResult.bestOverall.name).toBeDefined();
  });
});