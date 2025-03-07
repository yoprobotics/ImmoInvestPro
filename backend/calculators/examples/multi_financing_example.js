/**
 * Exemple d'utilisation du calculateur MULTI détaillé (version 5.1) avec financement créatif
 * 
 * Cet exemple montre comment structurer les options de financement avancées
 * et comment interpréter les résultats d'amortissement et ratios d'endettement.
 */

const MultiDetailedCalculator = require('../detailed/MultiDetailedCalculator');

// Exemple de données pour un immeuble à revenus avec financement créatif
const propertyData = {
  // Informations de base sur l'immeuble
  purchasePrice: 675000,
  renovationCost: 25000,
  
  // Coûts d'acquisition
  acquisitionCosts: {
    transferTax: 11500,        // Droits de mutation (taxe de bienvenue)
    legalFees: 2200,           // Frais de notaire
    inspectionFees: 800,       // Frais d'inspection
    appraisalFees: 900,        // Frais d'évaluation
    mortgageSetupFees: 1500,   // Frais de mise en place du prêt
    otherFees: 1200            // Autres frais
  },
  
  // Détails des revenus
  revenueDetails: {
    // Liste des unités/logements (identique à l'exemple précédent)
    units: [
      { unitNumber: "101", type: "3 1/2", monthlyRent: 850, isOccupied: true },
      { unitNumber: "102", type: "3 1/2", monthlyRent: 875, isOccupied: true },
      { unitNumber: "201", type: "4 1/2", monthlyRent: 1050, isOccupied: true },
      { unitNumber: "202", type: "4 1/2", monthlyRent: 1100, isOccupied: true },
      { unitNumber: "301", type: "5 1/2", monthlyRent: 1300, isOccupied: true },
      { unitNumber: "302", type: "5 1/2", monthlyRent: 1325, isOccupied: false }
    ],
    additionalRevenues: [
      { type: "parking", description: "Stationnements extérieurs", monthlyRevenue: 75, count: 8 },
      { type: "laundry", description: "Buanderie commune", monthlyRevenue: 300 }
    ],
    vacancyRate: 3
  },
  
  // Détails des dépenses (même que précédemment)
  expenseDetails: {
    municipalTaxes: 7250,
    schoolTaxes: 950,
    insurance: 3200,
    electricity: 2400,
    heating: 3800,
    water: 1200,
    maintenance: 5500,
    management: 3840,
    janitorial: 2400,
    snowRemoval: 1800,
    landscaping: 1200,
    garbage: 600,
    legal: 800,
    accounting: 1200,
    advertising: 500,
    other: 1000
  },
  
  // Structure de financement créatif
  financing: {
    // Premier prêt hypothécaire (conventionnel)
    firstMortgage: {
      loanToValue: 0.75,         // 75% du prix d'achat + rénovations
      interestRate: 4.5,          // Taux d'intérêt (%)
      amortizationYears: 25,      // Période d'amortissement
      term: 5,                    // Terme du prêt
      prepaymentPrivileges: 15,   // % de prépaiement permis sans pénalité
      paymentFrequency: 'monthly' // Fréquence de paiement
    },
    
    // Balance de vente
    sellerFinancing: {
      amount: 50000,             // Montant
      interestRate: 5.0,         // Taux d'intérêt (%)
      amortizationYears: 5,      // Période d'amortissement
      term: 5,                   // Terme du prêt
      interestOnly: false,       // Remboursement capital + intérêts
      paymentStartMonths: 3      // Délai avant début des paiements (3 mois)
    },
    
    // Investisseur privé
    privateInvestor: {
      amount: 75000,             // Montant
      interestRate: 8.0,         // Taux d'intérêt (%)
      amortizationYears: 5,      // Période d'amortissement
      term: 5,                   // Terme du prêt
      interestOnly: true,        // Remboursement intérêts seulement
      profitSharing: 25          // 25% du profit partagé avec l'investisseur
    },
    
    // Cash investi personnellement
    personalCashAmount: 60000,
    
    // Équité additionnelle (ex: marge de crédit)
    additionalEquityAmount: 20000
  },
  
  // Profil de l'investisseur pour calculs de ratios d'endettement
  investorProfile: {
    annualIncome: 120000,         // Revenu annuel brut
    otherMonthlyDebt: 1800,       // Autres dettes mensuelles
    creditScore: 750,             // Score de crédit
    existingProperties: 2,        // Nombre de propriétés déjà détenues
    rrspAvailable: 35000,         // REER disponible pour mise de fonds
    tfsaAvailable: 15000          // CELI disponible
  }
};

// Calcul de la rentabilité
const result = MultiDetailedCalculator.calculate(propertyData);

// Affichage des résultats
console.log('\n=== RAPPORT D\'ANALYSE D\'INVESTISSEMENT AVEC FINANCEMENT CRÉATIF ===');
console.log(`Immeuble de ${result.summary.units} logements au prix de ${result.summary.purchasePrice.toLocaleString()} $`);

console.log('\n--- INVESTISSEMENT ---');
console.log(`Prix d'achat: ${result.details.purchasePrice.toLocaleString()} $`);
console.log(`Rénovations: ${result.details.renovationCost.toLocaleString()} $`);
console.log(`Coûts d'acquisition: ${result.details.acquisitionCosts.total.toLocaleString()} $`);
console.log(`Investissement total: ${result.details.totalInvestment.toLocaleString()} $`);

console.log('\n--- REVENUS ET DÉPENSES ---');
console.log(`Revenu brut annuel: ${result.details.grossAnnualRent.toLocaleString()} $`);
console.log(`Dépenses d'opération: ${result.details.operatingExpenses.toLocaleString()} $ (${result.details.expenseRatio.toFixed(1)}%)`);
console.log(`Revenu net d'opération: ${result.details.netOperatingIncome.toLocaleString()} $`);

