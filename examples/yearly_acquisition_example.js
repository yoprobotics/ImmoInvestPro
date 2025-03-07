/**
 * Exemple d'utilisation du calculateur "Un immeuble par AN"
 * 
 * Cet exemple montre comment utiliser le calculateur pour planifier une stratégie
 * d'acquisition d'immeubles sur plusieurs années afin d'atteindre un objectif
 * de revenus passifs pour la retraite.
 */

const { financial } = require('../backend/calculators');
const yearlyAcquisitionCalculator = financial.yearlyAcquisitionCalculator;

// Étape 1: Calculer le nombre de portes nécessaires pour atteindre un objectif de revenus
console.log('ÉTAPE 1: CALCUL DU NOMBRE DE PORTES NÉCESSAIRES\n');

const targetMonthlyIncome = 5000; // Objectif de revenu mensuel: 5000$
const cashflowPerDoor = 75; // Cashflow par porte: 75$ (standard recommandé)

const requiredUnits = yearlyAcquisitionCalculator.calculateRequiredUnits({
  targetMonthlyIncome,
  cashflowPerDoor
});

console.log(`Pour atteindre un revenu mensuel de ${targetMonthlyIncome}$ avec un cashflow par porte de ${cashflowPerDoor}$:`);
console.log(`- Nombre de portes nécessaires: ${requiredUnits.requiredUnits}`);
console.log(`- Estimation simple de la durée pour y arriver: ${requiredUnits.estimatedAchievementTime} années\n`);

// Étape 2: Générer un modèle d'acquisition sur 10 ans
console.log('ÉTAPE 2: GÉNÉRATION D\'UN MODÈLE D\'ACQUISITION SUR 10 ANS\n');

// Définir les paramètres pour notre stratégie d'acquisition
const acquisitionModel = yearlyAcquisitionCalculator.generateAcquisitionModel({
  targetMonthlyIncome, // 5000$
  cashflowPerDoor, // 75$
  initialUnitCount: 4, // Premier immeuble: 4 portes
  unitCountIncrement: 1, // Augmenter d'une porte par an
  initialPurchasePrice: 400000, // Premier immeuble: 400 000$
  pricePerUnit: 100000, // Prix par unité: 100 000$
  downPaymentPercentage: 0.2, // Mise de fonds: 20%
  appreciationRate: 0.03, // Appréciation annuelle: 3%
  numberOfYears: 10 // Stratégie sur 10 ans
});

// Étape 3: Calculer la projection de la stratégie d'acquisition
console.log('ÉTAPE 3: PROJECTION DE LA STRATÉGIE D\'ACQUISITION\n');

const projection = yearlyAcquisitionCalculator.calculateYearlyAcquisitionStrategy(acquisitionModel);

// Afficher un résumé année par année
console.log('RÉSUMÉ ANNÉE PAR ANNÉE:');
console.log('=====================================================================');
console.log('Année | Nouvelles | Total  | Portefeuille | Cashflow  | % Objectif');
console.log('      | portes    | portes | valeur       | mensuel   | atteint');
console.log('---------------------------------------------------------------------');

projection.yearlySnapshots.forEach(year => {
  console.log(
    `${year.year.toString().padEnd(6)} | ` +
    `${year.newUnitCount.toString().padEnd(9)} | ` +
    `${year.totalUnitCount.toString().padEnd(7)} | ` +
    `${year.totalPortfolioValue.toLocaleString().padEnd(12)} | ` +
    `${year.monthlyCashflow.toLocaleString().padEnd(10)} | ` +
    `${year.yearlyKPI.toFixed(1).padEnd(5)}%`
  );
});

console.log('=====================================================================\n');

// Afficher le résumé final
console.log('RÉSUMÉ FINAL:');
console.log(`- Valeur finale du portefeuille: ${projection.summary.finalPortfolioValue.toLocaleString()}$`);
console.log(`- Équité finale: ${projection.summary.finalEquity.toLocaleString()}$`);
console.log(`- Cashflow mensuel final: ${projection.summary.finalMonthlyCashflow.toLocaleString()}$`);
console.log(`- Capital total investi: ${projection.summary.totalInvestedCapital.toLocaleString()}$`);
console.log(`- Rendement sur investissement: ${projection.summary.returnOnInvestment.toFixed(2)}%`);
console.log(`- Taux de croissance annuel composé: ${projection.summary.portfolioGrowthRate.toFixed(2)}%`);

if (projection.summary.targetAchieved) {
  console.log(`- Objectif de revenu atteint en ${projection.summary.yearsToTarget} années`);
} else {
  console.log('- Objectif de revenu non atteint dans la période projetée');
  
  // Calculer combien d'années supplémentaires seraient nécessaires
  const yearlyIncrease = projection.yearlySnapshots[9].monthlyCashflow - projection.yearlySnapshots[8].monthlyCashflow;
  const remainingGap = targetMonthlyIncome - projection.summary.finalMonthlyCashflow;
  const additionalYearsNeeded = Math.ceil(remainingGap / yearlyIncrease);
  
  console.log(`  Estimation: ${additionalYearsNeeded} années supplémentaires requises pour atteindre l'objectif`);
}

// Étape 4: Optimisation de la stratégie
console.log('\nÉTAPE 4: OPTIMISATION DE LA STRATÉGIE\n');

// Voyons ce qui se passe si nous augmentons le cashflow par porte à 100$ au lieu de 75$
const optimizedModel = yearlyAcquisitionCalculator.generateAcquisitionModel({
  targetMonthlyIncome,
  cashflowPerDoor: 100, // Augmenté à 100$
  initialUnitCount: 4,
  unitCountIncrement: 1,
  initialPurchasePrice: 400000,
  pricePerUnit: 100000,
  downPaymentPercentage: 0.2,
  appreciationRate: 0.03,
  numberOfYears: 10
});

const optimizedProjection = yearlyAcquisitionCalculator.calculateYearlyAcquisitionStrategy(optimizedModel);

console.log('COMPARAISON DES STRATÉGIES:');
console.log(`Stratégie standard (75$/porte):
- Cashflow final: ${projection.summary.finalMonthlyCashflow.toLocaleString()}$
- Pourcentage de l'objectif atteint: ${(projection.summary.finalMonthlyCashflow / targetMonthlyIncome * 100).toFixed(1)}%
${projection.summary.targetAchieved 
  ? `- Objectif atteint en ${projection.summary.yearsToTarget} années` 
  : '- Objectif non atteint en 10 ans'}`);

console.log(`\nStratégie optimisée (100$/porte):
- Cashflow final: ${optimizedProjection.summary.finalMonthlyCashflow.toLocaleString()}$
- Pourcentage de l'objectif atteint: ${(optimizedProjection.summary.finalMonthlyCashflow / targetMonthlyIncome * 100).toFixed(1)}%
${optimizedProjection.summary.targetAchieved 
  ? `- Objectif atteint en ${optimizedProjection.summary.yearsToTarget} années` 
  : '- Objectif non atteint en 10 ans'}`);

console.log('\nCONCLUSION:');
console.log('Cette analyse montre l\'importance de maximiser le cashflow par porte pour atteindre plus rapidement les objectifs de revenu passif. En augmentant le cashflow par porte de 75$ à 100$, on peut significativement accélérer l\'atteinte de l\'objectif de revenus pour la retraite.');
