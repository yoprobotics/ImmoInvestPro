/**
 * Tests pour le calculateur Napkin MULTI (Méthode PAR + HIGH-5)
 */

const {
  EXPENSE_PERCENTAGES,
  HIGH_5_FACTOR,
  PROFITABILITY_THRESHOLDS,
  calculateMultiNapkin,
  calculateMaxPurchasePrice
} = require('../../calculators/napkin/multi_calculator');

describe('Calculateur Napkin MULTI (PAR + HIGH-5)', () => {
  // Cas de base pour un immeuble à revenus rentable
  const baseInput = {
    price: 175000,          // Prix d'achat
    units: 4,               // Nombre d'unités (appartements)
    grossRevenue: 20640     // Revenus bruts annuels
  };

  // Cas d'entrée invalide ou incomplète
  const invalidInputs = [
    { description: 'Input vide', input: null },
    { description: 'Prix manquant', input: { ...baseInput, price: null } },
    { description: 'Unités manquantes', input: { ...baseInput, units: null } },
    { description: 'Revenus manquants', input: { ...baseInput, grossRevenue: null } },
    { description: 'Prix négatif', input: { ...baseInput, price: -10000 } },
    { description: 'Unités négatives', input: { ...baseInput, units: -1 } },
    { description: 'Unités non entières', input: { ...baseInput, units: 2.5 } },
    { description: 'Revenus négatifs', input: { ...baseInput, grossRevenue: -5000 } },
    { description: 'Revenus trop faibles par rapport au prix', input: { price: 500000, units: 4, grossRevenue: 10000 } }
  ];

  describe('calculateMultiNapkin - calcul de base de la liquidité', () => {
    test('Devrait calculer correctement la liquidité pour un cas rentable', () => {
      const result = calculateMultiNapkin(baseInput);
      
      // Vérification du pourcentage des dépenses (35% pour 4 unités)
      expect(result.expensePercentage).toBe(EXPENSE_PERCENTAGES.MEDIUM.percentage);
      
      // Vérification des dépenses
      expect(result.expenses).toBeCloseTo(7224, 2);  // 20640 * 0.35
      
      // Vérification du revenu net d'opération
      expect(result.netOperatingIncome).toBeCloseTo(13416, 2);  // 20640 - 7224
      
      // Vérification du paiement hypothécaire (HIGH-5)
      expect(result.mortgagePayment).toBeCloseTo(10500, 2);  // 175000 * 0.005 * 12
      
      // Vérification du cashflow
      expect(result.cashflow).toBeCloseTo(2916, 2);  // 13416 - 10500
      
      // Vérification du cashflow par porte par mois
      expect(result.cashflowPerUnit).toBeCloseTo(60.75, 2);  // 2916 / 4 / 12
      
      // Vérification de la viabilité
      expect(result.isViable).toBe(true);
      
      // Vérification de l'évaluation
      expect(result.rating).toBe('ACCEPTABLE');  // Entre 50 et 75
    });

    test('Les résultats doivent inclure tous les champs requis', () => {
      const result = calculateMultiNapkin(baseInput);
      
      // Vérification des champs principaux
      expect(result).toHaveProperty('price');
      expect(result).toHaveProperty('units');
      expect(result).toHaveProperty('grossRevenue');
      expect(result).toHaveProperty('expensePercentage');
      expect(result).toHaveProperty('expenses');
      expect(result).toHaveProperty('netOperatingIncome');
      expect(result).toHaveProperty('mortgagePayment');
      expect(result).toHaveProperty('cashflow');
      expect(result).toHaveProperty('cashflowPerUnit');
      expect(result).toHaveProperty('isViable');
      expect(result).toHaveProperty('rating');
      expect(result).toHaveProperty('recommendation');
    });

    // Vérification des pourcentages de dépenses en fonction du nombre d'unités
    test('Devrait appliquer le bon pourcentage de dépenses selon le nombre d\'unités', () => {
      // 1-2 unités: 30%
      const smallCase = { ...baseInput, units: 2 };
      expect(calculateMultiNapkin(smallCase).expensePercentage).toBe(EXPENSE_PERCENTAGES.SMALL.percentage);
      
      // 3-4 unités: 35%
      const mediumCase = { ...baseInput, units: 4 };
      expect(calculateMultiNapkin(mediumCase).expensePercentage).toBe(EXPENSE_PERCENTAGES.MEDIUM.percentage);
      
      // 5-6 unités: 45%
      const largeCase = { ...baseInput, units: 6 };
      expect(calculateMultiNapkin(largeCase).expensePercentage).toBe(EXPENSE_PERCENTAGES.LARGE.percentage);
      
      // 7+ unités: 50%
      const xlargeCase = { ...baseInput, units: 10 };
      expect(calculateMultiNapkin(xlargeCase).expensePercentage).toBe(EXPENSE_PERCENTAGES.XLARGE.percentage);
    });

    // Test pour les évaluations de cashflow
    test('Devrait évaluer correctement le projet en fonction du cashflow par unité', () => {
      // Cas EXCELLENT (>= 100)
      const excellentCase = { 
        price: 150000, 
        units: 4, 
        grossRevenue: 23000 
      };
      const excellentResult = calculateMultiNapkin(excellentCase);
      expect(excellentResult.cashflowPerUnit).toBeGreaterThanOrEqual(PROFITABILITY_THRESHOLDS.EXCELLENT);
      expect(excellentResult.rating).toBe('EXCELLENT');
      
      // Cas GOOD (>= 75 mais < 100)
      const goodCase = { 
        price: 175000, 
        units: 4, 
        grossRevenue: 22000 
      };
      const goodResult = calculateMultiNapkin(goodCase);
      expect(goodResult.cashflowPerUnit).toBeGreaterThanOrEqual(PROFITABILITY_THRESHOLDS.TARGET);
      expect(goodResult.cashflowPerUnit).toBeLessThan(PROFITABILITY_THRESHOLDS.EXCELLENT);
      expect(goodResult.rating).toBe('GOOD');
      
      // Cas ACCEPTABLE (>= 50 mais < 75)
      const acceptableCase = baseInput; // Notre cas de base est déjà dans cette catégorie
      const acceptableResult = calculateMultiNapkin(acceptableCase);
      expect(acceptableResult.cashflowPerUnit).toBeGreaterThanOrEqual(PROFITABILITY_THRESHOLDS.MINIMUM);
      expect(acceptableResult.cashflowPerUnit).toBeLessThan(PROFITABILITY_THRESHOLDS.TARGET);
      expect(acceptableResult.rating).toBe('ACCEPTABLE');
      
      // Cas POOR (> 0 mais < 50)
      const poorCase = { 
        price: 200000, 
        units: 4, 
        grossRevenue: 19000 
      };
      const poorResult = calculateMultiNapkin(poorCase);
      expect(poorResult.cashflowPerUnit).toBeLessThan(PROFITABILITY_THRESHOLDS.MINIMUM);
      expect(poorResult.cashflowPerUnit).toBeGreaterThan(0);
      expect(poorResult.rating).toBe('POOR');
      
      // Cas NOT_VIABLE (<= 0)
      const notViableCase = { 
        price: 250000, 
        units: 4, 
        grossRevenue: 18000 
      };
      const notViableResult = calculateMultiNapkin(notViableCase);
      expect(notViableResult.cashflowPerUnit).toBeLessThanOrEqual(0);
      expect(notViableResult.rating).toBe('NOT_VIABLE');
    });

    test('Devrait rejeter les entrées invalides', () => {
      invalidInputs.forEach(({ description, input }) => {
        expect(() => calculateMultiNapkin(input)).toThrow();
      });
    });
  });

  describe('calculateMaxPurchasePrice - calcul du prix d\'achat maximum', () => {
    const maxPriceParams = {
      units: 4,                 // Nombre d'unités (appartements)
      grossRevenue: 20640,      // Revenus bruts annuels
      targetCashflowPerUnit: 75 // Cashflow cible par unité par mois
    };

    test('Devrait calculer correctement le prix d\'achat maximum', () => {
      const result = calculateMaxPurchasePrice(maxPriceParams);
      
      // Vérification des résultats
      expect(result).toHaveProperty('units');
      expect(result).toHaveProperty('grossRevenue');
      expect(result).toHaveProperty('expensePercentage');
      expect(result).toHaveProperty('expenses');
      expect(result).toHaveProperty('netOperatingIncome');
      expect(result).toHaveProperty('targetCashflowPerUnit');
      expect(result).toHaveProperty('targetAnnualCashflow');
      expect(result).toHaveProperty('maxMortgagePayment');
      expect(result).toHaveProperty('maxPurchasePrice');
      
      // Vérification des calculs
      expect(result.expensePercentage).toBe(35);  // 35% pour 4 unités
      expect(result.expenses).toBeCloseTo(7224, 2);  // 20640 * 0.35
      expect(result.netOperatingIncome).toBeCloseTo(13416, 2);  // 20640 - 7224
      expect(result.targetAnnualCashflow).toBeCloseTo(3600, 2);  // 75 * 4 * 12
      expect(result.maxMortgagePayment).toBeCloseTo(9816, 2);  // 13416 - 3600
      expect(result.maxPurchasePrice).toBeCloseTo(163600, 2);  // 9816 / 12 / 0.005
    });

    test('Devrait utiliser le cashflow cible par défaut si non spécifié', () => {
      const paramsWithoutTarget = {
        units: 4,
        grossRevenue: 20640
      };
      
      const result = calculateMaxPurchasePrice(paramsWithoutTarget);
      expect(result.targetCashflowPerUnit).toBe(PROFITABILITY_THRESHOLDS.TARGET);
    });

    test('Devrait rejeter les cas où le cashflow cible est impossible', () => {
      // Cas où les revenus sont trop faibles par rapport aux dépenses
      const impossibleCase = {
        units: 4,
        grossRevenue: 8000,
        targetCashflowPerUnit: 100
      };
      
      expect(() => calculateMaxPurchasePrice(impossibleCase)).toThrow();
    });
  });
});
