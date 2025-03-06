/**
 * Tests pour le calculateur de liquidité
 */

const {
  PROFITABILITY_THRESHOLDS,
  calculateLiquidity,
  calculateMaxPurchasePrice,
  performSensitivityAnalysis
} = require('../../calculators/financial/liquidity_calculator');

describe('Calculateur de liquidité', () => {
  // Cas de base pour un immeuble à revenus rentable
  const baseInput = {
    units: 4,
    revenues: {
      baseRent: 48000,      // 4000$ / mois
      parking: 2400,        // 200$ / mois
      storage: 1200,        // 100$ / mois
      laundry: 960,         // 80$ / mois
      other: 0
    },
    expenses: {
      municipalTax: 6500,
      schoolTax: 1200,
      insurance: 2400,
      electricity: 1800,
      heating: 0,           // Chauffage électrique inclus dans électricité
      maintenance: 3600,    // 300$ / mois
      management: 2600,     // ~5% des revenus
      snowRemoval: 1200,
      landscaping: 800,
      vacancy: 3,           // 3% provision pour vacance
      badDebt: 1,           // 1% provision pour mauvaises créances
      other: 500
    },
    financing: {
      purchasePrice: 520000,
      downPayment: 104000,   // 20% de mise de fonds
      firstMortgageAmount: 416000,
      firstMortgageRate: 4.5,
      firstMortgageAmortization: 25,
      secondMortgageAmount: 0,
      secondMortgageRate: 0,
      secondMortgageAmortization: 0
    }
  };

  // Cas d'entrée invalide ou incomplète
  const invalidInputs = [
    { description: 'Input vide', input: null },
    { description: 'Unités manquantes', input: { ...baseInput, units: null } },
    { description: 'Unités négatives', input: { ...baseInput, units: -1 } },
    { description: 'Unités non entières', input: { ...baseInput, units: 2.5 } },
    { description: 'Revenus manquants', input: { ...baseInput, revenues: null } },
    { description: 'Loyer de base manquant', input: { ...baseInput, revenues: { ...baseInput.revenues, baseRent: null } } },
    { description: 'Dépenses manquantes', input: { ...baseInput, expenses: null } },
    { description: 'Financement manquant', input: { ...baseInput, financing: null } },
    { description: 'Prix d\'achat manquant', input: { ...baseInput, financing: { ...baseInput.financing, purchasePrice: null } } },
    {
      description: 'Financement incohérent',
      input: {
        ...baseInput,
        financing: {
          ...baseInput.financing,
          downPayment: 100000,
          firstMortgageAmount: 400000  // N'égale pas 520000 - 100000
        }
      }
    }
  ];

  describe('calculateLiquidity - calcul de base de la liquidité', () => {
    test('Devrait calculer correctement la liquidité pour un cas rentable', () => {
      const result = calculateLiquidity(baseInput);
      
      // Vérification des calculs de revenus
      expect(result.grossRevenue).toBeCloseTo(52560, 2);  // 48000 + 2400 + 1200 + 960
      
      // Vérification des calculs de dépenses
      expect(result.totalExpenses).toBeCloseTo(23177, 2);  // Somme des dépenses + provisions
      
      // Vérification du revenu net d'exploitation
      expect(result.netOperatingIncome).toBeCloseTo(29383, 2);  // 52560 - 23177
      
      // Vérification du paiement hypothécaire
      expect(result.totalMortgagePayment).toBeCloseTo(22894, 2);  // Calculé avec la formule de prêt
      
      // Vérification du cashflow
      expect(result.cashflow).toBeCloseTo(6489, 2);  // 29383 - 22894
      
      // Vérification du cashflow par porte par mois
      expect(result.cashflowPerUnit).toBeCloseTo(135.19, 2);  // 6489 / 4 / 12
      
      // Vérification du taux de capitalisation
      expect(result.capRate).toBeCloseTo(5.65, 2);  // 29383 / 520000 * 100
      
      // Vérification du rendement sur mise de fonds
      expect(result.cashOnCash).toBeCloseTo(6.24, 2);  // 6489 / 104000 * 100
      
      // Vérification de la viabilité
      expect(result.isViable).toBe(true);
      
      // Vérification de l'évaluation
      expect(result.rating).toBe('EXCELLENT');
    });

    test('Les résultats doivent inclure tous les champs requis', () => {
      const result = calculateLiquidity(baseInput);
      
      // Vérification des champs principaux
      expect(result).toHaveProperty('grossRevenue');
      expect(result).toHaveProperty('totalExpenses');
      expect(result).toHaveProperty('netOperatingIncome');
      expect(result).toHaveProperty('totalMortgagePayment');
      expect(result).toHaveProperty('cashflow');
      expect(result).toHaveProperty('cashflowPerUnit');
      expect(result).toHaveProperty('capRate');
      expect(result).toHaveProperty('cashOnCash');
      expect(result).toHaveProperty('isViable');
      expect(result).toHaveProperty('rating');
      expect(result).toHaveProperty('recommendation');
      
      // Vérification des détails
      expect(result).toHaveProperty('breakdown');
      expect(result.breakdown).toHaveProperty('revenues');
      expect(result.breakdown).toHaveProperty('expenses');
      expect(result.breakdown).toHaveProperty('financing');
      
      // Vérification des optimisations
      expect(result).toHaveProperty('optimizations');
    });

    // Test pour les évaluations de cashflow
    test('Devrait évaluer correctement le projet en fonction du cashflow par porte', () => {
      // Cas EXCELLENT (>= 100)
      const excellentCase = { ...baseInput };
      const excellentResult = calculateLiquidity(excellentCase);
      expect(excellentResult.cashflowPerUnit).toBeGreaterThanOrEqual(PROFITABILITY_THRESHOLDS.EXCELLENT);
      expect(excellentResult.rating).toBe('EXCELLENT');
      
      // Cas GOOD (>= 75 mais < 100)
      const goodCase = {
        ...baseInput,
        revenues: {
          ...baseInput.revenues,
          baseRent: 43200  // Réduction des revenus pour un cashflow moins élevé
        }
      };
      const goodResult = calculateLiquidity(goodCase);
      expect(goodResult.cashflowPerUnit).toBeGreaterThanOrEqual(PROFITABILITY_THRESHOLDS.TARGET);
      expect(goodResult.cashflowPerUnit).toBeLessThan(PROFITABILITY_THRESHOLDS.EXCELLENT);
      expect(goodResult.rating).toBe('GOOD');
      
      // Cas ACCEPTABLE (>= 50 mais < 75)
      const acceptableCase = {
        ...baseInput,
        revenues: {
          ...baseInput.revenues,
          baseRent: 40800  // Réduction encore plus des revenus
        }
      };
      const acceptableResult = calculateLiquidity(acceptableCase);
      expect(acceptableResult.cashflowPerUnit).toBeGreaterThanOrEqual(PROFITABILITY_THRESHOLDS.MINIMUM);
      expect(acceptableResult.cashflowPerUnit).toBeLessThan(PROFITABILITY_THRESHOLDS.TARGET);
      expect(acceptableResult.rating).toBe('ACCEPTABLE');
      
      // Cas POOR (< 50)
      const poorCase = {
        ...baseInput,
        revenues: {
          ...baseInput.revenues,
          baseRent: 38400  // Revenus trop faibles
        }
      };
      const poorResult = calculateLiquidity(poorCase);
      expect(poorResult.cashflowPerUnit).toBeLessThan(PROFITABILITY_THRESHOLDS.MINIMUM);
      expect(poorResult.rating).toBe('POOR');
    });

    test('Devrait rejeter les entrées invalides', () => {
      invalidInputs.forEach(({ description, input }) => {
        expect(() => calculateLiquidity(input)).toThrow();
      });
    });
  });

  describe('calculateMaxPurchasePrice - calcul du prix d\'achat maximum', () => {
    const maxPriceParams = {
      units: 4,
      revenues: {
        baseRent: 48000,
        parking: 2400,
        storage: 1200,
        laundry: 960
      },
      expenses: {
        municipalTax: 6500,
        schoolTax: 1200,
        insurance: 2400,
        electricity: 1800,
        maintenance: 3600,
        management: 2600,
        snowRemoval: 1200,
        landscaping: 800,
        vacancy: 3,
        badDebt: K1
      },
      mortgageTerms: {
        downPaymentRatio: 20,   // 20%
        interestRate: 4.5,      // 4.5%
        amortizationYears: 25   // 25 ans
      },
      targetCashflowPerUnit: 75  // 75$ par porte par mois
    };

    test('Devrait calculer correctement le prix d\'achat maximum', () => {
      const result = calculateMaxPurchasePrice(maxPriceParams);
      
      // Vérification des résultats
      expect(result).toHaveProperty('maxPurchasePrice');
      expect(result).toHaveProperty('downPayment');
      expect(result).toHaveProperty('mortgageAmount');
      expect(result).toHaveProperty('annualMortgagePayment');
      expect(result).toHaveProperty('netOperatingIncome');
      expect(result).toHaveProperty('cashflow');
      expect(result).toHaveProperty('cashflowPerUnit');
      
      // Le cashflow par porte devrait correspondre à la cible
      expect(result.cashflowPerUnit).toBeCloseTo(maxPriceParams.targetCashflowPerUnit, 2);
      
      // La mise de fonds devrait être cohérente avec le ratio spécifié
      expect(result.downPayment).toBeCloseTo(result.maxPurchasePrice * (maxPriceParams.mortgageTerms.downPaymentRatio / 100), 2);
      
      // Le montant de l'hypothèque devrait être cohérent
      expect(result.mortgageAmount).toBeCloseTo(result.maxPurchasePrice - result.downPayment, 2);
    });

    test('Devrait rejeter les cas où le cashflow cible est impossible', () => {
      // Cas où les dépenses sont trop élevées par rapport aux revenus
      const impossibleCase = {
        ...maxPriceParams,
        expenses: {
          ...maxPriceParams.expenses,
          municipalTax: 20000,  // Dépenses beaucoup trop élevées
          management: 10000
        },
        targetCashflowPerUnit: 200  // Cible très élevée
      };
      
      expect(() => calculateMaxPurchasePrice(impossibleCase)).toThrow();
    });
  });

  describe('performSensitivityAnalysis - analyse de sensibilité', () => {
    test('Devrait générer les scénarios spécifiés', () => {
      const scenarios = {
        purchasePrice: [-10, 0, 10],  // -10%, +0%, +10%
        baseRent: [-10, 0, 10],       // -10%, +0%, +10%
        expenses: [-15, 0, 15],       // -15%, +0%, +15%
        interestRate: [-1, 0, 1]      // -1 point, +0 point, +1 point
      };
      
      const result = performSensitivityAnalysis(baseInput, scenarios);
      
      // Devrait inclure le cas de base
      expect(result).toHaveProperty('baseCase');
      
      // Devrait inclure les scénarios
      expect(result).toHaveProperty('scenarios');
      expect(Array.isArray(result.scenarios)).toBe(true);
      
      // Nombre de scénarios attendu: 2 x 4 paramètres = 8 (sans compter le cas de base)
      expect(result.scenarios.length).toBe(8);
      
      // Vérifions que les scénarios sont bien triés par cashflow décroissant
      for (let i = 1; i < result.scenarios.length; i++) {
        expect(result.scenarios[i-1].result.cashflowPerUnit).toBeGreaterThanOrEqual(result.scenarios[i].result.cashflowPerUnit);
      }
    });
  });
});
