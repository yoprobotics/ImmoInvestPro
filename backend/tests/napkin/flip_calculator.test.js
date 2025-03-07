/**
 * Tests pour le calculateur Napkin FLIP (Méthode FIP10)
 */

const {
  CARRY_COSTS_PERCENTAGE,
  PROFITABILITY_THRESHOLDS,
  calculateFlipNapkin,
  calculateMaxOfferPrice
} = require('../../calculators/napkin/flip_calculator');

describe('Calculateur Napkin FLIP (FIP10)', () => {
  // Cas de base pour un FLIP rentable
  const baseInput = {
    finalPrice: 425000,       // Prix de vente après rénovations
    initialPrice: 359000,     // Prix d'achat
    renovationCost: 10000     // Coût des rénovations
  };

  // Cas d'entrée invalide ou incomplète
  const invalidInputs = [
    { description: 'Input vide', input: null },
    { description: 'Prix final manquant', input: { ...baseInput, finalPrice: null } },
    { description: 'Prix initial manquant', input: { ...baseInput, initialPrice: null } },
    { description: 'Prix final négatif', input: { ...baseInput, finalPrice: -10000 } },
    { description: 'Prix initial négatif', input: { ...baseInput, initialPrice: -10000 } },
    { description: 'Coût des rénovations négatif', input: { ...baseInput, renovationCost: -5000 } },
    { description: 'Prix initial >= Prix final', input: { finalPrice: 300000, initialPrice: 300000, renovationCost: 10000 } }
  ];

  describe('calculateFlipNapkin - calcul de base du profit', () => {
    test('Devrait calculer correctement le profit pour un cas rentable', () => {
      const result = calculateFlipNapkin(baseInput);
      
      // Vérification des coûts de portage (10% du prix final)
      expect(result.carryCosts).toBeCloseTo(42500, 2);  // 10% de 425000
      
      // Vérification du profit
      expect(result.profit).toBeCloseTo(13500, 2);  // 425000 - 359000 - 10000 - 42500
      
      // Vérification du pourcentage de profit
      expect(result.profitPercentage).toBeCloseTo(3.66, 2);  // 13500 / (359000 + 10000) * 100
      
      // Vérification de la viabilité
      expect(result.isViable).toBe(true);
      
      // Vérification de l'évaluation
      expect(result.rating).toBe('ACCEPTABLE');  // Entre 15000 et 25000
    });

    test('Les résultats doivent inclure tous les champs requis', () => {
      const result = calculateFlipNapkin(baseInput);
      
      // Vérification des champs principaux
      expect(result).toHaveProperty('finalPrice');
      expect(result).toHaveProperty('initialPrice');
      expect(result).toHaveProperty('renovationCost');
      expect(result).toHaveProperty('carryCosts');
      expect(result).toHaveProperty('profit');
      expect(result).toHaveProperty('profitPercentage');
      expect(result).toHaveProperty('isViable');
      expect(result).toHaveProperty('rating');
      expect(result).toHaveProperty('recommendation');
    });

    // Test pour les évaluations de profit
    test('Devrait évaluer correctement le projet en fonction du profit', () => {
      // Cas EXCELLENT (>= 40000)
      const excellentCase = { 
        finalPrice: 500000, 
        initialPrice: 350000, 
        renovationCost: 10000 
      };
      const excellentResult = calculateFlipNapkin(excellentCase);
      expect(excellentResult.profit).toBeGreaterThanOrEqual(PROFITABILITY_THRESHOLDS.EXCELLENT);
      expect(excellentResult.rating).toBe('EXCELLENT');
      
      // Cas GOOD (>= 25000 mais < 40000)
      const goodCase = { 
        finalPrice: 475000, 
        initialPrice: 380000, 
        renovationCost: 10000 
      };
      const goodResult = calculateFlipNapkin(goodCase);
      expect(goodResult.profit).toBeGreaterThanOrEqual(PROFITABILITY_THRESHOLDS.TARGET);
      expect(goodResult.profit).toBeLessThan(PROFITABILITY_THRESHOLDS.EXCELLENT);
      expect(goodResult.rating).toBe('GOOD');
      
      // Cas ACCEPTABLE (>= 15000 mais < 25000)
      const acceptableCase = { 
        finalPrice: 450000, 
        initialPrice: 390000, 
        renovationCost: 5000 
      };
      const acceptableResult = calculateFlipNapkin(acceptableCase);
      expect(acceptableResult.profit).toBeGreaterThanOrEqual(PROFITABILITY_THRESHOLDS.MINIMUM);
      expect(acceptableResult.profit).toBeLessThan(PROFITABILITY_THRESHOLDS.TARGET);
      expect(acceptableResult.rating).toBe('ACCEPTABLE');
      
      // Cas POOR (< 15000)
      const poorCase = { 
        finalPrice: 400000, 
        initialPrice: 375000, 
        renovationCost: 10000 
      };
      const poorResult = calculateFlipNapkin(poorCase);
      expect(poorResult.profit).toBeLessThan(PROFITABILITY_THRESHOLDS.MINIMUM);
      expect(poorResult.rating).toBe('POOR');
    });

    test('Devrait rejeter les entrées invalides', () => {
      invalidInputs.forEach(({ description, input }) => {
        expect(() => calculateFlipNapkin(input)).toThrow();
      });
    });
  });

  describe('calculateMaxOfferPrice - calcul du prix d\'offre maximum', () => {
    const maxOfferParams = {
      finalPrice: 425000,       // Prix de vente après rénovations
      renovationCost: 10000,    // Coût des rénovations
      targetProfit: 25000       // Profit visé
    };

    test('Devrait calculer correctement le prix d\'offre maximum', () => {
      const result = calculateMaxOfferPrice(maxOfferParams);
      
      // Vérification des résultats
      expect(result).toHaveProperty('finalPrice');
      expect(result).toHaveProperty('renovationCost');
      expect(result).toHaveProperty('carryCosts');
      expect(result).toHaveProperty('targetProfit');
      expect(result).toHaveProperty('maxOfferPrice');
      
      // Vérification des calculs
      expect(result.carryCosts).toBeCloseTo(42500, 2);  // 10% de 425000
      expect(result.maxOfferPrice).toBeCloseTo(347500, 2);  // 425000 - 10000 - 42500 - 25000
    });

    test('Devrait utiliser le profit cible par défaut si non spécifié', () => {
      const paramsWithoutTarget = {
        finalPrice: 425000,
        renovationCost: 10000
      };
      
      const result = calculateMaxOfferPrice(paramsWithoutTarget);
      expect(result.targetProfit).toBe(PROFITABILITY_THRESHOLDS.TARGET);
    });

    test('Devrait rejeter les cas où le prix d\'offre serait négatif', () => {
      // Cas où le profit visé est trop élevé
      const impossibleCase = {
        finalPrice: 100000,
        renovationCost: 50000,
        targetProfit: 100000
      };
      
      expect(() => calculateMaxOfferPrice(impossibleCase)).toThrow();
    });
  });
});
