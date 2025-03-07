/**
 * Tests unitaires pour le calculateur de liquidité
 */

const { 
  calculateLiquidity, 
  calculateMaxPurchasePrice, 
  performSensitivityAnalysis,
  PROFITABILITY_THRESHOLDS
} = require('../liquidity_calculator');

describe('Calculateur de liquidité', () => {
  // Cas de test: immeuble à revenus 5 logements avec des paramètres réalistes
  const testInputMulti5 = {
    units: 5,
    revenues: {
      baseRent: 60000,  // 1000$ par mois par unité
      parking: 3000,    // 50$ par mois par unité
      laundry: 1200     // Environ 20$ par mois par unité
    },
    expenses: {
      municipalTax: 5000,
      schoolTax: 1000,
      insurance: 2400,
      electricity: 1200,
      heating: 3000,
      maintenance: 3000,
      management: 3000,
      snowRemoval: 1200,
      landscaping: 800,
      vacancy: 3,       // 3% du revenu brut
      badDebt: 1        // 1% du revenu brut
    },
    financing: {
      purchasePrice: 500000,
      downPayment: 100000,
      firstMortgageAmount: 400000,
      firstMortgageRate: 5,
      firstMortgageAmortization: 25
    }
  };

  describe('calculateLiquidity', () => {
    test('devrait calculer correctement les résultats pour un immeuble à 5 logements', () => {
      const result = calculateLiquidity(testInputMulti5);
      
      // Vérification des valeurs calculées
      expect(result.grossRevenue).toBe(64200);
      expect(result.totalExpenses).toBeCloseTo(23156, 0);
      expect(result.netOperatingIncome).toBeCloseTo(41044, 0);
      expect(result.totalMortgagePayment).toBeCloseTo(28075, 0);
      expect(result.cashflow).toBeCloseTo(12969, 0);
      expect(result.cashflowPerUnit).toBeCloseTo(216.15, 1);
      expect(result.capRate).toBeCloseTo(8.21, 1);
      expect(result.cashOnCash).toBeCloseTo(12.97, 1);
      expect(result.isViable).toBe(true);
      expect(result.rating).toBe("EXCELLENT");
    });

    test('devrait gérer correctement un cashflow négatif', () => {
      // Cloner l'entrée de test et augmenter les dépenses
      const negativeInput = JSON.parse(JSON.stringify(testInputMulti5));
      negativeInput.expenses.maintenance = 20000;  // Augmenter considérablement les frais d'entretien
      
      const result = calculateLiquidity(negativeInput);
      
      // Vérifier que le cashflow est négatif et le projet non viable
      expect(result.cashflow).toBeLessThan(0);
      expect(result.isViable).toBe(false);
      expect(result.rating).toBe("POOR");
    });

    test('devrait valider les entrées et lancer des erreurs appropriées', () => {
      // Test avec entrées invalides
      expect(() => {
        calculateLiquidity(null);
      }).toThrow("Les données d'entrée sont requises");
      
      expect(() => {
        calculateLiquidity({ units: -1, revenues: {}, expenses: {}, financing: {} });
      }).toThrow("Le nombre d'unités doit être un entier positif");
      
      expect(() => {
        calculateLiquidity({ 
          units: 5, 
          revenues: {}, 
          expenses: {}, 
          financing: { purchasePrice: 500000, downPayment: 100000 } 
        });
      }).toThrow("Le revenu de loyer de base est requis");
    });
  });

  describe('calculateMaxPurchasePrice', () => {
    test('devrait calculer correctement le prix d'achat maximum pour un cashflow cible', () => {
      const params = {
        units: 5,
        revenues: {
          baseRent: 60000,
          parking: 3000,
          laundry: 1200
        },
        expenses: {
          municipalTax: 5000,
          schoolTax: 1000,
          insurance: 2400,
          electricity: 1200,
          heating: 3000,
          maintenance: 3000,
          management: 3000,
          snowRemoval: 1200,
          landscaping: 800,
          vacancy: 3,
          badDebt: 1
        },
        mortgageTerms: {
          downPaymentRatio: 20,
          interestRate: 5,
          amortizationYears: 25
        },
        targetCashflowPerUnit: 75
      };
      
      const result = calculateMaxPurchasePrice(params);
      
      // Vérifier que le résultat est cohérent
      expect(result.maxPurchasePrice).toBeGreaterThan(0);
      expect(result.cashflowPerUnit).toBe(75);
      
      // Vérifier la cohérence interne
      expect(result.downPayment).toBeCloseTo(result.maxPurchasePrice * 0.2, 0);
      expect(result.mortgageAmount).toBeCloseTo(result.maxPurchasePrice * 0.8, 0);
    });

    test('devrait lancer une erreur si le cashflow cible est impossible à atteindre', () => {
      const params = {
        units: 5,
        revenues: {
          baseRent: 60000,
          parking: 3000,
          laundry: 1200
        },
        expenses: {
          municipalTax: 50000,  // Dépenses très élevées pour rendre le cashflow cible impossible
          schoolTax: 1000,
          insurance: 2400,
          electricity: 1200,
          heating: 3000,
          maintenance: 3000,
          management: 3000,
          snowRemoval: 1200,
          landscaping: 800,
          vacancy: 3,
          badDebt: 1
        },
        mortgageTerms: {
          downPaymentRatio: 20,
          interestRate: 5,
          amortizationYears: 25
        },
        targetCashflowPerUnit: 75
      };
      
      expect(() => {
        calculateMaxPurchasePrice(params);
      }).toThrow("Impossible d'atteindre le cashflow cible");
    });
  });

  describe('performSensitivityAnalysis', () => {
    test('devrait générer différents scénarios d\'analyse de sensibilité', () => {
      const scenarios = {
        purchasePrice: [-10, 0, 10],
        baseRent: [-10, 0, 10],
        expenses: [-10, 0, 10],
        interestRate: [-1, 0, 1]
      };
      
      const results = performSensitivityAnalysis(testInputMulti5, scenarios);
      
      // Vérifier que l'analyse contient le cas de base et des scénarios
      expect(results.baseCase).toBeDefined();
      expect(results.scenarios.length).toBe(8);  // 3 variations par paramètre - 1 cas de base déjà compté = 8
      
      // Vérifier que les scénarios sont triés par cashflow descendant
      const cashflows = results.scenarios.map(s => s.result.cashflowPerUnit);
      const sortedCashflows = [...cashflows].sort((a, b) => b - a);
      expect(cashflows).toEqual(sortedCashflows);
    });
  });

  describe('Cas d\'utilisation réels', () => {
    test('Scénario immeuble 4 logements à Montréal', () => {
      const input = {
        units: 4,
        revenues: {
          baseRent: 72000,  // 1500$ par mois par unité (moyenne réaliste pour Montréal)
          parking: 4800     // 100$ par mois par unité
        },
        expenses: {
          municipalTax: 7500,
          schoolTax: 1200,
          insurance: 2800,
          electricity: 1600,
          heating: 4000,
          maintenance: 3800,
          management: 3600,
          snowRemoval: 1400,
          landscaping: 900,
          vacancy: 3,
          badDebt: 1
        },
        financing: {
          purchasePrice: 700000,
          downPayment: 140000,
          firstMortgageAmount: 560000,
          firstMortgageRate: 4.5,
          firstMortgageAmortization: 25
        }
      };
      
      const result = calculateLiquidity(input);
      
      // Vérifions que c'est un investissement viable pour Montréal
      expect(result.isViable).toBe(true);
      expect(result.cashflowPerUnit).toBeGreaterThanOrEqual(PROFITABILITY_THRESHOLDS.MINIMUM);
      
      // Calculer le prix maximum pour un cashflow cible de 75$ par porte
      const maxPriceParams = {
        units: input.units,
        revenues: input.revenues,
        expenses: input.expenses,
        mortgageTerms: {
          downPaymentRatio: 20,
          interestRate: 4.5,
          amortizationYears: 25
        },
        targetCashflowPerUnit: 75
      };
      
      const maxPriceResult = calculateMaxPurchasePrice(maxPriceParams);
      expect(maxPriceResult.maxPurchasePrice).toBeGreaterThan(0);
    });

    test('Scénario immeuble 12 logements à Québec', () => {
      const input = {
        units: 12,
        revenues: {
          baseRent: 120000,  // 833$ par mois par unité (moyenne pour Québec)
          parking: 7200,     // 50$ par mois par unité
          laundry: 3600      // 25$ par mois par unité
        },
        expenses: {
          municipalTax: 12000,
          schoolTax: 2800,
          insurance: 6500,
          electricity: 4800,
          heating: 9000,
          maintenance: 8400,
          management: 7800,
          snowRemoval: 2800,
          landscaping: 1800,
          vacancy: 4,
          badDebt: 1.5
        },
        financing: {
          purchasePrice: 1200000,
          downPayment: 300000,
          firstMortgageAmount: 900000,
          firstMortgageRate: 4.75,
          firstMortgageAmortization: 25
        }
      };
      
      const result = calculateLiquidity(input);
      
      // Pour un immeuble plus grand, vérifions les résultats
      expect(result.isViable).toBe(true);
      expect(result.cashflowPerUnit).toBeGreaterThan(0);
      
      // Analyser la sensibilité
      const sensitivityResults = performSensitivityAnalysis(input);
      expect(sensitivityResults.scenarios.length).toBeGreaterThan(0);
      
      // Vérifier les optimisations proposées
      expect(result.optimizations).toBeDefined();
      expect(result.optimizations.revenue.length).toBeGreaterThanOrEqual(0);
      expect(result.optimizations.expenses.length).toBeGreaterThanOrEqual(0);
      expect(result.optimizations.financing.length).toBeGreaterThanOrEqual(0);
    });
  });
});
