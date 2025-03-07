/**
 * Tests unitaires pour le calculateur Napkin MULTI
 */

const { 
  calculateNapkinMulti, 
  calculateMaxPurchasePrice, 
  performSensitivityAnalysis,
  PROFITABILITY_THRESHOLDS_MULTI,
  EXPENSE_RATIOS
} = require('../napkin_multi_calculator');

describe('Calculateur Napkin MULTI', () => {
  // Cas de test: immeuble à revenus 5 logements avec des paramètres réalistes
  const testInputMulti5 = {
    purchasePrice: 500000, // Prix d'achat
    units: 5,             // Nombre d'unités (portes)
    grossRevenue: 60000   // Revenus bruts annuels
  };

  describe('calculateNapkinMulti', () => {
    test('devrait calculer correctement les résultats pour un immeuble à 5 logements', () => {
      const result = calculateNapkinMulti(testInputMulti5);
      
      // Vérification des valeurs calculées
      const expectedExpenses = testInputMulti5.grossRevenue * EXPENSE_RATIOS.LARGE; // 45% pour 5-6 logements
      const expectedNoi = testInputMulti5.grossRevenue - expectedExpenses;
      const expectedFinancing = testInputMulti5.purchasePrice * 0.005 * 12; // HIGH-5
      const expectedCashflow = expectedNoi - expectedFinancing;
      const expectedCashflowPerUnit = expectedCashflow / testInputMulti5.units / 12;
      
      expect(result.grossRevenue).toBe(testInputMulti5.grossRevenue);
      expect(result.expenses).toBeCloseTo(expectedExpenses, 0);
      expect(result.noi).toBeCloseTo(expectedNoi, 0);
      expect(result.financing).toBeCloseTo(expectedFinancing, 0);
      expect(result.cashflow).toBeCloseTo(expectedCashflow, 0);
      expect(result.cashflowPerUnit).toBeCloseTo(expectedCashflowPerUnit, 1);
      expect(result.isViable).toBeDefined();
      expect(result.rating).toBeDefined();
      expect(result.recommendation).toBeDefined();
    });

    test('devrait utiliser le bon ratio de dépenses selon le nombre d\'unités', () => {
      // Test avec 2 logements
      const inputSmall = { purchasePrice: 300000, units: 2, grossRevenue: 30000 };
      const resultSmall = calculateNapkinMulti(inputSmall);
      expect(resultSmall.expenseRatio).toBeCloseTo(EXPENSE_RATIOS.SMALL * 100, 1);
      
      // Test avec 4 logements
      const inputMedium = { purchasePrice: 400000, units: 4, grossRevenue: 45000 };
      const resultMedium = calculateNapkinMulti(inputMedium);
      expect(resultMedium.expenseRatio).toBeCloseTo(EXPENSE_RATIOS.MEDIUM * 100, 1);
      
      // Test avec 6 logements
      const inputLarge = { purchasePrice: 600000, units: 6, grossRevenue: 70000 };
      const resultLarge = calculateNapkinMulti(inputLarge);
      expect(resultLarge.expenseRatio).toBeCloseTo(EXPENSE_RATIOS.LARGE * 100, 1);
      
      // Test avec 10 logements
      const inputXLarge = { purchasePrice: 900000, units: 10, grossRevenue: 100000 };
      const resultXLarge = calculateNapkinMulti(inputXLarge);
      expect(resultXLarge.expenseRatio).toBeCloseTo(EXPENSE_RATIOS.XLARGE * 100, 1);
    });

    test('devrait gérer correctement un cashflow négatif', () => {
      // Immeuble avec cashflow négatif
      const negativeInput = {
        purchasePrice: 700000, // Prix trop élevé pour les revenus
        units: 5,
        grossRevenue: 50000
      };
      
      const result = calculateNapkinMulti(negativeInput);
      
      // Vérifier que le cashflow est négatif et le projet non viable
      expect(result.cashflow).toBeLessThan(0);
      expect(result.isViable).toBe(false);
      expect(result.rating).toBe("POOR");
    });

    test('devrait valider les entrées et lancer des erreurs appropriées', () => {
      // Test avec entrées invalides
      expect(() => {
        calculateNapkinMulti(null);
      }).toThrow("Les données d'entrée sont requises");
      
      expect(() => {
        calculateNapkinMulti({ purchasePrice: -1, units: 5, grossRevenue: 60000 });
      }).toThrow("Le prix d'achat doit être un nombre positif");
      
      expect(() => {
        calculateNapkinMulti({ purchasePrice: 500000, units: 0, grossRevenue: 60000 });
      }).toThrow("Le nombre d'unités doit être un entier positif");
      
      expect(() => {
        calculateNapkinMulti({ purchasePrice: 500000, units: 5, grossRevenue: 0 });
      }).toThrow("Les revenus bruts doivent être un nombre positif");
    });
  });

  describe('calculateMaxPurchasePrice', () => {
    test('devrait calculer correctement le prix d'achat maximum pour un cashflow cible par porte', () => {
      const params = {
        units: 5,
        grossRevenue: 60000,
        targetCashflowPerUnit: 75
      };
      
      const result = calculateMaxPurchasePrice(params);
      
      // Vérifier que le résultat est cohérent
      expect(result.maxPurchasePrice).toBeGreaterThan(0);
      expect(result.targetCashflowPerUnit).toBe(75);
      
      // Vérifier la cohérence interne
      const expectedExpenses = params.grossRevenue * EXPENSE_RATIOS.LARGE;
      const expectedNoi = params.grossRevenue - expectedExpenses;
      const expectedTargetCashflow = params.targetCashflowPerUnit * params.units * 12;
      const expectedMaxMortgagePayment = expectedNoi - expectedTargetCashflow;
      const expectedMaxPurchasePrice = expectedMaxMortgagePayment / (0.005 * 12);
      
      expect(result.maxPurchasePrice).toBeCloseTo(expectedMaxPurchasePrice, 0);
      expect(result.noi).toBeCloseTo(expectedNoi, 0);
      expect(result.targetCashflow).toBeCloseTo(expectedTargetCashflow, 0);
    });

    test('devrait utiliser le cashflow cible par défaut si non spécifié', () => {
      const params = {
        units: 5,
        grossRevenue: 60000
      };
      
      const result = calculateMaxPurchasePrice(params);
      
      expect(result.targetCashflowPerUnit).toBe(PROFITABILITY_THRESHOLDS_MULTI.TARGET);
    });

    test('devrait lancer une erreur si le cashflow cible est impossible à atteindre', () => {
      const params = {
        units: 5,
        grossRevenue: 30000, // Revenus trop faibles
        targetCashflowPerUnit: 200 // Cashflow cible trop élevé
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
        grossRevenue: [-10, 0, 10]
      };
      
      const results = performSensitivityAnalysis(testInputMulti5, scenarios);
      
      // Vérifier que l'analyse contient le cas de base et des scénarios
      expect(results.baseCase).toBeDefined();
      expect(results.scenarios.length).toBe(4);  // 2 variations par paramètre - 1 cas de base déjà compté = 4
      
      // Vérifier que les scénarios sont triés par cashflow par porte descendant
      const cashflows = results.scenarios.map(s => s.result.cashflowPerUnit);
      const sortedCashflows = [...cashflows].sort((a, b) => b - a);
      expect(cashflows).toEqual(sortedCashflows);
    });
  });

  describe('Cas d\'utilisation réels', () => {
    test('Scénario immeuble 4 logements à Montréal', () => {
      const input = {
        purchasePrice: 700000, // Prix d'achat
        units: 4,             // Nombre d'unités (portes)
        grossRevenue: 72000   // Revenus bruts annuels (1500$ par mois par unité)
      };
      
      const result = calculateNapkinMulti(input);
      
      // Vérifier que c'est un investissement viable pour Montréal
      // Calcul manuel: 72000 - (72000 * 0.35) - (700000 * 0.005 * 12) = 46800 - 42000 = 4800 / 4 / 12 = 100$ par porte par mois
      expect(result.cashflowPerUnit).toBeCloseTo(100, 0);
      expect(result.isViable).toBe(true);
      
      // Calculer le prix maximum pour un cashflow cible de 75$ par porte
      const maxPriceParams = {
        units: input.units,
        grossRevenue: input.grossRevenue,
        targetCashflowPerUnit: 75
      };
      
      const maxPriceResult = calculateMaxPurchasePrice(maxPriceParams);
      expect(maxPriceResult.maxPurchasePrice).toBeGreaterThan(0);
    });

    test('Scénario immeuble 12 logements à Québec', () => {
      const input = {
        purchasePrice: 1200000, // Prix d'achat
        units: 12,             // Nombre d'unités (portes)
        grossRevenue: 120000   // Revenus bruts annuels (833$ par mois par unité)
      };
      
      const result = calculateNapkinMulti(input);
      
      // Pour un immeuble plus grand, vérifier les résultats
      // Calcul manuel: 120000 - (120000 * 0.5) - (1200000 * 0.005 * 12) = 60000 - 72000 = -12000 / 12 / 12 = -83$ par porte par mois
      expect(result.cashflowPerUnit).toBeLessThan(0);
      expect(result.isViable).toBe(false);
      
      // Analyser la sensibilité
      const sensitivityResults = performSensitivityAnalysis(input);
      expect(sensitivityResults.scenarios.length).toBeGreaterThan(0);
    });
  });
});
