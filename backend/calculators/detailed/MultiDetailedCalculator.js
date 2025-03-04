/**
 * Calculateur détaillé pour les projets MULTI (immeubles à revenus)
 * 
 * Ce calculateur permet d'analyser en détail la rentabilité d'un immeuble à revenus
 * en tenant compte de tous les revenus, dépenses et indicateurs de performance
 */

class MultiDetailedCalculator {
  /**
   * Calcule la rentabilité détaillée d'un projet MULTI
   * 
   * @param {Object} data - Données du projet
   * @param {number} data.purchasePrice - Prix d'achat
   * @param {number} data.grossAnnualRent - Revenus locatifs bruts annuels
   * @param {number} data.units - Nombre d'unités (logements)
   * @param {number} data.renovationCost - Coût total des rénovations/optimisations initiales
   * @param {Object} data.acquisitionCosts - Coûts d'acquisition (notaire, inspection, etc.)
   * @param {Object} data.operatingExpenses - Dépenses d'exploitation (taxes, assurances, entretien, etc.)
   * @param {Object} data.financing - Détails du financement
   * @returns {Object} Analyse détaillée de la rentabilité
   */
  static calculate(data) {
    // Validation des entrées minimales
    if (!data.purchasePrice || !data.grossAnnualRent || !data.units) {
      throw new Error('Le prix d\'achat, les revenus annuels et le nombre d\'unités sont requis');
    }

    // Valeurs par défaut pour les paramètres optionnels
    const renovationCost = data.renovationCost || 0;
    
    // Calcul des coûts d'acquisition
    const acquisitionCosts = this.calculateAcquisitionCosts(data);
    
    // Calcul des dépenses d'exploitation
    const operatingExpenses = this.calculateOperatingExpenses(data);
    
    // Calcul des revenus nets d'exploitation (NOI)
    const netOperatingIncome = data.grossAnnualRent - operatingExpenses.total;
    
    // Calcul des paiements hypothécaires annuels
    const financing = this.calculateFinancing(data);
    
    // Calcul du cashflow annuel
    const annualCashflow = netOperatingIncome - financing.annualPayment;
    const monthlyCashflow = annualCashflow / 12;
    const cashflowPerUnit = monthlyCashflow / data.units;
    
    // Calcul des indicateurs de performance
    const capRate = (netOperatingIncome / data.purchasePrice) * 100;
    const cashOnCash = (annualCashflow / financing.downPayment) * 100;
    const grossRentMultiplier = data.purchasePrice / data.grossAnnualRent;
    
    // Calcul de la valeur économique
    const economicValue = netOperatingIncome / (capRate / 100);
    
    return {
      summary: {
        purchasePrice: data.purchasePrice,
        grossAnnualRent: data.grossAnnualRent,
        units: data.units,
        renovationCost: renovationCost,
        acquisitionCosts: acquisitionCosts.total,
        operatingExpenses: operatingExpenses.total,
        netOperatingIncome: netOperatingIncome,
        annualCashflow: annualCashflow,
        monthlyCashflow: monthlyCashflow,
        cashflowPerUnit: cashflowPerUnit,
        capRate: parseFloat(capRate.toFixed(2)),
        cashOnCash: parseFloat(cashOnCash.toFixed(2)),
        grossRentMultiplier: parseFloat(grossRentMultiplier.toFixed(2)),
        economicValue: economicValue,
        isViable: cashflowPerUnit >= 75,
        message: cashflowPerUnit >= 75 
          ? `Ce projet est viable avec un cashflow de ${cashflowPerUnit.toFixed(2)}$ par porte par mois et un rendement de ${cashOnCash.toFixed(2)}%` 
          : `Ce projet n'est pas viable avec un cashflow de seulement ${cashflowPerUnit.toFixed(2)}$ par porte par mois (cible: 75$/porte/mois)`
      },
      details: {
        acquisition: acquisitionCosts,
        operating: operatingExpenses,
        financing: financing,
        renovation: data.renovationDetails || { total: renovationCost }
      }
    };
  }

  /**
   * Calcule les coûts d'acquisition
   * 
   * @param {Object} data - Données du projet
   * @returns {Object} Détail des coûts d'acquisition
   */
  static calculateAcquisitionCosts(data) {
    const purchasePrice = data.purchasePrice;
    
    // Utiliser les coûts d'acquisition fournis ou calculer les coûts par défaut
    if (data.acquisitionCosts) {
      return {
        ...data.acquisitionCosts,
        total: Object.values(data.acquisitionCosts).reduce((sum, value) => 
          typeof value === 'number' ? sum + value : sum, 0)
      };
    }
    
    // Calculs par défaut
    const notaryFees = Math.min(2500, purchasePrice * 0.01); // ~1% jusqu'à 2500$
    const transferTax = this.calculateTransferTax(purchasePrice);
    const inspectionFee = 650 + (data.units * 100); // Frais d'inspection de base + par unité
    const environmentalAssessment = data.units > 6 ? 2500 : 0; // Évaluation environnementale pour les grands immeubles
    const title = 500; // Frais de titre moyens
    
    const total = notaryFees + transferTax + inspectionFee + environmentalAssessment + title;
    
    return {
      notaryFees,
      transferTax,
      inspectionFee,
      environmentalAssessment,
      title,
      total
    };
  }

