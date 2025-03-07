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
   * @param {Object} data.acquisitionCosts Coûts d'acquisition (optionnel)
   * @param {Object} data.financing Informations sur le financement (optionnel)
   * @param {Object} data.investorProfile Profil de l'investisseur pour calculs d'endettement (optionnel)
   * @returns {Object} Résultats de l'analyse
   */
  static calculate(data) {
    // Extraction des données de base
    const purchasePrice = data.purchasePrice || 0;
    const renovationCost = data.renovationCost || 0;
    
    // Calcul des coûts d'acquisition additionnels
    const acquisitionCosts = this._calculateAcquisitionCosts(data.acquisitionCosts, purchasePrice);
    
    // Investissement total incluant tous les coûts
    const totalInvestment = purchasePrice + renovationCost + acquisitionCosts.total;
    
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
    
    // Calcul de l'amortissement pour la première année
    const amortizationFirstYear = this._calculateFirstYearAmortization(mortgageDetails);
    
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
    
    // Calcul des ratios d'endettement
    const debtServiceRatios = data.investorProfile ? 
      this._calculateDebtServiceRatios(data.investorProfile, netOperatingIncome, mortgageDetails) : 
      { abd: null, atd: null };
    
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
        acquisitionCosts,
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
        amortizationFirstYear,
        totalDownPayment: mortgageDetails.totalDownPayment,
        annualFinancingPayments,
        debtServiceRatios,
        
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
        debtServiceRatios,
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
   * Calcule les coûts d'acquisition additionnels
   * @param {Object} acquisitionData Données des coûts d'acquisition
   * @param {number} purchasePrice Prix d'achat de l'immeuble
   * @returns {Object} Coûts d'acquisition calculés
   */
  static _calculateAcquisitionCosts(acquisitionData = {}, purchasePrice = 0) {
    const result = {
      transferTax: 0,        // Droits de mutation (taxe de bienvenue)
      legalFees: 0,          // Frais de notaire
      inspectionFees: 0,     // Frais d'inspection
      appraisalFees: 0,      // Frais d'évaluation
      mortgageInsurance: 0,  // Assurance prêt hypothécaire (SCHL)
      mortgageSetupFees: 0,  // Frais de mise en place du prêt
      otherFees: 0,          // Autres frais
      total: 0               // Total des coûts d'acquisition
    };
    
    // Si aucune donnée fournie, estimer basé sur des pourcentages standards
    if (!acquisitionData || Object.keys(acquisitionData).length === 0) {
      if (purchasePrice > 0) {
        // Estimations par défaut
        result.transferTax = this._calculateTransferTax(purchasePrice);
        result.legalFees = Math.min(1500, purchasePrice * 0.01);
        result.inspectionFees = 500;
        result.appraisalFees = 800;
        result.mortgageSetupFees = 1200;
      }
    } else {
      // Utiliser les valeurs fournies
      result.transferTax = acquisitionData.transferTax || this._calculateTransferTax(purchasePrice);
      result.legalFees = acquisitionData.legalFees || 0;
      result.inspectionFees = acquisitionData.inspectionFees || 0;
      result.appraisalFees = acquisitionData.appraisalFees || 0;
      result.mortgageInsurance = acquisitionData.mortgageInsurance || 0;
      result.mortgageSetupFees = acquisitionData.mortgageSetupFees || 0;
      result.otherFees = acquisitionData.otherFees || 0;
    }
    
    // Calcul du total
    result.total = 
      result.transferTax + 
      result.legalFees + 
      result.inspectionFees + 
      result.appraisalFees + 
      result.mortgageInsurance + 
      result.mortgageSetupFees + 
      result.otherFees;
    
    return result;
  }
  
  /**
   * Calcule les droits de mutation (taxe de bienvenue) selon les barèmes québécois
   * @param {number} purchasePrice Prix d'achat
   * @returns {number} Montant des droits de mutation
   */
  static _calculateTransferTax(purchasePrice) {
    let transferTax = 0;
    
    // Barème provincial standard (peut varier selon les municipalités)
    if (purchasePrice <= 50000) {
      transferTax = purchasePrice * 0.005;
    } else if (purchasePrice <= 250000) {
      transferTax = 50000 * 0.005 + (purchasePrice - 50000) * 0.01;
    } else if (purchasePrice <= 500000) {
      transferTax = 50000 * 0.005 + 200000 * 0.01 + (purchasePrice - 250000) * 0.015;
    } else {
      transferTax = 50000 * 0.005 + 200000 * 0.01 + 250000 * 0.015 + (purchasePrice - 500000) * 0.02;
    }
    
    // Certaines municipalités peuvent avoir un taux plus élevé pour les montants supérieurs
    // Ex: Montréal a un taux de 2% pour la portion > 500k et 2.5% pour la portion > 1M
    
    return transferTax;
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
    
    // Configuration avancée de financement
    return {
      firstMortgage: {
        loanToValue: firstMortgage.loanToValue || defaultFirstMortgage.loanToValue,
        interestRate: firstMortgage.interestRate || defaultFirstMortgage.interestRate,
        amortizationYears: firstMortgage.amortizationYears || defaultFirstMortgage.amortizationYears,
        term: firstMortgage.term || defaultFirstMortgage.term,
        totalInvestment,
        prepaymentPrivileges: firstMortgage.prepaymentPrivileges || 15, // % de prépaiement permis sans pénalité
        paymentFrequency: firstMortgage.paymentFrequency || 'monthly', // 'monthly', 'biweekly', 'accelerated'
        desiredAmount: firstMortgage.desiredAmount // Montant précis au lieu de LTV, si fourni
      },
      secondMortgage: financing.secondMortgage ? {
        amount: financing.secondMortgage.amount || 0,
        interestRate: financing.secondMortgage.interestRate || 0,
        amortizationYears: financing.secondMortgage.amortizationYears || 0,
        term: financing.secondMortgage.term || 0,
        interestOnly: financing.secondMortgage.interestOnly || false
      } : null,
      sellerFinancing: financing.sellerFinancing ? {
        amount: financing.sellerFinancing.amount || 0,
        interestRate: financing.sellerFinancing.interestRate || 0,
        amortizationYears: financing.sellerFinancing.amortizationYears || 0,
        term: financing.sellerFinancing.term || 0,
        interestOnly: financing.sellerFinancing.interestOnly || false,
        paymentStartMonths: financing.sellerFinancing.paymentStartMonths || 0 // Délai avant début des paiements
      } : null,
      privateInvestor: financing.privateInvestor ? {
        amount: financing.privateInvestor.amount || 0,
        interestRate: financing.privateInvestor.interestRate || 0,
        amortizationYears: financing.privateInvestor.amortizationYears || 0,
        term: financing.privateInvestor.term || 0,
        interestOnly: financing.privateInvestor.interestOnly || false,
        profitSharing: financing.privateInvestor.profitSharing || 0 // % du profit partagé
      } : null,
      personalCashAmount: financing.personalCashAmount || 0, // Montant cash investi
      additionalEquityAmount: financing.additionalEquityAmount || 0 // Équité venant d'autres sources
    };
  }
  
  /**
   * Calcule les paiements pour toutes les sources de financement
   * @param {Object} financing Configuration de financement
   * @returns {Object} Détails de tous les paiements et mises de fonds
   */
  static _calculateAllFinancingPayments(financing) {
    const result = {
      // Premier prêt hypothécaire
      firstMortgageAmount: 0,
      firstMortgageMonthlyPayment: 0,
      firstMortgageMonthlyInterest: 0,
      firstMortgageMonthlyPrincipal: 0,
      
      // Deuxième prêt hypothécaire
      secondMortgageAmount: 0,
      secondMortgageMonthlyPayment: 0,
      secondMortgageMonthlyInterest: 0,
      secondMortgageMonthlyPrincipal: 0,
      
      // Balance de vente
      sellerFinancingAmount: 0,
      sellerFinancingMonthlyPayment: 0,
      sellerFinancingMonthlyInterest: 0,
      sellerFinancingMonthlyPrincipal: 0,
      
      // Investisseur privé
      privateInvestorAmount: 0,
      privateInvestorMonthlyPayment: 0,
      privateInvestorMonthlyInterest: 0,
      privateInvestorMonthlyPrincipal: 0,
      
      // Totaux
      totalMonthlyPayment: 0,
      totalAnnualPayment: 0,
      totalDownPayment: 0,
      totalFinancedAmount: 0,
      
      // Cash flow
      personalCashAmount: financing.personalCashAmount || 0,
      additionalEquityAmount: financing.additionalEquityAmount || 0
    };
    
    // Premier prêt hypothécaire
    if (financing.firstMortgage) {
      const totalInvestment = financing.firstMortgage.totalInvestment;
      
      // Calcul du montant du prêt (soit par LTV ou montant spécifié)
      if (financing.firstMortgage.desiredAmount) {
        result.firstMortgageAmount = financing.firstMortgage.desiredAmount;
      } else {
        result.firstMortgageAmount = totalInvestment * financing.firstMortgage.loanToValue;
      }
      
      // Calcul du paiement mensuel et décomposition (capital et intérêts)
      const { payment, interestPayment, principalPayment } = this._calculateDetailedMortgagePayment(
        result.firstMortgageAmount,
        financing.firstMortgage.interestRate,
        financing.firstMortgage.amortizationYears,
        1 // premier mois
      );
      
      result.firstMortgageMonthlyPayment = payment;
      result.firstMortgageMonthlyInterest = interestPayment;
      result.firstMortgageMonthlyPrincipal = principalPayment;
      
      result.totalFinancedAmount += result.firstMortgageAmount;
    }
    
    // Deuxième prêt hypothécaire
    if (financing.secondMortgage) {
      result.secondMortgageAmount = financing.secondMortgage.amount || 0;
      
      if (financing.secondMortgage.interestOnly) {
        // Pour prêt à intérêt seulement
        const monthlyInterest = (result.secondMortgageAmount * financing.secondMortgage.interestRate / 100) / 12;
        result.secondMortgageMonthlyPayment = monthlyInterest;
        result.secondMortgageMonthlyInterest = monthlyInterest;
        result.secondMortgageMonthlyPrincipal = 0;
      } else {
        // Pour prêt avec amortissement
        const { payment, interestPayment, principalPayment } = this._calculateDetailedMortgagePayment(
          result.secondMortgageAmount,
          financing.secondMortgage.interestRate,
          financing.secondMortgage.amortizationYears,
          1 // premier mois
        );
        
        result.secondMortgageMonthlyPayment = payment;
        result.secondMortgageMonthlyInterest = interestPayment;
        result.secondMortgageMonthlyPrincipal = principalPayment;
      }
      
      result.totalFinancedAmount += result.secondMortgageAmount;
    }
    
    // Balance de vente
    if (financing.sellerFinancing) {
      result.sellerFinancingAmount = financing.sellerFinancing.amount || 0;
      
      if (financing.sellerFinancing.interestOnly) {
        // Pour prêt à intérêt seulement
        const monthlyInterest = (result.sellerFinancingAmount * financing.sellerFinancing.interestRate / 100) / 12;
        result.sellerFinancingMonthlyPayment = monthlyInterest;
        result.sellerFinancingMonthlyInterest = monthlyInterest;
        result.sellerFinancingMonthlyPrincipal = 0;
      } else {
        // Pour prêt avec amortissement
        const { payment, interestPayment, principalPayment } = this._calculateDetailedMortgagePayment(
          result.sellerFinancingAmount,
          financing.sellerFinancing.interestRate,
          financing.sellerFinancing.amortizationYears,
          1 // premier mois
        );
        
        result.sellerFinancingMonthlyPayment = payment;
        result.sellerFinancingMonthlyInterest = interestPayment;
        result.sellerFinancingMonthlyPrincipal = principalPayment;
      }
      
      // Si paiement différé, on l'indique mais on l'inclut quand même dans les calculs financiers
      if (financing.sellerFinancing.paymentStartMonths > 0) {
        result.sellerFinancingPaymentStartsIn = financing.sellerFinancing.paymentStartMonths;
      }
      
      result.totalFinancedAmount += result.sellerFinancingAmount;
    }
    
    // Investisseur privé
    if (financing.privateInvestor) {
      result.privateInvestorAmount = financing.privateInvestor.amount || 0;
      
      if (financing.privateInvestor.interestOnly) {
        // Pour prêt à intérêt seulement
        const monthlyInterest = (result.privateInvestorAmount * financing.privateInvestor.interestRate / 100) / 12;
        result.privateInvestorMonthlyPayment = monthlyInterest;
        result.privateInvestorMonthlyInterest = monthlyInterest;
        result.privateInvestorMonthlyPrincipal = 0;
      } else {
        // Pour prêt avec amortissement
        const { payment, interestPayment, principalPayment } = this._calculateDetailedMortgagePayment(
          result.privateInvestorAmount,
          financing.privateInvestor.interestRate,
          financing.privateInvestor.amortizationYears,
          1 // premier mois
        );
        
        result.privateInvestorMonthlyPayment = payment;
        result.privateInvestorMonthlyInterest = interestPayment;
        result.privateInvestorMonthlyPrincipal = principalPayment;
      }
      
      // Inclusion du partage des profits le cas échéant
      if (financing.privateInvestor.profitSharing > 0) {
        result.privateInvestorProfitSharing = financing.privateInvestor.profitSharing;
      }
      
      result.totalFinancedAmount += result.privateInvestorAmount;
    }
    
    // Calcul des paiements totaux
    result.totalMonthlyPayment = 
      result.firstMortgageMonthlyPayment + 
      result.secondMortgageMonthlyPayment + 
      result.sellerFinancingMonthlyPayment +
      result.privateInvestorMonthlyPayment;
      
    result.totalAnnualPayment = result.totalMonthlyPayment * 12;
    
    // Calcul des intérêts et capital mensuels totaux
    result.totalMonthlyInterest = 
      result.firstMortgageMonthlyInterest + 
      result.secondMortgageMonthlyInterest + 
      result.sellerFinancingMonthlyInterest +
      result.privateInvestorMonthlyInterest;
    
    result.totalMonthlyPrincipal = 
      result.firstMortgageMonthlyPrincipal + 
      result.secondMortgageMonthlyPrincipal + 
      result.sellerFinancingMonthlyPrincipal +
      result.privateInvestorMonthlyPrincipal;
    
    // Calcul de la mise de fonds totale et des sources de financement
    const totalInvestment = financing.firstMortgage?.totalInvestment || 0;
    
    // La mise de fonds totale inclut l'argent personnel et l'équité additionnelle
    result.totalDownPayment = totalInvestment - result.totalFinancedAmount;
    
    // Structure du cashflow personnel vs équité additionnelle
    if (result.personalCashAmount + result.additionalEquityAmount > 0) {
      // Si spécifié, on utilise les montants fournis
      result.equityStructure = {
        personalCash: result.personalCashAmount,
        additionalEquity: result.additionalEquityAmount,
        totalEquity: result.personalCashAmount + result.additionalEquityAmount
      };
    } else {
      // Sinon on considère que tout vient de l'argent personnel
      result.equityStructure = {
        personalCash: result.totalDownPayment,
        additionalEquity: 0,
        totalEquity: result.totalDownPayment
      };
    }
    
    return result;
  }
  
  /**
   * Calcule l'amortissement détaillé pour la première année
   * @param {Object} mortgageDetails Détails des prêts
   * @returns {Object} Tableau d'amortissement pour la première année
   */
  static _calculateFirstYearAmortization(mortgageDetails) {
    const amortization = {
      firstYear: {
        months: [],
        totalInterest: 0,
        totalPrincipal: 0,
        endingBalance: {}
      }
    };
    
    // Calcul de l'amortissement du premier prêt hypothécaire
    if (mortgageDetails.firstMortgageAmount > 0) {
      let balance = mortgageDetails.firstMortgageAmount;
      amortization.firstYear.endingBalance.firstMortgage = balance;
      
      for (let month = 1; month <= 12; month++) {
        const { payment, interestPayment, principalPayment } = this._calculateDetailedMortgagePayment(
          balance,
          mortgageDetails.firstMortgageMonthlyInterest * 12 * 100 / mortgageDetails.firstMortgageAmount, // Taux annuel
          mortgageDetails.firstMortgageMonthlyPrincipal > 0 ? 
            Math.ceil(mortgageDetails.firstMortgageAmount / (mortgageDetails.firstMortgageMonthlyPrincipal * 12)) : 0, // Années d'amortissement restantes
          month
        );
        
        balance -= principalPayment;
        
        amortization.firstYear.months.push({
          month,
          firstMortgage: {
            payment,
            interestPayment,
            principalPayment,
            balance
          }
        });
        
        amortization.firstYear.totalInterest += interestPayment;
        amortization.firstYear.totalPrincipal += principalPayment;
      }
      
      amortization.firstYear.endingBalance.firstMortgage = balance;
    }
    
    // On pourrait faire la même chose pour les autres prêts si nécessaire
    
    return amortization;
  }
  
  /**
   * Calcule les ratios d'endettement ABD (Amortissement Brut de la Dette) et ATD (Amortissement Total de la Dette)
   * @param {Object} investorProfile Profil de l'investisseur
   * @param {number} netOperatingIncome Revenu net d'exploitation
   * @param {Object} mortgageDetails Détails des prêts
   * @returns {Object} Ratios d'endettement
   */
  static _calculateDebtServiceRatios(investorProfile, netOperatingIncome, mortgageDetails) {
    // ABD = Principal, Intérêts, Taxes et Chauffage divisé par le revenu brut
    // ATD = Tous les paiements mensuels divisé par le revenu brut
    
    // Extraction des données pertinentes
    const monthlyIncome = (investorProfile.annualIncome || 0) / 12;
    const otherMonthlyDebt = investorProfile.otherMonthlyDebt || 0;
    
    // Calcul du service de la dette pour l'immeuble
    const propertyDebtService = mortgageDetails.totalMonthlyPayment;
    
    // Calcul des ratios
    const abdRatio = monthlyIncome > 0 ? (propertyDebtService / monthlyIncome) * 100 : null;
    const atdRatio = monthlyIncome > 0 ? ((propertyDebtService + otherMonthlyDebt) / monthlyIncome) * 100 : null;
    
    // Évaluation des ratios
    const abdLimit = 32; // Limite standard ABD 32%
    const atdLimit = 40; // Limite standard ATD 40%
    
    const abdExceeded = abdRatio > abdLimit;
    const atdExceeded = atdRatio > atdLimit;
    
    return {
      abd: abdRatio ? abdRatio.toFixed(2) : null,
      atd: atdRatio ? atdRatio.toFixed(2) : null,
      abdExceeded,
      atdExceeded,
      abdLimit,
      atdLimit
    };
  }
  
  /**
   * Calcule le paiement hypothécaire mensuel avec décomposition des intérêts et du capital
   * @param {number} principal Montant du prêt
   * @param {number} annualRate Taux d'intérêt annuel (%)
   * @param {number} years Années d'amortissement
   * @param {number} currentMonth Mois actuel (pour calculs précis de l'amortissement)
   * @returns {Object} Détails du paiement (total, intérêts, capital)
   */
  static _calculateDetailedMortgagePayment(principal, annualRate, years, currentMonth = 1) {
    if (!principal || principal <= 0) {
      return { payment: 0, interestPayment: 0, principalPayment: 0 };
    }
    
    if (!years || years <= 0) {
      return { payment: 0, interestPayment: 0, principalPayment: 0 };
    }
    
    const monthlyRate = annualRate / 100 / 12;
    const numPayments = years * 12;
    
    // Si taux d'intérêt nul, paiement = montant / nombre de paiements
    if (monthlyRate === 0) {
      const payment = principal / numPayments;
      return { 
        payment, 
        interestPayment: 0, 
        principalPayment: payment 
      };
    }
    
    // Calcul du paiement total (formule standard)
    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                   (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    // Pour calculer précisément l'intérêt au mois en cours, nous devons connaître le solde restant
    // au début de ce mois. Pour simplifier, on va utiliser une approximation:
    let remainingBalance = principal;
    
    // Si on n'est pas au premier mois, simuler les paiements précédents
    for (let month = 1; month < currentMonth; month++) {
      const interestForMonth = remainingBalance * monthlyRate;
      const principalForMonth = payment - interestForMonth;
      remainingBalance -= principalForMonth;
    }
    
    // Maintenant on calcule l'intérêt et le capital pour le mois en cours
    const interestPayment = remainingBalance * monthlyRate;
    const principalPayment = payment - interestPayment;
    
    return {
      payment,
      interestPayment,
      principalPayment
    };
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
}

module.exports = MultiDetailedCalculator;