console.log('\n--- STRUCTURE DE FINANCEMENT CRÉATIF ---');
console.log(`1er prêt hypothécaire: ${result.details.financing.firstMortgageAmount.toLocaleString()} $ (${(result.details.financing.firstMortgageAmount / result.details.totalInvestment * 100).toFixed(1)}%)` +
            ` @ ${propertyData.financing.firstMortgage.interestRate}% / ${propertyData.financing.firstMortgage.amortizationYears} ans`);

if (result.details.financing.sellerFinancingAmount > 0) {
  console.log(`Balance de vente: ${result.details.financing.sellerFinancingAmount.toLocaleString()} $ (${(result.details.financing.sellerFinancingAmount / result.details.totalInvestment * 100).toFixed(1)}%)` +
              ` @ ${propertyData.financing.sellerFinancing.interestRate}% / ${propertyData.financing.sellerFinancing.amortizationYears} ans`);
}

if (result.details.financing.privateInvestorAmount > 0) {
  console.log(`Investisseur privé: ${result.details.financing.privateInvestorAmount.toLocaleString()} $ (${(result.details.financing.privateInvestorAmount / result.details.totalInvestment * 100).toFixed(1)}%)` +
              ` @ ${propertyData.financing.privateInvestor.interestRate}% / ${propertyData.financing.privateInvestor.interestOnly ? 'intérêt seulement' : propertyData.financing.privateInvestor.amortizationYears + ' ans'}`);
  
  if (propertyData.financing.privateInvestor.profitSharing) {
    console.log(`  Partage de profit: ${propertyData.financing.privateInvestor.profitSharing}%`);
  }
}

console.log(`Mise de fonds personnelle: ${result.details.financing.equityStructure.personalCash.toLocaleString()} $ (${(result.details.financing.equityStructure.personalCash / result.details.totalInvestment * 100).toFixed(1)}%)`);

if (result.details.financing.equityStructure.additionalEquity > 0) {
  console.log(`Équité additionnelle: ${result.details.financing.equityStructure.additionalEquity.toLocaleString()} $ (${(result.details.financing.equityStructure.additionalEquity / result.details.totalInvestment * 100).toFixed(1)}%)`);
}

console.log('\n--- PAIEMENTS MENSUELS ---');
console.log(`1er prêt hypothécaire: ${result.details.financing.firstMortgageMonthlyPayment.toFixed(2)} $ (Capital: ${result.details.financing.firstMortgageMonthlyPrincipal.toFixed(2)} $ / Intérêt: ${result.details.financing.firstMortgageMonthlyInterest.toFixed(2)} $)`);

if (result.details.financing.sellerFinancingAmount > 0) {
  console.log(`Balance de vente: ${result.details.financing.sellerFinancingMonthlyPayment.toFixed(2)} $ (Capital: ${result.details.financing.sellerFinancingMonthlyPrincipal.toFixed(2)} $ / Intérêt: ${result.details.financing.sellerFinancingMonthlyInterest.toFixed(2)} $)`);
}

if (result.details.financing.privateInvestorAmount > 0) {
  console.log(`Investisseur privé: ${result.details.financing.privateInvestorMonthlyPayment.toFixed(2)} $ (Capital: ${result.details.financing.privateInvestorMonthlyPrincipal.toFixed(2)} $ / Intérêt: ${result.details.financing.privateInvestorMonthlyInterest.toFixed(2)} $)`);
}

console.log(`Total mensuel: ${result.details.financing.totalMonthlyPayment.toFixed(2)} $`);

console.log('\n--- AMORTISSEMENT 1ÈRE ANNÉE ---');
console.log(`Intérêts payés: ${result.details.amortizationFirstYear.firstYear.totalInterest.toLocaleString()} $`);
console.log(`Capital remboursé: ${result.details.amortizationFirstYear.firstYear.totalPrincipal.toLocaleString()} $`);
console.log(`Solde restant après 1 an: ${result.details.amortizationFirstYear.firstYear.endingBalance.firstMortgage.toLocaleString()} $`);

console.log('\n--- RATIOS D\'ENDETTEMENT ---');
if (result.details.debtServiceRatios.abd) {
  console.log(`Ratio ABD: ${result.details.debtServiceRatios.abd}% (limite: ${result.details.debtServiceRatios.abdLimit}%) ${result.details.debtServiceRatios.abdExceeded ? '⚠️ DÉPASSÉ' : '✓ OK'}`);
  console.log(`Ratio ATD: ${result.details.debtServiceRatios.atd}% (limite: ${result.details.debtServiceRatios.atdLimit}%) ${result.details.debtServiceRatios.atdExceeded ? '⚠️ DÉPASSÉ' : '✓ OK'}`);
}

console.log('\n--- INDICATEURS DE PERFORMANCE ---');
console.log(`Taux de capitalisation: ${result.summary.capRate}%`);
console.log(`Rendement sur fonds propres: ${result.summary.cashOnCash}%`);
console.log(`Multiplicateur de revenus bruts: ${result.summary.grossRentMultiplier}`);

console.log('\n--- CASHFLOW ---');
console.log(`Cashflow mensuel: ${result.details.monthlyCashflow.toLocaleString()} $`);
console.log(`Cashflow par porte: ${result.details.cashflowPerUnit.toLocaleString()} $`);
console.log(`Viabilité: ${result.summary.isViable ? 'OUI' : 'NON'}`);
console.log(`${result.summary.message}`);

// Exemple d'exécution pour tester
// node multi_financing_example.js
