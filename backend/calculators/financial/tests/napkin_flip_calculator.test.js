/**
 * Tests unitaires pour le calculateur Napkin FLIP
 */

const { 
  calculateNapkinFlip, 
  calculateOptimalOffer,
  PROFIT_THRESHOLDS
} = require('../napkin_flip_calculator');

describe('Calculateur Napkin FLIP', () => {
  // Cas de test: projet de FLIP avec des paramètres réalistes
  const testInputFlip = {
    finalPrice: 350000,     // Prix de vente estimé après travaux
    initialPrice: 250000,   // Prix d'achat initial
    renovationCost: 50000   // Coût estimé des rénovations
  };

  describe('calculateNapkinFlip', () => {
    test('devrait calculer correctement les résultats pour un projet de FLIP', () => {
      const result = calculateNapkinFlip(testInputFlip);
      
      // Vérification des valeurs calculées
      expect(result.estimatedProfit).toBe(15000);  // 350000 - 250000 - 50000 - 35000 = 15000
      expect(result.overheadAmount).toBe(35000);   // 10% de 350000
      expect(result.totalInvestment).toBe(300000); // 250000 + 50000
      expect(result.profitPercentage).toBeCloseTo(5, 0);
      expect(result.isViable).toBe(true);          // Profit >= seuil minimum
      expect(result.rating).toBe("ACCEPTABLE");     // Entre minimum et cible
    });

    test('devrait gérer correctement un profit négatif', () => {
      // Cloner l'entrée de test et augmenter le prix initial
      const negativeInput = JSON.parse(JSON.stringify(testInputFlip));
      negativeInput.initialPrice = 320000;  // Augmenter considérablement le prix initial
      
      const result = calculateNapkinFlip(negativeInput);
      
      // Vérifier que le profit est négatif et le projet non viable
      expect(result.estimatedProfit).toBeLessThan(0);
      expect(result.isViable).toBe(false);
      expect(result.rating).toBe("POOR");
    });

    test('devrait valider les entrées et lancer des erreurs appropriées', () => {
      // Test avec entrées invalides
      expect(() => {
        calculateNapkinFlip(null);
      }).toThrow("Les données d'entrée sont requises");
      
      expect(() => {
        calculateNapkinFlip({ finalPrice: -1, initialPrice: 100000, renovationCost: 50000 });
      }).toThrow("Le prix final doit être un nombre positif");
      
      expect(() => {
        calculateNapkinFlip({ finalPrice: 350000, initialPrice: 0, renovationCost: 50000 });
      }).toThrow("Le prix initial doit être un nombre positif");
      
      expect(() => {
        calculateNapkinFlip({ finalPrice: 350000, initialPrice: 250000 });
      }).toThrow("Le coût des rénovations est requis");
    });

    test('devrait permettre de spécifier un pourcentage de frais généraux différent', () => {
      const customOverheadInput = {
        finalPrice: 350000,
        initialPrice: 250000,
        renovationCost: 50000,
        overheadPercentage: 15  // Frais généraux de 15% au lieu de 10%
      };
      
      const result = calculateNapkinFlip(customOverheadInput);
      
      // Vérifier que les frais généraux sont bien calculés avec 15%
      expect(result.overheadAmount).toBe(52500);  // 15% de 350000
      expect(result.estimatedProfit).toBe(-2500); // 350000 - 250000 - 50000 - 52500 = -2500
    });
  });

  describe('calculateOptimalOffer', () => {
    test('devrait calculer correctement le prix d'offre optimal pour un profit cible', () => {
      const params = {
        finalPrice: 350000,
        renovationCost: 50000,
        targetProfit: 25000  // Profit cible de 25 000$
      };
      
      const result = calculateOptimalOffer(params);
      
      // Vérifier que le résultat est cohérent
      const expectedOffer = 350000 - 50000 - 35000 - 25000; // 240000
      expect(result.optimalOffer).toBe(expectedOffer);
      expect(result.calculatedProfit).toBe(25000);  // Doit correspondre au profit cible
      expect(result.isPossible).toBe(true);         // Offre positive, donc possible
    });

    test('devrait indiquer quand une offre n'est pas possible', () => {
      const params = {
        finalPrice: 200000,
        renovationCost: 180000,
        targetProfit: 40000  // Profit cible très élevé par rapport aux autres valeurs
      };
      
      const result = calculateOptimalOffer(params);
      
      // L'offre doit être négative, donc impossible
      expect(result.optimalOffer).toBeLessThan(0);
      expect(result.isPossible).toBe(false);
    });
  });

  describe('Cas d\'utilisation réels', () => {
    test('Scénario de FLIP pour une maison à Montréal', () => {
      const input = {
        finalPrice: 550000,     // Prix de vente estimé après travaux
        initialPrice: 400000,   // Prix d'achat initial
        renovationCost: 75000   // Coût estimé des rénovations
      };
      
      const result = calculateNapkinFlip(input);
      
      // Vérifier que le projet est viable pour Montréal
      expect(result.isViable).toBe(true);
      expect(result.estimatedProfit).toBeGreaterThanOrEqual(PROFIT_THRESHOLDS.MINIMUM);
      
      // Calculer l'offre optimale pour un profit cible de 35 000$
      const optimalOfferParams = {
        finalPrice: input.finalPrice,
        renovationCost: input.renovationCost,
        targetProfit: 35000
      };
      
      const optimalOfferResult = calculateOptimalOffer(optimalOfferParams);
      expect(optimalOfferResult.isPossible).toBe(true);
    });

    test('Scénario de FLIP pour une maison avec rénovations importantes', () => {
      const input = {
        finalPrice: 450000,     // Prix de vente estimé après travaux
        initialPrice: 280000,   // Prix d'achat initial
        renovationCost: 120000  // Coût élevé des rénovations
      };
      
      const result = calculateNapkinFlip(input);
      
      // Vérifier les résultats avec des rénovations importantes
      expect(result.totalInvestment).toBe(400000); // 280000 + 120000
      expect(result.overheadAmount).toBe(45000);   // 10% de 450000
    });
  });
});
