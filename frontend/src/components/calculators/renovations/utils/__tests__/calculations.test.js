import {
  calculateElementCost,
  calculateRoomCost,
  calculateTotalRenovationCost,
  calculateContingencyAmount,
  calculateGrandTotal,
  suggestUnitPrice,
  formatCurrency
} from '../calculations';

// Tests pour calculateElementCost
describe('calculateElementCost', () => {
  test('calcule correctement le coût d\'un élément', () => {
    const element = {
      quantity: 2,
      unitPrice: 500
    };
    expect(calculateElementCost(element)).toBe(1000);
  });

  test('gère les valeurs nulles ou manquantes', () => {
    const elementNull = {
      quantity: null,
      unitPrice: 500
    };
    const elementUndefined = {
      unitPrice: 500
    };
    const elementEmpty = {};

    expect(calculateElementCost(elementNull)).toBeNaN();
    expect(calculateElementCost(elementUndefined)).toBeNaN();
    expect(calculateElementCost(elementEmpty)).toBeNaN();
  });
});

// Tests pour calculateRoomCost
describe('calculateRoomCost', () => {
  test('calcule correctement le coût total d\'une pièce', () => {
    const room = {
      elements: [
        { quantity: 2, unitPrice: 500 },
        { quantity: 1, unitPrice: 1000 },
        { quantity: 3, unitPrice: 100 }
      ]
    };
    expect(calculateRoomCost(room)).toBe(2300); // (2*500) + (1*1000) + (3*100) = 2300
  });

  test('retourne 0 pour une pièce sans éléments', () => {
    const room = {
      elements: []
    };
    expect(calculateRoomCost(room)).toBe(0);
  });

  test('gère une pièce sans la propriété elements', () => {
    const room = {};
    expect(calculateRoomCost(room)).toBe(0);
  });
});

// Tests pour calculateTotalRenovationCost
describe('calculateTotalRenovationCost', () => {
  test('calcule correctement le coût total de toutes les pièces', () => {
    const rooms = [
      {
        elements: [
          { quantity: 2, unitPrice: 500 },
          { quantity: 1, unitPrice: 1000 }
        ]
      },
      {
        elements: [
          { quantity: 3, unitPrice: 200 },
          { quantity: 1, unitPrice: 300 }
        ]
      }
    ];
    expect(calculateTotalRenovationCost(rooms)).toBe(3300); // (2*500 + 1*1000) + (3*200 + 1*300) = 3300
  });

  test('retourne 0 pour un tableau vide de pièces', () => {
    const rooms = [];
    expect(calculateTotalRenovationCost(rooms)).toBe(0);
  });

  test('gère un paramètre null ou undefined', () => {
    expect(calculateTotalRenovationCost(null)).toBe(0);
    expect(calculateTotalRenovationCost(undefined)).toBe(0);
  });
});

// Tests pour calculateContingencyAmount
describe('calculateContingencyAmount', () => {
  test('calcule correctement le montant de la contingence', () => {
    expect(calculateContingencyAmount(10000, 10)).toBe(1000);
    expect(calculateContingencyAmount(10000, 15)).toBe(1500);
    expect(calculateContingencyAmount(10000, 0)).toBe(0);
  });
});

// Tests pour calculateGrandTotal
describe('calculateGrandTotal', () => {
  test('calcule correctement le grand total', () => {
    expect(calculateGrandTotal(10000, 1000)).toBe(11000);
    expect(calculateGrandTotal(10000, 0)).toBe(10000);
    expect(calculateGrandTotal(0, 0)).toBe(0);
  });
});

// Tests pour suggestUnitPrice
describe('suggestUnitPrice', () => {
  test('suggère des prix unitaires corrects en fonction du type de pièce et d\'élément', () => {
    expect(suggestUnitPrice('Cuisine', 'Armoires')).toBeGreaterThan(0);
    expect(suggestUnitPrice('Salle de bain', 'Plomberie')).toBeGreaterThan(0);
    expect(suggestUnitPrice('Type inconnu', 'Élément inconnu')).toBe(500); // Méthode des 500$
  });
});

// Tests pour formatCurrency
describe('formatCurrency', () => {
  test('formate correctement les valeurs en devise', () => {
    // Le format peut varier selon la locale, donc on vérifie simplement que la valeur est une chaîne
    // et qu'elle contient le montant
    const formattedValue = formatCurrency(1000);
    expect(typeof formattedValue).toBe('string');
    expect(formattedValue).toContain('1');
    expect(formattedValue).toContain('000');
  });

  test('gère les valeurs nulles ou undefined', () => {
    expect(formatCurrency(0)).toContain('0');
    expect(formatCurrency(null)).toContain('0');
    expect(formatCurrency(undefined)).toContain('0');
  });
});
