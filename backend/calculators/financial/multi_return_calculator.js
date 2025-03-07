/**
 * Calculateur de rendement MULTI détaillé
 * 
 * Ce module implémente un calculateur complet pour l'analyse des immeubles à revenus
 * selon la méthodologie des Secrets de l'immobilier. Il permet une analyse approfondie
 * des revenus, dépenses, cashflow et ratios financiers.
 */

/**
 * Structure des entrées pour le calculateur de rendement MULTI
 * @typedef {Object} MultiReturnInput
 * @property {PropertyInfo} propertyInfo - Informations générales sur la propriété
 * @property {RevenueDetails} revenueDetails - Détails des revenus
 * @property {ExpenseDetails} expenseDetails - Détails des dépenses
 * @property {FinancingDetails} financingDetails - Détails du financement
 * @property {OptimizationDetails} [optimizationDetails] - Détails des optimisations potentielles
 */

/**
 * Informations générales sur la propriété
 * @typedef {Object} PropertyInfo
 * @property {string} address - Adresse de la propriété
 * @property {number} purchasePrice - Prix d'achat
 * @property {number} unitCount - Nombre d'unités
 * @property {string} propertyType - Type de propriété (ex: "Plex", "Appartements", etc.)
 * @property {number} constructionYear - Année de construction
 * @property {number} [landValue] - Valeur du terrain (si disponible)
 * @property {number} [buildingValue] - Valeur du bâtiment (si disponible)
 * @property {number} [renovationBudget] - Budget de rénovation (si applicable)
 */

/**
 * Détails des revenus
 * @typedef {Object} RevenueDetails
 * @property {Array<UnitRevenue>} rentalUnits - Unités locatives avec leurs revenus
 * @property {Array<OtherRevenue>} [otherRevenues] - Autres sources de revenus
 */

/**
 * Revenus d'une unité locative
 * @typedef {Object} UnitRevenue
 * @property {string} unitId - Identifiant de l'unité (ex: "1A", "2B", etc.)
 * @property {string} unitType - Type d'unité (ex: "1½", "3½", "4½", etc.)
 * @property {number} monthlyRent - Loyer mensuel
 * @property {number} [annualRent] - Loyer annuel (calculé si non fourni)
 * @property {boolean} [isFurnished] - Indique si l'unité est meublée
 * @property {boolean} [includesElectricity] - Indique si l'électricité est incluse
 * @property {boolean} [includesHeating] - Indique si le chauffage est inclus
 * @property {boolean} [includesWater] - Indique si l'eau est incluse
 * @property {string} [leaseEndDate] - Date de fin du bail
 * @property {number} [marketRent] - Loyer potentiel au prix du marché
 * @property {boolean} [isVacant] - Indique si l'unité est vacante
 */

/**
 * Autres sources de revenus
 * @typedef {Object} OtherRevenue
 * @property {string} name - Nom de la source de revenu
 * @property {number} monthlyAmount - Montant mensuel
 * @property {number} [annualAmount] - Montant annuel (calculé si non fourni)
 * @property {string} [category] - Catégorie (ex: "Stationnement", "Buanderie", etc.)
 */

/**
 * Détails des dépenses
 * @typedef {Object} ExpenseDetails
 * @property {TaxExpenses} taxes - Dépenses liées aux taxes
 * @property {OperatingExpenses} operating - Dépenses d'exploitation
 * @property {MaintenanceExpenses} maintenance - Dépenses d'entretien
 * @property {ManagementExpenses} management - Dépenses de gestion
 * @property {Array<OtherExpense>} [otherExpenses] - Autres dépenses
 */

/**
 * Dépenses liées aux taxes
 * @typedef {Object} TaxExpenses
 * @property {number} municipalTax - Taxes municipales
 * @property {number} schoolTax - Taxes scolaires
 */

/**
 * Dépenses d'exploitation
 * @typedef {Object} OperatingExpenses
 * @property {number} electricity - Électricité
 * @property {number} heating - Chauffage
 * @property {number} insurance - Assurance
 * @property {number} water - Eau
 * @property {number} waste - Déchets et recyclage
 */

/**
 * Dépenses d'entretien
 * @typedef {Object} MaintenanceExpenses
 * @property {number} repairs - Réparations générales
 * @property {number} snowRemoval - Déneigement
 * @property {number} landscaping - Aménagement paysager
 * @property {number} renovations - Rénovations
 */

