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
  
  describe('_calculateAcquisitionCosts', () => {
    test('calcule les coûts d\'acquisition par défaut basés sur le prix d\'achat', () => {
      const purchasePrice = 500000;
      
      const result = MultiDetailedCalculator._calculateAcquisitionCosts({}, purchasePrice);
      
      // Vérifie les calculs par défaut
      expect(result.transferTax).toBeGreaterThan(0); // Les droits de mutation sont calculés
      expect(result.legalFees).toBeGreaterThan(0); // Les frais notariés sont estimés
      expect(result.total).toBeGreaterThan(0); // Le total est calculé
    });
    
    test('utilise les coûts d\'acquisition fournis', () => {
      const acquisitionData = {
        transferTax: 7500,
        legalFees: 1800,
        inspectionFees: 650,
        appraisalFees: 950,
        mortgageInsurance: 0,
        mortgageSetupFees: 1500,
        otherFees: 800
      };
      
      const result = MultiDetailedCalculator._calculateAcquisitionCosts(acquisitionData, 500000);
      
      // Vérifie que les valeurs fournies sont utilisées
      expect(result.transferTax).toBe(7500);
      expect(result.legalFees).toBe(1800);
      expect(result.inspectionFees).toBe(650);
      
      // Vérifie que le total est la somme de tous les coûts
      const expectedTotal = Object.values(acquisitionData).reduce((sum, value) => sum + value, 0);
      expect(result.total).toBe(expectedTotal);
    });
    
    test('calcule correctement les droits de mutation (taxe de bienvenue)', () => {
      // Test avec un prix d'achat de 300 000$
      const purchasePrice = 300000;
      const expectedTransferTax = 
        50000 * 0.005 + // 250$ pour la première tranche
        200000 * 0.01 + // 2000$ pour la deuxième tranche
        50000 * 0.015;  // 750$ pour la troisième tranche
                        // Total: 3000$
      
      const transferTax = MultiDetailedCalculator._calculateTransferTax(purchasePrice);
      expect(transferTax).toBeCloseTo(expectedTransferTax);
    });
  });
  
  describe('_calculateDetailedMortgagePayment', () => {
    test('calcule correctement le paiement hypothécaire avec décomposition intérêt/capital', () => {
      const principal = 400000;
      const annualRate = 4.5;
      const years = 25;
      
      const result = MultiDetailedCalculator._calculateDetailedMortgagePayment(principal, annualRate, years, 1);
      
      // Vérification que le paiement total est la somme des paiements d'intérêt et de capital
      expect(result.payment).toBeCloseTo(result.interestPayment + result.principalPayment, 2);
      
      // Vérification du premier paiement d'intérêt (premier mois)
      // Intérêt mensuel = principal * taux mensuel
      const expectedInterest = principal * (annualRate / 100 / 12);
      expect(result.interestPayment).toBeCloseTo(expectedInterest, 2);
      
      // Vérification du paiement mensuel
      // Pour un prêt de 400 000$ à 4.5% sur 25 ans
      const expectedPayment = 2200.71; // Valeur approximative
      expect(result.payment).toBeCloseTo(expectedPayment, 2);
    });
    
    test('gère correctement les cas limites (montant ou durée nulle)', () => {
      // Test avec montant nul
      expect(MultiDetailedCalculator._calculateDetailedMortgagePayment(0, 4.5, 25, 1).payment).toBe(0);
      
      // Test avec durée nulle
      expect(MultiDetailedCalculator._calculateDetailedMortgagePayment(400000, 4.5, 0, 1).payment).toBe(0);
      
      // Test avec taux d'intérêt nul
      const result = MultiDetailedCalculator._calculateDetailedMortgagePayment(400000, 0, 25, 1);
      expect(result.payment).toBe(1333.3333333333333); // 400000 / (25*12)
      expect(result.interestPayment).toBe(0);
      expect(result.principalPayment).toBe(1333.3333333333333);
    });
  });
  
  describe('_calculateDebtServiceRatios', () => {
    test('calcule correctement les ratios d\'endettement ABD et ATD', () => {
      const investorProfile = {
        annualIncome: 120000, // 10 000$ / mois
        otherMonthlyDebt: 500  // Autres dettes mensuelles
      };
      
      const mortgageDetails = {
        totalMonthlyPayment: 2500 // Paiement hypothécaire mensuel
      };
      
      const result = MultiDetailedCalculator._calculateDebtServiceRatios(
        investorProfile, 
        50000, // Revenu net d'exploitation
        mortgageDetails
      );
      
      // ABD = Paiement hypothécaire / Revenu mensuel
      expect(result.abd).toBe((2500 / 10000 * 100).toFixed(2)); // 25%
      
      // ATD = (Paiement hypothécaire + Autres dettes) / Revenu mensuel
      expect(result.atd).toBe(((2500 + 500) / 10000 * 100).toFixed(2)); // 30%
      
      // Vérification que les limites sont respectées
      expect(result.abdExceeded).toBe(false); // 25% < 32%
      expect(result.atdExceeded).toBe(false); // 30% < 40%
    });
    
    test('indique correctement quand les ratios sont dépassés', () => {
      const investorProfile = {
        annualIncome: 84000, // 7 000$ / mois
        otherMonthlyDebt: 1500  // Autres dettes mensuelles
      };
      
      const mortgageDetails = {
        totalMonthlyPayment: 2500 // Paiement hypothécaire mensuel
      };
      
      const result = MultiDetailedCalculator._calculateDebtServiceRatios(
        investorProfile, 
        50000, // Revenu net d'exploitation
        mortgageDetails
      );
      
      // ABD = 2500 / 7000 = 35.71% > 32%
      expect(result.abdExceeded).toBe(true);
      
      // ATD = (2500 + 1500) / 7000 = 57.14% > 40%
      expect(result.atdExceeded).toBe(true);
    });
  });

  describe('_calculateFirstYearAmortization', () => {
    test('génère un tableau d\'amortissement correct pour la première année', () => {
      const mortgageDetails = {
        firstMortgageAmount: 400000,
        firstMortgageMonthlyPayment: 2200.71,
        firstMortgageMonthlyInterest: 1500, // Valeurs approximatives
        firstMortgageMonthlyPrincipal: 700.71
      };
      
      const result = MultiDetailedCalculator._calculateFirstYearAmortization(mortgageDetails);
      
      // Vérification de la structure
      expect(result.firstYear.months.length).toBe(12);
      expect(result.firstYear.totalInterest).toBeGreaterThan(0);
      expect(result.firstYear.totalPrincipal).toBeGreaterThan(0);
      expect(result.firstYear.endingBalance.firstMortgage).toBeDefined();
      
      // Vérification que le solde diminue au fil des mois
      expect(result.firstYear.endingBalance.firstMortgage).toBeLessThan(mortgageDetails.firstMortgageAmount);
    });
  });

  describe('calculate', () => {
    test('calcule correctement la rentabilité avec financement avancé', () => {
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
          heating: 2400
        },
        // Options de financement avancées
        financing: {
          firstMortgage: {
            loanToValue: 0.75,
            interestRate: 4.5,
            amortizationYears: 25,
            term: 5
          },
          sellerFinancing: {
            amount: 50000,
            interestRate: 6.0,
            amortizationYears: 10,
            interestOnly: true
          },
          personalCashAmount: 80000
        },
        // Profil de l'investisseur pour ratios d'endettement
        investorProfile: {
          annualIncome: 120000,
          otherMonthlyDebt: 1500
        }
      };
      
      const result = MultiDetailedCalculator.calculate(propertyData);
      
      // Vérification des résultats clés
      expect(result.details.totalInvestment).toBeGreaterThan(520000); // Prix + Réno + Frais d'acquisition
      
      // Vérification du financement
      expect(result.details.financing.firstMortgageAmount).toBeGreaterThan(0);
      expect(result.details.financing.sellerFinancingAmount).toBe(50000);
      expect(result.details.financing.totalDownPayment).toBeGreaterThan(0);
      
      // Vérification des ratios d'endettement
      expect(result.details.debtServiceRatios.abd).toBeDefined();
      expect(result.details.debtServiceRatios.atd).toBeDefined();
      
      // Vérification de l'amortissement
      expect(result.details.amortizationFirstYear.firstYear.months.length).toBe(12);
      
      // Vérification du cashflow
      expect(result.details.cashflowPerUnit).toBeDefined();
      expect(result.summary.isViable).toBeDefined();
    });
    
    test('gère correctement le financement à intérêt seulement', () => {
      const propertyData = {
        purchasePrice: 500000,
        revenueDetails: {
          units: [
            { type: '3 1/2', monthlyRent: 800, isOccupied: true },
            { type: '3 1/2', monthlyRent: 800, isOccupied: true }
          ],
          vacancyRate: 5
        },
        financing: {
          firstMortgage: {
            loanToValue: 0.75,
            interestRate: 4.5,
            amortizationYears: 25
          },
          privateInvestor: {
            amount: 100000,
            interestRate: 8.0,
            interestOnly: true,
            profitSharing: 25 // 25% du profit
          }
        }
      };
      
      const result = MultiDetailedCalculator.calculate(propertyData);
      
      // Vérification que le prêt de l'investisseur privé est bien configuré
      expect(result.details.financing.privateInvestorAmount).toBe(100000);
      
      // Le paiement mensuel d'un prêt à intérêt seulement est exactement l'intérêt mensuel
      const expectedMonthlyInterest = 100000 * 0.08 / 12; // 666.67$
      expect(result.details.financing.privateInvestorMonthlyPayment).toBeCloseTo(expectedMonthlyInterest);
      
      // Pour un prêt à intérêt seulement, le paiement du capital est nul
      expect(result.details.financing.privateInvestorMonthlyPrincipal).toBe(0);
    });
  });
});
