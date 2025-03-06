/**
 * Tests unitaires pour le service NapkinCalculator
 */

const NapkinCalculator = require('../../services/calculators/NapkinCalculator');

describe('NapkinCalculator', () => {
  
  // Tests pour le calculateur Napkin FLIP
  describe('calculateFlipProfit', () => {
    test('devrait calculer correctement le profit d\'un FLIP', () => {
      const result = NapkinCalculator.calculateFlipProfit(350000, 250000, 50000);
      
      // Vérification des valeurs
      expect(result.finalPrice).toBe(350000);
      expect(result.initialPrice).toBe(250000);
      expect(result.renovationCost).toBe(50000);
      expect(result.expenses).toBe(35000); // 10% de 350000
      expect(result.profit).toBe(15000); // 350000 - 250000 - 50000 - 35000
      expect(result.profitPercentage).toBe(5); // 15000 / (250000 + 50000) * 100
    });
    
    test('devrait calculer un profit négatif si les coûts dépassent la valeur de revente', () => {
      const result = NapkinCalculator.calculateFlipProfit(350000, 300000, 60000);
      
      expect(result.profit).toBe(-45000); // 350000 - 300000 - 60000 - 35000
      expect(result.profitPercentage).toBe(-12.5); // -45000 / (300000 + 60000) * 100
    });
    
    test('devrait rejeter si des paramètres sont manquants', () => {
      expect(() => {
        NapkinCalculator.calculateFlipProfit(350000, null, 50000);
      }).toThrow('Tous les paramètres sont requis');
    });
  });
  
  describe('calculateFlipOfferPrice', () => {
    test('devrait calculer correctement le prix d\'offre maximum pour un FLIP', () => {
      const result = NapkinCalculator.calculateFlipOfferPrice(350000, 50000, 25000);
      
      // Vérification des valeurs
      expect(result.finalPrice).toBe(350000);
      expect(result.renovationCost).toBe(50000);
      expect(result.expenses).toBe(35000); // 10% de 350000
      expect(result.targetProfit).toBe(25000);
      expect(result.maxOfferPrice).toBe(240000); // 350000 - 50000 - 35000 - 25000
    });
    
    test('devrait rejeter si des paramètres sont manquants', () => {
      expect(() => {
        NapkinCalculator.calculateFlipOfferPrice(350000, 50000, null);
      }).toThrow('Tous les paramètres sont requis');
    });
  });
  
  // Tests pour le calculateur Napkin MULTI
  describe('calculateMultiCashflow', () => {
    test('devrait calculer correctement le cashflow pour un immeuble de 4 logements', () => {
      const result = NapkinCalculator.calculateMultiCashflow(500000, 4, 60000);
      
      // Vérification des valeurs
      expect(result.purchasePrice).toBe(500000);
      expect(result.apartmentCount).toBe(4);
      expect(result.grossRevenue).toBe(60000);
      expect(result.expensesPercentage).toBe(35); // 4 logements = 35%
      expect(result.expenses).toBe(21000); // 35% de 60000
      expect(result.netOperatingIncome).toBe(39000); // 60000 - 21000
      expect(result.annualMortgagePayment).toBe(30000); // 500000 * 0.005 * 12
      expect(result.annualCashflow).toBe(9000); // 39000 - 30000
      expect(result.monthlyCashflowPerDoor).toBe(187.5); // 9000 / (4 * 12)
    });
    
    test('devrait calculer correctement les pourcentages de dépenses selon le nombre de logements', () => {
      // Test pour 2 logements (30%)
      let result = NapkinCalculator.calculateMultiCashflow(500000, 2, 60000);
      expect(result.expensesPercentage).toBe(30);
      
      // Test pour 5 logements (45%)
      result = NapkinCalculator.calculateMultiCashflow(500000, 5, 60000);
      expect(result.expensesPercentage).toBe(45);
      
      // Test pour 8 logements (50%)
      result = NapkinCalculator.calculateMultiCashflow(500000, 8, 60000);
      expect(result.expensesPercentage).toBe(50);
    });
    
    test('devrait rejeter si des paramètres sont manquants', () => {
      expect(() => {
        NapkinCalculator.calculateMultiCashflow(500000, null, 60000);
      }).toThrow('Tous les paramètres sont requis');
    });
  });
  
  describe('calculateMultiOfferPrice', () => {
    test('devrait calculer correctement le prix d\'offre maximum pour un MULTI', () => {
      const result = NapkinCalculator.calculateMultiOfferPrice(4, 60000, 75);
      
      // Vérification des valeurs
      expect(result.apartmentCount).toBe(4);
      expect(result.grossRevenue).toBe(60000);
      expect(result.expensesPercentage).toBe(35); // 4 logements = 35%
      expect(result.expenses).toBe(21000); // 35% de 60000
      expect(result.netOperatingIncome).toBe(39000); // 60000 - 21000
      expect(result.targetCashflowPerDoor).toBe(75);
      expect(result.targetAnnualCashflow).toBe(3600); // 75 * 4 * 12
      expect(result.maxAnnualMortgagePayment).toBe(35400); // 39000 - 3600
      
      // Calcul du prix d'achat maximum
      // Prix d'achat = (Paiement annuel / 12) / 0.005
      // Prix d'achat = (35400 / 12) / 0.005 = 590000
      expect(result.maxPurchasePrice).toBe(590000);
    });
    
    test('devrait prendre en compte les différents pourcentages de dépenses selon le nombre de logements', () => {
      // Test pour 2 logements (30%)
      let result = NapkinCalculator.calculateMultiOfferPrice(2, 60000, 75);
      expect(result.expensesPercentage).toBe(30);
      expect(result.expenses).toBe(18000); // 30% de 60000
      
      // Test pour 5 logements (45%)
      result = NapkinCalculator.calculateMultiOfferPrice(5, 60000, 75);
      expect(result.expensesPercentage).toBe(45);
      expect(result.expenses).toBe(27000); // 45% de 60000
      
      // Test pour 8 logements (50%)
      result = NapkinCalculator.calculateMultiOfferPrice(8, 60000, 75);
      expect(result.expensesPercentage).toBe(50);
      expect(result.expenses).toBe(30000); // 50% de 60000
    });
    
    test('devrait rejeter si des paramètres sont manquants', () => {
      expect(() => {
        NapkinCalculator.calculateMultiOfferPrice(4, null, 75);
      }).toThrow('Tous les paramètres sont requis');
    });
  });
});
