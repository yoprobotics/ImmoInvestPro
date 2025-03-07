/**
 * MultiDetailedCalculator.js
 * Calculateur spécialisé pour l'analyse détaillée des immeubles à revenus (multi-logements)
 * Version 5.1 - Compatible avec le calculateur de rendement MULTI 5.1 de la formation
 */

class MultiDetailedCalculator {
  /**
   * Calcule la rentabilité d'un immeuble à revenus
   * @param {Object} data Les données de l'immeuble
   * @param {number} data.purchasePrice Prix d'achat de l'immeuble
   * @param {Object} data.revenueDetails Détails des revenus
   * @param {Array} data.revenueDetails.units Liste des unités avec leurs loyers
   * @param {Array} data.revenueDetails.additionalRevenues Revenus additionnels (stationnement, buanderie, etc.)
   * @param {number} data.revenueDetails.vacancyRate Taux d'inoccupation global (%)
   * @param {Object} data.expenseDetails Détails des dépenses
   * @param {number} data.renovationCost Coût des rénovations (optionnel)
   * @param {Object} data.financing Informations sur le financement (optionnel)
   * @param {Object} data.financing.firstMortgage Premier prêt hypothécaire
   * @param {Object} data.financing.secondMortgage Deuxième prêt hypothécaire (optionnel)
   * @param {Object} data.financing.sellerFinancing Balance de vente (optionnel)
   * @param {Object} data.financing.privateInvestor Investisseur privé (optionnel)
   * @returns {Object} Résultats de l'analyse
   */
  static calculate(data) {
    // Extraction des données de base
    const purchasePrice = data.purchasePrice || 0;
    const renovationCost = data.renovationCost || 0;
    const totalInvestment = purchasePrice + renovationCost;
    
    // Calcul détaillé des revenus
    const revenueDetails = this._calculateDetailedRevenues(data.revenueDetails);
    const grossAnnualRent = revenueDetails.totalAnnualRevenue;
    const numberOfUnits = (data.revenueDetails?.units || []).length;
    
    // Calcul détaillé des dépenses
    const expenseDetails = this._calculateDetailedExpenses(data.expenseDetails, {
      grossAnnualRent,
      numberOfUnits,
      purchasePrice
    });
    
    const operatingExpenses = expenseDetails.totalAnnualExpenses;
    const netOperatingIncome = grossAnnualRent - operatingExpenses;
    
    // Configuration du financement
    const financing = this._configureFinancing(data.financing, totalInvestment);
    
    // Calcul des paiements hypothécaires et autres financements
    const mortgageDetails = this._calculateAllFinancingPayments(financing);
    const annualFinancingPayments = mortgageDetails.totalAnnualPayment;
    
    // Calcul du cashflow
    const annualCashflow = netOperatingIncome - annualFinancingPayments;
    const monthlyCashflow = annualCashflow / 12;
    const cashflowPerUnit = numberOfUnits > 0 ? monthlyCashflow / numberOfUnits : 0;
    
    // Calcul du capital investi (mise de fonds)
    const totalDownPayment = mortgageDetails.totalDownPayment;
    
    // Indicateurs de performance
    const capRate = (netOperatingIncome / totalInvestment) * 100;
    const cashOnCash = totalDownPayment > 0 ? (annualCashflow / totalDownPayment) * 100 : 0;
    const grossRentMultiplier = grossAnnualRent > 0 ? purchasePrice / grossAnnualRent : 0;
    
    // Évaluation de viabilité
    const isViable = cashflowPerUnit >= 75; // Minimum 75$ par porte par mois
    
    // Message d'évaluation
    let message;
    if (isViable) {
      message = "Ce projet est viable avec un cashflow positif suffisant par unité.";
    } else if (cashflowPerUnit > 0) {
      message = "Ce projet a un cashflow positif, mais inférieur au seuil recommandé de 75$/unité/mois.";
    } else {
      message = "Attention! Ce projet génère un cashflow négatif.";
    }
    
    return {
      details: {
        purchasePrice,
        renovationCost,
        totalInvestment,
        numberOfUnits,
        
        // Revenus détaillés
        revenueDetails: revenueDetails,
        grossAnnualRent: revenueDetails.totalAnnualRevenue,
        grossMonthlyRent: revenueDetails.totalMonthlyRevenue,
        
        // Dépenses détaillées
        expenseDetails: expenseDetails,
        operatingExpenses,
        expenseRatio: operatingExpenses / grossAnnualRent * 100,
        netOperatingIncome,
        
        // Financement
        financing: mortgageDetails,
        totalDownPayment: mortgageDetails.totalDownPayment,
        annualFinancingPayments,
        
        // Cashflow
        annualCashflow,
        monthlyCashflow,
        cashflowPerUnit,
        
        // Indicateurs
        capRate,
        cashOnCash,
        grossRentMultiplier
      },
      summary: {
        purchasePrice,
        grossAnnualRent: revenueDetails.totalAnnualRevenue,
        units: numberOfUnits,
        netOperatingIncome,
        monthlyCashflow,
        cashflowPerUnit,
        capRate: capRate.toFixed(2),
        cashOnCash: cashOnCash.toFixed(2),
        grossRentMultiplier: grossRentMultiplier.toFixed(2),
        isViable,
        message
      }
    };
  }
  
