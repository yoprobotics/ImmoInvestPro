/**
 * Tests unitaires pour le calculateur de taxes de mutation
 */

const { calculateTransferTax, isMontreal } = require('../transfer_tax_calculator');

describe('Transfer Tax Calculator', () => {
  describe('isMontreal function', () => {
    test('should return true for Montréal city names', () => {
      expect(isMontreal('Montréal')).toBe(true);
      expect(isMontreal('Montreal')).toBe(true);
      expect(isMontreal('Ville-Marie')).toBe(true);
      expect(isMontreal('Plateau-Mont-Royal')).toBe(true);
    });

    test('should return false for non-Montréal city names', () => {
      expect(isMontreal('Québec')).toBe(false);
      expect(isMontreal('Laval')).toBe(false);
      expect(isMontreal('Sherbrooke')).toBe(false);
      expect(isMontreal('')).toBe(false);
      expect(isMontreal(null)).toBe(false);
    });
  });

  describe('calculateTransferTax function', () => {
    test('should calculate tax correctly for a property under first bracket', () => {
      const result = calculateTransferTax({ propertyValue: 50000 });
      expect(result.transferTaxTotal).toBe(250); // 50000 * 0.5%
      expect(result.details.length).toBe(1);
    });

    test('should calculate tax correctly for a property in second bracket', () => {
      const result = calculateTransferTax({ propertyValue: 100000 });
      // First 53700 * 0.5% = 268.5
      // Remaining 46300 * 1.0% = 463
      // Total: 731.5
      expect(result.transferTaxTotal).toBeCloseTo(731.5);
      expect(result.details.length).toBe(2);
    });

    test('should calculate tax correctly for a property in third bracket', () => {
      const result = calculateTransferTax({ propertyValue: 300000 });
      // First 53700 * 0.5% = 268.5
      // Second (269200 - 53700) * 1.0% = 2155
      // Remaining (300000 - 269200) * 1.5% = 462
      // Total: 2885.5
      expect(result.transferTaxTotal).toBeCloseTo(2885.5);
      expect(result.details.length).toBe(3);
    });

    test('should apply Montréal rates for Montreal properties', () => {
      const result = calculateTransferTax({ 
        propertyValue: 600000,
        municipality: 'Montréal'
      });
      // First 53700 * 0.5% = 268.5
      // Second (269200 - 53700) * 1.0% = 2155
      // Third (500000 - 269200) * 1.5% = 3462
      // Fourth (600000 - 500000) * 2.0% = 2000
      // Total: 7885.5
      expect(result.transferTaxTotal).toBeCloseTo(7885.5);
      expect(result.details.length).toBe(4);
      expect(result.isMontrealProperty).toBe(true);
    });

    test('should not apply Montréal rates for non-Montréal properties', () => {
      const result = calculateTransferTax({ 
        propertyValue: 600000,
        municipality: 'Québec'
      });
      // First 53700 * 0.5% = 268.5
      // Second (269200 - 53700) * 1.0% = 2155
      // Third (600000 - 269200) * 1.5% = 4962
      // Total: 7385.5
      expect(result.transferTaxTotal).toBeCloseTo(7385.5);
      expect(result.details.length).toBe(3);
      expect(result.isMontrealProperty).toBe(false);
    });

    test('should apply exemption for first-time home buyers in Montréal', () => {
      const result = calculateTransferTax({ 
        propertyValue: 300000,
        municipality: 'Montréal',
        isFirstTimeHomeBuyer: true
      });
      // Calculate tax: ~2885.5
      // Apply exemption (max 5000): 2885.5
      // Result: 0
      expect(result.transferTaxTotal).toBe(0);
      expect(result.exemption.amount).toBeCloseTo(2885.5);
    });

    test('should apply custom rate when provided', () => {
      const result = calculateTransferTax({ 
        propertyValue: 100000,
        customRatePercentage: 2.5
      });
      // 100000 * 2.5% = 2500
      expect(result.transferTaxTotal).toBe(2500);
      expect(result.details.length).toBe(1);
    });

    test('should throw error for invalid property value', () => {
      expect(() => {
        calculateTransferTax({ propertyValue: 0 });
      }).toThrow();
      
      expect(() => {
        calculateTransferTax({ propertyValue: -10000 });
      }).toThrow();
      
      expect(() => {
        calculateTransferTax({ propertyValue: null });
      }).toThrow();
    });
  });
});
