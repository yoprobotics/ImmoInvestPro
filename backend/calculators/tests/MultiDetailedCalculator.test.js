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
  
  describe('_calculateDetailedExpenses', () => {
    test('calcule les dépenses avec le ratio par défaut quand aucune dépense détaillée n\'est fournie', () => {
      const propertyInfo = {
        grossAnnualRent: 50000,
        numberOfUnits: 4,
        purchasePrice: 500000
      };
      
      const result = MultiDetailedCalculator._calculateDetailedExpenses({}, propertyInfo);
      
      // Pour 4 unités, le ratio par défaut est de 35%
      expect(result.totalAnnualExpenses).toBe(17500); // 50000 * 0.35
      expect(result.totalMonthlyExpenses).toBe(1458.3333333333333); // 17500 / 12
      expect(result.expenseRatio).toBe(35);
      
      // Vérifie que les catégories de dépenses sont créées
      expect(Object.keys(result.categories).length).toBeGreaterThan(0);
      expect(result.categories.municipalTaxes).toBeDefined();
      expect(result.categories.insurance).toBeDefined();
    });
    
    test('calcule correctement les dépenses détaillées fournies', () => {
      const expenseData = {
        municipalTaxes: 5000,
        schoolTaxes: 1000,
        insurance: 2500,
        electricity: 1800,
        heating: 2400,
        water: 600,
        maintenance: 3000,
        management: 1500,
        janitorial: 1200,
        snowRemoval: 800,
        landscaping: 600,
        legal: 300,
        other: 500
      };
      
      const propertyInfo = {
        grossAnnualRent: 50000,
        numberOfUnits: 4,
        purchasePrice: 500000
      };
      
      const result = MultiDetailedCalculator._calculateDetailedExpenses(expenseData, propertyInfo);
      
      // Le total des dépenses doit correspondre à la somme des dépenses fournies
      const expectedTotal = Object.values(expenseData).reduce((sum, value) => sum + value, 0);
      expect(result.totalAnnualExpenses).toBe(expectedTotal);
      expect(result.totalMonthlyExpenses).toBe(expectedTotal / 12);
      expect(result.expenseRatio).toBe((expectedTotal / propertyInfo.grossAnnualRent) * 100);
      
      // Vérifie que chaque catégorie est correctement incluse
      Object.entries(expenseData).forEach(([category, amount]) => {
        expect(result.categories[category].annualAmount).toBe(amount);
        expect(result.categories[category].monthlyAmount).toBe(amount / 12);
      });
    });
    
    test('crée une répartition par défaut des dépenses basée sur le prix d\'achat quand aucun revenu n\'est disponible', () => {
      const propertyInfo = {
        grossAnnualRent: 0,
        numberOfUnits: 4,
        purchasePrice: 500000
      };
      
      const result = MultiDetailedCalculator._calculateDetailedExpenses({}, propertyInfo);
      
      // Vérifie que les catégories basées sur le prix d'achat sont créées
      expect(result.categories.municipalTaxes.annualAmount).toBe(5000); // 1% du prix d'achat
      expect(result.categories.schoolTaxes.annualAmount).toBe(500); // 0.1% du prix d'achat
      expect(result.categories.insurance.annualAmount).toBe(2500); // 0.5% du prix d'achat
    });
  });

  describe('calculate', () => {
    test('calcule correctement la rentabilité avec des revenus et dépenses détaillés', () => {
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
        expenseDetails: {
          municipalTaxes: 5000,
          schoolTaxes: 1000,
          insurance: 2500,
          electricity: 1800,
          heating: 2400,
          water: 600,
          maintenance: 3000,
          management: 1500
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
      
      // Dépenses
      const expectedExpenses = 17800; // Somme des dépenses détaillées
      expect(result.details.expenseDetails.totalAnnualExpenses).toBe(expectedExpenses);
      expect(result.details.netOperatingIncome).toBeCloseTo(46440 - expectedExpenses);
      
      // Vérification du financement
      expect(result.details.financing.firstMortgageAmount).toBeCloseTo(390000); // 520000 * 0.75
      
      // Vérification du cashflow
      expect(result.details.annualCashflow).toBeDefined();
      expect(result.details.cashflowPerUnit).toBeDefined();
      expect(result.summary.isViable).toBeDefined();
    });
    
    test('calcule correctement la rentabilité sans dépenses détaillées', () => {
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
      
      // Le ratio de dépenses par défaut pour 4 unités est de 35%
      const expectedRevenue = 3600 * 0.95 * 12; // 41040
      const expectedExpenses = expectedRevenue * 0.35; // 14364
      
      expect(result.details.expenseDetails.totalAnnualExpenses).toBeCloseTo(expectedExpenses);
      expect(result.details.expenseDetails.expenseRatio).toBe(35);
      
      // Les catégories de dépenses par défaut devraient être présentes
      expect(Object.keys(result.details.expenseDetails.categories).length).toBeGreaterThan(0);
    });
  });
});
