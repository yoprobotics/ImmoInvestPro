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
  
  // Détails des dépenses
  expenseDetails: {
    // Taxes et assurances
    municipalTaxes: 7250, // Taxes municipales annuelles
    schoolTaxes: 950, // Taxes scolaires annuelles
    insurance: 3200, // Assurance immeuble

    // Utilités
    electricity: 2400, // Électricité (si payée par le propriétaire)
    heating: 3800, // Chauffage (si payé par le propriétaire)
    water: 1200, // Eau et égouts

    // Entretien et services
    maintenance: 5500, // Entretien et réparations générales
    management: 3840, // Frais de gestion (ex: 5% des revenus bruts)
    janitorial: 2400, // Conciergerie
    snowRemoval: 1800, // Déneigement
    landscaping: 1200, // Aménagement paysager
    garbage: 600, // Collecte des ordures (si applicable)

    // Frais professionnels
    legal: 800, // Frais juridiques moyens
    accounting: 1200, // Frais comptables
    
    // Autres dépenses
    advertising: 500, // Publicité pour la location
    other: 1000 // Dépenses diverses
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

console.log('\n--- DÉPENSES ---');
console.log(`Total des dépenses annuelles: ${result.details.expenseDetails.totalAnnualExpenses.toLocaleString()} $`);
console.log(`Ratio des dépenses: ${result.details.expenseRatio.toFixed(2)} %`);

// Affichage des principales catégories de dépenses
console.log('\nDépenses par catégorie:');
const expenseCategories = result.details.expenseDetails.categories;
console.log(`Taxes municipales: ${expenseCategories.municipalTaxes?.annualAmount.toLocaleString() || 0} $ (${((expenseCategories.municipalTaxes?.annualAmount || 0) / result.details.expenseDetails.totalAnnualExpenses * 100).toFixed(1)}%)`);
console.log(`Taxes scolaires: ${expenseCategories.schoolTaxes?.annualAmount.toLocaleString() || 0} $ (${((expenseCategories.schoolTaxes?.annualAmount || 0) / result.details.expenseDetails.totalAnnualExpenses * 100).toFixed(1)}%)`);
console.log(`Assurance: ${expenseCategories.insurance?.annualAmount.toLocaleString() || 0} $ (${((expenseCategories.insurance?.annualAmount || 0) / result.details.expenseDetails.totalAnnualExpenses * 100).toFixed(1)}%)`);
console.log(`Chauffage et électricité: ${(expenseCategories.heating?.annualAmount || 0 + expenseCategories.electricity?.annualAmount || 0).toLocaleString()} $ (${((expenseCategories.heating?.annualAmount || 0 + expenseCategories.electricity?.annualAmount || 0) / result.details.expenseDetails.totalAnnualExpenses * 100).toFixed(1)}%)`);
console.log(`Entretien: ${expenseCategories.maintenance?.annualAmount.toLocaleString() || 0} $ (${((expenseCategories.maintenance?.annualAmount || 0) / result.details.expenseDetails.totalAnnualExpenses * 100).toFixed(1)}%)`);

console.log('\n--- FINANCEMENT ---');
console.log(`Premier prêt hypothécaire: ${result.details.financing.firstMortgageAmount.toLocaleString()} $ (mensuel: ${result.details.financing.firstMortgageMonthlyPayment.toFixed(2)} $)`);
if (result.details.financing.sellerFinancingAmount > 0) {
  console.log(`Balance de vente: ${result.details.financing.sellerFinancingAmount.toLocaleString()} $ (mensuel: ${result.details.financing.sellerFinancingMonthlyPayment.toFixed(2)} $)`);
}
console.log(`Mise de fonds totale: ${result.details.financing.totalDownPayment.toLocaleString()} $`);

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
