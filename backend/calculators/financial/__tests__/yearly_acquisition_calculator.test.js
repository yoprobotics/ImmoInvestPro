/**
 * Tests pour le calculateur "Un immeuble par AN"
 */

const yearlyAcquisitionCalculator = require('../yearly_acquisition_calculator');

describe('Calculateur Un immeuble par AN', () => {
  describe('calculateRequiredUnits', () => {
    it('devrait calculer correctement le nombre de portes requises', () => {
      const result = yearlyAcquisitionCalculator.calculateRequiredUnits({
        targetMonthlyIncome: 5000,
        cashflowPerDoor: 75
      });
      
      expect(result.requiredUnits).toBe(67); // 5000 / 75 = 66.67, arrondi à 67
      expect(result.estimatedAchievementTime).toBeDefined();
    });
    
    it('devrait lever une erreur si les paramètres sont invalides', () => {
      expect(() => {
        yearlyAcquisitionCalculator.calculateRequiredUnits({
          targetMonthlyIncome: -1000,
          cashflowPerDoor: 75
        });
      }).toThrow();
      
      expect(() => {
        yearlyAcquisitionCalculator.calculateRequiredUnits({
          targetMonthlyIncome: 5000,
          cashflowPerDoor: 0
        });
      }).toThrow();
    });
  });
  
  describe('generateAcquisitionModel', () => {
    it('devrait générer un modèle d\'acquisition valide', () => {
      const result = yearlyAcquisitionCalculator.generateAcquisitionModel({
        targetMonthlyIncome: 5000,
        cashflowPerDoor: 75,
        initialUnitCount: 4,
        unitCountIncrement: 1,
        initialPurchasePrice: 400000,
        downPaymentPercentage: 0.2,
        appreciationRate: 0.03,
        numberOfYears: 5
      });
      
      expect(result.numberOfYears).toBe(5);
      expect(result.targetMonthlyIncome).toBe(5000);
      expect(result.properties.length).toBe(5);
      expect(result.properties[0].unitCount).toBe(4);
      expect(result.properties[1].unitCount).toBe(5);
      expect(result.properties[4].unitCount).toBe(8);
    });
    
    it('devrait lever une erreur si les paramètres sont invalides', () => {
      expect(() => {
        yearlyAcquisitionCalculator.generateAcquisitionModel({
          targetMonthlyIncome: 0,
          cashflowPerDoor: 75
        });
      }).toThrow();
      
      expect(() => {
        yearlyAcquisitionCalculator.generateAcquisitionModel({
          targetMonthlyIncome: 5000,
          cashflowPerDoor: -10
        });
      }).toThrow();
    });
  });
  
  describe('calculateYearlyAcquisitionStrategy', () => {
    it('devrait calculer correctement la projection sur plusieurs années', () => {
      const input = {
        numberOfYears: 5,
        targetMonthlyIncome: 5000,
        properties: [
          {
            purchasePrice: 400000,
            unitCount: 4,
            cashflowPerDoor: 75,
            downPaymentPercentage: 0.2,
            appreciationRate: 0.03
          },
          {
            purchasePrice: 500000,
            unitCount: 5,
            cashflowPerDoor: 75,
            downPaymentPercentage: 0.2,
            appreciationRate: 0.03
          },
          {
            purchasePrice: 600000,
            unitCount: 6,
            cashflowPerDoor: 75,
            downPaymentPercentage: 0.2,
            appreciationRate: 0.03
          },
          {
            purchasePrice: 700000,
            unitCount: 7,
            cashflowPerDoor: 75,
            downPaymentPercentage: 0.2,
            appreciationRate: 0.03
          },
          {
            purchasePrice: 800000,
            unitCount: 8,
            cashflowPerDoor: 75,
            downPaymentPercentage: 0.2,
            appreciationRate: 0.03
          }
        ]
      };
      
      const result = yearlyAcquisitionCalculator.calculateYearlyAcquisitionStrategy(input);
      
      // Vérifier la structure des résultats
      expect(result.yearlySnapshots).toHaveLength(5);
      expect(result.summary).toBeDefined();
      
      // Vérifier les résultats du premier immeuble
      const firstYear = result.yearlySnapshots[0];
      expect(firstYear.year).toBe(1);
      expect(firstYear.newUnitCount).toBe(4);
      expect(firstYear.totalUnitCount).toBe(4);
      expect(firstYear.newPropertyValue).toBe(400000);
      expect(firstYear.monthlyCashflow).toBe(300); // 4 * 75
      
      // Vérifier les résultats cumulatifs de la dernière année
      const lastYear = result.yearlySnapshots[4];
      expect(lastYear.year).toBe(5);
      expect(lastYear.newUnitCount).toBe(8);
      expect(lastYear.totalUnitCount).toBe(30); // 4 + 5 + 6 + 7 + 8
      expect(lastYear.monthlyCashflow).toBe(2250); // 30 * 75
      
      // Vérifier les statistiques sommaires
      expect(result.summary.finalMonthlyCashflow).toBe(2250);
      expect(result.summary.totalInvestedCapital).toBe(600000); // 20% de 3M
      expect(result.summary.yearsToTarget).toBeNull(); // Pas encore atteint l'objectif de 5000$
      expect(result.summary.targetAchieved).toBe(false);
    });
    
    it('devrait identifier correctement quand l\'objectif de revenu est atteint', () => {
      const input = {
        numberOfYears: 10,
        targetMonthlyIncome: 2000,
        properties: Array(10).fill(0).map((_, i) => ({
          purchasePrice: 400000,
          unitCount: 4,
          cashflowPerDoor: 75,
          downPaymentPercentage: 0.2,
          appreciationRate: 0.03
        }))
      };
      
      const result = yearlyAcquisitionCalculator.calculateYearlyAcquisitionStrategy(input);
      
      // Après 7 ans, on devrait avoir 28 portes (7 * 4) générant 2100$ (28 * 75$)
      expect(result.summary.yearsToTarget).toBe(7);
      expect(result.summary.targetAchieved).toBe(true);
    });
    
    it('devrait lever une erreur si les entrées sont invalides', () => {
      expect(() => {
        yearlyAcquisitionCalculator.calculateYearlyAcquisitionStrategy({
          numberOfYears: 0,
          targetMonthlyIncome: 5000,
          properties: []
        });
      }).toThrow();
      
      expect(() => {
        yearlyAcquisitionCalculator.calculateYearlyAcquisitionStrategy({
          numberOfYears: 5,
          targetMonthlyIncome: 5000,
          properties: []
        });
      }).toThrow();
    });
  });
});
