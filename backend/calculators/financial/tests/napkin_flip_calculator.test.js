/**
 * Tests unitaires pour le calculateur Napkin FLIP
 */

const { 
  calculateNapkinFlip, 
  calculateMaxPurchasePrice, 
  performSensitivityAnalysis,
  PROFITABILITY_THRESHOLDS_FLIP
} = require('../napkin_flip_calculator');

describe('Calculateur Napkin FLIP', () => {
  // Cas de test: projet FLIP avec des paramètres réalistes
  const testInputFlip = {
    finalPrice: 260000,   // Prix de revente après travaux
    initialPrice: 190000, // Prix d'achat
    renovationCost: 30000 // Coût des rénovations
  };

  describe('calculateNapkinFlip', () => {
    test('devrait calculer correctement les résultats pour un projet FLIP', () => {
      const result = calculateNapkinFlip(testInputFlip);
      
      // Vérification des valeurs calculées
      const expectedExpenses = testInputFlip.finalPrice * 0.1; // 10% de frais
      const expectedProfit = testInputFlip.finalPrice - testInputFlip.initialPrice - testInputFlip.renovationCost - expectedExpenses;
      const expectedRoi = (expectedProfit / (testInputFlip.initialPrice + testInputFlip.renovationCost)) * 100;
      
      expect(result.profit).toBeCloseTo(expectedProfit, 0);
      expect(result.roi).toBeCloseTo(expectedRoi, 1);
      expect(result.isViable).toBe(expectedProfit >= PROFITABILITY_THRESHOLDS_FLIP.MINIMUM);
      expect(result.rating).toBeDefined();
      expect(result.recommendation).toBeDefined();
    });

    test('devrait gérer correctement un projet avec perte', () => {
      // Projet avec perte
      const negativeInput = {
        finalPrice: 200000,
        initialPrice: 190000,
        renovationCost: 30000
      };
      
      const result = calculateNapkinFlip(negativeInput);
      
      // Vérifier que le profit est négatif et le projet non viable
      expect(result.profit).toBeLessThan(0);
      expect(result.isViable).toBe(false);
      expect(result.rating).toBe("POOR");
    });

    test('devrait valider les entrées et lancer des erreurs appropriées', () => {
      // Test avec entrées invalides
      expect(() => {
        calculateNapkinFlip(null);
      }).toThrow("Les données d'entrée sont requises");
      
      expect(() => {
        calculateNapkinFlip({ finalPrice: -1, initialPrice: 100000, renovationCost: 20000 });
      }).toThrow("Le prix final (valeur de revente) doit être un nombre positif");
      
      expect(() => {
        calculateNapkinFlip({ finalPrice: 200000, initialPrice: 0, renovationCost: 20000 });
      }).toThrow("Le prix initial (prix d'achat) doit être un nombre positif");
    });
  });

  describe('calculateMaxPurchasePrice', () => {
    test('devrait calculer correctement le prix d'achat maximum pour un profit cible', () => {
      const params = {
        finalPrice: 260000,
        renovationCost: 30000,
        targetProfit: 25000
      };
      
      const result = calculateMaxPurchasePrice(params);
      
      // Vérifier que le résultat est cohérent
      const expectedExpenses = params.finalPrice * 0.1;
      const expectedMaxPrice = params.finalPrice - params.renovationCost - expectedExpenses - params.targetProfit;
      
      expect(result.maxPurchasePrice).toBeCloseTo(expectedMaxPrice, 0);
      expect(result.targetProfit).toBe(params.targetProfit);
    });

    test('devrait utiliser le profit cible par défaut si non spécifié', () => {
      const params = {
        finalPrice: 260000,
        renovationCost: 30000
      };
      
      const result = calculateMaxPurchasePrice(params);
      
      expect(result.targetProfit).toBe(PROFITABILITY_THRESHOLDS_FLIP.TARGET);
    });

    test('devrait lancer une erreur si le profit cible est impossible à atteindre', () => {
      const params = {
        finalPrice: 100000,
        renovationCost: 70000,
        targetProfit: 40000
      };
      
      expect(() => {
        calculateMaxPurchasePrice(params);
      }).toThrow("Impossible d'atteindre le profit cible");
    });
  });

  describe('performSensitivityAnalysis', () => {
    test('devrait générer différents scénarios d\'analyse de sensibilité', () => {
      const scenarios = {
        initialPrice: [-10, 0, 10],
        finalPrice: [-10, 0, 10],
        renovationCost: [-20, 0, 20]
      };
      
      const results = performSensitivityAnalysis(testInputFlip, scenarios);
      
      // Vérifier que l'analyse contient le cas de base et des scénarios
      expect(results.baseCase).toBeDefined();
      expect(results.scenarios.length).toBe(6);  // 3 variations par paramètre - 1 cas de base déjà compté = 6
      
      // Vérifier que les scénarios sont triés par profit descendant
      const profits = results.scenarios.map(s => s.result.profit);
      const sortedProfits = [...profits].sort((a, b) => b - a);
      expect(profits).toEqual(sortedProfits);
    });
  });

  describe('Cas d\'utilisation réels', () => {
    test('Scénario maison à rénover à Montréal', () => {
      const input = {
        finalPrice: 450000,   // Prix de revente après rénovations
        initialPrice: 320000, // Prix d'achat
        renovationCost: 60000 // Coût des rénovations
      };
      
      const result = calculateNapkinFlip(input);
      
      // Vérifier que c'est un investissement viable
      expect(result.isViable).toBe(true);
      expect(result.profit).toBeGreaterThanOrEqual(PROFITABILITY_THRESHOLDS_FLIP.MINIMUM);
      
      // Calculer le prix maximum pour un profit cible de 25000$
      const maxPriceParams = {
        finalPrice: input.finalPrice,
        renovationCost: input.renovationCost,
        targetProfit: 25000
      };
      
      const maxPriceResult = calculateMaxPurchasePrice(maxPriceParams);
      expect(maxPriceResult.maxPurchasePrice).toBeGreaterThan(0);
    });

    test('Scénario maison à rénover à Québec', () => {
      const input = {
        finalPrice: 350000,   // Prix de revente après rénovations
        initialPrice: 250000, // Prix d'achat
        renovationCost: 45000 // Coût des rénovations
      };
      
      const result = calculateNapkinFlip(input);
      
      // Vérifier les résultats
      expect(result.isViable).toBe(true);
      expect(result.profit).toBeGreaterThan(0);
      
      // Analyser la sensibilité
      const sensitivityResults = performSensitivityAnalysis(input);
      expect(sensitivityResults.scenarios.length).toBeGreaterThan(0);
    });
  });
});
