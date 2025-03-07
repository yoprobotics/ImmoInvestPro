/**
 * Exemple d'utilisation du calculateur détaillé FLIP
 */

const FlipDetailedCalculator = require('../FlipDetailedCalculator');

// Créer un exemple de données d'entrée pour un projet FLIP
const sampleData = {
  actions: {
    flipPlan: "Rénovation complète",
    acquisitionDate: "2025-04-01",
    expectedSaleDate: "2025-10-01",
    holdingPeriodMonths: 6
  },
  generalInfo: {
    address: "123 Rue Principale",
    city: "Montréal",
    province: "Québec",
    postalCode: "H1A 1A1",
    propertyType: "Maison unifamiliale",
    yearBuilt: 1975,
    lotSize: 5000,
    buildingSize: 2000,
    numberOfBedrooms: 3,
    numberOfBathrooms: 2,
    parkingSpaces: 1,
    description: "Maison à rénover dans un quartier en demande"
  },
  acquisitionCosts: {
    purchasePrice: 300000,
    transferTax: 3000,
    legalFees: 1500,
    inspectionFees: 500,
    appraisalFees: 350,
    mortgageInsurance: 0,
    mortgageSetupFees: 250,
    otherAcquisitionFees: 200
  },
  renovationCosts: {
    kitchen: 25000,
    bathroom: 15000,
    flooring: 10000,
    painting: 5000,
    windows: 8000,
    doors: 3000,
    roofing: 0,
    electrical: 5000,
    plumbing: 4000,
    hvac: 0,
    foundation: 0,
    exterior: 6000,
    landscape: 2000,
    permits: 1000,
    laborCosts: 20000,
    materials: 15000,
    contingency: 10000,
    otherRenovationCosts: 1000
  },
  sellingCosts: {
    realEstateCommission: 12000,
    legalFeesForSale: 1200,
    marketingCosts: 500,
    stagingCosts: 2000,
    prepaymentPenalty: 0,
    otherSellingCosts: 300
  },
  revenues: {
    expectedSalePrice: 450000,
    rentalIncome: 0,
    otherRevenues: 0
  },
  holdingCosts: {
    propertyTaxes: 3600,  // annuel
    insurance: 1200,      // annuel
    utilities: 200,       // mensuel
    maintenance: 100,     // mensuel
    otherHoldingCosts: 50 // mensuel
  },
  maintenanceCosts: {
    repairs: 0,           // mensuel
    cleaning: 100,        // mensuel
    landscaping: 150,     // mensuel
    snowRemoval: 0,       // mensuel
    otherMaintenanceCosts: 0 // mensuel
  },
  propertyFinancing: {
    downPayment: 60000,
    downPaymentPercentage: 20,
    firstMortgageAmount: 240000,
    firstMortgageRate: 4.5,
    firstMortgageTerm: 5,
    firstMortgageAmortization: 25,
    secondMortgageAmount: 0,
    secondMortgageRate: 0,
    secondMortgageTerm: 0,
    secondMortgageAmortization: 0,
    privateLoanAmount: 0,
    privateLoanRate: 0,
    privateLoanTerm: 0,
    vendorTakeBackAmount: 0,
    vendorTakeBackRate: 0,
    vendorTakeBackTerm: 0
  },
  renovationFinancing: {
    personalFunds: 30000,
    creditLineAmount: 100000,
    creditLineRate: 6.5,
    renovationLoanAmount: 0,
    renovationLoanRate: 0,
    renovationLoanTerm: 0
  }
};

// Créer trois scénarios
const scenario1 = JSON.parse(JSON.stringify(sampleData)); // Scénario de base

const scenario2 = JSON.parse(JSON.stringify(sampleData)); // Scénario optimiste
scenario2.revenues.expectedSalePrice = 480000;
scenario2.renovationCosts.kitchen = 20000;
scenario2.renovationCosts.bathroom = 12000;
scenario2.holdingPeriodMonths = 5;

const scenario3 = JSON.parse(JSON.stringify(sampleData)); // Scénario pessimiste
scenario3.revenues.expectedSalePrice = 420000;
scenario3.renovationCosts.kitchen = 30000;
scenario3.renovationCosts.bathroom = 18000;
scenario3.renovationCosts.contingency = 15000;
scenario3.holdingPeriodMonths = 8;

// Initialiser le calculateur avec le premier scénario
const calculator = new FlipDetailedCalculator(scenario1);

// Mettre à jour les scénarios 2 et 3
calculator.setScenario(2).updateCurrentScenario(scenario2);
calculator.setScenario(3).updateCurrentScenario(scenario3);

// Effectuer les calculs pour tous les scénarios et comparer
const results = calculator.compareScenarios();

// Afficher les résultats clés
console.log('=== Analyse comparative des scénarios FLIP ===');
console.log('\nProfits nets:');
console.log(`Scénario 1: ${results.comparison.profitability.netProfit.scenario1.toFixed(2)} $`);
console.log(`Scénario 2: ${results.comparison.profitability.netProfit.scenario2.toFixed(2)} $`);
console.log(`Scénario 3: ${results.comparison.profitability.netProfit.scenario3.toFixed(2)} $`);

console.log('\nROI annualisés:');
console.log(`Scénario 1: ${results.comparison.profitability.annualizedRoi.scenario1.toFixed(2)} %`);
console.log(`Scénario 2: ${results.comparison.profitability.annualizedRoi.scenario2.toFixed(2)} %`);
console.log(`Scénario 3: ${results.comparison.profitability.annualizedRoi.scenario3.toFixed(2)} %`);

console.log('\nInvestissements totaux:');
console.log(`Scénario 1: ${results.comparison.profitability.totalInvestment.scenario1.toFixed(2)} $`);
console.log(`Scénario 2: ${results.comparison.profitability.totalInvestment.scenario2.toFixed(2)} $`);
console.log(`Scénario 3: ${results.comparison.profitability.totalInvestment.scenario3.toFixed(2)} $`);

console.log(`\nMeilleur scénario: ${results.bestScenario}`);

// Pour exécuter cet exemple: node flip-detailed-example.js
