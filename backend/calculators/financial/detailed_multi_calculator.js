/**
 * Calculateur de rendement MULTI complet
 * 
 * Module d'analyse détaillée de la rentabilité d'un immeuble à revenus, conforme à la méthodologie
 * "Secrets de l'immobilier". Ce calculateur avancé permet d'analyser en profondeur tous les aspects
 * financiers d'un investissement immobilier multi-logements, incluant les revenus détaillés,
 * les dépenses ventilées, les ratios financiers avancés et différentes structures de financement.
 */

/**
 * Structure complète d'un immeuble à revenus
 * @typedef {Object} DetailedMultiProperty
 * @property {string} [name] - Nom ou adresse de l'immeuble pour l'identification
 * @property {number} purchasePrice - Prix d'achat de l'immeuble
 * @property {number} closingCosts - Frais d'acquisition (notaire, taxe de bienvenue, inspection)
 * @property {number} renovationBudget - Budget initial de rénovation/optimisation
 * @property {number} unitCount - Nombre total d'unités (portes)
 * @property {Array<Unit>} units - Détails des unités individuelles (facultatif)
 * @property {RevenueDetails} revenues - Détails de tous les revenus
 * @property {ExpenseDetails} expenses - Détails de toutes les dépenses
 * @property {FinancingStructure} financing - Structure de financement
 * @property {Market} [market] - Données du marché (facultatif)
 */

/**
 * Structure d'une unité individuelle
 * @typedef {Object} Unit
 * @property {string} [id] - Identifiant de l'unité (ex: "Apt 1")
 * @property {string} [type] - Type d'unité (1½, 2½, 3½, etc.)
 * @property {number} [size] - Superficie en pieds carrés
 * @property {number} monthlyRent - Loyer mensuel actuel
 * @property {number} [marketRent] - Loyer potentiel au marché
 * @property {boolean} [isOccupied] - Si l'unité est occupée ou non
 * @property {string} [leaseEndDate] - Date de fin du bail (YYYY-MM-DD)
 * @property {boolean} [hasParking] - Si le stationnement est inclus
 * @property {boolean} [includesUtilities] - Si les services (chauffage, électricité) sont inclus
 */

/**
 * Structure détaillée des revenus
 * @typedef {Object} RevenueDetails
 * @property {number} baseRents - Revenus de base des loyers
 * @property {number} [parking] - Revenus des stationnements
 * @property {number} [laundry] - Revenus de buanderie
 * @property {number} [storage] - Revenus des espaces de rangement
 * @property {number} [commercial] - Revenus commerciaux (si applicable)
 * @property {number} [other] - Autres revenus
 * @property {Object} [potentialOptimization] - Optimisations potentielles des revenus
 * @property {number} [potentialOptimization.baseRents] - Potentiel d'augmentation des loyers de base
 * @property {number} [potentialOptimization.parking] - Potentiel d'augmentation des stationnements
 * @property {number} [potentialOptimization.laundry] - Potentiel d'augmentation de la buanderie
 * @property {number} [potentialOptimization.other] - Autres optimisations de revenus
 */

/**
 * Structure détaillée des dépenses
 * @typedef {Object} ExpenseDetails
 * @property {number} municipalTax - Taxes municipales
 * @property {number} [schoolTax] - Taxes scolaires
 * @property {number} insurance - Assurances
 * @property {number} [energy] - Énergie (électricité/chauffage)
 * @property {number} [water] - Eau
 * @property {number} [maintenance] - Entretien et réparations
 * @property {number} [management] - Frais de gestion immobilière
 * @property {number} [janitor] - Conciergerie
 * @property {number} [snowRemoval] - Déneigement
 * @property {number} [landscaping] - Entretien paysager
 * @property {number} [reserveFund] - Fonds de réserve
 * @property {number} [vacancyRate] - Taux d'inoccupation (pourcentage)
 * @property {number} [badDebtRate] - Taux de mauvaises créances (pourcentage)
 * @property {number} [other] - Autres dépenses
 * @property {Object} [potentialOptimization] - Optimisations potentielles des dépenses
 */

/**
 * Structure de financement
 * @typedef {Object} FinancingStructure
 * @property {Array<FinancingSource>} sources - Sources de financement
 * @property {number} [downPayment] - Mise de fonds totale
 * @property {number} [totalDebt] - Dette totale
 * @property {number} [debtServiceRatio] - Ratio de service de la dette
 * @property {number} [loanToValueRatio] - Ratio prêt-valeur
 */

/**
 * Source de financement individuelle
 * @typedef {Object} FinancingSource
 * @property {string} type - Type de financement ('bank', 'privateLoan', 'partnership', 'sellerFinancing')
 * @property {number} amount - Montant du financement
 * @property {number} interestRate - Taux d'intérêt annuel (pourcentage)
 * @property {number} term - Durée du prêt en années
 * @property {number} amortization - Période d'amortissement en années
 * @property {number} [paymentAmount] - Montant du paiement mensuel (calculé automatiquement si non fourni)
 * @property {number} [percentage] - Pourcentage du financement total
 * @property {Object} [additionalTerms] - Conditions supplémentaires spécifiques au type de financement
 */

/**
 * Données du marché
 * @typedef {Object} Market
 * @property {number} [vacancyRate] - Taux d'inoccupation du marché (pourcentage)
 * @property {number} [averageRentGrowth] - Croissance moyenne des loyers (pourcentage annuel)
 * @property {number} [averageAppreciation] - Appréciation moyenne des immeubles (pourcentage annuel)
 * @property {number} [averageCapRate] - Taux de capitalisation moyen du marché
 */

/**
 * Résultats de l'analyse détaillée
 * @typedef {Object} DetailedMultiAnalysisResult
 * @property {FinancialSummary} summary - Sommaire financier
 * @property {RevenueAnalysis} revenueAnalysis - Analyse des revenus
 * @property {ExpenseAnalysis} expenseAnalysis - Analyse des dépenses
 * @property {FinancingAnalysis} financingAnalysis - Analyse du financement
 * @property {InvestmentMetrics} investmentMetrics - Métriques d'investissement
 * @property {OptimizationOpportunities} [optimizationOpportunities] - Opportunités d'optimisation
 * @property {ProjectionResults} [projection] - Projections financières
 */