/**
 * Dépenses de gestion
 * @typedef {Object} ManagementExpenses
 * @property {number} propertyManagement - Gestion immobilière
 * @property {number} adminFees - Frais administratifs
 * @property {number} professionalFees - Honoraires professionnels
 * @property {number} vacancyRate - Taux d'inoccupation (en %)
 * @property {number} badDebtRate - Taux de mauvaises créances (en %)
 */

/**
 * Autre dépense
 * @typedef {Object} OtherExpense
 * @property {string} name - Nom de la dépense
 * @property {number} annualAmount - Montant annuel
 * @property {string} [category] - Catégorie
 */

/**
 * Détails du financement
 * @typedef {Object} FinancingDetails
 * @property {ConventionalMortgage} conventionalMortgage - Hypothèque conventionnelle
 * @property {Array<CreativeFinancing>} [creativeFinancing] - Financements créatifs
 */

/**
 * Hypothèque conventionnelle
 * @typedef {Object} ConventionalMortgage
 * @property {number} downPaymentPercentage - Pourcentage de mise de fonds (ex: 0.2 pour 20%)
 * @property {number} [downPaymentAmount] - Montant de la mise de fonds (calculé si non fourni)
 * @property {number} interestRate - Taux d'intérêt (ex: 0.05 pour 5%)
 * @property {number} amortizationYears - Période d'amortissement en années
 * @property {number} termYears - Terme en années
 */

/**
 * Financement créatif
 * @typedef {Object} CreativeFinancing
 * @property {string} type - Type de financement (ex: "BalanceDeVente", "LoveMoney", "Partenariat")
 * @property {number} amount - Montant
 * @property {number} interestRate - Taux d'intérêt
 * @property {number} termYears - Terme en années
 * @property {string} [lenderName] - Nom du prêteur
 * @property {Object} [additionalDetails] - Détails supplémentaires spécifiques au type
 */

/**
 * Détails des optimisations potentielles
 * @typedef {Object} OptimizationDetails
 * @property {Array<RentalOptimization>} [rentalOptimizations] - Optimisations des loyers
 * @property {Array<RevenueOptimization>} [revenueOptimizations] - Optimisations des revenus
 * @property {Array<ExpenseOptimization>} [expenseOptimizations] - Optimisations des dépenses
 */

/**
 * Optimisation d'un loyer
 * @typedef {Object} RentalOptimization
 * @property {string} unitId - Identifiant de l'unité
 * @property {number} currentRent - Loyer actuel
 * @property {number} potentialRent - Loyer potentiel
 * @property {number} [investmentRequired] - Investissement requis
 * @property {string} [description] - Description de l'optimisation
 */

/**
 * Optimisation d'un revenu
 * @typedef {Object} RevenueOptimization
 * @property {string} name - Nom de l'optimisation
 * @property {number} potentialRevenue - Revenu potentiel
 * @property {number} [investmentRequired] - Investissement requis
 * @property {string} [description] - Description de l'optimisation
 */

/**
 * Optimisation d'une dépense
 * @typedef {Object} ExpenseOptimization
 * @property {string} expenseCategory - Catégorie de dépense
 * @property {number} currentAmount - Montant actuel
 * @property {number} potentialAmount - Montant potentiel
 * @property {number} [investmentRequired] - Investissement requis
 * @property {string} [description] - Description de l'optimisation
 */

/**
 * Structure des résultats du calculateur de rendement MULTI
 * @typedef {Object} MultiReturnResult
 * @property {FinancialSummary} summary - Résumé financier
 * @property {RevenueAnalysis} revenueAnalysis - Analyse des revenus
 * @property {ExpenseAnalysis} expenseAnalysis - Analyse des dépenses
 * @property {FinancingAnalysis} financingAnalysis - Analyse du financement
 * @property {RatioAnalysis} ratioAnalysis - Analyse des ratios
 * @property {OptimizationAnalysis} [optimizationAnalysis] - Analyse des optimisations
 * @property {Array<string>} recommendations - Recommandations
 */

/**
 * Résumé financier
 * @typedef {Object} FinancialSummary
 * @property {number} totalGrossRevenue - Revenu brut total
 * @property {number} totalOperatingExpenses - Dépenses d'exploitation totales
 * @property {number} netOperatingIncome - Revenu net d'exploitation
 * @property {number} totalDebtService - Service de la dette total
 * @property {number} cashflow - Cashflow annuel
 * @property {number} monthlyCashflow - Cashflow mensuel
 * @property {number} cashflowPerUnit - Cashflow par unité
 * @property {number} cashflowPerDoor - Cashflow par porte par mois
 * @property {boolean} meetsMinimumCashflow - Atteint le cashflow minimum recommandé (50$/mois/porte)
 * @property {boolean} meetsTargetCashflow - Atteint le cashflow cible (75$/mois/porte)
 */