  /**
   * Calcule les revenus détaillés à partir des données d'entrée
   * @param {Object} revenueData Détails des revenus
   * @returns {Object} Revenus calculés
   */
  static _calculateDetailedRevenues(revenueData = {}) {
    // Initialisation des résultats
    const result = {
      totalMonthlyUnitRevenue: 0,
      totalMonthlyAdditionalRevenue: 0,
      totalMonthlyRevenue: 0,
      totalAnnualRevenue: 0,
      potentialMonthlyUnitRevenue: 0,
      potentialAnnualRevenue: 0,
      vacancyLoss: 0,
      unitCategories: {},
      occupancyRate: 100
    };
    
    // Traitement des unités/logements
    const units = revenueData.units || [];
    let occupiedCount = 0;
    let totalUnitCount = units.length;
    
    units.forEach(unit => {
      // Comptage des unités occupées
      if (unit.isOccupied) {
        occupiedCount++;
      }
      
      // Regroupement par catégorie/type de logement
      const unitType = unit.type || 'Autre';
      if (!result.unitCategories[unitType]) {
        result.unitCategories[unitType] = {
          count: 0,
          totalRent: 0,
          averageRent: 0
        };
      }
      
      result.unitCategories[unitType].count++;
      result.unitCategories[unitType].totalRent += unit.monthlyRent || 0;
      
      // Calcul du revenu potentiel (si toutes les unités étaient louées)
      result.potentialMonthlyUnitRevenue += unit.monthlyRent || 0;
    });
    
    // Calcul des moyennes par type
    Object.keys(result.unitCategories).forEach(type => {
      const category = result.unitCategories[type];
      category.averageRent = category.count > 0 ? category.totalRent / category.count : 0;
    });
    
    // Calcul du taux d'occupation réel
    result.occupancyRate = totalUnitCount > 0 ? (occupiedCount / totalUnitCount) * 100 : 100;
    
    // Application du taux d'inoccupation fourni ou calculé
    const vacancyRate = revenueData.vacancyRate !== undefined 
      ? revenueData.vacancyRate 
      : (100 - result.occupancyRate);
    
    result.potentialAnnualRevenue = result.potentialMonthlyUnitRevenue * 12;
    result.vacancyLoss = (result.potentialAnnualRevenue * vacancyRate) / 100;
    
    // Calcul du revenu réel des unités (après taux d'inoccupation)
    result.totalMonthlyUnitRevenue = result.potentialMonthlyUnitRevenue * (1 - vacancyRate / 100);
    
    // Traitement des revenus additionnels
    const additionalRevenues = revenueData.additionalRevenues || [];
    additionalRevenues.forEach(revenue => {
      const monthlyAmount = revenue.monthlyRevenue || 0;
      const count = revenue.count || 1;
      result.totalMonthlyAdditionalRevenue += monthlyAmount * count;
    });
    
    // Calcul des totaux
    result.totalMonthlyRevenue = result.totalMonthlyUnitRevenue + result.totalMonthlyAdditionalRevenue;
    result.totalAnnualRevenue = result.totalMonthlyRevenue * 12;
    
    return result;
  }
  
