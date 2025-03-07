/**
 * Tests pour le calculateur de rendement MULTI détaillé (version 5.1)
 */

const MultiDetailedCalculator = require('../detailed/MultiDetailedCalculator');

describe('MultiDetailedCalculator', () => {
  describe('_calculateDetailedRevenues', () => {
    test('calcule correctement les revenus sans données', () => {
      const result = MultiDetailedCalculator._calculateDetailedRevenues();
      expect(result.totalAnnualRevenue).toBe(0);
      expect(result.totalMonthlyRevenue).toBe(0);
    });

    test('calcule correctement les revenus des unités avec taux d\'inoccupation', () => {
      const revenueData = {
        units: [
          { type: '3 1/2', monthlyRent: 800, isOccupied: true },
          { type: '3 1/2', monthlyRent: 800, isOccupied: true },
          { type: '4 1/2', monthlyRent: 1000, isOccupied: true },
          { type: '4 1/2', monthlyRent: 1000, isOccupied: false }
        ],
        vacancyRate: 5
      };
      
      const result = MultiDetailedCalculator._calculateDetailedRevenues(revenueData);
      
      // 3 unités occupées sur 4 = 75% d'occupation, mais on utilise le taux fourni de 5%
      expect(result.potentialMonthlyUnitRevenue).toBe(3600);
      expect(result.occupancyRate).toBe(75);
      expect(result.totalMonthlyUnitRevenue).toBeCloseTo(3420); // 3600 * 0.95
      expect(result.totalAnnualRevenue).toBeCloseTo(41040); // 3420 * 12
    });

    test('calcule correctement les revenus additionnels', () => {
      const revenueData = {
        units: [
          { type: '3 1/2', monthlyRent: 800, isOccupied: true }
        ],
        additionalRevenues: [
          { type: 'parking', monthlyRevenue: 50, count: 5 },
          { type: 'laundry', monthlyRevenue: 200 }
        ],
        vacancyRate: 0
      };
      
      const result = MultiDetailedCalculator._calculateDetailedRevenues(revenueData);
      
      expect(result.totalMonthlyUnitRevenue).toBe(800);
      expect(result.totalMonthlyAdditionalRevenue).toBe(450); // 50*5 + 200
      expect(result.totalMonthlyRevenue).toBe(1250); // 800 + 450
      expect(result.totalAnnualRevenue).toBe(15000); // 1250 * 12
    });
    
    test('calcule correctement les moyennes par catégorie de logement', () => {
      const revenueData = {
        units: [
          { type: '3 1/2', monthlyRent: 800, isOccupied: true },
          { type: '3 1/2', monthlyRent: 850, isOccupied: true },
          { type: '4 1/2', monthlyRent: 1000, isOccupied: true },
          { type: '4 1/2', monthlyRent: 1100, isOccupied: false }
        ],
        vacancyRate: 0
      };
      
      const result = MultiDetailedCalculator._calculateDetailedRevenues(revenueData);
      
      expect(result.unitCategories['3 1/2'].count).toBe(2);
      expect(result.unitCategories['3 1/2'].totalRent).toBe(1650);
      expect(result.unitCategories['3 1/2'].averageRent).toBe(825);
      
      expect(result.unitCategories['4 1/2'].count).toBe(2);
      expect(result.unitCategories['4 1/2'].totalRent).toBe(2100);
      expect(result.unitCategories['4 1/2'].averageRent).toBe(1050);
    });
  });

  describe('calculate', () => {
    test('calcule correctement la rentabilité avec des revenus détaillés', () => {
      const propertyData = {
        purchasePrice: 500000,
        renovationCost: 20000,
        revenueDetails: {
          units: [
            { type: '3 1/2', monthlyRent: 800, isOccupied: true },
            { type: '3 1/2', monthlyRent: 800, isOccupied: true },
            { type: '4 1/2', monthlyRent: 1000, isOccupied: true },
            { type: '4 1/2', monthlyRent: 1000, isOccupied: false }
          ],
          additionalRevenues: [
            { type: 'parking', monthlyRevenue: 50, count: 4 },
            { type: 'laundry', monthlyRevenue: 200 }
          ],
          vacancyRate: 5
        },
        financing: {
          firstMortgage: {
            loanToValue: 0.75,
            interestRate: 4.5,
            amortizationYears: 25
          }
        }
      };
      
      const result = MultiDetailedCalculator.calculate(propertyData);
      
      // Vérification des résultats clés
      expect(result.details.totalInvestment).toBe(520000);
      expect(result.details.numberOfUnits).toBe(4);
      
      // Revenus
      expect(result.details.revenueDetails.totalMonthlyRevenue).toBeCloseTo(3870); // 3600*0.95 + 50*4 + 200
      expect(result.details.grossAnnualRent).toBeCloseTo(46440); // 3870 * 12
      
      // Les dépenses sont 45% des revenus pour un immeuble de 4 logements
      expect(result.details.operatingExpenses).toBeCloseTo(20898); // 46440 * 0.45
      expect(result.details.netOperatingIncome).toBeCloseTo(25542); // 46440 - 20898
      
      // Vérification du financement
      expect(result.details.financing.firstMortgageAmount).toBeCloseTo(390000); // 520000 * 0.75
      
      // Vérification du cashflow par porte
      expect(result.details.cashflowPerUnit).toBeGreaterThan(0);
      expect(result.summary.isViable).toBeDefined();
    });
  });
});