  /**
   * Calcule les dépenses d'exploitation
   * 
   * @param {Object} data - Données du projet
   * @returns {Object} Détail des dépenses d'exploitation
   */
  static calculateOperatingExpenses(data) {
    const grossAnnualRent = data.grossAnnualRent;
    const purchasePrice = data.purchasePrice;
    const units = data.units;
    
    // Utiliser les dépenses d'exploitation fournies ou calculer les coûts par défaut
    if (data.operatingExpenses) {
      return {
        ...data.operatingExpenses,
        total: Object.values(data.operatingExpenses).reduce((sum, value) => 
          typeof value === 'number' ? sum + value : sum, 0)
      };
    }
    
    // Calculs par défaut basés sur un pourcentage des revenus bruts selon le nombre d'unités
    let expenseRatio;
    if (units <= 2) {
      expenseRatio = 0.3; // 30% pour 1-2 unités
    } else if (units <= 4) {
      expenseRatio = 0.35; // 35% pour 3-4 unités
    } else if (units <= 6) {
      expenseRatio = 0.45; // 45% pour 5-6 unités
    } else {
      expenseRatio = 0.5; // 50% pour 7+ unités
    }
    
    const totalExpenses = grossAnnualRent * expenseRatio;
    
    // Répartition détaillée des dépenses
    const propertyTax = purchasePrice * 0.01; // ~1% de la valeur
    const insurance = purchasePrice * 0.005; // ~0.5% de la valeur
    const maintenance = grossAnnualRent * 0.1; // ~10% des revenus bruts
    const management = units >= 5 ? grossAnnualRent * 0.05 : 0; // 5% des revenus pour gestion externe si 5+ unités
    const utilities = units * 200; // 200$ par unité pour les parties communes
    const vacancy = grossAnnualRent * 0.05; // Provision pour vacance de 5%
    const other = totalExpenses - (propertyTax + insurance + maintenance + management + utilities + vacancy);
    
    return {
      propertyTax,
      insurance,
      maintenance,
      management,
      utilities,
      vacancy,
      other,
      total: totalExpenses
    };
  }

  /**
   * Calcule les détails du financement
   * 
   * @param {Object} data - Données du projet
   * @returns {Object} Détail du financement
   */
  static calculateFinancing(data) {
    const purchasePrice = data.purchasePrice;
    
    // Utiliser les détails de financement fournis ou calculer par défaut
    if (data.financing && data.financing.annualPayment) {
      return {
        ...data.financing
      };
    }
    
    // Valeurs par défaut
    const loanToValue = data.financing?.loanToValue || 0.75; // 75% LTV par défaut
    const interestRate = data.financing?.interestRate || 5; // 5% par défaut
    const amortizationYears = data.financing?.amortizationYears || 25; // 25 ans par défaut
    const loanAmount = purchasePrice * loanToValue;
    const downPayment = purchasePrice - loanAmount;
    
    // Calcul du paiement mensuel
    const monthlyRate = interestRate / 100 / 12;
    const totalPayments = amortizationYears * 12;
    const monthlyPayment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalPayments));
    const annualPayment = monthlyPayment * 12;
    
    return {
      loanAmount,
      downPayment,
      interestRate,
      amortizationYears,
      monthlyPayment,
      annualPayment,
      loanToValue
    };
  }

  /**
   * Calcule la taxe de mutation (taxe de bienvenue)
   * 
   * @param {number} purchasePrice - Prix d'achat
   * @returns {number} Montant de la taxe de mutation
   */
  static calculateTransferTax(purchasePrice) {
    // Barème pour le Québec (peut varier selon les municipalités)
    let tax = 0;
    
    if (purchasePrice <= 50000) {
      tax = purchasePrice * 0.005;
    } else if (purchasePrice <= 250000) {
      tax = 50000 * 0.005 + (purchasePrice - 50000) * 0.01;
    } else if (purchasePrice <= 500000) {
      tax = 50000 * 0.005 + 200000 * 0.01 + (purchasePrice - 250000) * 0.015;
    } else {
      tax = 50000 * 0.005 + 200000 * 0.01 + 250000 * 0.015 + (purchasePrice - 500000) * 0.02;
    }
    
    return tax;
  }
}

module.exports = MultiDetailedCalculator;