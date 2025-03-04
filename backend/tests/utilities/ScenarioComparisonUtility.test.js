/**
 * Tests pour ScenarioComparisonUtility.js
 */

const ScenarioComparisonUtility = require('../../calculators/utilities/ScenarioComparisonUtility');

describe('ScenarioComparisonUtility', () => {
  describe('compareScenarios', () => {
    it('devrait rejeter un tableau vide', () => {
      expect(() => {
        ScenarioComparisonUtility.compareScenarios([]);
      }).toThrow('Vous devez fournir au moins un scénario à comparer');
    });

    it('devrait analyser correctement un scénario FLIP', () => {
      const scenarios = [{
        name: 'Flip Maison Longueuil',
        purchasePrice: 300000,
        renovationCost: 50000,
        salePrice: 425000,
        monthsHeld: 4
      }];

      const result = ScenarioComparisonUtility.compareScenarios(scenarios);
      
      expect(result.scenarios.length).toBe(1);
      expect(result.scenarios[0].analysis.type).toBe('FLIP');
      expect(result.scenarios[0].analysis.profit).toBeGreaterThan(0);
      expect(result.bestOverall).toBeDefined();
    });

    it('devrait analyser correctement un scénario MULTI', () => {
      const scenarios = [{
        name: 'Quintuplex St-Hubert',
        purchasePrice: 650000,
        renovationCost: 25000,
        units: 5,
        grossAnnualRent: 72000,
        downPaymentRatio: 0.20,
        interestRate: 4.25
      }];

      const result = ScenarioComparisonUtility.compareScenarios(scenarios);
      
      expect(result.scenarios.length).toBe(1);
      expect(result.scenarios[0].analysis.type).toBe('MULTI');
      expect(result.scenarios[0].analysis.cashflowPerUnit).toBeDefined();
      expect(result.scenarios[0].analysis.capRate).toBeDefined();
    });

    it('devrait comparer correctement plusieurs scénarios', () => {
      const scenarios = [
        {
          name: 'Flip Maison Longueuil',
          purchasePrice: 300000,
          renovationCost: 50000,
          salePrice: 425000,
          monthsHeld: 4
        },
        {
          name: 'Quintuplex St-Hubert',
          purchasePrice: 650000,
          renovationCost: 25000,
          units: 5,
          grossAnnualRent: 72000,
          downPaymentRatio: 0.20,
          interestRate: 4.25
        }
      ];

      const result = ScenarioComparisonUtility.compareScenarios(scenarios);
      
      expect(result.scenarios.length).toBe(2);
      expect(result.bestOverall).toBeDefined();
      expect(result.bestCashflow).toBeDefined();
      expect(result.bestCapRate).toBeDefined();
      expect(result.summary).toContain('Analyse comparative de 2 scénarios');
    });
  });

  describe('_analyzeFlipScenario', () => {
    it('devrait calculer correctement le profit et le ROI', () => {
      const scenario = {
        purchasePrice: 200000,
        renovationCost: 30000,
        salePrice: 270000,
        monthsHeld: 3
      };

      const analysis = ScenarioComparisonUtility._analyzeFlipScenario(scenario);
      
      expect(analysis.investment).toBe(230000);
      expect(analysis.profit).toBeCloseTo(24200, 0); // 270000 - 230000 - (270000*0.06)
      expect(analysis.roi).toBeCloseTo(10.52, 1); // (24200/230000)*100
      expect(analysis.annualizedRoi).toBeCloseTo(42.08, 1); // 10.52*(12/3)
    });
  });

  describe('_analyzeMultiScenario', () => {
    it('devrait calculer correctement les indicateurs financiers', () => {
      const scenario = {
        purchasePrice: 500000,
        renovationCost: 0,
        units: 4,
        grossAnnualRent: 48000,
        downPaymentRatio: 0.25,
        interestRate: 4.0,
        amortizationYears: 25
      };

      const analysis = ScenarioComparisonUtility._analyzeMultiScenario(scenario);
      
      expect(analysis.type).toBe('MULTI');
      expect(analysis.investment).toBe(500000);
      expect(analysis.downPayment).toBe(125000);
      expect(analysis.noi).toBeCloseTo(31200, 0); // 48000 - (48000*0.35)
      expect(analysis.capRate).toBeCloseTo(6.24, 1);
      expect(analysis.cashflowPerUnit).toBeGreaterThan(0);
    });
  });
});