/**
 * Calcule les résultats financiers détaillés d'un immeuble à revenus
 * @param {MultiReturnInput} input - Données d'entrée pour le calcul
 * @returns {MultiReturnResult} - Résultats de l'analyse
 */
function calculateMultiReturn(input) {
  // Validation des entrées
  validateInput(input);
  
  // Extraction des données
  const { propertyInfo, revenueDetails, expenseDetails, financingDetails, optimizationDetails } = input;
  
  // Analyser les revenus
  const revenueAnalysis = analyzeRevenues(revenueDetails, propertyInfo);
  
  // Analyser les dépenses
  const expenseAnalysis = analyzeExpenses(expenseDetails, revenueAnalysis.totalGrossRevenue, propertyInfo);
  
  // Calculer le revenu net d'exploitation (NOI)
  const netOperatingIncome = revenueAnalysis.totalGrossRevenue - expenseAnalysis.totalExpenses;
  
  // Analyser le financement
  const financingAnalysis = analyzeFinancing(financingDetails, propertyInfo.purchasePrice, netOperatingIncome);
  
  // Calculer le cashflow
  const cashflow = netOperatingIncome - financingAnalysis.totalDebtService;
  const monthlyCashflow = cashflow / 12;
  const cashflowPerUnit = monthlyCashflow / propertyInfo.unitCount;
  
  // Créer le résumé financier
  const summary = {
    totalGrossRevenue: roundToTwo(revenueAnalysis.totalGrossRevenue),
    totalOperatingExpenses: roundToTwo(expenseAnalysis.totalExpenses),
    netOperatingIncome: roundToTwo(netOperatingIncome),
    totalDebtService: roundToTwo(financingAnalysis.totalDebtService),
    cashflow: roundToTwo(cashflow),
    monthlyCashflow: roundToTwo(monthlyCashflow),
    cashflowPerUnit: roundToTwo(cashflowPerUnit),
    cashflowPerDoor: roundToTwo(cashflowPerUnit), // Synonyme de cashflowPerUnit
    meetsMinimumCashflow: cashflowPerUnit >= 50, // 50$ minimum recommandé
    meetsTargetCashflow: cashflowPerUnit >= 75    // 75$ cible recommandée
  };
  
  // Analyser les ratios financiers
  const ratioAnalysis = calculateFinancialRatios(propertyInfo, revenueAnalysis, 
                                               expenseAnalysis, netOperatingIncome, financingAnalysis);
  
  // Analyser les optimisations si fournies
  let optimizationAnalysis = null;
  if (optimizationDetails) {
    optimizationAnalysis = analyzeOptimizations(optimizationDetails, revenueAnalysis, expenseAnalysis, propertyInfo);
  }
  
  // Générer des recommandations
  const recommendations = generateRecommendations(summary, ratioAnalysis, optimizationAnalysis);
  
  // Retourner les résultats complets
  return {
    summary,
    revenueAnalysis,
    expenseAnalysis,
    financingAnalysis,
    ratioAnalysis,
    optimizationAnalysis,
    recommendations
  };
}

/**
 * Valide les entrées du calculateur
 * @param {MultiReturnInput} input - Données d'entrée à valider
 * @throws {Error} Si les données sont invalides
 */