/**
 * Sommaire financier
 * @typedef {Object} FinancialSummary
 * @property {number} totalInvestment - Investissement total (prix d'achat + frais + rénovations)
 * @property {number} grossRevenue - Revenus bruts annuels
 * @property {number} grossOperatingIncome - Revenus d'exploitation bruts
 * @property {number} operatingExpenses - Dépenses d'exploitation totales
 * @property {number} netOperatingIncome - Revenus nets d'exploitation (NOI)
 * @property {number} annualDebtService - Service de la dette annuel
 * @property {number} cashflow - Flux de trésorerie annuel
 * @property {number} cashflowPerUnit - Flux de trésorerie mensuel par unité
 * @property {boolean} meetsCashflowTarget - Si le cashflow cible est atteint (75$/porte/mois)
 */

/**
 * Analyse des revenus
 * @typedef {Object} RevenueAnalysis
 * @property {number} totalRevenue - Revenus totaux
 * @property {Object} revenueBreakdown - Ventilation des revenus
 * @property {number} revenuePerUnit - Revenu moyen par unité
 * @property {number} revenuePerSqft - Revenu par pied carré
 * @property {number} [potentialRevenue] - Revenus potentiels après optimisation
 * @property {number} [revenueDelta] - Différence entre revenus actuels et potentiels
 */

/**
 * Analyse des dépenses
 * @typedef {Object} ExpenseAnalysis
 * @property {number} totalExpenses - Dépenses totales
 * @property {Object} expenseBreakdown - Ventilation des dépenses
 * @property {number} expensePerUnit - Dépense moyenne par unité
 * @property {number} expenseRatio - Ratio dépenses/revenus
 * @property {number} [potentialExpenses] - Dépenses potentielles après optimisation
 * @property {number} [expenseDelta] - Différence entre dépenses actuelles et potentielles
 */

/**
 * Analyse du financement
 * @typedef {Object} FinancingAnalysis
 * @property {number} totalDebt - Dette totale
 * @property {number} totalEquity - Équité totale
 * @property {Object} debtBreakdown - Ventilation de la dette par source
 * @property {number} weightedAverageInterestRate - Taux d'intérêt moyen pondéré
 * @property {number} debtServiceCoverageRatio - Ratio de couverture du service de la dette
 * @property {number} loanToValueRatio - Ratio prêt-valeur
 * @property {Object} monthlyPayments - Paiements mensuels par source
 * @property {Object} annualPayments - Paiements annuels par source
 */

/**
 * Métriques d'investissement
 * @typedef {Object} InvestmentMetrics
 * @property {number} capRate - Taux de capitalisation
 * @property {number} cashOnCashReturn - Rendement sur investissement en espèces
 * @property {number} grossRentMultiplier - Multiplicateur de loyer brut
 * @property {number} netIncomeMultiplier - Multiplicateur de revenu net
 * @property {number} operatingExpenseRatio - Ratio des dépenses d'exploitation
 * @property {number} breakEvenRatio - Ratio du point mort
 * @property {number} debtYield - Rendement de la dette
 * @property {number} equityYield - Rendement de l'équité
 * @property {number} totalReturnOnEquity - Rendement total sur l'équité
 * @property {number} [irr] - Taux de rendement interne
 * @property {string} globalAssessment - Évaluation globale
 */

/**
 * Opportunités d'optimisation
 * @typedef {Object} OptimizationOpportunities
 * @property {Array<Object>} revenueOptimizations - Optimisations des revenus
 * @property {Array<Object>} expenseOptimizations - Optimisations des dépenses
 * @property {Array<Object>} financingOptimizations - Optimisations du financement
 * @property {number} potentialAdditionalCashflow - Flux de trésorerie supplémentaire potentiel
 * @property {number} potentialImprovedCapRate - Taux de capitalisation amélioré potentiel
 */

/**
 * Projections financières
 * @typedef {Object} ProjectionResults
 * @property {Array<Object>} yearlyProjections - Projections annuelles
 * @property {number} projectedTotalReturn - Rendement total projeté
 * @property {number} projectedEquityGrowth - Croissance de l'équité projetée
 * @property {number} [exitValue] - Valeur de sortie estimée
 */

/**
 * Analyse détaillée d'un immeuble multi-logements
 * @param {DetailedMultiProperty} property - Données détaillées de la propriété
 * @param {Object} [options] - Options d'analyse supplémentaires
 * @param {boolean} [options.includeOptimizations=true] - Inclure les analyses d'optimisation
 * @param {boolean} [options.includeProjections=false] - Inclure les projections financières
 * @param {number} [options.projectionYears=5] - Nombre d'années pour les projections
 * @param {number} [options.exitCapRate] - Taux de capitalisation à la sortie
 * @param {number} [options.targetCashflowPerDoor=75] - Cashflow cible par porte ($/mois)
 * @returns {DetailedMultiAnalysisResult} - Résultats détaillés de l'analyse
 */
function analyzeMultiProperty(property, options = {}) {
  // Définir les options par défaut
  const defaultOptions = {
    includeOptimizations: true,
    includeProjections: false,
    projectionYears: 5,
    targetCashflowPerDoor: 75
  };
  
  const analysisOptions = { ...defaultOptions, ...options };
  
  // Valider les données d'entrée
  validatePropertyData(property);
  
  // Calculer les totaux de revenus et dépenses
  const totalRevenue = calculateTotalRevenue(property.revenues);
  const totalExpenses = calculateTotalExpenses(property.expenses, totalRevenue);
  const netOperatingIncome = totalRevenue - totalExpenses;
  
  // Analyser le financement
  const financingAnalysis = analyzeFinancing(property.financing, netOperatingIncome, property.purchasePrice);
  
  // Calculer le cashflow
  const cashflow = netOperatingIncome - financingAnalysis.annualDebtService;
  const cashflowPerUnit = property.unitCount > 0 ? cashflow / property.unitCount / 12 : 0;
  
  // Déterminer si le cashflow cible est atteint
  const meetsCashflowTarget = cashflowPerUnit >= analysisOptions.targetCashflowPerDoor;
  
  // Calculer l'investissement total
  const totalInvestment = property.purchasePrice + property.closingCosts + property.renovationBudget;
  
  // Créer le sommaire financier
  const financialSummary = {
    totalInvestment,
    grossRevenue: totalRevenue,
    grossOperatingIncome: totalRevenue,
    operatingExpenses: totalExpenses,
    netOperatingIncome,
    annualDebtService: financingAnalysis.annualDebtService,
    cashflow,
    cashflowPerUnit,
    meetsCashflowTarget
  };
  
  // Analyser les revenus
  const revenueAnalysis = analyzeRevenues(property.revenues, property.unitCount, property.units);
  
  // Analyser les dépenses
  const expenseAnalysis = analyzeExpenses(property.expenses, totalRevenue, property.unitCount);
  
  // Calculer les métriques d'investissement
  const investmentMetrics = calculateInvestmentMetrics(
    property.purchasePrice,
    totalInvestment,
    financingAnalysis.totalEquity,
    netOperatingIncome,
    cashflow,
    totalRevenue,
    totalExpenses,
    financingAnalysis.annualDebtService
  );
  
  // Résultats de l'analyse
  const analysisResult = {
    summary: financialSummary,
    revenueAnalysis,
    expenseAnalysis,
    financingAnalysis,
    investmentMetrics
  };
  
  // Analyser les opportunités d'optimisation si demandé
  if (analysisOptions.includeOptimizations && property.revenues.potentialOptimization) {
    analysisResult.optimizationOpportunities = analyzeOptimizationOpportunities(
      property,
      revenueAnalysis,
      expenseAnalysis,
      financingAnalysis,
      netOperatingIncome,
      cashflow
    );
  }
  
  // Générer des projections financières si demandé
  if (analysisOptions.includeProjections) {
    analysisResult.projection = generateFinancialProjections(
      property,
      financialSummary,
      financingAnalysis,
      analysisOptions.projectionYears,
      analysisOptions.exitCapRate
    );
  }
  
  return analysisResult;
}

