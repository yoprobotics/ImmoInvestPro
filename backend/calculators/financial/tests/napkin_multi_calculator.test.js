/**
 * Tests unitaires pour le calculateur Napkin MULTI
 */

const { 
  calculateNapkinMulti, 
  calculateOptimalOffer,
  CASHFLOW_THRESHOLDS,
  EXPENSE_RATIOS
} = require('../napkin_multi_calculator');

describe('Calculateur Napkin MULTI', () => {
  // Cas de test: immeuble à revenus 6 logements avec des paramètres réalistes
  const testInputMulti6 = {
    purchasePrice: 600000,  // Prix d'achat
    units: 6,              // Nombre d'unités
    grossRevenue: 72000    // Revenus bruts annuels (1000$ par mois par unité)
  };

  describe('calculateNapkinMulti', () => {
    test('devrait calculer correctement les résultats pour un immeuble à 6 logements', () => {
      const result = calculateNapkinMulti(testInputMulti6);
      
      // Vérification des valeurs calculées
      expect(result.expenseRatio).toBe(45);                 // 45% pour 6 logements
      expect(result.annualExpenses).toBe(32400);           // 45% de 72000
      expect(result.netOperatingIncome).toBe(39600);       // 72000 - 32400
      expect(result.annualMortgagePayment).toBe(36000);    // 600000 * 0.005 * 12
      expect(result.annualCashflow).toBe(3600);            // 39600 - 36000
      expect(result.monthlyCashflowPerUnit).toBe(50);      // 3600 / 6 / 12
      expect(result.isViable).toBe(true);                  // Cashflow >= seuil minimum
      expect(result.rating).toBe("ACCEPTABLE");             // Entre minimum et cible
    });

    test('devrait gérer correctement un cashflow négatif', () => {
      // Cloner l'entrée de test et diminuer les revenus
      const negativeInput = JSON.parse(JSON.stringify(testInputMulti6));
      negativeInput.grossRevenue = 60000;  // Diminuer les revenus
      
      const result = calculateNapkinMulti(negativeInput);
      
      // Vérifier que le cashflow est négatif et le projet non viable
      expect(result.annualCashflow).toBeLessThan(0);
      expect(result.monthlyCashflowPerUnit).toBeLessThan(0);
      expect(result.isViable).toBe(false);
      expect(result.rating).toBe("POOR");
    });

    test('devrait valider les entrées et lancer des erreurs appropriées', () => {
      // Test avec entrées invalides
      expect(() => {
        calculateNapkinMulti(null);
      }).toThrow("Les données d'entrée sont requises");
      
      expect(() => {
        calculateNapkinMulti({ purchasePrice: -1, units: 6, grossRevenue: 72000 });
      }).toThrow("Le prix d'achat doit être un nombre positif");
      
      expect(() => {
        calculateNapkinMulti({ purchasePrice: 600000, units: 0, grossRevenue: 72000 });
      }).toThrow("Le nombre d'unités doit être un entier positif");
      
      expect(() => {
        calculateNapkinMulti({ purchasePrice: 600000, units: 6, grossRevenue: 0 });
      }).toThrow("Les revenus bruts doivent être un nombre positif");
    });

    test('devrait utiliser le bon ratio de dépenses selon le nombre d\'unités', () => {
      // Test avec 2 unités
      const smallInput = { purchasePrice: 300000, units: 2, grossRevenue: 30000 };
      const smallResult = calculateNapkinMulti(smallInput);
      expect(smallResult.expenseRatio).toBe(EXPENSE_RATIOS.SMALL);  // 30%
      
      // Test avec 4 unités
      const mediumInput = { purchasePrice: 450000, units: 4, grossRevenue: 48000 };
      const mediumResult = calculateNapkinMulti(mediumInput);
      expect(mediumResult.expenseRatio).toBe(EXPENSE_RATIOS.MEDIUM);  // 35%
      
      // Test avec 6 unités (déjà testé dans le premier test)
      
      // Test avec 8 unités
      const xlargeInput = { purchasePrice: 800000, units: 8, grossRevenue: 96000 };
      const xlargeResult = calculateNapkinMulti(xlargeInput);
      expect(xlargeResult.expenseRatio).toBe(EXPENSE_RATIOS.XLARGE);  // 50%
    });
  });

  describe('calculateOptimalOffer', () => {
    test('devrait calculer correctement le prix d\'offre optimal pour un cashflow cible', () => {
      const params = {
        units: 6,
        grossRevenue: 72000,
        targetCashflowPerUnit: 75  // Cashflow cible de 75$ par porte par mois
      };
      
      const result = calculateOptimalOffer(params);
      
      // Vérifier que le résultat est cohérent
      expect(result.optimalOffer).toBeGreaterThan(0);
      expect(result.calculatedCashflowPerUnit).toBeCloseTo(75, 0);
      expect(result.isPossible).toBe(true);
    });

    test('devrait indiquer quand une offre n\'est pas possible', () => {
      const params = {
        units: 6,
        grossRevenue: 40000,  // Revenus très faibles
        targetCashflowPerUnit: 100  // Cashflow cible élevé
      };
      
      const result = calculateOptimalOffer(params);
      
      // Le projet ne peut pas générer assez de cashflow pour atteindre la cible
      expect(result.isPossible).toBe(false);
    });
  });

  describe('Cas d\'utilisation réels', () => {
    test('Scénario immeuble 5 logements à Québec', () => {
      const input = {
        purchasePrice: 550000,  // Prix d'achat
        units: 5,               // Nombre d'unités
        grossRevenue: 60000     // Revenus bruts annuels (1000$ par mois par unité)
      };
      
      const result = calculateNapkinMulti(input);
      
      // Vérifier les résultats pour Québec
      expect(result.expenseRatio).toBe(45);  // 45% pour 5 logements
      expect(result.netOperatingIncome).toBe(33000);  // 60000 - (60000 * 45%)
      
      // Calculer l'offre optimale pour un cashflow cible de 75$ par porte
      const optimalOfferParams = {
        units: input.units,
        grossRevenue: input.grossRevenue,
        targetCashflowPerUnit: 75
      };
      
      const optimalOfferResult = calculateOptimalOffer(optimalOfferParams);
      expect(optimalOfferResult.isPossible).toBe(true);
    });

    test('Scénario immeuble 12 logements à Montréal', () => {
      const input = {
        purchasePrice: 1200000,  // Prix d'achat
        units: 12,               // Nombre d'unités
        grossRevenue: 144000     // Revenus bruts annuels (1000$ par mois par unité)
      };
      
      const result = calculateNapkinMulti(input);
      
      // Vérifier les résultats pour un grand immeuble
      expect(result.expenseRatio).toBe(50);  // 50% pour 12 logements
      expect(result.netOperatingIncome).toBe(72000);  // 144000 - (144000 * 50%)
      expect(result.annualMortgagePayment).toBe(72000);  // 1200000 * 0.005 * 12
      expect(result.annualCashflow).toBe(0);  // 72000 - 72000
    });
  });
});