function validateInput(input) {
  if (!input) {
    throw new Error("Les données d'entrée sont requises");
  }
  
  // Valider les informations de la propriété
  if (!input.propertyInfo) {
    throw new Error("Les informations de la propriété sont requises");
  }
  
  if (!input.propertyInfo.purchasePrice || input.propertyInfo.purchasePrice <= 0) {
    throw new Error("Le prix d'achat doit être un nombre positif");
  }
  
  if (!input.propertyInfo.unitCount || input.propertyInfo.unitCount <= 0 || !Number.isInteger(input.propertyInfo.unitCount)) {
    throw new Error("Le nombre d'unités doit être un entier positif");
  }
  
  // Valider les détails des revenus
  if (!input.revenueDetails) {
    throw new Error("Les détails des revenus sont requis");
  }
  
  if (!input.revenueDetails.rentalUnits || !Array.isArray(input.revenueDetails.rentalUnits) || input.revenueDetails.rentalUnits.length === 0) {
    throw new Error("Au moins une unité locative doit être spécifiée");
  }
  
  // Valider les détails des dépenses
  if (!input.expenseDetails) {
    throw new Error("Les détails des dépenses sont requis");
  }
  
  // Valider les détails du financement
  if (!input.financingDetails) {
    throw new Error("Les détails du financement sont requis");
  }
  
  if (!input.financingDetails.conventionalMortgage) {
    throw new Error("Les détails de l'hypothèque conventionnelle sont requis");
  }
  
  if (!input.financingDetails.conventionalMortgage.downPaymentPercentage || 
      input.financingDetails.conventionalMortgage.downPaymentPercentage <= 0 || 
      input.financingDetails.conventionalMortgage.downPaymentPercentage >= 1) {
    throw new Error("Le pourcentage de mise de fonds doit être entre 0 et 1");
  }
  
  if (!input.financingDetails.conventionalMortgage.interestRate || 
      input.financingDetails.conventionalMortgage.interestRate <= 0 || 
      input.financingDetails.conventionalMortgage.interestRate >= 1) {
    throw new Error("Le taux d'intérêt doit être entre 0 et 1");
  }
  
  if (!input.financingDetails.conventionalMortgage.amortizationYears || 
      input.financingDetails.conventionalMortgage.amortizationYears <= 0) {
    throw new Error("La période d'amortissement doit être un nombre positif");
  }
}

/**
 * Analyse les revenus d'un immeuble
 * @param {RevenueDetails} revenueDetails - Détails des revenus
 * @param {PropertyInfo} propertyInfo - Informations sur la propriété
 * @returns {RevenueAnalysis} - Analyse des revenus
 */
function analyzeRevenues(revenueDetails, propertyInfo) {
  const { rentalUnits, otherRevenues = [] } = revenueDetails;
  
  // Calculer le revenu locatif total
  let totalRentalRevenue = 0;
  const enhancedRentalUnits = rentalUnits.map(unit => {
    const annualRent = unit.annualRent || unit.monthlyRent * 12;
    totalRentalRevenue += annualRent;
    
    return {
      ...unit,
      annualRent,
      isVacant: unit.isVacant || false
    };
  });
  
  // Calculer les autres revenus
  let totalOtherRevenue = 0;
  const enhancedOtherRevenues = otherRevenues.map(revenue => {
    const annualAmount = revenue.annualAmount || revenue.monthlyAmount * 12;
    totalOtherRevenue += annualAmount;
    
    return {
      ...revenue,
      annualAmount
    };
  });
  
  // Calculer le revenu brut potentiel
  const potentialGrossRevenue = totalRentalRevenue + totalOtherRevenue;
  
  // Calculer les revenus par catégorie
  const revenueByCategory = {};
  enhancedOtherRevenues.forEach(revenue => {
    const category = revenue.category || "Autre";
    revenueByCategory[category] = (revenueByCategory[category] || 0) + revenue.annualAmount;
  });
  
  // Calculer des statistiques sur les unités
  const vacantUnits = enhancedRentalUnits.filter(unit => unit.isVacant).length;
  const vacancyRate = propertyInfo.unitCount > 0 ? vacantUnits / propertyInfo.unitCount : 0;
  
  // Calculer le revenu par unité
  const avgRentPerUnit = propertyInfo.unitCount > 0 ? totalRentalRevenue / propertyInfo.unitCount : 0;
  
  // Calculer le potentiel d'augmentation des loyers
  let potentialRentIncrease = 0;
  enhancedRentalUnits.forEach(unit => {
    if (unit.marketRent && unit.marketRent > unit.monthlyRent) {
      potentialRentIncrease += (unit.marketRent - unit.monthlyRent) * 12;
    }
  });
  
  return {
    totalGrossRevenue: potentialGrossRevenue,
    totalRentalRevenue,
    totalOtherRevenue,
    rentalUnits: enhancedRentalUnits,
    otherRevenues: enhancedOtherRevenues,
    revenueByCategory,
    vacantUnits,
    vacancyRate,
    avgRentPerUnit,
    potentialRentIncrease,
    revenuePerSqFt: propertyInfo.buildingSize ? potentialGrossRevenue / propertyInfo.buildingSize : null
  };
}