/**
 * Valide les données de la propriété
 * @param {DetailedMultiProperty} property - Données de la propriété
 * @throws {Error} Si les données sont invalides
 */
function validatePropertyData(property) {
  if (!property) {
    throw new Error("Les données de la propriété sont requises");
  }
  
  if (!property.purchasePrice || property.purchasePrice <= 0) {
    throw new Error("Le prix d'achat doit être un nombre positif");
  }
  
  if (property.closingCosts === undefined || property.closingCosts < 0) {
    throw new Error("Les frais d'acquisition doivent être spécifiés et ne peuvent pas être négatifs");
  }
  
  if (property.renovationBudget === undefined || property.renovationBudget < 0) {
    throw new Error("Le budget de rénovation doit être spécifié et ne peut pas être négatif");
  }
  
  if (!property.unitCount || property.unitCount <= 0) {
    throw new Error("Le nombre d'unités doit être un nombre positif");
  }
  
  if (!property.revenues) {
    throw new Error("Les détails des revenus sont requis");
  }
  
  if (!property.revenues.baseRents || property.revenues.baseRents <= 0) {
    throw new Error("Les revenus de base des loyers doivent être un nombre positif");
  }
  
  if (!property.expenses) {
    throw new Error("Les détails des dépenses sont requis");
  }
  
  if (!property.expenses.municipalTax || property.expenses.municipalTax <= 0) {
    throw new Error("Les taxes municipales doivent être un nombre positif");
  }
  
  if (!property.expenses.insurance || property.expenses.insurance <= 0) {
    throw new Error("Les assurances doivent être un nombre positif");
  }
  
  if (!property.financing || !property.financing.sources || !Array.isArray(property.financing.sources) || property.financing.sources.length === 0) {
    throw new Error("Au moins une source de financement doit être spécifiée");
  }
  
  // Valider chaque source de financement
  property.financing.sources.forEach((source, index) => {
    if (!source.type) {
      throw new Error(`Le type de financement est requis pour la source #${index + 1}`);
    }
    
    if (!source.amount || source.amount <= 0) {
      throw new Error(`Le montant du financement doit être un nombre positif pour la source #${index + 1}`);
    }
    
    if (source.interestRate === undefined || source.interestRate < 0) {
      throw new Error(`Le taux d'intérêt doit être spécifié et ne peut pas être négatif pour la source #${index + 1}`);
    }
    
    if (!source.term || source.term <= 0) {
      throw new Error(`La durée du prêt doit être un nombre positif pour la source #${index + 1}`);
    }
    
    if (!source.amortization || source.amortization <= 0) {
      throw new Error(`La période d'amortissement doit être un nombre positif pour la source #${index + 1}`);
    }
  });
}

/**
 * Calcule le total des revenus
 * @param {RevenueDetails} revenues - Détails des revenus
 * @returns {number} - Total des revenus annuels
 */
function calculateTotalRevenue(revenues) {
  return (
    revenues.baseRents +
    (revenues.parking || 0) +
    (revenues.laundry || 0) +
    (revenues.storage || 0) +
    (revenues.commercial || 0) +
    (revenues.other || 0)
  );
}

/**
 * Calcule le total des dépenses
 * @param {ExpenseDetails} expenses - Détails des dépenses
 * @param {number} totalRevenue - Total des revenus annuels
 * @returns {number} - Total des dépenses annuelles
 */
function calculateTotalExpenses(expenses, totalRevenue) {
  // Calculer les dépenses fixes
  let totalExpenses = (
    expenses.municipalTax +
    (expenses.schoolTax || 0) +
    expenses.insurance +
    (expenses.energy || 0) +
    (expenses.water || 0) +
    (expenses.maintenance || 0) +
    (expenses.management || 0) +
    (expenses.janitor || 0) +
    (expenses.snowRemoval || 0) +
    (expenses.landscaping || 0) +
    (expenses.reserveFund || 0) +
    (expenses.other || 0)
  );
  
  // Ajouter les dépenses basées sur un pourcentage des revenus
  if (expenses.vacancyRate) {
    totalExpenses += totalRevenue * (expenses.vacancyRate / 100);
  }
  
  if (expenses.badDebtRate) {
    totalExpenses += totalRevenue * (expenses.badDebtRate / 100);
  }
  
  return totalExpenses;
}

/**
 * Analyse la structure de financement
 * @param {FinancingStructure} financing - Structure de financement
 * @param {number} netOperatingIncome - Revenu net d'exploitation
 * @param {number} purchasePrice - Prix d'achat
 * @returns {FinancingAnalysis} - Analyse détaillée du financement
 */
