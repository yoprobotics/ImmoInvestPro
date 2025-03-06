/**
 * Tests unitaires pour le service LiquidityCalculator
 */

const LiquidityCalculator = require('../../services/calculators/LiquidityCalculator');

describe('LiquidityCalculator', () => {
  
  // Test de l'initialisation du calculateur
  describe('constructor', () => {
    test('devrait initialiser avec les paramètres fournis', () => {
      const options = {
        purchasePrice: 500000,
        downPayment: 100000,
        grossRevenue: 60000,
        expenses: 30000,
        interestRate: 3.5,
        amortizationYears: 25,
        otherFinancing: [
          { type: 'Balance vendeur', amount: 50000, interestRate: 5, termYears: 5, includeInInvestment: false }
        ]
      };
      
      const calculator = new LiquidityCalculator(options);
      
      expect(calculator.purchasePrice).toBe(options.purchasePrice);
      expect(calculator.downPayment).toBe(options.downPayment);
      expect(calculator.grossRevenue).toBe(options.grossRevenue);
      expect(calculator.expenses).toBe(options.expenses);
      expect(calculator.interestRate).toBe(options.interestRate);
      expect(calculator.amortizationYears).toBe(options.amortizationYears);
      expect(calculator.otherFinancing).toEqual(options.otherFinancing);
    });
    
    test('devrait initialiser avec des valeurs par défaut', () => {
      const calculator = new LiquidityCalculator({});
      
      expect(calculator.purchasePrice).toBe(0);
      expect(calculator.downPayment).toBe(0);
      expect(calculator.grossRevenue).toBe(0);
      expect(calculator.expenses).toBe(0);
      expect(calculator.interestRate).toBe(0);
      expect(calculator.amortizationYears).toBe(25);
      expect(calculator.otherFinancing).toEqual([]);
    });
    
    test('devrait calculer la mise de fonds à partir du pourcentage', () => {
      const calculator = new LiquidityCalculator({
        purchasePrice: 500000,
        downPaymentPercentage: 20,
        grossRevenue: 60000,
        expenses: 30000,
        interestRate: 3.5
      });
      
      expect(calculator.downPayment).toBe(100000); // 20% de 500000
    });
    
    test('devrait calculer les dépenses à partir du pourcentage des revenus', () => {
      const calculator = new LiquidityCalculator({
        purchasePrice: 500000,
        downPayment: 100000,
        grossRevenue: 60000,
        expenses: 50, // 50% des revenus
        expensesAsPercentage: true,
        interestRate: 3.5
      });
      
      expect(calculator.expenses).toBe(30000); // 50% de 60000
    });
  });
  
  // Test du calcul du montant de l'hypothèque
  describe('calculateMortgageAmount', () => {
    test('devrait calculer correctement le montant de l\'hypothèque principale', () => {
      const calculator = new LiquidityCalculator({
        purchasePrice: 500000,
        downPayment: 100000,
        otherFinancing: [
          { type: 'Balance vendeur', amount: 50000 }
        ]
      });
      
      const mortgageAmount = calculator.calculateMortgageAmount();
      expect(mortgageAmount).toBe(350000); // 500000 - 100000 - 50000
    });
    
    test('devrait retourner 0 si le prix d\'achat est 0', () => {
      const calculator = new LiquidityCalculator({
        purchasePrice: 0,
        downPayment: 100000
      });
      
      const mortgageAmount = calculator.calculateMortgageAmount();
      expect(mortgageAmount).toBe(0);
    });
  });
  
  // Test du calcul des paiements mensuels
  describe('calculateMonthlyPayment', () => {
    test('devrait calculer correctement le paiement mensuel d\'un prêt', () => {
      const calculator = new LiquidityCalculator({});
      
      const payment = calculator.calculateMonthlyPayment(350000, 3.5, 25);
      // Calcul attendu: 350000 * (0.035/12 * (1 + 0.035/12)^300) / ((1 + 0.035/12)^300 - 1)
      // Approximativement 1752.73
      expect(payment).toBeCloseTo(1752.73, 1);
    });
    
    test('devrait retourner 0 si le capital ou le taux est 0', () => {
      const calculator = new LiquidityCalculator({});
      
      expect(calculator.calculateMonthlyPayment(0, 3.5, 25)).toBe(0);
      expect(calculator.calculateMonthlyPayment(350000, 0, 25)).toBe(0);
    });
  });
  
  // Test du calcul des paiements de financement
  describe('calculateMonthlyPayments', () => {
    test('devrait calculer correctement les paiements pour tous les financements', () => {
      const calculator = new LiquidityCalculator({
        purchasePrice: 500000,
        downPayment: 100000,
        interestRate: 3.5,
        amortizationYears: 25,
        otherFinancing: [
          { type: 'Balance vendeur', amount: 50000, interestRate: 5, termYears: 5 }
        ]
      });
      
      const payments = calculator.calculateMonthlyPayments();
      
      // Vérification des montants
      expect(payments.mainMortgage.amount).toBe(350000);
      expect(payments.mainMortgage.payment).toBeCloseTo(1752.73, 1);
      
      // Vérification des autres financements
      expect(payments.otherFinancing[0].amount).toBe(50000);
      expect(payments.otherFinancing[0].payment).toBeCloseTo(943.56, 1);
      
      // Vérification du total
      expect(payments.totalMonthlyPayment).toBeCloseTo(2696.29, 1);
      expect(payments.totalAnnualPayment).toBeCloseTo(32355.48, 1);
    });
  });
  
  // Test du calcul de la liquidité
  describe('calculateLiquidity', () => {
    test('devrait calculer correctement la liquidité d\'un investissement', () => {
      const calculator = new LiquidityCalculator({
        purchasePrice: 500000,
        downPayment: 100000,
        grossRevenue: 60000,
        expenses: 30000,
        interestRate: 3.5,
        amortizationYears: 25,
        otherFinancing: [
          { type: 'Balance vendeur', amount: 50000, interestRate: 5, termYears: 5, includeInInvestment: false }
        ]
      });
      
      const result = calculator.calculateLiquidity();
      
      // Vérification des revenus et dépenses
      expect(result.grossRevenue).toBe(60000);
      expect(result.expenses).toBe(30000);
      expect(result.netOperatingIncome).toBe(30000);
      
      // Vérification des financements
      expect(result.mortgageAmount).toBe(350000);
      expect(result.annualFinancingPayment).toBeCloseTo(32355.48, 1);
      
      // Vérification du cashflow
      expect(result.annualCashflow).toBeCloseTo(-2355.48, 1);
      expect(result.monthlyCashflow).toBeCloseTo(-196.29, 1);
      
      // Vérification du ROI
      expect(result.investment).toBe(100000); // La balance vendeur n'est pas incluse
      expect(result.roi).toBeCloseTo(-2.36, 1); // ROI négatif
    });
  });
  
  // Test du calcul du prix d'achat maximum
  describe('calculateMaxPurchasePrice', () => {
    test('devrait calculer correctement le prix d\'achat maximum pour un cashflow cible', () => {
      const calculator = new LiquidityCalculator({
        downPaymentPercentage: 20,
        grossRevenue: 60000,
        expenses: 30000,
        interestRate: 3.5,
        amortizationYears: 25
      });
      
      // Calculer le prix d'achat maximum pour un cashflow annuel de 5000$
      const maxPrice = calculator.calculateMaxPurchasePrice(5000);
      
      // Vérification du prix d'achat maximum
      // Avec un RNO de 30000$ et un cashflow cible de 5000$, le maximum pour le paiement annuel est de 25000$
      // En utilisant la formule inverse du calculateur PMT, on peut trouver un montant de prêt d'environ 399000$
      // Avec une mise de fonds de 20%, le prix d'achat maximum est d'environ 499000$
      expect(maxPrice).toBeCloseTo(499000, -3); // Précision à +/- 1000$ près
    });
    
    test('devrait retourner 0 si le paiement mensuel maximum est négatif ou nul', () => {
      const calculator = new LiquidityCalculator({
        downPaymentPercentage: 20,
        grossRevenue: 30000,
        expenses: 30000, // RNO = 0
        interestRate: 3.5,
        amortizationYears: 25
      });
      
      // Avec un RNO de 0 et un cashflow cible positif, le prix d'achat maximum devrait être 0
      const maxPrice = calculator.calculateMaxPurchasePrice(5000);
      expect(maxPrice).toBe(0);
    });
  });
  
  // Test de l'analyse de sensibilité
  describe('performSensitivityAnalysis', () => {
    test('devrait effectuer une analyse de sensibilité sur les paramètres spécifiés', () => {
      const calculator = new LiquidityCalculator({
        purchasePrice: 500000,
        downPayment: 100000,
        grossRevenue: 60000,
        expenses: 30000,
        interestRate: 3.5,
        amortizationYears: 25
      });
      
      // Analyse de sensibilité sur le taux d'intérêt et les revenus bruts
      const analysis = calculator.performSensitivityAnalysis(
        ['interestRate', 'grossRevenue'],
        10, // 10% de variation
        2   // 2 étapes de part et d'autre
      );
      
      // Vérification des paramètres analysés
      expect(analysis.parametersAnalyzed).toEqual(['interestRate', 'grossRevenue']);
      expect(analysis.variationPercentage).toBe(10);
      expect(analysis.steps).toBe(2);
      
      // Vérification des résultats pour le taux d'intérêt
      expect(analysis.results.interestRate.originalValue).toBe(3.5);
      expect(analysis.results.interestRate.variations.length).toBe(5); // -10%, -5%, 0%, +5%, +10%
      
      // Vérification des résultats pour les revenus bruts
      expect(analysis.results.grossRevenue.originalValue).toBe(60000);
      expect(analysis.results.grossRevenue.variations.length).toBe(5); // -10%, -5%, 0%, +5%, +10%
    });
  });
});
