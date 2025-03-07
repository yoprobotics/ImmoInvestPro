/**
 * Exemple d'utilisation du calculateur MULTI détaillé (version 5.1)
 * 
 * Cet exemple montre comment structurer les données d'entrée pour le calculateur
 * et comment interpréter les résultats.
 */

const MultiDetailedCalculator = require('../detailed/MultiDetailedCalculator');

// Exemple de données pour un immeuble à revenus
const propertyData = {
  // Informations de base sur l'immeuble
  purchasePrice: 675000,
  renovationCost: 25000,
  
  // Détails des revenus
  revenueDetails: {
    // Liste des unités/logements avec leurs caractéristiques
    units: [
      {
        unitNumber: "101",
        type: "3 1/2",
        monthlyRent: 850,
        isOccupied: true,
        leaseEndDate: "2025-07-31"
      },
      {
        unitNumber: "102",
        type: "3 1/2",
        monthlyRent: 875,
        isOccupied: true,
        leaseEndDate: "2025-06-30"
      },
      {
        unitNumber: "201",
        type: "4 1/2",
        monthlyRent: 1050,
        isOccupied: true,
        leaseEndDate: "2025-05-31"
      },
      {
        unitNumber: "202",
        type: "4 1/2",
        monthlyRent: 1100,
        isOccupied: true,
        leaseEndDate: "2025-08-31"
      },
      {
        unitNumber: "301",
        type: "5 1/2",
        monthlyRent: 1300,
        isOccupied: true,
        leaseEndDate: "2025-07-31"
      },
      {
        unitNumber: "302",
        type: "5 1/2",
        monthlyRent: 1325,
        isOccupied: false,
        renovationNeeded: true
      }
    ],
    
    // Revenus additionnels (stationnements, buanderie, etc.)
    additionalRevenues: [
      {
        type: "parking",
        description: "Stationnements extérieurs",
        monthlyRevenue: 75,
        count: 8
      },
      {
        type: "laundry",
        description: "Buanderie commune",
        monthlyRevenue: 300
      }
    ],
    
    // Taux d'inoccupation estimé (%)
    vacancyRate: 3
  },
  
  // Structure de financement
  financing: {
    // Premier prêt hypothécaire (conventionnel)
    firstMortgage: {
      loanToValue: 0.75, // 75% du prix d'achat + rénovations
      interestRate: 4.5,  // Taux d'intérêt (%)
      amortizationYears: 25, // Période d'amortissement
      term: 5 // Terme du prêt
    },
    
    // Balance de vente (optionnel)
    sellerFinancing: {
      amount: 50000, // Montant
      interestRate: 6.0, // Taux d'intérêt (%)
      amortizationYears: 5, // Période d'amortissement
      term: 5 // Terme du prêt
    }
  }
};

// Calcul de la rentabilité
const result = MultiDetailedCalculator.calculate(propertyData);

// Affichage des résultats
console.log('\n=== RAPPORT D\'ANALYSE D\'INVESTISSEMENT ===');
console.log(`Immeuble de ${result.summary.units} logements au prix de ${result.summary.purchasePrice.toLocaleString()} $`);
console.log('\n--- REVENUS ---');
console.log(`Revenu brut annuel: ${result.details.grossAnnualRent.toLocaleString()} $`);
console.log(`Revenu net d'opération: ${result.details.netOperatingIncome.toLocaleString()} $`);

console.log('\n--- INDICATEURS DE PERFORMANCE ---');
console.log(`Taux de capitalisation: ${result.summary.capRate} %`);
console.log(`Rendement sur fonds propres: ${result.summary.cashOnCash} %`);
console.log(`Multiplicateur de revenus bruts: ${result.summary.grossRentMultiplier}`);

console.log('\n--- CASHFLOW ---');
console.log(`Cashflow mensuel: ${result.details.monthlyCashflow.toLocaleString()} $`);
console.log(`Cashflow par porte: ${result.details.cashflowPerUnit.toLocaleString()} $`);
console.log(`Viabilité: ${result.summary.isViable ? 'OUI' : 'NON'}`);
console.log(`${result.summary.message}`);

// Exemple d'exécution pour tester
// node multi_detailed_example.js
