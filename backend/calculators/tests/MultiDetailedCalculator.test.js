const MultiDetailedCalculator = require('../utilities/MultiDetailedCalculator');

describe('MultiDetailedCalculator', () => {
  test('devrait calculer correctement la rentabilité d\'un immeuble à revenus', () => {
    const testData = {
      purchasePrice: 500000,
      grossAnnualRent: 60000,
      units: 6,
      renovationCost: 15000
    };
    
    const result = MultiDetailedCalculator.calculate(testData);
    
    expect(result.summary.cashflowPerUnit).toBeDefined();
    expect(result.summary.capRate).toBeDefined();
    expect(typeof result.summary.isViable).toBe('boolean');
  });
  
  test('devrait appliquer le bon ratio de dépenses selon le nombre d\'unités', () => {
    // Test avec 2 unités (devrait utiliser 30%)
    let result = MultiDetailedCalculator.calculate({
      purchasePrice: 300000,
      grossAnnualRent: 36000,
      units: 2
    });
    
    expect(result.details.operatingExpenses).toBe(36000 * 0.3);
    
    // Test avec 4 unités (devrait utiliser 35%)
    result = MultiDetailedCalculator.calculate({
      purchasePrice: 400000,
      grossAnnualRent: 48000,
      units: 4
    });
    
    expect(result.details.operatingExpenses).toBe(48000 * 0.35);
    
    // Test avec 6 unités (devrait utiliser 45%)
    result = MultiDetailedCalculator.calculate({
      purchasePrice: 600000,
      grossAnnualRent: 72000,
      units: 6
    });
    
    expect(result.details.operatingExpenses).toBe(72000 * 0.45);
    
    // Test avec 8 unités (devrait utiliser 50%)
    result = MultiDetailedCalculator.calculate({
      purchasePrice: 800000,
      grossAnnualRent: 96000,
      units: 8
    });
    
    expect(result.details.operatingExpenses).toBe(96000 * 0.5);
  });
  
  test('devrait déterminer correctement si un projet est viable', () => {
    // Projet non viable (cashflow négatif)
    let result = MultiDetailedCalculator.calculate({
      purchasePrice: 500000,
      grossAnnualRent: 30000,
      units: 5
    });
    
    expect(result.summary.isViable).toBe(false);
    
    // Projet viable (plus de 75$ par porte)
    result = MultiDetailedCalculator.calculate({
      purchasePrice: 500000,
      grossAnnualRent: 75000,
      units: 5
    });
    
    expect(result.summary.isViable).toBe(true);
  });
  
  test('devrait inclure les coûts de rénovation dans l\'investissement total', () => {
    const result = MultiDetailedCalculator.calculate({
      purchasePrice: 400000,
      grossAnnualRent: 48000,
      units: 4,
      renovationCost: 50000
    });
    
    expect(result.details.totalInvestment).toBe(450000);
  });
});