/**
 * Analyse les dépenses d'un immeuble
 * @param {ExpenseDetails} expenseDetails - Détails des dépenses
 * @param {number} totalGrossRevenue - Revenu brut total
 * @param {PropertyInfo} propertyInfo - Informations sur la propriété
 * @returns {ExpenseAnalysis} - Analyse des dépenses
 */
function analyzeExpenses(expenseDetails, totalGrossRevenue, propertyInfo) {
  const { taxes, operating, maintenance, management, otherExpenses = [] } = expenseDetails;
  
  // Calculer le total des taxes
  const totalTaxes = (taxes.municipalTax || 0) + (taxes.schoolTax || 0);
  
  // Calculer le total des dépenses d'exploitation
  const totalOperating = (operating.electricity || 0) + 
                        (operating.heating || 0) + 
                        (operating.insurance || 0) + 
                        (operating.water || 0) + 
                        (operating.waste || 0);
  
  // Calculer le total des dépenses d'entretien
  const totalMaintenance = (maintenance.repairs || 0) + 
                          (maintenance.snowRemoval || 0) + 
                          (maintenance.landscaping || 0) + 
                          (maintenance.renovations || 0);
  
  // Calculer les pertes dues aux vacances et mauvaises créances
  const vacancyLoss = totalGrossRevenue * (management.vacancyRate || 0) / 100;
  const badDebtLoss = totalGrossRevenue * (management.badDebtRate || 0) / 100;
  
  // Calculer le total des dépenses de gestion
  const totalManagement = (management.propertyManagement || 0) + 
                         (management.adminFees || 0) + 
                         (management.professionalFees || 0) + 
                         vacancyLoss + 
                         badDebtLoss;
  
  // Calculer le total des autres dépenses
  let totalOtherExpenses = 0;
  otherExpenses.forEach(expense => {
    totalOtherExpenses += expense.annualAmount || 0;
  });
  
  // Calculer le total des dépenses
  const totalExpenses = totalTaxes + totalOperating + totalMaintenance + totalManagement + totalOtherExpenses;
  
  // Calculer le ratio dépenses/revenus
  const expenseRatio = totalGrossRevenue > 0 ? totalExpenses / totalGrossRevenue : 0;
  
  // Calculer les dépenses par unité
  const expensePerUnit = propertyInfo.unitCount > 0 ? totalExpenses / propertyInfo.unitCount : 0;
  
  return {
    totalExpenses,
    totalTaxes,
    totalOperating,
    totalMaintenance,
    totalManagement,
    totalOtherExpenses,
    vacancyLoss,
    badDebtLoss,
    expenseRatio,
    expensePerUnit,
    expenseDetails: {
      taxes,
      operating,
      maintenance,
      management: {
        ...management,
        vacancyLoss,
        badDebtLoss
      },
      otherExpenses
    },
    expensePerSqFt: propertyInfo.buildingSize ? totalExpenses / propertyInfo.buildingSize : null
  };
}

/**
 * Analyse le financement d'un immeuble
 * @param {FinancingDetails} financingDetails - Détails du financement
 * @param {number} purchasePrice - Prix d'achat
 * @param {number} netOperatingIncome - Revenu net d'exploitation
 * @returns {FinancingAnalysis} - Analyse du financement
 */
