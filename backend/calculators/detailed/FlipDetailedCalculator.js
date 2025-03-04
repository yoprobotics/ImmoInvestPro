/**
 * Calculateur détaillé pour les projets FLIP (achat-rénovation-revente)
 * 
 * Ce calculateur permet d'analyser en détail la rentabilité d'un projet FLIP
 * en tenant compte de tous les coûts, revenus potentiels et indicateurs de performance
 */

class FlipDetailedCalculator {
  /**
   * Calcule la rentabilité détaillée d'un projet FLIP
   * 
   * @param {Object} data - Données du projet
   * @param {number} data.purchasePrice - Prix d'achat
   * @param {number} data.sellingPrice - Prix de vente estimé
   * @param {number} data.renovationCost - Coût total des rénovations
   * @param {Object} data.acquisitionCosts - Coûts d'acquisition (notaire, inspection, etc.)
   * @param {Object} data.holdingCosts - Coûts de détention (taxes, assurances, etc.)
   * @param {Object} data.sellingCosts - Coûts de vente (courtier, marketing, etc.)
   * @param {Object} data.financing - Détails du financement
   * @param {number} data.holdingPeriod - Période de détention en mois
   * @returns {Object} Analyse détaillée de la rentabilité
   */
  static calculate(data) {
    // Validation des entrées minimales
    if (!data.purchasePrice || !data.sellingPrice) {
      throw new Error('Le prix d\'achat et le prix de vente sont requis');
    }

    // Valeurs par défaut pour les paramètres optionnels
    const renovationCost = data.renovationCost || 0;
    const holdingPeriod = data.holdingPeriod || 6; // 6 mois par défaut
    
    // Calcul des coûts d'acquisition
    const acquisitionCosts = this.calculateAcquisitionCosts(data);
    
    // Calcul des coûts de détention
    const holdingCosts = this.calculateHoldingCosts(data, holdingPeriod);
    
    // Calcul des coûts de vente
    const sellingCosts = this.calculateSellingCosts(data);
    
    // Calcul des coûts de financement
    const financingCosts = this.calculateFinancingCosts(data, holdingPeriod);
    
    // Calcul des totaux
    const totalInvestment = data.purchasePrice + renovationCost + acquisitionCosts.total + financingCosts.total;
    const totalCosts = totalInvestment + holdingCosts.total + sellingCosts.total;
    const profit = data.sellingPrice - totalCosts;
    const roi = (profit / totalInvestment) * 100;
    const annualizedRoi = (Math.pow(1 + (roi / 100), (12 / holdingPeriod)) - 1) * 100;
    
    return {
      summary: {
        purchasePrice: data.purchasePrice,
        sellingPrice: data.sellingPrice,
        renovationCost: renovationCost,
        holdingPeriod: holdingPeriod,
        acquisitionCosts: acquisitionCosts.total,
        holdingCosts: holdingCosts.total,
        sellingCosts: sellingCosts.total,
        financingCosts: financingCosts.total,
        totalInvestment: totalInvestment,
        totalCosts: totalCosts,
        profit: profit,
        roi: parseFloat(roi.toFixed(2)),
        annualizedRoi: parseFloat(annualizedRoi.toFixed(2)),
        isViable: profit >= 25000,
        message: profit >= 25000 
          ? `Ce projet est viable avec un profit de ${profit.toFixed(2)}$ et un ROI de ${roi.toFixed(2)}%` 
          : `Ce projet n'est pas viable avec un profit de seulement ${profit.toFixed(2)}$ (cible: 25 000$)`
      },
      details: {
        acquisition: acquisitionCosts,
        holding: holdingCosts,
        selling: sellingCosts,
        financing: financingCosts,
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
    const notaryFees = Math.min(1500, purchasePrice * 0.01); // ~1% jusqu'à 1500$
    const transferTax = this.calculateTransferTax(purchasePrice);
    const inspectionFee = 500; // Frais d'inspection moyens
    const environmentalAssessment = purchasePrice > 500000 ? 1200 : 0; // Évaluation environnementale pour les grandes propriétés
    const otherFees = 300; // Autres frais divers
    
    const total = notaryFees + transferTax + inspectionFee + environmentalAssessment + otherFees;
    
    return {
      notaryFees,
      transferTax,
      inspectionFee,
      environmentalAssessment,
      otherFees,
      total
    };
  }

  /**
   * Calcule les coûts de détention
   * 
   * @param {Object} data - Données du projet
   * @param {number} holdingPeriod - Période de détention en mois
   * @returns {Object} Détail des coûts de détention
   */
  static calculateHoldingCosts(data, holdingPeriod) {
    const purchasePrice = data.purchasePrice;
    
    // Utiliser les coûts de détention fournis ou calculer les coûts par défaut
    if (data.holdingCosts) {
      const totalMonthly = Object.values(data.holdingCosts).reduce((sum, value) => 
        typeof value === 'number' ? sum + value : sum, 0);
      
      return {
        ...data.holdingCosts,
        totalMonthly,
        total: totalMonthly * holdingPeriod
      };
    }
    
    // Calculs par défaut (mensuels)
    const propertyTax = (purchasePrice * 0.01) / 12; // ~1% de la valeur par an
    const insurance = (purchasePrice * 0.005) / 12; // ~0.5% de la valeur par an
    const utilities = 150; // Électricité, eau, etc.
    const maintenance = 100; // Entretien mensuel moyen
    
    const totalMonthly = propertyTax + insurance + utilities + maintenance;
    const total = totalMonthly * holdingPeriod;
    
    return {
      propertyTax,
      insurance,
      utilities,
      maintenance,
      totalMonthly,
      total
    };
  }

  /**
   * Calcule les coûts de vente
   * 
   * @param {Object} data - Données du projet
   * @returns {Object} Détail des coûts de vente
   */
  static calculateSellingCosts(data) {
    const sellingPrice = data.sellingPrice;
    
    // Utiliser les coûts de vente fournis ou calculer les coûts par défaut
    if (data.sellingCosts) {
      return {
        ...data.sellingCosts,
        total: Object.values(data.sellingCosts).reduce((sum, value) => 
          typeof value === 'number' ? sum + value : sum, 0)
      };
    }
    
    // Calculs par défaut
    const realtorFees = sellingPrice * 0.05; // 5% commission courtier
    const marketingCosts = 500; // Photos professionnelles, visites virtuelles, etc.
    const homeStagingCosts = 1000; // Mise en valeur de la propriété
    const repairAfterInspection = 1000; // Réparations après inspection
    
    const total = realtorFees + marketingCosts + homeStagingCosts + repairAfterInspection;
    
    return {
      realtorFees,
      marketingCosts,
      homeStagingCosts,
      repairAfterInspection,
      total
    };
  }

  /**
   * Calcule les coûts de financement
   * 
   * @param {Object} data - Données du projet
   * @param {number} holdingPeriod - Période de détention en mois
   * @returns {Object} Détail des coûts de financement
   */
  static calculateFinancingCosts(data, holdingPeriod) {
    const purchasePrice = data.purchasePrice;
    const renovationCost = data.renovationCost || 0;
    
    // Utiliser les détails de financement fournis ou calculer par défaut
    if (data.financing && data.financing.total) {
      return {
        ...data.financing
      };
    }
    
    // Valeurs par défaut si le financement est fourni mais pas les coûts totaux
    if (data.financing) {
      const downPayment = data.financing.downPayment || (purchasePrice * 0.2);
      const loanAmount = purchasePrice - downPayment;
      const interestRate = data.financing.interestRate || 5; // 5% par défaut
      
      // Intérêts seulement pendant la période de détention (typique pour un FLIP)
      const monthlyInterest = (loanAmount * (interestRate / 100)) / 12;
      const totalInterest = monthlyInterest * holdingPeriod;
      
      // Frais d'établissement du prêt (généralement 1% du montant du prêt)
      const loanFees = loanAmount * 0.01;
      
      const total = totalInterest + loanFees;
      
      return {
        downPayment,
        loanAmount,
        interestRate,
        monthlyInterest,
        totalInterest,
        loanFees,
        total
      };
    }
    
    // Calcul par défaut si aucun financement n'est fourni
    const downPayment = purchasePrice * 0.2; // 20% de mise de fonds
    const loanAmount = purchasePrice - downPayment;
    const interestRate = 5; // 5% par défaut
    
    // Intérêts seulement pendant la période de détention
    const monthlyInterest = (loanAmount * (interestRate / 100)) / 12;
    const totalInterest = monthlyInterest * holdingPeriod;
    
    // Frais d'établissement du prêt
    const loanFees = loanAmount * 0.01;
    
    const total = totalInterest + loanFees;
    
    return {
      downPayment,
      loanAmount,
      interestRate,
      monthlyInterest,
      totalInterest,
      loanFees,
      total
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

module.exports = FlipDetailedCalculator;