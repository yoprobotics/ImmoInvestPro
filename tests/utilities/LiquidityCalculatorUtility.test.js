const LiquidityCalculatorUtility = require('../../src/utilities/LiquidityCalculatorUtility');

describe('LiquidityCalculatorUtility', () => {
  // Exemple de propriété pour les tests
  const sampleProperty = {
    purchasePrice: 500000,
    grossAnnualRent: 60000,
    units: 5,
    renovationCost: 10000,
    downPaymentRatio: 0.25,
    interestRate: 4.5,
    amortizationYears: 25,
    expenseRatio: 40,
    vacancyRate: 5,
    appreciationRate: 2,
    holdingPeriod: 5
  };

  describe('calculateLiquidity', () => {
    it('devrait calculer correctement les métriques de liquidité', () => {
      const result = LiquidityCalculatorUtility.calculateLiquidity(sampleProperty);
      
      // Vérification des calculs de base
      expect(result).toBeDefined();
      expect(result.cashflow).toBeDefined();
      expect(result.ratios).toBeDefined();
      
      // Vérification que le cashflow est correct
      expect(result.cashflow.annualRevenueAfterVacancy).toBeCloseTo(57000);
      expect(result.cashflow.annualExpenses).toBeCloseTo(22800);
      expect(result.cashflow.netOperatingIncome).toBeCloseTo(34200);
      
      // Vérification des ratios importants
      expect(result.ratios.capRate).toBeGreaterThan(0);
      expect(result.ratios.dscr).toBeGreaterThan(0);
      expect(result.ratios.mrb).toBeCloseTo(0.12);
    });

    it('devrait gérer les cas où le cashflow est négatif', () => {
      const propertyWithNegativeCashflow = {
        ...sampleProperty,
        grossAnnualRent: 30000, // Revenu insuffisant
        expenseRatio: 50
      };
      
      const result = LiquidityCalculatorUtility.calculateLiquidity(propertyWithNegativeCashflow);
      expect(result.cashflow.annualCashflow).toBeLessThan(0);
    });

    it('devrait lancer une erreur si les données sont invalides', () => {
      // Test avec prix d'achat manquant
      expect(() => {
        LiquidityCalculatorUtility.calculateLiquidity({
          grossAnnualRent: 60000,
          units: 5,
          interestRate: 4.5,
          amortizationYears: 25
        });
      }).toThrow();
      
      // Test avec revenu locatif manquant
      expect(() => {
        LiquidityCalculatorUtility.calculateLiquidity({
          purchasePrice: 500000,
          units: 5,
          interestRate: 4.5,
          amortizationYears: 25
        });
      }).toThrow();
    });
  });

  describe('calculateTotalReturn', () => {
    it('devrait calculer correctement le rendement total', () => {
      const result = LiquidityCalculatorUtility.calculateTotalReturn(sampleProperty);
      
      expect(result).toBeDefined();
      expect(result.initialInvestment).toBeDefined();
      expect(result.gains).toBeDefined();
      expect(result.returns).toBeDefined();
      
      // Vérification des composantes du rendement
      expect(result.initialInvestment.downPayment).toBeCloseTo(125000);
      expect(result.initialInvestment.totalInvestment).toBeCloseTo(135000);
      
      // Vérification du ROI
      expect(result.returns.totalROI).toBeGreaterThan(0);
      expect(result.returns.annualizedROI).toBeGreaterThan(0);
    });
  });

  describe('performSensitivityAnalysis', () => {
    it('devrait effectuer une analyse de sensibilité pour différents paramètres', () => {
      const result = LiquidityCalculatorUtility.performSensitivityAnalysis(sampleProperty);
      
      expect(result).toBeDefined();
      expect(result.baseCase).toBeDefined();
      expect(result.sensitivityResults).toBeDefined();
      
      // Vérification des différentes analyses
      expect(result.sensitivityResults.interestRate).toHaveLength(6); // 6 variations de taux d'intérêt
      expect(result.sensitivityResults.vacancyRate).toHaveLength(4); // 4 variations de taux d'inoccupation
      expect(result.sensitivityResults.expenseRatio).toHaveLength(4); // 4 variations de ratio de dépenses
      expect(result.sensitivityResults.rent).toHaveLength(5); // 5 variations de loyer
    });

    it('devrait permettre de personnaliser les paramètres de sensibilité', () => {
      const customOptions = {
        interestRateVariations: [-2, 0, 2, 4],
        vacancyRateVariations: [0, 10, 20],
        expenseRatioVariations: [-10, 0, 10],
        rentVariations: [-20, 0, 20]
      };
      
      const result = LiquidityCalculatorUtility.performSensitivityAnalysis(sampleProperty, customOptions);
      
      expect(result.sensitivityResults.interestRate).toHaveLength(4);
      expect(result.sensitivityResults.vacancyRate).toHaveLength(3);
      expect(result.sensitivityResults.expenseRatio).toHaveLength(3);
      expect(result.sensitivityResults.rent).toHaveLength(3);
    });
  });

  describe('compareProperties', () => {
    it('devrait comparer correctement plusieurs propriétés', () => {
      const properties = [
        {
          id: 'Propriété A',
          purchasePrice: 500000,
          grossAnnualRent: 60000,
          units: 5,
          interestRate: 4.5,
          amortizationYears: 25
        },
        {
          id: 'Propriété B',
          purchasePrice: 600000,
          grossAnnualRent: 78000,
          units: 6,
          interestRate: 4.5,
          amortizationYears: 25
        },
        {
          id: 'Propriété C',
          purchasePrice: 450000,
          grossAnnualRent: 50000,
          units: 4,
          interestRate: 4.5,
          amortizationYears: 25
        }
      ];
      
      const result = LiquidityCalculatorUtility.compareProperties(properties);
      
      expect(result).toBeDefined();
      expect(result.properties).toHaveLength(3);
      expect(result.rankings).toBeDefined();
      
      // Vérification des classements
      expect(result.rankings.cashflow).toHaveLength(3);
      expect(result.rankings.capRate).toHaveLength(3);
      expect(result.rankings.overall).toHaveLength(3);
    });

    it('devrait lancer une erreur si moins de deux propriétés sont fournies', () => {
      expect(() => {
        LiquidityCalculatorUtility.compareProperties([sampleProperty]);
      }).toThrow();
    });
  });

  describe('calculateBreakeven', () => {
    it('devrait calculer correctement les points d\'équilibre', () => {
      const result = LiquidityCalculatorUtility.calculateBreakeven(sampleProperty);
      
      expect(result).toBeDefined();
      expect(result.currentState).toBeDefined();
      expect(result.breakEvenPoints).toBeDefined();
      expect(result.safety).toBeDefined();
      
      // Vérification des valeurs
      expect(result.breakEvenPoints.occupancyRate).toBeGreaterThan(0);
      expect(result.breakEvenPoints.occupancyRate).toBeLessThanOrEqual(100);
      expect(result.breakEvenPoints.minimumMonthlyRentPerUnit).toBeGreaterThan(0);
      expect(result.safety.occupancyMargin).toBeGreaterThanOrEqual(0);
    });
  });

  describe('analyzeRisks', () => {
    it('devrait analyser correctement les risques', () => {
      const result = LiquidityCalculatorUtility.analyzeRisks(sampleProperty);
      
      expect(result).toBeDefined();
      expect(result.riskFactors).toBeDefined();
      expect(result.overallRisk).toBeDefined();
      expect(result.stressTest).toBeDefined();
      expect(result.recommendations).toBeDefined();
      
      // Vérification des facteurs de risque
      expect(result.riskFactors.cashflow).toBeDefined();
      expect(result.riskFactors.dscr).toBeDefined();
      expect(result.riskFactors.lvr).toBeDefined();
      expect(result.riskFactors.vacancy).toBeDefined();
      expect(result.riskFactors.interestRate).toBeDefined();
      
      // Vérification des tests de stress
      expect(result.stressTest.interestRateIncrease3).toBeDefined();
      expect(result.stressTest.vacancy10Percent).toBeDefined();
      expect(result.stressTest.expenseIncrease15Percent).toBeDefined();
      expect(result.stressTest.combinedStress).toBeDefined();
    });

    it('devrait générer des recommandations appropriées selon le niveau de risque', () => {
      // Propriété à risque élevé
      const highRiskProperty = {
        ...sampleProperty,
        grossAnnualRent: 35000, // Revenu faible
        downPaymentRatio: 0.1, // Mise de fonds faible
        interestRate: 6.5 // Taux d'intérêt élevé
      };
      
      const result = LiquidityCalculatorUtility.analyzeRisks(highRiskProperty);
      
      expect(result.recommendations.length).toBeGreaterThan(0);
      expect(result.overallRisk).not.toBe('Faible');
    });
  });
});