  /**
   * Calcule les dépenses détaillées à partir des données d'entrée
   * @param {Object} expenseData Détails des dépenses
   * @param {Object} propertyInfo Informations sur la propriété
   * @returns {Object} Dépenses calculées
   */
  static _calculateDetailedExpenses(expenseData = {}, propertyInfo = {}) {
    const { grossAnnualRent, numberOfUnits, purchasePrice } = propertyInfo;
    
    // Vérification si des dépenses détaillées ont été fournies
    const hasDetailedExpenses = expenseData && Object.keys(expenseData).length > 0;
    
    // Initialisation du résultat
    const result = {
      categories: {},
      totalAnnualExpenses: 0,
      totalMonthlyExpenses: 0,
      expenseRatio: 0
    };
    
    // Si aucune dépense détaillée n'est fournie, utiliser l'approche par ratio
    if (!hasDetailedExpenses && grossAnnualRent) {
      const defaultRatio = this._getExpenseRatio(numberOfUnits);
      result.totalAnnualExpenses = grossAnnualRent * defaultRatio;
      result.totalMonthlyExpenses = result.totalAnnualExpenses / 12;
      result.expenseRatio = defaultRatio * 100;
      
      // Créer une répartition par défaut des dépenses
      result.categories = this._createDefaultExpenseBreakdown(result.totalAnnualExpenses, purchasePrice);
      return result;
    }
    
    // Traitement des dépenses détaillées
    const processCategory = (category, amount) => {
      const annualAmount = amount || 0;
      result.categories[category] = {
        annualAmount,
        monthlyAmount: annualAmount / 12
      };
      result.totalAnnualExpenses += annualAmount;
    };
    
    // Traitement de chaque catégorie de dépense
    processCategory('municipalTaxes', expenseData.municipalTaxes);
    processCategory('schoolTaxes', expenseData.schoolTaxes);
    processCategory('insurance', expenseData.insurance);
    processCategory('electricity', expenseData.electricity);
    processCategory('heating', expenseData.heating);
    processCategory('water', expenseData.water);
    processCategory('maintenance', expenseData.maintenance);
    processCategory('management', expenseData.management);
    processCategory('janitorial', expenseData.janitorial);
    processCategory('snowRemoval', expenseData.snowRemoval);
    processCategory('landscaping', expenseData.landscaping);
    processCategory('garbage', expenseData.garbage);
    processCategory('legal', expenseData.legal);
    processCategory('accounting', expenseData.accounting);
    processCategory('advertising', expenseData.advertising);
    processCategory('condo', expenseData.condoFees);
    processCategory('other', expenseData.other);
    
    // Calcul du total mensuel et du ratio
    result.totalMonthlyExpenses = result.totalAnnualExpenses / 12;
    result.expenseRatio = grossAnnualRent ? (result.totalAnnualExpenses / grossAnnualRent) * 100 : 0;
    
    return result;
  }
  
  /**
   * Crée une répartition par défaut des dépenses basée sur les règles générales du marché
   * @param {number} totalAnnualExpenses Total des dépenses annuelles
   * @param {number} purchasePrice Prix d'achat de l'immeuble
   * @returns {Object} Répartition par défaut des dépenses par catégorie
   */
  static _createDefaultExpenseBreakdown(totalAnnualExpenses, purchasePrice) {
    const expenseBreakdown = {
      municipalTaxes: { percentage: 0.35, fallbackRate: 0.01 }, // 35% du total ou 1% du prix d'achat
      schoolTaxes: { percentage: 0.05, fallbackRate: 0.001 }, // 5% du total ou 0.1% du prix d'achat
      insurance: { percentage: 0.10, fallbackRate: 0.005 }, // 10% du total ou 0.5% du prix d'achat
      electricity: { percentage: 0.05 }, // 5% du total
      heating: { percentage: 0.05 }, // 5% du total
      water: { percentage: 0.03 }, // 3% du total
      maintenance: { percentage: 0.15 }, // 15% du total
      management: { percentage: 0.05 }, // 5% du total
      janitorial: { percentage: 0.05 }, // 5% du total
      snowRemoval: { percentage: 0.03 }, // 3% du total
      landscaping: { percentage: 0.02 }, // 2% du total
      garbage: { percentage: 0.02 }, // 2% du total
      other: { percentage: 0.05 } // 5% du total
    };
    
    const categories = {};
    
    // Répartition des dépenses selon les pourcentages ou taux par défaut
    Object.entries(expenseBreakdown).forEach(([category, config]) => {
      let annualAmount;
      
      // Si total des dépenses non défini, essayer d'utiliser le taux de repli basé sur le prix d'achat
      if (totalAnnualExpenses <= 0 && config.fallbackRate && purchasePrice > 0) {
        annualAmount = purchasePrice * config.fallbackRate;
      } else {
        annualAmount = totalAnnualExpenses * config.percentage;
      }
      
      categories[category] = {
        annualAmount,
        monthlyAmount: annualAmount / 12
      };
    });
    
    return categories;
  }
  
  /**
   * Configure les options de financement
   * @param {Object} financing Options de financement fournies
   * @param {number} totalInvestment Montant total de l'investissement
   * @returns {Object} Configuration de financement normalisée
   */
  static _configureFinancing(financing = {}, totalInvestment) {
    const defaultFirstMortgage = {
      loanToValue: 0.75,
      interestRate: 4.5,
      amortizationYears: 25,
      term: 5
    };
    
    // Normalisation du premier prêt hypothécaire
    const firstMortgage = financing.firstMortgage || {};
    return {
      firstMortgage: {
        loanToValue: firstMortgage.loanToValue || defaultFirstMortgage.loanToValue,
        interestRate: firstMortgage.interestRate || defaultFirstMortgage.interestRate,
        amortizationYears: firstMortgage.amortizationYears || defaultFirstMortgage.amortizationYears,
        term: firstMortgage.term || defaultFirstMortgage.term,
        totalInvestment
      },
      secondMortgage: financing.secondMortgage,
      sellerFinancing: financing.sellerFinancing,
      privateInvestor: financing.privateInvestor
    };
  }
  