function analyzeFinancing(financing, netOperatingIncome, purchasePrice) {
  let totalDebt = 0;
  let totalMonthlyPayment = 0;
  let weightedInterestSum = 0;
  const debtBreakdown = {};
  const monthlyPayments = {};
  const annualPayments = {};
  
  // Calculer le total de la dette et les paiements mensuels pour chaque source
  financing.sources.forEach(source => {
    totalDebt += source.amount;
    
    // Calculer le paiement mensuel si non fourni
    let monthlyPayment = source.paymentAmount;
    if (!monthlyPayment) {
      const monthlyRate = source.interestRate / 100 / 12;
      const totalPayments = source.amortization * 12;
      
      // Formule du paiement mensuel: P = L[c(1+c)^n]/[(1+c)^n-1]
      if (monthlyRate > 0) {
        monthlyPayment = source.amount * 
          (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
          (Math.pow(1 + monthlyRate, totalPayments) - 1);
      } else {
        monthlyPayment = source.amount / totalPayments;
      }
    }
    
    totalMonthlyPayment += monthlyPayment;
    weightedInterestSum += source.amount * source.interestRate;
    
    debtBreakdown[source.type] = (debtBreakdown[source.type] || 0) + source.amount;
    monthlyPayments[source.type] = (monthlyPayments[source.type] || 0) + monthlyPayment;
    annualPayments[source.type] = (annualPayments[source.type] || 0) + (monthlyPayment * 12);
  });
  
  const annualDebtService = totalMonthlyPayment * 12;
  const weightedAverageInterestRate = totalDebt > 0 ? weightedInterestSum / totalDebt : 0;
  const debtServiceCoverageRatio = annualDebtService > 0 ? netOperatingIncome / annualDebtService : Infinity;
  const loanToValueRatio = purchasePrice > 0 ? totalDebt / purchasePrice * 100 : 0;
  const totalEquity = purchasePrice - totalDebt;
  
  return {
    totalDebt,
    totalEquity,
    debtBreakdown,
    weightedAverageInterestRate,
    annualDebtService,
    monthlyDebtService: totalMonthlyPayment,
    debtServiceCoverageRatio,
    loanToValueRatio,
    monthlyPayments,
    annualPayments
  };
}

/**
 * Analyse les revenus
 * @param {RevenueDetails} revenues - Détails des revenus
 * @param {number} unitCount - Nombre d'unités
 * @param {Array<Unit>} [units] - Détails des unités individuelles
 * @returns {RevenueAnalysis} - Analyse détaillée des revenus
 */
function analyzeRevenues(revenues, unitCount, units) {
  const totalRevenue = calculateTotalRevenue(revenues);
  
  // Calculer le revenu par unité
  const revenuePerUnit = unitCount > 0 ? totalRevenue / unitCount : 0;
  
  // Calculer le revenu par pied carré si les données sont disponibles
  let revenuePerSqft = null;
  if (units && units.length > 0) {
    const totalSqft = units.reduce((sum, unit) => sum + (unit.size || 0), 0);
    if (totalSqft > 0) {
      revenuePerSqft = totalRevenue / totalSqft;
    }
  }
  
  // Calculer les revenus potentiels après optimisation
  let potentialRevenue = null;
  let revenueDelta = null;
  
  if (revenues.potentialOptimization) {
    potentialRevenue = totalRevenue;
    
    if (revenues.potentialOptimization.baseRents) {
      potentialRevenue += revenues.potentialOptimization.baseRents;
    }
    
    if (revenues.potentialOptimization.parking) {
      potentialRevenue += revenues.potentialOptimization.parking;
    }
    
    if (revenues.potentialOptimization.laundry) {
      potentialRevenue += revenues.potentialOptimization.laundry;
    }
    
    if (revenues.potentialOptimization.other) {
      potentialRevenue += revenues.potentialOptimization.other;
    }
    
    revenueDelta = potentialRevenue - totalRevenue;
  }
  
  // Créer la ventilation des revenus
  const revenueBreakdown = {
    baseRents: {
      amount: revenues.baseRents,
      percentage: (revenues.baseRents / totalRevenue) * 100
    }
  };
  
  if (revenues.parking) {
    revenueBreakdown.parking = {
      amount: revenues.parking,
      percentage: (revenues.parking / totalRevenue) * 100
    };
  }
  
  if (revenues.laundry) {
    revenueBreakdown.laundry = {
      amount: revenues.laundry,
      percentage: (revenues.laundry / totalRevenue) * 100
    };
  }
  
  if (revenues.storage) {
    revenueBreakdown.storage = {
      amount: revenues.storage,
      percentage: (revenues.storage / totalRevenue) * 100
    };
  }
  
  if (revenues.commercial) {
    revenueBreakdown.commercial = {
      amount: revenues.commercial,
      percentage: (revenues.commercial / totalRevenue) * 100
    };
  }
  
  if (revenues.other) {
    revenueBreakdown.other = {
      amount: revenues.other,
      percentage: (revenues.other / totalRevenue) * 100
    };
  }
  
  return {
    totalRevenue,
    revenueBreakdown,
    revenuePerUnit,
    revenuePerSqft,
    potentialRevenue,
    revenueDelta
  };
}

/**
 * Analyse les dépenses
 * @param {ExpenseDetails} expenses - Détails des dépenses
 * @param {number} totalRevenue - Total des revenus
 * @param {number} unitCount - Nombre d'unités
 * @returns {ExpenseAnalysis} - Analyse détaillée des dépenses
 */
function analyzeExpenses(expenses, totalRevenue, unitCount) {
  const totalExpenses = calculateTotalExpenses(expenses, totalRevenue);
  const expenseRatio = totalRevenue > 0 ? (totalExpenses / totalRevenue) * 100 : 0;
  const expensePerUnit = unitCount > 0 ? totalExpenses / unitCount : 0;
  
  // Calculer les dépenses potentielles après optimisation
  let potentialExpenses = null;
  let expenseDelta = null;
  
  if (expenses.potentialOptimization) {
    potentialExpenses = totalExpenses;
    let savings = 0;
    
    Object.keys(expenses.potentialOptimization).forEach(key => {
      if (typeof expenses.potentialOptimization[key] === 'number') {
        savings += expenses.potentialOptimization[key];
      }
    });
    
    potentialExpenses -= savings;
    expenseDelta = totalExpenses - potentialExpenses;
  }
  
  // Créer la ventilation des dépenses
  const expenseBreakdown = {
    municipalTax: {
      amount: expenses.municipalTax,
      percentage: (expenses.municipalTax / totalExpenses) * 100
    },
    insurance: {
      amount: expenses.insurance,
      percentage: (expenses.insurance / totalExpenses) * 100
    }
  };
  
  if (expenses.schoolTax) {
    expenseBreakdown.schoolTax = {
      amount: expenses.schoolTax,
      percentage: (expenses.schoolTax / totalExpenses) * 100
    };
  }
  
  if (expenses.energy) {
    expenseBreakdown.energy = {
      amount: expenses.energy,
      percentage: (expenses.energy / totalExpenses) * 100
    };
  }
  
  if (expenses.water) {
    expenseBreakdown.water = {
      amount: expenses.water,
      percentage: (expenses.water / totalExpenses) * 100
    };
  }
  
  if (expenses.maintenance) {
    expenseBreakdown.maintenance = {
      amount: expenses.maintenance,
      percentage: (expenses.maintenance / totalExpenses) * 100
    };
  }
  
  if (expenses.management) {
    expenseBreakdown.management = {
      amount: expenses.management,
      percentage: (expenses.management / totalExpenses) * 100
    };
  }
  
  if (expenses.janitor) {
    expenseBreakdown.janitor = {
      amount: expenses.janitor,
      percentage: (expenses.janitor / totalExpenses) * 100
    };
  }
  
  if (expenses.snowRemoval) {
    expenseBreakdown.snowRemoval = {
      amount: expenses.snowRemoval,
      percentage: (expenses.snowRemoval / totalExpenses) * 100
    };
  }
  
  if (expenses.landscaping) {
    expenseBreakdown.landscaping = {
      amount: expenses.landscaping,
      percentage: (expenses.landscaping / totalExpenses) * 100
    };
  }
  
  if (expenses.reserveFund) {
    expenseBreakdown.reserveFund = {
      amount: expenses.reserveFund,
      percentage: (expenses.reserveFund / totalExpenses) * 100
    };
  }
  
  if (expenses.other) {
    expenseBreakdown.other = {
      amount: expenses.other,
      percentage: (expenses.other / totalExpenses) * 100
    };
  }
  
  // Ajouter les dépenses basées sur un pourcentage
  if (expenses.vacancyRate) {
    const vacancyAmount = totalRevenue * (expenses.vacancyRate / 100);
    expenseBreakdown.vacancy = {
      amount: vacancyAmount,
      percentage: (vacancyAmount / totalExpenses) * 100,
      rate: expenses.vacancyRate
    };
  }
  
  if (expenses.badDebtRate) {
    const badDebtAmount = totalRevenue * (expenses.badDebtRate / 100);
    expenseBreakdown.badDebt = {
      amount: badDebtAmount,
      percentage: (badDebtAmount / totalExpenses) * 100,
      rate: expenses.badDebtRate
    };
  }
  
  return {
    totalExpenses,
    expenseBreakdown,
    expensePerUnit,
    expenseRatio,
    potentialExpenses,
    expenseDelta
  };
}

/**
 * Calcule les métriques d'investissement
 * @param {number} purchasePrice - Prix d'achat
 * @param {number} totalInvestment - Investissement total
 * @param {number} equity - Équité
 * @param {number} noi - Revenu net d'exploitation
 * @param {number} cashflow - Flux de trésorerie
 * @param {number} grossRevenue - Revenus bruts
 * @param {number} operatingExpenses - Dépenses d'exploitation
 * @param {number} debtService - Service de la dette
 * @returns {InvestmentMetrics} - Métriques d'investissement
 */
function calculateInvestmentMetrics(
  purchasePrice,
  totalInvestment,
  equity,
  noi,
  cashflow,
  grossRevenue,
  operatingExpenses,
  debtService
) {
  // Taux de capitalisation (CAP Rate)
  const capRate = purchasePrice > 0 ? (noi / purchasePrice) * 100 : 0;
  
  // Rendement sur investissement en espèces (Cash-on-Cash Return)
  const cashOnCashReturn = equity > 0 ? (cashflow / equity) * 100 : 0;
  
  // Multiplicateur de loyer brut (GRM)
  const grossRentMultiplier = grossRevenue > 0 ? purchasePrice / grossRevenue : 0;
  
  // Multiplicateur de revenu net (NIM)
  const netIncomeMultiplier = noi > 0 ? purchasePrice / noi : 0;
  
  // Ratio des dépenses d'exploitation (OER)
  const operatingExpenseRatio = grossRevenue > 0 ? (operatingExpenses / grossRevenue) * 100 : 0;
  
  // Ratio du point mort (BER)
  const breakEvenRatio = grossRevenue > 0 ? ((operatingExpenses + debtService) / grossRevenue) * 100 : 0;
  
  // Rendement de la dette (Debt Yield)
  const debtService1stYear = debtService; // Pour la première année
  const debtYield = totalInvestment - equity > 0 ? (noi / (totalInvestment - equity)) * 100 : 0;
  
  // Rendement de l'équité (Equity Yield)
  // Supposons une appréciation annuelle de 3%
  const annualAppreciation = 0.03;
  const equityGrowth = purchasePrice * annualAppreciation;
  const equityYield = equity > 0 ? (cashflow / equity) * 100 : 0;
  
  // Rendement total sur l'équité
  const totalReturnOnEquity = equity > 0 ? ((cashflow + equityGrowth) / equity) * 100 : 0;
  
  // Évaluation globale
  let globalAssessment = "POOR";
  if (capRate >= 7 && cashOnCashReturn >= 10) {
    globalAssessment = "EXCELLENT";
  } else if (capRate >= 6 && cashOnCashReturn >= 8) {
    globalAssessment = "GOOD";
  } else if (capRate >= 4.5 && cashOnCashReturn >= 6) {
    globalAssessment = "ACCEPTABLE";
  }
  
  return {
    capRate,
    cashOnCashReturn,
    grossRentMultiplier,
    netIncomeMultiplier,
    operatingExpenseRatio,
    breakEvenRatio,
    debtYield,
    equityYield,
    totalReturnOnEquity,
    globalAssessment
  };
}

/**
 * Analyse les opportunités d'optimisation
 * @param {DetailedMultiProperty} property - Données de la propriété
 * @param {RevenueAnalysis} revenueAnalysis - Analyse des revenus
 * @param {ExpenseAnalysis} expenseAnalysis - Analyse des dépenses
 * @param {FinancingAnalysis} financingAnalysis - Analyse du financement
 * @param {number} currentNOI - Revenu net d'exploitation actuel
 * @param {number} currentCashflow - Flux de trésorerie actuel
 * @returns {OptimizationOpportunities} - Opportunités d'optimisation
 */
function analyzeOptimizationOpportunities(
  property,
  revenueAnalysis,
  expenseAnalysis,
  financingAnalysis,
  currentNOI,
  currentCashflow
) {
  const revenueOptimizations = [];
  const expenseOptimizations = [];
  const financingOptimizations = [];
  
  let potentialAdditionalNOI = 0;
  let potentialAdditionalCashflow = 0;
  
  // Analyser les optimisations de revenus
  if (property.revenues.potentialOptimization) {
    if (property.revenues.potentialOptimization.baseRents) {
      revenueOptimizations.push({
        type: 'baseRents',
        description: 'Augmentation des loyers de base',
        currentAmount: property.revenues.baseRents,
        potentialAmount: property.revenues.baseRents + property.revenues.potentialOptimization.baseRents,
        additionalIncome: property.revenues.potentialOptimization.baseRents
      });
      potentialAdditionalNOI += property.revenues.potentialOptimization.baseRents;
    }
    
    if (property.revenues.potentialOptimization.parking) {
      revenueOptimizations.push({
        type: 'parking',
        description: 'Optimisation des revenus de stationnement',
        currentAmount: property.revenues.parking || 0,
        potentialAmount: (property.revenues.parking || 0) + property.revenues.potentialOptimization.parking,
        additionalIncome: property.revenues.potentialOptimization.parking
      });
      potentialAdditionalNOI += property.revenues.potentialOptimization.parking;
    }
    
    if (property.revenues.potentialOptimization.laundry) {
      revenueOptimizations.push({
        type: 'laundry',
        description: 'Optimisation des revenus de buanderie',
        currentAmount: property.revenues.laundry || 0,
        potentialAmount: (property.revenues.laundry || 0) + property.revenues.potentialOptimization.laundry,
        additionalIncome: property.revenues.potentialOptimization.laundry
      });
      potentialAdditionalNOI += property.revenues.potentialOptimization.laundry;
    }
    
    if (property.revenues.potentialOptimization.other) {
      revenueOptimizations.push({
        type: 'other',
        description: 'Autres optimisations de revenus',
        currentAmount: property.revenues.other || 0,
        potentialAmount: (property.revenues.other || 0) + property.revenues.potentialOptimization.other,
        additionalIncome: property.revenues.potentialOptimization.other
      });
      potentialAdditionalNOI += property.revenues.potentialOptimization.other;
    }
  }
  
  // Analyser les optimisations de dépenses
  if (property.expenses.potentialOptimization) {
    Object.keys(property.expenses.potentialOptimization).forEach(key => {
      if (typeof property.expenses.potentialOptimization[key] === 'number' && key in property.expenses) {
        const saving = property.expenses.potentialOptimization[key];
        if (saving > 0) {
          expenseOptimizations.push({
            type: key,
            description: `Réduction des dépenses: ${key}`,
            currentAmount: property.expenses[key],
            potentialAmount: property.expenses[key] - saving,
            saving
          });
          potentialAdditionalNOI += saving;
        }
      }
    });
  }
  
  // Analyser les optimisations de financement
  // Par exemple, si on peut refinancer à un meilleur taux
  // Cela n'affecte pas le NOI mais améliore le cashflow
  const refinancingPotential = property.financing.sources.some(source => 
    source.type === 'bank' && source.interestRate > 4.5
  );
  
  if (refinancingPotential) {
    // Simuler un refinancement à 4.5%
    const currentBankSources = property.financing.sources.filter(source => source.type === 'bank');
    let potentialSaving = 0;
    
    currentBankSources.forEach(source => {
      if (source.interestRate > 4.5) {
        const currentMonthlyRate = source.interestRate / 100 / 12;
        const potentialMonthlyRate = 4.5 / 100 / 12;
        const totalPayments = source.amortization * 12;
        
        const currentMonthlyPayment = source.amount * 
          (currentMonthlyRate * Math.pow(1 + currentMonthlyRate, totalPayments)) /
          (Math.pow(1 + currentMonthlyRate, totalPayments) - 1);
        
        const potentialMonthlyPayment = source.amount * 
          (potentialMonthlyRate * Math.pow(1 + potentialMonthlyRate, totalPayments)) /
          (Math.pow(1 + potentialMonthlyRate, totalPayments) - 1);
        
        const monthlySaving = currentMonthlyPayment - potentialMonthlyPayment;
        const annualSaving = monthlySaving * 12;
        
        financingOptimizations.push({
          type: 'refinancing',
          description: `Refinancement à taux réduit (${source.interestRate}% → 4.5%)`,
          currentInterestRate: source.interestRate,
          potentialInterestRate: 4.5,
          loanAmount: source.amount,
          annualSaving
        });
        
        potentialSaving += annualSaving;
      }
    });
    
    potentialAdditionalCashflow += potentialSaving;
  }
  
  // Calculer le NOI et le cashflow optimisés
  const potentialNOI = currentNOI + potentialAdditionalNOI;
  potentialAdditionalCashflow += potentialAdditionalNOI;
  const potentialCashflow = currentCashflow + potentialAdditionalCashflow;
  
  // Calculer le taux de capitalisation amélioré potentiel
  const potentialCapRate = property.purchasePrice > 0 ? (potentialNOI / property.purchasePrice) * 100 : 0;
  
  return {
    revenueOptimizations,
    expenseOptimizations,
    financingOptimizations,
    potentialNOI,
    potentialCashflow,
    potentialAdditionalNOI,
    potentialAdditionalCashflow,
    potentialImprovedCapRate: potentialCapRate,
    improvementImpact: {
      noiImprovement: potentialAdditionalNOI > 0 ? (potentialAdditionalNOI / currentNOI) * 100 : 0,
      cashflowImprovement: potentialAdditionalCashflow > 0 ? (potentialAdditionalCashflow / currentCashflow) * 100 : 0,
      capRateImprovement: potentialCapRate - (currentNOI / property.purchasePrice * 100)
    }
  };
}

/**
 * Génère des projections financières
 * @param {DetailedMultiProperty} property - Données de la propriété
 * @param {FinancialSummary} financialSummary - Sommaire financier
 * @param {FinancingAnalysis} financingAnalysis - Analyse du financement
 * @param {number} projectionYears - Nombre d'années pour les projections
 * @param {number} [exitCapRate] - Taux de capitalisation à la sortie
 * @returns {ProjectionResults} - Résultats des projections
 */
function generateFinancialProjections(property, financialSummary, financingAnalysis, projectionYears, exitCapRate) {
  // Paramètres par défaut pour les projections
  const rentGrowth = property.market && property.market.averageRentGrowth 
    ? property.market.averageRentGrowth / 100 
    : 0.02; // 2% par défaut
  
  const expenseGrowth = 0.025; // 2.5% par défaut
  const propertyAppreciation = property.market && property.market.averageAppreciation 
    ? property.market.averageAppreciation / 100 
    : 0.03; // 3% par défaut
  
  const exitCapRateValue = exitCapRate || (property.market && property.market.averageCapRate 
    ? property.market.averageCapRate / 100 
    : 0.06); // 6% par défaut
  
  const yearlyProjections = [];
  let cumulativeEquityGrowth = 0;
  
  // Valeurs initiales
  let currentPropertyValue = property.purchasePrice;
  let currentGrossRevenue = financialSummary.grossRevenue;
  let currentOperatingExpenses = financialSummary.operatingExpenses;
  let currentNOI = financialSummary.netOperatingIncome;
  let currentDebtService = financialSummary.annualDebtService;
  let currentCashflow = financialSummary.cashflow;
  let remainingDebt = financingAnalysis.totalDebt;
  let currentEquity = financingAnalysis.totalEquity;
  
  // Générer les projections année par année
  for (let year = 1; year <= projectionYears; year++) {
    // Calculer l'appréciation de la propriété
    const propertyValueGrowth = currentPropertyValue * propertyAppreciation;
    currentPropertyValue += propertyValueGrowth;
    
    // Calculer la croissance des revenus
    const revenueGrowth = currentGrossRevenue * rentGrowth;
    currentGrossRevenue += revenueGrowth;
    
    // Calculer la croissance des dépenses
    const expenseIncrease = currentOperatingExpenses * expenseGrowth;
    currentOperatingExpenses += expenseIncrease;
    
    // Calculer le nouveau NOI
    currentNOI = currentGrossRevenue - currentOperatingExpenses;
    
    // Le service de la dette reste constant (prêts à taux fixe)
    // mais on réduit le capital chaque année (approximation simplifiée)
    const debtPrincipalReduction = remainingDebt * 0.02; // Environ 2% du capital remboursé par an
    remainingDebt -= debtPrincipalReduction;
    
    // Mise à jour de l'équité
    const equityGrowth = propertyValueGrowth + debtPrincipalReduction;
    currentEquity += equityGrowth;
    cumulativeEquityGrowth += equityGrowth;
    
    // Mise à jour du cashflow
    currentCashflow = currentNOI - currentDebtService;
    
    // Calcul des nouveaux ratios
    const currentCapRate = currentPropertyValue > 0 ? (currentNOI / currentPropertyValue) * 100 : 0;
    const currentLTV = currentPropertyValue > 0 ? (remainingDebt / currentPropertyValue) * 100 : 0;
    const cashOnCashReturn = financingAnalysis.totalEquity > 0 ? (currentCashflow / financingAnalysis.totalEquity) * 100 : 0;
    
    // Ajouter la projection pour cette année
    yearlyProjections.push({
      year,
      propertyValue: roundToTwo(currentPropertyValue),
      grossRevenue: roundToTwo(currentGrossRevenue),
      operatingExpenses: roundToTwo(currentOperatingExpenses),
      noi: roundToTwo(currentNOI),
      debtService: roundToTwo(currentDebtService),
      cashflow: roundToTwo(currentCashflow),
      remainingDebt: roundToTwo(remainingDebt),
      equity: roundToTwo(currentEquity),
      capRate: roundToTwo(currentCapRate),
      loanToValueRatio: roundToTwo(currentLTV),
      cashOnCashReturn: roundToTwo(cashOnCashReturn),
      equityGrowth: roundToTwo(equityGrowth)
    });
  }
  
  // Calculer la valeur de sortie estimée
  const exitValue = currentNOI / exitCapRateValue;
  
  // Calculer le rendement total projeté
  const totalInvestment = property.purchasePrice + property.closingCosts + property.renovationBudget;
  const initialEquity = totalInvestment - financingAnalysis.totalDebt;
  const projectedTotalReturn = initialEquity > 0 ? (cumulativeEquityGrowth / initialEquity) * 100 : 0;
  
  return {
    yearlyProjections,
    projectedTotalReturn: roundToTwo(projectedTotalReturn),
    projectedEquityGrowth: roundToTwo(cumulativeEquityGrowth),
    exitValue: roundToTwo(exitValue),
    exitCapRate: exitCapRateValue * 100,
    initialEquity: roundToTwo(initialEquity),
    finalEquity: roundToTwo(currentEquity),
    equityMultiple: roundToTwo(currentEquity / initialEquity)
  };
}

/**
 * Calcule le prix d'achat maximum pour atteindre un cashflow cible
 * @param {Object} params - Paramètres de calcul
 * @param {DetailedMultiProperty} params.propertyTemplate - Modèle de propriété avec toutes les caractéristiques
 * @param {number} params.targetCashflowPerDoor - Cashflow cible par porte par mois
 * @returns {Object} - Prix d'achat maximum et détails du calcul
 */
function calculateMaxPurchasePrice(params) {
  const { propertyTemplate, targetCashflowPerDoor = 75 } = params;
  
  if (!propertyTemplate) {
    throw new Error("Un modèle de propriété est requis");
  }
  
  // Extraire les données nécessaires du modèle
  const { unitCount, revenues, expenses, financing } = propertyTemplate;
  
  // Calculer les revenus et dépenses
  const totalRevenue = calculateTotalRevenue(revenues);
  const operatingExpenses = calculateTotalExpenses(expenses, totalRevenue);
  
  // Calculer le NOI
  const noi = totalRevenue - operatingExpenses;
  
  // Calculer le cashflow cible annuel
  const targetAnnualCashflow = targetCashflowPerDoor * unitCount * 12;
  
  // Calculer le service de la dette maximum possible
  const maxDebtService = noi - targetAnnualCashflow;
  
  // Si le service de la dette maximum est négatif, c'est impossible d'atteindre le cashflow cible
  if (maxDebtService <= 0) {
    throw new Error("Impossible d'atteindre le cashflow cible avec ces revenus et dépenses. Augmentez les revenus ou réduisez les dépenses.");
  }
  
  // Calculer le montant maximum de la dette
  // En se basant sur la formule inverse du paiement hypothécaire
  const weightedRate = financing.sources.reduce((sum, source) => {
    return sum + (source.interestRate / 100) * (source.percentage || (source.amount / financing.totalDebt));
  }, 0);
  
  const monthlyRate = weightedRate / 12;
  const weightedAmortization = financing.sources.reduce((sum, source) => {
    return sum + source.amortization * (source.percentage || (source.amount / financing.totalDebt));
  }, 0);
  
  const totalPayments = weightedAmortization * 12;
  
  let maxDebt;
  if (monthlyRate > 0) {
    maxDebt = (maxDebtService / 12) * 
      (Math.pow(1 + monthlyRate, totalPayments) - 1) /
      (monthlyRate * Math.pow(1 + monthlyRate, totalPayments));
  } else {
    maxDebt = (maxDebtService / 12) * totalPayments;
  }
  
  // Calculer le prix d'achat maximum
  const downPaymentPercentage = financing.sources.reduce((sum, source) => {
    return sum + (source.type === 'downPayment' ? (source.percentage || (source.amount / (source.amount + maxDebt))) : 0);
  }, 0) || 0.2; // 20% par défaut
  
  const maxPurchasePrice = maxDebt / (1 - downPaymentPercentage);
  
  // Ajuster pour les frais d'acquisition et de rénovation
  const closingCostPercentage = propertyTemplate.closingCosts / propertyTemplate.purchasePrice;
  const renovationRatio = propertyTemplate.renovationBudget / propertyTemplate.purchasePrice;
  
  const adjustedMaxPurchasePrice = maxPurchasePrice / (1 + closingCostPercentage + renovationRatio);
  
  return {
    maxPurchasePrice: roundToTwo(adjustedMaxPurchasePrice),
    maxDebt: roundToTwo(maxDebt),
    noi: roundToTwo(noi),
    targetAnnualCashflow: roundToTwo(targetAnnualCashflow),
    maxDebtService: roundToTwo(maxDebtService),
    downPaymentPercentage: roundToTwo(downPaymentPercentage * 100),
    estimatedCapRate: roundToTwo((noi / adjustedMaxPurchasePrice) * 100)
  };
}

/**
 * Analyse de sensibilité pour un immeuble à revenus
 * @param {DetailedMultiProperty} property - Données de base de la propriété
 * @param {Object} scenarios - Scénarios de variation
 * @param {Array<number>} [scenarios.purchasePrice] - Variations du prix d'achat (%)
 * @param {Array<number>} [scenarios.baseRents] - Variations des loyers de base (%)
 * @param {Array<number>} [scenarios.operatingExpenses] - Variations des dépenses d'exploitation (%)
 * @param {Array<number>} [scenarios.interestRate] - Variations du taux d'intérêt (points de pourcentage)
 * @returns {Object} - Résultats de l'analyse de sensibilité
 */
function performSensitivityAnalysis(property, scenarios = {}) {
  // Valeurs par défaut pour les scénarios
  const defaultScenarios = {
    purchasePrice: [-5, 0, 5],
    baseRents: [-5, 0, 5],
    operatingExpenses: [-5, 0, 5],
    interestRate: [-0.5, 0, 0.5]
  };
  
  const analysisScenarios = { ...defaultScenarios, ...scenarios };
  
  // Analyse de base
  const baseAnalysis = analyzeMultiProperty(property);
  
  const results = {
    baseCase: baseAnalysis,
    scenarios: []
  };
  
  // Analyser les variations de prix d'achat
  analysisScenarios.purchasePrice.forEach(variation => {
    if (variation === 0) return; // Ignorer le cas de base
    
    const newProperty = JSON.parse(JSON.stringify(property)); // Cloner l'objet
    newProperty.purchasePrice = property.purchasePrice * (1 + variation / 100);
    
    const analysis = analyzeMultiProperty(newProperty);
    
    results.scenarios.push({
      type: 'purchasePrice',
      variation: `${variation > 0 ? '+' : ''}${variation}%`,
      description: `Prix d'achat: ${property.purchasePrice.toLocaleString()}$ → ${newProperty.purchasePrice.toLocaleString()}$`,
      result: analysis
    });
  });
  
  // Analyser les variations de loyers
  analysisScenarios.baseRents.forEach(variation => {
    if (variation === 0) return;
    
    const newProperty = JSON.parse(JSON.stringify(property));
    newProperty.revenues.baseRents = property.revenues.baseRents * (1 + variation / 100);
    
    const analysis = analyzeMultiProperty(newProperty);
    
    results.scenarios.push({
      type: 'baseRents',
      variation: `${variation > 0 ? '+' : ''}${variation}%`,
      description: `Loyers: ${property.revenues.baseRents.toLocaleString()}$ → ${newProperty.revenues.baseRents.toLocaleString()}$`,
      result: analysis
    });
  });
  
  // Analyser les variations de dépenses
  analysisScenarios.operatingExpenses.forEach(variation => {
    if (variation === 0) return;
    
    const newProperty = JSON.parse(JSON.stringify(property));
    
    // Ajuster chaque dépense individuellement
    Object.keys(newProperty.expenses).forEach(key => {
      if (typeof newProperty.expenses[key] === 'number' && key !== 'vacancyRate' && key !== 'badDebtRate') {
        newProperty.expenses[key] = property.expenses[key] * (1 + variation / 100);
      }
    });
    
    const analysis = analyzeMultiProperty(newProperty);
    
    results.scenarios.push({
      type: 'operatingExpenses',
      variation: `${variation > 0 ? '+' : ''}${variation}%`,
      description: `Dépenses d'exploitation: ${baseAnalysis.expenseAnalysis.totalExpenses.toLocaleString()}$ → ${analysis.expenseAnalysis.totalExpenses.toLocaleString()}$`,
      result: analysis
    });
  });
  
  // Analyser les variations de taux d'intérêt
  analysisScenarios.interestRate.forEach(variation => {
    if (variation === 0) return;
    
    const newProperty = JSON.parse(JSON.stringify(property));
    
    // Ajuster le taux d'intérêt de chaque source de financement bancaire
    newProperty.financing.sources.forEach(source => {
      if (source.type === 'bank') {
        source.interestRate = property.financing.sources.find(s => s.type === source.type && s.amount === source.amount).interestRate + variation;
      }
    });
    
    const analysis = analyzeMultiProperty(newProperty);
    
    results.scenarios.push({
      type: 'interestRate',
      variation: `${variation > 0 ? '+' : ''}${variation} points`,
      description: `Taux d'intérêt bancaire: ${variation > 0 ? '+' : ''}${variation} points de pourcentage`,
      result: analysis
    });
  });
  
  // Trier les scénarios par impact sur le cashflow
  results.scenarios.sort((a, b) => 
    b.result.summary.cashflowPerUnit - a.result.summary.cashflowPerUnit
  );
  
  return results;
}

/**
 * Arrondit un nombre à deux décimales
 * @param {number} num - Nombre à arrondir
 * @returns {number} - Nombre arrondi
 */
function roundToTwo(num) {
  return Math.round(num * 100) / 100;
}

// Exporter les fonctions du module
module.exports = {
  analyzeMultiProperty,
  calculateMaxPurchasePrice,
  performSensitivityAnalysis
};