function analyzeFinancing(financingDetails, purchasePrice, netOperatingIncome) {
  const { conventionalMortgage, creativeFinancing = [] } = financingDetails;
  
  // Calculer le montant de la mise de fonds
  const downPaymentAmount = conventionalMortgage.downPaymentAmount || 
                           (purchasePrice * conventionalMortgage.downPaymentPercentage);
  
  // Calculer le montant du prêt conventionnel
  const conventionalLoanAmount = purchasePrice - downPaymentAmount;
  
  // Calculer le paiement hypothécaire conventionnel
  const conventionalMonthlyPayment = calculateMortgagePayment(
    conventionalLoanAmount,
    conventionalMortgage.interestRate,
    conventionalMortgage.amortizationYears
  );
  
  const conventionalAnnualPayment = conventionalMonthlyPayment * 12;
  
  // Calculer les paiements des financements créatifs
  let creativeFinancingPayments = [];
  let totalCreativeFinancingAmount = 0;
  let totalCreativeFinancingPayment = 0;
  
  creativeFinancing.forEach(financing => {
    const monthlyPayment = calculateMortgagePayment(
      financing.amount,
      financing.interestRate,
      financing.termYears
    );
    
    const annualPayment = monthlyPayment * 12;
    totalCreativeFinancingAmount += financing.amount;
    totalCreativeFinancingPayment += annualPayment;
    
    creativeFinancingPayments.push({
      ...financing,
      monthlyPayment,
      annualPayment
    });
  });
  
  // Calculer le service de la dette total
  const totalDebtService = conventionalAnnualPayment + totalCreativeFinancingPayment;
  
  // Calculer le ratio de couverture du service de la dette (DSCR)
  const debtServiceCoverageRatio = totalDebtService > 0 ? netOperatingIncome / totalDebtService : Infinity;
  
  // Calculer le ratio prêt-valeur (LTV)
  const loanToValueRatio = purchasePrice > 0 ? 
    (conventionalLoanAmount + totalCreativeFinancingAmount) / purchasePrice : 0;
  
  return {
    conventionalMortgage: {
      ...conventionalMortgage,
      downPaymentAmount,
      loanAmount: conventionalLoanAmount,
      monthlyPayment: conventionalMonthlyPayment,
      annualPayment: conventionalAnnualPayment
    },
    creativeFinancing: creativeFinancingPayments,
    totalLoanAmount: conventionalLoanAmount + totalCreativeFinancingAmount,
    totalDebtService,
    debtServiceCoverageRatio,
    loanToValueRatio
  };
}

/**
 * Calcule les ratios financiers importants
 * @param {PropertyInfo} propertyInfo - Informations sur la propriété
 * @param {RevenueAnalysis} revenueAnalysis - Analyse des revenus
 * @param {ExpenseAnalysis} expenseAnalysis - Analyse des dépenses
 * @param {number} netOperatingIncome - Revenu net d'exploitation
 * @param {FinancingAnalysis} financingAnalysis - Analyse du financement
 * @returns {RatioAnalysis} - Analyse des ratios
 */
function calculateFinancialRatios(propertyInfo, revenueAnalysis, expenseAnalysis, netOperatingIncome, financingAnalysis) {
  const { purchasePrice, renovationBudget = 0 } = propertyInfo;
  const totalInvestment = purchasePrice + renovationBudget;
  
  // Calculer le taux de capitalisation (Cap Rate)
  const capRate = totalInvestment > 0 ? (netOperatingIncome / totalInvestment) * 100 : 0;
  
  // Calculer le multiplicateur du revenu brut (GRM)
  const grossRentMultiplier = revenueAnalysis.totalRentalRevenue > 0 ? 
    totalInvestment / revenueAnalysis.totalRentalRevenue : 0;
  
  // Calculer le rendement sur investissement (ROI)
  const cashOnCash = financingAnalysis.conventionalMortgage.downPaymentAmount > 0 ? 
    (netOperatingIncome - financingAnalysis.totalDebtService) / 
    financingAnalysis.conventionalMortgage.downPaymentAmount * 100 : 0;
  
  // Calculer le taux global d'actualisation (TGA)
  // TGA = Taux de cap + % d'appréciation annuelle (estimé à 2% par défaut)
  const appreciationRate = 0.02; // 2% par défaut
  const tga = capRate / 100 + appreciationRate;
  
  return {
    capRate: roundToTwo(capRate),
    grossRentMultiplier: roundToTwo(grossRentMultiplier),
    cashOnCash: roundToTwo(cashOnCash),
    operatingExpenseRatio: roundToTwo(expenseAnalysis.expenseRatio * 100),
    debtServiceCoverageRatio: roundToTwo(financingAnalysis.debtServiceCoverageRatio),
    loanToValueRatio: roundToTwo(financingAnalysis.loanToValueRatio * 100),
    breakEvenRatio: roundToTwo(((expenseAnalysis.totalExpenses + financingAnalysis.totalDebtService) / 
                            revenueAnalysis.totalGrossRevenue) * 100),
    tga: roundToTwo(tga * 100)
  };
}

/**
 * Analyse les optimisations potentielles
 * @param {OptimizationDetails} optimizationDetails - Détails des optimisations
 * @param {RevenueAnalysis} revenueAnalysis - Analyse des revenus
 * @param {ExpenseAnalysis} expenseAnalysis - Analyse des dépenses
 * @param {PropertyInfo} propertyInfo - Informations sur la propriété
 * @returns {OptimizationAnalysis} - Analyse des optimisations
 */