  /**
   * Calcule les paiements pour toutes les sources de financement
   * @param {Object} financing Configuration de financement
   * @returns {Object} Détails de tous les paiements et mises de fonds
   */
  static _calculateAllFinancingPayments(financing) {
    const result = {
      firstMortgageAmount: 0,
      firstMortgageMonthlyPayment: 0,
      secondMortgageAmount: 0,
      secondMortgageMonthlyPayment: 0,
      sellerFinancingAmount: 0,
      sellerFinancingMonthlyPayment: 0,
      privateInvestorAmount: 0,
      privateInvestorMonthlyPayment: 0,
      totalMonthlyPayment: 0,
      totalAnnualPayment: 0,
      totalDownPayment: 0,
      totalFinancedAmount: 0
    };
    
    // Premier prêt hypothécaire
    if (financing.firstMortgage) {
      const totalInvestment = financing.firstMortgage.totalInvestment;
      result.firstMortgageAmount = totalInvestment * financing.firstMortgage.loanToValue;
      result.firstMortgageMonthlyPayment = this._calculateMortgagePayment(
        result.firstMortgageAmount,
        financing.firstMortgage.interestRate,
        financing.firstMortgage.amortizationYears
      );
      result.totalFinancedAmount += result.firstMortgageAmount;
    }
    
    // Deuxième prêt hypothécaire
    if (financing.secondMortgage) {
      result.secondMortgageAmount = financing.secondMortgage.amount || 0;
      result.secondMortgageMonthlyPayment = this._calculateMortgagePayment(
        result.secondMortgageAmount,
        financing.secondMortgage.interestRate || 0,
        financing.secondMortgage.amortizationYears || 0
      );
      result.totalFinancedAmount += result.secondMortgageAmount;
    }
    
    // Balance de vente
    if (financing.sellerFinancing) {
      result.sellerFinancingAmount = financing.sellerFinancing.amount || 0;
      result.sellerFinancingMonthlyPayment = this._calculateMortgagePayment(
        result.sellerFinancingAmount,
        financing.sellerFinancing.interestRate || 0,
        financing.sellerFinancing.amortizationYears || 0
      );
      result.totalFinancedAmount += result.sellerFinancingAmount;
    }
    
    // Investisseur privé
    if (financing.privateInvestor) {
      result.privateInvestorAmount = financing.privateInvestor.amount || 0;
      result.privateInvestorMonthlyPayment = this._calculateMortgagePayment(
        result.privateInvestorAmount,
        financing.privateInvestor.interestRate || 0,
        financing.privateInvestor.amortizationYears || 0
      );
      result.totalFinancedAmount += result.privateInvestorAmount;
    }
    
    // Calcul des paiements totaux
    result.totalMonthlyPayment = 
      result.firstMortgageMonthlyPayment + 
      result.secondMortgageMonthlyPayment + 
      result.sellerFinancingMonthlyPayment +
      result.privateInvestorMonthlyPayment;
      
    result.totalAnnualPayment = result.totalMonthlyPayment * 12;
    
    // Calcul de la mise de fonds totale
    const totalInvestment = financing.firstMortgage?.totalInvestment || 0;
    result.totalDownPayment = totalInvestment - result.totalFinancedAmount;
    
    return result;
  }
  
  /**
   * Détermine le ratio de dépenses en fonction du nombre d'unités
   * @param {number} units Nombre d'unités
   * @returns {number} Ratio de dépenses (0-1)
   */
  static _getExpenseRatio(units) {
    if (units <= 2) return 0.30; // 30% pour 1-2 logements
    if (units <= 4) return 0.35; // 35% pour 3-4 logements
    if (units <= 6) return 0.45; // 45% pour 5-6 logements
    return 0.50; // 50% pour 7+ logements
  }
  
  /**
   * Calcule le paiement hypothécaire mensuel
   * @param {number} principal Montant du prêt
   * @param {number} annualRate Taux d'intérêt annuel (%)
   * @param {number} years Années d'amortissement
   * @returns {number} Paiement mensuel
   */
  static _calculateMortgagePayment(principal, annualRate, years) {
    if (!principal || principal <= 0) return 0;
    if (!years || years <= 0) return 0;
    
    const monthlyRate = annualRate / 100 / 12;
    const numPayments = years * 12;
    
    if (monthlyRate === 0) return principal / numPayments;
    
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
           (Math.pow(1 + monthlyRate, numPayments) - 1);
  }
}

module.exports = MultiDetailedCalculator;