function analyzeOptimizations(optimizationDetails, revenueAnalysis, expenseAnalysis, propertyInfo) {
  const { rentalOptimizations = [], revenueOptimizations = [], expenseOptimizations = [] } = optimizationDetails;
  
  // Calculer l'impact des optimisations de loyers
  let totalRentalOptimizationRevenue = 0;
  let totalRentalOptimizationInvestment = 0;
  
  rentalOptimizations.forEach(opt => {
    const annualIncrease = (opt.potentialRent - opt.currentRent) * 12;
    totalRentalOptimizationRevenue += annualIncrease;
    totalRentalOptimizationInvestment += opt.investmentRequired || 0;
  });
  
  // Calculer l'impact des optimisations de revenus
  let totalRevenueOptimizationRevenue = 0;
  let totalRevenueOptimizationInvestment = 0;
  
  revenueOptimizations.forEach(opt => {
    totalRevenueOptimizationRevenue += opt.potentialRevenue;
    totalRevenueOptimizationInvestment += opt.investmentRequired || 0;
  });
  
  // Calculer l'impact des optimisations de dépenses
  let totalExpenseOptimizationSavings = 0;
  let totalExpenseOptimizationInvestment = 0;
  
  expenseOptimizations.forEach(opt => {
    const annualSavings = opt.currentAmount - opt.potentialAmount;
    totalExpenseOptimizationSavings += annualSavings;
    totalExpenseOptimizationInvestment += opt.investmentRequired || 0;
  });
  
  // Calculer l'impact total
  const totalOptimizationRevenue = totalRentalOptimizationRevenue + 
                                 totalRevenueOptimizationRevenue + 
                                 totalExpenseOptimizationSavings;
  
  const totalOptimizationInvestment = totalRentalOptimizationInvestment + 
                                    totalRevenueOptimizationInvestment + 
                                    totalExpenseOptimizationInvestment;
  
  // Calculer le ROI des optimisations
  const optimizationROI = totalOptimizationInvestment > 0 ? 
    (totalOptimizationRevenue / totalOptimizationInvestment) * 100 : 0;
  
  // Calculer l'impact sur le cashflow par porte
  const optimizedCashflowPerDoor = totalOptimizationRevenue > 0 ? 
    totalOptimizationRevenue / 12 / propertyInfo.unitCount : 0;
  
  return {
    rentalOptimizations: {
      details: rentalOptimizations,
      totalRevenue: totalRentalOptimizationRevenue,
      totalInvestment: totalRentalOptimizationInvestment
    },
    revenueOptimizations: {
      details: revenueOptimizations,
      totalRevenue: totalRevenueOptimizationRevenue,
      totalInvestment: totalRevenueOptimizationInvestment
    },
    expenseOptimizations: {
      details: expenseOptimizations,
      totalSavings: totalExpenseOptimizationSavings,
      totalInvestment: totalExpenseOptimizationInvestment
    },
    totalOptimizationRevenue,
    totalOptimizationInvestment,
    optimizationROI,
    optimizedCashflowPerDoor,
    paybackPeriod: totalOptimizationRevenue > 0 ? 
      totalOptimizationInvestment / totalOptimizationRevenue : Infinity
  };
}

/**
 * Génère des recommandations basées sur l'analyse
 * @param {FinancialSummary} summary - Résumé financier
 * @param {RatioAnalysis} ratioAnalysis - Analyse des ratios
 * @param {OptimizationAnalysis} optimizationAnalysis - Analyse des optimisations
 * @returns {Array<string>} - Liste de recommandations
 */
function generateRecommendations(summary, ratioAnalysis, optimizationAnalysis) {
  const recommendations = [];
  
  // Recommandations basées sur le cashflow
  if (!summary.meetsMinimumCashflow) {
    recommendations.push("Le cashflow par porte est inférieur au minimum recommandé de 50$/mois. Considérez des optimisations pour augmenter les revenus ou réduire les dépenses.");
  } else if (!summary.meetsTargetCashflow) {
    recommendations.push("Le cashflow par porte est acceptable mais n'atteint pas la cible recommandée de 75$/mois. Examinez les possibilités d'optimisation pour améliorer la rentabilité.");
  }
  
  // Recommandations basées sur le taux de capitalisation
  if (ratioAnalysis.capRate < 5) {
    recommendations.push("Le taux de capitalisation est faible (< 5%). Cela pourrait indiquer que l'immeuble est surévalué ou que les revenus sont sous-optimisés.");
  }
  
  // Recommandations basées sur le ROI
  if (ratioAnalysis.cashOnCash < 8) {
    recommendations.push("Le rendement sur investissement est faible (< 8%). Examinez les possibilités de financement créatif ou d'optimisation pour améliorer ce ratio.");
  }
  
  // Recommandations basées sur le ratio dépenses/revenus
  if (ratioAnalysis.operatingExpenseRatio > 50) {
    recommendations.push("Le ratio dépenses/revenus est élevé (> 50%). Analysez les postes de dépenses pour identifier des opportunités de réduction des coûts.");
  }
  
  // Recommandations basées sur le DSCR
  if (ratioAnalysis.debtServiceCoverageRatio < 1.25) {
    recommendations.push("Le ratio de couverture du service de la dette est faible (< 1.25). Cela pourrait indiquer un risque financier élevé et des difficultés potentielles à obtenir du financement.");
  }
  
  // Recommandations basées sur le LTV
  if (ratioAnalysis.loanToValueRatio > 80) {
    recommendations.push("Le ratio prêt-valeur est élevé (> 80%). Cela pourrait limiter les options de refinancement futur et augmenter le risque financier.");
  }
  
  // Recommandations basées sur les optimisations
  if (optimizationAnalysis) {
    if (optimizationAnalysis.optimizationROI > 20) {
      recommendations.push(`Les optimisations identifiées offrent un excellent ROI de ${optimizationAnalysis.optimizationROI.toFixed(1)}%. Il est fortement recommandé de les mettre en œuvre.`);
    } else if (optimizationAnalysis.optimizationROI > 10) {
      recommendations.push(`Les optimisations identifiées offrent un bon ROI de ${optimizationAnalysis.optimizationROI.toFixed(1)}%. Considérez de les mettre en œuvre par ordre de priorité.`);
    }
    
    if (optimizationAnalysis.paybackPeriod < 2) {
      recommendations.push(`Le délai de récupération des investissements d'optimisation est excellent (< 2 ans). Ces améliorations devraient être prioritaires.`);
    }
    
    if (optimizationAnalysis.optimizedCashflowPerDoor > 25) {
      recommendations.push(`Les optimisations permettraient d'augmenter le cashflow de ${optimizationAnalysis.optimizedCashflowPerDoor.toFixed(2)}$ par porte par mois, ce qui est significatif.`);
    }
  }
  
  return recommendations;
}

/**
 * Calcule le paiement mensuel d'un prêt hypothécaire
 * @param {number} principal - Montant du prêt
 * @param {number} annualRate - Taux d'intérêt annuel (ex: 0.05 pour 5%)
 * @param {number} years - Durée du prêt en années
 * @returns {number} - Paiement mensuel
 */
function calculateMortgagePayment(principal, annualRate, years) {
  const monthlyRate = annualRate / 12;
  const numberOfPayments = years * 12;
  
  if (monthlyRate === 0) {
    return principal / numberOfPayments;
  }
  
  const payment = principal * (
    monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)
  ) / (
    Math.pow(1 + monthlyRate, numberOfPayments) - 1
  );
  
  return payment;
}

/**
 * Arrondit un nombre à deux décimales
 * @param {number} num - Nombre à arrondir
 * @returns {number} - Nombre arrondi
 */
function roundToTwo(num) {
  return Math.round(num * 100) / 100;
}

/**
 * Calcule la valeur future d'un immeuble
 * @param {Object} params - Paramètres de calcul
 * @param {number} params.initialValue - Valeur initiale
 * @param {number} params.appreciationRate - Taux d'appréciation annuel (ex: 0.03 pour 3%)
 * @param {number} params.years - Nombre d'années
 * @returns {number} - Valeur future
 */
function calculateFutureValue(params) {
  const { initialValue, appreciationRate, years } = params;
  
  if (!initialValue || initialValue <= 0) {
    throw new Error("La valeur initiale doit être un nombre positif");
  }
  
  if (appreciationRate === undefined || appreciationRate < 0) {
    throw new Error("Le taux d'appréciation doit être un nombre positif ou zéro");
  }
  
  if (!years || years <= 0) {
    throw new Error("Le nombre d'années doit être un nombre positif");
  }
  
  const futureValue = initialValue * Math.pow(1 + appreciationRate, years);
  
  return roundToTwo(futureValue);
}

module.exports = {
  calculateMultiReturn,
  calculateFutureValue
};
